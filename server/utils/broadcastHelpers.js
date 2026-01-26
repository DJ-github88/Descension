/**
 * Broadcast Helpers
 *
 * Common broadcast patterns to reduce code duplication in server.js
 */

/**
 * Broadcast to players on the same map
 * @param {Object} io - Socket.io instance
 * @param {Map} players - Players map
 * @param {string} socketId - Current socket ID to exclude
 * @param {string} roomId - Room ID to filter by
 * @param {string} targetMapId - Map ID to filter by
 * @param {string} eventName - Event name to emit
 * @param {Object} data - Data to emit
 */
function broadcastToPlayersOnMap(io, players, socketId, roomId, targetMapId, eventName, data) {
  for (const [sid, p] of players.entries()) {
    if (sid !== socketId && p.roomId === roomId && p.currentMapId === targetMapId) {
      io.to(sid).emit(eventName, data);
    }
  }
}

/**
 * Broadcast to all players in room (all maps)
 * @param {Object} io - Socket.io instance
 * @param {Map} players - Players map
 * @param {string} socketId - Current socket ID to exclude
 * @param {string} roomId - Room ID to filter by
 * @param {string} eventName - Event name to emit
 * @param {Object} data - Data to emit
 */
function broadcastToAllPlayersInRoom(io, players, socketId, roomId, eventName, data) {
  for (const [sid, p] of players.entries()) {
    if (sid !== socketId && p.roomId === roomId) {
      io.to(sid).emit(eventName, data);
    }
  }
}

module.exports = {
  broadcastToPlayersOnMap,
  broadcastToAllPlayersInRoom
};
