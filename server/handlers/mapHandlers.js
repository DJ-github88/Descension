/**
 * Map/Grid Management Handlers
 *
 * Map structure and per-map state synchronization:
 * - update_current_map: player switches to a different map (broadcasts to room)
 * - sync_level_editor_state: GM-only full level editor state push (terrain, walls, fog, etc.)
 * - map_update: structural map changes (create/delete) OR terrain sync (GM-only, per-map)
 * - request_full_map_sync: GM triggers RealtimeSyncEngine force sync
 * - grid_item_update: grid item add/update/move/remove (per-map)
 * - sync_map_state: send current map state back to requesting player
 */

function registerMapHandlers(ctx) {
  const {
    io,
    socket,
    players,
    logger,
    uuidv4,
    validateRoomMembership,
    validateMapExists,
    firebaseBatchWriter,
    getNextEventSequence,
    realtimeSync
  } = ctx;

  socket.on('update_current_map', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room, player } = validation;

      player.currentMapId = data.mapId;
      if (room.gameState.playerMapAssignments) {
        room.gameState.playerMapAssignments[player.id] = data.mapId;
      }

      socket.to(data.roomId).emit('player_map_changed', {
        playerId: player.id,
        mapId: data.mapId
      });

    } catch (error) {
      logger.error('[update_current_map] Error:', { error: error.message });
    }
  });

  socket.on('sync_level_editor_state', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId, true);
      if (!validation.valid) return;

      const { room } = validation;
      const mapId = data.mapId || room.gameState.defaultMapId || 'default';
      const map = validateMapExists(room, mapId, data.mapName);

      if (data.terrainData) map.terrainData = data.terrainData;
      if (data.wallData) map.wallData = data.wallData;
      if (data.windowOverlays !== undefined) map.windowOverlays = data.windowOverlays;
      if (data.environmentalObjects) map.environmentalObjects = data.environmentalObjects;
      if (data.drawingPaths) map.drawingPaths = data.drawingPaths;
      if (data.drawingLayers) map.drawingLayers = data.drawingLayers;
      if (data.fogOfWarData) map.fogOfWarData = data.fogOfWarData;
      if (data.fogOfWarPaths) map.fogOfWarPaths = data.fogOfWarPaths;
      if (data.lightSources) map.lightSources = data.lightSources;
      if (data.dndElements) map.dndElements = data.dndElements;

      socket.to(room.id).emit('level_editor_state_synced', {
        mapId,
        state: {
          terrainData: map.terrainData,
          wallData: map.wallData,
          windowOverlays: map.windowOverlays || {},
          environmentalObjects: map.environmentalObjects,
          drawingPaths: map.drawingPaths,
          fogOfWarData: map.fogOfWarData,
          lightSources: map.lightSources,
          dndElements: map.dndElements
        },
        sequence: getNextEventSequence()
      });

      firebaseBatchWriter.queueWrite(room.id, room.gameState);

    } catch (error) {
      logger.error('[sync_level_editor_state] Error:', { error: error.message });
    }
  });

  socket.on('map_update', async (data) => {
    try {
      const sequence = data?.sequence || 'no-seq';
      const hasTargetId = !!data?.targetMapId;
      logger.debug(`[map_update] Received [Seq: ${sequence}, TargetID: ${hasTargetId ? data.targetMapId : 'N/A'}]`);

      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room, player } = validation;

      if (data.action === 'create' && data.map) {
        const mapId = data.map.id || uuidv4();
        validateMapExists(room, mapId, data.map.name);

        io.to(room.id).emit('map_update', {
          action: 'create',
          map: { id: mapId, ...data.map },
          createdBy: socket.id
        });
      } else if (data.action === 'delete' && data.mapId) {
        const deletedMapId = data.mapId;
        if (room.gameState.maps && room.gameState.maps[deletedMapId]) {
          delete room.gameState.maps[deletedMapId];
        }

        const fallbackMapId = room.gameState.defaultMapId || 'default';

        Object.values(room.gameState.maps || {}).forEach(map => {
          if (Array.isArray(map.dndElements)) {
            map.dndElements = map.dndElements.filter(el =>
              !(el.type === 'portal' || el.type === 'connection') ||
              el.properties?.destinationMapId !== deletedMapId
            );
          }
        });

        if (room.gameState.playerMapAssignments) {
          Object.keys(room.gameState.playerMapAssignments).forEach(pid => {
            if (room.gameState.playerMapAssignments[pid] === deletedMapId) {
              room.gameState.playerMapAssignments[pid] = fallbackMapId;
            }
          });
        }

        room.players.forEach(p => {
          if (p.currentMapId === deletedMapId) {
            p.currentMapId = fallbackMapId;
          }
        });

        io.to(room.id).emit('map_update', {
          action: 'delete',
          mapId: deletedMapId,
          reassignedTo: fallbackMapId,
          deletedBy: socket.id
        });
      } else if (data.mapUpdates && data.targetMapId) {
        if (!player.isGM) {
          logger.warn('[map_update] Non-GM attempted terrain sync');
          return;
        }

        const targetMapId = data.targetMapId;
        const mapData = validateMapExists(room, targetMapId);
        const mapUpdates = data.mapUpdates;

        if (mapUpdates.terrainData) {
          mapData.terrainData = {
            ...mapData.terrainData || {},
            ...mapUpdates.terrainData
          };
          for (const [key, value] of Object.entries(mapUpdates.terrainData)) {
            if (value === null && mapData.terrainData[key] !== undefined) {
              delete mapData.terrainData[key];
            }
          }
        }

        if (mapUpdates.wallData !== undefined) {
          mapData.wallData = {
            ...mapData.wallData || {},
            ...mapUpdates.wallData
          };
          for (const [key, value] of Object.entries(mapUpdates.wallData)) {
            if (value === null && mapData.wallData[key] !== undefined) {
              delete mapData.wallData[key];
            }
          }
        }

        if (mapUpdates.fogOfWar !== undefined) {
          mapData.fogOfWarData = mapUpdates.fogOfWar;
        }
        if (mapUpdates.fogOfWarPaths !== undefined) {
          mapData.fogOfWarPaths = mapUpdates.fogOfWarPaths;
        }
        if (mapUpdates.fogErasePaths !== undefined) {
          mapData.fogErasePaths = mapUpdates.fogErasePaths;
        }
        if (mapUpdates.exploredAreas !== undefined) {
          mapData.exploredAreas = mapUpdates.exploredAreas;
        }

        if (mapUpdates.drawingLayers !== undefined) {
          mapData.drawingLayers = mapUpdates.drawingLayers;
        }
        if (mapUpdates.drawingPaths !== undefined) {
          mapData.drawingPaths = mapUpdates.drawingPaths;
        }

        if (mapUpdates.dndElements !== undefined) {
          mapData.dndElements = mapUpdates.dndElements;
        }

        if (mapUpdates.environmentalObjects !== undefined) {
          mapData.environmentalObjects = mapUpdates.environmentalObjects;
        }

        if (mapUpdates.windowOverlays !== undefined) {
          mapData.windowOverlays = {
            ...mapData.windowOverlays || {},
            ...mapUpdates.windowOverlays
          };
          for (const [key, value] of Object.entries(mapUpdates.windowOverlays)) {
            if (value === null && mapData.windowOverlays[key] !== undefined) {
              delete mapData.windowOverlays[key];
            }
          }
        }

        if (mapUpdates.lightSources !== undefined) {
          mapData.lightSources = mapUpdates.lightSources;
        }

        if (mapUpdates.gridSettings !== undefined) {
          mapData.gridSettings = mapUpdates.gridSettings;
        }

        const isStructuralUpdate = !!(mapUpdates.dndElements || mapUpdates.environmentalObjects || mapUpdates.gridSettings);
        let broadcastCount = 0;

        for (const [sid, p] of players.entries()) {
          if (sid === socket.id || p.roomId !== player.roomId) continue;

          const isOnSameMap = p.currentMapId === targetMapId;
          const shouldReceive = isStructuralUpdate || isOnSameMap;

          if (shouldReceive) {
            io.to(sid).emit('map_update', {
              mapId: targetMapId,
              mapData: mapUpdates,
              updatedBy: player.id,
              sequence: sequence
            });
            broadcastCount++;
          }
        }

        logger.debug(`[map_update] Terrain sync on ${targetMapId} by GM ${player.name}: ${Object.keys(mapUpdates).join(', ')} → ${broadcastCount} players`);
      }

      firebaseBatchWriter.queueWrite(room.id, room.gameState);

    } catch (error) {
      logger.error('[map_update] Error:', { error: error.message });
    }
  });

  socket.on('request_full_map_sync', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId, true);
      if (!validation.valid) return;

      if (realtimeSync) {
        logger.info(`🔄 [request_full_map_sync] Forcing map sync for room ${data.roomId}`);
        await realtimeSync.forceSyncAll(data.roomId);
      } else {
        io.to(data.roomId).emit('gm_action', {
          type: 'force_map_sync',
          timestamp: Date.now()
        });
      }
    } catch (error) {
      logger.error('[request_full_map_sync] Error:', { error: error.message });
    }
  });

  socket.on('grid_item_update', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room } = validation;
      const mapId = data.mapId || data.targetMapId || room.gameState.defaultMapId || 'default';
      const map = validateMapExists(room, mapId);

      const action = data.action || data.updateType;

      if (action === 'add' && (data.item || data.itemData)) {
        const item = data.item || data.itemData;
        const itemId = item.id || uuidv4();
        map.gridItems[itemId] = { ...item, id: itemId };

        io.to(room.id).emit('grid_item_update', {
          action: 'add',
          item: map.gridItems[itemId],
          itemId,
          mapId,
          addedBy: socket.id
        });
      } else if (action === 'update' && data.itemId && data.updates) {
        if (map.gridItems[data.itemId]) {
          map.gridItems[data.itemId] = {
            ...map.gridItems[data.itemId],
            ...data.updates
          };

          io.to(room.id).emit('grid_item_update', {
            action: 'update',
            itemId: data.itemId,
            updates: data.updates,
            mapId,
            updatedBy: socket.id
          });
        }
      } else if (action === 'move' && data.itemId && data.position) {
        if (map.gridItems[data.itemId]) {
          map.gridItems[data.itemId] = {
            ...map.gridItems[data.itemId],
            position: data.position,
            gridPosition: data.gridPosition || data.position?.gridPosition
          };

          io.to(room.id).emit('grid_item_update', {
            action: 'move',
            itemId: data.itemId,
            position: data.position,
            gridPosition: data.gridPosition,
            mapId,
            movedBy: socket.id
          });
        }
      } else if (action === 'remove' && data.itemId) {
        delete map.gridItems[data.itemId];

        io.to(room.id).emit('grid_item_update', {
          action: 'remove',
          itemId: data.itemId,
          mapId,
          removedBy: socket.id
        });
      }

      firebaseBatchWriter.queueWrite(room.id, room.gameState);

    } catch (error) {
      logger.error('[grid_item_update] Error:', { error: error.message });
    }
  });

  socket.on('sync_map_state', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room, player } = validation;
      const mapId = player.currentMapId || room.gameState.defaultMapId || 'default';
      const map = validateMapExists(room, mapId);

      socket.emit('map_state_synced', {
        mapId,
        state: {
          tokens: map.tokens || {},
          characterTokens: map.characterTokens || {},
          gridItems: map.gridItems || {},
          terrainData: map.terrainData || {},
          wallData: map.wallData || {},
          windowOverlays: map.windowOverlays || {},
          environmentalObjects: map.environmentalObjects || [],
          drawingPaths: map.drawingPaths || [],
          fogOfWarData: map.fogOfWarData || {},
          lightSources: map.lightSources || {},
          dndElements: map.dndElements || []
        }
      });

    } catch (error) {
      logger.error('[sync_map_state] Error:', { error: error.message });
    }
  });
}

module.exports = { registerMapHandlers };
