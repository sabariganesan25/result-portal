const CPU_MULTIPLIERS = {
  n: 1 / 1000000,
  u: 1 / 1000,
  m: 1,
  '': 1000,
};

const MEMORY_MULTIPLIERS = {
  Ki: 1024,
  Mi: 1024 ** 2,
  Gi: 1024 ** 3,
  Ti: 1024 ** 4,
  Pi: 1024 ** 5,
  K: 1000,
  M: 1000 ** 2,
  G: 1000 ** 3,
  T: 1000 ** 4,
  P: 1000 ** 5,
  '': 1,
};

const parseCpuToMillicores = (value) => {
  if (!value || typeof value !== 'string') {
    return 0;
  }

  const match = value.trim().match(/^([0-9.]+)(n|u|m)?$/);
  if (match) {
    return Number(match[1]) * CPU_MULTIPLIERS[match[2] || ''];
  }

  return Number(value) * 1000 || 0;
};

const parseMemoryToBytes = (value) => {
  if (!value || typeof value !== 'string') {
    return 0;
  }

  const match = value.trim().match(/^([0-9.]+)(Ki|Mi|Gi|Ti|Pi|K|M|G|T|P)?$/);
  if (!match) {
    return Number(value) || 0;
  }

  return Number(match[1]) * MEMORY_MULTIPLIERS[match[2] || ''];
};

const calculatePercent = (used, capacity) => {
  if (!Number.isFinite(used) || !Number.isFinite(capacity) || capacity <= 0) {
    return null;
  }

  return Number(((used / capacity) * 100).toFixed(2));
};

const bytesToMiB = (value) => Number((value / (1024 ** 2)).toFixed(2));

const formatDuration = (startTime) => {
  if (!startTime) {
    return 'unknown';
  }

  const diffMs = Math.max(Date.now() - new Date(startTime).getTime(), 0);
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
};

const sumRestartCount = (containerStatuses = []) => (
  containerStatuses.reduce((total, status) => total + (status.restartCount || 0), 0)
);

const detectSeverity = (message = '', type = '', reason = '') => {
  const normalized = `${message} ${type} ${reason}`.toLowerCase();

  if (normalized.includes('error') || normalized.includes('failed') || normalized.includes('fatal')) {
    return 'ERROR';
  }

  if (normalized.includes('warn') || normalized.includes('pending') || normalized.includes('backoff')) {
    return 'WARN';
  }

  return 'INFO';
};

module.exports = {
  bytesToMiB,
  calculatePercent,
  detectSeverity,
  formatDuration,
  parseCpuToMillicores,
  parseMemoryToBytes,
  sumRestartCount,
};
