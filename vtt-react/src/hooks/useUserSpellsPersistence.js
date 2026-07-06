/**
 * User Spells Persistence Hook
 *
 * Automatically saves and loads user-created/custom spells to/from Firebase
 * (user_spells collection). Mirrors useUserItemsPersistence / useUserCreaturesPersistence.
 *
 * Architecture note: spells currently live in SpellLibraryContext (a React
 * Context), which is rendered INSIDE PersistenceProvider in the App tree.
 * Therefore this hook cannot be mounted from PersistenceProvider (it would be
 * outside the provider and get the default context). Instead it is mounted via
 * the SpellPersistenceBridge component, placed inside SpellLibraryProvider.
 * This does not conflict with the eventual P3-7 store-consolidation decision;
 * if the canonical store moves to Zustand, this hook can move into
 * PersistenceProvider alongside the other library hooks.
 */

import { useEffect, useCallback, useRef } from 'react';
import { saveUserSpell, loadUserSpells } from '../services/firebase/userSpellService';
import { useSpellLibrary, useSpellLibraryDispatch } from '../components/spellcrafting-wizard/context/SpellLibraryContext';

const AUTO_SAVE_DELAY = 3000; // 3 seconds debounce

// Throttle storage-full notices so the background sync loop doesn't spam a
// notification every tick while the user is over quota.
let lastStorageFullNoticeAt = 0;
const STORAGE_FULL_NOTICE_COOLDOWN = 60_000;

/**
 * Identify user-created spells (exclude built-in/default spells).
 * Mirrors the isUserCreatedItem filter in useUserItemsPersistence.
 */
const isUserSpell = (spell) => {
  return spell.isCustom === true || (spell.source && spell.source !== 'built-in');
};

/**
 * Custom hook to manage persistence of user-created custom spells.
 * Must be called from within a SpellLibraryProvider.
 */
export const useUserSpellsPersistence = () => {
  const useAuthStore = require('../store/authStore').default;
  const { user } = useAuthStore();
  const library = useSpellLibrary();
  const dispatch = useSpellLibraryDispatch();
  const saveTimerRef = useRef(null);
  // Keep a ref to the latest spells so the beforeunload/visibilitychange
  // listeners (which close over stale state) always read current data.
  const spellsRef = useRef(library.spells);
  spellsRef.current = library.spells;

  const getUserSpells = useCallback(() => {
    return (spellsRef.current || []).filter(isUserSpell);
  }, []);

  /**
   * Load user-created spells from Firebase and merge any missing ones into
   * the local library (non-destructive: never removes local-only spells).
   */
  const loadSpells = useCallback(async () => {
    if (!user || user.isGuest) {
      return;
    }

    try {
      const firebaseSpells = await loadUserSpells(user.uid);

      if (!firebaseSpells || firebaseSpells.length === 0) {
        return;
      }

      const localIds = new Set((spellsRef.current || []).map(s => s.id));
      let added = 0;

      firebaseSpells.forEach(spell => {
        // ADD_SPELL_DIRECT adds without mutating the id/dates (see SpellLibraryContext reducer).
        if (!localIds.has(spell.id)) {
          dispatch({ type: 'ADD_SPELL_DIRECT', payload: spell });
          localIds.add(spell.id);
          added++;
        }
      });

      if (added > 0) {
        console.log(`📖 Loaded ${firebaseSpells.length} spells from Firebase, merged ${added} new into library`);
      }
    } catch (error) {
      console.error('Failed to load user spells from Firebase:', error);
    }
  }, [user, dispatch]);

  /**
   * Sync locally-created spells that haven't been persisted yet to Firebase.
   */
  const syncNewSpells = useCallback(async () => {
    if (!user || user.isGuest) {
      return { synced: 0 };
    }

    const userSpells = getUserSpells();

    // Spells without a userId field haven't been synced to Firebase yet.
    const unsynced = userSpells.filter(spell => !spell.userId);

    if (unsynced.length === 0) {
      return { synced: 0 };
    }

    let syncedCount = 0;
    for (const spell of unsynced) {
      try {
        const result = await saveUserSpell(user.uid, spell);

        // Over-quota: every subsequent new spell will also be blocked, so stop
        // the loop and surface a single throttled notice.
        if (result?.reason === 'storage_full') {
          const now = Date.now();
          if (now - lastStorageFullNoticeAt > STORAGE_FULL_NOTICE_COOLDOWN) {
            lastStorageFullNoticeAt = now;
            const { default: useNotificationStore } = await import('../store/notificationStore');
            useNotificationStore.getState().showWarning(
              'Cloud storage is full. New spells are saved locally only. Upgrade your plan or remove unused content to sync.',
              { title: 'Storage Full' }
            );
          }
          break;
        }

        syncedCount++;
      } catch (error) {
        console.error(`Failed to sync spell ${spell.id}:`, error);
      }
    }

    if (syncedCount > 0) {
      console.log(`🔮 Synced ${syncedCount} spells to Firebase`);
    }
    return { synced: syncedCount };
  }, [user, getUserSpells]);

  // Load spells when user becomes authenticated (non-guest)
  useEffect(() => {
    if (user && !user.isGuest) {
      loadSpells();
    }
  }, [user, loadSpells]);

  // Debounced auto-sync when the spell library changes
  useEffect(() => {
    if (!user || user.isGuest) {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      return;
    }

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      syncNewSpells();
    }, AUTO_SAVE_DELAY);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [library.spells, user, syncNewSpells]);

  // Emergency save on page unload / backgrounding (best-effort, fire-and-forget)
  useEffect(() => {
    if (!user || user.isGuest) {
      return;
    }

    const handler = () => {
      // Fire and forget: beforeunload cannot reliably await async work.
      try {
        syncNewSpells();
      } catch (e) {
        console.error('Emergency spell save failed:', e);
      }
    };

    window.addEventListener('beforeunload', handler);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') handler();
    });

    return () => {
      window.removeEventListener('beforeunload', handler);
    };
  }, [user, syncNewSpells]);

  return {
    isAuthenticated: !!user && !user.isGuest,
    loadSpells,
    syncNewSpells,
    getUserSpells
  };
};

/**
 * Bridge component: mounts the persistence hook from within the
 * SpellLibraryProvider tree (where it can access the spell context).
 * Renders nothing. Place inside <SpellLibraryProvider>.
 */
export const SpellPersistenceBridge = () => {
  useUserSpellsPersistence();
  return null;
};
