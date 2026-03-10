// CRITICAL FIX: Track recent token movements to prevent server echo-induced position resets
// This prevents tokens from jumping back to old positions when server broadcasts position back to all players
// Initialize tracking in window scope to prevent duplicates across store instances
if (typeof window !== 'undefined') {
  if (!window.recentTokenMovements) {
    window.recentTokenMovements = new Map();
  }
}

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import useGameStore from './gameStore';
import { processCreatureLoot, processCreaturesLoot } from '../utils/lootItemUtils';
import { normalizeTokenData } from '../utils/tokenStateUtils';

// Global recent token movements tracking (window scope for echo prevention)
// Fallback to new Map if window is not defined (SSR compatibility)
const recentTokenMovements = (typeof window !== 'undefined' && window.recentTokenMovements) || new Map();

// Echo Prevention Window - standardized across all stores
const ECHO_PREVENTION_WINDOW_MS = 200;

// Cleanup throttle - only clean up old movements every 10 seconds
const CLEANUP_INTERVAL = 10000;
let lastCleanup = Date.now();
// Helper to ensure position objects always have x and y
const normalizePosition = (pos, fallback = { x: 0, y: 0 }) => {
  if (!pos) return { x: fallback.x ?? 0, y: fallback.y ?? 0 };

  // Handle array format [x, y]
  if (Array.isArray(pos)) {
    return { x: pos[0] ?? fallback.x ?? 0, y: pos[1] ?? fallback.y ?? 0 };
  }

  // Handle object format - look for x/y in various common places
  const x = pos.x ?? pos.left ?? (pos.position ? pos.position.x : undefined);
  const y = pos.y ?? pos.top ?? (pos.position ? pos.position.y : undefined);

  // If we have both, return them. Otherwise, try to derive from gridPosition if available.
  if (x !== undefined && y !== undefined) {
    return { x, y, gridPosition: pos.gridPosition || fallback.gridPosition || null };
  }

  // Fallback to existing coordinates if available, otherwise 0
  return {
    x: x ?? fallback.x ?? 0,
    y: y ?? fallback.y ?? 0,
    gridPosition: pos.gridPosition || fallback.gridPosition || null
  };
};

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

  addCreature: (creature) => {
    if (!creature) {
      console.warn('⚠️ addCreature called with null or undefined creature data');
      return;
    }

    set(state => ({
      creatures: [...(state.creatures || []), {
        ...creature,
        id: creature.id || `creature_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }]
    }));
  },

  // Add creature token to the grid
  addCreatureToken: (creature, position, sendToServer = true, forcedTokenIdOrSync = null, isSyncEvent = false, targetMapId = null) => {
    // Handle overloaded arguments from addToken alias
    const forcedTokenId = typeof forcedTokenIdOrSync === 'string' ? forcedTokenIdOrSync : null;
    const forcedState = typeof forcedTokenIdOrSync === 'object' ? forcedTokenIdOrSync : (typeof isSyncEvent === 'object' ? isSyncEvent : null);

    // CRITICAL: isSync should be true if either isSyncEvent is true OR if it's an object (state from server)
    // AND p4 (forcedTokenIdOrSync) is a string (tokenId from server).
    const isSync = (typeof isSyncEvent === 'boolean' && isSyncEvent) ||
      (typeof forcedTokenIdOrSync === 'string' && isSyncEvent !== false) ||
      (typeof forcedTokenIdOrSync === 'boolean' && forcedTokenIdOrSync);

    // If creature is an ID string, we'll need to find its full data
    const creatureId = typeof creature === 'string' ? creature : (creature?.id || creature?.creatureId);

    // CRITICAL FIX: Robust position extraction to prevent 0,0 jumps
    const finalPosition = normalizePosition(position || (creature && typeof creature === 'object' ? creature.position : null));

    // Safety check: if we have no creature data or ID, we cannot add a token
    if (!creature && !creatureId) {
      console.error('❌ addCreatureToken: No creature data or ID provided');
      return;
    }

    const libraryCreatures = get().creatures || [];
    let creatureData = (creature && typeof creature === 'object') ? creature : (libraryCreatures.find(c => c.id === creatureId));

    // CRITICAL FIX: If creature data still not found, create a minimalist placeholder
    // This allows the token to at least be added to the grid with its ID
    if (!creatureData) {
      console.warn(`⚠️ addCreatureToken: Creature ${creatureId} not found in library, creating placeholder`);
      creatureData = {
        id: creatureId,
        name: `Creature ${creatureId.substring(0, 8)}...`,
        isPlaceholder: true
      };
    }

    const tokenId = forcedTokenId || (creatureData.tokenId) || `token-${uuidv4()}`;

    // CRITICAL: Capture current mapId IMMEDIATELY to prevent race conditions
    let capturedMapId = 'default';
    if (targetMapId) {
      capturedMapId = targetMapId;
    } else {
      try {
        const { default: mapStore } = require('./mapStore');
        capturedMapId = mapStore.getState().currentMapId || 'default';
      } catch (e) {
        console.warn('Could not capture current map ID:', e);
      }
    }

    // CRITICAL: Use normalizeTokenData for consistent state initialization
    // This ensures all tokens have proper state structure
    // MUST be computed BEFORE sync block (line 136) to avoid ReferenceError
    const normalizedCreature = normalizeTokenData(creatureData, 'creature');

    set((state) => {
      // Use captured mapId unless creature specifically defines one
      const currentMapId = creatureData.mapId || capturedMapId;

      const existingTokens = state.creatureTokens || [];
      const tokenExists = existingTokens.some(t => t.id === tokenId);

      if (tokenExists) {
        console.log('🔄 Token already exists, updating position/state instead of adding:', tokenId);
        const updatedTokens = state.creatureTokens.map(t =>
          t.id === tokenId
            ? { ...t, position: finalPosition, state: forcedState || t.state, mapId: currentMapId }
            : t
        );
        return {
          creatureTokens: updatedTokens,
          tokens: updatedTokens
        };
      }

      const moveKey = `token_${tokenId}`;
      const now = Date.now();

      // Ensure global tracking Map exists
      if (!window.recentTokenMovements) {
        window.recentTokenMovements = new Map();
      }
      const recentTokenMovements = window.recentTokenMovements;

      // FIXED: Throttle movement updates in store to prevent rapid re-renders
      const recentMove = recentTokenMovements.get(moveKey);
      if (recentMove && (now - recentMove.timestamp) < 50) {
        return state;
      }

      // Track this movement
      recentTokenMovements.set(moveKey, {
        position: finalPosition,
        timestamp: now,
        isLocal: !isSync,
        velocity: creatureData.velocity || { x: 0, y: 0 }
      });

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

      // Sync with Multiplayer server if enabled and not already a sync event
      if (sendToServer && !isSync) {
        try {
          const gameStore = useGameStore.getState();
          if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {

            // CRITICAL FIX: Include normalized state in token sync data
            // Use normalizedCreature.state to ensure state is properly initialized
            const tokenSyncData = {
              token: {
                id: tokenId,
                creatureId: creatureId,
                state: normalizedCreature.state, // CRITICAL FIX: Use normalized state
                mapId: currentMapId, // CRITICAL: Standard field name
                targetMapId: currentMapId // Keep for backward compatibility
              },
              creature: creatureData,
              position: finalPosition,
              tokenId: tokenId,
              mapId: currentMapId, // CRITICAL: Standard field name
              targetMapId: currentMapId // Include map ID for map isolation
            };

            gameStore.multiplayerSocket.emit('token_created', tokenSyncData);
          }
        } catch (e) {
          console.warn('GameStore not available for multiplayer sync or error during emit:', e);
        }
      }

      const newToken = {
        ...normalizedCreature,
        id: tokenId,
        creatureId: creatureId,
        position: finalPosition,
        state: forcedState || normalizedCreature.state,
        addedAt: Date.now(),
        mapId: currentMapId || 'default' // Add mapId for isolation
      };

      const updatedTokens = [...existingTokens, newToken];

      return {
        creatureTokens: updatedTokens,
        tokens: updatedTokens // Keep alias in sync
      };
    });
  },

  // Alias for addCreatureToken
  addToken: (creature, position, sendToServer = true, p4 = null, p5 = null, targetMapId = null) => {
    return get().addCreatureToken(creature, position, sendToServer, p4, p5, targetMapId);
  },

  // Update creature token position
  updateTokenPosition: (tokenId, position, velocity = null) => {
    get().updateCreaturePosition(tokenId, position, velocity);
  },

  // Update creature token position
  updateCreaturePosition: (tokenId, position, velocity = null) => set(state => {
    const isSyncEvent = !!position?.isSyncEvent;

    const currentTokens = state.creatureTokens || [];
    const existingToken = currentTokens.find(t => t.id === tokenId);

    if (!existingToken) return state;

    // CRITICAL: Normalize target position to ensure x/y exist
    const targetPos = normalizePosition(position, existingToken.position);

    const now = Date.now();
    const recentMoveKey = `token_${tokenId}`;

    if (!window.recentTokenMovements) window.recentTokenMovements = new Map();
    const recentTokenMovements = window.recentTokenMovements;
    const recentMove = recentTokenMovements.get(recentMoveKey);

    // If local movement, mark it as authoritative
    if (!isSyncEvent) {
      recentTokenMovements.set(recentMoveKey, {
        tokenKey: tokenId,
        position: targetPos,
        timestamp: now,
        isLocal: true
      });
    }

    // Ignore sync events if we have a recent local move
    if (isSyncEvent && recentMove && recentMove.isLocal && (now - recentMove.timestamp) < ECHO_PREVENTION_WINDOW_MS) {
      const isSamePos = Math.round(recentMove.position.x) === Math.round(targetPos.x) &&
        Math.round(recentMove.position.y) === Math.round(targetPos.y);
      if (isSamePos) return state;
      return state;
    }

    const finalPos = targetPos;

    const updated = currentTokens.map(t =>
      t.id === tokenId ? { ...t, position: finalPos, mapId: position?.mapId || t.mapId || 'default' } : t
    );

    return {
      creatureTokens: updated,
      tokens: updated
    };
  }),

  // Remove creature token from grid
  removeCreatureToken: (tokenId, sendToServer = true) => set(state => {
    const updatedTokens = (state.creatureTokens || []).filter(token => token.id !== tokenId);

    // Clear movement tracking for this token
    recentTokenMovements.delete(`creature_${tokenId}`);

    // Sync with Multiplayer server if enabled
    if (sendToServer) {
      try {
        const gameStore = require('./gameStore').default.getState();
        if (gameStore.isInMultiplayer && gameStore.multiplayerSocket?.connected) {
          console.log('📤 Emitting token_removed:', { tokenId });
          gameStore.multiplayerSocket.emit('token_removed', { tokenId });
        }
      } catch (error) {
        console.warn('Could not broadcast token removal:', error);
      }
    }

    return {
      creatureTokens: updatedTokens,
      tokens: updatedTokens // Keep alias in sync
    };
  }),

  // Alias for removeCreatureToken
  removeToken: (tokenId, sendToServer = true) => {
    get().removeCreatureToken(tokenId, sendToServer);
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
  updateTokenState: (tokenId, stateUpdates, sendToServer = true) => {
    get().updateCreatureState(tokenId, stateUpdates, sendToServer);
  },

  // Update creature state (HP, Mana, conditions)
  updateCreatureState: (tokenId, stateUpdates, sendToServer = true) => set(state => {
    const updatedTokens = (state.creatureTokens || []).map(token =>
      token.id === tokenId ? {
        ...token,
        // CRITICAL FIX: Deep merge state to preserve nested objects (like conditions array)
        state: {
          ...(token.state || {}),
          ...stateUpdates
        }
      } : token
    );

    // Import game store dynamically to broadcast to other players
    if (sendToServer) {
      try {
        const gameStore = require('./gameStore').default.getState();
        if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
          // CRITICAL FIX: Include current mapId for proper map isolation
          const mapStore = require('./mapStore');
          const currentMapId = mapStore.default.getState().currentMapId || 'default';

          // CRITICAL FIX: Emit BOTH for compatibility, but prefer token_updated for server-side persistence
          gameStore.multiplayerSocket.emit('token_updated', {
            tokenId,
            updates: stateUpdates, // server expects 'updates' key
            stateUpdates,         // fallback for older handlers
            mapId: currentMapId,
            updatedBy: gameStore.multiplayerSocket.id
          });

          gameStore.multiplayerSocket.emit('creature_updated', {
            tokenId,
            stateUpdates,
            mapId: currentMapId
          });
        }
      } catch (error) {
        console.warn('Could not broadcast creature state update:', error);
      }
    }

    return {
      creatureTokens: updatedTokens,
      tokens: updatedTokens // Keep alias in sync
    };
  }),

  // Update creature data (general purpose, used by shop etc.)
  updateCreature: (creatureId, updates) => set(state => {
    // Find the token to update
    const updatedTokens = (state.creatureTokens || []).map(token =>
      (token.id === creatureId || token.creatureId === creatureId) ? { ...token, ...updates } : token
    );

    // Broadcast update if in multiplayer
    try {
      const gameStore = useGameStore.getState();
      if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
        const mapStore = require('./mapStore');
        const currentMapId = mapStore.default.getState().currentMapId || 'default';

        // Send a general update event
        gameStore.multiplayerSocket.emit('token_updated', {
          tokenId: creatureId,
          updates: updates,
          mapId: currentMapId,
          updatedBy: gameStore.multiplayerSocket.id
        });

        gameStore.multiplayerSocket.emit('creature_updated', {
          tokenId: creatureId,
          updates: updates,
          stateUpdates: updates,
          mapId: currentMapId
        });
      }
    } catch (error) {
      console.warn('Could not broadcast creature update:', error);
    }

    return {
      creatureTokens: updatedTokens,
      tokens: updatedTokens
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
  },

  // CRITICAL: Load token quietly (no sync) - used for map switches and initial load
  loadToken: (tokenData) => {
    if (!tokenData) return;

    set(state => {
      const tokenId = tokenData.id || tokenData.tokenId || `token-${uuidv4()}`;
      const existingTokens = state.creatureTokens || [];
      const tokenMapId = tokenData.mapId || 'default';

      // CRITICAL FIX: Get current map ID to prevent cross-map contamination
      let currentMapId = 'default';
      try {
        const mapStoreModule = require('./mapStore');
        if (mapStoreModule && mapStoreModule.default) {
          currentMapId = mapStoreModule.default.getState().currentMapId || 'default';
        }
      } catch (error) {
        console.warn('Could not get current map ID for token loading:', error);
      }

      // CRITICAL FIX: Only load token if it belongs to current map
      if (tokenMapId !== currentMapId) {
        console.log(`🎭 Skipping token ${tokenId} - belongs to map ${tokenMapId}, but current map is ${currentMapId}`);
        return state;
      }

      // Don't add if already exists
      if (existingTokens.some(t => t.id === tokenId)) return state;

      // CRITICAL: Use normalizeTokenData for consistent state initialization
      const normalizedToken = normalizeTokenData(tokenData, 'creature');

      const newToken = {
        ...normalizedToken,
        id: tokenId,
        // Ensure positional data is correct
        position: normalizedToken.position || { x: 0, y: 0 },
        // Ensure mapId is preserved
        mapId: tokenMapId
      };

      const updatedTokens = [...existingTokens, newToken];

      return {
        creatureTokens: updatedTokens,
        tokens: updatedTokens
      };
    });
  },

  // Alias for clearCreatureTokens for better compatibility
  clearTokens: () => get().clearCreatureTokens()
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