/**
 * Project 5 Wave A (S2) — protected storage adapter.
 *
 * One bounded adapter for cleanup-sensitive persistence. It answers
 * classification/protection questions through the Slice 1 registry (never a
 * parallel ownership registry) and provides durability-honest key writes.
 *
 * Durability rules:
 *  - serialization happens fully before replacement
 *  - a storage failure leaves the prior stored value intact (single setItem;
 *    nothing is deleted first)
 *  - memory-only fallback is never reported as durable persistence
 */

import { classifyKey } from './globalAllowlist';
import { canGenericCleanupDeleteKey, evaluateCleanupEligibilityForKey } from './cleanupPolicy';
import { removeDisposableKey } from './cleanupAdapter';

export const DURABLE_STATUS = Object.freeze({
  OK: 'OK',
  SERIALIZATION_FAILED: 'SERIALIZATION_FAILED',
  STORAGE_ERROR: 'STORAGE_ERROR'
});

function safeStorage(storage) {
  if (storage) return storage;
  if (typeof window === 'undefined') return null;
  return typeof window.localStorage !== 'undefined' ? window.localStorage : null;
}

/**
 * Classification + protection for a raw key.
 * `protected: true` means generic cleanup must not delete it. Unregistered
 * keys fail closed (`protected: true`, cleanupEligible: false).
 */
export function classifyStorageKey(key) {
  const classification = classifyKey(key);
  const eligibility = evaluateCleanupEligibilityForKey(key);
  return {
    key,
    classification: classification.classification,
    familyId: classification.familyId,
    allowlistId: classification.allowlistId,
    cleanupEligible: eligibility.eligible === true,
    protected: eligibility.eligible !== true,
    reason: eligibility.reason
  };
}

/** True when the key must never be deleted by generic cleanup. */
export function isProtectedStorageKey(key) {
  return !canGenericCleanupDeleteKey(key);
}

/** Raw durable read. Returns { ok, raw } or { ok:false, reason }. */
export function readDurable(key, storage = null) {
  const target = safeStorage(storage);
  if (!target) return { ok: false, reason: 'storage-unavailable' };
  try {
    return { ok: true, raw: target.getItem(key) };
  } catch (error) {
    return { ok: false, reason: error?.message || 'storage-error' };
  }
}

/**
 * Durable write with replacement-failure preservation.
 * `value` may be a string (stored verbatim) or any JSON value.
 * Never reports success when only memory could hold the value.
 */
export function writeDurable(key, value, storage = null) {
  const target = safeStorage(storage);
  if (!target) {
    return { status: DURABLE_STATUS.STORAGE_ERROR, persisted: false, key, reason: 'storage-unavailable' };
  }
  let serialized;
  if (typeof value === 'string') {
    serialized = value;
  } else {
    try {
      serialized = JSON.stringify(value);
    } catch (error) {
      return {
        status: DURABLE_STATUS.SERIALIZATION_FAILED,
        persisted: false,
        key,
        reason: error?.message || 'serialization-failed'
      };
    }
  }
  if (typeof serialized !== 'string') {
    return { status: DURABLE_STATUS.SERIALIZATION_FAILED, persisted: false, key, reason: 'serialized-not-string' };
  }
  try {
    // Single replacement; a throw leaves the previous value untouched.
    target.setItem(key, serialized);
  } catch (error) {
    return {
      status: DURABLE_STATUS.STORAGE_ERROR,
      persisted: false,
      key,
      reason: error?.message || 'storage-write-failed'
    };
  }
  return { status: DURABLE_STATUS.OK, persisted: true, key, bytes: serialized.length };
}

/** Policy-gated deletion entry point for cleanup-sensitive code. */
export function removeKeyIfDisposable(key, storage = null) {
  return removeDisposableKey(key, storage);
}
