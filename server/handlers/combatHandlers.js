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
const roomAccess = require('../services/roomAccessService');
const roomAuthority = require('../services/roomAuthorityService');

function registerCombatHandlers(ctx) {
  const {
    io,
    socket,
    rooms,
    players,
    logger,
    validateRoomMembership,
    firebaseBatchWriter,
    firebaseService,
    authorityService
  } = ctx;

  socket.on('combat_started', (data, ackCallback) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) {
        if (typeof ackCallback === 'function') {ackCallback({ success: false, error: 'Not a room member' });}
        return;
      }

      const { room, player } = validation;

      const auth = combatAuthority.canStartOrEndCombat(player, room);
      if (!auth.allowed) {
        logger.warn('[combat_started] rejected by authority check', {
          playerId: player?.id, reason: auth.reason
        });
        if (typeof ackCallback === 'function') {ackCallback({ success: false, error: auth.reason });}
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

      io.to(room.id).emit('combat_started', {
        combat: room.gameState.combat
      });

      firebaseBatchWriter.queueWrite(room.id, room.gameState, true);

      if (typeof ackCallback === 'function') {
        ackCallback({ success: true, combat: room.gameState.combat });
      }

    } catch (error) {
      logger.error('[combat_started] Error:', { error: error.message });
      if (typeof ackCallback === 'function') {ackCallback({ success: false, error: error.message });}
    }
  });

  socket.on('combat_ended', (data, ackCallback) => {
    try {
      const validation = validateRoomMembership(socket, data?.roomId);
      if (!validation.valid) {
        if (typeof ackCallback === 'function') {ackCallback({ success: false, error: 'Not a room member' });}
        return;
      }

      const { room, player } = validation;

      const auth = combatAuthority.canStartOrEndCombat(player, room);
      if (!auth.allowed) {
        logger.warn('[combat_ended] rejected by authority check', {
          playerId: player?.id, reason: auth.reason
        });
        if (typeof ackCallback === 'function') {ackCallback({ success: false, error: auth.reason });}
        return;
      }

      room.gameState.combat = {
        isActive: false,
        currentTurnIndex: null,
        turnOrder: [],
        round: 0
      };

      io.to(room.id).emit('combat_ended');

      firebaseBatchWriter.queueWrite(room.id, room.gameState, true);

      if (typeof ackCallback === 'function') {
        ackCallback({ success: true });
      }

    } catch (error) {
      logger.error('[combat_ended] Error:', { error: error.message });
      if (typeof ackCallback === 'function') {ackCallback({ success: false, error: error.message });}
    }
  });

  socket.on('combat_log', (data) => {
    try {
      const validation = validateRoomMembership(socket, data?.roomId);
      if (!validation.valid) {return;}

      const { room } = validation;
      const sanitized = {
        playerId: socket.player?.id || socket.id,
        playerName: data.playerName || socket.player?.name || 'Unknown',
        notification: data.notification,
        timestamp: data.timestamp || new Date().toISOString()
      };

      socket.to(room.id).emit('combat_log', sanitized);
    } catch (error) {
      logger.error('[combat_log] Error:', { error: error.message });
    }
  });

  socket.on('dice_update', (data) => {
    try {
      const validation = validateRoomMembership(socket, data?.roomId);
      if (!validation.valid) {return;}

      const { room, player } = validation;
      socket.to(room.id).emit('dice_update', {
        ...data,
        playerId: player.id,
        playerName: player.name
      });
    } catch (error) {
      logger.error('[dice_update] Error:', { error: error.message });
    }
  });

  socket.on('combat_turn_changed', (data) => {
    try {
      const validation = validateRoomMembership(socket, data?.roomId);
      if (!validation.valid) {return;}

      const { room, player } = validation;

      if (!room.gameState.combat?.isActive) {
        logger.warn('[combat_turn_changed] ignored: combat not active', {
          roomId: data?.roomId || room.id, playerId: player?.id
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

      io.to(room.id).emit('combat_turn_changed', {
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

  socket.on('item_looted', async(data) => {
    try {
      const validation = validateRoomMembership(socket, data?.roomId);
      if (!validation.valid) {return;}

      const { room, player } = validation;
      const mapId = data.mapId || player.currentMapId || 'default';
      const map = room.gameState.maps && room.gameState.maps[mapId];

      let foundKey = data.gridItemId;
      if (map && map.gridItems) {
        if (!map.gridItems[foundKey]) {
          const rawKey = String(foundKey || '');
          const altKey = rawKey.startsWith('grid-item-') ? rawKey.slice(10) : `grid-item-${rawKey}`;
          if (map.gridItems[altKey]) {
            foundKey = altKey;
          } else {
            const match = Object.entries(map.gridItems).find(([k, v]) =>
              k === foundKey || v?.id === foundKey || v?.itemId === foundKey || v?.originalItemId === foundKey
            );
            if (match) {
              foundKey = match[0];
            }
          }
        }
        if (map.gridItems[foundKey]) {
          delete map.gridItems[foundKey];
        }
      }

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

  /**
   * Project 4 private inventory delivery.
   *
   * Authorship is verified against the persisted character owner
   * (characters/{id}.metadata.userId). The legacy playerId field is only a
   * character selector. Delivery is restricted to the owner's authorized
   * devices plus, only while an explicit H14 consent is active, the exact
   * current GM. There is no room broadcast.
   */
  socket.on('inventory_update', async(data) => {
    try {
      const validation = validateRoomMembership(socket, data?.roomId);
      if (!validation.valid) {return;}

      const { room } = validation;
      const uid = socket.data?.userId || null;
      if (!uid) {return;}

      const characterId = data && typeof data.playerId === 'string' ? data.playerId : null;
      if (!characterId || !data.inventoryData || typeof data.inventoryData !== 'object') {return;}

      const owner = firebaseService && typeof firebaseService.getCharacterOwner === 'function'
        ? await firebaseService.getCharacterOwner(characterId)
        : { ok: false, reason: 'owner_unverifiable' };
      if (!owner.ok || owner.userId !== uid) {
        logger.warn('[inventory_update] Private inventory update refused (owner unverified)', {
          characterId, uid, reason: owner.reason
        });
        return;
      }

      // Reauthorize after the ownership await: identity, membership and room
      // generation must still be current before any private delivery.
      const postValidation = validateRoomMembership(socket, data?.roomId);
      if (!postValidation.valid || postValidation.player?.userId !== uid) {return;}
      const liveRoom = postValidation.room;

      // B5: the SAME originating authority epoch captured at entry must still
      // be current after the ownership await. Never adopt a successor token.
      if (authorityService) {
        const contextCheck = await roomAuthority.assertOperationContext(
          roomAuthority.getOperationContext(data), authorityService,
          { binding: { rooms, players, socketId: socket.id } }
        );
        if (!contextCheck.ok) {return;}
      }

      // Bounded retry-stable duplicate suppression.
      const updateId = typeof data.updateId === 'string' && data.updateId.length > 0 && data.updateId.length <= 200
        ? data.updateId
        : null;
      if (updateId) {
        if (!socket.data.inventoryUpdateIds) {socket.data.inventoryUpdateIds = new Set();}
        if (socket.data.inventoryUpdateIds.has(updateId)) {return;}
        socket.data.inventoryUpdateIds.add(updateId);
        if (socket.data.inventoryUpdateIds.size > 100) {
          const oldest = socket.data.inventoryUpdateIds.values().next().value;
          socket.data.inventoryUpdateIds.delete(oldest);
        }
      }

      const payload = {
        playerId: characterId,
        inventoryData: data.inventoryData,
        changeType: data.changeType,
        updateId,
        timestamp: data.timestamp || new Date().toISOString()
      };

      // Owner's authorized devices only (same verified account, same room).
      for (const peer of io.sockets.sockets.values()) {
        if (peer.id === socket.id) {continue;}
        if (!peer.data || peer.data.userId !== uid) {continue;}
        if (!peer.rooms || typeof peer.rooms.has !== 'function' || !peer.rooms.has(room.id)) {continue;}
        peer.emit('inventory_update', payload);
      }

      // Optional explicit H14 GM share: read-only, session-scoped, terminated
      // when the membership/session/GM conditions no longer hold. Delivery
      // requires the exact current room, character, owner, current GM and
      // current GM session recorded at grant time.
      const share = liveRoom.inventoryShares && liveRoom.inventoryShares[characterId];
      if (share && share.ownerUserId === uid && share.gmUserId === liveRoom.gmId &&
        share.roomId === liveRoom.id && share.sessionId && share.sessionId === liveRoom.gmSessionId &&
        (liveRoom.gmDisconnectedAt === null || liveRoom.gmDisconnectedAt === undefined)) {
        const gmSocket = liveRoom.gm && liveRoom.gm.socketId ? io.sockets.sockets.get(liveRoom.gm.socketId) : null;
        if (gmSocket && gmSocket.data && gmSocket.data.userId === liveRoom.gmId) {
          gmSocket.emit('inventory_update', {
            ...payload,
            sharedWithGm: true,
            ownerUserId: uid
          });
        }
      }

    } catch (error) {
      logger.error('[inventory_update] Error:', { error: error.message });
    }
  });

  socket.on('inventory_share_grant', async(data, ackCallback) => {
    const respond = (payload) => { if (typeof ackCallback === 'function') {ackCallback(payload);} };
    try {
      const validation = validateRoomMembership(socket, data?.roomId);
      if (!validation.valid) {
        respond({ success: false, error: 'Not a room member', code: roomAccess.DENIAL_CODES.NOT_ROOM_MEMBER });
        return;
      }
      const { room } = validation;
      const uid = socket.data?.userId || null;
      const characterId = data && typeof data.characterId === 'string' ? data.characterId : null;
      if (!uid || !characterId) {
        respond({ success: false, error: 'Character is required', code: roomAccess.DENIAL_CODES.PRIVATE_DATA_FORBIDDEN });
        return;
      }
      if (room.isPermanent) {
        const identity = roomAccess.checkDurableRoomIdentity(socket);
        if (!identity.allowed) {
          respond({ success: false, error: 'Account required', code: identity.code });
          return;
        }
      }
      const gmDisconnected = room.gmDisconnectedAt !== null && room.gmDisconnectedAt !== undefined;
      if (!roomAccess.isValidOwnerId(room.gmId) || !room.gm || !room.gm.socketId || gmDisconnected) {
        respond({ success: false, error: 'Room has no active GM', code: roomAccess.DENIAL_CODES.SHARE_CONSENT_REQUIRED });
        return;
      }
      const owner = firebaseService && typeof firebaseService.getCharacterOwner === 'function'
        ? await firebaseService.getCharacterOwner(characterId)
        : { ok: false, reason: 'owner_unverifiable' };
      if (!owner.ok || owner.userId !== uid) {
        respond({ success: false, error: 'Character ownership could not be verified', code: roomAccess.DENIAL_CODES.PRIVATE_DATA_FORBIDDEN });
        return;
      }

      // Reauthorize after the ownership await: membership, room generation,
      // current GM and active GM session must still match.
      const postValidation = validateRoomMembership(socket, data?.roomId);
      if (!postValidation.valid || postValidation.player?.userId !== uid || postValidation.room !== room) {
        respond({ success: false, error: 'Not a room member', code: roomAccess.DENIAL_CODES.NOT_ROOM_MEMBER });
        return;
      }
      // B5: the originating authority epoch must still be current after the
      // ownership await before granting consent.
      if (authorityService) {
        const contextCheck = await roomAuthority.assertOperationContext(
          roomAuthority.getOperationContext(data), authorityService,
          { binding: { rooms, players, socketId: socket.id } }
        );
        if (!contextCheck.ok) {
          respond({ success: false, error: 'Room is not currently available on this server', code: contextCheck.code });
          return;
        }
      }
      const gmDisconnectedNow = room.gmDisconnectedAt !== null && room.gmDisconnectedAt !== undefined;
      if (!roomAccess.isValidOwnerId(room.gmId) || !room.gm || !room.gm.socketId || gmDisconnectedNow || !room.gmSessionId) {
        respond({ success: false, error: 'Room has no active GM session', code: roomAccess.DENIAL_CODES.SHARE_CONSENT_REQUIRED });
        return;
      }

      if (!room.inventoryShares) {room.inventoryShares = {};}
      room.inventoryShares[characterId] = {
        characterId,
        ownerUserId: uid,
        gmUserId: room.gmId,
        roomId: room.id,
        sessionId: room.gmSessionId,
        grantedAt: Date.now(),
        readOnly: true
      };

      const gmSocket = io.sockets.sockets.get(room.gm.socketId);
      if (gmSocket) {
        gmSocket.emit('inventory_share_active', { characterId, ownerUserId: uid, readOnly: true });
      }
      socket.emit('inventory_share_status', {
        characterId, active: true, gmUserId: room.gmId, readOnly: true
      });
      respond({ success: true });
      logger.info('[inventory_share_grant] Inventory share activated', { roomId: room.id, characterId, uid });
    } catch (error) {
      logger.error('[inventory_share_grant] Error:', { error: error.message });
      respond({ success: false, error: 'Share could not be granted' });
    }
  });

  socket.on('inventory_share_revoke', async(data, ackCallback) => {
    const respond = (payload) => { if (typeof ackCallback === 'function') {ackCallback(payload);} };
    try {
      const validation = validateRoomMembership(socket, data?.roomId);
      if (!validation.valid) {
        respond({ success: false, error: 'Not a room member', code: roomAccess.DENIAL_CODES.NOT_ROOM_MEMBER });
        return;
      }
      const { room } = validation;
      const uid = socket.data?.userId || null;
      const characterId = data && typeof data.characterId === 'string' ? data.characterId : null;
      const share = characterId && room.inventoryShares ? room.inventoryShares[characterId] : null;
      if (!share || share.ownerUserId !== uid) {
        respond({ success: true, alreadyInactive: true });
        return;
      }
      delete room.inventoryShares[characterId];

      const gmSocket = room.gm && room.gm.socketId ? io.sockets.sockets.get(room.gm.socketId) : null;
      if (gmSocket) {
        gmSocket.emit('inventory_share_ended', { characterId, reason: 'revoked' });
      }
      socket.emit('inventory_share_status', { characterId, active: false });
      respond({ success: true });
      logger.info('[inventory_share_revoke] Inventory share revoked', { roomId: room.id, characterId, uid });
    } catch (error) {
      logger.error('[inventory_share_revoke] Error:', { error: error.message });
      respond({ success: false, error: 'Share could not be revoked' });
    }
  });

  // Spell cast relay. The server stamps the caster identity so clients cannot
  // spoof who cast (the client emits casterId = characterId, casterName = unset).
  socket.on('spell_cast', (data) => {
    try {
      const validation = validateRoomMembership(socket, data?.roomId);
      if (!validation.valid) {return;}

      const { player, room } = validation;

      socket.to(room.id).emit('spell_cast', {
        ...data,
        spellId: data?.spellId,
        spellName: data?.spellName,
        casterId: data?.casterId || player.id,
        casterName: player.name,
        playerId: player.id,
        timestamp: data?.timestamp || Date.now()
      });
    } catch (error) {
      logger.error('[spell_cast] Error:', { error: error.message });
    }
  });

  // Dice roll relay. Honors room.settings.diceVisibility (set via GM Tools):
  //   'all'     -> broadcast to everyone else
  //   'gm'      -> deliver only to the GM
  //   'private' -> do not broadcast
  socket.on('dice_roll', (data) => {
    try {
      const validation = validateRoomMembership(socket, data?.roomId);
      if (!validation.valid) {return;}

      const { player, room } = validation;
      const visibility = room.settings?.diceVisibility || 'all';
      if (visibility === 'private') {return;}

      const payload = {
        ...data,
        playerId: player.id,
        playerName: data?.playerName || player.name,
        characterName: data?.characterName || player.character?.name || null
      };

      if (visibility === 'gm') {
        // The roller already sees the result locally; only forward to a GM who
        // is not the roller.
        if (!player.isGM && room.gm?.socketId) {
          io.to(room.gm.socketId).emit('dice_roll_result', payload);
        }
      } else {
        socket.to(room.id).emit('dice_roll_result', payload);
      }
    } catch (error) {
      logger.error('[dice_roll] Error:', { error: error.message });
    }
  });
}

module.exports = { registerCombatHandlers };
