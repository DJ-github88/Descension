const assert = require('assert/strict');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const actors = require('../services/actorConsequences');
const profile = require('../../vtt-react/src/services/sharedConditionProfile');
const bash = require('../../vtt-react/src/services/shieldBashResult');
const uuid = () => crypto.randomUUID();
const ack = (s, e, d) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error(e)), 5000); s.emit(e, d, r => { clearTimeout(t); resolve(r); }); });
const once = (s, e) => new Promise(resolve => s.once(e, resolve));

describe('P14-C3 Shield Bash manual result registered production path', function() {
  this.timeout(15000);
  let server, room, gm, owner, other, pc, foe, gmUid, ownerUid;
  beforeEach(async() => {
    server = createProductionStackServer(); await server.start();
    for (const e of ['actor_bind', 'actor_consequence', 'actor_snapshot', 'actor_propose', 'actor_adjudicate']) server.setEventLimits(e, { maxPerMinute: 2000, maxPerSecond: 2000 });
    gmUid = server.nextUserId('gm'); ownerUid = server.nextUserId('owner');
    server.registerAuthToken('gm', gmUid); server.registerAuthToken('owner', ownerUid); server.registerAuthToken('other', server.nextUserId('other'));
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: gmUid });
    for (const role of ['owner', 'other']) { const s = server.connect({ token: role }); await once(s, 'connect'); const joined = once(s, 'room_joined'); s.emit('join_room', { roomId: room.id, playerName: role, password: '' }); await joined; if (role === 'owner') owner = s; else other = s; }
    server.setCharacterOwner('c', ownerUid);
    const map = room.gameState.maps.default;
    map.tokens.foe = { id: 'foe', position: { x: 75, y: 25 }, stats: { maxHp: 30, maxMana: 0, maxAP: 4 }, state: { currentHp: 30, currentMana: 0, currentActionPoints: 4, conditions: [] } };
    map.characterTokens.pc = { id: 'pc', ownerUserId: ownerUid, position: { x: 25, y: 25 }, character: { id: 'c', health: { current: 30, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 },
      classResource: { type: 'untouched-manual-bank', current: 7 }, inventory: ['untouched'], equipment: { chest: { id: 'hide', durability: 'd8' } } }, state: { conditions: [] } };
    pc = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'c' }, snapshotHash: actors.hash(map.characterTokens.pc) })).ref;
    foe = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'foe' }, snapshotHash: actors.hash(map.tokens.foe) })).ref;
    assert.ok(pc && foe);
  });
  afterEach(async() => { gm.disconnect(); owner.disconnect(); other.disconnect(); await server.stop(); });
  const token = ref => actors.locate(server.rooms.get(room.id), ref).token;
  const base = commandId => ({ version: 1, roomId: room.id, commandId: commandId || uuid(), actionEpoch: actors.epoch(server.rooms.get(room.id)), baseCommitSequence: actors.ledger(server.rooms.get(room.id)).commitSequence });
  const command = (source = foe, target = pc, id = uuid()) => ({ ...base(id), target,
    actors: [{ ref: target, expectedRevision: token(target).state.actorContract.revision, conditions: [{ op: 'add', recordId: id, record: bash.makeRecord(source, target, id) }] }],
    adjudication: { definitionId: profile.STUNNED.definitionId, definitionVersionOrHash: profile.STUNNED.origin,
      chosenResult: JSON.stringify({ manualResult: bash.metadata(source, target, id) }), adjustmentReason: bash.BOUNDARY } });
  const remove = (ref, id) => ({ ...base(), actors: [{ ref, expectedRevision: token(ref).state.actorContract.revision, conditions: [{ op: 'remove', recordId: id }] }] });

  it('pins original source; installs only canonical Stunned with exact attribution/timing, retries once and preserves all resource/equipment/inventory bytes', async() => {
    const fileBuffer = fs.readFileSync(path.join(__dirname, '../../vtt-react/src/data/universalCombatSpells.js'));
    const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    const lfHash = crypto.createHash('sha256').update(fileBuffer.toString('utf8').replace(/\r\n/g, '\n')).digest('hex');
    assert.ok(
      fileHash === bash.SOURCE_HASH || lfHash === '40e09c77be9186137ef6f99baf8e626329b6938b8b29e5a55929a8a7041724e6',
      `universalCombatSpells.js hash mismatch: ${fileHash}`
    );
    const c = command(), originalPC = actors.clone(token(pc).character), originalFoe = actors.clone(token(foe));
    const accepted = await ack(gm, 'actor_consequence', c); assert.equal(accepted.success, true, JSON.stringify(accepted));
    assert.deepEqual(token(pc).character, originalPC); assert.deepEqual(token(foe), originalFoe);
    const record = token(pc).state.conditions[0]; assert.equal(record.recordId, c.commandId); assert.equal(record.clockBoundary, bash.TIMING);
    assert.deepEqual(record.sourceActor, foe); assert.deepEqual(record.target, pc); assert.equal(record.sourceEntityId, bash.PREFIX + c.commandId);
    assert.equal(profile.holdsStunned(token(pc)), true); assert.throws(() => actors.assertCanAct(room, pc), /Stunned/);
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, accepted.receipt); assert.equal(token(pc).state.conditions.length, 1);
    assert.equal((await ack(gm, 'actor_consequence', remove(pc, record.recordId))).success, true);
    assert.equal(profile.holdsStunned(token(pc)), false);
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, accepted.receipt); assert.equal(token(pc).state.conditions.length, 0, 'historical result never reapplies');
  });
  it('independent critical/later Bash episodes coexist and exact removal leaves restrictions until last source removed; PC→creature also supported', async() => {
    const id = uuid(), critical = profile.makeStunnedRecord(pc, id, { sourceActor: foe, sourceOccurrence: 'critical-1', timing: 'critical-one-round' });
    assert.equal((await ack(gm, 'actor_consequence', { ...base(), actors: [{ ref: pc, expectedRevision: token(pc).state.actorContract.revision, conditions: [{ op: 'add', recordId: id, record: critical }] }],
      adjudication: { definitionId: profile.STUNNED.definitionId, definitionVersionOrHash: profile.STUNNED.origin, chosenResult: 'Manual critical' } })).success, true);
    const first = command(); assert.equal((await ack(gm, 'actor_consequence', first)).success, true);
    const second = command(); assert.equal((await ack(gm, 'actor_consequence', second)).success, true); assert.equal(token(pc).state.conditions.length, 3);
    assert.equal((await ack(gm, 'actor_consequence', remove(pc, first.commandId))).success, true); assert.equal(profile.holdsStunned(token(pc)), true);
    assert.equal((await ack(gm, 'actor_consequence', remove(pc, second.commandId))).success, true); assert.deepEqual(token(pc).state.conditions, [critical]);
    assert.equal((await ack(gm, 'actor_consequence', remove(pc, id))).success, true); assert.doesNotThrow(() => actors.assertCanAct(room, pc));
    assert.equal((await ack(gm, 'actor_consequence', command(pc, foe))).success, true); assert.equal(profile.holdsStunned(token(foe)), true);
  });
  it('current GM direct only; invalid IDs/timing/source binding and any mixed operations refuse atomically', async() => {
    const c = command();
    for (const s of [owner, other]) assert.equal((await ack(s, 'actor_consequence', c)).code, 'shield_bash_gm_required');
    for (const change of [value => { value.commandId = uuid(); }, value => { value.actors[0].recordId = uuid(); },
      value => { value.actors[0].conditions[0].record.clockBoundary = 'critical-one-round'; },
      value => { value.actors[0].finalResources = { ap: { current: 0, temp: 0 } }; },
      value => { value.adjudication.chosenResult = '{}'; }]) {
      const bad = actors.clone(c); change(bad); assert.equal((await ack(gm, 'actor_consequence', bad)).success, false);
    }
    const before = actors.clone(room.gameState);
    assert.throws(() => actors.stage(room, { isGM: true }, ownerUid, c, { kind: 'controller-proposal-gm', authorizerUid: gmUid }, 0), /shield_bash_gm_required/);
    assert.deepEqual(room.gameState, before);
    const staleSource = command(); token(foe).state.actorContract.instanceId = uuid();
    assert.equal((await ack(gm, 'actor_consequence', staleSource)).code, 'actor_binding_conflict');
    assert.equal(token(pc).state.conditions.length, 0);
  });
  it('deleted/recreated targets refuse; checkpoint/new runtime preserves canonical timing and known receipt recovery without replay', async() => {
    const c = command(), target = room.gameState.maps.default.characterTokens.pc;
    delete room.gameState.maps.default.characterTokens.pc; assert.equal((await ack(gm, 'actor_consequence', c)).code, 'actor_not_found');
    room.gameState.maps.default.characterTokens.pc = actors.clone(target); room.gameState.maps.default.characterTokens.pc.state.actorContract.instanceId = uuid();
    assert.equal((await ack(gm, 'actor_consequence', c)).code, 'actor_binding_conflict'); room.gameState.maps.default.characterTokens.pc = target;
    const accepted = await ack(gm, 'actor_consequence', c); assert.equal(accepted.success, true);
    const codec = require('../services/roomCheckpoint'), built = codec.buildCheckpointDocuments({ roomId: room.id, gameState: room.gameState, revision: 1 });
    const restored = codec.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])) }); assert.equal(restored.ok, true);
    room = { ...room, gameState: { ...restored.global, maps: restored.maps, ...codec.deriveRootMirrors(restored.maps) }, checkpointRevision: 1 }; server.rooms.set(room.id, room);
    assert.equal(token(pc).state.conditions[0].clockBoundary, bash.TIMING);
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, accepted.receipt);
    assert.equal(token(pc).state.conditions.length, 1);
  });
  it('source deleted while authoritative installation awaits refuses with no partial target/resource change', async() => {
    const c = command(), before = actors.clone(token(pc)), original = server.authorityService.assertCurrent;
    let release, entered, hold = true;
    const gate = new Promise(resolve => { release = resolve; }), reached = new Promise(resolve => { entered = resolve; });
    server.authorityService.assertCurrent = async(...args) => { if (hold) { hold = false; entered(); await gate; } return original(...args); };
    const pending = ack(gm, 'actor_consequence', c); await reached;
    delete room.gameState.maps.default.tokens.foe; release();
    assert.equal((await pending).code, 'actor_not_found'); assert.deepEqual(token(pc), before);
    assert.equal(actors.ledger(room).receipts.length, 0); server.authorityService.assertCurrent = original;
  });
  it('cannot introduce named Shield Bash through generic-record update; an accepted exact instance still permits ordinary timing correction/removal', async() => {
    const id = uuid(), marker = profile.makeStunnedRecord(pc, id, { sourceOccurrence: 'generic-manual-marker' }); delete marker.effectOrigin;
    const change = (op, record) => ({ ...base(), actors: [{ ref: pc, expectedRevision: token(pc).state.actorContract.revision,
      conditions: [{ op, recordId: id, ...(record ? { record } : {}) }] }] });
    assert.equal((await ack(owner, 'actor_consequence', change('add', marker))).success, true);
    const bad = change('update', bash.makeRecord(foe, pc, id));
    bad.adjudication = { definitionId: profile.STUNNED.definitionId, definitionVersionOrHash: profile.STUNNED.origin, chosenResult: '{}' };
    const before = actors.clone(room.gameState);
    for (const s of [owner, gm]) assert.equal((await ack(s, 'actor_consequence', bad)).code, 'invalid_shield_bash_result');
    assert.deepEqual(room.gameState, before); assert.equal(profile.holdsStunned(token(pc)), false);
    assert.equal((await ack(owner, 'actor_consequence', change('remove'))).success, true);
    const c = command(); assert.equal((await ack(gm, 'actor_consequence', c)).success, true);
    const corrected = profile.makeStunnedRecord(pc, c.commandId, { sourceActor: foe, sourceOccurrence: bash.PREFIX + c.commandId, timing: 'manual' });
    const update = { ...base(), target: pc, actors: [{ ref: pc, expectedRevision: token(pc).state.actorContract.revision, conditions: [{ op: 'update', recordId: c.commandId, record: corrected }] }],
      adjudication: { definitionId: profile.STUNNED.definitionId, definitionVersionOrHash: profile.STUNNED.origin, chosenResult: 'Explicit GM duration correction' } };
    assert.equal((await ack(gm, 'actor_consequence', update)).success, true); assert.equal(token(pc).state.conditions[0].clockBoundary, 'manual');
    assert.equal((await ack(owner, 'actor_consequence', remove(pc, c.commandId))).success, true);
  });
});
