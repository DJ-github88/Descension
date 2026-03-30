import React, { useEffect, useState } from 'react';
import { useSpellLibrary, useSpellLibraryDispatch, libraryActionCreators } from '../../context/SpellLibraryContext';
import { cleanSpellLibrary, removeInvalidSpells } from '../../../../utils/spellLibraryCleanup';

/**
 * Component that automatically cleans up the spell library on load
 * Removes invalid spells and fixes formatting issues
 */
const SpellLibraryCleanupLoader = () => {
  const library = useSpellLibrary();
  const dispatch = useSpellLibraryDispatch();
  const [hasCleanedUp, setHasCleanedUp] = useState(false);

  useEffect(() => {
    // Only run cleanup once
    if (hasCleanedUp || library.spells.length === 0) {
      return;
    }

    console.log('Starting spell library cleanup...');
    console.log(`Current spell count: ${library.spells.length}`);

    // Step 1: Remove spells that don't pass wizard validation
    const validSpells = removeInvalidSpells(library.spells);
    console.log(`After validation: ${validSpells.length} spells`);

    // Step 2: Clean up formatting and ensure proper structure
    const cleanedSpells = cleanSpellLibrary(validSpells);
    console.log(`After cleanup: ${cleanedSpells.length} spells`);

    // Step 3: Update the library if changes were made
    if (cleanedSpells.length !== library.spells.length || 
        JSON.stringify(cleanedSpells) !== JSON.stringify(library.spells)) {
      
      console.log('Updating spell library with cleaned spells...');
      
      // Clear the library first
      dispatch(libraryActionCreators.clearLibrary());
      
      // Add cleaned spells back
      cleanedSpells.forEach(spell => {
        dispatch(libraryActionCreators.addSpell(spell));
      });

      console.log('Spell library cleanup completed!');
    } else {
      console.log('No cleanup needed - spell library is already clean');
    }

    setHasCleanedUp(true);
  }, [library.spells, dispatch, hasCleanedUp]);

  // This component doesn't render anything
  return null;
};

export default SpellLibraryCleanupLoader;
