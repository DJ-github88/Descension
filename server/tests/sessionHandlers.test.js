/**
 * Handler-level tests for the game-session lifecycle events in sessionHandlers.
 * Verifies the client-facing event names/payloads were aligned:
 *   launch_game_session   -> game_session_launched
 *   respond_to_game_session -> game_session_response
 */

const { expect } = require('chai');
const sinon = require('sinon');
const { registerSessionHandlers } = require('../handlers/sessionHandlers');

function makeCtx(overrides = {}) {
  const handlers = {};
  const socketEmits = [];
  const roomEmits = [];

  const gm = { id: 'p-gm', name: 'GM Bob', isGM: true, roomId: 'r1' };
  const player = overrides.player || gm;

  const socket = {
    id: 'sock-1',
    emit: sinon.stub().callsFake((event, payload) => socketEmits.push({ event, payload })),
    join: sinon.stub(),
    to: sinon.stub().callsFake((roomId) => ({
      emit: (event, payload) => roomEmits.push({ event, payload, roomId })
    })),
    on: sinon.stub().callsFake((event, handler) => { handlers[event] = handler; })
  };

  const io = {
    to: sinon.stub().callsFake((roomId) => ({
      emit: (event, payload) => roomEmits.push({ event, payload, roomId })
    }))
  };

  const rooms = new Map([['r1', { id: 'r1', name: 'Tavern', gm, players: new Map() }]]);
  const players = new Map([['sock-1', player]]);

  registerSessionHandlers({
    io,
    socket,
    rooms,
    players,
    onlineSocialUsers: new Map(),
    partyInvitations: new Map(),
    logger: { info: sinon.stub(), warn: sinon.stub(), error: sinon.stub() },
    uuidv4: () => 'uuid'
  });

  return { handlers, socketEmits, roomEmits };
}

describe('sessionHandlers', () => {
  it('launch_game_session broadcasts game_session_launched with GM name', () => {
    const { handlers, roomEmits } = makeCtx();
    handlers.launch_game_session({ roomId: 'r1' });
    expect(roomEmits[0].event).to.equal('game_session_launched');
    expect(roomEmits[0].payload.roomName).to.equal('Tavern');
    expect(roomEmits[0].payload.gmName).to.equal('GM Bob');
  });

  it('respond_to_game_session relays game_session_response', () => {
    const { handlers, roomEmits } = makeCtx({
      player: { id: 'p2', name: 'Player Two', isGM: false, roomId: 'r1' }
    });
    handlers.respond_to_game_session({ accepted: true });
    expect(roomEmits[0].event).to.equal('game_session_response');
    expect(roomEmits[0].payload).to.include({ playerId: 'p2', playerName: 'Player Two', accepted: true });
  });
});
