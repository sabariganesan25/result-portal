const axios = require('axios');
const logger = require('../utils/logger');

class PrometheusService {
  constructor() {
    this.baseUrl = process.env.PROMETHEUS_BASE_URL;
    this.namespaceRegex = (process.env.SMARTOPS_MONITOR_NAMESPACES || 'default,kube-system')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .join('|');
    this.status = {
      connected: false,
      lastSuccessAt: null,
      lastError: null,
      baseUrl: this.baseUrl || null,
    };
    this.client = this.baseUrl
      ? axios.create({
          baseURL: this.baseUrl,
          timeout: Number(process.env.PROMETHEUS_TIMEOUT_MS || 5000),
        })
      : null;
  }

  async init() {
    if (!this.client) {
      this.status.lastError = 'PROMETHEUS_BASE_URL is not configured.';
      return this.status;
    }

    try {
      await this.query('up');
      this.status.connected = true;
      this.status.lastError = null;
      this.status.lastSuccessAt = new Date().toISOString();
    } catch (error) {
      this.status.connected = false;
      this.status.lastError = error.message;
      logger.warn('Prometheus initialization failed', { error: error.message });
    }

    return this.status;
  }

  getStatus() {
    return { ...this.status };
  }

  extractVectorValue(result) {
    const first = result?.data?.result?.[0]?.value?.[1];
    if (first === undefined) {
      return null;
    }

    const parsed = Number(first);
    return Number.isFinite(parsed) ? Number(parsed.toFixed(2)) : null;
  }

  async query(expression) {
    if (!this.client) {
      throw new Error('Prometheus client is not configured.');
    }

    const response = await this.client.get('/api/v1/query', {
      params: { query: expression },
    });

    if (response.data?.status !== 'success') {
      throw new Error(`Prometheus query failed for expression: ${expression}`);
    }

    this.status.connected = true;
    this.status.lastSuccessAt = new Date().toISOString();
    this.status.lastError = null;
    return response.data;
  }

  async queryRange(expression, start, end, step = '30s') {
    if (!this.client) {
      throw new Error('Prometheus client is not configured.');
    }

    const response = await this.client.get('/api/v1/query_range', {
      params: { query: expression, start, end, step },
    });

    if (response.data?.status !== 'success') {
      throw new Error(`Prometheus range query failed for expression: ${expression}`);
    }

    return response.data;
  }

  async fetchSnapshot() {
    if (!this.client) {
      return {
        connected: false,
        overview: {},
        podUsage: [],
        nodeUtilization: [],
        error: this.status.lastError,
      };
    }

    const ns = this.namespaceRegex;
    const queries = {
      cpuUsagePercent: `sum(rate(container_cpu_usage_seconds_total{container!="",namespace=~"${ns}"}[2m])) / clamp_min(sum(kube_node_status_capacity{resource="cpu"}), 0.001) * 100`,
      memoryUsagePercent: `sum(container_memory_working_set_bytes{container!="",namespace=~"${ns}"}) / clamp_min(sum(kube_node_status_capacity{resource="memory",unit="byte"}), 1) * 100`,
      requestsPerSecond: 'sum(rate(total_requests[1m]))',
      errorRatePercent: 'sum(rate(total_requests{status=~"4..|5.."}[5m])) / clamp_min(sum(rate(total_requests[5m])), 0.001) * 100',
      httpLatencyP95Ms: 'histogram_quantile(0.95, sum by (le) (rate(request_duration_seconds_bucket[5m]))) * 1000',
      activeUsers: 'sum(active_connections)',
      networkReceiveBytesPerSec: `sum(rate(container_network_receive_bytes_total{namespace=~"${ns}"}[2m]))`,
      networkTransmitBytesPerSec: `sum(rate(container_network_transmit_bytes_total{namespace=~"${ns}"}[2m]))`,
      podRestarts: `sum(kube_pod_container_status_restarts_total{namespace=~"${ns}"})`,
      hpaCurrentReplicas: `sum(kube_horizontalpodautoscaler_status_current_replicas{namespace=~"${ns}"})`,
      hpaDesiredReplicas: `sum(kube_horizontalpodautoscaler_status_desired_replicas{namespace=~"${ns}"})`,
    };

    const overviewEntries = await Promise.all(
      Object.entries(queries).map(async ([key, expression]) => {
        try {
          const result = await this.query(expression);
          return [key, this.extractVectorValue(result)];
        } catch (error) {
          logger.warn('Prometheus overview query failed', { key, error: error.message });
          return [key, null];
        }
      })
    );

    const overview = Object.fromEntries(overviewEntries);
    let podUsage = [];
    let nodeUtilization = [];

    try {
      const [podCpu, podMemory, nodeCpu] = await Promise.all([
        this.query(`topk(25, sum by (namespace, pod) (rate(container_cpu_usage_seconds_total{container!="",namespace=~"${ns}"}[2m])) * 1000)`),
        this.query(`topk(25, sum by (namespace, pod) (container_memory_working_set_bytes{container!="",namespace=~"${ns}"}))`),
        this.query('sum by (node) (rate(container_cpu_usage_seconds_total{id="/",container="",image=""}[2m]))'),
      ]);

      const podCpuMap = new Map(
        (podCpu.data?.result || []).map((item) => [
          `${item.metric.namespace}/${item.metric.pod}`,
          Number(Number(item.value?.[1] || 0).toFixed(2)),
        ])
      );

      const podMemoryMap = new Map(
        (podMemory.data?.result || []).map((item) => [
          `${item.metric.namespace}/${item.metric.pod}`,
          Number((Number(item.value?.[1] || 0) / (1024 ** 2)).toFixed(2)),
        ])
      );

      podUsage = Array.from(new Set([...podCpuMap.keys(), ...podMemoryMap.keys()])).map((key) => {
        const [namespace, pod] = key.split('/');
        return {
          namespace,
          pod,
          cpuMillicores: podCpuMap.get(key) ?? null,
          memoryMiB: podMemoryMap.get(key) ?? null,
        };
      });

      nodeUtilization = (nodeCpu.data?.result || []).map((item) => ({
        node: item.metric.node || item.metric.instance || 'unknown',
        cpuCores: Number(Number(item.value?.[1] || 0).toFixed(3)),
      }));
    } catch (error) {
      logger.warn('Prometheus detailed query failed', { error: error.message });
    }

    return {
      connected: true,
      overview,
      podUsage,
      nodeUtilization,
      collectedAt: new Date().toISOString(),
    };
  }
}

module.exports = PrometheusService;
