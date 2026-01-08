/**
 * User Maps Persistence Hook
 *
 * Automatically saves and loads user-created custom maps to/from Firebase.
 * Syncs with the mapStore to ensure custom maps persist across sessions.
 */

import { useEffect, useCallback, useRef } from 'react';
import useAuthStore from '../store/authStore';
import useMapStore from '../store/mapStore';
import { saveUserMap, loadUserMaps, updateUserMap, deleteUserMap } from '../services/firebase/userMapsService';

const AUTO_SAVE_DELAY = 3000; // 3 seconds debounce

/**
 * Custom hook to manage persistence of user-created custom maps
 */
export const useUserMapsPersistence = () => {
  const { user } = useAuthStore();
  const saveTimerRef = useRef(null);

  // Track which maps are user-created vs built-in
  const isUserCreatedMap = useCallback((map) => {
    return map.isCustom === true || (map.source && map.source !== 'built-in');
  }, []);

  /**
   * Extract user-created maps from the map store
   */
  const getUserMaps = useCallback(() => {
    const mapStore = useMapStore.getState();
    // Get maps from the maps array (not just the current map)
    return mapStore.maps.filter(isUserCreatedMap);
  }, [isUserCreatedMap]);

  /**
   * Save a user-created map to Firebase
   */
  const saveMap = useCallback(async (map) => {
    if (!user || user.isGuest || !map) {
      return { success: false, reason: 'No authenticated user or invalid map' };
    }

    try {
      const result = await saveUserMap(user.uid, map);

      if (result.success) {
        console.log(`💾 User map saved: ${map.name} (${map.id})`);
      }

      return result;
    } catch (error) {
      console.error('Failed to save user map:', error);
      return { success: false, error: error.message };
    }
  }, [user]);

  /**
   * Load user-created maps from Firebase and merge with local maps
   */
  const loadMaps = useCallback(async () => {
    if (!user || user.isGuest) {
      console.log('👤 Guest user - skipping Firebase map load');
      return;
    }

    try {
      const firebaseMaps = await loadUserMaps(user.uid);

      if (firebaseMaps.length > 0) {
        // Get current maps from store
        const mapStore = useMapStore.getState();
        const existingMaps = mapStore.maps;

        // Separate built-in maps from user-created maps
        const builtInMaps = existingMaps.filter(map => !isUserCreatedMap(map));
        const localUserMaps = existingMaps.filter(isUserCreatedMap);

        // Create a map of existing user maps by ID for quick lookup
        const existingUserMapsMap = new Map();
        localUserMaps.forEach(map => {
          existingUserMapsMap.set(map.id, map);
        });

        // Merge Firebase maps with local maps
        // Firebase maps take precedence (more recent)
        const mergedUserMaps = firebaseMaps.map(firebaseMap => {
          const localMap = existingUserMapsMap.get(firebaseMap.id);
          if (localMap) {
            // Merge, with Firebase data taking precedence for conflicts
            return {
              ...localMap,
              ...firebaseMap,
              // Keep local data that Firebase doesn't have
              categories: firebaseMap.categories || localMap.categories
            };
          }
          return firebaseMap;
        });

        // Add any local maps that aren't in Firebase yet
        const firebaseMapIds = new Set(firebaseMaps.map(map => map.id));
        const missingLocalMaps = localUserMaps.filter(map => !firebaseMapIds.has(map.id));

        const allUserMaps = [...mergedUserMaps, ...missingLocalMaps];

        // Update the store with merged maps
        useMapStore.setState({
          maps: [...builtInMaps, ...allUserMaps]
        });

        console.log(`📂 Loaded ${firebaseMaps.length} user maps from Firebase, merged with ${missingLocalMaps.length} local maps`);
      }
    } catch (error) {
      console.error('Failed to load user maps from Firebase:', error);
    }
  }, [user, isUserCreatedMap]);

  /**
   * Sync newly created maps to Firebase
   */
  const syncNewMaps = useCallback(async () => {
    if (!user || user.isGuest) {
      return;
    }

    const userMaps = getUserMaps();

    // Find maps that don't have Firebase timestamps (newly created)
    const unsyncedMaps = userMaps.filter(map =>
      !map.createdAt || !map.updatedAt || !map.userId
    );

    if (unsyncedMaps.length > 0) {
      console.log(`🔄 Syncing ${unsyncedMaps.length} new maps to Firebase`);

      for (const map of unsyncedMaps) {
        try {
          await saveMap({
            ...map,
            userId: user.uid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        } catch (error) {
          console.error(`Failed to sync map ${map.id}:`, error);
        }
      }
    }
  }, [user, getUserMaps, saveMap]);

  // Load maps when user becomes authenticated
  useEffect(() => {
    if (user && !user.isGuest) {
      loadMaps();
    }
  }, [user, loadMaps]);

  // Sync new maps to Firebase periodically
  useEffect(() => {
    if (!user || user.isGuest) {
      return;
    }

    const syncInterval = setInterval(() => {
      syncNewMaps();
    }, 10000); // Check every 10 seconds

    return () => clearInterval(syncInterval);
  }, [user, syncNewMaps]);

  // Auto-save when maps change
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

    // Set new timer to sync any new maps
    saveTimerRef.current = setTimeout(() => {
      syncNewMaps();
    }, AUTO_SAVE_DELAY);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [getUserMaps(), user, syncNewMaps]); // Depend on user maps changing

  return {
    // State
    isAuthenticated: !!user && !user.isGuest,

    // Actions
    saveMap,
    loadMaps,
    syncNewMaps,

    // Utilities
    getUserMaps,
    isUserCreatedMap
  };
};
