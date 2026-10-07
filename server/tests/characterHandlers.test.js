/**
 * Handler-level tests for characterHandlers.js — focusing on the authorization
 * rule for `character_resource_updated`: a non-GM may only change their OWN
 * character's resources (a forged playerId must not let them heal/kill others).
 */
const { expect } = require('chai');
const sinon = require('sinon');
const { registerCharacterHandlers } = require('../handlers/characterHandlers');

function makeCtx({ sender }) {
  const handlers = {};
  const ioEmits = [];

  const mkPlayer = (id, overrides = {}) => ({
    id,
    name: id,
    socketId: `sock-${id}`,
    isGM: false,
    character: { health: { current: 10, max: 20 } },
    ...overrides
  });

  const gmPlayer = mkPlayer('gm', { isGM: true, socketId: 'sock-gm' });
  const playersMap = new Map([
    ['p1', mkPlayer('p1')],
    ['p2', mkPlayer('p2')],
    ['gm', gmPlayer]
  ]);

  const room = {
    id: 'r1',
    isPermanent: false,
    gm: gmPlayer,
    players: playersMap,
    gameState: {}
  };

  const socket = {
    id: `sock-${sender.id}`,
    emit: sinon.stub(),
    to: sinon.stub().returnsThis(),
    on: sinon.stub().callsFake((event, handler) => { handlers[event] = handler; })
  };

  const io = {
    to: sinon.stub().returns({
      emit: sinon.stub().callsFake((event, payload) => ioEmits.push({ event, payload }))
    })
  };

  registerCharacterHandlers({
    io,
    socket,
    rooms: new Map([['r1', room]]),
    logger: { info: sinon.stub(), warn: sinon.stub(), error: sinon.stub(), debug: sinon.stub() },
    validateRoomMembership: () => ({ valid: true, player: playersMap.get(sender.id), room }),
    firebaseBatchWriter: { queueWrite: sinon.stub() }
  });

  return { handlers, ioEmits, room };
}

describe('characterHandlers: character_resource_updated authority', () => {
  it('blocks a non-GM from modifying another player\'s resources', () => {
    const { handlers, ioEmits, room } = makeCtx({ sender: { id: 'p1', isGM: false } });

    handlers.character_resource_updated({
      roomId: 'r1', playerId: 'p2', resource: 'health', current: 1, max: 20
    });

    expect(room.players.get('p2').character.health.current).to.equal(10);
    expect(ioEmits).to.have.lengthOf(0);
  });

  it('allows a player to modify their own resources and broadcasts', () => {
    const { handlers, ioEmits, room } = makeCtx({ sender: { id: 'p1', isGM: false } });

    handlers.character_resource_updated({
      roomId: 'r1', playerId: 'p1', resource: 'health', current: 5, max: 20
    });

    expect(room.players.get('p1').character.health.current).to.equal(5);
    expect(ioEmits).to.have.lengthOf(1);
    expect(ioEmits[0].event).to.equal('character_resource_updated');
    expect(ioEmits[0].payload.playerId).to.equal('p1');
  });

  it('allows the GM to modify another player\'s resources', () => {
    const { handlers, ioEmits, room } = makeCtx({ sender: { id: 'gm', isGM: true } });

    handlers.character_resource_updated({
      roomId: 'r1', playerId: 'p2', resource: 'health', current: 3, max: 20
    });

    expect(room.players.get('p2').character.health.current).to.equal(3);
    expect(ioEmits).to.have.lengthOf(1);
  });
});
