/**
 * Debuff Types Module
 *
 * Defines categories and configurations for debuff effects that impose
 * penalties and disadvantages on targets.
 */

import { NEGATIVE_STATUS_EFFECTS, COMBAT_DISADVANTAGES } from './statusEffects';

/**
 * Debuff effect categories with detailed descriptions
 */
export const DEBUFF_CATEGORIES = [
  {
    id: 'statReduction',
    name: 'Stat Reduction',
    description: 'Directly reduces one or more character statistics',
    icon: 'spell_shadow_curseofweakness',
    examples: ['Curse of Weakness', 'Ray of Enfeeblement', 'Mind Fog'],
    saveType: 'constitution',
    duration: 'medium',
    dispelDifficulty: 'normal',
    commonTargets: ['melee attackers', 'high-value targets'],
    counterplay: 'Buff the affected stat, use abilities that don\'t rely on it'
  },
  {
    id: 'vulnerability',
    name: 'Vulnerability',
    description: 'Increases damage taken from specific sources',
    icon: 'spell_shadow_shadowwordpain',
    examples: ['Amplify Magic', 'Frost Vulnerability', 'Mark of Flame'],
    saveType: 'constitution',
    duration: 'medium',
    dispelDifficulty: 'normal',
    commonTargets: ['boss enemies', 'heavily armored foes'],
    counterplay: 'Resistances to affected damage type, damage absorption'
  },
  {
    id: 'control',
    name: 'Control Effect',
    description: 'Restricts ability to move or act',
    icon: 'spell_frost_chainsofice',
    examples: ['Polymorph', 'Freeze', 'Entangling Roots'],
    saveType: 'varies',
    duration: 'short',
    dispelDifficulty: 'hard',
    commonTargets: ['dangerous casters', 'mobile enemies'],
    counterplay: 'Movement abilities, immunity effects, "break on damage" mechanics'
  },
  {
    id: 'damage',
    name: 'Damage Over Time',
    description: 'Inflicts ongoing damage at regular intervals',
    icon: 'spell_fire_immolation',
    examples: ['Corruption', 'Ignite', 'Deadly Poison'],
    saveType: 'constitution',
    duration: 'medium',
    dispelDifficulty: 'normal',
    commonTargets: ['high health enemies', 'healers'],
    counterplay: 'Healing over time, cleansing effects, immunity'
  },
  {
    id: 'spreading',
    name: 'Spreading Effect',
    description: 'Can transfer between nearby targets',
    icon: 'spell_shadow_unstableaffliction_3',
    examples: ['Plague', 'Chain Affliction', 'Infectious Wound'],
    saveType: 'constitution',
    duration: 'short to medium',
    dispelDifficulty: 'hard',
    commonTargets: ['grouped enemies', 'swarms'],
    counterplay: 'Maintain distance, immunity effects, area cleansing'
  },
  {
    id: 'cursehex',
    name: 'Curse/Hex',
    description: 'Powerful debuff with special removal requirements',
    icon: 'spell_shadow_antishadow',
    examples: ['Curse of Doom', 'Hex of Weakness', 'Soul Drain'],
    saveType: 'charisma',
    duration: 'long',
    dispelDifficulty: 'very hard',
    commonTargets: ['primary threats', 'boss enemies'],
    counterplay: 'Specific curse removal abilities, waiting out duration'
  },
  {
    id: 'mental',
    name: 'Mental Effect',
    description: 'Affects mind, perception, or decision-making',
    icon: 'spell_shadow_mindshear',
    examples: ['Fear', 'Confusion', 'Hallucination'],
    saveType: 'wisdom',
    duration: 'short',
    dispelDifficulty: 'hard',
    commonTargets: ['intelligent enemies', 'casters'],
    counterplay: 'Mental fortitude effects, will-based saving throws'
  },
  {
    id: 'disabling',
    name: 'Disabling Effect',
    description: 'Prevents use of specific abilities or resources',
    icon: 'spell_holy_silence',
    examples: ['Silence', 'Disarm', 'Mana Burn'],
    saveType: 'varies',
    duration: 'short',
    dispelDifficulty: 'hard',
    commonTargets: ['casters', 'ability-dependent enemies'],
    counterplay: 'Use unaffected ability types, positioning'
  }
];

/**
 * Duration options for debuff effects
 */
export const DEBUFF_DURATIONS = [
  { value: 1, label: '1 Round' },
  { value: 2, label: '2 Rounds' },
  { value: 3, label: '3 Rounds' },
  { value: 4, label: '4 Rounds' },
  { value: 5, label: '5 Rounds' },
  { value: 6, label: '6 Rounds' },
  { value: 10, label: '10 Rounds (1 minute)' },
  { value: 100, label: '100 Rounds (10 minutes)' },
  { value: 600, label: '600 Rounds (1 hour)' },
  { value: -1, label: 'Until dispelled' }
];

/**
 * Stacking rule options for debuff effects dropdown
 */
export const DEBUFF_STACKING_RULE_OPTIONS = [
  { value: 'replace', label: 'Replace existing' },
  { value: 'highest', label: 'Keep highest (most severe)' },
  { value: 'cumulative', label: 'Cumulative (add together)' },
  { value: 'selfStacking', label: 'Self-stacking (apply multiple times)' },
  { value: 'progressive', label: 'Progressive (increases over time)' }
];

/**
 * Debuff resistance check types
 */
export const DEBUFF_SAVE_TYPES = [
  {
    id: 'constitution',
    name: 'Constitution Save',
    description: 'Resist with physical fortitude and stamina',
    relevantEffects: ['poison', 'disease', 'exhaustion', 'physical transformations'],
    countered: 'Physical impairments, bodily effects',
    icon: 'spell_holy_devotionaura'
  },
  {
    id: 'agility',
    name: 'Agility Save',
    description: 'Resist with agility and reflexes',
    relevantEffects: ['restraint', 'area damage', 'movement impairment'],
    countered: 'Physical traps, movement restrictions',
    icon: 'ability_rogue_quickrecovery'
  },
  {
    id: 'strength',
    name: 'Strength Save',
    description: 'Resist with raw power',
    relevantEffects: ['paralysis', 'restraint', 'grapple'],
    countered: 'Physical bindings, force effects',
    icon: 'spell_nature_strength'
  },
  {
    id: 'spirit',
    name: 'Spirit Save',
    description: 'Resist with mental fortitude and willpower',
    relevantEffects: ['fear', 'charm', 'illusion', 'mind control'],
    countered: 'Mental manipulation, perception effects',
    icon: 'spell_holy_holyguidance'
  },
  {
    id: 'intelligence',
    name: 'Intelligence Save',
    description: 'Resist with mental acuity and knowledge',
    relevantEffects: ['confusion', 'memory effects', 'complex illusions'],
    countered: 'Mental misdirection, knowledge tampering',
    icon: 'spell_arcane_arcane02'
  },
  {
    id: 'charisma',
    name: 'Charisma Save',
    description: 'Resist with force of personality and sense of self',
    relevantEffects: ['possession', 'banishment', 'curses', 'compulsion'],
    countered: 'Soul effects, forced behavior',
    icon: 'spell_holy_powerinfusion'
  }
];

/**
 * Debuff dispel difficulty levels
 */
export const DEBUFF_DISPEL_DIFFICULTIES = [
  {
    id: 'easy',
    name: 'Easy',
    description: 'Removed by most cleansing effects',
    dcModifier: 0,
    examples: ['Minor debuffs', 'Low-level effects'],
    specialRequirements: 'None'
  },
  {
    id: 'normal',
    name: 'Normal',
    description: 'Standard difficulty to remove',
    dcModifier: 5,
    examples: ['Most common debuffs'],
    specialRequirements: 'Appropriate dispel type'
  },
  {
    id: 'hard',
    name: 'Hard',
    description: 'Difficult to remove, may require specific dispel types',
    dcModifier: 10,
    examples: ['Control effects', 'Powerful curses'],
    specialRequirements: 'Specific dispel type, higher level dispel'
  },
  {
    id: 'very_hard',
    name: 'Very Hard',
    description: 'Extremely difficult to remove, requires specialized effects',
    dcModifier: 15,
    examples: ['Curses', 'Major hexes', 'Boss debuffs'],
    specialRequirements: 'Specialized removal abilities, correct timing'
  },
  {
    id: 'special',
    name: 'Special',
    description: 'Cannot be removed by normal means',
    dcModifier: 30,
    examples: ['Plot-related curses', 'Special mechanics'],
    specialRequirements: 'Quest completion, special items, specific conditions'
  }
];

/**
 * Detailed debuff effect types with parameters
 */
export const DEBUFF_EFFECT_TYPES = [
  {
    id: 'statPenalty',
    name: 'Stat Penalty',
    description: 'Decreases one or more character statistics',
    effectParams: [
      {
        name: 'statId',
        type: 'string',
        description: 'ID of the stat to decrease',
        required: true
      },
      {
        name: 'amount',
        type: 'number',
        description: 'Amount to decrease the stat by',
        required: true
      },
      {
        name: 'isPercentage',
        type: 'boolean',
        description: 'Whether the amount is a percentage or flat value',
        defaultValue: false
      }
    ],
    saveDC: {
      base: 10,

      type: 'constitution'
    },
    stacking: 'diminishing',
    maxStacks: 3,
    category: 'statReduction'
  },
  {
    id: 'damageVulnerability',
    name: 'Damage Vulnerability',
    description: 'Increases damage taken from specific sources',
    effectParams: [
      {
        name: 'damageType',
        type: 'string',
        description: 'Type of damage target becomes vulnerable to',
        required: true
      },
      {
        name: 'amount',
        type: 'number',
        description: 'Percentage increase in damage taken',
        required: true
      },
      {
        name: 'affectsAllDamage',
        type: 'boolean',
        description: 'Whether all damage is increased or just the specified type',
        defaultValue: false
      }
    ],
    saveDC: {
      base: 12,

      type: 'constitution'
    },
    stacking: 'independent',
    maxStacks: 1,
    category: 'vulnerability'
  },
  {
    id: 'movementImpairment',
    name: 'Movement Impairment',
    description: 'Restricts or slows movement',
    effectParams: [
      {
        name: 'speedReduction',
        type: 'number',
        description: 'Percentage reduction to movement speed',
        required: true
      },
      {
        name: 'preventsSprinting',
        type: 'boolean',
        description: 'Whether sprinting is prevented',
        defaultValue: false
      },
      {
        name: 'preventsJumping',
        type: 'boolean',
        description: 'Whether jumping is prevented',
        defaultValue: false
      }
    ],
    saveDC: {
      base: 12,
      type: 'agility'
    },
    stacking: 'diminishing',
    maxStacks: 1,
    category: 'control'
  },
  {
    id: 'fullControl',
    name: 'Full Control',
    description: 'Completely prevents movement or actions',
    effectParams: [
      {
        name: 'controlType',
        type: 'string',
        description: 'Type of control effect (stun, paralyze, freeze, etc.)',
        required: true
      },
      {
        name: 'allowsMentalActions',
        type: 'boolean',
        description: 'Whether mental actions are still allowed',
        defaultValue: false
      },
      {
        name: 'breaksOnDamage',
        type: 'boolean',
        description: 'Whether the effect breaks when damage is taken',
        defaultValue: false
      }
    ],
    saveDC: {
      base: 15,

      type: 'varies'
    },
    stacking: 'none',
    maxStacks: 1,
    category: 'control'
  },
  {
    id: 'damageOverTime',
    name: 'Damage Over Time',
    description: 'Deals damage at regular intervals',
    effectParams: [
      {
        name: 'damageType',
        type: 'string',
        description: 'Type of damage dealt',
        required: true
      },
      {
        name: 'damagePerTick',
        type: 'string',
        description: 'Amount of damage per tick (dice notation)',
        required: true
      },
      {
        name: 'tickFrequency',
        type: 'string',
        description: 'How often damage occurs',
        defaultValue: 'beginningOfTurn'
      }
    ],
    saveDC: {
      base: 12,
      scaling: 'level',
      type: 'constitution'
    },
    stacking: 'additive',
    maxStacks: 5,
    category: 'damage'
  },
  {
    id: 'spreadingEffect',
    name: 'Spreading Effect',
    description: 'Effect can transfer between nearby targets',
    effectParams: [
      {
        name: 'baseEffect',
        type: 'string',
        description: 'Base effect ID that spreads',
        required: true
      },
      {
        name: 'spreadRadius',
        type: 'number',
        description: 'Radius in feet that the effect can spread',
        required: true
      },
      {
        name: 'spreadChance',
        type: 'number',
        description: 'Percentage chance to spread on each tick',
        required: true
      }
    ],
    saveDC: {
      base: 13,
      scaling: 'level',
      type: 'constitution'
    },
    stacking: 'none',
    maxStacks: 1,
    category: 'spreading'
  },
  {
    id: 'curse',
    name: 'Curse',
    description: 'Powerful negative effect with special removal requirements',
    effectParams: [
      {
        name: 'curseType',
        type: 'string',
        description: 'Type of curse effect',
        required: true
      },
      {
        name: 'curseEffect',
        type: 'object',
        description: 'Details of the curse effect',
        required: true
      },
      {
        name: 'removalRequirement',
        type: 'string',
        description: 'Special requirement for removal',
        defaultValue: 'removeCurse'
      }
    ],
    saveDC: {
      base: 15,
      scaling: 'level',
      type: 'charisma'
    },
    stacking: 'none',
    maxStacks: 1,
    category: 'cursehex'
  },
  {
    id: 'mentalEffect',
    name: 'Mental Effect',
    description: 'Affects mind, perception, or decision-making',
    effectParams: [
      {
        name: 'mentalEffectType',
        type: 'string',
        description: 'Type of mental effect (fear, charm, confusion, etc.)',
        required: true
      },
      {
        name: 'severity',
        type: 'string',
        description: 'Severity of the effect (mild, moderate, severe)',
        required: true
      },
      {
        name: 'allowsResave',
        type: 'boolean',
        description: 'Whether target can attempt new saves',
        defaultValue: true
      }
    ],
    saveDC: {
      base: 14,
      scaling: 'level',
      type: 'wisdom'
    },
    stacking: 'none',
    maxStacks: 1,
    category: 'mental'
  },
  {
    id: 'abilityDisable',
    name: 'Ability Disable',
    description: 'Prevents use of specific abilities or resources',
    effectParams: [
      {
        name: 'disableType',
        type: 'string',
        description: 'Type of abilities disabled (spells, physical, etc.)',
        required: true
      },
      {
        name: 'disablePercentage',
        type: 'number',
        description: 'Percentage chance abilities are disabled',
        defaultValue: 100
      },
      {
        name: 'resourceDrain',
        type: 'boolean',
        description: 'Whether resources are also drained',
        defaultValue: false
      }
    ],
    saveDC: {
      base: 14,
      scaling: 'level',
      type: 'varies'
    },
    stacking: 'none',
    maxStacks: 1,
    category: 'disabling'
  }
];

/**
 * Debuff stacking rules defining how debuffs accumulate on targets
 */
export const DEBUFF_STACKING_RULES = [
  {
    id: 'none',
    name: 'Non-stacking',
    description: 'Only one instance can be active, new applications refresh duration',
    examples: ['Control effects', 'Curses'],
    maxStacks: 1
  },
  {
    id: 'additive',
    name: 'Additive',
    description: 'Multiple applications increase total effect up to a cap',
    examples: ['Damage over time effects', 'Bleeds'],
    effectCalculation: 'sum',
    maxStacks: 'varies'
  },
  {
    id: 'independent',
    name: 'Independent',
    description: 'Multiple applications create separate instances with separate timers',
    examples: ['Vulnerabilities to different damage types'],
    effectCalculation: 'separate',
    maxStacks: 'unlimited'
  },
  {
    id: 'diminishing',
    name: 'Diminishing Returns',
    description: 'Each stack is less effective than the previous',
    examples: ['Slows', 'Stat reductions'],
    effectCalculation: 'diminishing',
    formula: 'effect * (1 - 0.5^(stacks-1))',
    maxStacks: 'varies'
  },
  {
    id: 'refreshing',
    name: 'Refreshing',
    description: 'Only the strongest effect applies, new applications refresh duration',
    examples: ['Armor reduction', 'Healing reduction'],
    effectCalculation: 'maximum',
    maxStacks: 1
  }
];

/**
 * Debuff immunities and resistances
 */
export const DEBUFF_IMMUNITIES = [
  {
    id: 'physicalImmunity',
    name: 'Physical Condition Immunity',
    description: 'Immunity to physical status effects',
    affects: ['restraint', 'paralysis', 'slow', 'grapple'],
    examples: 'Incorporeal creatures, constructs, certain undead',
    partialEffect: false
  },
  {
    id: 'mentalImmunity',
    name: 'Mental Effect Immunity',
    description: 'Immunity to mind-affecting status effects',
    affects: ['charm', 'fear', 'sleep', 'confusion'],
    examples: 'Mindless creatures, constructs, certain undead',
    partialEffect: false
  },
  {
    id: 'poisonImmunity',
    name: 'Poison Immunity',
    description: 'Immunity to poison effects',
    affects: ['poison', 'disease'],
    examples: 'Constructs, undead, certain elementals',
    partialEffect: false
  },
  {
    id: 'magicResistance',
    name: 'Magic Resistance',
    description: 'Resistance to magical effects',
    affects: ['all magical debuffs'],
    examples: 'Certain creatures with innate resistance',
    partialEffect: true,
    resistanceValue: 'varies'
  },
  {
    id: 'elementalImmunity',
    name: 'Elemental Immunity',
    description: 'Immunity to specific elemental effects',
    affects: ['corresponding elemental effects'],
    examples: 'Fire elementals immune to fire, ice creatures immune to cold',
    partialEffect: false
  },
  {
    id: 'curseWarding',
    name: 'Curse Warding',
    description: 'Resistance or immunity to curses',
    affects: ['curses', 'hexes'],
    examples: 'Blessed individuals, warded creatures',
    partialEffect: true,
    resistanceValue: 'varies'
  }
];

/**
 * Find a debuff category by ID
 */
export function findDebuffCategoryById(id) {
  return DEBUFF_CATEGORIES.find(category => category.id === id) || null;
}

/**
 * Find a debuff effect type by ID
 */
export function findDebuffEffectById(id) {
  return DEBUFF_EFFECT_TYPES.find(effect => effect.id === id) || null;
}

/**
 * Get all debuff types in a specific category
 */
export function getDebuffsByCategory(categoryId) {
  return DEBUFF_EFFECT_TYPES.filter(effect => effect.category === categoryId);
}

/**
 * Find a save type by ID
 */
export function findSaveTypeById(id) {
  return DEBUFF_SAVE_TYPES.find(saveType => saveType.id === id) || null;
}

/**
 * Find a dispel difficulty by ID
 */
export function findDispelDifficultyById(id) {
  return DEBUFF_DISPEL_DIFFICULTIES.find(difficulty => difficulty.id === id) || null;
}

/**
 * Check if a target is immune or resistant to a specific debuff
 */
export function checkDebuffImmunity(target, debuffId) {
  if (!target || !target.immunities) {
    return { immune: false, resistant: false, resistanceValue: 0 };
  }

  const debuff = findDebuffEffectById(debuffId);
  if (!debuff) {
    return { immune: false, resistant: false, resistanceValue: 0 };
  }

  // Check for direct immunity to this debuff
  if (target.immunities.includes(debuffId)) {
    return { immune: true, resistant: false, resistanceValue: 0 };
  }

  // Check category immunities
  if (target.immunities.includes(debuff.category)) {
    return { immune: true, resistant: false, resistanceValue: 0 };
  }

  // Check immunities that affect this debuff type
  const relevantImmunities = DEBUFF_IMMUNITIES.filter(immunity => {
    if (debuff.category === 'control' && immunity.id === 'physicalImmunity') {
      return true;
    }
    if (debuff.category === 'mental' && immunity.id === 'mentalImmunity') {
      return true;
    }
    if ((debuff.category === 'damage' || debuff.id === 'damageOverTime') &&
        immunity.id === 'elementalImmunity' &&
        immunity.affects.includes(debuff.effectParams.find(p => p.name === 'damageType')?.defaultValue)) {
      return true;
    }
    if (debuff.category === 'cursehex' && immunity.id === 'curseWarding') {
      return true;
    }

    return false;
  });

  if (relevantImmunities.length > 0) {
    // Check if target has any of these immunity types
    for (const immunity of relevantImmunities) {
      if (target.immunities.includes(immunity.id)) {
        if (!immunity.partialEffect) {
          return { immune: true, resistant: false, resistanceValue: 0 };
        } else {
          // Partial resistance
          return {
            immune: false,
            resistant: true,
            resistanceValue: target.resistanceValues?.[immunity.id] || 50
          };
        }
      }
    }
  }

  // Check for magic resistance
  if (target.immunities.includes('magicResistance') && debuff.magical) {
    return {
      immune: false,
      resistant: true,
      resistanceValue: target.resistanceValues?.magicResistance || 50
    };
  }

  return { immune: false, resistant: false, resistanceValue: 0 };
}

/**
 * Calculate the save DC for a debuff effect
 */
export function calculateDebuffSaveDC(debuffId, caster) {
  const debuff = findDebuffEffectById(debuffId);
  if (!debuff) return 10;

  const { base, scaling, type } = debuff.saveDC;
  let dc = base || 10;

  // Add caster level scaling
  if (scaling === 'level' && caster?.level) {
    dc += Math.floor(caster.level / 3);
  }

  // Add relevant ability modifier
  if (caster?.abilityScores) {
    let abilityMod = 0;

    // Determine which ability score to use based on save type
    switch (type) {
      case 'constitution':
      case 'strength':
        abilityMod = Math.floor((caster.abilityScores.strength - 10) / 2);
        break;
      case 'intelligence':
        abilityMod = Math.floor((caster.abilityScores.intelligence - 10) / 2);
        break;
      case 'wisdom':
        abilityMod = Math.floor((caster.abilityScores.wisdom - 10) / 2);
        break;
      case 'charisma':
        abilityMod = Math.floor((caster.abilityScores.charisma - 10) / 2);
        break;
      case 'agility':
        abilityMod = Math.floor((caster.abilityScores.agility - 10) / 2);
        break;
      case 'varies':
      default:
        // Use highest mental attribute
        abilityMod = Math.max(
          Math.floor((caster.abilityScores.intelligence - 10) / 2),
          Math.floor((caster.abilityScores.wisdom - 10) / 2),
          Math.floor((caster.abilityScores.charisma - 10) / 2)
        );
    }

    dc += abilityMod;
  }

  // Add proficiency bonus
  if (caster?.proficiencyBonus) {
    dc += caster.proficiencyBonus;
  }

  return dc;
}

/**
 * Calculate the effective value of a debuff based on parameters
 */
export function calculateDebuffPotency(debuffId, params, caster) {
  const debuff = findDebuffEffectById(debuffId);
  if (!debuff) return { value: 0, duration: 0 };

  let value = 0;
  let duration = params.duration || 0;

  switch (debuffId) {
    case 'statPenalty':
      // Base value from params
      value = params.amount || 0;

      // Scale with caster's relevant attributes only (no level scaling)
      if (caster) {
        const relevantStat = getRelevantCasterStat(debuff.category, caster);
        const statModifier = Math.floor((relevantStat - 10) / 2);

        value += statModifier;

        // Percentage debuffs scale differently
        if (params.isPercentage) {
          value = Math.min(value, 50); // Cap at 50%
        }
      }
      break;

    case 'damageVulnerability':
      // Base percentage from params
      value = params.amount || 0;

      // Apply cap without level scaling
      if (caster) {
        // Cap at reasonable maximum
        value = Math.min(value, 100); // Cap at 100% increase
      }
      break;

    case 'damageOverTime':
      // For DoT effects, value is represented as damage per tick
      value = params.damagePerTick || '1d6';

      // No level scaling for dice notation
      break;

    // Add cases for other debuff types

    default:
      value = params.amount || params.value || 0;
  }

  // Scale duration with caster attributes if applicable
  if (caster && duration > 0) {
    const durationModifier = caster.abilityScores?.intelligence
      ? Math.floor((caster.abilityScores.intelligence - 10) / 4)
      : 0;

    duration += durationModifier;
  }

  return {
    value,
    duration,
    isPercentage: params.isPercentage || false,
    customParams: params
  };
}

/**
 * Calculate how a debuff stacks with existing instances
 */
export function calculateDebuffStacking(debuffId, existingStacks, newInstance) {
  const debuff = findDebuffEffectById(debuffId);
  if (!debuff) {
    return {
      stacks: false,
      result: existingStacks
    };
  }

  const { stacking, maxStacks } = debuff;
  const stackingRule = DEBUFF_STACKING_RULES.find(rule => rule.id === stacking);

  if (!stackingRule) {
    // Default to non-stacking behavior
    return {
      stacks: false,
      result: [newInstance],
      replaced: existingStacks.length > 0
    };
  }

  switch (stacking) {
    case 'none':
      // Replace existing stack with new one
      return {
        stacks: false,
        result: [newInstance],
        replaced: existingStacks.length > 0
      };

    case 'additive':
      // Add together up to max stacks
      if (existingStacks.length >= (maxStacks || 5)) {
        // Replace oldest stack
        return {
          stacks: true,
          result: [...existingStacks.slice(1), newInstance],
          maxReached: true
        };
      } else {
        // Add new stack
        return {
          stacks: true,
          result: [...existingStacks, newInstance]
        };
      }

    case 'independent':
      // Each application is independent
      return {
        stacks: true,
        result: [...existingStacks, newInstance]
      };

    case 'diminishing':
      // Replace existing with diminished effect
      const totalValue = existingStacks.reduce((sum, stack) =>
        sum + (stack.value || 0), 0);

      // Apply diminishing returns formula
      const diminishedValue = calculateDiminishedValue(
        totalValue,
        newInstance.value,
        existingStacks.length + 1
      );

      return {
        stacks: true,
        result: [{
          ...newInstance,
          value: diminishedValue,
          originalValue: newInstance.value,
          stackCount: existingStacks.length + 1
        }],
        diminished: true
      };

    case 'refreshing':
      // Keep strongest effect but refresh duration
      const strongestEffect = existingStacks.reduce((strongest, current) =>
        (current.value > strongest.value) ? current : strongest,
        { value: 0 });

      return {
        stacks: false,
        result: [{
          ...((newInstance.value > strongestEffect.value) ? newInstance : strongestEffect),
          duration: newInstance.duration // Always use new duration
        }],
        refreshed: true
      };

    default:
      return {
        stacks: false,
        result: [newInstance],
        replaced: existingStacks.length > 0
      };
  }
}

/**
 * Get the relevant caster stat for a debuff category
 */
function getRelevantCasterStat(category, caster) {
  if (!caster || !caster.abilityScores) return 10;

  const { abilityScores } = caster;

  switch (category) {
    case 'statReduction':
    case 'damage':
      return abilityScores.intelligence || 10;

    case 'vulnerability':
    case 'control':
      return abilityScores.spirit || 10;

    case 'spreading':
      return abilityScores.intelligence || 10;

    case 'cursehex':
      return abilityScores.charisma || 10;

    case 'mental':
      return abilityScores.charisma || 10;

    case 'disabling':
      return abilityScores.spirit || 10;

    default:
      // Default to highest mental stat
      return Math.max(
        abilityScores.intelligence || 10,
        abilityScores.spirit || 10,
        abilityScores.charisma || 10
      );
  }
}

/**
 * Calculate diminished value for stacking debuffs
 */
function calculateDiminishedValue(currentValue, newValue, stackCount) {
  // Common diminishing returns formula: effect * (1 - 0.5^(stacks-1))
  const diminishingFactor = 1 - Math.pow(0.5, stackCount - 1);
  return (currentValue + newValue) * diminishingFactor;
}