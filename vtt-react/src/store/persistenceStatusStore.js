import { create } from 'zustand';

/**
 * Tracks autosave state per data domain (journal, character, annotations, ...)
 * so the UI can show a subtle Saving/Saved/Save-failed indicator instead of
 * letting cloud writes fail silently.
 */
const usePersistenceStatusStore = create((set) => ({
  // { [domain]: { status: 'idle'|'saving'|'saved'|'error', message, at } }
  statuses: {},

  setStatus: (domain, status, message = null) => set((state) => ({
    statuses: {
      ...state.statuses,
      [domain]: { status, message, at: Date.now() }
    }
  })),

  clearStatus: (domain) => set((state) => {
    const next = { ...state.statuses };
    delete next[domain];
    return { statuses: next };
  })
}));

export default usePersistenceStatusStore;
