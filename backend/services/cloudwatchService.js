const {
  CloudWatchLogsClient,
  FilterLogEventsCommand,
} = require('@aws-sdk/client-cloudwatch-logs');
const { detectSeverity } = require('../utils/resourceUtils');
const logger = require('../utils/logger');

class CloudWatchService {
  constructor() {
    this.region = process.env.AWS_REGION || 'ap-south-1';
    this.clusterName = process.env.EKS_CLUSTER_NAME || 'aurcc-portal-cluster';
    this.logGroups = (process.env.SMARTOPS_CLOUDWATCH_LOG_GROUPS
      || `/aws/containerinsights/${this.clusterName}/application`)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    this.limit = Number(process.env.SMARTOPS_CLOUDWATCH_LOG_LIMIT || 100);
    this.lookbackMs = Number(process.env.SMARTOPS_LOG_LOOKBACK_MS || 300000);
    this.client = new CloudWatchLogsClient({ region: this.region });
    this.status = {
      connected: false,
      lastSuccessAt: null,
      lastError: null,
      logGroups: this.logGroups,
    };
    this.lastFetchTime = Date.now() - this.lookbackMs;
    this.seenEventIds = new Set();
  }

  async init() {
    try {
      await this.fetchRecentLogs();
    } catch (error) {
      logger.warn('CloudWatch initialization failed', { error: error.message });
    }

    return this.getStatus();
  }

  getStatus() {
    return { ...this.status };
  }

  normalizeLogEvent(groupName, event) {
    const logStream = event.logStreamName || 'unknown';
    const streamParts = logStream.split('/');
    const serviceName = streamParts[streamParts.length - 2] || streamParts[0] || groupName;
    const podName = streamParts[streamParts.length - 1] || 'unknown';

    return {
      id: event.eventId,
      timestamp: new Date(event.timestamp || Date.now()).toISOString(),
      severity: detectSeverity(event.message),
      service: serviceName,
      pod: podName,
      message: event.message || '',
      logGroup: groupName,
      logStream,
    };
  }

  async fetchRecentLogs() {
    if (!this.logGroups.length) {
      this.status.lastError = 'No CloudWatch log groups configured.';
      return { connected: false, logs: [] };
    }

    const startTime = Math.max(this.lastFetchTime - 3000, Date.now() - this.lookbackMs);
    const allLogs = [];

    for (const groupName of this.logGroups) {
      try {
        const response = await this.client.send(new FilterLogEventsCommand({
          logGroupName: groupName,
          startTime,
          limit: this.limit,
          interleaved: true,
        }));

        for (const event of response.events || []) {
          if (event.eventId && this.seenEventIds.has(event.eventId)) {
            continue;
          }

          if (event.eventId) {
            this.seenEventIds.add(event.eventId);
          }

          allLogs.push(this.normalizeLogEvent(groupName, event));
        }

        this.status.connected = true;
        this.status.lastSuccessAt = new Date().toISOString();
        this.status.lastError = null;
      } catch (error) {
        this.status.connected = false;
        this.status.lastError = error.message;
        logger.warn('CloudWatch log fetch failed', { logGroup: groupName, error: error.message });
      }
    }

    this.lastFetchTime = Date.now();

    return {
      connected: this.status.connected,
      logs: allLogs
        .sort((left, right) => new Date(right.timestamp) - new Date(left.timestamp))
        .slice(0, this.limit),
    };
  }
}

module.exports = CloudWatchService;
