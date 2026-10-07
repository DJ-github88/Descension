/**
 * Handler-level tests for the Project 4 token-authority model:
 *   - token_created stamps stable verified-UID ownership
 *   - move/update/remove authority (GM / verified owner / explicit delegate)
 *   - legacy ownerless tokens fail closed
 *   - ownership/control fields cannot be mutated through generic updates
 *   - denied actions create no maps and queue no checkpoint work
 */
const { expect } = require('chai');
const sinon = require('sinon');
const { registerTokenHandlers } = require('../handlers/tokenHandlers');

function makeCtx(room, player, overrides = {}) {
  const handlers = {};
  const ioEmits = [];
  const socket = {
    id: 'sock-1',
    data: overrides.socketData || { userId: player && player.userId, authenticated: true },
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
    validateMapExists: (r, mapId) => r.gameState.maps[mapId] || (r.gameState.maps[mapId] = { tokens: {}, characterTokens: {} }),
    firebaseBatchWriter,
    movementDebouncer,
    getNextEventSequence: () => 1,
    stripUndefined: (o) => o,
    ...overrides
  };
  registerTokenHandlers(ctx);
  return { handlers, movementDebouncer, ioEmits, socket, firebaseBatchWriter };
}

function roomWith(tokens = {}) {
  return {
    id: 'r1',
    gmId: 'gm-uid',
    tokenControllers: {},
    gameState: {
      defaultMapId: 'default',
      maps: { default: { tokens: { ...tokens }, characterTokens: {} } },
      tokens: {},
      characterTokens: {}
    }
  };
}

describe('tokenHandlers: Project 4 authority model', () => {
  it('token_created stamps stable ownerUserId from the verified socket, not payload assertions', () => {
    const room = roomWith();
    const { handlers } = makeCtx(room, { id: 'p1', userId: 'uid-1', isGM: false });

    handlers.token_created({
      roomId: 'r1',
      token: { name: 'Goblin', ownerUserId: 'forged-uid', playerId: 'forged-player' }
    });

    const created = room.gameState.maps.default.tokens[Object.keys(room.gameState.maps.default.tokens)[0]];
    expect(created.ownerUserId).to.equal('uid-1');
    expect(created.ownerPlayerId).to.equal('p1');
    // Client-supplied ownership assertions are ignored.
    expect(created.ownerUserId).to.not.equal('forged-uid');
  });

  it('token_moved allows the verified owner to move their own token', () => {
    const room = roomWith({ tok1: { ownerUserId: 'uid-1' } });
    const { handlers, movementDebouncer } = makeCtx(room, { id: 'p1', userId: 'uid-1', isGM: false });

    handlers.token_moved({ roomId: 'r1', tokenId: 'tok1', position: { x: 1, y: 1 } });

    expect(movementDebouncer.queueMove.calledOnce).to.equal(true);
  });

  it('token_moved blocks a non-owner, non-GM player', () => {
    const room = roomWith({ tok1: { ownerUserId: 'uid-2' } });
    const { handlers, movementDebouncer } = makeCtx(room, { id: 'p1', userId: 'uid-1', isGM: false });

    handlers.token_moved({ roomId: 'r1', tokenId: 'tok1', position: { x: 2, y: 2 } });

    expect(movementDebouncer.queueMove.called).to.equal(false);
  });

  it('token_moved allows the GM to move any token', () => {
    const room = roomWith({ tok1: { ownerUserId: 'uid-2' } });
    const { handlers, movementDebouncer } = makeCtx(room, { id: 'gm', userId: 'gm-uid', isGM: true });

    handlers.token_moved({ roomId: 'r1', tokenId: 'tok1', position: { x: 3, y: 3 } });

    expect(movementDebouncer.queueMove.calledOnce).to.equal(true);
  });

  it('token_moved denies an ownerless legacy token to a random member', () => {
    const room = roomWith({ tok1: {} }); // no owner fields
    const { handlers, movementDebouncer } = makeCtx(room, { id: 'p1', userId: 'uid-1', isGM: false });

    handlers.token_moved({ roomId: 'r1', tokenId: 'tok1', position: { x: 4, y: 4 } });

    expect(movementDebouncer.queueMove.called).to.equal(false);
  });

  it('token_moved permits an ownerless legacy token for the GM', () => {
    const room = roomWith({ tok1: {} });
    const { handlers, movementDebouncer } = makeCtx(room, { id: 'gm', userId: 'gm-uid', isGM: true });

    handlers.token_moved({ roomId: 'r1', tokenId: 'tok1', position: { x: 4, y: 4 } });

    expect(movementDebouncer.queueMove.calledOnce).to.equal(true);
  });

  it('token_moved allows a player delegated control via the verified grant flow', () => {
    const room = roomWith({ tok1: { ownerUserId: 'uid-2' } });
    room.pendingTokenControls = {
      'r1:default:tok1': {
        tokenId: 'tok1',
        mapId: 'default',
        roomId: 'r1',
        controllerUserId: 'uid-1',
        controllerPlayerId: 'p1'
      }
    };
    const { handlers, movementDebouncer } = makeCtx(room, { id: 'p1', userId: 'uid-1', isGM: false });

    handlers.token_control_response({ roomId: 'r1', tokenId: 'tok1', accepted: true });
    const delegationRecords = Object.values(room.tokenControllers);
    expect(delegationRecords[0].controllerUserId).to.equal('uid-1');

    handlers.token_moved({ roomId: 'r1', tokenId: 'tok1', position: { x: 5, y: 5 } });
    expect(movementDebouncer.queueMove.calledOnce).to.equal(true);
  });

  it('token_control_response denies legacy bare-key and unscoped pending grants', () => {
    // Bare token-id key.
    const bare = roomWith({ tok1: { ownerUserId: 'uid-2' } });
    bare.pendingTokenControls = {
      tok1: { tokenId: 'tok1', mapId: 'default', roomId: 'r1', controllerUserId: 'uid-1', controllerPlayerId: 'p1' }
    };
    const bareCtx = makeCtx(bare, { id: 'p1', userId: 'uid-1', isGM: false });
    bareCtx.handlers.token_control_response({ roomId: 'r1', tokenId: 'tok1', accepted: true });
    expect(Object.keys(bare.tokenControllers).length).to.equal(0);

    // Composite key but missing frozen scope fields.
    const unscoped = roomWith({ tok1: { ownerUserId: 'uid-2' } });
    unscoped.pendingTokenControls = {
      'r1:default:tok1': { tokenId: 'tok1', mapId: 'default', controllerUserId: 'uid-1', controllerPlayerId: 'p1' }
    };
    const unscopedCtx = makeCtx(unscoped, { id: 'p1', userId: 'uid-1', isGM: false });
    unscopedCtx.handlers.token_control_response({ roomId: 'r1', tokenId: 'tok1', accepted: true });
    expect(Object.keys(unscoped.tokenControllers).length).to.equal(0);

    // Wrong map scope.
    const wrongMap = roomWith({ tok1: { ownerUserId: 'uid-2' } });
    wrongMap.pendingTokenControls = {
      'r1:other:tok1': { tokenId: 'tok1', mapId: 'other', roomId: 'r1', controllerUserId: 'uid-1' }
    };
    const wrongMapCtx = makeCtx(wrongMap, { id: 'p1', userId: 'uid-1', isGM: false });
    wrongMapCtx.handlers.token_control_response({ roomId: 'r1', tokenId: 'tok1', accepted: true });
    expect(Object.keys(wrongMap.tokenControllers).length).to.equal(0);

    // Wrong verified UID.
    const wrongUid = roomWith({ tok1: { ownerUserId: 'uid-2' } });
    wrongUid.pendingTokenControls = {
      'r1:default:tok1': { tokenId: 'tok1', mapId: 'default', roomId: 'r1', controllerUserId: 'uid-9' }
    };
    const wrongUidCtx = makeCtx(wrongUid, { id: 'p1', userId: 'uid-1', isGM: false });
    wrongUidCtx.handlers.token_control_response({ roomId: 'r1', tokenId: 'tok1', accepted: true });
    expect(Object.keys(wrongUid.tokenControllers).length).to.equal(0);
  });

  it('token_control_response blocks a self-grant without a pending GM grant', () => {
    const room = roomWith({ tok1: { ownerUserId: 'uid-2' } });
    const { handlers } = makeCtx(room, { id: 'p1', userId: 'uid-1', isGM: false });

    handlers.token_control_response({ roomId: 'r1', tokenId: 'tok1', accepted: true });

    expect(room.tokenControllers['tok1']).to.equal(undefined);
  });

  it('token_updated rejects ownership/control fields without partial application', () => {
    const room = roomWith({ tok1: { ownerUserId: 'uid-2', name: 'Old Name' } });
    const { handlers } = makeCtx(room, { id: 'gm', userId: 'gm-uid', isGM: true });

    handlers.token_updated({
      roomId: 'r1',
      tokenId: 'tok1',
      updates: { name: 'New Name', ownerUserId: 'uid-1' }
    });

    expect(room.gameState.maps.default.tokens.tok1.name).to.equal('Old Name');
    expect(room.gameState.maps.default.tokens.tok1.ownerUserId).to.equal('uid-2');
  });

  it('token_updated rejects nested ownership aliases', () => {
    const room = roomWith({ tok1: { ownerUserId: 'uid-2' } });
    const { handlers } = makeCtx(room, { id: 'gm', userId: 'gm-uid', isGM: true });

    handlers.token_updated({
      roomId: 'r1',
      tokenId: 'tok1',
      updates: { state: { playerId: 'forged' }, hp: 5 }
    });

    expect(room.gameState.maps.default.tokens.tok1.state).to.equal(undefined);
    expect(room.gameState.maps.default.tokens.tok1.hp).to.equal(undefined);
  });

  it('a denied move does not create a missing map or queue a checkpoint', () => {
    const room = roomWith({});
    room.gameState.maps = {};
    const { handlers, movementDebouncer, firebaseBatchWriter } = makeCtx(room, { id: 'p1', userId: 'uid-1', isGM: false });

    handlers.token_moved({ roomId: 'r1', mapId: 'missing-map', tokenId: 'tok1', position: { x: 1, y: 1 } });

    expect(room.gameState.maps['missing-map']).to.equal(undefined);
    expect(movementDebouncer.queueMove.called).to.equal(false);
    expect(firebaseBatchWriter.queueWrite.called).to.equal(false);
  });

  it('token_removed denies a delegated controller (destructive removal is owner/GM only)', () => {
    const room = roomWith({ tok1: { ownerUserId: 'uid-2' } });
    room.tokenControllers.tok1 = { controllerUserId: 'uid-1', controllerPlayerId: 'p1', mapId: 'default' };
    const { handlers } = makeCtx(room, { id: 'p1', userId: 'uid-1', isGM: false });

    handlers.token_removed({ roomId: 'r1', tokenId: 'tok1' });

    expect(room.gameState.maps.default.tokens.tok1).to.exist;
  });

  describe('strict scoped delegation (R9)', () => {
    const key = 'r1:default:tok1';
    const moveAllowed = (record) => {
      const room = roomWith({ tok1: { ownerUserId: 'uid-2' } });
      room.tokenControllers[key] = record;
      const { handlers, movementDebouncer } = makeCtx(room, { id: 'p1', userId: 'uid-1', isGM: false });
      handlers.token_moved({ roomId: 'r1', tokenId: 'tok1', position: { x: 1, y: 1 } });
      return movementDebouncer.queueMove.called;
    };

    it('denies a bare string legacy record', () => {
      expect(moveAllowed('p1')).to.equal(false);
    });

    it('denies a player-id-only record without a verified controller UID', () => {
      expect(moveAllowed({ tokenId: 'tok1', mapId: 'default', controllerPlayerId: 'p1' })).to.equal(false);
    });

    it('denies a record missing the frozen scope fields', () => {
      expect(moveAllowed({ tokenId: 'tok1', mapId: 'default', roomId: 'r1' })).to.equal(false);
    });

    it('denies a foreign verified UID for the same map/token', () => {
      expect(moveAllowed({ tokenId: 'tok1', mapId: 'default', roomId: 'r1', controllerUserId: 'uid-9' })).to.equal(false);
    });

    it('denies the same token ID scoped to another map', () => {
      const room = roomWith({ tok1: { ownerUserId: 'uid-2' } });
      room.tokenControllers['r1:other:tok1'] = {
        tokenId: 'tok1', mapId: 'other', roomId: 'r1', controllerUserId: 'uid-1'
      };
      const { handlers, movementDebouncer } = makeCtx(room, { id: 'p1', userId: 'uid-1', isGM: false });
      handlers.token_moved({ roomId: 'r1', tokenId: 'tok1', mapId: 'default', position: { x: 1, y: 1 } });
      expect(movementDebouncer.queueMove.called).to.equal(false);
    });

    it('accepts the exact scoped verified-UID record', () => {
      expect(moveAllowed({
        tokenId: 'tok1', mapId: 'default', roomId: 'r1', controllerUserId: 'uid-1'
      })).to.equal(true);
    });
  });
});
