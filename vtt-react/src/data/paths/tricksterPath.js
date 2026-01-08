export const TRICKSTER_PATH = {
    id: 'trickster',
    name: 'Trickster',
    description: 'Masters of deception, cunning, and misdirection',
    icon: 'fas fa-mask',
    overview: 'Tricksters live by their wits and charm, using cunning and deception to navigate the world. Whether through sleight of hand, clever words, or elaborate schemes, they always find a way to come out ahead.',
    
    mechanicalBenefits: [
        { name: 'Quick Reflexes', description: '+2 to initiative rolls', type: 'passive' }
    ],

    integrationNotes: {
        actionPointSystem: 'Trickster abilities focus on mobility, stealth, and misdirection.',
        backgroundSynergy: 'Works well with Criminal or Charlatan backgrounds.',
        classCompatibility: 'Strong with Rogue, Bard, or Ranger classes.'
    },

    roleplayingTips: [
        'Use cunning over brute force',
        'Always have an escape plan',
        'Trust your instincts and quick thinking'
    ],

    thematicElements: {
        corePhilosophy: 'The cleverest path is often the least expected.',
        mechanicalIntegration: 'Deception, mobility, and tactical advantage.'
    },

    // 3 abilities: 1 PASSIVE, 1 REACTION, 1 ACTION - player picks one of each
    abilities: [
        // PASSIVE - Cunning Instincts
        {
            id: 'cunning_instincts',
            name: 'Cunning Instincts',
            description: '"I always see it coming." Your honed instincts grant you enhanced awareness and make you difficult to surprise or deceive.',
            icon: 'ability_rogue_quickrecovery',
            level: 1,
            spellType: 'PASSIVE',
            tags: ['passive', 'perception', 'initiative', 'deception'],
            effectTypes: ['buff'],
            damageTypes: [],

            typeConfig: {
                school: 'shadow',
                icon: 'ability_rogue_quickrecovery',
                tags: ['passive', 'perception', 'initiative', 'deception']
            },

            buffConfig: {
                buffType: 'statEnhancement',
                effects: [
                    {
                        id: 'quick_reflexes',
                        name: 'Quick Reflexes',
                        description: 'You gain +2 to initiative rolls and cannot be surprised while conscious.',
                        statModifier: {
                            stat: 'initiative',
                            magnitude: 2,
                            magnitudeType: 'flat'
                        }
                    },
                    {
                        id: 'silver_tongue',
                        name: 'Silver Tongue',
                        description: 'You have advantage on Deception and Insight checks. Your quick wit makes you hard to fool.',
                        statModifier: {
                            stat: 'deception',
                            magnitude: 2,
                            magnitudeType: 'flat'
                        }
                    }
                ],
                durationType: 'permanent',
                durationUnit: 'permanent',
                canBeDispelled: false
            },

            targetingConfig: {
                targetingType: 'self'
            },

            resourceCost: {
                actionPoints: 0
            },

            resolution: 'DICE',
            visualTheme: 'shadow'
        },
        // REACTION - Evasive Maneuver
        {
            id: 'evasive_maneuver',
            name: 'Evasive Maneuver',
            description: '"You missed!" When targeted by an attack, use your quick reflexes to dodge and reposition, reducing damage and moving to safety.',
            icon: 'ability_rogue_feint',
            level: 1,
            spellType: 'REACTION',
            tags: ['reaction', 'defensive', 'mobility', 'evasion'],
            effectTypes: ['buff', 'utility'],
            damageTypes: [],

            typeConfig: {
                school: 'shadow',
                icon: 'ability_rogue_feint',
                tags: ['reaction', 'defensive', 'mobility', 'evasion']
            },

            buffConfig: {
                buffType: 'statEnhancement',
                effects: [
                    {
                        id: 'evasion',
                        name: 'Evasion',
                        description: 'Reduce incoming damage by half and immediately move up to 15 feet without provoking opportunity attacks.',
                        statModifier: {
                            stat: 'damage_reduction',
                            magnitude: 50,
                            magnitudeType: 'percentage'
                        }
                    }
                ],
                durationValue: 1,
                durationType: 'instant',
                durationUnit: 'instant',
                canBeDispelled: false
            },

            utilityConfig: {
                utilityType: 'movement',
                selectedEffects: [{
                    id: 'quick_escape',
                    name: 'Quick Escape',
                    description: 'Move up to 15 feet without provoking opportunity attacks',
                    distance: 15,
                    needsLineOfSight: false
                }],
                duration: 0,
                durationUnit: 'instant'
            },

            targetingConfig: {
                targetingType: 'self'
            },

            triggerConfig: {
                global: {
                    enabled: true,
                    logicType: 'OR',
                    compoundTriggers: [
                        {
                            id: 'damage_taken',
                            category: 'combat',
                            name: 'When you are targeted by an attack',
                            parameters: {
                                perspective: 'self',
                                target_type: 'self',
                                triggerChance: 100
                            }
                        }
                    ]
                },
                triggerRole: {
                    mode: 'CONDITIONAL',
                    activationDelay: 0,
                    requiresLOS: false
                }
            },

            resourceCost: {
                actionPoints: 0
            },

            cooldownConfig: {
                type: 'short_rest',
                value: 2,
                charges: 2,
                recovery: 1
            },

            resolution: 'DICE',
            visualTheme: 'shadow'
        },
        // ACTION - Shadow Step
        {
            id: 'shadow_step',
            name: 'Shadow Step',
            description: '"Now you see me..." Teleport through shadows to any location you can see within 60 feet that is in dim light or darkness.',
            icon: 'ability_rogue_shadowstep',
            level: 1,
            spellType: 'ACTION',
            tags: ['action', 'utility', 'teleport', 'shadow', 'mobility'],
            effectTypes: ['utility'],
            damageTypes: [],

            typeConfig: {
                school: 'shadow',
                icon: 'ability_rogue_shadowstep',
                tags: ['action', 'utility', 'teleport', 'shadow', 'mobility']
            },

            utilityConfig: {
                utilityType: 'movement',
                selectedEffects: [{
                    id: 'teleport',
                    name: 'Shadow Teleport',
                    description: 'Teleport up to 60 feet to an unoccupied space you can see that is in dim light or darkness',
                    distance: 60,
                    needsLineOfSight: true
                }],
                duration: 0,
                durationUnit: 'instant',
                concentration: false
            },

            targetingConfig: {
                targetingType: 'ground',
                rangeType: 'ranged',
                rangeDistance: 60
            },

            resourceCost: {
                mana: 10,
                actionPoints: 1
            },

            cooldownConfig: {
                type: 'short_rest',
                value: 1,
                charges: 3,
                recovery: 1
            },

            resolution: 'DICE',
            visualTheme: 'shadow'
        }
    ],

    subPaths: {
        shadowDancer: {
            id: 'shadow_dancer',
            name: 'Shadow Discipline',
            description: 'The practice of mastering stealth and shadow magic',
            theme: 'Stealth and shadow manipulation',
            icon: 'fas fa-user-ninja',

            mechanicalBenefits: [
                { name: 'Agility Bonus', description: '+1 to Agility attribute', type: 'stat' }
            ],

            abilities: [
                {
                    id: 'shadow_step',
                    name: 'Shadow Step',
                    description: '"Now you see me..." Teleport through shadows to a nearby location.',
                    icon: 'ability_rogue_shadowstep',
                    level: 1,
                    spellType: 'ACTION',
                    tags: ['utility', 'teleport', 'shadow', 'mobility'],
                    effectTypes: ['utility'],
                    damageTypes: [],

                    utilityConfig: {
                        utilityType: 'movement',
                        utilitySubtype: 'teleport',
                        duration: 0,
                        durationUnit: 'instant',
                        selectedEffects: [
                            {
                                name: 'Shadow Teleport',
                                description: 'Teleport up to 60 feet to an unoccupied space you can see that is in dim light or darkness',
                                customName: 'Shadow Step'
                            }
                        ],
                        difficultyClass: 0,
                        concentration: false
                    },

                    targetingConfig: {
                        targetingType: 'location',
                        rangeType: 'ranged',
                        rangeDistance: 60,
                        targetRestrictions: []
                    },

                    resourceCost: {
                        mana: 10,
                        health: 0,
                        stamina: 5,
                        focus: 0,
                        actionPoints: 1
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
                        charges: 3,
                        recovery: 3
                    },

                    resolution: 'DICE',
                    visualTheme: 'shadow',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                },
                {
                    id: 'backstab',
                    name: 'Backstab',
                    description: '"Nothing personal." Strike from the shadows for massive damage.',
                    icon: 'ability_backstab',
                    level: 2,
                    spellType: 'ACTION',
                    tags: ['damage', 'stealth', 'physical', 'critical'],
                    effectTypes: ['damage'],
                    damageTypes: ['physical'],

                    damageConfig: {
                        damageType: 'direct',
                        elementType: 'physical',
                        formula: '6d6 + AGI',
                        resolution: 'DICE',
                        hasDotEffect: false,
                        savingThrowConfig: {
                            enabled: false
                        },
                        criticalConfig: {
                            enabled: true,
                            critType: 'dice',
                            critMultiplier: 3,
                            critDiceOnly: false,
                            extraDice: '3d6'
                        },
                        conditionalDamage: {
                            condition: 'target_unaware_or_flanked',
                            multiplier: 2,
                            description: 'Double damage if target is unaware or flanked'
                        }
                    },

                    targetingConfig: {
                        targetingType: 'single',
                        rangeType: 'melee',
                        rangeDistance: 5,
                        targetRestrictions: ['enemy']
                    },

                    resourceCost: {
                        mana: 0,
                        health: 0,
                        stamina: 15,
                        focus: 0,
                        actionPoints: 3
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
                        recovery: 1
                    },

                    resolution: 'DICE',
                    visualTheme: 'shadow',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                }
            ]
        },

        illusionist: {
            id: 'illusionist',
            name: 'Illusion Discipline',
            description: 'The practice of weaving deceptive magic and false realities',
            theme: 'Illusion and misdirection',
            icon: 'fas fa-eye-slash',

            mechanicalBenefits: [
                { name: 'Silver Tongue', description: 'Advantage on deception checks', type: 'passive' }
            ],

            abilities: [
                {
                    id: 'mirror_image',
                    name: 'Mirror Image',
                    description: '"Which one is real?" Create illusory duplicates of yourself to confuse enemies.',
                    icon: 'spell_magic_lesserinvisibilty',
                    level: 1,
                    spellType: 'ACTION',
                    tags: ['buff', 'illusion', 'defense', 'duplicates'],
                    effectTypes: ['buff'],
                    damageTypes: [],

                    buffConfig: {
                        duration: 8,
                        durationValue: 8,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [
                            {
                                name: 'evasion',
                                stat: 'agility',
                                value: 3,
                                magnitude: 3,
                                magnitudeType: 'flat',
                                isPercentage: false
                            }
                        ],
                        statusEffects: [
                            {
                                id: 'mirror_images',
                                name: 'Mirror Images',
                                description: '3 illusory duplicates protect you, +3 AGI from enhanced reflexes'
                            }
                        ],
                        buffs: [
                            {
                                name: 'Illusory Duplicates',
                                description: 'Creates 3 duplicates',
                                duration: 8,
                                effects: {
                                    duplicateCount: 3,
                                    missChance: 50
                                }
                            }
                        ]
                    },

                    targetingConfig: {
                        targetingType: 'self',
                        rangeType: 'self',
                        rangeDistance: 0,
                        targetRestrictions: ['self']
                    },

                    resourceCost: {
                        mana: 20,
                        health: 0,
                        stamina: 0,
                        focus: 0,
                        actionPoints: 2
                    },

                    durationConfig: {
                        type: 'timed',
                        value: 8,
                        unit: 'rounds',
                        concentration: true,
                        dispellable: true
                    },

                    cooldownConfig: {
                        type: 'long_rest',
                        value: 1,
                        charges: 1,
                        recovery: 1
                    },

                    resolution: 'DICE',
                    visualTheme: 'arcane',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                },
                {
                    id: 'phantasmal_killer',
                    name: 'Phantasmal Killer',
                    description: '"Your worst nightmare." Create a terrifying illusion in an enemy\'s mind.',
                    icon: 'spell_shadow_charm',
                    level: 2,
                    spellType: 'ACTION',
                    tags: ['damage', 'illusion', 'fear', 'psychic'],
                    effectTypes: ['damage', 'debuff'],
                    damageTypes: ['psychic'],

                    damageConfig: {
                        damageType: 'direct',
                        elementType: 'psychic',
                        formula: '5d8 + INT',
                        resolution: 'DICE',
                        hasDotEffect: false,
                        savingThrowConfig: {
                            enabled: true,
                            savingThrowType: 'spirit',
                            difficultyClass: 15,
                            saveOutcome: 'halves'
                        },
                        criticalConfig: {
                            enabled: true,
                            critType: 'dice',
                            critMultiplier: 2,
                            critDiceOnly: false
                        }
                    },

                    debuffConfig: {
                        duration: 3,
                        durationValue: 3,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [],
                        statusEffects: [
                            {
                                id: 'frightened',
                                name: 'Frightened',
                                description: 'Terrified by phantasmal illusion'
                            }
                        ],
                        debuffs: [
                            {
                                name: 'Nightmare Terror',
                                description: 'Frightened',
                                duration: 3,
                                effects: {
                                    fearEffect: true
                                }
                            }
                        ]
                    },

                    targetingConfig: {
                        targetingType: 'single',
                        rangeType: 'ranged',
                        rangeDistance: 60,
                        targetRestrictions: ['enemy']
                    },

                    resourceCost: {
                        mana: 25,
                        health: 0,
                        stamina: 0,
                        focus: 0,
                        actionPoints: 3
                    },

                    durationConfig: {
                        type: 'instant',
                        value: 0,
                        unit: 'seconds',
                        concentration: false,
                        dispellable: false
                    },

                    cooldownConfig: {
                        type: 'long_rest',
                        value: 1,
                        charges: 1,
                        recovery: 1
                    },

                    resolution: 'DICE',
                    visualTheme: 'shadow',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                }
            ]
        },

        poisoner: {
            id: 'poisoner',
            name: 'Poison Discipline',
            description: 'The practice of mastering toxins and venoms',
            theme: 'Poison crafting and application',
            icon: 'fas fa-flask-poison',

            mechanicalBenefits: [
                { name: 'Constitution Bonus', description: '+1 to Constitution attribute', type: 'stat' }
            ],

            abilities: [
                {
                    id: 'envenom_weapon',
                    name: 'Envenom Weapon',
                    description: '"A little something extra." Coat your weapon with deadly poison.',
                    icon: 'ability_rogue_deadlypoison',
                    level: 1,
                    spellType: 'ACTION',
                    tags: ['buff', 'poison', 'weapon', 'damage-over-time'],
                    effectTypes: ['buff'],
                    damageTypes: ['poison'],

                    buffConfig: {
                        duration: 10,
                        durationValue: 10,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [],
                        statusEffects: [
                            {
                                id: 'envenomed_weapon',
                                name: 'Envenomed Weapon',
                                description: 'Weapon attacks deal additional 2d6 poison damage and apply poison DoT'
                            }
                        ],
                        buffs: [
                            {
                                name: 'Deadly Poison',
                                description: 'Weapon deals poison damage',
                                duration: 10,
                                effects: {
                                    bonusDamage: '2d6',
                                    damageType: 'poison',
                                    dotDamage: '1d6',
                                    dotDuration: 3
                                }
                            }
                        ]
                    },

                    targetingConfig: {
                        targetingType: 'self',
                        rangeType: 'self',
                        rangeDistance: 0,
                        targetRestrictions: ['self']
                    },

                    resourceCost: {
                        mana: 12,
                        health: 0,
                        stamina: 0,
                        focus: 0,
                        actionPoints: 1
                    },

                    durationConfig: {
                        type: 'timed',
                        value: 10,
                        unit: 'rounds',
                        concentration: false,
                        dispellable: false
                    },

                    cooldownConfig: {
                        type: 'short_rest',
                        value: 1,
                        charges: 2,
                        recovery: 2
                    },

                    resolution: 'DICE',
                    visualTheme: 'nature',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                },
                {
                    id: 'toxic_cloud',
                    name: 'Toxic Cloud',
                    description: '"Breathe deep." Release a cloud of poisonous gas.',
                    icon: 'spell_nature_nullifypoison_02',
                    level: 2,
                    spellType: 'ACTION',
                    tags: ['damage', 'poison', 'aoe', 'dot'],
                    effectTypes: ['damage'],
                    damageTypes: ['poison'],

                    damageConfig: {
                        damageType: 'dot',
                        elementType: 'poison',
                        formula: '2d6',
                        resolution: 'DICE',
                        hasDotEffect: true,
                        dotTickInterval: 1,
                        dotDuration: 5,
                        savingThrowConfig: {
                            enabled: true,
                            savingThrowType: 'constitution',
                            difficultyClass: 14,
                            saveOutcome: 'halves'
                        },
                        criticalConfig: {
                            enabled: true,
                            critType: 'dice',
                            critMultiplier: 2,
                            critDiceOnly: false
                        }
                    },

                    targetingConfig: {
                        targetingType: 'area',
                        rangeType: 'ranged',
                        rangeDistance: 30,
                        aoeShape: 'sphere',
                        aoeSize: 15,
                        targetRestrictions: ['enemy']
                    },

                    resourceCost: {
                        mana: 20,
                        health: 0,
                        stamina: 0,
                        focus: 0,
                        actionPoints: 2
                    },

                    durationConfig: {
                        type: 'timed',
                        value: 5,
                        unit: 'rounds',
                        concentration: false,
                        dispellable: true
                    },

                    cooldownConfig: {
                        type: 'long_rest',
                        value: 1,
                        charges: 1,
                        recovery: 1
                    },

                    resolution: 'DICE',
                    visualTheme: 'nature',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                }
            ]
        }
    }
};

