/**
 * Test Summoning Formatter
 * 
 * Quick test to verify that summoning creature resolution works correctly
 */

import { formatSpellForLibrary } from './spellLibraryFormatter';

// Test spell with selectedCreature ID
const testSummoningSpell = {
  id: 'test-summon-elemental',
  name: 'Test Summon Elemental',
  description: 'Test summoning spell',
  spellType: 'ACTION',
  effectTypes: ['summoning'],
  summoningConfig: {
    summonType: 'elemental',
    duration: 600,
    durationUnit: 'seconds',
    selectedCreature: 'fire-elemental', // This should be resolved to full creature object
    summonQuantity: 1,
    concentration: true
  }
};

// Test the formatting
export function testSummoningFormatter() {
  console.log('=== TESTING SUMMONING FORMATTER ===');
  console.log('Original spell:', testSummoningSpell);
  
  const formatted = formatSpellForLibrary(testSummoningSpell);
  
  console.log('Formatted spell:', formatted);
  console.log('Summoning config:', formatted.summoningConfig);
  console.log('Creatures array:', formatted.summoningConfig?.creatures);
  
  // Check if creature was resolved
  if (formatted.summoningConfig?.creatures?.length > 0) {
    const creature = formatted.summoningConfig.creatures[0];
    console.log('✅ SUCCESS: Creature resolved:', creature.name);
    console.log('Creature stats:', creature.stats);
    console.log('Creature config:', creature.config);
  } else {
    console.log('❌ FAILED: Creature not resolved');
  }
  
  return formatted;
}

// Run test if this file is imported
if (typeof window !== 'undefined') {
  window.testSummoningFormatter = testSummoningFormatter;
}

export default testSummoningFormatter;
