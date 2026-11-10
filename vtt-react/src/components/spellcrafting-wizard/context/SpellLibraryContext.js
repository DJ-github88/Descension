import React, { createContext, useContext, useReducer, useEffect, useCallback, useSyncExternalStore } from 'react';
import { getBootstrapGateState, subscribeBootstrapGate } from '../../../persistence/bootstrapPrivacyGate';
import {
  saveLibraryToStorage,
  loadLibraryFromStorage,
  generateUniqueId,
  validateLibraryIntegrity,
  createDefaultCategories,
  categorizeSpell,
  getDefaultLibrary
} from '../core/utils/libraryManager';

// Action types
export const LIBRARY_ACTION_TYPES = {
  // Spell management
  ADD_SPELL: 'ADD_SPELL',
  UPDATE_SPELL: 'UPDATE_SPELL',
  DELETE_SPELL: 'DELETE_SPELL',
  DUPLICATE_SPELL: 'DUPLICATE_SPELL',
  CATEGORIZE_SPELL: 'CATEGORIZE_SPELL',
  ADD_SPELL_TO_COLLECTION: 'ADD_SPELL_TO_COLLECTION',

  // Category management
  ADD_CATEGORY: 'ADD_CATEGORY',
  UPDATE_CATEGORY: 'UPDATE_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY',

  // Filtering and sorting
  SET_FILTERS: 'SET_FILTERS',
  CLEAR_FILTERS: 'CLEAR_FILTERS',
  SET_SORT_ORDER: 'SET_SORT_ORDER',

  // Selection
  SELECT_SPELL: 'SELECT_SPELL',
  DESELECT_SPELL: 'DESELECT_SPELL',

  // Library management
  IMPORT_LIBRARY: 'IMPORT_LIBRARY',
  RESET_LIBRARY: 'RESET_LIBRARY',
  CLEAR_LIBRARY: 'CLEAR_LIBRARY'
};

// Initial state
const initialState = getDefaultLibrary();

// Create contexts
const SpellLibraryStateContext = createContext();
const SpellLibraryDispatchContext = createContext();

// Reducer function for state management
function spellLibraryReducer(state, action) {
  switch (action.type) {
    case LIBRARY_ACTION_TYPES.ADD_SPELL: {
      // Determine appropriate categories for the spell
      const spellCategories = action.payload.categoryIds || categorizeSpell(action.payload);

      const newSpell = {
        ...action.payload,
        // Preserve existing ID if provided, otherwise generate a new one
        id: action.payload.id || generateUniqueId(),
        dateCreated: action.payload.dateCreated || new Date().toISOString(),
        lastModified: new Date().toISOString(),
        categoryIds: spellCategories
      };

      const newState = {
        ...state,
        spells: [...state.spells, newSpell],
        selectedSpell: newSpell.id
      };

      return newState;
    }

    case 'ADD_SPELL_DIRECT': {
      // Add spell directly without modifying ID or other properties
      const spell = action.payload;

      return {
        ...state,
        spells: [...state.spells, spell]
      };
    }

    case 'REPLACE_ALL_SPELLS': {
      // Replace all spells with the provided array
      return {
        ...state,
        spells: action.payload,
        selectedSpell: null
      };
    }

    case LIBRARY_ACTION_TYPES.UPDATE_SPELL: {
      const { id, updates } = action.payload;

      const updatedSpells = state.spells.map(spell =>
        spell.id === id
          ? {
              ...spell,
              ...updates,
              id: spell.id,
              dateCreated: spell.dateCreated || updates.dateCreated || new Date().toISOString(),
              lastModified: new Date().toISOString()
            }
          : spell
      );

      return {
        ...state,
        spells: updatedSpells
      };
    }

    case LIBRARY_ACTION_TYPES.DELETE_SPELL: {
      const spellId = action.payload;

      const spellToDelete = state.spells.find(s => s.id === spellId);
      if (!spellToDelete) {
        console.warn('� - �️ [SpellLibraryReducer] Spell NOT found in library.spells:', spellId);
      }

      const updatedSpells = state.spells.filter(spell => spell.id !== spellId);

      // If the deleted spell was selected, deselect it
      const selectedSpell = state.selectedSpell === spellId
        ? null
        : state.selectedSpell;

      const newState = {
        ...state,
        spells: updatedSpells,
        selectedSpell
      };

      return newState;
    }

    case LIBRARY_ACTION_TYPES.DUPLICATE_SPELL: {
      const spellToDuplicate = state.spells.find(spell => spell.id === action.payload);

      if (!spellToDuplicate) {
        return state;
      }

      // Copy the whole saved record so neither library identity can mutate the other's nested
      // definition data. authoredDefinitionId/catalogueSource are deliberately retained: the
      // approved cooldown identity is exact actor + authoredDefinitionId, so keeping it lets
      // copies/versions share the existing cooldown instead of silently resetting it.
      const source = JSON.parse(JSON.stringify(spellToDuplicate));
      const spellCategories = source.categoryIds || categorizeSpell(source);
      // A catalogue-bound record's name is part of its pinned whole-record projection, so keep
      // it unchanged. Wizard-authored drafts are local definitions; rename both the record and
      // its draft so the usual record/draft admission invariant stays satisfied.
      const copyName = source.catalogueSource ? source.name : `${source.name} (Copy)`;

      const newSpell = {
        ...source,
        id: generateUniqueId(),
        name: copyName,
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        categoryIds: Array.isArray(spellCategories) ? [...spellCategories] : spellCategories
      };

      if (!source.catalogueSource && source.authoredDraft && typeof source.authoredDraft === 'object') {
        const copyDraft = { ...source.authoredDraft, name: copyName };
        newSpell.authoredDraft = copyDraft;
        newSpell.serializedData = JSON.stringify(copyDraft, null, 2);
      }

      return {
        ...state,
        spells: [...state.spells, newSpell],
        selectedSpell: newSpell.id
      };
    }

    case LIBRARY_ACTION_TYPES.CATEGORIZE_SPELL: {
      const { spellId, categoryIds } = action.payload;

      const updatedSpells = state.spells.map(spell =>
        spell.id === spellId
          ? {
              ...spell,
              categoryIds,
              lastModified: new Date().toISOString()
            }
          : spell
      );

      return {
        ...state,
        spells: updatedSpells
      };
    }

    case LIBRARY_ACTION_TYPES.ADD_SPELL_TO_COLLECTION: {
      const { spellId, collectionId } = action.payload;

      // Find the collection
      const collection = state.categories.find(cat => cat.id === collectionId);

      if (!collection) {
        return state;
      }

      // Check if spell is already in the collection
      const spellExists = collection.spells?.includes(spellId);

      if (spellExists) {
        return state;
      }

      // Add spell to collection
      const updatedCategories = state.categories.map(cat =>
        cat.id === collectionId
          ? {
              ...cat,
              spells: [...(cat.spells || []), spellId]
            }
          : cat
      );

      return {
        ...state,
        categories: updatedCategories
      };
    }

    case LIBRARY_ACTION_TYPES.ADD_CATEGORY: {
      const newCategory = {
        ...action.payload,
        id: action.payload.id || generateUniqueId('cat_')
      };

      return {
        ...state,
        categories: [...state.categories, newCategory]
      };
    }

    case LIBRARY_ACTION_TYPES.UPDATE_CATEGORY: {
      const { id, updates } = action.payload;

      const updatedCategories = state.categories.map(category =>
        category.id === id
          ? { ...category, ...updates }
          : category
      );

      return {
        ...state,
        categories: updatedCategories
      };
    }

    case LIBRARY_ACTION_TYPES.DELETE_CATEGORY: {
      const categoryId = action.payload;

      // Don't allow deletion of the 'uncategorized' and 'favorites' categories
      if (categoryId === 'uncategorized' || categoryId === 'favorites') {
        return state;
      }

      // Remove the category from the list
      const updatedCategories = state.categories.filter(category =>
        category.id !== categoryId
      );

      // Update spells that were in the deleted category
      const updatedSpells = state.spells.map(spell => {
        if (spell.categoryIds.includes(categoryId)) {
          const newCategoryIds = spell.categoryIds.filter(id => id !== categoryId);

          // If a spell would have no categories, add it to 'uncategorized'
          if (newCategoryIds.length === 0) {
            newCategoryIds.push('uncategorized');
          }

          return {
            ...spell,
            categoryIds: newCategoryIds,
            lastModified: new Date().toISOString()
          };
        }

        return spell;
      });

      return {
        ...state,
        categories: updatedCategories,
        spells: updatedSpells
      };
    }

    case LIBRARY_ACTION_TYPES.SET_FILTERS: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };
    }

    case LIBRARY_ACTION_TYPES.CLEAR_FILTERS: {
      return {
        ...state,
        filters: {
          query: '',
          categories: [],
          levels: [],
          effectTypes: [],
          spellTypes: [],
          damageTypes: []
        }
      };
    }

    case LIBRARY_ACTION_TYPES.SET_SORT_ORDER: {
      return {
        ...state,
        sortOrder: action.payload
      };
    }

    case LIBRARY_ACTION_TYPES.SELECT_SPELL: {
      return {
        ...state,
        selectedSpell: action.payload
      };
    }

    case LIBRARY_ACTION_TYPES.DESELECT_SPELL: {
      return {
        ...state,
        selectedSpell: null
      };
    }

    case LIBRARY_ACTION_TYPES.IMPORT_LIBRARY: {
      // Merge the imported library with the current one
      const { spells, categories } = action.payload;

      // Merge categories, ensuring we keep default ones
      const existingCategoryIds = state.categories.map(cat => cat.id);
      const newCategories = categories.filter(cat => !existingCategoryIds.includes(cat.id));

      // Ensure all spells have unique IDs
      const existingSpellIds = state.spells.map(spell => spell.id);
      const newSpells = spells.map(spell => {
        if (existingSpellIds.includes(spell.id)) {
          // Create a new ID for duplicate spells
          return {
            ...spell,
            id: generateUniqueId(),
            name: `${spell.name} (Imported)`,
            dateCreated: new Date().toISOString(),
            lastModified: new Date().toISOString()
          };
        }
        return spell;
      });

      return {
        ...state,
        spells: [...state.spells, ...newSpells],
        categories: [...state.categories, ...newCategories]
      };
    }

    case LIBRARY_ACTION_TYPES.RESET_LIBRARY: {
      return {
        ...initialState,
        categories: createDefaultCategories() // Ensure we always have default categories
      };
    }

    case LIBRARY_ACTION_TYPES.CLEAR_LIBRARY: {
      return {
        ...state,
        spells: [],
        selectedSpell: null
      };
    }

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// Provider component
function SpellLibraryProvider({ children }) {
  // App already owns this account's library. Nested book/item windows must share its state and
  // dispatch, otherwise a newly saved Wizard definition is invisible to the Creature selector.
  const parent = useContext(SpellLibraryStateContext);
  return parent === undefined ? <OwnedSpellLibraryProvider>{children}</OwnedSpellLibraryProvider> : <>{children}</>;
}

// The library is verified-owner scoped. Hydration key of the bootstrap gate:
//  - `kind:id`      scope ACTIVE: that principal's saved library is readable
//  - `unavailable`  a scope is retained but the gate is not active (LOADING / RETIRING / HOLD): nothing readable, nothing writable
//  - `signed-out`   no scope: default library, writes are refused by the scoped storage
const hydrationKeyOf = (gate) => {
  if (!gate || !gate.scope) return 'signed-out';
  return gate.phase === 'active' ? `${gate.scope.scopeKind}:${gate.scope.scopeId}` : 'unavailable';
};

const loadHydrated = () => {
  const storedLibrary = loadLibraryFromStorage();
  return storedLibrary ? validateLibraryIntegrity(storedLibrary) : initialState;
};

// State is `{ key, library }`: the library is only ever the library of `key`. Actions carry the key they were dispatched for, so
// work issued for an older principal (a stale closure, a pending callback) is dropped instead of landing in the newer scope.
function scopedLibraryReducer(state, action) {
  if (action.type === '@@HYDRATE') return { key: action.key, library: action.library };
  if (action.type === '@@SCOPED') {
    if (action.key !== state.key) return state;
    const library = spellLibraryReducer(state.library, action.action);
    return library === state.library ? state : { key: state.key, library };
  }
  return state;
}

function OwnedSpellLibraryProvider({ children }) {
  const gate = useSyncExternalStore(subscribeBootstrapGate, getBootstrapGateState, getBootstrapGateState);
  const targetKey = hydrationKeyOf(gate);
  const [scoped, rawDispatch] = useReducer(scopedLibraryReducer, null, () => ({ key: targetKey, library: loadHydrated() }));

  // Principal / phase changed: re-hydrate in place during render so the previous principal's library is never committed for
  // the new one. The provider (and the App tree under it) stays mounted; same-principal re-activation keeps its key and edits.
  if (scoped.key !== targetKey) {
    rawDispatch({ type: '@@HYDRATE', key: targetKey, library: loadHydrated() });
  }

  const dispatch = useCallback((action) => rawDispatch({ type: '@@SCOPED', key: scoped.key, action }), [scoped.key]);

  // Save to scoped storage whenever the library changes.
  useEffect(() => {
    // Only persist a library that was hydrated for the principal that is still active. An edit committed just before a switch is
    // intentionally not written (a pre-switch flush belongs to the handoff coordinator's retirement step), and an unhydrated
    // empty library can never overwrite a principal's saved one.
    if (scoped.key === 'unavailable') return;
    if (hydrationKeyOf(getBootstrapGateState()) !== scoped.key) return;
    const saved = saveLibraryToStorage(scoped.library);
    if (!saved) {
      console.error('Failed to save library to storage');
    }
  }, [scoped]);

  return (
    <SpellLibraryStateContext.Provider value={scoped.library}>
      <SpellLibraryDispatchContext.Provider value={dispatch}>
        {children}
      </SpellLibraryDispatchContext.Provider>
    </SpellLibraryStateContext.Provider>
  );
}

// Hook for accessing state
function useSpellLibrary() {
  const context = useContext(SpellLibraryStateContext);
  if (context === undefined) {
    throw new Error('useSpellLibrary must be used within a SpellLibraryProvider');
  }
  return context;
}

// Hook for accessing dispatch
function useSpellLibraryDispatch() {
  const context = useContext(SpellLibraryDispatchContext);
  if (context === undefined) {
    throw new Error('useSpellLibraryDispatch must be used within a SpellLibraryProvider');
  }
  return context;
}

// Raw contexts for components that may render OUTSIDE the provider (e.g.
// world codex embeds / tests) and need a null-safe read instead of a throw.
export { SpellLibraryStateContext, SpellLibraryDispatchContext };

// Hook for accessing the selected spell
function useSelectedSpell() {
  const { selectedSpell, spells } = useSpellLibrary();

  if (!selectedSpell) {
    return null;
  }

  return spells.find(spell => spell.id === selectedSpell);
}

// Action creators
const libraryActionCreators = {
  addSpell: (spellConfig) => ({
    type: LIBRARY_ACTION_TYPES.ADD_SPELL,
    payload: spellConfig
  }),

  updateSpell: (id, updates) => ({
    type: LIBRARY_ACTION_TYPES.UPDATE_SPELL,
    payload: { id, updates }
  }),

  deleteSpell: (id) => ({
    type: LIBRARY_ACTION_TYPES.DELETE_SPELL,
    payload: id
  }),

  duplicateSpell: (id) => ({
    type: LIBRARY_ACTION_TYPES.DUPLICATE_SPELL,
    payload: id
  }),

  categorizeSpell: (spellId, categoryIds) => ({
    type: LIBRARY_ACTION_TYPES.CATEGORIZE_SPELL,
    payload: { spellId, categoryIds }
  }),

  addSpellToCollection: (spellId, collectionId) => ({
    type: LIBRARY_ACTION_TYPES.ADD_SPELL_TO_COLLECTION,
    payload: { spellId, collectionId }
  }),

  setFilters: (filters) => ({
    type: LIBRARY_ACTION_TYPES.SET_FILTERS,
    payload: filters
  }),

  clearFilters: () => ({
    type: LIBRARY_ACTION_TYPES.CLEAR_FILTERS
  }),

  setSortOrder: (sortOrder) => ({
    type: LIBRARY_ACTION_TYPES.SET_SORT_ORDER,
    payload: sortOrder
  }),

  selectSpell: (id) => ({
    type: LIBRARY_ACTION_TYPES.SELECT_SPELL,
    payload: id
  }),

  deselectSpell: () => ({
    type: LIBRARY_ACTION_TYPES.DESELECT_SPELL
  }),

  addCategory: (category) => ({
    type: LIBRARY_ACTION_TYPES.ADD_CATEGORY,
    payload: category
  }),

  updateCategory: (id, updates) => ({
    type: LIBRARY_ACTION_TYPES.UPDATE_CATEGORY,
    payload: { id, updates }
  }),

  deleteCategory: (id) => ({
    type: LIBRARY_ACTION_TYPES.DELETE_CATEGORY,
    payload: id
  }),

  importLibrary: (libraryData) => ({
    type: LIBRARY_ACTION_TYPES.IMPORT_LIBRARY,
    payload: libraryData
  }),

  resetLibrary: () => ({
    type: LIBRARY_ACTION_TYPES.RESET_LIBRARY
  }),

  clearLibrary: () => ({
    type: LIBRARY_ACTION_TYPES.CLEAR_LIBRARY
  })
};

export {
  SpellLibraryProvider,
  useSpellLibrary,
  useSpellLibraryDispatch,
  useSelectedSpell,
  libraryActionCreators
};
