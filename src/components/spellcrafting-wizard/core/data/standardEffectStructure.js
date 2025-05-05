/**
 * Standard Effect Structure
 * 
 * This file defines a standardized structure for all effect types in the spell wizard.
 * It provides a consistent interface for working with different effect types.
 */

/**
 * Creates a standard effect object with common properties
 * @param {string} type - The effect type (damage, healing, buff, etc.)
 * @param {string} id - Unique identifier for the effect
 * @param {Object} config - Configuration specific to the effect type
 * @returns {Object} - Standardized effect object
 */
export const createStandardEffect = (type, id, config = {}) => {
  // Base structure common to all effect types
  const baseEffect = {
    id: id || `effect_${type}_${Date.now()}`,
    type: type,
    enabled: true,
    name: config.name || getDefaultEffectName(type),
    description: config.description || '',
    
    // Resolution method (dice, cards, coins)
    resolution: config.resolution || 'DICE',
    
    // Targeting information
    targetingOverride: config.targetingOverride || null,
    
    // Trigger conditions (for conditional effects)
    triggerConditions: config.triggerConditions || [],
    
    // Critical hit configuration
    criticalConfig: config.criticalConfig || getDefaultCriticalConfig(),
    
    // Chance-on-hit configuration
    chanceOnHitConfig: config.chanceOnHitConfig || getDefaultChanceOnHitConfig(),
    
    // Mechanics configuration
    mechanicsConfig: config.mechanicsConfig || {},
    
    // Effect-specific configuration
    config: {}
  };
  
  // Add type-specific configuration
  switch (type) {
    case 'damage':
      return {
        ...baseEffect,
        config: {
          damageType: config.damageType || 'direct',
          elementType: config.elementType || 'fire',
          secondaryElementType: config.secondaryElementType || null,
          formula: config.formula || '1d6 + INT',
          
          // Damage over time
          hasDotEffect: config.hasDotEffect || false,
          dotFormula: config.dotFormula || '1d4 + INT/2',
          dotDuration: config.dotDuration || 3,
          dotTickType: config.dotTickType || 'round',
          dotApplication: config.dotApplication || 'start',
          dotScalingType: config.dotScalingType || 'flat',
          dotTriggerType: config.dotTriggerType || 'periodic',
          isProgressiveDot: config.isProgressiveDot || false,
          dotProgressiveStages: config.dotProgressiveStages || [],
          
          // Resolution-specific configurations
          diceConfig: config.diceConfig || { formula: config.formula || '1d6 + INT' },
          cardConfig: config.cardConfig || { drawCount: 3, formula: 'CARD_VALUE + FACE_CARD_COUNT * 5' },
          coinConfig: config.coinConfig || { flipCount: 5, formula: 'HEADS_COUNT * 8 + (ALL_HEADS ? 15 : 0)' }
        }
      };
      
    case 'healing':
      return {
        ...baseEffect,
        config: {
          healingType: config.healingType || 'direct',
          formula: config.formula || '1d8 + HEA',
          
          // Healing over time
          hasHotEffect: config.hasHotEffect || false,
          hotFormula: config.hotFormula || '1d4 + HEA/2',
          hotDuration: config.hotDuration || 3,
          hotTickType: config.hotTickType || 'round',
          hotApplication: config.hotApplication || 'start',
          hotScalingType: config.hotScalingType || 'flat',
          hotTriggerType: config.hotTriggerType || 'periodic',
          isProgressiveHot: config.isProgressiveHot || false,
          hotProgressiveStages: config.hotProgressiveStages || [],
          
          // Shield
          hasShieldEffect: config.hasShieldEffect || false,
          shieldFormula: config.shieldFormula || '2d6 + HEA',
          shieldDuration: config.shieldDuration || 3,
          shieldDamageTypes: config.shieldDamageTypes || 'all',
          shieldOverflow: config.shieldOverflow || 'dissipate',
          shieldBreakBehavior: config.shieldBreakBehavior || 'fade',
          shieldBreakEffect: config.shieldBreakEffect || null,
          shieldExpireEffect: config.shieldExpireEffect || null,
          
          // Resolution-specific configurations
          diceConfig: config.diceConfig || { formula: config.formula || '1d8 + HEA' },
          cardConfig: config.cardConfig || { drawCount: 3, formula: 'CARD_VALUE + FACE_CARD_COUNT * 3' },
          coinConfig: config.coinConfig || { flipCount: 5, formula: 'HEADS_COUNT * 7 + (LONGEST_STREAK > 2 ? LONGEST_STREAK * 5 : 0)' }
        }
      };
      
    case 'buff':
      return {
        ...baseEffect,
        config: {
          duration: config.duration || 3,
          durationValue: config.durationValue || 3,
          durationType: config.durationType || 'turns',
          durationUnit: config.durationUnit || 'rounds',
          restType: config.restType || 'short',
          canBeDispelled: config.canBeDispelled !== false,
          concentrationRequired: config.concentrationRequired || false,
          stackingRule: config.stackingRule || 'replace',
          maxStacks: config.maxStacks || 1,
          magnitude: config.magnitude || 2,
          magnitudeType: config.magnitudeType || 'flat',
          statModifiers: config.statModifiers || [],
          statusEffects: config.statusEffects || [],
          isProgressive: config.isProgressive || false,
          progressiveStages: config.progressiveStages || []
        }
      };
      
    case 'debuff':
      return {
        ...baseEffect,
        config: {
          duration: config.duration || 3,
          durationValue: config.durationValue || 3,
          durationType: config.durationType || 'turns',
          durationUnit: config.durationUnit || 'rounds',
          restType: config.restType || 'short',
          canBeDispelled: config.canBeDispelled !== false,
          concentrationRequired: config.concentrationRequired || false,
          stackingRule: config.stackingRule || 'replace',
          maxStacks: config.maxStacks || 1,
          magnitude: config.magnitude || 2,
          magnitudeType: config.magnitudeType || 'flat',
          statModifiers: config.statModifiers || [],
          statusEffects: config.statusEffects || [],
          isProgressive: config.isProgressive || false,
          progressiveStages: config.progressiveStages || [],
          savingThrow: config.savingThrow || {
            enabled: true,
            attribute: 'constitution',
            dc: 10,
            effect: 'negate'
          }
        }
      };
      
    case 'utility':
      return {
        ...baseEffect,
        config: {
          utilityType: config.utilityType || 'movement',
          duration: config.duration || 3,
          durationValue: config.durationValue || 3,
          durationType: config.durationType || 'turns',
          durationUnit: config.durationUnit || 'rounds',
          magnitude: config.magnitude || 2,
          magnitudeType: config.magnitudeType || 'flat',
          utilityEffects: config.utilityEffects || []
        }
      };
      
    case 'control':
      return {
        ...baseEffect,
        config: {
          controlType: config.controlType || 'stun',
          duration: config.duration || 2,
          durationValue: config.durationValue || 2,
          durationType: config.durationType || 'turns',
          durationUnit: config.durationUnit || 'rounds',
          savingThrow: config.savingThrow || {
            enabled: true,
            attribute: 'wisdom',
            dc: 12,
            effect: 'negate'
          },
          controlEffects: config.controlEffects || []
        }
      };
      
    case 'summoning':
      return {
        ...baseEffect,
        config: {
          summonType: config.summonType || 'creature',
          creatureType: config.creatureType || 'elemental',
          duration: config.duration || 10,
          durationValue: config.durationValue || 10,
          durationType: config.durationType || 'minutes',
          durationUnit: config.durationUnit || 'minutes',
          summonLevel: config.summonLevel || 1,
          summonCount: config.summonCount || 1,
          summonHealth: config.summonHealth || '10',
          summonAbilities: config.summonAbilities || []
        }
      };
      
    case 'transformation':
      return {
        ...baseEffect,
        config: {
          transformType: config.transformType || 'polymorph',
          targetType: config.targetType || 'self',
          formId: config.formId || null,
          duration: config.duration || 10,
          durationValue: config.durationValue || 10,
          durationType: config.durationType || 'minutes',
          durationUnit: config.durationUnit || 'minutes',
          retainEquipment: config.retainEquipment !== false,
          retainMentalStats: config.retainMentalStats !== false,
          selectedAbilities: config.selectedAbilities || []
        }
      };
      
    case 'purification':
      return {
        ...baseEffect,
        config: {
          purificationType: config.purificationType || 'dispel',
          targetEffectTypes: config.targetEffectTypes || ['debuff', 'curse'],
          maxEffectsRemoved: config.maxEffectsRemoved || 1,
          effectPriority: config.effectPriority || 'newest',
          purificationPower: config.purificationPower || '1d20 + INT',
          purificationThreshold: config.purificationThreshold || 10
        }
      };
      
    case 'restoration':
      return {
        ...baseEffect,
        config: {
          restorationType: config.restorationType || 'resource',
          resourceType: config.resourceType || 'mana',
          formula: config.formula || '2d6 + INT',
          hasOverTime: config.hasOverTime || false,
          overTimeFormula: config.overTimeFormula || '1d4 + INT/2',
          overTimeDuration: config.overTimeDuration || 3,
          overTimeTickType: config.overTimeTickType || 'round'
        }
      };
      
    default:
      return {
        ...baseEffect,
        config: { ...config }
      };
  }
};

/**
 * Get a default effect name based on type
 * @param {string} type - Effect type
 * @returns {string} - Default name
 */
const getDefaultEffectName = (type) => {
  switch (type) {
    case 'damage': return 'Damage Effect';
    case 'healing': return 'Healing Effect';
    case 'buff': return 'Buff Effect';
    case 'debuff': return 'Debuff Effect';
    case 'utility': return 'Utility Effect';
    case 'control': return 'Control Effect';
    case 'summoning': return 'Summoning Effect';
    case 'transformation': return 'Transformation Effect';
    case 'purification': return 'Purification Effect';
    case 'restoration': return 'Restoration Effect';
    default: return 'Custom Effect';
  }
};

/**
 * Get default critical hit configuration
 * @returns {Object} - Default critical hit config
 */
const getDefaultCriticalConfig = () => {
  return {
    enabled: false,
    critType: 'dice',
    critMultiplier: 2,
    critDiceOnly: false,
    extraDice: '',
    explodingDice: false,
    explodingDiceType: 'reroll_add',
    critEffects: [],
    cardCritRule: 'face_cards',
    cardCritResolution: 'draw_add',
    extraCardDraw: 2,
    coinCritRule: 'all_heads',
    coinCritResolution: 'flip_add',
    extraCoinFlips: 3,
    coinCount: 3,
    spellEffect: null,
    useRollableTable: false,
    effectType: null,
    effectDetails: null,
    effectDuration: 2,
    effectDurationUnit: 'rounds'
  };
};

/**
 * Get default chance-on-hit configuration
 * @returns {Object} - Default chance-on-hit config
 */
const getDefaultChanceOnHitConfig = () => {
  return {
    enabled: false,
    procType: 'dice',
    procChance: 15,
    diceThreshold: 18,
    cardProcRule: 'face_cards',
    coinProcRule: 'all_heads',
    coinCount: 3,
    procSuit: 'hearts',
    spellEffect: null,
    customEffects: [],
    useRollableTable: false,
    effectType: null,
    effectDetails: null,
    effectDuration: 2,
    effectDurationUnit: 'rounds'
  };
};

/**
 * Convert legacy effect configuration to standardized format
 * @param {string} type - Effect type
 * @param {string} id - Effect ID
 * @param {Object} legacyConfig - Legacy configuration object
 * @returns {Object} - Standardized effect object
 */
export const convertLegacyEffectConfig = (type, id, legacyConfig) => {
  switch (type) {
    case 'damage':
      return createStandardEffect(type, id, {
        ...legacyConfig,
        formula: legacyConfig.formula,
        damageType: legacyConfig.damageType,
        elementType: legacyConfig.elementType,
        hasDotEffect: legacyConfig.hasDotEffect,
        dotFormula: legacyConfig.dotFormula,
        dotDuration: legacyConfig.dotDuration,
        criticalConfig: legacyConfig.criticalConfig,
        chanceOnHitConfig: legacyConfig.chanceOnHitConfig
      });
      
    case 'healing':
      return createStandardEffect(type, id, {
        ...legacyConfig,
        formula: legacyConfig.formula,
        healingType: legacyConfig.healingType,
        hasHotEffect: legacyConfig.hasHotEffect,
        hotFormula: legacyConfig.hotFormula,
        hotDuration: legacyConfig.hotDuration,
        hasShieldEffect: legacyConfig.hasShieldEffect,
        shieldFormula: legacyConfig.shieldFormula,
        shieldDuration: legacyConfig.shieldDuration,
        criticalConfig: legacyConfig.criticalConfig,
        chanceOnHitConfig: legacyConfig.chanceOnHitConfig
      });
      
    case 'buff':
    case 'debuff':
      return createStandardEffect(type, id, {
        ...legacyConfig,
        duration: legacyConfig.duration,
        durationValue: legacyConfig.durationValue,
        durationType: legacyConfig.durationType,
        durationUnit: legacyConfig.durationUnit,
        statModifiers: legacyConfig.statModifiers,
        statusEffects: legacyConfig.statusEffects
      });
      
    default:
      return createStandardEffect(type, id, legacyConfig);
  }
};

/**
 * Get all effect types
 * @returns {Array} - Array of effect type objects
 */
export const getAllEffectTypes = () => {
  return [
    { id: 'damage', name: 'Damage', description: 'Deal damage to targets' },
    { id: 'healing', name: 'Healing', description: 'Restore health to targets' },
    { id: 'buff', name: 'Buff', description: 'Apply positive effects to allies' },
    { id: 'debuff', name: 'Debuff', description: 'Apply negative effects to enemies' },
    { id: 'utility', name: 'Utility', description: 'Create various non-combat effects' },
    { id: 'control', name: 'Control', description: 'Control or restrict enemy actions' },
    { id: 'summoning', name: 'Summoning', description: 'Summon creatures or objects' },
    { id: 'transformation', name: 'Transformation', description: 'Transform targets into different forms' },
    { id: 'purification', name: 'Purification', description: 'Remove negative effects from targets' },
    { id: 'restoration', name: 'Restoration', description: 'Restore resources other than health' }
  ];
};

/**
 * Get effect type by ID
 * @param {string} id - Effect type ID
 * @returns {Object|null} - Effect type object or null if not found
 */
export const getEffectTypeById = (id) => {
  return getAllEffectTypes().find(type => type.id === id) || null;
};

/**
 * Get effect type description
 * @param {string} id - Effect type ID
 * @returns {string} - Effect type description
 */
export const getEffectTypeDescription = (id) => {
  const effectType = getEffectTypeById(id);
  return effectType ? effectType.description : '';
};
