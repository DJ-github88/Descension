/**
 * Utility to clear all spell-related localStorage cache
 * This forces the application to reload spells from the hardcoded data files
 */

export const clearAllSpellCache = () => {
  // List of all possible localStorage keys related to spells
  const spellStorageKeys = [
    'spell-library-storage',
    'spell-library',
    'spellbook-storage',
    'spell-store',
    'spellLibrary',
    'spellbook',
    'spells'
  ];

  // Clear each key
  spellStorageKeys.forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      // Failed to clear localStorage key
    }
  });

  // Also clear any keys that might contain spell data
  const allKeys = Object.keys(localStorage);
  allKeys.forEach(key => {
    if (key.toLowerCase().includes('spell') || key.toLowerCase().includes('library')) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        // Failed to clear localStorage key
      }
    }
  });

  return true;
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
    console.log(`Spell cache version mismatch. Cached: ${cachedVersion}, Current: ${currentVersion}`);
    clearAllSpellCache();
    localStorage.setItem('spell-cache-version', currentVersion);
    return true;
  }

  return false;
};

/**
 * Initialize spell cache management
 * Call this on app startup to ensure fresh spell data
 */
export const initializeSpellCache = () => {
  // Check if cache needs to be cleared due to version change
  const cacheCleared = checkSpellCacheVersion();

  if (cacheCleared) {
    console.log('Spell cache was cleared due to version update');
  }

  return cacheCleared;
};

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  window.clearAllSpellCache = clearAllSpellCache;
  window.checkSpellCacheStatus = checkSpellCacheStatus;
  window.checkSpellCacheVersion = checkSpellCacheVersion;
  window.initializeSpellCache = initializeSpellCache;
}
