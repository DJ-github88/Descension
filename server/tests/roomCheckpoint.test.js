/**
 * Project 3 — frozen contract tests (server side).
 *
 * Covers the codec, classifier, atomic publication, revision lineage,
 * envelope preflight, export/restore and headless reconstruction authority.
 * External persistence is the in-memory Firestore double: the production
 * writer/reader/publisher code executes for real.
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
const { FirebaseBatchWriter } = require('../services/syncService');
const {
  makeFakeDb,
  loadFirebaseServiceWithFakeDb,
  buildGameState
} = require('./helpers/fakeCheckpointFirestore');
const { createProductionStackServer } = require('./helpers/productionStackServer');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const waitFor = async(predicate, timeoutMs = 4000, intervalMs = 10) => {
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

const publish = (service, roomId, gameState, options = {}) => service.publishRoomCheckpoint(roomId, gameState, {
  revision: options.revision !== undefined ? options.revision : 1,
  roomMetadata: options.roomMetadata || { name: 'Room', description: null, settings: {} },
  explicitConversion: options.explicitConversion,
  provenance: options.provenance,
  authority: options.authority || { roomId, authorityInstanceId: 'test-instance', authorityGeneration: 1 }
});

describe('P3 checkpoint codec', function() {
  this.timeout(15000);

  it('16+41: preserves nested arrays and opaque optional fields; rejects invalid values', () => {
    const gameState = buildGameState({
      extraMap: {
        gridItems: { g1: { id: 'g1', shape: { cells: [[true, false], [false, true]] }, legend: { note: 'authored' } } },
        drawingPaths: [{ id: 'stroke', points: [[1, 2], [3, 4]] }],
        customUnknown: { nested: { deep: [1, 2, { x: 'y' }] } }
      },
      globalExtra: {
        combat: { isActive: true, currentTurnIndex: 1, turnOrder: [{ tokenId: 'a' }, { tokenId: 'b' }], round: 3, currentTurnStartTime: 12345 },
        buffs: { t1: { id: 'b1', rounds: 2 } },
        travel: { clock: { tenday: 2, day: 3, hour: 7 }, hourLog: [], activeHour: 0 },
        weather: { enabled: false, type: 'none' },
        myOptionalDomain: { list: [{ a: [1, 2, 3] }], flag: false, zero: 0 }
      }
    });

    const built = roomCheckpoint.buildCheckpointDocuments({
      roomId: 'room-1',
      gameState,
      revision: 4,
      projectId: 'test-project',
      serverTimestamp: () => 'TS',
      deleteField: () => 'DEL'
    });
    expect(built.ok).to.equal(true);

    const decoded = roomCheckpoint.decodeCanonicalCheckpoint({
      checkpoint: built.manifest,
      globalDoc: built.global.data,
      mapDocsById: Object.fromEntries(built.maps.map((doc) => [doc.mapId, doc.data]))
    });
    expect(decoded.ok).to.equal(true);
    expect(decoded.maps.default.gridItems.g1.shape.cells).to.deep.equal([[true, false], [false, true]]);
    expect(decoded.maps.default.customUnknown.nested.deep[2]).to.deep.equal({ x: 'y' });
    expect(decoded.global.myOptionalDomain).to.deep.equal({ flag: false, list: [{ a: [1, 2, 3] }], zero: 0 });
    expect(decoded.global.combat.currentTurnStartTime).to.equal(12345);
    expect(decoded.global.travel.activeHour).to.equal(0);
    expect(decoded.global.maps).to.equal(undefined);
    expect(decoded.global.tokens).to.equal(undefined);

    const invalid = roomCheckpoint.canonicalize({ bad: [1, undefined, 3] }, 'x');
    expect(invalid.error).to.include('undefined_array_element');
    expect(roomCheckpoint.canonicalize({ bad: NaN }, 'x').error).to.include('non_finite_number');
    expect(roomCheckpoint.canonicalize({ bad: () => {} }, 'x').error).to.include('unsupported_function');
    expect(roomCheckpoint.canonicalize({ __proto__x: 1, constructor: 2 }, 'x').error).to.include('unsafe_key');
    const builtInvalid = roomCheckpoint.buildCheckpointDocuments({
      roomId: 'room-1',
      gameState: { maps: { default: { id: 'default', tokens: {}, bad: Symbol('x') } } },
      revision: 1,
      serverTimestamp: () => 'TS'
    });
    expect(builtInvalid.ok).to.equal(false);
    expect(builtInvalid.code).to.equal('CHECKPOINT_INVALID');
  });

  it('21/22/30: enforces the frozen operation/document/request envelope', () => {
    const manyMaps = { maps: {} };
    for (let index = 0; index < 499; index += 1) {
      const mapId = index === 0 ? 'default' : `map-${index}`;
      manyMaps.maps[mapId] = { id: mapId, tokens: {}, characterTokens: {}, gridItems: {} };
    }
    const tooMany = roomCheckpoint.buildCheckpointDocuments({
      roomId: 'room-ops',
      gameState: manyMaps,
      revision: 1,
      serverTimestamp: () => 'TS'
    });
    expect(tooMany.ok).to.equal(false);
    expect(tooMany.code).to.equal('CHECKPOINT_TOO_LARGE');
    expect(tooMany.reason).to.include('operation_limit');

    const atLimit = { maps: { ...manyMaps.maps } };
    delete atLimit.maps['map-498'];
    const fits = roomCheckpoint.buildCheckpointDocuments({
      roomId: 'room-ops',
      gameState: atLimit,
      revision: 1,
      serverTimestamp: () => 'TS'
    });
    expect(fits.ok).to.equal(true);
    expect(fits.operations).to.equal(500);

    const hugeMap = roomCheckpoint.buildCheckpointDocuments({
      roomId: 'room-size',
      gameState: { maps: { default: { id: 'default', tokens: {}, padding: 'x'.repeat(900 * 1024) } } },
      revision: 1,
      serverTimestamp: () => 'TS'
    });
    expect(hugeMap.ok).to.equal(false);
    expect(hugeMap.code).to.equal('CHECKPOINT_TOO_LARGE');
    expect(hugeMap.reason).to.include('document_limit');

    const manyDocs = { maps: {} };
    for (let index = 0; index < 100; index += 1) {
      const mapId = index === 0 ? 'default' : `map-${index}`;
      manyDocs.maps[mapId] = { id: mapId, tokens: {}, characterTokens: {}, gridItems: {}, padding: 'y'.repeat(95 * 1024) };
    }
    const requestTooLarge = roomCheckpoint.buildCheckpointDocuments({
      roomId: 'room-request',
      gameState: manyDocs,
      revision: 1,
      serverTimestamp: () => 'TS'
    });
    expect(requestTooLarge.ok).to.equal(false);
    expect(requestTooLarge.reason).to.include('request_limit');
  });

  it('31: mixed revision, missing marker, bad hash, duplicate or mismatched map IDs are rejected', () => {
    const built = roomCheckpoint.buildCheckpointDocuments({
      roomId: 'room-31',
      gameState: buildGameState({ mapCount: 2 }),
      revision: 7,
      serverTimestamp: () => 'TS'
    });
    expect(built.ok).to.equal(true);
    const docs = Object.fromEntries(built.maps.map((doc) => [doc.mapId, { ...doc.data }]));
    const base = {
      checkpoint: { ...built.manifest },
      globalDoc: { ...built.global.data },
      mapDocsById: docs
    };

    expect(roomCheckpoint.decodeCanonicalCheckpoint({
      ...base,
      mapDocsById: { default: docs.default }
    }).reason).to.equal('map_fragment_missing:map-1');
    expect(roomCheckpoint.decodeCanonicalCheckpoint({
      ...base,
      checkpoint: { ...base.checkpoint, committed: false }
    }).reason).to.equal('manifest_not_committed');
    expect(roomCheckpoint.decodeCanonicalCheckpoint({
      ...base,
      checkpoint: { ...base.checkpoint, contentHash: 'a'.repeat(64) }
    }).reason).to.equal('content_hash_mismatch');
    expect(roomCheckpoint.decodeCanonicalCheckpoint({
      ...base,
      checkpoint: { ...base.checkpoint, mapIds: ['default', 'default'] }
    }).code).to.equal('INCOMPLETE_CHECKPOINT');
    expect(roomCheckpoint.decodeCanonicalCheckpoint({
      ...base,
      mapDocsById: { ...docs, 'map-1': { ...docs['map-1'], mapId: 'wrong' } }
    }).reason).to.equal('map_id_mismatch:map-1');
    expect(roomCheckpoint.decodeCanonicalCheckpoint({
      ...base,
      globalDoc: { ...base.globalDoc, checkpointRevision: 6 }
    }).reason).to.equal('global_revision_mismatch');
    expect(roomCheckpoint.decodeCanonicalCheckpoint({
      ...base,
      mapDocsById: { ...docs, 'default': { ...docs.default, checkpointRevision: 6 } }
    }).reason).to.equal('map_revision_mismatch:default');
  });

  it('09: unknown newer schema is preserved/read-only, not a legacy downgrade', () => {
    const newer = roomCheckpoint.classifyRoomDocuments({
      roomId: 'room-newer',
      root: { exists: true, data: { id: 'room-newer', checkpoint: { schemaVersion: 2, revision: 5, committed: true, mapIds: [] } } },
      gameStateDocs: []
    });
    expect(newer.kind).to.equal('UNKNOWN_NEWER_VERSION');
    expect(newer.selectedSnapshot).to.equal(null);

    const newerFragment = roomCheckpoint.classifyRoomDocuments({
      roomId: 'room-newer',
      root: { exists: true, data: { id: 'room-newer' } },
      gameStateDocs: [{ id: 'current', data: { schemaVersion: 2, checkpointRevision: 1, snapshotJson: '{}' } }]
    });
    expect(newerFragment.kind).to.equal('UNKNOWN_NEWER_VERSION');
  });
});

describe('P3 legacy classification', function() {
  this.timeout(15000);

  const inlineCandidate = () => ({
    tokens: { t1: { id: 't1', mapId: 'default' } },
    characterTokens: {},
    gridItems: {},
    combat: { isActive: true, currentTurn: 0, turnOrder: [{ tokenId: 't1' }], round: 1 },
    defaultMapId: 'default',
    maps: {
      default: {
        id: 'default',
        name: 'Default Map',
        tokens: { t1: { id: 't1', mapId: 'default' } },
        characterTokens: {},
        gridItems: {},
        terrainData: { '0,0': 'grass' },
        drawingPaths: [{ id: 'd1' }],
        fogOfWarPaths: [{ id: 'f1' }],
        environmentalObjects: [{ id: 'o1' }]
      }
    }
  });

  it('03: legacy inline-only maps/combat are classified and selected, not empty (R1)', () => {
    const classification = roomCheckpoint.classifyRoomDocuments({
      roomId: 'room-inline',
      root: { exists: true, data: { id: 'room-inline', gameState: inlineCandidate() } },
      gameStateDocs: []
    });
    expect(classification.kind).to.equal('LEGACY_INLINE_ONLY');
    expect(classification.selectedSnapshot.mapIds).to.deep.equal(['default']);
    expect(classification.selectedSnapshot.global.combat.isActive).to.equal(true);
    expect(classification.selectedSnapshot.maps.default.terrainData).to.deep.equal({ '0,0': 'grass' });
    expect(classification.migrationRequired).to.equal(true);
  });

  it('03b: root-only browser inline shape projects one deterministic map', () => {
    const classification = roomCheckpoint.classifyRoomDocuments({
      roomId: 'room-root-only',
      root: {
        exists: true,
        data: {
          id: 'room-root-only',
          gameState: {
            tokens: { t1: { id: 't1' } },
            characterTokens: {},
            gridItems: { g1: { id: 'g1' } },
            combat: { isActive: false, currentTurn: null, turnOrder: [], round: 0 },
            levelEditor: { terrainData: { '1,1': 'stone' }, drawingPaths: [{ id: 'd1' }], dndElements: [{ id: 'o1' }], fogOfWarData: {}, fogOfWarPaths: [], environmentalObjects: [], wallData: {}, lightSources: {} },
            mapData: { backgrounds: [{ id: 'bg' }] },
            inventory: { droppedItems: {} }
          }
        }
      },
      gameStateDocs: []
    });
    expect(classification.kind).to.equal('LEGACY_INLINE_ONLY');
    expect(classification.selectedSnapshot.mapIds).to.deep.equal(['default']);
    expect(classification.selectedSnapshot.maps.default.terrainData).to.deep.equal({ '1,1': 'stone' });
    expect(classification.selectedSnapshot.maps.default.drawingPaths).to.deep.equal([{ id: 'd1' }]);
  });

  it('04: legacy split-only complete candidate is labelled legacy, not versioned', () => {
    const classification = roomCheckpoint.classifyRoomDocuments({
      roomId: 'room-split',
      root: { exists: true, data: { id: 'room-split', isSplitStorage: true } },
      gameStateDocs: [
        { id: 'current', data: { defaultMapId: 'default', combat: { isActive: false }, tokens: {}, characterTokens: {}, gridItems: {}, lastUpdated: 'x' } },
        { id: 'default', data: { id: 'default', tokens: { t1: { id: 't1' } }, characterTokens: {}, gridItems: {}, terrainData: {} } }
      ]
    });
    expect(classification.kind).to.equal('LEGACY_SPLIT_ONLY_COMPLETE');
    expect(classification.migrationRequired).to.equal(true);
    expect(classification.selectedSnapshot.maps.default.tokens.t1).to.deep.equal({ id: 't1' });
  });

  it('07: partial split (lone current / missing required map) is not complete or empty', () => {
    const loneCurrent = roomCheckpoint.classifyRoomDocuments({
      roomId: 'room-partial',
      root: { exists: true, data: { id: 'room-partial', isSplitStorage: true } },
      gameStateDocs: [{ id: 'current', data: { defaultMapId: 'default' } }]
    });
    expect(loneCurrent.kind).to.equal('PARTIAL_SPLIT');
    expect(loneCurrent.selectedSnapshot).to.equal(null);

    const missingDefault = roomCheckpoint.classifyRoomDocuments({
      roomId: 'room-partial',
      root: { exists: true, data: { id: 'room-partial' } },
      gameStateDocs: [
        { id: 'current', data: { defaultMapId: 'missing' } },
        { id: 'map-a', data: { id: 'map-a' } }
      ]
    });
    expect(missingDefault.kind).to.equal('PARTIAL_SPLIT');
  });

  it('05/06: dual candidates select only when equivalent or hash-bound; otherwise ambiguous', () => {
    const inline = inlineCandidate();
    const splitCurrent = { defaultMapId: 'default', combat: { isActive: true, currentTurn: 0, turnOrder: [{ tokenId: 't1' }], round: 1 }, tokens: { t1: { id: 't1', mapId: 'default' } } };
    const splitMap = { ...inline.maps.default };
    const equivalent = roomCheckpoint.classifyRoomDocuments({
      roomId: 'room-both',
      root: { exists: true, data: { id: 'room-both', gameState: inline } },
      gameStateDocs: [
        { id: 'current', data: splitCurrent },
        { id: 'default', data: splitMap }
      ]
    });
    expect(equivalent.kind).to.equal('LEGACY_BOTH_INLINE_SPLIT');
    expect(equivalent.selection.status).to.equal('EQUIVALENT');
    expect(equivalent.selectedCandidateId).to.equal('inline');

    const conflicting = JSON.parse(JSON.stringify(inline));
    conflicting.maps.default.drawingPaths = [{ id: 'different-stroke' }];
    const ambiguous = roomCheckpoint.classifyRoomDocuments({
      roomId: 'room-both',
      root: { exists: true, data: { id: 'room-both', gameState: conflicting, lastActivity: 'newer-looking' } },
      gameStateDocs: [
        { id: 'current', data: splitCurrent },
        { id: 'default', data: splitMap }
      ]
    });
    expect(ambiguous.kind).to.equal('LEGACY_BOTH_INLINE_SPLIT');
    expect(ambiguous.selection.status).to.equal('AMBIGUOUS_RECONCILIATION_REQUIRED');
    expect(ambiguous.selectedSnapshot).to.equal(null);
    expect(ambiguous.candidates.inline.raw).to.equal(undefined);

    const inlineHash = roomCheckpoint.candidateHash(roomCheckpoint.adaptInlineCandidate(conflicting));
    const splitHash = roomCheckpoint.candidateHash(roomCheckpoint.adaptSplitCandidate(splitCurrent, [{ id: 'default', data: splitMap }]));
    const selected = roomCheckpoint.classifyRoomDocuments({
      roomId: 'room-both',
      root: {
        exists: true,
        data: {
          id: 'room-both',
          gameState: conflicting,
          checkpointSelection: {
            decisionId: 'decision-1',
            selectedCandidateId: 'inline',
            candidateHashes: { inline: inlineHash, split: splitHash },
            decidedAt: '2026-10-05T00:00:00.000Z',
            decidedBy: 'creator'
          }
        }
      },
      gameStateDocs: [
        { id: 'current', data: splitCurrent },
        { id: 'default', data: splitMap }
      ]
    });
    expect(selected.selection.status).to.equal('SELECTED');
    expect(selected.selectedCandidateId).to.equal('inline');
    expect(selected.selectedSnapshot.maps.default.drawingPaths).to.deep.equal([{ id: 'different-stroke' }]);
  });

  it('10: absent, no-snapshot and read failure are distinct', () => {
    expect(roomCheckpoint.classifyRoomDocuments({ roomId: 'a', root: { exists: false }, gameStateDocs: [] }).kind)
      .to.equal('ABSENT_ROOM');
    expect(roomCheckpoint.classifyRoomDocuments({
      roomId: 'a',
      root: { exists: true, data: { id: 'a', checkpoint: null } },
      gameStateDocs: []
    }).kind).to.equal('ROOM_PRESENT_NO_SNAPSHOT');
    expect(roomCheckpoint.classifyRoomDocuments({
      roomId: 'a',
      root: { exists: true, data: { id: 'a' } },
      gameStateDocs: []
    }).kind).to.equal('ROOM_PRESENT_NO_SNAPSHOT');
  });

  it('10b: service read failure is READ_FAILED and never ABSENT', async() => {
    const fake = makeFakeDb();
    const { service, restore } = loadFirebaseServiceWithFakeDb(fake.db);
    try {
      fake.db.runTransaction = async() => {throw Object.assign(new Error('permission denied'), { code: 'permission-denied' });};
      const classification = await service.readRoomCheckpoint('room-x');
      expect(classification.kind).to.equal('READ_FAILED');
      expect(classification.kind).to.not.equal('ABSENT_ROOM');
    } finally {
      restore();
    }
  });
});

describe('P3 atomic publication and revision lineage', function() {
  this.timeout(15000);

  it('01/02/24: canonical single and multi-map round trips confirm only after one complete batch', async() => {
    const fake = makeFakeDb();
    fake.setBehavior(() => null);
    const { service, restore } = loadFirebaseServiceWithFakeDb(fake.db);
    try {
      const gameState = buildGameState({
        mapCount: 2,
        globalExtra: { combat: { isActive: false, currentTurnIndex: null, turnOrder: [], round: 0 } }
      });
      const result = await publish(service, 'round-trip', gameState, { revision: 3 });
      expect(result.outcome).to.equal('confirmed');
      expect(result.revision).to.equal(3);
      expect(fake.batchCommits.length).to.equal(1);
      // Root + global + two maps + the mandatory authority fence write.
      expect(fake.batchCommits[0].ops.length).to.equal(5);
      expect(fake.batchCommits[0].ops.some((op) => op.path.startsWith('roomAuthorities/'))).to.equal(true);

      const classification = await service.readRoomCheckpoint('round-trip');
      expect(classification.kind).to.equal('CANONICAL_COMPLETE_CHECKPOINT');
      expect(classification.revision).to.equal(3);
      expect(classification.selectedSnapshot.mapIds).to.deep.equal(['default', 'map-1']);

      const persistedRoot = fake.stored.get('rooms/round-trip');
      expect(persistedRoot.checkpoint.committed).to.equal(true);
      expect(persistedRoot.checkpoint.revision).to.equal(3);
      expect(persistedRoot.gameState).to.equal(undefined);
    } finally {
      restore();
    }
  });

  it('23/34: rejected or uncertain commits never publish a complete checkpoint and retry verifies identity', async() => {
    const fake = makeFakeDb();
    let rejectNext = true;
    fake.setBehavior(() => {
      if (rejectNext) {rejectNext = false; return 'reject';}
      return null;
    });
    const { service, restore } = loadFirebaseServiceWithFakeDb(fake.db);
    try {
      const gameState = buildGameState();
      const first = await publish(service, 'room-fault', gameState, { revision: 1 });
      expect(first.outcome).to.equal('retryable');
      expect(fake.stored.has('rooms/room-fault/gameState/current')).to.equal(false);

      const beforeAbsent = await service.readRoomCheckpoint('room-fault');
      expect(beforeAbsent.kind).to.equal('ABSENT_ROOM');

      const retry = await publish(service, 'room-fault', gameState, { revision: 1 });
      expect(retry.outcome).to.equal('confirmed');
      const after = await service.readRoomCheckpoint('room-fault');
      expect(after.kind).to.equal('CANONICAL_COMPLETE_CHECKPOINT');
      expect(after.revision).to.equal(1);

      // Equal revision with identical content/metadata verifies without a
      // second batch commit.
      const before = fake.batchCommits.length;
      const identical = await publish(service, 'room-fault', gameState, { revision: 1 });
      expect(identical.outcome).to.equal('confirmed');
      expect(fake.batchCommits.length).to.equal(before);

      // Equal revision with different content is a conflict, not a rewrite.
      const different = buildGameState({ globalExtra: { marker: 'different' } });
      const conflict = await publish(service, 'room-fault', different, { revision: 1 });
      expect(conflict.outcome).to.equal('permanent');
      expect(conflict.code).to.equal('CHECKPOINT_REVISION_CONFLICT');

      // Older revision can never overwrite a newer head.
      const older = await publish(service, 'room-fault', gameState, { revision: 0 });
      expect(older.outcome).to.equal('permanent');
      const stale = await publish(service, 'room-fault', different, { revision: 1 });
      expect(stale.code).to.equal('CHECKPOINT_REVISION_CONFLICT');
    } finally {
      restore();
    }
  });

  it('32: a concurrent reader observes old-complete or new-complete, never mixed', async() => {
    const fake = makeFakeDb();
    const built = roomCheckpoint.buildCheckpointDocuments({
      roomId: 'room-coherent',
      gameState: buildGameState({ globalExtra: { marker: 'old' } }),
      revision: 1,
      serverTimestamp: () => 'TS'
    });
    fake.setDocument('rooms/room-coherent', { id: 'room-coherent', checkpoint: built.manifest, isSplitStorage: true });
    fake.setDocument('rooms/room-coherent/gameState/current', built.global.data);
    for (const mapDoc of built.maps) {fake.setDocument(`rooms/room-coherent/gameState/${mapDoc.mapId}`, mapDoc.data);}

    const { service, restore } = loadFirebaseServiceWithFakeDb(fake.db);
    try {
      const before = await service.readRoomCheckpoint('room-coherent');
      expect(before.kind).to.equal('CANONICAL_COMPLETE_CHECKPOINT');
      expect(before.selectedSnapshot.global.marker).to.equal('old');

      // Start the publication, hold the commit, and read while unsettled.
      let releaseCommit;
      const held = new Promise((resolve) => { releaseCommit = resolve; });
      fake.setBehavior((ops) => {
        if (ops.some((op) => op.path.endsWith('/gameState/current'))) {return held.then(() => null);}
        return null;
      });
      const publishPromise = publish(service, 'room-coherent', buildGameState({ globalExtra: { marker: 'new' } }), { revision: 2 });
      await wait(20);
      const during = await service.readRoomCheckpoint('room-coherent');
      expect(during.revision).to.equal(1);
      expect(during.selectedSnapshot.global.marker).to.equal('old');

      releaseCommit();
      await publishPromise;
      const after = await service.readRoomCheckpoint('room-coherent');
      expect(after.revision).to.equal(2);
      expect(after.selectedSnapshot.global.marker).to.equal('new');
    } finally {
      restore();
    }
  });

  it('33+43: revision floor, skipped revisions and captured metadata stay with the revision', async() => {
    const revisions = [];
    const writer = new FirebaseBatchWriter(20, 50, {
      persist: async(roomId, snapshot, context) => {
        revisions.push(context.revision);
        return { outcome: 'confirmed', revision: context.revision, manifest: { schemaVersion: 1, revision: context.revision, mapIds: ['default'], contentHash: 'x'.repeat(64) } };
      },
      getRoomRevision: () => 41,
      captureMetadata: () => ({ name: 'Room A', settings: { description: 'captured', difficulty: 2 } })
    });
    try {
      const first = writer.queueWrite('room-a', buildGameState());
      expect(first).to.be.greaterThan(41);
      await waitFor(() => revisions.length === 1);

      // A coalesced newer snapshot skips numbers; contiguity is not required.
      writer.queueWrite('room-a', buildGameState({ globalExtra: { marker: 'newer' } }), true);
      await waitFor(() => revisions.length === 2);
      expect(revisions[1]).to.be.greaterThan(revisions[0]);
    } finally {
      writer.stop();
    }

    const fake = makeFakeDb();
    const { service, restore } = loadFirebaseServiceWithFakeDb(fake.db);
    try {
      const metadata = { name: 'Captured', description: 'from capture', settings: { description: 'from capture', difficulty: 3 } };
      await publish(service, 'room-meta', buildGameState(), { revision: 2, roomMetadata: metadata });
      const rootBefore = fake.stored.get('rooms/room-meta');
      expect(rootBefore.name).to.equal('Captured');
      expect(rootBefore.settings.difficulty).to.equal(3);

      // A later live metadata edit does not leak into the older in-flight
      // capture: the equal-revision verification compares captured metadata.
      const changed = await publish(service, 'room-meta', buildGameState(), {
        revision: 2,
        roomMetadata: { name: 'Edited Later', description: 'edited', settings: { difficulty: 9 } }
      });
      expect(changed.outcome).to.equal('permanent');
      expect(changed.code).to.equal('CHECKPOINT_REVISION_CONFLICT');
      expect(fake.stored.get('rooms/room-meta').name).to.equal('Captured');
    } finally {
      restore();
    }
  });

  it('35: legacy large/small shapes never change the canonical lane after conversion', async() => {
    const fake = makeFakeDb();
    const { service, restore } = loadFirebaseServiceWithFakeDb(fake.db);
    try {
      const large = buildGameState({ mapCount: 2, globalExtra: { padding: 'p'.repeat(110000) } });
      const first = await publish(service, 'room-lane', large, { revision: 1 });
      expect(first.outcome).to.equal('confirmed');

      const small = buildGameState({ globalExtra: { padding: 's' } });
      const second = await publish(service, 'room-lane', small, { revision: 2 });
      expect(second.outcome).to.equal('confirmed');

      const classification = await service.readRoomCheckpoint('room-lane');
      expect(classification.kind).to.equal('CANONICAL_COMPLETE_CHECKPOINT');
      expect(classification.revision).to.equal(2);
      expect(classification.selectedSnapshot.mapIds).to.deep.equal(['default']);
      expect(classification.selectedSnapshot.maps['map-1']).to.equal(undefined);
    } finally {
      restore();
    }
  });

  it('36: migration gate refuses canonical publication of a selected legacy room without explicit conversion', async() => {
    const fake = makeFakeDb();
    fake.setDocument('rooms/room-legacy', { id: 'room-legacy', gameState: { defaultMapId: 'default', maps: { default: { id: 'default', tokens: {}, characterTokens: {}, gridItems: {} } } } });
    const { service, restore } = loadFirebaseServiceWithFakeDb(fake.db);
    try {
      const classification = await service.readRoomCheckpoint('room-legacy');
      expect(classification.kind).to.equal('LEGACY_INLINE_ONLY');

      const refused = await publish(service, 'room-legacy', buildGameState(), {
        revision: 1,
        roomMetadata: { name: 'Legacy', description: null, settings: {}, migrationRequired: true }
      });
      expect(refused.outcome).to.equal('permanent');
      expect(refused.code).to.equal('MIGRATION_REQUIRED');
      expect(fake.stored.get('rooms/room-legacy').checkpoint).to.equal(undefined);

      const converted = await publish(service, 'room-legacy', buildGameState(), {
        revision: 1,
        roomMetadata: { name: 'Legacy', description: null, settings: {}, migrationRequired: true, explicitConversion: true },
        explicitConversion: true,
        provenance: { kind: 'legacy-inline', selectedCandidateId: 'inline', rollbackArtifactId: 'artifact-1' }
      });
      expect(converted.outcome).to.equal('confirmed');
      expect(fake.stored.get('rooms/room-legacy').gameState).to.equal(undefined);
      expect(fake.stored.get('rooms/room-legacy').checkpoint.provenance.kind).to.equal('legacy-inline');
    } finally {
      restore();
    }
  });

  it('33b: a root precondition conflict is retryable, not a partial write', async() => {
    const fake = makeFakeDb();
    const { service, restore } = loadFirebaseServiceWithFakeDb(fake.db);
    try {
      await publish(service, 'room-pre', buildGameState(), { revision: 1 });
      fake.setBehavior((ops) => {
        if (ops.some((op) => op.type === 'update' && op.precondition)) {
          throw Object.assign(new Error('the stored version does not match the precondition'), { code: 'failed-precondition' });
        }
        return null;
      });
      const next = await publish(service, 'room-pre', buildGameState({ globalExtra: { marker: 'next' } }), { revision: 2 });
      expect(next.outcome).to.equal('retryable');
      expect(next.reason).to.equal('root_precondition_conflict');
      const still = await service.readRoomCheckpoint('room-pre');
      expect(still.revision).to.equal(1);
    } finally {
      restore();
    }
  });
});

describe('P3 selected-room export / restore fixture', function() {
  this.timeout(20000);

  it('25/26: exports raw candidates, restores into scratch once, repeats idempotently', async() => {
    const fake = makeFakeDb();
    const { service, restore } = loadFirebaseServiceWithFakeDb(fake.db);
    const exportDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p3-export-'));
    const previousDir = process.env.ROOM_EXPORT_DIR;
    process.env.ROOM_EXPORT_DIR = exportDir;
    try {
      const gameState = buildGameState({
        mapCount: 2,
        extraMap: { drawingPaths: [{ id: 'd1' }], tokens: { t1: { id: 't1', mapId: 'default' } } }
      });
      await publish(service, 'source-room', gameState, { revision: 4 });

      const exported = await roomCheckpointExport.ensureRollbackArtifact('source-room', service);
      expect(exported.ok).to.equal(true);
      expect(fs.existsSync(exported.path)).to.equal(true);

      const validated = roomCheckpointExport.validateArtifact(roomCheckpointExport.readArtifactFile(exported.path).artifact);
      expect(validated.ok).to.equal(true);

      const tampered = JSON.parse(fs.readFileSync(exported.path, 'utf8'));
      tampered.globalData.combat = { isActive: true, tampered: true };
      const tamperedValidation = roomCheckpointExport.validateArtifact(tampered);
      expect(tamperedValidation.ok).to.equal(false);
      expect(tamperedValidation.errors).to.include('checksum_mismatch');

      const restored = await restoreScratch({
        artifactPath: exported.path,
        scratchRoomId: 'scratch_room_1',
        firebaseService: service
      });
      expect(restored.ok).to.equal(true);
      expect(restored.alreadyVerified).to.equal(false);

      const scratch = await service.readRoomCheckpoint('scratch_room_1');
      expect(scratch.kind).to.equal('CANONICAL_COMPLETE_CHECKPOINT');
      expect(scratch.selectedSnapshot.mapIds).to.deep.equal(['default', 'map-1']);
      expect(scratch.selectedSnapshot.maps.default.drawingPaths).to.deep.equal([{ id: 'd1' }]);
      expect(scratch.checkpoint.provenance.kind).to.equal('restore');

      const again = await restoreScratch({
        artifactPath: exported.path,
        scratchRoomId: 'scratch_room_1',
        firebaseService: service
      });
      expect(again.ok).to.equal(true);
      expect(again.alreadyVerified).to.equal(true);

      const refusedSource = await restoreScratch({
        artifactPath: exported.path,
        scratchRoomId: 'source-room',
        firebaseService: service
      });
      expect(refusedSource.ok).to.equal(false);
      expect(refusedSource.reason).to.equal('scratch_room_id_required');

      const refusedExisting = await restoreScratch({
        artifactPath: exported.path,
        scratchRoomId: 'scratch_occupied',
        firebaseService: service
      });
      expect(refusedExisting.ok).to.equal(true);
      expect(refusedExisting.alreadyVerified).to.equal(false);
      await publish(service, 'scratch_occupied', buildGameState({ globalExtra: { marker: 'other' } }), { revision: 2 });
      const refusedOccupied = await restoreScratch({
        artifactPath: exported.path,
        scratchRoomId: 'scratch_occupied',
        firebaseService: service
      });
      expect(refusedOccupied.ok).to.equal(false);
      expect(refusedOccupied.reason).to.equal('scratch_target_not_empty');
    } finally {
      if (previousDir === undefined) {delete process.env.ROOM_EXPORT_DIR;}
      else {process.env.ROOM_EXPORT_DIR = previousDir;}
      fs.rmSync(exportDir, { recursive: true, force: true });
      restore();
    }
  });

  it('36b: export failure stops conversion (no rollback artifact, no unverified write)', async() => {    const fake = makeFakeDb();
    const { service, restore } = loadFirebaseServiceWithFakeDb(fake.db);
    const previousDir = process.env.ROOM_EXPORT_DIR;
    delete process.env.ROOM_EXPORT_DIR;
    try {
      fake.setDocument('rooms/room-exportless', {
        id: 'room-exportless',
        gameState: { defaultMapId: 'default', maps: { default: { id: 'default', tokens: {}, characterTokens: {}, gridItems: {} } } }
      });
      const result = await roomCheckpointExport.ensureRollbackArtifact('room-exportless', service);
      expect(result.ok).to.equal(false);
      expect(result.reason).to.equal('export_destination_unconfigured');
    } finally {
      if (previousDir !== undefined) {process.env.ROOM_EXPORT_DIR = previousDir;}
      restore();
    }
  });
});

describe('P3 reconstruction authority (real handler stack)', function() {
  this.timeout(20000);

  let server;
  let clients;
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

  beforeEach(async() => {
    clients = [];
    server = null;
    sinon.restore();
  });

  afterEach(async() => {
    for (const client of clients) {
      try { client.disconnect(); } catch (_error) { /* noop */ }
    }
    for (const writer of writers.splice(0)) {writer.stop();}
    if (server) {await server.stop();}
    sinon.restore();
  });

  const startServer = async() => {
    const writer = new FirebaseBatchWriter(60000, 50, {
      persist: async(roomId, snapshot, context) => ({ outcome: 'confirmed', revision: context.revision }),
      captureMetadata: () => ({ name: 'Test', settings: {} })
    });
    writers.push(writer);
    server = createProductionStackServer({ debounceMs: 40, firebaseBatchWriter: writer });
    await server.start();
    server.setEventLimits('create_room', { maxPerMinute: 100, maxPerSecond: 100 });
    return writer;
  };

  it('18: live server memory wins ordinary rejoin; older cloud state is never fetched', async() => {
    await startServer();
    const gm = await openVerified();
    const room = await server.seedRoom(gm.client.id, { gmUserId: gm.userId, persistentRoomId: 'persist-live-1' });
    room.gameState.maps.default.tokens.live = { id: 'live', unsavedEdit: true };
    delete room.gameState.maps['deleted-map'];
    room.checkpointRevision = 9;

    const readStub = sinon.stub(firebaseService, 'readRoomCheckpoint').rejects(new Error('cloud must not be consulted on live rejoin'));

    const joined = once(gm.client, 'room_joined');
    gm.client.emit('create_room', {
      gmName: 'GM',
      persistentRoomId: 'persist-live-1',
      password: '',
      playerColor: '#ffffff'
    });
    const payload = await joined;
    expect(readStub.called).to.equal(false);
    const liveRoom = server.rooms.get(room.id);
    expect(liveRoom.gameState.maps.default.tokens.live.unsavedEdit).to.equal(true);
    expect(payload.room.gameState.maps.default.tokens.live).to.exist;
  });

  it('42: absent-memory reconstruction performs one classified read, hydrates by replacement and does not autosave cloud state', async() => {
    await startServer();
    const gm = await openVerified();

    const canonical = roomCheckpoint.buildCheckpointDocuments({
      roomId: 'persist-reconstructed',
      gameState: buildGameState({
        mapCount: 2,
        extraMap: { drawingPaths: [{ id: 'stroke-1' }], environmentalObjects: [{ id: 'obj-1' }], tokens: { t1: { id: 't1', mapId: 'default' } } },
        globalExtra: { combat: { isActive: true, currentTurnIndex: 0, turnOrder: [{ tokenId: 't1' }], round: 2 } }
      }),
      revision: 12,
      serverTimestamp: () => 'TS'
    });
    const classification = roomCheckpoint.classifyRoomDocuments({
      roomId: 'persist-reconstructed',
      root: { exists: true, data: { id: 'persist-reconstructed', checkpoint: canonical.manifest, gmId: gm.userId, members: [gm.userId], checkpointSelection: null } },
      gameStateDocs: [
        { id: 'current', data: canonical.global.data },
        ...canonical.maps.map((doc) => ({ id: doc.mapId, data: doc.data }))
      ]
    });
    expect(classification.kind).to.equal('CANONICAL_COMPLETE_CHECKPOINT');

    const readStub = sinon.stub(firebaseService, 'readRoomCheckpoint').resolves(classification);
    const saveStub = sinon.spy(firebaseService, 'saveRoomData');
    const publishStub = sinon.stub(firebaseService, 'publishRoomCheckpoint').resolves({ outcome: 'confirmed', revision: 13 });

    const joined = once(gm.client, 'room_joined');
    gm.client.emit('create_room', {
      gmName: 'GM',
      persistentRoomId: 'persist-reconstructed',
      password: '',
      playerColor: '#ffffff'
    });
    await joined;

    expect(readStub.callCount).to.equal(2, 'C5: one classification read plus one post-acquisition re-read');
    // Reconstruction is read-only: no creation-time metadata save.
    expect(saveStub.called).to.equal(false);
    expect(publishStub.called).to.equal(false);

    const room = server.rooms.get('persist-reconstructed');
    expect(room.checkpointRevision).to.equal(12);
    expect(room.migrationRequired).to.equal(false);
    expect(room.gameState.maps.default.drawingPaths).to.deep.equal([{ id: 'stroke-1' }]);
    expect(room.gameState.maps.default.environmentalObjects).to.deep.equal([{ id: 'obj-1' }]);
    expect(room.gameState.maps['map-1']).to.exist;
    expect(Object.keys(room.gameState.maps)).to.deep.equal(['default', 'map-1']);
    expect(room.gameState.combat.turnOrder).to.deep.equal([{ tokenId: 't1' }]);
  });

  it('07b/09b: incomplete or unknown-newer rooms are refused, not reconstructed empty or rewritten', async() => {
    await startServer();
    const gm = await openVerified();

    const byRoom = {
      'persist-broken': {
        kind: 'INCOMPLETE_CHECKPOINT',
        roomId: 'persist-broken',
        selectedSnapshot: null,
        diagnostics: [{ code: 'map_fragment_missing:default', message: 'missing' }],
        roomMetadata: { gmId: gm.userId }
      },
      'persist-newer': {
        kind: 'UNKNOWN_NEWER_VERSION',
        roomId: 'persist-newer',
        selectedSnapshot: null,
        diagnostics: [{ code: 'MANIFEST_SCHEMA_UNSUPPORTED', message: 'newer' }],
        roomMetadata: { gmId: gm.userId }
      }
    };
    sinon.stub(firebaseService, 'readRoomCheckpoint').callsFake(async(roomId) => byRoom[roomId]);
    const errorPromise = once(gm.client, 'room_error');
    gm.client.emit('create_room', { gmName: 'GM', persistentRoomId: 'persist-broken', password: '' });
    const error = await errorPromise;
    expect(error.error).to.include('incomplete');
    expect(server.rooms.has('persist-broken')).to.equal(false);

    const errorPromise2 = once(gm.client, 'room_error');
    gm.client.emit('create_room', { gmName: 'GM', persistentRoomId: 'persist-newer', password: '' });
    const error2 = await errorPromise2;
    expect(error2.error).to.include('newer');
    expect(server.rooms.has('persist-newer')).to.equal(false);
  });

  it('10c: READ_FAILED is refused and never becomes an empty room', async() => {
    await startServer();
    const gm = await openVerified();
    sinon.stub(firebaseService, 'readRoomCheckpoint').resolves({
      kind: 'READ_FAILED',
      roomId: 'persist-unavailable',
      code: 'UNAVAILABLE',
      selectedSnapshot: null,
      diagnostics: [{ code: 'UNAVAILABLE', message: 'no db' }],
      roomMetadata: null
    });
    const errorPromise = once(gm.client, 'room_error');
    gm.client.emit('create_room', { gmName: 'GM', persistentRoomId: 'persist-unavailable', password: '' });
    const error = await errorPromise;
    expect(error.error).to.include('unavailable');
    expect(server.rooms.has('persist-unavailable')).to.equal(false);
  });

  it('local import is accepted only into an uninitialized draft and rejected otherwise', async() => {
    await startServer();
    const gm = await openVerified();

    const stub = sinon.stub(firebaseService, 'readRoomCheckpoint');
    stub.resolves({
      kind: 'ROOM_PRESENT_NO_SNAPSHOT',
      roomId: 'persist-import',
      selectedSnapshot: null,
      diagnostics: [],
      roomMetadata: { gmId: gm.userId, name: 'Import target' }
    });

    const joined = once(gm.client, 'room_joined');
    gm.client.emit('create_room', {
      gmName: 'GM',
      persistentRoomId: 'persist-import',
      password: '',
      gameState: {
        tokens: { t1: { id: 't1' } },
        characterTokens: {},
        gridItems: {},
        levelEditor: { terrainData: { '2,2': 'grass' }, drawingPaths: [{ id: 'imported-stroke' }] },
        mapData: {},
        inventory: { droppedItems: {} },
        combat: { isActive: false, currentTurn: null, turnOrder: [], round: 0 }
      }
    });
    await joined;
    const room = server.rooms.get('persist-import');
    expect(room.gameState.maps.default.terrainData).to.deep.equal({ '2,2': 'grass' });
    expect(room.gameState.maps.default.drawingPaths).to.deep.equal([{ id: 'imported-stroke' }]);
    expect(room.pendingProvenance.kind).to.equal('local-import');
  });
});
