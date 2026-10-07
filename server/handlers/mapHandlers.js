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

const { ackFailure } = require('../utils/socketAck');
const roomCheckpoint = require('../services/roomCheckpoint');
const roomAccess = require('../services/roomAccessService');

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
    getNextEventSequence
  } = ctx;

  const getOwnMapForRead = (room, mapId) => {
    const maps = room && room.gameState && room.gameState.maps;
    if (!maps || typeof maps !== 'object' || !Object.prototype.hasOwnProperty.call(maps, mapId)) {
      return null;
    }
    const map = maps[mapId];
    return map && typeof map === 'object' && !Array.isArray(map) ? map : null;
  };

  const buildFullMapSyncPayload = (room, mapId, map) => {
    // One positive privacy projection for every outbound map snapshot.
    const projected = roomAccess.projectGameStateForClient({ maps: { [mapId]: { ...map } } }).maps[mapId];
    return {
      mapId,
      mapIds: Object.keys((room.gameState && room.gameState.maps) || {}),
      tokens: projected.tokens || {},
      characterTokens: projected.characterTokens || {},
      gridItems: projected.gridItems || {},
      fogOfWar: projected.fogOfWarData || {},
      mapData: projected,
      combat: (room.gameState && room.gameState.combat) || null,
      players: roomAccess.projectPlayersForClient(room.players),
      gm: roomAccess.projectPlayerForClient(room.gm),
      room: { id: room.id, name: room.name }
    };
  };

  socket.on('update_current_map', async(data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) {return;}

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

  socket.on('sync_level_editor_state', async(data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId, true);
      if (!validation.valid) {return;}

      const { room } = validation;
      const mapId = data.mapId || room.gameState.defaultMapId || 'default';
      const map = validateMapExists(room, mapId, data.mapName);

      if (data.terrainData) {map.terrainData = data.terrainData;}
      if (data.wallData) {map.wallData = data.wallData;}
      if (data.windowOverlays !== undefined) {map.windowOverlays = data.windowOverlays;}
      if (data.environmentalObjects) {map.environmentalObjects = data.environmentalObjects;}
      if (data.drawingPaths) {map.drawingPaths = data.drawingPaths;}
      if (data.drawingLayers) {map.drawingLayers = data.drawingLayers;}
      if (data.fogOfWarData) {map.fogOfWarData = data.fogOfWarData;}
      if (data.fogOfWarPaths) {map.fogOfWarPaths = data.fogOfWarPaths;}
      if (data.lightSources) {map.lightSources = data.lightSources;}
      if (data.dndElements) {map.dndElements = data.dndElements;}
      if (data.elevationData !== undefined) {map.elevationData = data.elevationData;}
      if (data.rampData !== undefined) {map.rampData = data.rampData;}
      if (data.sunSettings !== undefined) {map.sunSettings = data.sunSettings;}
      if (data.gridSettings !== undefined) {
        map.gridSettings = { ...(map.gridSettings || {}), ...data.gridSettings };
      }

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
        gridSettings: map.gridSettings || null,
        elevationData: map.elevationData || null,
        rampData: map.rampData || null,
        sunSettings: map.sunSettings || null,
        sequence: getNextEventSequence()
      });

      firebaseBatchWriter.queueWrite(room.id, room.gameState);

    } catch (error) {
      logger.error('[sync_level_editor_state] Error:', { error: error.message });
    }
  });

  socket.on('map_update', async(data, callback) => {
    try {
      const sequence = data?.sequence || 'no-seq';
      const hasTargetId = !!data?.targetMapId;
      logger.debug(`[map_update] Received [Seq: ${sequence}, TargetID: ${hasTargetId ? data.targetMapId : 'N/A'}]`);

      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) {
        // Inline authorization rejection must still answer an ack-bearing request.
        ackFailure(callback, { success: false, error: 'Not a member of this room' });
        return;
      }

      const { room, player } = validation;

      if (data.action === 'create' && data.map) {
        if (!player.isGM) {
          logger.warn('[map_update] Non-GM attempted map creation');
          ackFailure(callback, { success: false, error: 'GM privileges required' });
          return;
        }
        const mapId = data.map.id || uuidv4();
        validateMapExists(room, mapId, data.map.name);

        io.to(room.id).emit('map_update', {
          action: 'create',
          map: roomAccess.projectMapDataForClient({ id: mapId, ...data.map }),
          createdBy: socket.id
        });
      } else if (data.action === 'delete' && data.mapId) {
        if (!player.isGM) {
          logger.warn('[map_update] Non-GM attempted map deletion');
          ackFailure(callback, { success: false, error: 'GM privileges required' });
          return;
        }
        const deletedMapId = data.mapId;
        if (room.gameState.maps && room.gameState.maps[deletedMapId]) {
          delete room.gameState.maps[deletedMapId];
        }

        // Deterministic default-map rule: retain the existing default when it
        // survives, otherwise choose the lexicographically first remaining map
        // (or null for none) before any checkpoint is queued.
        const remainingMapIds = Object.keys(room.gameState.maps || {}).sort();
        const defaultStillPresent = room.gameState.defaultMapId !== deletedMapId &&
          Object.prototype.hasOwnProperty.call(room.gameState.maps || {}, room.gameState.defaultMapId);
        if (!defaultStillPresent) {
          room.gameState.defaultMapId = remainingMapIds.length > 0 ? remainingMapIds[0] : null;
        }
        const fallbackMapId = room.gameState.defaultMapId || remainingMapIds[0] || 'default';

        // Regenerate compatibility mirrors from surviving authoritative maps
        // only; removed-map entities must not survive in root mirrors.
        const mirrors = roomCheckpoint.deriveRootMirrors(room.gameState.maps || {});
        room.gameState.tokens = mirrors.tokens;
        room.gameState.characterTokens = mirrors.characterTokens;
        room.gameState.gridItems = mirrors.gridItems;

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
          ackFailure(callback, { success: false, error: 'GM privileges required' });
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

        if (mapUpdates.elevationData !== undefined) {
          mapData.elevationData = {
            ...mapData.elevationData || {},
            ...mapUpdates.elevationData
          };
          for (const [key, value] of Object.entries(mapUpdates.elevationData)) {
            if (value === null && mapData.elevationData[key] !== undefined) {
              delete mapData.elevationData[key];
            }
          }
        }

        if (mapUpdates.rampData !== undefined) {
          mapData.rampData = {
            ...mapData.rampData || {},
            ...mapUpdates.rampData
          };
          for (const [key, value] of Object.entries(mapUpdates.rampData)) {
            if (value === null && mapData.rampData[key] !== undefined) {
              delete mapData.rampData[key];
            }
          }
        }

        if (mapUpdates.sunSettings !== undefined) {
          mapData.sunSettings = mapUpdates.sunSettings;
        }

        if (mapUpdates.gridSettings !== undefined) {
          mapData.gridSettings = mapUpdates.gridSettings;
        }

        const isStructuralUpdate = !!(mapUpdates.dndElements || mapUpdates.environmentalObjects || mapUpdates.gridSettings);
        let broadcastCount = 0;

        for (const [sid, p] of players.entries()) {
          if (sid === socket.id || p.roomId !== player.roomId) {continue;}

          const isOnSameMap = p.currentMapId === targetMapId;
          const shouldReceive = isStructuralUpdate || isOnSameMap;

          if (shouldReceive) {
            io.to(sid).emit('map_update', {
              mapId: targetMapId,
              mapData: roomAccess.projectMapDataForClient(mapUpdates),
              updatedBy: player.id,
              sequence: sequence
            });
            broadcastCount++;
          }
        }

        logger.debug(`[map_update] Terrain sync on ${targetMapId} by GM ${player.name}: ${Object.keys(mapUpdates).join(', ')} → ${broadcastCount} players`);
      }

      firebaseBatchWriter.queueWrite(room.id, room.gameState);

      if (typeof callback === 'function') {
        callback({ success: true, sequence });
      }
    } catch (error) {
      logger.error('[map_update] Error:', { error: error.message });
      if (typeof callback === 'function') {
        callback({ success: false, error: error.message });
      }
    }
  });

  socket.on('request_full_map_sync', async(data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId, true);
      if (!validation.valid) {return;}

      const { room } = validation;
      const delivered = new Set();
      const fallbackMapId = room.gameState.defaultMapId || 'default';
      const deliver = (socketId, playerMapId) => {
        if (!socketId || delivered.has(socketId)) {return;}
        const mapId = getOwnMapForRead(room, playerMapId) ? playerMapId : (getOwnMapForRead(room, fallbackMapId) ? fallbackMapId : null);
        if (!mapId) {return;}
        delivered.add(socketId);
        io.to(socketId).emit('full_game_state_sync', buildFullMapSyncPayload(room, mapId, getOwnMapForRead(room, mapId)));
      };

      if (room.players && typeof room.players.forEach === 'function') {
        room.players.forEach((member) => {
          deliver(member && member.socketId, (member && member.currentMapId) || fallbackMapId);
        });
      }
      if (room.gm) {deliver(room.gm.socketId, room.gm.currentMapId || fallbackMapId);}

      logger.info('[request_full_map_sync] Delivered complete live map projections from server memory', {
        roomId: room.id,
        recipients: delivered.size
      });
    } catch (error) {
      logger.error('[request_full_map_sync] Error:', { error: error.message });
    }
  });

  socket.on('grid_item_update', async(data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) {return;}

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

  socket.on('sync_map_state', async(data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) {return;}

      const { room, player } = validation;
      const mapId = player.currentMapId || room.gameState.defaultMapId || 'default';
      const map = getOwnMapForRead(room, mapId);

      if (!map) {
        socket.emit('sync_error', {
          event: 'sync_map_state',
          code: 'map_unavailable',
          mapId,
          message: `Map '${mapId}' is not available for recovery`
        });
        return;
      }

      const projectedMap = roomAccess.projectGameStateForClient({ maps: { [mapId]: { ...map } } }).maps[mapId];
      socket.emit('map_state_synced', {
        mapId,
        state: projectedMap
      });

    } catch (error) {
      logger.error('[sync_map_state] Error:', { error: error.message });
    }
  });

  socket.on('set_scene_mode', async(data, callback) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId, true);
      if (!validation.valid) {
        if (typeof callback === 'function') {callback({ success: false, error: 'Unauthorized' });}
        return;
      }

      const { room, player } = validation;
      const mode = data.mode === 'location' ? 'location' : 'tactical';
      room.gameState.activeSceneMode = mode;
      if (data.activeLocationMapId !== undefined) {
        room.gameState.activeLocationMapId = data.activeLocationMapId;
      }
      if (data.isFreeRoamAllowed !== undefined) {
        room.gameState.isFreeRoamAllowed = Boolean(data.isFreeRoamAllowed);
      }

      const payload = {
        mode: room.gameState.activeSceneMode,
        activeLocationMapId: room.gameState.activeLocationMapId,
        isFreeRoamAllowed: room.gameState.isFreeRoamAllowed,
        updatedBy: player.id,
        sequence: getNextEventSequence()
      };

      io.to(room.id).emit('scene_mode_changed', payload);
      logger.info(`[set_scene_mode] GM ${player.name} switched scene mode to ${mode} (map: ${room.gameState.activeLocationMapId})`);

      firebaseBatchWriter.queueWrite(room.id, room.gameState);

      if (typeof callback === 'function') {
        callback({ success: true, payload });
      }
    } catch (error) {
      logger.error('[set_scene_mode] Error:', { error: error.message });
      if (typeof callback === 'function') {
        callback({ success: false, error: error.message });
      }
    }
  });

  socket.on('sync_location_scene_state', async(data, callback) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId, true);
      if (!validation.valid) {
        if (typeof callback === 'function') {callback({ success: false, error: 'Unauthorized' });}
        return;
      }

      const { room, player } = validation;
      if (!room.gameState.locationScenes) {
        room.gameState.locationScenes = {};
      }

      const mapId = data.mapId || 'map-mythril-world';
      room.gameState.locationScenes[mapId] = {
        id: mapId,
        pins: data.pins || [],
        partyMarker: data.partyMarker || null,
        isFreeRoamAllowed: data.isFreeRoamAllowed !== undefined ? Boolean(data.isFreeRoamAllowed) : (room.gameState.isFreeRoamAllowed || false),
        updatedAt: new Date().toISOString()
      };

      const payload = {
        mapId,
        pins: data.pins || [],
        partyMarker: data.partyMarker || null,
        maps: data.maps || null,
        isFreeRoamAllowed: data.isFreeRoamAllowed,
        updatedBy: player.id,
        sequence: getNextEventSequence()
      };

      socket.to(room.id).emit('location_scene_synced', payload);
      logger.info(`[sync_location_scene_state] Synced location scene ${mapId} by GM ${player.name} (${(data.pins || []).length} pins)`);

      firebaseBatchWriter.queueWrite(room.id, room.gameState);

      if (typeof callback === 'function') {
        callback({ success: true, sequence: payload.sequence });
      }
    } catch (error) {
      logger.error('[sync_location_scene_state] Error:', { error: error.message });
      if (typeof callback === 'function') {
        callback({ success: false, error: error.message });
      }
    }
  });

  socket.on('sync_party_marker', async(data, callback) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId, true);
      if (!validation.valid) {
        if (typeof callback === 'function') {callback({ success: false, error: 'Unauthorized' });}
        return;
      }

      const { room, player } = validation;
      const mapId = data.mapId || 'map-mythril-world';

      if (!room.gameState.locationScenes) {
        room.gameState.locationScenes = {};
      }
      if (!room.gameState.locationScenes[mapId]) {
        room.gameState.locationScenes[mapId] = { id: mapId, pins: [] };
      }

      const marker = {
        x: data.x,
        y: data.y,
        name: data.name || 'The Party',
        mapId,
        updatedAt: new Date().toISOString()
      };
      room.gameState.locationScenes[mapId].partyMarker = marker;

      const payload = {
        mapId,
        position: { x: data.x, y: data.y },
        name: marker.name,
        updatedBy: player.id,
        sequence: getNextEventSequence()
      };

      io.to(room.id).emit('party_marker_moved', payload);
      logger.debug(`[sync_party_marker] Party marker moved on ${mapId} to (${data.x}, ${data.y}) by GM ${player.name}`);

      firebaseBatchWriter.queueWrite(room.id, room.gameState);

      if (typeof callback === 'function') {
        callback({ success: true });
      }
    } catch (error) {
      logger.error('[sync_party_marker] Error:', { error: error.message });
      if (typeof callback === 'function') {
        callback({ success: false, error: error.message });
      }
    }
  });

  socket.on('pull_players_to_map', async(data, callback) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId, true);
      if (!validation.valid) {
        if (typeof callback === 'function') {callback({ success: false, error: 'Unauthorized: GM only' });}
        return;
      }

      const { room, player } = validation;
      const mapId = data.mapId;
      if (!mapId) {
        if (typeof callback === 'function') {callback({ success: false, error: 'Missing mapId' });}
        return;
      }

      const map = validateMapExists(room, mapId, data.mapName);

      // Update room default / active map and all player assignments
      room.gameState.defaultMapId = mapId;
      if (!room.gameState.playerMapAssignments) {
        room.gameState.playerMapAssignments = {};
      }

      // Assign all active players in room to this map
      for (const [, p] of players.entries()) {
        if (p.roomId === room.id) {
          p.currentMapId = mapId;
          room.gameState.playerMapAssignments[p.id] = mapId;
        }
      }

      // If full map snapshot was attached from GM prep, persist it to the room state
      if (data.mapSnapshot) {
        if (data.mapSnapshot.terrainData) {map.terrainData = data.mapSnapshot.terrainData;}
        if (data.mapSnapshot.wallData) {map.wallData = data.mapSnapshot.wallData;}
        if (data.mapSnapshot.fogOfWarData) {map.fogOfWarData = data.mapSnapshot.fogOfWarData;}
        if (data.mapSnapshot.fogOfWarPaths) {map.fogOfWarPaths = data.mapSnapshot.fogOfWarPaths;}
        if (data.mapSnapshot.fogErasePaths) {map.fogErasePaths = data.mapSnapshot.fogErasePaths;}
        if (data.mapSnapshot.exploredAreas) {map.exploredAreas = data.mapSnapshot.exploredAreas;}
        if (data.mapSnapshot.environmentalObjects) {map.environmentalObjects = data.mapSnapshot.environmentalObjects;}
        if (data.mapSnapshot.drawingPaths) {map.drawingPaths = data.mapSnapshot.drawingPaths;}
        if (data.mapSnapshot.drawingLayers) {map.drawingLayers = data.mapSnapshot.drawingLayers;}
        if (data.mapSnapshot.dndElements) {map.dndElements = data.mapSnapshot.dndElements;}
        if (data.mapSnapshot.gridSettings) {map.gridSettings = data.mapSnapshot.gridSettings;}
      }

      const payload = {
        mapId,
        mapName: data.mapName || map.name || 'Map',
        pulledBy: player.name || 'Game Master',
        gmId: player.id,
        mapSnapshot: data.mapSnapshot
          ? roomAccess.projectMapDataForClient(data.mapSnapshot)
          : roomAccess.projectGameStateForClient({
            maps: {
              [mapId]: {
                id: mapId,
                name: map.name,
                tokens: map.tokens || {},
                characterTokens: map.characterTokens || {},
                gridItems: map.gridItems || {},
                terrainData: map.terrainData || {},
                wallData: map.wallData || {},
                fogOfWarData: map.fogOfWarData || {},
                fogOfWarPaths: map.fogOfWarPaths || [],
                fogErasePaths: map.fogErasePaths || [],
                exploredAreas: map.exploredAreas || {},
                environmentalObjects: map.environmentalObjects || [],
                drawingPaths: map.drawingPaths || [],
                gridSettings: map.gridSettings || null,
                dndElements: map.dndElements || []
              }
            }
          }).maps[mapId],
        sequence: getNextEventSequence()
      };

      io.to(room.id).emit('players_pulled_to_map', payload);
      logger.info(`🗺️ [pull_players_to_map] GM ${player.name} pulled all players to map ${mapId} (${payload.mapName})`);

      firebaseBatchWriter.queueWrite(room.id, room.gameState);

      if (typeof callback === 'function') {
        callback({ success: true, payload });
      }
    } catch (error) {
      logger.error('[pull_players_to_map] Error:', { error: error.message });
      if (typeof callback === 'function') {
        callback({ success: false, error: error.message });
      }
    }
  });
}

module.exports = { registerMapHandlers };
