/**
 * Outcome-branched spells (authored-outcome:v1 + random-outcome:v1) on the production stack:
 *   - Common trigger/adapter normalization across Dice, Fair Coin Flip, and Card Draw (preserving native differences)
 *   - Die Roll (DICE) & Fair Coin Flip (COINS) end-to-end execution through real handlers, binder, writer, and trigger engine
 *   - Two outcomes producing two distinct authored effects (damage vs healing)
 *   - Single AP + mana payment, replay/retry/reload idempotency, checkpoint durability
 *   - Fail-closed Card draw (no invented deck/reshuffle/reveal rules) & weighted-coin boundaries
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
const checkpoint = require('../services/roomCheckpoint');
const pure = require('../shared/services/authoredAbility');
const randomOutcome = require('../shared/services/randomOutcome');

const once = (s, e) => new Promise(r => s.once(e, r));
const ack = (s, e, d) => new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(Error(`ACK timeout: ${e}`)), 5000);
  s.emit(e, d, r => { clearTimeout(t); resolve(r); });
});
const clone = v => JSON.parse(JSON.stringify(v));

function wizardOutcomeRecord({
  name = 'Fortune Bolt',
  resolutionType = 'DICE',
  resolutionConfig = { diceType: 'd6', coinCount: 1, coinType: 'standard', cardCount: 1, deckType: 'standard' },
  entries = [
    {
      id: 'b1',
      name: 'Ember Lash',
      description: 'Scorches the target.',
      range: { min: 1, max: 3 },
      effectType: 'damage',
      effectConfig: { damageFormula: '2d6', damageType: 'ember' }
    },
    {
      id: 'b2',
      name: 'Vital Surge',
      description: 'Mends the target.',
      range: { min: 4, max: 6 },
      effectType: 'healing',
      effectConfig: { healingFormula: '10' }
    }
  ],
  ap = 1,
  mana = 3,
  id = uuid()
} = {}) {
  const draft = {
    name,
    description: 'An outcome-branched spell.',
    level: 1,
    spellType: 'ACTION',
    resolution: resolutionType,
    typeConfig: { school: 'ember', icon: 'spell_fire_flamebolt', castTimeType: 'IMMEDIATE', tags: ['outcome'] },
    effectTypes: [],
    effectsMap: {},
    rollableTable: {
      enabled: true,
      name: `${name} Table`,
      description: 'Resolves into distinct effects.',
      resolutionType,
      resolutionConfig,
      entries
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 30,
      targetRestrictions: ['any'],
      maxTargets: 1,
      selectionMethod: 'manual'
    },
    resourceCost: { actionPoints: ap, mana, components: [] },
    durationConfig: { durationType: 'instant' },
    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
    tags: ['outcome']
  };
  return Object.assign(clone(draft), {
    source: 'wizard',
    isCustom: true,
    categoryIds: ['offensive'],
    categories: ['all'],
    id: `lib-${id}`,
    authoredDefinitionId: id,
    authoredDraft: clone(draft),
    serializedData: JSON.stringify(draft)
  });
}

describe('Random-outcome spells (DICE + COINS + common trigger reader + fail-closed CARDS) on production stack', function () {
  this.timeout(30000);
  let server, room, gm, owner, observer, writer, target, pc, ownerUid;

  const live = () => server.rooms.get(room.id);
  const token = ref => actors.locate(live(), ref).token;
  const hp = ref => ({ current: token(ref).state.currentHp, temp: token(ref).state.tempHealth });
  const pools = () => {
    const c = token(pc).character;
    return { ap: c.actionPoints.current, tempAp: c.tempActionPoints, mana: c.mana.current, tempMana: c.tempMana };
  };
  const entryFor = ref => installed.list(live()).entries.find(e => pure.actionId(e.definitionRef) === pure.actionId(ref));

  async function admit(record, definitionVersion = 1) {
    return ack(gm, 'actor_authored_admit', {
      roomId: room.id,
      requestId: uuid(),
      expectedRegistryRevision: installed.registry(live()).revision,
      record,
      definitionVersion,
      classId: 'arcanoneer'
    });
  }

  function rollForBranch(branch, faces = []) {
    const r = randomOutcome.readBranchFormula(branch.effect.formula);
    if (r.dice.length === 0) {
      return { mode: 'deterministic', dice: [], constant: r.constant, reading: r.reading, total: r.constant };
    }
    return {
      mode: 'physical',
      dice: [{ sides: r.dice[0].sides, faces }],
      constant: r.constant,
      reading: r.reading,
      total: faces.reduce((a, b) => a + b, r.constant)
    };
  }

  function approvalForOutcome(e, outcome, faces = [], extra = {}) {
    const d = e.canonicalDefinition;
    const resolved = randomOutcome.resolveBranch(d.outcomeTable, outcome);
    assert.equal(resolved.ok, true, resolved.reason);
    const roll = rollForBranch(resolved.branch, faces);
    return Object.assign({
      version: 1,
      roomId: room.id,
      approvalId: uuid(),
      actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence,
      source: pc,
      target,
      spell: {
        definitionId: pure.actionId(e.definitionRef),
        definitionHash: `${e.descriptor.capabilityId}/${e.definitionRef.definitionHash}`,
        name: d.name,
        kind: 'outcome',
        damageTypes: []
      },
      outcome: resolved.outcome,
      chosenBranch: resolved.branch,
      roll,
      price: e.descriptor.price,
      classPayment: null
    }, extra);
  }

  function commandForOutcome(a, { finalAmount = a.roll.total, reason = '' } = {}) {
    const p = actors.resources(token(a.source), 'character');
    const pay = {};
    for (const k of ['ap', 'mana']) {
      if (a.price[k] > 0) pay[k] = payments.tempFirst(p[k].current, p[k].temp, a.price[k]);
    }
    if (!Object.keys(pay).length) pay.ap = payments.tempFirst(p.ap.current, p.ap.temp, 0);
    const targetPools = actors.resources(token(a.target), 'creature').hp;
    const finalHp = payments.directPartResult(targetPools, a.chosenBranch.effect.kind, finalAmount).final;
    return {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence,
      source: a.source,
      target: a.target,
      approval: { approvalId: a.approvalId, contentHash: actors.hash(a) },
      actors: [
        { ref: a.source, expectedRevision: token(a.source).state.actorContract.revision, finalResources: pay },
        { ref: a.target, expectedRevision: token(a.target).state.actorContract.revision, finalResources: { hp: finalHp } }
      ],
      adjudication: {
        definitionId: a.spell.definitionId,
        definitionVersionOrHash: a.spell.definitionHash,
        finalAmount,
        adjustmentReason: reason,
        chosenResult: JSON.stringify({
          capability: pure.OUTCOME_CAPABILITY,
          approvalId: a.approvalId,
          roll: a.roll,
          kind: a.chosenBranch.effect.kind,
          outcome: a.outcome,
          chosenBranch: a.chosenBranch,
          damageTypes: a.chosenBranch.effect.damageTypes || [],
          spellName: a.spell.name,
          sourceName: 'pc',
          targetName: 'Target Creature',
          gmConfirmed: true
        })
      }
    };
  }

  beforeEach(async () => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async () => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer });
    await server.start();
    for (const e of ['actor_bind', 'actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_spell_approve', 'actor_spell_withdraw', 'actor_spell_list', 'actor_recovery', 'actor_relationship_set', 'actor_trigger_register']) {
      server.setEventLimits(e, { maxPerMinute: 4000, maxPerSecond: 4000 });
    }
    const gmUid = server.nextUserId();
    ownerUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid);
    server.registerAuthToken('owner', ownerUid);
    server.registerAuthToken('observer', server.nextUserId());
    gm = server.connect({ token: 'gm' });
    await once(gm, 'connect');
    room = await server.seedRoom(gm.id, { gmUserId: gmUid });
    for (const role of ['owner', 'observer']) {
      const s = server.connect({ token: role });
      await once(s, 'connect');
      const j = once(s, 'room_joined');
      s.emit('join_room', { roomId: room.id, playerName: role, password: '' });
      await j;
      if (role === 'owner') owner = s; else observer = s;
    }
    server.setCharacterOwner('c', ownerUid);
    const m = () => room.gameState.maps.default;
    const t = {
      id: 'target',
      name: 'Target Creature',
      creatureId: 'disposable',
      stats: { maxHp: 40, maxMana: 20, maxAP: 10, speed: 30 },
      state: { currentHp: 30, currentMana: 20, currentActionPoints: 10, tempHealth: 2, tempMana: 0, tempActionPoints: 0, conditions: [] }
    };
    m().tokens.target = t;
    const tr = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'target' }, snapshotHash: actors.hash(t) });
    assert.equal(tr.success, true, JSON.stringify(tr));
    target = tr.ref;
    m().characterTokens.pc = {
      id: 'pc',
      ownerUserId: ownerUid,
      character: {
        id: 'c',
        class: 'Arcanoneer',
        health: { current: 20, max: 30 },
        mana: { current: 10, max: 10 },
        actionPoints: { current: 4, max: 4 },
        tempMana: 1,
        tempActionPoints: 1
      },
      state: { conditions: [] }
    };
    const pr = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'c' }, snapshotHash: actors.hash(m().characterTokens.pc) });
    assert.equal(pr.success, true, JSON.stringify(pr));
    pc = pr.ref;
    const rel = await ack(gm, 'actor_relationship_set', {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence,
      pairs: [{ a: pc, b: target }],
      value: 'enemy',
      expectedRelationshipRevision: relationships.revision(live())
    });
    assert.equal(rel.success, true, JSON.stringify(rel));
  });

  afterEach(async () => {
    gm.disconnect();
    owner.disconnect();
    observer.disconnect();
    await server.stop();
  });

  it('common trigger reader normalizes dice, fair coins, and card draws under random-outcome:v1 while preserving native differences', () => {
    const diceOut = randomOutcome.fromDiceRoll({ mode: 'digital', dice: [{ sides: 6, faces: [4] }], constant: 0 });
    const coinOut = randomOutcome.fromCoinFlip({ coinType: 'standard', coins: [{ result: 'heads' }, { result: 'tails' }] }, 'digital');
    const cardOut = randomOutcome.fromCardDraw({ manual: true, deckType: 'standard', cards: [{ suit: 'Hearts', rank: 'A' }] }, 'digital');

    const diceFacts = triggers.readOutcomeFacts(diceOut, { branchId: 'branch-2', label: 'Surge', effect: { kind: 'healing', formula: '10' } });
    const coinFacts = triggers.readOutcomeFacts(coinOut, { branchId: 'branch-2', label: 'Split', effect: { kind: 'damage', formula: '2d4', damageTypes: ['storm'] } });
    const cardFacts = triggers.readOutcomeFacts(cardOut, null);

    assert.equal(diceFacts.version, 'random-outcome:v1');
    assert.equal(diceFacts.mechanic, 'dice');
    assert.deepEqual(diceFacts.dice, { sides: 6, faces: [4], total: 4, reading: '1d6' });
    assert.equal(diceFacts.coin, undefined);

    assert.equal(coinFacts.version, 'random-outcome:v1');
    assert.equal(coinFacts.mechanic, 'coin');
    assert.deepEqual(coinFacts.coin, { count: 2, coinType: 'standard', flips: ['heads', 'tails'], heads: 1, tails: 1 });
    assert.equal(coinFacts.dice, undefined);

    assert.equal(cardFacts.version, 'random-outcome:v1');
    assert.equal(cardFacts.mechanic, 'card');
    assert.equal(cardFacts.card.manualReveal, true);
    assert.equal(cardFacts.card.deckType, 'standard');
    assert.equal(cardFacts.card.cards[0].name, 'Ace of Hearts');

    assert.equal(randomOutcome.matchesOutcomeEvidence('committed', { committed: 1, mechanic: 'coin' }), true);
    assert.equal(randomOutcome.matchesOutcomeEvidence('coin', { committed: 1, mechanic: 'coin' }), true);
    assert.equal(randomOutcome.matchesOutcomeEvidence('dice', { committed: 1, mechanic: 'coin' }), false);
  });

  it('DICE (1d6): two outcomes produce two different authored effects, pay once, fire common triggers, and block replay/reload duplication', async () => {
    const adm = await admit(wizardOutcomeRecord());
    assert.equal(adm.success, true, JSON.stringify(adm));
    const entry = entryFor(adm.definitionRef);
    assert.equal(entry.descriptor.compilerVersion, 'p14-random-outcome-1');

    // Register diagnostic triggers on random-outcome (committed, dice, coin) and immediate damage/healing
    for (const on of [
      { occurrence: 'random-outcome', role: 'source', evidence: 'committed' },
      { occurrence: 'random-outcome', role: 'source', evidence: 'dice' },
      { occurrence: 'random-outcome', role: 'source', evidence: 'coin' },
      { occurrence: 'immediate-damage', role: 'source', evidence: 'baseHpLost' },
      { occurrence: 'immediate-healing', role: 'source', evidence: 'hpRestored' }
    ]) {
      const tr = await ack(gm, 'actor_trigger_register', {
        roomId: room.id,
        requestId: uuid(),
        expectedRevision: triggers.project(live(), { gm: true, uid: room.gmId }, 0, true).revision,
        source: pc,
        definitionRef: entry.definitionRef,
        on
      });
      // wait — register listener targeting a separate definition or self? Self-generated exclusion skips listeners for the SAME definitionId!
      assert.equal(tr.success, true, JSON.stringify(tr));
    }

    // Also register a second admitted ability as listener so self-generated exclusion does NOT suppress it
    const watcherRec = wizardOutcomeRecord({ name: 'Watcher Spell' });
    const watcherAdm = await admit(watcherRec);
    assert.equal(watcherAdm.success, true);
    for (const on of [
      { occurrence: 'random-outcome', role: 'source', evidence: 'dice' },
      { occurrence: 'random-outcome', role: 'source', evidence: 'coin' },
      { occurrence: 'immediate-damage', role: 'source', evidence: 'baseHpLost' }
    ]) {
      const tr = await ack(gm, 'actor_trigger_register', {
        roomId: room.id,
        requestId: uuid(),
        expectedRevision: triggers.project(live(), { gm: true, uid: room.gmId }, 0, true).revision,
        source: pc,
        definitionRef: watcherAdm.definitionRef,
        on
      });
      assert.equal(tr.success, true, JSON.stringify(tr));
    }

    // Cast 1: outcome d6 = 2 -> Damage 2d6 (faces [4, 3] = 7): target 30hp/2temp -> 25hp/0temp; caster pays 1 AP (temp first) + 3 mana (1 temp, 2 current)
    const outDamage = randomOutcome.fromDiceRoll({ mode: 'digital', dice: [{ sides: 6, faces: [2] }], constant: 0 });
    const a1 = approvalForOutcome(entry, outDamage, [4, 3]);
    const apAck1 = await ack(owner, 'actor_spell_approve', a1);
    assert.equal(apAck1.code, 'awaiting_gm');
    const cmd1 = commandForOutcome(a1);
    const res1 = await ack(gm, 'actor_consequence', cmd1);
    assert.equal(res1.success, true, JSON.stringify(res1));
    assert.deepEqual(hp(target), { current: 25, temp: 0 });
    assert.deepEqual(pools(), { ap: 4, tempAp: 0, mana: 8, tempMana: 0 });

    // Check trigger engine captured ONLY dice & immediate-damage (NOT coin) with full outcome envelope
    const obs1 = triggers.project(live(), { gm: true, uid: room.gmId }, 0, true).obligations;
    assert.equal(obs1.some(o => o.occurrence.kind === 'random-outcome' && o.listener.on.evidence === 'dice' && o.occurrence.evidence.outcome.dice.total === 2), true);
    assert.equal(obs1.some(o => o.occurrence.kind === 'random-outcome' && o.listener.on.evidence === 'coin'), false);
    assert.equal(obs1.some(o => o.occurrence.kind === 'immediate-damage' && o.occurrence.outcome?.matchedBranchLabel === 'Ember Lash'), true);

    // Retry / replay / reload idempotency after resolution:
    // 1) Re-sending actor_spell_approve returns existing receipt with no extra cost or HP change
    const retryApprove = await ack(owner, 'actor_spell_approve', a1);
    assert.equal(retryApprove.success, true);
    assert.equal(retryApprove.receipt.commandId, res1.receipt.commandId);
    assert.deepEqual(hp(target), { current: 25, temp: 0 });
    assert.deepEqual(pools(), { ap: 4, tempAp: 0, mana: 8, tempMana: 0 });
    // 2) Re-sending exact actor_consequence replays same receipt
    const retryCmd = await ack(gm, 'actor_consequence', cmd1);
    assert.equal(retryCmd.success, true);
    assert.equal(retryCmd.receipt.commandId, res1.receipt.commandId);
    assert.deepEqual(hp(target), { current: 25, temp: 0 });
    // 3) New commandId claiming the same approvalId refuses as approval_consumed
    const doubleCmd = await ack(gm, 'actor_consequence', { ...cmd1, commandId: uuid() });
    assert.equal(doubleCmd.success, false);
    assert.equal(doubleCmd.code, 'approval_consumed');
    assert.deepEqual(hp(target), { current: 25, temp: 0 });
    // 4) Checkpoint round-trip reload preserves state & consumed approval
    const built = checkpoint.buildCheckpointDocuments({ roomId: room.id, gameState: live().gameState, revision: 1 });
    assert.equal(built.ok, true, built.reason);
    const decoded = checkpoint.decodeCanonicalCheckpoint({
      checkpoint: built.manifest,
      globalDoc: built.global.data,
      mapDocsById: Object.fromEntries(built.maps.map(d => [d.mapId, d.data]))
    });
    assert.equal(decoded.ok, true, decoded.reason);
    const hydrated = checkpoint.hydrateSnapshotToGameState(decoded);
    assert.equal(hydrated.actorConsequences.receipts.length, 2);
    assert.equal(hydrated.actorConsequences.receipts.some(r => r.commandId === res1.receipt.commandId), true);

    // Cast 2: outcome d6 = 5 -> Healing fixed 10: target 25 -> 35 HP; caster pays 1 AP + 3 mana once
    const outHeal = randomOutcome.fromDiceRoll({ mode: 'digital', dice: [{ sides: 6, faces: [5] }], constant: 0 });
    const a2 = approvalForOutcome(entry, outHeal);
    assert.equal((await ack(owner, 'actor_spell_approve', a2)).code, 'awaiting_gm');
    const res2 = await ack(gm, 'actor_consequence', commandForOutcome(a2));
    assert.equal(res2.success, true, JSON.stringify(res2));
    assert.deepEqual(hp(target), { current: 35, temp: 0 });
    assert.deepEqual(pools(), { ap: 3, tempAp: 0, mana: 5, tempMana: 0 });
  });

  it('COINS (fair standard coin flip): two outcomes produce two different authored effects, pay once, fire coin triggers, and support multi-coin partitions', async () => {
    const coinRec = wizardOutcomeRecord({
      name: 'Two-Faced Gale',
      resolutionType: 'COINS',
      resolutionConfig: { coinCount: 1, coinType: 'standard' },
      entries: [
        {
          id: 'c1',
          name: 'Rime Snap',
          description: 'Frostbite on Heads.',
          coinPattern: 'Heads',
          effectType: 'damage',
          effectConfig: { damageFormula: '1d8', damageType: 'rime' }
        },
        {
          id: 'c2',
          name: 'Warm Balm',
          description: 'Mending on Tails.',
          coinPattern: 'Tails',
          effectType: 'healing',
          effectConfig: { healingFormula: '1d6+2' }
        }
      ]
    });
    const adm = await admit(coinRec);
    assert.equal(adm.success, true, JSON.stringify(adm));
    const entry = entryFor(adm.definitionRef);

    const watcher = await admit(wizardOutcomeRecord({ name: 'Coin Watcher' }));
    assert.equal(watcher.success, true);
    const regCoin = await ack(gm, 'actor_trigger_register', {
      roomId: room.id,
      requestId: uuid(),
      expectedRevision: triggers.project(live(), { gm: true, uid: room.gmId }, 0, true).revision,
      source: pc,
      definitionRef: watcher.definitionRef,
      on: { occurrence: 'random-outcome', role: 'source', evidence: 'coin' }
    });
    assert.equal(regCoin.success, true, JSON.stringify(regCoin));

    // Outcome A: Heads -> Rime damage 1d8 (face [6] = 6): target 30hp/2temp -> 26hp/0temp; caster pays once
    const heads = randomOutcome.fromCoinFlip({ coinType: 'standard', coins: [{ result: 'heads' }] }, 'digital');
    const aHeads = approvalForOutcome(entry, heads, [6]);
    assert.equal((await ack(owner, 'actor_spell_approve', aHeads)).code, 'awaiting_gm');
    const resHeads = await ack(gm, 'actor_consequence', commandForOutcome(aHeads));
    assert.equal(resHeads.success, true, JSON.stringify(resHeads));
    assert.deepEqual(hp(target), { current: 26, temp: 0 });
    assert.deepEqual(pools(), { ap: 4, tempAp: 0, mana: 8, tempMana: 0 });

    const obs = triggers.project(live(), { gm: true, uid: room.gmId }, 0, true).obligations;
    assert.equal(obs.length, 1);
    assert.equal(obs[0].occurrence.evidence.outcome.coin.heads, 1);
    assert.equal(obs[0].occurrence.evidence.outcome.matchedBranchLabel, 'Rime Snap');

    // Outcome B: Tails -> Warm Balm healing 1d6+2 (face [4] + 2 = 6): target 26 -> 32 HP; caster pays once
    const tails = randomOutcome.fromCoinFlip({ coinType: 'standard', coins: [{ result: 'tails' }] }, 'digital');
    const aTails = approvalForOutcome(entry, tails, [4]);
    assert.equal((await ack(owner, 'actor_spell_approve', aTails)).code, 'awaiting_gm');
    const resTails = await ack(gm, 'actor_consequence', commandForOutcome(aTails));
    assert.equal(resTails.success, true, JSON.stringify(resTails));
    assert.deepEqual(hp(target), { current: 32, temp: 0 });
    assert.deepEqual(pools(), { ap: 3, tempAp: 0, mana: 5, tempMana: 0 });

    // Multi-coin (2 fair coins): Majority Heads / Tie / Majority Tails
    const twoCoinRec = wizardOutcomeRecord({
      name: 'Twin Coin Ward',
      resolutionType: 'COINS',
      resolutionConfig: { coinCount: 2, coinType: 'standard' },
      entries: [
        { id: 'm1', name: 'Double Flare', coinPattern: 'All Heads', effectType: 'damage', effectConfig: { damageFormula: '8', damageType: 'ember' } },
        { id: 'm2', name: 'Equilibrium', coinPattern: 'Tie', effectType: 'healing', effectConfig: { healingFormula: '5' } },
        { id: 'm3', name: 'Shadow Toll', coinPattern: 'All Tails', effectType: 'damage', effectConfig: { damageFormula: '4', damageType: 'blight' } }
      ]
    });
    const twoAdm = await admit(twoCoinRec);
    assert.equal(twoAdm.success, true, JSON.stringify(twoAdm));
    const twoEntry = entryFor(twoAdm.definitionRef);
    const splitFlip = randomOutcome.fromCoinFlip({ coinType: 'standard', coins: [{ result: 'heads' }, { result: 'tails' }] }, 'digital');
    const aSplit = approvalForOutcome(twoEntry, splitFlip);
    assert.equal(aSplit.chosenBranch.label, 'Equilibrium');
    assert.equal((await ack(owner, 'actor_spell_approve', aSplit)).code, 'awaiting_gm');
    const resSplit = await ack(gm, 'actor_consequence', commandForOutcome(aSplit));
    assert.equal(resSplit.success, true);
    assert.deepEqual(hp(target), { current: 37, temp: 0 });
  });

  it('fails closed on CARDS (unsettled deck, reshuffle, and reveal rules), weighted coins, forged branch, and incomplete dice/coin partitions', async () => {
    const cardRecord = wizardOutcomeRecord({
      name: 'Deck of Fate',
      resolutionType: 'CARDS',
      resolutionConfig: { cardCount: 1, deckType: 'standard' },
      entries: [
        { id: 'cd1', name: 'Crimson Flare', cardPattern: 'Red Cards', effectType: 'damage', effectConfig: { damageFormula: '2d6', damageType: 'ember' } },
        { id: 'cd2', name: 'Velvet Ward', cardPattern: 'Black Cards', effectType: 'healing', effectConfig: { healingFormula: '2d6' } }
      ]
    });
    const cardSnapshot = clone(cardRecord);
    const cardCompiled = pure.definitionFromWizard(cardRecord, { roomId: room.id, definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(cardCompiled.ok, false);
    assert.match(cardCompiled.reason, /deck persistence, reshuffle, and face-down reveal rules/i);
    assert.deepEqual(cardRecord, cardSnapshot);

    const cardAdmit = await admit(cardRecord);
    assert.equal(cardAdmit.success, false);
    assert.equal(installed.registry(live()).definitions.some(e => e.canonicalDefinition.name === 'Deck of Fate'), false);

    // Weighted coins refuse fail-closed
    const weightedRecord = wizardOutcomeRecord({
      name: 'Loaded Penny',
      resolutionType: 'COINS',
      resolutionConfig: { coinCount: 1, coinType: 'weighted' },
      entries: [
        { id: 'w1', name: 'A', coinPattern: 'Heads', effectType: 'damage', effectConfig: { damageFormula: '4', damageType: 'ember' } },
        { id: 'w2', name: 'B', coinPattern: 'Tails', effectType: 'healing', effectConfig: { healingFormula: '4' } }
      ]
    });
    const wCompiled = pure.definitionFromWizard(weightedRecord, { roomId: room.id, definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(wCompiled.ok, false);
    assert.match(wCompiled.reason, /Weighted coins/i);

    // Incomplete d6 coverage refuses
    const gapRecord = wizardOutcomeRecord({
      name: 'Gap Die',
      resolutionType: 'DICE',
      resolutionConfig: { diceType: 'd6' },
      entries: [
        { id: 'g1', name: 'Low', range: { min: 1, max: 2 }, effectType: 'damage', effectConfig: { damageFormula: '4', damageType: 'ember' } },
        { id: 'g2', name: 'High', range: { min: 4, max: 6 }, effectType: 'healing', effectConfig: { healingFormula: '4' } }
      ]
    });
    const gapCompiled = pure.definitionFromWizard(gapRecord, { roomId: room.id, definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(gapCompiled.ok, false);
    assert.match(gapCompiled.reason, /missing: 3/i);

    // Forged branch mismatch against recorded outcome fails at approval
    const validAdm = await admit(wizardOutcomeRecord());
    assert.equal(validAdm.success, true);
    const validEntry = entryFor(validAdm.definitionRef);
    const lowOutcome = randomOutcome.fromDiceRoll({ mode: 'digital', dice: [{ sides: 6, faces: [1] }], constant: 0 });
    const realApproval = approvalForOutcome(validEntry, lowOutcome, [4, 2]);
    const forgedApproval = {
      ...realApproval,
      chosenBranch: clone(validEntry.canonicalDefinition.outcomeTable.branches[1]),
      roll: { mode: 'deterministic', dice: [], constant: 10, total: 10, reading: '10' }
    };
    const forgedAck = await ack(owner, 'actor_spell_approve', forgedApproval);
    assert.equal(forgedAck.success, false);
    assert.equal(forgedAck.code, 'authored_outcome_mismatch');

    // Forged card payload at approval fails with card_rules_unsettled
    const cardPayload = randomOutcome.fromCardDraw({ cards: [{ suit: 'Hearts', rank: 'K' }], manual: false }, 'digital');
    const cardDefCompile = registryCompiler.compileDefinition({
      ...clone(validEntry.canonicalDefinition),
      outcomeTable: { name: 'x', mechanic: 'card', spec: { count: 1 }, branches: validEntry.canonicalDefinition.outcomeTable.branches }
    });
    assert.equal(cardDefCompile.ok, false);
    const cardApproveAck = await ack(owner, 'actor_spell_approve', {
      ...realApproval,
      outcome: cardPayload
    });
    assert.equal(cardApproveAck.success, false);
    assert.equal(cardApproveAck.code, 'card_rules_unsettled');
  });
});
