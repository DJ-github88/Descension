/**
 * GM Action Handlers
 *
 * Game Master administrative actions (all require GM membership):
 * - gm_switch_view: GM switches to a different map (returns full map data) OR toggles viewMode
 * - gm_transfer_player: GM teleports player to another map (sends forced_map_transfer to target)
 * - gm_request_fresh_positions: GM requests server-authoritative token positions for a map
 * - player_use_connection: player uses a portal/connection (updates currentMapId)
 * - gm_action: generic GM broadcast with server-side mutation (clear_fog, reset_combat, heal_all)
 * - sync_gameplay_settings: GM pushes room settings changes
 * - gm_note_update: GM saves a note (persisted on room.gmNotes)
 */

function registerGmActionHandlers(ctx) {
  const {
    io,
    socket,
    logger,
    validateRoomMembership,
    validateMapExists,
    firebaseBatchWriter
  } = ctx;

  socket.on('gm_switch_view', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId, true);
      if (!validation.valid) return;

      const { room, player } = validation;

      if (data.newMapId) {
        const targetMapId = data.newMapId;

        player.currentMapId = targetMapId;
        if (room.gameState.playerMapAssignments) {
          room.gameState.playerMapAssignments[player.id] = targetMapId;
        }

        const targetMap = validateMapExists(room, targetMapId, data.mapName);

        const mapData = {
          terrainData: targetMap.terrainData || {},
          wallData: targetMap.wallData || {},
          windowOverlays: targetMap.windowOverlays || {},
          drawingPaths: targetMap.drawingPaths || [],
          drawingLayers: targetMap.drawingLayers || [],
          fogOfWarData: targetMap.fogOfWarData || {},
          fogOfWarPaths: targetMap.fogOfWarPaths || [],
          fogErasePaths: targetMap.fogErasePaths || [],
          dndElements: targetMap.dndElements || [],
          environmentalObjects: targetMap.environmentalObjects || [],
          lightSources: targetMap.lightSources || {},
          backgrounds: targetMap.backgrounds || [],
          activeBackgroundId: targetMap.activeBackgroundId || null,
          tokens: targetMap.tokens || {},
          characterTokens: targetMap.characterTokens || {},
          gridItems: targetMap.gridItems || {},
          gridSettings: targetMap.gridSettings || {}
        };

        socket.emit('gm_view_changed', {
          gmId: player.id,
          gmName: player.name,
          newMapId: targetMapId,
          mapName: data.mapName || targetMap.name || targetMapId,
          mapData
        });

        logger.info(`[gm_switch_view] GM ${player.name} switched to map ${targetMapId}`);
        return;
      }

      player.gmViewMode = data.viewMode || 'player';
      socket.to(data.roomId).emit('gm_view_changed', {
        gmId: player.id,
        viewMode: player.gmViewMode
      });

    } catch (error) {
      logger.error('[gm_switch_view] Error:', { error: error.message });
    }
  });

  socket.on('gm_transfer_player', async (data) => {
    try {
      logger.info('[gm_transfer_player] Request received', {
        roomId: data.roomId,
        playerId: data.playerId,
        targetMapId: data.targetMapId,
        destinationMapName: data.destinationMapName,
        senderSocketId: socket.id
      });

      const validation = validateRoomMembership(socket, data.roomId, true);
      if (!validation.valid) {
        logger.warn('[gm_transfer_player] Validation failed', {
          roomId: data.roomId,
          playerId: data.playerId
        });
        return;
      }

      const { room } = validation;

      logger.info('[gm_transfer_player] Room state', {
        roomId: room.id,
        gmId: room.gm?.id,
        gmSocketId: room.gm?.socketId,
        gmUserId: room.gmId,
        playersCount: room.players.size,
        playerIds: Array.from(room.players.keys())
      });

      let targetPlayer = room.players.get(data.playerId);

      if (!targetPlayer && room.gm) {
        const gmIdMatches =
          room.gm.id === data.playerId ||
          room.gm.socketId === data.playerId ||
          room.gm.socketId === socket.id ||
          room.gmId === data.playerId ||
          (room.gm.userId && room.gm.userId === data.playerId);

        if (gmIdMatches) {
          targetPlayer = room.gm;
          logger.info('[gm_transfer_player] Found GM via enhanced ID match', {
            playerId: data.playerId,
            gmId: room.gm.id,
            gmSocketId: room.gm.socketId,
            gmUserId: room.gmId,
            matchedBy: room.gm.id === data.playerId ? 'gm.id' :
              room.gm.socketId === data.playerId ? 'gm.socketId' :
                room.gm.socketId === socket.id ? 'sender socket' :
                  room.gmId === data.playerId ? 'gmId' : 'userId'
          });
        }
      }

      if (!targetPlayer) {
        logger.warn('[gm_transfer_player] Player not found in room', {
          playerId: data.playerId,
          roomId: room.id,
          availablePlayerIds: Array.from(room.players.keys()),
          gmId: room.gm?.id,
          gmSocketId: room.gm?.socketId
        });
        return;
      }

      logger.info('[gm_transfer_player] Target player found', {
        playerId: targetPlayer.id,
        playerName: targetPlayer.name || targetPlayer.characterName,
        playerSocketId: targetPlayer.socketId,
        isGM: targetPlayer.isGM || room.gm === targetPlayer
      });

      if (data.targetMapId) {
        targetPlayer.currentMapId = data.targetMapId;
        if (room.gameState.playerMapAssignments) {
          room.gameState.playerMapAssignments[data.playerId] = data.targetMapId;
        }

        const targetMap = validateMapExists(room, data.targetMapId, data.destinationMapName);
        const mapData = {
          terrainData: targetMap.terrainData || {},
          wallData: targetMap.wallData || {},
          windowOverlays: targetMap.windowOverlays || {},
          drawingPaths: targetMap.drawingPaths || [],
          drawingLayers: targetMap.drawingLayers || [],
          fogOfWarData: targetMap.fogOfWarData || {},
          fogOfWarPaths: targetMap.fogOfWarPaths || [],
          fogErasePaths: targetMap.fogErasePaths || [],
          dndElements: targetMap.dndElements || [],
          environmentalObjects: targetMap.environmentalObjects || [],
          backgrounds: targetMap.backgrounds || [],
          activeBackgroundId: targetMap.activeBackgroundId || null,
          tokens: targetMap.tokens || {},
          characterTokens: targetMap.characterTokens || {},
          gridItems: targetMap.gridItems || {},
          gridSettings: targetMap.gridSettings || {}
        };

        logger.info('[gm_transfer_player] Sending forced_map_transfer', {
          targetSocketId: targetPlayer.socketId,
          mapId: data.targetMapId,
          mapName: data.destinationMapName,
          hasTokens: Object.keys(mapData.tokens || {}).length > 0,
          hasCharacterTokens: Object.keys(mapData.characterTokens || {}).length > 0,
          hasGridItems: Object.keys(mapData.gridItems || {}).length > 0
        });

        io.to(targetPlayer.socketId).emit('forced_map_transfer', {
          mapId: data.targetMapId,
          mapName: data.destinationMapName || data.targetMapId,
          reason: data.reason || 'GM transferred you',
          mapData
        });

        io.to(data.roomId).emit('player_location_updated', {
          playerId: targetPlayer.id,
          playerName: targetPlayer.name || targetPlayer.characterName || 'Player',
          newMapId: data.targetMapId,
          transferredByGM: true
        });

        logger.info('[gm_transfer_player] Transfer complete', {
          playerId: targetPlayer.id,
          playerName: targetPlayer.name || targetPlayer.characterName,
          newMapId: data.targetMapId
        });
      }

    } catch (error) {
      logger.error('[gm_transfer_player] Error:', {
        error: error.message,
        stack: error.stack,
        data: {
          roomId: data.roomId,
          playerId: data.playerId,
          targetMapId: data.targetMapId
        }
      });
    }
  });

  socket.on('gm_request_fresh_positions', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId, true);
      if (!validation.valid) return;

      const { room } = validation;
      const mapId = data.mapId || room.gameState.defaultMapId || 'default';
      const map = validateMapExists(room, mapId);

      socket.emit('fresh_positions_received', {
        mapId,
        characterTokens: map.characterTokens || {},
        tokens: map.tokens || {}
      });

      logger.info(`[gm_request_fresh_positions] Sent fresh positions for map ${mapId}`);
    } catch (error) {
      logger.error('[gm_request_fresh_positions] Error:', { error: error.message });
    }
  });

  socket.on('player_use_connection', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room, player } = validation;

      if (data.targetMapId) {
        player.currentMapId = data.targetMapId;
        if (room.gameState.playerMapAssignments) {
          room.gameState.playerMapAssignments[player.id] = data.targetMapId;
        }

        socket.emit('map_transfer_complete', {
          mapId: data.targetMapId
        });

        socket.to(data.roomId).emit('player_map_changed', {
          playerId: player.id,
          mapId: data.targetMapId
        });
      }

    } catch (error) {
      logger.error('[player_use_connection] Error:', { error: error.message });
    }
  });

  socket.on('gm_action', (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId, true);
      if (!validation.valid) return;

      const { room } = validation;
      const effectiveRoomId = data.roomId || room.id;
      const actionType = data.action || data.type;

      switch (actionType) {
        case 'clear_fog':
          if (room.gameState.maps) {
            Object.values(room.gameState.maps).forEach(map => {
              if (map.fogOfWarData) map.fogOfWarData = {};
            });
          }
          break;

        case 'reset_combat':
          room.gameState.combat = {
            isActive: false,
            currentTurn: null,
            turnOrder: [],
            round: 0
          };
          break;

        case 'heal_all':
          room.players.forEach(p => {
            if (p.character?.health) {
              p.character.health.current = p.character.health.max;
            }
          });
          break;
      }

      io.to(effectiveRoomId).emit('gm_action', {
        ...data,
        type: actionType,
        action: actionType
      });

      firebaseBatchWriter.queueWrite(effectiveRoomId, room.gameState);

    } catch (error) {
      logger.error('[gm_action] Error:', { error: error.message });
    }
  });

  socket.on('sync_gameplay_settings', (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId, true);
      if (!validation.valid) return;

      const { room } = validation;

      room.settings = {
        ...room.settings,
        ...data.settings
      };

      io.to(data.roomId).emit('gameplay_settings_updated', {
        settings: room.settings
      });

      if (room.isPermanent) {
        firebaseBatchWriter.queueWrite(data.roomId, room.gameState);
      }

    } catch (error) {
      logger.error('[sync_gameplay_settings] Error:', { error: error.message });
    }
  });

  socket.on('gm_note_update', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId, true);
      if (!validation.valid) return;

      const { room } = validation;

      if (!room.gmNotes) room.gmNotes = {};
      room.gmNotes[data.noteId || 'default'] = {
        content: data.content,
        updatedAt: Date.now()
      };

      firebaseBatchWriter.queueWrite(data.roomId, room.gameState);

    } catch (error) {
      logger.error('[gm_note_update] Error:', { error: error.message });
    }
  });
}

module.exports = { registerGmActionHandlers };
