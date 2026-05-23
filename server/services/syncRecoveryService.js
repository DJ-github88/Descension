const { applyPatch, createPatch } = require('fast-json-patch');
const objectHash = require('object-hash');
const logger = require('./logger');

const MAX_BUFFER_SIZE = 500;

class SyncRecoveryService {
  constructor() {
    // roomId -> { sequenceId: number, buffer: Array<{ sequenceId: number, patch: any, action: any }> }
    this.rooms = new Map();
  }

  initializeRoom(roomId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, { sequenceId: 0, buffer: [] });
    }
  }

  recordAction(roomId, action, previousState, newState) {
    this.initializeRoom(roomId);
    const room = this.rooms.get(roomId);
    
    room.sequenceId++;
    const currentSequenceId = room.sequenceId;

    let patch = null;
    if (previousState && newState) {
        patch = createPatch(previousState, newState);
    }

    room.buffer.push({ sequenceId: currentSequenceId, action, patch });

    if (room.buffer.length > MAX_BUFFER_SIZE) {
      room.buffer.shift();
    }

    return currentSequenceId;
  }

  getCurrentSequenceId(roomId) {
    const room = this.rooms.get(roomId);
    return room ? room.sequenceId : 0;
  }

  computeChecksum(state) {
    // We compute checksum on the critical stores only, or entire state if needed
    return objectHash(state || {}, { algorithm: 'md5', unorderedArrays: true });
  }

  handleReconnect(roomId, clientSequenceId, clientChecksum, currentState) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return { type: 'full_sync', state: currentState, sequenceId: 0 };
    }

    // Check if client is up to date
    if (clientSequenceId === room.sequenceId) {
       const serverChecksum = this.computeChecksum(currentState);
       if (serverChecksum === clientChecksum) {
           return { type: 'in_sync', sequenceId: room.sequenceId };
       }
    }

    // Check if client is within buffer range
    if (room.buffer.length > 0) {
      const oldestSeq = room.buffer[0].sequenceId;
      if (clientSequenceId >= oldestSeq - 1 && clientSequenceId < room.sequenceId) {
        // Return accumulated patches
        const startIndex = room.buffer.findIndex(b => b.sequenceId === clientSequenceId + 1);
        if (startIndex !== -1) {
            const missedActions = room.buffer.slice(startIndex);
            // Combine patches or just send full state if patch creation failed
            if (missedActions.every(m => m.patch)) {
                 const combinedPatches = missedActions.flatMap(m => m.patch);
                 return { type: 'delta_sync', patches: combinedPatches, sequenceId: room.sequenceId };
            }
        }
      }
    }

    // Fallback to full sync
    return { type: 'full_sync', state: currentState, sequenceId: room.sequenceId };
  }

  cleanupRoom(roomId) {
    this.rooms.delete(roomId);
  }
}

module.exports = new SyncRecoveryService();
