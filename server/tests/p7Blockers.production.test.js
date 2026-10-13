const assert = require('assert/strict');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter, createSyncServices } = require('../services/syncService');
const actors = require('../services/actorConsequences');
const red = process.env.P7_CORRECTION_RED === '1';
const observations = {};
const ack = (client, event, data, timeout = 4000) => new Promise(resolve => {
  const timer = setTimeout(() => resolve({ success: false, code: 'outcome_unknown' }), timeout);
  client.emit(event, data, result => {clearTimeout(timer); resolve(result);});
});
const pause = () => new Promise(resolve => setTimeout(resolve, 80));
describe('P7 independent blockers registered regressions', function() {
  this.timeout(15000);
  let server, gm, room, writer, services, clients, uid;
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { persist: async() => false });
    server = createProductionStackServer({ firebaseBatchWriter: writer });
    await server.start(); clients = [];
    for (const event of ['actor_snapshot', 'actor_bind', 'actor_consequence', 'actor_propose', 'actor_adjudicate']) {server.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });}
    services = createSyncServices(server.io, server.rooms, server.players, { authorityService: server.authorityService });
    // Real production eligibility, metadata and authority hooks; only cloud transport differs.
    for (const name of ['shouldPersist', 'captureAuthority', 'authorityCurrent', 'authorityAccept', 'authorityConfirm', 'captureMetadata', 'getRoomRevision', 'validateSnapshot', 'onConfirmed']) {writer[name] = services.firebaseBatchWriter[name];}
    writer.authorityRequired = true;
    uid = server.nextUserId('gm'); server.registerAuthToken('gm', uid);
    gm = server.connect({ token: 'gm' }); clients.push(gm);
    await new Promise(resolve => gm.once('connect', resolve));
    room = await server.seedRoom(gm.id, { gmUserId: uid, persistentRoomId: crypto.randomUUID() });
  });
  afterEach(async() => {clients.forEach(client => client.disconnect()); services.firebaseBatchWriter.stop(); services.movementDebouncer.stop(); await server.stop();});
  after(() => fs.writeFileSync(path.resolve(__dirname, '../../vtt-react/verification/p7/evidence/corrections-20261013/server-' + (red ? 'red' : 'green') + '.json'), JSON.stringify(observations, null, 2)));
  const raw = id => ({ id, ownerUserId: uid, stats: { maxHp: 50, maxMana: 30, maxAP: 5 }, state: { currentHp: 40, currentMana: 20, currentActionPoints: 3, conditions: [] } });
  const bind = async(id = 'actor') => {
    room.gameState.maps.default.tokens[id] = raw(id);
    return ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: id }, snapshotHash: actors.hash(room.gameState.maps.default.tokens[id]) });
  };
  const command = async(ref, conditions) => {
    const snapshot = await ack(gm, 'actor_snapshot', { roomId: room.id });
    return { version: 1, roomId: room.id, commandId: crypto.randomUUID(), actionEpoch: snapshot.actionEpoch, baseCommitSequence: snapshot.commitSequence,
      actors: [{ ref, expectedRevision: actors.locate(room, ref).contract.revision, ...(conditions ? { conditions } : { finalResources: { hp: { current: 20, temp: 0 } } }) }] };
  };
  const member = async() => {
    const owner = server.nextUserId('member'); server.registerAuthToken(owner, owner);
    const client = server.connect({ token: owner }); clients.push(client); await new Promise(resolve => client.once('connect', resolve));
    const joined = new Promise(resolve => client.once('room_joined', resolve)); client.emit('join_room', { roomId: room.id, playerName: 'Member', password: '' }); await joined;
    return client;
  };
  it('B1 normal separate GM registry session receives immutable pending proposals and accepted results; revoked/replaced sessions do not', async() => {
    const bound = await bind(); assert.equal(bound.success, true);
    const peer = await member(), pending = [], accepted = [];
    gm.on('actor_proposal_pending', value => pending.push(value)); gm.on('actor_consequence_accepted', value => accepted.push(value));
    const cmd = await command(bound.ref), proposed = await ack(peer, 'actor_propose', cmd); await pause();
    assert.notEqual(room.gm, server.players.get(gm.id));
    const result = await ack(gm, 'actor_adjudicate', { roomId: room.id, proposalId: proposed.proposalId, contentHash: proposed.contentHash }); await pause();
    observations.B1 = { proposed, pending, result, accepted, separateRegistrySession: true };
    assert.equal(pending.length, red ? 0 : 1); assert.equal(accepted.length, red ? 0 : 1);
    if (!red) {assert.deepEqual(pending[0].command, cmd); assert.equal(pending[0].contentHash, actors.hash(cmd));}
    const count = { pending: pending.length, accepted: accepted.length };
    const oldGM = room.gm;
    // Leave an old registry entry/socket alive, but replace the actual GM session.
    room.gm = { ...room.gm, id: 'successor', socketId: 'successor-socket' };
    await ack(peer, 'actor_propose', await command(bound.ref)); await pause();
    assert.equal(pending.length, count.pending); assert.equal(accepted.length, count.accepted);
    if (!red) {assert.equal((await ack(gm, 'actor_snapshot', { roomId: room.id })).success, false);}
    room.gm = oldGM;
    const revokedAccepted = [];
    peer.on('actor_consequence_accepted', value => revokedAccepted.push(value));
    room.players.delete(server.players.get(peer.id).id);
    assert.equal((await ack(peer, 'actor_snapshot', { roomId: room.id })).success, false);
    await ack(gm, 'actor_consequence', await command(bound.ref)); await pause(); assert.equal(revokedAccepted.length, 0);
  });
  it('B2 real temporary room supports authorized live-only resources/conditions with bounded receipts and no persistent writer', async() => {
    room.isPermanent = false; delete room.persistentRoomId;
    assert.equal(writer.shouldPersist(room.id), false);
    const bound = await bind();
    const legacy = await ack(gm, 'token_updated', { roomId: room.id, mapId: 'default', tokenId: 'actor', updates: { currentHp: 20 } });
    observations.B2 = { bound, legacy, eligible: writer.shouldPersist(room.id) };
    assert.equal(legacy.code, 'actor_consequence_required');
    if (red) {assert.equal(bound.code, 'room_not_persistent'); return;}
    assert.equal(bound.success, true); assert.equal(bound.durability, 'live-only');
    const record = { version: 1, id: 'manual', recordId: 'manual', originalName: 'Unknown manual name', name: 'Unknown manual name', type: 'marker', kind: 'legacy-manual', target: bound.ref, targetId: 'actor', targetType: 'creature', source: 'GM manual', sharedTiming: 'manual', durationType: 'manual' };
    const cmd = await command(bound.ref, [{ op: 'add', recordId: record.id, record }]);
    cmd.actors[0].finalResources = { hp: { current: 20, temp: 0 } };
    const result = await ack(gm, 'actor_consequence', cmd), retry = await ack(gm, 'actor_consequence', cmd);
    assert.equal(result.success, true); assert.equal(result.status, 'accepted-live'); assert.equal(result.durability, 'live-only'); assert.equal(result.receipt.checkpointRevision, null);
    assert.deepEqual(retry.receipt, result.receipt); assert.equal(writer.getRetainedSnapshot(room.id), null);
    const peer = await member(); const denied = await ack(peer, 'actor_consequence', await command(bound.ref)); assert.equal(denied.code, 'authorization_required');
    const prior = JSON.stringify(room.gameState);
    // A full unconfirmed session ledger refuses, never prunes live-only results.
    const receipt = room.gameState.actorConsequences.receipts[0];
    room.gameState.actorConsequences.receipts = Array.from({ length: 256 }, (_, index) => ({ ...receipt, commandId: crypto.randomUUID(), commitSequence: index + 1 }));
    room.gameState.actorConsequences.commitSequence = 256;
    const full = JSON.stringify(room.gameState), capacity = await ack(gm, 'actor_consequence', await command(bound.ref));
    assert.equal(capacity.code, 'receipt_capacity'); assert.equal(JSON.stringify(room.gameState), full);
    observations.B2 = { ...observations.B2, result, retry, denied, capacity, atomicResourcesAndCondition: JSON.parse(prior).maps.default.tokens.actor.state, retainedSnapshot: writer.getRetainedSnapshot(room.id) };
  });
  it('B3 broadcast throw after install returns accepted/delivery status and exact retry never mutates again', async() => {
    const bound = await bind(); await member(); const cmd = await command(bound.ref);
    const original = server.io.to.bind(server.io); let failOnce = true;
    server.io.to = target => {const operator = original(target), emit = operator.emit.bind(operator); operator.emit = (event, ...args) => {if (event === 'actor_consequence_accepted' && failOnce) {failOnce = false; throw Error('publication transport failure');} return emit(event, ...args);}; return operator;};
    const result = await ack(gm, 'actor_consequence', cmd); server.io.to = original;
    const installed = actors.clone(room.gameState), retry = await ack(gm, 'actor_consequence', cmd);
    observations.B3 = { result, retry, liveHp: installed.maps.default.tokens.actor.state.currentHp, receipts: installed.actorConsequences.receipts.length };
    assert.equal(result.success, !red); if (red) {assert.equal(result.code, 'invalid_consequence');} else {assert.equal(result.delivery, 'partial');}
    assert.equal(retry.success, true); assert.equal(JSON.stringify(room.gameState), JSON.stringify(installed)); assert.equal(installed.actorConsequences.receipts.length, 1);
  });
  it('B3 acknowledgement throw after install retains accepted receipt; pre-install validation/capacity still refuse atomically', async() => {
    const bound = await bind(), cmd = await command(bound.ref);
    const socket = server.io.sockets.sockets.get(gm.id), original = socket.packet.bind(socket); let failOnce = true;
    socket.packet = (packet, ...args) => {if (packet.type === 3 && failOnce) {failOnce = false; throw Error('ack transport failure');} return original(packet, ...args);};
    const result = await ack(gm, 'actor_consequence', cmd, 200); socket.packet = original;
    const installed = JSON.stringify(room.gameState), retry = await ack(gm, 'actor_consequence', cmd);
    observations.B3Ack = { result, retry };
    assert.equal(result.code, 'outcome_unknown'); assert.equal(retry.success, true); assert.equal(JSON.stringify(room.gameState), installed);
    const bad = await command(bound.ref); bad.actors[0].finalResources.hp.current = 99;
    assert.equal((await ack(gm, 'actor_consequence', bad)).success, false); assert.equal(JSON.stringify(room.gameState), installed);
    writer.maxTrackedRooms = 0; writer.roomStates.clear(); writer.pendingWrites.clear();
    assert.equal((await ack(gm, 'actor_consequence', await command(bound.ref))).success, false); assert.equal(JSON.stringify(room.gameState), installed);
  });
  it('B4 creature creation rejects client authority metadata; ordinary creation and explicit server adaptation remain supported', async() => {
    const forged = { version: 1, kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'forged', instanceId: 'client-authority', revision: 91 };
    const result = await ack(gm, 'creature_added', { roomId: room.id, mapId: 'default', creature: { ...raw('forged'), state: { ...raw('forged').state, actorContract: forged } } }, 200);
    const snapshot = await ack(gm, 'actor_snapshot', { roomId: room.id });
    observations.B4 = { result, stored: room.gameState.maps.default.creatures?.forged || null, projected: snapshot.maps.default.creatures?.forged || null };
    if (red) {assert.deepEqual(observations.B4.stored.state.actorContract, forged);} else {assert.equal(observations.B4.stored, null); assert.equal(observations.B4.projected, null);}
    gm.emit('creature_added', { roomId: room.id, mapId: 'default', creature: raw('ordinary') }); await pause();
    const ordinary = room.gameState.maps.default.creatures.ordinary;
    assert.equal(ordinary.state.actorContract, undefined);
    const bound = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'ordinary' }, snapshotHash: actors.hash(ordinary) });
    assert.equal(bound.success, true); assert.notEqual(bound.ref.instanceId, forged.instanceId); assert.equal(bound.revision, 0);
  });
  it('B6 incomplete/contradictory executable records refuse before mutation; optional conditionKey and valid known/unknown/manual records pass', async() => {
    const bound = await bind(); const record = { version: 1, id: 'missing', recordId: 'missing', name: 'Incomplete', type: 'debuff', kind: 'effect', target: bound.ref, sharedTiming: 'manual', durationType: 'manual' };
    const before = JSON.stringify(room.gameState), result = await ack(gm, 'actor_consequence', await command(bound.ref, [{ op: 'add', recordId: record.id, record }]));
    observations.B6 = { result };
    assert.equal(result.success, red); if (red) {return;}
    assert.equal(JSON.stringify(room.gameState), before);
    const complete = { ...record, originalName: 'Original unknown', source: 'GM manual', targetId: bound.ref.tokenId, targetType: bound.ref.kind };
    for (const key of ['id', 'recordId', 'originalName', 'source', 'target', 'targetId', 'targetType', 'kind', 'durationType']) {
      const malformed = { ...complete }; delete malformed[key];
      assert.equal((await ack(gm, 'actor_consequence', await command(bound.ref, [{ op: 'add', recordId: record.id, record: malformed }]))).success, false, key);
      assert.equal(JSON.stringify(room.gameState), before);
    }
    for (const patch of [{ targetId: 'other' }, { targetType: 'character' }, { source: '' }, { originalName: '' }]) {
      assert.equal((await ack(gm, 'actor_consequence', await command(bound.ref, [{ op: 'add', recordId: record.id, record: { ...complete, ...patch } }]))).success, false);
      assert.equal(JSON.stringify(room.gameState), before);
    }
    const records = [complete, { ...complete, id: 'known', recordId: 'known', name: 'Slowed', originalName: 'slow', conditionKey: 'slowed', durationType: 'rounds', durationValue: 3, remainingRounds: 0, effects: { movementSpeed: -10 } }, { ...complete, id: 'manual', recordId: 'manual', kind: 'legacy-manual' }];
    const validCommand = await command(bound.ref, records.map(value => ({ op: 'add', recordId: value.id, record: value })));
    actors.validateCommand(validCommand);
    const valid = await ack(gm, 'actor_consequence', validCommand);
    assert.equal(valid.success, true, JSON.stringify(valid)); observations.B6.valid = valid;
  });
  it('Bounds actual max edit refusal and explicit build replacement invalidate a pending command without stale-bound acceptance', async() => {
    const bound = await bind(); const peer = await member(), cmd = await command(bound.ref);
    const proposal = await ack(peer, 'actor_propose', cmd);
    const maxEdit = await ack(gm, 'token_updated', { roomId: room.id, mapId: 'default', tokenId: 'actor', updates: { state: { maxHp: 10 } } });
    assert.equal(maxEdit.code, 'actor_consequence_required'); assert.equal(actors.locate(room, bound.ref).token.state.maxHp, 50);
    gm.emit('token_removed', { roomId: room.id, mapId: 'default', tokenId: 'actor' }); await pause();
    const replacement = raw('actor'); replacement.stats.maxHp = 10; replacement.state.currentHp = 10;
    const created = await ack(gm, 'token_created', { roomId: room.id, mapId: 'default', token: replacement, creature: { stats: replacement.stats }, position: { x: 0, y: 0 } }); assert.equal(created.success, true, JSON.stringify(created));
    const token = room.gameState.maps.default.tokens.actor;
    const rebound = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'actor' }, snapshotHash: actors.hash(token) }); assert.equal(rebound.success, true);
    const before = JSON.stringify(room.gameState), stale = await ack(gm, 'actor_adjudicate', { roomId: room.id, proposalId: proposal.proposalId, contentHash: proposal.contentHash });
    assert.equal(stale.success, false); assert.equal(JSON.stringify(room.gameState), before);
    observations.bounds = { maxEdit, oldRef: bound.ref, newRef: rebound.ref, newMax: actors.locate(room, rebound.ref).token.state.maxHp, stale, noNewReceipt: !room.gameState.actorConsequences.receipts.length };
  });
});
