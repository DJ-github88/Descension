import React, { useEffect } from 'react';
import { useSpellLibrary, useSpellLibraryDispatch, libraryActionCreators } from '../../context/SpellLibraryContext';
import { CUSTOM_LIBRARY_SPELLS } from '../../../../data/customSpellLibraryData';
import { transformSpellForCard } from '../../core/utils/spellCardTransformer';

/**
 * Component that loads sample spells into the spell library if it's empty
 */
const SampleSpellsLoader = () => {
  const library = useSpellLibrary();
  const dispatch = useSpellLibraryDispatch();

  useEffect(() => {
    // Only load sample spells if the library is empty
    if (library.spells.length === 0) {
      console.log('Loading sample spells into the library...');

      // Add each sample spell to the library
      CUSTOM_LIBRARY_SPELLS.forEach(spell => {
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
          targetingConfig: {
            targetType: spell.targetingMode || 'single',
            range: spell.range || 30,
            areaType: spell.areaType || 'sphere',
            areaSize: spell.areaSize || 10,
            validTargets: spell.validTargets || ['any']
          },

          // Ensure the spell has proper resource configuration
          resourceCost: {
            mana: spell.resourceCost?.mana || spell.manaCost || 20,
            rage: spell.resourceCost?.rage || 0,
            energy: spell.resourceCost?.energy || 0,
            focus: spell.resourceCost?.focus || 0,
            runic: spell.resourceCost?.runic || 0,
            health: spell.resourceCost?.health || 0,
            stamina: spell.resourceCost?.stamina || 0
          },

          // Ensure the spell has proper cooldown configuration
          cooldownConfig: {
            enabled: spell.cooldownConfig?.enabled || true,
            cooldownRounds: spell.cooldownConfig?.cooldownRounds || spell.cooldown || 0,
            cooldownType: spell.cooldownConfig?.cooldownType || 'rounds',
            charges: spell.cooldownConfig?.charges || spell.charges || 1
          },

          // Ensure the spell has proper damage configuration
          damageConfig: spell.damageConfig || {
            damageType: 'direct',
            elementType: (spell.damageTypes && spell.damageTypes[0]) || 'fire',
            formula: spell.primaryDamage?.dice || '1d6',
            criticalConfig: {
              enabled: true,
              critType: 'dice',
              critMultiplier: 2,
              explodingDice: false
            }
          },

          // Ensure the spell has proper healing configuration
          healingConfig: spell.healingConfig || null,

          // Ensure the spell has proper buff configuration
          buffConfig: spell.buffConfig || null,

          // Ensure the spell has proper debuff configuration
          debuffConfig: spell.debuffConfig || null,

          // Ensure the spell has proper control configuration
          controlConfig: spell.controlConfig || null
        };

        console.log('Adding sample spell to library:', librarySpell.name);
        dispatch(libraryActionCreators.addSpell(librarySpell));
      });

      console.log('Sample spells loaded successfully!');
    }
  }, [library.spells.length, dispatch]);

  // This component doesn't render anything
  return null;
};

export default SampleSpellsLoader;
