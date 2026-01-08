/**
 * Skill-Based Abilities Data
 * 
 * These are special abilities unlocked by skill proficiency.
 * Characters who are proficient in a skill (NOVICE rank or higher) gain access to these abilities.
 * 
 * All abilities follow the spell card format from SPELL_WIZARD_TO_SPELLCARD_TEMPLATE.md
 */

// Skill ID mapping (from rules table to skill definition IDs)
const SKILL_NAME_TO_ID = {
  'Acrobatics': 'acrobatics',
  'Animal Handling': 'animalHandling',
  'Arcana': 'arcana',
  'Athletics': 'athletics',
  'Deception': 'deception',
  'History': 'history',
  'Insight': 'insight',
  'Intimidation': 'intimidation',
  'Investigation': 'investigation',
  'Medicine': 'medicine',
  'Nature': 'nature',
  'Perception': 'perception',
  'Performance': 'performance',
  'Persuasion': 'persuasion',
  'Religion': 'religion',
  'Sleight of Hand': 'sleightOfHand',
  'Stealth': 'stealth',
  'Survival': 'survival'
};

/**
 * Get action points from cost string
 */
const parseActionPoints = (costStr) => {
  if (!costStr || costStr === '-' || costStr === '?') return 1;
  const match = costStr.match(/(\d+)\s*AP/i);
  return match ? parseInt(match[1]) : 1;
};

/**
 * Get spell type from type code
 * A = Action, R = Reaction, P = Passive
 */
const getSpellType = (typeCode) => {
  switch (typeCode) {
    case 'R': return 'REACTION';
    case 'P': return 'PASSIVE';
    default: return 'ACTION';
  }
};

/**
 * Skill-Based Abilities
 * Each ability is a spell card that requires proficiency in the associated skill
 */
export const SKILL_ABILITIES = [
  // Acrobatics - Charged Squat
  {
    id: 'skill_acrobatics_charged_squat',
    name: 'Charged Squat',
    description: 'Jump up to 10 ft. horizontally or vertically. On a miss, you land prone. Acrobatics roll vs a moderate die (d8); add 5 ft. by stepping the die up once (e.g., to d10).',
    spellType: 'ACTION',
    effectTypes: ['utility'],
    typeConfig: {
      school: 'physical',
      icon: 'ability_rogue_sprint',
      tags: ['skill', 'acrobatics', 'movement', 'proficient']
    },
    utilityConfig: {
      utilityType: 'movement',
      subtype: 'jump',
      description: 'Jump up to 10 ft. horizontally or vertically. On a miss, you land prone.',
      selectedEffects: [{
        id: 'jump',
        name: 'Jump',
        description: 'Jump up to 10 ft. horizontally or vertically. On a miss, you land prone.',
        mechanicsText: '10 ft horizontal or 10 ft vertical • Acrobatics roll vs d8 • Add 5 ft by stepping die up once (e.g., d8 → d10)',
        distance: 10,
        verticalDistance: 10,
        needsLineOfSight: false
      }],
      duration: 0,
      durationUnit: 'instant',
      concentration: false,
      power: 'minor'
    },
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      rangeDistance: 0
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      actionPoints: 1,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    skillRequirement: {
      skillId: 'acrobatics',
      minRank: 'NOVICE'
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'acrobatics',
        baseDifficulty: 'd8',
        onFailure: 'fall_prone',
        enhancement: {
          additionalDistance: 5,
          difficultyIncrease: 1 // Step die up once
        }
      }
    }
  },

  // Animal Handling - Beast Command
  {
    id: 'skill_animal_handling_beast_command',
    name: 'Beast Command',
    description: 'A sharp command snaps your pet to attention. Start with an easy die (d6) and shift it up or down based on pet Int/Wis vs your Int/Wis.',
    spellType: 'ACTION',
    effectTypes: ['control'],
    typeConfig: {
      school: 'nature',
      icon: 'ability_hunter_beastcall',
      tags: ['skill', 'animalHandling', 'control', 'proficient']
    },
    controlConfig: {
      controlType: 'mind_control',
      strength: 'moderate',
      duration: 0,
      durationUnit: 'instant',
      effects: [{
        id: 'command',
        name: 'Command',
        description: 'Command your pet to perform an action',
        mechanicsText: 'Range: 30 ft • Start with d6, shift up/down based on pet Int/Wis vs your Int/Wis'
      }]
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 30,
      targetRestrictions: ['pet', 'beast']
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      actionPoints: 1,
      components: ['verbal']
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    skillRequirement: {
      skillId: 'animalHandling',
      minRank: 'NOVICE'
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'animalHandling',
        baseDifficulty: 'd6',
        formula: '10 - PET_INT - PET_WIS + PLAYER_INT + PLAYER_WIS',
        description: 'DC varies based on pet and player intelligence/spirit'
      }
    }
  },

  // Arcana - Arcane Counter
  {
    id: 'skill_arcana_arcane_counter',
    name: 'Arcane Counter',
    description: 'Ready a counterspell for the next hostile cast within 30 ft. Arcana roll vs a moderate die (d8), stepping the die up by one size per spell level.',
    spellType: 'ACTION',
    effectTypes: ['utility'],
    typeConfig: {
      school: 'arcane',
      icon: 'spell_arcane_arcane01',
      tags: ['skill', 'arcana', 'utility', 'proficient']
    },
    utilityConfig: {
      utilityType: 'control',
      subtype: 'counter',
      description: 'Ready a counterspell for the next hostile cast within 30 ft.',
      selectedEffects: [{
        id: 'counter',
        name: 'Arcane Counter',
        description: 'Ready a counterspell for the next hostile cast within 30 ft.',
        mechanicsText: 'Range: 30 ft • Arcana roll vs d8 • Step die up one size per spell level'
      }],
      duration: 1,
      durationUnit: 'rounds',
      concentration: true,
      power: 'moderate'
    },
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'ranged',
      rangeDistance: 30,
      aoeShape: 'circle',
      aoeParameters: { radius: 30 },
      targetRestrictions: ['enemy']
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      actionPoints: 1,
      components: ['verbal', 'somatic']
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    skillRequirement: {
      skillId: 'arcana',
      minRank: 'NOVICE'
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'arcana',
        baseDifficulty: 'd8',
        scaling: 'per_spell_level'
      }
    }
  },

  // Athletics - Grapple
  {
    id: 'skill_athletics_grapple',
    name: 'Grapple',
    description: 'Using your brute force you restrain an opponent, making it hard for them to move and perform certain actions until your next turn. Athletics Roll vs. Target\'s Strength or Dexterity Roll. Restrained characters have 0 speed, gain disadvantage on rolls and attack rolls made against it have advantage.',
    spellType: 'ACTION',
    effectTypes: ['control'],
    typeConfig: {
      school: 'physical',
      icon: 'ability_warrior_challange',
      tags: ['skill', 'athletics', 'control', 'proficient']
    },
    controlConfig: {
      controlType: 'restraint',
      strength: 'moderate',
      duration: 1,
      durationUnit: 'rounds',
      saveDC: 0, // Opposed roll
      saveType: 'strength', // Or agility
      savingThrow: true,
      effects: [{
        id: 'bind',
        name: 'Grapple',
        description: 'Restrain target, reducing speed to 0 and granting advantage on attacks against them',
        mechanicsText: 'Athletics Roll vs Target\'s Strength or Agility Roll • Speed becomes 0 • Disadvantage on rolls • Attacks against target have advantage',
        config: {
          restraintType: 'physical'
        }
      }]
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'touch',
      rangeDistance: 5,
      targetRestrictions: ['enemy', 'creature']
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      actionPoints: 1,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    skillRequirement: {
      skillId: 'athletics',
      minRank: 'NOVICE'
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'athletics',
        opposedRoll: true,
        opponentSave: ['strength', 'agility']
      }
    }
  },

  // Deception - Misdirect
  {
    id: 'skill_deception_misdirect',
    name: 'Misdirect',
    description: 'A quick ruse leaves a creature within 10 ft. surprised. Opponent resists with a difficulty die set by their Intelligence (easy d6 for dull, up to challenging d10 for sharp minds). Surprised targets can\'t react and have disadvantage on attacks.',
    spellType: 'ACTION',
    effectTypes: ['debuff'],
    typeConfig: {
      school: 'mental',
      icon: 'ability_rogue_deceive',
      tags: ['skill', 'deception', 'debuff', 'proficient']
    },
    debuffConfig: {
      debuffType: 'statusEffect',
      durationValue: 1,
      durationType: 'rounds',
      durationUnit: 'rounds',
      saveDC: 0, // Dynamic based on target intelligence
      saveType: 'intelligence',
      saveOutcome: 'negates',
      effects: [{
        id: 'surprised',
        name: 'Surprised',
        description: 'Cannot react and has disadvantage on attacks • DC varies by target Intelligence (d6 for dull, up to d10 for sharp minds)',
        mechanicsText: ''
      }]
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 10,
      targetRestrictions: ['enemy', 'creature']
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      actionPoints: 1,
      components: ['verbal']
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    skillRequirement: {
      skillId: 'deception',
      minRank: 'NOVICE'
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'deception',
        baseDifficulty: 'd6',
        scaling: 'target_intelligence'
      }
    }
  },

  // History - Lore Recall
  {
    id: 'skill_history_lore_recall',
    name: 'Lore Recall',
    description: 'Recall a creature\'s tricks within 30 ft. Start with a moderate die (d8) and step it up by one size for tougher CRs.',
    spellType: 'ACTION',
    effectTypes: ['utility'],
    typeConfig: {
      school: 'mental',
      icon: 'spell_holy_magicalsentry',
      tags: ['skill', 'history', 'utility', 'proficient']
    },
    utilityConfig: {
      utilityType: 'information',
      subtype: 'recall',
      description: 'Recall information about a creature\'s abilities and tactics',
      selectedEffects: [{
        id: 'recall',
        name: 'Lore Recall',
        description: 'Recall information about a creature\'s abilities and tactics',
        mechanicsText: 'Range: 30 ft • History roll vs d8 • Step die up one size for tougher CRs'
      }],
      duration: 0,
      durationUnit: 'instant',
      concentration: false,
      power: 'minor'
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 30,
      targetRestrictions: ['creature']
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      actionPoints: 1,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    skillRequirement: {
      skillId: 'history',
      minRank: 'NOVICE'
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'history',
        baseDifficulty: 'd8',
        scaling: 'creature_cr'
      }
    }
  },

  // Insight - Flow State
  {
    id: 'skill_insight_flow_state',
    name: 'Flow State',
    description: 'You enter a calm, clear state, reducing damage taken by 2 until your next turn. Insight roll vs a moderate die (d8).',
    spellType: 'ACTION',
    effectTypes: ['buff'],
    typeConfig: {
      school: 'mental',
      icon: 'spell_nature_mirrorimage',
      tags: ['skill', 'insight', 'buff', 'proficient']
    },
    buffConfig: {
      buffType: 'statEnhancement',
      effects: [{
        id: 'damage_reduction',
        name: 'Flow State',
        description: 'Reduces incoming damage by 2 (flat reduction) until your next turn • Insight roll vs d8',
        mechanicsText: '',
        statModifier: {
          stat: 'damage_reduction',
          magnitude: 2,
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
      targetingType: 'self',
      rangeType: 'self',
      rangeDistance: 0
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      actionPoints: 1,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    skillRequirement: {
      skillId: 'insight',
      minRank: 'NOVICE'
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'insight',
        baseDifficulty: 'd8'
      }
    }
  },

  // Intimidation - Taunt
  {
    id: 'skill_intimidation_taunt',
    name: 'Taunt',
    description: 'With hostile intent you provoke nearby opponents within 15 ft., forcing them to attack you. (the effect lasts until the opponent succeeds their spirit check, which is based on your Intimidation Roll) Intimidation Roll vs. Opponents Spirit Save.',
    spellType: 'REACTION',
    effectTypes: ['control'],
    typeConfig: {
      school: 'mental',
      icon: 'ability_warrior_challange',
      tags: ['skill', 'intimidation', 'control', 'proficient']
    },
    controlConfig: {
      controlType: 'mind_control',
      strength: 'moderate',
      duration: 0, // Until save succeeds
      durationUnit: 'instant',
      saveDC: 0, // Based on intimidation roll
      saveType: 'spirit',
      savingThrow: true,
      effects: [{
        id: 'command',
        name: 'Taunt',
        description: 'Forces target to attack you',
        mechanicsText: 'Range: 15 ft area • Intimidation Roll vs Opponent\'s Spirit Save • Effect lasts until opponent succeeds save',
        config: {
          controlLevel: 'suggestion'
        }
      }]
    },
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'ranged',
      rangeDistance: 15,
      aoeShape: 'circle',
      aoeParameters: { radius: 15 },
      targetRestrictions: ['enemy']
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      actionPoints: 1,
      components: ['verbal']
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    skillRequirement: {
      skillId: 'intimidation',
      minRank: 'NOVICE'
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'intimidation',
        opposedRoll: true,
        opponentSave: ['spirit']
      }
    }
  },

  // Investigation - Deduct
  {
    id: 'skill_investigation_deduct',
    name: 'Deduct',
    description: 'Analyze an opponent within 15 ft. Investigation roll vs a moderate die (d8), stepping the die up for higher-CR foes.',
    spellType: 'ACTION',
    effectTypes: ['utility'],
    typeConfig: {
      school: 'mental',
      icon: 'spell_holy_magicalsentry',
      tags: ['skill', 'investigation', 'utility', 'proficient']
    },
    utilityConfig: {
      utilityType: 'information',
      subtype: 'analyze',
      description: 'Analyze an opponent to discover weaknesses and tactics',
      selectedEffects: [{
        id: 'analyze',
        name: 'Deduct',
        description: 'Analyze an opponent to discover weaknesses and tactics',
        mechanicsText: 'Range: 15 ft • Investigation roll vs d8 • Step die up for higher-CR foes'
      }],
      duration: 0,
      durationUnit: 'instant',
      concentration: false,
      power: 'minor'
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 15,
      targetRestrictions: ['enemy', 'creature']
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      actionPoints: 1,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    skillRequirement: {
      skillId: 'investigation',
      minRank: 'NOVICE'
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'investigation',
        baseDifficulty: 'd8',
        scaling: 'creature_cr'
      }
    }
  },

  // Medicine - First Aid
  {
    id: 'skill_medicine_first_aid',
    name: 'First Aid',
    description: 'Treat a nearby ally (within 5 ft.) for minor injury using an easy die (d6). To pull an ally from death\'s door to 1 HP, roll the easy die but step it up once per exhaustion level. You can also apply bandages once per character; roll the easy die to grant 1d4 + Medicine mod healing.',
    spellType: 'ACTION',
    effectTypes: ['healing'],
    typeConfig: {
      school: 'healing',
      icon: 'spell_holy_sealofsacrifice',
      tags: ['skill', 'medicine', 'healing', 'proficient']
    },
    healingConfig: {
      formula: '1d4 + medicine_modifier',
      healingType: 'direct',
      hasHotEffect: false,
      hasShieldEffect: false,
      description: 'Treat a nearby ally for minor injury',
      mechanicsText: 'Range: Touch (5 ft) • Medicine roll vs d6 • Stabilize: Step die up once per exhaustion level • Bandage: 1d4 + Medicine mod healing (once per character)'
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
      actionPoints: 1,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    skillRequirement: {
      skillId: 'medicine',
      minRank: 'NOVICE'
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'medicine',
        baseDifficulty: 'd6',
        specialUses: ['stabilize', 'bandage']
      }
    }
  },

  // Nature - Terrain Insight
  {
    id: 'skill_nature_terrain_insight',
    name: 'Terrain Insight',
    description: 'Spot a terrain advantage within 10 ft. Roll Nature vs a moderate die (d8).',
    spellType: 'ACTION',
    effectTypes: ['utility'],
    typeConfig: {
      school: 'nature',
      icon: 'spell_nature_naturetouchgrow',
      tags: ['skill', 'nature', 'utility', 'proficient']
    },
    utilityConfig: {
      utilityType: 'information',
      subtype: 'terrain',
      description: 'Identify terrain advantages and environmental features',
      selectedEffects: [{
        id: 'terrain',
        name: 'Terrain Insight',
        description: 'Identify terrain advantages and environmental features',
        mechanicsText: 'Range: 10 ft area • Nature roll vs d8'
      }],
      duration: 0,
      durationUnit: 'instant',
      concentration: false,
      power: 'minor'
    },
    targetingConfig: {
      targetingType: 'ground',
      rangeType: 'ranged',
      rangeDistance: 10,
      aoeShape: 'circle',
      aoeParameters: { radius: 10 }
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      actionPoints: 1,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    skillRequirement: {
      skillId: 'nature',
      minRank: 'NOVICE'
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'nature',
        baseDifficulty: 'd8'
      }
    }
  },

  // Perception - Heightened Senses
  {
    id: 'skill_perception_heightened_senses',
    name: 'Heightened Senses',
    description: 'Your senses are on high alert. Add 2 to your initiative rolls.',
    spellType: 'PASSIVE',
    effectTypes: ['buff'],
    typeConfig: {
      school: 'mental',
      icon: 'spell_nature_sentinal',
      tags: ['skill', 'perception', 'buff', 'passive', 'proficient']
    },
    buffConfig: {
      buffType: 'statEnhancement',
      effects: [{
        id: 'initiative_boost',
        name: 'Heightened Senses',
        description: 'Add 2 to initiative rolls',
        mechanicsText: '',
        statModifier: {
          stat: 'initiative',
          magnitude: 2,
          magnitudeType: 'flat'
        }
      }],
      durationValue: 0,
      durationType: 'permanent',
      durationUnit: 'permanent',
      concentrationRequired: false,
      canBeDispelled: false
    },
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      rangeDistance: 0
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      actionPoints: 0,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    skillRequirement: {
      skillId: 'perception',
      minRank: 'NOVICE'
    }
  },

  // Performance - Mesmer
  {
    id: 'skill_performance_mesmer',
    name: 'Mesmer',
    description: 'Within 15 ft., your captivating tunes cause anyone affected to lose their next turn. Performance Roll vs. Wisdom Saving Throw. All creatures and characters within 15 ft. must make a Wisdom Saving Throw against your Performance roll. On a fail, they lose their next turn. (The following creatures are immune: Creatures without eyes or sight, creatures with multiple heads or eyes, undead, celestials, fiends, fey, dragons and constructs.) (This spell is limited to one use per combat.)',
    spellType: 'ACTION',
    effectTypes: ['control'],
    typeConfig: {
      school: 'mental',
      icon: 'ability_rogue_distract',
      tags: ['skill', 'performance', 'control', 'proficient']
    },
    controlConfig: {
      controlType: 'incapacitation',
      strength: 'strong',
      duration: 1,
      durationUnit: 'rounds',
      saveDC: 0, // Based on performance roll
      saveType: 'spirit',
      savingThrow: true,
      effects: [{
        id: 'stun',
        name: 'Mesmerized',
        description: 'Lose next turn',
        mechanicsText: 'Range: 15 ft area • Performance Roll vs Spirit Save • All creatures within 15 ft must save • Immune: blind, multiple heads, undead, celestials, fiends, fey, dragons, constructs • Limited to one use per combat',
        config: {
          durationType: 'temporary',
          recoveryMethod: 'automatic'
        }
      }]
    },
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'ranged',
      rangeDistance: 15,
      aoeShape: 'circle',
      aoeParameters: { radius: 15 },
      targetRestrictions: ['enemy', 'ally', 'creature']
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      actionPoints: 3,
      components: ['verbal']
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0,
      usesPerCombat: 1
    },
    resolution: 'DICE',
    skillRequirement: {
      skillId: 'performance',
      minRank: 'NOVICE'
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'performance',
        opposedRoll: true,
        opponentSave: ['spirit'],
        immunities: ['blind', 'multiple_heads', 'undead', 'celestial', 'fiend', 'fey', 'dragon', 'construct']
      }
    }
  },

  // Persuasion - Persuade
  {
    id: 'skill_persuasion_persuade',
    name: 'Persuade',
    description: 'Amidst the heat of combat you attempt to convince an opponent to reconsider their current action - on a successful persuasion check you confuse an opponent. Persuasion Roll vs Wisdom Saving Throw. The opponent must make a Wisdom Saving Throw against your Persuasion Roll. On a fail, they become confused. (the effect lasts until the creature or character successfully rolls above the persuasion roll; limited to one roll per turn.) Confused creatures or characters must make a d10 roll to determine their action: (1) Runs in a random direction; roll a d8 (2-4) Does nothing; no movement or actions (5-6) Cast a random spell at random target; determined by dice (7-8) Attack a nearby random creature; determined by dice (9-10) Acts and moves normally.',
    spellType: 'ACTION',
    effectTypes: ['debuff'],
    typeConfig: {
      school: 'mental',
      icon: 'ability_rogue_distract',
      tags: ['skill', 'persuasion', 'debuff', 'proficient']
    },
    debuffConfig: {
      debuffType: 'statusEffect',
      durationValue: 0, // Until save succeeds
      durationType: 'rounds',
      durationUnit: 'rounds',
      saveDC: 0, // Based on persuasion roll
      saveType: 'spirit',
      saveOutcome: 'negates',
      effects: [{
        id: 'confuse',
        name: 'Confused',
        description: 'Random actions determined by d10 roll • Persuasion Roll vs Spirit Save • Effect lasts until target rolls above persuasion roll (limited to one roll per turn)',
        mechanicsText: 'Confusion Table (d10): 1) Run random direction (d8), 2-4) Do nothing, 5-6) Cast random spell at random target, 7-8) Attack nearby random creature, 9-10) Act normally'
      }]
    },
    targetingConfig: {
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 30,
      targetRestrictions: ['enemy', 'creature']
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      actionPoints: 2,
      components: ['verbal']
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    skillRequirement: {
      skillId: 'persuasion',
      minRank: 'NOVICE'
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'persuasion',
        opposedRoll: true,
        opponentSave: ['spirit'],
        confusionTable: 'd10'
      }
    }
  },

  // Religion - Divine Favor
  {
    id: 'skill_religion_divine_favor',
    name: 'Divine Favor',
    description: 'Preaching teachings of your deity you inspire nearby allies and intellectual creatures within 15 ft. Religion Roll vs Wisdom or Intellect Saving Throw. Roll a d4 to Determine the Boon: Shield of Conviction - Temporary hitpoints until combat has ended, based on the casters religion modifier. Guardian\'s Favor - Take reduced damage for the next turn, based on the casters religion modifier. Zealot\'s Blessing - Temporary boost attack rolls for the next attack, based on the casters religion modifier. Wisdom of the Ancients - Advantage on the next saving throw. All creatures and characters within 15 ft. must make a Wisdom or Intellect Saving Throw (If they roll below your Religion Roll they are granted the boon). (Regardless how you roll you gain the boon - however, the creatures and characters around you need to roll below your Religion Roll to gain the same boon).',
    spellType: 'ACTION',
    effectTypes: ['buff'],
    typeConfig: {
      school: 'divine',
      icon: 'spell_holy_sealofvalor',
      tags: ['skill', 'religion', 'buff', 'proficient']
    },
    buffConfig: {
      buffType: 'statusEffect',
      effects: [{
        id: 'divine_boon',
        name: 'Divine Favor',
        description: 'Grants one of four boons based on d4 roll • Religion Roll vs Spirit or Intelligence Save • All within 15 ft must roll below your Religion Roll to gain boon',
        mechanicsText: 'Range: 15 ft area • Roll d4 for boon: 1) Shield of Conviction (temp HP = religion mod), 2) Guardian\'s Favor (damage reduction = religion mod), 3) Zealot\'s Blessing (attack bonus = religion mod), 4) Wisdom of the Ancients (advantage on next save)'
      }],
      durationValue: 1,
      durationType: 'rounds',
      durationUnit: 'rounds',
      concentrationRequired: false,
      canBeDispelled: false
    },
    targetingConfig: {
      targetingType: 'area',
      rangeType: 'ranged',
      rangeDistance: 15,
      aoeShape: 'circle',
      aoeParameters: { radius: 15 },
      targetRestrictions: ['ally']
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      actionPoints: 2,
      components: ['verbal']
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    skillRequirement: {
      skillId: 'religion',
      minRank: 'NOVICE'
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'religion',
        opposedRoll: true,
        opponentSave: ['spirit', 'intelligence'],
        boonTable: 'd4'
      }
    },
    rollableTable: {
      enabled: true,
      name: 'Divine Favor Boons',
      description: 'Roll d4 to determine the boon granted',
      resolutionType: 'DICE',
      resolutionConfig: {
        diceType: 'd4',
        diceCount: 1
      },
      entries: [
        {
          id: 'shield_of_conviction',
          roll: 1,
          name: 'Shield of Conviction',
          effect: 'Temporary hitpoints until combat ends, equal to religion modifier'
        },
        {
          id: 'guardians_favor',
          roll: 2,
          name: 'Guardian\'s Favor',
          effect: 'Take reduced damage for next turn, equal to religion modifier'
        },
        {
          id: 'zealots_blessing',
          roll: 3,
          name: 'Zealot\'s Blessing',
          effect: 'Temporary boost to attack rolls for next attack, equal to religion modifier'
        },
        {
          id: 'spirit_of_ancients',
          roll: 4,
          name: 'Wisdom of the Ancients',
          effect: 'Advantage on next saving throw'
        }
      ]
    }
  },

  // Sleight of Hand - Disarm
  {
    id: 'skill_sleight_of_hand_disarm',
    name: 'Disarm',
    description: 'When attacked by an opponent (within 5 ft.), you nimbly disarm the opponent, and if able, you equip the weapon used. (Can\'t be used wielding 2 weapons, as it requires a free hand.) Sleight of Hand Roll vs. Opponents Strength Save',
    spellType: 'REACTION',
    effectTypes: ['control'],
    typeConfig: {
      school: 'physical',
      icon: 'ability_rogue_disguise',
      tags: ['skill', 'sleightOfHand', 'control', 'proficient']
    },
    controlConfig: {
      controlType: 'restriction',
      strength: 'moderate',
      duration: 0,
      durationUnit: 'instant',
      saveDC: 0, // Opposed roll
      saveType: 'strength',
      savingThrow: true,
      effects: [{
        id: 'disarm',
        name: 'Disarm',
        description: 'Disarm opponent and equip their weapon if able',
        mechanicsText: 'Range: Touch (5 ft) • Reaction (when attacked) • Sleight of Hand Roll vs Opponent\'s Strength Save • Requires free hand (cannot use wielding 2 weapons)'
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
      actionPoints: 1,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    skillRequirement: {
      skillId: 'sleightOfHand',
      minRank: 'NOVICE'
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'sleightOfHand',
        opposedRoll: true,
        opponentSave: ['strength'],
        requiresFreeHand: true
      }
    },
    triggerConfig: {
      global: {
        enabled: true,
        logicType: 'AND',
        compoundTriggers: [{
          id: 'damage_taken',
          category: 'combat',
          name: 'When Attacked',
          parameters: {
            perspective: 'self',
            distance: 5
          }
        }]
      }
    }
  },

  // Stealth - Stealthy Passage
  {
    id: 'skill_stealth_stealthy_passage',
    name: 'Stealthy Passage',
    description: 'Slip through an opponent\'s space without provoking. Roll Stealth vs an easy die (d6); on a success you move 15 ft.',
    spellType: 'ACTION',
    effectTypes: ['utility'],
    typeConfig: {
      school: 'physical',
      icon: 'ability_stealth',
      tags: ['skill', 'stealth', 'movement', 'proficient']
    },
    utilityConfig: {
      utilityType: 'movement',
      subtype: 'sneak',
      description: 'Move through enemy space without provoking opportunity attacks',
      selectedEffects: [{
        id: 'sneak',
        name: 'Sneak',
        description: 'Move through enemy space without provoking opportunity attacks',
        mechanicsText: 'Move 15 ft • Stealth roll vs d6 • On success: move through opponent\'s space without provoking',
        distance: 15,
        avoidOpportunityAttacks: true
      }],
      duration: 0,
      durationUnit: 'instant',
      concentration: false,
      power: 'minor'
    },
    targetingConfig: {
      targetingType: 'self',
      rangeType: 'self',
      rangeDistance: 0
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      actionPoints: 1,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    skillRequirement: {
      skillId: 'stealth',
      minRank: 'NOVICE'
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'stealth',
        baseDifficulty: 'd6'
      }
    }
  },

  // Survival - Trapping
  {
    id: 'skill_survival_trapping',
    name: 'Trapping',
    description: 'Set a trap on a 5 ft. square within 5 ft. Survival roll starts at a challenging die (d10); step the die down if your INT is high. Traps: Pitfall [4 AP]: 1d6 per 10 ft. depth and restrains until climbed out. Snare [3 AP]: Hoists and leaves target hanging; attacks have advantage. Tripwire [2 AP]: Target falls prone, may drop held items.',
    spellType: 'ACTION',
    effectTypes: ['utility'],
    typeConfig: {
      school: 'nature',
      icon: 'ability_rogue_trip',
      tags: ['skill', 'survival', 'utility', 'proficient']
    },
    utilityConfig: {
      utilityType: 'creation',
      subtype: 'trap',
      description: 'Set a trap on a 5 ft. square',
      selectedEffects: [{
        id: 'trap',
        name: 'Trapping',
        description: 'Set a trap on a 5 ft. square',
        mechanicsText: 'Range: 5 ft • Survival roll starts at d10 (step die down if INT is high) • Trap Types: Pitfall [4 AP] (1d6 per 10 ft depth, restrains), Snare [3 AP] (hoists target, attacks have advantage), Tripwire [2 AP] (target falls prone, may drop items)'
      }],
      duration: 0,
      durationUnit: 'instant',
      concentration: false,
      power: 'moderate'
    },
    targetingConfig: {
      targetingType: 'ground',
      rangeType: 'ranged',
      rangeDistance: 5,
      aoeShape: 'square',
      aoeParameters: { size: 5 }
    },
    resourceCost: {
      resourceTypes: [],
      resourceValues: {},
      actionPoints: 1,
      components: []
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 0
    },
    resolution: 'DICE',
    skillRequirement: {
      skillId: 'survival',
      minRank: 'NOVICE'
    },
    mechanicsConfig: {
      skillCheck: {
        enabled: true,
        skill: 'survival',
        baseDifficulty: 'd10',
        scaling: 'intelligence_inverse',
        trapTypes: ['pitfall', 'snare', 'tripwire']
      }
    }
  }
];

/**
 * Get all skill abilities for a given skill ID
 */
export const getSkillAbilities = (skillId) => {
  return SKILL_ABILITIES.filter(ability => 
    ability.skillRequirement?.skillId === skillId
  );
};

/**
 * Get all skill abilities that a character can use based on their skill proficiencies
 * A character is proficient if they have NOVICE rank or higher
 */
export const getAvailableSkillAbilities = (skillRanks) => {
  if (!skillRanks) return [];
  
  const SKILL_RANK_ORDER = ['UNTRAINED', 'NOVICE', 'TRAINED', 'APPRENTICE', 'ADEPT', 'EXPERT', 'MASTER'];
  
  return SKILL_ABILITIES.filter(ability => {
    const requirement = ability.skillRequirement;
    if (!requirement) return false;
    
    const characterRank = skillRanks[requirement.skillId] || 'UNTRAINED';
    const minRankIndex = SKILL_RANK_ORDER.indexOf(requirement.minRank || 'NOVICE');
    const characterRankIndex = SKILL_RANK_ORDER.indexOf(characterRank);
    
    return characterRankIndex >= minRankIndex;
  });
};

/**
 * Check if a character is proficient in a skill
 * Proficiency = NOVICE rank or higher
 */
export const isSkillProficient = (skillId, skillRanks) => {
  if (!skillRanks || !skillRanks[skillId]) return false;
  
  const SKILL_RANK_ORDER = ['UNTRAINED', 'NOVICE', 'TRAINED', 'APPRENTICE', 'ADEPT', 'EXPERT', 'MASTER'];
  const characterRank = skillRanks[skillId];
  const characterRankIndex = SKILL_RANK_ORDER.indexOf(characterRank);
  const noviceIndex = SKILL_RANK_ORDER.indexOf('NOVICE');
  
  return characterRankIndex >= noviceIndex;
};

/**
 * Get all proficient skills for a character
 */
export const getProficientSkills = (skillRanks) => {
  if (!skillRanks) return [];
  
  return Object.keys(skillRanks).filter(skillId => 
    isSkillProficient(skillId, skillRanks)
  );
};

