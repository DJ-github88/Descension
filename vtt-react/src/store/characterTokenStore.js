import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { processCreatureLoot, processCreaturesLoot } from '../utils/lootItemUtils';
import { createStorageConfig } from '../utils/storageUtils';

// CRITICAL FIX: Track recent token movements to prevent server echo-induced position resets
// This prevents tokens from jumping back to old positions when server broadcasts
// Map: playerId -> { tokenId, position, timestamp }
const recentTokenMovements = new Map();

// Use character token store
const useCharacterTokenStore = create(
  persist(
    (set, get) => ({
      // Character tokens on the grid
      characterTokens: [],

      // Add a character token to the grid
      addCharacterToken: (position, playerId = null, sendToServer = true) => set(state => {

        // In multiplayer, use playerId to make tokens unique per player
        // In single player, use isPlayerToken for backward compatibility
        const tokenIdentifier = playerId || 'local_player';

        // Check if a character token already exists for this player
        const existingToken = state.characterTokens.find(t =>
          playerId ? t.playerId === playerId : t.isPlayerToken
        );

        if (existingToken) {
          // If it exists and we're just dragging, update position only
          return {
            characterTokens: state.characterTokens.map(token =>
              token.id === existingToken.id ? { ...token, position } : token
            )
          };
        }

        // Create a new character token
        const newToken = {
          id: uuidv4(),
          isPlayerToken: !playerId, // Only true for local single-player tokens
          playerId: playerId, // Store player ID for multiplayer
          position,
          createdAt: Date.now()
        };

        // 🎯 CONDITIONALLY SWITCH TO PLAYER VIEW WHEN CHARACTER TOKEN IS PLACED
        // Only auto-enable if GM has set defaultViewFromToken to true
        Promise.all([
          import('../store/gameStore'),
          import('../store/levelEditorStore')
        ]).then(([{ default: useGameStore }, { default: useLevelEditorStore }]) => {
          const gameStore = useGameStore.getState();
          const levelEditorStore = useLevelEditorStore.getState();

          // Switch to player mode
          gameStore.setGMMode(false);

          // Only auto-enable view from token if GM has configured it
          if (gameStore.defaultViewFromToken) {
            // Reset the disabled flag when placing a new token (so auto-enable works)
            levelEditorStore.playerViewFromTokenDisabled = false;
            // Enable view from this character token
            levelEditorStore.setViewingFromToken({
              id: newToken.id,
              type: 'character',
              characterId: playerId || 'local_player',
              position: position // Include position for visibility calculations
            });
          } else {
            // Default behavior: don't auto-enable view from token
            // Player must manually select it if they want fog of war restrictions
            levelEditorStore.setViewingFromToken(null);
          }
        }).catch(error => {
          console.error('Failed to setup player view:', error);
        });

        // Send to multiplayer server if enabled and sendToServer is true
        if (sendToServer) {
          // Import game store dynamically to avoid circular dependencies
          import('./gameStore').then(({ default: useGameStore }) => {
            const gameStore = useGameStore.getState();
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
              gameStore.multiplayerSocket.emit('character_token_created', {
                playerId: playerId || 'local_player',
                tokenId: newToken.id,
                position: position
              });
            }
          }).catch(error => {
            console.error('Failed to import gameStore for character token sync:', error);
          });
        }

        return {
          characterTokens: [
            ...state.characterTokens,
            newToken
          ]
        };
      }),

      // Update character token position (by player ID for multiplayer sync)
      updateCharacterTokenPosition: (playerIdOrTokenId, position) => set(state => {
        // CRITICAL FIX: Ignore stale server echoes to prevent position jumps
        // Check if we recently moved this token (within last 100ms)
        const recentMoveKey = `token_${playerIdOrTokenId}`;
        const now = Date.now();

        if (!recentTokenMovements) {
          recentTokenMovements = new Map();
        }
        const recentMove = recentTokenMovements.get(recentMoveKey);

        if (recentMove && (now - recentMove.timestamp) < 100) {
          console.log(`🚫 Ignoring stale character token position update for ${playerIdOrTokenId} (${now - recentMove.timestamp}ms old)`);
          return;
        }

        // Track this movement to prevent future echoes
        recentTokenMovements.set(recentMoveKey, {
          tokenKey: playerIdOrTokenId,
          position,
          timestamp: now
        });

        const updatedTokens = state.characterTokens.map(token =>
          token.id === playerIdOrTokenId || token.playerId === playerId
            ? { ...token, position }
            : token
        );

        console.log(`🔷 Character token ${playerIdOrTokenId} moved to`, position);
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
      removeCharacterToken: (tokenId) => set(state => ({
        characterTokens: state.characterTokens.filter(token => token.id !== tokenId)
      })),

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
        return state.characterTokens.find(token => token.isPlayerToken);
      },

      // Update character token state (for conditions, etc.)


      // Add character token from server (for multiplayer sync)
      addCharacterTokenFromServer: (tokenId, position, playerId) => set(state => {
        // Find the character token to update
        const existingToken = state.characterTokens.find(token => token.id === tokenId);

        // CRITICAL FIX: Ignore stale server echoes to prevent position jumps
        // Check if we recently moved this token (within last 100ms)
        const recentMoveKey = `token_${tokenId}`;
        const now = Date.now();

        if (!recentTokenMovements) {
          recentTokenMovements = new Map();
        }
        const recentMove = recentTokenMovements.get(recentMoveKey);

        if (recentMove && (now - recentMove.timestamp) < 100) {
          console.log(`🚫 Ignoring stale character token position update for ${tokenId} (${now - recentMove.timestamp}ms old)`);
          return state;
        }

        // Track this movement to prevent future echoes
        recentTokenMovements.set(recentMoveKey, {
          tokenKey: tokenId,
          position,
          timestamp: now
        });

        // Update existing token or create new one
        const updatedTokens = existingToken
          ? state.characterTokens.map(token =>
            token.id === tokenId ? { ...token, position } : token
          )
          : [
            ...state.characterTokens,
            {
              id: tokenId,
              isPlayerToken: true, // Server tokens are not local player tokens
              playerId: playerId,
              position,
              createdAt: Date.now()
            }
          ];

        return { characterTokens: updatedTokens };
      }),

      // Clean up expired conditions from all character tokens
      cleanupExpiredConditions: () => set(state => {
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