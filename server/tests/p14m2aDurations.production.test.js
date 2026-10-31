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
  if (extra) extra(d);
  return { ...actors.clone(d), authoredDraft: d, authoredDefinitionId: uuid() };
}
const rollFor = (formula, faces) => { const r = pure.readFormula(formula); const dice = [{ sides: r.dice[0].sides, faces }]; return { mode: 'physical', dice, constant: r.constant, reading: r.reading, total: faces.reduce((a, b) => a + b, r.constant) }; };

describe('P14-M2A explicit multi-turn durations — registered production handlers', function() {
  this.timeout(20000);
  let server, room, gm, owner, observer, writer, source, target, other, alt1, alt2, pc, ownerUid;
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer }); await server.start();
    for (const e of ['actor_bind', 'actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_revoke', 'actor_spell_prepare_creature', 'actor_spell_approve',
      'actor_spell_withdraw', 'actor_turn_boundary', 'combat_started', 'combat_ended', 'actor_spell_list']) server.setEventLimits(e, { maxPerMinute: 4000, maxPerSecond: 4000 });
    const gmUid = server.nextUserId(); ownerUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid); server.registerAuthToken('owner', ownerUid); server.registerAuthToken('observer', server.nextUserId());
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: gmUid });
    for (const role of ['owner', 'observer']) { const s = server.connect({ token: role }); await once(s, 'connect'); const j = once(s, 'room_joined'); s.emit('join_room', { roomId: room.id, playerName: role, password: '' }); await j; if (role === 'owner') owner = s; else observer = s; }
    server.setCharacterOwner('c', ownerUid);
    const map = () => room.gameState.maps.default; // each install replaces gameState
    for (const id of ['source', 'target', 'other', 'alt1', 'alt2']) {
      const t = { id, name: id, creatureId: 'disposable', stats: { maxHp: 30, maxMana: 20, maxAP: 10, speed: 30 }, authoredAbility: { schemaVersion: 1, record: wizardRecord(), librarySpellId: null },
        state: { currentHp: 20, currentMana: 20, currentActionPoints: 10, tempHealth: 3, tempMana: 2, tempActionPoints: 1, conditions: [] } };
      map().tokens[id] = t;
      const r = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: id }, snapshotHash: actors.hash(t) });
      assert.equal(r.success, true, JSON.stringify(r)); if (id === 'source') source = r.ref; else if (id === 'target') target = r.ref; else if (id === 'other') other = r.ref; else if (id === 'alt1') alt1 = r.ref; else alt2 = r.ref;
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
    for (const p of ['ap', 'mana']) if (a.price[p]) pay[p] = payments.tempFirst(pools[p].current, pools[p].temp, a.price[p]);
    if (!Object.keys(pay).length) pay.ap = payments.tempFirst(pools.ap.current, pools.ap.temp, 0);
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
  async function refused(event, data, code, socket = gm) { const before = actors.clone(live().gameState), r = await ack(socket, event, data); assert.equal(r.success, false, JSON.stringify(r)); if (code) assert.equal(r.code, code, JSON.stringify(r)); assert.deepEqual(live().gameState, before); return r; }
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
  async function advanceTo(n) { let last = null; while (seq() < n) last = await advance(); return last; }
  const progress = rec => timing.progress(rec, live().gameState.combat);
  // Independent oracle: walk the roster one authenticated transition at a time and collect the target's boundaries.
  // The end of a turn already in progress is not counted (A10 strictly-next rule, inherited unchanged).
  function oracle(R, i, t, boundary, N, s) {
    const events = []; let idx = i;
    for (let k = 1; events.length < N + 1; k++) { if (boundary === 'start' ? (idx + 1) % R === t : idx === t) events.push(k); idx = (idx + 1) % R; }
    return s + (boundary === 'end' && i === t ? events.slice(1) : events)[N - 1];
  }
  const ids = (...xs) => xs.map(x => x.id || x.recordId || x).sort();
  const countedOf = x => chosen(x.r ?? x).counted;

  it('start boundary, two occurrences, applied before the target’s turn: survives its first start, expires at the second, nothing else changes', async() => {
    await startCombat([pc, source, target]); await adopt();
    await admitCreature(counted('Disposable Snare Two', 'Snared', -10, 'target-start-count', 2));
    const cost = actors.clone(token(source).state), a = await cast(); await accept(command(a));
    const rec = moves(target)[0];
    assert.equal(rec.clockBoundary, 'authored-target-start-count'); assert.equal(rec.clockOccurrences, 2);
    assert.match(rec.effectSummary, /2nd upcoming turn/); assert.doesNotMatch(JSON.stringify(rec), /round/i);
    const item = schedule(rec); assert.deepEqual([item.dueSequence, item.occurrences, item.period, item.boundary], [5, 2, 3, 'start']);
    assert.equal(token(source).state.currentHp, cost.currentHp, 'no regeneration or HP change from timing');
    assert.deepEqual(progress(rec), { boundary: 'start', total: 2, remaining: 2, counted: 0, finalSequence: 5, nextSequence: 2, clockSequence: 0, combatId: item.combatId });
    assert.match(profile.expiryLabel(rec, live().gameState.combat), /2 of 2 target-turn starts still to come \(0 counted\); next counted at authenticated boundary 2, expires at boundary 5/);
    let r = await advance(); assert.equal(countedOf(r.r), undefined, 'the source’s own turn start is not a target occurrence'); assert.equal(moves(target).length, 1);
    r = await advance(); assert.deepEqual(countedOf(r.r), [{ recordId: rec.recordId, occurrence: 1, of: 2 }]); assert.deepEqual(chosen(r.r).expired, []);
    assert.equal(moves(target).length, 1); assert.equal(speed(target), 20, 'effect survives its first boundary');
    assert.deepEqual(progress(rec), { boundary: 'start', total: 2, remaining: 1, counted: 1, finalSequence: 5, nextSequence: 5, clockSequence: 2, combatId: item.combatId });
    assert.match(profile.expiryLabel(rec, live().gameState.combat), /1 of 2 target-turn starts still to come \(1 counted\)/);
    await advance(); r = await advance(); assert.equal(moves(target).length, 1); assert.equal(seq(), 4); assert.equal(speed(target), 20);
    r = await advance(); assert.deepEqual(chosen(r.r).expired, [rec.recordId]); assert.equal(moves(target).length, 0); assert.equal(speed(target), 30); assert.equal(scheduled(target).length, 0);
    assert.equal(token(target).state.currentHp, 20); assert.equal(token(target).state.currentActionPoints, 10, 'no AP restoration');
  });

  it('start boundary, three occurrences, applied during the target’s own turn: its next turn is the 1st; the rule never says "round"', async() => {
    await startCombat([pc, source, target]); await adopt(); await advanceTo(2); // target's turn in progress
    await admitCreature(counted('Disposable Snare Three', 'Snared', -15, 'target-start-count', 3));
    await accept(command(await cast())); const rec = moves(target)[0], item = schedule(rec);
    assert.deepEqual([item.dueSequence, item.occurrences, item.period], [11, 3, 3], 'starts at 5, 8 and 11 (seq 2 + 3, +3, +3)');
    for (const n of [3, 4]) { await advanceTo(n); assert.equal(moves(target).length, 1); }
    let r = await advanceTo(5); assert.deepEqual(countedOf(r), [{ recordId: rec.recordId, occurrence: 1, of: 3 }]);
    r = await advanceTo(8); assert.deepEqual(countedOf(r), [{ recordId: rec.recordId, occurrence: 2, of: 3 }]); assert.equal(progress(rec).remaining, 1);
    await advanceTo(10); assert.equal(moves(target).length, 1); r = await advance();
    assert.deepEqual(chosen(r.r).expired, [rec.recordId]); assert.equal(moves(target).length, 0);
  });

  it('end boundary: a turn already in progress is not counted (two occurrences from the own turn); three occurrences before and after the turn', async() => {
    // during the own turn
    await startCombat([pc, source, target]); await adopt(); await advanceTo(2);
    await admitCreature(counted('Disposable Drag Two', 'Dragged', -10, 'target-end-count', 2));
    await accept(command(await cast())); let rec = moves(target)[0], item = schedule(rec);
    assert.deepEqual([item.boundary, item.dueSequence, item.occurrences], ['end', 9, 2], 'ends at 6 (next turn) and 9; seq 3 is the end of the turn in progress');
    assert.match(rec.effectSummary, /end of the target's 2nd upcoming turn \(its next turn counts as the 1st; a turn already in progress is not counted\)/);
    let r = await advanceTo(3); assert.equal(countedOf(r), undefined); assert.equal(moves(target).length, 1);
    r = await advanceTo(6); assert.deepEqual(countedOf(r), [{ recordId: rec.recordId, occurrence: 1, of: 2 }]);
    await advanceTo(8); assert.equal(moves(target).length, 1); r = await advance(); assert.deepEqual(chosen(r.r).expired, [rec.recordId]); assert.equal(moves(target).length, 0);
  });

  it('end boundary before the target’s turn (three occurrences) and start boundary after it (two): exact boundaries on the authenticated clock', async() => {
    await startCombat([pc, source, target]); await adopt();
    await admitCreature(counted('Disposable Drag Three', 'Dragged', -10, 'target-end-count', 3));
    await accept(command(await cast())); const early = moves(target)[0];
    assert.deepEqual([schedule(early).dueSequence, schedule(early).occurrences], [9, 3], 'ends at 3 (this cycle), 6 and 9');
    let r = await advanceTo(3); assert.deepEqual(countedOf(r), [{ recordId: early.recordId, occurrence: 1, of: 3 }]);
    r = await advanceTo(6); assert.deepEqual(countedOf(r), [{ recordId: early.recordId, occurrence: 2, of: 3 }]);
    await advanceTo(8); assert.equal(moves(target).length, 1); r = await advance(); assert.deepEqual(chosen(r.r).expired, [early.recordId]); assert.equal(moves(target).length, 0);
  });

  it('start boundary after the target’s turn: the roster order puts the target first; two occurrences', async() => {
    await startCombat([target, pc, source]); await adopt(); await advanceTo(1); // pc's turn: the target's turn is past
    await admitCreature(counted('Disposable Snare Two', 'Snared', -10, 'target-start-count', 2));
    await accept(command(await cast())); const rec = moves(target)[0];
    assert.deepEqual([schedule(rec).dueSequence, schedule(rec).period], [6, 3], 'next cycle’s start (seq 3) and the one after (seq 6)');
    let r = await advanceTo(3); assert.deepEqual(countedOf(r), [{ recordId: rec.recordId, occurrence: 1, of: 2 }]); assert.equal(moves(target).length, 1);
    await advanceTo(5); assert.equal(moves(target).length, 1); r = await advance(); assert.deepEqual(chosen(r.r).expired, [rec.recordId]);
  });

  it('every application point agrees with an independent turn-by-turn oracle (both boundaries, two and three occurrences, Stunned and movement routes)', async() => {
    await startCombat([pc, source, target]); await adopt();
    const routes = [['start', 2, source], ['start', 3, other], ['end', 2, alt1], ['end', 3, alt2]];
    for (const [boundary, n, caster] of routes) await admitCreature(stunned(`Disposable Echo ${boundary}${n}`, `target-${boundary}-count`, n), caster);
    const placed = [];
    for (let s = 0; s <= 2; s += 1) {
      await advanceTo(s);
      for (const [boundary, n, caster] of routes) {
        const a = await cast(caster, target); await accept(command(a));
        placed.push({ id: a.approvalId, expected: oracle(3, s % 3, 2, boundary, n, s), boundary, n, s });
      }
    }
    assert.equal(placed.length, 12);
    for (const p of placed) {
      const rec = stuns(target).find(x => x.recordId === p.id); assert.ok(rec, `${p.boundary}${p.n}@${p.s}`);
      const item = schedule(rec); assert.equal(item.dueSequence, p.expected, `${p.boundary} N=${p.n} applied at sequence ${p.s} (index ${p.s % 3})`);
      assert.deepEqual([item.boundary, item.occurrences, item.period], [p.boundary, p.n, 3]);
    }
    // And each one disappears at exactly that boundary, never earlier.
    const live0 = new Map(placed.map(p => [p.id, p]));
    while (stuns(target).length) {
      const r = await advance(); const gone = chosen(r.r).expired;
      for (const id of gone) assert.equal(seq(), live0.get(id).expected, `${live0.get(id).boundary} N=${live0.get(id).n}@${live0.get(id).s}`);
      for (const x of stuns(target)) assert.ok(seq() < live0.get(x.recordId).expected);
      assert.ok(seq() < 60);
    }
  });

  it('independent instances expire independently; exact GM removal cancels only its own schedule; manual and next-turn timings are untouched', async() => {
    await startCombat([pc, source, target]); await adopt();
    await admitCreature(stunned('Disposable Echo Daze', 'target-end-count', 2)); await admitCreature(counted('Disposable Snare Three', 'Snared', -10, 'target-start-count', 3), other);
    await admitCreature(counted('Disposable Hold', 'Held', -5, 'gm-manual', undefined, { durationText: 'for 1 round' }), alt1); await admitCreature(counted('Disposable Next', 'Nexted', -5, 'target-next-end', undefined), alt2);
    const d1 = await cast(); await accept(command(d1)); await advanceTo(2); const d2 = await cast(); await accept(command(d2)); // end/2: finals 6 and 9
    const snare = await cast(other); await accept(command(snare)); const hold = await cast(alt1); await accept(command(hold)); const nxt = await cast(alt2); await accept(command(nxt));
    const byId = id => token(target).state.conditions.find(c => c.recordId === id);
    assert.deepEqual([schedule(byId(d1.approvalId)).dueSequence, schedule(byId(d2.approvalId)).dueSequence, schedule(byId(snare.approvalId)).dueSequence], [6, 9, 11]);
    assert.equal(schedule(byId(hold.approvalId)), null, 'authored “for 1 round” stays manual: never mapped to turns'); assert.equal(byId(hold.approvalId).clockOccurrences, undefined);
    const next = schedule(byId(nxt.approvalId)); assert.equal(next.dueSequence, 6); assert.equal(next.occurrences, undefined); assert.equal(byId(nxt.approvalId).clockOccurrences, undefined);
    assert.equal(profile.structuredOccurrences(byId(nxt.approvalId)), 1); assert.equal(profile.structuredOccurrences(byId(hold.approvalId)), null);
    await advanceTo(5); await accept(remove(target, d1.approvalId)); assert.equal(schedule(byId(d2.approvalId)).dueSequence, 9); assert.equal(scheduled(target).some(i => i.recordId === d1.approvalId), false);
    let r = await advanceTo(6); assert.deepEqual(chosen(r.r).expired, [nxt.approvalId]); assert.ok(byId(d2.approvalId)); assert.deepEqual(countedOf(r), [{ recordId: d2.approvalId, occurrence: 1, of: 2 }]);
    assert.throws(() => actors.assertCanAct(live(), target), /Stunned/);
    r = await advanceTo(9); assert.deepEqual(chosen(r.r).expired, [d2.approvalId]); assert.ok(byId(snare.approvalId)); assert.ok(byId(hold.approvalId)); assert.doesNotThrow(() => actors.assertCanAct(live(), target));
    r = await advanceTo(11); assert.deepEqual(chosen(r.r).expired, [snare.approvalId]); assert.deepEqual(token(target).state.conditions.map(c => c.recordId), [hold.approvalId]);
  });

  it('refresh before the old expiry replaces the schedule with a full new count; old boundaries cannot remove refreshed work; the count restarts', async() => {
    await startCombat([pc, source, target]); await adopt();
    await admitCreature(counted('Disposable Snare Two', 'Snared', -10, 'target-start-count', 2));
    const a = await cast(); await accept(command(a)); await advanceTo(4); // one occurrence counted (seq 2); the old final is seq 5
    const b = await cast(); const r = await accept(command(b));
    assert.deepEqual(chosen(r).combination, { outcome: 'refreshed', replacesInstanceId: a.approvalId });
    assert.equal(moves(target).length, 1); const fresh = moves(target)[0]; assert.equal(fresh.recordId, b.approvalId); assert.equal(fresh.clockOccurrences, 2);
    assert.deepEqual(scheduled(target).map(i => [i.recordId, i.dueSequence, i.occurrences]), [[b.approvalId, 8, 2]], 'old schedule gone; new count: starts at 5 and 8');
    assert.deepEqual(progress(fresh), { boundary: 'start', total: 2, remaining: 2, counted: 0, finalSequence: 8, nextSequence: 5, clockSequence: 4, combatId: live().gameState.combat.effectLifecycle.id });
    let step = await advanceTo(5); assert.equal(moves(target).length, 1, 'the old final boundary does not remove the refreshed instance'); assert.deepEqual(countedOf(step), [{ recordId: b.approvalId, occurrence: 1, of: 2 }]);
    await advanceTo(7); assert.equal(speed(target), 20); step = await advance(); assert.deepEqual(chosen(step.r ?? step).expired, [b.approvalId]); assert.equal(speed(target), 30);
  });

  it('a changed occurrence count is a different definition version: the same-source refresh is refused whole, nothing applied or charged', async() => {
    await startCombat([pc, source, target]); await adopt();
    const two = counted('Disposable Snare', 'Snared', -10, 'target-start-count', 2); await admitCreature(two); await accept(command(await cast())); const original = actors.clone(moves(target)[0]);
    const three = actors.clone(two); three.controlConfig.authoredCondition.occurrences = 3; three.authoredDraft.controlConfig.authoredCondition.occurrences = 3;
    await admitVersion(three, source, 2); const b = await cast();
    const r = await refused('actor_consequence', command(b), 'modifier_combination_unresolved'); assert.match(r.error, /different authored terms/);
    assert.deepEqual(moves(target), [original]); assert.ok(payments.get(live(), b.approvalId));
  });

  it('duplicate and lost-ACK transitions count once; a stale second request cannot decrement; reload and checkpoint restore the same remaining count', async() => {
    await startCombat([pc, source, target]); await adopt();
    await admitCreature(counted('Disposable Snare Two', 'Snared', -10, 'target-start-count', 2));
    await accept(command(await cast())); const rec = moves(target)[0]; await advanceTo(1);
    const c = boundary(); gm.emit('actor_turn_boundary', c); await sleep(80); assert.equal(seq(), 2, 'the first delivery advanced the clock once'); // ACK lost
    const first = await ack(gm, 'actor_turn_boundary', c); assert.equal(first.success, true); assert.equal(seq(), 2);
    assert.deepEqual(JSON.parse(first.receipt.adjudication.chosenResult).counted, [{ recordId: rec.recordId, occurrence: 1, of: 2 }]);
    assert.equal(actors.ledger(live()).receipts.filter(x => x.commandId === c.commandId).length, 1);
    const fresh = { ...boundary(), expectedClock: { id: c.expectedClock.id, sequence: 1 } }; // a new command still carrying the old clock position
    assert.equal((await ack(gm, 'actor_turn_boundary', fresh)).code, 'stale_turn_occurrence'); assert.equal(seq(), 2);
    const old = { ...c, commandId: uuid() }; assert.equal((await ack(gm, 'actor_turn_boundary', old)).code, 'stale_turn_state'); assert.equal(seq(), 2);
    assert.equal(progress(rec).remaining, 1); assert.equal(progress(rec).counted, 1);
    const snap = await ack(gm, 'actor_snapshot', { roomId: room.id }); assert.equal(snap.success, true); assert.equal(progress(rec).remaining, 1, 'reconnect snapshot consumes nothing');
    const codec = require('../services/roomCheckpoint'), built = codec.buildCheckpointDocuments({ roomId: room.id, gameState: live().gameState, revision: 1 });
    const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])) }); assert.equal(decoded.ok, true);
    const restored = { ...live(), gameState: { ...decoded.global, maps: decoded.maps, ...codec.deriveRootMirrors(decoded.maps) }, checkpointRevision: 1 }; server.rooms.set(room.id, restored);
    const after = moves(target)[0]; assert.deepEqual(schedule(after), { ...scheduled(target)[0] }); assert.deepEqual([schedule(after).dueSequence, schedule(after).occurrences, schedule(after).period], [5, 2, 3]);
    assert.deepEqual(progress(after), { boundary: 'start', total: 2, remaining: 1, counted: 1, finalSequence: 5, nextSequence: 5, clockSequence: 2, combatId: restored.gameState.combat.effectLifecycle.id });
    assert.deepEqual((await ack(gm, 'actor_turn_boundary', c)).receipt, first.receipt, 'the original receipt is returned after the runtime is rebuilt');
    await advanceTo(4); assert.equal(moves(target).length, 1); const last = await advance(); assert.deepEqual(chosen(last.r).expired, [rec.recordId]);
    const lastAgain = await ack(gm, 'actor_turn_boundary', last.c); assert.deepEqual(lastAgain.receipt, last.r.receipt); assert.equal(seq(), 5);
    assert.deepEqual(JSON.parse(actors.publicReceipt(last.r.receipt).adjudication.chosenResult).expired, [rec.recordId]); assert.ok(!JSON.stringify(actors.publicReceipt(last.r.receipt)).includes('PRIVATE'));
  });

  it('unavailable clock, changed roster, retired clock and schedule capacity follow the existing safe behaviour, with explicit manual status', async() => {
    const def = counted('Disposable Snare Two', 'Snared', -10, 'target-start-count', 2);
    // No combat, then combat without an authenticated clock: the structured bundle is refused whole.
    await admitCreature(def); let a = await cast(); await refused('actor_consequence', command(a), 'effect_schedule_unavailable');
    await startCombat([pc, source, target]); await refused('actor_consequence', command(a), 'effect_schedule_unavailable');
    // A target missing from the exact roster is refused too.
    await ack(gm, 'combat_ended', { roomId: room.id }); await startCombat([pc, source]); await adopt();
    await refused('actor_consequence', command(a), 'effect_schedule_unavailable');
    await ack(gm, 'combat_ended', { roomId: room.id }); await startCombat([pc, source, target]); await adopt();
    // Capacity is counted at the FINAL boundary only: intermediate occurrences expire nothing, so they do not take a slot.
    const lifecycle = () => live().gameState.combat.effectLifecycle;
    for (let i = 0; i < 32; i++) lifecycle().schedules[`filler-${i}`] = { combatId: lifecycle().id, dueSequence: 5 };
    await refused('actor_consequence', command(a), 'effect_schedule_unavailable'); for (let i = 0; i < 32; i++) delete lifecycle().schedules[`filler-${i}`];
    for (let i = 0; i < 32; i++) lifecycle().schedules[`filler-${i}`] = { combatId: lifecycle().id, dueSequence: 2 };
    await accept(command(a)); for (let i = 0; i < 32; i++) delete lifecycle().schedules[`filler-${i}`];
    await accept(remove(target, a.approvalId));
    for (let i = 0; i < 256; i++) lifecycle().schedules[`filler-${i}`] = { combatId: lifecycle().id, dueSequence: 1000 + i };
    const b = await cast(); await refused('actor_consequence', command(b), 'effect_schedule_unavailable'); for (let i = 0; i < 256; i++) delete lifecycle().schedules[`filler-${i}`];
    // Changed roster after application: the clock retires; counting stops and the instance is explicitly manual.
    await accept(command(b)); const rec = moves(target)[0]; await advanceTo(2); assert.equal(progress(rec).counted, 1);
    const reversed = actors.clone(live().gameState.combat.turnOrder); live().gameState.combat.turnOrder.reverse();
    assert.equal(timing.scheduleFor(rec, live().gameState.combat), null); assert.equal(progress(rec), null);
    assert.match(profile.expiryLabel(rec, live().gameState.combat), /not tracked by the current turn clock; GM removes this exact instance/);
    assert.equal((await ack(gm, 'actor_turn_boundary', boundary())).code, 'stale_turn_occurrence', 'a changed roster has no valid clock to advance'); assert.equal(moves(target).length, 1); live().gameState.combat.turnOrder = reversed;
    assert.equal(progress(rec).counted, 1, 'restoring the exact roster restores the clock position; nothing was consumed');
    assert.notEqual((await ack(gm, 'combat_ended', { roomId: room.id })).success, false);
    assert.equal(moves(target).length, 1); assert.match(profile.expiryLabel(rec, live().gameState.combat), /not tracked by the current turn clock/);
    await accept(remove(target, rec.recordId)); assert.equal(moves(target).length, 0);
  });

  it('authoring and admission: counts 2…10 only on the counted policies; tampered, missing or out-of-range counts are refused; existing definitions keep their exact shape', async() => {
    const map = r => pure.definitionFromWizard(r, { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' });
    for (const policy of ['target-start-count', 'target-end-count']) for (const n of [2, 3, 10]) {
      const ok = map(wizardRecord({ policy, occurrences: n })); assert.equal(ok.ok, true, ok.reason); assert.equal(ok.definition.timing.occurrences, n);
      const compiled = definitions.compileDefinition(ok.definition); assert.equal(compiled.ok, true, JSON.stringify(compiled)); assert.equal(compiled.descriptor.timing.occurrences, n);
      assert.match(effect.describe({ direct: ok.definition.effects.direct, condition: ok.definition.effects.condition, timing: ok.definition.timing }), new RegExp(`${n}(st|nd|rd|th) upcoming turn`));
      const tampered = actors.clone(ok.definition); tampered.timing.occurrences = n + 20; assert.equal(definitions.compileDefinition(tampered).ok, false);
      const dropped = actors.clone(ok.definition); delete dropped.timing.occurrences; assert.equal(definitions.compileDefinition(dropped).ok, false);
    }
    for (const bad of [undefined, null, 0, 1, 11, -2, 2.5, '3', NaN, Infinity]) assert.equal(map(wizardRecord({ policy: 'target-end-count', occurrences: bad })).ok, false, String(bad));
    for (const policy of ['gm-manual', 'target-next-start', 'target-next-end']) {
      assert.equal(map(wizardRecord({ policy, occurrences: 2 })).ok, false, policy);
      const plain = map(wizardRecord({ policy })); assert.equal(plain.ok, true); assert.deepEqual(Object.keys(plain.definition.timing).sort(), ['authoredDuration', 'durationText', 'expiryPolicy', 'gmNote']);
      const smuggled = actors.clone(plain.definition); smuggled.timing.occurrences = 2; assert.equal(definitions.compileDefinition(smuggled).ok, false);
    }
    const prose = map(wizardRecord({ policy: 'gm-manual', durationText: 'for 1 round' })); assert.equal(prose.ok, true); assert.equal(prose.definition.timing.occurrences, undefined);
    assert.throws(() => profile.makeStunnedRecord(target, uuid(), { sourceOccurrence: `authored-effect:${uuid()}`, timing: 'authored-target-end-count', authoredDuration: 'x' }), /counted boundary/);
    assert.throws(() => profile.makeStunnedRecord(target, uuid(), { sourceOccurrence: `authored-effect:${uuid()}`, timing: 'authored-target-next-end', authoredDuration: 'x', occurrences: 2 }), /counted boundary/);
    assert.throws(() => profile.makeStunnedRecord(target, uuid(), { sourceOccurrence: `authored-condition:${uuid()}`, timing: 'authored-target-start-count', authoredDuration: 'x', occurrences: 2 }));
    assert.throws(() => profile.makeMovementRecord(target, uuid(), { sourceOccurrence: `class-effect:${uuid()}`, timing: 'authored-target-start-count', authoredDuration: 'x', occurrences: 2, feet: -10, label: 'x' }));
    // The P7 writer refuses a counted record whose count was edited into a generic record.
    const forged = profile.makeStunnedRecord(target, uuid(), { sourceActor: source, sourceOccurrence: `authored-effect:${uuid()}`, timing: 'authored-target-next-end', authoredDuration: 'x' });
    await refused('actor_consequence', { ...base(), actors: [{ ref: target, expectedRevision: token(target).state.actorContract.revision, conditions: [{ op: 'add', recordId: forged.recordId, record: { ...forged, clockOccurrences: 2 } }] }] }, 'invalid_condition');
  });

  it('owner PC route: counted terms are part of the owner-approved terms; a GM change of the count needs reapproval; observers see the count but no private evidence', async() => {
    await startCombat([pc, source, target]); await adopt();
    const ref = await admitPc(counted('Disposable Verdant Step', 'Fleet', 10, 'target-end-count', 3, { direct: 'healing', ap: 1, mana: 1 }));
    const a = pcApproval(ref); assert.equal(a.effectTerms.timing.occurrences, 3); await approve(a);
    const changed = command(a, { amount: 5, res: resolution({ timing: { ...a.effectTerms.timing, occurrences: 2 } }) });
    await refused('actor_consequence', changed, 'owner_reapproval_required');
    const a2 = pcApproval(ref); await approve(a2); const r = await accept(command(a2, { amount: 5 })); const rec = moves(target)[0];
    assert.equal(rec.clockOccurrences, 3); assert.equal(schedule(rec).dueSequence, 9); assert.equal(chosen(r).occurrences, 3);
    const pub = actors.publicReceipt(r.receipt); assert.equal(JSON.parse(pub.adjudication.chosenResult).occurrences, 3); assert.ok(!JSON.stringify(pub).includes('PRIVATE'));
    await advanceTo(8); assert.equal(moves(target).length, 1); const last = await advance(); assert.deepEqual(chosen(last.r).expired, [rec.recordId]); assert.equal(speed(target), 30);
    // The owner route still refuses to start a counted effect without an exact roster slot.
    const b = pcApproval(ref); await approve(b); await ack(gm, 'combat_ended', { roomId: room.id }); await refused('actor_consequence', command(b, { amount: 5 }), 'effect_schedule_unavailable');
  });
  it('the projection every client receives keeps the occurrence count, so the browser still reads a counted record as valid (found by the App witness)', () => {
    const target = { kind: 'creature', roomId: 'r', mapId: 'm', tokenId: 'B', instanceId: uuid() };
    const rec = profile.makeMovementRecord(target, uuid(), { sourceOccurrence: `authored-effect:${uuid()}`, timing: 'authored-target-end-count', occurrences: 2, authoredDuration: 'twice', feet: -10, label: 'Mired' });
    const pub = actors.publicCondition(rec);
    assert.equal(pub.clockOccurrences, 2); assert.equal(pub.clockBoundary, 'authored-target-end-count');
    assert.equal(profile.isMovementModifier(pub), true, 'a public copy still validates');
    const next = profile.makeMovementRecord(target, uuid(), { sourceOccurrence: `authored-effect:${uuid()}`, timing: 'authored-target-next-end', authoredDuration: 'once', feet: -5, label: 'Slog' });
    assert.equal('clockOccurrences' in actors.publicCondition(next), false, 'next-turn records carry no count');
  });
});
