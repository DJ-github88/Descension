'use strict';

const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');

const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const installed = require('../services/installedAuthoredAbilities');
const relationships = require('../services/actorRelationships');
const placed = require('../services/placedEffect');
const roomCheckpoint = require('../services/roomCheckpoint');
const pure = require('../shared/services/authoredAbility');
const placedTestPolicy = require('./helpers/placedEffectTestPolicy');

const once = (s, e) => new Promise(r => s.once(e, r));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ack = (s, e, d) => new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(Error(`ACK timeout for ${e}`)), 5000);
  s.emit(e, d, r => { clearTimeout(t); resolve(r); });
});

function buildArmableDraft({
  id = uuid(),
  name = 'Snare Trap',
  effect = 'movement',
  movementFeet = -15,
  drAmount = 3,
  label = 'Hobbled'
} = {}) {
  const authoredCondition = {
    profile: pure.EFFECT_CAPABILITY,
    effect,
    expiryPolicy: 'gm-manual',
    durationText: 'Until GM clears it',
    gmNote: 'Triggered via isolated test rules.'
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
    description: 'Simple canonical condition ability for isolated placed-effect verification.',
    level: 1,
    spellType: 'ACTION',
    typeConfig: { castTimeType: 'IMMEDIATE' },
    effectTypes: ['control'],
    controlConfig: { authoredCondition },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 60,
      maxTargets: 1,
      targetRestrictions: ['enemy']
    },
    resourceCost: { actionPoints: 1, mana: 2 }
  };
  return {
    ...actors.clone(draft),
    authoredDraft: actors.clone(draft),
    authoredDefinitionId: id
  };
}

describe('Placed-effect armed execution — isolated test configuration', function () {
  this.timeout(25000);

  let server, room, gm, owner, observer, writer, gmUid, ownerUid, observerUid;
  let pc, allyPc, enemyA, enemyB, allyCreature, neutralCreature, trapDefRef, auraDefRef;

  const live = () => server.rooms.get(room.id);

  before(function () {
    placedTestPolicy.requirePolicySwapLoader(this, 'Isolated armed placed-effect tests require --require tests/helpers/placedEffectTestLoader.cjs');
  });

  beforeEach(async () => {
    placedTestPolicy.resetPolicyForTest();

    writer = new FirebaseBatchWriter(60000, 50, {
      shouldPersist: () => true,
      persist: async () => ({ outcome: 'confirmed' })
    });
    server = createProductionStackServer({ firebaseBatchWriter: writer, debounceMs: 25 });
    await server.start();
    for (const e of [
      'actor_bind', 'actor_snapshot', 'actor_consequence', 'actor_authored_admit',
      'actor_placed_effect_list', 'actor_placed_effect_place', 'actor_placed_effect_remove',
      'actor_relationship_set', 'token_moved', 'character_moved', 'map_update',
      'sync_level_editor_state', 'sync_gameplay_settings'
    ]) {
      server.setEventLimits(e, { maxPerMinute: 4000, maxPerSecond: 4000 });
    }

    gmUid = server.nextUserId();
    ownerUid = server.nextUserId();
    observerUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid);
    server.registerAuthToken('owner', ownerUid);
    server.registerAuthToken('observer', observerUid);

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
    server.setCharacterOwner('c-ally', observerUid);

    const map = () => room.gameState.maps.default;
    map().gridType = 'square';
    map().gridSize = 50;
    map().feetPerTile = 5;
    map().offsetX = 0;
    map().offsetY = 0;

    map().characterTokens.pc = {
      id: 'pc',
      mapId: 'default',
      ownerUserId: ownerUid,
      position: { x: 125, y: 125 },
      character: {
        id: 'c-pc',
        name: 'Lyra',
        class: 'Wizard',
        health: { current: 25, max: 25 },
        mana: { current: 20, max: 20 },
        actionPoints: { current: 4, max: 4 }
      },
      state: { conditions: [] }
    };
    pc = (await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'c-pc' },
      snapshotHash: actors.hash(map().characterTokens.pc)
    })).ref;

    map().characterTokens.allyPc = {
      id: 'allyPc',
      mapId: 'default',
      ownerUserId: observerUid,
      position: { x: 125, y: 325 },
      character: {
        id: 'c-ally',
        name: 'Toren',
        class: 'Warden',
        health: { current: 35, max: 35 },
        mana: { current: 10, max: 10 },
        actionPoints: { current: 4, max: 4 }
      },
      state: { conditions: [] }
    };
    allyPc = (await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'allyPc', ownerUid: observerUid, characterId: 'c-ally' },
      snapshotHash: actors.hash(map().characterTokens.allyPc)
    })).ref;

    // Outside radius (center 425, 325; radius 10 ft = 2 squares = 100 px)
    const creatureStarts = [
      ['enemyA', 225, 325],
      ['enemyB', 225, 225],
      ['allyCreature', 225, 425],
      ['neutralCreature', 225, 525]
    ];
    const refs = {};
    for (const [id, x, y] of creatureStarts) {
      map().tokens[id] = {
        id,
        name: id,
        mapId: 'default',
        creatureId: 'goblin',
        position: { x, y },
        stats: { maxHp: 30, maxMana: 0, maxAP: 4, speed: 30 },
        state: { currentHp: 30, currentMana: 0, currentActionPoints: 4, conditions: [] }
      };
      const bindRes = await ack(gm, 'actor_bind', {
        roomId: room.id,
        ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: id },
        snapshotHash: actors.hash(map().tokens[id])
      });
      assert.equal(bindRes.success, true, JSON.stringify(bindRes));
      refs[id] = bindRes.ref;
    }
    ({ enemyA, enemyB, allyCreature, neutralCreature } = refs);

    let relRes = await ack(gm, 'actor_relationship_set', {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence,
      expectedRelationshipRevision: relationships.revision(live()),
      pairs: [{ a: pc, b: enemyA }, { a: pc, b: enemyB }],
      value: 'enemy'
    });
    assert.equal(relRes.success, true, JSON.stringify(relRes));

    relRes = await ack(gm, 'actor_relationship_set', {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence,
      expectedRelationshipRevision: relationships.revision(live()),
      pairs: [{ a: pc, b: allyPc }, { a: pc, b: allyCreature }],
      value: 'ally'
    });
    assert.equal(relRes.success, true, JSON.stringify(relRes));

    const admitTrap = await ack(gm, 'actor_authored_admit', {
      roomId: room.id,
      requestId: uuid(),
      expectedRegistryRevision: installed.registry(live()).revision,
      definitionVersion: 1,
      record: buildArmableDraft({ name: 'Shock Snare', effect: 'movement', movementFeet: -15, label: 'Snared' }),
      classId: 'arcanoneer'
    });
    assert.equal(admitTrap.success, true, JSON.stringify(admitTrap));
    trapDefRef = admitTrap.definitionRef;

    const admitAura = await ack(gm, 'actor_authored_admit', {
      roomId: room.id,
      requestId: uuid(),
      expectedRegistryRevision: installed.registry(live()).revision,
      definitionVersion: 1,
      record: buildArmableDraft({ name: 'Windstep Ward', effect: 'damageReduction', drAmount: 3, label: 'Runic Ward' }),
      classId: 'animist'
    });
    assert.equal(admitAura.success, true, JSON.stringify(admitAura));
    auraDefRef = admitAura.definitionRef;
  });

  afterEach(async () => {
    gm?.disconnect();
    owner?.disconnect();
    observer?.disconnect();
    await server?.stop();
  });

  after(() => {
    placedTestPolicy.resetPolicyForTest();
  });

  async function placeArmed({ family = 'trap', definitionRef = trapDefRef, x = 425, y = 325, radiusFeet = 10, mapId = 'default' } = {}) {
    const listBefore = await ack(gm, 'actor_placed_effect_list', { roomId: room.id });
    const res = await ack(gm, 'actor_placed_effect_place', {
      version: 1,
      roomId: room.id,
      requestId: uuid(),
      expectedRevision: listBefore.revision,
      owner: pc,
      definitionRef,
      family,
      armed: true,
      location: { mapId, position: { x, y }, radiusFeet }
    });
    assert.equal(res.success, true, JSON.stringify(res));
    return res.placement;
  }

  async function moveToken(tokenId, x, y, extra = {}) {
    gm.emit('token_moved', {
      roomId: room.id,
      tokenId,
      mapId: extra.mapId || 'default',
      position: { x, y },
      actionId: extra.actionId !== undefined ? extra.actionId : uuid(),
      ...(extra.isDragging !== undefined ? { isDragging: extra.isDragging } : {}),
      ...(extra.isTeleport !== undefined ? { isTeleport: extra.isTeleport } : {}),
      ...(extra.forcedMovement !== undefined ? { forcedMovement: extra.forcedMovement } : {}),
      ...(extra.movementKind !== undefined ? { movementKind: extra.movementKind } : {})
    });
    await sleep(120);
  }

  it('fires once when an enemy creature moves from outside to inside and consumes the placement atomically', async () => {
    const trap = await placeArmed();
    assert.equal(trap.state, 'armed');

    const committedPromise = once(owner, 'actor_consequence_accepted');
    await moveToken('enemyA', 425, 325);
    const committed = await committedPromise;
    assert.ok(committed, 'condition consequence should commit on movement entry');

    const enemyToken = actors.locate(live(), enemyA).token;
    assert.equal(enemyToken.state.conditions.length, 1);
    assert.ok(enemyToken.state.conditions[0].id);
    assert.equal(enemyToken.state.conditions[0].effectDefinition, trap.sourceRecordId);

    const listAfter = await ack(gm, 'actor_placed_effect_list', { roomId: room.id });
    assert.equal(listAfter.placements.length, 1);
    assert.equal(listAfter.placements[0].state, 'consumed');

    // Second enemy moves outside -> inside: already consumed, nothing triggers.
    await moveToken('enemyB', 425, 325);
    assert.deepEqual(actors.locate(live(), enemyB).token.state.conditions, []);
  });

  it('does not fire on room checkpoint load, already-inside moves, exits, zero displacement, drag frames, teleport, or forced movement', async () => {
    // Seed creature ALREADY inside radius (425, 325) on enemyB before checkpoint load
    await moveToken('enemyB', 425, 325);
    const trap = await placeArmed();

    // Verify room reload / checkpoint reconstruction does not fire on creature already inside
    const docs = roomCheckpoint.buildCheckpointDocuments({
      roomId: room.id,
      gameState: live().gameState,
      revision: 1,
      serverTimestamp: () => ({ __ts: 1 }),
      deleteField: () => ({ __del: true })
    });
    const decoded = roomCheckpoint.decodeCanonicalCheckpoint({
      checkpoint: docs.manifest,
      globalDoc: docs.global.data,
      mapDocsById: Object.fromEntries(docs.maps.map(m => [m.mapId, m.data]))
    });
    const hydrated = roomCheckpoint.hydrateSnapshotToGameState(decoded);
    const server2 = createProductionStackServer({
      firebaseBatchWriter: new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async () => ({ outcome: 'confirmed' }) }),
      debounceMs: 25
    });
    await server2.start();
    try {
      server2.registerAuthToken('gm2', gmUid);
      const gm2 = server2.connect({ token: 'gm2' });
      await once(gm2, 'connect');
      const room2 = await server2.seedRoom(gm2.id, { persistentRoomId: room.id, gmUserId: gmUid, initialGameState: hydrated });
      const loadedList = await ack(gm2, 'actor_placed_effect_list', { roomId: room2.id });
      assert.equal(loadedList.placements[0].state, 'armed');
      assert.deepEqual(actors.locate(room2, { ...enemyB, roomId: room2.id }).token.state.conditions, []);
      gm2.disconnect();
    } finally {
      await server2.stop();
    }

    // Already inside -> inside step: no trigger
    await moveToken('enemyB', 475, 325);
    assert.deepEqual(actors.locate(live(), enemyB).token.state.conditions, []);

    // Inside -> outside step: no trigger
    await moveToken('enemyB', 225, 325);
    assert.deepEqual(actors.locate(live(), enemyB).token.state.conditions, []);

    // Zero displacement on enemyA outside (or anywhere): no trigger
    await moveToken('enemyA', 225, 325);
    assert.deepEqual(actors.locate(live(), enemyA).token.state.conditions, []);

    // Ally creature, neutral creature, and owner PC moving into trap: not enemy creatures -> no trigger
    await moveToken('allyCreature', 425, 325);
    await moveToken('neutralCreature', 425, 325);
    assert.deepEqual(actors.locate(live(), allyCreature).token.state.conditions, []);
    assert.deepEqual(actors.locate(live(), neutralCreature).token.state.conditions, []);

    owner.emit('character_moved', {
      roomId: room.id,
      tokenId: 'pc',
      characterId: 'c-pc',
      mapId: 'default',
      position: { x: 425, y: 325 },
      isDragging: true
    });
    await sleep(60);
    // Drop non-owner / owner PC inside trap center: owner never self-triggers
    owner.emit('character_moved', {
      roomId: room.id,
      tokenId: 'pc',
      characterId: 'c-pc',
      mapId: 'default',
      position: { x: 425, y: 325 },
      actionId: uuid()
    });
    await sleep(100);
    assert.deepEqual(actors.locate(live(), pc).token.state.conditions, []);

    // Teleport & forced movement on enemyA outside -> inside: skipped
    await moveToken('enemyA', 425, 325, { isTeleport: true, movementKind: 'teleport' });
    assert.deepEqual(actors.locate(live(), enemyA).token.state.conditions, []);
    await moveToken('enemyA', 225, 325); // back outside
    await moveToken('enemyA', 425, 325, { forcedMovement: true, movementKind: 'forced' });
    assert.deepEqual(actors.locate(live(), enemyA).token.state.conditions, []);

    // Dragging frame (isDragging: true) on an eligible target never evaluates or triggers placed effects
    placedTestPolicy.setTestRulesForTest({
      visibility: 'public',
      expiry: 'manual-only',
      payment: 'none',
      triggerEligibility: { actorKind: 'any', relationship: 'ally', voluntaryMoveOnly: true }
    });
    const dragWard = await placeArmed({ family: 'totem', definitionRef: auraDefRef, x: 625, y: 325 });
    observer.emit('character_moved', {
      roomId: room.id,
      tokenId: 'allyPc',
      characterId: 'c-ally',
      mapId: 'default',
      position: { x: 625, y: 325 },
      isDragging: true
    });
    await sleep(120);
    assert.equal(actors.locate(live(), allyPc).token.state.conditions.length, 0);

    const listFinal = await ack(gm, 'actor_placed_effect_list', { roomId: room.id });
    assert.equal(listFinal.placements.find(p => p.placementId === trap.placementId).state, 'armed');
    assert.equal(listFinal.placements.find(p => p.placementId === dragWard.placementId).state, 'armed');
  });

  it('does not trigger again when the same actionId movement is replayed', async () => {
    const trap = await placeArmed();
    const moveActionId = uuid();

    await moveToken('enemyA', 425, 325, { actionId: moveActionId });
    assert.equal(actors.locate(live(), enemyA).token.state.conditions.length, 1);

    // Replaying exact same actionId (on consumed trap AND on manual-only inscription) never triggers again
    await moveToken('enemyA', 425, 325, { actionId: moveActionId });
    assert.equal(actors.locate(live(), enemyA).token.state.conditions.length, 1);
    const listAfter = await ack(gm, 'actor_placed_effect_list', { roomId: room.id });
    assert.equal(listAfter.placements[0].placementId, trap.placementId);
    assert.equal(listAfter.placements[0].state, 'consumed');

    // Also test non-consuming manual-only placement after enemy leaves and condition is cleared: same actionId replay still blocked!
    placedTestPolicy.setTestRulesForTest({
      visibility: 'owner-and-gm',
      expiry: 'manual-only',
      triggerEligibility: { actorKind: 'creature', relationship: 'enemy', voluntaryMoveOnly: true },
      payment: 'none'
    });
    const rune = await placeArmed({ family: 'inscription', definitionRef: auraDefRef, x: 625, y: 325 });
    const replayId = uuid();
    await moveToken('enemyB', 625, 325, { actionId: replayId });
    assert.equal(actors.locate(live(), enemyB).token.state.conditions.length, 1);

    // GM removes condition cleanly and moves enemyB outside -> inside again reusing same replayId
    const bToken = actors.locate(live(), enemyB);
    const condId = bToken.token.state.conditions[0].id;
    const clearRes = await ack(gm, 'actor_consequence', {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence,
      source: enemyB,
      target: enemyB,
      actors: [{ ref: enemyB, expectedRevision: bToken.contract.revision, conditions: [{ op: 'remove', recordId: condId }] }],
      adjudication: { definitionId: 'gm-clear', definitionVersionOrHash: 'gm-clear:v1', chosenResult: JSON.stringify({ cleared: condId }), adjustmentReason: 'GM clears condition' }
    });
    assert.equal(clearRes.success, true, JSON.stringify(clearRes));
    await moveToken('enemyB', 225, 225);
    await moveToken('enemyB', 625, 325, { actionId: replayId });
    assert.deepEqual(actors.locate(live(), enemyB).token.state.conditions, [], 'replayed actionId must not re-trigger non-consuming placement');
    assert.equal(rune.family, 'inscription');
  });

  it('does not trigger after removal, on other maps, after map deletion, or after grid scale changes', async () => {
    // 1. Removal before entry prevents trigger
    const removedTrap = await placeArmed();
    const list1 = await ack(gm, 'actor_placed_effect_list', { roomId: room.id });
    const remRes = await ack(gm, 'actor_placed_effect_remove', {
      version: 1,
      roomId: room.id,
      requestId: uuid(),
      expectedRevision: list1.revision,
      placementId: removedTrap.placementId
    });
    assert.equal(remRes.success, true);
    await moveToken('enemyA', 425, 325);
    assert.deepEqual(actors.locate(live(), enemyA).token.state.conditions, []);
    await moveToken('enemyA', 225, 325);

    // 2. Movement on another map does not trigger a placement on default
    const defaultTrap = await placeArmed();
    const createMapRes = await new Promise(resolve => {
      gm.once('map_update', resolve);
      gm.emit('map_update', {
        roomId: room.id,
        action: 'create',
        map: {
          id: 'map-2',
          name: 'Upper Hall',
          gridType: 'square',
          gridSize: 50,
          feetPerTile: 5
        }
      });
    });
    assert.equal(createMapRes.action, 'create');
    Object.assign(live().gameState.maps['map-2'], {
      gridType: 'square',
      gridSize: 50,
      feetPerTile: 5,
      offsetX: 0,
      offsetY: 0
    });

    live().gameState.maps['map-2'].tokens.enemyMap2 = {
      id: 'enemyMap2',
      name: 'enemyMap2',
      mapId: 'map-2',
      creatureId: 'goblin',
      position: { x: 225, y: 325 },
      stats: { maxHp: 30, maxMana: 0, maxAP: 4, speed: 30 },
      state: { currentHp: 30, currentMana: 0, currentActionPoints: 4, conditions: [] }
    };
    const m2Bind = await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'creature', roomId: room.id, mapId: 'map-2', tokenId: 'enemyMap2' },
      snapshotHash: actors.hash(live().gameState.maps['map-2'].tokens.enemyMap2)
    });
    assert.equal(m2Bind.success, true, JSON.stringify(m2Bind));
    const relM2 = await ack(gm, 'actor_relationship_set', {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence,
      expectedRelationshipRevision: relationships.revision(live()),
      pairs: [{ a: pc, b: m2Bind.ref }],
      value: 'enemy'
    });
    assert.equal(relM2.success, true);

    await moveToken('enemyMap2', 425, 325, { mapId: 'map-2' });
    assert.deepEqual(actors.locate(live(), m2Bind.ref).token.state.conditions, []);
    const afterM2 = await ack(gm, 'actor_placed_effect_list', { roomId: room.id });
    assert.equal(afterM2.placements[0].state, 'armed');
    assert.equal(afterM2.placements[0].placementId, defaultTrap.placementId);

    // 3. Grid scale change marks placement stale (placement_grid_changed) and prevents triggering
    const changedPromise = once(gm, 'actor_placed_effect_changed');
    gm.emit('sync_level_editor_state', {
      roomId: room.id,
      mapId: 'default',
      gridSettings: { gridType: 'square', gridSize: 60, feetPerTile: 10 }
    });
    await changedPromise;

    const listGrid = await ack(gm, 'actor_placed_effect_list', { roomId: room.id });
    assert.equal(listGrid.placements[0].state, 'stale');
    assert.match(listGrid.placements[0].reason, /grid scale or offset changed/);
    await moveToken('enemyA', 425, 325);
    assert.deepEqual(actors.locate(live(), enemyA).token.state.conditions, []);

    // 4. Map deletion marks placement on that map stale (placement_map_missing)
    const createMap3 = await new Promise(resolve => {
      gm.once('map_update', resolve);
      gm.emit('map_update', {
        roomId: room.id,
        action: 'create',
        map: { id: 'map-3', name: 'Collapsed Vault', gridType: 'square', gridSize: 50, feetPerTile: 5 }
      });
    });
    assert.equal(createMap3.action, 'create');
    Object.assign(live().gameState.maps['map-3'], {
      gridType: 'square',
      gridSize: 50,
      feetPerTile: 5,
      offsetX: 0,
      offsetY: 0
    });
    const map3Trap = await placeArmed({ mapId: 'map-3', x: 625, y: 325 });
    const delNotice = once(gm, 'actor_placed_effect_changed');
    gm.emit('map_update', { roomId: room.id, action: 'delete', mapId: 'map-3' });
    await delNotice;

    const listAfterDelete = await ack(gm, 'actor_placed_effect_list', { roomId: room.id });
    const missingMapEntry = listAfterDelete.placements.find(p => p.placementId === map3Trap.placementId);
    assert.equal(missingMapEntry.state, 'stale');
    assert.match(missingMapEntry.reason, /map no longer exists/);
  });

  it('allows Inscription and Totem families to reuse placement with public non-consuming ally rules without inheriting single-use trap semantics', async () => {
    placedTestPolicy.setTestRulesForTest({
      visibility: 'public',
      expiry: 'manual-only',
      payment: 'none',
      triggerEligibility: {
        actorKind: 'any',
        relationship: 'ally',
        voluntaryMoveOnly: true
      }
    });

    const inscription = await placeArmed({
      family: 'inscription',
      definitionRef: auraDefRef,
      x: 525,
      y: 325,
      radiusFeet: 10
    });
    const totem = await placeArmed({
      family: 'totem',
      definitionRef: auraDefRef,
      x: 725,
      y: 325,
      radiusFeet: 10
    });

    assert.equal(inscription.visibility, 'public');
    assert.equal(totem.visibility, 'public');

    // Public visibility lets non-owner observer inspect placements
    const observerList = await ack(observer, 'actor_placed_effect_list', { roomId: room.id });
    assert.equal(observerList.placements.length, 2);

    // Enemy creature enters inscription -> does NOT trigger because test rule says relationship: 'ally'
    await moveToken('enemyA', 525, 325);
    assert.deepEqual(actors.locate(live(), enemyA).token.state.conditions, []);

    // Ally PC moves from outside (125, 325) into inscription (525, 325) via committed character_moved
    const condPromise = once(observer, 'actor_consequence_accepted');
    observer.emit('character_moved', {
      roomId: room.id,
      tokenId: 'allyPc',
      characterId: 'c-ally',
      mapId: 'default',
      position: { x: 525, y: 325 },
      actionId: uuid()
    });
    await condPromise;
    await sleep(60);

    assert.equal(actors.locate(live(), allyPc).token.state.conditions.length, 1);

    // Placement remains armed (manual-only, NOT consumed like a trap)
    const listAfterAllyPc = await ack(gm, 'actor_placed_effect_list', { roomId: room.id });
    const insAfter = listAfterAllyPc.placements.find(p => p.placementId === inscription.placementId);
    assert.equal(insAfter.state, 'armed');

    // Leaving and re-entering while condition already active does not duplicate-stack
    observer.emit('character_moved', {
      roomId: room.id,
      tokenId: 'allyPc',
      characterId: 'c-ally',
      mapId: 'default',
      position: { x: 125, y: 325 },
      actionId: uuid()
    });
    await sleep(50);
    observer.emit('character_moved', {
      roomId: room.id,
      tokenId: 'allyPc',
      characterId: 'c-ally',
      mapId: 'default',
      position: { x: 525, y: 325 },
      actionId: uuid()
    });
    await sleep(80);
    assert.equal(actors.locate(live(), allyPc).token.state.conditions.length, 1);

    // Second ally (allyCreature) enters the totem placement and also stays non-consumed
    await moveToken('allyCreature', 725, 325);
    assert.equal(actors.locate(live(), allyCreature).token.state.conditions.length, 1);
    const listAfterSecond = await ack(gm, 'actor_placed_effect_list', { roomId: room.id });
    assert.equal(listAfterSecond.placements.find(p => p.placementId === inscription.placementId).state, 'armed');
    assert.equal(listAfterSecond.placements.find(p => p.placementId === totem.placementId).state, 'armed');
  });
});
