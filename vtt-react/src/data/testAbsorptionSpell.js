// Test spell to demonstrate improved absorption system
export const testAbsorptionSpell = {
  id: 'test_absorption_spell',
  name: 'Arcane Shield',
  description: 'Creates a magical barrier that absorbs incoming damage',
  school: 'Abjuration',
  level: 2,
  castingTime: 'Action',
  range: 'Self',
  duration: '10 minutes',
  components: ['V', 'S'],
  
  // Buff configuration with various absorption types
  buffConfig: {
    duration: 1,
    durationValue: 1,
    durationType: 'rounds',
    durationUnit: 'rounds',
    restType: 'short',
    canBeDispelled: true,
    concentrationRequired: false,
    stackingRule: 'replace',
    maxStacks: 1,
    magnitude: 2,
    magnitudeType: 'flat',
    
    // Different types of absorption shields
    statModifiers: [
      {
        id: 'damage_absorption',
        name: 'All Damage Absorption',
        icon: 'spell_arcane_arcaneshield',
        magnitude: '2d6+3',  // Dice-based absorption
        magnitudeType: 'formula',
        resistanceType: 'absorption',
        resistanceLevel: '2d6+3 points'
      },
      {
        id: 'fire_absorption',
        name: 'Fire Absorption',
        icon: 'spell_fire_firearmor',
        magnitude: 25,  // Flat absorption
        magnitudeType: 'flat',
        resistanceType: 'absorption',
        resistanceLevel: '25 points'
      },
      {
        id: 'physical_absorption',
        name: 'Physical Absorption',
        icon: 'inv_shield_05',
        magnitude: '1d20',  // Variable dice absorption
        magnitudeType: 'formula',
        resistanceType: 'absorption',
        resistanceLevel: '1d20 points'
      }
    ],
    
    statusEffects: [],
    isProgressive: false,
    progressiveStages: []
  },
  
  // Additional spell properties
  effectTypes: ['defense', 'buff'],
  targetType: 'self',
  areaOfEffect: null,
  savingThrow: null,
  spellResistance: false,
  
  // Metadata
  source: 'Test Spells',
  page: 'N/A',
  shortDescription: 'Magical absorption shields',
  
  // Spell card display
  cardStyle: 'pathfinder',
  rarity: 'common'
};

// Test spell with custom absorption formula
export const testCustomAbsorptionSpell = {
  id: 'test_custom_absorption_spell',
  name: 'Adaptive Barrier',
  description: 'Creates a barrier that adapts to the caster\'s constitution',
  school: 'Abjuration',
  level: 3,
  castingTime: 'Action',
  range: 'Self',
  duration: '1 hour',
  components: ['V', 'S', 'M'],
  
  // Buff configuration with custom formula absorption
  buffConfig: {
    duration: 1,
    durationValue: 1,
    durationType: 'rounds',
    durationUnit: 'rounds',
    restType: 'short',
    canBeDispelled: true,
    concentrationRequired: false,
    stackingRule: 'replace',
    maxStacks: 1,
    magnitude: 2,
    magnitudeType: 'flat',
    
    // Custom formula absorption
    statModifiers: [
      {
        id: 'damage_absorption',
        name: 'All Damage Absorption',
        icon: 'spell_arcane_arcaneshield',
        magnitude: '1d8+CON',  // Custom formula with stat modifier
        magnitudeType: 'formula',
        resistanceType: 'absorption',
        resistanceLevel: 'custom formula',
        customFormula: '1d8+CON'
      }
    ],
    
    statusEffects: [],
    isProgressive: false,
    progressiveStages: []
  },
  
  // Additional spell properties
  effectTypes: ['defense', 'buff'],
  targetType: 'self',
  areaOfEffect: null,
  savingThrow: null,
  spellResistance: false,
  
  // Metadata
  source: 'Test Spells',
  page: 'N/A',
  shortDescription: 'Adaptive absorption shield',
  
  // Spell card display
  cardStyle: 'pathfinder',
  rarity: 'uncommon'
};
