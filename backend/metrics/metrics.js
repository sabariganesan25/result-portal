const { collectDefaultMetrics, Registry, Counter, Histogram, Gauge } = require('prom-client');

const register = new Registry();

// Collect default Node.js metrics (CPU, memory, etc.)
collectDefaultMetrics({ register });

// --- Custom Metrics ---

const totalRequests = new Counter({
  name: 'total_requests',
  help: 'Total number of HTTP requests received',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

const loginRequests = new Counter({
  name: 'login_requests_total',
  help: 'Total number of login attempts',
  registers: [register],
});

const resultRequests = new Counter({
  name: 'result_requests_total',
  help: 'Total number of result fetch requests',
  labelNames: ['registration_no'],
  registers: [register],
});

const failedLogins = new Counter({
  name: 'failed_logins_total',
  help: 'Total number of failed login attempts',
  registers: [register],
});

const requestDuration = new Histogram({
  name: 'request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5],
  registers: [register],
});

const activeConnections = new Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
  registers: [register],
});

module.exports = {
  register,
  totalRequests,
  loginRequests,
  resultRequests,
  failedLogins,
  requestDuration,
  activeConnections,
};
