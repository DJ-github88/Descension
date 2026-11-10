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
 * Rider-save cooldowns: the released GM-recorded rider-local "negates" save (plain immediate damage OR healing on both outcomes, one
 * movement OR Stunned rider only on "failed", both outcomes need the approved schedule) composed with the released authenticated
 * caster-start cooldown (handoff/wizard-cooldowns/APPROVAL.md: it starts in the successful commit containing the AP/mana payment and the
 * immediate part, which either recorded outcome contains). Same compiler, registry, approval/binding, consequence stage, save branch, A11
 * planner and cooldown check/start/release; no new rule, timer or executor. Primary owner PC → one placed creature; AP/mana only.
 * Roster [pc, source, target] (period 3): the PC's turn starts at 0, 3, 6, 9; the target's at 2, 5, 8 and ends at 3, 6, 9.
 */
const PIN_ID = '70000000-0000-4000-8000-0000000000d5';
/** Measured on the base (live 19:38Z = formula-rider-cooldown finals) before this change: unrelated definitions keep these bytes. */
const PINNED = {
  manualSaveStun: { label: 'p14-save-branch-1', definitionHash: '50de690102ffcf0b8a9621eceacf2c217b5ce45f71c92af01c7328813045cdd4', descriptor: 'bb7cfde9656222d017020d4f3ce04c46878b70cad4acc991e7fc9952128e818c' },
  timedSaveMove: { label: 'p14-save-branch-timed-1', definitionHash: '1edd73493ff921c59c28fb2304aefa5888b50560ae5da979c4d016ae61c33358', descriptor: '322654bdbb2db13d4bc4a7c775f9c8a624cd5b85632ed4e108d55faf99c3378d' },
  countedSaveMoveHealing: { label: 'p14-save-branch-timed-1', definitionHash: '3b978f57e1602df10129bd1b00215fa870e7fa7cc50d50f6c76e384a647eebc3', descriptor: '5379728cb828c7849e639ca095909dbcb470855f4273922fe196cbc6b734f989' },
  plainMoveCooldown: { label: 'p14-a10-effect-cooldown-1', definitionHash: 'a8876f27b117862ee94c49662dd63c00e3be1b43b4d8cf224be2fb79283da82e', descriptor: '7a5fabde5f6ac6c10506f1f4292ea3d45f8b6f11492cc671f5b78fb5a9749e67' },
  plainStunCooldown: { label: 'p14-a10-effect-cooldown-1', definitionHash: '4a8c83c7bad9d21980ef3284d30875bf8380c9306d0c010686892606953afb40', descriptor: '942fb8bf96a235b7a7ffdd4142ca4c8dda5215ae5200b25fe569279284326990' },
  scaledMoveCooldown: { label: 'p14-a10-effect-formula-cooldown-1', definitionHash: 'fb4006c90e9c8f0fb859e2948cd4b646e01f9c4cf60af11d2ed8fa9ae70765e0', descriptor: 'e050c8d75f7281842f21c040603a3a6a31a662fa28dfa122f0d453651e513441' },
  attributeSave: { label: 'p14-save-branch-timed-1', definitionHash: 'f01806f772449e1a2140a32e350d8a7cdc6c60b0d85fadff2da74ff4f66d0fd1', descriptor: '8588e179ce9d83504e729c1cb01e6586b9fdd8e07bdbd8fee02c3126fc367b63' }
};
const SAVE = { ability: 'constitution', dc: 12, outcome: 'negates' };
/** Disposable Wizard record: plain immediate part + one rider with a rider-local negates save and the explicit caster-start cooldown by default. */
function saveRecord({ name = 'Disposable Rime Hobble', kind = 'movement', feet = -10, label = 'Rime Hobble', policy = 'target-next-end', occurrences, direct = 'damage',
  formula = direct === 'healing' ? '2d4' : '1d6+2', save = SAVE, ap = 2, mana = 3, cooldownValue = 1, cooldownType = cooldown.TYPE, extra } = {}) {
  const c = { profile: pure.EFFECT_CAPABILITY, effect: kind, ...(kind === 'movement' ? { movementFeet: feet, label } : {}), expiryPolicy: policy, ...(occurrences !== undefined ? { occurrences } : {}),
    durationText: 'Until the frost thaws', gmNote: 'The table rolls the Constitution save; the GM records saved or failed.', ...(save ? { save } : {}) };
  const d = { name, description: 'Rider-save cooldown disposable test', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' },
    effectTypes: direct ? [direct, 'control'] : ['control'], controlConfig: { authoredCondition: c },
    ...(direct === 'damage' ? { damageConfig: { damageType: 'direct', elementType: 'rime', formula, resolution: 'DICE' } } : {}),
    ...(direct === 'healing' ? { healingConfig: { healingType: 'direct', formula, resolution: 'DICE' } } : {}),
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: ap, mana },
    ...(cooldownType !== null ? { cooldownConfig: { cooldownType, cooldownValue } } : {}) };
  if (extra) {extra(d);}
  return { ...actors.clone(d), authoredDraft: d, authoredDefinitionId: uuid() };
}
const rollFor = (formula, faces) => { const r = pure.readFormula(formula); return { mode: 'physical', dice: [{ sides: r.dice[0].sides, faces }], constant: r.constant, reading: r.reading, total: faces.reduce((a, b) => a + b, r.constant) }; };

describe('Rider-save cooldowns — GM-recorded rider-local negates save + the authenticated caster-start cooldown, registered production handlers', function() {
  this.timeout(30000);
  let server, room, gm, owner, observer, writer, source, target, other, pc, ownerUid;
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer }); await server.start();
    for (const e of ['actor_bind', 'actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_revoke', 'actor_spell_approve', 'actor_spell_withdraw',
      'actor_turn_boundary', 'combat_started', 'combat_ended', 'actor_spell_list']) {server.setEventLimits(e, { maxPerMinute: 4000, maxPerSecond: 4000 });}
    const gmUid = server.nextUserId(); ownerUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid); server.registerAuthToken('owner', ownerUid); server.registerAuthToken('observer', server.nextUserId());
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: gmUid });
    for (const role of ['owner', 'observer']) { const s = server.connect({ token: role }); await once(s, 'connect'); const j = once(s, 'room_joined'); s.emit('join_room', { roomId: room.id, playerName: role, password: '' }); await j; if (role === 'owner') {owner = s;} else {observer = s;} }
    server.setCharacterOwner('c', ownerUid);
    const map = () => room.gameState.maps.default;
    for (const id of ['source', 'target', 'other']) {
      const t = { id, name: id, creatureId: 'disposable', stats: { maxHp: 60, maxMana: 20, maxAP: 10, speed: 30 }, authoredAbility: { schemaVersion: 1, record: saveRecord({ cooldownType: null }), librarySpellId: null },
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
  async function advanceTo(n) { let last; while (seq() < n) {last = await advance();} return last; }
  async function admitPc(record, definitionVersion = 1) {
    const r = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, record, definitionVersion, classId: 'arcanoneer' });
    assert.equal(r.success, true, JSON.stringify(r)); return r.definitionRef;
  }
  const entryFor = ref => installed.list(live()).entries.find(e => pure.actionId(e.definitionRef) === pure.actionId(ref));
  const res = a => ({ gmConfirmed: true, timing: a.effectTerms.timing, timingNote: 'GM: range and exact target confirmed', evidence: 'PRIVATE GM evidence: table save d20' });
  function spellOf(e) { const d = e.canonicalDefinition; return { definitionId: pure.actionId(e.definitionRef), definitionHash: `${pure.EFFECT_CAPABILITY}/${e.definitionRef.definitionHash}`, name: d.name, kind: 'effect', damageTypes: d.effects.direct?.damageTypes || [] }; }
  function pcApproval(ref, { t = target, faces } = {}) {
    const e = entryFor(ref), d = e.canonicalDefinition, f = d.effects.direct.formula;
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence, source: pc, target: t,
      spell: spellOf(e), roll: rollFor(f, faces || Array(pure.readFormula(f).dice[0].count).fill(3)), price: e.descriptor.price, classPayment: null, effectTerms: effect.termsFor(d) };
  }
  async function approve(a) { const before = actors.clone(live().gameState), r = await ack(owner, 'actor_spell_approve', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); assert.deepEqual(live().gameState, before, 'approval spends nothing and starts no cooldown'); return r; }
  /** The GM's command exactly as the client planner builds it for a recorded branch. */
  function command(a, { branch, resolution, amount, reason = '' } = {}) {
    const pay = {}, p = actors.resources(token(a.source), 'character');
    for (const k of ['ap', 'mana']) {if (a.price[k]) {pay[k] = payments.tempFirst(p[k].current, p[k].temp, a.price[k]);}}
    const applies = effect.conditionApplies(a.effectTerms, branch);
    const plan = applies ? effect.conditionPlan(a, token(a.target).state.conditions || []) : { ops: null, combination: null };
    const direct = a.effectTerms.direct, finalAmount = amount ?? a.roll.total;
    const h = actors.resources(token(a.target), 'creature').hp, fromTemp = Math.min(h.temp, finalAmount);
    const targetEntry = { ref: a.target, expectedRevision: token(a.target).state.actorContract.revision, ...(applies ? { conditions: plan.ops || [] } : {}),
      finalResources: { hp: direct.kind === 'damage' ? { current: Math.max(0, h.current - (finalAmount - fromTemp)), temp: h.temp - fromTemp } : { current: Math.min(h.max, h.current + finalAmount), temp: h.temp } } };
    return { ...base(), source: a.source, target: a.target, approval: { approvalId: a.approvalId, contentHash: actors.hash(a) },
      actors: [{ ref: a.source, expectedRevision: token(a.source).state.actorContract.revision, finalResources: pay }, targetEntry],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, finalAmount, adjustmentReason: reason,
        chosenResult: JSON.stringify(effect.resultFor(a, resolution || res(a), plan.combination, branch)) } };
  }
  async function accept(c) { const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true, JSON.stringify(r)); return r; }
  async function cast(ref, branch, opts = {}) { const a = pcApproval(ref, opts); await approve(a); const c = command(a, { branch, ...opts }), r = await accept(c); return { a, c, r }; }
  async function refused(event, data, code, socket = gm) { const before = actors.clone(live().gameState), r = await ack(socket, event, data); assert.equal(r.success, false, JSON.stringify(r)); if (code) {assert.equal(r.code, code, JSON.stringify(r));} assert.deepEqual(live().gameState, before, `${event} changed nothing`); return r; }
  const withdraw = a => ack(owner, 'actor_spell_withdraw', { roomId: room.id, approvalId: a.approvalId, approval: a });
  const cooldowns = () => actors.clone(token(pc).state.authoredCooldowns || {});
  const moves = ref => token(ref).state.conditions.filter(profile.isMovementModifier);
  const stuns = ref => token(ref).state.conditions.filter(profile.isStunned);
  const hp = ref => { const v = actors.resources(token(ref), ref.kind).hp; return { current: v.current, temp: v.temp }; };
  const pools = () => actors.clone(actors.resources(token(pc), 'character'));
  const spent = (before, after, k) => before[k].current + before[k].temp - after[k].current - after[k].temp;
  const receiptsFor = commandId => actors.ledger(live()).receipts.filter(x => x.commandId === commandId);
  const chosen = r => JSON.parse(r.receipt.adjudication.chosenResult);
  const correction = actorsList => ({ ...base(), actors: actorsList, adjudication: { definitionId: 'gm-correction', definitionVersionOrHash: 'gm-correction', finalAmount: 0, adjustmentReason: '', chosenResult: 'GM correction' } });
  const remove = (ref, id) => correction([{ ref, expectedRevision: token(ref).state.actorContract.revision, conditions: [{ op: 'remove', recordId: id }] }]);
  const schedules = () => actors.clone(live().gameState.combat?.effectLifecycle?.schedules || {});
  const scheduleOf = recordId => Object.values(schedules()).find(i => i.recordId === recordId);
  const world = () => ({ pools: pools(), hp: hp(target), conditions: actors.clone(token(target).state.conditions), otherHp: hp(other), otherConditions: actors.clone(token(other).state.conditions),
    schedules: schedules(), cooldowns: cooldowns(), receipts: actors.ledger(live()).receipts.length });
  const opts = () => ({ roomId: room.id, definitionVersion: 1, classId: 'arcanoneer' });
  const pinnedOpts = { roomId: 'pinned-room', definitionVersion: 1, classId: 'arcanoneer' };
  const descriptorSha = c => require('crypto').createHash('sha256').update(JSON.stringify(c.descriptor)).digest('hex');
  const keyOf = ref => cooldown.key(pc, ref.definitionId);

  it('compiler and registry: movement/Stunned × damage/healing × every expiry policy × 1–10 take the cooldown with the save under their own labels; unrelated definitions keep their pinned bytes; other save shapes, families, cooldowns, class payment and creature sources stay refused', () => {
    const cases = [];
    for (const kind of ['movement', 'stunned']) {for (const direct of ['damage', 'healing']) {for (const [policy, occurrences] of [['gm-manual'], ['target-next-start'], ['target-next-end'], ['target-start-count', 2], ['target-end-count', 10]]) {cases.push({ kind, direct, policy, occurrences });}}}
    cases.forEach((c, i) => {
      const name = JSON.stringify(c), value = 1 + (i % 10), m = pure.definitionFromWizard(saveRecord({ ...c, cooldownValue: value }), opts());
      assert.equal(m.ok, true, `${name}: ${m.reason}`);
      assert.deepEqual(m.definition.effects.save, { scope: 'condition', ...SAVE }, name);
      assert.deepEqual(m.definition.cooldown, { cooldownType: cooldown.TYPE, cooldownValue: value }, name);
      const compiled = definitions.compileDefinition(m.definition); assert.equal(compiled.ok, true, name);
      assert.equal(compiled.descriptor.compilerVersion, c.policy === 'gm-manual' ? 'p14-save-branch-cooldown-1' : 'p14-save-branch-timed-cooldown-1', name);
      assert.deepEqual(compiled.descriptor.cooldown, m.definition.cooldown, name); assert.deepEqual(compiled.descriptor.effects.save, m.definition.effects.save, name);
      assert.equal(pure.creatureSourceRefusal(m.definition).code, 'unsupported_source_route', name);
      // Dropping the cooldown key gives back the released save route and its label.
      const bare = actors.clone(m.definition); delete bare.cooldown;
      assert.equal(definitions.compileDefinition(bare).descriptor.compilerVersion, c.policy === 'gm-manual' ? 'p14-save-branch-1' : 'p14-save-branch-timed-1', name);
    });
    for (const [name, rec] of Object.entries({
      manualSaveStun: saveRecord({ kind: 'stunned', policy: 'gm-manual', cooldownType: null }), timedSaveMove: saveRecord({ cooldownType: null }),
      countedSaveMoveHealing: saveRecord({ direct: 'healing', policy: 'target-end-count', occurrences: 3, cooldownType: null }),
      plainMoveCooldown: saveRecord({ save: null }), plainStunCooldown: saveRecord({ kind: 'stunned', policy: 'gm-manual', save: null }),
      scaledMoveCooldown: saveRecord({ save: null, formula: '2d6 + intelligence/3' }),
      attributeSave: saveRecord({ cooldownType: null, extra: d => { const k = d.controlConfig.authoredCondition; delete k.movementFeet; Object.assign(k, { effect: 'attribute', attribute: 'agility', attributeAmount: -2, label: 'Leaden' }); } })
    })) {
      const c = definitions.compileDefinition(pure.definitionFromWizard({ ...rec, authoredDefinitionId: PIN_ID }, pinnedOpts).definition);
      assert.deepEqual({ label: c.descriptor.compilerVersion, definitionHash: c.definitionHash, descriptor: descriptorSha(c) }, PINNED[name], name);
    }
    // Wizard compiler refusals (the whole record stays manual), each for its own existing reason.
    const asAttribute = d => { const k = d.controlConfig.authoredCondition; delete k.movementFeet; Object.assign(k, { effect: 'attribute', attribute: 'agility', attributeAmount: -2, label: 'Leaden' }); };
    const manual = {
      halves: [saveRecord({ save: { ...SAVE, outcome: 'halves' } }), /only "negates this effect"/],
      riderOnly: [saveRecord({ direct: null, kind: 'stunned' }), /rider-only save stays manual/],
      attributeRider: [saveRecord({ extra: asAttribute }), /Cooldowns currently require one creature target/],
      periodicRider: [saveRecord({ direct: null, extra: d => { d.controlConfig.authoredCondition = { profile: pure.EFFECT_CAPABILITY, effect: 'periodic', periodicKind: 'damage', periodicFormula: '1d4', periodicDamageType: 'blight', tickRoll: 'each-tick', label: 'Brand', expiryPolicy: 'target-start-count', occurrences: 2, durationText: 'x', gmNote: 'y', save: SAVE }; } }), /Cooldowns currently require one creature target/],
      flatDr: [saveRecord({ direct: 'healing', extra: d => { const k = d.controlConfig.authoredCondition; delete k.movementFeet; Object.assign(k, { effect: 'damageReduction', drAmount: 2, label: 'Warded' }); } }), /Cooldowns currently require one creature target/],
      directPartSave: [saveRecord({ extra: d => { d.damageConfig.savingThrow = { ability: 'constitution', difficultyClass: 12, saveOutcome: 'negates' }; } }), /damageConfig|savingThrow|save/i],
      zero: [saveRecord({ cooldownValue: 0 }), /cooldownConfig/], eleven: [saveRecord({ cooldownValue: 11 }), /cooldownConfig/], legacy: [saveRecord({ cooldownType: 'turn_based', cooldownValue: 1 }), /legacy/],
      selfTarget: [saveRecord({ extra: d => { d.targetingConfig.targetRestrictions = ['self']; d.targetingConfig.rangeDistance = 0; } }), /distinct creature targeting required/],
      area: [saveRecord({ extra: d => { d.targetingConfig.targetingType = 'area'; } }), /Cooldowns currently require one creature target/]
    };
    for (const [name, [rec, reason]] of Object.entries(manual)) {
      const r = pure.definitionFromWizard(rec, opts()); assert.equal(r.ok, false, `${name}: ${JSON.stringify(r)}`); assert.match(r.reason, reason, name);
    }
    // Registry refusals on hand-built definitions (the server fence holds without the client compiler).
    const ok = pure.definitionFromWizard(saveRecord(), opts()).definition;
    for (const bad of [{ cooldownType: cooldown.TYPE, cooldownValue: 0 }, { cooldownType: cooldown.TYPE, cooldownValue: 11 }, { cooldownType: 'turn_based', cooldownValue: 1 }, { cooldownType: cooldown.TYPE, cooldownValue: 2, extra: true }]) {
      assert.equal(definitions.compileDefinition({ ...actors.clone(ok), cooldown: bad }).ok, false, JSON.stringify(bad));
    }
    const forged = mutate => { const d = actors.clone(ok); mutate(d); return definitions.compileDefinition(d); };
    assert.equal(forged(d => { d.effects.condition = { kind: 'attribute', attribute: 'agility', amount: -2, label: 'Leaden' }; }).ok, false, 'attribute rider + save + cooldown');
    assert.equal(forged(d => { d.effects.condition = { kind: 'damageReduction', amount: 2, label: 'Warded' }; }).ok, false, 'flat DR + save + cooldown');
    assert.equal(forged(d => { d.effects.condition = { kind: 'periodic', tick: { kind: 'damage', formula: '1d4', damageTypes: ['rime'] }, label: 'Brand', tickRoll: 'each-tick' }; d.timing = { ...d.timing, expiryPolicy: 'target-start-count', occurrences: 2 }; }).ok, false, 'periodic + save + cooldown');
    // Fence update (formula-rider save cooldowns): a scaled part with the save and the cooldown takes its own label; own suite.
    assert.equal(forged(d => { d.effects.direct = { ...d.effects.direct, formula: '2d6 + intelligence/3' }; }).descriptor.compilerVersion, 'p14-save-branch-timed-formula-cooldown-1', 'scaled + save + cooldown');
    assert.equal(forged(d => { d.effects.direct = null; }).ok, false, 'rider-only save + cooldown');
    assert.equal(forged(d => { d.effects.save = { ...d.effects.save, outcome: 'halves' }; }).ok, false, 'halves + cooldown');
    assert.equal(forged(d => { d.targeting.restriction = 'self'; }).ok, false, 'self');
    // Controls: the same forgeries without the cooldown keep their released status (the refusals above are not the cooldown alone).
    const bare = actors.clone(ok); delete bare.cooldown; assert.equal(definitions.compileDefinition(bare).ok, true);
    const attrBare = actors.clone(bare); attrBare.effects.condition = { kind: 'attribute', attribute: 'agility', amount: -2, label: 'Leaden' };
    assert.equal(definitions.compileDefinition(attrBare).ok, true, 'attribute save bundle without the cooldown compiles (released)');
    const classPaid = { ...actors.clone(ok), classPayment: { domain: 'elementalSpheres', price: { costs: ['arcane'], gains: [] } }, catalogueSource: { spellId: 'x', classId: 'arcanoneer', recordHash: 'a'.repeat(64) } };
    assert.equal(definitions.compileDefinition(classPaid, { verifyCatalogue: false }).code, 'UNSUPPORTED_SHAPE', 'no class payment with a save or cooldown');
  });

  for (const [title, kind, direct] of [['movement + immediate damage', 'movement', 'damage'], ['Stunned + immediate healing', 'stunned', 'healing']]) {
    it(`${title}, both outcomes: one receipt pays once and applies the immediate part; saved adds no rider or schedule, failed installs the rider with its schedule; the cooldown starts exactly once with the cast commandId on either outcome; blocked reuse spends nothing`, async() => {
      await startCombat(); await adopt();
      const savedRef = await admitPc(saveRecord({ name: `Disposable Saved ${kind}`, kind, direct, cooldownValue: 2 }));
      const failedRef = await admitPc(saveRecord({ name: `Disposable Failed ${kind}`, kind, direct, label: 'Sleet Drag', cooldownValue: 2 }));
      if (direct === 'healing') {token(target).state.currentHp = 40;}
      const faces = direct === 'healing' ? [3, 3] : [4];
      const rider = r => (kind === 'movement' ? moves : stuns)(r);
      for (const [ref, branch] of [[savedRef, 'saved'], [failedRef, 'failed']]) {
        const before = pools(), hp0 = hp(target), riders0 = rider(target).length, sched0 = Object.keys(schedules()).length;
        const { a, c, r } = await cast(ref, branch, { faces });
        assert.equal(a.roll.total, 6);
        assert.equal(receiptsFor(c.commandId).length, 1, `${branch}: one command, one receipt`);
        assert.equal(spent(before, pools(), 'ap'), 2, branch); assert.equal(spent(before, pools(), 'mana'), 3, branch);
        assert.deepEqual(hp(target), direct === 'damage' ? { current: hp0.current - (6 - hp0.temp), temp: 0 } : { current: hp0.current + 6, temp: hp0.temp }, `${branch}: immediate part on both outcomes`);
        assert.equal(chosen(r).branch, branch); assert.equal(chosen(r).conditionApplied, branch === 'failed');
        assert.equal(rider(target).length, riders0 + (branch === 'failed' ? 1 : 0), branch);
        assert.equal(Object.keys(schedules()).length, sched0 + (branch === 'failed' ? 1 : 0), `${branch}: a schedule only for the installed rider`);
        const item = cooldowns()[keyOf(ref)]; assert.deepEqual([item.startSequence, item.dueSequence, item.occurrences, item.period, item.commandId], [0, 6, 2, 3, c.commandId], `${branch}: N=2 → PC starts 3, 6`);
        const st = world(); await refused('actor_spell_approve', pcApproval(ref, { faces }), 'ability_on_cooldown', owner); assert.deepEqual(world(), st, `${branch}: blocked reuse`);
      }
      assert.equal(Object.keys(cooldowns()).length, 2, 'two definitions, two cooldowns');
      await advanceTo(5); assert.equal(Object.keys(cooldowns()).length, 2); await advance(); assert.deepEqual(cooldowns(), {}, 'both release at 6');
      const view = await ack(observer, 'actor_snapshot', { roomId: room.id }); assert.ok(!JSON.stringify(view).includes('PRIVATE'));
      const again = await cast(savedRef, 'failed', { faces }); assert.equal(cooldowns()[keyOf(savedRef)].dueSequence, 12); assert.equal(cooldowns()[keyOf(savedRef)].commandId, again.c.commandId);
    });
  }

  it('a saved cast while an earlier rider of the same effect is active leaves that rider and its schedule byte-equal and still starts the cooldown; the earlier rider then expires on its own boundary', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(saveRecord({ policy: 'target-end-count', occurrences: 3, cooldownValue: 1 }));
    const first = await cast(ref, 'failed'); assert.equal(moves(target).length, 1); assert.equal(scheduleOf(first.a.approvalId).dueSequence, 9);
    await advanceTo(3); assert.deepEqual(cooldowns(), {}, 'released at 3; the rider (due 9) stays');
    const held = { conditions: actors.clone(token(target).state.conditions), schedules: schedules() };
    assert.equal(effect.conditionPlan(pcApproval(ref), token(target).state.conditions).combination.outcome, 'refreshed', '"failed" would refresh it');
    const hp0 = hp(target), { c, r } = await cast(ref, 'saved', { faces: [1] });
    assert.deepEqual(token(target).state.conditions, held.conditions, 'no new rider; the earlier instance is untouched (not refreshed)');
    assert.deepEqual(schedules(), held.schedules, 'no schedule added, removed or moved');
    assert.equal(chosen(r).combination, undefined); assert.equal(hp(target).current, hp0.current - (3 - hp0.temp));
    assert.equal(cooldowns()[keyOf(ref)].commandId, c.commandId, 'the saved cast starts the cooldown'); assert.equal(cooldowns()[keyOf(ref)].dueSequence, 6);
    await advanceTo(8); assert.equal(moves(target).length, 1); const last = await advance();
    assert.deepEqual(chosen(last.r).expired, [first.a.approvalId], 'the earlier rider expires at its own final boundary (9)'); assert.equal(moves(target).length, 0);
  });

  it('timed expiry and cooldown release are independent in both orders and on one shared boundary; GM removal never releases and release never removes', async() => {
    await startCombat(); await adopt();
    // Order B: a rider due at the target's next start (2) expires while the cooldown holds until the PC's next start (3).
    const b = await admitPc(saveRecord({ name: 'Disposable Frost Nip', label: 'Frost Nip', policy: 'target-next-start', cooldownValue: 1 }));
    const nip = await cast(b, 'failed'); assert.equal(scheduleOf(nip.a.approvalId).dueSequence, 2);
    await advance(); assert.equal(seq(), 1);
    // Shared boundary 3: the end of the target's turn is the start of the PC's turn. Cast during the source's turn (1): the next-end
    // rider is due at 3 and so is its cooldown (N=1: the PC's next start).
    const s = await admitPc(saveRecord({ name: 'Disposable Rime Lock', label: 'Rime Lock', policy: 'target-next-end', cooldownValue: 1 }));
    const lock = await cast(s, 'failed'); assert.equal(scheduleOf(lock.a.approvalId).dueSequence, 3); assert.equal(cooldowns()[keyOf(s)].dueSequence, 3);
    const heldB = cooldowns();
    let step = await advance(); assert.equal(seq(), 2); assert.deepEqual(chosen(step.r).expired, [nip.a.approvalId]); assert.deepEqual(cooldowns(), heldB, 'rider expiry does not release (order B)');
    const hp0 = hp(target), pools0 = pools(); step = await advance(); assert.equal(seq(), 3);
    assert.deepEqual(chosen(step.r).expired, [lock.a.approvalId], 'shared boundary: the rider expires'); assert.deepEqual(cooldowns(), {}, 'and both cooldowns release in the same receipt');
    assert.deepEqual({ hp: hp(target), pools: pools() }, { hp: hp0, pools: pools0 }, 'neither expiry nor release changes HP or pools');
    assert.deepEqual((await ack(gm, 'actor_turn_boundary', step.c)).receipt, step.r.receipt, 'boundary replay returns the same receipt'); assert.equal(seq(), 3);
    // Order A: the cooldown releases (6) while a counted rider keeps its schedule (due 9); GM removal afterwards leaves the next cooldown alone.
    const a = await admitPc(saveRecord({ name: 'Disposable Hoarfrost', label: 'Hoarfrost', policy: 'target-end-count', occurrences: 2, cooldownValue: 1 }));
    const frost = await cast(a, 'failed'); const sched = schedules(), rec = actors.clone(moves(target)); assert.equal(scheduleOf(frost.a.approvalId).dueSequence, 9);
    await advanceTo(6); assert.deepEqual(cooldowns(), {}, 'released at 6'); assert.deepEqual(moves(target), rec, 'release does not remove the rider'); assert.deepEqual(schedules(), sched);
    const again = await cast(a, 'saved'); const held = cooldowns(); assert.deepEqual(moves(target), rec, 'the saved re-cast leaves it');
    await accept(remove(target, frost.a.approvalId)); assert.equal(moves(target).length, 0); assert.deepEqual(schedules(), {}, 'GM removal cancels the schedule');
    assert.deepEqual(cooldowns(), held, 'GM removal does not release the cooldown'); assert.equal(held[keyOf(a)].commandId, again.c.commandId);
  });

  it('rejected confirmations start nothing and spend nothing: a missing schedule refuses both outcomes, changed timing needs reapproval on either branch, stale actors and an unexplained zero refuse; a GM-explained zero commits and starts the cooldown (inherited)', async() => {
    const ref = await admitPc(saveRecord({ cooldownValue: 1 }));
    await startCombat([pc, source]); await adopt(); // target outside the roster: the cooldown route is open, the rider schedule is not
    let a = pcApproval(ref); await approve(a);
    for (const branch of ['saved', 'failed']) {await refused('actor_consequence', command(a, { branch }), 'effect_schedule_unavailable');}
    assert.ok(payments.get(live(), a.approvalId), 'the approval is still pending'); await withdraw(a);
    await ack(gm, 'combat_ended', { roomId: room.id }); await startCombat(); await adopt();
    for (const branch of ['saved', 'failed']) {
      a = pcApproval(ref); await approve(a);
      await refused('actor_consequence', command(a, { branch, resolution: { ...res(a), timing: { ...a.effectTerms.timing, expiryPolicy: 'gm-manual' } } }), 'owner_reapproval_required');
      await withdraw(a);
    }
    assert.deepEqual(cooldowns(), {});
    // Stale target: a GM correction lands after the command was planned.
    a = pcApproval(ref); await approve(a);
    const staleTarget = command(a, { branch: 'saved' });
    await accept(correction([{ ref: target, expectedRevision: token(target).state.actorContract.revision, finalResources: { hp: { current: 49, temp: 3 } } }]));
    let st = world(), x = await ack(gm, 'actor_consequence', { ...staleTarget, baseCommitSequence: actors.ledger(live()).commitSequence });
    assert.equal(x.success, false); assert.equal(x.code, 'approval_mismatch', JSON.stringify(x)); assert.deepEqual(world(), st);
    await withdraw(a);
    // Stale source: the caster's pools change after the command was planned.
    a = pcApproval(ref); await approve(a);
    const staleSource = command(a, { branch: 'failed' });
    await accept(correction([{ ref: pc, expectedRevision: token(pc).state.actorContract.revision, finalResources: { ap: { current: 11, temp: 1 } } }]));
    st = world(); x = await ack(gm, 'actor_consequence', { ...staleSource, baseCommitSequence: actors.ledger(live()).commitSequence });
    assert.equal(x.success, false, JSON.stringify(x)); assert.equal(x.code, 'approval_mismatch', JSON.stringify(x)); assert.deepEqual(world(), st);
    assert.deepEqual(cooldowns(), {}, 'no rejected confirmation started a cooldown');
    await withdraw(a); a = pcApproval(ref, { faces: [1] }); await approve(a);
    await refused('actor_consequence', command(a, { branch: 'saved', amount: 0 }), 'adjustment_reason_required');
    const zero = command(a, { branch: 'saved', amount: 0, reason: 'GM: the target was fully warded' }), before = pools(), hp0 = hp(target); await accept(zero);
    assert.deepEqual(hp(target), hp0); assert.equal(spent(before, pools(), 'ap'), 2); assert.equal(moves(target).length, 0);
    assert.equal(cooldowns()[keyOf(ref)].commandId, zero.commandId, 'a GM-explained zero on the saved outcome commits and starts the cooldown');
  });

  it('writer failure is atomic on both outcomes; racing confirmations (one per branch) execute once with one cooldown; lost ACK, checkpoint rebuild and exact-command recovery return the original receipt; a changed branch under the same command id conflicts; a confirmation meeting a committed cooldown refuses before the stage', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(saveRecord({ policy: 'target-start-count', occurrences: 2, cooldownValue: 2 })), a = pcApproval(ref, { faces: [5] }); await approve(a);
    const admit = writer.admitConsequence; live().isPermanent = true; writer.admitConsequence = () => ({ queued: false, code: 'rsc_writer_refusal' });
    for (const branch of ['saved', 'failed']) {
      const c = command(a, { branch }), st = world(), w = await ack(gm, 'actor_consequence', c);
      assert.equal(w.code, 'rsc_writer_refusal', JSON.stringify(w)); assert.deepEqual(world(), st); assert.equal(receiptsFor(c.commandId).length, 0);
    }
    assert.deepEqual(cooldowns(), {}, 'no cooldown on writer failure'); assert.ok(payments.get(live(), a.approvalId), 'approval retained');
    writer.admitConsequence = admit; live().isPermanent = false;
    const failed = command(a, { branch: 'failed' }), saved = command(a, { branch: 'saved' });
    const results = await Promise.all([ack(gm, 'actor_consequence', failed), ack(gm, 'actor_consequence', saved)]);
    assert.equal(results.filter(r => r.success).length, 1, JSON.stringify(results)); assert.equal(results.find(r => !r.success).code, 'approval_consumed');
    const winner = results[0].success ? failed : saved, won = results[0].success ? results[0] : results[1];
    assert.deepEqual(Object.keys(cooldowns()), [keyOf(ref)]); assert.equal(cooldowns()[keyOf(ref)].commandId, winner.commandId);
    assert.equal(moves(target).length, winner === failed ? 1 : 0);
    let unseen; gm.emit('actor_consequence', winner, r => { unseen = r; }); await sleep(150); assert.deepEqual(unseen.receipt, won.receipt, 'duplicate returns the original receipt');
    const codec = require('../services/roomCheckpoint'), built = codec.buildCheckpointDocuments({ roomId: room.id, gameState: live().gameState, revision: 1 });
    const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])) }); assert.equal(decoded.ok, true);
    const snapshot = world();
    server.rooms.set(room.id, { ...live(), gameState: { ...decoded.global, maps: decoded.maps, ...codec.deriveRootMirrors(decoded.maps) }, checkpointRevision: 1 });
    assert.deepEqual(world(), snapshot, 'rebuild keeps HP, rider, schedule and cooldown');
    const replay = await ack(gm, 'actor_consequence', winner); assert.deepEqual(replay.receipt, won.receipt, 'exact-command recovery: the original receipt');
    assert.deepEqual(world(), snapshot); assert.equal(receiptsFor(winner.commandId).length, 1);
    const rival = winner === failed ? saved : failed;
    await refused('actor_consequence', { ...rival, commandId: winner.commandId, actionEpoch: winner.actionEpoch, baseCommitSequence: winner.baseCommitSequence }, 'command_id_conflict');
    const view = await ack(owner, 'actor_snapshot', { roomId: room.id }); assert.deepEqual(view.maps.default.characterTokens.pc.state.authoredCooldowns, cooldowns());
    await refused('actor_spell_approve', pcApproval(ref), 'ability_on_cooldown', owner);
    await advanceTo(5); assert.equal(Object.keys(cooldowns()).length, 1); await advance(); assert.deepEqual(cooldowns(), {}, 'released at 6');
    // Defence in depth (state injected; the one-pending gate prevents a real interleaving): either branch meets the committed cooldown at
    // GM confirmation and refuses before the consequence stage; nothing is paid, applied, installed or re-started.
    const b = pcApproval(ref, { faces: [6] }); await approve(b);
    const injected = { [keyOf(ref)]: { combatId: live().gameState.combat.effectLifecycle.id, startSequence: 6, dueSequence: 12, occurrences: 2, period: 3, commandId: uuid() } };
    token(pc).state.authoredCooldowns = actors.clone(injected);
    const service = require('../services/authoredCooldowns'), start = service.start; let staged = 0; service.start = (...args) => { staged++; return start(...args); };
    try {
      for (const branch of ['saved', 'failed']) {
        const st = world(), x = await ack(gm, 'actor_consequence', command(b, { branch })); assert.equal(x.success, false, JSON.stringify(x)); assert.equal(x.code, 'ability_on_cooldown');
        assert.deepEqual(world(), st, branch); assert.deepEqual(cooldowns(), injected, 'the committed cooldown is not reset');
      }
      assert.equal(staged, 0, 'refused at confirmation, before the consequence stage');
    } finally { service.start = start; }
  });

  it('route gates: a primary PC target and a self target are refused, a missing clock refuses, a creature source cannot be admitted; retired combat never resets the cooldown and a restart never releases it', async() => {
    live().gameState.maps.default.characterTokens.pc2 = { id: 'pc2', ownerUserId: ownerUid, character: { id: 'c2', class: 'Arcanoneer', health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, tempMana: 0, tempActionPoints: 0 }, state: { conditions: [] } };
    server.setCharacterOwner('c2', ownerUid);
    const bound = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc2', ownerUid, characterId: 'c2' }, snapshotHash: actors.hash(live().gameState.maps.default.characterTokens.pc2) });
    assert.equal(bound.success, true, JSON.stringify(bound)); const pc2 = bound.ref;
    const ref = await admitPc(saveRecord({ cooldownValue: 2 }));
    const noClock = await refused('actor_spell_approve', pcApproval(ref), undefined, owner); assert.ok(['turn_state_unavailable', 'cooldown_clock_required'].includes(noClock.code), noClock.code);
    await startCombat(); await adopt();
    const pcTarget = await refused('actor_spell_approve', pcApproval(ref, { t: pc2 }), undefined, owner); assert.ok(['unsupported_cooldown_route', 'pc_target_save_unsupported'].includes(pcTarget.code), pcTarget.code);
    const self = await refused('actor_spell_approve', pcApproval(ref, { t: pc }), undefined, owner); assert.ok(['unsupported_cooldown_route', 'unsupported_effect_target', 'pc_target_save_unsupported'].includes(self.code), self.code);
    token(source).authoredAbility.record = saveRecord({ name: 'Disposable Creature Rime Hobble' });
    await refused('actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, source, expectedSourceRevision: token(source).state.actorContract.revision, definitionVersion: 1 }, 'unsupported_source_route');
    await cast(ref, 'saved'); const held = cooldowns(); assert.equal(Object.keys(held).length, 1);
    assert.equal((await ack(gm, 'combat_ended', { roomId: room.id })).success, true);
    assert.deepEqual(cooldowns(), held, 'retired combat does not reset the cooldown'); await refused('actor_spell_approve', pcApproval(ref), 'cooldown_clock_retired', owner);
    await startCombat(); await adopt(); for (let i = 0; i < 7; i++) {await advance();}
    assert.deepEqual(cooldowns(), held, 'a new clock never releases a cooldown recorded on the retired one');
    await refused('actor_spell_approve', pcApproval(ref), 'cooldown_clock_retired', owner);
  });
});
