import React, { useEffect } from 'react';
import { useSpellLibrary, useSpellLibraryDispatch, libraryActionCreators } from '../../../../components/spellcrafting-wizard/context/SpellLibraryContext';
import { CUSTOM_LIBRARY_SPELLS } from '../../../../data/customSpellLibraryData';
import { ADDITIONAL_SPELLS } from '../../../../data/additionalSpells';
import { ADVANCED_SPELLS } from '../../../../data/advancedSpells';
import { transformSpellForCard } from '../../../../components/spellcrafting-wizard/core/utils/spellTransformers';

/**
 * Component that loads ALL spells into the spell library
 * This ensures the creature library has access to all spells
 */
const AllSpellsLoader = () => {
  const library = useSpellLibrary();
  const dispatch = useSpellLibraryDispatch();

  useEffect(() => {
    // Create our clean spell list (40 spells total)
    const CLEAN_SPELLS = [
      ...CUSTOM_LIBRARY_SPELLS,
      ...ADDITIONAL_SPELLS,
      ...ADVANCED_SPELLS
    ];

    // Always log the current state
    console.log(`AllSpellsLoader: Current spells in library: ${library.spells.length}`);
    console.log(`AllSpellsLoader: Available clean spells: ${CLEAN_SPELLS.length}`);

    // Disabled: No longer auto-loading spells for creature wizard
    // Users should create their own spells or download from community
    if (false && library.spells.length < CLEAN_SPELLS.length) {
      console.log('Auto-loading spells is disabled for creature wizard');
      console.log(`Current spells: ${library.spells.length}, Clean spells: ${CLEAN_SPELLS.length}`);

      // Create a map of existing spell IDs for quick lookup
      const existingSpellIds = new Set(library.spells.map(spell => spell.id));

      // Add each clean spell to the library if it doesn't already exist
      CLEAN_SPELLS.forEach(spell => {
        // Skip if this spell ID already exists
        if (existingSpellIds.has(spell.id)) {
          return;
        }

        // Transform the spell data to match the format expected by LibraryStyleSpellCard
        const transformedSpell = transformSpellForCard(spell);

        // Add additional properties needed for the library
        const librarySpell = {
          ...transformedSpell,
          // Ensure required properties are present
          id: spell.id || `spell-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          dateCreated: spell.dateCreated || new Date().toISOString(),
          lastModified: spell.lastModified || new Date().toISOString(),

          // Ensure the spell has a proper name and description
          name: spell.name || 'Unnamed Spell',
          description: spell.description || 'No description available.',

          // Ensure the spell has a proper icon
          icon: spell.icon || 'spell_holy_holybolt',

          // Ensure the spell has proper tags
          tags: spell.tags || [],

          // Ensure the spell has proper effect types
          effectType: spell.effectType || 'damage',
          effectTypes: spell.effectTypes || [spell.effectType || 'damage'],

          // Ensure the spell has proper damage types
          damageTypes: spell.damageTypes || [],

          // Ensure the spell has proper targeting configuration
          targetingConfig: spell.targetingConfig || {
            targetType: spell.targetingMode || 'single',
            range: spell.range || 30,
            areaType: spell.areaType || 'sphere',
            areaSize: spell.areaSize || 10,
            validTargets: spell.validTargets || ['any']
          },

          // Ensure the spell has proper resource configuration
          resourceCost: spell.resourceCost || {
            mana: spell.manaCost || 20,
            rage: 0,
            energy: 0,
            focus: 0,
            runic: 0,
            health: 0,
            stamina: 0
          },

          // Ensure the spell has proper cooldown configuration
          cooldownConfig: spell.cooldownConfig || {
            enabled: true,
            cooldownRounds: spell.cooldown || 0,
            cooldownType: 'rounds',
            charges: spell.charges || 1
          }
        };

        console.log('Adding spell to library:', librarySpell.name);
        dispatch(libraryActionCreators.addSpell(librarySpell));
      });

      console.log('Clean spells loaded successfully!');
    }
  }, [library.spells.length, dispatch]);

  // This component doesn't render anything
  return null;
};

export default AllSpellsLoader;
