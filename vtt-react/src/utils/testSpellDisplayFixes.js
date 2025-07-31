/**
 * Test Spell Display Fixes
 * 
 * This script tests that our spell display fixes are working correctly.
 * Run this in the browser console after clearing cache and reloading.
 */

import { LIBRARY_SPELLS } from '../data/spellLibraryData';

export const testSpellDisplayFixes = () => {
  // Testing spell display fixes

  // Test 1: Blade Dance - Should show area targeting
  const bladeDance = LIBRARY_SPELLS.find(s => s.id === 'blade-dance');
  if (bladeDance) {
    // Blade Dance test
  } else {
    // Blade Dance not found
  }
  
  // Test 2: Healing Rain - Should show area and HoT
  const healingRain = LIBRARY_SPELLS.find(s => s.id === 'healing-rain');
  if (healingRain) {
    // Healing Rain test
  } else {
    // Healing Rain not found
  }
  
  // Test 3: Hold Person - Should show control mechanics
  const holdPerson = LIBRARY_SPELLS.find(s => s.id === 'hold-person');
  if (holdPerson) {
    // Hold Person test
  } else {
    // Hold Person not found
  }
  
  // Test 4: Slow - Should show debuff mechanics
  const slow = LIBRARY_SPELLS.find(s => s.id === 'slow');
  if (slow) {
    // Slow test
  } else {
    // Slow not found
  }
  
  // Test 5: Check for inappropriate damage on buff spells
  const buffSpells = LIBRARY_SPELLS.filter(s =>
    s.effectTypes?.includes('buff') && !s.effectTypes?.includes('damage')
  );

  let inappropriateDamage = 0;
  buffSpells.forEach(spell => {
    if (spell.damageConfig || spell.primaryDamage || spell.damageTypes?.length > 0) {
      inappropriateDamage++;
    }
  });

  // Buff spell damage check completed
  
  // Test 6: Check stat name compliance
  const incorrectStats = [];
  LIBRARY_SPELLS.forEach(spell => {
    const spellString = JSON.stringify(spell);
    if (spellString.includes('armor_class') || spellString.includes('dexterity') ||
        spellString.includes('wisdom') || spellString.includes('armorClassBonus')) {
      incorrectStats.push(spell.name);
    }
  });

  // Stat name compliance check completed

  // Spell display fix test complete
  
  return {
    bladeDance: !!bladeDance?.targetingConfig?.targetingType,
    healingRain: !!healingRain?.targetingConfig?.range,
    holdPerson: !!holdPerson?.controlConfig?.savingThrowType,
    slow: !!slow?.debuffConfig?.savingThrowType,
    buffSpellsClean: inappropriateDamage === 0,
    statNamesCorrect: incorrectStats.length === 0
  };
};

// Auto-run if in browser
if (typeof window !== 'undefined') {
  window.testSpellDisplayFixes = testSpellDisplayFixes;
}

export default testSpellDisplayFixes;
