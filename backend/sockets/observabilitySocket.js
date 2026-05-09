module.exports = function registerObservabilitySocket(socket, smartops) {
  socket.on('smartops:request-snapshot', async () => {
    socket.emit('smartops:telemetry', smartops.aggregator.getLatestSnapshot());
  });

  socket.on('smartops:refresh', async () => {
    const snapshot = await smartops.aggregator.collectNow();
    socket.emit('smartops:telemetry', snapshot);
  });
};
