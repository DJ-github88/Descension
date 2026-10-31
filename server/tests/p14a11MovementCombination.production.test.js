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
function wizardRecord({ name = 'Disposable Ember Hobble', kind = 'stunned', feet, label, policy = 'target-next-end', direct = null, ap = 2, mana = 3, extra } = {}) {
  const c = { profile: pure.EFFECT_CAPABILITY, effect: kind, ...(kind === 'movement' ? { movementFeet: feet, label } : {}), expiryPolicy: policy,
    durationText: 'Until the embers cool', gmNote: 'GM resolves eligibility, range and any save before confirming success.' };
  const d = { name, description: 'A10 disposable test', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' },
    effectTypes: direct ? [direct, 'control'] : ['control'], controlConfig: { authoredCondition: c },
    ...(direct === 'damage' ? { damageConfig: { damageType: 'direct', elementType: 'ember', formula: '1d6+2', resolution: 'DICE' } } : {}),
    ...(direct === 'healing' ? { healingConfig: { healingType: 'direct', formula: '2d4', resolution: 'DICE' } } : {}),
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: ap, mana } };
  if (extra) extra(d);
  return { ...actors.clone(d), authoredDraft: d, authoredDefinitionId: uuid() };
}
const rollFor = (formula, faces) => { const r = pure.readFormula(formula); const dice = [{ sides: r.dice[0].sides, faces }]; return { mode: 'physical', dice, constant: r.constant, reading: r.reading, total: faces.reduce((a, b) => a + b, r.constant) }; };

describe('P14-A11 movement-effect combination — registered production handlers', function() {
  this.timeout(20000);
  let server, room, gm, owner, observer, writer, source, target, other, pc, ownerUid;
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
    for (const id of ['source', 'target', 'other']) {
      const t = { id, name: id, creatureId: 'disposable', stats: { maxHp: 30, maxMana: 20, maxAP: 10, speed: 30 }, authoredAbility: { schemaVersion: 1, record: wizardRecord(), librarySpellId: null },
        state: { currentHp: 20, currentMana: 20, currentActionPoints: 10, tempHealth: 3, tempMana: 2, tempActionPoints: 1, conditions: [] } };
      map().tokens[id] = t;
      const r = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: id }, snapshotHash: actors.hash(t) });
      assert.equal(r.success, true, JSON.stringify(r)); if (id === 'source') source = r.ref; else if (id === 'target') target = r.ref; else other = r.ref;
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

  it('different named effects stack additively; positive and negative combine and clamp at 0; independent expiry and removal restore the remaining speed', async() => {
    await startCombat([pc, source, target, other]); await adopt();
    await admitCreature(move('Disposable Mire Grip', 'Mired', -10, 'target-next-start'));
    let r = await accept(command(await cast())); assert.deepEqual(chosen(r).combination, { outcome: 'added', replacesInstanceId: null }); assert.equal(speed(target), 20);
    await admitCreature(move('Disposable Tailwind', 'Tailwind', 15, 'gm-manual'), other);
    r = await accept(command(await cast(other))); assert.equal(chosen(r).combination.outcome, 'added');
    assert.equal(moves(target).length, 2); assert.equal(speed(target), 35, '30 − 10 + 15');
    const bog = await admitPc(move('Disposable Bog Hold', 'Bog-bound', -30, 'target-next-end', { ap: 0 }));
    const p1 = pcApproval(bog); await approve(p1); r = await accept(command(p1)); assert.equal(chosen(r).combination.outcome, 'added'); assert.equal(speed(target), 5);
    const deep = await admitPc(move('Disposable Sinking Earth', 'Sinking', -25, 'gm-manual', { ap: 0 }));
    const p2 = pcApproval(deep); await approve(p2); await accept(command(p2));
    assert.equal(moves(target).length, 4); assert.equal(profile.movementBreakdown(30, token(target).state.conditions).total, -50);
    assert.equal(speed(target), 0, 'never below 0 ft'); assert.equal(profile.movementBreakdown(30, token(target).state.conditions).clamped, true);
    // Each instance keeps its own exact schedule: Mired at the target's start (boundary 2), Bog-bound at its end (3).
    assert.deepEqual(scheduled(target).map(item => item.dueSequence).sort(), [2, 3]);
    await advance(); assert.equal(moves(target).length, 4);
    await advance(); assert.deepEqual(moves(target).map(m => m.name).sort(), ['Bog-bound', 'Sinking', 'Tailwind']); assert.equal(speed(target), 0, '30 + 15 − 30 − 25 → still 0');
    await advance(); assert.deepEqual(moves(target).map(m => m.name).sort(), ['Sinking', 'Tailwind']); assert.equal(speed(target), 20);
    await accept(remove(target, moves(target).find(m => m.name === 'Tailwind').id)); assert.equal(speed(target), 5);
    await accept(remove(target, moves(target)[0].id)); assert.equal(speed(target), 30); assert.equal(scheduled(target).length, 0);
  });

  it('same effect from the same source refreshes: one instance, value not doubled, exact schedule replaced; the old boundary cannot expire it', async() => {
    await startCombat([pc, source, target]); await adopt();
    await admitCreature(move('Disposable Mire Grip', 'Mired', -10, 'target-next-end'));
    const a = await cast(); await accept(command(a)); const first = moves(target)[0];
    assert.equal(schedule(first).dueSequence, 3, 'end of the target’s strictly next turn');
    await advance(); await advance(); // now the target's own turn (sequence 2)
    const apBefore = token(source).state.currentActionPoints + token(source).state.tempActionPoints;
    const b = await cast(); const r = await accept(command(b));
    assert.deepEqual(chosen(r).combination, { outcome: 'refreshed', replacesInstanceId: a.approvalId });
    assert.equal(moves(target).length, 1); const refreshed = moves(target)[0];
    assert.equal(refreshed.id, b.approvalId); assert.equal(refreshed.effects.movementSpeed, -10); assert.equal(speed(target), 20, 'refresh does not stack the value');
    assert.equal(refreshed.effectDefinition, first.effectDefinition); assert.deepEqual(refreshed.sourceActor, first.sourceActor);
    assert.equal(token(source).state.currentActionPoints + token(source).state.tempActionPoints, apBefore - 1, 'a refresh is a new approved action with its authored price');
    assert.deepEqual(scheduled(target).map(item => [item.recordId, item.dueSequence]), [[b.approvalId, 6]], 'old schedule removed; new one at the end of the next turn after this one');
    assert.equal(r.receipt.actors[1].conditions.filter(profile.isMovementModifier).length, 1);
    await advance(); assert.equal(live().gameState.combat.effectLifecycle.sequence, 3); assert.equal(moves(target).length, 1, 'old boundary 3 does not expire the refreshed instance');
    await advance(); await advance(); assert.equal(moves(target).length, 1); assert.equal(speed(target), 20);
    const due = await advance(); assert.equal(moves(target).length, 0); assert.equal(speed(target), 30);
    assert.deepEqual(JSON.parse(due.r.receipt.adjudication.chosenResult).expired, [b.approvalId]);
  });

  it('a refresh keeps independent sources and effects: another instance survives the refresh, and the refreshed one survives the other’s removal', async() => {
    await startCombat([pc, source, target, other]); await adopt();
    await admitCreature(move('Disposable Mire Grip', 'Mired', -10, 'target-next-start'));
    await admitCreature(move('Disposable Tailwind', 'Tailwind', 15, 'target-next-end'), other);
    const a = await cast(); await accept(command(a)); await accept(command(await cast(other)));
    const tail = moves(target).find(m => m.name === 'Tailwind'), tailDue = schedule(tail).dueSequence;
    await advance(); // source's turn
    const b = await cast(); await accept(command(b));
    assert.equal(moves(target).length, 2); assert.equal(schedule(moves(target).find(m => m.name === 'Tailwind')).dueSequence, tailDue, 'independent schedule untouched');
    assert.equal(speed(target), 35);
    await accept(remove(target, tail.id)); assert.equal(moves(target).length, 1); assert.equal(moves(target)[0].id, b.approvalId); assert.equal(speed(target), 20);
    await advance(); assert.equal(moves(target).length, 0, 'refreshed Mired expires at the target’s start'); assert.equal(speed(target), 30);
  });

  it('refresh atomicity: failed payment, schedule, authority, writer and stale-plan checks change nothing; the original instance and schedule remain', async() => {
    await startCombat([pc, source, target]); await adopt();
    await admitCreature(move('Disposable Mire Grip', 'Mired', -10, 'target-next-start'));
    await accept(command(await cast())); const original = actors.clone(moves(target)[0]), originalDue = schedule(original).dueSequence;
    const b = await cast(), c = command(b);
    const keep = () => { assert.deepEqual(moves(target), [original]); assert.equal(schedule(moves(target)[0]).dueSequence, originalDue); assert.ok(payments.get(live(), b.approvalId)); };
    // Stale client plan: an "add" when the server derives a refresh (and its result) is refused whole.
    const stale = actors.clone(c); stale.actors[1].conditions = [{ op: 'add', recordId: b.approvalId, record: effect.recordFor(b) }];
    stale.adjudication.chosenResult = JSON.stringify(effect.resultFor(b, b.resolution, { outcome: 'added', replacesInstanceId: null }));
    await refused('actor_consequence', stale, 'modifier_combination_changed'); keep();
    const ops = actors.clone(c); ops.actors[1].conditions = [ops.actors[1].conditions[1]]; await refused('actor_consequence', ops, 'approval_mismatch'); keep();
    await refused('actor_consequence', c, null, owner); keep();
    live().isPermanent = true; writer.admitConsequence = () => ({ queued: false, code: 'a11_writer_refusal' }); await refused('actor_consequence', c, 'a11_writer_refusal'); live().isPermanent = false; keep();
    const lifecycle = live().gameState.combat.effectLifecycle; // the new instance's boundary is full: refused, never truncated
    for (let i = 0; i < 32; i++) lifecycle.schedules[`filler-${i}`] = { combatId: lifecycle.id, dueSequence: originalDue };
    await refused('actor_consequence', c, 'effect_schedule_unavailable'); keep();
    for (let i = 0; i < 32; i++) delete lifecycle.schedules[`filler-${i}`];
    const pools = actors.clone(token(source).state); token(source).state.currentActionPoints = 0; token(source).state.tempActionPoints = 0;
    await refused('actor_consequence', c, 'insufficient_resources'); token(source).state.currentActionPoints = pools.currentActionPoints; token(source).state.tempActionPoints = pools.tempActionPoints; keep();
    await accept(c); assert.equal(moves(target).length, 1); assert.equal(moves(target)[0].id, b.approvalId);
  });

  it('insufficient resources and a retired clock refuse a refresh whole', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(move('Disposable Verdant Step', 'Fleet', 10, 'target-next-end', { ap: 0, mana: 3 }));
    const a = pcApproval(ref); await approve(a); await accept(command(a)); const original = actors.clone(moves(target)[0]);
    const b = pcApproval(ref); await approve(b); const c = command(b);
    const mana = actors.clone(token(pc).character.mana), temp = token(pc).character.tempMana; token(pc).character.mana.current = 0; token(pc).character.tempMana = 0;
    await refused('actor_consequence', c, 'insufficient_resources'); assert.deepEqual(moves(target), [original]); assert.ok(payments.get(live(), b.approvalId));
    token(pc).character.mana = mana; token(pc).character.tempMana = temp;
    assert.notEqual((await ack(gm, 'combat_ended', { roomId: room.id })).success, false); // clock retired; the instance stays, now GM-managed
    await refused('actor_consequence', command(b), 'effect_schedule_unavailable'); assert.deepEqual(moves(target), [original]);
    assert.match(profile.expiryLabel(moves(target)[0], live().gameState.combat), /not tracked by the current turn clock/);
  });

  it('combinations the recorded policy leaves open are refused explicitly and change nothing; settled cases still pass', async() => {
    await startCombat([pc, source, target, other]); await adopt();
    const mire = move('Disposable Mire Grip', 'Mired', -10, 'gm-manual');
    await admitCreature(mire); await accept(command(await cast()));
    // Same effect (same installed definition) from a different source.
    const shared = await admitCreature(actors.clone(mire), other); assert.equal(pure.actionId(shared), moves(target)[0].effectDefinition);
    let o = await cast(other), r = await refused('actor_consequence', command(o), 'modifier_combination_unresolved'); assert.match(r.error, /different source/); await withdraw(o);
    // Same definition id from the same source at a changed version (different magnitude).
    const changed = actors.clone(mire); changed.controlConfig.authoredCondition.movementFeet = -20; changed.authoredDraft.controlConfig.authoredCondition.movementFeet = -20;
    await admitVersion(changed, source, 2); let s2 = await cast(); r = await refused('actor_consequence', command(s2), 'modifier_combination_unresolved'); assert.match(r.error, /different authored terms/); await withdraw(s2);
    // An instance accepted before effect identity existed (A10) never combines; it stays removable.
    await accept(remove(target, moves(target)[0].id));
    const legacyId = uuid(), legacy = profile.makeMovementRecord(target, legacyId, { sourceActor: source, sourceOccurrence: `authored-effect:${legacyId}`, timing: 'manual', authoredDuration: 'Until the mud dries', feet: -5, label: 'Old Mud' });
    token(target).state.conditions.push(legacy); assert.ok(profile.isMovementModifier(legacy)); assert.equal(profile.movementEffectKey(legacy), null);
    await admitCreature(move('Disposable Tailwind', 'Tailwind', 15, 'gm-manual'), other);
    o = await cast(other); r = await refused('actor_consequence', command(o), 'modifier_combination_unresolved'); assert.match(r.error, /before movement effects carried a stable identity/);
    await accept(remove(target, legacyId)); await refused('actor_consequence', command(o), 'creature_revalidation_required'); // prepared against the old target state
    await withdraw(o); await accept(command(await cast(other))); assert.equal(speed(target), 45);
    // Capacity is an engineering bound, refused explicitly, never truncated.
    for (let i = 0; i < 7; i++) { const id = uuid(); token(target).state.conditions.push(profile.makeMovementRecord(target, id, { sourceActor: source, sourceOccurrence: `authored-effect:${id}`, timing: 'manual', authoredDuration: 'x', feet: 5, label: `Gust ${i}`, effectDefinition: `authored:${uuid()}:1:${'a'.repeat(64)}` })); }
    await admitCreature(move('Disposable Last Straw', 'Last Straw', -5, 'gm-manual'));
    await refused('actor_consequence', command(await cast()), 'movement_modifier_capacity');
  });

  it('owner PC route: a second approval of the same effect refreshes; lost ACK, duplicate delivery and reconnect apply once', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(move('Disposable Verdant Step', 'Fleet', 10, 'target-next-end', { direct: 'healing', ap: 1, mana: 1 }));
    const a = pcApproval(ref); await approve(a); await accept(command(a, { amount: 5 }));
    const b = pcApproval(ref); await approve(b); const c = command(b, { amount: 5 });
    gm.emit('actor_consequence', c); await new Promise(res => setTimeout(res, 80)); // ACK lost
    const r = await accept(c); assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, r.receipt);
    assert.deepEqual(chosen(r).combination, { outcome: 'refreshed', replacesInstanceId: a.approvalId });
    assert.equal(moves(target).length, 1); assert.equal(speed(target), 40); assert.equal(actors.ledger(live()).receipts.filter(x => x.commandId === c.commandId).length, 1);
    const snap = await ack(gm, 'actor_snapshot', { roomId: room.id }); assert.equal(snap.success, true); assert.equal(moves(target).length, 1);
    await refused('actor_consequence', { ...c, commandId: uuid() }); // the consumed approval cannot refresh again under a new command
    assert.equal(moves(target).length, 1); assert.equal(scheduled(target).length, 1);
    // Public receipt: outcome is visible to the observer, private GM evidence is not.
    const pub = actors.publicReceipt(r.receipt); assert.equal(JSON.parse(pub.adjudication.chosenResult).combination.outcome, 'refreshed'); assert.ok(!JSON.stringify(pub).includes('PRIVATE'));
  });

  it('review note 1: effect identity is refused on anything but a validated authored movement record', async() => {
    const id = uuid(), marker = { version: 1, id, recordId: id, name: 'Marker', originalName: 'Marker', type: 'marker', kind: 'marker', target, targetId: target.tokenId, targetType: 'creature',
      source: 'manual', sharedTiming: 'manual', durationType: 'manual', effects: {}, effectDefinition: `authored:${uuid()}:1:${'a'.repeat(64)}` };
    await refused('actor_consequence', { ...base(), actors: [{ ref: target, expectedRevision: token(target).state.actorContract.revision, conditions: [{ op: 'add', recordId: id, record: marker }] }] }, 'invalid_condition');
    const plain = { ...marker }; delete plain.effectDefinition;
    await accept({ ...base(), actors: [{ ref: target, expectedRevision: token(target).state.actorContract.revision, conditions: [{ op: 'add', recordId: id, record: plain }] }] });
  });

  it('Stunned bundles and manual timing are unchanged: same-definition Stunned instances stay independent, never refreshed', async() => {
    await startCombat([pc, source, target]); await adopt(); await admitCreature(wizardRecord({ name: 'Disposable Echo Daze', policy: 'gm-manual', ap: 0, mana: 0 }));
    const a = await cast(); const r1 = await accept(command(a)); const b = await cast(); const r2 = await accept(command(b));
    assert.equal(token(target).state.conditions.filter(profile.isStunned).length, 2);
    for (const r of [r1, r2]) assert.equal(chosen(r).combination, undefined);
    assert.equal(token(target).state.conditions.some(c => 'effectDefinition' in c), false);
  });
});
