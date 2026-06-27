import usePartyStore from '../../store/partyStore';
import usePresenceStore from '../../store/presenceStore';
import useAuthStore from '../../store/authStore';
import useCharacterStore from '../../store/characterStore';
import useGameStore from '../../store/gameStore';
import useLevelEditorStore from '../../store/levelEditorStore';
import useMapStore from '../../store/mapStore';
import useInventoryStore from '../../store/inventoryStore';
import useTravelStore from '../../store/travelStore';

export async function handleJoinRoom(room, socketConnection, isGameMaster, playerObject, password, levelEditorState, gridSettings, skipSetJoiningFalse, ctx) {
  const {
    socket, currentRoom, isGM, isJoiningRoom, isFadingOut, isRoomReady,
    joinStartTime, pendingRoomData, connectionStatus, currentPlayer,
    setIsConnecting, setConnectionQuality, setConnectionStatus, setIsJoiningRoom,
    setPendingRoomData, setIsRoomReady, setPendingGameSessionInvitations,
    setError, setActualPlayerCount, setConnectedPlayers, setIsGM,
    setLoadingStatusMessage, setPendingControlOffer, setPlayerCurrentMapId,
    setMapTransition, setCurrentPlayer, setCurrentRoom, setSocket,
    setLoadingProgress, setShowContinue, setJoinStartTime, setIsFadingOut,
    isJoiningRoomRef, currentRoomRef, currentPlayerRef, pendingRoomDataRef,
    activeJoinIdRef, autoJoinAttemptedRef, isAutoJoinSequenceRef,
    isGMRef, addNotificationRef, addUserRef, removeUserRef,
    addPartyMemberRef, removePartyMemberRef, playerCurrentMapIdRef,
    isInitialMapLoadRef, joinStartTimeRef, roomPasswordRef,
    startJoiningRoom, getActiveCharacter, clearAllMultiplayerStores,
    navigate, showMapTransitions, showCursorTracking,
    clearCreatureTokens, clearCharacterTokens, updateCreatureTokenPosition,
    addCreature, addToken, removeToken, addPartyMember, removePartyMember,
    addUser, removeUser, updatePartyMember, addNotification,
    showPlayerJoinNotification, showPlayerLeaveNotification,
    showGMDisconnectedNotification, getGridSystem, playerCurrentMapId,
    loadActiveCharacter, startCharacterSession, setRoomName,
    updateCharacterInfo, tokenUpdateThrottleRef, cursorThrottleRef,
    updateBatchRef, batchTimeoutRef,
    THROTTLE_CLEANUP_INTERVAL, THROTTLE_ENTRY_LIFETIME,
    PLAYER_THROTTLE_MS, GM_THROTTLE_MS
  } = ctx;
    // Declare currentUserId at the top scope of handleJoinRoom to avoid ReferenceErrors in subsequent blocks
    let currentUserId = null;

    // Clear the enteringMultiplayer flag - we're now in the room
    sessionStorage.removeItem('enteringMultiplayer');

    // Clear all stores before joining a new room to ensure a clean slate.
    // For permanent room resume, preserve map entities until authoritative payload hydration completes.
    const isPersistentRoomResume = !!room?.persistentRoomId;
    clearAllMultiplayerStores({ preserveMapEntities: isPersistentRoomResume });

    // CRITICAL: Ensure party members are cleared BEFORE we start adding new room members
    // This prevents social party members from leaking into the room HUD
    usePartyStore.getState().replacePartyMembers([]);
    usePresenceStore.setState({
      currentParty: null,
      isInParty: false,
      partyMembers: []
    });

    startJoiningRoom();
    setConnectionStatus('connecting');

    // Show joining notification
    addNotificationRef.current('social', {
      sender: { name: 'System', class: 'system', level: 0 },
      content: `Joining room: ${room.name}...`,
      type: 'system',
      timestamp: new Date().toISOString()
    });

    // Track whether initial level editor state was applied from explicit parameter
    let initialLevelEditorApplied = !!(levelEditorState || gridSettings);

    // ===== APPLY INITIAL LEVEL EDITOR STATE FOR NON-GM PLAYERS =====
    // This ensures players joining a room see terrain, hex grid, walls, etc.
    if (!isGameMaster && (levelEditorState || gridSettings)) {
      window._isReceivingMapUpdate = true;
      try {
        // Apply level editor state
        if (levelEditorState) {
          useLevelEditorStore.getState().loadCompleteLevelEditorState(levelEditorState);

          // CRITICAL: Load grid items for initial sync
          if (levelEditorState.gridItems) {
            import('../../store/gridItemStore').then(({ default: useGridItemStore }) => {
              const gridItemStore = useGridItemStore.getState();
              Object.values(levelEditorState.gridItems).forEach(gridItem => {
                console.log('Ã°Å¸â€œÂ¦ Loading grid item from initial sync:', {
                  id: gridItem.id,
                  name: gridItem.name,
                  position: gridItem.position,
                  gridPosition: gridItem.gridPosition
                });
                gridItemStore.loadGridItem(gridItem);
              });
              console.log('Ã¢Å“â€¦ Loaded grid items from initial sync:', Object.keys(levelEditorState.gridItems).length);
            }).catch(error => {
              console.error('Failed to load grid items:', error);
            });
          }

          // CRITICAL: Load tokens for initial sync
          if (levelEditorState.tokens) {
            import('../../store/creatureStore').then(({ default: useCreatureStore }) => {
              const creatureStore = useCreatureStore.getState();
              Object.values(levelEditorState.tokens).forEach(tokenData => {
                creatureStore.loadToken(tokenData);
              });
              console.log('Ã¢Å“â€¦ Loaded tokens from initial sync:', Object.keys(levelEditorState.tokens).length);
            }).catch(error => {
              console.error('Failed to load tokens:', error);
            });
          }

          // CRITICAL: Load character tokens for initial sync
          if (levelEditorState.characterTokens) {
            import('../../store/creatureStore').then(({ default: useCreatureStore }) => {
              const creatureStore = useCreatureStore.getState();
              Object.values(levelEditorState.characterTokens).forEach(tokenData => {
                creatureStore.loadToken(tokenData);
              });
              console.log('Ã¢Å“â€¦ Loaded character tokens from initial sync:', Object.keys(levelEditorState.characterTokens).length);
            }).catch(error => {
              console.error('Failed to load character tokens:', error);
            });
          }

          console.log('Ã¢Å“â€¦ Initial level editor state applied');
        }

        // Apply grid settings
        if (gridSettings) {
          const gameStore = useGameStore.getState();

          if (gridSettings.gridType !== undefined) {
            gameStore.setGridType(gridSettings.gridType);
            console.log('Ã°Å¸â€Â· Initial grid type set to:', gridSettings.gridType);
          }
          if (gridSettings.gridSize !== undefined) {
            gameStore.setGridSize(gridSettings.gridSize);
          }
          if (gridSettings.gridOffsetX !== undefined && gridSettings.gridOffsetY !== undefined) {
            gameStore.setGridOffset(gridSettings.gridOffsetX, gridSettings.gridOffsetY);
          }
          if (gridSettings.gridLineColor !== undefined) {
            gameStore.setGridLineColor(gridSettings.gridLineColor);
          }
          if (gridSettings.gridLineThickness !== undefined) {
            gameStore.setGridLineThickness(gridSettings.gridLineThickness);
          }
          if (gridSettings.gridLineOpacity !== undefined) {
            gameStore.setGridLineOpacity(gridSettings.gridLineOpacity);
          }
          if (gridSettings.gridBackgroundColor !== undefined) {
            gameStore.setGridBackgroundColor(gridSettings.gridBackgroundColor);
          }

          console.log('Ã¢Å“â€¦ Initial grid settings applied');
        }
      } catch (error) {
        console.error('Ã¢ÂÅ’ Failed to apply initial level editor state:', error);
      } finally {
        window._isReceivingMapUpdate = false;
      }
    }

    let currentPlayerData;

    try {
      // Move setCurrentRoom to the end to keep the loading screen active during initialization
      // setCurrentRoom(room);
      setSocket(socketConnection);
      setIsGM(isGameMaster);
      roomPasswordRef.current = password || '';

      // Sync socket to presenceStore in handleJoinRoom
      try {
        import('../../store/presenceStore').then(({ default: usePresenceStore }) => {
          usePresenceStore.getState().setSocket(socketConnection);
        });
      } catch (e) {
        console.warn('Could not sync socket to presenceStore in handleJoinRoom:', e);
      }

      // Disable editor mode for test rooms (test rooms are not world builder mode)
      const isTestRoom = localStorage.getItem('isTestRoom') === 'true';
      if (isTestRoom) {
        localStorage.removeItem('isWorldBuilderMode');
        import('../../store/levelEditorStore').then(({ default: useLevelEditorStore }) => {
          const levelEditorStore = useLevelEditorStore.getState();
          if (levelEditorStore.isEditorMode) {
            levelEditorStore.setEditorMode(false);
          }
        });
      }

      // Set current player info - use explicit playerObject from server if available
      const activeCharacter = getActiveCharacter();

      // CRITICAL: Get userId from authStore for reliable player identification
      try {
        const { user } = useAuthStore.getState();
        currentUserId = user?.uid;
      } catch (e) {
        console.warn('Could not get userId from authStore:', e);
      }

      console.log('Ã°Å¸â€ â€ handleJoinRoom - Setting up current player:', {
        playerObject,
        playerObjectId: playerObject?.id,
        playerObjectName: playerObject?.name,
        activeCharacterName: activeCharacter?.name,
        isGameMaster,
        currentUserId
      });

      if (playerObject) {
        currentPlayerData = {
          ...playerObject,
          userId: currentUserId, // CRITICAL: Add Firebase UID for reliable identification
          name: activeCharacter?.name || playerObject.character?.name || playerObject.name,
          isGM: isGameMaster
        };
      } else if (isGameMaster) {
        // Fallback for GM if playerObject is somehow missing
        currentPlayerData = {
          ...room.gm,
          userId: currentUserId, // CRITICAL: Add Firebase UID
          name: activeCharacter?.name || room.gm?.character?.name || room.gm?.name || 'Game Master',
          isGM: true
        };
      } else {
        // Fallback for regular player - less reliable
        let playersList = [];
        if (Array.isArray(room.players)) {
          playersList = room.players;
        } else if (room.players instanceof Map) {
          playersList = Array.from(room.players.values());
        } else if (room.players && typeof room.players === 'object') {
          playersList = Object.values(room.players);
        }

        const lastPlayer = playersList.length > 0 ? playersList[playersList.length - 1] : { name: 'Player' };
        currentPlayerData = {
          ...lastPlayer,
          userId: currentUserId, // CRITICAL: Add Firebase UID
          name: activeCharacter?.name || lastPlayer.character?.name || lastPlayer.name,
          isGM: false
        };
      }

      setCurrentPlayer(currentPlayerData);
      window.currentPlayerId = currentPlayerData?.id;

      // CRITICAL: Set player ID in levelEditorStore for per-player memory system
      // This ensures each player has individual exploration memories
      try {
        const levelEditorStore = useLevelEditorStore.getState();
        const playerIdForMemories = currentUserId || socketConnection?.id || currentPlayerData?.id || 'local-player';
        if (playerIdForMemories && levelEditorStore.currentPlayerId !== playerIdForMemories) {
          levelEditorStore.setCurrentPlayerId(playerIdForMemories);
          console.log('Ã°Å¸â€ â€ Set current player ID for per-player memories:', playerIdForMemories);
        }
      } catch (e) {
        console.warn('Could not set player ID for per-player memories:', e);
      }

      // CRITICAL: Clear auto-join flags upon successful entry
      localStorage.removeItem('selectedRoomId');
      sessionStorage.removeItem('selectedRoomPassword');
      localStorage.removeItem('isTestRoom');


      // Set initial player count - use room.playerCount when available (already includes GM)
      // Fallback: calculate manually + 1 for GM
      let initialCount = 0;
      if (Array.isArray(room.players)) {
        initialCount = room.players.length;
      } else if (room.players instanceof Map) {
        initialCount = room.players.size;
      } else if (room.players && typeof room.players === 'object') {
        initialCount = Object.keys(room.players).length;
      }
      setActualPlayerCount(room.playerCount || (initialCount + 1));

      // Add player to Firebase room members for persistence (if authenticated)
      try {
        // Check if auth store is available (might not be in all environments)
        if (typeof useAuthStore !== 'undefined') {
          const { user } = useAuthStore.getState();
          if (user && room.persistentRoomId) {
            // For guest users, save joined room to localStorage instead of Firebase
            if (user.isGuest) {
              const guestRoomData = {
                id: room.persistentRoomId,
                name: room.name,
                description: room.description || '',
                password: room.password || '',
                createdAt: new Date().toISOString(),
                lastActivity: new Date().toISOString(),
                userRole: 'player',
                isMultiplayer: true
              };
              localStorage.setItem('mythrill-guest-joined-room', JSON.stringify(guestRoomData));
              localStorage.setItem('roomDataChanged', 'true');
              localStorage.setItem('lastJoinedRoom', room.persistentRoomId);
            } else {
              // Regular authenticated user - save to Firebase
              const { joinRoom } = await import('../../services/roomService');
              await joinRoom(room.persistentRoomId, user.uid, room.password || '');

              // Set a flag to indicate that room data should be refreshed when returning to account
              localStorage.setItem('roomDataChanged', 'true');
              localStorage.setItem('lastJoinedRoom', room.persistentRoomId);
            }
          }
        }
      } catch (error) {
        console.warn('Failed to add player to permanent room:', error);
        // Don't fail the room join if Firebase persistence fails
      }
    } catch (error) {
      console.error('Error in handleJoinRoom initialization:', error);
      setIsJoiningRoom(false);
      setConnectionStatus('error');
      setError(`Failed to initialize room connection: ${error.message || 'Unknown error'}`);
      return; // Exit early if there's an error
    }

    // Load active character data when joining multiplayer room
    try {
      let activeCharacter = getActiveCharacter();

      // Update currentPlayerData with character name if we have it
      if (activeCharacter && currentPlayerData) {
        currentPlayerData = {
          ...currentPlayerData,
          name: activeCharacter.name || currentPlayerData.name
        };
        setCurrentPlayer(currentPlayerData);
        window.currentPlayerId = currentPlayerData?.id;

      }

      // If no active character is loaded, try to load from storage
      if (!activeCharacter) {
        activeCharacter = await loadActiveCharacter();
      }

      // If still no active character, show a warning but ALLOW joining
      // Players can now join without an active character and set one up later
      const { user } = useAuthStore.getState();
      const isGuest = user?.isGuest || false;

      if (!activeCharacter && !isGuest && !isGameMaster) {
        // Show a warning but don't block joining
        const { characters } = useCharacterStore.getState();
        if (characters && characters.length > 0) {
          console.warn('Ã¢Å¡Â Ã¯Â¸Â No active character selected. Player can select one later.');
          addNotification('social', {
            sender: { name: 'System', class: 'system', level: 0 },
            content: `You joined without an active character. Go to Account > Characters to select one for the full experience.`,
            type: 'system',
            timestamp: new Date().toISOString()
          });
        } else {
          console.warn('Ã¢Å¡Â Ã¯Â¸Â No characters available. Player can create one later.');
          addNotification('social', {
            sender: { name: 'System', class: 'system', level: 0 },
            content: `You joined without a character. Go to Account > Characters to create one.`,
            type: 'system',
            timestamp: new Date().toISOString()
          });
        }
        // Continue joining - don't return/block
      }

      // Start character session for tracking changes during multiplayer
      try {
        if (activeCharacter && !isGuest) {
          await startCharacterSession(activeCharacter.id, room.id);
        }
      } catch (sessionError) {
        // Continue with multiplayer even if session tracking fails
      }

      // Set room name for multiplayer context (this will format the display name)
      setRoomName(room.name);

      // CRITICAL FIX: Ensure character is fully loaded before syncing inventory
      // Try to refresh from Firebase first to get the latest data including inventory
      let characterToUse = activeCharacter;

      if (activeCharacter) {
        try {
          // Try to refresh character from Firebase to get latest inventory
          const { loadCharacters } = useCharacterStore.getState();
          await loadCharacters(); // Refresh characters from Firebase

          // Get updated character from store after refresh
          const { characters } = useCharacterStore.getState();
          const refreshedCharacter = characters.find(c => c.id === activeCharacter.id);

          if (refreshedCharacter && refreshedCharacter.inventory) {
            characterToUse = refreshedCharacter;
          } else {
            // Fallback to store character
            const { loadCharacter } = useCharacterStore.getState();
            const storeCharacter = loadCharacter(activeCharacter.id);
            if (storeCharacter && storeCharacter.inventory) {
              characterToUse = storeCharacter;
            } else {
              console.warn('Ã¢Å¡Â Ã¯Â¸Â Character does not have inventory saved. This may be a new character or inventory was not saved during creation.');
              characterToUse = activeCharacter;
            }
          }
        } catch (error) {
          console.warn('Ã¢Å¡Â Ã¯Â¸Â Could not refresh character from Firebase, using store:', error);
          // Fallback to store character
          const { loadCharacter } = useCharacterStore.getState();
          const storeCharacter = loadCharacter(activeCharacter.id);
          if (storeCharacter && storeCharacter.inventory) {
            characterToUse = storeCharacter;
          }
        }
      }

      // Sync character inventory with inventory store
      // Sync character inventory with inventory store
      if (characterToUse) {
        try {
          import('../../store/inventoryStore').then(({ default: useInventoryStore }) => {
            const inventoryStore = useInventoryStore.getState();

            // Load character's inventory into the inventory store
            // Ensure inventory exists, default to empty if not present
            const characterInventory = characterToUse.inventory || {
              items: [],
              currency: { platinum: 0, gold: 0, silver: 0, copper: 0 },
              encumbranceState: 'normal'
            };

            // Clear current inventory
            inventoryStore.clearInventory();

            // Load character's items
            if (characterInventory.items && Array.isArray(characterInventory.items)) {
              characterInventory.items.forEach(item => {
                try {
                  inventoryStore.addItem(item);
                } catch (itemError) {
                  console.warn('Failed to add item to inventory:', itemError, item);
                }
              });
            } else {
              console.warn('Ã¢Å¡Â Ã¯Â¸Â Character inventory items is not an array:', characterInventory.items);
            }

            // Load character's currency
            if (characterInventory.currency) {
              inventoryStore.updateCurrency(characterInventory.currency);
            }
          });
        } catch (inventoryError) {
          console.warn('Failed to sync character inventory:', inventoryError);
        }
      }

      // Send character data to server for synchronization
      if (socketConnection && socketConnection.connected && activeCharacter) {
        // Get userId from auth store for Firebase persistence
        let userId = null;
        try {
          const authStore = require('../../store/authStore').default;
          const authState = authStore.getState();
          userId = authState.user?.uid || null;
        } catch (error) {
          console.warn('Could not get userId from auth store:', error);
        }

        socketConnection.emit('character_updated', {
          characterId: activeCharacter.id,
          userId: userId, // CRITICAL FIX: Include userId for Firebase character document saving
          character: {
            name: activeCharacter.name,
            class: activeCharacter.class,
            race: activeCharacter.race,
            subrace: activeCharacter.subrace,
            raceDisplayName: activeCharacter.raceDisplayName || '',
            background: activeCharacter.background || '',
            backgroundDisplayName: activeCharacter.backgroundDisplayName || '',
            path: activeCharacter.path || '',
            pathDisplayName: activeCharacter.pathDisplayName || '',
            level: activeCharacter.level,
            stats: activeCharacter.stats,
            health: activeCharacter.health,
            mana: activeCharacter.mana,
            actionPoints: activeCharacter.actionPoints,
            equipment: activeCharacter.equipment,
            inventory: activeCharacter.inventory || { items: [], currency: { platinum: 0, gold: 0, silver: 0, copper: 0 } },
            experience: activeCharacter.experience,
            exhaustionLevel: activeCharacter.exhaustionLevel,
            // Only include classResource if it has a valid max value
            ...(activeCharacter.classResource?.max ? { classResource: activeCharacter.classResource } : {}),
            tokenSettings: activeCharacter.tokenSettings, // Include token settings
            lore: activeCharacter.lore, // Include lore (which contains characterImage)
            playerId: currentPlayerData?.id || 'current-player'

          }
        });
      }
    } catch (error) {
      console.error('Error loading active character for multiplayer:', error);
      // Fall back to updating character name to match player name
      if (currentPlayerData?.name) {
        updateCharacterInfo('name', currentPlayerData.name);
      }
    }

    try {
      // Simple: Room creator = GM, others = players
      useGameStore.getState().setGMMode(isGameMaster);

      if (!isGameMaster && socketConnection) {
        console.log('Ã°Å¸â€”ÂºÃ¯Â¸Â [Travel] Initializing player travel listener');
        useTravelStore.getState().initPlayerTravelListener(socketConnection);
      }

      // ==========================================
      // CRITICAL FIX: MAP ISOLATION & INITIAL LOAD
      // ==========================================

      // 0. Populate Creature Library from Global Legacy Tokens
      // The server doesn't maintain a separate creature library, but it tracks specific tokens globally.
      // We must extract creature data from these tokens to ensure the local library is populated.
      // This safeguards against cases where map-specific token payloads miss embedded creature data.
      if (room.gameState && room.gameState.tokens) {
        let creatureCount = 0;
        Object.values(room.gameState.tokens).forEach(tokenData => {
          if (tokenData.creature) {
            // Add creature to store (store handles deduplication)
            addCreature(tokenData.creature);
            creatureCount++;
          }
        });
        console.log(`Ã°Å¸â€œÅ¡ Populated creature library with ${creatureCount} creatures from legacy tokens`);
      }

      // 1. Initialize Map Store with all maps (essential for GM Map Library)
      if (room.gameState.maps) {
        import('../../store/mapStore').then(({ default: useMapStore }) => {
          const mapStoreState = useMapStore.getState();
          // Reset store first to clear old maps
          if (mapStoreState.resetStore) mapStoreState.resetStore();

          Object.values(room.gameState.maps).forEach(mapData => {
            // Create map in store
            mapStoreState.createMapWithoutSwitching({
              id: mapData.id,
              name: mapData.name || mapData.id
            });

            // If this is the GM, load thumbnail if available
            if (isGameMaster && mapData.thumbnailUrl) {
              // Logic to set thumbnail would go here
            }
          });
          console.log('Ã°Å¸â€”ÂºÃ¯Â¸Â MapStore initialized with maps:', Object.keys(room.gameState.maps));
        });
      }

      // 2. Determine correct start map for this player
      // Priority: Player's assigned map -> GM's current map (if following) -> Default
      let startMapId = 'default';

      if (currentPlayerData?.currentMapId) {
        startMapId = currentPlayerData.currentMapId;
      } else if (room.gameState.playerMapAssignments && currentPlayerData?.id && room.gameState.playerMapAssignments[currentPlayerData.id]) {
        startMapId = room.gameState.playerMapAssignments[currentPlayerData.id];
      } else if (room.gameState.defaultMapId) {
        startMapId = room.gameState.defaultMapId;
      } else {
        const availableMapIds = Object.keys(room.gameState.maps || {});
        if (availableMapIds.length > 0) {
          startMapId = availableMapIds[0];
        }
      }

      // Ensure start map exists; fallback to default then first available map.
      if (!room.gameState.maps?.[startMapId]) {
        const fallbackDefault = room.gameState.defaultMapId || 'default';
        const availableMapIds = Object.keys(room.gameState.maps || {});
        startMapId = room.gameState.maps?.[fallbackDefault]
          ? fallbackDefault
          : (availableMapIds[0] || 'default');
      }

      // Sync local map state
      setPlayerCurrentMapId(startMapId);
      import('../../store/mapStore').then(({ default: useMapStore }) => {
        useMapStore.setState({ currentMapId: startMapId });
      });

      console.log('Ã°Å¸â€œÂ Initializing player on map:', startMapId);

      // ===== FALLBACK: Load level editor state from gameState for non-GM players =====
      // The server sends gameState with per-map terrain/fog/walls, but levelEditorState
      // is only populated from GM broadcasts. For permanent rooms where the GM may not
      // be online, we extract it directly from the persisted gameState.
      if (!isGameMaster && !initialLevelEditorApplied) {
        const mapData = room.gameState.maps?.[startMapId];
        if (mapData) {
          window._isReceivingMapUpdate = true;
          try {
            const levelEditorStore = useLevelEditorStore.getState();

            levelEditorStore.loadCompleteLevelEditorState({
              terrainData: mapData.terrainData,
              wallData: mapData.wallData,
              windowOverlays: mapData.windowOverlays,
              environmentalObjects: mapData.environmentalObjects,
              drawingPaths: mapData.drawingPaths,
              drawingLayers: mapData.drawingLayers,
              fogOfWarData: mapData.fogOfWarData,
              exploredAreas: mapData.exploredAreas,
              lightSources: mapData.lightSources,
              fogOfWarPaths: mapData.fogOfWarPaths,
              fogErasePaths: mapData.fogErasePaths,
              dynamicFogEnabled: mapData.dynamicFogEnabled,
              respectLineOfSight: mapData.respectLineOfSight,
              dndElements: mapData.dndElements
            });

            // Also apply grid settings from gameState if not already set
            const gs = room.gameState.gridSettings;
            if (gs) {
              const gameStore = useGameStore.getState();
              if (gs.gridType !== undefined) gameStore.setGridType(gs.gridType);
              if (gs.gridSize !== undefined) gameStore.setGridSize(gs.gridSize);
              if (gs.gridOffsetX !== undefined && gs.gridOffsetY !== undefined) {
                gameStore.setGridOffset(gs.gridOffsetX, gs.gridOffsetY);
              }
              if (gs.gridLineColor !== undefined) gameStore.setGridLineColor(gs.gridLineColor);
              if (gs.gridLineThickness !== undefined) gameStore.setGridLineThickness(gs.gridLineThickness);
              if (gs.gridLineOpacity !== undefined) gameStore.setGridLineOpacity(gs.gridLineOpacity);
              if (gs.gridBackgroundColor !== undefined) gameStore.setGridBackgroundColor(gs.gridBackgroundColor);
            }

            console.log('Ã¢Å“â€¦ [handleJoinRoom] Level editor state loaded from persisted gameState for map:', startMapId);
          } catch (error) {
            console.error('Ã¢ÂÅ’ [handleJoinRoom] Failed to load level editor state from gameState:', error);
          } finally {
            window._isReceivingMapUpdate = false;
          }
        } else {
          console.warn('Ã¢Å¡Â Ã¯Â¸Â [handleJoinRoom] No map data found for startMapId:', startMapId, 'in gameState maps:', Object.keys(room.gameState.maps || {}));
        }
      }

      console.log('Ã°Å¸â€Â [handleJoinRoom] Room structure received from server:', {
        roomId: room.id,
        hasGameState: !!room.gameState,
        gameStateKeys: Object.keys(room.gameState || {}),
        mapsCount: Object.keys(room.gameState?.maps || {}).length,
        mapsKeys: Object.keys(room.gameState?.maps || {}),
        defaultMapId: room.gameState?.defaultMapId,
        hasDefaultMap: !!room.gameState?.maps?.default,
        defaultMapStructure: room.gameState?.maps?.default ? {
          hasGridItems: !!room.gameState.maps.default.gridItems,
          gridItemsCount: Object.keys(room.gameState.maps.default.gridItems || {}).length,
          gridItemIds: Object.keys(room.gameState.maps.default.gridItems || {}),
          hasTerrainData: !!room.gameState.maps.default.terrainData,
          terrainDataCount: Object.keys(room.gameState.maps.default.terrainData || {}).length
        } : null
      });

      // 3. Load Map-Specific Entities (Tokens, Items)
      // We must pull from specific map storage, NOT global legacy storage
      const targetMapData = room.gameState.maps?.[startMapId] || {};

      const tokensRaw = targetMapData.tokens;
      const characterTokensRaw = targetMapData.characterTokens;
      const gridItemsRaw = targetMapData.gridItems;

      const hasInitialTokenPayload = tokensRaw !== undefined || characterTokensRaw !== undefined;
      const hasInitialGridItemsPayload = gridItemsRaw !== undefined;

      if (hasInitialTokenPayload) {
        clearCreatureTokens();
        clearCharacterTokens();
      } else {
        console.warn('Ã¢Å¡Â Ã¯Â¸Â [handleJoinRoom] Missing initial token payload - preserving existing token stores to avoid accidental wipe');
      }

      // Load Tokens
      const initialTokens = tokensRaw
        ? (Array.isArray(tokensRaw) ? tokensRaw : Object.values(tokensRaw))
        : [];

      if (initialTokens.length > 0) {
        initialTokens.forEach(tokenData => {
          if (tokenData.creature) {
            addCreature(tokenData.creature);
          }

          const creatureRef = tokenData.creatureId || tokenData.creature?.id || tokenData.creature;
          if (creatureRef && tokenData.position) {
            addToken(
              creatureRef,
              tokenData.position,
              false,
              tokenData.id || tokenData.tokenId,
              tokenData.state,
              tokenData.mapId || startMapId
            );
          }
        });
        console.log(`Ã¢â„¢Å¸Ã¯Â¸Â Loaded ${initialTokens.length} tokens for map ${startMapId}`);
      }

      // Load Character Tokens
      const initialCharacterTokens = characterTokensRaw
        ? (Array.isArray(characterTokensRaw) ? characterTokensRaw : Object.values(characterTokensRaw))
        : [];

      if (initialCharacterTokens.length > 0) {
        // characterTokens are usually indexed by playerId, but structure varies
        initialCharacterTokens.forEach(charTokenData => {
          // Ensure we have necessary data
          if (charTokenData.id && charTokenData.position) {
            // We need character data to add token properly. 
            // If missing, we might need to fetch from party members or room.players
            // For now, simpler add might be needed or relying on party sync

            // Check if it's our own token, if so, ensure local store matches
            if (charTokenData.playerId === currentPlayerData?.id) {
              updateCharacterTokenPosition(charTokenData.position);

              // CRITICAL FIX: Set viewingFromToken for player when they have a character token
              // This enables the afterimage/memory system for players
              try {
                const levelEditorStore = useLevelEditorStore.getState();
                if (levelEditorStore.dynamicFogEnabled && !levelEditorStore.viewingFromToken) {
                  console.log('Ã°Å¸â€˜ÂÃ¯Â¸Â [Afterimage] Setting viewingFromToken for player:', charTokenData.id);
                  levelEditorStore.setViewingFromToken({
                    id: charTokenData.id,
                    type: 'character',
                    characterId: charTokenData.playerId,
                    position: charTokenData.position
                  });
                }
              } catch (e) {
                console.warn('Could not set viewingFromToken for player:', e);
              }
            } else {
              // For other players, we need to add them visually
              // But characterStore might not have their data yet. 
              // Rely on party_member_added / player_joined to populate data,
              // then separate sync logic will place them.

              // However, we can perform a raw visual add if we have the data
              if (addCharacterTokenFromServer) {
                addCharacterTokenFromServer(
                  charTokenData.id,
                  charTokenData.position,
                  charTokenData.playerId,
                  charTokenData.mapId || startMapId
                );
              }
            }
          }
        });
        console.log(`Ã¢â„¢Å¸Ã¯Â¸Â Processing character tokens for map ${startMapId}`);
      }
      if (hasInitialGridItemsPayload) {
        const initialGridItems = gridItemsRaw
          ? (Array.isArray(gridItemsRaw) ? gridItemsRaw : Object.values(gridItemsRaw))
          : [];

        console.log('Ã°Å¸â€Â [handleJoinRoom] Grid items data:', {
          mapId: startMapId,
          gridItemsRawType: typeof gridItemsRaw,
          gridItemsRawIsArray: Array.isArray(gridItemsRaw),
          gridItemsRawKeys: typeof gridItemsRaw === 'object' && !Array.isArray(gridItemsRaw) ? Object.keys(gridItemsRaw) : [],
          initialGridItemsCount: initialGridItems.length,
          initialGridItemsIds: initialGridItems.map(i => i.id),
          hasInitialPayload: hasInitialGridItemsPayload
        });

        import('../../store/gridItemStore').then(({ default: useGridItemStore }) => {
          const currentGridItems = useGridItemStore.getState().gridItems || [];
          const nonTargetItems = currentGridItems.filter(item => (item?.mapId || 'default') !== startMapId);
          const normalizedTargetItems = initialGridItems.map(item => ({
            ...item,
            mapId: item?.mapId || startMapId
          }));

          useGridItemStore.setState({
            gridItems: [...nonTargetItems, ...normalizedTargetItems]
          });

          console.log(`Ã°Å¸â€œÂ¦ Loaded ${initialGridItems.length} grid items for map ${startMapId}`);
        });
      } else {
        console.warn('Ã¢Å¡Â Ã¯Â¸Â [handleJoinRoom] Missing initial gridItems payload - preserving existing grid items to avoid accidental wipe');
      }

      // Create/update party with multiplayer players
      // Include GM and all regular players
      const allPlayers = [room.gm];

      // Handle different room.players formats (Map, Array, or Object)
      if (room.players) {
        if (room.players instanceof Map) {
          allPlayers.push(...Array.from(room.players.values()));
        } else if (Array.isArray(room.players)) {
          allPlayers.push(...room.players);
        } else if (typeof room.players === 'object') {
          allPlayers.push(...Object.values(room.players));
        }
      }

      // Remove duplicates based on player ID and exclude current player from connected list
      const uniquePlayers = allPlayers.filter((player, index, self) =>
        index === self.findIndex(p => p.id === player.id) && player.id !== currentPlayerData?.id
      );

      setConnectedPlayers(uniquePlayers);

      // Set initial player count (GM + regular players)
      // Note: room.players is an Array from server (Array.from()), so use .length not .size
      // If I am the creator/GM, I might not be in the players list yet, or I count as +1
      // If I am a player joining, I am already accounted for in the server's update or will be +1.
      // Better to rely on "GM + players.length" logic safely.
      // Set initial player count - server already includes GM in the count
      // Use room.playerCount directly when available (most reliable)
      // Fallback: count unique players + 1 (ourselves)
      const fallbackCount = (uniquePlayers ? uniquePlayers.length : 0) + 1;
      setActualPlayerCount(room.playerCount || fallbackCount);

      // Integrate multiplayer players into party system
      // Get active character data for current player
      const activeCharacter = getActiveCharacter();
      // CRITICAL FIX: Use character name if available, otherwise use display name from join data (currentPlayerData)
      // This ensures players joining without characters (GUESTS) get the name they entered in the lobby
      // Priority: Active Character Name -> Join Data Name -> Fallback
      const currentPlayerCharacterName = activeCharacter?.name || currentPlayerData?.name || 'Unknown Player';

      // Get character store state for display names (more reliable than stored character)
      const characterStore = useCharacterStore.getState();

      // Resolve background display name
      let backgroundDisplayName = characterStore.backgroundDisplayName || activeCharacter?.backgroundDisplayName || '';
      if (!backgroundDisplayName && (characterStore.background || activeCharacter?.background)) {
        const bgId = characterStore.background || activeCharacter?.background;
        const bgData = getBackgroundData(bgId);
        if (bgData) {
          backgroundDisplayName = bgData.name;
        } else {
          const customBgData = getCustomBackgroundData(bgId?.toLowerCase());
          if (customBgData) {
            backgroundDisplayName = customBgData.name;
          }
        }
      }

      // Resolve path display name
      let pathDisplayName = characterStore.pathDisplayName || activeCharacter?.pathDisplayName || '';
      if (!pathDisplayName && (characterStore.path || activeCharacter?.path)) {
        const pathId = characterStore.path || activeCharacter?.path;
        const pathData = getEnhancedPathData(pathId);
        if (pathData) {
          pathDisplayName = pathData.name;
        }
      }

      // CRITICAL: Determine the display name, using account name as fallback for "Character Name"
      let displayName = currentPlayerCharacterName;
      if (displayName === 'Character Name' || displayName === 'Character Name (Room Name)') {
        // Use account name from authStore as fallback
        try {
          const { user } = useAuthStore.getState();
          displayName = user?.displayName || user?.email?.split('@')[0] || currentPlayerData?.name || 'Player';
        } catch (e) {
          displayName = currentPlayerData?.name || 'Player';
        }
      }

      // Create party with room name, GM status, and leader data
      // FIXED: Correct argument order - (partyName, isGM, leaderData)
      // CRITICAL FIX: Clear existing social party members when entering a room to prevent duplicate HUDs
      // Social party and room party are separate systems - we must reset when transitioning
      const partyStoreState = usePartyStore.getState();
      const existingPartyMembers = partyStoreState.partyMembers || [];
      const hasExistingMembers = existingPartyMembers.length > 0;

      // Always clear social party members when entering a room to prevent duplicate HUDs
      if (hasExistingMembers) {
        console.log('Ã°Å¸Â§Â¹ Clearing existing party members before room entry to prevent duplicates', {
          existingCount: existingPartyMembers.length,
          existingNames: existingPartyMembers.map(m => m.name)
        });
        usePartyStore.getState().replacePartyMembers([]);
      }

      // CRITICAL: Get character resources with proper fallbacks
      const createHealth = (activeCharacter?.health?.max > 0) ? activeCharacter.health :
        (characterStore.health?.max > 0) ? characterStore.health : { current: 45, max: 50 };
      const createMana = (activeCharacter?.mana?.max > 0) ? activeCharacter.mana :
        (characterStore.mana?.max > 0) ? characterStore.mana : { current: 45, max: 50 };
      const createActionPoints = (activeCharacter?.actionPoints?.max > 0) ? activeCharacter.actionPoints :
        (characterStore.actionPoints?.max > 0) ? characterStore.actionPoints : { current: 1, max: 3 };

      // Set party basics in store directly instead of createParty() which is async/unreliable in this flow
      usePartyStore.setState({
        currentParty: { id: room.id, name: room.name },
        isInParty: true,
        partyChatMessages: [],
        pendingPartyInvites: [],
        sentPartyInvites: []
      });

      // CRITICAL FIX: Ensure initial leader is set for the party using the real player ID
      // Set synchronously (not via async import) to ensure leaderId is available when HUD renders
      const leaderId = isGameMaster ? (currentPlayerData?.id || 'current-player') : (room.gm?.id || 'room-gm');
      if (leaderId) {
        usePartyStore.getState().setLeader(leaderId, true);
        console.log('Ã°Å¸â€˜â€˜ Party leader set:', leaderId, 'isGM:', isGameMaster);
      }

      // Use real player ID so other players can identify this member uniquely
      const currentPlayerId = currentPlayerData?.id || 'current-player';

      // CRITICAL: Get character data with explicit fallbacks for each resource
      // This ensures HUD bars always have valid values even without an active character
      const charHealth = activeCharacter?.health?.max ? activeCharacter.health :
        (characterStore.health?.max ? characterStore.health : { current: 45, max: 50 });
      const charMana = activeCharacter?.mana?.max ? activeCharacter.mana :
        (characterStore.mana?.max ? characterStore.mana : { current: 45, max: 50 });
      const charActionPoints = activeCharacter?.actionPoints?.max ? activeCharacter.actionPoints :
        (characterStore.actionPoints?.max ? characterStore.actionPoints : { current: 1, max: 3 });

      const currentPlayerMember = {
        id: currentPlayerId,
        socketId: socketConnection?.id || currentPlayerId, // CRITICAL: Store socket.id for character_updated lookups
        userId: currentUserId, // CRITICAL: Firebase UID for reliable identification
        name: displayName, // Use displayName with account name fallback
        isGM: isGameMaster, // Include GM status for current player
        isConnected: true, // CRITICAL: Required for PartyHUD displayMembers filter
        character: {
          class: activeCharacter?.class || characterStore.class || 'Unknown',
          level: activeCharacter?.level || characterStore.level || 1,
          health: charHealth,
          mana: charMana,
          actionPoints: charActionPoints,
          race: activeCharacter?.race || characterStore.race || 'Unknown',
          raceDisplayName: activeCharacter?.raceDisplayName || characterStore.raceDisplayName || 'Unknown',
          background: activeCharacter?.background || characterStore.background || '',
          backgroundDisplayName: backgroundDisplayName,
          path: activeCharacter?.path || characterStore.path || '',
          pathDisplayName: pathDisplayName,
          // Only include classResource if there's an active character with a valid resource system
          // Otherwise omit it so ClassResourceBar doesn't render a 0/0 bar
          ...(activeCharacter?.classResource?.max ? { classResource: activeCharacter.classResource } : {}),
          tokenSettings: activeCharacter?.tokenSettings || characterStore.tokenSettings || {}, // Include token settings, default to empty object
          lore: activeCharacter?.lore || characterStore.lore || {} // Include lore (which contains characterImage), default to empty object
        }
      };

      // Ensure resources never default to 0/0 for display if stores are empty
      if (!currentPlayerMember.character.health?.max) currentPlayerMember.character.health = { current: 45, max: 50 };
      if (!currentPlayerMember.character.mana?.max) currentPlayerMember.character.mana = { current: 45, max: 50 };
      if (!currentPlayerMember.character.actionPoints?.max) currentPlayerMember.character.actionPoints = { current: 1, max: 3 };

      // CRITICAL FIX: Ensure current player member has correct isGM status
      currentPlayerMember.isGM = isGameMaster;

      console.log('Ã°Å¸Å½Â® Current player member data:', {
        id: currentPlayerMember.id,
        socketId: currentPlayerMember.socketId,
        userId: currentPlayerMember.userId,
        name: currentPlayerMember.name,
        isGM: currentPlayerMember.isGM,
        health: currentPlayerMember.character.health,
        mana: currentPlayerMember.character.mana,
        actionPoints: currentPlayerMember.character.actionPoints
      });

      // Add current player as first party member
      usePartyStore.getState().addPartyMember(currentPlayerMember);




      // Broadcast current player's party member data to other players
      if (socketConnection) {
        socketConnection.emit('party_member_added', {
          member: currentPlayerMember
        });
      }

      // Add current player to chat system
      addUser({
        id: currentPlayerData?.id,
        name: currentPlayerCharacterName,
        class: activeCharacter?.class || 'Unknown',
        level: activeCharacter?.level || 1,
        status: 'online'
      });

      // 3. Add GM to party if GM is not the current player
      const gmId = room.gm?.id;
      const gmUserId = room.gmId || room.gm?.userId; // CRITICAL: Use room.gmId from server
      const isGmSelf = (gmId && (gmId === currentPlayerData?.id || gmId === currentPlayerData?.userId)) ||
        (gmUserId && (gmUserId === currentPlayerData?.id || gmUserId === currentPlayerData?.userId));

      if (room.gm && !isGmSelf) {
        let gmCharacterName = room.gm.character?.name || room.gm.name;

        // CRITICAL: Use account name as fallback for "Character Name"
        if (gmCharacterName === 'Character Name' || gmCharacterName === 'Character Name (Room Name)') {
          // Try to get GM's account name from room data
          gmCharacterName = room.gmAccountName || room.gm.name || 'Game Master';
        }

        console.log('Ã°Å¸â€˜Â¤ Adding GM to party:', {
          gmId: room.gm.id,
          gmName: gmCharacterName,
          gmUserId: gmUserId,
          gmSocketId: room.gm?.socketId
        });

        // Only include classResource if it has a valid max value
        const gmClassResource = room.gm.character?.classResource;

        // Ensure GM has valid resource data with proper fallbacks
        const gmHealth = room.gm.character?.health?.max ? room.gm.character.health : { current: 45, max: 50 };
        const gmMana = room.gm.character?.mana?.max ? room.gm.character.mana : { current: 45, max: 50 };
        const gmActionPoints = room.gm.character?.actionPoints?.max ? room.gm.character.actionPoints : { current: 1, max: 3 };

        const gmCharacter = {
          class: room.gm.character?.class || 'Unknown',
          level: room.gm.character?.level || 1,
          health: gmHealth,
          mana: gmMana,
          actionPoints: gmActionPoints,
          race: room.gm.character?.race || 'Unknown',
          subrace: room.gm.character?.subrace || '',
          raceDisplayName: room.gm.character?.raceDisplayName || 'Unknown',
          background: room.gm.character?.background || '',
          backgroundDisplayName: room.gm.character?.backgroundDisplayName || '',
          path: room.gm.character?.path || '',
          pathDisplayName: room.gm.character?.pathDisplayName || '',
          tokenSettings: room.gm.character?.tokenSettings || {},
          lore: room.gm.character?.lore || {}
        };

        // Only add classResource if it has a valid max value (prevents 0/0 bar)
        if (gmClassResource?.max) {
          gmCharacter.classResource = gmClassResource;
        }

        addPartyMember({
          id: room.gm.id,
          socketId: room.gm.socketId || room.gm.id, // CRITICAL: Store socket.id for character_updated lookups
          userId: gmUserId, // CRITICAL: Propagate Firebase UID
          name: gmCharacterName,
          isGM: true,
          isConnected: true, // CRITICAL: Required for PartyHUD displayMembers filter
          character: gmCharacter
        });

        addUser({
          id: room.gm.id,
          name: gmCharacterName,
          class: room.gm.character?.class || 'Unknown',
          level: room.gm.character?.level || 1,
          status: 'online'
        });

        // Set GM as party leader
        usePartyStore.getState().setLeader(room.gm.id, room.gm.id === currentPlayerData?.id);
      }

      // CRITICAL FIX: Add other players to party using the uniquePlayers list
      // Filter out the GM if they were already added above to prevent duplicate HUDs
      const playersToAdd = uniquePlayers.filter(player => player.id !== room.gm?.id);

      if (playersToAdd.length > 0) {
        playersToAdd.forEach(player => {
          // uniquePlayers already filters out current player and duplicates
          let playerCharacterName = player.character?.name || player.name;

          // CRITICAL: Use account name as fallback for "Character Name"
          if (playerCharacterName === 'Character Name' || playerCharacterName === 'Character Name (Room Name)') {
            playerCharacterName = player.accountName || player.name || 'Player';
          }

          // Only include classResource if it has a valid max value
          const playerClassResource = player.character?.classResource;
          const playerCharacter = {
            class: player.character?.class || 'Unknown',
            level: player.character?.level || 1,
            health: player.character?.health || { current: 45, max: 50 },
            mana: player.character?.mana || { current: 45, max: 50 },
            actionPoints: player.character?.actionPoints || { current: 1, max: 3 },
            race: player.character?.race || 'Unknown',
            subrace: player.character?.subrace || '',
            raceDisplayName: player.character?.raceDisplayName || 'Unknown',
            background: player.character?.background || '',
            backgroundDisplayName: player.character?.backgroundDisplayName || '',
            path: player.character?.path || '',
            pathDisplayName: player.character?.pathDisplayName || '',
            tokenSettings: player.character?.tokenSettings || {},
            lore: player.character?.lore || {}
          };

          // Only add classResource if it has a valid max value (prevents 0/0 bar)
          if (playerClassResource?.max) {
            playerCharacter.classResource = playerClassResource;
          }

          const playerMember = {
            id: player.id,
            socketId: player.socketId || player.id, // CRITICAL: Store socket.id for character_updated lookups
            userId: player.userId, // CRITICAL: Firebase UID for reliable identification
            name: playerCharacterName,
            isGM: player.isGM || false,
            isConnected: true, // CRITICAL: Required for PartyHUD displayMembers filter
            character: playerCharacter
          };

          addPartyMember(playerMember);

          addUser({
            id: player.id,
            name: playerCharacterName,
            class: player.character?.class || 'Unknown',
            level: player.character?.level || 1,
            status: 'online'
          });
        });
      }

      // Simple: Room creator is GM, others are players (no leadership transfer needed)

      // Set multiplayer state in game store with socket
      setMultiplayerState(true, room, handleReturnToSinglePlayer, socketConnection, currentPlayerData);

      if (!isGameMaster) {
        console.log('Ã°Å¸â€”ÂºÃ¯Â¸Â [Travel] Requesting travel sync from GM, roomId:', room?.id);
        socketConnection.emit('request_travel_sync', { roomId: room?.id });
      }

      // Set up chat integration for multiplayer
      const sendChatMessage = (message) => {
        if (socketConnection && socketConnection.connected) {
          // Get current player data for the message
          const activeCharacter = getActiveCharacter();
          const currentPlayerCharacterName = activeCharacter?.name || currentPlayerData?.name || 'Unknown Player';
          const currentPlayerId = currentPlayerData?.id || currentPlayerRef.current?.id || socketConnection?.id;

          socketConnection.emit('chat_message', {
            message: message,
            content: message,
            type: 'party', // Explicitly set as party chat
            playerId: currentPlayerId,
            senderId: currentPlayerId,
            playerName: currentPlayerCharacterName,
            senderName: currentPlayerCharacterName
          });
        } else {
          console.error('No socket connection for chat or socket disconnected');
          // Show error to user
          addNotification('social', {
            sender: { name: 'System', class: 'system', level: 0 },
            content: 'Cannot send message: disconnected from server',
            type: 'system',
            timestamp: new Date().toISOString()
          });
        }
      };
      setMultiplayerIntegration(socketConnection, sendChatMessage);

      // Set up dialogue system for multiplayer
      setMultiplayerSocket(socketConnection, true, currentPlayerData?.id);

      // Initialize game state manager for permanent room state
      if (room.persistentRoomId || room.id) {
        const roomId = room.persistentRoomId || room.id;
        const isPermanentRoom = !!room.persistentRoomId;

        console.log('Ã°Å¸Å½Â® Initializing game state manager for room:', roomId, {
          isPermanentRoom,
          isGM: isGameMaster,
          hasSavedState: isPermanentRoom
        });

        if (isPermanentRoom) {
          gameStateManager.initialize(roomId, isGameMaster).then(() => {
            console.log('Ã¢Å“â€¦ Game state manager initialized successfully');
          }).catch((error) => {
            console.error('Ã¢ÂÅ’ Failed to initialize game state manager:', error);
          });
        } else {
          console.log('Ã°Å¸Å½Â® Skipping Firebase game state load for non-permanent room');
        }
      }

      // Apply tier-based feature restrictions
      try {
        const useAuthStore = (await import('../../store/authStore')).default;
        const userId = useAuthStore.getState().user?.uid;
        await useLevelEditorStore.getState().applyTierFeatureFlags(userId);
      } catch (e) {
        console.warn('Could not apply tier feature flags:', e);
      }

      // Sync weather state from room game state for players
      try {
        if (room.gameState?.weather && !isGameMaster) {
          const weather = room.gameState.weather;
          if (weather.enabled && weather.type && weather.type !== 'none') {
            useLevelEditorStore.getState().loadCompleteLevelEditorState({
              atmosphericEffects: true,
              weatherEffects: { type: weather.type, intensity: weather.intensity, enabled: weather.enabled }
            });
          }
        }
      } catch (e) {
        console.warn('Could not sync weather state:', e);
      }

      // Set current room after all initialization is complete
      setCurrentRoom(room);
      setCombatSyncSocket(socket, room.id);

      // Show successful join notification
      if (!skipSetJoiningFalse) {
        setIsJoiningRoom(false);
      }
      setConnectionStatus('connected');

      // Welcome notification
      addNotificationRef.current('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: `Ã°Å¸Å½â€° Welcome to ${room.name}! You have joined as ${isGameMaster ? 'Game Master' : 'Player'}. The adventure awaits!`,
        type: 'system',
        timestamp: new Date().toISOString()
      });

      // CRITICAL: Trigger initial character sync so everyone sees us correctly
      import('../../store/characterStore').then(({ default: useCharacterStore }) => {
        useCharacterStore.getState().syncWithMultiplayer();
        console.log('Ã°Å¸Å¡â‚¬ Triggered initial character sync upon room entry');
      });

      // Additional helpful notification for new players
      if (!isGameMaster) {
        setTimeout(() => {
          addNotificationRef.current('social', {
            sender: { name: 'System', class: 'system', level: 0 },
            content: 'Ã°Å¸â€™Â¡ Tip: Use the chat to communicate with your party. Press Enter to send messages.',
            type: 'system',
            timestamp: new Date().toISOString()
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Error in handleJoinRoom:', error);
      if (!skipSetJoiningFalse) {
        setIsJoiningRoom(false);
      }
      setConnectionStatus('error');

      // Show user-friendly error message
      const errorMessage = error.message?.includes('character')
        ? error.message
        : 'Failed to join room. Please try again.';

      setError(errorMessage);

      addNotificationRef.current('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: `Failed to join room: ${errorMessage}`,
        type: 'system',
        timestamp: new Date().toISOString()
      });
    }
}

