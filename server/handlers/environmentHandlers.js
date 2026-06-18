/**
 * Environment Handlers
 *
 * Map-level environmental state (per-map, persisted for permanent rooms):
 * - container_update: loot container contents
 * - creature_added / creature_updated: NPC state on map
 * - wall_update: wall placement/removal/batch (GM-controlled)
 * - door_state_changed: toggle door open/closed
 * - light_source_update: dynamic lighting add/remove/update
 * - fog_update: fog of war data + paths (GM-only)
 * - weather_update: room-wide weather state (GM-only)
 * - drawing_update: GM drawing annotation paths/layers
 * - environmental_object_update: chests/doors/portals/GM notes add/remove/update
 */

function registerEnvironmentHandlers(ctx) {
  const {
    io,
    socket,
    rooms,
    players,
    logger,
    uuidv4,
    validateRoomMembership,
    validateMapExists,
    firebaseBatchWriter,
    stripUndefined
  } = ctx;

  socket.on('container_update', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room } = validation;
      const mapId = data.mapId || room.gameState.defaultMapId || 'default';
      const map = validateMapExists(room, mapId);

      if (data.container) {
        if (!map.containers) map.containers = {};
        map.containers[data.container.id] = data.container;
      }

      socket.to(data.roomId).emit('container_update', {
        container: data.container,
        mapId,
        updatedBy: socket.id
      });

      firebaseBatchWriter.queueWrite(data.roomId, room.gameState);

    } catch (error) {
      logger.error('[container_update] Error:', { error: error.message });
    }
  });

  socket.on('creature_added', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room } = validation;
      const mapId = data.mapId || room.gameState.defaultMapId || 'default';
      const map = validateMapExists(room, mapId);

      if (!map.creatures) map.creatures = {};
      const creatureId = data.creature.id || uuidv4();
      map.creatures[creatureId] = {
        ...data.creature,
        id: creatureId,
        addedAt: Date.now()
      };

      io.to(data.roomId).emit('creature_added', {
        creature: map.creatures[creatureId],
        mapId,
        addedBy: socket.id
      });

      firebaseBatchWriter.queueWrite(data.roomId, room.gameState);

    } catch (error) {
      logger.error('[creature_added] Error:', { error: error.message });
    }
  });

  socket.on('creature_updated', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room } = validation;
      const mapId = data.mapId || room.gameState.defaultMapId || 'default';
      const map = validateMapExists(room, mapId);

      const updates = data.updates || data.stateUpdates || {};
      if (map.creatures && map.creatures[data.creatureId]) {
        map.creatures[data.creatureId] = {
          ...map.creatures[data.creatureId],
          ...updates
        };

        io.to(data.roomId).emit('creature_updated', {
          creatureId: data.creatureId,
          updates: updates,
          mapId,
          updatedBy: socket.id
        });

        const sanitizedState = stripUndefined(room.gameState);
        firebaseBatchWriter.queueWrite(data.roomId, sanitizedState);
      }

    } catch (error) {
      logger.error('[creature_updated] Error:', { error: error.message });
    }
  });

  socket.on('wall_update', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room } = validation;
      const mapId = data.mapId || room.gameState.defaultMapId || 'default';
      const map = validateMapExists(room, mapId);

      if (data.action === 'add' && data.wall) {
        const wallId = data.wall.id || uuidv4();
        map.wallData[wallId] = data.wall;

        io.to(data.roomId).emit('wall_update', {
          action: 'add',
          wall: { ...data.wall, id: wallId },
          mapId,
          updatedBy: socket.id
        });
      } else if (data.action === 'remove' && data.wallId) {
        delete map.wallData[data.wallId];

        io.to(data.roomId).emit('wall_update', {
          action: 'remove',
          wallId: data.wallId,
          mapId,
          updatedBy: socket.id
        });
      } else if (data.action === 'batch' && data.walls) {
        data.walls.forEach(wall => {
          const wallId = wall.id || uuidv4();
          map.wallData[wallId] = wall;
        });

        io.to(data.roomId).emit('wall_update', {
          action: 'batch',
          walls: data.walls,
          mapId,
          updatedBy: socket.id
        });
      }

      firebaseBatchWriter.queueWrite(data.roomId, room.gameState);

    } catch (error) {
      logger.error('[wall_update] Error:', { error: error.message });
    }
  });

  socket.on('door_state_changed', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room } = validation;
      const mapId = data.mapId || room.gameState.defaultMapId || 'default';
      const map = validateMapExists(room, mapId);

      if (map.wallData[data.doorId]) {
        map.wallData[data.doorId].isOpen = data.isOpen;

        io.to(data.roomId).emit('door_state_changed', {
          doorId: data.doorId,
          isOpen: data.isOpen,
          mapId,
          changedBy: socket.id
        });

        firebaseBatchWriter.queueWrite(data.roomId, room.gameState);
      }

    } catch (error) {
      logger.error('[door_state_changed] Error:', { error: error.message });
    }
  });

  socket.on('light_source_update', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room } = validation;
      const mapId = data.mapId || room.gameState.defaultMapId || 'default';
      const map = validateMapExists(room, mapId);

      if (data.action === 'add' && data.lightSource) {
        const lightId = data.lightSource.id || uuidv4();
        map.lightSources[lightId] = data.lightSource;

        io.to(data.roomId).emit('light_source_update', {
          action: 'add',
          lightSource: { ...data.lightSource, id: lightId },
          mapId,
          updatedBy: socket.id
        });
      } else if (data.action === 'remove' && data.lightId) {
        delete map.lightSources[data.lightId];

        io.to(data.roomId).emit('light_source_update', {
          action: 'remove',
          lightId: data.lightId,
          mapId,
          updatedBy: socket.id
        });
      } else if (data.action === 'update' && data.lightId && data.updates) {
        if (map.lightSources[data.lightId]) {
          map.lightSources[data.lightId] = {
            ...map.lightSources[data.lightId],
            ...data.updates
          };

          io.to(data.roomId).emit('light_source_update', {
            action: 'update',
            lightId: data.lightId,
            updates: data.updates,
            mapId,
            updatedBy: socket.id
          });
        }
      }

      firebaseBatchWriter.queueWrite(data.roomId, room.gameState);

    } catch (error) {
      logger.error('[light_source_update] Error:', { error: error.message });
    }
  });

  socket.on('fog_update', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room } = validation;
      const mapId = data.mapId || room.gameState.defaultMapId || 'default';
      const map = validateMapExists(room, mapId);

      if (data.fogData) {
        map.fogOfWarData = {
          ...map.fogOfWarData,
          ...data.fogData
        };
      }

      if (data.fogPaths) {
        map.fogOfWarPaths = [
          ...(map.fogOfWarPaths || []),
          ...data.fogPaths
        ];
      }

      socket.to(data.roomId).emit('fog_update', {
        fogData: map.fogOfWarData,
        fogPaths: map.fogOfWarPaths,
        mapId,
        updatedBy: socket.id
      });

      firebaseBatchWriter.queueWrite(data.roomId, room.gameState, true);

    } catch (error) {
      logger.error('[fog_update] Error:', { error: error.message });
    }
  });

  socket.on('weather_update', (data) => {
    try {
      const player = players.get(socket.id);
      if (!player || !player.isGM) return;

      const room = rooms.get(player.roomId);
      if (!room) return;

      if (!room.gameState.weather) room.gameState.weather = {};
      room.gameState.weather = { ...data };

      socket.to(player.roomId).emit('weather_update', data);

      firebaseBatchWriter.queueWrite(player.roomId, room.gameState, true);
    } catch (error) {
      logger.error('[weather_update] Error:', { error: error.message });
    }
  });

  socket.on('drawing_update', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room } = validation;
      const mapId = data.mapId || room.gameState.defaultMapId || 'default';
      const map = validateMapExists(room, mapId);

      if (data.paths) {
        map.drawingPaths = data.paths;
      }

      if (data.layers) {
        map.drawingLayers = data.layers;
      }

      socket.to(data.roomId).emit('drawing_update', {
        paths: map.drawingPaths,
        layers: map.drawingLayers,
        mapId,
        updatedBy: socket.id
      });

      firebaseBatchWriter.queueWrite(data.roomId, room.gameState);

    } catch (error) {
      logger.error('[drawing_update] Error:', { error: error.message });
    }
  });

  socket.on('environmental_object_update', async (data) => {
    try {
      const validation = validateRoomMembership(socket, data.roomId);
      if (!validation.valid) return;

      const { room } = validation;
      const mapId = data.mapId || room.gameState.defaultMapId || 'default';
      const map = validateMapExists(room, mapId);

      if (data.action === 'add' && data.object) {
        map.environmentalObjects.push(data.object);

        io.to(data.roomId).emit('environmental_object_update', {
          action: 'add',
          object: data.object,
          mapId,
          updatedBy: socket.id
        });
      } else if (data.action === 'remove' && data.objectId) {
        map.environmentalObjects = map.environmentalObjects.filter(
          obj => obj.id !== data.objectId
        );

        io.to(data.roomId).emit('environmental_object_update', {
          action: 'remove',
          objectId: data.objectId,
          mapId,
          updatedBy: socket.id
        });
      } else if (data.action === 'update' && data.objectId && data.updates) {
        const objIndex = map.environmentalObjects.findIndex(
          obj => obj.id === data.objectId
        );
        if (objIndex >= 0) {
          map.environmentalObjects[objIndex] = {
            ...map.environmentalObjects[objIndex],
            ...data.updates
          };

          io.to(data.roomId).emit('environmental_object_update', {
            action: 'update',
            objectId: data.objectId,
            updates: data.updates,
            mapId,
            updatedBy: socket.id
          });
        }
      }

      firebaseBatchWriter.queueWrite(data.roomId, room.gameState);

    } catch (error) {
      logger.error('[environmental_object_update] Error:', { error: error.message });
    }
  });
}

module.exports = { registerEnvironmentHandlers };
