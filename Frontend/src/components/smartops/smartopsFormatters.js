export const formatNumber = (value, digits = 2) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return 'N/A'
  }

  return Number(value).toFixed(digits)
}

export const formatPercent = (value) => value === null || value === undefined ? 'N/A' : `${formatNumber(value)}%`

export const formatBytesPerSecond = (value) => {
  if (value === null || value === undefined) return 'N/A'
  const mib = Number(value) / (1024 * 1024)
  return `${formatNumber(mib)} MiB/s`
}

export const formatTimestamp = (value) => value ? new Date(value).toLocaleString() : 'N/A'

export const formatStatusText = (connected) => connected ? 'CONNECTED' : 'DISCONNECTED'
