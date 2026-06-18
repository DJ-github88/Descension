/**
 * Sync Handlers
 *
 * State synchronization between clients (initial full sync, peer-to-peer
 * targeted sync, and conflict resolution):
 * - request_full_sync: client asks for full room snapshot
 * - sync_tokens / sync_grid_items / sync_character_tokens: targeted peer sync
 *   (supports recipientPlayerId for direct delivery, otherwise broadcasts to room)
 * - request_combat_sync: combat-only snapshot
 * - save_room_state_request: persist room state to Firebase
 * - resolve_state_conflict: apply authoritative state after conflict
 */

function registerSyncHandlers(ctx) {
  const {
    io,
    socket,
    rooms,
    players,
    logger,
    validateRoomMembership,
    firebaseBatchWriter,
    firebaseService
  } = ctx;

  socket.on('request_full_sync', () => {
    const player = players.get(socket.id);
    if (!player) return;

    const room = rooms.get(player.roomId);
    if (!room) return;

    socket.emit('full_sync', {
      room: {
        id: room.id,
        name: room.name,
        gm: room.gm,
        players: Array.from(room.players.values()),
        settings: room.settings,
        gameState: room.gameState
      },
      player: player
    });
  });

  socket.on('sync_tokens', (data) => {
    const sender = players.get(socket.id);
    if (!sender) return;
    const room = rooms.get(sender.roomId);
    if (!room) return;

    const payload = { tokens: data.tokens, mapId: data.mapId };

    if (data.recipientPlayerId) {
      const recipient = Array.from(players.values()).find(p => p.id === data.recipientPlayerId);
      if (recipient) {
        io.to(recipient.socketId).emit('full_game_state_sync', payload);
      }
    } else {
      socket.to(sender.roomId).emit('full_game_state_sync', payload);
    }
  });

  socket.on('sync_grid_items', (data) => {
    const sender = players.get(socket.id);
    if (!sender) return;
    const room = rooms.get(sender.roomId);
    if (!room) return;

    const payload = { gridItems: data.gridItems, mapId: data.mapId };

    if (data.recipientPlayerId) {
      const recipient = Array.from(players.values()).find(p => p.id === data.recipientPlayerId);
      if (recipient) {
        io.to(recipient.socketId).emit('full_game_state_sync', payload);
      }
    } else {
      socket.to(sender.roomId).emit('full_game_state_sync', payload);
    }
  });

  socket.on('sync_character_tokens', (data) => {
    const sender = players.get(socket.id);
    if (!sender) return;
    const room = rooms.get(sender.roomId);
    if (!room) return;

    const payload = { characterTokens: data.characterTokens, mapId: data.mapId };

    if (data.recipientPlayerId) {
      const recipient = Array.from(players.values()).find(p => p.id === data.recipientPlayerId);
      if (recipient) {
        io.to(recipient.socketId).emit('full_game_state_sync', payload);
      }
    } else {
      socket.to(sender.roomId).emit('full_game_state_sync', payload);
    }
  });

  socket.on('request_combat_sync', () => {
    const player = players.get(socket.id);
    if (!player) return;
    const room = rooms.get(player.roomId);
    if (!room) return;

    socket.emit('full_game_state_sync', {
      combat: room.gameState.combat || null,
      players: Array.from(room.players.values()),
      gm: room.gm
    });
  });

  socket.on('save_room_state_request', async (data) => {
    const player = players.get(socket.id);
    if (!player) return;
    const room = rooms.get(player.roomId);
    if (!room) return;

    try {
      await firebaseService.updateRoomGameState(room.id, room.gameState);
      socket.emit('room_state_saved', { roomId: room.id, reason: data.reason });
    } catch (error) {
      logger.error('[save_room_state_request] Error:', { error: error.message });
      socket.emit('room_state_save_error', { error: error.message });
    }
  });

  socket.on('resolve_state_conflict', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room } = validation;

      // Apply conflict resolution
      if (data.resolvedState) {
        room.gameState = {
          ...room.gameState,
          ...data.resolvedState
        };

        io.to(data.roomId).emit('state_resolved', {
          resolvedState: room.gameState
        });

        firebaseBatchWriter.queueWrite(data.roomId, room.gameState);
      }

    } catch (error) {
      logger.error('[resolve_state_conflict] Error:', { error: error.message });
    }
  });
}

module.exports = { registerSyncHandlers };
