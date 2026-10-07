import { create } from 'zustand';

/**
 * Project 4 H14: GM-side store for explicit, owner-consented read-only
 * inventory projections. Never mixed into the GM's own inventory.
 */
const useSharedInventoryStore = create((set) => ({
  views: {},
  setSharedView: (characterId, view) => set((state) => ({
    views: { ...state.views, [characterId]: { ...view, updatedAt: Date.now() } }
  })),
  markPending: (characterId, view) => set((state) => ({
    views: {
      ...state.views,
      [characterId]: { characterId, ...view, inventoryData: null, pending: true, updatedAt: Date.now() }
    }
  })),
  removeSharedView: (characterId) => set((state) => {
    const next = { ...state.views };
    delete next[characterId];
    return { views: next };
  }),
  clearSharedViews: () => set({ views: {} })
}));

export default useSharedInventoryStore;
