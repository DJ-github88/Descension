const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const installed = require('../services/installedAuthoredAbilities');
const definitions = require('../services/installedDefinitionRegistry');
const payments = require('../services/spellPayments');
const pure = require('../../vtt-react/src/services/authoredAbility');
const effect = require('../../vtt-react/src/services/authoredEffect');
const profile = require('../../vtt-react/src/services/sharedConditionProfile');
const timing = require('../../vtt-react/src/services/sharedEffectTiming');
const cooldown = require('../../vtt-react/src/services/authoredCooldown');
const once = (s, e) => new Promise(r => s.once(e, r));
const ack = (s, e, d) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error(e)), 5000); s.emit(e, d, r => { clearTimeout(t); resolve(r); }); });
const sleep = ms => new Promise(res => setTimeout(res, ms));
const rollFor = (formula, faces) => { const r = pure.readFormula(formula); const dice = [{ sides: r.dice[0].sides, faces }]; return { mode: 'physical', dice, constant: r.constant, reading: r.reading, total: faces.reduce((a, b) => a + b, r.constant) }; };

/**
 * Effect cooldowns: the installed authenticated caster-start cooldown (handoff/wizard-cooldowns/APPROVAL.md) reused unchanged on
 * (1) a standalone periodic effect and (2) a movement OR Stunned rider with or without its plain immediate part. Primary owner PC →
 * one placed creature only. Disposable Wizard records; no catalogue spell, no new timing rule, no class payment, save, area or PC target.
 * Roster [pc, source, target] (period 3): the PC's turn starts at sequences 0, 3, 6, 9; the target's at 2, 5, 8 (ends at 3, 6, 9).
 */
/** Measured on the pre-change base: the same definitions without a cooldown keep these exact definition hashes and descriptor bytes. */
const PINNED = {
  periodic: { definitionHash: 'e3b6366384586843023f396b47c5a1a4dbf8514ef2d332daf59441623c180dbd', descriptor: 'fac21d89457fdfc78cb746a9bd97c2f3342171117082f60c3e34d307e962ec3b' },
  move: { definitionHash: 'fe17ef5d441e4acd706d6feed9c5b933b8f92b8924419f8a1b26b8d5b85e780a', descriptor: 'cc8992f4824249a4675f479da091893d9a26ae15faaca8c4ac07ec9d45a94678' },
  stun: { definitionHash: 'a13475cfa5c822b54890e31580f542d91948f9d621d129ba7018da0a1d0b5bc6', descriptor: 'ebe1f6c5f79ded3fcb4ded6c603b1928f42b86db9617cfa517ae00bc97ece774' }
};
function periodicRecord({ name = 'Disposable Wasting Brand', kind = 'damage', formula = '1d4', policy = 'target-start-count', occurrences = 3, label = 'Wasting Brand',
  restriction = 'any', ap = 1, mana = 2, cooldownValue = 1, cooldownType = cooldown.TYPE, extra } = {}) {
  const c = { profile: pure.EFFECT_CAPABILITY, effect: 'periodic', periodicKind: kind, periodicFormula: formula, ...(kind === 'damage' ? { periodicDamageType: 'blight' } : {}),
    tickRoll: 'each-tick', label, expiryPolicy: policy, ...(occurrences !== null ? { occurrences } : {}), durationText: 'While the brand smoulders', gmNote: 'GM resolves eligibility and range before confirming success.' };
  const d = { name, description: 'Effect cooldown disposable test', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: ['control'], controlConfig: { authoredCondition: c },
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: [restriction] }, resourceCost: { actionPoints: ap, mana },
    ...(cooldownType !== null ? { cooldownConfig: { cooldownType, cooldownValue } } : {}) };
  if (extra) {extra(d);}
  return { ...actors.clone(d), authoredDraft: d, authoredDefinitionId: uuid() };
}
function riderRecord({ name = 'Disposable Ember Hobble', kind = 'movement', feet = -10, label = 'Hobbled', policy = 'target-next-end', occurrences, direct = null,
  ap = 2, mana = 3, cooldownValue = 1, cooldownType = cooldown.TYPE, extra } = {}) {
  const c = { profile: pure.EFFECT_CAPABILITY, effect: kind, ...(kind === 'movement' ? { movementFeet: feet, label } : {}), expiryPolicy: policy, ...(occurrences !== undefined ? { occurrences } : {}),
    durationText: 'Until the embers cool', gmNote: 'GM resolves eligibility, range and any save before confirming success.' };
  const d = { name, description: 'Effect cooldown disposable test', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' },
    effectTypes: direct ? [direct, 'control'] : ['control'], controlConfig: { authoredCondition: c },
    ...(direct === 'damage' ? { damageConfig: { damageType: 'direct', elementType: 'ember', formula: '1d6+2', resolution: 'DICE' } } : {}),
    ...(direct === 'healing' ? { healingConfig: { healingType: 'direct', formula: '2d4', resolution: 'DICE' } } : {}),
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: ap, mana },
    ...(cooldownType !== null ? { cooldownConfig: { cooldownType, cooldownValue } } : {}) };
  if (extra) {extra(d);}
  return { ...actors.clone(d), authoredDraft: d, authoredDefinitionId: uuid() };
}

describe('Effect cooldowns — standalone periodic and movement/Stunned rider bundles with the authenticated caster-start cooldown, registered production handlers', function() {
  this.timeout(30000);
  let server, room, gm, owner, observer, writer, source, target, other, pc, ownerUid;
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer }); await server.start();
    for (const e of ['actor_bind', 'actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_revoke', 'actor_spell_approve', 'actor_spell_withdraw',
      'actor_turn_boundary', 'actor_periodic_resolve', 'combat_started', 'combat_ended', 'actor_spell_list']) {server.setEventLimits(e, { maxPerMinute: 4000, maxPerSecond: 4000 });}
    const gmUid = server.nextUserId(); ownerUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid); server.registerAuthToken('owner', ownerUid); server.registerAuthToken('observer', server.nextUserId());
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: gmUid });
    for (const role of ['owner', 'observer']) { const s = server.connect({ token: role }); await once(s, 'connect'); const j = once(s, 'room_joined'); s.emit('join_room', { roomId: room.id, playerName: role, password: '' }); await j; if (role === 'owner') {owner = s;} else {observer = s;} }
    server.setCharacterOwner('c', ownerUid);
    const map = () => room.gameState.maps.default;
    for (const id of ['source', 'target', 'other']) {
      const t = { id, name: id, creatureId: 'disposable', stats: { maxHp: 60, maxMana: 20, maxAP: 10, speed: 30 }, state: { currentHp: 50, currentMana: 20, currentActionPoints: 10, tempHealth: 3, tempMana: 2, tempActionPoints: 1, conditions: [] } };
      map().tokens[id] = t;
      const r = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: id }, snapshotHash: actors.hash(t) });
      assert.equal(r.success, true, JSON.stringify(r)); if (id === 'source') {source = r.ref;} else if (id === 'target') {target = r.ref;} else {other = r.ref;}
    }
    map().characterTokens.pc = { id: 'pc', ownerUserId: ownerUid, character: { id: 'c', class: 'Arcanoneer', stats: { intelligence: 14, spirit: 9 }, health: { current: 20, max: 30 }, mana: { current: 30, max: 30 }, actionPoints: { current: 12, max: 12 }, tempMana: 2, tempActionPoints: 1 }, state: { conditions: [] } };
    pc = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'c' }, snapshotHash: actors.hash(map().characterTokens.pc) })).ref;
    assert.ok(pc);
  });
  afterEach(async() => { gm.disconnect(); owner.disconnect(); observer.disconnect(); await server.stop(); });

  const live = () => server.rooms.get(room.id);
  const token = ref => actors.locate(live(), ref).token;
  const base = () => ({ version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence });
  async function startCombat(order = [pc, source, target]) {
    const r = await ack(gm, 'combat_started', { roomId: room.id, turnOrder: order.map(ref => ({ tokenId: ref.tokenId, actorRef: ref })), currentTurnIndex: 0, round: 1 }); assert.equal(r.success, true, JSON.stringify(r));
  }
  const boundary = (mode = 'advance') => ({ ...base(), mode, combatHash: actors.hash(live().gameState.combat), expectedClock: mode === 'advance' ? { id: live().gameState.combat.effectLifecycle.id, sequence: live().gameState.combat.effectLifecycle.sequence } : null });
  async function adopt() { const r = await ack(gm, 'actor_turn_boundary', boundary('adopt')); assert.equal(r.success, true, JSON.stringify(r)); }
  async function advance() { const c = boundary(), r = await ack(gm, 'actor_turn_boundary', c); assert.equal(r.success, true, JSON.stringify(r)); return { c, r }; }
  const seq = () => live().gameState.combat.effectLifecycle.sequence;
  async function advanceTo(n) { while (seq() < n) {await advance();} }
  async function admitPc(record, definitionVersion = 1) {
    const r = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, record, definitionVersion, classId: 'arcanoneer' });
    assert.equal(r.success, true, JSON.stringify(r)); return r.definitionRef;
  }
  const entryFor = ref => installed.list(live()).entries.find(e => pure.actionId(e.definitionRef) === pure.actionId(ref));
  const resolution = d => ({ gmConfirmed: true, timing: d.timing, timingNote: 'GM ruling at the table', evidence: 'PRIVATE GM ruling' });
  function spellOf(e) { const d = e.canonicalDefinition; return { definitionId: pure.actionId(e.definitionRef), definitionHash: `${pure.EFFECT_CAPABILITY}/${e.definitionRef.definitionHash}`, name: d.name, kind: 'effect', damageTypes: d.effects.direct?.damageTypes || [] }; }
  function pcApproval(ref, { t = target, faces = [3] } = {}) {
    const e = entryFor(ref), d = e.canonicalDefinition;
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence, source: pc, target: t,
      spell: spellOf(e), roll: d.effects.direct ? rollFor(d.effects.direct.formula, faces) : null, price: e.descriptor.price, classPayment: null, effectTerms: effect.termsFor(d) };
  }
  async function approve(a) { const before = actors.clone(live().gameState), r = await ack(owner, 'actor_spell_approve', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); assert.deepEqual(live().gameState, before, 'approval spends nothing'); return r; }
  function command(a, { amount, reason = '' } = {}) {
    const pools = actors.resources(token(a.source), 'character'), pay = {};
    for (const p of ['ap', 'mana']) {if (a.price[p]) {pay[p] = payments.tempFirst(pools[p].current, pools[p].temp, a.price[p]);}}
    if (!Object.keys(pay).length) {pay.ap = payments.tempFirst(pools.ap.current, pools.ap.temp, 0);}
    const direct = a.effectTerms.direct, finalAmount = direct ? amount ?? a.roll.total : 0;
    const plan = effect.conditionPlan(a, token(a.target).state.conditions || []);
    const targetEntry = { ref: a.target, expectedRevision: token(a.target).state.actorContract.revision, conditions: plan.ops || [{ op: 'add', recordId: a.approvalId, record: effect.recordFor(a) }] };
    if (direct) {
      const hp = actors.resources(token(a.target), a.target.kind).hp, fromTemp = Math.min(hp.temp, finalAmount);
      targetEntry.finalResources = { hp: direct.kind === 'damage' ? { current: Math.max(0, hp.current - (finalAmount - fromTemp)), temp: hp.temp - fromTemp } : { current: Math.min(hp.max, hp.current + finalAmount), temp: hp.temp } };
    }
    return { ...base(), source: a.source, target: a.target, approval: { approvalId: a.approvalId, contentHash: actors.hash(a) },
      actors: [{ ref: a.source, expectedRevision: token(a.source).state.actorContract.revision, finalResources: pay }, targetEntry],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, finalAmount, adjustmentReason: direct ? reason : '', chosenResult: JSON.stringify(effect.resultFor(a, resolution({ timing: a.effectTerms.timing }), plan.combination || null)) } };
  }
  async function accept(c) { const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true, JSON.stringify(r)); return r; }
  async function cast(ref, opts) { const a = pcApproval(ref, opts); await approve(a); const c = command(a), r = await accept(c); return { a, c, r }; }
  async function refused(event, data, code, socket = gm) { const before = actors.clone(live().gameState), r = await ack(socket, event, data); assert.equal(r.success, false, JSON.stringify(r)); if (code) {assert.equal(r.code, code, JSON.stringify(r));} assert.deepEqual(live().gameState, before, `${event} changed nothing`); return r; }
  const withdraw = async a => assert.equal((await ack(owner, 'actor_spell_withdraw', { roomId: room.id, approvalId: a.approvalId, approval: a })).success, true);
  const cooldowns = () => actors.clone(token(pc).state.authoredCooldowns || {});
  const statusOf = ref => cooldown.status(token(pc), live().gameState.combat, pc, ref.definitionId);
  const periodic = ref => token(ref).state.conditions.filter(profile.isPeriodicTick);
  const moves = ref => token(ref).state.conditions.filter(profile.isMovementModifier);
  const stuns = ref => token(ref).state.conditions.filter(profile.isStunned);
  const due = () => timing.dueTicks(live().gameState.combat);
  const hp = ref => { const v = actors.resources(token(ref), ref.kind).hp; return { current: v.current, temp: v.temp }; };
  const pools = () => actors.clone(actors.resources(token(pc), 'character'));
  const spent = (before, after, p) => before[p].current + before[p].temp - after[p].current - after[p].temp;
  const receiptsFor = commandId => actors.ledger(live()).receipts.filter(x => x.commandId === commandId);
  const chosen = r => JSON.parse(r.receipt.adjudication.chosenResult);
  function resolveReq(t, { faces = [2], mode = 'apply', reason = '' } = {}) {
    if (mode === 'dismiss') {return { ...base(), tickId: t.tickId, mode, adjustmentReason: reason || 'GM resolved this tick by hand at the table' };}
    const r = rollFor(t.tick.formula, faces); return { ...base(), tickId: t.tickId, mode, expectedRevision: token(t.ref).state.actorContract.revision, roll: r, finalAmount: r.total, adjustmentReason: reason };
  }
  async function resolve(t, opts) { const c = resolveReq(t, opts), r = await ack(gm, 'actor_periodic_resolve', c); assert.equal(r.success, true, JSON.stringify(r)); return { c, r }; }
  const remove = (ref, id) => ({ ...base(), actors: [{ ref, expectedRevision: token(ref).state.actorContract.revision, conditions: [{ op: 'remove', recordId: id }] }],
    adjudication: { definitionId: 'gm-correction', definitionVersionOrHash: 'gm-correction', finalAmount: 0, adjustmentReason: '', chosenResult: 'GM exact removal' } });
  const schedules = () => actors.clone(live().gameState.combat?.effectLifecycle?.schedules || {});
  /** Everything a cast could change: caster pools, target HP/conditions, cooldowns, schedules, open ticks and the receipt count. */
  const world = () => ({ pools: pools(), hp: hp(target), conditions: actors.clone(token(target).state.conditions), otherConditions: actors.clone(token(other).state.conditions), cooldowns: cooldowns(),
    schedules: schedules(), dueTicks: actors.clone(live().gameState.combat?.effectLifecycle?.dueTicks || {}), receipts: actors.ledger(live()).receipts.length });
  const opts = () => ({ roomId: room.id, definitionVersion: 1, classId: 'arcanoneer' });
  const pinnedOpts = { roomId: 'pinned-room', definitionVersion: 1, classId: 'arcanoneer' };
  const descriptorSha = c => require('crypto').createHash('sha256').update(JSON.stringify(c.descriptor)).digest('hex');

  describe('deliverable 1 — standalone periodic effect', () => {
    it('compiler and registry: a periodic-only bundle accepts the cooldown under p14-m5-periodic-cooldown-1; without one it keeps its pinned bytes; invalid values and creature sources stay refused', async() => {
      const r = pure.definitionFromWizard(periodicRecord({ cooldownValue: 2 }), opts());
      assert.equal(r.ok, true, JSON.stringify(r)); assert.equal(r.definition.effects.direct, null);
      assert.deepEqual(r.definition.cooldown, { cooldownType: cooldown.TYPE, cooldownValue: 2 });
      const compiled = definitions.compileDefinition(r.definition);
      assert.equal(compiled.ok, true); assert.equal(compiled.descriptor.compilerVersion, 'p14-m5-periodic-cooldown-1'); assert.deepEqual(compiled.descriptor.cooldown, r.definition.cooldown);
      assert.equal(pure.definitionFromWizard(periodicRecord({ kind: 'healing', restriction: 'ally' }), opts()).ok, true);
      // Without a cooldown: no `cooldown` key, the existing compiler id and the exact bytes measured on the pre-change base.
      const pinned = definitions.compileDefinition(pure.definitionFromWizard({ ...periodicRecord({ cooldownType: null }), authoredDefinitionId: '70000000-0000-4000-8000-0000000000b1' }, pinnedOpts).definition);
      assert.equal(pinned.descriptor.compilerVersion, 'p14-m5-periodic-1'); assert.equal(Object.hasOwn(pinned.descriptor, 'cooldown'), false);
      assert.equal(pinned.definitionHash, PINNED.periodic.definitionHash); assert.equal(descriptorSha(pinned), PINNED.periodic.descriptor);
      for (const rec of [periodicRecord({ cooldownValue: 0 }), periodicRecord({ cooldownValue: 11 }), periodicRecord({ cooldownType: 'turn_based', cooldownValue: 2 })]) {
        const x = pure.definitionFromWizard(rec, opts()); assert.equal(x.ok, false); assert.match(x.reason, /cooldownConfig: legacy/);
      }
      const bare = actors.clone(r.definition);
      for (const bad of [{ cooldownType: cooldown.TYPE, cooldownValue: 11 }, { cooldownType: 'turn_based', cooldownValue: 1 }, null]) {assert.equal(definitions.compileDefinition({ ...bare, cooldown: bad }).ok, false);}
      // A creature source cannot carry a caster-start cooldown: refused at GM admission with nothing installed.
      token(source).authoredAbility = { schemaVersion: 1, record: periodicRecord({ name: 'Disposable Creature Brand' }), librarySpellId: null };
      await refused('actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, source, expectedSourceRevision: token(source).state.actorContract.revision, definitionVersion: 1 }, 'unsupported_source_route');
      assert.equal(pure.creatureSourceRefusal(r.definition).code, 'unsupported_source_route');
      assert.equal(pure.creatureSourceRefusal(pure.definitionFromWizard(periodicRecord({ cooldownType: null }), opts()).definition), null, 'without a cooldown the creature route is unchanged');
    });

    it('atomic cast: one receipt pays once, installs ONE periodic instance and starts the cooldown (no HP change at cast); blocked reuse spends nothing; ticks roll separately at GM resolution and never touch the cooldown; release leaves the instance', async() => {
      await startCombat(); await adopt();
      const ref = await admitPc(periodicRecord({ cooldownValue: 1, occurrences: 3 }));
      const before = pools(), startHp = hp(target);
      const { c, r } = await cast(ref);
      assert.equal(receiptsFor(c.commandId).length, 1);
      assert.equal(spent(before, pools(), 'ap'), 1); assert.equal(spent(before, pools(), 'mana'), 2);
      assert.deepEqual(hp(target), startHp, 'a standalone periodic effect changes no HP at cast');
      assert.equal(periodic(target).length, 1); assert.equal(due().length, 0, 'the cast records no tick');
      assert.equal(chosen(r).roll, null); assert.equal(chosen(r).direct, null);
      const items = Object.values(cooldowns()); assert.equal(items.length, 1);
      assert.deepEqual([items[0].startSequence, items[0].dueSequence, items[0].occurrences, items[0].period, items[0].commandId], [0, 3, 1, 3, c.commandId]);
      await refused('actor_spell_approve', pcApproval(ref), 'ability_on_cooldown', owner);
      await advanceTo(2); assert.equal(due().length, 1);
      const held = cooldowns(), afterCast = pools();
      const t1 = await resolve(due()[0], { faces: [3] });
      assert.equal(t1.c.roll.total, 3, 'the tick carries its own roll, made at GM resolution'); assert.deepEqual(hp(target), { current: startHp.current, temp: 0 }, '3 = 3 temp');
      assert.deepEqual(cooldowns(), held, 'tick resolution neither restarts nor extends the cooldown'); assert.deepEqual(pools(), afterCast, 'no per-tick payment');
      const snap = world(); assert.deepEqual((await ack(gm, 'actor_periodic_resolve', t1.c)).receipt, t1.r.receipt); assert.deepEqual(world(), snap, 'tick replay changes nothing');
      // Order A: release at boundary 3; the instance, schedule and remaining ticks are untouched.
      const instance = actors.clone(periodic(target)), sched = schedules();
      await advance(); assert.equal(seq(), 3); assert.deepEqual(cooldowns(), {}, 'released at the authenticated boundary');
      assert.deepEqual(periodic(target), instance); assert.deepEqual(schedules(), sched);
      await advanceTo(5); assert.deepEqual(due().map(t => [t.occurrence, t.of]), [[2, 3]]);
      // Legal re-cast onto the same target while the instance runs: the existing one-periodic-stream rule refuses it whole, before anything is spent.
      const b = pcApproval(ref); await approve(b);
      const stop = world(), x = await ack(gm, 'actor_consequence', command(b)); assert.equal(x.success, false); assert.equal(x.code, 'periodic_combination_unresolved', JSON.stringify(x)); assert.deepEqual(world(), stop, 'refused application: no payment and no cooldown');
      await withdraw(b);
      await resolve(due()[0]); await advanceTo(8); assert.equal(due()[0].final, true); await resolve(due()[0]); assert.equal(periodic(target).length, 0);
      // Legal reuse once the existing stream rule holds: a new cooldown from the current position (seq 8 → next PC start 9).
      const second = await cast(ref); const k = cooldown.key(pc, ref.definitionId);
      assert.equal(cooldowns()[k].commandId, second.c.commandId); assert.equal(cooldowns()[k].dueSequence, 9);
    });

    it('order B: final-tick expiry, live dismissal and GM removal never release the cooldown; it releases only at its own boundary', async() => {
      await startCombat(); await adopt();
      const short = await admitPc(periodicRecord({ name: 'Disposable Short Brand', cooldownValue: 3, policy: 'target-next-start', occurrences: null }));
      const long = await admitPc(periodicRecord({ name: 'Disposable Long Brand', cooldownValue: 3, occurrences: 3 }));
      await cast(short); const k1 = cooldown.key(pc, short.definitionId), held1 = cooldowns()[k1]; assert.equal(held1.dueSequence, 9);
      await advanceTo(2); assert.equal(due()[0].final, true); await resolve(due()[0]); assert.equal(periodic(target).length, 0, 'the instance ended with its only tick');
      assert.deepEqual(cooldowns()[k1], held1); assert.equal(statusOf(short).code, 'ability_on_cooldown');
      await advanceTo(3); const l = await cast(long); const k2 = cooldown.key(pc, long.definitionId), held2 = cooldowns()[k2];
      assert.deepEqual([held2.startSequence, held2.dueSequence, held2.commandId], [3, 12, l.c.commandId], 'N=3 from the ongoing PC turn at 3: starts 6, 9, 12');
      await advanceTo(5); assert.equal(due().length, 1); await resolve(due()[0], { mode: 'dismiss' });
      assert.deepEqual(cooldowns()[k2], held2, 'live tick dismissal does not touch the cooldown');
      await advanceTo(8); assert.equal(due().length, 1); const open = due()[0];
      await accept(remove(target, periodic(target)[0].recordId)); assert.equal(periodic(target).length, 0);
      assert.deepEqual(cooldowns()[k2], held2, 'GM removal with an open tick does not touch the cooldown');
      await refused('actor_periodic_resolve', resolveReq(open), 'periodic_tick_stale'); await resolve(open, { mode: 'dismiss' });
      await refused('actor_spell_approve', pcApproval(long), 'ability_on_cooldown', owner);
      await advance(); assert.equal(seq(), 9); assert.equal(cooldowns()[k1], undefined, 'the short cooldown releases only at 9'); assert.deepEqual(cooldowns()[k2], held2);
      await advanceTo(12); assert.deepEqual(cooldowns(), {}, 'the removed effect\'s cooldown keeps its own boundary (12)');
    });

    it('identity, concurrency and recovery: copies share the cooldown; two approvals cannot coexist; racing confirmations execute once; lost ACK and a checkpoint rebuild recover the original command once', async() => {
      await startCombat(); await adopt();
      const rec = periodicRecord({ cooldownValue: 2 }), v1 = await admitPc(rec), v2 = await admitPc(rec, 2), distinct = await admitPc(periodicRecord({ name: 'Disposable Other Brand', cooldownValue: 2 }));
      const a = pcApproval(v1), b = pcApproval(v1), before = world();
      const results = await Promise.all([ack(owner, 'actor_spell_approve', a), ack(owner, 'actor_spell_approve', b)]);
      assert.deepEqual(results.map(r => r.code).sort(), ['approval_pending', 'awaiting_gm']); assert.deepEqual(world(), before);
      const winner = results[0].code === 'awaiting_gm' ? a : b, c = command(winner), rival = { ...c, commandId: uuid() };
      const confirmations = await Promise.all([ack(gm, 'actor_consequence', c), ack(gm, 'actor_consequence', rival)]);
      assert.equal(confirmations.filter(r => r.success).length, 1, JSON.stringify(confirmations)); assert.equal(confirmations.find(r => !r.success).code, 'approval_consumed');
      const accepted = confirmations[0].success ? c : rival, receipt = confirmations.find(r => r.success).receipt;
      assert.equal(Object.keys(cooldowns()).length, 1); assert.equal(periodic(target).length, 1);
      const after = actors.clone(live().gameState);
      gm.emit('actor_consequence', accepted); await sleep(100);
      assert.deepEqual((await ack(gm, 'actor_consequence', accepted)).receipt, receipt); assert.deepEqual(live().gameState, after); assert.equal(receiptsFor(accepted.commandId).length, 1);
      await refused('actor_consequence', { ...accepted, adjudication: { ...accepted.adjudication, adjustmentReason: 'changed' } }, 'command_id_conflict');
      await refused('actor_spell_approve', pcApproval(v2), 'ability_on_cooldown', owner);
      // A genuinely new definition ID is a distinct ability: its approval passes the cooldown gate (then withdrawn; nothing spent).
      const d1 = pcApproval(distinct); await approve(d1); await withdraw(d1);
      // Checkpoint rebuild: cooldown, instance and schedule survive; the original command replays to its receipt once.
      const codec = require('../services/roomCheckpoint'), built = codec.buildCheckpointDocuments({ roomId: room.id, gameState: live().gameState, revision: 1 });
      const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])) }); assert.equal(decoded.ok, true);
      const held = cooldowns(), snapshot = world();
      server.rooms.set(room.id, { ...live(), gameState: { ...decoded.global, maps: decoded.maps, ...codec.deriveRootMirrors(decoded.maps) }, checkpointRevision: 1 });
      assert.deepEqual(cooldowns(), held); assert.deepEqual(world(), snapshot);
      assert.deepEqual((await ack(gm, 'actor_consequence', accepted)).receipt, receipt); assert.deepEqual(world(), snapshot);
      await refused('actor_spell_approve', pcApproval(v1), 'ability_on_cooldown', owner);
      const view = await ack(owner, 'actor_snapshot', { roomId: room.id }); assert.deepEqual(view.maps.default.characterTokens.pc.state.authoredCooldowns, held);
      await advanceTo(6); assert.deepEqual(cooldowns(), {}, 'N=2 releases at the second strictly upcoming PC start (6)'); assert.equal(periodic(target).length, 1, 'the instance continues');
    });

    it('route gates and retired clock: PC target and missing clock refuse with nothing spent; combat end keeps the cooldown blocked/manual; restart never resets it; retired tick stays dismiss-only', async() => {
      const ref = await admitPc(periodicRecord({ cooldownValue: 2, occurrences: 3 }));
      // No authenticated clock: refused before anything is spent (the periodic route's own turn-state gate fires first).
      const noClock = await refused('actor_spell_approve', pcApproval(ref), undefined, owner); assert.ok(['turn_state_unavailable', 'cooldown_clock_required'].includes(noClock.code), noClock.code);
      await startCombat(); await adopt();
      await refused('actor_spell_approve', pcApproval(ref, { t: pc }), 'unsupported_cooldown_route', owner);
      await cast(ref); await advanceTo(2); const held = cooldowns(), open = due()[0];
      assert.equal((await ack(gm, 'combat_ended', { roomId: room.id })).success, true);
      assert.deepEqual(cooldowns(), held); await refused('actor_spell_approve', pcApproval(ref), 'cooldown_clock_retired', owner);
      await startCombat(); await adopt(); for (let i = 0; i < 7; i++) {await advance();}
      assert.deepEqual(cooldowns(), held, 'a new clock never releases a cooldown recorded on the retired one');
      const retired = live().gameState.combat.retiredPeriodicTicks?.[open.tickId]; assert.ok(retired);
      await refused('actor_periodic_resolve', resolveReq(retired), 'periodic_tick_retired');
      await resolve(retired, { mode: 'dismiss' }); assert.deepEqual(cooldowns(), held);
    });
  });

  describe('deliverable 2 — movement or Stunned rider', () => {
    it('compiler and registry: movement and Stunned riders, with or without a plain immediate part, accept the cooldown under p14-a10-effect-cooldown-1; without one they keep their pinned bytes; attribute and DR shapes stay refused (scaled formulas and rider-local saves: fence updates, own labels)', () => {
      for (const [name, rec] of Object.entries({ move: riderRecord(), moveDamage: riderRecord({ direct: 'damage' }), stun: riderRecord({ kind: 'stunned', policy: 'gm-manual' }),
        stunHealing: riderRecord({ kind: 'stunned', direct: 'healing', policy: 'target-start-count', occurrences: 2 }) })) {
        const r = pure.definitionFromWizard(rec, opts()); assert.equal(r.ok, true, `${name}: ${JSON.stringify(r)}`);
        const c = definitions.compileDefinition(r.definition); assert.equal(c.ok, true, name);
        assert.equal(c.descriptor.compilerVersion, 'p14-a10-effect-cooldown-1', name); assert.deepEqual(c.descriptor.cooldown, { cooldownType: cooldown.TYPE, cooldownValue: 1 });
        assert.equal(pure.creatureSourceRefusal(r.definition).code, 'unsupported_source_route', name);
      }
      for (const [name, rec] of Object.entries({ move: riderRecord({ cooldownType: null, direct: 'damage' }), stun: riderRecord({ kind: 'stunned', cooldownType: null }) })) {
        const pinned = definitions.compileDefinition(pure.definitionFromWizard({ ...rec, authoredDefinitionId: '70000000-0000-4000-8000-0000000000b2' }, pinnedOpts).definition);
        assert.equal(pinned.descriptor.compilerVersion, 'p14-a10-effect-1', name); assert.equal(Object.hasOwn(pinned.descriptor, 'cooldown'), false);
        assert.equal(pinned.definitionHash, PINNED[name].definitionHash, name); assert.equal(descriptorSha(pinned), PINNED[name].descriptor, name);
      }
      const scaled = pure.definitionFromWizard(riderRecord({ direct: 'damage', extra: d => { d.damageConfig.formula = '1d6 + intelligence/3'; } }), opts());
      // Fence update (formula-rider cooldowns): an attribute-scaled immediate part next to a rider now takes the cooldown under its own label.
      assert.equal(scaled.ok, true, JSON.stringify(scaled)); assert.equal(definitions.compileDefinition(scaled.definition).descriptor.compilerVersion, 'p14-a10-effect-formula-cooldown-1');
      // Review F3/F4: registry level — hand-built rider definitions with the cooldown key stay refused for flat DR and a scaled immediate part.
      const cd = { cooldownType: cooldown.TYPE, cooldownValue: 1 };
      const plainMove = pure.definitionFromWizard(riderRecord({ direct: 'damage', cooldownType: null }), opts()).definition;
      const drDef = { ...actors.clone(plainMove), effects: { ...actors.clone(plainMove.effects), condition: { kind: 'damageReduction', amount: 2, label: 'Warded' } } };
      assert.equal(definitions.compileDefinition(drDef).ok, true, 'the flat DR bundle itself compiles');
      assert.equal(definitions.compileDefinition({ ...drDef, cooldown: cd }).descriptor.compilerVersion, 'p14-a10-flat-dr-cooldown-1', 'positive flat DR uses the shared cooldown');
      const attrDef = { ...actors.clone(plainMove), effects: { ...actors.clone(plainMove.effects), condition: { kind: 'attribute', attribute: 'agility', amount: -2, label: 'Leaden' } } };
      assert.equal(definitions.compileDefinition(attrDef).ok, true); assert.equal(definitions.compileDefinition({ ...attrDef, cooldown: cd }).descriptor.compilerVersion, 'p14-a10-attribute-cooldown-1', 'attribute cooldown scope fence extended; same attribute family');
      const scaledDef = { ...actors.clone(plainMove), effects: { ...actors.clone(plainMove.effects), direct: { ...plainMove.effects.direct, formula: '1d6 + intelligence/3' } } };
      assert.equal(definitions.compileDefinition({ ...scaledDef, cooldown: cd }).descriptor.compilerVersion, 'p14-a10-effect-formula-cooldown-1', 'fence update: a scaled immediate part next to a rider takes its own cooldown label');
      assert.equal(definitions.compileDefinition({ ...actors.clone(plainMove), cooldown: cd }).ok, true, 'control: the same plain rider with the cooldown compiles');
      const attribute = pure.definitionFromWizard(riderRecord({ extra: d => { d.controlConfig.authoredCondition = { profile: pure.EFFECT_CAPABILITY, effect: 'attribute', attribute: 'agility', attributeAmount: -2, label: 'Leaden', expiryPolicy: 'gm-manual', durationText: 'x', gmNote: 'y' }; } }), opts());
      assert.equal(attribute.ok, true); assert.equal(definitions.compileDefinition(attribute.definition).descriptor.compilerVersion, 'p14-a10-attribute-cooldown-1');
      const withoutCd = pure.definitionFromWizard(riderRecord({ kind: 'stunned', direct: 'damage', cooldownType: null }), opts()).definition;
      const saved = { ...actors.clone(withoutCd), effects: { ...actors.clone(withoutCd.effects), save: { scope: 'condition', ability: 'constitution', dc: 13, outcome: 'negates' } } };
      assert.equal(definitions.compileDefinition(saved).ok, true, 'the save bundle itself compiles');
      // Fence update (rider-save cooldowns): a Stunned save bundle with its plain immediate part now carries the cooldown under its own label.
      assert.equal(definitions.compileDefinition({ ...saved, cooldown: { cooldownType: cooldown.TYPE, cooldownValue: 1 } }).descriptor.compilerVersion, 'p14-save-branch-timed-cooldown-1', 'fence update: a rider-local save bundle takes its own cooldown label');
    });

    it('movement + immediate damage: one receipt pays once, applies HP, installs the rider with its schedule and starts the cooldown; rider expiry does not release the cooldown (order B); blocked reuse spends nothing', async() => {
      await startCombat(); await adopt();
      const ref = await admitPc(riderRecord({ direct: 'damage', cooldownValue: 2, policy: 'target-next-end' }));
      const before = pools(), startHp = hp(target);
      const { c, r } = await cast(ref, { faces: [5] });
      assert.equal(receiptsFor(c.commandId).length, 1);
      assert.equal(spent(before, pools(), 'ap'), 2); assert.equal(spent(before, pools(), 'mana'), 3);
      assert.deepEqual(hp(target), { current: startHp.current - 4, temp: 0 }, '7 = 3 temp + 4 HP');
      assert.equal(moves(target).length, 1); assert.equal(chosen(r).condition.kind, 'movement'); assert.equal(chosen(r).combination.outcome, 'added');
      const item = Object.values(cooldowns())[0]; assert.deepEqual([item.dueSequence, item.commandId], [6, c.commandId], 'N=2: PC starts 3, 6');
      await refused('actor_spell_approve', pcApproval(ref), 'ability_on_cooldown', owner);
      const held = cooldowns();
      await advanceTo(3); assert.equal(moves(target).length, 0, 'the rider expired at the end of the target\'s next turn (3)');
      assert.deepEqual(cooldowns(), held, 'rider expiry does not release the cooldown');
      await refused('actor_spell_approve', pcApproval(ref), 'ability_on_cooldown', owner);
      await advanceTo(5); assert.deepEqual(cooldowns(), held); await advance(); assert.equal(seq(), 6); assert.deepEqual(cooldowns(), {});
      const again = await cast(ref); assert.equal(Object.values(cooldowns())[0].commandId, again.c.commandId); assert.equal(Object.values(cooldowns())[0].dueSequence, 12);
    });

    it('order A: the cooldown releases while the rider stays with its schedule; a legal re-cast refreshes the same rider (A11) and starts a new cooldown; GM removal of the rider leaves the cooldown untouched', async() => {
      await startCombat(); await adopt();
      const ref = await admitPc(riderRecord({ cooldownValue: 1, policy: 'target-end-count', occurrences: 3 }));
      const first = await cast(ref); assert.equal(Object.values(cooldowns())[0].dueSequence, 3);
      const rider = actors.clone(moves(target)), sched = schedules();
      await advance(); await advance(); await advance(); assert.equal(seq(), 3);
      assert.deepEqual(cooldowns(), {}, 'released at 3'); assert.deepEqual(moves(target), rider, 'cooldown release does not remove the rider'); assert.deepEqual(schedules(), sched);
      const second = await cast(ref); assert.equal(chosen(second.r).combination.outcome, 'refreshed'); assert.equal(chosen(second.r).combination.replacesInstanceId, first.a.approvalId);
      assert.equal(moves(target).length, 1); const held = cooldowns(); assert.equal(Object.values(held)[0].commandId, second.c.commandId);
      await accept(remove(target, moves(target)[0].recordId)); assert.equal(moves(target).length, 0); assert.deepEqual(cooldowns(), held, 'GM removal does not release the cooldown');
      await refused('actor_spell_approve', pcApproval(ref), 'ability_on_cooldown', owner);
      await advanceTo(6); assert.deepEqual(cooldowns(), {});
    });

    it('Stunned rider (no immediate part, manual expiry): cast pays once and starts the cooldown; removal does not release it; release does not remove Stunned; the coincident boundary ends a timed Stunned and releases in one receipt independently', async() => {
      await startCombat(); await adopt();
      const manual = await admitPc(riderRecord({ name: 'Disposable Stagger', kind: 'stunned', policy: 'gm-manual', cooldownValue: 1 }));
      const before = pools(), startHp = hp(other);
      const { c } = await cast(manual, { t: other });
      assert.equal(spent(before, pools(), 'ap'), 2); assert.equal(spent(before, pools(), 'mana'), 3); assert.deepEqual(hp(other), startHp);
      assert.equal(stuns(other).length, 1); assert.equal(Object.values(cooldowns())[0].commandId, c.commandId);
      await advanceTo(3); assert.deepEqual(cooldowns(), {}); assert.equal(stuns(other).length, 1, 'release does not remove a manual Stunned');
      await cast(manual, { t: other }); const held = cooldowns();
      for (const s of stuns(other)) {await accept(remove(other, s.recordId));}
      assert.equal(stuns(other).length, 0); assert.deepEqual(cooldowns(), held, 'removing Stunned does not release the cooldown');
      await advanceTo(6); assert.deepEqual(cooldowns(), {});
      assert.equal((await ack(gm, 'combat_ended', { roomId: room.id })).success, true);
      // Coincident boundary: roster [target, pc], cast during the target's ongoing turn. target-next-end → expiry at seq 3; N=2 → PC starts 1, 3.
      const timed = await admitPc(riderRecord({ name: 'Disposable Flash Stun', kind: 'stunned', policy: 'target-next-end', cooldownValue: 2 }));
      await startCombat([target, pc]); await adopt();
      await cast(timed); const key = cooldown.key(pc, timed.definitionId); assert.equal(cooldowns()[key].dueSequence, 3);
      await advanceTo(2); assert.equal(stuns(target).length, 1);
      const n = actors.ledger(live()).receipts.length, both = await advance(); assert.equal(seq(), 3);
      assert.equal(actors.ledger(live()).receipts.length, n + 1, 'one boundary receipt'); assert.equal(stuns(target).length, 0); assert.equal(cooldowns()[key], undefined);
      assert.equal(chosen(both.r).expired.length, 1);
    });

    it('review F2/F5: a rider aimed at a PC is refused by the cooldown route alone; Stunned + immediate healing casts atomically; a rider cooldown on a retired clock stays blocked/manual and is never reset', async() => {
      // A second primary owner PC (distinct from the caster) as the would-be target.
      live().gameState.maps.default.characterTokens.pc2 = { id: 'pc2', ownerUserId: ownerUid, character: { id: 'c2', class: 'Arcanoneer', health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, tempMana: 0, tempActionPoints: 0 }, state: { conditions: [] } };
      server.setCharacterOwner('c2', ownerUid);
      const bound = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc2', ownerUid, characterId: 'c2' }, snapshotHash: actors.hash(live().gameState.maps.default.characterTokens.pc2) });
      assert.equal(bound.success, true, JSON.stringify(bound)); const pc2 = bound.ref;
      await startCombat(); await adopt();
      // Control: without the cooldown, a movement rider aimed at that PC reaches the GM (existing M3A route); with it, only the cooldown check refuses.
      const free = await admitPc(riderRecord({ name: 'Disposable Free Hobble', cooldownType: null }));
      const pcA = pcApproval(free, { t: pc2 }); await approve(pcA); await withdraw(pcA);
      const hobble = await admitPc(riderRecord({ name: 'Disposable Held Hobble', cooldownValue: 2 }));
      await refused('actor_spell_approve', pcApproval(hobble, { t: pc2 }), 'unsupported_cooldown_route', owner);
      const ref = await admitPc(riderRecord({ kind: 'stunned', direct: 'healing', policy: 'target-start-count', occurrences: 2, cooldownValue: 2 }));
      await refused('actor_spell_approve', pcApproval(ref, { t: pc2 }), 'unsupported_cooldown_route', owner);
      const before = pools(), startHp = hp(target);
      const { c } = await cast(ref, { faces: [3, 2] });
      assert.equal(receiptsFor(c.commandId).length, 1); assert.equal(spent(before, pools(), 'mana'), 3);
      assert.deepEqual(hp(target), { current: Math.min(60, startHp.current + 5), temp: startHp.temp }, '2d4 = 5 healing');
      assert.equal(stuns(target).length, 1); const held = cooldowns(); assert.equal(Object.values(held)[0].commandId, c.commandId);
      assert.equal((await ack(gm, 'combat_ended', { roomId: room.id })).success, true);
      assert.deepEqual(cooldowns(), held); await refused('actor_spell_approve', pcApproval(ref), 'cooldown_clock_retired', owner);
      await startCombat(); await adopt(); for (let i = 0; i < 7; i++) {await advance();}
      assert.deepEqual(cooldowns(), held, 'a new clock never releases a rider cooldown recorded on the retired one');
      await refused('actor_spell_approve', pcApproval(ref), 'cooldown_clock_retired', owner);
    });

    it('refused applications change neither payment nor cooldown: missing target schedule, an unresolved movement combination from a changed copy, and a stale target', async() => {
      await startCombat(); await adopt();
      const ref = await admitPc(riderRecord({ cooldownValue: 1 }));
      // `other` is outside the roster: a structured expiry has no authenticated schedule, so nothing installs, is charged or starts.
      let a = pcApproval(ref, { t: other }); await approve(a);
      let stop = world(), x = await ack(gm, 'actor_consequence', command(a)); assert.equal(x.success, false); assert.equal(x.code, 'effect_schedule_unavailable', JSON.stringify(x)); assert.deepEqual(world(), stop);
      await withdraw(a);
      // A stale target revision refuses the whole command.
      a = pcApproval(ref); await approve(a); const stale = command(a);
      await accept({ ...base(), actors: [{ ref: target, expectedRevision: token(target).state.actorContract.revision, finalResources: { hp: { current: 49, temp: 3 } } }], adjudication: { definitionId: 'gm-correction', definitionVersionOrHash: 'gm-correction', finalAmount: 0, adjustmentReason: '', chosenResult: 'GM correction' } });
      stop = world(); x = await ack(gm, 'actor_consequence', { ...stale, baseCommitSequence: actors.ledger(live()).commitSequence }); assert.equal(x.success, false); assert.equal(x.code, 'approval_mismatch', JSON.stringify(x)); assert.deepEqual(world(), stop); assert.deepEqual(cooldowns(), {});
      await withdraw(a);
      // Cast v1, wait for release, then a copy with changed authored terms (same definition ID → same cooldown) meets the active v1 rider.
      const v1 = await admitPc(riderRecord({ name: 'Disposable Mire', label: 'Mired', policy: 'target-end-count', occurrences: 3, cooldownValue: 1 }));
      await cast(v1); await advanceTo(3); assert.equal(moves(target).length, 1); assert.deepEqual(cooldowns()[cooldown.key(pc, v1.definitionId)], undefined);
      const rec2 = riderRecord({ name: 'Disposable Mire', label: 'Deep mire', policy: 'target-end-count', occurrences: 3, cooldownValue: 1 }); rec2.authoredDefinitionId = entryFor(v1).canonicalDefinition.definitionId;
      const v2 = await admitPc(rec2, 2);
      a = pcApproval(v2); const plan = effect.conditionPlan(a, token(target).state.conditions); assert.equal(plan.refused.code, 'modifier_combination_unresolved');
      stop = world(); const y = await ack(owner, 'actor_spell_approve', a);
      if (y.code === 'awaiting_gm') { const z = await ack(gm, 'actor_consequence', command(a)); assert.equal(z.success, false, JSON.stringify(z)); assert.match(z.code, /combination/); await withdraw(a); }
      else {assert.equal(y.success, false); assert.match(y.code, /combination/, JSON.stringify(y));}
      assert.deepEqual(world(), stop, 'nothing paid, applied or started');
    });

    it('competing confirmations and recovery: racing confirmations execute once; lost ACK, GM reload (checkpoint rebuild) and owner snapshot recover the original command once with the rider and cooldown intact', async() => {
      await startCombat(); await adopt();
      const ref = await admitPc(riderRecord({ direct: 'damage', cooldownValue: 2, policy: 'target-start-count', occurrences: 2 }));
      const a = pcApproval(ref); await approve(a);
      await refused('actor_spell_approve', pcApproval(ref), 'approval_pending', owner);
      const c = command(a), rival = { ...c, commandId: uuid() };
      const confirmations = await Promise.all([ack(gm, 'actor_consequence', c), ack(gm, 'actor_consequence', rival)]);
      assert.equal(confirmations.filter(r => r.success).length, 1, JSON.stringify(confirmations)); assert.equal(confirmations.find(r => !r.success).code, 'approval_consumed');
      const accepted = confirmations[0].success ? c : rival, receipt = confirmations.find(r => r.success).receipt;
      assert.equal(moves(target).length, 1); assert.equal(Object.keys(cooldowns()).length, 1);
      const codec = require('../services/roomCheckpoint'), built = codec.buildCheckpointDocuments({ roomId: room.id, gameState: live().gameState, revision: 1 });
      const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])) }); assert.equal(decoded.ok, true);
      const snapshot = world();
      server.rooms.set(room.id, { ...live(), gameState: { ...decoded.global, maps: decoded.maps, ...codec.deriveRootMirrors(decoded.maps) }, checkpointRevision: 1 });
      assert.deepEqual(world(), snapshot);
      gm.emit('actor_consequence', accepted); await sleep(100);
      assert.deepEqual((await ack(gm, 'actor_consequence', accepted)).receipt, receipt); assert.deepEqual(world(), snapshot); assert.equal(receiptsFor(accepted.commandId).length, 1);
      await refused('actor_consequence', { ...accepted, adjudication: { ...accepted.adjudication, finalAmount: 1, adjustmentReason: 'changed' } }, 'command_id_conflict');
      const view = await ack(owner, 'actor_snapshot', { roomId: room.id }); assert.deepEqual(view.maps.default.characterTokens.pc.state.authoredCooldowns, cooldowns());
      await refused('actor_spell_approve', pcApproval(ref), 'ability_on_cooldown', owner);
      await advanceTo(5); assert.equal(moves(target).length, 0, 'counted rider ended at the target\'s second start (5)'); assert.equal(Object.keys(cooldowns()).length, 1);
      await advance(); assert.deepEqual(cooldowns(), {});
    });
  });
});
