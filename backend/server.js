require('dotenv').config();
const express = require('express');
const cors = require('cors');
const studentRoutes = require('./routes/studentRoutes');
const logger = require('./utils/logger');

// Import Telemetry
const { register, activeSessions } = require('./metrics/metrics');
const { connectProducer } = require('./telemetry/kafkaProducer');
const telemetryMiddleware = require('./middleware/telemetryMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;


// CORS configuration
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
}));

app.use(express.json());

// Apply telemetry to every request
app.use(telemetryMiddleware);

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

async function startServer() {
  // Connect Kafka producer before accepting traffic
  await connectProducer();

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
}

startServer().catch(err => {
  logger.error('Failed to start server', { error: err.message });
  process.exit(1);
});



