export const MERCENARY_PATH = {
    id: 'mercenary',
    name: 'Mercenary',
    description: 'Professional soldiers who fight for coin and glory',
    icon: 'fas fa-coins',
    overview: 'Mercenaries are professional warriors who have honed their skills through countless battles. They are pragmatic, versatile, and always ready for the next contract.',
    
    mechanicalBenefits: [
        { name: 'Tactical Mind', description: '+1 to AC when fighting multiple enemies', type: 'passive' }
    ],

    integrationNotes: {
        actionPointSystem: 'Mercenary abilities focus on versatility and tactical combat.',
        backgroundSynergy: 'Works well with Soldier or Mercenary Veteran backgrounds.',
        classCompatibility: 'Strong with Fighter, Ranger, or Rogue classes.'
    },

    roleplayingTips: [
        'Always negotiate payment first',
        'Be professional and reliable',
        'Adapt to any situation'
    ],

    thematicElements: {
        corePhilosophy: 'Every battle is a job, and every job deserves to be done right.',
        mechanicalIntegration: 'Versatility, tactics, and professional combat skills.'
    },

    subPaths: {
        tactician: {
            id: 'tactician',
            name: 'Tactician',
            description: 'Strategic fighters who exploit enemy weaknesses',
            theme: 'Tactical combat and exploitation',
            icon: 'fas fa-chess',

            mechanicalBenefits: [
                { name: 'Combat Veteran', description: 'Advantage on initiative rolls', type: 'passive' }
            ],

            abilities: [
                {
                    id: 'exploit_weakness',
                    name: 'Exploit Weakness',
                    description: '"I see your weakness." Mark an enemy, dealing increased damage to them.',
                    icon: 'ability_hunter_snipershot',
                    level: 1,
                    spellType: 'ACTION',
                    tags: ['debuff', 'tactical', 'damage-amplification', 'mark'],
                    effectTypes: ['debuff'],
                    damageTypes: [],

                    debuffConfig: {
                        duration: 8,
                        durationValue: 8,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [
                            {
                                name: 'marked_vulnerability',
                                stat: 'armor_class',
                                value: -3,
                                magnitude: -3,
                                magnitudeType: 'flat',
                                isPercentage: false
                            }
                        ],
                        statusEffects: [
                            {
                                id: 'marked_target',
                                name: 'Marked Target',
                                description: 'Weakness exploited, -3 AC, you deal 25% more damage to this target'
                            }
                        ],
                        debuffs: [
                            {
                                name: 'Exploited Weakness',
                                description: 'Vulnerable to attacks',
                                duration: 8,
                                effects: {
                                    armorPenalty: -3,
                                    damageVulnerability: 25
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
                        mana: 0,
                        health: 0,
                        stamina: 10,
                        focus: 0,
                        actionPoints: 1
                    },

                    durationConfig: {
                        type: 'timed',
                        value: 8,
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
                    visualTheme: 'physical',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                },
                {
                    id: 'tactical_retreat',
                    name: 'Tactical Retreat',
                    description: '"Live to fight another day." Quickly disengage and reposition.',
                    icon: 'ability_rogue_sprint',
                    level: 1,
                    spellType: 'ACTION',
                    tags: ['utility', 'movement', 'disengage', 'tactical'],
                    effectTypes: ['utility'],
                    damageTypes: [],

                    utilityConfig: {
                        utilityType: 'movement',
                        utilitySubtype: 'dash',
                        duration: 1,
                        durationUnit: 'rounds',
                        selectedEffects: [
                            {
                                name: 'Tactical Movement',
                                description: 'Disengage and move double speed without provoking opportunity attacks',
                                customName: 'Tactical Retreat'
                            }
                        ],
                        difficultyClass: 0,
                        concentration: false
                    },

                    targetingConfig: {
                        targetingType: 'self',
                        rangeType: 'self',
                        rangeDistance: 0,
                        targetRestrictions: ['self']
                    },

                    resourceCost: {
                        mana: 0,
                        health: 0,
                        stamina: 10,
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
                        charges: 2,
                        recovery: 2
                    },

                    resolution: 'DICE',
                    visualTheme: 'physical',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                }
            ]
        },

        duelist: {
            id: 'duelist',
            name: 'Duelist',
            description: 'Masters of one-on-one combat',
            theme: 'Single combat and precision',
            icon: 'fas fa-fencing',

            mechanicalBenefits: [
                { name: 'Agility Bonus', description: '+1 to Agility attribute', type: 'stat' }
            ],

            abilities: [
                {
                    id: 'riposte',
                    name: 'Riposte',
                    description: '"Your mistake!" Counter an enemy attack with a swift strike.',
                    icon: 'ability_warrior_punishingblow',
                    level: 1,
                    spellType: 'REACTION',
                    tags: ['damage', 'counter', 'physical', 'precision'],
                    effectTypes: ['damage'],
                    damageTypes: ['physical'],

                    damageConfig: {
                        damageType: 'direct',
                        elementType: 'physical',
                        formula: '4d6 + AGI',
                        resolution: 'DICE',
                        hasDotEffect: false,
                        savingThrow: {
                            enabled: false
                        },
                        criticalConfig: {
                            enabled: true,
                            critType: 'dice',
                            critMultiplier: 2,
                            critDiceOnly: false
                        }
                    },

                    targetingConfig: {
                        targetingType: 'single',
                        rangeType: 'melee',
                        rangeDistance: 5,
                        targetRestrictions: ['enemy']
                    },

                    triggerConfig: {
                        global: {
                            logicType: 'OR',
                            compoundTriggers: [
                                {
                                    id: 'enemy_melee_attack',
                                    name: 'When an enemy attacks you in melee',
                                    parameters: {
                                        attack_type: 'melee',
                                        target_entity: 'self',
                                        range: 5,
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
                        mana: 0,
                        health: 0,
                        stamina: 10,
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
                        recovery: 2
                    },

                    resolution: 'DICE',
                    visualTheme: 'physical',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                },
                {
                    id: 'parry',
                    name: 'Parry',
                    description: '"Deflected!" Deflect an incoming attack and gain a brief opening.',
                    icon: 'ability_parry',
                    level: 2,
                    spellType: 'REACTION',
                    tags: ['defensive', 'counter', 'parry', 'buff'],
                    effectTypes: ['buff'],
                    damageTypes: [],

                    buffConfig: {
                        duration: 1,
                        durationValue: 1,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [
                            {
                                name: 'counter_attack',
                                stat: 'damage',
                                value: 5,
                                magnitude: 5,
                                magnitudeType: 'flat',
                                isPercentage: false
                            }
                        ],
                        statusEffects: [
                            {
                                id: 'parried',
                                name: 'Parried',
                                description: 'Attack deflected, next attack gains +5 damage'
                            }
                        ],
                        buffs: [
                            {
                                name: 'Counter Opening',
                                description: 'Damage bonus after parry',
                                duration: 1,
                                effects: {
                                    damageBonus: 5,
                                    attackNegated: true
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

                    triggerConfig: {
                        global: {
                            logicType: 'OR',
                            compoundTriggers: [
                                {
                                    id: 'enemy_melee_attack',
                                    name: 'When an enemy attacks you in melee',
                                    parameters: {
                                        attack_type: 'melee',
                                        target_entity: 'self',
                                        range: 5,
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
                        mana: 0,
                        health: 0,
                        stamina: 10,
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
                        charges: 3,
                        recovery: 3
                    },

                    resolution: 'DICE',
                    visualTheme: 'physical',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                }
            ]
        },

        sharpshooter: {
            id: 'sharpshooter',
            name: 'Sharpshooter',
            description: 'Expert marksmen with deadly precision',
            theme: 'Ranged combat and accuracy',
            icon: 'fas fa-crosshairs',

            mechanicalBenefits: [
                { name: 'Versatile Training', description: '+1 to any two attributes of choice', type: 'stat' }
            ],

            abilities: [
                {
                    id: 'headshot',
                    name: 'Headshot',
                    description: '"One shot, one kill." A precise shot aimed at a vital point.',
                    icon: 'ability_hunter_assassinate',
                    level: 2,
                    spellType: 'ACTION',
                    tags: ['damage', 'ranged', 'precision', 'critical'],
                    effectTypes: ['damage'],
                    damageTypes: ['physical'],

                    damageConfig: {
                        damageType: 'direct',
                        elementType: 'physical',
                        formula: '6d8 + AGI',
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
                            autoCrit: true
                        }
                    },

                    targetingConfig: {
                        targetingType: 'single',
                        rangeType: 'ranged',
                        rangeDistance: 120,
                        targetRestrictions: ['enemy']
                    },

                    resourceCost: {
                        mana: 0,
                        health: 0,
                        stamina: 20,
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
                    visualTheme: 'physical',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                },
                {
                    id: 'steady_aim',
                    name: 'Steady Aim',
                    description: '"Breathe... focus... fire." Take careful aim for guaranteed critical hit.',
                    icon: 'ability_hunter_focusedaim',
                    level: 1,
                    spellType: 'ACTION',
                    tags: ['buff', 'precision', 'critical', 'focus'],
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
                                id: 'steady_aim',
                                name: 'Steady Aim',
                                description: 'Next ranged attack is an automatic critical hit'
                            }
                        ],
                        buffs: [
                            {
                                name: 'Perfect Aim',
                                description: 'Guaranteed crit',
                                duration: 1,
                                effects: {
                                    autoCrit: true,
                                    nextAttackOnly: true
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
                        mana: 0,
                        health: 0,
                        stamina: 15,
                        focus: 0,
                        actionPoints: 1
                    },

                    durationConfig: {
                        type: 'timed',
                        value: 1,
                        unit: 'rounds',
                        concentration: true,
                        dispellable: false
                    },

                    cooldownConfig: {
                        type: 'short_rest',
                        value: 1,
                        charges: 2,
                        recovery: 2
                    },

                    resolution: 'DICE',
                    visualTheme: 'physical',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                }
            ]
        }
    }
};

