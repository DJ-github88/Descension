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
const condition = require('../../vtt-react/src/services/authoredCondition');
const profile = require('../../vtt-react/src/services/sharedConditionProfile');
const timing = require('../../vtt-react/src/services/sharedEffectTiming');
const once = (s, e) => new Promise(r => s.once(e, r));
const ack = (s, e, d) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error(e)), 5000); s.emit(e, d, r => { clearTimeout(t); resolve(r); }); });

/** Disposable Wizard records. Different names prove data-driven execution; nothing is a named-spell exception. */
function wizardRecord({ name = 'Disposable Ember Hobble', kind = 'stunned', feet, label, policy = 'target-next-end', occurrences, durationText = 'Until the embers cool', direct = null, ap = 2, mana = 3, extra } = {}) {
  const c = { profile: pure.EFFECT_CAPABILITY, effect: kind, ...(kind === 'movement' ? { movementFeet: feet, label } : {}), expiryPolicy: policy, ...(occurrences !== undefined ? { occurrences } : {}),
    durationText, gmNote: 'GM resolves eligibility, range and any save before confirming success.' };
  const d = { name, description: 'A10 disposable test', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' },
    effectTypes: direct ? [direct, 'control'] : ['control'], controlConfig: { authoredCondition: c },
    ...(direct === 'damage' ? { damageConfig: { damageType: 'direct', elementType: 'ember', formula: '1d6+2', resolution: 'DICE' } } : {}),
    ...(direct === 'healing' ? { healingConfig: { healingType: 'direct', formula: '2d4', resolution: 'DICE' } } : {}),
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: ap, mana } };
  if (extra) {extra(d);}
  return { ...actors.clone(d), authoredDraft: d, authoredDefinitionId: uuid() };
}
const rollFor = (formula, faces) => { const r = pure.readFormula(formula); const dice = [{ sides: r.dice[0].sides, faces }]; return { mode: 'physical', dice, constant: r.constant, reading: r.reading, total: faces.reduce((a, b) => a + b, r.constant) }; };

describe('P14-M5 composition — immediate + periodic, registered production handlers', function() {
  this.timeout(20000);
  let server, room, gm, owner, observer, writer, source, target, other, alt1, alt2, pc, ownerUid;
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer }); await server.start();
    for (const e of ['actor_bind', 'actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_revoke', 'actor_spell_prepare_creature', 'actor_spell_approve',
      'actor_spell_withdraw', 'actor_turn_boundary', 'actor_periodic_resolve', 'combat_started', 'combat_ended', 'actor_spell_list']) {server.setEventLimits(e, { maxPerMinute: 4000, maxPerSecond: 4000 });}
    const gmUid = server.nextUserId(); ownerUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid); server.registerAuthToken('owner', ownerUid); server.registerAuthToken('observer', server.nextUserId());
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: gmUid });
    for (const role of ['owner', 'observer']) { const s = server.connect({ token: role }); await once(s, 'connect'); const j = once(s, 'room_joined'); s.emit('join_room', { roomId: room.id, playerName: role, password: '' }); await j; if (role === 'owner') {owner = s;} else {observer = s;} }
    server.setCharacterOwner('c', ownerUid);
    const map = () => room.gameState.maps.default; // each install replaces gameState
    for (const id of ['source', 'target', 'other', 'alt1', 'alt2']) {
      const t = { id, name: id, creatureId: 'disposable', stats: { maxHp: 30, maxMana: 20, maxAP: 10, speed: 30 }, authoredAbility: { schemaVersion: 1, record: wizardRecord(), librarySpellId: null },
        state: { currentHp: 20, currentMana: 20, currentActionPoints: 10, tempHealth: 3, tempMana: 2, tempActionPoints: 1, conditions: [] } };
      map().tokens[id] = t;
      const r = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: id }, snapshotHash: actors.hash(t) });
      assert.equal(r.success, true, JSON.stringify(r)); if (id === 'source') {source = r.ref;} else if (id === 'target') {target = r.ref;} else if (id === 'other') {other = r.ref;} else if (id === 'alt1') {alt1 = r.ref;} else {alt2 = r.ref;}
    }
    map().characterTokens.pc = { id: 'pc', ownerUserId: ownerUid, character: { id: 'c', class: 'Arcanoneer', health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, tempMana: 2, tempActionPoints: 1 }, state: { conditions: [] } };
    pc = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'c' }, snapshotHash: actors.hash(map().characterTokens.pc) })).ref;
    assert.ok(pc);
  });
  afterEach(async() => { gm.disconnect(); owner.disconnect(); observer.disconnect(); await server.stop(); });

  const live = () => server.rooms.get(room.id);
  const token = ref => actors.locate(live(), ref || source).token;
  const base = () => ({ version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence });
  async function startCombat(order = [pc, source, target]) {
    const r = await ack(gm, 'combat_started', { roomId: room.id, turnOrder: order.map(ref => ({ tokenId: ref.tokenId, actorRef: ref })), currentTurnIndex: 0, round: 1 });
    assert.equal(r.success, true, JSON.stringify(r));
  }
  const boundary = (mode = 'advance') => ({ ...base(), mode, combatHash: actors.hash(live().gameState.combat), expectedClock: mode === 'advance' ? { id: live().gameState.combat.effectLifecycle.id, sequence: live().gameState.combat.effectLifecycle.sequence } : null });
  async function adopt() { const r = await ack(gm, 'actor_turn_boundary', boundary('adopt')); assert.equal(r.success, true, JSON.stringify(r)); }
  async function advance() { const c = boundary(), r = await ack(gm, 'actor_turn_boundary', c); assert.equal(r.success, true, JSON.stringify(r)); return { c, r }; }
  async function admitCreature(record, ref = source) {
    token(ref).authoredAbility.record = record;
    const r = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, source: ref, expectedSourceRevision: token(ref).state.actorContract.revision, definitionVersion: 1 });
    assert.equal(r.success, true, JSON.stringify(r)); return r.definitionRef;
  }
  async function admitPc(record) {
    const r = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, record, definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(r.success, true, JSON.stringify(r)); return r.definitionRef;
  }
  const entryFor = ref => installed.list(live()).entries.find(e => pure.actionId(e.definitionRef) === pure.actionId(ref));
  const resolution = d => ({ gmConfirmed: true, timing: d.timing, timingNote: 'GM ruling: exact target, range and save resolved at the table', evidence: 'PRIVATE GM save ruling' });
  function spellOf(e) { const d = e.canonicalDefinition; return { definitionId: pure.actionId(e.definitionRef), definitionHash: `${pure.EFFECT_CAPABILITY}/${e.definitionRef.definitionHash}`, name: d.name, kind: 'effect', damageTypes: d.effects.direct?.damageTypes || [] }; }
  function creatureAttempt({ s = source, t = target, faces = [4] } = {}) {
    const grant = token(s).state.actorContract.authoredAdmission, e = installed.lookup(live(), { definitionId: pure.actionId(grant.definitionRef) }), d = e.canonicalDefinition;
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence, source: s, target: t,
      sourceAuthority: { admissionId: grant.requestId, associationHash: grant.associationHash, gmUid: grant.gmUid }, spell: spellOf(e), price: e.descriptor.price, classPayment: null,
      roll: d.effects.direct ? rollFor(d.effects.direct.formula, faces) : null, effectTerms: effect.termsFor(d), resolution: resolution(d) };
  }
  function pcApproval(ref, { t = target, faces = [3, 2] } = {}) {
    const e = entryFor(ref), d = e.canonicalDefinition;
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence, source: pc, target: t,
      spell: spellOf(e), roll: d.effects.direct ? rollFor(d.effects.direct.formula, faces) : null, price: e.descriptor.price, classPayment: null, effectTerms: effect.termsFor(d) };
  }
  async function prepare(a) { const before = actors.clone(live().gameState), r = await ack(gm, 'actor_spell_prepare_creature', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); assert.deepEqual(live().gameState, before); }
  async function approve(a) { const before = actors.clone(live().gameState), r = await ack(owner, 'actor_spell_approve', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); assert.deepEqual(live().gameState, before); }
  function command(a, { amount, reason = '', res } = {}) {
    const pcSource = a.source.kind === 'character', resolved = pcSource ? res || resolution({ timing: a.effectTerms.timing }) : a.resolution;
    const pools = actors.resources(token(a.source), a.source.kind), pay = {};
    for (const p of ['ap', 'mana']) {if (a.price[p]) {pay[p] = payments.tempFirst(pools[p].current, pools[p].temp, a.price[p]);}}
    if (!Object.keys(pay).length) {pay.ap = payments.tempFirst(pools.ap.current, pools.ap.temp, 0);}
    const direct = a.effectTerms.direct, finalAmount = direct ? amount ?? a.roll.total : 0;
    const plan = effect.conditionPlan(a, token(a.target).state.conditions || []); // A11: add / refresh plan (refusals are built as a plain add)
    const targetEntry = { ref: a.target, expectedRevision: token(a.target).state.actorContract.revision, conditions: plan.ops || [{ op: 'add', recordId: a.approvalId, record: effect.recordFor(a) }] };
    if (direct) {
      const hp = actors.resources(token(a.target), a.target.kind).hp, fromTemp = Math.min(hp.temp, finalAmount);
      targetEntry.finalResources = { hp: direct.kind === 'damage' ? { current: Math.max(0, hp.current - (finalAmount - fromTemp)), temp: hp.temp - fromTemp } : { current: Math.min(hp.max, hp.current + finalAmount), temp: hp.temp } };
    }
    return { ...base(), source: a.source, target: a.target, approval: { approvalId: a.approvalId, contentHash: actors.hash(a) },
      actors: [{ ref: a.source, expectedRevision: token(a.source).state.actorContract.revision, finalResources: pay }, targetEntry],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, finalAmount, adjustmentReason: direct ? reason : '', chosenResult: JSON.stringify(effect.resultFor(a, resolved, plan.combination || null)) } };
  }
  async function accept(c) { const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true, JSON.stringify(r)); return r; }
  async function refused(event, data, code, socket = gm) { const before = actors.clone(live().gameState), r = await ack(socket, event, data); assert.equal(r.success, false, JSON.stringify(r)); if (code) {assert.equal(r.code, code, JSON.stringify(r));} assert.deepEqual(live().gameState, before); return r; }
  const remove = (ref, id) => ({ ...base(), actors: [{ ref, expectedRevision: token(ref).state.actorContract.revision, conditions: [{ op: 'remove', recordId: id }] }],
    adjudication: { definitionId: 'gm-correction', definitionVersionOrHash: 'gm-correction', finalAmount: 0, adjustmentReason: '', chosenResult: 'GM exact removal' } });
  const schedule = record => timing.scheduleFor(record, live().gameState.combat);

  // ---- A11 helpers -------------------------------------------------------------------------------------------
  // Production pure helper the client consumer (calculateEffectiveMovementSpeed) is built on; base speed 30 here.
  const speed = ref => profile.movementBreakdown(30, token(ref).state.conditions).result;
  const moves = ref => token(ref).state.conditions.filter(profile.isMovementModifier);
  const chosen = r => JSON.parse(r.receipt.adjudication.chosenResult);
  const move = (name, label, feet, policy, extra = {}) => wizardRecord({ name, kind: 'movement', feet, label, policy, ap: 1, mana: 0, ...extra });
  async function admitVersion(record, ref, definitionVersion) {
    token(ref).authoredAbility.record = record;
    const r = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, source: ref, expectedSourceRevision: token(ref).state.actorContract.revision, definitionVersion });
    assert.equal(r.success, true, JSON.stringify(r)); return r.definitionRef;
  }
  async function cast(s = source, t = target, faces) { const a = creatureAttempt({ s, t, ...(faces ? { faces } : {}) }); await prepare(a); return a; }
  const withdraw = a => ack(a.source.kind === 'creature' ? gm : owner, 'actor_spell_withdraw', { roomId: room.id, approvalId: a.approvalId, approval: a });
  const scheduled = ref => Object.values(live().gameState.combat.effectLifecycle.schedules).filter(item => profile.sameRef(item.ref, ref));


  // ---- M2A helpers -------------------------------------------------------------------------------------------
  const sleep = ms => new Promise(res => setTimeout(res, ms));
  const stuns = ref => token(ref).state.conditions.filter(profile.isStunned);
  const seq = () => live().gameState.combat.effectLifecycle.sequence;
  const counted = (name, label, feet, policy, occurrences, extra = {}) => wizardRecord({ name, kind: 'movement', feet, label, policy, occurrences, ap: 0, mana: 0, ...extra });
  const stunned = (name, policy, occurrences) => wizardRecord({ name, policy, occurrences, ap: 0, mana: 0 });
  async function advanceTo(n) { let last = null; while (seq() < n) {last = await advance();} return last; }
  const progress = rec => timing.progress(rec, live().gameState.combat);
  // Independent oracle: walk the roster one authenticated transition at a time and collect the target's boundaries.
  // The end of a turn already in progress is not counted (A10 strictly-next rule, inherited unchanged).
  function oracle(R, i, t, boundary, N, s) {
    const events = []; let idx = i;
    for (let k = 1; events.length < N + 1; k++) { if (boundary === 'start' ? (idx + 1) % R === t : idx === t) {events.push(k);} idx = (idx + 1) % R; }
    return s + (boundary === 'end' && i === t ? events.slice(1) : events)[N - 1];
  }
  const ids = (...xs) => xs.map(x => x.id || x.recordId || x).sort();
  const countedOf = x => chosen(x.r ?? x).counted;


  // ---- M5 helpers --------------------------------------------------------------------------------------------
  /** A disposable Wizard periodic definition: one damage OR healing tick, explicit boundary and explicit tick count. */
  function periodicRecord({ name = 'Disposable Wasting Brand', kind = 'damage', formula = '1d6', damageType = 'blight', policy = 'target-start-count', occurrences = 3, label = 'Wasting Brand',
    ap = 1, mana = 2, tickRoll = 'each-tick', restriction = 'any', extra } = {}) {
    // null = leave the field out (JS defaults would replace an explicit undefined).
    const c = { profile: pure.EFFECT_CAPABILITY, effect: 'periodic', periodicKind: kind, periodicFormula: formula, ...(kind === 'damage' && damageType !== null ? { periodicDamageType: damageType } : {}),
      ...(tickRoll !== null ? { tickRoll } : {}), label, expiryPolicy: policy, ...(occurrences !== null ? { occurrences } : {}),
      durationText: 'While the brand smoulders', gmNote: 'GM resolves eligibility and range before confirming success.' };
    const d = { name, description: 'M5 disposable test', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: ['control'], controlConfig: { authoredCondition: c },
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: [restriction] }, resourceCost: { actionPoints: ap, mana } };
    if (extra) {extra(d);}
    return { ...actors.clone(d), authoredDraft: d, authoredDefinitionId: uuid() };
  }
  const periodic = ref => token(ref).state.conditions.filter(profile.isPeriodicTick);
  const hp = ref => { const v = actors.resources(token(ref), ref.kind).hp; return { current: v.current, temp: v.temp }; };
  const pools = ref => actors.clone(actors.resources(token(ref), ref.kind));
  const due = () => timing.dueTicks(live().gameState.combat);
  const ticksOf = x => chosen(x.r ?? x).ticks || [];
  function resolveReq(t, { faces = [4], amount, reason = '', mode = 'apply', roll } = {}) {
    if (mode === 'dismiss') {return { ...base(), tickId: t.tickId, mode, adjustmentReason: reason || 'GM resolved this tick by hand at the table' };}
    const r = roll || rollFor(t.tick.formula, faces);
    return { ...base(), tickId: t.tickId, mode, expectedRevision: token(t.ref).state.actorContract.revision, roll: r, finalAmount: amount ?? r.total, adjustmentReason: reason };
  }
  async function resolve(t, opts) { const c = resolveReq(t, opts), r = await ack(gm, 'actor_periodic_resolve', c); assert.equal(r.success, true, JSON.stringify(r)); return { c, r }; }
  function oracleAll(R, i, t, boundary, N, s) {
    const events = []; let idx = i;
    for (let k = 1; events.length < N + 1; k++) { if (boundary === 'start' ? (idx + 1) % R === t : idx === t) {events.push(k);} idx = (idx + 1) % R; }
    return (boundary === 'end' && i === t ? events.slice(1) : events).slice(0, N).map(k => s + k);
  }
  const noRound = text => assert.doesNotMatch(String(text), /round/i);

  // ---- M5 composition helpers --------------------------------------------------------------------------------
  /** A disposable Wizard bundle: ONE immediate damage OR healing part (rolled at cast) + ONE periodic tick of the same kind. */
  function composedRecord({ name = 'Disposable Searing Brand', kind = 'damage', now = kind, nowFormula = kind === 'damage' ? '1d6+2' : '2d4', ...rest } = {}) {
    return periodicRecord({ name, kind, ...rest, extra: d => {
      d.effectTypes = [now, 'control'];
      if (now === 'damage') {d.damageConfig = { damageType: 'direct', elementType: 'ember', formula: nowFormula, resolution: 'DICE' };}
      else {d.healingConfig = { healingType: 'direct', formula: nowFormula, resolution: 'DICE' };}
      if (rest.extra) {rest.extra(d);}
    } });
  }
  const receiptsFor = commandId => actors.ledger(live()).receipts.filter(x => x.commandId === commandId);
  const lifecycleState = () => actors.clone({ dueTicks: live().gameState.combat.effectLifecycle.dueTicks || {}, schedules: live().gameState.combat.effectLifecycle.schedules || {} });
  async function ownerCast(ref, { faces = [4], t = target } = {}) { const b = pcApproval(ref, { t, faces }); await approve(b); return b; }
  const map2 = () => live().gameState.maps.default;
  const privateRes = b => ({ ...resolution({ timing: b.effectTerms.timing }), evidence: 'PRIVATE GM save ruling' });

  it('atomic composition: owner PC → creature pays once, applies the immediate HP change and installs ONE periodic instance in one receipt; ticks then roll separately to the exact final tick', async() => {
    await startCombat([pc, source, target]); await adopt();
    const rec = composedRecord({ occurrences: 3, ap: 1, mana: 3 });
    const compiled = pure.definitionFromWizard(actors.clone(rec), { roomId: room.id, definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(compiled.ok, true, JSON.stringify(compiled));
    assert.deepEqual(compiled.definition.effects, { direct: { kind: 'damage', formula: '1d6+2', damageTypes: ['ember'] }, condition: { kind: 'periodic', tick: { kind: 'damage', formula: '1d6', damageTypes: ['blight'] }, label: 'Wasting Brand', tickRoll: 'each-tick' } });
    assert.equal(definitions.compileDefinition(compiled.definition).descriptor.compilerVersion, 'p14-m5-composition-1');
    assert.match(pure.definitionSummary(compiled.definition), /^immediate ember damage 1d6\+2 \(rolled at cast\) \+ Wasting Brand/); noRound(pure.definitionSummary(compiled.definition));
    const ref = await admitPc(rec);
    const before = pools(pc), startHp = hp(target), b = await ownerCast(ref, { faces: [5] });
    assert.equal(b.roll.total, 7, 'the immediate roll is the 1d6+2 cast roll');
    const c = command(b, { res: privateRes(b) }), r = await accept(c);
    // One receipt: payment once, immediate HP (temp first: 7 = 3 temp + 4 HP) and the periodic instance together.
    assert.equal(receiptsFor(c.commandId).length, 1);
    const paid = pools(pc);
    assert.equal(paid.mana.current + paid.mana.temp, before.mana.current + before.mana.temp - 3); assert.equal(paid.ap.current + paid.ap.temp, before.ap.current + before.ap.temp - 1);
    assert.deepEqual(hp(target), { current: startHp.current - 4, temp: 0 });
    assert.equal(periodic(target).length, 1); const inst = periodic(target)[0];
    assert.deepEqual([schedule(inst).occurrences, schedule(inst).boundary], [3, 'start']);
    assert.equal(due().length, 0, 'the cast itself records no tick');
    const result = chosen(r); assert.deepEqual(result.direct, { kind: 'damage', damageTypes: ['ember'] }); assert.equal(result.roll.total, 7); assert.equal(result.condition.kind, 'periodic');
    // The installed instance carries only the tick terms, never the immediate roll or formula.
    assert.ok(!JSON.stringify(inst).includes('1d6+2')); assert.equal(inst.overTimeFormula, '1d6');
    // Privacy: the observer projection of the cast receipt carries no private GM evidence or owner pools.
    const pub = actors.publicReceipt(actors.ledger(live()).receipts.at(-1)); assert.ok(!JSON.stringify(pub).includes('PRIVATE'));
    // Exact final tick: three start boundaries record three ticks, the third ends the instance and stays resolvable.
    const afterCast = hp(target), seen = [];
    for (let s = 1; s <= 11; s++) { for (const t of ticksOf(await advance())) {seen.push([s, t.occurrence, t.of, t.final]);} assert.deepEqual(hp(target), afterCast, 'a boundary never changes HP'); assert.deepEqual(pools(pc), paid, 'no recurring payment'); }
    assert.deepEqual(seen, [[2, 1, 3, false], [5, 2, 3, false], [8, 3, 3, true]]);
    assert.equal(periodic(target).length, 0, 'the last tick ends the instance');
    for (const t of due()) {assert.deepEqual(t.tick, { kind: 'damage', formula: '1d6', damageType: 'blight' }, 'each tick snapshots only the periodic terms');}
    // Each tick is rolled separately at resolution; the cast roll is never reused.
    await resolve(due()[0], { faces: [2] }); await resolve(due()[0], { faces: [6] }); await resolve(due()[0], { faces: [1] });
    assert.deepEqual(hp(target), { current: afterCast.current - 9, temp: 0 }); assert.equal(due().length, 0); assert.deepEqual(pools(pc), paid);
    const view = await ack(observer, 'actor_snapshot', { roomId: room.id }); assert.equal(view.success, true); assert.ok(!JSON.stringify(view).includes('PRIVATE')); assert.ok(!JSON.stringify(view.combat.effectLifecycle.dueTicks || {}).includes(pc.ownerUid), 'tick obligations carry no source PC identity');
  });

  it('independent roll custody: the cast roll cannot resolve a tick; a zero or adjusted immediate amount still installs the periodic part unchanged; healing composition caps at max', async() => {
    await startCombat([pc, source, target, other]); await adopt();
    const ref = await admitPc(composedRecord({ formula: '1d4', occurrences: 2 }));
    const b = await ownerCast(ref, { faces: [6] }), startHp = hp(target);
    await refused('actor_consequence', command(b, { amount: 0, res: privateRes(b) }), 'adjustment_reason_required');
    const r = await accept(command(b, { amount: 0, reason: 'GM ruling: the brand lands but the flare is warded', res: privateRes(b) }));
    assert.equal(r.receipt.adjudication.finalAmount, 0); assert.deepEqual(hp(target), startHp, 'a zero immediate amount changes no HP');
    assert.equal(periodic(target).length, 1, 'a zero immediate result does not cancel the periodic part (no rule says so)');
    await advanceTo(2); const t = due()[0]; assert.equal(t.tick.formula, '1d4');
    for (const roll of [b.roll, { ...b.roll, reading: '1d4', constant: 0, total: 6 }]) {
      const st = actors.clone(live().gameState), x = await ack(gm, 'actor_periodic_resolve', resolveReq(t, { roll }));
      assert.equal(x.success, false); assert.ok(['periodic_roll_mismatch', 'invalid_spell_approval'].includes(x.code), JSON.stringify(x)); assert.deepEqual(live().gameState, st);
    }
    await resolve(t, { faces: [3] }); assert.deepEqual(hp(target), { current: startHp.current, temp: 0 }, '3 from temp first');
    await advanceTo(6); assert.equal(due()[0].final, true); await resolve(due()[0], { faces: [4] }); assert.equal(hp(target).current, startHp.current - 4);
    // Healing + healing: immediate healing is capped at max at cast; each healing tick is rolled and capped on its own.
    const heal = await admitPc(composedRecord({ name: 'Disposable Mending Bloom', kind: 'healing', formula: '1d4', occurrences: 2, label: 'Mending Bloom', restriction: 'ally' }));
    token(other).state.currentHp = 25;
    const h = await ownerCast(heal, { t: other, faces: [4, 4] }); await accept(command(h, { res: privateRes(h) }));
    assert.deepEqual(hp(other), { current: 30, temp: 3 }, 'immediate healing caps at max');
    assert.equal(periodic(other).length, 1);
  });

  it('review F4: immediate damage that takes the creature to 0 HP still installs the periodic part; its later tick is refused for manual GM adjudication and can be dismissed', async() => {
    await startCombat([pc, source, target]); await adopt();
    const ref = await admitPc(composedRecord({ occurrences: 2 })); token(target).state.currentHp = 2; token(target).state.tempHealth = 0;
    const b = await ownerCast(ref, { faces: [6] }); await accept(command(b, { res: privateRes(b) }));
    assert.deepEqual(hp(target), { current: 0, temp: 0 }); assert.equal(periodic(target).length, 1, 'no rule says a downed target cancels the periodic part');
    await advanceTo(2); await refused('actor_periodic_resolve', resolveReq(due()[0]), 'periodic_target_down');
    await resolve(due()[0], { mode: 'dismiss', reason: 'Creature down; GM ruling at the table' }); assert.equal(due().length, 0);
  });

  it('writer refusal changes nothing: payment, immediate HP, periodic instance, schedule and receipts all stay as before; a retry with the same command then applies once', async() => {
    await startCombat([pc, source, target]); await adopt();
    const ref = await admitPc(composedRecord({ occurrences: 2 })), b = await ownerCast(ref);
    const c = command(b, { res: privateRes(b) });
    const admit = writer.admitConsequence; live().isPermanent = true;
    writer.admitConsequence = () => ({ queued: false, code: 'm5c_writer_refusal' });
    const state = actors.clone(live().gameState), ledgerBefore = actors.clone(actors.ledger(live()));
    const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, false); assert.equal(r.code, 'm5c_writer_refusal', JSON.stringify(r));
    assert.deepEqual(live().gameState, state, 'nothing changed'); assert.deepEqual(actors.ledger(live()), ledgerBefore);
    assert.equal(periodic(target).length, 0); assert.equal(receiptsFor(c.commandId).length, 0);
    writer.admitConsequence = admit; live().isPermanent = false;
    await accept(command(b, { res: privateRes(b) })); assert.equal(periodic(target).length, 1);
  });

  it('retained initial command: duplicate and lost-ACK delivery of the cast command applies payment, HP and the periodic instance once and returns the original receipt; a changed body conflicts', async() => {
    await startCombat([pc, source, target]); await adopt();
    const ref = await admitPc(composedRecord({ occurrences: 2 })), b = await ownerCast(ref, { faces: [3] });
    const c = command(b, { res: privateRes(b) });
    gm.emit('actor_consequence', c); await sleep(120); // ACK lost
    const once1 = { hp: hp(target), pools: pools(pc), periodic: actors.clone(periodic(target)), life: lifecycleState() };
    assert.equal(periodic(target).length, 1);
    const replay = await ack(gm, 'actor_consequence', c); assert.equal(replay.success, true, JSON.stringify(replay));
    const replay2 = await ack(gm, 'actor_consequence', c); assert.deepEqual(replay2.receipt, replay.receipt, 'the same command returns the original receipt');
    assert.deepEqual({ hp: hp(target), pools: pools(pc), periodic: periodic(target), life: lifecycleState() }, once1, 'replay applies nothing again');
    assert.equal(receiptsFor(c.commandId).length, 1);
    await refused('actor_consequence', { ...c, adjudication: { ...c.adjudication, finalAmount: 1, adjustmentReason: 'changed' } }, 'command_id_conflict');
    // A second fresh command for the consumed approval is refused (the approval is spent).
    const second = await ack(gm, 'actor_consequence', { ...c, commandId: uuid(), baseCommitSequence: actors.ledger(live()).commitSequence }); assert.equal(second.success, false);
    assert.deepEqual({ hp: hp(target), pools: pools(pc), periodic: periodic(target), life: lifecycleState() }, once1);
  });

  it('removal: before a due tick nothing is recorded and the immediate HP stays; after a due tick is recorded the open tick turns stale (dismiss only) and no later tick follows', async() => {
    await startCombat([pc, source, target]); await adopt();
    const ref = await admitPc(composedRecord({ occurrences: 3 }));
    let b = await ownerCast(ref, { faces: [6] }); await accept(command(b, { res: privateRes(b) }));
    const afterCast = hp(target); let inst = periodic(target)[0];
    await accept(remove(target, inst.recordId)); assert.equal(periodic(target).length, 0); assert.deepEqual(hp(target), afterCast, 'removing the periodic part does not undo the immediate HP change');
    for (let s = 1; s <= 9; s++) {assert.equal(ticksOf(await advance()).length, 0, 'a removed instance records no tick');}
    b = await ownerCast(ref, { faces: [1] }); await accept(command(b, { res: privateRes(b) })); inst = periodic(target)[0];
    let guard = 0; while (!due().length && guard++ < 6) {await advance();}
    assert.equal(due().length, 1); const open = due()[0];
    await accept(remove(target, inst.recordId));
    await refused('actor_periodic_resolve', resolveReq(open), 'periodic_tick_stale'); assert.equal(due().length, 1, 'the stale tick stays visible');
    const hpBefore = hp(target); await resolve(open, { mode: 'dismiss' }); assert.deepEqual(hp(target), hpBefore);
    for (let s = 0; s < 9; s++) {assert.equal(ticksOf(await advance()).length, 0);}
  });

  it('reload and unresolved-tick recovery: a checkpoint rebuild keeps the composed instance, its schedule and each open tick once; the cast command and a resolved tick replay without effect', async() => {
    await startCombat([pc, source, target]); await adopt();
    const ref = await admitPc(composedRecord({ occurrences: 3 })), b = await ownerCast(ref, { faces: [2] });
    const c = command(b, { res: privateRes(b) }), cast1 = await accept(c);
    await advanceTo(5); assert.equal(due().length, 2);
    const first = await resolve(due()[0], { faces: [3] }); const hpMid = hp(target), paid = pools(pc);
    const codec = require('../services/roomCheckpoint'), built = codec.buildCheckpointDocuments({ roomId: room.id, gameState: live().gameState, revision: 1 });
    const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])) }); assert.equal(decoded.ok, true);
    server.rooms.set(room.id, { ...live(), gameState: { ...decoded.global, maps: decoded.maps, ...codec.deriveRootMirrors(decoded.maps) }, checkpointRevision: 1 });
    assert.equal(due().length, 1); assert.equal(due()[0].occurrence, 2); assert.equal(periodic(target).length, 1);
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, cast1.receipt, 'the cast command replays after rebuild');
    assert.deepEqual((await ack(gm, 'actor_periodic_resolve', first.c)).receipt, first.r.receipt, 'the resolved tick replays after rebuild');
    assert.deepEqual(hp(target), hpMid); assert.deepEqual(pools(pc), paid);
    await resolve(due()[0], { faces: [1] }); await advanceTo(8); assert.equal(due()[0].final, true); assert.equal(periodic(target).length, 0);
    await resolve(due()[0], { faces: [1] }); assert.equal(hp(target).current, hpMid.current - 2);
  });

  it('staleness and identity: a changed or recreated target or source refuses the whole cast with nothing charged, applied or installed', async() => {
    await startCombat([pc, source, target]); await adopt();
    const ref = await admitPc(composedRecord({ occurrences: 2 }));
    const untouched = () => ({ hp: hp(target), pools: pools(pc), periodic: periodic(target).length, receipts: actors.ledger(live()).receipts.length });
    // Target revision moved after the command was built (any accepted change to it).
    let b = await ownerCast(ref), c = command(b, { res: privateRes(b) }), start = untouched();
    await accept({ ...base(), actors: [{ ref: target, expectedRevision: token(target).state.actorContract.revision, finalResources: { hp: { current: 19, temp: 3 } } }], adjudication: { definitionId: 'gm-correction', definitionVersionOrHash: 'gm-correction', finalAmount: 0, adjustmentReason: '', chosenResult: 'GM correction' } });
    start = untouched(); const r1 = await ack(gm, 'actor_consequence', { ...c, baseCommitSequence: actors.ledger(live()).commitSequence }); assert.equal(r1.success, false, JSON.stringify(r1)); assert.equal(r1.code, 'approval_mismatch', JSON.stringify(r1)); assert.deepEqual(untouched(), start);
    assert.equal((await withdraw(b)).success, true);
    // Recreated target incarnation.
    b = await ownerCast(ref); c = command(b, { res: privateRes(b) });
    start = untouched(); const tc = token(target).state.actorContract, savedT = tc.instanceId; tc.instanceId = uuid();
    const r2 = await ack(gm, 'actor_consequence', c); assert.equal(r2.success, false, JSON.stringify(r2)); assert.equal(r2.code, 'actor_binding_conflict', JSON.stringify(r2)); tc.instanceId = savedT; assert.deepEqual(untouched(), start);
    assert.equal((await withdraw(b)).success, true);
    // Recreated source incarnation.
    b = await ownerCast(ref); c = command(b, { res: privateRes(b) });
    start = untouched(); const sc = token(pc).state.actorContract, savedS = sc.instanceId; sc.instanceId = uuid();
    const r3 = await ack(gm, 'actor_consequence', c); assert.equal(r3.success, false, JSON.stringify(r3)); assert.equal(r3.code, 'actor_binding_conflict', JSON.stringify(r3)); sc.instanceId = savedS; assert.deepEqual(untouched(), start);
    // A recreated target after installation: the open tick refuses application and stays dismissable.
    const ok = await ack(gm, 'actor_consequence', command(b, { res: privateRes(b) })); assert.equal(ok.success, true, JSON.stringify(ok));
    await advanceTo(2); const t = due()[0], pending = resolveReq(t), tcLive = token(target).state.actorContract; tcLive.instanceId = uuid();
    await refused('actor_periodic_resolve', pending, 'periodic_tick_stale'); tcLive.instanceId = savedT;
  });

  it('bounded scope: mixed kinds, a creature caster, a PC target, a second stream and tampered terms stay manual; single-component M5 and A10 bundles keep their compiler identities', async() => {
    const opts = { roomId: room.id, definitionVersion: 1, classId: 'arcanoneer' };
    for (const [name, rec] of Object.entries({ damageNowHealTick: composedRecord({ kind: 'healing', now: 'damage' }), healNowDamageTick: composedRecord({ kind: 'damage', now: 'healing' }),
      selfTarget: composedRecord({ restriction: 'self' }), manualTiming: composedRecord({ policy: 'gm-manual', occurrences: null }), castOnceTick: composedRecord({ tickRoll: 'once-at-cast' }),
      immediateSave: composedRecord({ extra: d => { d.damageConfig.savingThrow = true; } }), immediateDot: composedRecord({ extra: d => { d.damageConfig.hasDotEffect = true; d.damageConfig.dotConfig = { dotFormula: '1d8', duration: 5, tickFrequency: 'turn' }; } }),
      cooldown: composedRecord({ extra: d => { d.cooldownConfig = { cooldownType: 'turn_based', cooldownValue: 2 }; } }), classCost: composedRecord({ extra: d => { d.resourceCost.resourceTypes = ['mana', 'vials']; } }),
      healthNow: composedRecord({ nowFormula: '1d6 + caster_missing_health/4' }), deterministicNow: composedRecord({ nowFormula: 'intelligence/3' }), spacedPlainNow: composedRecord({ nowFormula: '1d6 + 3' }), schoolConflict: composedRecord({ extra: d => { d.typeConfig.school = 'ember'; } }) })) {
      const r = pure.definitionFromWizard(actors.clone(rec), opts); assert.equal(r.ok, false, `${name} must stay manual: ${JSON.stringify(r)}`);
    }
    const ok = pure.definitionFromWizard(actors.clone(composedRecord()), opts).definition;
    for (const tamper of [d => { d.effects.direct = { kind: 'healing', formula: '2d4' }; }, d => { d.effects.condition.tickRoll = 'once-at-cast'; }, d => { d.timing.expiryPolicy = 'gm-manual'; delete d.timing.occurrences; }]) {
      const d = actors.clone(ok); tamper(d); assert.equal(definitions.compileDefinition(d).ok, false, JSON.stringify(d.effects));
    }
    const single = pure.definitionFromWizard(actors.clone(periodicRecord()), opts).definition;
    assert.equal(definitions.compileDefinition(single).descriptor.compilerVersion, 'p14-m5-periodic-1');
    assert.equal(definitions.compileDefinition(pure.definitionFromWizard(actors.clone(wizardRecord({ direct: 'damage' })), opts).definition).descriptor.compilerVersion, 'p14-a10-effect-1');
    await startCombat([pc, source, target, other]); await adopt();
    // A GM-controlled creature caster stays manual for the composed form.
    token(source).authoredAbility.record = composedRecord({ name: 'Disposable Creature Brand' });
    await refused('actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, source, expectedSourceRevision: token(source).state.actorContract.revision, definitionVersion: 1 }, 'unsupported_source_route');
    assert.equal(installed.registry(live()).definitions.length, 0, 'nothing admitted for the creature source');
    // A PC target stays manual (owner PC as its own target is refused before any periodic rule; a creature caster on a PC as well).
    const ref = await admitPc(composedRecord());
    const own = pcApproval(ref, { t: pc }); const r2 = await ack(owner, 'actor_spell_approve', own); assert.equal(r2.success, false, JSON.stringify(r2)); assert.equal(r2.code, 'unsupported_effect_target', JSON.stringify(r2));
    // Review F2: a DIFFERENT primary PC target is refused by the existing PC consent classification (periodic is neither rider polarity).
    map2().characterTokens.pc2 = { id: 'pc2', ownerUserId: ownerUid, character: { id: 'c2', class: 'Arcanoneer', health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, tempMana: 0, tempActionPoints: 0 }, state: { conditions: [] } };
    server.setCharacterOwner('c2', ownerUid);
    const bound = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc2', ownerUid, characterId: 'c2' }, snapshotHash: actors.hash(map2().characterTokens.pc2) });
    assert.equal(bound.success, true, JSON.stringify(bound));
    const onPc2 = pcApproval(ref, { t: bound.ref }); const before2 = actors.clone(live().gameState), r4 = await ack(owner, 'actor_spell_approve', onPc2);
    assert.equal(r4.success, false); assert.equal(r4.code, 'pc_target_effect_unsupported', JSON.stringify(r4)); assert.deepEqual(live().gameState, before2);
    // A second periodic stream on the same creature is refused whole and uncharged — immediate part included.
    const b1 = await ownerCast(ref); await accept(command(b1, { res: privateRes(b1) }));
    const charged = { pools: pools(pc), hp: hp(target) }, b2 = await ownerCast(ref);
    await refused('actor_consequence', command(b2, { res: privateRes(b2) }), 'periodic_combination_unresolved');
    assert.deepEqual({ pools: pools(pc), hp: hp(target) }, charged, 'neither the immediate part nor the price is applied when the periodic part is refused');
    // Admitted terms cannot be swapped at cast: changed effect terms are a mismatch.
    const forged = pcApproval(ref); forged.effectTerms.condition.tick.formula = '1d4';
    const r3 = await ack(owner, 'actor_spell_approve', forged); assert.equal(r3.success, false); assert.equal(r3.code, 'authored_effect_mismatch', JSON.stringify(r3));
  });
});
