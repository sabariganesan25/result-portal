import MetricCard from '../../components/smartops/MetricCard'
import DataTable from '../../components/smartops/DataTable'
import { formatBytesPerSecond, formatNumber, formatPercent } from '../../components/smartops/smartopsFormatters'
import { useSmartOpsContext } from './useSmartOpsContext'

const MetricsPage = () => {
  const { snapshot } = useSmartOpsContext()
  const overview = snapshot?.metrics?.overview || {}
  const podUsage = snapshot?.metrics?.podUsage || []
  const nodes = snapshot?.metrics?.nodeUtilization || []

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard hint="Prometheus cluster CPU query" label="CPU Usage" value={formatPercent(overview.cpuUsagePercent)} />
        <MetricCard hint="Prometheus cluster memory query" label="Memory Usage" value={formatPercent(overview.memoryUsagePercent)} />
        <MetricCard hint="Backend request throughput" label="Requests / sec" value={formatNumber(overview.requestsPerSecond)} />
        <MetricCard hint="95th percentile request latency" label="Latency P95" value={`${formatNumber(overview.httpLatencyP95Ms)} ms`} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard hint="Current HTTP error rate" label="Error Rate" value={formatPercent(overview.errorRatePercent)} />
        <MetricCard hint="Active in-process connections" label="Active Users" value={formatNumber(overview.activeUsers)} />
        <MetricCard hint="Prometheus network receive telemetry" label="Network RX" value={formatBytesPerSecond(overview.networkReceiveBytesPerSec)} />
        <MetricCard hint="Prometheus network transmit telemetry" label="Network TX" value={formatBytesPerSecond(overview.networkTransmitBytesPerSec)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DataTable
          columns={[
            { key: 'pod', label: 'Pod' },
            { key: 'namespace', label: 'Namespace' },
            { key: 'cpuMillicores', label: 'CPU mCores', render: (value) => value ?? 'N/A' },
            { key: 'memoryMiB', label: 'Memory MiB', render: (value) => value ?? 'N/A' },
          ]}
          rows={podUsage}
          title="Prometheus Pod Utilization"
        />

        <DataTable
          columns={[
            { key: 'node', label: 'Node' },
            { key: 'cpuCores', label: 'CPU Cores' },
          ]}
          rows={nodes}
          title="Prometheus Node CPU"
        />
      </div>
    </div>
  )
}

export default MetricsPage
