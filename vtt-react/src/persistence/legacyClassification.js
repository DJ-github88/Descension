/**
 * Project 5 — legacy ownership classification (Slice 1).
 *
 * Slice 1 classifies legacy raw sources only; it never migrates or deletes
 * them. Ownership is:
 *
 *   PROVEN  : only from an explicitly recognized verification receipt
 *             (created by a later verified migration slice)
 *   UNKNOWN : registered authored/recovery source whose owner cannot be
 *             independently proven
 *   INVALID : malformed payload for a known JSON source
 *   NOT_DRAFT: public allowlisted data (ownership does not apply)
 *
 * Not ownership proof, ever:
 *  - last-account markers (`mythrill-last-account-type`, `...-user-id`)
 *  - embedded userId inside a payload
 *  - business IDs (campaignId / roomId / characterId / imported IDs)
 *  - global startup enumeration of IndexedDB/localStorage records
 *
 * Unknown data must NOT become guest or the current user. It is a quarantine
 * candidate for a later slice.
 */

import { getFamily, getFamilyForKey, DATA_CLASSES, SUBREGION_MAPS_INDEXEDDB } from './privateStorageRegistry';
import { getGlobalAllowlistEntry, classifyKey } from './globalAllowlist';
import { validateScope } from './scopeModel';

export const LEGACY_OWNERSHIP = Object.freeze({
  PROVEN: 'PROVEN',
  UNKNOWN: 'UNKNOWN',
  INVALID: 'INVALID',
  NOT_DRAFT: 'NOT_DRAFT'
});

export const VERIFIED_RECEIPT_KIND = 'verified-recovery-receipt';

/**
 * A verification receipt is only accepted with an explicit recognized shape
 * and a valid frozen scope. Later migration slices create these; nothing in
 * Slice 1 does.
 */
export function isRecognizedVerificationReceipt(verification) {
  if (!verification || typeof verification !== 'object') return false;
  if (verification.kind !== VERIFIED_RECEIPT_KIND) return false;
  if (typeof verification.receiptId !== 'string' || verification.receiptId.length === 0) return false;
  return validateScope({ scopeKind: verification.scopeKind, scopeId: verification.scopeId }).ok;
}

/**
 * Classify a legacy raw source.
 *
 * `markers` is accepted for audit clarity but intentionally ignored: markers
 * are never ownership proof.
 *
 * @param {{
 *   key: string,
 *   rawValue?: string|null,
 *   familyId?: string|null,
 *   verification?: object|null,
 *   markers?: object|null
 * }} input
 */
export function classifyLegacyRecord({
  key,
  rawValue = null,
  familyId = null,
  verification = null
} = {}) {
  const allowlistEntry = getGlobalAllowlistEntry(key);
  if (allowlistEntry) {
    return {
      key,
      kind: 'global-public',
      familyId: null,
      ownership: LEGACY_OWNERSHIP.NOT_DRAFT,
      recoverable: false,
      reason: 'public-allowlisted-data'
    };
  }

  const effectiveFamily = getFamilyForKey(key) || (familyId ? getFamily(familyId) : null);

  if (!effectiveFamily) {
    const classification = classifyKey(key);
    return {
      key,
      kind: classification.classification === 'p5-scoped' ? 'p5-scoped' : 'unregistered',
      familyId: null,
      ownership: LEGACY_OWNERSHIP.UNKNOWN,
      recoverable: true,
      reason: 'no-registered-family-ownership-unknown'
    };
  }

  if (effectiveFamily.dataClass === DATA_CLASSES.SESSION_ONLY) {
    return {
      key,
      kind: 'session-state',
      familyId: effectiveFamily.id,
      ownership: LEGACY_OWNERSHIP.NOT_DRAFT,
      recoverable: false,
      reason: 'session-only-state'
    };
  }

  // Malformed JSON for a known JSON family stays raw and is never converted
  // to empty/default.
  if (rawValue !== null && rawValue !== undefined && effectiveFamily.serializer === 'json') {
    try {
      JSON.parse(rawValue);
    } catch (_error) {
      return {
        key,
        kind: 'registered-private',
        familyId: effectiveFamily.id,
        ownership: LEGACY_OWNERSHIP.INVALID,
        recoverable: true,
        reason: 'malformed-json-preserve-raw'
      };
    }
  }

  if (isRecognizedVerificationReceipt(verification)) {
    return {
      key,
      kind: 'registered-private',
      familyId: effectiveFamily.id,
      ownership: LEGACY_OWNERSHIP.PROVEN,
      recoverable: true,
      scopeKind: verification.scopeKind,
      scopeId: verification.scopeId,
      receiptId: verification.receiptId,
      reason: 'verified-recovery-receipt'
    };
  }

  return {
    key,
    kind: 'registered-private',
    familyId: effectiveFamily.id,
    ownership: LEGACY_OWNERSHIP.UNKNOWN,
    recoverable: true,
    reason: 'no-independent-ownership-proof'
  };
}

/**
 * Classify an existing custom-subregion map record from IndexedDB
 * (`mythrill_maps_db` / `custom_subregion_maps`) or its localStorage mirror.
 *
 * These are existing authored recovery sources. Global startup enumeration is
 * never owner proof; without a recognized verification receipt ownership is
 * UNKNOWN and the record must be preserved, never rewritten or deleted.
 */
export function classifyIndexedDbCustomMapRecord(record, { verification = null, source = 'indexedDB' } = {}) {
  const recognized = isRecognizedVerificationReceipt(verification);
  const id = record && typeof record === 'object' && typeof record.id === 'string' ? record.id : null;
  return {
    familyId: 'map.subregionCache',
    source,
    id,
    sourceClass: 'existing-authored-recovery-source',
    ownership: recognized ? LEGACY_OWNERSHIP.PROVEN : LEGACY_OWNERSHIP.UNKNOWN,
    trustedAsCurrentAccountDraft: false,
    preserved: true,
    reason: recognized ? 'verified-recovery-receipt' : 'global-enumeration-is-not-owner-proof',
    indexedDb: { ...SUBREGION_MAPS_INDEXEDDB }
  };
}

/**
 * Documented no-op: last-account markers are hints, never ownership proof.
 * Present so future code cannot "just use" the markers without an explicit
 * contract change.
 */
export function classifyLastAccountMarkers(_markers) {
  return {
    ownership: LEGACY_OWNERSHIP.UNKNOWN,
    reason: 'last-account-markers-are-not-proof'
  };
}
