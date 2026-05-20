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
     // Use this function to deep-merge incoming patches onto the relevant Zustand stores
     // We will wrap this in requestAnimationFrame and decouple it as per the blueprint
     requestAnimationFrame(() => {
        try {
            // Because our patches might target gameStore, characterStore, etc.,
            // we will need to route patches or apply them to a unified state root.
            // For now, we will handle them in MultiplayerApp.
        } catch(e) {
            console.error('Failed to apply delta patch', e);
        }
     });
  }
}));

export default useSyncStore;
