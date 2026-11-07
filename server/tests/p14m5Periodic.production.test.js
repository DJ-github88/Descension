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

describe('P14-M5 periodic ticks — registered production handlers', function() {
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

  it('exact due boundaries and count: three start ticks are recorded at exactly three authenticated boundaries, the last ends the instance, and no boundary changes HP or charges again', async() => {
    await startCombat([pc, source, target]); await adopt();
    await admitCreature(periodicRecord());
    const before = pools(source), a = await cast(); await accept(command(a));
    const paid = pools(source); assert.equal(paid.mana.current + paid.mana.temp, before.mana.current + before.mana.temp - 2); assert.equal(paid.ap.current + paid.ap.temp, before.ap.current + before.ap.temp - 1);
    const rec = periodic(target)[0]; assert.ok(rec, 'one exact periodic instance');
    assert.equal(rec.hasOverTimeEffect, false, 'the legacy client ticker can never run it');
    assert.deepEqual([schedule(rec).dueSequence, schedule(rec).occurrences, schedule(rec).period, schedule(rec).boundary], [8, 3, 3, 'start']);
    noRound(rec.effectSummary); noRound(profile.expiryLabel(rec, live().gameState.combat));
    assert.match(profile.expiryLabel(rec, live().gameState.combat), /0 of 3 recorded, 3 still to come; next at authenticated boundary 2/);
    const startHp = hp(target), expected = oracleAll(3, 0, 2, 'start', 3, 0); assert.deepEqual(expected, [2, 5, 8]);
    const seen = [];
    for (let s = 1; s <= 11; s++) {
      const r = await advance();
      for (const t of ticksOf(r)) {seen.push({ s, ...t });}
      assert.deepEqual(hp(target), startHp, 'a boundary never changes HP');
      assert.deepEqual(pools(source), paid, 'no recurring payment');
    }
    assert.deepEqual(seen.map(t => [t.s, t.occurrence, t.of, t.final]), [[2, 1, 3, false], [5, 2, 3, false], [8, 3, 3, true]]);
    assert.equal(periodic(target).length, 0, 'the last tick ends the instance');
    assert.equal(due().length, 3); assert.deepEqual(due().map(t => t.sequence), [2, 5, 8]); assert.ok(due().every(t => t.live && t.recordId === rec.recordId));
    assert.equal(new Set(due().map(t => t.tickId)).size, 3, 'each tick has its own identity');
    for (const t of due()) {noRound(timing.tickLabel(t));}
    // Resolve all three with physical rolls; HP follows temp-first damage exactly once each.
    await resolve(due()[0], { faces: [5] }); assert.deepEqual(hp(target), { current: 18, temp: 0 });
    await resolve(due()[0], { faces: [1] }); assert.deepEqual(hp(target), { current: 17, temp: 0 });
    await resolve(due()[0], { faces: [6] }); assert.deepEqual(hp(target), { current: 11, temp: 0 });
    assert.equal(due().length, 0); assert.deepEqual(pools(source), paid);
  });

  it('end boundary applied during the target’s own turn: the turn in progress is not counted; every application point matches an independent oracle', async() => {
    await startCombat([pc, source, target, other]); await adopt();
    const routes = [['start', 1, target, 'target-next-start'], ['end', 2, other, 'target-end-count']];
    await admitCreature(periodicRecord({ name: 'Disposable Ember Mark', policy: 'target-next-start', occurrences: null, label: 'Ember Mark' }), source);
    await admitCreature(periodicRecord({ name: 'Disposable Rime Sap', policy: 'target-end-count', occurrences: 2, label: 'Rime Sap', damageType: 'rime' }), alt1);
    await advanceTo(3); // the 'other' creature's own turn is in progress (index 3)
    const one = await cast(source, target); await accept(command(one));
    const two = await cast(alt1, other); await accept(command(two));
    const expect = { [one.approvalId]: oracleAll(4, 3, 2, 'start', 1, 3), [two.approvalId]: oracleAll(4, 3, 3, 'end', 2, 3) };
    assert.deepEqual(expect[one.approvalId], [6]); assert.deepEqual(expect[two.approvalId], [8, 12], 'the end of the turn in progress (seq 4) is not counted');
    const seen = {};
    for (let s = 4; s <= 13; s++) {for (const t of ticksOf(await advance())) {(seen[t.recordId] ||= []).push(seq());}}
    assert.deepEqual(seen, expect);
    assert.equal(periodic(target).length + periodic(other).length, 0);
    void routes;
  });

  it('duplicate and lost-ACK advancement records a tick once; duplicate and lost-ACK resolution applies it once; a second resolution of the same tick is refused', async() => {
    await startCombat([pc, source, target]); await adopt();
    await admitCreature(periodicRecord({ occurrences: 2 })); await accept(command(await cast()));
    await advanceTo(1);
    const c = boundary(); gm.emit('actor_turn_boundary', c); await sleep(80); assert.equal(seq(), 2); // ACK lost
    const again = await ack(gm, 'actor_turn_boundary', c); assert.equal(again.success, true); assert.equal(seq(), 2);
    assert.equal(due().length, 1, 'the replayed boundary records nothing new'); assert.equal(ticksOf(again).length, 1);
    const t = due()[0], start = hp(target);
    const rq = resolveReq(t, { faces: [4] }); gm.emit('actor_periodic_resolve', rq); await sleep(80); // ACK lost
    assert.deepEqual(hp(target), { current: start.current - 1, temp: 0 });
    const replay = await ack(gm, 'actor_periodic_resolve', rq); assert.equal(replay.success, true);
    assert.deepEqual(hp(target), { current: start.current - 1, temp: 0 }, 'replay never applies twice');
    assert.equal(actors.ledger(live()).receipts.filter(x => x.commandId === rq.commandId).length, 1);
    assert.deepEqual((await ack(gm, 'actor_periodic_resolve', rq)).receipt, replay.receipt, 'Check same command returns the original receipt');
    await refused('actor_periodic_resolve', { ...rq, commandId: uuid(), baseCommitSequence: actors.ledger(live()).commitSequence }, 'tick_already_resolved');
    await refused('actor_periodic_resolve', { ...rq, finalAmount: 9 }, 'command_id_conflict');
    // Dismissed ticks are equally closed.
    await advanceTo(5); const last = due()[0]; assert.equal(last.final, true);
    const d = resolveReq(last, { mode: 'dismiss' }); assert.equal((await ack(gm, 'actor_periodic_resolve', d)).success, true);
    await refused('actor_periodic_resolve', resolveReq(last), 'tick_already_resolved');
  });

  it('roll custody and authority: physical/digital rolls are validated, forged totals and wrong dice refuse, a changed amount needs a reason, only the current GM resolves', async() => {
    await startCombat([pc, source, target]); await adopt();
    await admitCreature(periodicRecord({ formula: '2d4+1', occurrences: 2 })); await accept(command(await cast()));
    await advanceTo(2); const t = due()[0]; assert.equal(t.tick.formula, '2d4+1');
    const good = rollFor('2d4+1', [3, 4]);
    await refused('actor_periodic_resolve', resolveReq(t, { roll: { ...good, total: good.total + 1 } }), 'invalid_spell_approval');
    await refused('actor_periodic_resolve', resolveReq(t, { roll: { ...good, dice: [{ sides: 4, faces: [3] }], total: 4 } }), 'periodic_roll_mismatch');
    await refused('actor_periodic_resolve', resolveReq(t, { roll: { ...good, dice: [{ sides: 6, faces: [3, 4] }] } }), 'periodic_roll_mismatch');
    await refused('actor_periodic_resolve', resolveReq(t, { roll: good, amount: 3 }), 'adjustment_reason_required');
    await refused('actor_periodic_resolve', resolveReq(t, { roll: good }), 'turn_gm_required', owner);
    await refused('actor_periodic_resolve', resolveReq(t, { roll: good }), 'turn_gm_required', observer);
    await refused('actor_periodic_resolve', { ...resolveReq(t, { roll: good }), expectedRevision: token(target).state.actorContract.revision - 1 }, 'stale_actor_revision');
    await refused('actor_periodic_resolve', { ...resolveReq(t, { roll: good }), tickId: 'a'.repeat(64) }, 'tick_not_found');
    const digital = { ...good, mode: 'digital' };
    const r = await resolve(t, { roll: digital, amount: 3, reason: 'GM ruling: partial cover at the table' });
    const c = JSON.parse(r.r.receipt.adjudication.chosenResult);
    assert.deepEqual([c.roll.mode, c.roll.total, r.r.receipt.adjudication.finalAmount, c.occurrence, c.of], ['digital', 8, 3, 1, 2]);
    assert.match(r.r.receipt.adjudication.adjustmentReason, /partial cover/);
  });

  it('reload with unresolved ticks: checkpoint rebuild keeps each open tick exactly once, resolution after rebuild applies once and replays its receipt', async() => {
    await startCombat([pc, source, target]); await adopt();
    await admitCreature(periodicRecord({ kind: 'healing', formula: '1d4', occurrences: 3 }));
    token(target).state.currentHp = 10; // wounded creature (fixture HP; the heal itself is authoritative)
    await accept(command(await cast())); await advanceTo(5); assert.equal(due().length, 2);
    const first = await resolve(due()[0], { faces: [3] }); assert.deepEqual(hp(target).current, 13);
    const codec = require('../services/roomCheckpoint'), built = codec.buildCheckpointDocuments({ roomId: room.id, gameState: live().gameState, revision: 1 });
    const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])) }); assert.equal(decoded.ok, true);
    const restored = { ...live(), gameState: { ...decoded.global, maps: decoded.maps, ...codec.deriveRootMirrors(decoded.maps) }, checkpointRevision: 1 }; server.rooms.set(room.id, restored);
    assert.equal(due().length, 1, 'the unresolved tick survives the rebuild once'); assert.equal(due()[0].occurrence, 2);
    assert.deepEqual((await ack(gm, 'actor_periodic_resolve', first.c)).receipt, first.r.receipt, 'the resolved tick replays after rebuild, applying nothing');
    assert.equal(hp(target).current, 13);
    const snap = await ack(gm, 'actor_snapshot', { roomId: room.id }); assert.equal(snap.success, true); assert.equal(snap.combat.effectLifecycle.dueTicks[due()[0].tickId].occurrence, 2, 'a reconnecting GM sees the open tick');
    await resolve(due()[0], { faces: [4] }); assert.equal(hp(target).current, 17);
    await advanceTo(8); assert.equal(due().length, 1); assert.equal(due()[0].final, true); assert.equal(periodic(target).length, 0);
    await resolve(due()[0], { faces: [4] }); assert.equal(hp(target).current, 21);
  });

  it('removal and refresh before resolution: a second periodic instance is refused whole and uncharged; exact GM removal makes the open tick stale and stops later ticks', async() => {
    await startCombat([pc, source, target]); await adopt();
    await admitCreature(periodicRecord({ occurrences: 3 })); await accept(command(await cast()));
    const charged = pools(source);
    const again = await cast(); await refused('actor_consequence', command(again), 'periodic_combination_unresolved');
    assert.deepEqual(pools(source), charged, 'a refused refresh charges nothing'); assert.ok(payments.get(live(), again.approvalId), 'the refused attempt is retained, unconsumed');
    assert.equal((await withdraw(again)).success, true);
    await admitCreature(periodicRecord({ name: 'Disposable Second Stream', label: 'Second Stream', occurrences: 2 }), other);
    const foreign = await cast(other, target); await refused('actor_consequence', command(foreign), 'periodic_combination_unresolved'); assert.equal((await withdraw(foreign)).success, true);
    await advanceTo(2); const rec = periodic(target)[0], t = due()[0];
    await accept(remove(target, rec.recordId)); assert.equal(periodic(target).length, 0);
    await refused('actor_periodic_resolve', resolveReq(t), 'periodic_tick_stale');
    assert.equal(due().length, 1, 'the stale tick stays visible to the GM');
    await resolve(t, { mode: 'dismiss' }); assert.equal(due().length, 0);
    for (let s = 3; s <= 9; s++) {assert.equal(ticksOf(await advance()).length, 0, 'a removed instance records no further ticks');}
    // After the removal a new cast is the only way back, and it is a fresh full schedule.
    const fresh = await cast(); await accept(command(fresh));
    assert.equal(periodic(target).length, 1); assert.equal(schedule(periodic(target)[0]).dueSequence, seq() + 2 + 6);
  });

  it('stale/recreated actors and retired combat: a recreated target or a retired clock refuses application and keeps the tick visible for dismissal; combat end records no further ticks', async() => {
    await startCombat([pc, source, target]); await adopt();
    await admitCreature(periodicRecord({ occurrences: 3 })); await accept(command(await cast()));
    await advanceTo(2); const t = due()[0], rec = periodic(target)[0];
    const pending = resolveReq(t), contract = token(target).state.actorContract, saved = contract.instanceId; contract.instanceId = uuid(); // recreated incarnation
    await refused('actor_periodic_resolve', pending, 'periodic_tick_stale');
    contract.instanceId = saved;
    const order = actors.clone(live().gameState.combat.turnOrder); live().gameState.combat.turnOrder.reverse();
    assert.equal(due()[0].live, false, 'a retired clock shows its tick as not resolvable automatically');
    await refused('actor_periodic_resolve', resolveReq(t), 'periodic_tick_retired');
    live().gameState.combat.turnOrder = order; assert.equal(due()[0].live, true);
    await resolve(t, { faces: [2] });
    const startHp = hp(target);
    assert.notEqual((await ack(gm, 'combat_ended', { roomId: room.id })).success, false);
    assert.equal(due().length, 0); assert.equal(periodic(target).length, 1);
    assert.match(profile.expiryLabel(rec, live().gameState.combat), /not tracked by the current turn clock; no further ticks are recorded automatically; GM removes this exact instance/);
    await startCombat([pc, source, target]); await adopt();
    for (let s = 1; s <= 9; s++) {assert.equal(ticksOf(await advance()).length, 0, 'no re-arming on a new clock');}
    assert.deepEqual(hp(target), startHp);
    await accept(remove(target, rec.recordId));
  });

  it('writer failure is atomic for both the boundary that records ticks and the resolution that applies one; capacity refuses before anything changes', async() => {
    await startCombat([pc, source, target]); await adopt();
    await admitCreature(periodicRecord({ occurrences: 2 })); await accept(command(await cast())); await advanceTo(1);
    const admit = writer.admitConsequence; live().isPermanent = true;
    writer.admitConsequence = () => ({ queued: false, code: 'm5_writer_refusal' });
    await refused('actor_turn_boundary', boundary(), 'm5_writer_refusal'); assert.equal(seq(), 1); assert.equal(due().length, 0);
    writer.admitConsequence = admit; await advance(); assert.equal(due().length, 1);
    writer.admitConsequence = () => ({ queued: false, code: 'm5_writer_refusal' });
    await refused('actor_periodic_resolve', resolveReq(due()[0]), 'm5_writer_refusal'); assert.equal(due().length, 1, 'the obligation is kept');
    writer.admitConsequence = admit; live().isPermanent = false;
    await resolve(due()[0], { faces: [3] }); assert.equal(due().length, 0);
    // Capacity: a boundary that would exceed the open-tick limit is refused whole.
    await advanceTo(4); const lc = () => live().gameState.combat.effectLifecycle;
    for (let i = 0; i < 64; i++) {lc().dueTicks[`${i}`.padStart(64, 'f')] = { tickId: `${i}`.padStart(64, 'f'), combatId: lc().id, sequence: 0, occurrence: 1, of: 1, final: true, ref: target, recordId: uuid(), recordHash: 'x', label: 'filler', tick: { kind: 'healing', formula: '1d4' } };}
    await refused('actor_turn_boundary', boundary(), 'periodic_tick_capacity'); assert.equal(seq(), 4);
    lc().dueTicks = {}; await advance(); assert.equal(due().length, 1);
  });

  it('final boundary: the last tick is recorded in the same boundary that ends the instance and is still resolvable; healing caps at max; a target at 0 HP is refused for the GM', async() => {
    await startCombat([pc, source, target]); await adopt();
    await admitCreature(periodicRecord({ kind: 'healing', formula: '1d8', policy: 'target-next-end', occurrences: null, label: 'Mending Spore' }));
    await accept(command(await cast()));
    const r = await advanceTo(3); assert.deepEqual(chosen(r.r).expired, [periodic(target).length ? null : due()[0].recordId].filter(Boolean));
    assert.equal(periodic(target).length, 0); assert.equal(due().length, 1); assert.equal(due()[0].final, true); assert.equal(due()[0].of, 1);
    token(target).state.currentHp = 28; await resolve(due()[0], { faces: [8] }); assert.deepEqual(hp(target), { current: 30, temp: 3 }, 'healing is capped at max');
    await admitCreature(periodicRecord({ name: 'Disposable Gnaw', label: 'Gnaw', occurrences: 2 }));
    await accept(command(await cast())); await advanceTo(5);
    token(target).state.currentHp = 0; token(target).state.tempHealth = 0;
    await refused('actor_periodic_resolve', resolveReq(due()[0]), 'periodic_target_down');
    await resolve(due()[0], { mode: 'dismiss', reason: 'Creature already down; GM ruling at the table' });
    token(target).state.currentHp = 20;
  });

  it('privacy and payment: observers see only allow-listed tick facts, never source resources or private evidence; the owner PC route pays once at cast; a PC target is refused', async() => {
    await startCombat([pc, source, target]); await adopt();
    const ref = await admitPc(periodicRecord({ name: 'Disposable Ashen Hex', label: 'Ashen Hex', occurrences: 2, ap: 1, mana: 3 }));
    const before = pools(pc), b = pcApproval(ref); await approve(b);
    await accept(command(b, { res: { ...resolution({ timing: b.effectTerms.timing }), evidence: 'PRIVATE GM save ruling' } }));
    const paid = pools(pc); assert.equal(paid.mana.current + paid.mana.temp, before.mana.current + before.mana.temp - 3);
    await advanceTo(2);
    const view = await ack(observer, 'actor_snapshot', { roomId: room.id }); assert.equal(view.success, true);
    const open = Object.values(view.combat.effectLifecycle.dueTicks || {}); assert.equal(open.length, 1, 'observers see that a tick is due');
    assert.ok(!JSON.stringify(view.combat).includes('PRIVATE')); assert.ok(!JSON.stringify(open).includes(pc.ownerUid));
    await resolve(due()[0], { faces: [2] });
    await advanceTo(5);
    const t = due()[0], keysOf = Object.keys(t).filter(k => k !== 'live').sort();
    assert.deepEqual(keysOf, ['combatId', 'effectDefinition', 'final', 'label', 'occurrence', 'of', 'recordHash', 'recordId', 'ref', 'rollPolicy', 'sequence', 'tick', 'tickId']);
    assert.ok(!JSON.stringify(t).includes(pc.ownerUid), 'no source PC identity in the obligation'); assert.ok(!JSON.stringify(live().gameState.combat).includes('PRIVATE'));
    const res = await resolve(t, { faces: [1] }), pub = actors.publicReceipt(live().gameState.actorConsequences.receipts.at(-1));
    assert.ok(!JSON.stringify(pub).includes('PRIVATE')); assert.equal(pub.source, undefined); assert.equal(pub.actors.length, 1, 'only the target actor');
    assert.ok(!JSON.stringify(pub).includes(pc.ownerUid), 'the resolution receipt carries no source PC identity or pools'); assert.equal(pub.actors[0].ref.tokenId, target.tokenId); void res;
    assert.deepEqual(pools(pc), paid, 'no per-tick payment');
    // A player character target stays manual.
    const pcTarget = await admitPc(periodicRecord({ name: 'Disposable Self Brand', label: 'Self Brand', occurrences: 2 }));
    await admitCreature(periodicRecord({ name: 'Disposable Creature Brand', label: 'Creature Brand', occurrences: 2 }), other);
    const onPc = creatureAttempt({ s: other, t: pc });
    const r = await ack(gm, 'actor_spell_prepare_creature', onPc); assert.equal(r.success, false, JSON.stringify(r));
    assert.equal(r.code, 'pc_target_effect_unsupported', JSON.stringify(r));
    const ownerOnPc = pcApproval(pcTarget, { t: pc }); const r2 = await ack(owner, 'actor_spell_approve', ownerOnPc); assert.equal(r2.success, false, JSON.stringify(r2));
    assert.equal(r2.code, 'unsupported_effect_target', JSON.stringify(r2)); // the owner PC as its own target is refused before any periodic rule
  });

  it('review F1: an OPEN tick survives combat end, restart, reset and re-adoption as a visible dismiss-only retired tick; it is never applied or erased', async() => {
    await startCombat([pc, source, target]); await adopt();
    await admitCreature(periodicRecord({ occurrences: 3 })); await accept(command(await cast()));
    await advanceTo(2); const t = due()[0], startHp = hp(target);
    assert.notEqual((await ack(gm, 'combat_ended', { roomId: room.id })).success, false);
    assert.equal(due().length, 1, 'still listed after combat end'); assert.equal(due()[0].tickId, t.tickId); assert.equal(due()[0].live, false);
    await refused('actor_periodic_resolve', resolveReq(t), 'periodic_tick_retired');
    await startCombat([pc, source, target]); assert.equal(due().length, 1, 'kept across a restart');
    await adopt(); assert.equal(due().length, 1, 'kept across re-adoption of a new clock'); assert.equal(due()[0].live, false);
    gm.emit('gm_action', { roomId: room.id, action: 'reset_combat' }); await sleep(80); assert.equal(due().length, 1, 'kept across reset_combat');
    assert.deepEqual(hp(target), startHp, 'a retired tick never applies HP');
    const d = resolveReq(t, { mode: 'dismiss' }); const r = await ack(gm, 'actor_periodic_resolve', d); assert.equal(r.success, true, JSON.stringify(r));
    assert.equal(due().length, 0); assert.equal(live().gameState.combat.retiredPeriodicTicks, undefined);
    assert.deepEqual((await ack(gm, 'actor_periodic_resolve', d)).receipt, r.receipt, 'dismissal replays');
    await refused('actor_periodic_resolve', { ...d, commandId: uuid(), baseCommitSequence: actors.ledger(live()).commitSequence }, 'tick_not_found');
    // Roster change then re-adoption while a tick is open in the live lifecycle.
    await startCombat([pc, source, target]); await adopt(); await accept(remove(target, periodic(target)[0].recordId));
    await admitCreature(periodicRecord({ name: 'Disposable Rot Two', label: 'Rot Two', occurrences: 2 }), other); await accept(command(await cast(other, target)));
    await advanceTo(2); assert.equal(due().filter(x => x.live).length, 1);
    await ack(gm, 'combat_ended', { roomId: room.id }); await startCombat([pc, target, source]); await adopt();
    assert.equal(due().length, 1); assert.equal(due()[0].live, false);
    const imported = actors.clone(live().gameState); actors.preserveImportedActorMetadata(imported);
    assert.equal(imported.combat.retiredPeriodicTicks, undefined, 'an untrusted local import cannot carry retired ticks back in');
  });

  it('review F2/F8: a generic GM command cannot forge a tick result; healing on a 0-HP target is refused; two concurrent resolutions of one tick apply once', async() => {
    await startCombat([pc, source, target]); await adopt();
    await admitCreature(periodicRecord({ kind: 'healing', formula: '1d4', occurrences: 3 })); await accept(command(await cast()));
    await advanceTo(2); const t = due()[0];
    const forged = { ...base(), actors: [{ ref: target, expectedRevision: token(target).state.actorContract.revision, finalResources: { hp: { current: 25, temp: 3 } } }],
      adjudication: { definitionId: timing.PERIODIC_DEFINITION_ID, definitionVersionOrHash: timing.PERIODIC_DEFINITION_ID, finalAmount: 5, adjustmentReason: '', chosenResult: JSON.stringify({ tickId: t.tickId }) } };
    await refused('actor_consequence', forged, 'periodic_tick_route_required');
    token(target).state.currentHp = 0;
    await refused('actor_periodic_resolve', resolveReq(t), 'periodic_target_down');
    token(target).state.currentHp = 10;
    const a = resolveReq(t, { faces: [2] }), b = resolveReq(t, { faces: [3] });
    const [ra, rb] = await Promise.all([ack(gm, 'actor_periodic_resolve', a), ack(gm, 'actor_periodic_resolve', b)]);
    assert.equal([ra, rb].filter(r => r.success).length, 1, JSON.stringify([ra.code, rb.code]));
    assert.ok([12, 13].includes(hp(target).current), 'exactly one tick applied');
    assert.equal(due().length, 0);
  });

  it('authoring and admission: only explicit boundary + count + tick + per-tick roll maps; catalogue round/turn fields, mixed-kind immediate parts, manual timing and tampered terms stay manual', async() => {
    const ok = pure.definitionFromWizard(periodicRecord(), { roomId: room.id, definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(ok.ok, true, JSON.stringify(ok));
    assert.deepEqual(ok.definition.effects, { direct: null, condition: { kind: 'periodic', tick: { kind: 'damage', formula: '1d6', damageTypes: ['blight'] }, label: 'Wasting Brand', tickRoll: 'each-tick' } });
    assert.deepEqual(ok.definition.timing, { expiryPolicy: 'target-start-count', durationText: 'While the brand smoulders', authoredDuration: null, gmNote: 'GM resolves eligibility and range before confirming success.', occurrences: 3 });
    const compiled = definitions.compileDefinition ? definitions.compileDefinition(ok.definition) : null;
    if (compiled) { assert.equal(compiled.ok, true); assert.equal(compiled.descriptor.compilerVersion, 'p14-m5-periodic-1'); }
    noRound(pure.definitionSummary(ok.definition));
    const refusals = {
      manual: periodicRecord({ policy: 'gm-manual', occurrences: null }),
      noRollChoice: periodicRecord({ tickRoll: null }),
      castRoll: periodicRecord({ tickRoll: 'once-at-cast' }),
      noType: periodicRecord({ damageType: null }),
      badFormula: periodicRecord({ formula: '1d8+intelligence' }),
      healType: periodicRecord({ kind: 'healing', extra: d => { d.controlConfig.authoredCondition.periodicDamageType = 'blight'; } }),
      self: periodicRecord({ restriction: 'self' }),
      eleven: periodicRecord({ occurrences: 11 }),
      // M5 composition admits a SAME-kind immediate part (p14m5Composition); an immediate part of the other kind stays manual.
      immediateMixed: periodicRecord({ extra: d => { d.effectTypes = ['healing', 'control']; d.healingConfig = { healingType: 'direct', formula: '2d4', resolution: 'DICE' }; } }),
      schoolConflict: periodicRecord({ extra: d => { d.typeConfig.school = 'ember'; } }),
      catalogueDot: periodicRecord({ extra: d => { d.effectTypes = ['damage']; delete d.controlConfig; d.damageConfig = { damageType: 'direct', elementType: 'blight', formula: '6d8', resolution: 'DICE', hasDotEffect: true, dotConfig: { dotFormula: '1d8', duration: 5, tickFrequency: 'turn' } }; } }),
      movementMix: periodicRecord({ extra: d => { d.controlConfig.authoredCondition.movementFeet = -10; } }),
      stray: periodicRecord({ extra: d => { d.controlConfig.authoredCondition = { ...d.controlConfig.authoredCondition, effect: 'stunned', periodicKind: undefined, periodicFormula: undefined, label: undefined, tickRoll: 'each-tick', periodicDamageType: undefined }; } })
    };
    for (const [name, record] of Object.entries(refusals)) {
      const clean = JSON.parse(JSON.stringify(record)); clean.authoredDraft = JSON.parse(JSON.stringify(record.authoredDraft));
      const r = pure.definitionFromWizard(clean, { roomId: room.id, definitionVersion: 1, classId: 'arcanoneer' });
      assert.equal(r.ok, false, `${name} must stay manual: ${JSON.stringify(r)}`);
    }
    // Tampered admitted terms refuse at admission/compile.
    for (const tamper of [d => { d.effects.condition.tickRoll = 'once-at-cast'; }, d => { d.effects.direct = { kind: 'healing', formula: '1d6' }; }, d => { d.timing.expiryPolicy = 'gm-manual'; delete d.timing.occurrences; },
      d => { d.effects.condition.tick.damageTypes = ['blight', 'ember']; }, d => { d.effects.condition.tick.formula = '1d6+intelligence'; }]) {
      const d = actors.clone(ok.definition); tamper(d);
      if (definitions.compileDefinition) {assert.equal(definitions.compileDefinition(d).ok, false, JSON.stringify(d.effects));}
    }
    // The P7 writer refuses a periodic record edited into a generic add.
    await startCombat([pc, source, target]); await adopt();
    await admitCreature(periodicRecord()); const a = await cast(); const forged = command(a); forged.approval = undefined; delete forged.approval;
    const rec = forged.actors[1].conditions[0].record; const generic = { ...base(), actors: [{ ref: target, expectedRevision: token(target).state.actorContract.revision, conditions: [{ op: 'add', recordId: rec.recordId, record: rec }] }],
      adjudication: { definitionId: 'gm-correction', definitionVersionOrHash: 'gm-correction', finalAmount: 0, adjustmentReason: '', chosenResult: 'GM add' } };
    await refused('actor_consequence', generic, 'authored_effect_approval_required');
  });
});
