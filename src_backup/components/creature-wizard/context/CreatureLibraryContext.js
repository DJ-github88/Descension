import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as generateUniqueId } from 'uuid';
import useCreatureStore from '../../../store/creatureStore';
import { LIBRARY_CREATURES } from '../../../data/creatureLibraryData';

// Action types
export const LIBRARY_ACTION_TYPES = {
  ADD_CREATURE: 'ADD_CREATURE',
  UPDATE_CREATURE: 'UPDATE_CREATURE',
  DELETE_CREATURE: 'DELETE_CREATURE',
  SELECT_CREATURE: 'SELECT_CREATURE',
  FILTER_CREATURES: 'FILTER_CREATURES',
  CLEAR_FILTERS: 'CLEAR_FILTERS',
  SET_SORT_ORDER: 'SET_SORT_ORDER',
  ADD_CATEGORY: 'ADD_CATEGORY',
  UPDATE_CATEGORY: 'UPDATE_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
  ADD_TO_CATEGORY: 'ADD_TO_CATEGORY',
  REMOVE_FROM_CATEGORY: 'REMOVE_FROM_CATEGORY',
  LOAD_LIBRARY: 'LOAD_LIBRARY'
};

// Action creators
export const libraryActionCreators = {
  addCreature: (creature) => ({
    type: LIBRARY_ACTION_TYPES.ADD_CREATURE,
    payload: creature
  }),
  
  updateCreature: (id, updates) => ({
    type: LIBRARY_ACTION_TYPES.UPDATE_CREATURE,
    payload: { id, updates }
  }),
  
  deleteCreature: (id) => ({
    type: LIBRARY_ACTION_TYPES.DELETE_CREATURE,
    payload: id
  }),
  
  selectCreature: (id) => ({
    type: LIBRARY_ACTION_TYPES.SELECT_CREATURE,
    payload: id
  }),
  
  filterCreatures: (filters) => ({
    type: LIBRARY_ACTION_TYPES.FILTER_CREATURES,
    payload: filters
  }),
  
  clearFilters: () => ({
    type: LIBRARY_ACTION_TYPES.CLEAR_FILTERS
  }),
  
  setSortOrder: (field, direction) => ({
    type: LIBRARY_ACTION_TYPES.SET_SORT_ORDER,
    payload: { field, direction }
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
  
  addToCategory: (creatureId, categoryId) => ({
    type: LIBRARY_ACTION_TYPES.ADD_TO_CATEGORY,
    payload: { creatureId, categoryId }
  }),
  
  removeFromCategory: (creatureId, categoryId) => ({
    type: LIBRARY_ACTION_TYPES.REMOVE_FROM_CATEGORY,
    payload: { creatureId, categoryId }
  }),
  
  loadLibrary: (library) => ({
    type: LIBRARY_ACTION_TYPES.LOAD_LIBRARY,
    payload: library
  })
};

// Helper functions
const categorizeCreature = (creature) => {
  // Logic to automatically categorize creatures based on their properties
  const categories = [];
  
  // Add category based on type
  if (creature.type) {
    categories.push(`type-${creature.type}`);
  }
  
  // Add category based on size
  if (creature.size) {
    categories.push(`size-${creature.size}`);
  }
  
  return categories;
};

// Initial state
const initialState = {
  creatures: [],
  categories: [
    {
      id: 'all-creatures',
      name: 'All Creatures',
      isBaseCategory: true
    }
  ],
  filters: {
    query: '',
    types: [],
    sizes: [],
    minLevel: 0,
    maxLevel: 20
  },
  sortOrder: {
    field: 'name',
    direction: 'asc'
  },
  selectedCreature: null
};

// Create contexts
const CreatureLibraryStateContext = createContext();
const CreatureLibraryDispatchContext = createContext();

// Reducer function for state management
function creatureLibraryReducer(state, action) {
  switch (action.type) {
    case LIBRARY_ACTION_TYPES.ADD_CREATURE: {
      // Determine appropriate categories for the creature
      const creatureCategories = action.payload.categoryIds || categorizeCreature(action.payload);
      
      const newCreature = {
        ...action.payload,
        id: action.payload.id || generateUniqueId(),
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        categoryIds: creatureCategories
      };
      
      return {
        ...state,
        creatures: [...state.creatures, newCreature],
        selectedCreature: newCreature.id
      };
    }
    
    case LIBRARY_ACTION_TYPES.UPDATE_CREATURE: {
      const { id, updates } = action.payload;
      
      const updatedCreatures = state.creatures.map(creature =>
        creature.id === id
          ? {
              ...creature,
              ...updates,
              lastModified: new Date().toISOString()
            }
          : creature
      );
      
      return {
        ...state,
        creatures: updatedCreatures
      };
    }
    
    case LIBRARY_ACTION_TYPES.DELETE_CREATURE: {
      const updatedCreatures = state.creatures.filter(creature => creature.id !== action.payload);
      
      // If the deleted creature was selected, deselect it
      const selectedCreature = state.selectedCreature === action.payload
        ? null
        : state.selectedCreature;
      
      return {
        ...state,
        creatures: updatedCreatures,
        selectedCreature
      };
    }
    
    case LIBRARY_ACTION_TYPES.SELECT_CREATURE: {
      return {
        ...state,
        selectedCreature: action.payload
      };
    }
    
    case LIBRARY_ACTION_TYPES.FILTER_CREATURES: {
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
          types: [],
          sizes: [],
          minLevel: 0,
          maxLevel: 20
        }
      };
    }
    
    case LIBRARY_ACTION_TYPES.SET_SORT_ORDER: {
      return {
        ...state,
        sortOrder: {
          field: action.payload.field,
          direction: action.payload.direction
        }
      };
    }
    
    case LIBRARY_ACTION_TYPES.ADD_CATEGORY: {
      return {
        ...state,
        categories: [...state.categories, {
          ...action.payload,
          id: action.payload.id || generateUniqueId()
        }]
      };
    }
    
    case LIBRARY_ACTION_TYPES.UPDATE_CATEGORY: {
      const { id, updates } = action.payload;
      
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === id
            ? { ...category, ...updates }
            : category
        )
      };
    }
    
    case LIBRARY_ACTION_TYPES.DELETE_CATEGORY: {
      // Don't delete the base category
      if (action.payload === 'all-creatures') {
        return state;
      }
      
      // Remove the category from all creatures
      const updatedCreatures = state.creatures.map(creature => {
        if (creature.categoryIds && creature.categoryIds.includes(action.payload)) {
          return {
            ...creature,
            categoryIds: creature.categoryIds.filter(id => id !== action.payload)
          };
        }
        return creature;
      });
      
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload),
        creatures: updatedCreatures
      };
    }
    
    case LIBRARY_ACTION_TYPES.ADD_TO_CATEGORY: {
      const { creatureId, categoryId } = action.payload;
      
      return {
        ...state,
        creatures: state.creatures.map(creature => {
          if (creature.id === creatureId) {
            const categoryIds = creature.categoryIds || [];
            if (!categoryIds.includes(categoryId)) {
              return {
                ...creature,
                categoryIds: [...categoryIds, categoryId]
              };
            }
          }
          return creature;
        })
      };
    }
    
    case LIBRARY_ACTION_TYPES.REMOVE_FROM_CATEGORY: {
      const { creatureId, categoryId } = action.payload;
      
      // Don't remove from the base category
      if (categoryId === 'all-creatures') {
        return state;
      }
      
      return {
        ...state,
        creatures: state.creatures.map(creature => {
          if (creature.id === creatureId && creature.categoryIds) {
            return {
              ...creature,
              categoryIds: creature.categoryIds.filter(id => id !== categoryId)
            };
          }
          return creature;
        })
      };
    }
    
    case LIBRARY_ACTION_TYPES.LOAD_LIBRARY: {
      return {
        ...state,
        ...action.payload
      };
    }
    
    default:
      return state;
  }
}

// Provider component
function CreatureLibraryProvider({ children }) {
  const creatureStore = useCreatureStore();
  
  // Initialize state from creature store
  const [state, dispatch] = useReducer(
    creatureLibraryReducer,
    {
      ...initialState,
      creatures: creatureStore.creatures || LIBRARY_CREATURES,
      categories: creatureStore.categories || initialState.categories
    }
  );
  
  // Sync with creature store when state changes
  useEffect(() => {
    // Update creature store with the current state
    state.creatures.forEach(creature => {
      const existingCreature = creatureStore.creatures.find(c => c.id === creature.id);
      if (!existingCreature) {
        creatureStore.addCreature(creature);
      } else if (existingCreature.lastModified !== creature.lastModified) {
        creatureStore.updateCreature(creature.id, creature);
      }
    });
    
    // Handle deleted creatures
    creatureStore.creatures.forEach(creature => {
      if (!state.creatures.find(c => c.id === creature.id)) {
        creatureStore.deleteCreature(creature.id);
      }
    });
    
    // Update categories
    state.categories.forEach(category => {
      const existingCategory = creatureStore.categories.find(c => c.id === category.id);
      if (!existingCategory) {
        creatureStore.addCategory(category);
      } else if (JSON.stringify(existingCategory) !== JSON.stringify(category)) {
        creatureStore.updateCategory(category.id, category);
      }
    });
    
    // Handle deleted categories
    creatureStore.categories.forEach(category => {
      if (!state.categories.find(c => c.id === category.id)) {
        creatureStore.deleteCategory(category.id);
      }
    });
  }, [state, creatureStore]);
  
  return (
    <CreatureLibraryStateContext.Provider value={state}>
      <CreatureLibraryDispatchContext.Provider value={dispatch}>
        {children}
      </CreatureLibraryDispatchContext.Provider>
    </CreatureLibraryStateContext.Provider>
  );
}

// Hook for accessing state
function useCreatureLibrary() {
  const context = useContext(CreatureLibraryStateContext);
  if (context === undefined) {
    throw new Error('useCreatureLibrary must be used within a CreatureLibraryProvider');
  }
  return context;
}

// Hook for accessing dispatch
function useCreatureLibraryDispatch() {
  const context = useContext(CreatureLibraryDispatchContext);
  if (context === undefined) {
    throw new Error('useCreatureLibraryDispatch must be used within a CreatureLibraryProvider');
  }
  return context;
}

export { CreatureLibraryProvider, useCreatureLibrary, useCreatureLibraryDispatch, libraryActionCreators };
