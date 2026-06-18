import useAuthStore from '../../../store/authStore';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import useCreatureStore from '../../../store/creatureStore';
import useGameStore from '../../../store/gameStore';
import useMapStore from '../../../store/mapStore';
import usePartyStore from '../../../store/partyStore';

export function registerGmHandlers(ctx) {
  const {
    socket, currentPlayerRef, addNotification, addNotificationRef,
    setMapTransition, isInitialMapLoadRef, setPlayerCurrentMapId,
    clearCreatureTokens, clearCharacterTokens, addCreature, addToken,
    showMapTransitions
  } = ctx;
    socket.on('gm_action', (data) => {
      if (!data) return;
      const { type, amount, targetPlayerId, targetUserId, targetPlayerIds } = data;

      // CRITICAL FIX: Verify if this player is the intended target
      const myId = currentPlayerRef.current?.id;
      const myUserId = useAuthStore.getState().user?.uid;
      const mySocketId = socket?.id;

      // Support both singular (targetPlayerId/targetUserId) and plural (targetPlayerIds array) formats
      const isTarget = (() => {
        // If no targeting specified, broadcast to all
        if (!targetPlayerId && !targetUserId && (!targetPlayerIds || targetPlayerIds.length === 0)) {
          return true;
        }
        // Check array format (targetPlayerIds)
        if (targetPlayerIds && Array.isArray(targetPlayerIds) && targetPlayerIds.length > 0) {
          return targetPlayerIds.some(id =>
            id === 'current-player' ||
            id === myId ||
            id === myUserId ||
            id === mySocketId
          );
        }
        // Check singular format (targetPlayerId/targetUserId)
        return (targetPlayerId === 'current-player') ||
          (myId && (targetPlayerId === myId || targetUserId === myId)) ||
          (myUserId && (targetUserId === myUserId || targetPlayerId === myUserId)) ||
          (mySocketId && (targetPlayerId === mySocketId || targetUserId === mySocketId));
      })();

      if (!isTarget) {
        console.log('ðŸŽ® GM action ignored (not target):', type, { targetPlayerId, targetUserId, targetPlayerIds, myId, myUserId });
        return;
      }

      console.log('ðŸŽ® Received GM action:', type, data);

      switch (type) {
        case 'award_xp':
          // Award XP to local character
          import('../../../store/characterStore').then(({ default: useCharacterStore }) => {
            const charStore = useCharacterStore.getState();
            charStore.awardExperience(amount);

            // Show notification
            addNotification('social', {
              sender: { name: 'System', class: 'system', level: 0 },
              content: `A Game Master has awarded you ${amount} XP.`,
              isSystem: true,
              timestamp: new Date().toISOString()
            });
          });
          break;

        case 'adjust_level':
          // Adjust level of local character
          import('../../../store/characterStore').then(({ default: useCharacterStore }) => {
            const charStore = useCharacterStore.getState();
            charStore.adjustLevel(amount);

            // Show notification
            addNotification('social', {
              sender: { name: 'System', class: 'system', level: 0 },
              content: `A Game Master has ${amount > 0 ? 'increased' : 'decreased'} your level by ${Math.abs(amount)}.`,
              isSystem: true,
              timestamp: new Date().toISOString()
            });
          });
          break;

        case 'short_rest':
          // Apply short rest locally
          import('../../../store/gameStore').then(({ default: useGameStore }) => {
            useGameStore.getState().takeShortRest();

            // Show notification
            addNotification('social', {
              sender: { name: 'System', class: 'system', level: 0 },
              content: `A Game Master has triggered a Short Rest for you.`,
              isSystem: true,
              timestamp: new Date().toISOString()
            });
            console.log('ðŸ˜´ Short rest triggered by GM');
          }).catch(error => {
            console.error('Failed to trigger short rest:', error);
          });
          break;

        case 'long_rest':
          // Apply long rest locally
          import('../../../store/gameStore').then(({ default: useGameStore }) => {
            useGameStore.getState().takeLongRest();

            // Show notification
            addNotification('social', {
              sender: { name: 'System', class: 'system', level: 0 },
              content: `A Game Master has triggered a Long Rest for you.`,
              isSystem: true,
              timestamp: new Date().toISOString()
            });
            console.log('ðŸ˜´ Long rest triggered by GM');
          }).catch(error => {
            console.error('Failed to trigger long rest:', error);
          });
          break;

        case 'heal_all':
          // Heal local character
          import('../../../store/characterStore').then(({ default: useCharacterStore }) => {
            const charStore = useCharacterStore.getState();
            charStore.updateResource('health', charStore.health.max, charStore.health.max);

            // Show notification
            addNotification('social', {
              sender: { name: 'System', class: 'system', level: 0 },
              content: `A Game Master has fully healed the party.`,
              isSystem: true,
              timestamp: new Date().toISOString()
            });
            console.log('ðŸ’š Party healed by GM');
          });
          break;

        case 'clear_fog':
          // Clear fog locally
          import('../../../store/levelEditorStore').then(({ default: useLevelEditorStore }) => {
            useLevelEditorStore.getState().clearAllFog();
            console.log('ðŸŒ«ï¸ Fog cleared by GM');
          });
          break;

        case 'reset_combat':
          // Reset combat locally
          import('../../../store/combatStore').then(({ default: useCombatStore }) => {
            useCombatStore.getState().forceResetCombat();
            console.log('âš”ï¸ Combat reset by GM');
          });
          break;

        default:
          console.warn('Unknown GM action type:', type);
      }
    });

    socket.on('forced_map_transfer', (data) => {
      // DETAILED LOGGING: Log full transfer data
      console.log('ðŸ”„ [forced_map_transfer] Received from server', {
        mapId: data.mapId,
        mapName: data.mapName,
        reason: data.reason,
        hasMapData: !!data.mapData,
        mapDataKeys: data.mapData ? Object.keys(data.mapData) : [],
        tokenCount: data.mapData?.tokens ? Object.keys(data.mapData.tokens).length : 0,
        characterTokenCount: data.mapData?.characterTokens ? Object.keys(data.mapData.characterTokens).length : 0,
        gridItemCount: data.mapData?.gridItems ? Object.keys(data.mapData.gridItems).length : 0,
        currentPlayerId: currentPlayerRef.current?.id,
        socketId: socket?.id
      });

      // Block outgoing updates during map switch
      window._isMapSwitching = true;
      console.log('ðŸ”’ [forced_map_transfer] Set window._isMapSwitching = true');

      // Show transition overlay
      const shouldShowTransition = !isInitialMapLoadRef.current;
      console.log('ðŸŽ¬ [forced_map_transfer] Transition decision', {
        shouldShowTransition,
        isInitialMapLoad: isInitialMapLoadRef.current
      });

      if (shouldShowTransition) {
        const localMap = useMapStore.getState().maps?.find(m => m.id === data.mapId);
        const mapName = data.mapName || localMap?.name || data.mapId || 'Unknown Location';
        setMapTransition({
          isActive: true,
          mapName: mapName,
          transferredByGM: true
        });
        console.log('ðŸŽ¬ [forced_map_transfer] Started transition overlay for:', mapName);
      }

      isInitialMapLoadRef.current = false;

      // Update local map ID and party assignment
      setPlayerCurrentMapId(data.mapId);
      useMapStore.setState({ currentMapId: data.mapId });
      usePartyStore.getState().setPlayerMapAssignment(currentPlayerRef.current?.id, data.mapId);
      console.log('ðŸ“ [forced_map_transfer] Updated map IDs', {
        playerCurrentMapId: data.mapId,
        mapStoreCurrentMapId: data.mapId
      });

      // If server sent map data, hydrate our stores now
      const mapSwapDelay = shouldShowTransition ? TRANSITION_TIMINGS.SAFE_SWAP_MS : 0;
      console.log('â±ï¸ [forced_map_transfer] Scheduling hydration in', mapSwapDelay, 'ms');

      setTimeout(() => {
        const mapData = data.mapData || {};
        const localMapCache = useMapStore.getState().maps?.find(m => m.id === data.mapId) || {};

        console.log('ðŸ“¦ [forced_map_transfer] Starting hydration', {
          hasServerMapData: Object.keys(mapData).length > 0,
          hasLocalMapCache: !!localMapCache.id,
          serverDataKeys: Object.keys(mapData)
        });

        // Always clear tokens on map switch to prevent stale tokens from lingering
        clearCreatureTokens();
        clearCharacterTokens();
        console.log('ðŸ§¹ [forced_map_transfer] Cleared old creature/character tokens');

        if (Object.keys(mapData).length > 0) {
          import('../../../store/levelEditorStore').then(({ default: useLevelEditorStore, mapUpdateBatcher }) => {
            if (mapUpdateBatcher) mapUpdateBatcher.clear();
            const les = useLevelEditorStore.getState();
            window._isReceivingMapUpdate = true;

            // CRITICAL FIX: Clear all fog and memories on map change
            if (les.clearAllFogAndMemories) {
              les.clearAllFogAndMemories();
            }

            const nextTerrain = mapData.terrainData ?? localMapCache.terrainData;
            const nextWall = mapData.wallData ?? localMapCache.wallData;
            const nextWindowOverlays = mapData.windowOverlays ?? localMapCache.windowOverlays;
            const nextFogPaths = mapData.fogOfWarPaths ?? localMapCache.fogOfWarPaths;
            const nextFogErase = mapData.fogErasePaths ?? localMapCache.fogErasePaths;
            const nextDraw = mapData.drawingPaths ?? localMapCache.drawingPaths;
            const nextLayers = mapData.drawingLayers ?? localMapCache.drawingLayers;
            const nextDnd = mapData.dndElements ?? localMapCache.dndElements;

            if (nextTerrain !== undefined && les.setTerrainData) les.setTerrainData(nextTerrain || {});
            if (nextWall !== undefined && les.setWallData) les.setWallData(nextWall || {});
            if (nextWindowOverlays !== undefined && les.setWindowOverlays) les.setWindowOverlays(nextWindowOverlays || {});
            if (nextFogPaths !== undefined && les.setFogOfWarPaths) les.setFogOfWarPaths(nextFogPaths ?? []);
            if (nextFogErase !== undefined && les.setFogErasePaths) les.setFogErasePaths(nextFogErase ?? []);
            if (nextDraw !== undefined && les.setDrawingPaths) les.setDrawingPaths(nextDraw || []);
            if (nextLayers !== undefined && les.setDrawingLayers) les.setDrawingLayers(nextLayers || []);
            if (nextDnd !== undefined && les.setDndElements) les.setDndElements(nextDnd || []);

            if (les.setFogOfWarData && mapData.fogOfWarData !== undefined)
              les.setFogOfWarData(mapData.fogOfWarData || {});

            useGameStore.setState({
              backgrounds: mapData.backgrounds || [],
              activeBackgroundId: mapData.activeBackgroundId || null,
              gridSize: mapData.gridSettings?.gridSize || 50,
              gridOffsetX: mapData.gridSettings?.gridOffsetX || 0,
              gridOffsetY: mapData.gridSettings?.gridOffsetY || 0,
              gridLineColor: mapData.gridSettings?.gridLineColor || '#000000',
              gridLineThickness: mapData.gridSettings?.gridLineThickness || 1
            });

            setTimeout(() => { window._isReceivingMapUpdate = false; }, 200);

            // Load tokens if payload present
            const tokensRaw = mapData.tokens;
            const characterTokensRaw = mapData.characterTokens;

            if (tokensRaw !== undefined) {
              const tokens = tokensRaw ? (Array.isArray(tokensRaw) ? tokensRaw : Object.values(tokensRaw)) : [];
              console.log('ðŸ‘¾ [forced_map_transfer] Loading tokens', { tokenCount: tokens.length });
              tokens.forEach(tokenData => {
                let creatureData = tokenData.creature;
                if (!creatureData && tokenData.creatureId)
                  creatureData = useCreatureStore.getState().creatures?.find(c => c.id === tokenData.creatureId);
                if (creatureData) addCreature(creatureData);
                const creatureRef = tokenData.creatureId || creatureData?.id;
                if (creatureRef && tokenData.position)
                  addToken(creatureRef, tokenData.position, false, tokenData.id, tokenData.state, data.mapId);
              });
            } else {
              console.warn('âš ï¸ [forced_map_transfer] No token payload - tokens already cleared');
            }

            if (characterTokensRaw !== undefined) {
              const charTokens = characterTokensRaw
                ? (Array.isArray(characterTokensRaw) ? characterTokensRaw : Object.values(characterTokensRaw))
                : [];
              console.log('ðŸ‘¤ [forced_map_transfer] Loading character tokens', { charTokenCount: charTokens.length });
              const { addCharacterTokenFromServer: addCharToken } = useCharacterTokenStore.getState();
              charTokens.forEach(tokenData => {
                if (tokenData && tokenData.position)
                  addCharToken(tokenData.id, tokenData.position, tokenData.playerId, data.mapId);
              });
            }
          });
        } else {
          // No mapData at all - tokens were already cleared above
          console.warn('âš ï¸ [forced_map_transfer] No mapData - requesting fresh state');
          if (socket?.connected) {
            socket.emit('gm_request_fresh_positions', {
              roomId: useGameStore.getState().multiplayerRoom?.id,
              mapId: data.mapId
            });
          }
          // Still clear memories even without map data
          import('../../../store/levelEditorStore').then(({ default: useLevelEditorStore }) => {
            const les = useLevelEditorStore.getState();
            if (les.clearAllFogAndMemories) {
              les.clearAllFogAndMemories();
            }
          });
        }

        // If the GM just transferred themselves, fetch fresh positions just like gm_view_changed
        const gameStoreCurrent = useGameStore.getState();
        if (gameStoreCurrent.isGMMode && socket?.connected) {
          socket.emit('gm_request_fresh_positions', {
            roomId: gameStoreCurrent.multiplayerRoom?.id,
            mapId: data.mapId
          });
          console.log(`ðŸ“¡ [forced_map_transfer] Requested fresh character positions for map ${data.mapId}`);
        }

        window._isMapSwitching = false;
        console.log('ðŸ”“ [forced_map_transfer] Set window._isMapSwitching = false');
        console.log(`âœ… [forced_map_transfer] Transfer complete to map: ${data.mapId} (${data.mapName || 'unnamed'})`);
      }, mapSwapDelay);
    });

    socket.on('gm_view_changed', (data) => {
      console.log('[GM VIEW CHANGED] Received event:', {
        gmId: data.gmId,
        gmName: data.gmName,
        newMapId: data.newMapId,
        mapName: data.mapName,
        hasMapName: !!data.mapName,
        myId: currentPlayerRef.current?.id
      });

      // CRITICAL: Block outgoing updates during map switch
      window._isMapSwitching = true;

      // CRITICAL FIX: Only process if this is the GM who initiated the view change
      // Other players should NOT change their view when GM switches
      const amITheGM = currentPlayerRef.current?.id === data.gmId;
      if (!amITheGM) {
        console.log('[GM VIEW CHANGED] Not the GM who switched - ignoring view change event');
        window._isMapSwitching = false;
        return;
      }

      console.log('[GM VIEW CHANGED] Processing view change for GM:', data.gmName);

      // Show transition overlay only for GM
      const shouldShowTransition = !isInitialMapLoadRef.current && showMapTransitions;
      if (shouldShowTransition) {
        // CRITICAL FIX: Look up map name from local store if server provided a fallback string
        const localMap = useMapStore.getState().maps?.find(m => m.id === data.newMapId);
        let mapName = data.mapName || localMap?.name || 'Unknown Realm';

        if (localMap?.name && (mapName.startsWith('Map ') || mapName === data.newMapId)) {
          mapName = localMap.name;
        }

        console.log('[GM VIEW CHANGED] Showing transition with map name:', mapName);

        setMapTransition({
          isActive: true,
          mapName: mapName,
          transferredByGM: false
        });
      }

      const gmMapSwapDelay = shouldShowTransition ? TRANSITION_TIMINGS.SAFE_SWAP_MS : 0;

      // Mark that initial load is complete after first view change
      isInitialMapLoadRef.current = false;
      const processGmViewChange = () => {
        // Update local map ID for GM (for filtering incoming updates)
        setPlayerCurrentMapId(data.newMapId);


        // Capture previous map before switching so later cleanup/remap logic can use it safely
        const previousMapId = useMapStore.getState().currentMapId;

        // CRITICAL FIX: Synchronously update mapStore.currentMapId so terrain updates use correct targetMapId
        // useMapStore is already imported at the top of the file - use it directly, not async import
        const mapStoreState = useMapStore.getState();
        // Check if map exists in local store
        const existingMap = mapStoreState.maps?.find(m => m.id === data.newMapId);

        // Determine best name for mapStore
        const resolvedMapName = data.mapName || data.mapData?.name || (existingMap?.name && !existingMap.name.startsWith('Map ') ? existingMap.name : `Map ${data.newMapId}`);

        if (!existingMap) {
          console.log('[GM VIEW CHANGED] Creating map in local store:', data.newMapId, resolvedMapName);
          // Create a map in local store
          mapStoreState.createMapWithoutSwitching({
            id: data.newMapId,
            name: resolvedMapName
          });
        } else if (resolvedMapName && (!existingMap.name || existingMap.name.startsWith('Map ')) && !resolvedMapName.startsWith('Map ')) {
          // Update existing map name if it was a fallback
          mapStoreState.updateMap(data.newMapId, { name: resolvedMapName });
        }

        // SYNCHRONOUS update to ensure terrain updates use correct mapId immediately
        useMapStore.setState({ currentMapId: data.newMapId });

        // CRITICAL FIX: Update GM's assignment in partyStore so their tag moves in Map Library
        // FIXED: Changed data.mapId (doesn't exist) to data.newMapId
        if (currentPlayerRef.current?.id) {
          console.log('[GM VIEW CHANGED] Updating GM assignment:', currentPlayerRef.current.id, '->', data.newMapId);
          usePartyStore.getState().setPlayerMapAssignment(currentPlayerRef.current.id, data.newMapId);
        }


        // CRITICAL: Clear batcher to prevent pending updates from old map bleeding to new map
        // Wrap ALL operations in a single chain to prevent race conditions
        import('../../../store/levelEditorStore').then(({ mapUpdateBatcher }) => {
          if (mapUpdateBatcher) {
            mapUpdateBatcher.clear();
            console.log('ðŸ§¹ [gm_view_changed] Batcher cleared to prevent data bleeding');
          }
        }).then(() => {
          // Step 1: Apply new map data to level editor store
          return import('../../../store/levelEditorStore');
        }).then(({ default: useLevelEditorStore }) => {
          const levelEditorStore = useLevelEditorStore.getState();
          const mapData = data.mapData || {};
          const localMapCache = useMapStore.getState().maps?.find(m => m.id === data.newMapId) || {};

          window._isReceivingMapUpdate = true;

          // CRITICAL FIX: Avoid destructive clears when gm_view_changed payload is partial.
          // Prefer incoming payload, then local map cache; preserve current state if both missing.
          const nextTerrainData = mapData.terrainData ?? localMapCache.terrainData;
          const nextWallData = mapData.wallData ?? localMapCache.wallData;
          const nextWindowOverlays = mapData.windowOverlays ?? localMapCache.windowOverlays;
          const nextDrawingPaths = mapData.drawingPaths ?? localMapCache.drawingPaths;
          const nextDrawingLayers = mapData.drawingLayers ?? localMapCache.drawingLayers;
          const nextFogOfWarPaths = mapData.fogOfWarPaths ?? localMapCache.fogOfWarPaths;
          const nextFogErasePaths = mapData.fogErasePaths ?? localMapCache.fogErasePaths;
          const nextDndElements = mapData.dndElements ?? localMapCache.dndElements;

          if (nextTerrainData !== undefined) levelEditorStore.setTerrainData(nextTerrainData || {});
          else console.warn('âš ï¸ [gm_view_changed] Missing terrain payload and cache - preserving current terrain to avoid wipe');

          if (nextWallData !== undefined) levelEditorStore.setWallData(nextWallData || {});
          // Restore window/door overlays
          if (nextWindowOverlays !== undefined && levelEditorStore.setWindowOverlays) {
            levelEditorStore.setWindowOverlays(nextWindowOverlays || {});
          }
          if (nextDrawingPaths !== undefined) levelEditorStore.setDrawingPaths(nextDrawingPaths || []);
          if (nextDrawingLayers !== undefined) levelEditorStore.setDrawingLayers(nextDrawingLayers || []);
          if (nextFogOfWarPaths !== undefined) levelEditorStore.setFogOfWarPaths(nextFogOfWarPaths ?? []);
          if (nextFogErasePaths !== undefined) levelEditorStore.setFogErasePaths(nextFogErasePaths ?? []);
          if (nextDndElements !== undefined) levelEditorStore.setDndElements(nextDndElements || []);

          setTimeout(() => {
            window._isReceivingMapUpdate = false;
            window._isMapSwitching = false;
          }, 300);

          return { mapData, localMapCache };
        }).then(({ mapData, localMapCache }) => {
          // Step 2: Apply game store backgrounds and grid settings
          useGameStore.setState({
            backgrounds: mapData.backgrounds ?? localMapCache.backgrounds ?? [],
            activeBackgroundId: mapData.activeBackgroundId ?? localMapCache.activeBackgroundId ?? null,
            gridSize: mapData.gridSettings?.gridSize ?? localMapCache.gridSettings?.gridSize ?? 50,
            gridOffsetX: mapData.gridSettings?.gridOffsetX ?? localMapCache.gridSettings?.gridOffsetX ?? 0,
            gridOffsetY: mapData.gridSettings?.gridOffsetY ?? localMapCache.gridSettings?.gridOffsetY ?? 0,
            gridLineColor: mapData.gridSettings?.gridLineColor ?? localMapCache.gridSettings?.gridLineColor ?? '#000000',
            gridLineThickness: mapData.gridSettings?.gridLineThickness ?? localMapCache.gridSettings?.gridLineThickness ?? 1
          });
        }).then(() => {
          // Step 3: Reload token/item payloads.
          // Guard against partial gm_view_changed payloads that omit token collections,
          // which would otherwise clear stores and cause visible token loss for the GM.
          const mapData = data.mapData || {};

          const mapStoreMap = useMapStore.getState().maps?.find(m => m.id === data.newMapId) || null;

          const serverTokensRaw = mapData.tokens;
          const serverCharacterTokensRaw = mapData.characterTokens;
          const serverGridItemsRaw = mapData.gridItems;

          const fallbackTokensRaw = mapStoreMap?.tokens;
          const fallbackCharacterTokensRaw = mapStoreMap?.characterTokens;
          const fallbackGridItemsRaw = mapStoreMap?.gridItems;

          const tokensRaw = serverTokensRaw !== undefined ? serverTokensRaw : fallbackTokensRaw;
          const characterTokensRaw = serverCharacterTokensRaw !== undefined ? serverCharacterTokensRaw : fallbackCharacterTokensRaw;
          const gridItemsRaw = serverGridItemsRaw !== undefined ? serverGridItemsRaw : fallbackGridItemsRaw;

          const hasTokenPayload = tokensRaw !== undefined || characterTokensRaw !== undefined;
          const hasGridItemsPayload = gridItemsRaw !== undefined;

          if (!hasTokenPayload) {
            console.warn('âš ï¸ [gm_view_changed] Missing token payload - skipping destructive token clear to prevent accidental wipe');
          } else {
            clearCreatureTokens();
            clearCharacterTokens();
          }

          if (!hasGridItemsPayload) {
            console.warn('âš ï¸ [gm_view_changed] Missing gridItems payload - skipping destructive grid item clear to prevent accidental wipe');
          }

          // Load tokens for the new map
          const tokens = tokensRaw ? (Array.isArray(tokensRaw) ? tokensRaw : Object.values(tokensRaw)) : [];
          tokens.forEach(tokenData => {
            // CRITICAL FIX: Robust creature data resolution
            let creatureData = tokenData.creature;
            if (!creatureData && tokenData.creatureId) {
              creatureData = useCreatureStore.getState().creatures?.find(c => c.id === tokenData.creatureId);
            }
            if (creatureData) {
              addCreature(creatureData);
            }

            const creatureRef = tokenData.creatureId || creatureData?.id || tokenData.creature;
            if (creatureRef && tokenData.position) {
              addToken(
                creatureRef,
                tokenData.position,
                false,
                tokenData.id || tokenData.tokenId,
                tokenData.state,
                data.newMapId || tokenData.mapId || 'default'
              );
            }
          });

          // Load character tokens for the new map
          const characterTokens = characterTokensRaw ? (Array.isArray(characterTokensRaw) ? characterTokensRaw : Object.values(characterTokensRaw)) : [];
          console.log('â™Ÿï¸ [gm_view_changed] Received characterTokens:', characterTokens.length, characterTokens);
          characterTokens.forEach(tokenData => {
            if (tokenData && tokenData.position) {
              console.log('â™Ÿï¸ [gm_view_changed] Adding character token:', tokenData.id, tokenData.playerId, tokenData.position);
              addCharacterTokenFromServer(tokenData.id || tokenData.tokenId, tokenData.position, tokenData.playerId, data.newMapId);
            }
          });


          return {
            mapData,
            gridItemsRaw,
            previousMapId
          };
        })
          .then(({ mapData, gridItemsRaw, previousMapId }) => {
            // Step 4: Load grid items for this map
            return import('../../../store/gridItemStore').then(({ default: useGridItemStore }) => {
              const currentGridItems = useGridItemStore.getState().gridItems || [];
              const mapGridItems = gridItemsRaw ? (Array.isArray(gridItemsRaw) ? gridItemsRaw : Object.values(gridItemsRaw)) : [];
              const oldMapId = previousMapId;

              // CRITICAL FIX: Always replace target map's items with payload (deduped),
              // and keep non-target maps intact.
              const nonTargetItems = currentGridItems.filter(item => (item?.mapId || 'default') !== data.newMapId);

              const normalizedTargetItems = mapGridItems
                .filter(item => (item?.mapId || data.newMapId || 'default') === data.newMapId)
                .map(item => ({ ...item, mapId: item?.mapId || data.newMapId || 'default' }));

              const dedupedTargetItems = Array.from(
                new Map(normalizedTargetItems.map(item => [item.id, item])).values()
              );

              const updatedGridItems = [...nonTargetItems, ...dedupedTargetItems];
              useGridItemStore.setState({ gridItems: updatedGridItems });

              console.log(`âœ… Map switch complete: ${data.mapName} (${data.newMapId})`, {
                gridItemsLoaded: updatedGridItems.length,
                terrainDataPoints: Object.keys(mapData?.terrainData || {}).length
              });

              // Bug 3 fix: After loading cached token data, request a FRESH positions snapshot
              // from the server. Players may have moved while GM was on another map, so
              // server state is authoritative.
              const gameStoreCurrent = useGameStore.getState();
              if (gameStoreCurrent.isGMMode && socket?.connected) {
                socket.emit('gm_request_fresh_positions', {
                  roomId: gameStoreCurrent.multiplayerRoom?.id,
                  mapId: data.newMapId
                });
                console.log(`ðŸ“¡ [gm_view_changed] Requested fresh character positions for map ${data.newMapId}`);
              }
            });
          }).catch(error => {
            console.error('âŒ Error during map switch:', error);
          });
      };

      if (gmMapSwapDelay > 0) {
        console.log(`â±ï¸ [GM VIEW CHANGED] Deferring heavy map swap work by ${gmMapSwapDelay}ms to avoid pre-reveal/flicker`);
        setTimeout(processGmViewChange, gmMapSwapDelay);
      } else {
        processGmViewChange();
      }

    });

    socket.on('player_location_updated', (data) => {
      console.log('[PLAYER LOCATION UPDATED] Player moved:', data.playerName, '->', data.newMapId);

      // Update the playerMapAssignments in partyStore
      usePartyStore.getState().setPlayerMapAssignment(data.playerId, data.newMapId);

      // Show notification if it wasn't us
      if (data.playerId !== currentPlayerRef.current?.id) {
        addNotificationRef.current('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: data.transferredByGM
            ? `${data.playerName} was transported to ${data.newMapId}`
            : `${data.playerName} traveled to ${data.newMapId}`,
          type: 'system',
          timestamp: new Date().toISOString()
        });
      }
    });

    socket.on('gm_location_changed', (data) => {
      console.log('[GM LOCATION CHANGED] GM now viewing map:', {
        gmId: data.gmId,
        gmName: data.gmName,
        newMapId: data.newMapId,
        mapName: data.mapName,
        myId: currentPlayerRef.current?.id
      });

      // Update GM's assignment in partyStore so their tag moves in Map Library
      usePartyStore.getState().setPlayerMapAssignment(data.gmId, data.newMapId);
    });

    socket.on('fresh_positions_received', (data) => {
      console.log('ðŸ“¡ [fresh_positions_received] Hydrating authoritative GM token positions:', data.mapId);

      const { tokens, characterTokens } = data;

      if (characterTokens) {
        const charStore = require('../../../store/characterTokenStore').default.getState();
        Object.values(characterTokens).forEach(tk => {
          if (tk && tk.position) {
            charStore.addCharacterTokenFromServer(tk.id || tk.tokenId, tk.position, tk.playerId, data.mapId);
          }
        });
      }

      if (tokens) {
        const ctStore = useCreatureStore.getState();
        Object.values(tokens).forEach(tk => {
          if (tk && tk.position && (tk.creatureId || tk.id)) {
            ctStore.updateTokenPosition(tk.creatureId || tk.id, tk.position.x, tk.position.y);
          }
        });
      }
    });

    socket.on('player_map_changed', (data) => {
      console.log('ðŸ—ºï¸ Player map changed:', data);

      // CRITICAL: Block outgoing updates during map switch
      window._isMapSwitching = true;

      // CRITICAL FIX: Only process view switch if this is for US
      // Other players should NOT change their view when someone else is transferred
      const isForMe = data.playerId === currentPlayerRef.current?.id;

      if (!isForMe) {
        console.log(`[Map] ${data.playerName} was transferred to ${data.newMapId} - updating assignment but not switching view`);
        // We still want to update the assignment in partyStore so the tags move
        if (data.playerId) {
          usePartyStore.getState().setPlayerMapAssignment(data.playerId, data.newMapId);
        }
        window._isMapSwitching = false;
        return;
      }

      console.log(`[Map] WE are being transferred to ${data.newMapId} (${data.newMapName || 'Unknown'})`);

      // Show transition overlay - but skip on first entry to the room UNLESS it's a connection/portal transfer
      const hasPortalMetadata = !!(
        data.portalUsed && (
          data.portalUsed.transferType === 'connection' ||
          data.portalUsed.sourceConnectionId ||
          data.portalUsed.destinationConnectionId ||
          data.portalUsed.sourceMapId ||
          data.portalUsed.destinationMapId
        )
      );

      // Defensive fallback for legacy payloads that may omit portalUsed
      const inferredConnectionTransfer = !!(
        !data.transferredByGM &&
        data.newMapId &&
        data.centerPosition &&
        Number.isFinite(data.centerPosition.x) &&
        Number.isFinite(data.centerPosition.y)
      );

      const isPortalTransfer = hasPortalMetadata || inferredConnectionTransfer;
      const shouldShowTransition = showMapTransitions && (!isInitialMapLoadRef.current || isPortalTransfer);

      if (shouldShowTransition) {
        // CRITICAL FIX: Look up map name from local store if not provided by server
        // OR if server provided a fallback string like "Map [ID]"
        const localMap = useMapStore.getState().maps?.find(m => m.id === data.newMapId);
        let mapName = data.newMapName || localMap?.name || 'Unknown Location';

        if (localMap?.name && (mapName.startsWith('Map ') || mapName === data.newMapId)) {
          mapName = localMap.name;
        }

        // If it's a portal transfer, we can use the portal names for a cooler transition
        if (isPortalTransfer && data.portalUsed.portalName) {
          console.log(`ðŸŒ€ [MapTransition] Portal used: ${data.portalUsed.portalName}`);
          // Optional: we could include "via [Portal Name]" in the transition
        }

        setMapTransition({
          isActive: true,
          mapName: mapName,
          transferredByGM: data.transferredByGM || false
        });
      }

      // After first map event, subsequent ones should always show transition
      isInitialMapLoadRef.current = false;


      // CRITICAL FIX: Update local map ID for filtering AND mapStore.currentMapId for terrain updates
      setPlayerCurrentMapId(data.newMapId);

      // IMMEDIATE CAMERA LOCK: Establish authority immediately (before the defer delay) 
      // to prevent other systems (like Grid.jsx auto-token-centering) from overriding 
      // the camera during the loading/transition period.
      if (
        data.centerPosition &&
        Number.isFinite(data.centerPosition.x) &&
        Number.isFinite(data.centerPosition.y)
      ) {
        const gameStore = useGameStore.getState();
        if (typeof gameStore.markTransferCameraAuthoritative === 'function') {
          gameStore.markTransferCameraAuthoritative(
            { x: data.centerPosition.x, y: data.centerPosition.y },
            2500, // 2.5s lock to cover transition
            'multiplayer-player_map_changed-immediate'
          );
          console.log('ðŸŽ¯ [player_map_changed] Initial authoritative camera lock established', {
            pos: data.centerPosition,
            mapId: data.newMapId
          });
        }

        // Apply position immediately as well
        if (gameStore.setCameraPosition) {
          gameStore.setCameraPosition(data.centerPosition.x, data.centerPosition.y);
        }
      }

      // CRITICAL FIX: Defer heavy synchronization work until transition fade-in has covered viewport.
      const mapSwapDelay = shouldShowTransition ? TRANSITION_TIMINGS.SAFE_SWAP_MS : 0;
      console.log(`â±ï¸ Deferring map data loading for ${data.newMapId} by ${mapSwapDelay}ms to avoid pre-reveal/flicker...`);
      setTimeout(() => {
        // CRITICAL FIX: Synchronously update mapStore.currentMapId so terrain updates use correct targetMapId
        // This is the KEY fix for terrain appearing on wrong map
        useMapStore.setState({ currentMapId: data.newMapId });
        console.log(`âœ… [player_map_changed] Updated mapStore.currentMapId to: ${data.newMapId}`);

        // CRITICAL FIX: Add the map to mapStore.maps if it doesn't exist
        // This ensures the status indicator can find the map name
        const mapStore = useMapStore.getState();
        const existingMap = (mapStore.maps || []).find(m => m.id === data.newMapId);

        // Determine best name for mapStore
        const resolvedMapName = data.newMapName || data.mapData?.name || (existingMap?.name && !existingMap.name.startsWith('Map ') ? existingMap.name : `Map ${data.newMapId}`);

        if (!existingMap && data.newMapId) {
          const newMapEntry = {
            id: data.newMapId,
            name: resolvedMapName,
            // Include basic map data so it's available
            terrainData: data.mapData?.terrainData || {},
            wallData: data.mapData?.wallData || {},
            windowOverlays: data.mapData?.windowOverlays || {},
            drawingPaths: data.mapData?.drawingPaths || [],
            drawingLayers: data.mapData?.drawingLayers || [],
            fogOfWarPaths: data.mapData?.fogOfWarPaths || [],
            fogErasePaths: data.mapData?.fogErasePaths || [],
            dndElements: data.mapData?.dndElements || [],
            backgrounds: data.mapData?.backgrounds || [],
            activeBackgroundId: data.mapData?.activeBackgroundId || null,
            gridSettings: data.mapData?.gridSettings || {}
          };
          useMapStore.setState({
            maps: [...(mapStore.maps || []), newMapEntry]
          });
          console.log(`âœ… [player_map_changed] Added map "${newMapEntry.name}" to mapStore.maps`);
        } else if (existingMap && resolvedMapName && (!existingMap.name || existingMap.name.startsWith('Map ')) && !resolvedMapName.startsWith('Map ')) {
          // Update existing map name if it was a fallback
          useMapStore.getState().updateMap(data.newMapId, { name: resolvedMapName });
        }

        // CRITICAL FIX: Clear fog, memories, and exploration data on map change
        // These are per-map and must not bleed into the new map
        import('../../../store/levelEditorStore').then(({ default: useLevelEditorStore, mapUpdateBatcher }) => {
          if (mapUpdateBatcher) {
            mapUpdateBatcher.clear();
            console.log('ðŸ§¹ [player_map_changed] Batcher cleared');
          }
          const les = useLevelEditorStore.getState();
          if (les.clearAllFogAndMemories) {
            les.clearAllFogAndMemories();
          }
          console.log('ðŸ§¹ [player_map_changed] Cleared player memories and exploration data for new map');
        });

        // Apply the new map data to level editor store
        window._isReceivingMapUpdate = true;

        import('../../../store/levelEditorStore').then(({ default: useLevelEditorStore }) => {
          const levelEditorStore = useLevelEditorStore.getState();
          const mapData = data.mapData || {};
          const localMap = useMapStore.getState().maps?.find(m => m.id === data.newMapId) || {};

          // CRITICAL FIX: Avoid destructive clears when payload is partial.
          // Prefer incoming payload, then local map cache; only skip if both missing.
          const nextTerrainData = mapData.terrainData ?? localMap.terrainData;
          const nextWallData = mapData.wallData ?? localMap.wallData;
          const nextWindowOverlays = mapData.windowOverlays ?? localMap.windowOverlays;
          const nextDrawingPaths = mapData.drawingPaths ?? localMap.drawingPaths;
          const nextDrawingLayers = mapData.drawingLayers ?? localMap.drawingLayers;
          const nextFogOfWarPaths = mapData.fogOfWarPaths ?? localMap.fogOfWarPaths;
          const nextFogErasePaths = mapData.fogErasePaths ?? localMap.fogErasePaths;
          const nextDndElements = mapData.dndElements ?? localMap.dndElements;

          if (nextTerrainData !== undefined) levelEditorStore.setTerrainData(nextTerrainData || {});
          else console.warn('âš ï¸ [player_map_changed] Missing terrain payload and cache - preserving current terrain to avoid wipe');

          if (nextWallData !== undefined) levelEditorStore.setWallData(nextWallData || {});
          // Restore window/door overlays
          if (nextWindowOverlays !== undefined && levelEditorStore.setWindowOverlays) {
            levelEditorStore.setWindowOverlays(nextWindowOverlays || {});
          }
          if (nextDrawingPaths !== undefined) levelEditorStore.setDrawingPaths(nextDrawingPaths || []);
          if (nextDrawingLayers !== undefined) levelEditorStore.setDrawingLayers(nextDrawingLayers || []);
          if (nextFogOfWarPaths !== undefined) levelEditorStore.setFogOfWarPaths(nextFogOfWarPaths ?? []);
          if (nextFogErasePaths !== undefined) levelEditorStore.setFogErasePaths(nextFogErasePaths ?? []);
          if (nextDndElements !== undefined) levelEditorStore.setDndElements(nextDndElements || []);

          // CRITICAL FIX: Synchronize backgrounds and grid settings
          // This ensures the visuals match the new map
          useGameStore.setState({
            backgrounds: mapData.backgrounds || [],
            activeBackgroundId: mapData.activeBackgroundId || null,
            gridSize: mapData.gridSettings?.gridSize || 50,
            gridOffsetX: mapData.gridSettings?.gridOffsetX || 0,
            gridOffsetY: mapData.gridSettings?.gridOffsetY || 0,
            gridLineColor: mapData.gridSettings?.gridLineColor || '#000000',
            gridLineThickness: mapData.gridSettings?.gridLineThickness || 1
          });

          setTimeout(() => {
            window._isReceivingMapUpdate = false;
            window._isMapSwitching = false;
          }, 300);
        });

        // Clear tokens/items only when we actually have payload (or cache fallback).
        // This prevents accidental wipes for permanent rooms on partial payloads.
        const mapStoreMap = useMapStore.getState().maps?.find(m => m.id === data.newMapId) || null;
        const tokensRaw = data.mapData?.tokens !== undefined ? data.mapData?.tokens : mapStoreMap?.tokens;
        const characterTokensRaw = data.mapData?.characterTokens !== undefined ? data.mapData?.characterTokens : mapStoreMap?.characterTokens;
        const gridItemsRaw = data.mapData?.gridItems !== undefined ? data.mapData?.gridItems : mapStoreMap?.gridItems;

        const hasTokenPayload = tokensRaw !== undefined || characterTokensRaw !== undefined;
        const hasGridItemsPayload = gridItemsRaw !== undefined;

        if (!hasTokenPayload) {
          console.warn('âš ï¸ [player_map_changed] Missing token payload - skipping destructive token clear to preserve existing tokens');
        } else {
          clearCreatureTokens();
          clearCharacterTokens();
        }

        // Add tokens from the new map
        const tokens = tokensRaw ? (Array.isArray(tokensRaw) ? tokensRaw : Object.values(tokensRaw)) : [];
        if (tokens.length > 0) {
          tokens.forEach(tokenData => {
            // CRITICAL FIX: Robust creature data resolution
            let creatureData = tokenData.creature;

            if (!creatureData && tokenData.creatureId) {
              // Check library if server didn't provide it
              creatureData = useCreatureStore.getState().creatures?.find(c => c.id === tokenData.creatureId);
              if (creatureData) {
                console.log(`âœ… [player_map_changed] Found missing creature data in local library for ${tokenData.creatureId}`);
              }
            }

            if (creatureData) {
              addCreature(creatureData);
            } else if (tokenData.creatureId) {
              console.warn(`âš ï¸ Token ${tokenData.id} missing creature data!`, tokenData);
              // Even if data is missing, still try to add the token using creatureId
            }

            const creatureRef = tokenData.creatureId || creatureData?.id || tokenData.creature;
            if (creatureRef && tokenData.position) {
              // Load quietly and preserve ID/state; force target map for strict map isolation
              addToken(
                creatureRef,
                tokenData.position,
                false,
                tokenData.id || tokenData.tokenId,
                tokenData.state,
                data.newMapId || tokenData.mapId || 'default'
              );
            }
          });
        }

        // Load character tokens for the new map
        const characterTokens = characterTokensRaw
          ? (Array.isArray(characterTokensRaw) ? characterTokensRaw : Object.values(characterTokensRaw))
          : [];

        if (characterTokens.length > 0) {
          const { addCharacterTokenFromServer: addCharToken } = useCharacterTokenStore.getState();
          characterTokens.forEach(tokenData => {
            if (tokenData && tokenData.position) {
              // CRITICAL: Pass mapId for proper map isolation
              addCharToken(tokenData.id || tokenData.tokenId, tokenData.position, tokenData.playerId, data.newMapId);
            }
          });
        }


        // CRITICAL FIX: Load grid items for this map - keep items from all maps but filter by current mapId
        import('../../../store/gridItemStore').then(({ default: useGridItemStore }) => {
          const currentGridItems = useGridItemStore.getState().gridItems || [];
          // Server may send array or object, and payload can be omitted during partial sync.
          const mapGridItems = gridItemsRaw
            ? (Array.isArray(gridItemsRaw) ? gridItemsRaw : Object.values(gridItemsRaw))
            : null;

          if (!hasGridItemsPayload) {
            console.warn('âš ï¸ [player_map_changed] Missing gridItems payload - preserving existing grid items for target map');
            return;
          }

          // Debug: Log item loading
          console.log(`ðŸ“¦ [player_map_changed] Loading items:`, {
            oldMapId: data.oldMapId,
            newMapId: data.newMapId,
            mapGridItemsCount: mapGridItems?.length || 0,
            mapGridItems: (mapGridItems || []).map(i => ({ id: i.id, name: i.name, mapId: i.mapId })),
            currentGridItemsBeforeFilter: currentGridItems.map(i => ({ id: i.id, name: i.name, mapId: i.mapId }))
          });

          // CRITICAL FIX: Replace target-map items atomically to avoid map bleed/duplication.
          const nonTargetItems = currentGridItems.filter(item => (item?.mapId || 'default') !== data.newMapId);
          const normalizedTargetItems = (mapGridItems || [])
            .filter(item => (item?.mapId || data.newMapId || 'default') === data.newMapId)
            .map(item => ({ ...item, mapId: item?.mapId || data.newMapId || 'default' }));
          const dedupedTargetItems = Array.from(
            new Map(normalizedTargetItems.map(item => [item.id, item])).values()
          );

          const updatedGridItems = [...nonTargetItems, ...dedupedTargetItems];

          console.log(`ðŸ“¦ [player_map_changed] Final grid items:`, {
            totalItems: updatedGridItems.length,
            itemsForMapNew: updatedGridItems.filter(i => i.mapId === data.newMapId).map(i => ({ id: i.id, name: i.name, mapId: i.mapId })),
            itemsFromOldMap: data.oldMapId ? updatedGridItems.filter(i => i.mapId === data.oldMapId).map(i => ({ id: i.id, name: i.name, mapId: i.mapId })) : []
          });
          useGridItemStore.setState({ gridItems: updatedGridItems });
        });

        // Center camera on destination position if provided.
        // Apply immediately and again on next frame so this remains the final camera write
        // after map payload hydration and any late store updates.
        if (
          data.centerPosition &&
          Number.isFinite(data.centerPosition.x) &&
          Number.isFinite(data.centerPosition.y)
        ) {
          const gameStore = useGameStore.getState();
          if (typeof gameStore.markTransferCameraAuthoritative === 'function') {
            gameStore.markTransferCameraAuthoritative(
              { x: data.centerPosition.x, y: data.centerPosition.y },
              2500,
              'multiplayer-player_map_changed-initial'
            );
          }
          if (gameStore.setCameraPosition) {
            gameStore.setCameraPosition(data.centerPosition.x, data.centerPosition.y);
            requestAnimationFrame(() => {
              const latestGameStore = useGameStore.getState();
              if (typeof latestGameStore.markTransferCameraAuthoritative === 'function') {
                latestGameStore.markTransferCameraAuthoritative(
                  { x: data.centerPosition.x, y: data.centerPosition.y },
                  2500,
                  'multiplayer-player_map_changed-raf'
                );
              }
              if (latestGameStore.setCameraPosition) {
                latestGameStore.setCameraPosition(data.centerPosition.x, data.centerPosition.y);
                console.log('ðŸŽ¯ [player_map_changed] Re-applied destination center as final camera write', {
                  mapId: data.newMapId,
                  centerPosition: data.centerPosition,
                  source: 'multiplayer-player_map_changed'
                });
              }
            });
          }
        }

        usePartyStore.getState().setPlayerMapAssignment(currentPlayerRef.current?.id, data.newMapId);
        console.log(`âœ… [player_map_changed] Player view switched to map: ${data.newMapName || data.newMapId}`);
      }, mapSwapDelay);
    });

  return () => {
    socket.off('gm_action');
    socket.off('forced_map_transfer');
    socket.off('gm_view_changed');
    socket.off('player_location_updated');
    socket.off('gm_location_changed');
    socket.off('fresh_positions_received');
    socket.off('player_map_changed');
  };
}
