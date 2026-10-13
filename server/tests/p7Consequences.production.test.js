const assert = require('assert/strict');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const codec = require('../services/roomCheckpoint');
const actors = require('../services/actorConsequences');
const ack = (client, event, payload) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`ack timeout: ${event}`)), 4000);
  client.emit(event, payload, result => {clearTimeout(timer); resolve(result);});
});
const condition = (ref, id = 'slow-a', rounds = 3) => ({ version: 1, id, recordId: id, name: 'Slowed', originalName: 'slow', conditionKey: 'slowed',
  type: 'debuff', kind: 'effect', target: ref, targetId: ref.tokenId, targetType: ref.kind, source: 'arc_frost_touch', sharedTiming: 'manual',
  durationType: 'rounds', durationValue: 3, remainingRounds: rounds, effects: { movementSpeed: -10 } });

describe('P7 production registration/admission (A1–A7/A11 server layer)', function() {
  this.timeout(15000);
  let server, writer, gm, uid, room, refs, snapshot, clients;
  const observations = {};
  beforeEach(async() => {
    writer = new FirebaseBatchWriter(60000, 50, { shouldPersist: () => true, persist: async() => false });
    server = createProductionStackServer({ firebaseBatchWriter: writer });
    await server.start(); clients = [];
    server.setEventLimits('actor_bind', { maxPerMinute: 20000, maxPerSecond: 20000 });
    uid = server.nextUserId(); server.registerAuthToken('gm', uid);
    gm = server.connect({ token: 'gm' }); clients.push(gm);
    await new Promise(resolve => gm.once('connect', resolve));
    room = await server.seedRoom(gm.id, { gmUserId: uid, persistentRoomId: crypto.randomUUID() });
    refs = [];
    for (const tokenId of ['branvig-a', 'branvig-b']) {
      const token = { id: tokenId, creatureId: 'grimmstalk', ownerUserId: uid, stats: { maxHp: 250, maxMana: 30, maxAP: 5 },
        state: { currentHp: 250, currentMana: 30, currentActionPoints: 5, tempHealth: 4, tempMana: 0, tempActionPoints: 1, conditions: [] } };
      room.gameState.maps.default.tokens[tokenId] = token;
      room.gameState.tokens[tokenId] = token;
      const ref = { kind: 'creature', roomId: room.id, mapId: 'default', tokenId };
      const bound = await ack(gm, 'actor_bind', { roomId: room.id, ref, snapshotHash: actors.hash(token) });
      assert.equal(bound.success, true, JSON.stringify(bound)); refs.push(bound.ref);
    }
    snapshot = await ack(gm, 'actor_snapshot', { roomId: room.id });
  });
  afterEach(async() => {for (const client of clients) {client.disconnect();} await server.stop();});
  after(() => fs.writeFileSync(path.resolve(__dirname, '../../vtt-react/verification/p7/evidence/server-results.json'), JSON.stringify(observations, null, 2)));
  const command = (entries, extra = {}) => ({ version: 1, roomId: room.id, commandId: crypto.randomUUID(), actionEpoch: snapshot.actionEpoch,
    baseCommitSequence: snapshot.commitSequence, actors: entries, ...extra });
  const entry = (ref, finalResources, conditions) => ({ ref, expectedRevision: actors.locate(room, ref).contract.revision,
    ...(finalResources ? { finalResources } : {}), ...(conditions ? { conditions } : {}) });

  it('A1/A3/A11 exact two Feather Slash instances stage source temp AP and target temp HP with one receipt/checkpoint', async() => {
    const cmd = command([entry(refs[0], { ap: { current: 5, temp: 0 } }), entry(refs[1], { hp: { current: 239, temp: 0 } }, [{ op: 'add', recordId: 'slow-a', record: condition(refs[1]) }])], { source: refs[0], target: refs[1], adjudication: { definitionId: 'grimmstalk_feather_slash', chosenResult: 15, finalAmount: 15 } });
    const result = await ack(gm, 'actor_consequence', cmd);
    assert.equal(result.success, true, JSON.stringify(result)); assert.equal(result.status, 'accepted-live');
    assert.equal(actors.locate(room, refs[0]).token.state.currentHp, 250);
    assert.equal(actors.locate(room, refs[1]).token.state.currentHp, 239);
    const retained = writer.getRetainedSnapshot(room.id);
    assert.deepEqual(retained.actorConsequences.receipts[0], result.receipt);
    assert.equal(retained.actorConsequences.receipts[0].checkpointRevision, writer.getStatus(room.id).pendingRevision);
    assert.equal(retained.maps.default.tokens['branvig-b'].state.conditions[0].effects.movementSpeed, -10);
    const prepared = codec.buildCheckpointDocuments({ roomId: room.id, gameState: retained, revision: result.receipt.checkpointRevision });
    assert.equal(prepared.ok, true);
    const decoded = codec.decodeCanonicalCheckpoint({ checkpoint: prepared.manifest, globalDoc: prepared.global.data, mapDocsById: Object.fromEntries(prepared.maps.map(doc => [doc.mapId, doc.data])) });
    assert.equal(decoded.ok, true, JSON.stringify(decoded));
    assert.deepEqual(decoded.global.actorConsequences, retained.actorConsequences);
    observations.A3 = { result, checkpointOperations: prepared.operations, checkpointRequestBytes: prepared.requestEstimate, decoded: decoded.ok };
  });
  it('A1/A3 invalid target incarnation, condition, resource, revision and command bytes leave all actors/receipt unchanged', async() => {
    const before = JSON.stringify(room.gameState);
    const cases = [
      command([{ ref: { ...refs[1], instanceId: crypto.randomUUID() }, expectedRevision: 0, finalResources: { hp: { current: 1, temp: 0 } } }]),
      command([entry(refs[0], { ap: { current: 4, temp: 1 } }), entry(refs[1], { hp: { current: 1, temp: 0 } }, [{ op: 'remove', recordId: 'missing' }])], { source: refs[0], target: refs[1] }),
      command([entry(refs[0], { hp: { current: 251, temp: 0 } })]),
      command([{ ...entry(refs[0], { hp: { current: 1, temp: 0 } }), expectedRevision: 99 }]),
      command([entry(refs[0], { hp: { current: 1, temp: 0 } })], { adjudication: { adjustmentReason: 'é'.repeat(40000) } })
    ];
    for (const cmd of cases) {assert.equal((await ack(gm, 'actor_consequence', cmd)).success, false); assert.equal(JSON.stringify(room.gameState), before);}
    observations.A1 = { invalidCases: cases.length, zeroMutation: true };
  });
  it('A2 random/revoked member and lost lease cannot mutate or retrieve receipts', async() => {
    const memberUid = server.nextUserId(); server.registerAuthToken('member', memberUid);
    const member = server.connect({ token: 'member' }); clients.push(member);
    await new Promise(resolve => member.once('connect', resolve));
    const joined = new Promise(resolve => member.once('room_joined', resolve)); member.emit('join_room', { roomId: room.id, playerName: 'Member', password: '' }); await joined;
    const cmd = command([entry(refs[0], { hp: { current: 200, temp: 4 } })]);
    const before = JSON.stringify(room.gameState);
    assert.equal((await ack(member, 'actor_consequence', cmd)).code, 'authorization_required');
    const player = server.players.get(member.id); room.players.delete(player.id);
    assert.equal((await ack(member, 'actor_snapshot', { roomId: room.id })).success, false);
    server.authorityService.fenceLocal(room.id);
    assert.equal((await ack(gm, 'actor_consequence', cmd)).success, false);
    assert.equal(JSON.stringify(room.gameState), before); observations.A2 = { memberDenied: true, revokedDenied: true, fencedDenied: true };
  });
  it('A4 retry is immutable, changed content conflicts, concurrent revision accepts one, restart unknown refuses', async() => {
    const cmd = command([entry(refs[0], { hp: { current: 200, temp: 4 } })]);
    const first = await ack(gm, 'actor_consequence', cmd); assert.equal(first.success, true);
    const retry = await ack(gm, 'actor_consequence', cmd); assert.deepEqual(retry.receipt, first.receipt);
    assert.equal((await ack(gm, 'actor_consequence', { ...cmd, actors: [entry(refs[0], { hp: { current: 190, temp: 4 } })] })).code, 'command_id_conflict');
    const pair = [command([entry(refs[1], { hp: { current: 180, temp: 4 } })]), command([entry(refs[1], { hp: { current: 170, temp: 4 } })])];
    const outcomes = await Promise.all(pair.map(value => ack(gm, 'actor_consequence', value)));
    assert.equal(outcomes.filter(result => result.success).length, 1);
    const restoredRoom = { ...room, gameState: actors.clone(room.gameState) }; server.rooms.set(room.id, restoredRoom);
    assert.equal((await ack(gm, 'actor_consequence', command([entry(refs[0], { hp: { current: 199, temp: 4 } })]))).code, 'outcome_unknown');
    assert.deepEqual((await ack(gm, 'actor_consequence', cmd)).receipt, first.receipt);
    observations.A4 = { retry, concurrent: outcomes, knownOldReceipt: true, unknownOldEpoch: 'outcome_unknown' };
  });
  it('A3/A6 real writer capacity refuses before live publication; false cloud retains accepted state', async() => {
    const blocked = new FirebaseBatchWriter(60000, 50, { maxTrackedRooms: 1, maxRetainedRooms: 1, persist: () => new Promise(() => {}) });
    blocked.queueWrite('occupied', { maps: {} }, true); await Promise.resolve();
    // The same production writer object is used by the registered handler.
    writer.maxTrackedRooms = 1; writer.maxRetainedRooms = 1;
    writer.persist = () => new Promise(() => {});
    writer.pendingWrites.clear(); writer.roomStates.clear();
    writer.queueWrite('occupied', { maps: {} }, true); await Promise.resolve();
    const before = JSON.stringify(room.gameState);
    const refused = await ack(gm, 'actor_consequence', command([entry(refs[0], { hp: { current: 200, temp: 4 } })]));
    assert.equal(refused.success, false); assert.equal(JSON.stringify(room.gameState), before);
    blocked.stop(); observations.A6 = { capacityFailure: refused, zeroLiveMutation: true };
  });
  it('A5 protected sibling envelopes reject; movement and portrait remain permitted', async() => {
    const before = JSON.stringify(room.gameState);
    const packets = [['token_updated', { tokenId: refs[0].tokenId, updates: { currentHp: 1 } }],
      ['token_updated', { tokenId: refs[0].tokenId, updates: { state: { currentHp: 1 } } }],
      ['creature_updated', { creatureId: refs[0].tokenId, updates: { state: { conditions: [] } } }],
      ['character_resource_delta', { resource: 'health', delta: -100 }],
      ['character_resource_updated', { resource: 'actionPoints', current: 0 }],
      ['token_updated', { tokenId: refs[0].tokenId, updates: { state: null } }],
      ['buff_update', { type: 'buff_added', data: { id: 'legacy-effect', name: 'Effect', targetId: refs[0].tokenId } }],
      ['sync_tokens', { mapId: 'default', tokens: { injected: { id: 'injected', state: { currentHp: 1 } } } }],
      ['map_update', { targetMapId: 'default', mapUpdates: { tokens: { injected: { state: { actorContract: {} } } } } }]];
    for (const [event, payload] of packets) {
      assert.equal((await ack(gm, event, { roomId: room.id, mapId: 'default', ...payload })).code, 'actor_consequence_required');
      assert.equal(JSON.stringify(room.gameState), before);
    }
    const echo = new Promise(resolve => gm.once('token_updated', resolve));
    gm.emit('token_updated', { roomId: room.id, mapId: 'default', tokenId: refs[0].tokenId, updates: { customName: 'Portrait-safe' } }); await echo;
    assert.equal(actors.locate(room, refs[0]).token.customName, 'Portrait-safe');
    observations.A5 = { protectedCases: packets.length, unrelatedEdit: true };
    const classPatch = command([{ ref: refs[0], expectedRevision: 0, finalResources: { classResource: { arbitrary: 'not executable' } } }]);
    assert.equal((await ack(gm, 'actor_consequence', classPatch)).code, 'invalid_consequence');
  });
  it('A7 individual same-name records preserve round zero and private legacy fields never project', async() => {
    const records = [condition(refs[0], 'slow-a', 0), condition(refs[0], 'slow-b', 3)];
    assert.equal((await ack(gm, 'actor_consequence', command([entry(refs[0], null, records.map(record => ({ op: 'add', recordId: record.id, record })))]))).success, true);
    assert.equal((await ack(gm, 'actor_consequence', command([entry(refs[0], null, [{ op: 'remove', recordId: 'slow-a' }])]))).success, true);
    assert.deepEqual(actors.locate(room, refs[0]).token.state.conditions.map(record => record.id), ['slow-b']);
    const publicRecord = actors.publicCondition({ ...records[0], legacyRaw: { secret: 'private' }, effects: { movementSpeed: -10, secret: { private: true } } });
    assert.equal(publicRecord.legacyRaw, undefined); assert.deepEqual(publicRecord.effects, { movementSpeed: -10 });
    observations.A7 = { roundZero: publicRecord.remainingRounds, modifiers: publicRecord.effects, distinctIds: true };
  });
  it('A1 PC primary replacement invalidates the exact old incarnation; same UID different canonical character remains separate', async() => {
    server.setCharacterOwner('c-a', uid); server.setCharacterOwner('c-b', uid);
    const make = (id, characterId) => ({ id, ownerUserId: uid, character: { id: characterId, name: 'Same Name', health: { current: 30, max: 50 }, mana: { current: 20, max: 50 }, actionPoints: { current: 2, max: 3 }, tempHealth: 0, tempMana: 0, tempActionPoints: 0 }, state: { conditions: [] } });
    const bound = [];
    for (const [id, characterId] of [['pc-a','c-a'],['pc-b','c-b']]) {
      const token = make(id, characterId);room.gameState.maps.default.characterTokens[id]=token;
      const result = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: id, ownerUid: uid, characterId }, snapshotHash: actors.hash(token) });
      assert.equal(result.success,true,JSON.stringify(result));bound.push(result.ref);
    }
    const sibling=make('pc-extra','c-a');room.gameState.maps.default.characterTokens['pc-extra']=sibling;
    const bind = { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc-extra', ownerUid: uid, characterId: 'c-a' }, snapshotHash: actors.hash(sibling) };
    const before=JSON.stringify(room.gameState);
    assert.equal((await ack(gm,'actor_bind',bind)).code,'primary_attachment_exists');assert.equal(JSON.stringify(room.gameState),before);
    const replacement = await ack(gm, 'actor_bind', { ...bind, replacePrimaryRef: bound[0] });assert.equal(replacement.success,true);
    assert.equal(room.gameState.maps.default.characterTokens['pc-a'].state.actorContract.primary,false);
    const stale = command([{ ref: bound[0], expectedRevision: 0, finalResources: { hp: { current: 1, temp: 0 } } }]);
    assert.equal((await ack(gm,'actor_consequence',stale)).code,'actor_binding_conflict');
    assert.equal(actors.locate(room,bound[1]).token.character.health.current,30);
    observations.A1.primaryReplacement = { old: bound[0], replacement: replacement.ref, sameUidDifferentCharacter: true };
  });
  it('A2 exact delegate proposal requires immutable GM authorization and rechecks revoked delegation', async() => {
    const delegateUid=server.nextUserId();server.registerAuthToken('delegate',delegateUid);
    const delegate = server.connect({ token: 'delegate' });clients.push(delegate);await new Promise(resolve=>delegate.once('connect',resolve));
    const joined = new Promise(resolve=>delegate.once('room_joined',resolve));delegate.emit('join_room', { roomId: room.id, playerName: 'Delegate', password: '' });await joined;
    const key=`${room.id}:default:${refs[0].tokenId}`;
    room.tokenControllers = { [key]: { roomId: room.id, mapId: 'default', tokenId: refs[0].tokenId, controllerUserId: delegateUid } };
    const cmd = command([entry(refs[0], { ap: { current: 4, temp: 1 } }),entry(refs[1], { hp: { current: 210, temp: 0 } })], { source: refs[0], target: refs[1] });
    const before=JSON.stringify(room.gameState);
    assert.equal((await ack(delegate,'actor_consequence',cmd)).code,'authorization_required');
    const proposal=await ack(delegate,'actor_propose',cmd);assert.equal(proposal.code,'awaiting_authorization');assert.equal(JSON.stringify(room.gameState),before);
    assert.equal((await ack(gm, 'actor_adjudicate', { roomId: room.id, proposalId: proposal.proposalId, contentHash: 'wrong' })).code, 'command_id_conflict');
    const accepted = await ack(gm, 'actor_adjudicate', { roomId: room.id, proposalId: proposal.proposalId, contentHash: proposal.contentHash });assert.equal(accepted.success,true,JSON.stringify(accepted));
    assert.equal(accepted.receipt.submitterUid,delegateUid);assert.equal(accepted.receipt.authorization.authorizerUid,uid);
    const cmd2 = command([entry(refs[0], { ap: { current: 3, temp: 1 } }),entry(refs[1], { hp: { current: 200, temp: 0 } })], { source: refs[0], target: refs[1] });
    const proposal2=await ack(delegate,'actor_propose',cmd2);delete room.tokenControllers[key];
    assert.equal((await ack(gm, 'actor_adjudicate', { roomId: room.id, proposalId: proposal2.proposalId, contentHash: proposal2.contentHash })).code, 'forbidden');
    observations.A2.immutableGMProposal=true;
  });
  it('A2 lease/backend await race cannot admit old work into replaced runtime or changed principal', async() => {
    const validate=server.authorityBackend.validate;
    let release;let entered;
    const waiting=new Promise(resolve=>{entered=resolve;});
    server.authorityBackend.validate=async args=>{entered();await new Promise(resolve=>{release=resolve;});return validate(args);};
    const before=JSON.stringify(room.gameState);
    const sending = ack(gm, 'actor_consequence', command([entry(refs[0], { hp: { current: 200, temp: 0 } })]));
    await waiting;
    server.rooms.set(room.id, { ...room, gameState: actors.clone(room.gameState) });release();
    const result=await sending;assert.equal(result.success,false);assert.equal(JSON.stringify(room.gameState),before);
    server.authorityBackend.validate=validate;
    observations.A2.runtimeAwaitRace=result;
  });
  it('A4/A6 confirmed-prefix pruning and actual failed checkpoint retention distinguish durable retry from fresh epoch', async() => {
    server.setEventLimits('actor_consequence', { maxPerMinute: 20000, maxPerSecond: 20000 });
    const accepted=[];
    for (let index=0;index<256;index++) {
      const cmd = command([entry(refs[0], { hp: { current: 200+index%2, temp: 4 } })]);
      const result = await ack(gm,'actor_consequence',cmd);assert.equal(result.success,true,JSON.stringify(result));accepted.push({ cmd, result });
    }
    const refused = await ack(gm,'actor_consequence',command([entry(refs[0], { hp: { current: 190, temp: 4 } })]));assert.equal(refused.code,'receipt_capacity');
    await writer.flush();assert.equal(writer.getStatus(room.id).cloudSaved,false);assert.equal(writer.getRetainedSnapshot(room.id).actorConsequences.receipts.length,256);
    writer.persist = async()=>({ outcome: 'confirmed' });const durable=writer.getRetainedSnapshot(room.id);await writer._flushRooms({ force: true, only: room.id });
    snapshot.commitSequence=256;
    const pruned = await ack(gm,'actor_consequence',command([entry(refs[0], { hp: { current: 190, temp: 4 } })]));assert.equal(pruned.success,true);
    assert.equal(actors.ledger(room).replayFloor,1);assert.equal(actors.ledger(room).receipts.length,256);
    assert.equal((await ack(gm,'actor_consequence',accepted[0].cmd)).code,'retry_window_expired');
    assert.deepEqual((await ack(gm,'actor_consequence',accepted[1].cmd)).receipt,accepted[1].result.receipt);
    const restored = { ...room, gameState: durable, checkpointRevision: writer.getStatus(room.id).confirmedRevision };server.rooms.set(room.id,restored);
    assert.equal((await ack(gm,'actor_consequence',accepted[255].cmd)).status,'checkpoint-confirmed');
    const unknown = { ...accepted[255].cmd, commandId: crypto.randomUUID() };assert.equal((await ack(gm,'actor_consequence',unknown)).code,'outcome_unknown');
    observations.A4.pruning = { limit: 256, unconfirmedRefused: true, confirmedFloor: 1, durableOldRetry: true, freshEpochUnknown: true };
  });
  it('A2 a verified-principal change during backend authorization cannot inherit the old GM session', async() => {
    const validate = server.authorityBackend.validate;
    let release, entered;
    const waiting = new Promise(resolve => { entered = resolve; });
    server.authorityBackend.validate = async args => { entered(); await new Promise(resolve => { release = resolve; }); return validate(args); };
    const before = JSON.stringify(room.gameState);
    const sending = ack(gm, 'actor_consequence', command([entry(refs[0], { hp: { current: 200, temp: 0 } })]));
    await waiting;
    server.io.sockets.sockets.get(gm.id).data.userId = 'changed-principal';
    release();
    const result = await sending;
    assert.equal(result.success, false); assert.equal(JSON.stringify(room.gameState), before);
    server.authorityBackend.validate = validate;
    observations.A2.principalAwaitRace = result;
  });
  it('A1 non-default map and deletion/replacement never redirect an old incarnation', async() => {
    room.gameState.maps.arena = { ...actors.clone(room.gameState.maps.default), id: 'arena', tokens: {}, characterTokens: {} };
    const token = { id: 'arena-token', ownerUserId: uid, stats: { maxHp: 250, maxMana: 30, maxAP: 5 },
      state: { currentHp: 250, currentMana: 30, currentActionPoints: 5, conditions: [] } };
    room.gameState.maps.arena.tokens[token.id] = token;
    const locator = { kind: 'creature', roomId: room.id, mapId: 'arena', tokenId: token.id };
    const bound = await ack(gm, 'actor_bind', { roomId: room.id, ref: locator, snapshotHash: actors.hash(token) });
    assert.equal(bound.success, true);
    const wrongMap = command([{ ref: { ...bound.ref, mapId: 'default' }, expectedRevision: 0, finalResources: { hp: { current: 20, temp: 0 } } }]);
    assert.equal((await ack(gm, 'actor_consequence', wrongMap)).code, 'actor_not_found');
    const removal = new Promise(resolve => gm.once('token_removed', resolve));
    gm.emit('token_removed', { roomId: room.id, mapId: 'arena', tokenId: token.id }); await removal;
    room.gameState.maps.arena.tokens[token.id] = actors.clone(token);
    const replaced = await ack(gm, 'actor_bind', { roomId: room.id, ref: locator, snapshotHash: actors.hash(token) });
    assert.equal(replaced.success, true); assert.notEqual(replaced.ref.instanceId, bound.ref.instanceId);
    const old = command([{ ref: bound.ref, expectedRevision: 0, finalResources: { hp: { current: 20, temp: 0 } } }]);
    assert.equal((await ack(gm, 'actor_consequence', old)).code, 'actor_binding_conflict');
    assert.equal(actors.locate(room, replaced.ref).token.state.currentHp, 250);
    observations.A1.nonDefaultDeleteReplacement = true;
  });
  it('A3/A6 actual UTF-8 receipt byte pressure and non-finite snapshot refuse without publication', async() => {
    for (let index = 0; index < 8; index += 1) {
      const record = { ...condition(refs[0], `large-${index}`), description: 'é'.repeat(25000) };
      const cmd = command([entry(refs[0], null, [{ op: 'add', recordId: record.id, record }])]);
      assert(actors.bytes(cmd) < 65536);
      const before = JSON.stringify(room.gameState), result = await ack(gm, 'actor_consequence', cmd);
      if (!result.success) {
        assert.equal(result.code, 'receipt_capacity'); assert.equal(JSON.stringify(room.gameState), before);
        observations.A6.receiptBytePressure = { retainedBytes: actors.bytes(actors.ledger(room).receipts), rejectedAt: index, noPublication: true }; break;
      }
    }
    assert(observations.A6.receiptBytePressure); assert(observations.A6.receiptBytePressure.retainedBytes <= 512 * 1024);
    room.gameState.futureInvalidNumber = NaN;
    const result = await ack(gm, 'actor_consequence', command([entry(refs[0], { hp: { current: 200, temp: 0 } })]));
    assert.equal(result.code, 'CHECKPOINT_INVALID'); assert(Number.isNaN(room.gameState.futureInvalidNumber));
  });
  it('A7 absolute clocks, manual marker/effect IDs and raw private legacy candidates remain lossless', async() => {
    const absolute = { ...condition(refs[0], 'absolute'), durationType: 'seconds', startTime: 0, endTime: 1000, duration: 1 };
    delete absolute.remainingRounds; delete absolute.durationValue;
    const marker = { ...condition(refs[0], 'defending-marker'), name: 'Defending', type: 'marker', kind: 'marker', durationType: 'manual' };
    const effect = { ...condition(refs[0], 'defending-effect'), name: 'Defending', type: 'buff', effects: { armor: 2 } };
    const result = await ack(gm, 'actor_consequence', command([entry(refs[0], null, [absolute, marker, effect].map(record => ({ op: 'add', recordId: record.id, record })))]));
    assert.equal(result.success, true); assert.equal(result.receipt.actors[0].conditions[0].startTime, 0); assert.equal(result.receipt.actors[0].conditions[0].endTime, 1000);
    const legacy = { id: 'legacy-only', ownerUserId: uid, stats: { maxHp: 10, maxMana: 0, maxAP: 2 },
      state: { currentHp: 10, currentMana: 0, currentActionPoints: 2, conditions: [{ id: 'unknown', name: 'Private legacy', durationType: 'rounds', remainingRounds: 0, secretBlob: { notes: 'not public' } }] } };
    room.gameState.maps.default.tokens[legacy.id] = legacy;
    const bound = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: legacy.id }, snapshotHash: actors.hash(legacy) });
    assert.equal(bound.success, true); assert.equal(JSON.stringify(bound).includes('not public'), false);
    const recovered = await ack(gm, 'actor_recovery', { roomId: room.id, ref: bound.ref });
    assert.equal(recovered.recovery.actorRecovery.legacyConditions[0].secretBlob.notes, 'not public');
    observations.A7.absoluteAndLegacy = { startTime: 0, endTime: 1000, separateDefendingIds: true, rawRecoverableNotPublic: true };
  });
  it('A8 cooperative advancement does not apply foreign AP; explicit GM approval accepts the same pending result', async() => {
    const otherUid = server.nextUserId(); server.registerAuthToken('cooperator', otherUid);
    const client = server.connect({ token: 'cooperator' }); clients.push(client); await new Promise(resolve => client.once('connect', resolve));
    const joined = new Promise(resolve => client.once('room_joined', resolve)); client.emit('join_room', { roomId: room.id, playerName: 'Cooperator', password: '' }); await joined;
    const started = await ack(gm, 'combat_started', { roomId: room.id, turnOrder: refs.map(ref => ({ tokenId: ref.tokenId, actorRef: ref, currentActionPoints: 0 })), currentTurnIndex: 0, round: 1 });
    assert.equal(started.success, true);
    const transitioned = new Promise(resolve => client.once('combat_turn_changed', resolve));
    client.emit('combat_turn_changed', { roomId: room.id, currentTurnIndex: 1, round: 1, turnOrder: refs.map(ref => ({ tokenId: ref.tokenId, actorRef: ref, currentActionPoints: 0 })) }); await transitioned;
    assert.equal(actors.locate(room, refs[1]).token.state.currentActionPoints, 5);
    assert.equal(room.gameState.combat.turnOrder[1].resourceConsequenceStatus, 'awaiting_authorization');
    const cmd = command([entry(refs[1], { ap: { current: 2, temp: 1 } })]);
    assert.equal((await ack(client, 'actor_consequence', cmd)).code, 'authorization_required');
    const proposed = await ack(client, 'actor_propose', cmd); assert.equal(proposed.code, 'awaiting_authorization');
    const accepted = await ack(gm, 'actor_adjudicate', { roomId: room.id, proposalId: proposed.proposalId, contentHash: proposed.contentHash });
    assert.equal(accepted.success, true); assert.equal(actors.locate(room, refs[1]).token.state.currentActionPoints, 2);
    assert.equal(accepted.receipt.authorization.kind, 'member-proposal-gm'); observations.A8 = { cooperative: true, resourceAwaitedAuthorization: true };
  });
  it('A11 pre-adjudicated Slug and Restorative Prayer common-pool fixtures execute without class payments or controllers', async() => {
    const fixtures = [
      { definitionId: 'arc_spark_bolt', class: 'Arcanoneer', amount: 11, source: { mana: { current: 26, temp: 0 }, ap: { current: 4, temp: 1 } }, hp: 239,
        classResource: { type: 'arcane_spheres', spheres: ['arcane_sphere', 'arcane_sphere'] } },
      { definitionId: 'martyr_restorative_prayer', class: 'Martyr', amount: 6, source: { mana: { current: 25, temp: 0 }, ap: { current: 4, temp: 1 } }, hp: 245,
        classResource: { type: 'devotionGauge', current: 2, max: 6, damage: 62, spentLevels: 2, earnedLevels: 4, bonusLevels: 0 } }
    ];
    for (const fixture of fixtures) {
      const characterId = `fixture-${fixture.definitionId}`;
      server.setCharacterOwner(characterId, uid);
      const token = { id: characterId, ownerUserId: uid, state: { conditions: [] }, character: { id: characterId, class: fixture.class,
        health: { current: 30, max: 50 }, mana: { current: 30, max: 30 }, actionPoints: { current: 5, max: 5 }, tempHealth: 0, tempMana: 0, tempActionPoints: 1,
        classResource: fixture.classResource } };
      room.gameState.maps.default.characterTokens[token.id] = token;
      const bound = await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: token.id, ownerUid: uid, characterId }, snapshotHash: actors.hash(token) });
      assert.equal(bound.success, true);
      const result = await ack(gm, 'actor_consequence', command([entry(bound.ref, fixture.source), entry(refs[1], { hp: { current: fixture.hp, temp: 4 } })],
        { source: bound.ref, target: refs[1], adjudication: { definitionId: fixture.definitionId, chosenResult: fixture.amount, finalAmount: fixture.amount, adjustmentReason: 'Pre-adjudicated physical fixture; already resolved' } }));
      assert.equal(result.success, true); assert.equal(result.receipt.adjudication.definitionId, fixture.definitionId);
      assert.equal(result.receipt.actors[1].finalResources.hp.current, fixture.hp);
      assert.deepEqual(actors.locate(room, bound.ref).token.character.classResource, fixture.classResource);
    }
    observations.A11 = { fixtures: fixtures.map(value => value.definitionId), preAdjudicatedOnly: true, classPaymentNotImplemented: true };
  });
});
