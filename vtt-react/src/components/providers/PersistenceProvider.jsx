/**
 * Persistence Provider
 *
 * Master provider that orchestrates all data persistence throughout the app.
 * Combines character, room, journal, and campaign persistence.
 */

import React, { useEffect, createContext, useContext } from 'react';
import useAuthStore from '../../store/authStore';
import useGameStore from '../../store/gameStore';
import CharacterPersistenceProvider from './CharacterPersistenceProvider';
import { useJournalPersistence } from '../../hooks/useJournalPersistence';
import { useRoomPersistence } from '../../hooks/useRoomPersistence';
import { useCampaignPersistence } from '../../hooks/useCampaignPersistence';
import { useUserItemsPersistence } from '../../hooks/useUserItemsPersistence';
import { useUserCreaturesPersistence } from '../../hooks/useUserCreaturesPersistence';
import { useUserMapsPersistence } from '../../hooks/useUserMapsPersistence';
import persistenceService from '../../services/firebase/persistenceService';
import useSettingsStore from '../../store/settingsStore';

// Create context for persistence status
const PersistenceContext = createContext({
  isOnline: false,
  storageUsage: null,
  isLoading: false,
  error: null
});

export const usePersistence = () => useContext(PersistenceContext);

const PersistenceProvider = ({ children }) => {
  const { user } = useAuthStore();
  const currentRoomId = useGameStore(state => state.currentRoomId);

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
            userMapsPersistence.syncNewMaps?.()
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
            userMapsPersistence.syncNewMaps?.()
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
            userMapsPersistence.syncNewMaps?.()
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
