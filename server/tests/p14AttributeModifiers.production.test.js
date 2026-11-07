/** Shared attribute buff/debuff (flat Agility family) through the registered production stack:
 * Wizard record -> admission -> owner approval / target consent -> one atomic P7 command -> exact record ->
 * supported consumers (v2 formula, basic strike) revalidate -> GM removal / counted expiry. Disposable fixtures only. */
const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const installed = require('../services/installedAuthoredAbilities');
const registry = require('../services/installedDefinitionRegistry');
const payments = require('../services/spellPayments');
const strikes = require('../services/strikeApprovals');
const pure = require('../shared/services/authoredAbility');
const effect = require('../shared/services/authoredEffect');
const profile = require('../shared/services/sharedConditionProfile');
const timing = require('../shared/services/sharedEffectTiming');
const once = (s, e) => new Promise(r => s.once(e, r));
const ack = (s, e, d) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error(e)), 5000); s.emit(e, d, r => { clearTimeout(t); resolve(r); }); });

/** A whole-Wizard record of the shape the Spell Wizard saves: one Agility change, optional direct part. */
function attributeRecord({ name = 'Disposable Quickening', amount = 2, label = 'Quickened', policy = 'gm-manual', occurrences, attribute = 'agility', ap = 1, mana = 2, extra } = {}) {
  const c = { profile: pure.EFFECT_CAPABILITY, effect: 'attribute', attribute, attributeAmount: amount, label, expiryPolicy: policy, ...(occurrences !== undefined ? { occurrences } : {}),
    durationText: 'While the charm holds', gmNote: 'GM resolves eligibility, range and any save before confirming success.' };
  const d = { name, description: 'Attribute-family disposable test', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE' },
    effectTypes: ['control'], controlConfig: { authoredCondition: c },
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: ap, mana } };
  if (extra) extra(d);
  return { ...actors.clone(d), authoredDraft: d, authoredDefinitionId: uuid() };
}
function formulaRecord(formula = '1d6 + agility') {
  const d = { name: 'Disposable Quick Bolt', description: 'Single direct effect.', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE', school: 'arcane' }, effectTypes: ['damage'],
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] },
    resourceCost: { actionPoints: 1, resourceTypes: ['mana'], resourceValues: { mana: 1 } }, damageConfig: { damageType: 'direct', elementType: 'arcane', formula, resolution: 'DICE' } };
  return Object.assign({}, actors.clone(d), { authoredDefinitionId: uuid(), authoredDraft: actors.clone(d) });
}
const gmEdit = (ops, note = 'GM correction') => ({ conditions: ops, adjudication: { definitionId: 'gm-correction', definitionVersionOrHash: 'gm-correction', finalAmount: 0, adjustmentReason: '', chosenResult: note } });

describe('Attribute buff/debuff (flat Agility) — registered production handlers', function() {
  this.timeout(30000);
  let server, room, gm, owner, observer, tgtOwner, writer, foe, pc, pc2, ownerUid, tgtUid;
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer }); await server.start();
    for (const e of ['actor_bind', 'actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_spell_approve', 'actor_spell_withdraw', 'actor_spell_target_respond',
      'actor_turn_boundary', 'combat_started', 'actor_strike_approve', 'actor_strike_list']) server.setEventLimits(e, { maxPerMinute: 4000, maxPerSecond: 4000 });
    const gmUid = server.nextUserId(); ownerUid = server.nextUserId(); tgtUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid); server.registerAuthToken('owner', ownerUid); server.registerAuthToken('observer', server.nextUserId()); server.registerAuthToken('tgt', tgtUid);
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: gmUid });
    for (const role of ['owner', 'observer', 'tgt']) {
      const s = server.connect({ token: role }); await once(s, 'connect'); const j = once(s, 'room_joined'); s.emit('join_room', { roomId: room.id, playerName: role, password: '' }); await j;
      if (role === 'owner') owner = s; else if (role === 'tgt') tgtOwner = s; else observer = s;
    }
    server.setCharacterOwner('c', ownerUid); server.setCharacterOwner('c2', tgtUid);
    server.players.get(owner.id).character = { id: 'c', class: 'Arcanoneer' }; server.players.get(tgtOwner.id).character = { id: 'c2', class: 'Arcanoneer' };
    const map = () => room.gameState.maps.default;
    map().tokens.foe = { id: 'foe', name: 'foe', stats: { maxHp: 60, maxMana: 0, maxAP: 4 }, state: { currentHp: 40, currentMana: 0, currentActionPoints: 4, tempHealth: 0, conditions: [] } };
    foe = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'foe' }, snapshotHash: actors.hash(map().tokens.foe) })).ref;
    map().characterTokens.pc = { id: 'pc', ownerUserId: ownerUid, character: { id: 'c', class: 'Arcanoneer', health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, tempMana: 0, tempActionPoints: 0 }, state: { conditions: [] } };
    pc = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'c' }, snapshotHash: actors.hash(map().characterTokens.pc) })).ref;
    // The striker/caster whose Agility is modified. Its sheet score stays owner-attested (fixture: 14 effective before modifiers).
    map().characterTokens.pc2 = { id: 'pc2', ownerUserId: tgtUid, character: { id: 'c2', class: 'Arcanoneer', stats: { agility: 13 }, baseStats: { agility: 13 }, health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 6, max: 6 } }, state: { conditions: [] } };
    pc2 = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc2', ownerUid: tgtUid, characterId: 'c2' }, snapshotHash: actors.hash(map().characterTokens.pc2) })).ref;
    assert.ok(foe && pc && pc2);
  });
  afterEach(async() => { for (const s of [gm, owner, observer, tgtOwner]) s.disconnect(); await server.stop(); });

  const live = () => server.rooms.get(room.id);
  const token = ref => actors.locate(live(), ref).token;
  const rev = ref => token(ref).state.actorContract.revision;
  const base = () => ({ version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence });
  const SHEET_AGILITY = 14; // owner's sheet composition before any authored modifier (fixture)
  const agilityOf = ref => profile.attributeBreakdown(SHEET_AGILITY, token(ref).state.conditions || [], 'agility');
  async function admit(record) {
    const r = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, record, definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(r.success, true, JSON.stringify(r)); return installed.list(live()).entries.find(e => e.definitionRef.definitionId === record.authoredDefinitionId);
  }
  const spellOf = e => ({ definitionId: pure.actionId(e.definitionRef), definitionHash: `${pure.EFFECT_CAPABILITY}/${e.definitionRef.definitionHash}`, name: e.canonicalDefinition.name, kind: 'effect', damageTypes: [] });
  function bundle(e, { s = pc, t = pc2 } = {}) {
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence, source: s, target: t,
      spell: spellOf(e), roll: null, price: e.descriptor.price, classPayment: null, effectTerms: effect.termsFor(e.canonicalDefinition) };
  }
  const socketOf = uid => (uid === tgtUid ? tgtOwner : owner);
  async function approve(a) { const before = actors.clone(live().gameState), r = await ack(socketOf(a.source.ownerUid), 'actor_spell_approve', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); assert.deepEqual(live().gameState, before); return r.contentHash; }
  const response = (p, yes = true) => ({ roomId: room.id, approvalId: p.approvalId, proposalId: p.proposalId, termsHash: p.termsHash, target: p.target, accept: yes });
  async function acceptAsTarget(a) {
    const p = payments.targetProposal(payments.get(live(), a.approvalId));
    const r = await ack(socketOf(a.target.ownerUid), 'actor_spell_target_respond', response(p)); assert.equal(r.success, true, JSON.stringify(r)); return p;
  }
  function command(a) {
    const pools = actors.resources(token(a.source), 'character'), pay = {};
    for (const p of ['ap', 'mana']) if (a.price[p]) pay[p] = payments.tempFirst(pools[p].current, pools[p].temp, a.price[p]);
    const plan = effect.conditionPlan(a, token(a.target).state.conditions || []);
    const targetEntry = { ref: a.target, expectedRevision: rev(a.target), conditions: plan.ops || [{ op: 'add', recordId: a.approvalId, record: effect.recordFor(a) }] };
    const res = { gmConfirmed: true, timing: a.effectTerms.timing, timingNote: 'GM ruling: target and range resolved at the table', evidence: 'GM save ruling' };
    return { ...base(), source: a.source, target: a.target, approval: { approvalId: a.approvalId, contentHash: actors.hash(a) },
      actors: [{ ref: a.source, expectedRevision: rev(a.source), finalResources: pay }, targetEntry],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, finalAmount: 0, adjustmentReason: '', chosenResult: JSON.stringify(effect.resultFor(a, res, plan.combination || null)) } };
  }
  async function accept(c) { const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true, JSON.stringify(r)); return r; }
  async function refused(event, data, code, socket = gm) {
    const before = actors.clone(live().gameState), r = await ack(socket, event, data); assert.equal(r.success, false, JSON.stringify(r));
    if (code) assert.equal(r.code, code, JSON.stringify(r)); assert.deepEqual(live().gameState, before); return r;
  }
  const edit = (ref, ops, note) => { const g = gmEdit(ops, note); return { ...base(), actors: [{ ref, expectedRevision: rev(ref), conditions: g.conditions }], adjudication: g.adjudication }; };
  const remove = (ref, id) => edit(ref, [{ op: 'remove', recordId: id }], 'GM exact removal');
  async function buff(amount = 2, opts = {}) {
    const e = await admit(attributeRecord({ amount, label: amount > 0 ? 'Quickened' : 'Leaden', name: amount > 0 ? 'Disposable Quickening' : 'Disposable Leaden Hex', ...opts }));
    const a = bundle(e); await approve(a); if (amount > 0) await acceptAsTarget(a);
    const r = await accept(command(a)); return { e, a, r };
  }
  // ---- supported consumers on the modified actor (pc2) ----
  function strikeApproval(score) {
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence, source: pc2, target: foe,
      weapon: { slot: 'ranged', itemId: 'short-bow', name: 'Short Bow', weaponType: 'bow', typeSource: 'item', die: 8, damageType: 'stabbing', attribute: 'agility', score, modifier: Math.floor((score - 10) / 2) },
      roll: { mode: 'physical', faces: [5] }, proficiency: { weaponType: 'bow', rank: 'TRAINED', rankSource: 'stored', die: 8, table: 'bow', roll: { mode: 'physical', faces: [3] } }, price: { ap: 2 } };
  }
  function strikeCommand(a, contentHash) {
    const derived = strikes.derive(a.weapon, a.roll);
    const chosen = { capability: 'p12a-strike:v1', approvalId: a.approvalId, gmConfirmed: true, names: { source: 'Quick', target: 'Foe' },
      weapon: a.weapon, roll: a.roll, proficiencyRecord: a.proficiency, rollOutcome: derived.rollOutcome, proposed: derived.proposed, proficiency: { kind: 'deferred' },
      defense: { damageType: 'stabbing', automated: null, afterDefense: derived.proposed, manual: [], ruling: null },
      notApplied: [{ source: 'proficiency-deferred', text: strikes.FIXED_TEXT['proficiency-deferred'] }, { source: 'ammunition', text: strikes.FIXED_TEXT.ammunition }] };
    const ap = actors.resources(token(pc2), 'character').ap, hp = token(foe).state.currentHp;
    return { ...base(), source: pc2, target: foe, approval: { approvalId: a.approvalId, contentHash },
      actors: [{ ref: pc2, expectedRevision: rev(pc2), finalResources: { ap: payments.tempFirst(ap.current, ap.temp, 2) } }, { ref: foe, expectedRevision: rev(foe), finalResources: { hp: { current: hp - derived.proposed, temp: 0 } } }],
      adjudication: { definitionId: 'basic-weapon-strike', definitionVersionOrHash: 'p12a-strike:v1/basic-weapon-strike', chosenResult: JSON.stringify(chosen), finalAmount: derived.proposed, adjustmentReason: '' } };
  }
  function formulaApproval(e, score, faces = [3]) {
    const rollAttributes = Object.fromEntries(pure.formulaAttributes(e.canonicalDefinition.effect.formula).map(attribute => [attribute, score])), reading = pure.readScaledFormula(e.canonicalDefinition.effect.formula, rollAttributes);
    const projected = require('../services/roomAccessService').projectTokenForClient(token(pc2));
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence, source: pc2, target: foe,
      spell: { definitionId: pure.actionId(e.definitionRef), definitionHash: `${pure.FORMULA_CAPABILITY}/${e.definitionRef.definitionHash}`, name: e.canonicalDefinition.name, kind: 'damage', damageTypes: ['arcane'] },
      roll: { mode: 'physical', dice: [{ sides: 6, faces }], constant: reading.constant, reading: reading.reading, total: faces.reduce((x, y) => x + y, reading.constant) },
      rollAttributes, formulaSourceRevision: rev(pc2), formulaSourceHash: actors.hash({ character: projected.character, conditions: projected.state?.conditions || [] }), price: e.descriptor.price, classPayment: null };
  }
  function formulaCommand(a, contentHash) {
    const s = actors.resources(token(pc2), 'character'), t = actors.resources(token(foe), 'creature');
    return { ...base(), source: pc2, target: foe, approval: { approvalId: a.approvalId, contentHash },
      actors: [{ ref: pc2, expectedRevision: rev(pc2), finalResources: { ap: payments.tempFirst(s.ap.current, s.ap.temp, 1), mana: payments.tempFirst(s.mana.current, s.mana.temp, 1) } },
        { ref: foe, expectedRevision: rev(foe), finalResources: { hp: { current: Math.max(0, t.hp.current - a.roll.total), temp: 0 } } }],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, chosenResult: JSON.stringify({ capability: pure.FORMULA_CAPABILITY, approvalId: a.approvalId, kind: 'damage', roll: a.roll, gmConfirmed: true }), finalAmount: a.roll.total, adjustmentReason: '' } };
  }
  const withdraw = async a => { const r = await ack(socketOf(a.source.ownerUid), 'actor_spell_withdraw', { roomId: room.id, approvalId: a.approvalId, approval: a }); assert.equal(r.success, true, JSON.stringify(r)); };
  const reapprove = async a => { const r = await ack(tgtOwner, 'actor_strike_approve', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); return r.contentHash; };

  for (const [attribute, amount] of [['intelligence', 2], ['spirit', -2]]) {
    it(`${attribute} ${amount}: Wizard admission, consent, atomic application, real formula, retained-face stale refusal, privacy, isolated exact removal and restoration`, async() => {
      const bolt = await admit(formulaRecord(`1d6 + ${attribute}`));
      const initial = formulaApproval(bolt, 14), initialHash = await approve(initial);
      const before = actors.clone(token(pc2).character), sourceBefore = actors.resources(token(pc), 'character');
      const { a } = await buff(amount, { attribute });
      const records = token(pc2).state.conditions, effective = () => profile.attributeBreakdown(14, token(pc2).state.conditions, attribute).result;
      assert.deepEqual(records[0].effects, { [attribute]: amount });
      assert.deepEqual(token(pc2).character, before, 'all target pools including max HP/mana and base stats unchanged');
      assert.equal(actors.resources(token(pc), 'character').mana.current, sourceBefore.mana.current - 2);
      assert.equal(profile.attributeBreakdown(14, token(pc).state.conditions, attribute).result, 14, 'other actor isolated');
      const snap = await ack(observer, 'actor_snapshot', { roomId: room.id });
      const publicRecord = snap.maps.default.characterTokens.pc2.state.conditions[0];
      assert.equal(publicRecord.sourceActor, undefined); assert.equal(publicRecord.effectDefinition, undefined);
      assert.equal(profile.isAttributeModifier(publicRecord), true);
      await refused('actor_consequence', formulaCommand(initial, initialHash), 'owner_reapproval_required');
      const fresh = formulaApproval(bolt, effective(), initial.roll.dice[0].faces);
      assert.deepEqual(fresh.roll.dice, initial.roll.dice);
      const hp = token(foe).state.currentHp;
      await accept(formulaCommand(fresh, await approve(fresh)));
      assert.equal(hp - token(foe).state.currentHp, 3 + 14 + amount, 'actual registered formula consumer');
      const duplicate = bundle(await admit(attributeRecord({ attribute, amount: -1 })));
      await approve(duplicate); await refused('actor_consequence', command(duplicate), 'attribute_combination_unresolved'); await withdraw(duplicate);
      await refused('actor_consequence', remove(pc2, a.approvalId), null, tgtOwner);
      await accept(remove(pc2, a.approvalId)); assert.equal(effective(), 14);
      const restored = formulaApproval(bolt, effective());
      await accept(formulaCommand(restored, await approve(restored))); assert.equal(restored.roll.total, initial.roll.total);
      assert.deepEqual(token(pc2).character.stats, before.stats);
    });
    it(`${attribute}: supported counted expiry restores the formula input at the exact target boundary`, async() => {
      const started = await ack(gm, 'combat_started', { roomId: room.id, turnOrder: [pc, foe, pc2].map(ref => ({ tokenId: ref.tokenId, actorRef: ref })), currentTurnIndex: 0, round: 1 });
      assert.equal(started.success, true);
      const boundary = mode => ({ ...base(), mode, combatHash: actors.hash(live().gameState.combat), expectedClock: mode === 'advance' ? { id: live().gameState.combat.effectLifecycle.id, sequence: live().gameState.combat.effectLifecycle.sequence } : null });
      assert.equal((await ack(gm, 'actor_turn_boundary', boundary('adopt'))).success, true);
      await buff(amount, { attribute, policy: 'target-end-count', occurrences: 2 });
      const score = () => profile.attributeBreakdown(14, token(pc2).state.conditions, attribute).result;
      assert.equal(score(), 14 + amount);
      let ends = 0;
      for (let n = 0; n < 12 && token(pc2).state.conditions.length; n++) {
        const ending = live().gameState.combat.turnOrder[live().gameState.combat.currentTurnIndex]?.tokenId;
        assert.equal((await ack(gm, 'actor_turn_boundary', boundary('advance'))).success, true);
        if (ending === pc2.tokenId) ends++;
        if (ends === 1) assert.equal(score(), 14 + amount);
      }
      assert.equal(ends, 2); assert.equal(score(), 14);
      const bolt = await admit(formulaRecord(`1d6 + ${attribute}`)), f = formulaApproval(bolt, score());
      await accept(formulaCommand(f, await approve(f))); assert.equal(f.roll.total, 17);
    });
  }

  it('PC casting UI integration contract: another owner cannot consent; declining changes no pools, HP or effects and cannot be reused', async() => {
    const e = await admit(attributeRecord()), a = bundle(e); await approve(a);
    const p = payments.targetProposal(payments.get(live(), a.approvalId));
    await refused('actor_spell_target_respond', response(p), 'forbidden', owner);
    await refused('actor_spell_target_respond', response(p), 'forbidden', observer);
    const before = actors.clone(live().gameState);
    assert.equal((await ack(tgtOwner, 'actor_spell_target_respond', response(p, false))).success, true);
    assert.deepEqual(live().gameState, before);
    await refused('actor_consequence', command(a), 'target_acceptance_required');
    await refused('actor_spell_target_respond', response({ ...p, proposalId: uuid() }), null, tgtOwner);
    assert.deepEqual(live().gameState, before);
  });

  it('PC casting UI integration contract: stale incarnation, canonical ownership and proposal hash refuse without payment', async() => {
    const e = await admit(attributeRecord()), a = bundle(e); await approve(a);
    const p = payments.targetProposal(payments.get(live(), a.approvalId));
    await refused('actor_spell_target_respond', response({ ...p, termsHash: '0'.repeat(64) }), null, tgtOwner);
    await acceptAsTarget(a);
    const c = command(a), t = token(pc2), original = actors.clone(t);
    t.state.actorContract.instanceId = uuid();
    await refused('actor_consequence', c, null);
    Object.assign(t, actors.clone(original));
    server.setCharacterOwner('c2', ownerUid);
    await refused('actor_consequence', c, null);
    server.setCharacterOwner('c2', tgtUid);
    Object.assign(t, actors.clone(original));
    const r = await accept(c); assert.equal(r.receipt.commandId, c.commandId);
    const count = actors.ledger(live()).receipts.length;
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, r.receipt);
    assert.equal(actors.ledger(live()).receipts.length, count);
    assert.equal(token(pc2).state.conditions.length, 1);
  });

  it('PC bundle ownership await race recovers the original receipt after concurrent consumption and a later ownership change', async() => {
    const e = await admit(attributeRecord()), a = bundle(e); await approve(a); await acceptAsTarget(a);
    const c = command(a), firebase = require('../services/firebaseService'), original = firebase.getCharacterOwner;
    let release, waiting;
    const started = new Promise(r => { waiting = r; });
    let delay = true;
    firebase.getCharacterOwner = async(id, options) => {
      assert.equal(options?.fresh, true);
      if (delay) { delay = false; waiting(); await new Promise(r => { release = r; }); }
      return original(id, options);
    };
    try {
      const raced = ack(gm, 'actor_consequence', c); await started;
      const installed = await accept(c), count = actors.ledger(live()).receipts.length;
      server.setCharacterOwner('c2', ownerUid); release();
      assert.deepEqual((await raced).receipt, installed.receipt);
      assert.equal(actors.ledger(live()).receipts.length, count);
      assert.equal(token(pc2).state.conditions.length, 1);
    } finally { firebase.getCharacterOwner = original; if (release) release(); }
  });

  it('Wizard admission: positive and negative Agility changes compile to immutable definitions; unsupported attributes, amounts and mixed shapes refuse with nothing admitted', async() => {
    const plus = await admit(attributeRecord({ amount: 2 })), minus = await admit(attributeRecord({ amount: -2, label: 'Leaden', name: 'Disposable Leaden Hex' }));
    assert.deepEqual(plus.canonicalDefinition.effects.condition, { kind: 'attribute', attribute: 'agility', amount: 2, label: 'Quickened' });
    assert.deepEqual(minus.canonicalDefinition.effects.condition, { kind: 'attribute', attribute: 'agility', amount: -2, label: 'Leaden' });
    assert.match(pure.definitionSummary(plus.canonicalDefinition), /Quickened \(Agility \+2\)/);
    const codec = registry.decodeRegistry(registry.encodeRegistry(installed.registry(live())).json); assert.equal(codec.ok, true, JSON.stringify(codec));
    for (const bad of [{ attribute: 'strength' }, { attribute: 'constitution' }, { attribute: 'wisdom' }, { attribute: 'Intelligence' },
      ...['intelligence', 'spirit'].flatMap(attribute => [0, 6, -6, 1.5, '2', null].map(amount => ({ attribute, amount }))),
      { amount: 0 }, { amount: 6 }, { amount: -6 }, { amount: 1.5 }, { amount: '2' }, { label: '' }, { label: ' Padded ' },
      { extra: d => { d.controlConfig.authoredCondition.movementFeet = 10; } }, { extra: d => { d.buffConfig = { effects: [{ statModifier: { stat: 'agility', magnitude: 2 } }] }; } }]) {
      const record = attributeRecord(bad), mapped = pure.definitionFromWizard(record, { roomId: room.id, definitionVersion: 1, classId: 'arcanoneer' });
      assert.equal(mapped.ok, false, JSON.stringify(bad));
      const before = installed.registry(live()).revision;
      const r = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: before, record, definitionVersion: 1, classId: 'arcanoneer' });
      assert.equal(r.success, false, JSON.stringify(bad)); assert.equal(installed.registry(live()).revision, before);
    }
    const forged = actors.clone(plus.canonicalDefinition); forged.effects.condition.attribute = 'strength';
    assert.equal(registry.compileDefinition(forged).ok, false, 'a crafted unsupported attribute never compiles');
    const zero = actors.clone(plus.canonicalDefinition); zero.effects.condition.amount = 0; assert.equal(registry.compileDefinition(zero).ok, false);
  });

  it('positive change on a PC: exact owner price, target-owner acceptance, one atomic install, exact record, base untouched; consumers change by the exact amount and stale approvals need reapproval', async() => {
    const e = await admit(attributeRecord({ amount: 2 })), a = bundle(e);
    await refused('actor_spell_approve', a, 'forbidden', tgtOwner); await refused('actor_spell_approve', a, 'forbidden', observer);
    assert.equal(payments.targetConsent(a), 'required'); await approve(a);
    const bolt = await admit(formulaRecord());
    const staleStrike = strikeApproval(14), staleStrikeHash = await reapprove(staleStrike);
    const staleFormula = formulaApproval(bolt, 14, [3]), staleFormulaHash = await approve(staleFormula);
    await refused('actor_consequence', command(a), 'target_acceptance_required');
    const p = payments.targetProposal(payments.get(live(), a.approvalId)); assert.equal(p.conditionKey, 'attribute');
    assert.deepEqual(p.bundle.condition, { kind: 'attribute', attribute: 'agility', amount: 2, label: 'Quickened' });
    for (const s of [gm, observer, owner]) await refused('actor_spell_target_respond', response(p), 'forbidden', s);
    await acceptAsTarget(a);
    const characterBefore = actors.clone(token(pc2).character), paidBefore = actors.resources(token(pc), 'character');
    const c = command(a), r = await accept(c);
    const records = token(pc2).state.conditions; assert.equal(records.length, 1);
    const rec = records[0]; assert.equal(profile.isAttributeModifier(rec), true); assert.deepEqual(rec.effects, { agility: 2 }); assert.equal(rec.type, 'buff'); assert.equal(rec.recordId, a.approvalId);
    assert.equal(rec.effectDefinition, a.spell.definitionId); assert.deepEqual(rec.sourceActor, pc);
    assert.deepEqual(token(pc2).character, characterBefore, 'base/earned stats and resources of the target are not rewritten');
    assert.equal(actors.resources(token(pc), 'character').ap.current, paidBefore.ap.current - 1); assert.equal(actors.resources(token(pc), 'character').mana.current, paidBefore.mana.current - 2);
    assert.equal(agilityOf(pc2).result, 16); assert.deepEqual(profile.attributeModifierTotals(records), { agility: 2 });
    // Lost ACK / duplicate delivery: the same original command returns the same receipt and installs once.
    const after = actors.clone(live().gameState);
    assert.deepEqual((await ack(gm, 'actor_consequence', c)).receipt, r.receipt); assert.deepEqual((await ack(owner, 'actor_spell_approve', a)).receipt, r.receipt);
    assert.deepEqual(live().gameState, after); assert.equal(token(pc2).state.conditions.length, 1);
    // Stale proposals approved at 14: strike and formula both need explicit owner reapproval; nothing applies.
    const closed = once(tgtOwner, 'actor_strike_closed');
    await refused('actor_consequence', strikeCommand(staleStrike, staleStrikeHash), 'owner_reapproval_required');
    assert.equal((await closed).code, 'owner_reapproval_required'); assert.equal(strikes.get(live(), staleStrike.approvalId), null);
    await refused('actor_consequence', formulaCommand(staleFormula, staleFormulaHash), 'owner_reapproval_required');
    // Reapproved at the current score 16: strike +3 (was +2), formula +16 with the retained face.
    const fresh = strikeApproval(agilityOf(pc2).result), hpBefore = token(foe).state.currentHp;
    await accept(strikeCommand(fresh, await reapprove(fresh)));
    assert.equal(hpBefore - token(foe).state.currentHp, 5 + 3, 'face 5 + floor((16-10)/2)');
    const again = formulaApproval(bolt, agilityOf(pc2).result, staleFormula.roll.dice[0].faces); assert.deepEqual(again.roll.dice, staleFormula.roll.dice, 'retained faces re-presented, never re-rolled');
    await accept(formulaCommand(again, await approve(again))); assert.equal(again.roll.total, 3 + 16); assert.equal(staleFormula.roll.total, 3 + 14);
    // Exact GM removal restores the value without touching base stats.
    await accept(remove(pc2, a.approvalId)); assert.equal(agilityOf(pc2).result, 14); assert.deepEqual(token(pc2).character.stats, characterBefore.stats);
  });

  it('negative change on a PC is hostile by default (GM authority), lowers the formula by exactly 2 and expires at the counted boundary, restoring the value', async() => {
    const order = [pc, foe, pc2];
    let r0 = await ack(gm, 'combat_started', { roomId: room.id, turnOrder: order.map(ref => ({ tokenId: ref.tokenId, actorRef: ref })), currentTurnIndex: 0, round: 1 }); assert.equal(r0.success, true, JSON.stringify(r0));
    const boundary = mode => ({ ...base(), mode, combatHash: actors.hash(live().gameState.combat), expectedClock: mode === 'advance' ? { id: live().gameState.combat.effectLifecycle.id, sequence: live().gameState.combat.effectLifecycle.sequence } : null });
    r0 = await ack(gm, 'actor_turn_boundary', boundary('adopt')); assert.equal(r0.success, true, JSON.stringify(r0));
    const e = await admit(attributeRecord({ amount: -2, label: 'Leaden', name: 'Disposable Leaden Hex', policy: 'target-end-count', occurrences: 2 })), a = bundle(e);
    assert.equal(payments.targetConsent(a), 'designatable'); await approve(a);
    const characterBefore = actors.clone(token(pc2).character);
    await accept(command(a)); const rec = token(pc2).state.conditions[0];
    assert.equal(rec.type, 'debuff'); assert.deepEqual(rec.effects, { agility: -2 }); assert.equal(profile.structuredBoundary(rec), 'end'); assert.ok(timing.scheduleFor(rec, live().gameState.combat));
    assert.equal(agilityOf(pc2).result, 12);
    const bolt = await admit(formulaRecord()), f = formulaApproval(bolt, agilityOf(pc2).result, [4]);
    await accept(formulaCommand(f, await approve(f))); assert.equal(f.roll.total, 4 + 12);
    const advance = async() => { const r = await ack(gm, 'actor_turn_boundary', boundary('advance')); assert.equal(r.success, true, JSON.stringify(r)); };
    let ends = 0;
    for (let i = 0; i < 12 && token(pc2).state.conditions.length; i++) {
      const ending = live().gameState.combat.turnOrder[live().gameState.combat.currentTurnIndex]?.tokenId;
      await advance(); if (ending === 'pc2') ends++;
      if (ends === 1) assert.equal(token(pc2).state.conditions.length, 1, 'still active after the 1st counted end');
    }
    assert.equal(ends, 2, 'expired exactly at the 2nd counted end of the target'); assert.equal(token(pc2).state.conditions.length, 0);
    assert.equal(agilityOf(pc2).result, 14); assert.deepEqual(token(pc2).character.stats, characterBefore.stats); assert.deepEqual(token(pc2).character.baseStats, characterBefore.baseStats);
  });

  it('combination (D-ATTR-1 open): one change per attribute per target. The same effect again, another Agility effect or a manual Agility record refuses whole; other actors and other keys stay independent', async() => {
    const { e, a } = await buff(2);
    const same = bundle(e); await approve(same); await acceptAsTarget(same);
    await refused('actor_consequence', command(same), 'attribute_combination_unresolved'); await withdraw(same);
    const other = await admit(attributeRecord({ amount: -1, label: 'Leaden', name: 'Disposable Leaden Hex' })), b = bundle(other); await approve(b);
    await refused('actor_consequence', command(b), 'attribute_combination_unresolved'); await withdraw(b);
    const elsewhere = bundle(other, { s: pc2, t: pc }); await approve(elsewhere); await accept(command(elsewhere));
    assert.deepEqual(profile.attributeModifierTotals(token(pc).state.conditions), { agility: -1 });
    const manual = id => ({ version: 1, id, recordId: id, name: 'Manual Grace', originalName: 'Manual Grace', type: 'buff', kind: 'effect', target: pc2, targetId: 'pc2', targetType: 'character', source: 'manual', effects: { agility: 1 }, sharedTiming: 'manual', durationType: 'manual' });
    const m1 = uuid(); await refused('actor_consequence', edit(pc2, [{ op: 'add', recordId: m1, record: manual(m1) }]), 'attribute_combination_unresolved');
    const s1 = uuid(); await accept(edit(pc2, [{ op: 'add', recordId: s1, record: { ...manual(s1), name: 'Manual Might', originalName: 'Manual Might', effects: { strength: 1 } } }]));
    assert.equal(agilityOf(pc2).result, 16);
    await accept(remove(pc2, a.approvalId));
    const m2 = uuid(); await accept(edit(pc2, [{ op: 'add', recordId: m2, record: manual(m2) }]));
    const c2 = bundle(e); await approve(c2); await acceptAsTarget(c2); await refused('actor_consequence', command(c2), 'attribute_combination_unresolved');
  });

  it('provenance and lifecycle: no generic add/update, no owner removal; GM exact removal restores; writer refusal keeps the approval and installs nothing; insufficient resources refuse', async() => {
    const e = await admit(attributeRecord({ amount: 2 })), a = bundle(e); await approve(a); await acceptAsTarget(a);
    const forged = effect.recordFor(a);
    await refused('actor_consequence', edit(pc2, [{ op: 'add', recordId: forged.recordId, record: forged }]), 'authored_effect_approval_required');
    await refused('actor_consequence', edit(pc2, [{ op: 'add', recordId: forged.recordId, record: forged }]), null, tgtOwner);
    live().isPermanent = true; writer.admitConsequence = () => ({ queued: false, code: 'attr_writer_refusal' });
    await refused('actor_consequence', command(a), 'attr_writer_refusal'); live().isPermanent = false; delete writer.admitConsequence;
    assert.ok(payments.get(live(), a.approvalId), 'owner approval retained after writer refusal');
    await accept(command(a)); assert.equal(agilityOf(pc2).result, 16);
    const rec = token(pc2).state.conditions[0];
    await refused('actor_consequence', edit(pc2, [{ op: 'update', recordId: rec.recordId, record: { ...rec, effects: { agility: 5 } } }]), null);
    await refused('actor_consequence', remove(pc2, rec.recordId), null, tgtOwner);
    await refused('actor_consequence', remove(pc2, rec.recordId), null, owner);
    await accept(remove(pc2, rec.recordId)); assert.equal(agilityOf(pc2).result, 14); assert.equal(token(pc2).state.conditions.length, 0);
    const pricey = await admit(attributeRecord({ amount: 2, ap: 9, name: 'Disposable Costly Quickening' }));
    const before = actors.clone(live().gameState), rr = await ack(owner, 'actor_spell_approve', bundle(pricey));
    assert.equal(rr.success, false, JSON.stringify(rr)); assert.deepEqual(live().gameState, before);
  });

  it('reload/snapshot: the target owner snapshot carries one exact instance; a JSON round trip of the room state keeps one record and the same value', async() => {
    const { a } = await buff(2);
    const snap = await ack(tgtOwner, 'actor_snapshot', { roomId: room.id }); assert.equal(snap.success, true, JSON.stringify(Object.keys(snap)));
    const projected = snap.maps.default.characterTokens.pc2.state.conditions.filter(r => r.recordId === a.approvalId);
    assert.equal(projected.length, 1); assert.deepEqual(projected[0].effects, { agility: 2 });
    const encoded = JSON.parse(JSON.stringify(live().gameState));
    assert.deepEqual(encoded.maps.default.characterTokens.pc2.state.conditions, token(pc2).state.conditions);
    assert.equal(profile.attributeBreakdown(SHEET_AGILITY, encoded.maps.default.characterTokens.pc2.state.conditions, 'agility').result, 16);
  });

  it('existing movement bundles are unchanged and coexist with an Agility change on the same target', async() => {
    const mv = { profile: pure.EFFECT_CAPABILITY, effect: 'movement', movementFeet: -10, label: 'Mired', expiryPolicy: 'gm-manual', durationText: 'x', gmNote: 'GM resolves' };
    const m = await admit(attributeRecord({ name: 'Disposable Mire', extra: d => { d.controlConfig.authoredCondition = mv; } })), ma = bundle(m); await approve(ma); await accept(command(ma));
    await buff(-2);
    const records = token(pc2).state.conditions; assert.equal(records.length, 2);
    assert.equal(profile.movementBreakdown(30, records).result, 20); assert.equal(agilityOf(pc2).result, 12);
  });

  it('review F1/F3: a strike prepared from a snapshot before an Agility change cannot register; only the GM may record a manual Agility change', async() => {
    const prepared = strikeApproval(14); // owner computed 14 at this snapshot
    await buff(-2); // an accepted change lands before the strike reaches the server
    const before = actors.clone(live().gameState);
    const r = await ack(tgtOwner, 'actor_strike_approve', prepared); assert.equal(r.code, 'owner_reapproval_required', JSON.stringify(r));
    assert.deepEqual(live().gameState, before); assert.equal(strikes.get(live(), prepared.approvalId), null);
    const fresh = strikeApproval(12); assert.equal((await ack(tgtOwner, 'actor_strike_approve', fresh)).code, 'awaiting_gm');
    // Owner/controller manual Agility record refused (would also block authored changes); GM correction still possible.
    const id = uuid(), manual = { version: 1, id, recordId: id, name: 'Self Grace', originalName: 'Self Grace', type: 'buff', kind: 'effect', target: pc, targetId: 'pc', targetType: 'character', source: 'manual', effects: { agility: 1 }, sharedTiming: 'manual', durationType: 'manual' };
    await refused('actor_consequence', { ...edit(pc, [{ op: 'add', recordId: id, record: manual }]) }, 'attribute_change_gm_only', owner);
    const other = uuid(); await accept(edit(pc, [{ op: 'add', recordId: other, record: { ...manual, id: other, recordId: other, effects: { strength: 1 } } }]));
  });
});
