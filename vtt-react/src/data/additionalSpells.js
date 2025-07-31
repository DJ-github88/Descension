/**
 * Additional Spells for the Spell Library
 *
 * This file contains additional spells that follow the current wizard format.
 * All spells use proper formatting with no deprecated fields and readable formulas.
 */

// Additional spells for the library - rewritten for proper formatting
export const ADDITIONAL_SPELLS = [
  // 1. Ice Shard - Cold damage projectile spell
  {
    id: 'ice-shard-001',
    name: 'Ice Shard',
    description: 'You hurl a shard of ice at a creature within range. On a hit, the target takes cold damage and may be slowed.',
    icon: 'spell_frost_frostbolt',

    spellType: 'ACTION',
    tags: ['damage', 'cold', 'projectile'],
    effectTypes: ['damage'],
    damageTypes: ['cold'],
    damageConfig: {
      damageType: 'direct',
      elementType: 'cold',
      formula: '1d8 + 2',
      hasDotEffect: false,
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        explodingDice: false,
        critEffects: ['slow_target']
      },
      savingThrow: 'agility',
      savingThrowType: 'agility',
      difficultyClass: 13,
      partialEffect: 'half_damage',
      partialEffectFormula: 'damage/2',
      additionalEffects: {
        slowOnHit: {
          enabled: true,
          duration: 6,
          speedReduction: 0.5,
          savingThrow: 'agility',
          difficultyClass: 13
        }
      }
    },
    targetingConfig: {
      targetingType: 'single',
      range: 120,
      validTargets: ['enemy']
    },
    resourceCost: {
      mana: 8,
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
      cooldownGroup: 'elemental'
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'frost',
    castingDescription: 'You point at the target and conjure a sharp shard of ice.',
    effectDescription: 'A crystalline projectile streaks toward the target.',
    impactDescription: 'The ice shard pierces the target with freezing cold.'
  },

  // 2. Cure Wounds - Basic healing spell
  {
    id: 'cure-wounds-001',
    name: 'Cure Wounds',
    description: 'A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier.',
    icon: 'spell_holy_heal',

    spellType: 'ACTION',
    tags: ['healing', 'touch', 'restoration'],
    effectTypes: ['healing'],
    healingConfig: {
      healingType: 'direct',
      formula: '1d8 + 3',
      hasHotEffect: false
    },
    targetingConfig: {
      targetingType: 'single',
      range: 'touch',
      validTargets: ['ally', 'self']
    },
    resourceCost: {
      mana: 8,
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
      charges: 4,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'healing'
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'holy',
    castingDescription: 'You touch the target and channel healing energy.',
    effectDescription: 'Warm light flows from your hand into the target.',
    impactDescription: 'The target\'s wounds begin to close and heal.'
  },

  // 3. Mage Armor - Protective self-buff
  {
    id: 'mage-armor-001',
    name: 'Mage Armor',
    description: 'You touch a willing creature who isn\'t wearing armor, and protective energy surrounds it until the spell ends.',
    icon: 'spell_arcane_arcaneshield',

    spellType: 'ACTION',
    tags: ['buff', 'protection', 'armor'],
    effectTypes: ['buff'],
    buffConfig: {
      duration: 8,
      durationValue: 8,
      durationType: 'time',
      durationUnit: 'hours',
      restType: 'long',
      canBeDispelled: true,
      concentrationRequired: false,
      stackingRule: 'replace',
      maxStacks: 1,
      magnitude: 3,
      magnitudeType: 'flat',
      statModifiers: [
        { stat: 'armor', value: 3, isPercentage: false }
      ],
      statusEffects: ['mage_armor'],
      isProgressive: false,
      buffs: [
        {
          name: 'Mage Armor',
          description: 'Magical protection that enhances natural defenses',
          duration: 28800,
          effects: {
            armorBonus: 3,
            magicalProtection: true,
            dispelResistance: 10
          }
        }
      ]
    },
    targetingConfig: {
      targetingType: 'single',
      range: 'touch',
      validTargets: ['ally', 'self']
    },
    resourceCost: {
      mana: 8,
      health: 0,
      stamina: 0,
      focus: 0
    },
    durationConfig: {
      type: 'timed',
      value: 8,
      unit: 'hours',
      concentration: false,
      dispellable: true
    },
    cooldownConfig: {
      type: 'long_rest',
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
    visualTheme: 'arcane',
    castingDescription: 'You touch the target and weave protective magic around them.',
    effectDescription: 'A shimmering field of force surrounds the target.',
    impactDescription: 'The target feels protected by magical energy.'
  },

  // 4. Thunderous Smite - Thunder damage with knockback
  {
    id: 'thunderous-smite',
    name: 'Thunderous Smite',
    description: 'The next time you hit a creature with a melee weapon attack, your weapon rings with thunder that is audible within 300 feet of you, and the attack deals extra thunder damage.',
    icon: 'spell_nature_thunderclap',

    spellType: 'ACTION',
    tags: ['damage', 'thunder', 'enhancement', 'knockback'],
    effectTypes: ['damage', 'debuff'],
    damageTypes: ['thunder'],
    damageConfig: {
      damageType: 'direct',
      elementType: 'thunder',
      formula: '2d6',
      hasDotEffect: false,
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2
      }
    },
    debuffConfig: {
      duration: 1,
      durationValue: 1,
      durationType: 'rounds',
      durationUnit: 'rounds',
      restType: 'short',
      canBeDispelled: false,
      concentrationRequired: false,
      stackingRule: 'replace',
      maxStacks: 1,
      magnitude: 1,
      magnitudeType: 'flat',
      statModifiers: [],
      statusEffects: ['prone'],
      isProgressive: false,
      debuffs: [
        {
          name: 'Thunderous Knockback',
          description: 'Target is pushed 10 feet away and must make a Strength save or be knocked prone',
          duration: 1,
          effects: {
            conditions: ['prone'],
            knockback: 10,
            savingThrow: 'strength',
            difficultyClass: 13,
            forcedMovement: true
          }
        }
      ]
    },
    targetingConfig: {
      targetingType: 'single',
      range: 'melee',
      validTargets: ['enemy']
    },
    resourceCost: {
      mana: 12,
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
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'enhancement'
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'storm',
    castingDescription: 'You imbue your weapon with thunderous energy.',
    effectDescription: 'Your weapon crackles with electrical energy and thunder.',
    impactDescription: 'The strike resonates with a thunderous boom.'
  },

  // 5. Chain Lightning - Lightning that jumps between targets
  {
    id: 'chain-lightning',
    name: 'Chain Lightning',
    description: 'You create a bolt of lightning that arcs toward a target of your choice that you can see within range. Three bolts then leap from that target to as many as three other targets.',
    icon: 'spell_nature_chainlightning',

    spellType: 'ACTION',
    tags: ['damage', 'lightning', 'chain', 'area'],
    effectTypes: ['damage'],
    damageTypes: ['lightning'],
    damageConfig: {
      damageType: 'direct',
      elementType: 'lightning',
      formula: '10d8',
      hasDotEffect: true,
      dotFormula: '1d8',
      dotDuration: 2,
      dotTickType: 'round',
      dotApplication: 'start',
      dotScalingType: 'flat',
      dotTriggerType: 'periodic',
      isProgressiveDot: false,
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
        extraDice: '2d8',
        explodingDice: true,
        explodingDiceType: 'reroll_add',
        critEffects: ['chain_to_additional_target', 'electrical_storm']
      },
      chainConfig: {
        enabled: true,
        maxTargets: 4,
        range: 30,
        damageReduction: 0.5,
        intelligentTargeting: true,
        avoidAllies: true,
        preferWeakestTargets: false,
        chainOnCrit: true,
        maxChainJumps: 6
      },
      chanceOnHitConfig: {
        enabled: true,
        procType: 'dice',
        procChance: 35,
        diceThreshold: 15,
        customEffects: ['lightning_field']
      }
    },
    targetingConfig: {
      targetingType: 'single',
      range: 150,
      validTargets: ['enemy']
    },
    resourceCost: {
      mana: 45,
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
      type: 'short_rest',
      value: 1,
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
    castingDescription: 'You point at the primary target and channel electrical energy.',
    effectDescription: 'Lightning arcs from target to target in a chain reaction.',
    impactDescription: 'Each target is struck by crackling electrical energy.'
  },

  // 6. Mirror Image - Illusion spell creating duplicates
  {
    id: 'mirror-image',
    name: 'Mirror Image',
    description: 'Three illusory duplicates of yourself appear in your space. Until the spell ends, the duplicates move with you and mimic your actions, shifting position so it\'s impossible to track which image is real.',
    icon: 'spell_magic_lesserinvisibilty',

    spellType: 'ACTION',
    tags: ['utility', 'illusion', 'protection', 'duplicates'],
    effectTypes: ['utility', 'buff'],
    utilityConfig: {
      utilityType: 'illusion',
      duration: 60,
      durationUnit: 'seconds',
      concentration: false,
      difficultyClass: 15,
      abilitySave: 'intelligence',
      difficulty: 'moderate',
      selectedEffects: ['mirror_images', 'displacement', 'confusion'],
      effects: [
        {
          name: 'Mirror Images',
          description: 'Creates 3 illusory duplicates that absorb attacks',
          duration: 60,
          mechanics: {
            imageCount: 3,
            hitChance: 25, // 25% chance to hit real target when images are present
            imageDestruction: 'on_hit',
            imageRegeneration: {
              enabled: true,
              regenRate: 1,
              regenInterval: 30,
              maxImages: 3
            },
            movementMirroring: true,
            actionMirroring: true,
            intelligentPositioning: true,
            imageHealth: 1,
            imageAC: 10,
            imageSavingThrows: {
              strength: 8,
              agility: 12,
              constitution: 8,
              intelligence: 10,
              spirit: 10,
              charisma: 10
            }
          }
        }
      ],
      advancedMechanics: {
        dispelResistance: 15,
        trueSeeing: 'reveals_real_target',
        areaEffects: 'affect_all_images',
        detectionDC: 18,
        illusionSchool: 'figment',
        interactionBehavior: 'maintain_illusion'
      }
    },
    buffConfig: {
      duration: 1,
      durationValue: 1,
      durationType: 'time',
      durationUnit: 'minutes',
      restType: 'short',
      canBeDispelled: true,
      concentrationRequired: false,
      stackingRule: 'replace',
      maxStacks: 1,
      magnitude: 3,
      magnitudeType: 'flat',
      statModifiers: [
        { stat: 'armor', value: 2, isPercentage: false }
      ],
      statusEffects: ['mirror_images', 'displacement'],
      isProgressive: false,
      buffs: [
        {
          name: 'Illusory Protection',
          description: 'Attacks have reduced chance to hit the real target',
          duration: 60,
          effects: {
            missChance: 75,
            imageCount: 3,
            specialMechanics: ['mirror_images'],
            armorBonus: 2,
            illusionProtection: true
          }
        }
      ]
    },
    targetingConfig: {
      targetingType: 'self',
      range: 0,
      validTargets: ['self']
    },
    resourceCost: {
      mana: 15,
      health: 0,
      stamina: 0,
      focus: 0
    },
    durationConfig: {
      type: 'timed',
      value: 60,
      unit: 'seconds',
      concentration: false,
      dispellable: true
    },
    cooldownConfig: {
      type: 'short_rest',
      value: 1,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'illusion'
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'illusion',
    castingDescription: 'You weave illusion magic around yourself.',
    effectDescription: 'Three perfect duplicates of yourself appear and begin mimicking your movements.',
    impactDescription: 'Enemies struggle to determine which version of you is real.'
  },

  // 7. Card Divination - Card-based spell with CARDS resolution
  {
    id: 'card-divination',
    name: 'Card Divination',
    description: 'You draw mystical cards to divine the future and gain insight into upcoming events. Draw 3 cards to determine the strength and type of divination effects received.',
    icon: 'spell_holy_mindvision',

    spellType: 'ACTION',
    tags: ['utility', 'divination', 'card-based', 'insight'],
    effectTypes: ['utility', 'buff'],

    // Proper buff configuration for spell wizard display
    buffConfig: {
      duration: 10,
      durationValue: 10,
      durationType: 'time',
      durationUnit: 'minutes',
      restType: 'short',
      canBeDispelled: true,
      concentrationRequired: false,
      stackingRule: 'replace',
      maxStacks: 1,
      magnitude: 2,
      magnitudeType: 'flat',
      statModifiers: [
        { stat: 'spirit', value: 2, isPercentage: false },
        { stat: 'intelligence', value: 1, isPercentage: false }
      ],
      statusEffects: ['inspired', 'blessed'],
      isProgressive: false,
      buffs: [
        {
          name: 'Divination Insight',
          description: 'Enhanced perception and foresight from mystical cards',
          duration: 600,
          effects: {
            advantage: ['spirit', 'intelligence'],
            initiativeBonus: 2,
            surpriseImmunity: true,
            perceptionBonus: 3,
            insightBonus: 2
          }
        }
      ]
    },

    // Use rollableTable instead of cardConfig for proper display
    rollableTable: {
      enabled: true,
      name: 'Divination Cards',
      description: 'Draw 3 cards to determine divination effects',
      resolutionType: 'CARDS',
      resolutionConfig: {
        cardCount: 3,
        diceType: 'd20',
        coinCount: 3
      },
      entries: [
        {
          id: 'royal-flush',
          cardPattern: 'ROYAL_FLUSH',
          customName: 'Perfect Foresight',
          effect: {
            type: 'buff',
            description: 'Advantage on all checks for 10 minutes + gain 1 inspiration point',
            duration: 600,
            mechanics: { advantage: 'all', inspiration: 1 }
          }
        },
        {
          id: 'straight-flush',
          cardPattern: 'STRAIGHT_FLUSH',
          customName: 'Mental Clarity',
          effect: {
            type: 'buff',
            description: 'Advantage on all Spirit and Intelligence checks for 10 minutes',
            duration: 600,
            mechanics: { advantage: ['spirit', 'intelligence'] }
          }
        },
        {
          id: 'four-kind',
          cardPattern: 'FOUR_KIND',
          customName: 'Enhanced Insight',
          effect: {
            type: 'buff',
            description: 'Advantage on all ability checks for 10 minutes',
            duration: 600,
            mechanics: { advantage: 'ability_checks' }
          }
        },
        {
          id: 'full-house',
          cardPattern: 'FULL_HOUSE',
          customName: 'Social Intuition',
          effect: {
            type: 'buff',
            description: 'Advantage on Spirit and Charisma checks for 10 minutes',
            duration: 600,
            mechanics: { advantage: ['spirit', 'charisma'] }
          }
        },
        {
          id: 'flush',
          cardPattern: 'FLUSH',
          customName: 'Intellectual Boost',
          effect: {
            type: 'buff',
            description: 'Advantage on Intelligence-based checks for 10 minutes',
            duration: 600,
            mechanics: { advantage: ['intelligence'] }
          }
        },
        {
          id: 'straight',
          cardPattern: 'STRAIGHT',
          customName: 'Tactical Foresight',
          effect: {
            type: 'buff',
            description: 'Advantage on next 3 ability checks or saving throws',
            duration: 600,
            mechanics: { advantage: 'next_3_checks' }
          }
        },
        {
          id: 'three-kind',
          cardPattern: 'THREE_KIND',
          customName: 'Spiritual Insight',
          effect: {
            type: 'buff',
            description: 'Advantage on Spirit-based checks for 10 minutes',
            duration: 600,
            mechanics: { advantage: ['spirit'] }
          }
        },
        {
          id: 'two-pair',
          cardPattern: 'TWO_PAIR',
          customName: 'Minor Foresight',
          effect: {
            type: 'buff',
            description: 'Advantage on next 2 ability checks',
            duration: 600,
            mechanics: { advantage: 'next_2_checks' }
          }
        },
        {
          id: 'pair',
          cardPattern: 'PAIR',
          customName: 'Brief Insight',
          effect: {
            type: 'buff',
            description: 'Advantage on next ability check',
            duration: 600,
            mechanics: { advantage: 'next_1_check' }
          }
        },
        {
          id: 'high-card',
          cardPattern: 'ANY',
          customName: 'Vague Premonition',
          effect: {
            type: 'utility',
            description: 'Gain insight into one upcoming challenge (GM discretion)',
            duration: 600,
            mechanics: { gm_insight: true }
          }
        }
      ]
    },
    targetingConfig: {
      targetingType: 'self',
      range: 0,
      validTargets: ['self']
    },
    resourceCost: {
      mana: 10,
      health: 0,
      stamina: 0,
      focus: 0
    },
    durationConfig: {
      type: 'timed',
      value: 600,
      unit: 'seconds',
      concentration: false,
      dispellable: true
    },
    cooldownConfig: {
      type: 'short_rest',
      value: 1,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'divination'
    },
    mechanicsConfig: {
      cards: {
        enabled: true,
        system: 'poker',
        type: 'builder',
        thresholdValue: 3,
        resolutionMethod: 'cards',
        cardSuccessRule: 'face_cards',
        effectScaling: {
          enabled: true,
          scalingType: 'card_value',
          baseEffect: 'minor_insight',
          enhancedEffect: 'major_insight'
        }
      },
      combos: null,
      coins: null,
      stateRequirements: [],
      stateOptions: {
        thresholds: [
          { value: 1, effect: 'basic_divination' },
          { value: 3, effect: 'enhanced_divination' },
          { value: 5, effect: 'perfect_divination' }
        ]
      }
    },
    resolution: 'CARDS',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'divination',
    castingDescription: 'You shuffle mystical cards and draw them with focused intent.',
    effectDescription: 'The cards glow with divine energy as they reveal glimpses of the future.',
    impactDescription: 'You gain supernatural insight based on the cards\' combination.'
  },

  // 8. Mind Spike - Psychic damage spell
  {
    id: 'mind-spike',
    name: 'Mind Spike',
    description: 'You reach into the mind of one creature you can see and cause a spike of psychic pain. The target must make a Spirit saving throw or take psychic damage.',
    icon: 'spell_shadow_mindsteal',

    spellType: 'ACTION',
    tags: ['damage', 'psychic', 'mental', 'single-target'],
    effectTypes: ['damage'],
    damageTypes: ['psychic'],
    damageConfig: {
      damageType: 'direct',
      elementType: 'psychic',
      formula: '3d8',
      hasDotEffect: false,
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2
      },
      savingThrow: {
        enabled: true,
        attribute: 'spirit',
        difficulty: 15,
        onSuccess: 'no_damage',
        onFailure: 'full_damage'
      }
    },
    targetingConfig: {
      targetingType: 'single',
      range: 60,
      validTargets: ['enemy'],
      requiresLineOfSight: true,
      ignoresCover: false
    },
    resourceCost: {
      mana: 18,
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
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'psychic'
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'shadow',
    castingDescription: 'You focus your mental energy and reach into the target\'s mind.',
    effectDescription: 'The target\'s eyes briefly glow with dark energy.',
    impactDescription: 'The target reels from intense psychic pain.'
  },

  // 9. Blade Dance - Multi-target melee spell
  {
    id: 'blade-dance',
    name: 'Blade Dance',
    description: 'You perform a deadly dance with your weapon, striking multiple enemies in a whirling display of martial prowess.',
    icon: 'ability_warrior_bladestorm',

    spellType: 'ACTION',
    tags: ['damage', 'slashing', 'multi-target', 'melee'],
    effectTypes: ['damage'],
    damageTypes: ['slashing'],
    damageConfig: {
      damageType: 'direct',
      elementType: 'slashing',
      formula: '4d6',
      hasDotEffect: false,
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        explodingDice: false,
        critEffects: ['additional_strike']
      },
      multiTargetConfig: {
        enabled: true,
        maxTargets: 6,
        damageScaling: 'per_target',
        scalingFormula: 'base_damage * (1 + target_count * 0.1)',
        hitRollPerTarget: true,
        movementBetweenTargets: true
      },
      combatMechanics: {
        requiresMeleeWeapon: true,
        weaponDamageBonus: true,
        strengthModifier: true,
        opportunityAttacks: 'immune_during_dance'
      }
    },
    targetingConfig: {
      targetingType: 'area',
      areaType: 'sphere',
      radius: 10,
      range: 0,
      validTargets: ['enemy'],
      aoeConfig: {
        centerType: 'caster',
        spreadType: 'whirlwind',
        requiresMovement: true,
        immuneToOpportunityAttacks: true,
        visualEffect: 'blade_dance'
      }
    },
    resourceCost: {
      mana: 25,
      health: 0,
      stamina: 15,
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
      type: 'encounter',
      value: 1,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'martial'
    },
    procConfig: {
      enabled: true,
      procType: 'critical_strike',
      procChance: 20,
      effectType: 'damage',
      triggerLimit: 1,
      spellId: null,
      procEffects: [
        {
          name: 'Whirlwind Extension',
          description: 'On critical hit, extend dance for 1 additional target',
          chance: 100,
          effect: 'add_target'
        },
        {
          name: 'Momentum Build',
          description: 'Each hit increases next attack damage by 10%',
          chance: 100,
          effect: 'damage_stack'
        }
      ]
    },
    criticalConfig: {
      enabled: true,
      critType: 'dice',
      critMultiplier: 2,
      critDiceOnly: false,
      extraDice: '1d6',
      explodingDice: false,
      critEffects: ['additional_strike', 'momentum_build'],
      spellEffect: null
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'martial',
    castingDescription: 'You begin a graceful but deadly dance with your weapon.',
    effectDescription: 'You spin and weave through enemies, striking with precision.',
    impactDescription: 'Multiple enemies are caught in your whirling blade dance.'
  },

  // ===== EXPANDED SPELL LIBRARY - PART 1: ELEMENTAL MAGIC =====

  // 11. Frost Bolt - Classic ice damage spell
  {
    id: 'frost-bolt',
    name: 'Frost Bolt',
    description: 'You hurl a shard of ice at a target, dealing cold damage and potentially slowing their movement.',
    icon: 'spell_frost_frostbolt02',
    spellType: 'ACTION',
    tags: ['damage', 'cold', 'projectile', 'single-target'],
    effectTypes: ['damage', 'debuff'],
    damageTypes: ['cold'],
    damageConfig: {
      formula: '1d8 + INT',
      damageType: 'cold',
      scaling: {
        enabled: true,
        scalingType: 'spell_level',
        formula: '+1d8 per level'
      }
    },
    debuffConfig: {
      duration: 6,
      durationValue: 6,
      durationType: 'time',
      durationUnit: 'seconds',
      restType: 'short',
      canBeDispelled: true,
      concentrationRequired: false,
      stackingRule: 'replace',
      maxStacks: 1,
      magnitude: 1,
      magnitudeType: 'flat',
      statModifiers: [
        { stat: 'speed', value: -10, isPercentage: false }
      ],
      statusEffects: ['chilled', 'slowed'],
      isProgressive: false,
      debuffs: [
        {
          name: 'Chilled',
          description: 'Movement speed reduced by 10 feet',
          duration: 6,
          effects: {
            movementSpeedReduction: 10,
            stackable: false,
            coldResistanceReduction: 5,
            vulnerableToFire: true
          }
        }
      ]
    },
    targetingConfig: {
      targetingType: 'single',
      range: 120,
      validTargets: ['enemy', 'neutral']
    },
    resourceCost: {
      mana: 8,
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
      type: 'none',
      value: 0,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: null
    },
    mechanicsConfig: {
      savingThrow: {
        enabled: false
      },
      attackRoll: {
        enabled: true,
        attackType: 'spell',
        criticalRange: 20
      }
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'frost',
    castingDescription: 'You gather frigid energy and shape it into a crystalline projectile.',
    effectDescription: 'A shard of ice streaks toward your target with deadly precision.',
    impactDescription: 'The ice shard strikes with a burst of freezing energy.'
  },

  // 12. Lightning Strike - Electric damage with chain potential
  {
    id: 'lightning-strike',
    name: 'Lightning Strike',
    description: 'You call down a bolt of lightning that strikes your target and may arc to nearby enemies.',
    icon: 'spell_nature_lightning',
    spellType: 'ACTION',
    tags: ['damage', 'lightning', 'chain', 'area'],
    effectTypes: ['damage'],
    damageTypes: ['lightning'],
    damageConfig: {
      damageType: 'direct',
      elementType: 'lightning',
      formula: '2d6 + 3',
      hasDotEffect: false,
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        explodingDice: false,
        critEffects: ['chain_to_additional_target']
      },
      savingThrow: 'agility',
      savingThrowType: 'agility',
      difficultyClass: 13,
      partialEffect: 'half_damage',
      partialEffectFormula: 'damage/2',
      chainConfig: {
        enabled: true,
        maxTargets: 3,
        range: 15,
        damageReduction: 0.5,
        intelligentTargeting: true,
        avoidAllies: true
      }
    },
    areaConfig: {
      areaType: 'chain',
      size: 30,
      maxTargets: 3,
      chainRange: 15,
      falloffType: 'half_damage',
      friendlyFire: false
    },
    targetingConfig: {
      targetingType: 'single',
      range: 150,
      validTargets: ['enemy', 'neutral']
    },
    resourceCost: {
      mana: 12,
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
      type: 'none',
      value: 0,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: null
    },
    mechanicsConfig: {
      savingThrow: {
        enabled: true,
        ability: 'agility',
        dc: 13,
        successEffect: 'half_damage'
      }
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'lightning',
    castingDescription: 'You raise your hand skyward, calling upon the power of the storm.',
    effectDescription: 'A brilliant bolt of lightning crashes down from above.',
    impactDescription: 'Electricity arcs between targets in a dazzling display of power.'
  },

  // 13. Flame Burst - Fire area damage
  {
    id: 'flame-burst',
    name: 'Flame Burst',
    description: 'You create an explosion of fire at a target location, burning all creatures within the area.',
    icon: 'spell_fire_fireball02',
    spellType: 'ACTION',
    tags: ['damage', 'fire', 'area', 'explosion'],
    effectTypes: ['damage'],
    damageTypes: ['fire'],
    damageConfig: {
      damageType: 'direct',
      elementType: 'fire',
      formula: '3d6',
      hasDotEffect: true,
      dotFormula: '1d4',
      dotDuration: 3,
      dotTickType: 'round',
      dotApplication: 'start',
      dotScalingType: 'flat',
      dotTriggerType: 'periodic',
      isProgressiveDot: false,
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        explodingDice: false,
        critEffects: ['ignite_target']
      },
      savingThrow: 'agility',
      savingThrowType: 'agility',
      difficultyClass: 14,
      partialEffect: 'half_damage',
      partialEffectFormula: 'damage/2',
      areaConfig: {
        enabled: true,
        areaType: 'sphere',
        radius: 20,
        maxTargets: 8,
        friendlyFire: true,
        falloffType: 'none'
      }
    },
    areaConfig: {
      areaType: 'sphere',
      size: 20,
      maxTargets: 8,
      falloffType: 'none',
      friendlyFire: true
    },
    targetingConfig: {
      targetingType: 'area',
      range: 150,
      validTargets: ['any']
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
      type: 'none',
      value: 0,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: null
    },
    mechanicsConfig: {
      savingThrow: {
        enabled: true,
        ability: 'agility',
        dc: 14,
        successEffect: 'half_damage'
      }
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'fire',
    castingDescription: 'You gather intense heat in your palms before releasing it.',
    effectDescription: 'A sphere of roaring flames erupts at the target location.',
    impactDescription: 'The explosion sends waves of searing heat in all directions.'
  },

  // ===== PART 2: HEALING AND SUPPORT MAGIC =====

  // 14. Greater Heal - Powerful single-target healing
  {
    id: 'greater-heal',
    name: 'Greater Heal',
    description: 'You channel divine energy to restore a significant amount of health to a single target.',
    icon: 'spell_holy_heal02',
    spellType: 'ACTION',
    tags: ['healing', 'divine', 'single-target', 'restoration'],
    effectTypes: ['healing'],
    healingConfig: {
      healingType: 'direct',
      formula: '3d8 + 4',
      hasHotEffect: false,
      hasShieldEffect: true,
      shieldFormula: '1d6 + 2',
      shieldDuration: 5,
      shieldDamageTypes: 'all',
      shieldOverflow: 'dissipate',
      shieldBreakBehavior: 'fade',
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        explodingDice: false,
        critEffects: ['divine_blessing']
      },
      overheal: {
        enabled: false,
        maxOverheal: 0,
        overhealConversion: 'none'
      }
    },
    targetingConfig: {
      targetingType: 'single',
      range: 60,
      validTargets: ['ally', 'self']
    },
    resourceCost: {
      mana: 18,
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
      type: 'none',
      value: 0,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: null
    },
    mechanicsConfig: {
      castingTime: {
        enabled: true,
        time: 3,
        unit: 'seconds',
        interruptible: true
      }
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'divine',
    castingDescription: 'You place your hands together and channel pure healing energy.',
    effectDescription: 'Golden light flows from your hands to envelop the target.',
    impactDescription: 'The target glows with restorative divine energy.'
  },

  // 15. Circle of Healing - Area healing spell
  {
    id: 'circle-of-healing',
    name: 'Circle of Healing',
    description: 'You create a circle of healing energy that restores health to all allies within the area.',
    icon: 'spell_holy_circleofrenewal',
    spellType: 'ACTION',
    tags: ['healing', 'divine', 'area', 'group'],
    effectTypes: ['healing'],
    healingConfig: {
      healingType: 'direct',
      formula: '2d6 + 3',
      hasHotEffect: true,
      hotFormula: '1d4 + 1',
      hotDuration: 3,
      hotTickType: 'round',
      hotApplication: 'start',
      hotScalingType: 'flat',
      hotTriggerType: 'periodic',
      isProgressiveHot: false,
      hasShieldEffect: false,
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        explodingDice: false,
        critEffects: ['group_blessing']
      },
      areaConfig: {
        enabled: true,
        areaType: 'sphere',
        radius: 30,
        maxTargets: 6,
        friendlyFire: false,
        falloffType: 'none'
      }
    },
    areaConfig: {
      areaType: 'sphere',
      size: 30,
      maxTargets: 6,
      falloffType: 'none',
      friendlyFire: false
    },
    targetingConfig: {
      targetingType: 'area',
      range: 60,
      validTargets: ['ally', 'self']
    },
    resourceCost: {
      mana: 22,
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
      type: 'short_rest',
      value: 1,
      charges: 2,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'group_healing'
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'divine',
    castingDescription: 'You raise your arms and call upon divine grace.',
    effectDescription: 'A circle of golden light expands outward from the target point.',
    impactDescription: 'All allies within the circle are bathed in healing energy.'
  },

  // 16. Shield of Faith - Protective buff spell
  {
    id: 'shield-of-faith',
    name: 'Shield of Faith',
    description: 'You surround an ally with a shimmering field of protective energy that increases their armor and provides damage resistance.',
    icon: 'spell_holy_devotion',
    spellType: 'ACTION',
    tags: ['buff', 'divine', 'protection', 'armor'],
    effectTypes: ['buff'],
    buffConfig: {
      duration: 10,
      durationValue: 10,
      durationType: 'time',
      durationUnit: 'minutes',
      restType: 'short',
      canBeDispelled: true,
      concentrationRequired: true,
      stackingRule: 'replace',
      maxStacks: 1,
      magnitude: 2,
      magnitudeType: 'flat',
      statModifiers: [
        { stat: 'armor', value: 2, isPercentage: false }
      ],
      statusEffects: ['divine_protection', 'blessed'],
      isProgressive: false,
      buffs: [
        {
          name: 'Divine Protection',
          description: '+2 armor and resistance to all damage types',
          duration: 600,
          effects: {
            armorBonus: 2,
            damageResistance: ['all'],
            stackable: false,
            magicalProtection: true,
            faithBonus: 1
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
      mana: 12,
      health: 0,
      stamina: 0,
      focus: 0
    },
    durationConfig: {
      type: 'timed',
      value: 600,
      unit: 'seconds',
      concentration: true,
      dispellable: true
    },
    cooldownConfig: {
      type: 'none',
      value: 0,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: null
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'divine',
    castingDescription: 'You speak words of protection while gesturing toward your ally.',
    effectDescription: 'A shimmering barrier of divine energy surrounds the target.',
    impactDescription: 'The target is enveloped in a protective aura of faith.'
  },

  // ===== PART 3: CONTROL AND DEBUFF MAGIC =====

  // 17. Entangle - Nature control spell
  {
    id: 'entangle',
    name: 'Entangle',
    description: 'You cause thick vines and roots to burst from the ground, restraining creatures in the area.',
    icon: 'spell_nature_stranglevines',
    spellType: 'ACTION',
    tags: ['control', 'nature', 'area', 'restraint'],
    effectTypes: ['control'],
    controlConfig: {
      controlType: 'restrain',
      duration: 60,
      durationUnit: 'seconds',
      effects: [
        {
          name: 'Entangled',
          description: 'Restrained by thick vines and roots',
          duration: 60,
          mechanics: {
            restrained: true,
            movementSpeed: 0,
            disadvantageOnAttacks: true,
            advantageAgainstTarget: true
          }
        }
      ]
    },
    areaConfig: {
      areaType: 'sphere',
      size: 20,
      maxTargets: 4,
      falloffType: 'none',
      friendlyFire: false
    },
    targetingConfig: {
      targetingType: 'area',
      range: 120,
      validTargets: ['enemy', 'neutral']
    },
    resourceCost: {
      mana: 14,
      health: 0,
      stamina: 0,
      focus: 0
    },
    durationConfig: {
      type: 'timed',
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
    mechanicsConfig: {
      savingThrow: {
        enabled: true,
        ability: 'strength',
        dc: 13,
        successEffect: 'no_effect',
        repeatSave: {
          enabled: true,
          interval: 6,
          advantage: false
        }
      }
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'nature',
    castingDescription: 'You place your hand on the ground and speak to the earth.',
    effectDescription: 'Thick vines and roots burst from the ground in a writhing mass.',
    impactDescription: 'Creatures in the area struggle against the grasping vegetation.'
  },

  // 18. Sleep - Mental control spell
  {
    id: 'sleep',
    name: 'Sleep',
    description: 'You send creatures into a magical slumber, causing them to fall unconscious for a short time.',
    icon: 'spell_shadow_sleep',
    spellType: 'ACTION',
    tags: ['control', 'enchantment', 'area', 'unconscious'],
    effectTypes: ['control'],
    controlConfig: {
      controlType: 'unconscious',
      duration: 60,
      durationUnit: 'seconds',
      effects: [
        {
          name: 'Magical Sleep',
          description: 'Unconscious and unable to act',
          duration: 60,
          mechanics: {
            unconscious: true,
            movementSpeed: 0,
            cannotAct: true,
            advantageAgainstTarget: true,
            wakesOnDamage: true
          }
        }
      ]
    },
    areaConfig: {
      areaType: 'sphere',
      size: 20,
      maxTargets: 3,
      falloffType: 'none',
      friendlyFire: false
    },
    targetingConfig: {
      targetingType: 'area',
      range: 90,
      validTargets: ['enemy', 'neutral']
    },
    resourceCost: {
      mana: 16,
      health: 0,
      stamina: 0,
      focus: 0
    },
    durationConfig: {
      type: 'timed',
      value: 60,
      unit: 'seconds',
      concentration: false,
      dispellable: true
    },
    cooldownConfig: {
      type: 'short_rest',
      value: 1,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'mental_control'
    },
    mechanicsConfig: {
      savingThrow: {
        enabled: true,
        ability: 'spirit',
        dc: 14,
        successEffect: 'no_effect'
      }
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'enchantment',
    castingDescription: 'You weave hypnotic patterns in the air with your fingers.',
    effectDescription: 'Shimmering waves of drowsiness wash over the area.',
    impactDescription: 'Affected creatures yawn and collapse into peaceful slumber.'
  },

  // 19. Curse of Weakness - Debuff spell
  {
    id: 'curse-of-weakness',
    name: 'Curse of Weakness',
    description: 'You place a malevolent curse on a target, reducing their physical capabilities and making them more vulnerable.',
    icon: 'spell_shadow_curseofweakness',
    spellType: 'ACTION',
    tags: ['debuff', 'curse', 'single-target', 'weakness'],
    effectTypes: ['debuff'],
    debuffConfig: {
      duration: 300,
      durationUnit: 'seconds',
      debuffs: [
        {
          name: 'Cursed Weakness',
          description: '-2 to Strength and Constitution, vulnerability to all damage',
          duration: 300,
          effects: {
            strengthReduction: 2,
            constitutionReduction: 2,
            damageVulnerability: ['all'],
            stackable: false
          }
        }
      ]
    },
    targetingConfig: {
      targetingType: 'single',
      range: 60,
      validTargets: ['enemy', 'neutral']
    },
    resourceCost: {
      mana: 12,
      health: 0,
      stamina: 0,
      focus: 0
    },
    durationConfig: {
      type: 'timed',
      value: 300,
      unit: 'seconds',
      concentration: false,
      dispellable: true
    },
    cooldownConfig: {
      type: 'none',
      value: 0,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: null
    },
    mechanicsConfig: {
      savingThrow: {
        enabled: true,
        ability: 'spirit',
        dc: 13,
        successEffect: 'no_effect'
      }
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'shadow',
    castingDescription: 'You speak words of malediction while pointing at your target.',
    effectDescription: 'Dark energy flows from your finger toward the target.',
    impactDescription: 'The target is surrounded by a sickly aura of weakness.'
  },

  // ===== PART 4: UTILITY AND SPECIAL MECHANICS =====

  // 20. Teleport - Movement utility spell
  {
    id: 'teleport',
    name: 'Teleport',
    description: 'You instantly transport yourself to a location you can see within range.',
    icon: 'spell_arcane_blink',
    spellType: 'ACTION',
    tags: ['utility', 'teleportation', 'movement', 'arcane'],
    effectTypes: ['utility'],
    utilityConfig: {
      utilityType: 'teleportation',
      effects: [
        {
          name: 'Instant Transport',
          description: 'Teleport to target location',
          duration: 0,
          mechanics: {
            teleportRange: 60,
            requiresLineOfSight: true,
            cannotTeleportIntoSolid: true,
            instantaneous: true
          }
        }
      ]
    },
    targetingConfig: {
      targetingType: 'location',
      range: 60,
      validTargets: ['location']
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
      type: 'short_rest',
      value: 1,
      charges: 2,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'teleportation'
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'arcane',
    castingDescription: 'You focus on your destination and speak the words of translocation.',
    effectDescription: 'You shimmer and fade from view before reappearing elsewhere.',
    impactDescription: 'You materialize at your destination in a brief flash of arcane energy.'
  },

  // 21. Detect Magic - Information gathering spell
  {
    id: 'detect-magic',
    name: 'Detect Magic',
    description: 'You sense the presence of magic within 60 feet of you, revealing magical auras and their schools.',
    icon: 'spell_holy_detectmagic',
    spellType: 'ACTION',
    tags: ['utility', 'detection', 'divination', 'information'],
    effectTypes: ['utility'],
    utilityConfig: {
      utilityType: 'detection',
      effects: [
        {
          name: 'Magical Sight',
          description: 'See magical auras and identify their schools',
          duration: 600,
          mechanics: {
            detectRange: 60,
            identifySchools: true,
            seeInvisible: false,
            detectIllusions: true
          }
        }
      ]
    },
    targetingConfig: {
      targetingType: 'self',
      range: 0,
      validTargets: ['self']
    },
    resourceCost: {
      mana: 6,
      health: 0,
      stamina: 0,
      focus: 0
    },
    durationConfig: {
      type: 'timed',
      value: 600,
      unit: 'seconds',
      concentration: true,
      dispellable: true
    },
    cooldownConfig: {
      type: 'none',
      value: 0,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: null
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'divination',
    castingDescription: 'You close your eyes and attune your senses to magical energies.',
    effectDescription: 'Your eyes glow with a faint blue light as magical sight awakens.',
    impactDescription: 'Magical auras become visible as shimmering outlines around objects.'
  },

  // 22. Dispel Magic - Counter-magic spell
  {
    id: 'dispel-magic-additional',
    name: 'Dispel Magic',
    description: 'You attempt to end one magical effect on a target, potentially removing buffs, debuffs, or ongoing spells.',
    icon: 'spell_holy_dispelmagic',
    spellType: 'ACTION',
    tags: ['utility', 'dispel', 'counter-magic', 'removal'],
    effectTypes: ['utility'],
    utilityConfig: {
      utilityType: 'dispel',
      effects: [
        {
          name: 'Magic Disruption',
          description: 'Remove one magical effect from target',
          duration: 0,
          mechanics: {
            dispelType: 'single_effect',
            targetBuffs: true,
            targetDebuffs: true,
            spellLevelCheck: true,
            baseSuccessChance: 75
          }
        }
      ]
    },
    targetingConfig: {
      targetingType: 'single',
      range: 60,
      validTargets: ['any']
    },
    resourceCost: {
      mana: 12,
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
      type: 'none',
      value: 0,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: null
    },
    mechanicsConfig: {
      spellCheck: {
        enabled: true,
        ability: 'intelligence',
        dc: 'variable',
        successEffect: 'dispel_effect'
      }
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'arcane',
    castingDescription: 'You weave counter-patterns in the air to unravel magical energies.',
    effectDescription: 'Waves of dispelling energy flow toward the target.',
    impactDescription: 'Magical effects flicker and fade as they are disrupted.'
  },

  // ===== PART 5: ADVANCED MECHANICS - CARD AND COIN BASED =====

  // 23. Gambler's Luck - Coin-based buff spell
  {
    id: 'gamblers-luck',
    name: "Gambler's Luck",
    description: 'You flip mystical coins to determine your fortune. The outcome affects your luck in combat and skill checks.',
    icon: 'inv_misc_coin_02',
    spellType: 'ACTION',
    tags: ['buff', 'coin-based', 'luck', 'variable'],
    effectTypes: ['buff'],
    buffConfig: {
      duration: 300,
      durationUnit: 'seconds',
      buffs: [
        {
          name: 'Fortune\'s Favor',
          description: 'Bonus to attack rolls and skill checks based on coin flips',
          duration: 300,
          effects: {
            attackBonus: 'variable',
            skillBonus: 'variable',
            coinDependent: true
          }
        }
      ]
    },
    rollableTable: {
      enabled: true,
      name: 'Fortune\'s Coins',
      description: 'Flip 5 coins to determine your luck',
      resolutionType: 'COINS',
      resolutionConfig: {
        coinCount: 5,
        diceType: 'd20',
        cardCount: 3
      },
      entries: [
        {
          id: 'all-heads',
          coinPattern: 'ALL_HEADS',
          customName: 'Perfect Fortune',
          effect: {
            type: 'buff',
            description: '+3 to all rolls for 5 minutes',
            duration: 300,
            mechanics: { allRollsBonus: 3 }
          }
        },
        {
          id: 'majority-heads',
          coinPattern: 'MAJORITY_HEADS',
          customName: 'Good Luck',
          effect: {
            type: 'buff',
            description: '+2 to all rolls for 5 minutes',
            duration: 300,
            mechanics: { allRollsBonus: 2 }
          }
        },
        {
          id: 'equal-split',
          coinPattern: 'EQUAL_SPLIT',
          customName: 'Balanced Fortune',
          effect: {
            type: 'buff',
            description: '+1 to all rolls for 5 minutes',
            duration: 300,
            mechanics: { allRollsBonus: 1 }
          }
        },
        {
          id: 'majority-tails',
          coinPattern: 'MAJORITY_TAILS',
          customName: 'Bad Luck',
          effect: {
            type: 'debuff',
            description: '-1 to all rolls for 5 minutes',
            duration: 300,
            mechanics: { allRollsPenalty: 1 }
          }
        },
        {
          id: 'all-tails',
          coinPattern: 'ALL_TAILS',
          customName: 'Cursed Fortune',
          effect: {
            type: 'debuff',
            description: '-2 to all rolls for 5 minutes',
            duration: 300,
            mechanics: { allRollsPenalty: 2 }
          }
        }
      ]
    },
    targetingConfig: {
      targetingType: 'self',
      range: 0,
      validTargets: ['self']
    },
    resourceCost: {
      mana: 8,
      health: 0,
      stamina: 0,
      focus: 0
    },
    durationConfig: {
      type: 'timed',
      value: 300,
      unit: 'seconds',
      concentration: false,
      dispellable: true
    },
    cooldownConfig: {
      type: 'short_rest',
      value: 1,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'fortune'
    },
    mechanicsConfig: {
      coins: {
        enabled: true,
        system: 'standard',
        type: 'fortune',
        flipCount: 5,
        resolutionMethod: 'coins',
        coinSuccessRule: 'majority_heads'
      }
    },
    resolution: 'COINS',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'fortune',
    castingDescription: 'You produce mystical coins and flip them into the air.',
    effectDescription: 'The coins spin and glimmer with magical energy as they fall.',
    impactDescription: 'Your fate is sealed as the coins land and determine your fortune.'
  },

  // ===== PART 6: ADVANCED SPELLS - SUMMONING AND TRANSFORMATION =====

  // 24. Summon Elemental - Summoning spell with creature library integration
  {
    id: 'summon-elemental',
    name: 'Summon Elemental',
    description: 'You call forth an elemental spirit from the creature library to aid you in battle. The elemental fights alongside you for a limited time.',
    icon: 'spell_fire_elemental_totem',
    spellType: 'ACTION',
    tags: ['summoning', 'elemental', 'minion', 'duration'],
    effectTypes: ['summoning'],
    summoningConfig: {
      summonType: 'elemental',
      duration: 600,
      durationUnit: 'seconds',
      useCreatureLibrary: true,
      allowedCreatureTypes: ['elemental'],
      allowedCreatureTags: ['fire', 'water', 'earth', 'air', 'elemental'],
      maxCreatureLevel: 5,
      selectedCreature: 'fire-elemental', // Default to Fire Elemental
      summonQuantity: 1,
      concentration: true
    },
    targetingConfig: {
      targetingType: 'location',
      range: 30,
      validTargets: ['location']
    },
    resourceCost: {
      mana: 25,
      health: 0,
      stamina: 0,
      focus: 0
    },
    durationConfig: {
      type: 'timed',
      value: 600,
      unit: 'seconds',
      concentration: true,
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
    visualTheme: 'elemental',
    castingDescription: 'You speak the ancient words of binding and gesture to the elemental planes.',
    effectDescription: 'A rift opens and elemental energy pours forth, taking shape.',
    impactDescription: 'An elemental being materializes and awaits your commands.'
  },

  // 25. Polymorph - Transformation spell
  {
    id: 'polymorph',
    name: 'Polymorph',
    description: 'You transform a creature into a harmless animal, replacing their statistics with those of the new form.',
    icon: 'spell_nature_polymorph',
    spellType: 'ACTION',
    tags: ['transformation', 'control', 'single-target', 'polymorph'],
    effectTypes: ['control'],
    controlConfig: {
      controlType: 'transform',
      duration: 600,
      durationUnit: 'seconds',
      effects: [
        {
          name: 'Animal Form',
          description: 'Transformed into a harmless animal (sheep, rabbit, etc.)',
          duration: 600,
          mechanics: {
            newForm: 'animal',
            healthOverride: 15,
            armorOverride: 10,
            cannotCast: true,
            cannotAttack: true,
            movementSpeed: 20,
            retainsPersonality: true
          }
        }
      ]
    },
    targetingConfig: {
      targetingType: 'single',
      range: 60,
      validTargets: ['enemy', 'neutral']
    },
    resourceCost: {
      mana: 20,
      health: 0,
      stamina: 0,
      focus: 0
    },
    durationConfig: {
      type: 'timed',
      value: 600,
      unit: 'seconds',
      concentration: true,
      dispellable: true
    },
    cooldownConfig: {
      type: 'long_rest',
      value: 1,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'transformation'
    },
    mechanicsConfig: {
      savingThrow: {
        enabled: true,
        ability: 'spirit',
        dc: 15,
        successEffect: 'no_effect'
      }
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'transformation',
    castingDescription: 'You weave complex patterns while speaking words of transformation.',
    effectDescription: 'Shimmering energy envelops the target as their form begins to change.',
    impactDescription: 'The target\'s body shifts and transforms into that of a harmless animal.'
  },

  // 26. Time Stop - Ultimate utility spell
  {
    id: 'time-stop',
    name: 'Time Stop',
    description: 'You briefly stop the flow of time for everyone but yourself, allowing you to act freely for a few moments.',
    icon: 'spell_arcane_timestop',
    spellType: 'ACTION',
    tags: ['utility', 'time', 'ultimate', 'self-buff'],
    effectTypes: ['utility'],
    utilityConfig: {
      utilityType: 'time_manipulation',
      effects: [
        {
          name: 'Temporal Stasis',
          description: 'Time stops for all creatures except you',
          duration: 18,
          mechanics: {
            extraTurns: 3,
            cannotTargetOthers: true,
            cannotDealDamage: true,
            canMove: true,
            canCastUtility: true,
            canPrepare: true
          }
        }
      ]
    },
    targetingConfig: {
      targetingType: 'self',
      range: 0,
      validTargets: ['self']
    },
    resourceCost: {
      mana: 50,
      health: 0,
      stamina: 0,
      focus: 0
    },
    durationConfig: {
      type: 'special',
      value: 18,
      unit: 'seconds',
      concentration: false,
      dispellable: false
    },
    cooldownConfig: {
      type: 'long_rest',
      value: 1,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: 'ultimate'
    },
    resolution: 'DICE',
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: [],
    visualTheme: 'time',
    castingDescription: 'You speak the forbidden words that command time itself.',
    effectDescription: 'The world around you freezes as time comes to a halt.',
    impactDescription: 'You move freely through a world of frozen moments.'
  }
];