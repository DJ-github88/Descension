// Test spell to verify debuff effects configuration display
export const testDebuffSpell = {
  id: 'test_debuff_spell',
  name: 'Curse of Weakness',
  description: 'A comprehensive test spell that applies multiple debuff effects with various configurations',
  icon: 'spell_shadow_curseofweakness',
  school: 'necromancy',
  level: 3,
  castingTime: '1 action',
  range: '60 feet',
  components: ['V', 'S', 'M'],
  duration: '1 minute',
  durationType: 'turns',
  durationValue: 10,
  durationUnit: 'rounds',
  
  // Debuff configuration with status effects
  debuffConfig: {
    duration: 10,
    durationValue: 10,
    durationType: 'turns',
    durationUnit: 'rounds',
    restType: 'short',
    canBeDispelled: true,
    concentrationRequired: true,
    stackingRule: 'replace',
    maxStacks: 1,
    magnitude: -2,
    magnitudeType: 'flat',
    statModifiers: [
      {
        id: 'strength',
        name: 'Strength',
        magnitude: -3,
        magnitudeType: 'flat'
      },
      {
        id: 'constitution',
        name: 'Constitution',
        magnitude: -2,
        magnitudeType: 'flat'
      }
    ],
    statusEffects: [
      {
        id: 'charmed',
        name: 'Charmed',
        category: 'mental',
        icon: 'spell_shadow_mindsteal',
        description: 'Regards the charmer as a friendly acquaintance',
        hasAdvancedConfig: true,
        // Configuration from status effect window
        option: 'dominated',
        saveDC: 16,
        canAttackCharmer: false
      },
      {
        id: 'frightened',
        name: 'Frightened',
        category: 'mental',
        icon: 'spell_shadow_possession',
        description: 'Disadvantage on ability checks and attacks while source of fear is in sight',
        hasAdvancedConfig: true,
        // Configuration from status effect window
        option: 'terrified',
        fearRadius: 30,
        penaltyMagnitude: 3
      },
      {
        id: 'poisoned',
        name: 'Poisoned',
        category: 'physical',
        icon: 'ability_rogue_poisonousanimosity',
        description: 'Disadvantage on attack rolls and ability checks',
        hasAdvancedConfig: true,
        // Configuration from status effect window
        option: 'debilitating',
        damagePerRound: '1d6',
        saveDC: 15
      },
      {
        id: 'slowed',
        name: 'Slowed',
        category: 'physical',
        icon: 'spell_frost_frostshock',
        description: 'Movement speed and action points reduced',
        hasAdvancedConfig: true,
        // Configuration from status effect window
        option: 'lethargic',
        speedReduction: '50',
        actionPointReduction: 2
      },
      {
        id: 'burning',
        name: 'Burning',
        category: 'elemental',
        icon: 'spell_fire_soulburn',
        description: 'Taking continuous fire damage',
        hasAdvancedConfig: true,
        // Configuration from status effect window
        option: 'intense',
        damagePerRound: '2d4',
        spreadChance: '25'
      },
      {
        id: 'cursed',
        name: 'Cursed',
        category: 'magical',
        icon: 'spell_shadow_antishadow',
        description: 'Afflicted by a magical curse causing misfortune',
        hasAdvancedConfig: true,
        // Configuration from status effect window
        option: 'hexed',
        failureChance: '25',
        rollPenalty: 2
      },
      {
        id: 'weakened',
        name: 'Weakened',
        category: 'physical',
        icon: 'spell_shadow_curseofweakness',
        description: 'Physical might is reduced',
        hasAdvancedConfig: true,
        // Configuration from status effect window
        option: 'exhausted',
        damageReduction: '50',
        strengthPenalty: 4
      }
    ],
    isProgressive: false,
    progressiveStages: [],
    // Saving throw configuration
    difficultyClass: 16,
    savingThrow: 'constitution'
  },
  
  targetingConfig: {
    targetingType: 'single',
    range: '60 feet',
    validTargets: ['enemy']
  },
  
  tags: ['debuff', 'curse', 'necromancy', 'test']
};
