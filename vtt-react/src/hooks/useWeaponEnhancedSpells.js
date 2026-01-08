/**
 * Hook for Weapon-Enhanced Spells
 * 
 * Provides spells with dynamic weapon integration, particularly for the Attack spell.
 * Automatically updates when equipment changes.
 */

import { useState, useEffect, useMemo } from 'react';
import useCharacterStore from '../store/characterStore';
import { ALL_GENERAL_SPELLS } from '../data/generalSpellsData';
import { UNIVERSAL_COMBAT_SPELLS } from '../data/universalCombatSpells';
import { 
  createWeaponAttackSpell, 
  getAllWeaponAttackSpells, 
  enhanceSpellWithWeaponData 
} from '../utils/weaponIntegration';

/**
 * Hook that provides general spells with weapon integration
 * @returns {Object} Object containing enhanced spells and utility functions
 */
export const useWeaponEnhancedSpells = () => {
  const { equipment } = useCharacterStore();
  const [lastEquipmentUpdate, setLastEquipmentUpdate] = useState(Date.now());
  
  // Track equipment changes to trigger updates
  useEffect(() => {
    setLastEquipmentUpdate(Date.now());
  }, [equipment]);
  
  // Create enhanced spells with weapon integration
  const enhancedSpells = useMemo(() => {
    // Start with universal combat spells (base actions and reactions)
    const spells = [...UNIVERSAL_COMBAT_SPELLS];

    // Add general spells (which includes the generic Attack spell)
    spells.push(...ALL_GENERAL_SPELLS);

    // Debug: Check if Arcane Counterstrike has triggerConfig
    const arcaneCounterstrike = spells.find(s => s.name === 'TEST: Arcane Counterstrike');
    if (arcaneCounterstrike) {
      console.log('🔍 Arcane Counterstrike in useWeaponEnhancedSpells:', {
        name: arcaneCounterstrike.name,
        hasTriggerConfig: !!arcaneCounterstrike.triggerConfig,
        triggerConfig: arcaneCounterstrike.triggerConfig
      });
    }

    // Find and replace the universal_attack spell with weapon-enhanced versions
    // Note: The generic "Attack" spell has been removed from ALL_GENERAL_SPELLS
    const attackSpellIndex = spells.findIndex(spell => 
      spell.id === 'universal_attack'
    );

    if (attackSpellIndex !== -1) {
      // Remove the universal_attack spell
      spells.splice(attackSpellIndex, 1);

      // Add weapon-specific attack spells (includes Attack (Unarmed) as fallback)
      const weaponAttacks = getAllWeaponAttackSpells();
      spells.splice(attackSpellIndex, 0, ...weaponAttacks);
    }

    // Enhance all weapon-dependent spells (like Riposte) with weapon data
    const enhancedSpellsList = spells.map(spell => {
      if (spell.damageConfig?.weaponDependent === true && spell.id !== 'universal_attack') {
        return enhanceSpellWithWeaponData(spell, 'mainHand');
      }
      return spell;
    });

    return enhancedSpellsList;
  }, [equipment, lastEquipmentUpdate]);
  
  // Get the primary attack spell (main hand weapon)
  const primaryAttackSpell = useMemo(() => {
    return createWeaponAttackSpell('mainHand');
  }, [equipment]);
  
  // Get all available attack options
  const allAttackSpells = useMemo(() => {
    return getAllWeaponAttackSpells();
  }, [equipment]);
  
  // Check if character has weapons equipped
  const hasWeaponsEquipped = useMemo(() => {
    return !!(equipment?.mainHand || equipment?.offHand || equipment?.ranged);
  }, [equipment]);
  
  // Get weapon summary for UI display
  const weaponSummary = useMemo(() => {
    const summary = {
      mainHand: null,
      offHand: null,
      ranged: null
    };
    
    if (equipment?.mainHand) {
      const weapon = equipment.mainHand;
      summary.mainHand = {
        name: weapon.name,
        damage: weapon.weaponStats?.baseDamage ? 
          `${weapon.weaponStats.baseDamage.diceCount}d${weapon.weaponStats.baseDamage.diceType}` : '1d4',
        damageType: weapon.weaponStats?.baseDamage?.damageType || 'bludgeoning',
        type: weapon.subtype || 'UNKNOWN'
      };
    }
    
    if (equipment?.offHand && equipment?.mainHand?.weaponSlot !== 'TWO_HANDED') {
      const weapon = equipment.offHand;
      summary.offHand = {
        name: weapon.name,
        damage: weapon.weaponStats?.baseDamage ? 
          `${weapon.weaponStats.baseDamage.diceCount}d${weapon.weaponStats.baseDamage.diceType}` : '1d4',
        damageType: weapon.weaponStats?.baseDamage?.damageType || 'bludgeoning',
        type: weapon.subtype || 'UNKNOWN'
      };
    }
    
    if (equipment?.ranged) {
      const weapon = equipment.ranged;
      summary.ranged = {
        name: weapon.name,
        damage: weapon.weaponStats?.baseDamage ? 
          `${weapon.weaponStats.baseDamage.diceCount}d${weapon.weaponStats.baseDamage.diceType}` : '1d4',
        damageType: weapon.weaponStats?.baseDamage?.damageType || 'piercing',
        type: weapon.subtype || 'UNKNOWN'
      };
    }
    
    return summary;
  }, [equipment]);
  
  // Function to get a specific weapon attack spell
  const getWeaponAttackSpell = (weaponSlot = 'mainHand') => {
    return createWeaponAttackSpell(weaponSlot);
  };
  
  // Function to enhance any spell with weapon data
  const enhanceSpellWithWeapon = (spell, weaponSlot = 'mainHand') => {
    return enhanceSpellWithWeaponData(spell, weaponSlot);
  };
  
  // Function to check if a spell is weapon-dependent
  const isWeaponDependentSpell = (spell) => {
    return spell && (
      spell.name?.startsWith('Attack (') || // Matches "Attack (Unarmed)", "Attack (Weapon Name)", etc.
      spell.damageConfig?.weaponDependent === true ||
      spell.tags?.includes('weapon')
    );
  };
  
  // Function to get spell with current weapon context
  const getSpellWithWeaponContext = (spellId) => {
    const spell = enhancedSpells.find(s => s.id === spellId);
    if (!spell) return null;
    
    if (isWeaponDependentSpell(spell)) {
      return enhanceSpellWithWeapon(spell);
    }
    
    return spell;
  };
  
  return {
    // Enhanced spell list with weapon integration
    enhancedSpells,
    
    // Attack-specific spells
    primaryAttackSpell,
    allAttackSpells,
    
    // Weapon information
    hasWeaponsEquipped,
    weaponSummary,
    
    // Utility functions
    getWeaponAttackSpell,
    enhanceSpellWithWeapon,
    isWeaponDependentSpell,
    getSpellWithWeaponContext,
    
    // Update trigger for components that need to re-render
    lastEquipmentUpdate
  };
};

/**
 * Hook specifically for attack spells
 * @returns {Object} Object containing attack-related spells and data
 */
export const useAttackSpells = () => {
  const { 
    primaryAttackSpell, 
    allAttackSpells, 
    hasWeaponsEquipped, 
    weaponSummary 
  } = useWeaponEnhancedSpells();
  
  return {
    primaryAttack: primaryAttackSpell,
    allAttacks: allAttackSpells,
    hasWeapons: hasWeaponsEquipped,
    weapons: weaponSummary
  };
};

/**
 * Hook for getting weapon-enhanced general spells for a specific category
 * @param {string} categoryId - Category ID to filter by
 * @returns {Array} Filtered and enhanced spells
 */
export const useGeneralSpellsByCategory = (categoryId = 'general_actions') => {
  const { enhancedSpells } = useWeaponEnhancedSpells();
  
  return useMemo(() => {
    return enhancedSpells.filter(spell => 
      spell.categoryIds && spell.categoryIds.includes(categoryId)
    );
  }, [enhancedSpells, categoryId]);
};

export default useWeaponEnhancedSpells;
