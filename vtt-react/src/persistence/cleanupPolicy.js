/**
 * Project 5 — registry-driven cleanup classification (Slice 1).
 *
 * Data classes:
 *   authored / recoverable / conflict-candidate / quarantine
 *     -> NEVER generic-cleanup eligible
 *   private-projection / private-metadata-hint
 *     -> in-memory/handoff reset may apply; persistent value follows the
 *        family declaration; never generic-cleanup eligible
 *   public-cache
 *     -> cleanup eligible
 *   session-only
 *     -> cleanup eligible per session policy
 *
 * Slice 1 does not rewrite existing quota cleanups. It exposes the one
 * registry function later cleanup paths MUST use.
 */

import {
  listFamilies,
  getFamilyForKey,
  DATA_CLASSES
} from './privateStorageRegistry';
import { isGlobalAllowlistedKey, getGlobalAllowlistEntry } from './globalAllowlist';

const GENERIC_CLEANUP_CLASSES = Object.freeze([
  DATA_CLASSES.PUBLIC_CACHE,
  DATA_CLASSES.SESSION_ONLY
]);

export function isCleanupEligibleDataClass(dataClass) {
  return GENERIC_CLEANUP_CLASSES.includes(dataClass);
}

/** Eligibility for a registered family. */
export function getCleanupEligibilityForFamily(familyId) {
  const family = listFamilies().find((entry) => entry.id === familyId);
  if (!family) {
    return { recognized: false, familyId: null, eligible: false, reason: 'unknown-family' };
  }
  return {
    recognized: true,
    familyId: family.id,
    dataClass: family.dataClass,
    eligible: family.cleanupEligible === true,
    reason: family.cleanupEligible ? 'declared-cleanup-eligible' : 'protected-data-class'
  };
}

/**
 * The function later cleanup paths MUST use. Fails closed for unregistered
 * keys and for every authored/recovery/conflict/quarantine family.
 *
 * @param {string} rawKey
 */
export function evaluateCleanupEligibilityForKey(rawKey) {
  if (typeof rawKey !== 'string' || rawKey.length === 0) {
    return { recognized: false, eligible: false, reason: 'invalid-key' };
  }
  if (isGlobalAllowlistedKey(rawKey)) {
    const entry = getGlobalAllowlistEntry(rawKey);
    return {
      recognized: true,
      allowlist: true,
      allowlistId: entry.id,
      eligible: true,
      reason: 'public-allowlisted-cache-or-preference'
    };
  }
  const family = getFamilyForKey(rawKey);
  if (!family) {
    return { recognized: false, eligible: false, reason: 'unregistered-key-fail-closed' };
  }
  return {
    recognized: true,
    allowlist: false,
    familyId: family.id,
    dataClass: family.dataClass,
    eligible: family.cleanupEligible === true,
    reason: family.cleanupEligible ? 'declared-cleanup-eligible' : 'protected-data-class'
  };
}

export function canGenericCleanupDeleteKey(rawKey) {
  return evaluateCleanupEligibilityForKey(rawKey).eligible === true;
}

export function listGenericCleanupEligibleFamilies() {
  return listFamilies()
    .filter((family) => family.cleanupEligible === true)
    .map((family) => ({ familyId: family.id, dataClass: family.dataClass }));
}

export function listProtectedFamilies() {
  return listFamilies()
    .filter((family) => family.cleanupEligible !== true)
    .map((family) => ({ familyId: family.id, dataClass: family.dataClass }));
}
