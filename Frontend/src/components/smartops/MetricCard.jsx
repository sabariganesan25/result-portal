const MetricCard = ({ label, value, hint }) => (
  <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.45)]">
    <div className="text-xs uppercase tracking-[0.28em] text-slate-400">{label}</div>
    <div className="mt-3 font-['Space_Grotesk'] text-3xl font-semibold text-white">{value}</div>
    <div className="mt-2 text-sm text-slate-400">{hint}</div>
  </div>
)

export default MetricCard
