/**
 * Rate-limit storage backends.
 *
 * RateLimitService delegates all counter state to a store. The default
 * MemoryRateLimitStore preserves the existing single-server behaviour.
 * RedisRateLimitStore is provided for multi-server deployments once Redis is
 * provisioned.
 */

const logger = require('./logger');

/**
 * In-memory rate limit store. Per-client, per-event fixed windows for minute
 * and second granularity. This is the historical default used by
 * RateLimitService before the store abstraction.
 */
class MemoryRateLimitStore {
  constructor() {
    this.eventCounts = new Map();
  }

  async isAllowed(clientId, eventType, limits, _isGM, now) {
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

    if (now - eventTracking.lastMinuteReset >= 60000) {
      eventTracking.minuteCount = 0;
      eventTracking.lastMinuteReset = now;
    }

    if (now - eventTracking.lastSecondReset >= 1000) {
      eventTracking.secondCount = 0;
      eventTracking.lastSecondReset = now;
    }

    const minuteRemaining = limits.maxPerMinute - eventTracking.minuteCount;
    const secondRemaining = limits.maxPerSecond - eventTracking.secondCount;

    if (eventTracking.minuteCount >= limits.maxPerMinute) {
      return {
        allowed: false,
        resetTime: eventTracking.lastMinuteReset + 60000,
        remaining: 0,
        reason: 'minute_limit_exceeded'
      };
    }

    if (eventTracking.secondCount >= limits.maxPerSecond) {
      return {
        allowed: false,
        resetTime: eventTracking.lastSecondReset + 1000,
        remaining: 0,
        reason: 'second_limit_exceeded'
      };
    }

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

  async getStatus(clientId, eventType) {
    if (!this.eventCounts.has(clientId)) {
      return null;
    }

    const clientEvents = this.eventCounts.get(clientId);
    const eventTracking = clientEvents.get(eventType);

    if (!eventTracking) {
      return null;
    }

    return {
      minuteCount: eventTracking.minuteCount,
      secondCount: eventTracking.secondCount,
      lastMinuteReset: eventTracking.lastMinuteReset,
      lastSecondReset: eventTracking.lastSecondReset
    };
  }

  async resetClient(clientId) {
    if (this.eventCounts.has(clientId)) {
      this.eventCounts.get(clientId).clear();
      logger.info(`Reset rate limits for client ${clientId}`);
    }
  }

  async cleanup(maxAgeMs) {
    const now = Date.now();
    let cleanedClients = 0;
    let cleanedEvents = 0;

    for (const [clientId, clientEvents] of this.eventCounts.entries()) {
      let hasActiveEvents = false;

      for (const [eventType, eventTracking] of clientEvents.entries()) {
        const age = now - Math.max(eventTracking.lastMinuteReset, eventTracking.lastSecondReset);

        if (age > maxAgeMs) {
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
      logger.info(`Rate limit cleanup: removed ${cleanedClients} clients and ${cleanedEvents} event types`);
    }
  }

  getStats() {
    const totalClients = this.eventCounts.size;
    let totalEvents = 0;

    for (const clientEvents of this.eventCounts.values()) {
      totalEvents += clientEvents.size;
    }

    return { totalClients, totalEvents };
  }

  destroy() {
    this.eventCounts.clear();
  }
}

/**
 * Redis-backed rate limit store for multi-server deployments.
 *
 * Uses fixed windows keyed by the current minute/second bucket. Each key is
 * incremented with INCR and given a TTL equal to the window length so stale
 * counters expire automatically.
 *
 * The `redisClient` must be a connected node-redis (v4+) client with `get`,
 * `incr`, `expire`, `del`, and `quit` methods. This store is only instantiated
 * when REDIS_URL is configured.
 */
class RedisRateLimitStore {
  constructor(redisClient) {
    if (!redisClient ||
        (typeof redisClient.multi !== 'function' && typeof redisClient.incr !== 'function')) {
      throw new TypeError('RedisRateLimitStore requires a connected Redis client');
    }
    this.redis = redisClient;
  }

  _key(clientId, eventType, window, bucket) {
    return `rl:${clientId}:${eventType}:${window}:${bucket}`;
  }

  _bucket(now, windowMs) {
    return Math.floor(now / windowMs);
  }

  async isAllowed(clientId, eventType, limits, _isGM, now) {
    const minuteBucket = this._bucket(now, 60000);
    const secondBucket = this._bucket(now, 1000);

    const minuteKey = this._key(clientId, eventType, 'minute', minuteBucket);
    const secondKey = this._key(clientId, eventType, 'second', secondBucket);

    const [minuteCount, secondCount] = await Promise.all([
      this._increment(minuteKey, 60),
      this._increment(secondKey, 1)
    ]);

    if (minuteCount > limits.maxPerMinute) {
      return {
        allowed: false,
        resetTime: (minuteBucket + 1) * 60000,
        remaining: 0,
        reason: 'minute_limit_exceeded'
      };
    }

    if (secondCount > limits.maxPerSecond) {
      return {
        allowed: false,
        resetTime: (secondBucket + 1) * 1000,
        remaining: 0,
        reason: 'second_limit_exceeded'
      };
    }

    return {
      allowed: true,
      resetTime: Math.min((minuteBucket + 1) * 60000, (secondBucket + 1) * 1000),
      remaining: Math.min(
        Math.max(0, limits.maxPerMinute - minuteCount),
        Math.max(0, limits.maxPerSecond - secondCount)
      )
    };
  }

  async _increment(key, ttlSeconds) {
    const pipeline = this.redis.multi && typeof this.redis.multi === 'function'
      ? this.redis.multi()
      : null;

    if (pipeline && typeof pipeline.incr === 'function' && typeof pipeline.expire === 'function') {
      pipeline.incr(key);
      pipeline.expire(key, ttlSeconds);
      const result = await pipeline.exec();
      return result[0];
    }

    const count = await this.redis.incr(key);
    await this.redis.expire(key, ttlSeconds);
    return count;
  }

  async getStatus(clientId, eventType) {
    const now = Date.now();
    const minuteKey = this._key(clientId, eventType, 'minute', this._bucket(now, 60000));
    const secondKey = this._key(clientId, eventType, 'second', this._bucket(now, 1000));

    const [minuteCount, secondCount] = await Promise.all([
      this.redis.get(minuteKey).then(v => parseInt(v || '0', 10)),
      this.redis.get(secondKey).then(v => parseInt(v || '0', 10))
    ]);

    return { minuteCount, secondCount };
  }

  async resetClient(clientId) {
    const pattern = `rl:${clientId}:*`;
    if (typeof this.redis.keys === 'function') {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(keys);
      }
    }
    logger.info(`Reset Redis rate limits for client ${clientId}`);
  }

  async cleanup(_maxAgeMs) {
    // Redis TTL handles expiry; no manual cleanup required.
  }

  getStats() {
    // Returning static shape; full stats would require SCAN over rl:* keys.
    return { totalClients: null, totalEvents: null };
  }

  destroy() {
    if (this.redis && typeof this.redis.quit === 'function') {
      this.redis.quit().catch(() => {});
    }
  }
}

module.exports = {
  MemoryRateLimitStore,
  RedisRateLimitStore
};
