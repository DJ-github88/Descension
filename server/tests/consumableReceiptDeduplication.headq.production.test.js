/** HEADQ verification delta (2026-11-09) — consumable uncertain delivery, server receipt/deduplication.
 *
 * Real production path: createProductionStackServer installs the real middleware composition and the
 * real actorConsequenceHandlers registration; the only stubs are the documented external boundaries
 * (Firebase token verification, persistence). No fake socket is used here: two authenticated socket.io
 * clients (GM + owner) drive the production `actor_consequence` handler.
 *
 * Claimed file: this suite is additive evidence for handoff/consumable-recovery-verification. It does
 * not modify Flash's runtime candidate.
 */
const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');

const ack = (client, event, payload) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`ack timeout: ${event}`)), 5000);
  client.emit(event, payload, result => {clearTimeout(timer); resolve(result);});
});
const once = (client, event) => new Promise(resolve => client.once(event, resolve));

describe('consumable uncertain delivery — production actor_consequence receipt dedupe', function() {
  this.timeout(20000);
  let server, writer, gm, owner, ownerUid, room, pc, snapshot;

  const potionRecord = (id, overrides = {}) => ({
    version: 1, id, recordId: id, conditionKey: 'potion-of-insight', originalName: 'Potion of Insight', name: 'Potion of Insight',
    type: 'buff', kind: 'effect', target: pc, targetId: 'pc', targetType: 'character', source: 'consumable',
    description: 'Temporary enhancement from Potion of Insight', effects: { healthRegen: 2 }, isMagical: false, stackable: false,
    hasOverTimeEffect: false, sharedTiming: 'manual', durationType: 'manual', ...overrides
  });

  const command = (id, record) => ({
    version: 1, roomId: room.id, commandId: id, actionEpoch: snapshot.actionEpoch, baseCommitSequence: snapshot.commitSequence,
    actors: [{ ref: pc, expectedRevision: actors.locate(room, pc).contract.revision, conditions: [{ op: 'add', recordId: record.id, record }] }]
  });

  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => ({ outcome: 'confirmed' }) });
    server = createProductionStackServer({ firebaseBatchWriter: writer });
    await server.start();
    for (const event of ['actor_snapshot', 'actor_bind', 'actor_consequence']) {
      server.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
    }
    const gmUid = server.nextUserId();
    ownerUid = server.nextUserId();
    server.registerAuthToken('gm', gmUid);
    server.registerAuthToken('owner', ownerUid);
    gm = server.connect({ token: 'gm' });
    await once(gm, 'connect');
    room = await server.seedRoom(gm.id, { gmUserId: gmUid });
    owner = server.connect({ token: 'owner' });
    await once(owner, 'connect');
    const joined = once(owner, 'room_joined');
    owner.emit('join_room', { roomId: room.id, playerName: 'Owner', password: '' });
    await joined;
    server.setCharacterOwner('c', ownerUid);
    const map = room.gameState.maps.default;
    map.characterTokens.pc = { id: 'pc', ownerUserId: ownerUid,
      character: { id: 'c', class: 'Arcanoneer', health: { current: 20, max: 30 }, mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 }, tempMana: 0, tempActionPoints: 0 },
      state: { conditions: [] } };
    const bound = await ack(gm, 'actor_bind', { roomId: room.id,
      ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'c' },
      snapshotHash: actors.hash(map.characterTokens.pc) });
    assert.equal(bound.success, true, JSON.stringify(bound));
    pc = bound.ref;
    snapshot = await ack(owner, 'actor_snapshot', { roomId: room.id });
    assert.equal(snapshot.success, true, JSON.stringify(snapshot));
  });

  afterEach(async() => {
    if (gm) gm.disconnect();
    if (owner) owner.disconnect();
    await server.stop();
  });

  const conditions = () => actors.locate(room, pc).token.state.conditions;
  const confirmations = () => actors.ledger(room).receipts.filter(receipt => receipt.submitterUid === ownerUid);

  it('accepts one owner consumable command, then replays the identical command id without a second condition or receipt', async() => {
    const id = uuid();
    const cmd = command(id, potionRecord(uuid()));
    const first = await ack(owner, 'actor_consequence', cmd);
    assert.equal(first.success, true, JSON.stringify(first));
    assert.equal(conditions().length, 1);
    assert.equal(confirmations().length, 1);
    assert.deepEqual(conditions()[0].effects, { healthRegen: 2 });

    const retry = await ack(owner, 'actor_consequence', cmd);
    assert.equal(retry.success, true, JSON.stringify(retry));
    assert.deepEqual(retry.receipt, first.receipt);
    assert.equal(conditions().length, 1, 'a replay must not append a second condition');
    assert.equal(confirmations().length, 1, 'a replay must not add a second receipt');
  });

  it('rejects changed content under the same command id and leaves the accepted effect untouched', async() => {
    const id = uuid();
    const record = potionRecord(uuid());
    const cmd = command(id, record);
    assert.equal((await ack(owner, 'actor_consequence', cmd)).success, true);
    const changed = command(id, potionRecord(record.id, { name: 'Potion of Insight (changed)', effects: { healthRegen: 9 } }));
    const refused = await ack(owner, 'actor_consequence', changed);
    assert.equal(refused.success, false, JSON.stringify(refused));
    assert.equal(refused.code, 'command_id_conflict');
    assert.equal(conditions().length, 1);
    assert.deepEqual(conditions()[0].effects, { healthRegen: 2 });
    assert.equal(confirmations().length, 1);
  });

  it('recovers a lost ACK/broadcast by replaying the original bytes: one effect, one receipt, identical identity', async() => {
    const id = uuid();
    const cmd = command(id, potionRecord(uuid()));
    // The owner discards the acknowledgement (no ack callback) and does not consume the broadcast.
    owner.emit('actor_consequence', cmd);
    const accepted = await once(owner, 'actor_consequence_accepted');
    assert.equal(accepted.success, true, JSON.stringify(accepted));
    assert.equal(accepted.receipt.commandId, id);
    assert.equal(conditions().length, 1);
    assert.equal(confirmations().length, 1);

    const retry = await ack(owner, 'actor_consequence', cmd);
    assert.equal(retry.success, true, JSON.stringify(retry));
    assert.deepEqual(retry.receipt, accepted.receipt);
    assert.equal(conditions().length, 1, 'the recovered command must not duplicate its condition');
    assert.equal(confirmations().length, 1, 'the recovered command must not duplicate its receipt');
  });

  it('dedupe is command-identity only: a new command id is a new accepted use (no server item ledger)', async() => {
    // Factual scope for recovery: the server cannot tell that two different command ids describe one item
    // use, because it owns no inventory identity. A reloaded client that lost the original id therefore
    // gets a second accepted receipt/effect instead of a replay.
    const first = await ack(owner, 'actor_consequence', command(uuid(), potionRecord(uuid())));
    const second = await ack(owner, 'actor_consequence', command(uuid(), potionRecord(uuid())));
    assert.equal(first.success, true, JSON.stringify(first));
    assert.equal(second.success, true, JSON.stringify(second));
    assert.notEqual(second.receipt.commandId, first.receipt.commandId);
    assert.equal(confirmations().length, 2);
    assert.equal(conditions().length, 2);
  });
});
