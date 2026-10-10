/**
 * Project 5 Wave C (S8-A) — verified-owner scoped local-room conversion
 * transfer lifecycle.
 *
 * The conversion payload (draft/context captured for a local→multiplayer room
 * transfer) is private to the owner that started the conversion. It is retained
 * across logins for that owner and never inherited by a different account.
 *
 * Durability lifecycle (frozen P5 Wave C):
 *
 *   LOCAL SOURCE → PRESERVED → REQUESTED → AWAITING_CONFIRMATION → CONFIRMED
 *
 *  - Request emission, room acknowledgment and admission are recorded but are
 *    NOT durability. Only a verified P3 authoritative durable room checkpoint
 *    (`room_state_saved` with cloudSaved + a confirmed revision) for the exact
 *    captured destination may confirm the conversion.
 *  - The local source room and this transfer are never deleted or marked
 *    converted before CONFIRMED. Failure/timeout keeps an explicitly
 *    recoverable pending state.
 */

import { createScopedNativeFamily } from './scopedNativeFamily';
import { captureConsumerContext, isConsumerContextCurrent } from './scopedConsumer';
import { generateDraftId } from './localCoordination';

export const LOCAL_ROOM_CONVERSION_FAMILY = 'localRoom.conversionTransfer';
export const LOCAL_ROOM_CONVERSION_KIND = 'p5-conversion-transfer';

export const CONVERSION_STATES = Object.freeze({
  PRESERVED: 'PRESERVED',
  REQUESTED: 'REQUESTED',
  AWAITING_CONFIRMATION: 'AWAITING_CONFIRMATION',
  CONFIRMED: 'CONFIRMED'
});

const conversionFamily = createScopedNativeFamily({
  familyId: LOCAL_ROOM_CONVERSION_FAMILY,
  legacyKeys: ['convertingLocalRoom', 'isConverting']
});

function clonePayload(payload) {
  try {
    return JSON.parse(JSON.stringify(payload));
  } catch (_error) {
    return null;
  }
}

function readRecord() {
  const flag = conversionFamily.load(['flag']);
  if (flag !== true) return null;
  const record = conversionFamily.load(['transfer']);
  if (!record || typeof record !== 'object' || Array.isArray(record)) return null;
  if (record.kind !== LOCAL_ROOM_CONVERSION_KIND) return null;
  return record;
}

function writeRecord(record) {
  const savedTransfer = conversionFamily.save(record, ['transfer']);
  if (savedTransfer.status !== 'OK') return savedTransfer;
  const savedFlag = conversionFamily.save(true, ['flag']);
  if (savedFlag.status !== 'OK') return savedFlag;
  return { status: 'OK' };
}

/**
 * Persist the conversion payload + flag for the active verified owner.
 * The record captures the verified owner context, source identity and
 * revision before any remote operation happens.
 */
export function saveConversionTransfer(payload, sourceMeta = {}) {
  if (!payload || typeof payload !== 'object') {
    return { status: 'INVALID_PAYLOAD' };
  }
  const captured = captureConsumerContext();
  if (!captured.ok) return { status: 'NO_ACTIVE_SCOPE' };
  const snapshot = clonePayload(payload);
  if (!snapshot) return { status: 'INVALID_PAYLOAD' };
  const revision = Number.isSafeInteger(sourceMeta.sourceRevision) && sourceMeta.sourceRevision > 0
    ? sourceMeta.sourceRevision
    : null;
  const record = {
    kind: LOCAL_ROOM_CONVERSION_KIND,
    schemaVersion: 1,
    draftId: generateDraftId('conversion'),
    sourceContext: captured.context,
    sourceScopeKey: `${captured.context.scope.scopeId}:${captured.context.accountGeneration}`,
    sourceRoomId: snapshot.originalRoomId || sourceMeta.sourceRoomId || null,
    sourceDraftId: typeof sourceMeta.sourceDraftId === 'string' ? sourceMeta.sourceDraftId : null,
    sourceRevision: revision,
    state: CONVERSION_STATES.PRESERVED,
    destinationRoomId: null,
    requestedAt: null,
    acknowledgedAt: null,
    admittedAt: null,
    confirmedAt: null,
    confirmedRevision: null,
    failedAt: null,
    lastError: null,
    attempts: 0,
    payload: snapshot
  };
  const written = writeRecord(record);
  if (written.status !== 'OK') return written;
  return { status: 'OK', draftId: record.draftId };
}

/** Full lifecycle record for the active verified owner (or null). */
export function loadConversionRecord() {
  const record = readRecord();
  if (!record) return null;
  return { ...record };
}

/** Load the active verified owner's conversion payload (or null). */
export function loadConversionTransfer() {
  const record = readRecord();
  return record ? record.payload : null;
}

/** Bind a creation attempt to both the retained source and the live generation. */
export function captureConversionTransfer() {
  const captured = captureConsumerContext();
  if (!captured.ok) return captured;
  const record = readRecord();
  const payload = record ? record.payload : null;
  if (!isConsumerContextCurrent(captured.context)) return { ok: false, reason: 'superseded' };
  return {
    ...captured,
    payload,
    sourceDraftId: record?.sourceDraftId || record?.draftId || null,
    sourceRoomId: record?.sourceRoomId || payload?.originalRoomId || null,
    sourceRevision: record?.sourceRevision ?? null,
    sourceContext: record?.sourceContext || captured.context,
    conversionState: record?.state || null,
    destinationRoomId: record?.destinationRoomId || null
  };
}

/**
 * Shared transition helper. The captured context is revalidated before the
 * mutation; a stale account-generation continuation is refused and nothing is
 * written.
 */
function transition(context, mutator) {
  const captured = captureConsumerContext();
  if (!captured.ok) return { status: 'NO_ACTIVE_SCOPE', reason: captured.reason };
  if (context && !isConsumerContextCurrent(context)) {
    return { status: 'SUPERSEDED', reason: 'account-context-changed' };
  }
  const record = readRecord();
  if (!record) return { status: 'NO_TRANSFER' };
  const outcome = mutator(record);
  if (!outcome || outcome.refused) {
    return { status: (outcome && outcome.status) || 'REFUSED', ...(outcome?.detail || {}) };
  }
  const written = writeRecord(outcome.record);
  if (written.status !== 'OK') return written;
  return { status: 'OK', record: { ...outcome.record }, idempotent: !!outcome.idempotent };
}

function destinationMatches(record, destinationRoomId) {
  if (!destinationRoomId || typeof destinationRoomId !== 'string') return false;
  if (!record.destinationRoomId) return true;
  return record.destinationRoomId === destinationRoomId;
}

/**
 * REQUESTED — the creation request is being emitted for the captured
 * destination. A destination recorded by an earlier attempt is locked: retries
 * resume that exact room instead of creating a duplicate conversion.
 */
export function beginConversionRequest({ destinationRoomId, context } = {}) {
  if (!destinationRoomId || typeof destinationRoomId !== 'string') {
    return { status: 'INVALID_DESTINATION' };
  }
  return transition(context, (record) => {
    if (record.state === CONVERSION_STATES.CONFIRMED) {
      return { refused: true, status: 'ALREADY_CONFIRMED', detail: { destinationRoomId: record.destinationRoomId } };
    }
    if (record.destinationRoomId && record.destinationRoomId !== destinationRoomId) {
      return {
        refused: true,
        status: 'DESTINATION_LOCKED',
        detail: { destinationRoomId: record.destinationRoomId }
      };
    }
    const idempotent = record.state !== CONVERSION_STATES.PRESERVED;
    return {
      idempotent,
      record: {
        ...record,
        state: record.state === CONVERSION_STATES.AWAITING_CONFIRMATION
          ? record.state
          : CONVERSION_STATES.REQUESTED,
        destinationRoomId,
        requestedAt: record.requestedAt || new Date().toISOString(),
        attempts: (record.attempts || 0) + 1,
        lastError: null,
        failedAt: null
      }
    };
  });
}

/** Record the server acknowledgment (`room_created`). Not durability. */
export function markConversionAcknowledged({ destinationRoomId, context } = {}) {
  return transition(context, (record) => {
    if (record.state === CONVERSION_STATES.CONFIRMED) {
      return { refused: true, status: 'ALREADY_CONFIRMED' };
    }
    if (!destinationMatches(record, destinationRoomId)) {
      return { refused: true, status: 'WRONG_DESTINATION' };
    }
    if (record.destinationRoomId !== destinationRoomId) {
      return { refused: true, status: 'WRONG_DESTINATION' };
    }
    return {
      idempotent: !!record.acknowledgedAt,
      record: { ...record, acknowledgedAt: record.acknowledgedAt || new Date().toISOString() }
    };
  });
}

/** Record admission (`room_joined`) and enter AWAITING_CONFIRMATION. */
export function markConversionAdmitted({ destinationRoomId, context } = {}) {
  return transition(context, (record) => {
    if (record.state === CONVERSION_STATES.CONFIRMED) {
      return { refused: true, status: 'ALREADY_CONFIRMED' };
    }
    if (record.destinationRoomId !== destinationRoomId) {
      return { refused: true, status: 'WRONG_DESTINATION' };
    }
    return {
      idempotent: record.state === CONVERSION_STATES.AWAITING_CONFIRMATION,
      record: {
        ...record,
        state: CONVERSION_STATES.AWAITING_CONFIRMATION,
        admittedAt: record.admittedAt || new Date().toISOString()
      }
    };
  });
}

/**
 * Record a non-durable failure/timeout. The transfer and the local source stay
 * in an explicit recoverable pending state; nothing is cleared.
 */
export function markConversionFailed({ destinationRoomId, context, error, retriable = true } = {}) {
  return transition(context, (record) => {
    if (record.state === CONVERSION_STATES.CONFIRMED) {
      return { refused: true, status: 'ALREADY_CONFIRMED' };
    }
    if (record.destinationRoomId && destinationRoomId && record.destinationRoomId !== destinationRoomId) {
      return { refused: true, status: 'WRONG_DESTINATION' };
    }
    return {
      record: {
        ...record,
        failedAt: new Date().toISOString(),
        lastError: error ? String(error) : 'confirmation-unproven',
        retriable: retriable !== false
      }
    };
  });
}

/**
 * CONFIRMED — only for a verified P3 durable checkpoint on the exact captured
 * destination with a positive confirmed revision, while the record is awaiting
 * confirmation. A wrong destination or an unproven revision is refused without
 * mutation.
 */
export function confirmConversion({ destinationRoomId, confirmedRevision, context } = {}) {
  return transition(context, (record) => {
    if (record.state === CONVERSION_STATES.CONFIRMED) {
      return {
        refused: true,
        status: 'ALREADY_CONFIRMED',
        detail: { destinationRoomId: record.destinationRoomId, confirmedRevision: record.confirmedRevision }
      };
    }
    if (record.destinationRoomId !== destinationRoomId) {
      return { refused: true, status: 'WRONG_DESTINATION' };
    }
    if (!Number.isSafeInteger(confirmedRevision) || confirmedRevision <= 0) {
      return { refused: true, status: 'UNPROVEN_CHECKPOINT' };
    }
    if (record.state !== CONVERSION_STATES.AWAITING_CONFIRMATION) {
      return { refused: true, status: 'NOT_AWAITING_CONFIRMATION' };
    }
    return {
      record: {
        ...record,
        state: CONVERSION_STATES.CONFIRMED,
        confirmedAt: new Date().toISOString(),
        confirmedRevision,
        lastError: null,
        failedAt: null
      }
    };
  });
}

/**
 * Remove the recoverable transfer only after the caller has retired the local
 * source for a CONFIRMED conversion. Refuses for anything else, so a duplicate
 * or stale retry cannot destroy the only recoverable state.
 */
export function retireConfirmedConversion({ context } = {}) {
  const current = readRecord();
  if (!current) return { status: 'NO_TRANSFER' };
  if (current.state !== CONVERSION_STATES.CONFIRMED) {
    return { status: 'NOT_CONFIRMED', state: current.state };
  }
  if (context && !isConsumerContextCurrent(context)) {
    return { status: 'SUPERSEDED', reason: 'account-context-changed' };
  }
  clearConversionTransfer();
  return { status: 'RETIRED' };
}

/** Clear the active verified owner's conversion transfer. */
export function clearConversionTransfer() {
  conversionFamily.clear(['transfer']);
  conversionFamily.clear(['flag']);
}

export function resetConversionTransferForTests() {
  conversionFamily.resetForTests();
}
