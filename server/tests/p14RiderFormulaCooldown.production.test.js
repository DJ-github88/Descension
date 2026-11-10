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
 * Formula-rider cooldowns: the released formula-rider route (an M4A attribute-scaled immediate damage OR healing part next to ONE movement
 * OR Stunned rider) composed with the released authenticated caster-start cooldown (handoff/wizard-cooldowns/APPROVAL.md, effect-cooldowns).
 * Same shared reader, owner-attested inputs, retained-face reapproval, A11 rider planner, cooldown check/start/release and P7 atomic stage.
 * Primary owner PC → one placed creature; AP/mana only. No save, class payment, catalogue, area, PC/self target or creature source.
 * Roster [pc, source, target] (period 3): the PC's turn starts at 0, 3, 6, 9; the target's at 2, 5, 8 and ends at 3, 6, 9.
 */
const PIN_ID = '70000000-0000-4000-8000-0000000000c4';
/** Measured on the combined base (live + effect-cooldowns + formula-riders finals) before this change: unrelated definitions keep these bytes. */
const PINNED = {
  plainMoveCooldown: { label: 'p14-a10-effect-cooldown-1', definitionHash: 'a468e80619e94ebfb0484ec689464f2b7e8f258f756f5637c808c357252b8477', descriptor: 'b90096edd1ae376bc720b0299a3649adbe9ada758ebeda95b4ce82e031a5a769' },
  plainStunCooldown: { label: 'p14-a10-effect-cooldown-1', definitionHash: '21124c38c400ae1d4d48dafd9c2d077fd9946b39bd3bceb0590890a5dd9416d8', descriptor: '57ca1512a6054f64f1211878388ad23c72e4281ff3080f3219930431947c2bdf' },
  scaledMove: { label: 'p14-a10-effect-formula-1', definitionHash: 'ca4ea476ab0617decb6f7b4dc3fa128a3b8a03c3b96bf05279358c7083dcccb7', descriptor: '17ab5631ea17afa4cda95caff0bd55d5bd3741c6970a5479a8639ff4bc1157ce' },
  scaledStun: { label: 'p14-a10-effect-formula-1', definitionHash: '95c08ea899d0db6bd09c7bbee1e411381d5123204d96fbe276f9e122c1dbdcac', descriptor: 'ca7718ed2db782c88fe5c9676fa40cb5925a769754ff0325eebfd7ab9f5a60ab' },
  plainMove: { label: 'p14-a10-effect-1', definitionHash: 'c25917c6d51c0e9b4b050c433a666ad302a3b6758822bbb3efef17fbc6244b97', descriptor: 'f70ad7489039ae02fd2b35e9c26c489c3aaf95e37ee765971a04a629fa84b345' }
};
/** Disposable Wizard rider record with the explicit caster-start cooldown by default. `formula` sets the immediate part. */
function riderRecord({ name = 'Disposable Mind Hobble', kind = 'movement', feet = -10, label = 'Hobbled', policy = 'target-next-end', occurrences, direct = 'damage',
  formula = direct === 'healing' ? '1d4 + spirit/2' : '2d6 + intelligence/3', ap = 2, mana = 3, cooldownValue = 2, cooldownType = cooldown.TYPE, extra } = {}) {
  const c = { profile: pure.EFFECT_CAPABILITY, effect: kind, ...(kind === 'movement' ? { movementFeet: feet, label } : {}), expiryPolicy: policy, ...(occurrences !== undefined ? { occurrences } : {}),
    durationText: 'Until the embers cool', gmNote: 'GM resolves eligibility, range and any save before confirming success.' };
  const d = { name, description: 'Formula rider cooldown disposable test', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' },
    effectTypes: direct ? [direct, 'control'] : ['control'], controlConfig: { authoredCondition: c },
    ...(direct === 'damage' ? { damageConfig: { damageType: 'direct', elementType: 'ember', formula, resolution: 'DICE' } } : {}),
    ...(direct === 'healing' ? { healingConfig: { healingType: 'direct', formula, resolution: 'DICE' } } : {}),
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: ap, mana },
    ...(cooldownType !== null ? { cooldownConfig: { cooldownType, cooldownValue } } : {}) };
  if (extra) {extra(d);}
  return { ...actors.clone(d), authoredDraft: d, authoredDefinitionId: uuid() };
}

describe('Formula-rider cooldowns — attribute-scaled immediate part + one movement/Stunned rider + the authenticated caster-start cooldown, registered production handlers', function() {
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
      const t = { id, name: id, creatureId: 'disposable', stats: { maxHp: 60, maxMana: 20, maxAP: 10, speed: 30 }, authoredAbility: { schemaVersion: 1, record: riderRecord({ cooldownType: null, formula: '1d6+2' }), librarySpellId: null },
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
  async function approve(a) { const before = actors.clone(live().gameState), r = await ack(owner, 'actor_spell_approve', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); assert.deepEqual(live().gameState, before, 'approval spends nothing and starts no cooldown'); return r; }
  function command(a, { amount, reason = '' } = {}) {
    const pools = actors.resources(token(a.source), 'character'), pay = {};
    for (const p of ['ap', 'mana']) {if (a.price[p]) {pay[p] = payments.tempFirst(pools[p].current, pools[p].temp, a.price[p]);}}
    const direct = a.effectTerms.direct, finalAmount = direct ? amount ?? a.roll.total : 0;
    const plan = effect.conditionPlan(a, token(a.target).state.conditions || []);
    const targetEntry = { ref: a.target, expectedRevision: token(a.target).state.actorContract.revision, conditions: plan.ops || [{ op: 'add', recordId: a.approvalId, record: effect.recordFor(a) }] };
    const hp = actors.resources(token(a.target), a.target.kind).hp, fromTemp = Math.min(hp.temp, finalAmount);
    targetEntry.finalResources = { hp: direct.kind === 'damage' ? { current: Math.max(0, hp.current - (finalAmount - fromTemp)), temp: hp.temp - fromTemp } : { current: Math.min(hp.max, hp.current + finalAmount), temp: hp.temp } };
    return { ...base(), source: a.source, target: a.target, approval: { approvalId: a.approvalId, contentHash: actors.hash(a) },
      actors: [{ ref: a.source, expectedRevision: token(a.source).state.actorContract.revision, finalResources: pay }, targetEntry],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, finalAmount, adjustmentReason: reason, chosenResult: JSON.stringify(effect.resultFor(a, resolution({ timing: a.effectTerms.timing }), plan.combination || null)) } };
  }
  async function accept(c) { const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true, JSON.stringify(r)); return r; }
  async function cast(ref, opts = {}) { const a = formulaApproval(ref, opts); await approve(a); const c = command(a, opts), r = await accept(c); return { a, c, r }; }
  async function refused(event, data, code, socket = gm) { const before = actors.clone(live().gameState), r = await ack(socket, event, data); assert.equal(r.success, false, JSON.stringify(r)); if (code) {assert.equal(r.code, code, JSON.stringify(r));} assert.deepEqual(live().gameState, before, `${event} changed nothing`); return r; }
  const withdraw = a => ack(owner, 'actor_spell_withdraw', { roomId: room.id, approvalId: a.approvalId, approval: a });
  const cooldowns = () => actors.clone(token(pc).state.authoredCooldowns || {});
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
    schedules: schedules(), cooldowns: cooldowns(), receipts: actors.ledger(live()).receipts.length });
  const opts = () => ({ roomId: room.id, definitionVersion: 1, classId: 'arcanoneer' });
  const pinnedOpts = { roomId: 'pinned-room', definitionVersion: 1, classId: 'arcanoneer' };
  const descriptorSha = c => require('crypto').createHash('sha256').update(JSON.stringify(c.descriptor)).digest('hex');
  const keyOf = ref => cooldown.key(pc, ref.definitionId);

  it('compiler and registry: movement/Stunned × scaled damage/healing × every expiry policy take the cooldown under p14-a10-effect-formula-cooldown-1; unrelated definitions keep their pinned bytes; save, other families, invalid/legacy cooldowns, class payment and creature sources stay refused', () => {
    const shapes = { moveDamage: riderRecord(), moveHealing: riderRecord({ direct: 'healing', feet: 10, label: 'Fleet', policy: 'gm-manual', cooldownValue: 1 }),
      stunDamage: riderRecord({ kind: 'stunned', policy: 'gm-manual', cooldownValue: 10 }), stunHealing: riderRecord({ kind: 'stunned', direct: 'healing', policy: 'target-start-count', occurrences: 2 }),
      moveCounted: riderRecord({ policy: 'target-end-count', occurrences: 3 }) };
    for (const [name, rec] of Object.entries(shapes)) {
      const r = pure.definitionFromWizard(rec, opts()); assert.equal(r.ok, true, `${name}: ${JSON.stringify(r)}`);
      assert.equal(r.definition.schemaVersion, 3); assert.equal(r.definition.capability, pure.EFFECT_CAPABILITY); assert.deepEqual(r.definition.cooldown, rec.cooldownConfig);
      const c = definitions.compileDefinition(r.definition); assert.equal(c.ok, true, name);
      assert.equal(c.descriptor.compilerVersion, 'p14-a10-effect-formula-cooldown-1', name); assert.deepEqual(c.descriptor.cooldown, rec.cooldownConfig, name);
      assert.equal(pure.creatureSourceRefusal(r.definition).code, 'unsupported_source_route', name);
      // Without the cooldown key the same definition is the released formula rider, byte for byte.
      const without = actors.clone(r.definition); delete without.cooldown;
      assert.equal(definitions.compileDefinition(without).descriptor.compilerVersion, 'p14-a10-effect-formula-1', name);
    }
    // Unrelated definitions keep the exact bytes measured on the combined base.
    const pins = {
      plainMoveCooldown: riderRecord({ formula: '1d6+2' }), plainStunCooldown: riderRecord({ kind: 'stunned', direct: null, policy: 'gm-manual' }),
      scaledMove: riderRecord({ cooldownType: null }), scaledStun: riderRecord({ kind: 'stunned', direct: 'healing', policy: 'gm-manual', cooldownType: null }),
      plainMove: riderRecord({ formula: '1d6+2', cooldownType: null })
    };
    for (const [name, rec] of Object.entries(pins)) {
      const c = definitions.compileDefinition(pure.definitionFromWizard({ ...rec, authoredDefinitionId: PIN_ID }, pinnedOpts).definition);
      assert.deepEqual({ label: c.descriptor.compilerVersion, definitionHash: c.definitionHash, descriptor: descriptorSha(c) }, PINNED[name], name);
    }
    // Wizard compiler refusals (the whole record stays manual).
    // Fence update (formula-rider save cooldowns): a rider-local negates save now takes its own label; p14FormulaRiderSaveCooldown covers the route.
    const withSave = pure.definitionFromWizard(riderRecord({ extra: d => { d.controlConfig.authoredCondition.save = { ability: 'constitution', dc: 13, outcome: 'negates' }; } }), opts());
    assert.equal(withSave.ok, true, withSave.reason); assert.equal(definitions.compileDefinition(withSave.definition).descriptor.compilerVersion, 'p14-save-branch-timed-formula-cooldown-1');
    const manual = {
      attribute: [riderRecord({ extra: d => { Object.assign(d.controlConfig.authoredCondition, { effect: 'attribute', attribute: 'agility', attributeAmount: -2, label: 'Leaden' }); delete d.controlConfig.authoredCondition.movementFeet; } }), /effect\.formula/],
      flatDr: [riderRecord({ direct: 'healing', extra: d => { Object.assign(d.controlConfig.authoredCondition, { effect: 'damageReduction', drAmount: 2, label: 'Warded' }); delete d.controlConfig.authoredCondition.movementFeet; } }), /effect\.formula/],
      missingHealth: [riderRecord({ formula: '2d6 + caster_missing_health/4' }), /effect\.formula/],
      deterministic: [riderRecord({ formula: 'intelligence/3' }), /effect\.formula/],
      zero: [riderRecord({ cooldownValue: 0 }), /cooldownConfig/], eleven: [riderRecord({ cooldownValue: 11 }), /cooldownConfig/], legacy: [riderRecord({ cooldownType: 'turn_based', cooldownValue: 1 }), /legacy/],
      selfTarget: [riderRecord({ extra: d => { d.targetingConfig.targetRestrictions = ['self']; d.targetingConfig.rangeDistance = 0; } }), /distinct creature targeting required/],
      area: [riderRecord({ extra: d => { d.targetingConfig.targetingType = 'area'; } }), /Cooldowns currently require one creature target/]
    };
    for (const [name, [rec, reason]] of Object.entries(manual)) {
      const r = pure.definitionFromWizard(rec, opts()); assert.equal(r.ok, false, `${name}: ${JSON.stringify(r)}`); assert.match(r.reason, reason, name);
    }
    // Registry refusals on hand-built definitions (the server fence holds without the client compiler).
    const ok = pure.definitionFromWizard(riderRecord(), opts()).definition;
    for (const bad of [{ cooldownType: cooldown.TYPE, cooldownValue: 0 }, { cooldownType: cooldown.TYPE, cooldownValue: 11 }, { cooldownType: 'turn_based', cooldownValue: 1 }, { cooldownType: cooldown.TYPE, cooldownValue: 2, extra: true }]) {
      assert.equal(definitions.compileDefinition({ ...actors.clone(ok), cooldown: bad }).ok, false, JSON.stringify(bad));
    }
    assert.notEqual(definitions.compileDefinition({ ...actors.clone(ok), effects: { ...actors.clone(ok.effects), save: { scope: 'condition', ability: 'constitution', dc: 13, outcome: 'negates' } } }).descriptor.compilerVersion, 'p14-a10-effect-formula-cooldown-1', 'a save takes its own label (fence update)');
    for (const condition of [{ kind: 'attribute', attribute: 'agility', amount: -2, label: 'Leaden' }, { kind: 'damageReduction', amount: 2, label: 'Warded' }]) {
      assert.equal(definitions.compileDefinition({ ...actors.clone(ok), effects: { ...actors.clone(ok.effects), condition } }).ok, false, condition.kind);
    }
    for (const formula of ['2d6 + caster_missing_health/4', 'intelligence/3', '2d6 + 3']) {
      assert.equal(definitions.compileDefinition({ ...actors.clone(ok), effects: { ...actors.clone(ok.effects), direct: { ...ok.effects.direct, formula } } }).ok, false, formula);
    }
    const classPaid = { ...actors.clone(ok), classPayment: { domain: 'elementalSpheres', price: { costs: ['arcane'], gains: [] } }, catalogueSource: { spellId: 'x', classId: 'arcanoneer', recordHash: 'a'.repeat(64) } };
    assert.equal(definitions.compileDefinition(classPaid, { verifyCatalogue: false }).code, 'UNSUPPORTED_SHAPE', 'no class payment with a cooldown');
  });

  it('atomic cast: one receipt pays once, applies the INT-scaled damage temp-first, installs the rider with its schedule and starts the cooldown with the cast commandId; blocked reuse spends nothing and installs no rider; rider expiry does not release (order B); legal reuse after release', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(riderRecord({ cooldownValue: 2 })), before = pools(), startHp = hp(target);
    const a = formulaApproval(ref, { faces: [[5, 2]] }); assert.deepEqual(a.rollAttributes, { intelligence: 14 }); assert.equal(a.roll.total, 11);
    await approve(a); assert.deepEqual(cooldowns(), {}, 'approval starts nothing');
    const c = command(a), r = await accept(c);
    assert.equal(receiptsFor(c.commandId).length, 1, 'one command, one receipt');
    assert.equal(spent(before, pools(), 'ap'), 2); assert.equal(spent(before, pools(), 'mana'), 3);
    assert.deepEqual(hp(target), { current: startHp.current - (11 - startHp.temp), temp: 0 }, '11 = 3 temp + 8 HP');
    assert.equal(moves(target).length, 1); assert.equal(chosen(r).combination.outcome, 'added'); assert.equal(chosen(r).roll.total, 11);
    assert.equal(Object.keys(schedules()).length, 1, 'the rider has its authenticated schedule');
    const item = cooldowns()[keyOf(ref)]; assert.deepEqual([item.startSequence, item.dueSequence, item.occurrences, item.period, item.commandId], [0, 6, 2, 3, c.commandId], 'N=2: PC starts 3, 6');
    // Blocked reuse: refused at approval with nothing spent, no rider, no receipt.
    const st = world(); await refused('actor_spell_approve', formulaApproval(ref, { faces: [[6, 6]] }), 'ability_on_cooldown', owner); assert.deepEqual(world(), st);
    const held = cooldowns(), afterCast = { hp: hp(target), pools: pools() };
    await advanceTo(3); assert.equal(moves(target).length, 0, 'rider expired at the end of the target\'s next turn (3)');
    assert.deepEqual(cooldowns(), held, 'rider expiry does not release the cooldown'); assert.deepEqual({ hp: hp(target), pools: pools() }, afterCast, 'expiry keeps HP and payment');
    await refused('actor_spell_approve', formulaApproval(ref), 'ability_on_cooldown', owner);
    await advanceTo(5); assert.deepEqual(cooldowns(), held); await advance(); assert.equal(seq(), 6); assert.deepEqual(cooldowns(), {}, 'released at its own boundary (6)');
    assert.equal(moves(target).length, 0, 'release installs nothing');
    const again = await cast(ref, { faces: [[1, 1]] }); assert.equal(receiptsFor(again.c.commandId).length, 1);
    assert.deepEqual([cooldowns()[keyOf(ref)].dueSequence, cooldowns()[keyOf(ref)].commandId], [12, again.c.commandId]); assert.equal(moves(target).length, 1);
    const view = await ack(observer, 'actor_snapshot', { roomId: room.id }); assert.ok(!JSON.stringify(view).includes('PRIVATE'));
  });

  it('changed attributes: GM confirmation refuses with nothing applied and no cooldown; reapproval with the retained faces revalues, starts nothing, and the confirmed cast starts exactly one cooldown; a cooldown in force is never reset by an attempted reapproval', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(riderRecord({ policy: 'target-end-count', occurrences: 2, cooldownValue: 1 })), a = formulaApproval(ref, { faces: [[3, 6]] }); await approve(a);
    assert.equal(a.roll.total, 13);
    token(pc).character.stats.intelligence = 17;
    const st = world(), x = await ack(gm, 'actor_consequence', command(a)); assert.equal(x.success, false); assert.equal(x.code, 'owner_reapproval_required', JSON.stringify(x));
    assert.deepEqual(world(), st, 'no HP, payment, rider, schedule or cooldown');
    assert.equal((await withdraw(a)).code, 'approval_owner_reapproval_required', 'the stale consent is closed by the server');
    const b = formulaApproval(ref, { faces: a.roll.dice.map(g => g.faces) }); await approve(b);
    assert.deepEqual(b.roll.dice, a.roll.dice, 'retained faces'); assert.equal(b.roll.constant, 5); assert.equal(b.roll.total, 14);
    assert.deepEqual(cooldowns(), {}, 'reapproval starts no cooldown');
    const startHp = hp(target), c = command(b), r = await accept(c);
    assert.equal(receiptsFor(c.commandId).length, 1); assert.equal(hp(target).current, startHp.current - (14 - startHp.temp)); assert.equal(chosen(r).roll.total, 14); assert.equal(moves(target).length, 1);
    assert.deepEqual(Object.keys(cooldowns()), [keyOf(ref)]); const held = cooldowns(); assert.deepEqual([held[keyOf(ref)].dueSequence, held[keyOf(ref)].commandId], [3, c.commandId]);
    // While the cooldown is in force a further change + fresh approval is refused by the cooldown, and the item is byte-equal (not reset).
    token(pc).character.stats.intelligence = 11;
    await refused('actor_spell_approve', formulaApproval(ref, { faces: a.roll.dice.map(g => g.faces) }), 'ability_on_cooldown', owner); assert.deepEqual(cooldowns(), held);
    await advanceTo(3); assert.deepEqual(cooldowns(), {}, 'released at 3'); assert.equal(moves(target).length, 1, 'counted rider still has one occurrence');
    // Authority await: a sheet change while the final stage awaits refuses whole; the cooldown stays unstarted.
    const d = formulaApproval(ref, { faces: [[2, 2]] }); await approve(d); const cmd = command(d);
    const original = server.authorityService.assertCurrent; let release, reached, hold = true;
    const gate = new Promise(res => { release = res; }), entered = new Promise(res => { reached = res; });
    server.authorityService.assertCurrent = async(...args) => { if (hold) { hold = false; reached(); await gate; } return original(...args); };
    const st2 = world(), pending = ack(gm, 'actor_consequence', cmd); await entered;
    token(pc).character.stats.intelligence = 20; release();
    const y = await pending; server.authorityService.assertCurrent = original;
    assert.equal(y.success, false, JSON.stringify(y)); assert.equal(y.code, 'owner_reapproval_required'); assert.deepEqual(world(), st2); assert.deepEqual(cooldowns(), {});
  });

  it('two approvals and racing confirmations cannot bypass the cooldown: a second approval is pending-refused, racing confirmations execute once with one cooldown, and a confirmation meeting a committed cooldown refuses with nothing spent', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(riderRecord({ cooldownValue: 2 })), a = formulaApproval(ref, { faces: [[4, 4]] }); await approve(a);
    await refused('actor_spell_approve', formulaApproval(ref), 'approval_pending', owner);
    const c = command(a), rival = { ...c, commandId: uuid() };
    const confirmations = await Promise.all([ack(gm, 'actor_consequence', c), ack(gm, 'actor_consequence', rival)]);
    assert.equal(confirmations.filter(r => r.success).length, 1, JSON.stringify(confirmations)); assert.equal(confirmations.find(r => !r.success).code, 'approval_consumed');
    const winner = confirmations[0].success ? c : rival;
    assert.equal(moves(target).length, 1); assert.deepEqual(Object.keys(cooldowns()), [keyOf(ref)]); assert.equal(cooldowns()[keyOf(ref)].commandId, winner.commandId);
    await refused('actor_spell_approve', formulaApproval(ref), 'ability_on_cooldown', owner);
    // Defence in depth: an approval taken while ready meets a committed cooldown at GM confirmation (state injected; the one-pending gate
    // makes a real interleaving impossible). Nothing is paid, applied, installed or re-started.
    await advanceTo(6); assert.deepEqual(cooldowns(), {});
    const b = formulaApproval(ref, { faces: [[6, 6]] }); await approve(b);
    const injected = { [keyOf(ref)]: { combatId: live().gameState.combat.effectLifecycle.id, startSequence: 6, dueSequence: 12, occurrences: 2, period: 3, commandId: uuid() } };
    token(pc).state.authoredCooldowns = actors.clone(injected);
    // Review F1: the confirmation-time check refuses before staging (the in-stage start is never reached).
    const service = require('../services/authoredCooldowns'), start = service.start; let staged = 0; service.start = (...args) => { staged++; return start(...args); };
    try {
      const st = world(), x = await ack(gm, 'actor_consequence', command(b)); assert.equal(x.success, false, JSON.stringify(x)); assert.equal(x.code, 'ability_on_cooldown');
      assert.deepEqual(world(), st); assert.deepEqual(cooldowns(), injected, 'the committed cooldown is not reset'); assert.equal(staged, 0, 'refused at confirmation, before the consequence stage');
    } finally { service.start = start; }
  });

  it('independence: release leaves a Stunned rider (manual expiry) and GM removal never releases; a counted movement rider survives the release and a legal re-cast refreshes it (A11) with a new cooldown', async() => {
    await startCombat(); await adopt();
    const stun = await admitPc(riderRecord({ name: 'Disposable Calming Hold', kind: 'stunned', direct: 'healing', policy: 'gm-manual', cooldownValue: 1 }));
    token(target).state.currentHp = 55;
    const first = await cast(stun, { faces: [[4]] }); assert.equal(first.a.roll.total, 8, '1d4 + SPI 9/2 → 4 + 4'); assert.deepEqual(hp(target), { current: 60, temp: 3 }, 'capped at max, temp unchanged');
    assert.equal(stuns(target).length, 1); assert.equal(cooldowns()[keyOf(stun)].dueSequence, 3);
    await advanceTo(3); assert.deepEqual(cooldowns(), {}, 'released at 3'); assert.equal(stuns(target).length, 1, 'release does not remove a manual Stunned');
    const kept = { hp: hp(target), pools: pools(), cooldowns: cooldowns() };
    await accept(remove(target, stuns(target)[0].recordId)); assert.equal(stuns(target).length, 0);
    assert.deepEqual({ hp: hp(target), pools: pools(), cooldowns: cooldowns() }, kept, 'removal leaves HP, payment and cooldown state');
    const second = await cast(stun, { faces: [[1]] }); const held = cooldowns(); assert.equal(held[keyOf(stun)].commandId, second.c.commandId);
    await accept(remove(target, stuns(target)[0].recordId)); assert.deepEqual(cooldowns(), held, 'GM removal does not release the cooldown');
    await refused('actor_spell_approve', formulaApproval(stun), 'ability_on_cooldown', owner);
    await advanceTo(6); assert.deepEqual(cooldowns(), {});
    // Order A on a counted movement rider: release at the PC's start while the rider keeps its schedule; re-cast refreshes it.
    const mire = await admitPc(riderRecord({ name: 'Disposable Mind Mire', label: 'Mired', policy: 'target-end-count', occurrences: 3, cooldownValue: 1 }));
    const m1 = await cast(mire, { faces: [[2, 3]] }); const rider = actors.clone(moves(target)), sched = schedules();
    await advanceTo(9); assert.deepEqual(cooldowns(), {}, 'released at 9'); assert.deepEqual(moves(target), rider, 'release does not remove the rider'); assert.deepEqual(schedules(), sched);
    const m2 = await cast(mire, { faces: [[1, 1]] }); assert.equal(chosen(m2.r).combination.outcome, 'refreshed'); assert.equal(chosen(m2.r).combination.replacesInstanceId, m1.a.approvalId);
    assert.equal(moves(target).length, 1); assert.equal(cooldowns()[keyOf(mire)].commandId, m2.c.commandId);
  });

  it('refused applications change neither payment nor cooldown: missing target schedule, stale target, an unresolved movement combination from a changed copy, and an unexplained zero; a GM-explained zero commits and starts the cooldown (inherited)', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(riderRecord({ cooldownValue: 1 }));
    let a = formulaApproval(ref, { t: other, faces: [[6, 6]] }); await approve(a);
    let st = world(), x = await ack(gm, 'actor_consequence', command(a)); assert.equal(x.success, false); assert.equal(x.code, 'effect_schedule_unavailable', JSON.stringify(x)); assert.deepEqual(world(), st);
    await withdraw(a);
    a = formulaApproval(ref); await approve(a); const stale = command(a);
    await accept({ ...base(), actors: [{ ref: target, expectedRevision: token(target).state.actorContract.revision, finalResources: { hp: { current: 49, temp: 3 } } }], adjudication: { definitionId: 'gm-correction', definitionVersionOrHash: 'gm-correction', finalAmount: 0, adjustmentReason: '', chosenResult: 'GM correction' } });
    st = world(); x = await ack(gm, 'actor_consequence', { ...stale, baseCommitSequence: actors.ledger(live()).commitSequence }); assert.equal(x.success, false); assert.equal(x.code, 'approval_mismatch', JSON.stringify(x)); assert.deepEqual(world(), st);
    await withdraw(a);
    a = formulaApproval(ref, { faces: [[1, 1]] }); await approve(a);
    st = world(); await refused('actor_consequence', command(a, { amount: 0 }), 'adjustment_reason_required'); assert.deepEqual(world(), st);
    // Review F2 (inherited A10 zero-result + cooldown start-in-commit, no new rule): a GM-adjusted 0 with a reason pays, installs and starts.
    const zeroBefore = pools(), zeroHp = hp(target), zc = command(a, { amount: 0, reason: 'GM: the target was fully warded' }); await accept(zc);
    assert.deepEqual(hp(target), zeroHp); assert.equal(moves(target).length, 1); assert.equal(spent(zeroBefore, pools(), 'ap'), 2);
    assert.equal(cooldowns()[keyOf(ref)].commandId, zc.commandId, 'the zero-result commit starts the cooldown');
    await advanceTo(3); assert.deepEqual(cooldowns(), {}); assert.equal(moves(target).length, 0);
    const v1 = await admitPc(riderRecord({ name: 'Disposable Mind Mire', label: 'Mired', policy: 'target-end-count', occurrences: 3, cooldownValue: 1 }));
    await cast(v1); await advanceTo(seq() + 3); assert.equal(moves(target).length, 1); assert.equal(cooldowns()[keyOf(v1)], undefined);
    const rec2 = riderRecord({ name: 'Disposable Mind Mire', label: 'Deep mire', policy: 'target-end-count', occurrences: 3, cooldownValue: 1 }); rec2.authoredDefinitionId = entryFor(v1).canonicalDefinition.definitionId;
    const v2 = await admitPc(rec2, 2);
    a = formulaApproval(v2, { faces: [[6, 6]] }); assert.equal(effect.conditionPlan(a, token(target).state.conditions).refused.code, 'modifier_combination_unresolved');
    st = world(); await approve(a);
    const z = await ack(gm, 'actor_consequence', command(a)); assert.equal(z.success, false, JSON.stringify(z)); assert.equal(z.code, 'modifier_combination_unresolved');
    assert.deepEqual(world(), st, 'neither HP, payment nor cooldown changed'); await withdraw(a);
  });

  it('lost ACK and reload: writer failure is atomic with faces retained; GM reload (checkpoint rebuild) and owner snapshot keep rider, schedule and cooldown; the original command replays once; a changed body conflicts', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(riderRecord({ policy: 'target-start-count', occurrences: 2, cooldownValue: 2 })), a = formulaApproval(ref, { faces: [[6, 5]] }); await approve(a);
    const c = command(a);
    const admit = writer.admitConsequence; live().isPermanent = true; writer.admitConsequence = () => ({ queued: false, code: 'rfc_writer_refusal' });
    const st = world(), w = await ack(gm, 'actor_consequence', c);
    assert.equal(w.code, 'rfc_writer_refusal', JSON.stringify(w)); assert.deepEqual(world(), st); assert.equal(receiptsFor(c.commandId).length, 0); assert.deepEqual(cooldowns(), {}, 'no cooldown on writer failure');
    assert.deepEqual(payments.get(live(), a.approvalId).approval.roll, a.roll, 'approval and immediate faces retained');
    writer.admitConsequence = admit; live().isPermanent = false;
    // ACK lost: the GM page never observes this reply (held aside only to compare at the end); the command committed.
    let unseen; gm.emit('actor_consequence', c, r => { unseen = r; }); await sleep(150);
    assert.equal(receiptsFor(c.commandId).length, 1); assert.equal(unseen.success, true);
    const codec = require('../services/roomCheckpoint'), built = codec.buildCheckpointDocuments({ roomId: room.id, gameState: live().gameState, revision: 1 });
    const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])) }); assert.equal(decoded.ok, true);
    const snapshot = world();
    server.rooms.set(room.id, { ...live(), gameState: { ...decoded.global, maps: decoded.maps, ...codec.deriveRootMirrors(decoded.maps) }, checkpointRevision: 1 });
    assert.deepEqual(world(), snapshot, 'rebuild keeps HP, rider, schedule and cooldown');
    const replay = await ack(gm, 'actor_consequence', c); assert.equal(replay.success, true, JSON.stringify(replay)); assert.deepEqual(replay.receipt, unseen.receipt, 'the original receipt, once');
    assert.deepEqual(world(), snapshot); assert.equal(receiptsFor(c.commandId).length, 1); assert.equal(cooldowns()[keyOf(ref)].commandId, c.commandId);
    await refused('actor_consequence', { ...c, adjudication: { ...c.adjudication, finalAmount: 1, adjustmentReason: 'changed' } }, 'command_id_conflict');
    const view = await ack(owner, 'actor_snapshot', { roomId: room.id }); assert.deepEqual(view.maps.default.characterTokens.pc.state.authoredCooldowns, cooldowns());
    await refused('actor_spell_approve', formulaApproval(ref), 'ability_on_cooldown', owner);
    await advanceTo(5); assert.equal(moves(target).length, 0, 'counted rider ended at the target\'s second start (5)'); assert.equal(Object.keys(cooldowns()).length, 1, 'expiry does not release');
    await advance(); assert.deepEqual(cooldowns(), {}, 'released at 6');
  });

  it('route gates: a second primary PC target is refused by the cooldown route, a self target and missing clock refuse, a creature source cannot be admitted; a retired clock keeps the cooldown blocked and a restart never resets it', async() => {
    live().gameState.maps.default.characterTokens.pc2 = { id: 'pc2', ownerUserId: ownerUid, character: { id: 'c2', class: 'Arcanoneer', health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, tempMana: 0, tempActionPoints: 0 }, state: { conditions: [] } };
    server.setCharacterOwner('c2', ownerUid);
    const bound = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc2', ownerUid, characterId: 'c2' }, snapshotHash: actors.hash(live().gameState.maps.default.characterTokens.pc2) });
    assert.equal(bound.success, true, JSON.stringify(bound)); const pc2 = bound.ref;
    const ref = await admitPc(riderRecord({ cooldownValue: 2 }));
    const noClock = await refused('actor_spell_approve', formulaApproval(ref), undefined, owner); assert.ok(['turn_state_unavailable', 'cooldown_clock_required'].includes(noClock.code), noClock.code);
    await startCombat(); await adopt();
    await refused('actor_spell_approve', formulaApproval(ref, { t: pc2 }), 'unsupported_cooldown_route', owner);
    const self = await refused('actor_spell_approve', formulaApproval(ref, { t: pc }), undefined, owner); assert.ok(['unsupported_cooldown_route', 'unsupported_effect_target'].includes(self.code), self.code);
    token(source).authoredAbility.record = riderRecord({ name: 'Disposable Creature Mind Hobble' });
    await refused('actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, source, expectedSourceRevision: token(source).state.actorContract.revision, definitionVersion: 1 }, 'unsupported_source_route');
    await cast(ref, { faces: [[3, 3]] }); const held = cooldowns();
    assert.equal((await ack(gm, 'combat_ended', { roomId: room.id })).success, true);
    assert.deepEqual(cooldowns(), held); await refused('actor_spell_approve', formulaApproval(ref), 'cooldown_clock_retired', owner);
    await startCombat(); await adopt(); for (let i = 0; i < 7; i++) {await advance();}
    assert.deepEqual(cooldowns(), held, 'a new clock never releases a cooldown recorded on the retired one');
    await refused('actor_spell_approve', formulaApproval(ref), 'cooldown_clock_retired', owner);
  });
});
