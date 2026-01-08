/**
 * Unified Spell Cache Management Utility
 * Consolidates all spell cache clearing functionality into a single, comprehensive utility
 * This forces the application to reload spells from the hardcoded data files
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
  'spell-library-data'
];

/**
 * Clear all spell-related localStorage data
 * This is the primary function for clearing spell cache
 * Consolidates functionality from both clearSpellCache.js and forceSpellReload.js
 */
export const clearAllSpellCache = () => {

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
 * Consolidates functionality from forceSpellReload.js
 */
export const forceSpellLibraryReload = () => {

  // Use the library manager's clear function if available
  try {
    // Try to import and use the library manager's clear function
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

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  window.clearAllSpellCache = clearAllSpellCache;
  window.forceSpellLibraryReload = forceSpellLibraryReload;
  window.checkSpellCacheStatus = checkSpellCacheStatus;
  window.checkSpellCacheVersion = checkSpellCacheVersion;
  window.initializeSpellCache = initializeSpellCache;
}
