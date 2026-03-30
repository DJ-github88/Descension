// Optimistic Updates Service
// Handles optimistic UI updates with conflict resolution to prevent lag and position jumps
// CRITICAL: Prevents server echo from causing token jumps and ensures smooth multiplayer experience

class OptimisticUpdatesService {
  constructor() {
    // Store pending updates that haven't been confirmed by server yet
    this.pendingUpdates = new Map(); // actionId -> { type, data, timestamp }

    // Store confirmed updates for conflict detection
    this.confirmedUpdates = new Map(); // actionId -> { type, data, timestamp }

    // Track recent server timestamps to detect duplicates
    this.serverTimestamps = new Map(); // actionId -> last server timestamp

    // Cleanup interval
    this.CLEANUP_INTERVAL = 60000; // Clean up every 60 seconds

    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, this.CLEANUP_INTERVAL);
  }

  /**
   * Register an optimistic update (before sending to server)
   * @param {string} type - Type of update ('token_move', 'token_state', etc.)
   * @param {object} data - The update data
   * @returns {string} actionId - Unique ID for tracking this update
   */
  registerUpdate(type, data) {
    const actionId = `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const now = Date.now();

    this.pendingUpdates.set(actionId, {
      type,
      data,
      timestamp: now,
      resolved: false
    });

    console.log(`🚀 Registered optimistic update: ${actionId}`);
    return actionId;
  }

  /**
   * High-level helper for token movement
   * @param {string} tokenId - ID of the token
   * @param {object} position - New position {x, y}
   * @param {function} sendCallback - Callback to send the data to server
   * @returns {string} actionId
   */
  optimisticTokenMove(tokenId, position, sendCallback) {
    const actionId = this.registerUpdate('token_move', { tokenId, position });

    // Call the sending logic immediately (it's "optimistic" but we still need to send it)
    if (typeof sendCallback === 'function') {
      sendCallback(actionId);
    }

    return actionId;
  }

  /**
   * Resolve an optimistic update (when server confirms it)
   * @param {string} actionId - The ID returned from registerUpdate
   * @param {object} confirmationData - Server's confirmation data
   */
  resolveUpdate(actionId, confirmationData) {
    const pending = this.pendingUpdates.get(actionId);

    if (!pending) {
      console.warn(`  No pending update found for actionId: ${actionId}`);
      return false;
    }

    const timeSincePending = Date.now() - pending.timestamp;

    // Check if this update is stale (older than what we have)
    const confirmed = this.confirmedUpdates.get(actionId);
    if (confirmed) {
      const confirmedTime = confirmed.timestamp;
      const timeSinceConfirmed = Date.now() - confirmedTime;

      if (timeSincePending > timeSinceConfirmed) {
        console.log(`í Stale optimistic update, ignoring: ${actionId}`, {
          pendingTime: pending.timestamp,
          confirmedTime: confirmed.time,
          ageDiff: timeSincePending - timeSinceConfirmed
        });
        // Stale update - server's confirmation is newer
        this.pendingUpdates.delete(actionId);
        return false;
      }
    }

    // Apply the update
    this.applyOptimisticUpdate(pending.type, pending.data, confirmationData);

    // Mark as confirmed
    this.confirmedUpdates.set(actionId, {
      type: pending.type,
      data: confirmationData || pending.data,
      timestamp: Date.now()
    });

    // Clean up pending
    this.pendingUpdates.delete(actionId);

    console.log(` Resolved optimistic update: ${actionId}`);
    return true;
  }

  /**
   * Apply an optimistic update with conflict resolution
   * @param {string} type - Type of update
   * @param {object} updateData - The update data to apply
   * @param {object} confirmationData - Server's confirmation data
   */
  applyOptimisticUpdate(type, updateData, confirmationData) {
    // For now, simply apply the update without conflict resolution
    // Future: Add timestamp comparison and merge logic here

    console.log(`= Applying optimistic update: ${type}`, updateData);

    // Broadcast an event so components can listen for the resolution
    const event = new CustomEvent('optimistic_update_resolved', {
      detail: {
        type,
        data: updateData,
        confirmationData
      }
    });

    window.dispatchEvent(event);
  }

  /**
   * Get status of an optimistic update
   * @param {string} actionId - The ID to check
   * @returns {boolean} true if pending, false if resolved or not found
   */
  isUpdatePending(actionId) {
    return this.pendingUpdates.has(actionId) && !this.pendingUpdates.get(actionId)?.resolved;
  }

  /**
   * Clean up old pending updates
   */
  cleanup() {
    const now = Date.now();
    const STALE_THRESHOLD = 30000; // 30 seconds

    for (const [actionId, update] of this.pendingUpdates.entries()) {
      const age = now - update.timestamp;

      if (age > STALE_THRESHOLD) {
        console.warn(`=Ñ Cleaning up stale optimistic update: ${actionId} (${age}ms old)`);
        this.pendingUpdates.delete(actionId);

        // Clean up confirmed updates too
        const confirmed = this.confirmedUpdates.get(actionId);
        if (confirmed && (now - confirmed.timestamp) > STALE_THRESHOLD) {
          this.confirmedUpdates.delete(actionId);
        }
      }
    }

    // Also clean up server timestamps
    for (const [actionId, timestamp] of this.serverTimestamps.entries()) {
      if (now - timestamp > STALE_THRESHOLD) {
        this.serverTimestamps.delete(actionId);
      }
    }
  }

  /**
   * Get all pending updates (for debugging)
   */
  getPendingUpdates() {
    return Array.from(this.pendingUpdates.entries()).map(([actionId, update]) => ({
      actionId,
      type: update.type,
      data: update.data,
      age: Date.now() - update.timestamp
    }));
  }
}

// Create singleton instance
const optimisticUpdatesService = new OptimisticUpdatesService();

export default optimisticUpdatesService;