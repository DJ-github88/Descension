/**
 * Buff Types Module
 *
 * Defines categories and configurations for buff effects that provide
 * beneficial enhancements and advantages to targets.
 */

import {
  faArrowUp,
  faGauge,
  faShield,
  faHeart
} from '@fortawesome/free-solid-svg-icons';

/**
 * Buff effect categories with detailed examples
 */
export const BUFF_CATEGORIES = [
  {
    id: 'statEnhancement',
    name: 'Stat Enhancement',
    description: 'Directly improves one or more character statistics',
    icon: faArrowUp,
    examples: ['Blessing of Kings', 'Bull\'s Strength', 'Eagle\'s Splendor'],
    stackingRule: 'Same stat bonuses from different sources typically stack, but identical buffs do not',
    duration: 'medium',
    dispellable: true,
    commonTargets: ['allies'],
    recommendedUse: 'Apply before combat or when specific challenges require stat bonuses'
  },
  {
    id: 'combat',
    name: 'Combat Enhancement',
    description: 'Improves combat abilities',
    icon: faGauge,
    examples: ['Heroism', 'Divine Favor', 'Shield of Faith'],
    stackingRule: 'Different combat bonuses stack, same type usually takes highest value',
    duration: 'medium',
    dispellable: true,
    commonTargets: ['tank', 'party'],
    recommendedUse: 'Apply when facing tough combat encounters'
  },
  {
    id: 'resistance',
    name: 'Resistance',
    description: 'Provides protection against specific damage types or effects',
    icon: faShield,
    examples: ['Fire Resistance', 'Shadow Ward', 'Protection from Energy'],
    stackingRule: 'Different damage type resistances stack, same type usually takes highest value',
    duration: 'medium',
    dispellable: true,
    commonTargets: ['tank', 'party'],
    recommendedUse: 'Apply when facing enemies with predictable damage types'
  },

];

/**
 * Buff stacking rules defining how different buffs interact
 */
export const BUFF_STACKING_RULES = [
  { value: 'replace', label: 'Replace existing' },
  { value: 'highest', label: 'Keep highest' },
  { value: 'cumulative', label: 'Cumulative (add together)' },
  { value: 'selfStacking', label: 'Self-stacking (apply multiple times)' },
  { value: 'progressive', label: 'Progressive (increases over time)' }
];

/**
 * Duration options for buff effects
 */
export const BUFF_DURATIONS = [
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
 * Buff duration categories with typical time ranges
 */
export const BUFF_DURATIONS_CATEGORIES = [
  {
    id: 'instant',
    name: 'Instant',
    description: 'One-time immediate effect',
    typical: '0 seconds',
    examples: ['Healing Touch', 'Magic Missile']
  },
  {
    id: 'veryShort',
    name: 'Very Short',
    description: 'Brief tactical advantage',
    typical: '1-5 seconds',
    examples: ['Power Infusion', 'Shield Block']
  },
  {
    id: 'short',
    name: 'Short',
    description: 'Lasts for a few combat rounds',
    typical: '6-30 seconds',
    examples: ['Shield Wall', 'Icy Veins']
  },
  {
    id: 'medium',
    name: 'Medium',
    description: 'Lasts for a full encounter',
    typical: '1-5 minutes',
    examples: ['Power Word: Fortitude', 'Arcane Intellect']
  },
  {
    id: 'long',
    name: 'Long',
    description: 'Lasts for multiple encounters',
    typical: '10-30 minutes',
    examples: ['Detect Magic', 'Mark of the Wild']
  },
  {
    id: 'veryLong',
    name: 'Very Long',
    description: 'Lasts for a significant gameplay session',
    typical: '30-60 minutes',
    examples: ['Well Fed', 'Flask effects']
  },
  {
    id: 'permanent',
    name: 'Permanent',
    description: 'Lasts until dispelled or removed by specific condition',
    typical: 'Until dispelled',
    examples: ['Resurrection Sickness', 'Soul Stone']
  },
  {
    id: 'maintained',
    name: 'Maintained',
    description: 'Lasts as long as the caster maintains concentration',
    typical: 'Variable',
    examples: ['Channeled spells', 'Auras']
  }
];

/**
 * Detailed buff effect types with parameters
 */
export const BUFF_EFFECT_TYPES = [
  {
    id: 'statBuff',
    name: 'Stat Buff',
    description: 'Increases one or more character statistics',
    effectParams: [
      {
        name: 'statId',
        type: 'string',
        description: 'ID of the stat to enhance',
        required: true
      },
      {
        name: 'amount',
        type: 'number',
        description: 'Amount to increase the stat by',
        required: true
      },
      {
        name: 'isPercentage',
        type: 'boolean',
        description: 'Whether the amount is a percentage or flat value',
        defaultValue: false
      }
    ],
    stackingRule: 'highestValue',
    category: 'statEnhancement'
  },
  {
    id: 'damageIncrease',
    name: 'Damage Increase',
    description: 'Increases damage dealt',
    effectParams: [
      {
        name: 'damageType',
        type: 'string',
        description: 'Specific damage type to enhance, or "all"',
        defaultValue: 'all'
      },
      {
        name: 'amount',
        type: 'number',
        description: 'Percentage to increase damage by',
        required: true
      },
      {
        name: 'affectsSpellsOnly',
        type: 'boolean',
        description: 'Whether only spells are affected',
        defaultValue: false
      }
    ],
    stackingRule: 'multiplicative',
    category: 'combat'
  },
  {
    id: 'damageMitigation',
    name: 'Damage Mitigation',
    description: 'Reduces damage taken',
    effectParams: [
      {
        name: 'damageType',
        type: 'string',
        description: 'Specific damage type to protect against, or "all"',
        defaultValue: 'all'
      },
      {
        name: 'amount',
        type: 'number',
        description: 'Percentage to reduce damage by',
        required: true
      },
      {
        name: 'maxDamageReduction',
        type: 'number',
        description: 'Maximum amount of damage that can be reduced',
        defaultValue: null
      }
    ],
    stackingRule: 'highestValue',
    category: 'resistance'
  },

  {
    id: 'statusEffectBuff',
    name: 'Status Effect',
    description: 'Applies a positive status effect',
    effectParams: [
      {
        name: 'statusId',
        type: 'string',
        description: 'ID of the status effect to apply',
        required: true
      },
      {
        name: 'duration',
        type: 'number',
        description: 'Duration in seconds',
        required: true
      },
      {
        name: 'customParams',
        type: 'object',
        description: 'Custom parameters for the status effect',
        defaultValue: {}
      }
    ],
    stackingRule: 'independent',
    category: 'statEnhancement'
  },
  {
    id: 'combatAdvantage',
    name: 'Combat Advantage',
    description: 'Provides a tactical advantage in combat',
    effectParams: [
      {
        name: 'advantageId',
        type: 'string',
        description: 'ID of the combat advantage to apply',
        required: true
      },
      {
        name: 'duration',
        type: 'number',
        description: 'Duration in seconds',
        required: true
      },
      {
        name: 'customParams',
        type: 'object',
        description: 'Custom parameters for the advantage',
        defaultValue: {}
      }
    ],
    stackingRule: 'independent',
    category: 'combat'
  },
  {
    id: 'auraEffect',
    name: 'Aura Effect',
    description: 'Continuous effect that radiates from the caster',
    effectParams: [
      {
        name: 'radius',
        type: 'number',
        description: 'Radius of effect in feet',
        required: true
      },
      {
        name: 'effectId',
        type: 'string',
        description: 'ID of the effect to apply',
        required: true
      },
      {
        name: 'affectsAllies',
        type: 'boolean',
        description: 'Whether the aura affects allies',
        defaultValue: true
      },
      {
        name: 'affectsEnemies',
        type: 'boolean',
        description: 'Whether the aura affects enemies',
        defaultValue: false
      }
    ],
    stackingRule: 'exclusiveType',
    category: 'statEnhancement'
  },
  {
    id: 'movementBuff',
    name: 'Movement Enhancement',
    description: 'Enhances movement capabilities',
    effectParams: [
      {
        name: 'speedIncrease',
        type: 'number',
        description: 'Percentage increase to movement speed',
        defaultValue: 0
      },
      {
        name: 'newMovementType',
        type: 'string',
        description: 'New movement type granted (flying, swimming, etc.)',
        defaultValue: null
      },
      {
        name: 'duration',
        type: 'number',
        description: 'Duration in seconds',
        required: true
      }
    ],
    stackingRule: 'highestValue',
    category: 'statEnhancement'
  },
  {
    id: 'triggeredEffect',
    name: 'Triggered Effect',
    description: 'Effect that activates under specific conditions',
    effectParams: [
      {
        name: 'triggerCondition',
        type: 'string',
        description: 'Condition that triggers the effect',
        required: true
      },
      {
        name: 'effectId',
        type: 'string',
        description: 'ID of the effect to trigger',
        required: true
      },
      {
        name: 'cooldown',
        type: 'number',
        description: 'Cooldown between triggers in seconds',
        defaultValue: 0
      },
      {
        name: 'maxTriggers',
        type: 'number',
        description: 'Maximum number of times the effect can trigger',
        defaultValue: null
      }
    ],
    stackingRule: 'independent',
    category: 'combat'
  }
];

/**
 * Buff synergy definitions describing how buffs can enhance each other
 */
export const BUFF_SYNERGIES = [
  {
    id: 'damageAmplification',
    name: 'Damage Amplification',
    description: 'Combination of effects that multiply damage output',
    buffs: ['damageIncrease', 'criticalEnhancement', 'statBuff'],
    synergy: 'Multiplicative damage increases create exponential power growth',
    recommendedCombo: 'Damage increase + Critical enhancement + Primary stat buff'
  },
  {
    id: 'survivability',
    name: 'Survivability Stack',
    description: 'Combination of effects that maximize damage mitigation',
    buffs: ['damageMitigation', 'shieldEffect', 'healingReceived'],
    synergy: 'Multiple layers of protection provide redundancy against different threats',
    recommendedCombo: 'Damage reduction + Absorption shield + Enhanced healing'
  },
  {
    id: 'resourceManagement',
    name: 'Resource Management',
    description: 'Combination of effects that optimize resource usage',
    buffs: ['resourceRegen', 'costReduction', 'resourcePool'],
    synergy: 'Increased regeneration paired with reduced costs creates sustainable casting',
    recommendedCombo: 'Resource regeneration + Cost reduction + Maximum resource increase'
  },
  {
    id: 'mobilitySuite',
    name: 'Mobility Suite',
    description: 'Combination of effects that maximize movement capability',
    buffs: ['movementBuff', 'phaseShift', 'unstoppable'],
    synergy: 'Speed combined with obstacle bypassing allows unparalleled mobility',
    recommendedCombo: 'Movement speed + Phase shifting + Immunity to movement impairment'
  },
  {
    id: 'tacticalControl',
    name: 'Tactical Control',
    description: 'Combination of effects that control the battlefield',
    buffs: ['auraEffect', 'zoneControl', 'statusEffectBuff'],
    synergy: 'Area control combined with status effects restricts enemy options',
    recommendedCombo: 'Protective aura + Area denial + Status resistance'
  }
];

/**
 * Find a buff category by ID
 */
export function findBuffCategoryById(id) {
  return BUFF_CATEGORIES.find(category => category.id === id) || null;
}

/**
 * Find a buff effect type by ID
 */
export function findBuffEffectById(id) {
  return BUFF_EFFECT_TYPES.find(effect => effect.id === id) || null;
}

/**
 * Get all buff types in a specific category
 */
export function getBuffsByCategory(categoryId) {
  return BUFF_EFFECT_TYPES.filter(effect => effect.category === categoryId);
}

/**
 * Get buff duration object by ID
 */
export function getBuffDurationById(durationId) {
  return BUFF_DURATIONS_CATEGORIES.find(duration => duration.id === durationId) || null;
}

/**
 * Find buff synergies for a specific buff
 */
export function getBuffSynergies(buffId) {
  return BUFF_SYNERGIES.filter(synergy => synergy.buffs.includes(buffId));
}

/**
 * Check if two buffs would conflict with each other
 */
export function checkBuffConflicts(buffIdA, buffIdB) {
  const buffA = findBuffEffectById(buffIdA);
  const buffB = findBuffEffectById(buffIdB);

  if (!buffA || !buffB) {
    return { conflict: false, reason: 'One or both buffs not found' };
  }

  // Same effect typically conflicts
  if (buffIdA === buffIdB) {
    return {
      conflict: true,
      reason: 'Same buff',
      resolution: 'refresh',
      resolutionMethod: 'New application refreshes duration'
    };
  }

  // Check stacking rules
  if (buffA.stackingRule === 'exclusive' || buffB.stackingRule === 'exclusive') {
    return {
      conflict: true,
      reason: 'Exclusive buff',
      resolution: 'replace',
      resolutionMethod: 'New buff replaces old buff'
    };
  }

  // Check if they're the same category with category limitations
  if (buffA.category === buffB.category) {
    const category = findBuffCategoryById(buffA.category);
    if (category && category.stackingRule.includes('limited')) {
      return {
        conflict: true,
        reason: 'Category limit',
        resolution: 'category',
        resolutionMethod: 'Follows category stacking rules'
      };
    }
  }

  // Check for specific known conflicts
  const knownConflicts = {
    'damageIncrease': ['weakenAttack'],
    'damageMitigation': ['vulnerabilityEffect'],
    'resourceRegen': ['resourceDrain'],
    'movementBuff': ['movementPenalty']
  };

  if (knownConflicts[buffIdA] && knownConflicts[buffIdA].includes(buffIdB) ||
      knownConflicts[buffIdB] && knownConflicts[buffIdB].includes(buffIdA)) {
    return {
      conflict: true,
      reason: 'Opposing effects',
      resolution: 'negate',
      resolutionMethod: 'Effects may partially or fully negate each other'
    };
  }

  return { conflict: false };
}

/**
 * Calculate the effective value of a buff based on parameters
 */
export function calculateBuffPotency(buffId, params, caster) {
  const buff = findBuffEffectById(buffId);
  if (!buff) return { value: 0, duration: 0 };

  let value = 0;
  let duration = params.duration || 0;

  switch (buffId) {
    case 'statBuff':
      // Base value from params
      value = params.amount || 0;

      // Scale with caster's relevant attributes only (no level scaling)
      if (caster) {
        const relevantStat = getRelevantCasterStat(buff.category, caster);
        const statModifier = Math.floor((relevantStat - 10) / 2);

        value += statModifier;

        // Percentage buffs scale differently
        if (params.isPercentage) {
          value = Math.min(value, 50); // Cap at 50%
        }
      }
      break;

    case 'damageIncrease':
      // Base percentage from params
      value = params.amount || 0;

      // Scale with caster's specialization only (no level scaling)
      if (caster) {
        if (caster.specialization === 'damage') {
          value *= 1.2; // 20% bonus for damage spec
        }

        // Cap at reasonable maximum
        value = Math.min(value, 100); // Cap at 100% increase
      }
      break;

    case 'damageMitigation':
      // Base mitigation from params
      value = params.amount || 0;

      // Scale with caster's specialization only (no level scaling)
      if (caster) {
        if (caster.specialization === 'tank') {
          value *= 1.2; // 20% bonus for tank spec
        }

        // Cap at maximum resistance
        value = Math.min(value, 75); // Cap at 75% resistance
      }
      break;

    // Add cases for other buff types

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
 * Get the relevant caster stat for a buff category
 */
function getRelevantCasterStat(category, caster) {
  if (!caster || !caster.abilityScores) return 10;

  const { abilityScores } = caster;

  switch (category) {
    case 'statEnhancement':
    case 'specialAbility':
      return abilityScores.intelligence || 10;

    case 'resistance':
    case 'aura':
      return abilityScores.spirit || 10;

    case 'mobility':
      return abilityScores.agility || 10;

    case 'triggered':
      return abilityScores.intelligence || 10;

    case 'combat':
      return abilityScores.strength || 10;

    default:
      // Default to highest mental stat
      return Math.max(
        abilityScores.intelligence || 10,
        abilityScores.spirit || 10,
        abilityScores.charisma || 10
      );
  }
}