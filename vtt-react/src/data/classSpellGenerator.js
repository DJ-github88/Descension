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
      },
      effectTriggers: {},
      conditionalEffects: {},
      triggerRole: {
        mode: 'REACTIVE',
        activationDelay: 0,
        requiresLOS: true
      }
    },
    resourceCost: { 
      mana: 20, 
      health: 0, 
      stamina: 0, 
      focus: 0,
      components: ['verbal'],
      actionPoints: 0
    },
    cooldownConfig: { type: 'turn_based', value: 2, charges: 1 },
    durationConfig: {
      type: 'instant',
      value: 0,
      unit: 'seconds'
    }
  },

  // 3. HEALING OVER TIME - Showcases HOT mechanics
  healing_hot: {
    effectTypes: ['healing'],
    spellType: 'ACTION',
    healingConfig: {
      healingType: 'hot',
      formula: '2d6 + 3',
      hasHotEffect: true,
      hotFormula: '1d6 + 2',
      hotDuration: 15,
      hotTickType: 'round',
      hotApplication: 'start',
      overhealShield: true,
      overhealPercentage: 50,
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        critDiceOnly: false
      }
    },
    targetingConfig: {
      targetingType: 'single',
      range: 40,
      validTargets: ['ally', 'self'],
      requiresLineOfSight: true
    },
    resourceCost: { 
      mana: 25, 
      health: 0, 
      stamina: 0, 
      focus: 0,
      components: ['verbal', 'somatic'],
      actionPoints: 1
    },
    cooldownConfig: { type: 'turn_based', value: 3, charges: 1 },
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
    // Pyrofiend
    'fire_mastery': 'fire',
    'infernal_power': 'fire',
    'combustion': 'fire',
    
    // Cryomancer
    'frost_mastery': 'cold',
    'glacial_power': 'cold',
    'permafrost': 'cold',
    
    // Stormcaller
    'lightning_mastery': 'lightning',
    'tempest_power': 'lightning',
    'electrocution': 'lightning',
    
    // Shadowmancer
    'shadow_mastery': 'shadow',
    'void_power': 'shadow',
    'corruption_stages': 'shadow',
    
    // Necromancer
    'death_mastery': 'necrotic',
    'undeath_power': 'necrotic',
    'decay': 'necrotic',
    
    // Lightbringer
    'holy_mastery': 'radiant',
    'divine_power': 'radiant',
    'purification': 'radiant',
    
    // Arcanist
    'arcane_mastery': 'arcane',
    'mystical_power': 'arcane',
    'spellweaving': 'arcane',
    
    // Naturalist
    'nature_mastery': 'nature',
    'primal_power': 'nature',
    'growth': 'nature',
    
    // Demonologist
    'chaos_mastery': 'chaos',
    'demonic_power': 'chaos',
    'corruption': 'chaos',
    
    // Chronomancer
    'time_mastery': 'temporal',
    'temporal_power': 'temporal',
    'acceleration': 'temporal',
    
    // Psion
    'mind_mastery': 'psychic',
    'mental_power': 'psychic',
    'domination': 'psychic',
    
    // Geomancer
    'earth_mastery': 'force',
    'stone_power': 'force',
    'petrification': 'force',
    
    // Toxicologist
    'poison_mastery': 'poison',
    'venom_power': 'poison',
    'toxicity': 'poison',
    
    // Sonicmancer
    'sound_mastery': 'sonic',
    'resonance_power': 'sonic',
    'vibration': 'sonic',
    
    // Acidmancer
    'acid_mastery': 'acid',
    'corrosion_power': 'acid',
    'dissolution': 'acid'
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

// Add Arcanoneer spells from arcanoneerData
if (ARCANONEER_DATA && ARCANONEER_DATA.exampleSpells) {
  // Map Arcanoneer spells to include specialization field and categoryIds
  const arcanoneerSpells = ARCANONEER_DATA.exampleSpells.map(spell => ({
    ...spell,
    // Determine specialization based on sphere combo or tags
    specialization: determineArcanoneerSpecialization(spell),
    // Add categoryIds to prevent filtering issues
    categoryIds: spell.categoryIds || [],
    // Map sphere costs for spell card display
    sphereCost: spell.resourceCost?.spheres || spell.sphereCost
  }));

  generatedSpells['Arcanoneer'] = arcanoneerSpells;
  console.log(`📚 Added ${arcanoneerSpells.length} Arcanoneer spells to class library`);
}

// Add Pyrofiend spells from pyrofiendData
if (PYROFIEND_DATA && PYROFIEND_DATA.exampleSpells) {
  // Map Pyrofiend spells to include specialization field and flatten inferno mechanics
  const pyrofiendSpells = PYROFIEND_DATA.exampleSpells.map(spell => {
    const flattenedSpell = {
      ...spell,
      // Determine specialization based on tags or default to inferno
      specialization: determinePyrofiendSpecialization(spell),
      // Add categoryIds to prevent filtering issues
      categoryIds: spell.categoryIds || [],
      // Flatten Inferno Level mechanics for spell card display
      infernoRequired: spell.specialMechanics?.infernoLevel?.required,
      infernoAscend: spell.specialMechanics?.infernoLevel?.ascendBy,
      infernoDescend: spell.specialMechanics?.infernoLevel?.descendBy
    };

    // Debug log for first spell to verify flattening
    if (spell.id === 'pyro_ember_spark') {
      console.log('🔥 Pyrofiend spell flattening example:', {
        spellName: spell.name,
        original: spell.specialMechanics?.infernoLevel,
        flattened: {
          infernoRequired: flattenedSpell.infernoRequired,
          infernoAscend: flattenedSpell.infernoAscend,
          infernoDescend: flattenedSpell.infernoDescend
        }
      });
    }

    return flattenedSpell;
  });

  generatedSpells['Pyrofiend'] = pyrofiendSpells;
  console.log(`📚 Added ${pyrofiendSpells.length} Pyrofiend spells to class library`);
}

// Add Minstrel spells from minstrelData
if (MINSTREL_DATA && MINSTREL_DATA.exampleSpells) {
  // Map Minstrel spells to include specialization field and musical combo mechanics
  const minstrelSpells = MINSTREL_DATA.exampleSpells.map(spell => {
    const mappedSpell = {
      ...spell,
      // Determine specialization based on tags or default to battlechoir
      specialization: determineMinstrelSpecialization(spell),
      // Add categoryIds to prevent filtering issues
      categoryIds: spell.categoryIds || [],
      // Musical combo mechanics are already in the correct format
      musicalCombo: spell.specialMechanics?.musicalCombo
    };

    // Debug log for first spell to verify mapping
    if (spell.id === 'minstrel_opening_chord') {
      console.log('🎵 Minstrel spell mapping example:', {
        spellName: spell.name,
        musicalCombo: mappedSpell.musicalCombo,
        specialization: mappedSpell.specialization
      });
    }

    return mappedSpell;
  });

  generatedSpells['Minstrel'] = minstrelSpells;
  console.log(`📚 Added ${minstrelSpells.length} Minstrel spells to class library`);
}

// Add Chronarch spells from chronarchData
if (CHRONARCH_DATA && CHRONARCH_DATA.exampleSpells) {
  // Map Chronarch spells to include specialization field and flatten temporal mechanics
  const chronarchSpells = CHRONARCH_DATA.exampleSpells.map(spell => {
    const flattenedSpell = {
      ...spell,
      // Determine specialization based on tags or default to stasis
      specialization: determineChronarchSpecialization(spell),
      // Add categoryIds to prevent filtering issues
      categoryIds: spell.categoryIds || [],
      // Flatten Temporal mechanics for spell card display (both generation and consumption)
      timeShardGenerate: spell.specialMechanics?.timeShards?.generated,
      timeShardCost: spell.specialMechanics?.temporalFlux?.shardCost,
      temporalStrainGain: spell.specialMechanics?.temporalFlux?.strainGained,
      temporalStrainReduce: spell.specialMechanics?.temporalFlux?.strainReduced
    };

    // Debug log for first spell to verify flattening
    if (spell.id === 'chrono_bolt') {
      console.log('⏰ Chronarch spell flattening example:', {
        spellName: spell.name,
        originalTimeShards: spell.specialMechanics?.timeShards,
        originalTemporalFlux: spell.specialMechanics?.temporalFlux,
        flattened: {
          timeShardGenerate: flattenedSpell.timeShardGenerate,
          timeShardCost: flattenedSpell.timeShardCost,
          temporalStrainGain: flattenedSpell.temporalStrainGain,
          temporalStrainReduce: flattenedSpell.temporalStrainReduce
        }
      });
    }

    return flattenedSpell;
  });

  generatedSpells['Chronarch'] = chronarchSpells;
  console.log(`📚 Added ${chronarchSpells.length} Chronarch spells to class library`);
}

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

