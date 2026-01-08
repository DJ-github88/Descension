/**
 * User Creatures Persistence Hook
 *
 * Automatically saves and loads user-created custom creatures to/from Firebase.
 * Syncs with the creatureStore to ensure custom creatures persist across sessions.
 */

import { useEffect, useCallback, useRef } from 'react';
import useAuthStore from '../store/authStore';
import useCreatureStore from '../store/creatureStore';
import { saveUserCreature, loadUserCreatures, updateUserCreature, deleteUserCreature } from '../services/firebase/userCreaturesService';

const AUTO_SAVE_DELAY = 3000; // 3 seconds debounce

/**
 * Custom hook to manage persistence of user-created custom creatures
 */
export const useUserCreaturesPersistence = () => {
  const { user } = useAuthStore();
  const saveTimerRef = useRef(null);

  // Track which creatures are user-created vs built-in
  const isUserCreatedCreature = useCallback((creature) => {
    return creature.isCustom === true || (creature.source && creature.source !== 'built-in');
  }, []);

  /**
   * Extract user-created creatures from the creature store
   */
  const getUserCreatures = useCallback(() => {
    const creatureStore = useCreatureStore.getState();
    return creatureStore.creatures.filter(isUserCreatedCreature);
  }, [isUserCreatedCreature]);

  /**
   * Save a user-created creature to Firebase
   */
  const saveCreature = useCallback(async (creature) => {
    if (!user || user.isGuest || !creature) {
      return { success: false, reason: 'No authenticated user or invalid creature' };
    }

    try {
      const result = await saveUserCreature(user.uid, creature);

      if (result.success) {
        console.log(`💾 User creature saved: ${creature.name} (${creature.id})`);
      }

      return result;
    } catch (error) {
      console.error('Failed to save user creature:', error);
      return { success: false, error: error.message };
    }
  }, [user]);

  /**
   * Load user-created creatures from Firebase and merge with local creatures
   */
  const loadCreatures = useCallback(async () => {
    if (!user || user.isGuest) {
      console.log('👤 Guest user - skipping Firebase creature load');
      return;
    }

    try {
      const firebaseCreatures = await loadUserCreatures(user.uid);

      if (firebaseCreatures.length > 0) {
        // Get current creatures from store
        const creatureStore = useCreatureStore.getState();
        const existingCreatures = creatureStore.creatures;

        // Separate built-in creatures from user-created creatures
        const builtInCreatures = existingCreatures.filter(creature => !isUserCreatedCreature(creature));
        const localUserCreatures = existingCreatures.filter(isUserCreatedCreature);

        // Create a map of existing user creatures by ID for quick lookup
        const existingUserCreaturesMap = new Map();
        localUserCreatures.forEach(creature => {
          existingUserCreaturesMap.set(creature.id, creature);
        });

        // Merge Firebase creatures with local creatures
        // Firebase creatures take precedence (more recent)
        const mergedUserCreatures = firebaseCreatures.map(firebaseCreature => {
          const localCreature = existingUserCreaturesMap.get(firebaseCreature.id);
          if (localCreature) {
            // Merge, with Firebase data taking precedence for conflicts
            return {
              ...localCreature,
              ...firebaseCreature,
              // Keep local data that Firebase doesn't have
              categories: firebaseCreature.categories || localCreature.categories
            };
          }
          return firebaseCreature;
        });

        // Add any local creatures that aren't in Firebase yet
        const firebaseCreatureIds = new Set(firebaseCreatures.map(creature => creature.id));
        const missingLocalCreatures = localUserCreatures.filter(creature => !firebaseCreatureIds.has(creature.id));

        const allUserCreatures = [...mergedUserCreatures, ...missingLocalCreatures];

        // Update the store with merged creatures
        useCreatureStore.setState({
          creatures: [...builtInCreatures, ...allUserCreatures]
        });

        console.log(`📂 Loaded ${firebaseCreatures.length} user creatures from Firebase, merged with ${missingLocalCreatures.length} local creatures`);
      }
    } catch (error) {
      console.error('Failed to load user creatures from Firebase:', error);
    }
  }, [user, isUserCreatedCreature]);

  /**
   * Sync newly created creatures to Firebase
   */
  const syncNewCreatures = useCallback(async () => {
    if (!user || user.isGuest) {
      return;
    }

    const userCreatures = getUserCreatures();

    // Find creatures that don't have Firebase timestamps (newly created)
    const unsyncedCreatures = userCreatures.filter(creature =>
      !creature.createdAt || !creature.updatedAt || !creature.userId
    );

    if (unsyncedCreatures.length > 0) {
      console.log(`🔄 Syncing ${unsyncedCreatures.length} new creatures to Firebase`);

      for (const creature of unsyncedCreatures) {
        try {
          await saveCreature({
            ...creature,
            userId: user.uid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        } catch (error) {
          console.error(`Failed to sync creature ${creature.id}:`, error);
        }
      }
    }
  }, [user, getUserCreatures, saveCreature]);

  // Load creatures when user becomes authenticated
  useEffect(() => {
    if (user && !user.isGuest) {
      loadCreatures();
    }
  }, [user, loadCreatures]);

  // Sync new creatures to Firebase periodically
  useEffect(() => {
    if (!user || user.isGuest) {
      return;
    }

    const syncInterval = setInterval(() => {
      syncNewCreatures();
    }, 10000); // Check every 10 seconds

    return () => clearInterval(syncInterval);
  }, [user, syncNewCreatures]);

  // Auto-save when creatures change
  useEffect(() => {
    if (!user || user.isGuest) {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      return;
    }

    // Clear existing timer
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    // Set new timer to sync any new creatures
    saveTimerRef.current = setTimeout(() => {
      syncNewCreatures();
    }, AUTO_SAVE_DELAY);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [getUserCreatures(), user, syncNewCreatures]); // Depend on user creatures changing

  return {
    // State
    isAuthenticated: !!user && !user.isGuest,

    // Actions
    saveCreature,
    loadCreatures,
    syncNewCreatures,

    // Utilities
    getUserCreatures,
    isUserCreatedCreature
  };
};
