/**
 * Project 3 frozen-contract correction regressions (senior review B1–B10).
 *
 * External persistence is the in-memory Firestore double; production writer,
 * reader, publisher, lifecycle and export code execute for real.
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
const firebaseService = require('../services/firebaseService');
const {
  FirebaseBatchWriter,
  createSyncServices,
  validateRoomSnapshot
} = require('../services/syncService');
const roomHandlers = require('../handlers/roomHandlers');
const lifecycle = require('../handlers/roomLifecycleHandlers');
const syncHandlers = require('../handlers/syncHandlers');
const mapHandlers = require('../handlers/mapHandlers');
const {
  makeFakeDb,
  loadFirebaseServiceWithFakeDb,
  buildGameState
} = require('./helpers/fakeCheckpointFirestore');
const { createProductionStackServer } = require('./helpers/productionStackServer');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const waitFor = async(predicate, timeoutMs = 5000, intervalMs = 10) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (predicate()) {return true;}
    await wait(intervalMs);
  }
  return predicate();
};

const once = (socket, event, timeoutMs = 5000) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`timeout waiting for "${event}"`)), timeoutMs);
  socket.once(event, (payload) => { clearTimeout(timer); resolve(payload); });
});

const connected = (socket) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error('timeout waiting for connect')), 5000);
  socket.once('connect', () => { clearTimeout(timer); resolve(); });
  socket.once('connect_error', (err) => { clearTimeout(timer); reject(err); });
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

const makeCtx = (socket, rooms, players) => {
  const ctx = {
    socket,
    rooms,
    players,
    io: { to: () => ({ emit() {} }), emit() {} },
    logger: { debug() {}, info() {}, warn() {}, error() {} },
    uuidv4: require('uuid').v4,
    sanitizePlayerName: (name) => name,
    verifyPassword: async() => true,
    getPublicRooms: () => [],
    notifyPartyMembersOfGMJoin() {},
    handlePartyLeave() {},
    firebaseService
  };
  ctx.createRoom = (...args) => roomHandlers.createRoom(...args, rooms, players);
  return ctx;
};

const exportDir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'p3-corrections-'));

describe('P3 corrections B1 — production writer wiring and immutable capture', function() {
  this.timeout(20000);

  const writers = [];
  afterEach(() => {
    for (const writer of writers.splice(0)) {writer.stop();}
    sinon.restore();
  });

  it('B1.1: production default writer forwards revision and immutable metadata after restart', async() => {
    const calls = [];
    sinon.stub(firebaseService, 'updateRoomGameState').callsFake(async(roomId, snapshot, context) => {
      calls.push({ roomId, context });
      return { outcome: 'confirmed', revision: context.revision, manifest: { schemaVersion: 1, revision: context.revision } };
    });
    const rooms = new Map([
      ['A', { id: 'A', isPermanent: true, checkpointRevision: 87, checkpoint: { revision: 87 }, name: 'Room A', settings: {} }],
      ['B', { id: 'B', isPermanent: true, checkpointRevision: 205, checkpoint: { revision: 205 }, name: 'Room B', settings: {} }]
    ]);
    const services = createSyncServices({ to: () => ({ emit() {} }) }, rooms, new Map());
    writers.push(services.firebaseBatchWriter);
    try {
      const a = await services.firebaseBatchWriter.saveNow('A', buildGameState());
      const b = await services.firebaseBatchWriter.saveNow('B', buildGameState());
      expect(a.outcome).to.equal('confirmed');
      expect(b.outcome).to.equal('confirmed');
      expect(calls[0].context.revision).to.be.greaterThan(87);
      expect(calls[1].context.revision).to.be.greaterThan(205);
      expect(calls[0].context.roomMetadata.name).to.equal('Room A');
      expect(rooms.get('A').checkpointRevision).to.equal(calls[0].context.revision);
    } finally {
      services.movementDebouncer.stop();
    }
  });

  it('B1.2: queued snapshot cannot borrow metadata of an already-started revision', async() => {
    const calls = [];
    let name = 'old';
    const writer = new FirebaseBatchWriter(60000, 50, {
      captureMetadata: () => ({ name, settings: {} }),
      persist: async(_id, snapshot, context) => {
        calls.push({ marker: snapshot.marker, name: context.roomMetadata.name });
        if (snapshot.marker === 'old') {await wait(30);}
        return { outcome: 'confirmed', revision: context.revision };
      }
    });
    writers.push(writer);
    const saving = writer.saveNow('A', { marker: 'old' });
    await waitFor(() => calls.length === 1);
    name = 'new';
    writer.queueWrite('A', { marker: 'new' }, true);
    await saving;
    await waitFor(() => calls.length === 2);
    expect(calls[0].name).to.equal('old');
    expect(calls[1].name).to.equal('new');
  });

  it('B1.3: validation rejects unsupported values before the lossy P2 clone', async() => {
    const persist = sinon.stub().resolves({ outcome: 'confirmed', revision: 1 });
    const writer = new FirebaseBatchWriter(60000, 50, { persist, validateSnapshot: validateRoomSnapshot });
    writers.push(writer);
    const invalidStates = [
      { opaque: { nan: NaN } },
      { opaque: { fn: () => 1 } },
      { opaque: { custom: new Map([['valuable', 1]]) } },
      { opaque: { arr: [undefined] } }
    ];
    for (const state of invalidStates) {
      const result = await writer.saveNow('A', state);
      expect(result.outcome).to.equal('permanent');
      expect(result.code).to.equal('CHECKPOINT_INVALID');
    }
    expect(persist.called).to.equal(false);
  });
});

describe('P3 corrections B2 — single reconstruction gate and read-only resume', function() {
  this.timeout(20000);

  let server;
  const clients = [];
  const writers = [];

  const openVerified = async() => {
    const userId = server.nextUserId();
    const token = `test-token:${userId}`;
    server.registerAuthToken(token, userId);
    const client = server.connect({ token });
    clients.push(client);
    await connected(client);
    return { client, userId };
  };

  const startServer = async() => {
    const writer = new FirebaseBatchWriter(60000, 50, {
      persist: async(roomId, snapshot, context) => ({ outcome: 'confirmed', revision: context.revision }),
      validateSnapshot: validateRoomSnapshot,
      captureMetadata: () => ({ name: 'Test', settings: {} })
    });
    writers.push(writer);
    server = createProductionStackServer({ debounceMs: 40, firebaseBatchWriter: writer });
    await server.start();
    server.setEventLimits('create_room', { maxPerMinute: 100, maxPerSecond: 100 });
    return writer;
  };

  const classificationFor = (uid, extra = {}) => ({
    kind: 'CANONICAL_COMPLETE_CHECKPOINT',
    roomId: 'gate-room',
    revision: 87,
    checkpoint: { schemaVersion: 1, revision: 87 },
    migrationRequired: false,
    selectedCandidateId: 'canonical',
    diagnostics: [],
    roomMetadata: { gmId: uid, name: 'Review', members: [uid], settings: { difficulty: 8, maxPlayers: 12 } },
    selectedSnapshot: {
      global: { defaultMapId: 'default', combat: null, playerMapAssignments: {} },
      maps: { default: { id: 'default', name: 'Default', tokens: {}, characterTokens: {}, gridItems: {} } },
      mapIds: ['default']
    },
    ...extra
  });

  beforeEach(() => { clients.length = 0; });

  afterEach(async() => {
    for (const client of clients.splice(0)) {
      try { client.disconnect(); } catch (_error) { /* noop */ }
    }
    for (const writer of writers.splice(0)) {writer.stop();}
    if (server) {await server.stop(); server = null;}
    sinon.restore();
  });

  it('B2.1: concurrent first resumes perform one reconstruction and preserve a later live edit', async() => {
    await startServer();
    const owner = server.nextUserId('owner');
    const classification = classificationFor(owner);
    const gate = { resolve: null };
    const gatePromise = new Promise((resolve) => { gate.resolve = resolve; });
    let reads = 0;
    sinon.stub(firebaseService, 'readRoomCheckpoint').callsFake(async() => {
      reads += 1;
      await gatePromise;
      return classification;
    });
    const saveSpy = sinon.spy(firebaseService, 'saveRoomData');

    // Both sockets share the same verified owner identity; reuse one client
    // pair with the owner's uid registered tokens.
    const tokenA = `test-token:${owner}`;
    const tokenB = `test-token:${owner}`;
    server.registerAuthToken(tokenA, owner);
    server.registerAuthToken(tokenB, owner);
    const clientA = server.connect({ token: tokenA });
    const clientB = server.connect({ token: tokenB });
    clients.push(clientA, clientB);
    await connected(clientA);
    await connected(clientB);

    const joinedA = once(clientA, 'room_joined');
    const joinedB = once(clientB, 'room_joined');
    const errors = [];
    clientA.on('room_error', (payload) => errors.push(payload));
    clientB.on('room_error', (payload) => errors.push(payload));
    clientA.emit('create_room', { gmName: 'GM A', persistentRoomId: 'gate-room', password: '' });
    clientB.emit('create_room', { gmName: 'GM B', persistentRoomId: 'gate-room', password: '' });

    await waitFor(() => reads === 1);
    await wait(30);
    expect(reads).to.equal(1, 'only one cloud reconstruction may start');
    gate.resolve();
    await Promise.race([
      joinedA,
      wait(3000).then(() => { throw new Error(`no room_joined; errors=${JSON.stringify(errors)}`); })
    ]);
    const firstRoom = server.rooms.get('gate-room');
    firstRoom.gameState.acceptedUnsaved = 'must survive';
    await joinedB;
    expect(server.rooms.get('gate-room')).to.equal(firstRoom);
    expect(server.rooms.get('gate-room').gameState.acceptedUnsaved).to.equal('must survive');
    // C5: one classification read plus one post-acquisition re-read by the
    // single winning reconstruction; the losing waiter reads nothing.
    expect(reads).to.equal(2);
    expect(saveSpy.called).to.equal(false);
  });

  it('B2.2: reconstruction is read-only and preserves stored settings', async() => {
    await startServer();
    const gm = await openVerified();
    sinon.stub(firebaseService, 'readRoomCheckpoint').resolves(classificationFor(gm.userId));
    const saveSpy = sinon.spy(firebaseService, 'saveRoomData');
    const joined = once(gm.client, 'room_joined');
    gm.client.emit('create_room', { gmName: 'GM', persistentRoomId: 'gate-room', password: '' });
    await joined;
    const room = server.rooms.get('gate-room');
    expect(saveSpy.called).to.equal(false);
    expect(room.settings).to.deep.equal({ difficulty: 8, maxPlayers: 12 });
    expect(room.checkpointRevision).to.equal(87);
  });

  it('B2.3: resumed GM is rebound into authoritative membership and explicit save works', async() => {
    const writer = await startServer();
    const gm = await openVerified();
    const room = await server.seedRoom(gm.client.id, { gmUserId: gm.userId, persistentRoomId: 'live-room' });
    room.gameState.marker = 'accepted';
    room.gm.socketId = 'stale-socket';
    const saveStub = sinon.stub(writer, 'saveNow').resolves({ outcome: 'confirmed', revision: 11 });
    const readStub = sinon.stub(firebaseService, 'readRoomCheckpoint').rejects(new Error('cloud must not be read'));

    const joined = once(gm.client, 'room_joined');
    gm.client.emit('create_room', { gmName: 'GM', persistentRoomId: 'live-room', password: '' });
    await joined;
    expect(readStub.called).to.equal(false);
    expect(room.gm.socketId).to.equal(gm.client.id);
    expect(server.players.has(gm.client.id)).to.equal(true);

    gm.client.emit('save_room_state_request', { roomId: room.id });
    await waitFor(() => saveStub.calledOnce);
    expect(saveStub.calledOnce).to.equal(true);
    expect(room.gameState.marker).to.equal('accepted');
  });
});

describe('P3 corrections B3 — classifier and structural validation', function() {
  this.timeout(15000);

  it('B3.A: valid inline plus stale map without current stays inline-only', () => {
    const root = {
      exists: true,
      data: {
        id: 'inline',
        gameState: {
          defaultMapId: 'default',
          combat: { isActive: true, turnOrder: [], currentTurnIndex: 0, round: 1 },
          maps: { default: { id: 'default', tokens: {}, characterTokens: {}, gridItems: {} } }
        }
      }
    };
    const classification = roomCheckpoint.classifyRoomDocuments({
      roomId: 'inline',
      root,
      gameStateDocs: [{ id: 'old-map', data: { id: 'old-map' } }]
    });
    expect(classification.kind).to.equal('LEGACY_INLINE_ONLY');
    expect(classification.candidates.split).to.equal(null);
    expect(classification.diagnostics.some((d) => d.code === 'ORPHANED_MAP_FRAGMENTS')).to.equal(true);
  });

  it('B3.B: schema-1 envelopes without a manifest are incomplete, not legacy split', () => {
    const classification = roomCheckpoint.classifyRoomDocuments({
      roomId: 'orphan',
      root: { exists: true, data: { id: 'orphan' } },
      gameStateDocs: [
        { id: 'current', data: { schemaVersion: 1, checkpointRevision: 3, snapshotJson: '{}' } },
        { id: 'default', data: { schemaVersion: 1, checkpointRevision: 3, mapId: 'default', snapshotJson: '{}' } }
      ]
    });
    expect(classification.kind).to.equal('INCOMPLETE_CHECKPOINT');
    expect(classification.selectedSnapshot).to.equal(null);
  });

  it('B3.C: undeclared stale newer-schema fragment cannot block the selected head', () => {
    const built = roomCheckpoint.buildCheckpointDocuments({
      roomId: 'stale',
      gameState: buildGameState(),
      revision: 4,
      serverTimestamp: () => 'TS'
    });
    const classification = roomCheckpoint.classifyRoomDocuments({
      roomId: 'stale',
      root: { exists: true, data: { id: 'stale', checkpoint: built.manifest } },
      gameStateDocs: [
        { id: 'current', data: built.global.data },
        ...built.maps.map((doc) => ({ id: doc.mapId, data: doc.data })),
        { id: 'deleted', data: { schemaVersion: 99, checkpointRevision: 1, mapId: 'deleted', snapshotJson: '{}' } }
      ]
    });
    expect(classification.kind).to.equal('CANONICAL_COMPLETE_CHECKPOINT');
  });

  it('B3.D: malformed canonical structural collection is incomplete and never hydrates empty', () => {
    const built = roomCheckpoint.buildCheckpointDocuments({
      roomId: 'bad',
      gameState: buildGameState(),
      revision: 1,
      serverTimestamp: () => 'TS'
    });
    const mapData = JSON.parse(built.maps[0].data.snapshotJson);
    mapData.tokens = [{ id: 'valuable' }];
    const mapJson = roomCheckpoint.stableStringify(mapData);
    const contentHash = roomCheckpoint.sha256Hex(roomCheckpoint.stableStringify([
      roomCheckpoint.CHECKPOINT_SCHEMA_VERSION,
      built.global.data.snapshotJson,
      [['default', mapJson]]
    ]));
    const classification = roomCheckpoint.classifyRoomDocuments({
      roomId: 'bad',
      root: { exists: true, data: { id: 'bad', checkpoint: { ...built.manifest, contentHash } } },
      gameStateDocs: [
        { id: 'current', data: built.global.data },
        { id: 'default', data: { ...built.maps[0].data, snapshotJson: mapJson } }
      ]
    });
    expect(classification.kind).to.equal('INCOMPLETE_CHECKPOINT');
    expect(classification.diagnostics[0].code).to.equal('INCOMPLETE_CHECKPOINT');
    expect(classification.selectedSnapshot).to.equal(null);
  });

  it('B3.E: actual localRoomService token-array shape adapts without losing entities', () => {
    const adapted = roomCheckpoint.adaptInlineCandidate({
      tokens: [{ id: 'placed', creatureId: 'creature', position: { x: 1, y: 2 }, state: { hp: 7 } }],
      gridItems: [],
      inventory: { droppedItems: { item: { id: 'item' } } },
      levelEditor: { terrainData: {}, drawingPaths: [{ id: 'stroke' }] },
      mapData: {},
      combat: { isActive: false, currentTurn: null, turnOrder: [], round: 0 }
    });
    expect(adapted.complete).to.equal(true);
    expect(Object.keys(adapted.maps.default.tokens)).to.deep.equal(['placed']);
    expect(Object.keys(adapted.maps.default.gridItems)).to.deep.equal(['item']);
  });

  it('B3.F: explicit scope is preserved and empty gridItems cannot mask droppedItems', () => {
    const adapted = roomCheckpoint.adaptInlineCandidate({
      defaultMapId: 'forest',
      tokens: { X: { id: 'X', mapId: 'forest' } },
      gridItems: {},
      inventory: { droppedItems: { g: { id: 'g' } }, lootBags: { bag: { valuable: true } } },
      levelEditor: { terrainData: {} },
      combat: { isActive: false, currentTurn: null, turnOrder: [], round: 0 }
    });
    expect(adapted.mapIds).to.deep.equal(['forest']);
    expect(Object.keys(adapted.maps.forest.gridItems)).to.deep.equal(['g']);
    expect(adapted.global.inventory).to.deep.equal({ lootBags: { bag: { valuable: true } } });
  });
});

describe('P3 corrections B6/B7 — migration, rollback artifact and restore validation', function() {
  this.timeout(20000);

  let restore;
  let fake;
  let service;
  let dir;
  let previousDir;

  beforeEach(() => {
    fake = makeFakeDb();
    const loaded = loadFirebaseServiceWithFakeDb(fake.db);
    restore = loaded.restore;
    service = loaded.service;
    dir = exportDir();
    previousDir = process.env.ROOM_EXPORT_DIR;
    process.env.ROOM_EXPORT_DIR = dir;
  });

  afterEach(() => {
    if (previousDir === undefined) {delete process.env.ROOM_EXPORT_DIR;}
    else {process.env.ROOM_EXPORT_DIR = previousDir;}
    fs.rmSync(dir, { recursive: true, force: true });
    restore();
    sinon.restore();
  });

  const seedLegacyInline = async(roomId = 'legacy') => {
    fake.setDocument(`rooms/${roomId}`, {
      id: roomId,
      name: 'Review',
      settings: {},
      gameState: {
        defaultMapId: 'default',
        combat: { isActive: false, currentTurn: null, turnOrder: [], round: 0 },
        maps: { default: { id: 'default', tokens: {}, characterTokens: {}, gridItems: {} } }
      }
    });
  };

  it('B6.1: unknown newer and ambiguous sources cannot be exported or converted', async() => {
    fake.setDocument('rooms/newer', { id: 'newer', checkpoint: { schemaVersion: 99, revision: 0, mapIds: [], committed: true } });
    const newer = await roomCheckpointExport.ensureRollbackArtifact('newer', service);
    expect(newer.ok).to.equal(false);
    expect(newer.reason).to.match(/source_not_convertible/);

    fake.setDocument('rooms/dual', {
      id: 'dual',
      gameState: {
        defaultMapId: 'default',
        combat: { isActive: false },
        maps: { default: { id: 'default', tokens: { inline: { id: 'inline' } }, characterTokens: {}, gridItems: {} } }
      }
    });
    fake.setDocument('rooms/dual/gameState/current', { defaultMapId: 'default', tokens: { split: { id: 'split' } } });
    fake.setDocument('rooms/dual/gameState/default', { id: 'default', tokens: { split: { id: 'split' } } });
    const ambiguous = await service.readRoomCheckpoint('dual');
    expect(ambiguous.selection.status).to.equal('AMBIGUOUS_RECONCILIATION_REQUIRED');
    const refused = await roomCheckpointExport.ensureRollbackArtifact('dual', service);
    expect(refused.ok).to.equal(false);
    expect(refused.reason).to.match(/AMBIGUOUS_RECONCILIATION_REQUIRED/);
  });

  it('B6.2: source change after export stops conversion without deleting inline state', async() => {
    await seedLegacyInline('changing');
    const room = {
      id: 'changing',
      isPermanent: true,
      name: 'Review',
      settings: {},
      gameState: {
        defaultMapId: 'default',
        combat: { isActive: false, currentTurn: null, turnOrder: [], round: 0 },
        maps: { default: { id: 'default', tokens: {}, characterTokens: {}, gridItems: {} } }
      },
      migrationRequired: true,
      checkpointRevision: 0,
      players: new Map(),
      gm: { id: 'gm' }
    };
    const rooms = new Map([[room.id, room]]);
    const writer = new FirebaseBatchWriter(60000, 50, {
      captureMetadata: () => ({
        name: 'Review',
        settings: {},
        provenance: room.pendingProvenance || null,
        explicitConversion: room.pendingExplicitConversion === true,
        migrationRequired: room.migrationRequired === true
      }),
      validateSnapshot: validateRoomSnapshot,
      persist: (id, snapshot, context) => service.publishRoomCheckpoint(id, snapshot, { ...context, authority: { roomId: id, authorityInstanceId: 'test-instance', authorityGeneration: 1 } })
    });
    const socket = socketStub('gm');
    const ctx = makeCtx(socket, rooms, new Map([['gm', { id: 'gm', isGM: true, roomId: room.id }]]));
    ctx.firebaseService = service;
    ctx.firebaseBatchWriter = writer;
    syncHandlers.registerSyncHandlers(ctx);
    try {
      // Source changes to a versioned-but-incomplete shape after the export gate
      // would have been computed; the fingerprint mismatch must stop conversion.
      const originalEnsure = roomCheckpointExport.ensureRollbackArtifact;
      sinon.stub(roomCheckpointExport, 'ensureRollbackArtifact').callsFake(async(roomId, fb) => {
        const result = await originalEnsure(roomId, fb);
        fake.setDocument(`rooms/${roomId}/gameState/current`, { schemaVersion: 1, checkpointRevision: 1, snapshotJson: '{}' });
        return result;
      });
      await socket.handlers.save_room_state_request({});
      const error = socket.emitted.find((entry) => entry.event === 'room_state_save_error');
      expect(error.payload.code).to.equal('MIGRATION_SOURCE_CHANGED');
      expect(fake.stored.get('rooms/changing').gameState).to.not.equal(undefined);
      expect(fake.stored.get('rooms/changing').checkpoint).to.equal(undefined);
    } finally {
      writer.stop();
    }
  });

  it('B6.3: artifact read-back recomputes integrity; corrupted payload with stale checksum field fails', async() => {
    await seedLegacyInline('readback');
    const exported = await roomCheckpointExport.ensureRollbackArtifact('readback', service);
    expect(exported.ok).to.equal(true);
    const readSpy = sinon.stub(fs, 'readFileSync').callsFake((filePath, ...args) => {
      const text = fs.readFileSync.wrappedMethod.call(fs, filePath, ...args);
      if (String(filePath).includes(exported.artifactId)) {
        const parsed = JSON.parse(String(text));
        parsed.globalData = { ...(parsed.globalData || {}), corrupted: true };
        return JSON.stringify(parsed);
      }
      return text;
    });
    const written = roomCheckpointExport.writeArtifactFile(exported.artifact, dir);
    readSpy.restore();
    expect(written.ok).to.equal(false);
    expect(written.reason).to.equal('artifact_readback_mismatch');
  });

  it('B6.4: restore/migration provenance survives the next canonical save', async() => {
    const room = {
      id: 'lineage',
      isPermanent: true,
      name: 'Review',
      settings: {},
      gameState: buildGameState(),
      pendingProvenance: { kind: 'restore', sourceRoomId: 'source', sourceRevision: 87, rollbackArtifactId: 'artifact' },
      checkpointRevision: 0
    };
    const rooms = new Map([[room.id, room]]);
    const services = createSyncServices({ to: () => ({ emit() {} }) }, rooms, new Map());
    services.firebaseBatchWriter.persist = (id, snapshot, context) => service.publishRoomCheckpoint(id, snapshot, { ...context, authority: { roomId: id, authorityInstanceId: 'test-instance', authorityGeneration: 1 } });
    services.firebaseBatchWriter.validateSnapshot = validateRoomSnapshot;
    try {
      const first = await services.firebaseBatchWriter.saveNow(room.id, room.gameState);
      expect(first.outcome).to.equal('confirmed');
      const second = await services.firebaseBatchWriter.saveNow(room.id, buildGameState({ globalExtra: { marker: 'edited' } }));
      expect(second.outcome).to.equal('confirmed');
      const provenance = fake.stored.get('rooms/lineage').checkpoint.provenance;
      expect(provenance.kind).to.equal('restore');
      expect(provenance.rollbackArtifactId).to.equal('artifact');
    } finally {
      services.firebaseBatchWriter.stop();
      services.movementDebouncer.stop();
    }
  });

  it('B6.5: automatic migration rejection later recovers through a valid explicit GM migration', async() => {
    await seedLegacyInline('recover');
    const room = {
      id: 'recover',
      isPermanent: true,
      name: 'Review',
      settings: {},
      gameState: {
        defaultMapId: 'default',
        combat: { isActive: false, currentTurn: null, turnOrder: [], round: 0 },
        maps: { default: { id: 'default', tokens: {}, characterTokens: {}, gridItems: {} } }
      },
      migrationRequired: true,
      checkpointRevision: 0,
      players: new Map(),
      gm: { id: 'gm' }
    };
    const rooms = new Map([[room.id, room]]);
    const writer = new FirebaseBatchWriter(60000, 50, {
      captureMetadata: () => ({
        name: 'Review',
        settings: {},
        provenance: room.pendingProvenance || null,
        explicitConversion: room.pendingExplicitConversion === true,
        migrationRequired: room.migrationRequired === true
      }),
      validateSnapshot: validateRoomSnapshot,
      persist: (id, snapshot, context) => service.publishRoomCheckpoint(id, snapshot, { ...context, authority: { roomId: id, authorityInstanceId: 'test-instance', authorityGeneration: 1 } })
    });
    const socket = socketStub('gm');
    const ctx = makeCtx(socket, rooms, new Map([['gm', { id: 'gm', isGM: true, roomId: room.id }]]));
    ctx.firebaseService = service;
    ctx.firebaseBatchWriter = writer;
    syncHandlers.registerSyncHandlers(ctx);
    try {
      const automatic = await writer.saveNow(room.id, room.gameState);
      expect(automatic.outcome).to.equal('permanent');
      expect(automatic.reason).to.equal('legacy_room_requires_explicit_exported_conversion');
      await socket.handlers.save_room_state_request({});
      expect(socket.emitted.some((entry) => entry.event === 'room_state_saved')).to.equal(true);
      expect(fake.stored.get('rooms/recover').checkpoint.revision).to.be.greaterThan(0);
      expect(fake.stored.get('rooms/recover').gameState).to.equal(undefined);
    } finally {
      writer.stop();
    }
  });

  it('B7.1: restore rejects unsupported schema, extra fragments, occupied targets and path IDs before writing', async() => {
    fake.setDocument('rooms/source', {
      id: 'source',
      name: 'Review',
      settings: {},
      checkpoint: null,
      gameState: buildGameState()
    });
    const publishedSource = await service.publishRoomCheckpoint('source', buildGameState(), {
      authority: { roomId: 'source', authorityInstanceId: 'test-instance', authorityGeneration: 1 },
      revision: 1,
      roomMetadata: { name: 'Source', settings: {} }
    });
    expect(publishedSource.outcome).to.equal('confirmed');
    const artifact = roomCheckpointExport.buildArtifact('source', await service.readRoomCheckpoint('source', { includeRaw: true }));
    const written = roomCheckpointExport.writeArtifactFile(artifact, dir);
    expect(written.ok).to.equal(true);

    const schemaBad = JSON.parse(JSON.stringify(artifact));
    schemaBad.artifactId = 'copy-schema';
    schemaBad.checkpoint.schemaVersion = 99;
    schemaBad.sha256 = roomCheckpointExport.computeArtifactChecksum(schemaBad);
    const schemaWritten = roomCheckpointExport.writeArtifactFile(schemaBad, dir);
    let commits = fake.batchCommits.length;
    let result = await restoreScratch({ artifactPath: schemaWritten.path, scratchRoomId: 'scratch_schema', firebaseService: service });
    expect(result.ok).to.equal(false);
    expect(fake.batchCommits.length).to.equal(commits);

    const extraFragment = JSON.parse(JSON.stringify(artifact));
    extraFragment.artifactId = 'copy-extra';
    extraFragment.mapFragments.push({ mapId: 'unexpected', data: { id: 'unexpected' } });
    extraFragment.sha256 = roomCheckpointExport.computeArtifactChecksum(extraFragment);
    const extraWritten = roomCheckpointExport.writeArtifactFile(extraFragment, dir);
    commits = fake.batchCommits.length;
    result = await restoreScratch({ artifactPath: extraWritten.path, scratchRoomId: 'scratch_extra', firebaseService: service });
    expect(result.ok).to.equal(false);
    expect(result.errors).to.include('map_fragment_set_mismatch');
    expect(fake.batchCommits.length).to.equal(commits);

    fake.setDocument('rooms/scratch_active', { id: 'scratch_active', name: 'Active', gmId: 'owner', checkpoint: null, settings: {} });
    result = await restoreScratch({ artifactPath: written.path, scratchRoomId: 'scratch_active', firebaseService: service });
    expect(result.ok).to.equal(false);
    expect(fake.stored.get('rooms/scratch_active').checkpoint).to.equal(null);

    commits = fake.batchCommits.length;
    result = await restoreScratch({ artifactPath: written.path, scratchRoomId: 'scratch_parent/gameState/default', firebaseService: service });
    expect(result.ok).to.equal(false);
    expect(result.reason).to.equal('scratch_room_id_required');
    expect(fake.batchCommits.length).to.equal(commits);

    const freshRestore = await restoreScratch({ artifactPath: written.path, scratchRoomId: 'scratch_ok', firebaseService: service });
    expect(freshRestore.ok, JSON.stringify(freshRestore)).to.equal(true);
    expect(freshRestore.revision).to.be.greaterThan(0);
    const repeated = await restoreScratch({ artifactPath: written.path, scratchRoomId: 'scratch_ok', firebaseService: service });
    expect(repeated.ok).to.equal(true);
    expect(repeated.alreadyVerified).to.equal(true);
  });
});

describe('P3 corrections B8/B9/B10 — default map deletion, preflight and uncertain commit', function() {
  this.timeout(15000);

  it('B8: deleting the default map repairs default pointer, mirrors and checkpoint viability', async() => {
    const rooms = new Map();
    const room = {
      id: 'delete',
      name: 'Review',
      players: new Map(),
      gameState: {
        defaultMapId: 'default',
        combat: null,
        maps: {
          default: { id: 'default', tokens: { X: { id: 'X', mapId: 'default' } }, characterTokens: {}, gridItems: {} },
          B: { id: 'B', tokens: {}, characterTokens: {}, gridItems: {} }
        },
        tokens: { X: { id: 'X', mapId: 'default' } },
        characterTokens: {},
        gridItems: {}
      }
    };
    rooms.set(room.id, room);
    const socket = socketStub('gm');
    const queued = [];
    const ctx = makeCtx(socket, rooms, new Map());
    ctx.firebaseBatchWriter = { queueWrite: (_id, gameState) => queued.push(JSON.parse(JSON.stringify(gameState))) };
    ctx.getNextEventSequence = () => 1;
    ctx.validateRoomMembership = () => ({ valid: true, room: rooms.get('delete'), player: { id: 'gm', isGM: true } });
    const handlers = {};
    socket.on = (event, handler) => { handlers[event] = handler; };
    mapHandlers.registerMapHandlers(ctx);
    await handlers.map_update({ roomId: 'delete', action: 'delete', mapId: 'default' }, () => {});
    expect(room.gameState.defaultMapId).to.equal('B');
    expect(room.gameState.tokens.X).to.equal(undefined);
    const checkpoint = roomCheckpoint.buildCheckpointDocuments({
      roomId: 'delete',
      gameState: queued[0],
      revision: 1,
      serverTimestamp: () => 'TS'
    });
    expect(checkpoint.ok).to.equal(true);
  });

  it('B9.1: request estimator is the exact frozen sum of every operation', () => {
    const maps = {};
    for (let index = 0; index < 10; index += 1) {
      const id = index === 0 ? 'default' : `map-${index}`;
      maps[id] = { id, tokens: {}, characterTokens: {}, gridItems: {}, padding: 'a'.repeat(50000) };
    }
    const built = roomCheckpoint.buildCheckpointDocuments({
      roomId: 'request-edge',
      projectId: 'senior',
      revision: 1,
      gameState: { defaultMapId: 'default', maps, combat: null },
      serverTimestamp: () => 'TS'
    });
    expect(built.ok).to.equal(true);
    const rootName = 'projects/senior/databases/(default)/documents/rooms/request-edge';
    const recomposed = built.estimates.root + Buffer.byteLength(rootName, 'utf8') + 1024
      + built.estimates.global + Buffer.byteLength(built.global.name, 'utf8') + 1024
      + built.maps.reduce((total, doc) =>
        total + built.estimates.maps[doc.mapId] + Buffer.byteLength(doc.name, 'utf8') + 1024, 0);
    expect(recomposed).to.equal(built.requestEstimate);
    expect(built.requestEstimate).to.be.at.most(roomCheckpoint.CHECKPOINT_LIMITS.MAX_REQUEST_BYTES);

    const mapIds = [];
    const limitMaps = {};
    for (let index = 0; index < 498; index += 1) {
      const id = index === 0 ? 'default' : `map-${index}`;
      mapIds.push(id);
      limitMaps[id] = { id, tokens: {}, characterTokens: {}, gridItems: {} };
    }
    const atLimit = roomCheckpoint.buildCheckpointDocuments({
      roomId: 'ops',
      revision: 1,
      gameState: { defaultMapId: 'default', maps: limitMaps },
      serverTimestamp: () => 'TS'
    });
    expect(atLimit.ok).to.equal(true);
    expect(atLimit.operations).to.equal(500);
    limitMaps['map-498'] = { id: 'map-498', tokens: {}, characterTokens: {}, gridItems: {} };
    const overLimit = roomCheckpoint.buildCheckpointDocuments({
      roomId: 'ops',
      revision: 1,
      gameState: { defaultMapId: 'default', maps: limitMaps },
      serverTimestamp: () => 'TS'
    });
    expect(overLimit.ok).to.equal(false);
    expect(overLimit.reason).to.include('operation_limit');
  });

  it('B9.2: invalid UTF-8 identifiers are rejected while normal ones pass', () => {
    expect(roomCheckpoint.validateMapId('m\ud800')).to.equal('map_id_invalid_utf8');
    expect(roomCheckpoint.validateMapId('map-1')).to.equal(null);
    expect(roomCheckpoint.validateMapId('current')).to.equal('map_id_reserved');
    expect(roomCheckpoint.validateMapId('a/b')).to.equal('map_id_contains_slash');
  });

  it('B10: uncertain commits confirm only on an exact identity reread', async() => {
    const fake = makeFakeDb();
    const loaded = loadFirebaseServiceWithFakeDb(fake.db);
    const service = loaded.service;
    try {
      const gameState = buildGameState({ globalExtra: { marker: 'wanted' } });
      const metadata = { name: 'Review', settings: {} };
      // Applied commit with lost acknowledgement: retry verifies the exact
      // revision without republishing.
      fake.setBehavior(() => 'applied-lost-ack');
      const first = await service.publishRoomCheckpoint('exact', gameState, {
        authority: { roomId: 'exact', authorityInstanceId: 'test-instance', authorityGeneration: 1 }, revision: 1, roomMetadata: metadata });
      expect(first.outcome).to.not.equal('confirmed');
      const commits = fake.batchCommits.length;
      fake.setBehavior(() => null);
      const retry = await service.publishRoomCheckpoint('exact', gameState, {
        authority: { roomId: 'exact', authorityInstanceId: 'test-instance', authorityGeneration: 1 }, revision: 1, roomMetadata: metadata });
      expect(retry.outcome).to.equal('confirmed');
      expect(fake.batchCommits.length).to.equal(commits);

      // Same revision with different content appearing before the verification
      // transaction is a conflict, never a false confirmation.
      const built = roomCheckpoint.buildCheckpointDocuments({
        roomId: 'race',
        gameState: buildGameState({ globalExtra: { marker: 'wanted' } }),
        revision: 5,
        roomMetadata: metadata,
        serverTimestamp: () => 'TS'
      });
      fake.setDocument('rooms/race', { id: 'race', ...metadata, checkpoint: built.manifest });
      fake.setDocument('rooms/race/gameState/current', built.global.data);
      for (const doc of built.maps) {fake.setDocument(`rooms/race/gameState/${doc.mapId}`, doc.data);}
      let mutated = false;
      fake.setBeforeTransaction(() => {
        if (mutated) {return;}
        mutated = true;
        const different = roomCheckpoint.buildCheckpointDocuments({
          roomId: 'race',
          gameState: buildGameState({ globalExtra: { marker: 'different' } }),
          revision: 5,
          roomMetadata: metadata,
          serverTimestamp: () => 'TS'
        });
        fake.setDocument('rooms/race', { id: 'race', ...metadata, checkpoint: different.manifest });
        fake.setDocument('rooms/race/gameState/current', different.global.data);
        for (const doc of different.maps) {fake.setDocument(`rooms/race/gameState/${doc.mapId}`, doc.data);}
      });
      const race = await service.publishRoomCheckpoint('race', buildGameState({ globalExtra: { marker: 'wanted' } }), {
        authority: { roomId: 'race', authorityInstanceId: 'test-instance', authorityGeneration: 1 },
        revision: 5,
        roomMetadata: metadata
      });
      expect(race.outcome).to.equal('permanent');
      expect(race.code).to.equal('CHECKPOINT_REVISION_CONFLICT');

      // Reread failure never manufactures confirmation.
      fake.setBeforeTransaction(null);
      fake.setReadFailure(true);
      const unreadable = await service.publishRoomCheckpoint('race', buildGameState({ globalExtra: { marker: 'wanted' } }), {
        authority: { roomId: 'race', authorityInstanceId: 'test-instance', authorityGeneration: 1 },
        revision: 5,
        roomMetadata: metadata
      });
      expect(unreadable.outcome).to.not.equal('confirmed');
    } finally {
      loaded.restore();
    }
  });
});
