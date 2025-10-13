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

    subPaths: {
        chakraAdept: {
            id: 'chakra_adept',
            name: 'Chakra Adept',
            description: 'Masters of internal energy flow',
            theme: 'Energy manipulation and enhancement',
            icon: 'fas fa-yin-yang',

            mechanicalBenefits: [
                { name: 'Spirit Bonus', description: '+1 to Spirit attribute', type: 'stat' }
            ],

            abilities: [
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
                        savingThrow: {
                            enabled: true,
                            attribute: 'agility',
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
                {
                    id: 'transcendent_strike',
                    name: 'Transcendent Strike',
                    description: '"Body and spirit as one!" Channel spiritual energy into your weapon for a devastating strike.',
                    icon: 'ability_monk_palmstrike',
                    level: 2,
                    spellType: 'ACTION',
                    tags: ['damage', 'melee', 'spiritual', 'strike'],
                    effectTypes: ['damage'],
                    damageTypes: ['force', 'physical'],

                    damageConfig: {
                        damageType: 'direct',
                        elementType: 'force',
                        formula: '4d10 + SPI + STR',
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
                        mana: 20,
                        health: 0,
                        stamina: 10,
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
                    visualTheme: 'arcane',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                },
                {
                    id: 'spirit_bond',
                    name: 'Spirit Bond',
                    description: '"Our souls are linked." Create a spiritual bond with an ally, sharing buffs and healing.',
                    icon: 'spell_holy_prayerofspirit',
                    level: 2,
                    spellType: 'ACTION',
                    tags: ['buff', 'bond', 'healing-share', 'ally'],
                    effectTypes: ['buff'],
                    damageTypes: [],

                    buffConfig: {
                        duration: 10,
                        durationValue: 10,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [],
                        statusEffects: [
                            {
                                id: 'spirit_bond',
                                name: 'Spirit Bond',
                                description: 'Healing and buffs affecting you also affect your bonded ally at 50% effectiveness'
                            }
                        ],
                        buffs: [
                            {
                                name: 'Spiritual Link',
                                description: 'Shared benefits',
                                duration: 10,
                                effects: {
                                    healingShare: 50,
                                    buffShare: 50
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
                        stamina: 0,
                        focus: 0,
                        actionPoints: 2
                    },

                    durationConfig: {
                        type: 'timed',
                        value: 10,
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
                    visualTheme: 'holy',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                }
            ]
        },

        soulWeaver: {
            id: 'soul_weaver',
            name: 'Soul Weaver',
            description: 'Manipulators of life essence and spiritual bonds',
            theme: 'Life force manipulation and soul binding',
            icon: 'fas fa-heart',

            mechanicalBenefits: [
                { name: 'Inner Peace', description: 'Advantage on concentration checks', type: 'passive' }
            ],

            abilities: [
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
                },
                {
                    id: 'soul_rend',
                    name: 'Soul Rend',
                    description: '"Your soul is mine to command." Tear at an enemy\'s soul, dealing damage and weakening them.',
                    icon: 'spell_shadow_soulleech_2',
                    level: 2,
                    spellType: 'ACTION',
                    tags: ['damage', 'debuff', 'soul', 'necrotic'],
                    effectTypes: ['damage', 'debuff'],
                    damageTypes: ['necrotic'],

                    damageConfig: {
                        damageType: 'direct',
                        elementType: 'necrotic',
                        formula: '4d6 + SPI',
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
                        duration: 6,
                        durationValue: 6,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [
                            {
                                name: 'soul_weakness',
                                stat: 'spirit',
                                value: -3,
                                magnitude: -3,
                                magnitudeType: 'flat',
                                isPercentage: false
                            }
                        ],
                        statusEffects: [
                            {
                                id: 'soul_rended',
                                name: 'Soul Rended',
                                description: 'Soul damaged, -3 Spirit'
                            }
                        ],
                        debuffs: [
                            {
                                name: 'Spiritual Weakness',
                                description: 'Soul weakened',
                                duration: 6,
                                effects: {
                                    spiritPenalty: -3
                                }
                            }
                        ]
                    },

                    targetingConfig: {
                        targetingType: 'single',
                        rangeType: 'ranged',
                        rangeDistance: 40,
                        targetRestrictions: ['enemy']
                    },

                    resourceCost: {
                        mana: 22,
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
            ]
        },

        enlightenedOne: {
            id: 'enlightened_one',
            name: 'Enlightened One',
            description: 'Transcendent beings who have achieved spiritual perfection',
            theme: 'Transcendence and spiritual mastery',
            icon: 'fas fa-sun',

            mechanicalBenefits: [
                { name: 'Charisma Bonus', description: '+1 to Charisma attribute', type: 'stat' }
            ],

            abilities: [
                {
                    id: 'inner_peace',
                    name: 'Inner Peace',
                    description: '"I am at peace." Enter a meditative state, regenerating health and mana.',
                    icon: 'spell_nature_tranquility',
                    level: 1,
                    spellType: 'ACTION',
                    tags: ['healing', 'regeneration', 'meditation', 'resource'],
                    effectTypes: ['healing'],
                    damageTypes: [],

                    healingConfig: {
                        healingType: 'hot',
                        formula: '2d6 + SPI',
                        resolution: 'DICE',
                        hasHotEffect: true,
                        hotTickInterval: 1,
                        hotDuration: 6,
                        hasShieldEffect: false,
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

                    resourceCost: {
                        mana: 0,
                        health: 0,
                        stamina: 0,
                        focus: 0,
                        actionPoints: 1
                    },

                    durationConfig: {
                        type: 'timed',
                        value: 6,
                        unit: 'rounds',
                        concentration: true,
                        dispellable: false
                    },

                    cooldownConfig: {
                        type: 'short_rest',
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
                    id: 'astral_projection',
                    name: 'Astral Projection',
                    description: '"My spirit is unbound." Project your spirit to scout ahead or bypass obstacles.',
                    icon: 'spell_arcane_portalironforge',
                    level: 2,
                    spellType: 'ACTION',
                    tags: ['utility', 'scouting', 'astral', 'spirit'],
                    effectTypes: ['utility'],
                    damageTypes: [],

                    utilityConfig: {
                        utilityType: 'scouting',
                        utilitySubtype: 'spirit_form',
                        duration: 10,
                        durationUnit: 'rounds',
                        selectedEffects: [
                            {
                                name: 'Spirit Form',
                                description: 'Project your spirit, becoming invisible and intangible but unable to interact with physical objects',
                                customName: 'Astral Projection'
                            }
                        ],
                        difficultyClass: 0,
                        concentration: true
                    },

                    targetingConfig: {
                        targetingType: 'self',
                        rangeType: 'self',
                        rangeDistance: 0,
                        targetRestrictions: ['self']
                    },

                    resourceCost: {
                        mana: 25,
                        health: 0,
                        stamina: 0,
                        focus: 0,
                        actionPoints: 2
                    },

                    durationConfig: {
                        type: 'timed',
                        value: 10,
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
                }
            ]
        }
    }
};

