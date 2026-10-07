/**
 * Project 3 final bounded correction regressions.
 *
 * Covers the eight remaining senior findings: migration retry fingerprint,
 * legacy rollback artifact restore, scratch target refusal, selected-writer
 * restore + shared metadata, and the server-mediated metadata edit pathway.
 */

const { expect } = require('chai');
const sinon = require('sinon');
const fs = require('fs');
const os = require('os');
const path = require('path');

const roomCheckpoint = require('../services/roomCheckpoint');
const roomCheckpointExport = require('../services/roomCheckpointExport');
const testAuthorityFor = (roomId) => ({ roomId, authorityInstanceId: 'test-instance', authorityGeneration: 1 });
const restoreScratch = (args) => roomCheckpointExport.restoreArtifactToScratch({ ...args, authority: args.authority || testAuthorityFor(args.scratchRoomId) });
const publishCanonical = (args) => roomCheckpointExport.publishCanonicalMetadataEdit({ ...args, authority: args.authority || testAuthorityFor(args.roomId) });
const firebaseService = require('../services/firebaseService');
const {
  FirebaseBatchWriter,
  validateRoomSnapshot
} = require('../services/syncService');
const syncHandlers = require('../handlers/syncHandlers');
const {
  makeFakeDb,
  loadFirebaseServiceWithFakeDb,
  buildGameState
} = require('./helpers/fakeCheckpointFirestore');
const { createProductionStackServer } = require('./helpers/productionStackServer');

const once = (socket, event, timeoutMs = 5000) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`timeout waiting for "${event}"`)), timeoutMs);
  socket.once(event, (payload) => { clearTimeout(timer); resolve(payload); });
});
const connected = (socket) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error('timeout waiting for connect')), 5000);
  socket.once('connect', () => { clearTimeout(timer); resolve(); });
  socket.once('connect_error', (err) => { clearTimeout(timer); reject(err); });
});
const emitAck = (socket, event, payload, timeoutMs = 5000) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`timeout waiting for ${event} ack`)), timeoutMs);
  socket.emit(event, payload, (response) => { clearTimeout(timer); resolve(response); });
});

const socketStub = (id = 'socket') => ({
  id,
  data: { userId: 'owner' },
  handlers: {},
  emitted: [],
  on(event, handler) { this.handlers[event] = handler; },
  emit(event, payload) { this.emitted.push({ event, payload }); },
  join() {},
  to: () => ({ emit() {} })
});

const migrationWriter = (service, room) => new FirebaseBatchWriter(60000, 50, {
  captureMetadata: () => ({
    name: room.name,
    description: room.description ?? null,
    settings: room.settings || {},
    provenance: room.pendingProvenance || null,
    explicitConversion: room.pendingExplicitConversion === true,
    migrationRequired: room.migrationRequired === true
  }),
  validateSnapshot: validateRoomSnapshot,
  persist: (id, snapshot, context) => service.publishRoomCheckpoint(id, snapshot, { ...context, authority: { roomId: id, authorityInstanceId: 'test-instance', authorityGeneration: 1 } })
});

describe('P3 final corrections — migration retry fingerprint (F4)', function() {
  this.timeout(20000);

  let fake;
  let service;
  let restore;
  let exportDir;
  let previousDir;
  const writers = [];

  const setup = () => {
    fake = makeFakeDb();
    const loaded = loadFirebaseServiceWithFakeDb(fake.db);
    service = loaded.service;
    restore = loaded.restore;
    exportDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p3-final-f4-'));
    previousDir = process.env.ROOM_EXPORT_DIR;
    process.env.ROOM_EXPORT_DIR = exportDir;
  };

  const teardown = () => {
    for (const writer of writers.splice(0)) {writer.stop();}
    if (previousDir === undefined) {delete process.env.ROOM_EXPORT_DIR;}
    else {process.env.ROOM_EXPORT_DIR = previousDir;}
    fs.rmSync(exportDir, { recursive: true, force: true });
    sinon.restore();
    restore();
  };

  const makeMigrationRoom = (id, sourceState) => {
    fake.setDocument(`rooms/${id}`, { id, name: 'Review', settings: {}, gameState: sourceState });
    const room = {
      id,
      isPermanent: true,
      name: 'Review',
      settings: {},
      gameState: buildGameState(),
      migrationRequired: true,
      checkpointRevision: 0,
      players: new Map(),
      gm: { id: 'gm' }
    };
    const writer = migrationWriter(service, room);
    writers.push(writer);
    const socket = socketStub('gm');
    const ctx = {
      socket,
      rooms: new Map([[room.id, room]]),
      players: new Map([['gm', { id: 'gm', isGM: true, roomId: room.id }]]),
      io: { to: () => ({ emit() {} }), emit() {} },
      logger: { debug() {}, info() {}, warn() {}, error() {} },
      firebaseService: service,
      firebaseBatchWriter: writer
    };
    syncHandlers.registerSyncHandlers(ctx);
    return { room, writer, socket };
  };

  it('F4.1: failed conversion retry re-verifies the source and refuses a changed source', async() => {
    setup();
    try {
      const { room, socket } = makeMigrationRoom('migration', buildGameState());
      fake.setBehavior(() => 'reject');
      await socket.handlers.save_room_state_request({});
      expect(room.pendingExplicitConversion).to.equal(true);
      expect(room.pendingSourceFingerprint).to.be.a('string');
      expect(socket.emitted.some((entry) => entry.event === 'room_state_save_error')).to.equal(true);
      expect(fake.stored.get('rooms/migration').checkpoint).to.equal(undefined);

      fake.setDocument('rooms/migration', {
        id: 'migration',
        name: 'Review',
        settings: {},
        gameState: buildGameState({ globalExtra: { marker: 'changed after export' } })
      });
      fake.setBehavior(() => null);

      await socket.handlers.save_room_state_request({});
      const error = socket.emitted.filter((entry) => entry.event === 'room_state_save_error').pop();
      expect(error.payload.code).to.equal('MIGRATION_SOURCE_CHANGED');
      expect(fake.stored.get('rooms/migration').gameState).to.not.equal(undefined);
      expect(fake.stored.get('rooms/migration').checkpoint).to.equal(undefined);
      expect(socket.emitted.some((entry) => entry.event === 'room_state_saved')).to.equal(false);
    } finally {
      teardown();
    }
  });

  it('F4.2: unchanged source retry after a failed commit proceeds to confirmed conversion', async() => {
    setup();
    try {
      const { room, socket } = makeMigrationRoom('retry-ok', buildGameState());
      fake.setBehavior(() => 'reject');
      await socket.handlers.save_room_state_request({});
      expect(room.pendingExplicitConversion).to.equal(true);
      fake.setBehavior(() => null);

      await socket.handlers.save_room_state_request({});
      expect(socket.emitted.some((entry) => entry.event === 'room_state_saved')).to.equal(true);
      const root = fake.stored.get('rooms/retry-ok');
      expect(root.checkpoint).to.exist;
      expect(root.checkpoint.provenance.kind).to.equal('legacy-inline');
      expect(root.gameState).to.equal(undefined);
    } finally {
      teardown();
    }
  });

  it('F4.3: ambiguous and unknown-newer sources remain non-convertible on retry', async() => {
    setup();
    try {
      fake.setDocument('rooms/ambiguous-retry', {
        id: 'ambiguous-retry',
        name: 'Review',
        settings: {},
        gameState: buildGameState({ globalExtra: { marker: 'inline' } })
      });
      fake.setDocument('rooms/ambiguous-retry/gameState/current', {
        defaultMapId: 'default',
        combat: { isActive: false, currentTurn: null, turnOrder: [], round: 0 },
        marker: 'split'
      });
      fake.setDocument('rooms/ambiguous-retry/gameState/default', {
        id: 'default', tokens: {}, characterTokens: {}, gridItems: {}
      });
      const room = {
        id: 'ambiguous-retry',
        isPermanent: true,
        name: 'Review',
        settings: {},
        gameState: buildGameState({ globalExtra: { marker: 'live accepted' } }),
        migrationRequired: true,
        checkpointRevision: 0,
        players: new Map(),
        gm: { id: 'gm' }
      };
      const writer = migrationWriter(service, room);
      writers.push(writer);
      const socket = socketStub('gm');
      const ctx = {
        socket,
        rooms: new Map([[room.id, room]]),
        players: new Map([['gm', { id: 'gm', isGM: true, roomId: room.id }]]),
        io: { to: () => ({ emit() {} }), emit() {} },
        logger: { debug() {}, info() {}, warn() {}, error() {} },
        firebaseService: service,
        firebaseBatchWriter: writer
      };
      syncHandlers.registerSyncHandlers(ctx);

      await socket.handlers.save_room_state_request({});
      const error = socket.emitted.filter((entry) => entry.event === 'room_state_save_error').pop();
      expect(error.payload.code).to.equal('MIGRATION_EXPORT_REQUIRED');
      expect(room.pendingExplicitConversion).to.not.equal(true);
      expect(fake.stored.get('rooms/ambiguous-retry').checkpoint).to.equal(undefined);

      const classification = await service.readRoomCheckpoint('ambiguous-retry');
      expect(classification.selection.status).to.equal('AMBIGUOUS_RECONCILIATION_REQUIRED');
      expect(roomCheckpointExport.isConvertibleClassification(classification)).to.equal(false);
    } finally {
      teardown();
    }
  });
});

describe('P3 final corrections — legacy artifact restore (F5/F6/F7)', function() {
  this.timeout(20000);

  let fake;
  let service;
  let restore;
  let exportDir;
  let previousDir;

  const setup = async() => {
    fake = makeFakeDb();
    const loaded = loadFirebaseServiceWithFakeDb(fake.db);
    service = loaded.service;
    restore = loaded.restore;
    exportDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p3-final-f5-'));
    previousDir = process.env.ROOM_EXPORT_DIR;
    process.env.ROOM_EXPORT_DIR = exportDir;
    fake.setDocument('rooms/legacy-source', {
      id: 'legacy-source',
      name: 'Legacy valuable',
      description: 'kept description',
      settings: { difficulty: 8 },
      gameState: buildGameState({ mapCount: 2, globalExtra: { marker: 'legacy valuable' } })
    });
    const exported = await roomCheckpointExport.ensureRollbackArtifact('legacy-source', service);
    expect(exported.ok).to.equal(true);
    return exported;
  };

  const teardown = () => {
    if (previousDir === undefined) {delete process.env.ROOM_EXPORT_DIR;}
    else {process.env.ROOM_EXPORT_DIR = previousDir;}
    fs.rmSync(exportDir, { recursive: true, force: true });
    sinon.restore();
    restore();
  };

  it('F5.1: a complete LEGACY_INLINE_ONLY artifact validates and restores into a clean scratch room', async() => {
    const exported = await setup();
    try {
      expect(exported.artifact.classification).to.equal('LEGACY_INLINE_ONLY');
      expect(exported.artifact.checkpoint).to.equal(null);
      const validation = roomCheckpointExport.validateArtifact(exported.artifact);
      expect(validation.ok, JSON.stringify(validation.errors)).to.equal(true);

      const restored = await restoreScratch({
        artifactPath: exported.path,
        scratchRoomId: 'scratch_legacy',
        firebaseService: service
      });
      expect(restored.ok, JSON.stringify(restored)).to.equal(true);

      const scratch = await service.readRoomCheckpoint('scratch_legacy');
      expect(scratch.kind).to.equal('CANONICAL_COMPLETE_CHECKPOINT');
      expect(scratch.checkpoint.provenance.kind).to.equal('restore');
      expect(scratch.selectedSnapshot.mapIds).to.deep.equal(['default', 'map-1']);
      expect(scratch.selectedSnapshot.global.marker).to.equal('legacy valuable');
      expect(scratch.selectedSnapshot.maps.default.drawingPaths)
        .to.deep.equal(exported.artifact.mapFragments[0].data.drawingPaths);
    } finally {
      teardown();
    }
  });

  it('F5.2: malformed legacy artifacts and ambiguous selections are rejected, not loosened', async() => {
    const exported = await setup();
    try {
      const malformed = JSON.parse(JSON.stringify(exported.artifact));
      delete malformed.rawCandidates.inline;
      malformed.sha256 = roomCheckpointExport.computeArtifactChecksum(malformed);
      const malformedValidation = roomCheckpointExport.validateArtifact(malformed);
      expect(malformedValidation.ok).to.equal(false);
      expect(malformedValidation.errors).to.include('artifact_raw_candidate_missing');

      const tamperedData = JSON.parse(JSON.stringify(exported.artifact));
      tamperedData.globalData.marker = 'tampered';
      tamperedData.sha256 = roomCheckpointExport.computeArtifactChecksum(tamperedData);
      const tamperedValidation = roomCheckpointExport.validateArtifact(tamperedData);
      expect(tamperedValidation.ok).to.equal(false);
      expect(tamperedValidation.errors.some((error) => error.startsWith('artifact_selected_data_mismatch'))).to.equal(true);

      const ambiguous = JSON.parse(JSON.stringify(exported.artifact));
      ambiguous.classification = 'LEGACY_BOTH_INLINE_SPLIT';
      ambiguous.selectionDecision = { status: 'AMBIGUOUS_RECONCILIATION_REQUIRED' };
      ambiguous.sha256 = roomCheckpointExport.computeArtifactChecksum(ambiguous);
      const ambiguousValidation = roomCheckpointExport.validateArtifact(ambiguous);
      expect(ambiguousValidation.ok).to.equal(false);
      expect(ambiguousValidation.errors).to.include('artifact_ambiguous_selection');
    } finally {
      teardown();
    }
  });

  it('F6.1: existing active, named and occupied scratch targets are refused before any write', async() => {
    const exported = await setup();
    try {
      fake.setDocument('rooms/scratch_active_unowned', {
        id: 'scratch_active_unowned',
        name: 'Active valuable target',
        checkpoint: null,
        isActive: true,
        settings: { difficulty: 9 }
      });
      fake.setDocument('rooms/scratch_named', {
        id: 'scratch_named',
        name: 'Named target',
        description: 'valuable',
        checkpoint: null,
        isActive: false
      });
      await service.publishRoomCheckpoint('scratch_occupied', buildGameState(), {
        authority: { roomId: 'scratch_occupied', authorityInstanceId: 'test-instance', authorityGeneration: 1 }, revision: 1 });

      const before = fake.batchCommits.length;
      const active = await restoreScratch({
        artifactPath: exported.path, scratchRoomId: 'scratch_active_unowned', firebaseService: service
      });
      const named = await restoreScratch({
        artifactPath: exported.path, scratchRoomId: 'scratch_named', firebaseService: service
      });
      const occupied = await restoreScratch({
        artifactPath: exported.path, scratchRoomId: 'scratch_occupied', firebaseService: service
      });

      expect(active.ok).to.equal(false);
      expect(active.reason).to.match(/scratch_target_not_empty/);
      expect(named.ok).to.equal(false);
      expect(named.reason).to.match(/scratch_target_not_empty/);
      expect(occupied.ok).to.equal(false);
      expect(occupied.reason).to.equal('scratch_target_not_empty');
      expect(fake.batchCommits.length).to.equal(before);
      expect(fake.stored.get('rooms/scratch_active_unowned').checkpoint).to.equal(null);
      expect(fake.stored.get('rooms/scratch_named').description).to.equal('valuable');
    } finally {
      teardown();
    }
  });

  it('F7.1: restore publishes through the selected P2 writer and preserves shared metadata', async() => {
    const exported = await setup();
    try {
      // The restore fixture lazily requires syncService; spy on the live
      // module copy so this instrument stays valid even after another suite
      // (integration.test.js) cleared require.cache.
      const liveSyncService = require('../services/syncService');
      const spy = sinon.spy(liveSyncService.FirebaseBatchWriter.prototype, 'saveNow');
      const restored = await restoreScratch({
        artifactPath: exported.path,
        scratchRoomId: 'scratch_writer',
        firebaseService: service
      });
      expect(restored.ok, JSON.stringify(restored)).to.equal(true);
      expect(spy.called).to.equal(true);
      spy.restore();

      const target = fake.stored.get('rooms/scratch_writer');
      expect(target.name).to.equal(exported.artifact.roomMetadata.name);
      expect(target.description).to.equal(exported.artifact.roomMetadata.description);
      expect(target.settings).to.deep.equal(exported.artifact.roomMetadata.settings);
      expect(target.checkpoint.revision).to.equal(1);
      expect(target.checkpoint.provenance.rollbackArtifactSha256).to.equal(exported.artifact.sha256);
    } finally {
      teardown();
    }
  });

  it('F7.2: a failed selected writer leaves the scratch target non-confirmed', async() => {
    const exported = await setup();
    try {
      sinon.stub(service, 'updateRoomGameState').resolves({ outcome: 'permanent', reason: 'forced_failure' });
      const failed = await restoreScratch({
        artifactPath: exported.path,
        scratchRoomId: 'scratch_failed',
        firebaseService: service
      });
      expect(failed.ok).to.equal(false);
      expect(failed.reason).to.match(/scratch_publish_permanent/);
      expect(fake.stored.get('rooms/scratch_failed')).to.equal(undefined);
    } finally {
      teardown();
    }
  });
});

describe('P3 final corrections — server-mediated metadata edit (F8)', function() {
  this.timeout(20000);

  it('F8.1: registered GM metadata edit checkpoints through the selected writer and broadcasts', async() => {
    const saves = [];
    const server = createProductionStackServer({
      firebaseBatchWriter: {
        saveNow: async(roomId) => { saves.push(roomId); return { outcome: 'confirmed', revision: 9 }; },
        queueWrite: () => {}
      }
    });
    await server.start();
    server.setEventLimits('create_room', { maxPerMinute: 100, maxPerSecond: 100 });
    server.setEventLimits('update_room_metadata', { maxPerMinute: 100, maxPerSecond: 100 });

    let client;
    let observer;
    try {
      const token = 'meta-owner-token';
      const owner = server.nextUserId('owner');
      server.registerAuthToken(token, owner);
      sinon.stub(firebaseService, 'readRoomCheckpoint').resolves({
        kind: 'CANONICAL_COMPLETE_CHECKPOINT',
        roomId: 'meta-room',
        readOnly: true,
        diagnostics: [],
        checkpoint: { schemaVersion: 1, revision: 87, mapIds: ['default'], committed: true, contentHash: 'a'.repeat(64) },
        revision: 87,
        selectedCandidateId: 'canonical',
        selectedSnapshot: {
          global: { defaultMapId: 'default', combat: null, playerMapAssignments: {} },
          maps: { default: { id: 'default', name: 'Default', tokens: {}, characterTokens: {}, gridItems: {} } },
          mapIds: ['default']
        },
        migrationRequired: false,
        roomMetadata: { gmId: owner, name: 'Review', members: [owner], settings: {} },
        candidates: { inline: null, split: null },
        selection: null
      });
      client = server.connect({ token });
      await connected(client);
      const joined = once(client, 'room_joined');
      client.emit('create_room', { gmName: 'GM', persistentRoomId: 'meta-room', password: '' });
      await joined;
      const room = server.rooms.get('meta-room');

      const broadcast = once(client, 'room_metadata_updated');
      const ack = await emitAck(client, 'update_room_metadata', {
        name: 'Renamed Hall',
        description: 'A new description',
        settings: { maxPlayers: 8 }
      });
      expect(ack.success).to.equal(true);
      expect(ack.outcome).to.equal('confirmed');
      expect(room.name).to.equal('Renamed Hall');
      expect(room.description).to.equal('A new description');
      expect(room.settings.maxPlayers).to.equal(8);
      expect(saves).to.deep.equal([room.id]);
      const payload = await broadcast;
      expect(payload.name).to.equal('Renamed Hall');

      const rejectedGameplay = await emitAck(client, 'update_room_metadata', { gameState: { tokens: {} } });
      expect(rejectedGameplay.success).to.equal(false);
      expect(rejectedGameplay.error).to.match(/Unsupported room metadata field/);
      const rejectedCheckpoint = await emitAck(client, 'update_room_metadata', { checkpoint: { revision: 1 } });
      expect(rejectedCheckpoint.success).to.equal(false);
      const rejectedName = await emitAck(client, 'update_room_metadata', { name: '' });
      expect(rejectedName.success).to.equal(false);
      expect(room.name).to.equal('Renamed Hall');

      const observerToken = 'meta-observer-token';
      server.registerAuthToken(observerToken, server.nextUserId('observer'));
      observer = server.connect({ token: observerToken });
      await connected(observer);
      const observerAck = await emitAck(observer, 'update_room_metadata', { name: 'Hijacked' });
      expect(observerAck.success).to.equal(false);
      expect(observerAck.error).to.equal('GM privileges required');
      expect(room.name).to.equal('Renamed Hall');
      expect(saves).to.deep.equal([room.id]);
    } finally {
      if (client) {client.disconnect();}
      if (observer) {observer.disconnect();}
      await server.stop();
      sinon.restore();
    }
  });

  it('F8.3: account-level canonical metadata edit binds to stored gmId and publishes through the writer', async() => {
    const fake = makeFakeDb();
    const loaded = loadFirebaseServiceWithFakeDb(fake.db);
    const service = loaded.service;
    try {
      const built = roomCheckpoint.buildCheckpointDocuments({
        roomId: 'cloud-meta',
        gameState: buildGameState(),
        revision: 4,
        roomMetadata: { name: 'Cloud Room', settings: { difficulty: 8 } }
      });
      expect(built.ok).to.equal(true);
      fake.setDocument('rooms/cloud-meta', { id: 'cloud-meta', gmId: 'owner-uid', members: ['owner-uid'], ...built.rootPatch });
      fake.setDocument('rooms/cloud-meta/gameState/current', built.global.data);
      for (const doc of built.maps) {fake.setDocument(`rooms/cloud-meta/gameState/${doc.mapId}`, doc.data);}

      const wrongUser = await publishCanonical({
        roomId: 'cloud-meta', updates: { name: 'Hijacked' }, gmUserId: 'other-uid', firebaseService: service
      });
      expect(wrongUser.ok).to.equal(false);
      expect(wrongUser.reason).to.equal('not_room_gm');

      const edited = await publishCanonical({
        roomId: 'cloud-meta',
        updates: { name: 'Renamed Cloud', description: 'Edited', settings: { maxPlayers: 8 } },
        gmUserId: 'owner-uid',
        firebaseService: service
      });
      expect(edited.ok, JSON.stringify(edited)).to.equal(true);
      const root = fake.stored.get('rooms/cloud-meta');
      expect(root.name).to.equal('Renamed Cloud');
      expect(root.description).to.equal('Edited');
      expect(root.settings).to.deep.equal({ difficulty: 8, maxPlayers: 8 });
      expect(root.gmId).to.equal('owner-uid');
      expect(root.checkpoint.revision).to.equal(5);
      expect(root.checkpoint.provenance.kind).to.equal('native');

      // Legacy rooms cannot use the metadata-only canonical path.
      fake.setDocument('rooms/legacy-meta', {
        id: 'legacy-meta', gmId: 'owner-uid', name: 'Legacy', settings: {}, gameState: buildGameState()
      });
      const legacy = await publishCanonical({
        roomId: 'legacy-meta', updates: { name: 'Nope' }, gmUserId: 'owner-uid', firebaseService: service
      });
      expect(legacy.ok).to.equal(false);
      expect(legacy.reason).to.match(/room_not_canonical/);
    } finally {
      loaded.restore();
    }
  });

  it('F8.2: a writer without saveNow still queues the checkpoint truthfully', async() => {
    const queued = [];
    const server = createProductionStackServer({
      firebaseBatchWriter: { queueWrite: (roomId) => queued.push(roomId) }
    });
    await server.start();
    server.setEventLimits('create_room', { maxPerMinute: 100, maxPerSecond: 100 });
    server.setEventLimits('update_room_metadata', { maxPerMinute: 100, maxPerSecond: 100 });
    let client;
    try {
      const queueOwner = server.nextUserId('owner');
      server.registerAuthToken('queue-owner-token', queueOwner);
      sinon.stub(firebaseService, 'readRoomCheckpoint').resolves({
        kind: 'CANONICAL_COMPLETE_CHECKPOINT',
        roomId: 'queue-room',
        readOnly: true,
        diagnostics: [],
        checkpoint: { schemaVersion: 1, revision: 87, mapIds: ['default'], committed: true, contentHash: 'a'.repeat(64) },
        revision: 87,
        selectedCandidateId: 'canonical',
        selectedSnapshot: {
          global: { defaultMapId: 'default', combat: null, playerMapAssignments: {} },
          maps: { default: { id: 'default', name: 'Default', tokens: {}, characterTokens: {}, gridItems: {} } },
          mapIds: ['default']
        },
        migrationRequired: false,
        roomMetadata: { gmId: queueOwner, name: 'Review', members: [queueOwner], settings: {} },
        candidates: { inline: null, split: null },
        selection: null
      });
      client = server.connect({ token: 'queue-owner-token' });
      await connected(client);
      const joined = once(client, 'room_joined');
      client.emit('create_room', { gmName: 'GM', persistentRoomId: 'queue-room', password: '' });
      await joined;
      const room = server.rooms.get('queue-room');
      const ack = await emitAck(client, 'update_room_metadata', { description: 'Queued description' });
      expect(ack.success).to.equal(true);
      expect(ack.outcome).to.equal('queued');
      expect(queued).to.deep.equal([room.id]);
      expect(room.description).to.equal('Queued description');
    } finally {
      if (client) {client.disconnect();}
      await server.stop();
      sinon.restore();
    }
  });
});

describe('P3 final corrections — preservation control', function() {
  it('F-control: exact repeated legacy restore remains idempotent with an unchanged artifact', async() => {
    const fake = makeFakeDb();
    const loaded = loadFirebaseServiceWithFakeDb(fake.db);
    const service = loaded.service;
    const exportDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p3-final-control-'));
    const previousDir = process.env.ROOM_EXPORT_DIR;
    process.env.ROOM_EXPORT_DIR = exportDir;
    try {
      fake.setDocument('rooms/source', {
        id: 'source', name: 'Source', settings: {}, gameState: buildGameState()
      });
      const exported = await roomCheckpointExport.ensureRollbackArtifact('source', service);
      expect(exported.ok).to.equal(true);
      const first = await restoreScratch({
        artifactPath: exported.path, scratchRoomId: 'scratch_receipt', firebaseService: service
      });
      expect(first.ok).to.equal(true);
      const commits = fake.batchCommits.length;
      const again = await restoreScratch({
        artifactPath: exported.path, scratchRoomId: 'scratch_receipt', firebaseService: service
      });
      expect(again.ok).to.equal(true);
      expect(again.alreadyVerified).to.equal(true);
      expect(fake.batchCommits.length).to.equal(commits);
    } finally {
      if (previousDir === undefined) {delete process.env.ROOM_EXPORT_DIR;}
      else {process.env.ROOM_EXPORT_DIR = previousDir;}
      fs.rmSync(exportDir, { recursive: true, force: true });
      loaded.restore();
    }
  });
});
