/**
 * Memory Management & Cleanup Service
 * 
 * This module provides intelligent memory management by:
 * - Automatic cleanup for disconnected players
 * - Garbage collection for old game states
 * - Memory usage monitoring and alerts
 * - Resource leak detection and prevention
 */

const { v4: uuidv4 } = require('uuid');

class MemoryManager {
  constructor() {
    this.trackedObjects = new Map(); // objectId -> metadata
    this.roomMemoryUsage = new Map(); // roomId -> usage stats
    this.playerSessions = new Map(); // socketId -> session data
    this.cleanupTimers = new Map(); // objectId -> timer ID
    this.memoryThresholds = {
      warning: 100 * 1024 * 1024, // 100MB
      critical: 500 * 1024 * 1024, // 500MB
      emergency: 1024 * 1024 * 1024 // 1GB
    };
    
    // Configuration
    this.cleanupInterval = 30000; // 30 seconds
    this.sessionTimeout = 300000; // 5 minutes
    this.stateHistoryLimit = 100; // max states to keep
    this.memoryCheckInterval = 60000; // 1 minute

    this.startMonitoring();
    console.log('🧠 Memory Manager initialized');
  }

  /**
   * Start memory monitoring and cleanup
   */
  startMonitoring() {
    // Regular cleanup cycle
    setInterval(() => {
      this.performCleanupCycle();
    }, this.cleanupInterval);

    // Memory usage monitoring
    setInterval(() => {
      this.checkMemoryUsage();
    }, this.memoryCheckInterval);

    // Garbage collection hint
    setInterval(() => {
      if (global.gc) {
        global.gc();
        console.log('🗑️ Manual garbage collection triggered');
      }
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  /**
   * Track a new object for memory management
   */
  trackObject(objectId, type, data, roomId = null) {
    const metadata = {
      id: objectId,
      type: type,
      roomId: roomId,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      accessCount: 0,
      size: this.estimateObjectSize(data),
      data: data
    };

    this.trackedObjects.set(objectId, metadata);

    // Update room memory usage
    if (roomId) {
      this.updateRoomMemoryUsage(roomId, metadata.size, 'add');
    }

    console.log(`📊 Tracking object ${objectId} (${type}): ${metadata.size} bytes`);
    return metadata;
  }

  /**
   * Update object access information
   */
  accessObject(objectId) {
    const metadata = this.trackedObjects.get(objectId);
    if (metadata) {
      metadata.lastAccessed = Date.now();
      metadata.accessCount++;
      return metadata.data;
    }
    return null;
  }

  /**
   * Untrack an object
   */
  untrackObject(objectId) {
    const metadata = this.trackedObjects.get(objectId);
    if (metadata) {
      // Update room memory usage
      if (metadata.roomId) {
        this.updateRoomMemoryUsage(metadata.roomId, metadata.size, 'remove');
      }

      this.trackedObjects.delete(objectId);
      console.log(`🗑️ Untracked object ${objectId}: freed ${metadata.size} bytes`);
      return true;
    }
    return false;
  }

  /**
   * Track player session
   */
  trackPlayerSession(socketId, playerData, roomId) {
    const session = {
      socketId: socketId,
      playerId: playerData.id,
      playerName: playerData.name,
      roomId: roomId,
      connectedAt: Date.now(),
      lastActivity: Date.now(),
      isActive: true,
      memoryUsage: {
        gameState: 0,
        chatHistory: 0,
        tokenData: 0,
        total: 0
      }
    };

    this.playerSessions.set(socketId, session);
    console.log(`👤 Tracking player session: ${playerData.name} (${socketId})`);
    return session;
  }

  /**
   * Update player activity
   */
  updatePlayerActivity(socketId) {
    const session = this.playerSessions.get(socketId);
    if (session) {
      session.lastActivity = Date.now();
      session.isActive = true;
    }
  }

  /**
   * Mark player as disconnected
   */
  markPlayerDisconnected(socketId) {
    const session = this.playerSessions.get(socketId);
    if (session) {
      session.isActive = false;
      session.disconnectedAt = Date.now();
      
      // Schedule cleanup
      const cleanupTimer = setTimeout(() => {
        this.cleanupPlayerSession(socketId);
      }, this.sessionTimeout);
      
      this.cleanupTimers.set(socketId, cleanupTimer);
      console.log(`⏰ Player ${session.playerName} marked for cleanup in ${this.sessionTimeout}ms`);
    }
  }

  /**
   * Cleanup player session and associated data
   */
  cleanupPlayerSession(socketId) {
    const session = this.playerSessions.get(socketId);
    if (!session) return;

    console.log(`🧹 Cleaning up session for ${session.playerName}`);

    // Clear cleanup timer
    const timer = this.cleanupTimers.get(socketId);
    if (timer) {
      clearTimeout(timer);
      this.cleanupTimers.delete(socketId);
    }

    // Clean up tracked objects for this player
    const playerObjects = Array.from(this.trackedObjects.entries())
      .filter(([id, metadata]) => 
        metadata.type === 'playerState' && 
        metadata.data.socketId === socketId
      );

    for (const [objectId] of playerObjects) {
      this.untrackObject(objectId);
    }

    // Remove session
    this.playerSessions.delete(socketId);
    console.log(`✅ Session cleanup completed for ${session.playerName}`);
  }

  /**
   * Cleanup room and all associated data
   */
  cleanupRoom(roomId) {
    console.log(`🧹 Cleaning up room ${roomId}`);

    // Find all objects associated with this room
    const roomObjects = Array.from(this.trackedObjects.entries())
      .filter(([id, metadata]) => metadata.roomId === roomId);

    let freedMemory = 0;
    for (const [objectId, metadata] of roomObjects) {
      freedMemory += metadata.size;
      this.untrackObject(objectId);
    }

    // Clean up player sessions in this room
    const roomSessions = Array.from(this.playerSessions.entries())
      .filter(([socketId, session]) => session.roomId === roomId);

    for (const [socketId] of roomSessions) {
      this.cleanupPlayerSession(socketId);
    }

    // Remove room memory tracking
    this.roomMemoryUsage.delete(roomId);

    console.log(`✅ Room ${roomId} cleanup completed: freed ${freedMemory} bytes`);
    return freedMemory;
  }

  /**
   * Perform regular cleanup cycle
   */
  performCleanupCycle() {
    const now = Date.now();
    let cleanedObjects = 0;
    let freedMemory = 0;

    // Clean up old, unused objects
    for (const [objectId, metadata] of this.trackedObjects.entries()) {
      const age = now - metadata.createdAt;
      const timeSinceAccess = now - metadata.lastAccessed;

      // Remove objects that are old and haven't been accessed recently
      if (age > 3600000 && timeSinceAccess > 1800000) { // 1 hour old, 30 min since access
        freedMemory += metadata.size;
        this.untrackObject(objectId);
        cleanedObjects++;
      }
    }

    // Clean up inactive player sessions
    for (const [socketId, session] of this.playerSessions.entries()) {
      if (!session.isActive && session.disconnectedAt) {
        const timeSinceDisconnect = now - session.disconnectedAt;
        if (timeSinceDisconnect > this.sessionTimeout) {
          this.cleanupPlayerSession(socketId);
        }
      }
    }

    if (cleanedObjects > 0) {
      console.log(`🧹 Cleanup cycle: removed ${cleanedObjects} objects, freed ${freedMemory} bytes`);
    }
  }

  /**
   * Check memory usage and trigger alerts
   */
  checkMemoryUsage() {
    const usage = process.memoryUsage();
    const totalMemory = usage.heapUsed + usage.external;

    // Log memory stats
    console.log(`📊 Memory usage: ${Math.round(totalMemory / 1024 / 1024)}MB heap, ${this.trackedObjects.size} tracked objects`);

    // Check thresholds
    if (totalMemory > this.memoryThresholds.emergency) {
      console.error('🚨 EMERGENCY: Memory usage critical! Performing aggressive cleanup...');
      this.performAggressiveCleanup();
    } else if (totalMemory > this.memoryThresholds.critical) {
      console.warn('⚠️ WARNING: High memory usage detected. Performing cleanup...');
      this.performCleanupCycle();
    } else if (totalMemory > this.memoryThresholds.warning) {
      console.warn('⚠️ Memory usage above warning threshold');
    }

    // Update room memory stats
    this.updateRoomMemoryStats();
  }

  /**
   * Perform aggressive cleanup in emergency situations
   */
  performAggressiveCleanup() {
    console.log('🚨 Performing aggressive memory cleanup...');

    const now = Date.now();
    let cleanedObjects = 0;
    let freedMemory = 0;

    // Remove all objects older than 30 minutes
    for (const [objectId, metadata] of this.trackedObjects.entries()) {
      const age = now - metadata.createdAt;
      if (age > 1800000) { // 30 minutes
        freedMemory += metadata.size;
        this.untrackObject(objectId);
        cleanedObjects++;
      }
    }

    // Force garbage collection
    if (global.gc) {
      global.gc();
    }

    console.log(`🚨 Aggressive cleanup completed: removed ${cleanedObjects} objects, freed ${freedMemory} bytes`);
  }

  /**
   * Update room memory usage tracking
   */
  updateRoomMemoryUsage(roomId, size, operation) {
    if (!this.roomMemoryUsage.has(roomId)) {
      this.roomMemoryUsage.set(roomId, {
        totalSize: 0,
        objectCount: 0,
        lastUpdated: Date.now()
      });
    }

    const usage = this.roomMemoryUsage.get(roomId);
    
    if (operation === 'add') {
      usage.totalSize += size;
      usage.objectCount++;
    } else if (operation === 'remove') {
      usage.totalSize = Math.max(0, usage.totalSize - size);
      usage.objectCount = Math.max(0, usage.objectCount - 1);
    }

    usage.lastUpdated = Date.now();
  }

  /**
   * Update room memory statistics
   */
  updateRoomMemoryStats() {
    for (const [roomId, usage] of this.roomMemoryUsage.entries()) {
      if (usage.totalSize > 50 * 1024 * 1024) { // 50MB per room warning
        console.warn(`⚠️ Room ${roomId} using ${Math.round(usage.totalSize / 1024 / 1024)}MB memory`);
      }
    }
  }

  /**
   * Estimate object size in bytes
   */
  estimateObjectSize(obj) {
    const jsonString = JSON.stringify(obj);
    return new Blob([jsonString]).size;
  }

  /**
   * Get memory statistics
   */
  getMemoryStats() {
    const nodeMemory = process.memoryUsage();
    const trackedMemory = Array.from(this.trackedObjects.values())
      .reduce((sum, metadata) => sum + metadata.size, 0);

    return {
      node: {
        heapUsed: nodeMemory.heapUsed,
        heapTotal: nodeMemory.heapTotal,
        external: nodeMemory.external,
        rss: nodeMemory.rss
      },
      tracked: {
        totalSize: trackedMemory,
        objectCount: this.trackedObjects.size,
        roomCount: this.roomMemoryUsage.size,
        sessionCount: this.playerSessions.size
      },
      rooms: Object.fromEntries(this.roomMemoryUsage),
      thresholds: this.memoryThresholds
    };
  }

  /**
   * Get room-specific memory stats
   */
  getRoomMemoryStats(roomId) {
    const usage = this.roomMemoryUsage.get(roomId);
    if (!usage) return null;

    const roomObjects = Array.from(this.trackedObjects.values())
      .filter(metadata => metadata.roomId === roomId);

    return {
      ...usage,
      objects: roomObjects.map(metadata => ({
        id: metadata.id,
        type: metadata.type,
        size: metadata.size,
        age: Date.now() - metadata.createdAt,
        accessCount: metadata.accessCount
      }))
    };
  }

  /**
   * Force cleanup for specific room
   */
  forceRoomCleanup(roomId) {
    return this.cleanupRoom(roomId);
  }

  /**
   * Force cleanup for specific player
   */
  forcePlayerCleanup(socketId) {
    this.cleanupPlayerSession(socketId);
  }
}

module.exports = new MemoryManager();
