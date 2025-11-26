export const MERCENARY_PATH = {
    id: 'mercenary',
    name: 'Mercenary',
    description: 'Professional soldiers who fight for coin and glory',
    icon: 'fas fa-coins',
    overview: 'Mercenaries are professional warriors who have honed their skills through countless battles. They are pragmatic, versatile, and always ready for the next contract.',
    
    mechanicalBenefits: [
        { name: 'Tactical Mind', description: '+1 to armor when fighting multiple enemies', type: 'passive' }
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

    // 3 abilities: 1 PASSIVE, 1 REACTION, 1 ACTION - player picks one of each
    abilities: [
        // PASSIVE - Tactical Mind
        {
            id: 'tactical_mind',
            name: 'Tactical Mind',
            description: '"I\'ve seen every trick in the book." Your extensive combat experience grants you enhanced tactical awareness and defensive bonuses when outnumbered.',
            icon: 'ability_warrior_vigilance',
            level: 1,
            spellType: 'PASSIVE',
            tags: ['passive', 'tactical', 'defense', 'awareness'],
            effectTypes: ['buff'],
            damageTypes: [],

            typeConfig: {
                school: 'physical',
                icon: 'ability_warrior_vigilance',
                tags: ['passive', 'tactical', 'defense', 'awareness']
            },

            buffConfig: {
                buffType: 'statEnhancement',
                effects: [
                    {
                        id: 'combat_veteran',
                        name: 'Combat Veteran',
                        description: 'Gain +1 armor for each enemy within 10 feet of you (maximum +3). Your experience fighting outnumbered keeps you alert.',
                        statModifier: {
                            stat: 'armor',
                            magnitude: 1,
                            magnitudeType: 'flat'
                        }
                    },
                    {
                        id: 'battlefield_awareness',
                        name: 'Battlefield Awareness',
                        description: 'You have advantage on initiative rolls and cannot be surprised while conscious. Your professional training keeps you ready.',
                        statModifier: {
                            stat: 'initiative',
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
            visualTheme: 'physical'
        },
        // REACTION - Parry and Riposte
        {
            id: 'parry_riposte',
            name: 'Parry and Riposte',
            description: '"Amateur move." When an enemy misses you with a melee attack, immediately parry and counter with a precise strike.',
            icon: 'ability_rogue_riposte',
            level: 1,
            spellType: 'REACTION',
            tags: ['reaction', 'damage', 'counter', 'melee'],
            effectTypes: ['damage'],
            damageTypes: ['piercing'],

            typeConfig: {
                school: 'physical',
                icon: 'ability_rogue_riposte',
                tags: ['reaction', 'damage', 'counter', 'melee']
            },

            damageConfig: {
                damageType: 'direct',
                elementType: 'piercing',
                formula: '2d6 + agility',
                resolution: 'DICE',
                hasDotEffect: false,
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
                    enabled: true,
                    logicType: 'OR',
                    compoundTriggers: [
                        {
                            id: 'attack_missed',
                            category: 'combat',
                            name: 'When an enemy misses you with a melee attack',
                            parameters: {
                                perspective: 'self',
                                attack_result: 'miss',
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
                resourceTypes: ['stamina'],
                resourceValues: { stamina: 5 },
                actionPoints: 0
            },

            cooldownConfig: {
                type: 'turn_based',
                value: 1
            },

            resolution: 'DICE',
            visualTheme: 'physical'
        },
        // ACTION - Exploit Weakness
        {
            id: 'exploit_weakness',
            name: 'Exploit Weakness',
            description: '"I see your weakness." Mark an enemy\'s vulnerable points, reducing their armor by 3 and causing you to deal 25% more damage to them for 8 rounds.',
            icon: 'ability_hunter_snipershot',
            level: 1,
            spellType: 'ACTION',
            tags: ['action', 'debuff', 'tactical', 'damage-amplification', 'mark'],
            effectTypes: ['debuff'],
            damageTypes: [],

            typeConfig: {
                school: 'physical',
                icon: 'ability_hunter_snipershot',
                tags: ['action', 'debuff', 'tactical', 'damage-amplification', 'mark']
            },

            debuffConfig: {
                debuffType: 'statusEffect',
                effects: [
                    {
                        id: 'marked_target',
                        name: 'Marked Target',
                        description: 'Target\'s weakness is exploited: -3 armor and you deal 25% more damage to them for 8 rounds.'
                    }
                ],
                durationValue: 8,
                durationType: 'rounds',
                durationUnit: 'rounds',
                saveDC: 14,
                saveType: 'agility',
                saveOutcome: 'negates',
                canBeDispelled: true
            },

            targetingConfig: {
                targetingType: 'single',
                rangeType: 'ranged',
                rangeDistance: 60,
                targetRestrictions: ['enemy']
            },

            resourceCost: {
                resourceTypes: ['stamina'],
                resourceValues: { stamina: 10 },
                actionPoints: 1
            },

            cooldownConfig: {
                type: 'short_rest',
                value: 1,
                charges: 2,
                recovery: 1
            },

            resolution: 'DICE',
            visualTheme: 'physical'
        }
    ],

    // Legacy abilities for subPaths
    legacyAbilities: [
        {
            id: 'precision_strike',
            name: 'Precision Strike',
            description: '"A perfect shot." Make a devastatingly precise attack that ignores armor.',
            icon: 'ability_rogue_surpriseattack',
            level: 1,
            spellType: 'ACTION',
            tags: ['damage', 'melee', 'precision', 'armor-piercing'],
            effectTypes: ['damage'],
            damageTypes: ['physical'],

            damageConfig: {
                damageType: 'direct',
                elementType: 'physical',
                formula: '4d8 + DEX',
                resolution: 'DICE',
                hasDotEffect: false,
                savingThrowConfig: {
                    enabled: false
                },
                criticalConfig: {
                    enabled: true,
                    critType: 'dice',
                    critMultiplier: 3,
                    critDiceOnly: false
                },
                armorPiercing: true
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
                focus: 5,
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
            visualTheme: 'physical',
            effectMechanicsConfigs: {},
            mechanicsConfig: []
        },
        {
            id: 'tactical_retreat',
            name: 'Tactical Retreat',
            description: '"Live to fight another day." Quickly withdraw from danger while maintaining defenses.',
            icon: 'ability_rogue_feint',
            level: 1,
            spellType: 'ACTION',
            tags: ['utility', 'movement', 'tactical', 'defensive'],
            effectTypes: ['utility'],
            damageTypes: [],

            utilityConfig: {
                utilityType: 'movement',
                utilitySubtype: 'retreat',
                duration: 1,
                durationUnit: 'instant',
                selectedEffects: [
                    {
                        name: 'Tactical Withdrawal',
                        description: 'Move up to 30 feet away from enemies, gaining +3 armor until end of turn',
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
    ],

    subPaths: {
        tactician: {
            id: 'tactician',
            name: 'Tactical Discipline',
            description: 'The practice of strategic combat and exploiting enemy weaknesses',
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
                                description: 'Weakness exploited, -3 armor, you deal 25% more damage to this target'
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
            name: 'Dueling Discipline',
            description: 'The practice of mastering one-on-one combat',
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
                        savingThrowConfig: {
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
            name: 'Marksmanship Discipline',
            description: 'The practice of expert marksmanship with deadly precision',
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
                        savingThrowConfig: {
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

