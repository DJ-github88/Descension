// Class-specific resource system configuration for HUD display
// Each class has a unique 4th resource bar with specific mechanics and visuals

export const CLASS_RESOURCE_TYPES = {
    // INFERNAL PATH
    'Pyrofiend': {
        id: 'demonicAscension',
        name: 'Demonic Ascension',
        shortName: 'DA',
        type: 'stages',
        description: 'Ascension through demonic stages, each granting power but increasing corruption',
        visual: {
            type: 'progress-bar',
            count: 10,
            arrangement: 'horizontal',
            baseColor: '#4A0000',
            activeColor: '#FF4500',
            glowColor: '#FF6347',
            icon: '🔥',
            effects: ['fire', 'infernal']
        },
        mechanics: {
            max: 9, // Stages 0-9
            current: 0,
            regen: 0,
            consumeVerb: 'ascend',
            gainVerb: 'corrupt'
        },
        tooltip: {
            title: 'Demonic Ascension Stage {current}',
            description: 'Each stage grants demonic power but increases corruption risk',
            showStage: true,
            showBonuses: true,
            showDrawbacks: true
        },
        stages: [
            { name: 'Mortal', bonuses: [], drawbacks: [] },
            { name: 'Touched', bonuses: ['+5% Fire Damage'], drawbacks: [] },
            { name: 'Marked', bonuses: ['+10% Fire Damage', '+2 Fire Spell Power'], drawbacks: ['Vulnerable to Radiant'] },
            { name: 'Tainted', bonuses: ['+15% Fire Damage', '+4 Fire Spell Power'], drawbacks: ['Vulnerable to Radiant', '-1 Charisma'] },
            { name: 'Corrupted', bonuses: ['+20% Fire Damage', '+6 Fire Spell Power'], drawbacks: ['Vulnerable to Radiant', '-2 Charisma'] },
            { name: 'Infernal', bonuses: ['+25% Fire Damage', '+8 Fire Spell Power'], drawbacks: ['Vulnerable to Radiant', '-3 Charisma', 'Aura of Fear'] },
            { name: 'Demonic', bonuses: ['+30% Fire Damage', '+10 Fire Spell Power'], drawbacks: ['Vulnerable to Radiant', '-4 Charisma', 'Aura of Fear'] },
            { name: 'Archfiend', bonuses: ['+35% Fire Damage', '+12 Fire Spell Power'], drawbacks: ['Vulnerable to Radiant', '-5 Charisma', 'Aura of Terror'] },
            { name: 'Demon Lord', bonuses: ['+40% Fire Damage', '+15 Fire Spell Power'], drawbacks: ['Vulnerable to Radiant', '-6 Charisma', 'Aura of Terror'] },
            { name: 'Infernal Avatar', bonuses: ['+50% Fire Damage', '+20 Fire Spell Power'], drawbacks: ['Vulnerable to Radiant', '-8 Charisma', 'Aura of Despair'] }
        ]
    },
    'Minstrel': {
        id: 'musicalNotes',
        name: 'Musical Notes',
        shortName: 'Notes',
        type: 'notes',
        description: 'Musical notes that can be combined into powerful chord combinations',
        visual: {
            type: 'progress-bar',
            count: 7,
            arrangement: 'horizontal',
            baseColor: '#1E3A8A',
            activeColor: '#FFD700',
            glowColor: '#FFA500',
            icon: '🎵',
            effects: ['musical', 'harmony']
        },
        mechanics: {
            max: 7, // 7 different notes
            current: 0,
            regen: 0,
            consumeVerb: 'play',
            gainVerb: 'compose'
        },
        tooltip: {
            title: 'Musical Notes ({current}/7)',
            description: 'Combine notes to create powerful chord effects',
            showNotes: true,
            showCombos: true
        },
        notes: [
            { name: 'Tonic', position: 1, color: '#FF0000' },
            { name: 'Supertonic', position: 2, color: '#FF7F00' },
            { name: 'Mediant', position: 3, color: '#FFFF00' },
            { name: 'Subdominant', position: 4, color: '#00FF00' },
            { name: 'Dominant', position: 5, color: '#0000FF' },
            { name: 'Submediant', position: 6, color: '#4B0082' },
            { name: 'Leading Tone', position: 7, color: '#9400D3' }
        ]
    },

    'Chronarch': {
        id: 'timeShardsStrain',
        name: 'Time Shards & Temporal Strain',
        shortName: 'TS/TS',
        type: 'dual-resource',
        description: 'Dual resource system: Time Shards (power) and Temporal Strain (risk)',
        visual: {
            type: 'time-shards-strain',
            timeShards: {
                max: 10,
                baseColor: '#1a4d6d',
                activeColor: '#4FC3F7',
                glowColor: '#81D4FA',
                icon: '⏳',
                effects: ['temporal', 'power']
            },
            temporalStrain: {
                max: 10,
                baseColor: '#424242',
                // Dynamic colors based on strain level
                strainColors: {
                    safe: '#2E7D32',      // 0-2: Green
                    caution: '#F9A825',   // 3-4: Yellow
                    warning: '#FB8C00',   // 5-6: Orange
                    danger: '#E53935',    // 7-8: Red
                    critical: '#C62828',  // 9: Dark red
                    backlash: '#B71C1C'   // 10: Crimson
                },
                glowColor: '#FF5252',
                icon: '⚠️',
                effects: ['risk', 'instability']
            }
        },
        mechanics: {
            timeShards: {
                max: 10,
                current: 0,
                generation: '+1 per spell cast',
                persistence: 'Carries between combats',
                consumeVerb: 'spend',
                gainVerb: 'generate'
            },
            temporalStrain: {
                max: 10,
                current: 0,
                accumulation: '+1 to +5 per Temporal Flux ability',
                decay: '-1 per turn if no Flux abilities used',
                backlash: 'At 10: Lose next turn, take 10 damage, reset to 0',
                consumeVerb: 'decay',
                gainVerb: 'accumulate'
            }
        },
        tooltip: {
            timeShards: {
                title: 'Time Shards: {shards}/10',
                sections: [
                    {
                        label: 'Generation',
                        mechanics: [
                            { text: '+1 per spell cast' },
                            { text: 'Persists between combats' }
                        ]
                    },
                    {
                        label: 'Usage',
                        mechanics: [
                            { text: 'Spent on Temporal Flux abilities' },
                            { text: 'Cost: 1-10 shards per ability' }
                        ]
                    }
                ]
            },
            temporalStrain: {
                title: 'Temporal Strain: {strain}/10',
                sections: [
                    {
                        label: 'Accumulation',
                        mechanics: [
                            { text: '+1 to +5 per Temporal Flux ability' }
                        ]
                    },
                    {
                        label: 'Natural Decay',
                        mechanics: [
                            { text: '-1 per turn (if no Flux used)' }
                        ]
                    },
                    {
                        label: 'Temporal Backlash (at 10)',
                        mechanics: [
                            { text: 'Lose your next turn', emphasis: true },
                            { text: 'Take 10 damage', emphasis: true },
                            { text: 'Strain resets to 0' },
                            { text: 'All temporal effects end' }
                        ]
                    }
                ]
            },
            paradox: {
                title: 'The Chronarch\'s Paradox',
                description: 'Build Time Shards (power) by casting spells, but spending them on Temporal Flux adds Temporal Strain (risk). Balance power and safety by letting Strain decay between bursts of temporal manipulation.'
            }
        }
    },

    // TRICKSTER PATH
    'Chaos Weaver': {
        id: 'mayhemModifiers',
        name: 'Mayhem Modifiers',
        shortName: 'MM',
        type: 'mayhem',
        description: 'Chaotic energy used to influence random spell outcomes and control unpredictability',
        visual: {
            type: 'mayhem-modifiers',
            count: 20, // Max 20 modifiers
            arrangement: 'vortex-arc',
            baseColor: '#4A0E4E', // Deep purple base
            activeColor: '#9333EA', // Bright purple
            glowColor: '#D946EF', // Magenta glow
            vortexColor: '#7C3AED', // Violet vortex
            icon: '🌀',
            effects: ['chaos', 'reality-distortion', 'swirling-energy'],
            specializations: {
                'reality-bending': {
                    color: '#9B59B6',
                    particleColor: '#BB8FCE',
                    theme: 'spatial'
                },
                'entropy-weaver': {
                    color: '#E91E63',
                    particleColor: '#F48FB1',
                    theme: 'pure-chaos'
                },
                'pandemonium': {
                    color: '#C2185B',
                    particleColor: '#F06292',
                    theme: 'wild-magic'
                }
            }
        },
        mechanics: {
            max: 20, // Fixed max of 20 Mayhem Modifiers
            current: 0,
            regen: 0,
            consumeVerb: 'spend',
            gainVerb: 'generate'
        },
        tooltip: {
            title: 'Mayhem Modifiers: {current}/{max}',
            description: 'Spend modifiers to adjust random table results by ±1 per modifier. Generate through specific abilities.',
            mechanics: [
                'Each modifier adjusts table results by ±1',
                'Max 20 modifiers can be stored',
                'Generated through Chaotic Infusion, Wild Conduit, etc.',
                'Spent to control chaos spell outcomes'
            ],
            tables: ['d20 Chaos Tables', 'd33 Wild Magic', 'd100 Pandemonium'],
            showDice: true,
            showChaos: true
        },
        dice: ['d20', 'd33', 'd100']
    },

    'Fate Weaver': {
        id: 'cardDeck',
        name: 'Fate Cards',
        shortName: 'Cards',
        type: 'cards',
        description: 'Mystical cards that reveal and manipulate destiny',
        visual: {
            type: 'progress-bar',
            count: 'variable',
            arrangement: 'horizontal',
            baseColor: '#1F2F2F',
            activeColor: '#FFD700',
            glowColor: '#FFA500',
            icon: '🃏',
            effects: ['mystical', 'fate']
        },
        mechanics: {
            max: 52, // Full deck
            current: 5, // Starting hand
            regen: 0,
            consumeVerb: 'play',
            gainVerb: 'draw'
        },
        tooltip: {
            title: 'Fate Cards: {current} in hand',
            description: 'Mystical cards that manipulate destiny',
            showHand: true,
            showDeck: true
        }
    },

    'Gambler': {
        id: 'luckPoints',
        name: 'Luck Points',
        shortName: 'LP',
        type: 'gambling',
        description: 'Luck points for gambling with fate, balanced against mounting risk',
        visual: {
            type: 'progress-bar',
            count: 2,
            arrangement: 'horizontal',
            baseColor: '#8B6914',
            activeColor: '#FFD700',
            glowColor: '#FFA500',
            riskColor: '#DC143C',
            icon: '🎲',
            effects: ['luck', 'risk']
        },
        mechanics: {
            max: 'calculated', // CHA mod + 5
            current: 0,
            risk: 0,
            regen: 0,
            consumeVerb: 'gamble',
            gainVerb: 'win'
        },
        tooltip: {
            title: 'Luck: {current}/{max} | Risk: {risk}',
            description: 'Gambling with fate - higher risk, higher reward',
            showOdds: true,
            showRisk: true
        }
    },

    'Deathcaller': {
        id: 'necroticAscension',
        name: 'Necrotic Ascension & Blood Tokens',
        shortName: 'NA/BT',
        type: 'ascension-blood',
        description: 'Dual resource system: Necrotic Ascension Paths (permanent power/curses) and Blood Tokens (ticking time bomb)',
        visual: {
            type: 'ascension-blood',
            ascensionPaths: {
                max: 7,
                baseColor: '#1a0d1a',
                activeColor: '#8B0000',
                glowColor: '#DC143C',
                icon: '💀'
            },
            bloodTokens: {
                max: 30, // Soft cap for display, no hard limit
                baseColor: '#2d0a0a',
                activeColor: '#B22222',
                glowColor: '#FF4444',
                warningColor: '#FF6B6B',
                dangerColor: '#FF0000',
                icon: '🩸'
            }
        },
        mechanics: {
            max: 7, // 7 Ascension Paths
            current: 0,
            bloodTokens: 0,
            tokenTimer: 600, // 10 minutes in seconds
            regen: 0,
            consumeVerb: 'activate',
            gainVerb: 'unlock'
        },
        tooltip: {
            title: 'Necrotic Ascension & Blood Tokens',
            description: 'Activate paths for permanent power/curses. Generate Blood Tokens from HP sacrifice.',
            showPaths: true,
            showBoons: true,
            showCurses: true,
            showTokens: true,
            showTimer: true
        },
        paths: [
            {
                name: 'Shrouded Veil',
                level: 1,
                boon: '+2d6 necrotic damage, advantage on Stealth',
                curse: '-10 max HP (perpetual shadow drain)',
                shortName: 'Veil'
            },
            {
                name: 'Crimson Pact',
                level: 3,
                boon: 'Generate Blood Tokens (1 HP = 1 Token), tokens last 15 min',
                curse: 'Tokens burst for 1d10 damage each if unused',
                shortName: 'Pact'
            },
            {
                name: 'Spectral Command',
                level: 5,
                boon: 'Summon 2 specters, +1d6 necrotic damage',
                curse: 'Specters drain 1d4 HP/turn from you',
                shortName: 'Spectral'
            },
            {
                name: 'Frostwalker',
                level: 7,
                boon: 'Aura: 15ft radius, -10ft enemy speed, 1d4 cold/turn',
                curse: '+50% fire damage taken (vulnerability)',
                shortName: 'Frost'
            },
            {
                name: 'Silent Shroud',
                level: 9,
                boon: 'Advantage on Stealth, silent movement',
                curse: '-2 Perception (muffled senses)',
                shortName: 'Silent'
            },
            {
                name: 'Life Leech',
                level: 11,
                boon: 'Melee attacks restore 1d6 HP',
                curse: '-5% max HP (unquenchable thirst)',
                shortName: 'Leech'
            },
            {
                name: 'Deep Void',
                level: 13,
                boon: '1/long rest: Negate any spell targeting you',
                curse: '2d6 psychic damage when used (void consumption)',
                shortName: 'Void'
            }
        ],
        bloodTokens: {
            name: 'Blood Tokens',
            description: 'Generated by sacrificing health, enhance necrotic spells',
            generation: '1 HP sacrificed = 1 Blood Token',
            usage: 'Spend tokens to add 1d6 necrotic damage per token',
            expiration: '10 minutes (15 with Crimson Pact)',
            burstDamage: '1d10 necrotic per unused token',
            warningThreshold: 10, // Show warning at 10+ tokens
            dangerThreshold: 20 // Show danger at 20+ tokens
        }
    },
    // DIVINE PATH
    'Martyr': {
        id: 'devotionGauge',
        name: 'Devotion Gauge',
        shortName: 'Devotion',
        type: 'stages',
        description: 'Power through sacrifice - accumulate damage to unlock devotion levels with passive effects',
        visual: {
            type: 'progress-bar',
            count: 7,
            arrangement: 'horizontal',
            baseColor: '#4A0000',
            activeColor: '#FFD700',
            glowColor: '#FFF8DC',
            icon: '✝️',
            effects: ['holy', 'sacrifice', 'devotion']
        },
        mechanics: {
            max: 6, // Devotion Levels 0-6
            current: 0,
            regen: 0,
            consumeVerb: 'spend',
            gainVerb: 'build'
        },
        tooltip: {
            title: 'Devotion Level {current}',
            description: 'Build through damage taken or Intervene. Spend for amplified spells.',
            showStage: true,
            showPassive: true,
            showAmplify: true
        },
        stages: [
            { name: 'Mortal Resolve', level: 0, requirement: 'Starting state', passive: 'None' },
            { name: 'Flickering Faith', level: 1, requirement: '10 damage or 1 Intervene', passive: 'Gain 5 temp HP when ally within 5 ft takes damage' },
            { name: 'Steadfast Conviction', level: 2, requirement: '20 damage or 2 Intervenes', passive: 'All healing effects +5 HP' },
            { name: 'Radiant Sacrifice', level: 3, requirement: '40 damage or 3 Intervenes', passive: 'Allies within 10 ft gain +1 AC' },
            { name: 'Divine Ascendance', level: 4, requirement: '60 damage or 4 Intervenes', passive: 'Advantage on all saving throws' },
            { name: 'Holy Martyrdom', level: 5, requirement: '80 damage or 5 Intervenes', passive: 'Deal +10 radiant damage on attacks' },
            { name: 'Celestial Protector', level: 6, requirement: '100 damage or 6 Intervenes', passive: 'Allies within 15 ft gain resistance to all damage' }
        ]
    },

    'False Prophet': {
        id: 'madnessPoints',
        name: 'Madness Points',
        shortName: 'Madness',
        type: 'madness',
        description: 'Eldritch madness that empowers shadow damage but risks Insanity Convulsion at 20 points',
        visual: {
            type: 'progress-bar',
            count: 20,
            arrangement: 'horizontal',
            baseColor: '#1F1F2F',
            activeColor: '#9400D3',
            glowColor: '#8B008B',
            warningColor: '#DC143C',
            icon: '👁️',
            effects: ['madness', 'eldritch', 'void']
        },
        mechanics: {
            max: 20, // Fixed at 20, triggers Insanity Convulsion
            current: 0,
            regen: 0,
            consumeVerb: 'spend',
            gainVerb: 'accumulate'
        },
        tooltip: {
            title: 'Madness: {current}/20 | Shadow Damage: +{current}',
            description: 'Each point adds +1 shadow damage. At 20: Insanity Convulsion!',
            showMadness: true,
            showThresholds: true,
            showWarning: true
        },
        thresholds: [
            { value: 6, name: 'Veil of Shadows', effect: 'Unlock invisibility (adds 1d4 Madness)', color: '#9400D3' },
            { value: 9, name: 'Eldritch Vision', effect: 'Unlock true sight (adds 1d6 Madness)', color: '#8B008B' },
            { value: 12, name: 'Apocalyptic Revelation', effect: 'Unlock 8d6 AoE (adds 2d6 Madness)', color: '#DC143C' },
            { value: 15, name: 'Danger Zone', effect: 'High risk of Convulsion', color: '#FF0000' },
            { value: 20, name: 'INSANITY CONVULSION', effect: 'Roll 1d6 on Convulsion Table', color: '#8B0000' }
        ],
        insanityConvulsionTable: [
            { roll: 1, name: 'Shadow Burst', effect: '5d6 necrotic to self and all within 20 ft' },
            { roll: 2, name: 'Mind Shatter', effect: 'Stunned for 2 rounds' },
            { roll: 3, name: 'Dark Whispers', effect: 'Disadvantage on all attacks/saves for 3 rounds' },
            { roll: 4, name: 'Chaotic Pulse', effect: 'Teleport randomly within 60 ft, take 4d6 psychic damage' },
            { roll: 5, name: 'Psychic Scream', effect: 'All within 30 ft save or frightened for 3 rounds' },
            { roll: 6, name: 'Nightmare Echoes', effect: '6d6 psychic damage, Short-Term Madness for 1d4 rounds' }
        ]
    },

    'Exorcist': {
        id: 'dominanceSystem',
        name: 'Dominance System',
        shortName: 'Dominance',
        type: 'demon_control',
        description: 'Control over bound demons through Dominance Dice - maintain willpower or demons escape',
        visual: {
            type: 'multi-bar',
            count: 'per_demon',
            arrangement: 'vertical',
            baseColor: '#4A0000',
            activeColor: '#FFD700',
            glowColor: '#FFF8DC',
            warningColor: '#DC143C',
            icon: '⛓️',
            effects: ['binding', 'control', 'dominance']
        },
        mechanics: {
            max: 'per_demon', // Each demon has own DD (d6, d8, d10, or d12)
            current: 'varies',
            regen: 0,
            consumeVerb: 'command',
            gainVerb: 'restore',
            demonCapacity: 2 // Base: 2 demons, Demonologist: 4, Demon Lord: 1
        },
        tooltip: {
            title: 'Dominance: {demon_name} - {current_dd}',
            description: 'DD decreases with each action/hit. At 0: saving throw or demon escapes',
            showDominanceDie: true,
            showDemonInfo: true,
            showWarning: true
        },
        dominanceDice: {
            progression: ['d12', 'd10', 'd8', 'd6', '0'],
            description: 'DD decreases by 1 step per demon action or hit taken'
        },
        demonTiers: [
            { tier: 1, name: 'Weak (Imp)', startingDD: 'd12', difficulty: 'Easy' },
            { tier: 2, name: 'Moderate (Shadow Hound, Wraith)', startingDD: 'd10', difficulty: 'Medium' },
            { tier: 3, name: 'Strong (Abyssal Brute, Banshee)', startingDD: 'd8', difficulty: 'Hard' },
            { tier: 4, name: 'Greater Demons', startingDD: 'd6', difficulty: 'Very Hard (Demon Lord only)' }
        ],
        replenishmentSpells: [
            { name: 'Reassert Dominance', cost: 5, effect: 'Restore DD to maximum' },
            { name: 'Chain of Command', cost: 4, effect: 'Increase DD by 1 size for 3 actions' },
            { name: 'Divine Bond', cost: 6, effect: 'Restore DD by 2 steps' }
        ]
    },

    // HARROW PATH
    'Plaguebringer': {
        id: 'afflictionCultivation',
        name: 'Affliction Cultivation',
        shortName: 'AC',
        type: 'affliction',
        description: 'Track and evolve afflictions through strategic spell combinations',
        visual: {
            type: 'tracker',
            count: 'variable',
            arrangement: 'list',
            baseColor: '#2D4A17',
            activeColor: '#556B2F',
            glowColor: '#9ACD32',
            icon: '🦠',
            effects: ['disease', 'curse', 'poison', 'contagion']
        },
        mechanics: {
            max: 'unlimited',
            current: 0,
            regen: 0,
            consumeVerb: 'evolve',
            gainVerb: 'cultivate',
            categories: ['Weaken', 'Torment', 'Fester', 'Amplify Pain', 'Decay', 'Nurture', 'Corrupt', 'Infect'],
            developmentPaths: [
                'Weaken → Torment → Amplify Pain',
                'Weaken → Fester → Decay',
                'Torment → Fester → Corrupt',
                'Infect → Weaken → Amplify Pain',
                'Torment → Nurture → Infect',
                'Decay → Weaken → Corrupt',
                'Nurture → Decay → Amplify Pain',
                'Fester → Torment → Nurture'
            ]
        },
        tooltip: {
            title: 'Affliction Cultivation: {count} active afflictions',
            description: 'Apply base afflictions, then evolve them through category spells',
            showAfflictions: true,
            showDevelopmentProgress: true
        }
    },

    'Lichborne': {
        id: 'phylacteryCore',
        name: 'Eternal Frost Aura & Phylactery',
        shortName: 'EFA',
        type: 'frost_undead',
        description: 'Toggle aura for frost damage boost with HP drain, phylactery stores HP for resurrection',
        visual: {
            type: 'dual-bar',
            count: 'variable',
            arrangement: 'horizontal',
            baseColor: '#1B3A52',
            activeColor: '#4A90E2',
            glowColor: '#87CEEB',
            icon: '❄️',
            effects: ['frost', 'undead', 'aura']
        },
        mechanics: {
            aura: {
                active: false,
                bonusDamage: '1d6',
                healthDrain: '1d6 per turn',
                chillingEffect: 'DC 15 Constitution save or -10 ft movement'
            },
            phylactery: {
                max: 50, // Can store up to 50 HP
                current: 0,
                storageRitual: '1 hour to transfer 10 HP',
                resurrectionCost: 10,
                resurrectionHP: 10,
                limitPerCombat: 1,
                rechargePerRest: 10
            },
            consumeVerb: 'spend',
            gainVerb: 'store'
        },
        tooltip: {
            title: 'Eternal Frost Aura: {active} | Phylactery: {current}/50 HP',
            description: 'Aura: +1d6 frost damage, -1d6 HP/turn | Phylactery: Resurrection backup',
            showAuraStatus: true,
            showPhylacteryHP: true
        }
    }
};

// Helper function to get class resource configuration
export const getClassResourceConfig = (className) => {
    return CLASS_RESOURCE_TYPES[className] || null;
};

// Helper function to initialize class resource based on character stats
export const initializeClassResource = (className, characterStats) => {
    const config = getClassResourceConfig(className);
    if (!config) return null;

    const level = characterStats.level || 1;
    const baseResource = {
        type: config.id,
        current: config.mechanics.current,
        max: config.mechanics.max,
        stacks: [],
        phase: config.mechanics.phase || null,
        threshold: 0,
        slots: [],
        charges: 0,
        volatility: config.mechanics.volatility || 0,
        strain: config.mechanics.strain || 0,
        risk: config.mechanics.risk || 0,
        flourish: config.mechanics.flourish || 0,
        stance: config.mechanics.stance || null,
        wardTokens: config.mechanics.wardTokens || 0,
        precision: config.mechanics.precision || 0,
        activeEffects: [],
        lastUpdate: Date.now()
    };

    // Calculate max based on character stats for certain classes
    if (config.mechanics.max === 'calculated') {
        const intMod = Math.floor((characterStats.intelligence - 10) / 2);
        const chaMod = Math.floor((characterStats.charisma - 10) / 2);
        const spirMod = Math.floor((characterStats.spirit - 10) / 2);
        const conMod = Math.floor((characterStats.constitution - 10) / 2);

        switch (className) {
            case 'Chaos Weaver':
                baseResource.max = Math.max(5, intMod + Math.floor(level / 5));
                break;
            case 'Gambler':
            case 'False Prophet':
                baseResource.max = Math.max(1, chaMod + 5);
                break;
            case 'Exorcist':
                baseResource.max = Math.max(1, spirMod + 3);
                break;
            case 'Martyr':
                baseResource.max = Math.max(1, conMod + 3);
                break;
            case 'Spellguard':
                baseResource.max = Math.max(1, intMod + 5);
                break;
            case 'Inscriptor':
                baseResource.max = Math.max(3, 3 + intMod);
                break;
            case 'Witch Doctor':
                baseResource.max = Math.max(1, 5 + spirMod);
                break;
            case 'Dreadnaught':
                baseResource.max = Math.max(1, 5 + conMod);
                break;
            case 'Toxicologist':
                baseResource.max = Math.max(1, intMod + 3);
                break;
            case 'Covenbane':
                baseResource.max = Math.max(1, spirMod + 5);
                break;
            case 'Lunarch':
                // Lunar charge max varies by phase
                baseResource.max = baseResource.phase === 'full' ? 10 : baseResource.phase === 'new' ? 3 : 6;
                break;
            default:
                baseResource.max = 5; // Default fallback
        }
    }

    return baseResource;
};

// Helper function to update class resource max values when stats change
export const updateClassResourceMax = (classResource, className, characterStats) => {
    const config = getClassResourceConfig(className);
    if (!config || !classResource) return classResource;

    if (config.mechanics.max === 'calculated') {
        const updatedResource = initializeClassResource(className, characterStats);
        return {
            ...classResource,
            max: updatedResource.max
        };
    }

    return classResource;
};

// Add remaining classes - ARCANIST PATH
CLASS_RESOURCE_TYPES['Spellguard'] = {
    id: 'arcaneEnergyPoints',
    name: 'Arcane Energy Points',
    shortName: 'AEP',
    type: 'absorption',
    description: 'Arcane energy absorbed from magical damage that can be spent on powerful abilities',
    visual: {
        type: 'progress-bar',
        count: 'variable',
        arrangement: 'horizontal',
        baseColor: '#1E3A8A',
        activeColor: '#4169E1',
        glowColor: '#87CEEB',
        icon: '⚡',
        effects: ['arcane', 'absorption', 'anti-magic']
    },
    mechanics: {
        max: 100, // Maximum 100 AEP
        current: 0,
        regen: 0, // No natural regen, only from absorption
        decay: 5, // Decays 5 AEP per minute outside combat
        consumeVerb: 'spend',
        gainVerb: 'absorb'
    },
    tooltip: {
        title: 'Arcane Energy Points: {current}/{max}',
        description: 'Energy absorbed from magical damage. Spend on shields, reflections, and strikes.',
        showAEP: true,
        showAbsorption: true,
        showDecay: true
    }
};

CLASS_RESOURCE_TYPES['Inscriptor'] = {
    id: 'glyphSlots',
    name: 'Glyph Slots',
    shortName: 'GS',
    type: 'runic',
    description: 'Runic glyphs that can be inscribed and connected in magical circuits',
    visual: {
        type: 'progress-bar',
        count: 'calculated',
        arrangement: 'horizontal',
        baseColor: '#4A2C0A',
        activeColor: '#FFD700',
        glowColor: '#FFA500',
        icon: '🔮',
        effects: ['runic', 'inscription']
    },
    mechanics: {
        max: 'calculated',
        current: 0,
        regen: 0,
        consumeVerb: 'inscribe',
        gainVerb: 'charge'
    },
    tooltip: {
        title: 'Glyph Slots: {current}/{max} | Circuits: {circuits}',
        description: 'Runic glyphs connected in magical circuits',
        showGlyphs: true,
        showCircuits: true
    }
};

CLASS_RESOURCE_TYPES['Arcanoneer'] = {
    id: 'elementalSpheres',
    name: 'Elemental Spheres',
    shortName: 'Spheres',
    type: 'spheres',
    description: 'Roll 4d8 each turn to generate random elemental spheres that can be combined to cast spells',
    visual: {
        type: 'elemental-spheres',
        count: 8, // 2x4 grid for 8 element types
        arrangement: 'grid',
        layout: '2x4',
        baseColor: 'rgba(255, 255, 255, 0.1)',
        emptyColor: 'rgba(255, 255, 255, 0.05)',
        icon: '🔮',
        effects: ['elemental', 'combination', 'magicka']
    },
    mechanics: {
        max: 'unlimited', // Can bank spheres (Runesmith limits to 12)
        current: 0,
        spheres: [], // Array of element names: ['fire', 'fire', 'ice', 'healing']
        generation: '4d8', // Roll 4d8 each turn
        regen: 0,
        consumeVerb: 'combine',
        gainVerb: 'generate'
    },
    tooltip: {
        title: 'Elemental Spheres',
        description: 'Magicka-inspired sphere combination system. Roll 4d8 each turn to generate random elemental spheres.',
        showSpheres: true,
        showBreakdown: true,
        showCombinations: true
    },
    elements: [
        {
            id: 'arcane',
            name: 'Arcane',
            color: '#9370DB',
            glowColor: '#BA9FE8',
            d8Value: 1,
            icon: 'fas fa-wand-magic-sparkles',
            description: 'Raw magical force'
        },
        {
            id: 'holy',
            name: 'Holy',
            color: '#FFD700',
            glowColor: '#FFE55C',
            d8Value: 2,
            icon: 'fas fa-sun',
            description: 'Divine radiance'
        },
        {
            id: 'shadow',
            name: 'Shadow',
            color: '#1C1C1C',
            glowColor: '#4A4A4A',
            d8Value: 3,
            icon: 'fas fa-moon',
            description: 'Necrotic darkness'
        },
        {
            id: 'fire',
            name: 'Fire',
            color: '#FF4500',
            glowColor: '#FF6347',
            d8Value: 4,
            icon: 'fas fa-fire',
            description: 'Burning flames'
        },
        {
            id: 'ice',
            name: 'Ice',
            color: '#4169E1',
            glowColor: '#6495ED',
            d8Value: 5,
            icon: 'fas fa-snowflake',
            description: 'Freezing cold'
        },
        {
            id: 'nature',
            name: 'Nature',
            color: '#32CD32',
            glowColor: '#90EE90',
            d8Value: 6,
            icon: 'fas fa-leaf',
            description: 'Thunder and vines'
        },
        {
            id: 'healing',
            name: 'Healing',
            color: '#FFFF00',
            glowColor: '#FFFFE0',
            d8Value: 7,
            icon: 'fas fa-heart',
            description: 'Life energy'
        },
        {
            id: 'chaos',
            name: 'Chaos',
            color: 'linear-gradient(45deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)',
            glowColor: '#FF00FF',
            d8Value: 8,
            icon: 'fas fa-random',
            description: 'Unpredictable magic',
            isGradient: true
        }
    ]
};

// HEXER PATH
CLASS_RESOURCE_TYPES['Witch Doctor'] = {
    id: 'voodooEssence',
    name: 'Voodoo Essence',
    shortName: 'VE',
    type: 'spiritual',
    description: 'Spiritual essence for invoking loa spirits and voodoo magic',
    visual: {
        type: 'progress-bar',
        count: 'calculated',
        arrangement: 'horizontal',
        baseColor: '#4A2C0A',
        activeColor: '#32CD32',
        glowColor: '#ADFF2F',
        icon: '🎭',
        effects: ['spiritual', 'tribal']
    },
    mechanics: {
        max: 'calculated',
        current: 0,
        regen: 0,
        consumeVerb: 'invoke',
        gainVerb: 'channel'
    },
    tooltip: {
        title: 'Voodoo Essence: {current}/{max} | Loa: {loa}',
        description: 'Spiritual essence for invoking loa spirits',
        showEssence: true,
        showLoa: true
    }
};

CLASS_RESOURCE_TYPES['Formbender'] = {
    id: 'wildInstinct',
    name: 'Wild Instinct',
    shortName: 'WI',
    type: 'primal',
    description: 'Primal instinct energy for shapeshifting and wild abilities',
    visual: {
        type: 'progress-bar',
        count: 5,
        arrangement: 'horizontal',
        baseColor: '#0F4B0F',
        activeColor: '#32CD32',
        glowColor: '#90EE90',
        icon: '🐺',
        effects: ['primal', 'transformation']
    },
    mechanics: {
        max: 5,
        current: 0,
        regen: 0,
        consumeVerb: 'shift',
        gainVerb: 'attune'
    },
    tooltip: {
        title: 'Wild Instinct: {current}/5 | Form: {form}',
        description: 'Primal energy for shapeshifting abilities',
        showInstinct: true,
        showForm: true
    }
};

CLASS_RESOURCE_TYPES['Primalist'] = {
    id: 'primalResonance',
    name: 'Primal Resonance',
    shortName: 'PR',
    type: 'elemental',
    description: 'Elemental resonance connecting to active totems',
    visual: {
        type: 'progress-bar',
        count: 6,
        arrangement: 'horizontal',
        baseColor: '#4A2C0A',
        activeColor: '#FF6347',
        glowColor: '#FFA500',
        icon: '🗿',
        effects: ['elemental', 'totemic']
    },
    mechanics: {
        max: 6,
        current: 0,
        regen: 0,
        consumeVerb: 'resonate',
        gainVerb: 'attune'
    },
    tooltip: {
        title: 'Primal Resonance: {current}/6 | Totems: {totems}',
        description: 'Elemental energy linking to active totems',
        showResonance: true,
        showTotems: true
    }
};

// REAVER PATH
CLASS_RESOURCE_TYPES['Berserker'] = {
    id: 'rageStates',
    name: 'Rage States',
    shortName: 'RAGE',
    type: 'rage',
    description: 'Escalating fury from 0-100 with six distinct Rage States',
    visual: {
        type: 'dual-dice',
        count: 2,
        diceType: 'd10',
        arrangement: 'horizontal',
        baseColor: '#4A0000',
        activeColor: '#8B0000',
        glowColor: '#FF4500',
        icon: '⚔️',
        effects: ['rage', 'fury', 'escalation']
    },
    mechanics: {
        max: 100,
        current: 0,
        regen: 0,
        decay: 5, // Rage decreases by 5 per round if no Rage-generating actions
        overheat: {
            threshold: 101,
            damage: '2d6',
            resetTo: 0,
            description: 'If Rage exceeds 101 and is not spent within one round, take 2d6 damage and reset to 0'
        },
        generation: {
            attacking: '1d6',
            criticalHit: '2d6',
            takingDamage: '1d4',
            defeatingEnemy: '1d8'
        },
        consumeVerb: 'spend',
        gainVerb: 'build'
    },
    tooltip: {
        title: 'Rage: {current}/100 | State: {state}',
        description: 'Escalating fury with six Rage States. Overheat at 101+. Use the button to +10, -10, or Set a value.',
        showRage: true,
        showState: true,
        showOverheatWarning: true
    },
    rageStates: [
        {
            range: [0, 20],
            name: 'Smoldering',
            effects: ['Basic Strike', 'Defensive Stance'],
            attackBonus: 0,
            bonuses: ['+1 to skill checks'],
            penalties: []
        },
        {
            range: [21, 40],
            name: 'Frenzied',
            effects: ['Frenzied Slash', 'War Cry', '+1 attack rolls'],
            attackBonus: 1,
            bonuses: ['+5 ft movement speed', '+1 damage on melee hits'],
            penalties: ['-1 to ranged attack rolls']
        },
        {
            range: [41, 60],
            name: 'Primal',
            effects: ['Primal Roar', 'Bloodlust', '+2 attack rolls', 'Self-healing unlocked'],
            attackBonus: 2,
            bonuses: ['+2 damage on melee hits', '1 HP lifesteal on crits'],
            penalties: ['-1 Armor while raging']
        },
        {
            range: [61, 80],
            name: 'Carnage',
            effects: ['Carnage Strike', 'Raging Defense', '+3 attack rolls', 'Damage resistance'],
            attackBonus: 3,
            bonuses: ['+3 damage on melee hits', 'Reduce incoming weapon damage by 1'],
            penalties: ['Disadvantage on Stealth checks', '-2 to ranged attack rolls']
        },
        {
            range: [81, 100],
            name: 'Cataclysm',
            effects: ['Cataclysmic Blow', 'Unstoppable Force', '+4 attack rolls', 'Condition immunity'],
            attackBonus: 4,
            bonuses: ['+4 damage on melee hits', 'Immune to being Frightened'],
            penalties: ['Attackers gain +1 to hit you', 'On miss, take 1d4 recoil damage']
        },
        {
            range: [101, 124],
            name: 'Obliteration',
            effects: ['Obliterating Strike', 'Wrath of the Berserker', '+5 attack rolls', 'OVERHEAT IMMINENT'],
            attackBonus: 5,
            bonuses: ['+5 damage on melee hits', 'Critical hits explode: +1d6 splash to adjacent enemies'],
            penalties: ['-2 Armor', 'Attackers gain +2 to hit you'],
            warning: 'Must spend Rage this round or take 2d6 damage and reset to 0'
        },
        {
            range: [125, 149],
            name: 'Annihilation',
            effects: ['Annihilating Fury', 'Unstoppable Rampage', '+6 attack rolls', 'CRITICAL OVERHEAT'],
            attackBonus: 6,
            bonuses: ['+6 damage on melee hits', '+10 ft movement speed', 'Crit range expanded by 1 on weapon dice', 'Advantage on Strength checks'],
            penalties: ['-3 Armor', 'Attackers gain +3 to hit you', '-5 ft movement speed after rage ends', 'Take 1d6 damage at start of each turn']
        },
        {
            range: [150, 999],
            name: 'Apocalypse',
            effects: ['Apocalyptic Wrath', 'Berserker God Mode', '+7 attack rolls', 'MAXIMUM OVERHEAT'],
            attackBonus: 7,
            bonuses: ['+8 damage on melee hits', '+15 ft movement speed', 'Crit range expanded by 2 on weapon dice', 'All melee attacks hit adjacent enemies', 'Immune to all conditions'],
            penalties: ['-5 Armor', 'Attackers gain +4 to hit you', '-10 ft movement speed after rage ends', 'Take 2d6 damage at start of each turn', 'Cannot use ranged attacks']
        }
    ]
};

CLASS_RESOURCE_TYPES['Dreadnaught'] = {
    id: 'darkResiliencePoints',
    name: 'Dark Resilience Points',
    shortName: 'DRP',
    type: 'resilience',
    description: 'Convert damage taken into dark power (1 DRP per 5 damage)',
    visual: {
        type: 'progress-bar',
        count: 50,
        arrangement: 'horizontal',
        baseColor: '#1a0033',
        activeColor: '#4B0082',
        glowColor: '#8B00FF',
        icon: '🛡️',
        effects: ['shadow', 'resilience', 'absorption']
    },
    mechanics: {
        max: 50,
        current: 0,
        regen: 0,
        generation: {
            damageTaken: '1 DRP per 5 damage',
            soulreaverBonus: '1 DRP per 4 damage',
            necroticDamageDealt: '1 DRP (Soulreaver only)'
        },
        passiveEffects: {
            darkResistance: {
                threshold: 10,
                effect: 'Resistance to one damage type',
                voidwardenBonus: 'Two damage types'
            },
            regeneration: {
                threshold: 10,
                effect: '1 HP per 10 DRP at turn start',
                voidwardenBonus: '× 1.5 regeneration'
            }
        },
        consumeVerb: 'spend',
        gainVerb: 'absorb'
    },
    tooltip: {
        title: 'DRP: {current}/50 | Regen: {regen} HP/turn',
        description: 'Dark power from damage taken. Spend for shields, strikes, and fortitude',
        showDRP: true,
        showRegen: true,
        showResistance: true
    },
    abilities: [
        {
            name: 'Shadow Shield',
            cost: 'variable',
            effect: 'Absorb 2× DRP spent (2.5× for Voidwarden)'
        },
        {
            name: 'Wraith Strike',
            cost: '5/10/15/20',
            effect: '+1d6/2d6/3d6/4d6 necrotic damage'
        },
        {
            name: 'Unholy Fortitude',
            cost: '5/10/15/20',
            effect: '+1/+2/+3/+4 AC for 1 minute'
        },
        {
            name: 'Necrotic Aura',
            cost: '15 (10 for Doomguard)',
            effect: 'Enemies have disadvantage on attacks for 1 minute'
        },
        {
            name: 'Dark Rebirth',
            cost: 'All remaining',
            effect: 'Revive with 2× DRP as HP when reaching 0 HP'
        }
    ]
};

CLASS_RESOURCE_TYPES['Titan'] = {
    id: 'celestialDevotion',
    name: 'Celestial Devotion',
    shortName: 'DEVOTION',
    type: 'attunement',
    description: 'Attune to one of five celestial beings for daily power',
    visual: {
        type: 'devotion-selector',
        arrangement: 'horizontal',
        baseColor: '#1a1a2e',
        activeColor: '#FFD700',
        glowColor: '#FFA500',
        icon: '✨',
        effects: ['celestial', 'divine', 'devotion']
    },
    mechanics: {
        currentDevotion: null,
        switchFrequency: 'long_rest',
        devotions: {
            solara: {
                name: 'Solara (Radiant Sun)',
                color: '#FFD700',
                icon: '☀️',
                passive: 'Melee attacks +1d6 radiant',
                ultimate: 'Solar Flare (3d8 radiant AoE, blind)',
                restriction: 'Enemies have advantage in bright light'
            },
            lunara: {
                name: 'Lunara (Moon Guardian)',
                color: '#C0C0C0',
                icon: '🌙',
                passive: '+2 AC, regenerate 5 HP/turn',
                ultimate: 'Lunar Shield (50 damage absorption for allies)',
                restriction: 'External healing halved'
            },
            astraeus: {
                name: 'Astraeus (Star Sage)',
                color: '#9370DB',
                icon: '⭐',
                passive: '+10 ft movement, advantage on Dex saves',
                ultimate: 'Starfall (4d6 force, stun)',
                restriction: '+1d6 damage from non-magical attacks'
            },
            terranox: {
                name: 'Terranox (Earth Titan)',
                color: '#8B4513',
                icon: '🗻',
                passive: '+20 HP, resistance to physical damage',
                ultimate: 'Earthquake (3d6 bludgeoning AoE, prone)',
                restriction: '-10 ft movement speed'
            },
            zephyra: {
                name: 'Zephyra (Wind Spirit)',
                color: '#87CEEB',
                icon: '💨',
                passive: '+2 attack speed, +1d4 lightning on melee',
                ultimate: 'Wind Dash (teleport 30 ft, 3d6 lightning)',
                restriction: '10% knockback chance when damaged'
            }
        },
        consumeVerb: 'invoke',
        gainVerb: 'attune'
    },
    tooltip: {
        title: 'Devotion: {currentDevotion}',
        description: 'Switch devotions during long rest for different powers',
        showDevotion: true,
        showUltimateCharges: true
    },
    specializations: {
        celestialChampion: {
            effect: 'Benefits +50%, restrictions +50%, 2 ultimate uses',
            description: 'Maximize devotion power'
        },
        divineConduit: {
            effect: 'Restrictions -50%, benefits -25%, dual attunement',
            description: 'Reduce drawbacks'
        },
        astralWarrior: {
            effect: 'Switch devotions in combat (3 uses), benefits -15%',
            description: 'Tactical flexibility'
        }
    }
};

// MERCENARY PATH
CLASS_RESOURCE_TYPES['Toxicologist'] = {
    id: 'toxinVialsContraptions',
    name: 'Toxin Vials & Contraption Parts',
    shortName: 'TV/CP',
    type: 'dual-resource',
    description: 'Dual resource system: Toxin Vials (crafting) and Contraption Parts (deployment)',
    visual: {
        type: 'dual-bar',
        toxinVials: {
            count: 'calculated', // INT mod + 3
            arrangement: 'horizontal',
            baseColor: '#2D4A17',
            activeColor: '#9ACD32',
            glowColor: '#ADFF2F',
            icon: '🧪',
            effects: ['alchemy', 'poison']
        },
        contraptionParts: {
            count: 5,
            arrangement: 'horizontal',
            baseColor: '#4A4A4A',
            activeColor: '#C0C0C0',
            glowColor: '#E8E8E8',
            icon: '⚙️',
            effects: ['engineering', 'traps']
        }
    },
    mechanics: {
        toxinVials: {
            max: 'calculated', // INT mod + 3 (minimum 4)
            current: 0,
            generation: {
                shortRest: '1d4',
                longRest: 'all'
            },
            consumption: {
                poisons: '1-2',
                concoctions: '2-3',
                explosives: '3'
            },
            regen: 0,
            consumeVerb: 'brew',
            gainVerb: 'distill'
        },
        contraptionParts: {
            max: 5,
            current: 0,
            generation: {
                shortRest: 1,
                longRest: 'all'
            },
            consumption: {
                basicTraps: 1,
                advancedTraps: 2,
                networks: '3-4'
            },
            regen: 0,
            consumeVerb: 'deploy',
            gainVerb: 'craft'
        }
    },
    tooltip: {
        title: 'Toxin Vials: {toxinVials}/{maxVials} | Contraption Parts: {contraptionParts}/5',
        description: 'Vials for poisons/concoctions, Parts for contraptions/traps',
        showToxinVials: true,
        showContraptionParts: true
    },
    craftingSystem: {
        poisonTypes: [
            'Paralysis Poison (2 vials)',
            'Weakening Toxin (1 vial)',
            'Corrosive Acid (2 vials)',
            'Bleeding Venom (2 vials)',
            'Antidote (1 vial)',
            'Explosive Concoction (3 vials)',
            'Smoke Bomb (1 vial)',
            'Healing Mist (2 vials)'
        ],
        contraptionTypes: [
            'Poison Gas Trap (1 part)',
            'Spike Trap (1 part)',
            'Healing Mist Dispenser (2 parts)',
            'Smoke Grenade Launcher (1 part)',
            'Acid Sprayer (2 parts)',
            'Alarm Bell (1 part)'
        ]
    }
};

CLASS_RESOURCE_TYPES['Covenbane'] = {
    id: 'hexbreakerCharges',
    name: 'Hexbreaker Charges',
    shortName: 'HB',
    type: 'charges',
    description: 'Dark energy accumulated from hunting evil magic users, tracked with a d6 (max 6)',
    visual: {
        type: 'hexbreaker-charges',
        count: 6,
        arrangement: 'horizontal',
        baseColor: '#2C2C2C',
        activeColor: '#C0C0C0',
        glowColor: '#E8E8E8',
        icon: '⬢',
        effects: ['dark-energy', 'anti-magic'],
        diceType: 'd6'
    },
    mechanics: {
        max: 6,
        current: 0,
        generation: {
            attackEvilMagicUser: 1,
            targetedBySpell: 1,
            fromStealth: '+1 (Shadowbane passive)'
        },
        decay: {
            outOfCombat: '1 per hour'
        },
        consumption: {
            shadowStep: 1,
            curseEater: 2,
            darkPursuit: 3,
            spiritShackle: 4,
            hexbreakerFury: 6
        },
        passiveBonuses: {
            0: 'No bonuses',
            1: '+1d4 damage, +5ft speed',
            2: '+1d6 damage, +10ft speed',
            3: '+2d6 damage, +15ft speed, crit 19-20',
            4: '+3d6 damage, +20ft speed, crit 19-20',
            5: '+4d6 damage, +25ft speed, crit 18-20',
            6: '+5d6 damage, +30ft speed, crit 18-20, ultimate available'
        },
        regen: 0,
        consumeVerb: 'spend',
        gainVerb: 'accumulate'
    },
    tooltip: {
        title: 'Hexbreaker Charges: {current}/6',
        description: 'Higher charges = more power.',
        showCharges: true,
        showPassiveBonuses: true,
        showNextThreshold: true
    },
    witchHunterPrecision: {
        trigger: 'every_third_attack',
        baseDamage: '5% max HP',
        scaling: '+1% per charge',
        damageType: 'true',
        description: 'Every third attack vs evil magic users deals % max HP true damage'
    },
    chargeScaling: {
        damage: ['0', '+1d4', '+1d6', '+2d6', '+3d6', '+4d6', '+5d6'],
        speed: ['+0ft', '+5ft', '+10ft', '+15ft', '+20ft', '+25ft', '+30ft'],
        critRange: ['20', '20', '20', '19-20', '19-20', '18-20', '18-20'],
        trueDamage: ['0%', '6%', '7%', '8%', '9%', '10%', '11%']
    }
};

CLASS_RESOURCE_TYPES['Bladedancer'] = {
    id: 'momentumFlourish',
    name: 'Momentum & Flourish',
    shortName: 'MF',
    type: 'dual-resource',
    description: 'Dual resource system: Momentum (combat rhythm) and Flourish (mastery tokens)',
    visual: {
        type: 'stance-flow',
        momentum: {
            max: 20,
            baseColor: '#1a4d6d',
            activeColor: '#3498DB',
            glowColor: '#5DADE2',
            icon: 'fas fa-bolt',
            effects: ['flow', 'rhythm']
        },
        flourish: {
            max: 5,
            baseColor: '#34495E',
            activeColor: '#F39C12',
            glowColor: '#F8C471',
            icon: 'fas fa-star',
            effects: ['mastery', 'finesse']
        },
        stances: {
            'Flowing Water': {
                icon: 'fas fa-water',
                color: '#3498DB',
                type: 'Defensive/Evasive'
            },
            'Striking Serpent': {
                icon: 'fas fa-dragon',
                color: '#27AE60',
                type: 'Offensive/Precision'
            },
            'Whirling Wind': {
                icon: 'fas fa-wind',
                color: '#95A5A6',
                type: 'AoE/Multi-target'
            },
            'Rooted Stone': {
                icon: 'fas fa-mountain',
                color: '#7F8C8D',
                type: 'Defensive/Counter'
            },
            'Dancing Blade': {
                icon: 'fas fa-bolt',
                color: '#9B59B6',
                type: 'Balanced/Hub'
            },
            'Shadow Step': {
                icon: 'fas fa-user-ninja',
                color: '#2C3E50',
                type: 'Stealth/Burst'
            }
        }
    },
    mechanics: {
        momentum: {
            max: 20,
            current: 0,
            generation: {
                hit: 1,
                crit: 2,
                dodge: 1,
                parry: 1
            },
            decay: {
                onMiss: 1,
                onDamage: 1
            },
            consumption: {
                stanceChange: '2-4',
                abilities: '3-6'
            },
            regen: 0,
            consumeVerb: 'spend',
            gainVerb: 'build'
        },
        flourish: {
            max: 5,
            current: 0,
            generation: {
                signatureMove: 1
            },
            decay: 0, // No decay
            consumption: {
                ultimates: '2-5'
            },
            consumeVerb: 'expend',
            gainVerb: 'earn'
        },
        stance: {
            current: 'Flowing Water',
            available: [
                'Flowing Water',
                'Striking Serpent',
                'Whirling Wind',
                'Rooted Stone',
                'Dancing Blade',
                'Shadow Step'
            ]
        }
    },
    tooltip: {
        title: 'Momentum: {momentum}/20 | Flourish: {flourish}/5 | Stance: {stance}',
        description: 'Build Momentum through combat, earn Flourish through mastery',
        showMomentum: true,
        showFlourish: true,
        showStance: true
    },
    stanceNetwork: {
        'Flowing Water': ['Striking Serpent', 'Shadow Step', 'Dancing Blade'],
        'Striking Serpent': ['Whirling Wind', 'Rooted Stone', 'Flowing Water'],
        'Whirling Wind': ['Dancing Blade', 'Rooted Stone'],
        'Rooted Stone': ['Striking Serpent', 'Flowing Water'],
        'Dancing Blade': ['Flowing Water', 'Striking Serpent', 'Whirling Wind', 'Rooted Stone', 'Shadow Step'], // Can go anywhere
        'Shadow Step': ['Striking Serpent', 'Dancing Blade']
    },
    transitionCosts: {
        'Flowing Water': {
            'Striking Serpent': 2,
            'Shadow Step': 2,
            'Dancing Blade': 2
        },
        'Striking Serpent': {
            'Whirling Wind': 2,
            'Rooted Stone': 2,
            'Flowing Water': 2
        },
        'Whirling Wind': {
            'Dancing Blade': 3,
            'Rooted Stone': 3
        },
        'Rooted Stone': {
            'Striking Serpent': 2,
            'Flowing Water': 2
        },
        'Dancing Blade': {
            'Flowing Water': 4,
            'Striking Serpent': 4,
            'Whirling Wind': 4,
            'Rooted Stone': 4,
            'Shadow Step': 4
        },
        'Shadow Step': {
            'Striking Serpent': 2,
            'Dancing Blade': 2
        }
    }
};

// SENTINEL PATH
CLASS_RESOURCE_TYPES['Lunarch'] = {
    id: 'lunarCharge',
    name: 'Lunar Charge',
    shortName: 'LC',
    type: 'lunar',
    description: 'Lunar energy that changes with moon phases',
    visual: {
        type: 'progress-bar',
        count: 'variable',
        arrangement: 'horizontal',
        baseColor: '#1F1F2F',
        activeColor: '#E6E6FA',
        glowColor: '#F8F8FF',
        icon: '🌙',
        effects: ['lunar', 'celestial']
    },
    mechanics: {
        max: 'calculated', // Based on current phase
        current: 0,
        phase: 'full',
        regen: 0,
        consumeVerb: 'channel',
        gainVerb: 'absorb'
    },
    tooltip: {
        title: 'Lunar Charge: {current}/{max} | Phase: {phase}',
        description: 'Moonlight energy varying with lunar phases',
        showCharge: true,
        showPhase: true
    }
};

CLASS_RESOURCE_TYPES['Huntress'] = {
    id: 'quarryTracking',
    name: 'Quarry Tracking',
    shortName: 'QT',
    type: 'hunter',
    description: 'Quarry marks and precision stacks for enhanced hunting',
    visual: {
        type: 'progress-bar',
        count: 'variable',
        arrangement: 'horizontal',
        baseColor: '#4A2C0A',
        activeColor: '#FF6347',
        glowColor: '#FFA500',
        icon: '🎯',
        effects: ['tracking', 'precision']
    },
    mechanics: {
        max: 'unlimited',
        current: 0,
        precision: 0,
        regen: 0,
        consumeVerb: 'track',
        gainVerb: 'mark'
    },
    tooltip: {
        title: 'Quarry: {quarry} | Precision: {precision}',
        description: 'Marked quarry and accumulated precision bonuses',
        showQuarry: true,
        showPrecision: true
    }
};

// Update the helper functions to work with the new configuration structure
export const getAllClassNames = () => {
    return Object.keys(CLASS_RESOURCE_TYPES);
};

// Helper function to get resource display text
export const getResourceDisplayText = (classResource, config) => {
    if (!classResource || !config) return '';

    switch (config.type) {
        case 'stages':
            return `Stage ${classResource.current}`;
        case 'notes':
            return `${classResource.stacks?.length || 0}/7 Notes`;
        case 'gauge':
            return `${classResource.current}/${classResource.max} ${config.shortName}`;
        case 'entropy':
            return `${classResource.current}/${classResource.max} EP`;
        case 'cards':
            return `${classResource.current} Cards`;
        case 'gambling':
            return `Luck: ${classResource.current} | Risk: ${classResource.risk || 0}`;
        default:
            return `${classResource.current}/${classResource.max} ${config.shortName}`;
    }
};

CLASS_RESOURCE_TYPES['Warden'] = {
    id: 'bulwarkMeter',
    name: 'Bulwark Meter',
    shortName: 'BM',
    type: 'protection',
    description: 'Protective barrier strength with ward token rewards',
    visual: {
        type: 'progress-bar',
        count: 12,
        arrangement: 'horizontal',
        baseColor: '#1E3A8A',
        activeColor: '#87CEEB',
        glowColor: '#E0E6FF',
        icon: '🛡️',
        effects: ['protection', 'barriers']
    },
    mechanics: {
        max: 12,
        current: 0,
        wardTokens: 0,
        regen: 0,
        consumeVerb: 'protect',
        gainVerb: 'fortify'
    },
    tooltip: {
        title: 'Bulwark: {current}/12 | Ward Tokens: {tokens}',
        description: 'Protective barriers with ward token rewards',
        showBulwark: true,
        showTokens: true
    },
    thresholds: [
        { value: 4, name: 'Ward Token', effects: ['Earn 1 Ward Token'] },
        { value: 8, name: 'Ward Token', effects: ['Earn 1 Ward Token'] },
        { value: 12, name: 'Ward Token', effects: ['Earn 1 Ward Token'] }
    ]
};