/**
 * Custom Spell Library Data
 *
 * This file contains custom spells for the spell library that match the review step format.
 */

// Custom spells for the library
export const CUSTOM_LIBRARY_SPELLS = [
  // 1. Inferno Blast - A powerful fire damage spell with area effect
  {
    id: 'inferno-blast',
    name: 'Inferno Blast',
    description: 'A sphere of roaring flame erupts at a point you designate, engulfing all creatures in the area with searing fire damage.',
    icon: 'spell_fire_fireball02',
    level: 5,
    school: 'fire',
    spellType: 'ACTION',
    tags: ['damage', 'fire', 'aoe', 'dice-based'],
    effectType: 'damage',
    effectTypes: ['damage'],
    damageTypes: ['fire'],
    primaryDamage: {
      dice: '8d6',
      flat: 0
    },
    damageConfig: {
      damageType: 'direct',
      elementType: 'fire',
      formula: '8d6',
      hasDotEffect: false
    },
    // Consolidated critical hit configuration
    criticalConfig: {
      enabled: true,
      critType: 'dice',
      critMultiplier: 2,
      explodingDice: true,
      spellEffect: null,
      useRollableTable: false,
      effectType: 'damage',
      effectDetails: 'Burning',
      effectDuration: 2,
      effectDurationUnit: 'rounds',
      damageAmount: '2d6',
      damageType: 'Fire',
      critEffects: ['burning'],
      displayText: 'On Critical: 2x damage and target burns for 2d6 fire damage over 2 rounds'
    },
    // Chance-on-hit effects configuration
    procConfig: {
      enabled: true,
      procType: 'dice',
      procChance: 15,
      diceThreshold: 18,
      spellEffect: null,
      useRollableTable: false,
      effectType: 'damage',
      effectDetails: 'Burning',
      effectDuration: 2,
      effectDurationUnit: 'rounds',
      damageAmount: '2d6',
      damageType: 'Fire',
      customEffects: ['burning'],
      displayText: 'Chance on Hit (15%): Target burns for 2d6 fire damage over 2 rounds'
    },
    targetingMode: 'aoe',
    targetingConfig: {
      targetingType: 'aoe',
      aoeType: 'sphere',
      aoeSize: 20,
      range: 120,
      validTargets: ['enemy']
    },
    rangeType: 'ranged',
    range: 120,
    aoeShape: 'sphere',
    aoeSize: 20,
    resourceCost: {
      mana: 35,
      health: 0,
      stamina: 0,
      focus: 0
    },
    cooldownConfig: {
      enabled: true,
      cooldownRounds: 3,
      cooldownType: 'rounds'
    },
    cooldown: '3 rounds',
    visualTheme: 'fire',
    resolution: 'DICE',
    diceConfig: {
      formula: '8d6'
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: ['damage-spells', 'fire-spells'],
    negativeEffects: ['burning'],
    castingDescription: 'You trace a fiery sigil in the air, designating the point of the explosion.',
    effectDescription: 'The air shimmers with heat as flames gather at the target point.',
    impactDescription: 'A violent explosion of fire erupts, consuming everything in its radius.'
  },

  // 2. Healing Cascade - A healing spell with over-time effect
  {
    id: 'healing-cascade',
    name: "Healing Cascade",
    description: 'A powerful wave of healing energy washes over an ally, providing immediate healing and continued regeneration over time. The spell also grants temporary resistance to harmful effects.',
    icon: 'spell_holy_flashheal',
    level: 4,
    school: 'holy',
    spellType: 'ACTION',
    tags: ['healing', 'holy', 'hot', 'buff', 'dice-based'],
    effectType: 'healing',
    effectTypes: ['healing', 'buff'],
    damageTypes: ['holy'],
    healing: {
      dice: '6d8',
      flat: 10
    },
    healingConfig: {
      healingType: 'direct',
      formula: '6d8 + WIS + 10',
      hasHotEffect: true,
      hotConfig: {
        enabled: true,
        duration: 3,
        durationType: 'rounds',
        tickFormula: '2d8 + (WIS/2) + 5',
        tickFrequency: 'start'
      }
    },
    // Consolidated critical hit configuration
    criticalConfig: {
      enabled: true,
      critType: 'dice',
      critMultiplier: 2,
      critDiceOnly: false,
      extraDice: '2d8',
      critEffects: ['remove_debuff', 'shield', 'bless'],
      spellEffect: 'remove_debuff',
      useRollableTable: true,
      effectType: 'healing',
      effectDetails: 'Divine Cleansing',
      effectDuration: 2,
      effectDurationUnit: 'rounds',
      healAmount: '2d8 + WIS',
      displayText: 'On Critical: 2x healing and roll on Divine Blessing table (d8)'
    },
    // Consolidated rollable table
    rollableTable: {
      name: 'Divine Blessing',
      description: 'Roll to determine additional divine effects',
      tableType: 'dice',
      diceType: 'd8',
      entries: [
        { result: '1', name: 'Divine Shield', effectType: 'Protection', effect: 'Target gains 10 temporary hit points' },
        { result: '2', name: 'Purification', effectType: 'Cleanse', effect: 'Target is cleansed of one poison or disease effect' },
        { result: '3', name: 'Holy Armor', effectType: 'Defense', effect: 'Target gains +2 to AC for 1 round' },
        { result: '4', name: 'Divine Favor', effectType: 'Blessing', effect: 'Target gains advantage on their next saving throw' },
        { result: '5', name: 'Lingering Heal', effectType: 'Healing', effect: 'Target gains 1d8 healing at the start of their next turn' },
        { result: '6', name: 'Radiant Burst', effectType: 'AoE Healing', effect: 'All allies within 10 feet gain 1d8 healing' },
        { result: '7', name: 'Divine Protection', effectType: 'Damage Reduction', effect: 'Target gains 50% damage reduction for 1 round' },
        { result: '8', name: 'Sacred Blessing', effectType: 'Enhancement', effect: 'Target is blessed with divine favor, gaining +1d4 to attack rolls and saving throws for 3 rounds' }
      ]
    },
    // Chance-on-hit effects configuration
    procConfig: {
      enabled: true,
      procType: 'dice',
      procChance: 15,
      diceThreshold: 18,
      spellEffect: null,
      useRollableTable: false,
      effectType: 'healing',
      effectDetails: 'Rejuvenation',
      effectDuration: 2,
      effectDurationUnit: 'rounds',
      healAmount: '2d8+5',
      customEffects: ['rejuvenation'],
      displayText: 'Chance on Hit (15%): Target gains Rejuvenation, healing for 2d8+5 over 2 rounds'
    },
    buffConfig: {
      buffType: 'resistance',
      duration: 3,
      durationType: 'rounds',
      statBonuses: [
        { stat: 'poison_resistance', value: 10, isPercentage: true },
        { stat: 'disease_resistance', value: 10, isPercentage: true }
      ],
      displayEffects: [
        { name: 'Poison Resistance', description: '+10% resistance to poison', icon: 'spell_nature_nullifypoison' },
        { name: 'Disease Resistance', description: '+10% resistance to disease', icon: 'spell_holy_nullifydisease' }
      ]
    },
    targetingMode: 'single',
    targetingConfig: {
      targetingType: 'single',
      range: 30,
      validTargets: ['ally']
    },
    rangeType: 'ranged',
    range: 30,
    resourceCost: {
      mana: 25,
      health: 0,
      stamina: 0,
      focus: 0
    },
    cooldownConfig: {
      enabled: true,
      cooldownRounds: 2,
      cooldownType: 'rounds'
    },
    cooldown: '2 rounds',
    visualTheme: 'holy',
    resolution: 'DICE',
    diceConfig: {
      formula: '6d8 + WIS + 10'
    },
    isHot: true,
    hasHotEffect: true,
    hotDuration: 3,
    hotTick: '2d8 + (WIS/2) + 5',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: ['healing-spells', 'holy-spells'],
    castingDescription: 'You channel divine energy through your hands, creating a warm golden glow.',
    effectDescription: 'Waves of healing light flow from your hands to the target.',
    impactDescription: 'The target is bathed in golden light as their wounds close and vitality returns.'
  },

  // 3. Shadow Chains - A channeled control spell with increasing damage over time
  {
    id: 'shadow-chains',
    name: 'Shadow Chains',
    description: 'Summon ethereal chains of shadow that bind your enemy, restricting movement and dealing shadow damage over time. Channel the spell to strengthen the chains and increase their control effects.',
    icon: 'spell_shadow_shadowfury',
    level: 6,
    school: 'shadow',
    spellType: 'CHANNELED',
    tags: ['control', 'damage', 'shadow', 'dot', 'debuff', 'channeled', 'dice-based'],
    effectType: 'control',
    effectTypes: ['control', 'damage', 'debuff'],
    damageTypes: ['shadow'],
    primaryDamage: {
      dice: '3d6',
      flat: 0
    },
    damageConfig: {
      damageType: 'direct',
      elementType: 'shadow',
      formula: '3d6 + INT',
      hasDotEffect: true,
      dotConfig: {
        enabled: true,
        duration: 4,
        durationType: 'rounds',
        tickFormula: '2d6 + (INT/2)',
        tickFrequency: 'end_of_turn'
      },
      dotScalingType: 'increasing',
      dotTriggerType: 'channeled',
      isProgressiveDot: true,
      dotProgressiveStages: [
        { triggerAt: 1, formula: '2d6 + (INT/2)', description: 'Turn 1: 2d6 + (INT/2) shadow damage over time' },
        { triggerAt: 2, formula: '3d6 + INT + (ROUND * 2)', description: 'Turn 2: 3d6 + INT + 4 shadow damage over time' },
        { triggerAt: 3, formula: '4d6 + INT + (ROUND * 3)', description: 'Turn 3: 4d6 + INT + 9 shadow damage over time' }
      ]
    },
    // Consolidated critical hit configuration
    criticalConfig: {
      enabled: true,
      critType: 'dice',
      critMultiplier: 2,
      critDiceOnly: false,
      extraDice: '2d6',
      explodingDice: true,
      explodingDiceType: 'reroll_add',
      critEffects: ['stun', 'fear'],
      spellEffect: 'stun',
      useRollableTable: true,
      effectType: 'control',
      effectDetails: 'Stun',
      effectDuration: 1,
      effectDurationUnit: 'rounds',
      controlType: 'Stun',
      displayText: 'On Critical: 2x damage and roll on Shadow Effects table (d6)'
    },
    // Consolidated rollable table for critical hits
    rollableTable: {
      name: 'Shadow Effects',
      description: 'Roll to determine additional shadow effects',
      tableType: 'dice',
      diceType: 'd6',
      entries: [
        { result: '1', name: 'Stun', effectType: 'Control', effect: 'Target is stunned for 1 round' },
        { result: '2', name: 'Fear', effectType: 'Control', effect: 'Target is feared for 1 round' },
        { result: '3', name: 'Shadow Damage', effectType: 'Damage', effect: 'Target takes an additional 2d6 shadow damage' },
        { result: '4', name: 'Slow', effectType: 'Control', effect: 'Target is slowed by 50% for 2 rounds' },
        { result: '5', name: 'Weaken', effectType: 'Debuff', effect: 'Target has disadvantage on saving throws for 2 rounds' },
        { result: '6', name: 'Combination', effectType: 'Multiple', effect: 'All effects above are applied at half effectiveness' }
      ]
    },
    // Chance-on-hit effects configuration
    procConfig: {
      enabled: true,
      procType: 'dice',
      procChance: 20,
      diceThreshold: 16,
      customEffects: ['restrained', 'silenced'],
      useRollableTable: true,
      effectType: 'control',
      effectDetails: 'Control Effects',
      effectDuration: 1,
      effectDurationUnit: 'rounds',
      displayText: 'Chance on Hit (20%): Roll on Control Effects table (d4)'
    },
    // Rollable table for chance-on-hit effects
    procRollableTable: {
      name: 'Control Effects',
      description: 'Roll to determine additional control effects',
      tableType: 'dice',
      diceType: 'd4',
      entries: [
        { result: '1', name: 'Restrain', effectType: 'Control', effect: 'Target is restrained for 1 round' },
        { result: '2', name: 'Silence', effectType: 'Control', effect: 'Target is silenced for 1 round' },
        { result: '3', name: 'Psychic Damage', effectType: 'Damage', effect: 'Target takes 2d6 psychic damage' },
        { result: '4', name: 'Reaction Block', effectType: 'Control', effect: 'Target cannot use reactions until your next turn' }
      ]
    },
    // Debuff configuration
    debuffConfig: {
      debuffType: 'movement',
      duration: 4,
      durationType: 'rounds',
      statPenalties: [
        { stat: 'movement_speed', value: -50, isPercentage: true }
      ],
      displayEffects: [
        { name: 'Slowed', description: 'Movement speed reduced by 50%', icon: 'spell_shadow_shadowward' }
      ]
    },
    // Control configuration
    controlConfig: {
      controlType: 'restraint',
      effects: ['immobilize', 'restrain'],
      duration: 3,
      durationUnit: 'rounds',
      savingThrow: true,
      savingThrowType: 'strength',
      difficultyClass: 16,
      concentration: true,
      distance: 0,
      displayEffects: [
        { name: 'Immobilized', description: 'Target cannot move', icon: 'spell_shadow_curseofachimonde' },
        { name: 'Restrained', description: 'Target has disadvantage on attacks and Dexterity saving throws', icon: 'spell_shadow_shadowward' }
      ]
    },
    // Channeling configuration
    channelingConfig: {
      maxDuration: 3,
      tickFrequency: 'end_of_turn',
      scalingType: 'increasing',
      breakEffectType: 'damage',
      resourceRefundType: 'partial',
      concentrationDC: 12,
      type: 'power_up',
      perRoundFormulas: {
        damage: [
          { round: 1, formula: '3d6 + INT', description: 'Turn 1 (Initial): 3d6 + Intelligence (avg 10.5 + INT) shadow damage' },
          { round: 2, formula: '4d6 + INT + (ROUND * 2)', description: 'Turn 2: 4d6 + Intelligence + 4 (avg 18 + INT) shadow damage' },
          { round: 3, formula: '5d6 + INT + (ROUND * 3) + (HEALTH_MISSING * 0.1)', description: 'Turn 3: 5d6 + Intelligence + 9 + 10% of missing health (avg 26.5 + INT + health bonus) shadow damage' }
        ]
      },
      baseEffects: {
        damage: '3d6 + INT'
      }
    },
    targetingMode: 'single',
    targetingConfig: {
      targetingType: 'single',
      range: 40,
      validTargets: ['enemy']
    },
    rangeType: 'ranged',
    range: 40,
    resourceCost: {
      mana: 20,
      health: 10,
      stamina: 0,
      focus: 0
    },
    cooldownConfig: {
      enabled: true,
      cooldownRounds: 4,
      cooldownType: 'rounds'
    },
    cooldown: '4 rounds',
    visualTheme: 'shadow',
    resolution: 'DICE',
    diceConfig: {
      formula: '3d6 + INT'
    },
    isDot: true,
    hasDotEffect: true,
    dotDuration: 4,
    dotTick: '2d6 + (INT/2)',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: ['control-spells', 'shadow-spells', 'damage-spells', 'channeled-spells'],
    negativeEffects: ['restrained', 'slowed', 'immobilized', 'stunned'],
    castingDescription: 'You extend your hand as dark energy coalesces around your fingers, drawing power from your own life force.',
    effectDescription: 'Tendrils of shadow extend from your hand, reaching toward the target as you maintain concentration.',
    impactDescription: 'The shadow tendrils wrap around the target, forming ethereal chains that bind and constrict with increasing strength as you channel more power into them.'
  },

  // 4. Arcane Missile - A magic missile spell
  {
    id: 'arcane-missile',
    name: 'Arcane Missile',
    description: 'You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range.',
    icon: 'spell_arcane_starfire',
    level: 1,
    school: 'arcane',
    spellType: 'ACTION',
    tags: ['damage', 'arcane', 'force', 'dice-based'],
    effectType: 'damage',
    effectTypes: ['damage'],
    damageTypes: ['force'],
    primaryDamage: {
      dice: '3d4',
      flat: 3
    },
    damageConfig: {
      damageType: 'direct',
      elementType: 'force',
      formula: '3d4+3',
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        explodingDice: false
      }
    },
    criticalConfig: {
      enabled: true,
      critType: 'dice',
      critMultiplier: 2,
      explodingDice: false,
      spellEffect: null,
      useRollableTable: false
    },
    targetingMode: 'single',
    targetingConfig: {
      targetingType: 'single',
      range: 120,
      validTargets: ['enemy']
    },
    rangeType: 'ranged',
    range: 120,
    resourceCost: {
      mana: 10,
      health: 0,
      stamina: 0,
      focus: 0
    },
    cooldownConfig: {
      enabled: false
    },
    visualTheme: 'arcane',
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: ['damage-spells'],
    castingDescription: 'You point a finger, and three glowing darts of magical force appear.',
    effectDescription: 'The darts streak toward their targets, leaving trails of blue light.',
    impactDescription: 'Each dart strikes with unerring accuracy, dealing force damage.'
  },

  // 5. Nature's Blessing - A nature buff spell with varied effects
  {
    id: 'natures-blessing',
    name: "Nature's Blessing",
    description: 'You invoke the power of nature to grant an ally enhanced vitality, protection, and various beneficial effects based on the environment.',
    icon: 'spell_nature_regeneration',
    level: 3,
    school: 'nature',
    spellType: 'ACTION',
    tags: ['buff', 'nature', 'healing', 'dice-based'],
    effectType: 'buff',
    effectTypes: ['buff', 'healing', 'protection'],
    damageTypes: ['nature'],
    healing: {
      dice: '2d8',
      flat: 5
    },
    healingConfig: {
      healingType: 'direct',
      formula: '2d8 + WIS + 5',
      hasHotEffect: true,
      hotConfig: {
        enabled: true,
        duration: 3,
        durationType: 'rounds',
        tickFormula: '1d4 + (WIS/2)',
        tickFrequency: 'start_of_turn'
      }
    },
    buffConfig: {
      buffType: 'enhancement',
      duration: 5,
      durationType: 'rounds',
      durationUnit: 'rounds',
      durationValue: 5,
      canBeDispelled: true,
      concentrationRequired: false,
      stackingRule: 'highestValue',
      maxStacks: 1,
      statBonuses: [
        { stat: 'strength', value: 2, isPercentage: false },
        { stat: 'constitution', value: 2, isPercentage: false },
        { stat: 'healing_received', value: 20, isPercentage: true },
        { stat: 'movement_speed', value: 30, isPercentage: true }
      ],
      statModifiers: [
        { id: 'strength', name: 'Strength', icon: 'ability_warrior_strengthofarms', magnitude: 2, magnitudeType: 'flat', description: 'Increases physical damage and carrying capacity' },
        { id: 'constitution', name: 'Constitution', icon: 'spell_holy_devotionaura', magnitude: 2, magnitudeType: 'flat', description: 'Increases health and stamina' },
        { id: 'healing_received', name: 'Healing Received', icon: 'spell_holy_healingaura', magnitude: 20, magnitudeType: 'percentage', description: 'Increases effectiveness of healing received' },
        { id: 'movement_speed', name: 'Movement Speed', icon: 'ability_rogue_sprint', magnitude: 30, magnitudeType: 'percentage', description: 'Increases movement speed' }
      ],
      statusEffects: [
        {
          id: 'regeneration',
          name: 'Regeneration',
          icon: 'spell_nature_rejuvenation',
          description: 'Regenerate health over time',
          config: {
            duration: 5,
            durationUnit: 'rounds',
            magnitude: '1d4 + WIS',
            magnitudeType: 'flat'
          }
        },
        {
          id: 'damage_reduction',
          name: 'Damage Reduction',
          icon: 'spell_holy_devotionaura',
          description: 'Reduces all incoming damage',
          config: {
            duration: 5,
            durationUnit: 'rounds',
            magnitude: 15,
            magnitudeType: 'percentage'
          }
        },
        {
          id: 'environmental_protection',
          name: 'Environmental Protection',
          icon: 'spell_nature_protectionformnature',
          description: 'Protection from environmental hazards',
          config: {
            duration: 5,
            durationUnit: 'rounds'
          }
        }
      ],
      isProgressive: false,
      useRollableTable: true,
      rollableTable: {
        name: 'Nature\'s Gifts',
        description: 'Roll to determine additional environmental effects',
        tableType: 'dice',
        diceType: 'd6',
        entries: [
          { result: '1', effect: 'Target gains water breathing for the duration' },
          { result: '2', effect: 'Target can move through difficult terrain without penalty' },
          { result: '3', effect: 'Target gains darkvision up to 60 feet' },
          { result: '4', effect: 'Target gains resistance to fire damage' },
          { result: '5', effect: 'Target gains resistance to cold damage' },
          { result: '6', effect: 'Target gains all of the above effects at half effectiveness' }
        ]
      },
      buffEffects: [
        { type: 'Stat Boost', description: '+2 Strength and Constitution' },
        { type: 'Healing Boost', description: '+20% Healing Received' },
        { type: 'Movement Boost', description: '+30% Movement Speed' },
        { type: 'Regeneration', description: '1d4 + WIS health per round' },
        { type: 'Damage Reduction', description: '15% reduced damage taken' },
        { type: 'Environmental Protection', description: 'Resistance to environmental hazards' }
      ],
      displayEffects: [
        { name: 'Strength', description: '+2 Strength', icon: 'ability_warrior_strengthofarms' },
        { name: 'Constitution', description: '+2 Constitution', icon: 'spell_holy_devotionaura' },
        { name: 'Healing Received', description: '+20% Healing Received', icon: 'spell_holy_healingaura' },
        { name: 'Movement Speed', description: '+30% Movement Speed', icon: 'ability_rogue_sprint' },
        { name: 'Regeneration', description: '1d4 + WIS health per round', icon: 'spell_nature_rejuvenation' },
        { name: 'Damage Reduction', description: '15% reduced damage taken', icon: 'spell_holy_devotionaura' },
        { name: 'Environmental Protection', description: 'Resistance to environmental hazards', icon: 'spell_nature_protectionformnature' }
      ]
    },
    targetingMode: 'single',
    targetingConfig: {
      targetingType: 'single',
      range: 30,
      validTargets: ['ally']
    },
    rangeType: 'ranged',
    range: 30,
    resourceCost: {
      mana: 10,
      health: 0,
      stamina: 5,
      focus: 5
    },
    cooldownConfig: {
      enabled: true,
      cooldownRounds: 3,
      cooldownType: 'rounds'
    },
    cooldown: '3 rounds',
    visualTheme: 'nature',
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: ['healing-spells', 'buff-spells'],
    castingDescription: 'You channel the energy of nature, causing your hands to glow with green light.',
    effectDescription: 'Vines and leaves briefly materialize around the target.',
    impactDescription: 'The target is infused with natural energy, gaining enhanced vitality and protection.'
  },

  // 6. Berserker's Fury - A rage-based physical attack
  {
    id: 'berserkers-fury',
    name: "Berserker's Fury",
    description: 'Channel your rage into a devastating physical attack that cleaves through enemies, growing stronger as you take damage.',
    icon: 'ability_warrior_rampage',
    level: 5,
    school: 'physical',
    spellType: 'ACTION',
    tags: ['damage', 'physical', 'rage', 'cleave', 'dice-based'],
    effectType: 'damage',
    effectTypes: ['damage', 'cleave'],
    damageTypes: ['slashing'],
    primaryDamage: {
      dice: '4d8',
      flat: 10
    },
    damageConfig: {
      damageType: 'direct',
      elementType: 'physical',
      formula: '4d8+10+(RAGE_POINTS*2)',
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        explodingDice: true,
        explodingDiceType: 'reroll_add',
        critEffects: ['bleeding']
      },
      chanceOnHitConfig: {
        enabled: true,
        procType: 'dice',
        procChance: 20,
        diceThreshold: 17,
        customEffects: ['bleeding']
      }
    },
    criticalConfig: {
      enabled: true,
      critType: 'dice',
      critMultiplier: 2,
      explodingDice: true,
      spellEffect: null,
      useRollableTable: false,
      effectType: 'damage',
      effectDetails: 'Bleeding',
      effectDuration: 3,
      effectDurationUnit: 'rounds',
      damageAmount: '2d4',
      damageType: 'Physical'
    },
    targetingMode: 'cleave',
    targetingConfig: {
      targetingType: 'aoe',
      aoeType: 'cone',
      aoeSize: 15,
      range: 5,
      validTargets: ['enemy']
    },
    rangeType: 'melee',
    range: 5,
    resourceCost: {
      mana: 0,
      health: 0,
      stamina: 0,
      rage: 25
    },
    cooldownConfig: {
      enabled: true,
      cooldownRounds: 2,
      cooldownType: 'rounds'
    },
    cooldown: '2 rounds',
    visualTheme: 'physical',
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: ['damage-spells', 'physical-spells'],
    negativeEffects: ['bleeding'],
    castingDescription: 'You let out a primal roar as your muscles bulge with rage-fueled power.',
    effectDescription: 'You swing your weapon in a wide arc, channeling your rage into raw destructive force.',
    impactDescription: 'Your attack cleaves through enemies, leaving deep wounds that continue to bleed.'
  },

  // 7. Blood Sacrifice - A health-cost spell with powerful effects
  {
    id: 'blood-sacrifice',
    name: "Blood Sacrifice",
    description: 'Sacrifice your own life force to unleash devastating necrotic energy that damages enemies and heals you for a portion of the damage dealt.',
    icon: 'spell_shadow_lifedrain02',
    level: 7,
    school: 'shadow',
    spellType: 'ACTION',
    tags: ['damage', 'healing', 'shadow', 'necrotic', 'health-cost', 'dice-based'],
    effectType: 'damage',
    effectTypes: ['damage', 'healing', 'lifesteal'],
    damageTypes: ['necrotic'],
    primaryDamage: {
      dice: '6d10',
      flat: 0
    },
    damageConfig: {
      damageType: 'direct',
      elementType: 'necrotic',
      formula: '6d10+(HEALTH_SACRIFICED*0.5)',
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        explodingDice: false
      }
    },
    healingConfig: {
      healingType: 'lifesteal',
      formula: 'DAMAGE_DEALT*0.4',
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 1.5
      }
    },
    criticalConfig: {
      enabled: true,
      critType: 'dice',
      critMultiplier: 2,
      spellEffect: null,
      useRollableTable: false
    },
    targetingMode: 'aoe',
    targetingConfig: {
      targetingType: 'aoe',
      aoeType: 'sphere',
      aoeSize: 15,
      range: 30,
      validTargets: ['enemy']
    },
    rangeType: 'ranged',
    range: 30,
    resourceCost: {
      mana: 10,
      health: 30,
      stamina: 0,
      focus: 0
    },
    cooldownConfig: {
      enabled: true,
      cooldownRounds: 5,
      cooldownType: 'rounds'
    },
    cooldown: '5 rounds',
    visualTheme: 'shadow',
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: ['damage-spells', 'shadow-spells', 'healing-spells'],
    negativeEffects: ['weakened'],
    castingDescription: 'You slice your palm, letting your blood drip to the ground as it transforms into dark energy.',
    effectDescription: 'The blood-infused energy swirls around you, growing in intensity before exploding outward.',
    impactDescription: 'A wave of necrotic energy washes over your enemies, draining their life force and returning it to you.'
  },

  // 8. Frost Trap - A trap spell that freezes enemies
  {
    id: 'frost-trap',
    name: "Frost Trap",
    description: 'Set a magical trap that freezes enemies who trigger it, dealing cold damage and slowing their movement.',
    icon: 'spell_frost_frostbolt',
    level: 4,
    school: 'frost',
    spellType: 'TRAP',
    tags: ['trap', 'damage', 'debuff', 'frost', 'cold', 'dice-based'],
    debuffEffects: [
      { name: 'Slow', description: 'Movement speed reduced by 50%', icon: 'spell_frost_freezingbreath' },
      { name: 'Chill', description: 'Cannot take reactions for 2 rounds', icon: 'spell_frost_chillingblast' },
      { name: 'Immobilize', description: 'Target cannot move for 1 round', icon: 'spell_frost_chainsofice' }
    ],
    savingThrow: 'constitution',
    difficultyClass: 15,
    triggerEffects: [
      { name: 'Proximity', description: 'Activates when an enemy comes within 10 feet', icon: 'spell_frost_frostward' },
      { name: 'Stepped On', description: 'Activates when an enemy steps directly on the trap', icon: 'spell_frost_frostshock' }
    ],
    effectType: 'trap',
    effectTypes: ['damage', 'debuff', 'trap', 'slow', 'chill', 'immobilize'],
    damageTypes: ['cold'],
    primaryDamage: {
      dice: '4d8',
      flat: 0
    },
    damageConfig: {
      damageType: 'direct',
      elementType: 'cold',
      formula: '4d8 + INT + (CASTER_LEVEL/2)',
      hasDotEffect: true,
      dotConfig: {
        enabled: true,
        duration: 3,
        durationType: 'rounds',
        tickFormula: '1d8 + (INT/2)',
        tickFrequency: 'end_of_turn'
      },
      dotScalingType: 'diminishing',
      dotTriggerType: 'periodic',
      isProgressiveDot: true,
      dotProgressiveStages: [
        { triggerAt: 1, formula: '1d8 + (INT/2)', description: 'Round 1: 1d8 + (INT/2) cold damage over time' },
        { triggerAt: 2, formula: '1d6 + (INT/2)', description: 'Round 2: 1d6 + (INT/2) cold damage over time' },
        { triggerAt: 3, formula: '1d4 + (INT/2)', description: 'Round 3: 1d4 + (INT/2) cold damage over time' }
      ],
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        critDiceOnly: false,
        extraDice: '2d8',
        explodingDice: true,
        explodingDiceType: 'reroll_add',
        critEffects: ['frozen', 'immobilized'],
        spellEffect: 'frozen',
        useRollableTable: true,
        rollableTable: {
          tableType: 'dice',
          diceType: 'd4',
          entries: [
            { result: '1', name: 'Frozen', effectType: 'Immobilize', effect: 'Target is frozen in place for 1 round' },
            { result: '2', name: 'Frostbite', effectType: 'Damage', effect: 'Target takes an additional 2d8 cold damage' },
            { result: '3', name: 'Numbing Cold', effectType: 'Debuff', effect: 'Target has disadvantage on Dexterity saving throws for 2 rounds' },
            { result: '4', name: 'Ice Prison', effectType: 'Stun', effect: 'Target is completely encased in ice and cannot move or take actions for 1 round' }
          ]
        }
      },
      chanceOnHitConfig: {
        enabled: true,
        procType: 'dice',
        procChance: 25,
        diceThreshold: 15,
        customEffects: ['chilled', 'slowed'],
        useRollableTable: false
      }
    },

    debuffConfig: {
      debuffType: 'movement',
      duration: 3,
      durationType: 'rounds',
      savingThrow: 'constitution',
      difficultyClass: 15,
      statPenalties: [
        { stat: 'movement_speed', value: -50, isPercentage: true },
        { stat: 'dexterity', value: -2, isPercentage: false }
      ],
      displayEffects: [
        { name: 'Slow', description: 'Movement speed reduced by 50%', icon: 'spell_frost_freezingbreath' },
        { name: 'Chill', description: 'Cannot take reactions for 2 rounds', icon: 'spell_frost_chillingblast' },
        { name: 'Immobilize', description: 'Target cannot move for 1 round', icon: 'spell_frost_chainsofice' }
      ]
    },
    trapConfig: {
      placementPosition: null,
      placementRadius: 15,
      detectionMethod: 'perception',
      disarmMethod: 'thieves_tools',
      resetTime: 0,
      trapDuration: 'permanent',
      durationValue: 0,
      durationUnit: 'hours',
      visibility: 'hidden',
      maxTriggers: 1,
      detectionDC: 14,
      disarmDC: 16,
      triggerType: 'proximity',
      triggerRadius: 10,
      triggerCondition: 'enemy',
      effectRadius: 15,
      effectShape: 'sphere',
      trapMechanics: {
        damage: '4d8 + INT',
        damageType: 'cold',
        debuffEffects: ['slow', 'chill', 'immobilize'],
        debuffDuration: 3,
        savingThrow: 'constitution',
        difficultyClass: 15
      },
      triggerMechanics: [
        { type: 'proximity', description: 'Activates when an enemy comes within 10 feet' },
        { type: 'stepped_on', description: 'Activates when an enemy steps directly on the trap' }
      ],
      triggerConditions: [
        { condition: 'enemy', description: 'Only triggers on enemies' }
      ],
      trapEffects: [
        { effect: 'damage', description: '4d8 + INT cold damage' },
        { effect: 'debuff', description: 'Slows, chills, and immobilizes targets (Constitution DC 15)' },
        { effect: 'dot', description: 'Deals 1d8 + (INT/2) cold damage per round for 3 rounds' }
      ],
      triggers: [
        { id: 'proximity', name: 'Proximity', description: 'Activates when an enemy comes within 10 feet', icon: 'spell_frost_frostward' },
        { id: 'stepped_on', name: 'Stepped On', description: 'Activates when an enemy steps directly on the trap', icon: 'spell_frost_frostshock' }
      ],
      triggerConfig: {
        global: {
          logicType: 'OR',
          compoundTriggers: [
            { id: 'proximity', type: 'proximity', params: { range: 10, targetType: 'enemy' } },
            { id: 'stepped_on', type: 'stepped_on', params: { targetType: 'enemy' } }
          ]
        }
      },
      displayTriggers: [
        { name: 'Proximity', description: 'Activates when an enemy comes within 10 feet', icon: 'spell_frost_frostward' },
        { name: 'Stepped On', description: 'Activates when an enemy steps directly on the trap', icon: 'spell_frost_frostshock' }
      ]
    },

    targetingMode: 'area',
    targetingConfig: {
      targetingType: 'area',
      aoeType: 'sphere',
      aoeSize: 15,
      range: 30,
      validTargets: ['enemy']
    },
    rangeType: 'ranged',
    range: 30,
    resourceCost: {
      mana: 25,
      health: 0,
      stamina: 0,
      focus: 0
    },
    cooldownConfig: {
      enabled: true,
      cooldownRounds: 3,
      cooldownType: 'rounds'
    },
    cooldown: '3 rounds',
    visualTheme: 'frost',
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: ['damage-spells', 'debuff-spells', 'trap-spells'],
    negativeEffects: ['slowed', 'chilled', 'frozen'],
    castingDescription: 'You channel frost magic into the ground, creating an almost invisible layer of ice.',
    effectDescription: 'The trap lies dormant, a faint shimmer of frost barely visible to the careful observer.',
    impactDescription: 'When triggered, the trap erupts in a blast of freezing air, coating nearby enemies in frost and ice.'
  }
];

// Custom collections for the library
export const CUSTOM_LIBRARY_COLLECTIONS = [
  // Spell schools
  {
    id: 'fire-spells',
    name: 'Fire Spells',
    description: 'Spells that harness the destructive power of fire',
    icon: 'spell_fire_firebolt02',
    spells: ['inferno-blast'],
    color: '#FF4400'
  },
  {
    id: 'holy-spells',
    name: 'Holy Spells',
    description: 'Spells that channel divine healing energy',
    icon: 'spell_holy_flashheal',
    spells: ['healing-cascade'],
    color: '#FFDD00'
  },
  {
    id: 'shadow-spells',
    name: 'Shadow Spells',
    description: 'Spells that manipulate the dark forces of shadow',
    icon: 'spell_shadow_shadowbolt',
    spells: ['shadow-chains', 'blood-sacrifice'],
    color: '#9370DB'
  },
  {
    id: 'arcane-spells',
    name: 'Arcane Spells',
    description: 'Spells that manipulate arcane energy',
    icon: 'spell_arcane_arcane01',
    spells: ['arcane-missile'],
    color: '#A335EE'
  },
  {
    id: 'nature-spells',
    name: 'Nature Spells',
    description: 'Spells that harness the power of nature',
    icon: 'spell_nature_naturetouchgrow',
    spells: ['natures-blessing'],
    color: '#22C55E'
  },
  {
    id: 'frost-spells',
    name: 'Frost Spells',
    description: 'Spells that harness the freezing power of ice and cold',
    icon: 'spell_frost_frostbolt02',
    spells: ['frost-trap'],
    color: '#69CCF0'
  },
  {
    id: 'physical-spells',
    name: 'Physical Spells',
    description: 'Spells that rely on physical prowess and martial skill',
    icon: 'ability_warrior_decisivestrike',
    spells: ['berserkers-fury'],
    color: '#C79C6E'
  },

  // Spell effects
  {
    id: 'damage-spells',
    name: 'Damage Spells',
    description: 'Spells focused on dealing damage to enemies',
    icon: 'spell_fire_firebolt02',
    spells: ['inferno-blast', 'shadow-chains', 'arcane-missile', 'berserkers-fury', 'blood-sacrifice', 'frost-trap'],
    color: '#FF4400'
  },
  {
    id: 'healing-spells',
    name: 'Healing Spells',
    description: 'Spells that restore health and provide healing over time',
    icon: 'spell_holy_flashheal',
    spells: ['healing-cascade', 'natures-blessing', 'blood-sacrifice'],
    color: '#44DD44'
  },
  {
    id: 'buff-spells',
    name: 'Buff Spells',
    description: 'Spells that enhance allies with positive effects',
    icon: 'spell_holy_divineaegis',
    spells: ['natures-blessing'],
    color: '#3B82F6'
  },
  {
    id: 'debuff-spells',
    name: 'Debuff Spells',
    description: 'Spells that weaken enemies and restrict their actions',
    icon: 'spell_frost_chainsofice',
    spells: ['shadow-chains', 'frost-trap'],
    color: '#00CCFF'
  },
  {
    id: 'channeled-spells',
    name: 'Channeled Spells',
    description: 'Spells that can be maintained over time for increasing effects',
    icon: 'spell_shadow_siphonmana',
    spells: ['shadow-chains'],
    color: '#8800FF'
  },

  // Resource types
  {
    id: 'mana-spells',
    name: 'Mana Spells',
    description: 'Spells that use mana as their primary resource',
    icon: 'spell_frost_manarecharge',
    spells: ['inferno-blast', 'healing-cascade', 'arcane-missile', 'natures-blessing', 'shadow-chains', 'frost-trap'],
    color: '#0070DE'
  },
  {
    id: 'health-cost-spells',
    name: 'Blood Magic',
    description: 'Spells that sacrifice health to achieve powerful effects',
    icon: 'spell_shadow_lifedrain',
    spells: ['blood-sacrifice', 'shadow-chains'],
    color: '#C41E3A'
  },
  {
    id: 'rage-spells',
    name: 'Rage Abilities',
    description: 'Abilities that channel rage into devastating attacks',
    icon: 'ability_warrior_innerrage',
    spells: ['berserkers-fury'],
    color: '#C41F3B'
  },
  {
    id: 'trap-spells',
    name: 'Trap Spells',
    description: 'Spells that can be set as traps to trigger when enemies approach',
    icon: 'spell_frost_frostbolt',
    spells: ['frost-trap'],
    color: '#69CCF0'
  }
];
