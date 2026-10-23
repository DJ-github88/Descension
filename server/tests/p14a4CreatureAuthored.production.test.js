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
function record(kind = 'damage', ap = 1, mana = 3, range = 30) {
  const draft = { name: `Disposable ${kind}`, description: 'A4 production test', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE', school: 'arcane' }, effectTypes: [kind],
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: range, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: ap, mana },
    [kind === 'damage' ? 'damageConfig' : 'healingConfig']: kind === 'damage' ? { damageType: 'direct', elementType: 'arcane', formula: '1d6+2', resolution: 'DICE' } : { healingType: 'direct', formula: '1d8+1', resolution: 'DICE' } };
  return { ...actors.clone(draft), authoredDraft: draft, authoredDefinitionId: uuid() };
}
describe('P14-A4 exact creature authored route — registered production handlers', function() {
  this.timeout(15000);
  let server, room, gm, observer, source, target, sibling, writer, gmUid;
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer }); await server.start();
    for (const e of ['actor_bind', 'actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_revoke', 'actor_authored_list', 'actor_spell_prepare_creature', 'actor_spell_approve']) server.setEventLimits(e, { maxPerMinute: 2000, maxPerSecond: 2000 });
    gmUid = server.nextUserId(); server.registerAuthToken('gm', gmUid); server.registerAuthToken('observer', server.nextUserId());
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: gmUid });
    observer = server.connect({ token: 'observer' }); await once(observer, 'connect'); const joined = once(observer, 'room_joined'); observer.emit('join_room', { roomId: room.id, playerName: 'observer', password: '' }); await joined;
    const association = { schemaVersion: 1, record: record(), librarySpellId: null };
    const template = { creatureId: 'same-library-id', name: 'Disposable creature', stats: { maxHp: 30, maxMana: 10, maxAP: 4 }, authoredAbility: association,
      state: { currentHp: 20, currentMana: 10, currentActionPoints: 4, tempHealth: 2, tempMana: 2, tempActionPoints: 1, conditions: [] } };
    for (const id of ['source', 'target', 'sibling']) {
      room.gameState.maps.default.tokens[id] = { ...actors.clone(template), id };
      const r = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: id }, snapshotHash: actors.hash(room.gameState.maps.default.tokens[id]) }); assert.equal(r.success, true, JSON.stringify(r));
      if (id === 'source') source = r.ref; else if (id === 'target') target = r.ref; else sibling = r.ref;
    }
  });
  afterEach(async() => { gm.disconnect(); observer.disconnect(); await server.stop(); });
  const token = ref => actors.locate(room, ref).token;
  const admission = (ref = source, version = 1) => ({ roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(room).revision, source: ref, expectedSourceRevision: token(ref).state.actorContract.revision, definitionVersion: version });
  async function admit(ref = source, version = 1) { const request = admission(ref, version), r = await ack(gm, 'actor_authored_admit', request); assert.equal(r.success, true, JSON.stringify(r)); return { request, result: r }; }
  function attempt(ref = source, to = target, mode = 'physical') {
    const grant = token(ref).state.actorContract.authoredAdmission;
    const entry = installed.lookup(room, { definitionId: pure.actionId(grant.definitionRef) });
    const reading = pure.readFormula(entry.canonicalDefinition.effect.formula);
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, source: ref, target: to,
      sourceAuthority: { admissionId: grant.requestId, associationHash: grant.associationHash, gmUid: grant.gmUid },
      spell: { definitionId: pure.actionId(entry.definitionRef), definitionHash: `${pure.CAPABILITY}/${entry.definitionRef.definitionHash}`, name: entry.canonicalDefinition.name, kind: entry.descriptor.effect.kind, damageTypes: entry.descriptor.effect.damageTypes },
      price: entry.descriptor.price, classPayment: null, roll: { mode, dice: [{ sides: reading.dice[0].sides, faces: [4] }], constant: reading.constant, total: 4 + reading.constant, reading: reading.reading } };
  }
  async function prepare(a) { const r = await ack(gm, 'actor_spell_prepare_creature', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); return r.contentHash; }
  function command(a, contentHash = actors.hash(a), amount = a.roll.total) {
    const pools = actors.resources(token(a.source), 'creature'), hp = actors.resources(token(a.target), 'creature').hp, payment = {};
    for (const p of ['ap', 'mana']) if (a.price[p] > 0) payment[p] = payments.tempFirst(pools[p].current, pools[p].temp, a.price[p]);
    if (!Object.keys(payment).length) payment.ap = payments.tempFirst(pools.ap.current, pools.ap.temp, 0);
    return { version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, source: a.source, target: a.target,
      approval: { approvalId: a.approvalId, contentHash }, actors: [{ ref: a.source, expectedRevision: token(a.source).state.actorContract.revision, finalResources: payment },
        { ref: a.target, expectedRevision: token(a.target).state.actorContract.revision, finalResources: { hp: a.spell.kind === 'damage' ? { current: Math.max(0, hp.current - Math.max(0, amount - hp.temp)), temp: Math.max(0, hp.temp - amount) } : { current: Math.min(hp.max, hp.current + amount), temp: hp.temp } } }],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, finalAmount: amount, adjustmentReason: amount === a.roll.total ? '' : 'Explicit GM adjustment', chosenResult: JSON.stringify({ capability: pure.CAPABILITY, approvalId: a.approvalId, kind: a.spell.kind, roll: a.roll, gmConfirmed: true }) } };
  }
  async function refused(event, data, code, socket = gm) { const before = actors.clone(room.gameState), r = await ack(socket, event, data); assert.equal(r.success, false, JSON.stringify(r)); if (code) assert.equal(r.code, code); assert.deepEqual(room.gameState, before); return r; }
  it('physical damage, temp-first exact payment, one atomic receipt, duplicate and conflicting command bytes', async() => {
    await admit(); const a = attempt(), before = actors.clone(room.gameState); await prepare(a); assert.deepEqual(room.gameState, before);
    const c = command(a), r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true, JSON.stringify(r));
    assert.equal(r.receipt.authorization.kind, 'gm-creature-ability'); assert.equal(token(source).state.currentActionPoints, 4); assert.equal(token(source).state.tempActionPoints, 0); assert.equal(token(source).state.currentMana, 9); assert.equal(token(source).state.tempMana, 0); assert.equal(token(target).state.currentHp, 16); assert.equal(token(target).state.tempHealth, 0);
    assert.deepEqual(JSON.parse(r.receipt.adjudication.chosenResult).roll, a.roll); assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, r.receipt);
    await refused('actor_consequence', { ...c, adjudication: { ...c.adjudication, finalAmount: 0 } }, 'command_id_conflict');
  });
  it('digital healing caps HP; zero price stays zero and explicit final0 pays authored nonbasic price', async() => {
    token(source).authoredAbility.record = record('healing', 0, 0); await admit(); const a = attempt(source, target, 'digital'); await prepare(a);
    assert.equal((await ack(gm, 'actor_consequence', command(a, actors.hash(a), 100))).success, true); assert.equal(token(target).state.currentHp, 30); assert.equal(token(target).state.tempHealth, 2); assert.equal(token(source).state.currentActionPoints, 4);
    token(source).authoredAbility.record = record('damage', 3, 0); await admit(); const b = attempt(); await prepare(b); const hp = token(target).state.currentHp;
    assert.equal((await ack(gm, 'actor_consequence', command(b, actors.hash(b), 0))).success, true); assert.equal(token(source).state.currentActionPoints, 2); assert.equal(token(target).state.currentHp, hp);
  });
  it('same template/definition instances need separate exact admission and pay only their own pools', async() => {
    await admit(); const a = attempt(); a.source = sibling; await refused('actor_spell_prepare_creature', a, 'creature_admission_changed');
    await admit(sibling); assert.equal(installed.list(room).entries.length, 1); const b = attempt(sibling); await prepare(b); assert.equal((await ack(gm, 'actor_consequence', command(b))).success, true); assert.equal(token(source).state.tempActionPoints, 1); assert.equal(token(sibling).state.tempActionPoints, 0);
  });
  it('admission request UUIDs bind exact bytes across matching sources and survive consequences/checkpoints', async() => {
    const first = await admit(); assert.equal((await ack(gm, 'actor_authored_admit', first.request)).success, true);
    await refused('actor_authored_admit', { ...admission(sibling), requestId: first.request.requestId }, 'REQUEST_ID_CONFLICT');
    const second = await admit(sibling); const a = attempt(); await prepare(a); assert.equal((await ack(gm, 'actor_consequence', command(a))).success, true);
    await refused('actor_authored_admit', { ...admission(target), requestId: second.request.requestId }, 'REQUEST_ID_CONFLICT');
    assert.equal(actors.ledger(room).authoredSourceAdmissions.length, 2);
  });
  it('insufficient and missing mana pools, explicit0 mana, invalid maxima/bounds refuse without creating pools', async() => {
    await admit(); const a = attempt(); token(source).state.currentMana = 0; token(source).state.tempMana = 0; await refused('actor_spell_prepare_creature', a, 'insufficient_resources');
    delete token(source).state.currentMana; await refused('actor_spell_prepare_creature', a, 'invalid_resources');
    token(source).authoredAbility.record = record('damage', 0, 0); await admit(); const b = attempt(); await prepare(b); const c = command(b); token(target).state.currentHp = 31; await refused('actor_consequence', c, 'invalid_resources');
  });
  it('association mismatch and immutable v1/v2 do not redirect a retained attempt; explicit readmission invalidates old grant', async() => {
    await admit(); const a = attempt(); await prepare(a); const c = command(a), v1 = actors.clone(installed.list(room).entries[0]);
    const changed = token(source).authoredAbility.record; changed.name = changed.authoredDraft.name = 'Changed whole definition';
    await refused('actor_consequence', c, 'creature_admission_changed'); await admit(source, 2); assert.deepEqual(installed.list(room).entries[0], v1);
    await refused('actor_consequence', c, 'creature_admission_changed');
  });
  it('revocation after prepare blocks install, but exact accepted history survives later revocation/deletion', async() => {
    await admit(); const a = attempt(); await prepare(a); const c = command(a); const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true);
    const b = attempt(); await prepare(b); const stale = command(b), ref = token(source).state.actorContract.authoredAdmission.definitionRef;
    assert.equal((await ack(gm, 'actor_authored_revoke', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(room).revision, definitionRef: ref })).success, true);
    await refused('actor_consequence', stale, 'definition_revoked'); delete room.gameState.maps.default.tokens.source;
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, r.receipt); assert.deepEqual((await ack(gm, 'actor_spell_prepare_creature', a)).receipt, r.receipt);
  });
  it('nonGM, foreign source authority and original PC-only handler refuse; replaced GM cannot consume', async() => {
    await admit(); const a = attempt(); await refused('actor_spell_prepare_creature', a, 'forbidden', observer); await refused('actor_spell_approve', a);
    const wrong = actors.clone(a); wrong.sourceAuthority.gmUid = 'foreign'; await refused('actor_spell_prepare_creature', wrong, 'forbidden');
    await prepare(a); const c = command(a), prior = room.gmId; room.gmId = 'replacement'; await refused('actor_consequence', c); room.gmId = prior;
  });
  it('creature admission never uses its compiler syntax anchor to implicitly grant a PC execution route', async() => {
    await admit(); const a = attempt(); assert.equal(installed.lookup(room, a.spell).creatureOnly, true);
    server.setCharacterOwner('gm-character', gmUid);
    const pc = { id: 'gm-pc', ownerUserId: gmUid, character: { id: 'gm-character', class: 'Arcanoneer', health: { current: 10, max: 10 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 } }, state: { conditions: [] } };
    room.gameState.maps.default.characterTokens[pc.id] = pc;
    const bound = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: pc.id, ownerUid: gmUid, characterId: pc.character.id }, snapshotHash: actors.hash(pc) }); assert.equal(bound.success, true);
    delete a.sourceAuthority; a.source = bound.ref; await refused('actor_spell_approve', a, 'unsupported_source_route');
  });
  it('exact token/map/incarnation, deletion/recreation and PC-shaped substitute refuse', async() => {
    await admit(); const a = attempt(); await prepare(a); const c = command(a), original = actors.clone(token(source));
    token(source).state.actorContract.instanceId = uuid(); await refused('actor_consequence', c, 'actor_binding_conflict'); room.gameState.maps.default.tokens.source = original;
    delete room.gameState.maps.default.tokens.target; await refused('actor_consequence', c, 'actor_not_found');
    room.gameState.maps.default.tokens.target = { ...actors.clone(original), id: 'target' }; room.gameState.maps.default.tokens.target.state.actorContract = { ...original.state.actorContract, tokenId: 'target', instanceId: uuid() }; await refused('actor_consequence', c, 'actor_binding_conflict');
    token(source).character = { id: 'fake-pc' }; await refused('actor_spell_prepare_creature', { ...a, approvalId: uuid() }, 'creature_source_required');
  });
  it('Stunned before preparation and during asynchronous consequence keeps faces; explicit refreshed command succeeds', async() => {
    await admit(); const a = attempt(), stunned = profile.makeStunnedRecord(source, uuid(), { sourceOccurrence: 'a4-test', timing: 'manual' });
    token(source).state.conditions.push(stunned); await refused('actor_spell_prepare_creature', a, 'actor_stunned'); token(source).state.conditions = []; await prepare(a); const c = command(a);
    const original = server.authorityService.assertCurrent; let enter, release; const entered = new Promise(r => { enter = r; }), gate = new Promise(r => { release = r; });
    server.authorityService.assertCurrent = async(...args) => { enter(); await gate; return original(...args); };
    const pending = ack(gm, 'actor_consequence', c); await entered; token(source).state.conditions.push(stunned); token(source).state.actorContract.revision++; const before = actors.clone(room.gameState); release(); assert.equal((await pending).code, 'actor_stunned'); assert.deepEqual(room.gameState, before); server.authorityService.assertCurrent = original;
    token(source).state.conditions = []; token(source).state.actorContract.revision++; assert.equal((await ack(gm, 'actor_consequence', command(a))).success, true); assert.deepEqual(JSON.parse(actors.ledger(room).receipts.at(-1).adjudication.chosenResult).roll, a.roll);
  });
  it('Stunned during preparation authority await installs no attempt', async() => {
    await admit(); const a = attempt(), original = server.authorityService.assertCurrent; let enter, release; const entered = new Promise(r => { enter = r; }), gate = new Promise(r => { release = r; });
    server.authorityService.assertCurrent = async(...args) => { enter(); await gate; return original(...args); };
    const pending = ack(gm, 'actor_spell_prepare_creature', a); await entered; token(source).state.conditions.push(profile.makeStunnedRecord(source, uuid(), { sourceOccurrence: 'async-prepare', timing: 'manual' })); const before = actors.clone(room.gameState); release(); assert.equal((await pending).code, 'actor_stunned'); assert.deepEqual(room.gameState, before); assert.equal(payments.get(room, a.approvalId), null); server.authorityService.assertCurrent = original;
  });
  it('pending explicit revalidation repeats Stunned, source-admission and post-await authority checks', async() => {
    await admit(); const a = attempt(); await prepare(a);
    token(source).state.conditions.push(profile.makeStunnedRecord(source, uuid(), { sourceOccurrence: 'pending-revalidate', timing: 'manual' })); await refused('actor_spell_prepare_creature', a, 'actor_stunned');
    token(source).state.conditions = []; await admit(); await refused('actor_spell_prepare_creature', a, 'creature_admission_changed');
  });
  it('revocation during preparation awaits refuses without partial state', async() => {
    await admit(); const a = attempt(), original = server.authorityService.assertCurrent; let enter, release, held = true;
    const entered = new Promise(r => { enter = r; }), gate = new Promise(r => { release = r; });
    server.authorityService.assertCurrent = async(...args) => { if (held) { held = false; enter(); await gate; } return original(...args); };
    const pending = ack(gm, 'actor_spell_prepare_creature', a); await entered;
    const ref = token(source).state.actorContract.authoredAdmission.definitionRef;
    await ack(gm, 'actor_authored_revoke', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(room).revision, definitionRef: ref }); const before = actors.clone(room.gameState); release(); assert.equal((await pending).code, 'definition_revoked'); assert.deepEqual(room.gameState, before); server.authorityService.assertCurrent = original;
  });
  it('same withdrawal bytes recover positive closure after lost ACK; changed bytes refuse', async() => {
    await admit(); const a = attempt(); await prepare(a); const data = { roomId: room.id, approvalId: a.approvalId, approval: a };
    const first = await ack(gm, 'actor_spell_withdraw', data); assert.equal(first.code, 'withdrawn'); assert.equal(first.success, true);
    assert.deepEqual(await ack(gm, 'actor_spell_withdraw', data), { ...first, contentHash: actors.hash(a) });
    await refused('actor_spell_withdraw', { ...data, approval: { ...a, roll: { ...a.roll, mode: 'digital' } } }, 'command_id_conflict');
  });
  it('cross-route request collision is checked again after asynchronous PC registry planning', async() => {
    await admit(); const id = uuid(), original = server.authorityService.assertCurrent; let enter, release, held = true;
    const entered = new Promise(r => { enter = r; }), gate = new Promise(r => { release = r; });
    server.authorityService.assertCurrent = async(...args) => { if (held) { held = false; enter(); await gate; } return original(...args); };
    const pending = ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: id, expectedRegistryRevision: installed.registry(room).revision, record: record(), classId: 'arcanoneer', definitionVersion: 1 }); await entered;
    assert.equal((await ack(gm, 'actor_authored_admit', { ...admission(sibling), requestId: id })).success, true); const before = actors.clone(room.gameState); release(); assert.equal((await pending).code, 'REQUEST_ID_CONFLICT'); assert.deepEqual(room.gameState, before); server.authorityService.assertCurrent = original;
  });
  it('real placement captures detached content, GM private lookup and finite display stats without public drafts or armor', async() => {
    const creature = { id: 'disposable-template', name: 'Placed witness', stats: { maxHp: 20, maxMana: 0, maxAP: 4, damageReduction: 0, armor: 999, private: 'secret' }, authoredAbility: { schemaVersion: 1, record: record(), librarySpellId: null } };
    const result = await ack(gm, 'token_created', { roomId: room.id, mapId: 'default', token: { id: 'real-placement', creatureId: creature.id, state: { currentHp: 20, currentMana: 0, currentActionPoints: 4 } }, creature, position: { x: 15, y: 20 } }); assert.equal(result.success, true);
    const placed = room.gameState.maps.default.tokens['real-placement']; assert.deepEqual(placed.authoredAbility, creature.authoredAbility); creature.authoredAbility.record.name = 'input mutated'; assert.notEqual(placed.authoredAbility.record.name, creature.authoredAbility.record.name);
    const projected = require('../services/roomAccessService').projectTokenForClient(placed); assert.equal(projected.authoredAbility, undefined); assert.equal(projected.stats.damageReduction, 0); assert.equal(projected.stats.armor, undefined); assert.equal(projected.stats.private, undefined);
    const bound = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: placed.id }, snapshotHash: actors.hash(placed) }); assert.equal(bound.success, true);
    assert.deepEqual((await ack(gm, 'actor_authored_list', { roomId: room.id })).creatureSources.find(e => e.source.tokenId === placed.id).association, placed.authoredAbility); assert.equal((await ack(observer, 'actor_authored_list', { roomId: room.id })).creatureSources, undefined);
  });
  it('replaced current GM during preparation await refuses without registering an attempt', async() => {
    await admit(); const a = attempt(), original = server.authorityService.assertCurrent; let enter, release;
    const entered = new Promise(r => { enter = r; }), gate = new Promise(r => { release = r; });
    server.authorityService.assertCurrent = async(...args) => { enter(); await gate; return original(...args); };
    const pending = ack(gm, 'actor_spell_prepare_creature', a); await entered; const oldSocket = room.gm.socketId; room.gm.socketId = observer.id; const before = actors.clone(room.gameState); release(); assert.equal((await pending).success, false); assert.deepEqual(room.gameState, before); assert.equal(payments.get(room, a.approvalId), null); room.gm.socketId = oldSocket; server.authorityService.assertCurrent = original;
  });
  it('stale CAS, competing spend and writer refusal leave unconsumed attempts and no partial install', async() => {
    await admit(); const a = attempt(); await prepare(a); const c = command(a); token(target).state.actorContract.revision++; await refused('actor_consequence', c, 'stale_actor_revision');
    const fresh = command(a), original = writer.admitConsequence; room.isPermanent = true; writer.admitConsequence = () => ({ queued: false, code: 'test_writer_refusal' }); await refused('actor_consequence', fresh, 'test_writer_refusal'); assert.ok(payments.get(room, a.approvalId));
    const req = admission(sibling); await refused('actor_authored_admit', req, 'test_writer_refusal'); writer.admitConsequence = original;
    token(source).state.currentMana = 0; token(source).state.tempMana = 0; await refused('actor_consequence', fresh, 'insufficient_resources');
  });
  it('lost ACK exact receipt/checkpoint/new epoch recovery, import quarantine and old unknown refusal', async() => {
    await admit(); const a = attempt(); await prepare(a); const c = command(a); gm.emit('actor_consequence', c); await new Promise(r => setTimeout(r, 100));
    const accepted = await ack(gm, 'actor_consequence', c); assert.equal(accepted.success, true); assert.equal(actors.ledger(room).receipts.length, 1);
    const codec = require('../services/roomCheckpoint'), built = codec.buildCheckpointDocuments({ roomId: room.id, gameState: room.gameState, revision: 1 });
    const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])) }); assert.equal(decoded.ok, true);
    const imported = actors.clone(room.gameState); actors.preserveImportedActorMetadata(imported); assert.equal(imported.maps.default.tokens.source.state.actorContract, undefined);
    room = { ...room, gameState: { ...decoded.global, maps: decoded.maps, ...codec.deriveRootMirrors(decoded.maps) }, checkpointRevision: 1 }; server.rooms.set(room.id, room);
    assert.notEqual(actors.epoch(room), a.actionEpoch); assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, accepted.receipt);
    await refused('actor_spell_prepare_creature', { ...a, approvalId: uuid() }, 'outcome_unknown');
  });
  it('unsupported PC/self targets, range0 and complex whole effects cannot launch partial actions', async() => {
    await admit(); const a = attempt(); a.target = source; await refused('actor_spell_prepare_creature', a, 'unsupported_creature_target');
    a.target = { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', instanceId: uuid(), ownerUid: gmUid, characterId: 'c' }; await refused('actor_spell_prepare_creature', a, 'unsupported_creature_target');
    token(source).authoredAbility.record = record('healing', 0, 0, 0); await admit(); await refused('actor_spell_prepare_creature', attempt(), 'distinct_target_range_required');
    token(source).authoredAbility.record.authoredDraft.effectTypes.push('debuff'); await refused('actor_authored_admit', admission(source, 2), 'unsupported_wizard_record');
  });
});
