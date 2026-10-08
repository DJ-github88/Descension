/**
 * Project 5 — source-preserving safe reads (Slice 1).
 *
 * Registry-based reads distinguish:
 *
 *   MISSING | PRESENT_VALID | MALFORMED | UNSUPPORTED_VERSION
 *   WRONG_SCOPE | STORAGE_ERROR
 *
 * Malformed data is never converted to empty/default, never rewritten and
 * never deleted. Raw recovery metadata is returned where safely possible.
 *
 * `readScopedRecord` is the raw source-preserving read (used by recovery and
 * classification). `readScopedRecordForHydration` is the consumer-facing path
 * later slices must use; it additionally requires the bootstrap privacy gate
 * to be active for the exact destination scope.
 */

import { buildScopedKey, isP5ScopedKey } from './keyFormat';
import { validateScope } from './scopeModel';
import {
  validateDraftEnvelope,
  ENVELOPE_CODES,
  DRAFT_ENVELOPE_SCHEMA_VERSION
} from './draftEnvelope';
import { requireFamily } from './privateStorageRegistry';
import { canHydratePrivateScopedData } from './bootstrapPrivacyGate';

export const READ_STATUS = Object.freeze({
  MISSING: 'MISSING',
  PRESENT_VALID: 'PRESENT_VALID',
  MALFORMED: 'MALFORMED',
  UNSUPPORTED_VERSION: 'UNSUPPORTED_VERSION',
  WRONG_SCOPE: 'WRONG_SCOPE',
  STORAGE_ERROR: 'STORAGE_ERROR'
});

/** Extra status used only by the hydration-gated read path. */
export const HYDRATION_STATUS = Object.freeze({
  HYDRATION_BLOCKED: 'HYDRATION_BLOCKED'
});

function storageFor(family) {
  if (typeof window === 'undefined') return null;
  if (family.storage === 'sessionStorage') {
    return typeof window.sessionStorage !== 'undefined' ? window.sessionStorage : null;
  }
  return typeof window.localStorage !== 'undefined' ? window.localStorage : null;
}

function parseFamilyValue(family, raw) {
  if (family.serializer === 'raw-string') {
    return { ok: true, value: raw };
  }
  try {
    return { ok: true, value: JSON.parse(raw) };
  } catch (_error) {
    return { ok: false, reason: 'json-parse-failed' };
  }
}

function classifyEnvelopeFailure(validation) {
  if (validation.code === ENVELOPE_CODES.SCHEMA_UNSUPPORTED) {
    return READ_STATUS.UNSUPPORTED_VERSION;
  }
  if (validation.code === ENVELOPE_CODES.WRONG_SCOPE) {
    return READ_STATUS.WRONG_SCOPE;
  }
  return READ_STATUS.MALFORMED;
}

function readRaw(key, family) {
  const storage = storageFor(family);
  if (!storage) {
    return { ok: false, reason: 'storage-unavailable' };
  }
  try {
    return { ok: true, raw: storage.getItem(key) };
  } catch (error) {
    return { ok: false, reason: `storage-error:${error?.message || 'unknown'}` };
  }
}

function interpretRecord({ family, key, raw, expectedScope = null }) {
  const base = {
    familyId: family.id,
    key,
    raw,
    rawLength: typeof raw === 'string' ? raw.length : 0
  };

  const parsed = parseFamilyValue(family, raw);
  if (!parsed.ok) {
    return { status: READ_STATUS.MALFORMED, ...base, reason: parsed.reason };
  }

  if (family.envelope === 'draft-envelope') {
    const validation = validateDraftEnvelope(parsed.value, {
      expectedScope: expectedScope || null
    });
    if (!validation.ok) {
      return {
        status: classifyEnvelopeFailure(validation),
        ...base,
        reason: validation.reason,
        code: validation.code
      };
    }
    return { status: READ_STATUS.PRESENT_VALID, ...base, value: validation.envelope };
  }

  return { status: READ_STATUS.PRESENT_VALID, ...base, value: parsed.value };
}

/**
 * Read a registry family record through an explicit scope.
 *
 * @param {{ familyId: string, scope: object, locator?: Array<string|number> }} input
 */
export function readScopedRecord({ familyId, scope, locator = [] } = {}) {
  const family = requireFamily(familyId);
  const scopeValidation = validateScope(scope);
  if (!scopeValidation.ok) {
    throw new Error(`P5 safe read: ${scopeValidation.reason}`);
  }
  if (!family.allowedScopeKinds.includes(scope.scopeKind)) {
    return {
      status: READ_STATUS.WRONG_SCOPE,
      familyId: family.id,
      key: null,
      raw: null,
      rawLength: 0,
      reason: `scope-kind-not-allowed:${scope.scopeKind}`
    };
  }

  const key = buildScopedKey({ scope, familyId, locator });
  const rawResult = readRaw(key, family);
  if (!rawResult.ok) {
    return {
      status: READ_STATUS.STORAGE_ERROR,
      familyId: family.id,
      key,
      raw: null,
      rawLength: 0,
      reason: rawResult.reason
    };
  }
  if (rawResult.raw === null) {
    return { status: READ_STATUS.MISSING, familyId: family.id, key, raw: null, rawLength: 0 };
  }
  return interpretRecord({
    family,
    key,
    raw: rawResult.raw,
    expectedScope: scope
  });
}

/**
 * Read an exact raw key (scoped successor or legacy source) without building a
 * scoped key. Used by classification/migration later slices and by scope
 * mismatch tests. Does not delete or rewrite anything.
 *
 * @param {{
 *   rawKey: string,
 *   familyId?: string|null,
 *   expectedScope?: object|null
 * }} input
 */
export function readRawRecord({ rawKey, familyId = null, expectedScope = null } = {}) {
  if (typeof rawKey !== 'string' || rawKey.length === 0) {
    throw new Error('P5 safe read: rawKey is required');
  }
  if (!familyId) {
    return {
      status: READ_STATUS.MALFORMED,
      familyId: null,
      key: rawKey,
      raw: null,
      rawLength: 0,
      reason: 'family-required-for-raw-read'
    };
  }
  const family = requireFamily(familyId);
  const rawResult = readRaw(rawKey, family);
  if (!rawResult.ok) {
    return {
      status: READ_STATUS.STORAGE_ERROR,
      familyId: family.id,
      key: rawKey,
      raw: null,
      rawLength: 0,
      reason: rawResult.reason
    };
  }
  if (rawResult.raw === null) {
    return { status: READ_STATUS.MISSING, familyId: family.id, key: rawKey, raw: null, rawLength: 0 };
  }
  return interpretRecord({
    family,
    key: rawKey,
    raw: rawResult.raw,
    expectedScope: expectedScope || null
  });
}

/**
 * Consumer-facing hydration read. Enforces the bootstrap privacy gate so new
 * P5 scoped data cannot leak before the destination scope is activated.
 */
export function readScopedRecordForHydration({ familyId, scope, locator = [] } = {}) {
  if (!canHydratePrivateScopedData(scope)) {
    return {
      status: HYDRATION_STATUS.HYDRATION_BLOCKED,
      familyId,
      key: null,
      raw: null,
      rawLength: 0,
      reason: 'bootstrap-gate-not-active-for-scope'
    };
  }
  return readScopedRecord({ familyId, scope, locator });
}

/** Whether a raw key is a P5 scoped successor key (not legacy). */
export function isScopedSuccessorKey(rawKey) {
  return isP5ScopedKey(rawKey);
}

export const SUPPORTED_SCHEMA_VERSION = DRAFT_ENVELOPE_SCHEMA_VERSION;
