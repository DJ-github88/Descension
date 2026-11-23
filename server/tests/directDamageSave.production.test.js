/**
 * Direct-damage save (handoff/direct-damage-save/CONTRACT.md) on the production stack: compiler, registry, admission, owner approval,
 * GM confirmation, P7 commit, component-result provenance and trigger qualification. Real handlers, real writer, real binder.
 *
 * Creator policy: D-SV1 = rec. 1 (final-round-down) and D-SV3 = rec. 3 (paid-at-cast) were approved 16 November 2026 for the single-part
 * Direct Damage slice (handoff/direct-damage-save/CREATOR_APPROVAL.md). Rows that exercise the fail-closed boundary or the unapproved
 * round-up alternative switch the policy module's exported readers for THIS file only (`withPolicy`, restored after every test).
 */
const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const installed = require('../services/installedAuthoredAbilities');
const registryCompiler = require('../services/installedDefinitionRegistry');
const payments = require('../services/spellPayments');
const triggers = require('../services/committedTriggers');
const relationships = require('../services/actorRelationships');
const pure = require('../shared/services/authoredAbility');
const clientPure = require('../../vtt-react/src/services/authoredAbility');
const directSave = require('../shared/services/directSave');
const POLICY_MODULES = [require('../shared/services/directSavePolicy'), require('../../vtt-react/src/services/directSavePolicy')];

const once = (s, e) => new Promise(r => s.once(e, r));
const ack = (s, e, d) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error(`ACK timeout: ${e}`)), 5000); s.emit(e, d, r => { clearTimeout(t); resolve(r); }); });
const clone = v => JSON.parse(JSON.stringify(v));

/** TEST-ONLY: substitute the policy readers of both copies of the policy module for this file. */
const originals = POLICY_MODULES.map(m => ({ m, ruleFor: m.ruleFor, approved: m.approved }));
function withPolicy({ halves = null, negates = null } = {}) {
  const rules = { halves, negates };
  for (const { m } of originals) {
    m.ruleFor = outcome => (Object.prototype.hasOwnProperty.call(rules, outcome) ? rules[outcome] : null);
    m.approved = outcome => m.ruleFor(outcome) !== null;
  }
}
function restorePolicy() { for (const o of originals) { o.m.ruleFor = o.ruleFor; o.m.approved = o.approved; } }

/** A one-part Wizard Direct Damage record exactly as the Wizard's DamageEffects/SavingThrowConfig save path writes it. */
function wizardRecord({ name = 'Ember Lance', formula = '1d8+3', save = { ability: 'agility', dc: 14, partial: true }, watch = false, cooldown = false, id = uuid() } = {}) {
  const damageConfig = { damageType: 'direct', elementType: 'ember', formula, resolution: 'DICE' };
  if (save) {
    const cfg = { enabled: true, savingThrowType: save.ability, difficultyClass: save.dc, partialEffect: save.partial, partialEffectFormula: save.formula || 'damage/2',
      directDamageFormula: 'damage/2', dotDamageFormula: 'dot_damage/2', damageFormula: formula, dotFormula: '', damageType: 'direct', hasDotEffect: false };
    Object.assign(damageConfig, { savingThrowConfig: cfg, savingThrow: save.ability, difficultyClass: save.dc, partialEffect: save.partial, partialEffectFormula: cfg.partialEffectFormula });
  }
  const triggerConfig = { global: { logicType: 'AND', compoundTriggers: [] }, effectTriggers: watch ? { damage_direct: { logicType: 'AND', compoundTriggers: [{ id: pure.FOLLOWUP_TRIGGER_ID, category: 'combat', name: 'Follow-up After My Damage', parameters: {} }], targetingOverride: null } } : {},
    conditionalEffects: {}, buffDebuffTriggers: {}, requiredConditions: { enabled: false, logicType: 'AND', conditions: [] }, triggerRole: { mode: 'CONDITIONAL' } };
  const draft = { name, description: 'A lance of ember.', level: 1, spellType: 'ACTION', resolution: 'DICE',
    typeConfig: { school: 'ember', icon: 'spell_fire_flamebolt', castTimeType: 'IMMEDIATE', tags: ['ember'] },
    effectTypes: ['damage'], effectsMap: { damage: true }, damageConfig,
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['enemy'], maxTargets: 1, selectionMethod: 'manual' },
    resourceCost: { actionPoints: 1, mana: 3, components: [] }, durationConfig: { durationType: 'instant' },
    cooldownConfig: cooldown ? { cooldownType: 'authenticated_caster_start', cooldownValue: 2 } : { cooldownType: 'none', cooldownValue: 0 },
    triggerConfig, tags: ['damage'] };
  return Object.assign(clone(draft), { source: 'wizard', isCustom: true, categoryIds: ['offensive'], categories: ['all'], id: `lib-${id}`, authoredDefinitionId: id,
    authoredDraft: clone(draft), serializedData: JSON.stringify(draft) });
}
const unsaved = record => { const r = clone(record); for (const c of [r.damageConfig, r.authoredDraft.damageConfig]) { for (const k of ['savingThrowConfig', 'savingThrow', 'difficultyClass', 'partialEffect', 'partialEffectFormula']) delete c[k]; } r.serializedData = JSON.stringify(r.authoredDraft); return r; };

describe('Direct-damage save - production stack (approved D-SV1 rec. 1 / D-SV3 rec. 3; fail-closed boundary under a disclosed test policy)', function () {
  this.timeout(30000);
  let server, room, gm, owner, observer, writer, target, pc, ownerUid, captured = [];
  const realBind = payments.bindCommand;

  beforeEach(async () => {
    captured = [];
    payments.bindCommand = function (...args) { const entry = realBind.apply(this, args); captured.push({ command: args[2], entry }); return entry; };
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async () => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer });
    await server.start();
    for (const e of ['actor_bind', 'actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_spell_approve', 'actor_spell_withdraw', 'actor_spell_list', 'actor_recovery', 'actor_relationship_set', 'actor_trigger_register']) {
      server.setEventLimits(e, { maxPerMinute: 4000, maxPerSecond: 4000 });
    }
    const gmUid = server.nextUserId(); ownerUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid); server.registerAuthToken('owner', ownerUid); server.registerAuthToken('observer', server.nextUserId());
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect');
    room = await server.seedRoom(gm.id, { gmUserId: gmUid });
    for (const role of ['owner', 'observer']) {
      const s = server.connect({ token: role }); await once(s, 'connect');
      const j = once(s, 'room_joined'); s.emit('join_room', { roomId: room.id, playerName: role, password: '' }); await j;
      if (role === 'owner') owner = s; else observer = s;
    }
    server.setCharacterOwner('c', ownerUid);
    const m = () => room.gameState.maps.default;
    const t = { id: 'target', name: 'Target Creature', creatureId: 'disposable', stats: { maxHp: 40, maxMana: 20, maxAP: 10, speed: 30 },
      state: { currentHp: 30, currentMana: 20, currentActionPoints: 10, tempHealth: 4, tempMana: 0, tempActionPoints: 0, conditions: [] } };
    m().tokens.target = t;
    const tr = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'target' }, snapshotHash: actors.hash(t) });
    assert.equal(tr.success, true, JSON.stringify(tr)); target = tr.ref;
    m().characterTokens.pc = { id: 'pc', ownerUserId: ownerUid, character: { id: 'c', class: 'Arcanoneer', health: { current: 20, max: 30 }, mana: { current: 10, max: 10 },
      actionPoints: { current: 4, max: 4 }, tempMana: 2, tempActionPoints: 1 }, state: { conditions: [] } };
    const pr = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'c' }, snapshotHash: actors.hash(m().characterTokens.pc) });
    assert.equal(pr.success, true, JSON.stringify(pr)); pc = pr.ref;
    const rel = await ack(gm, 'actor_relationship_set', { version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence,
      pairs: [{ a: pc, b: target }], value: 'enemy', expectedRelationshipRevision: relationships.revision(live()) });
    assert.equal(rel.success, true, JSON.stringify(rel));
  });
  afterEach(async () => { restorePolicy(); payments.bindCommand = realBind; gm.disconnect(); owner.disconnect(); observer.disconnect(); await server.stop(); });

  const live = () => server.rooms.get(room.id);
  const token = ref => actors.locate(live(), ref).token;
  const hp = ref => ({ current: token(ref).state.currentHp, temp: token(ref).state.tempHealth });
  const pools = () => { const c = token(pc).character; return { ap: c.actionPoints.current, tempAp: c.tempActionPoints, mana: c.mana.current, tempMana: c.tempMana }; };
  const entryFor = ref => installed.list(live()).entries.find(e => pure.actionId(e.definitionRef) === pure.actionId(ref));
  async function admit(record, definitionVersion = 1) {
    return ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, record, definitionVersion, classId: 'arcanoneer' });
  }
  function rollFor(formula, faces) { const r = pure.readFormula(formula); return { mode: 'physical', dice: [{ sides: r.dice[0].sides, faces }], constant: r.constant, reading: r.reading, total: faces.reduce((a, b) => a + b, r.constant) }; }
  function approvalFor(e, faces, extra = {}) {
    const d = e.canonicalDefinition;
    return Object.assign({ version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence, source: pc, target,
      spell: { definitionId: pure.actionId(e.definitionRef), definitionHash: `${e.descriptor.capabilityId}/${e.definitionRef.definitionHash}`, name: d.name, kind: 'damage', damageTypes: d.effect.damageTypes },
      roll: rollFor(d.effect.formula, faces), price: e.descriptor.price, classPayment: null }, d.save ? { saveTerms: clone(d.save) } : {}, extra);
  }
  /** Exactly what the client planner (spellConsequence.planSpellCommand) prepares, with an override hook for forged fields. */
  function command(a, { branch, finalAmount = a.roll.total, reason = '', applied, chosen = {}, revision } = {}) {
    const p = actors.resources(token(a.source), 'character'), pay = {};
    for (const k of ['ap', 'mana']) if (a.price[k]) pay[k] = payments.tempFirst(p[k].current, p[k].temp, a.price[k]);
    if (!Object.keys(pay).length) pay.ap = payments.tempFirst(p.ap.current, p.ap.temp, 0);
    const amount = applied !== undefined ? applied : a.saveTerms ? directSave.appliedAmount(a.saveTerms, branch, finalAmount) : finalAmount;
    const h = actors.resources(token(a.target), 'creature').hp, fromTemp = Math.min(h.temp, amount);
    return { version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence, source: a.source, target: a.target,
      approval: { approvalId: a.approvalId, contentHash: actors.hash(a) },
      actors: [{ ref: a.source, expectedRevision: token(a.source).state.actorContract.revision, finalResources: pay },
        { ref: a.target, expectedRevision: revision !== undefined ? revision : token(a.target).state.actorContract.revision, finalResources: { hp: { current: Math.max(0, h.current - (amount - fromTemp)), temp: h.temp - fromTemp } } }],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, finalAmount, adjustmentReason: reason,
        chosenResult: JSON.stringify(Object.assign({ capability: pure.CAPABILITY, approvalId: a.approvalId, roll: a.roll, kind: 'damage', damageTypes: a.spell.damageTypes, spellName: a.spell.name, sourceName: 'pc', targetName: 'Target Creature', gmConfirmed: true },
          a.saveTerms ? { save: a.saveTerms, branch, appliedAmount: amount } : {}, chosen)) } };
  }
  const approve = async a => { const r = await ack(owner, 'actor_spell_approve', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); };

  it('shipped policy: exactly the approved rules (halves final-round-down, negates paid-at-cast) with their creator approval reference', () => {
    for (const m of POLICY_MODULES) {
      assert.equal(m.ruleFor('halves'), 'final-round-down'); assert.equal(m.ruleFor('negates'), 'paid-at-cast'); assert.equal(m.ruleFor('other'), null);
      for (const o of ['halves', 'negates']) assert.match(m.POLICY.outcomes[o].creatorApproval.reference, /direct-damage-save\/CREATOR_APPROVAL\.md#creator-approval-16-november-2026/);
    }
    const save = { scope: 'direct', ability: 'agility', dc: 14, outcome: 'halves' };
    assert.deepEqual([0, 1, 2, 6, 7, 9].map(f => directSave.appliedAmount(save, 'saved', f)), [0, 0, 1, 3, 3, 4]);
    assert.deepEqual([0, 7, 9].map(f => directSave.appliedAmount(save, 'failed', f)), [0, 7, 9]);
    assert.equal(directSave.appliedAmount({ ...save, outcome: 'negates' }, 'saved', 9), 0);
  });

  it('fail closed: if the creator policy were unset, both Wizard save outcomes refuse at compile and admission with the creator-decision reason; the record is preserved', async () => {
    withPolicy({});
    for (const partial of [true, false]) {
      const record = wizardRecord({ save: { ability: 'agility', dc: 14, partial } }), before = clone(record);
      const compiled = clientPure.definitionFromWizard(record, { roomId: room.id, definitionVersion: 1, classId: 'arcanoneer' });
      assert.equal(compiled.ok, false);
      assert.match(compiled.reason, partial ? /D-SV1/ : /D-SV3/);
      const r = await admit(record);
      assert.equal(r.success, false, JSON.stringify(r));
      assert.deepEqual(record, before);
    }
    assert.equal(installed.registry(live()).definitions.length, 0);
  });

  it('identity: an unsaved twin compiles to the byte-identical pre-change definition; the saved copy is a different definition and descriptor', () => {
    const record = wizardRecord();
    const saved = pure.definitionFromWizard(record, { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' });
    const plain = pure.definitionFromWizard(unsaved(record), { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(saved.ok, true, saved.reason); assert.equal(plain.ok, true, plain.reason);
    assert.deepEqual(saved.definition.save, { scope: 'direct', ability: 'agility', dc: 14, outcome: 'halves' });
    assert.equal(Object.hasOwn(plain.definition, 'save'), false);
    const a = registryCompiler.compileDefinition(saved.definition), b = registryCompiler.compileDefinition(plain.definition);
    assert.equal(a.ok, true); assert.equal(b.ok, true);
    assert.notEqual(a.definitionHash, b.definitionHash);
    assert.equal(a.descriptor.compilerVersion, 'p14-direct-save-1');
    assert.equal(Object.hasOwn(b.descriptor, 'save'), false);
    // A stored registry with a saved definition still decodes if the policy were later unset (structure only), but cannot be newly admitted.
    withPolicy({});
    assert.equal(registryCompiler.compileDefinition(saved.definition).code, 'DIRECT_SAVE_POLICY_UNANSWERED');
    assert.equal(registryCompiler.compileDefinition(saved.definition, { verifyDirectSavePolicy: false }).ok, true);
  });

  it('unsupported combinations refuse whole and stay preserved: rider + damage save, cooldown, other partial formulas, disagreeing copies, healing', () => {
    const opts = { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' };
    const refused = r => { const out = pure.definitionFromWizard(r, opts); assert.equal(out.ok, false, JSON.stringify(out.definition)); return out.reason; };
    assert.match(refused(wizardRecord({ cooldown: true })), /cooldown/);
    assert.match(refused(wizardRecord({ save: { ability: 'agility', dc: 14, partial: true, formula: 'damage/4' } })), /Half Damage/);
    // A valid M4A scaled formula (compiles without a save) is refused by the save guard, not by its vocabulary.
    assert.equal(pure.definitionFromWizard(unsaved(wizardRecord({ formula: '2d6 + intelligence/3' })), opts).ok, true);
    assert.match(refused(wizardRecord({ formula: '2d6 + intelligence/3' })), /plain NdM/);
    const disagree = wizardRecord(); disagree.damageConfig.difficultyClass = 15; disagree.authoredDraft.damageConfig.difficultyClass = 15; disagree.serializedData = JSON.stringify(disagree.authoredDraft);
    assert.match(refused(disagree), /disagree/);
    // Damage save next to a rider: D-SV2 is not decided, so the bundle keeps refusing whole (rider-local saves are a separate route).
    const rider = wizardRecord();
    for (const target of [rider, rider.authoredDraft]) {
      target.effectTypes = ['control', 'damage']; target.effectsMap = { damage: true, control: true };
      target.controlConfig = { authoredCondition: { profile: 'authored-effect:v1', effect: 'movement', movementFeet: -10, label: 'Hobbled', expiryPolicy: 'gm-manual', durationText: '1 round', gmNote: 'GM removes.' } };
    }
    rider.serializedData = JSON.stringify(rider.authoredDraft);
    assert.match(refused(rider), /save on the direct damage\/healing part/);
    // A save on a healing part has no approved meaning: refused whole.
    const heal = wizardRecord();
    for (const target of [heal, heal.authoredDraft]) {
      const cfg = target.damageConfig; delete target.damageConfig;
      target.effectTypes = ['healing']; target.effectsMap = { healing: true };
      target.healingConfig = Object.assign({ healingType: 'direct', formula: '1d8+3', resolution: 'DICE' }, { savingThrowConfig: cfg.savingThrowConfig, savingThrow: cfg.savingThrow, difficultyClass: cfg.difficultyClass, partialEffect: cfg.partialEffect, partialEffectFormula: cfg.partialEffectFormula });
      target.typeConfig = Object.assign({}, target.typeConfig, { school: undefined }); delete target.typeConfig.school;
    }
    heal.serializedData = JSON.stringify(heal.authoredDraft);
    assert.match(refused(heal), /save on the direct damage\/healing part/);
  });

  it('failed save: full GM final amount, temp HP first, price paid once; exact-command replay returns the same receipt', async () => {
    const r = await admit(wizardRecord()); assert.equal(r.success, true, JSON.stringify(r));
    const e = entryFor(r.definitionRef);
    const a = approvalFor(e, [6]); await approve(a); // 1d8+3 = 9
    const cmd = command(a, { branch: 'failed' });
    const res = await ack(gm, 'actor_consequence', cmd); assert.equal(res.success, true, JSON.stringify(res));
    assert.deepEqual(hp(target), { current: 25, temp: 0 }); // 9: 4 temp, 5 base
    assert.deepEqual(pools(), { ap: 4, tempAp: 0, mana: 9, tempMana: 0 });
    const replay = await ack(gm, 'actor_consequence', cmd);
    assert.equal(replay.success, true); assert.equal(replay.receipt.commandId, res.receipt.commandId);
    assert.deepEqual(hp(target), { current: 25, temp: 0 }); assert.deepEqual(pools(), { ap: 4, tempAp: 0, mana: 9, tempMana: 0 });
  });

  it('saved (halves, candidate rule round-down): odd 9 -> 4 absorbed wholly by temp HP; the component result is the same arithmetic and does not qualify a watch', async () => {
    const r = await admit(wizardRecord({ watch: true })); assert.equal(r.success, true, JSON.stringify(r));
    const e = entryFor(r.definitionRef);
    assert.equal(e.descriptor.compilerVersion, 'p14-direct-save-watch-1');
    const a = approvalFor(e, [6]); await approve(a);
    const res = await ack(gm, 'actor_consequence', command(a, { branch: 'saved' })); assert.equal(res.success, true, JSON.stringify(res));
    assert.deepEqual(hp(target), { current: 30, temp: 0 });
    const { command: bound, entry } = captured[captured.length - 1];
    const results = payments.componentResultsFor(bound, entry);
    assert.equal(results.length, 1);
    assert.deepEqual({ proposed: results[0].proposedAmount, applied: results[0].adjudicatedAmount, base: results[0].baseHpLost, temp: results[0].tempHpAbsorbed, save: results[0].save },
      { proposed: 9, applied: 4, base: 0, temp: 4, save: { terms: a.saveTerms, recorded: 'saved', gmFinalAmount: 9 } });
    const occurrence = triggers.componentOccurrenceOf(live(), { submitterUid: 'gm', commandId: bound.commandId, commitSequence: 1 }, bound, entry, payments, bound.actors);
    assert.equal(occurrence.evidence.baseHpLost, 0);
    assert.deepEqual(occurrence.component.gates.save, { recorded: 'saved', appliesTo: 'effect', outcome: 'halves' });
  });

  it('saved after a GM mitigation ruling: roll 9, GM final 7 (cover) -> 3 (halved once, after the ruling); base HP qualifies only when lost', async () => {
    const r = await admit(wizardRecord({ watch: true })); const e = entryFor(r.definitionRef);
    hp(target); token(target).state.tempHealth = 0; // a plain pool keeps the arithmetic visible
    const a = approvalFor(e, [6]); await approve(a);
    const res = await ack(gm, 'actor_consequence', command(a, { branch: 'saved', finalAmount: 7, reason: 'Half cover: -2' }));
    assert.equal(res.success, true, JSON.stringify(res));
    assert.deepEqual(hp(target), { current: 27, temp: 0 });
    const { command: bound, entry } = captured[captured.length - 1];
    const occurrence = triggers.componentOccurrenceOf(live(), { submitterUid: 'gm', commandId: bound.commandId, commitSequence: 1 }, bound, entry, payments, bound.actors);
    assert.equal(occurrence.evidence.baseHpLost, 3); assert.equal(occurrence.evidence.adjudicatedAmount, 3);
    assert.equal(directSave.appliedAmount(a.saveTerms, 'saved', 1), 0);
    // Only the approved rule is implemented: the presented round-up alternative is not an activatable value.
    for (const m of POLICY_MODULES) assert.deepEqual(m.HALVING_RULES, ['final-round-down']);
  });

  it('saved (negates, candidate rule paid-at-cast): no HP change, the price is paid, the component result records zero loss', async () => {
    const r = await admit(wizardRecord({ save: { ability: 'constitution', dc: 12, partial: false }, watch: true })); assert.equal(r.success, true, JSON.stringify(r));
    const e = entryFor(r.definitionRef); assert.equal(e.canonicalDefinition.save.outcome, 'negates');
    const a = approvalFor(e, [8]); await approve(a);
    const res = await ack(gm, 'actor_consequence', command(a, { branch: 'saved' })); assert.equal(res.success, true, JSON.stringify(res));
    assert.deepEqual(hp(target), { current: 30, temp: 4 });
    assert.deepEqual(pools(), { ap: 4, tempAp: 0, mana: 9, tempMana: 0 });
    const { command: bound, entry } = captured[captured.length - 1];
    assert.deepEqual(payments.componentResultsFor(bound, entry).map(x => [x.adjudicatedAmount, x.baseHpLost, x.tempHpAbsorbed]), [[0, 0, 0]]);
  });

  it('bound terms: a forged branch, applied amount, save term or missing branch refuses with nothing changed; an unanswered outcome refuses at confirmation', async () => {
    const r = await admit(wizardRecord()); const e = entryFor(r.definitionRef);
    const a = approvalFor(e, [6]); await approve(a);
    const before = { hp: hp(target), pools: pools() };
    const attempts = [
      command(a, { branch: 'saved', applied: 9, chosen: { appliedAmount: 9 } }),
      command(a, { branch: 'saved', chosen: { save: { ...a.saveTerms, outcome: 'negates' } } }),
      command(a, { branch: 'partial', applied: 4, chosen: { branch: 'partial', appliedAmount: 4 } }),
      command(a, { branch: 'failed', chosen: { branch: undefined } })
    ];
    for (const cmd of attempts) { const res = await ack(gm, 'actor_consequence', cmd); assert.equal(res.success, false, JSON.stringify(res)); }
    assert.deepEqual({ hp: hp(target), pools: pools() }, before);
    // Owner approval without the admitted save term, or with a different one, is refused.
    const bare = approvalFor(e, [6]); delete bare.saveTerms;
    assert.equal((await ack(owner, 'actor_spell_approve', bare)).success, false);
    const changed = approvalFor(e, [6]); changed.saveTerms = { ...changed.saveTerms, dc: 15 };
    assert.equal((await ack(owner, 'actor_spell_approve', changed)).success, false);
    // The creator policy is read at GM confirmation as well: an approval pending when the rule is unset never applies.
    withPolicy({ halves: null, negates: 'paid-at-cast' });
    const res = await ack(gm, 'actor_consequence', command(a, { branch: 'failed', applied: 9 }));
    assert.equal(res.success, false); assert.equal(res.code, 'direct_save_policy_unanswered', JSON.stringify(res));
    assert.deepEqual({ hp: hp(target), pools: pools() }, before);
  });

  it('stale actor, insufficient resources and writer refusal change nothing; the retry commits once', async () => {
    const r = await admit(wizardRecord()); const e = entryFor(r.definitionRef);
    const a = approvalFor(e, [6]); await approve(a);
    const before = { hp: hp(target), pools: pools() };
    const stale = await ack(gm, 'actor_consequence', command(a, { branch: 'saved', revision: token(target).state.actorContract.revision + 1 }));
    assert.equal(stale.success, false, 'stale ' + JSON.stringify(stale));
    const cmd = command(a, { branch: 'saved' });
    // Writer refusal: the room writer declines the admission of the consequence (same seam as committedTriggers.production.test.js).
    live().isPermanent = true; // checkpoint-eligible room: admission goes through the real writer
    const real = writer.admitConsequence.bind(writer); let retained = null;
    writer.admitConsequence = () => ({ queued: false, code: 'writer_admission_refused' });
    const refused = await ack(gm, 'actor_consequence', cmd); assert.equal(refused.success, false); assert.equal(refused.code, 'writer_admission_refused', JSON.stringify(refused));
    assert.deepEqual({ hp: hp(target), pools: pools() }, before);
    writer.admitConsequence = (roomId, prepare, install, options) => real(roomId, revision => (retained = actors.clone(prepare(revision))), install, options);
    const ok = await ack(gm, 'actor_consequence', cmd); assert.equal(ok.success, true, JSON.stringify(ok));
    assert.deepEqual(hp(target), { current: 30, temp: 0 });
    // Checkpoint recovery: only the retained snapshot survives a "crash"; read back through the real codec, the exact command replays
    // its receipt and applies nothing twice, and the admitted saved definition (with its save term) is still the same definition.
    const codec = require('../services/roomCheckpoint'), built = codec.buildCheckpointDocuments({ roomId: room.id, gameState: retained, revision: 1 });
    const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: built.manifest, globalDoc: built.global.data, mapDocsById: Object.fromEntries(built.maps.map(m => [m.mapId, m.data])) });
    assert.equal(decoded.ok, true, JSON.stringify(decoded));
    server.rooms.set(room.id, { ...live(), gameState: { ...decoded.global, maps: decoded.maps, ...codec.deriveRootMirrors(decoded.maps) }, checkpointRevision: 1 });
    assert.deepEqual(entryFor(r.definitionRef).canonicalDefinition.save, a.saveTerms);
    const replay = await ack(gm, 'actor_consequence', cmd);
    assert.equal(replay.success, true, JSON.stringify(replay)); assert.equal(replay.receipt.commandId, cmd.commandId);
    assert.deepEqual(hp(target), { current: 30, temp: 0 });
    // Insufficient: drain mana below the price, then a fresh approval is refused before anything is staged.
    token(pc).character.mana.current = 0; token(pc).character.tempMana = 0;
    const poor = await ack(owner, 'actor_spell_approve', approvalFor(e, [1]));
    assert.equal(poor.success, false, 'poor ' + JSON.stringify(poor)); assert.equal(poor.code, 'insufficient_resources', JSON.stringify(poor));
  });

  it('review F1: whole-spell occurrence evidence uses the applied amount; a negated save (0 applied) records no adjudicated-amount obligation', async () => {
    const r = await admit(wizardRecord({ save: { ability: 'constitution', dc: 12, partial: false } })); const e = entryFor(r.definitionRef);
    const other = await admit(unsaved(wizardRecord({ name: 'Plain Lance' })));
    const l = await ack(gm, 'actor_trigger_register', { roomId: room.id, requestId: uuid(), expectedRevision: 0, source: pc, definitionRef: entryFor(other.definitionRef).definitionRef,
      on: { occurrence: 'immediate-damage', role: 'source', evidence: 'adjudicatedAmount' } });
    assert.equal(l.success, true, JSON.stringify(l));
    const a = approvalFor(e, [6]); await approve(a);
    assert.equal((await ack(gm, 'actor_consequence', command(a, { branch: 'saved' }))).success, true);
    assert.equal(Object.keys(live().gameState.triggerLedger.obligations).length, 0);
    const half = await admit(wizardRecord({ name: 'Half Lance' })); const h = entryFor(half.definitionRef);
    const b = approvalFor(h, [6]); await approve(b);
    assert.equal((await ack(gm, 'actor_consequence', command(b, { branch: 'saved' }))).success, true);
    assert.deepEqual(Object.values(live().gameState.triggerLedger.obligations).map(o => o.matched.value), [4]);
  });

  it('whole-spell trigger qualification reads the committed pools: a negated or temp-only result records no base HP loss', async () => {
    const r = await admit(wizardRecord({ save: { ability: 'agility', dc: 14, partial: true } })); const e = entryFor(r.definitionRef);
    // The listener belongs to a DIFFERENT admitted ability (a cast never triggers its own listener).
    const other = await admit(unsaved(wizardRecord({ name: 'Plain Lance' }))); assert.equal(other.success, true, JSON.stringify(other));
    const listener = await ack(gm, 'actor_trigger_register', { roomId: room.id, requestId: uuid(), expectedRevision: 0, source: pc, definitionRef: entryFor(other.definitionRef).definitionRef,
      on: { occurrence: 'immediate-damage', role: 'source', evidence: 'baseHpLost' } });
    assert.equal(listener.success, true, JSON.stringify(listener));
    const a = approvalFor(e, [6]); await approve(a);
    assert.equal((await ack(gm, 'actor_consequence', command(a, { branch: 'saved' }))).success, true);
    const ledger = live().gameState.triggerLedger;
    assert.equal(Object.keys(ledger.obligations).length, 0); // 4 absorbed by temp HP: no base HP removed
    const b = approvalFor(e, [6]); await approve(b);
    assert.equal((await ack(gm, 'actor_consequence', command(b, { branch: 'failed' }))).success, true);
    const after = live().gameState.triggerLedger;
    const values = Object.values(after.obligations).map(o => o.matched.value);
    assert.deepEqual(values, [9]); // temp HP was spent by the first cast: all 9 of the failed save is base HP
  });
});
