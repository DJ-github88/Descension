/**
 * Loot Roll Handlers (Need / Greed / Pass with a d20)
 *
 * - loot_roll_start  : a room member who just dropped creature loot opens a group
 *                      roll for the (already placed, locked) loot orbs.
 * - loot_roll_choice : a player picks need / greed / pass for one item.
 * - loot_roll_reroll : a tied player rerolls against the other tied players.
 *
 * Server → client:
 * - loot_roll_started        (per socket, with yourPlayerId / canRoll)
 * - loot_roll_updated        (room)  live choices, tie prompts
 * - loot_roll_item_resolved  (room)  revealed rolls + winner
 * - loot_roll_won            (winner socket) → client auto-loots the orb
 * - loot_roll_ended          (room)
 * - grid_item_update         (room)  unlocks the orb (and reserves it for the winner)
 *
 * The rolls themselves are made here, never on a client.
 */

const { LootRollManager, clampDuration, DEFAULT_DURATION_MS } = require('../services/lootRollService');

// One manager per io instance (handlers are registered per socket connection).
const managers = new WeakMap();

function getManager(ctx) {
  const { io, rooms, players, logger, firebaseBatchWriter } = ctx;
  if (managers.has(io)) {return managers.get(io);}

  const findSocketIdForPlayer = (roomId, playerId) => {
    for (const [sid, p] of players.entries()) {
      if (p && p.roomId === roomId && p.id === playerId) {return sid;}
    }
    return null;
  };

  const manager = new LootRollManager({
    hooks: {
      broadcast: (session, event, payload) => {
        io.to(session.roomId).emit(event, payload);
      },
      onItemResolved: (session, item) => {
        const room = rooms.get(session.roomId);
        const updates = {
          lootRollLocked: false,
          lootRollSessionId: null,
          lootRollExpiresAt: null,
          lootRollWinnerId: item.winner ? item.winner.playerId : null,
          lootRollWinnerName: item.winner ? item.winner.name : null
        };

        const map = room?.gameState?.maps?.[session.mapId];
        if (map?.gridItems?.[item.gridItemId]) {
          map.gridItems[item.gridItemId] = { ...map.gridItems[item.gridItemId], ...updates };
          try {
            firebaseBatchWriter?.queueWrite?.(room.id, room.gameState);
          } catch (e) {
            logger?.warn?.('[loot_roll] persist after resolve failed', { error: e.message });
          }
        }

        io.to(session.roomId).emit('grid_item_update', {
          action: 'update',
          itemId: item.gridItemId,
          updates,
          mapId: session.mapId,
          updatedBy: 'loot_roll'
        });

        if (item.winner) {
          const sid = findSocketIdForPlayer(session.roomId, item.winner.playerId);
          if (sid) {
            io.to(sid).emit('loot_roll_won', {
              sessionId: session.id,
              dropId: item.dropId,
              gridItemId: item.gridItemId,
              mapId: session.mapId,
              itemName: item.name,
              creatureName: session.creatureName
            });
          }
        }
      }
    }
  });

  managers.set(io, manager);
  return manager;
}

function registerLootRollHandlers(ctx) {
  const { io, socket, players, logger, validateRoomMembership } = ctx;
  const manager = getManager(ctx);

  const reply = (ack, payload) => {
    if (typeof ack === 'function') {
      try {ack(payload);} catch (e) {/* ignore */}
    }
  };

  socket.on('loot_roll_start', (data, ack) => {
    try {
      const validation = validateRoomMembership(socket, data?.roomId);
      if (!validation.valid) {
        reply(ack, { success: false, error: validation.error || 'Not a room member' });
        return;
      }
      const { room, player } = validation;
      const mapId = (typeof data.mapId === 'string' && data.mapId) || room.gameState?.defaultMapId || 'default';

      // Everyone except the GM rolls. Prefer players on the creature's map; if
      // none are there, fall back to every player in the room.
      const roomPlayers = [...players.values()].filter(p => p && p.roomId === room.id && !p.isGM && p.id);
      const onMap = roomPlayers.filter(p => (p.currentMapId || 'default') === mapId);
      const rollers = (onMap.length > 0 ? onMap : roomPlayers).map(p => ({
        playerId: p.id,
        name: p.characterName || p.character?.name || p.name || 'Adventurer'
      }));

      const result = manager.startSession({
        sessionId: data.sessionId,
        roomId: room.id,
        mapId,
        creatureName: data.creatureName,
        creatureImage: data.creatureImage,
        startedBy: player.name || (player.isGM ? 'GM' : 'Player'),
        durationMs: Number.isFinite(Number(data.durationSec)) ? Number(data.durationSec) * 1000 : DEFAULT_DURATION_MS,
        items: data.items,
        eligible: rollers
      });

      if (!result.ok) {
        reply(ack, { success: false, error: result.error });
        return;
      }

      if (result.noRollers) {
        reply(ack, { success: true, noRollers: true, sessionId: result.session.id });
        return;
      }

      const view = manager.publicSession(result.session);
      const eligibleIds = new Set(rollers.map(r => r.playerId));
      for (const [sid, p] of players.entries()) {
        if (!p || p.roomId !== room.id) {continue;}
        io.to(sid).emit('loot_roll_started', {
          ...view,
          yourPlayerId: p.id,
          canRoll: eligibleIds.has(p.id)
        });
      }

      logger?.info?.('[loot_roll] session started', {
        roomId: room.id,
        sessionId: result.session.id,
        items: view.items.length,
        rollers: rollers.length,
        durationMs: clampDuration(result.session.durationMs)
      });
      reply(ack, { success: true, sessionId: result.session.id, rollers: rollers.length });
    } catch (error) {
      logger?.error?.('[loot_roll_start] Error:', { error: error.message });
      reply(ack, { success: false, error: 'Internal error' });
    }
  });

  socket.on('loot_roll_choice', (data, ack) => {
    try {
      const validation = validateRoomMembership(socket, data?.roomId);
      if (!validation.valid) {
        reply(ack, { success: false, error: 'Not a room member' });
        return;
      }
      const session = manager.getSession(data.sessionId);
      if (!session || session.roomId !== validation.room.id) {
        reply(ack, { success: false, error: 'session_not_found' });
        return;
      }
      const result = manager.choose(data.sessionId, validation.player.id, data.dropId, data.choice, data.characterName);
      reply(ack, result.ok ? { success: true } : { success: false, error: result.error });
    } catch (error) {
      logger?.error?.('[loot_roll_choice] Error:', { error: error.message });
      reply(ack, { success: false, error: 'Internal error' });
    }
  });

  socket.on('loot_roll_reroll', (data, ack) => {
    try {
      const validation = validateRoomMembership(socket, data?.roomId);
      if (!validation.valid) {
        reply(ack, { success: false, error: 'Not a room member' });
        return;
      }
      const session = manager.getSession(data.sessionId);
      if (!session || session.roomId !== validation.room.id) {
        reply(ack, { success: false, error: 'session_not_found' });
        return;
      }
      const result = manager.reroll(data.sessionId, validation.player.id, data.dropId);
      reply(ack, result.ok ? { success: true } : { success: false, error: result.error });
    } catch (error) {
      logger?.error?.('[loot_roll_reroll] Error:', { error: error.message });
      reply(ack, { success: false, error: 'Internal error' });
    }
  });
}

module.exports = { registerLootRollHandlers, getManager };
