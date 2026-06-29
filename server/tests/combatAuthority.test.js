/**
 * Tests for combatAuthority service.
 *
 * Default behaviour (no env flag): every check returns allowed:true to preserve
 * the cooperative-VTT trust model. With COMBAT_AUTHORITY_ENFORCEMENT=true:
 *   - start/end is GM-only
 *   - turn change is GM-or-current-turn-holder
 */

const { expect } = require('chai');
const authority = require('../services/combatAuthority');

const { canStartOrEndCombat, canChangeTurn, _combatantControllerMatches } = authority;

const originalFlag = process.env.COMBAT_AUTHORITY_ENFORCEMENT;

describe('combatAuthority', () => {
  afterEach(() => {
    if (originalFlag === undefined) delete process.env.COMBAT_AUTHORITY_ENFORCEMENT;
    else process.env.COMBAT_AUTHORITY_ENFORCEMENT = originalFlag;
  });

  describe('when authority is disabled (default)', () => {
    beforeEach(() => delete process.env.COMBAT_AUTHORITY_ENFORCEMENT);

    it('allows anyone to start/end combat', () => {
      const r = canStartOrEndCombat({ id: 'p1', isGM: false }, {});
      expect(r.allowed).to.equal(true);
    });

    it('allows anyone to change turn', () => {
      const r = canChangeTurn({ id: 'p1', isGM: false }, { gameState: { combat: { isActive: true } } });
      expect(r.allowed).to.equal(true);
    });
  });

  describe('when authority is enabled', () => {
    beforeEach(() => { process.env.COMBAT_AUTHORITY_ENFORCEMENT = 'true'; });

    describe('canStartOrEndCombat', () => {
      it('allows GM via isGM flag', () => {
        const r = canStartOrEndCombat({ id: 'p1', isGM: true }, {});
        expect(r.allowed).to.equal(true);
      });

      it('allows GM via room.gm.socketId', () => {
        const r = canStartOrEndCombat(
          { id: 'p1', socketId: 's1', isGM: false },
          { gm: { socketId: 's1' } }
        );
        expect(r.allowed).to.equal(true);
      });

      it('rejects non-GM players', () => {
        const r = canStartOrEndCombat({ id: 'p1', isGM: false }, { gm: { socketId: 'other' } });
        expect(r.allowed).to.equal(false);
        expect(r.reason).to.equal('gm_only');
      });

      it('rejects when player is null', () => {
        const r = canStartOrEndCombat(null, {});
        expect(r.allowed).to.equal(false);
        expect(r.reason).to.equal('unknown_player');
      });
    });

    describe('canChangeTurn', () => {
      const room = (turnOverride) => ({
        gm: { id: 'gm-1' },
        gameState: {
          combat: {
            isActive: true,
            currentTurnIndex: 0,
            turnOrder: [
              { tokenId: 't1', playerId: 'p1' },
              { tokenId: 't2', playerId: 'p2' }
            ]
          }
        }
      });

      it('allows GM', () => {
        const r = canChangeTurn({ id: 'gm-1', isGM: false }, { gm: { id: 'gm-1' } });
        expect(r.allowed).to.equal(true);
      });

      it('allows the current turn holder', () => {
        const r = canChangeTurn({ id: 'p1', isGM: false }, room());
        expect(r.allowed).to.equal(true);
      });

      it('rejects a non-holder, non-GM player', () => {
        const r = canChangeTurn({ id: 'p2', isGM: false }, room());
        expect(r.allowed).to.equal(false);
        expect(r.reason).to.equal('not_turn_holder');
      });

      it('allows anyone when current combatant has no controller (NPC)', () => {
        const npcRoom = {
          gm: { id: 'gm-1' },
          gameState: {
            combat: {
              isActive: true,
              currentTurnIndex: 0,
              turnOrder: [{ tokenId: 'npc-1' }]
            }
          }
        };
        const r = canChangeTurn({ id: 'p1', isGM: false }, npcRoom);
        expect(r.allowed).to.equal(true);
      });

      it('rejects when combat is not active (no current combatant)', () => {
        const inactiveRoom = {
          gm: { id: 'gm-1' },
          gameState: { combat: { isActive: false } }
        };
        const r = canChangeTurn({ id: 'p1', isGM: false }, inactiveRoom);
        expect(r.allowed).to.equal(false);
      });
    });

    describe('_combatantControllerMatches', () => {
      it('matches on playerId', () => {
        expect(_combatantControllerMatches({ playerId: 'p1' }, { id: 'p1' })).to.equal(true);
      });

      it('matches on characterId', () => {
        expect(_combatantControllerMatches({ characterId: 'c1' }, { id: 'c1' })).to.equal(true);
      });

      it('returns true for unowned combatants', () => {
        expect(_combatantControllerMatches({ tokenId: 't1' }, { id: 'p1' })).to.equal(true);
      });

      it('returns false for explicit mismatch', () => {
        expect(_combatantControllerMatches({ playerId: 'p2' }, { id: 'p1' })).to.equal(false);
      });
    });
  });
});
