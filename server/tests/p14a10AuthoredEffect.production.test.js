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

describe('P14-A10 composable authored effects — registered production handlers', function() {
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

  it('adapter/compiler: whole Wizard bundles compile; unsupported, partial or inferred predicates stay manual; A7 meaning is unchanged', () => {
    const map = r => pure.definitionFromWizard(r, { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' });
    const stun = map(wizardRecord({ direct: 'damage' })), move = map(wizardRecord({ kind: 'movement', feet: -10, label: 'Hobbled', policy: 'target-next-start', direct: 'healing' }));
    assert.equal(stun.ok, true, stun.reason); assert.deepEqual(stun.definition.effects, { direct: { kind: 'damage', formula: '1d6+2', damageTypes: ['ember'] }, condition: { kind: 'stunned' } });
    assert.equal(move.ok, true, move.reason); assert.deepEqual(move.definition.effects.condition, { kind: 'movement', feet: -10, label: 'Hobbled' });
    for (const d of [stun.definition, move.definition, map(wizardRecord({ policy: 'gm-manual' })).definition]) { const c = definitions.compileDefinition(d); assert.equal(c.ok, true, JSON.stringify(c)); assert.equal(c.descriptor.compilerVersion, 'p14-a10-effect-1'); }
    for (const extra of [d => { d.damageConfig = { ...d.damageConfig, chanceOnHitConfig: { enabled: true, procChance: 50 } }; }, d => { d.damageConfig = { ...d.damageConfig, savingThrow: true }; },
      d => { d.controlConfig.authoredCondition.expiryPolicy = 'one-round'; }, d => { d.controlConfig.authoredCondition.durationText = ''; }, d => { d.effectTypes.push('healing'); d.healingConfig = { healingType: 'direct', formula: '1d4', resolution: 'DICE' }; },
      d => { d.targetingConfig.targetingType = 'area'; }, d => { d.debuffConfig = { statModifiers: [{ stat: 'agility', magnitude: -2 }] }; }, d => { d.controlConfig.authoredCondition.effect = 'slowed'; }, d => { d.targetingConfig.targetRestrictions = ['self']; }]) {
      const r = wizardRecord({ direct: 'damage', extra }); assert.equal(map(r).ok, false, JSON.stringify(r.authoredDraft));
    }
    for (const [feet, label] of [[7, 'Odd'], [0, 'Zero'], [-65, 'Far'], [-10, ''], [10, ' Padded']]) assert.equal(map(wizardRecord({ kind: 'movement', feet, label })).ok, false);
    const a7 = { name: 'A7 Bell', description: 'x', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: ['control'], controlConfig: { authoredCondition: { profile: pure.CONDITION_CAPABILITY, conditionKey: 'stunned', expiryPolicy: 'gm-manual', durationText: 'x', gmNote: 'y' } },
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: 1, mana: 0 } };
    const legacy = map({ ...actors.clone(a7), authoredDraft: a7, authoredDefinitionId: uuid() }); assert.equal(legacy.definition.capability, pure.CONDITION_CAPABILITY); assert.equal(legacy.definition.schemaVersion, 2);
    assert.equal(definitions.compileDefinition(legacy.definition).descriptor.compilerVersion, 'p14-a7-condition-1');
    // A7's record maker still refuses structured timing on its own occurrences.
    assert.throws(() => profile.makeStunnedRecord(target, uuid(), { sourceOccurrence: `authored-condition:${uuid()}`, timing: 'authored-target-next-end', authoredDuration: 'x' }));
    assert.throws(() => profile.makeStunnedRecord(target, uuid(), { sourceOccurrence: 'manual', timing: 'authored-target-next-start' }));
  });

  it('creature→creature damage + Stunned installs payment, HP, condition and end-of-next-turn schedule together; expires only at that exact boundary', async() => {
    await startCombat(); await adopt();
    await admitCreature(wizardRecord({ direct: 'damage' })); const a = creatureAttempt({ faces: [5] }); await prepare(a);
    const r = await accept(command(a, { amount: 9, reason: 'GM: resistance halves nothing here; +2 from cover ruling' }));
    assert.equal(token().state.currentActionPoints, 9); assert.equal(token().state.tempActionPoints, 0); assert.equal(token().state.currentMana, 19); assert.equal(token().state.tempMana, 0);
    assert.equal(token(target).state.tempHealth, 0); assert.equal(token(target).state.currentHp, 14);
    const instance = token(target).state.conditions[0]; assert.ok(profile.isStunned(instance)); assert.equal(instance.id, a.approvalId); assert.deepEqual(instance.sourceActor, source);
    assert.equal(profile.structuredBoundary(instance), 'end'); assert.equal(schedule(instance).dueSequence, 3); assert.match(profile.expiryLabel(instance, live().gameState.combat), /end of the target's next turn/);
    assert.equal(r.receipt.actors.length, 2); assert.ok(!JSON.stringify(r.receipt).includes('PRIVATE')); assert.equal(r.receipt.contentHash, undefined);
    const chosen = JSON.parse(r.receipt.adjudication.chosenResult); assert.equal(chosen.kind, 'effect'); assert.deepEqual(chosen.condition, { kind: 'stunned' }); assert.equal(chosen.expiryPolicy, 'target-next-end');
    assert.throws(() => actors.assertCanAct(live(), target), /Stunned/);
    await advance(); assert.equal(token(target).state.conditions.length, 1); // source's turn
    await advance(); assert.equal(token(target).state.conditions.length, 1); // target's turn starts: not premature
    const hpBefore = actors.resources(token(target), 'creature');
    const due = await advance(); assert.equal(token(target).state.conditions.length, 0); assert.doesNotThrow(() => actors.assertCanAct(live(), target));
    assert.deepEqual(actors.resources(token(target), 'creature'), hpBefore); assert.deepEqual(JSON.parse(due.r.receipt.adjudication.chosenResult).expired, [a.approvalId]);
    // A consumed attempt cannot be executed again under a new command, and the old boundary retry returns its original receipt.
    assert.equal((await ack(gm, 'actor_consequence', command(a))).code, 'approval_consumed');
    assert.deepEqual((await ack(gm, 'actor_turn_boundary', due.c)).receipt, due.r.receipt); assert.equal(live().gameState.combat.effectLifecycle.sequence, 3);
  });

  it('structured expiry refuses the whole bundle when no authenticated clock or roster slot can take it; manual policy needs none', async() => {
    await admitCreature(wizardRecord({ direct: 'damage' })); let a = creatureAttempt(); await prepare(a);
    await refused('actor_consequence', command(a), 'effect_schedule_unavailable'); assert.ok(payments.get(live(), a.approvalId), 'attempt stays retained, unconsumed');
    await startCombat([pc, source]); await refused('actor_consequence', command(a), 'effect_schedule_unavailable');
    await adopt(); await refused('actor_consequence', command(a), 'effect_schedule_unavailable'); // target is not in the exact roster
    await ack(gm, 'actor_spell_withdraw', { roomId: room.id, approvalId: a.approvalId, approval: a });
    await admitCreature(wizardRecord({ name: 'Disposable Quiet Snare', policy: 'gm-manual', ap: 0, mana: 0 })); a = creatureAttempt(); await prepare(a);
    await accept(command(a)); const instance = token(target).state.conditions[0]; assert.equal(schedule(instance), null); assert.match(profile.expiryLabel(instance, live().gameState.combat), /GM removes/);
    await accept(remove(target, instance.id)); assert.equal(token(target).state.conditions.length, 0);
  });

  it('movement modifier: authored feet become a canonical effect; an undecided second modifier refuses atomically; expiry/removal restores the base', async() => {
    await startCombat([pc, source, target, other]); await adopt();
    await admitCreature(wizardRecord({ name: 'Disposable Mire Grip', kind: 'movement', feet: -10, label: 'Mired', policy: 'target-next-start' }));
    const a = creatureAttempt(); await prepare(a); await accept(command(a));
    const m = token(target).state.conditions[0]; assert.ok(profile.isMovementModifier(m)); assert.deepEqual(m.effects, { movementSpeed: -10 }); assert.equal(m.type, 'debuff'); assert.equal(m.name, 'Mired');
    assert.equal(schedule(m).dueSequence, 2); assert.equal(m.sharedTiming, 'manual');
    // Second authored movement modifier on the same target whose combination the recorded policy leaves open (A11:
    // a different definition with the same displayed name) → explicit atomic refusal (no payment, no HP).
    await admitCreature(wizardRecord({ name: 'Disposable Tailwind', kind: 'movement', feet: 15, label: 'Mired', policy: 'target-next-end', direct: 'healing' }), other);
    const b = creatureAttempt({ s: other, faces: [2, 3] }); await prepare(b); const before = actors.clone(live().gameState);
    const refusedResult = await ack(gm, 'actor_consequence', command(b)); assert.equal(refusedResult.code, 'modifier_combination_unresolved'); assert.deepEqual(live().gameState, before);
    // A different target accepts it, preserving the first target's modifier and timing.
    await ack(gm, 'actor_spell_withdraw', { roomId: room.id, approvalId: b.approvalId, approval: b });
    const c = creatureAttempt({ s: other, t: source, faces: [2, 3] }); await prepare(c); await accept(command(c));
    assert.equal(token(source).state.currentHp, 25); assert.ok(profile.isMovementModifier(token(source).state.conditions[0])); assert.equal(token(source).state.conditions[0].effects.movementSpeed, 15);
    // Generic writes cannot fabricate authored provenance or alter feet.
    const forged = effect.recordFor({ ...c, approvalId: uuid(), target: other });
    await refused('actor_consequence', { ...base(), actors: [{ ref: other, expectedRevision: token(other).state.actorContract.revision, conditions: [{ op: 'add', recordId: forged.id, record: forged }] }] }, 'authored_effect_approval_required');
    // Review F1: even an internally consistent rebuilt record (+60 ft, manual timing) cannot replace the accepted instance.
    const accepted = token(source).state.conditions[0];
    const rebuilt = profile.makeMovementRecord(source, accepted.id, { sourceActor: accepted.sourceActor, sourceOccurrence: accepted.sourceEntityId, timing: 'manual', authoredDuration: accepted.authoredDuration, feet: 60, label: accepted.name });
    await refused('actor_consequence', { ...base(), actors: [{ ref: source, expectedRevision: token(source).state.actorContract.revision, conditions: [{ op: 'update', recordId: rebuilt.id, record: rebuilt }] }] }, 'authored_effect_correction_is_removal');
    assert.equal(schedule(token(source).state.conditions[0]).dueSequence, 2, 'source is mid-roster: its next turn ends at boundary 2');
    await advance(); assert.equal(token(target).state.conditions.length, 1); assert.equal(token(source).state.conditions.length, 1);
    // One admitted boundary: the target's start (incoming) and the source's end (outgoing) expire together.
    const due = await advance(); assert.equal(token(target).state.conditions.length, 0); assert.equal(token(source).state.conditions.length, 0);
    assert.deepEqual(JSON.parse(due.r.receipt.adjudication.chosenResult).expired.sort(), [a.approvalId, c.approvalId].sort());
  });

  it('owner PC→creature healing + movement binds owner terms; GM timing changes require reapproval; observer sees no private evidence', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(wizardRecord({ name: 'Disposable Verdant Step', kind: 'movement', feet: 10, label: 'Fleet', policy: 'target-next-end', direct: 'healing', ap: 1, mana: 4 }));
    const a = pcApproval(ref); await approve(a);
    const forged = actors.clone(a); forged.effectTerms.condition.feet = 60; await refused('actor_spell_approve', { ...forged, approvalId: uuid() }, 'authored_effect_mismatch', owner);
    await refused('actor_spell_approve', a, 'forbidden', observer);
    const list = await ack(observer, 'actor_spell_list', { roomId: room.id }); assert.equal(list.pending.length, 0);
    const changed = { gmConfirmed: true, timing: { ...a.effectTerms.timing, expiryPolicy: 'gm-manual' }, timingNote: 'x', evidence: '' };
    await refused('actor_consequence', command(a, { res: changed }), 'owner_reapproval_required');
    // The server closes that consent; the exact owner approves the unchanged admitted terms again (fresh identity).
    assert.equal((await ack(gm, 'actor_consequence', command(a, { amount: 5 }))).code, 'approval_owner_reapproval_required');
    const again = pcApproval(ref); await approve(again);
    const r = await accept(command(again, { amount: 5, res: { ...resolution({ timing: again.effectTerms.timing }), timingNote: 'PRIVATE PC timing clarification' } }));
    const pcPools = actors.resources(token(pc), 'character'); assert.deepEqual(pcPools.ap, { current: 4, temp: 0, max: 4 }); assert.deepEqual(pcPools.mana, { current: 8, temp: 0, max: 10 });
    assert.equal(token(target).state.currentHp, 25); const m = token(target).state.conditions[0]; assert.equal(m.effects.movementSpeed, 10); assert.deepEqual(m.sourceActor, pc); assert.equal(schedule(m).dueSequence, 3);
    assert.ok(!JSON.stringify(r.receipt).includes('PRIVATE'));
  });

  it('PC damage + Stunned: insufficient resources, source Stunned, stale revisions, writer refusal and capacity leave nothing installed', async() => {
    await startCombat(); await adopt();
    const ref = await admitPc(wizardRecord({ name: 'Disposable Cinder Lash', direct: 'damage', ap: 2, mana: 3 }));
    const a = pcApproval(ref, { faces: [6] }); await approve(a);
    const early = command(a); token(pc).character.mana.current = 0; token(pc).character.tempMana = 0; await refused('actor_consequence', early, 'insufficient_resources');
    token(pc).character.mana.current = 10; token(pc).character.tempMana = 2;
    const stun = profile.makeStunnedRecord(pc, uuid(), { sourceOccurrence: 'manual-test' }); token(pc).state.conditions.push(stun); await refused('actor_consequence', command(a), 'actor_stunned'); token(pc).state.conditions = [];
    const c = command(a); token(target).state.actorContract.revision++; await refused('actor_consequence', c); token(target).state.actorContract.revision--;
    live().isPermanent = true; writer.admitConsequence = () => ({ queued: false, code: 'a10_writer_refusal' }); await refused('actor_consequence', command(a), 'a10_writer_refusal'); live().isPermanent = false;
    assert.ok(payments.get(live(), a.approvalId));
    // Schedule capacity: P7's per-boundary atomic bound refuses, never truncates.
    const lifecycle = live().gameState.combat.effectLifecycle;
    for (let i = 0; i < 32; i++) lifecycle.schedules[`filler-${i}`] = { combatId: lifecycle.id, dueSequence: 3 };
    await refused('actor_consequence', command(a), 'effect_schedule_unavailable');
    for (let i = 0; i < 32; i++) delete lifecycle.schedules[`filler-${i}`];
    const r = await accept(command(a, { amount: 8 }));
    assert.equal(token(target).state.currentHp, 15); assert.ok(profile.isStunned(token(target).state.conditions[0])); assert.equal(r.receipt.actors[0].finalResources.mana.current, 9);
  });

  it('authority-await races: a source Stunned or target change just before installation refuses the whole bundle', async() => {
    await startCombat(); await adopt(); await admitCreature(wizardRecord({ direct: 'damage' })); const a = creatureAttempt(); await prepare(a);
    async function during(change, code) {
      const original = server.authorityService.assertCurrent; let enter, release; const entered = new Promise(r => { enter = r; }), gate = new Promise(r => { release = r; });
      server.authorityService.assertCurrent = async(...args) => { if (new Error().stack.includes('actorConsequenceHandlers.js')) { enter(); await gate; } return original(...args); };
      const pending = ack(gm, 'actor_consequence', command(a)); await entered; change(); const before = actors.clone(live().gameState); release(); const r = await pending; server.authorityService.assertCurrent = original;
      assert.equal(r.code, code, JSON.stringify(r)); assert.deepEqual(live().gameState, before);
    }
    const stun = profile.makeStunnedRecord(source, uuid(), { sourceOccurrence: 'manual-race' });
    await during(() => token().state.conditions.push(stun), 'actor_stunned'); token().state.conditions = [];
    await during(() => { token(target).state.currentHp = 1; }, 'creature_revalidation_required'); token(target).state.currentHp = 20;
    await during(() => { live().gameState.combat.currentTurnIndex = 1; }, 'effect_schedule_unavailable'); live().gameState.combat.currentTurnIndex = 0;
    await accept(command(a));
  });

  it('independent instances from one definition keep separate schedules; removing one preserves the other and its boundary', async() => {
    await startCombat([pc, source, target]); await adopt(); await admitCreature(wizardRecord({ name: 'Disposable Echo Daze', policy: 'target-next-end', ap: 0, mana: 0 }));
    const a = creatureAttempt(); await prepare(a); await accept(command(a));
    await advance(); // source's turn
    const b = creatureAttempt(); await prepare(b); await accept(command(b));
    const [first, second] = token(target).state.conditions; assert.notEqual(first.id, second.id);
    assert.equal(schedule(first).dueSequence, 3); assert.equal(schedule(second).dueSequence, 3);
    await accept(remove(target, first.id)); assert.equal(schedule(second).dueSequence, 3); assert.equal(token(target).state.conditions.length, 1);
    assert.throws(() => actors.assertCanAct(live(), target));
    await advance(); await advance(); assert.equal(token(target).state.conditions.length, 0);
  });

  it('lost ACK, duplicate delivery, reconnect snapshot, combat end and new runtime never duplicate or invent costs/effects/expiry', async() => {
    await startCombat(); await adopt(); await admitCreature(wizardRecord({ direct: 'damage' })); const a = creatureAttempt(); await prepare(a); const c = command(a);
    gm.emit('actor_consequence', c); await new Promise(r => setTimeout(r, 80));
    const r = await accept(c); assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, r.receipt);
    assert.equal(token(target).state.conditions.length, 1); assert.equal(token().state.currentActionPoints, 9); assert.equal(actors.ledger(live()).receipts.filter(x => x.commandId === c.commandId).length, 1);
    const snap = await ack(gm, 'actor_snapshot', { roomId: room.id }); assert.equal(snap.success, true); assert.equal(token(target).state.conditions.length, 1);
    // Ending combat retires the clock: the instance stays (visibly manual), nothing expires or refunds.
    const before = actors.clone(token(target).state);
    assert.equal((await ack(gm, 'combat_ended', { roomId: room.id })).success !== false, true);
    assert.deepEqual(token(target).state, before); assert.equal(schedule(token(target).state.conditions[0]), null); assert.match(profile.expiryLabel(token(target).state.conditions[0], live().gameState.combat), /expires at the authenticated turn boundary|GM removes|end of the target/);
    // After the original receipt, the same command still recovers it; a replacement attempt under the old epoch is unknown after restart.
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, r.receipt);
    const old = creatureAttempt(); old.actionEpoch = uuid(); await refused('actor_spell_prepare_creature', old, 'outcome_unknown'); // prior-runtime epoch
  });

  it('review F1–F4: controllers cannot rewrite or remove accepted instances; GM removal only; PC-route timing note stays private; retired clock labels manual', async() => {
    await startCombat(); await adopt();
    await admitCreature(wizardRecord({ name: 'Disposable Dazing Ember', policy: 'target-next-end', ap: 0, mana: 0 })); const a = creatureAttempt(); await prepare(a); await accept(command(a));
    const stun = token(target).state.conditions[0]; token(target).ownerUserId = ownerUid; // a player now controls the target creature
    const manual = profile.makeStunnedRecord(target, stun.id, { sourceActor: source, sourceOccurrence: stun.sourceEntityId, timing: 'manual', authoredDuration: stun.authoredDuration });
    const named = sock => ({ ...base(), actors: [{ ref: target, expectedRevision: token(target).state.actorContract.revision, conditions: [{ op: 'update', recordId: stun.id, record: manual }] }],
      adjudication: { definitionId: profile.STUNNED.definitionId, definitionVersionOrHash: profile.STUNNED.origin, finalAmount: 0, adjustmentReason: '', chosenResult: 'x' } });
    await refused('actor_consequence', named(), 'authored_effect_correction_is_removal', owner);
    await refused('actor_consequence', named(), 'authored_effect_correction_is_removal');
    await refused('actor_consequence', remove(target, stun.id), 'authored_effect_gm_removal_required', owner);
    assert.equal(schedule(stun).dueSequence, 3);
    assert.equal((await ack(gm, 'combat_ended', { roomId: room.id })).success !== false, true);
    assert.match(profile.expiryLabel(token(target).state.conditions[0], live().gameState.combat), /not tracked by the current turn clock; GM removes/);
    await accept(remove(target, stun.id));
    // PC route public receipt omits the GM timing note (A7/A8 parity).
    await startCombat(); await adopt();
    const ref = await admitPc(wizardRecord({ name: 'Disposable Quiet Cinder', policy: 'gm-manual', ap: 0, mana: 0 })); const pa = pcApproval(ref); await approve(pa);
    const r = await accept(command(pa)); assert.equal(JSON.parse(r.receipt.adjudication.chosenResult).resolution.timingNote, undefined);
  });
  it('A7 manual Stunned and C4 Defending/Shield Bash paths are unchanged by the new capability', async() => {
    await startCombat(); await adopt();
    token().authoredAbility.record = (() => { const d = { name: 'A7 Regression Bell', description: 'x', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' }, effectTypes: ['control'],
      controlConfig: { authoredCondition: { profile: pure.CONDITION_CAPABILITY, conditionKey: 'stunned', expiryPolicy: 'gm-manual', durationText: 'bell', gmNote: 'note' } },
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: 0, mana: 0 } };
    return { ...actors.clone(d), authoredDraft: d, authoredDefinitionId: uuid() }; })();
    const r = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, source, expectedSourceRevision: token().state.actorContract.revision, definitionVersion: 1 }); assert.equal(r.success, true);
    const grant = token().state.actorContract.authoredAdmission, e = installed.lookup(live(), { definitionId: pure.actionId(grant.definitionRef) });
    const a = { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence, source, target,
      sourceAuthority: { admissionId: grant.requestId, associationHash: grant.associationHash, gmUid: grant.gmUid },
      spell: { definitionId: pure.actionId(e.definitionRef), definitionHash: `${pure.CONDITION_CAPABILITY}/${e.definitionRef.definitionHash}`, name: e.canonicalDefinition.name, kind: 'condition', damageTypes: [] },
      price: e.descriptor.price, classPayment: null, roll: null, resolution: { gmConfirmed: true, timing: e.canonicalDefinition.timing, timingNote: 'n', evidence: '' } };
    await prepare(a);
    const pools = actors.resources(token(), 'creature');
    await accept({ ...base(), source, target, approval: { approvalId: a.approvalId, contentHash: actors.hash(a) }, actors: [{ ref: source, expectedRevision: token().state.actorContract.revision, finalResources: { ap: payments.tempFirst(pools.ap.current, pools.ap.temp, 0) } },
      { ref: target, expectedRevision: token(target).state.actorContract.revision, conditions: [{ op: 'add', recordId: a.approvalId, record: condition.recordFor(a) }] }],
    adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, finalAmount: 0, adjustmentReason: '', chosenResult: JSON.stringify(condition.resultFor(a)) } });
    const instance = token(target).state.conditions[0]; assert.equal(schedule(instance), null); assert.equal(profile.structuredBoundary(instance), null); assert.match(instance.effectSummary, /GM removes/);
    await advance(); await advance(); await advance(); await advance(); assert.equal(token(target).state.conditions.length, 1, 'A7 manual instance never auto-expires');
  });
});
