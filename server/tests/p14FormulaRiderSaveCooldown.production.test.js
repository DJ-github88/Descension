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
 * Formula-rider saves: an attribute-scaled (M4A) immediate damage OR healing part next to ONE movement OR Stunned rider that carries ONE
 * rider-local "negates" save the table rolls and the GM records (saved / failed). Composition of two installed routes only:
 *  - formula riders (handoff/formula-riders): scaled reader, owner-attested inputs, caster-snapshot binding, retained-face reapproval;
 *  - shared/timed save branch (handoff/gm-save-branches, handoff/timed-save-integration): the direct part and payment on both outcomes,
 *    the rider (A11 add/refresh/refusal + C4 schedule) only on "failed", both outcomes pass `schedulable` for a structured expiry.
 * Second interaction: the same composition with the authenticated caster-start cooldown (handoff/wizard-cooldowns/APPROVAL.md): it starts in
 * the one successful commit containing AP/mana payment and immediate damage OR healing (either recorded outcome), is checked at approval and
 * confirmation, and is released only by the authenticated boundary (handoff/effect-cooldowns, rider-save-cooldown, formula-rider-cooldown).
 * Primary owner PC → one placed creature; AP/mana only.
 * Roster [pc, source, target] (period 3): the target's turn starts at sequences 2, 5, 8 and ends at 3, 6, 9.
 */
const SAVE = { ability: 'constitution', dc: 12, outcome: 'negates' };
/** Measured on the pre-change live base (handoff INSTALL_BASE.sha256): unrelated save and formula-rider definitions keep these bytes. */
const PINNED = {
  plainSaveMove: { label: 'p14-save-branch-timed-1', definitionHash: 'da65e46669140a8943b6af540836aeafb9afb6e844bbdadf2f550997590a8d48', descriptor: '93abf3ae335eb41b7bd277acf50d62489a647029932442f2605b072225cfc62d' },
  plainSaveStunHeal: { label: 'p14-save-branch-1', definitionHash: 'c69fd4de78f6f9a8a6af7fe6afc463aaa630f8b6c89cb6e67581dc47579110af', descriptor: 'fc449ebc6675adad618b9d716a7edd64a58a19d74a8f12e02c1e4f3095b684d6' },
  plainSaveMoveCooldown: { label: 'p14-save-branch-timed-cooldown-1', definitionHash: '0457b9275ea466ccaa832d57b59f70e59194c03bd20978f4f15199acd35d18ef', descriptor: '03b7957673c27fad3f2324e02161a3220e0c4c959c2ea84768f1f137b963f32f' },
  scaledMove: { label: 'p14-a10-effect-formula-1', definitionHash: 'eb64af141a8b56a8d90c83be6082777a5942022b13124c632266e6dd513fa2e9', descriptor: '82b3524713ff8ef76e1a40ca576b05a832d6e3828cfcd9016826c1f947ceabca' },
  scaledStunHeal: { label: 'p14-a10-effect-formula-1', definitionHash: '21121a9ec1fcbff9d63557fe5d0d887d771b54dc2cfecad83e1ac12890cc021f', descriptor: 'f9db6cc7335b2d5ff42a0877254453107c5a5d78b2a90fc20841bb96c14fc1b1' },
  scaledMoveCooldown: { label: 'p14-a10-effect-formula-cooldown-1', definitionHash: 'a9ab086014e688251334fd6c4fff80d498c6d3594eb010602340651846711d6f', descriptor: '055b60b6aed059b8e4b0d85fd8b86b163b17898b6acab09358401da982d1c4a7' }
};
const PIN_ID = '70000000-0000-4000-8000-0000000000e1';
/** Disposable Wizard record: scaled immediate part + one rider + a rider-local negates save. null leaves a field out. */
function saveRecord({ name = 'Disposable Mind Hobble', kind = 'movement', feet = -10, label = 'Hobbled', policy = 'target-next-end', occurrences, direct = 'damage',
  formula = direct === 'healing' ? '1d4 + spirit/2' : '2d6 + intelligence/3', save = SAVE, ap = 2, mana = 3, cooldownType = cooldown.TYPE, cooldownValue = 1, element = 'arcane',
  durationText = 'Until the frost thaws', gmNote = 'The table rolls the save; the GM records saved or failed.', description = 'Formula-rider save disposable test', extra } = {}) {
  const c = { profile: pure.EFFECT_CAPABILITY, effect: kind, ...(kind === 'movement' ? { movementFeet: feet, label } : {}), expiryPolicy: policy, ...(occurrences !== undefined ? { occurrences } : {}),
    durationText, gmNote, ...(save ? { save } : {}) };
  const d = { name, description, spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' },
    effectTypes: direct ? [direct, 'control'] : ['control'], controlConfig: { authoredCondition: c },
    ...(direct === 'damage' ? { damageConfig: { damageType: 'direct', elementType: element, formula, resolution: 'DICE' } } : {}),
    ...(direct === 'healing' ? { healingConfig: { healingType: 'direct', formula, resolution: 'DICE' } } : {}),
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: ap, mana },
    ...(cooldownType !== null ? { cooldownConfig: { cooldownType, cooldownValue } } : {}) };
  if (extra) {extra(d);}
  return { ...actors.clone(d), authoredDraft: d, authoredDefinitionId: uuid() };
}

describe('Formula-rider save cooldowns — attribute-scaled immediate part + movement/Stunned rider + rider-local negates save + the authenticated caster-start cooldown, registered production handlers', function() {
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
  async function advanceTo(n) { while (seq() < n) {await advance();} }
  async function admitPc(record, definitionVersion = 1) {
    const r = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, record, definitionVersion, classId: 'arcanoneer' });
    assert.equal(r.success, true, JSON.stringify(r)); return r.definitionRef;
  }
  const entryFor = ref => installed.list(live()).entries.find(e => pure.actionId(e.definitionRef) === pure.actionId(ref));
  const res = a => ({ gmConfirmed: true, timing: a.effectTerms.timing, timingNote: 'GM: range and exact target confirmed', evidence: 'PRIVATE GM evidence: table save d20' });
  function spellOf(e) { const d = e.canonicalDefinition; return { definitionId: pure.actionId(e.definitionRef), definitionHash: `${pure.EFFECT_CAPABILITY}/${e.definitionRef.definitionHash}`, name: d.name, kind: 'effect', damageTypes: d.effects.direct?.damageTypes || [] }; }
  const attested = () => ({ ...token(pc).character.stats });
  /** Owner approval with the M4A disclosure (attested scores, shared reader constant/reading, caster binding); the terms carry the save. */
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
  /** The GM's command exactly as the client planner builds it for a recorded branch. */
  function command(a, { branch, amount, reason = '' } = {}) {
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
        chosenResult: JSON.stringify(effect.resultFor(a, res(a), plan.combination, branch)) } };
  }
  async function accept(c) { const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true, JSON.stringify(r)); return r; }
  async function cast(ref, branch, opts = {}) { const a = formulaApproval(ref, opts); await approve(a); const c = command(a, { branch, ...opts }), r = await accept(c); return { a, c, r }; }
  async function refused(event, data, code, socket = gm) { const before = actors.clone(live().gameState), r = await ack(socket, event, data); assert.equal(r.success, false, JSON.stringify(r)); if (code) {assert.equal(r.code, code, JSON.stringify(r));} assert.deepEqual(live().gameState, before, `${event} changed nothing`); return r; }
  const withdraw = a => ack(owner, 'actor_spell_withdraw', { roomId: room.id, approvalId: a.approvalId, approval: a });
  const moves = ref => token(ref).state.conditions.filter(profile.isMovementModifier);
  const stuns = ref => token(ref).state.conditions.filter(profile.isStunned);
  const hp = ref => { const v = actors.resources(token(ref), ref.kind).hp; return { current: v.current, temp: v.temp }; };
  const pools = () => actors.clone(actors.resources(token(pc), 'character'));
  const spent = (before, after, k) => before[k].current + before[k].temp - after[k].current - after[k].temp;
  const receiptsFor = commandId => actors.ledger(live()).receipts.filter(x => x.commandId === commandId);
  const chosen = r => JSON.parse(r.receipt.adjudication.chosenResult);
  const correction = list => ({ ...base(), actors: list, adjudication: { definitionId: 'gm-correction', definitionVersionOrHash: 'gm-correction', finalAmount: 0, adjustmentReason: '', chosenResult: 'GM correction' } });
  const schedules = () => actors.clone(live().gameState.combat?.effectLifecycle?.schedules || {});
  const scheduleOf = recordId => Object.values(schedules()).find(i => i.recordId === recordId);
  /** Everything a cast could change: caster pools, target HP/conditions, schedules, cooldowns, pending approvals and the receipt count. */
  const world = () => ({ pools: pools(), hp: hp(target), conditions: actors.clone(token(target).state.conditions), otherHp: hp(other), otherConditions: actors.clone(token(other).state.conditions),
    schedules: schedules(), cooldowns: actors.clone(token(pc).state.authoredCooldowns || {}), receipts: actors.ledger(live()).receipts.length });
  const opts = () => ({ roomId: room.id, definitionVersion: 1, classId: 'arcanoneer' });
  const pinnedOpts = { roomId: 'pinned-room', definitionVersion: 1, classId: 'arcanoneer' };
  const descriptorSha = c => require('crypto').createHash('sha256').update(JSON.stringify(c.descriptor)).digest('hex');
  const cooldowns = () => actors.clone(token(pc).state.authoredCooldowns || {});
  const keyOf = ref => cooldown.key(pc, ref.definitionId);
  const pinRecord = o => ({ ...saveRecord({ name: 'Pinned formula save', description: 'pin', durationText: 'Until the frost thaws', gmNote: 'The table rolls the save; the GM records saved or failed.', label: 'Rime Hobble', ...o }), authoredDefinitionId: PIN_ID });

  it('compiler and registry: movement/Stunned × scaled damage/healing × every expiry policy × 1–10 take the cooldown with the save under p14-save-branch-(timed-)formula-cooldown-1; unrelated definitions keep their pinned bytes; invalid cooldowns, other families, class payment and creature sources stay refused', () => {
    let i = 0;
    for (const kind of ['movement', 'stunned']) {
      for (const direct of ['damage', 'healing']) {
        for (const [policy, occurrences] of [['gm-manual'], ['target-next-start'], ['target-next-end'], ['target-start-count', 2], ['target-end-count', 10]]) {
          const value = 1 + (i++ % 10), name = JSON.stringify({ kind, direct, policy, value }), m = pure.definitionFromWizard(saveRecord({ kind, direct, policy, occurrences, cooldownValue: value }), opts());
          assert.equal(m.ok, true, `${name}: ${m.reason}`);
          assert.deepEqual(m.definition.cooldown, { cooldownType: cooldown.TYPE, cooldownValue: value }, name); assert.deepEqual(m.definition.effects.save, { scope: 'condition', ...SAVE }, name);
          const c = definitions.compileDefinition(m.definition); assert.equal(c.ok, true, name);
          assert.equal(c.descriptor.compilerVersion, policy === 'gm-manual' ? 'p14-save-branch-formula-cooldown-1' : 'p14-save-branch-timed-formula-cooldown-1', name);
          assert.deepEqual(c.descriptor.cooldown, m.definition.cooldown, name);
          assert.equal(pure.creatureSourceRefusal(m.definition).code, 'unsupported_source_route', name);
          const noCooldown = actors.clone(m.definition); delete noCooldown.cooldown;
          assert.equal(definitions.compileDefinition(noCooldown).descriptor.compilerVersion, policy === 'gm-manual' ? 'p14-save-branch-formula-1' : 'p14-save-branch-timed-formula-1', name);
          const noSave = actors.clone(m.definition); delete noSave.effects.save;
          assert.equal(definitions.compileDefinition(noSave).descriptor.compilerVersion, 'p14-a10-effect-formula-cooldown-1', name);
        }
      }
    }
    for (const [name, o] of Object.entries({ plainSaveMove: { formula: '1d6+2', cooldownType: null }, plainSaveStunHeal: { kind: 'stunned', policy: 'gm-manual', direct: 'healing', formula: '2d4', cooldownType: null },
      plainSaveMoveCooldown: { formula: '1d6+2', cooldownValue: 2 }, scaledMove: { save: null, cooldownType: null }, scaledStunHeal: { kind: 'stunned', policy: 'gm-manual', direct: 'healing', save: null, cooldownType: null },
      scaledMoveCooldown: { save: null, cooldownValue: 2 } })) {
      const c = definitions.compileDefinition(pure.definitionFromWizard(pinRecord(o), pinnedOpts).definition);
      assert.deepEqual({ label: c.descriptor.compilerVersion, definitionHash: c.definitionHash, descriptor: descriptorSha(c) }, PINNED[name], name);
    }
    const asAttribute = d => { const k = d.controlConfig.authoredCondition; delete k.movementFeet; Object.assign(k, { effect: 'attribute', attribute: 'agility', attributeAmount: -2, label: 'Leaden' }); };
    const manual = {
      zero: [saveRecord({ cooldownValue: 0 }), /cooldownConfig/], eleven: [saveRecord({ cooldownValue: 11 }), /cooldownConfig/], legacy: [saveRecord({ cooldownType: 'turn_based' }), /legacy/],
      halves: [saveRecord({ save: { ...SAVE, outcome: 'halves' } }), /only "negates this effect"/],
      attributeRider: [saveRecord({ extra: asAttribute }), /Cooldowns currently require one creature target/],
      missingHealth: [saveRecord({ formula: '2d6 + caster_missing_health/4' }), /effect\.formula/],
      area: [saveRecord({ extra: d => { d.targetingConfig.targetingType = 'area'; } }), /Cooldowns currently require one creature target/]
    };
    for (const [name, [rec, reason]] of Object.entries(manual)) {
      const r = pure.definitionFromWizard(rec, opts()); assert.equal(r.ok, false, `${name}: ${JSON.stringify(r)}`); assert.match(r.reason, reason, name);
    }
    const ok = pure.definitionFromWizard(saveRecord(), opts()).definition;
    const forged = mutate => { const d = actors.clone(ok); mutate(d); return definitions.compileDefinition(d); };
    for (const bad of [{ cooldownType: cooldown.TYPE, cooldownValue: 0 }, { cooldownType: cooldown.TYPE, cooldownValue: 11 }, { cooldownType: 'turn_based', cooldownValue: 1 }, { cooldownType: cooldown.TYPE, cooldownValue: 2, extra: true }]) {
      assert.equal(forged(d => { d.cooldown = bad; }).ok, false, JSON.stringify(bad));
    }
    assert.equal(forged(d => { d.effects.condition = { kind: 'attribute', attribute: 'agility', amount: -2, label: 'Leaden' }; }).ok, false, 'attribute rider');
    assert.equal(forged(d => { d.effects.condition = { kind: 'periodic', tick: { kind: 'damage', formula: '1d4', damageTypes: ['arcane'] }, label: 'Brand', tickRoll: 'each-tick' }; d.timing = { ...d.timing, expiryPolicy: 'target-start-count', occurrences: 2 }; }).ok, false, 'periodic');
    assert.equal(forged(d => { d.effects.direct = null; }).ok, false, 'rider-only');
    assert.equal(definitions.compileDefinition({ ...actors.clone(ok), classPayment: { domain: 'elementalSpheres', price: { costs: ['arcane'], gains: [] } }, catalogueSource: { spellId: 'x', classId: 'arcanoneer', recordHash: 'a'.repeat(64) } }).code, 'UNSUPPORTED_SHAPE', 'class payment');
  });

  for (const [title, kind, direct] of [['movement + scaled damage', 'movement', 'damage'], ['Stunned + scaled healing', 'stunned', 'healing']]) {
    it(`${title}, both outcomes: one receipt pays once and applies the scaled part; the rider only on failed; the cooldown starts once with the cast commandId on either outcome; blocked reuse spends nothing; release at its own boundary`, async() => {
      await startCombat(); await adopt();
      const savedRef = await admitPc(saveRecord({ name: `Disposable Saved ${kind}`, kind, direct, cooldownValue: 2 }));
      const failedRef = await admitPc(saveRecord({ name: `Disposable Failed ${kind}`, kind, direct, label: 'Sleet Drag', cooldownValue: 2 }));
      if (direct === 'healing') {token(target).state.currentHp = 40;}
      const faces = direct === 'healing' ? [[3]] : [[2, 3]], total = direct === 'healing' ? 3 + 4 : 5 + 4;
      const rider = r => (kind === 'movement' ? moves : stuns)(r);
      for (const [ref, branch] of [[savedRef, 'saved'], [failedRef, 'failed']]) {
        const before = pools(), hp0 = hp(target), riders0 = rider(target).length, sched0 = Object.keys(schedules()).length;
        const { a, c, r } = await cast(ref, branch, { faces });
        assert.equal(a.roll.total, total); assert.ok(a.rollAttributes, 'owner-attested scores');
        assert.equal(receiptsFor(c.commandId).length, 1, `${branch}: one command, one receipt`);
        assert.equal(spent(before, pools(), 'ap'), 2, branch); assert.equal(spent(before, pools(), 'mana'), 3, branch);
        assert.deepEqual(hp(target), direct === 'damage' ? { current: hp0.current - (total - hp0.temp), temp: 0 } : { current: hp0.current + total, temp: hp0.temp }, `${branch}: scaled part on both outcomes`);
        assert.equal(chosen(r).branch, branch); assert.equal(chosen(r).conditionApplied, branch === 'failed');
        assert.equal(rider(target).length, riders0 + (branch === 'failed' ? 1 : 0), branch);
        assert.equal(Object.keys(schedules()).length, sched0 + (branch === 'failed' ? 1 : 0), `${branch}: a schedule only for the installed rider`);
        const item = cooldowns()[keyOf(ref)]; assert.deepEqual([item.startSequence, item.dueSequence, item.occurrences, item.period, item.commandId], [0, 6, 2, 3, c.commandId], `${branch}: N=2 → PC starts 3, 6`);
        const st = world(); await refused('actor_spell_approve', formulaApproval(ref, { faces }), 'ability_on_cooldown', owner); assert.deepEqual(world(), st, `${branch}: blocked reuse`);
      }
      assert.equal(Object.keys(cooldowns()).length, 2, 'two definitions, two cooldowns');
      await advanceTo(5); assert.equal(Object.keys(cooldowns()).length, 2); await advance(); assert.deepEqual(cooldowns(), {}, 'both release at 6');
      const again = await cast(savedRef, 'failed', { faces }); assert.equal(cooldowns()[keyOf(savedRef)].dueSequence, 12); assert.equal(cooldowns()[keyOf(savedRef)].commandId, again.c.commandId);
      const view = await ack(observer, 'actor_snapshot', { roomId: room.id }); assert.ok(!JSON.stringify(view).includes('PRIVATE'));
    });
  }

  for (const branch of ['saved', 'failed']) {
    it(`changed caster score before GM confirmation (${branch}): refused with no cooldown; reapproval with retained faces revalues and starts exactly one cooldown; a later score change while it holds never resets it`, async() => {
      await startCombat(); await adopt();
      const ref = await admitPc(saveRecord({ policy: 'target-end-count', occurrences: 2, cooldownValue: 1 })), a = formulaApproval(ref, { faces: [[3, 6]] }); await approve(a);
      token(pc).character.stats.intelligence = 17;
      const st = world(), x = await ack(gm, 'actor_consequence', command(a, { branch }));
      assert.equal(x.code, 'owner_reapproval_required', JSON.stringify(x)); assert.deepEqual(world(), st, 'no HP, payment, rider, schedule or cooldown');
      assert.equal((await withdraw(a)).code, 'approval_owner_reapproval_required');
      const b = formulaApproval(ref, { faces: a.roll.dice.map(g => g.faces) }); await approve(b);
      assert.deepEqual(b.roll.dice, a.roll.dice); assert.equal(b.roll.total, 14); assert.deepEqual(cooldowns(), {}, 'reapproval starts nothing');
      const c = command(b, { branch }), r = await accept(c);
      assert.equal(chosen(r).roll.total, 14); assert.deepEqual(Object.keys(cooldowns()), [keyOf(ref)]); assert.equal(cooldowns()[keyOf(ref)].commandId, c.commandId);
      const held = cooldowns(); token(pc).character.stats.intelligence = 11;
      await refused('actor_spell_approve', formulaApproval(ref), 'ability_on_cooldown', owner); assert.deepEqual(cooldowns(), held, 'not reset');
      await advanceTo(3); assert.deepEqual(cooldowns(), {}, 'released at the PC\'s next start (3)');
      assert.equal(moves(target).length, branch === 'failed' ? 1 : 0, 'the counted rider (failed only) keeps its own lifetime past the release');
    });
  }

  it('a saved cast while an earlier rider is active leaves it and its schedule byte-equal and starts the cooldown; rider expiry and cooldown release stay independent in both orders', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(saveRecord({ policy: 'target-end-count', occurrences: 3, cooldownValue: 1 }));
    const first = await cast(ref, 'failed', { faces: [[1, 1]] }); assert.equal(scheduleOf(first.a.approvalId).dueSequence, 9);
    await advanceTo(3); assert.deepEqual(cooldowns(), {}, 'order A: released at 3; the rider (due 9) stays'); assert.equal(moves(target).length, 1);
    const held = { conditions: actors.clone(token(target).state.conditions), schedules: schedules() };
    assert.equal(effect.conditionPlan(formulaApproval(ref), token(target).state.conditions).combination.outcome, 'refreshed', '"failed" would refresh it');
    const { c } = await cast(ref, 'saved', { faces: [[2, 2]] });
    assert.deepEqual({ conditions: token(target).state.conditions, schedules: schedules() }, held, 'saved: earlier rider and schedule byte-equal');
    assert.equal(cooldowns()[keyOf(ref)].commandId, c.commandId); assert.equal(cooldowns()[keyOf(ref)].dueSequence, 6);
    // GM removal of the rider leaves the cooldown untouched; order B on a second definition: rider due 5 expires, cooldown holds to 6.
    const kept = cooldowns(); await accept(correction([{ ref: target, expectedRevision: token(target).state.actorContract.revision, conditions: [{ op: 'remove', recordId: first.a.approvalId }] }]));
    assert.deepEqual(cooldowns(), kept, 'GM removal never releases'); assert.deepEqual(schedules(), {});
    const nipRef = await admitPc(saveRecord({ name: 'Disposable Frost Nip', label: 'Frost Nip', policy: 'target-next-start', cooldownValue: 1 }));
    const nip = await cast(nipRef, 'failed', { faces: [[1, 2]] }); assert.equal(scheduleOf(nip.a.approvalId).dueSequence, 5); assert.equal(cooldowns()[keyOf(nipRef)].dueSequence, 6);
    await advanceTo(5); assert.equal(moves(target).length, 0, 'order B: rider expired at 5'); assert.ok(cooldowns()[keyOf(nipRef)], 'cooldown holds');
    await advance(); assert.deepEqual(cooldowns(), {}, 'both release at 6');
  });

  it('rejected confirmations start nothing: missing schedule on both outcomes, writer failure on both outcomes, an injected committed cooldown; racing saved/failed confirmations give one cooldown; lost ACK + checkpoint rebuild + exact replay return the original receipt once', async() => {
    const ref = await admitPc(saveRecord({ cooldownValue: 1 }));
    await startCombat([pc, source]); await adopt(); // the cooldown route is open, the target's rider schedule is not
    let a = formulaApproval(ref, { faces: [[4, 4]] }); await approve(a);
    for (const branch of ['saved', 'failed']) {await refused('actor_consequence', command(a, { branch }), 'effect_schedule_unavailable');}
    await withdraw(a); await ack(gm, 'combat_ended', { roomId: room.id }); await startCombat(); await adopt();
    a = formulaApproval(ref, { faces: [[6, 5]] }); await approve(a);
    const admit = writer.admitConsequence; live().isPermanent = true; writer.admitConsequence = () => ({ queued: false, code: 'frsc_writer_refusal' });
    for (const branch of ['saved', 'failed']) {
      const st = world(), w = await ack(gm, 'actor_consequence', command(a, { branch }));
      assert.equal(w.code, 'frsc_writer_refusal', branch); assert.deepEqual(world(), st, `${branch}: no payment, HP, rider or cooldown`);
    }
    writer.admitConsequence = admit; live().isPermanent = false;
    // Defence in depth: a cooldown committed after approval refuses either branch before the consequence stage.
    const injected = { [keyOf(ref)]: { combatId: live().gameState.combat.effectLifecycle.id, startSequence: 6, dueSequence: 12, occurrences: 2, period: 3, commandId: uuid() } };
    const hadState = Object.hasOwn(token(pc).state, 'authoredCooldowns'), savedState = hadState ? actors.clone(token(pc).state.authoredCooldowns) : undefined;
    token(pc).state.authoredCooldowns = actors.clone(injected);
    const service = require('../services/authoredCooldowns'), start = service.start; let staged = 0; service.start = (...args) => { staged++; return start(...args); };
    try {
      for (const branch of ['saved', 'failed']) {
        const st = world(), x = await ack(gm, 'actor_consequence', command(a, { branch }));
        assert.equal(x.success, false, `${branch}: ${JSON.stringify(x)}`); assert.equal(x.code, 'ability_on_cooldown'); assert.deepEqual(world(), st, branch); assert.deepEqual(cooldowns(), injected, 'the committed cooldown is not reset');
      }
      assert.equal(staged, 0, 'authoredCooldowns.start never reached');
    } finally { service.start = start; }
    if (hadState) {token(pc).state.authoredCooldowns = savedState;} else {delete token(pc).state.authoredCooldowns;}
    const saved = command(a, { branch: 'saved' }), failed = command(a, { branch: 'failed' });
    const results = await Promise.all([ack(gm, 'actor_consequence', saved), ack(gm, 'actor_consequence', failed)]);
    assert.equal(results.filter(r => r.success).length, 1, JSON.stringify(results)); assert.equal(results.find(r => !r.success).code, 'approval_consumed');
    const won = results[0].success ? saved : failed, receipt = results.find(r => r.success).receipt;
    assert.deepEqual(Object.keys(cooldowns()), [keyOf(ref)]); assert.equal(cooldowns()[keyOf(ref)].commandId, won.commandId);
    const codec = require('../services/roomCheckpoint'), built = codec.buildCheckpointDocuments({ roomId: room.id, gameState: live().gameState, revision: 1 });
    const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])) }); assert.equal(decoded.ok, true);
    const snapshot = world();
    server.rooms.set(room.id, { ...live(), gameState: { ...decoded.global, maps: decoded.maps, ...codec.deriveRootMirrors(decoded.maps) }, checkpointRevision: 1 });
    assert.deepEqual(world(), snapshot, 'checkpoint rebuild keeps HP, rider, schedule and cooldown');
    gm.emit('actor_consequence', won); await sleep(100); // ACK lost
    assert.deepEqual((await ack(gm, 'actor_consequence', won)).receipt, receipt); assert.deepEqual(world(), snapshot); assert.equal(receiptsFor(won.commandId).length, 1);
    const view = await ack(owner, 'actor_snapshot', { roomId: room.id }); assert.deepEqual(view.maps.default.characterTokens.pc.state.authoredCooldowns, token(pc).state.authoredCooldowns, 'owner snapshot carries the cooldown');
  });

  it('route gates: a primary PC target, a creature source and a retired clock are refused or held with nothing spent and the cooldown never reset', async() => {
    live().gameState.maps.default.characterTokens.pc2 = { id: 'pc2', ownerUserId: ownerUid, character: { id: 'c2', class: 'Arcanoneer', health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, tempMana: 0, tempActionPoints: 0 }, state: { conditions: [] } };
    server.setCharacterOwner('c2', ownerUid);
    const bound = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc2', ownerUid, characterId: 'c2' }, snapshotHash: actors.hash(live().gameState.maps.default.characterTokens.pc2) });
    assert.equal(bound.success, true, JSON.stringify(bound)); const pc2 = bound.ref;
    const ref = await admitPc(saveRecord({ cooldownValue: 1 }));
    await refused('actor_spell_approve', formulaApproval(ref), null, owner); // no clock: the cooldown route is closed
    await startCombat(); await adopt();
    await refused('actor_spell_approve', formulaApproval(ref, { t: pc2 }), null, owner);
    token(source).authoredAbility.record = saveRecord({ name: 'Disposable Creature Mind Hobble' });
    await refused('actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, source, expectedSourceRevision: token(source).state.actorContract.revision, definitionVersion: 1 }, 'unsupported_source_route');
    await cast(ref, 'saved', { faces: [[1, 1]] }); const held = cooldowns();
    const end = await ack(gm, 'combat_ended', { roomId: room.id }); assert.equal(end.success, true, JSON.stringify(end));
    assert.deepEqual(cooldowns(), held, 'combat end keeps the item');
    await refused('actor_spell_approve', formulaApproval(ref), null, owner);
    await startCombat(); await adopt(); for (let k = 0; k < 7; k++) {await advance();}
    assert.deepEqual(cooldowns(), held, 'a new clock never releases or resets a retired-clock cooldown');
  });
});
