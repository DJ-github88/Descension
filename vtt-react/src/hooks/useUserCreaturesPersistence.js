/**
 * User Creatures Persistence Hook
 *
 * Automatically saves and loads user-created custom creatures to/from Firebase.
 * Syncs with the creatureStore to ensure custom creatures persist across sessions.
 */

import { useEffect, useCallback, useRef } from 'react';
import { saveUserCreature, loadUserCreatures } from '../services/firebase/userCreaturesService';
import { useShallow } from 'zustand/react/shallow';
import { pendingRemovals, confirmRemoval, serializeCloudWrite, removalGeneration, confirmedSince } from '../services/creatureAbilityRemoval';

const AUTO_SAVE_DELAY = 3000; // 3 seconds debounce

/**
 * Custom hook to manage persistence of user-created custom creatures
 */
export const useUserCreaturesPersistence = () => {
  const useAuthStore = require('../store/authStore').default;
  const useCreatureStore = require('../store/creatureStore').default;
  const { user } = useAuthStore();
  const saveTimerRef = useRef(null);
  const syncedCreaturesRef = useRef(new Map());
  const creatures = useCreatureStore(useShallow(state => state.creatures));

  const isUserCreatedCreature = useCallback((creature) => {
    return creature.isCustom === true || (creature.source && creature.source !== 'built-in');
  }, []);

  /**
   * Extract user-created creatures from the creature store
   */
  const getUserCreatures = useCallback(() => {
    const creatureStore = useCreatureStore?.getState();
    if (!creatureStore || !creatureStore.creatures) return [];
    return creatureStore.creatures.filter(isUserCreatedCreature);
  }, [isUserCreatedCreature, useCreatureStore]);

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

  // A removed ability association whose cloud delete is not confirmed. Durable: a pending-removal record (account + creature,
  // services/creatureAbilityRemoval) survives reload. Also true within a session when the last synced snapshot had the
  // association and the local creature no longer does.
  const removalPending = (local, synced = syncedCreaturesRef.current, pendingIds = new Map()) => {
    if (!local || (Object.prototype.hasOwnProperty.call(local, 'authoredAbility') && local.authoredAbility !== undefined)) return false; // a newer assignment wins
    if (pendingIds.has(local.id)) return true;
    try { return JSON.parse(synced.get(local.id) || 'null')?.authoredAbility !== undefined; } catch (_) { return false; }
  };
  const withoutAbility = (c) => { if (!c || !Object.prototype.hasOwnProperty.call(c, 'authoredAbility')) return c; const { authoredAbility, ...rest } = c; return rest; };

  /**
   * Load user-created creatures from Firebase and merge with local creatures
   */
  const loadCreatures = useCallback(async () => {
    if (!user || user.isGuest) {
      console.log('👤 Guest user - skipping Firebase creature load');
      return;
    }

    try {
      const generationAtRequest = removalGeneration();
      const firebaseCreatures = await loadUserCreatures(user.uid);

      if (firebaseCreatures.length > 0) {
        const pendingIds = pendingRemovals(user.uid);
        // A removal confirmed while this request was in flight: a response served before the delete must not restore it.
        for (const id of confirmedSince(user.uid, generationAtRequest)) if (!pendingIds.has(id)) pendingIds.set(id, null);
        // Cloud copy already lacks the association: the removal is confirmed by the cloud state itself.
        for (const c of firebaseCreatures) if (pendingIds.has(c.id) && c.authoredAbility === undefined) { confirmRemoval(user.uid, c.id, pendingIds.get(c.id)); pendingIds.delete(c.id); }
        // Get current creatures from store
        const creatureStore = useCreatureStore?.getState();
        if (!creatureStore || !creatureStore.creatures) return;
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
            const merged = {
              ...localCreature,
              ...firebaseCreature,
              // Keep local data that Firebase doesn't have
              categories: firebaseCreature.categories || localCreature.categories
            };
            // A removed ability association whose cloud delete has not been confirmed must not be restored by the
            // cloud copy. "Pending" = the last synced snapshot of this session had the association and the local
            // creature no longer does; the periodic full save (setDoc, no merge) then retries the deletion.
            // Last-writer-wins by design: an association another device adds while this removal is still unconfirmed is
            // overwritten by that retry. Once a save succeeds the snapshot clears and cloud associations merge normally.
            if (removalPending(localCreature, syncedCreaturesRef.current, pendingIds)) delete merged.authoredAbility;
            return merged;
          }
          return pendingIds.has(firebaseCreature.id) ? withoutAbility(firebaseCreature) : firebaseCreature;
        });

        // Add any local creatures that aren't in Firebase yet
        const firebaseCreatureIds = new Set(firebaseCreatures.map(creature => creature.id));
        const missingLocalCreatures = localUserCreatures.filter(creature => !firebaseCreatureIds.has(creature.id));

        const allUserCreatures = [...mergedUserCreatures, ...missingLocalCreatures];

        // Update the store with merged creatures
        useCreatureStore?.setState({
          creatures: [...builtInCreatures, ...allUserCreatures]
        });

        // Mark loaded creatures as already-synced so they are not immediately
        // re-written (and so their local edits are detected afterwards).
        const previouslySynced = syncedCreaturesRef.current;
        const cloudById = new Map(firebaseCreatures.map(c => [c.id, c]));
        syncedCreaturesRef.current = new Map(allUserCreatures.map(c => [c.id,
          removalPending(existingUserCreaturesMap.get(c.id) || c, previouslySynced, pendingIds)
            ? (previouslySynced.get(c.id) ?? JSON.stringify(cloudById.get(c.id) || c)) : JSON.stringify(c)]));

        console.log(`📂 Loaded ${firebaseCreatures.length} user creatures from Firebase, merged with ${missingLocalCreatures.length} local creatures`);
      }
    } catch (error) {
      console.error('Failed to load user creatures from Firebase:', error);
    }
  }, [user, isUserCreatedCreature, useCreatureStore]);

  /**
   * Sync newly created creatures to Firebase
   */
  const syncNewCreatures = useCallback(async () => {
    if (!user || user.isGuest) {
      return;
    }

    const userCreatures = getUserCreatures();

    // Save any creature whose content changed since the last successful sync.
    const pending = userCreatures.filter(creature =>
      syncedCreaturesRef.current.get(creature.id) !== JSON.stringify(creature)
    );

    if (pending.length > 0) {
      console.log(`🔄 Syncing ${pending.length} changed creature(s) to Firebase`);

      for (const creature of pending) {
        try {
          // Re-read inside the ordered write so a queued save never carries an older copy than a wizard write just made.
          let sent = creature, removalId;
          const result = await serializeCloudWrite(user.uid, creature.id, () => {
            sent = getUserCreatures().find(c => c.id === creature.id) || creature;
            removalId = sent.authoredAbility === undefined ? pendingRemovals(user.uid).get(sent.id) : undefined;
            return saveCreature({
              ...sent,
              userId: user.uid,
              createdAt: sent.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          });
          if (result?.success) {
            syncedCreaturesRef.current.set(creature.id, JSON.stringify(sent));
            // Confirmed full save of the creature WITHOUT the association: clears only the removal it was started for.
            if (removalId) confirmRemoval(user.uid, creature.id, removalId);
          }
        } catch (error) {
          console.error(`Failed to sync creature ${creature.id}:`, error);
        }
      }
    }

    // Drop tracking for creatures that no longer exist.
    const liveIds = new Set(userCreatures.map(c => c.id));
    for (const key of Array.from(syncedCreaturesRef.current.keys())) {
      if (!liveIds.has(key)) syncedCreaturesRef.current.delete(key);
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
  }, [creatures, user, syncNewCreatures]);

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
