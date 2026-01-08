/**
 * User Items Persistence Hook
 *
 * Automatically saves and loads user-created custom items to/from Firebase.
 * Syncs with the itemStore to ensure custom items persist across sessions.
 */

import { useEffect, useCallback, useRef } from 'react';
import useAuthStore from '../store/authStore';
import useItemStore from '../store/itemStore';
import { saveUserItem, loadUserItems, updateUserItem, deleteUserItem } from '../services/firebase/userItemsService';

const AUTO_SAVE_DELAY = 3000; // 3 seconds debounce

/**
 * Custom hook to manage persistence of user-created custom items
 */
export const useUserItemsPersistence = () => {
  const { user } = useAuthStore();
  const saveTimerRef = useRef(null);

  // Track which items are user-created vs built-in
  const isUserCreatedItem = useCallback((item) => {
    return item.isCustom === true || (item.source && item.source !== 'built-in');
  }, []);

  /**
   * Extract user-created items from the item store
   */
  const getUserItems = useCallback(() => {
    const itemStore = useItemStore.getState();
    return itemStore.items.filter(isUserCreatedItem);
  }, [isUserCreatedItem]);

  /**
   * Save a user-created item to Firebase
   */
  const saveItem = useCallback(async (item) => {
    if (!user || user.isGuest || !item) {
      return { success: false, reason: 'No authenticated user or invalid item' };
    }

    try {
      const result = await saveUserItem(user.uid, item);

      if (result.success) {
        console.log(`💾 User item saved: ${item.name} (${item.id})`);
      }

      return result;
    } catch (error) {
      console.error('Failed to save user item:', error);
      return { success: false, error: error.message };
    }
  }, [user]);

  /**
   * Load user-created items from Firebase and merge with local items
   */
  const loadItems = useCallback(async () => {
    if (!user || user.isGuest) {
      console.log('👤 Guest user - skipping Firebase item load');
      return;
    }

    try {
      const firebaseItems = await loadUserItems(user.uid);

      if (firebaseItems.length > 0) {
        // Get current items from store
        const itemStore = useItemStore.getState();
        const existingItems = itemStore.items;

        // Separate built-in items from user-created items
        const builtInItems = existingItems.filter(item => !isUserCreatedItem(item));
        const localUserItems = existingItems.filter(isUserCreatedItem);

        // Create a map of existing user items by ID for quick lookup
        const existingUserItemsMap = new Map();
        localUserItems.forEach(item => {
          existingUserItemsMap.set(item.id, item);
        });

        // Merge Firebase items with local items
        // Firebase items take precedence (more recent)
        const mergedUserItems = firebaseItems.map(firebaseItem => {
          const localItem = existingUserItemsMap.get(firebaseItem.id);
          if (localItem) {
            // Merge, with Firebase data taking precedence for conflicts
            return {
              ...localItem,
              ...firebaseItem,
              // Keep local data that Firebase doesn't have
              categories: firebaseItem.categories || localItem.categories
            };
          }
          return firebaseItem;
        });

        // Add any local items that aren't in Firebase yet
        const firebaseItemIds = new Set(firebaseItems.map(item => item.id));
        const missingLocalItems = localUserItems.filter(item => !firebaseItemIds.has(item.id));

        const allUserItems = [...mergedUserItems, ...missingLocalItems];

        // Update the store with merged items
        useItemStore.setState({
          items: [...builtInItems, ...allUserItems]
        });

        console.log(`📂 Loaded ${firebaseItems.length} user items from Firebase, merged with ${missingLocalItems.length} local items`);
      }
    } catch (error) {
      console.error('Failed to load user items from Firebase:', error);
    }
  }, [user, isUserCreatedItem]);

  /**
   * Sync newly created items to Firebase
   */
  const syncNewItems = useCallback(async () => {
    if (!user || user.isGuest) {
      return;
    }

    const userItems = getUserItems();

    // Find items that don't have Firebase timestamps (newly created)
    const unsyncedItems = userItems.filter(item =>
      !item.createdAt || !item.updatedAt || !item.userId
    );

    if (unsyncedItems.length > 0) {
      console.log(`🔄 Syncing ${unsyncedItems.length} new items to Firebase`);

      for (const item of unsyncedItems) {
        try {
          await saveItem({
            ...item,
            userId: user.uid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
        }
      }
    }
  }, [user, getUserItems, saveItem]);

  // Load items when user becomes authenticated
  useEffect(() => {
    if (user && !user.isGuest) {
      loadItems();
    }
  }, [user, loadItems]);

  // Sync new items to Firebase periodically
  useEffect(() => {
    if (!user || user.isGuest) {
      return;
    }

    const syncInterval = setInterval(() => {
      syncNewItems();
    }, 10000); // Check every 10 seconds

    return () => clearInterval(syncInterval);
  }, [user, syncNewItems]);

  // Auto-save when items change
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

    // Set new timer to sync any new items
    saveTimerRef.current = setTimeout(() => {
      syncNewItems();
    }, AUTO_SAVE_DELAY);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [getUserItems(), user, syncNewItems]); // Depend on user items changing

  return {
    // State
    isAuthenticated: !!user && !user.isGuest,

    // Actions
    saveItem,
    loadItems,
    syncNewItems,

    // Utilities
    getUserItems,
    isUserCreatedItem
  };
};
