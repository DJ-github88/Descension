import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Base category for quests
const BASE_CATEGORY = {
  id: 'all-quests',
  name: 'All Quests',
  isBaseCategory: true,
  parentId: null
};

// Sample quest for testing
const SAMPLE_QUESTS = [
  {
    id: 'quest-001',
    title: 'The Missing Shipment',
    description: 'A shipment of valuable goods has gone missing on the road to Stormwind. The merchant guild is offering a reward for anyone who can recover it.',
    difficulty: 'Normal',
    level: 5,
    status: 'active', // active, completed, failed
    giver: 'Merchant Watkins',
    location: 'Elwynn Forest',
    objectives: [
      {
        id: 'obj-001',
        type: 'kill',
        target: 'Defias Bandit',
        count: 8,
        progress: 0,
        description: 'Kill Defias Bandits that have been attacking travelers',
        optional: false
      },
      {
        id: 'obj-002',
        type: 'collect',
        target: 'Stolen Crate',
        count: 3,
        progress: 0,
        description: 'Recover the stolen crates',
        itemId: 'item-stolen-crate',
        optional: false
      },
      {
        id: 'obj-003',
        type: 'visit',
        target: 'Bandit Camp',
        description: 'Locate the bandit camp in the forest',
        coordinates: { x: 100, y: 200 },
        completed: false,
        optional: true
      }
    ],
    rewards: {
      experience: 500,
      currency: {
        gold: 1,
        silver: 50,
        copper: 0
      },
      items: [
        {
          id: 'item-001',
          name: 'Traveler\'s Backpack',
          quality: 'uncommon',
          type: 'container'
        }
      ]
    },
    prerequisites: {
      quests: [], // Array of quest IDs that must be completed first
      level: 3
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString()
  }
];

const useQuestStore = create(
  persist(
    (set, get) => ({
      // Quest Library state
      quests: [...SAMPLE_QUESTS],
      categories: [BASE_CATEGORY],
      questCategories: {}, // {questId: Set(categoryIds)}
      selectedQuest: null,
      selectedCategory: BASE_CATEGORY.id,

      // Filters
      filters: {
        query: '',
        status: 'active', // active, completed, all
        difficulty: [],
        minLevel: 0,
        maxLevel: 60
      },

      // Sort order
      sortOrder: {
        field: 'title',
        direction: 'asc'
      },

      // Window position persistence
      windowPosition: null, // Will be set when user moves the window
      windowSize: { width: 900, height: 700 }, // Default size

      // Actions
      addQuest: (quest, categories = null) => set(state => {
        const newQuest = {
          ...quest,
          id: quest.id || `quest-${Date.now()}`,
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

        // Create new questCategories state with the updated categories
        const newQuestCategories = {
          ...state.questCategories,
          [newQuest.id]: Array.from(categorySet) // Convert Set to Array
        };

        return {
          quests: [...state.quests, newQuest],
          questCategories: newQuestCategories,
          selectedQuest: newQuest.id
        };
      }),

      updateQuest: (id, updates) => set(state => ({
        quests: (state.quests || []).map(quest =>
          quest.id === id
            ? {
              ...quest,
              ...updates,
              lastModified: new Date().toISOString()
            }
            : quest
        )
      })),

      deleteQuest: (id) => set(state => ({
        quests: (state.quests || []).filter(quest => quest.id !== id),
        questCategories: (() => {
          const { [id]: _, ...rest } = (state.questCategories || {});
          return rest;
        })(),
        selectedQuest: state.selectedQuest === id ? null : state.selectedQuest
      })),

      setSelectedQuest: (id) => set({ selectedQuest: id }),

      setSelectedCategory: (id) => set({ selectedCategory: id }),

      updateObjectiveProgress: (questId, objectiveId, progress) => set(state => ({
        quests: (state.quests || []).map(quest =>
          quest.id === questId
            ? {
              ...quest,
              objectives: (quest.objectives || []).map(obj =>
                obj.id === objectiveId
                  ? { ...obj, progress }
                  : obj
              ),
              lastModified: new Date().toISOString()
            }
            : quest
        )
      })),

      completeObjective: (questId, objectiveId) => set(state => ({
        quests: (state.quests || []).map(quest =>
          quest.id === questId
            ? {
              ...quest,
              objectives: (quest.objectives || []).map(obj =>
                obj.id === objectiveId
                  ? {
                    ...obj,
                    progress: obj.type === 'visit' ? true : obj.count,
                    completed: true
                  }
                  : obj
              ),
              lastModified: new Date().toISOString()
            }
            : quest
        )
      })),

      completeQuest: (id) => set(state => ({
        quests: (state.quests || []).map(quest =>
          quest.id === id
            ? {
              ...quest,
              status: 'completed',
              lastModified: new Date().toISOString()
            }
            : quest
        )
      })),

      failQuest: (id) => set(state => ({
        quests: (state.quests || []).map(quest =>
          quest.id === id
            ? {
              ...quest,
              status: 'failed',
              lastModified: new Date().toISOString()
            }
            : quest
        )
      })),

      resetQuest: (id) => set(state => ({
        quests: (state.quests || []).map(quest =>
          quest.id === id
            ? {
              ...quest,
              status: 'active',
              objectives: (quest.objectives || []).map(obj => ({
                ...obj,
                progress: 0,
                completed: false
              })),
              lastModified: new Date().toISOString()
            }
            : quest
        )
      })),

      // Remove quest entirely
      removeQuest: (id) => set(state => ({
        quests: (state.quests || []).filter(quest => quest.id !== id)
      })),

      // Reactivate a failed quest
      reactivateQuest: (id) => set(state => ({
        quests: (state.quests || []).map(quest =>
          quest.id === id
            ? {
              ...quest,
              status: 'active',
              lastModified: new Date().toISOString()
            }
            : quest
        )
      })),

      // Filter actions
      setFilters: (filters) => set({ filters }),

      // Sort actions
      setSortOrder: (sortOrder) => set({ sortOrder }),

      // Window position management
      setWindowPosition: (position) => {
        set({ windowPosition: position });
      },

      setWindowSize: (size) => {
        set({ windowSize: size });
      }
    }),
    {
      name: 'quest-store',
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

export default useQuestStore;
