/* Timed save-dependent effects — the shared GM-recorded save branch (rider-local "negates") on a Wizard authored-effect:v1 bundle
 * whose rider has a structured target-turn expiry (M2A next start/end or counted), primary owner PC → one distinct creature.
 * Registered production handlers, shared compiler/branch module/C4 lifecycle/P7 writer. Closes save review F1 by making BOTH recorded
 * outcomes require the owner-approved authenticated schedule; nothing here is spell-specific (disposable records, different names). */
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
const timing = require('../../vtt-react/src/services/sharedEffectTiming');
const once = (s, e) => new Promise(r => s.once(e, r));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ack = (s, e, d) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error(e)), 5000); s.emit(e, d, r => { clearTimeout(t); resolve(r); }); });

const SAVE = { ability: 'constitution', dc: 12, outcome: 'negates' };
const DR_RIDER = { kind: 'damageReduction', amount: 3, label: 'Aegis Ward' };
const PERIODIC_RIDER = { kind: 'periodic', tick: { kind: 'damage', formula: '1d6', damageTypes: ['blight'] }, label: 'Wasting Brand', tickRoll: 'each-tick' };
function wizardRecord({ name = 'Disposable Rime Shackle', feet = -10, label = 'Rime Shackle', policy = 'target-next-end', occurrences, save = SAVE, ap = 1, mana = 4, kind = 'movement' } = {}) {
  const c = { profile: pure.EFFECT_CAPABILITY, effect: kind, ...(kind === 'movement' ? { movementFeet: feet, label } : {}), expiryPolicy: policy, ...(occurrences !== undefined ? { occurrences } : {}),
    durationText: 'until the frost thaws', gmNote: 'The table rolls the Constitution save; the GM records saved or failed.', ...(save ? { save } : {}) };
  const d = { name, description: 'Disposable timed save-branch test ability', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' },
    effectTypes: ['damage', 'control'], controlConfig: { authoredCondition: c },
    damageConfig: { damageType: 'direct', elementType: 'rime', formula: '1d8+3', resolution: 'DICE' },
    targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, maxTargets: 1, targetRestrictions: ['enemy'] }, resourceCost: { actionPoints: ap, mana } };
  return { ...actors.clone(d), authoredDraft: d, authoredDefinitionId: uuid() };
}
const rollFor = (formula, faces) => { const r = pure.readFormula(formula); return { mode: 'physical', dice: [{ sides: r.dice[0].sides, faces }], constant: r.constant, reading: r.reading, total: faces.reduce((a, b) => a + b, r.constant) }; };
const map = r => pure.definitionFromWizard(r, { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' });

describe('Timed save-dependent effects — GM-recorded save branch with authenticated turn-boundary expiry', function() {
  this.timeout(30000);
  let server, room, gm, owner, observer, writer, target, other, pc, ownerUid;
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer }); await server.start();
    for (const e of ['actor_bind', 'actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_spell_approve', 'actor_spell_withdraw', 'actor_spell_list', 'actor_turn_boundary', 'combat_started', 'combat_ended'])
    {server.setEventLimits(e, { maxPerMinute: 4000, maxPerSecond: 4000 });}
    const gmUid = server.nextUserId(); ownerUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid); server.registerAuthToken('owner', ownerUid); server.registerAuthToken('observer', server.nextUserId());
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: gmUid });
    for (const role of ['owner', 'observer']) { const s = server.connect({ token: role }); await once(s, 'connect'); const j = once(s, 'room_joined'); s.emit('join_room', { roomId: room.id, playerName: role, password: '' }); await j; if (role === 'owner') {owner = s;} else {observer = s;} }
    server.setCharacterOwner('c', ownerUid);
    const m = () => room.gameState.maps.default;
    for (const id of ['target', 'other']) {
      const t = { id, name: id, creatureId: 'disposable', stats: { maxHp: 60, maxMana: 20, maxAP: 10, speed: 30 }, authoredAbility: { schemaVersion: 1, record: wizardRecord(), librarySpellId: null },
        state: { currentHp: 50, currentMana: 20, currentActionPoints: 10, tempHealth: 0, tempMana: 0, tempActionPoints: 0, conditions: [] } };
      m().tokens[id] = t;
      const r = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: id }, snapshotHash: actors.hash(t) });
      assert.equal(r.success, true, JSON.stringify(r)); if (id === 'target') {target = r.ref;} else {other = r.ref;}
    }
    m().characterTokens.pc = { id: 'pc', ownerUserId: ownerUid, character: { id: 'c', class: 'Arcanoneer', health: { current: 20, max: 30 }, mana: { current: 40, max: 40 }, actionPoints: { current: 10, max: 10 }, tempMana: 0, tempActionPoints: 0 }, state: { conditions: [] } };
    pc = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'c' }, snapshotHash: actors.hash(m().characterTokens.pc) })).ref;
    assert.ok(pc);
  });
  afterEach(async() => { gm.disconnect(); owner.disconnect(); observer.disconnect(); await server.stop(); });

  const live = () => server.rooms.get(room.id);
  const token = ref => actors.locate(live(), ref).token;
  const base = () => ({ version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence });
  const hp = ref => token(ref).state.currentHp;
  const pools = () => { const c = token(pc).character; return { ap: c.actionPoints.current, mana: c.mana.current }; };
  const speed = ref => profile.movementBreakdown(30, token(ref).state.conditions).result;
  const moves = ref => token(ref).state.conditions.filter(profile.isMovementModifier);
  const chosen = r => JSON.parse(r.receipt.adjudication.chosenResult);
  const receiptsFor = commandId => actors.ledger(live()).receipts.filter(x => x.commandId === commandId);
  const lifecycle = () => live().gameState.combat?.effectLifecycle;
  const scheduled = ref => Object.values(lifecycle()?.schedules || {}).filter(i => i.ref && profile.sameRef(i.ref, ref));
  const seq = () => lifecycle().sequence;
  async function startCombat(order = [pc, target, other]) {
    const r = await ack(gm, 'combat_started', { roomId: room.id, turnOrder: order.map(ref => ({ tokenId: ref.tokenId, actorRef: ref })), currentTurnIndex: 0, round: 1 });
    assert.equal(r.success, true, JSON.stringify(r));
  }
  const boundary = (mode = 'advance') => ({ ...base(), mode, combatHash: actors.hash(live().gameState.combat), expectedClock: mode === 'advance' ? { id: lifecycle().id, sequence: lifecycle().sequence } : null });
  async function adopt() { const r = await ack(gm, 'actor_turn_boundary', boundary('adopt')); assert.equal(r.success, true, JSON.stringify(r)); }
  async function advance() { const c = boundary(), r = await ack(gm, 'actor_turn_boundary', c); assert.equal(r.success, true, JSON.stringify(r)); return { c, r }; }
  async function advanceTo(n) { let last; while (seq() < n) {last = await advance();} return last; }
  async function admitPc(record) {
    const r = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, record, definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(r.success, true, JSON.stringify(r)); return r.definitionRef;
  }
  const entryFor = ref => installed.list(live()).entries.find(e => pure.actionId(e.definitionRef) === pure.actionId(ref));
  const res = a => ({ gmConfirmed: true, timing: a.effectTerms.timing, timingNote: 'GM: touch range and exact target confirmed', evidence: 'PRIVATE GM evidence: table save d20' });
  function spellOf(e) { const d = e.canonicalDefinition; return { definitionId: pure.actionId(e.definitionRef), definitionHash: `${pure.EFFECT_CAPABILITY}/${e.definitionRef.definitionHash}`, name: d.name, kind: 'effect', damageTypes: d.effects.direct?.damageTypes || [] }; }
  function pcApproval(ref, { t = target, faces = [5] } = {}) {
    const e = entryFor(ref), d = e.canonicalDefinition;
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence, source: pc, target: t,
      spell: spellOf(e), roll: rollFor(d.effects.direct.formula, faces), price: e.descriptor.price, classPayment: null, effectTerms: effect.termsFor(d) };
  }
  async function approve(a) { const before = actors.clone(live().gameState), r = await ack(owner, 'actor_spell_approve', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); assert.deepEqual(live().gameState, before, 'approval spends nothing'); return r; }
  async function cast(ref, options) { const a = pcApproval(ref, options); await approve(a); return a; }
  /** The GM's command exactly as the client planner builds it for a recorded branch. */
  function command(a, { branch, resolution } = {}) {
    const pay = {}, p = actors.resources(token(a.source), 'character');
    for (const k of ['ap', 'mana']) {if (a.price[k]) {pay[k] = payments.tempFirst(p[k].current, p[k].temp, a.price[k]);}}
    if (!Object.keys(pay).length) {pay.ap = payments.tempFirst(p.ap.current, p.ap.temp, 0);}
    const applies = effect.conditionApplies(a.effectTerms, branch);
    const plan = applies ? effect.conditionPlan(a, token(a.target).state.conditions || []) : { ops: null, combination: null };
    const h = actors.resources(token(a.target), 'creature').hp, amount = a.roll.total, fromTemp = Math.min(h.temp, amount);
    const targetEntry = { ref: a.target, expectedRevision: token(a.target).state.actorContract.revision, ...(applies ? { conditions: plan.ops } : {}),
      finalResources: { hp: { current: Math.max(0, h.current - (amount - fromTemp)), temp: h.temp - fromTemp } } };
    return { ...base(), source: a.source, target: a.target, approval: { approvalId: a.approvalId, contentHash: actors.hash(a) },
      actors: [{ ref: a.source, expectedRevision: token(a.source).state.actorContract.revision, finalResources: pay }, targetEntry],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, finalAmount: amount, adjustmentReason: '',
        chosenResult: JSON.stringify(effect.resultFor(a, resolution || res(a), plan.combination, branch)) } };
  }
  async function accept(c) { const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true, JSON.stringify(r)); return r; }
  async function refused(event, data, code, socket = gm) {
    const before = actors.clone(live().gameState), r = await ack(socket, event, data);
    assert.equal(r.success, false, JSON.stringify(r)); if (code) {assert.equal(r.code, code, JSON.stringify(r));} assert.deepEqual(live().gameState, before, 'nothing changed'); return r;
  }
  const remove = (ref, recordId) => ({ ...base(), actors: [{ ref, expectedRevision: token(ref).state.actorContract.revision, conditions: [{ op: 'remove', recordId }] }],
    adjudication: { definitionId: 'gm-correction', definitionVersionOrHash: 'gm-correction', finalAmount: 0, adjustmentReason: '', chosenResult: 'GM exact removal' } });
  const snapshot = () => ({ hp: hp(target), pools: pools(), conditions: actors.clone(token(target).state.conditions), schedules: actors.clone(lifecycle()?.schedules || null), receipts: actors.ledger(live()).receipts.length });

  it('admission: next start/end and counted expiries compile with the save under their own compiler id; invalid timing is refused with the save selected; manual-expiry save bundles keep theirs', () => {
    for (const [policy, occurrences] of [['target-next-start'], ['target-next-end'], ['target-start-count', 2], ['target-end-count', 10]]) {
      const m = map(wizardRecord({ policy, occurrences })); assert.equal(m.ok, true, m.reason);
      assert.deepEqual(m.definition.effects.save, { scope: 'condition', ...SAVE });
      assert.equal(m.definition.timing.expiryPolicy, policy); assert.equal(m.definition.timing.occurrences, occurrences);
      const c = definitions.compileDefinition(m.definition); assert.equal(c.ok, true, JSON.stringify(c)); assert.equal(c.descriptor.compilerVersion, 'p14-save-branch-timed-1');
    }
    // The selected save never lets an otherwise invalid schedule through (compiler and registry).
    for (const [policy, occurrences, reason] of [['target-start-count', 1, /Occurrences/], ['target-end-count', 11, /Occurrences/], ['target-next-end', 2, /Occurrences/], ['one-round', undefined, /Expiry/]])
    {assert.match(map(wizardRecord({ policy, occurrences })).reason, reason);}
    const good = map(wizardRecord({ policy: 'target-start-count', occurrences: 2 })).definition;
    for (const forge of [t => { t.occurrences = 1; }, t => { delete t.occurrences; }, t => { t.expiryPolicy = 'target-next-start'; }, t => { t.expiryPolicy = 'round-end'; }]) {
      const d = actors.clone(good); forge(d.timing); assert.equal(definitions.compileDefinition(d).ok, false, JSON.stringify(d.timing));
    }
    // Manual-expiry save bundles are unchanged: same definition shape and compiler identity.
    const manual = map(wizardRecord({ policy: 'gm-manual' })); assert.equal(manual.ok, true);
    assert.deepEqual(Object.keys(manual.definition.timing), ['expiryPolicy', 'durationText', 'authoredDuration', 'gmNote']);
    assert.equal(definitions.compileDefinition(manual.definition).descriptor.compilerVersion, 'p14-save-branch-1');
    // Still refused: periodic saves, rider-only saves (D-SV gates unchanged).
    assert.equal(map(wizardRecord({ policy: 'target-next-end', save: { ...SAVE, outcome: 'halves' } })).ok, false);
    // Reconciliation with flat damage reduction: admitting structured expiry does not open a save on a flat-DR or periodic rider —
    // the Wizard compiler and the installed registry each still refuse them on their own (approval: see the 'changed terms' case).
    const dr = wizardRecord({ kind: 'damageReduction' });
    for (const c of [dr.controlConfig.authoredCondition, dr.authoredDraft.controlConfig.authoredCondition]) { Object.assign(c, { drAmount: 3, label: 'Aegis Ward' }); }
    assert.match(map(dr).reason || '', /flat damage-reduction/);
    for (const condition of [DR_RIDER, PERIODIC_RIDER]) {
      const forged = actors.clone(good); forged.effects.condition = condition;
      assert.equal(definitions.compileDefinition(forged).ok, false, JSON.stringify(condition));
      // The same well-formed rider without the save compiles, so the refusal above is the save exclusion itself.
      delete forged.effects.save; if (condition === PERIODIC_RIDER) { forged.timing = { ...forged.timing, expiryPolicy: 'target-start-count', occurrences: 2 }; }
      assert.equal(definitions.compileDefinition(forged).ok, true, JSON.stringify(definitions.compileDefinition(forged)));
    }
  });

  it('saved: payment and direct damage only — no rider, no schedule, and an earlier timed instance of the SAME effect keeps its record and schedule; failed: payment, damage and the timed rider in one receipt; exact first/final boundary', async() => {
    await startCombat([pc, target, other]); await adopt();
    const ref = await admitPc(wizardRecord());
    // Earlier failed cast (seq 0, PC's turn): rider expires at the END of the target's next turn = boundary 2.
    const a = await cast(ref, { faces: [2] }); const r1 = await accept(command(a, { branch: 'failed' }));
    assert.deepEqual(receiptsFor(r1.receipt.commandId).length, 1); assert.equal(hp(target), 45); assert.deepEqual(pools(), { ap: 9, mana: 36 });
    assert.equal(chosen(r1).branch, 'failed'); assert.equal(chosen(r1).conditionApplied, true); assert.equal(chosen(r1).expiryPolicy, 'target-next-end');
    const rec = moves(target)[0]; assert.equal(rec.recordId, a.approvalId); assert.equal(rec.clockBoundary, 'authored-target-next-end'); assert.equal(speed(target), 20);
    assert.deepEqual(scheduled(target).map(i => [i.recordId, i.dueSequence, i.boundary]), [[a.approvalId, 2, 'end']]);
    const held = { conditions: actors.clone(token(target).state.conditions), schedules: actors.clone(lifecycle().schedules) };
    // Saved cast of the same definition: the failed branch would REFRESH that instance; the saved branch touches nothing of it.
    const b = await cast(ref, { faces: [4] }); const r2 = await accept(command(b, { branch: 'saved' }));
    assert.equal(hp(target), 45 - 7); assert.deepEqual(pools(), { ap: 8, mana: 32 });
    assert.deepEqual(token(target).state.conditions, held.conditions, 'no new rider and the earlier instance is untouched');
    assert.deepEqual(lifecycle().schedules, held.schedules, 'no schedule is added, removed or moved by a negated rider');
    assert.deepEqual([chosen(r2).branch, chosen(r2).conditionApplied, chosen(r2).conditionInstanceId], ['saved', false, null]);
    assert.equal(chosen(r2).combination, undefined, 'no hidden refresh plan on the saved branch');
    // Exact first and final boundary: the start of the target's turn (1) keeps it; the end of that turn (2) expires exactly it.
    let step = await advance(); assert.equal(seq(), 1); assert.deepEqual(chosen(step.r).expired, []); assert.equal(speed(target), 20);
    step = await advance(); assert.equal(seq(), 2); assert.deepEqual(chosen(step.r).expired, [a.approvalId]); assert.equal(speed(target), 30, 'base speed restored');
    assert.equal(scheduled(target).length, 0); assert.equal(hp(target), 38, 'expiry changes no HP');
  });

  it('counted expiry: occurrences are counted at the exact target-turn starts and the last one expires the instance; the saved branch never starts a count', async() => {
    await startCombat([pc, target, other]); await adopt();
    const ref = await admitPc(wizardRecord({ name: 'Disposable Hoarfrost Bind', label: 'Hoarfrost Bind', policy: 'target-start-count', occurrences: 2 }));
    const s = await cast(ref); await accept(command(s, { branch: 'saved' })); assert.equal(scheduled(target).length, 0); assert.equal(moves(target).length, 0);
    const a = await cast(ref); await accept(command(a, { branch: 'failed' }));
    assert.deepEqual(scheduled(target).map(i => [i.recordId, i.dueSequence, i.occurrences, i.period]), [[a.approvalId, 4, 2, 3]], 'starts at 1 and 4');
    let step = await advance(); assert.deepEqual(chosen(step.r).counted, [{ recordId: a.approvalId, occurrence: 1, of: 2 }]); assert.deepEqual(chosen(step.r).expired, []);
    step = await advanceTo(3); assert.equal(moves(target).length, 1, 'still active before the last counted start');
    step = await advance(); assert.equal(seq(), 4); assert.deepEqual(chosen(step.r).expired, [a.approvalId]); assert.equal(speed(target), 30);
  });

  it('missing tracking, target outside the roster, retired or stale clock and full schedule capacity refuse BOTH outcomes alike with nothing charged; the approval then executes once', async() => {
    const ref = await admitPc(wizardRecord());
    const a = await cast(ref), both = async code => { for (const branch of ['saved', 'failed']) {await refused('actor_consequence', command(a, { branch }), code);} };
    const start = snapshot();
    await both('effect_schedule_unavailable'); // no combat
    await startCombat([pc, target, other]); await both('effect_schedule_unavailable'); // combat without an authenticated clock
    await ack(gm, 'combat_ended', { roomId: room.id }); await startCombat([pc, other]); await adopt(); await both('effect_schedule_unavailable'); // target outside the exact roster
    await ack(gm, 'combat_ended', { roomId: room.id }); await startCombat([pc, target, other]); await adopt();
    const retiredId = lifecycle().id; await ack(gm, 'combat_ended', { roomId: room.id }); await both('effect_schedule_unavailable'); // retired clock
    await startCombat([pc, target, other]); await adopt(); assert.notEqual(lifecycle().id, retiredId);
    const order = actors.clone(live().gameState.combat.turnOrder); live().gameState.combat.turnOrder.reverse(); // stale clock: roster changed without a boundary
    assert.equal(timing.clock(live().gameState.combat), null); await both(); live().gameState.combat.turnOrder = order;
    for (let i = 0; i < 256; i++) {lifecycle().schedules[`filler-${i}`] = { combatId: lifecycle().id, dueSequence: 1000 + i };}
    await both('effect_schedule_unavailable'); for (let i = 0; i < 256; i++) {delete lifecycle().schedules[`filler-${i}`];}
    for (let i = 0; i < 32; i++) {lifecycle().schedules[`filler-${i}`] = { combatId: lifecycle().id, dueSequence: 2 };} // the rider's own due boundary is full
    await both('effect_schedule_unavailable'); for (let i = 0; i < 32; i++) {delete lifecycle().schedules[`filler-${i}`];}
    assert.deepEqual({ hp: hp(target), pools: pools(), conditions: token(target).state.conditions }, { hp: start.hp, pools: start.pools, conditions: start.conditions }, 'no charge, no HP, no rider');
    assert.ok(payments.get(live(), a.approvalId), 'the owner approval is still pending (never silently converted to manual expiry)');
    const r = await accept(command(a, { branch: 'saved' })); assert.equal(receiptsFor(r.receipt.commandId).length, 1); assert.equal(hp(target), start.hp - 8);
  });

  it('failed-branch combination follows the existing rules: same effect from the same source refreshes with a full new schedule (old boundary cannot remove it); a different named effect adds; GM exact removal cancels its schedule', async() => {
    await startCombat([pc, target, other]); await adopt();
    const ref = await admitPc(wizardRecord({ policy: 'target-end-count', occurrences: 2 }));
    const a = await cast(ref); await accept(command(a, { branch: 'failed' }));
    assert.deepEqual(scheduled(target).map(i => [i.recordId, i.dueSequence]), [[a.approvalId, 5]]);
    await advanceTo(3);
    const b = await cast(ref); const r = await accept(command(b, { branch: 'failed' }));
    assert.deepEqual(chosen(r).combination, { outcome: 'refreshed', replacesInstanceId: a.approvalId });
    assert.deepEqual(moves(target).map(m => m.recordId), [b.approvalId]); assert.equal(speed(target), 20, 'refreshed, not stacked');
    assert.deepEqual(scheduled(target).map(i => [i.recordId, i.dueSequence]), [[b.approvalId, 8]], 'old schedule replaced, full new count from boundary 3');
    await advanceTo(5); assert.deepEqual(moves(target).map(m => m.recordId), [b.approvalId], 'the old final boundary does not remove refreshed work');
    // A different named effect adds under the existing movement policy (both timed).
    const other2 = await admitPc(wizardRecord({ name: 'Disposable Sleet Drag', label: 'Sleet Drag', feet: -5 }));
    const c = await cast(other2); await accept(command(c, { branch: 'failed' })); assert.equal(speed(target), 15); assert.equal(scheduled(target).length, 2);
    // GM exact removal of the refreshed instance cancels its schedule; the later boundary expires nothing of it.
    await accept(remove(target, b.approvalId)); assert.deepEqual(scheduled(target).map(i => i.recordId), [c.approvalId]); assert.equal(speed(target), 25);
    const until = await advanceTo(8); assert.ok(!chosen(until.r).expired.includes(b.approvalId)); assert.equal(moves(target).filter(m => m.recordId === b.approvalId).length, 0);
  });

  it('capacity with a same-source refresh is decided alike for both outcomes (review F1): the slot the refresh would free counts for saved and failed', async() => {
    await startCombat([pc, target, other]); await adopt();
    const ref = await admitPc(wizardRecord());
    const a = await cast(ref); await accept(command(a, { branch: 'failed' })); // due at boundary 2
    const fill = (n, due) => { for (let i = 0; i < n; i++) {lifecycle().schedules[`filler-${i}`] = { combatId: lifecycle().id, dueSequence: due === undefined ? 1000 + i : due };} };
    const clear = n => { for (let i = 0; i < n; i++) {delete lifecycle().schedules[`filler-${i}`];} };
    for (const [n, due] of [[255], [31, 2]]) {
      for (const branch of ['saved', 'failed']) {
        fill(n, due); const b = await cast(ref); const r = await accept(command(b, { branch })); clear(n);
        assert.equal(chosen(r).branch, branch, `${branch} commits at the limit (${n})`);
        if (branch === 'failed') { await accept(remove(target, b.approvalId)); const again = await cast(ref); await accept(command(again, { branch: 'failed' })); }
      }
      // One more filler makes both refuse alike.
      fill(n + 1, due); const c = await cast(ref);
      for (const branch of ['saved', 'failed']) {await refused('actor_consequence', command(c, { branch }), 'effect_schedule_unavailable');}
      clear(n + 1); assert.equal((await ack(owner, 'actor_spell_withdraw', { roomId: room.id, approvalId: c.approvalId })).success, true);
    }
  });

  it('writer refusal: neither payment, HP, rider nor schedule is written; the same command then applies once with its schedule', async() => {
    await startCombat([pc, target, other]); await adopt();
    const ref = await admitPc(wizardRecord()), a = await cast(ref), c = command(a, { branch: 'failed' });
    const admit = writer.admitConsequence; live().isPermanent = true;
    writer.admitConsequence = () => ({ queued: false, code: 'timed_save_writer_refusal' });
    const state = actors.clone(live().gameState), ledgerBefore = actors.clone(actors.ledger(live()));
    const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, false); assert.equal(r.code, 'timed_save_writer_refusal', JSON.stringify(r));
    assert.deepEqual(live().gameState, state); assert.deepEqual(actors.ledger(live()), ledgerBefore); assert.equal(scheduled(target).length, 0);
    writer.admitConsequence = admit; live().isPermanent = false;
    await accept(c); assert.equal(receiptsFor(c.commandId).length, 1); assert.deepEqual(scheduled(target).map(i => i.recordId), [a.approvalId]);
  });

  it('duplicate/lost-ACK cast and boundary replay apply once; reload and checkpoint restore keep the exact schedule; the restored boundary expires once and the original cast receipt is returned', async() => {
    await startCombat([pc, target, other]); await adopt();
    const ref = await admitPc(wizardRecord({ policy: 'target-start-count', occurrences: 2 }));
    const a = await cast(ref, { faces: [6] }), c = command(a, { branch: 'failed' });
    gm.emit('actor_consequence', c); await sleep(150); // ACK lost
    const after = { hp: hp(target), pools: pools(), moves: actors.clone(moves(target)), schedules: actors.clone(lifecycle().schedules) };
    const replay = await ack(gm, 'actor_consequence', c); assert.equal(replay.success, true, JSON.stringify(replay));
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, replay.receipt);
    assert.deepEqual({ hp: hp(target), pools: pools(), moves: moves(target), schedules: lifecycle().schedules }, after, 'nothing paid, damaged, installed or scheduled twice');
    assert.equal(receiptsFor(c.commandId).length, 1);
    // The other branch under the same command id conflicts; a fresh command against the consumed approval refuses.
    await refused('actor_consequence', { ...command(a, { branch: 'saved' }), commandId: c.commandId, actionEpoch: c.actionEpoch, baseCommitSequence: c.baseCommitSequence }, 'command_id_conflict');
    assert.equal((await ack(gm, 'actor_consequence', command(a, { branch: 'saved' }))).success, false);
    // Boundary with a lost ACK counts once.
    const bc = boundary(); gm.emit('actor_turn_boundary', bc); await sleep(80); assert.equal(seq(), 1);
    const first = await ack(gm, 'actor_turn_boundary', bc); assert.equal(first.success, true); assert.equal(seq(), 1);
    assert.deepEqual(JSON.parse(first.receipt.adjudication.chosenResult).counted, [{ recordId: a.approvalId, occurrence: 1, of: 2 }]);
    // Reconnect snapshot consumes nothing; checkpoint round trip into a new runtime keeps the exact anchors.
    assert.equal((await ack(gm, 'actor_snapshot', { roomId: room.id })).success, true);
    const codec = require('../services/roomCheckpoint'), built = codec.buildCheckpointDocuments({ roomId: room.id, gameState: live().gameState, revision: 1 });
    const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])) }); assert.equal(decoded.ok, true);
    const held = actors.clone(lifecycle().schedules);
    server.rooms.set(room.id, { ...live(), gameState: { ...decoded.global, maps: decoded.maps, ...codec.deriveRootMirrors(decoded.maps) }, checkpointRevision: 1 });
    assert.deepEqual(lifecycle().schedules, held); assert.deepEqual(moves(target), after.moves);
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, replay.receipt, 'exact-command recovery after restore returns the original cast receipt');
    assert.deepEqual((await ack(gm, 'actor_turn_boundary', bc)).receipt, first.receipt, 'and the original boundary receipt');
    await advanceTo(3); assert.equal(moves(target).length, 1);
    const last = await advance(); assert.deepEqual(chosen(last.r).expired, [a.approvalId]); assert.equal(speed(target), 30);
    assert.deepEqual((await ack(gm, 'actor_turn_boundary', last.c)).receipt, last.r.receipt); assert.equal(seq(), 4);
    assert.ok(!JSON.stringify(actors.publicReceipt(replay.receipt)).includes('PRIVATE'));
    assert.equal(receiptsFor(c.commandId).length, 1);
  });

  it('changed terms: a GM resolution with other timing needs owner reapproval on either branch; forged approval timing is refused at approval; nothing charged', async() => {
    await startCombat([pc, target, other]); await adopt();
    const ref = await admitPc(wizardRecord({ policy: 'target-end-count', occurrences: 3 }));
    let a = await cast(ref);
    await refused('actor_consequence', command(a, { branch: 'saved', resolution: { ...res(a), timing: { ...a.effectTerms.timing, occurrences: 2 } } }), 'owner_reapproval_required');
    a = await cast(ref);
    await refused('actor_consequence', command(a, { branch: 'failed', resolution: { ...res(a), timing: { ...a.effectTerms.timing, expiryPolicy: 'gm-manual' } } }), 'owner_reapproval_required');
    for (const forge of [t => { t.expiryPolicy = 'gm-manual'; delete t.occurrences; }, t => { t.occurrences = 2; }, t => { t.expiryPolicy = 'target-start-count'; }]) {
      const b = pcApproval(ref); forge(b.effectTerms.timing); const r = await refused('actor_spell_approve', b, null, owner); assert.match(r.code, /authored_effect_mismatch|invalid_spell_approval/);
    }
    // Approval layer on its own (reconciliation with flat DR): a save on a flat-DR or periodic rider is invalid even with a structured expiry.
    for (const condition of [DR_RIDER, PERIODIC_RIDER]) {
      const b = pcApproval(ref); b.effectTerms.condition = condition;
      assert.throws(() => payments.validateApproval(b), e => e.code === 'invalid_spell_approval', JSON.stringify(condition));
      delete b.effectTerms.save; assert.doesNotThrow(() => payments.validateApproval(b), 'without the save the shape check passes');
    }
  });
});
