/**
 * Unified Spell Cache Management Utility
 * Consolidates all spell cache clearing functionality into a single, complete utility
 * This forces application to reload spells from hardcoded data files
 */

// complete list of all possible spell-related localStorage keys
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

 // Wave A (P5/S2): "spell"/"library" are not deletion authority. Only
 // registry-eligible keys (public caches / session-only state) may be
 // cleared here; authored spell libraries and custom spells are protected.
 let canDelete = () => false;
 try {
  // eslint-disable-next-line global-require
  const { canGenericCleanupDeleteKey } = require('../persistence/cleanupPolicy');
  canDelete = canGenericCleanupDeleteKey;
 } catch (_) {
  return false;
 }

 // Clear known spell storage keys
 SPELL_STORAGE_KEYS.forEach(key => {
  try {
   if (localStorage.getItem(key) && canDelete(key)) {
    localStorage.removeItem(key);
    clearedCount++;
   }
  } catch (error) {
   console.warn(`❌ Failed to clear localStorage key ${key}:`, error);
  }
 });

 // Additional spell/library-named keys still require registry classification.
 const allKeys = Object.keys(localStorage);
 allKeys.forEach(key => {
  if ((key.toLowerCase().includes('spell') || key.toLowerCase().includes('library')) &&
    !SPELL_STORAGE_KEYS.includes(key) &&
    canDelete(key)) {
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
 // Wave A (P5/S2, corrected R1): this utility is an explicit reload helper,
 // not a generic cleanup path. It only performs registry-eligible cache
 // clears; authored spell library data is never discarded here. Raw developer
 // discard is outside application guarantees (devtools).
 return clearAllSpellCache();
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

 // Clear localStorage immediately (registry-gated)
 clearSpellLibraryStorage();

 // Wave A (P5/S2, corrected R1): 'spell-store' is a registered authored
 // family and is NOT deleted here; this helper performs cache clearing only.

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
