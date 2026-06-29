/**
 * Combat Handlers
 *
 * Combat state synchronization and combat-adjacent events:
 * - combat_started / combat_ended: lifecycle with ack callbacks
 * - combat_log: per-room combat notification relay
 * - combat_turn_changed: turn order progression (persisted for permanent rooms)
 * - item_looted: grid item removal on loot (server-authoritative)
 * - inventory_update: peer-to-peer inventory change broadcast
 *
 * Authority: when COMBAT_AUTHORITY_ENFORCEMENT=true, combat_started and
 * combat_ended are GM-only and combat_turn_changed is GM-or-current-turn-holder.
 * Default cooperative-VTT behaviour is unchanged when the flag is unset.
 *
 * Field name note: combatStore.js emits currentTurnIndex; legacy GMToolsPanel
 * code emits turnIndex. The Joi schema in validationService.js normalises both
 * to currentTurnIndex before this handler runs.
 */

const combatAuthority = require('../services/combatAuthority');

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

      const { room, player } = validation;

      const auth = combatAuthority.canStartOrEndCombat(player, room);
      if (!auth.allowed) {
        logger.warn('[combat_started] rejected by authority check', {
          playerId: player?.id, reason: auth.reason
        });
        if (typeof ackCallback === 'function') ackCallback({ success: false, error: auth.reason });
        return;
      }

      const turnOrder = Array.isArray(data.turnOrder) ? data.turnOrder : [];
      const requestedIndex = Number.isInteger(data.currentTurnIndex) ? data.currentTurnIndex : 0;
      const safeIndex = turnOrder.length > 0
        ? Math.min(Math.max(0, requestedIndex), turnOrder.length - 1)
        : 0;

      room.gameState.combat = {
        isActive: true,
        currentTurnIndex: safeIndex,
        turnOrder,
        round: Number.isInteger(data.round) && data.round > 0 ? data.round : 1,
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

      const { room, player } = validation;

      const auth = combatAuthority.canStartOrEndCombat(player, room);
      if (!auth.allowed) {
        logger.warn('[combat_ended] rejected by authority check', {
          playerId: player?.id, reason: auth.reason
        });
        if (typeof ackCallback === 'function') ackCallback({ success: false, error: auth.reason });
        return;
      }

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

      const { room, player } = validation;

      if (!room.gameState.combat?.isActive) {
        logger.warn('[combat_turn_changed] ignored — combat not active', {
          roomId: data.roomId, playerId: player?.id
        });
        return;
      }

      const auth = combatAuthority.canChangeTurn(player, room);
      if (!auth.allowed) {
        logger.warn('[combat_turn_changed] rejected by authority check', {
          playerId: player?.id, reason: auth.reason
        });
        socket.emit('combat_turn_rejected', {
          reason: auth.reason,
          currentTurnIndex: room.gameState.combat.currentTurnIndex
        });
        return;
      }

      const turnOrder = room.gameState.combat.turnOrder || [];
      const requestedIndex = data.currentTurnIndex;
      if (!Number.isInteger(requestedIndex) || requestedIndex < 0 || requestedIndex >= turnOrder.length) {
        logger.warn('[combat_turn_changed] out-of-range turnIndex', {
          requestedIndex, turnOrderLength: turnOrder.length
        });
        return;
      }

      room.gameState.combat.currentTurnIndex = requestedIndex;
      room.gameState.combat.currentTurnStartTime = Date.now();

      if (data.round && data.round > 0) {
        room.gameState.combat.round = data.round;
      }

      io.to(data.roomId).emit('combat_turn_changed', {
        currentTurnIndex: room.gameState.combat.currentTurnIndex,
        round: room.gameState.combat.round,
        turnOrder
      });

      if (room.isPermanent) {
        firebaseBatchWriter.queueWrite(room.id, room.gameState);
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
