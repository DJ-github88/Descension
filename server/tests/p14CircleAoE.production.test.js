const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const installed = require('../services/installedAuthoredAbilities');
const registry = require('../services/installedDefinitionRegistry');
const pure = require('../shared/services/authoredAbility');
const payments = require('../services/spellPayments');
const relationships = require('../services/actorRelationships');

const ack = (s, event, data) => new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(Error(event)), 5000);
  s.emit(event, data, r => { clearTimeout(t); resolve(r); });
});
const once = (s, event) => new Promise(resolve => s.once(event, resolve));

describe('Circle AoE server-authoritative geometry & target verification tests', function () {
  this.timeout(20000);
  let server, room, gm, owner, observer, gu, uid, obsUid, pc, allyPc, foes, writer;

  beforeEach(async () => {
    pure.setAreaRollProposalForTest(true);
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async () => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer });
    await server.start();
    for (const e of ['token_created', 'actor_bind', 'actor_consequence', 'actor_snapshot', 'actor_spell_approve', 'actor_spell_list', 'actor_authored_admit', 'actor_authored_revoke', 'actor_relationship_set', 'sync_gameplay_settings']) {
      server.setEventLimits(e, { maxPerMinute: 4000, maxPerSecond: 4000 });
    }
    gu = server.nextUserId();
    uid = server.nextUserId();
    obsUid = server.nextUserId();
    server.registerAuthToken('gm', gu);
    server.registerAuthToken('owner', uid);
    server.registerAuthToken('observer', obsUid);

    gm = server.connect({ token: 'gm' });
    await once(gm, 'connect');
    room = await server.seedRoom(gm.id, { gmUserId: gu });

    owner = server.connect({ token: 'owner' });
    await once(owner, 'connect');
    const ownerJoined = once(owner, 'room_joined');
    owner.emit('join_room', { roomId: room.id, playerName: 'owner', password: '' });
    await ownerJoined;

    observer = server.connect({ token: 'observer' });
    await once(observer, 'connect');
    const obsJoined = once(observer, 'room_joined');
    observer.emit('join_room', { roomId: room.id, playerName: 'observer', password: '' });
    await obsJoined;

    server.setCharacterOwner('c', uid);
    server.setCharacterOwner('ally-c', obsUid);

    const map = room.gameState.maps.default;
    map.gridSettings = { gridType: 'square', gridSize: 50, feetPerTile: 5, gridOffsetX: 0, gridOffsetY: 0 };

    // Caster PC at cell (2,2) -> center (125,125)
    map.characterTokens.pc = {
      id: 'pc',
      ownerUserId: uid,
      position: { x: 125, y: 125 },
      character: {
        id: 'c',
        name: 'Lyra',
        class: 'Arcanoneer',
        stats: { intelligence: 18, spirit: 15 },
        health: { current: 24, max: 30 },
        mana: { current: 10, max: 12 },
        actionPoints: { current: 4, max: 4 },
        tempMana: 2,
        tempActionPoints: 1
      },
      state: { conditions: [] }
    };
    // PC Ally placed inside ranged Circle at cell (6,2) -> (325,125)
    map.characterTokens.ally = {
      id: 'ally',
      ownerUserId: obsUid,
      position: { x: 325, y: 125 },
      character: {
        id: 'ally-c',
        name: 'Bram',
        class: 'Martyr',
        stats: { spirit: 14 },
        health: { current: 20, max: 28 },
        mana: { current: 8, max: 8 },
        actionPoints: { current: 4, max: 4 }
      },
      state: { conditions: [] }
    };

    // Handoff grid (50 px squares):
    // foeA (enemy) at (3,2) = (175,125)
    // foeB (enemy) at (5,2) = (275,125)
    // foeC (enemy) at (7,2) = (375,125)
    // neutralInside (neutral) at (6,2) = (325,125)
    // hiddenInside (enemy, hiddenFromPlayers: true) at (6,2) = (325,125)
    // stateHiddenInside (enemy, state.isHidden: true) at (6,2) = (325,125)
    // allyCreature (ally) at (5,3) = (275,175)
    // farEnemy (enemy) at (20,2) = (1025,125)
    const specs = [
      ['foeA', 'Goblin A', { x: 175, y: 125 }, { tempHealth: 3 }],
      ['foeB', 'Goblin B', { x: 275, y: 125 }, {}],
      ['foeC', 'Goblin C', { x: 375, y: 125 }, { tempHealth: 4 }],
      ['neutralInside', 'Bystander', { x: 325, y: 125 }, {}],
      ['hiddenInside', 'Stalker', { x: 325, y: 125 }, { hiddenFromPlayers: true }],
      ['stateHiddenInside', 'Shade', { x: 325, y: 125 }, { isHidden: true }],
      ['allyCreature', 'Ward Hound', { x: 275, y: 175 }, {}],
      ['farEnemy', 'Far Archer', { x: 1025, y: 125 }, {}]
    ];
    foes = {};
    for (const [id, name, position, extra] of specs) {
      map.tokens[id] = {
        id,
        name,
        position,
        stats: { maxHp: 50, maxMana: 0, maxAP: 4 },
        state: {
          currentHp: 30,
          currentMana: 0,
          currentActionPoints: 4,
          tempHealth: extra.tempHealth || 0,
          ...(extra.hiddenFromPlayers ? { hiddenFromPlayers: true } : {}),
          ...(extra.isHidden ? { isHidden: true } : {}),
          conditions: []
        }
      };
    }
    for (const [id] of specs) {
      const bound = await ack(gm, 'actor_bind', {
        roomId: room.id,
        ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: id },
        snapshotHash: actors.hash(room.gameState.maps.default.tokens[id])
      });
      assert.equal(bound.success, true, `bind ${id}: ${JSON.stringify(bound)}`);
      foes[id] = bound.ref;
    }

    pc = (await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid: uid, characterId: 'c' },
      snapshotHash: actors.hash(room.gameState.maps.default.characterTokens.pc)
    })).ref;

    allyPc = (await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'ally', ownerUid: obsUid, characterId: 'ally-c' },
      snapshotHash: actors.hash(room.gameState.maps.default.characterTokens.ally)
    })).ref;
  });

  afterEach(async () => {
    pure.setAreaRollApprovalForTest(undefined);
    pure.setAreaRollProposalForTest(false);
    gm?.disconnect();
    owner?.disconnect();
    observer?.disconnect();
    await server?.stop();
  });

  const token = ref => actors.locate(room, ref).token;
  async function setRelation(a, b, value) {
    const result = await ack(gm, 'actor_relationship_set', {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(room),
      baseCommitSequence: actors.ledger(room).commitSequence,
      pairs: [{ a, b }],
      value,
      expectedRelationshipRevision: relationships.revision(room)
    });
    assert.equal(result.success, true, JSON.stringify(result));
  }

  function makeWizardCircleRecord({
    formula = '2d6 + 8',
    kind = 'damage',
    radiusFeet = 10,
    rangeFeet = 30,
    maxTargets = 8,
    restriction = 'enemy',
    ap = 1,
    mana = 2
  } = {}) {
    const d = {
      name: kind === 'healing' ? 'Sanctuary Circle' : 'Arcane Burst',
      description: 'Bounded immediate Circle AoE.',
      spellType: 'ACTION',
      typeConfig: { castTimeType: 'IMMEDIATE', school: 'arcane' },
      effectTypes: [kind],
      targetingConfig: {
        targetingType: 'area',
        aoeShape: 'circle',
        aoeParameters: { radius: radiusFeet },
        rangeType: 'ranged',
        rangeDistance: rangeFeet,
        targetRestrictions: [restriction],
        maxTargets
      },
      resourceCost: {
        actionPoints: ap,
        resourceTypes: mana > 0 ? ['mana'] : [],
        resourceValues: { mana }
      },
      [`${kind}Config`]: kind === 'damage'
        ? { damageType: 'direct', elementType: 'arcane', formula, resolution: 'DICE' }
        : { healingType: 'direct', formula, resolution: 'DICE' }
    };
    return Object.assign({}, actors.clone(d), { authoredDefinitionId: uuid(), authoredDraft: actors.clone(d) });
  }

  async function admitCircle(opts = {}) {
    const record = makeWizardCircleRecord(opts);
    const result = await ack(gm, 'actor_authored_admit', {
      roomId: room.id,
      requestId: uuid(),
      expectedRegistryRevision: installed.registry(room).revision,
      record,
      definitionVersion: 1,
      classId: 'arcanoneer'
    });
    assert.equal(result.success, true, JSON.stringify(result));
    const entry = installed.list(room).entries.find(e => e.definitionRef.definitionId === record.authoredDefinitionId);
    for (const id of ['foeA', 'foeB', 'foeC', 'hiddenInside', 'stateHiddenInside', 'farEnemy']) {
      await setRelation(pc, foes[id], 'enemy');
    }
    await setRelation(pc, foes.allyCreature, 'ally');
    return entry;
  }

  function buildCircleApproval(e, targetRefs, {
    faces = [4, 5],
    areaOrigin = { x: 325, y: 125 }
  } = {}) {
    const names = pure.formulaAttributes(e.canonicalDefinition.effect.formula);
    const projected = require('../services/roomAccessService').projectTokenForClient(token(pc));
    const rollAttributes = {};
    for (const n of names) rollAttributes[n] = projected.character.stats[n];
    const reading = pure.readScaledFormula(e.canonicalDefinition.effect.formula, rollAttributes);
    return {
      version: 1,
      roomId: room.id,
      approvalId: uuid(),
      actionEpoch: actors.epoch(room),
      baseCommitSequence: actors.ledger(room).commitSequence,
      source: pc,
      targets: targetRefs,
      spell: {
        definitionId: pure.actionId(e.definitionRef),
        definitionHash: `${pure.AREA_CAPABILITY}/${e.definitionRef.definitionHash}`,
        name: e.canonicalDefinition.name,
        kind: e.canonicalDefinition.effect.kind,
        damageTypes: e.canonicalDefinition.effect.damageTypes || []
      },
      areaTerms: e.canonicalDefinition.targeting,
      areaRollProcedure: pure.AREA_ROLL_PROCEDURE,
      ...(areaOrigin !== undefined ? { areaOrigin } : {}),
      roll: {
        mode: 'physical',
        dice: [{ sides: 6, faces }],
        constant: reading.constant,
        reading: reading.reading,
        total: faces.reduce((a, b) => a + b, reading.constant)
      },
      ...(names.length ? { rollAttributes } : {}),
      ...(names.length ? {
        formulaSourceRevision: token(pc).state.actorContract.revision,
        formulaSourceHash: actors.hash({ character: projected.character, conditions: projected.state?.conditions || [] })
      } : {}),
      price: e.descriptor.price,
      classPayment: null
    };
  }

  function buildAreaCommand(a, contentHash, outcomes) {
    const sourceRes = actors.resources(token(pc), 'character');
    const payment = {};
    if (a.price.ap > 0) payment.ap = payments.tempFirst(sourceRes.ap.current, sourceRes.ap.temp, a.price.ap);
    if (a.price.mana > 0) payment.mana = payments.tempFirst(sourceRes.mana.current, sourceRes.mana.temp, a.price.mana);
    if (!Object.keys(payment).length) payment.ap = payments.tempFirst(sourceRes.ap.current, sourceRes.ap.temp, 0);
    const actorsList = [
      { ref: pc, expectedRevision: token(pc).state.actorContract.revision, finalResources: payment }
    ];
    let totalFinalAmount = 0;
    const reasons = [];
    for (let i = 0; i < a.targets.length; i++) {
      const ref = a.targets[i];
      const o = outcomes ? outcomes[i] : { finalAmount: a.roll.total, adjustmentReason: '' };
      const tRes = actors.resources(token(ref), 'creature').hp;
      const hp = a.spell.kind === 'healing'
        ? { current: Math.min(tRes.max, tRes.current + o.finalAmount), temp: tRes.temp }
        : (() => {
            const fromTemp = Math.min(tRes.temp, o.finalAmount);
            return { current: Math.max(0, tRes.current - (o.finalAmount - fromTemp)), temp: tRes.temp - fromTemp };
          })();
      actorsList.push({ ref, expectedRevision: token(ref).state.actorContract.revision, finalResources: { hp } });
      totalFinalAmount += o.finalAmount;
      if (o.adjustmentReason) reasons.push(o.adjustmentReason);
    }
    return {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(room),
      baseCommitSequence: actors.ledger(room).commitSequence,
      source: pc,
      targets: a.targets,
      approval: { approvalId: a.approvalId, contentHash },
      actors: actorsList,
      adjudication: {
        definitionId: a.spell.definitionId,
        definitionVersionOrHash: a.spell.definitionHash,
        chosenResult: JSON.stringify({
          capability: pure.AREA_CAPABILITY,
          approvalId: a.approvalId,
          kind: a.spell.kind,
          areaRollProcedure: pure.AREA_ROLL_PROCEDURE,
          roll: a.roll,
          damageTypes: a.spell.damageTypes,
          spellName: a.spell.name,
          sourceName: 'Lyra',
          areaTerms: a.areaTerms,
          targets: outcomes
            ? outcomes.map((o, idx) => ({ ref: a.targets[idx], finalAmount: o.finalAmount, adjustmentReason: o.adjustmentReason || '' }))
            : a.targets.map(ref => ({ ref, finalAmount: a.roll.total, adjustmentReason: '' })),
          gmConfirmed: true
        }),
        finalAmount: totalFinalAmount,
        adjustmentReason: reasons.join('; ')
      }
    };
  }

  async function setScale(feetPerTile, sender = gm) {
    const heard = once(observer, 'gameplay_settings_updated');
    sender.emit('sync_gameplay_settings', { feetPerTile, roomId: room.id });
    return Promise.race([heard, new Promise(resolve => setTimeout(() => resolve(null), 400))]);
  }

  it('1. Circle placed away from caster enforces G1 range, G5 free point, G3/G3a overlap, completeness, relationship, visibility, and undecided fail-closed guards', async () => {
    const entry = await admitCircle();
    const beforeAll = actors.clone(room.gameState);

    // Missing areaOrigin or supplying areaTarget refuses with invalid_spell_approval
    const noOrigin = buildCircleApproval(entry, [foes.foeB]);
    delete noOrigin.areaOrigin;
    const rNoOrigin = await ack(owner, 'actor_spell_approve', noOrigin);
    assert.equal(rNoOrigin.success, false);
    assert.equal(rNoOrigin.code, 'invalid_spell_approval');

    const nullOrigin = buildCircleApproval(entry, [foes.foeB], { areaOrigin: null });
    const rNullOrigin = await ack(owner, 'actor_spell_approve', nullOrigin);
    assert.equal(rNullOrigin.success, false);
    assert.equal(rNullOrigin.code, 'invalid_spell_approval');

    const withLineTarget = Object.assign({}, buildCircleApproval(entry, [foes.foeB]), { areaTarget: { x: 375, y: 125 } });
    const rLineTarget = await ack(owner, 'actor_spell_approve', withLineTarget);
    assert.equal(rLineTarget.success, false);
    assert.equal(rLineTarget.code, 'invalid_spell_approval');

    // G1: range is measured to circle origin (center), NOT nearest edge.
    // Caster at (125,125), range 30 ft (300 px), radius 10 ft (100 px).
    // Origin (426,125) is 30.1 ft away (nearest edge 20.1 ft <= 30 ft) -> MUST refuse area_origin_out_of_range!
    const outG1 = buildCircleApproval(entry, [foes.foeC], { areaOrigin: { x: 426, y: 125 } });
    const rOutG1 = await ack(owner, 'actor_spell_approve', outG1);
    assert.equal(rOutG1.success, false);
    assert.equal(rOutG1.code, 'area_origin_out_of_range');

    // G5 free-point + G3a edge exclusion at (250,125) (12.5 ft East, non-cell-center):
    // radius 100 px -> foeA (175,125) dist 50 (candidate), foeB (275,125) dist 0 (candidate), foeC (375,125) closest x=350 dist 100 -> 'edge' (excluded)!
    const withEdgeC = buildCircleApproval(entry, [foes.foeA, foes.foeB, foes.foeC], { areaOrigin: { x: 250, y: 125 } });
    const rEdgeC = await ack(owner, 'actor_spell_approve', withEdgeC);
    assert.equal(rEdgeC.success, false);
    assert.equal(rEdgeC.code, 'stale_area_placement');

    // Including outside target foeA when placed at (325,125)
    const withOutsideA = buildCircleApproval(entry, [foes.foeA, foes.foeB, foes.foeC], { areaOrigin: { x: 325, y: 125 } });
    const rOutA = await ack(owner, 'actor_spell_approve', withOutsideA);
    assert.equal(rOutA.success, false);
    assert.equal(rOutA.code, 'stale_area_placement');

    // Omitting eligible target foeC when placed at (325,125)
    const omittedC = buildCircleApproval(entry, [foes.foeB], { areaOrigin: { x: 325, y: 125 } });
    const rOmitC = await ack(owner, 'actor_spell_approve', omittedC);
    assert.equal(rOmitC.success, false);
    assert.equal(rOmitC.code, 'stale_area_placement');

    // Including neutralInside -> target_relationship_mismatch
    const withNeutral = buildCircleApproval(entry, [foes.foeB, foes.foeC, foes.neutralInside], { areaOrigin: { x: 325, y: 125 } });
    const rNeutral = await ack(owner, 'actor_spell_approve', withNeutral);
    assert.equal(rNeutral.success, false);
    assert.equal(rNeutral.code, 'target_relationship_mismatch');

    // Including hiddenInside / stateHiddenInside -> actor_not_found
    for (const hidRef of [foes.hiddenInside, foes.stateHiddenInside]) {
      const withHid = buildCircleApproval(entry, [foes.foeB, foes.foeC, hidRef], { areaOrigin: { x: 325, y: 125 } });
      const rHid = await ack(owner, 'actor_spell_approve', withHid);
      assert.equal(rHid.success, false);
      assert.equal(rHid.code, 'actor_not_found');
    }

    // Including PC inside circle -> unsupported_area_target_kind
    const withPc = buildCircleApproval(entry, [foes.foeB, foes.foeC, allyPc], { areaOrigin: { x: 325, y: 125 } });
    const rPc = await ack(owner, 'actor_spell_approve', withPc);
    assert.equal(rPc.success, false);
    assert.equal(rPc.code, 'unsupported_area_target_kind');

    // Undecided geometry rules fail closed without guessing:
    // (a) Non-square (hex) grid
    room.gameState.maps.default.gridSettings.gridType = 'hex';
    const rHex = await ack(owner, 'actor_spell_approve', buildCircleApproval(entry, [foes.foeB, foes.foeC]));
    assert.equal(rHex.success, false);
    assert.equal(rHex.code, 'manual_area_geometry_required');
    room.gameState.maps.default.gridSettings.gridType = 'square';

    // (b) Off-grid target
    token(foes.foeB).position = { x: 277, y: 125 };
    const rOffGrid = await ack(owner, 'actor_spell_approve', buildCircleApproval(entry, [foes.foeB, foes.foeC]));
    assert.equal(rOffGrid.success, false);
    assert.equal(rOffGrid.code, 'manual_area_geometry_required');
    token(foes.foeB).position = { x: 275, y: 125 };

    // (c) G1b multi-cell Large caster
    token(pc).size = 'large';
    const rG1b = await ack(owner, 'actor_spell_approve', buildCircleApproval(entry, [foes.foeB, foes.foeC]));
    assert.equal(rG1b.success, false);
    assert.equal(rG1b.code, 'manual_area_geometry_required');
    delete token(pc).size;

    assert.deepEqual(room.gameState, beforeAll, 'All refused checks must leave room untouched');
    assert.equal(payments.listAll(room).length, 0);

    // Valid free-point cast at (250,125): hits foeA and foeB (foeC is exact G3a edge at x=350)
    const appFree = buildCircleApproval(entry, [foes.foeA, foes.foeB], { faces: [2, 3], areaOrigin: { x: 250, y: 125 } });
    const rApp = await ack(owner, 'actor_spell_approve', appFree);
    assert.equal(rApp.success, false);
    assert.equal(rApp.code, 'awaiting_gm');

    const cmd = buildAreaCommand(appFree, rApp.contentHash, [
      { finalAmount: 13, adjustmentReason: '' },
      { finalAmount: 10, adjustmentReason: 'Partial resistance' }
    ]);
    const committed = await ack(gm, 'actor_consequence', cmd);
    assert.equal(committed.success, true, JSON.stringify(committed));

    const pcRes = actors.resources(token(pc), 'character');
    assert.equal(pcRes.ap.temp, 0);
    assert.equal(pcRes.ap.current, 4);
    assert.equal(pcRes.mana.temp, 0);
    assert.equal(pcRes.mana.current, 10);

    assert.deepEqual(actors.resources(token(foes.foeA), 'creature').hp, { current: 20, temp: 0, max: 50 }); // 30+3temp-13=20
    assert.deepEqual(actors.resources(token(foes.foeB), 'creature').hp, { current: 20, temp: 0, max: 50 }); // 30-10=20
    assert.equal(actors.resources(token(foes.foeC), 'creature').hp.current, 30, 'edge target foeC untouched');
    assert.equal(actors.resources(token(foes.neutralInside), 'creature').hp.current, 30);
    assert.equal(actors.resources(token(foes.hiddenInside), 'creature').hp.current, 30);
    assert.equal(actors.resources(token(allyPc), 'character').hp.current, 20);

    // Idempotent duplicate replay
    const stateAfter = actors.clone(room.gameState);
    const replayed = await ack(gm, 'actor_consequence', cmd);
    assert.equal(replayed.success, true);
    assert.equal(replayed.receipt.commandId, committed.receipt.commandId);
    assert.deepEqual(room.gameState, stateAfter);
  });

  it('2. Live token_created + projectTokenForClient preserves large (2x2) size and Circle clips non-anchor tile once', async () => {
    const entry = await admitCircle({ radiusFeet: 10, rangeFeet: 30 });
    const createdEvent = once(owner, 'token_created');
    gm.emit('token_created', {
      roomId: room.id,
      mapId: 'default',
      position: { x: 325, y: 325 }, // 2x2 cells: (5,5),(6,5),(5,6),(6,6) -> [250..350,250..350]
      creature: {
        id: 'bestiary-cave-ogre',
        name: 'Cave Ogre',
        size: 'Large',
        stats: { maxHp: 50, maxMana: 0, maxAP: 4 }
      },
      token: {
        id: 'caveOgre',
        creatureId: 'bestiary-cave-ogre',
        state: { currentHp: 30, currentMana: 0, currentActionPoints: 4, tempHealth: 0, conditions: [] }
      }
    });
    const broadcast = await createdEvent;
    assert.equal(broadcast.token.size, 'large');

    const boundOgre = (await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'caveOgre' },
      snapshotHash: actors.hash(room.gameState.maps.default.tokens.caveOgre)
    })).ref;
    await setRelation(pc, boundOgre, 'enemy');

    // Place 10-ft Circle at (175,275) (15.8 ft from caster <= 30 ft).
    // Radius = 100 px -> reaches x=275, clipping ONLY non-anchor cell (5,5) [250..300, 250..300] of Cave Ogre!
    const omitted = buildCircleApproval(entry, [foes.foeA], { areaOrigin: { x: 175, y: 275 } });
    const rOmit = await ack(owner, 'actor_spell_approve', omitted);
    assert.equal(rOmit.success, false);
    assert.equal(rOmit.code, 'stale_area_placement');

    const app = buildCircleApproval(entry, [boundOgre], { faces: [4, 5], areaOrigin: { x: 175, y: 275 } });
    const approved = await ack(owner, 'actor_spell_approve', app);
    assert.equal(approved.code, 'awaiting_gm', JSON.stringify(approved));

    const cmd = buildAreaCommand(app, approved.contentHash, [{ finalAmount: 17, adjustmentReason: '' }]);
    const committed = await ack(gm, 'actor_consequence', cmd);
    assert.equal(committed.success, true, JSON.stringify(committed));
    assert.equal(actors.resources(token(boundOgre), 'creature').hp.current, 13);
  });

  it('3. GM grid scale (5 ft vs 10 ft per square): Circle placed away from caster checks authoritative range and targets', async () => {
    const entry = await admitCircle({ radiusFeet: 10, rangeFeet: 30 });

    // At 5 ft/sq: origin (325,125) is 20 ft East (<= 30 ft); 10-ft radius = 100 px hits foeB and foeC.
    await setScale(5);
    const app5 = buildCircleApproval(entry, [foes.foeB, foes.foeC], { faces: [2, 3], areaOrigin: { x: 325, y: 125 } });
    const r5 = await ack(owner, 'actor_spell_approve', app5);
    assert.equal(r5.code, 'awaiting_gm', JSON.stringify(r5));
    const c5 = await ack(gm, 'actor_consequence', buildAreaCommand(app5, r5.contentHash));
    assert.equal(c5.success, true, JSON.stringify(c5));
    assert.equal(actors.resources(token(foes.foeA), 'creature').hp.current, 30);
    assert.equal(actors.resources(token(foes.foeB), 'creature').hp.current, 17);
    assert.equal(actors.resources(token(foes.foeC), 'creature').hp.temp, 0);
    assert.equal(actors.resources(token(foes.foeC), 'creature').hp.current, 21);

    // At 10 ft/sq: origin (325,125) is 40 ft East (> 30 ft) -> refused area_origin_out_of_range!
    await setScale(10);
    const outAt10 = buildCircleApproval(entry, [foes.foeB, foes.foeC], { areaOrigin: { x: 325, y: 125 } });
    const rOut10 = await ack(owner, 'actor_spell_approve', outAt10);
    assert.equal(rOut10.success, false);
    assert.equal(rOut10.code, 'area_origin_out_of_range');

    // Origin (275,125) is 30 ft East (<= 30 ft); 10-ft radius = 50 px hits foeB ONLY (foeA and foeC outside).
    // Stale 5-ft target lists ['foeA','foeB','foeC'] and ['foeB','foeC'] are refused without payment or damage.
    const before10 = actors.clone(room.gameState);
    for (const staleTargets of [[foes.foeA, foes.foeB, foes.foeC], [foes.foeB, foes.foeC]]) {
      const stale10 = buildCircleApproval(entry, staleTargets, { areaOrigin: { x: 275, y: 125 } });
      const rStale10 = await ack(owner, 'actor_spell_approve', stale10);
      assert.equal(rStale10.success, false);
      assert.equal(rStale10.code, 'stale_area_placement');
    }
    assert.deepEqual(room.gameState, before10);

    const app10 = buildCircleApproval(entry, [foes.foeB], { faces: [2, 3], areaOrigin: { x: 275, y: 125 } });
    const r10 = await ack(owner, 'actor_spell_approve', app10);
    assert.equal(r10.code, 'awaiting_gm', JSON.stringify(r10));
    const c10 = await ack(gm, 'actor_consequence', buildAreaCommand(app10, r10.contentHash));
    assert.equal(c10.success, true, JSON.stringify(c10));
    assert.equal(actors.resources(token(foes.foeA), 'creature').hp.current, 30);
    assert.equal(actors.resources(token(foes.foeB), 'creature').hp.current, 4); // 17 - 13
    assert.equal(actors.resources(token(foes.foeC), 'creature').hp.current, 21);
    assert.equal(actors.resources(token(pc), 'character').mana.current, 8); // 10 - 2
  });

  it('4. Stale target list or scale/caster/relationship drift after approval refuses at GM commit with owner_reapproval_required and zero spend/damage', async () => {
    const entry = await admitCircle({ radiusFeet: 10, rangeFeet: 30 });

    const assertCommitRefusedCleanly = async (setupFn, approval, approvedHash, expectedCode = 'owner_reapproval_required') => {
      setupFn();
      const beforeMaps = actors.clone(room.gameState.maps);
      const seqBefore = actors.ledger(room).commitSequence;
      const receiptsBefore = actors.ledger(room).receipts.length;
      const cmd = buildAreaCommand(approval, approvedHash);
      const res = await ack(gm, 'actor_consequence', cmd);
      assert.equal(res.success, false, JSON.stringify(res));
      assert.equal(res.code, expectedCode, JSON.stringify(res));
      assert.equal(actors.ledger(room).commitSequence, seqBefore);
      assert.equal(actors.ledger(room).receipts.length, receiptsBefore);
      assert.deepEqual(room.gameState.maps, beforeMaps);
    };

    // (a) Approved target moves outside placed circle
    const a1 = buildCircleApproval(entry, [foes.foeB, foes.foeC], { areaOrigin: { x: 325, y: 125 } });
    const r1 = await ack(owner, 'actor_spell_approve', a1);
    assert.equal(r1.code, 'awaiting_gm');
    await assertCommitRefusedCleanly(() => {
      token(foes.foeC).position = { x: 625, y: 125 };
    }, a1, r1.contentHash);
    token(foes.foeC).position = { x: 375, y: 125 };

    // (b) New eligible enemy enters placed circle
    const a2 = buildCircleApproval(entry, [foes.foeB, foes.foeC], { areaOrigin: { x: 325, y: 125 } });
    const r2 = await ack(owner, 'actor_spell_approve', a2);
    assert.equal(r2.code, 'awaiting_gm');
    await assertCommitRefusedCleanly(() => {
      token(foes.farEnemy).position = { x: 325, y: 125 };
    }, a2, r2.contentHash);
    token(foes.farEnemy).position = { x: 1025, y: 125 };

    // (c) Caster moves so placed circle origin exceeds placement range
    const a3 = buildCircleApproval(entry, [foes.foeB, foes.foeC], { areaOrigin: { x: 325, y: 125 } });
    const r3 = await ack(owner, 'actor_spell_approve', a3);
    assert.equal(r3.code, 'awaiting_gm');
    await assertCommitRefusedCleanly(() => {
      token(pc).position = { x: -25, y: 125 }; // 35 ft away > 30 ft
    }, a3, r3.contentHash);
    token(pc).position = { x: 125, y: 125 };

    // (d) GM changes grid scale between approval and commit (5 -> 10 ft/sq)
    await setScale(5);
    const a4 = buildCircleApproval(entry, [foes.foeA, foes.foeB, foes.foeC], { areaOrigin: { x: 275, y: 125 } });
    const r4 = await ack(owner, 'actor_spell_approve', a4);
    assert.equal(r4.code, 'awaiting_gm');
    await setScale(10);
    await assertCommitRefusedCleanly(() => {}, a4, r4.contentHash);

    // (e) GM changes grid scale 10 -> 5 ft/sq (new eligible creatures enter circle)
    const a5 = buildCircleApproval(entry, [foes.foeB], { areaOrigin: { x: 275, y: 125 } });
    const r5 = await ack(owner, 'actor_spell_approve', a5);
    assert.equal(r5.code, 'awaiting_gm');
    await setScale(5);
    await assertCommitRefusedCleanly(() => {}, a5, r5.contentHash);

    // (f) Creature inside circle flips neutral -> enemy after approval
    const a6 = buildCircleApproval(entry, [foes.foeB, foes.foeC], { areaOrigin: { x: 325, y: 125 } });
    const r6 = await ack(owner, 'actor_spell_approve', a6);
    assert.equal(r6.code, 'awaiting_gm');
    await setRelation(pc, foes.neutralInside, 'enemy');
    await assertCommitRefusedCleanly(() => {}, a6, r6.contentHash);
  });

  it('5. Circle healing (restriction: ally) enforces server-authoritative Circle geometry and completeness', async () => {
    const healEntry = await admitCircle({ kind: 'healing', restriction: 'ally', radiusFeet: 10, rangeFeet: 30 });
    token(foes.allyCreature).state.currentHp = 15;

    // Place at (325,125): allyCreature is at (275,175) = cell (5,3) [250..300,150..200], closest (300,150) -> dist sqrt(25^2+25^2)=35.36 px < 100 px -> inside!
    const badIncludeFoe = buildCircleApproval(healEntry, [foes.allyCreature, foes.foeB], { areaOrigin: { x: 325, y: 125 } });
    const rBad = await ack(owner, 'actor_spell_approve', badIncludeFoe);
    assert.equal(rBad.success, false);
    assert.equal(rBad.code, 'target_relationship_mismatch');

    // Out of range origin
    const outHeal = buildCircleApproval(healEntry, [foes.allyCreature], { areaOrigin: { x: 525, y: 125 } });
    const rOut = await ack(owner, 'actor_spell_approve', outHeal);
    assert.equal(rOut.success, false);
    assert.equal(rOut.code, 'area_origin_out_of_range');

    const goodHeal = buildCircleApproval(healEntry, [foes.allyCreature], { faces: [3, 4], areaOrigin: { x: 325, y: 125 } });
    const rGood = await ack(owner, 'actor_spell_approve', goodHeal);
    assert.equal(rGood.code, 'awaiting_gm', JSON.stringify(rGood));

    const committed = await ack(gm, 'actor_consequence', buildAreaCommand(goodHeal, rGood.contentHash, [{ finalAmount: 15, adjustmentReason: '' }]));
    assert.equal(committed.success, true, JSON.stringify(committed));
    assert.equal(actors.resources(token(foes.allyCreature), 'creature').hp.current, 30);
  });
});
