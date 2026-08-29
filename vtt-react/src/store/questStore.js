import { getStore } from './storeRegistry';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createStorageConfig } from '../utils/storageUtils';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured, auth } from '../config/firebase';

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
    title: 'The Missing Cinder-Casks',
    description: 'A shipment of valuable geothermal cinder-casks from Sundale has gone missing on the road to Greymark Keep. Renn of the Shallows is offering a reward for their recovery.',
    difficulty: 'Normal',
    level: 5,
    status: 'active', // active, completed, failed
    giver: 'Merchant Renn',
    location: 'Frostwood Reach',
    objectives: [
      {
        id: 'obj-001',
        type: 'kill',
        target: 'Ashland Raider',
        count: 8,
        progress: 0,
        description: 'Defeat Ashland Raiders that have been attacking the caravans',
        optional: false
      },
      {
        id: 'obj-002',
        type: 'collect',
        target: 'Stolen Cinder-Cask',
        count: 3,
        progress: 0,
        description: 'Recover the stolen geothermal cinder-casks',
        itemId: 'item-stolen-cinder-cask',
        optional: false
      },
      {
        id: 'obj-003',
        type: 'visit',
        target: 'Raider Camp',
        description: 'Locate the raider camp in the pine margins',
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
          name: "Traveler's Backpack",
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

const deliverQuestRewards = (rewards) => {
    const result = { experience: false, currency: false, items: 0 };
    if (!rewards) return result;
    try {
        if (rewards.experience) {
            getStore('characterStore').getState().awardExperience(rewards.experience);
            result.experience = true;
        }
        if (rewards.currency) {
            const inventoryStore = getStore('inventoryStore');
            const currentCurrency = inventoryStore.getState().currency || {};
            inventoryStore.getState().updateCurrency({
                platinum: (currentCurrency.platinum || 0) + (rewards.currency.platinum || 0),
                gold: (currentCurrency.gold || 0) + (rewards.currency.gold || 0),
                silver: (currentCurrency.silver || 0) + (rewards.currency.silver || 0),
                copper: (currentCurrency.copper || 0) + (rewards.currency.copper || 0)
            });
            result.currency = true;
        }
        if (Array.isArray(rewards.items) && rewards.items.length > 0) {
            const inventoryStore = getStore('inventoryStore');
            rewards.items.forEach(item => {
                inventoryStore.getState().addItemFromLibrary(item);
                result.items += 1;
            });
        }
    } catch (error) {
        console.error('Failed to deliver quest rewards:', error);
    }
    return result;
};

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

      // Multiplayer quest sharing state
      pendingSharedQuests: [], // Quests shared by GM awaiting player response
      pendingRewardDeliveries: [], // For GM: quest completions awaiting reward delivery
      activeSharedQuest: null, // Currently displayed shared quest offer
      activeRewardDelivery: null, // Currently displayed reward delivery request

      // GM tracking: which quests are being shared and who has responded
      // Format: { questId: { title, sharedAt, players: { playerId: { name, status: 'pending'|'accepted'|'declined' } } } }
      activeQuestShares: {},

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

      uncompleteObjective: (questId, objectiveId) => set(state => ({
        quests: (state.quests || []).map(quest =>
          quest.id === questId
            ? {
              ...quest,
              objectives: (quest.objectives || []).map(obj =>
                obj.id === objectiveId
                  ? {
                    ...obj,
                    progress: obj.type === 'visit' || obj.type === 'talk' ? false : 0,
                    completed: false
                  }
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

      completeQuest: (id) => {
        const state = get();
        const quest = (state.quests || []).find(q => q.id === id);
        if (quest && quest.rewards) {
          deliverQuestRewards(quest.rewards);
        }
        set(state => ({
          quests: (state.quests || []).map(q =>
            q.id === id
              ? {
                ...q,
                status: 'completed',
                completedAt: new Date().toISOString(),
                lastModified: new Date().toISOString()
              }
              : q
          )
        }));
      },

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
      },

      // === Multiplayer Quest Sharing Actions ===

      // Add a shared quest to pending (called when player receives quest offer)
      addPendingSharedQuest: (quest, sharedBy) => set(state => ({
        pendingSharedQuests: [
          ...state.pendingSharedQuests,
          {
            ...quest,
            sharedBy,
            sharedAt: new Date().toISOString(),
            isShared: true
          }
        ],
        // Automatically show the first pending quest
        activeSharedQuest: state.activeSharedQuest || {
          ...quest,
          sharedBy,
          sharedAt: new Date().toISOString(),
          isShared: true
        }
      })),

      // Accept a shared quest (moves it to active quests)
      acceptSharedQuest: (questId) => set(state => {
        const sharedQuest = state.pendingSharedQuests.find(q => q.id === questId);
        if (!sharedQuest) return state;

        // Remove from pending and add to quests
        const remainingPending = state.pendingSharedQuests.filter(q => q.id !== questId);

        return {
          quests: [
            ...state.quests,
            {
              ...sharedQuest,
              status: 'active',
              acceptedAt: new Date().toISOString()
            }
          ],
          pendingSharedQuests: remainingPending,
          activeSharedQuest: remainingPending[0] || null,
          selectedQuest: questId
        };
      }),

      // Decline a shared quest
      declineSharedQuest: (questId) => set(state => {
        const remainingPending = state.pendingSharedQuests.filter(q => q.id !== questId);
        return {
          pendingSharedQuests: remainingPending,
          activeSharedQuest: remainingPending[0] || null
        };
      }),

      // Show next pending shared quest
      showNextSharedQuest: () => set(state => ({
        activeSharedQuest: state.pendingSharedQuests[0] || null
      })),

      // Close active shared quest dialog without accepting/declining
      closeSharedQuestDialog: () => set({ activeSharedQuest: null }),

      // Add pending reward delivery (GM receives when player completes quest)
      addPendingRewardDelivery: (quest, playerId, playerName) => set(state => ({
        pendingRewardDeliveries: [
          ...state.pendingRewardDeliveries,
          {
            quest,
            playerId,
            playerName,
            requestedAt: new Date().toISOString()
          }
        ],
        // Automatically show the first pending delivery
        activeRewardDelivery: state.activeRewardDelivery || {
          quest,
          playerId,
          playerName,
          requestedAt: new Date().toISOString()
        }
      })),

      // Confirm reward delivery (GM approved)
      confirmRewardDelivery: (questId, playerId) => set(state => {
        const delivery = state.pendingRewardDeliveries.find(
          d => d.quest.id === questId && d.playerId === playerId
        );

        if (delivery && delivery.quest.rewards) {
          deliverQuestRewards(delivery.quest.rewards);
        }

        const remainingDeliveries = state.pendingRewardDeliveries.filter(
          d => !(d.quest.id === questId && d.playerId === playerId)
        );
        return {
          pendingRewardDeliveries: remainingDeliveries,
          activeRewardDelivery: remainingDeliveries[0] || null
        };
      }),

      // Deny quest completion (GM rejected)
      denyRewardDelivery: (questId, playerId) => set(state => {
        const remainingDeliveries = state.pendingRewardDeliveries.filter(
          d => !(d.quest.id === questId && d.playerId === playerId)
        );
        return {
          pendingRewardDeliveries: remainingDeliveries,
          activeRewardDelivery: remainingDeliveries[0] || null
        };
      }),

      // Close active reward delivery dialog
      closeRewardDeliveryDialog: () => set({ activeRewardDelivery: null }),

      // Show next pending reward delivery
      showNextRewardDelivery: () => set(state => ({
        activeRewardDelivery: state.pendingRewardDeliveries[0] || null
      })),

      // Request quest completion (player action)
      requestQuestCompletion: (questId) => {
        const state = get();
        const quest = state.quests.find(q => q.id === questId);
        if (!quest || !quest.isShared) {
          console.warn('Cannot request completion for non-shared quest');
          return null;
        }
        return quest;
      },

      // Mark a shared quest as completed locally (after GM delivers rewards)
      markSharedQuestCompleted: (questId) => set(state => ({
        quests: state.quests.map(quest =>
          quest.id === questId
            ? {
              ...quest,
              status: 'completed',
              completedAt: new Date().toISOString()
            }
            : quest
        )
      })),

      // === GM Quest Share Tracking ===

      // Track a quest as being shared (GM action)
      trackSharedQuest: (questId, playersList = []) => set(state => {
        const quest = state.quests.find(q => q.id === questId);
        if (!quest) return state;

        // Initialize tracking for all players as pending
        const players = {};
        playersList.forEach(player => {
          if (player && player.id) {
            players[player.id] = {
              name: player.name || 'Unknown Player',
              status: 'pending'
            };
          }
        });

        return {
          activeQuestShares: {
            ...state.activeQuestShares,
            [questId]: {
              title: quest.title,
              sharedAt: new Date().toISOString(),
              players
            }
          }
        };
      }),

      // Update player status for a shared quest (when player accepts/declines)
      updatePlayerShareStatus: (questId, playerId, playerName, status) => set(state => {
        const existingShare = state.activeQuestShares[questId];
        if (!existingShare) {
          // Create new entry if quest wasn't tracked yet
          return {
            activeQuestShares: {
              ...state.activeQuestShares,
              [questId]: {
                title: 'Quest',
                sharedAt: new Date().toISOString(),
                players: {
                  [playerId]: { name: playerName, status }
                }
              }
            }
          };
        }

        return {
          activeQuestShares: {
            ...state.activeQuestShares,
            [questId]: {
              ...existingShare,
              players: {
                ...existingShare.players,
                [playerId]: { name: playerName, status }
              }
            }
          }
        };
      }),

      // Clear share tracking for a quest
      clearQuestShareTracking: (questId) => set(state => {
        const newShares = { ...state.activeQuestShares };
        delete newShares[questId];
        return { activeQuestShares: newShares };
      }),

      // Get share status for a quest
      getQuestShareStatus: (questId) => {
        const state = get();
        return state.activeQuestShares[questId] || null;
      },

      // --- Cloud Synchronization & Hydration ---
      lastCloudSyncAt: null,

      syncToCloud: async (userId) => {
        if (!userId || userId === 'admin-dev-user' || userId === 'dev-user-123' || userId.startsWith('guest-') || !isFirebaseConfigured || !db) return false;
        try {
          const docRef = doc(db, 'users', userId, 'worldbuilding', 'quests');
          await setDoc(docRef, {
            quests: get().quests || [],
            categories: get().categories || [],
            updatedAt: new Date().toISOString()
          }, { merge: true });
          set({ lastCloudSyncAt: new Date().toISOString() });
          return true;
        } catch (err) {
          console.debug('Quests cloud sync skipped/failed:', err?.message || err);
          return false;
        }
      },

      hydrateFromCloud: async (userId) => {
        if (!userId || userId === 'admin-dev-user' || userId === 'dev-user-123' || userId.startsWith('guest-') || !isFirebaseConfigured || !db) return false;
        try {
          const docRef = doc(db, 'users', userId, 'worldbuilding', 'quests');
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            const updates = {};
            if (Array.isArray(data?.quests) && data.quests.length > 0) {
              updates.quests = data.quests;
            }
            if (Array.isArray(data?.categories) && data.categories.length > 0) {
              updates.categories = data.categories;
            }
            if (Object.keys(updates).length > 0) {
              set(updates);
              return true;
            } else if (get().quests.length > 0) {
              await get().syncToCloud(userId);
              return true;
            }
          } else if (get().quests.length > 0) {
            await get().syncToCloud(userId);
            return true;
          }
        } catch (err) {
          console.debug('Quests cloud hydration skipped/failed:', err?.message || err);
        }
        return false;
      }
    }),
    createStorageConfig('quest-store', {
      partialize: (state) => ({
        quests: state.quests,
        categories: state.categories,
        lastCloudSyncAt: state.lastCloudSyncAt
      })
    })
  )
);

export default useQuestStore;
