/**
 * Project 5 Wave A (S3) — local same-browser coordination.
 *
 * Frozen rules:
 *  - native Web Locks for mutable shared records where available
 *  - the immutable operation context is captured at operation creation and
 *    validated after lock acquisition and immediately before mutation
 *  - the exact expected predecessor draft identity is checked in addition to
 *    the expected revision
 *  - never hold a local lock while awaiting network work (critical section is
 *    local-only, synchronous compare/write)
 *  - no-lock fallback must fork or refuse; never perform uncoordinated
 *    check-then-create on a shared mutable identity
 */

import { scopesEqual, validateScope } from './scopeModel';
import {
  captureAccountContext,
  validateAccountContext,
  isSameOperationContext,
  ACCOUNT_PHASES
} from './accountContext';
import { getBootstrapGateContext, canWritePrivateScopedData } from './bootstrapPrivacyGate';
import { readScopedRecord, READ_STATUS } from './safeRead';
import { writeScopedRecord, WRITE_STATUS } from './safeWrite';
import { getFamily } from './privateStorageRegistry';
import { createDraftEnvelope, bumpLocalRevision, validateDraftEnvelope } from './draftEnvelope';
import { fingerprintRawString } from './preservation';
import { getWriterInstanceId } from './writerIdentity';

export const COORDINATION_STATUS = Object.freeze({
  OK: 'OK',
  STALE_REVISION: 'STALE_REVISION',
  CONTEXT_REFUSED: 'CONTEXT_REFUSED',
  COORDINATION_UNAVAILABLE: 'COORDINATION_UNAVAILABLE',
  FORKED: 'FORKED',
  FORK_COLLISION: 'FORK_COLLISION',
  SOURCE_SCOPE_MISMATCH: 'SOURCE_SCOPE_MISMATCH',
  TIMEOUT: 'TIMEOUT',
  INVALID_REQUEST: 'INVALID_REQUEST',
  INVALID_ENVELOPE: 'INVALID_ENVELOPE',
  INVALID_SCOPE: 'INVALID_SCOPE',
  INVALID_FAMILY: 'INVALID_FAMILY',
  STORAGE_ERROR: 'STORAGE_ERROR'
});

const DEFAULT_LOCK_TIMEOUT_MS = 3000;
const DEFAULT_MAX_FORK_ATTEMPTS = 8;

function getLockManager() {
  try {
    if (typeof navigator !== 'undefined' && navigator.locks && typeof navigator.locks.request === 'function') {
      return navigator.locks;
    }
  } catch (_error) {
    // no locks available
  }
  return null;
}

export function isWebLocksAvailable() {
  return getLockManager() !== null;
}

/** Lock identity: scope + family + logical resource. Never one global lock. */
export function buildPrivateLockName({ scope, familyId, resource = 'root' }) {
  const scopeValidation = validateScope(scope);
  if (!scopeValidation.ok) {
    throw new Error(`P5 coordination: ${scopeValidation.reason}`);
  }
  return `mythrill:p5:lock:${scope.scopeKind}:${scope.scopeId}:${familyId}:${resource || 'root'}`;
}

/**
 * Capture the immutable operation context at creation. An explicitly supplied
 * context is validated and frozen; otherwise the live gate context is captured
 * BEFORE any waiting occurs. There is no null-context bypass.
 */
export function captureOperationContext(context = null) {
  if (context) {
    const validation = validateAccountContext(context);
    if (!validation.ok) {
      return { ok: false, reason: `context-invalid:${validation.reason}` };
    }
    return { ok: true, context: captureAccountContext(context) };
  }
  try {
    return { ok: true, context: getBootstrapGateContext() };
  } catch (error) {
    return { ok: false, reason: `context-unavailable:${error?.message || 'error'}` };
  }
}

function liveContextMatches(captured) {
  try {
    return isSameOperationContext(captured, getBootstrapGateContext());
  } catch (_error) {
    return false;
  }
}

/**
 * Run a local-only critical section under a short exclusive Web Lock.
 * The callback must be local/synchronous work (no network awaits inside).
 *
 * Returns the callback result, or an explicit coordination status:
 *  - COORDINATION_UNAVAILABLE when Web Locks cannot be used
 *  - TIMEOUT when the lock was not acquired in time
 *  - CONTEXT_REFUSED when the captured operation context no longer matches
 */
export async function withPrivateStorageLock(
  { scope, familyId, resource = 'root', context = null, timeoutMs = DEFAULT_LOCK_TIMEOUT_MS },
  callback
) {
  if (typeof callback !== 'function') {
    throw new Error('P5 coordination: callback is required');
  }

  // Capture BEFORE anything else — including the lock-availability check —
  // so no-lock callers can never fall back with a null/omitted context.
  const captured = captureOperationContext(context);
  if (!captured.ok) {
    return { status: COORDINATION_STATUS.CONTEXT_REFUSED, reason: captured.reason };
  }

  const locks = getLockManager();
  if (!locks) {
    return { status: COORDINATION_STATUS.COORDINATION_UNAVAILABLE, fallbackRequired: true };
  }

  let lockName;
  try {
    lockName = buildPrivateLockName({ scope, familyId, resource });
  } catch (error) {
    return { status: COORDINATION_STATUS.INVALID_SCOPE, reason: error.message };
  }

  let timer = null;
  let controller = null;
  try {
    if (typeof AbortController !== 'undefined') {
      controller = new AbortController();
      timer = setTimeout(() => controller.abort(), Math.max(0, timeoutMs));
    }
  } catch (_error) {
    controller = null;
  }

  const requestOptions = { mode: 'exclusive' };
  if (controller) requestOptions.signal = controller.signal;

  try {
    const result = await locks.request(lockName, requestOptions, async () => {
      // Revalidate AFTER acquisition, before any mutation.
      if (!canWritePrivateScopedData(scope)) {
        return { status: COORDINATION_STATUS.CONTEXT_REFUSED, reason: 'gate-not-active-for-scope' };
      }
      if (captured.context.phase !== ACCOUNT_PHASES.ACTIVE) {
        return { status: COORDINATION_STATUS.CONTEXT_REFUSED, reason: 'captured-context-not-active' };
      }
      if (!captured.context.scope || !scopesEqual(captured.context.scope, scope)) {
        return { status: COORDINATION_STATUS.CONTEXT_REFUSED, reason: 'captured-scope-mismatch' };
      }
      if (!liveContextMatches(captured.context)) {
        return { status: COORDINATION_STATUS.CONTEXT_REFUSED, reason: 'context-changed-while-waiting' };
      }
      return await callback();
    });
    return result;
  } catch (error) {
    if (error && (error.name === 'AbortError' || error.name === 'TimeoutError')) {
      return { status: COORDINATION_STATUS.TIMEOUT, reason: 'lock-not-acquired' };
    }
    return { status: COORDINATION_STATUS.STORAGE_ERROR, reason: error?.message || 'coordination-error' };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Collision-resistant draft ID allocation. Uses Web Crypto randomness when
 * available; allocation is additionally checked against the destination key.
 */
export function generateDraftId(prefix = 'draft') {
  let randomPart;
  try {
    if (typeof crypto !== 'undefined' && crypto && typeof crypto.getRandomValues === 'function') {
      const bytes = new Uint8Array(12);
      crypto.getRandomValues(bytes);
      randomPart = Array.from(bytes).map((byte) => byte.toString(16).padStart(2, '0')).join('');
    }
  } catch (_error) {
    randomPart = null;
  }
  if (!randomPart) {
    // ponytail: non-crypto fallback; destination collision checks still apply.
    randomPart = `${Math.random().toString(36).slice(2, 12)}${Date.now().toString(36)}`;
  }
  return `${prefix}_${Date.now().toString(36)}_${randomPart}`;
}

function forkLocator(locatorPrefix, draftId) {
  return locatorPrefix ? [locatorPrefix, draftId] : [draftId];
}

let forkAllocationSeq = 0;

/**
 * Per-allocation uniqueness component. Writer-instance id makes destinations
 * independent across tabs/realms; the realm-local sequence makes them unique
 * between competing allocations inside one realm. localStorage has no atomic
 * create-if-absent, so a fork destination that two writers could both choose
 * would be fundamentally unsafe; this token removes that shared-destination
 * possibility by construction.
 */
function nextForkAllocationToken() {
  forkAllocationSeq += 1;
  return `${getWriterInstanceId()}_${forkAllocationSeq.toString(36)}`;
}

/**
 * Compare/write for one scoped envelope record. MUST be called inside a held
 * lock. The expected predecessor identity (draftId) and revision are both
 * validated against the reread record before any successor is installed.
 */
function lockedCompareWrite({
  familyId,
  scope,
  locator,
  expectedRevision,
  expectedDraftId,
  payload,
  successor,
  draftId = null,
  context = null
}) {
  const family = getFamily(familyId);
  if (!family) {
    return { status: COORDINATION_STATUS.INVALID_FAMILY, familyId };
  }
  const current = readScopedRecord({ familyId, scope, locator });
  if (current.status === READ_STATUS.STORAGE_ERROR) {
    return { status: COORDINATION_STATUS.STORAGE_ERROR, reason: current.reason };
  }
  if (current.status === READ_STATUS.WRONG_SCOPE) {
    return { status: COORDINATION_STATUS.CONTEXT_REFUSED, reason: 'record-scope-mismatch' };
  }
  if (current.status === READ_STATUS.MALFORMED ||
    current.status === READ_STATUS.UNSUPPORTED_VERSION) {
    return { status: COORDINATION_STATUS.INVALID_ENVELOPE, reason: current.status };
  }

  const isCreateRequest = expectedRevision === null ||
    expectedRevision === undefined ||
    expectedRevision === 0;

  let next = null;
  if (current.status === READ_STATUS.MISSING) {
    if (!isCreateRequest) {
      return { status: COORDINATION_STATUS.STALE_REVISION, currentRevision: null, currentDraftId: null };
    }
    next = successor || createDraftEnvelope({
      scope,
      draftId: draftId || generateDraftId(),
      payload
    });
  } else {
    const existing = current.value;
    if (isCreateRequest) {
      // A create request against an existing shared identity is never allowed;
      // the caller must update with the exact predecessor identity.
      return {
        status: COORDINATION_STATUS.STALE_REVISION,
        currentRevision: existing.localRevision,
        currentDraftId: existing.draftId
      };
    }
    if (typeof expectedDraftId !== 'string' || expectedDraftId.length === 0) {
      return {
        status: COORDINATION_STATUS.INVALID_REQUEST,
        reason: 'expected-draft-id-required-for-update',
        currentRevision: existing.localRevision,
        currentDraftId: existing.draftId
      };
    }
    if (existing.localRevision !== expectedRevision || existing.draftId !== expectedDraftId) {
      return {
        status: COORDINATION_STATUS.STALE_REVISION,
        currentRevision: existing.localRevision,
        currentDraftId: existing.draftId
      };
    }
    next = successor
      ? (typeof successor === 'function' ? successor(existing) : successor)
      : bumpLocalRevision(existing, payload);
    if (next.draftId !== existing.draftId) {
      return { status: COORDINATION_STATUS.INVALID_ENVELOPE, reason: 'draft-id-change-requires-fork' };
    }
    if (next.localRevision !== existing.localRevision + 1) {
      return { status: COORDINATION_STATUS.INVALID_ENVELOPE, reason: 'successor-revision-must-be-predecessor-plus-one' };
    }
  }

  const validation = validateDraftEnvelope(next, { expectedScope: scope });
  if (!validation.ok) {
    return { status: COORDINATION_STATUS.INVALID_ENVELOPE, reason: validation.reason };
  }

  // Validate immediately before mutation as well: the gate/context must still
  // describe this operation and the destination key must not have shifted.
  if (!canWritePrivateScopedData(scope)) {
    return { status: COORDINATION_STATUS.CONTEXT_REFUSED, reason: 'gate-not-active-before-write' };
  }
  if (context && !liveContextMatches(context)) {
    return { status: COORDINATION_STATUS.CONTEXT_REFUSED, reason: 'context-changed-before-write' };
  }

  const written = writeScopedRecord({ familyId, scope, locator, value: next });
  if (written.status !== WRITE_STATUS.OK) {
    return {
      status: written.status === WRITE_STATUS.STORAGE_ERROR
        ? COORDINATION_STATUS.STORAGE_ERROR
        : COORDINATION_STATUS.INVALID_ENVELOPE,
      reason: written.reason || written.status
    };
  }
  return {
    status: COORDINATION_STATUS.OK,
    previousRevision: current.status === READ_STATUS.MISSING ? null : current.value.localRevision,
    newRevision: next.localRevision,
    draftId: next.draftId,
    key: written.key
  };
}

/**
 * Fork the pending edit into a fresh draft lineage in the SAME authorized
 * scope. The source record is never modified and gains no overwrite authority.
 *
 * Allocation is collision-checked with bounded retries; an existing
 * destination is never blindly replaced.
 */
export function forkScopedRecord({
  familyId,
  scope,
  context = null,
  payload,
  sourceEnvelope = null,
  sourceKey = null,
  locatorPrefix = '',
  draftIdFactory = generateDraftId,
  allocationIdFactory = null,
  maxForkAttempts = DEFAULT_MAX_FORK_ATTEMPTS
}) {
  const family = getFamily(familyId);
  if (!family) return { status: COORDINATION_STATUS.INVALID_FAMILY, familyId };
  if (!canWritePrivateScopedData(scope)) {
    return { status: COORDINATION_STATUS.CONTEXT_REFUSED, reason: 'gate-not-active-for-scope' };
  }
  // Every fork captures its operation context at public entry; there is no
  // null-context bypass, so a generation change is refused before any write.
  const captured = captureOperationContext(context);
  if (!captured.ok) {
    return { status: COORDINATION_STATUS.CONTEXT_REFUSED, reason: captured.reason };
  }
  const operationContext = captured.context;
  if (!liveContextMatches(operationContext)) {
    return { status: COORDINATION_STATUS.CONTEXT_REFUSED, reason: 'context-changed' };
  }

  // A known source envelope must actually belong to the fork's scope.
  if (sourceEnvelope) {
    const sourceValidation = validateDraftEnvelope(sourceEnvelope);
    if (!sourceValidation.ok) {
      return { status: COORDINATION_STATUS.INVALID_ENVELOPE, reason: `source-${sourceValidation.reason}` };
    }
    if (!scopesEqual({ scopeKind: sourceEnvelope.scopeKind, scopeId: sourceEnvelope.scopeId }, scope)) {
      return {
        status: COORDINATION_STATUS.SOURCE_SCOPE_MISMATCH,
        reason: 'source-envelope-not-owned-by-fork-scope'
      };
    }
  }

  const provenance = {
    kind: 'fork',
    sourceKey: sourceKey || null,
    sourceId: sourceEnvelope?.draftId || null,
    importedFromDraftId: sourceEnvelope?.draftId || null,
    sourceFingerprint: sourceEnvelope ? fingerprintRawString(JSON.stringify(sourceEnvelope.payload)).value : null,
    sourceSchemaVersion: sourceEnvelope?.schemaVersion ?? null,
    sourceScopeKind: sourceEnvelope?.scopeKind ?? null,
    sourceScopeId: sourceEnvelope?.scopeId ?? null
  };

  for (let attempt = 0; attempt < Math.max(1, maxForkAttempts); attempt += 1) {
    const baseId = draftIdFactory(attempt);
    if (typeof baseId !== 'string' || baseId.length === 0) {
      return { status: COORDINATION_STATUS.INVALID_REQUEST, reason: 'draft-id-factory-produced-invalid-id' };
    }
    // Independently unique destination: the base id is composed with an
    // allocation token no competing writer can share by accident, so the
    // absence check below is never the only thing protecting an alternative.
    const allocationToken = allocationIdFactory
      ? allocationIdFactory(attempt)
      : nextForkAllocationToken();
    if (typeof allocationToken !== 'string' || allocationToken.length === 0) {
      return { status: COORDINATION_STATUS.INVALID_REQUEST, reason: 'allocation-id-factory-produced-invalid-id' };
    }
    const newDraftId = `${baseId}~${allocationToken}`;
    const locator = forkLocator(locatorPrefix, newDraftId);

    const existing = readScopedRecord({ familyId, scope, locator });
    if (existing.status === READ_STATUS.STORAGE_ERROR) {
      return { status: COORDINATION_STATUS.STORAGE_ERROR, reason: existing.reason };
    }
    if (existing.status !== READ_STATUS.MISSING) {
      // Occupied (valid, malformed or unknown-version) destination: never
      // replace it; try the next allocation.
      continue;
    }

    // Revalidate the captured operation immediately before the mutation.
    if (!liveContextMatches(operationContext)) {
      return { status: COORDINATION_STATUS.CONTEXT_REFUSED, reason: 'context-changed-before-fork-write' };
    }

    const envelope = createDraftEnvelope({
      scope,
      draftId: newDraftId,
      payload,
      localRevision: 1,
      sourceProvenance: provenance
    });
    const written = writeScopedRecord({ familyId, scope, locator, value: envelope });
    if (written.status === WRITE_STATUS.STORAGE_ERROR) {
      return { status: COORDINATION_STATUS.STORAGE_ERROR, reason: written.reason };
    }
    if (written.status !== WRITE_STATUS.OK) {
      return { status: COORDINATION_STATUS.INVALID_ENVELOPE, reason: written.reason || written.status };
    }

    const verify = readScopedRecord({ familyId, scope, locator });
    if (verify.status === READ_STATUS.PRESENT_VALID &&
      verify.value.draftId === newDraftId &&
      verify.value.localRevision === 1) {
      return {
        status: COORDINATION_STATUS.FORKED,
        draftId: newDraftId,
        key: written.key,
        sourcePreserved: true,
        provenance
      };
    }
    // Verification failed (e.g. a competing write in the same instant):
    // retry with a fresh identity; the occupied destination is left alone.
  }

  return {
    status: COORDINATION_STATUS.FORK_COLLISION,
    reason: 'no-unoccupied-fork-destination',
    attempts: Math.max(1, maxForkAttempts)
  };
}

/**
 * Coordinated write for a scoped envelope record.
 *
 * Lock available: serialize compare/write; stale revisions/draft identities
 * are refused. Lock unavailable: never replace a shared record and never
 * perform uncoordinated check-then-create; forkable authored drafts are
 * preserved under a fresh draft identity, otherwise refuse.
 */
export async function writeWithCoordination({
  familyId,
  scope,
  locator = [],
  context = null,
  expectedRevision = null,
  expectedDraftId = null,
  payload,
  successor = null,
  forkIfUncoordinated = true,
  timeoutMs = DEFAULT_LOCK_TIMEOUT_MS
} = {}) {
  const scopeValidation = validateScope(scope);
  if (!scopeValidation.ok) {
    return { status: COORDINATION_STATUS.INVALID_SCOPE, reason: scopeValidation.reason };
  }

  // Capture the immutable operation context at public entry, before the lock
  // wait and before any fallback decision. All downstream mutations (locked
  // compare/write and no-lock fork) revalidate this exact context.
  const captured = captureOperationContext(context);
  if (!captured.ok) {
    return { status: COORDINATION_STATUS.CONTEXT_REFUSED, reason: captured.reason };
  }
  const operationContext = captured.context;

  const run = () => lockedCompareWrite({
    familyId,
    scope,
    locator,
    expectedRevision,
    expectedDraftId,
    payload,
    successor,
    context: operationContext
  });

  const locked = await withPrivateStorageLock(
    { scope, familyId, resource: locator.join('/') || 'root', context: operationContext, timeoutMs },
    run
  );

  if (locked && locked.status !== COORDINATION_STATUS.COORDINATION_UNAVAILABLE) {
    return locked;
  }

  // ── No-lock fallback: no shared replacement, no check-then-create ────────
  if (forkIfUncoordinated) {
    if (!liveContextMatches(operationContext)) {
      return { status: COORDINATION_STATUS.CONTEXT_REFUSED, reason: 'context-changed-before-fallback' };
    }
    const existing = readScopedRecord({ familyId, scope, locator });
    const sourceEnvelope = existing.status === READ_STATUS.PRESENT_VALID ? existing.value : null;
    return forkScopedRecord({
      familyId,
      scope,
      context: operationContext,
      payload,
      sourceEnvelope,
      sourceKey: existing.key || null
    });
  }
  return {
    status: COORDINATION_STATUS.COORDINATION_UNAVAILABLE,
    reason: 'web-locks-unavailable-and-record-not-forkable'
  };
}

export function coordinationWriterId() {
  return getWriterInstanceId();
}
