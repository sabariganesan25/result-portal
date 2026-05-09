import { useEffect, useMemo, useRef, useState } from 'react'
import { formatTimestamp } from './smartopsFormatters'

const severityClasses = {
  ERROR: 'text-red-300',
  WARN: 'text-amber-200',
  INFO: 'text-slate-200',
}

const LiveLogViewer = ({ logs }) => {
  const [query, setQuery] = useState('')
  const [severity, setSeverity] = useState('ALL')
  const [autoScroll, setAutoScroll] = useState(true)
  const containerRef = useRef(null)

  const filteredLogs = useMemo(() => logs.filter((log) => {
    const matchesSeverity = severity === 'ALL' || log.severity === severity
    const matchesQuery = !query || `${log.service} ${log.pod} ${log.message}`.toLowerCase().includes(query.toLowerCase())
    return matchesSeverity && matchesQuery
  }), [logs, query, severity])

  useEffect(() => {
    if (!autoScroll || !containerRef.current) return
    containerRef.current.scrollTop = containerRef.current.scrollHeight
  }, [filteredLogs, autoScroll])

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-white">Live CloudWatch Log Stream</h3>
          <p className="text-sm text-slate-400">Streaming backend, API, and platform log events without page refresh.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white outline-none"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search service, pod, or message"
            value={query}
          />
          <select
            className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white outline-none"
            onChange={(event) => setSeverity(event.target.value)}
            value={severity}
          >
            <option value="ALL">All severities</option>
            <option value="ERROR">Error</option>
            <option value="WARN">Warn</option>
            <option value="INFO">Info</option>
          </select>
          <button
            className={`rounded-2xl border px-4 py-2 text-sm ${autoScroll ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200' : 'border-slate-700 text-slate-300'}`}
            onClick={() => setAutoScroll((current) => !current)}
            type="button"
          >
            Auto-scroll {autoScroll ? 'On' : 'Off'}
          </button>
        </div>
      </div>
      <div className="h-[540px] overflow-y-auto rounded-2xl border border-slate-800 bg-[#020617] p-4 font-['IBM_Plex_Mono'] text-sm" ref={containerRef}>
        {filteredLogs.length === 0 ? (
          <div className="text-slate-500">No live log lines available for the current filter.</div>
        ) : filteredLogs.map((log) => (
          <div className="grid gap-1 border-b border-slate-900 py-3 lg:grid-cols-[190px_100px_160px_220px_1fr]" key={log.id}>
            <span className="text-slate-500">{formatTimestamp(log.timestamp)}</span>
            <span className={severityClasses[log.severity] || 'text-slate-200'}>{log.severity}</span>
            <span className="text-cyan-200">{log.service}</span>
            <span className="text-slate-400">{log.pod}</span>
            <span className="break-all text-slate-100">{log.message}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default LiveLogViewer
