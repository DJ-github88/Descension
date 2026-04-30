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

    // 3 abilities: 1 PASSIVE, 1 REACTION, 1 ACTION - player picks one of each
    abilities: [
        // PASSIVE - Survivor's Grit
        {
            id: 'survivors_grit',
            name: "Survivor's Grit",
            description: '"I\'ve walked through worse." Your experiences have hardened your body and mind against death and despair.',
            icon: 'Utility/Steadfast Bulwark',
            level: 1,
            spellType: 'PASSIVE',
            tags: ['passive', 'survival', 'resistance', 'endurance'],
            effectTypes: ['buff'],
            damageTypes: [],

            typeConfig: {
                school: 'shadow',
                icon: 'Utility/Steadfast Bulwark',
                tags: ['passive', 'survival', 'resistance', 'endurance']
            },

            buffConfig: {
                buffType: 'statEnhancement',
                effects: [
                    {
                        id: 'death_ward',
                        name: 'Death Ward',
                        description: 'Once per long rest, when you drop to 0 HP, you automatically stabilize without making death saving throws.',
                        statModifier: {
                            stat: 'death_saves',
                            magnitude: 1,
                            magnitudeType: 'flat'
                        }
                    },
                    {
                        id: 'fear_resistance',
                        name: 'Fear Resistance',
                        description: 'You have advantage on saving throws against fear effects and resistance to psychic damage (50% reduction).',
                        statModifier: {
                            stat: 'psychic_resistance',
                            magnitude: 50,
                            magnitudeType: 'percentage'
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
        // REACTION - Defiant Stand
        {
            id: 'defiant_stand',
            name: 'Defiant Stand',
            description: '"I will not fall!" When reduced to below 25% health, your survival instincts kick in, granting temporary hit points and reducing incoming damage.',
            icon: 'Utility/Bound Warrior',
            level: 1,
            spellType: 'REACTION',
            tags: ['reaction', 'defensive', 'survival', 'buff'],
            effectTypes: ['buff', 'healing'],
            damageTypes: [],

            typeConfig: {
                school: 'shadow',
                icon: 'Utility/Bound Warrior',
                tags: ['reaction', 'defensive', 'survival', 'buff']
            },

            buffConfig: {
                buffType: 'statEnhancement',
                effects: [
                    {
                        id: 'defiant_resolve',
                        name: 'Defiant Resolve',
                        description: 'Heal for 1d4 × level plus your current remaining health.',
                        mechanicsText: 'Heals 1d4 × level + current remaining health'
                    }
                ],
                durationValue: 2,
                durationType: 'rounds',
                durationUnit: 'rounds',
                canBeDispelled: false
            },

            healingConfig: {
                healingType: 'heal',
                formula: '1d4 * level + current_health',
                resolution: 'DICE'
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
                            id: 'health_threshold',
                            category: 'health',
                            name: 'When your health drops below 25%',
                            parameters: {
                                perspective: 'self',
                                percentage: 25,
                                comparison: 'less_than',
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
                actionPoints: 1
            },

            cooldownConfig: {
                type: 'long_rest',
                value: 1,
                charges: 1,
                recovery: 1
            },

            resolution: 'DICE',
            visualTheme: 'shadow'
        },
        // ACTION - Terrifying Presence
        {
            id: 'terrifying_presence',
            name: 'Terrifying Presence',
            description: '"Fear me!" Unleash an aura of dread that frightens all enemies within 30 feet.',
            icon: 'Psychic/Hypnotic Eye',
            level: 1,
            spellType: 'ACTION',
            tags: ['action', 'debuff', 'fear', 'aura', 'mental'],
            effectTypes: ['debuff'],
            damageTypes: ['psychic'],

            typeConfig: {
                school: 'shadow',
                icon: 'Psychic/Hypnotic Eye',
                tags: ['action', 'debuff', 'fear', 'aura', 'mental']
            },

            debuffConfig: {
                debuffType: 'statusEffect',
                effects: [
                    {
                        id: 'fear',
                        name: 'Frightened',
                        description: 'Frightened for 4 rounds with disadvantage on attacks and ability checks. Must move away each turn.'
                    }
                ],
                durationValue: 4,
                durationType: 'rounds',
                durationUnit: 'rounds',
                saveDC: 14,
                saveType: 'spirit',
                saveOutcome: 'negates',
                canBeDispelled: true
            },

            targetingConfig: {
                targetingType: 'area',
                rangeType: 'self_centered',
                rangeDistance: 0,
                aoeShape: 'sphere',
                aoeParameters: { radius: 30 },
                targetRestrictions: ['enemy']
            },

            resourceCost: {
                resourceTypes: ['mana'],
                resourceValues: { mana: 4 },
                actionPoints: 2
            },

            cooldownConfig: {
                type: 'short_rest',
                value: 1,
                charges: 2,
                recovery: 1
            },

            resolution: 'DICE',
            visualTheme: 'shadow'
        }
    ],

    // Legacy abilities for subPaths (kept for reference)
    legacyAbilities: [
        {
            id: 'plague_touch_legacy',
            name: 'Plague Touch',
            description: '"Rot and decay." Infect an enemy with a virulent disease.',
            icon: 'Necrotic/Necrotic Skull',
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
                resourceTypes: ['mana'],
                resourceValues: { mana: 4 },
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
            id: 'deaths_door_legacy',
            name: "Death's Door",
            description: '"Not yet." When reduced to 0 HP, automatically stabilize and gain temporary HP.',
            icon: 'Utility/Grim Reaper',
            level: 2,
            spellType: 'REACTION',
            tags: ['defensive', 'survival', 'reaction'],
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
                    id: 'dread_terrifying_presence',
                    name: 'Terrifying Presence',
                    description: '"Fear me!" Unleash an aura of dread that frightens nearby enemies.',
                    icon: 'Psychic/Hypnotic Eye',
                    level: 1,
                    spellType: 'ACTION',
                    tags: ['debuff', 'fear', 'aoe', 'control'],
                    effectTypes: ['debuff'],
                    damageTypes: [],

                    debuffConfig: {
                        durationValue: 6,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        effects: [
                            {
                                id: 'frightened',
                                name: 'Frightened',
                                description: 'Frightened with -2 STR penalty, cannot approach source of fear.'
                            }
                        ],
                        saveDC: 13,
                        saveType: 'spirit',
                        saveOutcome: 'negates',
                        canBeDispelled: true
                    },

                    targetingConfig: {
                        targetingType: 'area',
                        rangeType: 'self_centered',
                        rangeDistance: 0,
                        aoeShape: 'sphere',
                        aoeParameters: { radius: 15 },
                        targetRestrictions: ['enemy']
                    },

                    resourceCost: {
                        resourceTypes: ['mana'],
                        resourceValues: { mana: 4 },
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
                    icon: 'Necrotic/Drain Soul',
                    level: 2,
                    spellType: 'REACTION',
                    tags: ['healing', 'reaction', 'death', 'temporary hp'],
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
                    icon: 'Void/Corrupted Eye',
                    level: 2,
                    spellType: 'ACTION',
                    tags: ['damage', 'shadow', 'sacrifice', 'high damage'],
                    effectTypes: ['damage'],
                    damageTypes: ['necrotic'],

                    damageConfig: {
                        damageType: 'direct',
                        elementType: 'necrotic',
                        formula: '4d8 + CON',
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
                        resourceTypes: ['mana', 'health'],
                        resourceValues: { mana: 7, health: 20 },
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
                    id: 'plaguebringer_touch',
                    name: 'Plague Touch',
                    description: '"Rot and decay." Infect an enemy with a virulent disease.',
                    icon: 'Necrotic/Necrotic Skull',
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
                        durationValue: 8,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        effects: [
                            {
                                id: 'diseased',
                                name: 'Diseased',
                                description: 'Suffering from virulent plague, taking damage over time.'
                            }
                        ],
                        saveDC: 13,
                        saveType: 'constitution',
                        saveOutcome: 'halves',
                        canBeDispelled: true
                    },

                    targetingConfig: {
                        targetingType: 'single',
                        rangeType: 'touch',
                        rangeDistance: 5,
                        targetRestrictions: ['enemy']
                    },

                    resourceCost: {
                        resourceTypes: ['mana'],
                        resourceValues: { mana: 4 },
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
                    icon: 'Necrotic/Necrotic Skull',
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
                        resourceTypes: ['mana'],
                        resourceValues: { mana: 8 },
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
                    id: 'warden_deaths_door',
                    name: "Death's Door",
                    description: '"Not yet." When reduced to 0 HP, automatically stabilize and gain temporary HP.',
                    icon: 'Utility/Grim Reaper',
                    level: 2,
                    spellType: 'REACTION',
                    tags: ['healing', 'survival', 'death save', 'reaction'],
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
                    visualTheme: 'shadow',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                }
            ]
        }
    }
};
