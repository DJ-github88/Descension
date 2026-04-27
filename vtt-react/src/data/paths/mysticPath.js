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

    abilities: [
        {
            id: 'spiritual_attunement',
            name: 'Spiritual Attunement',
            description: '"The universe speaks to those who listen." Your deep connection to spiritual energy grants you enhanced perception and resistance to mental intrusion.',
            icon: 'Psychic/Focused Mind',
            level: 1,
            spellType: 'PASSIVE',
            tags: ['passive', 'spiritual', 'perception', 'resistance'],
            effectTypes: ['buff'],
            damageTypes: [],

            typeConfig: {
                school: 'spiritual',
                icon: 'Psychic/Focused Mind',
                tags: ['passive', 'spiritual', 'perception', 'resistance']
            },

            buffConfig: {
                buffType: 'statEnhancement',
                effects: [
                    {
                        id: 'spirit_sense',
                        name: 'Spirit Sense',
                        description: 'You can sense life energy within 30 feet, detecting living creatures even through thin barriers. You also have advantage on saving throws against charm and fear effects.',
                        statModifier: {
                            stat: 'perception',
                            magnitude: 2,
                            magnitudeType: 'flat'
                        }
                    },
                    {
                        id: 'mental_ward',
                        name: 'Mental Ward',
                        description: 'Your spiritual discipline grants resistance to psychic damage (50% reduction).',
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
            visualTheme: 'holy'
        },
        {
            id: 'spirit_ward',
            name: 'Spirit Ward',
            description: '"My spirit shields me!" When you or an ally within 30 feet takes damage, instantly manifest a protective barrier of spiritual energy to reduce the damage.',
            icon: 'Radiant/Radiant Golden Shield',
            level: 1,
            spellType: 'REACTION',
            tags: ['reaction', 'defensive', 'protection', 'spiritual'],
            effectTypes: ['buff'],
            damageTypes: [],

            typeConfig: {
                school: 'spiritual',
                icon: 'Radiant/Radiant Golden Shield',
                tags: ['reaction', 'defensive', 'protection', 'spiritual']
            },

            buffConfig: {
                buffType: 'statEnhancement',
                effects: [
                    {
                        id: 'spirit_shield',
                        name: 'Spirit Shield',
                        description: 'Reduces incoming damage by 1d6 × caster level (flat reduction applied before damage is taken).',
                        statModifier: {
                            stat: 'damage_reduction',
                            magnitudeType: 'dice',
                            formula: '1d6 * level'
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
                rangeDistance: 30,
                targetRestrictions: ['ally', 'self']
            },

            triggerConfig: {
                global: {
                    enabled: true,
                    logicType: 'OR',
                    compoundTriggers: [
                        {
                            id: 'damage_taken',
                            category: 'combat',
                            name: 'When you or ally takes damage',
                            parameters: {
                                perspective: 'ally',
                                target_type: 'ally_or_self',
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
                resourceTypes: ['mana'],
                resourceValues: { mana: 4 },
                actionPoints: 0
            },

            cooldownConfig: {
                type: 'short_rest',
                value: 2,
                charges: 2,
                recovery: 1
            },

            resolution: 'DICE',
            visualTheme: 'holy'
        },
        {
            id: 'soul_drain',
            name: 'Soul Drain',
            description: '"Your essence is mine." Drain the life force from an enemy, dealing necrotic damage and healing yourself for the same amount.',
            icon: 'Necrotic/Drain Soul',
            level: 1,
            spellType: 'ACTION',
            tags: ['action', 'damage', 'healing', 'drain', 'soul'],
            effectTypes: ['damage', 'healing'],
            damageTypes: ['necrotic'],

            typeConfig: {
                school: 'necrotic',
                icon: 'Necrotic/Drain Soul',
                tags: ['action', 'damage', 'healing', 'drain', 'soul']
            },

            damageConfig: {
                damageType: 'direct',
                elementType: 'necrotic',
                formula: '2d8 + spirit',
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
                formula: '2d8 + spirit',
                resolution: 'DICE',
                hasHotEffect: false,
                hasShieldEffect: false
            },

            targetingConfig: {
                targetingType: 'single',
                rangeType: 'ranged',
                rangeDistance: 30,
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
                recovery: 2
            },

            resolution: 'DICE',
            visualTheme: 'shadow'
        }
    ],

    subPaths: {
    }
};