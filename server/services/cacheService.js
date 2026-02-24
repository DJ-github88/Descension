/**
 * Cache Service Module
 * 
 * Provides in-memory caching for frequently accessed data:
 * - Room data caching
 * - Character data caching
 * - Rate limit result caching
 * 
 * Features:
 * - TTL (Time To Live) support
 * - Automatic cleanup of expired entries
 * - LRU (Least Recently Used) eviction
 */

const logger = require('./logger');

/**
 * Simple LRU Cache implementation
 */
class LRUCache {
  constructor(maxSize = 1000, defaultTTL = 60000) {
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
    this.cache = new Map();
    this.accessOrder = [];
    this.hits = 0;
    this.misses = 0;
    
    // Start cleanup interval
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 30000); // Clean every 30 seconds
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or undefined
   */
  get(key) {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.misses++;
      return undefined;
    }
    
    // Check TTL
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.accessOrder = this.accessOrder.filter(k => k !== key);
      this.misses++;
      return undefined;
    }
    
    // Update access order (move to end)
    this.accessOrder = this.accessOrder.filter(k => k !== key);
    this.accessOrder.push(key);
    
    this.hits++;
    return entry.value;
  }

  /**
   * Set value in cache
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds (optional)
   */
  set(key, value, ttl = this.defaultTTL) {
    // Evict LRU if at capacity
    while (this.cache.size >= this.maxSize && this.accessOrder.length > 0) {
      const lruKey = this.accessOrder.shift();
      this.cache.delete(lruKey);
    }
    
    const expiresAt = ttl ? Date.now() + ttl : null;
    
    // Remove from access order if updating existing key
    this.accessOrder = this.accessOrder.filter(k => k !== key);
    this.accessOrder.push(key);
    
    this.cache.set(key, {
      value,
      expiresAt,
      createdAt: Date.now()
    });
  }

  /**
   * Check if key exists and is valid
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== undefined;
  }

  /**
   * Delete key from cache
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
    this.accessOrder = this.accessOrder.filter(k => k !== key);
  }

  /**
   * Clear entire cache
   */
  clear() {
    this.cache.clear();
    this.accessOrder = [];
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Clean up expired entries
   */
  cleanup() {
    const now = Date.now();
    const keysToDelete = [];
    
    this.cache.forEach((entry, key) => {
      if (entry.expiresAt && now > entry.expiresAt) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => {
      this.cache.delete(key);
      this.accessOrder = this.accessOrder.filter(k => k !== key);
    });
    
    if (keysToDelete.length > 0) {
      logger.debug(`[Cache] Cleaned up ${keysToDelete.length} expired entries`);
    }
  }

  /**
   * Get cache statistics
   * @returns {Object}
   */
  getStats() {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? (this.hits / total * 100).toFixed(2) + '%' : '0%'
    };
  }

  /**
   * Stop cleanup interval
   */
  stop() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Create cache instances for different data types
const roomDataCache = new LRUCache(500, 30000); // 30 second TTL for room data
const characterDataCache = new LRUCache(1000, 60000); // 1 minute TTL for character data
const rateLimitCache = new LRUCache(10000, 60000); // 1 minute TTL for rate limits
const publicRoomsCache = new LRUCache(1, 5000); // 5 second TTL for public rooms list

/**
 * Get room data with caching
 * @param {string} roomId - Room ID
 * @param {Function} fetchFn - Function to fetch data if not cached
 * @returns {Promise<Object>}
 */
async function getRoomData(roomId, fetchFn) {
  const cacheKey = `room:${roomId}`;
  const cached = roomDataCache.get(cacheKey);
  
  if (cached) {
    logger.debug(`[Cache] Hit for room ${roomId}`);
    return cached;
  }
  
  logger.debug(`[Cache] Miss for room ${roomId}`);
  const data = await fetchFn();
  
  if (data) {
    roomDataCache.set(cacheKey, data);
  }
  
  return data;
}

/**
 * Invalidate room data cache
 * @param {string} roomId - Room ID
 */
function invalidateRoomData(roomId) {
  roomDataCache.delete(`room:${roomId}`);
  logger.debug(`[Cache] Invalidated room ${roomId}`);
}

/**
 * Get character data with caching
 * @param {string} characterId - Character ID
 * @param {Function} fetchFn - Function to fetch data if not cached
 * @returns {Promise<Object>}
 */
async function getCharacterData(characterId, fetchFn) {
  const cacheKey = `character:${characterId}`;
  const cached = characterDataCache.get(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  const data = await fetchFn();
  
  if (data) {
    characterDataCache.set(cacheKey, data);
  }
  
  return data;
}

/**
 * Update character data in cache
 * @param {string} characterId - Character ID
 * @param {Object} data - Character data
 */
function updateCharacterData(characterId, data) {
  characterDataCache.set(`character:${characterId}`, data);
}

/**
 * Invalidate character data cache
 * @param {string} characterId - Character ID
 */
function invalidateCharacterData(characterId) {
  characterDataCache.delete(`character:${characterId}`);
}

/**
 * Get public rooms list with caching
 * @param {Function} fetchFn - Function to fetch data if not cached
 * @returns {Promise<Array>}
 */
async function getPublicRoomsList(fetchFn) {
  const cacheKey = 'publicRooms';
  const cached = publicRoomsCache.get(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  const data = await fetchFn();
  publicRoomsCache.set(cacheKey, data);
  
  return data;
}

/**
 * Invalidate public rooms cache
 */
function invalidatePublicRoomsList() {
  publicRoomsCache.delete('publicRooms');
}

/**
 * Check rate limit with caching
 * @param {string} identifier - Rate limit identifier
 * @param {Function} checkFn - Function to check rate limit
 * @param {number} ttl - TTL for cache entry
 * @returns {Object}
 */
function checkRateLimitCached(identifier, checkFn, ttl = 1000) {
  const cacheKey = `rateLimit:${identifier}`;
  const cached = rateLimitCache.get(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  const result = checkFn();
  rateLimitCache.set(cacheKey, result, ttl);
  
  return result;
}

/**
 * Get all cache statistics
 * @returns {Object}
 */
function getAllCacheStats() {
  return {
    roomData: roomDataCache.getStats(),
    characterData: characterDataCache.getStats(),
    rateLimit: rateLimitCache.getStats(),
    publicRooms: publicRoomsCache.getStats()
  };
}

/**
 * Clear all caches
 */
function clearAllCaches() {
  roomDataCache.clear();
  characterDataCache.clear();
  rateLimitCache.clear();
  publicRoomsCache.clear();
  logger.info('[Cache] All caches cleared');
}

/**
 * Stop all cleanup intervals
 */
function stopAllCaches() {
  roomDataCache.stop();
  characterDataCache.stop();
  rateLimitCache.stop();
  publicRoomsCache.stop();
}

module.exports = {
  LRUCache,
  roomDataCache,
  characterDataCache,
  rateLimitCache,
  publicRoomsCache,
  getRoomData,
  invalidateRoomData,
  getCharacterData,
  updateCharacterData,
  invalidateCharacterData,
  getPublicRoomsList,
  invalidatePublicRoomsList,
  checkRateLimitCached,
  getAllCacheStats,
  clearAllCaches,
  stopAllCaches
};
