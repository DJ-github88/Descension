import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

// Base category for all creatures
const BASE_CATEGORY = {
  id: 'all-creatures',
  name: 'All Creatures',
  isBaseCategory: true
};

// Default creature stats
const DEFAULT_STATS = {
  // Base attributes
  strength: 10,
  agility: 10,
  constitution: 10,
  intelligence: 10,
  spirit: 10,
  charisma: 10,

  // Derived stats
  maxHp: 100,
  currentHp: 100,
  maxMana: 50,
  currentMana: 50,
  maxActionPoints: 6,
  currentActionPoints: 6,
  armorClass: 15,
  initiative: 2,

  // Movement
  speed: 30,
  flying: 0,
  swimming: 15,

  // Vision
  sightRange: 60,
  darkvision: 0,

  // Combat stats
  criticalChance: 5,
  criticalMultiplier: 2,
};

// Creature size options
export const CREATURE_SIZES = {
  TINY: 'tiny',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  HUGE: 'huge',
  GARGANTUAN: 'gargantuan'
};

// Creature type options
export const CREATURE_TYPES = {
  ABERRATION: 'aberration',
  BEAST: 'beast',
  CELESTIAL: 'celestial',
  CONSTRUCT: 'construct',
  DRAGON: 'dragon',
  ELEMENTAL: 'elemental',
  FEY: 'fey',
  FIEND: 'fiend',
  GIANT: 'giant',
  HUMANOID: 'humanoid',
  MONSTROSITY: 'monstrosity',
  OOZE: 'ooze',
  PLANT: 'plant',
  UNDEAD: 'undead'
};

const useCreatureStore = create(
  persist(
    (set, get) => ({
      // Creature Library state
      creatures: [],
      categories: [BASE_CATEGORY],
      creatureCategories: {}, // {creatureId: Set(categoryIds)}
      selectedCreature: null,
      selectedCategory: BASE_CATEGORY.id,

      // Filters
      filters: {
        query: '',
        types: [],
        sizes: [],
        minLevel: 0,
        maxLevel: 20
      },

      // Sort order
      sortOrder: {
        field: 'name',
        direction: 'asc'
      },

      // Grid tokens
      tokens: [], // [{creatureId, position: {x, y}, state: {...}}]

      // Actions

      // Category actions
      addCategory: (category) => set(state => {
        const newCategory = {
          id: category.id || uuidv4(),
          name: category.name || 'New Category',
          description: category.description || '',
          parentId: category.parentId || null,
          isBaseCategory: false
        };

        return {
          categories: [...state.categories, newCategory]
        };
      }),

      updateCategory: (id, updates) => set(state => ({
        categories: state.categories.map(category =>
          category.id === id ? { ...category, ...updates } : category
        )
      })),

      deleteCategory: (id) => set(state => {
        // Don't delete the base category
        if (id === BASE_CATEGORY.id) return state;

        // Remove the category from all creatures
        const updatedCreatureCategories = { ...state.creatureCategories };
        Object.keys(updatedCreatureCategories).forEach(creatureId => {
          const categories = updatedCreatureCategories[creatureId];
          if (categories.includes(id)) {
            updatedCreatureCategories[creatureId] = categories.filter(catId => catId !== id);
          }
        });

        return {
          categories: state.categories.filter(category => category.id !== id),
          creatureCategories: updatedCreatureCategories,
          selectedCategory: state.selectedCategory === id ? BASE_CATEGORY.id : state.selectedCategory
        };
      }),

      // Creature actions
      addCreature: (creature, categories = null) => set(state => {
        const newCreature = {
          id: creature.id || uuidv4(),
          name: creature.name || 'Unnamed Creature',
          description: creature.description || '',
          type: creature.type || CREATURE_TYPES.HUMANOID,
          size: creature.size || CREATURE_SIZES.MEDIUM,
          tags: creature.tags || [],
          tokenIcon: creature.tokenIcon || 'inv_misc_questionmark',
          tokenBorder: creature.tokenBorder || '#ffffff',
          stats: { ...DEFAULT_STATS, ...creature.stats },
          resistances: creature.resistances || {},
          vulnerabilities: creature.vulnerabilities || {},
          abilities: creature.abilities || [],
          lootTable: creature.lootTable || {
            currency: { gold: { min: 0, max: 0 }, silver: { min: 0, max: 0 }, copper: { min: 0, max: 0 } },
            items: []
          },
          dateCreated: new Date().toISOString(),
          lastModified: new Date().toISOString()
        };

        // Always ensure BASE_CATEGORY.id is included
        const categorySet = new Set([BASE_CATEGORY.id]);

        // Add additional categories if provided
        if (Array.isArray(categories)) {
          categories.forEach(catId => {
            if (catId) {
              categorySet.add(catId);
            }
          });
        } else if (categories) {
          categorySet.add(categories);
        }

        // Create new creatureCategories state with the updated categories
        const newCreatureCategories = {
          ...state.creatureCategories,
          [newCreature.id]: Array.from(categorySet)
        };

        return {
          creatures: [...state.creatures, newCreature],
          creatureCategories: newCreatureCategories,
          selectedCreature: newCreature.id
        };
      }),

      updateCreature: (id, updates) => set(state => ({
        creatures: state.creatures.map(creature =>
          creature.id === id
            ? {
                ...creature,
                ...updates,
                lastModified: new Date().toISOString()
              }
            : creature
        )
      })),

      deleteCreature: (id) => set(state => ({
        creatures: state.creatures.filter(creature => creature.id !== id),
        creatureCategories: Object.fromEntries(
          Object.entries(state.creatureCategories).filter(([creatureId]) => creatureId !== id)
        ),
        selectedCreature: state.selectedCreature === id ? null : state.selectedCreature,
        tokens: state.tokens.filter(token => token.creatureId !== id)
      })),

      // Selection actions
      selectCreature: (id) => set({ selectedCreature: id }),
      selectCategory: (id) => set({ selectedCategory: id }),

      // Filter actions
      setFilter: (filter, value) => set(state => ({
        filters: { ...state.filters, [filter]: value }
      })),

      clearFilters: () => set({
        filters: {
          query: '',
          types: [],
          sizes: [],
          minLevel: 0,
          maxLevel: 20
        }
      }),

      // Sort actions
      setSortOrder: (field, direction) => set({
        sortOrder: { field, direction }
      }),

      // Token actions
      addToken: (creatureId, position) => set(state => {
        console.log('addToken called with creatureId:', creatureId, 'position:', position);
        console.log('Current creatures in store:', state.creatures);

        // Try to find the creature by ID
        let creature = state.creatures.find(c => c.id === creatureId);

        // If not found, try to find by string comparison (in case the ID is a string)
        if (!creature && typeof creatureId === 'string') {
          creature = state.creatures.find(c => c.id.toString() === creatureId);
        }

        console.log('Found creature for token:', creature);

        if (!creature) {
          console.error('Failed to add token: Creature not found with ID:', creatureId);

          // If we still can't find the creature, add a default one for debugging
          if (state.creatures.length > 0) {
            console.log('Using first available creature as fallback');
            creature = state.creatures[0];
          } else {
            return state;
          }
        }

        // Check if a token for this creature already exists
        const existingToken = state.tokens.find(t => t.creatureId === creature.id);
        if (existingToken) {
          console.log('Token already exists for this creature, updating position');
          return {
            tokens: state.tokens.map(t =>
              t.creatureId === creature.id
                ? { ...t, position }
                : t
            )
          };
        }

        // Create a new token
        const newToken = {
          id: uuidv4(),
          creatureId: creature.id,
          position,
          state: {
            currentHp: creature.stats?.maxHp || 10,
            currentMana: creature.stats?.maxMana || 0,
            currentActionPoints: creature.stats?.maxActionPoints || 2,
            effects: []
          }
        };

        console.log('Created new token:', newToken);
        console.log('Current tokens before adding:', state.tokens);

        const newState = {
          tokens: [
            ...state.tokens,
            newToken
          ]
        };

        console.log('New tokens array after adding:', newState.tokens);
        return newState;
      }),

      updateToken: (tokenId, updates) => set(state => ({
        tokens: state.tokens.map(token =>
          token.id === tokenId ? { ...token, ...updates } : token
        )
      })),

      updateTokenPosition: (tokenId, position) => set(state => ({
        tokens: state.tokens.map(token =>
          token.id === tokenId ? { ...token, position } : token
        )
      })),

      updateTokenState: (tokenId, stateUpdates) => set(state => ({
        tokens: state.tokens.map(token =>
          token.id === tokenId
            ? {
                ...token,
                state: { ...token.state, ...stateUpdates }
              }
            : token
        )
      })),

      removeToken: (tokenId) => set(state => ({
        tokens: state.tokens.filter(token => token.id !== tokenId)
      }))
    }),
    {
      name: 'creature-store',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
);

// Initialize the store with sample creatures if needed
const initializeStore = () => {
  const state = useCreatureStore.getState();

  // Only initialize if the store is empty
  if (state.creatures.length === 0) {
    console.log('Initializing creature store with sample creatures');

    // Import sample creatures from data file
    const { LIBRARY_CREATURES } = require('../data/creatureLibraryData');

    // Add each creature to the store
    LIBRARY_CREATURES.forEach(creature => {
      state.addCreature(creature);
    });

    console.log('Creature store initialized with sample creatures:', state.creatures);
  }
};

// Run initialization
initializeStore();

export default useCreatureStore;
