/**
 * Project 3 — last two blockers: live scratch target refusal and the frozen
 * server-mediated metadata edit path (shared validation, atomic live mutation,
 * draft boundary, account-owner metadata authority).
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
const publishAccount = (args) => roomCheckpointExport.publishAccountMetadataEdit({ ...args, authority: args.authority || testAuthorityFor(args.roomId) });
const {
  makeFakeDb,
  loadFirebaseServiceWithFakeDb,
  buildGameState
} = require('./helpers/fakeCheckpointFirestore');
const { createSyncServices } = require('../services/syncService');
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

const seedCanonical = (fake, roomId, gmId, revision = 4) => {
  const built = roomCheckpoint.buildCheckpointDocuments({
    roomId,
    gameState: buildGameState(),
    revision,
    roomMetadata: { name: 'Account Room', settings: { difficulty: 8 } }
  });
  expect(built.ok).to.equal(true);
  fake.setDocument(`rooms/${roomId}`, { id: roomId, gmId, members: [gmId], ...built.rootPatch });
  fake.setDocument(`rooms/${roomId}/gameState/current`, built.global.data);
  for (const doc of built.maps) {fake.setDocument(`rooms/${roomId}/gameState/${doc.mapId}`, doc.data);}
  return built;
};

describe('P3 last blockers A — restore must refuse live in-memory target', function() {
  this.timeout(20000);

  it('A1: live in-memory scratch target refuses; clean targets and receipts still work', async() => {
    const fake = makeFakeDb();
    const loaded = loadFirebaseServiceWithFakeDb(fake.db);
    const service = loaded.service;
    const exportDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p3-last-two-a-'));
    const previousDir = process.env.ROOM_EXPORT_DIR;
    process.env.ROOM_EXPORT_DIR = exportDir;
    const server = createProductionStackServer({
      firebaseBatchWriter: { queueWrite() {}, saveNow: async() => ({ outcome: 'confirmed' }) }
    });
    let services;
    try {
      await server.start();
      services = createSyncServices(server.io, server.rooms, server.players);

      await server.seedRoom('live-socket', {
        persistentRoomId: 'scratch_live_memory',
        gmUserId: 'owner',
        initialGameState: buildGameState({ globalExtra: { marker: 'accepted unsaved live' } })
      });
      const live = server.rooms.get('scratch_live_memory');
      expect(live).to.exist;

      fake.setDocument('rooms/source', { id: 'source', name: 'Source', settings: {}, gameState: buildGameState() });
      const exported = await roomCheckpointExport.ensureRollbackArtifact('source', service);
      expect(exported.ok).to.equal(true);
      expect(fake.stored.get('rooms/scratch_live_memory')).to.equal(undefined);

      // A live target with no durable root must refuse with zero writer calls.
      const liveSync = require('../services/syncService');
      const spy = sinon.spy(liveSync.FirebaseBatchWriter.prototype, 'saveNow');
      const commits = fake.batchCommits.length;
      const refused = await restoreScratch({
        artifactPath: exported.path, scratchRoomId: 'scratch_live_memory', firebaseService: service
      });
      expect(refused.ok).to.equal(false);
      expect(refused.reason).to.equal('scratch_target_live');
      expect(spy.called).to.equal(false);
      expect(fake.batchCommits.length).to.equal(commits);
      expect(fake.stored.get('rooms/scratch_live_memory')).to.equal(undefined);
      expect(live.gameState.marker).to.equal('accepted unsaved live');
      spy.restore();

      // Clean absent target still works; exact repeat is an idempotent receipt.
      const clean = await restoreScratch({
        artifactPath: exported.path, scratchRoomId: 'scratch_clean', firebaseService: service
      });
      expect(clean.ok, JSON.stringify(clean)).to.equal(true);
      const afterClean = fake.batchCommits.length;
      const again = await restoreScratch({
        artifactPath: exported.path, scratchRoomId: 'scratch_clean', firebaseService: service
      });
      expect(again.ok).to.equal(true);
      expect(again.alreadyVerified).to.equal(true);
      expect(fake.batchCommits.length).to.equal(afterClean);

      // Persisted targets still refuse as previously verified.
      await service.publishRoomCheckpoint('scratch_persisted', buildGameState(), {
        authority: { roomId: 'scratch_persisted', authorityInstanceId: 'test-instance', authorityGeneration: 1 }, revision: 1 });
      const occupied = await restoreScratch({
        artifactPath: exported.path, scratchRoomId: 'scratch_persisted', firebaseService: service
      });
      expect(occupied.ok).to.equal(false);
      expect(occupied.reason).to.equal('scratch_target_not_empty');
    } finally {
      if (services) {services.firebaseBatchWriter.stop(); services.movementDebouncer.stop();}
      await server.stop();
      if (previousDir === undefined) {delete process.env.ROOM_EXPORT_DIR;}
      else {process.env.ROOM_EXPORT_DIR = previousDir;}
      fs.rmSync(exportDir, { recursive: true, force: true });
      sinon.restore();
      loaded.restore();
    }
  });
});

describe('P3 last blockers B — shared metadata validation (account branch)', function() {
  this.timeout(20000);

  it('B1: account edits use the same validation; malformed patches refuse before any write', async() => {
    const fake = makeFakeDb();
    const loaded = loadFirebaseServiceWithFakeDb(fake.db);
    const service = loaded.service;
    try {
      seedCanonical(fake, 'acct', 'gm-1');
      const badPatches = [
        { name: '' },
        { settings: [] },
        { settings: 'bad' },
        { settings: null },
        { gameState: {} },
        { checkpoint: {} },
        { arbitrary: 1 },
        {}
      ];
      for (const updates of badPatches) {
        const commits = fake.batchCommits.length;
        const out = await publishAccount({
          roomId: 'acct', updates, gmUserId: 'gm-1', firebaseService: service
        });
        expect(out.ok, JSON.stringify(updates)).to.equal(false);
        expect(fake.batchCommits.length, JSON.stringify(updates)).to.equal(commits);
      }
      const root = fake.stored.get('rooms/acct');
      expect(root.name).to.equal('Account Room');
      expect(root.settings).to.deep.equal({ difficulty: 8 });

      // Valid account edit still checkpoints through the selected writer.
      const good = await publishAccount({
        roomId: 'acct',
        updates: { name: 'Renamed', description: 'Edited', settings: { maxPlayers: 8 } },
        gmUserId: 'gm-1',
        firebaseService: service
      });
      expect(good.ok, JSON.stringify(good)).to.equal(true);
      const updated = fake.stored.get('rooms/acct');
      expect(updated.name).to.equal('Renamed');
      expect(updated.description).to.equal('Edited');
      expect(updated.settings).to.deep.equal({ difficulty: 8, maxPlayers: 8 });
      expect(updated.checkpoint.revision).to.equal(5);

      // Foreign identity still refuses.
      const foreign = await publishAccount({
        roomId: 'acct', updates: { name: 'Hijack' }, gmUserId: 'other', firebaseService: service
      });
      expect(foreign.ok).to.equal(false);
      expect(foreign.reason).to.equal('not_room_gm');
    } finally {
      loaded.restore();
    }
  });

  it('B3: verified owner uninitialized draft edits bounded metadata and stays a draft', async() => {
    const fake = makeFakeDb();
    const loaded = loadFirebaseServiceWithFakeDb(fake.db);
    const service = loaded.service;
    try {
      fake.setDocument('rooms/draft', {
        id: 'draft', name: 'Draft original', description: 'Draft description', settings: { maxPlayers: 6 },
        checkpoint: null, isActive: false, gmId: 'owner', members: ['owner']
      });
      const commits = fake.batchCommits.length;
      const out = await publishAccount({
        roomId: 'draft',
        updates: { name: 'Draft renamed', description: 'New draft description', settings: { maxPlayers: 8 } },
        gmUserId: 'owner',
        firebaseService: service
      });
      expect(out.ok, JSON.stringify(out)).to.equal(true);
      expect(out.kind).to.equal('draft');
      // Exactly one additional atomic batch: the mandatory authority fence plus
      // the bounded metadata merge. No gameplay checkpoint is created.
      expect(fake.batchCommits.length).to.equal(commits + 1);
      const draftOps = fake.batchCommits[commits].ops;
      expect(draftOps.some((op) => op.path.startsWith('roomAuthorities/'))).to.equal(true);
      expect(draftOps.some((op) => op.path === 'rooms/draft')).to.equal(true);
      expect(draftOps.some((op) => op.path.includes('/gameState/'))).to.equal(false);
      const root = fake.stored.get('rooms/draft');
      expect(root.name).to.equal('Draft renamed');
      expect(root.description).to.equal('New draft description');
      expect(root.settings).to.deep.equal({ maxPlayers: 8 });
      expect(root.checkpoint).to.equal(null);
      expect(root.gameState).to.equal(undefined);

      for (const updates of [{ gameState: {} }, { checkpoint: {} }, { arbitrary: 1 }]) {
        const refused = await publishAccount({
          roomId: 'draft', updates, gmUserId: 'owner', firebaseService: service
        });
        expect(refused.ok, JSON.stringify(updates)).to.equal(false);
      }
      expect(fake.stored.get('rooms/draft').checkpoint).to.equal(null);
      expect(fake.stored.get('rooms/draft').gameState).to.equal(undefined);

      const foreign = await publishAccount({
        roomId: 'draft', updates: { name: 'Hijack' }, gmUserId: 'other', firebaseService: service
      });
      expect(foreign.ok).to.equal(false);
      expect(foreign.reason).to.equal('not_room_gm');
    } finally {
      loaded.restore();
    }
  });
});

describe('P3 last blockers B — live authority order and atomicity', function() {
  this.timeout(20000);

  it('B2/B4: live GM, same-owner account socket, atomic rejection, no gameplay authority', async() => {
    const saves = [];
    const server = createProductionStackServer({
      firebaseBatchWriter: {
        saveNow: async(roomId) => { saves.push(roomId); return { outcome: 'confirmed', revision: 9 }; },
        queueWrite: () => {}
      }
    });
    let gm;
    let account;
    let foreign;
    try {
      await server.start();
      server.setEventLimits('create_room', { maxPerMinute: 100, maxPerSecond: 100 });
      server.setEventLimits('update_room_metadata', { maxPerMinute: 1000, maxPerSecond: 100 });
      server.setEventLimits('map_update', { maxPerMinute: 1000, maxPerSecond: 100 });

      server.registerAuthToken('gm-token', 'gm-1');
      server.registerAuthToken('acct-token', 'gm-1');
      server.registerAuthToken('other-token', 'other-1');

      gm = server.connect({ token: 'gm-token' });
      await connected(gm);
      const room = await server.seedRoom(gm.id, { gmUserId: 'gm-1', persistentRoomId: 'live-meta' });
      expect(room.gmId).to.equal('gm-1');

      account = server.connect({ token: 'acct-token' });
      await connected(account);
      foreign = server.connect({ token: 'other-token' });
      await connected(foreign);

      // Account-owner metadata-only authority: not a game member.
      expect(server.players.has(account.id)).to.equal(false);
      const savesBefore = saves.length;
      const ownerAck = await emitAck(account, 'update_room_metadata', { roomId: 'live-meta', name: 'RoomManager rename' });
      expect(ownerAck.success, JSON.stringify(ownerAck)).to.equal(true);
      expect(room.name).to.equal('RoomManager rename');
      expect(saves.length).to.equal(savesBefore + 1);

      // No membership synthesis and no general GM gameplay powers.
      expect(server.players.has(account.id)).to.equal(false);
      expect(server.players.get(account.id)).to.equal(undefined);
      const mapAck = await emitAck(account, 'map_update', { roomId: 'live-meta', mapUpdates: {}, targetMapId: 'default' });
      expect(mapAck.success).to.equal(false);
      expect(room.gameState.maps.default.terrainData).to.deep.equal({});

      // Foreign account identity refuses.
      const foreignAck = await emitAck(foreign, 'update_room_metadata', { roomId: 'live-meta', name: 'Hijack' });
      expect(foreignAck.success).to.equal(false);
      expect(room.name).to.equal('RoomManager rename');

      // Account socket cannot touch gameplay/state fields.
      for (const payload of [{ gameState: {} }, { checkpoint: {} }, { arbitrary: 1 }]) {
        const ack = await emitAck(account, 'update_room_metadata', { roomId: 'live-meta', ...payload });
        expect(ack.success, JSON.stringify(payload)).to.equal(false);
      }
      expect(saves.length).to.equal(savesBefore + 1);

      // Compound invalid patches are atomic: zero mutation, zero writer.
      const nameBefore = room.name;
      const writesBefore = saves.length;
      const compound = await emitAck(account, 'update_room_metadata', {
        roomId: 'live-meta', name: 'Rejected-but-applied', settings: []
      });
      expect(compound.success).to.equal(false);
      expect(room.name).to.equal(nameBefore);
      expect(saves.length).to.equal(writesBefore);

      const compoundTwo = await emitAck(account, 'update_room_metadata', {
        roomId: 'live-meta', name: '', settings: { maxPlayers: 8 }
      });
      expect(compoundTwo.success).to.equal(false);
      expect(room.name).to.equal(nameBefore);
      expect(room.settings.maxPlayers).to.not.equal(8);
      expect(saves.length).to.equal(writesBefore);

      // Valid compound applies all fields atomically.
      const valid = await emitAck(account, 'update_room_metadata', {
        roomId: 'live-meta', name: 'Atomic rename', settings: { maxPlayers: 8 }
      });
      expect(valid.success).to.equal(true);
      expect(room.name).to.equal('Atomic rename');
      expect(room.settings.maxPlayers).to.equal(8);
      expect(saves.length).to.equal(writesBefore + 1);

      // The in-room GM authority path still works.
      const gmAck = await emitAck(gm, 'update_room_metadata', { roomId: 'live-meta', description: 'GM description' });
      expect(gmAck.success).to.equal(true);
      expect(room.description).to.equal('GM description');
    } finally {
      if (gm) {gm.disconnect();}
      if (account) {account.disconnect();}
      if (foreign) {foreign.disconnect();}
      await server.stop();
      sinon.restore();
    }
  });
});
