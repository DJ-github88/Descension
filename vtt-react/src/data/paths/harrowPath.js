export const HARROW_PATH = {
    id: 'harrow',
    name: 'Harrow',
    description: 'Survivors hardened by darkness and tragedy',
    icon: 'fas fa-skull',
    overview: 'Harrows have walked through darkness and emerged scarred but unbroken. Their experiences with loss, tragedy, or supernatural horror have hardened their resolve and granted them insight into the nature of fear and despair.',
    
    mechanicalBenefits: [
        { name: 'Survivor', description: 'Can stabilize at 0 HP without death saves once per long rest', type: 'passive' }
    ],

    integrationNotes: {
        actionPointSystem: 'Harrow abilities focus on endurance, fear, and survival.',
        backgroundSynergy: 'Works well with Haunted One or Soldier backgrounds.',
        classCompatibility: 'Strong with Fighter, Ranger, or Warlock classes.'
    },

    roleplayingTips: [
        'Draw strength from past hardships',
        'Use fear as a weapon',
        'Never give up, no matter the odds'
    ],

    thematicElements: {
        corePhilosophy: 'What doesn\'t kill you makes you stronger.',
        mechanicalIntegration: 'Endurance, fear manipulation, and grim determination.'
    },

    // Top 3 abilities representing the discipline
    abilities: [
        {
            id: 'terrifying_presence',
            name: 'Terrifying Presence',
            description: '"Fear me!" Unleash an aura of dread that frightens nearby enemies.',
            icon: 'spell_shadow_psychicscream',
            level: 1,
            spellType: 'ACTION',
            tags: ['debuff', 'fear', 'aura', 'mental'],
            effectTypes: ['debuff'],
            damageTypes: ['psychic'],

            debuffConfig: {
                debuffType: 'statusEffect',
                durationValue: 4,
                durationType: 'rounds',
                durationUnit: 'rounds',
                difficultyClass: 14,
                savingThrow: 'spirit',
                saveOutcome: 'negates',
                effects: [
                    {
                        id: 'frightened',
                        name: 'Frightened',
                        description: 'Target is frightened and must move away from you',
                        statModifier: null
                    }
                ],
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
                mana: 15,
                health: 0,
                stamina: 0,
                focus: 5,
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
            visualTheme: 'shadow',
            effectMechanicsConfigs: {},
            mechanicsConfig: []
        },
        {
            id: 'plague_touch',
            name: 'Plague Touch',
            description: '"Rot and decay." Infect an enemy with a virulent disease.',
            icon: 'spell_shadow_plaguecloud',
            level: 1,
            spellType: 'ACTION',
            tags: ['damage', 'disease', 'dot', 'necrotic'],
            effectTypes: ['damage'],
            damageTypes: ['necrotic'],

            damageConfig: {
                damageType: 'dot',
                elementType: 'necrotic',
                formula: '2d6',
                resolution: 'DICE',
                hasDotEffect: true,
                dotTickInterval: 1,
                dotDuration: 5,
                savingThrowConfig: {
                    enabled: true,
                    savingThrowType: 'constitution',
                    difficultyClass: 14,
                    saveOutcome: 'negates'
                },
                criticalConfig: {
                    enabled: false
                }
            },

            targetingConfig: {
                targetingType: 'single',
                rangeType: 'melee',
                rangeDistance: 5,
                targetRestrictions: ['enemy']
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
                value: 5,
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
            visualTheme: 'nature',
            effectMechanicsConfigs: {},
            mechanicsConfig: []
        },
        {
            id: 'deaths_door',
            name: "Death's Door",
            description: '"Not yet." When reduced to 0 HP, automatically stabilize and gain temporary HP.',
            icon: 'spell_shadow_demonicfortitude',
            level: 2,
            spellType: 'REACTION',
            tags: ['defensive', 'survival', 'reaction', 'passive'],
            effectTypes: ['healing'],
            damageTypes: [],

            healingConfig: {
                healingType: 'direct',
                formula: '3d8 + CON',
                resolution: 'DICE',
                hasHotEffect: false,
                hasShieldEffect: true,
                shieldAmount: '2d8',
                criticalConfig: {
                    enabled: true,
                    critType: 'dice',
                    critMultiplier: 2,
                    critDiceOnly: false
                }
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
                            name: 'When reduced to 0 HP',
                            parameters: {
                                perspective: 'self',
                                threshold: 0,
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
                stamina: 0,
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
    ],

    subPaths: {
        dreadKnight: {
            id: 'dread_knight',
            name: 'Dread Discipline',
            description: 'The practice of wielding fear as a weapon',
            theme: 'Fear and intimidation',
            icon: 'fas fa-skull-crossbones',

            mechanicalBenefits: [
                { name: 'Hardened Mind', description: 'Advantage on saves against fear', type: 'passive' }
            ],

            abilities: [
                {
                    id: 'terrifying_presence',
                    name: 'Terrifying Presence',
                    description: '"Fear me!" Unleash an aura of dread that frightens nearby enemies.',
                    icon: 'spell_shadow_psychicscream',
                    level: 1,
                    spellType: 'ACTION',
                    tags: ['debuff', 'fear', 'aoe', 'control'],
                    effectTypes: ['debuff'],
                    damageTypes: [],

                    debuffConfig: {
                        duration: 6,
                        durationValue: 6,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [
                            {
                                name: 'fear_penalty',
                                stat: 'strength',
                                value: -2,
                                magnitude: -2,
                                magnitudeType: 'flat',
                                isPercentage: false
                            }
                        ],
                        statusEffects: [
                            {
                                id: 'frightened',
                                name: 'Frightened',
                                description: 'Terrified, -2 STR and cannot move closer to source of fear'
                            }
                        ],
                        debuffs: [
                            {
                                name: 'Dread',
                                description: 'Overcome with fear',
                                duration: 6,
                                effects: {
                                    attackPenalty: -3,
                                    movementRestriction: 'cannot_approach'
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
                        mana: 15,
                        health: 0,
                        stamina: 10,
                        focus: 0,
                        actionPoints: 2
                    },

                    durationConfig: {
                        type: 'timed',
                        value: 6,
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
                    visualTheme: 'shadow',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                },
                {
                    id: 'grim_harvest',
                    name: 'Grim Harvest',
                    description: '"Death fuels me." Gain temporary HP when you kill an enemy.',
                    icon: 'spell_shadow_soulleech_3',
                    level: 2,
                    spellType: 'REACTION',
                    tags: ['healing', 'passive', 'death', 'temporary-hp'],
                    effectTypes: ['healing'],
                    damageTypes: [],

                    healingConfig: {
                        healingType: 'direct',
                        formula: '2d8 + CON',
                        resolution: 'DICE',
                        hasHotEffect: false,
                        hasShieldEffect: true,
                        criticalConfig: {
                            enabled: false
                        }
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
                                    id: 'enemy_killed',
                                    name: 'When you kill an enemy',
                                    parameters: {
                                        event_type: 'kill',
                                        source: 'self',
                                        triggerChance: 100
                                    }
                                }
                            ]
                        },
                        triggerRole: {
                            mode: 'AUTO_CAST',
                            activationDelay: 0,
                            requiresLOS: false
                        }
                    },

                    resourceCost: {
                        mana: 0,
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
                        charges: 0,
                        recovery: 0
                    },

                    resolution: 'DICE',
                    visualTheme: 'shadow',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                },
                {
                    id: 'dark_pact',
                    name: 'Dark Pact',
                    description: '"Power demands sacrifice." Sacrifice health to deal massive shadow damage.',
                    icon: 'spell_shadow_deathpact',
                    level: 2,
                    spellType: 'ACTION',
                    tags: ['damage', 'shadow', 'sacrifice', 'high-damage'],
                    effectTypes: ['damage'],
                    damageTypes: ['shadow', 'necrotic'],

                    damageConfig: {
                        damageType: 'direct',
                        elementType: 'shadow',
                        formula: '8d8 + CON',
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
                        rangeType: 'ranged',
                        rangeDistance: 40,
                        targetRestrictions: ['enemy']
                    },

                    resourceCost: {
                        mana: 15,
                        health: 20,
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

        plaguebringer: {
            id: 'plaguebringer',
            name: 'Plague Discipline',
            description: 'The practice of spreading disease and decay',
            theme: 'Disease and corruption',
            icon: 'fas fa-biohazard',

            mechanicalBenefits: [
                { name: 'Constitution Bonus', description: '+1 to Constitution attribute', type: 'stat' }
            ],

            abilities: [
                {
                    id: 'plague_touch',
                    name: 'Plague Touch',
                    description: '"Rot and decay." Infect an enemy with a virulent disease.',
                    icon: 'spell_shadow_plaguecloud',
                    level: 1,
                    spellType: 'ACTION',
                    tags: ['damage', 'disease', 'dot', 'debuff'],
                    effectTypes: ['damage', 'debuff'],
                    damageTypes: ['poison', 'necrotic'],

                    damageConfig: {
                        damageType: 'dot',
                        elementType: 'poison',
                        formula: '1d6',
                        resolution: 'DICE',
                        hasDotEffect: true,
                        dotTickInterval: 1,
                        dotDuration: 8,
                        savingThrowConfig: {
                            enabled: true,
                            savingThrowType: 'constitution',
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
                        duration: 8,
                        durationValue: 8,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [
                            {
                                name: 'disease_weakness',
                                stat: 'constitution',
                                value: -2,
                                magnitude: -2,
                                magnitudeType: 'flat',
                                isPercentage: false
                            }
                        ],
                        statusEffects: [
                            {
                                id: 'diseased',
                                name: 'Diseased',
                                description: 'Suffering from virulent plague, taking damage over time and weakened'
                            }
                        ],
                        debuffs: [
                            {
                                name: 'Plague',
                                description: 'Infected with disease',
                                duration: 8,
                                effects: {
                                    constitutionPenalty: -2,
                                    dotDamage: '1d6'
                                }
                            }
                        ]
                    },

                    targetingConfig: {
                        targetingType: 'single',
                        rangeType: 'touch',
                        rangeDistance: 5,
                        targetRestrictions: ['enemy']
                    },

                    resourceCost: {
                        mana: 18,
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
                        dispellable: true
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
                    id: 'epidemic',
                    name: 'Epidemic',
                    description: '"Spread the sickness." Your plague spreads to nearby enemies.',
                    icon: 'spell_shadow_plaguecloud',
                    level: 2,
                    spellType: 'ACTION',
                    tags: ['damage', 'disease', 'spread', 'aoe'],
                    effectTypes: ['damage'],
                    damageTypes: ['poison'],

                    damageConfig: {
                        damageType: 'dot',
                        elementType: 'poison',
                        formula: '2d4',
                        resolution: 'DICE',
                        hasDotEffect: true,
                        dotTickInterval: 1,
                        dotDuration: 6,
                        savingThrowConfig: {
                            enabled: true,
                            savingThrowType: 'constitution',
                            difficultyClass: 15,
                            saveOutcome: 'negates'
                        },
                        criticalConfig: {
                            enabled: true,
                            critType: 'dice',
                            critMultiplier: 2,
                            critDiceOnly: false
                        },
                        spreadEffect: {
                            enabled: true,
                            spreadRange: 10,
                            spreadChance: 75
                        }
                    },

                    targetingConfig: {
                        targetingType: 'single',
                        rangeType: 'ranged',
                        rangeDistance: 40,
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
                        type: 'timed',
                        value: 6,
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
                    visualTheme: 'shadow',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                }
            ]
        },

        deathwarden: {
            id: 'deathwarden',
            name: 'Ward Discipline',
            description: 'The practice of walking the line between life and death',
            theme: 'Necromancy and undeath',
            icon: 'fas fa-ghost',

            mechanicalBenefits: [
                { name: 'Spirit Bonus', description: '+1 to Spirit attribute', type: 'stat' }
            ],

            abilities: [
                {
                    id: 'deaths_door',
                    name: "Death's Door",
                    description: '"Not yet." When reduced to 0 HP, automatically stabilize and gain temporary HP.',
                    icon: 'spell_shadow_demonicfortitude',
                    level: 2,
                    spellType: 'REACTION',
                    tags: ['healing', 'survival', 'death-save', 'passive'],
                    effectTypes: ['healing'],
                    damageTypes: [],

                    healingConfig: {
                        healingType: 'direct',
                        formula: '3d8 + CON',
                        resolution: 'DICE',
                        hasHotEffect: false,
                        hasShieldEffect: true,
                        criticalConfig: {
                            enabled: false
                        }
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
                                    id: 'health_zero',
                                    name: 'When reduced to 0 HP',
                                    parameters: {
                                        health_threshold: 0,
                                        target_entity: 'self',
                                        triggerChance: 100
                                    }
                                }
                            ]
                        },
                        triggerRole: {
                            mode: 'AUTO_CAST',
                            activationDelay: 0,
                            requiresLOS: false
                        }
                    },

                    resourceCost: {
                        mana: 0,
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
                    visualTheme: 'shadow',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                }
            ]
        }
    }
};

