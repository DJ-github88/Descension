/** Terminal spell-approval list reconciliation & owner/GM privacy through the real production stack. */
const assert = require('assert/strict');
const crypto = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const combatClockApprovals = require('../services/combatClockApprovals');

const ack = (client, event, payload) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`ack timeout: ${event}`)), 5000);
  client.emit(event, payload, result => { clearTimeout(timer); resolve(result); });
});
const once = (client, event) => new Promise(resolve => client.once(event, resolve));
const DEF_HASH = 'p9-spell:v1/599898d64f316c34af68f1e94fa0aa4aa5c8c6f30ad1483eaf16eda444f243ca';

describe('Terminal spell-approval actor_spell_list reconciliation & privacy', function() {
  this.timeout(20000);
  let server, writer, gm, owner, other, gmUid, ownerUid, otherUid, room, pcRef, foeRef, clients, epoch;

  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer });
    await server.start();
    clients = [];
    for (const event of ['actor_bind', 'actor_consequence', 'actor_snapshot', 'actor_spell_approve', 'actor_spell_withdraw', 'actor_spell_decline', 'actor_spell_list']) {
      server.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
    }
    gmUid = server.nextUserId();
    ownerUid = server.nextUserId();
    otherUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid);
    server.registerAuthToken('owner', ownerUid);
    server.registerAuthToken('other', otherUid);
    gm = server.connect({ token: 'gm' }); clients.push(gm); await once(gm, 'connect');
    room = await server.seedRoom(gm.id, { gmUserId: gmUid, persistentRoomId: crypto.randomUUID() });
    for (const [token, name] of [['owner', 'Owner'], ['other', 'Other']]) {
      const client = server.connect({ token }); clients.push(client); await once(client, 'connect');
      const joined = once(client, 'room_joined');
      client.emit('join_room', { roomId: room.id, playerName: name, password: '' });
      await joined;
      if (token === 'owner') { owner = client; }
      else { other = client; }
    }
    server.setCharacterOwner('ilse', ownerUid);
    const pc = {
      id: 'pc',
      ownerUserId: ownerUid,
      character: { id: 'ilse', name: 'Ilse', class: 'Arcanoneer', health: { current: 20, max: 40 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 }, tempHealth: 0, tempMana: 0, tempActionPoints: 0, classResource: { type: 'elementalSpheres', spheres: ['arcane', 'arcane', 'ember'] } },
      state: { conditions: [], classPayment: { version: 1, domain: 'elementalSpheres', value: { type: 'elementalSpheres', spheres: ['arcane', 'arcane', 'ember'] } } }
    };
    const foe = {
      id: 'foe',
      creatureId: 'grimmstalk',
      stats: { maxHp: 250, maxMana: 30, maxAP: 5 },
      state: { currentHp: 30, tempHealth: 4, currentMana: 0, tempMana: 0, currentActionPoints: 2, tempActionPoints: 0, conditions: [] }
    };
    room.gameState.maps.default.characterTokens.pc = pc;
    room.gameState.maps.default.tokens.foe = foe;
    pcRef = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'ilse' }, snapshotHash: actors.hash(pc) })).ref;
    foeRef = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'foe' }, snapshotHash: actors.hash(foe) })).ref;
    epoch = (await ack(owner, 'actor_snapshot', { roomId: room.id })).actionEpoch;
    const synced = await ack(owner, 'actor_consequence', {
      version: 1,
      roomId: room.id,
      commandId: crypto.randomUUID(),
      actionEpoch: epoch,
      baseCommitSequence: actors.ledger(room).commitSequence,
      actors: [{ ref: pcRef, expectedRevision: 0, classPayment: { mode: 'sync', before: null, after: { domain: 'elementalSpheres', value: { type: 'elementalSpheres', spheres: ['arcane', 'arcane', 'ember'] } } } }]
    });
    assert.equal(synced.success, true);
  });

  afterEach(async() => {
    for (const c of clients) { c.disconnect(); }
    await server.stop();
  });

  function makeApproval() {
    return {
      version: 1,
      roomId: room.id,
      approvalId: crypto.randomUUID(),
      actionEpoch: epoch,
      baseCommitSequence: actors.ledger(room).commitSequence,
      source: pcRef,
      target: foeRef,
      spell: { definitionId: 'arc_spark_bolt', definitionHash: DEF_HASH, name: 'Marrow-Piercing Slug', kind: 'damage', damageTypes: ['arcane'] },
      price: { ap: 1, mana: 4 },
      classPayment: { domain: 'elementalSpheres', before: { type: 'elementalSpheres', spheres: ['arcane', 'arcane', 'ember'] }, after: { type: 'elementalSpheres', spheres: ['ember'] }, price: { costs: ['arcane', 'arcane'], gains: [] } },
      roll: { mode: 'physical', dice: [{ sides: 8, faces: [6] }], constant: 4, total: 10, reading: '1d8 + intelligence/4 → 1d8 + 4 (INT 16 ÷ 4, rounded down)' }
    };
  }

  it('returns closedApproval for owner and GM after combat_clock_changed, never for unrelated player/observer, and never fabricates for unknown IDs', async() => {
    const a = makeApproval();
    const reg = await ack(owner, 'actor_spell_approve', a);
    assert.equal(reg.code, 'awaiting_gm');

    // While pending: closedApproval is not present
    const pendingList = await ack(owner, 'actor_spell_list', { roomId: room.id, approvalId: a.approvalId });
    assert.equal(pendingList.success, true);
    assert.equal(pendingList.pending.length, 1);
    assert.equal(pendingList.closedApproval, undefined);

    // Close via combat_clock_changed
    const closures = combatClockApprovals.closePending(room, 'combat_clock_changed');
    assert.equal(closures.length, 1);

    // Owner sees closedApproval
    const ownerAfter = await ack(owner, 'actor_spell_list', { roomId: room.id, approvalId: a.approvalId });
    assert.equal(ownerAfter.success, true);
    assert.deepEqual(ownerAfter.pending, []);
    assert.deepEqual(ownerAfter.closedApproval, {
      roomId: room.id,
      approvalId: a.approvalId,
      contentHash: reg.contentHash,
      code: 'combat_clock_changed'
    });

    // GM sees closedApproval
    const gmAfter = await ack(gm, 'actor_spell_list', { roomId: room.id, approvalId: a.approvalId });
    assert.deepEqual(gmAfter.closedApproval, ownerAfter.closedApproval);

    // Unrelated player / observer cannot probe another owner's closed approval (privacy)
    const otherAfter = await ack(other, 'actor_spell_list', { roomId: room.id, approvalId: a.approvalId });
    assert.equal(otherAfter.success, true);
    assert.equal(otherAfter.closedApproval, undefined);
    assert.equal(otherAfter.consumedReceipt, undefined);

    // Never-registered approvalId (outcome_unknown) does not return closedApproval
    const unknownAfter = await ack(owner, 'actor_spell_list', { roomId: room.id, approvalId: crypto.randomUUID() });
    assert.equal(unknownAfter.success, true);
    assert.equal(unknownAfter.closedApproval, undefined);
    assert.equal(unknownAfter.consumedReceipt, undefined);
  });

  it('returns consumedReceipt for owner and GM when accepted, never for unrelated player/observer', async() => {
    const a = makeApproval();
    const reg = await ack(owner, 'actor_spell_approve', a);
    assert.equal(reg.code, 'awaiting_gm');

    const command = {
      version: 1,
      roomId: room.id,
      commandId: crypto.randomUUID(),
      actionEpoch: epoch,
      baseCommitSequence: actors.ledger(room).commitSequence,
      source: pcRef,
      target: foeRef,
      approval: { approvalId: a.approvalId, contentHash: reg.contentHash },
      actors: [
        { ref: pcRef, expectedRevision: 1, finalResources: { ap: { current: 1, temp: 0 }, mana: { current: 6, temp: 0 } }, classPayment: { mode: 'spell', domain: 'elementalSpheres', approvalHash: reg.contentHash } },
        { ref: foeRef, expectedRevision: 0, finalResources: { hp: { current: 27, temp: 0 } } }
      ],
      adjudication: {
        definitionId: 'arc_spark_bolt',
        definitionVersionOrHash: DEF_HASH,
        chosenResult: JSON.stringify({ capability: 'p9-spell:v1', approvalId: a.approvalId, roll: a.roll, kind: 'damage', damageTypes: ['arcane'], gmConfirmed: true }),
        finalAmount: 7,
        adjustmentReason: 'Durability bypass ruled'
      }
    };
    const accepted = await ack(gm, 'actor_consequence', command);
    assert.equal(accepted.success, true);

    const ownerList = await ack(owner, 'actor_spell_list', { roomId: room.id, approvalId: a.approvalId });
    assert.equal(ownerList.closedApproval, undefined);
    assert.equal(ownerList.consumedReceipt?.success, true);
    assert.equal(ownerList.consumedReceipt?.receipt?.authorization?.proposalId, a.approvalId);

    const otherList = await ack(other, 'actor_spell_list', { roomId: room.id, approvalId: a.approvalId });
    assert.equal(otherList.closedApproval, undefined);
    assert.equal(otherList.consumedReceipt, undefined);
  });
});
