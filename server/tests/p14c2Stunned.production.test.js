const assert = require('assert/strict');
const crypto = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const actors = require('../services/actorConsequences');
const profile = require('../../vtt-react/src/services/sharedConditionProfile');
const uuid = () => crypto.randomUUID();
const ack = (s, e, d) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error(e)), 5000); s.emit(e, d, r => { clearTimeout(t); resolve(r); }); });
const once = (s, e) => new Promise(r => s.once(e, r));
const pause = () => new Promise(r => setTimeout(r, 120));

describe('P14-C2 Stunned registered production paths', function() {
  this.timeout(20000);
  let server, room, gm, owner, other, pc, foe;
  beforeEach(async() => {
    server = createProductionStackServer({ characterOwners: { c: 'owner' } }); await server.start();
    server.setEventLimits('join_room', { maxPerMinute: 2000, maxPerSecond: 2000 });
    for (const e of ['actor_bind', 'actor_consequence', 'actor_snapshot', 'actor_propose', 'actor_adjudicate', 'actor_strike_approve', 'token_updated', 'token_moved', 'character_moved']) server.setEventLimits(e, { maxPerMinute: 2000, maxPerSecond: 2000 });
    for (const u of ['gm', 'owner', 'other']) server.registerAuthToken(u, u);
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: 'gm' });
    for (const u of ['owner', 'other']) { const s = server.connect({ token: u }); await once(s, 'connect'); const joined = once(s, 'room_joined'); s.emit('join_room', { roomId: room.id, playerName: u, password: '' }); await joined; if (u === 'owner') owner = s; else other = s; }
    const map = room.gameState.maps.default;
    map.tokens.foe = { id: 'foe', position: { x: 75, y: 25 }, stats: { maxHp: 30, maxMana: 0, maxAP: 4 }, state: { currentHp: 30, currentMana: 0, currentActionPoints: 4, conditions: [] } };
    map.characterTokens.pc = { id: 'pc', ownerUserId: 'owner', position: { x: 25, y: 25 }, character: { id: 'c', health: { current: 30, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 } }, state: { conditions: [] } };
    pc = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid: 'owner', characterId: 'c' }, snapshotHash: actors.hash(map.characterTokens.pc) })).ref;
    foe = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'foe' }, snapshotHash: actors.hash(map.tokens.foe) })).ref;
    assert.ok(pc && foe);
  });
  afterEach(async() => { gm.disconnect(); owner.disconnect(); other.disconnect(); await server.stop(); });
  const token = ref => actors.locate(server.rooms.get(room.id), ref).token;
  const base = () => ({ version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(server.rooms.get(room.id)), baseCommitSequence: actors.ledger(server.rooms.get(room.id)).commitSequence });
  const correction = (ref, op, record) => ({ ...base(), target: ref,
    actors: [{ ref, expectedRevision: token(ref).state.actorContract.revision, conditions: [{ op, recordId: record.recordId, ...(op !== 'remove' ? { record } : {}) }] }],
    adjudication: { definitionId: profile.STUNNED.definitionId, definitionVersionOrHash: profile.STUNNED.origin, chosenResult: 'Manual correction' } });
  const record = (ref = pc, sourceOccurrence = 'critical-1', timing = 'critical-one-round') => profile.makeStunnedRecord(ref, uuid(), { sourceOccurrence, timing, sourceActor: foe });
  const add = async(r = record()) => { const c = correction(r.target, 'add', r), result = await ack(gm, 'actor_consequence', c); assert.equal(result.success, true, JSON.stringify(result)); return { r, c, result }; };

  it('exact independent sources/durations, typed identity, ownership, duplicate/retry, correction and checkpoint/new-runtime recovery', async() => {
    const r = record(), c = correction(pc, 'add', r), before = actors.clone(token(pc).character);
    assert.equal((await ack(other, 'actor_consequence', c)).code, 'authorization_required');
    const accepted = await ack(owner, 'actor_consequence', c); assert.equal(accepted.success, true);
    assert.deepEqual((await ack(owner, 'actor_consequence', c)).receipt, accepted.receipt);
    assert.equal((await ack(gm, 'actor_consequence', correction(pc, 'add', record()))).code, 'condition_already_active');
    const second = (await add(record(pc, 'bash-2', 'shield-bash-target-end'))).r;
    assert.equal(token(pc).state.conditions.length, 2);
    const edited = profile.makeStunnedRecord(pc, second.recordId, { sourceOccurrence: second.sourceEntityId, sourceActor: foe, timing: 'manual' });
    assert.equal((await ack(gm, 'actor_consequence', correction(pc, 'update', edited))).success, true);
    assert.equal(token(pc).state.conditions[0].clockBoundary, 'critical-one-round');
    assert.equal(token(pc).state.conditions[1].clockBoundary, 'manual');
    // Historical attribution survives the source actor's later departure.
    const departed = room.gameState.maps.default.tokens.foe;
    delete room.gameState.maps.default.tokens.foe;
    assert.equal((await ack(gm, 'actor_consequence', correction(pc, 'update', edited))).success, true);
    room.gameState.maps.default.tokens.foe = departed;
    assert.deepEqual(token(pc).character, before);
    const bad = actors.clone(edited); bad.description = 'stun from arbitrary prose';
    assert.equal((await ack(gm, 'actor_consequence', correction(pc, 'update', bad))).code, 'invalid_shared_condition');
    const downgrade = correction(pc, 'update', { ...edited, effectOrigin: 'custom' }); delete downgrade.adjudication;
    assert.equal((await ack(gm, 'actor_consequence', downgrade)).code, 'invalid_shared_condition');
    const codec = require('../services/roomCheckpoint'), built = codec.buildCheckpointDocuments({ roomId: room.id, gameState: room.gameState, revision: 1 });
    const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])) }); assert.equal(decoded.ok, true);
    room = { ...room, gameState: { ...decoded.global, maps: decoded.maps, ...codec.deriveRootMirrors(decoded.maps) }, checkpointRevision: 1 }; server.rooms.set(room.id, room);
    room.gameState.actorConsequences.receipts = []; room.gameState.actorConsequences.replayFloor = room.gameState.actorConsequences.commitSequence;
    assert.equal((await ack(owner, 'actor_consequence', c)).code, 'outcome_unknown');
    assert.equal(profile.holdsStunned(token(pc)), true);
    assert.equal((await ack(gm, 'actor_consequence', correction(pc, 'remove', r))).success, true);
    assert.equal(profile.holdsStunned(token(pc)), true);
    assert.equal((await ack(owner, 'actor_consequence', correction(pc, 'remove', edited))).success, true);
    assert.equal(profile.holdsStunned(token(pc)), false);
  });
  it('legacy name/key/UUID does not execute; canonical P8/P12B action refuses, manual administration/removal remains possible', async() => {
    const legacy = record(foe); delete legacy.effectOrigin;
    token(foe).state.conditions.push(legacy); assert.equal(profile.holdsStunned(token(foe)), false);
    const r = (await add(record(foe, 'creature-stun'))).r;
    const command = { ...base(), source: foe, target: pc, actors: [
      { ref: foe, expectedRevision: token(foe).state.actorContract.revision, finalResources: { ap: { current: 3, temp: 0 } } },
      { ref: pc, expectedRevision: token(pc).state.actorContract.revision, finalResources: { hp: { current: 20, temp: 0 } } }
    ], adjudication: { definitionId: 'grimmstalk_feather_slash', definitionVersionOrHash: 'feather-slash:v1/abilities:1.4.0', chosenResult: 'retained roll', finalAmount: 10 } };
    const before = actors.clone(room.gameState);
    assert.equal((await ack(gm, 'actor_consequence', command)).code, 'actor_stunned'); assert.deepEqual(room.gameState, before);
    const admin = { ...base(), actors: [{ ref: foe, expectedRevision: token(foe).state.actorContract.revision, finalResources: { ap: { current: 4, temp: 0 } } }] };
    assert.equal((await ack(gm, 'actor_consequence', admin)).success, true);
    assert.equal((await ack(gm, 'actor_consequence', correction(foe, 'remove', r))).success, true);
    command.commandId = uuid(); command.baseCommitSequence = actors.ledger(room).commitSequence; command.actors[0].expectedRevision = token(foe).state.actorContract.revision;
    assert.equal((await ack(gm, 'actor_consequence', command)).success, true);
  });
  it('supported movement siblings refuse voluntary movement, generic position update cannot bypass; GM can reposition and removal restores movement', async() => {
    const r = (await add()).r, start = actors.clone(token(pc).position);
    for (const event of ['character_moved', 'token_moved']) {
      const error = once(owner, 'room_error'); owner.emit(event, { roomId: room.id, tokenId: 'pc', mapId: 'default', position: { x: 200, y: 25 } });
      assert.equal((await error).code, 'actor_stunned'); assert.deepEqual(token(pc).position, start);
    }
    assert.equal((await ack(owner, 'token_updated', { roomId: room.id, tokenId: 'pc', mapId: 'default', updates: { position: { x: 200, y: 25 } } })).code, 'actor_stunned');
    const relay = once(owner, 'character_moved'); gm.emit('character_moved', { roomId: room.id, tokenId: 'pc', mapId: 'default', position: { x: 100, y: 25 } }); await relay;
    assert.equal(token(pc).position.x, 100);
    assert.equal((await ack(owner, 'actor_consequence', correction(pc, 'remove', r))).success, true);
    const moved = once(gm, 'character_moved'); owner.emit('character_moved', { roomId: room.id, tokenId: 'pc', mapId: 'default', position: { x: 125, y: 25 } }); await moved; assert.equal(token(pc).position.x, 125);
  });
  it('debounced move queued before Stunned rechecks after asynchronous authority settlement', async() => {
    const { MovementDebouncer } = require('../services/syncService');
    let release; const gate = new Promise(r => { release = r; });
    const debouncer = new MovementDebouncer(50, null, { authoritySettleValid: async() => { await gate; return true; } });
    const player = server.players.get(owner.id), start = actors.clone(token(pc).position), events = [];
    debouncer.queueMove(room.id, 'pc', { playerId: owner.id, mapId: 'default', position: { x: 500, y: 25 } }, room.authorityToken,
      { playerRef: player, userId: 'owner', roomRef: room });
    const pending = debouncer.flush({ to: () => ({ emit: (event, payload) => events.push({ event, payload }) }) }, server.rooms, server.players);
    await add(); release(); await pending;
    assert.deepEqual(token(pc).position, start); assert.equal(events.some(e => e.payload.code === 'actor_stunned'), true);
    await pause();
  });
});
