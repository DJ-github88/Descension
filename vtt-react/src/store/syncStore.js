import { create } from 'zustand';
import { applyPatch } from 'fast-json-patch';

const useSyncStore = create((set, get) => ({
  lastProcessedSequenceId: 0,
  networkFreeze: false,
  offlineQueue: [],

  setSequenceId: (id) => set({ lastProcessedSequenceId: id }),

  setNetworkFreeze: (isFrozen) => set({ networkFreeze: isFrozen }),

  queueOfflineAction: (action) => set((state) => ({
    offlineQueue: [...state.offlineQueue, action]
  })),

  clearOfflineQueue: () => set({ offlineQueue: [] }),

  applyDeltaPatch: (patches) => {
    requestAnimationFrame(() => {
      try {
        const result = get()._applyPatchesSync(patches);
        if (result.failed > 0 && process.env.NODE_ENV !== 'production') {
          console.warn(`[syncStore] ${result.failed}/${result.total} delta patches failed to apply`, result.errors);
        }
      } catch (e) {
        console.error('Failed to apply delta patch', e);
      }
    });
  },

  applyDeltaPatchSync: (patches) => get()._applyPatchesSync(patches),

  _applyPatchesSync: (patches) => {
    if (!Array.isArray(patches) || patches.length === 0) {
      return { applied: 0, failed: 0, total: 0, errors: [] };
    }

    const targets = get()._patchTargets;
    const errors = [];
    let applied = 0;

    for (const patch of patches) {
      const path = patch && typeof patch.path === 'string' ? patch.path : '';
      const routed = targets.get(path) || _findTargetForPath(targets, path);

      if (!routed) {
        errors.push({ patch, reason: 'no_target_registered' });
        continue;
      }

      try {
        const doc = routed.getDoc();
        if (!doc || typeof doc !== 'object') {
          errors.push({ patch, reason: 'target_doc_unavailable' });
          continue;
        }

        const relativePath = path.slice(routed.prefix.length) || '/';
        const localizedPatch = { ...patch, path: relativePath };
        applyPatch(doc, [localizedPatch], undefined, true);
        routed.commit(doc);
        applied++;
      } catch (e) {
        errors.push({ patch, reason: e.message });
      }
    }

    return { applied, failed: errors.length, total: patches.length, errors };
  },

  _patchTargets: new Map(),

  registerPatchTarget: (prefix, getDoc, commit) => {
    if (typeof prefix !== 'string' || typeof getDoc !== 'function') {
      throw new TypeError('registerPatchTarget requires prefix and getDoc');
    }
    const safePrefix = prefix.startsWith('/') ? prefix : `/${prefix}`;
    set((state) => {
      const next = new Map(state._patchTargets);
      next.set(safePrefix, { prefix: safePrefix, getDoc, commit: commit || (() => {}) });
      return { _patchTargets: next };
    });
    return () => get().unregisterPatchTarget(safePrefix);
  },

  unregisterPatchTarget: (prefix) => {
    const safePrefix = prefix.startsWith('/') ? prefix : `/${prefix}`;
    set((state) => {
      if (!state._patchTargets.has(safePrefix)) return state;
      const next = new Map(state._patchTargets);
      next.delete(safePrefix);
      return { _patchTargets: next };
    });
  },

  clearPatchTargets: () => set({ _patchTargets: new Map() })
}));

function _findTargetForPath(targets, path) {
  let best = null;
  let bestLen = -1;
  for (const target of targets.values()) {
    if (path === target.prefix || path.startsWith(target.prefix.endsWith('/') ? target.prefix : target.prefix + '/')) {
      if (target.prefix.length > bestLen) {
        best = target;
        bestLen = target.prefix.length;
      }
    }
  }
  return best;
}

export default useSyncStore;
