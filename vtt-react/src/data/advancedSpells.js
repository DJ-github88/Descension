/**
 * Advanced Spells for the Spell Library
 *
 * This file contains advanced spells with card mechanics, coin mechanics, and other special resolution types.
 * All spells use proper formatting and follow the spell wizard validation rules.
 */

// Advanced spells with special mechanics
export const ADVANCED_SPELLS = [
  // 1. Fortune's Gambit - Coin-based damage spell
  {
    id: 'fortunes-gambit',
    name: 'Fortune\'s Gambit',
    description: 'You flip mystical coins to determine the fate of your enemies. The more heads you flip, the more devastating the attack becomes.',
    icon: 'inv_misc_coin_04',

    spellType: 'ACTION',
    tags: ['damage', 'force', 'coin-based', 'gambling', 'variable'],
    effectTypes: ['damage'],
    damageTypes: ['force'],
    coinConfig: {
      flipCount: 5,
      formula: 'HEADS_COUNT * 8 + (ALL_HEADS ? 20 : 0)',
      mechanicsDescription: 'Flip 5 mystical coins. More heads result in greater damage and effects.',
      effects: {
        'all_heads': 'Critical hit and target is stunned for 1 round + bonus damage',
        'all_tails': 'Spell backfires, caster takes 1d6 damage',
        '4_heads': 'Target is knocked prone + normal damage',
        '3_heads': 'Normal damage + minor knockback',
        '2_heads': 'Half damage',
        '1_head': 'Quarter damage',
        '0_heads': 'Spell fails completely'
      },
      coinValues: {
        'heads': 1,
        'tails': 0
      },
      specialCombinations: {
        'all_heads': {
          probability: 3.125, // 1/32
          effect: 'devastating_strike',
          bonusDamage: '3d6',
          statusEffect: 'stunned'
        },
        'all_tails': {
          probability: 3.125,
          effect: 'backfire',
          selfDamage: '1d6',
          statusEffect: 'dazed'
        }
      }
    },
    mechanicsConfig: {
      cards: null,
      combos: null,
      coins: {
        enabled: true,
        system: 'fortune',
        type: 'spender',
        thresholdValue: 3,
        resolutionMethod: 'coins',
        coinCount: 5,
        coinSuccessRule: 'all_heads',
        effectScaling: {
          enabled: true,
          scalingType: 'heads_count',
          baseEffect: 'minor_damage',
          enhancedEffect: 'major_damage'
        }
      },
      stateRequirements: [],
      stateOptions: {
        thresholds: [
          { value: 1, effect: 'weak_fortune' },
          { value: 3, effect: 'moderate_fortune' },
          { value: 5, effect: 'incredible_fortune' }
        ]
      }
    },
    targetingConfig: {
      targetingType: 'single',
      range: 60,
      validTargets: ['enemy']
    },
    resourceCost: {
      mana: 20,
      health: 0,
      stamina: 0,
      focus: 0
    },
    durationConfig: {
      type: 'instant',
      value: 0,
      unit: 'seconds',
      concentration: false,
      dispellable: false
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 4,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'gambling'
    },
    resolution: 'COINS',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'arcane',
    castingDescription: 'You produce mystical coins and flip them with magical intent.',
    effectDescription: 'The coins spin through the air, glowing with arcane energy.',
    impactDescription: 'The coins\' results determine the spell\'s devastating effect.'
  },

  // 2. Arcane Gambit - Card-based spell with multiple effects
  {
    id: 'arcane-gambit',
    name: 'Arcane Gambit',
    description: 'You draw mystical cards that determine both the type and magnitude of magical effects unleashed upon your enemies.',
    icon: 'inv_misc_book_11',

    spellType: 'ACTION',
    tags: ['damage', 'arcane', 'card-based', 'variable', 'multi-effect'],
    effectTypes: ['damage', 'utility'],
    damageTypes: ['force'],
    cardConfig: {
      drawCount: 4,
      formula: 'CARD_VALUE + (FACE_CARD_COUNT * 5) + (SAME_SUIT_COUNT * 3)',
      effects: {
        'royal_flush': 'Maximum damage and all enemies in 30ft take half damage',
        'four_of_kind': 'Double damage and target is paralyzed for 1 round',
        'full_house': 'Normal damage plus heal ally for same amount',
        'flush': 'Damage plus create magical barrier (15 temp HP)',
        'straight': 'Damage plus teleport to any location within 60ft',
        'three_of_kind': 'Normal damage plus advantage on next spell',
        'two_pair': 'Normal damage',
        'pair': 'Half damage',
        'high_card': 'Quarter damage'
      }
    },
    targetingConfig: {
      targetingType: 'single',
      range: 120,
      validTargets: ['enemy']
    },
    resourceCost: {
      mana: 25,
      health: 0,
      stamina: 0,
      focus: 0
    },
    durationConfig: {
      type: 'instant',
      value: 0,
      unit: 'seconds',
      concentration: false,
      dispellable: false
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 5,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'gambling'
    },
    resolution: 'CARDS',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'arcane',
    castingDescription: 'You shuffle a deck of mystical cards and draw them with focused intent.',
    effectDescription: 'The cards glow with arcane power as they reveal their magical effects.',
    impactDescription: 'The cards\' combination determines the spell\'s powerful outcome.'
  },

  // 3. Healing Rain - Area healing spell
  {
    id: 'healing-rain',
    name: 'Healing Rain',
    description: 'You call down a gentle rain infused with healing magic. All allies in the area are healed over time.',
    icon: 'spell_nature_healingtouch',

    spellType: 'ACTION',
    tags: ['healing', 'area', 'nature', 'rain'],
    effectTypes: ['healing'],
    healingConfig: {
      healingType: 'hot',
      formula: '2d4',
      hasHotEffect: true,
      hotConfig: {
        enabled: true,
        duration: 30,
        durationType: 'seconds',
        tickFormula: '1d4 + 2',
        tickFrequency: 'round'
      }
    },
    targetingConfig: {
      targetingType: 'area',
      areaType: 'sphere',
      radius: 20,
      range: 60,
      validTargets: ['ally', 'self']
    },
    resourceCost: {
      mana: 35,
      health: 0,
      stamina: 0,
      focus: 0
    },
    durationConfig: {
      type: 'timed',
      value: 30,
      unit: 'seconds',
      concentration: true,
      dispellable: true
    },
    cooldownConfig: {
      type: 'short_rest',
      value: 1,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'healing'
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'nature',
    castingDescription: 'You raise your hands to the sky and call upon nature\'s healing power.',
    effectDescription: 'Gentle, glowing rain begins to fall in the target area.',
    impactDescription: 'Allies feel refreshed as the magical rain heals their wounds.'
  },

  // 4. Chaos Bolt - Random damage type spell
  {
    id: 'chaos-bolt',
    name: 'Chaos Bolt',
    description: 'You hurl an undulating, warbling mass of chaotic energy at one creature in range. The bolt\'s damage type changes unpredictably.',
    icon: 'spell_arcane_blast',

    spellType: 'ACTION',
    tags: ['damage', 'chaos', 'random', 'unpredictable'],
    effectTypes: ['damage'],
    damageTypes: ['fire', 'cold', 'lightning', 'acid', 'poison', 'necrotic', 'radiant'],
    damageConfig: {
      damageType: 'direct',
      elementType: 'chaos', // Will be randomly determined
      formula: '2d8 + 1d6',
      hasDotEffect: false,
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        critEffects: ['chain_to_random_target']
      },
      chaosConfig: {
        enabled: true,
        randomDamageType: true,
        chainOnDouble: true
      }
    },
    targetingConfig: {
      targetingType: 'single',
      range: 120,
      validTargets: ['enemy']
    },
    resourceCost: {
      mana: 15,
      health: 0,
      stamina: 0,
      focus: 0
    },
    durationConfig: {
      type: 'instant',
      value: 0,
      unit: 'seconds',
      concentration: false,
      dispellable: false
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 2,
      charges: 2,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'chaos'
    },
    rollableTable: {
      enabled: true,
      tableName: 'Chaos Damage Types',
      diceType: 'd8',
      entries: [
        { roll: 1, result: 'fire', description: 'Searing flames engulf the target' },
        { roll: 2, result: 'cold', description: 'Freezing energy crystallizes around the target' },
        { roll: 3, result: 'lightning', description: 'Crackling electricity arcs through the target' },
        { roll: 4, result: 'acid', description: 'Corrosive energy dissolves the target\'s defenses' },
        { roll: 5, result: 'poison', description: 'Toxic energy courses through the target' },
        { roll: 6, result: 'necrotic', description: 'Death energy withers the target\'s life force' },
        { roll: 7, result: 'radiant', description: 'Divine light burns away the target\'s darkness' },
        { roll: 8, result: 'force', description: 'Pure magical energy slams into the target' }
      ],
      useForDamageType: true,
      useForEffects: true,
      rollOnCast: true,
      rollOnCrit: true
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'chaos',
    castingDescription: 'You gather chaotic energy that shifts and warps in your hands.',
    effectDescription: 'A bolt of ever-changing energy streaks toward the target.',
    impactDescription: 'The target is struck by unpredictable chaotic energy.'
  },

  // 5. Phantom Steed - Summoning spell
  {
    id: 'phantom-steed',
    name: 'Phantom Steed',
    description: 'A Large quasi-real, horselike creature appears on the ground in an unoccupied space of your choice within range.',
    icon: 'ability_mount_spectralhorse',

    spellType: 'ACTION',
    tags: ['summoning', 'mount', 'phantom', 'transportation'],
    effectTypes: ['summoning'],
    summoningConfig: {
      summonType: 'mount',
      creatures: [
        {
          name: 'Phantom Steed',
          type: 'mount',
          size: 'Large',
          speed: 100,
          hitPoints: 1,
          armorClass: 11,
          abilities: ['ethereal_movement', 'no_combat', 'phase_through_objects'],
          stats: {
            strength: 18,
            agility: 15,
            constitution: 16,
            intelligence: 2,
            spirit: 12,
            charisma: 7
          },
          resistances: ['physical'],
          immunities: ['charm', 'fear', 'poison'],
          specialAbilities: [
            'ethereal_jaunt',
            'incorporeal_movement',
            'phantom_gallop'
          ]
        }
      ],
      duration: 3600, // 1 hour
      durationUnit: 'seconds',
      hasDuration: true,
      concentration: false,
      quantity: 1,
      maxQuantity: 1,
      controlRange: 60,
      controlType: 'mental',
      difficultyLevel: 'moderate',
      waitForTrigger: false,
      summonBehavior: {
        loyalty: 'absolute',
        intelligence: 'animal',
        combatRole: 'mount',
        dismissible: true,
        canAct: false
      }
    },
    targetingConfig: {
      targetingType: 'ground',
      range: 30,
      validTargets: ['ground']
    },
    resourceCost: {
      mana: 30,
      health: 0,
      stamina: 0,
      focus: 0
    },
    durationConfig: {
      type: 'timed',
      value: 3600,
      unit: 'seconds',
      concentration: false,
      dispellable: true
    },
    cooldownConfig: {
      type: 'long_rest',
      value: 1,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'summoning'
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'necromancy',
    castingDescription: 'You call forth a spectral mount from the ethereal plane.',
    effectDescription: 'A ghostly horse materializes, ready to serve as your mount.',
    impactDescription: 'The phantom steed awaits your command.'
  },

  // 6. Dispel Magic - Purification spell
  {
    id: 'dispel-magic',
    name: 'Dispel Magic',
    description: 'Choose one creature, object, or magical effect within range. Any spell of 3rd level or lower on the target ends.',
    icon: 'spell_holy_dispelmagic',

    spellType: 'ACTION',
    tags: ['purification', 'dispel', 'utility', 'anti-magic'],
    effectTypes: ['purification'],
    purificationConfig: {
      purificationType: 'dispel',
      duration: 0, // Instant effect
      durationUnit: 'seconds',
      concentration: false,
      difficultyClass: 15,
      abilitySave: 'intelligence',
      difficulty: 'moderate',
      selectedEffects: ['dispel_magic', 'remove_enchantment', 'break_illusion'],
      effects: [
        {
          name: 'Dispel Magic',
          description: 'Removes magical effects from target',
          targetTypes: ['buffs', 'debuffs', 'enchantments', 'illusions', 'transmutations'],
          successRate: 75,
          levelLimit: 3,
          rollRequired: true,
          baseRoll: '1d20 + caster_level',
          targetDC: 11, // 11 + spell level
          canTargetItems: true,
          canTargetAreas: true,
          areaRadius: 0, // Single target by default
          massDispel: false
        },
        {
          name: 'Remove Enchantment',
          description: 'Specifically targets enchantment effects',
          targetTypes: ['enchantments', 'charms', 'compulsions'],
          successRate: 85,
          levelLimit: 5,
          rollRequired: true,
          baseRoll: '1d20 + caster_level + 2',
          targetDC: 11
        },
        {
          name: 'Break Illusion',
          description: 'Reveals and dispels illusion effects',
          targetTypes: ['illusions', 'glamers', 'phantasms'],
          successRate: 90,
          levelLimit: 4,
          rollRequired: false, // Automatically succeeds
          revealHidden: true,
          areaRadius: 10
        }
      ],
      advancedOptions: {
        counterspell: true,
        antimagicField: false,
        permanentEffects: false,
        artifactResistance: true,
        schoolSpecialization: 'universal'
      }
    },
    targetingConfig: {
      targetingType: 'single',
      range: 120,
      validTargets: ['any']
    },
    resourceCost: {
      mana: 20,
      health: 0,
      stamina: 0,
      focus: 0
    },
    durationConfig: {
      type: 'instant',
      value: 0,
      unit: 'seconds',
      concentration: false,
      dispellable: false
    },
    cooldownConfig: {
      type: 'turn_based',
      value: 3,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'utility'
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'holy',
    castingDescription: 'You weave counter-magic to unravel existing enchantments.',
    effectDescription: 'Magical energies around the target begin to dissipate.',
    impactDescription: 'Magical effects are stripped away from the target.'
  },

  // 7. Hold Person - Control spell
  {
    id: 'hold-person',
    name: 'Hold Person',
    description: 'Choose a humanoid that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration.',
    icon: 'spell_nature_slow',

    spellType: 'ACTION',
    tags: ['control', 'paralysis', 'humanoid', 'incapacitation'],
    effectTypes: ['control'],
    controlConfig: {
      controlType: 'paralysis',
      duration: 60,
      savingThrow: {
        attribute: 'spirit',
        difficulty: 15,
        repeatAtEndOfTurn: true
      },
      savingThrowType: 'spirit',
      difficultyClass: 15,
      effects: [
        {
          name: 'Paralysis',
          description: 'Target is paralyzed and cannot move or act',
          conditions: ['paralyzed']
        }
      ]
    },
    targetingConfig: {
      targetingType: 'single',
      range: 60,
      validTargets: ['humanoid']
    },
    resourceCost: {
      mana: 25,
      health: 0,
      stamina: 0,
      focus: 0
    },
    durationConfig: {
      type: 'concentration',
      value: 60,
      unit: 'seconds',
      concentration: true,
      dispellable: true
    },
    cooldownConfig: {
      type: 'short_rest',
      value: 1,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'control'
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'enchantment',
    castingDescription: 'You gesture at the target and speak words of binding.',
    effectDescription: 'The target\'s body becomes rigid and unmoving.',
    impactDescription: 'The target is held fast by magical paralysis.'
  },

  // 8. Slow - Debuff spell
  {
    id: 'slow',
    name: 'Slow',
    description: 'You alter time around up to six creatures of your choice in a 40-foot cube within range. Each target must make a Wisdom saving throw or be affected by this spell for the duration.',
    icon: 'spell_nature_slow',

    spellType: 'ACTION',
    tags: ['debuff', 'time', 'area', 'movement'],
    effectTypes: ['debuff'],
    debuffConfig: {
      duration: 60,
      savingThrow: {
        attribute: 'spirit',
        difficulty: 15,
        repeatAtEndOfTurn: true
      },
      savingThrowType: 'spirit',
      difficultyClass: 15,
      statPenalties: [
        { stat: 'armor', value: -2, isPercentage: false },
        { stat: 'agility', value: -2, isPercentage: false }
      ],
      displayEffects: [
        {
          name: 'Temporal Slowness',
          description: 'Speed halved, -2 to Armor and Agility saves, can\'t use reactions',
          icon: 'spell_nature_slow'
        }
      ],
      debuffs: [
        {
          name: 'Temporal Slowness',
          description: 'Speed halved, -2 to Armor and Agility saves, can\'t use reactions',
          effects: {
            speedReduction: 0.5,
            armorPenalty: -2,
            agilitySavePenalty: -2,
            actionLimitation: 'one_action_or_bonus_action',
            noReactions: true
          }
        }
      ]
    },
    targetingConfig: {
      targetingType: 'area',
      areaType: 'cube',
      size: 40,
      range: 120,
      validTargets: ['enemy'],
      maxTargets: 6
    },
    resourceCost: {
      mana: 30,
      health: 0,
      stamina: 0,
      focus: 0
    },
    durationConfig: {
      type: 'concentration',
      value: 60,
      unit: 'seconds',
      concentration: true,
      dispellable: true
    },
    cooldownConfig: {
      type: 'short_rest',
      value: 1,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'debuff'
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'transmutation',
    castingDescription: 'You manipulate the flow of time around your enemies.',
    effectDescription: 'The air shimmers as time itself becomes sluggish.',
    impactDescription: 'Affected creatures move as if trapped in thick syrup.'
  }
];
