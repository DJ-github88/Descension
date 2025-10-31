/**
 * Class Spell Generator - COMPLETELY REWRITTEN
 *
 * Generates properly formatted showcase spells for all classes
 * Each spell demonstrates specific spell wizard capabilities
 */

import { CLASS_SPECIALIZATIONS } from './classSpellCategories';
import { ARCANONEER_DATA } from './classes/arcanoneerData';
import { PYROFIEND_DATA } from './classes/pyrofiendData';
import { MINSTREL_DATA } from './classes/minstrelData';
import { CHRONARCH_DATA } from './classes/chronarchData';
import { MARTYR_DATA } from './classes/martyrData';
import { FATE_WEAVER_DATA } from './classes/fateWeaverData';
import { CHAOS_WEAVER_DATA } from './classes/chaosWeaverData';

// ===== CLASS DATA MAP =====
// Maps class names to their data files for dynamic loading
const CLASS_DATA_MAP = {
  'Arcanoneer': ARCANONEER_DATA,
  'Pyrofiend': PYROFIEND_DATA,
  'Minstrel': MINSTREL_DATA,
  'Chronarch': CHRONARCH_DATA,
  'Martyr': MARTYR_DATA,
  'Fate Weaver': FATE_WEAVER_DATA,
  'Chaos Weaver': CHAOS_WEAVER_DATA,
  // Add more classes here as their data files are created
};

// ===== GENERIC SPELL NORMALIZATION =====
/**
 * Normalizes a spell from any class data file to ensure consistent formatting
 * @param {Object} spell - Raw spell object from class data
 * @param {string} className - Name of the class
 * @param {Function} determineSpecialization - Function to determine spell specialization
 * @returns {Object} Normalized spell object
 */
function normalizeClassSpell(spell, className, determineSpecialization) {
  const normalized = {
    ...spell,
    // Ensure specialization is set
    specialization: determineSpecialization ? determineSpecialization(spell) : spell.specialization || 'protector',
    // Ensure categoryIds exists
    categoryIds: spell.categoryIds || [],
    // Ensure basic fields exist
    id: spell.id || `spell_${Date.now()}_${Math.random()}`,
    name: spell.name || 'Unnamed Spell',
    description: spell.description || '',
    level: spell.level || 1,
    spellType: spell.spellType || 'ACTION',
    icon: spell.icon || 'inv_misc_questionmark',
    effectTypes: spell.effectTypes || [],
    tags: spell.tags || [],
  };

  return normalized;
}

// ===== CLASS-SPECIFIC SPELL PROCESSORS =====

/**
 * Process Arcanoneer spells - handles sphere costs
 */
function processArcanoneerSpells(spells) {
  return spells.map(spell => normalizeClassSpell(spell, 'Arcanoneer', determineArcanoneerSpecialization))
    .map(spell => ({
      ...spell,
      sphereCost: spell.resourceCost?.spheres || spell.sphereCost
    }));
}

/**
 * Process Pyrofiend spells - flattens Inferno Level mechanics
 */
function processPyrofiendSpells(spells) {
  return spells.map(spell => normalizeClassSpell(spell, 'Pyrofiend', determinePyrofiendSpecialization))
    .map(spell => ({
      ...spell,
      infernoRequired: spell.specialMechanics?.infernoLevel?.required,
      infernoAscend: spell.specialMechanics?.infernoLevel?.ascendBy,
      infernoDescend: spell.specialMechanics?.infernoLevel?.descendBy
    }));
}

/**
 * Process Minstrel spells - handles musical combo mechanics
 */
function processMinstrelSpells(spells) {
  return spells.map(spell => normalizeClassSpell(spell, 'Minstrel', determineMinstrelSpecialization))
    .map(spell => ({
      ...spell,
      musicalCombo: spell.specialMechanics?.musicalCombo
    }));
}

/**
 * Process Chronarch spells - flattens Temporal mechanics
 */
function processChronarchSpells(spells) {
  return spells.map(spell => normalizeClassSpell(spell, 'Chronarch', determineChronarchSpecialization))
    .map(spell => ({
      ...spell,
      timeShardGenerate: spell.specialMechanics?.timeShards?.generated,
      timeShardCost: spell.specialMechanics?.temporalFlux?.shardCost,
      temporalStrainGain: spell.specialMechanics?.temporalFlux?.strainGained,
      temporalStrainReduce: spell.specialMechanics?.temporalFlux?.strainReduced
    }));
}

/**
 * Process Martyr spells - flattens Devotion Level mechanics
 */
function processMartyrSpells(spells) {
  return spells.map(spell => normalizeClassSpell(spell, 'Martyr', determineMartyrSpecialization))
    .map(spell => ({
      ...spell,
      devotionRequired: spell.specialMechanics?.devotionLevel?.required,
      devotionCost: spell.specialMechanics?.devotionLevel?.cost || spell.specialMechanics?.devotionLevel?.amplifiedCost,
      devotionGain: spell.specialMechanics?.devotionLevel?.gain
    }));
}

/**
 * Process Chaos Weaver spells - emphasizes chaos_sphere and rollable tables
 */
function processChaosWeaverSpells(spells) {
  return spells
    .map(spell => normalizeClassSpell(spell, 'Chaos Weaver', determineChaosWeaverSpecialization))
    .map(spell => ({
      ...spell
    }));
}

/**
 * Generic processor for classes without special mechanics
 */
function processGenericClassSpells(spells, className, determineSpecialization) {
  return spells.map(spell => normalizeClassSpell(spell, className, determineSpecialization));
}

// ===== PROPERLY FORMATTED SPELL ARCHETYPES =====
// Each archetype is COMPLETE with all necessary configurations

const SPELL_ARCHETYPES = {
  
  // 1. CONE AOE DAMAGE - Showcases cone targeting
  damage_cone_aoe: {
    effectTypes: ['damage'],
    spellType: 'ACTION',
    damageConfig: {
      damageType: 'direct',
      formula: '4d6 + 3',
      hasDotEffect: false,
      savingThrow: {
        enabled: true,
        attribute: 'agility',
        difficulty: 14,
        onSuccess: 'half_damage',
        onFailure: 'full_damage'
      },
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        critDiceOnly: false,
        extraDice: '2d6',
        explodingDice: true
      }
    },
    targetingConfig: {
      targetingType: 'aoe',
      aoeType: 'cone',
      aoeSize: 30,
      range: 30,
      validTargets: ['enemy'],
      requiresLineOfSight: true
    },
    resourceCost: { 
      mana: 30, 
      health: 0, 
      stamina: 0, 
      focus: 0,
      components: ['verbal', 'somatic'],
      materialComponents: '',
      actionPoints: 1
    },
    cooldownConfig: { type: 'turn_based', value: 4, charges: 1 },
    durationConfig: {
      type: 'instant',
      value: 0,
      unit: 'seconds'
    }
  },

  // 2. REACTION SPELL - Showcases trigger system
  damage_reaction: {
    effectTypes: ['damage'],
    spellType: 'REACTION',
    damageConfig: {
      damageType: 'direct',
      formula: '3d8 + 4',
      hasDotEffect: false,
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        critDiceOnly: false
      }
    },
    targetingConfig: {
      targetingType: 'single',
      range: 60,
      validTargets: ['enemy'],
      requiresLineOfSight: true
    },
    triggerConfig: {
      global: {
        logicType: 'OR',
        compoundTriggers: [
          {
            id: 'on_damage_taken',
            name: 'When you take damage',
            parameters: {
              damageThreshold: 10,
              damageTypes: ['any'],
              triggerChance: 100
            }
          }
        ]
      }
    },
    resourceCost: { 
      mana: 20, 
      components: ['verbal'],
      actionPoints: 0
    },
    cooldownConfig: { type: 'turn_based', value: 3, charges: 1 },
    durationConfig: {
      type: 'instant',
      value: 0,
      unit: 'seconds'
    }
  },

  // 3. HEALING OVER TIME - Showcases HoT mechanics
  healing_hot: {
    effectTypes: ['healing'],
    spellType: 'ACTION',
    healingConfig: {
      formula: '2d4 + 2',
      modifier: 'SPIRIT',
      healingType: 'hot',
      hotDuration: 15,
      hotTickInterval: 3,
      canOverheal: true,
      overhealBecomesShield: true
    },
    targetingConfig: {
      targetingType: 'single',
      range: 30,
      validTargets: ['ally', 'self'],
      requiresLineOfSight: true
    },
    resourceCost: { 
      mana: 25, 
      components: ['verbal', 'somatic'],
      actionPoints: 1
    },
    cooldownConfig: { type: 'turn_based', value: 5, charges: 1 },
    durationConfig: {
      type: 'duration',
      value: 15,
      unit: 'rounds'
    }
  }
};

// ===== ELEMENT TYPE MAPPING =====
const getElementTypeForSpecialization = (specializationId) => {
  const elementMap = {
    // Fire-based
    'inferno': 'fire',
    'wildfire': 'fire',
    'hellfire': 'fire',
    'blaze': 'fire',
    
    // Arcane-based
    'prism_mage': 'arcane',
    'sphere_architect': 'arcane',
    'entropy_weaver': 'chaos',
    
    // Healing/Restoration
    'soulsinger': 'radiant',
    'redeemer': 'radiant',
    'rewinding': 'radiant',
    
    // Control/Debuff
    'dissonance': 'psychic',
    'stasis': 'force',
    'protector': 'radiant',
    
    // Damage/Offense
    'battlechoir': 'thunder',
    'avenger': 'radiant',
    'displacement': 'force'
  };
  
  return elementMap[specializationId] || 'arcane';
};

// ===== SPELL NAME GENERATOR =====
const generateSpellName = (specializationName, archetypeKey) => {
  const nameTemplates = {
    damage_cone_aoe: ['Breath', 'Cone', 'Spray', 'Gust', 'Sweep'],
    damage_reaction: ['Retaliation', 'Counterstrike', 'Vengeance', 'Retort', 'Riposte'],
    healing_hot: ['Regeneration', 'Rejuvenation', 'Recovery', 'Vitality', 'Renewal']
  };

  const template = nameTemplates[archetypeKey] || ['Spell'];
  const suffix = template[Math.floor(Math.random() * template.length)];
  
  // Use first word of specialization name
  const specPrefix = specializationName.split(' ')[0];
  
  return `${specPrefix} ${suffix}`;
};

// ===== SPELL DESCRIPTION GENERATOR =====
const generateDescription = (archetypeKey, elementType, archetype) => {
  if (archetypeKey === 'damage_cone_aoe') {
    const aoeSize = archetype.targetingConfig?.aoeSize || 30;
    return `Unleash a ${aoeSize}ft cone of ${elementType} energy, engulfing all enemies in front of you. Targets must make an Agility saving throw or take full damage.`;
  } else if (archetypeKey === 'damage_reaction') {
    return `Instantly retaliate with ${elementType} energy when you take damage, striking back at your attacker with devastating force.`;
  } else if (archetypeKey === 'healing_hot') {
    const duration = archetype.healingConfig?.hotDuration || 15;
    return `Restore health over time, healing the target for ${duration} rounds. Excess healing creates a temporary shield.`;
  }
  return `A powerful ${elementType} spell.`;
};

// ===== SPELL GENERATION =====
export const generateAllClassSpells = () => {
  const spellsByClass = {};

  Object.entries(CLASS_SPECIALIZATIONS).forEach(([className, classData]) => {
    const classSpells = [];

    classData.specializations.forEach((specialization, index) => {
      // Generate 1 spell per specialization (3 total per class)
      let archetypeKey;

      if (index === 0) {
        archetypeKey = 'damage_cone_aoe';
      } else if (index === 1) {
        archetypeKey = 'healing_hot';
      } else {
        archetypeKey = 'damage_reaction';
      }

      const archetype = SPELL_ARCHETYPES[archetypeKey];
      const elementType = getElementTypeForSpecialization(specialization.id);
      const spellName = generateSpellName(specialization.name, archetypeKey);
      const description = generateDescription(archetypeKey, elementType, archetype);

      const spell = {
        id: `${className}-${specialization.id}-${archetypeKey}`,
        name: spellName,
        description,
        icon: specialization.icon || 'spell_arcane_arcane01',
        spellType: archetype.spellType,
        effectTypes: archetype.effectTypes,
        damageTypes: [elementType],
        tags: [className.toLowerCase(), specialization.name.toLowerCase().replace(/ /g, '_'), archetypeKey],
        specialization: specialization.id, // Add specialization ID for filtering

        // Copy all configs from archetype
        ...archetype,

        // Customize element type
        ...(archetype.damageConfig && {
          damageConfig: {
            ...archetype.damageConfig,
            elementType
          }
        })
      };

      // Remove duplicate tags
      spell.tags = [...new Set(spell.tags.map(tag => tag.toLowerCase()))];

      classSpells.push(spell);
    });

    // Store spells for this class
    spellsByClass[className] = classSpells;
  });

  return spellsByClass;
};

// Generate all spells organized by class
const generatedSpells = generateAllClassSpells();

// ===== LOAD CLASS-SPECIFIC SPELL DATA =====
// Process each class that has actual spell data files

// Arcanoneer
if (CLASS_DATA_MAP['Arcanoneer']?.exampleSpells) {
  const processed = processArcanoneerSpells(CLASS_DATA_MAP['Arcanoneer'].exampleSpells);
  generatedSpells['Arcanoneer'] = processed;
  console.log(`📚 Added ${processed.length} Arcanoneer spells to class library`);
}

// Pyrofiend
if (CLASS_DATA_MAP['Pyrofiend']?.exampleSpells) {
  const processed = processPyrofiendSpells(CLASS_DATA_MAP['Pyrofiend'].exampleSpells);
  generatedSpells['Pyrofiend'] = processed;
  console.log(`📚 Added ${processed.length} Pyrofiend spells to class library`);
}

// Minstrel
if (CLASS_DATA_MAP['Minstrel']?.exampleSpells) {
  const processed = processMinstrelSpells(CLASS_DATA_MAP['Minstrel'].exampleSpells);
  generatedSpells['Minstrel'] = processed;
  console.log(`📚 Added ${processed.length} Minstrel spells to class library`);
}

// Chronarch
if (CLASS_DATA_MAP['Chronarch']?.exampleSpells) {
  const processed = processChronarchSpells(CLASS_DATA_MAP['Chronarch'].exampleSpells);
  generatedSpells['Chronarch'] = processed;
  console.log(`📚 Added ${processed.length} Chronarch spells to class library`);
}

// Martyr
if (CLASS_DATA_MAP['Martyr']?.exampleSpells) {
  const processed = processMartyrSpells(CLASS_DATA_MAP['Martyr'].exampleSpells);
  generatedSpells['Martyr'] = processed;
  console.log(`📚 Added ${processed.length} Martyr spells to class library`, {
    spells: processed.map(s => ({ name: s.name, specialization: s.specialization })),
    specializationCounts: {
      protector: processed.filter(s => s.specialization === 'protector').length,
      redeemer: processed.filter(s => s.specialization === 'redeemer').length,
      avenger: processed.filter(s => s.specialization === 'avenger').length
    }
  });
} else {
  console.warn('⚠️ MARTYR_DATA or MARTYR_DATA.exampleSpells not found!', {
    hasMARTYR_DATA: !!CLASS_DATA_MAP['Martyr'],
    hasExampleSpells: CLASS_DATA_MAP['Martyr']?.exampleSpells?.length
  });
}

// Fate Weaver
if (CLASS_DATA_MAP['Fate Weaver']?.exampleSpells) {
  function determineFateWeaverSpecialization(spell) {
    const id = (spell.id || '').toLowerCase();
    const tags = (spell.tags || []).join(' ');
    if (id.includes('echo') || id.includes('past') || tags.includes('support')) {
      return 'fortune_teller';
    }
    if (id.includes('hand') || id.includes('draw') || id.includes('solitaire')) {
      return 'card_master';
    }
    if (id.includes('heart') || id.includes('war') || id.includes('thread')) {
      return 'thread_weaver';
    }
    return 'fortune_teller';
  }
  const processed = CLASS_DATA_MAP['Fate Weaver'].exampleSpells
    .map(spell => normalizeClassSpell(spell, 'Fate Weaver', determineFateWeaverSpecialization));
  generatedSpells['Fate Weaver'] = processed;
  console.log(`📚 Added ${processed.length} Fate Weaver spells to class library`);
}

// Chaos Weaver
if (CLASS_DATA_MAP['Chaos Weaver']?.exampleSpells) {
  const processed = processChaosWeaverSpells(CLASS_DATA_MAP['Chaos Weaver'].exampleSpells);
  generatedSpells['Chaos Weaver'] = processed;
  console.log(`📚 Added ${processed.length} Chaos Weaver spells to class library`);
}

// ===== VALIDATE ALL SPELLS =====
// Ensure all spells have required fields and proper formatting
const validationResults = {};
Object.entries(generatedSpells).forEach(([className, spells]) => {
  const validation = {
    totalSpells: spells.length,
    validSpells: 0,
    invalidSpells: [],
    missingFields: {},
    specializationCounts: {}
  };

  spells.forEach(spell => {
    const issues = [];
    
    // Required fields
    if (!spell.id) issues.push('missing id');
    if (!spell.name) issues.push('missing name');
    if (!spell.specialization) issues.push('missing specialization');
    if (!Array.isArray(spell.categoryIds)) issues.push('invalid categoryIds');
    if (!spell.spellType) issues.push('missing spellType');
    if (!spell.level) issues.push('missing level');
    
    // Track missing fields
    issues.forEach(issue => {
      validation.missingFields[issue] = (validation.missingFields[issue] || 0) + 1;
    });
    
    // Track specializations
    if (spell.specialization) {
      validation.specializationCounts[spell.specialization] = 
        (validation.specializationCounts[spell.specialization] || 0) + 1;
    }
    
    if (issues.length === 0) {
      validation.validSpells++;
    } else {
      validation.invalidSpells.push({
        id: spell.id || 'unknown',
        name: spell.name || 'unnamed',
        issues
      });
    }
  });
  
  validationResults[className] = validation;
  
  // Log results
  if (validation.invalidSpells.length > 0) {
    console.error(`❌ ${className}: ${validation.invalidSpells.length}/${validation.totalSpells} invalid spells`, {
      invalidSpells: validation.invalidSpells,
      missingFields: validation.missingFields
    });
  } else {
    console.log(`✅ ${className}: All ${validation.totalSpells} spells properly formatted`, {
      specializations: validation.specializationCounts
    });
  }
});

// Summary
const totalSpells = Object.values(validationResults).reduce((sum, v) => sum + v.totalSpells, 0);
const totalValid = Object.values(validationResults).reduce((sum, v) => sum + v.validSpells, 0);
const totalInvalid = Object.values(validationResults).reduce((sum, v) => sum + v.invalidSpells.length, 0);

console.log(`\n📊 SPELL VALIDATION SUMMARY:`, {
  totalClasses: Object.keys(validationResults).length,
  totalSpells,
  validSpells: totalValid,
  invalidSpells: totalInvalid,
  classes: Object.keys(validationResults)
});

export const ALL_CLASS_SPELLS = generatedSpells;

/**
 * Determine Arcanoneer specialization based on spell properties
 * Prism Mage: Pure element combos (same sphere twice)
 * Sphere Architect: Mixed element combos with utility
 * Entropy Weaver: Chaos sphere combos
 */
function determineArcanoneerSpecialization(spell) {
  // Check for Chaos sphere
  if (spell.sphereCost && spell.sphereCost.includes('Chaos')) {
    return 'entropy_weaver';
  }

  // Check for pure element combo (same sphere twice)
  if (spell.sphereCost && spell.sphereCost.length >= 2) {
    const firstSphere = spell.sphereCost[0];
    const isPure = spell.sphereCost.every(s => s === firstSphere);
    if (isPure) {
      return 'prism_mage';
    }
  }

  // Default to Sphere Architect for mixed combos
  return 'sphere_architect';
}

/**
 * Determine Pyrofiend specialization based on spell properties
 * Inferno: High damage, aggressive spells
 * Wildfire: AoE and DoT effects
 * Hellfire: Healing and utility spells
 */
function determinePyrofiendSpecialization(spell) {
  // Check tags for specialization hints
  if (spell.tags) {
    if (spell.tags.includes('healing') || spell.tags.includes('utility') || spell.tags.includes('buff')) {
      return 'hellfire';
    }
    if (spell.tags.includes('aoe') || spell.tags.includes('dot') || spell.tags.includes('spread')) {
      return 'wildfire';
    }
  }

  // Check for AoE targeting
  if (spell.targetingConfig?.targetingType === 'area' || spell.targetingConfig?.aoeShape) {
    return 'wildfire';
  }

  // Check for healing effects
  if (spell.healingConfig || spell.effects?.healing) {
    return 'hellfire';
  }

  // Default to Inferno for pure damage
  return 'inferno';
}

/**
 * Determine Minstrel specialization based on spell properties
 * Battlechoir: Damage and offensive buffs
 * Soulsinger: Healing and defensive support
 * Dissonance: Control and debuffs
 */
function determineMinstrelSpecialization(spell) {
  // Check tags first
  if (spell.tags) {
    if (spell.tags.includes('battlechoir')) return 'battlechoir';
    if (spell.tags.includes('soulsinger')) return 'soulsinger';
    if (spell.tags.includes('dissonance')) return 'dissonance';
  }

  // Check for healing effects
  if (spell.healingConfig || spell.effects?.healing) {
    return 'soulsinger';
  }

  // Check for control/debuff effects
  if (spell.effects?.condition || spell.effects?.debuff || spell.debuffConfig) {
    return 'dissonance';
  }

  // Check for damage or offensive buffs
  if (spell.damageConfig || spell.effects?.damage ||
      (spell.effects?.buff && (spell.effects.buff.type === 'attack-bonus' || spell.effects.buff.type === 'damage-bonus'))) {
    return 'battlechoir';
  }

  // Default to Battlechoir
  return 'battlechoir';
}

/**
 * Determine Chronarch specialization based on spell properties
 * Stasis: Control and freeze effects
 * Displacement: Teleportation and mobility
 * Rewinding: Healing and time reversal
 */
function determineChronarchSpecialization(spell) {
  // Check tags for specialization hints
  if (spell.tags) {
    if (spell.tags.includes('healing') || spell.tags.includes('support') || spell.tags.includes('rewinding')) {
      return 'rewinding';
    }
    if (spell.tags.includes('teleport') || spell.tags.includes('mobility') || spell.tags.includes('displacement')) {
      return 'displacement';
    }
    if (spell.tags.includes('control') || spell.tags.includes('freeze') || spell.tags.includes('stasis')) {
      return 'stasis';
    }
  }

  // Check for Temporal Flux abilities (high strain = control)
  if (spell.specialMechanics?.temporalFlux?.strainGained >= 4) {
    return 'stasis';
  }

  // Default to Stasis
  return 'stasis';
}

/**
 * Determine Martyr specialization based on spell properties
 * Protector: Defensive and shielding spells
 * Redeemer: Healing and restoration spells
 * Avenger: Damage and retribution spells
 */
function determineMartyrSpecialization(spell) {
  // Check tags for specialization hints
  if (spell.tags) {
    if (spell.tags.includes('healing') || spell.tags.includes('restoration') || spell.tags.includes('redeemer')) {
      return 'redeemer';
    }
    if (spell.tags.includes('damage') || spell.tags.includes('retribution') || spell.tags.includes('avenger')) {
      return 'avenger';
    }
    if (spell.tags.includes('protection') || spell.tags.includes('shield') || spell.tags.includes('protector')) {
      return 'protector';
    }
  }

  // Check for healing effects
  if (spell.healingConfig || spell.effects?.healing || spell.restorationConfig) {
    return 'redeemer';
  }

  // Check for damage effects
  if (spell.damageConfig || spell.effects?.damage) {
    return 'avenger';
  }

  // Check for defensive/buff effects
  if (spell.buffConfig || spell.effects?.buff || spell.targetingConfig?.targetingType === 'self') {
    return 'protector';
  }

  // Default to Protector
  return 'protector';
}

/**
 * Determine Chaos Weaver specialization based on spell properties
 */
function determineChaosWeaverSpecialization(spell) {
  if (spell.rollableTable?.enabled || (spell.tags && spell.tags.includes('chaos_dice'))) {
    return 'chaos_dice';
  }
  if (spell.controlConfig || spell.debuffConfig || (spell.tags && spell.tags.includes('control'))) {
    return 'entropy_control';
  }
  return 'reality_bending';
}
