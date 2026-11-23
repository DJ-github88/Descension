const assert = require('assert').strict;
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const relationships = require('../services/actorRelationships');
const installed = require('../services/installedAuthoredAbilities');
const registry = require('../services/installedDefinitionRegistry');
const payments = require('../services/spellPayments');
const checkpoint = require('../services/roomCheckpoint');
const pure = require('../shared/services/authoredAbility');
const authoredChanneled = require('../shared/services/authoredChanneled');
const conditionProfile = require('../shared/services/sharedConditionProfile');

const FIXTURES_PATH = path.resolve(
  __dirname,
  '../../vtt-react/src/components/spellcrafting-wizard/__tests__/fixtures/channeledSpellFixtures.json'
);

const uuid = () => crypto.randomUUID();
const once = (socket, event) => new Promise((resolve) => socket.once(event, resolve));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const ack = (socket, event, payload) =>
  new Promise((resolve) => {
    socket.emit(event, payload, (response) => resolve(response));
  });

function loadChanneledFixtures() {
  assert.ok(fs.existsSync(FIXTURES_PATH), `Missing Wizard fixtures at ${FIXTURES_PATH}`);
  return JSON.parse(fs.readFileSync(FIXTURES_PATH, 'utf8'));
}

function rollFor(formula, faces) {
  const r = pure.readFormula(formula);
  return {
    mode: 'physical',
    dice: [{ sides: r.dice[0].sides, faces }],
    constant: r.constant,
    reading: r.reading,
    total: faces.reduce((sum, face) => sum + face, r.constant)
  };
}

function chosen(receipt) {
  return JSON.parse(receipt.adjudication.chosenResult);
}

describe('Channeled Spell End-to-End Production Combat (Wizard Fixture -> Prism Combat Engine)', function () {
  this.timeout(25000);

  let server, room, gm, owner, observer, writer, ownerUid;
  let pc, target, midTarget, farTarget, allyTarget;
  let fixtures;

  beforeEach(async () => {
    fixtures = loadChanneledFixtures();
    writer = new FirebaseBatchWriter(60000, 50, {
      shouldPersist: () => true,
      persist: async () => ({ outcome: 'confirmed' })
    });
    server = createProductionStackServer({ firebaseBatchWriter: writer });
    await server.start();

    for (const event of [
      'actor_bind',
      'actor_snapshot',
      'actor_consequence',
      'actor_authored_admit',
      'actor_spell_approve',
      'actor_spell_prepare_creature',
      'actor_spell_withdraw',
      'actor_spell_list',
      'actor_recovery',
      'actor_relationship_set',
      'actor_turn_boundary',
      'actor_combat_roster',
      'actor_periodic_resolve',
      'combat_started',
      'combat_ended',
      'token_moved'
    ]) {
      server.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
    }

    const gmUid = server.nextUserId();
    ownerUid = server.nextUserId();
    const observerUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid);
    server.registerAuthToken('owner', ownerUid);
    server.registerAuthToken('observer', observerUid);

    gm = server.connect({ token: 'gm' });
    await once(gm, 'connect');
    room = await server.seedRoom(gm.id, { gmUserId: gmUid });

    for (const role of ['owner', 'observer']) {
      const s = server.connect({ token: role });
      await once(s, 'connect');
      const joined = once(s, 'room_joined');
      s.emit('join_room', { roomId: room.id, playerName: role, password: '' });
      await joined;
      if (role === 'owner') owner = s;
      else observer = s;
    }

    server.setCharacterOwner('char-arcanoneer', ownerUid);
    const getMap = () => live().gameState.maps.default;
    getMap().gridSettings = {
      gridType: 'square',
      gridSize: 50,
      feetPerTile: 5,
      gridOffsetX: 0,
      gridOffsetY: 0
    };

    const makeCreature = (id, name, x, { hp = 40, temp = 0 } = {}) => ({
      id,
      name,
      creatureId: id,
      position: { x, y: 25 },
      stats: { maxHp: 40, maxMana: 20, maxAP: 10, speed: 30 },
      state: {
        currentHp: hp,
        currentMana: 20,
        currentActionPoints: 10,
        tempHealth: temp,
        tempMana: 0,
        tempActionPoints: 0,
        conditions: []
      }
    });

    const tNear = makeCreature('target-near', 'Near Raider', 125); // 10 ft from (25, 25)
    const tMid = makeCreature('target-mid', 'Mid Skirmisher', 275); // 25 ft from (25, 25)
    const tFar = makeCreature('target-far', 'Far Archer', 425); // 40 ft from (25, 25)
    const tAlly = makeCreature('target-ally', 'Wounded Ally', 75, { hp: 20 }); // 5 ft from (25, 25)
    getMap().tokens[tNear.id] = tNear;
    getMap().tokens[tMid.id] = tMid;
    getMap().tokens[tFar.id] = tFar;
    getMap().tokens[tAlly.id] = tAlly;
    getMap().characterTokens.pc = {
      id: 'pc',
      ownerUserId: ownerUid,
      position: { x: 25, y: 25 },
      character: {
        id: 'char-arcanoneer',
        class: 'Arcanoneer',
        health: { current: 30, max: 30 },
        mana: { current: 30, max: 30 },
        actionPoints: { current: 6, max: 6 },
        tempMana: 5,
        tempActionPoints: 1
      },
      state: { conditions: [] }
    };

    const bindCreature = async (tok) => {
      const res = await ack(gm, 'actor_bind', {
        roomId: room.id,
        ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: tok.id },
        snapshotHash: actors.hash(tok)
      });
      assert.equal(res.success, true, JSON.stringify(res));
      return res.ref;
    };

    target = await bindCreature(tNear);
    midTarget = await bindCreature(tMid);
    farTarget = await bindCreature(tFar);
    allyTarget = await bindCreature(tAlly);

    const pr = await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'char-arcanoneer' },
      snapshotHash: actors.hash(getMap().characterTokens.pc)
    });
    assert.equal(pr.success, true, JSON.stringify(pr));
    pc = pr.ref;

    const enemyRel = await ack(gm, 'actor_relationship_set', {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence,
      pairs: [
        { a: pc, b: target },
        { a: pc, b: midTarget },
        { a: pc, b: farTarget }
      ],
      value: 'enemy',
      expectedRelationshipRevision: relationships.revision(live())
    });
    assert.equal(enemyRel.success, true, JSON.stringify(enemyRel));

    const allyRel = await ack(gm, 'actor_relationship_set', {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence,
      pairs: [{ a: pc, b: allyTarget }],
      value: 'ally',
      expectedRelationshipRevision: relationships.revision(live())
    });
    assert.equal(allyRel.success, true, JSON.stringify(allyRel));

    const started = await ack(gm, 'combat_started', {
      roomId: room.id,
      turnOrder: [pc, target].map((ref) => ({ tokenId: ref.tokenId, actorRef: ref })),
      currentTurnIndex: 0,
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
  });

  afterEach(async () => {
    gm.disconnect();
    owner.disconnect();
    observer.disconnect();
    await server.stop();
  });

  const live = () => server.rooms.get(room.id);
  const token = (ref) => actors.locate(live(), ref).token;
  const clock = () => live().gameState.combat.effectLifecycle;
  const baseCmd = () => ({
    version: 1,
    roomId: room.id,
    commandId: uuid(),
    actionEpoch: actors.epoch(live()),
    baseCommitSequence: actors.ledger(live()).commitSequence
  });
  const pcPools = () => {
    const c = token(pc).character;
    return {
      ap: c.actionPoints.current,
      tempAp: c.tempActionPoints,
      mana: c.mana.current,
      tempMana: c.tempMana,
      hp: c.health.current
    };
  };
  const creatureHp = (ref) => ({
    current: token(ref).state.currentHp,
    temp: token(ref).state.tempHealth
  });

  const entryFor = (defRef) =>
    installed.list(live()).entries.find((e) => pure.actionId(e.definitionRef) === pure.actionId(defRef));

  async function admitFixture(key, { useReopened = false } = {}) {
    const fixture = fixtures[key];
    assert.ok(fixture, `Unknown fixture key: ${key}`);
    const record = useReopened ? fixture.reopenedOuterRecord : fixture.savedOuterRecord;
    const res = await ack(gm, 'actor_authored_admit', {
      roomId: room.id,
      requestId: uuid(),
      expectedRegistryRevision: installed.registry(live()).revision,
      record,
      definitionVersion: 1,
      classId: 'arcanoneer'
    });
    assert.equal(res.success, true, `admit ${key} failed: ${JSON.stringify(res)}`);
    return entryFor(res.definitionRef);
  }

  function makeApproval(entry, targetRef = target) {
    const d = entry.canonicalDefinition;
    return {
      version: 1,
      roomId: room.id,
      approvalId: uuid(),
      actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence,
      source: pc,
      target: targetRef,
      spell: {
        definitionId: pure.actionId(entry.definitionRef),
        definitionHash: `${authoredChanneled.CAPABILITY}/${entry.definitionRef.definitionHash}`,
        name: d.name,
        kind: 'channeled',
        damageTypes: d.tickEffect.kind === 'damage' ? d.tickEffect.damageTypes : []
      },
      roll: null,
      channelTerms: authoredChanneled.termsFor(d),
      price: entry.descriptor.price,
      classPayment: null
    };
  }

  function buildStartCommand(a) {
    const pay = {};
    const p = actors.resources(token(a.source), 'character');
    for (const k of ['ap', 'mana']) {
      if (a.price[k]) pay[k] = payments.tempFirst(p[k].current, p[k].temp, a.price[k]);
    }
    if (!Object.keys(pay).length) pay.ap = payments.tempFirst(p.ap.current, p.ap.temp, 0);
    const casterChannels = installed.findActiveChannelsByCaster(live(), a.source);
    const plan = authoredChanneled.conditionPlan(a, token(a.target).state.conditions || [], casterChannels);
    assert.equal(plan.refused, undefined, JSON.stringify(plan.refused));
    return {
      ...baseCmd(),
      source: a.source,
      target: a.target,
      approval: { approvalId: a.approvalId, contentHash: actors.hash(a) },
      actors: [
        { ref: a.source, expectedRevision: token(a.source).state.actorContract.revision, finalResources: pay },
        { ref: a.target, expectedRevision: token(a.target).state.actorContract.revision, conditions: plan.ops }
      ],
      adjudication: {
        definitionId: a.spell.definitionId,
        definitionVersionOrHash: a.spell.definitionHash,
        finalAmount: 0,
        adjustmentReason: '',
        chosenResult: JSON.stringify(
          authoredChanneled.resultFor(
            a,
            {
              gmConfirmed: true,
              timing: a.channelTerms.timing,
              timingNote: 'GM confirmed channeled start and range',
              evidence: 'GM table channeled start'
            },
            plan.combination
          )
        )
      }
    };
  }

  async function startChannel(entry, targetRef = target) {
    const a = makeApproval(entry, targetRef);
    const appRes = await ack(owner, 'actor_spell_approve', a);
    assert.equal(appRes.code, 'awaiting_gm', JSON.stringify(appRes));
    const cmd = buildStartCommand(a);
    const conRes = await ack(gm, 'actor_consequence', cmd);
    assert.equal(conRes.success, true, JSON.stringify(conRes));
    return { approval: a, command: cmd, receipt: conRes.receipt };
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
    return {
      receipt: res.receipt,
      result: chosen(res.receipt)
    };
  }

  async function resolveTick(tickId, faces, mode = 'apply', reason = 'Rolled tick') {
    const tick = clock().dueTicks[tickId];
    assert.ok(tick, `Missing due tick ${tickId}`);
    const payload = {
      ...baseCmd(),
      tickId,
      mode,
      adjustmentReason: reason
    };
    if (mode === 'apply') {
      const roll = rollFor(tick.tick.formula, faces);
      payload.expectedRevision = token(tick.ref).state.actorContract.revision;
      payload.roll = roll;
      payload.finalAmount = roll.total;
    }
    return ack(gm, 'actor_periodic_resolve', payload);
  }

  async function moveTokenViaSocket(tokenId, position) {
    gm.emit('token_moved', {
      roomId: room.id,
      mapId: 'default',
      tokenId,
      position,
      actionId: uuid()
    });
    const deadline = Date.now() + 1500;
    while (Date.now() < deadline) {
      const cur = live().gameState.maps.default.tokens[tokenId]?.position;
      if (cur && cur.x === position.x && cur.y === position.y) return;
      await sleep(20);
    }
    assert.fail(`token_moved did not flush to (${position.x}, ${position.y})`);
  }

  it('enforces target selection and range at channel start, runs full natural 3-turn lifecycle, and fires 0 extra ticks afterward', async () => {
    // Admit directly from reopened Wizard record to prove save/reopen parity end-to-end on the server.
    const entry = await admitFixture('arcane-beam-start-30ft', { useReopened: true });

    // Target selection checks at channel start:
    // 1. PC target refused (fail-closed at approval gate + conditionPlan)
    const pcTargetRes = await ack(owner, 'actor_spell_approve', makeApproval(entry, pc));
    assert.equal(pcTargetRes.success, false);
    assert.equal(pcTargetRes.code, 'invalid_spell_approval');
    assert.equal(
      authoredChanneled.conditionPlan(makeApproval(entry, pc), [], []).refused.code,
      'channeled_target_unsupported'
    );

    // 2. Ally target refused for enemy-only spell
    const allyRes = await ack(owner, 'actor_spell_approve', makeApproval(entry, allyTarget));
    assert.equal(allyRes.success, false);
    assert.ok(allyRes.code);

    // 3. Enemy beyond 30 ft (40 ft) refused at channel start
    const outOfRangeRes = await ack(owner, 'actor_spell_approve', makeApproval(entry, farTarget));
    assert.equal(outOfRangeRes.success, false);
    assert.equal(outOfRangeRes.code, 'target_out_of_range');

    // Valid target within 30 ft (10 ft): starts channel
    const { approval } = await startChannel(entry, target);

    // Upfront payment spent temp-first (2 AP = 1 temp + 1 current; 10 mana = 5 temp + 5 current)
    assert.deepEqual(pcPools(), { ap: 5, tempAp: 0, mana: 25, tempMana: 0, hp: 30 });

    // Target holds active channeled condition with caster-anchored schedule & zero immediate HP change
    assert.deepEqual(creatureHp(target), { current: 40, temp: 0 });
    const activeCond = token(target).state.conditions.find((c) => c.recordId === approval.approvalId);
    assert.ok(activeCond);
    assert.equal(activeCond.effectOrigin, conditionProfile.CHANNELED.origin);
    assert.equal(activeCond.clockBoundary, 'authored-caster-start-count');
    assert.equal(activeCond.clockOccurrences, 3);
    assert.equal(activeCond.channelRangeFeet, 30);

    // Schedule is anchored on PC caster, marked channeled
    const sched = Object.values(clock().schedules)[0];
    assert.equal(sched.channeled, true);
    assert.equal(sched.anchorRef.tokenId, pc.tokenId);
    assert.equal(sched.ref.tokenId, target.tokenId);
    assert.equal(sched.occurrences, 3);

    // seq=1 (PC -> target): not caster's start of turn -> 0 ticks
    const t1 = await advanceTurn();
    assert.equal(t1.result.sequence, 1);
    assert.equal(t1.result.ticks, undefined);
    assert.equal(t1.result.endedChannels, undefined);

    // seq=2 (target -> PC): caster START_OF_TURN 1 of 3
    const t2 = await advanceTurn();
    assert.equal(t2.result.sequence, 2);
    assert.equal(t2.result.ticks.length, 1);
    assert.equal(t2.result.ticks[0].occurrence, 1);
    assert.equal(t2.result.ticks[0].final, false);
    const r2 = await resolveTick(t2.result.ticks[0].tickId, [4]);
    assert.equal(r2.success, true, JSON.stringify(r2));
    assert.deepEqual(creatureHp(target), { current: 36, temp: 0 });

    // seq=3 -> 0 ticks
    const t3 = await advanceTurn();
    assert.equal(t3.result.ticks, undefined);

    // seq=4 -> tick 2 of 3
    const t4 = await advanceTurn();
    assert.equal(t4.result.ticks.length, 1);
    assert.equal(t4.result.ticks[0].occurrence, 2);
    assert.equal(t4.result.ticks[0].final, false);
    const r4 = await resolveTick(t4.result.ticks[0].tickId, [5]);
    assert.equal(r4.success, true, JSON.stringify(r4));
    assert.deepEqual(creatureHp(target), { current: 31, temp: 0 });

    // seq=5 -> 0 ticks
    const t5 = await advanceTurn();
    assert.equal(t5.result.ticks, undefined);

    // seq=6 -> tick 3 of 3 (final), condition removed, endedChannels reason='completed'
    const t6 = await advanceTurn();
    assert.equal(t6.result.ticks.length, 1);
    assert.equal(t6.result.ticks[0].occurrence, 3);
    assert.equal(t6.result.ticks[0].final, true);
    assert.deepEqual(t6.result.expired, [approval.approvalId]);
    assert.equal(t6.result.endedChannels.length, 1);
    assert.equal(t6.result.endedChannels[0].reason, 'completed');
    assert.equal(token(target).state.conditions.length, 0);
    const r6 = await resolveTick(t6.result.ticks[0].tickId, [3]);
    assert.equal(r6.success, true, JSON.stringify(r6));
    assert.deepEqual(creatureHp(target), { current: 28, temp: 0 });

    // Zero extra ticks over 4 more turn advances (seq 7..10)
    for (let i = 0; i < 4; i += 1) {
      const after = await advanceTurn();
      assert.equal(after.result.ticks, undefined);
      assert.equal(after.result.endedChannels, undefined);
    }
    assert.deepEqual(clock().dueTicks || {}, {});
    assert.deepEqual(clock().schedules || {}, {});
  });

  it('breaks channel permanently via real token_moved when target leaves range and records 0 extra ticks even if target returns', async () => {
    const entry = await admitFixture('arcane-beam-start-30ft');
    const { approval } = await startChannel(entry, target);

    // Tick 1 fires at seq=2 while still at 10 ft
    await advanceTurn(); // seq 1
    const t2 = await advanceTurn(); // seq 2
    assert.equal(t2.result.ticks.length, 1);
    assert.equal((await resolveTick(t2.result.ticks[0].tickId, [2])).success, true);
    assert.deepEqual(creatureHp(target), { current: 38, temp: 0 });

    // Target moves out of range (from x=125 = 10ft to x=425 = 40ft > 30ft) via real token_moved
    await moveTokenViaSocket(target.tokenId, { x: 425, y: 25 });

    // Next turn boundary evaluates continuity BEFORE firing seq=4 tick -> permanent break at seq=3!
    const t3 = await advanceTurn(); // seq 3
    assert.equal(t3.result.ticks, undefined);
    assert.deepEqual(t3.result.expired, [approval.approvalId]);
    assert.equal(t3.result.endedChannels.length, 1);
    assert.equal(t3.result.endedChannels[0].reason, 'target_out_of_range');
    assert.equal(t3.result.endedChannels[0].distanceFeet, 40);
    assert.equal(t3.result.endedChannels[0].rangeFeet, 30);
    assert.equal(token(target).state.conditions.length, 0);

    // Move target back into range (x=125 = 10ft) -> channel does NOT resume and fires 0 extra ticks
    await moveTokenViaSocket(target.tokenId, { x: 125, y: 25 });
    for (let i = 0; i < 4; i += 1) {
      const after = await advanceTurn();
      assert.equal(after.result.ticks, undefined);
      assert.equal(after.result.endedChannels, undefined);
    }
    assert.deepEqual(creatureHp(target), { current: 38, temp: 0 });
  });

  it('supports damage concentration check hints + GM removal (staling open ticks), caster Stunned interruption, and same-target replace / cross-target block', async () => {
    const entry = await admitFixture('arcane-beam-start-30ft');

    // (a) Damage while channeling -> concentrationChecks hint -> GM manual removal -> stale earlier open tick -> 0 extra ticks
    const firstRun = await startChannel(entry, target);
    // Cross-target cast while channeling target is refused with caster_already_channeling
    const crossTargetRes = await ack(owner, 'actor_spell_approve', makeApproval(entry, midTarget));
    assert.equal(crossTargetRes.success, false);
    assert.equal(crossTargetRes.code, 'caster_already_channeling');

    await advanceTurn(); // seq 1
    const t2 = await advanceTurn(); // seq 2 -> Tick 1 open (not yet resolved)
    const openTickId = t2.result.ticks[0].tickId;

    // Enemy hits channeling caster for 6 HP -> receipt includes concentrationChecks hint
    const dmgRes = await ack(gm, 'actor_consequence', {
      ...baseCmd(),
      actors: [
        {
          ref: pc,
          expectedRevision: token(pc).state.actorContract.revision,
          finalResources: { hp: { current: 24, temp: 0 } }
        }
      ],
      adjudication: {
        definitionId: 'gm-damage',
        definitionVersionOrHash: 'manual-gm-hit',
        finalAmount: 6,
        adjustmentReason: 'Enemy strike on channeling caster',
        chosenResult: JSON.stringify({ kind: 'damage', amount: 6 })
      }
    });
    assert.equal(dmgRes.success, true, JSON.stringify(dmgRes));
    assert.deepEqual(dmgRes.receipt.concentrationChecks, [
      {
        caster: pc,
        target,
        recordId: firstRun.approval.approvalId,
        spellName: 'Arcane Beam',
        damageTaken: 6,
        concentrationDC: 12,
        dcType: 'CONSTITUTION',
        resolution: 'gm_manual'
      }
    ]);
    assert.deepEqual(actors.publicReceipt(dmgRes.receipt).concentrationChecks, dmgRes.receipt.concentrationChecks);

    // GM fails the caster's check manually and removes the channeled condition
    const interruptRes = await ack(gm, 'actor_consequence', {
      ...baseCmd(),
      actors: [
        {
          ref: target,
          expectedRevision: token(target).state.actorContract.revision,
          conditions: [{ op: 'remove', recordId: firstRun.approval.approvalId }]
        }
      ],
      adjudication: {
        definitionId: 'gm-channel-interrupt',
        definitionVersionOrHash: 'manual-gm-ruling',
        finalAmount: 0,
        adjustmentReason: 'Failed Constitution concentration check (DC 12)',
        chosenResult: JSON.stringify({ interrupted: true })
      }
    });
    assert.equal(interruptRes.success, true, JSON.stringify(interruptRes));
    assert.equal(token(target).state.conditions.length, 0);

    // Earlier open tick can no longer apply (periodic_tick_stale), but GM can dismiss cleanly
    const staleApply = await resolveTick(openTickId, [6], 'apply');
    assert.equal(staleApply.success, false);
    assert.equal(staleApply.code, 'periodic_tick_stale');
    const dismissed = await resolveTick(openTickId, [6], 'dismiss', 'Channel broken before tick resolved');
    assert.equal(dismissed.success, true, JSON.stringify(dismissed));

    for (let i = 0; i < 4; i += 1) {
      const after = await advanceTurn();
      assert.equal(after.result.ticks, undefined);
    }

    // (b) Same-target recast atomically replaces active channel, then canonical Stunned on caster ends it with 0 extra ticks
    const secondRun = await startChannel(entry, target);
    const replaceApproval = makeApproval(entry, target);
    assert.equal((await ack(owner, 'actor_spell_approve', replaceApproval)).code, 'awaiting_gm');
    const replaceCmd = buildStartCommand(replaceApproval);
    assert.equal(chosen(replaceCmd).combination.outcome, 'replaced');
    assert.equal(chosen(replaceCmd).combination.replacesInstanceId, secondRun.approval.approvalId);
    const replaceRes = await ack(gm, 'actor_consequence', replaceCmd);
    assert.equal(replaceRes.success, true, JSON.stringify(replaceRes));
    assert.equal(token(target).state.conditions.length, 1);
    assert.equal(token(target).state.conditions[0].recordId, replaceApproval.approvalId);

    // Apply canonical Stunned to caster PC
    const stunId = uuid();
    const stunRecord = conditionProfile.makeStunnedRecord(pc, stunId, {
      sourceOccurrence: 'manual:gm-stun',
      timing: 'manual'
    });
    const stunRes = await ack(gm, 'actor_consequence', {
      ...baseCmd(),
      actors: [
        {
          ref: pc,
          expectedRevision: token(pc).state.actorContract.revision,
          conditions: [{ op: 'add', recordId: stunId, record: stunRecord }]
        }
      ],
      adjudication: {
        definitionId: conditionProfile.STUNNED.definitionId,
        definitionVersionOrHash: conditionProfile.STUNNED.origin,
        finalAmount: 0,
        adjustmentReason: 'Caster stunned',
        chosenResult: JSON.stringify({ condition: 'Stunned' })
      }
    });
    assert.equal(stunRes.success, true, JSON.stringify(stunRes));

    // Next turn boundary detects caster_stunned and ends channel cleanly with 0 ticks
    const stunBoundary = await advanceTurn();
    assert.equal(stunBoundary.result.ticks, undefined);
    assert.deepEqual(stunBoundary.result.expired, [replaceApproval.approvalId]);
    assert.equal(stunBoundary.result.endedChannels[0].reason, 'caster_stunned');
    assert.equal(token(target).state.conditions.length, 0);

    for (let i = 0; i < 4; i += 1) {
      const after = await advanceTurn();
      assert.equal(after.result.ticks, undefined);
    }
  });

  it('executes single-setting Wizard variants (END_OF_TURN, 20 ft range, ally healing) with no code changes and clean checkpoint snapshots', async () => {
    // 1) END_OF_TURN variant: skips cast-turn end (seq=1), ticks on caster turn ends (seq=3, 5, 7), then 0 extra ticks
    const eotEntry = await admitFixture('arcane-beam-end-of-turn-variant');
    const eotStart = await startChannel(eotEntry, target);
    const s1 = await advanceTurn(); // seq=1 (end of cast turn) -> 0 ticks!
    assert.equal(s1.result.sequence, 1);
    assert.equal(s1.result.ticks, undefined);
    const s2 = await advanceTurn(); // seq=2 -> 0 ticks!
    assert.equal(s2.result.ticks, undefined);

    const s3 = await advanceTurn(); // seq=3 -> tick 1/3
    assert.equal(s3.result.ticks.length, 1);
    assert.equal(s3.result.ticks[0].occurrence, 1);
    assert.equal((await resolveTick(s3.result.ticks[0].tickId, [2])).success, true);

    await advanceTurn(); // seq=4
    const s5 = await advanceTurn(); // seq=5 -> tick 2/3
    assert.equal(s5.result.ticks[0].occurrence, 2);
    assert.equal((await resolveTick(s5.result.ticks[0].tickId, [2])).success, true);

    await advanceTurn(); // seq=6
    const s7 = await advanceTurn(); // seq=7 -> tick 3/3 (final)
    assert.equal(s7.result.ticks[0].occurrence, 3);
    assert.equal(s7.result.ticks[0].final, true);
    assert.deepEqual(s7.result.expired, [eotStart.approval.approvalId]);
    assert.equal(s7.result.endedChannels[0].reason, 'completed');
    assert.equal((await resolveTick(s7.result.ticks[0].tickId, [2])).success, true);
    assert.deepEqual(creatureHp(target), { current: 34, temp: 0 });

    for (let i = 0; i < 4; i += 1) {
      assert.equal((await advanceTurn()).result.ticks, undefined);
    }

    // 2) 20 ft range variant: midTarget (25 ft) refused under 20 ft spell, accepted under 30 ft spell
    const range20Entry = await admitFixture('arcane-beam-20ft-variant');
    const range20Refusal = await ack(owner, 'actor_spell_approve', makeApproval(range20Entry, midTarget));
    assert.equal(range20Refusal.success, false);
    assert.equal(range20Refusal.code, 'target_out_of_range');

    const range30Entry = await admitFixture('arcane-beam-start-30ft');
    const range30Approval = makeApproval(range30Entry, midTarget);
    const range30Accept = await ack(owner, 'actor_spell_approve', range30Approval);
    assert.equal(range30Accept.code, 'awaiting_gm');
    // Withdraw pending 30 ft approval cleanly before healing variant
    const wd = await ack(owner, 'actor_spell_withdraw', {
      roomId: room.id,
      approvalId: range30Approval.approvalId
    });
    assert.equal(wd.success, true, JSON.stringify(wd));

    // 3) Healing ally variant: heals wounded ally over 2 ticks, ends with 0 extra ticks, and validates checkpoint + registry snapshot
    const healEntry = await admitFixture('soothing-beam-healing-ally');
    const enemyOnHeal = await ack(owner, 'actor_spell_approve', makeApproval(healEntry, target));
    assert.equal(enemyOnHeal.success, false);

    // Note: current turn index is 1 (seq=11); advance once so it's PC's turn, cast healing, and verify ticks at next caster starts
    await advanceTurn(); // seq=12, back to index 0 (pc)
    const healStart = await startChannel(healEntry, allyTarget);

    // Checkpoint & registry snapshot while channeled spell and condition are live
    const cpCheck = checkpoint.canonicalize(live().gameState, 'gameState');
    assert.equal(cpCheck.error, undefined, cpCheck.error);
    const regSnap = registry.validateRegistrySnapshot(live().gameState.authoredSpellRegistry);
    assert.equal(regSnap.ok, true, JSON.stringify(regSnap));

    await advanceTurn(); // seq=13
    const h1 = await advanceTurn(); // seq=14 -> heal tick 1/2
    assert.equal(h1.result.ticks.length, 1);
    assert.equal(clock().dueTicks[h1.result.ticks[0].tickId].tick.kind, 'healing');
    assert.equal((await resolveTick(h1.result.ticks[0].tickId, [3])).success, true);
    assert.deepEqual(creatureHp(allyTarget), { current: 23, temp: 0 });

    await advanceTurn(); // seq=15
    const h2 = await advanceTurn(); // seq=16 -> heal tick 2/2 (final)
    assert.equal(h2.result.ticks.length, 1);
    assert.equal(h2.result.ticks[0].final, true);
    assert.deepEqual(h2.result.expired, [healStart.approval.approvalId]);
    assert.equal(h2.result.endedChannels[0].reason, 'completed');
    assert.equal((await resolveTick(h2.result.ticks[0].tickId, [4])).success, true);
    assert.deepEqual(creatureHp(allyTarget), { current: 27, temp: 0 });

    for (let i = 0; i < 4; i += 1) {
      assert.equal((await advanceTurn()).result.ticks, undefined);
    }
  });

  it('refuses bound channeling caster leaving combat roster until the active channel is removed', async () => {
    const entry = await admitFixture('arcane-beam-start-30ft');
    const { approval } = await startChannel(entry, target);

    // Advance off pc's turn so leave tests scheduled-effect protection rather than combatant_has_turn.
    await advanceTurn();
    assert.equal(live().gameState.combat.currentTurnIndex, 1);

    const before = actors.clone(live().gameState);
    const leaveWhileChanneling = await ack(gm, 'actor_combat_roster', {
      ...baseCmd(),
      op: 'leave',
      combatHash: actors.hash(live().gameState.combat),
      expectedClock: { id: clock().id, sequence: clock().sequence },
      target: pc,
      expectedTargetRevision: token(pc).state.actorContract.revision,
      targetState: 'bound'
    });
    assert.equal(leaveWhileChanneling.success, false, JSON.stringify(leaveWhileChanneling));
    assert.equal(leaveWhileChanneling.code, 'combatant_has_scheduled_effects');
    assert.deepEqual(leaveWhileChanneling.details?.recordIds, [approval.approvalId]);
    assert.deepEqual(live().gameState, before);

    // Once the GM removes the channeled condition from the target, the caster can leave cleanly.
    const removeRes = await ack(gm, 'actor_consequence', {
      ...baseCmd(),
      actors: [
        {
          ref: target,
          expectedRevision: token(target).state.actorContract.revision,
          conditions: [{ op: 'remove', recordId: approval.approvalId }]
        }
      ],
      adjudication: {
        definitionId: 'gm-channel-interrupt',
        definitionVersionOrHash: 'manual-gm-ruling',
        finalAmount: 0,
        adjustmentReason: 'End channel before caster leaves combat',
        chosenResult: JSON.stringify({ interrupted: true })
      }
    });
    assert.equal(removeRes.success, true, JSON.stringify(removeRes));
    assert.deepEqual(clock().schedules || {}, {});

    const leaveAfterClear = await ack(gm, 'actor_combat_roster', {
      ...baseCmd(),
      op: 'leave',
      combatHash: actors.hash(live().gameState.combat),
      expectedClock: { id: clock().id, sequence: clock().sequence },
      target: pc,
      expectedTargetRevision: token(pc).state.actorContract.revision,
      targetState: 'bound'
    });
    assert.equal(leaveAfterClear.success, true, JSON.stringify(leaveAfterClear));
    assert.deepEqual(live().gameState.combat.turnOrder.map((e) => e.tokenId), [target.tokenId]);
  });
});
