import React, { useEffect, createContext, useContext } from 'react';

// Create context for persistence status
const PersistenceContext = createContext({
  isOnline: false,
  storageUsage: null,
  isLoading: false,
  error: null
});

export const usePersistence = () => useContext(PersistenceContext);

const PersistenceProvider = ({ children }) => {
  // Use dynamic require to break circular dependencies
  const useAuthStore = require('../../store/authStore').default;
  const useGameStore = require('../../store/gameStore').default;
  const useSettingsStore = require('../../store/settingsStore').default;
  const persistenceService = require('../../services/firebase/persistenceService').default;
  const CharacterPersistenceProvider = require('./CharacterPersistenceProvider').default;
  const { useJournalPersistence } = require('../../hooks/useJournalPersistence');
  const { useRoomPersistence } = require('../../hooks/useRoomPersistence');
  const { useUserItemsPersistence } = require('../../hooks/useUserItemsPersistence');
  const { useUserCreaturesPersistence } = require('../../hooks/useUserCreaturesPersistence');
  const { useUserMapsPersistence } = require('../../hooks/useUserMapsPersistence');

  const { user } = useAuthStore();
  const currentRoomId = useGameStore(state => state.multiplayerRoom?.id);

  // Initialize all persistence hooks
  const journalPersistence = useJournalPersistence();
  const roomPersistence = useRoomPersistence(currentRoomId);
  const userItemsPersistence = useUserItemsPersistence();
  const userCreaturesPersistence = useUserCreaturesPersistence();
  const userMapsPersistence = useUserMapsPersistence();

  // Initialize settings store (triggers loading from Firebase/localStorage)
  const settingsStore = useSettingsStore();

  // Persistence status state
  const [persistenceStatus, setPersistenceStatus] = React.useState({
    isOnline: false,
    storageUsage: null,
    isLoading: false,
    error: null
  });

  // Check Firebase connectivity and load storage usage
  useEffect(() => {
    const checkPersistenceStatus = async () => {
      if (!user || user.isGuest) {
        setPersistenceStatus({
          isOnline: false,
          storageUsage: { total: 0, breakdown: {} },
          isLoading: false,
          error: null
        });
        return;
      }

      setPersistenceStatus(prev => ({ ...prev, isLoading: true }));

      try {
        // Check if we can access Firebase with timeout protection
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Persistence check timeout - Firebase may be temporarily unavailable')), 8000);
        });

        const persistencePromise = Promise.all([
          persistenceService.getUserTier(user.uid),
          persistenceService.getStorageUsage(user.uid)
        ]);

        const [{ limits }, storageUsage] = await Promise.race([persistencePromise, timeoutPromise]);

        setPersistenceStatus({
          isOnline: true,
          storageUsage,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Persistence status check failed:', error);
        // Don't disable persistence completely for network issues - user can still try to save
        if (error.message.includes('timeout') || error.message.includes('network') ||
            error.message.includes('unavailable') || error.message.includes('offline')) {
          setPersistenceStatus({
            isOnline: false,
            storageUsage: null,
            isLoading: false,
            error: 'Network connectivity issue - persistence temporarily unavailable'
          });
        } else {
          setPersistenceStatus({
            isOnline: false,
            storageUsage: null,
            isLoading: false,
            error: error.message
          });
        }
      }
    };

    checkPersistenceStatus();
  }, [user]);

  // Log persistence status for debugging
  useEffect(() => {
    if (user) {
      if (user.isGuest) {
        console.log('👤 Guest user - no data persistence enabled');
      } else if (persistenceStatus.isOnline) {
        console.log('💾 Authenticated user - full data persistence enabled');
        if (persistenceStatus.storageUsage) {
          const usage = persistenceStatus.storageUsage;
          console.log(`📊 Storage usage: ${(usage.total / (1024 * 1024)).toFixed(2)}MB used`);
        }
      } else {
        console.log('⚠️ Authenticated user - persistence offline or unavailable');
      }
    }
  }, [user, persistenceStatus]);

  // Centralized Worldbuilding & Campaign Cloud Hydration on User Login
  //
  // Wave B: local private category state is scoped (scopedStoreStorage) and is
  // rehydrated/retired by the account-handoff participant. This lifecycle only
  // talks to the cloud:
  //   - dirty local (unsynced envelope) is pushed, never overwritten;
  //   - clean local hydrates the owner's cloud document;
  //   - acknowledgment is revision-bound, so an N ack can never clear N+1;
  //   - hydration/push responses are owner-generation fenced inside the store.
  // The global boolean dirty markers (`mythrill_wb_dirty_*`) are no longer the
  // dirty authority and are no longer written here.
  useEffect(() => {
    const worldSubscriptions = [];
    let cancelled = false;

    if (user && !user.isGuest && persistenceStatus.isOnline) {
      const uid = user.uid;
      const hydrateAllWorldbuilding = async () => {
        try {
          const { default: useBookStore } = await import('../../store/bookStore');
          const { default: useInteractiveMapStore } = await import('../../store/interactiveMapStore');
          const { default: useFamilyTreeStore } = await import('../../store/familyTreeStore');
          const { default: useShareableStore } = await import('../../store/shareableStore');
          const { default: useCustomLineageStore } = await import('../../store/customLineageStore');
          const { default: useFactionStore } = await import('../../store/factionStore');
          const { default: useTimelineStore } = await import('../../store/timelineStore');
          const { default: useQuestStore } = await import('../../store/questStore');
          const { default: useWorldStore } = await import('../../store/worldStore');
          const { default: useDeityStore } = await import('../../store/deityStore');
          const { default: useLanguageStore } = await import('../../store/languageStore');
          const { default: campaignService } = await import('../../services/campaignService');
          const { getScopedStoreEngine } = await import('../../persistence/scopedStoreStorage');
          const { whenHandoffIdle } = await import('../../persistence/authBootstrapGateBinding');

          // Wait for the handoff (retire/reset/activate) to settle so scoped
          // stores have rehydrated the destination owner, then re-verify the
          // account before touching the cloud.
          await whenHandoffIdle();
          if (cancelled) return;
          const liveUid = useAuthStore.getState().user && !useAuthStore.getState().user.isGuest
            ? useAuthStore.getState().user.uid
            : null;
          if (liveUid !== uid) return;

          // [store, scoped family id]
          const stores = [
            [useBookStore, 'worldbuilding.books'],
            [useInteractiveMapStore, 'worldbuilding.interactiveMaps'],
            [useFamilyTreeStore, 'worldbuilding.familyTrees'],
            [useCustomLineageStore, 'worldbuilding.lineages'],
            [useFactionStore, 'worldbuilding.factions'],
            [useTimelineStore, 'worldbuilding.timelines'],
            [useQuestStore, 'worldbuilding.quests'],
            [useWorldStore, 'worldbuilding.worlds'],
            [useDeityStore, 'worldbuilding.deities'],
            [useLanguageStore, 'worldbuilding.languages'],
            [useShareableStore, 'journal.shareable']
          ];

          // Hydrate only stores whose scoped record is clean (no unsynced local
          // edits). Dirty stores keep local and are pushed by the subscription
          // below; campaigns own their dirty logic inside campaignService.
          for (const [store, familyId] of stores) {
            const engine = getScopedStoreEngine(familyId);
            const dirty = !!(engine && typeof engine.__isDirty === 'function' && engine.__isDirty());
            if (!dirty) {
              await store.getState().hydrateFromCloud?.(uid);
            }
          }
          await campaignService.hydrateFromCloud?.(uid);
          if (cancelled) return;
          console.log('🌌 Worldbuilding & Campaign cloud hydration synchronized for:', uid);

          // Debounced auto-sync + revision-bound dirty acknowledgment.
          stores.forEach(([store, familyId]) => {
            if (!store || typeof store.subscribe !== 'function') return;
            const engine = getScopedStoreEngine(familyId);
            let timer = null;
            let changeSeq = 0;
            const scheduleSync = (delay = 2000) => {
              clearTimeout(timer);
              timer = setTimeout(async () => {
                const seqAtStart = changeSeq;
                try {
                  const res = await store.getState().syncToCloud?.(uid);
                  if (res !== false && engine && typeof engine.__confirmSynced === 'function') {
                    if (changeSeq === seqAtStart) {
                      await engine.__confirmSynced();
                    }
                  }
                } catch (err) {
                  console.warn('Worldbuilding auto-sync failed:', err);
                }
              }, delay);
            };

            const unsubscribe = store.subscribe((state, prevState) => {
              if (!prevState) return;
              // Ignore sync-metadata-only changes so cloud acknowledgments do
              // not create an endless write loop.
              const changed = Object.keys(state).filter((k) => state[k] !== prevState[k]);
              if (changed.length === 0 || changed.every((k) => k === 'lastCloudSyncAt')) return;
              changeSeq += 1;
              scheduleSync();
            });
            worldSubscriptions.push(() => { clearTimeout(timer); unsubscribe(); });

            // Push local state up for stores with unsynced edits.
            if (engine && typeof engine.__isDirty === 'function' && engine.__isDirty()) {
              scheduleSync(0);
            }
          });
        } catch (err) {
          console.warn('Worldbuilding cloud hydration error:', err);
        }
      };

      hydrateAllWorldbuilding();
    }
    return () => {
      cancelled = true;
      worldSubscriptions.forEach((unsubscribe) => unsubscribe());
    };
  }, [user, persistenceStatus.isOnline]);

  // Helper to force save all worldbuilding stores
  const saveAllWorldbuilding = async (uid) => {
    if (!uid) return;
    try {
      const liveUid = useAuthStore.getState().user && !useAuthStore.getState().user.isGuest
        ? useAuthStore.getState().user.uid
        : null;
      if (liveUid !== uid) return; // owner changed: never publish A's store under B

      const { default: useBookStore } = await import('../../store/bookStore');
      const { default: useInteractiveMapStore } = await import('../../store/interactiveMapStore');
      const { default: useFamilyTreeStore } = await import('../../store/familyTreeStore');
      const { default: useShareableStore } = await import('../../store/shareableStore');
      const { default: useCustomLineageStore } = await import('../../store/customLineageStore');
      const { default: useFactionStore } = await import('../../store/factionStore');
      const { default: useTimelineStore } = await import('../../store/timelineStore');
      const { default: useQuestStore } = await import('../../store/questStore');
      const { default: useWorldStore } = await import('../../store/worldStore');
      const { default: useDeityStore } = await import('../../store/deityStore');
      const { default: useLanguageStore } = await import('../../store/languageStore');
      const { default: campaignService } = await import('../../services/campaignService');

      await Promise.allSettled([
        useBookStore.getState().syncToCloud?.(uid),
        useInteractiveMapStore.getState().syncToCloud?.(uid),
        useFamilyTreeStore.getState().syncToCloud?.(uid),
        useShareableStore.getState().syncToCloud?.(uid),
        useCustomLineageStore.getState().syncToCloud?.(uid),
        useFactionStore.getState().syncToCloud?.(uid),
        useTimelineStore.getState().syncToCloud?.(uid),
        useQuestStore.getState().syncToCloud?.(uid),
        useWorldStore.getState().syncToCloud?.(uid),
        useDeityStore.getState().syncToCloud?.(uid),
        useLanguageStore.getState().syncToCloud?.(uid),
        campaignService.syncToCloud?.(uid)
      ]);
    } catch (err) {
      console.warn('Worldbuilding emergency save error:', err);
    }
  };

  // Handle page unload - force save all data
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (user && !user.isGuest && persistenceStatus.isOnline) {
        try {
          // Force save everything
          await Promise.all([
            journalPersistence.forceSave?.(),
            roomPersistence.forceSave?.(),
            userItemsPersistence.syncNewItems?.(),
            userCreaturesPersistence.syncNewCreatures?.(),
            userMapsPersistence.syncNewMaps?.(),
            saveAllWorldbuilding(user.uid)
          ]);
          console.log('💾 Emergency save completed before page unload');
        } catch (error) {
          console.error('Emergency save failed:', error);
        }
      }
    };

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden' && user && !user.isGuest && persistenceStatus.isOnline) {
        try {
          await Promise.all([
            journalPersistence.forceSave?.(),
            roomPersistence.forceSave?.(),
            userItemsPersistence.syncNewItems?.(),
            userCreaturesPersistence.syncNewCreatures?.(),
            userMapsPersistence.syncNewMaps?.(),
            saveAllWorldbuilding(user.uid)
          ]);
        } catch (error) {
          console.error('Background save failed:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, persistenceStatus.isOnline, journalPersistence, roomPersistence]);

  const contextValue = {
    ...persistenceStatus,
    // Expose persistence hooks for manual control if needed
    journal: journalPersistence,
    room: roomPersistence,
    userItems: userItemsPersistence,
    userCreatures: userCreaturesPersistence,
    userMaps: userMapsPersistence,
    // Utility functions
    refreshStorageUsage: async () => {
      if (user && !user.isGuest) {
        try {
          const storageUsage = await persistenceService.getStorageUsage(user.uid);
          setPersistenceStatus(prev => ({ ...prev, storageUsage }));
        } catch (error) {
          console.error('Failed to refresh storage usage:', error);
        }
      }
    },
    forceSaveAll: async () => {
      if (user && !user.isGuest && persistenceStatus.isOnline) {
        try {
          await Promise.all([
            journalPersistence.forceSave?.(),
            roomPersistence.forceSave?.(),
            userItemsPersistence.syncNewItems?.(),
            userCreaturesPersistence.syncNewCreatures?.(),
            userMapsPersistence.syncNewMaps?.(),
            saveAllWorldbuilding(user.uid)
          ]);
          return { success: true };
        } catch (error) {
          return { success: false, error: error.message };
        }
      }
      return { success: false, reason: 'Not authenticated or persistence offline' };
    }
  };

  return (
    <PersistenceContext.Provider value={contextValue}>
      <CharacterPersistenceProvider>
        {children}
      </CharacterPersistenceProvider>
    </PersistenceContext.Provider>
  );
};

export default PersistenceProvider;
