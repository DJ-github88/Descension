/**
 * Optimistic Updates Service
 *
 * Provides immediate UI feedback for user actions, with automatic reconciliation
 * when server responses arrive. Reduces perceived latency and improves UX.
 */

import useCreatureStore from '../store/creatureStore';
import useCharacterStore from '../store/characterStore';
import useGameStore from '../store/gameStore';

class OptimisticUpdatesService {
  constructor() {
    this.pendingUpdates = new Map(); // actionId -> { type, data, timeout, rollback }
    this.updateCounter = 0;
    this.maxPendingTime = 5000; // 5 seconds max for pending updates
  }

  /**
   * Generate unique action ID
   */
  generateActionId() {
    return `opt_${Date.now()}_${++this.updateCounter}`;
  }

  /**
   * Apply optimistic update for token position
   */
  optimisticTokenMove(tokenId, newPosition, serverCallback) {
    const actionId = this.generateActionId();

    // Store original position for rollback
    const creatureStore = useCreatureStore.getState();
    const token = creatureStore.tokens.find(t => t.id === tokenId);
    const originalPosition = token ? { ...token.position } : null;

    if (!originalPosition) {
      console.warn('Cannot create optimistic update: token not found', tokenId);
      return null;
    }

    // Apply immediate update
    creatureStore.updateTokenPosition(tokenId, newPosition);

    // Create pending update entry
    const pendingUpdate = {
      type: 'token_move',
      data: { tokenId, newPosition, originalPosition },
      timestamp: Date.now(),
      rollback: () => {
        creatureStore.updateTokenPosition(tokenId, originalPosition);
      },
      resolve: (serverResponse) => {
        // Server confirmed - remove from pending
        this.pendingUpdates.delete(actionId);

        // If server position differs, apply server correction smoothly
        if (serverResponse && serverResponse.position) {
          const serverPos = serverResponse.position;
          if (Math.abs(serverPos.x - newPosition.x) > 1 || Math.abs(serverPos.y - newPosition.y) > 1) {
            // Small correction - apply immediately
            creatureStore.updateTokenPosition(tokenId, serverPos);
          }
        }
      }
    };

    this.pendingUpdates.set(actionId, pendingUpdate);

    // Set timeout for rollback if no server response
    setTimeout(() => {
      const update = this.pendingUpdates.get(actionId);
      if (update) {
        console.warn('Optimistic update timeout - rolling back', actionId);
        update.rollback();
        this.pendingUpdates.delete(actionId);
      }
    }, this.maxPendingTime);

    // Call server callback with actionId for tracking
    if (serverCallback) {
      serverCallback(actionId);
    }

    return actionId;
  }

  /**
   * Apply optimistic update for character stats
   */
  optimisticCharacterUpdate(characterId, updates, serverCallback) {
    const actionId = this.generateActionId();

    // Store original values for rollback
    const characterStore = useCharacterStore.getState();
    const originalValues = {};

    // Extract current values for rollback
    Object.keys(updates).forEach(key => {
      if (key.includes('.')) {
        // Handle nested properties like 'stats.agility'
        const [parent, child] = key.split('.');
        if (!originalValues[parent]) originalValues[parent] = {};
        originalValues[parent][child] = characterStore[parent]?.[child];
      } else {
        originalValues[key] = characterStore[key];
      }
    });

    // Apply immediate update
    characterStore.updateCharacterInfo(updates);

    // Create pending update entry
    const pendingUpdate = {
      type: 'character_update',
      data: { characterId, updates, originalValues },
      timestamp: Date.now(),
      rollback: () => {
        characterStore.updateCharacterInfo(originalValues);
      },
      resolve: (serverResponse) => {
        this.pendingUpdates.delete(actionId);
        // Server confirmed - no additional action needed
      }
    };

    this.pendingUpdates.set(actionId, pendingUpdate);

    // Set timeout for rollback
    setTimeout(() => {
      const update = this.pendingUpdates.get(actionId);
      if (update) {
        console.warn('Character optimistic update timeout - rolling back', actionId);
        update.rollback();
        this.pendingUpdates.delete(actionId);
      }
    }, this.maxPendingTime);

    if (serverCallback) {
      serverCallback(actionId);
    }

    return actionId;
  }

  /**
   * Resolve pending update with server confirmation
   */
  resolveUpdate(actionId, serverResponse = null) {
    const update = this.pendingUpdates.get(actionId);
    if (update) {
      update.resolve(serverResponse);
    }
  }

  /**
   * Reject pending update (force rollback)
   */
  rejectUpdate(actionId) {
    const update = this.pendingUpdates.get(actionId);
    if (update) {
      console.warn('Rejecting optimistic update', actionId);
      update.rollback();
      this.pendingUpdates.delete(actionId);
    }
  }

  /**
   * Get pending updates count
   */
  getPendingCount() {
    return this.pendingUpdates.size;
  }

  /**
   * Get all pending updates (for debugging)
   */
  getPendingUpdates() {
    return Array.from(this.pendingUpdates.entries()).map(([id, update]) => ({
      id,
      type: update.type,
      timestamp: update.timestamp,
      age: Date.now() - update.timestamp
    }));
  }

  /**
   * Clear all pending updates (force rollback all)
   */
  clearAllPending() {
    console.warn('Clearing all pending optimistic updates');
    for (const [actionId, update] of this.pendingUpdates) {
      update.rollback();
    }
    this.pendingUpdates.clear();
  }

  /**
   * Clean up old pending updates
   */
  cleanup(maxAge = 10000) {
    const now = Date.now();
    for (const [actionId, update] of this.pendingUpdates) {
      if (now - update.timestamp > maxAge) {
        console.warn('Cleaning up stale optimistic update', actionId);
        update.rollback();
        this.pendingUpdates.delete(actionId);
      }
    }
  }
}

// Create singleton instance
const optimisticUpdatesService = new OptimisticUpdatesService();

// Auto-cleanup every 30 seconds
setInterval(() => {
  optimisticUpdatesService.cleanup();
}, 30000);

export default optimisticUpdatesService;
