import { formatStatusText } from './smartopsFormatters'

const colorMap = {
  CONNECTED: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30',
  DISCONNECTED: 'bg-red-500/15 text-red-300 ring-red-400/30',
  HEALTHY: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30',
  DEGRADED: 'bg-amber-500/15 text-amber-200 ring-amber-400/30',
  ACTIVE: 'bg-cyan-500/15 text-cyan-200 ring-cyan-400/30',
  NOT_CONFIGURED: 'bg-slate-600/40 text-slate-200 ring-slate-500/30',
  WARN: 'bg-amber-500/15 text-amber-200 ring-amber-400/30',
  ERROR: 'bg-red-500/15 text-red-300 ring-red-400/30',
  INFO: 'bg-slate-600/40 text-slate-200 ring-slate-500/30',
}

const StatusBadge = ({ status }) => {
  const normalized = status || 'UNKNOWN'
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-[0.2em] ring-1 ${colorMap[normalized] || 'bg-slate-600/40 text-slate-100 ring-slate-500/30'}`}>
      {normalized}
    </span>
  )
}

export const ConnectionBadge = ({ connected }) => <StatusBadge status={formatStatusText(connected)} />

export default StatusBadge
