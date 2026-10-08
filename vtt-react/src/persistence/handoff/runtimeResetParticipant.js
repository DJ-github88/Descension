/**
 * Project 5 Wave A (S4/G, corrected R7/B4) — private runtime projection reset.
 *
 * Handoff resets private working projections WITHOUT writing empty/default
 * payload back over the previous owner's persisted draft:
 *
 *  - nonpersisted stores with a reset contract are reset directly (a
 *    nonpersisted store cannot corrupt a durable draft);
 *  - persisted stores are reset with persistence suspended via the Zustand
 *    persist options API; the real engine is restored and verified only after
 *    the reset contract has fully settled — a late async continuation can
 *    never write through a restored engine;
 *  - explicit refusal results returned by the reset action (`{reset:false}`,
 *    `{ok:false}`, `{clean:false}`, failures/errors) are propagated as
 *    failures instead of being treated as success;
 *  - reset, suspension and restoration failures are reported so the handoff
 *    coordinator can fail closed.
 */

import { getStore } from '../../store/storeRegistry';

const NOOP_STORAGE = Object.freeze({
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
});

function isThenable(value) {
  return !!value && typeof value.then === 'function';
}

/**
 * An explicit refusal returned by the reset action is a failure, not success.
 * Returns a reason string or null for an indistinct (legacy) result.
 */
function explicitResetFailure(outcome) {
  if (!outcome || typeof outcome !== 'object') return null;
  if (outcome.reset === false) return outcome.reason || 'reset-action-refused';
  if (outcome.ok === false) return outcome.reason || 'reset-action-not-ok';
  if (outcome.clean === false) return 'reset-action-not-clean';
  if (Array.isArray(outcome.failures) && outcome.failures.length > 0) return 'reset-action-failures';
  if (Array.isArray(outcome.errors) && outcome.errors.length > 0) return 'reset-action-errors';
  return null;
}

function restorePersistence(persist, previousStorage) {
  try {
    persist.setOptions({ storage: previousStorage });
    return persist.getOptions()?.storage === previousStorage;
  } catch (_error) {
    return false;
  }
}

/**
 * Reset a store through its own `resetStore` action.
 *
 * @returns {{
 *   reset: boolean,
 *   persistenceSuspended: boolean,
 *   reason?: string
 * } | Promise<{
 *   reset: boolean,
 *   persistenceSuspended: boolean,
 *   reason?: string
 * }>}
 */
export function resetStoreWithoutPersist(store) {
  if (!store || typeof store.getState !== 'function') {
    return { reset: false, persistenceSuspended: false, reason: 'store-unavailable' };
  }
  const state = store.getState();
  const resetFn = state && typeof state.resetStore === 'function' ? state.resetStore : null;
  if (!resetFn) {
    return { reset: false, persistenceSuspended: false, reason: 'no-reset-api' };
  }

  const persist = store.persist;
  const hasPersistApi =
    persist &&
    typeof persist.setOptions === 'function' &&
    typeof persist.getOptions === 'function';

  if (!hasPersistApi) {
    // Nonpersisted store: a reset cannot write over a durable draft. An async
    // contract is awaited for settlement so its outcome is still honored.
    try {
      const outcome = resetFn();
      if (isThenable(outcome)) {
        return Promise.resolve(outcome).then(
          (resolved) => {
            // A fulfilled Promise is still a reset contract result: an
            // explicit refusal inside it is a failure, not success.
            const refusal = explicitResetFailure(resolved);
            if (refusal) return { reset: false, persistenceSuspended: false, reason: refusal };
            return { reset: true, persistenceSuspended: false };
          },
          (error) => ({
            reset: false,
            persistenceSuspended: false,
            reason: `reset-rejected:${error?.message || 'error'}`
          })
        );
      }
      const refusal = explicitResetFailure(outcome);
      if (refusal) return { reset: false, persistenceSuspended: false, reason: refusal };
      return { reset: true, persistenceSuspended: false };
    } catch (error) {
      return { reset: false, persistenceSuspended: false, reason: `reset-failed:${error?.message || 'error'}` };
    }
  }

  let previousStorage = null;
  try {
    previousStorage = persist.getOptions()?.storage ?? null;
  } catch (_error) {
    return { reset: false, persistenceSuspended: false, reason: 'persist-options-unavailable' };
  }
  if (!previousStorage) {
    return { reset: false, persistenceSuspended: false, reason: 'persist-storage-missing' };
  }

  try {
    persist.setOptions({ storage: NOOP_STORAGE });
  } catch (_error) {
    return { reset: false, persistenceSuspended: false, reason: 'suspend-failed' };
  }

  const settle = (outcome) => {
    // Restoration happens only after the reset contract settled. A failed
    // restoration is itself a surfaced failure and must never be reported as
    // a successful reset with persistence silently disabled.
    const restored = restorePersistence(persist, previousStorage);
    if (!restored) {
      return { reset: false, persistenceSuspended: false, reason: 'persistence-restore-failed' };
    }
    return outcome;
  };

  let resetResult;
  try {
    resetResult = resetFn();
  } catch (error) {
    return settle({ reset: false, persistenceSuspended: false, reason: `reset-failed:${error?.message || 'error'}` });
  }

  if (isThenable(resetResult)) {
    // Containment: persistence stays suspended until the async reset settles,
    // so any late write from the reset continuation cannot reach the durable
    // engine. Restoration (verified) happens only afterwards. A fulfilled
    // Promise is still a reset contract result: an explicit refusal inside it
    // is a failure, not success.
    return Promise.resolve(resetResult).then(
      (resolved) => {
        const refusal = explicitResetFailure(resolved);
        if (refusal) {
          return settle({ reset: false, persistenceSuspended: false, reason: refusal });
        }
        return settle({ reset: true, persistenceSuspended: true });
      },
      (error) => settle({
        reset: false,
        persistenceSuspended: false,
        reason: `reset-rejected:${error?.message || 'error'}`
      })
    );
  }

  const refusal = explicitResetFailure(resetResult);
  if (refusal) {
    return settle({ reset: false, persistenceSuspended: false, reason: refusal });
  }
  return settle({ reset: true, persistenceSuspended: true });
}

/**
 * Registered runtime stores with an explicit, safe reset contract. Stores not
 * present in the registry are treated as "no projection present" (benign);
 * registered stores without a reset API are failures.
 */
export const HANDOFF_RESETTABLE_STORE_KEYS = Object.freeze([
  'gameStore',
  'partyStore',
  'targetingStore',
  'chatStore',
  'mapStore'
]);

export function resetPrivateRuntimeProjections() {
  const results = [];
  const pending = [];
  for (const storeKey of HANDOFF_RESETTABLE_STORE_KEYS) {
    let store = null;
    try {
      store = getStore(storeKey);
    } catch (_error) {
      store = null;
    }
    if (!store) {
      results.push({ storeKey, reset: false, skipped: true, reason: 'not-registered' });
      continue;
    }
    let outcome;
    try {
      outcome = resetStoreWithoutPersist(store);
    } catch (error) {
      outcome = { reset: false, reason: `reset-failed:${error?.message || 'error'}` };
    }
    if (isThenable(outcome)) {
      pending.push(Promise.resolve(outcome).then(
        (settled) => ({ storeKey, ...settled }),
        (error) => ({ storeKey, reset: false, reason: `reset-failed:${error?.message || 'error'}` })
      ));
    } else {
      results.push({ storeKey, ...outcome });
    }
  }

  const finalize = (allResults) => {
    const failures = allResults.filter((entry) => entry.reset !== true && entry.reason !== 'not-registered');
    return { results: allResults, failures, clean: failures.length === 0 };
  };

  if (pending.length === 0) return finalize(results);
  return Promise.all(pending).then((settled) => finalize([...results, ...settled]));
}

export function createRuntimeResetParticipant() {
  return {
    id: 'runtime-projection-reset',
    stopNewWork: () => ({ ok: true }),
    preservePendingWork: () => ({ ok: true }),
    retire: () => ({ ok: true }),
    resetProjection: () => resetPrivateRuntimeProjections(),
    activate: () => ({ ok: true }),
    dispose: () => ({ ok: true })
  };
}
