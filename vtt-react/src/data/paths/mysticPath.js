export const MYSTIC_PATH = {
    id: 'mystic',
    name: 'Mystic',
    description: 'Seekers of inner enlightenment and spiritual harmony',
    icon: 'fas fa-om',
    overview: 'Mystics pursue enlightenment through meditation, inner balance, and spiritual discipline. They manipulate life energy, achieve transcendent states, and harmonize mind, body, and spirit.',
    
    mechanicalBenefits: [
        { name: 'Energy Sense', description: 'Can sense life energy within 30 feet', type: 'passive' }
    ],

    integrationNotes: {
        actionPointSystem: 'Mystic abilities focus on energy manipulation and spiritual balance.',
        backgroundSynergy: 'Works well with Hermit or Sage backgrounds.',
        classCompatibility: 'Strong with Monk, Cleric, or Druid classes.'
    },

    roleplayingTips: [
        'Embrace inner peace and spiritual discipline',
        'Seek balance in all things',
        'Use meditation and contemplation'
    ],

    thematicElements: {
        corePhilosophy: 'Balance between mind, body, and spirit leads to true power.',
        mechanicalIntegration: 'Energy manipulation and spiritual transcendence.'
    },

    // Top 3 abilities representing the discipline
    abilities: [
        // From Energy Discipline
        {
            id: 'energy_burst',
                    name: 'Energy Burst',
                    description: '"Release!" Unleash a burst of pure spiritual energy that damages enemies in a cone.',
                    icon: 'spell_nature_wispsplode',
                    level: 1,
                    spellType: 'ACTION',
                    tags: ['damage', 'energy', 'cone', 'spiritual'],
                    effectTypes: ['damage'],
                    damageTypes: ['force'],

                    damageConfig: {
                        damageType: 'direct',
                        elementType: 'force',
                        formula: '3d8 + SPI',
                        resolution: 'DICE',
                        hasDotEffect: false,
                        savingThrowConfig: {
                            enabled: true,
                            savingThrowType: 'agility',
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
                        rangeType: 'self_centered',
                        rangeDistance: 0,
                        aoeShape: 'cone',
                        aoeSize: 30,
                        targetRestrictions: ['enemy']
                    },

                    resourceCost: {
                        mana: 15,
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
                        charges: 2,
                        recovery: 2
                    },

                    resolution: 'DICE',
                    visualTheme: 'arcane',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                },
                {
                    id: 'chakra_shield',
                    name: 'Chakra Shield',
                    description: '"My energy protects me." Form a protective barrier of spiritual energy that absorbs damage.',
                    icon: 'spell_holy_powerwordbarrier',
                    level: 2,
                    spellType: 'ACTION',
                    tags: ['buff', 'shield', 'protection', 'energy'],
                    effectTypes: ['buff'],
                    damageTypes: [],

                    buffConfig: {
                        duration: 10,
                        durationValue: 10,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [
                            {
                                name: 'damage_absorption',
                                stat: 'shield',
                                value: 20,
                                magnitude: 20,
                                magnitudeType: 'flat',
                                isPercentage: false,
                                formula: '3d6 + SPI'
                            }
                        ],
                        statusEffects: [
                            {
                                id: 'chakra_shield',
                                name: 'Chakra Shield',
                                description: 'Protected by spiritual energy barrier'
                            }
                        ],
                        buffs: [
                            {
                                name: 'Energy Barrier',
                                description: 'Absorbs damage',
                                duration: 10,
                                effects: {
                                    damageAbsorption: '3d6 + SPI'
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
                        mana: 18,
                        health: 0,
                        stamina: 0,
                        focus: 0,
                        actionPoints: 2
                    },

                    durationConfig: {
                        type: 'timed',
                        value: 10,
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
        // From Soul Discipline
        {
            id: 'soul_drain',
            name: 'Soul Drain',
            description: '"Your essence is mine." Drain the life force from an enemy to heal yourself.',
            icon: 'spell_shadow_lifedrain02',
            level: 1,
            spellType: 'ACTION',
            tags: ['damage', 'healing', 'drain', 'soul'],
            effectTypes: ['damage', 'healing'],
            damageTypes: ['necrotic'],

            damageConfig: {
                damageType: 'direct',
                elementType: 'necrotic',
                formula: '2d8 + SPI',
                resolution: 'DICE',
                hasDotEffect: false,
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

            healingConfig: {
                healingType: 'direct',
                formula: '2d8 + SPI',
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
                targetRestrictions: ['enemy']
            },

            resourceCost: {
                mana: 15,
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
                charges: 2,
                recovery: 2
            },

            resolution: 'DICE',
            visualTheme: 'shadow',
            effectMechanicsConfigs: {},
            mechanicsConfig: []
        }
    ],

    subPaths: {
        // SubPaths defined in enhancedPathData.js
    }
};