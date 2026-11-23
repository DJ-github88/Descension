'use strict';

const assert = require('assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { randomUUID: uuid } = require('crypto');

const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const installed = require('../services/installedAuthoredAbilities');
const relationships = require('../services/actorRelationships');
const placed = require('../services/placedEffect');
const roomAccessService = require('../services/roomAccessService');
const roomCheckpoint = require('../services/roomCheckpoint');
const pure = require('../shared/services/authoredAbility');
const placedTestPolicy = require('./helpers/placedEffectTestPolicy');

const once = (s, e) => new Promise(r => s.once(e, r));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ack = (s, e, d) => new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(Error(`ACK timeout for ${e}`)), 5000);
  s.emit(e, d, r => { clearTimeout(t); resolve(r); });
});

function buildConditionAbilityDraft({
  id = uuid(),
  name = 'Frost Snare',
  effect = 'movement',
  movementFeet = -10,
  drAmount = 2,
  label = 'Snared',
  passiveEntry = false,
  radiusFeet = 10
} = {}) {
  const authoredCondition = {
    profile: pure.EFFECT_CAPABILITY,
    effect,
    expiryPolicy: 'gm-manual',
    durationText: 'Until GM clears it',
    gmNote: 'Manual placement timing.'
  };
  if (effect === 'movement') {
    authoredCondition.movementFeet = movementFeet;
    authoredCondition.label = label;
  } else if (effect === 'damageReduction') {
    authoredCondition.drAmount = drAmount;
    authoredCondition.label = label;
  }

  const draft = passiveEntry
    ? {
        name,
        description: 'Passive entry fixture with radius locking.',
        level: 1,
        spellType: 'PASSIVE',
        typeConfig: { school: 'frost', tags: ['passive', 'control'], toggleable: false },
        effectTypes: ['control'],
        effectsMap: { control: true },
        controlConfig: { authoredCondition },
        targetingConfig: {
          targetingType: 'self_centered',
          rangeType: 'self_centered',
          rangeDistance: 0,
          targetRestrictions: ['enemy'],
          maxTargets: 1,
          selectionMethod: 'manual',
          targetSelectionMethod: 'manual',
          aoeShape: 'circle',
          aoeType: 'circle',
          aoeParameters: { radius: radiusFeet },
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
              id: pure.PASSIVE_ENTRY_TRIGGER_ID,
              category: 'movement',
              name: 'Moves Into Passive Radius',
              parameters: {}
            }]
          },
          effectTriggers: {},
          conditionalEffects: {},
          buffDebuffTriggers: {},
          requiredConditions: { enabled: false, logicType: 'AND', conditions: [] },
          triggerRole: { mode: 'CONDITIONAL' }
        }
      }
    : {
        name,
        description: 'Manual condition ability reusable by traps/inscriptions/totems.',
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

describe('Placed-effect foundation (placed-effect:v1) — production mode', function () {
  this.timeout(20000);

  let server, room, gm, owner, observer, writer, gmUid, ownerUid, observerUid;
  let pc, enemyA, pcAdmittedRef, passiveAdmittedRef, revokedAdmittedRef;

  const live = () => server.rooms.get(room.id);

  beforeEach(async () => {
    if (placedTestPolicy.isPolicySwapLoaderActive()) {
      placedTestPolicy.setArmedApprovedForTest(false);
    }

    writer = new FirebaseBatchWriter(60000, 50, {
      shouldPersist: () => true,
      persist: async () => ({ outcome: 'confirmed' })
    });
    server = createProductionStackServer({ firebaseBatchWriter: writer, debounceMs: 25 });
    await server.start();
    for (const e of [
      'actor_bind', 'actor_snapshot', 'actor_consequence', 'actor_authored_admit', 'actor_authored_revoke',
      'actor_placed_effect_list', 'actor_placed_effect_place', 'actor_placed_effect_remove',
      'actor_relationship_set', 'token_moved', 'character_moved'
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
    const jOwner = once(owner, 'room_joined');
    owner.emit('join_room', { roomId: room.id, playerName: 'owner', password: '' });
    await jOwner;

    observer = server.connect({ token: 'observer' });
    await once(observer, 'connect');
    const jObs = once(observer, 'room_joined');
    observer.emit('join_room', { roomId: room.id, playerName: 'observer', password: '' });
    await jObs;

    server.setCharacterOwner('c-pc', ownerUid);
    server.setCharacterOwner('c-obs', observerUid);
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
      position: { x: 125, y: 325 },
      character: {
        id: 'c-pc',
        name: 'Kaelen',
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

    map().characterTokens.obsPc = {
      id: 'obsPc',
      mapId: 'default',
      ownerUserId: observerUid,
      position: { x: 175, y: 325 },
      character: {
        id: 'c-obs',
        name: 'Borin',
        class: 'Fighter',
        health: { current: 30, max: 30 },
        mana: { current: 5, max: 5 },
        actionPoints: { current: 4, max: 4 }
      },
      state: { conditions: [] }
    };
    const obsBind = await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'obsPc', ownerUid: observerUid, characterId: 'c-obs' },
      snapshotHash: actors.hash(map().characterTokens.obsPc)
    });
    assert.equal(obsBind.success, true, JSON.stringify(obsBind));

    map().tokens.enemyA = {
      id: 'enemyA',
      name: 'Bog Stalker',
      mapId: 'default',
      creatureId: 'stalker',
      position: { x: 225, y: 325 },
      stats: { maxHp: 30, maxMana: 0, maxAP: 4, speed: 30 },
      state: { currentHp: 30, currentMana: 0, currentActionPoints: 4, conditions: [] }
    };
    enemyA = (await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'enemyA' },
      snapshotHash: actors.hash(map().tokens.enemyA)
    })).ref;

    const rel = await ack(gm, 'actor_relationship_set', {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence,
      expectedRelationshipRevision: relationships.revision(live()),
      pairs: [{ a: pc, b: enemyA }],
      value: 'enemy'
    });
    assert.equal(rel.success, true, JSON.stringify(rel));

    const admit1 = await ack(gm, 'actor_authored_admit', {
      roomId: room.id,
      requestId: uuid(),
      expectedRegistryRevision: installed.registry(live()).revision,
      definitionVersion: 1,
      record: buildConditionAbilityDraft({ name: 'Frost Snare', effect: 'movement', movementFeet: -10 }),
      classId: 'arcanoneer'
    });
    assert.equal(admit1.success, true, JSON.stringify(admit1));
    pcAdmittedRef = admit1.definitionRef;

    const admit2 = await ack(gm, 'actor_authored_admit', {
      roomId: room.id,
      requestId: uuid(),
      expectedRegistryRevision: installed.registry(live()).revision,
      definitionVersion: 1,
      record: buildConditionAbilityDraft({ name: 'Radius Ward', passiveEntry: true, effect: 'movement', movementFeet: -10, radiusFeet: 10 }),
      classId: 'shaper'
    });
    assert.equal(admit2.success, true, JSON.stringify(admit2));
    passiveAdmittedRef = admit2.definitionRef;

    const admit3 = await ack(gm, 'actor_authored_admit', {
      roomId: room.id,
      requestId: uuid(),
      expectedRegistryRevision: installed.registry(live()).revision,
      definitionVersion: 1,
      record: buildConditionAbilityDraft({ name: 'Revoked Rune', effect: 'damageReduction', drAmount: 2, label: 'Revoked Ward' }),
      classId: 'shaper'
    });
    assert.equal(admit3.success, true, JSON.stringify(admit3));
    revokedAdmittedRef = admit3.definitionRef;
    const revRes = await ack(gm, 'actor_authored_revoke', {
      roomId: room.id,
      requestId: uuid(),
      expectedRegistryRevision: installed.registry(live()).revision,
      definitionRef: revokedAdmittedRef
    });
    assert.equal(revRes.success, true, JSON.stringify(revRes));
  });

  afterEach(async () => {
    gm?.disconnect();
    owner?.disconnect();
    observer?.disconnect();
    await server?.stop();
  });

  after(() => {
    if (placedTestPolicy.isPolicySwapLoaderActive()) {
      placedTestPolicy.resetPolicyForTest();
    }
  });

  it('ships fail-closed policy with byte-identical client/server mirror and creatorApproval null', () => {
    const clientPath = path.resolve(__dirname, '../../vtt-react/src/services/placedEffectPolicy.js');
    const serverPath = path.resolve(__dirname, '../shared/services/placedEffectPolicy.js');
    const clientSrc = fs.readFileSync(clientPath, 'utf8');
    const serverSrc = fs.readFileSync(serverPath, 'utf8');
    assert.equal(clientSrc, serverSrc, 'client and server shared placedEffectPolicy.js must be identical');

    const sandbox = { module: { exports: {} }, exports: {}, Object };
    vm.runInNewContext(serverSrc, sandbox, { filename: serverPath });
    const shipped = sandbox.module.exports;
    assert.equal(shipped.POLICY.creatorApproval, null);
    assert.equal(shipped.armedApproved(), false);
    assert.equal(shipped.activeRules().armedAllowed, false);
  });

  it('supports ordinary GM placement bound to room, map location, owner, definition version, and family across reconnect', async () => {
    const families = ['placed', 'trap', 'inscription', 'totem'];
    let expectedRevision = 0;

    for (const family of families) {
      const ownerNotice = once(owner, 'actor_placed_effect_changed');
      const res = await ack(gm, 'actor_placed_effect_place', {
        version: 1,
        roomId: room.id,
        requestId: uuid(),
        expectedRevision,
        owner: pc,
        definitionRef: pcAdmittedRef,
        family,
        armed: false,
        location: {
          mapId: 'default',
          position: { x: 425, y: 325 },
          radiusFeet: 10
        }
      });
      assert.equal(res.success, true, JSON.stringify(res));
      assert.equal(res.placement.family, family);
      assert.equal(res.placement.state, 'placed');
      assert.equal(res.placement.armed, false);
      assert.equal(res.placement.location.mapId, 'default');
      assert.deepEqual(res.placement.location.position, { x: 425, y: 325 });
      assert.equal(res.placement.location.radiusFeet, 10);
      assert.deepEqual(res.placement.location.gridSnapshot, {
        gridType: 'square',
        gridSize: 50,
        feetPerTile: 5,
        offsetX: 0,
        offsetY: 0
      });
      assert.deepEqual(res.placement.owner, pc);
      assert.deepEqual(res.placement.definitionRef, pcAdmittedRef);
      assert.equal(res.placement.gmUid, gmUid);
      assert.equal(res.armingApproved, false);
      assert.equal(res.executableClaim, false);

      const noticed = await ownerNotice;
      assert.equal(noticed.roomId, room.id);
      expectedRevision = res.revision;
    }

    // Visibility scoping: GM & owner see all 4; unrelated observer sees none; raw gameState projection scrubs ledger.
    const gmList = await ack(gm, 'actor_placed_effect_list', { roomId: room.id });
    assert.equal(gmList.success, true);
    assert.equal(gmList.placements.length, 4);

    const ownerList = await ack(owner, 'actor_placed_effect_list', { roomId: room.id });
    assert.equal(ownerList.success, true);
    assert.equal(ownerList.placements.length, 4);
    assert.equal(ownerList.placements[0].gmUid, undefined, 'gmUid must not leak to non-GM');

    const observerList = await ack(observer, 'actor_placed_effect_list', { roomId: room.id });
    assert.equal(observerList.success, true);
    assert.deepEqual(observerList.placements, []);

    const clientState = roomAccessService.projectGameStateForClient(live(), { uid: ownerUid, isGM: false });
    assert.equal(Object.prototype.hasOwnProperty.call(clientState, placed.LEDGER_KEY), false);

    // Owner reconnect recovers exact placements cleanly.
    owner.disconnect();
    const ownerReconnected = server.connect({ token: 'owner' });
    await once(ownerReconnected, 'connect');
    const joined = once(ownerReconnected, 'room_joined');
    ownerReconnected.emit('join_room', { roomId: room.id, playerName: 'owner', password: '' });
    await joined;
    owner = ownerReconnected;

    const afterReconnect = await ack(ownerReconnected, 'actor_placed_effect_list', { roomId: room.id });
    assert.equal(afterReconnect.success, true);
    assert.equal(afterReconnect.placements.length, 4);
    assert.deepEqual(
      afterReconnect.placements.map(p => ({ id: p.placementId, family: p.family, pos: p.location.position })),
      gmList.placements.map(p => ({ id: p.placementId, family: p.family, pos: p.location.position }))
    );

    // Canonical checkpoint serialization -> decode -> hydrate recovery into a fresh room instance.
    const docs = roomCheckpoint.buildCheckpointDocuments({
      roomId: room.id,
      gameState: live().gameState,
      revision: 1,
      serverTimestamp: () => ({ __ts: 1 }),
      deleteField: () => ({ __del: true })
    });
    assert.equal(docs.ok, true, JSON.stringify(docs));
    const mapDocsById = Object.fromEntries(docs.maps.map(m => [m.mapId, m.data]));
    const decoded = roomCheckpoint.decodeCanonicalCheckpoint({
      checkpoint: docs.manifest,
      globalDoc: docs.global.data,
      mapDocsById
    });
    assert.equal(decoded.ok, true, JSON.stringify(decoded));
    const hydratedGameState = roomCheckpoint.hydrateSnapshotToGameState(decoded);
    assert.equal(hydratedGameState[placed.LEDGER_KEY].placements.length, 4);
  });

  it('refuses non-GM placement, unbound/creature owner, revoked or unadmitted definitions, radius mismatch, armed flag when unapproved, and conflicting requestId', async () => {
    const nonGm = await ack(owner, 'actor_placed_effect_place', {
      version: 1,
      roomId: room.id,
      requestId: uuid(),
      expectedRevision: 0,
      owner: pc,
      definitionRef: pcAdmittedRef,
      family: 'trap',
      armed: false,
      location: { mapId: 'default', position: { x: 425, y: 325 }, radiusFeet: 10 }
    });
    assert.equal(nonGm.success, false);
    assert.equal(nonGm.code, 'forbidden');

    const armedAttempt = await ack(gm, 'actor_placed_effect_place', {
      version: 1,
      roomId: room.id,
      requestId: uuid(),
      expectedRevision: 0,
      owner: pc,
      definitionRef: pcAdmittedRef,
      family: 'trap',
      armed: true,
      location: { mapId: 'default', position: { x: 425, y: 325 }, radiusFeet: 10 }
    });
    assert.equal(armedAttempt.success, false);
    assert.equal(armedAttempt.code, 'placed_effect_arming_unapproved');

    const creatureOwner = await ack(gm, 'actor_placed_effect_place', {
      version: 1,
      roomId: room.id,
      requestId: uuid(),
      expectedRevision: 0,
      owner: enemyA,
      definitionRef: pcAdmittedRef,
      family: 'trap',
      armed: false,
      location: { mapId: 'default', position: { x: 425, y: 325 }, radiusFeet: 10 }
    });
    assert.equal(creatureOwner.success, false);
    assert.equal(creatureOwner.code, 'unsupported_placed_owner');

    const revoked = await ack(gm, 'actor_placed_effect_place', {
      version: 1,
      roomId: room.id,
      requestId: uuid(),
      expectedRevision: 0,
      owner: pc,
      definitionRef: revokedAdmittedRef,
      family: 'inscription',
      armed: false,
      location: { mapId: 'default', position: { x: 425, y: 325 }, radiusFeet: 10 }
    });
    assert.equal(revoked.success, false);
    assert.equal(revoked.code, 'definition_revoked');

    const badRadius = await ack(gm, 'actor_placed_effect_place', {
      version: 1,
      roomId: room.id,
      requestId: uuid(),
      expectedRevision: 0,
      owner: pc,
      definitionRef: passiveAdmittedRef,
      family: 'inscription',
      armed: false,
      location: { mapId: 'default', position: { x: 425, y: 325 }, radiusFeet: 20 }
    });
    assert.equal(badRadius.success, false);
    assert.equal(badRadius.code, 'placement_radius_mismatch');

    // Idempotent replay vs conflict on same requestId.
    const reqId = uuid();
    const first = await ack(gm, 'actor_placed_effect_place', {
      version: 1,
      roomId: room.id,
      requestId: reqId,
      expectedRevision: 0,
      owner: pc,
      definitionRef: pcAdmittedRef,
      family: 'totem',
      armed: false,
      location: { mapId: 'default', position: { x: 425, y: 325 }, radiusFeet: 10 }
    });
    assert.equal(first.success, true);
    assert.equal(first.replayed, false);

    const replay = await ack(gm, 'actor_placed_effect_place', {
      version: 1,
      roomId: room.id,
      requestId: reqId,
      expectedRevision: 0,
      owner: pc,
      definitionRef: pcAdmittedRef,
      family: 'totem',
      armed: false,
      location: { mapId: 'default', position: { x: 425, y: 325 }, radiusFeet: 10 }
    });
    assert.equal(replay.success, true);
    assert.equal(replay.replayed, true);
    assert.equal(replay.placements.length, 1);

    const conflict = await ack(gm, 'actor_placed_effect_place', {
      version: 1,
      roomId: room.id,
      requestId: reqId,
      expectedRevision: 0,
      owner: pc,
      definitionRef: pcAdmittedRef,
      family: 'totem',
      armed: false,
      location: { mapId: 'default', position: { x: 475, y: 325 }, radiusFeet: 10 }
    });
    assert.equal(conflict.success, false);
    assert.equal(conflict.code, 'REQUEST_ID_CONFLICT');
  });

  it('does not trigger unarmed placement on creature movement and allows ordinary GM removal across reconnect', async () => {
    const placedRes = await ack(gm, 'actor_placed_effect_place', {
      version: 1,
      roomId: room.id,
      requestId: uuid(),
      expectedRevision: 0,
      owner: pc,
      definitionRef: pcAdmittedRef,
      family: 'trap',
      armed: false,
      location: { mapId: 'default', position: { x: 425, y: 325 }, radiusFeet: 10 }
    });
    assert.equal(placedRes.success, true);
    const placementId = placedRes.placement.placementId;

    // Move enemy from outside (225, 325) directly onto placement center (425, 325)
    gm.emit('token_moved', {
      roomId: room.id,
      tokenId: 'enemyA',
      mapId: 'default',
      position: { x: 425, y: 325 },
      actionId: uuid()
    });
    await sleep(140);

    const enemyAfterMove = actors.locate(live(), enemyA).token;
    assert.deepEqual(enemyAfterMove.state.conditions, [], 'unarmed placed effect must never apply conditions');
    const listAfterMove = await ack(gm, 'actor_placed_effect_list', { roomId: room.id });
    assert.equal(listAfterMove.placements[0].state, 'placed');

    // Ordinary GM removal
    const ownerChanged = once(owner, 'actor_placed_effect_changed');
    let observerGotChange = false;
    observer.once('actor_placed_effect_changed', () => { observerGotChange = true; });

    const removed = await ack(gm, 'actor_placed_effect_remove', {
      version: 1,
      roomId: room.id,
      requestId: uuid(),
      expectedRevision: placedRes.revision,
      placementId
    });
    assert.equal(removed.success, true, JSON.stringify(removed));
    assert.equal(removed.placementId, placementId);
    assert.deepEqual(removed.placements, []);
    await ownerChanged;
    await sleep(40);
    assert.equal(observerGotChange, false, 'observer should not receive change ping for owner-and-gm trap');

    // Reconnect stays removed
    gm.disconnect();
    gm = server.connect({ token: 'gm' });
    await once(gm, 'connect');
    const joinedGm = once(gm, 'room_joined');
    gm.emit('join_room', { roomId: room.id, playerName: 'gm', password: '' });
    await joinedGm;
    const afterReconnect = await ack(gm, 'actor_placed_effect_list', { roomId: room.id });
    assert.deepEqual(afterReconnect.placements, []);
  });
});
