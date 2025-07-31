/**
 * Enhanced Spell Library
 * 
 * This file contains a comprehensive collection of original, high-quality spells
 * that fully utilize the spell wizard's capabilities while avoiding WoW-like naming.
 */

// Core Damage Spells - Elemental Theme
export const ELEMENTAL_DAMAGE_SPELLS = [
  {
    id: 'ethereal-flame-manifestation',
    name: 'Ethereal Flame Manifestation',
    description: 'You focus your will and speak the incantation, drawing upon elemental forces. This spell channels destructive energy, manifesting as ethereal flame manifestation. The magical energies resonate with the fundamental forces of elemental, creating lasting effects that reflect the spell\'s true nature.',
    level: 2,
    spellType: 'ACTION',
    effectTypes: ['damage'],
    damageTypes: ['fire'],
    tags: ['elemental', 'damage', 'fire'],
    visualTheme: 'fire',
    icon: 'spell_fire_flamebolt',
    
    damageConfig: {
      damageType: 'direct',
      elementType: 'fire',
      formula: '3d6 + 4',
      hasDotEffect: true,
      dotFormula: '1d4',
      dotDuration: 3,
      dotTickType: 'round',
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        critDiceOnly: false
      }
    },
    
    targetingConfig: {
      targetingType: 'single',
      range: 60,
      validTargets: ['enemy']
    },
    
    resourceCost: {
      mana: { baseAmount: 25 }
    },
    
    durationConfig: {
      durationType: 'instant',
      durationValue: 0
    },
    
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: []
  },

  {
    id: 'crystalline-frost-convergence',
    name: 'Crystalline Frost Convergence',
    description: 'You focus your will and speak the incantation, drawing upon elemental forces. This spell channels destructive energy, manifesting as crystalline frost convergence. The magical energies resonate with the fundamental forces of elemental, creating lasting effects that reflect the spell\'s true nature.',
    level: 3,
    spellType: 'ACTION',
    effectTypes: ['damage', 'debuff'],
    damageTypes: ['cold'],
    tags: ['elemental', 'damage', 'debuff', 'cold'],
    visualTheme: 'fire',
    icon: 'spell_frost_frostbolt02',
    
    damageConfig: {
      damageType: 'direct',
      elementType: 'cold',
      formula: '2d8 + 6',
      hasDotEffect: false,
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        critDiceOnly: false
      }
    },
    
    debuffConfig: {
      debuffs: [
        {
          name: 'Frost Slow',
          description: 'Movement and actions are slowed by crystalline ice',
          duration: 240,
          effects: {
            statModifiers: {
              agility: -3
            },
            movementReduction: 50
          }
        }
      ]
    },
    
    targetingConfig: {
      targetingType: 'area',
      aoeShape: 'circle',
      aoeParameters: { radius: 15 },
      range: 45,
      validTargets: ['enemy']
    },
    
    resourceCost: {
      mana: { baseAmount: 35 }
    },
    
    durationConfig: {
      durationType: 'instant',
      durationValue: 0
    },
    
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: []
  },

  {
    id: 'resonant-storm-essence',
    name: 'Resonant Storm Essence',
    description: 'You focus your will and speak the incantation, drawing upon elemental forces. This spell channels destructive energy, manifesting as resonant storm essence. The magical energies resonate with the fundamental forces of elemental, creating lasting effects that reflect the spell\'s true nature.',
    level: 4,
    spellType: 'CHANNELED',
    effectTypes: ['damage'],
    damageTypes: ['lightning'],
    tags: ['elemental', 'damage', 'lightning', 'channeled'],
    visualTheme: 'fire',
    icon: 'spell_nature_lightning',
    
    damageConfig: {
      damageType: 'direct',
      elementType: 'lightning',
      formula: '2d6 + 8',
      hasDotEffect: false,
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        critDiceOnly: false
      }
    },
    
    channelingConfig: {
      maxChannelDuration: 4,
      tickFrequency: 'END_OF_TURN',
      concentrationDC: 12,
      effectPerTick: {
        damage: '1d6 + 2',
        targeting: 'maintain_target'
      }
    },
    
    targetingConfig: {
      targetingType: 'single',
      range: 80,
      validTargets: ['enemy']
    },
    
    resourceCost: {
      mana: { baseAmount: 40 }
    },
    
    durationConfig: {
      durationType: 'concentration',
      durationValue: 4
    },
    
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: []
  }
];

// Core Healing Spells - Divine Theme
export const DIVINE_HEALING_SPELLS = [
  {
    id: 'sublime-grace-blessing',
    name: 'Sublime Grace Blessing',
    description: 'You focus your will and speak the incantation, drawing upon divine forces. This spell mends wounds and restores vitality, manifesting as sublime grace blessing. The magical energies resonate with the fundamental forces of divine, creating lasting effects that reflect the spell\'s true nature.',
    level: 2,
    spellType: 'ACTION',
    effectTypes: ['healing', 'buff'],
    damageTypes: [],
    tags: ['divine', 'healing', 'buff'],
    visualTheme: 'holy',
    icon: 'spell_holy_heal',
    
    healingConfig: {
      healingType: 'direct',
      formula: '2d6 + 4',
      hasHotEffect: true,
      hasShieldEffect: false,
      hotFormula: '1d4 + 1',
      hotDuration: 3,
      hotTickType: 'round',
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2
      }
    },
    
    buffConfig: {
      buffs: [
        {
          name: 'Divine Protection',
          description: 'Enhances constitution through divine blessing',
          duration: 480,
          effects: {
            statModifiers: {
              constitution: 2
            }
          }
        }
      ]
    },
    
    targetingConfig: {
      targetingType: 'single',
      range: 30,
      validTargets: ['ally', 'self']
    },
    
    resourceCost: {
      mana: { baseAmount: 25 }
    },
    
    durationConfig: {
      durationType: 'instant',
      durationValue: 0
    },
    
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: []
  },

  {
    id: 'celestial-sanctuary-covenant',
    name: 'Celestial Sanctuary Covenant',
    description: 'You focus your will and speak the incantation, drawing upon divine forces. This spell mends wounds and restores vitality, manifesting as celestial sanctuary covenant. The magical energies resonate with the fundamental forces of divine, creating lasting effects that reflect the spell\'s true nature.',
    level: 5,
    spellType: 'ZONE',
    effectTypes: ['healing'],
    damageTypes: [],
    tags: ['divine', 'healing', 'zone', 'sanctuary'],
    visualTheme: 'holy',
    icon: 'spell_holy_guardianspirit',
    
    healingConfig: {
      healingType: 'hot',
      formula: '1d4',
      hasHotEffect: true,
      hasShieldEffect: false,
      hotFormula: '2d4 + 5',
      hotDuration: 8,
      hotTickType: 'round',
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2
      }
    },
    
    zoneConfig: {
      zoneType: 'sanctuary',
      zoneDuration: 600,
      zoneRadius: 30,
      entryEffect: {
        healing: '1d6 + 3'
      },
      persistentEffect: {
        healing: '1d4 + 1',
        frequency: 'round'
      },
      exitEffect: null
    },
    
    targetingConfig: {
      targetingType: 'area',
      aoeShape: 'circle',
      aoeParameters: { radius: 30 },
      range: 0,
      validTargets: ['ally', 'self']
    },
    
    resourceCost: {
      mana: { baseAmount: 60 }
    },
    
    durationConfig: {
      durationType: 'rounds',
      durationValue: 10
    },
    
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: []
  }
];

// Advanced Mechanic Spells - Card and Coin Systems
export const ADVANCED_MECHANIC_SPELLS = [
  {
    id: 'fate-weaver-paradigm',
    name: 'Fate Weaver\'s Paradigm',
    description: 'You carefully place magical energies that await activation, drawing upon arcane forces. This spell channels destructive energy, manifesting as fate weaver\'s paradigm. The magical energies resonate with the fundamental forces of arcane, creating lasting effects that reflect the spell\'s true nature.',
    level: 6,
    spellType: 'TRAP',
    effectTypes: ['damage', 'control'],
    damageTypes: ['force'],
    tags: ['arcane', 'damage', 'control', 'cards', 'fate'],
    visualTheme: 'arcane',
    icon: 'inv_misc_book_11',
    
    damageConfig: {
      damageType: 'direct',
      elementType: 'force',
      formula: '4d6 + 12',
      hasDotEffect: false,
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        critDiceOnly: false
      }
    },
    
    controlConfig: {
      controlType: 'stun',
      duration: 2,
      saveType: 'spirit',
      saveDC: 16,
      onSaveSuccess: 'half_duration',
      onSaveFailure: 'full_effect'
    },
    
    mechanicsConfig: {
      cards: {
        enabled: true,
        system: 'fate',
        type: 'trigger',
        thresholdValue: 1,
        resolutionMethod: 'cards',
        cardSuccessRule: 'face_cards'
      }
    },
    
    rollableTable: {
      enabled: true,
      tableType: 'cards',
      entries: [
        {
          id: 'royal-flush',
          cardPattern: 'ROYAL_FLUSH',
          customName: 'Perfect Fate',
          effect: {
            type: 'damage_control',
            description: 'Maximum damage + 5 round stun',
            mechanics: { damageMultiplier: 2, stunDuration: 5 }
          }
        },
        {
          id: 'straight-flush',
          cardPattern: 'STRAIGHT_FLUSH',
          customName: 'Aligned Destiny',
          effect: {
            type: 'damage_control',
            description: 'Maximum damage + 3 round stun',
            mechanics: { damageMultiplier: 1.5, stunDuration: 3 }
          }
        },
        {
          id: 'four-kind',
          cardPattern: 'FOUR_KIND',
          customName: 'Focused Power',
          effect: {
            type: 'damage',
            description: 'Double damage',
            mechanics: { damageMultiplier: 2 }
          }
        }
      ]
    },
    
    trapConfig: {
      triggerType: 'proximity',
      triggerRadius: 10,
      armingTime: 1,
      detectDC: 18,
      disarmDC: 20,
      maxTargets: 3
    },
    
    targetingConfig: {
      targetingType: 'area',
      aoeShape: 'circle',
      aoeParameters: { radius: 15 },
      range: 60,
      validTargets: ['enemy']
    },
    
    resourceCost: {
      mana: { baseAmount: 70 }
    },
    
    durationConfig: {
      durationType: 'rounds',
      durationValue: 20
    },
    
    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: []
  }
];

// Arcane Utility Spells
export const ARCANE_UTILITY_SPELLS = [
  {
    id: 'twisted-nexus-theorem',
    name: 'Twisted Nexus Theorem',
    description: 'You focus your will and speak the incantation, drawing upon arcane forces. This spell provides practical magical assistance, manifesting as twisted nexus theorem. The magical energies resonate with the fundamental forces of arcane, creating lasting effects that reflect the spell\'s true nature.',
    level: 3,
    spellType: 'ACTION',
    effectTypes: ['utility'],
    damageTypes: [],
    tags: ['arcane', 'utility', 'teleportation'],
    visualTheme: 'arcane',
    icon: 'spell_arcane_blink',

    utilityConfig: {
      utilityType: 'teleportation',
      teleportDistance: 60,
      requiresLoS: false,
      canTeleportAllies: false,
      teleportAccuracy: 95,
      failureConsequence: 'random_location'
    },

    targetingConfig: {
      targetingType: 'self',
      range: 0,
      validTargets: ['self']
    },

    resourceCost: {
      mana: { baseAmount: 30 }
    },

    durationConfig: {
      durationType: 'instant',
      durationValue: 0
    },

    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: []
  },

  {
    id: 'pure-matrix-confluence',
    name: 'Pure Matrix Confluence',
    description: 'You focus your will and speak the incantation, drawing upon arcane forces. This spell provides practical magical assistance, manifesting as pure matrix confluence. The magical energies resonate with the fundamental forces of arcane, creating lasting effects that reflect the spell\'s true nature.',
    level: 4,
    spellType: 'ACTION',
    effectTypes: ['utility', 'buff'],
    damageTypes: [],
    tags: ['arcane', 'utility', 'buff', 'enhancement'],
    visualTheme: 'arcane',
    icon: 'spell_arcane_arcane04',

    utilityConfig: {
      utilityType: 'enhancement',
      enhancementType: 'spell_power',
      enhancementValue: 25,
      enhancementDuration: 600
    },

    buffConfig: {
      buffs: [
        {
          name: 'Arcane Empowerment',
          description: 'Enhances intelligence and spell effectiveness',
          duration: 600,
          effects: {
            statModifiers: {
              intelligence: 4
            },
            spellPowerBonus: 25
          }
        }
      ]
    },

    targetingConfig: {
      targetingType: 'single',
      range: 30,
      validTargets: ['ally', 'self']
    },

    resourceCost: {
      mana: { baseAmount: 45 }
    },

    durationConfig: {
      durationType: 'rounds',
      durationValue: 10
    },

    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: []
  }
];

// Nature Control Spells
export const NATURE_CONTROL_SPELLS = [
  {
    id: 'verdant-growth-harmony',
    name: 'Verdant Growth Harmony',
    description: 'You focus your will and speak the incantation, drawing upon nature forces. This spell manipulates the battlefield, manifesting as verdant growth harmony. The magical energies resonate with the fundamental forces of nature, creating lasting effects that reflect the spell\'s true nature.',
    level: 3,
    spellType: 'ACTION',
    effectTypes: ['control', 'utility'],
    damageTypes: [],
    tags: ['nature', 'control', 'utility', 'growth'],
    visualTheme: 'nature',
    icon: 'spell_nature_thorns',

    controlConfig: {
      controlType: 'entangle',
      duration: 4,
      saveType: 'strength',
      saveDC: 14,
      onSaveSuccess: 'escape',
      onSaveFailure: 'restrained',
      repeatSave: true
    },

    utilityConfig: {
      utilityType: 'terrain_modification',
      terrainType: 'difficult',
      areaSize: 20,
      duration: 600
    },

    targetingConfig: {
      targetingType: 'area',
      aoeShape: 'circle',
      aoeParameters: { radius: 20 },
      range: 60,
      validTargets: ['any']
    },

    resourceCost: {
      mana: { baseAmount: 35 }
    },

    durationConfig: {
      durationType: 'rounds',
      durationValue: 6
    },

    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: []
  }
];

// Mind Control and Debuff Spells
export const MIND_CONTROL_SPELLS = [
  {
    id: 'piercing-thought-fragment',
    name: 'Piercing Thought Fragment',
    description: 'You focus your will and speak the incantation, drawing upon mind forces. This spell weakens the target with hindering magic, manifesting as piercing thought fragment. The magical energies resonate with the fundamental forces of mind, creating lasting effects that reflect the spell\'s true nature.',
    level: 2,
    spellType: 'ACTION',
    effectTypes: ['damage', 'debuff'],
    damageTypes: ['psychic'],
    tags: ['mind', 'damage', 'debuff', 'psychic'],
    visualTheme: 'shadow',
    icon: 'spell_shadow_mindsteal',

    damageConfig: {
      damageType: 'direct',
      elementType: 'psychic',
      formula: '2d6 + 4',
      hasDotEffect: false,
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        critDiceOnly: false
      }
    },

    debuffConfig: {
      debuffs: [
        {
          name: 'Mental Confusion',
          description: 'Mind is clouded, reducing mental capabilities',
          duration: 300,
          effects: {
            statModifiers: {
              intelligence: -2,
              spirit: -2
            }
          }
        }
      ]
    },

    targetingConfig: {
      targetingType: 'single',
      range: 45,
      validTargets: ['enemy']
    },

    resourceCost: {
      mana: { baseAmount: 25 }
    },

    durationConfig: {
      durationType: 'instant',
      durationValue: 0
    },

    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: []
  }
];

// Temporal Manipulation Spells
export const TEMPORAL_SPELLS = [
  {
    id: 'fleeting-moment-stasis',
    name: 'Fleeting Moment Stasis',
    description: 'You focus your will and speak the incantation, drawing upon temporal forces. This spell manipulates the battlefield, manifesting as fleeting moment stasis. The magical energies resonate with the fundamental forces of temporal, creating lasting effects that reflect the spell\'s true nature.',
    level: 4,
    spellType: 'REACTION',
    effectTypes: ['control', 'utility'],
    damageTypes: [],
    tags: ['temporal', 'control', 'utility', 'time'],
    visualTheme: 'arcane',
    icon: 'spell_arcane_slow',

    controlConfig: {
      controlType: 'time_stop',
      duration: 1,
      saveType: 'spirit',
      saveDC: 16,
      onSaveSuccess: 'immune',
      onSaveFailure: 'full_effect',
      affectedActions: ['movement', 'attacks', 'spells']
    },

    utilityConfig: {
      utilityType: 'temporal_manipulation',
      temporalEffect: 'pause',
      duration: 1,
      affectedTargets: 'single'
    },

    reactionConfig: {
      triggerType: 'enemy_action',
      triggerCondition: 'target_attacks_ally',
      reactionWindow: 'immediate',
      usesPerTurn: 1
    },

    targetingConfig: {
      targetingType: 'single',
      range: 60,
      validTargets: ['enemy']
    },

    resourceCost: {
      mana: { baseAmount: 50 }
    },

    durationConfig: {
      durationType: 'instant',
      durationValue: 0
    },

    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: []
  },

  {
    id: 'eternal-echo-paradox',
    name: 'Eternal Echo Paradox',
    description: 'You focus your will and speak the incantation, drawing upon temporal forces. This spell channels destructive energy, manifesting as eternal echo paradox. The magical energies resonate with the fundamental forces of temporal, creating lasting effects that reflect the spell\'s true nature.',
    level: 6,
    spellType: 'STATE',
    effectTypes: ['damage', 'utility'],
    damageTypes: ['force'],
    tags: ['temporal', 'damage', 'utility', 'echo'],
    visualTheme: 'arcane',
    icon: 'spell_arcane_arcane03',

    damageConfig: {
      damageType: 'direct',
      elementType: 'force',
      formula: '3d8 + 12',
      hasDotEffect: false,
      criticalConfig: {
        enabled: true,
        critType: 'dice',
        critMultiplier: 2,
        critDiceOnly: false
      }
    },

    stateConfig: {
      activationCondition: 'take_damage',
      cooldownAfterTrigger: 3,
      maxTriggers: 5,
      stateVisibility: 'visible',
      deactivationCondition: 'combat_end',
      echoEffect: {
        damageReflection: 50,
        delayedDamage: '2d6 + 6',
        echoDelay: 1
      }
    },

    utilityConfig: {
      utilityType: 'damage_reflection',
      reflectionPercentage: 50,
      reflectionType: 'temporal_echo'
    },

    targetingConfig: {
      targetingType: 'self',
      range: 0,
      validTargets: ['self']
    },

    resourceCost: {
      mana: { baseAmount: 60 }
    },

    durationConfig: {
      durationType: 'permanent',
      durationValue: -1
    },

    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: []
  }
];

// Summoning and Transformation Spells
export const SUMMONING_TRANSFORMATION_SPELLS = [
  {
    id: 'ethereal-guardian-manifestation',
    name: 'Ethereal Guardian Manifestation',
    description: 'You focus your will and speak the incantation, drawing upon arcane forces. This spell calls forth magical entities, manifesting as ethereal guardian manifestation. The magical energies resonate with the fundamental forces of arcane, creating lasting effects that reflect the spell\'s true nature.',
    level: 5,
    spellType: 'ACTION',
    effectTypes: ['summoning'],
    damageTypes: [],
    tags: ['arcane', 'summoning', 'guardian', 'protection'],
    visualTheme: 'arcane',
    icon: 'spell_holy_guardianspirit',

    summonConfig: {
      summonType: 'guardian',
      summonDuration: 600,
      summonHealth: 80,
      summonAC: 16,
      summonAttacks: [
        {
          name: 'Ethereal Strike',
          damage: '2d6 + 4',
          damageType: 'force',
          range: 5,
          attackBonus: 6
        }
      ],
      summonAbilities: [
        {
          name: 'Protective Aura',
          description: 'Grants +2 AC to nearby allies',
          radius: 10,
          effect: 'ac_bonus'
        }
      ],
      summonMovement: 30,
      summonIntelligence: 'basic_commands',
      maxSummons: 1
    },

    targetingConfig: {
      targetingType: 'area',
      aoeShape: 'circle',
      aoeParameters: { radius: 5 },
      range: 30,
      validTargets: ['empty_space']
    },

    resourceCost: {
      mana: { baseAmount: 55 }
    },

    durationConfig: {
      durationType: 'rounds',
      durationValue: 10
    },

    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: []
  },

  {
    id: 'primal-essence-transformation',
    name: 'Primal Essence Transformation',
    description: 'You focus your will and speak the incantation, drawing upon nature forces. This spell alters the fundamental nature of the target, manifesting as primal essence transformation. The magical energies resonate with the fundamental forces of nature, creating lasting effects that reflect the spell\'s true nature.',
    level: 7,
    spellType: 'ACTION',
    effectTypes: ['transformation', 'buff'],
    damageTypes: [],
    tags: ['nature', 'transformation', 'buff', 'primal'],
    visualTheme: 'nature',
    icon: 'spell_nature_polymorph',

    transformConfig: {
      transformationType: 'beast_form',
      transformDuration: 900,
      availableForms: [
        {
          name: 'Dire Wolf',
          stats: {
            strength: 17,
            agility: 15,
            constitution: 15,
            speed: 50,
            naturalArmor: 14
          },
          abilities: ['pack_tactics', 'keen_hearing']
        },
        {
          name: 'Giant Eagle',
          stats: {
            strength: 16,
            agility: 17,
            constitution: 13,
            speed: 80,
            flySpeed: 80,
            naturalArmor: 13
          },
          abilities: ['keen_sight', 'flyby']
        }
      ],
      retainMentalStats: true,
      retainSpellcasting: false,
      canSpeakInForm: false
    },

    buffConfig: {
      buffs: [
        {
          name: 'Primal Instincts',
          description: 'Enhanced senses and natural abilities',
          duration: 900,
          effects: {
            statModifiers: {
              constitution: 2
            },
            naturalWeapons: true,
            enhancedSenses: true
          }
        }
      ]
    },

    targetingConfig: {
      targetingType: 'single',
      range: 30,
      validTargets: ['ally', 'self']
    },

    resourceCost: {
      mana: { baseAmount: 70 }
    },

    durationConfig: {
      durationType: 'rounds',
      durationValue: 15
    },

    dateCreated: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    categoryIds: []
  }
];

// Enhanced Spell Categories for Organization
export const ENHANCED_SPELL_CATEGORIES = [
  {
    id: 'elemental-mastery',
    name: 'Elemental Mastery',
    description: 'Spells that harness the raw power of elemental forces',
    icon: 'spell_fire_fireball02',
    spells: ['ethereal-flame-manifestation', 'crystalline-frost-convergence', 'resonant-storm-essence'],
    color: '#ef4444',
    theme: 'elemental'
  },
  {
    id: 'divine-grace',
    name: 'Divine Grace',
    description: 'Spells blessed by divine powers that heal and protect',
    icon: 'spell_holy_heal',
    spells: ['sublime-grace-blessing', 'celestial-sanctuary-covenant'],
    color: '#fbbf24',
    theme: 'divine'
  },
  {
    id: 'arcane-mysteries',
    name: 'Arcane Mysteries',
    description: 'Complex magical theories made manifest',
    icon: 'spell_arcane_arcane04',
    spells: ['twisted-nexus-theorem', 'pure-matrix-confluence'],
    color: '#8b5cf6',
    theme: 'arcane'
  },
  {
    id: 'nature-harmony',
    name: 'Nature\'s Harmony',
    description: 'Spells that work with the natural world',
    icon: 'spell_nature_thorns',
    spells: ['verdant-growth-harmony', 'primal-essence-transformation'],
    color: '#22c55e',
    theme: 'nature'
  },
  {
    id: 'mind-weaving',
    name: 'Mind Weaving',
    description: 'Spells that affect thoughts and consciousness',
    icon: 'spell_shadow_mindsteal',
    spells: ['piercing-thought-fragment'],
    color: '#6366f1',
    theme: 'mind'
  },
  {
    id: 'temporal-mastery',
    name: 'Temporal Mastery',
    description: 'Spells that manipulate time and causality',
    icon: 'spell_arcane_slow',
    spells: ['fleeting-moment-stasis', 'eternal-echo-paradox'],
    color: '#06b6d4',
    theme: 'temporal'
  },
  {
    id: 'summoning-arts',
    name: 'Summoning Arts',
    description: 'Spells that call forth entities and transform reality',
    icon: 'spell_holy_guardianspirit',
    spells: ['ethereal-guardian-manifestation'],
    color: '#f59e0b',
    theme: 'summoning'
  },
  {
    id: 'advanced-mechanics',
    name: 'Advanced Mechanics',
    description: 'Spells utilizing complex magical systems',
    icon: 'inv_misc_book_11',
    spells: ['fate-weaver-paradigm'],
    color: '#ec4899',
    theme: 'advanced'
  }
];

// Spell Level Categories
export const SPELL_LEVEL_CATEGORIES = [
  {
    id: 'novice-spells',
    name: 'Novice Spells (Level 1-2)',
    description: 'Basic spells for beginning practitioners',
    icon: 'spell_arcane_arcane01',
    levelRange: [1, 2],
    color: '#94a3b8'
  },
  {
    id: 'adept-spells',
    name: 'Adept Spells (Level 3-4)',
    description: 'Intermediate spells requiring skill and practice',
    icon: 'spell_arcane_arcane02',
    levelRange: [3, 4],
    color: '#3b82f6'
  },
  {
    id: 'expert-spells',
    name: 'Expert Spells (Level 5-6)',
    description: 'Advanced spells for experienced casters',
    icon: 'spell_arcane_arcane03',
    levelRange: [5, 6],
    color: '#8b5cf6'
  },
  {
    id: 'master-spells',
    name: 'Master Spells (Level 7+)',
    description: 'Legendary spells of immense power',
    icon: 'spell_arcane_arcane04',
    levelRange: [7, 10],
    color: '#f59e0b'
  }
];

// Spell Type Categories
export const SPELL_TYPE_CATEGORIES = [
  {
    id: 'action-spells',
    name: 'Action Spells',
    description: 'Standard spells cast during your turn',
    icon: 'ability_warrior_savageblow',
    spellType: 'ACTION',
    color: '#ef4444'
  },
  {
    id: 'channeled-spells',
    name: 'Channeled Spells',
    description: 'Spells requiring sustained concentration',
    icon: 'spell_arcane_arcane01',
    spellType: 'CHANNELED',
    color: '#8b5cf6'
  },
  {
    id: 'reaction-spells',
    name: 'Reaction Spells',
    description: 'Spells triggered by specific events',
    icon: 'ability_warrior_revenge',
    spellType: 'REACTION',
    color: '#f59e0b'
  },
  {
    id: 'state-spells',
    name: 'State Spells',
    description: 'Persistent spells that activate conditionally',
    icon: 'spell_holy_devotion',
    spellType: 'STATE',
    color: '#06b6d4'
  },
  {
    id: 'zone-spells',
    name: 'Zone Spells',
    description: 'Spells that create persistent areas of effect',
    icon: 'spell_arcane_teleportundercity',
    spellType: 'ZONE',
    color: '#22c55e'
  },
  {
    id: 'trap-spells',
    name: 'Trap Spells',
    description: 'Spells that lie in wait for activation',
    icon: 'spell_fire_selfdestruct',
    spellType: 'TRAP',
    color: '#dc2626'
  }
];

// Combine all spell collections
export const ENHANCED_SPELL_LIBRARY = [
  ...ELEMENTAL_DAMAGE_SPELLS,
  ...DIVINE_HEALING_SPELLS,
  ...ADVANCED_MECHANIC_SPELLS,
  ...ARCANE_UTILITY_SPELLS,
  ...NATURE_CONTROL_SPELLS,
  ...MIND_CONTROL_SPELLS,
  ...TEMPORAL_SPELLS,
  ...SUMMONING_TRANSFORMATION_SPELLS
];

// Export all categories together
export const ALL_ENHANCED_CATEGORIES = [
  ...ENHANCED_SPELL_CATEGORIES,
  ...SPELL_LEVEL_CATEGORIES,
  ...SPELL_TYPE_CATEGORIES
];
