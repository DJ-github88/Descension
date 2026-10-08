/**
 * Project 5 Wave B (S7) — scoped storage engine for zustand persist stores.
 *
 * Existing private stores persisted wholesale to global keys. This adapter
 * gives a store a verified-owner scoped draft behind the same persist API:
 *
 *  - reads are hydration-gated (no active destination scope → no private data);
 *  - writes capture the operation context and use the Wave-A coordination
 *    (predecessor revision/draft id) with per-key serialization, so rapid
 *    in-tab writes cannot race themselves;
 *  - cross-tab stale writers never overwrite a newer record;
 *  - scoped data is never deleted by the engine;
 *  - a handoff participant resets the in-memory store on retirement and
 *    rehydrates it for the destination scope on activation, so A's private
 *    state is never visible under B.
 *
 * Legacy global keys are NOT written by this engine. They remain on disk as
 * untouched recovery sources (S7.5) and are never auto-adopted.
 */

import {
  resolveActiveScope,
  captureConsumerContext,
  loadScopedDraft,
  saveScopedDraft,
  ensureLegacySourceQuarantine
} from './scopedConsumer';
import { forkScopedRecord } from './localCoordination';
import { registerHandoffParticipant } from './handoff/accountHandoffCoordinator';
import { bumpLocalRevision, confirmRevision } from './draftEnvelope';

const baselineKey = (scope, familyId) => `${scope.scopeKind}:${scope.scopeId}:${familyId}`;

/** familyId -> storage engine, so central registration can find the engine. */
const engineRegistry = new Map();

/**
 * zustand-persist config factory for a scoped family. Mirrors the previous
 * `createStorageConfig(name, options)` shape but persists through the scoped
 * engine instead of the global key.
 *
 * @param {string} familyId registry family
 * @param {string} name legacy key name (kept for diagnostics only)
 * @param {object} persistOptions partialize/merge/version/migrate/...
 */
export function createScopedStorageConfig(familyId, name, persistOptions = {}) {
  const engine = createScopedStoreStorage({ familyId, sanitize: persistOptions.sanitize || null });
  engineRegistry.set(familyId, engine);
  const { sanitize: _sanitize, ...rest } = persistOptions;
  return {
    name: name || familyId,
    storage: engine,
    ...rest
  };
}

export function registerScopedStoreEngine(familyId, engine) {
  engineRegistry.set(familyId, engine);
  return engine;
}

export function getScopedStoreEngine(familyId) {
  return engineRegistry.get(familyId) || null;
}

/**
 * Create a zustand-persist compatible storage object for one scoped family.
 *
 * @param {{
 *   familyId: string,
 *   sanitize?: ((state: object) => object)|null
 * }} input
 */
export function createScopedStoreStorage({ familyId, sanitize = null } = {}) {
  const baselines = new Map();
  const tails = new Map();
  const pendingByFamily = new Map();
  const legacyQuarantined = new Set();
  let pendingWriteCount = 0;
  // Room-projection suspension: while set for a scope, writes stay in memory
  // only (server room projections must never become authored personal drafts).
  // A scope change clears the suspension so a later account is never silently
  // left unsaved.
  let suspendedScopeKey = null;

  const storage = {
    getItem: (name) => {
      const scope = resolveActiveScope();
      if (!scope) return null;
      const read = loadScopedDraft({ familyId });
      if (read.status !== 'OK') {
        // Legacy preservation (Wave B/E): the retired global key is copied to
        // a verified quarantine record once per scope; it is never read as
        // state and never deleted.
        const quarantineKey = `${scope.scopeKind}:${scope.scopeId}:${String(name)}`;
        if (typeof name === 'string' && name && !legacyQuarantined.has(quarantineKey)) {
          legacyQuarantined.add(quarantineKey);
          try {
            if (typeof localStorage !== 'undefined' && localStorage.getItem(name) !== null) {
              ensureLegacySourceQuarantine({ legacyKey: name, familyId, scope });
            }
          } catch (_error) {
            // best-effort; the raw source stays untouched either way
          }
        }
        return null;
      }
      const payload = read.payload;
      if (!payload || typeof payload !== 'object' || !('state' in payload)) return null;
      baselines.set(baselineKey(scope, familyId), {
        revision: read.localRevision,
        draftId: read.draftId,
        dirty: read.envelope?.dirty === true
      });
      return {
        state: payload.state,
        version: typeof payload.version === 'number' ? payload.version : 0
      };
    },

    setItem: (_name, value) => {
      const captured = captureConsumerContext();
      if (!captured.ok) {
        // No verified destination: keep the value in memory only. Never write
        // private state without an owner scope.
        return;
      }
      const scope = captured.context.scope;
      const scopeKey = `${scope.scopeKind}:${scope.scopeId}`;
      if (suspendedScopeKey !== null) {
        if (suspendedScopeKey !== scopeKey) {
          suspendedScopeKey = null; // owner changed: never leave a new account unsaved
        } else {
          return; // suspended room projection: memory only
        }
      }
      const key = baselineKey(scope, familyId);
      // Capture the immutable operation context NOW, before the write is
      // queued. A queued write that resumes after a handoff must be refused,
      // never re-attributed to the new account.
      const operationContext = captured.context;
      const rawState = value && typeof value === 'object' && 'state' in value ? value.state : value;
      const version = value && typeof value === 'object' && 'version' in value ? value.version : 0;
      let state = rawState;
      if (sanitize) {
        try {
          state = sanitize(rawState);
        } catch (_error) {
          state = rawState;
        }
      }
      const payload = { state, version };

      // Serialize writes per scope+family so a later write always observes the
      // baseline established by the earlier one.
      const previous = tails.get(key) || Promise.resolve();
      pendingWriteCount += 1;
      const run = previous.then(async () => {
        let baseline = baselines.get(key) || { revision: null, draftId: null };
        const result = await saveScopedDraft({
          familyId,
          payload,
          context: operationContext,
          expectedRevision: baseline.revision,
          expectedDraftId: baseline.draftId
        });
        if (result.status === 'STALE_REVISION') {
          // The durable record moved (another writer/tab). Adopting the
          // winner's baseline must never authorize publishing this stale
          // whole-document snapshot over the winner: preserve the candidate
          // as a fork and leave the winner untouched.
          let forkedId = null;
          try {
            const forked = forkScopedRecord({
              familyId,
              scope,
              context: operationContext,
              payload
            });
            if (forked && forked.status === 'FORKED') forkedId = forked.draftId;
          } catch (_error) {
            // best-effort; the winner is never overwritten either way
          }
          baselines.set(key, {
            revision: result.currentRevision ?? null,
            draftId: result.currentDraftId ?? null,
            dirty: false,
            forkedDraftId: forkedId
          });
          return result;
        }
        if (result.status === 'OK' || result.status === 'FORKED') {
          baselines.set(key, { revision: result.newRevision ?? 1, draftId: result.draftId, dirty: true });
        }
        return result;
      });
      const settled = run.finally(() => { pendingWriteCount -= 1; });
      tails.set(key, settled.catch(() => {}));
      pendingByFamily.set(familyId, settled);
    },

    // Authored scoped data is never deleted through the persistence engine.
    removeItem: () => {}
  };

  storage.__flush = () => Promise.all([...pendingByFamily.values()]);
  storage.__resetBaselines = () => baselines.clear();

  /** True while a captured scoped write is still queued/in flight. */
  storage.__hasPendingWrites = () => pendingWriteCount > 0;

  /** Suspend scoped writes for the current owner (room projection window). */
  storage.__suspendWrites = () => {
    const scope = resolveActiveScope();
    suspendedScopeKey = scope ? `${scope.scopeKind}:${scope.scopeId}` : null;
    return suspendedScopeKey;
  };

  /** Resume scoped writes (owner change also resumes automatically). */
  storage.__resumeWrites = () => {
    suspendedScopeKey = null;
  };

  storage.__isSuspended = () => suspendedScopeKey !== null;

  /** True when the current scope's record has unacknowledged local edits. */
  storage.__isDirty = () => {
    const scope = resolveActiveScope();
    if (!scope) return false;
    const baseline = baselines.get(baselineKey(scope, familyId));
    return !!baseline && baseline.dirty === true;
  };

  /**
   * Mark the exact synced revision as confirmed (dirty=false). Revision-bound:
   * if a newer edit exists (revision moved past the acknowledged one) the
   * confirmation is refused, so an N acknowledgement can never clear N+1.
   */
  storage.__confirmSynced = (expectedRevision = null) => {
    const captured = captureConsumerContext();
    if (!captured.ok) return Promise.resolve(false);
    const scope = captured.context.scope;
    const operationContext = captured.context;
    const key = baselineKey(scope, familyId);
    const base = baselines.get(key);
    if (!base || typeof base.revision !== 'number') return Promise.resolve(false);
    if (expectedRevision !== null && base.revision !== expectedRevision) {
      return Promise.resolve(false);
    }
    const previous = tails.get(key) || Promise.resolve();
    const run = previous.then(async () => {
      const current = baselines.get(key);
      if (!current || current.revision !== base.revision) return false; // newer edit
      const result = await saveScopedDraft({
        familyId,
        payload: null,
        context: operationContext,
        expectedRevision: current.revision,
        expectedDraftId: current.draftId,
        successor: (prior) => confirmRevision(
          bumpLocalRevision(prior, prior.payload),
          prior.localRevision + 1
        )
      });
      if (result.status === 'OK') {
        baselines.set(key, { revision: result.newRevision, draftId: result.draftId, dirty: false });
        return true;
      }
      return false;
    });
    tails.set(key, run.catch(() => {}));
    return run;
  };

  return storage;
}

/**
 * Bind a persisted store to the account handoff lifecycle:
 *  - stopNewWork: flush pending scoped writes while the old scope is active;
 *  - resetProjection: wipe A's in-memory state before B can see it;
 *  - activate: rehydrate the destination scope's record.
 */
export function registerScopedStoreHandoff({ familyId, store, storage = null, label = familyId }) {
  if (!store || typeof store.getState !== 'function') {
    return () => {};
  }
  const engine = storage || engineRegistry.get(familyId) || null;
  const initialState = store.getState();

  const resetInMemory = () => {
    try {
      store.setState(initialState, true);
    } catch (_error) {
      // best-effort reset; rehydration still runs under the destination scope
    }
    if (engine && typeof engine.__resetBaselines === 'function') {
      engine.__resetBaselines();
    }
  };

  const rehydrate = async () => {
    if (!resolveActiveScope()) return { ok: true };
    try {
      await store.persist?.rehydrate?.();
      return { ok: true };
    } catch (error) {
      return { ok: false, reason: `rehydrate-failed:${error?.message || 'error'}` };
    }
  };

  registerHandoffParticipant({
    id: `scoped-store:${label}`,
    stopNewWork: async () => {
      if (!engine || typeof engine.__flush !== 'function') return { ok: true };
      const results = await engine.__flush();
      // A resolved flush promise is not proof the writes succeeded. Inspect
      // the actual coordination results and fail the handoff if any queued
      // write was refused or errored (never silently report ok).
      const failed = (Array.isArray(results) ? results : [results]).filter(
        (result) => result && typeof result === 'object' &&
          result.status && result.status !== 'OK' && result.status !== 'FORKED' && result.status !== 'IDLE'
      );
      if (failed.length > 0) {
        return { ok: false, reason: `queued-write-${failed[0].status}`, failures: failed.length };
      }
      return { ok: true };
    },
    resetProjection: () => {
      resetInMemory();
      return { ok: true };
    },
    activate: rehydrate
  });

  // Late registration: the gate may already be active (module load order).
  if (resolveActiveScope()) {
    Promise.resolve().then(rehydrate).catch(() => {});
  }

  return resetInMemory;
}
