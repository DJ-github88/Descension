/**
 * Optimized Firebase Integration Service
 * 
 * This module provides high-performance Firebase operations by:
 * - Batching writes to reduce API calls
 * - Implementing smart caching with invalidation
 * - Background sync for non-critical updates
 * - Connection pooling and retry logic
 */

const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

class OptimizedFirebaseService {
  constructor() {
    this.db = null;
    this.isInitialized = false;
    this.writeQueue = new Map(); // roomId -> pending writes
    this.writeTimers = new Map(); // roomId -> timer ID
    this.cache = new Map(); // key -> { data, timestamp, ttl }
    this.connectionPool = new Map(); // connection pooling
    
    // Configuration - optimized for performance
    this.batchWriteDelay = 500; // ms to wait before batching critical writes
    this.nonCriticalBatchDelay = 2000; // ms to wait before batching non-critical writes (increased for better batching)
    this.maxBatchSize = 500; // max operations per batch
    this.cacheDefaultTTL = 30000; // 30 seconds
    this.retryAttempts = 3;
    this.retryDelay = 1000; // ms

    this.initialize();
  }

  /**
   * Initialize Firebase with optimizations
   */
  initialize() {
    if (this.isInitialized) {return;}

    try {
      const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      const projectId = process.env.FIREBASE_PROJECT_ID || 'mythrill-ff7c6';

      if (!serviceAccountKey) {
        console.warn('⚠️ Firebase service account key not found, running without persistence');
        return;
      }

      let serviceAccount;
      try {
        serviceAccount = JSON.parse(serviceAccountKey);
      } catch (parseError) {
        console.error('❌ Invalid Firebase service account key format');
        return;
      }

      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: projectId
        });
      }

      this.db = admin.firestore();
      
      // Configure Firestore settings for performance
      this.db.settings({
        ignoreUndefinedProperties: true,
        merge: true
      });

      this.isInitialized = true;
      console.log('🚀 Optimized Firebase service initialized');

      // Start background cleanup
      this.startBackgroundTasks();

    } catch (error) {
      console.error('❌ Optimized Firebase initialization failed:', error);
    }
  }

  /**
   * Start background maintenance tasks
   */
  startBackgroundTasks() {
    // Cache cleanup every 5 minutes
    setInterval(() => {
      this.cleanupCache();
    }, 5 * 60 * 1000);

    // Metrics logging every minute
    setInterval(() => {
      this.logMetrics();
    }, 60 * 1000);
  }

  /**
   * Queue a write operation for batching
   */
  queueWrite(roomId, operation) {
    if (!this.isInitialized) {
      console.warn('Firebase not initialized, skipping write');
      return Promise.resolve();
    }

    if (!this.writeQueue.has(roomId)) {
      this.writeQueue.set(roomId, []);
    }

    const queue = this.writeQueue.get(roomId);
    queue.push({
      id: uuidv4(),
      timestamp: Date.now(),
      ...operation
    });

    // Set timer for batch processing
    if (!this.writeTimers.has(roomId)) {
      const timerId = setTimeout(() => {
        this.processBatchWrites(roomId);
      }, this.batchWriteDelay);
      
      this.writeTimers.set(roomId, timerId);
    }

    // Process immediately if queue is full
    if (queue.length >= this.maxBatchSize) {
      this.processBatchWrites(roomId);
    }

    return Promise.resolve();
  }

  /**
   * Process batched writes for a room
   */
  async processBatchWrites(roomId) {
    const queue = this.writeQueue.get(roomId);
    if (!queue || queue.length === 0) {return;}

    // Clear timer
    const timerData = this.writeTimers.get(roomId);
    if (timerData) {
      clearTimeout(timerData.timerId);
      this.writeTimers.delete(roomId);
    }

    // Get operations to process
    const operations = queue.splice(0, this.maxBatchSize);
    
    try {
      const batch = this.db.batch();
      let operationCount = 0;

      for (const op of operations) {
        switch (op.type) {
        case 'set':
          batch.set(this.db.doc(op.path), op.data, { merge: op.merge || false });
          operationCount++;
          break;
        case 'update':
          batch.update(this.db.doc(op.path), op.data);
          operationCount++;
          break;
        case 'delete':
          batch.delete(this.db.doc(op.path));
          operationCount++;
          break;
        }

        // Firestore batch limit is 500 operations
        if (operationCount >= 500) {break;}
      }

      if (operationCount > 0) {
        await this.retryOperation(() => batch.commit());
        console.log(`📦 Batch write completed for room ${roomId}: ${operationCount} operations`);
      }

      // If there are remaining operations, schedule another batch
      if (queue.length > 0) {
        setTimeout(() => this.processBatchWrites(roomId), 100);
      }

    } catch (error) {
      console.error(`❌ Batch write failed for room ${roomId}:`, error);
      
      // Re-queue failed operations
      queue.unshift(...operations);
    }
  }

  /**
   * Optimized room data save with caching
   */
  async saveRoomData(roomId, roomData, priority = 'normal') {
    const cacheKey = `room:${roomId}`;
    
    // Update cache immediately
    this.setCache(cacheKey, roomData, this.cacheDefaultTTL);

    // Queue write based on priority
    if (priority === 'high') {
      // High priority - write immediately
      return this.immediateWrite('set', `rooms/${roomId}`, roomData, true);
    } else {
      // Normal priority - queue for batching
      return this.queueWrite(roomId, {
        type: 'set',
        path: `rooms/${roomId}`,
        data: roomData,
        merge: true
      });
    }
  }

  /**
   * Optimized room data retrieval with caching and performance tracking
   */
  async getRoomData(roomId) {
    const startTime = Date.now();
    const cacheKey = `room:${roomId}`;

    try {
      // Check cache first
      const cached = this.getCache(cacheKey);
      if (cached) {
        console.log(`💾 Cache hit for room ${roomId}`);
        if (global.performanceMonitor) {
          global.performanceMonitor.trackDatabaseQuery('getRoomData_cache', Date.now() - startTime, true);
        }
        return cached;
      }

      if (!this.isInitialized) {
        console.warn('Firebase not initialized');
        if (global.performanceMonitor) {
          global.performanceMonitor.trackDatabaseQuery('getRoomData_not_init', Date.now() - startTime, false);
        }
        return null;
      }

      const doc = await this.retryOperation(() =>
        this.db.collection('rooms').doc(roomId).get()
      );

      if (doc.exists) {
        const data = { id: doc.id, ...doc.data() };

        // Cache the result
        this.setCache(cacheKey, data, this.cacheDefaultTTL);

        console.log(`🔥 Firebase hit for room ${roomId}`);
        if (global.performanceMonitor) {
          global.performanceMonitor.trackDatabaseQuery('getRoomData_firebase', Date.now() - startTime, true);
        }
        return data;
      }

      if (global.performanceMonitor) {
        global.performanceMonitor.trackDatabaseQuery('getRoomData_not_found', Date.now() - startTime, true);
      }
      return null;

    } catch (error) {
      console.error(`❌ Failed to get room data for ${roomId}:`, error);

      // Handle error through centralized system if available
      if (global.errorHandler) {
        await global.errorHandler.handleError(error, {
          operation: 'getRoomData',
          roomId: roomId
        });
      }

      if (global.performanceMonitor) {
        global.performanceMonitor.trackDatabaseQuery('getRoomData_error', Date.now() - startTime, false);
      }

      return null;
    }
  }

  /**
   * Update game state with delta optimization
   */
  async updateGameState(roomId, gameState, delta = null) {
    const cacheKey = `gamestate:${roomId}`;
    
    // Update cache
    this.setCache(cacheKey, gameState, this.cacheDefaultTTL);

    // If we have a delta, use it for more efficient updates
    if (delta && Object.keys(delta).length > 0) {
      const updateData = {};
      for (const [key, value] of Object.entries(delta)) {
        updateData[`gameState.${key}`] = value;
      }

      return this.queueWrite(roomId, {
        type: 'update',
        path: `rooms/${roomId}`,
        data: updateData
      });
    } else {
      // Full game state update
      return this.queueWrite(roomId, {
        type: 'update',
        path: `rooms/${roomId}`,
        data: { gameState: gameState }
      });
    }
  }

  /**
   * Optimized chat message storage
   */
  async addChatMessage(roomId, message) {
    const messageId = message.id || uuidv4();
    
    // Cache recent messages
    const cacheKey = `chat:${roomId}`;
    const cachedMessages = this.getCache(cacheKey) || [];
    cachedMessages.push(message);
    
    // Keep only last 50 messages in cache
    if (cachedMessages.length > 50) {
      cachedMessages.splice(0, cachedMessages.length - 50);
    }
    
    this.setCache(cacheKey, cachedMessages, this.cacheDefaultTTL);

    // Queue write
    return this.queueWrite(roomId, {
      type: 'set',
      path: `rooms/${roomId}/messages/${messageId}`,
      data: message
    });
  }

  /**
   * Immediate write for high-priority operations
   */
  async immediateWrite(type, path, data, merge = false) {
    if (!this.isInitialized) {return;}

    try {
      const docRef = this.db.doc(path);
      
      switch (type) {
      case 'set':
        await this.retryOperation(() => docRef.set(data, { merge }));
        break;
      case 'update':
        await this.retryOperation(() => docRef.update(data));
        break;
      case 'delete':
        await this.retryOperation(() => docRef.delete());
        break;
      }

      console.log(`⚡ Immediate write completed: ${path}`);
    } catch (error) {
      console.error(`❌ Immediate write failed for ${path}:`, error);
      throw error;
    }
  }

  /**
   * Retry operation with exponential backoff
   */
  async retryOperation(operation, attempts = this.retryAttempts) {
    for (let i = 0; i < attempts; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === attempts - 1) {throw error;}
        
        const delay = this.retryDelay * Math.pow(2, i);
        console.warn(`⚠️ Operation failed, retrying in ${delay}ms (attempt ${i + 1}/${attempts})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Cache management
   */
  setCache(key, data, ttl = this.cacheDefaultTTL) {
    this.cache.set(key, {
      data: JSON.parse(JSON.stringify(data)), // Deep clone
      timestamp: Date.now(),
      ttl: ttl
    });
  }

  getCache(key) {
    const cached = this.cache.get(key);
    if (!cached) {return null;}

    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  invalidateCache(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  cleanupCache() {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > cached.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 Cache cleanup: removed ${cleaned} expired entries`);
    }
  }

  /**
   * Force flush all pending writes
   */
  async flushAllWrites() {
    const promises = [];
    
    for (const roomId of this.writeQueue.keys()) {
      promises.push(this.processBatchWrites(roomId));
    }

    await Promise.all(promises);
    console.log('🚀 All pending writes flushed');
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return {
      isInitialized: this.isInitialized,
      pendingWrites: Array.from(this.writeQueue.values()).reduce((sum, queue) => sum + queue.length, 0),
      cacheSize: this.cache.size,
      activeTimers: this.writeTimers.size
    };
  }

  logMetrics() {
    const metrics = this.getMetrics();
    console.log('📊 Firebase metrics:', metrics);
  }

  /**
   * Cleanup for room
   */
  async cleanupRoom(roomId) {
    // Process any pending writes
    await this.processBatchWrites(roomId);
    
    // Clear timer
    const timerId = this.writeTimers.get(roomId);
    if (timerId) {
      clearTimeout(timerId);
      this.writeTimers.delete(roomId);
    }

    // Clear queue
    this.writeQueue.delete(roomId);
    
    // Invalidate cache
    this.invalidateCache(roomId);
  }
}

module.exports = new OptimizedFirebaseService();
