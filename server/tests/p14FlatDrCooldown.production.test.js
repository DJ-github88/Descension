/** Positive flat DR + the installed cooldown. Real registered handlers; disposable Wizard definitions. */
const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const installed = require('../services/installedAuthoredAbilities');
const registry = require('../services/installedDefinitionRegistry');
const payments = require('../services/spellPayments');
const pure = require('../shared/services/authoredAbility');
const effect = require('../shared/services/authoredEffect');
const profile = require('../shared/services/sharedConditionProfile');
const cooldown = require('../shared/services/authoredCooldown');
const once = (s, e) => new Promise(r => s.once(e, r));
const ack = (s, e, d) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error(e)), 5000); s.emit(e, d, r => { clearTimeout(t); resolve(r); }); });
function record({ amount = 3, policy = 'gm-manual', occurrences, starts = 2, direct = null, id = uuid() } = {}) {
  const d = { name: 'Disposable DR Ward', description: 'Flat DR cooldown fixture', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' },
    effectTypes: direct ? [direct, 'control'] : ['control'], controlConfig: { authoredCondition: { profile: pure.EFFECT_CAPABILITY, effect: 'damageReduction',
      drAmount: amount, label: 'DR Ward', expiryPolicy: policy, ...(occurrences === undefined ? {} : { occurrences }), durationText: 'While the ward holds', gmNote: 'GM resolves eligibility and range.' } },
    ...(direct === 'damage' ? { damageConfig: { damageType: 'direct', elementType: 'arcane', formula: '1d6+2', resolution: 'DICE' } } : {}),
    ...(direct === 'healing' ? { healingConfig: { healingType: 'direct', formula: '1d6+2', resolution: 'DICE' } } : {}),
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: 1, mana: 2 },
    ...(starts === null ? {} : { cooldownConfig: { cooldownType: cooldown.TYPE, cooldownValue: starts } }) };
  return { ...actors.clone(d), authoredDraft: d, authoredDefinitionId: id };
}
describe('Positive flat DR + authenticated cooldown — registered production handlers', function() {
  this.timeout(30000);
  let server, room, gm, owner, writer, pc, target, other, ownerUid;
  const live = () => server.rooms.get(room.id);
  const token = ref => actors.locate(live(), ref).token;
  const base = () => ({ version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence });
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer }); await server.start();
    for (const e of ['actor_bind', 'actor_authored_admit', 'actor_spell_approve', 'actor_spell_withdraw', 'actor_consequence', 'actor_turn_boundary', 'combat_started', 'combat_ended']) { server.setEventLimits(e, { maxPerMinute: 4000, maxPerSecond: 4000 }); }
    const gmUid = server.nextUserId(); ownerUid = server.nextUserId(); server.registerAuthToken('gm', gmUid); server.registerAuthToken('owner', ownerUid);
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: gmUid });
    owner = server.connect({ token: 'owner' }); await once(owner, 'connect'); const joined = once(owner, 'room_joined'); owner.emit('join_room', { roomId: room.id, playerName: 'owner', password: '' }); await joined;
    server.setCharacterOwner('c', ownerUid);
    const map = () => live().gameState.maps.default;
    for (const id of ['target', 'other']) {
      map().tokens[id] = { id, name: id, stats: { maxHp: 60, maxMana: 20, maxAP: 10 }, state: { currentHp: 40, currentMana: 12, currentActionPoints: 6, tempHealth: 3, conditions: [] } };
      const r = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: id }, snapshotHash: actors.hash(map().tokens[id]) });
      assert.equal(r.success, true, JSON.stringify(r)); if (id === 'target') { target = r.ref; } else { other = r.ref; }
    }
    map().characterTokens.pc = { id: 'pc', ownerUserId: ownerUid, character: { id: 'c', class: 'Arcanoneer', stats: { intelligence: 14, agility: 14, spirit: 10 },
      health: { current: 20, max: 30 }, mana: { current: 30, max: 30 }, actionPoints: { current: 12, max: 12 }, tempMana: 2, tempActionPoints: 1 }, state: { conditions: [] } };
    pc = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'c' }, snapshotHash: actors.hash(map().characterTokens.pc) })).ref;
    assert.ok(pc);
  });
  afterEach(async() => { gm.disconnect(); owner.disconnect(); await server.stop(); });
  async function accept(event, data, socket = gm) { const r = await ack(socket, event, data); assert.equal(r.success, true, JSON.stringify(r)); return r; }
  async function refused(event, data, code, socket = gm) {
    const before = actors.clone(live().gameState), r = await ack(socket, event, data); assert.equal(r.success, false, JSON.stringify(r));
    if (code) { assert.equal(r.code, code, JSON.stringify(r)); } assert.deepEqual(live().gameState, before, 'refusal changes nothing'); return r;
  }
  async function clock(order = [pc, other, target]) {
    await accept('combat_started', { roomId: room.id, turnOrder: order.map(ref => ({ tokenId: ref.tokenId, actorRef: ref })), currentTurnIndex: 0, round: 1 });
    await accept('actor_turn_boundary', boundary('adopt'));
  }
  const seq = () => live().gameState.combat.effectLifecycle.sequence;
  const boundary = (mode = 'advance') => ({ ...base(), mode, combatHash: actors.hash(live().gameState.combat), expectedClock: mode === 'advance' ? { id: live().gameState.combat.effectLifecycle.id, sequence: seq() } : null });
  async function advanceTo(n) { while (seq() < n) { await accept('actor_turn_boundary', boundary()); } }
  async function admit(rec, version = 1) {
    const r = await accept('actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, record: rec, definitionVersion: version, classId: 'arcanoneer' });
    return installed.list(live()).entries.find(e => actors.hash(e.definitionRef) === actors.hash(r.definitionRef));
  }
  function approval(e, t = target) {
    const d = e.canonicalDefinition, r = d.effects.direct && pure.readFormula(d.effects.direct.formula);
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence, source: pc, target: t,
      spell: { definitionId: pure.actionId(e.definitionRef), definitionHash: `${pure.EFFECT_CAPABILITY}/${e.definitionRef.definitionHash}`, name: d.name, kind: 'effect', damageTypes: d.effects.direct?.damageTypes || [] },
      roll: r ? { mode: 'physical', dice: [{ sides: 6, faces: [3] }], constant: r.constant, reading: r.reading, total: 3 + r.constant } : null,
      price: e.descriptor.price, classPayment: null, effectTerms: effect.termsFor(d) };
  }
  async function approve(a) { const before = actors.clone(live().gameState), r = await ack(owner, 'actor_spell_approve', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); assert.deepEqual(live().gameState, before); }
  function command(a) {
    const pools = actors.resources(token(pc), 'character'), plan = effect.conditionPlan(a, token(a.target).state.conditions), direct = a.effectTerms.direct;
    const entry = { ref: a.target, expectedRevision: token(a.target).state.actorContract.revision, conditions: plan.ops || [{ op: 'add', recordId: a.approvalId, record: effect.recordFor(a) }] };
    if (direct) { const hp = actors.resources(token(a.target), a.target.kind).hp, temp = Math.min(hp.temp, a.roll.total);
      entry.finalResources = { hp: direct.kind === 'damage' ? { current: Math.max(0, hp.current - a.roll.total + temp), temp: hp.temp - temp } : { current: Math.min(hp.max, hp.current + a.roll.total), temp: hp.temp } }; }
    return { ...base(), source: pc, target: a.target, approval: { approvalId: a.approvalId, contentHash: actors.hash(a) },
      actors: [{ ref: pc, expectedRevision: token(pc).state.actorContract.revision, finalResources: Object.fromEntries(['ap', 'mana'].map(p => [p, payments.tempFirst(pools[p].current, pools[p].temp, a.price[p])])) }, entry],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, finalAmount: a.roll?.total || 0, adjustmentReason: '',
        chosenResult: JSON.stringify(effect.resultFor(a, { gmConfirmed: true, timing: a.effectTerms.timing, timingNote: 'GM confirms range', evidence: 'PRIVATE' }, plan.combination || null)) } };
  }
  async function cast(e, t) { const a = approval(e, t); await approve(a); const c = command(a), r = await accept('actor_consequence', c); return { a, c, r }; }
  const cds = () => actors.clone(token(pc).state.authoredCooldowns || {});
  const attrs = () => token(target).state.conditions.filter(profile.isDamageReductionModifier);
  const remove = id => ({ ...base(), actors: [{ ref: target, expectedRevision: token(target).state.actorContract.revision, conditions: [{ op: 'remove', recordId: id }] }], adjudication: { definitionId: 'gm-correction', definitionVersionOrHash: 'gm-correction', finalAmount: 0, adjustmentReason: '', chosenResult: 'GM exact removal' } });
  const opts = { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' };
  it('both compiler fences admit only positive integer DR 1–20 and 1–10 starts; no save, scaled direct, class/catalogue, self/area or creature source', async() => {
    for (const starts of [1, 10]) { for (const amount of [1, 20]) {
      const m = pure.definitionFromWizard(record({ starts, amount }), opts); assert.equal(m.ok, true, JSON.stringify(m));
      const c = registry.compileDefinition(m.definition); assert.equal(c.ok, true); assert.equal(c.descriptor.compilerVersion, 'p14-a10-flat-dr-cooldown-1');
      assert.equal(pure.creatureSourceRefusal(m.definition).code, 'unsupported_source_route');
    } }
    const good = pure.definitionFromWizard(record({ direct: 'damage' }), opts).definition;
    for (const amount of [0, 21, -1, 1.5, '2', null]) {
      assert.equal(pure.definitionFromWizard(record({ amount }), opts).ok, false);
      assert.equal(registry.compileDefinition({ ...good, effects: { ...good.effects, condition: { ...good.effects.condition, amount } } }).ok, false);
    }
    for (const starts of [0, 11, 1.5, '2']) {
      assert.equal(pure.definitionFromWizard(record({ starts }), opts).ok, false);
      assert.equal(registry.compileDefinition({ ...good, cooldown: { cooldownType: cooldown.TYPE, cooldownValue: starts } }).ok, false);
    }
    for (const change of [d => { d.controlConfig.authoredCondition.save = { ability: 'agility', dc: 12, outcome: 'negates' }; },
      d => { d.damageConfig.formula = '1d6 + intelligence'; }, d => { d.targetingConfig.targetRestrictions = ['self']; },
      d => { d.targetingConfig.targetingType = 'area'; }, d => { d.resourceCost.resourceTypes = ['devotionGauge']; },
      d => { d.damageConfig.formula = 'intelligence'; }, d => { d.damageConfig.formula = '1d6 + missingHealth'; }]) {
      const rec = record({ direct: 'damage' }); change(rec.authoredDraft); Object.assign(rec, actors.clone(rec.authoredDraft)); assert.equal(pure.definitionFromWizard(rec, opts).ok, false);
    }
    for (const changed of [{ effects: { ...good.effects, save: { scope: 'condition', ability: 'agility', dc: 12, outcome: 'negates' } } },
      { effects: { ...good.effects, direct: { ...good.effects.direct, formula: '1d6 + intelligence' } } },
      { classPayment: { domain: 'elementalSpheres', price: { costs: [], gains: [] } } }, { catalogueSource: { spellId: 'x', classId: 'arcanoneer', recordHash: 'a'.repeat(64) } },
      { targeting: { ...good.targeting, restriction: 'self' } }, { targeting: { ...good.targeting, kind: 'area' } }]) { assert.equal(registry.compileDefinition({ ...good, ...changed }).ok, false); }
    token(other).authoredAbility = { schemaVersion: 1, record: record(), librarySpellId: null };
    await refused('actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, source: other, expectedSourceRevision: token(other).state.actorContract.revision, definitionVersion: 1 }, 'unsupported_source_route');
  });
  it('standalone atomic payment/install/start, blocked reuse, pools and other target preserved', async() => {
    await clock(); const e = await admit(record()), before = actors.resources(token(pc), 'character'), targetBefore = actors.clone(token(target)), otherBefore = actors.clone(token(other));
    const { c, r } = await cast(e); assert.equal(r.receipt.actors.length, 2); assert.equal(attrs().length, 1); assert.deepEqual(attrs()[0].effects, { damageReduction: 3 });
    const after = actors.resources(token(pc), 'character'); for (const p of ['ap', 'mana']) { assert.equal(before[p].current + before[p].temp - after[p].current - after[p].temp, e.descriptor.price[p]); }
    assert.deepEqual(actors.resources(token(target), 'creature'), actors.resources(targetBefore, 'creature')); assert.deepEqual(token(target).stats, targetBefore.stats); assert.deepEqual(token(other), otherBefore);
    assert.deepEqual([Object.values(cds())[0].commandId, Object.values(cds())[0].dueSequence], [c.commandId, 6]);
    await refused('actor_spell_approve', approval(e), 'ability_on_cooldown', owner);
  });
  it('expiry before release, release before expiry, same-boundary expiry/release and exact removal stay independent', async() => {
    await clock(); const short = await admit(record({ policy: 'target-next-start', starts: 2 }));
    await cast(short); const held = cds(); await advanceTo(2); assert.equal(attrs().length, 0); assert.deepEqual(cds(), held);
    await refused('actor_spell_approve', approval(short), 'ability_on_cooldown', owner); await advanceTo(6); assert.deepEqual(cds(), {});
    const long = await admit(record({ policy: 'target-end-count', occurrences: 3, starts: 1 })); await cast(long); const records = actors.clone(attrs()), schedules = actors.clone(live().gameState.combat.effectLifecycle.schedules);
    await advanceTo(9); assert.deepEqual(cds(), {}); assert.deepEqual(attrs(), records); assert.deepEqual(live().gameState.combat.effectLifecycle.schedules, schedules);
    await advanceTo(15); assert.equal(attrs().length, 0);
    const same = await admit(record({ policy: 'target-next-end', starts: 1 })); await cast(same); await advanceTo(17); assert.equal(attrs().length, 1);
    const n = actors.ledger(live()).receipts.length; await advanceTo(18); assert.equal(attrs().length, 0); assert.deepEqual(cds(), {}); assert.equal(actors.ledger(live()).receipts.length, n + 1);
    const manual = await admit(record()); const { a } = await cast(manual); const keep = cds(); await accept('actor_consequence', remove(a.approvalId)); assert.equal(attrs().length, 0); assert.deepEqual(cds(), keep);
    await advanceTo(24); await cast(manual); await advanceTo(30); assert.equal(attrs().length, 1); assert.deepEqual(cds(), {}, 'release never removes manual effect');
  });
  it('after release DR recast/copy/version or distinct source remains refused without payment or cooldown; exact removal then permits legal reuse', async() => {
    await clock(); const rec = record({ starts: 1 }), e = await admit(rec); await cast(e); await advanceTo(3);
    const v2 = await admit(rec, 2);
    for (const entry of [e, v2, await admit(record({ amount: 2, starts: 1 }))]) {
      const a = approval(entry); await approve(a); await refused('actor_consequence', command(a), 'damage_reduction_combination_unresolved');
      await accept('actor_spell_withdraw', { roomId: room.id, approvalId: a.approvalId, approval: a }, owner); assert.deepEqual(cds(), {});
    }
    await accept('actor_consequence', remove(attrs()[0].recordId)); await cast(e); assert.equal(attrs().length, 1); assert.equal(Object.keys(cds()).length, 1);
  });
  for (const direct of ['damage', 'healing']) { it(`${direct}: existing plain immediate part shares the same atomic cast; replay returns one receipt`, async() => { // eslint-disable-line no-loop-func
    await clock(); const e = await admit(record({ direct })), before = actors.resources(token(target), 'creature'); const { c, r } = await cast(e);
    const after = actors.resources(token(target), 'creature'); assert.equal(after.hp.current, direct === 'damage' ? before.hp.current - 2 : before.hp.current + 5);
    assert.equal(after.hp.temp, direct === 'damage' ? 0 : before.hp.temp); assert.equal(attrs().length, 1); assert.equal(Object.values(cds())[0].commandId, c.commandId);
    const snapshot = actors.clone(live().gameState); assert.deepEqual((await accept('actor_consequence', c)).receipt, r.receipt); assert.deepEqual(live().gameState, snapshot);
  }); }
  it('writer admission failure starts/applies/spends nothing, retains approval; exact original command succeeds once, checkpoint replay is identical and changed body conflicts', async() => {
    await clock(); const e = await admit(record()), a = approval(e); await approve(a); const c = command(a), original = writer.admitConsequence;
    live().isPermanent = true; writer.admitConsequence = () => ({ queued: false, code: 'attribute_writer_refusal' });
    await refused('actor_consequence', c, 'attribute_writer_refusal'); assert.ok(payments.get(live(), a.approvalId)); assert.deepEqual(cds(), {}); assert.equal(attrs().length, 0);
    writer.admitConsequence = original; live().isPermanent = false; const r = await accept('actor_consequence', c);
    const codec = require('../services/roomCheckpoint'), built = codec.buildCheckpointDocuments({ roomId: room.id, gameState: live().gameState, revision: 1 });
    const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])) }); assert.equal(decoded.ok, true);
    server.rooms.set(room.id, { ...live(), gameState: { ...decoded.global, maps: decoded.maps, ...codec.deriveRootMirrors(decoded.maps) }, checkpointRevision: 1 });
    const snapshot = actors.clone(live().gameState); assert.deepEqual((await accept('actor_consequence', c)).receipt, r.receipt); assert.deepEqual(live().gameState, snapshot);
    assert.equal(actors.ledger(live()).receipts.filter(x => x.commandId === c.commandId).length, 1);
    await refused('actor_consequence', { ...c, adjudication: { ...c.adjudication, adjustmentReason: 'changed' } }, 'command_id_conflict');
  });
  it('competing confirmations commit once; distinct command cannot consume the approval twice', async() => {
    await clock(); const e = await admit(record()), a = approval(e); await approve(a); const c = command(a);
    const results = await Promise.all([ack(gm, 'actor_consequence', c), ack(gm, 'actor_consequence', { ...c, commandId: uuid() })]);
    assert.equal(results.filter(r => r.success).length, 1, JSON.stringify(results));
    assert.ok(['approval_pending', 'approval_consumed'].includes(results.find(r => !r.success).code), JSON.stringify(results));
    assert.equal(attrs().length, 1); assert.equal(Object.keys(cds()).length, 1);
    assert.equal(actors.ledger(live()).receipts.filter(r => r.commandId === c.commandId || r.commandId === Object.values(cds())[0].commandId).length, 1);
    const snapshot = actors.clone(live().gameState), winner = results.find(r => r.success);
    const replay = await accept('actor_consequence', { ...c, commandId: winner.receipt.commandId });
    assert.deepEqual(replay.receipt, winner.receipt); assert.deepEqual(live().gameState, snapshot);
  });
  it('stale target refuses before payment or start and GM-corrected plain healing still commits once', async() => {
    await clock(); const e = await admit(record({ direct: 'healing' })), a = approval(e); await approve(a); const stale = command(a);
    await accept('actor_consequence', { ...base(), actors: [{ ref: target, expectedRevision: token(target).state.actorContract.revision, finalResources: { hp: { current: 39, temp: 3 } } }],
      adjudication: { definitionId: 'gm-correction', definitionVersionOrHash: 'gm-correction', finalAmount: 1, adjustmentReason: '', chosenResult: 'GM HP correction' } });
    await refused('actor_consequence', stale, 'approval_mismatch'); assert.deepEqual(cds(), {}); assert.equal(attrs().length, 0);
    await accept('actor_spell_withdraw', { roomId: room.id, approvalId: a.approvalId, approval: a }, owner);
    const fresh = approval(e); await approve(fresh);
    const c = command(fresh); c.actors[1].finalResources.hp.current = 46; c.adjudication.finalAmount = 7; c.adjudication.adjustmentReason = 'GM corrects healing to 7';
    await accept('actor_consequence', c); assert.equal(token(target).state.currentHp, 46); assert.equal(attrs().length, 1); assert.equal(Object.keys(cds()).length, 1);
  });
  it('missing clock/schedule, PC/self target and retired clock keep refusing whole', async() => {
    const e = await admit(record()); await refused('actor_spell_approve', approval(e), 'turn_state_unavailable', owner); await clock();
    await refused('actor_spell_approve', approval(e, pc), null, owner);
    server.setCharacterOwner('c2', ownerUid);
    live().gameState.maps.default.characterTokens.pc2 = { id: 'pc2', ownerUserId: ownerUid, character: { id: 'c2', class: 'Arcanoneer', health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 } }, state: { conditions: [] } };
    const pc2 = (await accept('actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc2', ownerUid, characterId: 'c2' }, snapshotHash: actors.hash(live().gameState.maps.default.characterTokens.pc2) })).ref;
    await refused('actor_spell_approve', approval(e, pc2), 'unsupported_cooldown_route', owner);
    const timed = await admit(record({ policy: 'target-next-end' }));
    await accept('combat_ended', { roomId: room.id }); await clock([pc, target]);
    const a = approval(timed, other); await approve(a); await refused('actor_consequence', command(a), 'effect_schedule_unavailable');
    await accept('actor_spell_withdraw', { roomId: room.id, approvalId: a.approvalId, approval: a }, owner);
    await cast(e); const held = cds(); await accept('combat_ended', { roomId: room.id }); await clock(); await advanceTo(7); assert.deepEqual(cds(), held);
    await refused('actor_spell_approve', approval(e), 'cooldown_clock_retired', owner);
  });
  it('ten strictly upcoming starts: boundary writer failure releases nothing; exact advance replay releases once and leaves the manual attribute intact', async() => {
    await clock(); const e = await admit(record({ starts: 10 })); await cast(e); assert.equal(Object.values(cds())[0].dueSequence, 30);
    await advanceTo(29); await refused('actor_spell_approve', approval(e), 'ability_on_cooldown', owner);
    const c = boundary(), original = writer.admitConsequence; live().isPermanent = true; writer.admitConsequence = () => ({ queued: false, code: 'attribute_boundary_writer_refusal' });
    await refused('actor_turn_boundary', c, 'attribute_boundary_writer_refusal'); assert.equal(seq(), 29); assert.equal(Object.keys(cds()).length, 1);
    writer.admitConsequence = original; live().isPermanent = false;
    const r = await accept('actor_turn_boundary', c); assert.equal(seq(), 30); assert.deepEqual(cds(), {}); assert.equal(attrs().length, 1);
    const snapshot = actors.clone(live().gameState); assert.deepEqual((await accept('actor_turn_boundary', c)).receipt, r.receipt); assert.deepEqual(live().gameState, snapshot);
  });
});
