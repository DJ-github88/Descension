// Class-specific resource system configuration for HUD display
// Each class has a unique 4th resource bar with specific mechanics and visuals

export const CLASS_RESOURCE_TYPES = {
    // INFERNAL PATH
    'Pyrofiend': {
        id: 'infernoVeil',
        name: 'Inferno Veil',
        shortName: 'Inferno',
        type: 'stages',
        description: 'Demonic corruption through 9 inferno levels, each granting fire damage but severe drawbacks',
        visual: {
            type: 'inferno-veil',
            baseColor: '#8B0000',
            activeColor: '#FF4500',
            glowColor: '#FF6347',
            icon: 'fa-fire',
            effects: ['fire', 'infernal', 'corruption']
        },
        mechanics: {
            max: 9, // Levels 0-9
            current: 0,
            regen: 0,
            consumeVerb: 'descend',
            gainVerb: 'ascend'
        },
        tooltip: {
            title: 'Inferno Veil: Level {current}',
            description: 'Each level grants +1 fire damage but inflicts severe drawbacks based on circles of hell',
            showLevel: true,
            showBonuses: true,
            showDrawbacks: true
        }
    },
    'Minstrel': {
        id: 'musicalNotes',
        name: 'Musical Notes',
        shortName: 'Notes',
        type: 'notes',
        description: 'Musical notes that can be combined into powerful chord combinations',
        visual: {
            type: 'musical-notes-combo',
            baseColor: 'rgba(139, 69, 19, 0.15)',
            borderColor: 'rgba(139, 69, 19, 0.35)',
            segmentBorder: 'rgba(139, 69, 19, 0.4)',
            emptyColor: '#2D2D2D',
            notes: [
                {
                    numeral: 'I',
                    name: 'Tonic',
                    function: 'Foundation',
                    color: '#DC143C',
                    glow: '#FF6B6B',
                    description: 'Stability and home',
                    generatedBy: 'Basic attacks, defensive spells',
                    usedIn: ['Perfect Cadence', 'Plagal Cadence', 'Circle of Fifths', 'Authentic Cadence']
                },
                {
                    numeral: 'II',
                    name: 'Supertonic',
                    function: 'Mild Tension',
                    color: '#FF8C00',
                    glow: '#FFA500',
                    description: 'Creates dissonance',
                    generatedBy: 'Debuff and control spells',
                    usedIn: ['Suspended Cadence']
                },
                {
                    numeral: 'III',
                    name: 'Mediant',
                    function: 'Color',
                    color: '#FFD700',
                    glow: '#FFED4E',
                    description: 'Emotional depth',
                    generatedBy: 'Charm and emotion spells',
                    usedIn: ['Plagal Cadence', 'Authentic Cadence', 'Picardy Third']
                },
                {
                    numeral: 'IV',
                    name: 'Subdominant',
                    function: 'Movement',
                    color: '#32CD32',
                    glow: '#90EE90',
                    description: 'Forward motion',
                    generatedBy: 'Support and healing spells',
                    usedIn: ['Perfect Cadence', 'Deceptive Cadence', 'Half Cadence']
                },
                {
                    numeral: 'V',
                    name: 'Dominant',
                    function: 'Strong Tension',
                    color: '#4169E1',
                    glow: '#6495ED',
                    description: 'Demands resolution',
                    generatedBy: 'Offensive spells',
                    usedIn: ['Perfect Cadence', 'Deceptive Cadence', 'Circle of Fifths', 'Half Cadence', 'Plagal Cadence']
                },
                {
                    numeral: 'VI',
                    name: 'Submediant',
                    function: 'Relative Minor',
                    color: '#8B008B',
                    glow: '#BA55D3',
                    description: 'Melancholy and depth',
                    generatedBy: 'Fear and sorrow spells',
                    usedIn: ['Circle of Fifths', 'Half Cadence', 'Authentic Cadence']
                },
                {
                    numeral: 'VII',
                    name: 'Leading Tone',
                    function: 'Urgent Tension',
                    color: '#9400D3',
                    glow: '#DA70D6',
                    description: 'Pulls to tonic',
                    generatedBy: 'Finisher and climax spells',
                    usedIn: ['Deceptive Cadence', 'Half Cadence']
                }
            ],
            specializations: [
                {
                    id: 'battlechoir',
                    name: 'Battlechoir',
                    abbrev: 'BATTLE',
                    color: '#DC143C',
                    glow: '#FF6B6B',
                    theme: 'War Songs & Aggressive Support'
                },
                {
                    id: 'soulsinger',
                    name: 'Soulsinger',
                    abbrev: 'SOUL',
                    color: '#4169E1',
                    glow: '#6495ED',
                    theme: 'Healing Melodies & Emotional Magic'
                },
                {
                    id: 'dissonance',
                    name: 'Dissonance',
                    abbrev: 'DISS',
                    color: '#8B008B',
                    glow: '#BA55D3',
                    theme: 'Chaotic Sounds & Reality Warping'
                }
            ]
        },
        mechanics: {
            maxPerNote: 5,
            totalNotes: 7,
            persistence: 'Notes persist between combats',
            decay: '1 note per minute out of combat',
            consumeVerb: 'resolve',
            gainVerb: 'generate'
        },
        sharedPassive: {
            name: 'Harmonic Resonance',
            description: 'When you complete a 4-note cadence, all allies within 30 feet gain +1d4 to their next attack or spell. This bonus stacks up to 3 times.'
        },
        specPassives: {
            battlechoir: {
                name: 'War Anthem',
                description: 'Your offensive cadences (Circle of Fifths, Phrygian Cadence, Neapolitan Sixth) grant all affected allies +2 to attack rolls for 2 turns. Additionally, when an ally scores a critical hit while affected by your buffs, you generate 1 random musical note.'
            },
            soulsinger: {
                name: 'Soothing Melody',
                description: 'Your healing cadences (Authentic Cadence, Picardy Third) heal for an additional 1d6 HP. Additionally, whenever you heal an ally, you generate 1 Tonic (I) note. When using a Lute or Harp, healing is increased by an additional +2.'
            },
            dissonance: {
                name: 'Cacophony',
                description: 'Your control cadences (Deceptive Cadence, Tritone Substitution) have their save DC increased by 2. Additionally, when an enemy fails a save against your cadence, all enemies within 10 feet must make a Wisdom save (DC 13) or become frightened for 1 turn. Dissonant sounds echo unpredictably.'
            }
        }
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
        id: 'threadsOfDestiny',
        name: 'Threads of Destiny',
        shortName: 'Threads',
        type: 'threads',
        description: 'Cosmic threads woven from fate\'s disruptions, used to manipulate destiny',
        visual: {
            type: 'threads-of-destiny',
            count: 13, // 13 cards per suit (Ace through King)
            arrangement: 'horizontal',
            baseColor: '#1a0d2e', // Deep mystical purple
            threadColor: '#FFD700', // Golden thread
            shimmerColor: '#F0E68C', // Pale gold shimmer
            accentColor: '#9370DB', // Medium purple
            glowColor: '#FFA500', // Orange-gold glow
            segmentBorder: '#2d1b4e',
            cardSuits: ['♠', '♥', '♦', '♣'],
            icon: 'fas fa-scroll',
            effects: ['mystical', 'fate', 'tarot']
        },
        mechanics: {
            max: 13, // Maximum Threads (13 cards per suit: Ace-King)
            current: 0, // Start with 0
            regen: 0,
            consumeVerb: 'spend',
            gainVerb: 'weave',
            threadGeneration: {
                minorFailure: 1, // High Card, minor negative
                majorFailure: 2  // Bust, major negative
            },
            threadSpending: {
                callCard: 2,      // Call specific card
                forceFailure: 3,  // Force spell to fail (max Threads)
                forceSuccess: 5   // Force spell to succeed (max effect)
            }
        },
        tooltip: {
            sections: [
                {
                    type: 'header',
                    content: 'Threads of Destiny: {current}/13'
                },
                {
                    type: 'mechanics',
                    title: 'Thread Generation',
                    content: [
                        { label: 'Minor Failure', value: '+1 Thread' },
                        { label: 'Major Failure', value: '+2 Threads' },
                        { label: 'Spell Fails', value: '+1-2 Threads' }
                    ]
                },
                {
                    type: 'mechanics',
                    title: 'Thread Spending',
                    content: [
                        { label: 'Call Specific Card', value: '2 Threads' },
                        { label: 'Force Failure (max Threads)', value: '3 Threads' },
                        { label: 'Force Success (max effect)', value: '5 Threads' }
                    ]
                },
                {
                    type: 'specialization',
                    title: 'Destiny Weaver Bonus',
                    content: '+1 Thread on all generation (1→2, 2→3)'
                },
                {
                    type: 'mechanics-note',
                    content: 'Threads are woven from failures. Embrace chaos to gain control.'
                }
            ]
        },
        threadLevels: [
            { min: 0, max: 3, name: 'Sparse Threads', color: '#9370DB' },
            { min: 4, max: 6, name: 'Woven Strands', color: '#B8860B' },
            { min: 7, max: 9, name: 'Tapestry of Fate', color: '#FFD700' },
            { min: 10, max: 12, name: 'Destiny\'s Web', color: '#FFA500' },
            { min: 13, max: 13, name: 'Fate Mastered', color: '#DAA520' }
        ]
    },

    'Gambler': {
        id: 'fortunePoints',
        name: 'Fortune Points',
        shortName: 'FP',
        type: 'gambling',
        visual: {
            type: 'fortune-points-gambling',
            baseColor: '#2D2D2D',
            activeColor: '#FFD700',
            glowColor: '#FFA500',
            specializations: {
                'fortunes-favor': {
                    name: "Fortune's Favor",
                    max: 7,
                    theme: 'coins',
                    color: '#FFD700',
                    icon: 'fas fa-coins',
                    description: 'Lucky 7 - Coin flip mastery',
                    approach: 'Coin flips and reroll manipulation',
                    useCase: 'Spend FP to flip coin results, grant ally rerolls, force enemy rerolls',
                    why7: 'Binary outcomes (heads/tails) require fewer points for decisive control'
                },
                'high-roller': {
                    name: 'High Roller',
                    max: 21,
                    theme: 'blackjack',
                    color: '#DC143C',
                    icon: 'fas fa-poker-chip',
                    description: 'Blackjack 21 - High stakes betting',
                    approach: 'Resource betting and hedging',
                    useCase: 'Spend FP to guarantee bet payouts, hedge resource wagers (HP/mana/actions)',
                    why21: 'Complex betting requires maximum points to hedge multiple bets and ensure payouts'
                },
                'card-sharp': {
                    name: 'Card Sharp',
                    max: 13,
                    theme: 'cards',
                    color: '#4B0082',
                    icon: 'fas fa-diamond',
                    description: 'Unlucky 13 - Card counting strategy',
                    approach: 'Prediction and competitive gambling',
                    useCase: 'Spend FP to adjust Jackpot dice, win Death Roll competitions, predict outcomes',
                    why13: 'Strategic play with calculated risks - unlucky 13 turned into advantage'
                }
            },
            effects: ['luck', 'gambling', 'probability']
        },
        mechanics: {
            max: 'varies_by_spec', // 7, 21, or 13 based on specialization
            current: 0,
            regen: 0,
            consumeVerb: 'spend',
            gainVerb: 'generate',
            persistence: 'until_long_rest'
        },
        tooltip: {
            title: 'Fortune Points: {current}/{max}',
            showGeneration: true,
            showSpending: true,
            showPersistence: true
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
        type: 'devotion-gauge',
        description: 'Power through sacrifice - accumulate damage to unlock devotion levels with passive effects',
        visual: {
            type: 'devotion-gauge',
            count: 6,
            arrangement: 'horizontal',
            baseColor: '#2A1810',
            emptyColor: '#1A0F08',
            segmentBorder: '#4A2C1A',
            redemption: {
                activeColor: '#FFD700',
                glowColor: '#FFF8DC',
                name: 'Redemption'
            },
            zealot: {
                activeColor: '#DC143C',
                glowColor: '#FF6B6B',
                name: 'Zealot'
            },
            ascetic: {
                activeColor: '#9CA3AF',
                glowColor: '#D1D5DB',
                name: 'Ascetic'
            },
            icon: 'fa-cross',
            effects: ['holy', 'sacrifice', 'devotion']
        },
        mechanics: {
            max: 6, // Devotion Levels 0-6
            current: 0,
            damage: 0, // Accumulated damage toward next level
            regen: 0,
            consumeVerb: 'spend',
            gainVerb: 'build',
            thresholds: [0, 10, 20, 40, 60, 80, 100] // Damage thresholds for each level
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
            { name: 'Flickering Faith', level: 1, requirement: '10 damage', passive: '5 temp HP when ally within 5 ft takes damage' },
            { name: 'Steadfast Conviction', level: 2, requirement: '20 damage', passive: 'All healing effects +5 HP' },
            { name: 'Radiant Sacrifice', level: 3, requirement: '40 damage', passive: 'Allies within 10 ft gain +1 AC' },
            { name: 'Divine Ascendance', level: 4, requirement: '60 damage', passive: 'Advantage on all saving throws' },
            { name: 'Holy Martyrdom', level: 5, requirement: '80 damage', passive: '+10 radiant damage on attacks' },
            { name: 'Celestial Protector', level: 6, requirement: '100 damage', passive: 'Allies within 15 ft resist all damage' }
        ],
        specializations: {
            redemption: {
                name: 'Redemption',
                sharedPassive: {
                    name: 'Sacred Devotion',
                    description: 'At Devotion Level 3+, your next healing spell heals for +1d6 HP'
                },
                uniquePassive: {
                    name: 'Redemptive Grace',
                    description: 'Martyr\'s Intervene heals protected ally for 2d6 HP. All healing spells +10 ft range'
                }
            },
            zealot: {
                name: 'Zealot',
                sharedPassive: {
                    name: 'Sacred Devotion',
                    description: 'At Devotion Level 3+, your next healing spell heals for +1d6 HP'
                },
                uniquePassive: {
                    name: 'Zealous Wrath',
                    description: 'Radiant spells deal +(Devotion Level × 2) damage. Heal for 15% of radiant damage dealt'
                }
            },
            ascetic: {
                name: 'Ascetic',
                sharedPassive: {
                    name: 'Sacred Devotion',
                    description: 'At Devotion Level 3+, your next healing spell heals for +1d6 HP'
                },
                uniquePassive: {
                    name: 'Ascetic Endurance',
                    description: 'Amplified spell costs -1 Devotion Level (min 1). At Level 4+, resist physical damage'
                }
            }
        }
    },

    'False Prophet': {
        id: 'madnessPoints',
        name: 'Madness Points',
        shortName: 'Madness',
        type: 'madness',
        description: 'Eldritch madness that empowers shadow damage but risks Insanity Convulsion at 20 points',
        visual: {
            type: 'madness-gauge',
            count: 20,
            arrangement: 'horizontal',
            baseColor: '#1a0d2e', // Deep void purple
            safeColor: '#6a0dad', // Dark purple (0-5)
            moderateColor: '#9400D3', // Purple (6-9)
            highColor: '#b026ff', // Bright purple (10-14)
            dangerColor: '#DC143C', // Crimson red (15-19)
            convulsionColor: '#8B0000', // Dark red (20)
            glowColor: '#9400D3',
            segmentBorder: '#2d1b4e',
            icon: 'fas fa-eye',
            effects: ['madness', 'eldritch', 'void']
        },
        mechanics: {
            max: 20, // Fixed at 20, triggers Insanity Convulsion
            current: 0,
            regen: 0,
            consumeVerb: 'spend',
            gainVerb: 'accumulate',
            damageBonus: 1 // +1 shadow damage per Madness Point
        },
        tooltip: {
            sections: [
                {
                    type: 'header',
                    content: 'Madness Points: {current}/20'
                },
                {
                    type: 'mechanics',
                    title: 'Current Effects',
                    content: [
                        { label: 'Shadow Damage Bonus', value: '+{current}' },
                        { label: 'Danger Level', value: '{dangerLevel}' },
                        { label: 'Next Threshold', value: '{nextThreshold}' }
                    ]
                },
                {
                    type: 'thresholds',
                    title: 'Madness Thresholds',
                    content: [
                        { value: 6, name: 'Veil of Shadows', effect: 'Unlock invisibility spell' },
                        { value: 9, name: 'Eldritch Vision', effect: 'Unlock true sight spell' },
                        { value: 10, name: 'Eldritch Empowerment', effect: 'Next shadow spell: +2d6 damage' },
                        { value: 12, name: 'Apocalyptic Revelation', effect: 'Unlock 8d6 AoE spell' },
                        { value: 15, name: 'DANGER ZONE', effect: 'High Convulsion risk' },
                        { value: 20, name: 'INSANITY CONVULSION', effect: 'Catastrophic release!' }
                    ]
                },
                {
                    type: 'convulsion',
                    title: 'Insanity Convulsion Table (1d6)',
                    content: [
                        { roll: 1, name: 'Shadow Burst', effect: '5d6 necrotic to self + all within 20 ft' },
                        { roll: 2, name: 'Mind Shatter', effect: 'Stunned for 2 rounds' },
                        { roll: 3, name: 'Dark Whispers', effect: 'Disadvantage on attacks/saves (3 rounds)' },
                        { roll: 4, name: 'Chaotic Pulse', effect: 'Random teleport 60 ft + 4d6 psychic' },
                        { roll: 5, name: 'Psychic Scream', effect: 'All in 30 ft save or frightened (3 rounds)' },
                        { roll: 6, name: 'Nightmare Echoes', effect: '6d6 psychic + Short-Term Madness (1d4 rounds)' }
                    ]
                },
                {
                    type: 'mechanics-note',
                    content: 'Spells generate Madness (1d4-2d6). Some spells spend Madness for power.'
                }
            ]
        },
        dangerLevels: [
            { min: 0, max: 5, name: 'Stable', color: '#6a0dad' },
            { min: 6, max: 9, name: 'Moderate', color: '#9400D3' },
            { min: 10, max: 14, name: 'High', color: '#b026ff' },
            { min: 15, max: 19, name: 'DANGER', color: '#DC143C' },
            { min: 20, max: 20, name: 'CONVULSION', color: '#8B0000' }
        ]
    },

    'Exorcist': {
        id: 'dominanceSystem',
        name: 'Dominance System',
        shortName: 'Dominance',
        type: 'demon_control',
        description: 'Control over bound demons through Dominance Dice - maintain willpower or demons escape',
        visual: {
            type: 'dominance-die',
            count: 1, // Single bar showing selected demon
            arrangement: 'horizontal',
            baseColor: '#2d0a0a',
            activeColor: '#FFD700',
            glowColor: '#FFF8DC',
            warningColor: '#FF8C00',
            dangerColor: '#DC143C',
            criticalColor: '#8B0000',
            icon: 'fas fa-link',
            effects: ['binding', 'control', 'dominance']
        },
        mechanics: {
            max: 12, // d12 represented as 12
            current: 10, // d10 represented as 10
            regen: 0,
            consumeVerb: 'command',
            gainVerb: 'restore',
            demonCapacity: 2, // Base: 2 demons, Demonologist: 4, Demon Lord: 1
            selectedDemon: 0 // Index of currently displayed demon
        },
        tooltip: {
            title: 'Dominance System',
            description: 'Control bound demons through Dominance Dice',
            showDominanceDie: true,
            showDemonInfo: true,
            showWarning: true
        },
        dominanceDice: {
            progression: ['d12', 'd10', 'd8', 'd6', '0'],
            values: [12, 10, 8, 6, 0],
            description: 'DD decreases by 1 step per demon action or hit taken'
        },
        demonTiers: [
            { tier: 1, name: 'Imp', startingDD: 12, difficulty: 'Easy', saveDC: 12 },
            { tier: 2, name: 'Shadow Hound', startingDD: 10, difficulty: 'Medium', saveDC: 14 },
            { tier: 2, name: 'Wraith', startingDD: 10, difficulty: 'Medium', saveDC: 14 },
            { tier: 3, name: 'Abyssal Brute', startingDD: 8, difficulty: 'Hard', saveDC: 16 },
            { tier: 3, name: 'Banshee', startingDD: 8, difficulty: 'Hard', saveDC: 15 },
            { tier: 4, name: 'Greater Demon', startingDD: 6, difficulty: 'Very Hard', saveDC: 18 }
        ],
        replenishmentSpells: [
            { name: 'Reassert Dominance', cost: '5 mana', effect: 'Restore DD to maximum' },
            { name: 'Chain of Command', cost: '4 mana', effect: '+1 DD size for 3 actions' },
            { name: 'Divine Bond', cost: '6 mana', effect: 'Restore DD by 2 steps' }
        ]
    },

    // HARROW PATH
    'Plaguebringer': {
        id: 'afflictionCultivation',
        name: 'Affliction Cultivation',
        shortName: 'Corruption',
        type: 'corruption-bar',
        description: 'Build corruption through afflictions and evolve them to devastating final forms',
        visual: {
            type: 'corruption-bar',
            arrangement: 'segmented-horizontal',
            baseColor: '#1A2E1A',
            activeColor: '#556B2F',
            glowColor: '#9ACD32',
            segments: 4,
            // Specialization configurations
            virulentSpreader: {
                name: 'Virulent Spreader',
                color: '#556B2F',
                glow: '#9ACD32',
                icon: 'fa-virus'
            },
            tormentWeaver: {
                name: 'Torment Weaver',
                color: '#4B0082',
                glow: '#9370DB',
                icon: 'fa-brain'
            },
            decayHarbinger: {
                name: 'Decay Harbinger',
                color: '#2F4F2F',
                glow: '#556B2F',
                icon: 'fa-skull-crossbones'
            }
        },
        mechanics: {
            maxCorruption: 100,
            currentCorruption: 0,
            maxAfflictions: 10,
            activeAfflictions: 0,
            corruptionGain: {
                baseAffliction: 10,
                categorySpell: 5,
                finalForm: 25
            },
            corruptionDecay: 2, // per turn
            evolutionThresholds: [25, 50, 75, 100],
            categories: ['Weaken', 'Torment', 'Fester', 'Amplify Pain', 'Decay', 'Nurture', 'Corrupt', 'Infect']
        },
        tooltip: {
            title: 'Corruption: {corruption}/100',
            showCorruption: true,
            showAfflictions: true,
            showEvolutionStages: true,
            showSpecPassive: true
        },
        sharedPassive: {
            name: 'Plague Mastery',
            description: 'Afflictions last 1d4 additional rounds and resist dispel (5-6 on 1d6). Gain 1d4 mana when afflicted target dies.'
        },
        specPassives: {
            virulentSpreader: {
                name: 'Epidemic Mastery',
                description: 'Fester/Infect spells +10 ft range. Spread afflictions retain 2/3 development steps.'
            },
            tormentWeaver: {
                name: 'Psychic Resonance',
                description: 'Torment spells +1d6 damage. Psychic afflictions: 5-6 on 1d6 causes target to attack nearest ally.'
            },
            decayHarbinger: {
                name: 'Accelerated Decay',
                description: 'Decay spells reduce max HP by +1d6. Afflictions reduce healing by 1d8 per heal received.'
            }
        }
    },

    'Lichborne': {
        id: 'eternalFrostPhylactery',
        name: 'Eternal Frost Aura & Phylactery',
        shortName: 'Phylactery',
        type: 'frost_undead',
        description: 'Toggle aura for frost damage boost with HP drain, phylactery stores HP for resurrection',
        visual: {
            type: 'eternal-frost-phylactery',
            arrangement: 'horizontal-segmented',
            baseColor: '#2D1B69',
            activeColor: '#4A90E2',
            glowColor: '#00FFFF',
            icon: 'fa-gem',
            // Specialization configurations
            frostbound_tyrant: {
                name: 'Frostbound Tyrant',
                maxPhylactery: 50,
                segments: 10,
                color: '#4A90E2',
                glow: '#87CEEB',
                icon: 'fa-snowflake'
            },
            spectral_reaper: {
                name: 'Spectral Reaper',
                maxPhylactery: 50,
                segments: 10,
                color: '#9370DB',
                glow: '#BA55D3',
                icon: 'fa-skull'
            },
            phylactery_guardian: {
                name: 'Phylactery Guardian',
                maxPhylactery: 75,
                segments: 15,
                color: '#2D1B69',
                glow: '#8A2BE2',
                icon: 'fa-shield-alt'
            }
        },
        mechanics: {
            aura: {
                active: false,
                bonusDamage: '1d6',
                healthDrain: '1d6 per turn',
                chillingDC: 17,
                chillingEffect: '-10 ft movement'
            },
            phylactery: {
                max: 50, // Can store up to 50 HP (75 for Phylactery Guardian)
                current: 0,
                storageRitual: '1 hour to transfer 10 HP',
                resurrectionCost: 10, // 8 for Phylactery Guardian
                resurrectionHP: 10, // 15 for Phylactery Guardian
                limitPerCombat: 1,
                rechargePerRest: 10
            },
            consumeVerb: 'spend',
            gainVerb: 'store'
        },
        tooltip: {
            title: 'Eternal Frost Aura & Phylactery',
            description: 'Toggle aura for frost damage boost with HP drain, phylactery stores HP for resurrection',
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
    description: 'Arcane energy absorbed from magical and physical damage, spent on shields, reflections, and strikes',
    visual: {
        type: 'arcane-absorption',
        baseColor: '#1E3A8A',
        activeColor: '#4169E1',
        glowColor: '#6495ED',
        icon: 'fa-shield-halved',
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
    id: 'runesInscriptions',
    name: 'Runes & Inscriptions',
    shortName: 'R&I',
    type: 'dual-runic',
    description: 'Dual mechanic system: Runic Wrapping for battlefield control and Inscription Placement for equipment enhancement',
    visual: {
        type: 'runes-inscriptions',
        arrangement: 'horizontal-split',
        runes: {
            baseColor: '#1A0F2E',
            activeColor: '#4169E1',
            glowColor: '#6495ED',
            segmentBorder: '#2E1A5E',
            icon: 'fa-scroll'
        },
        inscriptions: {
            baseColor: '#2E1A0A',
            activeColor: '#FFD700',
            glowColor: '#FFA500',
            segmentBorder: '#4A2C1A',
            icon: 'fa-feather-alt'
        },
        // Specialization configurations
        runebinder: {
            name: 'Runebinder',
            maxRunes: 12,
            maxInscriptions: 1,
            color: '#4169E1',
            glow: '#6495ED',
            icon: 'fa-circle-nodes'
        },
        enchanter: {
            name: 'Enchanter',
            maxRunes: 3,
            maxInscriptions: 6,
            color: '#FFD700',
            glow: '#FFA500',
            icon: 'fa-wand-magic-sparkles'
        },
        glyphweaver: {
            name: 'Glyphweaver',
            maxRunes: 8,
            maxInscriptions: 2,
            color: '#DC143C',
            glow: '#FF6347',
            icon: 'fa-burst'
        },
        base: {
            name: 'Base Inscriptor',
            maxRunes: 8,
            maxInscriptions: 3,
            color: '#6495ED',
            glow: '#87CEEB',
            icon: 'fa-scroll'
        }
    },
    mechanics: {
        runes: {
            max: 8, // Base max, varies by specialization
            current: 0,
            cost: 3, // mana per rune
            actionCost: 1, // action to place
            zoneThreshold: 3, // minimum runes to form zone
            generation: 'Place for 3 mana, 1 action each',
            usage: '3+ runes form zone, detonate for effects'
        },
        inscriptions: {
            max: 3, // Base max, varies by specialization
            current: 0,
            timing: 'At combat start',
            slots: ['weapon', 'armor', 'boots', 'cape', 'belt', 'pants'],
            generation: 'At combat start, choose slots',
            usage: 'Enhance equipment, cannot stack same slot'
        },
        consumeVerb: 'detonate/remove',
        gainVerb: 'place/inscribe'
    },
    tooltip: {
        title: 'Runes: {runes}/{maxRunes} | Inscriptions: {inscriptions}/{maxInscriptions}',
        description: 'Dual mechanic: Runic zones + Equipment enhancement',
        showRunes: true,
        showInscriptions: true,
        showSpecialization: true
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
    description: 'Primal energy for shapeshifting and wild abilities',
    visual: {
        type: 'wild-instinct-forms',
        count: 15,
        arrangement: 'segmented',
        baseColor: '#2D2D2D',
        icon: 'fas fa-paw',
        effects: ['primal', 'transformation', 'shapeshifting'],
        forms: {
            human: {
                id: 'human',
                name: 'Human',
                icon: 'fas fa-user',
                color: '#808080',
                activeColor: '#A0A0A0',
                glowColor: '#C0C0C0',
                borderColor: '#FFFFFF',
                description: 'Not Transformed',
                generation: 'Cannot generate WI in human form',
                passive: 'No form bonuses'
            },
            nightstalker: {
                id: 'nightstalker',
                name: 'Nightstalker',
                icon: 'fas fa-cat',
                color: '#2D1B4E',
                activeColor: '#4B2D7A',
                glowColor: '#7B4FBD',
                borderColor: '#9370DB',
                description: 'Stealth & Burst Damage',
                generation: '+1 WI per round in stealth, +2 WI from Ambush',
                passive: '+2 to stealth, advantage on ambush attacks'
            },
            ironhide: {
                id: 'ironhide',
                name: 'Ironhide',
                icon: 'fas fa-shield',
                color: '#5C4033',
                activeColor: '#8B6F47',
                glowColor: '#A0826D',
                borderColor: '#8B4513',
                description: 'Tank & Durability',
                generation: '+1 WI per enemy taunted, +2 WI from protecting allies',
                passive: '+20 HP, damage resistance to physical'
            },
            skyhunter: {
                id: 'skyhunter',
                name: 'Skyhunter',
                icon: 'fas fa-dove',
                color: '#4682B4',
                activeColor: '#5F9EA0',
                glowColor: '#87CEEB',
                borderColor: '#00BFFF',
                description: 'Mobility & Aerial Control',
                generation: '+1 WI from scouting, +2 WI from Dive Attack',
                passive: 'Flight speed 60ft, advantage on Perception'
            },
            frostfang: {
                id: 'frostfang',
                name: 'Frostfang',
                icon: 'fas fa-wolf-pack-battalion',
                color: '#4F7CAC',
                activeColor: '#6B9BD1',
                glowColor: '#B0E0E6',
                borderColor: '#ADD8E6',
                description: 'Pack Tactics & Tracking',
                generation: '+1 WI from tracking, +2 WI from Pack Tactics',
                passive: 'Advantage when ally is within 5ft, enhanced tracking'
            }
        }
    },
    mechanics: {
        max: 15,
        current: 0,
        currentForm: 'human',
        regen: 0,
        consumeVerb: 'shift',
        gainVerb: 'attune',
        transformCost: 1,
        freeFirstTransform: true
    },
    tooltip: {
        title: 'Wild Instinct: {current}/{max}',
        showInstinct: true,
        showForm: true,
        showGeneration: true,
        showPassive: true
    }
};

CLASS_RESOURCE_TYPES['Primalist'] = {
    id: 'totemicSynergy',
    name: 'Totemic Synergy',
    shortName: 'TS',
    type: 'totemic',
    description: 'Totemic energy and synergy activation',
    visual: {
        type: 'totemic-synergy',
        baseColor: '#4A2C0A',
        activeColor: '#8B4513',
        glowColor: '#CD853F',
        icon: 'fas fa-torii-gate',
        effects: ['elemental', 'totemic', 'synergy']
    },
    mechanics: {
        max: 100,
        current: 0,
        totems: {
            max: 8,
            current: 0
        },
        synergyThreshold: 4, // Default, Stormbringer uses 3
        regen: 0,
        consumeVerb: 'activate',
        gainVerb: 'harmonize'
    },
    tooltip: {
        title: 'Totemic Synergy',
        description: '',
        showSynergy: true,
        showTotems: true,
        showThreshold: true
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
        type: 'drp-resilience',
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
        description: '',
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

// LUNARCH - LUNAR PHASES
CLASS_RESOURCE_TYPES['Lunarch'] = {
    id: 'lunarPhases',
    name: 'Lunar Phases',
    shortName: 'Phase',
    type: 'lunar_cycle',
    description: 'Cyclical moon phases that grant different bonuses and alter spell effects',
    visual: {
        type: 'lunar-phases',
        arrangement: 'circular-phases',
        baseColor: '#1A1A2E',
        activeColor: '#E6E6FA',
        glowColor: '#F0E68C',
        icon: 'fa-moon',
        // Phase configurations
        new_moon: {
            name: 'New Moon',
            color: '#2C2C3E',
            glow: '#4A4A6A',
            icon: 'fa-circle',
            theme: 'Defense'
        },
        waxing_moon: {
            name: 'Waxing Moon',
            color: '#87CEEB',
            glow: '#B0E0E6',
            icon: 'fa-adjust',
            theme: 'Healing'
        },
        full_moon: {
            name: 'Full Moon',
            color: '#F0E68C',
            glow: '#FFD700',
            icon: 'fa-circle',
            theme: 'Offense'
        },
        waning_moon: {
            name: 'Waning Moon',
            color: '#9370DB',
            glow: '#BA55D3',
            icon: 'fa-adjust',
            theme: 'Efficiency'
        },
        // Specialization configurations
        moonlight_sentinel: {
            name: 'Moonlight Sentinel',
            color: '#C0C0C0',
            glow: '#E8E8E8',
            icon: 'fa-crosshairs'
        },
        starfall_invoker: {
            name: 'Starfall Invoker',
            color: '#4169E1',
            glow: '#6495ED',
            icon: 'fa-star'
        },
        lunar_guardian: {
            name: 'Lunar Guardian',
            color: '#98FB98',
            glow: '#90EE90',
            icon: 'fa-shield-alt'
        }
    },
    mechanics: {
        phases: ['new_moon', 'waxing_moon', 'full_moon', 'waning_moon'],
        currentPhase: 'new_moon',
        roundsInPhase: 0,
        phaseDuration: 3, // Rounds per phase
        manualShiftCost: 8, // Mana cost to manually shift phases
        naturalCycling: true
    },
    tooltip: {
        title: 'Lunar Phases',
        description: 'Cyclical moon phases that grant different bonuses. Phases naturally cycle every 3 rounds or can be manually shifted for 8 mana.'
    }
};

CLASS_RESOURCE_TYPES['Huntress'] = {
    id: 'quarryMarksCompanion',
    name: 'Quarry Marks & Companion',
    shortName: 'QM',
    type: 'hunter',
    description: 'Track prey with Quarry Marks and command your companion in battle',
    visual: {
        type: 'quarry-marks-companion',
        quarryMarks: {
            max: 5,
            baseColor: '#2C1810',
            emptyColor: '#1A0F08',
            segmentBorder: '#4A2C1A',
            // Specialization-specific visuals
            bladestorm: {
                activeColor: '#DC143C',
                glowColor: '#FF6B6B',
                icon: 'fa-glaive-alt',
                name: 'Bladestorm'
            },
            beastmaster: {
                activeColor: '#2E7D32',
                glowColor: '#66BB6A',
                icon: 'fa-paw',
                name: 'Beastmaster'
            },
            shadowdancer: {
                activeColor: '#6A1B9A',
                glowColor: '#BA68C8',
                icon: 'fa-moon',
                name: 'Shadowdancer'
            }
        },
        companion: {
            defaultHP: 50,
            maxHP: 50,
            portraitSize: 40
        }
    },
    mechanics: {
        quarryMarks: {
            max: 5,
            current: 0,
            generation: {
                glaiveHit: 1,
                companionHit: 1,
                criticalHit: 2,
                companionCrit: 2,
                markQuarryAbility: 1
            },
            spending: {
                enhanceCompanion: 1,
                extendChain: 2,
                companionSpecial: 3,
                ultimate: 5
            },
            persistence: 'Marks persist between combats'
        },
        companion: {
            hp: 50,
            maxHP: 50,
            commands: ['Attack', 'Defend', 'Support'],
            commandCost: '1 AP each'
        }
    },
    tooltip: {
        title: 'Quarry Marks: {current}/5 | Companion: {companionHP}/{maxCompanionHP} HP',
        description: 'Generate marks through attacks, spend on powerful abilities and companion enhancements',
        showQuarryMarks: true,
        showCompanion: true
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

CLASS_RESOURCE_TYPES['Oracle'] = {
    id: 'propheticVisions',
    name: 'Prophetic Visions',
    shortName: 'PV',
    type: 'divination',
    description: 'Mystic insight gained through accurate predictions and revelations, spent to manipulate fate',
    visual: {
        type: 'prophetic-visions',
        max: 10,
        baseColor: '#1A0F2E',
        emptyColor: '#0D0718',
        segmentBorder: '#2E1A5E',
        // Specialization-specific visuals
        seer: {
            name: 'Seer',
            activeColor: '#9370DB',
            glowColor: '#DDA0DD',
            icon: 'fa-eye',
            theme: 'Future Sight & Prediction Mastery'
        },
        truthseeker: {
            name: 'Truthseeker',
            activeColor: '#4682B4',
            glowColor: '#87CEEB',
            icon: 'fa-book-open',
            theme: 'Past Sight & Hidden Knowledge'
        },
        fateweaver: {
            name: 'Fateweaver',
            activeColor: '#DAA520',
            glowColor: '#FFD700',
            icon: 'fa-dice',
            theme: 'Destiny Manipulation & Rerolls'
        }
    },
    mechanics: {
        visions: {
            max: 10,
            current: 3, // Start with 3 after long rest
            generation: {
                simpleCorrectPrediction: 1,
                moderateCorrectPrediction: 2,
                complexCorrectPrediction: 3,
                revelation: 1,
                fulfilledProphecy: 2,
                witnessCritical: 1
            },
            spending: {
                alterFateMinor: 1,
                alterFateModerate: 2,
                alterFateMajor: 3,
                divinationSpell: 'varies',
                prophecyActivation: 'varies'
            },
            persistence: 'Visions persist between combats, reset to 3 on long rest'
        },
        predictionTracking: {
            totalPredictions: 0,
            correctPredictions: 0,
            accuracyChain: 0, // Consecutive correct predictions
            lastPredictionType: null // 'simple' | 'moderate' | 'complex'
        },
        revelations: {
            secretsRevealed: 0,
            liesDetected: 0,
            illusionsExposed: 0
        },
        fateManipulation: {
            rerollsForced: 0,
            fateLocksApplied: 0,
            threadsManipulated: 0
        }
    },
    tooltip: {
        title: 'Prophetic Visions: {current}/10',
        description: 'Mystic insight gained through predictions and revelations',
        showVisions: true,
        showSpecPassive: true,
        showPredictionAccuracy: true
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