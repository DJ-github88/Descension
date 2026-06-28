/**
 * Unit tests for RateLimitService with the pluggable store backend.
 */

const { expect } = require('chai');
const rateLimitModule = require('../services/rateLimitService');
const { RateLimitService } = rateLimitModule;
const { MemoryRateLimitStore } = require('../services/rateLimitStore');

describe('RateLimitService', () => {
  let service;

  beforeEach(() => {
    service = new RateLimitService();
  });

  afterEach(() => {
    service.destroy();
  });

  it('uses the MemoryRateLimitStore by default', async () => {
    expect(service.store).to.be.instanceOf(MemoryRateLimitStore);
  });

  it('applies GM multiplier to limits', async () => {
    const now = Date.now();
    const playerLimit = { maxPerMinute: 10, maxPerSecond: 2 };
    service.updateEventLimits('custom_event', playerLimit);

    for (let i = 0; i < 2; i++) {
      const r = await service.checkRateLimit('c1', 'custom_event', false);
      expect(r.allowed).to.equal(true);
    }
    const playerBlocked = await service.checkRateLimit('c1', 'custom_event', false);
    expect(playerBlocked.allowed).to.equal(false);

    const gmAllowed = await service.checkRateLimit('c2', 'custom_event', true);
    expect(gmAllowed.allowed).to.equal(true);
  });

  it('falls back to default limits for unknown events', async () => {
    const r = await service.checkRateLimit('c1', 'totally_unknown_event_xyz', false);
    expect(r.allowed).to.equal(true);
  });

  it('can swap stores at runtime', async () => {
    const customStore = {
      isAllowed: async () => ({ allowed: false, resetTime: Date.now(), remaining: 0, reason: 'custom_store' }),
      getStatus: async () => null,
      resetClient: async () => {},
      cleanup: async () => {},
      getStats: () => ({ totalClients: 42, totalEvents: 99 }),
      destroy: () => {}
    };

    service.setStore(customStore);
    const r = await service.checkRateLimit('c1', 'chat_message', false);
    expect(r.allowed).to.equal(false);
    expect(r.reason).to.equal('custom_store');

    const stats = service.getStats();
    expect(stats.totalClients).to.equal(42);
    expect(stats.totalEvents).to.equal(99);
  });

  it('resetClientLimits delegates to the store', async () => {
    let resetCalled = false;
    service.setStore({
      isAllowed: async () => ({ allowed: true, resetTime: Date.now(), remaining: 0 }),
      getStatus: async () => null,
      resetClient: async (clientId) => { resetCalled = clientId; },
      cleanup: async () => {},
      getStats: () => ({}),
      destroy: () => {}
    });

    await service.resetClientLimits('c1');
    expect(resetCalled).to.equal('c1');
  });

  it('cleanupOldEntries delegates to the store', async () => {
    let cleanupCalled = false;
    service.setStore({
      isAllowed: async () => ({ allowed: true, resetTime: Date.now(), remaining: 0 }),
      getStatus: async () => null,
      resetClient: async () => {},
      cleanup: async (maxAgeMs) => { cleanupCalled = maxAgeMs; },
      getStats: () => ({}),
      destroy: () => {}
    });

    await service.cleanupOldEntries();
    expect(cleanupCalled).to.equal(30 * 60 * 1000);
  });

  it('getRateLimitStatus returns zeroed defaults for unseen clients', async () => {
    const status = await service.getRateLimitStatus('new-client', 'chat_message');
    expect(status.minuteCount).to.equal(0);
    expect(status.secondCount).to.equal(0);
    expect(status.limits).to.deep.equal(service.rateLimits.chat_message);
  });

  it('getRateLimitStatus includes timestamps from the memory store', async () => {
    const now = Date.now();
    await service.checkRateLimit('c1', 'chat_message', false);
    const status = await service.getRateLimitStatus('c1', 'chat_message');
    expect(status.minuteCount).to.equal(1);
    expect(status.lastMinuteReset).to.be.at.least(now);
    expect(status.lastSecondReset).to.be.at.least(now);
  });
});
