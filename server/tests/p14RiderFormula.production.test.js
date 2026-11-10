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
const cooldown = require('../../vtt-react/src/services/authoredCooldown');
const once = (s, e) => new Promise(r => s.once(e, r));
const ack = (s, e, d) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error(e)), 5000); s.emit(e, d, r => { clearTimeout(t); resolve(r); }); });
const sleep = ms => new Promise(res => setTimeout(res, ms));

/**
 * Formula riders: an immediate damage OR healing part in the installed M4A attribute vocabulary next to ONE existing movement OR
 * Stunned rider (A10 bundle), through the same shared engine as the M5 composition formula: the shared scaled reader, owner-attested
 * inputs, the caster-snapshot binding with retained-face reapproval, GM confirmation, the A11 rider planner and the P7 consequence stage.
 * Primary owner PC → one placed creature; AP/mana only. No cooldown, save, class payment, area, PC target or creature source.
 * Roster [pc, source, target] (period 3): the target's turn starts at sequences 2, 5, 8 and ends at 3, 6, 9.
 */
/** Measured on the pre-change base (same as the effect-cooldown pins): plain riders keep these exact bytes. */
const PINNED = {
  move: { definitionHash: 'fe17ef5d441e4acd706d6feed9c5b933b8f92b8924419f8a1b26b8d5b85e780a', descriptor: 'cc8992f4824249a4675f479da091893d9a26ae15faaca8c4ac07ec9d45a94678' },
  stun: { definitionHash: 'a13475cfa5c822b54890e31580f542d91948f9d621d129ba7018da0a1d0b5bc6', descriptor: 'ebe1f6c5f79ded3fcb4ded6c603b1928f42b86db9617cfa517ae00bc97ece774' }
};
/** Disposable Wizard rider record. `formula` sets the immediate part; null leaves a field out. */
function riderRecord({ name = 'Disposable Mind Hobble', kind = 'movement', feet = -10, label = 'Hobbled', policy = 'target-next-end', occurrences, direct = 'damage',
  formula = direct === 'healing' ? '1d4 + spirit/2' : '2d6 + intelligence/3', ap = 2, mana = 3, cooldownValue = 1, cooldownType = null, description = 'Formula rider disposable test', extra } = {}) {
  const c = { profile: pure.EFFECT_CAPABILITY, effect: kind, ...(kind === 'movement' ? { movementFeet: feet, label } : {}), expiryPolicy: policy, ...(occurrences !== undefined ? { occurrences } : {}),
    durationText: 'Until the embers cool', gmNote: 'GM resolves eligibility, range and any save before confirming success.' };
  const d = { name, description, spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' },
    effectTypes: direct ? [direct, 'control'] : ['control'], controlConfig: { authoredCondition: c },
    ...(direct === 'damage' ? { damageConfig: { damageType: 'direct', elementType: 'ember', formula, resolution: 'DICE' } } : {}),
    ...(direct === 'healing' ? { healingConfig: { healingType: 'direct', formula, resolution: 'DICE' } } : {}),
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: ap, mana },
    ...(cooldownType !== null ? { cooldownConfig: { cooldownType, cooldownValue } } : {}) };
  if (extra) {extra(d);}
  return { ...actors.clone(d), authoredDraft: d, authoredDefinitionId: uuid() };
}

describe('Formula riders — attribute-scaled immediate part + one movement or Stunned rider, registered production handlers', function() {
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
      const t = { id, name: id, creatureId: 'disposable', stats: { maxHp: 60, maxMana: 20, maxAP: 10, speed: 30 }, authoredAbility: { schemaVersion: 1, record: riderRecord(), librarySpellId: null },
        state: { currentHp: 50, currentMana: 20, currentActionPoints: 10, tempHealth: 3, tempMana: 2, tempActionPoints: 1, conditions: [] } };
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
  const attested = () => ({ ...token(pc).character.stats });
  /** Owner approval with the M4A disclosure: owner-attested scores, the shared reader's constant/reading, and the caster snapshot binding. */
  function formulaApproval(ref, { t = target, faces, scores } = {}) {
    const e = entryFor(ref), d = e.canonicalDefinition, f = d.effects.direct.formula, names = pure.formulaAttributes(f);
    const all = scores || attested(), rollAttributes = Object.fromEntries(names.map(n => [n, all[n]])), reading = pure.readScaledFormula(f, rollAttributes);
    const dice = reading.dice.map((g, i) => ({ sides: g.sides, faces: (faces && faces[i]) || Array(g.count).fill(1) }));
    const projected = require('../services/roomAccessService').projectTokenForClient(token(pc));
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence, source: pc, target: t,
      spell: spellOf(e), roll: { mode: 'physical', dice, constant: reading.constant, reading: reading.reading, total: dice.reduce((a, g) => a + g.faces.reduce((x, y) => x + y, 0), reading.constant) },
      price: e.descriptor.price, classPayment: null, effectTerms: effect.termsFor(d),
      rollAttributes, formulaSourceRevision: token(pc).state.actorContract.revision, formulaSourceHash: actors.hash({ character: projected.character, conditions: projected.state?.conditions || [] }) };
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
  async function cast(ref, opts = {}) { const a = formulaApproval(ref, opts); await approve(a); const c = command(a, opts), r = await accept(c); return { a, c, r }; }
  async function refused(event, data, code, socket = gm) { const before = actors.clone(live().gameState), r = await ack(socket, event, data); assert.equal(r.success, false, JSON.stringify(r)); if (code) {assert.equal(r.code, code, JSON.stringify(r));} assert.deepEqual(live().gameState, before, `${event} changed nothing`); return r; }
  const withdraw = a => ack(owner, 'actor_spell_withdraw', { roomId: room.id, approvalId: a.approvalId, approval: a });
  const moves = ref => token(ref).state.conditions.filter(profile.isMovementModifier);
  const stuns = ref => token(ref).state.conditions.filter(profile.isStunned);
  const hp = ref => { const v = actors.resources(token(ref), ref.kind).hp; return { current: v.current, temp: v.temp }; };
  const pools = () => actors.clone(actors.resources(token(pc), 'character'));
  const spent = (before, after, p) => before[p].current + before[p].temp - after[p].current - after[p].temp;
  const receiptsFor = commandId => actors.ledger(live()).receipts.filter(x => x.commandId === commandId);
  const chosen = r => JSON.parse(r.receipt.adjudication.chosenResult);
  const remove = (ref, id) => ({ ...base(), actors: [{ ref, expectedRevision: token(ref).state.actorContract.revision, conditions: [{ op: 'remove', recordId: id }] }],
    adjudication: { definitionId: 'gm-correction', definitionVersionOrHash: 'gm-correction', finalAmount: 0, adjustmentReason: '', chosenResult: 'GM exact removal' } });
  const schedules = () => actors.clone(live().gameState.combat?.effectLifecycle?.schedules || {});
  /** Everything a cast could change: caster pools, target HP/conditions, schedules, cooldowns and the receipt count. */
  const world = () => ({ pools: pools(), hp: hp(target), conditions: actors.clone(token(target).state.conditions), otherHp: hp(other), otherConditions: actors.clone(token(other).state.conditions),
    schedules: schedules(), cooldowns: actors.clone(token(pc).state.authoredCooldowns || {}), receipts: actors.ledger(live()).receipts.length });
  const opts = () => ({ roomId: room.id, definitionVersion: 1, classId: 'arcanoneer' });
  const pinnedOpts = { roomId: 'pinned-room', definitionVersion: 1, classId: 'arcanoneer' };
  const descriptorSha = c => require('crypto').createHash('sha256').update(JSON.stringify(c.descriptor)).digest('hex');

  it('compiler and registry: movement and Stunned riders accept an M4A attribute immediate part under p14-a10-effect-formula-1; plain riders keep their pinned bytes; class payment, other rider families, missing-health and deterministic parts stay refused (cooldown and save: fence updates, own suites)', () => {
    for (const [name, rec] of Object.entries({ moveDamage: riderRecord(), moveHealing: riderRecord({ direct: 'healing', feet: 10, label: 'Fleet' }),
      stunDamage: riderRecord({ kind: 'stunned', policy: 'gm-manual' }), stunHealing: riderRecord({ kind: 'stunned', direct: 'healing', policy: 'target-start-count', occurrences: 2 }) })) {
      const r = pure.definitionFromWizard(rec, opts()); assert.equal(r.ok, true, `${name}: ${JSON.stringify(r)}`);
      assert.equal(r.definition.schemaVersion, 3); assert.equal(r.definition.capability, pure.EFFECT_CAPABILITY); assert.equal(Object.hasOwn(r.definition, 'cooldown'), false);
      const c = definitions.compileDefinition(r.definition); assert.equal(c.ok, true, name); assert.equal(c.descriptor.compilerVersion, 'p14-a10-effect-formula-1', name);
      assert.deepEqual(pure.creatureSourceRefusal(r.definition), { code: 'unsupported_source_route', reason: 'An attribute-scaled immediate part currently requires a primary owner PC source; the whole creature ability remains manual.' }, name);
    }
    // Plain riders are byte-identical to the base (same records/ids as the effect-cooldown pins).
    const pinDescription = 'Effect cooldown disposable test';
    const plain = { move: riderRecord({ name: 'Disposable Ember Hobble', formula: '1d6+2', description: pinDescription }), stun: riderRecord({ name: 'Disposable Ember Hobble', kind: 'stunned', direct: null, description: pinDescription }) };
    for (const [name, rec] of Object.entries(plain)) {
      const pinned = definitions.compileDefinition(pure.definitionFromWizard({ ...rec, authoredDefinitionId: '70000000-0000-4000-8000-0000000000b2' }, pinnedOpts).definition);
      assert.equal(pinned.descriptor.compilerVersion, 'p14-a10-effect-1', name); assert.equal(pinned.definitionHash, PINNED[name].definitionHash, name); assert.equal(descriptorSha(pinned), PINNED[name].descriptor, name);
      assert.equal(pure.creatureSourceRefusal(pure.definitionFromWizard(rec, opts()).definition), null, `${name}: a plain rider keeps its creature route`);
    }
    // Compiler refusals (whole record stays manual).
    // Fence update (formula-rider saves): a rider-local negates save now takes its own label; p14FormulaRiderSave covers the route.
    const withSave = pure.definitionFromWizard(riderRecord({ extra: d => { d.controlConfig.authoredCondition.save = { ability: 'constitution', dc: 13, outcome: 'negates' }; } }), opts());
    assert.equal(withSave.ok, true, withSave.reason); assert.equal(definitions.compileDefinition(withSave.definition).descriptor.compilerVersion, 'p14-save-branch-timed-formula-1', 'scaled rider + save');
    const manual = {
      attribute: [riderRecord({ extra: d => { Object.assign(d.controlConfig.authoredCondition, { effect: 'attribute', attribute: 'agility', attributeAmount: -2 }); delete d.controlConfig.authoredCondition.movementFeet; } }), /effect\.formula/],
      flatDr: [riderRecord({ direct: 'healing', extra: d => { Object.assign(d.controlConfig.authoredCondition, { effect: 'damageReduction', drAmount: 2, label: 'Warded' }); delete d.controlConfig.authoredCondition.movementFeet; } }), /effect\.formula/],
      missingHealth: [riderRecord({ formula: '2d6 + caster_missing_health/4' }), /effect\.formula/],
      deterministic: [riderRecord({ formula: 'intelligence/3' }), /effect\.formula/],
      spacedPlain: [riderRecord({ formula: '2d6 + 3' }), /effect\.formula/],
      selfTarget: [riderRecord({ extra: d => { d.targetingConfig.targetRestrictions = ['self']; d.targetingConfig.rangeDistance = 0; } }), /distinct creature targeting|targeting/]
    };
    for (const [name, [rec, reason]] of Object.entries(manual)) {
      if (name === 'selfTarget') {rec.targetingConfig = actors.clone(rec.authoredDraft.targetingConfig);}
      const r = pure.definitionFromWizard(rec, opts()); assert.equal(r.ok, false, `${name}: ${JSON.stringify(r)}`); assert.match(r.reason, reason, name);
    }
    // Registry refusals on hand-built definitions (the server fence holds without the client compiler).
    const ok = pure.definitionFromWizard(riderRecord(), opts()).definition;
    const cd = { cooldownType: cooldown.TYPE, cooldownValue: 1 };
    // Fence update (formula-rider cooldowns): the cooldown key now takes its own label; p14RiderFormulaCooldown covers the route.
    assert.equal(definitions.compileDefinition({ ...actors.clone(ok), cooldown: cd }).descriptor.compilerVersion, 'p14-a10-effect-formula-cooldown-1', 'scaled rider + cooldown');
    assert.equal(definitions.compileDefinition({ ...actors.clone(ok), effects: { ...actors.clone(ok.effects), save: { scope: 'condition', ability: 'constitution', dc: 13, outcome: 'negates' } } }).descriptor.compilerVersion, 'p14-save-branch-timed-formula-1', 'scaled rider + save (fence update)');
    for (const condition of [{ kind: 'attribute', attribute: 'agility', amount: -2, label: 'Leaden' }, { kind: 'damageReduction', amount: 2, label: 'Warded' }]) {
      assert.equal(definitions.compileDefinition({ ...actors.clone(ok), effects: { ...actors.clone(ok.effects), condition } }).ok, false, condition.kind);
    }
    for (const formula of ['2d6 + caster_missing_health/4', 'intelligence/3', '2d6 + 3']) {
      assert.equal(definitions.compileDefinition({ ...actors.clone(ok), effects: { ...actors.clone(ok.effects), direct: { ...ok.effects.direct, formula } } }).ok, false, formula);
    }
    const classPaid = { ...actors.clone(ok), classPayment: { domain: 'elementalSpheres', price: { costs: ['arcane'], gains: [] } }, catalogueSource: { spellId: 'x', classId: 'arcanoneer', recordHash: 'a'.repeat(64) } };
    assert.equal(definitions.compileDefinition(classPaid, { verifyCatalogue: false }).ok, false, 'no class payment on a scaled rider');
    // Positive control for the cooldown fence: the same rider with plain dice still takes the cooldown (frozen effect-cooldown route).
    const plainMove = pure.definitionFromWizard(riderRecord({ formula: '1d6+2' }), opts()).definition;
    assert.equal(definitions.compileDefinition({ ...actors.clone(plainMove), cooldown: cd }).descriptor.compilerVersion, 'p14-a10-effect-cooldown-1');
  });

  it('movement + 2d6 + intelligence/3: INT 14 adds 4 (rounded down); one GM-confirmed receipt pays once, applies HP temp-first and installs the rider with its schedule; rider expiry leaves the immediate consequence', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(riderRecord()), before = pools(), startHp = hp(target);
    const a = formulaApproval(ref, { faces: [[5, 2]] });
    assert.deepEqual(a.rollAttributes, { intelligence: 14 }); assert.equal(a.roll.constant, 4); assert.equal(a.roll.total, 11);
    assert.match(a.roll.reading, /^2d6 \+ intelligence\/3 → 2d6 \+ 4/);
    await approve(a);
    const c = command(a), r = await accept(c);
    assert.equal(receiptsFor(c.commandId).length, 1, 'one command, one receipt');
    assert.equal(spent(before, pools(), 'ap'), 2); assert.equal(spent(before, pools(), 'mana'), 3);
    assert.deepEqual(hp(target), { current: startHp.current - (11 - startHp.temp), temp: 0 }, '11 = 3 temp + 8 HP');
    assert.equal(moves(target).length, 1); assert.equal(chosen(r).condition.kind, 'movement'); assert.equal(chosen(r).combination.outcome, 'added');
    assert.deepEqual(chosen(r).roll.dice, [{ sides: 6, faces: [5, 2] }]); assert.equal(chosen(r).roll.total, 11);
    assert.equal(Object.keys(schedules()).length, 1, 'the rider has its authenticated schedule');
    assert.deepEqual(Object.keys(token(pc).state.authoredCooldowns || {}), [], 'no cooldown on this route');
    const afterCast = { hp: hp(target), pools: pools() };
    await advanceTo(3); assert.equal(moves(target).length, 0, 'expired at the end of the target\'s next turn (3)');
    assert.deepEqual({ hp: hp(target), pools: pools() }, afterCast, 'expiry does not undo HP or payment');
    // Privacy: the attested scores are in the private receipt; the observer projection has no GM evidence.
    const view = await ack(observer, 'actor_snapshot', { roomId: room.id }); assert.ok(!JSON.stringify(view).includes('PRIVATE'));
  });

  it('Stunned + 1d4 + spirit/2 healing at SPI 9 (+4): capped at max, temp HP unchanged; GM removal of Stunned leaves the healing and payment', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(riderRecord({ name: 'Disposable Calming Hold', kind: 'stunned', direct: 'healing', policy: 'gm-manual' }));
    token(target).state.currentHp = 55; const before = pools();
    const { a, c, r } = await cast(ref, { faces: [[4]] });
    assert.deepEqual(a.rollAttributes, { spirit: 9 }); assert.equal(a.roll.constant, 4); assert.equal(a.roll.total, 8);
    assert.equal(receiptsFor(c.commandId).length, 1); assert.deepEqual(hp(target), { current: 60, temp: 3 }, 'capped at max 60, excess discarded, temp unchanged');
    assert.equal(stuns(target).length, 1); assert.equal(chosen(r).condition.kind, 'stunned');
    assert.equal(spent(before, pools(), 'mana'), 3);
    const kept = { hp: hp(target), pools: pools() };
    await accept(remove(target, stuns(target)[0].recordId)); assert.equal(stuns(target).length, 0);
    assert.deepEqual({ hp: hp(target), pools: pools() }, kept, 'removal does not undo the immediate consequence');
  });

  it('zero result keeps the existing A10 creature behavior: a GM-adjusted 0 with a reason pays once and installs the rider; an unexplained change refuses', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(riderRecord()), a = formulaApproval(ref, { faces: [[1, 1]] }); await approve(a);
    const st = world(); await refused('actor_consequence', command(a, { amount: 0 }), 'adjustment_reason_required'); assert.deepEqual(world(), st);
    const before = pools(), startHp = hp(target), c = command(a, { amount: 0, reason: 'GM: the target was fully warded' }), r = await accept(c);
    assert.deepEqual(hp(target), startHp); assert.equal(moves(target).length, 1); assert.equal(spent(before, pools(), 'ap'), 2); assert.equal(chosen(r).roll.total, 6);
  });

  it('changed caster attribute after approval refuses with nothing applied; reapproval with the retained faces revalues and lands once; a change across the authority await refuses too', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(riderRecord({ policy: 'target-end-count', occurrences: 2 })), a = formulaApproval(ref, { faces: [[3, 6]] }); await approve(a);
    assert.equal(a.roll.total, 13);
    token(pc).character.stats.intelligence = 17;
    const st = world(), x = await ack(gm, 'actor_consequence', command(a)); assert.equal(x.success, false); assert.equal(x.code, 'owner_reapproval_required', JSON.stringify(x)); assert.deepEqual(world(), st, 'no HP, payment, rider or schedule');
    assert.equal((await withdraw(a)).code, 'approval_owner_reapproval_required', 'the stale consent is closed by the server');
    const b = formulaApproval(ref, { faces: a.roll.dice.map(g => g.faces) }); await approve(b);
    assert.deepEqual(b.roll.dice, a.roll.dice, 'retained faces'); assert.equal(b.roll.constant, 5); assert.equal(b.roll.total, 14);
    const startHp = hp(target), c = command(b), r = await accept(c);
    assert.equal(receiptsFor(c.commandId).length, 1); assert.equal(hp(target).current, startHp.current - (14 - startHp.temp)); assert.equal(moves(target).length, 1); assert.equal(chosen(r).roll.total, 14);
    // Authority await: the snapshot is re-read at the final stage.
    await advanceTo(3);
    const d = formulaApproval(ref, { faces: [[2, 2]] }); await approve(d); const cmd = command(d);
    const original = server.authorityService.assertCurrent; let release, reached, hold = true;
    const gate = new Promise(res => { release = res; }), entered = new Promise(res => { reached = res; });
    server.authorityService.assertCurrent = async(...args) => { if (hold) { hold = false; reached(); await gate; } return original(...args); };
    const st2 = world(), pending = ack(gm, 'actor_consequence', cmd); await entered;
    token(pc).character.stats.intelligence = 11; release();
    const y = await pending; server.authorityService.assertCurrent = original;
    assert.equal(y.success, false, JSON.stringify(y)); assert.equal(y.code, 'owner_reapproval_required'); assert.deepEqual(world(), st2);
  });

  it('review F3: a change to the caster\'s conditions only (part of the bound snapshot) after approval needs reapproval; nothing applied', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(riderRecord()), a = formulaApproval(ref, { faces: [[4, 4]] }); await approve(a);
    token(pc).state.conditions.push({ recordId: 'gm-note', id: 'gm-note', name: 'Marked', type: 'debuff', effects: {} });
    const st = world(), x = await ack(gm, 'actor_consequence', command(a));
    assert.equal(x.success, false, JSON.stringify(x)); assert.equal(x.code, 'owner_reapproval_required'); assert.deepEqual(world(), st);
  });

  it('forged inputs or binding refuse whole at approval with nothing charged or installed', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(riderRecord());
    const cases = {
      constant: x => { x.roll.constant++; x.roll.total++; }, reading: x => { x.roll.reading = '2d6 + 5'; }, missingInput: x => { delete x.rollAttributes; }, extraInput: x => { x.rollAttributes.spirit = 9; },
      wrongInput: x => { x.rollAttributes.intelligence = 20; }, noBinding: x => { delete x.formulaSourceHash; }, staleBinding: x => { x.formulaSourceRevision += 1; }, plainTerms: x => { x.effectTerms.direct.formula = '2d6+4'; }
    };
    const codes = {};
    for (const [name, change] of Object.entries(cases)) {
      const x = formulaApproval(ref, { faces: [[5, 6]] }); change(x); const before = actors.clone(live().gameState), r = await ack(owner, 'actor_spell_approve', x);
      assert.equal(r.success, false, `${name}: ${JSON.stringify(r)}`); assert.deepEqual(live().gameState, before, name); codes[name] = r.code;
    }
    assert.deepEqual(codes, { constant: 'authored_roll_mismatch', reading: 'authored_roll_mismatch', missingInput: 'invalid_spell_approval', extraInput: 'authored_roll_mismatch', wrongInput: 'authored_roll_mismatch',
      noBinding: 'invalid_spell_approval', staleBinding: 'owner_reapproval_required', plainTerms: 'invalid_consequence' });
  });

  it('a refused rider application changes neither HP nor payment: missing target schedule, an unresolved movement combination and a stale target', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(riderRecord());
    // `other` is outside the roster: the rider's structured expiry has no authenticated schedule.
    let a = formulaApproval(ref, { t: other, faces: [[6, 6]] }); await approve(a);
    let st = world(), x = await ack(gm, 'actor_consequence', command(a)); assert.equal(x.success, false); assert.equal(x.code, 'effect_schedule_unavailable', JSON.stringify(x)); assert.deepEqual(world(), st);
    await withdraw(a);
    // Stale target revision refuses the whole command.
    a = formulaApproval(ref); await approve(a); const stale = command(a);
    await accept({ ...base(), actors: [{ ref: target, expectedRevision: token(target).state.actorContract.revision, finalResources: { hp: { current: 49, temp: 3 } } }], adjudication: { definitionId: 'gm-correction', definitionVersionOrHash: 'gm-correction', finalAmount: 0, adjustmentReason: '', chosenResult: 'GM correction' } });
    st = world(); x = await ack(gm, 'actor_consequence', { ...stale, baseCommitSequence: actors.ledger(live()).commitSequence }); assert.equal(x.success, false); assert.equal(x.code, 'approval_mismatch', JSON.stringify(x)); assert.deepEqual(world(), st);
    await withdraw(a);
    // A changed copy (same definition ID, new label) meets the active v1 movement rider: A11 refuses the combination whole.
    const v1 = await admitPc(riderRecord({ name: 'Disposable Mind Mire', label: 'Mired', policy: 'target-end-count', occurrences: 3 }));
    await cast(v1); assert.equal(moves(target).length, 1);
    const rec2 = riderRecord({ name: 'Disposable Mind Mire', label: 'Deep mire', policy: 'target-end-count', occurrences: 3 }); rec2.authoredDefinitionId = entryFor(v1).canonicalDefinition.definitionId;
    const v2 = await admitPc(rec2, 2);
    a = formulaApproval(v2, { faces: [[6, 6]] }); assert.equal(effect.conditionPlan(a, token(target).state.conditions).refused.code, 'modifier_combination_unresolved');
    st = world(); const y = await ack(owner, 'actor_spell_approve', a);
    assert.equal(y.code, 'awaiting_gm', 'review F2: the combination is derived at GM confirmation, not at approval');
    const z = await ack(gm, 'actor_consequence', command(a)); assert.equal(z.success, false, JSON.stringify(z)); assert.equal(z.code, 'modifier_combination_unresolved');
    assert.deepEqual(world(), st, 'neither HP nor payment changed'); await withdraw(a);
  });

  it('writer failure and competing confirmations are atomic; lost ACK, GM reload (checkpoint rebuild) and owner snapshot recover the original command once', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(riderRecord({ policy: 'target-start-count', occurrences: 2 })), a = formulaApproval(ref, { faces: [[6, 5]] }); await approve(a);
    await refused('actor_spell_approve', formulaApproval(ref), 'approval_pending', owner);
    const c = command(a);
    const admit = writer.admitConsequence; live().isPermanent = true; writer.admitConsequence = () => ({ queued: false, code: 'rf_writer_refusal' });
    const st = world(), w = await ack(gm, 'actor_consequence', c);
    assert.equal(w.code, 'rf_writer_refusal', JSON.stringify(w)); assert.deepEqual(world(), st); assert.equal(receiptsFor(c.commandId).length, 0);
    assert.deepEqual(payments.get(live(), a.approvalId).approval.roll, a.roll, 'approval and immediate faces retained');
    writer.admitConsequence = admit; live().isPermanent = false;
    const rival = { ...c, commandId: uuid() };
    const confirmations = await Promise.all([ack(gm, 'actor_consequence', c), ack(gm, 'actor_consequence', rival)]);
    assert.equal(confirmations.filter(r => r.success).length, 1, JSON.stringify(confirmations)); assert.equal(confirmations.find(r => !r.success).code, 'approval_consumed');
    const accepted = confirmations[0].success ? c : rival, receipt = confirmations.find(r => r.success).receipt;
    assert.equal(moves(target).length, 1); assert.equal(hp(target).current, 50 - (15 - 3));
    const codec = require('../services/roomCheckpoint'), built = codec.buildCheckpointDocuments({ roomId: room.id, gameState: live().gameState, revision: 1 });
    const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])) }); assert.equal(decoded.ok, true);
    const snapshot = world();
    server.rooms.set(room.id, { ...live(), gameState: { ...decoded.global, maps: decoded.maps, ...codec.deriveRootMirrors(decoded.maps) }, checkpointRevision: 1 });
    assert.deepEqual(world(), snapshot);
    gm.emit('actor_consequence', accepted); await sleep(100); // ACK lost
    assert.deepEqual((await ack(gm, 'actor_consequence', accepted)).receipt, receipt); assert.deepEqual(world(), snapshot); assert.equal(receiptsFor(accepted.commandId).length, 1);
    await refused('actor_consequence', { ...accepted, adjudication: { ...accepted.adjudication, finalAmount: 1, adjustmentReason: 'changed' } }, 'command_id_conflict');
    const view = await ack(owner, 'actor_snapshot', { roomId: room.id }); assert.deepEqual(view.maps.default.characterTokens.pc.character.mana, token(pc).character.mana);
    await advanceTo(5); assert.equal(moves(target).length, 0, 'counted rider ended at the target\'s second start (5)'); assert.equal(hp(target).current, 50 - 12, 'expiry keeps the HP change');
  });

  it('route gates: a second primary PC target, a self target and a creature source are refused with nothing spent; the plain rider control still reaches the GM for that PC', async() => {
    live().gameState.maps.default.characterTokens.pc2 = { id: 'pc2', ownerUserId: ownerUid, character: { id: 'c2', class: 'Arcanoneer', health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, tempMana: 0, tempActionPoints: 0 }, state: { conditions: [] } };
    server.setCharacterOwner('c2', ownerUid);
    const bound = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc2', ownerUid, characterId: 'c2' }, snapshotHash: actors.hash(live().gameState.maps.default.characterTokens.pc2) });
    assert.equal(bound.success, true, JSON.stringify(bound)); const pc2 = bound.ref;
    await startCombat(); await adopt();
    const ref = await admitPc(riderRecord());
    const r = await refused('actor_spell_approve', formulaApproval(ref, { t: pc2 }), 'pc_target_effect_unsupported', owner); assert.match(r.error, /one placed creature only/);
    await refused('actor_spell_approve', formulaApproval(ref, { t: pc }), 'unsupported_effect_target', owner);
    // Control: the same hostile movement rider with plain dice reaches the GM for that PC (existing M3A route, untouched).
    const free = await admitPc(riderRecord({ name: 'Disposable Plain Hobble', formula: '1d6+2' }));
    const e = entryFor(free), d = e.canonicalDefinition, rd = pure.readFormula(d.effects.direct.formula);
    const plain = { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence, source: pc, target: pc2, spell: spellOf(e),
      roll: { mode: 'physical', dice: [{ sides: rd.dice[0].sides, faces: [3] }], constant: rd.constant, reading: rd.reading, total: 3 + rd.constant }, price: e.descriptor.price, classPayment: null, effectTerms: effect.termsFor(d) };
    await approve(plain); await withdraw(plain);
    // Creature source: admission refuses before any approval.
    token(source).authoredAbility.record = riderRecord({ name: 'Disposable Creature Mind Hobble' });
    await refused('actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, source, expectedSourceRevision: token(source).state.actorContract.revision, definitionVersion: 1 }, 'unsupported_source_route');
  });
});
