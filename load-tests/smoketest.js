/**
 * load-tests/smoketest.js
 * ─────────────────────────────────────────────────────────────
 * A quick 5-user test to verify the backend and credentials.
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '30s',
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5000';

// Fallback test students
const TEST_STUDENTS = [
  { registration_no: '711521104001', password: 'arjun001' },
  { registration_no: '711521104002', password: 'priya002' },
];

export default function () {
  const student = TEST_STUDENTS[Math.floor(Math.random() * TEST_STUDENTS.length)];

  const res = http.post(
    `${BASE_URL}/api/login`,
    JSON.stringify(student),
    { headers: { 'Content-Type': 'application/json' } }
  );

  console.log(`Status=${res.status} RegNo=${student.registration_no} Latency=${res.timings.duration}ms`);

  check(res, {
    'response status is 200': (r) => r.status === 200,
    'token received': (r) => r.json().token !== undefined,
  });

  sleep(1);
}
