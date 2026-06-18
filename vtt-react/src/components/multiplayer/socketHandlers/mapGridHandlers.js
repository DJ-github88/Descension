import useGameStore from '../../../store/gameStore';
import useLevelEditorStore from '../../../store/levelEditorStore';
import useMapStore from '../../../store/mapStore';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import useSettingsStore from '../../../store/settingsStore';

export function registerMapGridHandlers(ctx) {
  const {
    socket, isGMRef, currentPlayerRef, currentPlayer,
    playerCurrentMapIdRef, addCreature, addToken, addNotification
  } = ctx;
    socket.on('level_editor_state_synced', (data) => {
      console.log('ðŸ—ºï¸ Received level_editor_state_sync:', {
        mapId: data.mapId,
        hasLevelEditor: !!data.levelEditor,
        hasGridSettings: !!data.gridSettings
      });

      // CRITICAL FIX: Only process level editor sync if it's for our current map
      // This prevents terrain bleeding between maps
      if (data.mapId && data.mapId !== playerCurrentMapIdRef.current) {
        console.log(`[LevelEditorSync] Ignoring sync for map ${data.mapId} (we are on ${playerCurrentMapIdRef.current})`);
        return;
      }

      try {
        // Apply level editor state
        if (data.levelEditor) {
          const levelEditorStore = useLevelEditorStore.getState();

          if (data.levelEditor.terrainData !== undefined) {
            levelEditorStore.setTerrainData(data.levelEditor.terrainData);
          }
          if (data.levelEditor.wallData !== undefined) {
            levelEditorStore.setWallData(data.levelEditor.wallData);
          }
          if (data.levelEditor.windowOverlays !== undefined) {
            levelEditorStore.setWindowOverlays(data.levelEditor.windowOverlays);
          }
          if (data.levelEditor.environmentalObjects !== undefined) {
            levelEditorStore.setEnvironmentalObjects(data.levelEditor.environmentalObjects);
          }
          if (data.levelEditor.drawingPaths !== undefined) {
            levelEditorStore.setDrawingPaths(data.levelEditor.drawingPaths);
          }
          if (data.levelEditor.drawingLayers !== undefined) {
            levelEditorStore.setDrawingLayers(data.levelEditor.drawingLayers);
          }
          if (data.levelEditor.fogOfWarData !== undefined) {
            levelEditorStore.setFogOfWarData(data.levelEditor.fogOfWarData);
          }
          if (data.levelEditor.exploredAreas !== undefined) {
            levelEditorStore.setExploredAreas(data.levelEditor.exploredAreas);
          }
          if (data.levelEditor.lightSources !== undefined) {
            levelEditorStore.setLightSources(data.levelEditor.lightSources);
          }
          if (data.levelEditor.dynamicFogEnabled !== undefined) {
            levelEditorStore.setDynamicFogEnabled(data.levelEditor.dynamicFogEnabled);
          }
          if (data.levelEditor.respectLineOfSight !== undefined) {
            levelEditorStore.setRespectLineOfSight(data.levelEditor.respectLineOfSight);
          }
          if (data.levelEditor.dndElements !== undefined) {
            levelEditorStore.setDndElements(data.levelEditor.dndElements);
          }
          if (data.levelEditor.fogOfWarPaths !== undefined) {
            levelEditorStore.setFogOfWarPaths(data.levelEditor.fogOfWarPaths);
          }
          if (data.levelEditor.fogErasePaths !== undefined) {
            levelEditorStore.setFogErasePaths(data.levelEditor.fogErasePaths);
          }
          if (data.levelEditor.gridItems !== undefined) {
            import('../../../store/gridItemStore').then(({ default: useGridItemStore }) => {
              const currentItems = useGridItemStore.getState().gridItems || [];
              const otherMapItems = currentItems.filter(item => item.mapId !== (data.mapId || 'default'));
              useGridItemStore.setState({
                gridItems: [...otherMapItems, ...data.levelEditor.gridItems]
              });
            });
          }

          console.log('âœ… Level editor state applied');
        }

        // Apply grid settings
        if (data.gridSettings) {
          const gameStore = useGameStore.getState();

          if (data.gridSettings.gridType !== undefined) {
            gameStore.setGridType(data.gridSettings.gridType);
            console.log('ðŸ”· Grid type set to:', data.gridSettings.gridType);
          }
          if (data.gridSettings.gridSize !== undefined) {
            gameStore.setGridSize(data.gridSettings.gridSize);
          }
          if (data.gridSettings.gridOffsetX !== undefined && data.gridSettings.gridOffsetY !== undefined) {
            gameStore.setGridOffset(data.gridSettings.gridOffsetX, data.gridSettings.gridOffsetY);
          }
          if (data.gridSettings.gridLineColor !== undefined) {
            gameStore.setGridLineColor(data.gridSettings.gridLineColor);
          }
          if (data.gridSettings.gridLineThickness !== undefined) {
            gameStore.setGridLineThickness(data.gridSettings.gridLineThickness);
          }
          if (data.gridSettings.gridLineOpacity !== undefined) {
            gameStore.setGridLineOpacity(data.gridSettings.gridLineOpacity);
          }
          if (data.gridSettings.gridBackgroundColor !== undefined) {
            gameStore.setGridBackgroundColor(data.gridSettings.gridBackgroundColor);
          }

          console.log('âœ… Grid settings applied');
        }

        // Apply gameplay settings
        if (data.gameplaySettings) {
          const gameStore = useGameStore.getState();
          const settingsStore = useSettingsStore.getState();

          if (data.gameplaySettings.feetPerTile !== undefined) {
            settingsStore.setFeetPerTile(data.gameplaySettings.feetPerTile);
            gameStore.setFeetPerTile(data.gameplaySettings.feetPerTile);
          }
          if (data.gameplaySettings.showMovementVisualization !== undefined) {
            settingsStore.setShowMovementVisualization(data.gameplaySettings.showMovementVisualization);
            gameStore.setShowMovementVisualization(data.gameplaySettings.showMovementVisualization);
          }
          if (data.gameplaySettings.movementLineColor !== undefined) {
            settingsStore.setMovementLineColor(data.gameplaySettings.movementLineColor);
            gameStore.setMovementLineColor(data.gameplaySettings.movementLineColor);
          }
          if (data.gameplaySettings.movementLineWidth !== undefined) {
            settingsStore.setMovementLineWidth(data.gameplaySettings.movementLineWidth);
            gameStore.setMovementLineWidth(data.gameplaySettings.movementLineWidth);
          }
          if (data.gameplaySettings.defaultViewFromToken !== undefined) {
            settingsStore.setDefaultViewFromToken(data.gameplaySettings.defaultViewFromToken);
            gameStore.setDefaultViewFromToken(data.gameplaySettings.defaultViewFromToken);
          }
          console.log('âœ… Gameplay settings applied');
        }
      } catch (error) {
        console.error('âŒ Failed to apply level editor state sync:', error);
      }
    });

    socket.on('map_update', (data) => {
      console.log(`ðŸ“¥ [map_updated] Received for map ${data.mapId}, I'm on ${playerCurrentMapIdRef.current}, updatedBy: ${data.updatedBy}`);
      // CRITICAL FIX: Only process updates for the map we are currently on
      // This prevents "bleeding" of changes from other maps
      if (data.mapId && data.mapId !== playerCurrentMapIdRef.current) {
        console.log(`[Map] Ignoring update for map ${data.mapId} (we are on ${playerCurrentMapIdRef.current})`);
        return;
      }

      // CRITICAL FIX: Ignore echos of our own updates (prevents sync loops and blocking our own paint batches)
      if (data.updatedBy === currentPlayerRef.current?.id) {
        return;
      }

      window._isReceivingMapUpdate = true;

      import('../../../store/levelEditorStore').then(({ default: useLevelEditorStore }) => {
        const levelEditorStore = useLevelEditorStore.getState();

        // Handle both mapData (new format) and mapUpdates (legacy/store format)
        const mapData = data.mapData || data.mapUpdates || {};

        // Update fog of war if provided
        if (mapData.fogOfWar !== undefined) {
          levelEditorStore.setFogOfWarData(mapData.fogOfWar);
        }

        // Update fog paths if provided
        if (mapData.fogOfWarPaths !== undefined) {
          levelEditorStore.setFogOfWarPaths(mapData.fogOfWarPaths);
        }
        if (mapData.fogErasePaths !== undefined) {
          levelEditorStore.setFogErasePaths(mapData.fogErasePaths);
        }

        // CRITICAL FIX: Update terrain data if provided (this is the key fix for terrain tiles)
        if (mapData.terrainData !== undefined) {
          // Merge terrain data instead of replacing to preserve existing tiles
          // FIXED: levelEditorStore is already the result of getState(), access terrainData directly
          const currentTerrainData = levelEditorStore.terrainData || {};

          // CRITICAL FIX: Properly handle null values (erased terrain) and ensure all tiles are merged
          const mergedTerrainData = { ...currentTerrainData };
          for (const [key, value] of Object.entries(mapData.terrainData)) {
            if (value === null) {
              // Remove erased tiles
              delete mergedTerrainData[key];
            } else {
              // Add or update tile
              mergedTerrainData[key] = value;
            }
          }

          levelEditorStore.setTerrainData(mergedTerrainData);
        }

        // Update wall data if provided
        if (mapData.wallData !== undefined) {
          levelEditorStore.setWallData(mapData.wallData);
        }
        if (mapData.windowOverlays !== undefined) {
          levelEditorStore.setWindowOverlays(mapData.windowOverlays);
        }

        // Update drawing layers if provided
        if (mapData.drawingLayers !== undefined) {
          levelEditorStore.setDrawingLayers(mapData.drawingLayers);
        }

        // Update drawing paths if provided
        if (mapData.drawingPaths !== undefined) {
          levelEditorStore.setDrawingPaths(mapData.drawingPaths);
        }

        // CRITICAL FIX: Update explored areas if provided (for fog of war memory)
        if (mapData.exploredAreas !== undefined) {
          levelEditorStore.setExploredAreas(mapData.exploredAreas);
        }

        // Update dndElements (connections/portals) if provided
        if (mapData.dndElements !== undefined) {
          levelEditorStore.setDndElements(mapData.dndElements);
        }

        // CRITICAL FIX: Reset flag after processing to allow future updates
        setTimeout(() => {
          window._isReceivingMapUpdate = false;
        }, 100);
      }).catch(error => {
        console.error('Failed to update map data:', error);
        // Reset flag even on error
        window._isReceivingMapUpdate = false;
      });
    });

    socket.on('weather_update', (data) => {
      import('../../../store/levelEditorStore').then(({ default: useLevelEditorStore }) => {
        const store = useLevelEditorStore.getState();
        if (data.enabled && data.type && data.type !== 'none') {
          store.setWeatherEffect(data.type, data.intensity, data.enabled);
          if (!store.atmosphericEffects) {
            useLevelEditorStore.setState({ atmosphericEffects: true });
          }
        } else {
          store.clearWeatherEffects();
        }
      }).catch(e => {
        console.warn('Failed to apply weather update:', e);
      });
    });

    socket.on('grid_item_update', (data) => {
      const myRole = isGMRef.current ? 'GM' : 'Player';
      console.log(`ðŸ“¨ [${myRole}] Received grid_item_update:`, {
        action: data.action,
        itemId: data.itemId,
        mapId: data.mapId,
        addedBy: data.addedBy,
        updatedBy: data.updatedBy,
        removedBy: data.removedBy
      });

      // CRITICAL FIX: Filter by current map - only update items on same map
      const currentMapId = useMapStore.getState().currentMapId || 'default';
      const itemMapId = data.mapId || 'default';

      if (itemMapId !== currentMapId) {
        console.log(`ðŸ“¦ Skipping grid_item_update - different map (item: ${itemMapId}, current: ${currentMapId})`);
        return;
      }

      // Handle different action types (server uses 'action', not 'updateType')
      import('../../../store/gridItemStore').then(({ default: useGridItemStore }) => {
        const gridItemStore = useGridItemStore.getState();

        if (data.action === 'add' && data.item) {
          // Add new item to grid - server sends 'item' with position inside
          const position = data.item.position || data.item.gridPosition;
          gridItemStore.addItemToGrid(data.item, position, false, itemMapId);
        } else if (data.action === 'update' && data.itemId && data.updates) {
          // Update item - server sends 'updates' object
          if (data.updates.position || data.updates.gridPosition) {
            gridItemStore.updateItemPosition(data.itemId, data.updates.position || data.updates.gridPosition, false, itemMapId);
          } else {
            // Handle other property updates (like container properties, visibility, etc.)
            gridItemStore.updateGridItemProperties(data.itemId, data.updates, false);
          }
          // Could also handle other property updates here if needed
        } else if (data.action === 'remove' && data.itemId) {
          // Remove item from grid
          gridItemStore.removeItemFromGrid(data.itemId, false);
        }
      }).catch(error => {
        console.error('Failed to import gridItemStore:', error);
      });
    });

    socket.on('item_dropped', (data) => {
      const isSync = data.isSync;
      const myRole = isGMRef.current ? 'GM' : 'Player';
      console.log(`ðŸ“¨ [${myRole}] Received item_dropped:`, {
        itemName: data.item?.name,
        itemId: data.item?.id,
        position: data.position,
        fromPlayer: data.playerName,
        isSync: data.isSync,
        isFromSelf: data.playerId === currentPlayerRef.current?.id,
        itemMapId: data.mapId
      });

      // CRITICAL FIX: Filter by current map - only add items on same map
      const currentMapId = useMapStore.getState().currentMapId || 'default';
      const itemMapId = data.mapId || data.item?.mapId || 'default';

      if (itemMapId !== currentMapId) {
        console.log(`ðŸ“¦ Skipping item_dropped - different map (item: ${itemMapId}, current: ${currentMapId})`);
        return;
      }

      // Only add item if it's not our own drop (to avoid duplicates) or if it's a sync
      if (data.playerId !== currentPlayerRef.current?.id || isSync) {
        // Import grid item store dynamically to avoid circular dependencies
        import('../../../store/gridItemStore').then(({ default: useGridItemStore }) => {
          const { addItemToGrid } = useGridItemStore.getState();

          // Add the item to the grid without sending back to server (avoid infinite loop)
          addItemToGrid(data.item, data.position, false);

          // Show notification in chat only for new drops from other players, not syncs or own drops
          if (!isSync && data.playerId !== currentPlayerRef.current?.id) {
            addNotification('social', {
              sender: { name: 'System', class: 'system', level: 0 },
              content: `${data.playerName} dropped ${data.item.name} on the grid`,
              type: 'system',
              timestamp: new Date().toISOString()
            });
          }
        }).catch(error => {
          console.error('Failed to import gridItemStore:', error);
        });
      }
    });

    socket.on('item_looted', (data) => {

      // Add loot notification to the loot tab
      addNotification('loot', {
        type: 'item_looted',
        item: data.item,
        quantity: data.quantity,
        source: data.source,
        looter: data.looter,
        timestamp: data.timestamp
      });

      // Show in social chat only if it's not our own loot action
      if (data.playerId !== currentPlayerRef.current?.id) {
        addNotification('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: `${data.looter} looted ${data.item?.name || 'an item'} (x${data.quantity || 1}) from ${data.source}`,
          type: 'system',
          timestamp: new Date().toISOString()
        });
      }

      // Remove the item from grid if it was successfully removed on server
      // Remove the item from grid if it was successfully removed on server
      // For currency items, also process our own removals to ensure synchronization
      // For other items, only remove if this is from another player (our own removals are handled immediately)
      // CRITICAL FIX: Filter by map - only remove from grid if we are on the same map
      const currentMapId = useMapStore.getState().currentMapId || 'default';
      const itemMapId = data.mapId || 'default';

      const shouldRemove = data.gridItemId && data.itemRemoved && (itemMapId === currentMapId) && (
        data.playerId !== currentPlayerRef.current?.id || // Other player's loot
        (data.item && data.item.type === 'currency') // Our own currency loot (needs server confirmation)
      );

      if (shouldRemove) {
        import('../../../store/gridItemStore').then(({ default: useGridItemStore }) => {
          const { removeItemFromGrid, gridItems } = useGridItemStore.getState();

          // Check if item still exists before trying to remove it
          const itemExists = gridItems.find(item => item.id === data.gridItemId);
          if (itemExists) {
            removeItemFromGrid(data.gridItemId);
          }
        }).catch(error => {
          console.error('Failed to import gridItemStore for loot removal:', error);
        });
      }
    });

    socket.on('sync_grid_items', (data) => {

      const currentMapId = useMapStore.getState().currentMapId || 'default';

      import('../../../store/gridItemStore').then(({ default: useGridItemStore }) => {
        const { addItemToGrid } = useGridItemStore.getState();

        // Add each grid item without sending back to server
        Object.values(data.gridItems).forEach(gridItem => {
          // CRITICAL FIX: Only add items that belong to the current map
          const itemMapId = gridItem.mapId || (gridItem.gridPosition ? 'default' : currentMapId);

          if (itemMapId === currentMapId) {
            addItemToGrid(gridItem, gridItem.position, false);
          }
        });
      }).catch(error => {
        console.error('Failed to import gridItemStore for sync:', error);
      });
    });

    socket.on('sync_tokens', (data) => {
      const currentMapId = useMapStore.getState().currentMapId || 'default';

      console.log('ðŸ”„ [sync_tokens] Received token sync, currentMapId:', currentMapId, '| token count:', Object.keys(data.tokens || {}).length);

      // Add each token without sending back to server
      Object.values(data.tokens).forEach(tokenData => {
        // Map ID matching: treat missing/null mapId as 'default'
        const tokenMapId = tokenData.mapId || tokenData.targetMapId || 'default';

        // Accept token if: (a) exact map match, or (b) both are 'default'
        const isMapMatch = tokenMapId === currentMapId || (tokenMapId === 'default' && (!currentMapId || currentMapId === 'default'));
        if (!isMapMatch) {
          console.log(`ðŸŽ­ [sync_tokens] Skipping token ${tokenData.id} â€“ map mismatch (token: ${tokenMapId}, current: ${currentMapId})`);
          return;
        }

        // First ensure the creature exists in the library
        if (tokenData.creature) {
          addCreature(tokenData.creature);
        }

        // Add the token â€“ pass the creature object if available so addCreatureToken
        // doesn't have to do a library lookup (which may fail for first-time sync)
        const creatureArg = tokenData.creature || tokenData.creatureId;
        addToken(creatureArg, tokenData.position, false, tokenData.id, tokenData.state, tokenMapId);
      });
    });

    socket.on('sync_character_tokens', (data) => {
      const currentMapId = useMapStore.getState().currentMapId || 'default';

      try {
        const { addCharacterTokenFromServer, clearCharacterTokens } = useCharacterTokenStore.getState();

        // Don't clear tokens here, just add matching ones
        // If we want a full sync, we should clear first, but this might run incrementally

        Object.values(data.characterTokens).forEach(token => {
          const tokenMapId = token.mapId || 'default';
          if (tokenMapId === currentMapId) {
            addCharacterTokenFromServer(token.id, token.position, token.playerId, tokenMapId);
          }
        });
      } catch (error) {
        console.error('Failed to sync character tokens:', error);
      }
    });

    socket.on('item_update', (data) => {
      // Import item store dynamically to avoid circular dependencies
      import('../../../store/itemStore').then(({ default: useItemStore }) => {
        const itemStore = useItemStore.getState();

        // Only process updates from other players (not our own)
        if (data.playerId !== currentPlayer?.id) {
          switch (data.type) {
            case 'item_added':
              // Add the new item
              if (data.data && data.data.item && data.data.categories) {
                itemStore.addItem(data.data.item, data.data.categories);
              }
              break;

            case 'item_updated':
              // Update the item
              if (data.data && data.data.itemId && data.data.updates) {
                itemStore.updateItem(data.data.itemId, data.data.updates);
              }
              break;

            case 'item_removed':
              // Remove the item
              if (data.data && data.data.itemId) {
                itemStore.removeItem(data.data.itemId);
              }
              break;

            case 'item_moved':
              // Move the item to a different category
              if (data.data && data.data.itemId && data.data.categoryId) {
                itemStore.moveItem(data.data.itemId, data.data.categoryId);
              }
              break;
          }
        }
      });
    });

    socket.on('window_update', (data) => {
      // Window updates are mostly informational - each player manages their own UI
      // But we can log for awareness or future features
      if (data.type === 'window_registered') {
      } else if (data.type === 'window_focused') {
      }
    });

    socket.on('container_update', (data) => {
      // Import container store dynamically to avoid circular dependencies
      import('../../../store/containerStore').then(({ default: useContainerStore }) => {
        const containerStore = useContainerStore.getState();

        // Only process updates from other players (not our own)
        if (data.playerId !== currentPlayer?.id) {
          switch (data.type) {
            case 'container_added':
              // Add the new container
              if (data.data) {
                containerStore.addContainer(data.data);
              }
              break;

            case 'container_removed':
              // Remove the container
              if (data.data && data.data.containerId) {
                containerStore.removeContainer(data.data.containerId);
              }
              break;

            case 'container_toggled':
              // This is the most critical - sync open/close state
              if (data.data && data.data.containerId !== undefined) {
                // We need to check if the container exists and update its state
                // Since toggleOpen checks if it's not locked, we need to directly set the state
                const containerStore = useContainerStore.getState();
                // For now, we'll trust the sync - in a full implementation we'd verify
              }
              break;

            case 'container_lock_toggled':
              // Sync lock state
              if (data.data && data.data.containerId !== undefined) {
              }
              break;

            case 'item_added_to_container':
              // Add item to container
              if (data.data && data.data.containerId && data.data.item) {
                containerStore.addItemToContainer(data.data.containerId, data.data.item, data.data.item.position);
              }
              break;

            case 'item_removed_from_container':
              // Remove item from container
              if (data.data && data.data.containerId && data.data.itemId) {
                containerStore.removeItemFromContainer(data.data.containerId, data.data.itemId);
              }
              break;

            case 'container_position_updated':
              // Update container position
              if (data.data && data.data.containerId && data.data.position) {
                containerStore.updateContainerPosition(data.data.containerId, data.data.position);
              }
              break;
          }
        }
      });
    });

    socket.on('area_remove', (data) => {
      // Only process removals from other players (not our own)
      if (data.removedBy !== currentPlayerRef.current?.id) {
        import('../../../store/levelEditorStore').then(({ default: useLevelEditorStore }) => {
          const levelEditorStore = useLevelEditorStore.getState();
          const { removeToken } = require('../../../store/creatureStore').default.getState();
          const { removeCharacterToken } = require('../../../store/characterTokenStore').default.getState();
          const { removeItemFromGrid } = require('../../../store/gridItemStore').default.getState();
          const { removeEnvironmentalObject, removeDrawingPath, removeWall, clearTerrain } = levelEditorStore;

          const { removeType, selectedObjects } = data;

          if (removeType === 'all') {
            selectedObjects.tokens?.forEach(token => removeToken(token.id));
            selectedObjects.characterTokens?.forEach(token => removeCharacterToken(token.id));
            selectedObjects.items?.forEach(item => removeItemFromGrid(item.id));
            selectedObjects.environmentalObjects?.forEach(obj => removeEnvironmentalObject(obj.id));
            selectedObjects.walls?.forEach(({ key }) => {
              const [x1, y1, x2, y2] = key.split(',').map(Number);
              removeWall(x1, y1, x2, y2);
            });
            selectedObjects.drawings?.forEach(path => removeDrawingPath(path.id));
            selectedObjects.terrainTiles?.forEach(({ gridX, gridY }) => {
              clearTerrain(gridX, gridY);
            });
          } else if (removeType === 'tokens') {
            selectedObjects.tokens?.forEach(token => removeToken(token.id));
          } else if (removeType === 'characterTokens') {
            selectedObjects.characterTokens?.forEach(token => removeCharacterToken(token.id));
          } else if (removeType === 'items') {
            selectedObjects.items?.forEach(item => removeItemFromGrid(item.id));
          } else if (removeType === 'environmentalObjects') {
            selectedObjects.environmentalObjects?.forEach(obj => removeEnvironmentalObject(obj.id));
          } else if (removeType === 'walls') {
            selectedObjects.walls?.forEach(({ key }) => {
              const [x1, y1, x2, y2] = key.split(',').map(Number);
              removeWall(x1, y1, x2, y2);
            });
          } else if (removeType === 'drawings') {
            selectedObjects.drawings?.forEach(path => removeDrawingPath(path.id));
          } else if (removeType === 'terrainTiles') {
            selectedObjects.terrainTiles?.forEach(({ gridX, gridY }) => {
              clearTerrain(gridX, gridY);
            });
          }

        }).catch(error => {
          console.error('Failed to process area remove:', error);
        });
      }
    });

  return () => {
    socket.off('level_editor_state_synced');
    socket.off('map_update');
    socket.off('weather_update');
    socket.off('grid_item_update');
    socket.off('item_dropped');
    socket.off('item_looted');
    socket.off('sync_grid_items');
    socket.off('sync_tokens');
    socket.off('sync_character_tokens');
    socket.off('item_update');
    socket.off('window_update');
    socket.off('container_update');
    socket.off('area_remove');
  };
}
