/**
 * Project 5 Wave B (S5) — scoped consumer integration bridge.
 *
 * Production-facing API that existing services use to move from unowned global
 * keys to the frozen P5 contract:
 *
 *  - verified owner scope resolved from the bootstrap gate (never a marker or
 *    a business id);
 *  - immutable operation context captured at call time and revalidated by the
 *    Wave-A coordination primitives;
 *  - draft-envelope families read/written through safeRead/safeWrite and
 *    writeWithCoordination (predecessor draft + revision);
 *  - family-native families (selectors/hints) written only with a current
 *    captured context;
 *  - legacy global sources are preserved through the Wave-A
 *    preserve/copy/verify/receipt primitives and are never auto-adopted.
 *
 * This module does not invent new storage semantics; it only exposes the
 * frozen ones to consumers.
 */

import { getBootstrapGateState, getBootstrapGateContext } from './bootstrapPrivacyGate';
import { isSameOperationContext } from './accountContext';
import { readScopedRecordForHydration, readScopedRecord, READ_STATUS } from './safeRead';
import { writeScopedRecord, WRITE_STATUS } from './safeWrite';
import { writeWithCoordination, COORDINATION_STATUS, captureOperationContext } from './localCoordination';
import { buildScopedKey, parseP5ScopedKey } from './keyFormat';
import { readDurable } from './protectedStorage';
import {
  preserveSourceCopy,
  completeRawCopyPreservation,
  verifyRecoveryReceiptForSource,
  fingerprintRawString,
  RECEIPT_FAMILY_TOKEN
} from './preservation';

export const CONSUMER_STATUS = Object.freeze({
  OK: 'OK',
  MISSING: 'MISSING',
  NO_ACTIVE_SCOPE: 'NO_ACTIVE_SCOPE',
  HYDRATION_BLOCKED: 'HYDRATION_BLOCKED',
  CONTEXT_REFUSED: 'CONTEXT_REFUSED',
  STORAGE_ERROR: 'STORAGE_ERROR'
});

/** Current verified owner scope, or null when no destination is active. */
export function resolveActiveScope() {
  const gate = getBootstrapGateState();
  if (gate.phase !== 'active' || !gate.scope) return null;
  return gate.scope;
}

/**
 * Capture the immutable operation context at consumer call time. Returns
 * `{ ok:false }` when no destination scope is active: consumers must then
 * keep working in memory only and never write private storage.
 */
export function captureConsumerContext() {
  const gate = getBootstrapGateState();
  if (gate.phase !== 'active' || !gate.scope) {
    return { ok: false, reason: 'no-active-scope' };
  }
  try {
    return { ok: true, context: getBootstrapGateContext() };
  } catch (error) {
    return { ok: false, reason: `context-unavailable:${error?.message || 'error'}` };
  }
}

/** True only while the captured operation context still matches the live gate. */
export function isConsumerContextCurrent(context) {
  if (!context) return false;
  try {
    return isSameOperationContext(context, getBootstrapGateContext());
  } catch (_error) {
    return false;
  }
}

/**
 * Capture an owner guard for an async cloud operation. `isCurrent()` is false
 * when the gate left the owner's active scope (logout/handoff) or the account
 * generation advanced, so a late response cannot mutate a newer account's
 * state.
 *
 * @param {string|null} expectedUserId verified owner (scopeId) or null
 */
export function captureOwnerGuard(expectedUserId = null) {
  const captured = captureConsumerContext();
  if (!captured.ok) {
    return { ok: false, context: null, isCurrent: () => false, reason: captured.reason };
  }
  const scopeId = captured.context.scope ? captured.context.scope.scopeId : null;
  if (expectedUserId && scopeId !== expectedUserId) {
    return { ok: false, context: captured.context, isCurrent: () => false, reason: 'owner-mismatch' };
  }
  return {
    ok: true,
    context: captured.context,
    isCurrent: () => isConsumerContextCurrent(captured.context)
  };
}

function consumerStatusFromRead(status) {
  if (status === READ_STATUS.PRESENT_VALID) return CONSUMER_STATUS.OK;
  if (status === READ_STATUS.MISSING) return CONSUMER_STATUS.MISSING;
  return status;
}

/**
 * Hydration-gated read of a draft-envelope family for the active scope.
 *
 * @returns {{
 *   status: string,
 *   payload?: unknown,
 *   localRevision?: number,
 *   draftId?: string,
 *   envelope?: object,
 *   reason?: string
 * }}
 */
export function loadScopedDraft({ familyId, locator = [] } = {}) {
  const scope = resolveActiveScope();
  if (!scope) {
    return { status: CONSUMER_STATUS.NO_ACTIVE_SCOPE, reason: 'bootstrap-gate-not-active' };
  }
  const read = readScopedRecordForHydration({ familyId, scope, locator });
  const status = consumerStatusFromRead(read.status);
  if (status !== CONSUMER_STATUS.OK) {
    return { status, reason: read.reason || read.status, familyId, key: read.key || null };
  }
  return {
    status: CONSUMER_STATUS.OK,
    payload: read.value.payload,
    localRevision: read.value.localRevision,
    draftId: read.value.draftId,
    envelope: read.value,
    familyId,
    key: read.key
  };
}

/**
 * Coordinated save of a draft-envelope family for the active scope. The
 * context is captured now, before any waiting, and enforced by the Wave-A
 * coordination primitives.
 *
 * @returns {Promise<object>} Wave-A coordination result (OK/FORKED/STALE/...)
 */
export async function saveScopedDraft({
  familyId,
  locator = [],
  payload,
  context = null,
  expectedRevision = null,
  expectedDraftId = null,
  successor = null,
  forkIfUncoordinated = true,
  timeoutMs = undefined
} = {}) {
  // An explicitly supplied context is captured/frozen here (already done at
  // the caller); otherwise the live gate context is captured at call time.
  const captured = captureOperationContext(context);
  if (!captured.ok) {
    return {
      status: context ? CONSUMER_STATUS.CONTEXT_REFUSED : CONSUMER_STATUS.NO_ACTIVE_SCOPE,
      reason: captured.reason,
      familyId
    };
  }
  if (!captured.context.scope || captured.context.phase !== 'active') {
    return {
      status: context ? CONSUMER_STATUS.CONTEXT_REFUSED : CONSUMER_STATUS.NO_ACTIVE_SCOPE,
      reason: 'gate-not-active',
      familyId
    };
  }
  const scope = captured.context.scope;
  const request = {
    familyId,
    scope,
    locator,
    context: captured.context,
    payload,
    expectedRevision,
    expectedDraftId,
    successor,
    forkIfUncoordinated
  };
  if (timeoutMs !== undefined) request.timeoutMs = timeoutMs;
  return writeWithCoordination(request);
}

/**
 * Hydration-gated read of a family-native family (selector/hint) for the
 * active scope. Returns `{ status, value }`.
 */
export function loadScopedNative({ familyId, locator = [] } = {}) {
  const scope = resolveActiveScope();
  if (!scope) {
    return { status: CONSUMER_STATUS.NO_ACTIVE_SCOPE, reason: 'bootstrap-gate-not-active' };
  }
  const read = readScopedRecordForHydration({ familyId, scope, locator });
  const status = consumerStatusFromRead(read.status);
  if (status !== CONSUMER_STATUS.OK) {
    return { status, reason: read.reason || read.status, familyId, key: read.key || null };
  }
  return { status: CONSUMER_STATUS.OK, value: read.value, familyId, key: read.key };
}

/**
 * Write a family-native family record (selector/hint). Synchronous: the
 * captured context is validated immediately before the single replacement.
 */
export function saveScopedNative({ familyId, locator = [], value } = {}) {
  const captured = captureConsumerContext();
  if (!captured.ok) {
    return { status: CONSUMER_STATUS.NO_ACTIVE_SCOPE, reason: captured.reason, familyId };
  }
  if (!isConsumerContextCurrent(captured.context)) {
    return { status: CONSUMER_STATUS.CONTEXT_REFUSED, reason: 'context-changed-before-write', familyId };
  }
  const written = writeScopedRecord({
    familyId,
    scope: captured.context.scope,
    locator,
    value,
    context: captured.context
  });
  return written.status === WRITE_STATUS.OK
    ? { status: CONSUMER_STATUS.OK, key: written.key, persisted: written.persisted }
    : { status: written.status, reason: written.reason, familyId };
}

/**
 * Remove a family-native record for the active scope. Only the exact scoped
 * key is touched; legacy sources are never removed.
 */
export function clearScopedNative({ familyId, locator = [] } = {}) {
  const scope = resolveActiveScope();
  if (!scope) {
    return { status: CONSUMER_STATUS.NO_ACTIVE_SCOPE, familyId };
  }
  const captured = captureConsumerContext();
  if (!captured.ok || !isConsumerContextCurrent(captured.context)) {
    return { status: CONSUMER_STATUS.CONTEXT_REFUSED, familyId };
  }
  try {
    const key = buildScopedKey({ scope, familyId, locator });
    if (typeof window === 'undefined' || !window.localStorage) {
      return { status: CONSUMER_STATUS.STORAGE_ERROR, reason: 'storage-unavailable', familyId };
    }
    window.localStorage.removeItem(key);
    return { status: CONSUMER_STATUS.OK, key };
  } catch (error) {
    return { status: CONSUMER_STATUS.STORAGE_ERROR, reason: error?.message || 'remove-failed', familyId };
  }
}

/** Locate an existing verified receipt for this exact source+fingerprint+scope. */
export function findQuarantineReceipt({ scope, sourceKey, fingerprintValue } = {}) {
  if (!scope || !sourceKey || !fingerprintValue) return null;
  if (typeof window === 'undefined' || !window.localStorage) return null;
  let prefix;
  try {
    prefix = `${buildScopedKey({ scope, familyId: RECEIPT_FAMILY_TOKEN })}:`;
  } catch (_error) {
    return null;
  }
  const storage = window.localStorage;
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (!key || !key.startsWith(prefix)) continue;
    const parsed = parseP5ScopedKey(key);
    if (!parsed || parsed.familyId !== RECEIPT_FAMILY_TOKEN) continue;
    const raw = readDurable(key);
    if (!raw.ok || raw.raw === null) continue;
    let receipt;
    try {
      receipt = JSON.parse(raw.raw);
    } catch (_error) {
      continue;
    }
    if (receipt && receipt.sourceKey === sourceKey &&
      receipt.sourceFingerprint === fingerprintValue) {
      return { key, receipt };
    }
  }
  return null;
}

/**
 * Copy-before-switch preservation of a legacy global source into the active
 * scope's quarantine family, with a verified raw-copy receipt.
 *
 * The legacy source is never modified or deleted. Repeated calls for an
 * unchanged source are idempotent (existing receipt is reused). Unknown-owner
 * legacy data is only preserved, never adopted as authored working state.
 *
 * @returns {{
 *   ok: boolean,
 *   status: 'PRESERVED'|'ALREADY_PRESERVED'|'SOURCE_MISSING'|'FAILED'|'NO_ACTIVE_SCOPE',
 *   reason?: string,
 *   copyKey?: string,
 *   receiptKey?: string
 * }}
 */
export function ensureLegacySourceQuarantine({ legacyKey, familyId = null, scope = null } = {}) {
  const activeScope = scope || resolveActiveScope();
  if (!activeScope) {
    return { ok: false, status: 'NO_ACTIVE_SCOPE', reason: 'bootstrap-gate-not-active' };
  }
  const read = readDurable(legacyKey);
  if (!read.ok) return { ok: false, status: 'FAILED', reason: read.reason };
  if (read.raw === null) return { ok: false, status: 'SOURCE_MISSING' };

  const fingerprint = fingerprintRawString(read.raw);

  // Idempotency: an existing verified receipt for this exact source content
  // means a prior call already established recovery.
  const existing = findQuarantineReceipt({
    scope: activeScope,
    sourceKey: legacyKey,
    fingerprintValue: fingerprint.value
  });
  if (existing) {
    const verified = verifyRecoveryReceiptForSource({
      receipt: existing.receipt,
      sourceKey: legacyKey
    });
    if (verified.valid) {
      return {
        ok: true,
        status: 'ALREADY_PRESERVED',
        copyKey: existing.receipt.copyKey,
        receiptKey: existing.key
      };
    }
  }

  const preserved = preserveSourceCopy({ sourceKey: legacyKey, sourceFamilyId: familyId, scope: activeScope });
  if (!preserved.ok) {
    return { ok: false, status: 'FAILED', reason: preserved.reason, copyKey: preserved.copyKey };
  }
  const completed = completeRawCopyPreservation({
    preservation: preserved,
    destinationScope: activeScope,
    sourceFamilyId: familyId
  });
  if (!completed.ok) {
    return { ok: false, status: 'FAILED', reason: completed.reason, copyKey: preserved.copyKey };
  }
  return {
    ok: true,
    status: 'PRESERVED',
    copyKey: completed.receipt.copyKey,
    receiptKey: completed.receiptKey,
    fingerprint: preserved.fingerprint.value
  };
}

/** Raw scoped read without the hydration gate (recovery/classification paths). */
export function readScopedRaw({ familyId, scope, locator = [] } = {}) {
  return readScopedRecord({ familyId, scope, locator });
}

export { COORDINATION_STATUS, READ_STATUS, WRITE_STATUS };
