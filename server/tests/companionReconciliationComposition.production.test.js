/**
 * Composition preservation: companion reconciliation committed-closure behavior
 * through the real actor_companion_dismiss and actor_companion_place handlers
 * on createProductionStackServer.
 */
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const relationships = require('../services/actorRelationships');
const companions = require('../services/companionRoster');

const uuid = () => crypto.randomUUID();
const ack = (client, event, payload) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`ack timeout: ${event}`)), 5000);
  client.emit(event, payload, result => { clearTimeout(timer); resolve(result); });
});
const once = (client, event) => new Promise(resolve => client.once(event, resolve));
const DEF_HASH = 'p9-spell:v1/599898d64f316c34af68f1e94fa0aa4aa5c8c6f30ad1483eaf16eda444f243ca';
const SPHERES = () => ({ type: 'elementalSpheres', spheres: ['arcane', 'arcane', 'ember'] });

describe('Composition: companion reconciliation committed-closure behavior', function() {
  this.timeout(30000);
  let server, gm, owner, observer, room, epoch, refs, clients, rosterId, activeRef;
  const live = () => server.rooms.get(room.id);

  beforeEach(async() => {
    const writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer });
    await server.start();
    clients = [];
    for (const event of [
      'actor_bind', 'actor_consequence', 'actor_snapshot', 'actor_spell_approve', 'actor_spell_list',
      'actor_relationship_set', 'actor_recruit', 'actor_companion_place', 'actor_companion_dismiss', 'create_party'
    ]) {
      server.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
    }
    const gmUid = server.nextUserId();
    const ownerUid = server.nextUserId();
    const observerUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid);
    server.registerAuthToken('owner', ownerUid);
    server.registerAuthToken('observer', observerUid);

    gm = server.connect({ token: 'gm' }); clients.push(gm); await once(gm, 'connect');
    room = await server.seedRoom(gm.id, { gmUserId: gmUid, persistentRoomId: uuid() });
    for (const token of ['owner', 'observer']) {
      const client = server.connect({ token }); clients.push(client); await once(client, 'connect');
      const joined = once(client, 'room_joined');
      client.emit('join_room', { roomId: room.id, playerName: token, password: '' });
      await joined;
      if (token === 'owner') { owner = client; } else { observer = client; }
    }
    server.setCharacterOwner('ilse', ownerUid);

    const partyCreated = once(owner, 'party_created');
    owner.emit('create_party', { partyName: 'Gate Party', leaderData: { name: 'Ilse' } });
    await partyCreated;

    const map = room.gameState.maps.default;
    map.characterTokens.pc = {
      id: 'pc',
      ownerUserId: ownerUid,
      character: {
        id: 'ilse', name: 'Ilse', class: 'Arcanoneer',
        stats: { agility: 10, initiativeMod: 0 }, skillRanks: { perception: 'NOVICE' },
        health: { current: 20, max: 40 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 },
        tempHealth: 0, tempMana: 0, tempActionPoints: 0, classResource: SPHERES()
      },
      state: { conditions: [], classPayment: { version: 1, domain: 'elementalSpheres', value: SPHERES() } }
    };
    map.tokens.beast = {
      id: 'beast',
      creatureId: 'grimmstalk',
      name: 'Grimmstalk',
      stats: { maxHp: 60, maxMana: 10, maxAP: 4 },
      state: { currentHp: 30, tempHealth: 0, currentMana: 0, tempMana: 0, currentActionPoints: 2, tempActionPoints: 0, conditions: [] }
    };

    const pcBind = await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { roomId: room.id, mapId: 'default', kind: 'character', tokenId: 'pc', ownerUid, characterId: 'ilse' },
      snapshotHash: actors.hash(map.characterTokens.pc)
    });
    const beastBind = await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { roomId: room.id, mapId: 'default', kind: 'creature', tokenId: 'beast' },
      snapshotHash: actors.hash(map.tokens.beast)
    });
    refs = { pc: pcBind.ref, beast: beastBind.ref };
    epoch = (await ack(owner, 'actor_snapshot', { roomId: room.id })).actionEpoch;

    const synced = await ack(owner, 'actor_consequence', {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: epoch,
      baseCommitSequence: actors.ledger(live()).commitSequence,
      actors: [{ ref: refs.pc, expectedRevision: 0, classPayment: { mode: 'sync', before: null, after: { domain: 'elementalSpheres', value: SPHERES() } } }]
    });
    assert.equal(synced.success, true, JSON.stringify(synced));

    const rel = await ack(gm, 'actor_relationship_set', {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence,
      expectedRelationshipRevision: relationships.revision(live()),
      pairs: [{ a: refs.beast, b: refs.pc }],
      value: 'enemy'
    });
    assert.equal(rel.success, true, JSON.stringify(rel));

    const recruited = await ack(gm, 'actor_recruit', {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence,
      source: refs.beast,
      expectedSourceRevision: 0,
      recipientUid: ownerUid,
      expectedPartyRevision: null,
      expectedRelationshipRevision: relationships.revision(live()),
      expectedRosterRevision: companions.revision(live())
    });
    assert.equal(recruited.success, true, JSON.stringify(recruited));
    rosterId = recruited.rosterEntry.rosterId;

    const placed = await ack(owner, 'actor_companion_place', {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence,
      rosterId,
      expectedRosterRevision: companions.revision(live()),
      mapId: 'default',
      position: { x: 100, y: 100 },
      expectedActiveRef: null
    });
    assert.equal(placed.success, true, JSON.stringify(placed));
    activeRef = placed.activeRef;
  });

  afterEach(async() => {
    for (const c of clients) { c.disconnect(); }
    await server.stop();
  });

  function makeApproval() {
    return {
      version: 1,
      roomId: room.id,
      approvalId: uuid(),
      actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence,
      source: refs.pc,
      target: activeRef,
      spell: { definitionId: 'arc_spark_bolt', definitionHash: DEF_HASH, name: 'Marrow-Piercing Slug', kind: 'damage', damageTypes: ['arcane'] },
      price: { ap: 1, mana: 4 },
      classPayment: { domain: 'elementalSpheres', before: SPHERES(), after: { type: 'elementalSpheres', spheres: ['ember'] }, price: { costs: ['arcane', 'arcane'], gains: [] } },
      roll: { mode: 'physical', dice: [{ sides: 8, faces: [6] }], constant: 4, total: 10, reading: '1d8 + intelligence/4 → 1d8 + 4 (INT 16 ÷ 4, rounded down)' }
    };
  }

  it('actor_companion_dismiss commits closure of pending approval targeting the companion and reconciles via actor_spell_list', async() => {
    const a = makeApproval();
    const reg = await ack(owner, 'actor_spell_approve', a);
    assert.equal(reg.code, 'awaiting_gm', JSON.stringify(reg));

    const ownerClosedEvents = [];
    const observerClosedEvents = [];
    owner.on('actor_spell_closed', p => ownerClosedEvents.push(p));
    observer.on('actor_spell_closed', p => observerClosedEvents.push(p));

    const dismissed = await ack(owner, 'actor_companion_dismiss', {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence,
      rosterId,
      expectedRosterRevision: companions.revision(live()),
      expectedActiveRef: activeRef
    });
    assert.equal(dismissed.success, true, JSON.stringify(dismissed));
    assert.equal(dismissed.placement, 'available');

    assert.equal(ownerClosedEvents.length, 1);
    assert.deepEqual(ownerClosedEvents[0], {
      roomId: room.id,
      approvalId: a.approvalId,
      contentHash: reg.contentHash,
      code: 'actor_removed'
    });
    assert.equal(observerClosedEvents.length, 0);

    const ownerList = await ack(owner, 'actor_spell_list', { roomId: room.id, approvalId: a.approvalId });
    assert.equal(ownerList.success, true, JSON.stringify(ownerList));
    assert.deepEqual(ownerList.pending, []);
    assert.deepEqual(ownerList.closedApproval, {
      roomId: room.id,
      approvalId: a.approvalId,
      contentHash: reg.contentHash,
      code: 'actor_removed'
    });

    const observerList = await ack(observer, 'actor_spell_list', { roomId: room.id, approvalId: a.approvalId });
    assert.equal(observerList.success, true);
    assert.equal(observerList.closedApproval, undefined);
  });

  it('actor_companion_place reconciliation closes pending approval when active companion token is missing from map', async() => {
    const a = makeApproval();
    const reg = await ack(owner, 'actor_spell_approve', a);
    assert.equal(reg.code, 'awaiting_gm', JSON.stringify(reg));

    // Simulate missing active token on the map so actor_companion_place enters reconcile mode
    delete live().gameState.maps.default.tokens[activeRef.tokenId];

    const reconciled = await ack(owner, 'actor_companion_place', {
      version: 1,
      roomId: room.id,
      commandId: uuid(),
      actionEpoch: actors.epoch(live()),
      baseCommitSequence: actors.ledger(live()).commitSequence,
      rosterId,
      expectedRosterRevision: companions.revision(live()),
      mapId: 'default',
      position: { x: 120, y: 120 },
      expectedActiveRef: activeRef
    });
    assert.equal(reconciled.success, false);
    assert.equal(reconciled.code, 'companion_inactive');

    const ownerList = await ack(owner, 'actor_spell_list', { roomId: room.id, approvalId: a.approvalId });
    assert.equal(ownerList.success, true, JSON.stringify(ownerList));
    assert.deepEqual(ownerList.closedApproval, {
      roomId: room.id,
      approvalId: a.approvalId,
      contentHash: reg.contentHash,
      code: 'actor_removed'
    });
  });
});
