/**
 * Project 5 Wave A (S2) — registry-driven cleanup adapter.
 *
 * Every generic/emergency cleanup decision involving a registered P5 family
 * MUST route through this adapter (which uses the Slice 1 cleanup policy).
 *
 * Fail closed:
 *   authored / recoverable / conflict-candidate / quarantine /
 *   private-projection / private-metadata-hint / unregistered  ->  NOT deletable
 * Only explicitly classified public/session-only keys are disposable.
 * "backup", "temp", "cache", "spell", "library" never authorize deletion.
 */

import {
  evaluateCleanupEligibilityForKey,
  canGenericCleanupDeleteKey
} from './cleanupPolicy';

export const CLEANUP_REMOVAL_STATUS = Object.freeze({
  REMOVED: 'REMOVED',
  PROTECTED: 'PROTECTED',
  UNREGISTERED: 'UNREGISTERED',
  MISSING: 'MISSING',
  STORAGE_ERROR: 'STORAGE_ERROR'
});

function safeStorage(storage) {
  if (storage) return storage;
  if (typeof window === 'undefined') return null;
  return typeof window.localStorage !== 'undefined' ? window.localStorage : null;
}

export function classifyCleanupCandidate(key) {
  return evaluateCleanupEligibilityForKey(key);
}

export function isDisposableCandidate(key) {
  return canGenericCleanupDeleteKey(key);
}

/**
 * Remove a single key only when registry policy explicitly classifies it as
 * disposable. Unregistered/protected keys are refused, not guessed at.
 */
export function removeDisposableKey(key, storage = null) {
  const target = safeStorage(storage);
  const candidate = evaluateCleanupEligibilityForKey(key);
  if (!candidate.eligible) {
    return {
      status: candidate.recognized ? CLEANUP_REMOVAL_STATUS.PROTECTED : CLEANUP_REMOVAL_STATUS.UNREGISTERED,
      removed: false,
      key,
      familyId: candidate.familyId || null,
      reason: candidate.reason
    };
  }
  if (!target) {
    return { status: CLEANUP_REMOVAL_STATUS.STORAGE_ERROR, removed: false, key, reason: 'storage-unavailable' };
  }
  try {
    if (target.getItem(key) === null) {
      return { status: CLEANUP_REMOVAL_STATUS.MISSING, removed: false, key };
    }
    target.removeItem(key);
    return { status: CLEANUP_REMOVAL_STATUS.REMOVED, removed: true, key };
  } catch (error) {
    return {
      status: CLEANUP_REMOVAL_STATUS.STORAGE_ERROR,
      removed: false,
      key,
      reason: error?.message || 'storage-error'
    };
  }
}

/** Scan storage and return only policy-eligible disposable keys. */
export function collectDisposableKeys(storage = null) {
  const target = safeStorage(storage);
  if (!target) return [];
  const keys = [];
  try {
    for (let index = 0; index < target.length; index += 1) {
      const key = target.key(index);
      if (!key) continue;
      if (canGenericCleanupDeleteKey(key)) keys.push(key);
    }
  } catch (_error) {
    // fail closed
  }
  return keys;
}

/**
 * Perform a bounded generic cleanup.
 *
 * @param {{
 *   candidates?: string[]|null,
 *   storage?: Storage|null,
 *   protectKeys?: string[],
 *   maxRemovals?: number
 * }} [options]
 * @returns {{
 *   removed: string[],
 *   skippedProtected: Array<{key:string, reason:string}>,
 *   storagePressure: boolean,
 *   eligibleCandidateCount: number
 * }}
 */
export function performGenericCleanup(options = {}) {
  const { candidates = null, protectKeys = [], maxRemovals = Infinity } = options;
  const storage = safeStorage(options.storage);

  const pool = candidates || collectDisposableKeys(storage);
  const protectedSet = new Set(protectKeys);
  const removed = [];
  const skippedProtected = [];
  let eligibleCandidateCount = 0;

  for (const key of pool) {
    if (!key || protectedSet.has(key)) continue;
    const candidate = evaluateCleanupEligibilityForKey(key);
    if (!candidate.eligible) {
      skippedProtected.push({ key, reason: candidate.reason });
      continue;
    }
    eligibleCandidateCount += 1;
    if (removed.length >= maxRemovals) continue;
    const result = removeDisposableKey(key, storage);
    if (result.removed) removed.push(key);
  }

  // Storage pressure is explicit: nothing safe was freed. Callers must return
  // a failure/surfaced pressure state instead of deleting authored work.
  const storagePressure = removed.length === 0;
  return { removed, skippedProtected, storagePressure, eligibleCandidateCount };
}
