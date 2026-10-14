const assert = require('assert/strict');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter, createSyncServices } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const observations = [];
const ack = (client, event, data) => new Promise(resolve => {
  const timer = setTimeout(() => resolve({ success: false, code: 'ack_timeout' }), 700);
  client.emit(event, data, result => { clearTimeout(timer); resolve(result); });
});
describe('P7 ordinary bounds edits through production registration', function() {
  this.timeout(15000);
  let server, gm, peer, room, writer, services;
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { persist: async() => false });
    server = createProductionStackServer({ firebaseBatchWriter: writer, characterOwners: { 'c-gm': 'u-gm' } });
    await server.start();
    for (const event of ['join_room', 'actor_snapshot', 'actor_bind', 'actor_consequence', 'actor_propose', 'actor_adjudicate', 'token_updated', 'character_token_updated', 'character_updated', 'creature_updated']) server.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
    services = createSyncServices(server.io, server.rooms, server.players, { authorityService: server.authorityService });
    for (const name of ['shouldPersist', 'captureAuthority', 'authorityCurrent', 'authorityAccept', 'authorityConfirm', 'captureMetadata', 'getRoomRevision', 'validateSnapshot', 'onConfirmed']) writer[name] = services.firebaseBatchWriter[name];
    writer.authorityRequired = true;
    server.registerAuthToken('bounds-gm', 'u-gm'); gm = server.connect({ token: 'bounds-gm' });
    await new Promise(resolve => gm.once('connect', resolve));
    room = await server.seedRoom(gm.id, { gmUserId: 'u-gm', persistentRoomId: crypto.randomUUID() });
    server.registerAuthToken('bounds-peer', 'u-peer'); peer = server.connect({ token: 'bounds-peer' });
    await new Promise(resolve => peer.once('connect', resolve));
    const joined = new Promise(resolve => peer.once('room_joined', resolve));
    peer.emit('join_room', { roomId: room.id, playerName: 'Bounds peer', password: '' }); await joined;
  });
  afterEach(async() => { gm.disconnect(); peer.disconnect(); services.firebaseBatchWriter.stop(); services.movementDebouncer.stop(); await server.stop(); });
  after(() => { if (process.env.P7_BOUNDS_OUT) fs.writeFileSync(path.join(process.env.P7_BOUNDS_OUT, 'observations.json'), JSON.stringify(observations, null, 2)); });
  const raw = id => ({ id, ownerUserId: 'u-gm', stats: { maxHp: 50, maxMana: 30, maxAP: 5, strength: 7 }, state: { currentHp: 40, currentMana: 20, currentActionPoints: 3, tempHealth: 6, tempMana: 2, tempActionPoints: 1, conditions: [], customName: 'kept' }, build: { privateKept: true } });
  const bind = async(kind = 'creature', field = 'tokens', id = 'actor') => {
    const token = raw(id);
    if (kind === 'character') token.character = { id: 'c-gm', level: 2, health: { current: 40, max: 50 }, mana: { current: 20, max: 30 }, actionPoints: { current: 3, max: 5 }, tempHealth: 6, tempMana: 2, tempActionPoints: 1 };
    room.gameState.maps.default[field] ||= {};
    room.gameState.maps.default[field][id] = token;
    const ref = { kind, roomId: room.id, mapId: 'default', tokenId: id, ...(kind === 'character' ? { ownerUid: 'u-gm', characterId: 'c-gm' } : {}) };
    const result = await ack(gm, 'actor_bind', { roomId: room.id, ref, snapshotHash: actors.hash(token) });
    assert.equal(result.success, true, JSON.stringify(result)); return result.ref;
  };
  const command = async(ref, current = 20) => {
    const snapshot = await ack(gm, 'actor_snapshot', { roomId: room.id });
    return { version: 1, roomId: room.id, commandId: crypto.randomUUID(), actionEpoch: snapshot.actionEpoch, baseCommitSequence: snapshot.commitSequence,
      actors: [{ ref, expectedRevision: actors.locate(room, ref).contract.revision, finalResources: { hp: { current, temp: 6 } } }] };
  };
  it('exact historical state/maxHp60 and stats/maxHp60/maxMana30/maxAP5 packets install authorized in-place bounds', async() => {
    const results = [];
    for (const [id, updates] of [['historical-state', { state: { maxHp: 60 } }], ['historical-stats', { stats: { maxHp: 60, maxMana: 30, maxAP: 5 } }]]) {
      const ref = await bind('creature', 'tokens', id);
      const result = await ack(gm, 'token_updated', { roomId: room.id, mapId: 'default', tokenId: id, updates });
      results.push({ updates, result, installed: actors.clone(actors.locate(room, ref).token) });
    }
    observations.push({ name: 'exact-historical-packets', results });
    for (const value of results) {assert.equal(value.result.success, true, JSON.stringify(value)); assert.equal(value.installed.state.maxHp, 60);}
  });
  it('restores both historical envelopes, stales immutable proposals, preserves fields and checkpoints the same bounds/cut', async() => {
    const ref = await bind(), old = await command(ref), proposal = await ack(peer, 'actor_propose', old);
    actors.locate(room, ref).token.state.conditions = [{ id: 'legacy-kept', originalName: 'Unknown manual', privateUnknown: { exact: ['keep', 0] }, remainingRounds: 0 }];
    const before = actors.clone(actors.locate(room, ref).token), cut = room.gameState.actorProjection.cut;
    const delivery = new Promise(resolve => gm.once('token_updated', resolve));
    const result = await ack(gm, 'token_updated', { roomId: room.id, mapId: 'default', tokenId: 'actor', updates: { state: { maxHp: 60 } } });
    observations.push({ name: 'historical-state-max60', result, installed: actors.clone(room.gameState.maps.default.tokens.actor) });
    assert.equal(result.success, true, JSON.stringify(result));
    const packet = await delivery, token = actors.locate(room, ref).token;
    assert.equal(token.state.maxHp, 60); assert.equal(token.state.actorContract.revision, 1);
    assert.equal(room.gameState.actorProjection.cut, cut + 1); assert.equal(packet.actorSnapshot.actorProjection.cut, cut + 1);
    for (const key of ['currentHp', 'currentMana', 'currentActionPoints', 'tempHealth', 'tempMana', 'tempActionPoints', 'conditions', 'customName']) assert.deepEqual(token.state[key], before.state[key]);
    assert.deepEqual(token.build, before.build); assert.equal(token.stats.strength, 7);
    assert.deepEqual(room.gameState.tokens.actor, token);
    const installed = JSON.stringify(room.gameState);
    assert.equal((await ack(gm, 'actor_consequence', old)).code, 'stale_actor_revision');
    assert.equal((await ack(gm, 'actor_adjudicate', { roomId: room.id, proposalId: proposal.proposalId, contentHash: proposal.contentHash })).code, 'stale_actor_revision');
    assert.equal(JSON.stringify(room.gameState), installed);
    const next = await ack(gm, 'token_updated', { roomId: room.id, tokenId: 'actor', updates: { stats: { maxHp: 70, maxMana: 35, maxAP: 6, agility: 9 } } });
    assert.equal(next.success, true, JSON.stringify(next)); assert.equal(actors.locate(room, ref).contract.revision, 2);
    assert.deepEqual(Object.fromEntries(Object.entries(actors.resources(actors.locate(room, ref).token, 'creature')).map(([key, value]) => [key, value.max])), { hp: 70, mana: 35, ap: 6 });
    assert.equal(actors.locate(room, ref).token.stats.strength, 7);
    const retained = writer.getRetainedSnapshot(room.id);
    assert.deepEqual(retained.maps.default.tokens.actor, room.gameState.maps.default.tokens.actor);
    assert.deepEqual(retained.actorProjection, room.gameState.actorProjection);
    assert.equal((await ack(gm, 'actor_consequence', await command(ref, 65))).success, true);
    assert.equal((await ack(gm, 'actor_consequence', await command(ref, 71))).code, 'invalid_resources');
  });
  it('permits lower/zero maxima without clamping or bumping unchanged bounds, and keeps revision for unrelated build edits', async() => {
    const ref = await bind();
    for (const maxHp of [10, 0, 0]) {
      const previous = actors.locate(room, ref).contract.revision;
      assert.equal((await ack(gm, 'token_updated', { roomId: room.id, tokenId: 'actor', updates: { state: { maxHp } } })).success, true);
      const token = actors.locate(room, ref).token;
      assert.equal(token.state.currentHp, 40); assert.equal(token.state.tempHealth, 6);
      assert.equal(token.state.actorContract.revision, previous + (maxHp === 0 && previous === 2 ? 0 : 1));
    }
    const revision = actors.locate(room, ref).contract.revision;
    assert.equal((await ack(gm, 'token_updated', { roomId: room.id, tokenId: 'actor', updates: { stats: { strength: 11 }, state: { customName: 'Renamed' } } })).success, true);
    assert.equal(actors.locate(room, ref).contract.revision, revision); assert.equal(actors.locate(room, ref).token.stats.maxHp, 50);
  });
  it('PC max-only refresh merges resource pairs and build fields, rejects stale commands, secondary tokens and foreign identity', async() => {
    const ref = await bind('character', 'characterTokens', 'pc'), old = await command(ref);
    const result = await ack(gm, 'character_token_updated', { roomId: room.id, tokenId: 'pc', character: { id: 'c-gm', health: { max: 60 }, mana: { max: 35 }, actionPoints: { max: 6 }, level: 3 } });
    observations.push({ name: 'pc-max-build', result }); assert.equal(result.success, true, JSON.stringify(result));
    const token = actors.locate(room, ref).token;
    assert.deepEqual(token.character.health, { current: 40, max: 60 }); assert.equal(token.character.level, 3); assert.equal(token.character.tempHealth, 6);
    assert.equal(token.state.actorContract.revision, 1); assert.equal((await ack(gm, 'actor_consequence', old)).code, 'stale_actor_revision');
    assert.equal((await ack(gm, 'actor_consequence', await command(ref, 55))).success, true);
    const before = JSON.stringify(room.gameState);
    assert.equal((await ack(gm, 'character_token_updated', { roomId: room.id, tokenId: 'pc', character: { id: 'foreign', health: { max: 80 } } })).success, false);
    assert.equal(JSON.stringify(room.gameState), before);
    actors.locate(room, ref).token.state.actorContract.primary = false;
    const secondary = JSON.stringify(room.gameState);
    assert.equal((await ack(gm, 'character_token_updated', { roomId: room.id, tokenId: 'pc', character: { health: { max: 80 } } })).code, 'secondary_attachment');
    assert.equal(JSON.stringify(room.gameState), secondary);
  });
  it('environment creature sibling uses the same maximum merge and refusal boundary', async() => {
    const ref = await bind('creature', 'creatures', 'environment'); // explicit production adaptation moves it to tokens
    const old = await command(ref);
    const boundResult = await ack(gm, 'creature_updated', { roomId: room.id, creatureId: 'environment', updates: { stats: { maxHp: 60 } } });
    assert.equal(boundResult.success, true, JSON.stringify(boundResult));
    assert.equal(actors.locate(room, ref).contract.revision, 1); assert.equal((await ack(gm, 'actor_consequence', old)).code, 'stale_actor_revision');
    room.gameState.maps.default.creatures.unbound = raw('unbound');
    const result = await ack(gm, 'creature_updated', { roomId: room.id, creatureId: 'unbound', updates: { state: { maxHp: 60 }, stats: { agility: 9 } } });
    assert.equal(result.success, true, JSON.stringify(result));
    const token = room.gameState.maps.default.creatures.unbound;
    assert.equal(token.state.currentHp, 40); assert.equal(token.state.maxHp, 60); assert.equal(token.stats.strength, 7);
  });
  it('character build refresh updates the exact primary and preserves authoritative currents/temp instead of stale player mirrors', async() => {
    const ref = await bind('character', 'characterTokens', 'pc');
    server.players.get(gm.id).character = { id: 'c-gm', health: { current: 1, max: 50 } };
    const old = await command(ref);
    const result = await ack(gm, 'character_updated', { roomId: room.id, characterId: 'c-gm', character: { id: 'c-gm', health: { max: 80 }, level: 4 } });
    assert.equal(result.success, true, JSON.stringify(result));
    assert.equal(actors.locate(room, ref).contract.revision, 1); assert.deepEqual(actors.locate(room, ref).token.character.health, { current: 40, max: 80 });
    assert.deepEqual(server.players.get(gm.id).character.health, { current: 40, max: 80 });
    assert.equal((await ack(gm, 'actor_consequence', old)).code, 'stale_actor_revision');
    const before = JSON.stringify(room.gameState);
    assert.equal((await ack(gm, 'character_updated', { roomId: room.id, characterId: 'c-gm', character: { id: 'c-gm', health: { max: 90, current: 1 } } })).success, false);
    assert.equal(JSON.stringify(room.gameState), before);
  });
  it('owner maximum edits preserve the same authority on an exact nondefault map, and refuse a revoked owner', async() => {
    await bind();
    room.gameState.maps.other = { id: 'other', tokens: { actor: raw('actor') }, characterTokens: {}, creatures: {} };
    // An ambiguous legacy root mirror is refused before the proposed edit.
    const beforeCollision = JSON.stringify(room.gameState);
    assert.equal((await ack(gm, 'token_updated', { roomId: room.id, tokenId: 'actor', updates: { state: { maxHp: 60 } } })).code, 'actor_binding_conflict');
    assert.equal(JSON.stringify(room.gameState), beforeCollision);
    delete room.gameState.maps.other.tokens.actor;
    room.gameState.maps.other.tokens.remote = { ...raw('remote'), ownerUserId: 'u-peer' };
    const target = room.gameState.maps.other.tokens.remote;
    const bound = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'other', tokenId: 'remote' }, snapshotHash: actors.hash(target) });
    assert.equal(bound.success, true);
    const old = await command(bound.ref);
    const result = await ack(peer, 'token_updated', { roomId: room.id, mapId: 'other', tokenId: 'remote', updates: { stats: { maxHp: 60 } } });
    assert.equal(result.success, true, JSON.stringify(result));
    assert.equal(actors.locate(room, bound.ref).contract.revision, 1);
    assert.equal(room.gameState.maps.default.tokens.actor.state.maxHp, 50);
    assert.equal((await ack(gm, 'actor_consequence', old)).code, 'stale_actor_revision');
    room.gameState.maps.other.tokens.remote.ownerUserId = 'revoked';
    const before = JSON.stringify(room.gameState);
    assert.equal((await ack(peer, 'token_updated', { roomId: room.id, mapId: 'other', tokenId: 'remote', updates: { stats: { maxHp: 90 } } })).code, 'forbidden');
    assert.equal(JSON.stringify(room.gameState), before);
  });
  it('malformed maxima/containers, alternate currents/conditions and metadata refuse atomically without relay/checkpoint/cut', async() => {
    await bind();
    const packets = [
      ...[null, '60', -1, {}, [], true].map(maxHp => ({ state: { maxHp } })),
      { stats: null }, { state: [] }, { character: null },
      { state: { maxHp: 60, currentHp: 1 } }, { stats: { maxHp: 60 }, state: { conditions: [] } },
      { stats: { maxAP: 6, maxActionPoints: 7 } }, { state: { maxHp: 60 }, stats: { maxHp: 70 } },
      { state: { maxHp: 60, actorContract: { revision: 99 } } }, { actorConsequences: {} },
      { actorProjection: {} }, { state: { actorLifecycle: {} } }, { actorSnapshot: {} },
      { character: { health: { max: 60, current: 1 } } }, { character: { health: { max: '60' } } },
      { unknown: { maxHp: 60 } }
    ];
    let relays = 0; gm.on('token_updated', () => relays++);
    for (const updates of packets) {
      const before = JSON.stringify(room.gameState), retained = actors.hash(writer.getRetainedSnapshot(room.id));
      const result = await ack(gm, 'token_updated', { roomId: room.id, tokenId: 'actor', updates });
      assert.equal(result.success, false, JSON.stringify({ updates, result })); assert.notEqual(result.code, 'ack_timeout');
      assert.equal(JSON.stringify(room.gameState), before); assert.equal(actors.hash(writer.getRetainedSnapshot(room.id)), retained);
    }
    const before = JSON.stringify(room.gameState);
    assert.equal((await ack(peer, 'token_updated', { roomId: room.id, tokenId: 'actor', updates: { state: { maxHp: 90 } } })).code, 'forbidden');
    assert.equal(JSON.stringify(room.gameState), before); assert.equal(relays, 0);
    // JSON cannot transport nonfinite values; directly exercise the production validator as well.
    for (const maxHp of [NaN, Infinity, -Infinity]) assert.throws(() => actors.prepareBuildUpdate(room.gameState.maps.default.tokens.actor, { state: { maxHp } }, 'creature'));
  });
  it('real creation import quarantines root/map ordering and token lifecycle bytes', () => {
    const filename = path.resolve(__dirname, '../handlers/roomLifecycleHandlers.js');
    const body = fs.readFileSync(filename, 'utf8').match(/function initialGameStateFromClassification[\s\S]*?\n}\n/)[0];
    const order = { version: 1, roomId: 'forged', epoch: 'fake', cut: 99 };
    const input = { defaultMapId: 'default', actorProjection: order, maps: { default: { id: 'default', actorProjection: order, tokens: { imported: { id: 'imported', state: { actorLifecycle: order } } }, characterTokens: {}, gridItems: {} } } };
    const result = vm.runInNewContext(`${body}; initialGameStateFromClassification(classification, input)`, { roomCheckpoint: require('../services/roomCheckpoint'), require, classification: { kind: 'ROOM_PRESENT_NO_SNAPSHOT' }, input });
    assert.equal(result.gameState.actorProjection, undefined); assert.deepEqual(result.gameState.actorConsequenceRecovery.importedActorProjection, order);
    const map = result.gameState.maps.default; assert.equal(map.actorProjection, undefined); assert.deepEqual(map.actorProjectionRecovery.importedActorProjection, order);
    assert.equal(map.tokens.imported.state.actorLifecycle, undefined); assert.deepEqual(map.tokens.imported.state.actorRecovery.importedActorLifecycle, order);
  });
});
