/**
 * Project 3 room checkpoint codec and classifier.
 *
 * Frozen contract: docs/MYTHRILL_PROJECT_3_ARCHITECTURE_FREEZE.md.
 * Structural preservation and validation only - no gameplay interpretation.
 */

const crypto = require('crypto');

const CHECKPOINT_SCHEMA_VERSION = 1;
const ROOT_ENTITY_MIRRORS = ['tokens', 'characterTokens', 'gridItems'];
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const RESERVED_MAP_IDS = new Set(['current']);
const FIELD_VALUE_BYTES = 1024 * 1024 - 89;

const STRUCTURAL_ENTITY_FIELDS = ['tokens', 'characterTokens', 'gridItems'];
const STRUCTURAL_ARRAY_FIELDS = [
  'drawingPaths', 'drawingLayers', 'fogOfWarPaths', 'fogErasePaths',
  'environmentalObjects', 'dndElements'
];
const STRUCTURAL_RECORD_FIELDS = [
  'terrainData', 'wallData', 'windowOverlays', 'fogOfWarData', 'exploredAreas',
  'lightSources', 'elevationData', 'rampData', 'containers', 'creatures',
  'sunSettings', 'gridSettings'
];

const CHECKPOINT_LIMITS = Object.freeze({
  MAX_OPERATIONS: 500,
  MAX_DOCUMENT_BYTES: 900 * 1024,
  MAX_REQUEST_BYTES: 8 * 1024 * 1024
});

const LEGACY_ROOT_ONLY_MAP_FIELDS = [
  'terrainData', 'environmentalObjects', 'wallData', 'windowOverlays',
  'dndElements', 'fogOfWarData', 'fogOfWarPaths', 'fogErasePaths',
  'exploredAreas', 'drawingPaths', 'drawingLayers', 'lightSources',
  'elevationData', 'rampData', 'sunSettings', 'containers', 'creatures',
  'gridSettings'
];

const LEGACY_MAP_DATA_FIELDS = [
  'backgrounds', 'activeBackgroundId', 'backgroundImage', 'backgroundImageUrl',
  'cameraX', 'cameraY', 'zoomLevel', 'gridSettings'
];

const isPlainRecord = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value) || value instanceof Date) {return false;}
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

const utf8Bytes = (value) => Buffer.byteLength(String(value), 'utf8');

const sha256Hex = (value) => crypto.createHash('sha256').update(String(value), 'utf8').digest('hex');

const normalizeProvenance = (provenance) => ({
  kind: typeof provenance?.kind === 'string' ? provenance.kind : 'native',
  sourceRoomId: provenance?.sourceRoomId ?? null,
  sourceRevision: Number.isSafeInteger(provenance?.sourceRevision) ? provenance.sourceRevision : null,
  selectedCandidateId: provenance?.selectedCandidateId ?? null,
  rollbackArtifactId: provenance?.rollbackArtifactId ?? null,
  rollbackArtifactSha256: provenance?.rollbackArtifactSha256 ?? null,
  decisionId: provenance?.decisionId ?? null
});

const canonicalize = (value, path) => {
  if (value === undefined) {return { omit: true };}
  if (value === null || typeof value === 'boolean' || typeof value === 'string') {return { value };}

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {return { error: `non_finite_number at ${path}` };}
    return { value };
  }

  if (typeof value === 'function' || typeof value === 'symbol' || typeof value === 'bigint') {
    return { error: `unsupported_${typeof value} at ${path}` };
  }

  if (value instanceof Date) {
    return { value: value.toISOString() };
  }

  if (Array.isArray(value)) {
    const output = [];
    for (let index = 0; index < value.length; index += 1) {
      if (!(index in value)) {return { error: `sparse_array at ${path}[${index}]` };}
      const child = canonicalize(value[index], `${path}[${index}]`);
      if (child.error) {return child;}
      if (child.omit) {return { error: `undefined_array_element at ${path}[${index}]` };}
      output.push(child.value);
    }
    return { value: output };
  }

  if (isPlainRecord(value)) {
    const output = {};
    for (const key of Object.keys(value).sort()) {
      if (UNSAFE_KEYS.has(key) || /^__.*__$/.test(key)) {
        return { error: `unsafe_key at ${path}.${key}` };
      }
      const child = canonicalize(value[key], `${path}.${key}`);
      if (child.error) {return child;}
      if (child.omit) {continue;}
      output[key] = child.value;
    }
    return { value: output };
  }

  return { error: `unsupported_object at ${path}` };
};

const stableStringify = (value) => JSON.stringify(value);

const canonicalHash = (value) => {
  const result = canonicalize(value, 'value');
  if (result.error) {return null;}
  return sha256Hex(stableStringify(result.value));
};

const validateMapId = (mapId) => {
  if (typeof mapId !== 'string' || mapId.length === 0) {return 'map_id_not_string';}
  if (RESERVED_MAP_IDS.has(mapId)) {return 'map_id_reserved';}
  if (mapId.includes('/')) {return 'map_id_contains_slash';}
  if (mapId === '.' || mapId === '..') {return 'map_id_invalid';}
  if (utf8Bytes(mapId) > 1500) {return 'map_id_too_long';}
  if (/^__.*__$/.test(mapId)) {return 'map_id_reserved_pattern';}
  if (Buffer.from(mapId, 'utf8').toString('utf8') !== mapId) {return 'map_id_invalid_utf8';}
  return null;
};

const invalid = (reason) => ({ ok: false, code: 'CHECKPOINT_INVALID', reason });

const deriveRootMirrors = (maps) => {
  const mirrors = { tokens: {}, characterTokens: {}, gridItems: {} };
  const collisions = [];
  const seenByField = { tokens: {}, characterTokens: {}, gridItems: {} };

  for (const mapId of Object.keys(maps).sort()) {
    const mapRecord = maps[mapId];
    for (const field of ROOT_ENTITY_MIRRORS) {
      const collection = isPlainRecord(mapRecord[field]) ? mapRecord[field] : {};
      for (const entityId of Object.keys(collection)) {
        if (Object.prototype.hasOwnProperty.call(seenByField[field], entityId)) {
          collisions.push({ field, entityId, mapId });
        }
        seenByField[field][entityId] = mapId;
        mirrors[field][entityId] = collection[entityId];
      }
    }
  }

  return { ...mirrors, collisions };
};

const omitKeys = (record, keys) => {
  const output = {};
  for (const key of Object.keys(record)) {
    if (!keys.includes(key)) {output[key] = record[key];}
  }
  return output;
};

/**
 * Convert a legacy entity collection (array or dictionary) into the canonical
 * dictionary shape. Non-empty arrays collapse to a dictionary only when every
 * entry has a usable stable ID; otherwise the candidate is refused.
 */
const toEntityDictionary = (value, path) => {
  if (value === undefined || value === null) {return { ok: true, dict: {} };}
  if (isPlainRecord(value)) {return { ok: true, dict: value };}
  if (Array.isArray(value)) {
    const dict = {};
    const issues = [];
    for (let index = 0; index < value.length; index += 1) {
      const entry = value[index];
      if (!isPlainRecord(entry)) {issues.push(`${path}[${index}]_not_record`); continue;}
      const rawId = entry.id !== undefined && entry.id !== null
        ? entry.id
        : (entry.creatureId !== undefined && entry.creatureId !== null ? entry.creatureId : null);
      if (rawId === null) {issues.push(`${path}[${index}]_missing_id`); continue;}
      const id = String(rawId);
      if (Object.prototype.hasOwnProperty.call(dict, id)) {issues.push(`${path}_duplicate_id:${id}`); continue;}
      dict[id] = entry;
    }
    return issues.length > 0 ? { ok: false, issues } : { ok: true, dict };
  }
  return { ok: false, issues: [`${path}_unsupported_shape`] };
};

/**
 * Convert empty arrays in dictionary slots to empty dictionaries. This is the
 * bounded legacy-type allowance from the freeze; non-empty incompatible data
 * stays as-is and is rejected by structural validation.
 */
const normalizeEmptyCollectionSlots = (global, maps) => {
  const normalizeRecord = (record) => {
    if (!isPlainRecord(record)) {return record;}
    const output = { ...record };
    for (const field of [...STRUCTURAL_ENTITY_FIELDS, ...STRUCTURAL_RECORD_FIELDS]) {
      if (Array.isArray(output[field]) && output[field].length === 0) {output[field] = {};}
    }
    return output;
  };
  const nextGlobal = normalizeRecord(global);
  const nextMaps = {};
  for (const mapId of Object.keys(maps)) {nextMaps[mapId] = normalizeRecord(maps[mapId]);}
  return { global: nextGlobal, maps: nextMaps };
};

/**
 * Validate known structural boundaries of a decoded snapshot. Returns an
 * error string or null. Unknown fields remain allowed; malformed known
 * collections are never silently coerced to empty.
 */
const validateStructuralSnapshot = (global, maps) => {
  if (!isPlainRecord(global)) {return 'global_not_record';}
  if (global.maps !== undefined) {return 'global_contains_maps';}
  for (const field of STRUCTURAL_ENTITY_FIELDS) {
    if (global[field] !== undefined) {return `global_contains_${field}`;}
  }
  if (global.defaultMapId !== undefined && global.defaultMapId !== null && typeof global.defaultMapId !== 'string') {
    return 'global_default_map_invalid';
  }
  if (global.combat !== undefined && global.combat !== null) {
    if (!isPlainRecord(global.combat)) {return 'global_combat_not_record';}
    const combat = global.combat;
    if (combat.isActive !== undefined && typeof combat.isActive !== 'boolean') {return 'combat_is_active_invalid';}
    if (combat.turnOrder !== undefined && !Array.isArray(combat.turnOrder)) {return 'combat_turn_order_invalid';}
    if (combat.currentTurnIndex !== undefined && combat.currentTurnIndex !== null && !Number.isInteger(combat.currentTurnIndex)) {
      return 'combat_current_turn_index_invalid';
    }
    if (combat.currentTurn !== undefined && combat.currentTurn !== null && !Number.isInteger(combat.currentTurn)) {
      return 'combat_current_turn_invalid';
    }
    if (combat.round !== undefined && !Number.isFinite(combat.round)) {return 'combat_round_invalid';}
  }
  if (global.playerMapAssignments !== undefined && !isPlainRecord(global.playerMapAssignments)) {
    return 'global_player_map_assignments_invalid';
  }
  for (const mapId of Object.keys(maps)) {
    const record = maps[mapId];
    if (!isPlainRecord(record)) {return `map_not_record:${mapId}`;}
    for (const field of STRUCTURAL_ENTITY_FIELDS) {
      if (record[field] !== undefined && !isPlainRecord(record[field])) {return `map_${field}_not_record:${mapId}`;}
    }
    for (const field of STRUCTURAL_ARRAY_FIELDS) {
      if (record[field] !== undefined && !Array.isArray(record[field])) {return `map_${field}_not_array:${mapId}`;}
    }
    for (const field of STRUCTURAL_RECORD_FIELDS) {
      if (record[field] !== undefined && !isPlainRecord(record[field])) {return `map_${field}_not_record:${mapId}`;}
    }
  }
  return null;
};

/**
 * Split a canonical gameState shape (maps dictionary + flat global fields)
 * into the checkpoint sections. Root entity mirrors are excluded from the
 * durable global payload and returned for divergence checks.
 */
const splitCanonicalGameState = (gameState) => {
  const mapsInput = isPlainRecord(gameState.maps) ? gameState.maps : {};
  const maps = {};
  const mapIds = Object.keys(mapsInput).sort();

  for (const mapId of mapIds) {
    const idError = validateMapId(mapId);
    if (idError) {return invalid(`${idError}:${mapId}`);}
    const record = mapsInput[mapId];
    if (!isPlainRecord(record)) {return invalid(`map_not_record:${mapId}`);}
    const copy = { ...record };
    if (copy.id === undefined || copy.id === null) {copy.id = mapId;}
    else if (copy.id !== mapId) {return invalid(`map_id_mismatch:${mapId}`);}
    maps[mapId] = copy;
  }

  const global = omitKeys(gameState, ['maps', ...ROOT_ENTITY_MIRRORS]);

  if (mapIds.length === 0) {
    global.defaultMapId = null;
  } else {
    const currentDefault = global.defaultMapId;
    if (currentDefault !== undefined && currentDefault !== null && !Object.prototype.hasOwnProperty.call(maps, currentDefault)) {
      return invalid(`default_map_missing:${currentDefault}`);
    }
    if (currentDefault === undefined || currentDefault === null) {global.defaultMapId = mapIds[0];}
  }

  const mirrors = deriveRootMirrors(maps);
  return { ok: true, global, maps, mapIds, mirrors };
};

/**
 * Build the canonical checkpoint documents for a live accepted gameState.
 */
const buildCheckpointDocuments = ({ roomId, gameState, revision, roomMetadata = null, projectId = null, existingRoot = null, explicitConversion = false, provenance = null, serverTimestamp = () => ({ __serverTimestamp: true }), deleteField = () => ({ __deleteField: true }) }) => {
  if (!Number.isSafeInteger(revision) || revision <= 0) {return invalid('checkpoint_revision_required');}
  if (typeof roomId !== 'string' || roomId.length === 0) {return invalid('room_id_required');}

  const canonicalGameState = canonicalize(gameState, 'gameState');
  if (canonicalGameState.error) {return invalid(canonicalGameState.error);}

  const split = splitCanonicalGameState(canonicalGameState.value);
  if (!split.ok) {return split;}
  if (split.mirrors.collisions.length > 0) {
    const first = split.mirrors.collisions[0];
    return invalid(`duplicate_entity_id:${first.field}:${first.entityId}`);
  }

  const normalizedSections = normalizeEmptyCollectionSlots(split.global, split.maps);
  split.global = normalizedSections.global;
  split.maps = normalizedSections.maps;
  const structuralError = validateStructuralSnapshot(split.global, split.maps);
  if (structuralError) {return invalid(structuralError);}

  const globalCanonical = canonicalize(split.global, 'global');
  if (globalCanonical.error) {return invalid(globalCanonical.error);}
  const globalJson = stableStringify(globalCanonical.value);

  const mapJsons = {};
  for (const mapId of split.mapIds) {
    const mapCanonical = canonicalize(split.maps[mapId], `maps.${mapId}`);
    if (mapCanonical.error) {return invalid(mapCanonical.error);}
    mapJsons[mapId] = stableStringify(mapCanonical.value);
    if (utf8Bytes(mapJsons[mapId]) > FIELD_VALUE_BYTES) {
      return { ok: false, code: 'CHECKPOINT_TOO_LARGE', reason: `field_value_limit:${mapId}` };
    }
  }
  if (utf8Bytes(globalJson) > FIELD_VALUE_BYTES) {
    return { ok: false, code: 'CHECKPOINT_TOO_LARGE', reason: 'field_value_limit:global' };
  }

  const contentHash = sha256Hex(stableStringify([
    CHECKPOINT_SCHEMA_VERSION,
    globalJson,
    split.mapIds.map((mapId) => [mapId, mapJsons[mapId]])
  ]));

  const manifest = {
    schemaVersion: CHECKPOINT_SCHEMA_VERSION,
    revision,
    mapIds: split.mapIds,
    committed: true,
    committedAt: serverTimestamp(),
    contentHash,
    provenance: normalizeProvenance(provenance)
  };

  const timestamp = serverTimestamp();
  const rootPatch = {
    checkpoint: manifest,
    isSplitStorage: true,
    lastModified: timestamp,
    lastActivity: timestamp
  };

  let capturedMetadata = null;
  if (roomMetadata && typeof roomMetadata === 'object') {
    const metadataCanonical = canonicalize({
      name: roomMetadata.name,
      description: roomMetadata.description ?? null,
      settings: roomMetadata.settings ?? null
    }, 'roomMetadata');
    if (metadataCanonical.error) {return invalid(metadataCanonical.error);}
    capturedMetadata = metadataCanonical.value;
    if (typeof capturedMetadata.name === 'string') {rootPatch.name = capturedMetadata.name;}
    if (capturedMetadata.description !== null) {rootPatch.description = capturedMetadata.description;}
    if (capturedMetadata.settings !== null) {rootPatch.settings = capturedMetadata.settings;}
  }

  if (explicitConversion) {
    rootPatch.gameState = deleteField();
  }

  const globalDocName = `projects/${projectId || 'unknown'}/databases/(default)/documents/rooms/${roomId}/gameState/current`;
  const globalDoc = {
    schemaVersion: CHECKPOINT_SCHEMA_VERSION,
    checkpointRevision: revision,
    snapshotJson: globalJson
  };

  const mapDocs = split.mapIds.map((mapId) => ({
    mapId,
    name: `projects/${projectId || 'unknown'}/databases/(default)/documents/rooms/${roomId}/gameState/${mapId}`,
    data: {
      schemaVersion: CHECKPOINT_SCHEMA_VERSION,
      checkpointRevision: revision,
      mapId,
      snapshotJson: mapJsons[mapId]
    }
  }));

  const rootName = `projects/${projectId || 'unknown'}/databases/(default)/documents/rooms/${roomId}`;
  const rootCreateBase = {
    ...rootPatch,
    id: roomId,
    createdAt: serverTimestamp(),
    isActive: true,
    players: {},
    members: []
  };
  // Construct the complete prospective root BEFORE estimation so no field can
  // be added after preflight.
  const prospectiveRoot = existingRoot && isPlainRecord(existingRoot)
    ? { ...existingRoot, ...rootPatch }
    : rootCreateBase;

  const estimates = {
    root: estimateDocumentBytes(rootName, prospectiveRoot, timestamp),
    global: estimateDocumentBytes(globalDocName, globalDoc),
    maps: {}
  };
  for (const doc of mapDocs) {
    estimates.maps[doc.mapId] = estimateDocumentBytes(doc.name, doc.data);
  }

  const operations = split.mapIds.length + 2;
  if (operations > CHECKPOINT_LIMITS.MAX_OPERATIONS) {
    return { ok: false, code: 'CHECKPOINT_TOO_LARGE', reason: `operation_limit:${operations}` };
  }

  const rootEstimate = estimates.root;
  if (rootEstimate > CHECKPOINT_LIMITS.MAX_DOCUMENT_BYTES) {
    return { ok: false, code: 'CHECKPOINT_TOO_LARGE', reason: 'document_limit:root' };
  }
  if (estimates.global > CHECKPOINT_LIMITS.MAX_DOCUMENT_BYTES) {
    return { ok: false, code: 'CHECKPOINT_TOO_LARGE', reason: 'document_limit:global' };
  }
  for (const mapId of split.mapIds) {
    if (estimates.maps[mapId] > CHECKPOINT_LIMITS.MAX_DOCUMENT_BYTES) {
      return { ok: false, code: 'CHECKPOINT_TOO_LARGE', reason: `document_limit:${mapId}` };
    }
  }

  const requestEstimate = rootEstimate + utf8Bytes(rootName) + 1024
    + estimates.global + utf8Bytes(globalDocName) + 1024
    + split.mapIds.reduce((total, mapId) => {
      const doc = mapDocs.find((entry) => entry.mapId === mapId);
      return total + estimates.maps[mapId] + utf8Bytes(doc.name) + 1024;
    }, 0);

  if (requestEstimate > CHECKPOINT_LIMITS.MAX_REQUEST_BYTES) {
    return { ok: false, code: 'CHECKPOINT_TOO_LARGE', reason: `request_limit:${requestEstimate}` };
  }

  return {
    ok: true,
    revision,
    mapIds: split.mapIds,
    contentHash,
    manifest,
    capturedMetadata,
    rootPatch,
    rootCreateBase,
    global: { name: globalDocName, data: globalDoc },
    maps: mapDocs,
    operations,
    estimates,
    requestEstimate
  };
};

const countNodes = (value) => {
  if (value === null || typeof value !== 'object') {return 1;}
  if (Array.isArray(value)) {
    let total = 1;
    for (const item of value) {total += 1 + countNodes(item);}
    return total;
  }
  let total = 1;
  for (const key of Object.keys(value)) {
    total += 1 + countNodes(value[key]);
  }
  return total;
};

const estimateDocumentBytes = (documentName, document, timestampPlaceholder = null) => {
  const serialized = JSON.stringify(document, (key, value) => {
    if (timestampPlaceholder && value && typeof value === 'object' && value.__serverTimestamp) {
      return timestampPlaceholder;
    }
    return value;
  });
  return utf8Bytes(serialized) + utf8Bytes(documentName) + 32 * countNodes(document) + 4096;
};

const metadataFingerprint = (source) => {
  if (!isPlainRecord(source)) {return null;}
  const canonical = canonicalize({
    name: typeof source.name === 'string' ? source.name : null,
    description: source.description ?? source.settings?.description ?? null,
    settings: source.settings ?? null
  }, 'metadata');
  if (canonical.error) {return null;}
  return sha256Hex(stableStringify(canonical.value));
};

/**
 * Decode and validate a canonical manifest/fragment set inside an in-memory
 * coherent read. Returns { ok, global, maps, mapIds, manifest } or { ok:false, code, reason }.
 */
const decodeCanonicalCheckpoint = ({ checkpoint, globalDoc, mapDocsById }) => {
  if (!isPlainRecord(checkpoint)) {return { ok: false, code: 'INCOMPLETE_CHECKPOINT', reason: 'manifest_missing' };}

  const schemaVersion = Number(checkpoint.schemaVersion);
  if (schemaVersion > CHECKPOINT_SCHEMA_VERSION || !Number.isFinite(schemaVersion)) {
    return { ok: false, code: 'UNKNOWN_NEWER_VERSION', reason: `manifest_schema:${checkpoint.schemaVersion}` };
  }
  if (schemaVersion !== CHECKPOINT_SCHEMA_VERSION) {
    return { ok: false, code: 'UNKNOWN_NEWER_VERSION', reason: `manifest_schema:${checkpoint.schemaVersion}` };
  }
  if (checkpoint.committed !== true) {return { ok: false, code: 'INCOMPLETE_CHECKPOINT', reason: 'manifest_not_committed' };}

  const revision = Number(checkpoint.revision);
  if (!Number.isSafeInteger(revision) || revision <= 0) {
    return { ok: false, code: 'INCOMPLETE_CHECKPOINT', reason: 'manifest_revision_invalid' };
  }
  if (!Array.isArray(checkpoint.mapIds)) {
    return { ok: false, code: 'INCOMPLETE_CHECKPOINT', reason: 'manifest_map_ids_missing' };
  }
  const mapIds = [...checkpoint.mapIds];
  for (let index = 0; index < mapIds.length; index += 1) {
    const mapId = mapIds[index];
    if (validateMapId(mapId)) {return { ok: false, code: 'INCOMPLETE_CHECKPOINT', reason: `manifest_map_id_invalid:${mapId}` };}
    if (index > 0 && !(String(mapIds[index - 1]) < String(mapId))) {
      return { ok: false, code: 'INCOMPLETE_CHECKPOINT', reason: `manifest_map_ids_unsorted:${mapId}` };
    }
  }
  if (typeof checkpoint.contentHash !== 'string' || !/^[0-9a-f]{64}$/.test(checkpoint.contentHash)) {
    return { ok: false, code: 'INCOMPLETE_CHECKPOINT', reason: 'manifest_hash_invalid' };
  }

  if (!isPlainRecord(globalDoc)) {return { ok: false, code: 'INCOMPLETE_CHECKPOINT', reason: 'global_missing' };}
  if (Number(globalDoc.schemaVersion) > CHECKPOINT_SCHEMA_VERSION) {
    return { ok: false, code: 'UNKNOWN_NEWER_VERSION', reason: 'global_schema' };
  }
  if (Number(globalDoc.schemaVersion) !== CHECKPOINT_SCHEMA_VERSION || Number(globalDoc.checkpointRevision) !== revision) {
    return { ok: false, code: 'INCOMPLETE_CHECKPOINT', reason: 'global_revision_mismatch' };
  }
  if (typeof globalDoc.snapshotJson !== 'string') {
    return { ok: false, code: 'INCOMPLETE_CHECKPOINT', reason: 'global_payload_missing' };
  }

  let global;
  try { global = JSON.parse(globalDoc.snapshotJson); } catch (error) {
    return { ok: false, code: 'INCOMPLETE_CHECKPOINT', reason: 'global_payload_malformed' };
  }
  if (!isPlainRecord(global)) {return { ok: false, code: 'INCOMPLETE_CHECKPOINT', reason: 'global_payload_not_record' };}
  if (global.maps !== undefined || ROOT_ENTITY_MIRRORS.some((field) => global[field] !== undefined)) {
    return { ok: false, code: 'INCOMPLETE_CHECKPOINT', reason: 'global_payload_has_authoritative_collections' };
  }

  const maps = {};
  const mapJsons = {};
  for (const mapId of mapIds) {
    const doc = mapDocsById[mapId];
    if (!isPlainRecord(doc)) {return { ok: false, code: 'INCOMPLETE_CHECKPOINT', reason: `map_fragment_missing:${mapId}` };}
    if (Number(doc.schemaVersion) > CHECKPOINT_SCHEMA_VERSION) {
      return { ok: false, code: 'UNKNOWN_NEWER_VERSION', reason: `map_schema:${mapId}` };
    }
    if (Number(doc.schemaVersion) !== CHECKPOINT_SCHEMA_VERSION || Number(doc.checkpointRevision) !== revision) {
      return { ok: false, code: 'INCOMPLETE_CHECKPOINT', reason: `map_revision_mismatch:${mapId}` };
    }
    if (doc.mapId !== mapId) {return { ok: false, code: 'INCOMPLETE_CHECKPOINT', reason: `map_id_mismatch:${mapId}` };}
    if (typeof doc.snapshotJson !== 'string') {return { ok: false, code: 'INCOMPLETE_CHECKPOINT', reason: `map_payload_missing:${mapId}` };}
    let mapRecord;
    try { mapRecord = JSON.parse(doc.snapshotJson); } catch (error) {
      return { ok: false, code: 'INCOMPLETE_CHECKPOINT', reason: `map_payload_malformed:${mapId}` };
    }
    if (!isPlainRecord(mapRecord)) {return { ok: false, code: 'INCOMPLETE_CHECKPOINT', reason: `map_payload_not_record:${mapId}` };}
    if (mapRecord.id !== mapId) {return { ok: false, code: 'INCOMPLETE_CHECKPOINT', reason: `map_payload_id_mismatch:${mapId}` };}
    maps[mapId] = mapRecord;
    mapJsons[mapId] = doc.snapshotJson;
  }

  if (mapIds.length === 0) {
    if (global.defaultMapId !== null && global.defaultMapId !== undefined) {
      return { ok: false, code: 'INCOMPLETE_CHECKPOINT', reason: 'default_map_on_empty_set' };
    }
  } else {
    const defaultMapId = global.defaultMapId;
    if (defaultMapId !== null && defaultMapId !== undefined && !Object.prototype.hasOwnProperty.call(maps, defaultMapId)) {
      return { ok: false, code: 'INCOMPLETE_CHECKPOINT', reason: `default_map_missing:${defaultMapId}` };
    }
  }

  const structuralError = validateStructuralSnapshot(global, maps);
  if (structuralError) {
    return { ok: false, code: 'INCOMPLETE_CHECKPOINT', reason: `structural_invalid:${structuralError}` };
  }

  const contentHash = sha256Hex(stableStringify([
    CHECKPOINT_SCHEMA_VERSION,
    globalDoc.snapshotJson,
    mapIds.map((mapId) => [mapId, mapJsons[mapId]])
  ]));
  if (contentHash !== checkpoint.contentHash) {
    return { ok: false, code: 'INCOMPLETE_CHECKPOINT', reason: 'content_hash_mismatch' };
  }

  return { ok: true, global, maps, mapIds, manifest: checkpoint };
};

const adaptInlineWithMaps = (gameState) => {
  const canonical = canonicalize(gameState, 'legacyInline');
  if (canonical.error) {return { ok: false, issues: [canonical.error] };}

  const split = splitCanonicalGameState(canonical.value);
  if (!split.ok) {return { ok: false, issues: [split.reason] };}

  const issues = [];
  const mirrors = { tokens: {}, characterTokens: {}, gridItems: {} };
  const ownerByField = { tokens: {}, characterTokens: {}, gridItems: {} };

  for (const mapId of split.mapIds) {
    for (const field of STRUCTURAL_ENTITY_FIELDS) {
      const converted = toEntityDictionary(split.maps[mapId][field], `maps.${mapId}.${field}`);
      if (!converted.ok) {issues.push(...converted.issues); continue;}
      split.maps[mapId][field] = converted.dict;
    }
  }

  for (const mapId of split.mapIds) {
    for (const field of ROOT_ENTITY_MIRRORS) {
      const collection = isPlainRecord(split.maps[mapId][field]) ? split.maps[mapId][field] : {};
      for (const entityId of Object.keys(collection)) {
        ownerByField[field][entityId] = mapId;
      }
    }
  }

  for (const field of ROOT_ENTITY_MIRRORS) {
    const rootCollection = isPlainRecord(canonical.value[field]) ? canonical.value[field] : {};
    for (const entityId of Object.keys(rootCollection)) {
      const entry = rootCollection[entityId];
      const owner = ownerByField[field][entityId];
      if (!owner) {
        issues.push(`legacy_only_entity:${field}:${entityId}`);
        mirrors[field][entityId] = entry;
        continue;
      }
      const mapEntry = split.maps[owner][field]?.[entityId];
      if (isPlainRecord(entry) && entry.mapId !== undefined && entry.mapId !== owner) {
        issues.push(`legacy_scope_conflict:${field}:${entityId}`);
        continue;
      }
      const entryCanonical = canonicalize(entry, `${field}.${entityId}`);
      const mapEntryCanonical = canonicalize(mapEntry, `maps.${owner}.${field}.${entityId}`);
      if (!entryCanonical.error && !mapEntryCanonical.error &&
        stableStringify(entryCanonical.value) !== stableStringify(mapEntryCanonical.value)) {
        issues.push(`legacy_mirror_divergence:${field}:${entityId}`);
      }
    }
  }

  return {
    ok: true,
    complete: issues.length === 0,
    issues,
    global: split.global,
    maps: split.maps,
    mapIds: split.mapIds,
    adaptedFrom: 'inline-maps'
  };
};

const adaptRootOnlyInline = (gameState) => {
  const canonical = canonicalize(gameState, 'legacyRootOnly');
  if (canonical.error) {return { ok: false, issues: [canonical.error] };}

  const gs = canonical.value;
  const issues = [];
  const levelEditor = isPlainRecord(gs.levelEditor) ? gs.levelEditor : {};
  const mapData = isPlainRecord(gs.mapData) ? gs.mapData : {};

  const mapId = (typeof gs.defaultMapId === 'string' && gs.defaultMapId.length > 0) ? gs.defaultMapId : 'default';
  const mapIdError = validateMapId(mapId);
  if (mapIdError) {return { ok: false, issues: [`${mapIdError}:${mapId}`] };}

  const tokens = toEntityDictionary(gs.tokens, 'tokens');
  const characterTokens = toEntityDictionary(gs.characterTokens, 'characterTokens');
  const gridItemsDirect = toEntityDictionary(gs.gridItems, 'gridItems');
  const droppedItems = toEntityDictionary(gs.inventory ? gs.inventory.droppedItems : undefined, 'inventory.droppedItems');
  if (!tokens.ok) {issues.push(...tokens.issues);}
  if (!characterTokens.ok) {issues.push(...characterTokens.issues);}
  if (!gridItemsDirect.ok) {issues.push(...gridItemsDirect.issues);}
  if (!droppedItems.ok) {issues.push(...droppedItems.issues);}

  const directCount = gridItemsDirect.ok ? Object.keys(gridItemsDirect.dict).length : 0;
  const droppedCount = droppedItems.ok ? Object.keys(droppedItems.dict).length : 0;
  let gridItems = {};
  if (directCount > 0 && droppedCount > 0) {
    const directCanonical = canonicalize(gridItemsDirect.dict, 'gridItems');
    const droppedCanonical = canonicalize(droppedItems.dict, 'inventory.droppedItems');
    if (!directCanonical.error && !droppedCanonical.error &&
      stableStringify(directCanonical.value) === stableStringify(droppedCanonical.value)) {
      gridItems = directCanonical.value;
    } else {
      issues.push('legacy_grid_items_conflict');
      gridItems = gridItemsDirect.dict;
    }
  } else if (droppedCount > 0) {
    // An empty direct collection must not mask a valuable legacy droppedItems candidate.
    gridItems = droppedItems.dict;
  } else if (directCount > 0) {
    gridItems = gridItemsDirect.dict;
  }

  const map = {
    id: mapId,
    name: mapId === 'default' ? 'Default Map' : mapId,
    tokens: tokens.ok ? tokens.dict : {},
    characterTokens: characterTokens.ok ? characterTokens.dict : {},
    gridItems
  };

  for (const field of LEGACY_ROOT_ONLY_MAP_FIELDS) {
    if (levelEditor[field] !== undefined) {map[field] = levelEditor[field];}
  }
  if (map.fogOfWarData === undefined && gs.fogOfWar !== undefined) {map.fogOfWarData = gs.fogOfWar;}
  for (const field of LEGACY_MAP_DATA_FIELDS) {
    if (map[field] === undefined && mapData[field] !== undefined) {map[field] = mapData[field];}
  }
  if (map.gridSettings === undefined && isPlainRecord(gs.gridSettings)) {map.gridSettings = gs.gridSettings;}

  const global = omitKeys(gs, ['maps', ...ROOT_ENTITY_MIRRORS, 'inventory', 'levelEditor', 'fogOfWar']);
  if (isPlainRecord(gs.inventory)) {
    const remainingInventory = omitKeys(gs.inventory, ['droppedItems']);
    if (Object.keys(remainingInventory).length > 0) {global.inventory = remainingInventory;}
  }
  global.defaultMapId = mapId;

  return {
    ok: true,
    complete: issues.length === 0,
    issues,
    global,
    maps: { [mapId]: map },
    mapIds: [mapId],
    adaptedFrom: 'root-only'
  };
};

const adaptInlineCandidate = (gameState) => {
  if (!isPlainRecord(gameState)) {return { ok: false, issues: ['inline_not_record'] };}
  const canonical = canonicalize(gameState, 'legacyInline');
  if (canonical.error) {return { ok: false, issues: [canonical.error] };}
  if (isPlainRecord(canonical.value.maps)) {
    return adaptInlineWithMaps(canonical.value);
  }
  return adaptRootOnlyInline(canonical.value);
};

const adaptSplitCandidate = (currentDoc, mapDocs) => {
  const issues = [];
  if (!isPlainRecord(currentDoc)) {return { ok: false, issues: ['split_current_not_record'] };}
  const currentCanonical = canonicalize(currentDoc, 'legacySplitCurrent');
  if (currentCanonical.error) {return { ok: false, issues: [currentCanonical.error] };}

  const current = omitKeys(currentCanonical.value, ['lastUpdated']);
  const rawMaps = {};
  for (const doc of mapDocs) {
    const mapId = doc.id;
    const idError = validateMapId(mapId);
    if (idError) {issues.push(`${idError}:${mapId}`); continue;}
    if (!isPlainRecord(doc.data)) {issues.push(`map_not_record:${mapId}`); continue;}
    const canonicalMap = canonicalize(doc.data, `maps.${mapId}`);
    if (canonicalMap.error) {issues.push(canonicalMap.error); continue;}
    const record = { ...canonicalMap.value };
    if (record.id === undefined || record.id === null) {record.id = mapId;}
    else if (record.id !== mapId) {issues.push(`map_id_mismatch:${mapId}`); continue;}
    for (const field of STRUCTURAL_ENTITY_FIELDS) {
      const converted = toEntityDictionary(record[field], `maps.${mapId}.${field}`);
      if (!converted.ok) {issues.push(...converted.issues); continue;}
      record[field] = converted.dict;
    }
    rawMaps[mapId] = record;
  }
  const mapIds = Object.keys(rawMaps).sort();

  if (mapIds.length === 0) {
    issues.push('split_no_map_fragments');
  }

  const gameStateShape = { ...current, maps: rawMaps };
  const split = splitCanonicalGameState(gameStateShape);
  if (!split.ok) {issues.push(split.reason);}

  const ownerByField = { tokens: {}, characterTokens: {}, gridItems: {} };
  for (const mapId of mapIds) {
    for (const field of ROOT_ENTITY_MIRRORS) {
      const collection = isPlainRecord(rawMaps[mapId][field]) ? rawMaps[mapId][field] : {};
      for (const entityId of Object.keys(collection)) {ownerByField[field][entityId] = mapId;}
    }
  }
  for (const field of ROOT_ENTITY_MIRRORS) {
    const rootCollection = isPlainRecord(current[field]) ? current[field] : {};
    for (const entityId of Object.keys(rootCollection)) {
      const entry = rootCollection[entityId];
      const owner = ownerByField[field][entityId];
      if (!owner) {
        issues.push(`legacy_only_entity:${field}:${entityId}`);
        continue;
      }
      if (isPlainRecord(entry) && entry.mapId !== undefined && entry.mapId !== owner) {
        issues.push(`legacy_scope_conflict:${field}:${entityId}`);
        continue;
      }
      const entryCanonical = canonicalize(entry, `${field}.${entityId}`);
      const mapEntryCanonical = canonicalize(rawMaps[owner][field]?.[entityId], `maps.${owner}.${field}.${entityId}`);
      if (!entryCanonical.error && !mapEntryCanonical.error &&
        stableStringify(entryCanonical.value) !== stableStringify(mapEntryCanonical.value)) {
        issues.push(`legacy_mirror_divergence:${field}:${entityId}`);
      }
    }
  }

  const assignments = current.playerMapAssignments;
  if (isPlainRecord(assignments)) {
    for (const [playerId, assignedMapId] of Object.entries(assignments)) {
      if (assignedMapId !== null && assignedMapId !== undefined && !rawMaps[assignedMapId]) {
        issues.push(`legacy_assignment_missing_map:${playerId}`);
      }
    }
  }
  const defaultMapId = current.defaultMapId;
  if (mapIds.length > 0 && defaultMapId !== undefined && defaultMapId !== null && !rawMaps[defaultMapId]) {
    issues.push(`legacy_default_map_missing:${defaultMapId}`);
  }

  const global = split.ok ? split.global : omitKeys(current, [...ROOT_ENTITY_MIRRORS]);
  if (mapIds.length === 0) {global.defaultMapId = null;}
  else if (global.defaultMapId === undefined || global.defaultMapId === null) {global.defaultMapId = mapIds[0];}

  return {
    ok: split.ok,
    complete: split.ok && issues.length === 0,
    issues,
    global,
    maps: rawMaps,
    mapIds,
    adaptedFrom: 'split'
  };
};

const candidateHash = (candidate) => {
  if (!candidate || !candidate.ok) {return null;}
  return canonicalHash({ global: candidate.global, maps: candidate.maps, mapIds: candidate.mapIds });
};

const snapshotsEquivalent = (candidateA, candidateB) => {
  const hashA = candidateHash(candidateA);
  const hashB = candidateHash(candidateB);
  return !!hashA && hashA === hashB;
};

const selectionMatches = (selection, hashes) => {
  if (!isPlainRecord(selection) || !isPlainRecord(selection.candidateHashes)) {return false;}
  if (selection.selectedCandidateId !== 'inline' && selection.selectedCandidateId !== 'split') {return false;}
  const inlineHash = selection.candidateHashes.inline;
  const splitHash = selection.candidateHashes.split;
  return inlineHash === hashes.inline && splitHash === hashes.split;
};

/**
 * Deterministic classification over a coherent in-memory read.
 * Inputs are Firestore-shaped doubles: root {exists, data, updateTime} and
 * gameStateDocs [{id, data, updateTime}].
 */
const classifyRoomDocuments = ({ roomId, root, gameStateDocs = [], includeRaw = false }) => {
  const base = {
    roomId,
    readOnly: true,
    diagnostics: [],
    checkpoint: null,
    revision: null,
    selectedCandidateId: null,
    selectedSnapshot: null,
    migrationRequired: false,
    roomMetadata: null,
    candidates: { inline: null, split: null },
    selection: null
  };

  const rootExists = !!(root && root.exists);
  const rootData = rootExists && isPlainRecord(root.data) ? root.data : null;

  if (!rootExists && gameStateDocs.length === 0) {
    return { ...base, kind: 'ABSENT_ROOM' };
  }

  const docsById = {};
  for (const doc of gameStateDocs) {docsById[doc.id] = doc.data;}

  if (!rootExists) {
    return {
      ...base,
      kind: 'PARTIAL_SPLIT',
      diagnostics: [{ code: 'ORPHANED_FRAGMENTS', message: 'gameState documents exist without a root room document' }],
      candidates: { inline: null, split: { exists: true, complete: false, issues: ['root_missing'] } }
    };
  }

  const rootRecord = canonicalize(rootData, 'root');
  const roomData = rootRecord.error ? rootData : rootRecord.value;

  const roomMetadata = {
    name: typeof roomData.name === 'string' ? roomData.name : null,
    description: roomData.description ?? roomData.settings?.description ?? null,
    settings: isPlainRecord(roomData.settings) ? roomData.settings : null,
    gmId: roomData.gmId ?? null,
    members: Array.isArray(roomData.members) ? roomData.members : [],
    // Project 4 additive access metadata: stored password policy and bans must
    // survive server restart/reconstruction. Selection semantics unchanged.
    passwordHash: typeof roomData.passwordHash === 'string' ? roomData.passwordHash : null,
    bannedUsers: Array.isArray(roomData.bannedUsers) ? roomData.bannedUsers : [],
    isPermanent: roomData.isPermanent === true,
    persistentRoomId: roomData.persistentRoomId ?? null
  };

  if (includeRaw) {
    base.rawDocuments = { root: rootData, gameState: docsById };
  }

  const checkpoint = roomData.checkpoint;
  const hasCheckpointField = Object.prototype.hasOwnProperty.call(roomData, 'checkpoint');

  const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  const inlineGameState = hasOwn(roomData, 'gameState') ? roomData.gameState : null;
  const currentDoc = hasOwn(docsById, 'current') ? docsById.current : null;
  const mapDocEntries = Object.entries(docsById).filter(([id]) => id !== 'current');
  const hasMapDocuments = mapDocEntries.length > 0;
  const hasSplitEvidence = currentDoc !== null || hasMapDocuments;

  // A committed manifest is the only versioned checkpoint authority. Only its
  // declared fragments participate; undeclared stale documents are ignored.
  if (isPlainRecord(checkpoint)) {
    const manifestVersion = Number(checkpoint.schemaVersion);
    if (!Number.isFinite(manifestVersion) || manifestVersion > CHECKPOINT_SCHEMA_VERSION) {
      return {
        ...base,
        kind: 'UNKNOWN_NEWER_VERSION',
        roomMetadata,
        diagnostics: [{ code: 'MANIFEST_SCHEMA_UNSUPPORTED', message: `checkpoint schema ${checkpoint.schemaVersion} is newer than supported ${CHECKPOINT_SCHEMA_VERSION}` }],
        checkpoint
      };
    }
    const decoded = decodeCanonicalCheckpoint({ checkpoint, globalDoc: currentDoc, mapDocsById: Object.fromEntries(mapDocEntries) });
    if (decoded.ok) {
      return {
        ...base,
        kind: 'CANONICAL_COMPLETE_CHECKPOINT',
        roomMetadata,
        checkpoint: decoded.manifest,
        revision: Number(decoded.manifest.revision),
        selectedCandidateId: 'canonical',
        selectedSnapshot: { global: decoded.global, maps: decoded.maps, mapIds: decoded.mapIds }
      };
    }
    return {
      ...base,
      kind: decoded.code === 'UNKNOWN_NEWER_VERSION' ? 'UNKNOWN_NEWER_VERSION' : 'INCOMPLETE_CHECKPOINT',
      roomMetadata,
      checkpoint,
      revision: Number.isSafeInteger(Number(checkpoint.revision)) ? Number(checkpoint.revision) : null,
      diagnostics: [{ code: decoded.code, message: decoded.reason }]
    };
  }

  // Versioned fragment evidence without a manifest is an incomplete
  // checkpoint, not legacy split data.
  const versionedEnvelopeDocs = [currentDoc, ...mapDocEntries.map(([, data]) => data)]
    .filter((doc) => isPlainRecord(doc))
    .filter((doc) => Number.isFinite(Number(doc.schemaVersion)) ||
      Number.isFinite(Number(doc.checkpointRevision)) ||
      typeof doc.snapshotJson === 'string');
  if (versionedEnvelopeDocs.length > 0) {
    const fragmentVersions = versionedEnvelopeDocs
      .map((doc) => Number(doc.schemaVersion))
      .filter((version) => Number.isFinite(version));
    const newestFragmentVersion = fragmentVersions.length > 0 ? Math.max(...fragmentVersions) : 0;
    if (newestFragmentVersion > CHECKPOINT_SCHEMA_VERSION) {
      return {
        ...base,
        kind: 'UNKNOWN_NEWER_VERSION',
        roomMetadata,
        diagnostics: [{ code: 'FRAGMENT_SCHEMA_UNSUPPORTED', message: `fragment schema ${newestFragmentVersion} is newer than supported ${CHECKPOINT_SCHEMA_VERSION}` }]
      };
    }
    return {
      ...base,
      kind: 'INCOMPLETE_CHECKPOINT',
      roomMetadata,
      diagnostics: [{ code: 'VERSIONED_FRAGMENT_WITHOUT_MANIFEST', message: 'checkpoint fragments exist without a valid committed manifest' }]
    };
  }

  const inlineCandidate = isPlainRecord(inlineGameState) ? adaptInlineCandidate(inlineGameState) : null;
  const hasInlineCandidate = inlineCandidate !== null;

  const splitCandidate = currentDoc
    ? adaptSplitCandidate(currentDoc, mapDocEntries.map(([id, data]) => ({ id, data })))
    : null;
  const hasSplitCandidate = splitCandidate !== null;

  const candidates = {
    inline: hasInlineCandidate
      ? {
        exists: true,
        complete: inlineCandidate.complete === true,
        issues: inlineCandidate.issues || [],
        hash: candidateHash(inlineCandidate),
        raw: includeRaw ? inlineGameState : undefined,
        adapted: inlineCandidate.complete ? { global: inlineCandidate.global, maps: inlineCandidate.maps, mapIds: inlineCandidate.mapIds } : undefined
      }
      : null,
    split: hasSplitCandidate
      ? {
        exists: true,
        complete: splitCandidate.complete === true,
        issues: splitCandidate.issues || [],
        hash: candidateHash(splitCandidate),
        raw: includeRaw ? { current: currentDoc, maps: Object.fromEntries(mapDocEntries) } : undefined
      }
      : null
  };

  const baseWithCandidates = { ...base, roomMetadata, candidates, diagnostics: [...base.diagnostics] };
  if (hasMapDocuments && !hasSplitCandidate) {
    baseWithCandidates.diagnostics.push({
      code: 'ORPHANED_MAP_FRAGMENTS',
      message: 'map fragments exist without a current global fragment or committed manifest'
    });
  }

  if (!hasInlineCandidate && !hasSplitCandidate) {
    if (hasSplitEvidence) {
      return {
        ...baseWithCandidates,
        kind: 'PARTIAL_SPLIT',
        migrationRequired: true,
        selection: { status: 'UNSELECTABLE', reasons: ['current_global_fragment_missing'] }
      };
    }
    if (hasCheckpointField && checkpoint === null) {
      return { ...baseWithCandidates, kind: 'ROOM_PRESENT_NO_SNAPSHOT' };
    }
    if (!inlineGameState && !hasCheckpointField) {
      return {
        ...baseWithCandidates,
        kind: 'ROOM_PRESENT_NO_SNAPSHOT',
        diagnostics: [{ code: 'NO_SNAPSHOT', message: 'root metadata exists without inline gameState or split documents' }]
      };
    }
    if (inlineGameState !== null && !isPlainRecord(inlineGameState)) {
      return {
        ...baseWithCandidates,
        kind: 'INVALID_LEGACY_CANDIDATE',
        diagnostics: [{ code: 'INLINE_NOT_RECORD', message: 'inline gameState is not a plain record' }],
        migrationRequired: true
      };
    }
    return { ...baseWithCandidates, kind: 'ROOM_PRESENT_NO_SNAPSHOT' };
  }

  if (hasInlineCandidate && !hasSplitCandidate) {
    if (!inlineCandidate.complete) {
      return {
        ...baseWithCandidates,
        kind: 'INVALID_LEGACY_CANDIDATE',
        migrationRequired: true,
        diagnostics: inlineCandidate.issues.map((issue) => ({ code: issue, message: issue })),
        selection: { status: 'UNSELECTABLE', reasons: inlineCandidate.issues }
      };
    }
    return {
      ...baseWithCandidates,
      kind: 'LEGACY_INLINE_ONLY',
      migrationRequired: true,
      selectedCandidateId: 'inline',
      selectedSnapshot: { global: inlineCandidate.global, maps: inlineCandidate.maps, mapIds: inlineCandidate.mapIds },
      selection: { status: 'SELECTED', selectedCandidateId: 'inline' }
    };
  }

  if (!hasInlineCandidate && hasSplitCandidate) {
    if (!splitCandidate || !splitCandidate.complete) {
      const issues = splitCandidate ? splitCandidate.issues : ['split_malformed'];
      return {
        ...baseWithCandidates,
        kind: 'PARTIAL_SPLIT',
        migrationRequired: true,
        diagnostics: issues.map((issue) => ({ code: issue, message: issue })),
        selection: { status: 'UNSELECTABLE', reasons: issues }
      };
    }
    return {
      ...baseWithCandidates,
      kind: 'LEGACY_SPLIT_ONLY_COMPLETE',
      migrationRequired: true,
      selectedCandidateId: 'split',
      selectedSnapshot: { global: splitCandidate.global, maps: splitCandidate.maps, mapIds: splitCandidate.mapIds },
      selection: { status: 'SELECTED', selectedCandidateId: 'split' }
    };
  }

  const hashes = { inline: candidates.inline.hash, split: candidates.split.hash };
  const recordedSelection = roomData.checkpointSelection;

  if (inlineCandidate.complete && splitCandidate.complete) {
    if (snapshotsEquivalent(inlineCandidate, splitCandidate)) {
      return {
        ...baseWithCandidates,
        kind: 'LEGACY_BOTH_INLINE_SPLIT',
        migrationRequired: true,
        selectedCandidateId: 'inline',
        selectedSnapshot: { global: inlineCandidate.global, maps: inlineCandidate.maps, mapIds: inlineCandidate.mapIds },
        selection: { status: 'EQUIVALENT', selectedCandidateId: 'inline' }
      };
    }
    if (selectionMatches(recordedSelection, hashes)) {
      const selectedId = recordedSelection.selectedCandidateId;
      const selected = selectedId === 'inline' ? inlineCandidate : splitCandidate;
      return {
        ...baseWithCandidates,
        kind: 'LEGACY_BOTH_INLINE_SPLIT',
        migrationRequired: true,
        selectedCandidateId: selectedId,
        selectedSnapshot: { global: selected.global, maps: selected.maps, mapIds: selected.mapIds },
        selection: {
          status: 'SELECTED',
          selectedCandidateId: selectedId,
          decisionId: recordedSelection.decisionId ?? null,
          decidedAt: recordedSelection.decidedAt ?? null,
          decidedBy: recordedSelection.decidedBy ?? null
        }
      };
    }
    return {
      ...baseWithCandidates,
      kind: 'LEGACY_BOTH_INLINE_SPLIT',
      migrationRequired: true,
      selection: { status: 'AMBIGUOUS_RECONCILIATION_REQUIRED', candidateHashes: hashes },
      diagnostics: [{ code: 'AMBIGUOUS_RECONCILIATION_REQUIRED', message: 'inline and split candidates contain different valuable content without trustworthy precedence' }]
    };
  }

  if (!inlineCandidate.complete && splitCandidate.complete) {
    return {
      ...baseWithCandidates,
      kind: 'LEGACY_BOTH_INLINE_SPLIT',
      migrationRequired: true,
      selectedCandidateId: 'split',
      selectedSnapshot: { global: splitCandidate.global, maps: splitCandidate.maps, mapIds: splitCandidate.mapIds },
      selection: { status: 'SELECTED', selectedCandidateId: 'split', rejectedCandidateId: 'inline', reasons: inlineCandidate.issues }
    };
  }

  if (inlineCandidate.complete && !splitCandidate.complete) {
    return {
      ...baseWithCandidates,
      kind: 'LEGACY_BOTH_INLINE_SPLIT',
      migrationRequired: true,
      selectedCandidateId: 'inline',
      selectedSnapshot: { global: inlineCandidate.global, maps: inlineCandidate.maps, mapIds: inlineCandidate.mapIds },
      selection: { status: 'SELECTED', selectedCandidateId: 'inline', rejectedCandidateId: 'split', reasons: splitCandidate.issues }
    };
  }

  return {
    ...baseWithCandidates,
    kind: 'INVALID_LEGACY_CANDIDATE',
    migrationRequired: true,
    diagnostics: [
      ...(inlineCandidate.issues || []).map((issue) => ({ code: issue, message: issue })),
      ...((splitCandidate && splitCandidate.issues) || []).map((issue) => ({ code: issue, message: issue }))
    ],
    selection: { status: 'UNSELECTABLE' }
  };
};

const isCanonicalComplete = (classification) => classification.kind === 'CANONICAL_COMPLETE_CHECKPOINT';
const hasSelectedSnapshot = (classification) => isCanonicalComplete(classification) || !!classification.selectedSnapshot;

const hydrateSnapshotToGameState = (snapshot) => {
  const maps = {};
  for (const mapId of snapshot.mapIds) {
    maps[mapId] = JSON.parse(JSON.stringify(snapshot.maps[mapId]));
  }
  const mirrors = deriveRootMirrors(maps);
  return {
    ...JSON.parse(JSON.stringify(snapshot.global)),
    maps,
    tokens: mirrors.tokens,
    characterTokens: mirrors.characterTokens,
    gridItems: mirrors.gridItems
  };
};

module.exports = {
  CHECKPOINT_SCHEMA_VERSION,
  CHECKPOINT_LIMITS,
  ROOT_ENTITY_MIRRORS,
  canonicalize,
  stableStringify,
  sha256Hex,
  canonicalHash,
  validateMapId,
  deriveRootMirrors,
  splitCanonicalGameState,
  buildCheckpointDocuments,
  decodeCanonicalCheckpoint,
  classifyRoomDocuments,
  adaptInlineCandidate,
  adaptSplitCandidate,
  adaptRootOnlyInline,
  adaptInlineWithMaps,
  candidateHash,
  snapshotsEquivalent,
  metadataFingerprint,
  estimateDocumentBytes,
  countNodes,
  hydrateSnapshotToGameState,
  isCanonicalComplete,
  hasSelectedSnapshot
};
