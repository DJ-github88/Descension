/**
 * Custom Spell Library Data
 *
 * This file contains custom spells for the spell library that follow the current wizard format.
 * All spells use proper formatting with no deprecated fields and readable formulas.
 */

// Custom spells for the library - completely rewritten for proper formatting
export const CUSTOM_LIBRARY_SPELLS = [
  // 1. Fireball - Classic fire damage spell with enhanced features
  {
    id: 'fireball-001',
    name: 'Fireball',
    description: 'A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. The fire spreads around corners and ignites flammable objects.',
    icon: 'spell_fire_fireball02',

    spellType: 'ACTION',
    tags: ['damage', 'fire', 'area', 'explosive'],
    effectTypes: ['damage'],
    damageTypes: ['fire'],
    damageConfig: {
      damageType: 'direct',
      elementType: 'fire',
      formula: '8d6',
      hasDotEffect: true,
      dotFormula: '2d6',
      dotDuration: 3,
      dotTickType: 'round',
      dotApplication: 'start',
      dotScalingType: 'flat',
      dotTriggerType: 'periodic',
      isProgressiveDot: false,
      savingThrow: {
        enabled: true,
        attribute: 'agility',
        difficulty: 15,
        onSuccess: 'half_damage',
        onFailure: 'full_damage'
      },
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        critDiceOnly: false,
        extraDice: '1d6',
        explodingDice: true,
        explodingDiceType: 'reroll_add',
        critEffects: ['ignite_flammables']
      },
      chanceOnHitConfig: {
        enabled: true,
        procType: 'dice',
        procChance: 25,
        diceThreshold: 17,
        customEffects: ['burning_ground']
      }
    },
    targetingConfig: {
      targetingType: 'aoe',
      aoeType: 'sphere',
      aoeSize: 20,
      range: 150,
      validTargets: ['enemy', 'ally', 'object'],
      requiresLineOfSight: true,
      ignoresCover: false,
      aoeConfig: {
        centerType: 'point',
        spreadType: 'explosion',
        affectsFlammableObjects: true,
        damagesFriendlies: true,
        visualEffect: 'fire_explosion'
      }
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
      value: 3,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'elemental'
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'fire',
    castingDescription: 'You point your finger and speak the incantation, channeling elemental fire.',
    effectDescription: 'A bright streak of fire shoots forth and explodes in a 20-foot radius sphere.',
    impactDescription: 'Targets are engulfed in flames and take fire damage. Flammable objects ignite.',
    mechanicsConfig: {
      savingThrow: {
        enabled: true,
        attribute: 'agility',
        difficulty: 15,
        onSuccess: 'half_damage',
        onFailure: 'full_damage'
      },
      conditions: {
        applied: ['burning'],
        duration: 2,
        saveEnds: true
      }
    },
    enhancementConfig: {
      scalingType: 'power',
      scalingFormula: '+1d6 per power level',
      maxPower: 5,
      powerLevelEffects: {
        level2: 'Ignites flammable objects in area',
        level3: 'Increases radius by 5 feet',
        level4: 'Adds 1 round of burning DoT',
        level5: 'Creates lingering fire field for 3 rounds'
      }
    },
    triggerConfig: {
      global: {
        logicType: 'OR',
        compoundTriggers: [
          {
            triggerType: 'enemy_in_range',
            range: 150,
            targetCount: 2
          },
          {
            triggerType: 'ally_below_health',
            healthThreshold: 50,
            percentage: true
          }
        ]
      },
      effectTriggers: {},
      conditionalEffects: {},
      triggerRole: {
        mode: 'CONDITIONAL',
        activationDelay: 0,
        requiresLOS: true,
        maxRange: 150,
        cooldownAfterTrigger: 0,
        resourceModifier: 1.0
      }
    },
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: []
  },

  // 2. Healing Light - Enhanced healing spell with restoration effects
  {
    id: 'healing-light-001',
    name: 'Healing Light',
    description: 'A warm, golden light envelops the target, mending wounds and restoring vitality. The divine energy also cleanses minor ailments and provides temporary resilience.',
    icon: 'spell_holy_heal',

    spellType: 'ACTION',
    tags: ['healing', 'light', 'restoration', 'divine'],
    effectTypes: ['healing', 'buff'],
    healingConfig: {
      healingType: 'direct',
      formula: '2d8 + 4',
      hasHotEffect: true,
      hasShieldEffect: true,
      hotFormula: '1d4 + 2',
      hotDuration: 3,
      hotTickType: 'round',
      hotApplication: 'start',
      hotScalingType: 'flat',
      hotTriggerType: 'periodic',
      isProgressiveHot: false,
      shieldFormula: '1d6 + 3',
      shieldDuration: 5,
      shieldDamageTypes: 'all',
      shieldOverflow: 'convert_to_healing',
      shieldBreakBehavior: 'fade',
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        critDiceOnly: false,
        extraDice: '1d4',
        explodingDice: false,
        critEffects: ['divine_blessing']
      },
      chanceOnHitConfig: {
        enabled: true,
        procType: 'dice',
        procChance: 20,
        diceThreshold: 18,
        customEffects: ['cleanse_poison']
      }
    },
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
        { stat: 'constitution', value: 2, isPercentage: false },
        { stat: 'spirit', value: 1, isPercentage: false }
      ],
      statusEffects: ['divine_protection', 'disease_immunity'],
      isProgressive: false,
      buffs: [
        {
          name: 'Divine Resilience',
          description: 'Temporary hit points and resistance to disease',
          duration: 10,
          effects: {
            temporaryHitPoints: 5,
            resistances: ['disease', 'poison', 'necrotic'],
            damageReduction: 2,
            healingBonus: 1.2
          }
        }
      ]
    },
    targetingConfig: {
      targetingType: 'single',
      range: 60,
      validTargets: ['ally', 'self']
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
      value: 1,
      charges: 2,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'healing'
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'holy',
    castingDescription: 'You extend your hand toward the target, channeling divine energy.',
    effectDescription: 'Golden light surrounds the target, closing wounds.',
    impactDescription: 'The target feels warmth as their injuries heal.'
  },

  // 3. Lightning Bolt - Enhanced linear damage spell with chain effects
  {
    id: 'lightning-bolt-001',
    name: 'Lightning Bolt',
    description: 'A stroke of lightning forming a line 100 feet long and 5 feet wide blasts out from you in a direction you choose. The electrical energy can arc to nearby enemies and temporarily stun targets.',
    icon: 'spell_nature_lightning',

    spellType: 'ACTION',
    tags: ['damage', 'lightning', 'line', 'chain', 'stunning'],
    effectTypes: ['damage', 'debuff'],
    damageTypes: ['lightning'],
    damageConfig: {
      damageType: 'direct',
      elementType: 'lightning',
      formula: '8d6',
      hasDotEffect: false,
      savingThrow: {
        enabled: true,
        attribute: 'agility',
        difficulty: 16,
        onSuccess: 'half_damage',
        onFailure: 'full_damage'
      },
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        critDiceOnly: false,
        extraDice: '2d6',
        explodingDice: true,
        explodingDiceType: 'reroll_add',
        critEffects: ['chain_to_additional_target', 'electrical_overload']
      },
      chainConfig: {
        enabled: true,
        maxTargets: 3,
        range: 15,
        damageReduction: 0.5,
        intelligentTargeting: true,
        avoidAllies: true,
        preferWeakestTargets: false
      },
      chanceOnHitConfig: {
        enabled: true,
        procType: 'dice',
        procChance: 30,
        diceThreshold: 16,
        customEffects: ['electrical_discharge']
      }
    },
    debuffConfig: {
      duration: 1,
      savingThrow: {
        attribute: 'constitution',
        difficulty: 15,
        repeatAtEndOfTurn: false
      },
      savingThrowType: 'constitution',
      difficultyClass: 15,
      statPenalties: [
        { stat: 'agility', value: -2, isPercentage: false }
      ],
      displayEffects: [
        {
          name: 'Electrical Shock',
          description: 'Stunned and movement impaired by electrical energy',
          icon: 'spell_nature_lightning'
        }
      ],
      debuffs: [
        {
          name: 'Electrical Shock',
          description: 'Stunned for 1 round on failed Constitution save',
          duration: 1,
          effects: {
            conditions: ['stunned', 'slowed'],
            speedReduction: 0.5,
            actionLimitation: 'no_actions',
            savingThrow: {
              attribute: 'constitution',
              difficulty: 15
            }
          }
        }
      ]
    },
    targetingConfig: {
      targetingType: 'line',
      lineLength: 100,
      lineWidth: 5,
      range: 100,
      validTargets: ['enemy', 'ally', 'object'],
      requiresLineOfSight: true,
      ignoresCover: false,
      lineConfig: {
        originType: 'caster',
        penetratesTargets: true,
        stopsAtWalls: true,
        visualEffect: 'lightning_bolt'
      }
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
      value: 3,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'elemental'
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'storm',
    castingDescription: 'You point your finger and lightning crackles between your fingertips.',
    effectDescription: 'A brilliant bolt of lightning streaks toward your target.',
    impactDescription: 'The lightning strikes with thunderous force.'
  },

  // 4. Shield of Faith - Enhanced protective buff spell with reactive defenses
  {
    id: 'shield-of-faith-001',
    name: 'Shield of Faith',
    description: 'A shimmering field appears and surrounds a creature of your choice, granting it protection from harm. The divine shield can absorb damage and reflects hostile magic back at attackers.',
    icon: 'spell_holy_devotion',

    spellType: 'ACTION',
    tags: ['buff', 'protection', 'holy', 'reactive'],
    effectTypes: ['buff'],
    buffConfig: {
      duration: 10,
      durationValue: 10,
      durationType: 'turns',
      durationUnit: 'minutes',
      restType: 'short',
      canBeDispelled: true,
      concentrationRequired: false,
      stackingRule: 'replace',
      maxStacks: 1,
      magnitude: 2,
      magnitudeType: 'flat',
      statModifiers: [
        { stat: 'armor', value: 2, isPercentage: false },
        { stat: 'spirit', value: 1, isPercentage: false },
        { stat: 'constitution', value: 1, isPercentage: false }
      ],
      statusEffects: ['divine_protection', 'spell_reflection', 'damage_absorption'],
      isProgressive: false,
      buffs: [
        {
          name: 'Divine Shield',
          description: 'Enhanced protection and reactive defenses',
          duration: 10,
          effects: {
            armorBonus: 2,
            damageAbsorption: 15,
            spellReflection: {
              chance: 25,
              reflectDamage: true,
              reflectSpells: true
            },
            resistances: ['necrotic', 'psychic', 'radiant'],
            immunities: ['fear', 'charm'],
            healingBonus: 1.1,
            savingThrowBonus: 1
          }
        }
      ],
      statBonuses: [
        { stat: 'armor', value: 2, isPercentage: false },
        { stat: 'spirit', value: 1, isPercentage: false }
      ],
      displayEffects: [
        { name: 'Divine Protection', description: '+2 Armor, absorbs 15 damage, 25% spell reflection, immunity to fear/charm', icon: 'spell_holy_devotion' }
      ]
    },
    targetingConfig: {
      targetingType: 'single',
      range: 60,
      validTargets: ['ally', 'self']
    },
    resourceCost: {
      mana: 10,
      health: 0,
      stamina: 0,
      focus: 0
    },
    durationConfig: {
      type: 'timed',
      value: 10,
      unit: 'minutes',
      concentration: false,
      dispellable: true
    },
    cooldownConfig: {
      type: 'short_rest',
      value: 1,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'protection'
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'holy',
    castingDescription: 'You speak a prayer and gesture toward the target.',
    effectDescription: 'A faint shimmer surrounds the target like a protective barrier.',
    impactDescription: 'The target feels divinely protected.'
  },

  // 5. Magic Missile - Enhanced reliable force damage with scaling
  {
    id: 'magic-missile-001',
    name: 'Magic Missile',
    description: 'You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range. The darts never miss and can pierce through magical defenses.',
    icon: 'spell_arcane_missiles',

    spellType: 'ACTION',
    tags: ['damage', 'force', 'reliable', 'unerring', 'piercing'],
    effectTypes: ['damage'],
    damageTypes: ['force'],
    damageConfig: {
      damageType: 'direct',
      elementType: 'force',
      formula: '3d4 + 3',
      hasDotEffect: false,
      autoHit: true,
      pierceResistance: true,
      ignoresCover: true,
      savingThrow: {
        enabled: false // Magic missile never allows saves
      },
      criticalConfig: {
        enabled: false // Magic missile doesn't crit traditionally
      },
      multiTargetConfig: {
        enabled: true,
        maxTargets: 3,
        damageScaling: 'per_missile',
        scalingFormula: '1d4 + 1 per missile',
        hitRollPerTarget: false, // Auto-hit
        distributionMethod: 'player_choice'
      },
      chanceOnHitConfig: {
        enabled: true,
        procType: 'dice',
        procChance: 10,
        diceThreshold: 19,
        customEffects: ['arcane_mark']
      }
    },
    targetingConfig: {
      targetingType: 'multiple',
      maxTargets: 3,
      range: 120,
      validTargets: ['enemy'],
      requiresLineOfSight: true,
      ignoresCover: true,
      selectionMethod: 'manual',
      targetSelectionMethod: 'manual',
      multiTargetConfig: {
        enabled: true,
        maxTargets: 3,
        selectionType: 'individual',
        allowSameTarget: true,
        distributionMethod: 'player_choice'
      }
    },
    enhancementConfig: {
      scalingType: 'power',
      scalingFormula: '+1 dart per power level',
      maxPower: 5,
      additionalEffects: {
        power3: 'Darts can target objects and deal double damage to them',
        power5: 'Each dart has a 10% chance to create an additional dart'
      }
    },
    resourceCost: {
      mana: 10,
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
      value: 0,
      charges: 3,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'cantrip'
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'arcane',
    castingDescription: 'You point your finger and speak the incantation.',
    effectDescription: 'Three glowing darts streak toward your targets.',
    impactDescription: 'Each dart strikes unerringly for force damage.'
  },

  // 6. Regeneration - Healing over time spell
  {
    id: 'regeneration-001',
    name: 'Regeneration',
    description: 'You touch a creature and stimulate its natural healing ability. The target regains hit points at the start of each of its turns.',
    icon: 'spell_nature_regeneration',

    spellType: 'ACTION',
    tags: ['healing', 'regeneration', 'duration'],
    effectTypes: ['healing'],
    healingConfig: {
      healingType: 'hot',
      formula: '1d4', // Initial minor healing
      hasHotEffect: true,
      hasShieldEffect: false,
      hotFormula: '4d8 + 15',
      hotDuration: 12,
      hotTickType: 'round',
      hotApplication: 'start',
      hotScalingType: 'flat',
      hotTriggerType: 'periodic',
      isProgressiveHot: true,
      hotProgressiveStages: [
        { round: 1, formula: '2d8 + 5', description: 'Initial regeneration' },
        { round: 5, formula: '3d8 + 10', description: 'Enhanced regeneration' },
        { round: 10, formula: '4d8 + 15', description: 'Peak regeneration' }
      ],
      hotConfig: {
        enabled: true,
        duration: 12,
        durationType: 'rounds',
        tickFormula: '4d8 + 15',
        tickFrequency: 'start',
        scalingType: 'progressive',
        canStack: false,
        dispellable: true
      },
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 1.5,
        critDiceOnly: false,
        extraDice: '1d8',
        explodingDice: false,
        critEffects: ['regeneration_boost']
      },
      chanceOnHitConfig: {
        enabled: true,
        procType: 'dice',
        procChance: 15,
        diceThreshold: 18,
        customEffects: ['limb_regrowth']
      }
    },
    targetingConfig: {
      targetingType: 'single',
      range: 'touch',
      validTargets: ['ally', 'self']
    },
    resourceCost: {
      mana: 70,
      health: 0,
      stamina: 0,
      focus: 0
    },
    durationConfig: {
      type: 'timed',
      value: 12,
      unit: 'rounds',
      concentration: true,
      dispellable: true
    },
    cooldownConfig: {
      type: 'long_rest',
      value: 1,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'powerful_healing'
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'nature',
    castingDescription: 'You touch the target and channel natural healing energy.',
    effectDescription: 'The target\'s wounds begin to close and regenerate.',
    impactDescription: 'The target feels their body rapidly healing itself.'
  }
];

// Spell categories for organization
export const SPELL_CATEGORIES = [
  {
    id: 'damage-spells',
    name: 'Damage Spells',
    description: 'Spells that deal direct damage to enemies',
    icon: 'spell_fire_fireball02',
    spells: ['fireball-001', 'lightning-bolt-001', 'magic-missile-001'],
    color: '#ef4444'
  },
  {
    id: 'healing-spells',
    name: 'Healing Spells',
    description: 'Spells that restore health and vitality',
    icon: 'spell_holy_heal',
    spells: ['healing-light-001', 'regeneration-001'],
    color: '#22c55e'
  },
  {
    id: 'buff-spells',
    name: 'Buff Spells',
    description: 'Spells that enhance allies with beneficial effects',
    icon: 'spell_holy_devotion',
    spells: ['shield-of-faith-001'],
    color: '#3b82f6'
  }
];