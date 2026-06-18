/**
 * Token Management Handlers
 *
 * Map token lifecycle (server-authoritative state stored per map):
 * - token_created / token_removed / token_dismissed: lifecycle with ack
 * - token_moved: queues through movementDebouncer for batched broadcast
 * - token_updated: applies partial updates to tokens OR creatures (compat)
 * - token_control_granted / token_control_response: GM-to-player control handoff
 * - character_token_created / character_token_removed: player token lifecycle
 */

function registerTokenHandlers(ctx) {
  const {
    io,
    socket,
    logger,
    uuidv4,
    validateRoomMembership,
    validateMapExists,
    firebaseBatchWriter,
    movementDebouncer,
    getNextEventSequence,
    stripUndefined
  } = ctx;

  socket.on('token_created', async (data, ackCallback) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) {
        socket.emit('error', { message: validation.error });
        if (typeof ackCallback === 'function') ackCallback({ success: false, error: validation.error });
        return;
      }

      const { room } = validation;
      const mapId = data.mapId || room.gameState.defaultMapId || 'default';
      const map = validateMapExists(room, mapId);

      const tokenId = data.token.id || uuidv4();
      const token = {
        ...data.token,
        id: tokenId,
        createdBy: socket.id,
        createdAt: Date.now()
      };

      map.tokens[tokenId] = token;
      room.gameState.tokens[tokenId] = token;

      io.to(room.id).emit('token_created', {
        ...data,
        token,
        mapId,
        createdBy: socket.id,
        sequence: getNextEventSequence()
      });

      firebaseBatchWriter.queueWrite(room.id, room.gameState, true);

      if (typeof ackCallback === 'function') {
        ackCallback({ success: true, tokenId });
      }

      logger.debug('[token_created] Token created', { tokenId, mapId, roomId: room.id });

    } catch (error) {
      logger.error('[token_created] Error:', { error: error.message });
      if (typeof ackCallback === 'function') ackCallback({ success: false, error: error.message });
    }
  });

  socket.on('token_moved', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room } = validation;
      const mapId = data.mapId || room.gameState.defaultMapId || 'default';

      movementDebouncer.queueMove(room.id, data.tokenId, {
        position: data.position,
        velocity: data.velocity,
        playerId: socket.id,
        mapId: mapId
      });

    } catch (error) {
      logger.error('[token_moved] Error:', { error: error.message });
    }
  });

  socket.on('token_updated', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room } = validation;
      const mapId = data.mapId || room.gameState.defaultMapId || 'default';
      const map = validateMapExists(room, mapId);

      // CRITICAL FIX: Also check map.creatures for compatibility
      const isToken = !!map.tokens[data.tokenId];
      const isCreature = !!(map.creatures && map.creatures[data.tokenId]);
      const updates = data.updates || data.stateUpdates || {};

      if (isToken || isCreature) {
        const targetStore = isToken ? map.tokens : map.creatures;

        targetStore[data.tokenId] = {
          ...targetStore[data.tokenId],
          ...updates,
          updatedAt: Date.now()
        };

        io.to(room.id).emit('token_updated', {
          tokenId: data.tokenId,
          updates: updates,
          mapId,
          updatedBy: socket.id,
          sequence: getNextEventSequence()
        });

        const sanitizedState = stripUndefined(room.gameState);
        firebaseBatchWriter.queueWrite(room.id, sanitizedState);
      }

    } catch (error) {
      logger.error('[token_updated] Error:', { error: error.message });
    }
  });

  socket.on('token_control_granted', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) {
        logger.warn('[token_control_granted] Validation failed', {
          roomId: data.roomId,
          socketId: socket.id,
          error: validation.error
        });
        return;
      }

      const { room } = validation;
      const { targetPlayerId, targetPlayerSocketId, targetPlayerUserId } = data;

      let targetSocketId = targetPlayerSocketId;

      if (!targetSocketId) {
        for (const [pid, p] of room.players) {
          if (
            (targetPlayerId && pid === targetPlayerId) ||
            (targetPlayerUserId && p.userId === targetPlayerUserId)
          ) {
            targetSocketId = p.socketId;
            break;
          }
        }
      }

      if (targetSocketId) {
        io.to(targetSocketId).emit('token_control_granted', {
          ...data,
          grantedBySocketId: socket.id,
          sequence: getNextEventSequence()
        });
        logger.info('[token_control_granted] Forwarded to player', {
          tokenId: data.tokenId,
          targetSocketId,
          from: socket.id
        });
      } else {
        logger.warn('[token_control_granted] Target player not found', {
          targetPlayerId,
          targetPlayerUserId,
          targetPlayerSocketId,
          roomPlayers: Array.from(room.players.entries()).map(([pid, p]) => ({ id: pid, userId: p.userId, socketId: p.socketId }))
        });
      }
    } catch (error) {
      logger.error('[token_control_granted] Error:', { error: error.message });
    }
  });

  socket.on('token_control_response', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room } = validation;

      if (room.gm && room.gm.socketId) {
        io.to(room.gm.socketId).emit('token_control_response', {
          ...data,
          respondedBySocketId: socket.id,
          sequence: getNextEventSequence()
        });
        logger.info('[token_control_response] Forwarded to GM', {
          tokenId: data.tokenId,
          accepted: data.accepted,
          from: socket.id,
          to: room.gm.socketId
        });
      }
    } catch (error) {
      logger.error('[token_control_response] Error:', { error: error.message });
    }
  });

  socket.on('character_token_created', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room } = validation;
      const mapId = data.mapId || data.targetMapId || room.gameState.defaultMapId || 'default';
      const map = validateMapExists(room, mapId);

      const tokenId = data.token?.id || data.tokenId || uuidv4();
      const token = {
        ...data.token,
        id: tokenId,
        playerId: data.playerId,
        createdBy: socket.id,
        createdAt: Date.now()
      };

      map.characterTokens[tokenId] = token;
      room.gameState.characterTokens[tokenId] = token; // Legacy support

      io.to(room.id).emit('character_token_created', {
        ...data,
        token,
        mapId,
        createdBy: socket.id,
        sequence: getNextEventSequence()
      });

      firebaseBatchWriter.queueWrite(room.id, room.gameState);

    } catch (error) {
      logger.error('[character_token_created] Error:', { error: error.message });
    }
  });

  socket.on('token_removed', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room } = validation;
      const mapId = data.mapId || room.gameState.defaultMapId || 'default';
      const map = validateMapExists(room, mapId);

      delete map.tokens[data.tokenId];
      delete room.gameState.tokens[data.tokenId]; // Legacy support

      io.to(room.id).emit('token_removed', {
        tokenId: data.tokenId,
        mapId,
        removedBy: socket.id,
        sequence: getNextEventSequence()
      });

      firebaseBatchWriter.queueWrite(room.id, room.gameState);

    } catch (error) {
      logger.error('[token_removed] Error:', { error: error.message });
    }
  });

  socket.on('token_dismissed', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room } = validation;
      const mapId = data.mapId || room.gameState.defaultMapId || 'default';
      const map = validateMapExists(room, mapId);

      delete map.tokens[data.tokenId];
      delete room.gameState.tokens[data.tokenId];

      io.to(room.id).emit('token_dismissed', {
        tokenId: data.tokenId,
        mapId,
        dismissedBy: socket.id,
        sequence: getNextEventSequence()
      });

      firebaseBatchWriter.queueWrite(room.id, room.gameState);

    } catch (error) {
      logger.error('[token_dismissed] Error:', { error: error.message });
    }
  });

  socket.on('character_token_removed', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room } = validation;
      const mapId = data.mapId || room.gameState.defaultMapId || 'default';
      const map = validateMapExists(room, mapId);

      delete map.characterTokens[data.tokenId];
      delete room.gameState.characterTokens[data.tokenId]; // Legacy support

      io.to(room.id).emit('character_token_removed', {
        tokenId: data.tokenId,
        mapId,
        removedBy: socket.id,
        sequence: getNextEventSequence()
      });

      firebaseBatchWriter.queueWrite(room.id, room.gameState);

    } catch (error) {
      logger.error('[character_token_removed] Error:', { error: error.message });
    }
  });
}

module.exports = { registerTokenHandlers };
