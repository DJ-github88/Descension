import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { processCreatureLoot, processCreaturesLoot } from '../utils/lootItemUtils';
import { createStorageConfig } from '../utils/storageUtils';

// Creature types and sizes
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

export const CREATURE_SIZES = {
  TINY: 'tiny',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  HUGE: 'huge',
  GARGANTUAN: 'gargantuan'
};

// Size to grid mapping for token sizing
export const CREATURE_SIZE_GRID_MAPPING = {
  [CREATURE_SIZES.TINY]: { width: 1, height: 1, scale: 0.5 },      // Half size of a grid square
  [CREATURE_SIZES.SMALL]: { width: 1, height: 1, scale: 0.8 },     // 80% of a grid square
  [CREATURE_SIZES.MEDIUM]: { width: 1, height: 1, scale: 1.0 },    // Full grid square (default)
  [CREATURE_SIZES.LARGE]: { width: 2, height: 2, scale: 1.0 },     // 2x2 grid squares
  [CREATURE_SIZES.HUGE]: { width: 3, height: 3, scale: 1.0 },      // 3x3 grid squares
  [CREATURE_SIZES.GARGANTUAN]: { width: 4, height: 4, scale: 1.0 } // 4x4 grid squares
};

// Helper function to get creature size mapping
export const getCreatureSizeMapping = (size) => {
  return CREATURE_SIZE_GRID_MAPPING[size] || CREATURE_SIZE_GRID_MAPPING[CREATURE_SIZES.MEDIUM];
};

// Base category for all creatures
const BASE_CATEGORY = {
  id: 'all-creatures',
  name: 'All Creatures',
  isBaseCategory: true
};

// Default creature stats - comprehensive like character stats
const DEFAULT_STATS = {
  // Base attributes
  strength: 10,
  agility: 10,
  constitution: 10,
  intelligence: 10,
  spirit: 10,
  charisma: 10,

  // Core resources
  maxHp: 100,
  currentHp: 100,
  maxMana: 50,
  currentMana: 50,
  maxActionPoints: 6,
  currentActionPoints: 6,

  // Combat stats
  armorClass: 15,
  initiative: 2,
  proficiencyBonus: 2,

  // Power stats
  meleePower: 0,
  rangedPower: 0,
  spellPower: 0,
  healingPower: 0,

  // Secondary stats
  criticalStrike: 0,
  haste: 0,
  mastery: 0,
  versatility: 0,

  // Movement & senses
  speed: 30,
  flying: 0,
  swimming: 15,
  sightRange: 60,
  darkvision: 0,

  // Spell schools (optional)
  fireSpellPower: 0,
  frostSpellPower: 0,
  arcaneSpellPower: 0,
  natureSpellPower: 0,
  shadowSpellPower: 0,
  holySpellPower: 0,

  // Defensive stats (optional)
  dodge: 0,
  parry: 0,
  block: 0,
  magicResistance: 0,

  // Utility stats (optional)
  carryingCapacity: 0,
  exhaustionLevel: 0,

  // Saving throws (optional - only include if proficient)
  savingThrows: {},

  // Skills (optional - only include if trained)
  skills: {}
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

      // Window position persistence for external preview
      windowPosition: null, // Will be set when user moves the window
      windowSize: { width: 1200, height: 800 }, // Default size

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
        if (id === BASE_CATEGORY.id) {
          return state;
        }

        // Remove the category from all creatures
        const updatedCreatureCategories = {};
        Object.entries(state.creatureCategories).forEach(([creatureId, categoryIds]) => {
          updatedCreatureCategories[creatureId] = categoryIds.filter(catId => catId !== id);
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
          // Shopkeeper properties
          isShopkeeper: creature.isShopkeeper || false,
          shopInventory: creature.shopInventory || {
            items: [], // Array of { itemId, customPrice: { gold: 0, silver: 0, copper: 0 }, quantity: 1 }
            restockOnLongRest: creature.shopInventory?.restockOnLongRest || false,
            shopName: creature.shopInventory?.shopName || '',
            shopDescription: creature.shopInventory?.shopDescription || '',
            buyRates: creature.shopInventory?.buyRates || {
              default: 30,
              categories: {
                weapon: 50,
                armor: 50,
                consumable: 50,
                accessory: 45,
                container: 40,
                miscellaneous: 35
              }
            }
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

      // Token actions
      addToken: (creatureId, position, sendToServer = true, tokenId = null) => set(state => {
        console.log('🔍 addToken called with creatureId:', creatureId, 'tokenId:', tokenId, 'type:', typeof creatureId);
        console.log('📋 Available creatures in store:', state.creatures.map(c => ({ id: c.id, name: c.name, idType: typeof c.id })));

        // Try multiple approaches to find the creature
        let creature = null;

        // 1. Direct ID match
        creature = state.creatures.find(c => c.id === creatureId);
        console.log('🎯 Direct ID match result:', creature ? `Found: ${creature.name}` : 'Not found');

        // 2. String comparison (in case the ID is a string)
        if (!creature && typeof creatureId === 'string') {
          creature = state.creatures.find(c => c.id.toString() === creatureId);
          console.log('🔄 String comparison result:', creature ? `Found: ${creature.name}` : 'Not found');
        }

        // 3. Trim whitespace and try again (in case of whitespace issues)
        if (!creature && typeof creatureId === 'string') {
          const trimmedId = creatureId.trim();
          creature = state.creatures.find(c => c.id === trimmedId || c.id.toString() === trimmedId);
          console.log('✂️ Trimmed ID match result:', creature ? `Found: ${creature.name}` : 'Not found');
        }

        // 4. Case-insensitive search (in case of case differences)
        if (!creature && typeof creatureId === 'string') {
          creature = state.creatures.find(c =>
            c.id.toString().toLowerCase() === creatureId.toLowerCase()
          );
          console.log('🔤 Case-insensitive match result:', creature ? `Found: ${creature.name}` : 'Not found');
        }

        if (!creature) {
          console.error('❌ Failed to add token: Creature not found with ID:', creatureId);
          console.error('🔍 Searched in creatures:', state.creatures.map(c => ({ id: c.id, name: c.name })));
          console.error('❌ REFUSING TO USE FALLBACK - This would create wrong tokens');
          return state; // Don't use fallback, just return unchanged state
        } else {
          console.log('✅ Successfully found creature:', creature.name);
        }

        // CRITICAL FIX: Don't move existing tokens when addToken is called
        // Check if a token for this creature already exists
        const existingToken = state.tokens.find(t => t.creatureId === creature.id);
        if (existingToken) {
          console.log('🚫 Token already exists for creature:', creature.name, '- NOT moving existing token');
          console.log('🚫 Existing token position:', existingToken.position, 'Requested position:', position);
          // Return the state unchanged - do NOT move existing tokens
          return state;
        }

        // Create a new token with provided ID or generate new one
        const newToken = {
          id: tokenId || uuidv4(),
          creatureId: creature.id,
          position,
          state: {
            currentHp: creature.stats?.maxHp || 10,
            currentMana: creature.stats?.maxMana || 0,
            currentActionPoints: creature.stats?.maxActionPoints || 2,
            conditions: [],
            notes: ''
          }
        };

        const newState = {
          tokens: [
            ...state.tokens,
            newToken
          ]
        };

        // Send to multiplayer server if enabled
        if (sendToServer) {
          // Import game store dynamically to avoid circular dependencies
          import('./gameStore').then(({ default: useGameStore }) => {
            const gameStore = useGameStore.getState();
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
              console.log('🎭 Sending token creation to multiplayer server:', creature.name);
              gameStore.multiplayerSocket.emit('token_created', {
                creature: creature,
                token: newToken,
                position: position
              });
            }
          }).catch(error => {
            console.error('Failed to import gameStore for token sync:', error);
          });
        }

        return newState;
      }),

      updateTokenPosition: (tokenId, position) => set(state => ({
        tokens: state.tokens.map(token =>
          token.id === tokenId
            ? { ...token, position }
            : token
        )
      })),

      updateTokenState: (tokenId, stateUpdates) => set(state => {
        const updatedTokens = state.tokens.map(token => {
          if (token.id === tokenId) {
            const oldState = token.state;
            const newState = { ...token.state, ...stateUpdates };



            return {
              ...token,
              state: newState
            };
          }
          return token;
        });

        return { tokens: updatedTokens };
      }),

      removeToken: (tokenId) => set(state => ({
        tokens: state.tokens.filter(token => token.id !== tokenId)
      })),

      duplicateToken: (tokenId) => set(state => {
        // Find the token to duplicate
        const tokenToDuplicate = state.tokens.find(token => token.id === tokenId);

        if (!tokenToDuplicate) {
          console.error('Failed to duplicate token: Token not found with ID:', tokenId);
          return state;
        }

        // Create a new token with the same properties but a new ID
        const newToken = {
          id: uuidv4(),
          creatureId: tokenToDuplicate.creatureId,
          position: {
            // Offset the position slightly to make it clear it's a new token
            x: tokenToDuplicate.position.x + 20,
            y: tokenToDuplicate.position.y + 20
          },
          state: {
            ...tokenToDuplicate.state
          }
        };



        return {
          tokens: [
            ...state.tokens,
            newToken
          ]
        };
      }),

      // Get a creature with processed loot items
      getCreature: (id) => {
        const creature = get().creatures.find(c => c.id === id);
        if (!creature) return null;
        // Import item store dynamically to avoid circular dependencies
        const useItemStore = require('../store/itemStore').default;
        const itemStore = useItemStore.getState();
        return processCreatureLoot(creature, itemStore);
      },

      // Get all creatures with processed loot items
      getAllCreatures: () => {
        // Import item store dynamically to avoid circular dependencies
        const useItemStore = require('../store/itemStore').default;
        const itemStore = useItemStore.getState();
        return processCreaturesLoot(get().creatures, itemStore);
      },

      // Window position management for external preview
      setWindowPosition: (position) => {
        set({ windowPosition: position });
      },

      setWindowSize: (size) => {
        set({ windowSize: size });
      }
    }),
    createStorageConfig('creature-store')
  )
);

// Initialize the store with sample creatures if needed
const initializeStore = async () => {
  const state = useCreatureStore.getState();

  try {
    // Import sample creatures from data file using dynamic import
    const creatureData = await import('../data/creatureLibraryData');
    const LIBRARY_CREATURES = creatureData.LIBRARY_CREATURES;

    // Only add library creatures that don't already exist
    // This preserves custom creatures while ensuring library creatures are available
    LIBRARY_CREATURES.forEach(creature => {
      const existingCreature = state.creatures.find(c => c.id === creature.id);
      if (!existingCreature) {
        state.addCreature(creature);
      }
    });
  } catch (error) {
    console.error('Error loading creature library data:', error);
  }
};

// Run initialization
initializeStore();

// Expose store for debugging
if (typeof window !== 'undefined') {
  window.creatureStore = useCreatureStore;
}

export default useCreatureStore;
