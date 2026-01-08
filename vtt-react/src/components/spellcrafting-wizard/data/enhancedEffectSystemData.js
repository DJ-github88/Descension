/**
 * Enhanced Effect System Data
 *
 * This file contains all the constants and utility functions for the enhanced effect system.
 * It serves as a central location for effect types, targeting types, and other related data.
 */

// Effect Types
export const EFFECT_TYPES = [
  'damage',
  'healing',
  'buff',
  'debuff',
  'control',
  'utility',
  'summon',
  'transformation',
  'purification',
  'restoration'
];

// Enhanced Effect Types
export const ENHANCED_EFFECT_TYPES = {
  DAMAGE: 'damage',
  HEALING: 'healing',
  BUFF: 'buff',
  DEBUFF: 'debuff',
  CONTROL: 'control',
  UTILITY: 'utility',
  SUMMON: 'summon',
  TRANSFORMATION: 'transformation',
  PURIFICATION: 'purification',
  RESTORATION: 'restoration'
};

// Targeting Types
export const TARGETING_TYPES = [
  'single',
  'multi',
  'aoe',
  'self',
  'ally',
  'enemy'
];

// Duration Types
export const DURATION_TYPES = [
  'instant',
  'concentration',
  'timed',
  'permanent'
];

// Damage Types (D&D standard)
export const DAMAGE_TYPES = [
  'acid',
  'bludgeoning',
  'cold',
  'fire',
  'force',
  'lightning',
  'necrotic',
  'piercing',
  'poison',
  'psychic',
  'radiant',
  'slashing',
  'thunder'
];

// AOE Shapes
export const AOE_SHAPES = [
  'circle',
  'cone',
  'line',
  'cube',
  'sphere'
];

// Positive Status Effects
export const POSITIVE_STATUS_EFFECTS = [
  'haste',
  'invisibility',
  'regeneration',
  'shield',
  'strength',
  'resistance'
];

// Negative Status Effects
export const NEGATIVE_STATUS_EFFECTS = [
  'slow',
  'stun',
  'poison',
  'blind',
  'silence',
  'weakness'
];

// Combat Stat Modifiers
export const COMBAT_STAT_MODIFIERS = [
  'attack',
  'defense',
  'speed',
  'critical',
  'resistance',
  'recovery'
];

// Utility Effect Types
export const UTILITY_EFFECT_TYPES = [
  'movement',
  'detection',
  'illusion',
  'teleportation',
  'transformation',
  'summoning'
];

// Critical Effect Modifiers
export const CRITICAL_EFFECT_MODIFIERS = [
  'increased_damage',
  'additional_effect',
  'extended_duration',
  'reduced_cost'
];

// Absorption Shield Types
export const ABSORPTION_SHIELD_TYPES = [
  'all_damage',
  'specific_damage',
  'spell_damage',
  'physical_damage'
];

// Reflection Damage Types
export const REFLECTION_DAMAGE_TYPES = [
  'all',
  'spell',
  'physical',
  'specific'
];

// Spell Templates
export const SPELL_TEMPLATES = [
  'offensive',
  'defensive',
  'utility',
  'healing',
  'control',
  'summoning'
];

// Enhanced Effect Types - a collection of all specific effect types
export const ENHANCED_EFFECT_TYPES_DATA = [
  // Damage types (D&D standard)
  { id: 'acid', name: 'Acid', category: 'damage', description: 'Corrosive damage that dissolves materials' },
  { id: 'bludgeoning', name: 'Bludgeoning', category: 'damage', description: 'Blunt force trauma damage' },
  { id: 'cold', name: 'Cold', category: 'damage', description: 'Freezing damage from extreme low temperatures' },
  { id: 'fire', name: 'Fire', category: 'damage', description: 'Burning damage from flames and heat' },
  { id: 'force', name: 'Force', category: 'damage', description: 'Pure magical energy damage' },
  { id: 'lightning', name: 'Lightning', category: 'damage', description: 'Electrical damage from lightning and electricity' },
  { id: 'necrotic', name: 'Necrotic', category: 'damage', description: 'Life-draining damage that withers matter' },
  { id: 'piercing', name: 'Piercing', category: 'damage', description: 'Damage from puncturing and impaling' },
  { id: 'poison', name: 'Poison', category: 'damage', description: 'Toxic damage from venom and toxins' },
  { id: 'psychic', name: 'Psychic', category: 'damage', description: 'Mental damage that affects the mind' },
  { id: 'radiant', name: 'Radiant', category: 'damage', description: 'Divine energy that burns and purifies' },
  { id: 'slashing', name: 'Slashing', category: 'damage', description: 'Damage from cutting and tearing' },
  { id: 'thunder', name: 'Thunder', category: 'damage', description: 'Concussive damage from sound waves' },
  // End of damage types

  // Area shapes
  { id: 'circle', name: 'Circle', category: 'area', description: 'Circular area of effect' },
  { id: 'cone', name: 'Cone', category: 'area', description: 'Conical area of effect' },
  { id: 'line', name: 'Line', category: 'area', description: 'Linear area of effect' },
  { id: 'cube', name: 'Cube', category: 'area', description: 'Cubic area of effect' },
  { id: 'sphere', name: 'Sphere', category: 'area', description: '3D spherical area of effect' },

  // Shield types
  { id: 'absorption', name: 'Absorption', category: 'shield', description: 'Absorbs damage' },
  { id: 'reflection', name: 'Reflection', category: 'shield', description: 'Reflects damage back to attacker' },

  // Stat modifiers
  { id: 'strength', name: 'Strength', category: 'stat', description: 'Modify strength stat' },
  { id: 'agility', name: 'Agility', category: 'stat', description: 'Modify agility stat' },
  { id: 'constitution', name: 'Constitution', category: 'stat', description: 'Modify constitution stat' },
  { id: 'intelligence', name: 'Intelligence', category: 'stat', description: 'Modify intelligence stat' },
  { id: 'spirit', name: 'Spirit', category: 'stat', description: 'Modify spirit stat' },
  { id: 'charisma', name: 'Charisma', category: 'stat', description: 'Modify charisma stat' },
  { id: 'armor', name: 'Armor', category: 'stat', description: 'Modify armor value' },
  { id: 'speed', name: 'Speed', category: 'stat', description: 'Modify movement speed' },

  // Status effects - positive
  { id: 'invisible', name: 'Invisibility', category: 'status', positive: true, description: 'Target becomes invisible' },
  { id: 'haste', name: 'Haste', category: 'status', positive: true, description: 'Target gains additional actions' },
  { id: 'regeneration', name: 'Regeneration', category: 'status', positive: true, description: 'Target regenerates health over time' },
  { id: 'flying', name: 'Flying', category: 'status', positive: true, description: 'Target can fly' },

  // Status effects - negative
  { id: 'stunned', name: 'Stunned', category: 'status', positive: false, description: 'Target cannot take actions' },
  { id: 'poisoned', name: 'Poisoned', category: 'status', positive: false, description: 'Target takes damage over time' },
  { id: 'blinded', name: 'Blinded', category: 'status', positive: false, description: 'Target cannot see' },
  { id: 'charmed', name: 'Charmed', category: 'status', positive: false, description: 'Target is friendly to caster' },

  // Purification effects
  { id: 'dispel', name: 'Dispel Magic', category: 'purification', description: 'Remove magical effects from targets' },
  { id: 'cleanse', name: 'Cleanse', category: 'purification', description: 'Remove physical effects like poison, disease, or bleeds' },
  { id: 'remove_curse', name: 'Remove Curse', category: 'purification', description: 'Specifically target and remove curses' },
  { id: 'resurrection', name: 'Resurrection', category: 'purification', description: 'Bring dead targets back to life' },
  { id: 'mass_purification', name: 'Mass Purification', category: 'purification', description: 'Remove multiple effects from multiple targets' },

  // Restoration effects
  { id: 'mana_restoration', name: 'Mana Restoration', category: 'restoration', description: 'Restore mana to targets' },
  { id: 'energy_restoration', name: 'Energy Restoration', category: 'restoration', description: 'Restore energy to targets' },
  { id: 'rage_restoration', name: 'Rage Generation', category: 'restoration', description: 'Generate rage for targets' },
  { id: 'focus_restoration', name: 'Focus Restoration', category: 'restoration', description: 'Restore focus to targets' },
  { id: 'resource_conversion', name: 'Resource Conversion', category: 'restoration', description: 'Convert one resource type to another' },

  // Critical effect modifiers
  { id: 'extraDamage', name: 'Extra Damage', category: 'critical', description: 'Deal extra damage on critical hits' },
  { id: 'statusEffect', name: 'Status Effect', category: 'critical', description: 'Apply a status effect on critical hits' },

  // Utility effects
  { id: 'teleport', name: 'Teleport', category: 'utility', description: 'Move instantly to another location',
    subtypes: [
      { id: 'self', name: 'Self', description: 'Teleport yourself' },
      { id: 'target', name: 'Target', description: 'Teleport a target' },
      { id: 'swap', name: 'Swap', description: 'Swap positions with a target' }
    ]
  },
  { id: 'transform', name: 'Transform', category: 'utility', description: 'Change form or appearance',
    subtypes: [
      { id: 'creature', name: 'Creature', description: 'Transform into a creature' },
      { id: 'object', name: 'Object', description: 'Transform into an object' }
    ]
  }
];

// Targeting Types
export const TARGETING_TYPES_DATA = [
  { id: 'self', name: 'Self', description: 'Target only yourself' },
  { id: 'single', name: 'Single Target', description: 'Target a single creature or object' },
  { id: 'multi', name: 'Multiple Targets', description: 'Target multiple individual creatures or objects' },
  { id: 'area', name: 'Area', description: 'Target an area affecting all creatures and objects within' }
];

// Duration Types
export const DURATION_TYPES_DATA = [
  { id: 'instant', name: 'Instantaneous', description: 'Effect happens once and immediately ends' },
  { id: 'timed', name: 'Timed', description: 'Effect lasts for a specific duration' },
  { id: 'permanent', name: 'Permanent', description: 'Effect lasts until dispelled' },
  { id: 'concentration', name: 'Concentration', description: 'Effect lasts while the caster maintains concentration' }
];

// Reflection Damage Types
export const REFLECTION_DAMAGE_TYPES_DATA = [
  { id: 'same', name: 'Same Type', description: 'Reflect damage of the same type' },
  { id: 'force', name: 'Force', description: 'Reflect damage as force damage' },
  { id: 'radiant', name: 'Radiant', description: 'Reflect damage as radiant damage' }
];

// Resource Interactions
export const RESOURCE_INTERACTIONS_DATA = [
  { id: 'consume', name: 'Consume', description: 'Spell consumes the resource' },
  { id: 'generate', name: 'Generate', description: 'Spell generates the resource' },
  { id: 'convert', name: 'Convert', description: 'Spell converts one resource to another' }
];

// Spell Templates
export const SPELL_TEMPLATES_DATA = [
  {
    id: 'basicDamage',
    name: 'Basic Damage Spell',
    description: 'A simple damage-dealing spell',
    template: {
      name: 'Arcane Blast',
      description: 'A blast of arcane energy damages the target',
      spellType: 'ACTIVE',
      effectConfig: {
        primaryEffect: 'damage',
        damageConfig: {
          damageFormula: '1d6',
          damageTypes: ['force']
        }
      },
      targetingConfig: {
        targetingType: 'single',
        range: 30
      },
      durationConfig: {
        durationType: 'instant'
      }
    }
  },
  {
    id: 'basicHealing',
    name: 'Basic Healing Spell',
    description: 'A simple healing spell',
    template: {
      name: 'Healing Touch',
      description: 'A touch that mends wounds',
      spellType: 'ACTIVE',
      effectConfig: {
        primaryEffect: 'healing',
        healingConfig: {
          healingFormula: '1d8'
        }
      },
      targetingConfig: {
        targetingType: 'single',
        range: 5
      },
      durationConfig: {
        durationType: 'instant'
      }
    }
  }
];

/**
 * Utility class for enhanced effects
 */
export const EnhancedEffectUtils = {
  // Get effect by ID
  getEffectById(id) {
    return ENHANCED_EFFECT_TYPES_DATA.find(effect => effect.id === id);
  },

  // Get all effects of a specific category
  getEffectsByCategory(category) {
    return ENHANCED_EFFECT_TYPES_DATA.filter(effect => effect.category === category);
  },

  // Get all positive status effects
  getPositiveStatusEffects() {
    return ENHANCED_EFFECT_TYPES_DATA.filter(effect => effect.category === 'status' && effect.positive);
  },

  // Get all negative status effects
  getNegativeStatusEffects() {
    return ENHANCED_EFFECT_TYPES_DATA.filter(effect => effect.category === 'status' && !effect.positive);
  }
};

/**
 * Check if a string is valid dice notation (e.g., "2d6", "1d20+5")
 * @param {string} notation - The dice notation to check
 * @returns {boolean} - Whether the notation is valid
 */
export function isValidDiceNotation(notation) {
  if (!notation || typeof notation !== 'string') return false;

  // Basic regex for dice notation: XdY or XdY+Z or XdY-Z
  const diceRegex = /^(\d+)d(\d+)([\+\-]\d+)?$/;
  return diceRegex.test(notation);
}

/**
 * Calculate the average roll for a dice notation
 * @param {string} notation - The dice notation (e.g., "2d6", "1d20+5")
 * @returns {number} - The average roll
 */
export function getAverageRoll(notation) {
  if (!isValidDiceNotation(notation)) return 0;

  const diceRegex = /^(\d+)d(\d+)([\+\-]\d+)?$/;
  const match = notation.match(diceRegex);

  if (!match) return 0;

  const numDice = parseInt(match[1], 10);
  const diceType = parseInt(match[2], 10);
  const modifier = match[3] ? parseInt(match[3], 10) : 0;

  // Average roll for a die is (1 + max) / 2
  const averageDieRoll = (1 + diceType) / 2;

  return (numDice * averageDieRoll) + modifier;
}

/**
 * Create a spell template
 * @param {string} templateType - The type of template to create
 * @returns {Object} - The spell template
 */
export function createSpellTemplate(templateType) {
  // Basic template that all spells will use
  const baseTemplate = {
    name: '',
    description: '',
    level: 1,
    school: '',
    castingTime: '1 action',
    range: '30 feet',
    components: {
      verbal: true,
      somatic: true,
      material: false,
      materials: ''
    },
    duration: 'Instant',
    effectTypes: [],
    targetingType: 'single',
    resourceCost: {
      mana: 10,
      health: 0,
      stamina: 0,
      focus: 0
    }
  };

  // Customize based on template type
  switch (templateType) {
    case 'offensive':
      return {
        ...baseTemplate,
        name: 'New Offensive Spell',
        description: 'A spell that deals damage to enemies',
        effectTypes: ['damage'],
        targetingType: 'enemy'
      };
    case 'defensive':
      return {
        ...baseTemplate,
        name: 'New Defensive Spell',
        description: 'A spell that provides protection',
        effectTypes: ['buff'],
        targetingType: 'self'
      };
    case 'healing':
      return {
        ...baseTemplate,
        name: 'New Healing Spell',
        description: 'A spell that restores health',
        effectTypes: ['healing'],
        targetingType: 'ally'
      };
    case 'utility':
      return {
        ...baseTemplate,
        name: 'New Utility Spell',
        description: 'A spell with useful effects',
        effectTypes: ['utility'],
        targetingType: 'self'
      };
    case 'control':
      return {
        ...baseTemplate,
        name: 'New Control Spell',
        description: 'A spell that controls enemies',
        effectTypes: ['control'],
        targetingType: 'enemy'
      };
    case 'summoning':
      return {
        ...baseTemplate,
        name: 'New Summoning Spell',
        description: 'A spell that summons creatures',
        effectTypes: ['summon'],
        targetingType: 'self'
      };
    case 'purification':
      return {
        ...baseTemplate,
        name: 'New Purification Spell',
        description: 'A spell that dispels effects, cleanses ailments, or resurrects allies',
        effectTypes: ['purification'],
        targetingType: 'ally'
      };
    case 'restoration':
      return {
        ...baseTemplate,
        name: 'New Restoration Spell',
        description: 'A spell that restores resources like mana, rage, energy, etc.',
        effectTypes: ['restoration'],
        targetingType: 'ally'
      };
    default:
      return baseTemplate;
  }
}
