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
 * Composed cooldowns: the installed authenticated caster-start cooldown (handoff/wizard-cooldowns/APPROVAL.md) on the installed
 * immediate + periodic composition (handoff/m5-composition). Disposable Wizard records only; no catalogue spell, no new timing rule.
 * Roster [pc, source, target] (period 3): the PC's turn starts at sequences 0, 3, 6, 9; the target's at 2, 5, 8.
 */
function composedRecord({ name = 'Disposable Searing Brand', kind = 'damage', nowFormula = kind === 'damage' ? '1d6+2' : '2d4', formula = '1d4', policy = 'target-start-count', occurrences = 3,
  label = 'Searing Brand', restriction = 'any', ap = 1, mana = 2, cooldownValue = 1, cooldownType = cooldown.TYPE, element = 'ember', extra } = {}) {
  const c = { profile: pure.EFFECT_CAPABILITY, effect: 'periodic', periodicKind: kind, periodicFormula: formula, ...(kind === 'damage' ? { periodicDamageType: 'blight' } : {}),
    tickRoll: 'each-tick', label, expiryPolicy: policy, ...(occurrences !== null ? { occurrences } : {}), durationText: 'While the brand smoulders', gmNote: 'GM resolves eligibility and range before confirming success.' };
  const d = { name, description: 'Composed cooldown disposable test', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: [kind, 'control'], controlConfig: { authoredCondition: c },
    ...(kind === 'damage' ? { damageConfig: { damageType: 'direct', elementType: element, formula: nowFormula, resolution: 'DICE' } } : { healingConfig: { healingType: 'direct', formula: nowFormula, resolution: 'DICE' } }),
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: [restriction] }, resourceCost: { actionPoints: ap, mana },
    ...(cooldownType !== null ? { cooldownConfig: { cooldownType, cooldownValue } } : {}) };
  if (extra) {extra(d);}
  return { ...actors.clone(d), authoredDraft: d, authoredDefinitionId: uuid() };
}

describe('Composed cooldowns — immediate + periodic bundle with the authenticated caster-start cooldown, registered production handlers', function() {
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
    const e = entryFor(ref), d = e.canonicalDefinition, f = d.effects.direct.formula, names = pure.formulaAttributes(f);
    const common = { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence, source: pc, target: t,
      spell: spellOf(e), price: e.descriptor.price, classPayment: null, effectTerms: effect.termsFor(d) };
    if (!names.length) {return { ...common, roll: rollFor(f, faces) };}
    // M5 composition + M4A: owner-attested scores and the caster snapshot binding (unchanged rules).
    const rollAttributes = Object.fromEntries(names.map(n => [n, token(pc).character.stats[n]])), reading = pure.readScaledFormula(f, rollAttributes);
    const dice = reading.dice.map(g => ({ sides: g.sides, faces: Array(g.count).fill(2) })), projected = require('../services/roomAccessService').projectTokenForClient(token(pc));
    return { ...common, roll: { mode: 'physical', dice, constant: reading.constant, reading: reading.reading, total: dice.reduce((a, g) => a + g.faces.reduce((x, y) => x + y, 0), reading.constant) },
      rollAttributes, formulaSourceRevision: token(pc).state.actorContract.revision, formulaSourceHash: actors.hash({ character: projected.character, conditions: projected.state?.conditions || [] }) };
  }
  async function approve(a) { const before = actors.clone(live().gameState), r = await ack(owner, 'actor_spell_approve', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); assert.deepEqual(live().gameState, before, 'approval spends nothing'); return r; }
  function command(a, { amount, reason = '' } = {}) {
    const pools = actors.resources(token(a.source), 'character'), pay = {};
    for (const p of ['ap', 'mana']) {if (a.price[p]) {pay[p] = payments.tempFirst(pools[p].current, pools[p].temp, a.price[p]);}}
    if (!Object.keys(pay).length) {pay.ap = payments.tempFirst(pools.ap.current, pools.ap.temp, 0);}
    const finalAmount = amount ?? a.roll.total, direct = a.effectTerms.direct;
    const plan = effect.conditionPlan(a, token(a.target).state.conditions || []);
    const targetEntry = { ref: a.target, expectedRevision: token(a.target).state.actorContract.revision, conditions: plan.ops || [{ op: 'add', recordId: a.approvalId, record: effect.recordFor(a) }] };
    const hp = actors.resources(token(a.target), a.target.kind).hp, fromTemp = Math.min(hp.temp, finalAmount);
    targetEntry.finalResources = { hp: direct.kind === 'damage' ? { current: Math.max(0, hp.current - (finalAmount - fromTemp)), temp: hp.temp - fromTemp } : { current: Math.min(hp.max, hp.current + finalAmount), temp: hp.temp } };
    return { ...base(), source: a.source, target: a.target, approval: { approvalId: a.approvalId, contentHash: actors.hash(a) },
      actors: [{ ref: a.source, expectedRevision: token(a.source).state.actorContract.revision, finalResources: pay }, targetEntry],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, finalAmount, adjustmentReason: reason, chosenResult: JSON.stringify(effect.resultFor(a, resolution({ timing: a.effectTerms.timing }), plan.combination || null)) } };
  }
  async function accept(c) { const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true, JSON.stringify(r)); return r; }
  async function cast(ref, opts) { const a = pcApproval(ref, opts); await approve(a); const c = command(a), r = await accept(c); return { a, c, r }; }
  async function refused(event, data, code, socket = gm) { const before = actors.clone(live().gameState), r = await ack(socket, event, data); assert.equal(r.success, false, JSON.stringify(r)); if (code) {assert.equal(r.code, code, JSON.stringify(r));} assert.deepEqual(live().gameState, before, `${event} changed nothing`); return r; }
  const cooldowns = () => actors.clone(token(pc).state.authoredCooldowns || {});
  const statusOf = ref => cooldown.status(token(pc), live().gameState.combat, pc, ref.definitionId);
  const periodic = ref => token(ref).state.conditions.filter(profile.isPeriodicTick);
  const due = () => timing.dueTicks(live().gameState.combat);
  const hp = ref => { const v = actors.resources(token(ref), ref.kind).hp; return { current: v.current, temp: v.temp }; };
  const pools = () => actors.clone(actors.resources(token(pc), 'character'));
  const receiptsFor = commandId => actors.ledger(live()).receipts.filter(x => x.commandId === commandId);
  const chosen = r => JSON.parse(r.receipt.adjudication.chosenResult);
  const ticksOf = x => chosen(x.r ?? x).ticks || [];
  function resolveReq(t, { faces = [2], mode = 'apply', reason = '' } = {}) {
    if (mode === 'dismiss') {return { ...base(), tickId: t.tickId, mode, adjustmentReason: reason || 'GM resolved this tick by hand at the table' };}
    const r = rollFor(t.tick.formula, faces); return { ...base(), tickId: t.tickId, mode, expectedRevision: token(t.ref).state.actorContract.revision, roll: r, finalAmount: r.total, adjustmentReason: reason };
  }
  async function resolve(t, opts) { const c = resolveReq(t, opts), r = await ack(gm, 'actor_periodic_resolve', c); assert.equal(r.success, true, JSON.stringify(r)); return { c, r }; }
  const remove = (ref, id) => ({ ...base(), actors: [{ ref, expectedRevision: token(ref).state.actorContract.revision, conditions: [{ op: 'remove', recordId: id }] }],
    adjudication: { definitionId: 'gm-correction', definitionVersionOrHash: 'gm-correction', finalAmount: 0, adjustmentReason: '', chosenResult: 'GM exact removal' } });
  /** Everything a cast could change: caster pools, target HP/conditions, cooldowns, schedules, open ticks and the receipt count. */
  const world = () => ({ pools: pools(), hp: hp(target), conditions: actors.clone(token(target).state.conditions), cooldowns: cooldowns(),
    schedules: actors.clone(live().gameState.combat?.effectLifecycle?.schedules || {}), dueTicks: actors.clone(live().gameState.combat?.effectLifecycle?.dueTicks || {}), receipts: actors.ledger(live()).receipts.length });
  const opts = () => ({ roomId: room.id, definitionVersion: 1, classId: 'arcanoneer' });

  it('compiler and registry: an immediate + periodic same-kind bundle accepts the authenticated cooldown under its own compiler ids; attribute, flat DR and save shapes and legacy timing stay manual; bundles without a cooldown keep their bytes', () => {
    const plain = pure.definitionFromWizard(composedRecord({ cooldownValue: 2 }), opts());
    assert.equal(plain.ok, true, JSON.stringify(plain));
    assert.deepEqual(plain.definition.cooldown, { cooldownType: cooldown.TYPE, cooldownValue: 2 });
    assert.equal(plain.definition.capability, pure.EFFECT_CAPABILITY); assert.equal(plain.definition.schemaVersion, 3);
    const compiled = definitions.compileDefinition(plain.definition);
    assert.equal(compiled.ok, true); assert.equal(compiled.descriptor.compilerVersion, 'p14-m5-composition-cooldown-1'); assert.deepEqual(compiled.descriptor.cooldown, plain.definition.cooldown);
    const scaled = pure.definitionFromWizard(composedRecord({ nowFormula: '2d8 + intelligence/3', element: 'blight' }), opts());
    assert.equal(scaled.ok, true, JSON.stringify(scaled)); assert.equal(definitions.compileDefinition(scaled.definition).descriptor.compilerVersion, 'p14-m5-composition-formula-cooldown-1');
    const healing = pure.definitionFromWizard(composedRecord({ kind: 'healing', restriction: 'ally' }), opts()); assert.equal(healing.ok, true, JSON.stringify(healing));
    // Without a cooldown the existing composition keeps its exact definition and compiler identity (no `cooldown` key at all).
    const without = pure.definitionFromWizard(composedRecord({ cooldownType: null }), opts()).definition;
    assert.equal(Object.hasOwn(without, 'cooldown'), false); assert.equal(definitions.compileDefinition(without).descriptor.compilerVersion, 'p14-m5-composition-1');
    assert.equal(Object.hasOwn(definitions.compileDefinition(without).descriptor, 'cooldown'), false);
    // Review F8: a composition without a cooldown keeps its exact pinned definition hash and descriptor bytes (measured identical on the base).
    const pinned = pure.definitionFromWizard({ ...composedRecord({ cooldownType: null }), authoredDefinitionId: '70000000-0000-4000-8000-0000000000aa' }, { roomId: 'pinned-room', definitionVersion: 1, classId: 'arcanoneer' });
    const pinnedCompiled = definitions.compileDefinition(pinned.definition);
    assert.equal(pinnedCompiled.definitionHash, 'b10cf72baa6bce3eb03d2c36bb73c611631fcb030af6a4571353ab59a430b5aa');
    assert.equal(require('crypto').createHash('sha256').update(JSON.stringify(pinnedCompiled.descriptor)).digest('hex'), '85b8798880bc57cd04eece5f9556148a5565d101e5cad308065a07f8bc0d9ae0');
    // Review F2: each fence record compiles WITHOUT its cooldown and refuses WITH it, for the cooldown reason (not an unrelated one).
    // Effect cooldowns (handoff/effect-cooldowns): periodic-only and movement/Stunned riders now carry the cooldown (p14EffectCooldown suite).
    // Attribute and flat DR riders stay fenced. Fence update (rider-save cooldowns): the Stunned save bundle moved to p14RiderSaveCooldown.
    const attributeDraft = d => { d.controlConfig.authoredCondition = { profile: pure.EFFECT_CAPABILITY, effect: 'attribute', attribute: 'agility', attributeAmount: -2, label: 'Leaden', expiryPolicy: 'target-next-end', durationText: 'x', gmNote: 'y' }; };
    const drDraft = d => { d.controlConfig.authoredCondition = { profile: pure.EFFECT_CAPABILITY, effect: 'damageReduction', drAmount: 2, label: 'Warded', expiryPolicy: 'target-next-end', durationText: 'x', gmNote: 'y' }; d.effectTypes = ['healing', 'control']; delete d.damageConfig; d.healingConfig = { healingType: 'direct', formula: '2d4', resolution: 'DICE' }; d.targetingConfig.targetRestrictions = ['ally']; };
    const saveDraft = d => { d.controlConfig.authoredCondition = { profile: pure.EFFECT_CAPABILITY, effect: 'stunned', expiryPolicy: 'target-next-end', durationText: 'x', gmNote: 'y', save: { ability: 'constitution', dc: 13, outcome: 'negates' } }; };
    const shapes = { drRider: drDraft };
    for (const [name, extra] of Object.entries(shapes)) {
      assert.equal(pure.definitionFromWizard(composedRecord({ cooldownType: null, extra }), opts()).ok, true, `${name} without a cooldown is a supported bundle`);
      const r = pure.definitionFromWizard(composedRecord({ extra }), opts());
      assert.equal(r.ok, true, name); assert.equal(definitions.compileDefinition(r.definition).descriptor.compilerVersion, 'p14-a10-flat-dr-cooldown-1');
    }
    for (const [name, rec] of Object.entries({ turnBased: composedRecord({ cooldownType: 'turn_based', cooldownValue: 2 }), rounds: composedRecord({ cooldownType: 'rounds', cooldownValue: 1 }), shortRest: composedRecord({ cooldownType: 'short_rest', cooldownValue: 1 }),
      eleven: composedRecord({ cooldownValue: 11 }), zero: composedRecord({ cooldownValue: 0 }) })) {
      const r = pure.definitionFromWizard(actors.clone(rec), opts()); assert.equal(r.ok, false, name); assert.match(r.reason, /cooldownConfig: legacy turns\/rounds\/rests\/charges/, name);
    }
    const extraKey = pure.definitionFromWizard(composedRecord({ extra: d => { d.cooldownConfig.resetOnCombatEnd = true; } }), opts()); assert.equal(extraKey.ok, false); assert.match(extraKey.reason, /cooldownConfig/);
    // Registry fence: a `cooldown` key on any other effect shape, or an invalid value, is not decodable; the same definitions without it are.
    const single = pure.definitionFromWizard(composedRecord({ cooldownType: null, extra: attributeDraft }), opts()).definition;
    const stun = pure.definitionFromWizard(composedRecord({ cooldownType: null, extra: saveDraft }), opts()).definition;
    const bare = actors.clone(plain.definition); delete bare.cooldown;
    for (const d of [single, stun, bare]) assert.equal(definitions.compileDefinition(d).ok, true);
    // Fence update (rider-save cooldowns): the Stunned save bundle with the cooldown key now compiles under its own label.
    assert.equal(definitions.compileDefinition(Object.assign(actors.clone(stun), { cooldown: { cooldownType: cooldown.TYPE, cooldownValue: 1 } })).descriptor.compilerVersion, 'p14-save-branch-timed-cooldown-1');
    assert.equal(definitions.compileDefinition({ ...single, cooldown: { cooldownType: cooldown.TYPE, cooldownValue: 1 } }).descriptor.compilerVersion, 'p14-a10-attribute-cooldown-1');
    for (const d of [Object.assign(actors.clone(bare), { cooldown: { cooldownType: cooldown.TYPE, cooldownValue: 11 } }), Object.assign(actors.clone(bare), { cooldown: { cooldownType: 'turn_based', cooldownValue: 1 } }),
      Object.assign(actors.clone(bare), { cooldown: null })]) {
      assert.equal(definitions.compileDefinition(d).ok, false, JSON.stringify(d.cooldown));
    }
  });

  it('atomic initial cast: one receipt pays once, applies the immediate HP change, installs ONE periodic instance and starts the cooldown; blocked reuse spends nothing; cooldown release does not cancel remaining ticks and ticks never touch the cooldown', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(composedRecord({ cooldownValue: 1, occurrences: 3 }));
    const before = pools(), startHp = hp(target);
    const { a, c, r } = await cast(ref, { faces: [5] });
    // One receipt carrying all four consequences.
    assert.equal(receiptsFor(c.commandId).length, 1);
    const paid = pools(); assert.equal(paid.mana.current + paid.mana.temp, before.mana.current + before.mana.temp - 2); assert.equal(paid.ap.current + paid.ap.temp, before.ap.current + before.ap.temp - 1);
    assert.deepEqual(hp(target), { current: startHp.current - 4, temp: 0 }, '7 = 3 temp + 4 HP');
    assert.equal(periodic(target).length, 1); assert.equal(due().length, 0, 'the cast records no tick');
    const items = Object.values(cooldowns()); assert.equal(items.length, 1);
    assert.deepEqual([items[0].startSequence, items[0].dueSequence, items[0].occurrences, items[0].period, items[0].commandId], [0, 3, 1, 3, c.commandId], 'N=1 at the PC\'s ongoing turn releases at its next start (3)');
    assert.equal(chosen(r).condition.kind, 'periodic'); assert.equal(chosen(r).roll.total, a.roll.total);
    // Blocked reuse: refused at approval before anything is spent.
    await refused('actor_spell_approve', pcApproval(ref), 'ability_on_cooldown', owner);
    await advanceTo(2); assert.equal(due().length, 1, 'tick 1 at the target start (2)');
    const ticking = cooldowns(), t1 = await resolve(due()[0], { faces: [3] });
    assert.deepEqual(cooldowns(), ticking, 'tick resolution neither restarts nor extends the cooldown');
    // Tick-command replay returns the original receipt and touches nothing, cooldown included.
    const afterTick = world(); assert.deepEqual((await ack(gm, 'actor_periodic_resolve', t1.c)).receipt, t1.r.receipt); assert.deepEqual(world(), afterTick);
    await refused('actor_spell_approve', pcApproval(ref), 'ability_on_cooldown', owner);
    // Order A: the cooldown releases first (boundary 3); the instance, its schedule and its remaining ticks are untouched.
    const schedulesBefore = actors.clone(live().gameState.combat.effectLifecycle.schedules), instance = actors.clone(periodic(target));
    await advance(); assert.equal(seq(), 3); assert.deepEqual(cooldowns(), {}, 'released at the authenticated boundary');
    assert.deepEqual(periodic(target), instance); assert.deepEqual(live().gameState.combat.effectLifecycle.schedules, schedulesBefore);
    await advance(); const fifth = await advance(); assert.equal(seq(), 5);
    assert.deepEqual(ticksOf(fifth).map(t => [t.occurrence, t.of]), [[2, 3]], 'tick 2 still arrives after the cooldown released');
    // A legal second cast passes the cooldown gate, but the existing second-periodic-stream refusal stays atomic: nothing paid, no HP, no new cooldown.
    const b = pcApproval(ref); await approve(b);
    const stop = world(); const x = await ack(gm, 'actor_consequence', command(b)); assert.equal(x.success, false); assert.equal(x.code, 'periodic_combination_unresolved', JSON.stringify(x)); assert.deepEqual(world(), stop);
    assert.equal((await ack(owner, 'actor_spell_withdraw', { roomId: room.id, approvalId: b.approvalId, approval: b })).success, true);
    await resolve(due()[0], { faces: [1] }); await advanceTo(8); assert.equal(due()[0].final, true); await resolve(due()[0], { faces: [1] }); assert.equal(periodic(target).length, 0);
    // Legal reuse once every existing condition holds: a new cooldown from the current position (seq 8 is the target's turn → next PC start 9).
    const second = await cast(ref); assert.equal(Object.values(cooldowns())[0].dueSequence, 9); assert.equal(Object.values(cooldowns())[0].commandId, second.c.commandId); assert.equal(periodic(target).length, 1);
  });

  it('order B: periodic expiry and GM removal never release the cooldown early; it releases only at its own authenticated boundary', async() => {
    await startCombat(); await adopt();
    const longCd = await admitPc(composedRecord({ name: 'Disposable Long Brand', cooldownValue: 3, policy: 'target-next-start', occurrences: null }));
    const removed = await admitPc(composedRecord({ name: 'Disposable Snuffed Brand', cooldownValue: 3, occurrences: 2 }));
    await cast(longCd); const longItem = Object.values(cooldowns())[0]; assert.equal(longItem.dueSequence, 9, 'N=3: PC starts 3, 6, 9');
    // The 1-tick instance ends with its own final tick at the target's next start (2); the cooldown stays.
    await advanceTo(2); assert.equal(due().length, 1); assert.equal(due()[0].final, true); assert.equal(periodic(target).length, 0, 'the last tick ended the instance');
    await resolve(due()[0]); assert.equal(due().length, 0);
    assert.equal(statusOf(longCd).code, 'ability_on_cooldown'); await refused('actor_spell_approve', pcApproval(longCd), 'ability_on_cooldown', owner);
    // A different definition on the other creature, removed by the GM straight away: its cooldown is untouched by the removal.
    await advanceTo(3); const snuffed = await cast(removed); const snuffedKey = cooldown.key(pc, removed.definitionId), held = cooldowns()[snuffedKey];
    assert.deepEqual([held.commandId, held.startSequence, held.dueSequence], [snuffed.c.commandId, 3, 12], 'N=3 from the ongoing PC turn at 3: starts 6, 9, 12');
    await accept(remove(target, snuffed.a.approvalId)); assert.equal(periodic(target).length, 0); assert.deepEqual(cooldowns()[snuffedKey], held, 'removing the effect does not clear its cooldown');
    await refused('actor_spell_approve', pcApproval(removed), 'ability_on_cooldown', owner);
    await advanceTo(8); assert.equal(statusOf(longCd).remaining, 1);
    await advance(); assert.equal(seq(), 9); assert.equal(cooldowns()[cooldown.key(pc, longCd.definitionId)], undefined, 'the long cooldown releases only at boundary 9');
    assert.deepEqual(cooldowns()[snuffedKey], held, 'the removed effect\'s cooldown keeps its own boundary (12)');
    await cast(longCd);
  });

  it('concurrency and replay: two pending approvals cannot coexist; racing confirmations execute once with one cooldown; the initial command replays to the original receipt; a changed body conflicts', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(composedRecord({ cooldownValue: 2 })), a = pcApproval(ref), b = pcApproval(ref), before = world();
    const results = await Promise.all([ack(owner, 'actor_spell_approve', a), ack(owner, 'actor_spell_approve', b)]);
    assert.deepEqual(results.map(r => r.code).sort(), ['approval_pending', 'awaiting_gm']); assert.deepEqual(world(), before);
    const winner = results[0].code === 'awaiting_gm' ? a : b, c = command(winner), rival = { ...c, commandId: uuid() };
    const confirmations = await Promise.all([ack(gm, 'actor_consequence', c), ack(gm, 'actor_consequence', rival)]);
    assert.equal(confirmations.filter(r => r.success).length, 1, JSON.stringify(confirmations)); assert.equal(confirmations.find(r => !r.success).code, 'approval_consumed');
    const accepted = confirmations[0].success ? c : rival, receipt = confirmations.find(r => r.success).receipt;
    assert.equal(Object.keys(cooldowns()).length, 1); assert.equal(periodic(target).length, 1);
    // Lost ACK: the same command (twice) returns the original receipt and changes nothing.
    const after = actors.clone(live().gameState);
    gm.emit('actor_consequence', accepted); await sleep(100);
    assert.deepEqual((await ack(gm, 'actor_consequence', accepted)).receipt, receipt); assert.deepEqual(live().gameState, after); assert.equal(receiptsFor(accepted.commandId).length, 1);
    await refused('actor_consequence', { ...accepted, adjudication: { ...accepted.adjudication, finalAmount: 1, adjustmentReason: 'changed' } }, 'command_id_conflict');
    // A fresh command on the consumed approval is refused; a new approval is refused by the cooldown before any spending.
    const fresh = await ack(gm, 'actor_consequence', { ...accepted, commandId: uuid(), baseCommitSequence: actors.ledger(live()).commitSequence }); assert.equal(fresh.success, false); assert.equal(fresh.code, 'approval_consumed', JSON.stringify(fresh)); assert.deepEqual(live().gameState, after);
    await refused('actor_spell_approve', pcApproval(ref), 'ability_on_cooldown', owner);
  });

  it('defence in depth: an approval accepted while the cooldown was ready is refused at GM confirmation against the committed cooldown state of a copy of the same definition — nothing paid, applied or installed', async() => {
    await startCombat([pc, source, target, other]); await adopt();
    const rec = composedRecord({ cooldownValue: 1 }), v1 = await admitPc(rec), v2 = await admitPc(rec, 2);
    const first = await cast(v1, { t: other }), started = Object.values(cooldowns())[0];
    assert.deepEqual([started.startSequence, started.dueSequence, started.period], [0, 4, 4]);
    // The identity is the definition ID: the v2 copy is blocked at approval while v1's cooldown runs.
    await refused('actor_spell_approve', pcApproval(v2), 'ability_on_cooldown', owner);
    await advanceTo(4); assert.deepEqual(cooldowns(), {});
    const pending = pcApproval(v2); await approve(pending);
    // The existing one-pending gate makes a second real cast impossible here, so the committed state a racing cast would leave is
    // installed directly (the exact record shape the P7 stage writes, keyed by actor + definition ID) to prove the confirmation recheck.
    token(pc).state.authoredCooldowns = { [cooldown.key(pc, v1.definitionId)]: { ...started, startSequence: 4, dueSequence: 8, commandId: first.c.commandId } };
    const stop = world(), x = await ack(gm, 'actor_consequence', command(pending));
    assert.equal(x.success, false); assert.equal(x.code, 'ability_on_cooldown', JSON.stringify(x)); assert.deepEqual(world(), stop);
  });

  it('writer failure starts nothing (no payment, HP, instance, schedule or cooldown); the same command then applies all of them once', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(composedRecord({ cooldownValue: 2 })), a = pcApproval(ref); await approve(a);
    const c = command(a), original = writer.admitConsequence; live().isPermanent = true;
    writer.admitConsequence = () => ({ queued: false, code: 'composed_cooldown_writer_refusal' });
    const state = actors.clone(live().gameState), ledgerBefore = actors.clone(actors.ledger(live()));
    const r = await ack(gm, 'actor_consequence', c); assert.equal(r.code, 'composed_cooldown_writer_refusal', JSON.stringify(r));
    assert.deepEqual(live().gameState, state); assert.deepEqual(actors.ledger(live()), ledgerBefore); assert.deepEqual(cooldowns(), {}); assert.equal(periodic(target).length, 0);
    writer.admitConsequence = original; live().isPermanent = false;
    await accept(c); assert.equal(receiptsFor(c.commandId).length, 1); assert.equal(periodic(target).length, 1); assert.equal(Object.values(cooldowns())[0].commandId, c.commandId);
    // Release-side writer failure leaves clock, cooldown and the periodic schedule untouched; the retry releases once.
    await advanceTo(5); live().isPermanent = true; writer.admitConsequence = () => ({ queued: false, code: 'composed_cooldown_writer_refusal' });
    const pre = actors.clone(live().gameState); assert.equal((await ack(gm, 'actor_turn_boundary', boundary())).code, 'composed_cooldown_writer_refusal'); assert.deepEqual(live().gameState, pre);
    writer.admitConsequence = original; live().isPermanent = false; await advance(); assert.equal(seq(), 6); assert.deepEqual(cooldowns(), {});
  });

  it('stale and replaced actors: a changed target, recreated target or recreated source refuses the whole cast with no cooldown; scope gates (PC target, self, creature source) are unchanged', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(composedRecord({ cooldownValue: 2 }));
    let a = pcApproval(ref); await approve(a); let c = command(a);
    await accept({ ...base(), actors: [{ ref: target, expectedRevision: token(target).state.actorContract.revision, finalResources: { hp: { current: 49, temp: 3 } } }], adjudication: { definitionId: 'gm-correction', definitionVersionOrHash: 'gm-correction', finalAmount: 0, adjustmentReason: '', chosenResult: 'GM correction' } });
    await refused('actor_consequence', { ...c, baseCommitSequence: actors.ledger(live()).commitSequence }, 'approval_mismatch'); assert.deepEqual(cooldowns(), {});
    assert.equal((await ack(owner, 'actor_spell_withdraw', { roomId: room.id, approvalId: a.approvalId, approval: a })).success, true);
    for (const who of [target, pc]) {
      a = pcApproval(ref); await approve(a); c = command(a);
      const contract = token(who).state.actorContract, saved = contract.instanceId; contract.instanceId = uuid();
      const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, false); assert.equal(r.code, 'actor_binding_conflict', JSON.stringify(r)); contract.instanceId = saved;
      assert.deepEqual(cooldowns(), {}); assert.equal(periodic(target).length, 0);
      assert.equal((await ack(owner, 'actor_spell_withdraw', { roomId: room.id, approvalId: a.approvalId, approval: a })).success, true);
    }
    await refused('actor_spell_approve', pcApproval(ref, { t: pc }), 'unsupported_cooldown_route', owner);
    map2pc2(); const bound = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc2', ownerUid, characterId: 'c2' }, snapshotHash: actors.hash(live().gameState.maps.default.characterTokens.pc2) });
    assert.equal(bound.success, true, JSON.stringify(bound));
    await refused('actor_spell_approve', pcApproval(ref, { t: bound.ref }), 'unsupported_cooldown_route', owner); assert.deepEqual(cooldowns(), {});
    token(source).authoredAbility = { schemaVersion: 1, record: composedRecord({ name: 'Disposable Creature Brand' }), librarySpellId: null };
    await refused('actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, source, expectedSourceRevision: token(source).state.actorContract.revision, definitionVersion: 1 }, 'unsupported_source_route');
  });
  function map2pc2() {
    live().gameState.maps.default.characterTokens.pc2 = { id: 'pc2', ownerUserId: ownerUid, character: { id: 'c2', class: 'Arcanoneer', health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, tempMana: 0, tempActionPoints: 0 }, state: { conditions: [] } };
    server.setCharacterOwner('c2', ownerUid);
  }

  it('retired clock: combat end keeps the cooldown blocked/manual and retires the open tick (dismiss-only); restart, re-adoption and many advances never reset it', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(composedRecord({ cooldownValue: 2, occurrences: 3 })); await cast(ref);
    await advanceTo(2); assert.equal(due().length, 1); const held = cooldowns(), open = due()[0];
    assert.equal((await ack(gm, 'combat_ended', { roomId: room.id })).success, true);
    assert.deepEqual(cooldowns(), held, 'combat end does not reset the cooldown');
    await refused('actor_spell_approve', pcApproval(ref), 'cooldown_clock_retired', owner);
    await startCombat(); await adopt(); for (let i = 0; i < 7; i++) {await advance();}
    assert.deepEqual(cooldowns(), held, 'a new clock never releases a cooldown recorded on the retired one');
    await refused('actor_spell_approve', pcApproval(ref), 'cooldown_clock_retired', owner);
    const retired = live().gameState.combat.retiredPeriodicTicks?.[open.tickId]; assert.ok(retired, 'the open tick is retained as retired');
    await refused('actor_periodic_resolve', resolveReq(retired), 'periodic_tick_retired');
    await resolve(retired, { mode: 'dismiss' }); assert.deepEqual(cooldowns(), held, 'dismissing a retired tick does not touch the cooldown');
  });

  it('reload/recovery: a checkpoint rebuild keeps the cooldown, the instance, its schedule and open tick; initial and tick commands replay to their original receipts; release and ticks then continue exactly', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(composedRecord({ cooldownValue: 2, occurrences: 3 })), { c, r } = await cast(ref);
    await advanceTo(2); const t1 = await resolve(due()[0], { faces: [4] }); await advanceTo(5); assert.equal(due().length, 1);
    const codec = require('../services/roomCheckpoint'), built = codec.buildCheckpointDocuments({ roomId: room.id, gameState: live().gameState, revision: 1 });
    const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])) }); assert.equal(decoded.ok, true);
    const held = cooldowns(), snapshot = world();
    server.rooms.set(room.id, { ...live(), gameState: { ...decoded.global, maps: decoded.maps, ...codec.deriveRootMirrors(decoded.maps) }, checkpointRevision: 1 });
    assert.deepEqual(cooldowns(), held); assert.deepEqual(world(), snapshot);
    assert.equal(payments.get(live(), r.receipt.authorization.proposalId), null, 'the in-memory approval did not survive the rebuild');
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, r.receipt); assert.deepEqual((await ack(gm, 'actor_periodic_resolve', t1.c)).receipt, t1.r.receipt); assert.deepEqual(world(), snapshot);
    await refused('actor_spell_approve', pcApproval(ref), 'ability_on_cooldown', owner);
    const view = await ack(owner, 'actor_snapshot', { roomId: room.id }); assert.deepEqual(view.maps.default.characterTokens.pc.state.authoredCooldowns, held);
    await advance(); assert.equal(seq(), 6); assert.deepEqual(cooldowns(), {}, 'N=2 releases at the second strictly upcoming PC start (6)');
    await resolve(due()[0]); await advanceTo(8); assert.equal(due()[0].final, true); await resolve(due()[0]); assert.equal(periodic(target).length, 0);
  });

  it('review F6: one boundary that both delivers the final tick (ending the instance) and releases the cooldown does both in one receipt, independently', async() => {
    // Roster [target, pc]; the PC casts off-turn during the target's ongoing turn (seq 0). target-next-end: the ongoing turn's end does not
    // count, so the single (final) tick is the end of the target's NEXT turn = the transition into seq 3. Cooldown N=2: PC starts 1, 3 → due 3.
    await startCombat([target, pc]); await adopt();
    assert.equal(live().gameState.combat.turnOrder[live().gameState.combat.currentTurnIndex].tokenId, 'target');
    const ref = await admitPc(composedRecord({ name: 'Disposable Flash Brand', cooldownValue: 2, policy: 'target-next-end', occurrences: null }));
    const { c } = await cast(ref); const key = cooldown.key(pc, ref.definitionId), item = cooldowns()[key];
    const sched = timing.scheduleFor(periodic(target)[0], live().gameState.combat);
    assert.deepEqual([item.dueSequence, sched.dueSequence], [3, 3], 'cooldown release and the final tick fall on the same authenticated boundary');
    await advanceTo(2); assert.equal(cooldowns()[key].dueSequence, 3); assert.equal(periodic(target).length, 1); assert.equal(due().length, 0);
    const n = actors.ledger(live()).receipts.length, both = await advance(); assert.equal(seq(), 3);
    assert.equal(actors.ledger(live()).receipts.length, n + 1, 'one boundary receipt');
    assert.equal(cooldowns()[key], undefined, 'cooldown released'); assert.equal(periodic(target).length, 0, 'instance ended with its final tick');
    assert.deepEqual(ticksOf(both).map(t => [t.occurrence, t.of, t.final]), [[1, 1, true]], 'the final tick is recorded in the same receipt');
    assert.equal(chosen(both.r).expired.length, 1, 'exactly one instance expired'); assert.ok(!JSON.stringify(token(target).state.conditions).includes(chosen(both.r).expired[0]));
    await resolve(due()[0]); assert.equal(due().length, 0); assert.deepEqual(cooldowns(), {});
    await cast(ref); assert.equal(cooldowns()[key].commandId !== c.commandId, true, 'legal reuse starts a new cooldown');
  });

  it('review F7: a live tick dismissal and a GM removal while a tick is open leave the cooldown exactly unchanged', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(composedRecord({ cooldownValue: 3, occurrences: 3 })); await cast(ref); const held = cooldowns();
    await advanceTo(2); assert.equal(due().length, 1);
    await resolve(due()[0], { mode: 'dismiss' }); assert.deepEqual(cooldowns(), held, 'live dismissal does not touch the cooldown');
    await advanceTo(5); assert.equal(due().length, 1); const open = due()[0];
    await accept(remove(target, periodic(target)[0].recordId)); assert.deepEqual(cooldowns(), held, 'GM removal with an open tick does not touch the cooldown');
    await refused('actor_periodic_resolve', resolveReq(open), 'periodic_tick_stale'); await resolve(open, { mode: 'dismiss' }); assert.deepEqual(cooldowns(), held);
    await refused('actor_spell_approve', pcApproval(ref), 'ability_on_cooldown', owner);
    await advanceTo(9); assert.deepEqual(cooldowns(), {}, 'released only at its own boundary (PC starts 3, 6, 9)');
  });

  it('M4A immediate formula inside the composed bundle keeps owner-attested scores and caster binding; the cooldown starts in the same receipt and blocks reuse', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(composedRecord({ name: 'Disposable Mind Brand', nowFormula: '2d8 + intelligence/3', element: 'blight', cooldownValue: 1 }));
    const a = pcApproval(ref); assert.deepEqual(a.rollAttributes, { intelligence: 14 }); assert.equal(a.roll.total, 8, '2+2 + INT 14/3 rounded down');
    await approve(a); token(pc).character.stats.intelligence = 16;
    await refused('actor_consequence', command(a), 'owner_reapproval_required'); assert.deepEqual(cooldowns(), {});
    // The stale consent is closed (existing M4A rule); a fresh approval at the restored score casts once.
    token(pc).character.stats.intelligence = 14; await refused('actor_consequence', command(a), 'approval_owner_reapproval_required');
    const fresh = pcApproval(ref); await approve(fresh); const ok = await ack(gm, 'actor_consequence', command(fresh)); assert.equal(ok.success, true, JSON.stringify(ok));
    assert.equal(Object.values(cooldowns())[0].dueSequence, 3); assert.equal(periodic(target).length, 1);
    await refused('actor_spell_approve', pcApproval(ref), 'ability_on_cooldown', owner);
  });
});
