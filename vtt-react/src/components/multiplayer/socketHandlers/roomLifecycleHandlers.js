import usePartyStore from '../../../store/partyStore';
import useAuthStore from '../../../store/authStore';
import useLevelEditorStore from '../../../store/levelEditorStore';
import useGameStore from '../../../store/gameStore';
import useMapStore from '../../../store/mapStore';

export function registerRoomLifecycleHandlers(ctx) {
  const {
    socket,
    setActualPlayerCount, setConnectedPlayers, setIsGM,
    setPendingRoomData, setIsRoomReady, setConnectionStatus,
    setLoadingStatusMessage,
    currentRoomRef, currentPlayerRef, pendingRoomDataRef,
    activeJoinIdRef, isAutoJoinSequenceRef, isGMRef,
    addPartyMember, updatePartyMember, removePartyMember,
    addUser, removeUser, addNotification,
    showPlayerJoinNotification, showPlayerLeaveNotification,
    showGMDisconnectedNotification,
    handleLeaveRoom, navigate
  } = ctx;
    if (!socket) return;

    // CRITICAL: Handle room_joined event
    socket.on('room_joined', (data) => {
      console.log('âœ… [MultiplayerApp] room_joined received:', data);

      // Guard: If we're already in a room, this is a RECONNECT scenario
      // Instead of ignoring, refresh party members from the server's room data
      if (currentRoomRef.current) {
        console.log('ðŸ”„ [MultiplayerApp] Already in room, refreshing party members from reconnect');

        if (data.room) {
          const serverPlayerCount = data.playerCount || 1;
          setActualPlayerCount(serverPlayerCount);

          // Re-add current player with updated socket info
          const currentUserId = useAuthStore.getState().user?.uid;
          const currentSocketId = socket?.id;
          const existingSelf = usePartyStore.getState().partyMembers.find(m => {
            const selfIds = new Set(['current-player']);
            try {
              const gs = require('../../../store/gameStore').default.getState();
              if (gs?.currentPlayer?.id) selfIds.add(gs.currentPlayer.id);
            } catch (e) {}
            if (currentUserId) selfIds.add(currentUserId);
            return selfIds.has(m.id) || selfIds.has(m.userId);
          });

          if (existingSelf && currentSocketId) {
            usePartyStore.getState().updatePartyMember(existingSelf.id, {
              socketId: currentSocketId,
              isConnected: true
            });
          } else if (!existingSelf) {
            const selfPlayer = allRoomPlayers.find(p =>
              p.id === currentPlayerRef.current?.id ||
              p.socketId === currentSocketId ||
              p.userId === currentUserId
            );
            const gs = require('../../../store/gameStore').default.getState();
            const cs = require('../../../store/characterStore').default.getState();
            const activeChar = cs?.getActiveCharacter?.() || null;
            const selfMember = {
              id: selfPlayer?.id || gs?.currentPlayer?.id || currentUserId || 'current-player',
              socketId: currentSocketId || 'current-player',
              userId: currentUserId,
              name: selfPlayer?.character?.name || selfPlayer?.name || gs?.currentPlayer?.name || 'Player',
              isGM: data.isGM || data.isGMReconnect || gs?.isGMMode || false,
              isConnected: true,
              character: {
                class: activeChar?.class || cs?.class || selfPlayer?.character?.class || 'Unknown',
                level: activeChar?.level || cs?.level || selfPlayer?.character?.level || 1,
                health: activeChar?.health?.max ? activeChar.health : (cs?.health?.max ? cs.health : selfPlayer?.character?.health || { current: 45, max: 50 }),
                mana: activeChar?.mana?.max ? activeChar.mana : (cs?.mana?.max ? cs.mana : selfPlayer?.character?.mana || { current: 45, max: 50 }),
                actionPoints: activeChar?.actionPoints?.max ? activeChar.actionPoints : (cs?.actionPoints?.max ? cs.actionPoints : selfPlayer?.character?.actionPoints || { current: 1, max: 3 }),
                race: activeChar?.race || cs?.race || selfPlayer?.character?.race || 'Unknown',
                raceDisplayName: activeChar?.raceDisplayName || cs?.raceDisplayName || selfPlayer?.character?.raceDisplayName || 'Unknown',
                lore: activeChar?.lore || cs?.lore || selfPlayer?.character?.lore || {},
                tokenSettings: activeChar?.tokenSettings || cs?.tokenSettings || selfPlayer?.character?.tokenSettings || {}
              }
            };
            if (activeChar?.classResource?.max) selfMember.character.classResource = activeChar.classResource;
            usePartyStore.getState().addPartyMember(selfMember);
            console.log('ðŸ”„ [Reconnect] Self not found in partyMembers, added:', selfMember.name);
          }

          // Re-add/update all room players from server data
          const allRoomPlayers = [];
          if (data.room.gm) allRoomPlayers.push({ ...data.room.gm, isGM: true });
          if (data.room.players) {
            const players = Array.isArray(data.room.players)
              ? data.room.players
              : Object.values(data.room.players || {});
            allRoomPlayers.push(...players);
          }

          allRoomPlayers.forEach(player => {
            const isCurrentPlayer = player.id === currentPlayerRef.current?.id ||
              player.socketId === currentSocketId ||
              player.userId === currentUserId;

            if (isCurrentPlayer) return;

            const playerCharacterName = player.character?.name || player.name;
            const playerMember = {
              id: player.id,
              socketId: player.socketId || player.id,
              userId: player.userId,
              name: playerCharacterName,
              isGM: player.isGM || false,
              isConnected: true,
              character: {
                class: player.character?.class || 'Unknown',
                level: player.character?.level || 1,
                health: player.character?.health || { current: 45, max: 50 },
                mana: player.character?.mana || { current: 45, max: 50 },
                actionPoints: player.character?.actionPoints || { current: 1, max: 3 },
                race: player.character?.race || 'Unknown',
                raceDisplayName: player.character?.raceDisplayName || 'Unknown',
                lore: player.character?.lore || {},
                tokenSettings: player.character?.tokenSettings || {}
              }
            };
            if (player.character?.classResource?.max) {
              playerMember.character.classResource = player.character.classResource;
            }
            usePartyStore.getState().addPartyMember(playerMember);
          });

          // Mark any members NOT in the server's player list as disconnected
          const serverPlayerIds = new Set(allRoomPlayers.map(p => p.id));
          if (existingSelf) {
            serverPlayerIds.add(existingSelf.id);
          } else if (currentUserId) {
            serverPlayerIds.add(currentUserId);
          }
          const currentMembers = usePartyStore.getState().partyMembers;
          currentMembers.forEach(member => {
            if (!serverPlayerIds.has(member.id) && !serverPlayerIds.has(member.userId)) {
              usePartyStore.getState().updatePartyMember(member.id, { isConnected: false });
            }
          });

          setConnectionStatus('connected');
          console.log('âœ… [MultiplayerApp] Party members refreshed from reconnect:', serverPlayerCount, 'players');
        }
        return;
      }

      // Guard: Check for stale/duplicate join using join ID
      const joinId = data.room?.id || data.room?.persistentRoomId;
      if (activeJoinIdRef.current && activeJoinIdRef.current !== joinId) {
        console.log('âš ï¸ [MultiplayerApp] Stale room_joined (different room), ignoring', {
          activeJoinId: activeJoinIdRef.current,
          receivedJoinId: joinId
        });
        return;
      }

      // Guard: If we already have pending room data for the same room, don't overwrite
      if (pendingRoomDataRef.current && pendingRoomDataRef.current.room) {
        const pendingRoomId = pendingRoomDataRef.current.room.id || pendingRoomDataRef.current.room.persistentRoomId;
        if (pendingRoomId === joinId) {
          console.log('âš ï¸ [MultiplayerApp] Already have pending data for this room, ignoring duplicate');
          return;
        }
      }

      // Mark this join as active
      activeJoinIdRef.current = joinId;

      // Use server's playerCount directly (already includes GM - avoids double-counting)
      setActualPlayerCount(data.playerCount || 1);

      // Use explicit isGM flag from server
      const isGameMaster = data.isGM || data.isGMReconnect || false;
      
      // CRITICAL FIX: Sync isGM state immediately so condition checks in Effects are accurate
      setIsGM(isGameMaster);

      // Get password from localStorage (auto-join flow stores it there)
      const usedPassword = sessionStorage.getItem('selectedRoomPassword') || '';

      // Clear auto-join flags
      localStorage.removeItem('selectedRoomId');
      sessionStorage.removeItem('selectedRoomPassword');

      // DETECT AUTO-CONTINUE INTENT
      // Skip "Continue" button for:
      // 1. Invitations (already verified via sessionStorage)
      // 2. Auto-joins (marked by isAutoJoinSequenceRef)
      // 3. New GM creations (captured by isJoiningRoomRef during the current session)
      const pendingInvitationStr = sessionStorage.getItem('pendingGMSessionInvitation');
      let shouldAutoContinue = isAutoJoinSequenceRef.current;

      console.log('ðŸ” [MultiplayerApp] Detecting auto-continue intent:', {
        isAutoJoinSequence: isAutoJoinSequenceRef.current,
        hasPendingInvitation: !!pendingInvitationStr,
        receivedJoinId: joinId
      });

      if (pendingInvitationStr) {
        try {
          const invitation = JSON.parse(pendingInvitationStr);
          console.log('ðŸ” [MultiplayerApp] Comparing invitation IDs:', {
            invitationRoomId: invitation.roomId,
            joinId: joinId
          });

          // Robust comparison: check if invitation.roomId matches joinId
          if (invitation.roomId === joinId ||
            (data.room?.persistentRoomId && invitation.roomId === data.room.persistentRoomId) ||
            (data.room?.id && invitation.roomId === data.room.id)) {
            console.log('âœ¨ [MultiplayerApp] Verified invitation join for auto-continue:', invitation.partyName);
            shouldAutoContinue = true;
            sessionStorage.removeItem('pendingGMSessionInvitation');
          } else {
            console.warn('âš ï¸ [MultiplayerApp] Invitation Room ID mismatch:', {
              invitationRoomId: invitation.roomId,
              joinRoomId: data.room?.id,
              joinPersistentId: data.room?.persistentRoomId
            });
          }
        } catch (e) {
          console.error('âŒ Failed to parse pending invitation in room_joined:', e);
        }
      }

      // Reset auto-join intent once captured in roomData
      isAutoJoinSequenceRef.current = false;

      // Record room data for the transition
      const roomData = {
        room: data.room,
        socket: socket,
        isGM: isGameMaster,
        player: data.player,
        password: usedPassword,
        levelEditor: data.levelEditor,
        gridSettings: data.gridSettings,
        isInvitationJoin: shouldAutoContinue // Flag to skip "Continue" button
      };

      // Store room data for the Continue button flow
      setPendingRoomData(roomData);
      pendingRoomDataRef.current = roomData;
      setIsRoomReady(true);

      // Update URL with room code for shareable links
      const roomCode = data.room.persistentRoomId || data.room.id;
      if (roomCode) {
        navigate(`/multiplayer/${roomCode}`, { replace: true });
      }

      console.log('âœ… [MultiplayerApp] Room data stored and isRoomReady set to true', {
        room: data.room.name,
        isInvitationJoin: shouldAutoContinue,
        isGM: isGameMaster
      });

      if (shouldAutoContinue) {
        setLoadingStatusMessage('Finalizing entry...');
      } else {
        setLoadingStatusMessage(null); // Clear custom message so default stage text takes over
      }
    });

    // CRITICAL: Handle room_created event for GM resume flow
    // The server emits room_created, then immediately room_joined
    socket.on('room_created', (data) => {
      console.log('âœ… [MultiplayerApp] room_created received:', data);
      console.log('ðŸ” Room structure check:', {
        hasRoom: !!data.room,
        hasPersistentRoomId: !!data.room?.persistentRoomId,
        roomId: data.room?.id,
        persistentRoomId: data.room?.persistentRoomId
      });

      // Note: Party members are already cleared BEFORE create_room is emitted
      // This is just a safety check in case clear failed earlier
      try {
        const currentPartyMembers = usePartyStore.getState().partyMembers || [];
        // Only clear if there are still members (safety check)
        if (currentPartyMembers.length > 0 && currentPartyMembers.some(m => !m.isGM)) {
          console.log('ðŸ§¹ Safety clear: Removing non-GM party members on room_created');
          const gmsOnly = currentPartyMembers.filter(m => m.isGM);
          usePartyStore.getState().replacePartyMembers(gmsOnly);
        }
      } catch (e) {
        console.warn('âš ï¸ Failed to verify party members on room_created:', e);
      }

      // Update URL with room code for shareable links
      const roomCode = data.room.persistentRoomId || data.room.id;
      if (roomCode) {
        navigate(`/multiplayer/${roomCode}`, { replace: true });
      }

      // Clear any remaining auto-join flags
      localStorage.removeItem('selectedRoomId');
      sessionStorage.removeItem('selectedRoomPassword');
      localStorage.removeItem('isGMResume');
      localStorage.removeItem('resumeRoomName');

      // The room_joined event will follow shortly and handle the actual join
      console.log('âœ… Room created/resumed successfully, waiting for room_joined:', roomCode);
    });

    // Listen for player join/leave events
    socket.on('player_joined', async (data) => {
      if (!data || !data.player) return;

      // Server sends total count (players + GM), use it directly
      setActualPlayerCount(data.playerCount || 1);

      // Update player locations if provided
      if (data.room && data.room.playerMapAssignments) {
        usePartyStore.getState().setAllPlayerMapAssignments(data.room.playerMapAssignments);
      } else if (data.player && data.player.currentMapId) {
        usePartyStore.getState().setPlayerMapAssignment(data.player.id, data.player.currentMapId);
      }

      // Update connected players list - don't require currentRoom to be set yet
      setConnectedPlayers(prev => {
        // Check if player already exists to avoid duplicates
        const existingPlayer = prev.find(p => p.id === data.player.id);
        if (existingPlayer) {
          return prev;
        }

        // Don't add current player to connected players list (they're handled separately)
        if (currentPlayerRef.current && data.player.id === currentPlayerRef.current.id) {
          return prev;
        }

        const updated = [...prev, data.player];

        // CRITICAL FIX: If we're on the loading screen (pendingRoomData exists), 
        // add the player to the pending room data's players list so they are picked up 
        // when handleJoinRoom is finally called.
        if (pendingRoomDataRef.current && pendingRoomDataRef.current.room) {
          const room = pendingRoomDataRef.current.room;
          if (!room.players) room.players = [];

          const playerExistsInPending = Array.isArray(room.players)
            ? room.players.some(p => p.id === data.player.id)
            : (room.players instanceof Map ? room.players.has(data.player.id) : room.players[data.player.id]);

          if (!playerExistsInPending) {
            console.log('ðŸ“¦ Buffering joined player into pendingRoomData:', data.player.name);
            if (Array.isArray(room.players)) {
              room.players.push(data.player);
            } else if (room.players instanceof Map) {
              room.players.set(data.player.id, data.player);
            } else {
              room.players[data.player.id] = data.player;
            }
          }
        }

        return updated;
      });

      // Show player join notification (only if currentRoom is set)
      if (currentRoomRef.current) {
        showPlayerJoinNotification(data.player.name, currentRoomRef.current.name);
      }


      // Use character name if available, otherwise fall back to player name
      let playerCharacterName = data.player.character?.name || data.player.name;

      // CRITICAL: Use account name as fallback for "Character Name"
      if (playerCharacterName === 'Character Name' || playerCharacterName === 'Character Name (Room Name)') {
        playerCharacterName = data.player.accountName || data.player.name || 'Player';
      }

      // Skip adding ourselves to prevent duplicate HUDs - check strict IDs only
      // CRITICAL FIX: Do NOT check by name, as multiple players (or GM) might have the same name/account during testing
      const isCurrentPlayer = data.player.id === currentPlayerRef.current?.id ||
        data.player.socketId === socket?.id;

      if (!isCurrentPlayer) {

        // Calculate proper race display name from race and subrace data
        let raceDisplayName = data.player.character?.raceDisplayName || 'Unknown';

        console.log('ðŸ†” player_joined - Adding party member with:', {
          playerId: data.player.id,
          playerSocketId: data.player.socketId,
          playerUserId: data.player.userId,
          playerName: playerCharacterName,
          serverPlayerName: data.player.name
        });

        // Add to party system with character data first
        // CRITICAL FIX: Ensure isGM is explicitly false for joining players (only room creator is GM)
        // CRITICAL FIX: Add isConnected: true since player has actually joined the room
        const playerCharClassResource = data.player.character?.classResource;
        const newPartyMember = {
          id: data.player.id,
          socketId: data.player.socketId || data.player.id, // CRITICAL: Store actual socket.io ID for character_updated lookups
          userId: data.player.userId, // CRITICAL: Firebase UID for reliable identification
          name: playerCharacterName,
          isGM: false, // Joining players are never GM - only room creator is GM
          isConnected: true, // Player has actually joined the room
          character: {
            class: data.player.character?.class || 'Unknown',
            level: data.player.character?.level || 1,
            // CRITICAL FIX: Use defaults that match characterStore (HP 50, Mana 50, AP 3)
            health: data.player.character?.health || { current: 45, max: 50 },
            mana: data.player.character?.mana || { current: 45, max: 50 },
            actionPoints: data.player.character?.actionPoints || { current: 1, max: 3 },
            race: data.player.character?.race || 'Unknown',
            subrace: data.player.character?.subrace || '',
            raceDisplayName: raceDisplayName,
            tokenSettings: data.player.character?.tokenSettings || {}, // Include token settings
            lore: data.player.character?.lore || {} // Include lore (which contains characterImage)
          }
        };

        // Only add classResource if it has a valid max value (prevents 0/0 bar)
        if (playerCharClassResource?.max) {
          newPartyMember.character.classResource = playerCharClassResource;
        }

        // Add party member
        addPartyMember(newPartyMember);

        // Then update with proper race display name if needed
        if (data.player.character?.race && data.player.character?.subrace) {
          import('../../../data/raceData').then(({ getFullRaceData }) => {
            const raceData = getFullRaceData(data.player.character.race, data.player.character.subrace);
            if (raceData) {
              const updatedRaceDisplayName = `${raceData.subrace.name} ${raceData.race.name}`;
              // Update the party member with the correct race display name
              updatePartyMember(data.player.id, {
                character: {
                  ...newPartyMember.character,
                  raceDisplayName: updatedRaceDisplayName
                }
              });
            }
          }).catch(error => {
            console.warn('Failed to calculate race display name for new player:', error);
          });
        } else if (data.player.character?.race) {
          import('../../../data/raceData').then(({ getRaceData }) => {
            const raceData = getRaceData(data.player.character.race);
            if (raceData) {
              const updatedRaceDisplayName = raceData.name;
              // Update the party member with the correct race display name
              updatePartyMember(data.player.id, {
                character: {
                  ...newPartyMember.character,
                  raceDisplayName: updatedRaceDisplayName
                }
              });
            }
          }).catch(error => {
            console.warn('Failed to get race data for new player:', error);
          });
        }

        // Broadcast party member addition to other players
        if (socket && socket.connected) {
          socket.emit('party_member_added', {
            member: newPartyMember
          });

          // CRITICAL: Also broadcast OUR character to the newcomer so they see us correctly
          import('../../../store/characterStore').then(({ default: useCharacterStore }) => {
            useCharacterStore.getState().syncWithMultiplayer();
            console.log('ðŸ“¤ Broadcasted local character to newcomer:', playerCharacterName);
          });
        }
      }

      // ===== RE-ENABLED WITH MAP-SPECIFIC FILTERING =====
      // FIX: GM now broadcasts map-specific terrain based on player's assigned map
      // Players receive data only for the map they're assigned to, preventing cross-map contamination
      if (isGMRef.current && socket && socket.connected) {
        console.log('ðŸ—ºï¸ GM broadcasting map-specific state to new player:', data.player.name);

        try {
          const levelEditorStore = useLevelEditorStore.getState();
          const gameStore = useGameStore.getState();
          const mapStore = useMapStore.getState();

          // Get the player's assigned map ID - use default if not specified
          const playerMapId = data.playerMapId || 'default';

          // CRITICAL FIX: Get terrain data from the player's assigned map in mapStore
          // This prevents sending current GM view's terrain to a player on a different map
          const playerMap = (mapStore.maps || []).find(m => m.id === playerMapId);

          // Use map-specific data if available, otherwise fall back to global (for 'default' map)
          const mapTerrainData = playerMap?.terrainData || (playerMapId === mapStore.currentMapId ? levelEditorStore.terrainData : {}) || {};
          const mapWallData = playerMap?.wallData || (playerMapId === mapStore.currentMapId ? levelEditorStore.wallData : {}) || {};
          const mapDrawingPaths = playerMap?.drawingPaths || (playerMapId === mapStore.currentMapId ? levelEditorStore.drawingPaths : []) || [];
          const mapDrawingLayers = playerMap?.drawingLayers || (playerMapId === mapStore.currentMapId ? levelEditorStore.drawingLayers : []) || [];
          const mapFogOfWarData = playerMap?.fogOfWarData || (playerMapId === mapStore.currentMapId ? levelEditorStore.fogOfWarData : {}) || {};
          const mapFogOfWarPaths = playerMap?.fogOfWarPaths || (playerMapId === mapStore.currentMapId ? levelEditorStore.fogOfWarPaths : []) || [];
          const mapFogErasePaths = playerMap?.fogErasePaths || (playerMapId === mapStore.currentMapId ? levelEditorStore.fogErasePaths : []) || [];
          const mapDndElements = playerMap?.dndElements || (playerMapId === mapStore.currentMapId ? levelEditorStore.dndElements : []) || [];

          // Map-specific overlays (windows, doors, etc.)
          const mapWindowOverlays = playerMap?.windowOverlays || (playerMapId === mapStore.currentMapId ? levelEditorStore.windowOverlays : {}) || {};

          console.log(`ðŸ—ºï¸ Sending terrain for map ${playerMapId}:`, {
            terrainTileCount: Object.keys(mapTerrainData).length,
            isFromMapStore: !!playerMap?.terrainData,
            gmCurrentMap: mapStore.currentMapId
          });

          socket.emit('sync_level_editor_state', {
            mapId: playerMapId,
            levelEditor: {
              terrainData: mapTerrainData,
              wallData: mapWallData,
              windowOverlays: mapWindowOverlays,
              environmentalObjects: playerMap?.environmentalObjects || levelEditorStore.environmentalObjects || [],
              drawingPaths: mapDrawingPaths,
              drawingLayers: mapDrawingLayers,
              fogOfWarData: mapFogOfWarData,
              fogOfWarPaths: mapFogOfWarPaths,
              fogErasePaths: mapFogErasePaths,
              exploredAreas: playerMap?.exploredAreas || levelEditorStore.exploredAreas || {},
              lightSources: playerMap?.lightSources || levelEditorStore.lightSources || {},
              dynamicFogEnabled: levelEditorStore.dynamicFogEnabled,
              respectLineOfSight: levelEditorStore.respectLineOfSight,
              dndElements: mapDndElements
            },
            gridSettings: {
              gridType: playerMap?.gridSettings?.gridType || gameStore.gridType || 'square',
              gridSize: playerMap?.gridSettings?.gridSize || gameStore.gridSize || 50,
              gridOffsetX: playerMap?.gridSettings?.gridOffsetX || gameStore.gridOffsetX || 0,
              gridOffsetY: playerMap?.gridSettings?.gridOffsetY || gameStore.gridOffsetY || 0,
              gridLineColor: playerMap?.gridSettings?.gridLineColor || gameStore.gridLineColor || 'rgba(255, 255, 255, 0.8)',
              gridLineThickness: playerMap?.gridSettings?.gridLineThickness || gameStore.gridLineThickness || 2,
              gridLineOpacity: gameStore.gridLineOpacity || 0.8,
              gridBackgroundColor: gameStore.gridBackgroundColor || '#d4c5b9'
            },
            gameplaySettings: {
              feetPerTile: gameStore.feetPerTile || 5,
              showMovementVisualization: gameStore.showMovementVisualization,
              movementLineColor: gameStore.movementLineColor || '#FFD700',
              movementLineWidth: gameStore.movementLineWidth || 3,
              defaultViewFromToken: gameStore.defaultViewFromToken
            }
          });

          // CRITICAL: Explicitly broadcast tokens for the specific map
          const creatureStore = (await import('../../../store/creatureStore')).default.getState();
          const tokens = Object.fromEntries(
            Object.entries(creatureStore.tokens || {}).filter(([_, t]) => (t.mapId || 'default') === playerMapId)
          );

          if (Object.keys(tokens).length > 0) {
            console.log(`ðŸ“¤ Broadcasting ${Object.keys(tokens).length} tokens for map ${playerMapId}`);
            socket.emit('sync_tokens', {
              mapId: playerMapId,
              tokens: tokens,
              recipientPlayerId: data.player.id // Optional hint for server to only send to this player
            });
          }

          // CRITICAL: Explicitly broadcast grid items for the specific map
          const gridItemStore = (await import('../../../store/gridItemStore')).default.getState();
          const gridItems = (gridItemStore.gridItems || []).filter(item => (item.mapId || 'default') === playerMapId);

          if (gridItems.length > 0) {
            console.log(`ðŸ“¤ Broadcasting ${gridItems.length} grid items for map ${playerMapId}`);
            socket.emit('sync_grid_items', {
              mapId: playerMapId,
              gridItems: Object.fromEntries(gridItems.map(item => [item.id, item])),
              recipientPlayerId: data.player.id
            });
          }

        } catch (error) {
          console.error('Failed to broadcast level editor state:', error);
        }
      }

      // Add to chat system
      addUser({
        id: data.player.id,
        name: playerCharacterName,
        class: data.player.character?.class || 'Unknown',
        level: data.player.character?.level || 1,
        status: 'online'
      });

      // Add chat notification about player joining
      addNotification('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: `${data.player.name} joined the room`,
        type: 'system',
        timestamp: new Date().toISOString()
      });
    });

    socket.on('player_left', (data) => {
      const playerId = data?.player?.id || data?.playerId;
      const playerName = data?.player?.name || data?.playerName;
      if (!data || !playerId) return;

      if (playerId === currentPlayerRef.current?.id) {
        handleLeaveRoom();
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 200);
        return;
      }

      setActualPlayerCount(data.playerCount || 1);

      setConnectedPlayers(prev => {
        const updated = prev.filter(player => player.id !== playerId);

        if (pendingRoomDataRef.current && pendingRoomDataRef.current.room) {
          const room = pendingRoomDataRef.current.room;
          if (room.players) {
            if (Array.isArray(room.players)) {
              pendingRoomDataRef.current.room.players = room.players.filter(p => p.id !== playerId);
            } else if (room.players instanceof Map) {
              room.players.delete(playerId);
            } else {
              delete room.players[playerId];
            }
            console.log('ðŸ“¦ Removed player from buffered pendingRoomData:', playerName);
          }
        }

        return updated;
      });

      showPlayerLeaveNotification(playerName, currentRoomRef.current?.name || 'Room');

      try {
        removePartyMember(playerId);
        import('../../../store/partyStore').then(({ default: usePartyStore }) => {
          const { removePartyMember: removeFromStore } = usePartyStore.getState();
          removeFromStore(playerId);
        }).catch(() => {});
      } catch (error) {
        console.error('Error removing party member:', error);
      }

      removeUser(playerId);

      addNotification('social', {
        sender: { name: 'System', class: 'system', level: 0 },
        content: `${playerName} left the room`,
        type: 'system',
        timestamp: new Date().toISOString()
      });
    });

    socket.on('room_closed', (data) => {
      // CRITICAL FIX: Properly handle room closure with navigation
      handleLeaveRoom();

      // Navigate to landing page after cleanup
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 200);
    });

    socket.on('gm_disconnected', (data) => {
      if (!isGMRef.current) {
        showGMDisconnectedNotification(data.gmName || 'Unknown');

        addNotification('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: `Game Master ${data.gmName || 'Unknown'} has disconnected. Returning to landing page...`,
          type: 'system',
          timestamp: new Date().toISOString()
        });

        handleLeaveRoom();

        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1500);
      }
    });

    socket.on('gm_reconnected', (data) => {
      if (!isGMRef.current) {
        addNotification('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: `Game Master ${data.gmName || 'Unknown'} has reconnected.`,
          type: 'system',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Handle being kicked/removed from room
    socket.on('player_kicked', (data) => {
      // CRITICAL FIX: Properly handle player kick with navigation
      handleLeaveRoom();

      // Navigate to landing page after cleanup
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 200);
    });

    // Handle room access revoked
    socket.on('access_revoked', (data) => {
      // CRITICAL FIX: Properly handle access revocation with navigation
      handleLeaveRoom();

      // Navigate to landing page after cleanup
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 200);
    });

    return () => {
      socket.off('room_joined');
      socket.off('room_created');
      socket.off('player_joined');
      socket.off('player_left');
      socket.off('room_closed');
      socket.off('gm_disconnected');
      socket.off('gm_reconnected');
      socket.off('player_kicked');
      socket.off('access_revoked');
    };
}
