class WebsocketService {
  constructor(io) {
    this.io = io;
    this.clientCount = 0;
    this.lastBroadcastAt = null;
  }

  initialize(registerSocketHandlers) {
    this.io.on('connection', (socket) => {
      this.clientCount += 1;

      if (typeof registerSocketHandlers === 'function') {
        registerSocketHandlers(socket);
      }

      socket.emit('smartops:connection', this.getStatus());
      this.io.emit('smartops:connection', this.getStatus());

      socket.on('disconnect', () => {
        this.clientCount = Math.max(this.clientCount - 1, 0);
        this.io.emit('smartops:connection', this.getStatus());
      });
    });
  }

  broadcastTelemetry(payload) {
    this.lastBroadcastAt = new Date().toISOString();
    this.io.emit('smartops:telemetry', payload);
    this.io.emit('smartops:connection', this.getStatus());
  }

  getStatus() {
    return {
      connected: true,
      clientCount: this.clientCount,
      lastBroadcastAt: this.lastBroadcastAt,
      transport: 'socket.io',
    };
  }
}

module.exports = WebsocketService;
