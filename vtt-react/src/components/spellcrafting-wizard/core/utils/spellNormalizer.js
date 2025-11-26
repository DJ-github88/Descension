/**
 * Spell Data Normalizer
 * 
 * Transforms spell data from ANY source (wizard, class data, manual JSON, legacy formats)
 * into the complete format that UnifiedSpellCard expects.
 * 
 * This ensures consistency across:
 * - Spell library view
 * - Character sheet
 * - Character creation
 * - Rules page
 * - Action bar tooltips
 * - Class spell pools
 */

/**
 * Normalize a spell object to ensure it has all required fields and formats
 * @param {Object} spell - Spell object from any source
 * @returns {Object} - Fully normalized spell object
 */
export const normalizeSpell = (spell) => {
  if (!spell || typeof spell !== 'object') {
    return createEmptySpell();
  }

  // Start with a deep copy
  const normalized = JSON.parse(JSON.stringify(spell));

  // 1. Ensure basic properties
  normalized.id = normalized.id || `spell_${Date.now()}`;
  normalized.name = normalized.name || 'Unnamed Spell';
  normalized.description = normalized.description || '';
  normalized.level = normalized.level || 1;
  normalized.spellType = normalized.spellType || 'ACTION';
  normalized.icon = normalized.icon || normalized.typeConfig?.icon || 'inv_misc_questionmark';

  // 2. Normalize effectTypes array - CRITICAL
  normalized.effectTypes = normalizeEffectTypes(normalized);
  normalized.effectType = normalized.effectTypes[0] || 'utility';

  // 3. Normalize damage types
  normalized.damageTypes = normalizeDamageTypes(normalized);

  // 4. Normalize typeConfig
  normalized.typeConfig = normalizeTypeConfig(normalized);

  // 5. Normalize targetingConfig
  normalized.targetingConfig = normalizeTargetingConfig(normalized);

  // 6. Normalize effect configurations - THIS IS THE KEY PART
  normalized.damageConfig = normalizeDamageConfig(normalized);
  normalized.healingConfig = normalizeHealingConfig(normalized);
  normalized.buffConfig = normalizeBuffConfig(normalized);
  normalized.debuffConfig = normalizeDebuffConfig(normalized);
  normalized.utilityConfig = normalizeUtilityConfig(normalized);
  normalized.controlConfig = normalizeControlConfig(normalized);
  normalized.summoningConfig = normalizeSummoningConfig(normalized);
  normalized.transformationConfig = normalizeTransformationConfig(normalized);
  normalized.purificationConfig = normalizePurificationConfig(normalized);
  normalized.restorationConfig = normalizeRestorationConfig(normalized);
  
  // 6b. Preserve original effects object for legacy format support
  // UnifiedSpellCard checks both buffConfig and effects.buff
  if (spell.effects && !normalized.effects) {
    normalized.effects = spell.effects;
  }

  // 7. Normalize resource cost
  normalized.resourceCost = normalizeResourceCost(normalized);

  // 8. Normalize cooldown and duration
  normalized.cooldownConfig = normalized.cooldownConfig || { cooldown: 0, charges: 1 };
  normalized.durationConfig = normalized.durationConfig || { durationType: 'instant', durationValue: 0 };

  // 9. Normalize tags
  normalized.tags = Array.isArray(normalized.tags) ? normalized.tags : [];

  // 10. Preserve class-specific mechanics (flattened properties)
  // These are flattened in classSpellGenerator for spell card display
  // First check if they exist as flat properties
  if (spell.infernoRequired !== undefined) normalized.infernoRequired = spell.infernoRequired;
  if (spell.infernoAscend !== undefined) normalized.infernoAscend = spell.infernoAscend;
  if (spell.infernoDescend !== undefined) normalized.infernoDescend = spell.infernoDescend;
  
  // Extract from resourceCost.resourceValues if not already set (wizard format)
  // This ensures class-specific resources from wizard format are properly flattened for display
  if (normalized.resourceCost?.resourceValues) {
    const rv = normalized.resourceCost.resourceValues;
    
    // Pyrofiend Inferno Veil
    if (normalized.infernoRequired === undefined && rv.inferno_required !== undefined) {
      normalized.infernoRequired = rv.inferno_required;
    }
    if (normalized.infernoAscend === undefined && rv.inferno_ascend !== undefined) {
      normalized.infernoAscend = rv.inferno_ascend;
    }
    if (normalized.infernoDescend === undefined && rv.inferno_descend !== undefined) {
      normalized.infernoDescend = rv.inferno_descend;
    }
    
    // Martyr Devotion Level
    if (normalized.devotionRequired === undefined && rv.devotion_required !== undefined) {
      normalized.devotionRequired = rv.devotion_required;
    }
    if (normalized.devotionCost === undefined && rv.devotion_cost !== undefined) {
      normalized.devotionCost = rv.devotion_cost;
    }
    if (normalized.devotionGain === undefined && rv.devotion_gain !== undefined) {
      normalized.devotionGain = rv.devotion_gain;
    }
    
    // Chronarch Temporal Mechanics
    if (normalized.timeShardGenerate === undefined && rv.time_shard_generate !== undefined) {
      normalized.timeShardGenerate = rv.time_shard_generate;
    }
    if (normalized.timeShardCost === undefined && rv.time_shard_cost !== undefined) {
      normalized.timeShardCost = rv.time_shard_cost;
    }
    if (normalized.temporalStrainGain === undefined && rv.temporal_strain_gain !== undefined) {
      normalized.temporalStrainGain = rv.temporal_strain_gain;
    }
    if (normalized.temporalStrainReduce === undefined && rv.temporal_strain_reduce !== undefined) {
      normalized.temporalStrainReduce = rv.temporal_strain_reduce;
    }
  }
  
  // Preserve flat properties if they already exist (legacy format)
  if (spell.musicalCombo !== undefined) normalized.musicalCombo = spell.musicalCombo;
  if (spell.timeShardGenerate !== undefined) normalized.timeShardGenerate = spell.timeShardGenerate;
  if (spell.timeShardCost !== undefined) normalized.timeShardCost = spell.timeShardCost;
  if (spell.temporalStrainGain !== undefined) normalized.temporalStrainGain = spell.temporalStrainGain;
  if (spell.temporalStrainReduce !== undefined) normalized.temporalStrainReduce = spell.temporalStrainReduce;
  if (spell.devotionRequired !== undefined) normalized.devotionRequired = spell.devotionRequired;
  if (spell.devotionCost !== undefined) normalized.devotionCost = spell.devotionCost;
  if (spell.devotionGain !== undefined) normalized.devotionGain = spell.devotionGain;
  if (spell.sphereCost !== undefined) normalized.sphereCost = spell.sphereCost;

  // 11. Preserve specialization for category filtering
  if (spell.specialization) normalized.specialization = spell.specialization;
  if (spell.categoryIds) normalized.categoryIds = spell.categoryIds;

  // 12. Preserve specialMechanics structure if it exists
  if (spell.specialMechanics) {
    normalized.specialMechanics = spell.specialMechanics;
  }

  return normalized;
};

/**
 * Extract and normalize effectTypes array
 */
function normalizeEffectTypes(spell) {
  // If effectTypes already exists and is an array, use it
  if (Array.isArray(spell.effectTypes) && spell.effectTypes.length > 0) {
    return spell.effectTypes;
  }

  // Extract from legacy effects object
  if (spell.effects && typeof spell.effects === 'object') {
    const types = [];
    if (spell.effects.damage) types.push('damage');
    if (spell.effects.healing) types.push('healing');
    if (spell.effects.buff) types.push('buff');
    if (spell.effects.debuff) types.push('debuff');
    if (spell.effects.control) types.push('control');
    if (spell.effects.utility) types.push('utility');
    if (spell.effects.summoning) types.push('summoning');
    if (types.length > 0) return types;
  }

  // Extract from individual configs
  const types = [];
  if (spell.damageConfig) types.push('damage');
  if (spell.healingConfig) types.push('healing');
  if (spell.buffConfig) types.push('buff');
  if (spell.debuffConfig) types.push('debuff');
  if (spell.utilityConfig) types.push('utility');
  if (spell.controlConfig) types.push('control');
  if (spell.summoningConfig) types.push('summoning');

  return types.length > 0 ? types : ['utility'];
}

/**
 * Extract and normalize damage types array
 */
function normalizeDamageTypes(spell) {
  const damageTypes = [];

  // From typeConfig (Step 1 of wizard) - but only if it's actually a damage type, not a magic school
  const magicSchools = ['arcane', 'divine', 'primal', 'occult', 'evocation', 'necromancy', 'enchantment', 'illusion', 'transmutation', 'conjuration', 'abjuration', 'divination'];
  if (spell.typeConfig?.school && !magicSchools.includes(spell.typeConfig.school.toLowerCase())) {
    damageTypes.push(spell.typeConfig.school);
  }
  if (spell.typeConfig?.secondaryElement) {
    damageTypes.push(spell.typeConfig.secondaryElement);
  }

  // From damageConfig - check both elementType and damageType
  if (damageTypes.length === 0) {
    if (spell.damageConfig?.elementType) {
      damageTypes.push(spell.damageConfig.elementType);
    } else if (spell.damageConfig?.damageType) {
      // damageType in damageConfig (e.g., 'bludgeoning', 'piercing', 'slashing')
      damageTypes.push(spell.damageConfig.damageType);
    }
  }

  // From legacy format - check both damageType and instant.type
  if (damageTypes.length === 0) {
    if (spell.effects?.damage?.damageType) {
      damageTypes.push(spell.effects.damage.damageType);
    } else if (spell.effects?.damage?.instant?.type) {
      damageTypes.push(spell.effects.damage.instant.type);
    }
  }

  // From top-level damageTypes array
  if (damageTypes.length === 0 && Array.isArray(spell.damageTypes)) {
    return spell.damageTypes;
  }

  return damageTypes.length > 0 ? damageTypes : ['force'];
}

/**
 * Normalize typeConfig
 */
function normalizeTypeConfig(spell) {
  const config = spell.typeConfig || {};

  // Ensure school is set from damage types
  if (!config.school && spell.damageTypes && spell.damageTypes.length > 0) {
    config.school = spell.damageTypes[0];
  }

  // Ensure icon is set
  if (!config.icon && spell.icon) {
    config.icon = spell.icon;
  }

  return config;
}

/**
 * Normalize targetingConfig
 */
function normalizeTargetingConfig(spell) {
  const config = spell.targetingConfig || {};

  // Ensure aoeType exists (may be same as aoeShape)
  if (!config.aoeType && config.aoeShape) {
    config.aoeType = config.aoeShape;
  }

  // Set defaults
  config.targetingType = config.targetingType || 'single';
  config.rangeType = config.rangeType || 'touch';  // Default to touch instead of ranged
  
  // Ensure rangeDistance matches rangeType
  if (config.rangeType === 'touch') {
    config.rangeDistance = 5;  // Touch is always 5 ft
  } else if (config.rangeType === 'sight') {
    config.rangeDistance = config.rangeDistance || 60;
  } else if (config.rangeType === 'ranged') {
    config.rangeDistance = config.rangeDistance || 30;
  } else {
    config.rangeDistance = config.rangeDistance || 30;
  }
  config.aoeShape = config.aoeShape || 'circle';
  config.aoeParameters = config.aoeParameters || {};
  config.targetRestrictions = config.targetRestrictions || 
    (config.targetRestriction ? [config.targetRestriction] : ['any']);
  config.maxTargets = config.maxTargets || 1;

  return config;
}

/**
 * Normalize damageConfig
 */
function normalizeDamageConfig(spell) {
  // If already exists and complete, return it
  if (spell.damageConfig && spell.damageConfig.formula) {
    return spell.damageConfig;
  }

  // Extract from legacy effects format
  if (spell.effects?.damage) {
    const legacy = spell.effects.damage;
    return {
      formula: legacy.formula || legacy.dice || '1d6',
      elementType: legacy.damageType || legacy.elementType || spell.damageTypes?.[0] || 'force',
      damageType: legacy.damageType === 'dot' ? 'dot' : 'direct',
      canCrit: legacy.canCrit !== false,
      ...spell.damageConfig // Merge any existing config
    };
  }

  // Return existing or null
  return spell.damageConfig || null;
}

/**
 * Normalize healingConfig
 */
function normalizeHealingConfig(spell) {
  // If already exists and complete, return it
  if (spell.healingConfig && (spell.healingConfig.formula || spell.healingConfig.selectedEffects?.length > 0)) {
    return spell.healingConfig;
  }

  // Extract from legacy effects format
  if (spell.effects?.healing) {
    const legacy = spell.effects.healing;
    return {
      formula: legacy.formula || legacy.instant?.formula || '1d4',
      healingType: legacy.healingType || 'direct',
      targetType: legacy.target || legacy.targetType || 'single',
      modifier: legacy.modifier || 'SPIRIT',
      ...spell.healingConfig // Merge any existing config
    };
  }

  // Return existing or null
  return spell.healingConfig || null;
}

/**
 * Normalize buffConfig - CRITICAL: Ensure effects array exists
 */
function normalizeBuffConfig(spell) {
  // If spell has legacy effects.buff format, convert it properly
  if (spell.effects?.buff) {
    const legacy = spell.effects.buff;
    
    // Handle resistance buffs - convert to statModifiers array
    if (legacy.resistance) {
      const resistanceType = legacy.resistance.type || 'all_damage';
      const resistanceValue = legacy.resistance.value || 50; // Default 50% resistance
      const duration = legacy.resistance.duration || spell.durationConfig?.duration || spell.duration || 1;
      const durationUnit = legacy.resistance.durationUnit || spell.durationConfig?.durationUnit || 'minutes';
      
      return {
        statModifiers: [{
          id: `resistance_${resistanceType}`,
          name: `${resistanceType === 'all_damage' ? 'All Damage' : resistanceType.replace(/_/g, ' ')} Resistance`,
          magnitude: resistanceValue,
          magnitudeType: 'percentage',
          category: 'resistance'
        }],
        duration: duration,
        durationValue: duration,
        durationType: durationUnit === 'minutes' ? 'minutes' : 'rounds',
        durationUnit: durationUnit
      };
    }
    
    // Handle temporary HP
    if (legacy.temporaryHP) {
      return {
        statModifiers: [{
          id: 'temporary_hp',
          name: 'Temporary HP',
          magnitude: legacy.temporaryHP.formula || '1d6',
          magnitudeType: 'flat'
        }],
        duration: legacy.temporaryHP.duration || spell.durationConfig?.duration || 1,
        durationValue: legacy.temporaryHP.duration || spell.durationConfig?.duration || 1,
        durationType: legacy.temporaryHP.durationUnit || spell.durationConfig?.durationUnit || 'minutes',
        durationUnit: legacy.temporaryHP.durationUnit || spell.durationConfig?.durationUnit || 'minutes'
      };
    }
    
    // Handle immunity
    if (legacy.immunity) {
      const immunityType = legacy.immunity.type || 'all_damage';
      const duration = legacy.immunity.duration || spell.durationConfig?.duration || 1;
      const durationUnit = legacy.immunity.durationUnit || spell.durationConfig?.durationUnit || 'minutes';
      
      return {
        statModifiers: [{
          id: `immunity_${immunityType}`,
          name: `${immunityType === 'all_damage' ? 'All Damage' : immunityType.replace(/_/g, ' ')} Immunity`,
          magnitude: 0, // 0% = immunity
          magnitudeType: 'percentage',
          category: 'resistance'
        }],
        duration: duration,
        durationValue: duration,
        durationType: durationUnit === 'minutes' ? 'minutes' : 'rounds',
        durationUnit: durationUnit
      };
    }
    
    // Handle action points
    if (legacy.actionPoints) {
      return {
        statModifiers: [{
          id: 'action_points',
          name: 'Action Points',
          magnitude: legacy.actionPoints.bonus || 1,
          magnitudeType: 'flat'
        }],
        duration: legacy.actionPoints.duration || spell.durationConfig?.duration || 1,
        durationValue: legacy.actionPoints.duration || spell.durationConfig?.duration || 1,
        durationType: legacy.actionPoints.durationUnit || spell.durationConfig?.durationUnit || 'minutes',
        durationUnit: legacy.actionPoints.durationUnit || spell.durationConfig?.durationUnit || 'minutes'
      };
    }
    
    // Handle attack bonus
    if (legacy.attackBonus) {
      return {
        statModifiers: [{
          id: 'attack_bonus',
          name: 'Attack Bonus',
          magnitude: legacy.attackBonus.formula || '2d6',
          magnitudeType: 'flat'
        }],
        duration: legacy.attackBonus.duration || spell.durationConfig?.duration || 1,
        durationValue: legacy.attackBonus.duration || spell.durationConfig?.duration || 1,
        durationType: legacy.attackBonus.durationUnit || spell.durationConfig?.durationUnit || 'minutes',
        durationUnit: legacy.attackBonus.durationUnit || spell.durationConfig?.durationUnit || 'minutes'
      };
    }
  }
  
  // If spell has buff in effectTypes but no buffConfig, create minimal one
  if (spell.effectTypes?.includes('buff') && !spell.buffConfig) {
    // Extract from legacy effects format
    if (spell.effects?.buff) {
      const legacy = spell.effects.buff;
      return {
        buffType: 'statEnhancement',
        effects: extractBuffEffects(legacy),
        duration: legacy.duration || 3,
        durationValue: legacy.duration || 3,
        durationType: 'rounds',
        durationUnit: 'rounds'
      };
    }
    // Create minimal config
    return {
      buffType: 'statEnhancement',
      effects: [],
      duration: 3,
      durationValue: 3,
      durationType: 'rounds',
      durationUnit: 'rounds'
    };
  }

  // Ensure effects array exists if buffConfig exists
  if (spell.buffConfig) {
    // CRITICAL: Convert statModifiers[] to effects[] format for consistency
    // This ensures all spells use the same structure regardless of source
    if (spell.buffConfig.statModifiers && Array.isArray(spell.buffConfig.statModifiers) && spell.buffConfig.statModifiers.length > 0) {
      // Convert each statModifier to an effect with statModifier property
      if (!Array.isArray(spell.buffConfig.effects)) {
        spell.buffConfig.effects = [];
      }
      
      // Only convert if effects array is empty or doesn't have these statModifiers already
      const existingStatMods = spell.buffConfig.effects.filter(e => e.statModifier).map(e => e.statModifier.stat);
      spell.buffConfig.statModifiers.forEach(statMod => {
        // Check if this statModifier is already in effects array
        if (!existingStatMods.includes(statMod.stat || statMod.id)) {
          spell.buffConfig.effects.push({
            id: statMod.id || `stat_${statMod.stat || statMod.name}`,
            name: statMod.name || (statMod.stat ? statMod.stat.charAt(0).toUpperCase() + statMod.stat.slice(1) : 'Stat Modifier'),
            description: statMod.description || '',
            statModifier: {
              stat: statMod.stat || statMod.id,
              magnitude: statMod.magnitude || statMod.value || 0,
              magnitudeType: statMod.magnitudeType || statMod.type || 'flat',
              category: statMod.category,
              resistanceType: statMod.resistanceType
            }
          });
        }
      });
      
      // Clear statModifiers array after conversion to avoid duplicate processing
      // Keep it for backward compatibility but mark as converted
      spell.buffConfig._statModifiersConverted = true;
    }
    
    // Ensure effects array exists
    if (!Array.isArray(spell.buffConfig.effects)) {
      spell.buffConfig.effects = spell.buffConfig.effects ? [spell.buffConfig.effects] : [];
    }
    
    // Ensure statusEffects array exists if it doesn't
    if (!Array.isArray(spell.buffConfig.statusEffects)) {
      spell.buffConfig.statusEffects = spell.buffConfig.statusEffects ? [spell.buffConfig.statusEffects] : [];
    }
    
    return spell.buffConfig;
  }

  return null;
}

/**
 * Normalize debuffConfig - CRITICAL: Ensure effects array exists
 */
function normalizeDebuffConfig(spell) {
  // If spell has debuff in effectTypes but no debuffConfig, create minimal one
  if (spell.effectTypes?.includes('debuff') && !spell.debuffConfig) {
    // Extract from legacy effects format
    if (spell.effects?.debuff) {
      const legacy = spell.effects.debuff;
      return {
        debuffType: 'statReduction',
        effects: extractDebuffEffects(legacy),
        duration: legacy.duration || 3,
        durationValue: legacy.duration || 3,
        durationType: 'rounds',
        durationUnit: 'rounds'
      };
    }
    // Create minimal config
    return {
      debuffType: 'statReduction',
      effects: [],
      duration: 3,
      durationValue: 3,
      durationType: 'rounds',
      durationUnit: 'rounds'
    };
  }

  // Ensure effects array exists if debuffConfig exists
  if (spell.debuffConfig) {
    if (!Array.isArray(spell.debuffConfig.effects)) {
      spell.debuffConfig.effects = spell.debuffConfig.effects ? [spell.debuffConfig.effects] : [];
    }
    return spell.debuffConfig;
  }

  return null;
}

/**
 * Normalize utilityConfig - CRITICAL: Ensure selectedEffects array exists
 */
function normalizeUtilityConfig(spell) {
  // If spell has utility in effectTypes but no utilityConfig, create minimal one
  if (spell.effectTypes?.includes('utility') && !spell.utilityConfig) {
    return {
      utilityType: 'movement',
      selectedEffects: [],
      duration: 10,
      durationUnit: 'minutes'
    };
  }

  // Ensure selectedEffects array exists if utilityConfig exists
  if (spell.utilityConfig) {
    if (!Array.isArray(spell.utilityConfig.selectedEffects)) {
      spell.utilityConfig.selectedEffects = [];
    }
    
    // If utilityType exists but no selectedEffects, at least the config exists
    // The card will show "Utility effect" if selectedEffects is empty
    return spell.utilityConfig;
  }

  return null;
}

/**
 * Normalize other effect configs
 */
function normalizeControlConfig(spell) {
  return spell.controlConfig || null;
}

function normalizeSummoningConfig(spell) {
  return spell.summoningConfig || spell.summonConfig || null;
}

function normalizeTransformationConfig(spell) {
  return spell.transformationConfig || null;
}

function normalizePurificationConfig(spell) {
  return spell.purificationConfig || null;
}

function normalizeRestorationConfig(spell) {
  return spell.restorationConfig || null;
}

/**
 * Extract buff effects from legacy format
 */
function extractBuffEffects(legacyBuff) {
  const effects = [];

  // If it's a temporary HP buff
  if (legacyBuff.temporaryHP) {
    effects.push({
      id: 'temporary_hp',
      name: 'Temporary Hit Points',
      description: `Grants ${legacyBuff.temporaryHP.formula || '1d6'} temporary HP`,
      formula: legacyBuff.temporaryHP.formula || '1d6'
    });
  }

  // If it's a stat enhancement
  if (legacyBuff.statModifiers) {
    Object.entries(legacyBuff.statModifiers).forEach(([stat, value]) => {
      effects.push({
        id: `stat_${stat}`,
        name: `${stat.charAt(0).toUpperCase() + stat.slice(1)} Enhancement`,
        description: `+${value} to ${stat}`,
        statModifier: { stat, value }
      });
    });
  }

  // If effects array exists
  if (Array.isArray(legacyBuff.effects)) {
    effects.push(...legacyBuff.effects);
  }

  return effects;
}

/**
 * Extract debuff effects from legacy format
 */
function extractDebuffEffects(legacyDebuff) {
  const effects = [];

  // If it's a stat reduction
  if (legacyDebuff.statModifiers) {
    Object.entries(legacyDebuff.statModifiers).forEach(([stat, value]) => {
      effects.push({
        id: `stat_${stat}`,
        name: `${stat.charAt(0).toUpperCase() + stat.slice(1)} Reduction`,
        description: `-${value} to ${stat}`,
        statModifier: { stat, value }
      });
    });
  }

  // If effects array exists
  if (Array.isArray(legacyDebuff.effects)) {
    effects.push(...legacyDebuff.effects);
  }

  return effects;
}

/**
 * Normalize resource cost
 */
function normalizeResourceCost(spell) {
  const cost = spell.resourceCost || {};

  // Ensure components array exists
  if (!Array.isArray(cost.components)) {
    cost.components = cost.components ? [cost.components] : [];
  }

  // Extract Devotion Level from specialMechanics and add to resourceValues
  if (spell.specialMechanics?.devotionLevel) {
    const devotion = spell.specialMechanics.devotionLevel;
    if (!cost.resourceValues) cost.resourceValues = {};
    if (devotion.required !== undefined) cost.resourceValues.devotion_required = devotion.required;
    if (devotion.cost !== undefined || devotion.amplifiedCost !== undefined) {
      cost.resourceValues.devotion_cost = devotion.cost || devotion.amplifiedCost;
    }
    if (devotion.gain !== undefined) cost.resourceValues.devotion_gain = devotion.gain;
  }

  return cost;
}

/**
 * Create an empty spell structure
 */
function createEmptySpell() {
  return {
    id: `spell_${Date.now()}`,
    name: 'Unnamed Spell',
    description: '',
    level: 1,
    spellType: 'ACTION',
    icon: 'inv_misc_questionmark',
    effectTypes: ['utility'],
    effectType: 'utility',
    damageTypes: ['force'],
    typeConfig: {},
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 30,
      aoeType: 'sphere',
      aoeShape: 'circle',
      aoeParameters: {},
      targetRestrictions: ['any'],
      maxTargets: 1
    },
    resourceCost: {
      components: []
    },
    cooldownConfig: { cooldown: 0, charges: 1 },
    durationConfig: { durationType: 'instant', durationValue: 0 },
    tags: []
  };
}

