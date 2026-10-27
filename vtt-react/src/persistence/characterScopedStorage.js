/**
 * Project 5 Wave B (S5/A1) — scoped character roster and active-pointer access.
 *
 * Rosters and the active pointer are verified-owner scoped:
 *   - signed-in users: family `character.roster` in the user scope;
 *   - guests: family `character.guestRoster` in the stable guest scope;
 *   - active selection: `character.activeId` (selector), tab-local override is
 *     handled by the store; the scoped selector is ownership-validated by use.
 *
 * Legacy global keys (`mythrill-characters`, `mythrill-guest-characters`,
 * `mythrill-active-character`) are never read automatically. They are
 * preserved as recovery sources and quarantined (verified copy + receipt) the
 * first time a scoped load finds no owner record.
 */

import {
  loadScopedDraft,
  saveScopedDraft,
  loadScopedNative,
  saveScopedNative,
  clearScopedNative,
  captureConsumerContext,
  ensureLegacySourceQuarantine,
  resolveActiveScope
} from './scopedConsumer';
import { forkScopedRecord } from './localCoordination';

export const ROSTER_FAMILY_USER = 'character.roster';
export const ROSTER_FAMILY_GUEST = 'character.guestRoster';
export const ACTIVE_POINTER_FAMILY = 'character.activeId';

const baselines = new Map();
const quarantined = new Set();
let rosterSaveTail = Promise.resolve();

const scopeKey = () => {
  const scope = resolveActiveScope();
  return scope ? `${scope.scopeKind}:${scope.scopeId}` : null;
};

const baselineKey = (familyId) => `${scopeKey()}:${familyId}`;

export function rosterFamilyId(isGuest) {
  return isGuest ? ROSTER_FAMILY_GUEST : ROSTER_FAMILY_USER;
}

function quarantineLegacyOnce(familyId, legacyKey) {
  const scope = resolveActiveScope();
  if (!scope) return;
  const key = `${scope.scopeKind}:${scope.scopeId}:${legacyKey}`;
  if (quarantined.has(key)) return;
  quarantined.add(key);
  try {
    if (typeof localStorage !== 'undefined' && localStorage.getItem(legacyKey) !== null) {
      ensureLegacySourceQuarantine({ legacyKey, familyId, scope });
    }
  } catch (_error) {
    // recovery is best-effort; the legacy source is never modified here
  }
}

/**
 * Load the owner's roster. Returns null when no scoped record exists (caller
 * decides the empty-state fallback). Never reads legacy global keys.
 */
export function loadRoster(isGuest) {
  const familyId = rosterFamilyId(isGuest);
  quarantineLegacyOnce(
    familyId,
    isGuest ? 'mythrill-guest-characters' : 'mythrill-characters'
  );
  const read = loadScopedDraft({ familyId });
  if (read.status === 'OK') {
    baselines.set(baselineKey(familyId), { revision: read.localRevision, draftId: read.draftId });
    return Array.isArray(read.payload) ? read.payload : null;
  }
  // Guest records written while an anonymous Firebase principal had lost its
  // isGuest wrapper landed in the user family inside the same guest scope. Read
  // that owner-scoped record as a recovery source; the next save writes the
  // canonical guest family and never modifies or deletes this one.
  if (isGuest) {
    const recovered = loadScopedDraft({ familyId: ROSTER_FAMILY_USER });
    if (recovered.status === 'OK') {
      baselines.set(baselineKey(ROSTER_FAMILY_USER), { revision: recovered.localRevision, draftId: recovered.draftId });
      if (Array.isArray(recovered.payload) && recovered.payload.length > 0) {
        console.warn('Guest roster recovered from same-scope user family record.');
        return recovered.payload;
      }
    }
  }
  return null;
}

/**
 * Persist the owner's roster. Captured-context coordinated write with a
 * one-time stale retry (this tab's roster is the newest local view).
 *
 * `options.context` supplies an explicit immutable operation context (e.g. the
 * retained owner's context captured before a handoff) instead of the live gate
 * context; it is enforced by the same coordination primitives.
 */
export function saveRoster(isGuest, characters, options = {}) {
  const familyId = rosterFamilyId(isGuest);
  const payload = Array.isArray(characters) ? characters : [];
  // Capture the immutable operation context at public entry so a queued write
  // can never be re-attributed to a later account.
  const captured = options.context
    ? { ok: true, context: options.context }
    : captureConsumerContext();
  if (!captured.ok) {
    return Promise.resolve({ status: 'NO_ACTIVE_SCOPE', reason: captured.reason });
  }
  const operationContext = captured.context;
  const capturedScope = operationContext.scope
    ? `${operationContext.scope.scopeKind}:${operationContext.scope.scopeId}`
    : scopeKey();
  const capturedBaselineKey = `${capturedScope}:${familyId}`;
  const run = () => {
    const baseline = baselines.get(capturedBaselineKey) || { revision: null, draftId: null };
    if (baseline.external) {
      // Never publish a queued stale snapshot over an external winner just
      // because an earlier handler adopted its baseline. Preserve the
      // candidate as a fork; a fresh load re-enables normal successors.
      let forkedId = null;
      try {
        const scope = operationContext.scope;
        if (scope) {
          const forked = forkScopedRecord({ familyId, scope, context: operationContext, payload });
          if (forked && forked.status === 'FORKED') forkedId = forked.draftId;
        }
      } catch (_error) {
        // best-effort; the winner is never overwritten either way
      }
      return Promise.resolve({
        status: 'STALE_REVISION',
        currentRevision: baseline.revision,
        currentDraftId: baseline.draftId,
        forkedDraftId: forkedId
      });
    }
    return saveScopedDraft({
      familyId,
      payload,
      context: operationContext,
      expectedRevision: baseline.revision,
      expectedDraftId: baseline.draftId
    });
  };
  // Serialize same-tab saves so the baseline this write compares against is
  // always the record its own predecessor established (no false staleness).
  const pending = rosterSaveTail.then(run, run).then((result) => {
    if (result.status === 'OK' || result.status === 'FORKED') {
      baselines.set(capturedBaselineKey, {
        revision: result.newRevision ?? 1,
        draftId: result.draftId
      });
    } else if (result.status === 'STALE_REVISION') {
      // A concurrent writer's record is newer. Never publish this stale
      // snapshot over the winner: preserve the candidate as a fork and adopt
      // the winner's identity.
      let forkedId = null;
      try {
        const scope = operationContext.scope;
        if (scope) {
          const forked = forkScopedRecord({ familyId, scope, context: operationContext, payload });
          if (forked && forked.status === 'FORKED') forkedId = forked.draftId;
        }
      } catch (_error) {
        // best-effort; the winner is never overwritten either way
      }
      baselines.set(capturedBaselineKey, {
        revision: result.currentRevision ?? null,
        draftId: result.currentDraftId ?? null,
        external: true,
        forkedDraftId: forkedId
      });
    }
    return result;
  });
  rosterSaveTail = pending.catch(() => {});
  pending.catch(() => {});
  return pending;
}

/** Active character selector (scoped). */
export function loadActivePointer() {
  const read = loadScopedNative({ familyId: ACTIVE_POINTER_FAMILY });
  if (read.status !== 'OK') return null;
  const value = read.value && typeof read.value === 'object' ? read.value.value : null;
  return typeof value === 'string' && value ? value : null;
}

export function saveActivePointer(characterId) {
  if (!characterId) return clearActivePointer();
  return saveScopedNative({ familyId: ACTIVE_POINTER_FAMILY, value: { value: String(characterId) } });
}

export function clearActivePointer() {
  return clearScopedNative({ familyId: ACTIVE_POINTER_FAMILY });
}

/** Reset module baselines/quarantine bookkeeping (handoff reset + tests). */
export function resetCharacterScopedStorageState() {
  baselines.clear();
  quarantined.clear();
}

/** Test-only alias kept explicit for existing tests. */
export function resetCharacterScopedStorageForTests() {
  resetCharacterScopedStorageState();
}
