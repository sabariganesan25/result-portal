/**
 * metrics/metrics.js
 * ─────────────────────────────────────────────────────────────
 * Single source of truth for ALL Prometheus metrics.
 * Enhanced with login-specific metrics, active user tracking,
 * DynamoDB latency, and aurcc_ prefix for clear identification.
 */

const { collectDefaultMetrics, Registry, Counter, Histogram, Gauge } = require('prom-client');

const register = new Registry();

// Collect default Node.js metrics (CPU, memory, heap, GC, event-loop lag)
collectDefaultMetrics({
  register,
  prefix: 'aurcc_',
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
});

// ── COUNTER: Total HTTP requests ─────────────────────────────
const totalRequests = new Counter({
  name: 'aurcc_http_requests_total',
  help: 'Total number of HTTP requests received by the Result Portal',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// ── Backward compat alias (prometheusService queries use 'total_requests') ─
const totalRequestsLegacy = new Counter({
  name: 'total_requests',
  help: 'Total HTTP requests (legacy name for backward compatibility)',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

// ── COUNTER: Login attempts ──────────────────────────────────
const loginRequests = new Counter({
  name: 'aurcc_login_requests_total',
  help: 'Total login attempts on the Result Portal',
  labelNames: ['status'], // 'success' or 'failure'
  registers: [register],
});

// Legacy alias
const loginRequestsLegacy = new Counter({
  name: 'login_requests_total',
  help: 'Total login attempts (legacy name)',
  registers: [register],
});

// ── COUNTER: Failed logins ───────────────────────────────────
const failedLogins = new Counter({
  name: 'aurcc_login_failures_total',
  help: 'Total failed login attempts (wrong password or student not found)',
  registers: [register],
});

// Legacy alias
const failedLoginsLegacy = new Counter({
  name: 'failed_logins_total',
  help: 'Total failed logins (legacy name)',
  registers: [register],
});

// ── COUNTER: Result fetch requests ───────────────────────────
const resultRequests = new Counter({
  name: 'aurcc_result_fetches_total',
  help: 'Total number of result page fetch requests',
  labelNames: ['department'],
  registers: [register],
});

// Legacy alias
const resultRequestsLegacy = new Counter({
  name: 'result_requests_total',
  help: 'Total result fetches (legacy name)',
  labelNames: ['registration_no'],
  registers: [register],
});

// ── GAUGE: Active users (logged-in sessions) ─────────────────
// Tracks real logged-in students via in-memory session map
const activeUsersGauge = new Gauge({
  name: 'aurcc_active_users',
  help: 'Number of students currently logged in (active sessions)',
  registers: [register],
  collect() {
    this.set(activeSessions.size);
  },
});

// ── GAUGE: Active HTTP connections ───────────────────────────
const activeConnections = new Gauge({
  name: 'aurcc_active_http_connections',
  help: 'Number of active HTTP connections being processed right now',
  registers: [register],
});

// Legacy alias
const activeConnectionsLegacy = new Gauge({
  name: 'active_connections',
  help: 'Number of active connections (legacy name)',
  registers: [register],
});

// ── HISTOGRAM: Request duration ──────────────────────────────
const requestDuration = new Histogram({
  name: 'aurcc_request_duration_seconds',
  help: 'HTTP request duration in seconds for the Result Portal',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

// Legacy alias
const requestDurationLegacy = new Histogram({
  name: 'request_duration_seconds',
  help: 'HTTP request duration (legacy name)',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5],
  registers: [register],
});

// ── HISTOGRAM: Login duration ────────────────────────────────
const loginDuration = new Histogram({
  name: 'aurcc_login_duration_seconds',
  help: 'Time taken to process a login request including DynamoDB lookup',
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
  registers: [register],
});

// ── GAUGE: DynamoDB operation latency ────────────────────────
const dynamoLatency = new Gauge({
  name: 'aurcc_dynamodb_latency_ms',
  help: 'Last DynamoDB operation latency in milliseconds',
  labelNames: ['operation'],
  registers: [register],
});

// ── In-memory session store ──────────────────────────────────
// Tracks active student sessions: registration_no → { loginTime, dept }
const activeSessions = new Map();

// Auto-expire sessions older than 30 minutes
setInterval(() => {
  const cutoff = Date.now() - 30 * 60 * 1000;
  for (const [regNo, session] of activeSessions) {
    if (session.loginTime < cutoff) {
      activeSessions.delete(regNo);
    }
  }
}, 60 * 1000);

module.exports = {
  register,
  // New prefixed metrics
  totalRequests,
  loginRequests,
  failedLogins,
  resultRequests,
  activeConnections,
  requestDuration,
  loginDuration,
  dynamoLatency,
  activeUsersGauge,
  activeSessions,
  // Legacy aliases (keep backward compat with existing prometheusService queries)
  totalRequestsLegacy,
  loginRequestsLegacy,
  failedLoginsLegacy,
  resultRequestsLegacy,
  activeConnectionsLegacy,
  requestDurationLegacy,
};
