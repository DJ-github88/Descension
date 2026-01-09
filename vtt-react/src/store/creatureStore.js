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
  [CREATURE_SIZES.HUGE]: { width: 3, height: 3, scale: 1.0 },     // 3x3 grid squares
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

// CRITICAL FIX: Track recent token movements to prevent server echo-induced position resets
// This prevents the token from jumping back to old positions when the server broadcasts
// the position back to all players (including the original sender)
const recentTokenMovements = new Map();

// Use creature store
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
      windowPosition: null, // Will be set when user moves to window
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
        // Don't delete base category
        if (id === BASE_CATEGORY.id) {
          return state;
        }

        // Remove category from all creatures
        const updatedCreatureCategories = {};
        Object.entries(state.creatureCategories).forEach(([creatureId]) => {
          updatedCreatureCategories[creatureId] = state.creatureCategories[creatureId].filter(catId => catId !== id);
        });

        return {
          categories: state.categories.filter(category => category.id !== id),
          creatureCategories: updatedCreatureCategories,
          selectedCategory: state.selectedCategory === id ? BASE_CATEGORY.id : state.selectedCategory
        };
      }),

      // Creature actions
      setCreatures: (creatures) => set({ creatures }),

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
          customTokenImage: creature.customTokenImage || null,
          imageTransformations: creature.imageTransformations || null,
          stats: { ...DEFAULT_STATS, ...creature.stats },
          resistances: creature.resistances || {},
          vulnerabilities: creature.vulnerabilities || {},
          abilities: creature.abilities || [],
          lootTable: creature.lootTable || {
            currency: { gold: { min: 0, max: 0 }, silver: { min: 0, max: 0 }, copper: { min: 0, max: 0 } },
            items: []
          },
          isShopkeeper: creature.isShopkeeper || false,
          shopInventory: creature.shopInventory || {
            items: [], // Array of { itemId, customPrice: { gold: 0, silver: 0, copper: 0 }, quantity: 1 }
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

        // Create new creatureCategories state with updated categories
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
            ? { ...creature, ...updates, lastModified: new Date().toISOString() }
            : creature
        )
      })),

      deleteCreature: (id) => set(state => ({
        creatures: state.creatures.filter(creature => creature.id !== id)
      })),

      // Token actions
      clearTokens: () => {
        set({ tokens: [] });
      },

      // Special method for loading tokens from saved state (bypasses existing token checks)
      loadToken: (tokenData) => set(state => {

        // Try multiple approaches to find the creature
        let creature = null;

        // 1. Direct ID match
        creature = state.creatures.find(c => c.id === tokenData.creatureId);

        // 2. String comparison (in case of creature ID being a string)
        if (!creature && typeof tokenData.creatureId === 'string') {
          creature = state.creatures.find(c => c.id.toString() === tokenData.creatureId);
        }

        // 3. Trim whitespace and try again (in case of whitespace issues)
        if (!creature && typeof tokenData.creatureId === 'string') {
          const trimmedId = tokenData.creatureId.trim();
          creature = state.creatures.find(c => c.id.toString() === trimmedId || c.id === trimmedId);
        }

        // 4. Case-insensitive search (in case of case differences)
        if (!creature && typeof tokenData.creatureId === 'string') {
          creature = state.creatures.find(c =>
            c.id.toString().toLowerCase() === tokenData.creatureId.toLowerCase()
          );
        }

        if (!creature) {
          console.error('❌ Failed to add token: Creature not found with ID:', tokenData.creatureId);
          console.error('🔍 Searched in creatures:', state.creatures.map(c => ({ id: c.id, name: c.name })));
          console.error('❌ REFUSING TO USE FALLBACK - This would create wrong tokens');
          return state; // Don't use fallback, just return unchanged state
        }

        // CRITICAL FIX: Use provided tokenId if we're syncing with server
        // Otherwise use the creature's ID or generate a new one
        const targetTokenId = tokenData.tokenId || creature.id;

        // If we're syncing an existing token, check if it already exists
        const existingByTokenId = state.tokens.find(t => t.id === targetTokenId);
        if (existingByTokenId) {
          // If it exists, just return state as is or update position if needed
          return state;
        }

        // Create a new token with provided data
        const newToken = {
          id: targetTokenId,
          creatureId: creature.id,
          position: tokenData.position,
          state: tokenData.state || {
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

        // Send to multiplayer server if enabled (only if we're syncing, not creating from local)
        if (tokenData.sendToServer !== false) {
          // Import game store dynamically to avoid circular dependencies
          import('./gameStore').then(({ default: useGameStore }) => {
            const gameStore = useGameStore.getState();
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
              gameStore.multiplayerSocket.emit('token_created', {
                creature: creature,
                token: newToken,
                position: tokenData.position
              });
            }
          }).catch(error => {
            console.error('Failed to import gameStore for token sync:', error);
          });
        }

        return newState;
      }),

      updateTokenPosition: (tokenId, position) => set(state => {
        // CRITICAL FIX: Ignore stale server echoes to prevent position jumps
        // Check if we recently moved this token (within last 100ms)
        const recentMoveKey = `token_${tokenId}`;
        const now = Date.now();

        if (!global.recentTokenMovements) {
          global.recentTokenMovements = new Map();
        }
        const recentMove = global.recentTokenMovements.get(recentMoveKey);

        if (recentMove && (now - recentMove.timestamp) < 100) {
          console.log(`🚫 Ignoring stale token position update for ${tokenId} (${now - recentMove.timestamp}ms old)`);
          return;
        }

        // Track this movement to prevent future echoes
        global.recentTokenMovements.set(recentMoveKey, {
          tokenId,
          position,
          timestamp: now
        });

        const updatedTokens = state.tokens.map(token =>
          token.id === tokenId
            ? { ...token, position }
            : token
        );

        // CRITICAL FIX: Only send to server if position actually changed
        // This prevents unnecessary network traffic during rapid updates
        const existingToken = state.tokens.find(t => t.id === tokenId);
        const hasPositionChanged = !existingToken ||
          Math.abs(existingToken.position.x - position.x) > 0.1 ||
          Math.abs(existingToken.position.y - position.y) > 0.1;

        if (hasPositionChanged) {
          // Import game store dynamically
          import('./gameStore').then(({ default: useGameStore }) => {
            const gameStore = useGameStore.getState();
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
              gameStore.multiplayerSocket.emit('token_moved', {
                tokenId: tokenId,
                position: position,
                isDragging: false // Mark as final position
              });
            }
          }).catch(error => {
            console.error('Failed to import gameStore for token position update:', error);
          });
        }

        console.log(`🔷 Token ${tokenId} moved to`, position);
        return { tokens: updatedTokens };
      }),

      updateTokenState: (tokenId, stateUpdates, sendToServer = true) => set(state => {
        const updatedTokens = state.tokens.map(token =>
          token.id === tokenId
            ? {
              ...token,
              state: {
                ...token.state,
                ...stateUpdates,
                lastModified: new Date().toISOString()
              }
            }
            : token
        );

        // Send state updates to server if requested
        if (sendToServer) {
          // Import game store dynamically
          import('./gameStore').then(({ default: useGameStore }) => {
            const gameStore = useGameStore.getState();
            if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
              gameStore.multiplayerSocket.emit('token_updated', {
                tokenId: tokenId,
                stateUpdates: stateUpdates
              });
            }
          }).catch(error => {
            console.error('Failed to import gameStore for token state update:', error);
          });
        }

        return { tokens: updatedTokens };
      }),

      removeToken: (tokenId) => set(state => ({
        tokens: state.tokens.filter(token => token.id !== tokenId)
      })),

      duplicateToken: (tokenId) => set(state => {
        // Find the token to duplicate
        const tokenToDuplicate = state.tokens.find(t => t.id === tokenId);

        if (!tokenToDuplicate) {
          console.error('Failed to duplicate token: Token not found with ID:', tokenId);
          return state;
        }

        // Create a new token with same properties but a new ID
        const newToken = {
          id: uuidv4(),
          creatureId: tokenToDuplicate.creatureId,
          position: {
            // Offset position slightly to make it clear it's a new token
            x: tokenToDuplicate.position.x + 20,
            y: tokenToDuplicate.position.y + 20
          },
          state: tokenToDuplicate.state
        };

        const newState = {
          tokens: [...state.tokens, newToken]
        };

        return newState;
      }),

      // Clean up expired conditions from all tokens
      cleanupExpiredConditions: () => set(state => {
        const currentTime = Date.now();
        let hasChanges = false;

        const updatedTokens = state.tokens.map(token => {
          if (!token.state?.conditions || token.state.conditions.length === 0) {
            return token;
          }

          const validConditions = token.state.conditions.filter(condition => {
            // If no duration info, keep as permanent condition
            if (!condition.duration && !condition.durationType) {
              return true;
            }

            // Round-based conditions are handled by combat store when turns end
            if (condition.durationType === 'rounds') {
              // Check if remainingRounds exists and is > 0
              const remainingRounds = condition.remainingRounds ?? condition.durationValue;
              return remainingRounds > 0;
            }

            // Time-based conditions: check if appliedAt + duration has passed
            if (condition.appliedAt && condition.duration) {
              const endTime = condition.appliedAt + condition.duration;
              return endTime > currentTime;
            }

            // If we can't determine expiration, keep it
            return true;
          });

          // Check if any condition changed
          if (validConditions.length !== token.state.conditions.length) {
            hasChanges = true;
            return {
              ...token,
              state: {
                ...token.state,
                conditions: validConditions
              }
            };
          }

          return token;
        });

        if (hasChanges) {
          return { tokens: updatedTokens };
        }

        return state;
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

// Note: Initialization is now handled by initCreatureStore.js to avoid duplicates
// This prevents race conditions and multiple initialization calls

// Expose store for debugging (if needed)
if (typeof window !== 'undefined') {
  window.creatureStore = useCreatureStore;
}

export default useCreatureStore;