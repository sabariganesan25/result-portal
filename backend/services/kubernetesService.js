const k8s = require('@kubernetes/client-node');
const {
  bytesToMiB,
  calculatePercent,
  detectSeverity,
  formatDuration,
  parseCpuToMillicores,
  parseMemoryToBytes,
  sumRestartCount,
} = require('../utils/resourceUtils');
const logger = require('../utils/logger');

const unwrap = (response) => response?.body || response;

class KubernetesService {
  constructor() {
    this.clusterName = process.env.EKS_CLUSTER_NAME || 'aurcc-portal-cluster';
    this.namespaceFilter = (process.env.SMARTOPS_MONITOR_NAMESPACES || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    this.status = {
      connected: false,
      lastSuccessAt: null,
      lastError: null,
      clusterName: this.clusterName,
      metricsApiConnected: false,
    };
    this.kc = new k8s.KubeConfig();
    this.coreApi = null;
    this.appsApi = null;
    this.networkingApi = null;
    this.autoscalingApi = null;
    this.customObjectsApi = null;
  }

  loadConfig() {
    const kubeconfigPath = process.env.SMARTOPS_KUBECONFIG;

    if (kubeconfigPath) {
      this.kc.loadFromFile(kubeconfigPath);
      return;
    }

    if (process.env.KUBERNETES_SERVICE_HOST) {
      this.kc.loadFromCluster();
      return;
    }

    this.kc.loadFromDefault();
  }

  async init() {
    try {
      this.loadConfig();
      this.coreApi = this.kc.makeApiClient(k8s.CoreV1Api);
      this.appsApi = this.kc.makeApiClient(k8s.AppsV1Api);
      this.networkingApi = this.kc.makeApiClient(k8s.NetworkingV1Api);
      this.autoscalingApi = this.kc.makeApiClient(k8s.AutoscalingV2Api);
      this.customObjectsApi = this.kc.makeApiClient(k8s.CustomObjectsApi);

      await this.coreApi.listNamespace();
      this.status.connected = true;
      this.status.lastError = null;
      this.status.lastSuccessAt = new Date().toISOString();
    } catch (error) {
      this.status.connected = false;
      this.status.lastError = error.message;
      logger.warn('Kubernetes initialization failed', { error: error.message });
    }

    return this.getStatus();
  }

  getStatus() {
    return { ...this.status };
  }

  applyNamespaceFilter(items = []) {
    if (!this.namespaceFilter.length) {
      return items;
    }

    return items.filter((item) => this.namespaceFilter.includes(item.metadata?.namespace));
  }

  async getPodMetricsMap() {
    try {
      const podMetricsResponse = unwrap(
        await this.customObjectsApi.listClusterCustomObject('metrics.k8s.io', 'v1beta1', 'pods')
      );
      const nodeMetricsResponse = unwrap(
        await this.customObjectsApi.listClusterCustomObject('metrics.k8s.io', 'v1beta1', 'nodes')
      );

      this.status.metricsApiConnected = true;

      const podMetricsMap = new Map(
        (podMetricsResponse.items || []).map((item) => {
          const cpuMillicores = (item.containers || []).reduce(
            (total, container) => total + parseCpuToMillicores(container.usage?.cpu),
            0
          );
          const memoryBytes = (item.containers || []).reduce(
            (total, container) => total + parseMemoryToBytes(container.usage?.memory),
            0
          );

          return [
            `${item.metadata.namespace}/${item.metadata.name}`,
            {
              cpuMillicores,
              memoryBytes,
            },
          ];
        })
      );

      const nodeMetricsMap = new Map(
        (nodeMetricsResponse.items || []).map((item) => [
          item.metadata.name,
          {
            cpuMillicores: parseCpuToMillicores(item.usage?.cpu),
            memoryBytes: parseMemoryToBytes(item.usage?.memory),
          },
        ])
      );

      return { podMetricsMap, nodeMetricsMap };
    } catch (error) {
      this.status.metricsApiConnected = false;
      logger.warn('Kubernetes metrics API unavailable', { error: error.message });
      return { podMetricsMap: new Map(), nodeMetricsMap: new Map() };
    }
  }

  normalizeNamespaces(namespaces = []) {
    return namespaces.map((namespace) => ({
      name: namespace.metadata?.name,
      phase: namespace.status?.phase,
      age: formatDuration(namespace.metadata?.creationTimestamp),
    }));
  }

  normalizeDeployments(deployments = []) {
    return deployments.map((deployment) => ({
      name: deployment.metadata?.name,
      namespace: deployment.metadata?.namespace,
      availableReplicas: deployment.status?.availableReplicas || 0,
      readyReplicas: deployment.status?.readyReplicas || 0,
      currentReplicas: deployment.status?.replicas || 0,
      desiredReplicas: deployment.spec?.replicas || 0,
      updatedReplicas: deployment.status?.updatedReplicas || 0,
      creationTimestamp: deployment.metadata?.creationTimestamp,
    }));
  }

  normalizeServices(services = []) {
    return services.map((service) => ({
      name: service.metadata?.name,
      namespace: service.metadata?.namespace,
      type: service.spec?.type,
      clusterIP: service.spec?.clusterIP,
      externalIPs: service.status?.loadBalancer?.ingress?.map((item) => item.hostname || item.ip) || [],
      ports: (service.spec?.ports || []).map((port) => `${port.port}/${port.protocol}`),
    }));
  }

  normalizeIngresses(ingresses = []) {
    return ingresses.map((ingress) => ({
      name: ingress.metadata?.name,
      namespace: ingress.metadata?.namespace,
      hosts: (ingress.spec?.rules || []).map((rule) => rule.host),
      addresses: (ingress.status?.loadBalancer?.ingress || []).map((item) => item.hostname || item.ip),
    }));
  }

  normalizeHpas(hpas = []) {
    return hpas.map((hpa) => ({
      name: hpa.metadata?.name,
      namespace: hpa.metadata?.namespace,
      currentReplicas: hpa.status?.currentReplicas || 0,
      desiredReplicas: hpa.status?.desiredReplicas || 0,
      minReplicas: hpa.spec?.minReplicas || 0,
      maxReplicas: hpa.spec?.maxReplicas || 0,
      currentMetrics: hpa.status?.currentMetrics || [],
      targetRef: hpa.spec?.scaleTargetRef || null,
    }));
  }

  normalizeEvents(events = []) {
    return events
      .map((event) => ({
        namespace: event.metadata?.namespace,
        type: event.type || 'Normal',
        reason: event.reason,
        message: event.message,
        object: event.involvedObject?.kind ? `${event.involvedObject.kind}/${event.involvedObject.name}` : 'unknown',
        timestamp: event.lastTimestamp || event.eventTime || event.metadata?.creationTimestamp,
        severity: detectSeverity(event.message, event.type, event.reason),
      }))
      .sort((left, right) => new Date(right.timestamp || 0) - new Date(left.timestamp || 0))
      .slice(0, 50);
  }

  normalizeNodes(nodes = [], nodeMetricsMap = new Map()) {
    return nodes.map((node) => {
      const readyCondition = (node.status?.conditions || []).find((condition) => condition.type === 'Ready');
      const capacityCpu = parseCpuToMillicores(node.status?.capacity?.cpu);
      const capacityMemory = parseMemoryToBytes(node.status?.capacity?.memory);
      const usage = nodeMetricsMap.get(node.metadata?.name);

      return {
        name: node.metadata?.name,
        ready: readyCondition?.status === 'True',
        version: node.status?.nodeInfo?.kubeletVersion,
        instanceType: node.metadata?.labels?.['node.kubernetes.io/instance-type']
          || node.metadata?.labels?.['beta.kubernetes.io/instance-type']
          || 'unknown',
        cpuUsagePercent: calculatePercent(usage?.cpuMillicores, capacityCpu),
        memoryUsagePercent: calculatePercent(usage?.memoryBytes, capacityMemory),
      };
    });
  }

  normalizePods(pods = [], replicaSets = [], deployments = [], hpas = [], podMetricsMap = new Map()) {
    const replicaSetToDeployment = new Map(
      replicaSets.map((replicaSet) => [
        replicaSet.metadata?.name,
        replicaSet.metadata?.ownerReferences?.find((owner) => owner.kind === 'Deployment')?.name || null,
      ])
    );

    const deploymentReplicaMap = new Map(
      deployments.map((deployment) => [
        `${deployment.metadata?.namespace}/${deployment.metadata?.name}`,
        {
          currentReplicas: deployment.status?.replicas || 0,
          desiredReplicas: deployment.spec?.replicas || 0,
        },
      ])
    );

    const hpaDeploymentMap = new Map(
      hpas.map((hpa) => [
        `${hpa.metadata?.namespace}/${hpa.spec?.scaleTargetRef?.name}`,
        {
          currentReplicas: hpa.status?.currentReplicas || 0,
          desiredReplicas: hpa.status?.desiredReplicas || 0,
        },
      ])
    );

    return pods.map((pod) => {
      const namespace = pod.metadata?.namespace;
      const podName = pod.metadata?.name;
      const ownerRef = pod.metadata?.ownerReferences?.[0];
      const deploymentName = ownerRef?.kind === 'ReplicaSet'
        ? replicaSetToDeployment.get(ownerRef.name) || ownerRef.name
        : ownerRef?.name || 'standalone';
      const podMetric = podMetricsMap.get(`${namespace}/${podName}`) || {};
      const totalCpuLimit = (pod.spec?.containers || []).reduce(
        (total, container) => total + parseCpuToMillicores(container.resources?.limits?.cpu || container.resources?.requests?.cpu),
        0
      );
      const totalMemoryLimit = (pod.spec?.containers || []).reduce(
        (total, container) => total + parseMemoryToBytes(container.resources?.limits?.memory || container.resources?.requests?.memory),
        0
      );
      const replicaInfo = hpaDeploymentMap.get(`${namespace}/${deploymentName}`)
        || deploymentReplicaMap.get(`${namespace}/${deploymentName}`)
        || { currentReplicas: null, desiredReplicas: null };

      return {
        pod_name: podName,
        namespace,
        pod_status: pod.status?.phase,
        restart_count: sumRestartCount(pod.status?.containerStatuses),
        cpu_usage_percent: calculatePercent(podMetric.cpuMillicores, totalCpuLimit),
        memory_usage_percent: calculatePercent(podMetric.memoryBytes, totalMemoryLimit),
        cpu_usage_millicores: podMetric.cpuMillicores ?? null,
        memory_usage_mib: podMetric.memoryBytes ? bytesToMiB(podMetric.memoryBytes) : null,
        node_name: pod.spec?.nodeName || 'unassigned',
        deployment_name: deploymentName,
        uptime: formatDuration(pod.status?.startTime),
        current_replicas: replicaInfo.currentReplicas,
        desired_replicas: replicaInfo.desiredReplicas,
      };
    });
  }

  summarizeCluster({ pods, nodes, deployments, hpas }) {
    const runningPods = pods.filter((pod) => pod.pod_status === 'Running').length;
    const pendingPods = pods.filter((pod) => pod.pod_status === 'Pending').length;
    const crashLoopPods = pods.filter((pod) => pod.restart_count > 0 || pod.pod_status === 'Failed').length;
    const readyNodes = nodes.filter((node) => node.ready).length;

    const clusterStatus = !nodes.length
      ? 'DEGRADED'
      : pendingPods > 0 || readyNodes < nodes.length
        ? 'DEGRADED'
        : 'HEALTHY';

    return {
      clusterStatus,
      totalPods: pods.length,
      runningPods,
      pendingPods,
      crashLoopPods,
      totalNodes: nodes.length,
      readyNodes,
      totalDeployments: deployments.length,
      totalHpas: hpas.length,
    };
  }

  async getSnapshot() {
    if (!this.coreApi) {
      await this.init();
    }

    const { podMetricsMap, nodeMetricsMap } = await this.getPodMetricsMap();

    try {
      const [
        namespaceResponse,
        nodeResponse,
        podResponse,
        serviceResponse,
        deploymentResponse,
        replicaSetResponse,
        ingressResponse,
        hpaResponse,
        eventResponse,
      ] = await Promise.all([
        this.coreApi.listNamespace(),
        this.coreApi.listNode(),
        this.coreApi.listPodForAllNamespaces(),
        this.coreApi.listServiceForAllNamespaces(),
        this.appsApi.listDeploymentForAllNamespaces(),
        this.appsApi.listReplicaSetForAllNamespaces(),
        this.networkingApi.listIngressForAllNamespaces(),
        this.autoscalingApi.listHorizontalPodAutoscalerForAllNamespaces(),
        this.coreApi.listEventForAllNamespaces(),
      ]);

      const namespaces = this.normalizeNamespaces(unwrap(namespaceResponse).items || []);
      const nodes = this.normalizeNodes(unwrap(nodeResponse).items || [], nodeMetricsMap);
      const rawPods = this.applyNamespaceFilter(unwrap(podResponse).items || []);
      const deploymentsRaw = this.applyNamespaceFilter(unwrap(deploymentResponse).items || []);
      const replicaSetsRaw = this.applyNamespaceFilter(unwrap(replicaSetResponse).items || []);
      const hpasRaw = this.applyNamespaceFilter(unwrap(hpaResponse).items || []);
      const services = this.normalizeServices(this.applyNamespaceFilter(unwrap(serviceResponse).items || []));
      const deployments = this.normalizeDeployments(deploymentsRaw);
      const hpas = this.normalizeHpas(hpasRaw);
      const ingresses = this.normalizeIngresses(this.applyNamespaceFilter(unwrap(ingressResponse).items || []));
      const events = this.normalizeEvents(this.applyNamespaceFilter(unwrap(eventResponse).items || []));
      const pods = this.normalizePods(rawPods, replicaSetsRaw, deploymentsRaw, hpasRaw, podMetricsMap);
      const summary = this.summarizeCluster({ pods, nodes, deployments, hpas });

      this.status.connected = true;
      this.status.lastSuccessAt = new Date().toISOString();
      this.status.lastError = null;

      return {
        connected: true,
        clusterName: this.clusterName,
        summary,
        namespaces,
        nodes,
        deployments,
        pods,
        services,
        ingresses,
        hpas,
        events,
        collectedAt: new Date().toISOString(),
      };
    } catch (error) {
      this.status.connected = false;
      this.status.lastError = error.message;
      logger.error('Kubernetes snapshot failed', { error: error.message });
      throw error;
    }
  }
}

module.exports = KubernetesService;
