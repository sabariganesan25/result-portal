const info = (message, meta = {}) => {
  console.log(JSON.stringify({
    level: 'info',
    timestamp: new Date().toISOString(),
    message,
    ...meta,
  }));
};

const warn = (message, meta = {}) => {
  console.warn(JSON.stringify({
    level: 'warn',
    timestamp: new Date().toISOString(),
    message,
    ...meta,
  }));
};

const error = (message, meta = {}) => {
  console.error(JSON.stringify({
    level: 'error',
    timestamp: new Date().toISOString(),
    message,
    ...meta,
  }));
};

module.exports = {
  info,
  warn,
  error,
};
