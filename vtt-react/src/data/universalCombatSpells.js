/**
 * Universal Combat Spells
 * 
 * These are basic combat actions and reactions available to all classes.
 * They appear in every class's spell library.
 */

export const UNIVERSAL_COMBAT_SPELLS = [
  // ===== COMBAT ACTIONS =====
  {
    id: 'universal_attack',
    name: 'Attack (Melee or Ranged)',
    description: 'Strike with your weapon against a target. Roll your weapon die (e.g., 1d8 for longsword) - a 1 is a miss (roll again to check for critical miss), maximum value is a critical hit, any other result hits and deals damage equal to the roll plus your attribute modifier. Armor provides passive damage reduction equal to Armor ÷ 10 (rounded down).',
    level: 1,
    spellType: 'ACTION',
    effectTypes: ['damage'],
    source: 'general',
    categoryIds: ['general_actions'],
    typeConfig: {
      school: 'physical',
      icon: 'ability_meleedamage',
      tags: ['attack', 'combat', 'universal']
    },
    damageConfig: {
      formula: 'weapon_die + attribute_modifier',
      elementType: 'physical',
      damageType: 'direct',
      canCrit: true,
      critMultiplier: 1,
      critDiceOnly: false
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 0, // Varies by weapon
      targetRestrictions: ['enemy', 'creature']
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      useFormulas: {},
      actionPoints: 2,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    tags: ['attack', 'combat', 'universal', 'weapon']
  },
  // ===== REACTIONS =====
  {
    id: 'universal_dodge',
    name: 'Dodge',
    description: 'Add +1 Dodge Rating to your existing Dodge Rating for 1 round. Your Dodge Rating applies to any attack against you, increasing the miss range on attack dice. Each Dodge Rating adds 1 to the miss range. For example, with 2 Dodge Rating against a d6 attack: rolls 1-3 miss, 4-6 hit (6 crits). Crits cannot be dodged - the highest roll always hits.',
    level: 1,
    spellType: 'REACTION',
    effectTypes: ['buff'],
    source: 'general',
    categoryIds: ['general_reactions'],
    typeConfig: {
      school: undefined, // No damage type for defensive buff
      icon: 'ability_rogue_feint',
      tags: ['reaction', 'defensive', 'universal']
    },
    buffConfig: {
      buffType: 'statEnhancement',
        effects: [{
          id: 'dodge',
          name: 'Dodge Active',
          description: 'Adds +1 Dodge Rating to your existing Dodge Rating. Your total Dodge Rating applies to any attack against you, increasing the miss range on attack dice. Crits cannot be dodged.',
        statModifier: {
          stat: 'dodge',
          magnitude: 1,
          magnitudeType: 'flat'
        }
      }],
      durationValue: 1,
      durationType: 'rounds',
      durationUnit: 'rounds',
      concentrationRequired: false,
      canBeDispelled: false
    },
    targetingConfig: {
      targetingType: 'self'
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      useFormulas: {},
      actionPoints: 2,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    tags: ['reaction', 'defensive', 'universal']
  },
  {
    id: 'universal_parry',
    name: 'Parry',
    description: 'Roll your weapon die vs. attacker\'s roll; if higher, negate the attack. Even smaller weapons can parry larger attacks through exploding dice.',
    level: 1,
    spellType: 'REACTION',
    effectTypes: ['control'],
    source: 'general',
    categoryIds: ['general_reactions'],
    typeConfig: {
      school: undefined, // No damage type for defensive control
      icon: 'ability_warrior_riposte',
      tags: ['reaction', 'defensive', 'universal']
    },
    controlConfig: {
      controlType: 'restriction',
      strength: 'moderate',
      duration: 0,
      durationUnit: 'instant',
      saveDC: 0,
      saveType: 'none',
      savingThrow: false,
      effects: [{
        id: 'parry',
        name: 'Parry',
        description: 'Roll your weapon die vs. attacker\'s roll; if higher, negate the attack',
        config: {
          parryType: 'weapon',
          requiresWeapon: true
        }
      }]
    },
    targetingConfig: {
      targetingType: 'self'
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      useFormulas: {},
      actionPoints: 1,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    tags: ['reaction', 'defensive', 'universal']
  },
  {
    id: 'universal_raise_shield',
    name: 'Raise Shield',
    description: 'Roll a shield die (d8) to reduce additional damage before armor reduction is applied.',
    level: 1,
    spellType: 'REACTION',
    effectTypes: ['buff'],
    source: 'general',
    categoryIds: ['general_reactions'],
    typeConfig: {
      school: undefined, // No damage type for defensive buff
      icon: 'inv_shield_05',
      tags: ['reaction', 'defensive', 'universal', 'shield']
    },
    buffConfig: {
      buffType: 'statEnhancement',
      effects: [{
        id: 'shield_block',
        name: 'Shield Block',
        description: 'Roll a shield die (d8) to reduce additional damage before armor reduction',
        statModifier: {
          stat: 'damage_reduction',
          magnitude: '1d8',
          magnitudeType: 'dice'
        }
      }],
      durationValue: 1,
      durationType: 'instant',
      durationUnit: 'instant',
      concentrationRequired: false,
      canBeDispelled: false
    },
    targetingConfig: {
      targetingType: 'self'
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      useFormulas: {},
      actionPoints: 1,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    tags: ['reaction', 'defensive', 'universal', 'shield']
  },
  {
    id: 'universal_help',
    name: 'Help',
    description: 'Offer advice, gesture, or hint to grant ally 1d8 + to their next action. Applies if reasoning is accepted by the GM.',
    level: 1,
    spellType: 'REACTION',
    effectTypes: ['buff'],
    source: 'general',
    categoryIds: ['general_reactions'],
    typeConfig: {
      school: 'social',
      icon: 'spell_holy_greaterheal',
      tags: ['reaction', 'support', 'universal']
    },
    buffConfig: {
      buffType: 'statEnhancement',
      effects: [{
        id: 'help',
        name: 'Help',
        description: 'Grant ally 1d8 + to their next action',
        statModifier: {
          stat: 'next_action_bonus',
          magnitude: '1d8',
          magnitudeType: 'dice'
        }
      }],
      durationValue: 1,
      durationType: 'instant',
      durationUnit: 'instant',
      concentrationRequired: false,
      canBeDispelled: false
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'touch',
      rangeDistance: 5,
      targetRestrictions: ['ally']
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      useFormulas: {},
      actionPoints: 1,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    tags: ['reaction', 'support', 'universal']
  },
  {
    id: 'universal_evade',
    name: 'Evade',
    description: 'Evade an attack by rolling 5 ft. into a dodge. Has to be used when player is prompted by the GM. Performing this agile dodge roll, you also gain a better position (Current Level * 1).',
    level: 1,
    spellType: 'REACTION',
    effectTypes: ['utility'],
    source: 'general',
    categoryIds: ['general_reactions'],
    typeConfig: {
      school: undefined, // No damage type for movement utility
      icon: 'ability_rogue_evasion',
      tags: ['reaction', 'defensive', 'universal', 'movement']
    },
    utilityConfig: {
      utilityType: 'movement',
      selectedEffects: [{
        id: 'evade',
        name: 'Evade',
        description: 'Roll 5 ft. into a dodge and gain better position',
        distance: 5,
        needsLineOfSight: false
      }],
      duration: 0,
      durationUnit: 'instant',
      concentration: false,
      power: 'minor'
    },
    targetingConfig: {
      targetingType: 'self'
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      useFormulas: {},
      actionPoints: 2,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    tags: ['reaction', 'defensive', 'universal', 'movement']
  },
  {
    id: 'universal_opportunity_attack',
    name: 'Opportunity Attack',
    description: 'React to enemy movement out of melee range with a quick strike. Roll your weapon die as normal, with a miss on 1 and crit on maximum value.',
    level: 1,
    spellType: 'REACTION',
    effectTypes: ['damage'],
    source: 'general',
    categoryIds: ['general_reactions'],
    typeConfig: {
      school: 'physical',
      icon: 'ability_warrior_cleave',
      tags: ['reaction', 'offensive', 'universal']
    },
    damageConfig: {
      formula: 'weapon_die',
      weaponDependent: true,
      usesWeaponDice: true,
      addAttributeModifier: true,
      damageType: 'bludgeoning', // Default fallback, but weapon-dependent will override with actual weapon type
      canCrit: true,
      critMultiplier: 1,
      critDiceOnly: false
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'touch',
      rangeDistance: 5,
      targetRestrictions: ['enemy']
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      useFormulas: {},
      actionPoints: 1,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    tags: ['reaction', 'offensive', 'universal']
  },
  {
    id: 'universal_interpose',
    name: 'Interpose',
    description: 'When an ally within 10 ft. is attacked, push them 5 ft. to safety and take the hit. Make a Strength save using an easy difficulty die (typically d6); on a miss the ally falls prone.',
    level: 1,
    spellType: 'REACTION',
    effectTypes: ['utility', 'control'],
    source: 'general',
    categoryIds: ['general_reactions'],
    typeConfig: {
      school: undefined, // No damage type for utility/control
      icon: 'ability_warrior_defensivestance',
      tags: ['reaction', 'defensive', 'universal', 'support']
    },
    utilityConfig: {
      utilityType: 'movement',
      selectedEffects: [{
        id: 'interpose',
        name: 'Interpose',
        description: 'Push ally 5 ft. to safety and take the hit',
        distance: 5,
        needsLineOfSight: true
      }],
      duration: 0,
      durationUnit: 'instant',
      concentration: false,
      power: 'minor'
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 10,
      targetRestrictions: ['ally']
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      useFormulas: {},
      actionPoints: 1,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    tags: ['reaction', 'defensive', 'universal', 'support']
  },
  {
    id: 'universal_riposte',
    name: 'Riposte',
    description: 'After a successful parry, immediately counter-attack. Roll your weapon die as normal. This attack ignores the target\'s passive DR and any Defend soak.',
    level: 1,
    spellType: 'REACTION',
    effectTypes: ['damage'],
    source: 'general',
    categoryIds: ['general_reactions'],
    typeConfig: {
      school: 'physical',
      icon: 'ability_warrior_riposte',
      tags: ['reaction', 'offensive', 'universal']
    },
    damageConfig: {
      formula: 'weapon_die', // Will be replaced by actual weapon dice when weapon-dependent
      weaponDependent: true,
      usesWeaponDice: true,
      addAttributeModifier: false,
      damageType: 'bludgeoning', // Default fallback, but weapon-dependent will override with actual weapon type
      canCrit: true,
      critMultiplier: 1,
      critDiceOnly: false,
      description: 'Ignores target\'s passive DR and any Defend soak'
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'touch',
      rangeDistance: 5,
      targetRestrictions: ['enemy']
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      useFormulas: {},
      actionPoints: 1,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    tags: ['reaction', 'offensive', 'universal']
  },
  {
    id: 'universal_shield_bash',
    name: 'Shield Bash',
    description: 'After successfully raising your shield, turn defense into offense. Make a STR vs. CON Save. If opponent fails, they are stunned until end of their next turn.',
    level: 1,
    spellType: 'REACTION',
    effectTypes: ['control'],
    source: 'general',
    categoryIds: ['general_reactions'],
    typeConfig: {
      school: undefined, // No damage type for control effect
      icon: 'ability_warrior_shieldbash',
      tags: ['reaction', 'offensive', 'universal', 'shield']
    },
    controlConfig: {
      controlType: 'incapacitation',
      strength: 'moderate',
      duration: 1,
      durationUnit: 'rounds',
      saveDC: 0, // STR vs CON
      saveType: 'constitution',
      savingThrow: true,
      effects: [{
        id: 'stun',
        name: 'Stun',
        description: 'Target is stunned until end of their next turn',
        config: {
          durationType: 'temporary',
          recoveryMethod: 'automatic'
        }
      }]
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'touch',
      rangeDistance: 5,
      targetRestrictions: ['enemy']
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      useFormulas: {},
      actionPoints: 1,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    tags: ['reaction', 'offensive', 'universal', 'shield']
  },
  {
    id: 'universal_spell_reaction',
    name: 'Spell Reaction',
    description: 'Cast a reactive spell in response to an enemy action. Roll the spell\'s die as normal. Reactive spells often have special effects.',
    level: 1,
    spellType: 'REACTION',
    effectTypes: ['utility'],
    source: 'general',
    categoryIds: ['general_reactions'],
    typeConfig: {
      school: 'arcane',
      icon: 'spell_arcane_arcanetorrent',
      tags: ['reaction', 'spell', 'universal']
    },
    utilityConfig: {
      utilityType: 'spellcasting',
      selectedEffects: [{
        id: 'spell_reaction',
        name: 'Spell Reaction',
        description: 'Cast a reactive spell in response to an enemy action'
      }],
      duration: 0,
      durationUnit: 'instant',
      concentration: false,
      power: 'moderate'
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 60,
      targetRestrictions: []
    },
    resourceCost: {
      resourceTypes: ['mana'],
      resourceValues: {
        mana: 0 // Varies by spell
      },
      useFormulas: {},
      actionPoints: 2,
      components: ['verbal', 'somatic']
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    tags: ['reaction', 'spell', 'universal']
  },

  // ===== ADDITIONAL COMBAT ACTIONS =====
  {
    id: 'universal_move',
    name: 'Move',
    description: 'Move up to your movement speed (typically 30 feet). This movement can be broken up between other actions.',
    level: 1,
    spellType: 'ACTION',
    effectTypes: ['utility'],
    source: 'general',
    categoryIds: ['general_actions'],
    typeConfig: {
      school: undefined, // No damage type for movement utility
      icon: 'ability_rogue_sprint',
      tags: ['movement', 'combat', 'universal']
    },
    utilityConfig: {
      utilityType: 'movement',
      selectedEffects: [{
        id: 'move',
        name: 'Move',
        description: 'Move up to your movement speed (typically 30 feet)',
        distance: 30,
        needsLineOfSight: false
      }],
      duration: 0,
      durationUnit: 'instant',
      concentration: false,
      power: 'minor'
    },
    targetingConfig: {
      targetingType: 'self'
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      useFormulas: {},
      actionPoints: 1,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    tags: ['movement', 'combat', 'universal']
  },
  {
    id: 'universal_dash',
    name: 'Dash',
    description: 'Move up to twice your movement speed.',
    level: 1,
    spellType: 'ACTION',
    effectTypes: ['utility'],
    source: 'general',
    categoryIds: ['general_actions'],
    typeConfig: {
      school: undefined, // No damage type for movement utility
      icon: 'ability_rogue_sprint',
      tags: ['movement', 'combat', 'universal']
    },
    utilityConfig: {
      utilityType: 'movement',
      selectedEffects: [{
        id: 'dash',
        name: 'Dash',
        description: 'Move up to twice your movement speed',
        distance: 60, // 2x typical movement
        needsLineOfSight: false
      }],
      duration: 0,
      durationUnit: 'instant',
      concentration: false,
      power: 'minor'
    },
    targetingConfig: {
      targetingType: 'self'
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      useFormulas: {},
      actionPoints: 2,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    tags: ['movement', 'combat', 'universal']
  },
  {
    id: 'universal_disengage',
    name: 'Disengage',
    description: 'Move away from enemies without provoking opportunity attacks. You can move up to your full movement speed while maintaining your defensive stance.',
    level: 1,
    spellType: 'ACTION',
    effectTypes: ['utility'],
    source: 'general',
    categoryIds: ['general_actions'],
    typeConfig: {
      school: undefined, // No damage type for movement utility
      icon: 'ability_rogue_feint',
      tags: ['movement', 'combat', 'universal', 'defensive']
    },
    utilityConfig: {
      utilityType: 'movement',
      selectedEffects: [{
        id: 'disengage',
        name: 'Disengage',
        description: 'Move without provoking opportunity attacks',
        distance: 30,
        needsLineOfSight: false
      }],
      duration: 0,
      durationUnit: 'instant',
      concentration: false,
      power: 'minor'
    },
    targetingConfig: {
      targetingType: 'self'
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      useFormulas: {},
      actionPoints: 1,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    tags: ['movement', 'combat', 'universal', 'defensive']
  },
  {
    id: 'universal_use_item',
    name: 'Use an Item',
    description: 'Draw, stow, or use an item in your inventory.',
    level: 1,
    spellType: 'ACTION',
    effectTypes: ['utility'],
    source: 'general',
    categoryIds: ['general_actions'],
    typeConfig: {
      school: undefined, // No damage type for item utility
      icon: 'inv_misc_bag_08',
      tags: ['item', 'combat', 'universal']
    },
    utilityConfig: {
      utilityType: 'item',
      selectedEffects: [{
        id: 'use_item',
        name: 'Use an Item',
        description: 'Draw, stow, or use an item in your inventory'
      }],
      duration: 0,
      durationUnit: 'instant',
      concentration: false,
      power: 'minor'
    },
    targetingConfig: {
      targetingType: 'self'
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      useFormulas: {},
      actionPoints: 1,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    tags: ['item', 'combat', 'universal']
  },
  {
    id: 'universal_hide',
    name: 'Hide',
    description: 'Make a Stealth check to hide from enemies.',
    level: 1,
    spellType: 'ACTION',
    effectTypes: ['utility'],
    source: 'general',
    categoryIds: ['general_actions'],
    typeConfig: {
      school: undefined, // No damage type for stealth utility
      icon: 'ability_stealth',
      tags: ['stealth', 'combat', 'universal']
    },
    utilityConfig: {
      utilityType: 'stealth',
      selectedEffects: [{
        id: 'hide',
        name: 'Hide',
        description: 'Make a Stealth check to hide from enemies'
      }],
      duration: 0,
      durationUnit: 'instant',
      concentration: false,
      power: 'minor'
    },
    targetingConfig: {
      targetingType: 'self'
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      useFormulas: {},
      actionPoints: 1,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    tags: ['stealth', 'combat', 'universal']
  },
  {
    id: 'universal_help_action',
    name: 'Help (Action)',
    description: 'Assist an ally with a task, giving them advantage on their next check.',
    level: 1,
    spellType: 'ACTION',
    effectTypes: ['buff'],
    source: 'general',
    categoryIds: ['general_actions'],
    typeConfig: {
      school: 'social',
      icon: 'spell_holy_greaterheal',
      tags: ['support', 'combat', 'universal']
    },
    buffConfig: {
      buffType: 'statEnhancement',
      effects: [{
        id: 'help_advantage',
        name: 'Help',
        description: 'Gives ally advantage on their next check',
        statModifier: {
          stat: 'next_check_advantage',
          magnitude: 1,
          magnitudeType: 'flat'
        }
      }],
      durationValue: 1,
      durationType: 'instant',
      durationUnit: 'instant',
      concentrationRequired: false,
      canBeDispelled: false
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'touch',
      rangeDistance: 5,
      targetRestrictions: ['ally']
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      useFormulas: {},
      actionPoints: 1,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    tags: ['support', 'combat', 'universal']
  },
  {
    id: 'universal_ready_action',
    name: 'Ready an Action',
    description: 'Prepare to take an action in response to a specific trigger.',
    level: 1,
    spellType: 'ACTION',
    effectTypes: ['utility'],
    source: 'general',
    categoryIds: ['general_actions'],
    typeConfig: {
      school: undefined, // No damage type for preparation utility
      icon: 'ability_warrior_defensivestance',
      tags: ['preparation', 'combat', 'universal']
    },
    utilityConfig: {
      utilityType: 'preparation',
      selectedEffects: [{
        id: 'ready_action',
        name: 'Ready an Action',
        description: 'Prepare to take an action in response to a specific trigger'
      }],
      duration: 0,
      durationUnit: 'instant',
      concentration: false,
      power: 'minor'
    },
    targetingConfig: {
      targetingType: 'self'
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      useFormulas: {},
      actionPoints: 1,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    tags: ['preparation', 'combat', 'universal']
  }
];

// Map of spell IDs to their spell objects for quick lookup
export const UNIVERSAL_SPELL_MAP = UNIVERSAL_COMBAT_SPELLS.reduce((map, spell) => {
  map[spell.id] = spell;
  return map;
}, {});

