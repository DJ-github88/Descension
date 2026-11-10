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

describe('P14-M5 composition + M4A attribute formula in the immediate part — registered production handlers', function() {
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
    map().characterTokens.pc = { id: 'pc', ownerUserId: ownerUid, character: { id: 'c', class: 'Arcanoneer', stats: { intelligence: 14, spirit: 9 }, health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, tempMana: 2, tempActionPoints: 1 }, state: { conditions: [] } };
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

  // ---- M5 composition + M4A helpers ---------------------------------------------------------------------------
  /** Disposable Wizard bundle: immediate part with an M4A attribute formula + one periodic tick of the same kind. */
  function formulaRecord({ name = 'Disposable Mind Brand', kind = 'damage', nowFormula = kind === 'damage' ? '2d8 + intelligence/3' : '1d4 + spirit/2', formula = '1d6', occurrences = 3, ...rest } = {}) {
    return periodicRecord({ name, kind, formula, occurrences, ...rest, extra: d => {
      d.effectTypes = [kind, 'control'];
      if (kind === 'damage') {d.damageConfig = { damageType: 'direct', elementType: 'blight', formula: nowFormula, resolution: 'DICE' };}
      else {d.healingConfig = { healingType: 'direct', formula: nowFormula, resolution: 'DICE' };}
      if (rest.extra) {rest.extra(d);}
    } });
  }
  const attested = () => ({ intelligence: token(pc).character.stats.intelligence, spirit: token(pc).character.stats.spirit });
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
  const privateRes = b => ({ ...resolution({ timing: b.effectTerms.timing }), evidence: 'PRIVATE GM save ruling' });
  async function formulaCast(ref, opts) { const b = formulaApproval(ref, opts); await approve(b); return b; }
  const receiptsFor = commandId => actors.ledger(live()).receipts.filter(x => x.commandId === commandId);
  const world = () => ({ hp: hp(target), pools: pools(pc), periodic: actors.clone(periodic(target)), receipts: actors.ledger(live()).receipts.length });

  it('effective-attribute calculation: 2d8 + intelligence/3 at INT 14 rounds down to +4; payment once, immediate HP and the periodic instance in one receipt; ticks roll on their own dice', async() => {
    await startCombat([pc, source, target]); await adopt();
    const rec = formulaRecord(), compiled = pure.definitionFromWizard(actors.clone(rec), { roomId: room.id, definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(compiled.ok, true, JSON.stringify(compiled));
    assert.deepEqual(compiled.definition.effects.direct, { kind: 'damage', formula: '2d8 + intelligence/3', damageTypes: ['blight'] });
    assert.equal(definitions.compileDefinition(compiled.definition).descriptor.compilerVersion, 'p14-m5-composition-formula-1');
    const ref = await admitPc(rec), before = pools(pc), hp0 = hp(target);
    const b = await formulaCast(ref, { faces: [[5, 6]] });
    assert.deepEqual(b.rollAttributes, { intelligence: 14 }); assert.equal(b.roll.constant, 4, 'INT 14 ÷ 3 rounded down'); assert.equal(b.roll.total, 15);
    assert.match(b.roll.reading, /^2d8 \+ intelligence\/3 → 2d8 \+ 4/);
    const c = command(b, { res: privateRes(b) }), r = await accept(c);
    assert.equal(receiptsFor(c.commandId).length, 1);
    const paid = pools(pc); assert.equal(paid.mana.current + paid.mana.temp, before.mana.current + before.mana.temp - 2); assert.equal(paid.ap.current + paid.ap.temp, before.ap.current + before.ap.temp - 1);
    assert.deepEqual(hp(target), { current: hp0.current - (15 - hp0.temp), temp: 0 }, 'temp first, then HP');
    assert.equal(periodic(target).length, 1); assert.equal(due().length, 0);
    const result = chosen(r); assert.equal(result.roll.total, 15); assert.deepEqual(result.roll.dice, [{ sides: 8, faces: [5, 6] }]);
    const inst = periodic(target)[0]; assert.equal(inst.overTimeFormula, '1d6'); assert.ok(!JSON.stringify(inst).includes('intelligence'), 'tick terms never carry the immediate formula');
    await advanceTo(2); const t = due()[0]; assert.deepEqual(t.tick, { kind: 'damage', formula: '1d6', damageType: 'blight' });
    for (const roll of [b.roll, { ...b.roll, dice: [{ sides: 6, faces: [5] }], constant: 0, reading: '1d6', total: 9 }]) {
      const st = actors.clone(live().gameState), x = await ack(gm, 'actor_periodic_resolve', resolveReq(t, { roll }));
      assert.equal(x.success, false); assert.ok(['periodic_roll_mismatch', 'invalid_spell_approval'].includes(x.code), JSON.stringify(x)); assert.deepEqual(live().gameState, st);
    }
    const afterCast = hp(target); await resolve(t, { faces: [3] }); assert.equal(hp(target).current, afterCast.current - 3);
    assert.deepEqual(pools(pc), paid, 'no recurring payment');
    // Privacy: the owner-attested scores are in the cast receipt for the GM; observers get the public projection only.
    const view = await ack(observer, 'actor_snapshot', { roomId: room.id }); assert.ok(!JSON.stringify(view).includes('PRIVATE'));
    assert.ok(!JSON.stringify(view.combat.effectLifecycle.dueTicks || {}).includes(pc.ownerUid));
  });

  it('healing + healing: 1d4 + spirit/2 at SPI 9 adds floor(4.5) = 4, capped at max; healing ticks roll separately', async() => {
    await startCombat([pc, source, target, other]); await adopt();
    const ref = await admitPc(formulaRecord({ name: 'Disposable Spirit Bloom', kind: 'healing', label: 'Spirit Bloom', formula: '1d4', occurrences: 2, restriction: 'ally' }));
    token(other).state.currentHp = 10;
    const b = await formulaCast(ref, { t: other, faces: [[3]] }); assert.equal(b.roll.constant, 4); assert.equal(b.roll.total, 7);
    await accept(command(b, { res: privateRes(b) })); assert.deepEqual(hp(other), { current: 17, temp: 3 });
    token(other).state.currentHp = 28; const b2 = await formulaCast(ref, { t: target, faces: [[4]] });
    await accept(command(b2, { res: privateRes(b2) })); assert.deepEqual(hp(target), { current: Math.min(30, 20 + 8), temp: 3 });
    assert.equal(periodic(other).length, 1); assert.equal(periodic(target).length, 1);
    await advanceTo(3); const t = due().find(x => x.ref.tokenId === 'other'); assert.ok(t); assert.equal(t.tick.formula, '1d4');
    await resolve(t, { faces: [4] }); assert.equal(hp(other).current, 30, 'healing tick capped at max');
  });

  it('forged formula, constant, reading, inputs or binding refuse whole with nothing charged, applied or installed', async() => {
    await startCombat([pc, source, target]); await adopt();
    const ref = await admitPc(formulaRecord());
    const cases = {
      constant: a => { a.roll.constant++; a.roll.total++; }, reading: a => { a.roll.reading = '2d8 + 5'; }, diceShape: a => { a.roll.dice = [{ sides: 8, faces: [5] }]; a.roll.total = 9; },
      missingInput: a => { delete a.rollAttributes; }, extraInput: a => { a.rollAttributes.strength = 10; }, nullInput: a => { a.rollAttributes.intelligence = null; },
      inputConstantMismatch: a => { a.rollAttributes.intelligence = 20; }, noBinding: a => { delete a.formulaSourceHash; }, staleBinding: a => { a.formulaSourceRevision += 1; },
      forgedHash: a => { a.formulaSourceHash = 'a'.repeat(64); }, plainFormulaTerms: a => { a.effectTerms.direct.formula = '2d8+4'; }, forgedTotal: a => { a.roll.total += 3; }
    };
    const codes = {};
    for (const [name, change] of Object.entries(cases)) {
      const a = formulaApproval(ref, { faces: [[5, 6]] }); change(a); const before = actors.clone(live().gameState), r = await ack(owner, 'actor_spell_approve', a);
      assert.equal(r.success, false, `${name}: ${JSON.stringify(r)}`); assert.deepEqual(live().gameState, before, name); codes[name] = r.code;
    }
    assert.deepEqual(codes, { constant: 'authored_roll_mismatch', reading: 'authored_roll_mismatch', diceShape: 'authored_roll_mismatch', missingInput: 'invalid_spell_approval', extraInput: 'authored_roll_mismatch',
      nullInput: 'authored_roll_mismatch', inputConstantMismatch: 'authored_roll_mismatch', noBinding: 'invalid_spell_approval', staleBinding: 'owner_reapproval_required', forgedHash: 'owner_reapproval_required',
      plainFormulaTerms: 'invalid_consequence', forgedTotal: 'invalid_spell_approval' });
    // The GM command must match the bound amount and HP; a forged HP result refuses.
    const b = await formulaCast(ref, { faces: [[5, 6]] }), c = command(b, { res: privateRes(b) });
    c.actors[1].finalResources.hp.current -= 5; const st = world();
    const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, false); assert.equal(r.code, 'approval_mismatch', JSON.stringify(r)); assert.deepEqual(world(), st);
  });

  it('stale attribute approval: a caster score change after approval refuses the cast (no revision bump needed); reapproval with the retained immediate dice revalues it', async() => {
    await startCombat([pc, source, target]); await adopt();
    const ref = await admitPc(formulaRecord()), a = await formulaCast(ref, { faces: [[2, 7]] }); assert.equal(a.roll.total, 13);
    token(pc).character.stats.intelligence = 17; // the owner's sheet changes; the declared score in the approval is now stale
    const st = world(), r = await ack(gm, 'actor_consequence', command(a, { res: privateRes(a) }));
    assert.equal(r.success, false); assert.equal(r.code, 'owner_reapproval_required', JSON.stringify(r)); assert.deepEqual(world(), st, 'nothing paid, applied or installed');
    const closed = await withdraw(a); assert.equal(closed.code, 'approval_owner_reapproval_required', 'the stale consent is already closed by the server (M4A behaviour)');
    const b = await formulaCast(ref, { faces: a.roll.dice.map(g => g.faces) });
    assert.deepEqual(b.roll.dice, a.roll.dice, 'the same retained immediate faces'); assert.equal(b.roll.constant, 5); assert.equal(b.roll.total, 14);
    await accept(command(b, { res: privateRes(b) })); assert.equal(periodic(target).length, 1);
    assert.equal(due().length, 0, 'reapproval never records or borrows a tick roll');
  });

  it('caster sheet change across the authority await cannot install a partial consequence', async() => {
    await startCombat([pc, source, target]); await adopt();
    const ref = await admitPc(formulaRecord()), a = await formulaCast(ref, { faces: [[4, 4]] }), c = command(a, { res: privateRes(a) });
    const original = server.authorityService.assertCurrent; let release, reached, hold = true;
    const gate = new Promise(res => { release = res; }), entered = new Promise(res => { reached = res; });
    server.authorityService.assertCurrent = async(...args) => { if (hold) { hold = false; reached(); await gate; } return original(...args); };
    const st = world(), pending = ack(gm, 'actor_consequence', c); await entered;
    token(pc).character.stats.intelligence = 11; release();
    const r = await pending; server.authorityService.assertCurrent = original;
    assert.equal(r.success, false, JSON.stringify(r)); assert.equal(r.code, 'owner_reapproval_required', 'the caster snapshot is re-checked after the await (review F1)'); assert.deepEqual(world(), st);
  });

  it('writer failure is atomic and exact-command replay applies payment, HP and installation once', async() => {
    await startCombat([pc, source, target]); await adopt();
    const ref = await admitPc(formulaRecord({ occurrences: 2 })), b = await formulaCast(ref, { faces: [[8, 8]] }), c = command(b, { res: privateRes(b) });
    const admit = writer.admitConsequence; live().isPermanent = true; writer.admitConsequence = () => ({ queued: false, code: 'm5f_writer_refusal' });
    const state = actors.clone(live().gameState), r0 = await ack(gm, 'actor_consequence', c);
    assert.equal(r0.code, 'm5f_writer_refusal', JSON.stringify(r0)); assert.deepEqual(live().gameState, state); assert.equal(receiptsFor(c.commandId).length, 0);
    assert.deepEqual(payments.get(live(), b.approvalId).approval.roll, b.roll, 'the approval and its immediate faces are retained');
    writer.admitConsequence = admit; live().isPermanent = false;
    gm.emit('actor_consequence', c); await sleep(120); // ACK lost
    const once1 = world(); assert.equal(once1.periodic.length, 1);
    const replay = await ack(gm, 'actor_consequence', c); assert.equal(replay.success, true);
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, replay.receipt); assert.deepEqual(world(), once1, 'no second payment, HP change or installation');
    assert.equal(receiptsFor(c.commandId).length, 1);
    await refused('actor_consequence', { ...c, adjudication: { ...c.adjudication, finalAmount: 1, adjustmentReason: 'changed' } }, 'command_id_conflict');
  });

  it('bounded scope: plain-dice composition is unchanged; missing-health, deterministic, attribute/DR-rider bundles, mixed kinds and creature casters stay manual', async() => {
    const opts = { roomId: room.id, definitionVersion: 1, classId: 'arcanoneer' };
    const plain = pure.definitionFromWizard(actors.clone(formulaRecord({ nowFormula: '1d6+2' })), opts).definition;
    assert.equal(definitions.compileDefinition(plain).descriptor.compilerVersion, 'p14-m5-composition-1', 'plain-dice composition keeps its compiler identity');
    for (const [name, rec] of Object.entries({
      missingHealth: formulaRecord({ nowFormula: '2d8 + caster_missing_health/4' }), deterministic: formulaRecord({ nowFormula: 'intelligence/3' }), spacedPlain: formulaRecord({ nowFormula: '2d8 + 3' }),
      mixed: formulaRecord({ extra: d => { d.controlConfig.authoredCondition.periodicKind = 'healing'; delete d.controlConfig.authoredCondition.periodicDamageType; } }),
      attributeBundle: wizardRecord({ direct: 'damage', extra: d => { d.damageConfig.formula = '2d8 + intelligence/3'; d.controlConfig.authoredCondition = { ...d.controlConfig.authoredCondition, effect: 'attribute', attribute: 'agility', attributeAmount: -2, label: 'Leaden' }; } }) })) {
      const r = pure.definitionFromWizard(actors.clone(rec), opts); assert.equal(r.ok, false, `${name} must stay manual: ${JSON.stringify(r)}`);
    }
    // Formula riders (2026-11-08): a scaled immediate part next to a Stunned effect is now its own route (p14RiderFormula.production.test.js).
    const stunned = pure.definitionFromWizard(actors.clone(wizardRecord({ direct: 'damage', extra: d => { d.damageConfig.formula = '2d8 + intelligence/3'; } })), opts);
    assert.equal(stunned.ok, true, JSON.stringify(stunned)); assert.equal(definitions.compileDefinition(stunned.definition).descriptor.compilerVersion, 'p14-a10-effect-formula-1');
    const ok = pure.definitionFromWizard(actors.clone(formulaRecord()), opts).definition;
    for (const tamper of [d => { d.effects.condition = { kind: 'attribute', attribute: 'agility', amount: -2, label: 'Leaden' }; d.timing.expiryPolicy = 'target-next-end'; delete d.timing.occurrences; }, d => { d.effects.direct.formula = '2d8 + caster_missing_health/4'; }, d => { d.effects.direct.formula = 'intelligence/3'; }]) {
      const d = actors.clone(ok); tamper(d); assert.equal(definitions.compileDefinition(d).ok, false, JSON.stringify(d.effects));
    }
    await startCombat([pc, source, target]); await adopt();
    token(source).authoredAbility.record = formulaRecord({ name: 'Disposable Creature Mind Brand' });
    await refused('actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, source, expectedSourceRevision: token(source).state.actorContract.revision, definitionVersion: 1 }, 'unsupported_source_route');
    // Self-target is refused before any periodic rule; a DIFFERENT primary PC target by the existing consent classification (review F2).
    const ref = await admitPc(formulaRecord()), own = formulaApproval(ref, { t: pc, faces: [[1, 1]] }), r = await ack(owner, 'actor_spell_approve', own);
    assert.equal(r.success, false); assert.equal(r.code, 'unsupported_effect_target', JSON.stringify(r));
    live().gameState.maps.default.characterTokens.pc2 = { id: 'pc2', ownerUserId: ownerUid, character: { id: 'c2', class: 'Arcanoneer', stats: { intelligence: 10 }, health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, tempMana: 0, tempActionPoints: 0 }, state: { conditions: [] } };
    server.setCharacterOwner('c2', ownerUid);
    const bound = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc2', ownerUid, characterId: 'c2' }, snapshotHash: actors.hash(live().gameState.maps.default.characterTokens.pc2) });
    assert.equal(bound.success, true, JSON.stringify(bound));
    const other2 = formulaApproval(ref, { t: bound.ref, faces: [[1, 1]] }), st2 = actors.clone(live().gameState), r2 = await ack(owner, 'actor_spell_approve', other2);
    assert.equal(r2.success, false); assert.equal(r2.code, 'pc_target_effect_unsupported', JSON.stringify(r2)); assert.deepEqual(live().gameState, st2);
  });
});
