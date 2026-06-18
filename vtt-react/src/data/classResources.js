// Class-specific resource system configuration for HUD display
// Each class has a unique 4th resource bar with specific mechanics and visuals

export const CLASS_RESOURCE_TYPES = {
    // INFERNAL PATH
    'Pyrofiend': {
        id: 'infernoVeil',
        name: 'Inferno Veil',
        shortName: 'Inferno',
        type: 'stages',
        description: 'Demonic corruption through 9 inferno levels, each granting ember damage but severe drawbacks',
        visual: {
            type: 'inferno-veil',
            baseColor: '#8B0000',
            activeColor: '#FF4500',
            glowColor: '#FF6347',
            icon: 'fas fa-fire',
            effects: ['ember', 'infernal', 'corruption']
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
            description: 'Each level grants +1 ember damage but inflicts severe drawbacks based on circles of hell',
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
                    usedIn: ['Perfect Cadence', 'Plagal Cadence', 'Circle of Fifths', 'Authentic Cadence', 'Neapolitan Sixth']
                },
                {
                    numeral: 'II',
                    name: 'Supertonic',
                    function: 'Mild Tension',
                    color: '#FF8C00',
                    glow: '#FFA500',
                    description: 'Creates dissonance',
                    generatedBy: 'Debuff and control spells',
                    usedIn: ['Half Cadence']
                },
                {
                    numeral: 'III',
                    name: 'Mediant',
                    function: 'Color',
                    color: '#FFD700',
                    glow: '#FFED4E',
                    description: 'Emotional depth',
                    generatedBy: 'Charm and emotion spells',
                    usedIn: ['Plagal Cadence', 'Authentic Cadence', 'Picardy Third', 'Neapolitan Sixth']
                },
                {
                    numeral: 'IV',
                    name: 'Subdominant',
                    function: 'Movement',
                    color: '#32CD32',
                    glow: '#90EE90',
                    description: 'Forward motion',
                    generatedBy: 'Support and healing spells',
                    usedIn: ['Perfect Cadence', 'Deceptive Cadence', 'Half Cadence', 'Neapolitan Sixth']
                },
                {
                    numeral: 'V',
                    name: 'Dominant',
                    function: 'Strong Tension',
                    color: '#4169E1',
                    glow: '#6495ED',
                    description: 'Demands resolution',
                    generatedBy: 'Offensive spells',
                    usedIn: ['Perfect Cadence', 'Deceptive Cadence', 'Circle of Fifths', 'Half Cadence', 'Plagal Cadence', 'Phrygian Cadence']
                },
                {
                    numeral: 'VI',
                    name: 'Submediant',
                    function: 'Relative Minor',
                    color: '#8B008B',
                    glow: '#BA55D3',
                    description: 'Melancholy and depth',
                    generatedBy: 'Fear and sorrow spells',
                    usedIn: ['Circle of Fifths', 'Half Cadence', 'Authentic Cadence', 'Plagal Cadence']
                },
                {
                    numeral: 'VII',
                    name: 'Leading Tone',
                    function: 'Urgent Tension',
                    color: '#9400D3',
                    glow: '#DA70D6',
                    description: 'Pulls to tonic',
                    generatedBy: 'Finisher and climax spells',
                    usedIn: ['Deceptive Cadence', 'Half Cadence', 'Phrygian Cadence', 'Picardy Third']
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
                icon: 'fas fa-hourglass-half',
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
                icon: 'fas fa-triangle-exclamation',
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
    'Harbinger': {
        id: 'mayhemGauge',
        name: 'Mayhem Gauge',
        shortName: 'Mayhem',
        type: 'mayhem',
        description: 'Passive chaos pressure gauge — CANNOT be spent. Passively amplifies all spells as it rises. Only release is Wild Surge at 100.',
        visual: {
            type: 'mayhem-gauge',
            count: 100,
            arrangement: 'pressure-bar',
            baseColor: '#4A0E4E',
            activeColor: '#9333EA',
            glowColor: '#D946EF',
            vortexColor: '#7C3AED',
            icon: 'fas fa-hourglass-half',
            effects: ['chaos', 'entropy', 'prophetic-doom', 'pressure'],
            specializations: {
                'wild_prophet': {
                    color: '#9B59B6',
                    particleColor: '#BB8FCE',
                    theme: 'prophetic'
                },
                'deaths_seer': {
                    color: '#4B0082',
                    particleColor: '#7B68EE',
                    theme: 'blight-doom'
                },
                'fate_rift': {
                    color: '#e67e22',
                    particleColor: '#F0E68C',
                    theme: 'probability-storm'
                }
            }
        },
        mechanics: {
            max: 100,
            current: 0,
            regen: 0,
            consumeVerb: 'release',
            gainVerb: 'accumulate',
            unspendable: true,
            description: 'Mayhem CANNOT be spent. It passively amplifies all spells — more targets, bigger dice, wider AoE. At 100, triggers Wild Surge (uncontrollable release).'
        },
        tooltip: {
            title: 'Mayhem Pressure: {current}/{max}',
            description: 'Passive entropy pressure — CANNOT be spent. Amplifies all spells as it rises. Only release: Wild Surge at 100.',
            mechanics: [
                'Mayhem CANNOT be spent — it is passive pressure only',
                'Higher Mayhem = more spell targets, bigger dice, wider AoE',
                'At 100: Wild Surge triggers (uncontrollable chaos explosion)',
                'No safety valve — chaos only escalates'
            ],
            thresholds: ['25: Minor amplification', '50: Moderate amplification', '75: Major amplification', '100: Wild Surge (uncontrollable)'],
            showDice: false,
            showPressure: true
        }
    },

    'Gambit (Threads)': {
        id: 'threadsOfDestiny',
        name: 'Threads of Destiny',
        shortName: 'Threads',
        type: 'threads',
        description: 'Every failure is fuel. Every thread is a weapon. Woven from fate\'s disruptions to manipulate destiny.',
        deckRules: {
            deckSize: 52,
            shuffleOnCombatStart: true,
            reshuffleWhenEmpty: true,
            callCardLimit: 'once per turn',
            callCardCost: 2
        },
        visual: {
            type: 'threads-of-destiny',
            count: 13,
            arrangement: 'horizontal',
            baseColor: '#1a0d2e',
            threadColor: '#FFD700',
            shimmerColor: '#F0E68C',
            accentColor: '#9370DB',
            glowColor: '#FFA500',
            segmentBorder: '#2d1b4e',
            cardSuits: ['♠', '♥', '♦', '♣'],
            icon: 'fas fa-scroll',
            effects: ['mystical', 'fate', 'tarot']
        },
        mechanics: {
            max: 13,
            current: 0,
            regen: 0,
            consumeVerb: 'spend',
            gainVerb: 'weave',
            persistence: 'Threads persist between combats',
            callCardPerTurnLimit: 1,
            threadGeneration: {
                minorFailure: 1,
                majorFailure: 2
            },
            threadSpending: {
                callCard: 2,
                forceFailure: 3,
                forceSuccess: 5
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
                        { label: 'Spell Fails / Minimal Effect', value: '+1 Thread' },
                        { label: 'Major Negative (Bust, Self-Damage)', value: '+2 Threads' }
                    ]
                },
                {
                    type: 'mechanics',
                    title: 'Thread Spending',
                    content: [
                        { label: 'Call Specific Card', value: '2 Threads (once/turn)' },
                        { label: 'Peek Top 3 Cards', value: '1 Thread' }
                    ]
                },
                {
                    type: 'deck-rules',
                    title: 'Deck Rules',
                    content: '52-card deck, shuffled at combat start. Reshuffle discard when empty.'
                },
                {
                    type: 'mechanics-note',
                    content: 'Build early. Spend late. Never waste. You can only call 1 card per turn.'
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

    'Gambit': {
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
                'probability_savant': {
                    name: 'Probability Savant',
                    max: 7,
                    theme: 'coins',
                    color: '#2980b9',
                    icon: 'fas fa-brain',
                    description: 'Mathematical foresight - incremental roll manipulation',
                    approach: 'Treating fate as a ledger to be meticulously balanced',
                    useCase: 'Spend FP to manipulate rolls, predict enemy saves, maintain balanced probabilities',
                    why7: 'Precision over volume - fewer points for deliberate, measured control'
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
                'karmic_weaver': {
                    name: 'Karmic Weaver',
                    max: 13,
                    theme: 'cards',
                    color: '#8e44ad',
                    icon: 'fas fa-diamond',
                    description: 'Thread manipulation and fate-binding',
                    approach: 'Deck siphoning and damage redirection through karmic links',
                    useCase: 'Spend FP to weave damage threads between enemies, siphon enemy advantages, redirect fate',
                    why13: 'Thirteen threads of fate - each card a potential connection in the karmic web'
                }
            },
            effects: ['luck', 'gambling', 'probability']
        },
        mechanics: {
            max: 'calculated', // 7, 21, or 13 based on specialization (on hold, now calculated)
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

    // 'Deathcaller' and 'Lichborne' merged into Revenant as Phase 1.10 consolidation
    'Revenant': {
        id: 'blightAscension',
        name: 'Blight Ascension & Blood Tokens',
        shortName: 'BA/BT',
        type: 'ascension-blood',
        description: 'Dual resource system: Blight Ascension Paths (permanent power/curses) and Blood Tokens (VOLATILE ticking time bombs with escalating self-damage). The Revenant combines volatile blood magic with methodical frost harvesting.',
        visual: {
            type: 'ascension-blood',
            ascensionPaths: {
                max: 7,
                baseColor: '#1a0d1a',
                activeColor: '#8B0000',
                glowColor: '#DC143C',
                icon: 'fas fa-skull'
            },
            bloodTokens: {
                max: 20,
                baseColor: '#2d0a0a',
                activeColor: '#B22222',
                glowColor: '#FF4444',
                warningColor: '#FF6B6B',
                dangerColor: '#FF0000',
                icon: 'fas fa-droplet',
                volatilityTiers: {
                    stable: { max: 5, label: 'Stable', color: '#B22222' },
                    unstable: { min: 6, max: 10, label: 'Unstable', color: '#FF4444', selfDamage: '1/turn' },
                    volatile: { min: 11, max: 15, label: 'Volatile', color: '#FF6B6B', selfDamage: '1d4/token/turn', healingBlocked: true },
                    criticalMass: { min: 16, max: 20, label: 'CRITICAL MASS', color: '#FF0000', selfDamage: '1d6/token/turn', nuclearDetonation: '1d10/token to 30ft radius on death' }
                }
            }
        },
        mechanics: {
            max: 7,
            current: 0,
            bloodTokens: 0,
            tokenTimer: 600,
            regen: 0,
            consumeVerb: 'activate',
            gainVerb: 'unlock',
            volatilityNote: 'Blood Tokens are VOLATILE. 6+ = self-damage/turn. 11+ = cannot be healed. 16+ = nuclear detonation on death. The Revenant rides a chain reaction, not a battery.'
        },
        tooltip: {
            title: 'Necrotic Ascension & Blood Tokens',
            description: 'Activate paths for permanent power/curses. Blood Tokens are VOLATILE — escalating self-damage at 6/11/16 tokens.',
            showPaths: true,
            showBoons: true,
            showCurses: true,
            showTokens: true,
            showTimer: true,
            showVolatility: true
        },
        paths: [
            {
                name: 'Shrouded Veil',
                level: 1,
                boon: '+2d6 blight damage, advantage on Stealth',
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
                boon: 'Summon 2 specters, +1d6 blight damage',
                curse: 'Specters drain 1d4 HP/turn from you',
                shortName: 'Spectral'
            },
            {
                name: 'Frostwalker',
                level: 7,
                boon: 'Aura: 15ft radius, -10ft enemy speed, 1d4 rime/turn',
                curse: '+50% ember damage taken (vulnerability)',
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
                curse: '2d6 wyrd damage when used (void consumption)',
                shortName: 'Void'
            }
        ],
        bloodTokens: {
            name: 'Blood Tokens',
            description: 'Generated by sacrificing health, enhance blight spells',
            generation: '1 HP sacrificed = 1 Blood Token',
            usage: 'Spend tokens to add 1d6 blight damage per token',
            expiration: '10 minutes (15 with Crimson Pact)',
            burstDamage: '1d10 blight per unused token',
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
        description: 'ACTIVE sacrifice required — bleed willingly or Devotion decays. Voluntary Offering (1d8 HP free action) accelerates progress. Lose 1 level after 2 rounds without damage/sacrifice. The Martyr BLEEDS; the Ironclad endures.',
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
            icon: 'fas fa-cross',
            effects: ['radiant', 'sacrifice', 'devotion', 'active-bleed']
        },
        mechanics: {
            max: 6, // Devotion Levels 0-6
            current: 0,
            damage: 0, // Accumulated damage toward next level
            regen: 0,
            consumeVerb: 'bleed',
            gainVerb: 'sacrifice',
            thresholds: [0, 10, 20, 40, 60, 80, 100],
            decay: 'Lose 1 Devotion level after 2 consecutive rounds without taking damage or using Voluntary Offering',
            voluntaryOffering: 'Free action: sacrifice 1d8 HP to gain Devotion progress (counts as damage for decay prevention)',
            differentiationNote: 'NOT passive absorption. The Martyr must ACTIVELY choose to bleed. The Ironclad specialization adds furnace-plate armor but still requires willing sacrifice.'
        },
        tooltip: {
            title: 'Devotion Level {current}',
            description: 'Build through ACTIVE sacrifice (damage taken + Voluntary Offering). Decays without blood. Spend for amplified spells.',
            showStage: true,
            showPassive: true,
            showAmplify: true,
            decayWarning: '⚠️ DECAY: Lose 1 level after 2 rounds without damage/sacrifice'
        },
        stages: [
            { name: 'Mortal Resolve', level: 0, requirement: 'Starting state', passive: 'None' },
            { name: 'Flickering Faith', level: 1, requirement: '10 damage', passive: 'Resistance to the first instance of damage each round' },
            { name: 'Steadfast Conviction', level: 2, requirement: '20 damage', passive: 'Regain 1d6 HP at the start of each of your turns' },
            { name: 'Radiant Sacrifice', level: 3, requirement: '40 damage', passive: 'All allies within 10 ft gain +1 damage reduction' },
            { name: 'Divine Ascendance', level: 4, requirement: '60 damage', passive: 'Allies within 10 ft gain resistance to the first damage type they take each round' },
            { name: 'Holy Martyrdom', level: 5, requirement: '80 damage', passive: '+10 ember damage on attacks, allies within 10 ft gain temp HP when you take damage' },
            { name: 'Celestial Protector', level: 6, requirement: '100 damage', passive: 'Allies within 15 ft resist all damage' }
        ],
        specializations: {
            redemption: {
                name: 'Redemption',
                sharedPassive: {
                    name: "Suffering's Gift",
                    description: "At Devotion Level 3 or higher, whenever you take damage, all allies within 10 feet gain temporary HP equal to your current Devotion Level."
                },
                uniquePassive: {
                    name: 'Redemptive Grace',
                    description: 'Martyr\'s Intervene heals protected ally for 2d6 HP. All healing spells +10 ft range'
                }
            },
            zealot: {
                name: 'Zealot',
                sharedPassive: {
                    name: "Suffering's Gift",
                    description: "At Devotion Level 3 or higher, whenever you take damage, all allies within 10 feet gain temporary HP equal to your current Devotion Level."
                },
                uniquePassive: {
                    name: 'Zealous Wrath',
                    description: 'Ember spells deal +(Devotion Level × 2) damage. Heal for 15% of ember damage dealt'
                }
            },
            ascetic: {
                name: 'Ascetic',
                sharedPassive: {
                    name: "Suffering's Gift",
                    description: "At Devotion Level 3 or higher, whenever you take damage, all allies within 10 feet gain temporary HP equal to your current Devotion Level."
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
            damageBonus: 1 // +1 damage per Madness Point to all False Prophet damage types (wyrd, blight)
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
                        { label: 'Damage Bonus', value: '+{current}' },
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
                        { roll: 1, name: 'Shadow Burst', effect: '5d6 blight to self + all within 20 ft' },
                        { roll: 2, name: 'Mind Shatter', effect: 'Stunned for 2 rounds' },
                        { roll: 3, name: 'Dark Whispers', effect: 'Disadvantage on attacks/saves (3 rounds)' },
                        { roll: 4, name: 'Chaotic Pulse', effect: 'Random teleport 60 ft + 4d6 wyrd' },
                        { roll: 5, name: 'Psychic Scream', effect: 'All in 30 ft save or frightened (3 rounds)' },
                        { roll: 6, name: 'Nightmare Echoes', effect: '6d6 wyrd + Short-Term Madness (1d4 rounds)' }
                    ]
                },
                {
                    type: 'mechanics-note',
                    content: 'Spells generate Madness (1d4-2d6). Each point adds +1 to wyrd and blight damage. Some spells spend Madness for power.'
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

    'Inquisitor': {
        id: 'righteousAuthority',
        name: 'Righteous Authority',
        shortName: 'Authority',
        type: 'hexbreaker-charges',
        description: 'Unified anti-magic friction and demonic binding authority (0-8). Built through supernatural contact, spent on negation and command.',
        visual: {
            type: 'hexbreaker-charges',
            arrangement: 'hexbreaker',
            baseColor: '#2d0a0a',
            activeColor: '#FFD700',
            glowColor: '#FFF8DC',
            warningColor: '#FF8C00',
            dangerColor: '#DC143C',
            criticalColor: '#8B0000',
            icon: 'fas fa-link',
            effects: ['binding', 'control', 'anti-magic', 'negation']
        },
        mechanics: {
            max: 8,
            current: 0,
            regen: 0,
            consumeVerb: 'spend',
            gainVerb: 'absorb',
            demonCapacity: 2,
        },
        tooltip: {
            title: 'Righteous Authority',
            description: 'Anti-magic friction and demon command authority',
        },
    },

    // HARROW PATH
    'Plaguebringer': {
        id: 'virulenceCultivation',
        name: 'Virulence',
        shortName: 'Virulence',
        type: 'virulence-bar',
        description: 'Passive buff gauge that grows as you cultivate afflictions. Never spent — only gained. Higher Virulence passively strengthens all afflictions.',
        visual: {
            type: 'virulence-bar',
            arrangement: 'segmented-horizontal',
            baseColor: '#1A2E1A',
            activeColor: '#556B2F',
            glowColor: '#9ACD32',
            segments: 4,
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
            maxVirulence: 100,
            currentVirulence: 0,
            maxAfflictions: 10,
            maxAfflictionsPerTarget: 2,
            activeAfflictions: 0,
            virulenceGain: {
                baseAffliction: 10,
                categorySpell: 5,
                finalForm: 25
            },
            virulenceDecay: 2,
            thresholds: {
                seedling: { min: 0, max: 24, bonus: 'None' },
                sprouting: { min: 25, max: 49, bonus: '+1 to all affliction damage dice' },
                blooming: { min: 50, max: 74, bonus: '+1 duration round, +5ft spread range' },
                peakHarvest: { min: 75, max: 100, bonus: 'Ignore first dispel, +2 damage dice' }
            },
            categories: ['Weaken', 'Torment', 'Fester', 'Decay', 'Amplify'],
            lastCategoryDeterminesFinal: true
        },
        tooltip: {
            title: 'Virulence: {virulence}/100',
            showVirulence: true,
            showAfflictions: true,
            showVirulenceTier: true,
            showSpecPassive: true
        },
        sharedPassive: {
            name: 'Plague Mastery',
            description: 'Afflictions last 2 additional rounds and resist dispel (5-6 on 1d6). Gain 1d4 mana when afflicted target dies.'
        },
        specPassives: {
            virulentSpreader: {
                name: 'Epidemic Mastery',
                description: 'Base afflictions apply to 2 adjacent targets. Stage 2+ afflictions auto-spread. +1 spread target per 25 Virulence.'
            },
            tormentWeaver: {
                name: 'Wyrd Resonance',
                description: 'Same affliction on multiple targets creates Wyrd Links. Cultivating one cultivates all. +1 link per 25 Virulence.'
            },
            decayHarbinger: {
                name: 'Accelerated Decay',
                description: 'No final form. Post-Stage 3 adds permanent stacks (max 15/target). +1d6 blight per stack per 25 Virulence. Stacks above 10 require concentration.'
            }
        }
    },

    // REMOVED: 'Lichborne' section merged into Revenant as Phase 1.10 consolidation
    // Original Lichborne resource: Eternal Frost Aura & Phylactery (frost_undead)
    // Key mechanics preserved in Revenant's combined resource system
};

export const getClassResourceConfig = (className) => {
    return CLASS_RESOURCE_TYPES[className] || null;
};

// Helper function to initialize class resource based on character stats
export const initializeClassResource = (className, characterStats) => {
    const config = getClassResourceConfig(className);
    if (!config) return null;

    const level = characterStats.level || 1;
    
    // Handle different resource structure types
    let current = 0;
    let max = 5; // Default fallback
    let timeShards = null;
    let temporalStrain = null;
    let notes = null;
    
    // Dual-resource systems (Chronarch)
    if (config.mechanics.timeShards && config.mechanics.temporalStrain) {
        timeShards = {
            max: config.mechanics.timeShards.max || 10,
            current: config.mechanics.timeShards.current || 0
        };
        temporalStrain = {
            max: config.mechanics.temporalStrain.max || 10,
            current: config.mechanics.temporalStrain.current || 0
        };
        max = timeShards.max; // Use timeShards max as primary max for HUD
        current = timeShards.current;
    }
    // Musical notes system (Minstrel)
    else if (config.mechanics.maxPerNote && config.mechanics.totalNotes) {
        notes = [];
        max = config.mechanics.totalNotes;
        current = 0;
    }
    // Standard current/max structure
    else if (config.mechanics.max !== undefined) {
        current = config.mechanics.current || 0;
        max = config.mechanics.max;
    }
    
    const baseResource = {
        type: config.id,
        current: current,
        max: max,
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
        // Dual-resource support
        timeShards: timeShards,
        temporalStrain: temporalStrain,
        // Musical notes support
        notes: notes,
        maxPerNote: config.mechanics.maxPerNote || 0,
        totalNotes: config.mechanics.totalNotes || 0,
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
            case 'Harbinger':
                baseResource.max = Math.max(5, intMod + Math.floor(level / 5));
                break;
            case 'Gambit':
            case 'False Prophet':
                baseResource.max = Math.max(1, chaMod + 5);
                break;
            // 'Exorcist' removed (merged with Covenbane into Inquisitor)
            case 'Martyr':
                baseResource.max = Math.max(1, conMod + 3);
                break;
            case 'Spellguard':
                baseResource.max = Math.max(1, intMod + 5);
                break;
            case 'Animist':
                baseResource.max = Math.max(1, 5 + spirMod);
                break;
            // 'Dreadnaught' removed (absorbed into Martyr as Ironclad specialization)
            case 'Toxicologist':
                baseResource.max = Math.max(1, intMod + 3);
                break;
            case 'Inquisitor':
                baseResource.max = Math.max(1, spirMod + 5);
                break;
            case 'Lunarch':
                baseResource.max = 1;
                baseResource.phase = baseResource.phase || 'new_moon';
                baseResource.roundsInPhase = baseResource.roundsInPhase || 0;
                baseResource.phaseDuration = 3;
                break;
            default:
                baseResource.max = 5; // Default fallback
        }
    }

    // Initialize custom fields for Revenant, Apex, and Arcanoneer
    if (className === 'Revenant') {
        baseResource.bloodTokens = 0;
        baseResource.stacks = [true, false, false, false, false, false, false];
    } else if (className === 'Apex') {
        baseResource.companionHP = config.mechanics.companion?.hp || 50;
        baseResource.companionMaxHP = config.mechanics.companion?.maxHP || 50;
        baseResource.current = config.mechanics.quarryMarks?.current || 0;
        baseResource.max = config.mechanics.quarryMarks?.max || 5;
    } else if (className === 'Arcanoneer') {
        // Building Blocks: array of block ids banked in the iron sleeve.
        // `spheres` is the legacy field name retained for save-file compatibility
        // with the generic characterStore shape; UI refers to them as "blocks".
        baseResource.spheres = config.mechanics.spheres || [];
        baseResource.current = 0;          // current = live count of banked blocks
        baseResource.max = config.mechanics.max;  // hard cap = 12
        baseResource.rollsPerTurn = 4;     // 4d8 baseline (Entropy Weaver raises to 5)
        baseResource.rerollsUsed = 0;
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

// ANIMIST PATH
CLASS_RESOURCE_TYPES['Animist'] = {
    id: 'ancestralResonance',
    name: 'Ancestral Resonance',
    shortName: 'AR',
    type: 'ancestral_resonance',
    description: 'Channel ancestral spirits to build resonance. Spend resonance to invoke spirit abilities and empower totems.',
    visual: {
        type: 'ancestral-resonance',
        count: 20,
        arrangement: 'segmented',
        baseColor: '#1A3C2E',
        activeColor: '#2E8B57',
        glowColor: '#50C878',
        icon: 'fas fa-spiral',
        effects: ['ancestral', 'spiritual', 'resonance'],
        stages: {
            dormant: { range: [0, 5], description: 'Spirits slumber' },
            awakening: { range: [6, 12], description: 'Ancestors stir' },
            awakened: { range: [13, 20], description: 'Spirit convergence' }
        },
        specializations: {
            'thornwarden': {
                name: 'Thornwarden',
                icon: 'fas fa-tree',
                baseColor: '#1A3C2E',
                activeColor: '#228B22',
                glowColor: '#32CD32',
                theme: 'Nature spirits and thorn barriers'
            },
            'spirit_binder': {
                name: 'Spirit Binder',
                icon: 'fas fa-link',
                baseColor: '#2E1A3E',
                activeColor: '#9370DB',
                glowColor: '#BB77DD',
                theme: 'Binding ancestral spirits into vessels'
            },
            'stormscribe': {
                name: 'Stormscribe',
                icon: 'fas fa-wind',
                baseColor: '#1A2E3E',
                activeColor: '#4169E1',
                glowColor: '#6495ED',
                theme: 'Scribing storms through ritual inscription'
            }
        }
    },
    mechanics: {
        max: 20,
        current: 0,
        regen: 0,
        consumeVerb: 'invoke',
        gainVerb: 'channel'
    },
    tooltip: {
        title: 'Ancestral Resonance: {current}/{max}',
        description: 'Channel ancestral spirits to build resonance. Spend to invoke spirit abilities and empower totems.',
        showResonance: true,
        showSpirits: true,
        showSpecialization: true
    }
};

CLASS_RESOURCE_TYPES['Arcanoneer'] = {
    // NOTE: `id` and `visual.type` are kept stable for save-file compat and dispatch routing.
    id: 'elementalSpheres',
    name: 'Elemental Spheres',
    shortName: 'Spheres',
    type: 'spheres',
    description: 'Roll 4d8 each turn to generate elemental spheres. Combine any two to produce a formulation from the 36-combination matrix.',
    visual: {
        type: 'elemental-spheres',
        count: 8,
        arrangement: 'row',
        layout: '1x8',
        baseColor: 'rgba(255, 255, 255, 0.1)',
        emptyColor: 'rgba(255, 255, 255, 0.05)',
        icon: 'fas fa-wand-sparkles',
        effects: ['elemental', 'combination', 'magicka']
    },
    mechanics: {
        max: 12,
        current: 0,
        spheres: [],
        generation: '4d8',
        regen: 0,
        consumeVerb: 'combine',
        gainVerb: 'generate',
        bankingRule: 'Spheres generated this turn that exceed your max bank of 12 are lost. Spend or Siphon excess spheres before banking.'
    },
    tooltip: {
        title: 'Elemental Spheres',
        description: 'Roll 4d8 each turn to generate elemental spheres. Combine any two to produce a formulation.',
        showSpheres: true,
        showBreakdown: true,
        showCombinations: true
    },
    // The canonical 8 elemental sphere types. This is the SINGLE SOURCE OF TRUTH —
    // the combination matrix, SphereComboFinder, the bar renderer, and saved
    // character data all reference these exact `id` values.
    // IDs match the names already used throughout the system (ember, blight, rime, etc.).
    // The only fix from the original: `radiant` splits the old `ember` collision
    // (d8=2 Radiance vs d8=4 Flames), and `flesh` replaces `healing` for d8=7
    // (the entry is "Gristle Blockade" — lore-correct).
    elements: [
        {
            id: 'arcane',
            name: 'Arcane',
            color: '#9370DB',
            glowColor: '#BA9FE8',
            d8Value: 1,
            icon: 'fas fa-wand-magic-sparkles',
            theme: 'Raw Magic',
            summary: 'Force damage, disorientation, magical effects',
            flavor: 'The shape behind all other shapes — raw kinetic intent.'
        },
        {
            id: 'divine',
            name: 'Divine',
            color: '#FFD700',
            glowColor: '#FFE55C',
            d8Value: 2,
            icon: 'fas fa-sun',
            theme: 'Divine Light',
            summary: 'Divine damage, blinding, stunning, protection',
            flavor: 'The first clause of the First Contract: let there be sight.'
        },
        {
            id: 'blight',
            name: 'Blight',
            color: '#3D2C4E',
            glowColor: '#6B4E7F',
            d8Value: 3,
            icon: 'fas fa-skull',
            theme: 'Darkness',
            summary: 'Blight damage, curses, life drain, debuffs',
            flavor: 'The silence after the clause — what the light leaves behind.'
        },
        {
            id: 'ember',
            name: 'Ember',
            color: '#FF4500',
            glowColor: '#FF6347',
            d8Value: 4,
            icon: 'fas fa-fire',
            theme: 'Flames',
            summary: 'Fire damage, burning, ignition, explosions',
            flavor: 'The first tool humanity mastered, captured in a crystal shard.'
        },
        {
            id: 'rime',
            name: 'Rime',
            color: '#4169E1',
            glowColor: '#6495ED',
            d8Value: 5,
            icon: 'fas fa-snowflake',
            theme: 'Frost',
            summary: 'Cold damage, freezing, slowing, disorientation',
            flavor: 'Entropy deferred — motion held still in crystal lattice.'
        },
        {
            id: 'primal',
            name: 'Primal',
            color: '#32CD32',
            glowColor: '#90EE90',
            d8Value: 6,
            icon: 'fas fa-bolt',
            theme: 'Storm & Growth',
            summary: 'Lightning, vines, restraint, poison',
            flavor: 'The green arc between seed and sky.'
        },
        {
            id: 'storm',
            name: 'Storm',
            color: '#1E90FF',
            glowColor: '#87CEEB',
            d8Value: 7,
            icon: 'fas fa-bolt-lightning',
            theme: 'Lightning & Thunder',
            summary: 'Lightning damage, thunder, stunning, chain effects',
            flavor: 'The sky\'s voice captured in crystal — raw current and sound.'
        },
        {
            id: 'wyrd',
            name: 'Wyrd',
            color: 'linear-gradient(45deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)',
            glowColor: '#FF00FF',
            d8Value: 8,
            icon: 'fas fa-dice-d20',
            theme: 'Unpredictability',
            summary: 'Random effects, wild magic, variable damage',
            flavor: 'The clause the Keeper will not interpret.',
            isGradient: true
        }
    ]
};

CLASS_RESOURCE_TYPES['Shaper'] = {
    id: 'kineticFluxBodyToll',
    name: 'Kinetic Flux & Body Toll',
    shortName: 'KF/BT',
    type: 'dual-resource',
    description: 'Dual resource system: Kinetic Flux (combat rhythm, 0-20) and Body Toll (transformation cost, 0-10)',
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
            max: 10,
            baseColor: '#5C1A1A',
            activeColor: '#C0392B',
            glowColor: '#E74C3C',
            icon: 'fas fa-heart-crack',
            effects: ['strain', 'erosion']
        },
        stances: {
            'Ataxic Flow': {
                icon: 'fas fa-water',
                color: '#3498DB',
                type: 'Defensive/Agile'
            },
            'Arterial Strike': {
                icon: 'fas fa-crosshairs',
                color: '#C0392B',
                type: 'Offensive/Precision'
            },
            'Centrifugal Fury': {
                icon: 'fas fa-tornado',
                color: '#E67E22',
                type: 'AoE/Multi'
            },
            'Deadened Bastion': {
                icon: 'fas fa-shield-halved',
                color: '#7F8C8D',
                type: 'Defensive/Counter'
            },
            'Fluid Apex': {
                icon: 'fas fa-yin-yang',
                color: '#9B59B6',
                type: 'Balanced/Hub'
            },
            'Void Predator': {
                icon: 'fas fa-ghost',
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
            max: 10,
            current: 0,
            generation: {
                signatureMove: 1
            },
            decay: 0,
            consumption: {
                ultimates: '2-5'
            },
            consumeVerb: 'expend',
            gainVerb: 'earn'
        },
        stance: {
            current: 'Ataxic Flow',
            available: [
                'Ataxic Flow',
                'Arterial Strike',
                'Centrifugal Fury',
                'Deadened Bastion',
                'Fluid Apex',
                'Void Predator'
            ]
        }
    },
    tooltip: {
        title: 'Flux: {momentum}/20 | Toll: {flourish}/10 | Form: {stance}',
        description: 'Build Kinetic Flux through combat, accumulate Body Toll from transformations',
        showMomentum: true,
        showFlourish: true,
        showStance: true
    },
    stanceNetwork: {
        'Ataxic Flow': ['Arterial Strike', 'Void Predator', 'Fluid Apex'],
        'Arterial Strike': ['Centrifugal Fury', 'Deadened Bastion', 'Ataxic Flow'],
        'Centrifugal Fury': ['Fluid Apex', 'Deadened Bastion'],
        'Deadened Bastion': ['Arterial Strike', 'Ataxic Flow'],
        'Fluid Apex': ['Ataxic Flow', 'Arterial Strike', 'Centrifugal Fury', 'Deadened Bastion', 'Void Predator'],
        'Void Predator': ['Arterial Strike', 'Fluid Apex']
    },
    transitionCosts: {
        'Ataxic Flow': {
            'Arterial Strike': 2,
            'Void Predator': 2,
            'Fluid Apex': 2
        },
        'Arterial Strike': {
            'Centrifugal Fury': 2,
            'Deadened Bastion': 2,
            'Ataxic Flow': 2
        },
        'Centrifugal Fury': {
            'Fluid Apex': 3,
            'Deadened Bastion': 3
        },
        'Deadened Bastion': {
            'Arterial Strike': 2,
            'Ataxic Flow': 2
        },
        'Fluid Apex': {
            'Ataxic Flow': 4,
            'Arterial Strike': 4,
            'Centrifugal Fury': 4,
            'Deadened Bastion': 4,
            'Void Predator': 4
        },
        'Void Predator': {
            'Arterial Strike': 2,
            'Fluid Apex': 2
        }
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
        icon: 'fas fa-axe-battle',
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
            penalties: ['Take 1 extra damage from ranged attacks while raging']
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
            penalties: ['Cannot parry while raging', 'Attackers gain +2 to hit you'],
            warning: 'Must spend Rage this round or take 2d6 damage and reset to 0'
        },
        {
            range: [125, 149],
            name: 'Annihilation',
            effects: ['Annihilating Fury', 'Unstoppable Rampage', '+6 attack rolls', 'CRITICAL OVERHEAT'],
            attackBonus: 6,
            bonuses: ['+6 damage on melee hits', '+10 ft movement speed', 'Crit range expanded by 1 on weapon dice', 'Advantage on Strength checks'],
            penalties: ['Cannot receive healing while raging', 'Attackers gain +3 to hit you', '-5 ft movement speed after rage ends', 'Take 1d6 damage at start of each turn']
        },
        {
            range: [150, 999],
            name: 'Apocalypse',
            effects: ['Apocalyptic Wrath', 'Berserker God Mode', '+7 attack rolls', 'MAXIMUM OVERHEAT'],
            attackBonus: 7,
            bonuses: ['+8 damage on melee hits', '+15 ft movement speed', 'Crit range expanded by 2 on weapon dice', 'All melee attacks hit adjacent enemies', 'Immune to all conditions'],
            penalties: ['Take double damage from all sources while raging', 'Attackers gain +4 to hit you', '-10 ft movement speed after rage ends', 'Take 2d6 damage at start of each turn', 'Cannot use ranged attacks']
        }
    ]
};

// 'Dreadnaught' CLASS_RESOURCE_TYPES removed (absorbed into Martyr as Ironclad specialization)

// MERCENARY PATH
CLASS_RESOURCE_TYPES['Toxicologist'] = {
    id: 'toxinVialsContraptions',
    name: 'Toxin Vials & Contraption Parts',
    shortName: 'TV/CP',
    type: 'dual-resource',
    description: 'Dual resource system: Toxin Vials (crafting) and Contraption Parts (deployment)',
    visual: {
        type: 'alchemical-arsenal',
        toxinVials: {
            count: 'calculated', // INT mod + 3
            arrangement: 'grid',
            baseColor: '#2D5016',
            activeColor: '#4CAF50',
            glowColor: '#76FF03',
            icon: 'fa-flask',
            effects: ['alchemy', 'poison']
        },
        contraptionParts: {
            count: 5,
            arrangement: 'horizontal',
            baseColor: '#4A4A4A',
            activeColor: '#9E9E9E',
            glowColor: '#FFD700',
            icon: 'fa-cog',
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

// Covenbane Hexbreaker Charges removed (Covenbane merged with Exorcist into Inquisitor — now uses Righteous Authority)
// See CLASS_RESOURCE_TYPES['Inquisitor'] for the merged resource

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
        naturalCycling: true,
        phaseAdvancement: 'Spells with selfDamage advance the phase timer by +1 round, accelerating the cycle'
    },
    tooltip: {
        title: 'Lunar Phases',
        description: 'Cyclical moon phases that grant different bonuses. Phases naturally cycle every 3 rounds or can be manually shifted for 8 mana. Spells with selfDamage advance the phase timer by +1 round.'
    }
};

CLASS_RESOURCE_TYPES['Apex'] = {
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
            shadowblade: {
                activeColor: '#6A1B9A',
                glowColor: '#BA68C8',
                icon: 'fa-moon',
                name: 'Shadowblade'
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
                coordinatedStrike: 2,
                companionHit: 1,
                companionTakesDamage: 1,
                companionCrit: 2,
                markQuarryAbility: 1,
                glaiveHitSolo: 0
            },
            spending: {
                enhanceCompanion: 1,
                extendChain: 2,
                companionSpecial: 3,
                ultimate: 5
            },
            turnCap: 3,
            beastmasterTurnCap: 4,
            decay: '1 per minute outside combat (after 1 min grace period)',
            companionDeathRule: 'If companion is dead, ZERO Quarry Marks can be generated until revived',
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
        description: 'Generate marks through COMPANION SYNERGY only — coordinated strikes, companion hits, and pack tactics. Solo glaive hits generate NOTHING. Keep your companion alive.',
        showQuarryMarks: true,
        showCompanion: true,
        showDecayWarning: true
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
    id: 'vengeance-points',
    name: 'Vengeance Points',
    shortName: 'VP',
    type: 'vengeance-points',
    description: 'Build power through attacks, evasions, and critical hits to unleash devastating abilities. Pursuit Movement: +5ft speed per VP toward marked target (max +50ft). The Warden does NOT teleport.',
    visual: {
        type: 'vengeance-points',
        count: 10,
        arrangement: 'horizontal',
        baseColor: '#2E0854',
        activeColor: '#7B2CBF',
        glowColor: '#9D4EDD',
        icon: 'fas fa-khanda',
        effects: ['vengeance', 'fury']
    },
    mechanics: {
        max: 10,
        current: 0,
        consumeVerb: 'spend',
        gainVerb: 'generate'
    },
    tooltip: {
        title: 'Vengeance Points: {current}/10',
        description: '',
        showGeneration: true,
        showSpending: true,
        showPassives: true
    },
    generation: [
        { action: 'Successful attack', vp: 1 },
        { action: 'Attack on marked target', vp: 2 },
        { action: 'Evasion', vp: 1 },
        { action: 'Critical hit', vp: 1 }
    ],
    spending: [
        { cost: 2, ability: 'Vengeful Strike', effect: '+2d6 damage on next attack' },
        { cost: 3, ability: 'Whirling Glaive', effect: '15-ft cone AoE, 2d6 damage + slow' },
        { cost: 4, ability: 'Hunter\'s Resolve', effect: 'Heal 2d8 HP, +2 damage reduction for 2 rounds' },
        { cost: 6, ability: 'Cage of Vengeance', effect: 'Trap target for 3 rounds' },
        { cost: 10, ability: 'Avatar of Vengeance', effect: 'Ultimate transformation for 4 rounds' }
    ]
};

CLASS_RESOURCE_TYPES['Augur'] = {
    id: 'benediction-malediction',
    name: 'Benediction & Malediction',
    shortName: 'B/M',
    type: 'dual-omen',
    description: 'Read the signs in every die roll — even results generate Benediction, odd results generate Malediction. Spend Benediction on boons and blessings, Malediction on curses and debuffs. Only applies to rolls by creatures within 60ft that you can see and are aware of.',
    visual: {
        type: 'dual-omen',
        benediction: {
            max: 10,
            baseColor: '#1a1a2e',
            activeColor: '#FFD700',
            glowColor: '#FFF8DC',
            icon: '✦',
            label: 'Benediction'
        },
        malediction: {
            max: 10,
            baseColor: '#1a1a2e',
            activeColor: '#8B008B',
            glowColor: '#DA70D6',
            icon: '✧',
            label: 'Malediction'
        },
        specOverrides: {
            auspex: { benedictionMax: 10, maledictionMax: 10 },
            harbinger: { benedictionMax: 5, maledictionMax: 15 },
            hierophant: { benedictionMax: 15, maledictionMax: 5 }
        },
        effects: ['omen', 'divination', 'blessing', 'curse']
    },
    mechanics: {
        benediction: {
            max: 10,
            current: 0,
            generation: {
                evenD20: 1,
                natural20: 2,
                combatStart: '1d4',
                omenRitual: 2,
                advantageDisadvantage: 'Both d20 rolls from advantage/disadvantage generate resources independently'
            },
            overflow: 'Resources at max are lost — no further generation for that type',
            spending: {
                buff: 'variable',
                terrain: 'variable',
                protection: 'variable'
            }
        },
        malediction: {
            max: 10,
            current: 0,
            generation: {
                oddD20: 1,
                natural1: 2,
                combatStart: '1d4',
                omenRitual: 2,
                advantageDisadvantage: 'Both d20 rolls from advantage/disadvantage generate resources independently'
            },
            overflow: 'Resources at max are lost — no further generation for that type',
            spending: {
                debuff: 'variable',
                terrain: 'variable',
                curse: 'variable'
            }
        },
        omenDebt: {
            penalty: -1,
            perUnused: 1,
            cap: -10,
            triggerPoint: 'long rest only (NOT short rest)',
            duration: 'until next long rest'
        },
        specPassives: {
            auspex: 'Harmonic Interpretation: Each roll generates +1 of the opposite type (even → 1 Ben + 1 Mal, odd → 1 Mal + 1 Ben). Balanced spells enhanced 50%.',
            harbinger: 'Dark Portent: +1 bonus Malediction on odd rolls. Ill Omen stacking debuff.',
            hierophant: 'Cosmic Channel: +1 bonus Benediction on even rolls. Terrain effects last +2 rounds.'
        },
        persistence: 'Resources persist through combat and reset to 0 on short rest (no Omen Debt). Omen Debt is only applied at long rest for unused resources.'
    },
    tooltip: {
        title: 'Benediction: {benediction}/{benedictionMax} | Malediction: {malediction}/{maledictionMax}',
        description: 'Even d20 rolls → Benediction. Odd d20 rolls → Malediction. Only applies to visible creatures within 60ft. Advantage/disadvantage: both rolls generate. At max: overflow is lost. Unused resources at long rest cause Omen Debt (-1 per point to all rolls next day, cap -10). Short rest resets to 0 with no debt.',
        showGeneration: true,
        showSpending: true,
        showSpecPassive: true,
        showOmenDebt: true
    },
    generation: [
        { action: 'Any d20 (even result, visible within 60ft)', benediction: 1, malediction: 0 },
        { action: 'Any d20 (odd result, visible within 60ft)', benediction: 0, malediction: 1 },
        { action: 'Advantage/Disadvantage (both dice)', benediction: '1 per even die', malediction: '1 per odd die' },
        { action: 'Natural 20 (even)', benediction: 2, malediction: 0 },
        { action: 'Natural 1 (odd)', benediction: 0, malediction: 2 },
        { action: 'Combat start passive', benediction: '1d4', malediction: '1d4' },
        { action: 'Omen Ritual (10 min, once/short rest)', benediction: 2, malediction: 2 }
    ],
    spending: [
        { cost: '2-3 Benediction', ability: 'Minor Blessing', effect: 'Buff ally +1 to rolls or +2 defence' },
        { cost: '2-3 Malediction', ability: 'Minor Curse', effect: 'Debuff enemy -1 to rolls or -2 defence' },
        { cost: '4-5 Benediction', ability: 'Sacred Terrain', effect: 'Create blessed zone (heal, +saves)' },
        { cost: '4-5 Malediction', ability: 'Cursed Terrain', effect: 'Create hazard zone (damage, -speed)' },
        { cost: '6+ Malediction', ability: 'Grand Malediction', effect: 'Severe debuff + wyrd damage' },
        { cost: '8+ Benediction', ability: 'Domain', effect: 'Large sacred zone with powerful buffs' },
        {         cost: '3/3 Both', ability: 'Balanced Sign', effect: 'Simultaneous buff + debuff zone' }
    ]
};

// Doomsayer resource removed (merged into Harbinger as Mayhem gauge)