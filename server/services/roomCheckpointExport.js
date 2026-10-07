/**
 * Project 3 selected-room checkpoint export / validate / scratch-restore fixture.
 *
 * Bounded operator tool. This is not an account backup product: one selected
 * room per invocation, explicitly named scratch destination, no casual
 * production overwrite.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const roomCheckpoint = require('./roomCheckpoint');

const ARTIFACT_FORMAT = 'mythrill-room-checkpoint-export';
const ARTIFACT_VERSION = 1;

const SELECTABLE_MIGRATION_KINDS = new Set([
  'LEGACY_INLINE_ONLY',
  'LEGACY_SPLIT_ONLY_COMPLETE',
  'LEGACY_BOTH_INLINE_SPLIT',
  'CANONICAL_COMPLETE_CHECKPOINT'
]);

const isPlainRecord = (value) => (
  !!value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)
);

const authorityTokenMatches = (token, reference) => !!token && !!reference &&
  token.roomId === reference.roomId &&
  token.authorityInstanceId === reference.authorityInstanceId &&
  token.authorityGeneration === reference.authorityGeneration;

/**
 * R6/R7/B8: final completion guard for bounded account/scratch/CLI writers.
 * The exact original token is revalidated fresh against the backend (and, when
 * a local lifecycle is supplied, through assertSettle with post-await local
 * recheck) before a success response is reported. A committed write may remain
 * durable, but a lifecycle that lost authority during verification never
 * reports success as the current authoritative operation. Missing authority
 * fails closed.
 */
const assertAuthorityStillHeld = async({ firebaseService, authority, authorityService = null }) => {
  if (!authority) {return { ok: false, code: 'room_authority_required' };}
  if (authorityService && typeof authorityService.assertSettle === 'function') {
    const result = await authorityService.assertSettle(authority, { backendCheck: true });
    return { ok: result.ok === true, code: result.code || null };
  }
  if (!firebaseService || typeof firebaseService.validateRoomAuthority !== 'function') {
    return { ok: false, code: 'room_authority_unavailable' };
  }
  const result = await firebaseService.validateRoomAuthority({
    roomId: authority.roomId,
    instanceId: authority.authorityInstanceId,
    generation: authority.authorityGeneration
  });
  return { ok: result && result.ok === true, code: (result && result.code) || null };
};

/**
 * Full capture/current/confirmation writer hooks for bounded writers that
 * receive an explicit authority token instead of the live lifecycle service.
 *
 * B8: when a local authority service exists, admission/start uses the REAL
 * local lifecycle (ACTIVE for NEW work, ACTIVE-or-QUIESCING for settling a
 * captured attempt), not a self-comparison of the captured token. Without a
 * local service the captured-token identity plus the fresh backend
 * confirmation still bound the write.
 */
const authorityWriterHooks = ({ authority, authorityService, firebaseService }) => ({
  captureAuthority: () => authority,
  authorityRequired: true,
  authorityAccept: authorityService && typeof authorityService.validateCurrent === 'function'
    ? (token) => authorityService.validateCurrent(token)
    : null,
  authorityCurrent: authorityService && typeof authorityService.validateSettle === 'function'
    ? (token) => authorityService.validateSettle(token)
    : (token) => authorityTokenMatches(token, authority),
  authorityConfirm: async(token) => (await assertAuthorityStillHeld({
    firebaseService,
    authority: token,
    authorityService
  })).ok
});

const isValidScratchRoomId = (scratchRoomId) => {
  if (typeof scratchRoomId !== 'string' || scratchRoomId.length === 0) {return false;}
  if (!scratchRoomId.startsWith('scratch_')) {return false;}
  if (scratchRoomId.includes('/')) {return false;}
  if (scratchRoomId === '.' || scratchRoomId === '..') {return false;}
  if (Buffer.byteLength(scratchRoomId, 'utf8') > 1500) {return false;}
  if (Buffer.from(scratchRoomId, 'utf8').toString('utf8') !== scratchRoomId) {return false;}
  return true;
};

const selectionFingerprint = (classification) => roomCheckpoint.sha256Hex(roomCheckpoint.stableStringify({
  kind: classification.kind,
  selectedCandidateId: classification.selectedCandidateId || null,
  contentHash: (classification.checkpoint && classification.checkpoint.contentHash) || null,
  revision: Number.isSafeInteger(Number(classification.revision)) ? Number(classification.revision) : null,
  mapIds: classification.selectedSnapshot ? classification.selectedSnapshot.mapIds : null,
  candidateHashes: {
    inline: (classification.candidates && classification.candidates.inline && classification.candidates.inline.hash) || null,
    split: (classification.candidates && classification.candidates.split && classification.candidates.split.hash) || null
  },
  selectionStatus: classification.selection ? classification.selection.status : null,
  decisionId: classification.selection ? (classification.selection.decisionId || null) : null
}));

const encodeFirestoreValue = (value) => {
  if (value === null || typeof value === 'boolean' || typeof value === 'string' || typeof value === 'number') {
    return value;
  }
  if (value instanceof Date) {
    return { __type: 'date', value: value.toISOString() };
  }
  if (value && typeof value.toDate === 'function' && typeof value.seconds === 'number') {
    return { __type: 'timestamp', seconds: value.seconds, nanoseconds: value.nanoseconds || 0 };
  }
  if (value && typeof value.path === 'string' && typeof value.id === 'string') {
    return { __type: 'reference', path: value.path };
  }
  if (Array.isArray(value)) {
    return value.map(encodeFirestoreValue);
  }
  if (value && typeof value === 'object') {
    const output = {};
    for (const key of Object.keys(value)) {
      output[key] = encodeFirestoreValue(value[key]);
    }
    return output;
  }
  return { __type: 'unknown', text: String(value) };
};

const artifactPayload = (artifact) => {
  const payload = { ...artifact };
  delete payload.sha256;
  return roomCheckpoint.stableStringify(roomCheckpoint.canonicalize(payload, 'artifact').value);
};

const computeArtifactChecksum = (artifact) => crypto.createHash('sha256')
  .update(artifactPayload(artifact), 'utf8')
  .digest('hex');

const buildArtifact = (roomId, classification) => {
  const selected = classification.selectedSnapshot || null;
  const rawDocuments = classification.rawDocuments || null;

  const artifact = {
    artifactFormat: ARTIFACT_FORMAT,
    artifactVersion: ARTIFACT_VERSION,
    artifactId: randomUUID(),
    exportedAt: new Date().toISOString(),
    sourceRoomId: roomId,
    classification: classification.kind,
    selectedCandidateId: classification.selectedCandidateId || null,
    diagnostics: classification.diagnostics || [],
    checkpoint: classification.checkpoint
      ? {
        schemaVersion: classification.checkpoint.schemaVersion,
        revision: classification.checkpoint.revision,
        mapIds: classification.checkpoint.mapIds,
        contentHash: classification.checkpoint.contentHash,
        provenance: classification.checkpoint.provenance || null
      }
      : null,
    roomMetadata: classification.roomMetadata
      ? {
        name: classification.roomMetadata.name,
        description: classification.roomMetadata.description,
        settings: classification.roomMetadata.settings
      }
      : null,
    globalData: selected ? selected.global : null,
    mapFragments: selected
      ? selected.mapIds.map((mapId) => ({ mapId, data: selected.maps[mapId] }))
      : null,
    rawCandidates: {
      inline: classification.candidates && classification.candidates.inline
        ? classification.candidates.inline.raw ?? null
        : null,
      split: classification.candidates && classification.candidates.split
        ? classification.candidates.split.raw ?? null
        : null,
      rootDocument: rawDocuments && rawDocuments.root ? encodeFirestoreValue(rawDocuments.root) : null,
      gameStateDocuments: rawDocuments && rawDocuments.gameState
        ? Object.keys(rawDocuments.gameState).sort().map((docId) => ({
          id: docId,
          data: encodeFirestoreValue(rawDocuments.gameState[docId])
        }))
        : null
    },
    selectionDecision: classification.selection || null,
    sourceSelection: {
      fingerprint: selectionFingerprint(classification),
      classification: classification.kind,
      selectedCandidateId: classification.selectedCandidateId || null,
      selectionStatus: classification.selection ? classification.selection.status : null,
      candidateHashes: {
        inline: (classification.candidates && classification.candidates.inline && classification.candidates.inline.hash) || null,
        split: (classification.candidates && classification.candidates.split && classification.candidates.split.hash) || null
      }
    },
    ancillary: null,
    sha256: null
  };

  artifact.sha256 = computeArtifactChecksum(artifact);
  return artifact;
};

const isConvertibleClassification = (classification) => {
  if (!classification) {return false;}
  const selectionStatus = classification.selection ? classification.selection.status : null;
  return SELECTABLE_MIGRATION_KINDS.has(classification.kind) &&
    !!classification.selectedSnapshot &&
    selectionStatus !== 'AMBIGUOUS_RECONCILIATION_REQUIRED';
};

// Authoritative live-room registry (server-owned). Live server room authority
// outranks cloud absence when deciding scratch-restore eligibility. Wired by
// createSyncServices; never inferred from browser/client state.
let liveRoomRegistry = null;

const registerLiveRoomAuthority = (rooms) => {
  liveRoomRegistry = rooms && typeof rooms.get === 'function' ? rooms : null;
};

const hasLiveRoomAuthority = (roomId) => {
  if (!liveRoomRegistry) {return false;}
  return !!liveRoomRegistry.get(roomId);
};

const ROOM_METADATA_LIMITS = Object.freeze({
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 2000,
  SETTINGS_MAX_BYTES: 64 * 1024
});

const isPlainSettingsRecord = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value) || value instanceof Date) {return false;}
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

/**
 * ONE shared bounded metadata validator/canonicalizer for live, account and
 * draft branches. Returns a new validated patch and never mutates the input.
 */
const validateRoomMetadataPatch = (input) => {
  if (!isPlainSettingsRecord(input)) {return { ok: false, error: 'Invalid room metadata payload' };}
  const allowed = ['name', 'description', 'settings'];
  for (const key of Object.keys(input)) {
    if (!allowed.includes(key)) {return { ok: false, error: `Unsupported room metadata field: ${key}` };}
  }
  const patch = {};
  if (input.name !== undefined) {
    if (typeof input.name !== 'string' || input.name.trim().length === 0 ||
      input.name.trim().length > ROOM_METADATA_LIMITS.NAME_MAX_LENGTH) {
      return { ok: false, error: 'Invalid room name' };
    }
    patch.name = input.name.trim();
  }
  if (input.description !== undefined) {
    if (input.description !== null &&
      (typeof input.description !== 'string' || input.description.length > ROOM_METADATA_LIMITS.DESCRIPTION_MAX_LENGTH)) {
      return { ok: false, error: 'Invalid room description' };
    }
    patch.description = input.description === null ? '' : input.description;
  }
  if (input.settings !== undefined) {
    if (!isPlainSettingsRecord(input.settings)) {return { ok: false, error: 'Invalid room settings' };}
    const canonical = roomCheckpoint.canonicalize(input.settings, 'settings');
    if (canonical.error || !isPlainSettingsRecord(canonical.value)) {
      return { ok: false, error: 'Invalid room settings' };
    }
    if (Buffer.byteLength(JSON.stringify(canonical.value), 'utf8') > ROOM_METADATA_LIMITS.SETTINGS_MAX_BYTES) {
      return { ok: false, error: 'Room settings too large' };
    }
    patch.settings = canonical.value;
  }
  if (Object.keys(patch).length === 0) {
    return { ok: false, error: 'No room metadata fields supplied' };
  }
  return { ok: true, patch };
};

/**
 * Re-adapt the declared raw/legacy candidate exactly as the classifier would
 * have selected it. A legacy artifact has no canonical manifest yet; its
 * evidence is the selected candidate plus the raw candidate it came from.
 */
const adaptDeclaredLegacyCandidate = (artifact) => {
  const selectedId = artifact.selectedCandidateId;
  const rawCandidates = artifact.rawCandidates || {};
  if (selectedId === 'inline') {
    if (!isPlainRecord(rawCandidates.inline)) {return { error: 'artifact_raw_candidate_missing' };}
    const adapted = roomCheckpoint.adaptInlineCandidate(rawCandidates.inline);
    if (!adapted || adapted.complete !== true) {return { error: 'artifact_selected_candidate_incomplete' };}
    return { adapted };
  }
  if (selectedId === 'split') {
    const split = rawCandidates.split;
    if (!isPlainRecord(split) || !isPlainRecord(split.current)) {return { error: 'artifact_raw_candidate_missing' };}
    const entries = Object.keys(split.maps || {}).map((id) => ({ id, data: split.maps[id] }));
    const adapted = roomCheckpoint.adaptSplitCandidate(split.current, entries);
    if (!adapted || adapted.complete !== true) {return { error: 'artifact_selected_candidate_incomplete' };}
    return { adapted };
  }
  return { error: 'artifact_selected_candidate_missing' };
};

const validateArtifact = (artifact) => {
  const errors = [];
  if (!artifact || typeof artifact !== 'object') {
    return { ok: false, errors: ['artifact_not_object'] };
  }
  if (artifact.artifactFormat !== ARTIFACT_FORMAT) {errors.push('artifact_format_mismatch');}
  if (artifact.artifactVersion !== ARTIFACT_VERSION) {errors.push('artifact_version_unsupported');}
  if (typeof artifact.sourceRoomId !== 'string' || artifact.sourceRoomId.length === 0) {errors.push('source_room_missing');}
  if (typeof artifact.sha256 !== 'string' || !/^[0-9a-f]{64}$/.test(artifact.sha256)) {
    errors.push('checksum_missing');
  } else if (computeArtifactChecksum(artifact) !== artifact.sha256) {
    errors.push('checksum_mismatch');
  }

  const hasSelectedData = artifact.globalData !== null && artifact.globalData !== undefined;
  if (hasSelectedData) {
    const checkpoint = artifact.checkpoint;
    const canonicalArtifact = isPlainRecord(checkpoint);
    if (canonicalArtifact) {
      if (Number(checkpoint.schemaVersion) !== roomCheckpoint.CHECKPOINT_SCHEMA_VERSION) {errors.push('checkpoint_schema_unsupported');}
      if (!Number.isSafeInteger(Number(checkpoint.revision)) || Number(checkpoint.revision) <= 0) {errors.push('checkpoint_revision_invalid');}
      if (!Array.isArray(checkpoint.mapIds)) {errors.push('checkpoint_map_ids_missing');}
      if (typeof checkpoint.contentHash !== 'string' || !/^[0-9a-f]{64}$/.test(checkpoint.contentHash)) {errors.push('checkpoint_hash_invalid');}
    } else {
      // Raw/legacy selected artifact produced for a convertible room. The
      // canonical manifest is intentionally absent until conversion succeeds;
      // validity comes from the declared legacy kind and its raw candidate.
      if (!SELECTABLE_MIGRATION_KINDS.has(artifact.classification)) {errors.push('artifact_classification_invalid');}
      const decisionStatus = artifact.selectionDecision ? artifact.selectionDecision.status : null;
      if (decisionStatus === 'AMBIGUOUS_RECONCILIATION_REQUIRED') {errors.push('artifact_ambiguous_selection');}
    }

    const globalCanonical = roomCheckpoint.canonicalize(artifact.globalData, 'artifact.globalData');
    if (globalCanonical.error) {errors.push(`global_data_invalid:${globalCanonical.error}`);}

    if (!Array.isArray(artifact.mapFragments)) {
      errors.push('map_fragments_missing');
    } else {
      const seen = new Set();
      const mapJsons = {};
      for (const fragment of artifact.mapFragments) {
        if (!fragment || typeof fragment.mapId !== 'string') {errors.push('map_fragment_id_missing'); continue;}
        if (seen.has(fragment.mapId)) {errors.push(`map_fragment_duplicate:${fragment.mapId}`);}
        seen.add(fragment.mapId);
        const mapError = roomCheckpoint.validateMapId(fragment.mapId);
        if (mapError) {errors.push(`${mapError}:${fragment.mapId}`);}
        const mapCanonical = roomCheckpoint.canonicalize(fragment.data, `artifact.map.${fragment.mapId}`);
        if (mapCanonical.error) {errors.push(mapCanonical.error); continue;}
        const record = mapCanonical.value;
        if (!isPlainRecord(record)) {errors.push(`map_fragment_not_record:${fragment.mapId}`); continue;}
        if (record.id !== fragment.mapId) {errors.push(`map_fragment_id_mismatch:${fragment.mapId}`);}
        mapJsons[fragment.mapId] = roomCheckpoint.stableStringify(record);
      }

      let declared = null;
      if (canonicalArtifact && Array.isArray(checkpoint.mapIds)) {
        declared = [...checkpoint.mapIds].map(String).sort();
      } else if (!canonicalArtifact) {
        const legacy = adaptDeclaredLegacyCandidate(artifact);
        if (legacy.error) {
          errors.push(legacy.error);
        } else {
          const adapted = legacy.adapted;
          declared = [...adapted.mapIds].sort();
          const adaptedGlobal = roomCheckpoint.canonicalize(adapted.global, 'artifact.adapted.global');
          if (!adaptedGlobal.error && !globalCanonical.error &&
            roomCheckpoint.stableStringify(adaptedGlobal.value) !== roomCheckpoint.stableStringify(globalCanonical.value)) {
            errors.push('artifact_selected_data_mismatch:global');
          }
          for (const mapId of declared) {
            const adaptedMap = roomCheckpoint.canonicalize(adapted.maps[mapId], `artifact.adapted.${mapId}`);
            if (adaptedMap.error || !mapJsons[mapId] ||
              roomCheckpoint.stableStringify(adaptedMap.value) !== mapJsons[mapId]) {
              errors.push(`artifact_selected_data_mismatch:${mapId}`);
            }
          }
        }
      }
      if (declared) {
        const fragmentIds = Array.from(seen).filter((mapId) => typeof mapId === 'string').sort();
        if (roomCheckpoint.stableStringify(fragmentIds) !== roomCheckpoint.stableStringify(declared)) {
          errors.push('map_fragment_set_mismatch');
        }
        if (!globalCanonical.error) {
          const globalRecord = globalCanonical.value;
          const defaultMapId = globalRecord ? globalRecord.defaultMapId : undefined;
          if (defaultMapId !== null && defaultMapId !== undefined && !declared.includes(defaultMapId)) {
            errors.push(`artifact_default_map_missing:${defaultMapId}`);
          }
          if (canonicalArtifact) {
            const computedHash = roomCheckpoint.sha256Hex(roomCheckpoint.stableStringify([
              roomCheckpoint.CHECKPOINT_SCHEMA_VERSION,
              roomCheckpoint.stableStringify(globalRecord),
              declared.map((mapId) => [mapId, mapJsons[mapId] || null])
            ]));
            if (computedHash !== checkpoint.contentHash) {errors.push('checkpoint_content_hash_mismatch');}
          }
        }
      }
    }
  }

  return { ok: errors.length === 0, errors };
};

const writeArtifactFile = (artifact, directory) => {
  if (!directory || typeof directory !== 'string') {
    return { ok: false, reason: 'export_destination_unconfigured' };
  }
  try {
    fs.mkdirSync(directory, { recursive: true });
    const fileName = `${artifact.sourceRoomId}-${artifact.artifactId}.json`;
    const filePath = path.join(directory, fileName);
    fs.writeFileSync(filePath, JSON.stringify(artifact, null, 2), 'utf8');
    const readBack = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(readBack);
    // Recompute integrity over the read-back payload; field equality alone
    // does not prove the artifact bytes survived intact.
    const recomputed = computeArtifactChecksum(parsed);
    if (parsed.sha256 !== artifact.sha256 || recomputed !== artifact.sha256) {
      return { ok: false, reason: 'artifact_readback_mismatch' };
    }
    return { ok: true, path: filePath, sha256: artifact.sha256 };
  } catch (error) {
    return { ok: false, reason: `artifact_write_failed:${error.message}` };
  }
};

const readArtifactFile = (filePath) => {
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return { ok: true, artifact: parsed };
  } catch (error) {
    return { ok: false, reason: `artifact_read_failed:${error.message}` };
  }
};

const ensureRollbackArtifact = async(roomId, firebaseService) => {
  const directory = process.env.ROOM_EXPORT_DIR;
  if (!directory) {
    return { ok: false, reason: 'export_destination_unconfigured' };
  }
  const classification = await firebaseService.readRoomCheckpoint(roomId, { includeRaw: true });
  if (classification.kind === 'READ_FAILED') {
    return { ok: false, reason: 'source_read_failed' };
  }
  if (!isConvertibleClassification(classification)) {
    const selectionStatus = classification.selection ? classification.selection.status : null;
    return {
      ok: false,
      reason: `source_not_convertible:${classification.kind}${selectionStatus ? `:${selectionStatus}` : ''}`
    };
  }
  const artifact = buildArtifact(roomId, classification);
  const written = writeArtifactFile(artifact, directory);
  if (!written.ok) {return written;}
  return {
    ok: true,
    artifactId: artifact.artifactId,
    sha256: artifact.sha256,
    path: written.path,
    artifact,
    sourceFingerprint: artifact.sourceSelection.fingerprint
  };
};

const restoreArtifactToScratch = async({ artifactPath, scratchRoomId, firebaseService, authority = null, authorityService = null }) => {
  if (!isValidScratchRoomId(scratchRoomId)) {
    return { ok: false, reason: 'scratch_room_id_required' };
  }
  const read = readArtifactFile(artifactPath);
  if (!read.ok) {return read;}
  const artifact = read.artifact;
  const validation = validateArtifact(artifact);
  if (!validation.ok) {return { ok: false, reason: 'artifact_invalid', errors: validation.errors };}

  if (artifact.sourceRoomId === scratchRoomId) {
    return { ok: false, reason: 'source_room_restore_refused' };
  }
  if (!artifact.globalData || !Array.isArray(artifact.mapFragments)) {
    return { ok: false, reason: 'artifact_has_no_selected_snapshot' };
  }

  const existing = await firebaseService.readRoomCheckpoint(scratchRoomId, { includeRaw: true });
  if (existing.kind === 'READ_FAILED') {return { ok: false, reason: 'scratch_read_failed' };}

  // Live server authority outranks cloud absence: a usable in-memory room is
  // never an eligible scratch destination, even when no durable document
  // exists yet. Refuse before any writer/commit and never mutate the room.
  if (hasLiveRoomAuthority(scratchRoomId)) {
    return { ok: false, reason: 'scratch_target_live' };
  }

  const maps = {};
  const mapIds = [];
  for (const fragment of artifact.mapFragments) {
    maps[fragment.mapId] = fragment.data;
    mapIds.push(fragment.mapId);
  }
  mapIds.sort();

  const snapshot = {
    global: { ...artifact.globalData, defaultMapId: mapIds.length > 0 ? (artifact.globalData.defaultMapId || mapIds[0]) : null },
    maps,
    mapIds
  };

  if (existing.kind === 'CANONICAL_COMPLETE_CHECKPOINT' && existing.checkpoint) {
    // Exact same-artifact receipt: legacy artifacts have no canonical content
    // hash yet, so the artifact checksum plus the exact declared map set is
    // the identity; canonical artifacts additionally bind the content hash.
    const contentBound = artifact.checkpoint
      ? existing.checkpoint.contentHash === artifact.checkpoint.contentHash
      : true;
    if (contentBound &&
      Array.isArray(existing.checkpoint.mapIds) &&
      existing.checkpoint.mapIds.join('\u0000') === mapIds.join('\u0000') &&
      existing.checkpoint.provenance &&
      existing.checkpoint.provenance.rollbackArtifactSha256 === artifact.sha256) {
      const finalAuthority = await assertAuthorityStillHeld({ firebaseService, authority, authorityService });
      if (!finalAuthority.ok) {
        return { ok: false, reason: `scratch_authority_lost:${finalAuthority.code || 'lost'}` };
      }
      return {
        ok: true,
        alreadyVerified: true,
        scratchRoomId,
        revision: existing.revision,
        contentHash: existing.checkpoint.contentHash
      };
    }
    return { ok: false, reason: 'scratch_target_not_empty' };
  }
  // Existing destinations are refused by default. Only a truly absent scratch
  // room (or the exact same-artifact receipt handled above) may be written.
  if (existing.kind !== 'ABSENT_ROOM') {
    return { ok: false, reason: `scratch_target_not_empty:${existing.kind}` };
  }

  const gameState = roomCheckpoint.hydrateSnapshotToGameState(snapshot);
  const restoredMetadata = isPlainRecord(artifact.roomMetadata) ? artifact.roomMetadata : {};
  const provenance = {
    kind: 'restore',
    sourceRoomId: artifact.sourceRoomId,
    sourceRevision: artifact.checkpoint ? artifact.checkpoint.revision : null,
    rollbackArtifactId: artifact.artifactId,
    rollbackArtifactSha256: artifact.sha256
  };

  // Selected P2/P3 writer integration: same revision allocation and
  // confirmation semantics as canonical durable room writes. No direct
  // publication and no local revision arithmetic.
  const { FirebaseBatchWriter } = require('./syncService');
  const targetFloor = Number.isSafeInteger(Number(existing.revision)) && Number(existing.revision) > 0
    ? Number(existing.revision)
    : 0;
  const writer = new FirebaseBatchWriter(60000, 1, {
    shouldPersist: () => true,
    getRoomRevision: () => targetFloor,
    ...authorityWriterHooks({ authority, authorityService, firebaseService }),
    validateSnapshot: (value) => {
      const check = roomCheckpoint.canonicalize(value, 'gameState');
      return check.error ? { error: check.error } : { error: null };
    },
    captureMetadata: () => ({
      // Copy the selected shared metadata exactly; scratch identity may differ
      // but name/description/settings are the selected room's values.
      name: typeof restoredMetadata.name === 'string' ? restoredMetadata.name : null,
      description: restoredMetadata.description ?? null,
      settings: isPlainRecord(restoredMetadata.settings) ? restoredMetadata.settings : {},
      provenance
    }),
    persist: (roomId, value, context) => firebaseService.updateRoomGameState(roomId, value, { ...context, authority })
  });

  let published;
  try {
    published = await writer.saveNow(scratchRoomId, gameState);
  } finally {
    writer.stop();
  }

  if (!published || published.outcome !== 'confirmed') {
    return {
      ok: false,
      reason: `scratch_publish_${(published && published.outcome) || 'unavailable'}:${(published && published.reason) || ''}`
    };
  }

  const verification = await firebaseService.readRoomCheckpoint(scratchRoomId);
  if (verification.kind !== 'CANONICAL_COMPLETE_CHECKPOINT') {
    return { ok: false, reason: 'scratch_verification_failed' };
  }
  const expectedHash = roomCheckpoint.sha256Hex(roomCheckpoint.stableStringify([
    roomCheckpoint.CHECKPOINT_SCHEMA_VERSION,
    roomCheckpoint.stableStringify(roomCheckpoint.canonicalize(snapshot.global, 'global').value),
    mapIds.map((mapId) => [
      mapId,
      roomCheckpoint.stableStringify(roomCheckpoint.canonicalize(snapshot.maps[mapId], `maps.${mapId}`).value)
    ])
  ]));
  if (verification.checkpoint.contentHash !== expectedHash) {
    return { ok: false, reason: 'scratch_content_hash_mismatch' };
  }

  // R7: final originating-authority check before reporting success. A takeover
  // during checkpoint verification is never reported as this op's success.
  const finalAuthority = await assertAuthorityStillHeld({ firebaseService, authority, authorityService });
  if (!finalAuthority.ok) {
    return { ok: false, reason: `scratch_authority_lost:${finalAuthority.code || 'lost'}` };
  }

  return {
    ok: true,
    alreadyVerified: false,
    scratchRoomId,
    revision: verification.revision,
    contentHash: verification.checkpoint.contentHash
  };
};

const applyCanonicalMetadataEdit = async({ roomId, patch, classification, firebaseService, authority = null, authorityService = null }) => {
  const gameState = roomCheckpoint.hydrateSnapshotToGameState(classification.selectedSnapshot);
  const storedMetadata = classification.roomMetadata || {};
  const mergedSettings = patch.settings !== undefined
    ? { ...(isPlainRecord(storedMetadata.settings) ? storedMetadata.settings : {}), ...patch.settings }
    : (isPlainRecord(storedMetadata.settings) ? storedMetadata.settings : {});
  const restoredMetadata = {
    name: patch.name !== undefined
      ? patch.name
      : (typeof storedMetadata.name === 'string' ? storedMetadata.name : null),
    description: patch.description !== undefined
      ? patch.description
      : (storedMetadata.description ?? null),
    settings: mergedSettings,
    // Lineage must survive an ordinary metadata edit.
    provenance: classification.checkpoint.provenance || null
  };

  const { FirebaseBatchWriter } = require('./syncService');
  const floor = Number.isSafeInteger(Number(classification.revision)) ? Number(classification.revision) : 0;
  const writer = new FirebaseBatchWriter(60000, 1, {
    shouldPersist: () => true,
    getRoomRevision: () => floor,
    ...authorityWriterHooks({ authority, authorityService, firebaseService }),
    validateSnapshot: (value) => {
      const check = roomCheckpoint.canonicalize(value, 'gameState');
      return check.error ? { error: check.error } : { error: null };
    },
    captureMetadata: () => restoredMetadata,
    persist: (id, value, context) => firebaseService.updateRoomGameState(id, value, { ...context, authority })
  });

  let published;
  try {
    published = await writer.saveNow(roomId, gameState);
  } finally {
    writer.stop();
  }
  if (!published || published.outcome !== 'confirmed') {
    return {
      ok: false,
      reason: `metadata_publish_${(published && published.outcome) || 'unavailable'}`,
      outcome: (published && published.outcome) || 'unavailable'
    };
  }
  // R7: final originating-authority check before success is reported.
  const finalAuthority = await assertAuthorityStillHeld({ firebaseService, authority, authorityService });
  if (!finalAuthority.ok) {
    return {
      ok: false,
      reason: `metadata_authority_lost:${finalAuthority.code || 'lost'}`,
      outcome: 'confirmed'
    };
  }
  return { ok: true, outcome: 'confirmed', revision: published.revision };
};

const resolveMetadataPatch = ({ patch, updates }) => (
  patch ? { ok: true, patch } : validateRoomMetadataPatch(updates || {})
);

/**
 * Server-mediated shared metadata edit for a canonical room that is not live
 * in server memory (e.g. account-level room management).
 *
 * Authority: the verified socket identity must match the room's stored gmId.
 * The edit republishes the selected snapshot unchanged at the next revision
 * through the selected P2/P3 writer, so only metadata changes and lineage is
 * preserved. Legacy/unknown rooms are refused; they require explicit migration.
 */
const publishCanonicalMetadataEdit = async({ roomId, updates = {}, patch = null, gmUserId, firebaseService, authority = null, authorityService = null }) => {
  if (typeof roomId !== 'string' || roomId.length === 0) {return { ok: false, reason: 'room_id_required' };}
  if (typeof gmUserId !== 'string' || gmUserId.length === 0) {return { ok: false, reason: 'verified_identity_required' };}

  const validation = resolveMetadataPatch({ patch, updates });
  if (!validation.ok) {return { ok: false, reason: 'invalid_metadata', error: validation.error };}

  const classification = await firebaseService.readRoomCheckpoint(roomId);
  if (classification.kind === 'READ_FAILED') {return { ok: false, reason: 'room_read_failed' };}
  if (classification.kind !== 'CANONICAL_COMPLETE_CHECKPOINT' ||
    !classification.selectedSnapshot || !classification.checkpoint) {
    return { ok: false, reason: `room_not_canonical:${classification.kind}` };
  }
  const storedMetadata = classification.roomMetadata || {};
  if (storedMetadata.gmId !== gmUserId) {return { ok: false, reason: 'not_room_gm' };}

  return applyCanonicalMetadataEdit({ roomId, patch: validation.patch, classification, firebaseService, authority, authorityService });
};

/**
 * Account-level bounded metadata edit. Canonical rooms republish through the
 * selected writer; an uninitialized metadata-only draft edits only bounded
 * metadata fields and must not create a gameplay checkpoint.
 */
const publishAccountMetadataEdit = async({ roomId, updates = {}, patch = null, gmUserId, firebaseService, authority = null, authorityService = null }) => {
  if (typeof roomId !== 'string' || roomId.length === 0) {return { ok: false, reason: 'room_id_required' };}
  if (typeof gmUserId !== 'string' || gmUserId.length === 0) {return { ok: false, reason: 'verified_identity_required' };}

  const validation = resolveMetadataPatch({ patch, updates });
  if (!validation.ok) {return { ok: false, reason: 'invalid_metadata', error: validation.error };}

  const classification = await firebaseService.readRoomCheckpoint(roomId);
  if (classification.kind === 'READ_FAILED') {return { ok: false, reason: 'room_read_failed' };}
  const storedMetadata = classification.roomMetadata || {};
  if (storedMetadata.gmId !== gmUserId) {return { ok: false, reason: 'not_room_gm' };}

  if (classification.kind === 'ROOM_PRESENT_NO_SNAPSHOT') {
    // Frozen draft boundary: bounded metadata only, never a gameplay
    // checkpoint/gameState.
    const result = await firebaseService.updateRoomMetadata(roomId, validation.patch, authority ? { authority } : {});
    if (!result || result.ok !== true) {
      return { ok: false, reason: `draft_metadata_${(result && result.reason) || 'failed'}` };
    }
    // R7: final originating-authority check before success is reported.
    const finalAuthority = await assertAuthorityStillHeld({ firebaseService, authority, authorityService });
    if (!finalAuthority.ok) {
      return { ok: false, reason: `draft_metadata_authority_lost:${finalAuthority.code || 'lost'}` };
    }
    return { ok: true, outcome: 'confirmed', kind: 'draft' };
  }
  if (classification.kind !== 'CANONICAL_COMPLETE_CHECKPOINT' ||
    !classification.selectedSnapshot || !classification.checkpoint) {
    return { ok: false, reason: `room_not_canonical:${classification.kind}` };
  }
  return applyCanonicalMetadataEdit({ roomId, patch: validation.patch, classification, firebaseService, authority, authorityService });
};

const runCli = async(argv) => {
  const command = argv[0];
  const firebaseService = require('./firebaseService');
  if (command === 'export') {
    const roomId = argv[1];
    const result = await ensureRollbackArtifact(roomId, firebaseService);
    process.stdout.write(`${JSON.stringify(result.ok ? { ok: true, path: result.path, sha256: result.sha256, artifactId: result.artifactId } : result)}\n`);
    process.exitCode = result.ok ? 0 : 1;
    return;
  }
  if (command === 'validate') {
    const read = readArtifactFile(argv[1]);
    if (!read.ok) {
      process.stdout.write(`${JSON.stringify(read)}\n`);
      process.exitCode = 1;
      return;
    }
    const validation = validateArtifact(read.artifact);
    process.stdout.write(`${JSON.stringify(validation)}\n`);
    process.exitCode = validation.ok ? 0 : 1;
    return;
  }
  if (command === 'restore') {
    // C5: scratch publication claims target-room authority, publishes under
    // the atomic fence, then conditionally releases.
    const roomAuthority = require('./roomAuthorityService');
    const { v4: uuidv4 } = require('uuid');
    const authorityService = roomAuthority.createRoomAuthorityService({
      backend: roomAuthority.createFirestoreAuthorityBackend(firebaseService),
      instanceId: uuidv4(),
      logger: { debug() {}, info() {}, warn() {}, error() {} }
    });
    const scratchRoomId = argv[2];
    let claim = null;
    if (typeof scratchRoomId === 'string' && scratchRoomId.length > 0) {
      claim = await authorityService.acquire(scratchRoomId);
      if (!claim.ok) {
        process.stdout.write(`${JSON.stringify({ ok: false, reason: claim.code })}\n`);
        process.exitCode = 1;
        return;
      }
    }
    let result;
    let releaseResult = { ok: true, released: true, code: null };
    try {
      result = await restoreArtifactToScratch({
        artifactPath: argv[1],
        scratchRoomId,
        firebaseService,
        authority: claim ? claim.token : null,
        authorityService
      });
    } finally {
      if (claim) {
        try {
          releaseResult = await authorityService.release(claim.token);
        } catch (_releaseError) {
          releaseResult = { ok: false, code: 'room_authority_unavailable', released: false };
        }
      }
    }
    // C5: a durable scratch publication is HISTORICAL durability once the
    // captured authority is lost during release. The CLI must not print clean
    // current success after a failed/ambiguous release.
    let output = result;
    const releaseClean = !claim ||
      (releaseResult && releaseResult.ok === true && releaseResult.released === true);
    if (result && result.ok === true && !releaseClean) {
      output = {
        ok: false,
        durable: true,
        reason: `scratch_authority_lost_during_release:${(releaseResult && releaseResult.code) || 'room_authority_lost'}`,
        scratchRoomId: result.scratchRoomId,
        revision: result.revision
      };
    }
    process.stdout.write(`${JSON.stringify(output)}\n`);
    process.exitCode = output.ok ? 0 : 1;
    return;
  }
  process.stdout.write('usage: export <roomId> | validate <artifactPath> | restore <artifactPath> <scratchRoomId>\n');
  process.exitCode = 1;
};

if (require.main === module) {
  runCli(process.argv.slice(2)).catch((error) => {
    process.stdout.write(`${JSON.stringify({ ok: false, reason: error.message })}\n`);
    process.exitCode = 1;
  });
}

module.exports = {
  ARTIFACT_FORMAT,
  ARTIFACT_VERSION,
  buildArtifact,
  validateArtifact,
  writeArtifactFile,
  readArtifactFile,
  ensureRollbackArtifact,
  restoreArtifactToScratch,
  encodeFirestoreValue,
  computeArtifactChecksum,
  selectionFingerprint,
  isValidScratchRoomId,
  isConvertibleClassification,
  registerLiveRoomAuthority,
  hasLiveRoomAuthority,
  validateRoomMetadataPatch,
  publishCanonicalMetadataEdit,
  publishAccountMetadataEdit,
  runCli
};
