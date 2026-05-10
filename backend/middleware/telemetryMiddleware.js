/**
 * middleware/telemetryMiddleware.js
 * ─────────────────────────────────────────────────────────────
 * Intercepts every request to record Prometheus metrics and 
 * publish Kafka telemetry events.
 */

const {
  totalRequests,
  totalRequestsLegacy,
  requestDuration,
  requestDurationLegacy,
  activeConnections,
  activeConnectionsLegacy,
} = require('../metrics/metrics');
const { publishRequestEvent } = require('../telemetry/kafkaProducer');

function normalizeRoute(req) {
  if (req.route) return req.route.path;
  return req.path
    .replace(/\/711[0-9]{9}/g, '/:registration_no')
    .replace(/\/[0-9]{8,}/g, '/:id')
    || req.path;
}

function telemetryMiddleware(req, res, next) {
  const start = process.hrtime.bigint();
  
  // Track active connections
  activeConnections.inc();
  activeConnectionsLegacy.inc();

  // Record metrics on finish
  res.on('finish', () => {
    activeConnections.dec();
    activeConnectionsLegacy.dec();

    const durationNs = process.hrtime.bigint() - start;
    const durationSec = Number(durationNs) / 1e9;
    const latencyMs = Number(durationNs) / 1e6;

    const route = normalizeRoute(req);
    const method = req.method;
    const statusCode = String(res.statusCode);

    // Update Prometheus Counters
    totalRequests.inc({ method, route, status_code: statusCode });
    totalRequestsLegacy.inc({ method, route, status: statusCode });

    // Update Prometheus Histograms
    requestDuration.observe({ method, route, status_code: statusCode }, durationSec);
    requestDurationLegacy.observe({ method, route, status: statusCode }, durationSec);

    // Publish to Kafka (non-blocking)
    publishRequestEvent(method, route, res.statusCode, latencyMs);
  });

  next();
}

module.exports = telemetryMiddleware;
