/**
 * Unified Spell Cache Management Utility
 * Consolidates all spell cache clearing functionality into a single, comprehensive utility
 * This forces application to reload spells from hardcoded data files
 */

// Comprehensive list of all possible spell-related localStorage keys
const SPELL_STORAGE_KEYS = [
  'spell-library-storage',
  'spell-library',
  'spellbook-storage',
  'spell-store',
  'spellLibrary',
  'spellbook',
  'spells',
  'spell_library_data',
  'spell-library-data',
  'spellbook_state',
  'spell_cache_version'
];

/**
 * Clear all spell-related localStorage data
 * This is the primary function for clearing spell cache
 * Consolidated from both clearSpellCache.js and clearSpellLibrary.js
 */
export const clearSpellLibraryStorage = () => {
  let clearedCount = 0;

  // Clear known spell storage keys
  SPELL_STORAGE_KEYS.forEach(key => {
    try {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        clearedCount++;
      }
    } catch (error) {
      console.warn(`❌ Failed to clear localStorage key ${key}:`, error);
    }
  });

  // Clear any additional keys that might contain spell data
  const allKeys = Object.keys(localStorage);
  allKeys.forEach(key => {
    if ((key.toLowerCase().includes('spell') || key.toLowerCase().includes('library')) &&
        !SPELL_STORAGE_KEYS.includes(key)) {
      try {
        localStorage.removeItem(key);
        clearedCount++;
      } catch (error) {
        console.warn(`❌ Failed to clear localStorage key ${key}:`, error);
      }
    }
  });

  return clearedCount > 0;
};

export const clearAllSpellCache = clearSpellLibraryStorage;

// Function to check current spell count in localStorage
export const checkSpellCacheStatus = () => {
  const spellStorageKeys = [
    'spell-library-storage',
    'spell-library',
    'spellbook-storage',
    'spell-store'
  ];

  spellStorageKeys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        // Check spell cache status
      } catch (error) {
        // Not JSON data
      }
    } else {
      // Empty cache
    }
  });
};

/**
 * Check if spell cache needs to be cleared based on version
 */
export const checkSpellCacheVersion = () => {
  const currentVersion = '1.2.0'; // Updated for spell formula and saving throw fixes
  const cachedVersion = localStorage.getItem('spell-cache-version');

  if (cachedVersion !== currentVersion) {
    clearAllSpellCache();
    localStorage.setItem('spell-cache-version', currentVersion);
    return true;
  }

  return false;
};

/**
 * Force a complete spell library reload
 * This is the most aggressive cache clearing option
 * Consolidated from forceSpellReload.js
 */
export const forceSpellLibraryReload = () => {
  // Use library manager's clear function if available
  try {
    // Try to import and use library manager's clear function
    import('../components/spellcrafting-wizard/core/utils/libraryManager')
      .then(({ clearLibraryFromStorage }) => {
        clearLibraryFromStorage();
      })
      .catch(error => {
        console.warn('❌ Could not use libraryManager clear:', error);
      });
  } catch (error) {
    console.warn('❌ Error importing libraryManager:', error);
  }

  // Clear all spell cache
  const cleared = clearAllSpellCache();

  return cleared;
};

/**
 * Initialize spell cache management
 * Call this on app startup to ensure fresh spell data
 */
export const initializeSpellCache = () => {
  // Check if cache needs to be cleared due to version change
  const cacheCleared = checkSpellCacheVersion();

  if (cacheCleared) {
  }

  return cacheCleared;
};

/**
 * Initialize clean spell library
 * Call this on app startup to ensure users start fresh
 * Migrated from clearSpellLibrary.js for consolidation
 */
export const initializeCleanSpellLibrary = () => {
  // Check if we need to clear old spell data
  const hasOldSpells = localStorage.getItem('spell_library_data');

  if (hasOldSpells) {
    try {
      const libraryData = JSON.parse(hasOldSpells);

      // If library has ANY spells, clear it completely
      // We're transitioning to a user-only spell system
      if (libraryData?.data?.spells?.length > 0) {
        clearSpellLibraryStorage();
        return true;
      }
    } catch (error) {
      console.error('Error checking old spell library:', error);
      // If there's an error parsing, clear it anyway
      clearSpellLibraryStorage();
      return true;
    }
  }

  return false;
};

/**
 * Force clear all spell data (for development/testing)
 */
export const forceCleanSpellLibrary = () => {

  // Clear localStorage
  clearSpellLibraryStorage();

  // Clear any cached data
  if (window.spellLibraryCache) {
    window.spellLibraryCache.clear();
  }

  // Dispatch a custom event to notify components
  window.dispatchEvent(new CustomEvent('spellLibraryCleared'));

  return true;
};

/**
 * Immediate spell library clear - call this right now to clear everything
 */
export const clearSpellLibraryNow = () => {

  // Clear localStorage immediately
  clearSpellLibraryStorage();

  // Also clear spell-store specifically (Zustand store)
  try {
    // Clear spell-store persistence
    localStorage.removeItem('spell-store');
  } catch (error) {
    console.warn('❌ Could not clear spell-store:', error);
  }

  // Clear any cached data
  if (window.spellLibraryCache) {
    window.spellLibraryCache.clear();
  }

  // Clear any React state caches
  if (window.spellStoreCache) {
    window.spellStoreCache.clear();
  }

  // Dispatch events to notify all components
  window.dispatchEvent(new CustomEvent('spellLibraryCleared'));
  window.dispatchEvent(new CustomEvent('forceSpellLibraryReload'));

  return true;
};

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  window.clearAllSpellCache = clearAllSpellCache;
  window.forceSpellLibraryReload = forceSpellLibraryReload;
  window.checkSpellCacheStatus = checkSpellCacheStatus;
  window.checkSpellCacheVersion = checkSpellCacheVersion;
  window.initializeSpellCache = initializeSpellCache;
  window.clearSpellLibrary = forceCleanSpellLibrary;
  window.clearSpellLibraryNow = clearSpellLibraryNow;
  window.initializeCleanSpellLibrary = initializeCleanSpellLibrary;
}
