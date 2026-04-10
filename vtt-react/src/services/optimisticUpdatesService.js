// Optimistic Updates Service
// Handles optimistic UI updates with conflict resolution to prevent lag and position jumps
// CRITICAL: Prevents server echo from causing token jumps and ensures smooth multiplayer experience

class OptimisticUpdatesService {
  constructor() {
    this.pendingUpdates = new Map();

    this.confirmedUpdates = new Map();

    this.serverTimestamps = new Map();

    this.CLEANUP_INTERVAL = 60000;

    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, this.CLEANUP_INTERVAL);
  }

  registerUpdate(type, data, rollbackFn) {
    const actionId = `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const now = Date.now();

    this.pendingUpdates.set(actionId, {
      type,
      data,
      timestamp: now,
      resolved: false,
      rollbackFn: typeof rollbackFn === 'function' ? rollbackFn : null
    });

    console.log(`🚀 Registered optimistic update: ${actionId}`);
    return actionId;
  }

  optimisticTokenMove(tokenId, position, sendCallback, rollbackFn) {
    const actionId = this.registerUpdate('token_move', { tokenId, position }, rollbackFn);

    if (typeof sendCallback === 'function') {
      sendCallback(actionId);
    }

    return actionId;
  }

  resolveUpdate(actionId, confirmationData) {
    const pending = this.pendingUpdates.get(actionId);

    if (!pending) {
      console.warn(` No pending update found for actionId: ${actionId}`);
      return false;
    }

    const timeSincePending = Date.now() - pending.timestamp;

    const confirmed = this.confirmedUpdates.get(actionId);
    if (confirmed) {
      const confirmedTime = confirmed.timestamp;
      const timeSinceConfirmed = Date.now() - confirmedTime;

      if (timeSincePending > timeSinceConfirmed) {
        console.log(`í Stale optimistic update, ignoring: ${actionId}`, {
          pendingTime: pending.timestamp,
          confirmedTime: confirmed.timestamp,
          ageDiff: timeSincePending - timeSinceConfirmed
        });
        if (pending.rollbackFn) {
          pending.rollbackFn();
        }
        this.pendingUpdates.delete(actionId);
        return false;
      }
    }

    this.applyOptimisticUpdate(pending.type, pending.data, confirmationData);

    this.confirmedUpdates.set(actionId, {
      type: pending.type,
      data: confirmationData || pending.data,
      timestamp: Date.now()
    });

    this.pendingUpdates.delete(actionId);

    console.log(` Resolved optimistic update: ${actionId}`);
    return true;
  }

  applyOptimisticUpdate(type, updateData, confirmationData) {
    console.log(`= Applying optimistic update: ${type}`, updateData);

    const event = new CustomEvent('optimistic_update_resolved', {
      detail: {
        type,
        data: updateData,
        confirmationData
      }
    });

    window.dispatchEvent(event);
  }

  rollbackUpdate(actionId) {
    const pending = this.pendingUpdates.get(actionId);

    if (!pending) {
      console.warn(`No pending update found to rollback: ${actionId}`);
      return false;
    }

    if (pending.rollbackFn) {
      console.log(`↩ Rolling back optimistic update: ${actionId}`);
      pending.rollbackFn();
    } else {
      console.warn(`No rollbackFn provided for update: ${actionId}`);
    }

    this.pendingUpdates.delete(actionId);

    const event = new CustomEvent('optimistic_update_rolled_back', {
      detail: {
        actionId,
        type: pending.type,
        data: pending.data
      }
    });

    window.dispatchEvent(event);

    return true;
  }

  isUpdatePending(actionId) {
    return this.pendingUpdates.has(actionId) && !this.pendingUpdates.get(actionId)?.resolved;
  }

  cleanup() {
    const now = Date.now();
    const STALE_THRESHOLD = 30000;

    for (const [actionId, update] of this.pendingUpdates.entries()) {
      const age = now - update.timestamp;

      if (age > STALE_THRESHOLD) {
        console.warn(`=Ñ Cleaning up stale optimistic update: ${actionId} (${age}ms old)`);
        if (update.rollbackFn) {
          console.log(`↩ Rolling back stale optimistic update: ${actionId}`);
          update.rollbackFn();
        }
        this.pendingUpdates.delete(actionId);

        const confirmed = this.confirmedUpdates.get(actionId);
        if (confirmed && (now - confirmed.timestamp) > STALE_THRESHOLD) {
          this.confirmedUpdates.delete(actionId);
        }
      }
    }

    for (const [actionId, timestamp] of this.serverTimestamps.entries()) {
      if (now - timestamp > STALE_THRESHOLD) {
        this.serverTimestamps.delete(actionId);
      }
    }
  }

  getPendingUpdates() {
    return Array.from(this.pendingUpdates.entries()).map(([actionId, update]) => ({
      actionId,
      type: update.type,
      data: update.data,
      age: Date.now() - update.timestamp
    }));
  }
}

const optimisticUpdatesService = new OptimisticUpdatesService();

export default optimisticUpdatesService;
