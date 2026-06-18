/**
 * Combat Handlers
 *
 * Combat state synchronization and combat-adjacent events:
 * - combat_started / combat_ended: lifecycle with ack callbacks
 * - combat_log: per-room combat notification relay
 * - combat_turn_changed: turn order progression (persisted for permanent rooms)
 * - item_looted: grid item removal on loot (server-authoritative)
 * - inventory_update: peer-to-peer inventory change broadcast
 */

function registerCombatHandlers(ctx) {
  const {
    io,
    socket,
    logger,
    validateRoomMembership,
    firebaseBatchWriter
  } = ctx;

  socket.on('combat_started', (data, ackCallback) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) {
        if (typeof ackCallback === 'function') ackCallback({ success: false, error: 'Not a room member' });
        return;
      }

      const { room } = validation;

      room.gameState.combat = {
        isActive: true,
        currentTurnIndex: 0,
        turnOrder: data.turnOrder || [],
        round: 1,
        currentTurnStartTime: Date.now()
      };

      io.to(data.roomId).emit('combat_started', {
        combat: room.gameState.combat
      });

      firebaseBatchWriter.queueWrite(data.roomId, room.gameState, true);

      if (typeof ackCallback === 'function') {
        ackCallback({ success: true, combat: room.gameState.combat });
      }

    } catch (error) {
      logger.error('[combat_started] Error:', { error: error.message });
      if (typeof ackCallback === 'function') ackCallback({ success: false, error: error.message });
    }
  });

  socket.on('combat_ended', (data, ackCallback) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) {
        if (typeof ackCallback === 'function') ackCallback({ success: false, error: 'Not a room member' });
        return;
      }

      const { room } = validation;

      room.gameState.combat = {
        isActive: false,
        currentTurnIndex: null,
        turnOrder: [],
        round: 0
      };

      io.to(data.roomId).emit('combat_ended');

      firebaseBatchWriter.queueWrite(data.roomId, room.gameState, true);

      if (typeof ackCallback === 'function') {
        ackCallback({ success: true });
      }

    } catch (error) {
      logger.error('[combat_ended] Error:', { error: error.message });
      if (typeof ackCallback === 'function') ackCallback({ success: false, error: error.message });
    }
  });

  socket.on('combat_log', (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const sanitized = {
        playerId: socket.player?.id || socket.id,
        playerName: data.playerName || socket.player?.name || 'Unknown',
        notification: data.notification,
        timestamp: data.timestamp || new Date().toISOString()
      };

      socket.to(data.roomId).emit('combat_log', sanitized);
    } catch (error) {
      logger.error('[combat_log] Error:', { error: error.message });
    }
  });

  socket.on('combat_turn_changed', (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room } = validation;

      if (room.gameState.combat?.isActive) {
        room.gameState.combat.currentTurnIndex = data.turnIndex;
        room.gameState.combat.currentTurnStartTime = Date.now();

        if (data.round) {
          room.gameState.combat.round = data.round;
        }

        io.to(data.roomId).emit('combat_turn_changed', {
          turnIndex: data.turnIndex,
          round: room.gameState.combat.round
        });

        if (room.isPermanent) {
          firebaseBatchWriter.queueWrite(room.id, room.gameState);
        }
      }

    } catch (error) {
      logger.error('[combat_turn_changed] Error:', { error: error.message });
    }
  });

  socket.on('item_looted', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room, player } = validation;
      const mapId = data.mapId || player.currentMapId || 'default';
      const map = room.gameState.maps && room.gameState.maps[mapId];

      if (!map || !map.gridItems || !map.gridItems[data.gridItemId]) {
        socket.emit('item_loot_rejected', {
          gridItemId: data.gridItemId,
          reason: 'item_not_found',
          mapId,
          timestamp: new Date().toISOString()
        });
        return;
      }

      delete map.gridItems[data.gridItemId];

      io.to(room.id).emit('item_looted', {
        gridItemId: data.gridItemId,
        item: data.item,
        quantity: data.quantity,
        source: data.source,
        looter: data.looter,
        playerId: player.id,
        itemRemoved: true,
        mapId,
        timestamp: new Date().toISOString()
      });

      firebaseBatchWriter.queueWrite(room.id, room.gameState);

    } catch (error) {
      logger.error('[item_looted] Error:', { error: error.message });
    }
  });

  socket.on('inventory_update', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room, player } = validation;

      socket.to(room.id).emit('inventory_update', {
        playerId: data.playerId,
        inventoryData: data.inventoryData,
        changeType: data.changeType,
        timestamp: data.timestamp || new Date().toISOString()
      });

    } catch (error) {
      logger.error('[inventory_update] Error:', { error: error.message });
    }
  });
}

module.exports = { registerCombatHandlers };
