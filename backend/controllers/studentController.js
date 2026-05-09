const jwt = require('jsonwebtoken');
const { GetCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const dynamoClient = require('../config/dynamoClient');
const { loginRequests, failedLogins, resultRequests } = require('../metrics/metrics');

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'students-results';

// POST /api/login
const loginStudent = async (req, res) => {
  const start = Date.now();
  loginRequests.inc();

  try {
    const { registration_no, password } = req.body;

    if (!registration_no || !password) {
      failedLogins.inc();
      return res.status(400).json({ success: false, message: 'Registration number and password are required.' });
    }

    const result = await dynamoClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { registration_no },
    }));

    const student = result.Item;

    if (!student) {
      failedLogins.inc();
      console.log(`${new Date().toISOString()} | POST /api/login | 404 | ${Date.now() - start}ms | regNo=${registration_no}`);
      return res.status(404).json({ success: false, message: 'Student not found. Check your registration number.' });
    }

    if (student.password !== password) {
      failedLogins.inc();
      console.log(`${new Date().toISOString()} | POST /api/login | 401 | ${Date.now() - start}ms | regNo=${registration_no}`);
      return res.status(401).json({ success: false, message: 'Invalid password.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { registration_no: student.registration_no, name: student.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Return profile without password and results
    const { password: _, results: __, ...profile } = student;

    console.log(`${new Date().toISOString()} | POST /api/login | 200 | ${Date.now() - start}ms | regNo=${registration_no}`);
    return res.json({
      success: true,
      message: 'Login successful',
      token,
      student: profile,
    });
  } catch (err) {
    failedLogins.inc();
    console.error(`${new Date().toISOString()} | POST /api/login | 500 | ${Date.now() - start}ms | error=${err.message}`);
    return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

// GET /api/student/:registration_no
const getStudent = async (req, res) => {
  const start = Date.now();
  try {
    const { registration_no } = req.params;

    const result = await dynamoClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { registration_no },
    }));

    if (!result.Item) {
      console.log(`${new Date().toISOString()} | GET /api/student/${registration_no} | 404 | ${Date.now() - start}ms`);
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const { password, ...student } = result.Item;

    console.log(`${new Date().toISOString()} | GET /api/student/${registration_no} | 200 | ${Date.now() - start}ms`);
    return res.json({ success: true, student });
  } catch (err) {
    console.error(`${new Date().toISOString()} | GET /api/student | 500 | ${Date.now() - start}ms | error=${err.message}`);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/results/:registration_no
const getResults = async (req, res) => {
  const start = Date.now();
  const { registration_no } = req.params;
  resultRequests.inc({ registration_no });

  try {
    const result = await dynamoClient.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { registration_no },
    }));

    if (!result.Item) {
      console.log(`${new Date().toISOString()} | GET /api/results/${registration_no} | 404 | ${Date.now() - start}ms`);
      return res.status(404).json({ success: false, message: 'No results found for this student.' });
    }

    const results = result.Item.results || [];

    console.log(`${new Date().toISOString()} | GET /api/results/${registration_no} | 200 | ${Date.now() - start}ms`);
    return res.json({
      success: true,
      registration_no,
      name: result.Item.name,
      department: result.Item.department,
      cgpa: result.Item.cgpa,
      results,
    });
  } catch (err) {
    console.error(`${new Date().toISOString()} | GET /api/results | 500 | ${Date.now() - start}ms | error=${err.message}`);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { loginStudent, getStudent, getResults };
