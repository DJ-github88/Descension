export const ARCANIST_PATH = {
    id: 'arcanist',
    name: 'Arcanist',
    description: 'Scholars of arcane theory and magical mastery',
    icon: 'fas fa-magic',
    overview: 'Arcanists are scholars of the arcane arts, having spent years studying magical theory and practice. Their deep understanding of spellcraft and magical phenomena makes them invaluable in matters of mystical importance.',

    mechanicalBenefits: [
        { name: 'Spell Efficiency', description: 'Reduce mana costs by 5 for all spells', type: 'passive' }
    ],

    integrationNotes: {
        actionPointSystem: 'Arcanist abilities focus on raw magical power and spell manipulation.',
        backgroundSynergy: 'Works well with Sage or Noble backgrounds.',
        classCompatibility: 'Strong with Wizard, Sorcerer, or Warlock classes.'
    },

    roleplayingTips: [
        'Seek knowledge above all else',
        'Analyze magic scientifically',
        'Use intelligence to solve problems'
    ],

    thematicElements: {
        corePhilosophy: 'Knowledge is power, and magic is the ultimate knowledge.',
        mechanicalIntegration: 'Spell mastery and arcane manipulation.'
    },

    subPaths: {
        evoker: {
            id: 'evoker',
            name: 'Evoker',
            description: 'Masters of raw elemental evocation',
            theme: 'Elemental magic and destruction',
            icon: 'fas fa-fire',

            mechanicalBenefits: [
                { name: 'Intelligence Bonus', description: '+2 to Intelligence attribute', type: 'stat' }
            ],

            abilities: [
                {
                    id: 'elemental_blast',
                    name: 'Elemental Blast',
                    description: '"Feel the fury of the elements!" Unleash a devastating blast of elemental energy.',
                    icon: 'spell_fire_elementaldevastation',
                    level: 1,
                    spellType: 'ACTION',
                    tags: ['damage', 'elemental', 'blast', 'aoe'],
                    effectTypes: ['damage'],
                    damageTypes: ['fire', 'frost', 'lightning'],

                    damageConfig: {
                        damageType: 'direct',
                        elementType: 'fire',
                        formula: '5d6 + INT',
                        resolution: 'DICE',
                        hasDotEffect: false,
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
                            critDiceOnly: false
                        }
                    },

                    targetingConfig: {
                        targetingType: 'area',
                        rangeType: 'ranged',
                        rangeDistance: 60,
                        aoeShape: 'sphere',
                        aoeSize: 10,
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
                        type: 'short_rest',
                        value: 1,
                        charges: 2,
                        recovery: 2
                    },

                    resolution: 'DICE',
                    visualTheme: 'fire',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                },
                {
                    id: 'elemental_mastery',
                    name: 'Elemental Mastery',
                    description: '"Command the elements!" Gain temporary mastery over all elements.',
                    icon: 'spell_nature_wispsplode',
                    level: 2,
                    spellType: 'ACTION',
                    tags: ['buff', 'elemental', 'mastery', 'versatility'],
                    effectTypes: ['buff'],
                    damageTypes: [],

                    buffConfig: {
                        duration: 8,
                        durationValue: 8,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [
                            {
                                name: 'elemental_power',
                                stat: 'spellDamage',
                                value: 5,
                                magnitude: 5,
                                magnitudeType: 'flat',
                                isPercentage: false
                            }
                        ],
                        statusEffects: [
                            {
                                id: 'elemental_mastery',
                                name: 'Elemental Mastery',
                                description: 'All elemental spells deal +5 damage'
                            }
                        ],
                        buffs: [
                            {
                                name: 'Elemental Power',
                                description: 'Enhanced elemental magic',
                                duration: 8,
                                effects: {
                                    spellDamageBonus: 5
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
                        mana: 30,
                        health: 0,
                        stamina: 0,
                        focus: 0,
                        actionPoints: 2
                    },

                    durationConfig: {
                        type: 'timed',
                        value: 8,
                        unit: 'rounds',
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
                    visualTheme: 'arcane',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                }
            ]
        },

        temporalist: {
            id: 'temporalist',
            name: 'Temporalist',
            description: 'Manipulators of time and space',
            theme: 'Time magic and temporal manipulation',
            icon: 'fas fa-hourglass',

            mechanicalBenefits: [
                { name: 'Arcane Knowledge', description: 'Advantage on Arcana checks', type: 'passive' }
            ],

            abilities: [
                {
                    id: 'time_stop',
                    name: 'Time Stop',
                    description: '"Time bends to my will." Briefly freeze time to take extra actions.',
                    icon: 'spell_arcane_blink',
                    level: 2,
                    spellType: 'ACTION',
                    tags: ['utility', 'time', 'buff', 'extra-actions'],
                    effectTypes: ['buff'],
                    damageTypes: [],

                    buffConfig: {
                        duration: 1,
                        durationValue: 1,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [],
                        statusEffects: [
                            {
                                id: 'time_stopped',
                                name: 'Time Stopped',
                                description: 'Gain 2 extra action points this turn'
                            }
                        ],
                        buffs: [
                            {
                                name: 'Temporal Acceleration',
                                description: 'Extra actions',
                                duration: 1,
                                effects: {
                                    bonusActionPoints: 2
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
                        mana: 30,
                        health: 0,
                        stamina: 0,
                        focus: 0,
                        actionPoints: 0
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
                    visualTheme: 'arcane',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                },
                {
                    id: 'temporal_rewind',
                    name: 'Temporal Rewind',
                    description: '"Turn back the clock." Rewind time to undo recent damage.',
                    icon: 'spell_arcane_blink',
                    level: 2,
                    spellType: 'REACTION',
                    tags: ['healing', 'time', 'rewind', 'defensive'],
                    effectTypes: ['healing'],
                    damageTypes: [],

                    healingConfig: {
                        healingType: 'direct',
                        formula: '4d8 + INT',
                        resolution: 'DICE',
                        hasHotEffect: false,
                        hasShieldEffect: false,
                        criticalConfig: {
                            enabled: true,
                            critType: 'dice',
                            critMultiplier: 2,
                            critDiceOnly: false
                        }
                    },

                    targetingConfig: {
                        targetingType: 'single',
                        rangeType: 'ranged',
                        rangeDistance: 30,
                        targetRestrictions: ['ally', 'self']
                    },

                    triggerConfig: {
                        global: {
                            logicType: 'OR',
                            compoundTriggers: [
                                {
                                    id: 'ally_takes_damage',
                                    name: 'When an ally takes damage',
                                    parameters: {
                                        damage_type: 'any',
                                        min_damage: 10,
                                        target_entity: 'ally',
                                        range: 30,
                                        triggerChance: 100
                                    }
                                }
                            ]
                        },
                        triggerRole: {
                            mode: 'REACTIVE',
                            activationDelay: 0,
                            requiresLOS: true
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
                        type: 'long_rest',
                        value: 1,
                        charges: 1,
                        recovery: 1
                    },

                    resolution: 'DICE',
                    visualTheme: 'arcane',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                }
            ]
        },

        spellweaver: {
            id: 'spellweaver',
            name: 'Spellweaver',
            description: 'Masters of spell combination and metamagic',
            theme: 'Spell enhancement and manipulation',
            icon: 'fas fa-wand-magic',

            mechanicalBenefits: [
                { name: 'Charisma Bonus', description: '+1 to Charisma attribute', type: 'stat' }
            ],

            abilities: [
                {
                    id: 'arcane_surge',
                    name: 'Arcane Surge',
                    description: '"Power overwhelming!" Empower your next spell for increased effect.',
                    icon: 'spell_arcane_arcanepotency',
                    level: 1,
                    spellType: 'ACTION',
                    tags: ['buff', 'spell-power', 'enhancement', 'metamagic'],
                    effectTypes: ['buff'],
                    damageTypes: [],

                    buffConfig: {
                        duration: 2,
                        durationValue: 2,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [
                            {
                                name: 'spell_power',
                                stat: 'spell_damage',
                                value: 10,
                                magnitude: 10,
                                magnitudeType: 'flat',
                                isPercentage: false
                            }
                        ],
                        statusEffects: [
                            {
                                id: 'arcane_surge',
                                name: 'Arcane Surge',
                                description: 'Next spell deals +10 damage'
                            }
                        ],
                        buffs: [
                            {
                                name: 'Empowered Magic',
                                description: 'Spell power increased',
                                duration: 2,
                                effects: {
                                    spellDamageBonus: 10
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
                        mana: 15,
                        health: 0,
                        stamina: 0,
                        focus: 0,
                        actionPoints: 1
                    },

                    durationConfig: {
                        type: 'timed',
                        value: 2,
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
                    visualTheme: 'arcane',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                },
                {
                    id: 'spell_steal',
                    name: 'Spell Steal',
                    description: '"Your magic is mine now." Steal a beneficial effect from an enemy.',
                    icon: 'spell_arcane_arcane04',
                    level: 2,
                    spellType: 'ACTION',
                    tags: ['utility', 'dispel', 'steal', 'tactical'],
                    effectTypes: ['utility', 'buff'],
                    damageTypes: [],

                    utilityConfig: {
                        utilityType: 'dispel',
                        utilitySubtype: 'steal_buff',
                        duration: 0,
                        durationUnit: 'instant',
                        selectedEffects: [
                            {
                                name: 'Spell Steal',
                                description: 'Remove one beneficial effect from target and apply it to yourself',
                                customName: 'Spell Steal'
                            }
                        ],
                        difficultyClass: 0,
                        concentration: false
                    },

                    targetingConfig: {
                        targetingType: 'single',
                        rangeType: 'ranged',
                        rangeDistance: 40,
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
                    visualTheme: 'arcane',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                }
            ]
        }
    }
};
