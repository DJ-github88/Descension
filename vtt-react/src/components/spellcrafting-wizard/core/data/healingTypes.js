/**
 * Healing Types Module
 * 
 * Defines healing effect types, categories, and utility functions
 * for calculating and optimizing healing effects.
 */

/**
 * Enhanced healing effect types
 */
export const ENHANCED_HEALING_TYPES = [
    {
      id: 'direct',
      name: 'Direct Healing',
      description: 'Immediate healing effect that restores hit points',
      icon: 'spell_holy_flashheal',
      actionPointCost: 2,
      targetTypes: ['single', 'multi', 'area'],
      effectParameters: ['healingAmount', 'criticalChance', 'potencyMultiplier'],
      baseEfficiency: 1.0, // Healing per resource point baseline
      strengthVs: ['burst damage', 'spike damage'],
      weaknessVs: ['sustained damage', 'damage over time'],
      resourceEfficiency: 'moderate'
    },
    {
      id: 'regeneration',
      name: 'Regeneration',
      description: 'Healing over time effect that restores hit points gradually',
      icon: 'spell_nature_rejuvenation',
      actionPointCost: 2,
      targetTypes: ['single', 'multi'],
      effectParameters: ['healingPerTick', 'duration', 'tickFrequency', 'scalingFactor'],
      baseEfficiency: 1.5, // More efficient than direct healing if full duration occurs
      strengthVs: ['sustained damage', 'damage over time'],
      weaknessVs: ['burst damage', 'spike damage'],
      resourceEfficiency: 'high',
      riskFactor: 'Can be dispelled or interrupted'
    },
    {
      id: 'vampiric',
      name: 'Vampiric Healing',
      description: 'Drains health from target and heals the caster',
      icon: 'spell_shadow_lifedrain',
      actionPointCost: 3,
      targetTypes: ['single'],
      effectParameters: ['drainAmount', 'conversionRate', 'damageType', 'transfers'],
      baseEfficiency: 0.8, // Less efficient than direct, but provides damage
      strengthVs: ['solo content', 'multiple weak enemies'],
      weaknessVs: ['healing others', 'enemies with drain resistance'],
      resourceEfficiency: 'moderate',
      restrictions: ['Cannot heal allies directly']
    },
    {
      id: 'conditional',
      name: 'Conditional Healing',
      description: 'More effective healing under specific conditions',
      icon: 'spell_holy_holynova',
      actionPointCost: 2,
      targetTypes: ['single', 'multi', 'area'],
      effectParameters: ['baseHealing', 'bonusCondition', 'bonusMultiplier', 'statusEffect'],
      baseEfficiency: 1.2, // Higher efficiency when conditions are met
      strengthVs: ['specific situations', 'tactical play'],
      weaknessVs: ['unpredictable combat', 'condition not being met'],
      resourceEfficiency: 'variable',
      commonConditions: [
        'target below 30% health', 
        'target has negative status effect', 
        'caster has specific buff'
      ]
    },
    {
      id: 'resurrection',
      name: 'Resurrection',
      description: 'Brings fallen allies back to life',
      icon: 'spell_holy_resurrection',
      actionPointCost: 5,
      targetTypes: ['single'],
      effectParameters: ['healthPercent', 'penalties', 'materialComponents', 'timeLimit'],
      baseEfficiency: 0.5, // Low efficiency but unique effect
      strengthVs: ['defeating permadeath', 'recovering from wipes'],
      weaknessVs: ['in-combat recovery', 'cost efficiency'],
      resourceEfficiency: 'very low',
      restrictions: ['Usually cannot be used in combat', 'May require components']
    },
    {
      id: 'spirit',
      name: 'Spirit Healing',
      description: 'Channeled healing that draws from spiritual energy',
      icon: 'spell_holy_guardianspirit',
      actionPointCost: 3,
      targetTypes: ['single', 'area'],
      effectParameters: ['channelDuration', 'healingPerSecond', 'spiritCost', 'auraSize'],
      baseEfficiency: 2.0, // Highest efficiency if channel completes
      strengthVs: ['predictable damage', 'stationary targets'],
      weaknessVs: ['movement', 'interrupts'],
      resourceEfficiency: 'very high',
      riskFactor: 'Can be interrupted or broken by movement'
    }
  ];
  
  /**
   * Healing categories for organization
   */
  export const HEALING_CATEGORIES = [
    {
      id: 'direct',
      name: 'Direct Healing',
      description: 'Immediate healing effects',
      types: ['direct', 'spirit'],
      priority: 'immediate recovery',
      tooltip: 'Best for: Emergency healing, burst recovery, tank healing'
    },
    {
      id: 'overtime',
      name: 'Healing Over Time',
      description: 'Gradual healing effects',
      types: ['regeneration'],
      priority: 'sustained recovery',
      tooltip: 'Best for: Consistent damage, raid healing, resource efficiency'
    },
    {
      id: 'proactive',
      name: 'Proactive Healing',
      description: 'Preventative healing effects',
      types: ['absorption', 'shield'],
      priority: 'damage prevention',
      tooltip: 'Best for: Incoming burst damage, predictable mechanics, efficiency'
    },
    {
      id: 'specialized',
      name: 'Specialized Healing',
      description: 'Healing with special properties',
      types: ['vampiric', 'conditional', 'resurrection'],
      priority: 'situational',
      tooltip: 'Best for: Specific situations, special recovery mechanics'
    },
    {
      id: 'group',
      name: 'Group Healing',
      description: 'Healing multiple targets',
      types: ['chain', 'aoe', 'smart'],
      priority: 'multiple targets',
      tooltip: 'Best for: Raid damage, efficient multi-target healing'
    }
  ];
  
  /**
   * Absorption shield types for protective buffs
   */
  export const ABSORPTION_SHIELD_TYPES = [
    {
      id: 'standard',
      name: 'Standard Shield',
      description: 'Basic protective barrier that absorbs all damage types equally',
      icon: 'spell_holy_powerwordshield',
      durability: 'average',
      regenDelay: 3, // rounds before regeneration starts
      regenRate: 0, // percent of total per round
      actionPointCost: 2
    },
    {
      id: 'fortified',
      name: 'Fortified Shield',
      description: 'Stronger shield with higher capacity but no regeneration',
      icon: 'spell_holy_avengersshield',
      durability: 'high',
      multiplier: 1.5, // shield amount multiplier
      regenDelay: 0, // no regeneration
      regenRate: 0,
      actionPointCost: 3
    },
    {
      id: 'regenerating',
      name: 'Regenerating Shield',
      description: 'Shield that regenerates over time while not taking damage',
      icon: 'spell_nature_skinofearth',
      durability: 'average',
      regenDelay: 1, // rounds before regeneration starts
      regenRate: 20, // percent of total per round
      actionPointCost: 3
    },
    {
      id: 'reactive',
      name: 'Reactive Shield',
      description: 'Shield that provides damage reduction and can trigger effects when hit',
      icon: 'spell_holy_powerwordbarrier',
      durability: 'low',
      multiplier: 0.75, // shield amount multiplier
      damageReduction: 25, // percent damage reduction
      reflectChance: 20, // percent chance to reflect damage
      reflectAmount: 30, // percent of damage reflected
      actionPointCost: 3
    },
    {
      id: 'elemental',
      name: 'Elemental Shield',
      description: 'Shield specialized against specific damage types',
      icon: 'spell_fire_firearmor',
      durability: 'average',
      damageTypes: ['fire', 'cold', 'lightning', 'acid', 'thunder'],
      specializationMultiplier: 2.0, // multiplier for specialized damage type
      otherTypesMultiplier: 0.5, // multiplier for other damage types
      actionPointCost: 2
    },
    {
      id: 'layered',
      name: 'Layered Shield',
      description: 'Multiple shield layers that absorb damage sequentially',
      icon: 'spell_holy_sealofsacrifice',
      durability: 'high',
      layers: 3, // number of shield layers
      layerDistribution: 'equal', // how total shield amount is distributed
      layerRegenDelay: 2, // rounds before a depleted layer starts regenerating
      layerRegenRate: 25, // percent of layer capacity per round
      actionPointCost: 4
    },
    {
      id: 'absorbing',
      name: 'Absorbing Shield',
      description: 'Shield that converts portion of damage absorbed into healing',
      icon: 'spell_shadow_lifedrain',
      durability: 'below average',
      multiplier: 0.8, // shield amount multiplier
      absorptionRate: 25, // percent of damage converted to healing
      actionPointCost: 3
    },
    {
      id: 'overloading',
      name: 'Overloading Shield',
      description: 'Shield that explodes when depleted, damaging nearby enemies',
      icon: 'spell_fire_selfdestruct',
      durability: 'average',
      explosionDamage: 'remainingCapacity', // damage depends on remaining capacity
      explosionRadius: 15, // feet
      explosionDamageType: 'force',
      actionPointCost: 3
    }
  ];
  
  /**
   * Chain healing effect properties
   */
  export const CHAIN_HEALING_PROPERTIES = {
    targetSelectionMethods: [
      {
        id: 'most_injured',
        name: 'Most Injured',
        description: 'Chains to the most injured valid target',
        icon: 'spell_holy_healingfocus'
      },
      {
        id: 'lowest_health_percent',
        name: 'Lowest Health Percentage',
        description: 'Chains to the target with the lowest health percentage',
        icon: 'spell_holy_chastise'
      },
      {
        id: 'nearest_injured',
        name: 'Nearest Injured',
        description: 'Chains to the nearest injured ally',
        icon: 'spell_holy_heal'
      },
      {
        id: 'random_injured',
        name: 'Random Injured',
        description: 'Chains to a random injured ally within range',
        icon: 'spell_holy_holybolt'
      },
      {
        id: 'priority_role',
        name: 'Priority Role',
        description: 'Chains to targets based on role priority (tank → healer → damage)',
        icon: 'spell_holy_divineillumination'
      }
    ],
    falloffTypes: [
      {
        id: 'linear',
        name: 'Linear Reduction',
        description: 'Each jump reduces healing by a fixed amount',
        icon: 'spell_holy_flashheal',
        reductionPerJump: '1d6'
      },
      {
        id: 'percentage',
        name: 'Percentage Reduction',
        description: 'Each jump reduces healing by a percentage',
        icon: 'spell_holy_heal',
        percentageReduction: 20 // percent
      },
      {
        id: 'dice_reduction',
        name: 'Dice Reduction',
        description: 'Each jump reduces the number of dice rolled',
        icon: 'spell_holy_sealofsalvation',
        diceReduction: 1 // remove 1 die per jump
      },
      {
        id: 'adaptive',
        name: 'Adaptive Reduction',
        description: 'Healing reduction depends on target\'s current health',
        icon: 'spell_holy_layonhands',
        lowHealthReduction: 10, // percent reduction for targets below 30% health
        highHealthReduction: 40 // percent reduction for targets above 70% health
      },
      {
        id: 'progressive',
        name: 'Progressive Enhancement',
        description: 'Earlier jumps get more healing, later jumps get other benefits',
        icon: 'spell_holy_renew',
        healingReduction: 25, // percent
        additionalEffects: ['hot', 'shield', 'cleanse']
      }
    ],
    chainEffects: [
      {
        id: 'cleansing_chain',
        name: 'Cleansing Chain',
        description: 'Each jump has a chance to remove harmful effects',
        icon: 'spell_holy_dispelmagic',
        cleansePower: 1, // number of effects cleansed
        cleanseChance: 50 // percent
      },
      {
        id: 'shielding_chain',
        name: 'Shielding Chain',
        description: 'Each jump applies a small protective shield',
        icon: 'spell_holy_powerwordshield',
        shieldAmount: '1d6',
        shieldDuration: '1d4' // rounds
      },
      {
        id: 'blessing_chain',
        name: 'Blessing Chain',
        description: 'Each jump applies a short blessing effect',
        icon: 'spell_holy_greaterblessingofkings',
        blessingEffect: 'minor_stats', // small stat boost
        blessingDuration: '1d6' // rounds
      },
      {
        id: 'rejuvenating_chain',
        name: 'Rejuvenating Chain',
        description: 'Each jump applies a healing over time effect',
        icon: 'spell_nature_rejuvenation',
        hotAmount: '1d4',
        hotDuration: '2d4' // rounds
      },
      {
        id: 'fortifying_chain',
        name: 'Fortifying Chain',
        description: 'Each jump provides temporary damage resistance',
        icon: 'spell_holy_devotionaura',
        damageReduction: 10, // percent
        fortifyDuration: '1d4' // rounds
      }
    ]
  };
  
  /**
   * Critical healing effects
   */
  export const CRITICAL_HEALING_EFFECTS = [
    {
      id: 'vitalityBoost',
      name: 'Vitality Boost',
      description: 'Target gains temporary vitality bonus',
      icon: 'spell_holy_holybolt',
      effect: 'Increases maximum health by 10% for 1 minute',
      stacks: false
    },
    {
      id: 'statusRemoval',
      name: 'Status Removal',
      description: 'Removes negative status effects',
      icon: 'spell_holy_dispelmagic',
      effect: 'Removes one random negative status effect',
      stacks: false
    },
    {
      id: 'regeneration',
      name: 'Regeneration',
      description: 'Target gains healing over time effect',
      icon: 'spell_holy_renew',
      effect: 'Heals for 1d4 health per round for 3 rounds',
      stacks: true,
      maxStacks: 3
    },
    {
      id: 'fortification',
      name: 'Fortification',
      description: 'Target gains temporary damage resistance',
      icon: 'spell_holy_devotionaura',
      effect: 'Grants 20% damage resistance for 2 rounds',
      stacks: false
    },
    {
      id: 'inspiration',
      name: 'Inspiration',
      description: 'Target gains bonus to their next action',
      icon: 'spell_holy_powerinfusion',
      effect: '+2 bonus to next attack roll, ability check, or saving throw',
      stacks: false
    }
  ];
  
  /**
   * Healing over time configurations
   */
  export const HEALING_OVER_TIME_CONFIGS = {
    tickFrequencies: [
      { id: 'round', name: 'Per Round', description: 'Healing occurs at the start of each round' },
      { id: 'turn', name: 'Per Turn', description: 'Healing occurs at the start of the target\'s turn' },
      { id: '6seconds', name: 'Every 6 Seconds', description: 'Healing occurs every 6 seconds of game time' }
    ],
    scalingTypes: [
      { id: 'flat', name: 'Flat', description: 'Each tick provides the same amount of healing' },
      { id: 'frontLoaded', name: 'Front-loaded', description: 'More healing in earlier ticks, less in later ticks' },
      { id: 'backLoaded', name: 'Back-loaded', description: 'Less healing in earlier ticks, more in later ticks' },
      { id: 'pulsing', name: 'Pulsing', description: 'Healing alternates between high and low amounts' }
    ],
    defaultParameters: {
      tickCount: 5,
      tickAmount: '1d8+2',
      scalingType: 'flat',
      tickFrequency: 'round'
    }
  };
  
  /**
   * Find a healing type by ID
   */
  export function findHealingTypeById(id) {
    return ENHANCED_HEALING_TYPES.find(type => type.id === id) || null;
  }
  
  /**
   * Find a healing category by ID
   */
  export function findHealingCategoryById(id) {
    return HEALING_CATEGORIES.find(category => category.id === id) || null;
  }
  
  /**
   * Find a shield type by ID
   */
  export function findShieldById(id) {
    return ABSORPTION_SHIELD_TYPES.find(shield => shield.id === id) || null;
  }
  
  /**
   * Get all healing types in a specific category
   */
  export function getHealingTypesByCategory(categoryId) {
    const category = findHealingCategoryById(categoryId);
    if (!category) return [];
    
    return ENHANCED_HEALING_TYPES.filter(type => category.types.includes(type.id));
  }
  
  /**
   * Calculate healing amount based on type and parameters
   */
  export function calculateHealing(healingTypeId, params, caster) {
    const healingType = findHealingTypeById(healingTypeId);
    if (!healingType) return { amount: 0, error: 'Invalid healing type' };
    
    // Apply different calculations based on healing type
    switch (healingTypeId) {
      case 'direct':
        return calculateDirectHealing(params, caster);
        
      case 'regeneration':
        return calculateRegenerationHealing(params, caster);
        
      case 'vampiric':
        return calculateVampiricHealing(params, caster);
        
      case 'conditional':
        return calculateConditionalHealing(params, caster);
        
      case 'resurrection':
        return calculateResurrectionHealing(params, caster);
        
      case 'spirit':
        return calculateSpiritHealing(params, caster);
        
      default:
        return { amount: 0, error: 'Unknown healing type' };
    }
  }
  
  /**
   * Calculate direct healing amount
   */
  function calculateDirectHealing(params, caster) {
    const { diceNotation, potencyMultiplier = 1.0 } = params;
    
    if (!diceNotation) {
      return { amount: 0, error: 'No dice notation provided' };
    }
    
    // Parse dice notation
    const match = diceNotation.match(/(\d+)d(\d+)(?:\s*\+\s*(\d+))?/);
    if (!match) {
      return { amount: 0, error: 'Invalid dice notation' };
    }
    
    const [_, diceCount, diceSides, bonusStr] = match;
    const bonus = bonusStr ? parseInt(bonusStr) : 0;
    
    // Calculate base healing
    let healingAmount = 0;
    const count = parseInt(diceCount);
    const sides = parseInt(diceSides);
    
    // For average calculation, use (sides + 1) / 2 as the average roll of a die
    const averageDieRoll = (sides + 1) / 2;
    healingAmount = count * averageDieRoll + bonus;
    
    // Apply caster modifiers
    if (caster) {
      const { healingModifier = 0, abilityScores = {} } = caster;
      
      // Add wisdom/spirit modifier
      const wisdomMod = Math.floor((abilityScores.wisdom || 10) - 10) / 2;
      const spiritMod = Math.floor((abilityScores.spirit || 10) - 10) / 2;
      const castingMod = Math.max(wisdomMod, spiritMod);
      
      healingAmount += castingMod;
      
      // Apply general healing modifiers
      healingAmount *= (1 + (healingModifier / 100));
    }
    
    // Apply potency multiplier
    healingAmount *= potencyMultiplier;
    
    return {
      amount: Math.floor(healingAmount),
      min: count + bonus,
      max: count * sides + bonus,
      isCritical: false, // Not a critical by default
      healingType: 'direct'
    };
  }
  
  /**
   * Calculate regeneration healing amount
   */
  function calculateRegenerationHealing(params, caster) {
    const { 
      tickAmount, 
      tickCount = 5, 
      tickFrequency = 'round',
      scalingType = 'flat'
    } = params;
    
    if (!tickAmount) {
      return { amount: 0, error: 'No tick amount provided' };
    }
    
    // Parse dice notation
    const match = tickAmount.match(/(\d+)d(\d+)(?:\s*\+\s*(\d+))?/);
    if (!match) {
      return { amount: 0, error: 'Invalid tick amount notation' };
    }
    
    const [_, diceCount, diceSides, bonusStr] = match;
    const bonus = bonusStr ? parseInt(bonusStr) : 0;
    
    // Calculate base tick healing
    const count = parseInt(diceCount);
    const sides = parseInt(diceSides);
    const averageDieRoll = (sides + 1) / 2;
    const baseTick = count * averageDieRoll + bonus;
    
    // Calculate total healing based on scaling type
    let totalHealing = 0;
    
    for (let i = 0; i < tickCount; i++) {
      let scalingFactor = 1;
      
      switch (scalingType) {
        case 'frontLoaded':
          // Start at 1.5 and decrease to 0.5
          scalingFactor = 1.5 - (i * (1 / tickCount));
          break;
        case 'backLoaded':
          // Start at 0.5 and increase to 1.5
          scalingFactor = 0.5 + (i * (1 / tickCount));
          break;
        case 'pulsing':
          // Alternate between 1.3 and 0.7
          scalingFactor = i % 2 === 0 ? 1.3 : 0.7;
          break;
        default: // flat
          scalingFactor = 1;
      }
      
      totalHealing += baseTick * scalingFactor;
    }
    
    // Apply caster modifiers
    if (caster) {
      const { healingModifier = 0, hotsModifier = 0 } = caster;
      
      // Apply HoT-specific and general healing modifiers
      totalHealing *= (1 + (healingModifier / 100)) * (1 + (hotsModifier / 100));
    }
    
    return {
      amount: Math.floor(totalHealing),
      perTick: Math.floor(baseTick),
      ticks: tickCount,
      frequency: tickFrequency,
      scalingType: scalingType,
      min: (count + bonus) * tickCount,
      max: (count * sides + bonus) * tickCount,
      healingType: 'regeneration'
    };
  }
  
  /**
   * Calculate vampiric healing amount
   */
  function calculateVampiricHealing(params, caster) {
    const { 
      drainAmount, 
      conversionRate = 0.5,
      damageType = 'necrotic'
    } = params;
    
    if (!drainAmount) {
      return { amount: 0, damageAmount: 0, error: 'No drain amount provided' };
    }
    
    // Parse dice notation
    const match = drainAmount.match(/(\d+)d(\d+)(?:\s*\+\s*(\d+))?/);
    if (!match) {
      return { amount: 0, damageAmount: 0, error: 'Invalid drain amount notation' };
    }
    
    const [_, diceCount, diceSides, bonusStr] = match;
    const bonus = bonusStr ? parseInt(bonusStr) : 0;
    
    // Calculate base drain damage
    const count = parseInt(diceCount);
    const sides = parseInt(diceSides);
    const averageDieRoll = (sides + 1) / 2;
    const drainDamage = count * averageDieRoll + bonus;
    
    // Calculate healing based on conversion rate
    let healingAmount = drainDamage * conversionRate;
    
    // Apply caster modifiers
    if (caster) {
      const { healingModifier = 0, vampiricModifier = 0 } = caster;
      
      // Apply vampiric-specific and general healing modifiers
      healingAmount *= (1 + (healingModifier / 100)) * (1 + (vampiricModifier / 100));
    }
    
    return {
      amount: Math.floor(healingAmount),
      damageAmount: Math.floor(drainDamage),
      conversionRate: conversionRate,
      damageType: damageType,
      min: Math.floor((count + bonus) * conversionRate),
      max: Math.floor((count * sides + bonus) * conversionRate),
      healingType: 'vampiric'
    };
  }
  
  /**
   * Calculate conditional healing amount
   */
  function calculateConditionalHealing(params, caster) {
    const { 
      baseHealing, 
      bonusCondition,
      bonusMultiplier = 1.5,
      conditionMet = false
    } = params;
    
    if (!baseHealing) {
      return { amount: 0, error: 'No base healing provided' };
    }
    
    // Parse dice notation
    const match = baseHealing.match(/(\d+)d(\d+)(?:\s*\+\s*(\d+))?/);
    if (!match) {
      return { amount: 0, error: 'Invalid base healing notation' };
    }
    
    const [_, diceCount, diceSides, bonusStr] = match;
    const bonus = bonusStr ? parseInt(bonusStr) : 0;
    
    // Calculate base healing
    const count = parseInt(diceCount);
    const sides = parseInt(diceSides);
    const averageDieRoll = (sides + 1) / 2;
    let healingAmount = count * averageDieRoll + bonus;
    
    // Apply bonus if condition is met
    if (conditionMet) {
      healingAmount *= bonusMultiplier;
    }
    
    // Apply caster modifiers
    if (caster) {
      const { healingModifier = 0 } = caster;
      
      // Apply general healing modifiers
      healingAmount *= (1 + (healingModifier / 100));
    }
    
    return {
      amount: Math.floor(healingAmount),
      baseAmount: Math.floor(count * averageDieRoll + bonus),
      bonusAmount: conditionMet ? Math.floor((count * averageDieRoll + bonus) * (bonusMultiplier - 1)) : 0,
      condition: bonusCondition,
      conditionMet: conditionMet,
      bonusMultiplier: bonusMultiplier,
      min: count + bonus,
      max: count * sides + bonus,
      healingType: 'conditional'
    };
  }
  
  /**
   * Calculate resurrection healing amount
   */
  function calculateResurrectionHealing(params, caster) {
    const { 
      healthPercent = 30,
      penalties = [],
      materialComponents = [],
      timeLimit = 'minute'
    } = params;
    
    // Resurrection simply returns a percentage of max health
    return {
      amount: 0, // Actual amount depends on target's max health
      healthPercent: healthPercent,
      penalties: penalties,
      materialComponents: materialComponents,
      timeLimit: timeLimit,
      healingType: 'resurrection'
    };
  }
  
  /**
   * Calculate spirit healing amount
   */
  function calculateSpiritHealing(params, caster) {
    const { 
      channelDuration = 3, 
      healingPerSecond, 
      spiritCost = 0,
      auraSize = 0
    } = params;
    
    if (!healingPerSecond) {
      return { amount: 0, error: 'No healing per second provided' };
    }
    
    // Parse dice notation
    const match = healingPerSecond.match(/(\d+)d(\d+)(?:\s*\+\s*(\d+))?/);
    if (!match) {
      return { amount: 0, error: 'Invalid healing per second notation' };
    }
    
    const [_, diceCount, diceSides, bonusStr] = match;
    const bonus = bonusStr ? parseInt(bonusStr) : 0;
    
    // Calculate base healing per second
    const count = parseInt(diceCount);
    const sides = parseInt(diceSides);
    const averageDieRoll = (sides + 1) / 2;
    const healingPerSecondValue = count * averageDieRoll + bonus;
    
    // Calculate total healing
    let totalHealing = healingPerSecondValue * channelDuration * 6; // 6 seconds per round
    
    // Apply caster modifiers
    if (caster) {
      const { healingModifier = 0, spiritModifier = 0 } = caster;
      
      // Apply spirit-specific and general healing modifiers
      totalHealing *= (1 + (healingModifier / 100)) * (1 + (spiritModifier / 100));
    }
    
    return {
      amount: Math.floor(totalHealing),
      perSecond: Math.floor(healingPerSecondValue),
      channelDuration: channelDuration,
      spiritCost: spiritCost,
      auraSize: auraSize,
      isAura: auraSize > 0,
      min: (count + bonus) * channelDuration * 6,
      max: (count * sides + bonus) * channelDuration * 6,
      healingType: 'spirit'
    };
  }
  
  /**
   * Determine the optimal healing type for a given situation
   */
  export function getOptimalHealingType(situation, healer) {
    const { 
      targetHealth = 100, // percent
      incomingDamage = 'none', // 'none', 'low', 'moderate', 'high', 'spike'
      targetCount = 1,
      combatState = 'normal', // 'normal', 'critical', 'recovery'
      targetMobility = 'stationary', // 'stationary', 'mobile'
      resourceConstraint = 'none' // 'none', 'low', 'critical'
    } = situation;
    
    // Emergency situation - low health target
    if (targetHealth < 30 || incomingDamage === 'spike' || combatState === 'critical') {
      return {
        recommendedType: 'direct',
        secondaryType: 'shield',
        rationale: 'Emergency situation requires immediate healing',
        targetPriority: 'single target focus',
        resourceEfficiency: 'low'
      };
    }
    
    // Multiple targets need healing
    if (targetCount > 2) {
      // Resource constraints
      if (resourceConstraint === 'low' || resourceConstraint === 'critical') {
        return {
          recommendedType: 'regeneration',
          secondaryType: 'chain',
          rationale: 'Multiple targets with resource constraints',
          targetPriority: 'multi-target efficiency',
          resourceEfficiency: 'high'
        };
      }
      
      // No resource constraints
      return {
        recommendedType: 'chain',
        secondaryType: 'spirit',
        rationale: 'Efficient multi-target healing',
        targetPriority: 'group healing',
        resourceEfficiency: 'moderate'
      };
    }
    
    // Predictable sustained damage
    if (incomingDamage === 'moderate' && targetMobility === 'stationary') {
      return {
        recommendedType: 'spirit',
        secondaryType: 'regeneration',
        rationale: 'Stationary target with predictable damage',
        targetPriority: 'single target focus',
        resourceEfficiency: 'very high'
      };
    }
    
    // Mobile target with moderate damage
    if (targetMobility === 'mobile' && incomingDamage !== 'none') {
      return {
        recommendedType: 'regeneration',
        secondaryType: 'direct',
        rationale: 'Mobile target with ongoing damage',
        targetPriority: 'single target focus',
        resourceEfficiency: 'high'
      };
    }
    
    // Default case - stable situation
    return {
      recommendedType: 'conditional',
      secondaryType: 'regeneration',
      rationale: 'Stable situation allows for optimal resource usage',
      targetPriority: 'efficiency',
      resourceEfficiency: 'moderate'
    };
  }
  
  /**
   * Calculate absorption shield effectiveness
   */
  export function calculateShieldEffectiveness(shieldId, params, caster) {
    const shield = findShieldById(shieldId);
    if (!shield) return { amount: 0, error: 'Invalid shield type' };
    
    const { shieldAmount } = params;
    
    if (!shieldAmount) {
      return { amount: 0, error: 'No shield amount provided' };
    }
    
    // Parse dice notation
    const match = shieldAmount.match(/(\d+)d(\d+)(?:\s*\+\s*(\d+))?/);
    if (!match) {
      return { amount: 0, error: 'Invalid shield amount notation' };
    }
    
    const [_, diceCount, diceSides, bonusStr] = match;
    const bonus = bonusStr ? parseInt(bonusStr) : 0;
    
    // Calculate base shield amount
    const count = parseInt(diceCount);
    const sides = parseInt(diceSides);
    const averageDieRoll = (sides + 1) / 2;
    let baseAmount = count * averageDieRoll + bonus;
    
    // Apply shield type multiplier
    baseAmount *= (shield.multiplier || 1.0);
    
    // Apply caster modifiers
    if (caster) {
      const { shieldModifier = 0, absorbModifier = 0 } = caster;
      
      // Apply shield-specific and absorption modifiers
      baseAmount *= (1 + (shieldModifier / 100)) * (1 + (absorbModifier / 100));
    }
    
    // Calculate shield properties
    const shieldProps = {
      amount: Math.floor(baseAmount),
      shieldType: shield.name,
      durability: shield.durability,
      shieldId: shieldId,
      min: Math.floor((count + bonus) * (shield.multiplier || 1.0)),
      max: Math.floor((count * sides + bonus) * (shield.multiplier || 1.0))
    };
    
    // Add shield-specific properties
    if (shield.regenRate > 0) {
      shieldProps.regenerates = true;
      shieldProps.regenRate = shield.regenRate;
      shieldProps.regenDelay = shield.regenDelay;
      shieldProps.regenAmount = Math.floor(baseAmount * (shield.regenRate / 100));
    }
    
    if (shield.damageReduction) {
      shieldProps.damageReduction = shield.damageReduction;
    }
    
    if (shield.reflectChance) {
      shieldProps.reflectChance = shield.reflectChance;
      shieldProps.reflectAmount = shield.reflectAmount;
    }
    
    return shieldProps;
  }