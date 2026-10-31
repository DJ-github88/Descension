/**
 * Lossless recovery of an already-full browser profile.
 *
 * Earlier builds let a stale store writer allocate a new recovery fork for every
 * identical projection update. Preventing that (forkScopedRecord reuse) does not
 * shrink a profile that is already full. This is the one explicit, operator-run
 * path that does, under rules that cannot lose information:
 *
 *  - only first-revision, still-dirty, unconfirmed, source-less recovery forks of
 *    the named scoped-store families (never custody, never the shared winner);
 *  - only forks whose scope, provenance and payload are identical to a twin that
 *    is kept — the earliest of each identical group always survives;
 *  - the survivor is re-read and re-verified before any twin is removed, and each
 *    twin is re-read and must still be byte-identical to what was planned;
 *  - distinct payloads (every genuinely different candidate), altered, malformed,
 *    foreign-scope, resolved or unknown-version records are never touched;
 *  - dry-run by default; removal needs an explicit confirmation token and stops at
 *    the first mismatch or storage error; nothing else is written or cleared.
 */

import { listRetainedForks, stableStringify } from './localCoordination';
import { getFamily } from './privateStorageRegistry';
import { resolveActiveScope } from './scopedConsumer';
import { parseP5ScopedKey } from './keyFormat';
import { scopesEqual } from './scopeModel';

export const COMPACTION_CONFIRMATION = 'remove-identical-duplicate-recovery-copies';

function groupsFor({ familyId, scope, storage }) {
  const groups = new Map();
  for (const entry of listRetainedForks({ familyId, scope, storage })) {
    const id = `${stableStringify(entry.envelope.sourceProvenance)}|${stableStringify(entry.envelope.payload)}`;
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id).push(entry);
  }
  return [...groups.values()].map((entries) => {
    entries.sort((a, b) => (a.envelope.updatedAt || '').localeCompare(b.envelope.updatedAt || '')
      || (a.key < b.key ? -1 : 1));
    return { keep: entries[0], redundant: entries.slice(1) };
  });
}

/**
 * @param {{
 *   scope?: object, familyIds: string[], apply?: boolean, confirm?: string, storage?: Storage
 * }} input
 */
export function compactDuplicateRecoveryForks({ scope = resolveActiveScope(), familyIds = [], apply = false, confirm = null, storage = null } = {}) {
  const report = { applied: false, scope: scope ? { scopeKind: scope.scopeKind, scopeId: scope.scopeId } : null, families: [], removed: 0, charactersFreed: 0, refused: null };
  if (!scope) return { ...report, refused: 'no-active-scope' };
  if (apply && confirm !== COMPACTION_CONFIRMATION) return { ...report, refused: 'confirmation-required' };
  const target = storage || (typeof window !== 'undefined' ? window.localStorage : null);
  if (!target) return { ...report, refused: 'storage-unavailable' };
  for (const familyId of familyIds) {
    if (!getFamily(familyId)) { report.families.push({ familyId, skipped: 'unknown-family' }); continue; }
    const groups = groupsFor({ familyId, scope, storage: target });
    const row = {
      familyId,
      distinctCandidates: groups.length,
      identicalCopiesToRemove: groups.reduce((n, g) => n + g.redundant.length, 0),
      removed: 0,
      keptDraftIds: groups.map((g) => g.keep.envelope.draftId),
      charactersToFree: groups.reduce((n, g) => n + g.redundant.reduce((m, r) => m + r.key.length + r.raw.length, 0), 0)
    };
    report.families.push(row);
    if (!apply) continue;
    for (const group of groups) {
      if (!group.redundant.length) continue;
      // The surviving twin must still be exactly what was planned.
      let survivor = null;
      try { survivor = target.getItem(group.keep.key); } catch (_error) { survivor = null; }
      if (survivor !== group.keep.raw) { row.stopped = 'survivor-changed'; break; }
      for (const twin of group.redundant) {
        let current = null;
        try { current = target.getItem(twin.key); } catch (_error) { current = null; }
        if (current !== twin.raw) { row.stopped = 'twin-changed'; break; }
        try { target.removeItem(twin.key); } catch (error) { row.stopped = error?.message || 'storage-error'; break; }
        row.removed += 1;
        report.removed += 1;
        report.charactersFreed += twin.key.length + twin.raw.length;
      }
      if (row.stopped) break;
    }
  }
  report.applied = apply;
  return report;
}

/**
 * Read-only: where this scope's storage actually goes, per family (keys, characters and
 * how many keys are first-revision recovery forks). Says nothing is eligible by itself —
 * only the families passed to compactDuplicateRecoveryForks ever are.
 */
export function surveyScopedStorage({ scope = resolveActiveScope(), storage = null } = {}) {
  const target = storage || (typeof window !== 'undefined' ? window.localStorage : null);
  if (!scope || !target) return { scope: null, families: [], totalCharacters: 0 };
  const families = new Map();
  let totalCharacters = 0;
  for (let i = 0; i < target.length; i += 1) {
    const key = target.key(i);
    let raw = null;
    try { raw = target.getItem(key); } catch (_error) { raw = null; }
    totalCharacters += key.length + (raw ? raw.length : 0);
    const parsed = parseP5ScopedKey(key);
    if (!parsed || !scopesEqual({ scopeKind: parsed.scopeKind, scopeId: parsed.scopeId }, scope)) continue;
    const row = families.get(parsed.familyId) || { familyId: parsed.familyId, keys: 0, characters: 0, singleSegmentRecords: 0 };
    row.keys += 1;
    row.characters += key.length + (raw ? raw.length : 0);
    if (parsed.segments.length === 1) row.singleSegmentRecords += 1;
    families.set(parsed.familyId, row);
  }
  return { scope: { scopeKind: scope.scopeKind, scopeId: scope.scopeId }, totalCharacters, families: [...families.values()].sort((a, b) => b.characters - a.characters) };
}
