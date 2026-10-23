const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const installed = require('../services/installedAuthoredAbilities');
const payments = require('../services/spellPayments');
const pure = require('../../vtt-react/src/services/authoredAbility');
const profile = require('../../vtt-react/src/services/sharedConditionProfile');
const once = (s, e) => new Promise(r => s.once(e, r));
const ack = (s, e, d) => new Promise((resolve, reject) => { const timer = setTimeout(() => reject(Error(e)), 5000); s.emit(e, d, r => { clearTimeout(timer); resolve(r); }); });
function record(ap = 2, mana = 3, restriction = 'self', range = 0) {
  const draft = { name: 'Disposable self mend', description: 'A6 test only', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: ['healing'],
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: range, maxTargets: 1, targetRestrictions: [restriction] },
    resourceCost: { actionPoints: ap, mana }, healingConfig: { healingType: 'direct', formula: '1d8+1', resolution: 'DICE' } };
  return { ...actors.clone(draft), authoredDraft: draft, authoredDefinitionId: uuid() };
}
describe('P14-A6 exact self healing — registered production handlers', function() {
  this.timeout(15000);
  let server, room, gm, observer, source, sibling, writer, uid;
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer }); await server.start();
    for (const e of ['actor_bind', 'actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_revoke', 'actor_spell_prepare_creature']) server.setEventLimits(e, { maxPerMinute: 2000, maxPerSecond: 2000 });
    uid = server.nextUserId(); server.registerAuthToken('gm', uid); server.registerAuthToken('observer', server.nextUserId());
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: uid });
    observer = server.connect({ token: 'observer' }); await once(observer, 'connect'); const joined = once(observer, 'room_joined'); observer.emit('join_room', { roomId: room.id, playerName: 'observer', password: '' }); await joined;
    const template = { name: 'Self witness', creatureId: 'same-template', stats: { maxHp: 10, maxMana: 10, maxAP: 4 }, authoredAbility: { schemaVersion: 1, record: record(), librarySpellId: null },
      state: { currentHp: 8, currentMana: 10, currentActionPoints: 4, tempHealth: 2, tempMana: 2, tempActionPoints: 1, conditions: [] } };
    for (const id of ['source', 'sibling']) {
      room.gameState.maps.default.tokens[id] = { ...actors.clone(template), id };
      const r = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: id }, snapshotHash: actors.hash(room.gameState.maps.default.tokens[id]) });
      assert.equal(r.success, true); if (id === 'source') source = r.ref; else sibling = r.ref;
    }
  });
  afterEach(async() => { gm.disconnect(); observer.disconnect(); await server.stop(); });
  const token = () => actors.locate(room, source).token;
  async function admit() {
    const r = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(room).revision,
      source, expectedSourceRevision: token().state.actorContract.revision, definitionVersion: 1 }); assert.equal(r.success, true, JSON.stringify(r));
  }
  function attempt(mode = 'physical') {
    const grant = token().state.actorContract.authoredAdmission, entry = installed.lookup(room, { definitionId: pure.actionId(grant.definitionRef) });
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, source, target: source,
      sourceAuthority: { admissionId: grant.requestId, associationHash: grant.associationHash, gmUid: grant.gmUid },
      spell: { definitionId: pure.actionId(entry.definitionRef), definitionHash: `${pure.CAPABILITY}/${entry.definitionRef.definitionHash}`, name: entry.canonicalDefinition.name, kind: 'healing', damageTypes: [] },
      price: entry.descriptor.price, classPayment: null, roll: { mode, dice: [{ sides: 8, faces: [4] }], constant: 1, total: 5, reading: '1d8+1' } };
  }
  async function prepare(a) { const before = actors.clone(room.gameState), r = await ack(gm, 'actor_spell_prepare_creature', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); assert.deepEqual(room.gameState, before); }
  function command(a, amount = 5) {
    const pools = actors.resources(token(), 'creature'), finals = { hp: { current: Math.min(pools.hp.max, pools.hp.current + amount), temp: pools.hp.temp } };
    for (const p of ['ap', 'mana']) if (a.price[p]) finals[p] = payments.tempFirst(pools[p].current, pools[p].temp, a.price[p]);
    return { version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, source, target: source,
      approval: { approvalId: a.approvalId, contentHash: actors.hash(a) }, actors: [{ ref: source, expectedRevision: token().state.actorContract.revision, finalResources: finals }],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, finalAmount: amount, adjustmentReason: amount === 5 ? '' : 'GM confirmed adjustment',
        chosenResult: JSON.stringify({ capability: pure.CAPABILITY, approvalId: a.approvalId, kind: 'healing', roll: a.roll, actualHealing: finals.hp.current - pools.hp.current, gmConfirmed: true }) } };
  }
  async function refused(event, data, code, socket = gm) { const before = actors.clone(room.gameState), r = await ack(socket, event, data); assert.equal(r.success, false, JSON.stringify(r)); if (code) assert.equal(r.code, code); assert.deepEqual(room.gameState, before); return r; }
  it('paid capped healing combines temp-first AP/mana and HP in one revision/projection/receipt; sibling unchanged', async() => {
    await admit(); const a = attempt(), before = actors.clone(token().state), sib = actors.clone(actors.locate(room, sibling).token); await prepare(a);
    const r = await ack(gm, 'actor_consequence', command(a)); assert.equal(r.success, true, JSON.stringify(r));
    assert.equal(r.receipt.actors.length, 1); assert.equal(r.receipt.actors[0].afterRevision, before.actorContract.revision + 1);
    assert.deepEqual(actors.resources(token(), 'creature'), { hp: { current: 10, temp: 2, max: 10 }, mana: { current: 9, temp: 0, max: 10 }, ap: { current: 3, temp: 0, max: 4 } });
    assert.equal(JSON.parse(r.receipt.adjudication.chosenResult).actualHealing, 2); assert.equal(r.receipt.adjudication.finalAmount, 5);
    assert.deepEqual(actors.locate(room, sibling).token, sib); assert.equal(Object.values(r.actorSnapshot.maps.default.tokens).filter(e => e.id === source.tokenId).length, 1);
    assert.equal(room.gameState.tokens.source.state.currentHp, 10); assert.equal(room.gameState.tokens.source.state.currentMana, 9);
  });
  it('admission publishes one public lifecycle revision to observers, without source drafts/grants or result feedback', async() => {
    const expected = token().state.actorContract.revision + 1;
    const received = new Promise(resolve => { const listener = event => { if (event.actorSnapshot?.maps.default.tokens.source?.state.actorContract.revision === expected) { observer.off('actor_bound', listener); resolve(event); } }; observer.on('actor_bound', listener); });
    await admit(); const event = await received;
    const projection = event.actorSnapshot.maps.default.tokens.source;
    assert.equal(projection.state.actorContract.revision, token().state.actorContract.revision);
    assert.equal(projection.authoredAbility, undefined); assert.equal(projection.state.actorContract.authoredAdmission, undefined);
    assert.equal(event.receipt, undefined); assert.equal(actors.ledger(room).receipts.length, 0);
  });
  it('zero AP/mana and explicit range0 any remain zero, absent unused mana stays absent, digital faces retained', async() => {
    token().authoredAbility.record = record(0, 0, 'any', 0); await admit(); delete token().state.currentMana;
    const a = attempt('digital'); await prepare(a); const r = await ack(gm, 'actor_consequence', command(a)); assert.equal(r.success, true, JSON.stringify(r));
    assert.equal(token().state.currentActionPoints, 4); assert.equal(token().state.tempActionPoints, 1); assert.equal(token().state.currentMana, undefined); assert.deepEqual(JSON.parse(r.receipt.adjudication.chosenResult).roll, a.roll);
  });
  it('full-HP/approved0 still pays existing accepted-action price without changing HP or tempHP', async() => {
    await admit(); token().state.currentHp = 10; const a = attempt(); await prepare(a); assert.equal((await ack(gm, 'actor_consequence', command(a, 0))).success, true); assert.equal(token().state.currentHp, 10); assert.equal(token().state.currentMana, 9);
  });
  it('existing direct restoration at HP0 has no invented revival gate or temporary HP gain', async() => {
    await admit(); token().state.currentHp = 0; const a = attempt(); await prepare(a); assert.equal((await ack(gm, 'actor_consequence', command(a))).success, true); assert.equal(token().state.currentHp, 5); assert.equal(token().state.tempHealth, 2);
  });
  for (const restriction of ['enemy', 'ally']) it(`${restriction} is not silently self-compatible`, async() => {
    token().authoredAbility.record = record(1, 0, restriction, 30); await admit(); await refused('actor_spell_prepare_creature', attempt(), 'unsupported_creature_target');
  });
  it('incompatible per-effect target profile and mixed effects refuse without partial execution', async() => {
    const r = record(); r.healingConfig.targetType = r.authoredDraft.healingConfig.targetType = 'ally'; token().authoredAbility.record = r; await admit(); await refused('actor_spell_prepare_creature', attempt(), 'unsupported_creature_target');
    token().authoredAbility.record.authoredDraft.effectTypes.push('buff'); const res = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(room).revision, source, expectedSourceRevision: token().state.actorContract.revision, definitionVersion: 2 }); assert.equal(res.code, 'unsupported_wizard_record');
  });
  it('same-template sibling cannot substitute for Self or reuse source admission', async() => {
    await admit(); const a = attempt(); await refused('actor_spell_prepare_creature', { ...a, target: sibling }, 'distinct_target_range_required'); await refused('actor_spell_prepare_creature', { ...a, source: sibling, target: sibling }, 'creature_admission_changed');
  });
  it('missing/insufficient pools refuse and never create payable resources', async() => {
    await admit(); const a = attempt(); token().state.currentMana = 0; token().state.tempMana = 0; await refused('actor_spell_prepare_creature', a, 'insufficient_resources');
    delete token().state.currentMana; await refused('actor_spell_prepare_creature', a, 'invalid_resources'); token().state.currentMana = 10; delete token().state.currentActionPoints; await refused('actor_spell_prepare_creature', a, 'invalid_resources');
  });
  it('HP, bounds, resources, conditions and revision changes require explicit same-face validation', async() => {
    await admit(); const a = attempt(); await prepare(a);
    for (const change of [() => token().state.currentHp--, () => token().state.maxHp++, () => token().state.maxMana++, () => token().state.maxAP++, () => token().state.tempMana++, () => token().state.actorContract.revision++, () => token().state.conditions.push({ name: 'Manual marker' })]) {
      change(); const c = command(a); await refused('actor_consequence', c, 'creature_revalidation_required'); await prepare(a);
    }
    const stale = command(a); token().state.actorContract.revision++; await refused('actor_consequence', stale, 'creature_revalidation_required'); await prepare(a);
    assert.equal((await ack(gm, 'actor_consequence', command(a))).success, true);
  });
  it('source deletion/recreation, admission mismatch/readmission and revocation refuse', async() => {
    await admit(); const a = attempt(); await prepare(a); const c = command(a), original = actors.clone(token());
    delete room.gameState.maps.default.tokens.source; await refused('actor_consequence', c, 'actor_not_found'); room.gameState.maps.default.tokens.source = original;
    const currentToken = token(); currentToken.state.actorContract.instanceId = uuid(); await refused('actor_consequence', c, 'actor_binding_conflict'); currentToken.state.actorContract.instanceId = source.instanceId;
    await refused('actor_spell_prepare_creature', { ...a, approvalId: uuid(), sourceAuthority: { ...a.sourceAuthority, associationHash: 'a'.repeat(64) } }, 'creature_admission_changed');
    await admit(); await refused('actor_consequence', c, 'creature_admission_changed');
    assert.equal((await ack(gm, 'actor_spell_withdraw', { roomId: room.id, approvalId: a.approvalId, approval: a })).success, true);
    const b = attempt(); await prepare(b); const d = command(b);
    token().authoredAbility.record.name = 'changed'; await refused('actor_consequence', d, 'creature_admission_changed'); token().authoredAbility.record.name = original.authoredAbility.record.name;
    const ref = token().state.actorContract.authoredAdmission.definitionRef; assert.equal((await ack(gm, 'actor_authored_revoke', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(room).revision, definitionRef: ref })).success, true); await refused('actor_consequence', d, 'definition_revoked');
  });
  it('non-GM and replaced GM cannot prepare or install', async() => {
    await admit(); const a = attempt(); await refused('actor_spell_prepare_creature', a, 'forbidden', observer); await prepare(a); const c = command(a); await refused('actor_consequence', c, undefined, observer);
    const old = room.gm.socketId; room.gm.socketId = observer.id; await refused('actor_consequence', c); room.gm.socketId = old;
  });
  async function during(event, data, change, code) {
    const original = server.authorityService.assertCurrent; let enter, release;
    const entered = new Promise(r => { enter = r; }), gate = new Promise(r => { release = r; });
    server.authorityService.assertCurrent = async(...args) => { if (new Error().stack.includes('actorConsequenceHandlers.js')) { enter(); await gate; } return original(...args); };
    const pending = ack(gm, event, data); await entered; change(); const before = actors.clone(room.gameState); release(); const r = await pending; server.authorityService.assertCurrent = original;
    assert.equal(r.code, code, JSON.stringify(r)); assert.deepEqual(room.gameState, before);
  }
  it('Stunned before submission and across preparation/install awaits refuses; removal keeps faces', async() => {
    await admit(); const a = attempt(), stunned = profile.makeStunnedRecord(source, uuid(), { sourceOccurrence: 'a6', timing: 'manual' });
    token().state.conditions.push(stunned); await refused('actor_spell_prepare_creature', a, 'actor_stunned'); token().state.conditions = [];
    await during('actor_spell_prepare_creature', a, () => token().state.conditions.push(stunned), 'actor_stunned'); assert.equal(payments.get(room, a.approvalId), null); token().state.conditions = []; await prepare(a);
    await during('actor_consequence', command(a), () => token().state.conditions.push(stunned), 'actor_stunned'); token().state.conditions = []; token().state.actorContract.revision++; await prepare(a);
    const r = await ack(gm, 'actor_consequence', command(a)); assert.equal(r.success, true); assert.deepEqual(JSON.parse(r.receipt.adjudication.chosenResult).roll, a.roll);
  });
  it('HP/bounds changes during preparation await require a fresh explicit validation', async() => {
    await admit(); const a = attempt(); await during('actor_spell_prepare_creature', a, () => token().state.maxHp++, 'creature_revalidation_required'); assert.equal(payments.get(room, a.approvalId), null); await prepare(a);
  });
  it('writer refusal installs neither payment nor HP and retains attempt', async() => {
    await admit(); const a = attempt(); await prepare(a); const c = command(a); room.isPermanent = true; writer.admitConsequence = () => ({ queued: false, code: 'test_writer_refusal' }); await refused('actor_consequence', c, 'test_writer_refusal'); assert.ok(payments.get(room, a.approvalId));
  });
  it('duplicate/lost ACK recovers original one-actor receipt; conflicts or two actor projections refuse', async() => {
    await admit(); const a = attempt(); await prepare(a); const c = command(a), two = actors.clone(c); two.actors.push(actors.clone(two.actors[0])); await refused('actor_consequence', two);
    const bad = actors.clone(c), chosen = JSON.parse(bad.adjudication.chosenResult); chosen.actualHealing = 5; bad.adjudication.chosenResult = JSON.stringify(chosen); await refused('actor_consequence', bad, 'approval_mismatch');
    gm.emit('actor_consequence', c); await new Promise(r => setTimeout(r, 100)); const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true); const before = actors.clone(room.gameState);
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, r.receipt); assert.deepEqual(room.gameState, before); assert.equal(actors.ledger(room).receipts.length, 1);
    await refused('actor_consequence', { ...c, adjudication: { ...c.adjudication, finalAmount: 4 } }, 'command_id_conflict'); await refused('actor_spell_prepare_creature', { ...a, roll: { ...a.roll, mode: 'digital' } }, 'command_id_conflict');
  });
  it('checkpoint reconstructs combined state/original receipt, new epoch blocks unknown attempts', async() => {
    await admit(); const a = attempt(); await prepare(a); const c = command(a), accepted = await ack(gm, 'actor_consequence', c); assert.equal(accepted.success, true);
    const codec = require('../services/roomCheckpoint'), built = codec.buildCheckpointDocuments({ roomId: room.id, gameState: room.gameState, revision: 1 });
    const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])) }); assert.equal(decoded.ok, true);
    room = { ...room, gameState: { ...decoded.global, maps: decoded.maps, ...codec.deriveRootMirrors(decoded.maps) }, checkpointRevision: 1 }; server.rooms.set(room.id, room);
    assert.notEqual(actors.epoch(room), a.actionEpoch); assert.equal(token().state.currentHp, 10); assert.equal(token().state.currentMana, 9); assert.equal(token().state.currentActionPoints, 3);
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, accepted.receipt); await refused('actor_spell_prepare_creature', { ...a, approvalId: uuid() }, 'outcome_unknown');
  });
});
