const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences'), installed = require('../services/installedAuthoredAbilities');
const payments = require('../services/spellPayments'), pure = require('../../vtt-react/src/services/authoredAbility');
const condition = require('../../vtt-react/src/services/authoredCondition'), profile = require('../../vtt-react/src/services/sharedConditionProfile');
const ack = (s, event, data) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error(event)), 5000); s.emit(event, data, r => { clearTimeout(t); resolve(r); }); });
const once = (s, e) => new Promise(r => s.once(e, r));
function record(ap = 2, mana = 3) {
  const d = { name: 'Disposable A8 Bell', description: 'Disposable owner condition', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: ['control'],
    controlConfig: { authoredCondition: { profile: pure.CONDITION_CAPABILITY, conditionKey: 'stunned', expiryPolicy: 'gm-manual', durationText: 'Until the bell falls silent', gmNote: 'GM resolves eligibility and saves.' } },
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: ap, mana } };
  return { ...actors.clone(d), authoredDraft: d, authoredDefinitionId: uuid() };
}
describe('P14-A8 owner PC condition — registered production handlers', function() {
  this.timeout(15000);
  let server, room, gm, owner, observer, pc, foe, uid, writer;
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer }); await server.start();
    for (const e of ['actor_bind', 'actor_consequence', 'actor_snapshot', 'actor_spell_approve', 'actor_spell_withdraw', 'actor_authored_admit', 'actor_authored_revoke', 'actor_authored_list']) server.setEventLimits(e, { maxPerMinute: 2000, maxPerSecond: 2000 });
    const gmUid = server.nextUserId(); uid = server.nextUserId();
    server.registerAuthToken('gm', gmUid); server.registerAuthToken('owner', uid); server.registerAuthToken('observer', server.nextUserId());
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: gmUid });
    for (const role of ['owner', 'observer']) { const s = server.connect({ token: role }); await once(s, 'connect'); const joined = once(s, 'room_joined'); s.emit('join_room', { roomId: room.id, playerName: role, password: '' }); await joined; if (role === 'owner') owner = s; else observer = s; }
    server.setCharacterOwner('c', uid);
    const map = room.gameState.maps.default;
    map.tokens.foe = { id: 'foe', stats: { maxHp: 30, maxMana: 20, maxAP: 4 }, state: { currentHp: 20, currentMana: 20, currentActionPoints: 4, conditions: [] } };
    map.characterTokens.pc = { id: 'pc', ownerUserId: uid, character: { id: 'c', class: 'Arcanoneer', health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, tempMana: 2, tempActionPoints: 1 }, state: { conditions: [] } };
    pc = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid: uid, characterId: 'c' }, snapshotHash: actors.hash(map.characterTokens.pc) })).ref;
    foe = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'foe' }, snapshotHash: actors.hash(map.tokens.foe) })).ref;
    assert.ok(pc && foe);
  });
  afterEach(async() => { gm.disconnect(); owner.disconnect(); observer.disconnect(); await server.stop(); });
  const token = ref => actors.locate(room, ref).token;
  const request = (r, version = 1) => ({ roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(room).revision, record: r, definitionVersion: version, classId: 'arcanoneer' });
  async function admit(r = record(), version = 1) { const result = await ack(gm, 'actor_authored_admit', request(r, version)); assert.equal(result.success, true, JSON.stringify(result)); return result.definitionRef; }
  function approval(ref, target = foe) {
    const e = installed.list(room).entries.find(e => pure.actionId(e.definitionRef) === pure.actionId(ref));
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, source: pc, target,
      spell: { definitionId: pure.actionId(ref), definitionHash: `${pure.CONDITION_CAPABILITY}/${ref.definitionHash}`, name: e.canonicalDefinition.name, kind: 'condition', damageTypes: [] },
      roll: null, price: e.descriptor.price, classPayment: null, conditionTerms: { conditionKey: 'stunned', timing: e.canonicalDefinition.timing } };
  }
  async function approve(a) { const before = actors.clone(room.gameState), r = await ack(owner, 'actor_spell_approve', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); assert.deepEqual(room.gameState, before); return r; }
  function command(a, resolution = { gmConfirmed: true, timing: a.conditionTerms.timing, timingNote: 'Clarification: GM removes at the declared silence', evidence: 'PRIVATE GM physical save ruling' }) {
    const resolved = { ...a, resolution }, pools = actors.resources(token(a.source), a.source.kind), pay = {};
    for (const p of ['ap', 'mana']) if (a.price[p]) pay[p] = payments.tempFirst(pools[p].current, pools[p].temp, a.price[p]);
    if (!Object.keys(pay).length) pay.ap = payments.tempFirst(pools.ap.current, pools.ap.temp, 0);
    return { version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, source: a.source, target: a.target,
      approval: { approvalId: a.approvalId, contentHash: actors.hash(a) }, actors: [{ ref: a.source, expectedRevision: token(a.source).state.actorContract.revision, finalResources: pay },
        { ref: a.target, expectedRevision: token(a.target).state.actorContract.revision, conditions: [{ op: 'add', recordId: a.approvalId, record: condition.recordFor(resolved) }] }],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, finalAmount: 0, adjustmentReason: '', chosenResult: JSON.stringify(condition.resultFor(resolved)) } };
  }
  async function refuse(s, e, data, code) { const before = actors.clone(room.gameState), r = await ack(s, e, data); assert.equal(r.success, false, JSON.stringify(r)); if (code) assert.equal(r.code, code, JSON.stringify(r)); assert.deepEqual(room.gameState, before); return r; }
  async function withdraw(a) { assert.equal((await ack(owner, 'actor_spell_withdraw', { roomId: room.id, approvalId: a.approvalId })).code, 'withdrawn'); }
  it('paid/free PC applications use exact consent, temp-first debit, canonical instance and no HP/private projection', async() => {
    for (const price of [[2, 3], [0, 0]]) {
      const a = approval(await admit(record(...price))), before = actors.resources(token(pc), 'character'); await approve(a);
      assert.equal((await ack(observer, 'actor_spell_list', { roomId: room.id })).pending.length, 0);
      const r = await ack(gm, 'actor_consequence', command(a)); assert.equal(r.success, true, JSON.stringify(r));
      assert.deepEqual(actors.resources(token(pc), 'character').ap, { ...before.ap, ...payments.tempFirst(before.ap.current, before.ap.temp, price[0]) });
      assert.deepEqual(actors.resources(token(pc), 'character').mana, { ...before.mana, ...payments.tempFirst(before.mana.current, before.mana.temp, price[1]) });
      const instance = token(foe).state.conditions.find(r => r.id === a.approvalId); assert.ok(profile.isStunned(instance)); assert.deepEqual(instance.sourceActor, pc);
      assert.equal(token(foe).state.currentHp, 20); assert.ok(!JSON.stringify(r.receipt).includes('PRIVATE')); assert.ok(!JSON.stringify(r.receipt).includes('Clarification')); assert.ok(!JSON.stringify(instance).includes('Clarification'));
      assert.deepEqual(JSON.parse(actors.ledger(room).receipts.at(-1).adjudication.chosenResult).resolution.timing, a.conditionTerms.timing);
    }
    assert.equal(token(foe).state.conditions.length, 2);
    const remove = id => ({ version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, actors: [{ ref: foe, expectedRevision: token(foe).state.actorContract.revision, conditions: [{ op: 'remove', recordId: id }] }], adjudication: { definitionId: profile.STUNNED.definitionId, definitionVersionOrHash: profile.STUNNED.origin, finalAmount: 0, adjustmentReason: '', chosenResult: 'GM exact removal' } });
    assert.equal((await ack(gm, 'actor_consequence', remove(token(foe).state.conditions[0].id))).success, true); assert.throws(() => actors.assertCanAct(room, foe));
    assert.equal((await ack(gm, 'actor_consequence', remove(token(foe).state.conditions[0].id))).success, true); assert.doesNotThrow(() => actors.assertCanAct(room, foe));
  });
  it('foreign owner/account, substituted canonical character and secondary/unbound sources refuse', async() => {
    const a = approval(await admit()); await refuse(observer, 'actor_spell_approve', a, 'forbidden'); await refuse(gm, 'actor_spell_approve', a, 'forbidden');
    for (const mutate of [() => { token(pc).state.actorContract.primary = false; }, () => { token(pc).character.id = 'other'; }, () => { token(pc).ownerUserId = 'foreign'; }, () => { delete token(pc).state.actorContract; }]) {
      const old = actors.clone(room.gameState); mutate(); await refuse(owner, 'actor_spell_approve', a); room.gameState = old;
    }
    await refuse(owner, 'actor_spell_approve', { ...a, source: { ...pc, characterId: 'other' } });
    await refuse(owner, 'actor_spell_approve', { ...a, target: pc });
  });
  it('creature-only admission never authorizes PC; normal admission explicitly creates a PC version', async() => {
    const r = record(); token(foe).authoredAbility = { schemaVersion: 1, record: r, librarySpellId: null };
    const c = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: 0, source: foe, expectedSourceRevision: token(foe).state.actorContract.revision, definitionVersion: 1 }); assert.equal(c.success, true, JSON.stringify(c));
    assert.equal(installed.list(room).entries[0].creatureOnly, true); await refuse(owner, 'actor_spell_approve', approval(c.definitionRef), 'unsupported_source_route');
    const ref = await admit(r, 2); assert.equal(installed.list(room).entries[1].creatureOnly, false); await approve(approval(ref));
  });
  it('material price/effect/duration/version/target substitutions require new approval; clarification cannot replace duration', async() => {
    const r = record(), a = approval(await admit(r));
    for (const edit of [b => { b.price.ap = 0; }, b => { b.conditionTerms.timing.durationText = 'Forever'; }, b => { b.conditionTerms.conditionKey = 'prone'; }, b => { b.spell.definitionHash = `${pure.CONDITION_CAPABILITY}/${'a'.repeat(64)}`; }]) { const b = actors.clone(a); edit(b); await refuse(owner, 'actor_spell_approve', b); }
    await approve(a);
    const wrong = command(a); wrong.target = pc; await refuse(gm, 'actor_consequence', wrong, 'approval_mismatch');
    const changed = command(a); const chosen = JSON.parse(changed.adjudication.chosenResult); chosen.resolution.timing.durationText = 'Forever'; changed.adjudication.chosenResult = JSON.stringify(chosen); await refuse(gm, 'actor_consequence', changed, 'owner_reapproval_required');
    r.controlConfig.authoredCondition.durationText = r.authoredDraft.controlConfig.authoredCondition.durationText = 'Until the next bell';
    const b = approval(await admit(r, 2)); assert.notEqual(a.spell.definitionHash, b.spell.definitionHash); await approve(b); assert.equal((await ack(gm, 'actor_consequence', command(b))).success, true);
  });
  it('current binding, revocation, replaced GM and insufficient pools refuse atomically', async() => {
    const ref = await admit(), a = approval(ref); await approve(a); const c = command(a);
    await refuse(owner, 'actor_consequence', c); await refuse(observer, 'actor_consequence', c);
    const sid = room.gm.socketId; room.gm.socketId = observer.id; await refuse(gm, 'actor_consequence', c); room.gm.socketId = sid;
    token(pc).character.class = 'Chronarch'; await refuse(gm, 'actor_consequence', c, 'unsupported_binding'); token(pc).character.class = 'Arcanoneer';
    token(pc).character.mana.current = 0; token(pc).character.tempMana = 0; await refuse(gm, 'actor_consequence', c, 'insufficient_resources');
    assert.equal((await ack(gm, 'actor_authored_revoke', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: 1, definitionRef: ref })).success, true); await refuse(gm, 'actor_consequence', c, 'definition_revoked');
  });
  async function during(s, event, data, mutate, code) {
    const original = server.authorityService.assertCurrent; let enter, release; const entered = new Promise(r => { enter = r; }), gate = new Promise(r => { release = r; });
    server.authorityService.assertCurrent = async(...args) => { if (new Error().stack.includes('actorConsequenceHandlers.js')) { enter(); await gate; } return original(...args); };
    const result = ack(s, event, data); await entered; mutate(); const before = actors.clone(room.gameState); release(); const r = await result; server.authorityService.assertCurrent = original; assert.equal(r.code, code, JSON.stringify(r)); assert.deepEqual(room.gameState, before);
  }
  it('canonical source Stunned before approval, during approval await and during command await refuses', async() => {
    const a = approval(await admit()), stun = profile.makeStunnedRecord(pc, uuid(), { sourceOccurrence: 'manual-A8' });
    token(pc).state.conditions.push(stun); await refuse(owner, 'actor_spell_approve', a, 'actor_stunned'); token(pc).state.conditions = [];
    await during(owner, 'actor_spell_approve', a, () => token(pc).state.conditions.push(stun), 'actor_stunned'); token(pc).state.conditions = []; await approve(a);
    await during(gm, 'actor_consequence', command(a), () => token(pc).state.conditions.push(stun), 'actor_stunned'); assert.ok(payments.get(room, a.approvalId));
  });
  it('stale/recreated source/target and writer/capacity refusal never partially install', async() => {
    const a = approval(await admit()); await approve(a);
    for (const ref of [pc, foe]) {
      const c = command(a), t = token(ref), id = t.state.actorContract.instanceId; t.state.actorContract.instanceId = uuid(); await refuse(gm, 'actor_consequence', c); t.state.actorContract.instanceId = id;
      t.state.actorContract.revision++; await refuse(gm, 'actor_consequence', c);
    }
    const c = command(a); room.isPermanent = true; writer.admitConsequence = () => ({ queued: false, code: 'a8_writer_refusal' }); await refuse(gm, 'actor_consequence', c, 'a8_writer_refusal'); room.isPermanent = false;
    token(foe).state.conditions = Array.from({ length: 128 }, (_, i) => ({ name: `Manual ${i}`, id: uuid(), description: 'x'.repeat(5000) })); await refuse(gm, 'actor_consequence', command(a), 'receipt_capacity'); assert.ok(payments.get(room, a.approvalId));
  });
  it('GM success/timing required, generic forge and unsupported mixed definitions refuse', async() => {
    const a = approval(await admit()); await approve(a);
    for (const patch of [{ gmConfirmed: false }, { timingNote: '' }]) { const c = command(a), chosen = JSON.parse(c.adjudication.chosenResult); Object.assign(chosen.resolution, patch); c.adjudication.chosenResult = JSON.stringify(chosen); await refuse(gm, 'actor_consequence', c, 'invalid_condition_resolution'); }
    const forge = command(a); delete forge.approval; await refuse(gm, 'actor_consequence', forge);
    for (const edit of [d => d.effectTypes.push('damage'), d => { d.targetingConfig.targetingType = 'area'; }, d => { d.spellType = 'REACTION'; }]) { const r = record(); edit(r.authoredDraft); await refuse(gm, 'actor_authored_admit', request(r)); }
  });
  it('lost owner ACK and consequence delivery recover original IDs; duplicates/conflicts and reload epoch never recreate', async() => {
    const a = approval(await admit()); owner.emit('actor_spell_approve', a); await new Promise(r => setTimeout(r, 60)); await approve(a); assert.equal(payments.listAll(room).length, 1);
    const c = command(a); gm.emit('actor_consequence', c); await new Promise(r => setTimeout(r, 60)); const result = await ack(gm, 'actor_consequence', c); assert.equal(result.success, true, JSON.stringify(result));
    assert.deepEqual((await ack(owner, 'actor_spell_approve', a)).receipt, result.receipt); assert.equal(token(foe).state.conditions.length, 1); assert.equal(actors.ledger(room).receipts.length, 1);
    await refuse(gm, 'actor_consequence', { ...c, adjudication: { ...c.adjudication, adjustmentReason: 'conflict' } }, 'command_id_conflict');
    const codec = require('../services/roomCheckpoint'), built = codec.buildCheckpointDocuments({ roomId: room.id, gameState: room.gameState, revision: 1 });
    const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])) }); assert.equal(decoded.ok, true);
    room = { ...room, gameState: { ...decoded.global, maps: decoded.maps, ...codec.deriveRootMirrors(decoded.maps) }, checkpointRevision: 1 }; server.rooms.set(room.id, room);
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, result.receipt); await refuse(owner, 'actor_spell_approve', { ...a, approvalId: uuid() }, 'outcome_unknown');
    room.gameState.actorConsequences.receipts = []; room.gameState.actorConsequences.replayFloor = room.gameState.actorConsequences.commitSequence; await refuse(gm, 'actor_consequence', c, 'outcome_unknown');
  });
  it('withdrawal closes old consent without spending before a changed target is approved', async() => {
    const a = approval(await admit()); await approve(a); await withdraw(a); assert.equal(payments.get(room, a.approvalId), null); await refuse(gm, 'actor_consequence', command(a), 'approval_withdrawn');
    assert.equal((await ack(owner, 'actor_spell_withdraw', { roomId: room.id, approvalId: a.approvalId, approval: a })).code, 'withdrawn');
    const b = { ...a, approvalId: uuid() }; await approve(b); assert.equal((await ack(gm, 'actor_consequence', command(b))).success, true);
  });
});
