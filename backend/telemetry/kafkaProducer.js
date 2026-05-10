/**
 * telemetry/kafkaProducer.js
 * ─────────────────────────────────────────────────────────────
 * Publishes real-time telemetry events to Kafka topics.
 * Connected to the EKS Kafka cluster.
 */

const { Kafka } = require('kafkajs');
const logger = require('../utils/logger');

const KAFKA_BROKER = process.env.KAFKA_BROKERS || 'kafka.kafka.svc.cluster.local:9092';
const KAFKA_ENABLED = process.env.KAFKA_ENABLED !== 'false';

let producer = null;
let isConnected = false;

const kafka = new Kafka({
  clientId: 'aurcc-result-portal-backend',
  brokers: KAFKA_BROKER.split(','),
  retry: {
    initialRetryTime: 3000,
    retries: 3,
  },
  connectionTimeout: 5000,
});

const TOPICS = {
  LOGIN_EVENTS:   'aurcc-login-events',
  REQUEST_EVENTS: 'aurcc-request-events',
  ERROR_EVENTS:   'aurcc-error-events',
  TRAFFIC_EVENTS: 'aurcc-traffic-events',
};

async function connectProducer() {
  if (!KAFKA_ENABLED) {
    logger.info('Kafka disabled via KAFKA_ENABLED=false');
    return;
  }

  try {
    producer = kafka.producer();
    await producer.connect();
    isConnected = true;
    logger.info('Kafka producer connected to', { broker: KAFKA_BROKER });
  } catch (err) {
    logger.warn('Kafka producer failed to connect', { error: err.message });
    isConnected = false;
  }
}

async function publish(topic, payload) {
  if (!isConnected || !producer) return;

  try {
    await producer.send({
      topic,
      messages: [{
        value: JSON.stringify({
          ...payload,
          timestamp: new Date().toISOString(),
          source: 'aurcc-result-portal',
        }),
      }],
    });
  } catch (err) {
    // Non-blocking error handling
    logger.warn('Kafka publish failed', { topic, error: err.message });
  }
}

async function publishLoginEvent(registration_no, dept, status, ip, latencyMs) {
  await publish(TOPICS.LOGIN_EVENTS, {
    type: 'LOGIN',
    registration_no,
    department: dept,
    status, // 'SUCCESS' or 'FAILURE'
    ip,
    latency_ms: latencyMs,
  });
}

async function publishRequestEvent(method, route, statusCode, latencyMs) {
  await publish(TOPICS.REQUEST_EVENTS, {
    type: 'HTTP_REQUEST',
    method,
    route,
    status_code: statusCode,
    latency_ms: latencyMs,
  });
}

module.exports = {
  connectProducer,
  publishLoginEvent,
  publishRequestEvent,
  TOPICS,
};
