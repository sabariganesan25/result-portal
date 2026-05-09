const { Kafka, logLevel } = require('kafkajs');
const logger = require('../utils/logger');

const REQUIRED_TOPICS = [
  'metrics-stream',
  'logs-stream',
  'events-stream',
  'scaling-stream',
  'anomaly-stream',
];

class KafkaService {
  constructor() {
    this.brokers = (process.env.KAFKA_BROKERS || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    this.clientId = process.env.KAFKA_CLIENT_ID || 'smartops-observability';
    this.groupId = process.env.KAFKA_GROUP_ID || 'smartops-observability-group';
    this.status = {
      connected: false,
      lastSuccessAt: null,
      lastError: this.brokers.length ? null : 'KAFKA_BROKERS is not configured.',
      brokers: this.brokers,
    };
    this.kafka = null;
    this.admin = null;
    this.producer = null;
    this.consumer = null;
    this.recentMessages = [];
    this.messageTimestamps = [];
    this.eventCounts = {};
    this.topics = [];
  }

  buildConfig() {
    const ssl = String(process.env.KAFKA_SSL || 'false').toLowerCase() === 'true';
    const mechanism = process.env.KAFKA_SASL_MECHANISM;
    const username = process.env.KAFKA_SASL_USERNAME;
    const password = process.env.KAFKA_SASL_PASSWORD;

    return {
      clientId: this.clientId,
      brokers: this.brokers,
      ssl,
      sasl: mechanism && username && password
        ? { mechanism, username, password }
        : undefined,
      logLevel: logLevel.NOTHING,
    };
  }

  async init() {
    if (!this.brokers.length) {
      return this.getStatus();
    }

    try {
      this.kafka = new Kafka(this.buildConfig());
      this.admin = this.kafka.admin();
      this.producer = this.kafka.producer();
      this.consumer = this.kafka.consumer({ groupId: this.groupId });

      await this.admin.connect();
      await this.producer.connect();
      await this.consumer.connect();
      await this.ensureTopics();
      await this.consumer.subscribe({ topics: REQUIRED_TOPICS, fromBeginning: false });
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          this.recordConsumedMessage({
            topic,
            partition,
            offset: message.offset,
            timestamp: message.timestamp,
            value: message.value?.toString(),
          });
        },
      });

      this.status.connected = true;
      this.status.lastError = null;
      this.status.lastSuccessAt = new Date().toISOString();
    } catch (error) {
      this.status.connected = false;
      this.status.lastError = error.message;
      logger.warn('Kafka initialization failed', { error: error.message });
    }

    return this.getStatus();
  }

  getStatus() {
    return {
      ...this.status,
      topics: this.topics,
    };
  }

  async ensureTopics() {
    await this.admin.createTopics({
      topics: REQUIRED_TOPICS.map((topic) => ({
        topic,
        numPartitions: 1,
        replicationFactor: 1,
      })),
      waitForLeaders: true,
    });

    this.topics = REQUIRED_TOPICS;
  }

  recordConsumedMessage(message) {
    const parsedTimestamp = Number(message.timestamp || Date.now());
    this.messageTimestamps.push(parsedTimestamp);
    this.messageTimestamps = this.messageTimestamps.filter((value) => value >= Date.now() - 60000);
    this.recentMessages.unshift(message);
    this.recentMessages = this.recentMessages.slice(0, 50);
    this.eventCounts[message.topic] = (this.eventCounts[message.topic] || 0) + 1;
  }

  async publishTelemetry({ metrics, logs, events, scaling, anomalies }) {
    if (!this.producer || !this.status.connected) {
      return false;
    }

    const messages = [
      ['metrics-stream', metrics],
      ['logs-stream', logs],
      ['events-stream', events],
      ['scaling-stream', scaling],
      ['anomaly-stream', anomalies],
    ].filter(([, payload]) => payload !== undefined);

    await Promise.all(messages.map(([topic, payload]) => this.producer.send({
      topic,
      messages: [{
        value: JSON.stringify({
          emittedAt: new Date().toISOString(),
          payload,
        }),
      }],
    })));

    this.status.lastSuccessAt = new Date().toISOString();
    this.status.lastError = null;
    return true;
  }

  async getConsumerLag() {
    if (!this.admin || !this.status.connected) {
      return {};
    }

    const lagByTopic = {};

    for (const topic of REQUIRED_TOPICS) {
      try {
        const latestOffsets = await this.admin.fetchTopicOffsets(topic);
        const groupOffsets = await this.admin.fetchOffsets({ groupId: this.groupId, topic });

        lagByTopic[topic] = latestOffsets.reduce((total, offset, index) => {
          const committedOffset = Number(groupOffsets[index]?.offset || 0);
          const highOffset = Number(offset.high || 0);
          return total + Math.max(highOffset - committedOffset, 0);
        }, 0);
      } catch (error) {
        lagByTopic[topic] = null;
      }
    }

    return lagByTopic;
  }

  async getSnapshot() {
    return {
      connected: this.status.connected,
      brokers: this.brokers,
      topics: this.topics.length ? this.topics : REQUIRED_TOPICS,
      recentMessages: this.recentMessages,
      throughputPerMinute: this.messageTimestamps.length,
      eventCounts: this.eventCounts,
      consumerLag: await this.getConsumerLag(),
      lastSuccessAt: this.status.lastSuccessAt,
      lastError: this.status.lastError,
    };
  }
}

module.exports = KafkaService;
