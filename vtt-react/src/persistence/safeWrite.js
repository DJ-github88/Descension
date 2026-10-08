/**
 * Project 5 — safe write foundation (Slice 1).
 *
 * Basic scoped writes for NEW scoped records only. Slice 1 does NOT claim
 * multi-tab CAS (Web Locks writers land in a later slice) and does NOT migrate
 * any existing key.
 *
 * Guarantees:
 *  - active scope validated (bootstrap gate must be active for the exact scope,
 *    or a matching explicit account context must be supplied)
 *  - envelope validated before any replacement
 *  - fully serialized BEFORE the storage replacement
 *  - storage failure leaves the prior stored value intact (single setItem;
 *    nothing is deleted first)
 *  - no in-memory fallback is reported as persistence
 */

import { buildScopedKey } from './keyFormat';
import { validateScope, scopesEqual } from './scopeModel';
import { validateDraftEnvelope } from './draftEnvelope';
import { getFamily } from './privateStorageRegistry';
import { canWritePrivateScopedData } from './bootstrapPrivacyGate';
import { validateAccountContext, ACCOUNT_PHASES } from './accountContext';

export const WRITE_STATUS = Object.freeze({
  OK: 'OK',
  SERIALIZATION_FAILED: 'SERIALIZATION_FAILED',
  STORAGE_ERROR: 'STORAGE_ERROR',
  CONTEXT_REFUSED: 'CONTEXT_REFUSED',
  INVALID_ENVELOPE: 'INVALID_ENVELOPE',
  INVALID_SCOPE: 'INVALID_SCOPE',
  INVALID_FAMILY: 'INVALID_FAMILY'
});

function contextAllowsWrite({ context, scope, family }) {
  if (!context) {
    return canWritePrivateScopedData(scope);
  }
  const validation = validateAccountContext(context);
  if (!validation.ok) return false;
  if (context.phase !== ACCOUNT_PHASES.ACTIVE) return false;
  if (!context.scope || !scopesEqual(context.scope, scope)) return false;
  if (!family.allowedScopeKinds.includes(context.scope.scopeKind)) return false;
  return canWritePrivateScopedData(scope);
}

/**
 * Write a scoped record.
 *
 * @param {{
 *   familyId: string,
 *   scope: object,
 *   locator?: Array<string|number>,
 *   value: unknown,
 *   wrapEnvelope?: boolean,
 *   context?: object|null
 * }} input
 * @returns {{ status: string, key: string|null, persisted: boolean, bytes?: number, reason?: string, code?: string }}
 */
export function writeScopedRecord({
  familyId,
  scope,
  locator = [],
  value,
  wrapEnvelope = false,
  context = null
} = {}) {
  const family = getFamily(familyId);
  if (!family) {
    return { status: WRITE_STATUS.INVALID_FAMILY, key: null, persisted: false, reason: `unknown-family:${String(familyId)}` };
  }

  const scopeValidation = validateScope(scope);
  if (!scopeValidation.ok) {
    return { status: WRITE_STATUS.INVALID_SCOPE, key: null, persisted: false, reason: scopeValidation.reason };
  }
  if (!family.allowedScopeKinds.includes(scope.scopeKind)) {
    return {
      status: WRITE_STATUS.CONTEXT_REFUSED,
      key: null,
      persisted: false,
      reason: `scope-kind-not-allowed:${scope.scopeKind}`
    };
  }

  let record = value;
  if (wrapEnvelope || family.envelope === 'draft-envelope') {
    const validation = validateDraftEnvelope(record, { expectedScope: scope });
    if (!validation.ok) {
      return {
        status: WRITE_STATUS.INVALID_ENVELOPE,
        key: null,
        persisted: false,
        code: validation.code,
        reason: validation.reason
      };
    }
  }

  if (!contextAllowsWrite({ context, scope, family })) {
    return {
      status: WRITE_STATUS.CONTEXT_REFUSED,
      key: null,
      persisted: false,
      reason: 'bootstrap-gate-not-active-for-scope'
    };
  }

  const key = buildScopedKey({ scope, familyId, locator });

  let serialized;
  try {
    serialized = family.serializer === 'raw-string' ? String(record) : JSON.stringify(record);
  } catch (error) {
    return {
      status: WRITE_STATUS.SERIALIZATION_FAILED,
      key,
      persisted: false,
      reason: error?.message || 'serialization-failed'
    };
  }
  if (typeof serialized !== 'string') {
    return { status: WRITE_STATUS.SERIALIZATION_FAILED, key, persisted: false, reason: 'serialized-not-string' };
  }

  const storage = typeof window !== 'undefined'
    ? (family.storage === 'sessionStorage' ? window.sessionStorage : window.localStorage)
    : null;
  if (!storage) {
    return { status: WRITE_STATUS.STORAGE_ERROR, key, persisted: false, reason: 'storage-unavailable' };
  }

  try {
    // Single atomic key replacement. Nothing is removed first, so a thrown
    // setItem leaves the previous stored value untouched.
    storage.setItem(key, serialized);
  } catch (error) {
    return {
      status: WRITE_STATUS.STORAGE_ERROR,
      key,
      persisted: false,
      reason: error?.message || 'storage-write-failed'
    };
  }

  return { status: WRITE_STATUS.OK, key, persisted: true, bytes: serialized.length };
}
