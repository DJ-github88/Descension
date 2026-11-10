const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const ack = (s, event, data) => new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(Error(event)), 5000);
  s.emit(event, data, r => { clearTimeout(t); resolve(r); });
});
const once = (s, event) => new Promise(resolve => s.once(event, resolve));

describe('Combat Initiation: Authoritative Roster with Player Characters and Placed Creatures', function() {
  this.timeout(20000);
  let server, room, gm, owner, observer, writer;
  let pcRef, foeA, foeB;
  let gmUid, ownerUid, observerUid;

  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer });
    await server.start();
    for (const e of ['actor_bind', 'combat_started', 'combat_ended', 'combat_turn_changed', 'actor_turn_boundary', 'join_room']) {
      server.setEventLimits(e, { maxPerMinute: 2000, maxPerSecond: 2000 });
    }
    gmUid = server.nextUserId();
    ownerUid = server.nextUserId();
    observerUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid);
    server.registerAuthToken('owner', ownerUid);
    server.registerAuthToken('observer', observerUid);

    gm = server.connect({ token: 'gm' }); await once(gm, 'connect');
    room = await server.seedRoom(gm.id, { gmUserId: gmUid });

    owner = server.connect({ token: 'owner' }); await once(owner, 'connect');
    const joinedOwner = once(owner, 'room_joined');
    owner.emit('join_room', { roomId: room.id, playerName: 'owner', password: '' });
    await joinedOwner;

    observer = server.connect({ token: 'observer' }); await once(observer, 'connect');
    const joinedObserver = once(observer, 'room_joined');
    observer.emit('join_room', { roomId: room.id, playerName: 'observer', password: '' });
    await joinedObserver;

    server.setCharacterOwner('ilse', ownerUid);
    const map = room.gameState.maps.default;
    map.tokens.foeA = {
      id: 'foeA',
      name: 'Grimmstalk Alpha',
      stats: { maxHp: 80, maxMana: 20, maxAP: 4, agility: 14 },
      state: { currentHp: 65, currentMana: 20, currentActionPoints: 3, tempHealth: 4, conditions: [] }
    };
    map.tokens.foeB = {
      id: 'foeB',
      name: 'Grimmstalk Beta',
      stats: { maxHp: 60, maxMana: 0, maxAP: 4, agility: 12 },
      state: { currentHp: 50, currentMana: 0, currentActionPoints: 4, tempHealth: 0, conditions: [] }
    };
    map.characterTokens.pc = {
      id: 'pc',
      ownerUserId: ownerUid,
      character: {
        id: 'ilse',
        name: 'Ilse',
        class: 'Arcanoneer',
        level: 3,
        stats: { agility: 16, intelligence: 18 },
        health: { current: 28, max: 40 },
        mana: { current: 25, max: 30 },
        actionPoints: { current: 3, max: 5 },
        tempHealth: 2,
        tempMana: 0,
        tempActionPoints: 1
      },
      state: { conditions: [] }
    };

    foeA = (await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'foeA' },
      snapshotHash: actors.hash(map.tokens.foeA)
    })).ref;

    foeB = (await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'foeB' },
      snapshotHash: actors.hash(map.tokens.foeB)
    })).ref;

    pcRef = (await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid: ownerUid, characterId: 'ilse' },
      snapshotHash: actors.hash(map.characterTokens.pc)
    })).ref;
  });

  afterEach(async() => {
    gm?.disconnect();
    owner?.disconnect();
    observer?.disconnect();
    await server?.stop();
  });

  it('1. eligible exact primary PC and two placed creatures start combat with authoritative roster and applied resources', async() => {
    const ownerStartedPromise = once(owner, 'combat_started');
    const observerStartedPromise = once(observer, 'combat_started');

    const proposedTurnOrder = [
      { tokenId: 'pc', actorRef: pcRef, name: 'Ilse', initiative: 18, isCharacterToken: true },
      { tokenId: 'foeA', actorRef: foeA, name: 'Grimmstalk Alpha', initiative: 15 },
      { tokenId: 'foeB', actorRef: foeB, name: 'Grimmstalk Beta', initiative: 10 }
    ];

    const result = await ack(gm, 'combat_started', {
      roomId: room.id,
      turnOrder: proposedTurnOrder,
      currentTurnIndex: 0,
      round: 1
    });

    assert.equal(result.success, true, 'combat_started succeeded for GM');
    const combat = room.gameState.combat;
    assert.equal(combat.isActive, true, 'combat is active');
    assert.equal(combat.turnOrder.length, 3, 'authoritative turnOrder has 3 combatants');

    const pcCombatant = combat.turnOrder.find(c => c.tokenId === 'pc');
    assert.ok(pcCombatant, 'PC is present in turnOrder');
    assert.equal(pcCombatant.resourceConsequenceStatus, 'applied', 'PC resources are applied');
    assert.equal(pcCombatant.currentActionPoints, 3, 'authoritative PC AP loaded from character');
    assert.equal(pcCombatant.currentHp, 28, 'authoritative PC HP loaded from character');
    assert.equal(pcCombatant.currentMana, 25, 'authoritative PC mana loaded from character');
    assert.deepEqual(pcCombatant.actorRef, pcRef, 'actorRef matches bound PC');

    const foeACombatant = combat.turnOrder.find(c => c.tokenId === 'foeA');
    assert.ok(foeACombatant, 'foeA is present');
    assert.equal(foeACombatant.resourceConsequenceStatus, 'applied');
    assert.equal(foeACombatant.currentActionPoints, 3);
    assert.equal(foeACombatant.currentHp, 65);

    const foeBCombatant = combat.turnOrder.find(c => c.tokenId === 'foeB');
    assert.ok(foeBCombatant, 'foeB is present');
    assert.equal(foeBCombatant.resourceConsequenceStatus, 'applied');
    assert.equal(foeBCombatant.currentActionPoints, 4);

    const ownerBroadcast = await ownerStartedPromise;
    assert.equal(ownerBroadcast.combat.turnOrder.length, 3, 'owner received same authoritative order');
    assert.equal(ownerBroadcast.combat.turnOrder[0].tokenId, 'pc');

    const observerBroadcast = await observerStartedPromise;
    assert.equal(observerBroadcast.combat.turnOrder.length, 3, 'observer received same authoritative order');
  });

  it('2. duplicate names with distinct actor identities are preserved distinctly in authoritative roster', async() => {
    const map = room.gameState.maps.default;
    map.tokens.dup1 = {
      id: 'dup1',
      name: 'Town Guard',
      stats: { maxHp: 40, maxMana: 0, maxAP: 4 },
      state: { currentHp: 40, currentMana: 0, currentActionPoints: 4, conditions: [] }
    };
    map.tokens.dup2 = {
      id: 'dup2',
      name: 'Town Guard',
      stats: { maxHp: 40, maxMana: 0, maxAP: 4 },
      state: { currentHp: 35, currentMana: 0, currentActionPoints: 4, conditions: [] }
    };

    const ref1 = (await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'dup1' },
      snapshotHash: actors.hash(map.tokens.dup1)
    })).ref;

    const ref2 = (await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'dup2' },
      snapshotHash: actors.hash(map.tokens.dup2)
    })).ref;

    const result = await ack(gm, 'combat_started', {
      roomId: room.id,
      turnOrder: [
        { tokenId: 'dup1', actorRef: ref1, name: 'Town Guard', initiative: 14 },
        { tokenId: 'dup2', actorRef: ref2, name: 'Town Guard', initiative: 12 },
        { tokenId: 'pc', actorRef: pcRef, name: 'Ilse', initiative: 10 }
      ],
      currentTurnIndex: 0,
      round: 1
    });

    assert.equal(result.success, true);
    const combat = room.gameState.combat;
    assert.equal(combat.turnOrder.length, 3);
    const guards = combat.turnOrder.filter(c => c.name === 'Town Guard');
    assert.equal(guards.length, 2, 'both guards present despite same name');
    assert.equal(guards[0].tokenId, 'dup1');
    assert.equal(guards[1].tokenId, 'dup2');
    assert.equal(guards[0].currentHp, 40);
    assert.equal(guards[1].currentHp, 35);
    assert.notDeepEqual(guards[0].actorRef, guards[1].actorRef, 'distinct actor refs');
  });

  it('3. stale/recreated participants fail locate gracefully with binding_required and secondary PC attachment is refused', async() => {
    const staleRef = { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'ghost' };

    const map = room.gameState.maps.default;
    map.characterTokens.sec = {
      id: 'sec',
      ownerUserId: ownerUid,
      character: { id: 'sec-char', name: 'Secondary' },
      state: { actorContract: { version: 1, kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'sec', ownerUid: ownerUid, characterId: 'sec-char', primary: false } }
    };
    const secRef = { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'sec', ownerUid: ownerUid, characterId: 'sec-char' };

    const result = await ack(gm, 'combat_started', {
      roomId: room.id,
      turnOrder: [
        { tokenId: 'pc', actorRef: pcRef, name: 'Ilse', initiative: 20 },
        { tokenId: 'ghost', actorRef: staleRef, name: 'Ghost', initiative: 15 },
        { tokenId: 'sec', actorRef: secRef, name: 'Secondary', initiative: 10 }
      ],
      currentTurnIndex: 0,
      round: 1
    });

    assert.equal(result.success, true);
    const combat = room.gameState.combat;
    const ghost = combat.turnOrder.find(c => c.tokenId === 'ghost');
    assert.equal(ghost.resourceConsequenceStatus, 'binding_required', 'non-existent token marked binding_required');

    const sec = combat.turnOrder.find(c => c.tokenId === 'sec');
    assert.equal(sec.resourceConsequenceStatus, 'binding_required', 'secondary attachment marked binding_required');

    const validPc = combat.turnOrder.find(c => c.tokenId === 'pc');
    assert.equal(validPc.resourceConsequenceStatus, 'applied', 'valid primary PC applied');
  });

  it('4. unauthorized non-GM client cannot start combat', async() => {
    const prevEnv = process.env.COMBAT_AUTHORITY_ENFORCEMENT;
    try {
      process.env.COMBAT_AUTHORITY_ENFORCEMENT = 'true';
      const result = await ack(observer, 'combat_started', {
        roomId: room.id,
        turnOrder: [{ tokenId: 'foeA', actorRef: foeA, name: 'Grimmstalk Alpha', initiative: 15 }],
        currentTurnIndex: 0,
        round: 1
      });

      assert.equal(result.success, false);
      assert.equal(result.error, 'gm_only', 'rejected with gm_only');
      assert.equal(room.gameState.combat?.isActive, false, 'combat did not activate');
    } finally {
      process.env.COMBAT_AUTHORITY_ENFORCEMENT = prevEnv;
    }
  });

  it('5. map eligibility: tokens on different maps cannot be located in current map combat', async() => {
    room.gameState.maps.dungeon = {
      id: 'dungeon',
      name: 'Dungeon',
      tokens: {
        dungeonTroll: {
          id: 'dungeonTroll',
          name: 'Troll',
          stats: { maxHp: 120, maxMana: 0, maxAP: 3 },
          state: { currentHp: 120, conditions: [] }
        }
      },
      characterTokens: {}
    };

    const dungeonRef = (await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'creature', roomId: room.id, mapId: 'dungeon', tokenId: 'dungeonTroll' },
      snapshotHash: actors.hash(room.gameState.maps.dungeon.tokens.dungeonTroll)
    })).ref;

    const crossMapRef = { ...dungeonRef, mapId: 'default' };

    const result = await ack(gm, 'combat_started', {
      roomId: room.id,
      turnOrder: [
        { tokenId: 'pc', actorRef: pcRef, name: 'Ilse', initiative: 15 },
        { tokenId: 'dungeonTroll', actorRef: crossMapRef, name: 'Troll', initiative: 12 }
      ],
      currentTurnIndex: 0,
      round: 1
    });

    assert.equal(result.success, true);
    const troll = room.gameState.combat.turnOrder.find(c => c.tokenId === 'dungeonTroll');
    assert.equal(troll.resourceConsequenceStatus, 'binding_required', 'cross-map mismatch fails locate');
  });

  it('6. duplicate submission and combat restart preserve retired periodic ticks and active cooldowns', async() => {
    await ack(gm, 'combat_started', {
      roomId: room.id,
      turnOrder: [
        { tokenId: 'pc', actorRef: pcRef, name: 'Ilse', initiative: 18 },
        { tokenId: 'foeA', actorRef: foeA, name: 'Grimmstalk Alpha', initiative: 12 }
      ],
      currentTurnIndex: 0,
      round: 1
    });
    assert.equal(room.gameState.combat.isActive, true);

    room.gameState.combat.retiredPeriodicTicks = {
      'ret-1': { id: 'ret-1', conditionKey: 'poison_dot', remainingRounds: 2, amount: 4 }
    };

    const map = room.gameState.maps.default;
    map.characterTokens.pc.state.authoredCooldowns = {
      'cd-1': { authoredDefinitionId: 'fireball', startSequence: 0, dueSequence: 3, occurrences: 1, period: 3 }
    };

    const restart = await ack(gm, 'combat_started', {
      roomId: room.id,
      turnOrder: [
        { tokenId: 'pc', actorRef: pcRef, name: 'Ilse', initiative: 20 },
        { tokenId: 'foeA', actorRef: foeA, name: 'Grimmstalk Alpha', initiative: 14 },
        { tokenId: 'foeB', actorRef: foeB, name: 'Grimmstalk Beta', initiative: 10 }
      ],
      currentTurnIndex: 0,
      round: 1
    });

    assert.equal(restart.success, true);
    assert.equal(room.gameState.combat.turnOrder.length, 3);
    assert.ok(room.gameState.combat.retiredPeriodicTicks, 'retiredPeriodicTicks preserved across restart');
    assert.equal(Object.keys(room.gameState.combat.retiredPeriodicTicks).length, 1);
    assert.equal(room.gameState.combat.retiredPeriodicTicks['ret-1'].id, 'ret-1');

    assert.ok(map.characterTokens.pc.state.authoredCooldowns['cd-1'], 'active cooldown on PC preserved across restart');
  });

  it('7. existing creature-only combat still works intact', async() => {
    const result = await ack(gm, 'combat_started', {
      roomId: room.id,
      turnOrder: [
        { tokenId: 'foeA', actorRef: foeA, name: 'Grimmstalk Alpha', initiative: 16 },
        { tokenId: 'foeB', actorRef: foeB, name: 'Grimmstalk Beta', initiative: 11 }
      ],
      currentTurnIndex: 0,
      round: 1
    });

    assert.equal(result.success, true);
    const combat = room.gameState.combat;
    assert.equal(combat.isActive, true);
    assert.equal(combat.turnOrder.length, 2);
    assert.equal(combat.turnOrder[0].tokenId, 'foeA');
    assert.equal(combat.turnOrder[0].resourceConsequenceStatus, 'applied');
    assert.equal(combat.turnOrder[1].tokenId, 'foeB');
    assert.equal(combat.turnOrder[1].resourceConsequenceStatus, 'applied');
  });
});
