/**
 * Travel Handlers
 *
 * Multiplayer travel state synchronization:
 * - request_travel_sync: client asks peers for current travel state
 * - travel_sync: full travel state broadcast (persisted for permanent rooms)
 * - travel_update: incremental travel update
 * - travel_broadcast: arbitrary travel event broadcast
 */

function registerTravelHandlers(ctx) {
  const {
    socket,
    logger,
    validateRoomMembership,
    firebaseBatchWriter
  } = ctx;

  socket.on('request_travel_sync', (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId, false);
      if (!validation.valid) {
        logger.info('[request_travel_sync] Validation failed', { socketId: socket.id, roomId: data.roomId });
        return;
      }
      logger.info('[request_travel_sync] Relaying to room', { socketId: socket.id, roomId: data.roomId });
      socket.to(data.roomId).emit('request_travel_sync', data);
    } catch (error) {
      logger.error('[request_travel_sync] Error:', { error: error.message });
    }
  });

  socket.on('travel_sync', (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId, true);
      if (!validation.valid) {
        logger.info('[travel_sync] Validation failed', { socketId: socket.id, roomId: data.roomId });
        return;
      }
      logger.info('[travel_sync] Relaying to room', { socketId: socket.id, roomId: data.roomId });
      socket.to(data.roomId).emit('travel_sync', data);

      const { room } = validation;
      if (room.isPermanent && data.travelState) {
        if (!room.gameState.travel) room.gameState.travel = {};
        room.gameState.travel = { ...room.gameState.travel, ...data.travelState };
        firebaseBatchWriter.queueWrite(data.roomId, room.gameState);
      }
    } catch (error) {
      logger.error('[travel_sync] Error:', { error: error.message });
    }
  });

  socket.on('travel_update', (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId, true);
      if (!validation.valid) return;

      logger.info('[travel_update] Relaying', { socketId: socket.id, roomId: data.roomId, keys: Object.keys(data) });
      socket.to(data.roomId).emit('travel_update', data);
    } catch (error) {
      logger.error('[travel_update] Error:', { error: error.message });
    }
  });

  socket.on('travel_broadcast', (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId, true);
      if (!validation.valid) return;

      socket.to(data.roomId).emit('travel_broadcast', data);
    } catch (error) {
      logger.error('[travel_broadcast] Error:', { error: error.message });
    }
  });
}

module.exports = { registerTravelHandlers };
