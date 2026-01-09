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
const recentTokenMovements = window.recentTokenMovements || new Map();

// Cleanup throttle - only clean up old movements every 10 seconds
const CLEANUP_INTERVAL = 10000;
let lastCleanup = Date.now();

const useCreatureStore = create((set, get) => ({
  // Creature tokens on the grid
  creatureTokens: [],

  // Add creature token to the grid
  addCreatureToken: (creature, position, sendToServer = true) => set(state => {
    // Track this movement to prevent echo-induced position resets
    const now = Date.now();
    const moveKey = `creature_${creature.id}`;

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
      velocity: creature.velocity || { x: 0, y: 0 }
    });

    // Check if this is a recent local movement (within 100ms) to ignore server echo
    const existingMove = recentTokenMovements.get(`creature_${creature.id}`);
    const shouldIgnore = existingMove && (now - existingMove.timestamp) < 100;

    if (sendToServer && !shouldIgnore) {
      // Import game store dynamically to avoid circular dependencies
      const gameStore = require('./gameStore').default;

      if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
        // Include velocity for lag compensation
        const tokenData = {
          id: creature.id,
          creatureId: creature.id,
          position: position,
          velocity: creature.velocity || { x: 0, y: 0 }
        };

        gameStore.multiplayerSocket.emit('creature_added', tokenData);
      }
    }

    // Update creature tokens array
    const updatedTokens = state.creatureTokens.map(token =>
      token.id === creature.id ? { ...token, position } : token
    );

    return { creatureTokens: updatedTokens };
  }),

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
      const updatedTokens = state.creatureTokens.map(token =>
        token.id === tokenId ? { ...token, position } : token
      );

      return { creatureTokens: updatedTokens };
    }
  }),

  // Remove creature token from grid
  removeCreatureToken: (tokenId) => set(state => {
    const updatedTokens = state.creatureTokens.filter(token => token.id !== tokenId);

    // Clear movement tracking for this token
    recentTokenMovements.delete(`creature_${tokenId}`);

    return { creatureTokens: updatedTokens };
  }),

  // Update creature state (HP, Mana, conditions)
  updateCreatureState: (tokenId, stateUpdates) => set(state => {
    const updatedTokens = state.creatureTokens.map(token =>
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

    return { creatureTokens: updatedTokens };
  }),

  // Process loot item (creature death rewards)
  processCreatureLoot: (tokenId, lootData) => set(state => {
    const lootItems = processCreatureLoot(lootData);

    const updatedTokens = state.creatureTokens.map(token =>
      token.id === tokenId ? { ...token, loot: lootItems } : token
    );

    return { creatureTokens: updatedTokens };
  }),

  // Clear all creature tokens
  clearCreatureTokens: () => set({ creatureTokens: [] }),

  // Get creature token by ID
  getCreatureToken: (tokenId) => {
    const state = get();
    return state.creatureTokens.find(token => token.id === tokenId);
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
  if (!size) return { width: 1, height: 1 };

  const sizeLower = size.toLowerCase();

  switch (sizeLower) {
    case 'tiny':
    case 'small':
    case 'medium':
      return { width: 1, height: 1 };
    case 'large':
      return { width: 2, height: 2 };
    case 'huge':
      return { width: 3, height: 3 };
    case 'gargantuan':
      return { width: 4, height: 4 };
    case 'colossal':
      return { width: 5, height: 5 }; // Or larger depending on rules
    default:
      return { width: 1, height: 1 };
  }
};