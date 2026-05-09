require('dotenv').config();
const express = require('express');
const cors = require('cors');
const studentRoutes = require('./routes/studentRoutes');
const logger = require('./utils/logger');
const { register, totalRequests, requestDuration, activeConnections } = require('./metrics/metrics');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
}));

app.use(express.json());

// Metrics & Logging Middleware
app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  activeConnections.inc();

  res.on('finish', () => {
    activeConnections.dec();
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    const durationSec = durationMs / 1000;
    const route = req.route ? req.route.path : req.path;

    // Prometheus Metrics
    totalRequests.inc({ method: req.method, route, status: res.statusCode });
    requestDuration.observe({ method: req.method, route, status: res.statusCode }, durationSec);

    // Request Logging: timestamp | endpoint | status | latency
    console.log(`${new Date().toISOString()} | ${req.method} ${req.originalUrl} | ${res.statusCode} | ${durationMs.toFixed(2)}ms`);
    
    logger.info('HTTP request completed', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: Number(durationMs.toFixed(1)),
    });
  });

  next();
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Prometheus Metrics Endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end(error.message);
  }
});

// Student Routes
app.use('/api', studentRoutes);

// Error Handling
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

app.use((err, req, res, next) => {
  logger.error('Unhandled backend error', { error: err.message });
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

const server = app.listen(PORT, () => {
  logger.info('AURCC Result Portal Backend running', { port: PORT });
  logger.info('Prometheus metrics endpoint available', { url: `http://localhost:${PORT}/metrics` });
});

// Graceful Shutdown
const shutdown = () => {
  logger.info('Stopping backend server...');
  server.close(() => {
    logger.info('Backend server stopped');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);


