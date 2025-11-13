import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    icon: 'trade_alchemy',
    implemented: true
  },
  BLACKSMITHING: {
    id: 'blacksmithing',
    name: 'Blacksmithing',
    description: 'Forging weapons and armor from metal and fire',
    icon: 'trade_blacksmithing',
    implemented: false
  },
  ENCHANTING: {
    id: 'enchanting',
    name: 'Enchanting',
    description: 'Imbuing items with magical properties and power',
    icon: 'trade_engraving',
    implemented: false
  },
  LEATHERWORKING: {
    id: 'leatherworking',
    name: 'Leatherworking',
    description: 'Crafting armor and goods from hides and leather',
    icon: 'trade_leatherworking',
    implemented: false
  },
  TAILORING: {
    id: 'tailoring',
    name: 'Tailoring',
    description: 'Weaving cloth into robes, bags, and magical garments',
    icon: 'trade_tailoring',
    implemented: false
  },
  JEWELCRAFTING: {
    id: 'jewelcrafting',
    name: 'Jewelcrafting',
    description: 'Cutting gems and crafting fine jewelry',
    icon: 'inv_misc_gem_01',
    implemented: false
  },
  ENGINEERING: {
    id: 'engineering',
    name: 'Engineering',
    description: 'Building mechanical devices and contraptions',
    icon: 'trade_engineering',
    implemented: false
  },
  HERBALISM: {
    id: 'herbalism',
    name: 'Herbalism',
    description: 'Gathering and preparing natural ingredients',
    icon: 'trade_herbalism',
    implemented: false
  },
  COOKING: {
    id: 'cooking',
    name: 'Cooking',
    description: 'Preparing nourishing meals and beneficial foods',
    icon: 'inv_misc_food_15',
    implemented: false
  },
  INSCRIPTION: {
    id: 'inscription',
    name: 'Inscription',
    description: 'Creating scrolls, books, and magical writings',
    icon: 'inv_inscription_tradeskill01',
    implemented: false
  }
};

// Initial state
const initialState = {
  // Player's profession levels
  professionLevels: Object.keys(PROFESSIONS).reduce((acc, professionId) => {
    acc[professionId] = SKILL_LEVELS.UNTRAINED.level;
    return acc;
  }, {}),

  // Player's profession experience points
  professionExperience: Object.keys(PROFESSIONS).reduce((acc, professionId) => {
    acc[professionId] = 0; // Start with 0 experience
    return acc;
  }, {}),
  
  // Known recipes by profession
  knownRecipes: Object.keys(PROFESSIONS).reduce((acc, professionId) => {
    // Give players the basic healing potion recipe to start
    if (professionId === 'alchemy') {
      acc[professionId] = ['minor-healing-potion-recipe'];
    } else {
      acc[professionId] = [];
    }
    return acc;
  }, {}),
  
  // All available recipes (for GM to manage)
  availableRecipes: [
    // Basic Alchemy Recipes
    {
      id: 'minor-healing-potion-recipe',
      name: 'Minor Healing Potion',
      profession: 'alchemy',
      description: 'A basic healing potion that restores a small amount of health.',
      requiredLevel: 0, // Untrained can make this
      resultItemId: 'minor-healing-potion',
      resultIcon: 'inv_potion_51',
      resultQuantity: 1,
      materials: [
        { itemId: 'peacebloom', quantity: 2 },
        { itemId: 'silverleaf', quantity: 1 },
        { itemId: 'empty-vial', quantity: 1 },
        { itemId: 'distilled-water', quantity: 1 }
      ],
      craftingTime: 3000, // 3 seconds
      experienceGained: 1,
      craftingTimeDisplay: '3 sec',
      category: 'healing'
    },
    {
      id: 'minor-mana-potion-recipe',
      name: 'Minor Mana Potion',
      profession: 'alchemy',
      description: 'A basic mana potion that restores a small amount of mana.',
      requiredLevel: 1, // Apprentice level
      resultItemId: 'mana-potion',
      resultIcon: 'inv_potion_76',
      resultQuantity: 1,
      materials: [
        { itemId: 'mageroyal', quantity: 1 },
        { itemId: 'silverleaf', quantity: 1 },
        { itemId: 'empty-vial', quantity: 1 },
        { itemId: 'distilled-water', quantity: 1 }
      ],
      craftingTime: 4500, // 4.5 seconds
      experienceGained: 2,
      craftingTimeDisplay: '4.5 sec',
      category: 'mana'
    },
    {
      id: 'elixir-of-fortitude-recipe',
      name: 'Elixir of Fortitude',
      profession: 'alchemy',
      description: 'An elixir that temporarily increases health and constitution.',
      requiredLevel: 2, // Journeyman level
      resultItemId: 'elixir-of-fortitude',
      resultIcon: 'inv_potion_43',
      resultQuantity: 1,
      materials: [
        { itemId: 'earthroot', quantity: 3 },
        { itemId: 'peacebloom', quantity: 2 },
        { itemId: 'crystal-vial', quantity: 1 },
        { itemId: 'distilled-water', quantity: 2 },
        { itemId: 'alchemical-catalyst', quantity: 1 }
      ],
      craftingTime: 6500, // 6.5 seconds
      experienceGained: 4,
      craftingTimeDisplay: '6.5 sec',
      category: 'enhancement'
    },
    {
      id: 'greater-healing-potion-recipe',
      name: 'Greater Healing Potion',
      profession: 'alchemy',
      description: 'A potent healing potion that restores a significant amount of health.',
      requiredLevel: 2, // Apprentice level
      resultItemId: 'greater-healing-potion',
      resultIcon: 'inv_potion_54',
      resultQuantity: 1,
      materials: [
        { itemId: 'peacebloom', quantity: 3 },
        { itemId: 'earthroot', quantity: 2 },
        { itemId: 'empty-vial', quantity: 1 },
        { itemId: 'distilled-water', quantity: 2 }
      ],
      craftingTime: 5500, // 5.5 seconds
      experienceGained: 3,
      craftingTimeDisplay: '5.5 sec',
      category: 'healing'
    },
    {
      id: 'elixir-of-agility-recipe',
      name: 'Elixir of Agility',
      profession: 'alchemy',
      description: 'An elixir that temporarily increases agility and movement speed.',
      requiredLevel: 3, // Journeyman level
      resultItemId: 'elixir-of-agility',
      resultIcon: 'inv_potion_95',
      resultQuantity: 1,
      materials: [
        { itemId: 'silverleaf', quantity: 4 },
        { itemId: 'mageroyal', quantity: 1 },
        { itemId: 'crystal-vial', quantity: 1 },
        { itemId: 'distilled-water', quantity: 2 }
      ],
      craftingTime: 7500, // 7.5 seconds
      experienceGained: 5,
      craftingTimeDisplay: '7.5 sec',
      category: 'enhancement'
    },
    {
      id: 'poison-antidote-recipe',
      name: 'Poison Antidote',
      profession: 'alchemy',
      description: 'A remedy that neutralizes most common poisons.',
      requiredLevel: 2, // Apprentice level
      resultItemId: 'poison-antidote',
      resultIcon: 'inv_potion_17',
      resultQuantity: 1,
      materials: [
        { itemId: 'silverleaf', quantity: 3 },
        { itemId: 'peacebloom', quantity: 1 },
        { itemId: 'empty-vial', quantity: 1 },
        { itemId: 'distilled-water', quantity: 1 }
      ],
      craftingTime: 6000, // 6 seconds
      experienceGained: 3,
      craftingTimeDisplay: '6 sec',
      category: 'utility'
    },
    {
      id: 'elixir-of-intellect-recipe',
      name: 'Elixir of Intellect',
      profession: 'alchemy',
      description: 'An elixir that temporarily increases intelligence and magical power.',
      requiredLevel: 4, // Expert level
      resultItemId: 'elixir-of-intellect',
      resultIcon: 'inv_potion_09',
      resultQuantity: 1,
      materials: [
        { itemId: 'mageroyal', quantity: 3 },
        { itemId: 'earthroot', quantity: 2 },
        { itemId: 'crystal-vial', quantity: 1 },
        { itemId: 'distilled-water', quantity: 2 },
        { itemId: 'alchemical-catalyst', quantity: 1 }
      ],
      craftingTime: 9000, // 9 seconds
      experienceGained: 7,
      craftingTimeDisplay: '9 sec',
      category: 'enhancement'
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
            return {
              knownRecipes: {
                ...state.knownRecipes,
                [professionId]: [...currentRecipes, recipeId]
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
        return availableRecipes.filter(recipe => recipe.profession === professionId);
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
        set(state => ({
          craftingQueue: state.craftingQueue.map(item =>
            item.id === craftingId ? { ...item, status: 'completed' } : item
          )
        }));
      },
      
      // Reset all crafting data
      resetCraftingData: () => {
        set(initialState);
      }
    }),
    {
      name: 'crafting-storage',
      version: 2
    }
  )
);

export default useCraftingStore;
