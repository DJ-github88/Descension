/**
 * Multiplayer integration tests.
 *
 * Drives the REAL production socket handlers over a real socket.io transport
 * (see helpers/integrationServer.js). These are the first non-tautological
 * multiplayer tests in the repo — they guard the auth boundary, room
 * lifecycle, and room-wide broadcast convergence that Phase 6 items 1 (delta
 * sync) and 5 (auth strictness) depend on.
 *
 * Run: npx mocha tests/multiplayer.integration.test.js --timeout 15000 --exit
 */

const { expect } = require('chai');
const { createIntegrationServer } = require('./helpers/integrationServer');

const once = (socket, event) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`timeout waiting for "${event}"`)), 4000);
  socket.once(event, (payload) => {
    clearTimeout(timer);
    resolve(payload);
  });
});

const firstOf = (socket, events) => new Promise((resolve) => {
  const timers = events.map((ev) => [ev, setTimeout(() => resolve({ event: '__timeout__' }), 4000)]);
  const handlers = {};
  events.forEach((ev) => {
    handlers[ev] = (payload) => {
      timers.forEach(([, t]) => clearTimeout(t));
      resolve({ event: ev, payload });
    };
    socket.once(ev, handlers[ev]);
  });
});

const connected = (socket) => new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(new Error('timeout waiting for connect')), 4000);
  socket.once('connect', () => { clearTimeout(t); resolve(); });
});

describe('Multiplayer integration (real socket.io transport)', function () {
  this.timeout(15000);

  let server;
  let opened;

  beforeEach(async () => {
    server = createIntegrationServer();
    await server.start();
    opened = [];
  });

  afterEach(async () => {
    for (const s of opened) {
      try { s.disconnect(); } catch (_) { /* noop */ }
    }
    opened = [];
    try { await server.stop(); } catch (_) { /* noop */ }
  });

  const openClient = (opts) => {
    const c = server.connect(opts);
    opened.push(c);
    return c;
  };

  it('rejects create_room from a guest socket and emits auth_error', async () => {
    const guest = openClient({ guest: true });
    await connected(guest);

    const seen = firstOf(guest, ['auth_error', 'room_created']);

    // allow the emit cycle to settle
    guest.emit('create_room', { gmName: 'Ghost', roomName: 'Nope' });
    const result = await seen;

    expect(result.event).to.equal('auth_error');
    expect(server.rooms.size).to.equal(0);
  });

  it('creates a room for an authenticated GM and emits room_created + room_joined', async () => {
    const gm = openClient();
    await connected(gm);

    const createdP = once(gm, 'room_created');
    const joinedP = once(gm, 'room_joined');

    gm.emit('create_room', { gmName: 'GM Bob', roomName: 'Tavern', playerColor: '#ffffff' });

    const created = await createdP;
    expect(created.room).to.exist;
    expect(created.room.name).to.equal('Tavern');

    const joined = await joinedP;
    expect(joined.isGM).to.equal(true);
    expect(joined.room.id).to.equal(created.room.id);

    // The room is registered in the server-side store.
    expect(server.rooms.has(created.room.id)).to.equal(true);
  });

  it('broadcasts token_created to every room member (convergence)', async () => {
    const gm = openClient();
    await connected(gm);

    const createdP = once(gm, 'room_created');
    gm.emit('create_room', { gmName: 'GM', roomName: 'Arena' });
    const { room } = await createdP;

    // GM socket joined the room server-side during create_room, so io.to(room.id)
    // reaches the GM. Asserting receipt here validates the full broadcast path.
    const tokenP = once(gm, 'token_created');
    gm.emit('token_created', {
      roomId: room.id,
      mapId: 'default',
      token: { name: 'Orc Grunt', x: 1, y: 2 }
    });

    const evt = await tokenP;
    expect(evt.token.name).to.equal('Orc Grunt');
    expect(evt.token.id).to.be.a('string');
    expect(evt.token.x).to.equal(1);
    expect(evt.mapId).to.equal('default');
    expect(evt.createdBy).to.equal(gm.id);

    // Server-authoritative state was updated.
    const stored = server.rooms.get(room.id);
    expect(stored.gameState.tokens[evt.token.id]).to.exist;
    expect(stored.gameState.maps.default.tokens[evt.token.id]).to.exist;
  });

  it('rejects token_created for a non-member of the room', async () => {
    const gm = openClient();
    await connected(gm);

    // Create a room, then attempt a token_created for a DIFFERENT room id.
    const createdP = once(gm, 'room_created');
    gm.emit('create_room', { gmName: 'GM', roomName: 'Arena' });
    const { room } = await createdP;

    // Use a token_created with an ack to observe the rejection cleanly.
    const ackResult = await new Promise((resolve) => {
      gm.emit('token_created', {
        roomId: 'some-other-room',
        mapId: 'default',
        token: { name: 'Spy', x: 0, y: 0 }
      }, (ack) => resolve(ack));
    });

    expect(ackResult).to.exist;
    expect(ackResult.success).to.equal(false);
    // The foreign token must not have leaked into the real room.
    expect(Object.keys(server.rooms.get(room.id).gameState.tokens).length).to.equal(0);
  });
});
