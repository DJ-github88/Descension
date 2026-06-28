/**
 * Unit tests for the rate-limit storage backends.
 */

const { expect } = require('chai');
const { MemoryRateLimitStore, RedisRateLimitStore } = require('../services/rateLimitStore');

describe('rate limit stores', () => {
  describe('MemoryRateLimitStore', () => {
    let store;

    beforeEach(() => {
      store = new MemoryRateLimitStore();
    });

    afterEach(() => {
      store.destroy();
    });

    it('allows the first event under a fresh window', async () => {
      const result = await store.isAllowed('c1', 'chat_message', { maxPerMinute: 10, maxPerSecond: 1 }, false, Date.now());
      expect(result.allowed).to.equal(true);
      expect(result.remaining).to.equal(0);
    });

    it('blocks the second event when per-second limit is 1', async () => {
      const now = Date.now();
      await store.isAllowed('c1', 'chat_message', { maxPerMinute: 10, maxPerSecond: 1 }, false, now);
      const result = await store.isAllowed('c1', 'chat_message', { maxPerMinute: 10, maxPerSecond: 1 }, false, now);
      expect(result.allowed).to.equal(false);
      expect(result.reason).to.equal('second_limit_exceeded');
    });

    it('blocks when per-minute limit is exhausted', async () => {
      const limits = { maxPerMinute: 2, maxPerSecond: 10 };
      await store.isAllowed('c1', 'chat_message', limits, false, Date.now());
      await store.isAllowed('c1', 'chat_message', limits, false, Date.now());
      const result = await store.isAllowed('c1', 'chat_message', limits, false, Date.now());
      expect(result.allowed).to.equal(false);
      expect(result.reason).to.equal('minute_limit_exceeded');
    });

    it('resets counters after the window elapses', async () => {
      const limits = { maxPerMinute: 10, maxPerSecond: 1 };
      const t0 = Date.now();
      await store.isAllowed('c1', 'chat_message', limits, false, t0);
      const blocked = await store.isAllowed('c1', 'chat_message', limits, false, t0);
      expect(blocked.allowed).to.equal(false);

      const t1 = t0 + 1100;
      const allowed = await store.isAllowed('c1', 'chat_message', limits, false, t1);
      expect(allowed.allowed).to.equal(true);
    });

    it('isolates counters by client and event', async () => {
      const limits = { maxPerMinute: 10, maxPerSecond: 1 };
      await store.isAllowed('c1', 'chat_message', limits, false, Date.now());
      const otherClient = await store.isAllowed('c2', 'chat_message', limits, false, Date.now());
      const otherEvent = await store.isAllowed('c1', 'join_room', limits, false, Date.now());
      expect(otherClient.allowed).to.equal(true);
      expect(otherEvent.allowed).to.equal(true);
    });

    it('resetClient clears counters for a single client', async () => {
      const limits = { maxPerMinute: 10, maxPerSecond: 1 };
      const now = Date.now();
      await store.isAllowed('c1', 'chat_message', limits, false, now);
      await store.isAllowed('c2', 'chat_message', limits, false, now);
      await store.resetClient('c1');

      const c1Again = await store.isAllowed('c1', 'chat_message', limits, false, now);
      const c2Again = await store.isAllowed('c2', 'chat_message', limits, false, now);
      expect(c1Again.allowed).to.equal(true);
      expect(c2Again.allowed).to.equal(false);
    });

    it('cleanup removes stale entries', async () => {
      const now = Date.now();
      await store.isAllowed('c1', 'chat_message', { maxPerMinute: 10, maxPerSecond: 1 }, false, now - 200);
      await store.cleanup(100);
      const status = await store.getStatus('c1', 'chat_message');
      expect(status).to.equal(null);
    });

    it('getStats returns client and event counts', async () => {
      await store.isAllowed('c1', 'chat_message', { maxPerMinute: 10, maxPerSecond: 1 }, false, Date.now());
      await store.isAllowed('c1', 'join_room', { maxPerMinute: 10, maxPerSecond: 1 }, false, Date.now());
      await store.isAllowed('c2', 'chat_message', { maxPerMinute: 10, maxPerSecond: 1 }, false, Date.now());
      const stats = store.getStats();
      expect(stats.totalClients).to.equal(2);
      expect(stats.totalEvents).to.equal(3);
    });
  });

  describe('RedisRateLimitStore', () => {
    function makeRedisClient(overrides = {}) {
      const state = new Map();
      const client = {
        state,
        incr: async (k) => {
          state.set(k, (state.get(k) || 0) + 1);
          return state.get(k);
        },
        expire: async () => {},
        multi: () => {
          const commands = [];
          return {
            incr: (k) => { commands.push(['incr', k]); },
            expire: (k, ttl) => { commands.push(['expire', k, ttl]); },
            exec: async () => {
              for (const [cmd, k] of commands) {
                if (cmd === 'incr') {
                  state.set(k, (state.get(k) || 0) + 1);
                }
              }
              return [state.get(commands[0][1])];
            }
          };
        },
        get: async (k) => String(state.get(k) || 0),
        keys: async (pattern) => Array.from(state.keys()).filter(k => k.startsWith(pattern.replace(/\*/g, ''))),
        del: async (keys) => { keys.forEach(k => state.delete(k)); },
        quit: async () => {},
        ...overrides
      };
      return client;
    }

    it('throws without a redis client', () => {
      expect(() => new RedisRateLimitStore(null)).to.throw(TypeError);
      expect(() => new RedisRateLimitStore({})).to.throw(TypeError);
    });

    it('allows events until per-second limit is exceeded', async () => {
      const redis = makeRedisClient();
      const store = new RedisRateLimitStore(redis);
      const limits = { maxPerMinute: 10, maxPerSecond: 2 };
      const now = Date.now();

      const r1 = await store.isAllowed('c1', 'chat_message', limits, false, now);
      expect(r1.allowed).to.equal(true);

      const r2 = await store.isAllowed('c1', 'chat_message', limits, false, now);
      expect(r2.allowed).to.equal(true);

      const r3 = await store.isAllowed('c1', 'chat_message', limits, false, now);
      expect(r3.allowed).to.equal(false);
      expect(r3.reason).to.equal('second_limit_exceeded');

      store.destroy();
    });

    it('uses fallback incr+expire when multi() is unavailable', async () => {
      const redis = makeRedisClient();
      delete redis.multi;
      const store = new RedisRateLimitStore(redis);
      const r = await store.isAllowed('c1', 'chat_message', { maxPerMinute: 10, maxPerSecond: 2 }, false, Date.now());
      expect(r.allowed).to.equal(true);
      store.destroy();
    });

    it('resetClient deletes matching keys', async () => {
      const redis = makeRedisClient();
      const store = new RedisRateLimitStore(redis);
      await store.isAllowed('c1', 'chat_message', { maxPerMinute: 10, maxPerSecond: 10 }, false, Date.now());
      await store.isAllowed('c2', 'chat_message', { maxPerMinute: 10, maxPerSecond: 10 }, false, Date.now());
      await store.resetClient('c1');
      const remaining = Array.from(redis.state.keys()).filter(k => k.startsWith('rl:c1:')).length;
      expect(remaining).to.equal(0);
      const other = Array.from(redis.state.keys()).filter(k => k.startsWith('rl:c2:')).length;
      expect(other).to.be.greaterThan(0);
      store.destroy();
    });

    it('getStatus returns current bucket counts', async () => {
      const redis = makeRedisClient();
      const store = new RedisRateLimitStore(redis);
      await store.isAllowed('c1', 'chat_message', { maxPerMinute: 10, maxPerSecond: 10 }, false, Date.now());
      await store.isAllowed('c1', 'chat_message', { maxPerMinute: 10, maxPerSecond: 10 }, false, Date.now());
      const status = await store.getStatus('c1', 'chat_message');
      expect(status.minuteCount).to.equal(2);
      expect(status.secondCount).to.equal(2);
      store.destroy();
    });
  });
});
