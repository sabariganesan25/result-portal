const logger = require('../utils/logger');

class MetricsAggregator {
  constructor({
    kubernetesService,
    prometheusService,
    kafkaService,
    cloudwatchService,
    websocketService,
    pollIntervalMs = 5000,
  }) {
    this.kubernetesService = kubernetesService;
    this.prometheusService = prometheusService;
    this.kafkaService = kafkaService;
    this.cloudwatchService = cloudwatchService;
    this.websocketService = websocketService;
    this.pollIntervalMs = pollIntervalMs;
    this.intervalRef = null;
    this.inFlight = null;
    this.latestSnapshot = null;
  }

  async initializeServices() {
    await Promise.allSettled([
      this.kubernetesService.init(),
      this.prometheusService.init(),
      this.kafkaService.init(),
      this.cloudwatchService.init(),
    ]);
  }

  buildOverview(kubernetes, metrics) {
    const summary = kubernetes?.summary || {};
    const metricOverview = metrics?.overview || {};

    return {
      clusterStatus: summary.clusterStatus || 'UNKNOWN',
      totalPods: summary.totalPods || 0,
      runningPods: summary.runningPods || 0,
      cpuUsagePercent: metricOverview.cpuUsagePercent,
      memoryUsagePercent: metricOverview.memoryUsagePercent,
      requestsPerSecond: metricOverview.requestsPerSecond,
      errorRatePercent: metricOverview.errorRatePercent,
      currentReplicas: metricOverview.hpaCurrentReplicas,
      desiredReplicas: metricOverview.hpaDesiredReplicas,
      hpaStatus: (kubernetes?.hpas || []).length ? 'ACTIVE' : 'NOT_CONFIGURED',
      httpLatencyP95Ms: metricOverview.httpLatencyP95Ms,
      activeUsers: metricOverview.activeUsers,
      networkReceiveBytesPerSec: metricOverview.networkReceiveBytesPerSec,
      networkTransmitBytesPerSec: metricOverview.networkTransmitBytesPerSec,
      podRestarts: metricOverview.podRestarts,
    };
  }

  deriveAutoscaling(kubernetes, metrics) {
    const scalingEvents = (kubernetes?.events || []).filter((event) => (
      ['SuccessfulRescale', 'ScalingReplicaSet', 'FailedGetResourceMetric', 'NotTriggerScaleUp'].includes(event.reason)
    ));

    return {
      hpas: kubernetes?.hpas || [],
      currentReplicas: metrics?.overview?.hpaCurrentReplicas ?? null,
      desiredReplicas: metrics?.overview?.hpaDesiredReplicas ?? null,
      scalingEvents,
      scalingHistory: scalingEvents.slice(0, 10),
    };
  }

  deriveAnomalies(kubernetes, metrics) {
    const anomalies = [];
    const summary = kubernetes?.summary || {};
    const overview = metrics?.overview || {};

    if ((summary.pendingPods || 0) > 0) {
      anomalies.push({
        type: 'PENDING_PODS',
        severity: 'WARN',
        message: `${summary.pendingPods} pod(s) are pending scheduling.`,
      });
    }

    if ((summary.readyNodes || 0) === 0) {
      anomalies.push({
        type: 'NO_READY_NODES',
        severity: 'ERROR',
        message: 'The cluster currently has no ready nodes.',
      });
    }

    if (overview.cpuUsagePercent !== null && overview.cpuUsagePercent > 85) {
      anomalies.push({
        type: 'HIGH_CPU',
        severity: 'WARN',
        message: `Cluster CPU is elevated at ${overview.cpuUsagePercent}%.`,
      });
    }

    if (overview.errorRatePercent !== null && overview.errorRatePercent > 5) {
      anomalies.push({
        type: 'HIGH_ERROR_RATE',
        severity: 'ERROR',
        message: `HTTP error rate is ${overview.errorRatePercent}%.`,
      });
    }

    return anomalies;
  }

  getConnectionStatus() {
    return {
      kubernetes: this.kubernetesService.getStatus(),
      prometheus: this.prometheusService.getStatus(),
      kafka: this.kafkaService.getStatus(),
      cloudwatch: this.cloudwatchService.getStatus(),
      websocket: this.websocketService.getStatus(),
    };
  }

  async collectNow() {
    if (this.inFlight) {
      return this.inFlight;
    }

    this.inFlight = (async () => {
      const generatedAt = new Date().toISOString();

      const [kubernetesResult, metricsResult, logsResult] = await Promise.allSettled([
        this.kubernetesService.getSnapshot(),
        this.prometheusService.fetchSnapshot(),
        this.cloudwatchService.fetchRecentLogs(),
      ]);

      const kubernetes = kubernetesResult.status === 'fulfilled' ? kubernetesResult.value : null;
      const metrics = metricsResult.status === 'fulfilled' ? metricsResult.value : null;
      const logs = logsResult.status === 'fulfilled' ? logsResult.value?.logs || [] : [];
      const autoscaling = this.deriveAutoscaling(kubernetes, metrics);
      const anomalies = this.deriveAnomalies(kubernetes, metrics);

      await Promise.allSettled([
        this.kafkaService.publishTelemetry({
          metrics,
          logs: logs.slice(0, 25),
          events: (kubernetes?.events || []).slice(0, 25),
          scaling: autoscaling.scalingEvents,
          anomalies,
        }),
      ]);

      const kafkaSnapshot = await this.kafkaService.getSnapshot();
      const snapshot = {
        generatedAt,
        pollIntervalMs: this.pollIntervalMs,
        overview: this.buildOverview(kubernetes, metrics),
        kubernetes: kubernetes || {
          connected: false,
          summary: {
            clusterStatus: 'DISCONNECTED',
          },
          namespaces: [],
          nodes: [],
          deployments: [],
          pods: [],
          services: [],
          ingresses: [],
          hpas: [],
          events: [],
        },
        metrics: metrics || {
          connected: false,
          overview: {},
          podUsage: [],
          nodeUtilization: [],
        },
        logs,
        kafka: kafkaSnapshot,
        autoscaling,
        anomalies,
        connections: this.getConnectionStatus(),
        errors: [
          kubernetesResult.status === 'rejected' ? kubernetesResult.reason.message : null,
          metricsResult.status === 'rejected' ? metricsResult.reason.message : null,
          logsResult.status === 'rejected' ? logsResult.reason.message : null,
        ].filter(Boolean),
      };

      this.latestSnapshot = snapshot;
      this.websocketService.broadcastTelemetry(snapshot);
      return snapshot;
    })()
      .catch((error) => {
        logger.error('SmartOps telemetry collection failed', { error: error.message });
        throw error;
      })
      .finally(() => {
        this.inFlight = null;
      });

    return this.inFlight;
  }

  async start() {
    await this.initializeServices();
    await this.collectNow();
    this.intervalRef = setInterval(() => {
      this.collectNow().catch((error) => {
        logger.warn('Scheduled telemetry poll failed', { error: error.message });
      });
    }, this.pollIntervalMs);
  }

  stop() {
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
      this.intervalRef = null;
    }
  }

  getLatestSnapshot() {
    return this.latestSnapshot || {
      generatedAt: null,
      pollIntervalMs: this.pollIntervalMs,
      overview: {},
      kubernetes: {
        summary: {
          clusterStatus: 'BOOTSTRAPPING',
        },
      },
      metrics: {},
      logs: [],
      kafka: {
        connected: false,
        topics: [],
        recentMessages: [],
      },
      autoscaling: {
        hpas: [],
        scalingEvents: [],
      },
      anomalies: [],
      connections: this.getConnectionStatus(),
      errors: [],
    };
  }
}

module.exports = MetricsAggregator;
