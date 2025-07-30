/**
 * Test script to verify debuff effects formatting on spell cards
 */

import { formatDebuffEffects } from './components/spellcrafting-wizard/core/utils/formatSpellEffects';
import { testDebuffSpell } from './data/testDebuffSpell';

// Test spell with comprehensive debuff configuration
const testSpell = {
  id: 'test-debuff-formatting',
  name: 'Test Debuff Spell',
  description: 'A test spell to verify debuff effects formatting',
  
  debuffConfig: {
    durationType: 'turns',
    durationValue: 5,
    durationUnit: 'rounds',
    concentrationRequired: true,
    savingThrow: 'constitution',
    difficultyClass: 15,
    stackingRule: 'cumulative',
    maxStacks: 3,
    canBeDispelled: true,
    
    // Stat penalties
    statPenalties: [
      {
        id: 'strength',
        name: 'Strength',
        magnitude: -3,
        magnitudeType: 'flat'
      },
      {
        id: 'agility',
        name: 'Agility',
        magnitude: -25,
        magnitudeType: 'percentage'
      },
      {
        id: 'spirit',
        name: 'Spirit',
        magnitude: '1d4',
        magnitudeType: 'dice'
      }
    ],
    
    // Status effects
    statusEffects: [
      {
        id: 'frightened',
        name: 'Frightened',
        level: 'major',
        option: 'terrified'
      },
      {
        id: 'poisoned',
        name: 'Poisoned',
        level: 'moderate',
        option: 'weakening'
      },
      {
        id: 'stunned',
        name: 'Stunned',
        level: 'minor',
        option: 'dazed'
      }
    ]
  }
};

// Test different duration types
const testSpellPermanent = {
  ...testSpell,
  debuffConfig: {
    ...testSpell.debuffConfig,
    durationType: 'permanent',
    canBeDispelled: true
  }
};

const testSpellRest = {
  ...testSpell,
  debuffConfig: {
    ...testSpell.debuffConfig,
    durationType: 'rest',
    restType: 'long'
  }
};

// Function to test debuff formatting
export const testDebuffFormatting = () => {
  console.log('=== TESTING DEBUFF EFFECTS FORMATTING ===\n');
  
  // Test 1: Basic debuff with stat penalties and status effects
  console.log('Test 1: Basic debuff with stat penalties and status effects');
  const effects1 = formatDebuffEffects(testSpell);
  console.log('Formatted effects:', effects1);
  console.log('Expected: Strength reduction, Agility percentage reduction, Spirit dice reduction, status effects, duration, concentration, saving throw, stacking rules');
  console.log('---\n');
  
  // Test 2: Permanent debuff
  console.log('Test 2: Permanent debuff');
  const effects2 = formatDebuffEffects(testSpellPermanent);
  console.log('Formatted effects:', effects2);
  console.log('Expected: Same effects but with "permanent (dispellable)" duration');
  console.log('---\n');
  
  // Test 3: Rest-based debuff
  console.log('Test 3: Rest-based debuff');
  const effects3 = formatDebuffEffects(testSpellRest);
  console.log('Formatted effects:', effects3);
  console.log('Expected: Same effects but with "until long rest" duration');
  console.log('---\n');
  
  // Test 4: Using the comprehensive test spell from data
  console.log('Test 4: Comprehensive test spell from data');
  const effects4 = formatDebuffEffects(testDebuffSpell);
  console.log('Formatted effects:', effects4);
  console.log('Expected: Multiple status effects with proper formatting');
  console.log('---\n');
  
  // Test 5: Empty debuff config
  console.log('Test 5: Empty debuff config');
  const effects5 = formatDebuffEffects({ debuffConfig: {} });
  console.log('Formatted effects:', effects5);
  console.log('Expected: Empty array');
  console.log('---\n');
  
  // Test 6: No debuff config
  console.log('Test 6: No debuff config');
  const effects6 = formatDebuffEffects({ name: 'Test Spell' });
  console.log('Formatted effects:', effects6);
  console.log('Expected: Empty array');
  console.log('---\n');
  
  console.log('=== DEBUFF FORMATTING TESTS COMPLETE ===');
  
  return {
    basicDebuff: effects1,
    permanentDebuff: effects2,
    restDebuff: effects3,
    comprehensiveDebuff: effects4,
    emptyDebuff: effects5,
    noDebuff: effects6
  };
};

// Auto-run if in browser
if (typeof window !== 'undefined') {
  window.testDebuffFormatting = testDebuffFormatting;
  console.log('🧪 testDebuffFormatting() function available in console');
}

export default testDebuffFormatting;
