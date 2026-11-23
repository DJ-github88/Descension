const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const installed = require('../services/installedAuthoredAbilities');
const definitions = require('../services/installedDefinitionRegistry');
const relationships = require('../services/actorRelationships');
const pure = require('../shared/services/authoredAbility');
const executionPlan = require('../shared/services/executionPlan');
const profile = require('../shared/services/sharedConditionProfile');

const once = (s, e) => new Promise(r => s.once(e, r));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ack = (s, e, d) => new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(Error(`ACK timeout for ${e}`)), 5000);
  s.emit(e, d, r => { clearTimeout(t); resolve(r); });
});

function buildTurnPassiveRecord({
  id = uuid(),
  name = 'Dawnstride Stance',
  description = 'At the start of my turn, gain +10 ft movement speed until removed.',
  triggerId = 'turn_start',
  triggerName = 'Turn Start',
  whoseTurn = 'self',
  targetingType = 'single',
  effect = 'movement',
  movementFeet = 10,
  drAmount = 3,
  label = 'Dawnstride',
  extra
} = {}) {
  const authoredCondition = {
    profile: pure.EFFECT_CAPABILITY,
    effect,
    expiryPolicy: 'gm-manual',
    durationText: 'Until the GM clears it',
    gmNote: 'Triggered automatically at authenticated combat turn boundary.'
  };
  if (effect === 'movement') {
    authoredCondition.movementFeet = movementFeet;
    authoredCondition.label = label;
  } else if (effect === 'damageReduction') {
    authoredCondition.drAmount = drAmount;
    authoredCondition.label = label;
  }

  const draft = {
    name,
    description,
    level: 1,
    spellType: 'PASSIVE',
    typeConfig: { school: 'sacred', tags: ['passive', 'turn'], toggleable: false },
    effectTypes: ['control'],
    effectsMap: { control: true },
    controlConfig: { authoredCondition },
    targetingConfig: {
      targetingType,
      rangeType: 'self',
      rangeDistance: 0,
      targetRestrictions: ['self'],
      maxTargets: 1,
      selectionMethod: 'manual',
      targetSelectionMethod: 'manual',
      aoeShape: '',
      aoeType: '',
      aoeParameters: {},
      movementBehavior: 'static'
    },
    resourceCost: {
      actionPoints: 0,
      actionPointsSelected: false,
      mana: 0,
      resourceTypes: [],
      resourceValues: { actionPoints: 0, mana: 0 }
    },
    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
    triggerConfig: {
      global: {
        logicType: 'AND',
        compoundTriggers: [{
          id: triggerId,
          category: 'time',
          name: triggerName,
          parameters: { whose_turn: whoseTurn }
        }]
      },
      effectTriggers: {},
      conditionalEffects: {},
      buffDebuffTriggers: {},
      requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
      triggerRole: { mode: 'CONDITIONAL' }
    }
  };
  if (extra) extra(draft);
  return {
    ...actors.clone(draft),
    authoredDraft: actors.clone(draft),
    authoredDefinitionId: id,
    serializedData: JSON.stringify(draft)
  };
}

describe('Authored passive turn-boundary abilities (authored-passive-turn:v1) — production stack', function() {
  this.timeout(20000);

  let server, room, gm, owner, observer, writer, ownerUid;
  let pc, enemyA, allyA, neutralA;

  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer });
    await server.start();
    for (const e of [
      'actor_bind', 'actor_snapshot', 'actor_consequence', 'actor_authored_admit',
      'actor_passive_list', 'actor_passive_activate', 'actor_passive_revoke',
      'actor_relationship_set', 'combat_started', 'actor_turn_boundary',
      'reaction_window_list', 'combat_turn_changed'
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

    owner = server.connect({ token: 'owner' });
    await once(owner, 'connect');
    const j1 = once(owner, 'room_joined');
    owner.emit('join_room', { roomId: room.id, playerName: 'owner', password: '' });
    await j1;

    observer = server.connect({ token: 'observer' });
    await once(observer, 'connect');
    const j2 = once(observer, 'room_joined');
    observer.emit('join_room', { roomId: room.id, playerName: 'observer', password: '' });
    await j2;

    server.setCharacterOwner('c-pc', ownerUid);
    const map = () => room.gameState.maps.default;
    map().gridType = 'square';
    map().gridSize = 50;
    map().feetPerTile = 5;

    map().characterTokens.pc = {
      id: 'pc',
      mapId: 'default',
      ownerUserId: ownerUid,
      position: { x: 225, y: 325 },
      character: {
        id: 'c-pc',
        name: 'Seraphina',
        class: 'Crusader',
        health: { current: 30, max: 30 },
        mana: { current: 10, max: 10 },
        actionPoints: { current: 4, max: 4 }
      },
      state: { conditions: [] }
    };
    pc = (await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'c-pc' },
      snapshotHash: actors.hash(map().characterTokens.pc)
    })).ref;

    const bound = {};
    for (const [id, x] of [['enemyA', 325], ['allyA', 275], ['neutralA', 425]]) {
      const t = {
        id,
        name: id,
        mapId: 'default',
        creatureId: 'test-creature',
        position: { x, y: 325 },
        stats: { maxHp: 30, maxMana: 0, maxAP: 4, speed: 30 },
        state: { currentHp: 25, currentMana: 0, currentActionPoints: 4, conditions: [] }
      };
      map().tokens[id] = t;
      const res = await ack(gm, 'actor_bind', {
        roomId: room.id,
        ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: id },
        snapshotHash: actors.hash(t)
      });
      assert.equal(res.success, true, JSON.stringify(res));
      bound[id] = res.ref;
    }
    enemyA = bound.enemyA;
    allyA = bound.allyA;
    neutralA = bound.neutralA;

    const relEnemy = await ack(gm, 'actor_relationship_set', {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence,
      expectedRelationshipRevision: relationships.revision(live()),
      pairs: [{ a: pc, b: enemyA }],
      value: 'enemy'
    });
    assert.equal(relEnemy.success, true, JSON.stringify(relEnemy));

    const relAlly = await ack(gm, 'actor_relationship_set', {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence,
      expectedRelationshipRevision: relationships.revision(live()),
      pairs: [{ a: pc, b: allyA }],
      value: 'ally'
    });
    assert.equal(relAlly.success, true, JSON.stringify(relAlly));
  });

  afterEach(async() => {
    gm.disconnect();
    owner.disconnect();
    observer.disconnect();
    await server.stop();
  });

  const live = () => server.rooms.get(room.id);
  const locate = ref => actors.locate(live(), ref).token;
  const baseCmd = () => ({
    version: 1,
    roomId: room.id,
    commandId: uuid(),
    actionEpoch: actors.epoch(live()),
    baseCommitSequence: actors.ledger(live()).commitSequence
  });

  async function admitPassive(record, definitionVersion = 1) {
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

  async function activateAuthored(definitionRef, socket = gm) {
    const rev = live().gameState.passiveLedger?.revision || 0;
    return ack(socket, 'actor_passive_activate', {
      version: 1,
      roomId: room.id,
      requestId: uuid(),
      expectedRevision: rev,
      target: pc,
      definitionRef
    });
  }

  async function startAndAdoptCombat(turnOrderRefs, currentTurnIndex = 0) {
    const started = await ack(gm, 'combat_started', {
      roomId: room.id,
      turnOrder: turnOrderRefs.map(ref => ({ tokenId: ref.tokenId, actorRef: ref })),
      currentTurnIndex,
      round: 1
    });
    assert.equal(started.success, true, JSON.stringify(started));

    const adopted = await ack(gm, 'actor_turn_boundary', {
      ...baseCmd(),
      mode: 'adopt',
      combatHash: actors.hash(live().gameState.combat),
      expectedClock: null
    });
    assert.equal(adopted.success, true, JSON.stringify(adopted));
    return adopted;
  }

  async function advanceTurn() {
    const combat = live().gameState.combat;
    const res = await ack(gm, 'actor_turn_boundary', {
      ...baseCmd(),
      mode: 'advance',
      combatHash: actors.hash(combat),
      expectedClock: { id: combat.effectLifecycle.id, sequence: combat.effectLifecycle.sequence }
    });
    assert.equal(res.success, true, JSON.stringify(res));
    return res;
  }

  it('compiles Dawnstride Stance and Oathkeeper\'s Bulwark while refusing invalid turn-boundary shapes', () => {
    const dawnstride = buildTurnPassiveRecord();
    const out1 = pure.definitionFromWizard(dawnstride, { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(out1.ok, true, out1.reason);
    assert.equal(out1.definition.schemaVersion, 11);
    assert.equal(out1.definition.capability, pure.PASSIVE_TURN_CAPABILITY);
    assert.deepEqual(out1.definition.targeting, { kind: 'self', restriction: 'self' });
    assert.deepEqual(out1.definition.trigger, { kind: 'turn_start', whoseTurn: 'self', contract: 'passive-turn-boundary:v1' });
    const compiled1 = definitions.compileDefinition(out1.definition);
    assert.equal(compiled1.ok, true, JSON.stringify(compiled1));
    assert.equal(compiled1.descriptor.compilerVersion, pure.PASSIVE_TURN_COMPILER);
    const plan1 = executionPlan.explain(dawnstride, out1);
    assert.equal(plan1.wholeExecutable, true);
    assert.equal(plan1.triggers[0].executable, true);
    assert.match(plan1.flow.join(' '), /no 8-second reaction declaration window/i);

    const oathkeeper = buildTurnPassiveRecord({
      name: 'Oathkeeper\'s Bulwark',
      description: 'When an enemy finishes a turn, gain +3 flat Damage Reduction.',
      triggerId: 'turn_end',
      triggerName: 'Turn End',
      whoseTurn: 'enemy',
      targetingType: 'self',
      effect: 'damageReduction',
      drAmount: 3,
      label: 'Oathkeeper Guard'
    });
    const out2 = pure.definitionFromWizard(oathkeeper, { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(out2.ok, true, out2.reason);
    assert.deepEqual(out2.definition.trigger, { kind: 'turn_end', whoseTurn: 'enemy', contract: 'passive-turn-boundary:v1' });
    const compiled2 = definitions.compileDefinition(out2.definition);
    assert.equal(compiled2.ok, true, JSON.stringify(compiled2));

    const badCases = [
      ['empty whose_turn', d => { d.triggerConfig.global.compoundTriggers[0].parameters.whose_turn = ''; }],
      ['compound triggers', d => { d.triggerConfig.global.compoundTriggers.push({ id: 'turn_end', category: 'time', name: 'Turn End', parameters: { whose_turn: 'enemy' } }); }],
      ['requiredConditions enabled', d => { d.triggerConfig.requiredConditions = { enabled: true, logicType: 'AND', conditions: [] }; }],
      ['non-self targeting restriction', d => { d.targetingConfig.targetRestrictions = ['enemy']; }],
      ['non-gm-manual expiry', d => { d.controlConfig.authoredCondition.expiryPolicy = 'target-next-end'; }],
      ['non-zero mana cost', d => { d.resourceCost.mana = 2; d.resourceCost.resourceValues.mana = 2; }],
      ['wrong trigger category', d => { d.triggerConfig.global.compoundTriggers[0].category = 'combat'; }]
    ];
    for (const [label, mutate] of badCases) {
      const bad = buildTurnPassiveRecord({ extra: mutate });
      const res = pure.definitionFromWizard(bad, { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' });
      assert.equal(res.ok, false, `Expected refusal for ${label}`);
    }
    const creatureOut = pure.definitionFromWizard(dawnstride, { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer', creatureSource: { id: 'c1' } });
    assert.equal(creatureOut.ok, false);
  });

  it('Dawnstride Stance (turn_start, self): ignores adopt and non-self turns, fires on owner turn_start with no 8s window, prevents stacking, and re-arms after GM removal until revoked', async() => {
    const rec = buildTurnPassiveRecord();
    const defRef = await admitPassive(rec, 1);

    await startAndAdoptCombat([enemyA, allyA, pc], 0); // current = enemyA

    // Unactivated passive does not fire even when advancing onto owner PC's turn
    await advanceTurn(); // enemyA -> allyA
    await advanceTurn(); // allyA -> pc
    assert.equal(locate(pc).state.conditions.length, 0);

    // Non-GM cannot activate
    const denied = await activateAuthored(defRef, owner);
    assert.equal(denied.success, false);
    assert.equal(denied.code, 'forbidden');

    // GM activates Dawnstride Stance
    const accepted = [];
    owner.on('actor_consequence_accepted', p => {
      if (String(p?.receipt?.adjudication?.definitionVersionOrHash || '').startsWith(`${pure.PASSIVE_TURN_CAPABILITY}/`)) {
        accepted.push(p);
      }
    });
    const actRes = await activateAuthored(defRef, gm);
    assert.equal(actRes.success, true, JSON.stringify(actRes));

    // Legacy combat_turn_changed does not fire turn-boundary passives
    gm.emit('combat_turn_changed', { roomId: room.id, currentTurnIndex: 0 });
    await sleep(40);
    assert.equal(locate(pc).state.conditions.length, 0);
    assert.equal(accepted.length, 0);

    // Non-firing advances: pc -> enemyA (enemy turn_start), enemyA -> allyA (ally turn_start)
    await advanceTurn(); // pc -> enemyA
    assert.equal(locate(pc).state.conditions.length, 0);
    assert.equal(accepted.length, 0);

    await advanceTurn(); // enemyA -> allyA
    assert.equal(locate(pc).state.conditions.length, 0);
    assert.equal(accepted.length, 0);

    // FIRING EVENT: allyA -> pc (incoming actor is pc matching whose_turn === 'self')
    await advanceTurn(); // allyA -> pc
    await sleep(30);
    const pcConds = locate(pc).state.conditions;
    assert.equal(pcConds.length, 1);
    assert.equal(pcConds[0].name, 'Dawnstride');
    assert.equal(pcConds[0].effects.movementSpeed, 10);
    assert.equal(accepted.length, 1);
    assert.equal(JSON.parse(accepted[0].receipt.adjudication.chosenResult).trigger, 'turn_start');

    // Verify NO 8-second reaction declaration window was opened
    const windows = await ack(gm, 'reaction_window_list', { roomId: room.id });
    assert.equal(windows.windows.length, 0);

    // Full round back to pc while Dawnstride is still active: must NOT stack duplicate condition
    await advanceTurn(); // pc -> enemyA
    await advanceTurn(); // enemyA -> allyA
    await advanceTurn(); // allyA -> pc
    assert.equal(locate(pc).state.conditions.length, 1);
    assert.equal(accepted.length, 1);

    // GM removes Dawnstride manually; passive stays inactive on pc->enemyA->allyA, then re-arms on next allyA->pc
    const condId = locate(pc).state.conditions[0].recordId;
    const removed = await ack(gm, 'actor_consequence', {
      ...baseCmd(),
      actors: [{
        ref: pc,
        expectedRevision: actors.locate(live(), pc).contract.revision,
        conditions: [{ op: 'remove', recordId: condId }]
      }]
    });
    assert.equal(removed.success, true, JSON.stringify(removed));
    assert.equal(locate(pc).state.conditions.length, 0);

    await advanceTurn(); // pc -> enemyA
    await advanceTurn(); // enemyA -> allyA
    await advanceTurn(); // allyA -> pc -> re-arms!
    assert.equal(locate(pc).state.conditions.length, 1);
    assert.equal(locate(pc).state.conditions[0].name, 'Dawnstride');

    // Revoking passive prevents future firing after GM removal
    const revokeRes = await ack(gm, 'actor_passive_revoke', {
      version: 1,
      roomId: room.id,
      requestId: uuid(),
      expectedRevision: live().gameState.passiveLedger.revision,
      activationId: actRes.activation.activationId
    });
    assert.equal(revokeRes.success, true, JSON.stringify(revokeRes));
    await ack(gm, 'actor_consequence', {
      ...baseCmd(),
      actors: [{
        ref: pc,
        expectedRevision: actors.locate(live(), pc).contract.revision,
        conditions: [{ op: 'remove', recordId: locate(pc).state.conditions[0].recordId }]
      }]
    });
    await advanceTurn(); // pc -> enemyA
    await advanceTurn(); // enemyA -> allyA
    await advanceTurn(); // allyA -> pc
    assert.equal(locate(pc).state.conditions.length, 0);
  });

  it('Oathkeeper\'s Bulwark (turn_end, enemy): fires only when enemy turn ends, refuses direct command forgery, and coexists cleanly with Dawnstride Stance on same advance', async() => {
    const dawnRef = await admitPassive(buildTurnPassiveRecord({ id: uuid() }), 1);
    const oathRef = await admitPassive(buildTurnPassiveRecord({
      id: uuid(),
      name: 'Oathkeeper\'s Bulwark',
      description: 'When an enemy finishes a turn, gain +3 flat Damage Reduction.',
      triggerId: 'turn_end',
      triggerName: 'Turn End',
      whoseTurn: 'enemy',
      targetingType: 'self',
      effect: 'damageReduction',
      drAmount: 3,
      label: 'Oathkeeper Guard'
    }), 1);

    const actOath = await activateAuthored(oathRef, gm);
    assert.equal(actOath.success, true, JSON.stringify(actOath));

    await startAndAdoptCombat([pc, allyA, neutralA, enemyA], 0); // current = pc; adopt does NOT fire
    assert.equal(locate(pc).state.conditions.length, 0);

    // Non-firing turn ends: pc ends -> allyA; allyA ends -> neutralA; neutralA ends -> enemyA
    await advanceTurn(); // outgoing pc (self) -> does not fire
    assert.equal(locate(pc).state.conditions.length, 0);
    await advanceTurn(); // outgoing allyA (ally) -> does not fire
    assert.equal(locate(pc).state.conditions.length, 0);
    await advanceTurn(); // outgoing neutralA (neutral) -> does not fire
    assert.equal(locate(pc).state.conditions.length, 0);

    // Direct client/GM command forgery for authored-passive-turn:v1 is refused outside PASSIVE_TRIGGER_STAGE
    const forgedRecordId = uuid();
    const forged = await ack(gm, 'actor_consequence', {
      ...baseCmd(),
      source: pc,
      target: pc,
      actors: [{
        ref: pc,
        expectedRevision: actors.locate(live(), pc).contract.revision,
        conditions: [{
          op: 'add',
          recordId: forgedRecordId,
          record: profile.makeDamageReductionRecord(pc, forgedRecordId, {
            sourceActor: pc,
            sourceOccurrence: profile.EFFECT_PREFIX + forgedRecordId,
            timing: 'manual',
            authoredDuration: 'Until GM removes',
            amount: 3,
            label: 'Oathkeeper Guard',
            effectDefinition: pure.actionId(oathRef)
          })
        }]
      }],
      adjudication: {
        definitionId: pure.actionId(oathRef),
        definitionVersionOrHash: `${pure.PASSIVE_TURN_CAPABILITY}/${oathRef.definitionHash}`,
        chosenResult: JSON.stringify({ forged: true }),
        adjustmentReason: 'Forged'
      }
    });
    assert.equal(forged.success, false);
    assert.equal(forged.code, 'passive_trigger_route_required');

    // Activate Dawnstride Stance too while current actor is enemyA
    const actDawn = await activateAuthored(dawnRef, gm);
    assert.equal(actDawn.success, true, JSON.stringify(actDawn));

    // FIRING EVENT: advance from enemyA (outgoing enemy -> triggers Oathkeeper's Bulwark turn_end)
    // onto pc (incoming self -> triggers Dawnstride Stance turn_start)
    await advanceTurn();
    const conds = locate(pc).state.conditions;
    assert.equal(conds.length, 2, JSON.stringify(conds));
    const names = conds.map(c => c.name).sort();
    assert.deepEqual(names, ['Dawnstride', 'Oathkeeper Guard']);
    const oathCond = conds.find(c => c.name === 'Oathkeeper Guard');
    assert.equal(oathCond.effects.damageReduction, 3);
    assert.equal(oathCond.clockBoundary, 'manual');
    assert.equal(oathCond.durationType, 'manual');

    // No 8-second reaction declaration windows opened for automatic passive effects
    const windows = await ack(gm, 'reaction_window_list', { roomId: room.id });
    assert.equal(windows.windows.length, 0);
  });
});
