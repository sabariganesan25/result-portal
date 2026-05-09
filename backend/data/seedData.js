require('dotenv').config();
const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { DynamoDBClient, CreateTableCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');
const dynamoClient = require('../config/dynamoClient');
const students = require('./sampleStudents.json');

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'students-results';

const rawClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function ensureTableExists() {
  try {
    await rawClient.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
    console.log(`✅ Table "${TABLE_NAME}" already exists.`);
  } catch (err) {
    if (err.name === 'ResourceNotFoundException') {
      console.log(`⚙️  Creating table "${TABLE_NAME}"...`);
      await rawClient.send(new CreateTableCommand({
        TableName: TABLE_NAME,
        AttributeDefinitions: [{ AttributeName: 'registration_no', AttributeType: 'S' }],
        KeySchema: [{ AttributeName: 'registration_no', KeyType: 'HASH' }],
        BillingMode: 'PAY_PER_REQUEST',
      }));
      // Wait for table to be active
      await new Promise(r => setTimeout(r, 5000));
      console.log(`✅ Table "${TABLE_NAME}" created.`);
    } else {
      throw err;
    }
  }
}

async function seedStudents() {
  await ensureTableExists();

  console.log(`\n📦 Seeding ${students.length} student records...\n`);
  for (const student of students) {
    await dynamoClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: student,
    }));
    console.log(`  ✅ Inserted: ${student.registration_no} — ${student.name}`);
  }
  console.log('\n🎉 Seeding complete!');
}

seedStudents().catch(err => {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
});
