/**
 * Clear Spell Library Utility
 * 
 * This utility helps clear the spell library to ensure users start with a clean slate.
 * No more hardcoded spells - users create their own!
 */

/**
 * Clear all spell library data from localStorage
 */
export const clearSpellLibraryStorage = () => {
  try {
    // Clear the main spell library storage
    localStorage.removeItem('spell_library_data');

    // Clear all other spell-related storage keys
    localStorage.removeItem('spellLibraryViewMode');
    localStorage.removeItem('spell_cache_version');
    localStorage.removeItem('spellbook_state');
    localStorage.removeItem('spell-store');
    localStorage.removeItem('spellbook-storage');
    localStorage.removeItem('spell-library-storage');
    localStorage.removeItem('spell-library');
    localStorage.removeItem('spellLibrary');
    localStorage.removeItem('spellbook');
    localStorage.removeItem('spells');
    localStorage.removeItem('spell-library-data');

    console.log('✅ ALL spell library storage cleared - users will start with empty library');
    return true;
  } catch (error) {
    console.error('❌ Failed to clear spell library storage:', error);
    return false;
  }
};

/**
 * Initialize clean spell library
 * Call this on app startup to ensure users start fresh
 */
export const initializeCleanSpellLibrary = () => {
  // Check if we need to clear old spell data
  const hasOldSpells = localStorage.getItem('spell_library_data');

  if (hasOldSpells) {
    try {
      const libraryData = JSON.parse(hasOldSpells);

      // If the library has ANY spells, clear it completely
      // We're transitioning to a user-only spell system
      if (libraryData?.data?.spells?.length > 0) {
        console.log('🧹 Clearing ALL existing spells from library - transitioning to user-only system');
        console.log(`Found ${libraryData.data.spells.length} spells - clearing them all`);
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
  console.log('🔥 FORCE CLEARING ALL SPELL LIBRARY DATA');
  
  // Clear localStorage
  clearSpellLibraryStorage();
  
  // Clear any cached data
  if (window.spellLibraryCache) {
    window.spellLibraryCache.clear();
  }
  
  // Dispatch a custom event to notify components
  window.dispatchEvent(new CustomEvent('spellLibraryCleared'));
  
  console.log('✅ All spell library data cleared - reload page to see empty library');
  return true;
};

/**
 * Immediate spell library clear - call this right now to clear everything
 */
export const clearSpellLibraryNow = () => {
  console.log('🔥 IMMEDIATE SPELL LIBRARY CLEAR - CLEARING ALL SPELL DATA NOW');

  // Clear localStorage immediately
  clearSpellLibraryStorage();

  // Also clear the spell-store specifically (Zustand store)
  try {
    // Clear the spell-store persistence
    localStorage.removeItem('spell-store');
    console.log('✅ Cleared spell-store persistence');
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

  console.log('✅ IMMEDIATE CLEAR COMPLETE - Refresh page to see empty library');
  console.log('📝 Note: If spells still appear, they may be coming from a different source');
  return true;
};

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  window.clearSpellLibrary = forceCleanSpellLibrary;
  window.clearSpellLibraryNow = clearSpellLibraryNow;
}
