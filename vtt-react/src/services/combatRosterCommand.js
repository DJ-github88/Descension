/** Pure request builders for the GM-only actor_combat_roster command. No store or socket access. */
const REF_KEYS = ['kind', 'roomId', 'mapId', 'tokenId', 'instanceId', 'ownerUid', 'characterId'];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const HEX = /^[a-f0-9]{64}$/i;

export const refOfContract = contract => (contract?.version === 1
  ? Object.fromEntries(REF_KEYS.filter(key => contract[key] !== undefined).map(key => [key, contract[key]]))
  : null);

export const rosterRefKey = ref => (ref
  ? REF_KEYS.filter(key => ref[key] !== undefined).map(key => `${key}:${ref[key]}`).join('|')
  : '');

export const sameRosterRef = (left, right) => !!left && !!right && rosterRefKey(left) === rosterRefKey(right);

const fail = code => ({ success: false, code });
const validRef = ref => !!ref && typeof ref === 'object' &&
  ['creature', 'character'].includes(ref.kind) &&
  ['roomId', 'mapId', 'tokenId', 'instanceId'].every(key => typeof ref[key] === 'string' && ref[key].length > 0) &&
  (ref.kind !== 'character' || (typeof ref.ownerUid === 'string' && typeof ref.characterId === 'string')) &&
  (ref.kind !== 'creature' || (ref.ownerUid === undefined && ref.characterId === undefined));
const validClock = clock => clock === null || (!!clock && typeof clock.id === 'string' && UUID.test(clock.id) &&
  Number.isSafeInteger(clock.sequence) && clock.sequence >= 0);

function common({ roomId, commandId, actionEpoch, baseCommitSequence, combatHash, expectedClock }) {
  if (typeof roomId !== 'string' || !roomId || !UUID.test(commandId || '') || typeof actionEpoch !== 'string' || !actionEpoch ||
    !Number.isSafeInteger(baseCommitSequence) || baseCommitSequence < 0 || !HEX.test(combatHash || '') || !validClock(expectedClock)) {
    return fail('invalid_roster_change');
  }
  return { version: 1, roomId, commandId, actionEpoch, baseCommitSequence, combatHash, expectedClock };
}

export function buildJoinCommand({ roomId, commandId, actionEpoch, baseCommitSequence, combatHash, expectedClock, target, targetRevision, placement }) {
  const base = common({ roomId, commandId, actionEpoch, baseCommitSequence, combatHash, expectedClock });
  if (base.success === false) { return base; }
  if (!validRef(target) || !Number.isSafeInteger(targetRevision) || targetRevision < 0 || !placement) {
    return fail('invalid_roster_change');
  }
  let normalized;
  if (placement.kind === 'end') {
    normalized = { kind: 'end' };
  } else if (placement.kind === 'index') {
    if (!Number.isSafeInteger(placement.index) || placement.index < 0 || placement.index > 64) { return fail('invalid_roster_change'); }
    normalized = { kind: 'index', index: placement.index };
  } else if (placement.kind === 'before' || placement.kind === 'after') {
    if (!validRef(placement.ref)) { return fail('invalid_roster_change'); }
    normalized = { kind: placement.kind, ref: placement.ref };
  } else {
    return fail('invalid_roster_change');
  }
  return { success: true, command: {
    ...base, op: 'join', target, expectedTargetRevision: targetRevision, targetState: 'bound', placement: normalized
  } };
}

export function buildLeaveCommand({ roomId, commandId, actionEpoch, baseCommitSequence, combatHash, expectedClock, target, targetRevision, targetState = 'bound', reason }) {
  const base = common({ roomId, commandId, actionEpoch, baseCommitSequence, combatHash, expectedClock });
  if (base.success === false) { return base; }
  if (!validRef(target)) { return fail('invalid_roster_change'); }
  if (targetState === 'bound') {
    if (!Number.isSafeInteger(targetRevision) || targetRevision < 0) { return fail('invalid_roster_change'); }
    return { success: true, command: {
      ...base, op: 'leave', target, expectedTargetRevision: targetRevision, targetState: 'bound'
    } };
  }
  if (targetState === 'missing') {
    if (targetRevision !== null || typeof reason !== 'string' || !reason.trim() || reason.length > 2000) {
      return fail('invalid_roster_change');
    }
    return { success: true, command: {
      ...base, op: 'leave', target, expectedTargetRevision: null, targetState: 'missing', reason
    } };
  }
  return fail('invalid_roster_change');
}

export const ROSTER_REFUSALS = Object.freeze({
  combatant_has_turn: 'That combatant holds the current turn. Advance or end the turn first, then remove it from combat.',
  combatant_has_scheduled_effects: 'That combatant still has a live scheduled effect. Resolve or remove the exact effect before removing it from combat.',
  combatant_has_cooldowns: 'That combatant still has a live turn-count cooldown. Wait for it to release or end combat first.',
  actor_already_in_combat: 'That exact actor is already in the turn order.',
  actor_not_in_combat: 'That actor is no longer in the turn order.',
  actor_in_combat: 'That exact combatant is still in the turn order. Remove it from combat before deleting the token.',
  actor_has_combat_effects: 'That token still has a live scheduled effect or cooldown. Resolve it before deleting the token.',
  target_incarnation_missing: 'That exact token no longer exists. Refresh the roster and use the repair action on the stale entry.',
  target_incarnation_present: 'That exact token still exists, so the stale-entry repair does not apply.',
  stale_combat_state: 'Combat changed while you were choosing. The roster was refreshed; try again.',
  stale_turn_clock: 'The turn clock changed while you were choosing. The roster was refreshed; try again.',
  stale_actor_revision: 'That actor changed while you were choosing. The roster was refreshed; try again.',
  placement_invalid: 'That insertion position is no longer valid for the current turn order.',
  replacement_roster_empty: 'The last combatant is removed by ending combat, not by a roster edit.',
  turn_gm_required: 'Only the current GM session can change the combat roster.',
  combat_active_required: 'Combat must be active before the roster can be edited.',
  turn_state_unavailable: 'The current combat state cannot support a roster edit.',
  turn_roster_unbound: 'The turn order contains a legacy or unbound entry; end or restart combat to repair it.',
  actor_binding_conflict: 'That actor binding is no longer current. Refresh the room and try again.',
  invalid_roster_change: 'The roster request was not valid for the selected target or placement.',
  outcome_unknown: 'The previous attempt may have been accepted. Refresh the room before retrying.',
  retry_window_expired: 'That request is older than the retry window. Refresh the room and try again.',
  command_id_conflict: 'The same command id was already used with different content.',
  room_connection_unavailable: 'The room connection is unavailable.',
  room_authority_unavailable: 'The room authority is unavailable.',
  room_authority_lost: 'The room authority changed; refresh the room before retrying.'
});

export const rosterRefusalText = result => {
  const code = typeof result === 'string' ? result : result?.code;
  if (code && ROSTER_REFUSALS[code]) { return ROSTER_REFUSALS[code]; }
  if (result && typeof result === 'object' && typeof result.error === 'string' && result.error) { return result.error; }
  return code || 'The roster change was refused.';
};
