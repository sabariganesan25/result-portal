import DataTable from '../../components/smartops/DataTable'
import StatusBadge from '../../components/smartops/StatusBadge'
import { formatPercent, formatTimestamp } from '../../components/smartops/smartopsFormatters'
import { useSmartOpsContext } from './useSmartOpsContext'

const KubernetesPage = () => {
  const { snapshot } = useSmartOpsContext()
  const kubernetes = snapshot?.kubernetes || {}

  return (
    <div className="space-y-6">
      <DataTable
        columns={[
          { key: 'pod_name', label: 'Pod' },
          { key: 'namespace', label: 'Namespace' },
          { key: 'pod_status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
          { key: 'restart_count', label: 'Restarts' },
          { key: 'cpu_usage_percent', label: 'CPU %', render: (value) => formatPercent(value) },
          { key: 'memory_usage_percent', label: 'Memory %', render: (value) => formatPercent(value) },
          { key: 'node_name', label: 'Node' },
          { key: 'deployment_name', label: 'Deployment' },
          { key: 'uptime', label: 'Uptime' },
          { key: 'desired_replicas', label: 'Desired' },
        ]}
        rows={kubernetes.pods || []}
        title="Pods"
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <DataTable
          columns={[
            { key: 'name', label: 'Deployment' },
            { key: 'namespace', label: 'Namespace' },
            { key: 'currentReplicas', label: 'Current' },
            { key: 'desiredReplicas', label: 'Desired' },
            { key: 'readyReplicas', label: 'Ready' },
            { key: 'availableReplicas', label: 'Available' },
          ]}
          rows={kubernetes.deployments || []}
          title="Deployments"
        />

        <DataTable
          columns={[
            { key: 'name', label: 'Node' },
            { key: 'ready', label: 'Ready', render: (value) => <StatusBadge status={value ? 'HEALTHY' : 'DEGRADED'} /> },
            { key: 'instanceType', label: 'Instance Type' },
            { key: 'version', label: 'Version' },
            { key: 'cpuUsagePercent', label: 'CPU %', render: (value) => formatPercent(value) },
            { key: 'memoryUsagePercent', label: 'Memory %', render: (value) => formatPercent(value) },
          ]}
          rows={kubernetes.nodes || []}
          title="Nodes"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DataTable
          columns={[
            { key: 'name', label: 'Service' },
            { key: 'namespace', label: 'Namespace' },
            { key: 'type', label: 'Type' },
            { key: 'clusterIP', label: 'Cluster IP' },
            { key: 'ports', label: 'Ports', render: (value) => value?.join(', ') || 'N/A' },
            { key: 'externalIPs', label: 'External', render: (value) => value?.join(', ') || 'N/A' },
          ]}
          rows={kubernetes.services || []}
          title="Services"
        />

        <DataTable
          columns={[
            { key: 'name', label: 'HPA' },
            { key: 'namespace', label: 'Namespace' },
            { key: 'currentReplicas', label: 'Current' },
            { key: 'desiredReplicas', label: 'Desired' },
            { key: 'minReplicas', label: 'Min' },
            { key: 'maxReplicas', label: 'Max' },
          ]}
          rows={kubernetes.hpas || []}
          title="Horizontal Pod Autoscalers"
        />
      </div>

      <DataTable
        columns={[
          { key: 'timestamp', label: 'Timestamp', render: (value) => formatTimestamp(value) },
          { key: 'severity', label: 'Severity', render: (value) => <StatusBadge status={value} /> },
          { key: 'reason', label: 'Reason' },
          { key: 'object', label: 'Object' },
          { key: 'message', label: 'Message' },
        ]}
        rows={kubernetes.events || []}
        title="Kubernetes Events"
      />
    </div>
  )
}

export default KubernetesPage
