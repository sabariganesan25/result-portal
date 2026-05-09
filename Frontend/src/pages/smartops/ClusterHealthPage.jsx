import { ConnectionBadge } from '../../components/smartops/StatusBadge'
import { formatTimestamp } from '../../components/smartops/smartopsFormatters'
import { useSmartOpsContext } from './useSmartOpsContext'

const ClusterHealthPage = () => {
  const { snapshot, socketConnected } = useSmartOpsContext()
  const connections = snapshot?.connections || {}
  const rows = [
    { label: 'Kubernetes API', data: connections.kubernetes },
    { label: 'Prometheus', data: connections.prometheus },
    { label: 'Kafka', data: connections.kafka },
    { label: 'CloudWatch', data: connections.cloudwatch },
    { label: 'WebSocket', data: { connected: socketConnected, lastSuccessAt: connections.websocket?.lastBroadcastAt, lastError: null } },
  ]

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {rows.map((row) => (
        <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6" key={row.label}>
          <div className="flex items-center justify-between">
            <div className="font-['Space_Grotesk'] text-xl font-semibold text-white">{row.label}</div>
            <ConnectionBadge connected={row.data?.connected} />
          </div>
          <div className="mt-4 space-y-2 text-sm text-slate-400">
            <div>Last success: <span className="text-slate-200">{formatTimestamp(row.data?.lastSuccessAt)}</span></div>
            <div>Last error: <span className="text-slate-200">{row.data?.lastError || 'None'}</span></div>
          </div>
        </section>
      ))}
    </div>
  )
}

export default ClusterHealthPage
