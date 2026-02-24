import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { processCreatureLoot, processCreaturesLoot } from '../utils/lootItemUtils';
import { createStorageConfig } from '../utils/storageUtils';

// CRITICAL FIX: Track recent token movements to prevent server echo-induced position resets
// This prevents tokens from jumping back to old positions when server broadcasts
// Map: playerId -> { tokenId, position, timestamp }
// Unified: using window.recentTokenMovements to share tracking across stores
if (!window.recentTokenMovements) {
  window.recentTokenMovements = new Map();
}
const recentTokenMovements = window.recentTokenMovements;

// Echo Prevention Window - standardized across all stores
const ECHO_PREVENTION_WINDOW_MS = 200;

// Use character token store
const useCharacterTokenStore = create(
  persist(
    (set, get) => ({
      // Character tokens on the grid
      characterTokens: [],

      // Add a character token to the grid
      addCharacterToken: (position, playerId = null, targetMapId = null, sendToServer = true) => {
        let tokenId = null;
        let isNewToken = false;

        // CRITICAL: Get current mapId IMMEDIATELY if not provided - ensures proper map isolation
        // CRITICAL FIX: Check map switching lock to prevent race conditions during map transitions
        let resolvedMapId;
        if (targetMapId) {
          resolvedMapId = targetMapId;
        } else {
          try {
            const mapStore = require('./mapStore').default;
            const mapStoreState = mapStore.getState();
            // CRITICAL FIX: If map is switching, delay token placement to prevent cross-map contamination
            if (mapStoreState && window._isMapSwitching) {
              console.warn('🔒 [characterTokenStore] Map switch in progress, delaying token placement');
              // Return null to indicate placement should be retried after switch completes
              return {
                characterTokens: get().characterTokens,
                _mapSwitchDelay: true,
                _retryAfterMap: targetMapId
              };
            }
            resolvedMapId = mapStoreState.currentMapId || 'default';
          } catch (error) {
            console.warn('Could not get current map ID for token placement:', error);
            resolvedMapId = 'default';
          }
        }

        // 1. Update state (calculate if new or existing)
        set(state => {
          // Check if a character token already exists for this player
          const existingToken = state.characterTokens.find(t =>
            playerId ? t.playerId === playerId : t.isPlayerToken
          );

          if (existingToken) {
            tokenId = existingToken.id;
            return {
              characterTokens: state.characterTokens.map(token =>
                token.id === existingToken.id ? { ...token, position, mapId: token.mapId || resolvedMapId } : token
              )
            };
          }

          // Create a new character token with mapId for proper isolation
          // CRITICAL: Initialize token state for consistency with creature tokens
          const newToken = {
            id: uuidv4(),
            isPlayerToken: !playerId,
            playerId: playerId,
            position,
            mapId: resolvedMapId,
            createdAt: Date.now(),
            state: {
              // Token-level state for conditions and unified resource access
              // Actual resources are stored in character store, but we maintain
              // this state structure for consistency with creature tokens
              conditions: [],
              lastModified: new Date().toISOString()
            }
          };
          tokenId = newToken.id;
          isNewToken = true;
          return { characterTokens: [...state.characterTokens, newToken] };
        });

        // 2. Run side effects (after state update)
        if (!tokenId) return;

        // Standardized tracking to prevent server echo-induced position resets
        if (!window.recentTokenMovements) {
          window.recentTokenMovements = new Map();
        }
        const now = Date.now();
        window.recentTokenMovements.set(`token_${tokenId}`, {
          tokenKey: tokenId,
          position: { x: position.x, y: position.y },
          timestamp: now,
          isLocal: true
        });

        // Also track by playerId for cases where server uses playerId instead of tokenId
        if (playerId) {
          window.recentTokenMovements.set(`token_${playerId}`, {
            tokenKey: playerId,
            position: { x: position.x, y: position.y },
            timestamp: now,
            isLocal: true
          });
        }

          // 🎯 CONDITIONALLY SWITCH TO PLAYER VIEW WHEN CHARACTER TOKEN IS PLACED
          Promise.all([
            import('../store/gameStore'),
            import('../store/levelEditorStore'),
            import('../store/partyStore')
          ]).then(([{ default: useGameStore }, { default: useLevelEditorStore }, { default: usePartyStore }]) => {
            const gameStore = useGameStore.getState();
            const levelEditorStore = useLevelEditorStore.getState();
            const partyStore = usePartyStore.getState();

            // CRITICAL FIX: Use isPartyLeader() function instead of direct comparison
            // This properly handles all leader identification methods (Firebase UID, socket ID, etc.)
            const isLeader = partyStore.isPartyLeader();

          if (!isLeader) {
            console.log('👤 Player placed token, switching to player mode');
            gameStore.setGMMode(false);
          } else {
            console.log('👑 Leader placed token, maintaining GM mode');
          }

          // Only auto-enable view from token if GM has configured it
          if (gameStore.defaultViewFromToken) {
            levelEditorStore.playerViewFromTokenDisabled = false;
            levelEditorStore.setViewingFromToken({
              id: tokenId,
              type: 'character',
              characterId: playerId || 'local_player',
              position: position
            });
          } else if (isNewToken) {
            levelEditorStore.setViewingFromToken(null);
          }
        }).catch(error => {
          console.error('Failed to setup player view:', error);
        });

        // Send to multiplayer server if enabled and sendToServer is true
        if (sendToServer) {
          import('./gameStore').then(({ default: useGameStore }) => {
            const gameStore = useGameStore.getState();
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
              // Get the token we just created to include its mapId
              const token = get().characterTokens.find(t => t.id === tokenId);
              gameStore.multiplayerSocket.emit('character_token_created', {
                playerId: playerId || 'local_player',
                tokenId: tokenId,
                position: position,
                targetMapId: token?.mapId || 'default' // CRITICAL: Include mapId for proper isolation
              });
              console.log('📤 Character token placement synced to server:', tokenId, 'on map:', token?.mapId);
            }
          }).catch(error => {
            console.error('Failed to import gameStore for character token sync:', error);
          });
        }
      },

      // Update character token position (by player ID for multiplayer sync)
      updateCharacterTokenPosition: (playerIdOrTokenId, position) => set(state => {
        // Find existing token for comparison
        const existingToken = state.characterTokens.find(token =>
          token.id === playerIdOrTokenId || token.playerId === playerIdOrTokenId
        );

        const targetPos = position?.x !== undefined ? position : position;
        const isSyncEvent = !!position?.isSyncEvent;
        const now = Date.now();
        const recentMoveKey = `token_${playerIdOrTokenId}`;

        // Ensure global tracking Map exists
        if (!window.recentTokenMovements) {
          window.recentTokenMovements = new Map();
        }
        const recentTokenMovements = window.recentTokenMovements;
        const recentMove = recentTokenMovements.get(recentMoveKey);

        // If this is a local movement (not from server), track it as authoritative for a short time
        if (!isSyncEvent) {
          recentTokenMovements.set(recentMoveKey, {
            tokenKey: playerIdOrTokenId,
            position: { x: targetPos.x, y: targetPos.y },
            timestamp: now,
            isLocal: true
          });
        }

        // If we recently moved this token locally, ignore any server updates for it for a short grace period
        if (isSyncEvent && recentMove && recentMove.isLocal && (now - recentMove.timestamp) < ECHO_PREVENTION_WINDOW_MS) {
          const isSamePosition =
            Math.round(recentMove.position.x) === Math.round(targetPos.x) &&
            Math.round(recentMove.position.y) === Math.round(targetPos.y);

          if (isSamePosition) {
            return state;
          }

          // Local movement is still authoritative
          console.log(`🚫 Ignoring conflicting server movement for ${playerIdOrTokenId} - local movement is authoritative`);
          return state;
        }

        // Clean position object for store storage
        const finalPos = { x: targetPos.x, y: targetPos.y };

        const updatedTokens = state.characterTokens.map(token =>
          token.id === playerIdOrTokenId || token.playerId === playerIdOrTokenId
            ? { ...token, position: finalPos }
            : token
        );

        console.log(`🔷 Character token ${playerIdOrTokenId} moved to`, finalPos);
        return { characterTokens: updatedTokens };
      }),

      // Update character token state (for conditions, etc.)
      updateCharacterTokenState: (tokenId, stateUpdates, sendToServer = true) => set(state => {
        const updatedTokens = state.characterTokens.map(token =>
          token.id === tokenId
            ? {
              ...token,
              state: {
                ...token.state,
                ...stateUpdates,
                lastModified: new Date().toISOString()
              }
            }
            : token
        );

        // Send state updates to server if requested
        if (sendToServer) {
          // Import game store dynamically to avoid circular dependencies
          import('./gameStore').then(({ default: useGameStore }) => {
            const gameStore = useGameStore.getState();
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
              gameStore.multiplayerSocket.emit('character_token_updated', {
                tokenId,
                stateUpdates
              });
            }
          }).catch(error => {
            console.error('Failed to import gameStore for character token state update:', error);
          });
        }

        return { characterTokens: updatedTokens };
      }),

      // Remove a character token
      removeCharacterToken: (tokenId, sendToServer = true) => set(state => {
        // Sync with Multiplayer server if enabled
        if (sendToServer) {
          import('./gameStore').then(({ default: useGameStore }) => {
            const gameStore = useGameStore.getState();
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket?.connected) {
              console.log('📤 Emitting character_token_removed:', { tokenId });
              gameStore.multiplayerSocket.emit('character_token_removed', { tokenId });
            }
          }).catch(error => {
            console.error('Failed to import gameStore for character token removal:', error);
          });
        }

        return {
          characterTokens: state.characterTokens.filter(token => token.id !== tokenId)
        };
      }),

      // Clear all character tokens
      clearCharacterTokens: () => set({ characterTokens: [] }),

      // Get character token by ID
      getCharacterToken: (tokenId) => {
        const state = get();
        return state.characterTokens.find(token => token.id === tokenId);
      },

      // Get the current player's character token
      getPlayerToken: () => {
        const state = get();
        // Standard check for local player token
        // In multiplayer, a token might have isPlayerToken=false but be assigned to the local player's ID
        return state.characterTokens.find(token =>
          token.isPlayerToken ||
          token.playerId === 'local_player' ||
          (token.playerId && window.currentPlayerId && token.playerId === window.currentPlayerId)
        );
      },

      // Get unified token resources (combines token state with character store)
      getTokenResources: (tokenId) => {
        const state = get();
        const token = state.characterTokens.find(t => t.id === tokenId);
        if (!token) return null;

        // For character tokens, resources are in the character store
        // but we return a consistent structure for unified access
        return {
          token,
          // The actual resources are fetched from characterStore externally
          // This helper is for token identification only
        };
      },


      // Add character token from server (for multiplayer sync)
      addCharacterTokenFromServer: (tokenId, position, playerId, mapId = null) => set(state => {
        // Find character token to update
        const existingToken = state.characterTokens.find(token => token.id === tokenId);

        // Standardized tracking key
        const recentMoveKey = `token_${tokenId}`;
        const now = Date.now();

        if (!window.recentTokenMovements) {
          window.recentTokenMovements = new Map();
        }
        const recentTokenMovements = window.recentTokenMovements;
        const recentMove = recentTokenMovements.get(recentMoveKey);

        if (recentMove && recentMove.isLocal && (now - recentMove.timestamp) < 500) {
          console.log(`🚫 Ignoring stale character token position update for ${tokenId} (${now - recentMove.timestamp}ms old - local is authoritative)`);
          return state;
        }

        // Track this movement to prevent future echoes
        recentTokenMovements.set(recentMoveKey, {
          tokenKey: tokenId,
          position,
          timestamp: now
        });

        // Update existing token or create new one with mapId for proper isolation
        const updatedTokens = existingToken
          ? state.characterTokens.map(token =>
            token.id === tokenId ? { ...token, position, mapId: mapId || token.mapId } : token
          )
          : [
            ...state.characterTokens,
            {
              id: tokenId,
              isPlayerToken: false, // FIXED: Server tokens are NOT local player's token
              playerId: playerId,
              position,
              mapId: mapId || 'default', // CRITICAL: Include mapId for proper isolation
              createdAt: Date.now(),
              // CRITICAL: Initialize state for consistency with creature tokens
              state: {
                conditions: [],
                lastModified: new Date().toISOString()
              }
            }
          ];

        return { characterTokens: updatedTokens };
      }),

      // CRITICAL: Load character token quietly (no sync) - used for map switches
      loadCharacterToken: (tokenData) => {
        if (!tokenData) return;
        set(state => {
          const tokenId = tokenData.id || `char_token_${Date.now()}`;
          const existingTokenIndex = state.characterTokens.findIndex(t => t.id === tokenId);

          if (existingTokenIndex !== -1) return state;

          const newToken = {
            ...tokenData,
            id: tokenId,
            position: tokenData.position || { x: 0, y: 0 },
            // CRITICAL: Ensure state exists for consistency with creature tokens
            state: tokenData.state || {
              conditions: [],
              lastModified: new Date().toISOString()
            }
          };

          return { characterTokens: [...state.characterTokens, newToken] };
        });
      },

      // Clean up expired conditions from all character tokens
      cleanupExpiredConditions: () => set(state => {
        // CRITICAL FIX: Guard against undefined state
        if (!state || !state.characterTokens) {
          console.warn('⚠️ characterTokenStore state is undefined in cleanupExpiredConditions');
          return state || { characterTokens: [] };
        }

        const currentTime = Date.now();
        let hasChanges = false;

        const updatedTokens = state.characterTokens.map(token => {
          if (!token.state?.conditions || token.state.conditions.length === 0) {
            return token;
          }

          const validConditions = token.state.conditions.filter(condition => {
            // If no duration info, keep as permanent condition
            if (!condition.duration && !condition.durationType) {
              return true;
            }

            // Round-based conditions are handled by combat store when turns end
            if (condition.durationType === 'rounds') {
              // Check if remainingRounds exists and is > 0
              const remainingRounds = condition.remainingRounds ?? condition.durationValue;
              return remainingRounds > 0;
            }

            // Time-based conditions: check if appliedAt + duration has passed
            if (condition.appliedAt && condition.duration) {
              const endTime = condition.appliedAt + condition.duration;
              return endTime > currentTime;
            }

            // If we can't determine expiration, keep it
            return true;
          });

          // Check if any condition changed
          if (validConditions.length !== token.state.conditions.length) {
            hasChanges = true;
            return {
              ...token,
              state: {
                ...token.state,
                conditions: validConditions
              }
            };
          }

          return token;
        });

        if (hasChanges) {
          return { characterTokens: updatedTokens };
        }

        return state;
      }),

      setWindowSize: (size) => {
        set({ windowSize: size });
      }
    }),
    createStorageConfig('character-token-store')
  )
);

// Note: Initialization is now handled by initCharacterTokenStore.js to avoid duplicates
// This prevents race conditions and multiple initialization calls

// Expose store for debugging
if (typeof window !== 'undefined') {
  window.characterTokenStore = useCharacterTokenStore;
}

export default useCharacterTokenStore;

