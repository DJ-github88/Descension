/**
 * Project 5 Wave B closure — verified-owner scoped local-room conversion transfer.
 *
 * The conversion payload (draft/context captured for a local→multiplayer room
 * transfer) is private to the owner that started the conversion. It is retained
 * across logins for that owner and never inherited by a different account.
 * S8's checkpoint-confirmation lifecycle is intentionally NOT implemented here.
 */

import { createScopedNativeFamily } from './scopedNativeFamily';
import { captureConsumerContext, isConsumerContextCurrent } from './scopedConsumer';
import { generateDraftId } from './localCoordination';

export const LOCAL_ROOM_CONVERSION_FAMILY = 'localRoom.conversionTransfer';

const conversionFamily = createScopedNativeFamily({
  familyId: LOCAL_ROOM_CONVERSION_FAMILY,
  legacyKeys: ['convertingLocalRoom', 'isConverting']
});

/** Persist the conversion payload + flag for the active verified owner. */
export function saveConversionTransfer(payload) {
  if (!payload || typeof payload !== 'object') {
    return { status: 'INVALID_PAYLOAD' };
  }
  const captured = captureConsumerContext();
  if (!captured.ok) return { status: 'NO_ACTIVE_SCOPE' };
  const snapshot = JSON.parse(JSON.stringify(payload));
  const record = {
    kind: 'p5-conversion-transfer',
    draftId: generateDraftId('conversion'),
    sourceContext: captured.context,
    sourceRoomId: snapshot.originalRoomId || null,
    payload: snapshot
  };
  const savedTransfer = conversionFamily.save(record, ['transfer']);
  if (savedTransfer.status !== 'OK') return savedTransfer;
  const savedFlag = conversionFamily.save(true, ['flag']);
  if (savedTransfer.status !== 'OK' || savedFlag.status !== 'OK') {
    return { status: savedTransfer.status !== 'OK' ? savedTransfer.status : savedFlag.status };
  }
  return { status: 'OK' };
}

/** Load the active verified owner's conversion payload (or null). */
export function loadConversionTransfer() {
  const flag = conversionFamily.load(['flag']);
  if (flag !== true) return null;
  const record = conversionFamily.load(['transfer']);
  if (!record || typeof record !== 'object') return null;
  // Earlier owner-scoped transfers remain usable; global sources are never read.
  return record.kind === 'p5-conversion-transfer' ? record.payload : record;
}

/** Bind a creation attempt to both the retained source and the live generation. */
export function captureConversionTransfer() {
  const captured = captureConsumerContext();
  if (!captured.ok) return captured;
  const payload = loadConversionTransfer();
  const record = payload ? conversionFamily.load(['transfer']) : null;
  if (!isConsumerContextCurrent(captured.context)) return { ok: false, reason: 'superseded' };
  return {
    ...captured,
    payload,
    sourceDraftId: record?.draftId || null,
    sourceRoomId: record?.sourceRoomId || payload?.originalRoomId || null,
    sourceContext: record?.sourceContext || captured.context
  };
}

/** Clear the active verified owner's conversion transfer. */
export function clearConversionTransfer() {
  conversionFamily.clear(['transfer']);
  conversionFamily.clear(['flag']);
}

export function resetConversionTransferForTests() {
  conversionFamily.resetForTests();
}
