/**
 * Handler-level tests for mapHandlers.js — focusing on the GM-only authorization
 * for map_update create/delete and sync_level_editor_state.
 */
const { expect } = require('chai');
const sinon = require('sinon');
const { registerMapHandlers } = require('../handlers/mapHandlers');

function makeCtx(player) {
  const handlers = {};
  const ioEmits = [];
  const roomEmits = [];

  const room = {
    id: 'r1',
    gameState: {
      maps: {
        default: { id: 'default', tokens: {}, characterTokens: {}, dndElements: [] }
      },
      defaultMapId: 'default',
      playerMapAssignments: {}
    },
    players: new Map()
  };

  const socket = {
    id: 's1',
    emit: sinon.stub(),
    to: sinon.stub().callsFake(() => ({
      emit: (event, payload) => roomEmits.push({ event, payload })
    })),
    on: sinon.stub().callsFake((event, handler) => { handlers[event] = handler; })
  };

  const io = {
    to: sinon.stub().callsFake(() => ({
      emit: (event, payload) => ioEmits.push({ event, payload })
    }))
  };

  registerMapHandlers({
    io,
    socket,
    players: new Map(),
    logger: { info: sinon.stub(), warn: sinon.stub(), error: sinon.stub(), debug: sinon.stub() },
    uuidv4: () => 'uuid',
    validateRoomMembership: (s, roomId, requireGM) => {
      if (requireGM && !player.isGM) { return { valid: false }; }
      return { valid: true, player, room };
    },
    validateMapExists: (r, mapId, name) => {
      if (!r.gameState.maps) { r.gameState.maps = {}; }
      if (!r.gameState.maps[mapId]) {
        r.gameState.maps[mapId] = { id: mapId, name: name || mapId, tokens: {}, characterTokens: {}, dndElements: [] };
      }
      return r.gameState.maps[mapId];
    },
    firebaseBatchWriter: { queueWrite: sinon.stub() },
    getNextEventSequence: () => 1,
    realtimeSync: {}
  });

  return { handlers, ioEmits, roomEmits, room };
}

describe('mapHandlers: map_update authority', () => {
  it('allows the GM to create a map and broadcasts it', async() => {
    const { handlers, ioEmits } = makeCtx({ id: 'gm', isGM: true });

    await handlers.map_update({ roomId: 'r1', action: 'create', map: { id: 'm2', name: 'Cave' } });

    expect(ioEmits).to.have.lengthOf(1);
    expect(ioEmits[0].event).to.equal('map_update');
    expect(ioEmits[0].payload.action).to.equal('create');
  });

  it('blocks a non-GM from creating a map', async() => {
    const { handlers, ioEmits, room } = makeCtx({ id: 'p1', isGM: false });

    await handlers.map_update({ roomId: 'r1', action: 'create', map: { id: 'm2', name: 'Cave' } });

    expect(ioEmits).to.have.lengthOf(0);
    expect(room.gameState.maps.m2).to.equal(undefined);
  });

  it('allows the GM to delete a map and reassigns players', async() => {
    const { handlers, ioEmits, room } = makeCtx({ id: 'gm', isGM: true });
    room.gameState.maps.m2 = { id: 'm2', dndElements: [] };
    room.gameState.playerMapAssignments.p1 = 'm2';

    await handlers.map_update({ roomId: 'r1', action: 'delete', mapId: 'm2' });

    expect(room.gameState.maps.m2).to.equal(undefined);
    expect(room.gameState.playerMapAssignments.p1).to.equal('default');
    expect(ioEmits.some(e => e.event === 'map_update' && e.payload.action === 'delete')).to.equal(true);
  });

  it('blocks a non-GM from deleting a map', async() => {
    const { handlers, ioEmits, room } = makeCtx({ id: 'p1', isGM: false });
    room.gameState.maps.m2 = { id: 'm2', dndElements: [] };

    await handlers.map_update({ roomId: 'r1', action: 'delete', mapId: 'm2' });

    expect(room.gameState.maps.m2).to.exist;
    expect(ioEmits).to.have.lengthOf(0);
  });

  it('blocks a non-GM from pushing level-editor state', async() => {
    const { handlers, roomEmits } = makeCtx({ id: 'p1', isGM: false });

    await handlers.sync_level_editor_state({ roomId: 'r1', terrainData: { x: 1 } });

    expect(roomEmits).to.have.lengthOf(0);
  });
});
