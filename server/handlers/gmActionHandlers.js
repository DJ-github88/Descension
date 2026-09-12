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

  socket.on('gm_switch_view', async(data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId, true);
      if (!validation.valid) {return;}

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

  socket.on('gm_transfer_player', async(data) => {
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

  socket.on('gm_request_fresh_positions', async(data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId, true);
      if (!validation.valid) {return;}

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

  socket.on('player_use_connection', async(data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) {return;}

      const { room, player } = validation;

      // The client (PortalTransferDialog) sends { connectionId }; other callers
      // may send { targetMapId }. Resolve the destination from the live map
      // connection elements when only an id is provided - previously this event
      // silently did nothing in multiplayer portal travel.
      let targetMapId = data.targetMapId || null;
      const connectionId = data.connectionId || data.connection?.id || null;
      if (!targetMapId && connectionId) {
        const maps = room.gameState.maps || {};
        for (const map of Object.values(maps)) {
          const elements = Array.isArray(map?.dndElements) ? map.dndElements : [];
          const match = elements.find(el =>
            el && el.id === connectionId &&
            (el.type === 'portal' || el.type === 'connection')
          );
          if (match) {
            targetMapId = match.properties?.destinationMapId || match.destinationMapId || null;
            if (targetMapId) break;
          }
          const portals = Array.isArray(map?.portals) ? map.portals : [];
          const portalMatch = portals.find(p => p && p.id === connectionId);
          if (portalMatch?.destinationMapId) {
            targetMapId = portalMatch.destinationMapId;
            break;
          }
        }
      }

      if (targetMapId) {
        const previousMapId = player.currentMapId || null;
        player.currentMapId = targetMapId;
        if (room.gameState.playerMapAssignments) {
          room.gameState.playerMapAssignments[player.id] = targetMapId;
        }

        const destinationMap = (room.gameState.maps && room.gameState.maps[targetMapId]) || {};
        const destGridSettings = destinationMap.gridSettings || room.gameState.gridSettings || {
          gridSize: 50,
          gridOffsetX: 0,
          gridOffsetY: 0
        };

        // Center the camera on the destination connection when it lives on the target map
        let centerPosition = null;
        const destElements = Array.isArray(destinationMap.dndElements) ? destinationMap.dndElements : [];
        const destConnection = connectionId
          ? destElements.find(el => el && el.id === connectionId)
          : null;
        if (destConnection && Number.isFinite(destConnection.gridX) && Number.isFinite(destConnection.gridY)) {
          const cellSize = destGridSettings.gridSize || 50;
          centerPosition = {
            x: destConnection.gridX * cellSize + (destGridSettings.gridOffsetX || 0) + cellSize / 2,
            y: destConnection.gridY * cellSize + (destGridSettings.gridOffsetY || 0) + cellSize / 2
          };
        }

        const mapSnapshot = {
          id: targetMapId,
          name: destinationMap.name || `Map ${targetMapId}`,
          tokens: destinationMap.tokens || {},
          characterTokens: destinationMap.characterTokens || {},
          gridItems: destinationMap.gridItems || {},
          terrainData: destinationMap.terrainData || {},
          wallData: destinationMap.wallData || {},
          windowOverlays: destinationMap.windowOverlays || {},
          environmentalObjects: destinationMap.environmentalObjects || [],
          drawingPaths: destinationMap.drawingPaths || [],
          drawingLayers: destinationMap.drawingLayers || [],
          fogOfWarData: destinationMap.fogOfWarData || {},
          fogOfWarPaths: destinationMap.fogOfWarPaths || [],
          fogErasePaths: destinationMap.fogErasePaths || [],
          dndElements: destinationMap.dndElements || [],
          lightSources: destinationMap.lightSources || {},
          exploredAreas: destinationMap.exploredAreas || {},
          gridSettings: destGridSettings,
          backgrounds: (room.gameState.mapData && room.gameState.mapData.backgrounds) || []
        };

        const transferPayload = {
          playerId: player.id,
          playerName: player.name,
          mapId: targetMapId,
          newMapId: targetMapId,
          newMapName: mapSnapshot.name,
          mapData: mapSnapshot,
          centerPosition,
          transferredByGM: false,
          portalUsed: {
            transferType: 'connection',
            sourceConnectionId: connectionId,
            destinationConnectionId: connectionId,
            sourceMapId: previousMapId,
            destinationMapId: targetMapId
          }
        };

        // The transferring player needs the rich payload (PortalTransferDialog
        // relies on player_map_changed to perform the local switch), then the
        // rest of the room is notified so party map tags update.
        socket.emit('player_map_changed', transferPayload);
        socket.to(room.id).emit('player_map_changed', transferPayload);

        logger.info(`[player_use_connection] ${player.name} transferred ${previousMapId} -> ${targetMapId} via connection ${connectionId || 'explicit map'}`);
      } else {
        logger.warn(`[player_use_connection] Could not resolve destination (connectionId=${connectionId || 'none'})`);
      }

    } catch (error) {
      logger.error('[player_use_connection] Error:', { error: error.message });
    }
  });

  socket.on('gm_action', (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId, true);
      if (!validation.valid) {return;}

      const { room } = validation;
      const effectiveRoomId = data.roomId || room.id;
      const actionType = data.action || data.type;

      switch (actionType) {
      case 'clear_fog':
        if (room.gameState.maps) {
          Object.values(room.gameState.maps).forEach(map => {
            if (map.fogOfWarData) {map.fogOfWarData = {};}
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
      if (!validation.valid) {return;}

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

  socket.on('gm_note_update', async(data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId, true);
      if (!validation.valid) {return;}

      const { room } = validation;

      if (!room.gmNotes) {room.gmNotes = {};}
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
