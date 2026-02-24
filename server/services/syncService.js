/**
 * Sync Service Module
 * 
 * Contains services for efficient state synchronization:
 * - FirebaseBatchWriter: Batches Firebase writes to reduce quota usage
 * - MovementDebouncer: Debounces token movement updates
 */

const logger = require('../services/logger');
const firebaseService = require('../services/firebaseService');

/**
 * Firebase Write Batching Service
 * Prevents quota exhaustion by batching writes
 */
class FirebaseBatchWriter {
  constructor(flushInterval = 500, maxBatchSize = 50) {
    this.pendingWrites = new Map();
    this.flushInterval = flushInterval;
    this.maxBatchSize = maxBatchSize;
    this.batchInterval = null;
    this.startBatchProcessor();
  }

  /**
   * Queue a write to be batched
   * @param {string} roomId - Room ID
   * @param {Object} gameState - Game state to write
   */
  queueWrite(roomId, gameState) {
    this.pendingWrites.set(roomId, {
      gameState: { ...gameState },
      timestamp: Date.now()
    });

    // Flush immediately if batch is full
    if (this.pendingWrites.size >= this.maxBatchSize) {
      this.flush();
    }
  }

  /**
   * Flush all pending writes to Firebase
   */
  async flush() {
    if (this.pendingWrites.size === 0) return;

    const writesToProcess = Array.from(this.pendingWrites.entries());
    this.pendingWrites.clear();

    const writePromises = writesToProcess.map(async ([roomId, data]) => {
      try {
        await firebaseService.updateRoomGameState(roomId, data.gameState);
        logger.debug(`Batched write completed for room ${roomId}`);
      } catch (error) {
        logger.error(`Batched write failed for room ${roomId}:`, error);
      }
    });

    await Promise.allSettled(writePromises);
  }

  /**
   * Start periodic batch processor
   */
  startBatchProcessor() {
    this.batchInterval = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  /**
   * Stop batch processor and flush remaining writes
   */
  stop() {
    if (this.batchInterval) {
      clearInterval(this.batchInterval);
      this.batchInterval = null;
    }
    this.flush(); // Final flush
  }
}

/**
 * Movement Debouncing Service
 * Reduces network spam during token drags
 */
class MovementDebouncer {
  constructor(debounceMs = 50) {
    this.pendingMoves = new Map(); // roomId_tokenId -> {position, velocity, timestamp, playerId}
    this.debounceMs = debounceMs;
    this.flushInterval = null;
    this.flushCallback = null;
    this.startDebouncer();
  }

  /**
   * Queue a movement update
   * @param {string} roomId - Room ID
   * @param {string} tokenId - Token ID
   * @param {Object} moveData - Movement data {position, velocity, playerId, mapId}
   */
  queueMove(roomId, tokenId, moveData) {
    const key = `${roomId}_${tokenId}`;
    this.pendingMoves.set(key, {
      roomId,
      tokenId,
      ...moveData,
      timestamp: Date.now()
    });
  }

  /**
   * Flush all pending movements
   * @param {Object} io - Socket.io server instance
   * @param {Map} rooms - Rooms map
   * @param {Map} players - Players map
   */
  flush(io, rooms, players) {
    if (this.pendingMoves.size === 0) return;

    const movesToProcess = Array.from(this.pendingMoves.values());
    this.pendingMoves.clear();

    movesToProcess.forEach(move => {
      const room = rooms.get(move.roomId);
      if (!room) return;

      // Update room state
      if (!room.gameState.tokens) {
        room.gameState.tokens = {};
      }

      const existingToken = room.gameState.tokens[move.tokenId];
      if (existingToken) {
        room.gameState.tokens[move.tokenId] = {
          ...existingToken,
          position: move.position,
          velocity: move.velocity,
          lastMoved: Date.now()
        };

        // Also update map-specific token if available
        const mapId = move.mapId || room.gameState.defaultMapId || 'default';
        if (room.gameState.maps && room.gameState.maps[mapId]) {
          if (!room.gameState.maps[mapId].tokens) {
            room.gameState.maps[mapId].tokens = {};
          }
          room.gameState.maps[mapId].tokens[move.tokenId] = {
            ...existingToken,
            position: move.position,
            velocity: move.velocity,
            lastMoved: Date.now()
          };
        }

        // Broadcast movement to room (except sender)
        const player = players.get(move.playerId);
        if (player) {
          io.to(move.roomId).emit('token_moved', {
            tokenId: move.tokenId,
            position: move.position,
            velocity: move.velocity,
            mapId: move.mapId,
            movedBy: move.playerId,
            timestamp: Date.now()
          });
        }
      }
    });
  }

  /**
   * Start debouncer interval
   */
  startDebouncer() {
    this.flushInterval = setInterval(() => {
      if (this.flushCallback) {
        this.flushCallback();
      }
    }, this.debounceMs);
  }

  /**
   * Stop debouncer
   */
  stop() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }
}

/**
 * Event Sequence Tracker
 * Ensures event ordering across socket broadcasts
 */
let eventSequenceNumber = 0;

function getNextEventSequence() {
  return ++eventSequenceNumber;
}

function resetEventSequence() {
  eventSequenceNumber = 0;
}

/**
 * Create service instances
 * @param {Object} io - Socket.io server instance
 * @param {Map} rooms - Rooms map
 * @param {Map} players - Players map
 * @returns {Object} Service instances
 */
function createSyncServices(io, rooms, players) {
  const firebaseBatchWriter = new FirebaseBatchWriter(500, 50);
  const movementDebouncer = new MovementDebouncer(50);

  // Set up movement debouncer flush callback
  movementDebouncer.flushCallback = () => {
    movementDebouncer.flush(io, rooms, players);
  };

  return {
    firebaseBatchWriter,
    movementDebouncer
  };
}

/**
 * Setup graceful shutdown handlers
 * @param {Object} services - Service instances
 */
function setupShutdownHandlers(services) {
  const gracefulShutdown = async () => {
    console.log('Shutting down gracefully...');
    
    if (services.firebaseBatchWriter) {
      await services.firebaseBatchWriter.flush();
      services.firebaseBatchWriter.stop();
    }
    
    if (services.movementDebouncer) {
      services.movementDebouncer.stop();
    }
    
    process.exit(0);
  };

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
}

module.exports = {
  FirebaseBatchWriter,
  MovementDebouncer,
  getNextEventSequence,
  resetEventSequence,
  createSyncServices,
  setupShutdownHandlers
};
