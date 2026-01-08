export const SENTINEL_PATH = {
    id: 'sentinel',
    name: 'Sentinel',
    description: 'Guardians and protectors who shield the innocent',
    icon: 'fas fa-shield-alt',
    overview: 'Sentinels are stalwart defenders who stand between danger and those they protect. They excel at absorbing damage, controlling the battlefield, and keeping allies safe.',
    
    mechanicalBenefits: [
        { name: 'Unwavering', description: 'Advantage on saves against being moved or knocked prone', type: 'passive' }
    ],

    integrationNotes: {
        actionPointSystem: 'Sentinel abilities focus on protection, tanking, and battlefield control.',
        backgroundSynergy: 'Works well with Soldier or Noble backgrounds.',
        classCompatibility: 'Strong with Paladin, Fighter, or Cleric classes.'
    },

    roleplayingTips: [
        'Always protect the weak',
        'Stand your ground no matter the odds',
        'Lead by example'
    ],

    thematicElements: {
        corePhilosophy: 'A true guardian never abandons their post.',
        mechanicalIntegration: 'Protection, tanking, and defensive abilities.'
    },

    // 3 abilities: 1 PASSIVE, 1 REACTION, 1 ACTION - player picks one of each
    abilities: [
        // PASSIVE - Unwavering Stance
        {
            id: 'unwavering_stance',
            name: 'Unwavering Stance',
            description: '"I will not be moved." Your training as a guardian grants you unshakeable stability and enhanced defensive capabilities.',
            icon: 'ability_warrior_defensivestance',
            level: 1,
            spellType: 'PASSIVE',
            tags: ['passive', 'defense', 'stability', 'protection'],
            effectTypes: ['buff'],
            damageTypes: [],

            typeConfig: {
                school: 'physical',
                icon: 'ability_warrior_defensivestance',
                tags: ['passive', 'defense', 'stability', 'protection']
            },

            buffConfig: {
                buffType: 'statEnhancement',
                effects: [
                    {
                        id: 'immovable',
                        name: 'Immovable',
                        description: 'You have advantage on saving throws against being moved, pushed, or knocked prone. You cannot be forcibly moved against your will.',
                        statModifier: {
                            stat: 'stability',
                            magnitude: 5,
                            magnitudeType: 'flat'
                        }
                    },
                    {
                        id: 'guardian_presence',
                        name: 'Guardian Presence',
                        description: 'Allies within 10 feet of you gain +1 armor from your protective presence.',
                        statModifier: {
                            stat: 'armor',
                            magnitude: 1,
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
            visualTheme: 'holy'
        },
        // REACTION - Intercept
        {
            id: 'intercept',
            name: 'Intercept',
            description: '"Get behind me!" When an ally within 10 feet is attacked, throw yourself in the way, taking the hit instead.',
            icon: 'ability_warrior_safeguard',
            level: 1,
            spellType: 'REACTION',
            tags: ['reaction', 'defensive', 'protection', 'ally'],
            effectTypes: ['buff'],
            damageTypes: [],

            typeConfig: {
                school: 'physical',
                icon: 'ability_warrior_safeguard',
                tags: ['reaction', 'defensive', 'protection', 'ally']
            },

            buffConfig: {
                buffType: 'statEnhancement',
                effects: [
                    {
                        id: 'intercept_damage',
                        name: 'Intercept Damage',
                        description: 'You take the damage instead of your ally. The damage is reduced by 5 (flat reduction) due to your prepared stance.',
                        statModifier: {
                            stat: 'damage_reduction',
                            magnitude: 5,
                            magnitudeType: 'flat'
                        }
                    }
                ],
                durationValue: 1,
                durationType: 'instant',
                durationUnit: 'instant',
                canBeDispelled: false
            },

            targetingConfig: {
                targetingType: 'single',
                rangeType: 'ranged',
                rangeDistance: 10,
                targetRestrictions: ['ally']
            },

            triggerConfig: {
                global: {
                    enabled: true,
                    logicType: 'OR',
                    compoundTriggers: [
                        {
                            id: 'ally_attacked',
                            category: 'combat',
                            name: 'When an ally within 10 feet is attacked',
                            parameters: {
                                perspective: 'ally',
                                target_type: 'ally',
                                triggerChance: 100
                            }
                        }
                    ]
                },
                triggerRole: {
                    mode: 'CONDITIONAL',
                    activationDelay: 0,
                    requiresLOS: true
                }
            },

            resourceCost: {
                actionPoints: 0
            },

            cooldownConfig: {
                type: 'turn_based',
                value: 1
            },

            resolution: 'DICE',
            visualTheme: 'holy'
        },
        // ACTION - Shield Wall
        {
            id: 'shield_wall',
            name: 'Shield Wall',
            description: '"None shall pass!" Raise your shield in a defensive stance, gaining +5 armor and 10 damage reduction for 6 rounds.',
            icon: 'ability_warrior_shieldwall',
            level: 1,
            spellType: 'ACTION',
            tags: ['action', 'buff', 'defense', 'shield', 'damage-reduction'],
            effectTypes: ['buff'],
            damageTypes: [],

            typeConfig: {
                school: 'physical',
                icon: 'ability_warrior_shieldwall',
                tags: ['action', 'buff', 'defense', 'shield', 'damage-reduction']
            },

            buffConfig: {
                buffType: 'statusEffect',
                effects: [
                    {
                        id: 'shield_wall',
                        name: 'Shield Wall',
                        description: 'Gain +5 armor and 10 damage reduction (flat) for 6 rounds. Your movement speed is reduced by half while in this stance.'
                    }
                ],
                durationValue: 6,
                durationType: 'rounds',
                durationUnit: 'rounds',
                canBeDispelled: false
            },

            targetingConfig: {
                targetingType: 'self'
            },

            resourceCost: {
                resourceTypes: ['stamina'],
                resourceValues: { stamina: 15 },
                actionPoints: 1
            },

            cooldownConfig: {
                type: 'short_rest',
                value: 1,
                charges: 2,
                recovery: 1
            },

            resolution: 'DICE',
            visualTheme: 'holy'
        }
    ],

    // Legacy abilities for subPaths
    legacyAbilities: [
        {
            id: 'taunt',
            name: 'Taunt',
            description: '"Face me!" Force enemies to attack you instead of allies.',
            icon: 'spell_nature_reincarnation',
            level: 1,
            spellType: 'ACTION',
            tags: ['control', 'taunt', 'aggro', 'forced'],
            effectTypes: ['debuff'],
            damageTypes: [],

            debuffConfig: {
                duration: 4,
                durationValue: 4,
                durationType: 'rounds',
                durationUnit: 'rounds',
                statModifiers: [],
                statusEffects: [
                    {
                        id: 'taunted',
                        name: 'Taunted',
                        description: 'Forced to attack you'
                    }
                ],
                debuffs: [
                    {
                        name: 'Forced Aggro',
                        description: 'Must attack taunter',
                        duration: 4,
                        effects: {
                            forcedTarget: 'self'
                        }
                    }
                ],
                difficultyClass: 14,
                savingThrow: 'spirit',
                saveOutcome: 'negates',
                canBeDispelled: true,
                concentrationRequired: false
            },

            targetingConfig: {
                targetingType: 'area',
                rangeType: 'self_centered',
                rangeDistance: 0,
                aoeShape: 'sphere',
                aoeSize: 30,
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
                value: 4,
                unit: 'rounds',
                concentration: false,
                dispellable: true
            },

            cooldownConfig: {
                type: 'short_rest',
                value: 1,
                charges: 2,
                recovery: 2
            },

            resolution: 'DICE',
            visualTheme: 'holy',
            effectMechanicsConfigs: {},
            mechanicsConfig: []
        },
        {
            id: 'last_stand',
            name: 'Last Stand',
            description: '"Not while I draw breath!" When health drops critically low, become unkillable temporarily.',
            icon: 'ability_warrior_defensivestance',
            level: 2,
            spellType: 'REACTION',
            tags: ['defensive', 'survival', 'reaction', 'immortal'],
            effectTypes: ['buff'],
            damageTypes: [],

            buffConfig: {
                duration: 3,
                durationValue: 3,
                durationType: 'rounds',
                durationUnit: 'rounds',
                statModifiers: [
                    {
                        name: 'unbreakable',
                        stat: 'health_threshold',
                        value: 1,
                        magnitude: 1,
                        magnitudeType: 'flat',
                        isPercentage: false
                    }
                ],
                statusEffects: [
                    {
                        id: 'last_stand',
                        name: 'Last Stand',
                        description: 'Cannot be reduced below 1 HP'
                    }
                ],
                buffs: [
                    {
                        name: 'Unbreakable Will',
                        description: 'Temporary immortality',
                        duration: 3,
                        effects: {
                            healthFloor: 1
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
                            id: 'health_threshold',
                            name: 'When health drops below 25%',
                            parameters: {
                                perspective: 'self',
                                threshold: 25,
                                condition: 'below',
                                triggerChance: 100
                            }
                        }
                    ]
                },
                triggerRole: {
                    mode: 'REACTIVE',
                    activationDelay: 0,
                    requiresLOS: false
                }
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
                value: 3,
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
            visualTheme: 'holy',
            effectMechanicsConfigs: {},
            mechanicsConfig: []
        }
    ],

    subPaths: {
        bulwark: {
            id: 'bulwark',
            name: 'Bulwark',
            description: 'Immovable defenders who absorb punishment',
            theme: 'Defense and damage absorption',
            icon: 'fas fa-shield',

            mechanicalBenefits: [
                { name: 'Constitution Bonus', description: '+2 to Constitution attribute', type: 'stat' }
            ],

            abilities: [
                {
                    id: 'shield_wall',
                    name: 'Shield Wall',
                    description: '"None shall pass!" Raise your shield, massively increasing your defenses.',
                    icon: 'ability_warrior_shieldwall',
                    level: 1,
                    spellType: 'ACTION',
                    tags: ['buff', 'defense', 'shield', 'damage-reduction'],
                    effectTypes: ['buff'],
                    damageTypes: [],

                    buffConfig: {
                        duration: 6,
                        durationValue: 6,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [
                            {
                                name: 'shield_defense',
                                stat: 'armor',
                                value: 5,
                                magnitude: 5,
                                magnitudeType: 'flat',
                                isPercentage: false
                            },
                            {
                                name: 'damage_reduction',
                                stat: 'damage_reduction',
                                value: 10,
                                magnitude: 10,
                                magnitudeType: 'flat',
                                isPercentage: false,
                                formula: '2d6 + 4'
                            }
                        ],
                        statusEffects: [
                            {
                                id: 'shield_wall',
                                name: 'Shield Wall',
                                description: '+5 armor, take 50% reduced damage, cannot move'
                            }
                        ],
                        buffs: [
                            {
                                name: 'Defensive Stance',
                                description: 'Maximum defense',
                                duration: 6,
                                effects: {
                                    armorBonus: 5,
                                    damageReduction: 50,
                                    movementRestriction: 'immobile'
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
                        actionPoints: 2
                    },

                    durationConfig: {
                        type: 'timed',
                        value: 6,
                        unit: 'rounds',
                        concentration: true,
                        dispellable: false
                    },

                    cooldownConfig: {
                        type: 'long_rest',
                        value: 1,
                        charges: 1,
                        recovery: 1
                    },

                    resolution: 'DICE',
                    visualTheme: 'holy',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                },
                {
                    id: 'taunt',
                    name: 'Taunt',
                    description: '"Face me, coward!" Force enemies to attack you instead of your allies.',
                    icon: 'spell_nature_reincarnation',
                    level: 1,
                    spellType: 'ACTION',
                    tags: ['debuff', 'taunt', 'control', 'threat'],
                    effectTypes: ['debuff'],
                    damageTypes: [],

                    debuffConfig: {
                        duration: 4,
                        durationValue: 4,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [],
                        statusEffects: [
                            {
                                id: 'taunted',
                                name: 'Taunted',
                                description: 'Forced to attack the Sentinel'
                            }
                        ],
                        debuffs: [
                            {
                                name: 'Provoked',
                                description: 'Must attack taunter',
                                duration: 4,
                                effects: {
                                    forcedTarget: 'caster',
                                    threatIncrease: 1000
                                }
                            }
                        ]
                    },

                    targetingConfig: {
                        targetingType: 'area',
                        rangeType: 'self_centered',
                        rangeDistance: 0,
                        aoeShape: 'sphere',
                        aoeSize: 15,
                        targetRestrictions: ['enemy']
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
                        value: 4,
                        unit: 'rounds',
                        concentration: false,
                        dispellable: true
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

        protector: {
            id: 'protector',
            name: 'Protection Discipline',
            description: 'The practice of selflessly shielding and protecting allies',
            theme: 'Ally protection and intervention',
            icon: 'fas fa-hands-helping',

            mechanicalBenefits: [
                { name: 'Guardian', description: 'Allies within 10 feet gain +1 armor', type: 'passive' }
            ],

            abilities: [
                {
                    id: 'guardian_angel',
                    name: 'Guardian Angel',
                    description: '"I\'ve got you!" Intercept an attack meant for an ally.',
                    icon: 'spell_holy_guardianspirit',
                    level: 2,
                    spellType: 'REACTION',
                    tags: ['protection', 'intercept', 'ally-save', 'selfless'],
                    effectTypes: ['utility'],
                    damageTypes: [],

                    utilityConfig: {
                        utilityType: 'protection',
                        utilitySubtype: 'intercept',
                        duration: 0,
                        durationUnit: 'instant',
                        selectedEffects: [
                            {
                                name: 'Intercept Attack',
                                description: 'Teleport to an ally and take the damage meant for them',
                                customName: 'Guardian Angel'
                            }
                        ],
                        difficultyClass: 0,
                        concentration: false
                    },

                    targetingConfig: {
                        targetingType: 'single',
                        rangeType: 'ranged',
                        rangeDistance: 30,
                        targetRestrictions: ['ally']
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
                                        min_damage: 1,
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
                        mana: 10,
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
                    visualTheme: 'holy',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                },
                {
                    id: 'sacrifice',
                    name: 'Sacrifice',
                    description: '"Take me instead!" Redirect all damage from an ally to yourself for a short time.',
                    icon: 'spell_holy_sealofsacrifice',
                    level: 2,
                    spellType: 'ACTION',
                    tags: ['protection', 'sacrifice', 'redirect', 'ally-save'],
                    effectTypes: ['buff'],
                    damageTypes: [],

                    buffConfig: {
                        duration: 4,
                        durationValue: 4,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [],
                        statusEffects: [
                            {
                                id: 'sacrifice_link',
                                name: 'Sacrifice Link',
                                description: 'All damage to linked ally is redirected to you'
                            }
                        ],
                        buffs: [
                            {
                                name: 'Protective Sacrifice',
                                description: 'Damage redirection',
                                duration: 4,
                                effects: {
                                    damageRedirect: 100,
                                    linkedAlly: true
                                }
                            }
                        ]
                    },

                    targetingConfig: {
                        targetingType: 'single',
                        rangeType: 'ranged',
                        rangeDistance: 30,
                        targetRestrictions: ['ally']
                    },

                    resourceCost: {
                        mana: 20,
                        health: 0,
                        stamina: 15,
                        focus: 0,
                        actionPoints: 2
                    },

                    durationConfig: {
                        type: 'timed',
                        value: 4,
                        unit: 'rounds',
                        concentration: true,
                        dispellable: false
                    },

                    cooldownConfig: {
                        type: 'long_rest',
                        value: 1,
                        charges: 1,
                        recovery: 1
                    },

                    resolution: 'DICE',
                    visualTheme: 'holy',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                }
            ]
        },

        guardian: {
            id: 'guardian',
            name: 'Control Discipline',
            description: 'The practice of controlling the battlefield and locking down enemies',
            theme: 'Crowd control and area denial',
            icon: 'fas fa-lock',

            mechanicalBenefits: [
                { name: 'Strength Bonus', description: '+1 to Strength attribute', type: 'stat' }
            ],

            abilities: [
                {
                    id: 'lockdown',
                    name: 'Lockdown',
                    description: '"You\'re not going anywhere!" Root enemies in place around you.',
                    icon: 'spell_frost_chainsofice',
                    level: 1,
                    spellType: 'ACTION',
                    tags: ['debuff', 'control', 'root', 'aoe'],
                    effectTypes: ['debuff'],
                    damageTypes: [],

                    debuffConfig: {
                        duration: 5,
                        durationValue: 5,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [],
                        statusEffects: [
                            {
                                id: 'rooted',
                                name: 'Rooted',
                                description: 'Cannot move'
                            }
                        ],
                        debuffs: [
                            {
                                name: 'Immobilized',
                                description: 'Movement prevented',
                                duration: 5,
                                effects: {
                                    movementSpeed: 0,
                                    cannotMove: true
                                }
                            }
                        ]
                    },

                    targetingConfig: {
                        targetingType: 'area',
                        rangeType: 'self_centered',
                        rangeDistance: 0,
                        aoeShape: 'sphere',
                        aoeSize: 10,
                        targetRestrictions: ['enemy']
                    },

                    resourceCost: {
                        mana: 15,
                        health: 0,
                        stamina: 15,
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
                    visualTheme: 'arcane',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                },
                {
                    id: 'unbreakable',
                    name: 'Unbreakable',
                    description: '"I will not fall!" Become immune to crowd control effects.',
                    icon: 'spell_holy_ardentdefender',
                    level: 2,
                    spellType: 'ACTION',
                    tags: ['buff', 'immunity', 'crowd-control', 'defensive'],
                    effectTypes: ['buff'],
                    damageTypes: [],

                    buffConfig: {
                        duration: 6,
                        durationValue: 6,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [],
                        statusEffects: [
                            {
                                id: 'unbreakable',
                                name: 'Unbreakable',
                                description: 'Immune to stun, root, fear, and knockback effects'
                            }
                        ],
                        buffs: [
                            {
                                name: 'Unstoppable',
                                description: 'CC immunity',
                                duration: 6,
                                effects: {
                                    stunImmune: true,
                                    rootImmune: true,
                                    fearImmune: true,
                                    knockbackImmune: true
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
                        stamina: 25,
                        focus: 0,
                        actionPoints: 2
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
                    visualTheme: 'holy',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                }
            ]
        }
    }
};

