/**
 * Rate Limiting Service
 * Prevents spam and abuse by limiting the frequency of socket events
 */

class RateLimitService {
  constructor() {
    // Rate limit configurations per event type
    this.rateLimits = {
      // Chat events - allow frequent but not spam
      chat_message: { maxPerMinute: 30, maxPerSecond: 3 },
      global_chat_message: { maxPerMinute: 10, maxPerSecond: 1 },
      whisper_message: { maxPerMinute: 20, maxPerSecond: 2 },

      // Token movement - high frequency but throttle aggressive spam
      token_moved: { maxPerMinute: 300, maxPerSecond: 10 },
      character_moved: { maxPerMinute: 300, maxPerSecond: 10 },

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

    // In-memory storage for rate limiting (consider Redis for production)
    this.eventCounts = new Map(); // clientId -> { eventType -> { minute: count, second: count, lastReset: timestamp } }

    // Cleanup old entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupOldEntries();
    }, 5 * 60 * 1000);
  }

  /**
   * Check if an event should be rate limited
   * @param {string} clientId - Socket client ID
   * @param {string} eventType - The event type
   * @param {boolean} isGM - Whether the client is a GM (less restrictive)
   * @returns {Object} - { allowed: boolean, resetTime: number, remaining: number }
   */
  checkRateLimit(clientId, eventType, isGM = false) {
    const now = Date.now();
    const limits = this.rateLimits[eventType] || this.rateLimits.default;

    // GMs get slightly higher limits (1.5x)
    const adjustedLimits = isGM ? {
      maxPerMinute: Math.floor(limits.maxPerMinute * 1.5),
      maxPerSecond: Math.floor(limits.maxPerSecond * 1.5)
    } : limits;

    // Initialize client tracking if needed
    if (!this.eventCounts.has(clientId)) {
      this.eventCounts.set(clientId, new Map());
    }

    const clientEvents = this.eventCounts.get(clientId);

    if (!clientEvents.has(eventType)) {
      clientEvents.set(eventType, {
        minuteCount: 0,
        secondCount: 0,
        lastMinuteReset: now,
        lastSecondReset: now
      });
    }

    const eventTracking = clientEvents.get(eventType);

    // Reset counters if needed
    if (now - eventTracking.lastMinuteReset >= 60000) { // 1 minute
      eventTracking.minuteCount = 0;
      eventTracking.lastMinuteReset = now;
    }

    if (now - eventTracking.lastSecondReset >= 1000) { // 1 second
      eventTracking.secondCount = 0;
      eventTracking.lastSecondReset = now;
    }

    // Check limits
    const minuteRemaining = adjustedLimits.maxPerMinute - eventTracking.minuteCount;
    const secondRemaining = adjustedLimits.maxPerSecond - eventTracking.secondCount;

    if (eventTracking.minuteCount >= adjustedLimits.maxPerMinute) {
      const resetTime = eventTracking.lastMinuteReset + 60000;
      return {
        allowed: false,
        resetTime: resetTime,
        remaining: 0,
        reason: 'minute_limit_exceeded'
      };
    }

    if (eventTracking.secondCount >= adjustedLimits.maxPerSecond) {
      const resetTime = eventTracking.lastSecondReset + 1000;
      return {
        allowed: false,
        resetTime: resetTime,
        remaining: 0,
        reason: 'second_limit_exceeded'
      };
    }

    // Event is allowed, increment counters
    eventTracking.minuteCount++;
    eventTracking.secondCount++;

    return {
      allowed: true,
      resetTime: Math.min(
        eventTracking.lastMinuteReset + 60000,
        eventTracking.lastSecondReset + 1000
      ),
      remaining: Math.min(minuteRemaining - 1, secondRemaining - 1)
    };
  }

  /**
   * Get rate limit status for a client and event type
   * @param {string} clientId - Socket client ID
   * @param {string} eventType - The event type
   * @returns {Object} - Current rate limit status
   */
  getRateLimitStatus(clientId, eventType) {
    if (!this.eventCounts.has(clientId)) {
      return { minuteCount: 0, secondCount: 0, limits: this.rateLimits[eventType] || this.rateLimits.default };
    }

    const clientEvents = this.eventCounts.get(clientId);
    const eventTracking = clientEvents.get(eventType);

    if (!eventTracking) {
      return { minuteCount: 0, secondCount: 0, limits: this.rateLimits[eventType] || this.rateLimits.default };
    }

    return {
      minuteCount: eventTracking.minuteCount,
      secondCount: eventTracking.secondCount,
      limits: this.rateLimits[eventType] || this.rateLimits.default,
      lastMinuteReset: eventTracking.lastMinuteReset,
      lastSecondReset: eventTracking.lastSecondReset
    };
  }

  /**
   * Reset rate limits for a client (useful for testing or admin actions)
   * @param {string} clientId - Socket client ID
   */
  resetClientLimits(clientId) {
    if (this.eventCounts.has(clientId)) {
      this.eventCounts.get(clientId).clear();
      console.log(`🧹 Reset rate limits for client ${clientId}`);
    }
  }

  /**
   * Update rate limits for an event type
   * @param {string} eventType - The event type
   * @param {Object} limits - New limits { maxPerMinute, maxPerSecond }
   */
  updateEventLimits(eventType, limits) {
    if (limits.maxPerMinute && limits.maxPerSecond) {
      this.rateLimits[eventType] = limits;
      console.log(`📊 Updated rate limits for ${eventType}:`, limits);
    }
  }

  /**
   * Clean up old entries to prevent memory leaks
   */
  cleanupOldEntries() {
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30 minutes
    let cleanedClients = 0;
    let cleanedEvents = 0;

    for (const [clientId, clientEvents] of this.eventCounts.entries()) {
      let hasActiveEvents = false;

      for (const [eventType, eventTracking] of clientEvents.entries()) {
        const age = now - Math.max(eventTracking.lastMinuteReset, eventTracking.lastSecondReset);

        if (age > maxAge) {
          clientEvents.delete(eventType);
          cleanedEvents++;
        } else {
          hasActiveEvents = true;
        }
      }

      if (!hasActiveEvents) {
        this.eventCounts.delete(clientId);
        cleanedClients++;
      }
    }

    if (cleanedClients > 0 || cleanedEvents > 0) {
      console.log(`🧹 Rate limit cleanup: removed ${cleanedClients} clients and ${cleanedEvents} event types`);
    }
  }

  /**
   * Get statistics about rate limiting
   * @returns {Object} - Statistics
   */
  getStats() {
    const totalClients = this.eventCounts.size;
    let totalEvents = 0;
    const rateLimitedEvents = 0;

    for (const clientEvents of this.eventCounts.values()) {
      totalEvents += clientEvents.size;
    }

    return {
      totalClients,
      totalEvents,
      rateLimitedEvents, // Would need to track this separately
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

      socket.on = (event, handler) => {
        const rateLimitedHandler = async (data) => {
          const playerInfo = getPlayerInfo();
          const isGM = playerInfo?.isGM || false;

          const rateLimitResult = this.checkRateLimit(socket.id, event, isGM);

          if (!rateLimitResult.allowed) {
            // Track violations
            const violations = violationCounts.get(socket.id) || 0;
            violationCounts.set(socket.id, violations + 1);

            if (logViolations) {
              console.warn(`🚫 Rate limit exceeded for event '${event}' from client ${socket.id}: ${rateLimitResult.reason}`);
            }

            // Send rate limit error to client
            socket.emit('rate_limit_exceeded', {
              event: event,
              resetTime: rateLimitResult.resetTime,
              reason: rateLimitResult.reason
            });

            // Disconnect if too many violations
            if (disconnectOnViolation && violations >= violationThreshold) {
              console.error(`🚫 Disconnecting client ${socket.id} due to repeated rate limit violations`);
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
            console.error(`Error in rate-limited handler for event '${event}':`, error);
          }
        };

        return originalOn(event, rateLimitedHandler);
      };

      next();
    };
  }
}

module.exports = new RateLimitService();
