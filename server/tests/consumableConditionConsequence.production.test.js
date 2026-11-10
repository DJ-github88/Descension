/** Regression suite: production actor_consequence consumable condition validation.
 *
 * Exercises the real production stack server (createProductionStackServer), authentic socket.io
 * client emission, real middleware composition, and server actorConsequences validator.
 *
 * Verifies:
 * 1. A valid non-family consumable condition is accepted by the server.
 * 2. Mixed healing + condition commits together atomically in one receipt.
 * 3. A family-attribute potion submitted by an owner reaches attribute_change_gm_only.
 * 4. Malformed supplied values (e.g. explicit null optional fields, invalid types) remain refused with invalid_condition.
 * 5. Zero-valued fields (duration, durationValue, remainingRounds, startTime) retain their intended meaning.
 */
const assert = require('assert/strict');
const { randomUUID: uuid } = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const actors = require('../services/actorConsequences');

const ack = (client, event, payload) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`ack timeout: ${event}`)), 5000);
  client.emit(event, payload, result => { clearTimeout(timer); resolve(result); });
});
const once = (client, event) => new Promise(resolve => client.once(event, resolve));

describe('consumable condition consequence — production actor_consequence regression', function() {
  this.timeout(20000);
  let server, writer, gm, owner, ownerUid, room, pc, snapshot;

  const validRecord = (id, overrides = {}) => ({
    version: 1,
    id,
    recordId: id,
    conditionKey: 'potion-of-vigor',
    originalName: 'Potion of Vigor',
    name: 'Potion of Vigor',
    type: 'buff',
    kind: 'effect',
    target: pc,
    targetId: 'pc',
    targetType: 'character',
    source: 'consumable',
    description: 'Temporary enhancement from Potion of Vigor',
    effects: { healthRegen: 2 },
    duration: 60,
    durationType: 'seconds',
    startTime: Date.now(),
    endTime: Date.now() + 60000,
    stackable: false,
    sharedTiming: 'manual',
    ...overrides
  });

  const makeCommand = (cmdId, record, finalResources = null) => ({
    version: 1,
    roomId: room.id,
    commandId: cmdId,
    actionEpoch: snapshot.actionEpoch,
    baseCommitSequence: snapshot.commitSequence,
    actors: [{
      ref: pc,
      expectedRevision: actors.locate(room, pc).contract.revision,
      ...(finalResources ? { finalResources } : {}),
      ...(record ? { conditions: [{ op: 'add', recordId: record.id, record }] } : {})
    }]
  });

  beforeEach(async () => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async () => ({ outcome: 'confirmed' }) });
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
    map.characterTokens.pc = {
      id: 'pc',
      ownerUserId: ownerUid,
      character: {
        id: 'c',
        class: 'Arcanoneer',
        health: { current: 20, max: 40 },
        mana: { current: 10, max: 20 },
        actionPoints: { current: 2, max: 5 },
        tempHealth: 0,
        tempMana: 0,
        tempActionPoints: 0
      },
      state: { conditions: [] }
    };
    const bound = await ack(gm, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid, characterId: 'c' },
      snapshotHash: actors.hash(map.characterTokens.pc)
    });
    assert.equal(bound.success, true, JSON.stringify(bound));
    pc = bound.ref;
    snapshot = await ack(owner, 'actor_snapshot', { roomId: room.id });
    assert.equal(snapshot.success, true, JSON.stringify(snapshot));
  });

  afterEach(async () => {
    if (gm) gm.disconnect();
    if (owner) owner.disconnect();
    await server.stop();
  });

  const getConditions = () => actors.locate(room, pc).token.state.conditions;
  const getHealth = () => actors.locate(room, pc).token.character.health.current;

  it('1. a valid non-family consumable condition is accepted', async () => {
    const recId = uuid();
    const cmdId = uuid();
    const record = validRecord(recId);
    const cmd = makeCommand(cmdId, record);

    const result = await ack(owner, 'actor_consequence', cmd);
    assert.equal(result.success, true, JSON.stringify(result));
    assert.ok(result.receipt && result.receipt.commandId === cmdId);
    assert.ok(['accepted', 'accepted-live'].includes(result.status));
    assert.equal(getConditions().length, 1);
    assert.equal(getConditions()[0].name, 'Potion of Vigor');
    assert.deepEqual(getConditions()[0].effects, { healthRegen: 2 });
  });

  it('2. mixed healing + condition commits together', async () => {
    const recId = uuid();
    const cmdId = uuid();
    const record = validRecord(recId);
    const finalResources = { hp: { current: 25, temp: 0 } };
    const cmd = makeCommand(cmdId, record, finalResources);

    const result = await ack(owner, 'actor_consequence', cmd);
    assert.equal(result.success, true, JSON.stringify(result));
    assert.ok(result.receipt && result.receipt.commandId === cmdId);
    assert.ok(['accepted', 'accepted-live'].includes(result.status));

    // Both state mutations committed atomically
    assert.equal(getHealth(), 25, 'room health pool must reflect the finalResources update');
    assert.equal(getConditions().length, 1, 'room condition pool must reflect the added condition');
    assert.deepEqual(getConditions()[0].effects, { healthRegen: 2 });
    assert.equal(result.receipt.actors[0].finalResources.hp.current, 25);
  });

  it('3. a family-attribute potion reaches attribute_change_gm_only', async () => {
    const recId = uuid();
    const cmdId = uuid();
    const familyRecord = validRecord(recId, {
      name: 'Potion of Insight',
      originalName: 'Potion of Insight',
      conditionKey: 'potion-of-insight',
      effects: { intelligence: 2 }
    });
    const cmd = makeCommand(cmdId, familyRecord);

    const result = await ack(owner, 'actor_consequence', cmd);
    assert.equal(result.success, false, JSON.stringify(result));
    assert.equal(result.code, 'attribute_change_gm_only');
    assert.equal(getConditions().length, 0, 'refused family condition must not enter the room');
    assert.equal(getHealth(), 20, 'health must remain unchanged');
  });

  it('4. malformed supplied values remain refused', async () => {
    // 4a. Explicit null durationValue (the regression bug)
    const nullDurVal = validRecord(uuid(), { durationValue: null });
    const resA = await ack(owner, 'actor_consequence', makeCommand(uuid(), nullDurVal));
    assert.equal(resA.success, false);
    assert.equal(resA.code, 'invalid_condition');

    // 4b. Explicit null overTimeType
    const nullOvertime = validRecord(uuid(), { overTimeType: null });
    const resB = await ack(owner, 'actor_consequence', makeCommand(uuid(), nullOvertime));
    assert.equal(resB.success, false);
    assert.equal(resB.code, 'invalid_condition');

    // 4c. Non-number duration
    const stringDur = validRecord(uuid(), { duration: 'sixty' });
    const resC = await ack(owner, 'actor_consequence', makeCommand(uuid(), stringDur));
    assert.equal(resC.success, false);
    assert.equal(resC.code, 'invalid_condition');

    // 4d. Unsupported effect modifier key
    const badKey = validRecord(uuid(), { effects: { unsupportedStat: 5 } });
    const resD = await ack(owner, 'actor_consequence', makeCommand(uuid(), badKey));
    assert.equal(resD.success, false);
    assert.ok(['invalid_condition', 'invalid_consequence'].includes(resD.code));

    assert.equal(getConditions().length, 0);
  });

  it('5. zero-valued fields retain their intended meaning', async () => {
    const recId = uuid();
    const cmdId = uuid();
    const zeroRecord = validRecord(recId, {
      effects: { healthRegen: 0 },
      duration: 0,
      durationValue: 0,
      remainingRounds: 0,
      startTime: 0,
      durationType: 'rounds'
    });
    delete zeroRecord.endTime;

    const result = await ack(owner, 'actor_consequence', makeCommand(cmdId, zeroRecord));
    assert.equal(result.success, true, JSON.stringify(result));
    assert.ok(result.receipt && result.receipt.commandId === cmdId);
    assert.ok(['accepted', 'accepted-live'].includes(result.status));

    const roomCond = getConditions()[0];
    assert.equal(roomCond.duration, 0);
    assert.equal(roomCond.durationValue, 0);
    assert.equal(roomCond.remainingRounds, 0);
    assert.equal(roomCond.startTime, 0);
    assert.deepEqual(roomCond.effects, { healthRegen: 0 });
  });
});
