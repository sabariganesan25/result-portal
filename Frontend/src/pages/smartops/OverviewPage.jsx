import MetricCard from '../../components/smartops/MetricCard'
import DataTable from '../../components/smartops/DataTable'
import StatusBadge from '../../components/smartops/StatusBadge'
import { formatBytesPerSecond, formatNumber, formatPercent, formatTimestamp } from '../../components/smartops/smartopsFormatters'
import { useSmartOpsContext } from './useSmartOpsContext'

const OverviewPage = () => {
  const { snapshot } = useSmartOpsContext()
  const overview = snapshot?.overview || {}
  const anomalies = snapshot?.anomalies || []
  const pods = snapshot?.kubernetes?.pods || []

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard hint="Real cluster state from Kubernetes API" label="Cluster Status" value={overview.clusterStatus || 'UNKNOWN'} />
        <MetricCard hint="Pods observed across monitored namespaces" label="Total Pods" value={overview.totalPods ?? 0} />
        <MetricCard hint="Currently running workloads" label="Running Pods" value={overview.runningPods ?? 0} />
        <MetricCard hint="Prometheus live request rate" label="Requests / sec" value={formatNumber(overview.requestsPerSecond)} />
        <MetricCard hint="Prometheus 95th percentile latency" label="Latency P95" value={`${formatNumber(overview.httpLatencyP95Ms)} ms`} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard hint="Cluster-wide CPU usage" label="CPU Usage" value={formatPercent(overview.cpuUsagePercent)} />
        <MetricCard hint="Cluster-wide memory usage" label="Memory Usage" value={formatPercent(overview.memoryUsagePercent)} />
        <MetricCard hint="Error rate from backend request metrics" label="Error Rate" value={formatPercent(overview.errorRatePercent)} />
        <MetricCard hint="Live network receive throughput" label="Network RX" value={formatBytesPerSecond(overview.networkReceiveBytesPerSec)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <DataTable
          columns={[
            { key: 'pod_name', label: 'Pod' },
            { key: 'namespace', label: 'Namespace' },
            { key: 'pod_status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
            { key: 'cpu_usage_percent', label: 'CPU %', render: (value) => formatPercent(value) },
            { key: 'memory_usage_percent', label: 'Memory %', render: (value) => formatPercent(value) },
            { key: 'restart_count', label: 'Restarts' },
            { key: 'deployment_name', label: 'Deployment' },
          ]}
          rows={pods.slice(0, 12)}
          title="Live Pod Telemetry"
        />

        <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-white">Active Anomalies</h3>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{anomalies.length} signals</div>
          </div>
          <div className="space-y-3">
            {anomalies.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-400">
                No live anomalies detected from the current telemetry window.
              </div>
            ) : anomalies.map((anomaly, index) => (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4" key={`${anomaly.type}-${index}`}>
                <div className="flex items-center justify-between">
                  <div className="font-medium text-white">{anomaly.type}</div>
                  <StatusBadge status={anomaly.severity} />
                </div>
                <div className="mt-2 text-sm text-slate-400">{anomaly.message}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-400">
            Latest telemetry frame: <span className="text-slate-200">{formatTimestamp(snapshot?.generatedAt)}</span>
          </div>
        </section>
      </div>
    </div>
  )
}

export default OverviewPage
