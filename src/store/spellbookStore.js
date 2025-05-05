import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateSpellId } from '../data/spellUtils';

// Initial collections
const DEFAULT_COLLECTIONS = [
  { id: 'favorites', name: 'Favorites', icon: 'star', spells: [] },
  { id: 'custom', name: 'My Spells', icon: 'book', spells: [] }
];

// Initial state
const initialState = {
  spells: [],
  collections: DEFAULT_COLLECTIONS,
  selectedSpell: null,
  selectedCollection: null,
  activeTab: 'spells', // Default tab
  filters: {
    searchText: '',
    categories: [],
    levels: { min: 0, max: 9 }
  }
};

// Create the store
const useSpellbookStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Spell management
      addSpell: (spellData) => {
        const spell = {
          ...spellData,
          id: spellData.id || generateSpellId(spellData.name),
          createdAt: new Date().toISOString()
        };
        
        set(state => ({
          spells: [...state.spells, spell],
          collections: state.collections.map(col => 
            col.id === 'custom' 
              ? { ...col, spells: [...col.spells, spell.id] }
              : col
          )
        }));
      },

      updateSpell: (id, updates) => {
        set(state => ({
          spells: state.spells.map(spell =>
            spell.id === id ? { ...spell, ...updates } : spell
          )
        }));
      },

      deleteSpell: (id) => {
        set(state => ({
          spells: state.spells.filter(spell => spell.id !== id),
          collections: state.collections.map(col => ({
            ...col,
            spells: col.spells.filter(spellId => spellId !== id)
          }))
        }));
      },

      // Collection management
      addCollection: (name, icon = 'book') => {
        const collection = {
          id: `collection-${Date.now()}`,
          name,
          icon,
          spells: []
        };
        
        set(state => ({
          collections: [...state.collections, collection]
        }));
      },

      addSpellToCollection: (spellId, collectionId) => {
        set(state => ({
          collections: state.collections.map(col =>
            col.id === collectionId && !col.spells.includes(spellId)
              ? { ...col, spells: [...col.spells, spellId] }
              : col
          )
        }));
      },

      removeSpellFromCollection: (spellId, collectionId) => {
        set(state => ({
          collections: state.collections.map(col =>
            col.id === collectionId
              ? { ...col, spells: col.spells.filter(id => id !== spellId) }
              : col
          )
        }));
      },

      // Selection management
      selectSpell: (id) => set({ selectedSpell: id }),
      selectCollection: (id) => set({ selectedCollection: id }),

      // Tab management
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Filter management
      updateFilters: (updates) => set(state => ({
        filters: { ...state.filters, ...updates }
      })),

      // Reset store
      resetStore: () => set(initialState)
    }),
    {
      name: 'spellbook-storage',
      version: 1,
      getStorage: () => localStorage
    }
  )
);

export default useSpellbookStore;