/**
 * Enhanced Effect System Data
 * 
 * This file extends the core effect system with advanced configurations
 * for complex spell effects, critical modifications, chain reactions,
 * and resource interactions.
 */

import {
  EFFECT_TYPES,
  DAMAGE_TYPES,
  DURATION_TYPES,
  TARGETING_TYPES,
  AOE_SHAPES,
  PRIMARY_STAT_MODIFIERS,
  SECONDARY_STAT_MODIFIERS,
  COMBAT_STAT_MODIFIERS,
  POSITIVE_STATUS_EFFECTS,
  NEGATIVE_STATUS_EFFECTS,
  COMBAT_ADVANTAGES,
  COMBAT_DISADVANTAGES,
  REFLECTION_DAMAGE_TYPES as BASE_REFLECTION_TYPES,
  CRITICAL_EFFECT_MODIFIERS as BASE_CRITICAL_EFFECTS,
  ABSORPTION_SHIELD_TYPES as BASE_SHIELD_TYPES,
  SpellEffectUtils,
  ActionPointUtils,
  getWowIconPath
} from './effectSystemData';

import {
  parseDiceNotation,
  isValidDiceNotation,
  getMinRoll,
  getMaxRoll,
  getAverageRoll,
  calculateChainedDamage,
  calculateCriticalDamage,
  calculateDotDamage,
  DiceBuilder,
  DiceHelpers
} from './DiceRules';

// =====================================================================
// ENHANCED EFFECT TYPES
// =====================================================================

export const ENHANCED_EFFECT_TYPES = EFFECT_TYPES.map(effectType => {
  const enhancements = getEnhancementsForEffectType(effectType.id);
  return {
    ...effectType,
    enhancements,
    advancedOptions: getAdvancedOptionsForEffectType(effectType.id),
    scaling: getDiceScalingForEffectType(effectType.id),
    resourceOptions: getResourceOptionsForEffectType(effectType.id)
  };
});

function getEnhancementsForEffectType(effectTypeId) {
  switch (effectTypeId) {
    case 'damage':
      return [
        {
          id: 'chain_damage',
          name: 'Chain Damage',
          description: 'Damage jumps to additional targets with reducing effectiveness',
          icon: 'spell_frost_chainheal',
          actionPointCost: 2,
          diceNotation: '2d6'
        },
        {
          id: 'critical_enhancement',
          name: 'Critical Enhancement',
          description: 'Enhance critical hit effects for the damage',
          icon: 'ability_rogue_findweakness',
          actionPointCost: 1,
          effectOptions: BASE_CRITICAL_EFFECTS.map(effect => effect.id)
        },
        {
          id: 'penetrating_damage',
          name: 'Penetrating Damage',
          description: 'Damage ignores a portion of target resistances',
          icon: 'spell_arcane_starfire',
          actionPointCost: 2,
          diceNotation: '1d8'
        },
        {
          id: 'adaptive_damage',
          name: 'Adaptive Damage',
          description: 'Damage type changes based on target vulnerabilities',
          icon: 'spell_shadow_shadowwordpain',
          actionPointCost: 3,
          damageTypes: 3 // Number of damage types that can be chosen
        },
        {
          id: 'split_damage',
          name: 'Split Damage',
          description: 'Damage is split between multiple damage types',
          icon: 'spell_shadow_seedofdestruction',
          actionPointCost: 1,
          damageTypes: 2 // Number of damage types to split between
        }
      ];
    case 'healing':
      return [
        {
          id: 'shield_healing',
          name: 'Absorption Shield',
          description: 'Creates a protective shield that absorbs damage',
          icon: 'spell_holy_powerwordshield',
          actionPointCost: 2,
          shieldTypes: BASE_SHIELD_TYPES.map(shield => shield.id)
        },
        {
          id: 'chain_healing',
          name: 'Chain Healing',
          description: 'Healing jumps to additional targets with reducing effectiveness',
          icon: 'spell_frost_chainheal',
          actionPointCost: 2,
          diceNotation: '2d8'
        },
        {
          id: 'conditional_healing',
          name: 'Conditional Healing',
          description: 'Healing is enhanced based on target conditions',
          icon: 'spell_holy_flashheal',
          actionPointCost: 1,
          conditions: ['low_health', 'has_debuff', 'no_shield', 'in_combat']
        },
        {
          id: 'resurrection',
          name: 'Resurrection',
          description: 'Revives fallen targets with partial health',
          icon: 'spell_holy_resurrection',
          actionPointCost: 5,
          healthPercentage: 30
        },
        {
          id: 'cleansing',
          name: 'Cleansing',
          description: 'Removes negative status effects from targets',
          icon: 'spell_holy_dispelmagic',
          actionPointCost: 2,
          effectTypes: ['poison', 'disease', 'curse', 'magic']
        }
      ];
    case 'buff':
      return [
        {
          id: 'stacking_buff',
          name: 'Stacking Buff',
          description: 'Buff can stack multiple times for enhanced effect',
          icon: 'spell_holy_innerfire',
          actionPointCost: 2,
          maxStacks: 3
        },
        {
          id: 'conditional_buff',
          name: 'Conditional Buff',
          description: 'Buff is enhanced when certain conditions are met',
          icon: 'spell_holy_divinespirit',
          actionPointCost: 1,
          conditions: ['in_combat', 'low_health', 'high_health', 'moving']
        },
        {
          id: 'aura_buff',
          name: 'Aura Buff',
          description: 'Buff affects all nearby allies',
          icon: 'spell_holy_devotionaura',
          actionPointCost: 3,
          radius: 30
        },
        {
          id: 'reactive_buff',
          name: 'Reactive Buff',
          description: 'Buff provides additional effect when target is attacked',
          icon: 'spell_holy_sealofprotection',
          actionPointCost: 2,
          reactionType: ['damage_reflection', 'counter_attack', 'damage_reduction']
        },
        {
          id: 'transform_buff',
          name: 'Transformation',
          description: 'Transforms target into a different form with new abilities',
          icon: 'spell_nature_elementalshields',
          actionPointCost: 4,
          formTypes: ['beast', 'elemental', 'shadow', 'giant']
        }
      ];
    case 'debuff':
      return [
        {
          id: 'stacking_debuff',
          name: 'Stacking Debuff',
          description: 'Debuff can stack multiple times for enhanced effect',
          icon: 'spell_shadow_curseofsargeras',
          actionPointCost: 2,
          maxStacks: 3
        },
        {
          id: 'spreading_debuff',
          name: 'Spreading Debuff',
          description: 'Debuff can spread to nearby enemies',
          icon: 'spell_shadow_unstableaffliction_3',
          actionPointCost: 3,
          spreadRadius: 10,
          spreadChance: 5 // out of 20
        },
        {
          id: 'escalating_debuff',
          name: 'Escalating Debuff',
          description: 'Debuff grows more powerful over time',
          icon: 'spell_shadow_seedofdestruction',
          actionPointCost: 2,
          maxEscalation: 3
        },
        {
          id: 'triggering_debuff',
          name: 'Triggering Debuff',
          description: 'Debuff triggers additional effects when conditions are met',
          icon: 'spell_shadow_shadowwordpain',
          actionPointCost: 2,
          triggerConditions: ['damage_taken', 'spell_cast', 'movement', 'healing_received']
        },
        {
          id: 'resistance_bypass',
          name: 'Resistance Bypass',
          description: 'Debuff allows other effects to ignore target resistances',
          icon: 'spell_shadow_antishadow',
          actionPointCost: 3,
          bypassAmount: '1d6' // Die roll for bypass amount
        }
      ];
    case 'utility':
      return [
        {
          id: 'enhanced_movement',
          name: 'Enhanced Movement',
          description: 'Grants additional movement capabilities',
          icon: 'ability_rogue_sprint',
          actionPointCost: 2,
          movementTypes: ['flight', 'water_walking', 'climbing', 'teleportation']
        },
        {
          id: 'enhanced_perception',
          name: 'Enhanced Perception',
          description: 'Grants additional sensory capabilities',
          icon: 'spell_holy_mindsooth',
          actionPointCost: 1,
          perceptionTypes: ['darkvision', 'truesight', 'detect_invisible', 'detect_magic']
        },
        {
          id: 'environmental_control',
          name: 'Environmental Control',
          description: 'Manipulates the environment',
          icon: 'spell_nature_earthquake',
          actionPointCost: 3,
          environmentalTypes: ['create_water', 'create_light', 'purify_air', 'control_temperature']
        },
        {
          id: 'enhanced_illusion',
          name: 'Enhanced Illusion',
          description: 'Creates more convincing or interactive illusions',
          icon: 'spell_shadow_psychicscream',
          actionPointCost: 2,
          illusionEnhancements: ['multi_sensory', 'interactive', 'mobile', 'intelligent']
        },
        {
          id: 'planar_manipulation',
          name: 'Planar Manipulation',
          description: 'Interacts with other planes of existence',
          icon: 'spell_arcane_portaldalaran',
          actionPointCost: 4,
          planarEffects: ['portal', 'banishment', 'etherealness', 'planar_binding']
        }
      ];
    case 'control':
      return [
        {
          id: 'enhanced_push_pull',
          name: 'Enhanced Push/Pull',
          description: 'More powerful forced movement effects',
          icon: 'ability_druid_typhoon',
          actionPointCost: 2,
          movementDistance: '3d6'
        },
        {
          id: 'mass_control',
          name: 'Mass Control',
          description: 'Control effects affect multiple targets',
          icon: 'spell_frost_chainsofice',
          actionPointCost: 3,
          maxTargets: '1d4+2'
        },
        {
          id: 'terrain_manipulation',
          name: 'Terrain Manipulation',
          description: 'Create or modify terrain features',
          icon: 'spell_nature_earthquake',
          actionPointCost: 2,
          terrainTypes: ['difficult', 'dangerous', 'walled', 'obscured']
        },
        {
          id: 'mind_control',
          name: 'Mind Control',
          description: 'Take direct control of a target temporarily',
          icon: 'spell_shadow_mindsteal',
          actionPointCost: 4,
          controlDuration: '1d4'
        },
        {
          id: 'elemental_binding',
          name: 'Elemental Binding',
          description: 'Bind elemental forces to restrict movement',
          icon: 'spell_fire_volcano',
          actionPointCost: 3,
          elementTypes: ['fire', 'water', 'earth', 'air']
        }
      ];
    case 'summoning':
      return [
        {
          id: 'enhanced_summon',
          name: 'Enhanced Summon',
          description: 'Summon more powerful creatures',
          icon: 'spell_shadow_summoninfernal',
          actionPointCost: 3,
          powerLevel: '2d4' // Die roll for summon power
        },
        {
          id: 'multiple_summons',
          name: 'Multiple Summons',
          description: 'Summon multiple creatures at once',
          icon: 'spell_shadow_summonvoidwalker',
          actionPointCost: 4,
          summonCount: '1d4+1'
        },
        {
          id: 'specialized_summon',
          name: 'Specialized Summon',
          description: 'Summon creatures with specialized abilities',
          icon: 'spell_shadow_demonform',
          actionPointCost: 3,
          specializations: ['healer', 'tank', 'damage', 'control', 'utility']
        },
        {
          id: 'temporary_item',
          name: 'Temporary Item',
          description: 'Summon magical items or weapons',
          icon: 'inv_misc_enggizmos_19',
          actionPointCost: 2,
          itemTypes: ['weapon', 'armor', 'tool', 'consumable']
        },
        {
          id: 'elemental_ally',
          name: 'Elemental Ally',
          description: 'Summon an elemental being that assists the caster',
          icon: 'spell_fire_elemental_totem',
          actionPointCost: 4,
          elementTypes: ['fire', 'water', 'earth', 'air']
        }
      ];
    case 'transformation':
      return [
        {
          id: 'enhanced_transformation',
          name: 'Enhanced Transformation',
          description: 'More complete or powerful transformation',
          icon: 'spell_nature_elementalshields',
          actionPointCost: 3,
          transformPower: '2d6'
        },
        {
          id: 'partial_transformation',
          name: 'Partial Transformation',
          description: 'Transform only part of the target',
          icon: 'ability_druid_catform',
          actionPointCost: 2,
          bodyParts: ['arms', 'legs', 'head', 'torso']
        },
        {
          id: 'group_transformation',
          name: 'Group Transformation',
          description: 'Transform multiple targets at once',
          icon: 'spell_nature_polymorph',
          actionPointCost: 4,
          targetCount: '1d4+1'
        },
        {
          id: 'adaptive_transformation',
          name: 'Adaptive Transformation',
          description: 'Transformation adapts to environmental conditions',
          icon: 'spell_nature_wispsplode',
          actionPointCost: 3,
          adaptationTypes: ['aquatic', 'aerial', 'thermal', 'toxic']
        },
        {
          id: 'transmutation',
          name: 'Transmutation',
          description: 'Transform objects or elements into different forms',
          icon: 'inv_misc_gem_01',
          actionPointCost: 2,
          materialTypes: ['metal', 'stone', 'wood', 'liquid']
        }
      ];
    default:
      return [];
  }
}

function getAdvancedOptionsForEffectType(effectTypeId) {
  const baseOptions = {
    scalingOptions: ['level', 'spellpower', 'attribute', 'resource'],
    targetingOptions: ['primary', 'secondary', 'exclude', 'prioritize'],
    triggerConditions: ['on_cast', 'on_hit', 'on_crit', 'on_kill', 'on_damage_taken']
  };
  
  switch (effectTypeId) {
    case 'damage':
      return {
        ...baseOptions,
        damageDistribution: ['front_loaded', 'back_loaded', 'even', 'random'],
        penetrationOptions: ['armor', 'resistance', 'immunity', 'absorption'],
        criticalOptions: ['increased_chance', 'bonus_damage', 'special_effect']
      };
    case 'healing':
      return {
        ...baseOptions,
        healingDistribution: ['front_loaded', 'back_loaded', 'even', 'low_health_priority'],
        overhealingOptions: ['shield', 'resource_return', 'spread_healing', 'hot'],
        criticalOptions: ['increased_chance', 'bonus_healing', 'special_effect']
      };
    case 'buff':
      return {
        ...baseOptions,
        stackingOptions: ['additive', 'multiplicative', 'independent', 'refreshing'],
        exclusivityOptions: ['exclusive_type', 'exclusive_target', 'exclusive_caster'],
        dispelOptions: ['difficulty', 'partial_dispel', 'dispel_effect', 'dispel_immunity']
      };
    case 'debuff':
      return {
        ...baseOptions,
        stackingOptions: ['additive', 'multiplicative', 'independent', 'refreshing'],
        resistanceOptions: ['resist_chance', 'partial_resist', 'immunity_breach'],
        dispelOptions: ['difficulty', 'partial_dispel', 'dispel_effect', 'dispel_consequences']
      };
    case 'utility':
      return {
        ...baseOptions,
        versatilityOptions: ['multi_purpose', 'adaptable', 'situational', 'specialized'],
        interactionOptions: ['environment', 'objects', 'creatures', 'spells'],
        discoveryOptions: ['revealed', 'hidden', 'detectable', 'undetectable']
      };
    case 'control':
      return {
        ...baseOptions,
        resistanceOptions: ['save_type', 'multiple_saves', 'partial_effect'],
        areaOptions: ['shape_control', 'size_control', 'selective'],
        durationOptions: ['concentration', 'dismissable', 'conditional']
      };
    case 'summoning':
      return {
        ...baseOptions,
        controlOptions: ['autonomous', 'directed', 'programmed', 'shared_mind'],
        durationOptions: ['temporary', 'permanent', 'conditional', 'dismissable'],
        customizationOptions: ['appearance', 'abilities', 'personality', 'loyalty']
      };
    case 'transformation':
      return {
        ...baseOptions,
        formOptions: ['preset', 'customizable', 'adaptive', 'evolving'],
        revertOptions: ['timed', 'conditional', 'damage_triggered', 'willful'],
        retentionOptions: ['skills', 'abilities', 'memories', 'none']
      };
    default:
      return baseOptions;
  }
}

function getDiceScalingForEffectType(effectTypeId) {
  const baseScaling = {
    baseDice: '2d6',
    levelScaling: {
      interval: 2, // Every 2 levels
      bonus: '1d6' // Add 1d6 per interval
    },
    attributeScaling: {
      attribute: 'primaryCastingStat',
      threshold: 4, // Every 4 points
      bonus: '1d4' // Add 1d4 per threshold
    }
  };
  
  switch (effectTypeId) {
    case 'damage':
      return {
        ...baseScaling,
        baseDice: '2d6',
        criticalScaling: {
          multiplier: 2,
          bonusDice: '2d6'
        },
        penetrationScaling: {
          basePenetration: '1d6',
          levelBonus: 1 // +1 per level
        }
      };
    case 'healing':
      return {
        ...baseScaling,
        baseDice: '2d8',
        criticalScaling: {
          multiplier: 2,
          bonusDice: '2d8'
        },
        specialScaling: {
          lowHealthBonus: '1d8', // Extra healing when target is below 30% health
          receiverAttributeBonus: true // Scale with receiver's attributes too
        }
      };
    case 'buff':
      return {
        ...baseScaling,
        baseDice: '1d6',
        durationScaling: {
          baseRounds: '2d4',
          levelBonus: 1 // +1 round per level
        },
        magnitudeScaling: {
          baseValue: '1d4',
          levelInterval: 3, // Every 3 levels
          levelBonus: '1d4' // +1d4 per interval
        }
      };
    case 'debuff':
      return {
        ...baseScaling,
        baseDice: '1d6',
        durationScaling: {
          baseRounds: '1d4',
          levelBonus: 1 // +1 round per level
        },
        resistanceScaling: {
          baseDC: '10+level',
          levelInterval: 2, // Every 2 levels
          dcBonus: 1 // +1 DC per interval
        }
      };
    case 'utility':
      return {
        ...baseScaling,
        baseDice: '1d8',
        durationScaling: {
          baseMinutes: '1d10',
          levelBonus: 5 // +5 minutes per level
        },
        rangeScaling: {
          baseRange: '2d8',
          levelInterval: 2, // Every 2 levels
          rangeBonus: '1d8' // +1d8 feet per interval
        }
      };
    case 'control':
      return {
        ...baseScaling,
        baseDice: '1d6',
        areaScaling: {
          baseArea: '2d6',
          levelInterval: 2, // Every 2 levels
          areaBonus: '1d6' // +1d6 feet per interval
        },
        durationScaling: {
          baseRounds: '1d4',
          levelBonus: 1 // +1 round per level
        }
      };
    case 'summoning':
      return {
        ...baseScaling,
        baseDice: '2d6',
        powerScaling: {
          basePower: '2d6',
          levelInterval: 1, // Every level
          powerBonus: 1 // +1 power per level
        },
        durationScaling: {
          baseMinutes: '1d10',
          levelBonus: 10 // +10 minutes per level
        }
      };
    case 'transformation':
      return {
        ...baseScaling,
        baseDice: '2d8',
        powerScaling: {
          basePower: '2d8',
          levelInterval: 2, // Every 2 levels
          powerBonus: '1d8' // +1d8 per interval
        },
        durationScaling: {
          baseMinutes: '1d6',
          levelBonus: 5 // +5 minutes per level
        }
      };
    default:
      return baseScaling;
  }
}

function getResourceOptionsForEffectType(effectTypeId) {
  const baseResourceOptions = {
    actionPoints: {
      base: effectTypeId === 'damage' || effectTypeId === 'healing' ? 2 : 1,
      scaling: 1 // Additional AP cost per magnitude increase
    },
    mana: {
      base: '1d6',
      scaling: '1d6' // Additional mana per magnitude increase
    },
    components: ['verbal', 'somatic', 'material'],
    cooldown: {
      base: 1, // Rounds
      reduction: 0.5 // Reduction per level
    }
  };
  
  switch (effectTypeId) {
    case 'damage':
      return {
        ...baseResourceOptions,
        specialCosts: [
          {
            id: 'life_tap',
            name: 'Life Tap',
            description: 'Use health instead of mana',
            costRatio: 0.5, // Half as much health as mana
            dice: '1d4' // Health cost dice
          },
          {
            id: 'soul_burn',
            name: 'Soul Burn',
            description: 'Consume soul shards for extra power',
            resourceType: 'soul_shard',
            powerBonus: '1d8' // Per soul shard consumed
          },
          {
            id: 'mana_burn',
            name: 'Mana Burn',
            description: 'Consume extra mana for additional damage',
            costMultiplier: 2, // Double mana cost
            damageMultiplier: 1.5 // 50% extra damage
          }
        ]
      };
    case 'healing':
      return {
        ...baseResourceOptions,
        specialCosts: [
          {
            id: 'martyr',
            name: 'Martyr',
            description: 'Take damage to heal others',
            healthCost: '1d6',
            healingBonus: '2d6'
          },
          {
            id: 'channel_spirit',
            name: 'Channel Spirit',
            description: 'Use spirit instead of mana',
            resourceType: 'spirit',
            costDice: '1d4',
            healingMultiplier: 1.25
          },
          {
            id: 'prayer_of_mending',
            name: 'Prayer of Mending',
            description: 'Heal bounces between injured allies',
            extraMana: '1d8',
            bounces: '1d4+1'
          }
        ]
      };
    case 'buff':
      return {
        ...baseResourceOptions,
        specialCosts: [
          {
            id: 'extended_blessing',
            name: 'Extended Blessing',
            description: 'Longer duration at cost of more mana',
            extraMana: '2d6',
            durationMultiplier: 2
          },
          {
            id: 'group_blessing',
            name: 'Group Blessing',
            description: 'Affects multiple targets',
            manaPerTarget: '1d4',
            maxTargets: '1d6+2'
          },
          {
            id: 'empowered_blessing',
            name: 'Empowered Blessing',
            description: 'Stronger effect at cost of cooldown',
            extraCooldown: '1d4',
            effectMultiplier: 1.5
          }
        ]
      };
    case 'debuff':
      return {
        ...baseResourceOptions,
        specialCosts: [
          {
            id: 'curse_transfer',
            name: 'Curse Transfer',
            description: 'Move debuff between targets',
            transferCost: '1d6',
            transferRange: '3d6'
          },
          {
            id: 'lingering_curse',
            name: 'Lingering Curse',
            description: 'Debuff lasts longer',
            extraMana: '2d6',
            durationMultiplier: 2
          },
          {
            id: 'viral_curse',
            name: 'Viral Curse',
            description: 'Debuff can spread to nearby enemies',
            extraMana: '3d6',
            spreadChance: '1d6', // Out of 20
            spreadRadius: '2d6'
          }
        ]
      };
    case 'utility':
      return {
        ...baseResourceOptions,
        specialCosts: [
          {
            id: 'ritual_casting',
            name: 'Ritual Casting',
            description: 'Cast without mana cost but takes much longer',
            timeMultiplier: 10,
            noManaCost: true
          },
          {
            id: 'arcane_efficiency',
            name: 'Arcane Efficiency',
            description: 'Reduce mana cost with skillful casting',
            intelligenceCheck: '1d20+INT',
            maxReduction: 0.5 // Maximum 50% reduction
          },
          {
            id: 'focus_item',
            name: 'Focus Item',
            description: 'Use magical item as power source',
            itemCharges: '1d6',
            manaCostMultiplier: 0.5
          }
        ]
      };
    default:
      return baseResourceOptions;
  }
}

// =====================================================================
// REFLECTION DAMAGE TYPES
// =====================================================================

export const REFLECTION_DAMAGE_TYPES = [
  ...BASE_REFLECTION_TYPES,
  {
    id: 'elemental_conversion',
    name: 'Elemental Conversion',
    description: 'Converts incoming damage to a different elemental type and reflects it back',
    icon: 'spell_fire_incinerate',
    reflectionMultiplier: 0.75,
    conversionOptions: DAMAGE_TYPES.filter(type => type.category === 'elemental').map(type => type.id),
    actionPointCost: 3
  },
  {
    id: 'delayed_reflection',
    name: 'Delayed Reflection',
    description: 'Stores damage and releases it all at once after a delay',
    icon: 'spell_shadow_deathpact',
    reflectionMultiplier: 1.25,
    delayRounds: '1d3',
    actionPointCost: 3
  },
  {
    id: 'spell_reflection',
    name: 'Spell Reflection',
    description: 'Reflects spell effects back to the caster',
    icon: 'spell_arcane_prismaticcloak',
    reflectionChance: '1d20', // Roll d20, on 18+ the spell is reflected
    durationRounds: '1d4',
    actionPointCost: 4
  },
  {
    id: 'absorbing_reflection',
    name: 'Absorbing Reflection',
    description: 'Heals for a portion of damage while reflecting the rest',
    icon: 'spell_shadow_lifedrain',
    healingPortion: 0.3, // 30% of damage becomes healing
    reflectionPortion: 0.7, // 70% is reflected
    actionPointCost: 3
  },
  {
    id: 'escalating_reflection',
    name: 'Escalating Reflection',
    description: 'Reflection becomes stronger with successive hits',
    icon: 'spell_shadow_unholyfrenzy',
    baseReflectionMultiplier: 0.5,
    perHitIncrease: 0.25, // +25% per hit
    maxReflectionMultiplier: 2.0,
    actionPointCost: 3
  }
];

// =====================================================================
// CRITICAL EFFECT MODIFIERS
// =====================================================================

export const CRITICAL_EFFECT_MODIFIERS = [
  ...BASE_CRITICAL_EFFECTS,
  {
    id: 'explosive',
    name: 'Explosive Critical',
    description: 'Critical hits create an explosion affecting nearby enemies',
    icon: 'spell_fire_selfdestruct',
    category: 'area',
    defaultChance: 100, // percent (always on crit)
    explosionDamage: '2d6',
    explosionRadius: '2d6',
    saveDC: 15,
    saveType: 'dexterity'
  },
  {
    id: 'vorpal',
    name: 'Vorpal Strike',
    description: 'Critical hits have a small chance to instantly defeat an enemy',
    icon: 'inv_sword_11',
    category: 'physical',
    defaultChance: 5, // percent (5% of crits)
    maxTargetLevel: 'equal', // Cannot work on targets higher level than caster
    saveDC: 20,
    saveType: 'constitution'
  },
  {
    id: 'resource_drain',
    name: 'Resource Drain',
    description: 'Critical hits drain resources from the target',
    icon: 'spell_shadow_lifedrain02',
    category: 'magical',
    defaultChance: 50, // percent
    resourceTypes: ['mana', 'energy', 'rage', 'action_points'],
    drainAmount: '1d6',
    resourceConversion: 0.5 // 50% of drained resources given to attacker
  },
  {
    id: 'amplified',
    name: 'Amplified Critical',
    description: 'Critical hit damage is massively increased',
    icon: 'spell_fire_flamestrike',
    category: 'damage',
    defaultChance: 15, // percent
    damageMultiplier: 3, // Triple damage instead of double
    extraDice: '3d6'
  },
  {
    id: 'phasing',
    name: 'Phasing Strike',
    description: 'Critical hits partially phase the target out of reality',
    icon: 'spell_arcane_portalshattrath',
    category: 'arcane',
    defaultChance: 25, // percent
    duration: '1d4', // rounds
    effects: ['ghostly', 'partially_incorporeal', 'can_be_seen_by_invisible'],
    saveDC: 16,
    saveType: 'wisdom'
  },
  {
    id: 'elemental_shift',
    name: 'Elemental Shift',
    description: 'Critical hits change target\'s vulnerabilities and resistances',
    icon: 'spell_nature_wispsplode',
    category: 'elemental',
    defaultChance: 30, // percent
    duration: '2d4', // rounds
    vulnerabilityDamageType: 'random', // Random elemental vulnerability
    resistanceDamageType: 'random', // Random elemental resistance
    saveDC: 14,
    saveType: 'constitution'
  },
  {
    id: 'temporal_stasis',
    name: 'Temporal Stasis',
    description: 'Critical hits temporarily freeze the target in time',
    icon: 'spell_nature_timestop',
    category: 'arcane',
    defaultChance: 10, // percent
    duration: '1d2', // rounds
    saveDC: 18,
    saveType: 'wisdom',
    cannotAffectBosses: true
  },
  {
    id: 'critical_chain',
    name: 'Critical Chain',
    description: 'Critical hits can chain to nearby enemies with reduced effect',
    icon: 'spell_frost_chainheal',
    category: 'chaining',
    defaultChance: 35, // percent
    chainTargets: '1d3',
    chainDamage: '2d6',
    chainRange: '3d6' // feet
  }
];

// =====================================================================
// ABSORPTION SHIELD TYPES
// =====================================================================

export const ABSORPTION_SHIELD_TYPES = [
  ...BASE_SHIELD_TYPES,
  {
    id: 'phase_shield',
    name: 'Phase Shield',
    description: 'Shield that phases the wearer partially out of reality, avoiding some attacks entirely',
    icon: 'spell_arcane_prismaticcloak',
    durability: 'low',
    multiplier: 0.7, // shield amount multiplier
    phaseChance: '1d20', // Roll d20, on 18+ an attack is completely avoided
    actionPointCost: 4
  },
  {
    id: 'retaliating_shield',
    name: 'Retaliating Shield',
    description: 'Shield that strikes back at attackers',
    icon: 'ability_warrior_revenge',
    durability: 'average',
    counterDamage: '1d8',
    counterRange: '2d6', // feet
    actionPointCost: 3
  },
  {
    id: 'adaptive_shield',
    name: 'Adaptive Shield',
    description: 'Shield that adapts to damage types, becoming more resistant over time',
    icon: 'spell_nature_elementalshields',
    durability: 'average',
    initialResistance: 0, // percent
    resistancePerHit: 10, // percent per hit of same damage type
    maxResistance: 75, // percent
    actionPointCost: 3
  },
  {
    id: 'mana_shield',
    name: 'Mana Shield',
    description: 'Shield that uses mana to absorb damage',
    icon: 'spell_shadow_detectlesserinvisibility',
    durability: 'high',
    manaCost: '1d4', // mana per point of damage absorbed
    conversionRatio: 3, // 1 mana absorbs 3 damage
    actionPointCost: 2
  },
  {
    id: 'life_shield',
    name: 'Life Shield',
    description: 'Shield tied to life force, providing massive protection but at health cost',
    icon: 'spell_holy_sealofsacrifice',
    durability: 'very high',
    multiplier: 2.0, // shield amount multiplier
    healthCost: '1d6', // health lost when shield breaks
    healthDrain: 1, // health per round while active
    actionPointCost: 3
  },
  {
    id: 'prismatic_shield',
    name: 'Prismatic Shield',
    description: 'Multi-layered shield that provides different protections',
    icon: 'spell_holy_greaterblessingoflight',
    durability: 'high',
    layerCount: 3,
    layerTypes: ['physical', 'elemental', 'magical'],
    specialEffect: 'Each layer provides immunity to a different damage category',
    actionPointCost: 5
  },
  {
    id: 'transferring_shield',
    name: 'Transferring Shield',
    description: 'Shield that can be transferred between allies',
    icon: 'spell_holy_powerwordshield',
    durability: 'average',
    transferRange: '3d6', // feet
    transferActionPoints: 1,
    actionPointCost: 3
  },
  {
    id: 'vampiric_shield',
    name: 'Vampiric Shield',
    description: 'Shield that heals the wearer based on damage absorbed',
    icon: 'spell_shadow_lifedrain',
    durability: 'below average',
    multiplier: 0.7, // shield amount multiplier
    healingRatio: 0.3, // 30% of absorbed damage becomes healing
    actionPointCost: 3
  }
];

// =====================================================================
// CHAIN EFFECT PROPERTIES
// =====================================================================

export const CHAIN_EFFECT_PROPERTIES = {
  damageChain: {
    baseJumpDistance: '2d6', // feet
    maxJumpDistance: '6d6', // feet
    falloffTypes: [
      {
        id: 'linear',
        name: 'Linear Reduction',
        description: 'Each jump reduces damage by a fixed amount',
        icon: 'spell_frost_chainofdamnation',
        reductionPerJump: '1d6'
      },
      {
        id: 'percentage',
        name: 'Percentage Reduction',
        description: 'Each jump reduces damage by a percentage',
        icon: 'spell_frost_chainheal',
        percentageReduction: 25 // percent
      },
      {
        id: 'dice_reduction',
        name: 'Dice Reduction',
        description: 'Each jump reduces the number of dice rolled',
        icon: 'spell_frost_wizardmark',
        diceReduction: 1 // remove 1 die per jump
      },
      {
        id: 'stepped',
        name: 'Stepped Reduction',
        description: 'Damage falls off sharply after a certain number of jumps',
        icon: 'spell_frost_glacialspike',
        fullEffectJumps: 2, // Full damage for first 2 jumps
        afterStepReduction: 50 // percent reduction after step
      },
      {
        id: 'accelerating',
        name: 'Accelerating Reduction',
        description: 'Damage falls off faster with each jump',
        icon: 'spell_frost_iceshock',
        firstJumpReduction: 10, // percent
        accelerationRate: 10 // additional percent per jump
      }
    ],
    targetSelectionMethods: [
      {
        id: 'nearest',
        name: 'Nearest',
        description: 'Chains to the nearest valid target',
        icon: 'ability_hunter_snipershot'
      },
      {
        id: 'random',
        name: 'Random',
        description: 'Chains to a random valid target within range',
        icon: 'spell_arcane_portallimestone'
      },
      {
        id: 'highest_health',
        name: 'Highest Health',
        description: 'Chains to the target with the most health',
        icon: 'spell_holy_sealofsacrifice'
      },
      {
        id: 'lowest_health',
        name: 'Lowest Health',
        description: 'Chains to the target with the least health',
        icon: 'spell_holy_sealofsalvation'
      },
      {
        id: 'highest_threat',
        name: 'Highest Threat',
        description: 'Chains to the target with the highest threat level',
        icon: 'ability_warrior_challange'
      }
    ],
    chainEffects: [
      {
        id: 'stun_chain',
        name: 'Stunning Chain',
        description: 'Each jump has a chance to stun the target',
        icon: 'spell_frost_stun',
        effectChance: 20, // percent
        effectDuration: '1d2' // rounds
      },
      {
        id: 'slow_chain',
        name: 'Slowing Chain',
        description: 'Each jump slows the target\'s movement',
        icon: 'spell_frost_frostshock',
        effectChance: 100, // percent (always applies)
        movementReduction: 30, // percent
        effectDuration: '1d4' // rounds
      },
      {
        id: 'elemental_chain',
        name: 'Elemental Chain',
        description: 'Damage type changes with each jump',
        icon: 'spell_fire_sealoffire',
        elementalProgression: ['fire', 'cold', 'lightning', 'acid']
      },
      {
        id: 'amplifying_chain',
        name: 'Amplifying Chain',
        description: 'In rare cases, a jump can actually increase in power',
        icon: 'spell_fire_selfdestruct',
        amplificationChance: 10, // percent
        amplificationMultiplier: 1.5
      },
      {
        id: 'seeking_chain',
        name: 'Seeking Chain',
        description: 'Chain can navigate around obstacles to find targets',
        icon: 'ability_hunter_mastermarksman',
        pathfindingBonus: '1d6', // bonus feet for pathing
        ignoresCover: 'partial' // partial, full, or none
      }
    ]
  },
  healingChain: {
    baseJumpDistance: '2d6', // feet
    maxJumpDistance: '6d6', // feet
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
    chainEffects: [
      {
        id: 'cleansing_chain',
        name: 'Cleansing Chain',
        description: 'Each jump has a chance to remove harmful effects',
        icon: 'spell_holy_dispelmagic',
        cleansePower: 1, // number of effects removed
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
        description: 'Each jump provides temporary damage reduction',
        icon: 'spell_holy_devotionaura',
        damageReduction: 10, // percent
        fortifyDuration: '1d4' // rounds
      }
    ]
  },
  utilityChain: {
    baseJumpDistance: '3d6', // feet
    maxJumpDistance: '8d6', // feet
    effectTransformation: [
      {
        id: 'diminishing',
        name: 'Diminishing Effect',
        description: 'Effect power diminishes with each jump',
        icon: 'spell_shadow_teleport',
        powerReduction: 20 // percent per jump
      },
      {
        id: 'transforming',
        name: 'Transforming Effect',
        description: 'Effect transforms into a different type with each jump',
        icon: 'spell_nature_wispsplode',
        transformationSequence: ['buff', 'movement', 'control', 'reveal']
      },
      {
        id: 'specializing',
        name: 'Specializing Effect',
        description: 'Effect becomes more specialized but less powerful',
        icon: 'spell_arcane_focusedpower',
        generalistToSpecialist: true,
        powerAdjustment: -10 // percent per jump
      },
      {
        id: 'randomizing',
        name: 'Randomizing Effect',
        description: 'Effect randomly changes with each jump',
        icon: 'spell_arcane_portallimestone',
        randomEffectTable: '1d6', // roll to determine effect
        effectDuration: '1d4' // rounds
      },
      {
        id: 'compounding',
        name: 'Compounding Effect',
        description: 'Different but complementary effects stack with each jump',
        icon: 'spell_arcane_arcane03',
        effectSequence: ['speed', 'jump', 'invisibility', 'flight']
      }
    ],
    targetSelectionMethods: [
      {
        id: 'radial',
        name: 'Radial Spread',
        description: 'Effects radiate outward in sequence',
        icon: 'spell_arcane_blast'
      },
      {
        id: 'role_based',
        name: 'Role Based',
        description: 'Targets selected based on role',
        icon: 'spell_holy_auramastery'
      },
      {
        id: 'stat_priority',
        name: 'Stat Priority',
        description: 'Targets selected based on highest relevant stats',
        icon: 'spell_arcane_mindmastery'
      },
      {
        id: 'conditional',
        name: 'Conditional',
        description: 'Targets selected based on conditions (movement, casting, etc.)',
        icon: 'spell_nature_faeriefire'
      },
      {
        id: 'strategic',
        name: 'Strategic',
        description: 'Targets selected based on tactical positioning',
        icon: 'ability_hunter_mastermarksman'
      }
    ]
  }
};

// =====================================================================
// RESOURCE INTERACTIONS
// =====================================================================

export const RESOURCE_INTERACTIONS = {
  actionPoints: {
    baseTypes: [
      {
        id: 'standard',
        name: 'Standard Cost',
        description: 'Effect costs a fixed amount of action points',
        icon: 'spell_nature_timestop',
        costCalculation: 'fixed',
        refundOnFail: true
      },
      {
        id: 'variable',
        name: 'Variable Cost',
        description: 'Effect costs a variable amount of action points based on power',
        icon: 'spell_arcane_focusedpower',
        costCalculation: 'scaled',
        baseCost: 1,
        scaleFactor: 1 // +1 AP per power level
      },
      {
        id: 'discounted',
        name: 'Discounted Cost',
        description: 'Effect costs less AP under certain conditions',
        icon: 'spell_arcane_arcane01',
        baseCost: 2,
        discountConditions: ['specialization', 'environment', 'target_type'],
        maxDiscount: 1
      },
      {
        id: 'invested',
        name: 'Invested Cost',
        description: 'Effect strength depends on APs invested at cast time',
        icon: 'spell_arcane_invocation',
        minCost: 1,
        maxCost: 5,
        powerPerAP: '1d6'
      }
    ],
    advancedTypes: [
      {
        id: 'delayed_refund',
        name: 'Delayed Refund',
        description: 'Some action points are refunded after a delay',
        icon: 'spell_holy_borrowedtime',
        initialCost: 4,
        refundAmount: 2,
        refundDelay: '1d4' // rounds
      },
      {
        id: 'conditional_cost',
        name: 'Conditional Cost',
        description: 'Action point cost varies based on conditions',
        icon: 'spell_arcane_massteleport',
        baseCost: 2,
        conditions: [
          { name: 'in_combat', modifier: 1 }, // +1 AP in combat
          { name: 'injured', modifier: -1 }, // -1 AP when injured
          { name: 'at_night', modifier: -1 } // -1 AP at night
        ]
      },
      {
        id: 'borrowed_points',
        name: 'Borrowed Points',
        description: 'Use future action points now, limiting actions next round',
        icon: 'spell_holy_sealofsacrifice',
        borrowAmount: '1d3',
        repaymentPeriod: 2 // rounds
      },
      {
        id: 'shared_cost',
        name: 'Shared Cost',
        description: 'Action point cost is shared among multiple casters',
        icon: 'spell_holy_prayerofhealing',
        baseCost: 4,
        minPerCaster: 1,
        maxCasters: 4
      },
      {
        id: 'progressive_cost',
        name: 'Progressive Cost',
        description: 'Action point cost increases with repeated use',
        icon: 'spell_arcane_starfire',
        initialCost: 1,
        incrementPerUse: 1,
        resetTime: '1d10' // minutes
      }
    ]
  },
  mana: {
    baseTypes: [
      {
        id: 'fixed_mana',
        name: 'Fixed Mana Cost',
        description: 'Spell costs a fixed amount of mana',
        icon: 'spell_arcane_focusedpower',
        costCalculation: 'fixed',
        manaCost: '2d6'
      },
      {
        id: 'percentage_mana',
        name: 'Percentage Mana Cost',
        description: 'Spell costs a percentage of maximum mana',
        icon: 'spell_frost_wizardmark',
        costCalculation: 'percentage',
        percentageCost: 15 // percent of max mana
      },
      {
        id: 'scaling_mana',
        name: 'Scaling Mana Cost',
        description: 'Mana cost scales with spell power or effect magnitude',
        icon: 'spell_arcane_blast',
        costCalculation: 'scaled',
        baseCost: '1d6',
        costPerMagnitude: '1d4'
      },
      {
        id: 'channeled_mana',
        name: 'Channeled Mana Cost',
        description: 'Spell drains mana continuously while channeled',
        icon: 'spell_arcane_mindmastery',
        initialCost: '2d6',
        costPerSecond: '1d4'
      }
    ],
    advancedTypes: [
      {
        id: 'mana_conversion',
        name: 'Mana Conversion',
        description: 'Convert mana to a different resource or effect',
        icon: 'spell_shadow_lifedrain',
        costCalculation: 'variable',
        conversionRatio: 2, // 1 mana = 2 units of target resource/effect
        conversionTypes: ['health', 'shield', 'damage', 'duration']
      },
      {
        id: 'mana_sacrifice',
        name: 'Mana Sacrifice',
        description: 'Sacrifice mana for greatly enhanced effects',
        icon: 'spell_shadow_demonform',
        costCalculation: 'sacrifice',
        sacrificeAmount: '4d6',
        powerMultiplier: 2,
        sacrificeLimit: 50 // percent of max mana
      },
      {
        id: 'mana_efficiency',
        name: 'Mana Efficiency',
        description: 'Reduced mana cost based on casting skill',
        icon: 'spell_arcane_arcane01',
        baseCost: '3d6',
        skillCheckAttribute: 'intelligence',
        maxReduction: 50 // percent
      },
      {
        id: 'mana_cycling',
        name: 'Mana Cycling',
        description: 'Portion of mana is refunded after spell completion',
        icon: 'spell_holy_blessedrecovery',
        initialCost: '4d6',
        refundPercentage: 30 // percent
      },
      {
        id: 'resonant_casting',
        name: 'Resonant Casting',
        description: 'Spell becomes more mana efficient when cast multiple times',
        icon: 'spell_arcane_invocation',
        initialCost: '3d6',
        reductionPerCast: 10, // percent
        maxReduction: 40, // percent
        resetTime: 5 // minutes
      }
    ]
  },
  health: {
    types: [
      {
        id: 'blood_magic',
        name: 'Blood Magic',
        description: 'Use health instead of mana to cast spells',
        icon: 'spell_shadow_lifedrain',
        healthCost: '1d8',
        conversionRatio: 2, // 1 health = 2 mana
        maximumHealthCost: 30 // percent of max health
      },
      {
        id: 'life_tap',
        name: 'Life Tap',
        description: 'Convert health to mana',
        icon: 'spell_shadow_burningspirit',
        healthCost: '2d6',
        manaGained: '3d6',
        cooldownRounds: '1d4'
      },
      {
        id: 'sacrifice',
        name: 'Sacrifice',
        description: 'Sacrifice health for greatly enhanced spell effects',
        icon: 'spell_shadow_deathpact',
        healthCost: '3d6',
        powerMultiplier: 2,
        cooldownMinutes: '1d10'
      },
      {
        id: 'life_link',
        name: 'Life Link',
        description: 'Link health with target, sharing damage and healing',
        icon: 'spell_holy_sealofsacrifice',
        linkPercentage: 30, // percent shared
        range: '3d6', // feet
        durationRounds: '2d6'
      },
      {
        id: 'vitality_transfer',
        name: 'Vitality Transfer',
        description: 'Transfer health between targets',
        icon: 'spell_holy_layonhands',
        transferAmount: '4d6',
        range: '2d6', // feet
        willingSacrifice: true // target must be willing
      }
    ]
  },
  hybrid: {
    types: [
      {
        id: 'dual_cost',
        name: 'Dual Cost',
        description: 'Spell requires both mana and action points',
        icon: 'spell_arcane_invocation',
        apCost: 2,
        manaCost: '2d6'
      },
      {
        id: 'flexible_cost',
        name: 'Flexible Cost',
        description: 'Choose to pay with mana or action points or both',
        icon: 'spell_arcane_massteleport',
        totalCostValue: 4,
        minApCost: 1,
        minManaCost: '1d6'
      },
      {
        id: 'material_components',
        name: 'Material Components',
        description: 'Requires physical items in addition to other costs',
        icon: 'inv_misc_gem_01',
        apCost: 1,
        manaCost: '1d6',
        materials: [
          { name: 'rare_herb', consumedOnCast: true },
          { name: 'crystal_focus', consumedOnCast: false }
        ]
      },
      {
        id: 'cooldown_based',
        name: 'Cooldown Based',
        description: 'Low resource cost but with significant cooldown',
        icon: 'spell_holy_borrowedtime',
        apCost: 1,
        manaCost: '1d4',
        cooldownRounds: '1d6+2'
      },
      {
        id: 'combo_points',
        name: 'Combo Points',
        description: 'Effect enhanced by combo points generated from other abilities',
        icon: 'ability_rogue_eviscerate',
        baseApCost: 1,
        baseManaCost: '1d4',
        pointsRequired: '1d5',
        powerPerPoint: '1d6'
      }
    ]
  }
};

// =====================================================================
// PROC EFFECT TYPES
// =====================================================================

export const PROC_EFFECT_TYPES = [
  {
    id: 'on_hit',
    name: 'On Hit',
    description: 'Effect has a chance to trigger when an attack hits',
    icon: 'ability_warrior_decisivestrike',
    procChance: 20, // percent
    cooldown: '1d4', // rounds between possible procs
    effects: [
      {
        id: 'bonus_damage',
        name: 'Bonus Damage',
        description: 'Deal additional damage on proc',
        damageAmount: '2d6',
        damageType: 'same' // same as triggering attack
      },
      {
        id: 'status_effect',
        name: 'Status Effect',
        description: 'Apply a status effect on proc',
        effectType: 'random', // random negative effect
        duration: '1d4' // rounds
      },
      {
        id: 'resource_gain',
        name: 'Resource Gain',
        description: 'Gain resources on proc',
        resourceType: 'action_points',
        resourceAmount: 1
      }
    ]
  },
  {
    id: 'on_crit',
    name: 'On Critical Hit',
    description: 'Effect triggers when a critical hit is scored',
    icon: 'ability_rogue_findweakness',
    procChance: 100, // percent (always on crit)
    effects: [
      {
        id: 'execute',
        name: 'Execute',
        description: 'Deal massive damage to low health targets',
        healthThreshold: 20, // percent
        damageMultiplier: 3
      },
      {
        id: 'stun',
        name: 'Stunning Strike',
        description: 'Stun the target',
        duration: '1d2', // rounds
        saveDC: 15
      },
      {
        id: 'hemorrhage',
        name: 'Hemorrhage',
        description: 'Cause bleeding damage over time',
        damageAmount: '1d6',
        duration: '1d4+1' // rounds
      }
    ]
  },
  {
    id: 'on_kill',
    name: 'On Kill',
    description: 'Effect triggers when defeating an enemy',
    icon: 'ability_warrior_decapitate',
    procChance: 100, // percent (always on kill)
    effects: [
      {
        id: 'soul_harvest',
        name: 'Soul Harvest',
        description: 'Gain health on kill',
        healthAmount: '2d8',
        scaling: 'targetLevel' // scales with target level
      },
      {
        id: 'bloodlust',
        name: 'Bloodlust',
        description: 'Gain attack bonus on kill',
        bonusAmount: '1d4',
        duration: '1d4' // rounds
      },
      {
        id: 'chain_kill',
        name: 'Chain Kill',
        description: 'Reset cooldowns on kill',
        cooldownReduction: '1d4' // rounds
      }
    ]
  },
  {
    id: 'on_damage_taken',
    name: 'On Damage Taken',
    description: 'Effect triggers when taking damage',
    icon: 'spell_holy_sealofprotection',
    procChance: 30, // percent
    cooldown: '1d4', // rounds
    effects: [
      {
        id: 'retribution',
        name: 'Retribution',
        description: 'Deal damage back to attacker',
        damageAmount: '2d6',
        damageType: 'radiant'
      },
      {
        id: 'tactical_retreat',
        name: 'Tactical Retreat',
        description: 'Gain movement effect when hit',
        movementType: 'disengage',
        distance: '2d6' // feet
      },
      {
        id: 'adaptive_defense',
        name: 'Adaptive Defense',
        description: 'Gain resistance to the damage type that hit you',
        resistanceAmount: 30, // percent
        duration: '1d6' // rounds
      }
    ]
  },
  {
    id: 'on_heal',
    name: 'On Heal',
    description: 'Effect triggers when healing is applied',
    icon: 'spell_holy_flashheal',
    procChance: 25, // percent
    effects: [
      {
        id: 'healing_surge',
        name: 'Healing Surge',
        description: 'Healing is amplified',
        amplificationAmount: 50, // percent
      },
      {
        id: 'protective_barrier',
        name: 'Protective Barrier',
        description: 'Target gains a protective shield',
        shieldAmount: '2d6',
        duration: '1d4' // rounds
      },
      {
        id: 'cleansing_light',
        name: 'Cleansing Light',
        description: 'Remove negative status effects',
        cleansePower: 1 // number of effects removed
      }
    ]
  },
  {
    id: 'on_spell_cast',
    name: 'On Spell Cast',
    description: 'Effect triggers when casting a spell',
    icon: 'spell_arcane_arcane03',
    procChance: 15, // percent
    effects: [
      {
        id: 'arcane_surge',
        name: 'Arcane Surge',
        description: 'Next spell costs less mana',
        manaReduction: 50, // percent
        duration: 1 // rounds
      },
      {
        id: 'spell_echo',
        name: 'Spell Echo',
        description: 'Cast the same spell again for free',
        powerReduction: 30 // percent reduced effect
      },
      {
        id: 'magical_insight',
        name: 'Magical Insight',
        description: 'Gain temporary spellcasting bonus',
        bonusAmount: '1d4',
        duration: '1d6' // rounds
      }
    ]
  },
  {
    id: 'on_movement',
    name: 'On Movement',
    description: 'Effect triggers when moving',
    icon: 'ability_rogue_sprint',
    procChance: 20, // percent
    cooldown: '1d4', // rounds
    effects: [
      {
        id: 'windstep',
        name: 'Windstep',
        description: 'Gain bonus movement speed',
        speedBonus: 50, // percent
        duration: '1d4' // rounds
      },
      {
        id: 'afterimage',
        name: 'Afterimage',
        description: 'Leave behind an illusion that distracts enemies',
        distractionDuration: '1d4', // rounds
        distractionChance: 40 // percent chance to distract
      },
      {
        id: 'ground_slam',
        name: 'Ground Slam',
        description: 'Create shockwave that damages nearby enemies',
        damageAmount: '2d6',
        radius: '1d6+5' // feet
      }
    ]
  },
  {
    id: 'on_status_effect',
    name: 'On Status Effect',
    description: 'Effect triggers when a status effect is applied or removed',
    icon: 'spell_holy_dispelmagic',
    procChance: 40, // percent
    effects: [
      {
        id: 'adaptation',
        name: 'Adaptation',
        description: 'Gain resistance to the status effect type',
        resistanceAmount: 50, // percent
        duration: '2d6' // rounds
      },
      {
        id: 'reverse_effect',
        name: 'Reverse Effect',
        description: 'Turn negative status effects into positive ones',
        conversionChance: 50, // percent
        conversionPower: '1d4'
      },
      {
        id: 'status_reflection',
        name: 'Status Reflection',
        description: 'Reflect status effects back to the source',
        reflectionChance: 60, // percent
        reflectionDuration: '1d4' // rounds
      }
    ]
  }
];

// =====================================================================
// SPELL TEMPLATES
// =====================================================================

export const SPELL_TEMPLATES = [
  {
    id: 'fireball',
    name: 'Fireball',
    description: 'A classic explosive ball of fire that damages all enemies in the target area',
    icon: 'spell_fire_flamebolt',
    level: 3,
    effectTypes: ['damage'],
    damageConfig: {
      damageTypes: ['fire'],
      diceNotation: '8d6',
      useChainEffect: false,
      useCriticalEffect: true,
      criticalConfig: {
        criticalMultiplier: 2,
        criticalDiceOnly: true,
        effects: ['explosive']
      }
    },
    targetingConfig: {
      targetingType: 'area',
      areaShape: 'sphere',
      areaSize: 20
    },
    durationConfig: {
      durationType: 'instant',
      durationValue: 0,
      requiresConcentration: false
    },
    persistentConfig: {
      isPersistent: true,
      persistentType: 'dot',
      tickFrequency: 'start_of_turn',
      tickDuration: 1
    }
  },
  {
    id: 'chain_lightning',
    name: 'Chain Lightning',
    description: 'A bolt of lightning that arcs from the primary target to nearby enemies',
    icon: 'spell_lightning_lightningbolt01',
    level: 5,
    effectTypes: ['damage'],
    damageConfig: {
      damageTypes: ['lightning'],
      diceNotation: '10d6',
      useChainEffect: true,
      chainConfig: {
        targets: 3,
        falloffType: 'percentage',
        falloffRate: 30,
        minimumDamage: '2d6'
      },
      useCriticalEffect: true,
      criticalConfig: {
        criticalMultiplier: 2,
        criticalDiceOnly: true,
        effects: ['stun']
      }
    },
    targetingConfig: {
      targetingType: 'single',
      areaShape: null,
      areaSize: 0
    },
    durationConfig: {
      durationType: 'instant',
      durationValue: 0,
      requiresConcentration: false
    }
  },
  {
    id: 'healing_word',
    name: 'Healing Word',
    description: 'A swift healing spell that restores hit points to a target',
    icon: 'spell_holy_flashheal',
    level: 1,
    effectTypes: ['healing'],
    healingConfig: {
      healingType: 'direct',
      diceNotation: '1d4+4',
      useAbsorptionShield: false
    },
    targetingConfig: {
      targetingType: 'single',
      areaShape: null,
      areaSize: 0
    },
    durationConfig: {
      durationType: 'instant',
      durationValue: 0,
      requiresConcentration: false
    }
  },
  {
    id: 'mass_healing_word',
    name: 'Mass Healing Word',
    description: 'A spell that heals multiple targets within range',
    icon: 'spell_holy_prayerofhealing',
    level: 3,
    effectTypes: ['healing'],
    healingConfig: {
      healingType: 'direct',
      diceNotation: '3d4+4',
      useAbsorptionShield: false
    },
    targetingConfig: {
      targetingType: 'multi',
      targetCount: 6,
      areaShape: null,
      areaSize: 0
    },
    durationConfig: {
      durationType: 'instant',
      durationValue: 0,
      requiresConcentration: false
    }
  },
  {
    id: 'shield',
    name: 'Shield',
    description: 'Creates a protective barrier around the target that absorbs damage',
    icon: 'spell_holy_powerwordshield',
    level: 2,
    effectTypes: ['healing'],
    healingConfig: {
      healingType: 'direct',
      diceNotation: '2d4+4',
      useAbsorptionShield: true,
      shieldConfig: {
        shieldType: 'standard',
        shieldAmount: '5d8+10',
        reflectionType: null,
        reflectionAmount: 0
      }
    },
    targetingConfig: {
      targetingType: 'single',
      areaShape: null,
      areaSize: 0
    },
    durationConfig: {
      durationType: 'minutes',
      durationValue: 10,
      requiresConcentration: false
    }
  },
  {
    id: 'bless',
    name: 'Bless',
    description: 'Blesses up to three creatures, granting them bonuses to attacks and saving throws',
    icon: 'spell_holy_blessingofstrength',
    level: 1,
    effectTypes: ['buff'],
    buffConfig: {
      statModifiers: {
        attack_bonus: 4,
        save_bonus: 4
      },
      statusEffects: ['blessed'],
      effectParameters: {
        blessed: {
          effectDice: '1d4',
          dieSize: 4,
          affectsAttacks: true,
          affectsSaves: true
        }
      }
    },
    targetingConfig: {
      targetingType: 'multi',
      targetCount: 3,
      areaShape: null,
      areaSize: 0
    },
    durationConfig: {
      durationType: 'minutes',
      durationValue: 60,
      requiresConcentration: true
    }
  },
  {
    id: 'haste',
    name: 'Haste',
    description: 'Imbues a creature with preternatural speed, doubling its combat capabilities',
    icon: 'ability_rogue_sprint',
    level: 3,
    effectTypes: ['buff'],
    buffConfig: {
      statModifiers: {
        attack_bonus: 2,
        action_point_regen: 2
      },
      statusEffects: ['haste'],
      effectParameters: {
        haste: {
          speedMultiplier: 2,
          extraAction: true,
          dexSaveAdvantage: true
        }
      }
    },
    targetingConfig: {
      targetingType: 'single',
      areaShape: null,
      areaSize: 0
    },
    durationConfig: {
      durationType: 'minutes',
      durationValue: 10,
      requiresConcentration: true
    }
  },
  {
    id: 'hold_person',
    name: 'Hold Person',
    description: 'Paralyzes a humanoid, rendering them unable to act',
    icon: 'spell_nature_stranglevines',
    level: 2,
    effectTypes: ['debuff'],
    debuffConfig: {
      statModifiers: {},
      statusEffects: ['paralyzed'],
      effectParameters: {
        paralyzed: {
          paralysisDuration: 10,
          paralysisType: 'magical',
          allowMental: false
        }
      }
    },
    targetingConfig: {
      targetingType: 'single',
      areaShape: null,
      areaSize: 0
    },
    durationConfig: {
      durationType: 'minutes',
      durationValue: 1,
      requiresConcentration: true
    }
  },
  {
    id: 'slow',
    name: 'Slow',
    description: 'Alters time around targets, drastically reducing their speed and combat capabilities',
    icon: 'spell_frost_frostshock',
    level: 3,
    effectTypes: ['debuff'],
    debuffConfig: {
      statModifiers: {
        attack_bonus: -2,
        action_point_regen: -1
      },
      statusEffects: ['slowed'],
      effectParameters: {
        slowed: {
          speedReduction: 50,
          actionPointReduction: 1,
          attackPenalty: -2
        }
      }
    },
    targetingConfig: {
      targetingType: 'area',
      areaShape: 'cube',
      areaSize: 40
    },
    durationConfig: {
      durationType: 'minutes',
      durationValue: 1,
      requiresConcentration: true
    }
  },
  {
    id: 'fly',
    name: 'Fly',
    description: 'Grants the ability of flight to a willing creature',
    icon: 'ability_mount_flyingcarpet',
    level: 3,
    effectTypes: ['utility'],
    utilityConfig: {
      utilityType: 'movement',
      utilitySubtype: 'flight',
      parameters: {
        flightSpeed: 60,
        maxAltitude: 120,
        flightType: 'magical'
      }
    },
    targetingConfig: {
      targetingType: 'single',
      areaShape: null,
      areaSize: 0
    },
    durationConfig: {
      durationType: 'minutes',
      durationValue: 10,
      requiresConcentration: true
    }
  },
  {
    id: 'wall_of_fire',
    name: 'Wall of Fire',
    description: 'Creates a wall of fire that damages creatures passing through it',
    icon: 'spell_fire_firetotem',
    level: 4,
    effectTypes: ['damage', 'control'],
    damageConfig: {
      damageTypes: ['fire'],
      diceNotation: '5d8',
      useChainEffect: false,
      useCriticalEffect: false
    },
    targetingConfig: {
      targetingType: 'area',
      areaShape: 'wall',
      areaSize: 60
    },
    durationConfig: {
      durationType: 'minutes',
      durationValue: 1,
      requiresConcentration: true
    },
    persistentConfig: {
      isPersistent: true,
      persistentType: 'trigger',
      triggerCondition: 'proximity',
      tickDamage: '5d8'
    }
  },
  {
    id: 'mirror_image',
    name: 'Mirror Image',
    description: 'Creates illusory duplicates of yourself to confuse enemies',
    icon: 'spell_shadow_demoniccirclesummon',
    level: 2,
    effectTypes: ['summoning', 'utility'],
    summoningConfig: {
      creatureType: 'illusion',
      creatureCount: '1d4+2',
      creatureHealth: 1,
      creatureAC: '10+DEX'
    },
    utilityConfig: {
      utilityType: 'illusion',
      utilitySubtype: 'visual',
      parameters: {
        illusionType: 'creature',
        complexity: 7,
        movement: true,
        interactivity: 3
      }
    },
    targetingConfig: {
      targetingType: 'self',
      areaShape: null,
      areaSize: 0
    },
    durationConfig: {
      durationType: 'minutes',
      durationValue: 1,
      requiresConcentration: false
    }
  },
  {
    id: 'polymorph',
    name: 'Polymorph',
    description: 'Transforms a creature into a new form',
    icon: 'spell_nature_polymorph',
    level: 4,
    effectTypes: ['transformation'],
    transformationConfig: {
      formType: 'beast',
      maxCR: 'level/3',
      retainMemories: true,
      retainPersonality: true
    },
    targetingConfig: {
      targetingType: 'single',
      areaShape: null,
      areaSize: 0
    },
    durationConfig: {
      durationType: 'hours',
      durationValue: 1,
      requiresConcentration: true
    }
  }
];

// =====================================================================
// UTILITY FUNCTIONS
// =====================================================================

export function getEnhancedEffectIcon(effectId, enhancementId = null) {
  const effectType = ENHANCED_EFFECT_TYPES.find(type => type.id === effectId);
  if (!effectType) return null;

  if (enhancementId) {
    const enhancement = effectType.enhancements.find(e => e.id === enhancementId);
    return enhancement ? getWowIconPath(enhancement.icon) : getWowIconPath(effectType.icon);
  }

  return getWowIconPath(effectType.icon);
}

export function getReflectionTypeById(reflectionId) {
  return REFLECTION_DAMAGE_TYPES.find(type => type.id === reflectionId) || null;
}

export function getCriticalEffectById(criticalId) {
  return CRITICAL_EFFECT_MODIFIERS.find(effect => effect.id === criticalId) || null;
}

export function getShieldTypeById(shieldId) {
  return ABSORPTION_SHIELD_TYPES.find(shield => shield.id === shieldId) || null;
}

export function getSpellTemplateById(templateId) {
  return SPELL_TEMPLATES.find(template => template.id === templateId) || null;
}

export function getProcEffectById(procId) {
  return PROC_EFFECT_TYPES.find(proc => proc.id === procId) || null;
}

// =====================================================================
// ENHANCED EFFECT UTILITIES
// =====================================================================

export const EnhancedEffectUtils = {
  /**
   * Calculate damage reduction for chain effects
   */
  calculateChainReduction: (baseValue, jumpIndex, falloffConfig) => {
    const { falloffType, falloffRate } = falloffConfig;
    
    if (jumpIndex === 0) {
      return baseValue; // No reduction on first target
    }
    
    switch (falloffType) {
      case 'percentage':
        // Each jump reduces by a percentage
        return baseValue * Math.pow(1 - (falloffRate / 100), jumpIndex);
        
      case 'linear':
        // Fixed reduction per jump, minimum 0
        const linearReduction = jumpIndex * falloffRate;
        return Math.max(0, baseValue - linearReduction);
        
      case 'dice_reduction':
        // Reduce number of dice per jump
        if (typeof baseValue === 'string' && isValidDiceNotation(baseValue)) {
          const parsed = parseDiceNotation(baseValue);
          if (parsed && parsed.type !== 'complex') {
            const newCount = Math.max(1, parsed.count - (jumpIndex * falloffRate));
            return `${newCount}d${parsed.sides}${parsed.modifier !== 0 ? (parsed.modifier > 0 ? '+' + parsed.modifier : parsed.modifier) : ''}`;
          }
        }
        // Fallback to percentage if not a valid dice notation
        return baseValue * Math.pow(0.75, jumpIndex);
        
      case 'stepped':
        // Full value up to a threshold, then sharp reduction
        const { fullEffectJumps, afterStepReduction } = falloffConfig;
        if (jumpIndex <= fullEffectJumps) {
          return baseValue;
        }
        return baseValue * (1 - (afterStepReduction / 100));
        
      case 'accelerating':
        // Reduction increases with each jump
        const { firstJumpReduction, accelerationRate } = falloffConfig;
        const reduction = firstJumpReduction + (accelerationRate * (jumpIndex - 1));
        return baseValue * (1 - (reduction / 100));
        
      default:
        // Default to 25% reduction per jump
        return baseValue * Math.pow(0.75, jumpIndex);
    }
  },
  
  /**
   * Get a human-readable description of a chain effect
   */
  getChainDescription: (chainConfig, effectType = 'damage') => {
    const chainTypes = CHAIN_EFFECT_PROPERTIES[`${effectType}Chain`] || CHAIN_EFFECT_PROPERTIES.damageChain;
    const falloffType = chainTypes.falloffTypes.find(type => type.id === chainConfig.falloffType);
    
    let description = `Chains to up to ${chainConfig.targets} additional targets. `;
    
    if (falloffType) {
      description += falloffType.description + '. ';
    } else {
      description += `Each jump reduces ${effectType} by ${chainConfig.falloffRate}%. `;
    }
    
    if (chainConfig.minimumDamage) {
      const minAvg = getAverageRoll(chainConfig.minimumDamage);
      description += `Minimum ${effectType} of ${minAvg} per target.`;
    }
    
    return description;
  },
  
  /**
   * Get a human-readable description of a critical effect
   */
  getCriticalEffectDescription: (criticalConfig) => {
    const effects = criticalConfig.effects.map(effectId => {
      const effect = getCriticalEffectById(effectId);
      return effect ? effect.description : null;
    }).filter(Boolean);
    
    let description = `On a critical hit, damage is ${criticalConfig.criticalDiceOnly ? 'partially' : 'fully'} multiplied by ${criticalConfig.criticalMultiplier}×`;
    
    if (criticalConfig.extraDice) {
      const extraAvg = getAverageRoll(criticalConfig.extraDice);
      description += ` and deals an additional ${extraAvg} damage`;
    }
    
    if (effects.length > 0) {
      description += `. Additionally, critical hits may ${effects.join(' or ')}.`;
    } else {
      description += '.';
    }
    
    return description;
  },
  
  /**
   * Get a human-readable description of resource costs
   */
  getResourceCostDescription: (resourceConfig, effectType) => {
    const effectData = ENHANCED_EFFECT_TYPES.find(type => type.id === effectType);
    
    if (!effectData) {
      return 'Unknown resource cost.';
    }
    
    const apCost = effectData.actionPointCost || 1;
    let description = `Costs ${apCost} action points`;
    
    if (resourceConfig.mana) {
      if (isValidDiceNotation(resourceConfig.mana)) {
        const avgMana = getAverageRoll(resourceConfig.mana);
        description += ` and approximately ${avgMana} mana`;
      } else {
        description += ` and ${resourceConfig.mana} mana`;
      }
    }
    
    if (resourceConfig.health) {
      if (isValidDiceNotation(resourceConfig.health)) {
        const avgHealth = getAverageRoll(resourceConfig.health);
        description += ` and approximately ${avgHealth} health`;
      } else {
        description += ` and ${resourceConfig.health} health`;
      }
    }
    
    if (resourceConfig.components && resourceConfig.components.length > 0) {
      description += `. Requires ${resourceConfig.components.join(', ')} components`;
    }
    
    if (resourceConfig.cooldown) {
      if (isValidDiceNotation(resourceConfig.cooldown)) {
        const avgCooldown = getAverageRoll(resourceConfig.cooldown);
        description += `. Can be used again after approximately ${avgCooldown} rounds`;
      } else {
        description += `. Can be used again after ${resourceConfig.cooldown} rounds`;
      }
    }
    
    return description + '.';
  },
  
  /**
   * Get a human-readable description of damage range
   */
  getDamageRangeDescription: (diceNotation, damageTypes = []) => {
    if (!isValidDiceNotation(diceNotation)) {
      return 'Invalid damage formula.';
    }
    
    const min = getMinRoll(diceNotation);
    const max = getMaxRoll(diceNotation);
    const avg = getAverageRoll(diceNotation);
    
    let damageTypeStr = '';
    if (damageTypes.length > 0) {
      const typeNames = damageTypes.map(typeId => {
        const damageType = DAMAGE_TYPES.find(type => type.id === typeId);
        return damageType ? damageType.name.toLowerCase() : typeId;
      });
      
      damageTypeStr = ' ' + (typeNames.length > 1 
        ? `(${typeNames.slice(0, -1).join(', ')} and ${typeNames[typeNames.length - 1]})`
        : `(${typeNames[0]})`);
    }
    
    return `Deals ${min}-${max} damage${damageTypeStr}, averaging ${avg.toFixed(1)} per use.`;
  },
  
  /**
   * Validate a spell configuration
   */
  validateSpellConfig: (config) => {
    const errors = {};
    
    // Check if effect types are selected
    if (!config.effectTypes || config.effectTypes.length === 0) {
      errors.effectTypes = 'At least one effect type must be selected';
    }
    
    // Validate damage config if damage effect is present
    if (config.effectTypes.includes('damage')) {
      if (!config.damageConfig) {
        errors.damageConfig = 'Damage configuration is required';
      } else {
        if (!config.damageConfig.damageTypes || config.damageConfig.damageTypes.length === 0) {
          errors.damageTypes = 'At least one damage type must be selected';
        }
        
        if (!config.damageConfig.diceNotation || !isValidDiceNotation(config.damageConfig.diceNotation)) {
          errors.damageDice = 'Valid dice notation is required for damage amount';
        }
        
        // Validate chain effect if enabled
        if (config.damageConfig.useChainEffect) {
          const { chainConfig } = config.damageConfig;
          if (!chainConfig) {
            errors.chainConfig = 'Chain configuration is required';
          } else {
            if (!chainConfig.targets || chainConfig.targets < 2) {
              errors.chainTargets = 'At least 2 targets are required for chain effects';
            }
            
            if (chainConfig.falloffType === undefined) {
              errors.falloffType = 'Falloff type is required for chain effects';
            }
            
            if (chainConfig.falloffRate === undefined || chainConfig.falloffRate < 0) {
              errors.falloffRate = 'Valid falloff rate is required for chain effects';
            }
          }
        }
        
        // Validate critical effect if enabled
        if (config.damageConfig.useCriticalEffect) {
          const { criticalConfig } = config.damageConfig;
          if (!criticalConfig) {
            errors.criticalConfig = 'Critical configuration is required';
          } else {
            if (criticalConfig.criticalMultiplier === undefined || criticalConfig.criticalMultiplier <= 0) {
              errors.criticalMultiplier = 'Valid critical multiplier is required';
            }
            
            if (criticalConfig.extraDice && !isValidDiceNotation(criticalConfig.extraDice)) {
              errors.criticalExtraDice = 'Valid dice notation is required for critical extra dice';
            }
          }
        }
      }
    }
    
    // Validate healing config if healing effect is present
    if (config.effectTypes.includes('healing')) {
      if (!config.healingConfig) {
        errors.healingConfig = 'Healing configuration is required';
      } else {
        if (!config.healingConfig.healingType) {
          errors.healingType = 'Healing type is required';
        }
        
        if (!config.healingConfig.diceNotation || !isValidDiceNotation(config.healingConfig.diceNotation)) {
          errors.healingDice = 'Valid dice notation is required for healing amount';
        }
        
        // Validate absorption shield if enabled
        if (config.healingConfig.useAbsorptionShield) {
          const { shieldConfig } = config.healingConfig;
          if (!shieldConfig) {
            errors.shieldConfig = 'Shield configuration is required';
          } else {
            if (!shieldConfig.shieldType) {
              errors.shieldType = 'Shield type is required';
            }
            
            if (!shieldConfig.shieldAmount || !isValidDiceNotation(shieldConfig.shieldAmount)) {
              errors.shieldAmount = 'Valid dice notation is required for shield amount';
            }
            
            if (shieldConfig.reflectionType && !shieldConfig.reflectionAmount) {
              errors.reflectionAmount = 'Reflection amount is required when reflection type is set';
            }
          }
        }
      }
    }
    
    // Validate buff config if buff effect is present
    if (config.effectTypes.includes('buff')) {
      if (!config.buffConfig) {
        errors.buffConfig = 'Buff configuration is required';
      } else {
        // At least one of statModifiers or statusEffects should be set
        const hasStatModifiers = config.buffConfig.statModifiers && 
                                Object.keys(config.buffConfig.statModifiers).length > 0;
        const hasStatusEffects = config.buffConfig.statusEffects && 
                                config.buffConfig.statusEffects.length > 0;
        
        if (!hasStatModifiers && !hasStatusEffects) {
          errors.buffEffects = 'At least one stat modifier or status effect is required for buffs';
        }
        
        // Validate status effect parameters if status effects are used
        if (hasStatusEffects) {
          for (const effectId of config.buffConfig.statusEffects) {
            const effect = POSITIVE_STATUS_EFFECTS.find(e => e.id === effectId);
            
            if (effect && effect.defaultParameters) {
              const params = config.buffConfig.effectParameters && 
                           config.buffConfig.effectParameters[effectId];
              
              if (!params) {
                if (!errors.buffParameters) errors.buffParameters = {};
                errors.buffParameters[effectId] = 'Parameters are required for this status effect';
              }
            }
          }
        }
      }
    }
    
    // Validate debuff config if debuff effect is present
    if (config.effectTypes.includes('debuff')) {
      if (!config.debuffConfig) {
        errors.debuffConfig = 'Debuff configuration is required';
      } else {
        // At least one of statModifiers or statusEffects should be set
        const hasStatModifiers = config.debuffConfig.statModifiers && 
                                Object.keys(config.debuffConfig.statModifiers).length > 0;
        const hasStatusEffects = config.debuffConfig.statusEffects && 
                                config.debuffConfig.statusEffects.length > 0;
        
        if (!hasStatModifiers && !hasStatusEffects) {
          errors.debuffEffects = 'At least one stat modifier or status effect is required for debuffs';
        }
        
        // Validate status effect parameters if status effects are used
        if (hasStatusEffects) {
          for (const effectId of config.debuffConfig.statusEffects) {
            const effect = NEGATIVE_STATUS_EFFECTS.find(e => e.id === effectId);
            
            if (effect && effect.defaultParameters) {
              const params = config.debuffConfig.effectParameters && 
                           config.debuffConfig.effectParameters[effectId];
              
              if (!params) {
                if (!errors.debuffParameters) errors.debuffParameters = {};
                errors.debuffParameters[effectId] = 'Parameters are required for this status effect';
              }
            }
          }
        }
      }
    }
    
    // Validate utility config if utility effect is present
    if (config.effectTypes.includes('utility')) {
      if (!config.utilityConfig) {
        errors.utilityConfig = 'Utility configuration is required';
      } else {
        if (!config.utilityConfig.utilityType) {
          errors.utilityType = 'Utility type is required';
        }
        
        if (config.utilityConfig.utilityType && !config.utilityConfig.utilitySubtype) {
          errors.utilitySubtype = 'Utility subtype is required';
        }
        
        // Validate utility parameters
        if (config.utilityConfig.utilityType && config.utilityConfig.utilitySubtype) {
          const utilityType = UTILITY_EFFECT_TYPES.find(t => t.id === config.utilityConfig.utilityType);
          
          if (utilityType) {
            const subtype = utilityType.subtypes.find(s => s.id === config.utilityConfig.utilitySubtype);
            
            if (subtype && subtype.parameters) {
              for (const paramKey of subtype.parameters) {
                const hasParam = config.utilityConfig.parameters && 
                               config.utilityConfig.parameters[paramKey] !== undefined;
                
                if (!hasParam) {
                  if (!errors.utilityParameters) errors.utilityParameters = {};
                  errors.utilityParameters[paramKey] = `Parameter "${paramKey}" is required for this utility effect`;
                }
              }
            }
          }
        }
      }
    }
    
    // Validate targeting config
    if (!config.targetingConfig) {
      errors.targetingConfig = 'Targeting configuration is required';
    } else {
      if (!config.targetingConfig.targetingType) {
        errors.targetingType = 'Targeting type is required';
      }
      
      // If area targeting, need shape and size
      if (config.targetingConfig.targetingType === 'area') {
        if (!config.targetingConfig.areaShape) {
          errors.areaShape = 'Area shape is required for area targeting';
        }
        
        if (!config.targetingConfig.areaSize || config.targetingConfig.areaSize <= 0) {
          errors.areaSize = 'Valid area size is required for area targeting';
        }
      }
      
      // If multi targeting, need target count
      if (config.targetingConfig.targetingType === 'multi' && 
          (!config.targetingConfig.targetCount || config.targetingConfig.targetCount < 1)) {
        errors.targetCount = 'Target count is required for multi-targeting';
      }
    }
    
    // Validate duration config
    if (!config.durationConfig) {
      errors.durationConfig = 'Duration configuration is required';
    } else {
      if (!config.durationConfig.durationType) {
        errors.durationType = 'Duration type is required';
      }
      
      // If not instant, need duration value
      if (config.durationConfig.durationType !== 'instant' && 
          (config.durationConfig.durationValue === undefined || config.durationConfig.durationValue <= 0)) {
        errors.durationValue = 'Valid duration value is required';
      }
    }
    
    // Validate persistent config if enabled
    if (config.persistentConfig && config.persistentConfig.isPersistent) {
      if (!config.persistentConfig.persistentType) {
        errors.persistentType = 'Persistent effect type is required';
      }
      
      if (!config.persistentConfig.tickFrequency) {
        errors.tickFrequency = 'Tick frequency is required for persistent effects';
      }
      
      // DoT/HoT specific validation
      if (['dot', 'hot'].includes(config.persistentConfig.persistentType) && 
          !config.persistentConfig.scalingType) {
        errors.scalingType = 'Scaling type is required for damage/healing over time effects';
      }
    }
    
    return errors;
  },
  
  /**
   * Create a spell configuration from a template
   */
  createFromTemplate: (templateId, modifications = {}) => {
    const template = getSpellTemplateById(templateId);
    
    if (!template) {
      return null;
    }
    
    // Deep clone the template to avoid mutating it
    const config = JSON.parse(JSON.stringify(template));
    
    // Apply modifications
    if (modifications.level) {
      config.level = modifications.level;
      
      // Scale damage/healing based on level difference
      const levelDifference = modifications.level - template.level;
      
      if (levelDifference !== 0) {
        // Scale damage
        if (config.damageConfig && config.damageConfig.diceNotation) {
          const parsed = parseDiceNotation(config.damageConfig.diceNotation);
          if (parsed && parsed.type !== 'complex') {
            // Increase dice count by level difference
            const newCount = Math.max(1, parsed.count + Math.floor(levelDifference / 2));
            config.damageConfig.diceNotation = `${newCount}d${parsed.sides}${parsed.modifier !== 0 ? (parsed.modifier > 0 ? '+' + parsed.modifier : parsed.modifier) : ''}`;
          }
        }
        
        // Scale healing
        if (config.healingConfig && config.healingConfig.diceNotation) {
          const parsed = parseDiceNotation(config.healingConfig.diceNotation);
          if (parsed && parsed.type !== 'complex') {
            // Increase dice count by level difference
            const newCount = Math.max(1, parsed.count + Math.floor(levelDifference / 2));
            config.healingConfig.diceNotation = `${newCount}d${parsed.sides}${parsed.modifier !== 0 ? (parsed.modifier > 0 ? '+' + parsed.modifier : parsed.modifier) : ''}`;
          }
        }
        
        // Scale shield amount
        if (config.healingConfig && config.healingConfig.shieldConfig && config.healingConfig.shieldConfig.shieldAmount) {
          const parsed = parseDiceNotation(config.healingConfig.shieldConfig.shieldAmount);
          if (parsed && parsed.type !== 'complex') {
            // Increase dice count by level difference
            const newCount = Math.max(1, parsed.count + Math.floor(levelDifference / 2));
            config.healingConfig.shieldConfig.shieldAmount = `${newCount}d${parsed.sides}${parsed.modifier !== 0 ? (parsed.modifier > 0 ? '+' + parsed.modifier : parsed.modifier) : ''}`;
          }
        }
      }
    }
    
    // Replace damage types if specified
    if (modifications.damageTypes && Array.isArray(modifications.damageTypes) && 
        config.damageConfig) {
      config.damageConfig.damageTypes = [...modifications.damageTypes];
    }
    
    // Replace targeting if specified
    if (modifications.targeting && config.targetingConfig) {
      if (modifications.targeting.type) {
        config.targetingConfig.targetingType = modifications.targeting.type;
      }
      
      if (modifications.targeting.areaShape) {
        config.targetingConfig.areaShape = modifications.targeting.areaShape;
      }
      
      if (modifications.targeting.areaSize) {
        config.targetingConfig.areaSize = modifications.targeting.areaSize;
      }
      
      if (modifications.targeting.targetCount) {
        config.targetingConfig.targetCount = modifications.targeting.targetCount;
      }
    }
    
    // Replace duration if specified
    if (modifications.duration && config.durationConfig) {
      if (modifications.duration.type) {
        config.durationConfig.durationType = modifications.duration.type;
      }
      
      if (modifications.duration.value !== undefined) {
        config.durationConfig.durationValue = modifications.duration.value;
      }
      
      if (modifications.duration.concentration !== undefined) {
        config.durationConfig.requiresConcentration = modifications.duration.concentration;
      }
    }
    
    // Add additional effects if specified
    if (modifications.additionalEffects && Array.isArray(modifications.additionalEffects)) {
      for (const effect of modifications.additionalEffects) {
        if (!config.effectTypes.includes(effect)) {
          config.effectTypes.push(effect);
        }
        
        // Initialize corresponding config objects if needed
        switch (effect) {
          case 'damage':
            if (!config.damageConfig) {
              config.damageConfig = {
                damageTypes: ['force'],
                diceNotation: '2d6',
                useChainEffect: false,
                useCriticalEffect: false
              };
            }
            break;
          case 'healing':
            if (!config.healingConfig) {
              config.healingConfig = {
                healingType: 'direct',
                diceNotation: '2d8',
                useAbsorptionShield: false
              };
            }
            break;
          case 'buff':
            if (!config.buffConfig) {
              config.buffConfig = {
                statModifiers: {},
                statusEffects: [],
                effectParameters: {}
              };
            }
            break;
          case 'debuff':
            if (!config.debuffConfig) {
              config.debuffConfig = {
                statModifiers: {},
                statusEffects: [],
                effectParameters: {}
              };
            }
            break;
          case 'utility':
            if (!config.utilityConfig) {
              config.utilityConfig = {
                utilityType: 'movement',
                utilitySubtype: 'flight',
                parameters: {}
              };
            }
            break;
        }
      }
    }
    
    // Apply any other direct modifications
    for (const [key, value] of Object.entries(modifications)) {
      // Skip keys we've already handled
      if (['level', 'damageTypes', 'targeting', 'duration', 'additionalEffects'].includes(key)) {
        continue;
      }
      
      // Apply the modification
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // For objects, merge with existing
        config[key] = { ...config[key], ...value };
      } else {
        // For primitives and arrays, replace
        config[key] = value;
      }
    }
    
    return config;
  },
  
  /**
   * Get the resource cost for a spell configuration
   */
  getResourceCost: (config) => {
    let actionPoints = 0;
    let mana = 0;
    
    // Base costs from effect types
    for (const effectType of config.effectTypes) {
      const effect = ENHANCED_EFFECT_TYPES.find(e => e.id === effectType);
      if (effect) {
        actionPoints += effect.actionPointCost;
      }
    }
    
    // Additional costs from targeting
    if (config.targetingConfig) {
      const targeting = TARGETING_TYPES.find(t => t.id === config.targetingConfig.targetingType);
      if (targeting) {
        actionPoints += targeting.actionPointModifier;
      }
    }
    
    // Additional costs from duration
    if (config.durationConfig) {
      const duration = DURATION_TYPES.find(d => d.id === config.durationConfig.durationType);
      if (duration) {
        actionPoints += duration.actionPointModifier;
      }
      
      // Concentration adds mana cost
      if (config.durationConfig.requiresConcentration) {
        mana += 10;
      }
    }
    
    // Additional costs from damage enhancements
    if (config.damageConfig) {
      if (config.damageConfig.useChainEffect) {
        actionPoints += 2;
        mana += 15;
      }
      
      if (config.damageConfig.useCriticalEffect) {
        actionPoints += 1;
        mana += 10;
      }
    }
    
    // Additional costs from healing enhancements
    if (config.healingConfig && config.healingConfig.useAbsorptionShield) {
      actionPoints += 2;
      mana += 15;
    }
    
    // Adjustments based on spell level if present
    if (config.level) {
      // Mana scales with level
      mana += config.level * 5;
      
      // Very high level spells cost more AP
      if (config.level >= 7) {
        actionPoints += 1;
      }
    }
    
    // Minimum cost is 1 AP
    actionPoints = Math.max(1, actionPoints);
    
    return { actionPoints, mana };
  }
};

// =====================================================================
// ENHANCED EFFECT CONFIG CLASS
// =====================================================================

/**
 * Class for advanced effect configuration with builder pattern
 */
export class EnhancedEffectConfig {
  constructor(name = 'New Effect') {
    this.config = {
      name,
      level: 1,
      effectTypes: [],
      damageConfig: null,
      healingConfig: null,
      buffConfig: null,
      debuffConfig: null,
      utilityConfig: null,
      targetingConfig: {
        targetingType: 'single',
        areaShape: null,
        areaSize: 0
      },
      durationConfig: {
        durationType: 'instant',
        durationValue: 0,
        requiresConcentration: false
      },
      persistentConfig: {
        isPersistent: false,
        persistentType: null,
        tickFrequency: null,
        scalingType: null
      }
    };
  }
  
  /**
   * Set the effect name
   */
  setName(name) {
    this.config.name = name;
    return this;
  }
  
  /**
   * Set the spell level
   */
  setLevel(level) {
    this.config.level = level;
    return this;
  }
  
  /**
   * Add an effect type
   */
  addEffectType(effectType) {
    if (!this.config.effectTypes.includes(effectType)) {
      this.config.effectTypes.push(effectType);
      
      // Initialize corresponding config object if needed
      switch (effectType) {
        case 'damage':
          if (!this.config.damageConfig) {
            this.config.damageConfig = {
              damageTypes: [],
              diceNotation: '2d6',
              useChainEffect: false,
              useCriticalEffect: false
            };
          }
          break;
        case 'healing':
          if (!this.config.healingConfig) {
            this.config.healingConfig = {
              healingType: 'direct',
              diceNotation: '2d8',
              useAbsorptionShield: false
            };
          }
          break;
        case 'buff':
          if (!this.config.buffConfig) {
            this.config.buffConfig = {
              statModifiers: {},
              statusEffects: [],
              effectParameters: {}
            };
          }
          break;
        case 'debuff':
          if (!this.config.debuffConfig) {
            this.config.debuffConfig = {
              statModifiers: {},
              statusEffects: [],
              effectParameters: {}
            };
          }
          break;
        case 'utility':
          if (!this.config.utilityConfig) {
            this.config.utilityConfig = {
              utilityType: null,
              utilitySubtype: null,
              parameters: {}
            };
          }
          break;
      }
    }
    return this;
  }
  
  /**
   * Remove an effect type
   */
  removeEffectType(effectType) {
    this.config.effectTypes = this.config.effectTypes.filter(type => type !== effectType);
    return this;
  }
  
  /**
   * Set damage configuration
   */
  configureDamage(damageTypes, diceNotation) {
    if (!this.config.effectTypes.includes('damage')) {
      this.addEffectType('damage');
    }
    
    this.config.damageConfig.damageTypes = Array.isArray(damageTypes) ? damageTypes : [damageTypes];
    this.config.damageConfig.diceNotation = diceNotation;
    return this;
  }
  
  /**
   * Enable chain damage
   */
  enableChainDamage(targets, falloffType = 'percentage', falloffRate = 25) {
    if (!this.config.effectTypes.includes('damage')) {
      this.addEffectType('damage');
    }
    
    this.config.damageConfig.useChainEffect = true;
    this.config.damageConfig.chainConfig = {
      targets,
      falloffType,
      falloffRate,
      minimumDamage: null
    };
    return this;
  }
  
  /**
   * Enable critical effect
   */
  enableCriticalEffect(criticalMultiplier = 2, effects = []) {
    if (!this.config.effectTypes.includes('damage')) {
      this.addEffectType('damage');
    }
    
    this.config.damageConfig.useCriticalEffect = true;
    this.config.damageConfig.criticalConfig = {
      criticalMultiplier,
      criticalDiceOnly: true,
      extraDice: '',
      effects: Array.isArray(effects) ? effects : [effects]
    };
    return this;
  }
  
  /**
   * Set healing configuration
   */
  configureHealing(healingType = 'direct', diceNotation) {
    if (!this.config.effectTypes.includes('healing')) {
      this.addEffectType('healing');
    }
    
    this.config.healingConfig.healingType = healingType;
    this.config.healingConfig.diceNotation = diceNotation;
    return this;
  }
  
  /**
   * Enable absorption shield
   */
  enableAbsorptionShield(shieldType, shieldAmount) {
    if (!this.config.effectTypes.includes('healing')) {
      this.addEffectType('healing');
    }
    
    this.config.healingConfig.useAbsorptionShield = true;
    this.config.healingConfig.shieldConfig = {
      shieldType,
      shieldAmount,
      reflectionType: null,
      reflectionAmount: 0
    };
    return this;
  }
  
  /**
   * Add a buff stat modifier
   */
  addBuffStatModifier(statId, value) {
    if (!this.config.effectTypes.includes('buff')) {
      this.addEffectType('buff');
    }
    
    this.config.buffConfig.statModifiers[statId] = value;
    return this;
  }
  
  /**
   * Add a buff status effect
   */
  addBuffStatusEffect(effectId, parameters = {}) {
    if (!this.config.effectTypes.includes('buff')) {
      this.addEffectType('buff');
    }
    
    if (!this.config.buffConfig.statusEffects.includes(effectId)) {
      this.config.buffConfig.statusEffects.push(effectId);
    }
    
    if (Object.keys(parameters).length > 0) {
      if (!this.config.buffConfig.effectParameters[effectId]) {
        this.config.buffConfig.effectParameters[effectId] = {};
      }
      
      this.config.buffConfig.effectParameters[effectId] = {
        ...this.config.buffConfig.effectParameters[effectId],
        ...parameters
      };
    }
    
    return this;
  }
  
  /**
   * Add a debuff stat modifier
   */
  addDebuffStatModifier(statId, value) {
    if (!this.config.effectTypes.includes('debuff')) {
      this.addEffectType('debuff');
    }
    
    this.config.debuffConfig.statModifiers[statId] = value;
    return this;
  }
  
  /**
   * Add a debuff status effect
   */
  addDebuffStatusEffect(effectId, parameters = {}) {
    if (!this.config.effectTypes.includes('debuff')) {
      this.addEffectType('debuff');
    }
    
    if (!this.config.debuffConfig.statusEffects.includes(effectId)) {
      this.config.debuffConfig.statusEffects.push(effectId);
    }
    
    if (Object.keys(parameters).length > 0) {
      if (!this.config.debuffConfig.effectParameters[effectId]) {
        this.config.debuffConfig.effectParameters[effectId] = {};
      }
      
      this.config.debuffConfig.effectParameters[effectId] = {
        ...this.config.debuffConfig.effectParameters[effectId],
        ...parameters
      };
    }
    
    return this;
  }
  
  /**
   * Configure utility effect
   */
  configureUtility(utilityType, utilitySubtype, parameters = {}) {
    if (!this.config.effectTypes.includes('utility')) {
      this.addEffectType('utility');
    }
    
    this.config.utilityConfig.utilityType = utilityType;
    this.config.utilityConfig.utilitySubtype = utilitySubtype;
    this.config.utilityConfig.parameters = { ...parameters };
    return this;
  }
  
  /**
   * Set targeting configuration
   */
  setTargeting(targetingType, options = {}) {
    this.config.targetingConfig.targetingType = targetingType;
    
    // Set area options if area targeting
    if (targetingType === 'area') {
      this.config.targetingConfig.areaShape = options.areaShape || 'circle';
      this.config.targetingConfig.areaSize = options.areaSize || 20;
    }
    
    // Set multi-target options if multi targeting
    if (targetingType === 'multi') {
      this.config.targetingConfig.targetCount = options.targetCount || 3;
    }
    
    return this;
  }
  
  /**
   * Set duration configuration
   */
  setDuration(durationType, durationValue = 0, requiresConcentration = false) {
    this.config.durationConfig.durationType = durationType;
    this.config.durationConfig.durationValue = durationValue;
    this.config.durationConfig.requiresConcentration = requiresConcentration;
    return this;
  }
  
  /**
   * Configure persistent effect (DoT/HoT)
   */
  configurePersistentEffect(persistentType, tickFrequency, options = {}) {
    this.config.persistentConfig.isPersistent = true;
    this.config.persistentConfig.persistentType = persistentType;
    this.config.persistentConfig.tickFrequency = tickFrequency;
    
    if (options.scalingType) {
      this.config.persistentConfig.scalingType = options.scalingType;
    }
    
    if (options.initialMultiplier) {
      this.config.persistentConfig.initialMultiplier = options.initialMultiplier;
    }
    
    if (options.finalMultiplier) {
      this.config.persistentConfig.finalMultiplier = options.finalMultiplier;
    }
    
    return this;
  }
  
  /**
   * Add effect from template
   */
  applyTemplate(templateId, modifications = {}) {
    const template = getSpellTemplateById(templateId);
    
    if (!template) {
      return this;
    }
    
    // Merge template with current config, letting template override
    this.config = {
      ...this.config,
      ...EnhancedEffectUtils.createFromTemplate(templateId, modifications)
    };
    
    return this;
  }
  
  /**
   * Build the final configuration
   */
  build() {
    // Calculate resource costs
    const resources = EnhancedEffectUtils.getResourceCost(this.config);
    this.config.resourceCost = resources;
    
    // Validate the configuration
    const errors = EnhancedEffectUtils.validateSpellConfig(this.config);
    this.config.errors = errors;
    this.config.isValid = Object.keys(errors).length === 0;
    
    // Create a deep copy to prevent mutation
    return JSON.parse(JSON.stringify(this.config));
  }
  
  /**
   * Get a human-readable summary of the effect
   */
  getSummary() {
    const config = this.build();
    
    let summary = `Name: ${config.name}\n`;
    summary += `Level: ${config.level}\n`;
    summary += `Cost: ${config.resourceCost.actionPoints} AP, ${config.resourceCost.mana} mana\n\n`;
    
    // Effect types
    summary += `Effect Types: ${config.effectTypes.join(', ')}\n\n`;
    
    // Damage
    if (config.effectTypes.includes('damage')) {
      const damageTypes = config.damageConfig.damageTypes.map(id => {
        const type = DAMAGE_TYPES.find(d => d.id === id);
        return type ? type.name : id;
      }).join(', ');
      
      summary += `Damage: ${config.damageConfig.diceNotation} ${damageTypes}\n`;
      
      if (config.damageConfig.useChainEffect) {
        summary += `Chain: ${config.damageConfig.chainConfig.targets} targets, `;
        summary += `${config.damageConfig.chainConfig.falloffRate}% reduction per jump\n`;
      }
      
      if (config.damageConfig.useCriticalEffect) {
        summary += `Critical: ${config.damageConfig.criticalConfig.criticalMultiplier}× damage`;
        if (config.damageConfig.criticalConfig.effects.length > 0) {
          summary += `, effects: ${config.damageConfig.criticalConfig.effects.join(', ')}`;
        }
        summary += '\n';
      }
      
      summary += '\n';
    }
    
    // Healing
    if (config.effectTypes.includes('healing')) {
      summary += `Healing: ${config.healingConfig.diceNotation} (${config.healingConfig.healingType})\n`;
      
      if (config.healingConfig.useAbsorptionShield) {
        const shieldType = ABSORPTION_SHIELD_TYPES.find(
          s => s.id === config.healingConfig.shieldConfig.shieldType
        );
        summary += `Shield: ${config.healingConfig.shieldConfig.shieldAmount} `;
        summary += `(${shieldType ? shieldType.name : config.healingConfig.shieldConfig.shieldType})\n`;
      }
      
      summary += '\n';
    }
    
    // Buff
    if (config.effectTypes.includes('buff')) {
      summary += 'Buffs:\n';
      
      // Stat modifiers
      if (Object.keys(config.buffConfig.statModifiers).length > 0) {
        summary += '- Stat Modifiers:\n';
        for (const [statId, value] of Object.entries(config.buffConfig.statModifiers)) {
          const stat = [...PRIMARY_STAT_MODIFIERS, ...SECONDARY_STAT_MODIFIERS, ...COMBAT_STAT_MODIFIERS]
            .find(s => s.id === statId);
          summary += `  * ${stat ? stat.name : statId}: ${value > 0 ? '+' : ''}${value}\n`;
        }
      }
      
      // Status effects
      if (config.buffConfig.statusEffects.length > 0) {
        summary += '- Status Effects:\n';
        for (const effectId of config.buffConfig.statusEffects) {
          const effect = POSITIVE_STATUS_EFFECTS.find(e => e.id === effectId);
          summary += `  * ${effect ? effect.name : effectId}\n`;
        }
      }
      
      summary += '\n';
    }
    
    // Debuff
    if (config.effectTypes.includes('debuff')) {
      summary += 'Debuffs:\n';
      
      // Stat modifiers
      if (Object.keys(config.debuffConfig.statModifiers).length > 0) {
        summary += '- Stat Modifiers:\n';
        for (const [statId, value] of Object.entries(config.debuffConfig.statModifiers)) {
          const stat = [...PRIMARY_STAT_MODIFIERS, ...SECONDARY_STAT_MODIFIERS, ...COMBAT_STAT_MODIFIERS]
            .find(s => s.id === statId);
          summary += `  * ${stat ? stat.name : statId}: ${value > 0 ? '+' : ''}${value}\n`;
        }
      }
      
      // Status effects
      if (config.debuffConfig.statusEffects.length > 0) {
        summary += '- Status Effects:\n';
        for (const effectId of config.debuffConfig.statusEffects) {
          const effect = NEGATIVE_STATUS_EFFECTS.find(e => e.id === effectId);
          summary += `  * ${effect ? effect.name : effectId}\n`;
        }
      }
      
      summary += '\n';
    }
    
    // Utility
    if (config.effectTypes.includes('utility') && config.utilityConfig.utilityType) {
      const utilityType = UTILITY_EFFECT_TYPES.find(t => t.id === config.utilityConfig.utilityType);
      let subtypeName = '';
      
      if (config.utilityConfig.utilitySubtype && utilityType) {
        const subtype = utilityType.subtypes.find(s => s.id === config.utilityConfig.utilitySubtype);
        subtypeName = subtype ? subtype.name : config.utilityConfig.utilitySubtype;
      }
      
      summary += `Utility: ${utilityType ? utilityType.name : config.utilityConfig.utilityType}`;
      if (subtypeName) {
        summary += ` (${subtypeName})`;
      }
      summary += '\n\n';
    }
    
    // Targeting
    const targeting = TARGETING_TYPES.find(t => t.id === config.targetingConfig.targetingType);
    summary += `Targeting: ${targeting ? targeting.name : config.targetingConfig.targetingType}`;
    
    if (config.targetingConfig.targetingType === 'area') {
      summary += `, ${config.targetingConfig.areaShape} shape, ${config.targetingConfig.areaSize} ft`;
    } else if (config.targetingConfig.targetingType === 'multi') {
      summary += `, ${config.targetingConfig.targetCount} targets`;
    }
    
    summary += '\n';
    
    // Duration
    const duration = DURATION_TYPES.find(d => d.id === config.durationConfig.durationType);
    summary += `Duration: ${duration ? duration.name : config.durationConfig.durationType}`;
    
    if (config.durationConfig.durationType !== 'instant') {
      summary += `, ${config.durationConfig.durationValue} ${config.durationConfig.durationType}`;
    }
    
    if (config.durationConfig.requiresConcentration) {
      summary += ' (Concentration)';
    }
    
    summary += '\n';
    
    // Persistent effects
    if (config.persistentConfig.isPersistent) {
      summary += `Persistent: ${config.persistentConfig.persistentType === 'dot' ? 'Damage' : 'Healing'} over time`;
      summary += `, ${config.persistentConfig.tickFrequency} ticks`;
      if (config.persistentConfig.scalingType) {
        summary += `, ${config.persistentConfig.scalingType} scaling`;
      }
      summary += '\n';
    }
    
    return summary;
  }
}