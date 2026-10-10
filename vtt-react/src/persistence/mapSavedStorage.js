/**
 * Project 5 Wave B (S5/B) — scoped saved authored maps (`vtt-saved-maps`).
 *
 * Saved map snapshots belong to the verified owner scope. Map names/ids are
 * business identifiers, never ownership proof. Writes capture the operation
 * context and use predecessor revision/draft identity, so a stale async save
 * after an account handoff is refused. The legacy global `vtt-saved-maps` raw
 * content is quarantined (verified copy) and never read automatically.
 */

import {
  resolveActiveScope,
  captureConsumerContext,
  loadScopedDraft,
  saveScopedDraft,
  ensureLegacySourceQuarantine
} from './scopedConsumer';
import { forkScopedRecord } from './localCoordination';

const FAMILY = 'core.savedMaps';
const LEGACY_KEY = 'vtt-saved-maps';

const baselines = new Map();
let legacyQuarantined = false;
let saveTail = Promise.resolve();

const scopeKey = () => {
  const scope = resolveActiveScope();
  return scope ? `${scope.scopeKind}:${scope.scopeId}` : null;
};

function quarantineLegacyOnce() {
  const scope = resolveActiveScope();
  if (!scope || legacyQuarantined) return;
  legacyQuarantined = true;
  try {
    if (typeof localStorage !== 'undefined' && localStorage.getItem(LEGACY_KEY) !== null) {
      ensureLegacySourceQuarantine({ legacyKey: LEGACY_KEY, familyId: FAMILY, scope });
    }
  } catch (_error) {
    // best-effort; the raw source stays untouched
  }
}

/** Load the owner's saved maps. Returns [] when no scoped record exists. */
export function loadSavedMaps() {
  quarantineLegacyOnce();
  if (!resolveActiveScope()) return [];
  const read = loadScopedDraft({ familyId: FAMILY });
  if (read.status !== 'OK') return [];
  const key = scopeKey();
  if (key) baselines.set(key, { revision: read.localRevision, draftId: read.draftId });
  return Array.isArray(read.payload) ? read.payload : [];
}

/**
 * Persist the owner's saved maps through coordinated CAS. Same-tab saves are
 * serialized so the compared baseline is always this writer's predecessor. A
 * concurrent winner is never overwritten: the stale candidate is forked and
 * the winner's identity is adopted.
 */
export function saveSavedMaps(savedMaps) {
  const key = scopeKey();
  const list = Array.isArray(savedMaps) ? savedMaps : [];
  // Capture the immutable operation context at public entry so a queued write
  // can never be re-attributed to a later account.
  const captured = captureConsumerContext();
  if (!captured.ok) {
    return Promise.resolve({ status: 'NO_ACTIVE_SCOPE', reason: captured.reason });
  }
  const operationContext = captured.context;
  const run = () => {
    const baseline = (key && baselines.get(key)) || { revision: null, draftId: null };
    if (baseline.external) {
      // Never publish a queued stale snapshot over an external winner just
      // because an earlier handler adopted its baseline. Preserve the
      // candidate as a fork; a fresh load re-enables normal successors.
      let forkedId = null;
      try {
        const scope = resolveActiveScope();
        if (scope) {
          const forked = forkScopedRecord({ familyId: FAMILY, scope, context: operationContext, payload: list });
          if (forked && forked.status === 'FORKED') forkedId = forked.draftId;
        }
      } catch (_error) {
        // best-effort; the winner is never overwritten either way
      }
      return Promise.resolve({
        status: 'STALE_REVISION',
        currentRevision: baseline.revision,
        currentDraftId: baseline.draftId,
        forkedDraftId: forkedId
      });
    }
    return saveScopedDraft({
      familyId: FAMILY,
      payload: list,
      context: operationContext,
      expectedRevision: baseline.revision,
      expectedDraftId: baseline.draftId
    });
  };
  const pending = saveTail.then(run, run).then((result) => {
    if ((result.status === 'OK' || result.status === 'FORKED') && key) {
      baselines.set(key, { revision: result.newRevision ?? 1, draftId: result.draftId });
    } else if (result.status === 'STALE_REVISION' && key) {
      let forkedId = null;
      try {
        const scope = resolveActiveScope();
        if (scope) {
          const forked = forkScopedRecord({ familyId: FAMILY, scope, context: operationContext, payload: list });
          if (forked && forked.status === 'FORKED') forkedId = forked.draftId;
        }
      } catch (_error) {
        // best-effort; the winner is never overwritten either way
      }
      baselines.set(key, {
        revision: result.currentRevision ?? null,
        draftId: result.currentDraftId ?? null,
        external: true,
        forkedDraftId: forkedId
      });
    }
    return result;
  });
  saveTail = pending.catch(() => {});
  pending.catch(() => {});
  return pending;
}

/** Append one authored map snapshot to the owner's list. */
export function appendSavedMap(entry) {
  const list = loadSavedMaps();
  list.push(entry);
  return saveSavedMaps(list);
}

/** Test-only reset of module bookkeeping. */
export function resetMapSavedStorageForTests() {
  baselines.clear();
  legacyQuarantined = false;
}
