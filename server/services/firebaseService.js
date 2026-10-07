// Firebase Admin SDK service for server-side operations
const admin = require('firebase-admin');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');
const roomCheckpoint = require('./roomCheckpoint');

// Initialize Firebase Admin SDK
let db = null;
let isInitialized = false;

/**
 * Bounded room-writer outcome contract (Project 2).
 *
 * This is intentionally local to the room game-state persistence path. It is
 * not a repository-wide Result type and no other Firebase service is required
 * to adopt it.
 *
 * - CONFIRMED: the intended snapshot was durably accepted by the configured
 *   cloud persistence path.
 * - UNAVAILABLE: no durable cloud write occurred (Firebase absent/local-only).
 *   This is never success.
 * - RETRYABLE: the write did not complete, but retrying the same snapshot is
 *   appropriate.
 * - PERMANENT: the requested write cannot be retried unchanged.
 */
const ROOM_WRITE_OUTCOMES = Object.freeze({
  CONFIRMED: 'confirmed',
  UNAVAILABLE: 'unavailable',
  RETRYABLE: 'retryable',
  PERMANENT: 'permanent'
});

const PERMANENT_FIRESTORE_CODES = new Set([
  'permission-denied',
  'invalid-argument',
  'failed-precondition',
  'not-found',
  'already-exists',
  'out-of-range',
  'unauthenticated'
]);

/**
 * Categorize a thrown persistence error into the bounded room-writer contract.
 * Unknown errors are treated as retryable (bounded retry decides later).
 * @param {Error} error
 * @returns {{outcome: string, reason: string, code: string|null}}
 */
const classifyRoomWriteError = (error) => {
  const code = error && error.code ? String(error.code) : null;
  return {
    outcome: code && PERMANENT_FIRESTORE_CODES.has(code)
      ? ROOM_WRITE_OUTCOMES.PERMANENT
      : ROOM_WRITE_OUTCOMES.RETRYABLE,
    reason: (error && error.message) || 'unknown persistence error',
    code
  };
};

/**
 * Translate legacy/boolean/undefined persistence results into the bounded
 * contract. `true` is confirmed only because the source that returns it now
 * only does so after a real durable write; false/undefined are never success.
 * @param {*} result
 * @returns {{outcome: string, reason?: string, code?: string|null}}
 */
const normalizeRoomWriteOutcome = (result) => {
  if (result && typeof result === 'object' && typeof result.outcome === 'string') {
    return result;
  }
  if (result === true) {
    return { outcome: ROOM_WRITE_OUTCOMES.CONFIRMED };
  }
  if (result === false) {
    return { outcome: ROOM_WRITE_OUTCOMES.RETRYABLE, reason: 'legacy_false_result' };
  }
  return { outcome: ROOM_WRITE_OUTCOMES.RETRYABLE, reason: 'undefined_or_unknown_result' };
};

// ===========================================================================
// Project 4 C5: bounded room-authority lease backend
//
// One server-only document per canonical room:
//   roomAuthorities/{roomId} = {
//     authorityInstanceId, authorityGeneration, expiresAt, state, fencedAt
//   }
// Expiry decisions use backend snapshot time (readTime), never local wall
// clock. Durable room commits include an authority CAS update in the SAME
// atomic batch so a takeover between check and commit fails the whole write.
// ===========================================================================

const AUTHORITY_COLLECTION = 'roomAuthorities';
const AUTHORITY_STATES = Object.freeze({ HELD: 'held', RELEASED: 'released', DELETED: 'deleted' });
const AUTHORITY_CODES = Object.freeze({
  BUSY: 'room_authority_busy',
  UNAVAILABLE: 'room_authority_unavailable',
  LOST: 'room_authority_lost',
  DELETED: 'room_deleted'
});

function authorityBackendMs(snapshot) {
  // R3: backend time is authoritative. Never fall back to the local wall
  // clock; missing or malformed backend timing fails closed.
  if (snapshot && snapshot.readTime && typeof snapshot.readTime.toMillis === 'function') {
    const millis = snapshot.readTime.toMillis();
    return Number.isFinite(millis) ? millis : null;
  }
  return null;
}

function authorityExpiryMs(data) {
  if (!data || data.expiresAt === undefined || data.expiresAt === null) {return null;}
  if (typeof data.expiresAt.toMillis === 'function') {
    const millis = data.expiresAt.toMillis();
    return Number.isFinite(millis) ? millis : null;
  }
  // R12/R19: only a real backend timestamp or a finite millisecond number is
  // accepted. Malformed values are never coerced (no NaN/zero fallback).
  if (typeof data.expiresAt === 'number') {
    return Number.isFinite(data.expiresAt) ? data.expiresAt : null;
  }
  return null;
}

const MAX_AUTHORITY_GENERATION = Number.MAX_SAFE_INTEGER;

function isStrictAuthorityGeneration(value) {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0;
}

/**
 * ONE strict positive schema for every roomAuthorities document. Every
 * acquisition/renewal/release/verification/fence/deletion path uses this
 * parser so malformed records fail closed identically.
 *
 * Frozen representation:
 *   authorityGeneration: real safe integer > 0 (never coerced from string/bool)
 *   state: held | released | deleted
 *   held: non-empty string holder + valid expiresAt
 *   released/deleted: null/absent holder + valid expiresAt
 *   expiresAt: Timestamp-like {toMillis} or finite number
 *
 * @returns {{ok: true, state: string, generation: number, holder: string|null, expiryMs: number}|{ok: false, code: string}}
 */
function parseAuthorityRecord(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };
  }
  const generation = data.authorityGeneration;
  if (!isStrictAuthorityGeneration(generation)) {
    return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };
  }
  const state = data.state;
  if (state !== AUTHORITY_STATES.HELD && state !== AUTHORITY_STATES.RELEASED && state !== AUTHORITY_STATES.DELETED) {
    return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };
  }
  const holder = data.authorityInstanceId;
  if (state === AUTHORITY_STATES.HELD) {
    if (typeof holder !== 'string' || holder.length === 0) {
      return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };
    }
  } else if (holder !== null && holder !== undefined) {
    return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };
  }
  const expiryMs = authorityExpiryMs(data);
  if (expiryMs === null) {return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };}
  return {
    ok: true,
    state,
    generation,
    holder: typeof holder === 'string' ? holder : null,
    expiryMs
  };
}

/**
 * Classify an authority record for acquisition at backend time `backendMs`.
 * Strict fail-closed validation of malformed coordination records.
 * Returns { ok, generation } or { ok:false, code }.
 */
function classifyAuthorityRecord(data, backendMs) {
  if (backendMs === null) {return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };}
  if (!data) {return { ok: true, generation: 1 };}
  const record = parseAuthorityRecord(data);
  if (!record.ok) {return record;}
  if (record.state === AUTHORITY_STATES.DELETED) {
    return { ok: false, code: AUTHORITY_CODES.DELETED };
  }
  if (record.state === AUTHORITY_STATES.RELEASED) {
    if (record.generation >= MAX_AUTHORITY_GENERATION) {
      return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };
    }
    return { ok: true, generation: record.generation + 1 };
  }
  // held
  if (record.expiryMs > backendMs) {
    return { ok: false, code: AUTHORITY_CODES.BUSY };
  }
  if (record.generation >= MAX_AUTHORITY_GENERATION) {
    return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };
  }
  return { ok: true, generation: record.generation + 1 };
}

/**
 * Verify a fetched authority snapshot against a captured token. Returns a
 * bounded denial code or null when the token is the current unexpired holder.
 */
function verifyAuthoritySnapshot(snapshot, token) {
  if (!snapshot || !snapshot.exists) {return AUTHORITY_CODES.LOST;}
  const data = typeof snapshot.data === 'function' ? snapshot.data() : snapshot.data;
  const record = parseAuthorityRecord(data);
  if (!record.ok) {return record.code;}
  if (record.state === AUTHORITY_STATES.DELETED) {return AUTHORITY_CODES.DELETED;}
  if (record.state !== AUTHORITY_STATES.HELD) {return AUTHORITY_CODES.LOST;}
  if (!isStrictAuthorityGeneration(token && token.authorityGeneration)) {
    return AUTHORITY_CODES.LOST;
  }
  if (record.holder !== token.authorityInstanceId) {return AUTHORITY_CODES.LOST;}
  if (record.generation !== token.authorityGeneration) {return AUTHORITY_CODES.LOST;}
  const backendMs = authorityBackendMs(snapshot);
  if (backendMs === null) {return AUTHORITY_CODES.UNAVAILABLE;}
  if (!(record.expiryMs > backendMs)) {return AUTHORITY_CODES.LOST;}
  return null;
}

/**
 * Acquire or take over room authority in one read-write transaction.
 * No runtime side effects occur inside the retryable callback.
 */
const claimRoomAuthority = async({ roomId, instanceId, leaseDurationMs }) => {
  if (!db) {return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };}
  if (typeof roomId !== 'string' || roomId.length === 0 ||
    typeof instanceId !== 'string' || instanceId.length === 0) {
    return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };
  }
  try {
    return await db.runTransaction(async(transaction) => {
      const ref = db.collection(AUTHORITY_COLLECTION).doc(roomId);
      const snapshot = await transaction.get(ref);
      const backendMs = authorityBackendMs(snapshot);
      if (backendMs === null) {return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };}
      const data = snapshot.exists
        ? (typeof snapshot.data === 'function' ? snapshot.data() : snapshot.data)
        : null;
      const decision = classifyAuthorityRecord(data, backendMs);
      if (!decision.ok) {return decision;}
      const record = {
        roomId,
        authorityInstanceId: instanceId,
        authorityGeneration: decision.generation,
        expiresAt: admin.firestore.Timestamp.fromMillis(backendMs + leaseDurationMs),
        state: AUTHORITY_STATES.HELD,
        fencedAt: data && data.fencedAt ? data.fencedAt : null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      transaction.set(ref, record);
      return { ok: true, generation: decision.generation, expiresAtMs: backendMs + leaseDurationMs };
    });
  } catch (error) {
    logger.error('Error claiming room authority', { error: error.message, roomId, code: error.code });
    return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };
  }
};

/**
 * Renew the current holder's lease. Fails closed when holder, generation or
 * expiry no longer match. Renewal changes the authority document version.
 */
const renewRoomAuthority = async({ roomId, instanceId, generation, leaseDurationMs }) => {
  if (!db) {return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };}
  try {
    return await db.runTransaction(async(transaction) => {
      const ref = db.collection(AUTHORITY_COLLECTION).doc(roomId);
      const snapshot = await transaction.get(ref);
      const backendMs = authorityBackendMs(snapshot);
      if (backendMs === null) {return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };}
      const data = snapshot.exists
        ? (typeof snapshot.data === 'function' ? snapshot.data() : snapshot.data)
        : null;
      const record = parseAuthorityRecord(data);
      if (!record.ok) {return { ok: false, code: record.code };}
      if (record.state === AUTHORITY_STATES.DELETED) {
        return { ok: false, code: AUTHORITY_CODES.DELETED };
      }
      if (record.state !== AUTHORITY_STATES.HELD || record.holder !== instanceId) {
        return { ok: false, code: AUTHORITY_CODES.LOST };
      }
      if (!isStrictAuthorityGeneration(generation) || record.generation !== generation) {
        return { ok: false, code: AUTHORITY_CODES.LOST };
      }
      if (!(record.expiryMs > backendMs)) {
        return { ok: false, code: AUTHORITY_CODES.LOST };
      }
      transaction.update(ref, {
        expiresAt: admin.firestore.Timestamp.fromMillis(backendMs + leaseDurationMs),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return { ok: true, expiresAtMs: backendMs + leaseDurationMs };
    });
  } catch (error) {
    logger.error('Error renewing room authority', { error: error.message, roomId, code: error.code });
    return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };
  }
};

/**
 * Conditional graceful release: advance generation, clear holder, state
 * released. An unconfirmed release grants nothing; the replacement waits for
 * expiry.
 */
const releaseRoomAuthority = async({ roomId, instanceId, generation }) => {
  if (!db) {return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };}
  try {
    return await db.runTransaction(async(transaction) => {
      const ref = db.collection(AUTHORITY_COLLECTION).doc(roomId);
      const snapshot = await transaction.get(ref);
      const backendMs = authorityBackendMs(snapshot);
      if (backendMs === null) {return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };}
      const data = snapshot.exists
        ? (typeof snapshot.data === 'function' ? snapshot.data() : snapshot.data)
        : null;
      const record = parseAuthorityRecord(data);
      if (!record.ok) {return { ok: false, code: record.code };}
      if (record.state === AUTHORITY_STATES.DELETED) {
        return { ok: false, code: AUTHORITY_CODES.DELETED };
      }
      if (record.state !== AUTHORITY_STATES.HELD || record.holder !== instanceId) {
        return { ok: false, code: AUTHORITY_CODES.LOST };
      }
      if (!isStrictAuthorityGeneration(generation) || record.generation !== generation) {
        return { ok: false, code: AUTHORITY_CODES.LOST };
      }
      if (record.generation >= MAX_AUTHORITY_GENERATION) {
        return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };
      }
      transaction.update(ref, {
        authorityInstanceId: null,
        authorityGeneration: record.generation + 1,
        state: AUTHORITY_STATES.RELEASED,
        expiresAt: admin.firestore.Timestamp.fromMillis(backendMs),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return { ok: true };
    });
  } catch (error) {
    logger.error('Error releasing room authority', { error: error.message, roomId, code: error.code });
    return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };
  }
};

/**
 * Fresh backend validation for authoritative operations and delayed flushes.
 * Backend failure fails closed.
 */
const validateRoomAuthority = async({ roomId, instanceId, generation }) => {
  if (!db) {return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };}
  try {
    const ref = db.collection(AUTHORITY_COLLECTION).doc(roomId);
    const snapshot = await ref.get();
    const denial = verifyAuthoritySnapshot(snapshot, { authorityInstanceId: instanceId, authorityGeneration: generation });
    if (denial) {return { ok: false, code: denial };}
    return { ok: true };
  } catch (error) {
    logger.error('Error validating room authority', { error: error.message, roomId, code: error.code });
    return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };
  }
};

/**
 * Append the atomic authority fence to a room-write batch. The caller must add
 * all room writes to the SAME batch; commit fails atomically if the authority
 * document changed after this read (takeover/release/deletion/renewal).
 */
const fenceRoomAuthorityBatch = async({ batch, roomId, token }) => {
  if (!db) {return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };}
  if (!token || token.roomId !== roomId ||
    typeof token.authorityInstanceId !== 'string' || token.authorityInstanceId.length === 0 ||
    !isStrictAuthorityGeneration(token.authorityGeneration)) {
    return { ok: false, code: AUTHORITY_CODES.LOST };
  }
  try {
    const ref = db.collection(AUTHORITY_COLLECTION).doc(roomId);
    const snapshot = await ref.get();
    const denial = verifyAuthoritySnapshot(snapshot, token);
    if (denial) {return { ok: false, code: denial };}
    if (!snapshot.updateTime) {return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };}
    batch.update(ref, { fencedAt: admin.firestore.FieldValue.serverTimestamp() }, { lastUpdateTime: snapshot.updateTime });
    return { ok: true };
  } catch (error) {
    logger.error('Error preparing room authority fence', { error: error.message, roomId, code: error.code });
    return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };
  }
};

/**
 * Bounded byte estimate for the authority-fence document write (document name,
 * fencedAt server timestamp, fixed field/document encoding overhead, and the
 * lastUpdateTime precondition headroom). Used by the outer publication
 * preflight; codec limits are unchanged.
 */
const AUTHORITY_FENCE_FIXED_OVERHEAD_BYTES = 512;
function estimateAuthorityFenceBytes(roomId) {
  const documentName = `projects/${resolveProjectId() || 'unknown'}/databases/(default)/documents/${AUTHORITY_COLLECTION}/${roomId}`;
  return roomCheckpoint.estimateDocumentBytes(
    documentName,
    { fencedAt: { __serverTimestamp: true } },
    { __serverTimestamp: true }
  ) + AUTHORITY_FENCE_FIXED_OVERHEAD_BYTES;
}

/**
 * Best-effort durable deletion tombstone. Always part of the deletion batch
 * when an authority token is supplied so a stale writer cannot recreate the
 * room root.
 */
function authorityDeletionTombstone(batch, roomId, generation) {
  const ref = db.collection(AUTHORITY_COLLECTION).doc(roomId);
  batch.update(ref, {
    authorityInstanceId: null,
    authorityGeneration: generation + 1,
    state: AUTHORITY_STATES.DELETED,
    expiresAt: admin.firestore.Timestamp.fromMillis(0),
    fencedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
}

const initializeFirebase = () => {
  if (isInitialized) {
    return db;
  }

  try {
    // Check if we have Firebase credentials or if we should use emulators
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const projectId = process.env.FIREBASE_PROJECT_ID || 'mythrill-ff7c6';
    
    // Check for emulator environment variables
    const isEmulator = process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST;

    let serviceAccount = null;

    if (serviceAccountKey) {
      // Initialize with service account key from inline JSON (production)
      serviceAccount = JSON.parse(serviceAccountKey);
    } else if (serviceAccountPath) {
      // Initialize with service account key from JSON file (production/development)
      const fs = require('fs');
      try {
        if (fs.existsSync(serviceAccountPath)) {
          const serviceAccountData = fs.readFileSync(serviceAccountPath, 'utf8');
          serviceAccount = JSON.parse(serviceAccountData);
        }
      } catch (e) {
        logger.warn('Could not read service account file, falling back to default/emulator', { path: serviceAccountPath });
      }
    }

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: projectId
      });
      logger.info('Firebase Admin initialized with service account', { projectId, isEmulator: !!isEmulator });
    } else if (isEmulator || process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      // Initialize without credentials when using emulator or in development
      // This allows the Admin SDK to use the emulators if they are configured via ENV
      admin.initializeApp({
        projectId: projectId
      });
      
      if (isEmulator) {
        logger.info('Firebase Admin initialized for Emulator usage', {
          projectId,
          firestoreHost: process.env.FIRESTORE_EMULATOR_HOST,
          authHost: process.env.FIREBASE_AUTH_EMULATOR_HOST
        });
      } else {
        logger.info('Firebase Admin initialized with default credentials/ADC', { projectId });
      }
    } else {
      logger.warn('Firebase Admin not initialized - no credentials provided');
      return null;
    }

    db = admin.firestore();
    isInitialized = true;
    return db;
  } catch (error) {
    logger.error('Firebase Admin initialization failed', { error: error.message, stack: error.stack });
    return null;
  }
};

// Initialize on module load
db = initializeFirebase();

/**
 * Coherent classified checkpoint read.
 *
 * One read-only transaction observes root metadata plus every gameState
 * document at a single snapshot. Read failure is returned as READ_FAILED and
 * is never collapsed into ABSENT_ROOM.
 *
 * @param {string} roomId - Room ID
 * @param {{includeRaw?: boolean}} [options]
 * @returns {Promise<Object>} frozen classification result
 */
const readRoomCheckpoint = async(roomId, options = {}) => {
  if (!db) {
    return {
      kind: 'READ_FAILED',
      roomId,
      readOnly: true,
      code: 'UNAVAILABLE',
      diagnostics: [{ code: 'UNAVAILABLE', message: 'Firebase is not initialized' }],
      checkpoint: null,
      revision: null,
      selectedCandidateId: null,
      selectedSnapshot: null,
      migrationRequired: false,
      roomMetadata: null,
      candidates: { inline: null, split: null },
      selection: null
    };
  }

  try {
    return await db.runTransaction(async(transaction) => {
      const rootRef = db.collection('rooms').doc(roomId);
      const rootSnap = await transaction.get(rootRef);
      const gameStateSnap = await transaction.get(rootRef.collection('gameState'));

      const gameStateDocs = (gameStateSnap && gameStateSnap.docs ? gameStateSnap.docs : []).map((doc) => ({
        id: doc.id,
        data: (typeof doc.data === 'function' ? doc.data() : doc.data) || {},
        updateTime: doc.updateTime || null
      }));

      return roomCheckpoint.classifyRoomDocuments({
        roomId,
        root: {
          exists: !!(rootSnap && rootSnap.exists),
          data: rootSnap && rootSnap.exists
            ? (typeof rootSnap.data === 'function' ? rootSnap.data() : rootSnap.data)
            : null,
          updateTime: (rootSnap && rootSnap.updateTime) || null
        },
        gameStateDocs,
        includeRaw: options.includeRaw === true
      });
    }, { readOnly: true });
  } catch (error) {
    logger.error('Error reading room checkpoint', { error: error.message, roomId, code: error.code });
    return {
      kind: 'READ_FAILED',
      roomId,
      readOnly: true,
      code: error.code || 'READ_FAILED',
      diagnostics: [{ code: error.code || 'READ_FAILED', message: error.message }],
      checkpoint: null,
      revision: null,
      selectedCandidateId: null,
      selectedSnapshot: null,
      migrationRequired: false,
      roomMetadata: null,
      candidates: { inline: null, split: null },
      selection: null
    };
  }
};

/**
 * Legacy-shaped single-room read built from the classified checkpoint reader.
 * Absent returns null; read failure throws so callers cannot treat it as absent.
 * @param {string} roomId - Room ID
 * @returns {Promise<Object|null>} - Room data or null
 */
const getRoomData = async(roomId) => {
  if (!db) {
    logger.warn('⚠️ getRoomData called but Firebase is not initialized. Permanent rooms cannot be retrieved.');
    throw new Error('Database connection error: Firebase Admin SDK not correctly initialized. Please check server logs for service account configuration.');
  }

  const classification = await readRoomCheckpoint(roomId);
  if (classification.kind === 'READ_FAILED') {
    throw new Error(`Database read failed for room ${roomId}: ${(classification.diagnostics[0] && classification.diagnostics[0].message) || classification.code}`);
  }
  if (classification.kind === 'ABSENT_ROOM') {return null;}

  const roomData = {
    ...(classification.roomMetadata || {}),
    id: roomId,
    checkpointClassification: classification.kind,
    migrationRequired: classification.migrationRequired === true
  };

  if (classification.selectedSnapshot) {
    roomData.gameState = roomCheckpoint.hydrateSnapshotToGameState(classification.selectedSnapshot);
    roomData.checkpointRevision = classification.revision || null;
    if (classification.checkpoint) {roomData.checkpoint = classification.checkpoint;}
  } else {
    roomData.gameState = null;
  }

  if (roomData.players && typeof roomData.players === 'object' && !(roomData.players instanceof Map)) {
    roomData.players = new Map(Object.entries(roomData.players));
  }
  if (roomData.password) {delete roomData.password;}
  if (!Object.prototype.hasOwnProperty.call(roomData, 'passwordHash')) {roomData.passwordHash = null;}

  return roomData;
};

/**
 * Standalone fragment writes are not part of the P3 checkpoint convention.
 * Shared gameplay state is published only through the selected P2 writer.
 * @returns {Promise<boolean>} always false
 */
const updateMapData = async(roomId, mapId, _mapData) => {
  logger.warn('Standalone map fragment write refused; shared state publishes through the room checkpoint writer', { roomId, mapId });
  return false;
};

/**
 * Get a specific map's data from a validated selected snapshot.
 * @param {string} roomId - Room ID
 * @param {string} mapId - Map ID to get
 * @returns {Promise<Object|null>} - Map data or null
 */
const getMapData = async(roomId, mapId) => {
  if (!db) {
    logger.debug('Firebase not initialized, using in-memory rooms only');
    return null;
  }

  const classification = await readRoomCheckpoint(roomId);
  if (!classification.selectedSnapshot) {
    logger.warn(`⚠️ Map ${mapId} not available in a complete checkpoint for room ${roomId}`, { kind: classification.kind });
    return null;
  }
  const mapData = classification.selectedSnapshot.maps[mapId] || null;
  return mapData ? JSON.parse(JSON.stringify(mapData)) : null;
};

/**
 * Publish one complete room checkpoint in a single atomic Firestore batch.
 *
 * Contract (docs/MYTHRILL_PROJECT_3_ARCHITECTURE_FREEZE.md):
 *   - one root update/create + gameState/current + one document per declared map
 *   - preflight sizes/operations/hash before any write starts
 *   - committed:true is part of the same batch; no later marker-only phase
 *   - only the complete batch commit (or verified identical publication)
 *     returns CONFIRMED
 *
 * @param {string} roomId - Room ID
 * @param {Object} gameState - Full room game state snapshot
 * @param {{revision: number, roomMetadata?: Object, explicitConversion?: boolean, provenance?: Object}} context
 * @returns {Promise<{outcome: string, reason?: string, code?: string|null, revision?: number, contentHash?: string, manifest?: Object}>}
 */
const publishRoomCheckpoint = async(roomId, gameState, context = {}) => {
  if (!db) {
    return {
      outcome: ROOM_WRITE_OUTCOMES.UNAVAILABLE,
      reason: 'firebase_not_initialized',
      code: null
    };
  }

  const revision = Number(context && context.revision);
  if (!Number.isSafeInteger(revision) || revision <= 0) {
    return {
      outcome: ROOM_WRITE_OUTCOMES.PERMANENT,
      reason: 'checkpoint_revision_required',
      code: 'CHECKPOINT_INVALID'
    };
  }

  // R1: authority is mandatory at this supported persistence boundary. There
  // is no production opt-out mode; callers must supply the captured token.
  const authority = context && context.authority ? context.authority : null;
  if (!authority) {
    return {
      outcome: ROOM_WRITE_OUTCOMES.PERMANENT,
      reason: 'room_authority_required',
      code: 'room_authority_lost'
    };
  }

  try {
    const explicitConversion = context.explicitConversion === true ||
      !!(context.roomMetadata && context.roomMetadata.explicitConversion === true);
    if (context.roomMetadata && context.roomMetadata.migrationRequired === true && !explicitConversion) {
      return {
        outcome: ROOM_WRITE_OUTCOMES.PERMANENT,
        reason: 'legacy_room_requires_explicit_exported_conversion',
        code: 'MIGRATION_REQUIRED'
      };
    }

    const rootRef = db.collection('rooms').doc(roomId);
    const rootSnap = await rootRef.get();
    const existingRoot = rootSnap.exists
      ? (typeof rootSnap.data === 'function' ? rootSnap.data() : rootSnap.data) || {}
      : null;

    const prepared = roomCheckpoint.buildCheckpointDocuments({
      roomId,
      gameState,
      revision,
      roomMetadata: context.roomMetadata || null,
      projectId: resolveProjectId(),
      existingRoot,
      explicitConversion,
      provenance: context.provenance || (context.roomMetadata && context.roomMetadata.provenance) || null,
      serverTimestamp: () => admin.firestore.FieldValue.serverTimestamp(),
      deleteField: () => admin.firestore.FieldValue.delete()
    });

    if (!prepared.ok) {
      return { outcome: ROOM_WRITE_OUTCOMES.PERMANENT, reason: prepared.reason, code: prepared.code };
    }

    // R6 preflight: the authority fence adds ONE write operation plus a
    // bounded authority-document update. Codec limits are unchanged; fail
    // before any write when the envelope no longer fits.
    if (prepared.operations + 1 > roomCheckpoint.CHECKPOINT_LIMITS.MAX_OPERATIONS) {
      return { outcome: ROOM_WRITE_OUTCOMES.PERMANENT, reason: 'authority_fence_operation_limit', code: 'CHECKPOINT_TOO_LARGE' };
    }
    if (prepared.requestEstimate + estimateAuthorityFenceBytes(roomId) > roomCheckpoint.CHECKPOINT_LIMITS.MAX_REQUEST_BYTES) {
      return { outcome: ROOM_WRITE_OUTCOMES.PERMANENT, reason: 'authority_fence_request_limit', code: 'CHECKPOINT_TOO_LARGE' };
    }

    const headCheckpoint = existingRoot && typeof existingRoot.checkpoint === 'object' && existingRoot.checkpoint !== null
      ? existingRoot.checkpoint
      : null;

    if (headCheckpoint) {
      const headRevision = Number(headCheckpoint.revision);
      if (Number.isSafeInteger(headRevision) && headRevision > revision) {
        return { outcome: ROOM_WRITE_OUTCOMES.PERMANENT, reason: 'checkpoint_revision_conflict', code: 'CHECKPOINT_REVISION_CONFLICT' };
      }
      if (Number.isSafeInteger(headRevision) && headRevision === revision) {
        const hashMatches = headCheckpoint.committed === true && headCheckpoint.contentHash === prepared.contentHash;
        const capturedFingerprint = roomCheckpoint.metadataFingerprint({
          name: context.roomMetadata ? context.roomMetadata.name : undefined,
          description: context.roomMetadata ? context.roomMetadata.description : undefined,
          settings: context.roomMetadata ? context.roomMetadata.settings : undefined
        });
        const metadataMatches = capturedFingerprint === null || roomCheckpoint.metadataFingerprint(existingRoot) === capturedFingerprint;

        if (hashMatches && metadataMatches) {
          // R6: validate authority before the async verification so a stale
          // instance is refused early, and AGAIN after it before confirming.
          const preVerification = await validateRoomAuthority({
            roomId,
            instanceId: authority.authorityInstanceId,
            generation: authority.authorityGeneration
          });
          if (!preVerification.ok) {
            return {
              outcome: ROOM_WRITE_OUTCOMES.PERMANENT,
              reason: 'checkpoint_authority_lost',
              code: preVerification.code || 'room_authority_lost'
            };
          }
          const verification = await readRoomCheckpoint(roomId);
          const verifiedMaps = verification.checkpoint && Array.isArray(verification.checkpoint.mapIds)
            ? verification.checkpoint.mapIds
            : null;
          const mapsMatch = !!verifiedMaps &&
            verifiedMaps.join('\u0000') === prepared.mapIds.join('\u0000');
          const verifiedFingerprint = verification.roomMetadata
            ? roomCheckpoint.metadataFingerprint({
              name: verification.roomMetadata.name,
              description: verification.roomMetadata.description,
              settings: verification.roomMetadata.settings
            })
            : null;
          const metadataVerified = capturedFingerprint === null || verifiedFingerprint === capturedFingerprint;

          if (verification.kind === 'CANONICAL_COMPLETE_CHECKPOINT' &&
            Number(verification.revision) === revision &&
            verification.checkpoint && verification.checkpoint.contentHash === prepared.contentHash &&
            mapsMatch && metadataVerified) {
            // R6: fresh authority validation AFTER the async verification. A
            // takeover during that await must not yield CONFIRMED.
            const fresh = await validateRoomAuthority({
              roomId,
              instanceId: authority.authorityInstanceId,
              generation: authority.authorityGeneration
            });
            if (!fresh.ok) {
              return {
                outcome: ROOM_WRITE_OUTCOMES.PERMANENT,
                reason: 'checkpoint_authority_lost',
                code: fresh.code || 'room_authority_lost'
              };
            }
            return { outcome: ROOM_WRITE_OUTCOMES.CONFIRMED, revision, contentHash: prepared.contentHash, manifest: prepared.manifest };
          }
          if (verification.kind === 'CANONICAL_COMPLETE_CHECKPOINT' && Number(verification.revision) === revision) {
            // Same revision but different content, map set or captured metadata
            // is a conflict. Never confirm a checkpoint identity mismatch.
            return { outcome: ROOM_WRITE_OUTCOMES.PERMANENT, reason: 'checkpoint_revision_conflict', code: 'CHECKPOINT_REVISION_CONFLICT' };
          }
          return { outcome: ROOM_WRITE_OUTCOMES.RETRYABLE, reason: 'checkpoint_ack_verification_incomplete', code: null };
        }
        return { outcome: ROOM_WRITE_OUTCOMES.PERMANENT, reason: 'checkpoint_revision_conflict', code: 'CHECKPOINT_REVISION_CONFLICT' };
      }
    }

    const batch = db.batch();
    const fence = await fenceRoomAuthorityBatch({ batch, roomId, token: authority });
    if (!fence.ok) {
      return {
        outcome: ROOM_WRITE_OUTCOMES.PERMANENT,
        reason: 'room_authority_fence_failed',
        code: fence.code || 'room_authority_lost'
      };
    }
    if (rootSnap.exists) {
      const precondition = rootSnap.updateTime ? { lastUpdateTime: rootSnap.updateTime } : undefined;
      batch.update(rootRef, prepared.rootPatch, precondition);
    } else {
      batch.create(rootRef, prepared.rootCreateBase);
    }
    batch.set(rootRef.collection('gameState').doc('current'), prepared.global.data);
    for (const mapDoc of prepared.maps) {
      batch.set(rootRef.collection('gameState').doc(mapDoc.mapId), mapDoc.data);
    }

    await batch.commit();

    // R6: after the atomic commit, confirm the originating authority is still
    // current before acknowledging the live save. Bytes that landed before a
    // takeover remain durable historical evidence, but the stale runtime
    // cannot count them as its current confirmed save.
    const finalCheck = await validateRoomAuthority({
      roomId,
      instanceId: authority.authorityInstanceId,
      generation: authority.authorityGeneration
    });
    if (!finalCheck.ok) {
      return {
        outcome: ROOM_WRITE_OUTCOMES.PERMANENT,
        reason: 'checkpoint_authority_lost',
        code: finalCheck.code || 'room_authority_lost'
      };
    }

    logger.debug('Room checkpoint published atomically', {
      roomId,
      revision,
      operations: prepared.operations,
      maps: prepared.mapIds.length
    });

    return { outcome: ROOM_WRITE_OUTCOMES.CONFIRMED, revision, contentHash: prepared.contentHash, manifest: prepared.manifest };
  } catch (error) {
    if (error && (error.code === 'failed-precondition' || error.code === 'aborted' ||
      /precondition/i.test(error.message || ''))) {
      return { outcome: ROOM_WRITE_OUTCOMES.RETRYABLE, reason: 'root_precondition_conflict', code: error.code || null };
    }
    logger.error('Error publishing room checkpoint', { error: error.message, roomId, code: error.code });
    return classifyRoomWriteError(error);
  }
};

/**
 * Backward-compatible entry used by the selected P2 writer.
 * @param {string} roomId
 * @param {Object} gameState
 * @param {{revision: number, roomMetadata?: Object, explicitConversion?: boolean, provenance?: Object}} [context]
 */
const updateRoomGameState = async(roomId, gameState, context) => {
  return publishRoomCheckpoint(roomId, gameState, context || {});
};

const resolveProjectId = () => {
  try {
    const app = admin.app();
    return (app && app.options && app.options.projectId) || process.env.FIREBASE_PROJECT_ID || null;
  } catch (_error) {
    return process.env.FIREBASE_PROJECT_ID || null;
  }
};

/**
 * Create or update room administrative metadata only.
 *
 * This helper must never write gameplay state: shared state is published
 * exclusively through the selected P2 writer and the atomic checkpoint
 * publisher. Browser-created drafts may already contain `checkpoint: null`;
 * merge semantics preserve it.
 *
 * @param {string} roomId - Room ID
 * @param {Object} roomData - Room data
 * @returns {Promise<boolean>} - Metadata write success status
 */
const saveRoomData = async(roomId, roomData, options = {}) => {
  if (!db) {
    logger.debug('Firebase not initialized, room metadata not persisted');
    return false;
  }

  const authority = options.authority || null;
  if (!authority) {
    logger.warn('Room metadata save refused: authority token required', { roomId });
    return false;
  }
  try {
    const firestoreData = {
      id: roomId,
      name: roomData.name,
      passwordHash: roomData.passwordHash !== undefined ? roomData.passwordHash : null,
      gm: roomData.gm || null,
      gmId: roomData.gmId || (roomData.gm ? roomData.gm.userId || roomData.gm.id : null),
      members: roomData.members || (roomData.gm ? [roomData.gm.userId || roomData.gm.id] : []),
      players: roomData.players ? Object.fromEntries(roomData.players) : {},
      settings: roomData.settings || {},
      isActive: roomData.isActive !== false,
      persistentRoomId: roomData.persistentRoomId || roomId,
      isPermanent: roomData.isPermanent !== false,
      lastModified: admin.firestore.FieldValue.serverTimestamp(),
      lastActivity: admin.firestore.FieldValue.serverTimestamp()
    };
    if (roomData.description !== undefined) {firestoreData.description = roomData.description;}
    if (roomData.createdAt !== undefined) {firestoreData.createdAt = roomData.createdAt;}

    delete firestoreData.password;

    const roomRef = db.collection('rooms').doc(roomId);
    const batch = db.batch();
    const fence = await fenceRoomAuthorityBatch({ batch, roomId, token: authority });
    if (!fence.ok) {return false;}
    batch.set(roomRef, firestoreData, { merge: true });
    await batch.commit();
    return true;
  } catch (error) {
    logger.error('Error saving room metadata to Firestore', { error: error.message, roomId });
    return false;
  }
};

/**
 * Bounded metadata-only room update (Project 3 draft boundary).
 *
 * Accepts ONLY name/description/settings for an already existing room root.
 * It never writes gameState, checkpoint or arbitrary metadata, and it never
 * creates a missing document. Callers must supply a pre-validated patch.
 *
 * @param {string} roomId
 * @param {{name?: string, description?: string, settings?: Object}} patch
 * @returns {Promise<{ok: boolean, reason?: string}>}
 */
const updateRoomMetadata = async(roomId, patch, options = {}) => {
  if (!db) {return { ok: false, reason: 'unavailable' };}
  if (typeof roomId !== 'string' || roomId.length === 0) {return { ok: false, reason: 'room_id_required' };}
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) {return { ok: false, reason: 'invalid_patch' };}

  const allowed = ['name', 'description', 'settings'];
  const update = {};
  for (const [key, value] of Object.entries(patch)) {
    if (!allowed.includes(key)) {return { ok: false, reason: `unsupported_field:${key}` };}
    if (key === 'settings' && (!value || typeof value !== 'object' || Array.isArray(value))) {
      return { ok: false, reason: 'invalid_settings' };
    }
    update[key] = value;
  }
  if (Object.keys(update).length === 0) {return { ok: false, reason: 'empty_patch' };}

  const authority = options.authority || null;
  if (!authority) {return { ok: false, reason: 'room_authority_required', code: AUTHORITY_CODES.LOST };}
  try {
    const roomRef = db.collection('rooms').doc(roomId);
    const payload = {
      ...update,
      lastModified: admin.firestore.FieldValue.serverTimestamp(),
      lastActivity: admin.firestore.FieldValue.serverTimestamp()
    };
    const batch = db.batch();
    const fence = await fenceRoomAuthorityBatch({ batch, roomId, token: authority });
    if (!fence.ok) {return { ok: false, reason: fence.code || 'room_authority_lost', code: fence.code };}
    batch.set(roomRef, payload, { merge: true });
    await batch.commit();
    return { ok: true };
  } catch (error) {
    logger.error('Error updating room metadata', { error: error.message, roomId, code: error.code });
    return { ok: false, reason: error.code || 'metadata_update_failed' };
  }
};

/**
 * Add chat message to room history in Firestore
 * @param {string} roomId - Room ID
 * @param {Object} message - Chat message
 * @returns {Promise<boolean>} - Success status
 */
const addChatMessage = async(roomId, message) => {
  if (!db) {
    return false;
  }

  try {
    const messageWithTimestamp = {
      ...message,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    };

    const msgId = message.id || uuidv4();

    // Write to chat subcollection (authoritative location for split-storage rooms)
    await db.collection('rooms').doc(roomId).collection('chat').doc(msgId).set({
      ...messageWithTimestamp,
      id: msgId
    });

    // Also update lastActivity on main document
    await db.collection('rooms').doc(roomId).update({
      lastActivity: admin.firestore.FieldValue.serverTimestamp()
    });
    return true;
  } catch (error) {
    logger.error('Error adding chat message', { error: error.message, roomId });
    return false;
  }
};

/**
 * Mark room as active/inactive
 * @param {string} roomId - Room ID
 * @param {boolean} isActive - Active status
 * @returns {Promise<boolean>} - Success status
 */
const setRoomActiveStatus = async(roomId, isActive) => {
  if (!db) {
    return false;
  }

  try {
    await db.collection('rooms').doc(roomId).update({
      isActive: isActive,
      lastActivity: admin.firestore.FieldValue.serverTimestamp()
    });
    return true;
  } catch (error) {
    logger.error('Error updating room active status', { error: error.message, roomId });
    return false;
  }
};

/**
 * Delete room from Firestore.
 *
 * C5: when an authority token is supplied, the deletion batch also contains the
 * authority CAS fence and a terminal deleted tombstone. A stale writer then
 * fails the CAS and cannot recreate the room root.
 * @param {string} roomId - Room ID
 * @param {{authority?: Object}} [options]
 * @returns {Promise<boolean|{ok: boolean, code?: string}>}
 */
const deleteRoom = async(roomId, options = {}) => {
  const authority = options.authority || null;
  if (!db) {
    return authority ? { ok: false, code: AUTHORITY_CODES.UNAVAILABLE } : false;
  }
  if (!authority) {return { ok: false, code: AUTHORITY_CODES.LOST, reason: 'room_authority_required' };}
  const tombstoneGeneration = authority.authorityGeneration;
  if (typeof authority.authorityInstanceId !== 'string' || authority.authorityInstanceId.length === 0 ||
    !isStrictAuthorityGeneration(tombstoneGeneration) ||
    tombstoneGeneration >= MAX_AUTHORITY_GENERATION) {
    return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE, reason: 'room_authority_generation_invalid' };
  }

  try {
    const roomRef = db.collection('rooms').doc(roomId);

    const gameStateSnapshot = await roomRef.collection('gameState').get();
    const chatSnapshot = await roomRef.collection('chat').get();

    const batch = db.batch();
    const fence = await fenceRoomAuthorityBatch({ batch, roomId, token: authority });
    if (!fence.ok) {return { ok: false, code: fence.code || AUTHORITY_CODES.LOST };}
    authorityDeletionTombstone(batch, roomId, tombstoneGeneration);
    gameStateSnapshot.forEach(subDoc => batch.delete(subDoc.ref));
    chatSnapshot.forEach(subDoc => batch.delete(subDoc.ref));
    batch.delete(roomRef);

    await batch.commit();
    return { ok: true };
  } catch (error) {
    logger.error('Error deleting room', { error: error.message, roomId });
    return { ok: false, code: error.code || AUTHORITY_CODES.UNAVAILABLE };
  }
};

/**
 * Project 4: persist one verified UID into a permanent room's durable
 * membership array. Resolves only when the Admin write is acknowledged.
 * C5: when an authority token is supplied, the write is atomically fenced.
 *
 * C3: `recoveryIntent: true` requires that a NEW durable membership never
 * exists without a durable pending recovery record. The membership update and
 * the `membershipCompensations` record are written in the SAME authority-fenced
 * atomic batch, so a failed commit leaves neither.
 * @param {string} roomId
 * @param {string} userId
 * @param {{authority?: Object, recoveryIntent?: boolean}} [options]
 * @returns {Promise<{ok: boolean, reason?: string, code?: string, compensationId?: string}>}
 */
const addRoomMember = async(roomId, userId, options = {}) => {
  if (!db) {return { ok: false, reason: 'unavailable' };}
  if (typeof roomId !== 'string' || roomId.length === 0) {return { ok: false, reason: 'room_id_required' };}
  if (typeof userId !== 'string' || userId.length === 0) {return { ok: false, reason: 'user_id_required' };}
  const authority = options.authority || null;
  if (!authority) {return { ok: false, reason: 'room_authority_required', code: AUTHORITY_CODES.LOST };}
  const recoveryIntent = options.recoveryIntent === true;
  const compensationId = recoveryIntent ? crypto.randomUUID() : null;
  try {
    const roomRef = db.collection('rooms').doc(roomId);
    const payload = {
      members: admin.firestore.FieldValue.arrayUnion(userId),
      lastActivity: admin.firestore.FieldValue.serverTimestamp()
    };
    const batch = db.batch();
    const fence = await fenceRoomAuthorityBatch({ batch, roomId, token: authority });
    if (!fence.ok) {return { ok: false, reason: fence.code || 'room_authority_lost', code: fence.code };}
    batch.update(roomRef, payload);
    if (recoveryIntent) {
      const compensationRef = db.collection(MEMBERSHIP_COMPENSATION_COLLECTION)
        .doc(membershipCompensationDocId(roomId, userId));
      batch.create(compensationRef, {
        roomId,
        userId,
        compensationId,
        state: 'pending_admission',
        originatingAuthorityGeneration: authority.authorityGeneration,
        originatingAuthorityInstanceId: authority.authorityInstanceId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    await batch.commit();
    return { ok: true, compensationId };
  } catch (error) {
    logger.error('Error adding room member', { error: error.message, roomId, code: error.code });
    return { ok: false, reason: error.code || 'member_add_failed' };
  }
};

/**
 * Project 4: remove one UID from a permanent room's durable membership array
 * (explicit revocation). Resolves only when the Admin write is acknowledged.
 * C5: when an authority token is supplied, the write is atomically fenced.
 * @param {string} roomId
 * @param {string} userId
 * @param {{authority?: Object}} [options]
 * @returns {Promise<{ok: boolean, reason?: string, code?: string}>}
 */
const removeRoomMember = async(roomId, userId, options = {}) => {
  if (!db) {return { ok: false, reason: 'unavailable' };}
  if (typeof roomId !== 'string' || roomId.length === 0) {return { ok: false, reason: 'room_id_required' };}
  if (typeof userId !== 'string' || userId.length === 0) {return { ok: false, reason: 'user_id_required' };}
  const authority = options.authority || null;
  if (!authority) {return { ok: false, reason: 'room_authority_required', code: AUTHORITY_CODES.LOST };}
  try {
    const roomRef = db.collection('rooms').doc(roomId);
    const payload = {
      members: admin.firestore.FieldValue.arrayRemove(userId),
      lastActivity: admin.firestore.FieldValue.serverTimestamp()
    };
    const batch = db.batch();
    const fence = await fenceRoomAuthorityBatch({ batch, roomId, token: authority });
    if (!fence.ok) {return { ok: false, reason: fence.code || 'room_authority_lost', code: fence.code };}
    batch.update(roomRef, payload);
    await batch.commit();
    return { ok: true };
  } catch (error) {
    logger.error('Error removing room member', { error: error.message, roomId, code: error.code });
    return { ok: false, reason: error.code || 'member_remove_failed' };
  }
};

// ===========================================================================
// Project 4 C3: durable failed-rollback membership compensations
//
// A durable membership grant whose rollback could not be confirmed leaves a
// server-only obligation record so the CURRENT legitimate room authority can
// retry the corrective removal. Records are Admin-only, deterministic per
// (roomId,userId), never client-readable, and never silently evicted.
// ===========================================================================

const MEMBERSHIP_COMPENSATION_COLLECTION = 'membershipCompensations';
const MEMBERSHIP_COMPENSATION_LIST_LIMIT = 500;

function membershipCompensationDocId(roomId, userId) {
  return crypto.createHash('sha256').update(`${roomId}\u0000${userId}`, 'utf8').digest('hex');
}

/**
 * Record (or refresh) one durable compensation obligation. Returns ok only
 * when the record is durably acknowledged; callers keep an in-process mirror
 * when the cloud write is unavailable. Every write carries a fresh
 * compensationId so a delayed retry can never clear a newer obligation.
 */
const recordMembershipCompensation = async(roomId, userId, details = {}) => {
  if (!db) {return { ok: false, reason: 'unavailable' };}
  if (typeof roomId !== 'string' || roomId.length === 0) {return { ok: false, reason: 'room_id_required' };}
  if (typeof userId !== 'string' || userId.length === 0) {return { ok: false, reason: 'user_id_required' };}
  try {
    const ref = db.collection(MEMBERSHIP_COMPENSATION_COLLECTION).doc(membershipCompensationDocId(roomId, userId));
    const existing = await ref.get();
    const payload = {
      roomId,
      userId,
      compensationId: crypto.randomUUID(),
      state: 'pending_admission',
      reason: typeof details.reason === 'string' && details.reason.length > 0
        ? details.reason
        : 'membership_rollback_failed',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    if (isStrictAuthorityGeneration(details.authorityGeneration)) {
      payload.originatingAuthorityGeneration = details.authorityGeneration;
    }
    if (typeof details.authorityInstanceId === 'string' && details.authorityInstanceId.length > 0) {
      payload.originatingAuthorityInstanceId = details.authorityInstanceId;
    }
    if (!existing || existing.exists !== true) {
      payload.createdAt = admin.firestore.FieldValue.serverTimestamp();
    }
    await ref.set(payload, { merge: true });
    return { ok: true, compensationId: payload.compensationId };
  } catch (error) {
    logger.error('Error recording membership compensation', { error: error.message, roomId, code: error.code });
    return { ok: false, reason: error.code || 'compensation_record_failed' };
  }
};

/**
 * List unresolved compensation obligations (optionally for one room). The
 * durable store is the source of truth across process restarts. Discovery
 * failure is explicit: it never collapses to "no obligations".
 * @returns {Promise<{ok: true, entries: Array<Object>}|{ok: false, code: string}>}
 */
const listMembershipCompensations = async(roomId = null) => {
  if (!db) {return { ok: false, code: 'compensation_store_unavailable' };}
  try {
    const snapshot = await db.collection(MEMBERSHIP_COMPENSATION_COLLECTION).get();
    const docs = Array.isArray(snapshot && snapshot.docs) ? snapshot.docs : [];
    const entries = [];
    for (const doc of docs) {
      const data = (typeof doc.data === 'function' ? doc.data() : doc.data) || {};
      if (typeof data.roomId !== 'string' || typeof data.userId !== 'string') {continue;}
      if (roomId !== null && data.roomId !== roomId) {continue;}
      entries.push({
        roomId: data.roomId,
        userId: data.userId,
        compensationId: typeof data.compensationId === 'string' ? data.compensationId : null,
        state: typeof data.state === 'string' ? data.state : 'pending_admission',
        reason: typeof data.reason === 'string' ? data.reason : 'membership_rollback_failed',
        attempts: Number.isFinite(Number(data.attempts)) ? Number(data.attempts) : null,
        originatingAuthorityGeneration: Number.isSafeInteger(data.originatingAuthorityGeneration)
          ? data.originatingAuthorityGeneration
          : null
      });
      if (entries.length >= MEMBERSHIP_COMPENSATION_LIST_LIMIT) {break;}
    }
    return { ok: true, entries };
  } catch (error) {
    logger.error('Error listing membership compensations', { error: error.message, code: error.code });
    return { ok: false, code: error.code || 'compensation_store_unavailable' };
  }
};

/**
 * Clear one resolved obligation at the backend commit boundary.
 *
 * C3: the read/identity comparison and the delete happen in ONE transaction,
 * so a replacement record written after this transaction's read makes the
 * commit conflict (retry sees the replacement and refuses) instead of being
 * deleted by the stale clear. When an authority token is supplied the SAME
 * transaction also requires the captured token to still be the current
 * unexpired backend holder, so a stale holder can never clear an obligation
 * after takeover - including for an already-absent record.
 *
 * Record absence is NOT finalization proof: `{ok:false,
 * code:'membership_compensation_missing'}` means the exact obligation this
 * caller owned was never transactionally cleared here (another holder may have
 * recovered the membership and removed the intent).
 * @param {string} roomId
 * @param {string} userId
 * @param {{compensationId?: string, authority?: Object}} [options]
 * @returns {Promise<{ok: boolean, cleared?: boolean, code?: string, reason?: string}>}
 */
const clearMembershipCompensation = async(roomId, userId, options = {}) => {
  if (!db) {return { ok: false, reason: 'unavailable' };}
  if (typeof roomId !== 'string' || roomId.length === 0) {return { ok: false, reason: 'room_id_required' };}
  if (typeof userId !== 'string' || userId.length === 0) {return { ok: false, reason: 'user_id_required' };}
  const expectedId = typeof options.compensationId === 'string' && options.compensationId.length > 0
    ? options.compensationId
    : null;
  if (!expectedId) {
    // An identity-less obligation can never be conditionally cleared: deleting
    // whatever currently occupies the deterministic key could destroy a newer
    // obligation.
    return { ok: false, code: 'compensation_identity_missing', cleared: false };
  }
  const authority = options.authority || null;
  try {
    return await db.runTransaction(async(transaction) => {
      const ref = db.collection(MEMBERSHIP_COMPENSATION_COLLECTION).doc(membershipCompensationDocId(roomId, userId));
      const snapshot = await transaction.get(ref);
      const exists = !!(snapshot && snapshot.exists === true);
      if (exists) {
        const data = (typeof snapshot.data === 'function' ? snapshot.data() : snapshot.data) || {};
        if (data.compensationId !== expectedId) {
          return { ok: false, code: 'compensation_replaced', cleared: false };
        }
      }
      // Authority is validated for EVERY outcome, including an absent record,
      // before any success is possible.
      if (authority) {
        const authorityRef = db.collection(AUTHORITY_COLLECTION).doc(roomId);
        const authoritySnapshot = await transaction.get(authorityRef);
        const denial = verifyAuthoritySnapshot(authoritySnapshot, authority);
        if (denial) {return { ok: false, code: denial, cleared: false };}
      }
      if (!exists) {
        return { ok: false, code: 'membership_compensation_missing', cleared: false };
      }
      transaction.delete(ref);
      return { ok: true, cleared: true };
    });
  } catch (error) {
    logger.error('Error clearing membership compensation', { error: error.message, roomId, code: error.code });
    return { ok: false, reason: error.code || 'compensation_clear_failed' };
  }
};

const characterOwnerCache = new Map();
const CHARACTER_OWNER_CACHE_TTL_MS = 5 * 60 * 1000;
const CHARACTER_OWNER_CACHE_MAX = 500;

function cacheCharacterOwner(characterId, result) {
  characterOwnerCache.set(characterId, { result, cachedAt: Date.now() });
  if (characterOwnerCache.size > CHARACTER_OWNER_CACHE_MAX) {
    for (const [key, entry] of characterOwnerCache) {
      if (characterOwnerCache.size <= CHARACTER_OWNER_CACHE_MAX) {break;}
      if (Date.now() - entry.cachedAt >= CHARACTER_OWNER_CACHE_TTL_MS || characterOwnerCache.size > CHARACTER_OWNER_CACHE_MAX) {
        characterOwnerCache.delete(key);
      }
    }
  }
}

/**
 * Project 4: resolve the verified owner UID of a character document without
 * returning any character content.
 *
 * Canonical ownership is characters/{id}.metadata.userId. Missing canonical
 * ownership fails closed; conflicting representations are rejected. The
 * lookup cache is TTL- and size-bounded.
 * @param {string} characterId
 * @returns {Promise<{ok: boolean, userId?: string, reason?: string}>}
 */
const getCharacterOwner = async(characterId) => {
  if (!db) {return { ok: false, reason: 'unavailable' };}
  if (typeof characterId !== 'string' || characterId.length === 0) {
    return { ok: false, reason: 'character_id_required' };
  }
  const cached = characterOwnerCache.get(characterId);
  if (cached && Date.now() - cached.cachedAt < CHARACTER_OWNER_CACHE_TTL_MS) {
    return cached.result;
  }
  try {
    const snap = await db.collection('characters').doc(characterId).get();
    if (!snap.exists) {
      const result = { ok: false, reason: 'character_not_found' };
      cacheCharacterOwner(characterId, result);
      return result;
    }
    const data = (typeof snap.data === 'function' ? snap.data() : snap.data) || {};
    const metadataOwner = data.metadata && data.metadata.userId;
    const legacyOwner = typeof data.userId === 'string' && data.userId.length > 0 ? data.userId : null;
    if (typeof metadataOwner !== 'string' || metadataOwner.length === 0) {
      const result = { ok: false, reason: 'owner_unverifiable' };
      cacheCharacterOwner(characterId, result);
      return result;
    }
    if (legacyOwner && legacyOwner !== metadataOwner) {
      const result = { ok: false, reason: 'owner_conflict' };
      cacheCharacterOwner(characterId, result);
      return result;
    }
    const result = { ok: true, userId: metadataOwner };
    cacheCharacterOwner(characterId, result);
    return result;
  } catch (error) {
    logger.error('Error resolving character owner', { error: error.message, characterId, code: error.code });
    return { ok: false, reason: error.code || 'owner_read_failed' };
  }
};

/**
 * Project 4: bounded Admin metadata listing for verified owner/member
 * entitlement, including inactive rooms and unactivated drafts.
 * @param {string} userId
 * @returns {Promise<Array<Object>>}
 */
const listEntitledRoomMetadata = async(userId) => {
  if (!db || typeof userId !== 'string' || userId.length === 0) {return [];}
  const toEntry = (doc) => {
    const data = (typeof doc.data === 'function' ? doc.data() : doc.data) || {};
    return {
      id: doc.id,
      name: typeof data.name === 'string' ? data.name : '',
      description: typeof data.description === 'string' ? data.description : null,
      settings: data.settings && typeof data.settings === 'object' && !Array.isArray(data.settings) ? data.settings : {},
      gmId: typeof data.gmId === 'string' ? data.gmId : null,
      gmName: typeof data.gmName === 'string' ? data.gmName : null,
      members: Array.isArray(data.members) ? data.members : [],
      isActive: data.isActive === true,
      isPermanent: data.isPermanent === true,
      persistentRoomId: typeof data.persistentRoomId === 'string' ? data.persistentRoomId : null,
      createdAt: data.createdAt || null
    };
  };
  try {
    const [owned, member] = await Promise.all([
      db.collection('rooms').where('gmId', '==', userId).get(),
      db.collection('rooms').where('members', 'array-contains', userId).get()
    ]);
    const byId = new Map();
    owned.forEach((doc) => byId.set(doc.id, toEntry(doc)));
    member.forEach((doc) => { if (!byId.has(doc.id)) {byId.set(doc.id, toEntry(doc));} });
    return Array.from(byId.values());
  } catch (error) {
    logger.error('Error listing entitled room metadata', { error: error.message, userId, code: error.code });
    return [];
  }
};

/**
 * Project 4: trusted Admin root metadata read for owner authorization of an
 * inactive cloud room. Returns null when absent.
 */
const getRoomRootMetadata = async(roomId) => {
  if (!db || typeof roomId !== 'string' || roomId.length === 0) {return null;}
  try {
    const snap = await db.collection('rooms').doc(roomId).get();
    if (!snap.exists) {return null;}
    const data = (typeof snap.data === 'function' ? snap.data() : snap.data) || {};
    return {
      id: roomId,
      name: typeof data.name === 'string' ? data.name : null,
      gmId: typeof data.gmId === 'string' ? data.gmId : null,
      members: Array.isArray(data.members) ? data.members : [],
      passwordHash: typeof data.passwordHash === 'string' ? data.passwordHash : null,
      bannedUsers: Array.isArray(data.bannedUsers) ? data.bannedUsers : [],
      isPermanent: data.isPermanent === true,
      persistentRoomId: typeof data.persistentRoomId === 'string' ? data.persistentRoomId : null
    };
  } catch (error) {
    logger.error('Error reading room root metadata', { error: error.message, roomId, code: error.code });
    return null;
  }
};

/**
 * Pure safe-draft eligibility decision. Any pre-existing room root or
 * checkpoint fragment blocks a new claim; only the caller's own empty
 * metadata draft may be reused idempotently.
 */
function evaluateDraftEligibility({ rootExists, rootData, hasFragments, userId }) {
  if (rootExists) {
    const existing = rootData || {};
    const ownEmptyDraft = existing.gmId === userId && existing.checkpoint === null &&
      existing.isActive === false && !('gameState' in existing);
    if (ownEmptyDraft && !hasFragments) {return { ok: true, existing: true };}
    return { ok: false, reason: 'owner_recovery_required' };
  }
  if (hasFragments) {return { ok: false, reason: 'owner_recovery_required' };}
  return { ok: true, existing: false };
}

/**
 * Project 4: server-mediated safe draft creation. Refuses when any room root
 * or checkpoint fragment already exists at the requested id, so a new draft
 * can never claim orphaned legacy state.
 */
const createRoomDraft = async({ roomId, userId, name, description, settings, gmName, authority = null }) => {
  if (!db) {return { ok: false, reason: 'unavailable' };}
  if (typeof userId !== 'string' || userId.length === 0) {return { ok: false, reason: 'verified_identity_required' };}
  if (!authority) {return { ok: false, reason: 'room_authority_required', code: AUTHORITY_CODES.LOST };}
  const id = typeof roomId === 'string' && roomId.length > 0
    ? roomId
    : `room_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  try {
    const rootRef = db.collection('rooms').doc(id);
    const [rootSnap, fragments] = await Promise.all([
      rootRef.get(),
      rootRef.collection('gameState').limit(1).get()
    ]);
    const eligibility = evaluateDraftEligibility({
      rootExists: !!(rootSnap && rootSnap.exists),
      rootData: rootSnap && rootSnap.exists
        ? (typeof rootSnap.data === 'function' ? rootSnap.data() : rootSnap.data)
        : null,
      hasFragments: !!(fragments && fragments.size > 0),
      userId
    });
    if (!eligibility.ok) {return { ok: false, reason: eligibility.reason };}
    if (eligibility.existing) {return { ok: true, roomId: id, existing: true };}

    const draft = {
      id,
      name,
      description: description || '',
      gmId: userId,
      gmName: gmName || 'Game Master',
      settings: {
        maxPlayers: settings && Number.isFinite(Number(settings.maxPlayers)) ? Number(settings.maxPlayers) : 6,
        isPrivate: true,
        allowSpectators: false
      },
      checkpoint: null,
      chatHistory: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastModified: admin.firestore.FieldValue.serverTimestamp(),
      lastActivity: admin.firestore.FieldValue.serverTimestamp(),
      isActive: false,
      members: [userId],
      bannedUsers: [],
      stats: { totalSessions: 0, totalPlayTime: 0, lastSessionDate: null }
    };
    if (authority) {
      const batch = db.batch();
      const fence = await fenceRoomAuthorityBatch({ batch, roomId: id, token: authority });
      if (!fence.ok) {return { ok: false, reason: fence.code || 'room_authority_lost', code: fence.code };}
      batch.set(rootRef, draft);
      await batch.commit();
      return { ok: true, roomId: id, existing: false };
    }
    return { ok: false, reason: 'room_authority_required', code: AUTHORITY_CODES.LOST };
  } catch (error) {
    logger.error('Error creating safe room draft', { error: error.message, roomId: id, code: error.code });
    return { ok: false, reason: error.code || 'draft_create_failed' };
  }
};

/**
 * Project 4: bounded access-policy persistence, separate from P3 gameplay
 * checkpoints. Only password policy and bans are written.
 */
const updateRoomAccessPolicy = async(roomId, patch = {}, options = {}) => {
  if (!db) {return { ok: false, reason: 'unavailable' };}
  if (typeof roomId !== 'string' || roomId.length === 0) {return { ok: false, reason: 'room_id_required' };}
  const update = {};
  if (patch.passwordHash !== undefined) {
    if (patch.passwordHash !== null && typeof patch.passwordHash !== 'string') {
      return { ok: false, reason: 'invalid_password_hash' };
    }
    update.passwordHash = patch.passwordHash;
  }
  if (patch.bannedUsers !== undefined) {
    if (!Array.isArray(patch.bannedUsers)) {return { ok: false, reason: 'invalid_banned_users' };}
    update.bannedUsers = patch.bannedUsers;
  }
  if (Object.keys(update).length === 0) {return { ok: true, persisted: false };}
  const authority = options.authority || null;
  if (!authority) {return { ok: false, reason: 'room_authority_required', code: AUTHORITY_CODES.LOST };}
  try {
    const roomRef = db.collection('rooms').doc(roomId);
    const payload = {
      ...update,
      lastActivity: admin.firestore.FieldValue.serverTimestamp()
    };
    const batch = db.batch();
    const fence = await fenceRoomAuthorityBatch({ batch, roomId, token: authority });
    if (!fence.ok) {return { ok: false, reason: fence.code || 'room_authority_lost', code: fence.code };}
    batch.set(roomRef, payload, { merge: true });
    await batch.commit();
    return { ok: true, persisted: true };
  } catch (error) {
    logger.error('Error updating room access policy', { error: error.message, roomId, code: error.code });
    return { ok: false, reason: error.code || 'access_policy_update_failed' };
  }
};

/**
 * Save individual character document to Firestore
 * @param {string} characterId - Character ID
 * @param {Object} characterData - Character data
 * @param {string} userId - User ID (owner of the character)
 * @returns {Promise<boolean>} - Success status
 */
const saveCharacterDocument = async(characterId, characterData, userId) => {
  if (!db) {
    logger.debug('Firebase not initialized, character document not persisted');
    return false;
  }

  if (!characterId || !userId) {
    logger.warn('Missing characterId or userId, cannot save character document');
    return false;
  }

  try {
    // Transform character data for Firestore storage
    const firestoreData = {
      metadata: {
        id: characterId,
        userId: userId,
        name: characterData.name || 'Unnamed Character',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        lastPlayedAt: admin.firestore.FieldValue.serverTimestamp(),
        version: (characterData.version || 0) + 1
      },
      basicInfo: {
        race: characterData.race || '',
        subrace: characterData.subrace || '',
        class: characterData.class || '',
        level: characterData.level || 1,
        alignment: characterData.alignment || 'Neutral Good',
        exhaustionLevel: characterData.exhaustionLevel || 0
      },
      stats: characterData.stats || {
        strength: 10,
        agility: 10,
        constitution: 10,
        intelligence: 10,
        spirit: 10,
        charisma: 10
      },
      resources: {
        health: characterData.health || { current: 100, max: 100 },
        mana: characterData.mana || { current: 50, max: 50 },
        actionPoints: characterData.actionPoints || { current: 3, max: 3 }
      },
      inventory: characterData.inventory || {
        items: [],
        currency: { platinum: 0, gold: 0, silver: 0, copper: 0 },
        encumbranceState: 'normal'
      },
      equipment: characterData.equipment || {
        weapon: null,
        armor: null,
        shield: null,
        accessories: []
      },
      spells: characterData.spells || [],
      lore: characterData.lore || {},
      tokenSettings: characterData.tokenSettings || {},
      experience: characterData.experience || 0,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Save character document
    await db.collection('characters').doc(characterId).set(firestoreData, { merge: true });
    logger.info('Character document saved', { characterName: characterData.name, characterId });
    return true;
  } catch (error) {
    logger.error('Error saving character document to Firestore', { error: error.message, characterId });
    return false;
  }
};

/**
 * Get user data from Firestore
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} - User data or null
 */
const getUserData = async(userId) => {
  if (!db) {
    return null;
  }

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    logger.error('Error fetching user data', { error: error.message, userId });
    return null;
  }
};

/**
 * Verify Firebase ID token
 * @param {string} idToken - Firebase ID token
 * @returns {Promise<Object|null>} - Decoded token or null
 */
const verifyIdToken = async(idToken) => {
  if (!admin.apps.length) {
    return null;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    logger.error('Error verifying ID token', { error: error.message });
    return null;
  }
};

/**
 * Build the runtime room object from one classified checkpoint read.
 * Contains no authority logic; every caller must already hold authority (or be
 * an explicitly non-authority legacy loader).
 * @returns {Object|null} room data, or null when not reconstructable
 */
function buildPersistentRoomRuntime(roomId, classification) {
  if (!classification || classification.kind === 'READ_FAILED' || classification.kind === 'ABSENT_ROOM') {
    return null;
  }
  if (classification.kind !== 'ROOM_PRESENT_NO_SNAPSHOT' && !classification.selectedSnapshot) {
    logger.warn('[persistentRooms] Room checkpoint not reconstructable; not loaded', {
      roomId,
      kind: classification.kind,
      diagnostics: classification.diagnostics
    });
    return null;
  }

  const roomData = {
    id: roomId,
    ...(classification.roomMetadata || {}),
    // Discovered as an active cloud root. Persisted presence is not live
    // presence; only a current verified socket admission occupies runtime
    // membership, so the collection starts empty.
    isActive: true,
    isPermanent: true,
    players: new Map()
  };
  if (!roomData.persistentRoomId) {roomData.persistentRoomId = roomId;}
  if (roomData.password) {
    logger.warn('Room has plain text password - should be migrated to passwordHash', { roomId });
    delete roomData.password;
  }
  if (!Object.prototype.hasOwnProperty.call(roomData, 'passwordHash')) {
    roomData.passwordHash = null;
  }

  roomData.checkpointClassification = classification.kind;
  roomData.migrationRequired = classification.migrationRequired === true;

  if (classification.selectedSnapshot) {
    roomData.gameState = roomCheckpoint.hydrateSnapshotToGameState(classification.selectedSnapshot);
    roomData.checkpointRevision = classification.revision || null;
    if (classification.checkpoint) {roomData.checkpoint = classification.checkpoint;}
    if (classification.selection) {roomData.checkpointSelection = classification.selection;}
  } else {
    roomData.gameState = null;
  }
  return roomData;
}

/**
 * Bounded startup discovery: active room IDs only. No checkpoint state and no
 * administrative metadata is read or hydrated before authority is claimed.
 * @returns {Promise<string[]>}
 */
const discoverPersistentRoomIds = async() => {
  if (!db) {
    logger.debug('Firebase not initialized, skipping persistent room discovery');
    return [];
  }
  try {
    const roomsSnapshot = await db.collection('rooms')
      .where('isActive', '==', true)
      .get();
    return roomsSnapshot.docs.map((doc) => doc.id);
  } catch (error) {
    logger.error('Error discovering persistent rooms:', { error: error.message });
    return [];
  }
};

/**
 * R4: post-acquisition classified read. The runtime object is built
 * exclusively from a NEW classified checkpoint read performed after authority
 * was acquired; no object read before the claim is installed.
 * @param {string} roomId
 * @returns {Promise<Object|null>}
 */
const loadRoomAfterAuthorityClaim = async(roomId) => {
  if (!db) {return null;}
  const classification = await readRoomCheckpoint(roomId);
  if (classification.kind === 'READ_FAILED') {
    logger.error('[loadRoomAfterAuthorityClaim] Room read failed; room not loaded', {
      roomId,
      code: classification.code,
      diagnostic: classification.diagnostics[0] && classification.diagnostics[0].message
    });
    return null;
  }
  return buildPersistentRoomRuntime(roomId, classification);
};

/**
 * Legacy full loader (discovery + classified read + hydrate in one pass).
 * Retained for non-authority callers/tests; production startup uses
 * discoverPersistentRoomIds + loadRoomAfterAuthorityClaim so no state read
 * before the claim is ever installed.
 *
 * @returns {Promise<Array>} - Array of room data
 */
const loadPersistentRooms = async() => {
  if (!db) {
    logger.debug('Firebase not initialized, skipping persistent room loading');
    return [];
  }

  try {
    const roomsSnapshot = await db.collection('rooms')
      .where('isActive', '==', true)
      .get();

    const rooms = [];
    for (const doc of roomsSnapshot.docs) {
      const classification = await readRoomCheckpoint(doc.id);

      if (classification.kind === 'READ_FAILED') {
        logger.error('[loadPersistentRooms] Room read failed; room not loaded', {
          roomId: doc.id,
          code: classification.code,
          diagnostic: classification.diagnostics[0] && classification.diagnostics[0].message
        });
        continue;
      }
      const roomData = buildPersistentRoomRuntime(doc.id, classification);
      if (!roomData) {continue;}
      rooms.push(roomData);
    }

    logger.info(`Loaded ${rooms.length} persistent rooms from Firestore`);
    return rooms;
  } catch (error) {
    logger.error('Error loading persistent rooms:', { error: error.message });
    return [];
  }
};

module.exports = {
  db,
  isInitialized: () => isInitialized,
  isPersistenceAvailable: () => Boolean(db) && isInitialized,
  ROOM_WRITE_OUTCOMES,
  AUTHORITY_CODES,
  classifyRoomWriteError,
  normalizeRoomWriteOutcome,
  readRoomCheckpoint,
  publishRoomCheckpoint,
  getRoomData,
  saveRoomData,
  updateRoomMetadata,
  updateRoomGameState,
  updateMapData,
  getMapData,
  addChatMessage,
  setRoomActiveStatus,
  deleteRoom,
  addRoomMember,
  removeRoomMember,
  recordMembershipCompensation,
  listMembershipCompensations,
  clearMembershipCompensation,
  getCharacterOwner,
  listEntitledRoomMetadata,
  getRoomRootMetadata,
  createRoomDraft,
  evaluateDraftEligibility,
  updateRoomAccessPolicy,
  claimRoomAuthority,
  renewRoomAuthority,
  releaseRoomAuthority,
  validateRoomAuthority,
  fenceRoomAuthorityBatch,
  getUserData,
  verifyIdToken,
  loadPersistentRooms,
  discoverPersistentRoomIds,
  loadRoomAfterAuthorityClaim,
  saveCharacterDocument,
  validateConnection: async() => {
    if (!db) {return { success: false, message: 'Firebase not initialized' };}
    try {
      const testRef = db.collection('_server_health_check').doc('write_test');
      await testRef.set({
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        serverTime: Date.now()
      });
      await testRef.delete();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message, code: error.code };
    }
  }
};
