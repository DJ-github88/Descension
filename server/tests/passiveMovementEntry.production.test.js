const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const installed = require('../services/installedAuthoredAbilities');
const definitions = require('../services/installedDefinitionRegistry');
const relationships = require('../services/actorRelationships');
const pure = require('../../vtt-react/src/services/authoredAbility');
const profile = require('../../vtt-react/src/services/sharedConditionProfile');

const once = (s, e) => new Promise(r => s.once(e, r));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ack = (s, e, d) => new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(Error(`ACK timeout for ${e}`)), 5000);
  s.emit(e, d, r => { clearTimeout(t); resolve(r); });
});

function buildPassiveRecord({
  id = uuid(),
  name = 'Frost Ward Aura',
  radius = 10,
  restriction = 'enemy',
  effect = 'movement',
  movementFeet = -10,
  attribute = 'agility',
  attributeAmount = -2,
  drAmount = 3,
  label = 'Frost Slow',
  extra
} = {}) {
  const authoredCondition = {
    profile: pure.EFFECT_CAPABILITY,
    effect,
    expiryPolicy: 'gm-manual',
    durationText: 'Until the GM clears it',
    gmNote: 'Triggered when a matching actor moves into the passive radius.'
  };
  if (effect === 'movement') {
    authoredCondition.movementFeet = movementFeet;
    authoredCondition.label = label;
  } else if (effect === 'attribute') {
    authoredCondition.attribute = attribute;
    authoredCondition.attributeAmount = attributeAmount;
    authoredCondition.label = label;
  } else if (effect === 'damageReduction') {
    authoredCondition.drAmount = drAmount;
    authoredCondition.label = label;
  }

  const draft = {
    name,
    description: 'While active, enemies entering radius suffer the authored effect.',
    level: 1,
    spellType: 'PASSIVE',
    typeConfig: { school: 'rime', tags: ['passive', 'control'], toggleable: false },
    effectTypes: ['control'],
    effectsMap: { control: true },
    controlConfig: { authoredCondition },
    targetingConfig: {
      targetingType: 'self_centered',
      rangeType: 'self_centered',
      rangeDistance: 0,
      targetRestrictions: [restriction],
      maxTargets: 1,
      selectionMethod: 'manual',
      targetSelectionMethod: 'manual',
      aoeShape: 'circle',
      aoeType: 'circle',
      aoeParameters: { radius },
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
  };
  if (extra) extra(draft);
  return {
    ...actors.clone(draft),
    authoredDraft: actors.clone(draft),
    authoredDefinitionId: id,
    serializedData: JSON.stringify(draft)
  };
}

describe('Authored passive movement-entry ability — production handlers & MovementDebouncer', function() {
  this.timeout(20000);
  let server, room, gm, owner, observer, writer, ownerUid, enemyPcUid;
  let pc, enemyA, enemyB, allyA, neutralA, enemyPc;

  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer, debounceMs: 20 });
    await server.start();
    for (const e of [
      'actor_bind', 'actor_snapshot', 'actor_consequence', 'actor_authored_admit',
      'actor_passive_list', 'actor_passive_activate', 'actor_passive_revoke',
      'actor_relationship_set', 'token_moved', 'character_moved'
    ]) {
      server.setEventLimits(e, { maxPerMinute: 4000, maxPerSecond: 4000 });
    }
    const gmUid = server.nextUserId();
    ownerUid = server.nextUserId();
    enemyPcUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid);
    server.registerAuthToken('owner', ownerUid);
    server.registerAuthToken('enemyOwner', enemyPcUid);
    server.registerAuthToken('observer', server.nextUserId());

    gm = server.connect({ token: 'gm' });
    await once(gm, 'connect');
    room = await server.seedRoom(gm.id, { gmUserId: gmUid });

    owner = server.connect({ token: 'owner' });
    await once(owner, 'connect');
    const j1 = once(owner, 'room_joined');
    owner.emit('join_room', { roomId: room.id, playerName: 'owner', password: '' });
    await j1;

    const enemyClient = server.connect({ token: 'enemyOwner' });
    await once(enemyClient, 'connect');
    const j2 = once(enemyClient, 'room_joined');
    enemyClient.emit('join_room', { roomId: room.id, playerName: 'enemyOwner', password: '' });
    await j2;

    observer = enemyClient;
    server.setCharacterOwner('c-pc', ownerUid);
    server.setCharacterOwner('c-enemy-pc', enemyPcUid);

    const map = () => room.gameState.maps.default;
    map().gridType = 'square';
    map().gridSize = 50;
    map().feetPerTile = 5;
    map().gridOffsetX = 0;
    map().gridOffsetY = 0;

    // Owner PC at cell (4, 6) center = (225, 325)
    map().characterTokens.pc = {
      id: 'pc',
      mapId: 'default',
      ownerUserId: ownerUid,
      position: { x: 225, y: 325 },
      character: { id: 'c-pc', name: 'Ilse', class: 'Arcanoneer', health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, skillRanks: { perception: 'NOVICE' } },
      state: { conditions: [] }
    };
    pc = (await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'c-pc' },
      snapshotHash: actors.hash(map().characterTokens.pc)
    })).ref;

    // Enemy PC at cell (8, 5) center = (425, 275)
    map().characterTokens.enemyPc = {
      id: 'enemyPc',
      mapId: 'default',
      ownerUserId: enemyPcUid,
      position: { x: 425, y: 275 },
      character: { id: 'c-enemy-pc', name: 'Rival', class: 'Berserker', health: { current: 20, max: 30 }, mana: { current: 0, max: 0 }, actionPoints: { current: 4, max: 4 } },
      state: { conditions: [] }
    };
    enemyPc = (await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'enemyPc', ownerUid: enemyPcUid, characterId: 'c-enemy-pc' },
      snapshotHash: actors.hash(map().characterTokens.enemyPc)
    })).ref;

    const placements = [
      ['enemyA', { x: 425, y: 325 }],   // 20 ft east
      ['enemyB', { x: 475, y: 325 }],   // 25 ft east
      ['allyA', { x: 425, y: 375 }],    // 20+ ft SE
      ['neutralA', { x: 425, y: 225 }]  // 20+ ft NE
    ];
    const bound = {};
    for (const [id, position] of placements) {
      const t = {
        id,
        name: id,
        mapId: 'default',
        creatureId: 'test-creature',
        position,
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
    enemyB = bound.enemyB;
    allyA = bound.allyA;
    neutralA = bound.neutralA;

    await setRel([enemyA, enemyB, enemyPc], 'enemy');
    await setRel([allyA], 'ally');
  });

  afterEach(async() => {
    gm.disconnect();
    owner.disconnect();
    observer.disconnect();
    await server.stop();
  });

  const live = () => server.rooms.get(room.id);
  const locate = ref => actors.locate(live(), ref).token;

  async function setRel(targets, value) {
    const r = await ack(gm, 'actor_relationship_set', {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence,
      expectedRelationshipRevision: relationships.revision(live()),
      pairs: targets.map(b => ({ a: pc, b })),
      value
    });
    assert.equal(r.success, true, JSON.stringify(r));
  }

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

  async function moveCreature(tokenId, position, { actionId = uuid(), movementKind, isTeleport, forcedMovement } = {}) {
    gm.emit('token_moved', {
      roomId: room.id,
      mapId: 'default',
      tokenId,
      position,
      actionId,
      ...(movementKind ? { movementKind } : {}),
      ...(isTeleport !== undefined ? { isTeleport } : {}),
      ...(forcedMovement !== undefined ? { forcedMovement } : {})
    });
    await sleep(65);
  }

  it('compiles Wizard-shaped passives across effect families while keeping unrelated passives rejected', () => {
    for (const cfg of [
      { effect: 'movement', movementFeet: -10, label: 'Frost Slow' },
      { effect: 'stunned' },
      { effect: 'attribute', attribute: 'agility', attributeAmount: -2, label: 'Chilled Reflexes' },
      { effect: 'damageReduction', drAmount: 4, label: 'Rime Ward' }
    ]) {
      const rec = buildPassiveRecord(cfg);
      const out = pure.definitionFromWizard(rec, { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' });
      assert.equal(out.ok, true, out.reason);
      assert.equal(out.definition.capability, pure.PASSIVE_ENTRY_CAPABILITY);
      assert.equal(out.definition.targeting.kind, 'self_centered_radius');
      const compiled = definitions.compileDefinition(out.definition);
      assert.equal(compiled.ok, true, JSON.stringify(compiled));
      assert.equal(compiled.descriptor.compilerVersion, pure.PASSIVE_ENTRY_COMPILER);
    }

    // Existing PASSIVE regression check: no moves_into_radius trigger still fails with Immediate ACTION required
    const noTrigger = buildPassiveRecord();
    delete noTrigger.triggerConfig.global.compoundTriggers;
    noTrigger.triggerConfig.global.compoundTriggers = [];
    noTrigger.authoredDraft.triggerConfig.global.compoundTriggers = [];
    noTrigger.serializedData = JSON.stringify(noTrigger.authoredDraft);
    const rejected = pure.definitionFromWizard(noTrigger, { roomId: 'r', definitionVersion: 1, classId: 'arcanoneer' });
    assert.equal(rejected.ok, false);
    assert.match(rejected.reason, /^Immediate ACTION required:/);
  });

  it('enforces GM-only activation, fires on outside->inside enemy move, ignores allies/neutrals and inside->inside moves, deduplicates replays, and updates trigger boundary on radius edit', async() => {
    const defId = uuid();
    const recV1 = buildPassiveRecord({ id: defId, radius: 10, restriction: 'enemy', effect: 'movement', movementFeet: -10, label: 'Frost Slow' });
    const refV1 = await admitPassive(recV1, 1);

    // Saved/admitted passive does NOT fire before explicit GM activation
    await moveCreature('enemyA', { x: 325, y: 325 });
    assert.equal(locate(enemyA).state.conditions.length, 0);
    await moveCreature('enemyA', { x: 425, y: 325 });

    // Non-GM cannot activate
    const denied = await activateAuthored(refV1, owner);
    assert.equal(denied.success, false);
    assert.equal(denied.code, 'forbidden');

    // GM activates v1 (10 ft radius, enemy, -10 ft Frost Slow)
    const acceptedEvents = [];
    gm.on('actor_consequence_accepted', payload => acceptedEvents.push(payload));

    const actRes = await activateAuthored(refV1, gm);
    assert.equal(actRes.success, true, JSON.stringify(actRes));
    const v1ActivationId = actRes.activation.activationId;

    // Outside (425, 325 -> 20 ft) -> Inside (325, 325 -> 10 ft): FIRES once
    const firstEntryActionId = `move-entry-${uuid()}`;
    await moveCreature('enemyA', { x: 325, y: 325 }, { actionId: firstEntryActionId });
    assert.equal(locate(enemyA).state.conditions.length, 1);
    assert.equal(locate(enemyA).state.conditions[0].name, 'Frost Slow');
    assert.equal(locate(enemyA).state.conditions[0].effects.movementSpeed, -10);
    assert.equal(acceptedEvents.length, 1);

    // Ally crossing exact same boundary (425, 375) -> (325, 325): DOES NOT FIRE
    await moveCreature('allyA', { x: 325, y: 325 });
    assert.equal(locate(allyA).state.conditions.length, 0);
    assert.equal(acceptedEvents.length, 1);

    // Neutral crossing same boundary: DOES NOT FIRE
    await moveCreature('neutralA', { x: 325, y: 325 });
    assert.equal(locate(neutralA).state.conditions.length, 0);
    assert.equal(acceptedEvents.length, 1);

    // Enemy moving entirely INSIDE (325, 325 -> 275, 325, i.e. 10 ft -> 5 ft): DOES NOT FIRE
    await moveCreature('enemyA', { x: 275, y: 325 });
    assert.equal(locate(enemyA).state.conditions.length, 1);
    assert.equal(acceptedEvents.length, 1);

    // Replay same movement at destination AND even after stepping outside: DOES NOT FIRE twice
    await moveCreature('enemyA', { x: 325, y: 325 }, { actionId: firstEntryActionId });
    assert.equal(acceptedEvents.length, 1);
    await moveCreature('enemyA', { x: 425, y: 325 }); // move outside
    await moveCreature('enemyA', { x: 325, y: 325 }, { actionId: firstEntryActionId }); // replay exact same movementId
    assert.equal(locate(enemyA).state.conditions.length, 1);
    assert.equal(acceptedEvents.length, 1);

    // Move enemyB from 25 ft (475, 325) to 15 ft (375, 325): outside 10 ft radius -> DOES NOT FIRE
    await moveCreature('enemyB', { x: 375, y: 325 });
    assert.equal(locate(enemyB).state.conditions.length, 0);
    assert.equal(acceptedEvents.length, 1);
    await moveCreature('enemyB', { x: 475, y: 325 }); // step back to 25 ft

    // Change radius in Wizard -> 20 ft, save, admit v2, revoke v1, activate v2
    const recV2 = buildPassiveRecord({ id: defId, radius: 20, restriction: 'enemy', effect: 'movement', movementFeet: -10, label: 'Frost Slow' });
    const refV2 = await admitPassive(recV2, 2);
    const revokeRes = await ack(gm, 'actor_passive_revoke', {
      version: 1,
      roomId: room.id,
      requestId: uuid(),
      expectedRevision: live().gameState.passiveLedger.revision,
      activationId: v1ActivationId
    });
    assert.equal(revokeRes.success, true, JSON.stringify(revokeRes));
    const actV2 = await activateAuthored(refV2, gm);
    assert.equal(actV2.success, true, JSON.stringify(actV2));

    // Now move enemyB from 25 ft (475, 325) to 15 ft (375, 325): inside 20 ft radius -> FIRES!
    await moveCreature('enemyB', { x: 375, y: 325 });
    assert.equal(locate(enemyB).state.conditions.length, 1);
    assert.equal(locate(enemyB).state.conditions[0].name, 'Frost Slow');
    assert.equal(acceptedEvents.length, 2);

    // Shrink radius v2 -> v3 = 5 ft and prove 10 ft cell (325, 325) no longer fires on a fresh enemy
    const recV3 = buildPassiveRecord({ id: defId, radius: 5, restriction: 'enemy', effect: 'movement', movementFeet: -10, label: 'Frost Slow' });
    const refV3 = await admitPassive(recV3, 3);
    await ack(gm, 'actor_passive_revoke', {
      version: 1,
      roomId: room.id,
      requestId: uuid(),
      expectedRevision: live().gameState.passiveLedger.revision,
      activationId: actV2.activation.activationId
    });
    const actV3 = await activateAuthored(refV3, gm);
    assert.equal(actV3.success, true);

    await setRel([neutralA], 'enemy');
    await moveCreature('neutralA', { x: 425, y: 225 });
    await moveCreature('neutralA', { x: 325, y: 325 }); // 10 ft cell is outside 5 ft radius!
    assert.equal(locate(neutralA).state.conditions.length, 0);
    await moveCreature('neutralA', { x: 275, y: 325 }); // 5 ft cell IS inside 5 ft radius -> FIRES!
    assert.equal(locate(neutralA).state.conditions.length, 1);
  });

  it('keeps teleport, forced movement, and re-entry unsettled/open and supports character_moved', async() => {
    const stunRec = buildPassiveRecord({ radius: 15, restriction: 'enemy', effect: 'stunned' });
    const stunRef = await admitPassive(stunRec, 1);
    const actRes = await activateAuthored(stunRef, gm);
    assert.equal(actRes.success, true);

    // Teleport across boundary does not auto-fire
    await moveCreature('enemyA', { x: 325, y: 325 }, { isTeleport: true, movementKind: 'teleport' });
    assert.equal(locate(enemyA).state.conditions.length, 0);
    await moveCreature('enemyA', { x: 425, y: 325 }, { isTeleport: true });

    // Forced movement across boundary does not auto-fire
    await moveCreature('enemyB', { x: 325, y: 325 }, { forcedMovement: true, movementKind: 'forced' });
    assert.equal(locate(enemyB).state.conditions.length, 0);

    // Intermediate dragging frame on character_moved does not fire; drop frame fires Stunned on enemyPc
    observer.emit('character_moved', {
      roomId: room.id,
      mapId: 'default',
      tokenId: 'enemyPc',
      characterId: 'c-enemy-pc',
      position: { x: 325, y: 275 },
      isDragging: true,
      actionId: `drag-${uuid()}`
    });
    await sleep(40);
    assert.equal(locate(enemyPc).state.conditions.length, 0);

    // Normal character_moved drop across boundary (outside -> inside 15 ft) FIRES!
    const acceptedOnOwner = once(owner, 'actor_consequence_accepted');
    observer.emit('character_moved', {
      roomId: room.id,
      mapId: 'default',
      tokenId: 'enemyPc',
      characterId: 'c-enemy-pc',
      position: { x: 325, y: 325 },
      isDragging: false,
      actionId: `drop-${uuid()}`
    });
    const broadcast = await acceptedOnOwner;
    assert.equal(locate(enemyPc).state.conditions.length, 1);
    assert.equal(profile.isStunned(locate(enemyPc).state.conditions[0]), true);
    assert.equal(broadcast.success, true);

    // Re-entry while condition is active (on normal creature movement): does not stack/duplicate
    await moveCreature('enemyA', { x: 325, y: 325 });
    assert.equal(locate(enemyA).state.conditions.length, 1);
    await moveCreature('enemyA', { x: 425, y: 325 });
    await moveCreature('enemyA', { x: 325, y: 325 });
    assert.equal(locate(enemyA).state.conditions.length, 1);

    // Revoking stops future triggers
    await ack(gm, 'actor_passive_revoke', {
      version: 1,
      roomId: room.id,
      requestId: uuid(),
      expectedRevision: live().gameState.passiveLedger.revision,
      activationId: actRes.activation.activationId
    });
    await moveCreature('neutralA', { x: 425, y: 225 });
    await setRel([neutralA], 'enemy');
    await moveCreature('neutralA', { x: 325, y: 325 });
    assert.equal(locate(neutralA).state.conditions.length, 0);
  });
});
