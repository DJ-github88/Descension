/**
 * Loot roll socket handler wiring tests.
 * Run: npx mocha tests/lootRollHandlers.test.js
 */

const { expect } = require('chai');
const { registerLootRollHandlers } = require('../handlers/lootRollHandlers');

const makeWorld = () => {
  const emitted = []; // { to, event, payload }
  const io = { to: (to) => ({ emit: (event, payload) => emitted.push({ to, event, payload }) }) };
  const room = {
    id: 'room-1',
    gameState: { maps: { default: { gridItems: { 'grid-item-sword': { id: 'grid-item-sword', name: 'Sword', lootRollLocked: true } } } } }
  };
  const rooms = new Map([[room.id, room]]);
  const players = new Map([
    ['sock-gm', { id: 'gm', name: 'GM', roomId: room.id, isGM: true, currentMapId: 'default' }],
    ['sock-a', { id: 'pa', name: 'Aria', roomId: room.id, currentMapId: 'default' }],
    ['sock-b', { id: 'pb', name: 'Bran', roomId: room.id, currentMapId: 'default' }]
  ]);
  const writes = [];
  const makeSocket = (socketId) => {
    const handlers = {};
    return {
      id: socketId,
      on: (event, fn) => {handlers[event] = fn;},
      fire: (event, data) => new Promise(resolve => handlers[event](data, resolve))
    };
  };
  const sockets = {};
  ['sock-gm', 'sock-a', 'sock-b'].forEach(sid => {
    sockets[sid] = makeSocket(sid);
    registerLootRollHandlers({
      io,
      socket: sockets[sid],
      rooms,
      players,
      logger: { info() {}, warn() {}, error() {} },
      firebaseBatchWriter: { queueWrite: (...args) => writes.push(args) },
      validateRoomMembership: (socket) => {
        const player = players.get(socket.id);
        return player ? { valid: true, player, room: rooms.get(player.roomId) } : { valid: false };
      }
    });
  });
  return { io, room, emitted, sockets, writes };
};

describe('loot roll handlers', () => {
  it('runs a roll end-to-end: players only, unlocks the orb and tells the winner', async() => {
    const w = makeWorld();
    const ack = await w.sockets['sock-gm'].fire('loot_roll_start', {
      roomId: 'room-1',
      sessionId: 'sess-e2e',
      mapId: 'default',
      creatureName: 'Goblin',
      durationSec: 30,
      items: [{ gridItemId: 'grid-item-sword', name: 'Sword', quality: 'rare' }]
    });
    expect(ack.success).to.equal(true);
    expect(ack.rollers).to.equal(2); // GM doesn't roll

    const started = w.emitted.filter(e => e.event === 'loot_roll_started');
    expect(started.map(e => [e.to, e.payload.canRoll])).to.deep.equal([
      ['sock-gm', false], ['sock-a', true], ['sock-b', true]
    ]);

    expect((await w.sockets['sock-gm'].fire('loot_roll_choice', { sessionId: 'sess-e2e', dropId: '0', choice: 'need' })).success)
      .to.equal(false);
    await w.sockets['sock-a'].fire('loot_roll_choice', { sessionId: 'sess-e2e', dropId: '0', choice: 'greed' });
    await w.sockets['sock-b'].fire('loot_roll_choice', { sessionId: 'sess-e2e', dropId: '0', choice: 'need' });

    const unlock = w.emitted.find(e => e.event === 'grid_item_update');
    expect(unlock.payload.updates.lootRollLocked).to.equal(false);
    expect(unlock.payload.updates.lootRollWinnerId).to.equal('pb');
    expect(w.room.gameState.maps.default.gridItems['grid-item-sword'].lootRollLocked).to.equal(false);
    expect(w.writes.length).to.be.greaterThan(0);

    const won = w.emitted.find(e => e.event === 'loot_roll_won');
    expect(won.to).to.equal('sock-b');
    expect(won.payload.gridItemId).to.equal('grid-item-sword');
    expect(w.emitted.some(e => e.event === 'loot_roll_ended')).to.equal(true);
  });
});
