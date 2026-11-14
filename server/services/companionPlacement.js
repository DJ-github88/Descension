/** Authoritative persistent-companion placement and dismissal.
 *
 * One placement/dismissal is one actor-consequence snapshot: the new token
 * incarnation (or its deletion), the companion-roster transition, the receipt
 * and the checkpoint are admitted together through FirebaseBatchWriter
 * .admitConsequence. Nothing is written before admission and nothing is
 * repaired by an after-commit callback.
 *
 * Identity mapping:
 * - rosterId            stable logical companion identity (source recruitment ref hash)
 * - stableTokenId       stable placement identity, reused across incarnations
 * - activeRef.instanceId exact incarnation identity, new on every placement
 *
 * A stale ref never becomes valid because stableTokenId is reused: every exact
 * lookup compares the full ref, including instanceId.
 */
const crypto = require('crypto');
const actors = require('./actorConsequences');
const roster = require('./companionRoster');

const VERSION = 1;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_COORDINATE = 10000000;

const CODES = Object.freeze({
  forbidden: 'forbidden',
  invalid_placement: 'invalid_placement',
  invalid_dismissal: 'invalid_dismissal',
  roster_entry_missing: 'roster_entry_missing',
  roster_revision_conflict: 'roster_revision_conflict',
  roster_state_conflict: 'roster_state_conflict',
  companion_inactive: 'companion_inactive',
  companion_not_placed: 'companion_not_placed',
  companion_already_placed: 'companion_already_placed',
  companion_snapshot_invalid: 'companion_snapshot_invalid',
  active_actor_missing: 'active_actor_missing',
  active_actor_elsewhere: 'active_actor_elsewhere',
  placement_identity_conflict: 'placement_identity_conflict',
  map_not_found: 'map_not_found',
  invalid_position: 'invalid_position',
  actor_in_combat: 'actor_in_combat',
  turn_roster_unbound: 'turn_roster_unbound',
  actor_has_combat_effects: 'actor_has_combat_effects',
  roster_capacity: 'roster_capacity',
  roster_snapshot_capacity: 'roster_snapshot_capacity'
});

const PLACE_KEYS = Object.freeze(['version', 'roomId', 'commandId', 'baseCommitSequence', 'rosterId',
  'expectedRosterRevision', 'mapId', 'position', 'expectedActiveRef', 'actionEpoch']);
const DISMISS_KEYS = Object.freeze(['version', 'roomId', 'commandId', 'baseCommitSequence', 'rosterId',
  'expectedRosterRevision', 'expectedActiveRef', 'actionEpoch']);

const fail = (code, message = code, details = null) => {
  const error = new Error(message);
  error.code = code;
  if (details && typeof details === 'object') {error.details = details;}
  throw error;
};
const string = value => typeof value === 'string' && value.length > 0 && value.length <= 300;
const integer = value => Number.isSafeInteger(value) && value >= 0;
const finite = value => typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= MAX_COORDINATE;
const plain = value => !!value && typeof value === 'object' && !Array.isArray(value) &&
  [Object.prototype, null].includes(Object.getPrototypeOf(value));

function validatePosition(position) {
  if (!plain(position) || !finite(position.x) || !finite(position.y)) {fail(CODES.invalid_position);}
  return { x: position.x, y: position.y };
}

function validatePlace(request) {
  if (!plain(request) || Object.keys(request).some(key => !PLACE_KEYS.includes(key))) {fail(CODES.invalid_placement);}
  if (request.version !== VERSION || !string(request.roomId) || !UUID.test(request.commandId || '') ||
      !integer(request.baseCommitSequence) || !string(request.rosterId) || !integer(request.expectedRosterRevision) ||
      !string(request.mapId) || !string(request.actionEpoch)) {fail(CODES.invalid_placement);}
  validatePosition(request.position);
  if (request.expectedActiveRef !== undefined && request.expectedActiveRef !== null) {
    try {actors.validateRef(request.expectedActiveRef);} catch (error) {fail(CODES.invalid_placement, error.message);}
  }
  if (actors.bytes(request) > 16384) {fail(CODES.invalid_placement);}
}

function validateDismiss(request) {
  if (!plain(request) || Object.keys(request).some(key => !DISMISS_KEYS.includes(key))) {fail(CODES.invalid_dismissal);}
  if (request.version !== VERSION || !string(request.roomId) || !UUID.test(request.commandId || '') ||
      !integer(request.baseCommitSequence) || !string(request.rosterId) || !integer(request.expectedRosterRevision) ||
      !string(request.actionEpoch)) {fail(CODES.invalid_dismissal);}
  if (request.expectedActiveRef !== undefined && request.expectedActiveRef !== null) {
    try {actors.validateRef(request.expectedActiveRef);} catch (error) {fail(CODES.invalid_dismissal, error.message);}
  }
  if (actors.bytes(request) > 8192) {fail(CODES.invalid_dismissal);}
}

function mapFor(room, mapId) {
  const map = room.gameState?.maps?.[mapId];
  if (!plain(map)) {fail(CODES.map_not_found);}
  return map;
}

function entryFor(room, rosterId) {
  const entry = roster.entries(room)[rosterId];
  if (!entry) {fail(CODES.roster_entry_missing);}
  return entry;
}

function authorize(entry, player, uid) {
  if (!player || (player.isGM !== true && entry.recipientUid !== uid)) {fail(CODES.forbidden);}
}

function liveTokensWithId(room, tokenId) {
  const found = [];
  for (const [mapId, map] of Object.entries(room.gameState?.maps || {})) {
    for (const field of ['tokens', 'creatures', 'characterTokens']) {
      if (map?.[field] && Object.prototype.hasOwnProperty.call(map[field], tokenId)) {
        found.push({ mapId, field, token: map[field][tokenId] });
      }
    }
  }
  return found;
}

function assertNoLiveDuplicate(room, entry) {
  if (liveTokensWithId(room, entry.stableTokenId).length) {fail(CODES.placement_identity_conflict);}
  const other = roster.entryForStableToken(room, entry.stableTokenId);
  if (other && other.rosterId !== entry.rosterId) {fail(CODES.placement_identity_conflict);}
}

function activeTokenMissing(room, entry) {
  if (!entry.activeRef) {return true;}
  try {actors.locate(room, entry.activeRef); return false;} catch (_) {return true;}
}

function combatReferenceForStableToken(room, stableTokenId) {
  const order = room.gameState?.combat?.turnOrder;
  if (!Array.isArray(order)) {return null;}
  return order.find(item => item && (item.tokenId === stableTokenId ||
    (item.actorRef && item.actorRef.tokenId === stableTokenId))) || null;
}

function assertNoStaleCombatReference(room, entry) {
  if (combatReferenceForStableToken(room, entry.stableTokenId)) {
    fail(CODES.turn_roster_unbound,
      'The turn order still references an older incarnation of this companion. The GM must repair the combat roster before placement.');
  }
}

function assertDismissible(room, entry) {
  const live = liveTokensWithId(room, entry.stableTokenId);
  // A missing exact token is handled by locate() as active_actor_missing; a
  // duplicate live placement or a token on another map is an identity conflict.
  if (live.length > 1) {fail(CODES.placement_identity_conflict);}
  if (live.length === 1 && (live[0].mapId !== entry.activeRef.mapId || live[0].field !== 'tokens')) {
    fail(CODES.placement_identity_conflict);
  }
  const other = roster.entryForStableToken(room, entry.stableTokenId);
  if (other && other.rosterId !== entry.rosterId) {fail(CODES.placement_identity_conflict);}
}

function validateSnapshot(entry) {
  const snapshot = entry.snapshot;
  if (!plain(snapshot) || (snapshot.id !== undefined && snapshot.id !== entry.stableTokenId)) {
    fail(CODES.companion_snapshot_invalid);
  }
  if (!plain(snapshot.state)) {fail(CODES.companion_snapshot_invalid);}
  const contract = snapshot.state.actorContract;
  if (contract !== undefined && (!plain(contract) || contract.version !== 1 || contract.kind !== 'creature' ||
      contract.tokenId !== entry.stableTokenId)) {fail(CODES.companion_snapshot_invalid);}
  for (const key of ['currentHp', 'currentMana', 'currentActionPoints', 'tempHealth', 'tempMana', 'tempActionPoints']) {
    if (snapshot.state[key] !== undefined && (!Number.isFinite(snapshot.state[key]) || snapshot.state[key] < 0)) {
      fail(CODES.companion_snapshot_invalid);
    }
  }
  for (const [current, max] of [['currentHp', 'maxHp'], ['currentMana', 'maxMana'], ['currentActionPoints', 'maxAP']]) {
    const maximum = snapshot.state[max] ?? snapshot.stats?.[max];
    if (snapshot.state[current] !== undefined && maximum !== undefined && snapshot.state[current] > maximum) {
      fail(CODES.companion_snapshot_invalid);
    }
  }
  for (const conditions of [snapshot.conditions, snapshot.state.conditions]) {
    if (conditions === undefined) {continue;}
    if (!Array.isArray(conditions) || conditions.some(record => !plain(record))) {fail(CODES.companion_snapshot_invalid);}
    for (const record of conditions) {
      for (const key of ['target', 'sourceActor']) {
        if (record[key] === undefined) {continue;}
        try {actors.validateRef(record[key]);} catch (_) {fail(CODES.companion_snapshot_invalid);}
      }
    }
  }
  return snapshot;
}

function removalRefusal(room, token) {
  const combat = require('./combatRoster');
  const inRoster = combat.rosterEntryFor(room, token);
  if (inRoster) {
    return {
      code: inRoster.exact ? CODES.actor_in_combat : CODES.turn_roster_unbound,
      message: inRoster.exact
        ? 'This exact companion is in the turn order. The GM must remove it from combat before dismissal.'
        : 'The turn order references an older incarnation of this companion. The GM must repair the roster before dismissal.'
    };
  }
  const effects = combat.hasLiveCombatEffects(room, token);
  if (effects) {
    return {
      code: CODES.actor_has_combat_effects,
      message: 'This companion still has a live scheduled effect or cooldown. Resolve or remove the exact effect before dismissal.',
      details: effects
    };
  }
  return null;
}

/** Read-only validation. Returns the focus result for a placed entry, or the
 * validated available-placement plan. Never mutates the room. */
function preflight(room, player, uid, request) {
  validatePlace(request);
  if (request.roomId !== room.id) {fail(CODES.invalid_placement);}
  ledgerGuards(room, request, CODES.invalid_placement);
  const entry = entryFor(room, request.rosterId);
  authorize(entry, player, uid);
  if (roster.revision(room) !== request.expectedRosterRevision) {fail(CODES.roster_revision_conflict);}
  if (entry.state === 'inactive') {fail(CODES.companion_inactive);}
  if (entry.state === 'placed') {
    if (request.expectedActiveRef && entry.activeRef && actors.hash(request.expectedActiveRef) !== actors.hash(entry.activeRef)) {
      fail(CODES.placement_identity_conflict);
    }
    if (activeTokenMissing(room, entry)) {
      return { mode: 'reconcile', activeRef: entry.activeRef ? actors.clone(entry.activeRef) : null, entry };
    }
    if (entry.activeRef.mapId !== request.mapId) {fail(CODES.active_actor_elsewhere);}
    return { mode: 'focus', activeRef: actors.clone(entry.activeRef),
      rosterEntry: roster.projectEntry(entry, player.isGM === true) };
  }
  if (entry.state !== 'available') {fail(CODES.roster_state_conflict);}
  if (request.expectedActiveRef) {fail(CODES.placement_identity_conflict);}
  mapFor(room, request.mapId);
  const position = validatePosition(request.position);
  const snapshot = validateSnapshot(entry);
  assertNoLiveDuplicate(room, entry);
  assertNoStaleCombatReference(room, entry);
  return { mode: 'place', entry, snapshot, mapId: request.mapId, position };
}

function retargetRecord(record, oldRef, newRef) {
  const next = { ...record };
  const sameTarget = next.target && (actors.hash(next.target) === actors.hash(oldRef) ||
    (next.target.kind === newRef.kind && next.target.tokenId === newRef.tokenId));
  if (sameTarget) {
    next.target = actors.clone(newRef);
    next.targetId = newRef.tokenId;
    next.targetType = newRef.kind;
  }
  if (next.sourceActor && actors.hash(next.sourceActor) === actors.hash(oldRef)) {
    next.sourceActor = actors.clone(newRef);
  }
  return next;
}

function buildToken(entry, snapshot, newRef, position, recipient, now, uid, commandId) {
  const oldContract = snapshot.state?.actorContract;
  const oldRef = oldContract ? actors.refFor(oldContract) : (entry.sourceRef || entry.activeRef);
  const token = {
    ...actors.clone(snapshot),
    id: entry.stableTokenId,
    position: { x: position.x, y: position.y },
    ownerUserId: entry.recipientUid,
    ownerPlayerId: recipient?.id || null,
    playerId: recipient?.id || null,
    createdAt: now,
    updatedAt: now,
    state: { ...actors.clone(snapshot.state) }
  };
  token.state.actorContract = {
    version: 1,
    ...newRef,
    revision: 0,
    bindingProvenance: {
      boundBy: uid,
      source: 'companion-placement:v1',
      rosterId: entry.rosterId,
      stableTokenId: entry.stableTokenId,
      placementCommandId: commandId,
      priorInstanceId: oldRef?.instanceId || null
    }
  };
  if (Array.isArray(token.conditions)) {
    token.conditions = token.conditions.map(record => retargetRecord(record, oldRef, newRef));
  }
  if (Array.isArray(token.state.conditions)) {
    token.state.conditions = token.state.conditions.map(record => retargetRecord(record, oldRef, newRef));
  }
  return token;
}

function ledgerGuards(room, request, invalidCode) {
  const prior = actors.ledger(room);
  if (request.actionEpoch !== actors.epoch(room)) {fail('outcome_unknown');}
  if (request.baseCommitSequence < prior.replayFloor) {fail('retry_window_expired');}
  if (request.baseCommitSequence > prior.commitSequence) {fail(invalidCode);}
}

/** Placed -> inactive when the exact active incarnation is missing. This is a
 * real command consequence: one roster revision, receipt and checkpoint through
 * the same writer path. It never creates a token or an available companion. */
function stageReconciliation(room, player, uid, request, confirmedRevision, mode) {
  const dismiss = mode === 'dismiss';
  if (dismiss) {validateDismiss(request);} else {validatePlace(request);}
  if (request.roomId !== room.id) {fail(dismiss ? CODES.invalid_dismissal : CODES.invalid_placement);}
  ledgerGuards(room, request, dismiss ? CODES.invalid_dismissal : CODES.invalid_placement);
  const entry = entryFor(room, request.rosterId);
  authorize(entry, player, uid);
  if (roster.revision(room) !== request.expectedRosterRevision) {fail(CODES.roster_revision_conflict);}
  if (entry.state === 'inactive') {
    return { reconciled: false, alreadyInactive: true, entry };
  }
  if (entry.state !== 'placed') {fail(CODES.roster_state_conflict);}
  if (request.expectedActiveRef && entry.activeRef && actors.hash(request.expectedActiveRef) !== actors.hash(entry.activeRef)) {
    fail(CODES.placement_identity_conflict);
  }
  if (!activeTokenMissing(room, entry)) {fail(CODES.roster_state_conflict);}
  const now = Date.now();
  const next = actors.clone(room.gameState);
  let applied;
  try {
    applied = roster.applyInactive(next, entry.rosterId, now);
  } catch (error) {
    fail(error.code || CODES.roster_state_conflict, error.message);
  }
  const capability = dismiss ? 'actor-companion-dismiss:v1' : 'actor-companion-place:v1';
  const chosen = {
    capability,
    placement: 'inactive',
    code: CODES.companion_inactive,
    roster: roster.projectEntry(applied.entry, false),
    priorActiveRef: entry.activeRef ? actors.clone(entry.activeRef) : null
  };
  const command = {
    ...request,
    adjudication: {
      definitionId: capability,
      definitionVersionOrHash: capability,
      chosenResult: JSON.stringify(chosen),
      adjustmentReason: 'The placed companion has no live exact incarnation. The roster entry is reconciled to inactive; no token, resource, condition, healing or resurrection is created.'
    }
  };
  const staged = actors.finishStage(room, uid, command, { kind: dismiss ? 'companion-dismiss' : 'companion-place', authorizerUid: uid },
    confirmedRevision, next, []);
  staged.receipt.contentHash = actors.hash(request);
  staged.entry = applied.entry;
  staged.reconciledRef = entry.activeRef ? actors.clone(entry.activeRef) : null;
  staged.reconciled = true;
  staged.reconcileMode = mode;
  return staged;
}

function stagePlacement(room, player, uid, request, confirmedRevision) {
  validatePlace(request);
  if (request.roomId !== room.id) {fail(CODES.invalid_placement);}
  ledgerGuards(room, request, CODES.invalid_placement);
  const entry = entryFor(room, request.rosterId);
  authorize(entry, player, uid);
  if (roster.revision(room) !== request.expectedRosterRevision) {fail(CODES.roster_revision_conflict);}
  if (entry.state === 'inactive') {fail(CODES.companion_inactive);}
  if (entry.state === 'placed') {fail(CODES.companion_already_placed);}
  if (entry.state !== 'available') {fail(CODES.roster_state_conflict);}
  if (request.expectedActiveRef) {fail(CODES.placement_identity_conflict);}
  mapFor(room, request.mapId);
  const position = validatePosition(request.position);
  const snapshot = validateSnapshot(entry);
  assertNoLiveDuplicate(room, entry);
  assertNoStaleCombatReference(room, entry);

  const now = Date.now();
  const instanceId = crypto.randomUUID();
  const newRef = { kind: 'creature', roomId: room.id, mapId: request.mapId,
    tokenId: entry.stableTokenId, instanceId };
  try {actors.validateRef(newRef);} catch (error) {fail(CODES.invalid_placement, error.message);}
  const recipient = [...(room.players?.values?.() || [])].find(member => member && member.userId === entry.recipientUid) || null;
  const token = buildToken(entry, snapshot, newRef, position, recipient, now, uid, request.commandId);

  const next = actors.clone(room.gameState);
  next.maps[request.mapId].tokens = next.maps[request.mapId].tokens || {};
  next.maps[request.mapId].tokens[entry.stableTokenId] = token;
  let applied;
  try {
    applied = roster.applyPlacement(next, {
      rosterId: entry.rosterId,
      stableTokenId: entry.stableTokenId,
      activeRef: newRef,
      snapshot: token,
      now
    });
  } catch (error) {
    fail(error.code || CODES.roster_state_conflict, error.message);
  }

  const chosen = {
    capability: 'actor-companion-place:v1',
    placement: 'placed',
    roster: roster.projectEntry(applied.entry, false),
    activeRef: actors.clone(newRef)
  };
  const command = {
    ...request,
    adjudication: {
      definitionId: 'actor-companion-place:v1',
      definitionVersionOrHash: 'actor-companion-place:v1',
      chosenResult: JSON.stringify(chosen),
      adjustmentReason: 'Recipient/GM placement of one available companion. The token incarnation and the roster transition are admitted in one checkpoint snapshot. No HP, mana, AP, cooldown or condition is reset; stableTokenId is reused and instanceId is new.'
    }
  };
  const staged = actors.finishStage(room, uid, command, { kind: 'companion-place', authorizerUid: uid },
    confirmedRevision, next, []);
  staged.receipt.contentHash = actors.hash(request);
  token.state.actorLifecycle = actors.clone(staged.next.actorProjection);
  staged.entry = applied.entry;
  staged.activeRef = newRef;
  staged.clearControl = { tokenId: newRef.tokenId, mapId: newRef.mapId };
  return staged;
}

function stageDismissal(room, player, uid, request, confirmedRevision) {
  validateDismiss(request);
  if (request.roomId !== room.id) {fail(CODES.invalid_dismissal);}
  ledgerGuards(room, request, CODES.invalid_dismissal);
  const entry = entryFor(room, request.rosterId);
  authorize(entry, player, uid);
  if (roster.revision(room) !== request.expectedRosterRevision) {fail(CODES.roster_revision_conflict);}
  if (entry.state === 'inactive') {fail(CODES.companion_inactive);}
  if (entry.state === 'available') {fail(CODES.companion_not_placed);}
  if (entry.state !== 'placed') {fail(CODES.roster_state_conflict);}
  if (request.expectedActiveRef && entry.activeRef && actors.hash(request.expectedActiveRef) !== actors.hash(entry.activeRef)) {
    fail(CODES.placement_identity_conflict);
  }
  if (activeTokenMissing(room, entry)) {
    return stageReconciliation(room, player, uid, request, confirmedRevision, 'dismiss');
  }
  assertDismissible(room, entry);
  let located;
  try {located = actors.locate(room, entry.activeRef);} catch (error) {fail(CODES.active_actor_missing, error.message);}
  const refusal = removalRefusal(room, located.token);
  if (refusal) {fail(refusal.code, refusal.message, refusal.details || null);}

  const now = Date.now();
  const snapshot = actors.clone(located.token);
  const next = actors.clone(room.gameState);
  let applied;
  try {
    applied = roster.applyDismissal(next, entry.activeRef, { snapshot, now });
  } catch (error) {
    fail(error.code || CODES.roster_state_conflict, error.message);
  }
  delete next.maps[entry.activeRef.mapId][located.field][entry.activeRef.tokenId];

  const chosen = {
    capability: 'actor-companion-dismiss:v1',
    placement: 'available',
    roster: roster.projectEntry(applied.entry, false),
    priorActiveRef: actors.clone(entry.activeRef)
  };
  const command = {
    ...request,
    adjudication: {
      definitionId: 'actor-companion-dismiss:v1',
      definitionVersionOrHash: 'actor-companion-dismiss:v1',
      chosenResult: JSON.stringify(chosen),
      adjustmentReason: 'Recipient/GM dismissal of one placed companion. The exact token incarnation is removed and its canonical snapshot is retained in the same checkpoint snapshot. Combat-roster removal guards run first; no resource, condition, resurrection or lifetime rule is invented.'
    }
  };
  const staged = actors.finishStage(room, uid, command, { kind: 'companion-dismiss', authorizerUid: uid },
    confirmedRevision, next, []);
  staged.receipt.contentHash = actors.hash(request);
  staged.entry = applied.entry;
  staged.dismissedRef = actors.clone(entry.activeRef);
  staged.clearControl = { tokenId: entry.activeRef.tokenId, mapId: entry.activeRef.mapId };
  return staged;
}

function replay(receipt) {
  try {
    const chosen = JSON.parse(receipt?.adjudication?.chosenResult || '{}');
    if (!['actor-companion-place:v1', 'actor-companion-dismiss:v1'].includes(chosen.capability)) {return null;}
    if (chosen.placement === 'inactive') {
      return {
        placement: 'inactive',
        code: chosen.code || CODES.companion_inactive,
        activeRef: null,
        priorActiveRef: chosen.priorActiveRef || null,
        rosterEntry: chosen.roster || null
      };
    }
    return {
      placement: chosen.placement,
      activeRef: chosen.activeRef || null,
      priorActiveRef: chosen.priorActiveRef || null,
      rosterEntry: chosen.roster || null
    };
  } catch (_) {
    return null;
  }
}

function closeApprovals(room, ref) {
  try {return require('./combatRoster').closeApprovalsForRef(room, ref, 'actor_removed');}
  catch (_) {return [];}
}

module.exports = { VERSION, CODES, PLACE_KEYS, DISMISS_KEYS, validatePlace, validateDismiss, preflight,
  stagePlacement, stageReconciliation, stageDismissal, replay, removalRefusal, closeApprovals, validatePosition };
