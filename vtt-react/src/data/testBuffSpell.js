// Test spell to verify buff effects configuration display
export const testBuffSpell = {
  id: 'test_buff_spell',
  name: 'Ultimate Enhancement',
  description: 'A comprehensive test spell that applies multiple buff effects with various configurations',
  icon: 'spell_holy_blessedrecovery',
  school: 'enchantment',
  level: 2,
  castingTime: '1 action',
  range: 'touch',
  components: ['V', 'S'],
  duration: '10 minutes',
  durationType: 'turns',
  durationValue: 10,
  durationUnit: 'rounds',
  
  // Buff configuration with status effects
  buffConfig: {
    duration: 10,
    durationValue: 10,
    durationType: 'turns',
    durationUnit: 'rounds',
    restType: 'short',
    canBeDispelled: true,
    concentrationRequired: false,
    stackingRule: 'replace',
    maxStacks: 1,
    magnitude: 2,
    magnitudeType: 'flat',
    statModifiers: [
      {
        id: 'strength',
        name: 'Strength',
        magnitude: 3,
        magnitudeType: 'flat'
      }
    ],
    statusEffects: [
      {
        id: 'combat_advantage',
        name: 'Combat Advantage',
        category: 'combat',
        icon: 'classicon_warrior',
        description: 'Gain advantage on specific combat rolls',
        hasAdvancedConfig: true,
        // Configuration from status effect window
        advantageType: 'attack',
        affectsMelee: true,
        affectsRanged: false,
        magnitude: 2,
        magnitudeType: 'flat'
      },
      {
        id: 'resistance',
        name: 'Resistance',
        category: 'defensive',
        icon: 'spell_holy_devotion',
        description: 'Resistance to specific damage types',
        hasAdvancedConfig: true,
        // Configuration from status effect window
        damageTypes: ['fire', 'cold'],
        resistanceValue: '50'
      },
      {
        id: 'haste',
        name: 'Haste',
        category: 'mobility',
        icon: 'ability_rogue_sprint',
        description: 'Increase speed and reaction time',
        hasAdvancedConfig: true,
        // Configuration from status effect window
        option: 'movement',
        speedBonus: '50'
      },
      {
        id: 'elemental_infusion',
        name: 'Elemental Infusion',
        category: 'empowerment',
        icon: 'spell_fire_immolation',
        description: 'Infuse attacks with elemental energy',
        hasAdvancedConfig: true,
        // Configuration from status effect window
        option: 'fire',
        extraDamage: '1d6',
        procChance: '75'
      },
      {
        id: 'luck',
        name: 'Luck',
        category: 'fortune',
        icon: 'inv_misc_gem_pearl_06',
        description: 'Improve your fortune and chance of success',
        hasAdvancedConfig: true,
        // Configuration from status effect window
        option: 'major',
        rerollCount: 3
      },
      {
        id: 'skill_mastery',
        name: 'Skill Mastery',
        category: 'skills',
        icon: 'classicon_rogue',
        description: 'Gain advantage on specific skill checks',
        hasAdvancedConfig: true,
        // Configuration from status effect window
        option: 'mental',
        magnitude: 4
      },
      {
        id: 'invisibility',
        name: 'Invisibility',
        category: 'stealth',
        icon: 'ability_stealth',
        description: 'Become difficult or impossible to see',
        hasAdvancedConfig: true,
        // Configuration from status effect window
        option: 'greater',
        detectionDC: 20
      },
      {
        id: 'inspired',
        name: 'Inspired',
        category: 'mental',
        icon: 'spell_holy_divineillumination',
        description: 'Gain bonuses to ability checks, attacks, or saving throws',
        hasAdvancedConfig: true,
        // Configuration from status effect window
        option: 'bardic',
        inspirationDie: 'd8',
        usesPerDuration: 3
      },
      {
        id: 'damage_shield',
        name: 'Damage Shield',
        category: 'protection',
        icon: 'classicon_paladin',
        description: 'The next X hits against you deal reduced damage',
        hasAdvancedConfig: true,
        // Configuration from status effect window
        option: 'complete',
        reductionPercent: '75',
        hitCount: 2
      }
    ],
    isProgressive: false,
    progressiveStages: []
  },
  
  targetingConfig: {
    targetingType: 'single',
    range: 'touch',
    validTargets: ['ally', 'self']
  },
  
  tags: ['buff', 'enhancement', 'test']
};
