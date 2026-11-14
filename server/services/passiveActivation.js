/** First-playable passive activation authority and initiative modifier consumption (Heightened Senses).
 * Binds explicit GM activation to an exact primary character incarnation, Perception NOVICE eligibility,
 * and canonical passive descriptor identity under the creator-approved P1-P5 policy. */
const crypto = require('crypto');
const actors = require('./actorConsequences');
const checkpoint = require('./roomCheckpoint');
const policy = require('../shared/services/passiveActivationPolicy');

const CAPABILITY = policy.CONTRACT;
const LEDGER_KEY = 'passiveLedger';
const LEDGER_VERSION = 1;
const MAX_ACTIVATIONS = 64;
const MAX_REQUESTS = 128;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ACTIVATE_KEYS = Object.freeze([
  'version', 'roomId', 'requestId', 'expectedRevision',
  'target', 'passiveId', 'sourceRecordId', 'profile', 'record'
]);
const REVOKE_KEYS = Object.freeze([
  'version', 'roomId', 'requestId', 'expectedRevision', 'activationId'
]);
const FORGED_CLIENT_FIELDS = Object.freeze([
  'passiveBonus', 'passiveInitiativeBonus', 'activePassives',
  'passiveContributions', 'heightenedSensesActive', 'passiveLedger', 'passiveApplied'
]);

const isPlain = value => !!value && typeof value === 'object' && !Array.isArray(value) &&
  [Object.prototype, null].includes(Object.getPrototypeOf(value));
const amount = value => Number.isSafeInteger(value) && value >= 0;
const clone = value => actors.clone(value);
const hash = value => actors.hash(value);

function fail(code, message) {
  actors.fail(code, message || code);
}

function emptyLedger() {
  return { version: LEDGER_VERSION, revision: 0, activations: [], requests: [] };
}

function ledger(gameState) {
  if (!isPlain(gameState)) { return null; }
  const raw = gameState[LEDGER_KEY];
  if (raw === undefined) { return null; }
  if (!isPlain(raw) || raw.version !== LEDGER_VERSION || !amount(raw.revision) ||
      !Array.isArray(raw.activations) || raw.activations.length > MAX_ACTIVATIONS ||
      !Array.isArray(raw.requests) || raw.requests.length > MAX_REQUESTS) {
    fail('unsupported_passive_ledger', 'The stored passive ledger is not a supported v1 shape. Nothing changed.');
  }
  return raw;
}

function stored(room) {
  return ledger(room?.gameState);
}

function requestOf(storedLedger, requestId, requestHash) {
  const prior = storedLedger?.requests.find(item => item.requestId === requestId);
  if (prior && prior.requestHash !== requestHash) {
    fail('REQUEST_ID_CONFLICT', 'A different passive request already used this requestId.');
  }
  return prior || null;
}

/** Re-validate one stored activation against current policy, canonical descriptor identity, GM authority, exact actor incarnation, revision, and skill eligibility. */
function evaluateActivation(room, item) {
  const base = clone(item);
  if (!policy.approved()) {
    const desc = policy.describePassiveStatus({ activation: { state: 'inactive', reason: policy.UNAPPROVED_REASON }, policyApproved: false });
    return {
      ok: false,
      state: 'inactive',
      code: 'passive_activation_unapproved',
      reason: policy.UNAPPROVED_REASON,
      projected: { ...base, state: 'inactive', reason: policy.UNAPPROVED_REASON, displayStatus: desc.displayStatus, eligibility: { ok: false, code: 'passive_activation_unapproved', reason: policy.UNAPPROVED_REASON } }
    };
  }
  if (!isPlain(item) ||
      item.passiveId !== policy.HEIGHTENED_SENSES_PASSIVE.passiveId ||
      item.sourceRecordId !== policy.HEIGHTENED_SENSES_PASSIVE.sourceRecordId ||
      item.sourceRecordSha256 !== policy.HEIGHTENED_SENSES_RECORD_SHA256) {
    const reason = 'unsupported passive descriptor';
    const desc = policy.describePassiveStatus({ activation: { state: 'stale', reason }, policyApproved: true });
    return {
      ok: false,
      state: 'stale',
      code: 'unsupported_passive',
      reason,
      projected: { ...base, state: 'stale', reason, displayStatus: desc.displayStatus, eligibility: { ok: false, code: 'unsupported_passive', reason } }
    };
  }
  if (item.gmUid !== room.gmId) {
    const reason = 'GM authority changed since activation';
    const desc = policy.describePassiveStatus({ activation: { state: 'stale', reason }, policyApproved: true });
    return {
      ok: false,
      state: 'stale',
      code: 'passive_gm_changed',
      reason,
      projected: { ...base, state: 'stale', reason, displayStatus: desc.displayStatus, eligibility: { ok: false, code: 'passive_gm_changed', reason } }
    };
  }
  let located;
  try {
    located = actors.locate(room, item.target);
  } catch (_) {
    const reason = 'character ownership or incarnation changed';
    const desc = policy.describePassiveStatus({ activation: { state: 'stale', reason }, policyApproved: true });
    return {
      ok: false,
      state: 'stale',
      code: 'passive_binding_stale',
      reason,
      projected: { ...base, state: 'stale', reason, displayStatus: desc.displayStatus, eligibility: { ok: false, code: 'passive_binding_stale', reason } }
    };
  }
  if (!located.contract?.primary ||
      located.token.ownerUserId !== item.target.ownerUid ||
      located.token.character?.id !== item.target.characterId) {
    const reason = 'character ownership or primary attachment changed';
    const desc = policy.describePassiveStatus({ activation: { state: 'stale', reason }, policyApproved: true });
    return {
      ok: false,
      state: 'stale',
      code: 'passive_binding_stale',
      reason,
      projected: { ...base, state: 'stale', reason, displayStatus: desc.displayStatus, eligibility: { ok: false, code: 'passive_binding_stale', reason } }
    };
  }
  if (located.contract.revision !== item.targetRevision) {
    const reason = 'character sheet or contract revision changed since activation';
    const desc = policy.describePassiveStatus({ activation: { state: 'stale', reason }, policyApproved: true });
    return {
      ok: false,
      state: 'stale',
      code: 'stale_actor_revision',
      reason,
      projected: { ...base, state: 'stale', reason, displayStatus: desc.displayStatus, eligibility: { ok: false, code: 'stale_actor_revision', reason } }
    };
  }
  const elig = policy.evaluatePassiveEligibility(located.token.character, policy.HEIGHTENED_SENSES_PASSIVE);
  if (!elig.ok) {
    const reason = elig.reason || 'requires Perception NOVICE';
    const desc = policy.describePassiveStatus({ activation: { state: 'stale', reason }, eligibility: elig, policyApproved: true });
    return {
      ok: false,
      state: 'stale',
      code: elig.code || 'passive_source_ineligible',
      reason,
      projected: { ...base, state: 'stale', reason, displayStatus: desc.displayStatus, eligibility: elig }
    };
  }
  const desc = policy.describePassiveStatus({ activation: { state: 'active' }, eligibility: elig, policyApproved: true });
  return {
    ok: true,
    state: 'active',
    code: null,
    reason: null,
    projected: { ...base, state: 'active', reason: null, displayStatus: desc.displayStatus, eligibility: elig }
  };
}

function validateActivatePayload(room, data) {
  if (!isPlain(data) || Object.keys(data).some(key => !ACTIVATE_KEYS.includes(key))) {
    fail('invalid_passive_activation', 'The passive activation payload contains unsupported fields. Nothing changed.');
  }
  if ((data.version !== undefined && data.version !== 1) ||
      data.roomId !== room.id ||
      !UUID.test(data.requestId || '') ||
      !amount(data.expectedRevision) ||
      actors.bytes(data) > 8192) {
    fail('invalid_passive_activation', 'The passive activation payload is malformed. Nothing changed.');
  }
  if (!isPlain(data.target)) {
    fail('invalid_passive_activation', 'A target actorRef is required. Nothing changed.');
  }
  try {
    actors.validateRef(data.target);
  } catch (error) {
    if (data.target.kind && data.target.kind !== 'character') {
      fail('unsupported_passive_target', 'Only a bound primary player character can receive a passive activation.');
    }
    fail('invalid_passive_activation', error.message);
  }
}

/** Plan one explicit GM passive activation. Returns { activation, next? } where `next` is omitted on exact replay. */
function planActivate(room, uid, data) {
  validateActivatePayload(room, data);
  if (uid !== room.gmId) {
    fail('forbidden', 'Only the current GM can activate a passive modifier.');
  }
  if (!policy.approved()) {
    fail('passive_activation_unapproved', policy.UNAPPROVED_REASON);
  }
  if (data.target.kind !== 'character') {
    fail('unsupported_passive_target', 'Only a bound primary player character can receive a passive activation.');
  }
  const resolved = policy.resolvePassiveDescriptor({
    passiveId: data.passiveId,
    sourceRecordId: data.sourceRecordId,
    record: data.record
  });
  if (!resolved.ok) {
    fail(resolved.code || 'unsupported_passive', resolved.reason);
  }
  if (data.record !== undefined && hash(data.record) !== policy.HEIGHTENED_SENSES_RECORD_SHA256) {
    fail('unsupported_passive', 'The supplied passive record hash does not match the canonical Heightened Senses fixture.');
  }
  const policyStacking = policy.stackingMode();
  const stacking = data.profile !== undefined ? data.profile : policyStacking;
  if (!policy.STACKING_MODES.includes(stacking) || stacking !== policyStacking) {
    fail('unsupported_passive_profile', 'The requested passive stacking profile is not enabled by creator policy.');
  }

  const currentLedger = stored(room);
  const requestHash = hash(data);
  const prior = requestOf(currentLedger, data.requestId, requestHash);
  if (prior) {
    const existing = currentLedger.activations.find(item => item.activationId === prior.activationId);
    if (prior.op !== 'activate' || !existing) {
      fail('passive_activation_changed', 'That activation request was already processed and the activation has since been revoked.');
    }
    return { activation: evaluateActivation(room, existing).projected };
  }
  if (data.expectedRevision !== (currentLedger?.revision || 0)) {
    fail('REVISION_CONFLICT', 'The passive ledger revision has changed; refresh before activating.');
  }

  let located;
  try {
    located = actors.locate(room, data.target);
  } catch (error) {
    if (error && error.code === 'secondary_attachment') {
      fail('secondary_attachment', 'Only the primary player character token can receive a passive activation.');
    }
    fail('target_incarnation_missing', error.message);
  }
  if (!located.contract?.primary) {
    fail('secondary_attachment', 'Only the primary player character token can receive a passive activation.');
  }
  if (located.token.ownerUserId !== data.target.ownerUid ||
      located.token.character?.id !== data.target.characterId) {
    fail('unsupported_passive_target', 'The character token ownership or identity does not match the bound ref.');
  }

  const existingForCharacter = (currentLedger?.activations || []).filter(item =>
    item.passiveId === resolved.descriptor.passiveId &&
    (item.target.characterId === data.target.characterId ||
      (item.target.mapId === data.target.mapId && item.target.tokenId === data.target.tokenId))
  );
  const evaluatedExisting = existingForCharacter.map(item => evaluateActivation(room, item));
  if (evaluatedExisting.some(item => !item.ok)) {
    fail('passive_activation_stale', 'An existing passive activation for this character is disabled after an eligibility, revision, ownership, or incarnation change. Revoke the stale activation before reactivating.');
  }
  const activeCount = evaluatedExisting.filter(item => item.ok).length;
  const maxCopies = stacking === 'both-copies' ? 2 : 1;
  if (activeCount >= maxCopies) {
    fail('passive_already_active', 'Heightened Senses is already active for this character.');
  }

  const elig = policy.evaluatePassiveEligibility(located.token.character, resolved.descriptor);
  if (!elig.ok) {
    fail(elig.code || 'passive_source_ineligible', 'Heightened Senses requires Perception NOVICE or higher.');
  }

  const baseLedger = currentLedger || emptyLedger();
  if (baseLedger.activations.length >= MAX_ACTIVATIONS) {
    fail('passive_activation_capacity', `At most ${MAX_ACTIVATIONS} passive activations per room. Revoke one first.`);
  }

  const activation = {
    activationId: crypto.randomUUID(),
    passiveId: resolved.descriptor.passiveId,
    sourceRecordId: resolved.descriptor.sourceRecordId,
    sourceShape: resolved.descriptor.sourceShape,
    sourceRecordSha256: resolved.descriptor.sourceRecordSha256,
    target: clone(data.target),
    targetRevision: located.contract.revision,
    gmUid: uid,
    stacking,
    effect: clone(resolved.descriptor.effect),
    activatedAtCommit: actors.ledger(room).commitSequence
  };

  const next = clone(room.gameState);
  next[LEDGER_KEY] = {
    version: LEDGER_VERSION,
    revision: baseLedger.revision + 1,
    activations: [...clone(baseLedger.activations), activation],
    requests: [...clone(baseLedger.requests), {
      requestId: data.requestId,
      requestHash,
      op: 'activate',
      activationId: activation.activationId
    }].slice(-MAX_REQUESTS)
  };

  return {
    activation: evaluateActivation({ ...room, gameState: next }, activation).projected,
    next
  };
}

/** Plan one explicit GM passive revocation. Returns { activationId, next? } where `next` is omitted on exact replay. */
function planRevoke(room, uid, data) {
  if (!isPlain(data) || Object.keys(data).some(key => !REVOKE_KEYS.includes(key))) {
    fail('invalid_passive_activation', 'The passive revocation payload contains unsupported fields. Nothing changed.');
  }
  if ((data.version !== undefined && data.version !== 1) ||
      data.roomId !== room.id ||
      !UUID.test(data.requestId || '') ||
      !UUID.test(data.activationId || '') ||
      !amount(data.expectedRevision) ||
      actors.bytes(data) > 4096) {
    fail('invalid_passive_activation', 'The passive revocation payload is malformed. Nothing changed.');
  }
  if (uid !== room.gmId) {
    fail('forbidden', 'Only the current GM can revoke a passive activation.');
  }
  const currentLedger = stored(room);
  if (!currentLedger) {
    fail('passive_activation_not_found', 'No passive activation with that ID exists in this room.');
  }
  const requestHash = hash(data);
  const prior = requestOf(currentLedger, data.requestId, requestHash);
  if (prior) {
    if (prior.op !== 'revoke') {
      fail('REQUEST_ID_CONFLICT', 'A different passive request already used this requestId.');
    }
    return { activationId: prior.activationId };
  }
  if (data.expectedRevision !== currentLedger.revision) {
    fail('REVISION_CONFLICT', 'The passive ledger revision has changed; refresh before revoking.');
  }
  const removed = currentLedger.activations.find(item => item.activationId === data.activationId);
  if (!removed) {
    fail('passive_activation_not_found', 'No passive activation with that ID exists in this room.');
  }
  const next = clone(room.gameState);
  next[LEDGER_KEY] = {
    version: LEDGER_VERSION,
    revision: currentLedger.revision + 1,
    activations: clone(currentLedger.activations.filter(item => item.activationId !== data.activationId)),
    requests: [...clone(currentLedger.requests), {
      requestId: data.requestId,
      requestHash,
      op: 'revoke',
      activationId: data.activationId
    }].slice(-MAX_REQUESTS)
  };
  return { activationId: data.activationId, next };
}

function projectActivationForViewer(item, isGM) {
  if (isGM) { return item; }
  return {
    activationId: item.activationId,
    passiveId: item.passiveId,
    sourceRecordId: item.sourceRecordId,
    target: clone(item.target),
    stacking: item.stacking,
    effect: clone(item.effect),
    state: item.state,
    reason: item.reason,
    displayStatus: item.displayStatus,
    eligibility: clone(item.eligibility)
  };
}

/** Viewer-authorized projection for `actor_passive_list`. */
function project(room, viewer) {
  const currentLedger = stored(room);
  const policyOn = policy.approved();
  const isGM = Boolean(viewer.gm && viewer.uid === room.gmId);
  const allProjected = (currentLedger?.activations || []).map(item => evaluateActivation(room, item).projected);

  let visible;
  if (isGM) {
    visible = allProjected.map(item => projectActivationForViewer(item, true));
  } else {
    visible = allProjected
      .filter(item => {
        if (item.target?.kind !== 'character' || item.target.ownerUid !== viewer.uid) { return false; }
        try {
          return actors.locate(room, item.target).token.ownerUserId === viewer.uid;
        } catch (_) {
          return true;
        }
      })
      .map(item => projectActivationForViewer(item, false));
  }

  const activeItems = visible.filter(item => item.state === 'active');
  const staleItems = visible.filter(item => item.state !== 'active');

  let status = 'stored';
  let effectText = null;
  let displayStatus = 'Stored — not active';

  if (!policyOn) {
    status = 'inactive';
    displayStatus = 'Inactive — creator approval pending';
  } else if (activeItems.length > 0) {
    status = 'active';
    effectText = '+2 initiative';
    displayStatus = 'Active — +2 initiative';
  } else if (staleItems.length > 0) {
    status = 'inactive';
    effectText = null;
    displayStatus = staleItems[0].displayStatus || ('Inactive — ' + (staleItems[0].reason || 'ineligible'));
  }

  return {
    capability: policyOn ? CAPABILITY : 'unapproved',
    revision: currentLedger?.revision || 0,
    activations: visible,
    status,
    effectText,
    displayStatus,
    executableClaim: false
  };
}

/** PC owners entitled to a content-free change notice when passive activations change. */
function audience(room) {
  const currentLedger = stored(room);
  if (!currentLedger) { return []; }
  return [...new Set(
    currentLedger.activations
      .map(item => item.target)
      .filter(ref => ref && ref.kind === 'character' && typeof ref.ownerUid === 'string')
      .map(ref => ref.ownerUid)
  )];
}

/** Compute the active, verified initiative bonus for one bound character actorRef. */
function activeInitiativeBonus(room, targetRef) {
  if (!policy.approved() || !room?.gameState || !isPlain(targetRef) || targetRef.kind !== 'character') {
    return 0;
  }
  const currentLedger = stored(room);
  if (!currentLedger || !currentLedger.activations.length) {
    return 0;
  }
  const targetKey = hash(targetRef);
  const activeMatching = currentLedger.activations
    .filter(item => hash(item.target) === targetKey)
    .map(item => evaluateActivation(room, item))
    .filter(item => item.ok && item.state === 'active');

  if (!activeMatching.length) {
    return 0;
  }
  const unitBonus = policy.HEIGHTENED_SENSES_PASSIVE.effect.magnitude;
  const mode = policy.stackingMode();
  if (mode === 'both-copies') {
    return activeMatching.length >= 2 ? unitBonus * 2 : unitBonus * 2;
  }
  return unitBonus;
}

/** Strip any client-forged passive bonus fields from a combatant entry. */
function stripForgedPassiveFields(combatant) {
  if (!isPlain(combatant)) { return { cleaned: combatant, hadForgedFields: false }; }
  const cleaned = { ...combatant };
  let hadForgedFields = false;
  for (const field of FORGED_CLIENT_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(cleaned, field)) {
      delete cleaned[field];
      hadForgedFields = true;
    }
  }
  return { cleaned, hadForgedFields };
}

/** Apply server-authoritative passive initiative contribution to a bound combatant entry at combat_started. */
function applyPassiveInitiativeToEntry(room, entry, located, hadForgedFields = false) {
  if (!policy.approved() || !isPlain(entry) || !located?.token || entry.actorRef?.kind !== 'character') {
    return entry;
  }
  const character = located.token.character || {};
  const stats = character.stats || located.token.stats || {};
  const agility = Number.isFinite(stats.agility) ? stats.agility : 10;
  const baseInitiativeMod = Number.isFinite(stats.initiativeMod) ? stats.initiativeMod : Math.floor((agility - 10) / 2);
  const passiveBonus = activeInitiativeBonus(room, entry.actorRef);

  const out = { ...entry };
  const hasValidD20 = Number.isSafeInteger(out.d20Roll) && out.d20Roll >= 1 && out.d20Roll <= 20 && out.customInitiative !== true;
  const hasCustomTotal = out.customInitiative === true || (Number.isFinite(out.initiative) && !hasValidD20);

  if (hasValidD20) {
    const composedMod = baseInitiativeMod + passiveBonus;
    out.initiative = out.d20Roll + composedMod;
    out.initiativeMod = composedMod;
    if (passiveBonus > 0) {
      out.passiveApplied = true;
    }
    return out;
  }

  if (hasCustomTotal) {
    if (passiveBonus > 0) {
      out.initiativeMod = baseInitiativeMod;
      out.passiveApplied = false;
    } else if (hadForgedFields) {
      out.initiativeMod = baseInitiativeMod;
    }
    return out;
  }

  return out;
}

/** Offline rollback scrub helper for `passiveLedger`: removes `passiveLedger` and recomputes checkpoint manifest hash. */
function scrubGameState(gameState) {
  if (!isPlain(gameState)) {
    return { ok: false, code: 'GAME_STATE_INVALID', reason: 'The supplied game state is not a plain record.' };
  }
  const out = clone(gameState);
  const summary = { passiveLedger: { removed: false, activations: 0, requests: 0 } };
  if (Object.prototype.hasOwnProperty.call(out, LEDGER_KEY)) {
    const raw = out[LEDGER_KEY];
    if (!isPlain(raw) || raw.version !== LEDGER_VERSION || !Array.isArray(raw.activations) || !Array.isArray(raw.requests)) {
      return { ok: false, code: 'PASSIVE_LEDGER_UNSUPPORTED', reason: 'The passive ledger is not a supported v1 shape; refusing to scrub it silently.' };
    }
    summary.passiveLedger = {
      removed: true,
      activations: raw.activations.length,
      requests: raw.requests.length
    };
    delete out[LEDGER_KEY];
  }
  return { ok: true, changed: summary.passiveLedger.removed, gameState: out, summary };
}

function scrubCheckpointBundle(bundle) {
  if (!isPlain(bundle) || !isPlain(bundle.manifest) || !isPlain(bundle.globalDoc) || !isPlain(bundle.mapDocsById)) {
    return { ok: false, code: 'CHECKPOINT_BUNDLE_INVALID', reason: 'A retained checkpoint bundle must carry manifest, globalDoc and mapDocsById.' };
  }
  const decoded = checkpoint.decodeCanonicalCheckpoint({
    checkpoint: bundle.manifest,
    globalDoc: bundle.globalDoc,
    mapDocsById: bundle.mapDocsById
  });
  if (!decoded.ok) {
    return { ok: false, code: `CHECKPOINT_${decoded.code}`, reason: decoded.reason || 'The retained checkpoint does not decode.' };
  }
  const scrub = scrubGameState(decoded.global);
  if (!scrub.ok) { return scrub; }
  const out = clone(bundle);
  if (!scrub.changed) {
    return { ok: true, changed: false, bundle: out, summary: scrub.summary };
  }
  const globalJson = checkpoint.stableStringify(scrub.gameState);
  const contentHash = checkpoint.sha256Hex(checkpoint.stableStringify([
    checkpoint.CHECKPOINT_SCHEMA_VERSION,
    globalJson,
    bundle.manifest.mapIds.map(mapId => [mapId, bundle.mapDocsById[mapId].snapshotJson])
  ]));
  out.manifest = { ...clone(bundle.manifest), contentHash };
  out.globalDoc = { ...clone(bundle.globalDoc), snapshotJson: globalJson };
  if (out.rootDoc) {
    out.rootDoc = { ...clone(out.rootDoc), checkpoint: clone(out.manifest) };
  }
  return { ok: true, changed: true, bundle: out, summary: scrub.summary };
}

module.exports = {
  CAPABILITY,
  LEDGER_KEY,
  LEDGER_VERSION,
  MAX_ACTIVATIONS,
  MAX_REQUESTS,
  emptyLedger,
  ledger,
  stored,
  evaluateActivation,
  planActivate,
  planRevoke,
  project,
  audience,
  activeInitiativeBonus,
  stripForgedPassiveFields,
  applyPassiveInitiativeToEntry,
  scrubGameState,
  scrubCheckpointBundle
};
