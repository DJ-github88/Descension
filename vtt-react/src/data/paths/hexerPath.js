export const HEXER_PATH = {
    id: 'hexer',
    name: 'Hexer',
    description: 'Wielders of curses, hexes, and dark magic',
    icon: 'fas fa-spider',
    overview: 'Hexers channel dark and primal forces, wielding curses, hexes, and forbidden magic. They draw power from pacts, totems, and the shadowy spaces between worlds.',

    mechanicalBenefits: [
        { name: 'Dark Resilience', description: 'Resistance to necrotic damage (reduce by 5)', type: 'passive' }
    ],

    integrationNotes: {
        actionPointSystem: 'Hexer abilities focus on curses, debuffs, and dark magic.',
        backgroundSynergy: 'Works well with Hermit or Outlander backgrounds.',
        classCompatibility: 'Strong with Warlock, Druid, or Sorcerer classes.'
    },

    roleplayingTips: [
        'Embrace the darker aspects of magic',
        'Make pacts and bargains',
        'Use curses strategically'
    ],

    thematicElements: {
        corePhilosophy: 'Power comes at a price, and some prices are worth paying.',
        mechanicalIntegration: 'Curses, hexes, and dark pacts.'
    },

    subPaths: {
        spiritCaller: {
            id: 'spirit_caller',
            name: 'Spirit Caller',
            description: 'Spiritual invokers channeling loa spirits',
            theme: 'Spirit magic and voodoo',
            icon: 'fas fa-hat-wizard',

            mechanicalBenefits: [
                { name: 'Intelligence Bonus', description: '+1 to Intelligence attribute', type: 'stat' }
            ],

            abilities: [
                {
                    id: 'hex',
                    name: 'Hex',
                    description: '"You are cursed." Place a debilitating hex on an enemy.',
                    icon: 'spell_shadow_curseofachimonde',
                    level: 1,
                    spellType: 'ACTION',
                    tags: ['debuff', 'curse', 'hex', 'damage-amplification'],
                    effectTypes: ['debuff'],
                    damageTypes: [],

                    debuffConfig: {
                        duration: 10,
                        durationValue: 10,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [
                            {
                                name: 'hex_vulnerability',
                                stat: 'damage_taken',
                                value: 20,
                                magnitude: 20,
                                magnitudeType: 'percentage',
                                isPercentage: true
                            }
                        ],
                        statusEffects: [
                            {
                                id: 'hexed',
                                name: 'Hexed',
                                description: 'Cursed to take 20% increased damage'
                            }
                        ],
                        debuffs: [
                            {
                                name: 'Hex Curse',
                                description: 'Vulnerability to damage',
                                duration: 10,
                                effects: {
                                    damageVulnerability: 20
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
                        mana: 15,
                        health: 0,
                        stamina: 0,
                        focus: 0,
                        actionPoints: 1
                    },

                    durationConfig: {
                        type: 'timed',
                        value: 10,
                        unit: 'rounds',
                        concentration: false,
                        dispellable: true
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
                    id: 'spirit_link',
                    name: 'Spirit Link',
                    description: '"The spirits protect us." Link allies together, sharing damage between them.',
                    icon: 'spell_shaman_spiritlink',
                    level: 2,
                    spellType: 'ACTION',
                    tags: ['buff', 'protection', 'spirit', 'damage-sharing'],
                    effectTypes: ['buff'],
                    damageTypes: [],

                    buffConfig: {
                        duration: 8,
                        durationValue: 8,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [],
                        statusEffects: [
                            {
                                id: 'spirit_linked',
                                name: 'Spirit Linked',
                                description: 'Damage is shared equally among all linked allies'
                            }
                        ],
                        buffs: [
                            {
                                name: 'Spirit Link',
                                description: 'Damage sharing',
                                duration: 8,
                                effects: {
                                    damageSharing: true,
                                    linkedAllies: 'all_in_range'
                                }
                            }
                        ]
                    },

                    targetingConfig: {
                        targetingType: 'area',
                        rangeType: 'ranged',
                        rangeDistance: 30,
                        aoeShape: 'sphere',
                        aoeSize: 20,
                        targetRestrictions: ['ally', 'self']
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
                        value: 8,
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
                    visualTheme: 'nature',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                },
                {
                    id: 'voodoo_doll',
                    name: 'Voodoo Doll',
                    description: '"Feel my pain." Create a voodoo doll linked to an enemy - damage you take is reflected to them.',
                    icon: 'spell_shadow_twistedfaith',
                    level: 2,
                    spellType: 'ACTION',
                    tags: ['debuff', 'curse', 'damage-reflect', 'voodoo'],
                    effectTypes: ['debuff'],
                    damageTypes: [],

                    debuffConfig: {
                        duration: 6,
                        durationValue: 6,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [],
                        statusEffects: [
                            {
                                id: 'voodoo_linked',
                                name: 'Voodoo Linked',
                                description: 'Linked to a voodoo doll, takes 50% of damage dealt to caster'
                            }
                        ],
                        debuffs: [
                            {
                                name: 'Voodoo Curse',
                                description: 'Damage reflection',
                                duration: 6,
                                effects: {
                                    damageReflection: 50,
                                    reflectionSource: 'caster'
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
                        mana: 20,
                        health: 5,
                        stamina: 0,
                        focus: 0,
                        actionPoints: 2
                    },

                    durationConfig: {
                        type: 'timed',
                        value: 6,
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
                    visualTheme: 'shadow',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                }
            ]
        },

        skinwalker: {
            id: 'skinwalker',
            name: 'Skinwalker',
            description: 'Shapeshifters with primal instinct energy',
            theme: 'Shapeshifting and transformation',
            icon: 'fas fa-paw',

            mechanicalBenefits: [
                { name: 'Curse Affinity', description: 'Curses you cast last 3 additional rounds', type: 'passive' }
            ],

            abilities: [
                {
                    id: 'beast_form',
                    name: 'Beast Form',
                    description: '"Embrace the beast within!" Transform into a powerful beast.',
                    icon: 'ability_druid_catform',
                    level: 1,
                    spellType: 'ACTION',
                    tags: ['buff', 'transformation', 'beast', 'physical'],
                    effectTypes: ['buff'],
                    damageTypes: [],

                    buffConfig: {
                        duration: 10,
                        durationValue: 10,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [
                            {
                                name: 'beast_strength',
                                stat: 'strength',
                                value: 4,
                                magnitude: 4,
                                magnitudeType: 'flat',
                                isPercentage: false
                            },
                            {
                                name: 'beast_agility',
                                stat: 'agility',
                                value: 2,
                                magnitude: 2,
                                magnitudeType: 'flat',
                                isPercentage: false
                            }
                        ],
                        statusEffects: [
                            {
                                id: 'beast_form',
                                name: 'Beast Form',
                                description: 'Transformed into a powerful beast, +4 STR, +2 AGI'
                            }
                        ],
                        buffs: [
                            {
                                name: 'Primal Transformation',
                                description: 'Beast attributes',
                                duration: 10,
                                effects: {
                                    strengthBonus: 4,
                                    agilityBonus: 2,
                                    naturalWeapons: true
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
                    visualTheme: 'nature',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                },
                {
                    id: 'primal_fury',
                    name: 'Primal Fury',
                    description: '"Unleash the beast!" Enter a feral rage, gaining attack speed and damage.',
                    icon: 'ability_druid_ferociousbite',
                    level: 2,
                    spellType: 'ACTION',
                    tags: ['buff', 'rage', 'attack-speed', 'damage'],
                    effectTypes: ['buff'],
                    damageTypes: [],

                    buffConfig: {
                        duration: 8,
                        durationValue: 8,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [
                            {
                                name: 'strength_boost',
                                stat: 'strength',
                                value: 3,
                                magnitude: 3,
                                magnitudeType: 'flat',
                                isPercentage: false
                            },
                            {
                                name: 'damage_boost',
                                stat: 'damage',
                                value: 4,
                                magnitude: 4,
                                magnitudeType: 'flat',
                                isPercentage: false
                            }
                        ],
                        statusEffects: [
                            {
                                id: 'primal_fury',
                                name: 'Primal Fury',
                                description: 'In a feral rage, +3 STR, +4 damage'
                            }
                        ],
                        buffs: [
                            {
                                name: 'Feral Rage',
                                description: 'Enhanced combat power',
                                duration: 8,
                                effects: {
                                    strengthBonus: 3,
                                    damageBonus: 4
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
                        mana: 20,
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
                    visualTheme: 'nature',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                }
            ]
        },

        totemist: {
            id: 'totemist',
            name: 'Totemist',
            description: 'Totem masters resonating with elemental forces',
            theme: 'Totem magic and elemental spirits',
            icon: 'fas fa-tree',

            mechanicalBenefits: [
                { name: 'Agility Bonus', description: '+1 to Agility attribute', type: 'stat' }
            ],

            abilities: [
                {
                    id: 'totem_summon',
                    name: 'Totem Summon',
                    description: '"Spirits, heed my call!" Summon a totem that buffs nearby allies.',
                    icon: 'spell_nature_natureguardian',
                    level: 1,
                    spellType: 'ACTION',
                    tags: ['summon', 'totem', 'buff', 'aoe'],
                    effectTypes: ['summon', 'buff'],
                    damageTypes: [],

                    summonConfig: {
                        creatureType: 'totem',
                        creatureId: 'spirit_totem',
                        duration: 12,
                        durationUnit: 'rounds',
                        maxSummons: 1,
                        summonBehavior: 'stationary',
                        auraEffect: {
                            aoeSize: 15,
                            buffType: 'stat_boost',
                            statBonus: {
                                spirit: 2,
                                intelligence: 2
                            }
                        }
                    },

                    targetingConfig: {
                        targetingType: 'location',
                        rangeType: 'ranged',
                        rangeDistance: 30,
                        targetRestrictions: []
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
                        value: 12,
                        unit: 'rounds',
                        concentration: false,
                        dispellable: true
                    },

                    cooldownConfig: {
                        type: 'short_rest',
                        value: 1,
                        charges: 1,
                        recovery: 1
                    },

                    resolution: 'DICE',
                    visualTheme: 'nature',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                },
                {
                    id: 'ancestral_guidance',
                    name: 'Ancestral Guidance',
                    description: '"The ancestors watch over us." Call upon ancestral spirits to heal and protect allies.',
                    icon: 'spell_shaman_ancestralguidance',
                    level: 2,
                    spellType: 'ACTION',
                    tags: ['healing', 'buff', 'ancestral', 'aoe'],
                    effectTypes: ['healing', 'buff'],
                    damageTypes: [],

                    healingConfig: {
                        healingType: 'direct',
                        formula: '3d6 + SPI',
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

                    buffConfig: {
                        duration: 6,
                        durationValue: 6,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        statModifiers: [
                            {
                                name: 'ancestral_protection',
                                stat: 'armor',
                                value: 3,
                                magnitude: 3,
                                magnitudeType: 'flat',
                                isPercentage: false
                            }
                        ],
                        statusEffects: [
                            {
                                id: 'ancestral_blessing',
                                name: 'Ancestral Blessing',
                                description: 'Protected by ancestral spirits, +3 armor'
                            }
                        ],
                        buffs: [
                            {
                                name: 'Spirit Protection',
                                description: 'Ancestral defense',
                                duration: 6,
                                effects: {
                                    armorBonus: 3
                                }
                            }
                        ]
                    },

                    targetingConfig: {
                        targetingType: 'area',
                        rangeType: 'self_centered',
                        rangeDistance: 0,
                        aoeShape: 'sphere',
                        aoeSize: 20,
                        targetRestrictions: ['ally', 'self']
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
                        type: 'long_rest',
                        value: 1,
                        charges: 1,
                        recovery: 1
                    },

                    resolution: 'DICE',
                    visualTheme: 'nature',
                    effectMechanicsConfigs: {},
                    mechanicsConfig: []
                }
            ]
        }
    }
};

