/**
 * Handler-level tests for combatHandlers.js.
 *
 * Drives the real registered handlers via a captured-`socket.on` harness,
 * covering:
 *   - field-name normalisation (combat_turn_changed accepts currentTurnIndex)
 *   - out-of-range rejection
 *   - combat-active guard
 *   - authority gating (COMBAT_AUTHORITY_ENFORCEMENT env)
 *   - ack callback contracts
 *   - broadcast shape (canonical currentTurnIndex + turnOrder)
 */

const { expect } = require('chai');
const sinon = require('sinon');
const { registerCombatHandlers } = require('../handlers/combatHandlers');

const originalAuthFlag = process.env.COMBAT_AUTHORITY_ENFORCEMENT;

function makeCtx(overrides = {}) {
  const handlers = {};
  const emitted = [];
  const socket = {
    id: 'sock-1',
    emit: sinon.stub().callsFake((event, payload) => emitted.push({ event, payload })),
    to: sinon.stub().returnsThis(),
    on: sinon.stub().callsFake((event, handler) => { handlers[event] = handler; }),
    player: { id: 'p1', name: 'P1' }
  };

  const ioEmits = [];
  const io = {
    to: sinon.stub().returns({
      emit: sinon.stub().callsFake((event, payload) => ioEmits.push({ event, payload }))
    })
  };

  const firebaseBatchWriter = {
    queueWrite: sinon.stub().resolves()
  };

  const logger = {
    info: sinon.stub(),
    warn: sinon.stub(),
    error: sinon.stub()
  };

  return {
    handlers,
    emitted,
    ioEmits,
    ctx: {
      io,
      socket,
      logger,
      validateRoomMembership: overrides.validateRoomMembership || (() => ({ valid: true, player: socket.player, room: { id: 'r1', gameState: { combat: { isActive: true, currentTurnIndex: 0, turnOrder: [{ tokenId: 't1', playerId: 'p1' }, { tokenId: 't2', playerId: 'p2' }] } } } })),
      firebaseBatchWriter,
      ...overrides.ctx
    }
  };
}

describe('combatHandlers', () => {
  afterEach(() => {
    if (originalAuthFlag === undefined) delete process.env.COMBAT_AUTHORITY_ENFORCEMENT;
    else process.env.COMBAT_AUTHORITY_ENFORCEMENT = originalAuthFlag;
  });

  describe('combat_started', () => {
    it('stores combat state and broadcasts on success', () => {
      const { handlers, ctx, ioEmits } = makeCtx({
        ctx: { validateRoomMembership: undefined }
      });
      const storedRoom = { id: 'r1', gameState: { combat: { isActive: false } } };
      ctx.validateRoomMembership = () => ({ valid: true, player: { id: 'p1' }, room: storedRoom });
      registerCombatHandlers(ctx);

      handlers.combat_started({
        roomId: 'r1',
        turnOrder: [{ tokenId: 't1' }, { tokenId: 't2' }],
        round: 1,
        currentTurnIndex: 0
      });

      expect(storedRoom.gameState.combat.isActive).to.equal(true);
      expect(storedRoom.gameState.combat.turnOrder).to.have.lengthOf(2);
      expect(ioEmits[0].event).to.equal('combat_started');
      expect(ioEmits[0].payload.combat).to.exist;
    });

    it('clamps currentTurnIndex into the valid range', () => {
      const { handlers, ctx } = makeCtx();
      const storedRoom = { id: 'r1', gameState: { combat: { isActive: false } } };
      ctx.validateRoomMembership = () => ({ valid: true, player: { id: 'p1' }, room: storedRoom });
      registerCombatHandlers(ctx);

      handlers.combat_started({
        roomId: 'r1',
        turnOrder: [{ tokenId: 't1' }],
        currentTurnIndex: 99
      });

      expect(storedRoom.gameState.combat.currentTurnIndex).to.equal(0);
    });

    it('invokes ack callback with success=false when room membership fails', () => {
      const { handlers, ctx } = makeCtx();
      ctx.validateRoomMembership = () => ({ valid: false, error: 'nope' });
      registerCombatHandlers(ctx);

      const ack = sinon.stub();
      handlers.combat_started({ roomId: 'r1' }, ack);

      expect(ack.calledOnce).to.equal(true);
      expect(ack.firstCall.args[0].success).to.equal(false);
    });

    it('rejects non-GM when COMBAT_AUTHORITY_ENFORCEMENT is enabled', () => {
      process.env.COMBAT_AUTHORITY_ENFORCEMENT = 'true';
      const { handlers, ctx, ioEmits } = makeCtx();
      const storedRoom = { id: 'r1', gameState: {}, gm: { id: 'someone-else' } };
      ctx.validateRoomMembership = () => ({ valid: true, player: { id: 'p1', isGM: false }, room: storedRoom });
      registerCombatHandlers(ctx);

      const ack = sinon.stub();
      handlers.combat_started({ roomId: 'r1', turnOrder: [{ tokenId: 't1' }] }, ack);

      expect(storedRoom.gameState.combat).to.not.exist;
      expect(ioEmits).to.have.lengthOf(0);
      expect(ack.firstCall.args[0].success).to.equal(false);
      expect(ack.firstCall.args[0].error).to.equal('gm_only');
    });
  });

  describe('combat_turn_changed', () => {
    it('reads currentTurnIndex (canonical) and broadcasts turnOrder for receivers', () => {
      const turnOrder = [{ tokenId: 't1', playerId: 'p1' }, { tokenId: 't2', playerId: 'p2' }];
      const storedRoom = {
        id: 'r1', isPermanent: false,
        gameState: { combat: { isActive: true, currentTurnIndex: 0, round: 1, turnOrder } }
      };
      const { handlers, ctx, ioEmits } = makeCtx();
      ctx.validateRoomMembership = () => ({ valid: true, player: { id: 'p1' }, room: storedRoom });
      registerCombatHandlers(ctx);

      handlers.combat_turn_changed({ roomId: 'r1', currentTurnIndex: 1, round: 1 });

      expect(storedRoom.gameState.combat.currentTurnIndex).to.equal(1);
      expect(ioEmits).to.have.lengthOf(1);
      expect(ioEmits[0].payload).to.deep.equal({
        currentTurnIndex: 1,
        round: 1,
        turnOrder
      });
    });

    it('ignores turn change when combat is not active', () => {
      const storedRoom = { id: 'r1', gameState: { combat: { isActive: false } } };
      const { handlers, ctx, ioEmits } = makeCtx();
      ctx.validateRoomMembership = () => ({ valid: true, player: { id: 'p1' }, room: storedRoom });
      registerCombatHandlers(ctx);

      handlers.combat_turn_changed({ roomId: 'r1', currentTurnIndex: 1 });

      expect(ioEmits).to.have.lengthOf(0);
    });

    it('rejects out-of-range currentTurnIndex', () => {
      const storedRoom = {
        id: 'r1',
        gameState: { combat: { isActive: true, currentTurnIndex: 0, turnOrder: [{ tokenId: 't1' }] } }
      };
      const { handlers, ctx, ioEmits } = makeCtx();
      ctx.validateRoomMembership = () => ({ valid: true, player: { id: 'p1' }, room: storedRoom });
      registerCombatHandlers(ctx);

      handlers.combat_turn_changed({ roomId: 'r1', currentTurnIndex: 99 });

      expect(storedRoom.gameState.combat.currentTurnIndex).to.equal(0);
      expect(ioEmits).to.have.lengthOf(0);
    });

    it('emits combat_turn_rejected when authority check fails', () => {
      process.env.COMBAT_AUTHORITY_ENFORCEMENT = 'true';
      const storedRoom = {
        id: 'r1', gm: { id: 'gm-1' },
        gameState: {
          combat: {
            isActive: true, currentTurnIndex: 0, round: 1,
            turnOrder: [{ tokenId: 't1', playerId: 'someone-else' }]
          }
        }
      };
      const { handlers, ctx, emitted, ioEmits } = makeCtx();
      ctx.validateRoomMembership = () => ({ valid: true, player: { id: 'p2', isGM: false }, room: storedRoom });
      registerCombatHandlers(ctx);

      handlers.combat_turn_changed({ roomId: 'r1', currentTurnIndex: 0 });

      expect(ioEmits).to.have.lengthOf(0);
      const rejection = emitted.find(e => e.event === 'combat_turn_rejected');
      expect(rejection).to.exist;
      expect(rejection.payload.reason).to.equal('not_turn_holder');
    });

    it('persists via firebaseBatchWriter for permanent rooms', () => {
      const turnOrder = [{ tokenId: 't1' }, { tokenId: 't2' }];
      const storedRoom = {
        id: 'r1', isPermanent: true,
        gameState: { combat: { isActive: true, currentTurnIndex: 0, round: 1, turnOrder } }
      };
      const { handlers, ctx } = makeCtx();
      ctx.validateRoomMembership = () => ({ valid: true, player: { id: 'p1' }, room: storedRoom });
      registerCombatHandlers(ctx);

      handlers.combat_turn_changed({ roomId: 'r1', currentTurnIndex: 1 });

      expect(ctx.firebaseBatchWriter.queueWrite.calledOnce).to.equal(true);
    });
  });

  describe('combat_ended', () => {
    it('clears combat state and broadcasts', () => {
      const storedRoom = { id: 'r1', gameState: { combat: { isActive: true, turnOrder: [{ tokenId: 't1' }] } } };
      const { handlers, ctx, ioEmits } = makeCtx();
      ctx.validateRoomMembership = () => ({ valid: true, player: { id: 'p1', isGM: true }, room: storedRoom });
      registerCombatHandlers(ctx);

      const ack = sinon.stub();
      handlers.combat_ended({ roomId: 'r1' }, ack);

      expect(storedRoom.gameState.combat.isActive).to.equal(false);
      expect(ioEmits[0].event).to.equal('combat_ended');
      expect(ack.firstCall.args[0].success).to.equal(true);
    });
  });
});
