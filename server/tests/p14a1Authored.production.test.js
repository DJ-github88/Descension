const assert = require('assert/strict');
const crypto = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const definitions = require('../services/authoredSpellDefinitions');
const installed = require('../services/installedAuthoredAbilities');
const pure = require('../../vtt-react/src/services/authoredAbility');
const profile = require('../../vtt-react/src/services/sharedConditionProfile');
const uuid = () => crypto.randomUUID();
const ack = (s, event, data) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error(event)), 5000); s.emit(event, data, r => { clearTimeout(t); resolve(r); }); });
const once = (s, event) => new Promise(resolve => s.once(event, resolve));

// Shape mirrors normal Review output; the independent App witness must use the actual Wizard producer.
function record(kind = 'damage', name = 'Ink Lance', ap = 1, mana = 3, range = 30) {
  const d = { name, description: 'A newly authored bounded ability.', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE', school: 'arcane' }, effectTypes: [kind],
    targetingMode: 'unified', targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: range, maxTargets: 1, targetRestrictions: ['any'] },
    resourceCost: { actionPoints: ap, resourceTypes: ['mana'], resourceValues: { mana } },
    [kind === 'damage' ? 'damageConfig' : 'healingConfig']: kind === 'damage' ? { damageType: 'direct', elementType: 'arcane', formula: '1d6+2', resolution: 'DICE' } : { healingType: 'direct', formula: '1d8+1', resolution: 'DICE' } };
  return { ...actors.clone(d), authoredDefinitionId: uuid(), authoredDraft: actors.clone(d) };
}

describe('P14-A1 Wizard admitted ability production stack', function() {
  this.timeout(15000);
  let server, room, gm, owner, observer, pc, foe, uid, writer;
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer }); await server.start();
    for (const e of ['actor_bind', 'actor_consequence', 'actor_snapshot', 'actor_spell_approve', 'actor_authored_admit', 'actor_authored_revoke', 'actor_authored_list']) server.setEventLimits(e, { maxPerMinute: 2000, maxPerSecond: 2000 });
    const gmUid = server.nextUserId(); uid = server.nextUserId(); const observerUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid); server.registerAuthToken('owner', uid); server.registerAuthToken('observer', observerUid);
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: gmUid });
    for (const role of ['owner', 'observer']) {
      const s = server.connect({ token: role }); await once(s, 'connect'); const joined = once(s, 'room_joined'); s.emit('join_room', { roomId: room.id, playerName: role, password: '' }); await joined;
      if (role === 'owner') owner = s; else observer = s;
    }
    server.setCharacterOwner('c', uid);
    const map = room.gameState.maps.default;
    map.tokens.foe = { id: 'foe', stats: { maxHp: 30, maxMana: 0, maxAP: 4 }, state: { currentHp: 20, currentMana: 0, currentActionPoints: 4, tempHealth: 2, conditions: [] } };
    map.characterTokens.pc = { id: 'pc', ownerUserId: uid, character: { id: 'c', class: 'Arcanoneer', health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, tempMana: 2, tempActionPoints: 1 }, state: { conditions: [] } };
    pc = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid: uid, characterId: 'c' }, snapshotHash: actors.hash(map.characterTokens.pc) })).ref;
    foe = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'foe' }, snapshotHash: actors.hash(map.tokens.foe) })).ref;
    assert.ok(pc && foe);
  });
  afterEach(async() => { gm.disconnect(); owner.disconnect(); observer.disconnect(); await server.stop(); });
  const token = ref => actors.locate(room, ref).token;
  const request = r => ({ roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(room).revision, record: r, definitionVersion: 1, classId: 'arcanoneer' });
  async function admit(r = record()) { const req = request(r), result = await ack(gm, 'actor_authored_admit', req); assert.equal(result.success, true, JSON.stringify(result)); return { r, req, ref: result.definitionRef }; }
  function approval(ref, target = foe, mode = 'physical') {
    const e = installed.list(room).entries.find(e => pure.actionId(e.definitionRef) === pure.actionId(ref));
    const roll = pure.readFormula(e.canonicalDefinition.effect.formula), faces = [4];
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence,
      source: pc, target, spell: { definitionId: pure.actionId(ref), definitionHash: `${pure.CAPABILITY}/${ref.definitionHash}`, name: e.canonicalDefinition.name, kind: e.descriptor.effect.kind, damageTypes: e.descriptor.effect.damageTypes },
      roll: { mode, dice: [{ sides: roll.dice[0].sides, faces }], constant: roll.constant, total: 4 + roll.constant, reading: roll.reading }, price: e.descriptor.price, classPayment: null };
  }
  const approve = async a => { const r = await ack(owner, 'actor_spell_approve', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); return r.contentHash; };
  function command(a, contentHash, amount = a.roll.total) {
    const source = actors.resources(token(pc), 'character'), target = actors.resources(token(a.target), a.target.kind);
    const pay = {};
    for (const p of ['ap', 'mana']) if (a.price[p]) { const used = Math.min(source[p].temp, a.price[p]); pay[p] = { current: source[p].current - a.price[p] + used, temp: source[p].temp - used }; }
    const hp = a.spell.kind === 'damage' ? { current: Math.max(0, target.hp.current - Math.max(0, amount - target.hp.temp)), temp: Math.max(0, target.hp.temp - amount) } : { current: Math.min(target.hp.max, target.hp.current + amount), temp: target.hp.temp };
    const self = actors.hash(pc) === actors.hash(a.target);
    if (!self && !Object.keys(pay).length) pay.ap = { current: source.ap.current, temp: source.ap.temp };
    return { version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(room), baseCommitSequence: actors.ledger(room).commitSequence, source: pc, target: a.target,
      approval: { approvalId: a.approvalId, contentHash }, actors: [{ ref: pc, expectedRevision: token(pc).state.actorContract.revision, finalResources: self ? { ...pay, hp } : pay }, ...self ? [] : [{ ref: a.target, expectedRevision: token(a.target).state.actorContract.revision, finalResources: { hp } }]],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, chosenResult: JSON.stringify({ capability: pure.CAPABILITY, approvalId: a.approvalId, kind: a.spell.kind, roll: a.roll, gmConfirmed: true }), finalAmount: amount, adjustmentReason: amount === a.roll.total ? '' : 'GM mitigation' } };
  }
  it('two distinct authored definitions share approvals/P7; zero AP/range and exact physical/digital faces, temp-first payment, healing caps and no pre-spend', async() => {
    const d = await admit(), h = await admit(record('healing', 'Quiet Mending', 0, 0, 0));
    const a = approval(d.ref), before = actors.clone(room.gameState.maps); const hash = await approve(a);
    assert.deepEqual(room.gameState.maps, before);
    const c = command(a, hash), result = await ack(gm, 'actor_consequence', c); assert.equal(result.success, true, JSON.stringify(result));
    assert.equal(token(pc).character.actionPoints.current, 4); assert.equal(token(pc).character.tempActionPoints, 0); assert.equal(token(pc).character.mana.current, 9); assert.equal(token(pc).character.tempMana, 0); assert.equal(token(foe).state.currentHp, 16); assert.equal(token(foe).state.tempHealth, 0);
    assert.deepEqual(JSON.parse(result.receipt.adjudication.chosenResult).roll, a.roll);
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, result.receipt);
    assert.deepEqual((await ack(owner, 'actor_spell_approve', a)).receipt, result.receipt);
    const heal = approval(h.ref, pc, 'digital'), healHash = await approve(heal), healed = await ack(gm, 'actor_consequence', command(heal, healHash, 100));
    assert.equal(healed.success, true, JSON.stringify(healed)); assert.equal(token(pc).character.health.current, 30); assert.equal(token(pc).character.actionPoints.current, 4);
    assert.equal(installed.lookup(room, heal.spell).descriptor.targeting.rangeFeet, 0);
    const remoteFree = approval(h.ref, foe), free = await ack(gm, 'actor_consequence', command(remoteFree, await approve(remoteFree)));
    assert.equal(free.success, true, JSON.stringify(free)); assert.equal(token(foe).state.currentHp, 21); assert.equal(token(pc).character.actionPoints.current, 4);
  });
  it('unsupported/missing/null/zero/conflicting draft values remain unchanged/manual and never install a partial definition', async() => {
    for (const alter of [r => { r.authoredDraft.effectTypes.push('debuff'); }, r => { delete r.authoredDraft.resourceCost.resourceValues.mana; }, r => { r.authoredDraft.targetingConfig.rangeDistance = null; }, r => { r.authoredDraft.targetingConfig.maxTargets = 0; }, r => { r.authoredDraft.propagation = { method: 'chain' }; }, r => { r.resourceCost.actionPoints = 2; }, r => { r.authoredDraft.damageConfig.formula = 'process.exit()'; }]) {
      const r = record(); alter(r); const before = actors.clone(r), state = actors.clone(room.gameState);
      assert.equal((await ack(gm, 'actor_authored_admit', request(r))).success, false); assert.deepEqual(r, before); assert.deepEqual(room.gameState, state);
    }
  });
  it('unauthorized admission/revocation/use refuse; private pending consent never appears to observer', async() => {
    assert.equal((await ack(owner, 'actor_authored_admit', request(record()))).success, false);
    const d = await admit(), a = approval(d.ref);
    assert.equal((await ack(observer, 'actor_spell_approve', a)).code, 'forbidden'); await approve(a);
    assert.deepEqual((await ack(observer, 'actor_spell_list', { roomId: room.id })).pending, []);
    const revoke = { roomId: room.id, requestId: uuid(), expectedRegistryRevision: 1, definitionRef: d.ref };
    assert.equal((await ack(owner, 'actor_authored_revoke', revoke)).code, 'forbidden');
    assert.equal((await ack(owner, 'actor_consequence', command(a, actors.hash(a)))).success, false);
    assert.equal(require('../services/roomAccessService').projectGameStateForClient(room.gameState).authoredSpellRegistry, undefined);
  });
  it('revocation refuses pending execution, does not rewrite an accepted receipt; new versions have new consent identity', async() => {
    const d = await admit(), a = approval(d.ref), hash = await approve(a), c = command(a, hash);
    assert.equal((await ack(gm, 'actor_authored_revoke', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: 1, definitionRef: d.ref })).success, true);
    const before = actors.clone(room.gameState); assert.equal((await ack(gm, 'actor_consequence', c)).code, 'definition_revoked'); assert.deepEqual(room.gameState, before);
    const r = actors.clone(d.r); r.name = r.authoredDraft.name = 'Ink Lance revised'; const req = request(r); req.definitionVersion = 2;
    const next = await ack(gm, 'actor_authored_admit', req); assert.equal(next.success, true, JSON.stringify(next));
    await ack(owner, 'actor_spell_withdraw', { roomId: room.id, approvalId: a.approvalId });
    const a2 = approval(next.definitionRef), result = await ack(gm, 'actor_consequence', command(a2, await approve(a2))); assert.equal(result.success, true);
    await ack(gm, 'actor_authored_revoke', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: 3, definitionRef: next.definitionRef });
    assert.deepEqual((await ack(owner, 'actor_spell_approve', a2)).receipt, result.receipt);
  });
  it('canonical Stunned and insufficient resources refuse without payment or receipt', async() => {
    const d = await admit(record('damage', 'Too Costly', 20, 10000)), a = approval(d.ref), before = actors.clone(room.gameState);
    assert.equal((await ack(owner, 'actor_spell_approve', a)).code, 'insufficient_resources'); assert.deepEqual(room.gameState, before);
    const affordable = await admit(record('healing', 'Kind Thread', 0, 0)), b = approval(affordable.ref); token(pc).state.conditions.push(profile.makeStunnedRecord(pc, uuid(), { sourceOccurrence: 'manual-a1', timing: 'manual' }));
    assert.equal((await ack(owner, 'actor_spell_approve', b)).code, 'actor_stunned');
    token(pc).state.conditions = []; const bh = await approve(b), c = command(b, bh);
    token(pc).state.conditions.push(profile.makeStunnedRecord(pc, uuid(), { sourceOccurrence: 'stunned-after-consent', timing: 'manual' }));
    const state = actors.clone(room.gameState); assert.equal((await ack(gm, 'actor_consequence', c)).code, 'actor_stunned'); assert.deepEqual(room.gameState, state);
  });
  it('stale/recreated actors refuse; refreshed GM command keeps original faces and exact consent', async() => {
    const d = await admit(), a = approval(d.ref), hash = await approve(a), c = command(a, hash);
    token(foe).state.actorContract.revision++; assert.equal((await ack(gm, 'actor_consequence', c)).code, 'stale_actor_revision');
    const fresh = command(a, hash); assert.equal((await ack(gm, 'actor_consequence', fresh)).success, true);
    assert.deepEqual(JSON.parse(actors.ledger(room).receipts.at(-1).adjudication.chosenResult).roll, a.roll);
    const b = approval(d.ref), bh = await approve(b), stale = command(b, bh); token(foe).state.actorContract.instanceId = uuid();
    assert.equal((await ack(gm, 'actor_consequence', stale)).success, false);
  });
  it('simultaneous confirmations cannot double-spend; writer refusal retains unconsumed approval and installs nothing', async() => {
    const d = await admit(), a = approval(d.ref), hash = await approve(a), one = command(a, hash), two = command(a, hash);
    const results = await Promise.all([ack(gm, 'actor_consequence', one), ack(gm, 'actor_consequence', two)]); assert.equal(results.filter(r => r.success).length, 1);
    const b = approval(d.ref), bh = await approve(b), c = command(b, bh), before = actors.clone(room.gameState);
    room.isPermanent = true; const original = writer.admitConsequence; writer.admitConsequence = () => ({ queued: false, code: 'test_writer_refusal' });
    assert.equal((await ack(gm, 'actor_consequence', c)).code, 'test_writer_refusal'); assert.deepEqual(room.gameState, before); assert.ok(require('../services/spellPayments').get(room, b.approvalId));
    const req = request(record('healing', 'Not Installed')); assert.equal((await ack(gm, 'actor_authored_admit', req)).code, 'test_writer_refusal'); assert.deepEqual(room.gameState, before); writer.admitConsequence = original;
  });
  it('registry codec/checkpoint reconstruction retains identity/revocation; imported metadata never grants authority and old-epoch unknown approvals refuse', async() => {
    const d = await admit(), a = approval(d.ref), c = command(a, await approve(a)), accepted = await ack(gm, 'actor_consequence', c); assert.equal(accepted.success, true);
    const encoded = definitions.encodeRegistry(installed.registry(room)); assert.equal(encoded.ok, true);
    const codec = require('../services/roomCheckpoint'), built = codec.buildCheckpointDocuments({ roomId: room.id, gameState: room.gameState, revision: 1 });
    const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])) }); assert.equal(decoded.ok, true);
    const restored = { ...room, gameState: { ...decoded.global, maps: decoded.maps, ...codec.deriveRootMirrors(decoded.maps) }, checkpointRevision: 1 }; assert.deepEqual(installed.list(restored), installed.list(room));
    assert.notEqual(actors.epoch(restored), a.actionEpoch); assert.equal(definitions.decodeRegistry(encoded.json).ok, true);
    const imported = actors.clone(room.gameState); actors.preserveImportedActorMetadata(imported); assert.equal(imported.authoredSpellRegistry, undefined); assert.ok(imported.actorConsequenceRecovery.importedAuthoredSpellRegistry);
    room = restored; server.rooms.set(room.id, room);
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, accepted.receipt);
    const unknown = actors.clone(a); unknown.approvalId = uuid(); assert.equal((await ack(owner, 'actor_spell_approve', unknown)).code, 'outcome_unknown');
    assert.equal(actors.authorityMetadataPath({ nested: { authoredSpellRegistry: installed.registry(room) } }), 'nested.authoredSpellRegistry');
  });
  it('changed/revoked definitions and lost GM authority during asynchronous checks refuse with no partial transition', async() => {
    const d = await admit(), a = approval(d.ref), c = command(a, await approve(a));
    const original = server.authorityService.assertCurrent; let release, reached, hold = true;
    const gate = new Promise(r => { release = r; }), entered = new Promise(r => { reached = r; });
    server.authorityService.assertCurrent = async(...args) => { if (hold) { hold = false; reached(); await gate; } return original(...args); };
    const pending = ack(gm, 'actor_consequence', c); await entered;
    assert.equal((await ack(gm, 'actor_authored_revoke', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: 1, definitionRef: d.ref })).success, true);
    const before = actors.clone(room.gameState); release(); assert.equal((await pending).code, 'definition_revoked'); assert.deepEqual(room.gameState, before);
    server.authorityService.assertCurrent = original;
    const r = record(); const req = request(r); hold = true;
    let release2, reached2; const gate2 = new Promise(r => { release2 = r; }), entered2 = new Promise(r => { reached2 = r; });
    server.authorityService.assertCurrent = async(...args) => { if (hold) { hold = false; reached2(); await gate2; } return original(...args); };
    const admission = ack(gm, 'actor_authored_admit', req); await entered2; const player = server.players.get(gm.id); player.isGM = false; release2();
    assert.equal((await admission).success, false); assert.deepEqual(room.gameState, before); player.isGM = true; server.authorityService.assertCurrent = original;
  });
  it('deleted/recreated source and corrupted installed definition cannot consume approval or mutate pools', async() => {
    const d = await admit(), a = approval(d.ref), c = command(a, await approve(a)), map = room.gameState.maps.default;
    const original = actors.clone(map.characterTokens.pc); delete map.characterTokens.pc;
    assert.equal((await ack(gm, 'actor_consequence', c)).success, false); assert.ok(require('../services/spellPayments').get(room, a.approvalId));
    map.characterTokens.pc = actors.clone(original); map.characterTokens.pc.state.actorContract.instanceId = uuid();
    assert.equal((await ack(gm, 'actor_consequence', c)).success, false); assert.deepEqual(map.characterTokens.pc.character, original.character);
    map.characterTokens.pc = original;
    room.gameState.authoredSpellRegistry.definitions[0].canonicalDefinition.resourceCost.mana = 0;
    const before = actors.clone(room.gameState); assert.equal((await ack(gm, 'actor_consequence', c)).code, 'invalid_authored_registry'); assert.deepEqual(room.gameState, before);
  });
});
module.exports = { record };
