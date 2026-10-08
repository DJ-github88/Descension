/**
 * Project 5 Wave B (final sweep) — scoped native-family helper.
 *
 * Thin factory over `loadScopedNative`/`saveScopedNative` for small authored or
 * metadata families backed by family-native records (arrays/objects), with
 * one-time verified quarantine of their retired global keys.
 *
 * Registry-aware:
 *  - families whose frozen registry envelope is `draft-envelope` are wrapped
 *    in a valid envelope for storage and unwrapped on load;
 *  - authored saves are predecessor-aware: an unreadable scoped source is
 *    preserved through the verified recovery contract before any replacement,
 *    and a newer concurrent winner is never overwritten by a stale snapshot
 *    (the stale candidate is forked instead).
 *  - lightweight metadata/hint families keep the plain native behavior.
 */

import {
  resolveActiveScope,
  loadScopedNative,
  saveScopedNative,
  clearScopedNative,
  captureConsumerContext,
  isConsumerContextCurrent,
  ensureLegacySourceQuarantine
} from './scopedConsumer';
import { readScopedRecord, READ_STATUS } from './safeRead';
import { buildScopedKey } from './keyFormat';
import { getFamily } from './privateStorageRegistry';
import { createDraftEnvelope, bumpLocalRevision } from './draftEnvelope';
import { writeScopedRecord, WRITE_STATUS } from './safeWrite';
import { forkScopedRecord, generateDraftId } from './localCoordination';
import { preserveSourceCopy, completeRawCopyPreservation } from './preservation';

function resolveFamily(familyId) {
  return getFamily(familyId);
}

const locatorKeyOf = (scope, locator) => `${scope.scopeKind}:${scope.scopeId}:${JSON.stringify(locator || [])}`;

export function createScopedNativeFamily({ familyId, legacyKeys = [], fallback = null }) {
  const quarantined = new Set();
  // Last observed store identity per active scope+locator, so a same-tab rapid
  // save is not misread as a concurrent winner.
  const lastRead = new Map();

  function quarantineOnce() {
    const scope = resolveActiveScope();
    if (!scope) return;
    const family = resolveFamily(familyId);
    if (!family) return;
    const scopeKey = `${scope.scopeKind}:${scope.scopeId}`;
    if (quarantined.has(scopeKey)) return;
    quarantined.add(scopeKey);
    for (const legacyKey of legacyKeys) {
      try {
        if (typeof localStorage !== 'undefined' && localStorage.getItem(legacyKey) !== null) {
          ensureLegacySourceQuarantine({ legacyKey, familyId, scope });
        }
      } catch (_error) {
        // best-effort; the raw source stays untouched
      }
    }
  }

  const needsEnvelope = () => {
    const family = resolveFamily(familyId);
    return !!family && family.envelope === 'draft-envelope';
  };

  /**
   * Preserve an unreadable scoped source through the verified recovery
   * contract. Returns true only when a verified copy+receipt exists.
   */
  function preserveUnreadableSource(scope, locator) {
    let key;
    try {
      key = buildScopedKey({ scope, familyId, locator });
    } catch (_error) {
      return false;
    }
    const preserved = preserveSourceCopy({
      sourceKey: key,
      sourceFamilyId: familyId,
      scope,
      destinationRef: 'scoped-recovery'
    });
    if (!preserved.ok) return false;
    const completed = completeRawCopyPreservation({
      preservation: preserved,
      destinationScope: scope,
      sourceFamilyId: familyId,
      operationKind: 'unreadable-scoped-recovery'
    });
    return completed.ok === true;
  }

  function saveAuthored(scope, locator, value) {
    const captured = captureConsumerContext();
    if (!captured.ok || !isConsumerContextCurrent(captured.context)) {
      return { status: 'CONTEXT_REFUSED', reason: captured.reason || 'context-changed' };
    }

    const current = readScopedRecord({ familyId, scope, locator });
    if (current.status === READ_STATUS.STORAGE_ERROR) {
      return { status: 'STORAGE_ERROR', reason: current.reason, familyId };
    }

    if (current.status === READ_STATUS.MALFORMED || current.status === READ_STATUS.UNSUPPORTED_VERSION) {
      // Unreadable content is never overwrite permission: preserve the raw
      // bytes through a verified recovery copy first.
      if (!preserveUnreadableSource(scope, locator)) {
        return { status: 'SOURCE_PRESERVATION_FAILED', reason: 'verified-recovery-copy-required', familyId };
      }
      // The verified copy exists; retire the unreadable source and create a
      // fresh record.
      clearScopedNative({ familyId, locator });
      const envelope = createDraftEnvelope({
        scope,
        draftId: generateDraftId('native'),
        payload: value
      });
      const written = writeScopedRecord({ familyId, scope, locator, value: envelope, context: captured.context });
      if (written.status !== WRITE_STATUS.OK) {
        return { status: written.status, reason: written.reason, familyId };
      }
      lastRead.set(locatorKeyOf(scope, locator), {
        status: READ_STATUS.PRESENT_VALID,
        revision: envelope.localRevision,
        draftId: envelope.draftId
      });
      return { status: 'OK', key: written.key, persisted: true };
    }

    if (current.status === READ_STATUS.PRESENT_VALID) {
      const known = lastRead.get(locatorKeyOf(scope, locator));
      const currentEnvelope = current.value;
      if (known && known.status === READ_STATUS.PRESENT_VALID &&
        (known.revision !== currentEnvelope.localRevision || known.draftId !== currentEnvelope.draftId)) {
        // Another writer moved the record after our load. Never publish the
        // stale snapshot over the winner: fork the candidate instead.
        const forked = forkScopedRecord({
          familyId,
          scope,
          context: captured.context,
          payload: value,
          sourceEnvelope: currentEnvelope,
          sourceKey: current.key
        });
        return {
          status: 'STALE_REVISION',
          currentRevision: currentEnvelope.localRevision,
          forkedDraftId: forked && forked.status === 'FORKED' ? forked.draftId : null,
          familyId
        };
      }
      const next = bumpLocalRevision(currentEnvelope, value);
      const written = writeScopedRecord({ familyId, scope, locator, value: next, context: captured.context });
      if (written.status !== WRITE_STATUS.OK) {
        return { status: written.status, reason: written.reason, familyId };
      }
      lastRead.set(locatorKeyOf(scope, locator), {
        status: READ_STATUS.PRESENT_VALID,
        revision: next.localRevision,
        draftId: next.draftId
      });
      return { status: 'OK', key: written.key, persisted: true };
    }

    // MISSING (or any non-valid non-unreadable classification): create.
    const envelope = createDraftEnvelope({
      scope,
      draftId: generateDraftId('native'),
      payload: value
    });
    const written = writeScopedRecord({ familyId, scope, locator, value: envelope, context: captured.context });
    if (written.status !== WRITE_STATUS.OK) {
      return { status: written.status, reason: written.reason, familyId };
    }
    lastRead.set(locatorKeyOf(scope, locator), {
      status: READ_STATUS.PRESENT_VALID,
      revision: envelope.localRevision,
      draftId: envelope.draftId
    });
    return { status: 'OK', key: written.key, persisted: true };
  }

  return {
    familyId,
    hasActiveOwner: () => !!resolveActiveScope(),
    load(locator = []) {
      quarantineOnce();
      const scope = resolveActiveScope();
      if (!scope) return fallback;
      const read = loadScopedNative({ familyId, locator });
      if (read.status !== 'OK') return fallback;
      let value = read.value;
      if (needsEnvelope() && value && typeof value === 'object' && 'payload' in value) {
        value = value.payload;
        lastRead.set(locatorKeyOf(scope, locator), {
          status: READ_STATUS.PRESENT_VALID,
          revision: read.value.localRevision,
          draftId: read.value.draftId
        });
      }
      return value === undefined ? fallback : value;
    },
    save(value, locator = []) {
      const scope = resolveActiveScope();
      if (!scope) return { status: 'NO_ACTIVE_SCOPE' };
      if (!resolveFamily(familyId)) {
        return { status: 'INVALID_FAMILY', reason: `unknown-family:${String(familyId)}` };
      }
      if (!needsEnvelope()) {
        return saveScopedNative({ familyId, locator, value });
      }
      return saveAuthored(scope, locator, value);
    },
    clear(locator = []) {
      if (!resolveActiveScope()) return { status: 'NO_ACTIVE_SCOPE' };
      return clearScopedNative({ familyId, locator });
    },
    resetForTests() {
      quarantined.clear();
      lastRead.clear();
    },
    quarantineOnce
  };
}
