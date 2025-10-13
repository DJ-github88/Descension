export const REAVER_PATH = {
    id: 'reaver',
    name: 'Reaver',
    description: 'Brutal warriors who revel in carnage and bloodshed',
    icon: 'fas fa-axe-battle',
    overview: 'Reavers are savage warriors who embrace the chaos of battle. They fight with reckless abandon, drawing strength from their wounds and the blood of their enemies.',

    mechanicalBenefits: [
        { name: 'Bloodlust', description: 'Gain 5 temporary HP on kill', type: 'passive' }
    ],

    integrationNotes: {
        actionPointSystem: 'Reaver abilities focus on raw damage and berserker rage.',
        backgroundSynergy: 'Works well with Soldier or Outlander backgrounds.',
        classCompatibility: 'Strong with Barbarian, Fighter, or Ranger classes.'
    },

    roleplayingTips: [
        'Embrace the thrill of combat',
        'Fight with reckless abandon',
        'Draw strength from adversity'
    ],

    thematicElements: {
        corePhilosophy: 'In battle, there is only victory or death.',
        mechanicalIntegration: 'Berserker rage and brutal combat.'
    },

    subPaths: {
        rageborn: {
            id: 'rageborn',
            name: 'Rageborn',
            description: 'Frenzied warriors who channel rage into devastating power',
            theme: 'Rage and reckless fury',
            icon: 'fas fa-angry',

            mechanicalBenefits: [
                { name: 'Strength Bonus', description: '+2 to Strength attribute', type: 'stat' }
            ],

            abilities: [
                {
                    id: 'blood_rage',
                    name: 'Blood Rage',
                    description: '"RAGE!" Enter a berserker rage, dealing massive damage but taking more damage.',
                    icon: 'ability_warrior_intensifyrage',
                    level: 1,
                    spellType: 'ACTION',
                    tags: ['buff', 'rage', 'damage', 'risk-reward'],
                    effectTypes: ['buff'],
                    damageTypes: [],

                    buffConfig: {
                        duration: 6,
                        durationValue: 6,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [
                            {
                                name: 'rage_damage',
                                stat: 'damage',
                                value: 8,
                                magnitude: 8,
                                magnitudeType: 'flat',
                                isPercentage: false
                            },
                            {
                                name: 'rage_vulnerability',
                                stat: 'armor_class',
                                value: -2,
                                magnitude: 2,
                                magnitudeType: 'flat',
                                isPercentage: false
                            }
                        ],
                        statusEffects: [
                            {
                                id: 'blood_rage',
                                name: 'Blood Rage',
                                description: '+8 damage dealt, -2 AC (easier to hit)'
                            }
                        ],
                        buffs: [
                            {
                                name: 'Berserker Fury',
                                description: 'Increased damage and vulnerability',
                                duration: 6,
                                effects: {
                                    damageBonus: 8,
                                    armorClassPenalty: 2
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
                        stamina: 20,
                        focus: 0,
                        actionPoints: 1
                    },

                    durationConfig: {
                        type: 'timed',
                        value: 6,
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
                    visualTheme: 'physical',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                },
                {
                    id: 'reckless_strike',
                    name: 'Reckless Strike',
                    description: '"All or nothing!" A devastating attack that leaves you vulnerable.',
                    icon: 'ability_warrior_decisivestrike',
                    level: 2,
                    spellType: 'ACTION',
                    tags: ['damage', 'physical', 'reckless', 'high-risk'],
                    effectTypes: ['damage'],
                    damageTypes: ['physical'],

                    damageConfig: {
                        damageType: 'direct',
                        elementType: 'physical',
                        formula: '8d10 + STR',
                        resolution: 'DICE',
                        hasDotEffect: false,
                        savingThrow: {
                            enabled: false
                        },
                        criticalConfig: {
                            enabled: true,
                            critType: 'dice',
                            critMultiplier: 3,
                            critDiceOnly: false
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
                        health: 10,
                        stamina: 25,
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
                    visualTheme: 'physical',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                }
            ]
        },

        bloodreaver: {
            id: 'bloodreaver',
            name: 'Bloodreaver',
            description: 'Warriors who drain life from their enemies',
            theme: 'Life steal and blood magic',
            icon: 'fas fa-tint',

            mechanicalBenefits: [
                { name: 'Battle Rage', description: 'Deal +3 damage when below half HP', type: 'passive' }
            ],

            abilities: [
                {
                    id: 'blood_siphon',
                    name: 'Blood Siphon',
                    description: '"Your blood is mine!" Drain life from an enemy with each strike.',
                    icon: 'spell_shadow_lifedrain',
                    level: 1,
                    spellType: 'ACTION',
                    tags: ['damage', 'healing', 'lifesteal', 'blood'],
                    effectTypes: ['damage', 'healing'],
                    damageTypes: ['physical', 'necrotic'],

                    damageConfig: {
                        damageType: 'direct',
                        elementType: 'physical',
                        formula: '3d8 + STR',
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

                    healingConfig: {
                        healingType: 'direct',
                        formula: '3d8 + STR',
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
                        rangeType: 'melee',
                        rangeDistance: 5,
                        targetRestrictions: ['enemy']
                    },

                    resourceCost: {
                        mana: 15,
                        health: 0,
                        stamina: 10,
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
                        charges: 2,
                        recovery: 2
                    },

                    resolution: 'DICE',
                    visualTheme: 'shadow',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                },
                {
                    id: 'blood_frenzy',
                    name: 'Blood Frenzy',
                    description: '"The scent of blood drives me!" Gain stacking attack speed for each bleeding enemy.',
                    icon: 'ability_warrior_bloodfrenzy',
                    level: 2,
                    spellType: 'PASSIVE',
                    tags: ['buff', 'passive', 'blood', 'attack-speed'],
                    effectTypes: ['buff'],
                    damageTypes: [],

                    buffConfig: {
                        duration: 0,
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        statModifiers: [],
                        statusEffects: [
                            {
                                id: 'blood_frenzy',
                                name: 'Blood Frenzy',
                                description: 'Gain +1 damage per bleeding enemy (max 5 stacks)'
                            }
                        ],
                        buffs: [
                            {
                                name: 'Frenzy Stacks',
                                description: 'Damage per bleeding enemy',
                                duration: 0,
                                effects: {
                                    damagePerStack: 1,
                                    maxStacks: 5
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
                        stamina: 0,
                        focus: 0
                    },

                    durationConfig: {
                        type: 'permanent',
                        value: 0,
                        unit: 'permanent',
                        concentration: false,
                        dispellable: false
                    },

                    cooldownConfig: {
                        type: 'none',
                        value: 0,
                        charges: 0,
                        recovery: 0
                    },

                    resolution: 'DICE',
                    visualTheme: 'physical',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                }
            ]
        },

        warlord: {
            id: 'warlord',
            name: 'Warlord',
            description: 'Battlefield commanders who inspire allies',
            theme: 'Leadership and tactical combat',
            icon: 'fas fa-crown',

            mechanicalBenefits: [
                { name: 'Charisma Bonus', description: '+1 to Charisma attribute', type: 'stat' }
            ],

            abilities: [
                {
                    id: 'battle_cry',
                    name: 'Battle Cry',
                    description: '"For glory!" Rally nearby allies with an inspiring war cry.',
                    icon: 'ability_warrior_battleshout',
                    level: 1,
                    spellType: 'ACTION',
                    tags: ['buff', 'aoe', 'leadership', 'morale'],
                    effectTypes: ['buff'],
                    damageTypes: [],

                    buffConfig: {
                        duration: 8,
                        durationValue: 8,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [
                            {
                                name: 'battle_morale',
                                stat: 'attack_power',
                                value: 3,
                                magnitude: 3,
                                magnitudeType: 'flat',
                                isPercentage: false
                            },
                            {
                                name: 'battle_defense',
                                stat: 'armor_class',
                                value: 2,
                                magnitude: 2,
                                magnitudeType: 'flat',
                                isPercentage: false
                            }
                        ],
                        statusEffects: [
                            {
                                id: 'battle_cry',
                                name: 'Battle Cry',
                                description: 'Inspired by warlord, +3 attack, +2 AC'
                            }
                        ],
                        buffs: [
                            {
                                name: 'Rallying Cry',
                                description: 'Combat bonuses',
                                duration: 8,
                                effects: {
                                    attackBonus: 3,
                                    armorBonus: 2
                                }
                            }
                        ]
                    },

                    targetingConfig: {
                        targetingType: 'area',
                        rangeType: 'self_centered',
                        rangeDistance: 0,
                        aoeShape: 'sphere',
                        aoeSize: 30,
                        targetRestrictions: ['ally', 'self']
                    },

                    resourceCost: {
                        mana: 0,
                        health: 0,
                        stamina: 15,
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
                    visualTheme: 'physical',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                },
                {
                    id: 'commanding_shout',
                    name: 'Commanding Shout',
                    description: '"Stand strong!" Bolster allies with a commanding presence.',
                    icon: 'ability_warrior_commandingshout',
                    level: 2,
                    spellType: 'ACTION',
                    tags: ['buff', 'aoe', 'health', 'morale'],
                    effectTypes: ['buff'],
                    damageTypes: [],

                    buffConfig: {
                        duration: 10,
                        durationValue: 10,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [
                            {
                                name: 'health_boost',
                                stat: 'constitution',
                                value: 2,
                                magnitude: 2,
                                magnitudeType: 'flat',
                                isPercentage: false
                            }
                        ],
                        statusEffects: [
                            {
                                id: 'commanding_presence',
                                name: 'Commanding Presence',
                                description: 'Inspired by leader, +2 CON'
                            }
                        ],
                        buffs: [
                            {
                                name: 'Leader\'s Presence',
                                description: 'Constitution boost',
                                duration: 10,
                                effects: {
                                    constitutionBonus: 2
                                }
                            }
                        ]
                    },

                    targetingConfig: {
                        targetingType: 'area',
                        rangeType: 'self_centered',
                        rangeDistance: 0,
                        aoeShape: 'sphere',
                        aoeSize: 30,
                        targetRestrictions: ['ally', 'self']
                    },

                    resourceCost: {
                        mana: 0,
                        health: 0,
                        stamina: 20,
                        focus: 0,
                        actionPoints: 2
                    },

                    durationConfig: {
                        type: 'timed',
                        value: 10,
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
                    visualTheme: 'physical',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                }
            ]
        }
    }
};

