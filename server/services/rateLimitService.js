/**
 * Rate Limiting Service
 * Prevents spam and abuse by limiting the frequency of socket events
 */

const logger = require('./logger');
const { MemoryRateLimitStore } = require('./rateLimitStore');

class RateLimitService {
  constructor(options = {}) {
    // Rate limit configurations per event type
    this.rateLimits = {
      // Chat events - allow frequent but not spam
      chat_message: { maxPerMinute: 30, maxPerSecond: 3 },
      global_chat_message: { maxPerMinute: 10, maxPerSecond: 1 },
      whisper_message: { maxPerMinute: 20, maxPerSecond: 2 },

      // Token movement - high frequency but throttle aggressive spam
      token_moved: { maxPerMinute: 300, maxPerSecond: 10 },
      character_moved: { maxPerMinute: 300, maxPerSecond: 10 },
      // Cursor updates are intentionally high-frequency for smooth remote pointer tracking.
      // Keep limits high enough to avoid freezing cursor streams under normal movement.
      cursor_move: { maxPerMinute: 3600, maxPerSecond: 120 },

      // Combat actions - moderate frequency
      combat_action: { maxPerMinute: 60, maxPerSecond: 5 },
      dice_rolled: { maxPerMinute: 60, maxPerSecond: 5 },

      // Item operations - moderate frequency
      item_dropped: { maxPerMinute: 30, maxPerSecond: 2 },
      item_looted: { maxPerMinute: 30, maxPerSecond: 2 },

      // Character updates - moderate frequency
      character_updated: { maxPerMinute: 20, maxPerSecond: 2 },
      character_equipment_updated: { maxPerMinute: 30, maxPerSecond: 3 },

      // Map updates - GM only, high frequency allowed for fast drawing
      // CRITICAL FIX: Increased limits to prevent terrain tiles being dropped during fast drawing
      map_update: { maxPerMinute: 360, maxPerSecond: 15 },

      // Room operations - low frequency
      create_room: { maxPerMinute: 5, maxPerSecond: 1 },
      join_room: { maxPerMinute: 10, maxPerSecond: 2 },

      // General events - low frequency
      user_typing: { maxPerMinute: 60, maxPerSecond: 2 },
      update_player_color: { maxPerMinute: 10, maxPerSecond: 1 },

      // Default for unconfigured events
      default: { maxPerMinute: 60, maxPerSecond: 5 }
    };

    // Storage backend. Defaults to in-memory; pass a Redis-backed store for
    // multi-server deployments where rate limits must survive process restarts.
    this.store = options.store || new MemoryRateLimitStore();

    // Cleanup old entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupOldEntries();
    }, 5 * 60 * 1000);
  }

  /**
   * Replace the storage backend at runtime. The previous store is destroyed.
   * @param {Object} store - Store implementing isAllowed, getStatus, resetClient, cleanup, getStats, destroy
   */
  setStore(store) {
    if (this.store && typeof this.store.destroy === 'function') {
      this.store.destroy();
    }
    this.store = store;
  }

  /**
   * Check if an event should be rate limited
   * @param {string} clientId - Socket client ID
   * @param {string} eventType - The event type
   * @param {boolean} isGM - Whether the client is a GM (less restrictive)
   * @returns {Object} - { allowed: boolean, resetTime: number, remaining: number }
   */
  async checkRateLimit(clientId, eventType, isGM = false) {
    const now = Date.now();
    const limits = this.rateLimits[eventType] || this.rateLimits.default;

    // GMs get slightly higher limits (1.5x)
    const adjustedLimits = isGM ? {
      maxPerMinute: Math.floor(limits.maxPerMinute * 1.5),
      maxPerSecond: Math.floor(limits.maxPerSecond * 1.5)
    } : limits;

    return this.store.isAllowed(clientId, eventType, adjustedLimits, isGM, now);
  }

  /**
   * Get rate limit status for a client and event type
   * @param {string} clientId - Socket client ID
   * @param {string} eventType - The event type
   * @returns {Object} - Current rate limit status
   */
  async getRateLimitStatus(clientId, eventType) {
    const status = await this.store.getStatus(clientId, eventType);
    const limits = this.rateLimits[eventType] || this.rateLimits.default;

    if (!status) {
      return { minuteCount: 0, secondCount: 0, limits };
    }

    return {
      minuteCount: status.minuteCount || 0,
      secondCount: status.secondCount || 0,
      limits,
      lastMinuteReset: status.lastMinuteReset,
      lastSecondReset: status.lastSecondReset
    };
  }

  /**
   * Reset rate limits for a client (useful for testing or admin actions)
   * @param {string} clientId - Socket client ID
   */
  async resetClientLimits(clientId) {
    await this.store.resetClient(clientId);
  }

  /**
   * Update rate limits for an event type
   * @param {string} eventType - The event type
   * @param {Object} limits - New limits { maxPerMinute, maxPerSecond }
   */
  updateEventLimits(eventType, limits) {
    if (limits.maxPerMinute && limits.maxPerSecond) {
      this.rateLimits[eventType] = limits;
      logger.info(`Updated rate limits for ${eventType}:`, limits);
    }
  }

  /**
   * Clean up old entries to prevent memory leaks
   */
  async cleanupOldEntries() {
    await this.store.cleanup(30 * 60 * 1000); // 30 minutes
  }

  /**
   * Get statistics about rate limiting
   * @returns {Object} - Statistics
   */
  getStats() {
    const storeStats = this.store.getStats ? this.store.getStats() : {};
    return {
      totalClients: storeStats.totalClients ?? 0,
      totalEvents: storeStats.totalEvents ?? 0,
      rateLimitedEvents: 0, // Would need to track this separately
      rateLimits: this.rateLimits
    };
  }

  /**
   * Create Socket.IO middleware for rate limiting
   * @param {Object} options - Configuration options
   * @returns {Function} - Socket middleware function
   */
  createMiddleware(options = {}) {
    const {
      logViolations = true,
      disconnectOnViolation = false,
      violationThreshold = 5 // Disconnect after this many violations
    } = options;

    const violationCounts = new Map();

    return (socket, next) => {
      // Get player info for GM status check
      const getPlayerInfo = () => {
        const players = global.players || new Map();
        return players.get(socket.id);
      };

      // Override socket.on to add rate limiting
      const originalOn = socket.on.bind(socket);

      // Clean up violation tracking on disconnect (prevents unbounded Map growth)
      originalOn('disconnect', () => { violationCounts.delete(socket.id); });

      socket.on = (event, handler) => {
        const rateLimitedHandler = async (data) => {
          const playerInfo = getPlayerInfo();
          const isGM = playerInfo?.isGM || false;

          const rateLimitResult = await this.checkRateLimit(socket.id, event, isGM);

          if (!rateLimitResult.allowed) {
            // Track violations
            const violations = violationCounts.get(socket.id) || 0;
            violationCounts.set(socket.id, violations + 1);

            if (logViolations) {
              logger.warn(`Rate limit exceeded for event '${event}' from client ${socket.id}: ${rateLimitResult.reason}`);
            }

            // Send rate limit error to client
            socket.emit('rate_limit_exceeded', {
              event: event,
              resetTime: rateLimitResult.resetTime,
              reason: rateLimitResult.reason
            });

            // Disconnect if too many violations
            if (disconnectOnViolation && violations >= violationThreshold) {
              logger.error(`Disconnecting client ${socket.id} due to repeated rate limit violations`);
              socket.disconnect(true);
              return;
            }

            return;
          }

          // Reset violation count on successful event
          violationCounts.set(socket.id, 0);

          // Process the event
          try {
            await handler(data);
          } catch (error) {
            logger.error(`Error in rate-limited handler for event '${event}':`, error);
          }
        };

        return originalOn(event, rateLimitedHandler);
      };

      next();
    };
  }

  /**
   * Release resources held by the service and its store.
   */
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    if (this.store && typeof this.store.destroy === 'function') {
      this.store.destroy();
    }
  }
}

module.exports = new RateLimitService();
module.exports.RateLimitService = RateLimitService;
module.exports.MemoryRateLimitStore = MemoryRateLimitStore;
