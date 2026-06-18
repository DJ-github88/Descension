/**
 * Character Management Handlers
 *
 * Per-player character state synchronization (resources, equipment, movement):
 * - character_moved: relay position updates (also updates player's currentMapId)
 * - character_resource_delta: apply incremental resource changes (health/mana/AP)
 * - character_updated: full character data sync (including GM character sync)
 * - character_equipment_updated: equipment changes broadcast
 * - character_resource_updated: full resource state sync (health/mana/AP/classResource)
 *   (resolves target player via playerId, senderSocketId, or GM fallback)
 * - buff_update / debuff_update: per-token buff/debuff state relay + persistence
 */

function registerCharacterHandlers(ctx) {
  const {
    io,
    socket,
    rooms,
    logger,
    validateRoomMembership,
    firebaseBatchWriter
  } = ctx;

  socket.on('character_moved', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room, player } = validation;
      const mapId = data.mapId || room.gameState.defaultMapId || 'default';

      // Update player's current map if changed
      if (data.mapId && data.mapId !== player.currentMapId) {
        player.currentMapId = data.mapId;
        if (room.gameState.playerMapAssignments) {
          room.gameState.playerMapAssignments[player.id] = data.mapId;
        }
      }

      socket.to(room.id).emit('character_moved', {
        playerId: player.id,
        characterId: data.characterId || player.id,
        tokenId: data.tokenId,
        position: data.position,
        mapId,
        timestamp: Date.now()
      });

    } catch (error) {
      logger.error('[character_moved] Error:', { error: error.message });
    }
  });

  socket.on('character_resource_delta', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room, player } = validation;

      if (data.resource === 'health' && player.character?.health) {
        player.character.health.current = Math.max(0, Math.min(
          player.character.health.max,
          (player.character.health.current || 0) + (data.delta || 0)
        ));
      } else if (data.resource === 'mana' && player.character?.mana) {
        player.character.mana.current = Math.max(0, Math.min(
          player.character.mana.max,
          (player.character.mana.current || 0) + (data.delta || 0)
        ));
      } else if (data.resource === 'actionPoints' && player.character?.actionPoints) {
        player.character.actionPoints.current = Math.max(0, Math.min(
          player.character.actionPoints.max,
          (player.character.actionPoints.current || 0) + (data.delta || 0)
        ));
      }

      io.to(data.roomId).emit('character_resource_delta', {
        playerId: player.id,
        resource: data.resource,
        delta: data.delta,
        timestamp: Date.now()
      });

      if (room.isPermanent) {
        firebaseBatchWriter.queueWrite(room.id, room.gameState);
      }

    } catch (error) {
      logger.error('[character_resource_delta] Error:', { error: error.message });
    }
  });

  socket.on('character_updated', async (data) => {
    logger.debug(`character_updated received`, {
      socketId: socket.id,
      characterId: data.characterId,
      hasCharacter: !!data.character
    });
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) {
        logger.warn(`character_updated validation failed:`, { error: validation.error });
        return;
      }

      const { room, player } = validation;
      logger.debug(`character_updated validated`, { playerId: player.id, roomId: room.id });

      if (data.character) {
        player.character = {
          ...player.character,
          ...data.character,
          lastUpdated: Date.now()
        };

        room.players.set(player.id, player);

        // CRITICAL FIX: Also update room.gm if this is the GM
        if (player.isGM || room.gm?.socketId === socket.id || room.gm?.id === player.id) {
          room.gm.character = player.character;
          logger.debug('[character_updated] Updated room.gm.character for GM sync');
        }
      }

      // CRITICAL FIX: Use room.id instead of data.roomId (which may be undefined)
      const broadcastRoomId = room.id;
      logger.debug(`Broadcasting character_updated`, {
        roomId: broadcastRoomId,
        playerId: player.id,
        isGM: player.isGM || room.gm?.socketId === socket.id
      });

      io.to(broadcastRoomId).emit('character_updated', {
        playerId: player.id,
        characterId: data.characterId,
        character: player.character,
        updatedBy: socket.id,
        senderSocketId: socket.id,
        senderUserId: socket.data.userId || data.userId,
        isGM: player.isGM || room.gm?.socketId === socket.id,
        timestamp: Date.now()
      });

      logger.debug('[character_updated] Character updated', { playerId: player.id });

      if (room.isPermanent) {
        firebaseBatchWriter.queueWrite(room.id, room.gameState);
      }

    } catch (error) {
      logger.error('[character_updated] Error:', { error: error.message });
    }
  });

  socket.on('character_equipment_updated', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room, player } = validation;

      if (data.equipment && player.character) {
        player.character.equipment = {
          ...player.character.equipment,
          ...data.equipment
        };
        room.players.set(player.id, player);
      }

      socket.to(data.roomId).emit('character_equipment_updated', {
        playerId: player.id,
        equipment: data.equipment,
        updatedBy: socket.id
      });

      if (room.isPermanent) {
        firebaseBatchWriter.queueWrite(room.id, room.gameState);
      }

    } catch (error) {
      logger.error('[character_equipment_updated] Error:', { error: error.message });
    }
  });

  socket.on('character_resource_updated', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room, player: senderPlayer } = validation;

      let targetPlayer = null;
      let isGMUpdate = false;

      if (data.playerId) {
        targetPlayer = room.players.get(data.playerId);
      }

      if (!targetPlayer && room.gm && (socket.id === room.gm.socketId || data.senderSocketId === room.gm.socketId)) {
        targetPlayer = room.gm;
        isGMUpdate = true;
      }

      if (!targetPlayer && data.senderSocketId) {
        for (const [pid, p] of room.players) {
          if (p.socketId === data.senderSocketId) {
            targetPlayer = p;
            break;
          }
        }
      }

      if (!targetPlayer) {
        logger.warn('[character_resource_updated] Target player not found', {
          playerId: data.playerId,
          senderSocketId: data.senderSocketId,
          isGM: senderPlayer?.isGM
        });
        return;
      }

      if (!targetPlayer.character) {
        targetPlayer.character = {};
      }

      if (data.resource === 'health') {
        targetPlayer.character.health = targetPlayer.character.health || { current: 0, max: 0 };
        targetPlayer.character.health.current = data.current;
        targetPlayer.character.health.max = data.max;
        if (data.temp !== undefined) {
          targetPlayer.character.tempHealth = data.temp;
        }
      } else if (data.resource === 'mana') {
        targetPlayer.character.mana = targetPlayer.character.mana || { current: 0, max: 0 };
        targetPlayer.character.mana.current = data.current;
        targetPlayer.character.mana.max = data.max;
        if (data.temp !== undefined) {
          targetPlayer.character.tempMana = data.temp;
        }
      } else if (data.resource === 'actionPoints') {
        targetPlayer.character.actionPoints = targetPlayer.character.actionPoints || { current: 0, max: 0 };
        targetPlayer.character.actionPoints.current = data.current;
        targetPlayer.character.actionPoints.max = data.max;
        if (data.temp !== undefined) {
          targetPlayer.character.tempActionPoints = data.temp;
        }
      } else if (data.resource === 'classResource') {
        if (data.classResource) {
          targetPlayer.character.classResource = data.classResource;
        } else {
          targetPlayer.character.classResource = targetPlayer.character.classResource || { current: 0, max: 0 };
          targetPlayer.character.classResource.current = data.current;
          targetPlayer.character.classResource.max = data.max;
        }
      }

      if (isGMUpdate) {
        room.gm = targetPlayer;
      } else {
        room.players.set(targetPlayer.id, targetPlayer);
      }

      io.to(data.roomId).emit('character_resource_updated', {
        playerId: targetPlayer.id,
        userId: targetPlayer.userId || targetPlayer.id,
        socketId: targetPlayer.socketId,
        playerName: targetPlayer.name,
        resource: data.resource,
        current: data.current,
        max: data.max,
        temp: data.temp,
        adjustment: data.adjustment,
        classResource: data.classResource,
        updatedBy: socket.id,
        senderSocketId: data.senderSocketId,
        isGM: isGMUpdate
      });

      logger.debug('[character_resource_updated] Resource updated', {
        playerId: targetPlayer.id,
        resource: data.resource,
        isGM: isGMUpdate
      });

      if (room.isPermanent) {
        firebaseBatchWriter.queueWrite(room.id, room.gameState);
      }

    } catch (error) {
      logger.error('[character_resource_updated] Error:', { error: error.message });
    }
  });

  socket.on('buff_update', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId || data.data?.roomId);
      if (!validation.valid) return;

      const roomId = data.roomId || data.data?.roomId;
      const room = rooms.get(roomId);
      if (room) {
        if (!room.gameState.buffs) room.gameState.buffs = {};
        if (data.tokenId && data.buff) {
          room.gameState.buffs[data.tokenId] = data.buff;
        } else if (data.buffs) {
          room.gameState.buffs = { ...room.gameState.buffs, ...data.buffs };
        }
        firebaseBatchWriter.queueWrite(roomId, room.gameState);
      }

      socket.to(roomId).emit('buff_update', {
        ...data,
        senderSocketId: socket.id
      });
    } catch (error) {
      logger.error('[buff_update] Error:', { error: error.message });
    }
  });

  socket.on('debuff_update', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId || data.data?.roomId);
      if (!validation.valid) return;

      const roomId = data.roomId || data.data?.roomId;
      const room = rooms.get(roomId);
      if (room) {
        if (!room.gameState.debuffs) room.gameState.debuffs = {};
        if (data.tokenId && data.debuff) {
          room.gameState.debuffs[data.tokenId] = data.debuff;
        } else if (data.debuffs) {
          room.gameState.debuffs = { ...room.gameState.debuffs, ...data.debuffs };
        }
        firebaseBatchWriter.queueWrite(roomId, room.gameState);
      }

      socket.to(roomId).emit('debuff_update', {
        ...data,
        senderSocketId: socket.id
      });
    } catch (error) {
      logger.error('[debuff_update] Error:', { error: error.message });
    }
  });
}

module.exports = { registerCharacterHandlers };
