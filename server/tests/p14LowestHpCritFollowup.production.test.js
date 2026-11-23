const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const installed = require('../services/installedAuthoredAbilities');
const definitions = require('../services/installedDefinitionRegistry');
const payments = require('../services/spellPayments');
const relationships = require('../services/actorRelationships');
const pure = require('../shared/services/authoredAbility');
const effect = require('../shared/services/authoredEffect');
const profile = require('../../vtt-react/src/services/sharedConditionProfile');

const once = (s, e) => new Promise(r => s.once(e, r));
const ack = (s, e, d) => new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(Error(e)), 5000);
  s.emit(e, d, r => { clearTimeout(t); resolve(r); });
});

/** Ordinary Wizard record — never inspected by spell name. */
function wizardBoltRecord({
  name = 'Crippling Bolt',
  formula = '1d8',
  selectionMethod = 'lowest_health',
  restriction = 'enemy',
  rangeFeet = 30,
  includeControl = true,
  includeCritGate = true,
  condition = { kind: 'stunned' },
  ap = 1,
  mana = 3,
  definitionId = uuid(),
  extra
} = {}) {
  const d = {
    name,
    description: 'Generic lowest-HP bolt with reusable settings.',
    spellType: 'ACTION',
    typeConfig: { castTimeType: 'IMMEDIATE' },
    effectTypes: includeControl ? ['damage', 'control'] : ['damage'],
    damageConfig: { damageType: 'direct', elementType: 'arcane', formula, resolution: 'DICE' },
    ...(includeControl ? {
      controlConfig: {
        authoredCondition: {
          profile: pure.EFFECT_CAPABILITY,
          effect: condition.kind,
          ...(condition.kind === 'movement' ? { movementFeet: condition.feet, label: condition.label } : {}),
          ...(condition.kind === 'attribute' ? { attribute: condition.attribute, attributeAmount: condition.amount, label: condition.label } : {}),
          ...(condition.kind === 'damageReduction' ? { drAmount: condition.amount, label: condition.label } : {}),
          expiryPolicy: 'gm-manual',
          durationText: 'Until dispelled or end of encounter',
          gmNote: 'GM adjudicates spell resolution before confirming.'
        }
      }
    } : {}),
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: rangeFeet,
      maxTargets: 1,
      targetRestrictions: [restriction],
      selectionMethod,
      targetSelectionMethod: selectionMethod
    },
    resourceCost: { actionPoints: ap, mana }
  };
  if (includeCritGate) {
    d.triggerConfig = {
      global: { logicType: 'AND', compoundTriggers: [] },
      effectTriggers: {
        control: {
          logicType: 'AND',
          compoundTriggers: [{
            id: 'critical_hit',
            category: 'combat',
            name: 'Critical Hit',
            parameters: { perspective: 'self' }
          }],
          targetingOverride: null
        }
      },
      conditionalEffects: {},
      buffDebuffTriggers: {},
      requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
      triggerRole: { mode: 'CONDITIONAL' }
    };
  }
  if (extra) extra(d);
  return { ...actors.clone(d), authoredDraft: d, authoredDefinitionId: definitionId };
}

const rollFor = (formula, faces) => {
  const r = pure.readFormula(formula);
  const dice = [{ sides: r.dice[0].sides, faces }];
  return {
    mode: 'physical',
    dice,
    constant: r.constant,
    reading: r.reading,
    total: faces.reduce((a, b) => a + b, r.constant)
  };
};

describe('P14 lowest-HP targeting + critical-hit gated follow-up — production stack', function () {
  this.timeout(20000);
  let server, room, gm, owner, observer, writer, pc, refs, ownerUid;

  beforeEach(async () => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async () => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer });
    await server.start();
    for (const e of [
      'actor_bind', 'actor_snapshot', 'actor_consequence', 'actor_authored_admit',
      'actor_authored_revoke', 'actor_spell_approve', 'actor_spell_withdraw',
      'actor_spell_list', 'actor_relationship_set', 'combat_started', 'combat_ended'
    ]) {
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
      if (role === 'owner') owner = s;
      else observer = s;
    }
    server.setCharacterOwner('c', ownerUid);

    const map = room.gameState.maps.default;
    map.gridSettings = { gridType: 'square', gridSize: 50, feetPerTile: 5, gridOffsetX: 0, gridOffsetY: 0 };

    // Caster PC at (100, 100); 30 ft range = 300 px at 50 px per 5 ft.
    map.characterTokens.pc = {
      id: 'pc',
      ownerUserId: ownerUid,
      position: { x: 100, y: 100 },
      character: {
        id: 'c',
        name: 'Lyra',
        class: 'Arcanoneer',
        health: { current: 30, max: 30 },
        mana: { current: 30, max: 30 },
        actionPoints: { current: 20, max: 20 },
        tempMana: 0,
        tempActionPoints: 0
      },
      state: { conditions: [] }
    };
    pc = (await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'c' },
      snapshotHash: actors.hash(map.characterTokens.pc)
    })).ref;
    assert.ok(pc);

    // 7 creatures spanning out-of-range, ally, neutral, hidden enemy, and 3 visible enemies in range
    const creatureSpecs = [
      ['enemyOutOfRange', 'Distant Imp', { x: 500, y: 100 }, 2, 0, false, 'enemy'],     // 40 ft
      ['allyInRange', 'Wounded Ally', { x: 150, y: 100 }, 3, 0, false, 'ally'],        // 5 ft
      ['neutralInRange', 'Bystander', { x: 170, y: 100 }, 4, 0, false, 'neutral'],     // 7 ft
      ['hiddenEnemyInRange', 'Shadow Stalker', { x: 200, y: 100 }, 1, 0, true, 'enemy'], // 10 ft hidden
      ['enemyHighHp', 'Healthy Brute', { x: 210, y: 100 }, 25, 0, false, 'enemy'],     // 11 ft
      ['enemyMidHp', 'Hurt Marauder', { x: 250, y: 100 }, 14, 0, false, 'enemy'],      // 15 ft
      ['enemyLowestHp', 'Shielded Goblin', { x: 350, y: 100 }, 9, 10, false, 'enemy']  // 25 ft, base 9 + temp 10
    ];
    refs = {};
    for (const [id, name, position, currentHp, tempHealth, hidden] of creatureSpecs) {
      room.gameState.maps.default.tokens[id] = {
        id,
        name,
        creatureId: 'disposable',
        position,
        stats: { maxHp: 30, maxMana: 20, maxAP: 10, speed: 30 },
        state: {
          currentHp,
          currentMana: 20,
          currentActionPoints: 10,
          tempHealth,
          tempMana: 0,
          tempActionPoints: 0,
          ...(hidden ? { hiddenFromPlayers: true } : {}),
          conditions: []
        }
      };
      const bound = await ack(gm, 'actor_bind', {
        roomId: room.id,
        ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: id },
        snapshotHash: actors.hash(room.gameState.maps.default.tokens[id])
      });
      assert.equal(bound.success, true, `bind ${id}: ${JSON.stringify(bound)}`);
      refs[id] = bound.ref;
    }

    for (const [id, , , , , , rel] of creatureSpecs) {
      if (rel === 'neutral') continue;
      const r = await ack(gm, 'actor_relationship_set', {
        version: 1,
        roomId: room.id,
        commandId: uuid(),
        actionEpoch: actors.epoch(live()),
        baseCommitSequence: actors.ledger(live()).commitSequence,
        pairs: [{ a: pc, b: refs[id] }],
        value: rel,
        expectedRelationshipRevision: relationships.revision(live())
      });
      assert.equal(r.success, true, `rel ${id}: ${JSON.stringify(r)}`);
    }
  });

  afterEach(async () => {
    gm?.disconnect();
    owner?.disconnect();
    observer?.disconnect();
    await server?.stop();
  });

  const live = () => server.rooms.get(room.id);
  const token = ref => actors.locate(live(), ref).token;
  const entryFor = ref => installed.list(live()).entries.find(e => pure.actionId(e.definitionRef) === pure.actionId(ref));
  const resolution = d => ({
    gmConfirmed: true,
    timing: d.timing,
    timingNote: 'GM resolved spell target, range and outcome.',
    evidence: 'GM table note'
  });

  async function admitPc(record, definitionVersion = 1) {
    const r = await ack(gm, 'actor_authored_admit', {
      roomId: room.id,
      requestId: uuid(),
      expectedRegistryRevision: installed.registry(live()).revision,
      record,
      definitionVersion,
      classId: 'arcanoneer'
    });
    assert.equal(r.success, true, JSON.stringify(r));
    return r.definitionRef;
  }

  function effectApprovalFor(defRef, targetRef, faces) {
    const e = entryFor(defRef);
    const d = e.canonicalDefinition;
    return {
      version: 1,
      roomId: room.id,
      approvalId: uuid(),
      actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence,
      source: pc,
      target: targetRef,
      spell: {
        definitionId: pure.actionId(e.definitionRef),
        definitionHash: `${pure.EFFECT_CAPABILITY}/${e.definitionRef.definitionHash}`,
        name: d.name,
        kind: 'effect',
        damageTypes: d.effects.direct.damageTypes || []
      },
      roll: rollFor(d.effects.direct.formula, faces),
      price: e.descriptor.price,
      classPayment: null,
      effectTerms: effect.termsFor(d)
    };
  }

  function plainDamageApprovalFor(defRef, targetRef, faces) {
    const e = entryFor(defRef);
    const d = e.canonicalDefinition;
    return {
      version: 1,
      roomId: room.id,
      approvalId: uuid(),
      actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence,
      source: pc,
      target: targetRef,
      spell: {
        definitionId: pure.actionId(e.definitionRef),
        definitionHash: `${e.descriptor.capabilityId}/${e.definitionRef.definitionHash}`,
        name: d.name,
        kind: 'damage',
        damageTypes: d.effect.damageTypes || []
      },
      roll: rollFor(d.effect.formula, faces),
      price: e.descriptor.price,
      classPayment: null
    };
  }

  function effectCommand(a, { amount, reason = '', forceConditions } = {}) {
    const pools = actors.resources(token(a.source), 'character');
    const pay = {};
    for (const p of ['ap', 'mana']) if (a.price[p] > 0) pay[p] = payments.tempFirst(pools[p].current, pools[p].temp, a.price[p]);
    if (!Object.keys(pay).length) pay.ap = payments.tempFirst(pools.ap.current, pools.ap.temp, 0);

    const direct = a.effectTerms.direct;
    const finalAmount = amount ?? a.roll.total;
    const resolved = resolution({ timing: a.effectTerms.timing });
    const applies = effect.conditionApplies(a.effectTerms, undefined, a.roll);
    const plan = applies ? effect.conditionPlan(a, token(a.target).state.conditions || []) : { ops: null, combination: null };

    const hp = actors.resources(token(a.target), 'creature').hp;
    const fromTemp = Math.min(hp.temp, finalAmount);
    const targetEntry = {
      ref: a.target,
      expectedRevision: token(a.target).state.actorContract.revision,
      finalResources: { hp: { current: Math.max(0, hp.current - (finalAmount - fromTemp)), temp: hp.temp - fromTemp } }
    };
    if (forceConditions !== undefined) {
      targetEntry.conditions = forceConditions === true
        ? [{ op: 'add', recordId: a.approvalId, record: effect.recordFor(a) }]
        : forceConditions;
    } else if (applies) {
      targetEntry.conditions = plan.ops;
    }

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
        targetEntry
      ],
      adjudication: {
        definitionId: a.spell.definitionId,
        definitionVersionOrHash: a.spell.definitionHash,
        finalAmount,
        adjustmentReason: reason,
        chosenResult: JSON.stringify(effect.resultFor(a, resolved, applies ? (plan.combination || null) : null))
      }
    };
  }

  function plainDamageCommand(a, { amount, reason = '' } = {}) {
    const pools = actors.resources(token(a.source), 'character');
    const pay = {};
    for (const p of ['ap', 'mana']) if (a.price[p] > 0) pay[p] = payments.tempFirst(pools[p].current, pools[p].temp, a.price[p]);
    if (!Object.keys(pay).length) pay.ap = payments.tempFirst(pools.ap.current, pools.ap.temp, 0);

    const finalAmount = amount ?? a.roll.total;
    const hp = actors.resources(token(a.target), 'creature').hp;
    const fromTemp = Math.min(hp.temp, finalAmount);
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
        {
          ref: a.target,
          expectedRevision: token(a.target).state.actorContract.revision,
          finalResources: { hp: { current: Math.max(0, hp.current - (finalAmount - fromTemp)), temp: hp.temp - fromTemp } }
        }
      ],
      adjudication: {
        definitionId: a.spell.definitionId,
        definitionVersionOrHash: a.spell.definitionHash,
        finalAmount,
        adjustmentReason: reason,
        chosenResult: JSON.stringify({
          capability: pure.CAPABILITY,
          approvalId: a.approvalId,
          roll: a.roll,
          kind: 'damage',
          damageTypes: a.spell.damageTypes,
          spellName: a.spell.name,
          sourceName: 'pc',
          targetName: token(a.target).name,
          gmConfirmed: true
        })
      }
    };
  }

  async function approve(a) {
    const before = actors.clone(live().gameState);
    const r = await ack(owner, 'actor_spell_approve', a);
    assert.equal(r.code, 'awaiting_gm', JSON.stringify(r));
    assert.deepEqual(live().gameState, before);
    return r;
  }

  async function refused(event, data, expectedCode, socket = owner) {
    const before = actors.clone(live().gameState);
    const r = await ack(socket, event, data);
    assert.equal(r.success, false, JSON.stringify(r));
    if (expectedCode) assert.equal(r.code, expectedCode, JSON.stringify(r));
    assert.deepEqual(live().gameState, before);
    return r;
  }

  it('multi-enemy battlefield: excludes out-of-range, ally, neutral, and hidden actors strictly BEFORE base-HP ranking', async () => {
    const defRef = await admitPc(wizardBoltRecord());

    // Lower HP enemies/allies/neutrals/hidden MUST be excluded BEFORE ranking by currentHp:
    await refused('actor_spell_approve', effectApprovalFor(defRef, refs.enemyOutOfRange, [4]), 'target_out_of_range');
    await refused('actor_spell_approve', effectApprovalFor(defRef, refs.allyInRange, [4]), 'target_relationship_mismatch');
    await refused('actor_spell_approve', effectApprovalFor(defRef, refs.neutralInRange, [4]), 'target_relationship_mismatch');
    await refused('actor_spell_approve', effectApprovalFor(defRef, refs.hiddenEnemyInRange, [4]), 'actor_not_found');

    // Among visible in-range enemies (25, 14, 9 base HP), higher-HP enemies are refused:
    await refused('actor_spell_approve', effectApprovalFor(defRef, refs.enemyHighHp, [4]), 'target_not_lowest_hp');
    await refused('actor_spell_approve', effectApprovalFor(defRef, refs.enemyMidHp, [4]), 'target_not_lowest_hp');

    // enemyLowestHp has currentHp=9 + tempHealth=10 (=19 effective), proving tempHealth is excluded from base-HP ranking:
    await approve(effectApprovalFor(defRef, refs.enemyLowestHp, [4]));
  });

  it('HP ties & commit-time revalidation: accepts any tied lowest-HP enemy; refuses stale commit when HP or range changes', async () => {
    const defRef = await admitPc(wizardBoltRecord());

    // Drop enemyMidHp base HP to 9 -> ties with enemyLowestHp; both are accepted individually, while enemyHighHp is still refused
    token(refs.enemyMidHp).state.currentHp = 9;
    await refused('actor_spell_approve', effectApprovalFor(defRef, refs.enemyHighHp, [4]), 'target_not_lowest_hp');

    const a2 = effectApprovalFor(defRef, refs.enemyMidHp, [4]);
    await approve(a2);
    await ack(owner, 'actor_spell_withdraw', { roomId: room.id, approvalId: a2.approvalId, approval: a2 });

    const a1 = effectApprovalFor(defRef, refs.enemyLowestHp, [4]);
    await approve(a1);

    // Before GM commits a1 (enemyLowestHp at 9 HP), enemyMidHp drops to 5 HP -> commit refuses owner_reapproval_required
    token(refs.enemyMidHp).state.currentHp = 5;
    await refused('actor_consequence', effectCommand(a1), 'owner_reapproval_required', gm);
    assert.equal(token(refs.enemyLowestHp).state.currentHp, 9);
    assert.equal(token(refs.enemyLowestHp).state.tempHealth, 10);
    if (payments.get(live(), a1.approvalId)) {
      await ack(owner, 'actor_spell_withdraw', { roomId: room.id, approvalId: a1.approvalId, approval: a1 });
    }

    // Approve current lowest HP enemyMidHp (5 HP), then move it out of 30 ft range (to 50 ft) -> commit refuses owner_reapproval_required
    const a3 = effectApprovalFor(defRef, refs.enemyMidHp, [4]);
    await approve(a3);
    token(refs.enemyMidHp).position = { x: 600, y: 100 };
    await refused('actor_consequence', effectCommand(a3), 'owner_reapproval_required', gm);
    assert.equal(token(refs.enemyMidHp).state.currentHp, 5);
  });

  it('normal hit triggers nothing; crit on THIS specific bolt triggers once; unrelated spell crit triggers nothing', async () => {
    const critBoltRef = await admitPc(wizardBoltRecord({ name: 'Hexing Bolt', formula: '1d8', condition: { kind: 'stunned' } }));
    const plainBoltRef = await admitPc(wizardBoltRecord({ name: 'Plain Arcane Bolt', formula: '1d8', includeControl: false, includeCritGate: false }));

    // 1. Normal hit (face 4 on 1d8): deals 4 damage, installs 0 conditions
    const normalApproval = effectApprovalFor(critBoltRef, refs.enemyLowestHp, [4]);
    await approve(normalApproval);
    const normalRes = await ack(gm, 'actor_consequence', effectCommand(normalApproval));
    assert.equal(normalRes.success, true, JSON.stringify(normalRes));
    assert.equal(token(refs.enemyLowestHp).state.tempHealth, 6);
    assert.equal(token(refs.enemyLowestHp).state.currentHp, 9);
    assert.equal(token(refs.enemyLowestHp).state.conditions.length, 0);
    const normalChosen = JSON.parse(normalRes.receipt.adjudication.chosenResult);
    assert.equal(normalChosen.critTriggered, false);
    assert.equal(normalChosen.conditionApplied, false);
    assert.equal(normalChosen.conditionInstanceId, null);

    // 1b. Attempting to attach conditions on a non-crit commit is rejected server-side
    const sneakApproval = effectApprovalFor(critBoltRef, refs.enemyLowestHp, [5]);
    await approve(sneakApproval);
    await refused('actor_consequence', effectCommand(sneakApproval, { forceConditions: true }), 'approval_mismatch', gm);
    await ack(owner, 'actor_spell_withdraw', { roomId: room.id, approvalId: sneakApproval.approvalId, approval: sneakApproval });

    // 2. Unrelated plain bolt rolling max face (8 on 1d8): deals 8 damage, installs 0 conditions
    const plainCritApproval = plainDamageApprovalFor(plainBoltRef, refs.enemyLowestHp, [8]);
    await approve(plainCritApproval);
    const plainRes = await ack(gm, 'actor_consequence', plainDamageCommand(plainCritApproval));
    assert.equal(plainRes.success, true, JSON.stringify(plainRes));
    assert.equal(token(refs.enemyLowestHp).state.tempHealth, 0);
    assert.equal(token(refs.enemyLowestHp).state.currentHp, 7);
    assert.equal(token(refs.enemyLowestHp).state.conditions.length, 0);

    // 3. Critical hit on THIS specific bolt (face 8 on 1d8): deals 8 damage + installs Stunned exactly once
    const critApproval = effectApprovalFor(critBoltRef, refs.enemyLowestHp, [8]);
    await approve(critApproval);
    const critCmd = effectCommand(critApproval);
    const critRes = await ack(gm, 'actor_consequence', critCmd);
    assert.equal(critRes.success, true, JSON.stringify(critRes));
    assert.equal(token(refs.enemyLowestHp).state.currentHp, 0);
    assert.equal(token(refs.enemyLowestHp).state.conditions.length, 1);
    assert.ok(profile.isStunned(token(refs.enemyLowestHp).state.conditions[0]));
    assert.equal(token(refs.enemyLowestHp).state.conditions[0].id, critApproval.approvalId);
    const critChosen = JSON.parse(critRes.receipt.adjudication.chosenResult);
    assert.equal(critChosen.critTriggered, true);
    assert.equal(critChosen.conditionApplied, true);
    assert.equal(critChosen.conditionInstanceId, critApproval.approvalId);

    // 4. Exact commandId replay is idempotent; fresh commandId reusing same approval is refused approval_consumed
    const replay = await ack(gm, 'actor_consequence', critCmd);
    assert.equal(replay.success, true);
    assert.deepEqual(replay.receipt, critRes.receipt);
    assert.equal(token(refs.enemyLowestHp).state.conditions.length, 1);

    const reuseCmd = { ...critCmd, commandId: uuid() };
    const reused = await ack(gm, 'actor_consequence', reuseCmd);
    assert.equal(reused.success, false);
    assert.equal(reused.code, 'approval_consumed');
    assert.equal(token(refs.enemyLowestHp).state.conditions.length, 1);
  });

  it('swapping follow-up in ordinary Wizard settings changes combat behavior without any code edit', async () => {
    const defId = uuid();
    // V1 starts with Stunned
    await admitPc(wizardBoltRecord({ definitionId: defId, name: 'Adaptive Bolt', condition: { kind: 'stunned' } }), 1);

    // Swap ONLY controlConfig.authoredCondition in the Wizard record to movement -15 ft (V2)
    const v2Ref = await admitPc(wizardBoltRecord({
      definitionId: defId,
      name: 'Adaptive Bolt',
      condition: { kind: 'movement', feet: -15, label: 'Crippling Chill' }
    }), 2);

    // Normal hit (face 3) -> no condition installed
    const normV2 = effectApprovalFor(v2Ref, refs.enemyLowestHp, [3]);
    await approve(normV2);
    const normV2Res = await ack(gm, 'actor_consequence', effectCommand(normV2));
    assert.equal(normV2Res.success, true, JSON.stringify(normV2Res));
    assert.equal(token(refs.enemyLowestHp).state.conditions.length, 0);

    // Crit hit (face 8) -> Movement -15 ft installed once (NOT Stunned)
    const critV2 = effectApprovalFor(v2Ref, refs.enemyLowestHp, [8]);
    await approve(critV2);
    const critV2Res = await ack(gm, 'actor_consequence', effectCommand(critV2));
    assert.equal(critV2Res.success, true, JSON.stringify(critV2Res));
    assert.equal(token(refs.enemyLowestHp).state.conditions.length, 1);
    const installedMove = token(refs.enemyLowestHp).state.conditions[0];
    assert.ok(profile.isMovementModifier(installedMove));
    assert.equal(profile.isStunned(installedMove), false);
    assert.equal(installedMove.name, 'Crippling Chill');

    // Swap ONLY controlConfig.authoredCondition to attribute agility -2 (V3)
    const v3Ref = await admitPc(wizardBoltRecord({
      definitionId: defId,
      name: 'Adaptive Bolt',
      condition: { kind: 'attribute', attribute: 'agility', amount: -2, label: 'Shattered Balance' }
    }), 3);
    const critV3 = effectApprovalFor(v3Ref, refs.enemyLowestHp, [8]);
    await approve(critV3);
    const critV3Res = await ack(gm, 'actor_consequence', effectCommand(critV3));
    assert.equal(critV3Res.success, true, JSON.stringify(critV3Res));
    assert.equal(token(refs.enemyLowestHp).state.conditions.length, 2);
    const installedAttr = token(refs.enemyLowestHp).state.conditions[1];
    assert.ok(profile.isAttributeModifier(installedAttr));
    assert.equal(installedAttr.name, 'Shattered Balance');
  });

  it('spell-name independence and undecided boundary refusals (summoning, canCrit, multi-die crit, nearest)', async () => {
    // 1. Two records differing ONLY in spell name ("Ordinary Pebble" vs "Summon Sheep") produce identical compiled mechanics
    const rA = wizardBoltRecord({ name: 'Ordinary Pebble' });
    const rB = wizardBoltRecord({ name: 'Summon Sheep', definitionId: rA.authoredDefinitionId });
    const dA = pure.definitionFromWizard(rA, { roomId: room.id, definitionVersion: 1, classId: 'arcanoneer' });
    const dB = pure.definitionFromWizard(rB, { roomId: room.id, definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(dA.ok, true, dA.reason);
    assert.equal(dB.ok, true, dB.reason);
    assert.deepEqual(dA.definition.targeting, dB.definition.targeting);
    assert.deepEqual(dA.definition.effects, dB.definition.effects);
    assert.deepEqual(dA.definition.timing, dB.definition.timing);

    // 2. Plain immediate bolt named "Summon Sheep" with NO critGate / controlConfig crits for damage only — 0 conditions
    const misnamedPlainRef = await admitPc(wizardBoltRecord({
      name: 'Summon Sheep',
      includeControl: false,
      includeCritGate: false
    }));
    const aPlain = plainDamageApprovalFor(misnamedPlainRef, refs.enemyLowestHp, [8]);
    await approve(aPlain);
    const rPlain = await ack(gm, 'actor_consequence', plainDamageCommand(aPlain));
    assert.equal(rPlain.success, true, JSON.stringify(rPlain));
    assert.equal(token(refs.enemyLowestHp).state.conditions.length, 0);

    // 3. Undecided boundaries stay refused whole
    const withSummon = wizardBoltRecord({
      includeControl: false,
      includeCritGate: false,
      extra: d => {
        d.effectTypes = ['damage', 'summoning'];
        d.summoningConfig = { creatureId: 'sheep', quantity: 1 };
      }
    });
    assert.equal(pure.definitionFromWizard(withSummon, { roomId: room.id, definitionVersion: 1, classId: 'arcanoneer' }).ok, false);

    const withCanCrit = wizardBoltRecord({
      extra: d => { d.damageConfig.canCrit = true; }
    });
    assert.equal(pure.definitionFromWizard(withCanCrit, { roomId: room.id, definitionVersion: 1, classId: 'arcanoneer' }).ok, false);

    const withMultiDie = wizardBoltRecord({ formula: '2d6' });
    const multiDieRes = pure.definitionFromWizard(withMultiDie, { roomId: room.id, definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(multiDieRes.ok, false);
    assert.match(multiDieRes.reason, /single-die/i);

    const withNearest = wizardBoltRecord({ selectionMethod: 'nearest' });
    assert.equal(pure.definitionFromWizard(withNearest, { roomId: room.id, definitionVersion: 1, classId: 'arcanoneer' }).ok, false);
  });
});
