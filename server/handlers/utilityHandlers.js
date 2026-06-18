/**
 * Utility Handlers
 *
 * Low-level utility socket events:
 * - ping / pong heartbeat
 * - health_check (server status)
 * - cursor_move (broadcast mouse position to room)
 */

function registerUtilityHandlers(ctx) {
  const { socket, rooms, players } = ctx;

  socket.on('ping', () => {
    socket.emit('pong', { timestamp: Date.now() });
  });

  socket.on('health_check', () => {
    socket.emit('health_check_response', {
      status: 'ok',
      roomsCount: rooms.size,
      playersCount: players.size,
      uptime: process.uptime()
    });
  });

  socket.on('cursor_move', (data) => {
    const player = players.get(socket.id);
    if (!player) return;

    socket.to(player.roomId).emit('cursor_moved', {
      playerId: player.id,
      playerName: player.name,
      position: data.position,
      color: player.color || '#4a90e2'
    });
  });
}

module.exports = { registerUtilityHandlers };
