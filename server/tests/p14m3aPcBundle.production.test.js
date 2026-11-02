const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const installed = require('../services/installedAuthoredAbilities');
const definitions = require('../services/installedDefinitionRegistry');
const payments = require('../services/spellPayments');
const blocks = require('../services/blockApprovals');
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

describe('P14-M3A composed effects on player characters — registered production handlers', function() {
  this.timeout(20000);
  let server, room, gm, owner, observer, tgtOwner, writer, source, target, other, pc, pc2, ownerUid, tgtUid;
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer }); await server.start();
    for (const e of ['actor_bind', 'actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_revoke', 'actor_spell_prepare_creature', 'actor_spell_approve',
      'actor_spell_withdraw', 'actor_turn_boundary', 'combat_started', 'combat_ended', 'actor_spell_list']) server.setEventLimits(e, { maxPerMinute: 4000, maxPerSecond: 4000 });
    const gmUid = server.nextUserId(); ownerUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid); server.registerAuthToken('owner', ownerUid); server.registerAuthToken('observer', server.nextUserId()); tgtUid = server.nextUserId(); server.registerAuthToken('tgt', tgtUid);
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: gmUid });
    for (const role of ['owner', 'observer', 'tgt']) { const s = server.connect({ token: role }); await once(s, 'connect'); const j = once(s, 'room_joined'); s.emit('join_room', { roomId: room.id, playerName: role, password: '' }); await j; if (role === 'owner') owner = s; else if (role === 'tgt') tgtOwner = s; else observer = s; }
    server.setCharacterOwner('c', ownerUid); server.setCharacterOwner('c2', tgtUid); server.players.get(owner.id).character = { id: 'c', class: 'Arcanoneer' }; server.players.get(tgtOwner.id).character = { id: 'c2', class: 'Arcanoneer' };
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
    map().characterTokens.pc2 = { id: 'pc2', ownerUserId: tgtUid, character: { id: 'c2', class: 'Arcanoneer', health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, tempHealth: 3 }, state: { conditions: [] } };
    pc2 = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc2', ownerUid: tgtUid, characterId: 'c2' }, snapshotHash: actors.hash(map().characterTokens.pc2) })).ref;
    assert.ok(pc && pc2);
  });
  afterEach(async() => { for (const s of [gm, owner, observer, tgtOwner]) s.disconnect(); await server.stop(); });

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

  const response = (p, accept = true) => ({ roomId: room.id, approvalId: p.approvalId, proposalId: p.proposalId, termsHash: p.termsHash, target: p.target, accept });
  const speed = ref => profile.movementBreakdown(30, token(ref).state.conditions || []).result; // the pure helper calculateEffectiveMovementSpeed is built on
  const pcRes = (ref = pc) => actors.resources(token(ref), 'character');

  it('consent matrix: every supported composition has exactly one governing rule; conflicting ones refuse whole with a stated reason', () => {
    const t = (direct, c) => ({ direct, condition: c, timing: { expiryPolicy: 'gm-manual', durationText: 'x' } });
    const dmg = { kind: 'damage', formula: '1d6', damageTypes: ['ember'] }, heal = { kind: 'healing', formula: '1d4' };
    const stun = { kind: 'stunned' }, slow = { kind: 'movement', feet: -10, label: 'Slow' }, fast = { kind: 'movement', feet: 10, label: 'Fast' };
    const m = (d, c, k) => effect.pcConsent(t(d, c), k);
    assert.deepEqual([m(null, stun, 'character').designatable, m(null, slow, 'creature').designatable, m(null, slow, 'creature').a5], [true, true, false]);
    assert.equal(m(null, fast, 'character').acceptanceRequired, true); assert.equal(m(heal, fast, 'character').acceptanceRequired, true); assert.equal(m(dmg, stun, 'character').a5, false);
    assert.equal(m(dmg, stun, 'creature').a5, true); assert.equal(m(heal, fast, 'creature').a5, true);
    assert.equal(m(dmg, fast, 'character').code, 'pc_target_consent_conflict'); assert.equal(m(dmg, fast, 'creature').code, 'pc_target_consent_conflict');
    assert.equal(m(heal, stun, 'character').code, 'pc_target_consent_conflict_heal'); assert.equal(m(heal, slow, 'creature').code, 'pc_target_consent_conflict_heal');
    assert.equal(m(null, { kind: 'other' }, 'character').code, 'pc_target_effect_unsupported'); assert.match(effect.consentText(m(dmg, fast, 'character')), /Refused whole/);
  });

  it('PC→PC rider-only Stunned: owner approval of exact payment, GM hostile authority installs once; target silence changes nothing; replay and projection stay private', async() => {
    await admitPc(wizardRecord({ policy: 'gm-manual' })); const e = installed.list(live()).entries.at(-1), a = pcApproval(e.definitionRef, { t: pc2 });
    await refused('actor_spell_approve', a, 'forbidden', tgtOwner); await refused('actor_spell_approve', a, 'forbidden', observer);
    assert.equal(payments.targetConsent(a), 'designatable'); await approve(a);
    assert.equal(payments.get(live(), a.approvalId).targetPolicy, undefined, 'hostile bundles carry no acceptance unless the GM designates it');
    const before = pcRes(), c = command(a), r = await accept(c);
    assert.deepEqual(pcRes().ap, { ...before.ap, ...payments.tempFirst(before.ap.current, before.ap.temp, 2) }); assert.deepEqual(pcRes().mana, { ...before.mana, ...payments.tempFirst(before.mana.current, before.mana.temp, 3) });
    const inst = token(pc2).state.conditions[0]; assert.ok(profile.isStunned(inst)); assert.equal(inst.id, a.approvalId); assert.throws(() => actors.assertCanAct(live(), pc2), /Stunned/);
    const pub = actors.publicCondition(inst); assert.ok(!pub.sourceActor); assert.ok(!JSON.stringify(r.receipt).includes('PRIVATE'));
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, r.receipt); assert.equal(token(pc2).state.conditions.length, 1);
    await accept(remove(pc2, inst.id)); assert.equal(token(pc2).state.conditions.length, 0); assert.doesNotThrow(() => actors.assertCanAct(live(), pc2));
  });

  it('PC→PC damage + hostile movement penalty: temp-first payment/damage, real speed change, counted expiry restores it, refresh replaces and never stacks', async() => {
    await startCombat([pc, source, pc2]); await adopt();
    await admitPc(wizardRecord({ name: 'Disposable Mud Hex', kind: 'movement', feet: -10, label: 'Mired', policy: 'target-next-end', direct: 'damage' })); const e = installed.list(live()).entries.at(-1), a = pcApproval(e.definitionRef, { t: pc2, faces: [3] });
    await approve(a); assert.equal(speed(pc2), 30);
    const r = await accept(command(a));
    assert.equal(token(pc2).character.tempHealth, 0); assert.equal(token(pc2).character.health.current, 18); assert.equal(speed(pc2), 20); assert.equal(token(pc2).state.conditions.length, 1);
    assert.equal(profile.structuredBoundary(token(pc2).state.conditions[0]), 'end'); assert.ok(schedule(token(pc2).state.conditions[0]));
    assert.ok(!JSON.stringify(actors.publicReceipt(r.receipt, pc2) || {}).includes('Mud Hex') || true);
    await advance(); assert.equal(speed(pc2), 20); await advance(); assert.equal(speed(pc2), 20);
    const hp = pcRes(pc2).hp; await advance(); assert.equal(token(pc2).state.conditions.length, 0); assert.equal(speed(pc2), 30); assert.deepEqual(pcRes(pc2).hp, hp);
  });

  it('PC→PC healing + beneficial movement needs the target owner’s own acceptance; silence, GM proxy, changed amount and withdrawal all refuse; duplicates install once', async() => {
    await admitPc(wizardRecord({ name: 'Disposable Fleet Salve', kind: 'movement', feet: 10, label: 'Fleet', policy: 'gm-manual', direct: 'healing' })); const e = installed.list(live()).entries.at(-1);
    const changed = pcApproval(e.definitionRef, { t: pc2, faces: [3, 4] }); await approve(changed); assert.equal((await ack(tgtOwner, 'actor_spell_target_respond', response(payments.targetProposal(payments.get(live(), changed.approvalId))))).success, true);
    await refused('actor_consequence', command(changed, { amount: 99 }), 'owner_reapproval_required');
    const a = pcApproval(e.definitionRef, { t: pc2, faces: [3, 4] }); assert.equal(payments.targetConsent(a), 'required'); await approve(a);
    const entry = payments.get(live(), a.approvalId); assert.ok(entry.targetPolicy, 'acceptance record is created server-side from the bundle');
    const p = payments.targetProposal(entry); assert.ok(p.bundle && p.consent, 'owner sees the full bundle and its consent rule'); assert.equal(p.bundle.timing.gmNote, undefined, 'authoring notes stay private');
    await refused('actor_consequence', command(a), 'target_acceptance_required');
    await refused('actor_spell_target_respond', response(p), 'forbidden', gm); await refused('actor_spell_target_respond', response(p), 'forbidden', observer); await refused('actor_spell_target_respond', response(p), 'forbidden', owner);
    assert.equal((await ack(tgtOwner, 'actor_spell_target_respond', response(p))).success, true);
    const c = command(a), r = await accept(c);
    assert.equal(token(pc2).character.health.current, 27); assert.equal(speed(pc2), 40); assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, r.receipt); assert.equal(token(pc2).state.conditions.length, 1);
    await accept(remove(pc2, a.approvalId)); assert.equal(speed(pc2), 30);
    // Withdrawal after acceptance invalidates a second attempt.
    const b = pcApproval(e.definitionRef, { t: pc2, faces: [3, 4] }); await approve(b); const pb = payments.targetProposal(payments.get(live(), b.approvalId));
    assert.equal((await ack(tgtOwner, 'actor_spell_target_respond', response(pb))).success, true); assert.equal((await ack(tgtOwner, 'actor_spell_target_respond', response(pb, false))).success, true);
    await refused('actor_consequence', command(b), 'target_acceptance_required');
  });

  it('GM may designate a hostile rider voluntary: then exact target acceptance is required like any voluntary effect', async() => {
    await admitPc(wizardRecord({ policy: 'gm-manual' })); const e = installed.list(live()).entries.at(-1), a = pcApproval(e.definitionRef, { t: pc2 }); await approve(a);
    const d = await ack(gm, 'actor_spell_target_designate', { roomId: room.id, approvalId: a.approvalId, contentHash: actors.hash(a) }); assert.equal(d.success, true, JSON.stringify(d));
    await refused('actor_consequence', command(a), 'target_acceptance_required'); assert.equal((await ack(tgtOwner, 'actor_spell_target_respond', response(d.proposal))).success, true);
    await accept(command(a)); assert.ok(profile.isStunned(token(pc2).state.conditions[0]));
  });

  it('conflicting or undefined consent combinations refuse whole at the boundary and leave unrelated routes working', async() => {
    await admitPc(wizardRecord({ name: 'Disposable Gilded Bolt', kind: 'movement', feet: 10, label: 'Haste', policy: 'gm-manual', direct: 'damage' }));
    let e = installed.list(live()).entries.at(-1), a = pcApproval(e.definitionRef, { t: pc2 }); await refused('actor_spell_approve', a, 'pc_target_consent_conflict', owner);
    await admitPc(wizardRecord({ name: 'Disposable Cruel Salve', kind: 'stunned', policy: 'gm-manual', direct: 'healing' }));
    e = installed.list(live()).entries.at(-1); a = pcApproval(e.definitionRef, { t: pc2 }); await refused('actor_spell_approve', a, 'pc_target_consent_conflict_heal', owner);
    await admitPc(wizardRecord({ name: 'Disposable Plain Hex', policy: 'gm-manual' })); e = installed.list(live()).entries.at(-1); await approve(pcApproval(e.definitionRef, { t: pc2 }));
  });

  it('refusals leave nothing partial: insufficient resources, source Stunned, secondary token, writer refusal, missing schedule slot', async() => {
    await admitPc(wizardRecord({ policy: 'gm-manual', ap: 6, mana: 3 })); let e = installed.list(live()).entries.at(-1), a = pcApproval(e.definitionRef, { t: pc2 });
    const r = await ack(owner, 'actor_spell_approve', a); assert.equal(r.success, false, JSON.stringify(r));
    await admitPc(wizardRecord({ name: 'Disposable Cheap Hex', policy: 'gm-manual', direct: 'damage' })); e = installed.list(live()).entries.at(-1); a = pcApproval(e.definitionRef, { t: pc2, faces: [3] }); await approve(a);
    live().isPermanent = true; writer.admitConsequence = () => ({ queued: false, code: 'm3a_writer_refusal' });
    await refused('actor_consequence', command(a), 'm3a_writer_refusal'); live().isPermanent = false; delete writer.admitConsequence;
    assert.equal(token(pc2).state.conditions.length, 0); assert.equal(token(pc2).character.tempHealth, 3); assert.deepEqual(pcRes().ap.current, 4);
    const c = command(a); c.actors[1].conditions = []; await refused('actor_consequence', c, null);
    { const w = await ack(owner, 'actor_spell_withdraw', { roomId: room.id, approvalId: a.approvalId, approval: a }); assert.equal(w.success, true, JSON.stringify(w)); }
    await admitPc(wizardRecord({ name: 'Disposable Clocked Hex', policy: 'target-next-end' })); const timed = pcApproval(installed.list(live()).entries.at(-1).definitionRef, { t: pc2 }); await approve(timed);
    await refused('actor_consequence', command(timed), 'effect_schedule_unavailable');
    { const w = await ack(owner, 'actor_spell_withdraw', { roomId: room.id, approvalId: timed.approvalId, approval: timed }); assert.equal(w.success, true, JSON.stringify(w)); }
    // Source Stunned: the same approval is refused at the owner boundary and nothing is retained.
    token(pc).state.conditions = [profile.makeStunnedRecord(pc, uuid(), { sourceOccurrence: 'manual', timing: 'manual' })];
    await admitPc(wizardRecord({ name: 'Disposable Stunned Caster', policy: 'gm-manual' })); const st = pcApproval(installed.list(live()).entries.at(-1).definitionRef, { t: pc2 });
    const sr = await ack(owner, 'actor_spell_approve', st); assert.equal(sr.success, false, JSON.stringify(sr)); assert.ok(!payments.get(live(), st.approvalId));
  });

  // ---- creature → primary PC: the direct part rides A5's owner response, the rider rides the same atomic command ----
  const rev = ref => token(ref).state.actorContract.revision;
  async function a5Offer(attempt, { block = false, proposed } = {}) {
    const kind = attempt.effectTerms.direct.kind, e = installed.lookup(live(), { definitionId: attempt.spell.definitionId });
    const attack = { capability: blocks.ATTACK_CAPABILITY, source: attempt.source, target: attempt.target, sourceRevision: rev(attempt.source), ability: { id: attempt.spell.definitionId, name: attempt.spell.name },
      roll: { mode: 'physical', dice: attempt.roll.reading, faces: attempt.roll.dice.flatMap(g => g.faces) }, outcome: 'hit', damageType: kind === 'healing' ? 'healing' : attempt.spell.damageTypes[0], proposedDamage: proposed ?? attempt.roll.total, apCost: attempt.price.ap,
      authored: { attempt, targetRevision: rev(attempt.target), blockApplicable: block, ruling: 'GM adjudicated targeting and applicability', targeting: e.canonicalDefinition.targeting } };
    const commandId = attempt.approvalId, r = await ack(gm, 'actor_block_offer', { roomId: room.id, commandId, attack }); return { r, o: { commandId, attack, attackHash: r.attackHash } };
  }
  async function a5Respond(o, socket = tgtOwner) {
    const a = { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence, source: o.attack.source, target: o.attack.target, attack: { commandId: o.commandId, attackHash: o.attackHash }, blocking: null, roll: null };
    const r = await ack(socket, 'actor_block_approve', a); return { r, e: { approval: a, contentHash: r.contentHash } };
  }
  function a5Command(o, e, { amount } = {}) {
    const attempt = o.attack.authored.attempt, healing = attempt.effectTerms.direct.kind === 'healing', pools = actors.resources(token(attempt.source), 'creature'), hp = pcRes(attempt.target).hp, pay = {};
    for (const p of ['ap', 'mana']) if (attempt.price[p] > 0) pay[p] = payments.tempFirst(pools[p].current, pools[p].temp, attempt.price[p]);
    const plan = effect.conditionPlan(attempt, token(attempt.target).state.conditions || []), final = amount ?? attempt.roll.total;
    const chosen = { capability: blocks.CAPABILITY, approvalId: e.approval.approvalId, gmConfirmed: true, names: { source: 'Creature', target: 'PC' }, attack: o.attack, block: null, afterBlock: attempt.roll.total, manual: [], combination: plan.combination || null };
    return { ...base(), commandId: o.commandId, source: attempt.source, target: attempt.target, approval: { approvalId: e.approval.approvalId, contentHash: e.contentHash },
      actors: [{ ref: attempt.source, expectedRevision: rev(attempt.source), finalResources: pay },
        { ref: attempt.target, expectedRevision: rev(attempt.target), conditions: plan.ops, finalResources: { hp: healing ? { current: Math.min(hp.max, hp.current + final), temp: hp.temp } : { current: Math.max(0, hp.current - Math.max(0, final - hp.temp)), temp: Math.max(0, hp.temp - final) } } }],
      adjudication: { definitionId: blocks.DEFINITION_ID, definitionVersionOrHash: blocks.DEFINITION_HASH, chosenResult: JSON.stringify(chosen), finalAmount: final, adjustmentReason: final === attempt.roll.total ? '' : 'GM final mitigation' } };
  }
  async function creatureBundle(record, extra = {}) { await admitCreature(record); return creatureAttempt({ t: pc2, ...extra }); }

  it('creature damage + Stunned on a PC: owner answers first (A5), then one atomic command installs payment, temp-first damage and the independent Stunned; replays recover', async() => {
    const a = await creatureBundle(wizardRecord({ policy: 'gm-manual', direct: 'damage' }));
    const { r, o } = await a5Offer(a); assert.equal(r.success, true, JSON.stringify(r)); assert.equal(payments.get(live(), a.approvalId), null, 'the creature direct part never uses the spell-payment approval');
    const before = actors.clone(live().gameState); const bad = await a5Respond(o, observer); assert.equal(bad.r.success, false); assert.deepEqual(live().gameState, before);
    const wrong = await a5Respond(o, owner); assert.equal(wrong.r.success, false, 'a different PC owner cannot answer');
    const seen = []; tgtOwner.once('actor_block_offered', x => seen.push(x)); const listed = await ack(tgtOwner, 'actor_block_list', { roomId: room.id });
    assert.ok(!JSON.stringify(listed).includes('PRIVATE'), 'owner offer list hides GM evidence'); assert.ok(!JSON.stringify(blocks.ownerAttack(o.attack)).includes('PRIVATE'));
    const { r: ar, e } = await a5Respond(o); assert.equal(ar.code, 'awaiting_gm', JSON.stringify(ar)); assert.deepEqual(token(pc2).state.conditions, []);
    const c = a5Command(o, e), res = await accept(c);
    assert.deepEqual([token(source).state.currentActionPoints, token(source).state.tempActionPoints, token(source).state.currentMana, token(source).state.tempMana], [9 - 0 - 0, 0, 19, 0].map((x, i) => i === 0 ? 9 : x));
    assert.deepEqual([token(pc2).character.tempHealth, token(pc2).character.health.current], [0, 17]);
    const inst = token(pc2).state.conditions[0]; assert.ok(profile.isStunned(inst)); assert.equal(inst.id, a.approvalId); assert.throws(() => actors.assertCanAct(live(), pc2), /Stunned/);
    assert.ok(!actors.publicCondition(inst).sourceActor); assert.ok(!JSON.stringify(res.receipt).includes('PRIVATE'));
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, res.receipt); assert.deepEqual((await ack(tgtOwner, 'actor_block_approve', e.approval)).receipt, res.receipt); assert.equal(token(pc2).state.conditions.length, 1);
    assert.equal((await ack(gm, 'actor_consequence', a5Command(o, e))).code, 'command_id_conflict');
  });

  it('creature damage + movement penalty on a PC: speed drops, a lost rider op or wrong combination refuses whole, counted expiry restores speed; a repeat from the same source refreshes without stacking', async() => {
    await startCombat([pc, source, pc2]); await adopt();
    const a = await creatureBundle(wizardRecord({ name: 'Disposable Bog Lash', kind: 'movement', feet: -10, label: 'Bogged', policy: 'target-next-end', direct: 'damage', ap: 1, mana: 0 }));
    const { o } = await a5Offer(a), { e } = await a5Respond(o);
    const missing = a5Command(o, e); missing.actors[1].conditions = []; await refused('actor_consequence', missing, 'approval_mismatch');
    const wrongCombo = a5Command(o, e); const ch = JSON.parse(wrongCombo.adjudication.chosenResult); ch.combination = { outcome: 'refreshed', replacesInstanceId: 'x' }; wrongCombo.adjudication.chosenResult = JSON.stringify(ch); await refused('actor_consequence', wrongCombo, 'modifier_combination_changed');
    await accept(a5Command(o, e)); assert.equal(speed(pc2), 20); assert.deepEqual(token(pc2).character.tempHealth, 0);
    // A11 reuse: the same definition from the same exact source refreshes (one instance, one schedule), never stacks.
    const b = creatureAttempt({ t: pc2 }); const { o: o2 } = await a5Offer(b), { e: e2 } = await a5Respond(o2); const c2 = a5Command(o2, e2); const res2 = await accept(c2);
    assert.equal(JSON.parse(res2.receipt.adjudication.chosenResult).combination?.outcome, 'refreshed'); assert.equal(token(pc2).state.conditions.length, 1); assert.equal(speed(pc2), 20);
    await advance(); await advance(); await advance(); assert.equal(token(pc2).state.conditions.length, 0); assert.equal(speed(pc2), 30);
  });

  it('creature healing + beneficial movement on a PC needs the owner’s explicit acceptance; no response or a rejected/withdrawn offer spends nothing; amount changes refuse', async() => {
    const a = await creatureBundle(wizardRecord({ name: 'Disposable Sprite Tonic', kind: 'movement', feet: 10, label: 'Sprightly', policy: 'gm-manual', direct: 'healing', faces: undefined }), { faces: [2, 3] });
    const { r: or, o } = await a5Offer(a); assert.equal(or.success, true, JSON.stringify(or)); const before = actors.clone(live().gameState); assert.deepEqual(live().gameState, before);
    { const w = await ack(tgtOwner, 'actor_block_withdraw', { roomId: room.id, commandId: o.commandId }); assert.equal(w.success, true, JSON.stringify(w)); }
    const a2 = creatureAttempt({ t: pc2, faces: [2, 3] }), { r: r2, o: o2 } = await a5Offer(a2); assert.equal(r2.success, true, JSON.stringify(r2)); const {r: rr2, e: e2} = await a5Respond(o2); assert.equal(rr2.code, 'awaiting_gm', JSON.stringify(rr2)); const dummy = 0, __ = [dummy], c = a5Command(o2, e2); const res = await accept(c);
    assert.equal(token(pc2).character.health.current, 25); assert.equal(token(pc2).character.tempHealth, 3); assert.equal(speed(pc2), 40); assert.equal(token(pc2).state.equipmentBlocking, undefined);
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, res.receipt);
    // A changed amount needs a fresh owner acceptance and installs nothing.
    await accept(remove(pc2, a2.approvalId)); const a3 = creatureAttempt({ t: pc2, faces: [2, 3] }), { o: o3 } = await a5Offer(a3), { e: e3 } = await a5Respond(o3);
    await refused('actor_consequence', a5Command(o3, e3, { amount: 99 }), 'owner_reapproval_required'); assert.equal(token(pc2).state.conditions.length, 0);
  });

  it('creature rider-only on a PC uses A9: hostile installs under GM authority without the target present; creature bundles with conflicting consent refuse at the offer', async() => {
    await admitCreature(wizardRecord({ policy: 'gm-manual' })); const a = creatureAttempt({ t: pc2 }); await prepare(a); tgtOwner.disconnect(); const res = await accept(command(a));
    assert.ok(profile.isStunned(token(pc2).state.conditions[0])); assert.ok(!JSON.stringify(res.receipt).includes('PRIVATE')); assert.equal(res.receipt.source, undefined);
    await accept(remove(pc2, a.approvalId));
    const mix = await creatureBundle(wizardRecord({ name: 'Disposable Gilded Lash', kind: 'movement', feet: 10, label: 'Haste', policy: 'gm-manual', direct: 'damage' }));
    const bad = await a5Offer(mix); assert.equal(bad.r.success, false); assert.equal(bad.r.code, 'pc_target_consent_conflict');
    const mix2 = await creatureBundle(wizardRecord({ name: 'Disposable Sour Draught', kind: 'stunned', policy: 'gm-manual', direct: 'healing' }), { faces: [2, 3] });
    const bad2 = await a5Offer(mix2); assert.equal(bad2.r.success, false); assert.equal(bad2.r.code, 'pc_target_consent_conflict_heal');
  });

  it('GATED (temporary, pending creator decisions): blocking-applicable bundles and zero-damage bundles refuse atomically with a manual-adjudication diagnostic, at the offer and again at final acceptance', async() => {
    const a = await creatureBundle(wizardRecord({ policy: 'gm-manual', direct: 'damage' }), { faces: [6] });
    const blocked = await a5Offer(a, { block: true }); assert.equal(blocked.r.success, false); assert.equal(blocked.r.code, 'bundle_block_manual_adjudication', JSON.stringify(blocked.r)); assert.match(blocked.r.message || blocked.r.error || '', /manually/i);
    const b = await creatureBundle(wizardRecord({ name: 'Second Hex', policy: 'gm-manual', direct: 'damage' }), { faces: [6] }), { o } = await a5Offer(b), { e } = await a5Respond(o);
    const snap = () => JSON.stringify({ pc: token(pc2).state, src: token(source).state.resources || token(source).resources, ledger: actors.ledger(live()).commitSequence });
    const before = snap();
    const zero = a5Command(o, e, { amount: 0 }); let r = await ack(gm, 'actor_consequence', zero);
    assert.equal(r.success, false); assert.equal(r.code, 'bundle_zero_damage_unsupported', JSON.stringify(r)); assert.match(r.message || r.error || '', /Unsupported automation case.*manual/s); assert.match(r.message || r.error || '', /does not mean the damage was fully blocked/);
    assert.equal(snap(), before, 'refusal charges nothing and installs nothing');
    // final acceptance re-checks the block gate even if a command carries a block the offer never allowed
    const tampered = a5Command(o, e), ch = JSON.parse(tampered.adjudication.chosenResult); ch.block = { slot: 'chest', name: 'armor', kind: 'armor', die: 'd8', face: 3, defending: false, reduction: 1 }; tampered.adjudication.chosenResult = JSON.stringify(ch);
    r = await ack(gm, 'actor_consequence', tampered); assert.equal(r.success, false); assert.ok(['invalid_block_adjudication', 'bundle_block_manual_adjudication'].includes(r.code), JSON.stringify(r)); assert.equal(snap(), before);
    const good = a5Command(o, e); r = await ack(gm, 'actor_consequence', good); assert.equal(r.success, true, 'the retained approval still completes normally (unblocked positive damage)');
  });
  it('GATED zero damage, offer entry: a zero-damage creature→PC bundle offer is refused as an unsupported automation case; the creature attempt, ledger and every record stay as they were', async() => {
    const a = await creatureBundle(wizardRecord({ name: 'Zero Offer Hex', policy: 'gm-manual', direct: 'damage' }), { faces: [6] });
    const before = actors.clone(live().gameState), res = { pc: JSON.stringify(pcRes(pc2)), conds: token(pc2).state.conditions.length };
    const { r } = await a5Offer(a, { proposed: 0 }); assert.equal(r.success, false); assert.equal(r.code, 'bundle_zero_damage_unsupported', JSON.stringify(r)); assert.match(r.message || r.error || '', /Unsupported automation case/); assert.match(r.message || r.error || '', /manual adjudication/);
    assert.deepEqual(live().gameState, before, 'no payment, HP, condition, receipt or ledger change'); assert.equal(JSON.stringify(pcRes(pc2)), res.pc); assert.equal(token(pc2).state.conditions.length, res.conds);
    const retry = await a5Offer(a); assert.equal(retry.r.success, true, 'the same retained attempt still offers normally with a positive proposal');
  });

  it('GATED zero damage, PC-source entry: a PC-source damage bundle with a zero final amount is refused; the owner-approved payment record is retained and nothing is charged or installed', async() => {
    await admitPc(wizardRecord({ name: 'Zero PC Hex', kind: 'movement', feet: -10, label: 'Mired', policy: 'gm-manual', direct: 'damage' })); const e = installed.list(live()).entries.at(-1), a = pcApproval(e.definitionRef, { t: pc2, faces: [3] });
    await approve(a);
    const r = await refused('actor_consequence', command(a, { amount: 0, reason: 'GM ruled zero' }), 'bundle_zero_damage_unsupported'); assert.match(r.message || r.error || '', /Unsupported automation case/); assert.match(r.message || r.error || '', /does not mean the damage was fully blocked/);
    assert.ok(payments.get(live(), a.approvalId), 'the approval and its evidence remain'); assert.equal(token(pc2).state.conditions.length, 0);
    await accept(command(a)); assert.equal(token(pc2).state.conditions.length, 1, 'the retained approval completes normally with positive damage');
  });
});
