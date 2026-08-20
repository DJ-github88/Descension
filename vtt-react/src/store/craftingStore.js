import { getStore } from './storeRegistry';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createStorageConfig } from '../utils/storageUtils';
import { ALL_RECIPES } from '../data/recipes/index.js';

// Pathfinder-style skill levels (10 levels) with experience requirements
export const SKILL_LEVELS = {
  UNTRAINED: { name: 'Untrained', level: 0, bonus: 0, experienceRequired: 0 },
  NOVICE: { name: 'Novice', level: 1, bonus: 1, experienceRequired: 50 },
  APPRENTICE: { name: 'Apprentice', level: 2, bonus: 2, experienceRequired: 125 },
  JOURNEYMAN: { name: 'Journeyman', level: 3, bonus: 3, experienceRequired: 225 },
  EXPERT: { name: 'Expert', level: 4, bonus: 4, experienceRequired: 350 },
  ADEPT: { name: 'Adept', level: 5, bonus: 5, experienceRequired: 500 },
  MASTER: { name: 'Master', level: 6, bonus: 6, experienceRequired: 675 },
  GRANDMASTER: { name: 'Grandmaster', level: 7, bonus: 7, experienceRequired: 875 },
  LEGENDARY: { name: 'Legendary', level: 8, bonus: 8, experienceRequired: 1100 },
  MYTHIC: { name: 'Mythic', level: 9, bonus: 9, experienceRequired: 1350 }
};

// Crafting professions
export const PROFESSIONS = {
  ALCHEMY: {
    id: 'alchemy',
    name: 'Alchemy',
    description: 'The art of brewing potions, elixirs, and magical concoctions',
    icon: 'professions/alchemy.png',
    implemented: true
  },
  BLACKSMITHING: {
    id: 'blacksmithing',
    name: 'Blacksmithing',
    description: 'The art of forging weapons and armor from metal',
    icon: 'professions/blacksmithing.png',
    implemented: true
  },
  FIRST_AID: {
    id: 'first-aid',
    name: 'First Aid',
    description: 'The skill of treating wounds and creating medical supplies',
    icon: 'professions/first-aid.png',
    implemented: true
  }
};

// Initial state
const initialState = {
  // Player's profession levels
  professionLevels: Object.values(PROFESSIONS).reduce((acc, profession) => {
    acc[profession.id] = SKILL_LEVELS.UNTRAINED.level;
    return acc;
  }, {}),

  // Player's profession experience points
  professionExperience: Object.values(PROFESSIONS).reduce((acc, profession) => {
    acc[profession.id] = 0; // Start with 0 experience
    return acc;
  }, {}),
  
  // Known recipes by profession
  knownRecipes: Object.values(PROFESSIONS).reduce((acc, profession) => {
    // Give players the basic recipe to start
    if (profession.id === 'alchemy') {
      acc[profession.id] = ['minor-healing-potion-recipe'];
    } else if (profession.id === 'first-aid') {
      acc[profession.id] = ['basic-bandage-recipe'];
    } else {
      acc[profession.id] = [];
    }
    return acc;
  }, {}),
  
  // All available recipes (for GM to manage)
  // Import recipes from data files and combine with default recipes
  availableRecipes: [
    ...ALL_RECIPES,
    // First Aid Recipes — not in data/recipes/, kept here.
    // Material IDs updated to match the canonical item library.
    {
      id: 'basic-bandage-recipe',
      name: 'Basic Bandage',
      profession: 'first-aid',
      description: 'A simple cloth bandage used to stop bleeding and provide basic wound care.',
      requiredLevel: 0,
      resultItemId: 'basic-bandage',
      resultIcon: 'inv_misc_bandage_01',
      resultQuantity: 1,
      materials: [
        { itemId: 'linen-fiber', quantity: 1 }
      ],
      craftingTime: 2000,
      experienceGained: 1,
      craftingTimeDisplay: '2 sec',
      category: 'bandage'
    },
    {
      id: 'heavy-bandage-recipe',
      name: 'Heavy Bandage',
      profession: 'first-aid',
      description: 'A thick, absorbent bandage that provides better wound care and stops bleeding more effectively.',
      requiredLevel: 1,
      resultItemId: 'heavy-bandage',
      resultIcon: 'inv_misc_bandage_02',
      resultQuantity: 1,
      materials: [
        { itemId: 'linen-fiber', quantity: 2 },
        { itemId: 'ashflower', quantity: 1 }
      ],
      craftingTime: 3000,
      experienceGained: 2,
      craftingTimeDisplay: '3 sec',
      category: 'bandage'
    },
    {
      id: 'antiseptic-salve-recipe',
      name: 'Antiseptic Salve',
      profession: 'first-aid',
      description: 'A medicinal salve that prevents infection and promotes healing.',
      requiredLevel: 2,
      resultItemId: 'antiseptic-salve',
      resultIcon: 'inv_misc_slime_01',
      resultQuantity: 1,
      materials: [
        { itemId: 'ashflower', quantity: 2 },
        { itemId: 'bitterroot', quantity: 1 },
        { itemId: 'glass-vial', quantity: 1 }
      ],
      craftingTime: 5000,
      experienceGained: 3,
      craftingTimeDisplay: '5 sec',
      category: 'salve'
    },
    {
      id: 'healing-kit-recipe',
      name: 'Healing Kit',
      profession: 'first-aid',
      description: 'A complete medical kit containing bandages, salves, and basic medical tools.',
      requiredLevel: 2,
      resultItemId: 'first-aid-kit',
      resultIcon: 'inv_misc_bag_10',
      resultQuantity: 1,
      materials: [
        { itemId: 'linen-fiber', quantity: 3 },
        { itemId: 'ashflower', quantity: 2 },
        { itemId: 'waxed-thread', quantity: 1 }
      ],
      craftingTime: 7000,
      experienceGained: 4,
      craftingTimeDisplay: '7 sec',
      category: 'kit'
    },
    {
      id: 'poultice-recipe',
      name: 'Herbal Poultice',
      profession: 'first-aid',
      description: 'A warm herbal poultice that soothes pain and accelerates natural healing.',
      requiredLevel: 3,
      resultItemId: 'herbal-poultice',
      resultIcon: 'inv_misc_herb_07',
      resultQuantity: 1,
      materials: [
        { itemId: 'ashflower', quantity: 3 },
        { itemId: 'bitterroot', quantity: 2 },
        { itemId: 'linen-fiber', quantity: 1 }
      ],
      craftingTime: 6000,
      experienceGained: 5,
      craftingTimeDisplay: '6 sec',
      category: 'poultice'
    },
    {
      id: 'splint-recipe',
      name: 'Medical Splint',
      profession: 'first-aid',
      description: 'A sturdy splint used to immobilize broken or fractured bones.',
      requiredLevel: 3,
      resultItemId: 'medical-splint',
      resultIcon: 'inv_misc_bone_01',
      resultQuantity: 1,
      materials: [
        { itemId: 'wooden-haft', quantity: 2 },
        { itemId: 'linen-fiber', quantity: 2 },
        { itemId: 'leather-straps', quantity: 1 }
      ],
      craftingTime: 8000,
      experienceGained: 5,
      craftingTimeDisplay: '8 sec',
      category: 'splint'
    },
    {
      id: 'advanced-healing-kit-recipe',
      name: 'Advanced Healing Kit',
      profession: 'first-aid',
      description: 'An advanced medical kit with specialized tools and high-quality supplies for treating serious injuries.',
      requiredLevel: 4,
      resultItemId: 'advanced-healing-kit',
      resultIcon: 'inv_misc_bag_11',
      resultQuantity: 1,
      materials: [
        { itemId: 'linen-fiber', quantity: 5 },
        { itemId: 'ashflower', quantity: 3 },
        { itemId: 'waxed-thread', quantity: 2 },
        { itemId: 'first-aid-kit', quantity: 1 }
      ],
      craftingTime: 10000,
      experienceGained: 7,
      craftingTimeDisplay: '10 sec',
      category: 'kit'
    }
  ],
  
  // Currently selected profession
  selectedProfession: null,
  
  // Crafting queue/in-progress items
  craftingQueue: []
};

// Create the crafting store
const useCraftingStore = create(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Set the selected profession
      setSelectedProfession: (professionId) => {
        set({ selectedProfession: professionId });
      },
      
      // Get profession level
      getProfessionLevel: (professionId) => {
        const { professionLevels } = get();
        return professionLevels[professionId] || SKILL_LEVELS.UNTRAINED.level;
      },

      // Get profession experience
      getProfessionExperience: (professionId) => {
        const { professionExperience } = get();
        return professionExperience[professionId] || 0;
      },

      // Get experience required for next level
      getExperienceForNextLevel: (professionId) => {
        const currentLevel = get().getProfessionLevel(professionId);
        if (currentLevel >= 9) return null; // Max level reached

        const nextLevel = currentLevel + 1;
        const skillLevel = Object.values(SKILL_LEVELS).find(level => level.level === nextLevel);
        return skillLevel ? skillLevel.experienceRequired : null;
      },

      // Gain experience and potentially level up
      gainExperience: (professionId, experienceGained) => {
        const currentLevel = get().getProfessionLevel(professionId);
        const currentExperience = get().getProfessionExperience(professionId);

        // If already at max level, don't gain experience
        if (currentLevel >= 9) return;

        const newExperience = currentExperience + experienceGained;

        // Check if we leveled up
        const nextLevelExpRequired = get().getExperienceForNextLevel(professionId);
        let newLevel = currentLevel;

        if (nextLevelExpRequired !== null && newExperience >= nextLevelExpRequired) {
          newLevel = currentLevel + 1;
        }

        set(state => ({
          professionExperience: {
            ...state.professionExperience,
            [professionId]: newExperience
          },
          professionLevels: {
            ...state.professionLevels,
            [professionId]: newLevel
          }
        }));

        // Return the new level for notifications
        return { newLevel, leveledUp: newLevel > currentLevel };
      },

      // Set profession level (legacy function, now uses experience)
      setProfessionLevel: (professionId, level) => {
        set(state => ({
          professionLevels: {
            ...state.professionLevels,
            [professionId]: Math.max(0, Math.min(9, level))
          }
        }));
      },
      
      // Learn a recipe
      learnRecipe: (professionId, recipeId) => {
        set(state => {
          const currentRecipes = state.knownRecipes[professionId] || [];
          if (!currentRecipes.includes(recipeId)) {
            const newRecipes = [...currentRecipes, recipeId];
            return {
              knownRecipes: {
                ...state.knownRecipes,
                [professionId]: newRecipes
              }
            };
          }
          return state;
        });
      },
      
      // Forget a recipe
      forgetRecipe: (professionId, recipeId) => {
        set(state => ({
          knownRecipes: {
            ...state.knownRecipes,
            [professionId]: (state.knownRecipes[professionId] || []).filter(id => id !== recipeId)
          }
        }));
      },
      
      // Check if player knows a recipe
      knowsRecipe: (professionId, recipeId) => {
        const { knownRecipes } = get();
        return (knownRecipes[professionId] || []).includes(recipeId);
      },
      
      // Add recipe to available recipes
      addAvailableRecipe: (recipe) => {
        set(state => ({
          availableRecipes: [...state.availableRecipes, recipe]
        }));
      },
      
      // Remove recipe from available recipes
      removeAvailableRecipe: (recipeId) => {
        set(state => ({
          availableRecipes: state.availableRecipes.filter(recipe => recipe.id !== recipeId)
        }));
      },
      
      // Get recipes for a profession
      getRecipesForProfession: (professionId) => {
        const { availableRecipes } = get();
        const filtered = availableRecipes.filter(recipe => recipe.profession === professionId);
        return filtered;
      },
      
      // Get known recipes for a profession
      getKnownRecipesForProfession: (professionId) => {
        const { knownRecipes, availableRecipes } = get();
        const knownIds = knownRecipes[professionId] || [];
        return availableRecipes.filter(recipe => 
          recipe.profession === professionId && knownIds.includes(recipe.id)
        );
      },
      
      // Add item to crafting queue
      addToCraftingQueue: (craftingItem) => {
        const newId = Date.now().toString();
        const itemToAdd = {
          ...craftingItem,
          id: newId,
          startTime: craftingItem.startTime || null,
            status: craftingItem.status || 'queued'
        };
        set(state => ({
            craftingQueue: [...state.craftingQueue, itemToAdd]
        }));
        return newId; // Return the new item ID
      },
      
      // Remove item from crafting queue
      removeFromCraftingQueue: (craftingId) => {
        set(state => ({
          craftingQueue: state.craftingQueue.filter(item => item.id !== craftingId)
        }));
      },

      // Update crafting queue item status
      updateCraftingQueueItem: (craftingId, updates) => {
        set(state => ({
          craftingQueue: state.craftingQueue.map(item =>
            item.id === craftingId ? { ...item, ...updates } : item
          )
        }));
      },
      
      // Complete crafting item
      completeCraftingItem: (craftingId) => {
        const state = get();
        const queueItem = state.craftingQueue.find(item => item.id === craftingId);

        if (queueItem) {
          const recipe = state.availableRecipes.find(r => r.id === queueItem.recipeId);
          if (recipe && recipe.resultItemId) {
            try {
              const itemStore = getStore('itemStore');
              const itemState = itemStore.getState();
              const libraryItem = itemState.items.find(item => item.id === recipe.resultItemId);

              if (libraryItem) {
                const inventoryStore = getStore('inventoryStore');
                const quantity = recipe.resultQuantity || 1;
                for (let i = 0; i < quantity; i++) {
                  inventoryStore.addItemFromLibrary({ ...libraryItem });
                }
              }
            } catch (e) {
              console.warn('Failed to add crafted item to inventory:', e);
            }
          }
        }

        set(s => ({
          craftingQueue: s.craftingQueue.map(item =>
            item.id === craftingId ? { ...item, status: 'completed' } : item
          )
        }));
      },
      
      // Reset all crafting data
      resetCraftingData: () => {
        set(initialState);
      }
    }),
    createStorageConfig('crafting-storage', {
      version: 4,
      migrate: (persistedState, version) => {
        const safePersisted = persistedState || {};

        // v4: Replace availableRecipes entirely with the canonical set.
        // Older versions had legacy alchemy recipes with item IDs that don't
        // exist in the item library (peacebloom, silverleaf, linen-cloth, etc).
        // A clean replacement ensures only valid recipes remain.
        if (version < 4) {
          return {
            ...safePersisted,
            ...initialState,
            // Preserve player progress
            knownRecipes: { ...initialState.knownRecipes, ...(safePersisted.knownRecipes || {}) },
            professionLevels: { ...initialState.professionLevels, ...(safePersisted.professionLevels || {}) },
            professionExperience: { ...initialState.professionExperience, ...(safePersisted.professionExperience || {}) },
            availableRecipes: initialState.availableRecipes
          };
        }

        // v4+: just merge new recipes into existing ones
        const currentRecipes = safePersisted.availableRecipes || [];
        const initialStateRecipes = initialState.availableRecipes;
        const existingIds = new Set(currentRecipes.map(r => r.id));
        const newRecipes = initialStateRecipes.filter(r => !existingIds.has(r.id));

        return {
          ...safePersisted,
          ...initialState,
          availableRecipes: [...currentRecipes, ...newRecipes]
        };
      },
      merge: (persistedState, currentState) => {
        const safePersisted = persistedState || {};
        // Start from current state defaults so any missing top-level fields
        // (e.g. craftingQueue) are never undefined.
        const merged = { ...currentState, ...safePersisted };

        // Merge recipes so newly added ones are included
        const persistedRecipes = safePersisted.availableRecipes || [];
        const currentRecipes = currentState.availableRecipes || [];
        
        const existingIds = new Set(persistedRecipes.map(r => r.id));
        const missingRecipes = currentRecipes.filter(r => !existingIds.has(r.id));
        
        merged.availableRecipes = [...persistedRecipes, ...missingRecipes];

        // Guarantee array-typed collections exist
        merged.craftingQueue = Array.isArray(safePersisted.craftingQueue)
          ? safePersisted.craftingQueue
          : initialState.craftingQueue;
        merged.knownRecipes = { ...initialState.knownRecipes, ...(safePersisted.knownRecipes || {}) };
        merged.professionLevels = { ...initialState.professionLevels, ...(safePersisted.professionLevels || {}) };
        merged.professionExperience = { ...initialState.professionExperience, ...(safePersisted.professionExperience || {}) };

        return merged;
      }
    })
  )
);

export default useCraftingStore;
