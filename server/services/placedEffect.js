/** Reusable room-authoritative placed-effect custody ledger (`placed-effect:v1`).
 *
 * Binds each placement to an exact room, map location + calibrated grid snapshot,
 * bound primary PC owner, and admitted authored ability version.
 *
 * Keeps shared placement custody separate from domain gameplay rules so traps,
 * Inscriptor runes, and Totemist conduits can reuse map placement and recovery
 * without inheriting identical trigger, payment, visibility, or expiry semantics.
 */
const crypto = require('crypto');
const actors = require('./actorConsequences');
const policy = require('../shared/services/placedEffectPolicy');
const pure = require('../shared/services/authoredAbility');
const authoredEffect = require('../shared/services/authoredEffect');
const installedAuthoredAbilities = require('./installedAuthoredAbilities');

const CONTRACT = policy.CONTRACT;
const LEDGER_KEY = 'placedEffectLedger';
const LEDGER_VERSION = 1;
const MAX_PLACEMENTS = 64;
const MAX_REQUESTS = 128;
const MAX_PROCESSED_MOVES = 256;
const MAX_COORDINATE = 10000000;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const HEX64 = /^[0-9a-f]{64}$/;
const SUPPORTED_ARMED_KINDS = Object.freeze(['stunned', 'movement', 'attribute', 'damageReduction']);

const PLACE_KEYS = Object.freeze([
  'version', 'roomId', 'requestId', 'expectedRevision',
  'owner', 'definitionRef', 'location', 'family', 'armed'
]);
const REMOVE_KEYS = Object.freeze([
  'version', 'roomId', 'requestId', 'expectedRevision', 'placementId'
]);
const LOCATION_KEYS = Object.freeze(['mapId', 'position', 'radiusFeet']);
const POSITION_KEYS = Object.freeze(['x', 'y']);
const DEFINITION_REF_KEYS = Object.freeze(['roomId', 'definitionId', 'definitionVersion', 'definitionHash']);

const isPlain = value => !!value && typeof value === 'object' && !Array.isArray(value) &&
  [Object.prototype, null].includes(Object.getPrototypeOf(value));
const amount = value => Number.isSafeInteger(value) && value >= 0;
const finiteCoord = value => typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= MAX_COORDINATE;
const clone = value => actors.clone(value);
const hash = value => actors.hash(value);

function fail(code, message) {
  actors.fail(code, message || code);
}

function emptyLedger() {
  return { version: LEDGER_VERSION, revision: 0, placements: [], requests: [] };
}

function validProcessedHashes(value, max) {
  return Array.isArray(value) && value.length <= max && value.every(v => typeof v === 'string');
}

function preserveProcessed(source) {
  return {
    ...(Array.isArray(source?.processedMoves) ? { processedMoves: clone(source.processedMoves) } : {})
  };
}

function ledger(gameState) {
  if (!isPlain(gameState)) { return null; }
  const raw = gameState[LEDGER_KEY];
  if (raw === undefined) { return null; }
  if (!isPlain(raw) || raw.version !== LEDGER_VERSION || !amount(raw.revision) ||
      !Array.isArray(raw.placements) || raw.placements.length > MAX_PLACEMENTS ||
      !Array.isArray(raw.requests) || raw.requests.length > MAX_REQUESTS ||
      (raw.processedMoves !== undefined && !validProcessedHashes(raw.processedMoves, MAX_PROCESSED_MOVES))) {
    fail('unsupported_placed_effect_ledger', 'The stored placed-effect ledger is not a supported v1 shape. Nothing changed.');
  }
  return raw;
}

function stored(room) {
  return ledger(room?.gameState);
}

function requestOf(storedLedger, requestId, requestHash) {
  const prior = storedLedger?.requests.find(item => item.requestId === requestId);
  if (prior && prior.requestHash !== requestHash) {
    fail('REQUEST_ID_CONFLICT', 'A different placed-effect request already used this requestId.');
  }
  return prior || null;
}

function gridSnapshotFor(room, mapId) {
  const m = installedAuthoredAbilities.mapGridMetrics(room, mapId);
  return {
    gridType: m.gridType,
    gridSize: m.gridSize,
    feetPerTile: m.feetPerTile,
    offsetX: m.offsetX,
    offsetY: m.offsetY
  };
}

/** Extract a simple canonical condition payload eligible for armed movement-entry evaluation. */
function extractConditionPayload(entry) {
  if (!entry || !entry.canonicalDefinition || !entry.descriptor) { return null; }
  const capabilityId = entry.descriptor.capabilityId;
  const def = entry.canonicalDefinition;
  if (capabilityId === pure.EFFECT_CAPABILITY) {
    if (def.effects?.direct !== null || def.effects?.save !== undefined || def.effects?.critGate !== undefined) {
      return null;
    }
    if (def.timing?.expiryPolicy !== 'gm-manual') {
      return null;
    }
    if (!SUPPORTED_ARMED_KINDS.includes(def.effects?.condition?.kind)) {
      return null;
    }
    return { condition: clone(def.effects.condition), timing: clone(def.timing) };
  }
  if (capabilityId === pure.PASSIVE_ENTRY_CAPABILITY) {
    if (!SUPPORTED_ARMED_KINDS.includes(def.effects?.condition?.kind)) {
      return null;
    }
    return { condition: clone(def.effects.condition), timing: clone(def.timing) };
  }
  return null;
}

function statusResult(ok, state, code, reason, base, displayStatus) {
  return {
    ok,
    state,
    code,
    reason,
    projected: {
      ...base,
      state,
      reason,
      displayStatus
    }
  };
}

function describeEffectLabel(item) {
  if (item.resolvedEffect?.condition && item.resolvedEffect?.timing) {
    return authoredEffect.describe({
      direct: null,
      condition: item.resolvedEffect.condition,
      timing: item.resolvedEffect.timing
    });
  }
  return item.abilityName || 'Placed effect';
}

function evaluatePlacement(room, item) {
  const base = clone(item);
  if (!isPlain(item) || item.contract !== CONTRACT) {
    return statusResult(false, 'stale', 'unsupported_placed_effect', 'unsupported placed-effect record', base, 'Stale — unsupported placed-effect record');
  }
  if (item.state === 'consumed') {
    const label = describeEffectLabel(item);
    return statusResult(false, 'consumed', 'placement_consumed', 'consumed on trigger', base, `Consumed — ${item.location?.radiusFeet || '?'} ft (${label})`);
  }
  if (item.armed === true && !policy.armedApproved()) {
    return statusResult(false, 'inactive', 'placed_effect_arming_unapproved', policy.UNAPPROVED_ARMING_REASON, base, `Inactive — ${policy.UNAPPROVED_ARMING_REASON}`);
  }
  if (item.gmUid !== room.gmId) {
    return statusResult(false, 'stale', 'placement_gm_changed', 'GM authority changed since placement', base, 'Stale — GM authority changed since placement');
  }
  const mapId = item.location?.mapId;
  if (!mapId || !room?.gameState?.maps || !Object.prototype.hasOwnProperty.call(room.gameState.maps, mapId) || !isPlain(room.gameState.maps[mapId])) {
    return statusResult(false, 'stale', 'placement_map_missing', 'placed map no longer exists', base, 'Stale — placed map no longer exists');
  }
  const currentGrid = gridSnapshotFor(room, mapId);
  if (currentGrid.gridType !== 'square' || !Number.isFinite(currentGrid.gridSize) || currentGrid.gridSize <= 0 ||
      !Number.isFinite(currentGrid.feetPerTile) || currentGrid.feetPerTile <= 0 ||
      hash(currentGrid) !== hash(item.location?.gridSnapshot)) {
    return statusResult(false, 'stale', 'placement_grid_changed', 'map grid scale or offset changed since placement', base, 'Stale — map grid scale or offset changed since placement');
  }
  let entry = null;
  try {
    const entries = installedAuthoredAbilities.list(room).entries || [];
    entry = entries.find(e => hash(e.definitionRef) === hash(item.definitionRef)) || null;
  } catch (_) {
    entry = null;
  }
  if (!entry) {
    return statusResult(false, 'stale', 'definition_not_admitted', 'admitted ability definition not found', base, 'Stale — admitted ability definition not found');
  }
  if (entry.revoked) {
    return statusResult(false, 'stale', 'definition_revoked', 'admitted ability definition was revoked', base, 'Stale — admitted ability definition was revoked');
  }
  if (entry.creatureOnly) {
    return statusResult(false, 'stale', 'unsupported_placed_definition', 'creature-only ability cannot be placed', base, 'Stale — creature-only ability cannot be placed');
  }
  let located;
  try {
    located = actors.locate(room, item.owner);
  } catch (_) {
    return statusResult(false, 'stale', 'placement_owner_stale', 'owner character incarnation is no longer present', base, 'Stale — owner character incarnation is no longer present');
  }
  if (!located.contract?.primary ||
      located.token.ownerUserId !== item.owner.ownerUid ||
      located.token.character?.id !== item.owner.characterId) {
    return statusResult(false, 'stale', 'placement_owner_stale', 'owner character ownership or primary attachment changed', base, 'Stale — owner character ownership or primary attachment changed');
  }

  const state = item.armed === true ? 'armed' : 'placed';
  const summary = describeEffectLabel(item);
  const displayStatus = item.armed === true
    ? `Armed — ${item.location.radiusFeet} ft radius · ${summary}`
    : `Placed (unarmed) — ${item.location.radiusFeet} ft radius · ${summary}`;
  return statusResult(true, state, null, null, base, displayStatus);
}

function validatePlacePayload(room, data) {
  if (!isPlain(data) || Object.keys(data).some(key => !PLACE_KEYS.includes(key))) {
    fail('invalid_placed_effect', 'The placed-effect request contains unsupported fields. Nothing changed.');
  }
  if ((data.version !== undefined && data.version !== 1) ||
      data.roomId !== room.id ||
      !UUID.test(data.requestId || '') ||
      !amount(data.expectedRevision) ||
      actors.bytes(data) > 16384) {
    fail('invalid_placed_effect', 'The placed-effect request is malformed. Nothing changed.');
  }
  const family = data.family === undefined ? 'placed' : data.family;
  if (typeof family !== 'string' || !policy.FAMILIES.includes(family)) {
    fail('invalid_placed_effect', 'Unsupported placed-effect family.');
  }
  const armed = data.armed === undefined ? false : data.armed;
  if (typeof armed !== 'boolean') {
    fail('invalid_placed_effect', 'The armed flag must be a boolean.');
  }
  if (!isPlain(data.owner)) {
    fail('invalid_placed_effect', 'An owner actorRef is required.');
  }
  try {
    actors.validateRef(data.owner);
  } catch (error) {
    fail('invalid_placed_effect', error.message);
  }
  if (data.owner.kind !== 'character' || data.owner.roomId !== room.id) {
    fail('unsupported_placed_owner', 'Placed effects require a bound primary player character owner in this room.');
  }
  if (!isPlain(data.definitionRef) ||
      Object.keys(data.definitionRef).some(key => !DEFINITION_REF_KEYS.includes(key)) ||
      data.definitionRef.roomId !== room.id ||
      !UUID.test(data.definitionRef.definitionId || '') ||
      !Number.isSafeInteger(data.definitionRef.definitionVersion) || data.definitionRef.definitionVersion < 1 ||
      typeof data.definitionRef.definitionHash !== 'string' || !HEX64.test(data.definitionRef.definitionHash)) {
    fail('invalid_placed_effect', 'A valid admitted definitionRef is required.');
  }
  if (!isPlain(data.location) || Object.keys(data.location).some(key => !LOCATION_KEYS.includes(key))) {
    fail('invalid_placed_effect', 'A valid placement location (mapId, position, radiusFeet) is required.');
  }
  const { mapId, position, radiusFeet } = data.location;
  if (typeof mapId !== 'string' || !mapId.length || mapId.length > 300) {
    fail('invalid_placed_effect', 'A valid mapId is required for placement.');
  }
  if (!isPlain(position) || Object.keys(position).some(key => !POSITION_KEYS.includes(key)) ||
      !finiteCoord(position.x) || !finiteCoord(position.y)) {
    fail('invalid_placed_effect', 'Placement coordinates must be finite numbers.');
  }
  if (!Number.isSafeInteger(radiusFeet) || radiusFeet < 5 || radiusFeet > 60 || radiusFeet % 5 !== 0) {
    fail('invalid_placed_effect', 'Placement radiusFeet must be a multiple of 5 ft from 5 to 60.');
  }
  return { family, armed };
}

function locatePrimaryOwner(room, ownerRef) {
  let located;
  try {
    located = actors.locate(room, ownerRef);
  } catch (error) {
    if (error && error.code === 'secondary_attachment') {
      fail('secondary_attachment', 'Only a bound primary player character can own a placed effect.');
    }
    fail('owner_incarnation_missing', error.message);
  }
  if (!located.contract?.primary) {
    fail('secondary_attachment', 'Only a bound primary player character can own a placed effect.');
  }
  if (located.token.ownerUserId !== ownerRef.ownerUid ||
      located.token.character?.id !== ownerRef.characterId) {
    fail('unsupported_placed_owner', 'The owner token ownership or character identity does not match the bound ref.');
  }
  return located;
}

function planPlace(room, uid, data) {
  const { family, armed } = validatePlacePayload(room, data);
  if (uid !== room.gmId) {
    fail('forbidden', 'Only the current GM can place effects on the map.');
  }
  if (armed === true && !policy.armedApproved()) {
    fail('placed_effect_arming_unapproved', policy.UNAPPROVED_ARMING_REASON);
  }

  const currentLedger = stored(room);
  const requestHash = hash(data);
  const prior = requestOf(currentLedger, data.requestId, requestHash);
  if (prior) {
    const existing = currentLedger.placements.find(item => item.placementId === prior.placementId);
    if (prior.op !== 'place' || !existing) {
      fail('placed_effect_changed', 'That placement request was already processed and the placement has since been removed.');
    }
    return { placement: evaluatePlacement(room, existing).projected };
  }
  if (data.expectedRevision !== (currentLedger?.revision || 0)) {
    fail('REVISION_CONFLICT', 'The placed-effect ledger revision has changed; refresh before placing.');
  }

  const located = locatePrimaryOwner(room, data.owner);
  const mapId = data.location.mapId;
  if (!room?.gameState?.maps || !Object.prototype.hasOwnProperty.call(room.gameState.maps, mapId) || !isPlain(room.gameState.maps[mapId])) {
    fail('map_not_found', `Map '${mapId}' does not exist in this room.`);
  }
  const metrics = gridSnapshotFor(room, mapId);
  if (metrics.gridType !== 'square' || !Number.isFinite(metrics.gridSize) || metrics.gridSize <= 0 ||
      !Number.isFinite(metrics.feetPerTile) || metrics.feetPerTile <= 0) {
    fail('manual_placement_geometry_required', 'Placed effects require a square grid with positive gridSize and feetPerTile.');
  }

  const entries = installedAuthoredAbilities.list(room).entries || [];
  const entry = entries.find(e => hash(e.definitionRef) === hash(data.definitionRef)) || null;
  if (!entry) {
    fail('definition_not_admitted', 'That ability version is not admitted in this room.');
  }
  if (entry.revoked) {
    fail('definition_revoked', 'That admitted ability version has been revoked.');
  }
  if (entry.creatureOnly) {
    fail('unsupported_placed_definition', 'Creature-only definitions cannot be placed here.');
  }

  const defRadius = entry.canonicalDefinition?.targeting?.radiusFeet;
  if (Number.isSafeInteger(defRadius) && data.location.radiusFeet !== defRadius) {
    fail('placement_radius_mismatch', `Placement radius (${data.location.radiusFeet} ft) must match the admitted ability radius (${defRadius} ft).`);
  }

  const resolvedEffect = extractConditionPayload(entry);
  if (armed === true && !resolvedEffect) {
    fail('unsupported_armed_effect', 'Armed placed effects currently require an admitted manual-expiry canonical condition ability.');
  }

  const baseLedger = currentLedger || emptyLedger();
  let nextPlacements = clone(baseLedger.placements);
  if (nextPlacements.length >= MAX_PLACEMENTS) {
    const consumedIdx = nextPlacements.findIndex(p => p.state === 'consumed');
    if (consumedIdx >= 0) {
      nextPlacements.splice(consumedIdx, 1);
    }
  }
  if (nextPlacements.length >= MAX_PLACEMENTS) {
    fail('placed_effect_capacity', `At most ${MAX_PLACEMENTS} active placed effects per room. Remove one first.`);
  }

  const rulesSnapshot = clone(policy.activeRules());
  const visibility = policy.VISIBILITY_MODES.includes(rulesSnapshot.visibility)
    ? rulesSnapshot.visibility
    : 'owner-and-gm';

  const placement = {
    placementId: crypto.randomUUID(),
    contract: CONTRACT,
    family,
    armed,
    state: armed ? 'armed' : 'placed',
    visibility,
    location: {
      mapId,
      position: { x: data.location.position.x, y: data.location.position.y },
      shape: 'circle',
      radiusFeet: data.location.radiusFeet,
      gridSnapshot: metrics
    },
    owner: clone(data.owner),
    ownerRevision: located.contract.revision,
    gmUid: uid,
    definitionRef: clone(entry.definitionRef),
    sourceRecordId: pure.actionId(entry.definitionRef),
    abilityName: entry.canonicalDefinition.name,
    capabilityId: entry.descriptor?.capabilityId || pure.CAPABILITY,
    ...(resolvedEffect ? { resolvedEffect } : {}),
    rulesSnapshot,
    placedAtCommit: actors.ledger(room).commitSequence
  };

  const next = clone(room.gameState);
  next[LEDGER_KEY] = {
    version: LEDGER_VERSION,
    revision: baseLedger.revision + 1,
    placements: [...nextPlacements, placement],
    requests: [...clone(baseLedger.requests), {
      requestId: data.requestId,
      requestHash,
      op: 'place',
      placementId: placement.placementId
    }].slice(-MAX_REQUESTS),
    ...preserveProcessed(baseLedger)
  };

  return {
    placement: evaluatePlacement({ ...room, gameState: next }, placement).projected,
    next
  };
}

function planRemove(room, uid, data) {
  if (!isPlain(data) || Object.keys(data).some(key => !REMOVE_KEYS.includes(key))) {
    fail('invalid_placed_effect', 'The placed-effect removal request contains unsupported fields. Nothing changed.');
  }
  if ((data.version !== undefined && data.version !== 1) ||
      data.roomId !== room.id ||
      !UUID.test(data.requestId || '') ||
      !UUID.test(data.placementId || '') ||
      !amount(data.expectedRevision) ||
      actors.bytes(data) > 4096) {
    fail('invalid_placed_effect', 'The placed-effect removal request is malformed. Nothing changed.');
  }
  if (uid !== room.gmId) {
    fail('forbidden', 'Only the current GM can remove a placed effect.');
  }
  const currentLedger = stored(room);
  if (!currentLedger) {
    fail('placed_effect_not_found', 'No placed effect with that ID exists in this room.');
  }
  const requestHash = hash(data);
  const prior = requestOf(currentLedger, data.requestId, requestHash);
  if (prior) {
    if (prior.op !== 'remove') {
      fail('REQUEST_ID_CONFLICT', 'A different placed-effect request already used this requestId.');
    }
    return { placementId: prior.placementId };
  }
  if (data.expectedRevision !== currentLedger.revision) {
    fail('REVISION_CONFLICT', 'The placed-effect ledger revision has changed; refresh before removing.');
  }
  const removed = currentLedger.placements.find(item => item.placementId === data.placementId);
  if (!removed) {
    fail('placed_effect_not_found', 'No placed effect with that ID exists in this room.');
  }
  const next = clone(room.gameState);
  next[LEDGER_KEY] = {
    version: LEDGER_VERSION,
    revision: currentLedger.revision + 1,
    placements: clone(currentLedger.placements.filter(item => item.placementId !== data.placementId)),
    requests: [...clone(currentLedger.requests), {
      requestId: data.requestId,
      requestHash,
      op: 'remove',
      placementId: data.placementId
    }].slice(-MAX_REQUESTS),
    ...preserveProcessed(currentLedger)
  };
  return { placementId: data.placementId, next };
}

function projectPlacementForViewer(item, isGM) {
  if (isGM) { return item; }
  const out = clone(item);
  delete out.gmUid;
  return out;
}

function canViewerSeePlacement(room, item, viewer) {
  if (viewer.gm && viewer.uid === room.gmId) {
    return true;
  }
  const visibility = item.visibility || item.rulesSnapshot?.visibility || 'owner-and-gm';
  if (visibility === 'gm-only') {
    return false;
  }
  if (visibility === 'public') {
    return true;
  }
  return Boolean(viewer.uid && item.owner?.kind === 'character' && item.owner.ownerUid === viewer.uid);
}

function project(room, viewer) {
  const currentLedger = stored(room);
  const isGM = Boolean(viewer?.gm && viewer?.uid === room.gmId);
  const evaluated = (currentLedger?.placements || []).map(item => evaluatePlacement(room, item).projected);
  const visible = evaluated
    .filter(item => canViewerSeePlacement(room, item, { uid: viewer?.uid, gm: isGM }))
    .map(item => projectPlacementForViewer(item, isGM));

  return {
    contract: CONTRACT,
    armingApproved: policy.armedApproved(),
    activeRules: clone(policy.activeRules()),
    revision: currentLedger?.revision || 0,
    placements: visible,
    executableClaim: false
  };
}

function audience(room) {
  const currentLedger = stored(room);
  if (!currentLedger) { return { publicChange: false, ownerUids: [] }; }
  let publicChange = false;
  const ownerUids = new Set();
  for (const item of currentLedger.placements) {
    const vis = item.visibility || item.rulesSnapshot?.visibility || 'owner-and-gm';
    if (vis === 'public') { publicChange = true; }
    if (vis !== 'gm-only' && item.owner?.kind === 'character' && typeof item.owner.ownerUid === 'string') {
      ownerUids.add(item.owner.ownerUid);
    }
  }
  return { publicChange, ownerUids: [...ownerUids] };
}

function scrubGameState(gameState) {
  if (!isPlain(gameState)) {
    return { ok: false, code: 'GAME_STATE_INVALID', reason: 'The supplied game state is not a plain record.' };
  }
  const out = clone(gameState);
  const summary = { placedEffectLedger: { removed: false, placements: 0, requests: 0 } };
  if (Object.prototype.hasOwnProperty.call(out, LEDGER_KEY)) {
    const raw = out[LEDGER_KEY];
    if (!isPlain(raw) || raw.version !== LEDGER_VERSION || !Array.isArray(raw.placements) || !Array.isArray(raw.requests)) {
      return { ok: false, code: 'PLACED_EFFECT_LEDGER_UNSUPPORTED', reason: 'The placed-effect ledger is not a supported v1 shape; refusing to scrub it silently.' };
    }
    summary.placedEffectLedger = {
      removed: true,
      placements: raw.placements.length,
      requests: raw.requests.length
    };
    delete out[LEDGER_KEY];
  }
  return { ok: true, changed: summary.placedEffectLedger.removed, gameState: out, summary };
}

module.exports = {
  CONTRACT,
  LEDGER_KEY,
  LEDGER_VERSION,
  MAX_PLACEMENTS,
  MAX_REQUESTS,
  MAX_PROCESSED_MOVES,
  SUPPORTED_ARMED_KINDS,
  emptyLedger,
  ledger,
  stored,
  gridSnapshotFor,
  extractConditionPayload,
  evaluatePlacement,
  planPlace,
  planRemove,
  project,
  audience,
  scrubGameState
};
