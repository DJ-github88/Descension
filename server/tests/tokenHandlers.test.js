/**
 * Handler-level tests for the token-authority model in tokenHandlers.js:
 *   - token_created stamps reliable server-side ownerPlayerId
 *   - token_moved authority (owner / GM / delegated; fail-open for unowned)
 */
const { expect } = require('chai');
const sinon = require('sinon');
const { registerTokenHandlers } = require('../handlers/tokenHandlers');

function makeCtx(room, player, overrides = {}) {
  const handlers = {};
  const ioEmits = [];
  const socket = {
    id: 'sock-1',
    emit: sinon.stub(),
    to: sinon.stub().returnsThis(),
    on: sinon.stub().callsFake((event, handler) => { handlers[event] = handler; })
  };
  const io = {
    to: sinon.stub().returns({
      emit: sinon.stub().callsFake((event, payload) => ioEmits.push({ event, payload }))
    })
  };
  const movementDebouncer = { queueMove: sinon.stub() };
  const firebaseBatchWriter = { queueWrite: sinon.stub() };
  const ctx = {
    io,
    socket,
    logger: { info: sinon.stub(), warn: sinon.stub(), error: sinon.stub() },
    uuidv4: () => 'uuid-' + Math.random().toString(36).slice(2, 8),
    validateRoomMembership: () => ({ valid: true, player, room }),
    validateMapExists: (r, mapId) => r.gameState.maps[mapId],
    firebaseBatchWriter,
    movementDebouncer,
    getNextEventSequence: () => 1,
    stripUndefined: (o) => o,
    ...overrides
  };
  registerTokenHandlers(ctx);
  return { handlers, movementDebouncer, ioEmits, socket };
}

function roomWith(tokens = {}) {
  return {
    id: 'r1',
    tokenControllers: {},
    gameState: {
      defaultMapId: 'default',
      maps: { default: { tokens: { ...tokens } } },
      tokens: {}
    }
  };
}

describe('tokenHandlers: authority model', () => {
  it('token_created stamps ownerPlayerId from the creating player', () => {
    const room = roomWith();
    const { handlers } = makeCtx(room, { id: 'p1', isGM: false });

    handlers.token_created({ roomId: 'r1', token: { name: 'Goblin' } });

    const created = room.gameState.maps.default.tokens[Object.keys(room.gameState.maps.default.tokens)[0]];
    expect(created.ownerPlayerId).to.equal('p1');
  });

  it('token_moved allows the owner to move their own token', () => {
    const room = roomWith({ tok1: { playerId: 'p1' } });
    const { handlers, movementDebouncer } = makeCtx(room, { id: 'p1', isGM: false });

    handlers.token_moved({ roomId: 'r1', tokenId: 'tok1', position: { x: 1, y: 1 } });

    expect(movementDebouncer.queueMove.calledOnce).to.equal(true);
  });

  it('token_moved blocks a non-owner, non-GM player', () => {
    const room = roomWith({ tok1: { playerId: 'p2' } });
    const { handlers, movementDebouncer } = makeCtx(room, { id: 'p1', isGM: false });

    handlers.token_moved({ roomId: 'r1', tokenId: 'tok1', position: { x: 2, y: 2 } });

    expect(movementDebouncer.queueMove.called).to.equal(false);
  });

  it('token_moved allows the GM to move any token', () => {
    const room = roomWith({ tok1: { playerId: 'p2' } });
    const { handlers, movementDebouncer } = makeCtx(room, { id: 'gm', isGM: true });

    handlers.token_moved({ roomId: 'r1', tokenId: 'tok1', position: { x: 3, y: 3 } });

    expect(movementDebouncer.queueMove.calledOnce).to.equal(true);
  });

  it('token_moved fails open for unowned/legacy tokens', () => {
    const room = roomWith({ tok1: {} }); // no playerId
    const { handlers, movementDebouncer } = makeCtx(room, { id: 'p1', isGM: false });

    handlers.token_moved({ roomId: 'r1', tokenId: 'tok1', position: { x: 4, y: 4 } });

    expect(movementDebouncer.queueMove.calledOnce).to.equal(true);
  });

  it('token_moved allows a player delegated control via token_control_response', () => {
    const room = roomWith({ tok1: { playerId: 'p2' } });
    const { handlers, movementDebouncer } = makeCtx(room, { id: 'p1', isGM: false });

    // p1 accepts delegated control of tok1
    handlers.token_control_response({ roomId: 'r1', tokenId: 'tok1', accepted: true });
    // gm socket exists in room for forwarding: not required for the registry write
    expect(room.tokenControllers['tok1']).to.equal('p1');

    // p1 can now move p2's token
    handlers.token_moved({ roomId: 'r1', tokenId: 'tok1', position: { x: 5, y: 5 } });
    expect(movementDebouncer.queueMove.calledOnce).to.equal(true);
  });
});
