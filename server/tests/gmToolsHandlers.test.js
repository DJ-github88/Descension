/**
 * Handler-level tests for gmToolsHandlers.js.
 * Covers GM gating, player-list payloads, room settings merge, mute flag,
 * and kick removal + notifications.
 */

const { expect } = require('chai');
const sinon = require('sinon');
const { registerGmToolsHandlers } = require('../handlers/gmToolsHandlers');

function makeCtx(overrides = {}) {
  const handlers = {};
  const socketEmits = [];
  const roomEmits = [];

  const targetSocket = {
    id: 'target-sock',
    emit: sinon.stub(),
    leave: sinon.stub()
  };
  const socketsMap = new Map([['target-sock', targetSocket]]);

  const io = {
    to: sinon.stub().callsFake((id) => ({
      emit: (event, payload) => roomEmits.push({ event, payload, id })
    })),
    sockets: { sockets: socketsMap }
  };

  const gm = { id: 'p-gm', name: 'GM', color: '#fff', socketId: 'gm-sock', isGM: true };
  const playerTwo = { id: 'p2', name: 'Player Two', color: '#abc', socketId: 'target-sock' };

  const room = overrides.room || {
    id: 'r1',
    gm,
    players: new Map([['p2', playerTwo]]),
    settings: { maxPlayers: 6 },
    gameState: { playerMapAssignments: { p2: 'default' } },
    isPermanent: false
  };

  const socket = {
    id: 'gm-sock',
    emit: sinon.stub().callsFake((event, payload) => socketEmits.push({ event, payload })),
    to: sinon.stub().callsFake((roomId) => ({
      emit: (event, payload) => roomEmits.push({ event, payload, roomId })
    })),
    on: sinon.stub().callsFake((event, handler) => { handlers[event] = handler; })
  };

  const ctx = {
    io,
    socket,
    players: new Map([['target-sock', playerTwo]]),
    logger: { debug: sinon.stub(), info: sinon.stub(), warn: sinon.stub(), error: sinon.stub() },
    validateRoomMembership: sinon.stub().returns({
      valid: overrides.valid !== undefined ? overrides.valid : true,
      player: gm,
      room
    }),
    firebaseBatchWriter: { queueWrite: sinon.stub() }
  };

  registerGmToolsHandlers(ctx);

  return { handlers, socketEmits, roomEmits, targetSocket, room, ctx };
}

describe('gmToolsHandlers', () => {
  it('request_player_list returns GM + players', () => {
    const { handlers, socketEmits } = makeCtx();
    handlers.request_player_list();
    expect(socketEmits[0].event).to.equal('player_list_updated');
    const list = socketEmits[0].payload;
    expect(list).to.have.lengthOf(2);
    expect(list.find(p => p.id === 'p-gm').isGM).to.equal(true);
    expect(list.find(p => p.id === 'p2').isMuted).to.equal(false);
  });

  it('request_room_settings returns the room settings', () => {
    const { handlers, socketEmits } = makeCtx();
    handlers.request_room_settings();
    expect(socketEmits[0].event).to.equal('room_settings_updated');
    expect(socketEmits[0].payload.maxPlayers).to.equal(6);
  });

  it('update_room_settings merges and broadcasts', () => {
    const { handlers, roomEmits, room } = makeCtx();
    handlers.update_room_settings({ diceVisibility: 'gm' });
    expect(room.settings.diceVisibility).to.equal('gm');
    expect(room.settings.maxPlayers).to.equal(6);
    expect(roomEmits[0].event).to.equal('room_settings_updated');
  });

  it('mute_player flags the player and refreshes the list', () => {
    const { handlers, socketEmits, room } = makeCtx();
    handlers.mute_player({ playerId: 'p2' });
    expect(room.players.get('p2').muted).to.equal(true);
    const list = socketEmits[0].payload;
    expect(list.find(p => p.id === 'p2').isMuted).to.equal(true);
  });

  it('kick_player notifies, removes, and refreshes', () => {
    const { handlers, socketEmits, roomEmits, targetSocket, room } = makeCtx();
    handlers.kick_player({ playerId: 'p2' });

    expect(targetSocket.emit.calledWith('player_kicked')).to.equal(true);
    expect(targetSocket.leave.calledWith('r1')).to.equal(true);
    expect(room.players.has('p2')).to.equal(false);
    expect(room.gameState.playerMapAssignments.p2).to.equal(undefined);
    expect(roomEmits.some(e => e.event === 'player_left')).to.equal(true);
    expect(socketEmits.some(e => e.event === 'player_list_updated')).to.equal(true);
  });

  it('does nothing when the sender is not the GM', () => {
    const { handlers, socketEmits, room } = makeCtx({ valid: false });
    handlers.kick_player({ playerId: 'p2' });
    expect(room.players.has('p2')).to.equal(true);
    expect(socketEmits).to.have.lengthOf(0);
  });
});
