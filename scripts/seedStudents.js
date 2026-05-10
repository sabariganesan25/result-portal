/**
 * scripts/seedStudents.js
 * ─────────────────────────────────────────────────────────────
 * Generates 500 realistic students and inserts them into DynamoDB.
 * Matches the existing schema (partition key: registration_no).
 *
 * Usage:
 *   cd result-portal
 *   node scripts/seedStudents.js
 *
 * Environment variables (reads from backend/.env automatically):
 *   AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, DYNAMODB_TABLE
 */

const path = require('path');
const fs = require('fs');

// Load .env from the backend folder so AWS creds are available
require('dotenv').config({ path: path.resolve(__dirname, '..', 'backend', '.env') });

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');

// ── AWS client ───────────────────────────────────────────────
const rawClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const dynamo = DynamoDBDocumentClient.from(rawClient, {
  marshallOptions: { removeUndefinedValues: true },
});

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'students-results';

// ── Reference data ───────────────────────────────────────────
const DEPARTMENTS = [
  { name: 'Computer Science and Engineering', code: '104', abbr: 'CSE' },
  { name: 'Electronics and Communication Engineering', code: '105', abbr: 'ECE' },
  { name: 'Electrical and Electronics Engineering', code: '106', abbr: 'EEE' },
  { name: 'Mechanical Engineering', code: '107', abbr: 'MECH' },
  { name: 'Civil Engineering', code: '108', abbr: 'CIVIL' },
  { name: 'Information Technology', code: '103', abbr: 'IT' },
  { name: 'Artificial Intelligence and Data Science', code: '109', abbr: 'AIDS' },
];

const FIRST_NAMES = [
  'Arun', 'Arjun', 'Priya', 'Sneha', 'Karthik', 'Divya', 'Rahul', 'Meena',
  'Vijay', 'Kavya', 'Suresh', 'Lakshmi', 'Ganesh', 'Anjali', 'Deepak',
  'Nithya', 'Santhosh', 'Revathi', 'Prakash', 'Dharani', 'Harish', 'Pavithra',
  'Mohan', 'Saranya', 'Rajesh', 'Swathi', 'Manoj', 'Keerthana', 'Venkat',
  'Pooja', 'Surya', 'Varsha', 'Ashwin', 'Gayathri', 'Dinesh', 'Ranjani',
  'Srinivas', 'Thenmozhi', 'Naveen', 'Anitha', 'Balaji', 'Shalini', 'Gopal',
  'Janani', 'Hari', 'Madhu', 'Akash', 'Sowmya', 'Vignesh', 'Bhuvana',
];

const LAST_NAMES = [
  'Kumar', 'Nair', 'Raj', 'Devi', 'Shankar', 'Lakshmi', 'Prasad', 'Kumari',
  'Anand', 'Mohan', 'Rajan', 'Krishnan', 'Subramaniam', 'Pillai', 'Reddy',
  'Iyer', 'Menon', 'Naidu', 'Sharma', 'Pandey', 'Murugan', 'Selvam',
  'Babu', 'Nathan', 'Sunder', 'Ravi', 'Venkatesh', 'Jeyakumar', 'Mani',
];

// Subjects by department
const DEPT_SUBJECTS = {
  CSE: [
    { code: 'CS311', name: 'Artificial Intelligence', credits: 3 },
    { code: 'CS312', name: 'Compiler Design', credits: 4 },
    { code: 'CS313', name: 'Distributed Systems', credits: 3 },
    { code: 'CS314', name: 'Mobile Computing', credits: 3 },
    { code: 'CS315', name: 'Cryptography and Network Security', credits: 3 },
    { code: 'AI301', name: 'AI Web Lab', credits: 2 },
    { code: 'CD301', name: 'Compiler Lab', credits: 2 },
    { code: 'MP301', name: 'Mini Project', credits: 2 },
  ],
  ECE: [
    { code: 'EC311', name: 'VLSI Design', credits: 3 },
    { code: 'EC312', name: 'Digital Signal Processing', credits: 4 },
    { code: 'EC313', name: 'Embedded Systems', credits: 3 },
    { code: 'EC314', name: 'Wireless Communication', credits: 3 },
    { code: 'EC315', name: 'Optical Fiber Communication', credits: 3 },
    { code: 'VL301', name: 'VLSI Lab', credits: 2 },
    { code: 'ES301', name: 'Embedded Systems Lab', credits: 2 },
    { code: 'MP301', name: 'Mini Project', credits: 2 },
  ],
  EEE: [
    { code: 'EE311', name: 'Power Electronics', credits: 3 },
    { code: 'EE312', name: 'Electric Drives', credits: 4 },
    { code: 'EE313', name: 'High Voltage Engineering', credits: 3 },
    { code: 'EE314', name: 'Power System Analysis', credits: 3 },
    { code: 'EE315', name: 'Control Systems', credits: 3 },
    { code: 'PE301', name: 'Power Electronics Lab', credits: 2 },
    { code: 'CS301', name: 'Control Systems Lab', credits: 2 },
    { code: 'MP301', name: 'Mini Project', credits: 2 },
  ],
  MECH: [
    { code: 'ME311', name: 'Heat Transfer', credits: 3 },
    { code: 'ME312', name: 'Turbomachinery', credits: 4 },
    { code: 'ME313', name: 'Machine Design', credits: 3 },
    { code: 'ME314', name: 'Metrology and Measurements', credits: 3 },
    { code: 'ME315', name: 'Industrial Engineering', credits: 3 },
    { code: 'HT301', name: 'Heat Transfer Lab', credits: 2 },
    { code: 'MD301', name: 'Machine Design Lab', credits: 2 },
    { code: 'MP301', name: 'Mini Project', credits: 2 },
  ],
  CIVIL: [
    { code: 'CE311', name: 'Structural Analysis', credits: 3 },
    { code: 'CE312', name: 'Geotechnical Engineering', credits: 4 },
    { code: 'CE313', name: 'Transportation Engineering', credits: 3 },
    { code: 'CE314', name: 'Environmental Engineering', credits: 3 },
    { code: 'CE315', name: 'Hydraulics and Fluid Mechanics', credits: 3 },
    { code: 'SA301', name: 'Structural Lab', credits: 2 },
    { code: 'GT301', name: 'Geotech Lab', credits: 2 },
    { code: 'MP301', name: 'Mini Project', credits: 2 },
  ],
  IT: [
    { code: 'IT311', name: 'Cloud Computing', credits: 3 },
    { code: 'IT312', name: 'Big Data Analytics', credits: 4 },
    { code: 'IT313', name: 'Internet of Things', credits: 3 },
    { code: 'IT314', name: 'Machine Learning', credits: 3 },
    { code: 'IT315', name: 'Cyber Security', credits: 3 },
    { code: 'CC301', name: 'Cloud Lab', credits: 2 },
    { code: 'ML301', name: 'ML Lab', credits: 2 },
    { code: 'MP301', name: 'Mini Project', credits: 2 },
  ],
  AIDS: [
    { code: 'AD311', name: 'Deep Learning', credits: 3 },
    { code: 'AD312', name: 'Natural Language Processing', credits: 4 },
    { code: 'AD313', name: 'Data Visualization', credits: 3 },
    { code: 'AD314', name: 'Reinforcement Learning', credits: 3 },
    { code: 'AD315', name: 'Big Data Technologies', credits: 3 },
    { code: 'DL301', name: 'Deep Learning Lab', credits: 2 },
    { code: 'NL301', name: 'NLP Lab', credits: 2 },
    { code: 'MP301', name: 'Mini Project', credits: 2 },
  ],
};

const GRADES = ['S', 'A', 'B', 'C', 'D'];
const GRADE_WEIGHTS = [0.25, 0.30, 0.25, 0.15, 0.05]; // probability distribution

function pickGrade() {
  const r = Math.random();
  let cumulative = 0;
  for (let i = 0; i < GRADES.length; i++) {
    cumulative += GRADE_WEIGHTS[i];
    if (r <= cumulative) return GRADES[i];
  }
  return 'B';
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDOB() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(randomInt(1, 28)).padStart(2, '0');
  const month = months[randomInt(0, 11)];
  const year = randomInt(2002, 2004);
  return `${day}-${month}-${year}`;
}

function generateResults(deptAbbr) {
  const subjects = DEPT_SUBJECTS[deptAbbr] || DEPT_SUBJECTS.CSE;
  return subjects.map((subj) => {
    const grade = pickGrade();
    const isLab = subj.credits <= 2;
    const internalMax = isLab ? 50 : 40;
    const externalMax = isLab ? 50 : 60;

    const internal = randomInt(Math.floor(internalMax * 0.5), internalMax);
    const external = randomInt(Math.floor(externalMax * 0.5), externalMax);

    return {
      semester: 6,
      subject_code: subj.code,
      subject_name: subj.name,
      internal_marks: internal,
      external_marks: external,
      grade,
      credits: subj.credits,
    };
  });
}

function classifyByCGPA(cgpa) {
  if (cgpa >= 8.5) return 'First Class with Distinction';
  if (cgpa >= 6.5) return 'First Class';
  if (cgpa >= 5.0) return 'Second Class';
  return 'Pass';
}

// ── Generate one student ─────────────────────────────────────
function generateStudent(index, dept) {
  const regNo = `71152${dept.code}${String(index).padStart(3, '0')}`;
  const firstName = FIRST_NAMES[index % FIRST_NAMES.length];
  const lastName = LAST_NAMES[index % LAST_NAMES.length];
  const name = `${firstName} ${lastName}`;
  const password = `pass${regNo.slice(-4)}`; // e.g. pass0001
  const cgpa = parseFloat((Math.random() * 3.5 + 6.0).toFixed(2)); // 6.00–9.50
  const arrears = cgpa >= 8.0 ? 0 : randomInt(0, 3);
  const rank = randomInt(1, 200);
  const results = generateResults(dept.abbr);

  return {
    registration_no: regNo,
    name,
    password,
    department: dept.name,
    batch: '2021-2025',
    degree: 'B.Tech',
    dob: randomDOB(),
    cgpa,
    rank,
    arrears,
    classification: classifyByCGPA(cgpa),
    results,
  };
}

// ── Main seed function ───────────────────────────────────────
async function seedStudents() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   AURCC Result Portal — 500-Student Seeder  ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log(`\n  Table : ${TABLE_NAME}`);
  console.log(`  Region: ${process.env.AWS_REGION || 'ap-south-1'}\n`);

  // Generate all students
  const allStudents = [];
  let globalIndex = 1;

  for (const dept of DEPARTMENTS) {
    const count = dept.abbr === 'CSE' || dept.abbr === 'AIDS' ? 80 : 68;
    for (let i = 0; i < count; i++) {
      allStudents.push(generateStudent(globalIndex, dept));
      globalIndex++;
    }
  }

  console.log(`  Generated ${allStudents.length} students across ${DEPARTMENTS.length} departments\n`);

  // Write in batches of 25 (DynamoDB BatchWrite limit)
  const BATCH_SIZE = 25;
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < allStudents.length; i += BATCH_SIZE) {
    const batch = allStudents.slice(i, i + BATCH_SIZE);

    const params = {
      RequestItems: {
        [TABLE_NAME]: batch.map((student) => ({
          PutRequest: { Item: student },
        })),
      },
    };

    try {
      await dynamo.send(new BatchWriteCommand(params));
      successCount += batch.length;

      // Progress bar
      const pct = ((successCount / allStudents.length) * 100).toFixed(0);
      const bar = '█'.repeat(Math.floor(pct / 2)) + '░'.repeat(50 - Math.floor(pct / 2));
      process.stdout.write(`\r  [${bar}] ${pct}%  (${successCount}/${allStudents.length})`);
    } catch (err) {
      failCount += batch.length;
      console.error(`\n  ❌ Batch ${i}–${i + BATCH_SIZE} failed: ${err.message}`);
    }

    // Small delay to avoid DynamoDB throttling
    await new Promise((r) => setTimeout(r, 150));
  }

  console.log('\n');
  console.log('  ═══════════════════════════════════════════');
  console.log(`  ✅ Success: ${successCount}`);
  console.log(`  ❌ Failed:  ${failCount}`);
  console.log('  ═══════════════════════════════════════════');

  // Print sample credentials
  console.log('\n  Sample credentials (first 10):');
  console.log('  ┌──────────────────┬──────────────┬─────────────────────────┐');
  console.log('  │ Registration No  │ Password     │ Department              │');
  console.log('  ├──────────────────┼──────────────┼─────────────────────────┤');
  allStudents.slice(0, 10).forEach((s) => {
    const regPad = s.registration_no.padEnd(16);
    const pwdPad = s.password.padEnd(12);
    const deptPad = s.department.substring(0, 23).padEnd(23);
    console.log(`  │ ${regPad} │ ${pwdPad} │ ${deptPad} │`);
  });
  console.log('  └──────────────────┴──────────────┴─────────────────────────┘');

  // Save credential list for k6 load test
  const credentials = allStudents.map((s) => ({
    registration_no: s.registration_no,
    password: s.password,
  }));

  const credPath = path.resolve(__dirname, 'student_credentials.json');
  fs.writeFileSync(credPath, JSON.stringify(credentials, null, 2));
  console.log(`\n  📄 Credential list saved to: ${credPath}`);
  console.log('  Use this file in your k6 load test.\n');
}

seedStudents().catch((err) => {
  console.error('\n❌ Seed failed:', err.message);
  process.exit(1);
});
