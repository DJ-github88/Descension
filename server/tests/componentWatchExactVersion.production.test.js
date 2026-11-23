/**
 * Production-stack verification of exact-version component-watch triggers:
 * - Admitting v1 and edited v2 of the same authoredDefinitionId keeps both distinct.
 * - Registering a component watch against v1's Direct Damage part ('effects:direct' or 'effect')
 *   produces exactly one follow-up offer on a qualifying v1 hit, and zero offers on v2 until
 *   v2 is explicitly registered.
 * - Preserves ordinary payment rules (insufficient resources refused, temp-first full AP/mana
 *   deduction, no chaining) and authenticated source-next-turn expiry rules.
 */
const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const installed = require('../services/installedAuthoredAbilities');
const payments = require('../services/spellPayments');
const relationships = require('../services/actorRelationships');
const pure = require('../shared/services/authoredAbility');
const effect = require('../shared/services/authoredEffect');

const once = (socket, event) => new Promise(resolve => socket.once(event, resolve));
const ack = (socket, event, data) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(Error(`ACK timeout: ${event}`)), 5000);
  socket.emit(event, data, result => { clearTimeout(timer); resolve(result); });
});
const clone = value => JSON.parse(JSON.stringify(value));

const DAMAGE_ON = { occurrence: 'immediate-damage', role: 'source', evidence: 'baseHpLost' };

function bundleWatchRecord({
  id,
  name = 'Rime Tether',
  formula = '1d6+2',
  movementFeet = -10,
  label = 'Frostbind',
  expiryPolicy = 'target-next-end'
}) {
  const draft = {
    name,
    description: 'Deals frost damage and slows the target.',
    level: 1,
    spellType: 'ACTION',
    resolution: 'DICE',
    effectTypes: ['damage', 'control'],
    effectsMap: { damage: true, control: true },
    typeConfig: { school: 'rime', icon: 'Frost/Dripping Ice', castTimeType: 'IMMEDIATE', tags: ['attack'] },
    damageConfig: { damageType: 'direct', formula, elementType: 'rime', damageTypes: ['rime'], resolution: 'DICE' },
    controlConfig: {
      authoredCondition: {
        profile: 'authored-effect:v1',
        effect: 'movement',
        label,
        movementFeet,
        expiryPolicy,
        durationText: 'Until the end of the target\'s next turn',
        gmNote: 'GM confirms direct damage and movement rider.'
      }
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 30,
      targetRestrictions: ['enemy'],
      maxTargets: 1,
      selectionMethod: 'manual'
    },
    resourceCost: { actionPoints: 1, mana: 2, components: [] },
    durationConfig: { durationType: 'instant' },
    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
    triggerConfig: {
      global: { logicType: 'AND', compoundTriggers: [] },
      effectTriggers: {
        damage_direct: {
          logicType: 'AND',
          targetingOverride: null,
          compoundTriggers: [{ id: pure.FOLLOWUP_TRIGGER_ID, category: 'combat', name: 'Follow-up After My Damage', parameters: {} }]
        }
      },
      conditionalEffects: {},
      buffDebuffTriggers: {},
      requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
      triggerRole: { mode: 'CONDITIONAL' }
    }
  };
  return Object.assign(clone(draft), {
    id: `lib-${name}`,
    authoredDefinitionId: id,
    authoredDraft: clone(draft),
    serializedData: JSON.stringify(draft)
  });
}

function onePartWatchRecord({ id, name = 'Ember Needle', formula = '1d6+2' }) {
  const draft = {
    name,
    description: 'Single-part direct damage watch.',
    level: 1,
    spellType: 'ACTION',
    resolution: 'DICE',
    effectTypes: ['damage'],
    effectsMap: { damage: true },
    typeConfig: { school: 'ember', icon: 'Fire/Flame', castTimeType: 'IMMEDIATE', tags: ['attack'] },
    damageConfig: { damageType: 'direct', formula, elementType: 'ember', damageTypes: ['ember'], resolution: 'DICE' },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 30,
      targetRestrictions: ['enemy'],
      maxTargets: 1,
      selectionMethod: 'manual'
    },
    resourceCost: { actionPoints: 1, mana: 2, components: [] },
    durationConfig: { durationType: 'instant' },
    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
    triggerConfig: {
      global: { logicType: 'AND', compoundTriggers: [] },
      effectTriggers: {
        damage_direct: {
          logicType: 'AND',
          targetingOverride: null,
          compoundTriggers: [{ id: pure.FOLLOWUP_TRIGGER_ID, category: 'combat', name: 'Follow-up After My Damage', parameters: {} }]
        }
      },
      conditionalEffects: {},
      buffDebuffTriggers: {},
      requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
      triggerRole: { mode: 'CONDITIONAL' }
    }
  };
  return Object.assign(clone(draft), {
    id: `lib-${name}`,
    authoredDefinitionId: id,
    authoredDraft: clone(draft),
    serializedData: JSON.stringify(draft)
  });
}

function followUpRecord({ id = uuid(), name = 'Echo Fang', formula = '1d6+1', ap = 1, mana = 3 } = {}) {
  const draft = {
    name,
    description: 'Approved follow-up damage spell.',
    level: 1,
    spellType: 'ACTION',
    resolution: 'DICE',
    effectTypes: ['damage'],
    effectsMap: { damage: true },
    typeConfig: { school: 'arcane', icon: 'Arcane/Bolt', castTimeType: 'IMMEDIATE', tags: ['attack'] },
    damageConfig: { damageType: 'direct', formula, elementType: 'arcane', damageTypes: ['arcane'], resolution: 'DICE' },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 30,
      targetRestrictions: ['enemy'],
      maxTargets: 1,
      selectionMethod: 'manual'
    },
    resourceCost: { actionPoints: ap, mana, components: [] },
    durationConfig: { durationType: 'instant' },
    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
    triggerConfig: {
      global: {
        logicType: 'AND',
        compoundTriggers: [{ id: pure.FOLLOWUP_TRIGGER_ID, category: 'combat', name: 'Follow-up After My Damage', parameters: {} }]
      },
      effectTriggers: {},
      conditionalEffects: {},
      buffDebuffTriggers: {},
      requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
      triggerRole: { mode: 'CONDITIONAL' }
    }
  };
  return Object.assign(clone(draft), {
    id: `lib-${name}`,
    authoredDefinitionId: id,
    authoredDraft: clone(draft),
    serializedData: JSON.stringify(draft)
  });
}

describe('Exact-version component watch — production stack', function() {
  this.timeout(30000);
  let server, room, gm, owner, observer, writer, pc, foe, foe2, ownerUid;

  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer });
    await server.start();
    for (const e of [
      'actor_bind', 'actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_revoke',
      'actor_spell_approve', 'actor_spell_withdraw', 'actor_relationship_set',
      'actor_trigger_list', 'actor_trigger_register', 'actor_trigger_revoke', 'actor_trigger_dismiss',
      'combat_started', 'actor_turn_boundary'
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
      const joined = once(s, 'room_joined');
      s.emit('join_room', { roomId: room.id, playerName: role, password: '' });
      await joined;
      if (role === 'owner') {owner = s;} else {observer = s;}
    }

    server.setCharacterOwner('c', ownerUid);
    const map = () => room.gameState.maps.default;
    map().characterTokens.pc = {
      id: 'pc',
      ownerUserId: ownerUid,
      character: {
        id: 'c',
        class: 'Arcanoneer',
        health: { current: 30, max: 30 },
        mana: { current: 40, max: 40 },
        actionPoints: { current: 15, max: 15 },
        tempHealth: 0,
        tempMana: 1,
        tempActionPoints: 1
      },
      state: { conditions: [] }
    };
    const pr = await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'c' },
      snapshotHash: actors.hash(map().characterTokens.pc)
    });
    assert.equal(pr.success, true, JSON.stringify(pr));
    pc = pr.ref;

    for (const id of ['foe', 'foe2']) {
      const tok = {
        id,
        name: id === 'foe' ? 'Foe One' : 'Foe Two',
        stats: { maxHp: 120, maxMana: 20, maxAP: 10, speed: 30 },
        state: { currentHp: 100, currentMana: 20, currentActionPoints: 10, tempHealth: 0, tempMana: 0, tempActionPoints: 0, conditions: [] }
      };
      map().tokens[id] = tok;
      const tr = await ack(gm, 'actor_bind', {
        roomId: room.id,
        ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: id },
        snapshotHash: actors.hash(tok)
      });
      assert.equal(tr.success, true, JSON.stringify(tr));
      if (id === 'foe') {foe = tr.ref;} else {foe2 = tr.ref;}
    }

    const rel = await ack(gm, 'actor_relationship_set', {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence,
      pairs: [{ a: pc, b: foe }, { a: pc, b: foe2 }],
      value: 'enemy',
      expectedRelationshipRevision: relationships.revision(live())
    });
    assert.equal(rel.success, true, JSON.stringify(rel));
  });

  afterEach(async() => {
    gm.disconnect();
    owner.disconnect();
    observer.disconnect();
    await server.stop();
  });

  const live = () => server.rooms.get(room.id);
  const token = ref => actors.locate(live(), ref).token;
  const ledger = () => live().gameState.triggerLedger;
  const openOffers = () => Object.values(ledger()?.obligations || {});
  const entryFor = ref => installed.list(live()).entries.find(e => pure.actionId(e.definitionRef) === pure.actionId(ref));
  const base = () => ({ version: 1, roomId: room.id, commandId: uuid(), actionEpoch: actors.epoch(live()), baseCommitSequence: actors.ledger(live()).commitSequence });

  async function admit(record, definitionVersion) {
    const res = await ack(gm, 'actor_authored_admit', {
      roomId: room.id,
      requestId: uuid(),
      expectedRegistryRevision: installed.registry(live()).revision,
      record,
      definitionVersion,
      classId: 'arcanoneer'
    });
    assert.equal(res.success, true, JSON.stringify(res));
    return res.definitionRef;
  }

  async function startCombatAndAdoptClock() {
    const started = await ack(gm, 'combat_started', {
      roomId: room.id,
      turnOrder: [pc, foe, foe2].map(ref => ({ tokenId: ref.tokenId, actorRef: ref })),
      currentTurnIndex: 0,
      round: 1
    });
    assert.equal(started.success, true, JSON.stringify(started));
    const adopted = await ack(gm, 'actor_turn_boundary', {
      ...base(),
      mode: 'adopt',
      combatHash: actors.hash(live().gameState.combat),
      expectedClock: null
    });
    assert.equal(adopted.success, true, JSON.stringify(adopted));
  }

  async function advanceTurn() {
    const combat = live().gameState.combat;
    const res = await ack(gm, 'actor_turn_boundary', {
      ...base(),
      mode: 'advance',
      combatHash: actors.hash(combat),
      expectedClock: { id: combat.effectLifecycle.id, sequence: combat.effectLifecycle.sequence }
    });
    assert.equal(res.success, true, JSON.stringify(res));
    return res;
  }

  function buildApproval(defRef, { target = foe, faces = [4], triggerOfferId } = {}) {
    const entry = entryFor(defRef);
    const d = entry.canonicalDefinition;
    const cap = entry.descriptor.capabilityId || pure.CAPABILITY;
    const isBundle = cap === pure.EFFECT_CAPABILITY;
    const direct = isBundle ? d.effects.direct : d.effect;
    const reading = pure.readFormula(direct.formula);
    const total = faces.reduce((sum, face) => sum + face, reading.constant);
    return {
      version: 1,
      roomId: room.id,
      approvalId: uuid(),
      actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence,
      source: pc,
      target,
      spell: {
        definitionId: pure.actionId(entry.definitionRef),
        definitionHash: `${cap}/${entry.definitionRef.definitionHash}`,
        name: d.name,
        kind: isBundle ? 'effect' : direct.kind,
        damageTypes: direct.damageTypes || []
      },
      roll: {
        mode: 'physical',
        dice: [{ sides: reading.dice[0].sides, faces }],
        constant: reading.constant,
        reading: reading.reading,
        total
      },
      price: entry.descriptor.price,
      classPayment: null,
      ...(isBundle ? { effectTerms: effect.termsFor(d) } : {}),
      ...(triggerOfferId !== undefined ? { triggerOfferId } : {})
    };
  }

  function buildCommand(approval, { finalAmount = approval.roll.total, reason = '' } = {}) {
    const sourcePools = actors.resources(token(approval.source), 'character');
    const targetHp = actors.resources(token(approval.target), approval.target.kind).hp;
    const pay = {};
    for (const pool of ['ap', 'mana']) {
      if (approval.price[pool] > 0) {
        pay[pool] = payments.tempFirst(sourcePools[pool].current, sourcePools[pool].temp, approval.price[pool]);
      }
    }
    if (!Object.keys(pay).length) {
      pay.ap = payments.tempFirst(sourcePools.ap.current, sourcePools.ap.temp, 0);
    }
    const fromTemp = Math.min(targetHp.temp, finalAmount);
    const finalHp = {
      current: Math.max(0, targetHp.current - (finalAmount - fromTemp)),
      temp: targetHp.temp - fromTemp
    };
    const targetEntry = {
      ref: approval.target,
      expectedRevision: token(approval.target).state.actorContract.revision,
      finalResources: { hp: finalHp }
    };
    let chosen;
    if (approval.effectTerms) {
      const plan = effect.conditionPlan(approval, token(approval.target).state.conditions || []);
      assert.ok(!plan.refused, JSON.stringify(plan.refused));
      if (plan.ops) {targetEntry.conditions = plan.ops;}
      chosen = effect.resultFor(
        approval,
        { gmConfirmed: true, timing: approval.effectTerms.timing, timingNote: 'GM confirms direct damage and rider', evidence: '' },
        plan.combination
      );
    } else {
      chosen = {
        capability: approval.spell.definitionHash.split('/')[0],
        approvalId: approval.approvalId,
        kind: approval.spell.kind,
        roll: approval.roll,
        gmConfirmed: true
      };
    }
    return {
      ...base(),
      source: approval.source,
      target: approval.target,
      approval: { approvalId: approval.approvalId, contentHash: actors.hash(approval) },
      actors: [
        { ref: approval.source, expectedRevision: token(approval.source).state.actorContract.revision, finalResources: pay },
        targetEntry
      ],
      adjudication: {
        definitionId: approval.spell.definitionId,
        definitionVersionOrHash: approval.spell.definitionHash,
        finalAmount,
        adjustmentReason: reason,
        chosenResult: JSON.stringify(chosen)
      }
    };
  }

  async function castSpell(defRef, opts = {}) {
    const approval = buildApproval(defRef, opts);
    const approveRes = await ack(owner, 'actor_spell_approve', approval);
    assert.equal(approveRes.code, 'awaiting_gm', JSON.stringify(approveRes));
    const cmd = buildCommand(approval, opts);
    const res = await ack(gm, 'actor_consequence', cmd);
    assert.equal(res.success, true, JSON.stringify(res));
    return { approval, cmd, res };
  }

  it('1. Multi-part Direct Damage (effects:direct): v1 watch creates 1 offer on qualifying v1 hit, 0 on v2, preserves payment and expiry rules, and v2 works only after explicit registration', async() => {
    const watchDefId = uuid();
    const v1Rec = bundleWatchRecord({ id: watchDefId, name: 'Rime Tether', formula: '1d6+2', movementFeet: -10, label: 'Frostbind' });
    const v2Rec = bundleWatchRecord({ id: watchDefId, name: 'Rime Tether (Glacial Grip)', formula: '2d6+2', movementFeet: -15, label: 'Glacial Grip' });
    const bRec = followUpRecord({ name: 'Echo Fang', formula: '1d6+1', ap: 1, mana: 3 });

    const v1Ref = await admit(v1Rec, 1);
    const v2Ref = await admit(v2Rec, 2);
    const bRef = await admit(bRec, 1);
    assert.equal(v1Ref.definitionVersion, 1);
    assert.equal(v2Ref.definitionVersion, 2);
    assert.equal(v1Ref.definitionId, v2Ref.definitionId);

    const regV1 = await ack(gm, 'actor_trigger_register', {
      roomId: room.id,
      requestId: uuid(),
      expectedRevision: ledger()?.revision || 0,
      source: pc,
      definitionRef: bRef,
      on: DAMAGE_ON,
      mode: 'component-follow-up',
      watch: { definitionRef: v1Ref, componentId: 'effects:direct' }
    });
    assert.equal(regV1.success, true, JSON.stringify(regV1));
    assert.equal(regV1.mode, 'component-follow-up');

    await startCombatAndAdoptClock();

    // Non-qualifying v1 hit: fully absorbed by temp HP -> 0 offers
    token(foe2).state.tempHealth = 10;
    await castSpell(v1Ref, { target: foe2, faces: [4] }); // 1d6+2 = 6 absorbed by 10 temp HP
    assert.equal(openOffers().length, 0, 'temp-only absorption creates no offer');

    // Non-qualifying v1 hit: GM-adjudicated 0 damage -> 0 offers
    await castSpell(v1Ref, { target: foe2, faces: [4], finalAmount: 0, reason: 'Deflected' });
    assert.equal(openOffers().length, 0, '0 final damage creates no offer');

    // Qualifying v2 hit BEFORE v2 is registered -> 0 offers
    const v2BeforeCast = await castSpell(v2Ref, { target: foe, faces: [3, 4] }); // 2d6+2 = 9 base HP lost
    assert.equal(openOffers().length, 0, 'unwatched v2 creates no offer even on qualifying base HP loss');
    assert.equal(token(foe).state.currentHp, 91);
    assert.ok(v2BeforeCast.res.receipt);

    // Qualifying v1 hit on foe2 -> 4 temp absorbed, 3 base HP lost -> creates exactly 1 offer
    const v1Hit = await castSpell(v1Ref, { target: foe2, faces: [5] }); // 1d6+2 = 7 (4 temp, 3 base -> 97 HP)
    assert.equal(token(foe2).state.tempHealth, 0);
    assert.equal(token(foe2).state.currentHp, 97);
    assert.equal(openOffers().length, 1, 'qualifying v1 hit creates exactly one offer');
    const offer1 = openOffers()[0];
    assert.deepEqual(offer1.listener.watch, { definitionRef: v1Ref, componentId: 'effects:direct' });
    assert.deepEqual(offer1.occurrence.component.definitionRef, v1Ref);
    assert.equal(offer1.occurrence.component.componentId, 'effects:direct');
    assert.equal(offer1.origin.commandId, v1Hit.cmd.commandId);

    // Owner projection shows offer available until pc's next turn boundary
    const ownerView1 = await ack(owner, 'actor_trigger_list', { roomId: room.id });
    assert.equal(ownerView1.obligations.length, 1);
    assert.equal(ownerView1.obligations[0].available, true);
    assert.equal(ownerView1.obligations[0].lapse, 'pending');
    assert.equal(ownerView1.obligations[0].expiresAtSequence, offer1.lapse.dueSequence);

    // Payment rules preserved: insufficient mana refuses and leaves offer + pools intact
    const savedMana = token(pc).character.mana.current;
    token(pc).character.mana.current = 1;
    token(pc).character.tempMana = 1; // 2 < 3 required by Echo Fang
    const poorApprove = await ack(owner, 'actor_spell_approve', buildApproval(bRef, { target: foe, faces: [5], triggerOfferId: offer1.obligationId }));
    assert.equal(poorApprove.success, false);
    assert.equal(poorApprove.code, 'insufficient_resources');
    assert.equal(openOffers().length, 1, 'failed approval keeps offer open');

    // Restore pools with temp AP + temp mana to verify temp-first ordinary payment on consuming offer
    token(pc).character.mana.current = savedMana;
    token(pc).character.tempMana = 1;
    token(pc).character.tempActionPoints = 1;
    const apBeforeOffer = actors.resources(token(pc), 'character').ap;
    const manaBeforeOffer = actors.resources(token(pc), 'character').mana;
    const foeHpBefore = token(foe).state.currentHp;

    const followApproval = buildApproval(bRef, { target: foe, faces: [5], triggerOfferId: offer1.obligationId }); // 1d6+1 = 6
    assert.equal((await ack(owner, 'actor_spell_approve', followApproval)).code, 'awaiting_gm');
    const followCmd = buildCommand(followApproval);
    const followCommit = await ack(gm, 'actor_consequence', followCmd);
    assert.equal(followCommit.success, true, JSON.stringify(followCommit));
    const storedFollowReceipt = actors.ledger(live()).receipts.find(r => r.commandId === followCmd.commandId);
    assert.equal(storedFollowReceipt.triggerOfferId, offer1.obligationId);

    // Verify full ordinary AP/mana price paid temp-first, target took B's damage, offer consumed, and no chaining offer
    const apAfterOffer = actors.resources(token(pc), 'character').ap;
    const manaAfterOffer = actors.resources(token(pc), 'character').mana;
    assert.equal(apBeforeOffer.temp - apAfterOffer.temp, 1);
    assert.equal(apBeforeOffer.current - apAfterOffer.current, 0);
    assert.equal(manaBeforeOffer.temp - manaAfterOffer.temp, 1);
    assert.equal(manaBeforeOffer.current - manaAfterOffer.current, 2);
    assert.equal(token(foe).state.currentHp, foeHpBefore - 6);
    assert.equal(openOffers().length, 0, 'consumed offer closes and chains no child offer');
    assert.equal(ledger().closed.some(c => c.obligationId === offer1.obligationId && c.state === 'consumed'), true);

    // Reusing consumed offer refuses with trigger_offer_consumed
    const reuse = await ack(owner, 'actor_spell_approve', buildApproval(bRef, { target: foe, faces: [2], triggerOfferId: offer1.obligationId }));
    assert.equal(reuse.success, false);
    assert.equal(reuse.code, 'trigger_offer_consumed');

    // Expiry rules preserved: cast v1 again, survive intervening turns, expire at pc's strictly next turn start
    await castSpell(v1Ref, { target: foe2, faces: [3] }); // 1d6+2 = 5 -> foe2 HP 92
    assert.equal(openOffers().length, 1);
    const offer2 = openOffers()[0];
    while (live().gameState.combat.effectLifecycle.sequence < offer2.lapse.dueSequence - 1) {
      await advanceTurn();
    }
    const midTurnView = await ack(owner, 'actor_trigger_list', { roomId: room.id });
    assert.equal(midTurnView.obligations[0].available, true);
    assert.equal(midTurnView.obligations[0].lapse, 'pending');

    await advanceTurn(); // pc's next turn start (sequence === dueSequence)
    const expiredView = await ack(owner, 'actor_trigger_list', { roomId: room.id });
    assert.equal(expiredView.obligations[0].available, false);
    assert.equal(expiredView.obligations[0].lapse, 'expired');

    const poolsBeforeExpired = clone(actors.resources(token(pc), 'character'));
    const expiredApprove = await ack(owner, 'actor_spell_approve', buildApproval(bRef, { target: foe, faces: [4], triggerOfferId: offer2.obligationId }));
    assert.equal(expiredApprove.success, false);
    assert.equal(expiredApprove.code, 'trigger_offer_expired');
    assert.deepEqual(actors.resources(token(pc), 'character'), poolsBeforeExpired);

    // Explicit v2 registration: revoke v1 watch and register v2 watch
    const rev = await ack(gm, 'actor_trigger_revoke', {
      roomId: room.id,
      requestId: uuid(),
      expectedRevision: ledger().revision,
      listenerId: regV1.listener.listenerId
    });
    assert.equal(rev.success, true, JSON.stringify(rev));

    const regV2 = await ack(gm, 'actor_trigger_register', {
      roomId: room.id,
      requestId: uuid(),
      expectedRevision: ledger().revision,
      source: pc,
      definitionRef: bRef,
      on: DAMAGE_ON,
      mode: 'component-follow-up',
      watch: { definitionRef: v2Ref, componentId: 'effects:direct' }
    });
    assert.equal(regV2.success, true, JSON.stringify(regV2));

    // Cast v1 after switching watch to v2 -> creates 0 new offers
    await castSpell(v1Ref, { target: foe2, faces: [4] });
    assert.equal(openOffers().length, 0, 'v1 no longer creates offers once watch is moved to v2');

    // Cast v2 -> creates 1 offer referencing v2
    const v2Hit = await castSpell(v2Ref, { target: foe, faces: [4, 5] }); // 2d6+2 = 11
    assert.equal(openOffers().length, 1, 'explicitly registered v2 creates one offer');
    const offerV2 = openOffers()[0];
    assert.deepEqual(offerV2.listener.watch, { definitionRef: v2Ref, componentId: 'effects:direct' });
    assert.deepEqual(offerV2.occurrence.component.definitionRef, v2Ref);
    assert.equal(offerV2.origin.commandId, v2Hit.cmd.commandId);

    // Consuming v2 offer pays full ordinary cost and chains nothing
    const v2Follow = buildApproval(bRef, { target: foe, faces: [3], triggerOfferId: offerV2.obligationId });
    assert.equal((await ack(owner, 'actor_spell_approve', v2Follow)).code, 'awaiting_gm');
    const v2FollowCmd = buildCommand(v2Follow);
    const v2Commit = await ack(gm, 'actor_consequence', v2FollowCmd);
    assert.equal(v2Commit.success, true, JSON.stringify(v2Commit));
    const storedV2FollowReceipt = actors.ledger(live()).receipts.find(r => r.commandId === v2FollowCmd.commandId);
    assert.equal(storedV2FollowReceipt.triggerOfferId, offerV2.obligationId);
    assert.equal(openOffers().length, 0);
  });

  it('2. One-part Direct Damage (componentId "effect"): v1 watch fires only for v1 until v2 is explicitly registered', async() => {
    const defId = uuid();
    const v1Rec = onePartWatchRecord({ id: defId, name: 'Ember Needle', formula: '1d6+2' });
    const v2Rec = onePartWatchRecord({ id: defId, name: 'Ember Needle (White-Hot)', formula: '1d8+3' });
    const bRec = followUpRecord({ name: 'Echo Fang', formula: '1d6+1', ap: 1, mana: 3 });

    const v1Ref = await admit(v1Rec, 1);
    const v2Ref = await admit(v2Rec, 2);
    const bRef = await admit(bRec, 1);

    const regV1 = await ack(gm, 'actor_trigger_register', {
      roomId: room.id,
      requestId: uuid(),
      expectedRevision: ledger()?.revision || 0,
      source: pc,
      definitionRef: bRef,
      on: DAMAGE_ON,
      mode: 'component-follow-up',
      watch: { definitionRef: v1Ref, componentId: 'effect' }
    });
    assert.equal(regV1.success, true, JSON.stringify(regV1));

    await startCombatAndAdoptClock();

    await castSpell(v2Ref, { target: foe, faces: [5] });
    assert.equal(openOffers().length, 0, 'unwatched one-part v2 produces no offer');

    await castSpell(v1Ref, { target: foe, faces: [4] });
    assert.equal(openOffers().length, 1, 'watched one-part v1 produces 1 offer');
    assert.deepEqual(openOffers()[0].occurrence.component.definitionRef, v1Ref);
    assert.equal(openOffers()[0].occurrence.component.componentId, 'effect');

    // Consume v1 offer cleanly
    const a1 = buildApproval(bRef, { target: foe, faces: [2], triggerOfferId: openOffers()[0].obligationId });
    assert.equal((await ack(owner, 'actor_spell_approve', a1)).code, 'awaiting_gm');
    assert.equal((await ack(gm, 'actor_consequence', buildCommand(a1))).success, true);
    assert.equal(openOffers().length, 0);

    // Switch registration to v2
    assert.equal((await ack(gm, 'actor_trigger_revoke', {
      roomId: room.id,
      requestId: uuid(),
      expectedRevision: ledger().revision,
      listenerId: regV1.listener.listenerId
    })).success, true);
    assert.equal((await ack(gm, 'actor_trigger_register', {
      roomId: room.id,
      requestId: uuid(),
      expectedRevision: ledger().revision,
      source: pc,
      definitionRef: bRef,
      on: DAMAGE_ON,
      mode: 'component-follow-up',
      watch: { definitionRef: v2Ref, componentId: 'effect' }
    })).success, true);

    await castSpell(v1Ref, { target: foe, faces: [4] });
    assert.equal(openOffers().length, 0, 'v1 produces no offer after registration moved to v2');

    await castSpell(v2Ref, { target: foe, faces: [6] });
    assert.equal(openOffers().length, 1, 'registered one-part v2 produces 1 offer');
    assert.deepEqual(openOffers()[0].occurrence.component.definitionRef, v2Ref);
    assert.equal(openOffers()[0].occurrence.component.componentId, 'effect');
  });
});
