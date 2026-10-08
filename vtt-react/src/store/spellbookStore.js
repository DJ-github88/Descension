import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateSpellId } from '../data/spellUtils';
import { db, isFirebaseConfigured } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { safeLocalStorageGet } from '../utils/storageUtils';
import { createScopedStoreStorage, registerScopedStoreEngine } from '../persistence/scopedStoreStorage';
import {
  captureConsumerContext,
  isConsumerContextCurrent,
  saveScopedDraft
} from '../persistence/scopedConsumer';

// Wave B (final sweep): local spellbook mirror is verified-owner scoped; the
// uid-scoped Firebase path above remains the cloud copy.
const spellbookScopedStorage = createScopedStoreStorage({ familyId: 'library.spellbook' });
registerScopedStoreEngine('library.spellbook', spellbookScopedStorage);

const DEFAULT_COLLECTIONS = [
  { id: 'favorites', name: 'Favorites', icon: 'star', spells: [] },
  { id: 'custom', name: 'My Spells', icon: 'book', spells: [] }
];

const initialState = {
  spells: [],
  collections: DEFAULT_COLLECTIONS,
  selectedSpell: null,
  selectedCollection: null,
  activeTab: 'wizard',
  filters: {
    searchText: '',
    categories: [],
    levels: { min: 0, max: 9 }
  },
  windowPosition: null,
  windowSize: { width: 1000, height: 700 }
};

const PERSIST_KEYS = ['spells', 'collections', 'favorites'];

async function loadSpellbookFromFirebase(userId) {
  if (!isFirebaseConfigured || !db) return null;
  try {
    const docRef = doc(db, 'users', userId, 'spellbook', 'data');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (error) {
    console.error('Error loading spellbook from Firebase:', error);
    window.dispatchEvent(new CustomEvent('spellbook_persistence_degraded', {
      detail: { operation: 'read', error: error.message }
    }));
  }
  return null;
}

async function saveSpellbookToFirebase(userId, state) {
  if (!isFirebaseConfigured || !db) return;
  try {
    const docRef = doc(db, 'users', userId, 'spellbook', 'data');
    const data = {};
    PERSIST_KEYS.forEach(key => {
      if (state[key] !== undefined) {
        data[key] = state[key];
      }
    });
    data.collections = state.collections || [];
    data.spells = state.spells || [];
    data.updatedAt = new Date().toISOString();
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error('Error saving spellbook from Firebase:', error);
    window.dispatchEvent(new CustomEvent('spellbook_persistence_degraded', {
      detail: { operation: 'write', error: error.message }
    }));
  }
}

function getAuthUser() {
  try {
    const authData = safeLocalStorageGet('auth-storage');
    if (authData) {
      const parsed = JSON.parse(authData);
      return parsed.state?.user || null;
    }
  } catch (e) {
    // Ignore parsing errors
  }
  return null;
}

const createFirebaseStorage = () => ({
  getItem: async (name) => {
    // B1: capture the verified destination before any await. An obsolete
    // response (logout/relogin/handoff) must never hydrate the live store.
    const captured = captureConsumerContext();
    if (!captured.ok) return null;
    const scopeId = captured.context.scope ? captured.context.scope.scopeId : null;
    try {
      const user = getAuthUser();
      if (user && !user.isGuest && scopeId && user.uid === scopeId) {
        const firebaseData = await loadSpellbookFromFirebase(user.uid);
        if (!isConsumerContextCurrent(captured.context)) return null;
        if (firebaseData) {
          return {
            state: {
              spells: firebaseData.spells || [],
              collections: firebaseData.collections || DEFAULT_COLLECTIONS
            },
            version: 1
          };
        }
      }
      // Wave B (final sweep): the local mirror is verified-owner scoped.
      if (!isConsumerContextCurrent(captured.context)) return null;
      return spellbookScopedStorage.getItem(name);
    } catch (error) {
      console.error('Error loading spellbook from Firebase:', error);
      if (!isConsumerContextCurrent(captured.context)) return null;
      return spellbookScopedStorage.getItem(name);
    }
  },

  setItem: async (name, data) => {
    const captured = captureConsumerContext();
    try {
      const user = getAuthUser();
      if (user && !user.isGuest) {
        await saveSpellbookToFirebase(user.uid, data.state);
      }
    } catch (error) {
      console.error('Error saving spellbook from Firebase:', error);
    }
    if (!captured.ok) return;
    if (isConsumerContextCurrent(captured.context)) {
      spellbookScopedStorage.setItem(name, data);
      return;
    }
    // Superseded while the cloud write was in flight: never mirror A's edit
    // under B. Preserve the captured payload under the originating owner.
    try {
      await saveScopedDraft({
        familyId: 'library.spellbook',
        payload: {
          state: data && data.state ? data.state : data,
          version: data && typeof data.version === 'number' ? data.version : 0
        },
        context: captured.context
      });
    } catch (_error) {
      // The retired gate legitimately refuses; the cloud copy above is the
      // preserved copy in that case.
    }
  },

  removeItem: async () => {
    // Authored scoped content is never deleted through persistence.
  }
});

const useSpellbookStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      addSpell: (spellData) => {
        const spell = {
          ...spellData,
          id: spellData.id || generateSpellId(spellData.name),
          createdAt: new Date().toISOString()
        };

        set(state => ({
          spells: [...(state.spells || []), spell],
          collections: (state.collections || []).map(col =>
            col.id === 'custom'
              ? { ...col, spells: [...(col.spells || []), spell.id] }
              : col
          )
        }));
      },

      updateSpell: (id, updates) => {
        set(state => ({
          spells: (state.spells || []).map(spell =>
            spell.id === id ? { ...spell, ...updates } : spell
          )
        }));
      },

      deleteSpell: (id) => {
        set(state => ({
          spells: (state.spells || []).filter(spell => spell.id !== id),
          collections: (state.collections || []).map(col => ({
            ...col,
            spells: (col.spells || []).filter(spellId => spellId !== id)
          }))
        }));
      },

      addCollection: (name, icon = 'book') => {
        const collection = {
          id: `collection-${Date.now()}`,
          name,
          icon,
          spells: []
        };

        set(state => ({
          collections: [...(state.collections || []), collection]
        }));
      },

      addSpellToCollection: (spellId, collectionId) => {
        set(state => ({
          collections: (state.collections || []).map(col =>
            col.id === collectionId && !(col.spells || []).includes(spellId)
              ? { ...col, spells: [...(col.spells || []), spellId] }
              : col
          )
        }));
      },

      removeSpellFromCollection: (spellId, collectionId) => {
        set(state => ({
          collections: (state.collections || []).map(col =>
            col.id === collectionId
              ? { ...col, spells: (col.spells || []).filter(id => id !== spellId) }
              : col
          )
        }));
      },

      selectSpell: (id) => set({ selectedSpell: id }),
      selectCollection: (id) => set({ selectedCollection: id }),
      setActiveTab: (tab) => set({ activeTab: tab }),

      updateFilters: (updates) => set(state => ({
        filters: { ...state.filters, ...updates }
      })),

      setWindowPosition: (position) => {
        set({ windowPosition: position });
      },

      setWindowSize: (size) => {
        set({ windowSize: size });
      },

      resetStore: () => set(initialState)
    }),
    {
      name: 'spellbook-storage',
      version: 1,
      storage: createFirebaseStorage(),
      partialize: (state) => ({
        spells: state.spells,
        collections: state.collections
      })
    }
  )
);

export default useSpellbookStore;
