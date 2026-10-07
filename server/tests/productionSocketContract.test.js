/**
 * Project 1 — Production Socket Contract Restoration.
 *
 * These tests drive the REAL registered handlers through the REAL production
 * middleware composition (sanitization -> validation -> rate limit -> auth)
 * over a real socket.io transport (see helpers/productionStackServer.js).
 * Only Firebase token verification and persistence writes are stubbed.
 *
 * Closes the reproduced failures:
 *   R4 — acknowledgement callbacks lost by the wrapper stack
 *   R5 — roomId/mapId/actionId stripped by validation
 *   R6 — reconnect flag stripped / client userId trusted as identity
 *   R7 — targeted sync_* delivered across room boundaries
 */

const { expect } = require('chai');
const { createProductionStackServer } = require('./helpers/productionStackServer');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connected = (socket) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error('timeout waiting for connect')), 5000);
  socket.once('connect', () => { clearTimeout(timer); resolve(); });
  socket.once('connect_error', (err) => { clearTimeout(timer); reject(err); });
});

const once = (socket, event, timeoutMs = 4000) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`timeout waiting for "${event}"`)), timeoutMs);
  socket.once(event, (payload) => { clearTimeout(timer); resolve(payload); });
});

const collect = (socket, event, ms) => new Promise((resolve) => {
  const events = [];
  const handler = (payload) => events.push(payload);
  socket.on(event, handler);
  setTimeout(() => {
    socket.off(event, handler);
    resolve(events);
  }, ms);
});

/**
 * Emit an ack-bearing event and settle `settleMs` after the first ack so a
 * duplicate acknowledgement would also be counted.
 */
const emitAckSettled = (socket, event, payload, settleMs = 250, timeoutMs = 4000) => new Promise((resolve, reject) => {
  let count = 0;
  const acks = [];
  const timer = setTimeout(() => reject(new Error(`ack timeout for "${event}"`)), timeoutMs);
  socket.emit(event, payload, (...args) => {
    count += 1;
    acks.push(args.length === 1 ? args[0] : args);
    clearTimeout(timer);
    setTimeout(() => resolve({ count, acks }), settleMs);
  });
});

const recoverOnce = (socket, request) => {
  const response = once(socket, 'full_game_state_sync');
  if (request) {socket.emit('request_full_sync', request);} else {socket.emit('request_full_sync');}
  return response;
};

describe('Production socket contract (real middleware stack)', function() {
  this.timeout(20000);

  let server;
  let clients;

  beforeEach(async() => {
    server = createProductionStackServer({ debounceMs: 80 });
    await server.start();
    clients = [];
  });

  afterEach(async() => {
    for (const client of clients) {
      try { client.disconnect(); } catch (_) { /* noop */ }
    }
    clients = [];
    try { await server.stop(); } catch (_) { /* noop */ }
  });

  const openVerified = async() => {
    const userId = server.nextUserId();
    const token = `test-token:${userId}`;
    server.registerAuthToken(token, userId);
    const client = server.connect({ token });
    clients.push(client);
    await connected(client);
    return { client, userId };
  };

  const openGuest = async() => {
    const client = server.connect({ guest: true });
    clients.push(client);
    await connected(client);
    return client;
  };

  const seedRoomFor = (gm, opts = {}) => server.seedRoom(gm.client.id, {
    gmUserId: gm.userId,
    ...opts
  });

  const join = async(client, roomId, payload = {}) => {
    const joined = once(client, 'room_joined');
    client.emit('join_room', {
      roomId,
      playerName: payload.playerName || 'Player',
      password: '',
      ...payload
    });
    return joined;
  };

  const createToken = (gm, room, tokenId, mapId = 'default') => emitAckSettled(gm.client, 'token_created', {
    roomId: room.id,
    mapId,
    tokenId,
    creature: { id: `creature-${tokenId}`, name: 'Goblin' },
    token: { id: tokenId, name: 'Goblin' },
    position: { x: 1, y: 1 }
  }, 60);

  it('R4: valid token_created acknowledgement arrives exactly once', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm);

    const { count, acks } = await createToken(gm, room, 'tok-ack');

    expect(count).to.equal(1);
    expect(acks[0].success).to.equal(true);
    expect(acks[0].tokenId).to.be.a('string');
    expect(room.gameState.maps.default.tokens[acks[0].tokenId]).to.exist;
  });

  it('R4: valid map_update acknowledgement arrives exactly once', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm);

    const { count, acks } = await emitAckSettled(gm.client, 'map_update', {
      roomId: room.id,
      mapUpdates: { terrainData: { '0,0': { type: 'stone' } } },
      targetMapId: 'default',
      sequence: 7
    });

    expect(count).to.equal(1);
    expect(acks[0].success).to.equal(true);
    expect(room.gameState.maps.default.terrainData['0,0']).to.deep.equal({ type: 'stone' });
  });

  it('R4: validation rejection answers the supplied acknowledgement exactly once', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm);

    const validationEvent = once(gm.client, 'validation_error');
    const { count, acks } = await emitAckSettled(gm.client, 'token_created', {
      roomId: room.id,
      creature: { id: 'creature-no-position' }
      // position is required
    }, 60);

    expect(count).to.equal(1);
    expect(acks[0].success).to.equal(false);
    expect(acks[0].error).to.equal('Invalid data format');

    const validationError = await validationEvent;
    expect(validationError.event).to.equal('token_created');

    // Validation was not bypassed to satisfy the ack.
    expect(Object.keys(room.gameState.maps.default.tokens)).to.have.length(0);
  });

  it('R4: rate-limit rejection answers the supplied acknowledgement exactly once', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm);

    server.setEventLimits('token_created', { maxPerMinute: 1, maxPerSecond: 1 });

    const first = await createToken(gm, room, 'tok-rate-1');
    expect(first.acks[0].success).to.equal(true);

    const second = await createToken(gm, room, 'tok-rate-2');
    expect(second.count).to.equal(1);
    expect(second.acks[0].success).to.equal(false);
    expect(second.acks[0].error).to.match(/rate limit/i);
    expect(room.gameState.maps.default.tokens['tok-rate-2']).to.not.exist;
  });

  it('R4: authorization rejection answers the supplied acknowledgement', async() => {
    const guest = await openGuest();

    const authEvent = once(guest, 'auth_error');
    const { count, acks } = await emitAckSettled(guest, 'create_room', { gmName: 'Ghost' }, 60);

    expect(count).to.equal(1);
    expect(acks[0].success).to.equal(false);
    await authEvent;
    expect(server.rooms.size).to.equal(0);
  });

  it('R5: a non-default mapId survives the wrapper stack and movement stays map-scoped', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm);

    const created = await emitAckSettled(gm.client, 'token_created', {
      roomId: room.id,
      mapId: 'map-2',
      targetMapId: 'map-2',
      tokenId: 'tok-map2',
      creature: { id: 'creature-map2', name: 'Orc' },
      token: { id: 'tok-map2', name: 'Orc' },
      position: { x: 5, y: 5 }
    }, 60);

    expect(created.acks[0].success).to.equal(true);
    expect(room.gameState.maps['map-2'].tokens['tok-map2']).to.exist;
    expect(room.gameState.maps.default.tokens).to.not.have.property('tok-map2');

    const echoP = once(gm.client, 'token_moved');
    gm.client.emit('token_moved', {
      roomId: room.id,
      mapId: 'map-2',
      tokenId: 'tok-map2',
      position: { x: 6, y: 7 },
      actionId: 'act-map2'
    });

    const echo = await echoP;
    expect(echo.mapId).to.equal('map-2');
    expect(echo.actionId).to.equal('act-map2');
    await wait(80);
    expect(room.gameState.maps['map-2'].tokens['tok-map2'].position).to.deep.equal({ x: 6, y: 7 });
    expect(room.gameState.maps.default.tokens).to.not.have.property('tok-map2');
  });

  it('R5/R6: actionId survives producer -> server -> coalescer -> echo', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm);
    await createToken(gm, room, 'tok-drag');

    // Payload shape mirrors the live producer
    // (vtt-react/src/components/grid/CreatureToken.jsx: emit('token_moved', {
    //   tokenId, position, roomId, mapId, actionId })).
    const echoesP = collect(gm.client, 'token_moved', 350);

    gm.client.emit('token_moved', {
      tokenId: 'tok-drag',
      position: { x: 1, y: 1 },
      roomId: room.id,
      mapId: 'default',
      actionId: 'act-A'
    });
    gm.client.emit('token_moved', {
      tokenId: 'tok-drag',
      position: { x: 2, y: 2 },
      roomId: room.id,
      mapId: 'default',
      actionId: 'act-B'
    });

    const echoes = await echoesP;

    // The superseded drag position is coalesced into the latest action only.
    expect(echoes).to.have.length(1);
    expect(echoes[0].actionId).to.equal('act-B');
    expect(echoes[0].position).to.deep.equal({ x: 2, y: 2 });
    expect(room.gameState.maps.default.tokens['tok-drag'].position).to.deep.equal({ x: 2, y: 2 });
  });

  it('R6: reconnect informational state survives validation', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm);

    const player = await openVerified();
    const joined = await join(player.client, room.id, { isReconnect: true, playerName: 'Returning' });
    expect(joined.isReconnect).to.equal(true);

    const other = await openVerified();
    const joinedFresh = await join(other.client, room.id, { playerName: 'Fresh' });
    expect(joinedFresh.isReconnect).to.equal(false);
  });

  it('R6: client supplied userId does not override verified socket identity', async() => {
    const gm = await openVerified();
    const player = await openVerified();
    const room = await seedRoomFor(gm, {
      disconnectedPlayers: {
        [player.userId]: { playerId: 'legacy-player', playerName: 'Legacy' }
      }
    });

    const joined = await join(player.client, room.id, {
      isReconnect: true,
      userId: gm.userId, // spoof attempt as another verified user
      playerName: 'Impostor'
    });

    // Reclaim came from the verified uid, not the supplied userId.
    expect(joined.player.id).to.equal('legacy-player');
    expect(joined.player.userId).to.equal(player.userId);
    expect(joined.player.userId).to.not.equal(gm.userId);
    expect(server.players.get(player.client.id).userId).to.equal(player.userId);
  });

  it('R7: targeted sync_* cannot deliver into another room', async() => {
    const gmB = await openVerified();
    const roomB = await seedRoomFor(gmB);
    const playerB = await openVerified();
    const joinedB = await join(playerB.client, roomB.id, { playerName: 'PlayerB' });

    const gm = await openVerified();
    const roomA = await seedRoomFor(gm);
    const playerA = await openVerified();
    await join(playerA.client, roomA.id, { playerName: 'PlayerA' });

    const received = collect(playerB.client, 'full_game_state_sync', 600);
    const errors = collect(playerA.client, 'sync_error', 600);

    playerA.client.emit('sync_tokens', {
      mapId: 'default', tokens: { hack: { id: 'hack' } }, recipientPlayerId: joinedB.player.id
    });
    playerA.client.emit('sync_grid_items', {
      mapId: 'default', gridItems: { hack: { id: 'hack' } }, recipientPlayerId: joinedB.player.id
    });
    playerA.client.emit('sync_character_tokens', {
      mapId: 'default', characterTokens: { hack: { id: 'hack' } }, recipientPlayerId: joinedB.player.id
    });

    expect(await received).to.have.length(0);
    expect(await errors).to.have.length(3);
  });

  it('R7: same-room targeted sync still delivers', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm);

    const sender = await openVerified();
    await join(sender.client, room.id, { playerName: 'Sender' });

    const recipient = await openVerified();
    const joinedRecipient = await join(recipient.client, room.id, { playerName: 'Recipient' });

    const receivedP = once(recipient.client, 'full_game_state_sync');
    sender.client.emit('sync_tokens', {
      mapId: 'default',
      tokens: { 't-1': { id: 't-1' } },
      recipientPlayerId: joinedRecipient.player.id
    });

    const payload = await receivedP;
    expect(payload.tokens).to.deep.equal({ 't-1': { id: 't-1' } });
    expect(payload.mapId).to.equal('default');
  });

  it('R7/recovery: request_full_sync serves the requested/current map only', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm);
    await createToken(gm, room, 'tok-default', 'default');
    await createToken(gm, room, 'tok-map2', 'map-2');

    gm.client.emit('update_current_map', { roomId: room.id, mapId: 'map-2' });
    await wait(80);

    const currentP = once(gm.client, 'full_game_state_sync');
    gm.client.emit('request_full_sync');
    const current = await currentP;

    expect(current.mapId).to.equal('map-2');
    expect(current.tokens).to.have.property('tok-map2');
    expect(current.tokens).to.not.have.property('tok-default');

    // An explicit requested map wins over the current map.
    const requestedP = once(gm.client, 'full_game_state_sync');
    gm.client.emit('request_full_sync', { mapId: 'default' });
    const requested = await requestedP;

    expect(requested.mapId).to.equal('default');
    expect(requested.tokens).to.have.property('tok-default');
    expect(requested.tokens).to.not.have.property('tok-map2');
  });

  it('R7/recovery: an unavailable map returns a bounded sync error, not relabelled state', async() => {
    const gm = await openVerified();
    await seedRoomFor(gm);

    const errorP = once(gm.client, 'sync_error');
    const noSync = collect(gm.client, 'full_game_state_sync', 400);
    gm.client.emit('request_full_sync', { mapId: 'missing-map' });

    const error = await errorP;
    expect(error.code).to.equal('map_unavailable');
    expect(error.mapId).to.equal('missing-map');
    expect(error.message).to.match(/not available/i);
    expect(await noSync).to.have.length(0);
  });

  it('recovery: legacy root-token rooms keep the documented default-map fallback', async() => {
    const gm = await openVerified();
    await server.seedRoom(gm.client.id, {
      gmUserId: gm.userId,
      initialGameState: {
        defaultMapId: 'default',
        tokens: { 'legacy-tok': { id: 'legacy-tok', position: { x: 1, y: 1 } } },
        characterTokens: {},
        gridItems: {},
        fogOfWarData: {},
        combat: null
      }
    });

    const syncP = once(gm.client, 'full_game_state_sync');
    gm.client.emit('request_full_sync');
    const payload = await syncP;

    expect(payload.legacyFallback).to.equal(true);
    expect(payload.mapId).to.equal('default');
    expect(payload.tokens).to.have.property('legacy-tok');
  });

  it('B1: map_update from a non-GM member answers exactly one failure acknowledgement', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm);
    const member = await openVerified();
    await join(member.client, room.id, { playerName: 'Member' });

    const { count, acks } = await emitAckSettled(member.client, 'map_update', {
      roomId: room.id,
      mapUpdates: { terrainData: { '1,1': { type: 'stone' } } },
      targetMapId: 'default',
      sequence: 21
    }, 60);

    expect(count).to.equal(1);
    expect(acks[0].success).to.equal(false);
    expect(acks[0].error).to.match(/GM/i);
    expect(room.gameState.maps.default.terrainData['1,1']).to.equal(undefined);
  });

  it('B1: map_update naming a foreign room answers exactly one failure acknowledgement without mutation', async() => {
    const gm = await openVerified();
    await seedRoomFor(gm);
    const gmB = await openVerified();
    const roomB = await seedRoomFor(gmB);
    const before = JSON.stringify(roomB.gameState);

    const { count, acks } = await emitAckSettled(gm.client, 'map_update', {
      roomId: roomB.id,
      mapUpdates: { terrainData: { '2,2': { type: 'lava' } } },
      targetMapId: 'default',
      sequence: 22
    }, 60);

    expect(count).to.equal(1);
    expect(acks[0].success).to.equal(false);
    expect(acks[0].error).to.match(/member/i);
    expect(JSON.stringify(roomB.gameState)).to.equal(before);
  });

  it('B2: a stale sender outside current membership cannot deliver targeted sync', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm);
    const observer = await openVerified();
    const observerPlayer = await join(observer.client, room.id, { playerName: 'Observer' });
    const stale = await openVerified();
    const stalePlayer = await join(stale.client, room.id, { playerName: 'Stale' });

    // Global players entry survives; authoritative room membership does not.
    room.players.delete(stalePlayer.player.id);

    const received = collect(observer.client, 'full_game_state_sync', 400);
    const errors = collect(stale.client, 'sync_error', 400);
    stale.client.emit('sync_tokens', {
      mapId: 'default',
      tokens: { injected: { id: 'injected' } },
      recipientPlayerId: observerPlayer.player.id
    });

    expect(await received).to.have.length(0);
    const syncErrors = await errors;
    expect(syncErrors).to.have.length(1);
    expect(syncErrors[0].message).to.match(/not a current member/i);
    expect(server.players.get(stale.client.id)).to.exist;
  });

  it('B2: a stale Socket.IO room channel cannot receive sync families after switching rooms', async() => {
    const gm = await openVerified();
    const roomA = await seedRoomFor(gm, { name: 'Room A' });
    const observer = await openVerified();
    await join(observer.client, roomA.id, { playerName: 'ObserverA' });

    const gmB = await openVerified();
    const roomB = await seedRoomFor(gmB, { name: 'Room B' });
    const switcher = await openVerified();
    await join(switcher.client, roomA.id, { playerName: 'SwitchA' });
    const switched = await join(switcher.client, roomB.id, { playerName: 'SwitchB' });
    expect(switched.player.roomId).to.equal(roomB.id);
    // The socket keeps Room A's channel membership; its authoritative room is B.
    expect(switcher.client.connected).to.equal(true);

    const staleReceipts = collect(switcher.client, 'full_game_state_sync', 500);
    const legitReceipts = collect(observer.client, 'full_game_state_sync', 500);

    gm.client.emit('sync_tokens', { mapId: 'default', tokens: { a: { id: 'a' } } });
    gm.client.emit('sync_grid_items', { mapId: 'default', gridItems: { a: { id: 'a' } } });
    gm.client.emit('sync_character_tokens', { mapId: 'default', characterTokens: { a: { id: 'a' } } });

    expect(await staleReceipts).to.have.length(0);
    const legit = await legitReceipts;
    expect(legit).to.have.length(3);
    const payloadFields = legit.flatMap((payload) =>
      ['tokens', 'gridItems', 'characterTokens'].filter((field) => payload[field] !== undefined)
    );
    expect(payloadFields).to.have.members(['tokens', 'gridItems', 'characterTokens']);
  });

  it('B3: mixed legacy root and per-map state is rejected instead of silently omitting content', async() => {
    const gm = await openVerified();
    const room = await server.seedRoom(gm.client.id, {
      gmUserId: gm.userId,
      initialGameState: {
        defaultMapId: 'default',
        tokens: { old: { id: 'old', creatureId: 'old-creature', position: { x: 4, y: 4 } } },
        characterTokens: {},
        gridItems: {}
      }
    });

    const initial = await recoverOnce(gm.client);
    expect(initial.mapId).to.equal('default');
    expect(initial.tokens).to.have.property('old');

    // A normal create introduces per-map stores while root keeps the old token.
    const created = await emitAckSettled(gm.client, 'token_created', {
      token: { id: 'new', creatureId: 'new-creature' },
      creature: { id: 'new-creature' },
      position: { x: 8, y: 8 }
    }, 60);
    expect(created.acks[0].success).to.equal(true);
    expect(room.gameState.maps.default.tokens).to.have.property('new');

    const before = JSON.stringify(room.gameState);
    const errorP = once(gm.client, 'sync_error');
    const recovery = collect(gm.client, 'full_game_state_sync', 400);
    gm.client.emit('request_full_sync');

    const error = await errorP;
    expect(error.code).to.equal('legacy_ambiguous');
    expect(error.message).to.match(/ambiguous|reconciliation/i);
    expect(await recovery).to.have.length(0);
    expect(JSON.stringify(room.gameState)).to.equal(before);
  });

  it('B3: a legacy root token with a conflicting explicit mapId is rejected, not relabelled', async() => {
    const gm = await openVerified();
    const room = await server.seedRoom(gm.client.id, {
      gmUserId: gm.userId,
      initialGameState: {
        defaultMapId: 'default',
        tokens: { foreign: { id: 'foreign', mapId: 'map-2', position: { x: 1, y: 1 } } },
        characterTokens: {},
        gridItems: {}
      }
    });

    const before = JSON.stringify(room.gameState);
    const errorP = once(gm.client, 'sync_error');
    const recovery = collect(gm.client, 'full_game_state_sync', 300);
    gm.client.emit('request_full_sync');

    const error = await errorP;
    expect(error.code).to.equal('legacy_map_conflict');
    expect(error.message).to.match(/reconciliation/i);
    expect(await recovery).to.have.length(0);
    expect(JSON.stringify(room.gameState)).to.equal(before);
  });

  it('B3: inherited map keys are rejected as unavailable without room mutation', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm);
    const before = JSON.stringify(room.gameState);

    for (const mapId of ['constructor', '__proto__', 'prototype']) {
      const errorP = once(gm.client, 'sync_error');
      const recovery = collect(gm.client, 'full_game_state_sync', 250);
      gm.client.emit('request_full_sync', { mapId });

      const error = await errorP;
      expect(error.code).to.equal('map_unavailable');
      expect(await recovery).to.have.length(0);
    }

    expect(JSON.stringify(room.gameState)).to.equal(before);
  });

  it('compatibility: legacy token payloads without routing fields still work', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm);

    // Legacy token_created: no roomId/mapId/tokenId.
    const created = await emitAckSettled(gm.client, 'token_created', {
      creature: { id: 'legacy-creature' },
      token: { id: 'legacy-tok-2' },
      position: { x: 0, y: 0 }
    }, 60);
    expect(created.acks[0].success).to.equal(true);
    expect(room.gameState.maps.default.tokens['legacy-tok-2']).to.exist;

    // Legacy token_moved: no roomId/mapId/actionId.
    const echoP = once(gm.client, 'token_moved');
    gm.client.emit('token_moved', { tokenId: 'legacy-tok-2', position: { x: 3, y: 4 } });
    const echo = await echoP;
    expect(echo.mapId).to.equal('default');
    expect(echo.actionId).to.equal(undefined);
    await wait(80);
    expect(room.gameState.maps.default.tokens['legacy-tok-2'].position).to.deep.equal({ x: 3, y: 4 });

    // Legacy character_moved shape still validates and relays to the room
    // (the handler relays to everyone except the sender).
    const observer = await openVerified();
    await join(observer.client, room.id, { playerName: 'Observer' });
    const characterEchoP = once(observer.client, 'character_moved');
    gm.client.emit('character_moved', {
      tokenId: 'char-tok-1',
      characterId: 'char-1',
      position: { x: 2, y: 2 },
      isDragging: false
    });
    const characterEcho = await characterEchoP;
    expect(characterEcho.tokenId).to.equal('char-tok-1');
    expect(characterEcho.mapId).to.equal('default');
  });

  it('character_moved: non-default mapId is relayed and identity stays socket-derived', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm);
    const observer = await openVerified();
    await join(observer.client, room.id, { playerName: 'Observer' });

    const verifiedPlayerId = server.players.get(gm.client.id).id;
    const echoP = once(observer.client, 'character_moved');
    gm.client.emit('character_moved', {
      roomId: room.id,
      mapId: 'map-2',
      tokenId: 'char-tok-map2',
      characterId: 'char-1',
      position: { x: 4, y: 5 },
      isDragging: false,
      playerId: 'spoofed-player' // unknown to the schema and never trusted
    });

    const echo = await echoP;
    expect(echo.mapId).to.equal('map-2');
    expect(echo.tokenId).to.equal('char-tok-map2');
    expect(echo.playerId).to.equal(verifiedPlayerId);
    expect(echo.playerId).to.not.equal('spoofed-player');
    expect(server.players.get(gm.client.id).currentMapId).to.equal('map-2');
  });

  it('character_moved: relay stays room-scoped and a foreign roomId is rejected', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm);
    const observer = await openVerified();
    await join(observer.client, room.id, { playerName: 'Observer' });

    const gmB = await openVerified();
    const roomB = await seedRoomFor(gmB);
    const observerB = await openVerified();
    await join(observerB.client, roomB.id, { playerName: 'ObserverB' });

    const roomAReceipts = collect(observer.client, 'character_moved', 400);
    const roomBReceipts = collect(observerB.client, 'character_moved', 400);

    // Valid move inside the sender's room.
    gm.client.emit('character_moved', {
      roomId: room.id,
      mapId: 'map-2',
      tokenId: 'char-tok-a',
      position: { x: 1, y: 1 },
      isDragging: false
    });
    // Claimed foreign room: the membership check must drop it entirely.
    gm.client.emit('character_moved', {
      roomId: roomB.id,
      mapId: 'map-2',
      tokenId: 'char-tok-b',
      position: { x: 2, y: 2 },
      isDragging: false
    });

    const roomAEchoes = await roomAReceipts;
    const roomBEchoes = await roomBReceipts;

    expect(roomAEchoes).to.have.length(1);
    expect(roomAEchoes[0].tokenId).to.equal('char-tok-a');
    expect(roomBEchoes).to.have.length(0);
  });

  it('compatibility: both token capability modes ack and emit their expected channel', async() => {
    const gm = await openVerified();
    const room = await seedRoomFor(gm);
    const originalEnv = process.env.ENABLE_TOKENS_DELTA;

    try {
      delete process.env.ENABLE_TOKENS_DELTA;
      const granularP = once(gm.client, 'token_created');
      const granularAck = await createToken(gm, room, 'tok-granular');
      expect(granularAck.acks[0].success).to.equal(true);
      const granular = await granularP;
      expect(granular.token.id).to.equal('tok-granular');

      process.env.ENABLE_TOKENS_DELTA = 'true';
      const deltaP = once(gm.client, 'tokens_delta');
      const deltaAck = await createToken(gm, room, 'tok-delta');
      expect(deltaAck.acks[0].success).to.equal(true);
      const delta = await deltaP;
      expect(delta.tokens).to.be.an('array');
      expect(delta.tokens.map(t => t.id)).to.include('tok-delta');
    } finally {
      if (originalEnv === undefined) {
        delete process.env.ENABLE_TOKENS_DELTA;
      } else {
        process.env.ENABLE_TOKENS_DELTA = originalEnv;
      }
    }
  });
});
