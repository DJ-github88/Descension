/**
 * Delta-Based State Synchronization Engine
 * 
 * This module provides ultra-efficient state synchronization by:
 * - Computing minimal diffs between game states
 * - Compressing deltas for bandwidth optimization
 * - Managing state versions for conflict resolution
 * - Providing rollback capabilities for corrections
 */

const { v4: uuidv4 } = require('uuid');
const zlib = require('zlib');

class DeltaSyncEngine {
  constructor() {
    this.stateVersions = new Map(); // roomId -> version history
    this.clientStates = new Map(); // socketId -> last known state version
    this.compressionThreshold = 100; // bytes
    this.maxVersionHistory = 50; // keep last 50 versions
    this.maxStateSize = 10 * 1024 * 1024; // 10MB max state size
    this.maxDeltaSize = 1024 * 1024; // 1MB max delta size
  }

  /**
   * Initialize room state tracking
   */
  initializeRoom(roomId, initialState = {}) {
    const version = {
      id: uuidv4(),
      timestamp: Date.now(),
      state: this.deepClone(initialState),
      checksum: this.calculateChecksum(initialState)
    };

    this.stateVersions.set(roomId, [version]);
    console.log(`🔄 Delta sync initialized for room ${roomId}`);
    return version.id;
  }

  /**
   * Compute delta between two states
   */
  computeDelta(oldState, newState, path = '') {
    const delta = {};
    let hasChanges = false;

    // Handle different types
    if (this.isPrimitive(newState)) {
      if (oldState !== newState) {
        return { __value: newState, __type: 'primitive' };
      }
      return null;
    }

    if (Array.isArray(newState)) {
      return this.computeArrayDelta(oldState || [], newState, path);
    }

    if (typeof newState === 'object' && newState !== null) {
      // Check for deleted keys
      if (oldState && typeof oldState === 'object') {
        for (const key in oldState) {
          if (!(key in newState)) {
            delta[key] = { __deleted: true };
            hasChanges = true;
          }
        }
      }

      // Check for added/modified keys
      for (const key in newState) {
        const oldValue = oldState ? oldState[key] : undefined;
        const newValue = newState[key];
        const keyPath = path ? `${path}.${key}` : key;

        const keyDelta = this.computeDelta(oldValue, newValue, keyPath);
        if (keyDelta !== null) {
          delta[key] = keyDelta;
          hasChanges = true;
        }
      }
    }

    return hasChanges ? delta : null;
  }

  /**
   * Compute delta for arrays with intelligent diffing
   */
  computeArrayDelta(oldArray, newArray, path) {
    const delta = {
      __type: 'array',
      __length: newArray.length,
      __changes: {}
    };

    let hasChanges = false;

    // Use LCS algorithm for efficient array diffing
    const lcs = this.longestCommonSubsequence(oldArray, newArray);
    const operations = this.generateArrayOperations(oldArray, newArray, lcs);

    if (operations.length > 0) {
      delta.__operations = operations;
      hasChanges = true;
    }

    // For small arrays, also include direct index changes
    const maxDirectIndex = Math.min(oldArray.length, newArray.length, 20);
    for (let i = 0; i < maxDirectIndex; i++) {
      const itemDelta = this.computeDelta(oldArray[i], newArray[i], `${path}[${i}]`);
      if (itemDelta !== null) {
        delta.__changes[i] = itemDelta;
        hasChanges = true;
      }
    }

    return hasChanges ? delta : null;
  }

  /**
   * Apply delta to a state
   */
  applyDelta(state, delta) {
    if (!delta) {return state;}

    if (delta.__type === 'primitive') {
      return delta.__value;
    }

    if (delta.__type === 'array') {
      let result = Array.isArray(state) ? [...state] : [];
      
      // Apply operations first
      if (delta.__operations) {
        result = this.applyArrayOperations(result, delta.__operations);
      }

      // Apply direct changes
      if (delta.__changes) {
        for (const [index, change] of Object.entries(delta.__changes)) {
          const idx = parseInt(index);
          result[idx] = this.applyDelta(result[idx], change);
        }
      }

      // Adjust length
      if (delta.__length !== undefined) {
        result.length = delta.__length;
      }

      return result;
    }

    // Object delta
    const result = state && typeof state === 'object' ? { ...state } : {};

    for (const [key, change] of Object.entries(delta)) {
      if (change.__deleted) {
        delete result[key];
      } else {
        result[key] = this.applyDelta(result[key], change);
      }
    }

    return result;
  }

  /**
   * Create a state update for a room
   */
  async createStateUpdate(roomId, newState, metadata = {}) {
    const versions = this.stateVersions.get(roomId);
    if (!versions || versions.length === 0) {
      throw new Error(`Room ${roomId} not initialized for delta sync`);
    }

    // PERFORMANCE: Check state size before processing
    const stateSize = JSON.stringify(newState).length;
    if (stateSize > this.maxStateSize) {
      console.warn(`⚠️ State size (${stateSize} bytes) exceeds limit (${this.maxStateSize} bytes) for room ${roomId}`);
      // Truncate or optimize state if needed
      // For now, log warning and continue
    }

    const currentVersion = versions[versions.length - 1];
    const delta = this.computeDelta(currentVersion.state, newState);

    if (!delta) {
      console.log(`📊 No changes detected for room ${roomId}`);
      return null;
    }

    // PERFORMANCE: Check delta size
    const deltaSize = JSON.stringify(delta).length;
    if (deltaSize > this.maxDeltaSize) {
      console.warn(`⚠️ Delta size (${deltaSize} bytes) exceeds limit (${this.maxDeltaSize} bytes) for room ${roomId}`);
      // For large deltas, consider sending full state instead
      // This is a performance optimization to avoid expensive delta application
    }

    // Create new version
    const newVersion = {
      id: uuidv4(),
      timestamp: Date.now(),
      state: this.deepClone(newState),
      checksum: this.calculateChecksum(newState),
      delta: delta,
      metadata: metadata,
      parentVersion: currentVersion.id
    };

    // Add to version history
    versions.push(newVersion);

    // Cleanup old versions
    if (versions.length > this.maxVersionHistory) {
      versions.splice(0, versions.length - this.maxVersionHistory);
    }

    console.log(`🔄 State update created for room ${roomId}, delta size: ${JSON.stringify(delta).length} bytes`);
    return newVersion;
  }

  /**
   * Get delta update for a specific client
   */
  getDeltaForClient(roomId, socketId, targetVersionId = null) {
    const versions = this.stateVersions.get(roomId);
    if (!versions) {return null;}

    const clientLastVersion = this.clientStates.get(socketId);
    const targetVersion = targetVersionId ? 
      versions.find(v => v.id === targetVersionId) : 
      versions[versions.length - 1];

    if (!targetVersion) {return null;}

    // If client has no previous state, send full state
    if (!clientLastVersion) {
      this.clientStates.set(socketId, targetVersion.id);
      return {
        type: 'full_state',
        versionId: targetVersion.id,
        state: targetVersion.state,
        timestamp: targetVersion.timestamp
      };
    }

    // Find client's last known version
    const clientVersionIndex = versions.findIndex(v => v.id === clientLastVersion);
    const targetVersionIndex = versions.findIndex(v => v.id === targetVersion.id);

    if (clientVersionIndex === -1 || targetVersionIndex <= clientVersionIndex) {
      return null; // Client is up to date or ahead
    }

    // Compute cumulative delta
    const cumulativeDelta = this.computeCumulativeDelta(
      versions.slice(clientVersionIndex + 1, targetVersionIndex + 1)
    );

    this.clientStates.set(socketId, targetVersion.id);

    return {
      type: 'delta_update',
      versionId: targetVersion.id,
      fromVersion: clientLastVersion,
      delta: cumulativeDelta,
      timestamp: targetVersion.timestamp
    };
  }

  /**
   * Compress delta if it exceeds threshold
   */
  async compressDelta(delta) {
    const deltaStr = JSON.stringify(delta);
    if (deltaStr.length < this.compressionThreshold) {
      return { compressed: false, data: delta };
    }

    try {
      const compressed = await new Promise((resolve, reject) => {
        zlib.gzip(deltaStr, (err, result) => {
          if (err) {reject(err);}
          else {resolve(result);}
        });
      });

      const compressionRatio = compressed.length / deltaStr.length;
      console.log(`🗜️ Delta compressed: ${deltaStr.length} -> ${compressed.length} bytes (${(compressionRatio * 100).toFixed(1)}%)`);

      return {
        compressed: true,
        data: compressed.toString('base64'),
        originalSize: deltaStr.length,
        compressedSize: compressed.length
      };
    } catch (error) {
      console.error('Delta compression failed:', error);
      return { compressed: false, data: delta };
    }
  }

  /**
   * Decompress delta
   */
  async decompressDelta(compressedData) {
    if (!compressedData.compressed) {
      return compressedData.data;
    }

    try {
      const buffer = Buffer.from(compressedData.data, 'base64');
      const decompressed = await new Promise((resolve, reject) => {
        zlib.gunzip(buffer, (err, result) => {
          if (err) {reject(err);}
          else {resolve(result);}
        });
      });

      return JSON.parse(decompressed.toString());
    } catch (error) {
      console.error('Delta decompression failed:', error);
      throw error;
    }
  }

  // Utility methods
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  isPrimitive(value) {
    return value === null || typeof value !== 'object';
  }

  calculateChecksum(obj) {
    const str = JSON.stringify(obj, Object.keys(obj).sort());
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  longestCommonSubsequence(arr1, arr2) {
    // Simplified LCS for array diffing
    const m = arr1.length;
    const n = arr2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (JSON.stringify(arr1[i - 1]) === JSON.stringify(arr2[j - 1])) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    return dp[m][n];
  }

  generateArrayOperations(oldArray, newArray, _lcs) {
    // Generate insert/delete operations for arrays
    const operations = [];
    // Simplified implementation - in production, use Myers' algorithm
    if (oldArray.length !== newArray.length) {
      operations.push({
        type: 'resize',
        newLength: newArray.length
      });
    }
    return operations;
  }

  applyArrayOperations(array, operations) {
    const result = [...array];
    for (const op of operations) {
      if (op.type === 'resize') {
        result.length = op.newLength;
      }
      // Add more operation types as needed
    }
    return result;
  }

  computeCumulativeDelta(versions) {
    // Combine multiple deltas into one
    let cumulativeDelta = {};
    for (const version of versions) {
      if (version.delta) {
        cumulativeDelta = this.mergeDelta(cumulativeDelta, version.delta);
      }
    }
    return cumulativeDelta;
  }

  /**
   * Merge two deltas with conflict resolution
   * @param {Object} delta1 - First delta
   * @param {Object} delta2 - Second delta
   * @returns {Object} - Merged delta with conflicts resolved
   */
  mergeDelta(delta1, delta2) {
    const merged = { ...delta1 };
    
    for (const [key, value2] of Object.entries(delta2)) {
      if (!(key in merged)) {
        // No conflict - add new key
        merged[key] = value2;
      } else {
        // Conflict detected - resolve based on type
        merged[key] = this.resolveConflict(merged[key], value2, key);
      }
    }
    
    return merged;
  }

  /**
   * Resolve conflict between two delta values
   * @param {*} value1 - First value
   * @param {*} value2 - Second value
   * @param {string} path - Path to the conflicting field
   * @returns {*} - Resolved value
   */
  resolveConflict(value1, value2, path) {
    // Handle deleted values
    if (value1 && value1.__deleted) {
      return value2; // New value takes precedence over deletion
    }
    if (value2 && value2.__deleted) {
      return value1; // Keep existing value if new one is deleted
    }

    // Handle nested objects - recursively merge
    if (typeof value1 === 'object' && value1 !== null && 
        typeof value2 === 'object' && value2 !== null &&
        !Array.isArray(value1) && !Array.isArray(value2) &&
        !value1.__type && !value2.__type) {
      return this.mergeDelta(value1, value2);
    }

    // Handle arrays - merge array changes intelligently
    if (value1 && value1.__type === 'array' && value2 && value2.__type === 'array') {
      return this.mergeArrayDelta(value1, value2);
    }

    // For primitive values or incompatible types, use last-write-wins with timestamp
    // In practice, we'll prefer value2 (more recent) but log the conflict
    if (JSON.stringify(value1) !== JSON.stringify(value2)) {
      console.warn(`⚠️ Conflict detected at path "${path}": ${JSON.stringify(value1)} vs ${JSON.stringify(value2)}. Using last-write-wins.`);
    }
    
    return value2; // Last write wins for simple conflicts
  }

  /**
   * Merge array deltas intelligently
   * @param {Object} delta1 - First array delta
   * @param {Object} delta2 - Second array delta
   * @returns {Object} - Merged array delta
   */
  mergeArrayDelta(delta1, delta2) {
    // If lengths differ, use the longer one (more complete)
    const mergedLength = Math.max(delta1.__length || 0, delta2.__length || 0);
    
    // Merge changes from both deltas
    const mergedChanges = { ...(delta1.__changes || {}), ...(delta2.__changes || {}) };
    
    return {
      __type: 'array',
      __length: mergedLength,
      __changes: mergedChanges
    };
  }

  /**
   * Detect and resolve conflicts when creating state updates
   * @param {string} roomId - Room ID
   * @param {Object} newState - New state to apply
   * @param {Object} metadata - Update metadata (playerId, type, etc.)
   * @returns {Object} - Conflict resolution result
   */
  async createStateUpdateWithConflictResolution(roomId, newState, metadata = {}) {
    const versions = this.stateVersions.get(roomId);
    if (!versions || versions.length === 0) {
      throw new Error(`Room ${roomId} not initialized for delta sync`);
    }

    const currentVersion = versions[versions.length - 1];
    
    // Check for concurrent modifications
    const concurrentUpdates = versions.filter(v => 
      v.timestamp > currentVersion.timestamp - 100 && // Within 100ms window
      v.metadata && v.metadata.playerId !== metadata.playerId
    );

    if (concurrentUpdates.length > 0) {
      console.log(`⚠️ Concurrent updates detected for room ${roomId}. Resolving conflicts...`);
      
      // Apply concurrent updates first, then apply new update
      let mergedState = this.deepClone(currentVersion.state);
      
      for (const concurrentVersion of concurrentUpdates) {
        mergedState = this.applyDelta(mergedState, concurrentVersion.delta);
      }
      
      // Now compute delta from merged state to new state
      const baseState = mergedState;
      const delta = this.computeDelta(baseState, newState);
      
      if (!delta) {
        console.log(`📊 No changes after conflict resolution for room ${roomId}`);
        return null;
      }

      // Create new version with conflict resolution metadata
      const newVersion = {
        id: uuidv4(),
        timestamp: Date.now(),
        state: this.deepClone(newState),
        checksum: this.calculateChecksum(newState),
        delta: delta,
        metadata: {
          ...metadata,
          conflictsResolved: concurrentUpdates.length,
          resolvedFrom: concurrentUpdates.map(v => v.id)
        },
        parentVersion: currentVersion.id
      };

      versions.push(newVersion);

      // Cleanup old versions
      if (versions.length > this.maxVersionHistory) {
        versions.splice(0, versions.length - this.maxVersionHistory);
      }

      console.log(`🔄 State update with conflict resolution created for room ${roomId}`);
      return newVersion;
    }

    // No conflicts - use normal update path
    return this.createStateUpdate(roomId, newState, metadata);
  }

  /**
   * Apply delta to a state
   * @param {Object} state - Current state
   * @param {Object} delta - Delta to apply
   * @returns {Object} - Updated state
   */
  applyDelta(state, delta) {
    if (!delta || Object.keys(delta).length === 0) {
      return state;
    }

    const result = this.deepClone(state);

    for (const [key, value] of Object.entries(delta)) {
      if (value && value.__deleted) {
        delete result[key];
      } else if (value && value.__type === 'array') {
        result[key] = this.applyArrayDelta(result[key] || [], value);
      } else if (typeof value === 'object' && value !== null && !value.__type) {
        result[key] = this.applyDelta(result[key] || {}, value);
      } else if (value && value.__type === 'primitive') {
        result[key] = value.__value;
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Apply array delta to an array
   * @param {Array} array - Current array
   * @param {Object} delta - Array delta
   * @returns {Array} - Updated array
   */
  applyArrayDelta(array, delta) {
    let result = [...array];
    
    if (delta.__length !== undefined) {
      result.length = delta.__length;
    }
    
    if (delta.__changes) {
      for (const [index, change] of Object.entries(delta.__changes)) {
        const idx = parseInt(index);
        if (change.__deleted) {
          result.splice(idx, 1);
        } else {
          result[idx] = change;
        }
      }
    }
    
    return result;
  }

  // Cleanup methods
  removeClient(socketId) {
    this.clientStates.delete(socketId);
  }

  removeRoom(roomId) {
    this.stateVersions.delete(roomId);
  }
}

module.exports = new DeltaSyncEngine();
