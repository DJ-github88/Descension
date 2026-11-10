/* Shared GM-recorded save outcomes — Wizard authored-effect:v1 bundle (primary owner PC → one creature), registered production handlers.
 * The table rolls the save; the GM records "saved" or "failed"; the engine applies only the branch the admitted definition supports.
 * Supported shape: one save whose authored outcome negates the bundle's canonical effect only; the direct part applies on both branches.
 * Disposable Wizard records only: different names prove data-driven execution (no per-spell allowlist). */
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
const saveBranch = require('../../vtt-react/src/services/saveBranch');
const classEffect = require('../../vtt-react/src/services/classEffect');
const profile = require('../../vtt-react/src/services/sharedConditionProfile');
const once = (s, e) => new Promise(r => s.once(e, r));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ack = (s, e, d) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error(e)), 5000); s.emit(e, d, r => { clearTimeout(t); resolve(r); }); });

const SAVE = { ability: 'constitution', dc: 12, outcome: 'negates' };
/** Disposable Wizard bundle: direct damage (or healing) + one canonical effect, optionally with a save that negates that effect. */
function wizardRecord({ name = 'Disposable Frost Grip', kind = 'movement', feet = -10, label = 'Frozen Limbs', attribute, amount, policy = 'gm-manual', direct = 'damage', save = SAVE, ap = 1, mana = 4, extra } = {}) {
  const c = { profile: pure.EFFECT_CAPABILITY, effect: kind, ...(kind === 'movement' ? { movementFeet: feet, label } : {}), ...(kind === 'attribute' ? { attribute, attributeAmount: amount, label } : {}),
    expiryPolicy: policy, durationText: 'for 1 round', gmNote: 'The table rolls the Constitution save; the GM records the result and removes the effect.', ...(save ? { save } : {}) };
  const d = { name, description: 'Disposable save-branch test ability', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' },
    effectTypes: direct ? [direct, 'control'] : ['control'], controlConfig: { authoredCondition: c },
    ...(direct === 'damage' ? { damageConfig: { damageType: 'direct', elementType: 'rime', formula: '1d8+3', resolution: 'DICE' } } : {}),
    ...(direct === 'healing' ? { healingConfig: { healingType: 'direct', formula: '2d4', resolution: 'DICE' } } : {}),
    targetingConfig: { targetingType: 'single', rangeType: 'touch', rangeDistance: 5, maxTargets: 1, targetRestrictions: ['enemy'] }, resourceCost: { actionPoints: ap, mana } };
  if (extra) extra(d);
  return { ...actors.clone(d), authoredDraft: d, authoredDefinitionId: uuid() };
}
const rollFor = (formula, faces) => { const r = pure.readFormula(formula); return { mode: 'physical', dice: [{ sides: r.dice[0].sides, faces }], constant: r.constant, reading: r.reading, total: faces.reduce((a, b) => a + b, r.constant) }; };
const map = r => pure.definitionFromWizard(r, { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' });

describe('Shared GM-recorded save outcomes — Wizard bundle, registered production handlers', function() {
  this.timeout(20000);
  let server, room, gm, owner, observer, writer, target, other, pc, ownerUid;
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer }); await server.start();
    for (const e of ['actor_bind', 'actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_spell_prepare_creature', 'actor_spell_approve', 'actor_spell_withdraw', 'actor_spell_list', 'actor_recovery'])
      server.setEventLimits(e, { maxPerMinute: 4000, maxPerSecond: 4000 });
    const gmUid = server.nextUserId(); ownerUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid); server.registerAuthToken('owner', ownerUid); server.registerAuthToken('observer', server.nextUserId());
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: gmUid });
    for (const role of ['owner', 'observer']) { const s = server.connect({ token: role }); await once(s, 'connect'); const j = once(s, 'room_joined'); s.emit('join_room', { roomId: room.id, playerName: role, password: '' }); await j; if (role === 'owner') owner = s; else observer = s; }
    server.setCharacterOwner('c', ownerUid);
    const m = () => room.gameState.maps.default;
    for (const id of ['target', 'other']) {
      const t = { id, name: id, creatureId: 'disposable', stats: { maxHp: 40, maxMana: 20, maxAP: 10, speed: 30 }, authoredAbility: { schemaVersion: 1, record: wizardRecord(), librarySpellId: null },
        state: { currentHp: 30, currentMana: 20, currentActionPoints: 10, tempHealth: 4, tempMana: 0, tempActionPoints: 0, conditions: [] } };
      m().tokens[id] = t;
      const r = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: id }, snapshotHash: actors.hash(t) });
      assert.equal(r.success, true, JSON.stringify(r)); if (id === 'target') target = r.ref; else other = r.ref;
    }
    m().characterTokens.pc = { id: 'pc', ownerUserId: ownerUid, character: { id: 'c', class: 'Arcanoneer', health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, tempMana: 2, tempActionPoints: 1 }, state: { conditions: [] } };
    pc = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'c' }, snapshotHash: actors.hash(m().characterTokens.pc) })).ref;
    assert.ok(pc);
  });
  afterEach(async() => { gm.disconnect(); owner.disconnect(); observer.disconnect(); await server.stop(); });

  const live = () => server.rooms.get(room.id);
  const token = ref => actors.locate(live(), ref).token;
  const base = () => ({ version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence });
  const hp = ref => ({ current: token(ref).state.currentHp, temp: token(ref).state.tempHealth });
  const pools = () => { const c = token(pc).character; return { ap: c.actionPoints.current, tempAp: c.tempActionPoints, mana: c.mana.current, tempMana: c.tempMana }; };
  const speed = ref => profile.movementBreakdown(30, token(ref).state.conditions).result;
  const moves = ref => token(ref).state.conditions.filter(profile.isMovementModifier);
  const chosen = r => JSON.parse(r.receipt.adjudication.chosenResult);
  const receiptsFor = commandId => actors.ledger(live()).receipts.filter(x => x.commandId === commandId);
  async function admitPc(record) {
    const r = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, record, definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(r.success, true, JSON.stringify(r)); return r.definitionRef;
  }
  const entryFor = ref => installed.list(live()).entries.find(e => pure.actionId(e.definitionRef) === pure.actionId(ref));
  const res = a => ({ gmConfirmed: true, timing: a.effectTerms.timing, timingNote: 'GM: touch range and exact target confirmed', evidence: 'PRIVATE GM evidence: table save d20 rolled by the player' });
  function spellOf(e) { const d = e.canonicalDefinition; return { definitionId: pure.actionId(e.definitionRef), definitionHash: `${pure.EFFECT_CAPABILITY}/${e.definitionRef.definitionHash}`, name: d.name, kind: 'effect', damageTypes: d.effects.direct?.damageTypes || [] }; }
  function pcApproval(ref, { t = target, faces = [5], terms } = {}) {
    const e = entryFor(ref), d = e.canonicalDefinition;
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence, source: pc, target: t,
      spell: spellOf(e), roll: d.effects.direct ? rollFor(d.effects.direct.formula, faces) : null, price: e.descriptor.price, classPayment: null, effectTerms: terms || effect.termsFor(d) };
  }
  async function approve(a) { const before = actors.clone(live().gameState), r = await ack(owner, 'actor_spell_approve', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); assert.deepEqual(live().gameState, before, 'approval spends nothing'); return r; }
  /** The GM's command exactly as the client planner builds it for a recorded branch (forgeable fields overridable). */
  function command(a, { branch, amount, reason = '', resolution, conditions, result } = {}) {
    const pay = {}, p = actors.resources(token(a.source), 'character');
    for (const k of ['ap', 'mana']) if (a.price[k]) pay[k] = payments.tempFirst(p[k].current, p[k].temp, a.price[k]);
    if (!Object.keys(pay).length) pay.ap = payments.tempFirst(p.ap.current, p.ap.temp, 0);
    const applies = effect.conditionApplies(a.effectTerms, branch);
    const plan = applies ? effect.conditionPlan(a, token(a.target).state.conditions || []) : { ops: null, combination: null };
    const finalAmount = amount ?? a.roll.total, h = actors.resources(token(a.target), 'creature').hp, fromTemp = Math.min(h.temp, finalAmount);
    const targetEntry = { ref: a.target, expectedRevision: token(a.target).state.actorContract.revision, ...(conditions !== undefined ? (conditions ? { conditions } : {}) : applies ? { conditions: plan.ops } : {}),
      finalResources: { hp: a.effectTerms.direct.kind === 'damage' ? { current: Math.max(0, h.current - (finalAmount - fromTemp)), temp: h.temp - fromTemp } : { current: Math.min(h.max, h.current + finalAmount), temp: h.temp } } };
    return { ...base(), source: a.source, target: a.target, approval: { approvalId: a.approvalId, contentHash: actors.hash(a) },
      actors: [{ ref: a.source, expectedRevision: token(a.source).state.actorContract.revision, finalResources: pay }, targetEntry],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, finalAmount, adjustmentReason: reason,
        chosenResult: JSON.stringify(result || effect.resultFor(a, resolution || res(a), plan.combination, branch)) } };
  }
  async function accept(c) { const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true, JSON.stringify(r)); return r; }
  async function refused(event, data, code, socket = gm) {
    const before = actors.clone(live().gameState), r = await ack(socket, event, data);
    assert.equal(r.success, false, JSON.stringify(r)); if (code) assert.equal(r.code, code, JSON.stringify(r)); assert.deepEqual(live().gameState, before, 'nothing changed'); return r;
  }
  const withdraw = a => ack(owner, 'actor_spell_withdraw', { roomId: room.id, approvalId: a.approvalId });

  it('compiler: a rider-local "negates" save compiles under its own compiler; every other save shape stays manual with a reason; bundles without a save keep A10 bytes', () => {
    const saved = map(wizardRecord());
    assert.equal(saved.ok, true, saved.reason);
    assert.deepEqual(saved.definition.effects, { direct: { kind: 'damage', formula: '1d8+3', damageTypes: ['rime'] }, condition: { kind: 'movement', feet: -10, label: 'Frozen Limbs' },
      save: { scope: 'condition', ability: 'constitution', dc: 12, outcome: 'negates' } });
    const c = definitions.compileDefinition(saved.definition); assert.equal(c.ok, true, JSON.stringify(c)); assert.equal(c.descriptor.compilerVersion, 'p14-save-branch-1');
    // Stunned and attribute riders use the same branch; healing + rider too.
    for (const r of [wizardRecord({ kind: 'stunned' }), wizardRecord({ kind: 'attribute', attribute: 'agility', amount: -2, label: 'Numbed' }), wizardRecord({ direct: 'healing', kind: 'stunned' })]) {
      const m = map(r); assert.equal(m.ok, true, m.reason); assert.equal(definitions.compileDefinition(m.definition).descriptor.compilerVersion, 'p14-save-branch-1');
    }
    // No save: A10 terms, result and compiler identity unchanged.
    const plain = map(wizardRecord({ save: null })); assert.equal(plain.ok, true); assert.equal(Object.hasOwn(plain.definition.effects, 'save'), false);
    assert.equal(definitions.compileDefinition(plain.definition).descriptor.compilerVersion, 'p14-a10-effect-1');
    assert.deepEqual(Object.keys(effect.termsFor(plain.definition)), ['direct', 'condition', 'timing']);
    // Refused shapes (whole ability stays manual).
    const reasons = [
      [{ save: { ...SAVE, outcome: 'halves' } }, /halves\/partial outcomes await a creator decision/],
      [{ save: { ...SAVE, outcome: 'half_damage' } }, /await a creator decision/],
      [{ save: { ability: 'constitution', outcome: 'negates' } }, /authoredEffect\.save|DC/],
      [{ save: { ...SAVE, dc: 0 } }, /DC from 1 to 40/], [{ save: { ...SAVE, dc: 41 } }, /DC from 1 to 40/], [{ save: { ...SAVE, ability: 'wisdom' } }, /saving ability/],
      [{ save: { ...SAVE, scope: 'direct' } }, /authoredEffect\.save/],
      [{ direct: null, kind: 'stunned' }, /rider-only save stays manual/],
      [{ extra: d => { d.damageConfig.savingThrowConfig = { enabled: true, savingThrowType: 'agility', difficultyClass: 14, partialEffect: true, partialEffectFormula: 'damage/2' }; d.damageConfig.savingThrow = 'agility'; } }, /save on the direct damage\/healing part .*creator decision/],
      [{ save: null, extra: d => { d.damageConfig.savingThrowConfig = { enabled: true, savingThrowType: 'agility', difficultyClass: 14, partialEffect: false }; } }, /save on the direct damage\/healing part/]
    ];
    for (const [options, reason] of reasons) { const m = map(wizardRecord(options)); assert.equal(m.ok, false, JSON.stringify(options)); assert.match(m.reason, reason); }
    const periodic = wizardRecord({ save: SAVE, extra: d => { Object.assign(d.controlConfig.authoredCondition, { effect: 'periodic', periodicKind: 'damage', periodicFormula: '1d4', periodicDamageType: 'rime', tickRoll: 'each-tick', label: 'Rime', expiryPolicy: 'target-next-start' }); delete d.controlConfig.authoredCondition.movementFeet; } });
    assert.match(map(periodic).reason, /periodic effect stays manual/);
    // Review F1 closed by the timed save branch (p14TimedSaveBranch): a structured expiry now compiles under its own compiler id;
    // the manual-expiry save bundle keeps 'p14-save-branch-1'. A forged/invalid timing is still refused by the registry.
    for (const policy of ['target-next-start', 'target-next-end']) { const m = map(wizardRecord({ policy })); assert.equal(m.ok, true, m.reason); assert.equal(definitions.compileDefinition(m.definition).descriptor.compilerVersion, 'p14-save-branch-timed-1'); }
    { const d = actors.clone(saved.definition); d.timing.expiryPolicy = 'one-round'; assert.equal(definitions.compileDefinition(d).ok, false, 'registry refuses an unknown expiry with a save'); }
    // A forged definition cannot carry another scope/outcome or a save without a direct part.
    for (const forge of [s => { s.save.scope = 'direct'; }, s => { s.save.outcome = 'halves'; }, s => { s.direct = null; }, s => { s.save.dc = 12.5; }, s => { s.save.extra = 1; }]) {
      const d = actors.clone(saved.definition); forge(d.effects); assert.equal(definitions.compileDefinition(d).ok, false, JSON.stringify(d.effects));
    }
  });

  it('saved: payment and direct damage apply, the negated rider installs nothing — an earlier rider on the target is untouched', async() => {
    const ref = await admitPc(wizardRecord());
    // An unrelated earlier rider from another ability stays exactly as it was.
    const earlier = await admitPc(wizardRecord({ name: 'Disposable Mire', label: 'Mired', feet: -5, save: null, ap: 0, mana: 0 }));
    const e1 = pcApproval(earlier); await approve(e1); await accept(command(e1));
    const before = actors.clone(moves(target)); assert.equal(speed(target), 25);
    const a = pcApproval(ref, { faces: [5] }); await approve(a);
    assert.deepEqual(a.effectTerms.save, { scope: 'condition', ability: 'constitution', dc: 12, outcome: 'negates' }, 'the save is part of the owner-approved terms');
    const r = await accept(command(a, { branch: 'saved' }));
    assert.deepEqual(hp(target), { current: 26 - 8, temp: 0 }, 'after the earlier cast (8, temporary HP first) another 8 damage');
    assert.deepEqual(pools(), { ap: 4, tempAp: 0, mana: 8, tempMana: 0 }, 'AP 1 and mana 4 paid, temporary first');
    assert.deepEqual(moves(target), before, 'the saved branch adds nothing and leaves the earlier rider alone'); assert.equal(speed(target), 25);
    const c = chosen(r); assert.equal(c.branch, 'saved'); assert.equal(c.conditionApplied, false); assert.equal(c.conditionInstanceId, null); assert.deepEqual(c.save, a.effectTerms.save);
    assert.equal(receiptsFor(r.receipt.commandId).length, 1);
  });

  it('failed: payment, direct damage and the rider install in one receipt; a second failed cast refreshes (A11) instead of stacking', async() => {
    const ref = await admitPc(wizardRecord());
    const a = pcApproval(ref, { faces: [2] }); await approve(a);
    const r = await accept(command(a, { branch: 'failed', amount: 4, reason: 'GM: cover ruling −1' }));
    assert.deepEqual(hp(target), { current: 30, temp: 0 }); assert.equal(speed(target), 20); assert.equal(moves(target).length, 1);
    const c = chosen(r); assert.equal(c.branch, 'failed'); assert.equal(c.conditionApplied, true); assert.equal(c.conditionInstanceId, a.approvalId);
    assert.equal(moves(target)[0].recordId, a.approvalId); assert.equal(moves(target)[0].effectDefinition, a.spell.definitionId);
    const b = pcApproval(ref, { faces: [1] }); await approve(b);
    const r2 = await accept(command(b, { branch: 'failed' }));
    assert.equal(moves(target).length, 1); assert.equal(moves(target)[0].recordId, b.approvalId); assert.equal(speed(target), 20, 'refreshed, value not stacked');
    assert.deepEqual(chosen(r2).combination, { outcome: 'refreshed', replacesInstanceId: a.approvalId });
    // GM exact removal restores base speed.
    await accept({ ...base(), actors: [{ ref: target, expectedRevision: token(target).state.actorContract.revision, conditions: [{ op: 'remove', recordId: b.approvalId }] }],
      adjudication: { definitionId: 'gm-correction', definitionVersionOrHash: 'gm-correction', finalAmount: 0, adjustmentReason: '', chosenResult: 'GM exact removal' } });
    assert.equal(speed(target), 30);
  });

  it('saved branch is not blocked by a rider combination it never installs; failed branch still refuses that combination with nothing spent', async() => {
    // Same label from another definition → A11 refuses the rider. Saved must still apply (no rider), failed must refuse whole.
    const ref = await admitPc(wizardRecord());
    const rival = await admitPc(wizardRecord({ name: 'Disposable Rival Grip', save: null, ap: 0, mana: 0 }));
    const x = pcApproval(rival); await approve(x); await accept(command(x));
    const a = pcApproval(ref); await approve(a);
    const fail = await refused('actor_consequence', command(a, { branch: 'failed', conditions: [{ op: 'add', recordId: a.approvalId, record: effect.recordFor(a) }], result: effect.resultFor(a, res(a), { outcome: 'added', replacesInstanceId: null }, 'failed') }));
    assert.match(fail.code, /modifier|combination|label|refus/);
    await accept(command(a, { branch: 'saved' })); assert.equal(moves(target).length, 1);
  });

  it('forged outcome and scope refuse with nothing spent: unbound or missing branch, branch/ops disagreement, forged save terms, PC target, creature source', async() => {
    const ref = await admitPc(wizardRecord());
    const a = pcApproval(ref); await approve(a);
    for (const branch of [undefined, 'applied', 'halved', 'SAVED']) {
      await refused('actor_consequence', command(a, { branch: 'saved', result: { ...effect.resultFor(a, res(a), null, 'saved'), branch } }), 'save_branch_unbound');
    }
    // A saved result with the rider operations, or a failed result without them.
    await refused('actor_consequence', command(a, { branch: 'saved', conditions: [{ op: 'add', recordId: a.approvalId, record: effect.recordFor(a) }] }), 'approval_mismatch');
    await refused('actor_consequence', command(a, { branch: 'failed', conditions: null }), 'approval_mismatch');
    // A result that claims the rider was not applied on "failed", or carries a different save.
    await refused('actor_consequence', command(a, { branch: 'failed', result: { ...effect.resultFor(a, res(a), { outcome: 'added', replacesInstanceId: null }, 'failed'), conditionApplied: false } }), 'modifier_combination_changed');
    await refused('actor_consequence', command(a, { branch: 'saved', result: { ...effect.resultFor(a, res(a), null, 'saved'), save: { ...a.effectTerms.save, dc: 8 } } }), 'approval_mismatch');
    // Forged approval terms: another scope, outcome, DC, or the save dropped.
    for (const [forge, code] of [[s => { s.save.scope = 'direct'; }, 'invalid_spell_approval'], [s => { s.save.outcome = 'halves'; }, 'invalid_spell_approval'],
[s => { s.timing.expiryPolicy = 'target-next-end'; }, 'authored_effect_mismatch'],
            [s => { s.save.dc = 10; }, 'authored_effect_mismatch'], [s => { s.save.ability = 'agility'; }, 'authored_effect_mismatch'], [s => { delete s.save; }, 'authored_effect_mismatch']]) {
      const terms = actors.clone(a.effectTerms); forge(terms);
      await refused('actor_spell_approve', pcApproval(ref, { terms }), code, owner);
    }
    // No PC target, no creature source.
    server.setCharacterOwner('c2', ownerUid);
    live().gameState.maps.default.characterTokens.pc2 = { id: 'pc2', ownerUserId: ownerUid, character: { id: 'c2', class: 'Arcanoneer', health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 } }, state: { conditions: [] } };
    const pc2 = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc2', ownerUid, characterId: 'c2' }, snapshotHash: actors.hash(live().gameState.maps.default.characterTokens.pc2) })).ref;
    await refused('actor_spell_approve', pcApproval(ref, { t: pc2 }), 'pc_target_save_unsupported', owner);
    token(other).authoredAbility.record = wizardRecord();
    const r = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, source: other, expectedSourceRevision: token(other).state.actorContract.revision, definitionVersion: 1 });
    assert.equal(r.success, false); assert.equal(r.code, 'unsupported_source_route', JSON.stringify(r));
    // The original approval still executes exactly once afterwards.
    await accept(command(a, { branch: 'failed' })); assert.equal(speed(target), 20);
  });

  it('stale and changed terms: target switch, stale target or source, changed timing and changed amount without reason refuse whole; no target switch between branch and commit', async() => {
    const ref = await admitPc(wizardRecord());
    let a = pcApproval(ref); await approve(a);
    const untouched = () => ({ hp: hp(target), other: hp(other), pools: pools(), moves: moves(target).length, receipts: actors.ledger(live()).receipts.length });
    let start = untouched();
    // Target switch after the branch is chosen: same command shape aimed at another creature.
    const switched = command(a, { branch: 'saved' }); switched.target = other; switched.actors[1].ref = other; switched.actors[1].expectedRevision = token(other).state.actorContract.revision;
    await refused('actor_consequence', switched, 'approval_mismatch'); assert.deepEqual(untouched(), start);
    const switchedFailed = command(a, { branch: 'failed' }); switchedFailed.target = other; switchedFailed.actors[1].ref = other; switchedFailed.actors[1].expectedRevision = token(other).state.actorContract.revision;
    await refused('actor_consequence', switchedFailed); assert.deepEqual(untouched(), start);
    // Changed timing in the GM resolution → the owner must approve again.
    await refused('actor_consequence', command(a, { branch: 'failed', resolution: { ...res(a), timing: { ...a.effectTerms.timing, durationText: 'for 3 rounds' } } }), 'owner_reapproval_required');
    // That consent is closed (changed terms follow the existing reapproval path); the owner approves again.
    assert.equal((await ack(gm, 'actor_consequence', command(a, { branch: 'failed' }))).code, 'approval_owner_reapproval_required');
    a = pcApproval(ref); await approve(a); start = untouched();
    // A different final amount without a reason.
    await refused('actor_consequence', command(a, { branch: 'saved', amount: 2 }), 'adjustment_reason_required');
    // Target revision moved after the command was built.
    const built = command(a, { branch: 'failed' });
    await accept({ ...base(), actors: [{ ref: target, expectedRevision: token(target).state.actorContract.revision, finalResources: { hp: { current: 29, temp: 4 } } }], adjudication: { definitionId: 'gm-correction', definitionVersionOrHash: 'gm-correction', finalAmount: 0, adjustmentReason: '', chosenResult: 'GM correction' } });
    start = untouched(); const r1 = await ack(gm, 'actor_consequence', { ...built, baseCommitSequence: actors.ledger(live()).commitSequence });
    assert.equal(r1.success, false, JSON.stringify(r1)); assert.deepEqual(untouched(), start);
    // Recreated source incarnation refuses.
    assert.equal((await withdraw(a)).success, true);
    a = pcApproval(ref); await approve(a); const c = command(a, { branch: 'saved' });
    start = untouched(); const sc = token(pc).state.actorContract, kept = sc.instanceId; sc.instanceId = uuid();
    const r2 = await ack(gm, 'actor_consequence', c); assert.equal(r2.success, false, JSON.stringify(r2)); sc.instanceId = kept; assert.deepEqual(untouched(), start);
    // Non-GM cannot record the outcome.
    await refused('actor_consequence', c, null, owner);
    await accept(c);
  });

  it('writer refusal changes nothing (payment, HP, rider, receipts); the same command then applies once', async() => {
    const ref = await admitPc(wizardRecord()), a = pcApproval(ref); await approve(a);
    const c = command(a, { branch: 'failed' });
    const admit = writer.admitConsequence; live().isPermanent = true;
    writer.admitConsequence = () => ({ queued: false, code: 'save_branch_writer_refusal' });
    const state = actors.clone(live().gameState), ledgerBefore = actors.clone(actors.ledger(live()));
    const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, false); assert.equal(r.code, 'save_branch_writer_refusal', JSON.stringify(r));
    assert.deepEqual(live().gameState, state); assert.deepEqual(actors.ledger(live()), ledgerBefore); assert.equal(receiptsFor(c.commandId).length, 0);
    writer.admitConsequence = admit; live().isPermanent = false;
    await accept(c); assert.equal(speed(target), 20); assert.equal(receiptsFor(c.commandId).length, 1);
  });

  it('exact-command replay: a lost ACK applies once and returns the original receipt; a changed branch under the same command id conflicts; the consumed approval refuses a fresh branch', async() => {
    const ref = await admitPc(wizardRecord()), a = pcApproval(ref, { faces: [6] }); await approve(a);
    const c = command(a, { branch: 'saved' });
    gm.emit('actor_consequence', c); await sleep(150); // ACK lost
    const after = { hp: hp(target), pools: pools(), moves: moves(target).length };
    assert.deepEqual(after.hp, { current: 25, temp: 0 }); assert.equal(after.moves, 0);
    const replay = await ack(gm, 'actor_consequence', c); assert.equal(replay.success, true, JSON.stringify(replay));
    const replay2 = await ack(gm, 'actor_consequence', c); assert.deepEqual(replay2.receipt, replay.receipt);
    assert.deepEqual({ hp: hp(target), pools: pools(), moves: moves(target).length }, after, 'replay applies nothing again (no save reroll, no re-payment)');
    assert.equal(receiptsFor(c.commandId).length, 1); assert.equal(chosen(replay).branch, 'saved');
    // The same command id cannot carry the other branch.
    const other = command(a, { branch: 'failed' });
    await refused('actor_consequence', { ...other, commandId: c.commandId, actionEpoch: c.actionEpoch, baseCommitSequence: c.baseCommitSequence }, 'command_id_conflict');
    // A fresh command for the consumed approval is refused: the recorded branch cannot be replaced.
    const fresh = await ack(gm, 'actor_consequence', command(a, { branch: 'failed' })); assert.equal(fresh.success, false, JSON.stringify(fresh));
    assert.deepEqual({ hp: hp(target), pools: pools(), moves: moves(target).length }, after);
  });

  it('privacy and retained dice: public receipt and observer snapshot carry the branch and save but no private GM evidence; recorded faces equal the owner-approved faces', async() => {
    const ref = await admitPc(wizardRecord()), a = pcApproval(ref, { faces: [7] }); await approve(a);
    const r = await accept(command(a, { branch: 'failed' }));
    const pub = actors.publicReceipt(actors.ledger(live()).receipts.at(-1)), text = JSON.stringify(pub);
    assert.ok(!text.includes('PRIVATE'), 'GM evidence stays server-side'); assert.ok(!text.includes('approvalHash'));
    const pc_ = JSON.parse(pub.adjudication.chosenResult); assert.equal(pc_.branch, 'failed'); assert.deepEqual(pc_.save, a.effectTerms.save); assert.equal(pc_.resolution.evidence, undefined);
    assert.deepEqual(chosen(r).roll, a.roll, 'the retained owner roll is the recorded roll'); assert.deepEqual(chosen(r).roll.dice[0].faces, [7]);
    const view = await ack(observer, 'actor_snapshot', { roomId: room.id }); assert.equal(view.success, true); assert.ok(!JSON.stringify(view).includes('PRIVATE'));
    const list = await ack(observer, 'actor_spell_list', { roomId: room.id }); assert.ok(!JSON.stringify(list || {}).includes('PRIVATE'));
  });

  it('existing routes unchanged: no-save bundles keep A10 results; M1 class-effect branches resolve identically through the shared module', async() => {
    const ref = await admitPc(wizardRecord({ save: null })), a = pcApproval(ref); await approve(a);
    assert.equal(Object.hasOwn(a.effectTerms, 'save'), false);
    const result = effect.resultFor(a, res(a), { outcome: 'added', replacesInstanceId: null });
    for (const k of ['branch', 'save', 'conditionApplied']) assert.equal(Object.hasOwn(result, k), false);
    // A branch on a no-save bundle is refused (exact result binding).
    await refused('actor_consequence', command(a, { result: { ...result, branch: 'failed' } }), 'modifier_combination_changed');
    const r = await accept(command(a)); assert.equal(chosen(r).conditionInstanceId, a.approvalId); assert.equal(speed(target), 20);
    // M1 shape through the shared module.
    const m1 = { save: { ability: 'constitution', dc: 12, outcome: 'negates', scope: 'debuffConfig' } };
    assert.deepEqual(classEffect.branches(m1), ['saved', 'failed']); assert.deepEqual(classEffect.branches({ save: null }), ['applied']);
    assert.equal(classEffect.riderApplies(m1, 'saved'), false); assert.equal(classEffect.riderApplies(m1, 'failed'), true); assert.equal(classEffect.riderApplies({ save: null }, 'applied'), true);
    assert.equal(classEffect.riderApplies(m1, 'applied'), false); assert.equal(saveBranch.validSave(m1.save, ['condition']), false, 'scopes do not cross lanes');
  });
});
