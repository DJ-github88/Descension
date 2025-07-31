/**
 * Force Spell Library Reload
 * 
 * This utility forces the application to reload spells from the data files
 * by clearing all localStorage cache and forcing a fresh load.
 */

import { clearLibraryFromStorage } from '../components/spellcrafting-wizard/core/utils/libraryManager';

export const forceSpellLibraryReload = () => {
  console.log('🔄 FORCING SPELL LIBRARY RELOAD...');
  
  // Step 1: Clear all spell-related localStorage
  const spellStorageKeys = [
    'spell_library_data',
    'spell-library-storage',
    'spell-library',
    'spellbook-storage', 
    'spell-store',
    'spellLibrary',
    'spellbook',
    'spells'
  ];
  
  spellStorageKeys.forEach(key => {
    try {
      localStorage.removeItem(key);
      console.log(`✅ Cleared localStorage key: ${key}`);
    } catch (error) {
      console.warn(`❌ Failed to clear localStorage key ${key}:`, error);
    }
  });
  
  // Step 2: Clear any keys that might contain spell data
  const allKeys = Object.keys(localStorage);
  allKeys.forEach(key => {
    if (key.toLowerCase().includes('spell') || key.toLowerCase().includes('library')) {
      try {
        localStorage.removeItem(key);
        console.log(`✅ Cleared spell-related localStorage key: ${key}`);
      } catch (error) {
        console.warn(`❌ Failed to clear localStorage key ${key}:`, error);
      }
    }
  });
  
  // Step 3: Use the library manager's clear function
  try {
    clearLibraryFromStorage();
    console.log('✅ Cleared library using libraryManager');
  } catch (error) {
    console.error('❌ Error using libraryManager clear:', error);
  }
  
  console.log('🎉 SPELL CACHE CLEARED - RELOAD THE PAGE TO SEE CHANGES');
  
  return true;
};

// Function to run in browser console
export const runInConsole = () => {
  // Spell library cache clear utility
};

// Auto-run if in browser
if (typeof window !== 'undefined') {
  window.forceSpellLibraryReload = forceSpellLibraryReload;
}

export default forceSpellLibraryReload;
