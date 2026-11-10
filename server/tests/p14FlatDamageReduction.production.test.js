/** Shared flat damage-reduction effects (+1..+20 flat DR) through the registered production stack:
 * Wizard record -> admission -> owner approval / target consent -> one atomic P7 command -> exact record ->
 * P12A basic weapon strike consumer (automated lone non-critical DR vs critical/tier manual ruling) &
 * P12B PC blocking + Defending coexistence -> GM removal / C4 counted expiry. Disposable fixtures only. */
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
const once = (s, e) => new Promise(r => s.once(e, r));
const ack = (s, e, d) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error(e)), 5000); s.emit(e, d, r => { clearTimeout(t); resolve(r); }); });

function drRecord({ name = 'Disposable Aegis Ward', amount = 3, label = 'Aegis Ward', policy = 'gm-manual', occurrences, ap = 1, mana = 2, direct = null, extra } = {}) {
  const c = { profile: pure.EFFECT_CAPABILITY, effect: 'damageReduction', drAmount: amount, label, expiryPolicy: policy, ...(occurrences !== undefined ? { occurrences } : {}),
    durationText: 'Until the ward fades', gmNote: 'GM resolves eligibility, range and line of effect before confirming.' };
  const effectTypes = direct ? ['control', direct.kind] : ['control'];
  const d = { name, description: 'Flat DR disposable test', spellType: 'ACTION', typeConfig: { castTimeType: 'IMMEDIATE', ...(direct?.school ? { school: direct.school } : {}) },
    effectTypes, controlConfig: { authoredCondition: c },
    ...(direct?.kind === 'healing' ? { healingConfig: { healingType: 'direct', formula: direct.formula || '1d4', resolution: 'DICE' }, effectResolutions: { control: 'MANUAL', healing: 'DICE' } } : {}),
    ...(direct?.kind === 'damage' ? { damageConfig: { damageType: 'direct', elementType: direct.school || 'arcane', damageTypes: [direct.school || 'arcane'], formula: direct.formula || '1d4', resolution: 'DICE' }, effectResolutions: { control: 'MANUAL', damage: 'DICE' } } : {}),
    targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, maxTargets: 1, targetRestrictions: ['any'] }, resourceCost: { actionPoints: ap, mana } };
  if (extra) extra(d);
  return { ...actors.clone(d), authoredDraft: d, authoredDefinitionId: uuid() };
}

const gmEdit = (ops, note = 'GM correction') => ({ conditions: ops, adjudication: { definitionId: 'gm-correction', definitionVersionOrHash: 'gm-correction', finalAmount: 0, adjustmentReason: '', chosenResult: note } });

describe('Shared flat damage-reduction effects — registered production handlers', function() {
  this.timeout(30000);
  let server, room, gm, owner, observer, tgtOwner, writer, foe, pc, pc2, ownerUid, tgtUid;

  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer }); await server.start();
    for (const e of ['actor_bind', 'actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_spell_approve', 'actor_spell_withdraw', 'actor_spell_target_respond',
      'actor_turn_boundary', 'combat_started', 'actor_strike_approve', 'actor_strike_list', 'actor_block_offer', 'actor_block_approve', 'actor_block_plan']) {
      server.setEventLimits(e, { maxPerMinute: 4000, maxPerSecond: 4000 });
    }
    const gmUid = server.nextUserId(); ownerUid = server.nextUserId(); tgtUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid); server.registerAuthToken('owner', ownerUid); server.registerAuthToken('observer', server.nextUserId()); server.registerAuthToken('tgt', tgtUid);
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: gmUid });
    for (const role of ['owner', 'observer', 'tgt']) {
      const s = server.connect({ token: role }); await once(s, 'connect'); const j = once(s, 'room_joined'); s.emit('join_room', { roomId: room.id, playerName: role, password: '' }); await j;
      if (role === 'owner') owner = s; else if (role === 'tgt') tgtOwner = s; else observer = s;
    }
    server.setCharacterOwner('c', ownerUid); server.setCharacterOwner('c2', tgtUid);
    server.players.get(owner.id).character = { id: 'c', class: 'Spellguard' }; server.players.get(tgtOwner.id).character = { id: 'c2', class: 'Spellguard' };
    const map = () => room.gameState.maps.default;
    map().tokens.foe = { id: 'foe', name: 'foe', stats: { maxHp: 60, maxMana: 0, maxAP: 4 }, state: { currentHp: 40, currentMana: 0, currentActionPoints: 4, tempHealth: 0, conditions: [] } };
    foe = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'foe' }, snapshotHash: actors.hash(map().tokens.foe) })).ref;
    map().characterTokens.pc = { id: 'pc', ownerUserId: ownerUid, character: { id: 'c', class: 'Spellguard', health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, tempMana: 0, tempActionPoints: 0 }, state: { conditions: [] } };
    pc = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'c' }, snapshotHash: actors.hash(map().characterTokens.pc) })).ref;
    map().characterTokens.pc2 = { id: 'pc2', ownerUserId: tgtUid, character: {
      id: 'c2', class: 'Spellguard', stats: { agility: 14 }, baseStats: { agility: 14 }, damageReduction: 0,
      equipment: { offHand: { id: 'iron-shield', name: 'Iron Shield', type: 'shield', combatStats: { armorDie: 'd6' } } },
      health: { current: 25, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 10, max: 10 }
    }, state: { conditions: [] } };
    pc2 = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc2', ownerUid: tgtUid, characterId: 'c2' }, snapshotHash: actors.hash(map().characterTokens.pc2) })).ref;
    assert.ok(foe && pc && pc2);
  });

  afterEach(async() => { for (const s of [gm, owner, observer, tgtOwner]) s.disconnect(); await server.stop(); });

  const live = () => server.rooms.get(room.id);
  const token = ref => actors.locate(live(), ref).token;
  const rev = ref => token(ref).state.actorContract.revision;
  const base = () => ({ version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence });
  const drOf = ref => profile.damageReductionBreakdown(0, token(ref).state.conditions || []);

  async function admit(record) {
    const r = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: installed.registry(live()).revision, record, definitionVersion: 1, classId: 'spellguard' });
    assert.equal(r.success, true, JSON.stringify(r)); return installed.list(live()).entries.find(e => e.definitionRef.definitionId === record.authoredDefinitionId);
  }
  const spellOf = e => ({ definitionId: pure.actionId(e.definitionRef), definitionHash: `${pure.EFFECT_CAPABILITY}/${e.definitionRef.definitionHash}`, name: e.canonicalDefinition.name, kind: 'effect', damageTypes: e.canonicalDefinition.effects.direct?.damageTypes || [] });
  function bundle(e, { s = pc, t = foe, roll = null } = {}) {
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence, source: s, target: t,
      spell: spellOf(e), roll, price: e.descriptor.price, classPayment: null, effectTerms: effect.termsFor(e.canonicalDefinition) };
  }
  const socketOf = uid => (uid === tgtUid ? tgtOwner : owner);
  async function approve(a) { const before = actors.clone(live().gameState), r = await ack(socketOf(a.source.ownerUid), 'actor_spell_approve', a); assert.equal(r.code, 'awaiting_gm', JSON.stringify(r)); assert.deepEqual(live().gameState, before); return r.contentHash; }
  const response = (p, yes = true) => ({ roomId: room.id, approvalId: p.approvalId, proposalId: p.proposalId, termsHash: p.termsHash, target: p.target, accept: yes });
  async function acceptAsTarget(a) {
    const p = payments.targetProposal(payments.get(live(), a.approvalId));
    const r = await ack(socketOf(a.target.ownerUid), 'actor_spell_target_respond', response(p)); assert.equal(r.success, true, JSON.stringify(r)); return p;
  }
  function command(a, { finalAmount = 0, adjustmentReason = '' } = {}) {
    const pools = actors.resources(token(a.source), 'character'), pay = {};
    for (const p of ['ap', 'mana']) if (a.price[p]) pay[p] = payments.tempFirst(pools[p].current, pools[p].temp, a.price[p]);
    const plan = effect.conditionPlan(a, token(a.target).state.conditions || []);
    const targetEntry = { ref: a.target, expectedRevision: rev(a.target), conditions: plan.ops || [{ op: 'add', recordId: a.approvalId, record: effect.recordFor(a) }] };
    if (a.effectTerms.direct?.kind === 'healing') {
      const thp = actors.resources(token(a.target), a.target.kind).hp;
      targetEntry.finalResources = { hp: { current: Math.min(thp.max, thp.current + finalAmount), temp: thp.temp } };
    } else if (a.effectTerms.direct?.kind === 'damage') {
      const thp = actors.resources(token(a.target), a.target.kind).hp;
      targetEntry.finalResources = { hp: payments.tempFirst(thp.current, thp.temp, finalAmount) };
    }
    const res = { gmConfirmed: true, timing: a.effectTerms.timing, timingNote: 'GM ruling: target and range resolved at the table', evidence: 'GM resolution' };
    return { ...base(), source: a.source, target: a.target, approval: { approvalId: a.approvalId, contentHash: actors.hash(a) },
      actors: [{ ref: a.source, expectedRevision: rev(a.source), finalResources: pay }, targetEntry],
      adjudication: { definitionId: a.spell.definitionId, definitionVersionOrHash: a.spell.definitionHash, finalAmount, adjustmentReason, chosenResult: JSON.stringify(effect.resultFor(a, res, plan.combination || null)) } };
  }
  async function accept(c) { const r = await ack(gm, 'actor_consequence', c); assert.equal(r.success, true, JSON.stringify(r)); return r; }
  async function refused(event, data, code, socket = gm) {
    const before = actors.clone(live().gameState), r = await ack(socket, event, data); assert.equal(r.success, false, JSON.stringify(r));
    if (code) assert.equal(r.code, code, JSON.stringify(r)); assert.deepEqual(live().gameState, before); return r;
  }
  const edit = (ref, ops, note) => { const g = gmEdit(ops, note); return { ...base(), actors: [{ ref, expectedRevision: rev(ref), conditions: g.conditions }], adjudication: g.adjudication }; };
  const remove = (ref, id) => edit(ref, [{ op: 'remove', recordId: id }], 'GM exact removal');
  const withdraw = async a => { const r = await ack(socketOf(a.source.ownerUid), 'actor_spell_withdraw', { roomId: room.id, approvalId: a.approvalId, approval: a }); assert.equal(r.success, true, JSON.stringify(r)); };

  function strikeApproval({ faces = [5], score = 14 } = {}) {
    return { version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence, source: pc2, target: foe,
      weapon: { slot: 'ranged', itemId: 'short-bow', name: 'Short Bow', weaponType: 'bow', typeSource: 'item', die: 8, damageType: 'stabbing', attribute: 'agility', score, modifier: Math.floor((score - 10) / 2) },
      roll: { mode: 'physical', faces }, proficiency: { weaponType: 'bow', rank: 'TRAINED', rankSource: 'stored', die: 8, table: 'bow', roll: { mode: 'physical', faces: [3] } }, price: { ap: 2 } };
  }
  function strikeCommand(a, contentHash, { defenseOverride, finalAmountOverride, adjustmentReason = '' } = {}) {
    const derived = strikes.derive(a.weapon, a.roll);
    const drConds = strikes.damageReductionConditions(token(foe));
    const defaultDefense = derived.rollOutcome === 'hit' && drConds.length === 1 && Number.isInteger(drConds[0].effects.damageReduction) && drConds[0].effects.damageReduction >= 1
      ? { damageType: 'stabbing', automated: { kind: 'flatDr', amount: drConds[0].effects.damageReduction, recordId: drConds[0].recordId || drConds[0].id }, afterDefense: Math.max(0, derived.proposed - drConds[0].effects.damageReduction), manual: [], ruling: null }
      : { damageType: 'stabbing', automated: null, afterDefense: derived.proposed, manual: drConds.length ? ['condition'] : [], ruling: drConds.length ? { verdict: 'applied-in-final', note: 'GM ruled flat DR on critical/multi-defense' } : null };
    const defense = defenseOverride || defaultDefense;
    const finalAmount = finalAmountOverride !== undefined ? finalAmountOverride : defense.afterDefense;
    const notApplied = [{ source: 'proficiency-deferred', text: strikes.FIXED_TEXT['proficiency-deferred'] }];
    if (derived.rollOutcome === 'critical') notApplied.push({ source: 'weapon-critical', text: strikes.FIXED_TEXT['weapon-critical'] });
    if (derived.rollOutcome === 'miss') notApplied.push({ source: 'weapon-fumble', text: strikes.FIXED_TEXT['weapon-fumble'] });
    if (a.weapon.slot === 'ranged') notApplied.push({ source: 'ammunition', text: strikes.FIXED_TEXT.ammunition });
    const chosen = { capability: 'p12a-strike:v1', approvalId: a.approvalId, gmConfirmed: true, names: { source: 'Striker', target: 'Foe' },
      weapon: a.weapon, roll: a.roll, proficiencyRecord: a.proficiency, rollOutcome: derived.rollOutcome, proposed: derived.proposed, proficiency: { kind: 'deferred' },
      defense, notApplied };
    const ap = actors.resources(token(pc2), 'character').ap, hp = token(foe).state.currentHp;
    return { ...base(), source: pc2, target: foe, approval: { approvalId: a.approvalId, contentHash },
      actors: [{ ref: pc2, expectedRevision: rev(pc2), finalResources: { ap: payments.tempFirst(ap.current, ap.temp, 2) } }, { ref: foe, expectedRevision: rev(foe), finalResources: { hp: { current: Math.max(0, hp - finalAmount), temp: 0 } } }],
      adjudication: { definitionId: 'basic-weapon-strike', definitionVersionOrHash: 'p12a-strike:v1/basic-weapon-strike', chosenResult: JSON.stringify(chosen), finalAmount, adjustmentReason } };
  }

  it('Wizard admission: positive flat DR (+1..+20) compiles to an immutable definition; 0, negative, >20, save branch and mixed shapes refuse with nothing admitted', async() => {
    const ward = await admit(drRecord({ amount: 3, label: 'Aegis Ward' }));
    assert.deepEqual(ward.canonicalDefinition.effects.condition, { kind: 'damageReduction', amount: 3, label: 'Aegis Ward' });
    assert.match(pure.definitionSummary(ward.canonicalDefinition), /Aegis Ward \(Flat DR \+3\)/);
    const codec = registry.decodeRegistry(registry.encodeRegistry(installed.registry(live())).json);
    assert.equal(codec.ok, true, JSON.stringify(codec));

    for (const bad of [
      { amount: 0 }, { amount: -1 }, { amount: -3 }, { amount: 21 }, { amount: 1.5 }, { amount: '3' }, { amount: null },
      { label: '' }, { label: ' Padded ' }, { label: 'x'.repeat(61) },
      { extra: d => { d.controlConfig.authoredCondition.movementFeet = 10; } },
      { extra: d => { d.controlConfig.authoredCondition.attribute = 'agility'; } },
      { extra: d => { d.controlConfig.authoredCondition.attributeAmount = 2; } },
      { extra: d => { d.buffConfig = { effects: [{ statModifier: { stat: 'damageReduction', magnitude: 3 } }] }; } },
      { direct: { kind: 'damage', school: 'arcane', formula: '1d4' }, extra: d => { d.controlConfig.authoredCondition.save = { ability: 'constitution', dc: 12, outcome: 'negates' }; } }
    ]) {
      const record = drRecord(bad), mapped = pure.definitionFromWizard(record, { roomId: room.id, definitionVersion: 1, classId: 'spellguard' });
      assert.equal(mapped.ok, false, JSON.stringify(bad));
      const before = installed.registry(live()).revision;
      const r = await ack(gm, 'actor_authored_admit', { roomId: room.id, requestId: uuid(), expectedRegistryRevision: before, record, definitionVersion: 1, classId: 'spellguard' });
      assert.equal(r.success, false, JSON.stringify(bad));
      assert.equal(installed.registry(live()).revision, before);
    }

    for (const badAmount of [0, -2, 21]) {
      const forged = actors.clone(ward.canonicalDefinition);
      forged.effects.condition.amount = badAmount;
      assert.equal(registry.compileDefinition(forged).ok, false);
    }
  });

  it('creature target + P12A basic weapon strike consumer: automated flatDr subtraction once on non-critical hit, stale strike refusal, critical & tier manual adjudication, base stats untouched, GM removal restores original DR', async() => {
    const e = await admit(drRecord({ amount: 3, label: 'Aegis Ward' }));
    const statsBefore = actors.clone(token(foe).stats), sourceBefore = actors.resources(token(pc), 'character');

    // Prepare a strike and GM command BEFORE flat DR is applied to foe.
    const preStrike = strikeApproval({ faces: [5] }); // d8 face 5 + agility mod +2 = proposed 7
    const preStrikeHash = (await ack(tgtOwner, 'actor_strike_approve', preStrike)).contentHash;
    const staleStrikeCmd = strikeCommand(preStrike, preStrikeHash);

    // Apply Aegis Ward (+3 flat DR) to foe.
    const a = bundle(e, { s: pc, t: foe });
    await approve(a);
    await accept(command(a));
    assert.equal(drOf(foe).result, 3);
    assert.deepEqual(token(foe).stats, statsBefore, 'creature base stats unchanged');
    assert.equal(actors.resources(token(pc), 'character').ap.current, sourceBefore.ap.current - 1);
    assert.equal(actors.resources(token(pc), 'character').mana.current, sourceBefore.mana.current - 2);

    // 1. Stale strike command prepared before flat DR was installed refuses (target revision changed).
    await refused('actor_consequence', staleStrikeCmd, 'stale_actor_revision');
    // Even with updated target revision, claiming a mismatched flatDr amount or recordId refuses with approval_mismatch.
    const wrongAmtCmd = strikeCommand(preStrike, preStrikeHash, {
      defenseOverride: { damageType: 'stabbing', automated: { kind: 'flatDr', amount: 5, recordId: a.approvalId }, afterDefense: 2, manual: [], ruling: null }
    });
    await refused('actor_consequence', wrongAmtCmd, 'approval_mismatch');
    const wrongRecCmd = strikeCommand(preStrike, preStrikeHash, {
      defenseOverride: { damageType: 'stabbing', automated: { kind: 'flatDr', amount: 3, recordId: 'stale-dr-record' }, afterDefense: 4, manual: [], ruling: null }
    });
    await refused('actor_consequence', wrongRecCmd, 'approval_mismatch');

    // 2. Valid P12A non-critical hit with automated flatDr subtracts +3 exactly once (proposed 7 -> afterDefense 4).
    const hpBefore = token(foe).state.currentHp;
    const validStrikeCmd = strikeCommand(preStrike, preStrikeHash);
    const chosen = JSON.parse(validStrikeCmd.adjudication.chosenResult);
    assert.deepEqual(chosen.defense.automated, { kind: 'flatDr', amount: 3, recordId: a.approvalId });
    assert.equal(chosen.defense.afterDefense, 4);
    await accept(validStrikeCmd);
    assert.equal(hpBefore - token(foe).state.currentHp, 4, 'proposed 7 - flat DR 3 = 4 HP damage applied once');

    // 3. Critical hit (exploding d8: [8, 3] = 11): flat DR is NOT automatically subtracted (D-D open); requires manual ruling.
    const critStrike = strikeApproval({ faces: [8, 3] });
    const critHash = (await ack(tgtOwner, 'actor_strike_approve', critStrike)).contentHash;
    const illegalAutoCrit = strikeCommand(critStrike, critHash, {
      defenseOverride: { damageType: 'stabbing', automated: { kind: 'flatDr', amount: 3, recordId: a.approvalId }, afterDefense: 8, manual: [], ruling: null }
    });
    await refused('actor_consequence', illegalAutoCrit, 'approval_mismatch');
    const hpBeforeCrit = token(foe).state.currentHp;
    const validCritCmd = strikeCommand(critStrike, critHash, {
      defenseOverride: { damageType: 'stabbing', automated: null, afterDefense: 11, manual: ['condition'], ruling: { verdict: 'applied-in-final', note: 'GM rules Aegis Ward applies on crit' } },
      finalAmountOverride: 8,
      adjustmentReason: 'Aegis Ward +3 flat DR applied by GM ruling on critical hit'
    });
    await accept(validCritCmd);
    assert.equal(hpBeforeCrit - token(foe).state.currentHp, 8);

    // 4. Coexistence with a resistance tier (stabbing 50% resistant): tier occupies automated, flat DR moves to manual['condition'] (D-DR-3 open).
    token(foe).stats.resistances = { stabbing: 50 };
    try {
      const tierStrike = strikeApproval({ faces: [6] }); // 6 + 2 = 8 -> 50% resistant = 4
      const tierHash = (await ack(tgtOwner, 'actor_strike_approve', tierStrike)).contentHash;
      const missingManualRuling = strikeCommand(tierStrike, tierHash, {
        defenseOverride: { damageType: 'stabbing', automated: { kind: 'resistance', percent: 50 }, afterDefense: 4, manual: ['condition'], ruling: null }
      });
      await refused('actor_consequence', missingManualRuling, 'defense_ruling_required');
      const hpBeforeTier = token(foe).state.currentHp;
      const validTierCmd = strikeCommand(tierStrike, tierHash, {
        defenseOverride: { damageType: 'stabbing', automated: { kind: 'resistance', percent: 50 }, afterDefense: 4, manual: ['condition'], ruling: { verdict: 'applied-in-final', note: 'GM subtracts +3 flat DR after 50% resistance' } },
        finalAmountOverride: 1,
        adjustmentReason: 'Flat DR +3 applied after 50% resistance by GM ruling'
      });
      await accept(validTierCmd);
      assert.equal(hpBeforeTier - token(foe).state.currentHp, 1);
    } finally {
      delete token(foe).stats.resistances;
    }

    // 5. Exact GM removal restores foe's flat DR to 0 and subsequent strike deals full unreduced damage (7).
    await accept(remove(foe, a.approvalId));
    assert.equal(drOf(foe).result, 0);
    const postStrike = strikeApproval({ faces: [5] });
    const postHash = (await ack(tgtOwner, 'actor_strike_approve', postStrike)).contentHash;
    const hpBeforePost = token(foe).state.currentHp;
    await accept(strikeCommand(postStrike, postHash));
    assert.equal(hpBeforePost - token(foe).state.currentHp, 7, 'original 0 DR restored; full 7 damage applied');
  });

  it('supported counted turn-boundary expiry removes flat DR at the exact target turn boundary and restores unreduced P12A strike damage', async() => {
    const started = await ack(gm, 'combat_started', { roomId: room.id, turnOrder: [pc, foe, pc2].map(ref => ({ tokenId: ref.tokenId, actorRef: ref })), currentTurnIndex: 0, round: 1 });
    assert.equal(started.success, true);
    const boundary = mode => ({ ...base(), mode, combatHash: actors.hash(live().gameState.combat), expectedClock: mode === 'advance' ? { id: live().gameState.combat.effectLifecycle.id, sequence: live().gameState.combat.effectLifecycle.sequence } : null });
    assert.equal((await ack(gm, 'actor_turn_boundary', boundary('adopt'))).success, true);

    const e = await admit(drRecord({ amount: 4, label: 'Counted Ward', policy: 'target-end-count', occurrences: 2 }));
    const a = bundle(e, { s: pc, t: foe });
    await approve(a);
    await accept(command(a));
    assert.equal(drOf(foe).result, 4);

    let foeEnds = 0;
    for (let n = 0; n < 12 && token(foe).state.conditions.length; n++) {
      const ending = live().gameState.combat.turnOrder[live().gameState.combat.currentTurnIndex]?.tokenId;
      assert.equal((await ack(gm, 'actor_turn_boundary', boundary('advance'))).success, true);
      if (ending === foe.tokenId) foeEnds++;
      if (foeEnds === 1) assert.equal(drOf(foe).result, 4, 'still active after 1st foe turn end');
    }
    assert.equal(foeEnds, 2, 'expired at the 2nd counted foe turn end');
    assert.equal(drOf(foe).result, 0);
    assert.equal(token(foe).state.conditions.length, 0);

    const s = strikeApproval({ faces: [5] });
    const h = (await ack(tgtOwner, 'actor_strike_approve', s)).contentHash;
    const hpBefore = token(foe).state.currentHp;
    await accept(strikeCommand(s, h));
    assert.equal(hpBefore - token(foe).state.currentHp, 7, 'unreduced strike damage after expiry');
  });

  it('PC target consent, privacy, sheet isolation, and P12B equipment blocking + Defending coexistence without double subtraction', async() => {
    // 1. Direct damage + beneficial flat DR on a PC target refuses with pc_target_consent_conflict.
    const dmgWard = await admit(drRecord({ amount: 3, label: 'Conflict Ward', direct: { kind: 'damage', school: 'arcane', formula: '1d4' } }));
    assert.equal(effect.pcConsent(dmgWard.canonicalDefinition.effects, 'character').ok, false);
    assert.equal(effect.pcConsent(dmgWard.canonicalDefinition.effects, 'character').code, 'pc_target_consent_conflict');

    // 2. Beneficial flat DR (+3) on PC2 requires tgtOwner explicit acceptance; observer/owner/GM cannot accept.
    const e = await admit(drRecord({ amount: 3, label: 'Aegis Ward' }));
    const a = bundle(e, { s: pc, t: pc2 });
    assert.equal(payments.targetConsent(a), 'required');
    await approve(a);
    await refused('actor_consequence', command(a), 'target_acceptance_required');
    const p = payments.targetProposal(payments.get(live(), a.approvalId));
    assert.equal(p.conditionKey, 'damage-reduction');
    for (const sock of [gm, owner, observer]) await refused('actor_spell_target_respond', response(p), 'forbidden', sock);
    await acceptAsTarget(a);

    const charBefore = actors.clone(token(pc2).character);
    await accept(command(a));
    assert.deepEqual(token(pc2).character, charBefore, 'base character stats, damageReduction and equipment untouched');
    assert.equal(drOf(pc2).result, 3);

    // 3. Public snapshot withholds sourceActor and effectDefinition on PC2 while keeping a valid flat DR modifier record.
    const snap = await ack(observer, 'actor_snapshot', { roomId: room.id });
    const publicRec = snap.maps.default.characterTokens.pc2.state.conditions[0];
    assert.equal(publicRec.sourceActor, undefined);
    assert.equal(publicRec.effectDefinition, undefined);
    assert.equal(profile.isDamageReductionModifier(publicRec), true);
    assert.equal(profile.damageReductionBreakdown(0, [publicRec]).result, 3);

    // 4. Coexistence with PC Defending and P12B Equipment Blocking:
    // Declare Iron Shield (d6) for blocking on PC2 and apply PC Defending.
    const declCmd = { ...base(), actors: [{ ref: pc2, expectedRevision: rev(pc2), blockingDeclaration: {
      beforeRevision: 0, mode: 'block', pieces: [{ slot: 'offHand', itemId: 'iron-shield', name: 'Iron Shield', kind: 'shield', currentDie: 'd6' }]
    } }] };
    const declRes = await ack(tgtOwner, 'actor_consequence', declCmd);
    assert.equal(declRes.success, true, JSON.stringify(declRes));
    const defId = uuid(), defRec = profile.makeDefendingRecord(pc2, defId, 'self-defend');
    const defCmd = { ...base(), target: pc2, actors: [{ ref: pc2, expectedRevision: rev(pc2), conditions: [{ op: 'add', recordId: defId, record: defRec }] }],
      adjudication: { definitionId: profile.DEFENDING.definitionId, definitionVersionOrHash: profile.DEFENDING.origin, finalAmount: 0, adjustmentReason: 'Defend', chosenResult: JSON.stringify({ conditionKey: 'defending', operation: 'add', recordId: defId, manualStateCorrection: true }) } };
    await accept(defCmd);
    assert.equal(profile.holdsDefending(token(pc2)), true);
    assert.equal(drOf(pc2).result, 3);

    // Creature attacks PC2 for 10 slicing damage; PC2 rolls block face 3 on d6.
    // Defending doubles the block roll (3 * 2 = 6) and prevents wear (d6 -> d6); afterBlock = 10 - 6 = 4.
    // Flat DR (+3) is NOT automatically subtracted by blockApprovals; the GM rules 'flat-dr' and sets finalAmount = 1 (4 - 3).
    const attackId = uuid();
    const attack = {
      capability: 'p12b-attack:v1', source: foe, target: pc2, sourceRevision: rev(foe),
      ability: { id: null, name: 'Claw Slash' }, roll: { mode: 'physical', dice: '2d6+3', faces: [4, 3] },
      outcome: 'hit', damageType: 'slicing', proposedDamage: 10, apCost: 1
    };
    const offerRes = await ack(gm, 'actor_block_offer', { roomId: room.id, commandId: attackId, attack });
    assert.equal(offerRes.success, true, JSON.stringify(offerRes));
    const blockApproval = {
      version: 1, roomId: room.id, approvalId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence,
      source: foe, target: pc2,
      attack: { commandId: offerRes.commandId, attackHash: offerRes.attackHash },
      blocking: { revision: 1, slot: 'offHand', itemId: 'iron-shield', die: 'd6' },
      roll: { mode: 'physical', faces: [3] }
    };
    const blockApproveRes = await ack(tgtOwner, 'actor_block_approve', blockApproval);
    assert.equal(blockApproveRes.code, 'awaiting_gm', JSON.stringify(blockApproveRes));

    // Verify that claiming afterBlock: 1 (auto-subtracting flat DR 3 inside afterBlock) is refused by blockApprovals!
    const buildBlockCmd = ({ afterBlock = 4, finalAmount = 1, reason = 'Aegis Ward +3 flat DR', manual = [{ category: 'flat-dr', note: 'Aegis Ward +3 flat DR subtracted once after block' }] } = {}) => ({
      ...base(), commandId: attackId, source: foe, target: pc2,
      approval: { approvalId: blockApproval.approvalId, contentHash: blockApproveRes.contentHash },
      actors: [
        { ref: foe, expectedRevision: rev(foe), finalResources: { ap: { current: token(foe).state.currentActionPoints - 1, temp: 0 } } },
        { ref: pc2, expectedRevision: rev(pc2), finalResources: { hp: { current: token(pc2).character.health.current - finalAmount, temp: 0 } },
          equipmentWear: { slot: 'offHand', itemId: 'iron-shield', blockingRevision: 1, beforeDie: 'd6', afterDie: 'd6', broken: false } }
      ],
      adjudication: {
        definitionId: 'creature-attack-block', definitionVersionOrHash: 'p12b-block:v1/creature-attack-block',
        finalAmount, adjustmentReason: reason,
        chosenResult: JSON.stringify({
          capability: 'p12b-block:v1', approvalId: blockApproval.approvalId, gmConfirmed: true,
          names: { source: 'Foe', target: 'Striker' }, attack,
          block: { slot: 'offHand', name: 'Iron Shield', kind: 'shield', die: 'd6', face: 3, defending: true, reduction: 6 },
          afterBlock, manual
        })
      }
    });
    await refused('actor_consequence', buildBlockCmd({ afterBlock: 1 }), 'approval_mismatch');

    const hpBeforeBlock = token(pc2).character.health.current;
    const blockAccepted = await accept(buildBlockCmd());
    assert.equal(hpBeforeBlock - token(pc2).character.health.current, 1, 'exact 1 HP damage committed (10 - 6 block - 3 flat DR)');
    assert.equal(blockAccepted.receipt.actors[1].equipmentWear.afterDie, 'd6', 'shield unworn under Defending');
    assert.equal(drOf(pc2).result, 3, 'active flat DR remains +3 after block');
  });

  it('combination (D-DR-1 open), provenance, writer refusal and duplicate replay: second flat DR refuses whole; manual DR guarded; writer failure is atomic; movement and attribute coexist', async() => {
    const e1 = await admit(drRecord({ amount: 3, label: 'Aegis Ward' }));
    const e2 = await admit(drRecord({ amount: 2, label: 'Stone Skin', name: 'Disposable Stone Skin' }));
    const a1 = bundle(e1, { s: pc, t: foe });
    await approve(a1);

    // Forged generic add without approval refuses.
    const forged = effect.recordFor(a1);
    await refused('actor_consequence', edit(foe, [{ op: 'add', recordId: forged.recordId, record: forged }]), 'authored_effect_approval_required');

    // Writer refusal is atomic and keeps the pending approval.
    live().isPermanent = true; writer.admitConsequence = () => ({ queued: false, code: 'dr_writer_refusal' });
    await refused('actor_consequence', command(a1), 'dr_writer_refusal');
    live().isPermanent = false; delete writer.admitConsequence;
    assert.ok(payments.get(live(), a1.approvalId), 'approval retained after writer refusal');
    assert.equal(token(foe).state.conditions.length, 0);

    // Install first flat DR (+3) and verify duplicate replay returns the same receipt without double application.
    const c1 = command(a1), r1 = await accept(c1);
    const afterInstall = actors.clone(live().gameState);
    assert.deepEqual((await ack(gm, 'actor_consequence', c1)).receipt, r1.receipt);
    assert.deepEqual(live().gameState, afterInstall);
    assert.equal(token(foe).state.conditions.length, 1);

    // Second authored flat DR (same or different definition) on foe refuses with damage_reduction_combination_unresolved.
    const sameAgain = bundle(e1, { s: pc, t: foe });
    await approve(sameAgain);
    await refused('actor_consequence', command(sameAgain), 'damage_reduction_combination_unresolved');
    await withdraw(sameAgain);

    const diffDr = bundle(e2, { s: pc, t: foe });
    await approve(diffDr);
    await refused('actor_consequence', command(diffDr), 'damage_reduction_combination_unresolved');
    await withdraw(diffDr);

    // Non-GM manual damageReduction refuses; GM manual damageReduction while authored flat DR is active also refuses.
    const mId = uuid();
    const manualDr = { version: 1, id: mId, recordId: mId, name: 'Manual DR', originalName: 'Manual DR', type: 'buff', kind: 'effect', target: pc, targetId: 'pc', targetType: 'character', source: 'manual', effects: { damageReduction: 2 }, sharedTiming: 'manual', durationType: 'manual' };
    await refused('actor_consequence', edit(pc, [{ op: 'add', recordId: mId, record: manualDr }]), 'damage_reduction_change_gm_only', owner);
    const foeManualDr = { ...manualDr, target: foe, targetId: 'foe', targetType: 'creature' };
    await refused('actor_consequence', edit(foe, [{ op: 'add', recordId: mId, record: foeManualDr }]), 'damage_reduction_combination_unresolved');

    // Update or non-GM removal of accepted flat DR refuses.
    const rec = token(foe).state.conditions[0];
    await refused('actor_consequence', edit(foe, [{ op: 'update', recordId: rec.recordId, record: rec }]), 'authored_effect_correction_is_removal');
    await refused('actor_consequence', edit(foe, [{ op: 'update', recordId: rec.recordId, record: { ...rec, effects: { damageReduction: 10 } } }]), 'invalid_condition');
    await refused('actor_consequence', remove(foe, rec.recordId), null, owner);

    // Movement and attribute modifiers coexist on the same target with flat DR.
    const mvRec = drRecord({ name: 'Disposable Mire', extra: d => { d.controlConfig.authoredCondition = { profile: pure.EFFECT_CAPABILITY, effect: 'movement', movementFeet: -10, label: 'Mired', expiryPolicy: 'gm-manual', durationText: '1 min', gmNote: 'GM note' }; } });
    const attrRec = drRecord({ name: 'Disposable Hex', extra: d => { d.controlConfig.authoredCondition = { profile: pure.EFFECT_CAPABILITY, effect: 'attribute', attribute: 'agility', attributeAmount: -2, label: 'Clumsy', expiryPolicy: 'gm-manual', durationText: '1 min', gmNote: 'GM note' }; } });
    const mvEntry = await admit(mvRec), attrEntry = await admit(attrRec);
    const mvApp = bundle(mvEntry, { s: pc, t: foe }); await approve(mvApp); await accept(command(mvApp));
    const attrApp = bundle(attrEntry, { s: pc, t: foe }); await approve(attrApp); await accept(command(attrApp));
    assert.equal(token(foe).state.conditions.length, 3);
    assert.equal(drOf(foe).result, 3);
    assert.equal(profile.movementBreakdown(30, token(foe).state.conditions).result, 20);
    assert.equal(profile.attributeBreakdown(14, token(foe).state.conditions, 'agility').result, 12);
  });

  it('real spell candidates: legacy Aegis Ward, Refract Kinetic and Songbird Fragility are not silently stripped or auto-converted; structured Aegis Ward (+3 flat DR) admits cleanly', async() => {
    // 1. Legacy spg_aegis_ward (buffConfig with statModifier.stat === 'armor' + ABSORB_NEXT_MAGICAL_HIT_50_PCT) is refused without stripping its extra mechanics.
    const legacyAegisWard = {
      id: 'spg_aegis_ward', name: 'Aegis Ward', description: 'Protective ward.', level: 1, spellType: 'ACTION',
      effectTypes: ['buff'], typeConfig: { school: 'abjuration', tags: ['buff', 'protection'] },
      targetingConfig: { targetingType: 'single', rangeType: 'ranged', rangeDistance: 30, targetRestrictions: ['ally', 'self'] },
      resourceCost: { actionPoints: 1, resourceTypes: ['mana'], resourceValues: { mana: 4 }, useFormulas: {} },
      buffConfig: { durationType: 'rounds', durationValue: 3, effects: [{ id: 'aegis_dr', name: 'Aegis Protection', description: '+3 Armor (Flat DR) and absorbs 50% of next magical hit', statModifier: { stat: 'armor', magnitude: 3, magnitudeType: 'flat' } }] }
    };
    assert.equal(pure.definitionFromWizard(legacyAegisWard, { roomId: room.id, definitionVersion: 1, classId: 'spellguard' }).ok, false);

    // 2. Legacy minstrel_songbird_fragility (debuffConfig with negative damage_reduction: -3) is refused (D-DR-2 open).
    const legacySongbirdFragility = drRecord({ name: 'Songbird Fragility', amount: -3, label: 'Fragility' });
    assert.equal(pure.definitionFromWizard(legacySongbirdFragility, { roomId: room.id, definitionVersion: 1, classId: 'minstrel' }).ok, false);

    // 3. Re-authored single-mechanic Aegis Ward (+3 flat DR, 2 AEP + 1 AP) admits and executes cleanly.
    const structuredAegis = await admit(drRecord({ name: 'Aegis Ward', amount: 3, label: 'Aegis Ward' }));
    assert.deepEqual(structuredAegis.canonicalDefinition.effects.condition, { kind: 'damageReduction', amount: 3, label: 'Aegis Ward' });
  });
});
