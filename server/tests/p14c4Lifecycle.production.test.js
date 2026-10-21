const assert = require('assert/strict');
const crypto = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const profile = require('../../vtt-react/src/services/sharedConditionProfile');
const timing = require('../../vtt-react/src/services/sharedEffectTiming');
const bash = require('../../vtt-react/src/services/shieldBashResult');
const uuid = () => crypto.randomUUID();
const ack = (s, event, data) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error(event)), 5000); s.emit(event, data, r => { clearTimeout(t); resolve(r); }); });
const once = (s, event) => new Promise(resolve => s.once(event, resolve));

describe('P14-C4 authenticated boundary production lifecycle', function() {
  this.timeout(15000);
  let server, room, gm, owner, pc, foe, ownerUid;
  beforeEach(async() => {
    const writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer }); await server.start();
    for (const e of ['actor_bind', 'actor_consequence', 'actor_snapshot', 'actor_turn_boundary', 'combat_started', 'combat_turn_changed']) server.setEventLimits(e, { maxPerMinute: 2000, maxPerSecond: 2000 });
    const gmUid = server.nextUserId(); ownerUid = server.nextUserId(); server.registerAuthToken('gm', gmUid); server.registerAuthToken('owner', ownerUid);
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: gmUid });
    owner = server.connect({ token: 'owner' }); await once(owner, 'connect'); const joined = once(owner, 'room_joined'); owner.emit('join_room', { roomId: room.id, playerName: 'owner', password: '' }); await joined;
    server.setCharacterOwner('c', ownerUid);
    const map = room.gameState.maps.default;
    map.tokens.foe = { id: 'foe', position: { x: 75, y: 25 }, stats: { maxHp: 30, maxMana: 0, maxAP: 4 }, state: { currentHp: 30, currentMana: 0, currentActionPoints: 4, conditions: [] } };
    map.characterTokens.pc = { id: 'pc', ownerUserId: ownerUid, position: { x: 25, y: 25 }, character: { id: 'c', health: { current: 30, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 },
      classResource: { current: 7 }, inventory: ['untouched'], equipment: { chest: { id: 'hide', durability: 'd8' } } }, state: { conditions: [] } };
    pc = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'c' }, snapshotHash: actors.hash(map.characterTokens.pc) })).ref;
    foe = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'foe' }, snapshotHash: actors.hash(map.tokens.foe) })).ref;
    assert.ok(pc && foe);
    assert.equal((await ack(gm, 'combat_started', { roomId: room.id, turnOrder: [pc, foe].map(ref => ({ tokenId: ref.tokenId, actorRef: ref })), currentTurnIndex: 0, round: 1 })).success, true);
  });
  afterEach(async() => { gm.disconnect(); owner.disconnect(); await server.stop(); });
  const token = ref => actors.locate(server.rooms.get(room.id), ref).token;
  const base = id => ({ version: 1, roomId: room.id, commandId: id || uuid(), actionEpoch: actors.epoch(server.rooms.get(room.id)), baseCommitSequence: actors.ledger(server.rooms.get(room.id)).commitSequence });
  const boundary = (mode = 'advance') => ({ ...base(), mode, combatHash: actors.hash(room.gameState.combat), expectedClock: mode === 'advance' ? { id: room.gameState.combat.effectLifecycle.id, sequence: room.gameState.combat.effectLifecycle.sequence } : null });
  const adopt = async() => { const c = boundary('adopt'), result = await ack(gm, 'actor_turn_boundary', c); assert.equal(result.success, true, JSON.stringify(result)); return c; };
  const advance = async() => { const c = boundary(), result = await ack(gm, 'actor_turn_boundary', c); assert.equal(result.success, true, JSON.stringify(result)); return { c, result }; };
  const edit = (ref, op, record) => ({ ...base(), target: ref, actors: [{ ref, expectedRevision: token(ref).state.actorContract.revision, conditions: [{ op, recordId: record.recordId, ...(op === 'remove' ? {} : { record }) }] }],
    adjudication: { definitionId: record.conditionKey === 'defending' ? profile.DEFENDING.definitionId : profile.STUNNED.definitionId, definitionVersionOrHash: record.effectOrigin, chosenResult: 'Manual state correction' } });
  const add = async record => { const r = await ack(gm, 'actor_consequence', edit(record.target, 'add', record)); assert.equal(r.success, true, JSON.stringify(r)); return record; };
  const addBash = async() => { const id = uuid(), record = bash.makeRecord(foe, pc, id), c = edit(pc, 'add', record); c.commandId = id; c.adjudication.chosenResult = JSON.stringify({ manualResult: bash.metadata(foe, pc, id) });
    const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true, JSON.stringify(r)); return record; };

  it('adoption is not a boundary/retroactive arm; own-turn canonical Defending expires only on next start, with duplicate retry and zero resource changes', async() => {
    const old = await add(profile.makeDefendingRecord(pc, uuid())); const adoption = await adopt();
    assert.equal(timing.scheduleFor(old, room.gameState.combat), null); assert.equal(token(pc).state.conditions.length, 1);
    assert.equal((await ack(gm, 'actor_consequence', edit(pc, 'remove', old))).success, true);
    const record = await add(profile.makeDefendingRecord(pc, uuid())), before = actors.clone(token(pc).character);
    assert.equal(timing.scheduleFor(record, room.gameState.combat).dueSequence, 2); assert.match(profile.expiryLabel(record, room.gameState.combat), /Automatic.*start/);
    const first = await advance(); assert.equal(token(pc).state.conditions.length, 1);
    assert.deepEqual((await ack(gm, 'actor_turn_boundary', first.c)).receipt, first.result.receipt); assert.equal(room.gameState.combat.effectLifecycle.sequence, 1);
    const last = await advance(); assert.equal(token(pc).state.conditions.length, 0); assert.equal(room.gameState.combat.effectLifecycle.sequence, 2);
    assert.deepEqual((await ack(gm, 'actor_turn_boundary', last.c)).receipt, last.result.receipt); assert.deepEqual(token(pc).character, before);
    assert.equal((await ack(gm, 'actor_turn_boundary', adoption)).success, true); assert.equal(room.gameState.combat.effectLifecycle.sequence, 2);
  });
  it('ongoing-target-turn Shield Bash waits through next start until its end; later Bash and manual one-round source stay independent', async() => {
    await adopt(); const first = await addBash(), critical = await add(profile.makeStunnedRecord(pc, uuid(), { sourceActor: foe, sourceOccurrence: 'critical', timing: 'critical-one-round' }));
    assert.equal(timing.scheduleFor(first, room.gameState.combat).dueSequence, 3); assert.equal(timing.scheduleFor(critical, room.gameState.combat), null);
    await advance(); assert.equal(token(pc).state.conditions.length, 2); await advance(); assert.equal(token(pc).state.conditions.length, 2);
    const later = await addBash(); assert.equal(timing.scheduleFor(later, room.gameState.combat).dueSequence, 5);
    await advance(); assert.deepEqual(token(pc).state.conditions.map(r => r.recordId).sort(), [critical.recordId, later.recordId].sort());
    assert.throws(() => actors.assertCanAct(room, pc), /Stunned/); await advance(); await advance();
    assert.deepEqual(token(pc).state.conditions, [critical]); assert.throws(() => actors.assertCanAct(room, pc), /Stunned/);
    assert.equal((await ack(gm, 'actor_consequence', edit(pc, 'remove', critical))).success, true); assert.doesNotThrow(() => actors.assertCanAct(room, pc));
  });
  it('explicit duration correction cancels exact schedule; stale competing boundary cannot overwrite newer GM correction', async() => {
    await adopt(); const record = await addBash(); await advance(); await advance(); const due = boundary();
    const corrected = profile.makeStunnedRecord(pc, record.recordId, { sourceActor: foe, sourceOccurrence: record.sourceEntityId, timing: 'manual' });
    assert.equal((await ack(gm, 'actor_consequence', edit(pc, 'update', corrected))).success, true);
    assert.equal((await ack(gm, 'actor_turn_boundary', due)).code, 'stale_turn_state'); assert.deepEqual(token(pc).state.conditions, [corrected]);
    await advance(); assert.deepEqual(token(pc).state.conditions, [corrected]); assert.equal(timing.scheduleFor(corrected, room.gameState.combat), null);
  });
  it('member/cooperative request cannot certify boundary; stale roster/incarnation/cursor refuse and reset retires timing without removal', async() => {
    const c = boundary('adopt'); assert.equal((await ack(owner, 'actor_turn_boundary', c)).code, 'turn_gm_required'); await adopt();
    const record = await add(profile.makeDefendingRecord(pc, uuid())), original = actors.clone(room.gameState.combat);
    const rejected = once(owner, 'combat_turn_rejected'); owner.emit('combat_turn_changed', { roomId: room.id, currentTurnIndex: 1, round: 99 }); assert.equal((await rejected).reason, 'authenticated_boundary_required'); assert.deepEqual(room.gameState.combat, original);
    const stale = boundary(); stale.expectedClock.sequence += 1; assert.equal((await ack(gm, 'actor_turn_boundary', stale)).code, 'stale_turn_occurrence');
    const changed = boundary(); room.gameState.combat.turnOrder.reverse(); assert.equal((await ack(gm, 'actor_turn_boundary', changed)).code, 'stale_turn_state'); room.gameState.combat = original;
    const savedFoe = token(foe); savedFoe.state.actorContract.instanceId = uuid(); assert.equal((await ack(gm, 'actor_turn_boundary', boundary())).code, 'actor_binding_conflict'); savedFoe.state.actorContract.instanceId = foe.instanceId;
    assert.equal((await ack(gm, 'combat_ended', { roomId: room.id })).success, true); assert.deepEqual(token(pc).state.conditions, [record]); assert.equal(timing.scheduleFor(record, room.gameState.combat), null);
  });
  it('rechecks after authority await; permanent writer admission failure cannot partially advance or expire', async() => {
    await adopt(); const record = await add(profile.makeDefendingRecord(pc, uuid())); await advance(); const due = boundary();
    const originalAssert = server.authorityService.assertCurrent; let release, reached, hold = true;
    const gate = new Promise(r => { release = r; }), entered = new Promise(r => { reached = r; });
    server.authorityService.assertCurrent = async(...args) => { if (hold) { hold = false; reached(); await gate; } return originalAssert(...args); };
    const pending = ack(gm, 'actor_turn_boundary', due); await entered; room.gameState.combat.round += 1; release();
    assert.equal((await pending).code, 'stale_turn_state'); assert.deepEqual(token(pc).state.conditions, [record]); server.authorityService.assertCurrent = originalAssert;
    room.gameState.combat.round -= 1;
    // Force the actual permanent-room writer owner to reject this one admission.
    const writer = server.firebaseBatchWriter, admit = writer.admitConsequence; room.isPermanent = true; room.persistentRoomId = 'permanent-c4';
    writer.admitConsequence = () => ({ queued: false, code: 'c4_admission_refused' }); const before = actors.clone(room.gameState);
    assert.equal((await ack(gm, 'actor_turn_boundary', boundary())).code, 'c4_admission_refused'); assert.deepEqual(room.gameState, before);
    writer.admitConsequence = admit; room.isPermanent = false; delete room.persistentRoomId;
    await advance(); assert.equal(token(pc).state.conditions.length, 0);
  });
  it('checkpoint/new runtime keeps exact anchors and receipt; import strips authority; old unknown request never replays', async() => {
    await adopt(); const record = await add(profile.makeDefendingRecord(pc, uuid())), { c, result } = await advance();
    const codec = require('../services/roomCheckpoint'), built = codec.buildCheckpointDocuments({ roomId: room.id, gameState: room.gameState, revision: 1 });
    const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])) }); assert.equal(decoded.ok, true);
    room = { ...room, gameState: { ...decoded.global, maps: decoded.maps, ...codec.deriveRootMirrors(decoded.maps) }, checkpointRevision: 1 }; server.rooms.set(room.id, room);
    assert.equal(timing.scheduleFor(record, room.gameState.combat).dueSequence, 2); assert.deepEqual((await ack(gm, 'actor_turn_boundary', c)).receipt, result.receipt);
    const old = actors.clone(c); old.commandId = uuid(); assert.equal((await ack(gm, 'actor_turn_boundary', old)).code, 'outcome_unknown');
    const imported = actors.clone(room.gameState); actors.preserveImportedActorMetadata(imported); assert.equal(imported.combat.effectLifecycle, undefined); assert.ok(imported.actorConsequenceRecovery.importedEffectLifecycle);
    await advance(); assert.equal(token(pc).state.conditions.length, 0);
  });
  it('automatic per-boundary capacity respects P7 atomic limits; excess independent effects remain visible/manual without blocking combat', async() => {
    room.isPermanent = true; room.persistentRoomId = room.id;
    await adopt(); await server.firebaseBatchWriter.flush(); const records = [];
    for (let i = 0; i < 33; i += 1) { records.push(await addBash()); if (i % 4 === 0) await server.firebaseBatchWriter.flush(); }
    assert.equal(Object.keys(room.gameState.combat.effectLifecycle.schedules).length, 32);
    assert.equal(timing.scheduleFor(records[32], room.gameState.combat), null); assert.match(profile.expiryLabel(records[32], room.gameState.combat), /GM removes/);
    await advance(); await advance(); const result = await advance();
    assert.equal(result.result.receipt.actors[0].conditions.length, 1); assert.deepEqual(token(pc).state.conditions, [records[32]]);
    assert.equal(room.gameState.combat.effectLifecycle.sequence, 3); assert.throws(() => actors.assertCanAct(room, pc), /Stunned/);
  });
});
