/**
 * Tests for the combat-related Joi schemas in validationService.
 *
 * Covers shape rejection, field-name normalisation (turnIndex -> currentTurnIndex),
 * turnOrder sanitisation, and bounded numeric ranges for round / currentTurnIndex.
 */

const { expect } = require('chai');
const { validationSchemas, validateSocketEvent } = require('../services/validationService');

describe('combat validation schemas', () => {
  describe('combat_started', () => {
    it('accepts the canonical combatStore.js emit shape', () => {
      const res = validateSocketEvent('combat_started', {
        roomId: 'r1',
        turnOrder: [
          { tokenId: 't1', name: 'Hero', initiative: 18, agilityMod: 2 },
          { tokenId: 't2', name: 'Goblin', initiative: 12 }
        ],
        round: 1,
        currentTurnIndex: 0,
        timestamp: Date.now()
      });
      expect(res.isValid).to.equal(true);
      expect(res.value.turnOrder).to.have.lengthOf(2);
      expect(res.value.turnOrder[0]).to.include({ tokenId: 't1', agilityMod: 2 });
    });

    it('accepts the GMToolsPanel minimal emit and defaults round/currentTurnIndex', () => {
      const res = validateSocketEvent('combat_started', { turnOrder: [{ tokenId: 't1' }] });
      expect(res.isValid).to.equal(true);
      expect(res.value.round).to.equal(1);
      expect(res.value.currentTurnIndex).to.equal(0);
    });

    it('defaults turnOrder to an empty array when omitted', () => {
      const res = validateSocketEvent('combat_started', {});
      expect(res.isValid).to.equal(true);
      expect(res.value.turnOrder).to.deep.equal([]);
    });

    it('rejects a combatant without tokenId', () => {
      const res = validateSocketEvent('combat_started', {
        turnOrder: [{ name: 'NoToken' }]
      });
      expect(res.isValid).to.equal(false);
    });

    it('rejects round outside the bounded range', () => {
      const res = validateSocketEvent('combat_started', { round: 0 });
      expect(res.isValid).to.equal(false);
      const res2 = validateSocketEvent('combat_started', { round: 999999 });
      expect(res2.isValid).to.equal(false);
    });

    it('rejects currentTurnIndex outside the bounded range', () => {
      const res = validateSocketEvent('combat_started', { currentTurnIndex: -1 });
      expect(res.isValid).to.equal(false);
    });

    it('preserves unknown combatant fields (forward-compat with combatStore richness)', () => {
      const res = validateSocketEvent('combat_started', {
        turnOrder: [{ tokenId: 't1', currentActionPoints: 5, maxActionPoints: 10 }]
      });
      expect(res.isValid).to.equal(true);
      expect(res.value.turnOrder[0].currentActionPoints).to.equal(5);
    });
  });

  describe('combat_ended', () => {
    it('accepts an empty payload', () => {
      expect(validateSocketEvent('combat_ended', {}).isValid).to.equal(true);
    });

    it('accepts a roomId + timestamp payload', () => {
      const res = validateSocketEvent('combat_ended', { roomId: 'r1', timestamp: 123 });
      expect(res.isValid).to.equal(true);
      expect(res.value.roomId).to.equal('r1');
    });

    it('rejects unknown top-level keys', () => {
      const res = validateSocketEvent('combat_ended', { malicious: true });
      expect(res.isValid).to.equal(false);
    });
  });

  describe('combat_turn_changed', () => {
    it('accepts the canonical currentTurnIndex field', () => {
      const res = validateSocketEvent('combat_turn_changed', {
        roomId: 'r1',
        currentTurnIndex: 2,
        round: 3
      });
      expect(res.isValid).to.equal(true);
      expect(res.value.currentTurnIndex).to.equal(2);
    });

    it('normalises legacy turnIndex -> currentTurnIndex', () => {
      const res = validateSocketEvent('combat_turn_changed', { turnIndex: 1 });
      expect(res.isValid).to.equal(true);
      expect(res.value.currentTurnIndex).to.equal(1);
      expect(res.value).to.not.have.property('turnIndex');
    });

    it('rejects when no turn index is provided', () => {
      const res = validateSocketEvent('combat_turn_changed', { round: 2 });
      expect(res.isValid).to.equal(false);
    });

    it('rejects out-of-range currentTurnIndex', () => {
      expect(validateSocketEvent('combat_turn_changed', { currentTurnIndex: -5 }).isValid).to.equal(false);
      expect(validateSocketEvent('combat_turn_changed', { currentTurnIndex: 99999 }).isValid).to.equal(false);
    });
  });

  describe('combat_action (legacy)', () => {
    it('still accepts next_turn / initiative_roll types', () => {
      expect(validationSchemas.combat_action).to.exist;
      expect(
        validateSocketEvent('combat_action', { type: 'next_turn' }).isValid
      ).to.equal(true);
      expect(
        validateSocketEvent('combat_action', { type: 'bogus' }).isValid
      ).to.equal(false);
    });
  });
});
