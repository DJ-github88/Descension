const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences'), installed = require('../services/installedAuthoredAbilities');
const payments = require('../services/spellPayments'), pure = require('../../vtt-react/src/services/authoredAbility');
const condition = require('../../vtt-react/src/services/authoredCondition'), profile = require('../../vtt-react/src/services/sharedConditionProfile');
const ack = (s, e, d) => new Promise((resolve, reject) => { const timer = setTimeout(() => reject(Error(e)), 5000); s.emit(e, d, r => { clearTimeout(timer); resolve(r); }); });
const once = (s, e) => new Promise(r => s.once(e, r));
function record(ap = 1, mana = 2) {
  const d = { name: 'Disposable A9 hostile Bell', description: 'Disposable authority fixture; no beneficial mechanics', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: ['control'],
    controlConfig: { authoredCondition: { profile: pure.CONDITION_CAPABILITY, conditionKey: 'stunned', expiryPolicy: 'gm-manual', durationText: 'Until the authored bell ends', gmNote: 'GM resolves saves, immunity and eligibility.' } },
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: ap, mana } };
  return { ...actors.clone(d), authoredDraft: d, authoredDefinitionId: uuid() };
}
describe('P14-A9 exact primary PC Stunned — production handlers', function() {
  this.timeout(15000);
  let server, room, gm, sourceOwner, targetOwner, observer, source, target, creature, writer;
  const token = ref => actors.locate(room, ref).token;
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer }); await server.start();
    const sockets = {};
    for (const role of ['gm', 'source', 'target', 'observer']) {
      const uid = server.nextUserId(); server.registerAuthToken(role, uid);
      const s = server.connect({ token: role }); await once(s, 'connect'); sockets[role] = s;
      if (role === 'gm') room = await server.seedRoom(s.id, { gmUserId: uid });
      else { const joined = once(s, 'room_joined'); s.emit('join_room', { roomId: room.id, playerName: role, password: '' }); await joined; }
    }
    ({ gm, source: sourceOwner, target: targetOwner, observer } = sockets);
    async function pc(id, s) {
      const map = room.gameState.maps.default;
      const uid = server.players.get(s.id).userId; server.setCharacterOwner(id, uid);
      const character = { id, class: 'Arcanoneer', health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, tempMana: 2, tempActionPoints: 1 };
      server.players.get(s.id).character = actors.clone(character);
      map.characterTokens[id] = { id, ownerUserId: uid, character, state: { conditions: [] } };
      const r = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: id, ownerUid: uid, characterId: id }, snapshotHash: actors.hash(map.characterTokens[id]) }); assert.equal(r.success, true, JSON.stringify(r)); return r.ref;
    }
    source = await pc('source-pc', sourceOwner); target = await pc('target-pc', targetOwner);
    const map = room.gameState.maps.default;
    map.tokens.creature = { id: 'creature', name: 'CONCEALED attacker', hidden: true, stats: { maxHp: 30, maxMana: 10, maxAP: 4 }, state: { currentHp: 30, currentMana: 10, currentActionPoints: 4, tempActionPoints: 1, tempMana: 2, conditions: [] } };
    creature = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'creature' }, snapshotHash: actors.hash(map.tokens.creature) })).ref;
  });
  afterEach(async() => { for (const s of [gm, sourceOwner, targetOwner, observer]) s.disconnect(); await server.stop(); });
  async function prepare(kind = 'creature', price = [1, 2]) {
    const r = record(...price), src = kind === 'creature' ? creature : source;
    const req = { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(room).revision, definitionVersion: 1 };
    if (kind === 'creature') { token(src).authoredAbility = { schemaVersion: 1, record: r, librarySpellId: null }; Object.assign(req, { source: src, expectedSourceRevision: token(src).state.actorContract.revision }); }
    else Object.assign(req, { record: r, classId: 'arcanoneer' });
    const admitted = await ack(gm, 'actor_authored_admit', req); assert.equal(admitted.success, true, JSON.stringify(admitted));
    const e = installed.list(room).entries.find(e => pure.actionId(e.definitionRef) === pure.actionId(admitted.definitionRef));
    const resolution = { gmConfirmed: true, timing: e.canonicalDefinition.timing, timingNote: 'PRIVATE timing note', evidence: 'PRIVATE immunity and physical save ruling' };
    const a = { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, source: src, target,
      spell: { definitionId: pure.actionId(e.definitionRef), definitionHash: `${pure.CONDITION_CAPABILITY}/${e.definitionRef.definitionHash}`, name: e.canonicalDefinition.name, kind: 'condition', damageTypes: [] }, price: e.descriptor.price, roll: null, classPayment: null,
      ...(kind === 'creature' ? { sourceAuthority: { admissionId: token(src).state.actorContract.authoredAdmission.requestId, associationHash: actors.hash(token(src).authoredAbility), gmUid: room.gmId }, resolution } : { conditionTerms: { conditionKey: 'stunned', timing: e.canonicalDefinition.timing } }) };
    return { a, resolution, e };
  }
  async function approve(a) { const r = await ack(a.source.kind === 'creature' ? gm : sourceOwner, a.source.kind === 'creature' ? 'actor_spell_prepare_creature' : 'actor_spell_approve', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); return r; }
  function command(a, resolution) {
    const resolved = { ...a, resolution: resolution || a.resolution }, pools = actors.resources(token(a.source), a.source.kind), pay = {};
    for (const p of ['ap', 'mana']) if (a.price[p]) pay[p] = payments.tempFirst(pools[p].current, pools[p].temp, a.price[p]);
    if (!Object.keys(pay).length) pay.ap = payments.tempFirst(pools.ap.current, pools.ap.temp, 0);
    return { version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, source: a.source, target: a.target,
      approval: { approvalId: a.approvalId, contentHash: actors.hash(a) }, actors: [{ ref: a.source, expectedRevision: token(a.source).state.actorContract.revision, finalResources: pay }, { ref: a.target, expectedRevision: token(a.target).state.actorContract.revision, conditions: [{ op: 'add', recordId: a.approvalId, record: condition.recordFor(resolved) }] }],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, finalAmount: 0, adjustmentReason: '', chosenResult: JSON.stringify(condition.resultFor(resolved)) } };
  }
  async function refuse(s, e, d, code) { const before = actors.clone(room.gameState), r = await ack(s, e, d); assert.equal(r.success, false, JSON.stringify(r)); if (code) assert.equal(r.code, code, JSON.stringify(r)); assert.deepEqual(room.gameState, before); return r; }
  const designate = a => ack(gm, 'actor_spell_target_designate', { roomId: room.id, approvalId: a.approvalId, contentHash: actors.hash(a) });
  const response = (p, accept = true) => ({ roomId: room.id, approvalId: p.approvalId, proposalId: p.proposalId, termsHash: p.termsHash, target: p.target, accept });
  it('creature hostile installs offline without target acknowledgement; canonical owner projection is anonymous and private', async() => {
    const { a } = await prepare(); await approve(a); targetOwner.disconnect();
    const before = actors.resources(token(creature), 'creature'), c = command(a), r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true, JSON.stringify(r));
    assert.deepEqual(actors.resources(token(creature), 'creature').ap, { ...before.ap, ...payments.tempFirst(before.ap.current, before.ap.temp, 1) });
    const instance = token(target).state.conditions[0]; assert.ok(profile.isStunned(instance)); assert.deepEqual(instance.sourceActor, creature); assert.equal(instance.authoredDuration, a.resolution.timing.durationText);
    assert.ok(!JSON.stringify(r.receipt).includes('PRIVATE')); assert.equal(r.receipt.source, undefined); assert.ok(r.receipt.actors.every(x => x.ref.kind === 'character')); assert.ok(!JSON.stringify(r.receipt).includes(a.spell.name));
    const pub = actors.publicCondition(instance); assert.ok(profile.isStunned(pub)); assert.ok(!pub.sourceActor); assert.equal(pub.id, instance.id); assert.throws(() => actors.assertCanAct(room, target));
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, r.receipt); assert.equal(token(target).state.conditions.length, 1);
  });
  it('PC→PC exact source payment consent and zero-price application remain independent of target silence', async() => {
    for (const price of [[1, 2], [0, 0]]) {
      const { a, resolution } = await prepare('pc', price), before = actors.resources(token(source), 'character');
      await refuse(targetOwner, 'actor_spell_approve', a, 'forbidden'); await refuse(observer, 'actor_spell_approve', a, 'forbidden'); await approve(a);
      assert.equal((await ack(gm, 'actor_consequence', command(a, resolution))).success, true);
      for (const [p, amount] of [['ap', price[0]], ['mana', price[1]]]) assert.deepEqual(actors.resources(token(source), 'character')[p], { ...before[p], ...payments.tempFirst(before[p].current, before[p].temp, amount) });
    }
    assert.equal(token(target).state.conditions.length, 2); assert.equal(new Set(token(target).state.conditions.map(r => r.id)).size, 2);
  });
  it('voluntary fixture waits for exact target acceptance, never silence or proxy; duplicates install once', async() => {
    const { a } = await prepare(); await approve(a); await refuse(targetOwner, 'actor_spell_target_designate', { roomId: room.id, approvalId: a.approvalId, contentHash: actors.hash(a) }, 'forbidden');
    const p = (await designate(a)).proposal; assert.ok(p); const c = command(a);
    assert.notEqual(p.sourceHandle, actors.hash(a.source)); assert.notEqual(p.termsHash, actors.hash(payments.targetTerms(payments.get(room, a.approvalId))));
    await refuse(gm, 'actor_consequence', c, 'target_acceptance_required'); await new Promise(r => setTimeout(r, 25)); await refuse(gm, 'actor_consequence', c, 'target_acceptance_required');
    for (const s of [gm, observer, sourceOwner]) await refuse(s, 'actor_spell_target_respond', response(p), 'forbidden');
    await refuse(targetOwner, 'actor_spell_target_respond', { ...response(p), termsHash: 'a'.repeat(64) }, 'target_proposal_changed');
    const r = await ack(targetOwner, 'actor_spell_target_respond', response(p)); assert.equal(r.success, true); assert.equal((await ack(targetOwner, 'actor_spell_target_respond', response(p))).success, true);
    const accepted = await ack(gm, 'actor_consequence', c); assert.equal(accepted.success, true); assert.equal((await ack(gm, 'actor_consequence', c)).success, true); assert.equal(token(target).state.conditions.length, 1);
    const recovered = await ack(targetOwner, 'actor_spell_target_respond', response(p)); assert.deepEqual(recovered.receipt, accepted.receipt); assert.ok(!JSON.stringify(recovered).includes('bindingHash'));
  });
  it('voluntary PC-source target acceptance cannot stand in for payment; withdrawn target acceptance cannot be reused', async() => {
    const { a, resolution } = await prepare('pc'); await refuse(gm, 'actor_consequence', command(a, resolution), 'outcome_unknown'); await approve(a);
    const p = (await designate(a)).proposal; assert.equal((await ack(targetOwner, 'actor_spell_target_respond', response(p))).success, true);
    assert.equal((await ack(targetOwner, 'actor_spell_target_respond', response(p, false))).success, true);
    await refuse(targetOwner, 'actor_spell_target_respond', response(p), 'target_acceptance_withdrawn'); await refuse(gm, 'actor_consequence', command(a, resolution), 'target_acceptance_required');
    assert.ok(payments.get(room, a.approvalId)); assert.equal((await designate(a)).proposal.withdrawn, true);
  });
  it('exact target primary/canonical/incarnation and source admission/binding/revocation are rechecked', async() => {
    const { a, resolution, e } = await prepare('pc'); await approve(a);
    for (const mutate of [() => { token(target).state.actorContract.primary = false; }, () => { token(target).character.id = 'old-character'; }, () => { token(target).ownerUserId = 'foreign'; }, () => { token(target).state.actorContract.instanceId = uuid(); }, () => { token(source).character.class = 'Chronarch'; }]) {
      const c = command(a, resolution), before = actors.clone(room.gameState); mutate(); await refuse(gm, 'actor_consequence', c); room.gameState = before;
    }
    const revoked = await ack(gm, 'actor_authored_revoke', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(room).revision, definitionRef: e.definitionRef }); assert.equal(revoked.success, true); await refuse(gm, 'actor_consequence', command(a, resolution), 'definition_revoked');
  });
  it('client flags, nonGM/replaced GM and material substitutions cannot forge hostile authority', async() => {
    const { a } = await prepare(); await approve(a); const c = command(a);
    await refuse(targetOwner, 'actor_consequence', c); await refuse(observer, 'actor_consequence', c);
    await refuse(gm, 'actor_consequence', { ...c, hostile: true }); await refuse(gm, 'actor_consequence', { ...c, target: source });
    const sid = room.gm.socketId; room.gm.socketId = observer.id; await refuse(gm, 'actor_consequence', c); room.gm.socketId = sid;
    await refuse(sourceOwner, 'actor_spell_approve', { ...a, ownerAccepted: true });
  });
  async function during(s, event, data, mutate, code) {
    const original = server.authorityService.assertCurrent; let enter, release; const entered = new Promise(r => { enter = r; }), gate = new Promise(r => { release = r; });
    server.authorityService.assertCurrent = async(...args) => { if (new Error().stack.includes('actorConsequenceHandlers.js')) { enter(); await gate; } return original(...args); };
    try { const result = ack(s, event, data); await entered; mutate(); const before = actors.clone(room.gameState); release(); const r = await result; assert.equal(r.code, code, JSON.stringify(r)); assert.deepEqual(room.gameState, before); } finally { server.authorityService.assertCurrent = original; }
  }
  it('source Stunned before/after awaits and writer/resource refusal have no partial installation or consumption', async() => {
    const { a } = await prepare(); await approve(a); const stun = profile.makeStunnedRecord(creature, uuid(), { sourceOccurrence: 'manual-A9' });
    await during(gm, 'actor_consequence', command(a), () => token(creature).state.conditions.push(stun), 'actor_stunned'); token(creature).state.conditions = [];
    const c = command(a); token(creature).state.conditions.push(stun); await refuse(gm, 'actor_consequence', c, 'actor_stunned'); token(creature).state.conditions = [];
    room.isPermanent = true; writer.admitConsequence = () => ({ queued: false, code: 'a9_writer_refusal' }); await refuse(gm, 'actor_consequence', c, 'a9_writer_refusal'); room.isPermanent = false;
    token(creature).state.currentMana = 0; token(creature).state.tempMana = 0; await refuse(gm, 'actor_consequence', c, 'insufficient_resources'); assert.ok(payments.get(room, a.approvalId));
  });
  it('retired character/room and post-await withdrawn target responses refuse; target Stunned permits consent', async() => {
    const { a } = await prepare(); await approve(a); const p = (await designate(a)).proposal;
    server.players.get(targetOwner.id).character.id = 'old'; await refuse(targetOwner, 'actor_spell_target_respond', response(p), 'forbidden'); server.players.get(targetOwner.id).character.id = target.characterId;
    token(target).state.conditions.push(profile.makeStunnedRecord(target, uuid(), { sourceOccurrence: 'independent-existing' }));
    assert.equal((await ack(targetOwner, 'actor_spell_target_respond', response(p))).success, true);
    await during(targetOwner, 'actor_spell_target_respond', response(p), () => { server.players.get(targetOwner.id).character.id = 'old'; }, 'forbidden');
  });
  it('hostile owner cannot remove/update generically; GM public-view correction preserves attribution; recovery conceals it', async() => {
    const { a } = await prepare(); await approve(a); assert.equal((await ack(gm, 'actor_consequence', command(a))).success, true);
    const record = token(target).state.conditions[0], pub = actors.publicCondition(record);
    const edit = op => ({ version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence,
      actors: [{ ref: target, expectedRevision: token(target).state.actorContract.revision, conditions: [op] }], adjudication: { definitionId: profile.STUNNED.definitionId, definitionVersionOrHash: profile.STUNNED.origin, finalAmount: 0, adjustmentReason: '', chosenResult: 'GM exact correction' } });
    for (const op of [{ op: 'remove', recordId: record.id }, { op: 'update', recordId: record.id, record: pub }]) await refuse(targetOwner, 'actor_consequence', edit(op), 'authored_condition_gm_correction_required');
    assert.equal((await ack(gm, 'actor_consequence', edit({ op: 'update', recordId: record.id, record: pub }))).success, true);
    assert.deepEqual(token(target).state.conditions[0].sourceActor, creature);
    const recovery = await ack(targetOwner, 'actor_recovery', { roomId: room.id, ref: target }); assert.equal(recovery.success, true); assert.ok(!JSON.stringify(recovery.recovery).includes('sourceActor'), JSON.stringify(recovery.recovery));
    assert.equal((await ack(gm, 'actor_consequence', edit({ op: 'remove', recordId: record.id }))).success, true); assert.doesNotThrow(() => actors.assertCanAct(room, target));
  });
});
