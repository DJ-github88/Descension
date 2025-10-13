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

    subPaths: {
        shadowDancer: {
            id: 'shadow_dancer',
            name: 'Shadow Dancer',
            description: 'Masters of stealth and shadow magic',
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
                        savingThrow: {
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
            name: 'Illusionist',
            description: 'Weavers of deceptive magic and false realities',
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
                        savingThrow: {
                            enabled: true,
                            attribute: 'spirit',
                            difficulty: 15,
                            onSuccess: 'half_damage',
                            onFailure: 'full_damage'
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
            name: 'Poisoner',
            description: 'Masters of toxins and venoms',
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
                        savingThrow: {
                            enabled: true,
                            attribute: 'constitution',
                            difficulty: 14,
                            onSuccess: 'half_damage',
                            onFailure: 'full_damage'
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

