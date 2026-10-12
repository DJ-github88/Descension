/**
 * Project 5 P5-01 — character handoff preservation (2026-10-11 correction).
 *
 * The character store is a plain store with manual owner-scoped persistence.
 * During an account handoff the old owner's working projection must be hidden
 * from the new principal immediately, while the newest authored character data
 * must survive:
 *
 *  - the authored snapshot is captured BEFORE any destructive projection clear
 *    and before the pending debounced save is discarded (its payload is inside
 *    the captured working state), together with the immutable origin owner
 *    context and account generation;
 *  - preservation writes the snapshot into the retained owner's scoped roster
 *    with that captured context and awaits/inspects the real outcome (an
 *    invoked or queued write is never treated as confirmed preservation);
 *  - if the roster write cannot be confirmed the handoff fails closed: the
 *    candidate stays retained in memory and the participant reports a real
 *    failure so the coordinator does not activate the destination;
 *  - cloud publication is deferred: the owner-scoped record is the recovery
 *    source, an owner-scoped deferred-publication marker keeps it from being
 *    discarded by a stale cloud hydration when the owner returns, and
 *    publication resumes only for the authorized live owner.
 *
 * Memory-only retention is a hold, never claimed as restart-safe recovery.
 */

import {
  resolveActiveScope,
  captureConsumerContext,
  captureOwnerGuard,
  isConsumerContextCurrent
} from './scopedConsumer';
import { saveRoster, loadRoster, ROSTER_FAMILY_USER } from './characterScopedStorage';
import { readScopedRecord, READ_STATUS } from './safeRead';
import { writeScopedRecord } from './safeWrite';
import { isPrivateProjectionIsolated } from './bootstrapPrivacyGate';
import { deriveScopeFromAuthUser, scopesEqual } from './scopeModel';
import { getStore } from '../store/storeRegistry';
import { storeCharacterOffline } from '../services/offlineService';
import characterPersistenceService from '../services/firebase/characterPersistenceService';

export const CHARACTER_DEFERRED_PUBLICATION_FAMILY = 'character.deferredPublication';

let retainedCandidate = null;
let preservationPromise = null;
let preservationOutcome = null;

const deepClone = (value) => {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch (_error) {
    return null;
  }
};

const isConfirmedRosterResult = (result) =>
  Boolean(result) && (
    result.status === 'OK' ||
    result.status === 'FORKED' ||
    (result.status === 'STALE_REVISION' && Boolean(result.forkedDraftId))
  );

/**
 * Capture the stable authored character snapshot for the retained owner.
 * Idempotent: the first captured candidate wins; repeated gate notifications
 * never replace a candidate that is still awaiting preservation.
 *
 * @param {object} state character store state (characters + working fields)
 * @param {object|null} workingData assembled working-character save payload
 */
export function captureCharacterHandoffCandidate(state, workingData = null) {
  if (retainedCandidate) {
    return { ok: true, candidate: retainedCandidate, alreadyHeld: true };
  }
  const ownerContext = captureConsumerContext();
  if (!ownerContext.ok) {
    return { ok: false, reason: ownerContext.reason };
  }
  const scope = ownerContext.context.scope || null;
  const roster = Array.isArray(state?.characters) ? state.characters : [];
  const currentId = state?.currentCharacterId || null;
  // The reset template's display name ("Character Name") is not an authored
  // roster. Capturing it on repeated isolation notifications would create an
  // empty destination record and make its next real preservation a stale fork.
  const hasWorking = Boolean(currentId || roster.length > 0);
  if (!hasWorking) {
    return { ok: false, reason: 'no-working-character' };
  }

  let characters = deepClone(roster) || [];
  if (currentId && workingData) {
    const merged = deepClone(workingData) || workingData;
    characters = characters.map((character) =>
      character.id === currentId ? { ...character, ...merged } : character);
  }

  retainedCandidate = {
    ownerContext: ownerContext.context,
    ownerScopeId: scope ? scope.scopeId : null,
    ownerScopeKind: scope ? scope.scopeKind : null,
    characterId: currentId,
    characters,
    capturedAt: new Date().toISOString()
  };
  // A prior no-op recovery load does not confirm this newly captured source.
  preservationOutcome = null;
  return { ok: true, candidate: retainedCandidate };
}

/** The retained (in-memory) authored candidate while a handoff is unresolved. */
export function getRetainedCharacterHandoffCandidate() {
  return retainedCandidate;
}

/**
 * Ensure the retained candidate is durably preserved into the retained
 * owner's scoped roster. Idempotent and retryable: a confirmed outcome is
 * cached; a failed outcome is retried on the next call (the coordinator's
 * retry path) while the candidate stays retained.
 */
export function ensureCharacterHandoffPreserved() {
  if (!retainedCandidate) {
    if (!preservationOutcome) {
      preservationOutcome = { ok: true, status: 'NOTHING_TO_PRESERVE' };
    }
    return Promise.resolve(preservationOutcome);
  }
  if (preservationOutcome && preservationOutcome.ok) {
    return Promise.resolve(preservationOutcome);
  }
  if (preservationPromise) return preservationPromise;

  const candidate = retainedCandidate;
  preservationPromise = (async () => {
    try {
      const isGuestScope = candidate.ownerScopeKind === 'guest';
      const result = await saveRoster(isGuestScope, candidate.characters, {
        context: candidate.ownerContext
      });
      if (!isConfirmedRosterResult(result)) {
        preservationOutcome = {
          ok: false,
          status: (result && result.status) || 'UNKNOWN',
          reason: `character-roster-preservation-${(result && result.status) || 'unknown'}`
        };
        return preservationOutcome;
      }
      // Supplementary offline cache: best-effort; the confirmed roster write
      // above is the canonical durable recovery record.
      if (candidate.characterId) {
        try {
          const active = candidate.characters.find((character) => character.id === candidate.characterId);
          if (active) storeCharacterOffline(candidate.characterId, active);
        } catch (_error) {
          // supplementary only
        }
      }
      // The cloud publication for this authored content was deferred by the
      // handoff; record it under the same owner scope so a stale cloud
      // hydration never discards it once the owner returns.
      if (candidate.ownerScopeKind === 'user' && candidate.characterId) {
        const marker = markCharacterDeferredPublication([candidate.characterId], {
          context: candidate.ownerContext
        });
        if (marker.status !== 'OK' || !marker.persisted) {
          preservationOutcome = {
            ok: false,
            status: marker.status,
            reason: `character-marker-preservation-${marker.status}`
          };
          return preservationOutcome;
        }
      }
      preservationOutcome = { ok: true, status: result.status };
      return preservationOutcome;
    } catch (error) {
      preservationOutcome = {
        ok: false,
        status: 'THREW',
        reason: `character-preservation-threw:${error?.message || 'error'}`
      };
      return preservationOutcome;
    } finally {
      preservationPromise = null;
    }
  })();
  return preservationPromise;
}

export function getCharacterHandoffPreservationOutcome() {
  return preservationOutcome;
}

/**
 * Release the retained candidate (only after a successful transition reset or
 * a confirmed durable preservation followed by working-state restoration).
 */
export function clearCharacterHandoffPreservation() {
  retainedCandidate = null;
  preservationPromise = null;
  preservationOutcome = null;
}

/** Test-only reset; never used by production code. */
export function resetCharacterHandoffPreservationForTests() {
  clearCharacterHandoffPreservation();
  publicationsInFlight.clear();
}

/** Owner-scoped deferred-publication marker (family-native, idempotent union). */
export function readCharacterDeferredPublication(context = null) {
  try {
    const scope = context?.scope || resolveActiveScope();
    if (!scope) return null;
    const read = readScopedRecord({ familyId: CHARACTER_DEFERRED_PUBLICATION_FAMILY, scope });
    if (read.status !== READ_STATUS.PRESENT_VALID) return null;
    const value = read.value;
    return value && typeof value === 'object' ? value : null;
  } catch (_error) {
    return null;
  }
}

export function markCharacterDeferredPublication(characterIds, { context = null } = {}) {
  if (!Array.isArray(characterIds) || characterIds.length === 0) {
    return { status: 'NO_IDS' };
  }
  const captured = context ? { ok: true, context } : captureConsumerContext();
  if (!captured.ok || !isConsumerContextCurrent(captured.context)) {
    return { status: 'CONTEXT_REFUSED', persisted: false };
  }
  try {
    const read = readScopedRecord({
      familyId: CHARACTER_DEFERRED_PUBLICATION_FAMILY, scope: captured.context.scope
    });
    if (read.status !== READ_STATUS.PRESENT_VALID && read.status !== READ_STATUS.MISSING) {
      return { status: read.status, persisted: false };
    }
    const existing = read.value;
    const previous = Array.isArray(existing?.characterIds) ? existing.characterIds : [];
    const value = {
      characterIds: [...new Set([...previous, ...characterIds])],
      revision: (existing?.revision || 0) + 1,
      updatedAt: new Date().toISOString()
    };
    const written = writeScopedRecord({
      familyId: CHARACTER_DEFERRED_PUBLICATION_FAMILY,
      scope: captured.context.scope,
      context: captured.context,
      value
    });
    return { ...written, value };
  } catch (_error) {
    return { status: 'STORAGE_ERROR' };
  }
}

// Completion is compare-and-retire of the captured owner's exact marker AND
// roster revision. No completion ever resolves its destination from live auth.
export function clearCharacterDeferredPublication({ context, expectedMarker, expectedRoster, characterIds } = {}) {
  if (!isCharacterPublicationAuthorized(context) || !expectedMarker || !expectedRoster) {
    return { status: 'CONTEXT_REFUSED' };
  }
  try {
    const marker = readScopedRecord({ familyId: CHARACTER_DEFERRED_PUBLICATION_FAMILY, scope: context.scope });
    const roster = readCharacterPublicationRoster(context);
    if (marker.raw !== JSON.stringify(expectedMarker) || roster.raw !== expectedRoster.raw) {
      return { status: 'STALE_REVISION' };
    }
    const remaining = expectedMarker.characterIds.filter((id) => !characterIds.includes(id));
    if (remaining.length > 0) {
      return writeScopedRecord({
        familyId: CHARACTER_DEFERRED_PUBLICATION_FAMILY,
        scope: context.scope,
        context,
        value: { ...expectedMarker, characterIds: remaining }
      });
    }
    window.localStorage.removeItem(marker.key);
    return { status: 'OK', key: marker.key };
  } catch (_error) {
    return { status: 'STORAGE_ERROR' };
  }
}

/** Retained scope authorizes preservation; publication also requires live auth. */
export function isCharacterPublicationAuthorized(context) {
  if (!context || !isConsumerContextCurrent(context) || isPrivateProjectionIsolated()) return false;
  try {
    return scopesEqual(context.scope, deriveScopeFromAuthUser(getStore('authStore').getState()));
  } catch (_error) {
    return false;
  }
}

export function readCharacterPublicationRoster(context) {
  return readScopedRecord({ familyId: ROSTER_FAMILY_USER, scope: context.scope });
}

/**
 * Merge the retained owner's locally-preserved character candidates over a
 * freshly loaded roster (cloud or scoped). Only character identities recorded
 * by the deferred-publication marker (or still held in memory with a durable
 * preservation pending) are preferred locally; every other entry keeps the
 * freshly loaded version.
 */
export function mergeRetainedCharacterCandidate({ characters, isGuest = false } = {}) {
  const base = Array.isArray(characters) ? characters : [];
  const activeScope = resolveActiveScope();
  if (!activeScope) return { characters: base, restoredIds: [] };

  const deferred = readCharacterDeferredPublication();
  const deferredIds = Array.isArray(deferred?.characterIds) ? deferred.characterIds : [];
  const holdMatches = Boolean(
    retainedCandidate &&
    retainedCandidate.ownerScopeKind === activeScope.scopeKind &&
    retainedCandidate.ownerScopeId === activeScope.scopeId &&
    retainedCandidate.characterId
  );
  const candidateIds = [...new Set([
    ...deferredIds,
    ...(holdMatches ? [retainedCandidate.characterId] : [])
  ])];
  if (candidateIds.length === 0) return { characters: base, restoredIds: [] };

  let localRoster = null;
  if (deferredIds.length > 0) {
    try {
      localRoster = loadRoster(isGuest);
    } catch (_error) {
      localRoster = null;
    }
  }

  const merged = base.slice();
  const restoredIds = [];
  for (const id of candidateIds) {
    const localEntry = Array.isArray(localRoster)
      ? localRoster.find((character) => character.id === id)
      : null;
    const holdEntry = holdMatches && retainedCandidate.characterId === id
      ? retainedCandidate.characters.find((character) => character.id === id)
      : null;
    const preferred = deepClone(localEntry || holdEntry || null);
    if (!preferred) continue;
    const index = merged.findIndex((character) => character.id === id);
    if (index >= 0) {
      merged[index] = { ...merged[index], ...preferred };
    } else {
      merged.push(preferred);
    }
    restoredIds.push(id);
  }
  return { characters: merged, restoredIds };
}

/**
 * Resume cloud publication for locally-preserved candidates after the correct
 * owner is live again. Publication runs only under the owner's authorized
 * identity; the deferred marker is cleared only after every candidate reached
 * the owner's cloud document, so a failure keeps the recovery path alive.
 * Concurrent resumes (e.g. the activation hook and an explicit load) share a
 * single in-flight publication so no duplicate write is issued.
 */
const publicationsInFlight = new Map();

export function resumeDeferredCharacterPublication(ownerUserId, characters, { isWorkingCurrent = () => true } = {}) {
  if (!ownerUserId || !Array.isArray(characters) || characters.length === 0) {
    return Promise.resolve({ ok: true, skipped: true, writtenIds: [] });
  }
  const guard = captureOwnerGuard(ownerUserId);
  if (!guard.ok || !isCharacterPublicationAuthorized(guard.context)) {
    return Promise.resolve({ ok: false, reason: guard.reason, writtenIds: [] });
  }
  const key = `${ownerUserId}:${guard.context.accountGeneration}`;
  if (publicationsInFlight.has(key)) return publicationsInFlight.get(key);
  const marker = readCharacterDeferredPublication(guard.context);
  const roster = readCharacterPublicationRoster(guard.context);
  if (!marker || roster.status !== READ_STATUS.PRESENT_VALID) {
    return Promise.resolve({ ok: false, reason: 'publication-source-unavailable', writtenIds: [] });
  }
  const sourceCurrent = () => isCharacterPublicationAuthorized(guard.context) &&
    readCharacterPublicationRoster(guard.context).raw === roster.raw &&
    JSON.stringify(readCharacterDeferredPublication(guard.context)) === JSON.stringify(marker);
  const publication = (async () => {
    const writtenIds = [];
    // Select from the canonical scoped revision, never a roster captured by an
    // earlier cloud load. Every marked identity must have a recoverable source.
    for (const id of marker.characterIds) {
      const character = roster.value.payload.find((entry) => entry.id === id);
      if (!character || !sourceCurrent()) {
        return { ok: false, reason: 'publication-source-changed', writtenIds };
      }
      try {
        const saved = await characterPersistenceService.saveCharacter(character, ownerUserId, { isCurrent: sourceCurrent });
        if (!saved || !sourceCurrent()) {
          return { ok: false, reason: 'publication-source-changed', writtenIds };
        }
        writtenIds.push(character.id);
      } catch (error) {
        return {
          ok: false,
          reason: `deferred-publication-failed:${character.id}:${error?.message || 'error'}`,
          writtenIds
        };
      }
    }
    if (!isWorkingCurrent()) {
      return { ok: false, reason: 'newer-working-edit', writtenIds };
    }
    const cleared = clearCharacterDeferredPublication({
      context: guard.context, expectedMarker: marker, expectedRoster: roster, characterIds: writtenIds
    });
    return { ok: cleared.status === 'OK', reason: cleared.status, writtenIds };
  })();
  const pending = publication.finally(() => {
    if (publicationsInFlight.get(key) === pending) publicationsInFlight.delete(key);
  });
  publicationsInFlight.set(key, pending);
  return pending;
}
