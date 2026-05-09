const DataTable = ({ title, columns, rows, emptyMessage = 'No live data available.' }) => (
  <section className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-white">{title}</h3>
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{rows.length} records</div>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm text-slate-300">
        <thead>
          <tr className="border-b border-slate-800 text-xs uppercase tracking-[0.18em] text-slate-500">
            {columns.map((column) => (
              <th className="px-3 py-3 font-medium" key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="px-3 py-6 text-slate-500" colSpan={columns.length}>{emptyMessage}</td>
            </tr>
          ) : rows.map((row, index) => (
            <tr className="border-b border-slate-900/80" key={row.id || `${title}-${index}`}>
              {columns.map((column) => (
                <td className="px-3 py-3 align-top" key={column.key}>
                  {column.render ? column.render(row[column.key], row) : row[column.key] ?? 'N/A'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
)

export default DataTable
