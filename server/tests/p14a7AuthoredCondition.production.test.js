const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const installed = require('../services/installedAuthoredAbilities');
const definitions = require('../services/installedDefinitionRegistry');
const payments = require('../services/spellPayments');
const pure = require('../../vtt-react/src/services/authoredAbility');
const condition = require('../../vtt-react/src/services/authoredCondition');
const profile = require('../../vtt-react/src/services/sharedConditionProfile');
const once = (s, e) => new Promise(r => s.once(e, r));
const ack = (s, e, d) => new Promise((resolve, reject) => { const timer = setTimeout(() => reject(Error(e)), 5000); s.emit(e, d, r => { clearTimeout(timer); resolve(r); }); });
function record(name = 'Disposable Still Bell', ap = 2, mana = 3) {
  const draft = { name, description: 'A7 disposable test', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: ['control'],
    controlConfig: { authoredCondition: { profile: pure.CONDITION_CAPABILITY, conditionKey: 'stunned', expiryPolicy: 'gm-manual', durationText: 'Until the bell falls silent', gmNote: 'GM resolves the authored save and eligibility.' } },
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: ap, mana } };
  return { ...actors.clone(draft), authoredDraft: draft, authoredDefinitionId: uuid() };
}
describe('P14-A7 canonical authored Stunned — registered production handlers', function() {
  this.timeout(15000);
  let server, room, gm, observer, source, target, writer, uid;
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer }); await server.start();
    for (const e of ['actor_bind', 'actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_revoke', 'actor_spell_prepare_creature']) server.setEventLimits(e, { maxPerMinute: 2000, maxPerSecond: 2000 });
    uid = server.nextUserId(); server.registerAuthToken('gm', uid); server.registerAuthToken('observer', server.nextUserId());
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: uid });
    observer = server.connect({ token: 'observer' }); await once(observer, 'connect'); const joined = once(observer, 'room_joined'); observer.emit('join_room', { roomId: room.id, playerName: 'observer', password: '' }); await joined;
    for (const id of ['source', 'target']) {
      const t = { id, name: id, creatureId: 'disposable', stats: { maxHp: 10, maxMana: 20, maxAP: 10 }, authoredAbility: { schemaVersion: 1, record: record(), librarySpellId: null }, state: { currentHp: 10, currentMana: 20, currentActionPoints: 10, tempHealth: 0, tempMana: 2, tempActionPoints: 1, conditions: [] } };
      room.gameState.maps.default.tokens[id] = t;
      const r = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: id }, snapshotHash: actors.hash(t) });
      assert.equal(r.success, true); if (id === 'source') source = r.ref; else target = r.ref;
    }
  });
  afterEach(async() => { gm.disconnect(); observer.disconnect(); await server.stop(); });
  const token = ref => actors.locate(room, ref || source).token;
  async function admit(ref = source, version = 1) {
    const r = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(room).revision,
      source: ref, expectedSourceRevision: token(ref).state.actorContract.revision, definitionVersion: version }); assert.equal(r.success, true, JSON.stringify(r)); return r;
  }
  function attempt(s = source, t = target) {
    const grant = token(s).state.actorContract.authoredAdmission, entry = installed.lookup(room, { definitionId: pure.actionId(grant.definitionRef) });
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, source: s, target: t,
      sourceAuthority: { admissionId: grant.requestId, associationHash: grant.associationHash, gmUid: grant.gmUid },
      spell: { definitionId: pure.actionId(entry.definitionRef), definitionHash: `${pure.CONDITION_CAPABILITY}/${entry.definitionRef.definitionHash}`, name: entry.canonicalDefinition.name, kind: 'condition', damageTypes: [] },
      price: entry.descriptor.price, classPayment: null, roll: null, resolution: { gmConfirmed: true, timing: entry.canonicalDefinition.timing, timingNote: 'GM will remove on the declared bell boundary', evidence: 'Physical save failed; table ruling, not software verified' } };
  }
  async function prepare(a) { const before = actors.clone(room.gameState), r = await ack(gm, 'actor_spell_prepare_creature', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); assert.deepEqual(room.gameState, before); }
  function command(a) {
    const pools = actors.resources(token(a.source), 'creature'), payment = {};
    for (const p of ['ap', 'mana']) if (a.price[p]) payment[p] = payments.tempFirst(pools[p].current, pools[p].temp, a.price[p]);
    if (!Object.keys(payment).length) payment.ap = payments.tempFirst(pools.ap.current, pools.ap.temp, 0);
    return { version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, source: a.source, target: a.target,
      approval: { approvalId: a.approvalId, contentHash: actors.hash(a) }, actors: [{ ref: a.source, expectedRevision: token(a.source).state.actorContract.revision, finalResources: payment },
        { ref: a.target, expectedRevision: token(a.target).state.actorContract.revision, conditions: [{ op: 'add', recordId: a.approvalId, record: condition.recordFor(a) }] }],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, finalAmount: 0, adjustmentReason: '', chosenResult: JSON.stringify(condition.resultFor(a)) } };
  }
  async function refused(event, data, code, socket = gm) { const before = actors.clone(room.gameState), r = await ack(socket, event, data); assert.equal(r.success, false, JSON.stringify(r)); if (code) assert.equal(r.code, code, JSON.stringify(r)); assert.deepEqual(room.gameState, before); return r; }
  function edit(ref, op, r) {
    return { version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence,
      actors: [{ ref, expectedRevision: token(ref).state.actorContract.revision, conditions: [{ op, recordId: r.id, ...(op === 'remove' ? {} : { record: r }) }] }],
      adjudication: { definitionId: profile.STUNNED.definitionId, definitionVersionOrHash: profile.STUNNED.origin, finalAmount: 0, adjustmentReason: '', chosenResult: 'GM correction' } };
  }
  it('paid application atomically installs temp-first price and exact canonical attributed manual Stunned', async() => {
    await admit(); const a = attempt(); await prepare(a); const r = await ack(gm, 'actor_consequence', command(a)); assert.equal(r.success, true, JSON.stringify(r));
    assert.equal(token().state.currentActionPoints, 9); assert.equal(token().state.currentMana, 19); assert.equal(token().state.tempMana, 0); assert.equal(token().state.tempActionPoints, 0);
    const c = token(target).state.conditions[0]; assert.ok(profile.isStunned(c)); assert.deepEqual(c.sourceActor, source); assert.equal(c.id, a.approvalId); assert.equal(c.sharedTiming, 'manual'); assert.match(c.effectSummary, /bell.*GM removes/);
    assert.equal(token(target).state.currentHp, 10); assert.equal(r.receipt.actors.length, 2); assert.deepEqual(JSON.parse(actors.ledger(room).receipts.at(-1).adjudication.chosenResult).resolution, a.resolution);
    assert.equal(JSON.parse(r.receipt.adjudication.chosenResult).resolution.evidence, undefined);
    assert.throws(() => actors.assertCanAct(room, target), /Stunned|actor_stunned/i);
    assert.equal(room.gameState.combat?.effectLifecycle?.schedules?.length || 0, 0);
  });
  it('a differently named zero-price definition uses the identical primitive without dice or HP', async() => {
    token().authoredAbility.record = record('Disposable Quiet Anchor', 0, 0); await admit(); const a = attempt(); await prepare(a);
    const before = actors.resources(token(), 'creature'); assert.equal((await ack(gm, 'actor_consequence', command(a))).success, true); assert.deepEqual(actors.resources(token(), 'creature'), before); assert.ok(profile.isStunned(token(target).state.conditions[0]));
  });
  it('independent applications/sources remain individually removable; only final removal restores action', async() => {
    await admit(); const a = attempt(); await prepare(a); assert.equal((await ack(gm, 'actor_consequence', command(a))).success, true);
    const b = attempt(); await prepare(b); assert.equal((await ack(gm, 'actor_consequence', command(b))).success, true);
    assert.equal(token(target).state.conditions.length, 2); const first = token(target).state.conditions[0]; assert.equal((await ack(gm, 'actor_consequence', edit(target, 'remove', first))).success, true);
    assert.throws(() => actors.assertCanAct(room, target)); assert.equal((await ack(gm, 'actor_consequence', edit(target, 'remove', token(target).state.conditions[0]))).success, true); assert.doesNotThrow(() => actors.assertCanAct(room, target));
    await admit(target); const c = attempt(target, source); await prepare(c); assert.equal((await ack(gm, 'actor_consequence', command(c))).success, true); assert.deepEqual(token().state.conditions[0].sourceActor, target);
  });
  it('insufficient and unavailable resources refuse without installation', async() => {
    await admit(); const a = attempt(); token().state.currentMana = 0; token().state.tempMana = 0; await refused('actor_spell_prepare_creature', a, 'insufficient_resources'); delete token().state.currentMana; await refused('actor_spell_prepare_creature', a, 'invalid_resources');
  });
  it('strict outcome, price, definition hash/version and manual timing binding cannot be forged', async() => {
    await admit(); const a = attempt();
    for (const change of [b => { b.resolution.gmConfirmed = false; }, b => { b.resolution.timingNote = ''; }, b => { b.resolution.timing.expiryPolicy = 'automatic'; }, b => { b.price.ap = 0; }, b => { b.spell.definitionHash = `${pure.CONDITION_CAPABILITY}/${'a'.repeat(64)}`; }, b => { b.spell.definitionId = b.spell.definitionId.replace(':1:', ':2:'); }]) { const b = actors.clone(a); change(b); await refused('actor_spell_prepare_creature', b); }
    await prepare(a); const c = command(a); c.actors[1].conditions[0].record.clockBoundary = 'shield-bash-target-end'; await refused('actor_consequence', c);
  });
  it('wrong GM/replaced GM and refreshed/revoked admission cannot execute', async() => {
    await admit(); const a = attempt(); await refused('actor_spell_prepare_creature', a, 'forbidden', observer); await prepare(a); const c = command(a); await refused('actor_consequence', c, undefined, observer);
    const old = room.gm.socketId; room.gm.socketId = observer.id; await refused('actor_consequence', c); room.gm.socketId = old;
    await admit(); await refused('actor_consequence', c, 'creature_admission_changed'); await ack(gm, 'actor_spell_withdraw', { roomId: room.id, approvalId: a.approvalId, approval: a });
    const b = attempt(); await prepare(b); const grant = token().state.actorContract.authoredAdmission; assert.equal((await ack(gm, 'actor_authored_revoke', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(room).revision, definitionRef: grant.definitionRef })).success, true); await refused('actor_consequence', command(b), 'definition_revoked');
  });
  it('stale/recreated source or target, bounds and condition changes require explicit revalidation', async() => {
    await admit(); const a = attempt(); await prepare(a);
    for (const ref of [source, target]) { const c = command(a), t = token(ref), old = t.state.actorContract.instanceId; t.state.actorContract.instanceId = uuid(); await refused('actor_consequence', c); t.state.actorContract.instanceId = old; t.state.actorContract.revision++; await refused('actor_consequence', command(a), 'creature_revalidation_required'); await prepare(a); }
    token(target).state.maxHp++; await refused('actor_consequence', command(a), 'creature_revalidation_required'); await prepare(a);
    assert.equal((await ack(gm, 'actor_consequence', command(a))).success, true);
  });
  async function during(event, data, change, code) {
    const original = server.authorityService.assertCurrent; let enter, release; const entered = new Promise(r => { enter = r; }), gate = new Promise(r => { release = r; });
    server.authorityService.assertCurrent = async(...args) => { if (new Error().stack.includes('actorConsequenceHandlers.js')) { enter(); await gate; } return original(...args); };
    const pending = ack(gm, event, data); await entered; change(); const before = actors.clone(room.gameState); release(); const r = await pending; server.authorityService.assertCurrent = original;
    assert.equal(r.code, code, JSON.stringify(r)); assert.deepEqual(room.gameState, before);
  }
  it('canonical source Stunned before and during both asynchronous boundaries refuses; evidence retained', async() => {
    await admit(); const a = attempt(), stun = profile.makeStunnedRecord(source, uuid(), { sourceOccurrence: 'manual-test' });
    token().state.conditions.push(stun); await refused('actor_spell_prepare_creature', a, 'actor_stunned'); token().state.conditions = [];
    await during('actor_spell_prepare_creature', a, () => token().state.conditions.push(stun), 'actor_stunned'); assert.equal(payments.get(room, a.approvalId), null); token().state.conditions = []; await prepare(a);
    await during('actor_consequence', command(a), () => token().state.conditions.push(stun), 'actor_stunned'); token().state.conditions = []; await prepare(a); assert.equal((await ack(gm, 'actor_consequence', command(a))).success, true);
  });
  it('writer and condition/receipt capacity refusal installs neither debit nor condition and retains attempt', async() => {
    await admit(); const a = attempt(); await prepare(a); const c = command(a); room.isPermanent = true; writer.admitConsequence = () => ({ queued: false, code: 'a7_writer_refusal' }); await refused('actor_consequence', c, 'a7_writer_refusal'); assert.ok(payments.get(room, a.approvalId));
    room.isPermanent = false; token(target).state.conditions = Array.from({ length: 128 }, (_, i) => ({ name: `Manual ${i}`, id: uuid(), description: 'x'.repeat(5000) })); await prepare(a); await refused('actor_consequence', command(a), 'receipt_capacity');
  });
  it('generic add/update cannot fabricate authored results, while exact correction/manual Stunned remain valid', async() => {
    await admit(); const a = attempt(), r = condition.recordFor(a); await refused('actor_consequence', edit(target, 'add', r), 'authored_condition_approval_required');
    const manual = profile.makeStunnedRecord(target, r.id, { sourceOccurrence: 'ordinary' }); assert.equal((await ack(gm, 'actor_consequence', edit(target, 'add', manual))).success, true); await refused('actor_consequence', edit(target, 'update', r), 'authored_condition_approval_required');
    assert.equal((await ack(gm, 'actor_consequence', edit(target, 'remove', manual))).success, true); await prepare(a); assert.equal((await ack(gm, 'actor_consequence', command(a))).success, true);
    assert.equal((await ack(gm, 'actor_consequence', edit(target, 'update', r))).success, true); assert.ok(profile.isStunned(token(target).state.conditions[0]));
  });
  it('name-only legacy Stunned is not promoted and unsupported whole mixed/periodic/area records refuse', async() => {
    token().state.conditions.push({ id: uuid(), name: 'Stunned' }); assert.doesNotThrow(() => actors.assertCanAct(room, source));
    for (const change of [d => { d.effectTypes.push('damage'); }, d => { d.damageConfig = { formula: '1d6' }; }, d => { d.persistentConfig = { enabled: true }; }, d => { d.targetingConfig.targetingType = 'area'; }, d => { d.controlConfig.extra = 'unsupported'; }]) {
      const r = record(); change(r.authoredDraft); token().authoredAbility.record = r;
      await refused('actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(room).revision, source, expectedSourceRevision: token().state.actorContract.revision, definitionVersion: 1 }, 'unsupported_wizard_record');
    }
  });
  it('duplicates/conflicts/lost ACK recover only original receipt even after condition removal', async() => {
    await admit(); const a = attempt(); await prepare(a); const c = command(a); gm.emit('actor_consequence', c); await new Promise(r => setTimeout(r, 80)); const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true, JSON.stringify(r));
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, r.receipt); assert.equal(token(target).state.conditions.length, 1); assert.equal(actors.ledger(room).receipts.length, 1);
    await refused('actor_consequence', { ...c, adjudication: { ...c.adjudication, adjustmentReason: 'conflict' } }, 'command_id_conflict');
    assert.equal((await ack(gm, 'actor_consequence', edit(target, 'remove', token(target).state.conditions[0]))).success, true); assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, r.receipt); assert.equal(token(target).state.conditions.length, 0);
  });
  it('checkpoint restores mixed-registry codec and original receipts; new epoch blocks unknown/pruned replacement', async() => {
    await admit(); const a = attempt(); await prepare(a); const c = command(a), accepted = await ack(gm, 'actor_consequence', c); assert.equal(accepted.success, true);
    assert.equal(definitions.decodeRegistry(JSON.stringify(room.gameState.authoredSpellRegistry)).ok, true);
    const codec = require('../services/roomCheckpoint'), built = codec.buildCheckpointDocuments({ roomId: room.id, gameState: room.gameState, revision: 1 });
    const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])) }); assert.equal(decoded.ok, true);
    room = { ...room, gameState: { ...decoded.global, maps: decoded.maps, ...codec.deriveRootMirrors(decoded.maps) }, checkpointRevision: 1 }; server.rooms.set(room.id, room);
    assert.notEqual(actors.epoch(room), a.actionEpoch); assert.ok(profile.isStunned(token(target).state.conditions[0])); assert.equal(installed.registry(room).schemaVersion, 2);
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, accepted.receipt); await refused('actor_spell_prepare_creature', { ...a, approvalId: uuid() }, 'outcome_unknown');
    room.gameState.actorConsequences.receipts = []; room.gameState.actorConsequences.replayFloor = room.gameState.actorConsequences.commitSequence; await refused('actor_consequence', c, 'outcome_unknown');
  });
});
module.exports = { record };
