// CRITICAL FIX: Track recent token movements to prevent server echo-induced position resets
// This prevents tokens from jumping back to old positions when server broadcasts position back to all players
// Initialize tracking in window scope to prevent duplicates across store instances
if (typeof window !== 'undefined') {
  if (!window.recentTokenMovements) {
    window.recentTokenMovements = new Map();
  }
}

import { create } from 'zustand';
import { processCreatureLoot, processCreaturesLoot } from '../utils/lootItemUtils';

// Global recent token movements tracking (window scope for echo prevention)
// Fallback to new Map if window is not defined (SSR compatibility)
const recentTokenMovements = (typeof window !== 'undefined' && window.recentTokenMovements) || new Map();

// Cleanup throttle - only clean up old movements every 10 seconds
const CLEANUP_INTERVAL = 10000;
let lastCleanup = Date.now();

const useCreatureStore = create((set, get) => ({
  // Creature tokens on the grid
  creatureTokens: [],

  // ALIASES for compatibility with older code/components
  tokens: [], // Alias for creatureTokens
  creatures: [], // For library reference

  // Window state for Creature Library
  windowPosition: null,
  windowSize: { width: 900, height: 650 },

  // Library Management
  setCreatures: (creatures) => set({ creatures }),

  addCreature: (creature) => set(state => ({
    creatures: [...state.creatures, {
      ...creature,
      id: creature.id || `creature_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString()
    }]
  })),

  // Add creature token to the grid
  addCreatureToken: (creature, position, sendToServer = true) => {
    // If creature is an ID string, we'll need to find its full data
    const creatureId = typeof creature === 'string' ? creature : creature.id;
    const libraryCreatures = get().creatures || [];
    const creatureData = typeof creature === 'object' ? creature : (libraryCreatures.find(c => c.id === creatureId) || { id: creatureId });

    set(state => {
      // For adding from library, we ALWAYS want a unique token ID
      // If we're updating an existing token, we should use updateCreaturePosition
      // But addCreatureToken is sometimes called with an existing token object
      const tokenId = (typeof creature === 'object' && creature.tokenId)
        ? creature.tokenId
        : `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Track this movement to prevent echo-induced position resets
      const now = Date.now();
      const moveKey = `creature_${tokenId}`;

      // Clean up old movements periodically
      if (now - lastCleanup > CLEANUP_INTERVAL) {
        const cutoff = now - CLEANUP_INTERVAL;
        for (const [key, data] of recentTokenMovements.entries()) {
          if (data.timestamp && data.timestamp < cutoff) {
            recentTokenMovements.delete(key);
          }
        }
        lastCleanup = now;
      }

      // Track this movement
      recentTokenMovements.set(moveKey, {
        position: position,
        timestamp: now,
        velocity: creatureData.velocity || { x: 0, y: 0 }
      });

      if (sendToServer) {
        // Import game store dynamically to avoid circular dependencies
        try {
          const gameStore = require('./gameStore').default;

          if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
            // CRITICAL FIX: Include full creature data for multiplayer sync
            // Other clients need the complete creature info to render the token
            const tokenSyncData = {
              id: tokenId,
              creatureId: creatureId,
              position: position,
              velocity: creatureData.velocity || { x: 0, y: 0 },
              state: creatureData.state, // Include state if available
              creature: creatureData // Include full creature data for receiving clients
            };

            console.log('📤 Sending creature_added to server:', {
              creatureName: creatureData.name,
              tokenId: tokenId,
              creatureId: creatureId,
              position: { x: Math.round(position.x), y: Math.round(position.y) }
            });

            gameStore.multiplayerSocket.emit('creature_added', tokenSyncData);
          }
        } catch (e) {
          console.warn('GameStore not available for multiplayer sync');
        }
      }

      // Initialize state for new token
      const initialState = creatureData.state || {
        currentHp: creatureData.stats?.currentHp || creatureData.stats?.maxHp || 35,
        currentMana: creatureData.stats?.currentMana || creatureData.stats?.maxMana || 0,
        currentActionPoints: creatureData.stats?.currentActionPoints || creatureData.stats?.maxActionPoints || 2,
        conditions: creatureData.state?.conditions || [],
        hiddenFromPlayers: creatureData.state?.hiddenFromPlayers || false,
        customIcon: creatureData.state?.customIcon || null,
        iconScale: creatureData.state?.iconScale || 100,
        iconPosition: creatureData.state?.iconPosition || { x: 50, y: 50 }
      };

      const newToken = {
        ...creatureData,
        id: tokenId,
        creatureId: creatureId,
        position,
        state: initialState,
        addedAt: Date.now()
      };

      const updatedTokens = [...(state.creatureTokens || []), newToken];

      return {
        creatureTokens: updatedTokens,
        tokens: updatedTokens // Keep alias in sync
      };
    });
  },

  // Alias for addCreatureToken
  addToken: (creature, position, sendToServer = true) => {
    get().addCreatureToken(creature, position, sendToServer);
  },

  // Update creature token position
  updateTokenPosition: (tokenId, position, velocity = null) => {
    get().updateCreaturePosition(tokenId, position, velocity);
  },

  // Update creature token position
  updateCreaturePosition: (tokenId, position, velocity = null) => set(state => {
    const now = Date.now();
    const moveKey = `creature_${tokenId}`;

    // Check if this is a server echo (received within 100ms of local movement)
    const existingMove = recentTokenMovements.get(moveKey);
    const shouldIgnore = existingMove && (now - existingMove.timestamp) < 100;

    if (!shouldIgnore) {
      // Track this server update for echo prevention
      recentTokenMovements.set(moveKey, {
        position: position,
        velocity: velocity || { x: 0, y: 0 },
        timestamp: now
      });

      // Update token in array
      const updatedTokens = (state.creatureTokens || []).map(token =>
        token.id === tokenId ? { ...token, position } : token
      );

      return {
        creatureTokens: updatedTokens,
        tokens: updatedTokens // Keep alias in sync
      };
    }
  }),

  // Remove creature token from grid
  removeCreatureToken: (tokenId) => set(state => {
    const updatedTokens = (state.creatureTokens || []).filter(token => token.id !== tokenId);

    // Clear movement tracking for this token
    recentTokenMovements.delete(`creature_${tokenId}`);

    return {
      creatureTokens: updatedTokens,
      tokens: updatedTokens // Keep alias in sync
    };
  }),

  // Alias for removeCreatureToken
  removeToken: (tokenId) => {
    get().removeCreatureToken(tokenId);
  },

  // Duplicate a token
  duplicateToken: (tokenId) => {
    const token = get().creatureTokens.find(t => t.id === tokenId);
    if (!token) return;

    // Offset slightly for the new token
    const newPosition = {
      x: token.position.x + 20,
      y: token.position.y + 20
    };

    // Use regular addCreatureToken to add the duplicate
    get().addCreatureToken({
      ...token,
      tokenId: undefined, // Let it generate a new one
      id: token.creatureId // Use original creatureId as the base
    }, newPosition);
  },

  // Window management actions
  setWindowPosition: (position) => set({ windowPosition: position }),
  setWindowSize: (size) => set({ windowSize: size }),

  // Update creature state (HP, Mana, conditions)
  updateTokenState: (tokenId, stateUpdates) => {
    get().updateCreatureState(tokenId, stateUpdates);
  },

  // Update creature state (HP, Mana, conditions)
  updateCreatureState: (tokenId, stateUpdates) => set(state => {
    const updatedTokens = (state.creatureTokens || []).map(token =>
      token.id === tokenId ? { ...token, state: { ...token.state, ...stateUpdates } } : token
    );

    // Import game store dynamically to broadcast to other players
    try {
      const gameStore = require('./gameStore').default;
      if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
        gameStore.multiplayerSocket.emit('creature_updated', {
          tokenId,
          stateUpdates
        });
      }
    } catch (error) {
      console.warn('Could not broadcast creature state update:', error);
    }

    return {
      creatureTokens: updatedTokens,
      tokens: updatedTokens // Keep alias in sync
    };
  }),

  // Process loot item (creature death rewards)
  processCreatureLoot: (tokenId, lootData) => set(state => {
    const lootItems = processCreatureLoot(lootData);

    const updatedTokens = (state.creatureTokens || []).map(token =>
      token.id === tokenId ? { ...token, loot: lootItems } : token
    );

    return {
      creatureTokens: updatedTokens,
      tokens: updatedTokens // Keep alias in sync
    };
  }),

  // Clean up expired conditions from all creature tokens
  cleanupExpiredConditions: () => set(state => {
    const currentTime = Date.now();
    let hasChanges = false;

    const updatedTokens = (state.creatureTokens || []).map(token => {
      if (!token.state?.conditions || token.state.conditions.length === 0) {
        return token;
      }

      const validConditions = token.state.conditions.filter(condition => {
        // Round-based conditions: check remaining rounds
        if (condition.durationType === 'rounds') {
          const remainingRounds = condition.remainingRounds ?? condition.durationValue;
          return remainingRounds > 0;
        }

        // Time-based conditions: check if appliedAt + duration has passed
        if (condition.appliedAt && condition.duration) {
          const endTime = condition.appliedAt + condition.duration;
          return endTime > currentTime;
        }

        return true;
      });

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
      return {
        creatureTokens: updatedTokens,
        tokens: updatedTokens
      };
    }
    return state;
  }),

  // Clear all creature tokens
  clearCreatureTokens: () => set({
    creatureTokens: [],
    tokens: []
  }),

  // Get creature token by ID
  getCreatureToken: (tokenId) => {
    const state = get();
    return (state.creatureTokens || []).find(token => token.id === tokenId);
  }
}));

export default useCreatureStore;
// Creature types and sizes
export const CREATURE_TYPES = {
  ABERRATION: 'aberration',
  BEAST: 'beast',
  CELESTIAL: 'celestial',
  CONSTRUCT: 'construct',
  DRAGON: 'dragon',
  ELEMENTAL: 'elemental',
  FEY: 'fey',
  FIEND: 'fiend',
  GIANT: 'giant',
  HUMANOID: 'humanoid',
  MONSTROSITY: 'monstrosity',
  OOZE: 'ooze',
  PLANT: 'plant',
  UNDEAD: 'undead'
};

export const CREATURE_SIZES = {
  TINY: 'tiny',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  HUGE: 'huge',
  GARGANTUAN: 'gargantuan'
};

export const getCreatureSizeMapping = (size) => {
  if (!size) return { width: 1, height: 1, scale: 1 };

  const sizeLower = size.toLowerCase();

  switch (sizeLower) {
    case 'tiny':
      return { width: 1, height: 1, scale: 0.7 };
    case 'small':
      return { width: 1, height: 1, scale: 0.85 };
    case 'medium':
      return { width: 1, height: 1, scale: 1 };
    case 'large':
      return { width: 2, height: 2, scale: 1 };
    case 'huge':
      return { width: 3, height: 3, scale: 1 };
    case 'gargantuan':
      return { width: 4, height: 4, scale: 1 };
    case 'colossal':
      return { width: 5, height: 5, scale: 1 };
    default:
      return { width: 1, height: 1, scale: 1 };
  }
};