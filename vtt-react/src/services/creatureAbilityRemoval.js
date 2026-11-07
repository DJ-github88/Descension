/**
 * Pending creature ability removals.
 *
 * An explicit "Remove activated ability" must reach the cloud copy of the creature. Creatures are cloud-backed
 * (no local persistence), so a failed cloud write followed by a reload would otherwise let the stale cloud copy restore
 * the association. This records one pending removal per account + creature in the verified-owner scoped storage family
 * `library.creatureAbilityRemovals` (the same mechanism as the deleted-spell tombstones).
 *
 * Contract:
 *  - recorded BEFORE the cloud write; cleared only when a save of the creature WITHOUT the association is confirmed
 *    for the SAME removalId; superseded (cleared) by a newer intentional assignment;
 *  - never time-based, never global: entries carry uid + creatureId and the family is owner-scoped;
 *  - detached copies on placed tokens are not touched by anything here;
 *  - multi-device conflicts remain last-writer-wins: a pending removal overwrites an association another device added.
 */
import { createScopedNativeFamily } from '../persistence/scopedNativeFamily';

const FIELD = 'authoredAbility';
const family = createScopedNativeFamily({ familyId: 'library.creatureAbilityRemovals', fallback: [] });

const valid = (e) => !!e && e.field === FIELD && typeof e.uid === 'string' && typeof e.creatureId === 'string' && typeof e.removalId === 'string';
// Removals cleared (confirmed or superseded) in this session even if the storage write failed: a failed clear must not leave
// a record that later strips a newer assignment or re-saves an old state.
const cleared = new Set();
let generation = 0; const confirmLog = [];
const readAll = () => { const v = family.load(); return Array.isArray(v) ? v.filter(e => valid(e) && !cleared.has(e.removalId)) : []; };
/** Monotonic marker; pair with confirmedSince() to learn which removals were confirmed while a cloud request was in flight. */
export const removalGeneration = () => generation;
export const confirmedSince = (uid, gen) => new Set(confirmLog.filter(e => e.uid === uid && e.gen > gen).map(e => e.creatureId));
function dropEntries(shouldDrop, confirmed) {
  const all = readAll(); const rest = all.filter(e => !shouldDrop(e)); const gone = all.filter(shouldDrop);
  if (!gone.length) return false;
  for (const e of gone) { cleared.add(e.removalId); generation += 1; if (confirmed) confirmLog.push({ uid: e.uid, creatureId: e.creatureId, gen: generation }); }
  if (!writeAll(rest)) writeAll(readAll()); // one re-read/retry; the session-level `cleared` set still overrides the stored record
  return true;
}
const writeAll = (entries) => { const r = entries.length ? family.save(entries) : family.clear(); return r?.status === 'OK'; };
let counter = 0;
const newId = () => (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `removal-${Date.now()}-${++counter}`;

/** Pending removals for this account as Map(creatureId -> removalId). */
export function pendingRemovals(uid) {
  return new Map(readAll().filter(e => e.uid === uid).map(e => [e.creatureId, e.removalId]));
}

/** Record an intentional removal. Returns { durable, removalId }; durable=false means it could not be persisted (no active owner). */
export function recordRemoval(uid, creatureId) {
  const removalId = newId();
  const rest = readAll().filter(e => !(e.uid === uid && e.creatureId === creatureId));
  generation += 1;
  let durable = writeAll([...rest, { uid, creatureId, field: FIELD, removalId }]);
  if (!durable) durable = writeAll([...readAll().filter(e => !(e.uid === uid && e.creatureId === creatureId)), { uid, creatureId, field: FIELD, removalId }]);
  return { durable, removalId };
}

/** A newer intentional assignment supersedes any pending removal of the same creature. */
export function supersedeRemoval(uid, creatureId) {
  dropEntries(e => e.uid === uid && e.creatureId === creatureId, false);
}
/** The creature itself was deleted: its pending removal has nothing left to apply to. */
export const pruneCreature = supersedeRemoval;

export function isRemovalCurrent(uid, creatureId, removalId) {
  return readAll().some(e => e.uid === uid && e.creatureId === creatureId && e.removalId === removalId);
}

/** Clear only the matching removal (a delayed old confirmation can never clear a newer one). Returns true when cleared. */
export function confirmRemoval(uid, creatureId, removalId) {
  return dropEntries(e => e.uid === uid && e.creatureId === creatureId && e.removalId === removalId, true);
}

// Cloud writes for one creature run in call order, so a delayed older removal cannot land after a newer assignment.
const tails = new Map();
export function serializeCloudWrite(uid, creatureId, run) {
  const key = `${uid}\u0000${creatureId}`;
  const next = (tails.get(key) || Promise.resolve()).catch(() => {}).then(run);
  tails.set(key, next);
  const clean = () => { if (tails.get(key) === next) tails.delete(key); };
  next.then(clean, clean);
  return next;
}
