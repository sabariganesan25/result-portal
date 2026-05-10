const jwt = require('jsonwebtoken');
const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const dynamoClient = require('../config/dynamoClient');
const { 
  loginRequests, 
  loginRequestsLegacy,
  failedLogins, 
  failedLoginsLegacy,
  resultRequests, 
  resultRequestsLegacy,
  loginDuration,
  dynamoLatency,
  activeSessions
} = require('../metrics/metrics');
const { publishLoginEvent } = require('../telemetry/kafkaProducer');

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'students-results';

// POST /api/login
const loginStudent = async (req, res) => {
  const loginTimer = loginDuration.startTimer();
  const start = Date.now();
  
  try {
    const { registration_no, password } = req.body;

    if (!registration_no || !password) {
      failedLogins.inc();
      failedLoginsLegacy.inc();
      return res.status(400).json({ success: false, message: 'Registration number and password are required.' });
    }

    const dbStart = Date.now();
    const result = await dynamoClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { registration_no },
    }));
    dynamoLatency.set({ operation: 'get_student' }, Date.now() - dbStart);

    const student = result.Item;

    if (!student) {
      loginRequests.inc({ status: 'failure' });
      loginRequestsLegacy.inc();
      failedLogins.inc();
      failedLoginsLegacy.inc();
      
      const latencyMs = loginTimer() * 1000;
      await publishLoginEvent(registration_no, 'UNKNOWN', 'FAILURE', req.ip, latencyMs);
      
      return res.status(404).json({ success: false, message: 'Student not found. Check your registration number.' });
    }

    if (student.password !== password) {
      loginRequests.inc({ status: 'failure' });
      loginRequestsLegacy.inc();
      failedLogins.inc();
      failedLoginsLegacy.inc();
      
      const latencyMs = loginTimer() * 1000;
      await publishLoginEvent(registration_no, student.department || 'UNKNOWN', 'FAILURE', req.ip, latencyMs);
      
      return res.status(401).json({ success: false, message: 'Invalid password.' });
    }

    // Login Success
    loginRequests.inc({ status: 'success' });
    loginRequestsLegacy.inc();
    
    // Track Active Session
    activeSessions.set(registration_no, {
      loginTime: Date.now(),
      dept: student.department,
    });

    const latencyMs = loginTimer() * 1000;
    await publishLoginEvent(registration_no, student.department, 'SUCCESS', req.ip, latencyMs);

    // Generate JWT
    const token = jwt.sign(
      { registration_no: student.registration_no, name: student.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    const { password: _, results: __, ...profile } = student;

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      student: profile,
    });
  } catch (err) {
    loginTimer();
    failedLogins.inc();
    failedLoginsLegacy.inc();
    console.error(`[LOGIN ERROR] ${err.message}`);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/student/:registration_no
const getStudent = async (req, res) => {
  try {
    const { registration_no } = req.params;

    const result = await dynamoClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { registration_no },
    }));

    if (!result.Item) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const { password, ...student } = result.Item;
    return res.json({ success: true, student });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/results/:registration_no
const getResults = async (req, res) => {
  const { registration_no } = req.params;

  try {
    const result = await dynamoClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { registration_no },
    }));

    if (!result.Item) {
      return res.status(404).json({ success: false, message: 'No results found for this student.' });
    }

    // Record Result Fetch Metric
    resultRequests.inc({ department: result.Item.department || 'UNKNOWN' });
    resultRequestsLegacy.inc({ registration_no });

    const results = result.Item.results || [];

    return res.json({
      success: true,
      registration_no,
      name: result.Item.name,
      department: result.Item.department,
      cgpa: result.Item.cgpa,
      results,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { loginStudent, getStudent, getResults };

