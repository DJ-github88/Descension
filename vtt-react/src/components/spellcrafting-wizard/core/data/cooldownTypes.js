import { generateIconMarkup } from '../../core/utils/previewGenerator';
import { isValidDiceNotation } from '../../data/enhancedEffectSystemData';

// =====================================================================
// COOLDOWN TYPES
// =====================================================================

export const COOLDOWN_TYPES = [
  {
    id: 'turn_based',
    name: 'Turn Based',
    description: 'Ability becomes available again after a specific number of turns or rounds',
    icon: 'spell_holy_borrowedtime',
    defaultValue: 3,
    valueRange: { min: 1, max: 20 },
    valueUnit: 'turns',
    balanceImpact: 'linear',
    uiRepresentation: {
      showCountdown: true,
      style: 'numeric',
      animation: 'clockwise'
    },
    resetsOnRest: false
  },
  {
    id: 'short_rest',
    name: 'Short Rest',
    description: 'Ability recharges when the character takes a short or long rest',
    icon: 'spell_holy_sealofsacrifice',
    defaultValue: 1,
    valueRange: { min: 1, max: 3 },
    valueUnit: 'uses',
    balanceImpact: 'high',
    uiRepresentation: {
      showCountdown: false,
      style: 'charges',
      animation: 'pulse'
    },
    resetsOnRest: 'short'
  },
  {
    id: 'long_rest',
    name: 'Long Rest',
    description: 'Ability recharges only when the character takes a long rest',
    icon: 'spell_holy_divineillumination',
    defaultValue: 1,
    valueRange: { min: 1, max: 5 },
    valueUnit: 'uses',
    balanceImpact: 'very_high',
    uiRepresentation: {
      showCountdown: false,
      style: 'charges',
      animation: 'glow'
    },
    resetsOnRest: 'long'
  },
  {
    id: 'real_time',
    name: 'Real Time',
    description: 'Ability recharges after a specific amount of real-world time',
    icon: 'spell_holy_borrowedtime',
    defaultValue: 60,
    valueRange: { min: 5, max: 3600 },
    valueUnit: 'seconds',
    balanceImpact: 'variable',
    uiRepresentation: {
      showCountdown: true,
      style: 'timer',
      animation: 'fade'
    },
    resetsOnRest: false
  },
  {
    id: 'conditional',
    name: 'Conditional',
    description: 'Ability recharges when specific conditions are met',
    icon: 'spell_holy_innerfire',
    defaultValue: null,
    valueRange: null,
    valueUnit: 'condition',
    balanceImpact: 'situational',
    uiRepresentation: {
      showCountdown: false,
      style: 'conditional',
      animation: 'pulse'
    },
    resetsOnRest: false,
    requiresCondition: true
  },
  {
    id: 'charge_based',
    name: 'Charge Based',
    description: 'Ability has multiple charges that recharge over time',
    icon: 'spell_holy_empowerchampion',
    defaultValue: 3,
    valueRange: { min: 1, max: 10 },
    valueUnit: 'charges',
    balanceImpact: 'moderate',
    chargeRegenTime: 10, // in turns
    uiRepresentation: {
      showCountdown: true,
      style: 'charges_with_timer',
      animation: 'fill'
    },
    resetsOnRest: 'partial'
  },
  {
    id: 'encounter',
    name: 'Encounter',
    description: 'Ability recharges after an encounter ends',
    icon: 'ability_warrior_challange',
    defaultValue: 1,
    valueRange: { min: 1, max: 3 },
    valueUnit: 'uses',
    balanceImpact: 'high',
    uiRepresentation: {
      showCountdown: false,
      style: 'charges',
      animation: 'none'
    },
    resetsOnRest: 'encounter'
  },
  {
    id: 'dice_based',
    name: 'Dice Based',
    description: 'Ability has a chance to recharge at the start of each turn based on a dice roll',
    icon: 'ability_rogue_rollthebones',
    defaultValue: '1d6',
    valueRange: { diceMin: 1, diceMax: 20 },
    valueUnit: 'dice',
    balanceImpact: 'random',
    rechargeThreshold: 5, // recharge on roll >= this value
    uiRepresentation: {
      showCountdown: false,
      style: 'dice',
      animation: 'shake'
    },
    resetsOnRest: false
  }
];

// =====================================================================
// COOLDOWN MODIFIERS
// =====================================================================

export const COOLDOWN_MODIFIERS = {
  class_based: [
    {
      id: 'wizard_arcane_recovery',
      name: 'Arcane Recovery',
      description: 'Reduces cooldowns of arcane spells by 1 turn',
      icon: 'spell_arcane_manatap',
      applicableTypes: ['turn_based'],
      value: 1,
      valueType: 'flat',
      requirements: {
        class: 'wizard',
        level: 5
      }
    },
    {
      id: 'fighter_second_wind',
      name: 'Second Wind',
      description: 'Adds an additional charge to abilities with the "endurance" tag',
      icon: 'ability_warrior_secondwind',
      applicableTypes: ['charge_based'],
      value: 1,
      valueType: 'charge',
      requirements: {
        class: 'fighter',
        level: 3
      }
    },
    {
      id: 'rogue_preparation',
      name: 'Preparation',
      description: 'Long rest abilities can be used one additional time before requiring a rest',
      icon: 'ability_rogue_improvedrecuperate',
      applicableTypes: ['long_rest'],
      value: 1,
      valueType: 'charge',
      requirements: {
        class: 'rogue',
        level: 7
      }
    },
    {
      id: 'cleric_divine_intervention',
      name: 'Divine Intervention',
      description: 'Has a 10% chance per cleric level to reset a holy ability cooldown',
      icon: 'spell_holy_prayerofhealing',
      applicableTypes: ['turn_based', 'short_rest', 'long_rest'],
      value: 10, // percentage per level
      valueType: 'percentage',
      requirements: {
        class: 'cleric',
        level: 10
      }
    }
  ],
  
  item_based: [
    {
      id: 'chronos_hourglass',
      name: 'Chronos Hourglass',
      description: 'Reduces all turn-based cooldowns by 1',
      icon: 'inv_misc_pocketwatch_01',
      applicableTypes: ['turn_based'],
      value: 1,
      valueType: 'flat',
      rarity: 'rare',
      slotType: 'trinket'
    },
    {
      id: 'badge_of_the_watch',
      name: 'Badge of the Watch',
      description: 'Abilities that reset on short rest occasionally (25% chance) don\'t consume a charge',
      icon: 'inv_crown_01',
      applicableTypes: ['short_rest'],
      value: 25, // percentage chance to not consume charge
      valueType: 'conservation',
      rarity: 'uncommon',
      slotType: 'neck'
    },
    {
      id: 'alacrity_band',
      name: 'Alacrity Band',
      description: 'Charge-based abilities regenerate charges 20% faster',
      icon: 'inv_jewelry_ring_36',
      applicableTypes: ['charge_based'],
      value: 20, // percentage faster recharge
      valueType: 'recharge_rate',
      rarity: 'epic',
      slotType: 'finger'
    },
    {
      id: 'restorative_essence',
      name: 'Restorative Essence',
      description: 'Consumable that resets the cooldown of one ability',
      icon: 'inv_potion_27',
      applicableTypes: ['turn_based', 'charge_based', 'real_time'],
      value: 1, // number of abilities affected
      valueType: 'reset',
      rarity: 'uncommon',
      slotType: 'consumable',
      oneTimeUse: true
    }
  ],
  
  temporary_effects: [
    {
      id: 'haste',
      name: 'Haste',
      description: 'All cooldowns progress 30% faster',
      icon: 'spell_nature_invisibility',
      applicableTypes: ['turn_based', 'charge_based', 'real_time'],
      value: 30, // percentage
      valueType: 'progression_rate',
      duration: '1d4+1' // rounds
    },
    {
      id: 'time_warp',
      name: 'Time Warp',
      description: 'Reduces all active cooldowns by 2 turns',
      icon: 'ability_mage_timewarp',
      applicableTypes: ['turn_based'],
      value: 2,
      valueType: 'flat',
      duration: 'instant'
    },
    {
      id: 'elemental_attunement',
      name: 'Elemental Attunement',
      description: 'Elemental abilities gain an additional charge',
      icon: 'spell_fire_totemofwrath',
      applicableTypes: ['charge_based'],
      value: 1,
      valueType: 'charge',
      duration: '10d6', // seconds
      requirements: {
        abilityTags: ['elemental']
      }
    },
    {
      id: 'spiritual_clarity',
      name: 'Spiritual Clarity',
      description: 'The next long-rest ability used won\'t consume a charge',
      icon: 'spell_holy_blessedrecovery',
      applicableTypes: ['long_rest'],
      value: 1, // number of uses preserved
      valueType: 'conservation',
      duration: '1d2', // encounters
    }
  ],
  
  resource_based: [
    {
      id: 'mana_burn',
      name: 'Mana Burn',
      description: 'Spend additional mana to reduce ability cooldown',
      icon: 'spell_shadow_manafeed',
      applicableTypes: ['turn_based', 'charge_based'],
      value: 'variable',
      valueType: 'scaling',
      costFormula: {
        resourceType: 'mana',
        baseAmount: 10,
        amountPerReduction: 15, // per turn/charge
        maxReduction: 3 // max turns/charges that can be reduced
      }
    },
    {
      id: 'blood_sacrifice',
      name: 'Blood Sacrifice',
      description: 'Sacrifice health to reset ability cooldown',
      icon: 'spell_shadow_lifedrain',
      applicableTypes: ['turn_based', 'short_rest', 'charge_based'],
      value: 'full',
      valueType: 'reset',
      costFormula: {
        resourceType: 'health',
        baseAmount: '1d6',
        amountPerLevel: 2, // per ability level
        maxCost: 30, // percentage of max health
      }
    },
    {
      id: 'focus_channeling',
      name: 'Focus Channeling',
      description: 'Spend focus points to accelerate cooldown recovery',
      icon: 'ability_monk_forcesphere',
      applicableTypes: ['turn_based', 'real_time'],
      value: 50, // percentage reduction
      valueType: 'percentage',
      costFormula: {
        resourceType: 'focus',
        baseAmount: 3,
        amountPerReduction: 1, // per 10% reduction
        maxReduction: 50 // percentage
      }
    },
    {
      id: 'soul_infusion',
      name: 'Soul Infusion',
      description: 'Consume soul shards to add charges to abilities',
      icon: 'spell_shadow_shadesofdarkness',
      applicableTypes: ['charge_based'],
      value: 'variable',
      valueType: 'charge',
      costFormula: {
        resourceType: 'soul_shard',
        baseAmount: 1,
        chargesPerResource: 1,
        maxCharges: 3
      }
    }
  ]
};

// =====================================================================
// COOLDOWN CATEGORIES
// =====================================================================

export const COOLDOWN_CATEGORIES = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Regular ability cooldowns that operate independently',
    sharesResetWith: [],
    priority: 0,
    displayGroup: 'normal'
  },
  {
    id: 'short_cooldown',
    name: 'Short Cooldown',
    description: 'Quick abilities with fast cooldowns',
    sharesResetWith: [],
    thresholds: {
      turns: { max: 3 },
      charges: { min: 3 }
    },
    priority: 1,
    displayGroup: 'normal'
  },
  {
    id: 'long_cooldown',
    name: 'Long Cooldown',
    description: 'Powerful abilities with extended cooldowns',
    sharesResetWith: [],
    thresholds: {
      turns: { min: 5 }
    },
    priority: 2,
    displayGroup: 'highlight'
  },
  {
    id: 'shared_elemental',
    name: 'Elemental',
    description: 'Elemental abilities that share cooldown reduction effects',
    sharesResetWith: ['elemental_abilities'],
    priority: 3,
    displayGroup: 'elemental',
    tags: ['fire', 'frost', 'arcane', 'nature']
  },
  {
    id: 'shared_defensive',
    name: 'Defensive',
    description: 'Defensive abilities that share cooldown category',
    sharesResetWith: ['defensive_abilities'],
    priority: 3,
    displayGroup: 'defensive',
    tags: ['shield', 'protection', 'immunity']
  },
  {
    id: 'global',
    name: 'Global Cooldown',
    description: 'Affects all abilities that share the global cooldown',
    sharesResetWith: ['global_cooldown'],
    duration: 1.5, // in seconds
    priority: 10,
    displayGroup: 'global',
    exemptTags: ['instant', 'reactive']
  }
];

// =====================================================================
// UTILITY FUNCTIONS
// =====================================================================

export const CooldownUtils = {
  calculateActualCooldown: (baseValue, cooldownType, modifiers = [], characterLevel = 1, tags = []) => {
    const type = typeof baseValue === 'string' ? 'dice' : 'flat';
    let actualValue = type === 'dice' && isValidDiceNotation(baseValue) 
      ? isValidDiceNotation(baseValue) 
      : baseValue;
    
    // Apply flat modifiers first
    const flatMods = modifiers.filter(mod => mod.valueType === 'flat');
    for (const mod of flatMods) {
      if (mod.applicableTypes.includes(cooldownType)) {
        // Check class requirements
        if (mod.requirements?.class && mod.requirements?.level) {
          if (characterLevel >= mod.requirements.level) {
            actualValue -= mod.value;
          }
        } 
        // Check ability tag requirements
        else if (mod.requirements?.abilityTags) {
          if (mod.requirements.abilityTags.some(tag => tags.includes(tag))) {
            actualValue -= mod.value;
          }
        }
        // No requirements or requirements met
        else {
          actualValue -= mod.value;
        }
      }
    }
    
    // Apply percentage modifiers
    const percentMods = modifiers.filter(mod => mod.valueType === 'percentage');
    let percentageModifier = 0;
    for (const mod of percentMods) {
      if (mod.applicableTypes.includes(cooldownType)) {
        percentageModifier += mod.value;
      }
    }
    
    if (percentageModifier > 0) {
      actualValue = actualValue * (1 - (percentageModifier / 100));
    }
    
    // Apply charge modifiers for charge-based cooldowns
    if (cooldownType === 'charge_based') {
      const chargeMods = modifiers.filter(mod => mod.valueType === 'charge');
      let additionalCharges = 0;
      
      for (const mod of chargeMods) {
        if (mod.applicableTypes.includes(cooldownType)) {
          // Check requirements
          if (mod.requirements?.abilityTags) {
            if (mod.requirements.abilityTags.some(tag => tags.includes(tag))) {
              additionalCharges += mod.value;
            }
          } else {
            additionalCharges += mod.value;
          }
        }
      }
      
      actualValue += additionalCharges;
    }
    
    // Minimum cooldown is 0 (1 for charges)
    if (cooldownType === 'charge_based') {
      return Math.max(1, actualValue);
    } else {
      return Math.max(0, actualValue);
    }
  },
  
  getCooldownInfo: (cooldownTypeId) => {
    return COOLDOWN_TYPES.find(type => type.id === cooldownTypeId) || null;
  },
  
  getCooldownCategory: (categoryCooldown) => {
    return COOLDOWN_CATEGORIES.find(category => category.id === categoryCooldown) || null;
  },
  
  isAbilityReady: (ability, gameState) => {
    const { cooldownType, cooldownValue, currentCooldown, charges, maxCharges } = ability;
    
    // Handle different cooldown types
    switch (cooldownType) {
      case 'turn_based':
        return currentCooldown <= 0;
        
      case 'charge_based':
        return charges > 0;
        
      case 'short_rest':
      case 'long_rest':
        return charges > 0;
        
      case 'real_time':
        return gameState.currentTime >= ability.nextAvailableTime;
        
      case 'conditional':
        if (!ability.cooldownCondition) return true;
        return CooldownUtils.evaluateCondition(ability.cooldownCondition, gameState);
        
      case 'dice_based':
        // This should be rolled at the start of turn and is not evaluated here
        return currentCooldown <= 0;
        
      default:
        return true;
    }
  },
  
  evaluateCondition: (condition, gameState) => {
    // Placeholder for condition evaluation logic
    // This would integrate with the trigger system
    if (typeof condition === 'function') {
      return condition(gameState);
    }
    
    return false;
  },
  
  reduceAbilityCooldown: (ability, amount, type = 'turn') => {
    if (!ability) return null;
    
    const updatedAbility = { ...ability };
    
    switch (ability.cooldownType) {
      case 'turn_based':
        if (type === 'turn') {
          updatedAbility.currentCooldown = Math.max(0, ability.currentCooldown - amount);
        }
        break;
        
      case 'charge_based':
        if (type === 'charge') {
          updatedAbility.charges = Math.min(ability.maxCharges, ability.charges + amount);
        } else if (type === 'turn' && ability.charges < ability.maxCharges) {
          updatedAbility.chargeProgress += amount;
          if (updatedAbility.chargeProgress >= ability.chargeRegenTime) {
            const newCharges = Math.floor(updatedAbility.chargeProgress / ability.chargeRegenTime);
            updatedAbility.charges = Math.min(ability.maxCharges, ability.charges + newCharges);
            updatedAbility.chargeProgress %= ability.chargeRegenTime;
          }
        }
        break;
        
      case 'real_time':
        if (type === 'time') {
          const newTime = ability.nextAvailableTime - (amount * 1000); // Convert to milliseconds
          updatedAbility.nextAvailableTime = Math.max(Date.now(), newTime);
        }
        break;
    }
    
    return updatedAbility;
  },
  
  resetAbilityCooldown: (ability, partial = false) => {
    if (!ability) return null;
    
    const updatedAbility = { ...ability };
    
    switch (ability.cooldownType) {
      case 'turn_based':
        updatedAbility.currentCooldown = 0;
        break;
        
      case 'charge_based':
        if (partial) {
          // Add one charge
          updatedAbility.charges = Math.min(ability.maxCharges, ability.charges + 1);
        } else {
          // Full reset
          updatedAbility.charges = ability.maxCharges;
          updatedAbility.chargeProgress = 0;
        }
        break;
        
      case 'short_rest':
      case 'long_rest':
        updatedAbility.charges = ability.maxCharges;
        break;
        
      case 'real_time':
        updatedAbility.nextAvailableTime = Date.now();
        break;
        
      case 'dice_based':
        updatedAbility.currentCooldown = 0;
        break;
    }
    
    return updatedAbility;
  },
  
  processRest: (abilities, restType) => {
    if (!abilities || !Array.isArray(abilities)) return [];
    
    return abilities.map(ability => {
      // Skip abilities that don't reset on rest
      if (!ability.resetsOnRest) return ability;
      
      // Process each ability based on rest type and its reset conditions
      const cooldownInfo = CooldownUtils.getCooldownInfo(ability.cooldownType);
      if (!cooldownInfo) return ability;
      
      const shouldReset = 
        (restType === 'short' && (cooldownInfo.resetsOnRest === 'short' || cooldownInfo.resetsOnRest === 'long')) ||
        (restType === 'long' && cooldownInfo.resetsOnRest === 'long') || 
        (restType === 'encounter' && cooldownInfo.resetsOnRest === 'encounter');
      
      if (shouldReset) {
        return CooldownUtils.resetAbilityCooldown(ability);
      } else if (cooldownInfo.resetsOnRest === 'partial' && restType === 'short') {
        return CooldownUtils.resetAbilityCooldown(ability, true);
      }
      
      return ability;
    });
  },
  
  getSharedCooldownIds: (cooldownCategoryId) => {
    const category = COOLDOWN_CATEGORIES.find(cat => cat.id === cooldownCategoryId);
    return category ? category.sharesResetWith : [];
  },
  
  getCooldownUI: (ability) => {
    if (!ability) return null;
    
    const cooldownInfo = CooldownUtils.getCooldownInfo(ability.cooldownType);
    if (!cooldownInfo) return null;
    
    const { uiRepresentation } = cooldownInfo;
    const result = { ...uiRepresentation };
    
    // Add ability-specific data for the UI
    switch (ability.cooldownType) {
      case 'turn_based':
        result.value = ability.currentCooldown;
        result.maxValue = ability.cooldownValue;
        break;
        
      case 'charge_based':
        result.value = ability.charges;
        result.maxValue = ability.maxCharges;
        result.progressValue = ability.chargeProgress;
        result.progressMaxValue = ability.chargeRegenTime;
        break;
        
      case 'short_rest':
      case 'long_rest':
        result.value = ability.charges;
        result.maxValue = ability.maxCharges;
        result.restType = ability.cooldownType === 'short_rest' ? 'Short Rest' : 'Long Rest';
        break;
        
      case 'real_time':
        result.value = Math.max(0, ability.nextAvailableTime - Date.now()) / 1000; // In seconds
        result.maxValue = ability.cooldownValue;
        break;
        
      case 'conditional':
        result.conditionDescription = ability.cooldownCondition?.description || 'Special condition';
        break;
        
      case 'dice_based':
        result.dice = ability.cooldownValue;
        result.threshold = ability.rechargeThreshold;
        break;
    }
    
    return result;
  }
};