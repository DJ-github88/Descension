/**
 * Enhanced Path Data Module
 *
 * Defines all 9 custom paths with sub-paths and spell-like abilities
 * Structure mirrors the race/subrace system with:
 * - Overview and thematic description
 * - Mechanical benefits (stat bonuses, passive abilities)
 * - Sub-paths (specializations) - 3 per path
 * - Selectable abilities (2-3 per sub-path)
 * - Abilities formatted as spells for UnifiedSpellCard rendering
 *
 * PATHS (not backgrounds):
 * - Mystic, Zealot, Trickster, Harrow, Arcanist, Hexer, Reaver, Mercenary, Sentinel
 *
 * BACKGROUNDS are separate (Sailor, Soldier, Acolyte, etc.)
 */

import { MYSTIC_PATH } from './paths/mysticPath';
import { TRICKSTER_PATH } from './paths/tricksterPath';
import { HARROW_PATH } from './paths/harrowPath';
import { ARCANIST_PATH } from './paths/arcanistPath';
import { HEXER_PATH } from './paths/hexerPath';
import { REAVER_PATH } from './paths/reaverPath';
import { MERCENARY_PATH } from './paths/mercenaryPath';
import { SENTINEL_PATH } from './paths/sentinelPath';

// Zealot path data (kept inline for now - will be extracted later)
const ZEALOT_PATH = {
    zealot: {
        id: 'zealot',
        name: 'Zealot',
        description: 'Driven by unwavering faith and spiritual conviction',
        icon: 'fas fa-cross',
        overview: 'Zealots draw strength from unwavering faith and spiritual conviction. Whether serving divine entities or abstract ideals, they channel spiritual energy into tangible power, often making personal sacrifices to strengthen their connection to higher powers.',
        
        mechanicalBenefits: [
            {
                name: 'Faithful Resolve',
                description: 'Advantage on saves against fear and charm',
                type: 'passive'
            }
        ],

        // Integration with game systems
        integrationNotes: {
            actionPointSystem: 'Zealot abilities often cost 2-3 AP and provide powerful combat or support effects. Divine abilities may have faith-based requirements.',
            backgroundSynergy: 'Works well with Acolyte or Soldier backgrounds for thematic coherence.',
            classCompatibility: 'Particularly strong with Paladin, Cleric, or Warrior classes. Divine abilities complement holy magic and righteous combat.'
        },

        // Roleplaying guidance
        roleplayingTips: [
            'Consider how your path shapes your worldview and motivations',
            'Think about how your abilities manifest and what they mean to your character',
            'Explore the relationship between your path and your class choice',
            'Use your path abilities creatively in both combat and roleplay situations'
        ],

        thematicElements: {
            corePhilosophy: 'Zealots draw strength from unwavering faith and spiritual conviction. Whether serving divine entities or abstract ideals, they channel spiritual energy into tangible power, often making personal sacrifices to strengthen their connection to higher powers.',
            mechanicalIntegration: 'Your path abilities are designed to work seamlessly with the Action Point system and complement any class choice.'
        },

        // 3 abilities: 1 PASSIVE, 1 REACTION, 1 ACTION - player picks one of each
        abilities: [
            // PASSIVE - Faithful Resolve
            {
                id: 'faithful_resolve',
                name: 'Faithful Resolve',
                description: '"My faith is my armor." Your unwavering conviction grants you resistance to mental intrusion and the ability to sense corruption.',
                icon: 'spell_holy_devotion',
                level: 1,
                spellType: 'PASSIVE',
                tags: ['passive', 'divine', 'resistance', 'detection'],
                effectTypes: ['buff'],
                damageTypes: [],

                typeConfig: {
                    school: 'holy',
                    icon: 'spell_holy_devotion',
                    tags: ['passive', 'divine', 'resistance', 'detection']
                },

                buffConfig: {
                    buffType: 'statEnhancement',
                    effects: [
                        {
                            id: 'mental_fortitude',
                            name: 'Mental Fortitude',
                            description: 'You have advantage on saving throws against fear and charm effects. Your faith protects your mind from manipulation.',
                            statModifier: {
                                stat: 'saving_throws',
                                magnitude: 2,
                                magnitudeType: 'flat'
                            }
                        },
                        {
                            id: 'corruption_sense',
                            name: 'Corruption Sense',
                            description: 'You can sense the presence of fiends, undead, and corrupted creatures within 60 feet. You know their general direction but not exact location.',
                            statModifier: {
                                stat: 'perception',
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
                visualTheme: 'holy'
            },
            // REACTION - Martyr's Sacrifice
            {
                id: 'martyrs_sacrifice',
                name: "Martyr's Sacrifice",
                description: '"Greater love hath no one than this." When an ally within 30 feet drops below 25% health, sacrifice your own vitality to heal them instantly.',
                icon: 'spell_holy_prayerofhealing',
                level: 1,
                spellType: 'REACTION',
                tags: ['reaction', 'healing', 'divine', 'sacrifice'],
                effectTypes: ['healing'],
                damageTypes: [],

                typeConfig: {
                    school: 'holy',
                    icon: 'spell_holy_prayerofhealing',
                    tags: ['reaction', 'healing', 'divine', 'sacrifice']
                },

                healingConfig: {
                    healingType: 'direct',
                    formula: '3d8 + spirit',
                    resolution: 'DICE',
                    hasHotEffect: false,
                    hasShieldEffect: false
                },

                targetingConfig: {
                    targetingType: 'single',
                    rangeType: 'ranged',
                    rangeDistance: 30,
                    targetRestrictions: ['ally']
                },

                triggerConfig: {
                    global: {
                        enabled: true,
                        logicType: 'OR',
                        compoundTriggers: [
                            {
                                id: 'health_threshold',
                                category: 'health',
                                name: 'When ally drops below 25% health',
                                parameters: {
                                    perspective: 'ally',
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
                        requiresLOS: true
                    }
                },

                resourceCost: {
                    resourceTypes: ['health'],
                    resourceValues: { health: 10 },
                    useFormulas: { health: false },
                    actionPoints: 0
                },

                cooldownConfig: {
                    type: 'short_rest',
                    value: 1,
                    charges: 2,
                    recovery: 1
                },

                resolution: 'DICE',
                visualTheme: 'holy'
            },
            // ACTION - Zealous Fervor
            {
                id: 'zealous_fervor',
                name: 'Zealous Fervor',
                description: '"For my faith, I fear nothing!" Inspire yourself and nearby allies with unshakeable faith, granting combat bonuses and fear immunity.',
                icon: 'spell_holy_innerfire',
                level: 1,
                spellType: 'ACTION',
                tags: ['action', 'buff', 'inspiration', 'divine', 'aura'],
                effectTypes: ['buff'],
                damageTypes: [],

                typeConfig: {
                    school: 'holy',
                    icon: 'spell_holy_innerfire',
                    tags: ['action', 'buff', 'inspiration', 'divine', 'aura']
                },

                buffConfig: {
                    buffType: 'statusEffect',
                    effects: [
                        {
                            id: 'zealous_inspiration',
                            name: 'Zealous Inspiration',
                            description: 'Gain +2 to attack rolls and saving throws, and immunity to fear effects for 10 rounds.',
                            statusType: 'inspired'
                        }
                    ],
                    durationValue: 10,
                    durationType: 'rounds',
                    durationUnit: 'rounds',
                    canBeDispelled: true
                },

                targetingConfig: {
                    targetingType: 'area',
                    rangeType: 'self_centered',
                    rangeDistance: 0,
                    aoeShape: 'sphere',
                    aoeParameters: { radius: 30 },
                    targetRestrictions: ['ally', 'self']
                },

                resourceCost: {
                    resourceTypes: ['mana'],
                    resourceValues: { mana: 15 },
                    actionPoints: 2
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

        // Sub-paths (specializations)
        subPaths: {
            divineCrusader: {
                id: 'divine_crusader',
                name: 'Crusade Discipline',
                description: 'The practice of fighting in the name of faith with righteous fury',
                theme: 'Combat prowess and righteous fury',
                icon: 'fas fa-sword',
                
                // Abilities pool (choose 2) - formatted as spells for UnifiedSpellCard
                abilities: [
                    {
                        id: 'martyrs_sacrifice',
                        name: "Martyr's Sacrifice",
                        description: '"Greater love hath no one than this, that one lay down their life for their friends." When an ally within 30 feet drops below 25% health, sacrifice your own vitality to heal them.',
                        icon: 'spell_holy_prayerofhealing',
                        level: 1,
                        spellType: 'REACTION',
                        tags: ['healing', 'divine', 'sacrifice', 'reaction'],
                        effectTypes: ['healing'],
                        damageTypes: [],

                        healingConfig: {
                            healingType: 'direct',
                            formula: '3d8 + 4',
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
                            targetRestrictions: ['ally']
                        },

                        triggerConfig: {
                            global: {
                                logicType: 'OR',
                                compoundTriggers: [
                                    {
                                        id: 'health_threshold',
                                        name: 'When ally drops below 25% health',
                                        parameters: {
                                            perspective: 'ally',
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
                                requiresLOS: true
                            }
                        },

                        resourceCost: {
                            mana: 0,
                            health: 8,
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
                            charges: 2,
                            recovery: 2
                        },

                        resolution: 'DICE',
                        visualTheme: 'holy'
                    },
                    {
                        id: 'faithful_intercession',
                        name: 'Faithful Intercession',
                        description: '"Stand behind me - my faith is shield enough for us both." When an ally within 5 feet takes damage, intercede and redirect the attack to yourself, reducing the damage taken.',
                        icon: 'spell_holy_divineshield',
                        level: 1,
                        spellType: 'REACTION',
                        tags: ['defensive', 'protection', 'reaction', 'divine'],
                        effectTypes: ['buff'],
                        damageTypes: [],

                        buffConfig: {
                            duration: 1,
                            durationValue: 1,
                            durationType: 'instant',
                            durationUnit: 'instant',
                            statModifiers: [
                                {
                                    name: 'damage_reduction',
                                    stat: 'damage_reduction',
                                    value: 13,
                                    magnitude: 13,
                                    magnitudeType: 'flat',
                                    isPercentage: false,
                                    formula: '1d10 + 3'
                                }
                            ],
                            statusEffects: [
                                {
                                    id: 'divine_protection',
                                    name: 'Divine Protection',
                                    description: 'Redirecting attack to self with reduced damage (1d10 + 3 reduction)'
                                }
                            ],
                            buffs: [
                                {
                                    name: 'Divine Protection',
                                    description: 'Reduce damage taken by 1d10 + 3',
                                    duration: 1,
                                    effects: {
                                        damageReduction: '1d10 + 3',
                                        redirectAttack: true,
                                        redirectSource: 'ally_within_5ft'
                                    }
                                }
                            ]
                        },

                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'ranged',
                            rangeDistance: 5,
                            targetRestrictions: ['self']
                        },

                        triggerConfig: {
                            global: {
                                logicType: 'OR',
                                compoundTriggers: [
                                    {
                                        id: 'ally_takes_damage',
                                        name: 'When ally takes damage',
                                        parameters: {
                                            damage_type: 'any',
                                            min_damage: 1,
                                            target_entity: 'ally',
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
                            mana: 8,
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
                            type: 'short_rest',
                            value: 1,
                            charges: 3,
                            recovery: 3
                        },

                        resolution: 'DICE',
                        visualTheme: 'holy'
                    },
                    {
                        id: 'zealous_fervor',
                        name: 'Zealous Fervor',
                        description: '"My conviction burns brighter than any flame - let it ignite your courage!" Inspire allies within 15 feet with unwavering faith, granting them enhanced combat prowess and immunity to fear.',
                        icon: 'spell_holy_crusade',
                        level: 2,
                        spellType: 'ACTION',
                        tags: ['buff', 'aura', 'divine', 'inspiration'],
                        effectTypes: ['buff'],
                        damageTypes: ['radiant'],

                        buffConfig: {
                            duration: 5,
                            durationValue: 5,
                            durationType: 'rounds',
                            durationUnit: 'rounds',
                            statModifiers: [
                                { name: 'strength', stat: 'strength', value: 2, magnitude: 2, magnitudeType: 'flat', isPercentage: false },
                                { name: 'spirit', stat: 'spirit', value: 1, magnitude: 1, magnitudeType: 'flat', isPercentage: false }
                            ],
                            statusEffects: [
                                {
                                    id: 'inspired',
                                    name: 'Inspired',
                                    description: 'Filled with divine inspiration, granting enhanced combat prowess and resistance to fear effects'
                                },
                                {
                                    id: 'fearless',
                                    name: 'Fearless',
                                    description: 'Immune to fear effects and emboldened by unwavering faith'
                                }
                            ],
                            buffs: [
                                {
                                    name: 'Fervent Strikes',
                                    description: 'Enhanced attack power and immunity to fear',
                                    duration: 5,
                                    effects: {
                                        attackBonus: 4,
                                        fearImmunity: true,
                                        damageBonus: 2
                                    }
                                }
                            ]
                        },

                        targetingConfig: {
                            targetingType: 'area',
                            aoeShape: 'sphere',
                            aoeSize: 15,
                            rangeType: 'self',
                            rangeDistance: 0,
                            targetRestrictions: ['ally', 'self']
                        },

                        resourceCost: {
                            mana: 20,
                            health: 0,
                            stamina: 0,
                            focus: 0
                        },

                        durationConfig: {
                            type: 'timed',
                            value: 5,
                            unit: 'rounds',
                            concentration: false,
                            dispellable: true
                        },

                        cooldownConfig: {
                            type: 'combat',
                            value: 1,
                            charges: 1,
                            recovery: 1
                        },

                        resolution: 'DICE',
                        visualTheme: 'holy'
                    },
                    {
                        id: 'judgment_of_the_faithful',
                        name: 'Judgment of the Faithful',
                        description: '"Let the weight of your sins be measured - and found wanting." Strike a foe with divine judgment, dealing radiant damage that scales with their corruption. Target must save or fall prone.',
                        icon: 'spell_holy_holysmite',
                        level: 2,
                        spellType: 'ACTION',
                        tags: ['damage', 'radiant', 'divine', 'control'],
                        effectTypes: ['damage', 'debuff'],
                        damageTypes: ['radiant'],

                        damageConfig: {
                            damageType: 'direct',
                            elementType: 'radiant',
                            formula: '3d8 + 6',
                            hasDotEffect: false,
                            savingThrowConfig: {
                                enabled: true,
                                savingThrowType: 'spirit',
                                difficultyClass: 13,
                                saveOutcome: 'halves'
                            },
                            criticalConfig: {
                                enabled: true,
                                critType: 'dice',
                                critMultiplier: 2,
                                critDiceOnly: false,
                                extraDice: '1d8',
                                critEffects: ['divine_smite']
                            }
                        },

                        debuffConfig: {
                            duration: 1,
                            durationValue: 1,
                            durationType: 'rounds',
                            durationUnit: 'rounds',
                            statusEffects: [
                                {
                                    id: 'prone',
                                    name: 'Prone',
                                    description: 'Knocked prone by divine force, must use movement to stand'
                                }
                            ],
                            debuffs: [
                                {
                                    name: 'Divine Judgment',
                                    description: 'Knocked prone by divine force',
                                    duration: 1,
                                    effects: {
                                        conditions: ['prone'],
                                        savingThrow: 'spirit',
                                        difficultyClass: 13
                                    }
                                }
                            ]
                        },

                        targetingConfig: {
                            targetingType: 'single',
                            rangeType: 'ranged',
                            rangeDistance: 30,
                            targetRestrictions: ['enemy']
                        },

                        resourceCost: {
                            mana: 18,
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
                            type: 'short_rest',
                            value: 1,
                            charges: 2,
                            recovery: 2
                        },

                        resolution: 'DICE',
                        visualTheme: 'holy'
                    },
                    {
                        id: 'unyielding_conviction',
                        name: 'Unyielding Conviction',
                        description: '"Faith is my armor, and conviction my shield - I will not fall while my purpose remains." When reduced to 0 HP, your faith sustains you, granting temporary resilience.',
                        icon: 'spell_holy_restoration',
                        level: 1,
                        spellType: 'REACTION',
                        tags: ['defensive', 'divine', 'reaction', 'survival'],
                        effectTypes: ['healing', 'buff'],
                        damageTypes: [],

                        healingConfig: {
                            healingType: 'direct',
                            formula: '1d4',
                            hasHotEffect: false,
                            hasShieldEffect: true,
                            shieldFormula: '2d6 + 4',
                            shieldDuration: 3,
                            shieldDamageTypes: 'all',
                            shieldOverflow: 'dissipate',
                            shieldBreakBehavior: 'fade'
                        },

                        buffConfig: {
                            duration: 3,
                            durationValue: 3,
                            durationType: 'rounds',
                            durationUnit: 'rounds',
                            buffs: [
                                {
                                    name: 'Divine Resilience',
                                    description: 'Temporary hit points from divine conviction',
                                    duration: 3,
                                    effects: {
                                        temporaryHitPoints: 10,
                                        damageReduction: 2
                                    }
                                }
                            ]
                        },

                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self',
                            rangeDistance: 0
                        },

                        triggerConfig: {
                            global: {
                                logicType: 'OR',
                                compoundTriggers: [
                                    {
                                        id: 'health_threshold',
                                        name: 'When health is at 0',
                                        parameters: {
                                            perspective: 'self',
                                            threshold: 0,
                                            condition: 'equals',
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
                            focus: 0
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
                        visualTheme: 'holy'
                    },
                    {
                        id: 'wrath_of_the_righteous',
                        name: 'Wrath of the Righteous',
                        description: '"Witness the fury of the faithful - your corruption ends here!" Unleash divine wrath in a 15-foot cone, dealing radiant damage and potentially blinding foes.',
                        icon: 'spell_holy_excorcism',
                        level: 2,
                        spellType: 'ACTION',
                        tags: ['damage', 'radiant', 'divine', 'aoe', 'cone'],
                        effectTypes: ['damage', 'debuff'],
                        damageTypes: ['radiant'],

                        damageConfig: {
                            damageType: 'direct',
                            elementType: 'radiant',
                            formula: '4d6 + 8',
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
                                critDiceOnly: false,
                                extraDice: '2d6',
                                critEffects: ['divine_wrath']
                            }
                        },

                        debuffConfig: {
                            duration: 2,
                            durationValue: 2,
                            durationType: 'rounds',
                            durationUnit: 'rounds',
                            statusEffects: [
                                {
                                    id: 'blinded',
                                    name: 'Blinded',
                                    description: 'Blinded by searing holy light, unable to see and attacks have disadvantage'
                                }
                            ],
                            debuffs: [
                                {
                                    name: 'Divine Blindness',
                                    description: 'Blinded by holy light',
                                    duration: 2,
                                    effects: {
                                        conditions: ['blinded'],
                                        savingThrow: 'constitution',
                                        difficultyClass: 14
                                    }
                                }
                            ]
                        },

                        targetingConfig: {
                            targetingType: 'cone',
                            aoeShape: 'cone',
                            aoeSize: 15,
                            rangeType: 'self',
                            rangeDistance: 0,
                            targetRestrictions: ['enemy']
                        },

                        resourceCost: {
                            mana: 25,
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
                        visualTheme: 'holy'
                    },
                    {
                        id: 'blessing_of_battle',
                        name: 'Blessing of Battle',
                        description: '"May your strikes be true and your resolve unbreakable." Bless an ally with divine power, enhancing their combat prowess with radiant energy.',
                        icon: 'spell_holy_greaterblessingofkings',
                        level: 1,
                        spellType: 'ACTION',
                        tags: ['buff', 'divine', 'blessing', 'combat'],
                        effectTypes: ['buff'],
                        damageTypes: ['radiant'],

                        buffConfig: {
                            duration: 10,
                            durationValue: 10,
                            durationType: 'rounds',
                            durationUnit: 'rounds',
                            statModifiers: [
                                { name: 'strength', stat: 'strength', value: 2, magnitude: 2, magnitudeType: 'flat', isPercentage: false }
                            ],
                            statusEffects: [
                                {
                                    id: 'blessed',
                                    name: 'Blessed',
                                    description: 'Blessed with divine power, granting enhanced combat prowess and radiant energy'
                                },
                                {
                                    id: 'empowered',
                                    name: 'Empowered',
                                    description: 'Empowered by holy might, increasing attack power and damage output'
                                }
                            ],
                            buffs: [
                                {
                                    name: 'Divine Blessing',
                                    description: 'Enhanced attack power and radiant damage',
                                    duration: 10,
                                    effects: {
                                        attackBonus: 2,
                                        damageBonus: 6,
                                        radiantDamage: true
                                    }
                                }
                            ]
                        },

                        targetingConfig: {
                            targetingType: 'single',
                            rangeType: 'touch',
                            rangeDistance: 5,
                            targetRestrictions: ['ally', 'self']
                        },

                        resourceCost: {
                            mana: 12,
                            health: 0,
                            stamina: 0,
                            focus: 0
                        },

                        durationConfig: {
                            type: 'timed',
                            value: 10,
                            unit: 'rounds',
                            concentration: false,
                            dispellable: true
                        },

                        cooldownConfig: {
                            type: 'short_rest',
                            value: 1,
                            charges: 3,
                            recovery: 3
                        },

                        resolution: 'DICE',
                        visualTheme: 'holy'
                    }
                ]
            },

            sacredHealer: {
                id: 'sacred_healer',
                name: 'Devotion Discipline',
                description: 'The practice of compassionately mending wounds and curing ailments',
                theme: 'Healing and protective magic',
                icon: 'fas fa-hand-holding-heart',

                abilities: [
                    {
                        id: 'divine_mend',
                        name: 'Divine Mend',
                        description: '"Your suffering ends now." Channel radiant energy to instantly close wounds and restore vitality.',
                        icon: 'spell_holy_flashheal',
                        level: 1,
                        spellType: 'ACTION',
                        tags: ['healing', 'divine', 'instant', 'restoration'],
                        effectTypes: ['healing'],
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

                        targetingConfig: {
                            targetingType: 'single',
                            rangeType: 'ranged',
                            rangeDistance: 30,
                            targetRestrictions: ['ally', 'self']
                        },

                        resourceCost: {
                            mana: 12,
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
                        visualTheme: 'holy',
                        effectMechanicsConfigs: {},
                        mechanicsConfig: []
                    },
                    {
                        id: 'beacon_of_hope',
                        name: 'Beacon of Hope',
                        description: '"Let my light guide you through the darkness." Create a radiant beacon that continuously heals allies who stand within its glow.',
                        icon: 'spell_holy_prayerofhealing02',
                        level: 2,
                        spellType: 'ACTION',
                        tags: ['healing', 'divine', 'aoe', 'over-time', 'beacon'],
                        effectTypes: ['healing'],
                        damageTypes: [],

                        healingConfig: {
                            healingType: 'hot',
                            formula: '1d6 + SPI',
                            resolution: 'DICE',
                            hasHotEffect: true,
                            hotTickInterval: 1,
                            hotDuration: 6,
                            hasShieldEffect: false,
                            criticalConfig: {
                                enabled: true,
                                critType: 'dice',
                                critMultiplier: 2,
                                critDiceOnly: false
                            }
                        },

                        targetingConfig: {
                            targetingType: 'area',
                            rangeType: 'ranged',
                            rangeDistance: 40,
                            aoeShape: 'sphere',
                            aoeSize: 15,
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
                        visualTheme: 'holy',
                        effectMechanicsConfigs: {},
                        mechanicsConfig: []
                    },
                    {
                        id: 'life_link',
                        name: 'Life Link',
                        description: '"Your pain is mine to bear." Form a sacred bond with an ally, automatically healing them when they take damage.',
                        icon: 'spell_holy_divineshield',
                        level: 2,
                        spellType: 'REACTION',
                        tags: ['healing', 'divine', 'reaction', 'bond', 'protective'],
                        effectTypes: ['healing'],
                        damageTypes: [],

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
                            targetRestrictions: ['ally']
                        },

                        triggerConfig: {
                            global: {
                                logicType: 'OR',
                                compoundTriggers: [
                                    {
                                        id: 'ally_takes_damage',
                                        name: 'When bonded ally takes damage',
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
                            mana: 15,
                            health: 5,
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
                            type: 'short_rest',
                            value: 1,
                            charges: 3,
                            recovery: 3
                        },

                        resolution: 'DICE',
                        visualTheme: 'holy',
                        effectMechanicsConfigs: {},
                        mechanicsConfig: []
                    }
                ]
            },

            faithInquisitor: {
                id: 'faith_inquisitor',
                name: 'Inquisition Discipline',
                description: 'The practice of investigating and rooting out corruption and heresy',
                theme: 'Detection and purification',
                icon: 'fas fa-eye',

                abilities: [
                    {
                        id: 'smite_heretic',
                        name: 'Smite Heretic',
                        description: '"Your blasphemy ends here!" Strike down enemies of the faith with overwhelming radiant fury.',
                        icon: 'spell_holy_holysmite',
                        level: 1,
                        spellType: 'ACTION',
                        tags: ['damage', 'radiant', 'divine', 'smite', 'judgment'],
                        effectTypes: ['damage'],
                        damageTypes: ['radiant'],

                        damageConfig: {
                            damageType: 'direct',
                            elementType: 'radiant',
                            formula: '4d6 + SPI',
                            resolution: 'DICE',
                            hasDotEffect: false,
                            savingThrowConfig: {
                                enabled: false
                            },
                            criticalConfig: {
                                enabled: true,
                                critType: 'dice',
                                critMultiplier: 2,
                                critDiceOnly: false,
                                extraDice: '2d6'
                            }
                        },

                        targetingConfig: {
                            targetingType: 'single',
                            rangeType: 'ranged',
                            rangeDistance: 40,
                            targetRestrictions: ['enemy']
                        },

                        resourceCost: {
                            mana: 18,
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
                        id: 'righteous_condemnation',
                        name: 'Righteous Condemnation',
                        description: '"The guilty shall know no peace!" Mark an enemy with divine judgment, causing them to take increased damage from all sources.',
                        icon: 'spell_holy_sealofwisdom',
                        level: 2,
                        spellType: 'ACTION',
                        tags: ['debuff', 'divine', 'curse', 'judgment', 'vulnerability'],
                        effectTypes: ['debuff'],
                        damageTypes: [],

                        debuffConfig: {
                            duration: 8,
                            durationValue: 8,
                            durationType: 'rounds',
                            durationUnit: 'rounds',
                            statModifiers: [
                                {
                                    name: 'damage_vulnerability',
                                    stat: 'damage_taken',
                                    value: 25,
                                    magnitude: 25,
                                    magnitudeType: 'percentage',
                                    isPercentage: true
                                }
                            ],
                            statusEffects: [
                                {
                                    id: 'condemned',
                                    name: 'Condemned',
                                    description: 'Marked by divine judgment, taking 25% increased damage from all sources'
                                }
                            ],
                            debuffs: [
                                {
                                    name: 'Divine Condemnation',
                                    description: 'Target takes 25% increased damage',
                                    duration: 8,
                                    effects: {
                                        damageVulnerability: 25,
                                        cannotBeHealed: false
                                    }
                                }
                            ]
                        },

                        targetingConfig: {
                            targetingType: 'single',
                            rangeType: 'ranged',
                            rangeDistance: 50,
                            targetRestrictions: ['enemy']
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
                            value: 8,
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
                        visualTheme: 'holy',
                        effectMechanicsConfigs: {},
                        mechanicsConfig: []
                    },
                    {
                        id: 'divine_retribution',
                        name: 'Divine Retribution',
                        description: '"Strike me down, and face the wrath of the divine!" When you take damage, unleash a burst of holy energy that damages nearby enemies.',
                        icon: 'spell_holy_searinglightpriest',
                        level: 2,
                        spellType: 'REACTION',
                        tags: ['damage', 'radiant', 'divine', 'reaction', 'aoe', 'retribution'],
                        effectTypes: ['damage'],
                        damageTypes: ['radiant'],

                        damageConfig: {
                            damageType: 'direct',
                            elementType: 'radiant',
                            formula: '2d8 + SPI',
                            resolution: 'DICE',
                            hasDotEffect: false,
                            savingThrowConfig: {
                                enabled: true,
                                savingThrowType: 'spirit',
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

                        targetingConfig: {
                            targetingType: 'area',
                            rangeType: 'self_centered',
                            rangeDistance: 0,
                            aoeShape: 'sphere',
                            aoeSize: 10,
                            targetRestrictions: ['enemy']
                        },

                        triggerConfig: {
                            global: {
                                logicType: 'OR',
                                compoundTriggers: [
                                    {
                                        id: 'self_takes_damage',
                                        name: 'When you take damage',
                                        parameters: {
                                            damage_type: 'any',
                                            min_damage: 5,
                                            target_entity: 'self',
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
                            mana: 12,
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
                            type: 'short_rest',
                            value: 1,
                            charges: 2,
                            recovery: 2
                        },

                        resolution: 'DICE',
                        visualTheme: 'holy',
                        effectMechanicsConfigs: {},
                        mechanicsConfig: []
                    }
                ]
            }
        }
    },

    mystic: {
        id: 'mystic',
        name: 'Mystic',
        description: 'Seekers of inner enlightenment and spiritual harmony',
        icon: 'fas fa-om',
        overview: 'Mystics pursue enlightenment through meditation, inner balance, and spiritual discipline. They manipulate life energy, achieve transcendent states, and harmonize mind, body, and spirit.',

        mechanicalBenefits: [
            { name: 'Spirit Bonus', description: '+1 to Spirit attribute', type: 'stat' },
            { name: 'Inner Peace', description: 'Advantage on concentration checks', type: 'passive' },
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
                    }
                ]
            }
        }
    }
};

// Combine all paths
const ENHANCED_PATHS = {
    mystic: MYSTIC_PATH,
    zealot: ZEALOT_PATH.zealot,
    trickster: TRICKSTER_PATH,
    harrow: HARROW_PATH,
    arcanist: ARCANIST_PATH,
    hexer: HEXER_PATH,
    reaver: REAVER_PATH,
    mercenary: MERCENARY_PATH,
    sentinel: SENTINEL_PATH
};

export { ENHANCED_PATHS };

// Helper functions
export const getEnhancedPathData = (pathId) => {
    return ENHANCED_PATHS[pathId] || null;
};

export const getAllEnhancedPaths = () => {
    return Object.values(ENHANCED_PATHS);
};

export const getPathAbilities = (pathId) => {
    const path = getEnhancedPathData(pathId);
    return path?.abilities || [];
};

