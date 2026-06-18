import useTravelStore from '../../../store/travelStore';
import useMapStore from '../../../store/mapStore';
import useCreatureStore from '../../../store/creatureStore';
import useCharacterTokenStore from '../../../store/characterTokenStore';
import useGameStore from '../../../store/gameStore';
import useAuthStore from '../../../store/authStore';
import usePartyStore from '../../../store/partyStore';
import useChatStore from '../../../store/chatStore';

export function registerTokenHandlers(ctx) {
  const {
    socket, isGMRef, currentPlayerRef,
    removeToken, addCreature, addToken, updateCreatureTokenPosition,
    addNotification, setPendingControlOffer,
    tokenUpdateThrottleRef, updateBatchRef, batchTimeoutRef,
    GM_THROTTLE_MS, PLAYER_THROTTLE_MS
  } = ctx;
    if (!socket) return;

    socket.on('character_token_created', (data) => {
      if (data && data.position) {
        // CRITICAL: Pass mapId for proper map isolation
        addCharacterTokenFromServer(data.tokenId, data.position, data.playerId, data.mapId);
      }
    });

    socket.on('request_travel_sync', () => {
      console.log('ðŸ—ºï¸ [Travel] GM received request_travel_sync, isGM:', isGMRef.current);
      if (isGMRef.current) {
        useTravelStore.getState().broadcastTravelState();
      }
    });

    socket.on('token_removed', (data) => {
      if (data && data.tokenId) {
        removeToken(data.tokenId, false); // false = don't send back to server
      }
    });

    socket.on('token_dismissed', (data) => {
      if (data && data.tokenId) {
        removeToken(data.tokenId, false);
      }
    });

    socket.on('character_token_removed', (data) => {
      if (data && data.tokenId) {
        removeCharacterToken(data.tokenId, false); // false = don't send back to server
      }
    });

    socket.on('token_moved', (data) => {
      // Enhanced debug logging for multiplayer sync testing
      const myRole = isGMRef.current ? 'GM' : 'Player';
      console.log(`ðŸ“¨ [${myRole}] Received token_moved:`, {
        tokenId: data.tokenId || data.id,
        creatureId: data.creatureId,
        position: data.position,
        isDragging: data.isDragging,
        fromPlayerId: data.playerId,
        isFromSelf: data.playerId === socket?.id
      });

      // CRITICAL FIX: Filter by mapId to prevent cross-map contamination
      const currentMapId = useMapStore.getState().currentMapId || 'default';
      const tokenMapId = data.mapId || data.token?.mapId || 'default';

      if (tokenMapId !== currentMapId) {
        console.log(`ðŸŽ­ Skipping token_moved - different map (token: ${tokenMapId}, current: ${currentMapId})`);
        return;
      }

      // Enhanced check to prevent processing our own movements with improved conflict detection
      const tokenId = data.tokenId || data.id;
      const creatureId = data.creatureId;
      const targetId = tokenId || creatureId;

      // CRITICAL FIX: Only skip if it's our own movement AND we're the one who moved it
      // Use tokenId for specific token tracking, fallback to creatureId
      const isDraggingOurToken = (window.multiplayerDragState && (
        window.multiplayerDragState.has(`token_${tokenId}`) ||
        window.multiplayerDragState.has(`token_${creatureId}`)
      ));

      const isOwnMovement = (data.playerId === socket?.id) && isDraggingOurToken;

      // Standardized tracking key
      const recentMovementKey = `token_${targetId}`;
      const recentMovementTime = window.recentTokenMovements?.get(recentMovementKey)?.timestamp;
      const hasRecentLocalMovement = recentMovementTime && (Date.now() - recentMovementTime) < 1000 &&
        data.playerId === socket?.id;

      // CRITICAL FIX: Resolve pending actionId BEFORE any early returns
      // to clear the optimistic update. 
      if (data.actionId) {
        optimisticUpdatesService.resolveUpdate(data.actionId, { position: data.position });
      }

      if (isOwnMovement || hasRecentLocalMovement) {
        return; // initiator doesn't need to re-update store from network
      }

      // CRITICAL FIX: Always update token position when receiving movement from server
      // This ensures GM moving player tokens shows the correct token moving
      // Smart throttling based on current player role
      const throttleKey = `${targetId}_${data.playerId}`;
      const now = Date.now();
      const lastUpdate = tokenUpdateThrottleRef.current.get(throttleKey) || 0;
      const throttleMs = isGMRef.current ? GM_THROTTLE_MS : PLAYER_THROTTLE_MS;

      if (now - lastUpdate >= throttleMs) {
        tokenUpdateThrottleRef.current.set(throttleKey, now);

        // Batch updates for better performance
        const updateData = {
          type: 'token',
          targetId: targetId || data.creatureId, // CRITICAL FIX: Use targetId (tokenId) first, fallback to creatureId
          position: data.position,
          timestamp: now
        };

        updateBatchRef.current.push(updateData);

        // Process batch after a short delay to group updates
        if (batchTimeoutRef.current) {
          clearTimeout(batchTimeoutRef.current);
        }

        batchTimeoutRef.current = setTimeout(() => {
          const batch = updateBatchRef.current.splice(0);
          if (batch.length > 0) {
            requestAnimationFrame(() => {
              batch.forEach(update => {
                if (update.type === 'token') {
                  // FIXED: Do NOT early return here. We resolved it above for the initiator, 
                  // but other players still need to process this movement update.
                  // The initiator's update to the store is handled locally during drag/drop.
                  if (data.playerId === socket?.id) {
                    return;
                  }

                  // CRITICAL FIX: Find token by unique token ID token OR creatureId in BOTH stores
                  const creatureStore = useCreatureStore.getState();
                  let token = creatureStore.tokens.find(t => t.id === update.targetId || t.creatureId === update.targetId);
                  let isCreature = true;

                  // If not found in creature store, check character token store
                  if (!token) {
                    try {
                      const charTokenStore = require('../../../store/characterTokenStore').default.getState();
                      token = charTokenStore.characterTokens.find(t => t.id === update.targetId);
                      isCreature = false;
                    } catch (e) {
                      console.warn('Could not check characterTokenStore:', e);
                    }
                  }

                  if (token) {
                    // CRITICAL FIX: Only update position if it's significantly different to prevent micro-jumps
                    const currentTokenPosition = token.position || { x: 0, y: 0 };

                    // Safety check for update.position
                    if (!update.position || update.position.x === undefined) {
                      console.warn('âš ï¸ Invalid position in movement update:', update.position);
                      return;
                    }

                    const distance = Math.sqrt(
                      Math.pow(update.position.x - currentTokenPosition.x, 2) +
                      Math.pow(update.position.y - currentTokenPosition.y, 2)
                    );

                    // CRITICAL FIX: Always update position when dragging starts or when distance is significant
                    const shouldUpdate = data.isDragging || distance > 1 || distance === 0;

                    if (shouldUpdate) {
                      const myRole = isGMRef.current ? 'GM' : 'Player';
                      console.log(`âœ… [${myRole}] Updating ${isCreature ? 'creature' : 'character'} token position:`, {
                        tokenId: token.id,
                        from: { x: Math.round(currentTokenPosition.x), y: Math.round(currentTokenPosition.y) },
                        to: { x: Math.round(update.position.x), y: Math.round(update.position.y) }
                      });

                      if (isCreature) {
                        updateCreatureTokenPosition(token.id, {
                          ...update.position,
                          isSyncEvent: true
                        });
                      } else {
                        // For character tokens, use their specialized update function
                        try {
                          const charTokenStore = require('../../../store/characterTokenStore').default.getState();
                          charTokenStore.addCharacterTokenFromServer(token.id, update.position, token.playerId, token.mapId);
                        } catch (e) {
                          console.warn('Failed to update character token position:', e);
                        }
                      }
                    }
                  } else {
                    console.warn('âš ï¸ Token not found for movement update:', {
                      targetId: update.targetId,
                      creatureId: data.creatureId,
                      tokenId: data.tokenId
                    });
                  }
                }
              });
            });
          }
        }, 5); // Reduced delay for maximum responsiveness
      }

      // Clean up throttle entry immediately when dragging stops
      if (!data.isDragging) {
        // Small delay to allow final position update, then clean up
        setTimeout(() => {
          tokenUpdateThrottleRef.current.delete(throttleKey);
        }, 100);
      }
    });

    socket.on('creature_updated', (data) => {
      const { tokenId, stateUpdates, updatedBy, mapId } = data;

      // Skip if we are the one who sent it
      if (updatedBy === socket?.id) return;

      const creatureStore = require('../../../store/creatureStore').default.getState();
      // Apply creature state update locally without re-emitting
      creatureStore.updateTokenState(tokenId, stateUpdates, false);
      console.log('ðŸ‰ Received creature_updated:', { tokenId, stateUpdates, mapId });
    });

    socket.on('token_updated', (data) => {
      const { tokenId, updates, stateUpdates, updatedBy, mapId } = data;

      // Skip if we are the one who sent it
      if (updatedBy === socket?.id) return;

      // Use either updates or stateUpdates (compatibility)
      const finalUpdates = updates || stateUpdates;
      if (!finalUpdates) return;

      const creatureStore = require('../../../store/creatureStore').default.getState();

      // Check if this token is a creature in our store
      const token = creatureStore.creatureTokens.find(t => t.id === tokenId);
      if (token) {
        // Apply creature state update locally without re-emitting
        creatureStore.updateTokenState(tokenId, finalUpdates, false);
        console.log('ðŸ‰ Received token_updated for creature:', { tokenId, finalUpdates, mapId });

        // NEW: Check if control was granted to the current player
        const myPlayerId = useGameStore.getState().currentPlayer?.id;
        const myUserId = useAuthStore.getState().user?.uid;
        const wasGrantedControl = (
          (finalUpdates.ownerId && (finalUpdates.ownerId === myPlayerId || finalUpdates.ownerId === myUserId)) ||
          (finalUpdates.playerId && (finalUpdates.playerId === myPlayerId || finalUpdates.playerId === myUserId))
        );

        if (wasGrantedControl) {
          console.log('ðŸ‘‘ [Control] You have been granted control of this token!');
          const tokenName = finalUpdates.controlledBy || token.state?.customName || token.name || 'a creature';
          addNotification('social', {
            type: 'system',
            content: `You have been granted control of ${tokenName}.`,
            sender: { name: 'System', class: 'system', level: 0 },
            timestamp: new Date().toISOString()
          });
          
          addNotification('combat', {
            type: 'system',
            content: `You have been granted control of ${tokenName}.`,
            sender: { name: 'System', class: 'system' },
            timestamp: new Date().toISOString()
          });

          const grantedBy = finalUpdates.controlledBy
            ? usePartyStore.getState().partyMembers.find(m => m.isGM)?.name || 'GM'
            : 'GM';
          setPendingControlOffer({
            tokenId,
            tokenName,
            offeredBy: grantedBy,
            targetPlayerName: useGameStore.getState().currentPlayer?.name || 'Adventurer'
          });
        }
      }
    });

    socket.on('creature_added', (data) => {
      const { id, creatureId, position, velocity, createdBy, createdByName, mapId, token, state } = data;

      // Skip if we are the one who added it (GM adding creature)
      if (createdBy === socket?.id) return;

      const creatureStore = require('../../../store/creatureStore').default.getState();

      // CRITICAL: Use included state to preserve token state across clients
      // If state is provided (new behavior), use it; otherwise fall back to library data
      let creatureData;
      if (token && state) {
        // Use the full token data from server including state
        creatureData = token;
      } else {
        // Fallback: Find creature data in library or use minimal data
        const libraryCreatures = creatureStore.creatures || [];
        creatureData = libraryCreatures.find(c => c.id === creatureId) || {
          id: creatureId,
          name: `Creature ${creatureId.substring(0, 8)}...`,
          isPlaceholder: true
        };
      }

      // Add creature token locally without re-emitting to server
      creatureStore.addCreatureToken(creatureData, position, false, id, true, mapId);
      console.log('ðŸ‰ Received creature_added:', { id, creatureId, position, mapId, hasState: !!state });
    });

    socket.on('character_moved', (data) => {
      // CRITICAL DEBUG: Log all received character_moved events with clear info
      // If tokenId is undefined here, the event won't update the correct token!
      console.log('ðŸ“¥ Received character_moved:', {
        tokenId: data.tokenId,        // Should be the token's UUID (e.g., "fbdd8929-...")
        characterId: data.characterId, // Should be the token owner's player ID
        playerId: data.playerId,       // Who moved the token (sender - could be GM)
        position: data.position,
        mySocketId: socket?.id,
        myPlayerId: currentPlayerRef.current?.id,
        hasTokenId: !!data.tokenId,    // Quick check - if false, we have a problem!
        hasCharacterId: !!data.characterId
      });

      // FIXED: Use tokenId or characterId consistently for character tokens
      const senderId = data.playerId;

      // CRITICAL FIX: When GM moves a player's token, we MUST have the tokenId to identify
      // which token to update. If both tokenId and characterId are undefined, 
      // log a warning and try alternate identification methods.
      let targetCharacterId = data.tokenId || data.characterId;

      if (!targetCharacterId) {
        // tokenId is missing! This is the bug case.
        // Log clearly so we know what data the server sent
        console.warn('âš ï¸ character_moved received WITHOUT tokenId or characterId!', {
          receivedData: data,
          hint: 'Check that CharacterToken.jsx emits tokenId and server.js relays data.tokenId'
        });

        // FALLBACK: Try to find any character token that might be the one being moved
        // When GM moves a player's token, we NEED to update the player's own token
        // So we look for any token near the new position
        const { characterTokens } = useCharacterTokenStore.getState();

        // Sort tokens by distance from the new position, pick the closest one
        // that isn't at the exact new position already (which would mean it's already updated)
        const sortedByDistance = (characterTokens || [])
          .map(token => {
            const dx = (token.position?.x || 0) - data.position.x;
            const dy = (token.position?.y || 0) - data.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return { token, distance };
          })
          .filter(({ distance }) => distance > 1) // Exclude tokens already at target position
          .sort((a, b) => a.distance - b.distance);

        const nearbyMatch = sortedByDistance[0];

        if (nearbyMatch && nearbyMatch.distance < 500) { // Within ~10 tiles
          targetCharacterId = nearbyMatch.token.id;
          console.log('ðŸ”§ FALLBACK: Found likely token by proximity:', {
            tokenId: nearbyMatch.token.id,
            playerId: nearbyMatch.token.playerId,
            isOwnToken: nearbyMatch.token.playerId === currentPlayerRef.current?.id,
            tokenPosition: nearbyMatch.token.position,
            newPosition: data.position,
            distance: Math.round(nearbyMatch.distance)
          });
        } else {
          // Last resort - use senderId but warn that this probably won't work
          targetCharacterId = senderId;
          console.warn('âŒ Could not identify target token! Using senderId as fallback (likely wrong):', {
            senderId,
            availableTokens: (characterTokens || []).map(t => ({ id: t.id, playerId: t.playerId }))
          });
        }
      }

      const isOwnMovement = senderId === socket?.id || (currentPlayerRef.current && senderId === currentPlayerRef.current.id);

      // CRITICAL FIX: Enhanced echo prevention - skip if:
      // 1. This is our own movement based on senderId/socket matching
      // 2. We are currently dragging this specific token
      // 3. We recently moved this specific tokenId locally (within 1000ms grace period)

      const isDraggingOurToken = window.multiplayerDragState?.has(`token_${targetCharacterId}`);
      const recentMovementKey = `token_${targetCharacterId}`;
      const recentMovementEntry = window.recentTokenMovements?.get(recentMovementKey);
      const recentMovementTime = recentMovementEntry?.timestamp;

      if (isOwnMovement || isDraggingOurToken) {
        if (isOwnMovement) console.log('ðŸš« Skipping character_moved - isOwnMovement:', { targetCharacterId });
        if (isDraggingOurToken) console.log('ðŸš« Skipping character_moved - currently dragging:', { targetCharacterId });
        return;
      }

      // CRITICAL FIX: Check if this token was recently moved locally (by any of our tokens)
      // This catches echoes that come back with different sender IDs
      if (recentMovementEntry && recentMovementEntry.isLocal && (Date.now() - (recentMovementTime || 0) < 1000)) {
        console.log('ðŸš« Skipping character_moved - recent local movement:', { recentMovementEntry });
        // Skip server echo for this token - we moved it locally recently
        return;
      }

      console.log('âœ… Processing character_moved - updating token:', {
        targetCharacterId,
        newPosition: data.position
      });

      // Throttle character token position updates
      const throttleKey = `character_${targetCharacterId}`;
      const now = Date.now();
      const lastUpdate = tokenUpdateThrottleRef.current.get(throttleKey) || 0;
      const throttleMs = data.isDragging ? 33 : 16;

      if (now - lastUpdate >= throttleMs || !data.isDragging) {
        tokenUpdateThrottleRef.current.set(throttleKey, now);

        try {
          const { updateCharacterTokenPosition, characterTokens } = useCharacterTokenStore.getState();

          // FIXED: Add isSyncEvent flag to prevent store from blocking this update as an "echo"
          const positionWithSync = {
            ...data.position,
            isSyncEvent: true
          };

          // Double-check: does a token with this ID exist?
          const tokenExists = (characterTokens || []).some(t =>
            t.id === targetCharacterId || t.playerId === targetCharacterId
          );

          if (!tokenExists) {
            console.warn('âš ï¸ Token not found in store! Update will fail:', {
              targetCharacterId,
              availableTokens: (characterTokens || []).map(t => ({ id: t.id, playerId: t.playerId }))
            });
          }

          updateCharacterTokenPosition(targetCharacterId, positionWithSync);
        } catch (error) {
          console.error('Failed to update character token position:', error);
        }
      }

      // Clean up throttle entry when dragging stops
      if (!data.isDragging) {
        setTimeout(() => {
          tokenUpdateThrottleRef.current.delete(throttleKey);
        }, 100);
      }
    });

    socket.on('token_created', (data) => {
      const myRole = isGMRef.current ? 'GM' : 'Player';
      console.log(`ðŸ“¨ [${myRole}] Received token_created:`, {
        creatureName: data.creature?.name,
        creatureId: data.creature?.id,
        tokenId: data.token?.id,
        position: data.position,
        fromPlayer: data.playerName,
        isSync: data.isSync,
        isFromSelf: data.playerId === socket?.id,
        tokenMapId: data.mapId
      });
      const isSync = data.isSync;
      const myPlayerId = socket?.id; // Use socket.id for reliable self-identification

      // CRITICAL FIX: Check if this is our own token creation being echoed back
      const isOwnTokenCreation = data.playerId === myPlayerId;

      if (isOwnTokenCreation && !isSync) {
        // This is our own token creation being echoed back by server
        // DON'T add it to the store again - we already added it when we created it
        console.log('ðŸ”„ Skipping duplicate token from own creation');
        return;
      }

      // CRITICAL FIX: Filter by current map - only add tokens on the same map
      const currentMapId = useMapStore.getState().currentMapId || 'default';
      const tokenMapId = data.mapId || data.token?.targetMapId || 'default';

      if (tokenMapId !== currentMapId) {
        console.log(`ðŸŽ­ Skipping token_created - different map (token: ${tokenMapId}, current: ${currentMapId})`);
        return;
      }

      // Only add token for sync events, and for new creations from other players
      if (data.token) {
        // First ensure that creature exists in the store
        const creatureData = data.creature || data.token.creature;
        if (creatureData) {
          addCreature(creatureData);
        }

        // Then add the token without sending back to server (avoid infinite loop)
        // CRITICAL FIX: Ensure position is robustly extracted from multiple sources
        const position = data.position || data.token?.position || data.token?.gridPosition || { x: 0, y: 0 };
        const tokenId = data.token.id || data.tokenId;
        const creatureId = data.creature?.id || data.token.creatureId;

        console.log(`ðŸ”· [${myRole}] Adding/Updating token: ${tokenId} at`, position);
        addToken(creatureData || creatureId, position, false, tokenId, data.token.state || true, tokenMapId);
      } else {
        console.warn('âš ï¸ Received token_created event without token data:', data);
      }

      // Show notification in chat only for new creations from other players, not syncs or own creations
      if (!isSync && data.playerId !== myPlayerId) {
        addNotification('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: `${data.playerName || 'Player'} placed ${data.creature?.name || data.character?.name || 'a token'} on the grid`,
          type: 'system',
          timestamp: new Date().toISOString()
        });
      }
    });

    socket.on('token_create_confirmed', (data) => {
      console.log('âœ… [Token Creation] Token confirmed by server:', {
        tokenId: data.token?.id,
        creatureName: data.creature?.name,
        success: data.success,
        position: data.position
      });

      if (!data.success) {
        addNotification('social', {
          sender: { name: 'System', class: 'system', level: 0 },
          content: 'Failed to save token to Firebase. Data may not persist.',
          type: 'system',
          timestamp: new Date().toISOString()
        });
      }
    });

    socket.on('token_control_granted', (data) => {
      const { tokenId, tokenName, targetPlayerId, targetPlayerSocketId, targetPlayerUserId, targetPlayerName, grantedByName } = data;

      // Determine if this client is the target using ALL available identifiers
      const mySocketId = socket?.id;
      const myUserId = useAuthStore.getState().user?.uid;
      const myServerId = useGameStore.getState().currentPlayer?.id;

      console.log('ðŸŽ¯ [token_control_granted] received â€“ checking if I am the target:', {
        targetPlayerId, targetPlayerSocketId, targetPlayerUserId,
        mySocketId, myUserId, myServerId
      });

      const isTarget =
        (targetPlayerSocketId && mySocketId && targetPlayerSocketId === mySocketId) ||
        (targetPlayerUserId  && myUserId   && targetPlayerUserId  === myUserId)    ||
        (targetPlayerId      && mySocketId && targetPlayerId       === mySocketId)  ||
        (targetPlayerId      && myUserId   && targetPlayerId       === myUserId)    ||
        (targetPlayerId      && myServerId && targetPlayerId       === myServerId);

      console.log('ðŸŽ¯ [token_control_granted] isTarget:', isTarget);

      if (isTarget) {
        setPendingControlOffer({
          tokenId,
          tokenName,
          offeredBy: grantedByName || 'GM',
          targetPlayerName: targetPlayerName || 'Adventurer'
        });
      }
    });

    socket.on('token_control_response', (data) => {
      const { tokenId, accepted, playerName } = data;
      // Only show if we are the GM
      if (isGMRef.current) {
        const addCombatNotification = useChatStore.getState().addCombatNotification;
        if (addCombatNotification) {
          addCombatNotification({
            type: 'system',
            content: accepted
              ? `âœ… ${playerName} accepted command of the creature`
              : `âŒ ${playerName} declined command of the creature`,
            timestamp: new Date().toISOString()
          });
        }
        // If declined, clear the ownerId on the token
        if (!accepted && tokenId) {
          useCreatureStore.getState().updateCreatureState(tokenId, {
            ownerId: null,
            playerId: null,
            controlledBy: null
          });
        }
      }
    });

  return () => {
    socket.off('character_token_created');
    socket.off('request_travel_sync');
    socket.off('token_removed');
    socket.off('token_dismissed');
    socket.off('character_token_removed');
    socket.off('token_moved');
    socket.off('creature_updated');
    socket.off('token_updated');
    socket.off('creature_added');
    socket.off('character_moved');
    socket.off('token_created');
    socket.off('token_create_confirmed');
    socket.off('token_control_granted');
    socket.off('token_control_response');
  };
}
