/**
 * Unit tests for server/services/deltaSyncCapabilities.
 *
 * The capabilities map is emitted in every room_created / room_joined event so
 * clients can auto-detect which categories are delta-synced. These tests guard
 * the env-var read and the shape of the returned object.
 */

const { expect } = require('chai');
const {
  getDeltaSyncCapabilities,
  isDeltaSyncEnabled,
  DELTA_SYNC_CATEGORIES
} = require('../services/deltaSyncCapabilities');

describe('deltaSyncCapabilities', () => {
  const ENV_FLAGS = {
    tokens: 'ENABLE_TOKENS_DELTA'
  };

  let saved;

  before(() => {
    saved = {};
    for (const flag of Object.values(ENV_FLAGS)) {
      saved[flag] = process.env[flag];
      delete process.env[flag];
    }
  });

  after(() => {
    for (const [flag, value] of Object.entries(saved)) {
      if (value === undefined) delete process.env[flag];
      else process.env[flag] = value;
    }
  });

  describe('getDeltaSyncCapabilities', () => {
    it('returns an object with every declared category', () => {
      const caps = getDeltaSyncCapabilities();
      for (const cat of DELTA_SYNC_CATEGORIES) {
        expect(caps).to.have.property(cat);
      }
    });

    it('returns false for every category when env is unset', () => {
      for (const flag of Object.values(ENV_FLAGS)) {
        delete process.env[flag];
      }
      const caps = getDeltaSyncCapabilities();
      for (const cat of DELTA_SYNC_CATEGORIES) {
        expect(caps[cat]).to.equal(false);
      }
    });

    it('returns true only when env is the literal string "true"', () => {
      process.env.ENABLE_TOKENS_DELTA = 'true';
      expect(getDeltaSyncCapabilities().tokens).to.equal(true);

      process.env.ENABLE_TOKENS_DELTA = '1';
      expect(getDeltaSyncCapabilities().tokens).to.equal(false);

      process.env.ENABLE_TOKENS_DELTA = 'TRUE';
      expect(getDeltaSyncCapabilities().tokens).to.equal(false);

      process.env.ENABLE_TOKENS_DELTA = 'false';
      expect(getDeltaSyncCapabilities().tokens).to.equal(false);

      delete process.env.ENABLE_TOKENS_DELTA;
    });
  });

  describe('isDeltaSyncEnabled', () => {
    it('returns true when the category is enabled', () => {
      process.env.ENABLE_TOKENS_DELTA = 'true';
      expect(isDeltaSyncEnabled('tokens')).to.equal(true);
      delete process.env.ENABLE_TOKENS_DELTA;
    });

    it('returns false when the category is disabled', () => {
      delete process.env.ENABLE_TOKENS_DELTA;
      expect(isDeltaSyncEnabled('tokens')).to.equal(false);
    });

    it('returns false for unknown categories', () => {
      expect(isDeltaSyncEnabled('not-a-real-category')).to.equal(false);
    });
  });
});
