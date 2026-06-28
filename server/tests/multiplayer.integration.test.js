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

  describe('tokens_delta (ENABLE_TOKENS_DELTA=true)', function () {
    let origEnv;

    before(() => {
      origEnv = process.env.ENABLE_TOKENS_DELTA;
      process.env.ENABLE_TOKENS_DELTA = 'true';
    });

    after(() => {
      if (origEnv === undefined) {
        delete process.env.ENABLE_TOKENS_DELTA;
      } else {
        process.env.ENABLE_TOKENS_DELTA = origEnv;
      }
    });

    it('emits tokens_delta instead of token_created when delta sync is enabled', async () => {
      const gm = openClient();
      await connected(gm);

      const createdP = once(gm, 'room_created');
      gm.emit('create_room', { gmName: 'GM', roomName: 'DeltaArena' });
      const { room } = await createdP;

      const deltaP = once(gm, 'tokens_delta');
      const granularP = once(gm, 'token_created').then(() => 'granular_fired', () => 'granular_timeout');

      gm.emit('token_created', {
        roomId: room.id,
        mapId: 'default',
        token: { name: 'Orc Grunt', x: 5, y: 10 }
      });

      const delta = await deltaP;
      expect(delta.tokens).to.be.an('array');
      expect(delta.tokens.length).to.equal(1);
      expect(delta.tokens[0].name).to.equal('Orc Grunt');

      // The granular token_created event should NOT have fired.
      const granularResult = await granularP;
      expect(granularResult).to.equal('granular_timeout');

      // Server-authoritative state was still updated.
      const stored = server.rooms.get(room.id);
      expect(stored.gameState.tokens[delta.tokens[0].id]).to.exist;
    });
  });

  describe('room_joined carries deltaSyncCapabilities', function () {
    it('reports tokens=true when ENABLE_TOKENS_DELTA=true', async () => {
      const origEnv = process.env.ENABLE_TOKENS_DELTA;
      process.env.ENABLE_TOKENS_DELTA = 'true';
      try {
        const gm = openClient();
        await connected(gm);

        const joinedP = once(gm, 'room_joined');
        gm.emit('create_room', { gmName: 'GM', roomName: 'CapsArena' });
        const { room } = await joinedP;

        expect(room).to.have.property('deltaSyncCapabilities');
        expect(room.deltaSyncCapabilities).to.have.property('tokens', true);
      } finally {
        if (origEnv === undefined) delete process.env.ENABLE_TOKENS_DELTA;
        else process.env.ENABLE_TOKENS_DELTA = origEnv;
      }
    });

    it('reports tokens=false when ENABLE_TOKENS_DELTA is unset', async () => {
      const origEnv = process.env.ENABLE_TOKENS_DELTA;
      delete process.env.ENABLE_TOKENS_DELTA;
      try {
        const gm = openClient();
        await connected(gm);

        const joinedP = once(gm, 'room_joined');
        gm.emit('create_room', { gmName: 'GM', roomName: 'OffArena' });
        const { room } = await joinedP;

        expect(room).to.have.property('deltaSyncCapabilities');
        expect(room.deltaSyncCapabilities).to.have.property('tokens', false);
      } finally {
        if (origEnv !== undefined) process.env.ENABLE_TOKENS_DELTA = origEnv;
      }
    });
  });

  describe('deltaSync conflict resolution (engine policy hook)', function () {
    it('concurrent HP updates from two players converge via the minValue policy', () => {
      // This test exercises the engine directly, not the socket path —
      // the production socket path for state updates is not yet wired
      // through createStateUpdate / createStateUpdateWithConflictResolution.
      const deltaSync = require('../services/deltaSync');
      deltaSync.clearPolicies();
      deltaSync.registerPolicy('hp', require('../services/conflictPolicies').minValue);
      try {
        const roomId = `policy-test-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        deltaSync.initializeRoom(roomId, { characters: { c1: { hp: 80 } } });

        // Two concurrent damage events: -30 and -50 from base 80.
        const dmg1 = { characters: { c1: { hp: { __value: 50, __type: 'primitive' } } } };
        const dmg2 = { characters: { c1: { hp: { __value: 30, __type: 'primitive' } } } };
        const merged = deltaSync.mergeDelta(dmg1, dmg2);

        // minValue picks the smaller HP — the more damaging outcome.
        expect(merged.characters.c1.hp).to.deep.equal({
          __value: 30,
          __type: 'primitive'
        });
      } finally {
        deltaSync.clearPolicies();
      }
    });

    it('unrelated fields stay on LWW while a single field uses a policy', () => {
      const deltaSync = require('../services/deltaSync');
      deltaSync.clearPolicies();
      deltaSync.registerPolicy('hp', require('../services/conflictPolicies').minValue);
      try {
        const dmg1 = {
          hp: { __value: 50, __type: 'primitive' },
          name: { __value: 'Orc', __type: 'primitive' }
        };
        const dmg2 = {
          hp: { __value: 30, __type: 'primitive' },
          name: { __value: 'Goblin', __type: 'primitive' }
        };
        const merged = deltaSync.mergeDelta(dmg1, dmg2);
        // HP uses the policy.
        expect(merged.hp).to.deep.equal({ __value: 30, __type: 'primitive' });
        // Name falls through to LWW.
        expect(merged.name).to.deep.equal({ __value: 'Goblin', __type: 'primitive' });
      } finally {
        deltaSync.clearPolicies();
      }
    });
  });
});
