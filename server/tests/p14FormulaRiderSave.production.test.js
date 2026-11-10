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
 * Primary owner PC → one placed creature; AP/mana only. No caster-start cooldown on this route (separate interaction).
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
  formula = direct === 'healing' ? '1d4 + spirit/2' : '2d6 + intelligence/3', save = SAVE, ap = 2, mana = 3, cooldownType = null, cooldownValue = 1, element = 'arcane',
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

describe('Formula-rider saves — attribute-scaled immediate part + one movement/Stunned rider with a rider-local negates save, registered production handlers', function() {
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
      const t = { id, name: id, creatureId: 'disposable', stats: { maxHp: 60, maxMana: 20, maxAP: 10, speed: 30 }, authoredAbility: { schemaVersion: 1, record: saveRecord(), librarySpellId: null },
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
  async function approve(a) { const before = actors.clone(live().gameState), r = await ack(owner, 'actor_spell_approve', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); assert.deepEqual(live().gameState, before, 'approval spends nothing'); return r; }
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
  const pinRecord = o => ({ ...saveRecord({ name: 'Pinned formula save', description: 'pin', durationText: 'Until the frost thaws', gmNote: 'The table rolls the save; the GM records saved or failed.', label: 'Rime Hobble', ...o }), authoredDefinitionId: PIN_ID });

  it('compiler and registry: movement/Stunned × scaled damage/healing × every expiry policy take the save under p14-save-branch-(timed-)formula-1; unrelated definitions keep their pinned bytes; other save shapes, families, class payment and creature sources stay refused (cooldown: fence update, own suite)', () => {
    for (const kind of ['movement', 'stunned']) {
      for (const direct of ['damage', 'healing']) {
        for (const [policy, occurrences] of [['gm-manual'], ['target-next-start'], ['target-next-end'], ['target-start-count', 2], ['target-end-count', 10]]) {
          const name = JSON.stringify({ kind, direct, policy }), m = pure.definitionFromWizard(saveRecord({ kind, direct, policy, occurrences }), opts());
          assert.equal(m.ok, true, `${name}: ${m.reason}`);
          assert.deepEqual(m.definition.effects.save, { scope: 'condition', ...SAVE }, name); assert.ok(pure.formulaAttributes(m.definition.effects.direct.formula).length, name);
          assert.equal(m.definition.cooldown, undefined, name);
          const c = definitions.compileDefinition(m.definition); assert.equal(c.ok, true, name);
          assert.equal(c.descriptor.compilerVersion, policy === 'gm-manual' ? 'p14-save-branch-formula-1' : 'p14-save-branch-timed-formula-1', name);
          assert.equal(c.descriptor.capabilityId, pure.EFFECT_CAPABILITY, name); assert.equal(c.canonicalDefinition.schemaVersion, 3, name);
          assert.equal(pure.creatureSourceRefusal(m.definition).code, 'unsupported_source_route', name);
          // Dropping the save gives back the released formula-rider route.
          const bare = actors.clone(m.definition); delete bare.effects.save;
          assert.equal(definitions.compileDefinition(bare).descriptor.compilerVersion, 'p14-a10-effect-formula-1', name);
        }
      }
    }
    for (const [name, o] of Object.entries({ plainSaveMove: { formula: '1d6+2' }, plainSaveStunHeal: { kind: 'stunned', policy: 'gm-manual', direct: 'healing', formula: '2d4' },
      plainSaveMoveCooldown: { formula: '1d6+2', cooldownType: cooldown.TYPE, cooldownValue: 2 }, scaledMove: { save: null }, scaledStunHeal: { kind: 'stunned', policy: 'gm-manual', direct: 'healing', save: null },
      scaledMoveCooldown: { save: null, cooldownType: cooldown.TYPE, cooldownValue: 2 } })) {
      const c = definitions.compileDefinition(pure.definitionFromWizard(pinRecord(o), pinnedOpts).definition);
      assert.deepEqual({ label: c.descriptor.compilerVersion, definitionHash: c.definitionHash, descriptor: descriptorSha(c) }, PINNED[name], name);
    }
    // Wizard compiler refusals (the whole record stays manual), each for its own reason.
    const asAttribute = d => { const k = d.controlConfig.authoredCondition; delete k.movementFeet; Object.assign(k, { effect: 'attribute', attribute: 'agility', attributeAmount: -2, label: 'Leaden' }); };
    // Fence update (formula-rider save cooldowns): the cooldown now takes its own label; p14FormulaRiderSaveCooldown covers the route.
    const withCooldown = pure.definitionFromWizard(saveRecord({ cooldownType: cooldown.TYPE }), opts());
    assert.equal(withCooldown.ok, true, withCooldown.reason); assert.equal(definitions.compileDefinition(withCooldown.definition).descriptor.compilerVersion, 'p14-save-branch-timed-formula-cooldown-1');
    const manual = {
      halves: [saveRecord({ save: { ...SAVE, outcome: 'halves' } }), /only "negates this effect"/],
      riderOnly: [saveRecord({ direct: null, kind: 'stunned' }), /rider-only save stays manual/],
      attributeRider: [saveRecord({ extra: asAttribute }), /effect\.formula/],
      flatDr: [saveRecord({ direct: 'healing', extra: d => { const k = d.controlConfig.authoredCondition; delete k.movementFeet; Object.assign(k, { effect: 'damageReduction', drAmount: 2, label: 'Warded' }); } }), /flat damage-reduction/],
      periodicRider: [saveRecord({ extra: d => { d.controlConfig.authoredCondition = { profile: pure.EFFECT_CAPABILITY, effect: 'periodic', periodicKind: 'damage', periodicFormula: '1d4', periodicDamageType: 'arcane', tickRoll: 'each-tick', label: 'Brand', expiryPolicy: 'target-start-count', occurrences: 2, durationText: 'x', gmNote: 'y', save: SAVE }; } }), /periodic effect stays manual/],
      missingHealth: [saveRecord({ formula: '2d6 + caster_missing_health/4' }), /effect\.formula/],
      deterministic: [saveRecord({ formula: 'intelligence/3' }), /effect\.formula/],
      directPartSave: [saveRecord({ extra: d => { d.damageConfig.savingThrow = { ability: 'constitution', difficultyClass: 12, saveOutcome: 'negates' }; } }), /save on the direct damage\/healing part|savingThrow/],
      selfTarget: [saveRecord({ extra: d => { d.targetingConfig.targetRestrictions = ['self']; d.targetingConfig.rangeDistance = 0; } }), /distinct creature targeting required/]
    };
    for (const [name, [rec, reason]] of Object.entries(manual)) {
      if (name === 'selfTarget') {rec.targetingConfig = actors.clone(rec.authoredDraft.targetingConfig);}
      const r = pure.definitionFromWizard(rec, opts()); assert.equal(r.ok, false, `${name}: ${JSON.stringify(r)}`); assert.match(r.reason, reason, name);
    }
    // Registry refusals on hand-built definitions (the server fence holds without the client compiler).
    const ok = pure.definitionFromWizard(saveRecord(), opts()).definition;
    const forged = mutate => { const d = actors.clone(ok); mutate(d); return definitions.compileDefinition(d); };
    assert.equal(forged(d => { d.cooldown = { cooldownType: cooldown.TYPE, cooldownValue: 1 }; }).descriptor.compilerVersion, 'p14-save-branch-timed-formula-cooldown-1', 'scaled + save + cooldown (fence update)');
    assert.equal(forged(d => { d.effects.condition = { kind: 'attribute', attribute: 'agility', amount: -2, label: 'Leaden' }; }).ok, false, 'attribute rider + scaled + save');
    assert.equal(forged(d => { d.effects.condition = { kind: 'damageReduction', amount: 2, label: 'Warded' }; }).ok, false, 'flat DR + scaled + save');
    assert.equal(forged(d => { d.effects.condition = { kind: 'periodic', tick: { kind: 'damage', formula: '1d4', damageTypes: ['arcane'] }, label: 'Brand', tickRoll: 'each-tick' }; d.timing = { ...d.timing, expiryPolicy: 'target-start-count', occurrences: 2 }; }).ok, false, 'periodic + scaled + save');
    for (const formula of ['2d6 + caster_missing_health/4', 'intelligence/3', '2d6 + 3']) {assert.equal(forged(d => { d.effects.direct.formula = formula; }).ok, false, formula);}
    assert.equal(forged(d => { d.effects.save = { ...d.effects.save, outcome: 'halves' }; }).ok, false, 'halves');
    assert.equal(forged(d => { d.effects.save = { ...d.effects.save, scope: 'direct' }; }).ok, false, 'direct-part scope');
    assert.equal(forged(d => { d.targeting.restriction = 'self'; }).ok, false, 'self');
    assert.equal(definitions.compileDefinition({ ...actors.clone(ok), classPayment: { domain: 'elementalSpheres', price: { costs: ['arcane'], gains: [] } }, catalogueSource: { spellId: 'x', classId: 'arcanoneer', recordHash: 'a'.repeat(64) } }).code, 'UNSUPPORTED_SHAPE', 'class payment');
  });

  it('failed: movement + 2d6 + intelligence/3 at INT 14 (+4): one receipt pays once, applies HP temp-first, installs the rider with its schedule; expiry keeps HP and payment', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(saveRecord()), before = pools(), startHp = hp(target);
    const a = formulaApproval(ref, { faces: [[5, 2]] });
    assert.deepEqual(a.rollAttributes, { intelligence: 14 }); assert.equal(a.roll.constant, 4); assert.equal(a.roll.total, 11);
    assert.deepEqual(a.effectTerms.save, { scope: 'condition', ...SAVE }); assert.deepEqual(effect.branchesFor(a.effectTerms), ['saved', 'failed']);
    await approve(a);
    const c = command(a, { branch: 'failed' }), r = await accept(c);
    assert.equal(receiptsFor(c.commandId).length, 1, 'one command, one receipt');
    assert.equal(spent(before, pools(), 'ap'), 2); assert.equal(spent(before, pools(), 'mana'), 3);
    assert.deepEqual(hp(target), { current: startHp.current - (11 - startHp.temp), temp: 0 });
    assert.equal(moves(target).length, 1); assert.equal(chosen(r).branch, 'failed'); assert.equal(chosen(r).conditionApplied, true); assert.equal(chosen(r).combination.outcome, 'added');
    assert.deepEqual(chosen(r).roll.dice, [{ sides: 6, faces: [5, 2] }]); assert.deepEqual(chosen(r).save, { scope: 'condition', ...SAVE });
    assert.equal(scheduleOf(moves(target)[0].recordId).dueSequence, 3, 'authenticated schedule: end of the target\'s next turn');
    assert.deepEqual(token(pc).state.authoredCooldowns || {}, {}, 'no cooldown on this route');
    const kept = { hp: hp(target), pools: pools() };
    await advanceTo(3); assert.equal(moves(target).length, 0); assert.deepEqual({ hp: hp(target), pools: pools() }, kept);
    const view = await ack(observer, 'actor_snapshot', { roomId: room.id }); assert.ok(!JSON.stringify(view).includes('PRIVATE'));
  });

  it('saved: Stunned + 1d4 + spirit/2 healing (manual expiry) and movement damage pay and apply the scaled part with no rider; earlier riders and schedules stay byte-equal, including one the failed branch would refresh', async() => {
    await startCombat(); await adopt();
    const heal = await admitPc(saveRecord({ name: 'Disposable Calming Hold', kind: 'stunned', direct: 'healing', policy: 'gm-manual' }));
    token(target).state.currentHp = 40; let before = pools();
    const s = await cast(heal, 'saved', { faces: [[4]] });
    assert.deepEqual(s.a.rollAttributes, { spirit: 9 }); assert.equal(s.a.roll.total, 8);
    assert.deepEqual(hp(target), { current: 48, temp: 3 }); assert.equal(stuns(target).length, 0, 'no Stunned on saved');
    assert.equal(spent(before, pools(), 'ap'), 2); assert.equal(spent(before, pools(), 'mana'), 3);
    assert.equal(chosen(s.r).branch, 'saved'); assert.equal(chosen(s.r).conditionApplied, false); assert.equal(s.c.actors[1].conditions, undefined, 'saved target entry carries no conditions key');
    // An earlier rider from an unrelated definition plus one from this definition (failed), each with its schedule.
    const chill = await admitPc(saveRecord({ name: 'Disposable Chill', label: 'Chilled', policy: 'target-end-count', occurrences: 3, formula: '1d6 + intelligence/4' }));
    await cast(chill, 'failed', { faces: [[2]] });
    const ref = await admitPc(saveRecord());
    await cast(ref, 'failed', { faces: [[1, 1]] }); assert.equal(moves(target).length, 2);
    const kept = { conditions: actors.clone(token(target).state.conditions), schedules: schedules() };
    // Where "failed" would refresh the active rider of this definition (A11), "saved" leaves it and its schedule exactly as they were.
    const again = formulaApproval(ref, { faces: [[6, 6]] }); assert.equal(effect.conditionPlan(again, token(target).state.conditions).combination.outcome, 'refreshed');
    await approve(again); before = pools(); const hpBefore = hp(target);
    const r = await accept(command(again, { branch: 'saved' }));
    assert.deepEqual({ conditions: token(target).state.conditions, schedules: schedules() }, kept, 'earlier riders and schedules byte-equal');
    assert.equal(hp(target).current, hpBefore.current - (16 - hpBefore.temp)); assert.equal(spent(before, pools(), 'mana'), 3); assert.equal(chosen(r).conditionApplied, false);
    await advanceTo(3); assert.equal(moves(target).length, 1, 'the earlier rider of this definition still expires at its own boundary (3)');
  });

  for (const branch of ['saved', 'failed']) {
    it(`changed caster score before GM confirmation (${branch}): refused with nothing applied; reapproval keeps the retained faces, revalues, and commits once`, async() => {
      await startCombat(); await adopt();
      const ref = await admitPc(saveRecord({ policy: 'target-end-count', occurrences: 2 })), a = formulaApproval(ref, { faces: [[3, 6]] }); await approve(a);
      assert.equal(a.roll.total, 13);
      token(pc).character.stats.intelligence = 17;
      const st = world(), x = await ack(gm, 'actor_consequence', command(a, { branch }));
      assert.equal(x.success, false); assert.equal(x.code, 'owner_reapproval_required', JSON.stringify(x)); assert.deepEqual(world(), st, 'no HP, payment, rider, schedule or cooldown');
      assert.equal((await withdraw(a)).code, 'approval_owner_reapproval_required', 'the stale consent is closed by the server');
      await refused('actor_consequence', command(a, { branch }), null);
      const b = formulaApproval(ref, { faces: a.roll.dice.map(g => g.faces) }); await approve(b);
      assert.deepEqual(b.roll.dice, a.roll.dice, 'retained faces'); assert.equal(b.roll.constant, 5); assert.equal(b.roll.total, 14);
      assert.deepEqual(b.effectTerms, a.effectTerms, 'same save terms and outcomes');
      const startHp = hp(target), before = pools(), c = command(b, { branch }), r = await accept(c);
      assert.equal(receiptsFor(c.commandId).length, 1); assert.equal(hp(target).current, startHp.current - (14 - startHp.temp));
      assert.equal(spent(before, pools(), 'ap'), 2); assert.equal(chosen(r).roll.total, 14); assert.deepEqual(chosen(r).roll.dice, a.roll.dice);
      assert.equal(moves(target).length, branch === 'failed' ? 1 : 0); assert.equal(Object.keys(schedules()).length, branch === 'failed' ? 1 : 0);
    });
  }

  it('both outcomes keep the timed-save scheduling precondition: without a clock or with the target off the roster, saved and failed refuse (nothing spent, approval pending); the same approval commits once the clock is live', async() => {
    const ref = await admitPc(saveRecord());
    const a = formulaApproval(ref, { faces: [[4, 4]] }); await approve(a);
    for (const branch of ['saved', 'failed']) {
      const st = world(), x = await ack(gm, 'actor_consequence', command(a, { branch }));
      assert.equal(x.success, false); assert.equal(x.code, 'effect_schedule_unavailable', `${branch}: ${JSON.stringify(x)}`); assert.deepEqual(world(), st, branch);
    }
    assert.ok(payments.get(live(), a.approvalId), 'approval stays pending');
    await startCombat(); await adopt();
    const before = pools(), r = await accept(command(a, { branch: 'saved' }));
    assert.equal(chosen(r).branch, 'saved'); assert.equal(moves(target).length, 0); assert.equal(spent(before, pools(), 'mana'), 3);
    const off = formulaApproval(ref, { t: other, faces: [[6, 6]] }); await approve(off);
    for (const branch of ['saved', 'failed']) {
      const st = world(), x = await ack(gm, 'actor_consequence', command(off, { branch }));
      assert.equal(x.code, 'effect_schedule_unavailable', `${branch}: ${JSON.stringify(x)}`); assert.deepEqual(world(), st, branch);
    }
    await withdraw(off);
    // Manual expiry needs no schedule on either outcome (released save rule, unchanged).
    await ack(gm, 'combat_ended', { roomId: room.id });
    const manual = await admitPc(saveRecord({ name: 'Disposable Manual Hobble', policy: 'gm-manual' }));
    await cast(manual, 'failed', { faces: [[2, 2]] }); assert.equal(moves(target).length, 1);
  });

  it('rejected commands spend nothing: unbound or missing branch, a branch that disagrees with its operations, forged save terms, an unexplained change, a stale target and an A11-unresolved failed outcome', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(saveRecord());
    const a = formulaApproval(ref, { faces: [[3, 3]] }); await approve(a);
    const st = world();
    await refused('actor_consequence', command(a, { branch: 'halved' }), 'save_branch_unbound');
    await refused('actor_consequence', command(a, {}), 'save_branch_unbound');
    const lying = command(a, { branch: 'failed' }); lying.adjudication.chosenResult = JSON.stringify(effect.resultFor(a, res(a), null, 'saved'));
    await refused('actor_consequence', lying, null);
    const noRider = command(a, { branch: 'saved' }); noRider.adjudication.chosenResult = command(a, { branch: 'failed' }).adjudication.chosenResult;
    await refused('actor_consequence', noRider, null);
    await refused('actor_consequence', command(a, { branch: 'failed', amount: 1 }), 'adjustment_reason_required');
    assert.deepEqual(world(), st);
    // Forged save terms at approval.
    for (const change of [x => { x.effectTerms.save.dc = 30; }, x => { x.effectTerms.save.outcome = 'halves'; }, x => { delete x.effectTerms.save; }, x => { x.effectTerms.save.scope = 'direct'; }]) {
      const x = formulaApproval(ref); change(x); await withdraw(a);
      const before = actors.clone(live().gameState), r = await ack(owner, 'actor_spell_approve', x); assert.equal(r.success, false, JSON.stringify(r)); assert.deepEqual(live().gameState, before);
    }
    // Stale target: a GM correction after approval.
    const b = formulaApproval(ref); await approve(b); const stale = command(b, { branch: 'saved' });
    await accept(correction([{ ref: target, expectedRevision: token(target).state.actorContract.revision, finalResources: { hp: { current: 49, temp: 3 } } }]));
    for (const branch of ['saved', 'failed']) {await refused('actor_consequence', { ...command(b, { branch }), actors: stale.actors }, 'approval_mismatch');}
    await withdraw(b);
    // Inherited A11 asymmetry (released save branch): a changed copy meets the active v1 rider; "failed" refuses whole, "saved" commits.
    const v1 = await admitPc(saveRecord({ name: 'Disposable Mind Mire', label: 'Mired', policy: 'target-end-count', occurrences: 3 }));
    await cast(v1, 'failed', { faces: [[1, 1]] });
    const rec2 = saveRecord({ name: 'Disposable Mind Mire', label: 'Deep mire', policy: 'target-end-count', occurrences: 3 }); rec2.authoredDefinitionId = entryFor(v1).canonicalDefinition.definitionId;
    const v2 = await admitPc(rec2, 2), c2 = formulaApproval(v2, { faces: [[2, 2]] });
    assert.equal(effect.conditionPlan(c2, token(target).state.conditions).refused.code, 'modifier_combination_unresolved');
    await approve(c2);
    await refused('actor_consequence', command(c2, { branch: 'failed' }), 'modifier_combination_unresolved');
    const kept = actors.clone(token(target).state.conditions), r = await accept(command(c2, { branch: 'saved' }));
    assert.deepEqual(token(target).state.conditions, kept); assert.equal(chosen(r).conditionApplied, false);
  });

  it('writer failure is atomic on both outcomes; racing saved/failed confirmations execute once; lost ACK, checkpoint rebuild and exact-command replay return the original receipt once; the other branch under the same commandId conflicts', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(saveRecord({ policy: 'target-start-count', occurrences: 2 })), a = formulaApproval(ref, { faces: [[6, 5]] }); await approve(a);
    await refused('actor_spell_approve', formulaApproval(ref), 'approval_pending', owner);
    const admit = writer.admitConsequence; live().isPermanent = true; writer.admitConsequence = () => ({ queued: false, code: 'frs_writer_refusal' });
    for (const branch of ['saved', 'failed']) {
      const c = command(a, { branch }), st = world(), w = await ack(gm, 'actor_consequence', c);
      assert.equal(w.code, 'frs_writer_refusal', `${branch}: ${JSON.stringify(w)}`); assert.deepEqual(world(), st, branch); assert.equal(receiptsFor(c.commandId).length, 0);
    }
    assert.deepEqual(payments.get(live(), a.approvalId).approval.roll, a.roll, 'approval and immediate faces retained');
    writer.admitConsequence = admit; live().isPermanent = false;
    const saved = command(a, { branch: 'saved' }), failed = command(a, { branch: 'failed' });
    const results = await Promise.all([ack(gm, 'actor_consequence', saved), ack(gm, 'actor_consequence', failed)]);
    assert.equal(results.filter(r => r.success).length, 1, JSON.stringify(results)); assert.equal(results.find(r => !r.success).code, 'approval_consumed');
    const won = results[0].success ? saved : failed, receipt = results.find(r => r.success).receipt, wonBranch = won === saved ? 'saved' : 'failed';
    assert.equal(moves(target).length, wonBranch === 'failed' ? 1 : 0); assert.equal(hp(target).current, 50 - (15 - 3));
    const codec = require('../services/roomCheckpoint'), built = codec.buildCheckpointDocuments({ roomId: room.id, gameState: live().gameState, revision: 1 });
    const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])) }); assert.equal(decoded.ok, true);
    const snapshot = world();
    server.rooms.set(room.id, { ...live(), gameState: { ...decoded.global, maps: decoded.maps, ...codec.deriveRootMirrors(decoded.maps) }, checkpointRevision: 1 });
    assert.deepEqual(world(), snapshot);
    gm.emit('actor_consequence', won); await sleep(100); // ACK lost
    assert.deepEqual((await ack(gm, 'actor_consequence', won)).receipt, receipt); assert.deepEqual(world(), snapshot); assert.equal(receiptsFor(won.commandId).length, 1);
    const otherBranch = command(a, { branch: wonBranch === 'saved' ? 'failed' : 'saved' });
    await refused('actor_consequence', { ...otherBranch, commandId: won.commandId, baseCommitSequence: won.baseCommitSequence, actionEpoch: won.actionEpoch }, 'command_id_conflict');
    await refused('actor_consequence', otherBranch, null);
    const view = await ack(owner, 'actor_snapshot', { roomId: room.id }); assert.deepEqual(view.maps.default.characterTokens.pc.character.mana, token(pc).character.mana);
  });

  it('route gates: a primary PC target, a self target and a creature source are refused with nothing spent', async() => {
    live().gameState.maps.default.characterTokens.pc2 = { id: 'pc2', ownerUserId: ownerUid, character: { id: 'c2', class: 'Arcanoneer', health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, tempMana: 0, tempActionPoints: 0 }, state: { conditions: [] } };
    server.setCharacterOwner('c2', ownerUid);
    const bound = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc2', ownerUid, characterId: 'c2' }, snapshotHash: actors.hash(live().gameState.maps.default.characterTokens.pc2) });
    assert.equal(bound.success, true, JSON.stringify(bound)); const pc2 = bound.ref;
    await startCombat(); await adopt();
    const ref = await admitPc(saveRecord());
    await refused('actor_spell_approve', formulaApproval(ref, { t: pc2 }), 'pc_target_save_unsupported', owner);
    await refused('actor_spell_approve', formulaApproval(ref, { t: pc }), null, owner);
    token(source).authoredAbility.record = saveRecord({ name: 'Disposable Creature Mind Hobble' });
    await refused('actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, source, expectedSourceRevision: token(source).state.actorContract.revision, definitionVersion: 1 }, 'unsupported_source_route');
  });
});
