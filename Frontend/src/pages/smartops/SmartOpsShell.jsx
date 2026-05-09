import { NavLink, Outlet } from 'react-router-dom'
import { FaBroadcastTower, FaChartLine, FaCube, FaHeartbeat, FaKafka, FaListAlt, FaWaveSquare } from 'react-icons/fa'
import { useSmartOpsTelemetry } from '../../hooks/useSmartOpsTelemetry'
import { ConnectionBadge } from '../../components/smartops/StatusBadge'
import { formatTimestamp } from '../../components/smartops/smartopsFormatters'

const navItems = [
  { label: 'Overview', to: '/admin/smartops', icon: FaBroadcastTower, end: true },
  { label: 'Kubernetes', to: '/admin/smartops/kubernetes', icon: FaCube },
  { label: 'Metrics', to: '/admin/smartops/metrics', icon: FaChartLine },
  { label: 'Logs', to: '/admin/smartops/logs', icon: FaListAlt },
  { label: 'Kafka Streams', to: '/admin/smartops/kafka', icon: FaKafka },
  { label: 'Autoscaling', to: '/admin/smartops/autoscaling', icon: FaWaveSquare },
  { label: 'Cluster Health', to: '/admin/smartops/cluster-health', icon: FaHeartbeat },
]

const SmartOpsShell = () => {
  const telemetry = useSmartOpsTelemetry()
  const snapshot = telemetry.snapshot

  return (
    <div className="min-h-[calc(100vh-9rem)] overflow-hidden rounded-[32px] border border-slate-800 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.12),_transparent_28%),linear-gradient(135deg,_#020617,_#0f172a_45%,_#111827)] text-slate-100 shadow-[0_24px_80px_rgba(15,23,42,0.55)]">
      <div className="grid min-h-[calc(100vh-9rem)] lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-slate-800 bg-slate-950/70 p-6 lg:border-b-0 lg:border-r">
          <div className="mb-8">
            <div className="text-xs uppercase tracking-[0.35em] text-cyan-300">SmartOps</div>
            <h1 className="mt-3 font-['Space_Grotesk'] text-3xl font-semibold text-white">Real-Time EKS Observability</h1>
            <p className="mt-3 text-sm text-slate-400">Live telemetry only. Kubernetes, Prometheus, CloudWatch, Kafka, and autoscaling data stream from backend integrations.</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  className={({ isActive }) => `flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${isActive ? 'border-cyan-400/40 bg-cyan-500/10 text-white' : 'border-transparent bg-slate-900/40 text-slate-300 hover:border-slate-700 hover:bg-slate-900/70 hover:text-white'}`}
                  end={item.end}
                  key={item.to}
                  to={item.to}
                >
                  <Icon className="text-cyan-300" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-4 text-sm">
            <div className="mb-2 text-xs uppercase tracking-[0.25em] text-slate-500">Stream Health</div>
            <div className="flex items-center justify-between">
              <span>WebSocket</span>
              <ConnectionBadge connected={telemetry.socketConnected} />
            </div>
            <div className="mt-3 text-xs text-slate-500">Last update: {formatTimestamp(snapshot?.generatedAt)}</div>
          </div>
        </aside>

        <main className="p-5 lg:p-8">
          <div className="mb-6 flex flex-col gap-3 border-b border-slate-800 pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.32em] text-slate-500">Live operations center</div>
              <div className="mt-2 font-['Space_Grotesk'] text-2xl font-semibold text-white">
                {snapshot?.kubernetes?.clusterName || 'aurcc-portal-cluster'}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <ConnectionBadge connected={snapshot?.connections?.kubernetes?.connected} />
              <ConnectionBadge connected={snapshot?.connections?.prometheus?.connected} />
              <ConnectionBadge connected={snapshot?.connections?.kafka?.connected} />
              <ConnectionBadge connected={snapshot?.connections?.cloudwatch?.connected} />
            </div>
          </div>

          {telemetry.error ? (
            <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {telemetry.error}
            </div>
          ) : null}

          {telemetry.loading && !snapshot ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-950/70 px-6 py-10 text-center text-slate-400">
              Connecting to live SmartOps telemetry sources...
            </div>
          ) : (
            <Outlet context={telemetry} />
          )}
        </main>
      </div>
    </div>
  )
}

export default SmartOpsShell
