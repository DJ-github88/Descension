/** Ordinary GM recruitment and companion-list client boundary.
 * Builders are pure; requests use the existing actor-consequence socket fence. */
import { requestActorEvent } from './actorConsequenceService';
import { companionRefOf, sameCompanionRef } from './companionIdentity';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALUES = ['ally', 'enemy', 'neutral'];

const clone = value => JSON.parse(JSON.stringify(value));
const fail = code => ({ success: false, code });
const integer = value => Number.isSafeInteger(value) && value >= 0;
const validRef = ref => !!ref && typeof ref === 'object' &&
  ['creature', 'character'].includes(ref.kind) &&
  ['roomId', 'mapId', 'tokenId', 'instanceId'].every(key => typeof ref[key] === 'string' && ref[key].length > 0) &&
  (ref.kind !== 'character' || (typeof ref.ownerUid === 'string' && typeof ref.characterId === 'string')) &&
  (ref.kind !== 'creature' || (ref.ownerUid === undefined && ref.characterId === undefined));

export const COMPANION_REFUSALS = Object.freeze({
  forbidden: 'Only the current GM can set relationships or recruit this creature.',
  invalid_relationship: 'The relationship request was not valid for those exact actors.',
  relationship_actor_missing: 'One of those exact actors no longer exists. Refresh the room and retry.',
  relationship_revision_conflict: 'Relationships changed while you were choosing. Refresh and retry.',
  relationship_contract_unavailable: 'The room relationship store is unavailable.',
  source_not_hostile: 'That creature is not hostile to this recipient. Set the exact relationship to Enemy first.',
  already_recruited: 'That creature is already recruited by this recipient.',
  recipient_not_in_room: 'That recipient is no longer in the room.',
  recipient_not_in_party: 'That recipient is not in the server-held party.',
  party_source_unresolved: 'The server-held party membership is unavailable.',
  party_actor_missing: 'That recipient has no exact bound primary actor.',
  party_revision_unavailable: 'Party membership changed while you were choosing. Refresh and retry.',
  stale_actor_revision: 'That creature changed while you were choosing. Refresh and retry.',
  actor_binding_conflict: 'That creature binding is no longer current. Refresh the room and retry.',
  placement_identity_conflict: 'That placement identity no longer matches the recruited creature.',
  active_actor_elsewhere: 'The companion is on another map.',
  roster_revision_conflict: 'The companion roster changed while you were choosing. Refresh and retry.',
  roster_capacity: 'The companion roster is at capacity.',
  roster_snapshot_capacity: 'That creature snapshot is too large for the companion roster.',
  companion_placement_engine_unavailable: 'Placement is unavailable in this room.',
  companion_inactive: 'That companion is inactive.',
  companion_not_placed: 'That companion is not placed, so it cannot be dismissed.',
  companion_already_placed: 'That companion is already placed. Focus its existing token instead.',
  companion_snapshot_invalid: 'The stored companion record is incomplete; placement is refused.',
  invalid_placement: 'The companion placement request was not valid.',
  invalid_dismissal: 'The companion dismissal request was not valid.',
  map_not_found: 'That map no longer exists.',
  invalid_position: 'That drop position is not valid.',
  roster_state_conflict: 'The companion roster changed; refresh and retry.',
  actor_in_combat: 'The companion is in the combat roster. The GM must remove it from combat first.',
  turn_roster_unbound: 'The combat roster references an older companion incarnation. The GM must repair the roster first.',
  actor_has_combat_effects: 'The companion still has a live combat effect or cooldown. Resolve or remove it first.',
  roster_entry_missing: 'That companion entry no longer exists.',
  active_actor_missing: 'The placed companion token no longer exists.',
  source_not_creature: 'Only creature tokens can be recruited.',
  invalid_recruit: 'The recruitment request was not valid.',
  command_id_conflict: 'The same request id was already used with different content.',
  outcome_unknown: 'The previous attempt may have been accepted. Refresh the room before retrying.',
  retry_window_expired: 'That request is older than the retry window. Refresh the room and retry.',
  room_connection_unavailable: 'The room connection is unavailable.',
  room_authority_unavailable: 'The room authority is unavailable.',
  room_authority_lost: 'The room authority changed; refresh the room before retrying.',
  retired_principal: 'This session is no longer current; refresh before retrying.'
});

export const companionRefusalText = result => {
  const code = typeof result === 'string' ? result : result?.code;
  if (code && COMPANION_REFUSALS[code]) { return COMPANION_REFUSALS[code]; }
  if (result && typeof result === 'object' && typeof result.error === 'string' && result.error) { return result.error; }
  return code || 'The recruitment request was refused.';
};

export const COMPANION_RECONCILED_MESSAGE = 'Companion record reconciled to inactive; no token was placed.';
export const COMPANION_RECONCILE_REFRESH_FAILED_MESSAGE = 'Companion record reconciled to inactive; no token was placed. The companion list could not be refreshed; reopen Companions to reload.';

const RECONCILIATION_CAPABILITIES = ['actor-companion-place:v1', 'actor-companion-dismiss:v1'];

const reconciliationChosen = (result, rosterId) => {
  const receipt = result?.receipt;
  if (!receipt || receipt.version !== 1 || !receipt.adjudication ||
      typeof receipt.adjudication.chosenResult !== 'string') { return null; }
  let chosen;
  try { chosen = JSON.parse(receipt.adjudication.chosenResult); } catch (_) { return null; }
  if (!chosen || !RECONCILIATION_CAPABILITIES.includes(chosen.capability)) { return null; }
  if (chosen.placement !== 'inactive' || chosen.code !== 'companion_inactive') { return null; }
  if (!chosen.roster || chosen.roster.state !== 'inactive' ||
      (rosterId && chosen.roster.rosterId !== rosterId)) { return null; }
  return chosen;
};

/** A committed placed -> inactive reconciliation, not a no-op refusal. The
 * full safe envelope is required: placement/code/activeRef/roster state, status,
 * durability and a receipt whose chosenResult matches the same roster identity. */
export const isCompanionReconciliation = (result, rosterId) => {
  if (!result || result.success !== false || result.code !== 'companion_inactive') { return false; }
  if (result.placement !== 'inactive' || result.activeRef !== null) { return false; }
  if (!result.rosterEntry || result.rosterEntry.state !== 'inactive') { return false; }
  if (rosterId && result.rosterEntry.rosterId !== rosterId) { return false; }
  if (typeof result.status !== 'string' || typeof result.durability !== 'string') { return false; }
  return !!reconciliationChosen(result, rosterId || result.rosterEntry.rosterId);
};

const markCompanionReconciliation = (result, rosterId) => {
  if (!isCompanionReconciliation(result, rosterId)) { return result; }
  return { ...result, reconciled: true, reconciledMessage: COMPANION_RECONCILED_MESSAGE };
};


export function buildRelationshipSetCommand({ roomId, commandId, actionEpoch, baseCommitSequence, pairs, value,
  expectedRelationshipRevision }) {
  if (typeof roomId !== 'string' || !roomId || !UUID.test(commandId || '') || typeof actionEpoch !== 'string' || !actionEpoch ||
      !integer(baseCommitSequence) || !integer(expectedRelationshipRevision) || !VALUES.includes(value) ||
      !Array.isArray(pairs) || pairs.length === 0 || pairs.length > 64 || pairs.some(pair => !validRef(pair?.a) || !validRef(pair?.b))) {
    return fail('invalid_relationship');
  }
  return { success: true, command: {
    version: 1, roomId, commandId, actionEpoch, baseCommitSequence,
    pairs: pairs.map(pair => ({ a: clone(pair.a), b: clone(pair.b) })), value, expectedRelationshipRevision
  } };
}

export function buildRecruitCommand({ roomId, commandId, actionEpoch, baseCommitSequence, source,
  expectedSourceRevision, recipientUid, expectedPartyRevision, expectedRelationshipRevision, expectedRosterRevision }) {
  if (typeof roomId !== 'string' || !roomId || !UUID.test(commandId || '') || typeof actionEpoch !== 'string' || !actionEpoch ||
      !integer(baseCommitSequence) || !validRef(source) || !integer(expectedSourceRevision) ||
      typeof recipientUid !== 'string' || !recipientUid || !integer(expectedRelationshipRevision) ||
      !integer(expectedRosterRevision) ||
      (expectedPartyRevision !== undefined && expectedPartyRevision !== null && !integer(expectedPartyRevision))) {
    return fail('invalid_recruit');
  }
  return { success: true, command: {
    version: 1, roomId, commandId, actionEpoch, baseCommitSequence, source: clone(source),
    expectedSourceRevision, recipientUid,
    ...(expectedPartyRevision !== undefined && expectedPartyRevision !== null ? { expectedPartyRevision } : {}),
    expectedRelationshipRevision, expectedRosterRevision
  } };
}

const validPosition = position => !!position && typeof position === 'object' && !Array.isArray(position) &&
  Number.isFinite(position.x) && Number.isFinite(position.y) &&
  Math.abs(position.x) <= 10000000 && Math.abs(position.y) <= 10000000;

export function buildCompanionPlaceCommand({ roomId, commandId, actionEpoch, baseCommitSequence, rosterId,
  expectedRosterRevision, mapId, position, expectedActiveRef }) {
  if (typeof roomId !== 'string' || !roomId || !UUID.test(commandId || '') || typeof actionEpoch !== 'string' || !actionEpoch ||
      !integer(baseCommitSequence) || typeof rosterId !== 'string' || !rosterId || !integer(expectedRosterRevision) ||
      typeof mapId !== 'string' || !mapId || !validPosition(position) ||
      (expectedActiveRef !== undefined && expectedActiveRef !== null && !validRef(expectedActiveRef))) {
    return fail('invalid_placement');
  }
  return { success: true, command: {
    version: 1, roomId, commandId, actionEpoch, baseCommitSequence, rosterId,
    expectedRosterRevision, mapId, position: { x: position.x, y: position.y },
    ...(expectedActiveRef ? { expectedActiveRef: clone(expectedActiveRef) } : {})
  } };
}

export function buildCompanionDismissCommand({ roomId, commandId, actionEpoch, baseCommitSequence, rosterId,
  expectedRosterRevision, expectedActiveRef }) {
  if (typeof roomId !== 'string' || !roomId || !UUID.test(commandId || '') || typeof actionEpoch !== 'string' || !actionEpoch ||
      !integer(baseCommitSequence) || typeof rosterId !== 'string' || !rosterId || !integer(expectedRosterRevision) ||
      !validRef(expectedActiveRef)) {
    return fail('invalid_dismissal');
  }
  return { success: true, command: {
    version: 1, roomId, commandId, actionEpoch, baseCommitSequence, rosterId,
    expectedRosterRevision, expectedActiveRef: clone(expectedActiveRef)
  } };
}

export const COMPANION_DRAG_MIME = 'application/companion-roster';

export function buildCompanionDragPayload(entry) {
  if (!entry || typeof entry.rosterId !== 'string' || !entry.rosterId ||
      typeof entry.stableTokenId !== 'string' || !entry.stableTokenId) {
    return fail('invalid_placement');
  }
  if (entry.state !== 'available') {return fail('companion_already_placed');}
  return { success: true, payload: {
    version: 1,
    type: 'companion-roster',
    rosterId: entry.rosterId,
    stableTokenId: entry.stableTokenId,
    displayName: entry.displayName || null
  } };
}

const uuid = () => (typeof crypto !== 'undefined' && crypto.randomUUID
  ? crypto.randomUUID()
  : '00000000-0000-4000-8000-000000000000');

export async function readRoomAdmission(roomId) {
  const snapshot = await requestActorEvent('actor_snapshot', { roomId });
  if (!snapshot?.success) { return { ...snapshot, success: false }; }
  return { success: true, roomId: snapshot.roomId, actionEpoch: snapshot.actionEpoch,
    baseCommitSequence: snapshot.commitSequence, maps: snapshot.maps };
}

export async function readRecruitmentContext(roomId, sourceRef) {
  const snapshot = await readRoomAdmission(roomId);
  if (!snapshot.success) { return snapshot; }
  const map = snapshot.maps?.[sourceRef?.mapId];
  const token = map?.tokens?.[sourceRef?.tokenId] || map?.creatures?.[sourceRef?.tokenId];
  const exact = companionRefOf(token);
  if (!exact || !sameCompanionRef(exact, sourceRef)) {
    return { success: false, code: 'actor_binding_conflict' };
  }
  const revision = token?.state?.actorContract?.revision;
  if (!integer(revision)) { return { success: false, code: 'actor_binding_conflict' }; }
  return { success: true, roomId: snapshot.roomId, actionEpoch: snapshot.actionEpoch,
    baseCommitSequence: snapshot.baseCommitSequence, sourceRef: exact, sourceRevision: revision };
}

export const listRecruitRecipients = roomId => requestActorEvent('actor_recruit_recipients', { roomId });

export const readRelationship = (roomId, a, b) => requestActorEvent('actor_relationship_list', { roomId, a, b });

export async function setRelationship(input) {
  const built = buildRelationshipSetCommand({ ...input, commandId: input.commandId || uuid() });
  if (built.success === false) { return built; }
  const result = await requestActorEvent('actor_relationship_set', built.command);
  return result || { success: false, code: 'outcome_unknown' };
}

export const listCompanions = roomId => requestActorEvent('actor_companion_list', { roomId });

export async function recruitCompanion(input) {
  const built = buildRecruitCommand({ ...input, commandId: input.commandId || uuid() });
  if (built.success === false) { return built; }
  const result = await requestActorEvent('actor_recruit', built.command);
  return result || { success: false, code: 'outcome_unknown' };
}

export async function focusPlacedCompanion({ roomId, entry, rosterRevision, position, mapId }) {
  const activeRef = entry?.activeRef;
  if (!entry?.rosterId || !validRef(activeRef)) { return fail('active_actor_missing'); }
  if (typeof mapId !== 'string' || !mapId) { return fail('invalid_placement'); }
  // The server contract refuses active_actor_elsewhere when the request map is
  // not the companion's map. Use the caller's current map here, never the
  // companion's map, so a different-map focus cannot silently move the camera.
  if (activeRef.mapId !== mapId) { return fail('active_actor_elsewhere'); }
  const admission = await readRoomAdmission(roomId);
  if (!admission.success) { return admission; }
  const built = buildCompanionPlaceCommand({
    roomId, commandId: uuid(), actionEpoch: admission.actionEpoch,
    baseCommitSequence: admission.baseCommitSequence, rosterId: entry.rosterId,
    expectedRosterRevision: rosterRevision, mapId,
    position: position || { x: 0, y: 0 }, expectedActiveRef: activeRef
  });
  if (built.success === false) { return built; }
  const result = await requestActorEvent('actor_companion_place', built.command);
  return markCompanionReconciliation(result || { success: false, code: 'outcome_unknown' }, entry.rosterId);
}

/** Place one available roster entry at a fresh map position. The server derives
 * the creature snapshot from the roster; the client sends only the stable roster
 * identity, expected revision, map and position. A repeat drop of an entry that
 * is already placed focuses the exact existing incarnation instead of spawning. */
export async function placeCompanion({ roomId, rosterId, mapId, position }) {
  if (typeof roomId !== 'string' || !roomId || typeof rosterId !== 'string' || !rosterId ||
      typeof mapId !== 'string' || !mapId || !validPosition(position)) {
    return fail('invalid_placement');
  }
  const listed = await listCompanions(roomId);
  if (!listed?.success) { return listed || { success: false, code: 'room_connection_unavailable' }; }
  const entry = (listed.entries || []).find(item => item.rosterId === rosterId);
  if (!entry) { return fail('roster_entry_missing'); }
  if (entry.state === 'placed') {
    return focusPlacedCompanion({ roomId, entry, rosterRevision: listed.rosterRevision, position, mapId });
  }
  if (entry.state === 'inactive') { return fail('companion_inactive'); }
  if (entry.state !== 'available') { return fail('roster_state_conflict'); }
  const admission = await readRoomAdmission(roomId);
  if (!admission.success) { return admission; }
  const built = buildCompanionPlaceCommand({
    roomId, commandId: uuid(), actionEpoch: admission.actionEpoch,
    baseCommitSequence: admission.baseCommitSequence, rosterId: entry.rosterId,
    expectedRosterRevision: listed.rosterRevision, mapId, position
  });
  if (built.success === false) { return built; }
  const result = await requestActorEvent('actor_companion_place', built.command);
  if (result?.code === 'roster_revision_conflict') {
    // A concurrent placement/focus won. Resolve against canonical state: if the
    // same companion is now placed, focus it; never retry with a fresh spawn.
    const fresh = await listCompanions(roomId);
    const current = (fresh?.entries || []).find(item => item.rosterId === rosterId);
    if (current?.state === 'placed') {
      return focusPlacedCompanion({ roomId, entry: current, rosterRevision: fresh.rosterRevision, position, mapId });
    }
  }
  return markCompanionReconciliation(result || { success: false, code: 'outcome_unknown' }, rosterId);
}

export async function placeCompanionFromDrop({ roomId, payload, mapId, position }) {
  if (!payload || typeof payload.rosterId !== 'string' || !payload.rosterId) { return fail('invalid_placement'); }
  return placeCompanion({ roomId, rosterId: payload.rosterId, mapId, position });
}

/** Safe placed -> available dismissal. The server retains the exact current
 * token snapshot and refuses when the combat roster/effects still hold it. */
export async function dismissCompanion({ roomId, rosterId }) {
  if (typeof roomId !== 'string' || !roomId || typeof rosterId !== 'string' || !rosterId) {
    return fail('invalid_dismissal');
  }
  const listed = await listCompanions(roomId);
  if (!listed?.success) { return listed || { success: false, code: 'room_connection_unavailable' }; }
  const entry = (listed.entries || []).find(item => item.rosterId === rosterId);
  if (!entry) { return fail('roster_entry_missing'); }
  if (entry.state === 'inactive') { return fail('companion_inactive'); }
  if (entry.state !== 'placed') { return fail('companion_not_placed'); }
  const admission = await readRoomAdmission(roomId);
  if (!admission.success) { return admission; }
  const built = buildCompanionDismissCommand({
    roomId, commandId: uuid(), actionEpoch: admission.actionEpoch,
    baseCommitSequence: admission.baseCommitSequence, rosterId: entry.rosterId,
    expectedRosterRevision: listed.rosterRevision, expectedActiveRef: entry.activeRef
  });
  if (built.success === false) { return built; }
  const result = await requestActorEvent('actor_companion_dismiss', built.command);
  return markCompanionReconciliation(result || { success: false, code: 'outcome_unknown' }, entry.rosterId);
}
