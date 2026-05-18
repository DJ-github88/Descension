export const astren = {
        id: 'astren',
        name: 'Astren',
        essence: 'Stellar exiles',
        description: 'Our ancestors did not walk across the land to find this place; they fell from the velvet dark between the stars, bringing the cold of the void with them. We are the children of the meteors, our skin mapped with the silver geometry of constellations that no longer exist in the sky. Our thoughts are not linear, but fractured by the cosmic truths that we carry in our marrow—truths that make the stone walls of your cities feel as thin as wet parchment. When we touch you, you feel the chill of a dying sun; when we speak, we echo the mathematics of the infinite. We move with a grace that is not entirely anchored to the ground, as if we are still waiting for the gravity of our home to reclaim us. We are the heralds of the outside, the witnesses to the vast, uncaring silence of the cosmos, forever seeking a way back to the light we once knew.',
        icon: 'fas fa-star',
        overview: 'The Astren are people whose ancestors literally fell from the stars. Crashing to earth in meteors and comets. Through generations of carrying cosmic energy, their bloodlines have been marked by alien origins. Eyes that reflect unfamiliar constellations. Minds that fracture under cosmic truths. Bodies scarred by the fall. They are organized into crater-communities built around the impact sites where their ancestors landed. Settlements clustered where the void touches earth. The Astren do not choose to be alien. It is their heritage, passed down through bloodlines that remember the great fall.',
        culturalBackground: `Astren society is built on crater-communities organized around the impact sites where their ancestors fell. Settlements clustered where meteors scarred the earth. Each community traces its founding to ancestors who crashed to earth in comets and meteors. Traditions preserving the memory of the great fall. Their craters scar the wilderness like divine wounds. Occupants emerging from the smoke with eyes that reflect constellations never seen from this world. Community elders pass down the old ways. How to channel cosmic energy. How to read star patterns. How to navigate the alien knowledge that fractures mortal minds. They speak of the great fall. Of being cast out from realms where mathematics paint reality and time flows backward. Their minds fracture under the weight of cosmic truths. Seeing futures that have not happened. Remembering lives never lived. Community disputes settle through star-readings and the testimony of those who remember the void best. They bear the cold of the void in their bones. Touch leaving frost patterns that linger for days. Some Astren become wandering prophets. Speaking truths that sound like madness to those who hear them. Others hoard their cosmic knowledge. Becoming enigmatic advisors to kings and warlords. They are a people bound by star and void. Their cosmic knowledge unmatched but their minds forever fractured by truths that break mortal understanding.`,
        variantDiversity: 'The Astren are divided into three major crater bloodlines: The Void-Walkers come from the empty spaces between stars, the Sun-Bound carry the fire of dying suns, and the Star-Mapped embody the patterns written in the constellations.',
        integrationNotes: {
            actionPointSystem: 'Astren abilities focus on cosmic energy, gravity manipulation, and reality warping. Their alien nature provides unique tactical options.',
            backgroundSynergy: 'Astren excel in backgrounds emphasizing knowledge, cosmic power, and alien perspectives. Their otherworldly nature creates compelling roleplay.',
            classCompatibility: 'Astren make excellent cosmic casters, gravity manipulators, and knowledge seekers. Their abilities enhance classes that warp reality.'
        },
        meaningfulTradeoffs: 'Astren gain incredible cosmic powers and alien knowledge but struggle to relate to mortals and risk madness from their own insights. Their alien physiology rejects terrestrial healing traditions. Their minds fracture under cosmic pressure. The world itself recoils from their presence.',
        baseTraits: {
            languages: ['Common', 'Celestial', 'Cosmic'],
            lifespan: 'Unknown',
            baseSpeed: 30,
            size: 'Medium',
            height: '5\'6" - 6\'2"',
            weight: '130-190 lbs',
            build: 'Slender and otherworldly'
        },
        basePassives: [
            {
                id: 'alien_physiology_astren',
                name: 'Alien Physiology',
                description: 'Your body evolved for a world that no longer exists. You have advantage on saving throws against diseases and poisons of terrestrial origin (plants, animals, earth, water). However, you have disadvantage on saving throws against diseases, poisons, and afflictions of cosmic, void, or aberration origin. Your biology simply has no framework for processing otherworldly toxins.',
                level: 1,
                icon: 'spell_shadow_abominationexplosion',
                spellType: 'PASSIVE',
                actionPoints: 0,
                components: [],
                effectTypes: ['buff', 'debuff'],
                typeConfig: { category: 'racial' },
                buffConfig: {
                    buffType: 'passive_enhancement',
                    effects: [{
                        id: 'terrestrial_resistance_astren',
                        name: 'Terrestrial Resistance',
                        description: 'Advantage on saves vs terrestrial diseases and poisons — alien biology rejects earthly sickness',
                        statusEffect: { level: 'moderate', description: 'Alien biology rejects earthly sickness' }
                    }],
                    durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                },
                debuffConfig: {
                    debuffType: 'vulnerability',
                    effects: [{
                        id: 'cosmic_susceptibility_astren',
                        name: 'Cosmic Susceptibility',
                        description: 'Disadvantage on saves vs cosmic, void, and aberration afflictions — no defense against otherworldly toxins',
                        statusEffect: { level: 'moderate', description: 'No defense against otherworldly toxins' }
                    }],
                    durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                },
                cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, mana: 0, components: [] }
            },
            {
                id: 'crater_born_astren',
                name: 'Crater-Born',
                description: 'Astren automatically trigger a hostile or fearful reaction from devout religious NPCs and settlements built on consecrated ground. You suffer disadvantage on Persuasion checks with any NPC who practices organized religion, unless you can first establish trust through a meaningful act. In crater-regions near impact sites, you instead gain advantage on Survival and Navigation checks. Your presence is seen as an omen of cosmic doom.',
                level: 1,
                icon: 'spell_holy_mindvision',
                spellType: 'PASSIVE',
                actionPoints: 0,
                components: [],
                effectTypes: ['buff', 'debuff', 'social'],
                typeConfig: { category: 'racial' },
                buffConfig: {
                    buffType: 'passive_enhancement',
                    effects: [{
                        id: 'crater_region_attunement_astren',
                        name: 'Crater-Region Attunement',
                        description: 'Advantage on Survival and Navigation checks near impact sites — the crater remembers its children',
                        statusEffect: { level: 'moderate', description: 'The crater remembers its children' }
                    }],
                    durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                },
                debuffConfig: {
                    debuffType: 'socialPenalty',
                    effects: [{
                        id: 'divine_rejection_astren',
                        name: 'Divine Rejection',
                        description: 'Disadvantage on Persuasion checks with religious NPCs — your alien presence is seen as a bad omen',
                        statusEffect: {
                            penaltyType: 'social',
                            affectedSkills: ['persuasion'],
                            magnitude: 'disadvantage',
                            conditions: ['religious_npc']
                        }
                    }],
                    durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                },
                cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, mana: 0, components: [] }
            },
            {
                id: 'fractured_mind_astren',
                name: 'Fractured Mind',
                description: 'When you roll a natural 1 on any Intelligence, Wisdom, or Charisma saving throw, you are stunned until the end of your next turn. A flood of cosmic perception overwhelms you — visions of dead stars, the sound of the void, the weight of truths that shatter mortal comprehension. This effect cannot be prevented, delayed, or resisted by any means.',
                level: 1,
                icon: 'spell_shadow_unholyfrenzy',
                spellType: 'PASSIVE',
                actionPoints: 0,
                components: [],
                effectTypes: ['debuff'],
                typeConfig: { category: 'racial', isWeakness: true },
                debuffConfig: {
                    debuffType: 'critical_failure',
                    effects: [{
                        id: 'cosmic_fracture_astren',
                        name: 'Cosmic Fracture',
                        description: 'Stunned until end of next turn on natural 1 on INT/WIS/CHA saves — cannot be prevented by any means',
                        statusEffect: {
                            level: 'extreme',
                            description: 'Cosmic truths shatter mortal comprehension',
                            trigger: 'natural_1',
                            triggerStats: ['intelligence', 'wisdom', 'charisma'],
                            triggerType: 'saving_throw'
                        },
                        stunDuration: { value: 1, unit: 'turns', timing: 'until_end_of_next_turn' },
                        isIrresistible: true
                    }],
                    durationValue: 0, durationType: 'trigger', durationUnit: 'turns', canBeDispelled: false
                },
                cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, mana: 0, components: [] }
            }
        ],
        subraces: {
            voidwalker: {
                id: 'voidwalker_astren',
                name: 'Void Walker',
                description: 'Coldest touch of all Astren — fingertips leave frost on warm surfaces. Skin pale as starlight, nearly translucent at the wrists and neck where constellations map their bloodlines in faint silver lines. Eyes are dark like the void between stars, no whites visible, just depth that swallows light. Their presence makes air feel thin, as if reality itself recoils. They seem to fade slightly at the edges, outlines blurring. Movements sometimes leave trails of shadow that dissipate slowly. Animals panic in their presence. Innkeepers refuse them. Children cry when they pass.',
                culturalBackground: 'The Void-Walkers trace their lineage to Astren who fell from the empty spaces between stars. Bloodline marked by the cold void that birthed them. They learn to navigate spaces between reality, walking paths others cannot see. Void-Walker craters are built where the void touches earth. Members serving as navigators and seekers of hidden knowledge. They claim the void speaks in silence between heartbeats, showing paths through reality others cannot see. But the void hungers — prolonged use of gifts leaves them feeling empty and disconnected.',
                statModifiers: { spirit: 3, intelligence: 2, agility: 1, constitution: -2 },
                baseStats: { health: 5, mana: 6, actionPoints: 3, initiative: 0 },
                savingThrowModifiers: { advantage: ['charmed'], disadvantage: ['radiant'] },
                traits: [
                    {
                        id: 'void_step_astren',
                        name: 'Void Step',
                        description: 'You step sideways through the emptiness between stars — but the void does not surrender its children willingly. For a heartbeat you are nowhere, suspended in the silent dark that birthed your bloodline, then reality folds open and you stand elsewhere. The cold stays with you, hardening your flesh into something less than mortal. Your fingertips split. Frost blooms beneath your nails. The void took its toll in blood.',
                        level: 1,
                        icon: 'spell_arcane_blink',
                        spellType: 'ACTION',
                        actionPoints: 1,
                        components: ['verbal', 'somatic'],
                        effectTypes: ['movement', 'buff', 'debuff'],
                        typeConfig: { category: 'racial' },
                        utilityConfig: {
                            utilityType: 'movement',
                            selectedEffects: [{ id: 'void_teleport', name: 'Void Step', description: 'Teleport up to 40 feet through the void between spaces' }],
                            duration: 0,
                            durationUnit: 'instant'
                        },
                        buffConfig: {
                            buffType: 'damageMitigation',
                            effects: [{
                                id: 'void_cling_armor',
                                name: 'Void Cling',
                                description: '+2 Armor until start of next turn — void-matter clings to your flesh, phasing incoming blows',
                                statModifier: { stat: 'armor', magnitude: 2, magnitudeType: 'flat' }
                            }],
                            durationValue: 1, durationType: 'turns', durationUnit: 'turns', canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [{
                                id: 'void_toll_astren',
                                name: 'Void Toll',
                                description: 'Take 1d4 irreducible cold damage — the void takes its toll in flesh. Fingertips split, frost blooms beneath your nails.',
                                statusEffect: { level: 'minor', description: 'The void takes flesh as passage-fee' },
                                selfDamage: { formula: '1d4', type: 'cold', irreducible: true }
                            }],
                            targetRestriction: 'self'
                        },
                        cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 1, mana: 0, components: [] }
                    },
                    {
                        id: 'void_gaze_astren',
                        name: 'Void Gaze',
                        description: 'When you open your eyes fully, others glimpse the void between stars staring back — an infinite dark that sees through every deception and every veil. Illusions unravel like mist, hidden things blaze with terrible clarity. Those who meet your gaze flinch away, unsettled by the cosmic nothing behind your pupils. But each truth the void shows you carves a little more of your sanity away. Starlight bleeds behind your thoughts.',
                        level: 1,
                        icon: 'spell_shadow_antimagicshell',
                        spellType: 'ACTION',
                        actionPoints: 1,
                        components: ['verbal', 'somatic'],
                        effectTypes: ['detection', 'buff', 'debuff'],
                        typeConfig: { category: 'racial' },
                        utilityConfig: {
                            utilityType: 'detection',
                            selectedEffects: [
                                { id: 'see_invisible', name: 'See Invisible', description: 'Perceive invisible creatures and objects within 60 feet' },
                                { id: 'pierce_illusions', name: 'Pierce Illusions', description: 'See through magical illusions within 60 feet' },
                                { id: 'detect_magic', name: 'Detect Magic', description: 'Sense magical effects and auras within 60 feet' }
                            ],
                            duration: 1,
                            durationUnit: 'minute'
                        },
                        buffConfig: {
                            buffType: 'passive_enhancement',
                            effects: [{ id: 'void_gaze_vision', name: 'Void Gaze Vision', description: 'See invisible creatures, pierce illusions, and detect magical effects', statusEffect: { level: 'major', description: 'Void-touched eyes reveal hidden truths' } }],
                            durationValue: 1, durationType: 'minutes', durationUnit: 'minutes', canBeDispelled: true
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [{
                                id: 'void_gaze_bleed',
                                name: 'Void Gaze Bleed',
                                description: 'Take 1 psychic damage at the start of each turn while active. Disadvantage on Charisma checks — your eyes are void-pits that terrorize onlookers.',
                                statusEffect: { level: 'moderate', description: 'Starlight bleeds through your thoughts' },
                                selfDamage: { formula: '1', type: 'psychic', tickFrequency: 'turn_start' }
                            }],
                            targetRestriction: 'self'
                        },
                        cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 1, mana: 0, components: [] }
                    },
                    {
                        id: 'between_heartbeats_astren',
                        name: 'Between Heartbeats',
                        description: 'When the killing blow lands, you do not fall — you fade. For one terrible heartbeat you exist in the space between moments, suspended in the void that made you, watching your own body crumple like a discarded coat. Then you are back, gasping, your flesh reknit by the cold emptiness that lives in your marrow. But the void is not generous. It keeps what it touches. Each visitation thins you. Your veins run colder. Your skin grows more translucent. One day, there will not be enough of you left to return.',
                        level: 1,
                        icon: 'spell_shadow_abominationexplosion',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'triggeredEffect',
                            effects: [{
                                id: 'void_phase_survival',
                                name: 'Void Phase',
                                description: 'When reduced to 0 HP, become intangible and invisible for 1 round. Return at 1 HP at start of next turn.',
                                statusEffect: { level: 'extreme', description: 'The void catches its child', trigger: 'reduced_to_0_hp', effect: 'phase_into_void', returnHP: 1 }
                            }],
                            durationValue: 1, durationType: 'turns', durationUnit: 'turns', canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [{
                                id: 'void_keeps_pieces',
                                name: 'The Void Keeps Pieces',
                                description: 'Permanently lose 2 maximum HP each time this triggers. Cumulative. Only restored by performing the Rite of Return at your ancestral crater. If maximum HP would reach 0, you do not phase — the void takes you entirely. No resurrection possible.',
                                statusEffect: {
                                    level: 'extreme',
                                    description: 'The void thins you with each visitation',
                                    penaltyType: 'permanent',
                                    effect: 'reduce_max_hp',
                                    magnitude: 2,
                                    stacking: 'cumulative',
                                    restoreCondition: 'ancestral_crater_rite_of_return',
                                    deathCondition: 'max_hp_0_permadeath'
                                }
                            }],
                            targetRestriction: 'self'
                        },
                        cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, mana: 0, components: [] }
                    },
                    {
                        id: 'void_blighted_flesh_astren',
                        name: 'Void-Blighted Flesh',
                        description: 'Your body is no longer entirely mortal. The void has colonized your tissues — your blood runs thin as starlight, your organs pulse with cold that should not exist in living things. Terrestrial medicine cannot find purchase on flesh that remembers the emptiness between galaxies. Healing potions pass through you like water through a sieve. Bandages cannot bind wounds that are partially elsewhere. Even divine light struggles — it finds the void inside you and recoils, half its warmth swallowed by the dark that lives in your marrow. And radiant energy — pure, concentrated light — does not heal you. It unmakes you. The void-matter in your veins screams and dissolves under its touch.',
                        level: 1,
                        icon: 'spell_shadow_unholyfrenzy',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['debuff'],
                        typeConfig: { category: 'racial', isWeakness: true },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [
                                {
                                    id: 'radiant_vulnerability_voidwalker',
                                    name: 'Radiant Vulnerability',
                                    description: 'Pure light dissolves the void-matter in your veins — radiant damage is anathema to your partially-nonexistent flesh',
                                    statusEffect: { vulnerabilityType: 'radiant', vulnerabilityPercent: 100 }
                                },
                                {
                                    id: 'void_healing_rejection',
                                    name: 'Void Healing Rejection',
                                    description: 'Non-magical healing has no effect. Divine/holy healing is halved. Your flesh is partially void-matter — terrestrial medicine cannot find purchase.',
                                    statusEffect: {
                                        level: 'extreme',
                                        description: 'The void rejects terrestrial healing',
                                        penaltyType: 'healing_reduction',
                                        nonMagicalHealing: 'none',
                                        divineHealing: 'halved',
                                        reason: 'Void-colonized flesh rejects mortal medicine'
                                    }
                                }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, mana: 0, components: [] }
                    },
                    {
                        id: 'hollow_soul_astren',
                        name: 'Hollow Soul',
                        description: 'The void hollowed out the part of you that feels hope. Charm rolls off you like rain on grave-stones — the void showed you what true emptiness looks like, and mortal manipulation feels like children whispering in a hurricane. Fear cannot grip what has already stared into the endless dark. But the price is absolute. You cannot feel inspiration. Bardic songs wash over you like noise. Rallying cries land on ears that hear only cosmic silence. And when you speak to others, your voice carries harmonic undertones from frequencies that should not exist — your expressions are wrong, your smile arrives three seconds too late, your tears look like performance. They do not trust you. They cannot trust you. You are a mask wearing a person.',
                        level: 1,
                        icon: 'spell_shadow_antimagicshell',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'statusEffectBuff',
                            effects: [
                                {
                                    id: 'hollow_charm_immune',
                                    name: 'Charm Immunity',
                                    description: 'Immune to charm effects — the void showed you true emptiness; mortal manipulation is trivial',
                                    statusEffect: { level: 'extreme', description: 'Immune to charm', immunity: ['charm'] }
                                },
                                {
                                    id: 'hollow_fear_resist',
                                    name: 'Fear Resistance',
                                    description: 'Advantage on saving throws against fear — you have already seen the worst thing that exists',
                                    statusEffect: { level: 'moderate', description: 'Advantage on fear saves' }
                                }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'cannot_inspire',
                                    name: 'Hollow Heart',
                                    description: 'Cannot benefit from Bardic Inspiration, morale effects, or any ability that improves your emotional state. The void ate that part of you.',
                                    statusEffect: {
                                        level: 'major',
                                        description: 'The void hollowed your capacity for hope',
                                        immunity: ['bardic_inspiration', 'morale_effects', 'emotional_buffs']
                                    }
                                },
                                {
                                    id: 'alien_demeanor_astren',
                                    name: 'Alien Demeanor',
                                    description: 'Disadvantage on all Persuasion and Deception checks with non-Astren — your voice carries void harmonics, your expressions arrive wrong',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Void-touched presence unsettles non-Astren',
                                        penaltyType: 'social',
                                        affectedSkills: ['persuasion', 'deception'],
                                        magnitude: 'disadvantage',
                                        conditions: ['non_astren']
                                    }
                                }
                            ],
                            targetRestriction: 'self'
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, mana: 0, components: [] }
                    }
                ]
            },
            sunborn: {
                id: 'sunborn_astren',
                name: 'Sunbound',
                description: 'Warm where other Astren are cold, skin faintly luminous like embers buried in ash. Eyes burn with inner fire — gold and orange, pupils like tiny suns that leave afterimages when they blink. Hair moves as if in solar wind even indoors. Touch radiates gentle warmth. When emotional, their skin crackles with faint coronas. They smell of ozone and distant fire. The constellations on their skin glow warmer — silver lines that pulse with heat rather than cold. Impossible to fully conceal. They glow. Sun-worshipping cults hunt them. Shadow-worshipping cults fear them.',
                culturalBackground: 'The Sunbound trace their lineage to Astren who carried the fire of dying suns within their fall to earth. Bloodline marked by the stellar flame that burns in their veins. They learn to channel solar energy, to wield the fire that once lit a star. Their warmth makes them the most approachable of the Astren, but their emotions burn hotter — anger can ignite, grief can scorch. But the stellar fire consumes them — they must rest in darkness to avoid burning out completely.',
                statModifiers: { charisma: 3, spirit: 2, strength: 1, constitution: -1 },
                baseStats: { health: 8, mana: 4, actionPoints: 3, initiative: 1 },
                savingThrowModifiers: { advantage: ['stun', 'fear'], disadvantage: ['necrotic'] },
                traits: [
                    {
                        id: 'stellar_radiance_astren',
                        name: 'Stellar Radiance',
                        description: 'You emit a pulse of solar fire — the dying star within you refuses to go quiet. Light erupts from the silver constellation-lines beneath your skin, searing everything nearby in a wash of stellar radiance. The fire does not discriminate. It does not know friend from foe. It only knows it is dying, and it screams. Your allies burn. You burn. The stellar fire consumes because that is what stars do.',
                        level: 1,
                        icon: 'spell_holy_innerfire',
                        spellType: 'ACTION',
                        actionPoints: 1,
                        components: ['verbal', 'somatic'],
                        effectTypes: ['damage'],
                        typeConfig: { category: 'racial', school: 'radiant' },
                        damageConfig: {
                            damageTypes: ['radiant'],
                            formula: '2d6',
                            resolution: 'DICE',
                            hitsAllies: true,
                            selfDamage: { formula: '1d4', type: 'radiant' }
                        },
                        targetingConfig: { targetingType: 'area', rangeType: 'self_centered', aoeSize: 10 },
                        cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 1, mana: 0, components: [] }
                    },
                    {
                        id: 'solar_circulation_astren',
                        name: 'Solar Circulation',
                        description: 'The stellar fire in your veins is not merely destructive — it is the warmth of a star that once sustained worlds. When you stand in direct sunlight, that ancient warmth remembers what it was, and it mends you. Your skin glows brighter as the cuts close, the bruises fade. But the fire is a miser. It abandons you the moment you are truly wounded — retreating to your core to protect what remains. Below half your strength, the warmth will not come. It knows you are dying and it hoards itself.',
                        level: 1,
                        icon: 'spell_holy_renew',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['healing', 'buff'],
                        typeConfig: { category: 'racial' },
                        healingConfig: {
                            healingType: 'hot',
                            formula: '1d4',
                            tickInterval: 1,
                            duration: 'while in direct sunlight and above 50% HP',
                            hpThreshold: { percent: 50, behavior: 'ceases_below' },
                            environmentalCondition: 'direct_sunlight',
                            failsConditions: ['overcast', 'underground', 'indoors', 'night']
                        },
                        buffConfig: {
                            buffType: 'damageMitigation',
                            effects: [{
                                id: 'solar_fortitude_armor',
                                name: 'Solar Fortitude',
                                description: '+1 Armor while in direct sunlight — stellar fire hardens your skin to living glass',
                                statModifier: { stat: 'armor', magnitude: 1, magnitudeType: 'flat' },
                                condition: 'direct_sunlight'
                            }],
                            durationValue: 0, durationType: 'conditional', durationUnit: 'permanent', canBeDispelled: false
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, mana: 0, components: [] }
                    },
                    {
                        id: 'solar_collapse_astren',
                        name: 'Solar Collapse',
                        description: 'You can smother your own stellar fire — press it down into the hollow of your chest like a hand over a candle flame. For a time, you become cold. Dark. The silver lines on your skin go dormant. You stop glowing. The warmth dies. It is relief and it is terror — you feel what your Void Walker cousins feel every moment of their lives, and it is unbearable. But in the dark, you can hide. Necrotic energy no longer finds purchase on your stellar flesh. The shadows accept you. When the fire inevitably reignites — and it always reignites — the eruption cooks you from within. Your skin cracks like drought-earth, light bleeding through the fissures.',
                        level: 1,
                        icon: 'spell_fire_selfdestruct',
                        spellType: 'ACTION',
                        actionPoints: 1,
                        components: ['verbal', 'somatic'],
                        effectTypes: ['transformation', 'buff', 'debuff'],
                        typeConfig: { category: 'racial' },
                        transformationConfig: {
                            transformationType: 'suppression',
                            targetType: 'self',
                            duration: 1,
                            durationUnit: 'minutes',
                            power: 'moderate',
                            specialEffects: ['extinguish_inner_fire', 'gain_stealth', 'gain_necrotic_immunity', 'lose_solar_benefits', 'gain_cold_vulnerability']
                        },
                        buffConfig: {
                            buffType: 'combatAdvantage',
                            effects: [
                                {
                                    id: 'solar_collapse_stealth',
                                    name: 'Darkened Form',
                                    description: 'Advantage on all Stealth checks — your stellar fire is suppressed, you emit no light',
                                    statusEffect: { level: 'moderate', description: 'The shadows accept you' }
                                },
                                {
                                    id: 'solar_collapse_necrotic_immune',
                                    name: 'Necrotic Immunity',
                                    description: 'Immune to necrotic damage while collapsed — the void and the dark are kin, and they do not harm their own',
                                    statusEffect: { level: 'extreme', description: 'Necrotic immunity', immunity: ['necrotic'] }
                                }
                            ],
                            durationValue: 1, durationType: 'minutes', durationUnit: 'minutes', canBeDispelled: true
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'solar_collapse_cold_weak',
                                    name: 'Cold Vulnerability',
                                    description: 'Vulnerability to cold damage (100%) while collapsed — without your inner fire, you are merely flesh',
                                    statusEffect: { vulnerabilityType: 'cold', vulnerabilityPercent: 100, duration: 'while_collapsed' }
                                },
                                {
                                    id: 'solar_collapse_reignition',
                                    name: 'Reignition',
                                    description: 'When Solar Collapse ends, DC 14 Constitution save or gain 1 exhaustion level — your stellar fire violently reignites, cracking skin like drought-earth',
                                    statusEffect: {
                                        level: 'major',
                                        description: 'The fire erupts from within',
                                        savingThrow: { stat: 'constitution', dc: 14, failureEffect: 'exhaustion_level_1' }
                                    }
                                }
                            ],
                            targetRestriction: 'self'
                        },
                        cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 1, mana: 0, components: [] }
                    },
                    {
                        id: 'beacon_in_the_dark_astren',
                        name: 'Beacon in the Dark',
                        description: 'You emit faint light in a 5-foot radius. Enemies within this light cannot benefit from the Hidden condition. Once per long rest, you can expand this radius to 30 feet for 1 hour — but while expanded, you cannot succeed on any Stealth check above DC 10 and cannot benefit from magical invisibility. Walking anti-stealth. Walking liability.',
                        level: 1,
                        icon: 'spell_holy_auramastery',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'auraEffect',
                            effects: [{
                                id: 'anti_stealth_aura_astren',
                                name: 'Anti-Stealth Aura',
                                description: 'Enemies within 5ft cannot be Hidden. Expandable to 30ft once per long rest — your radiance strips away concealment',
                                statusEffect: { level: 'moderate', description: 'Your radiance strips away concealment' }
                            }],
                            aura: { radius: 5, unit: 'ft', affects: 'enemies', expandable: { radius: 30, duration: 1, durationUnit: 'hours', usesPerRest: 1, restType: 'long' } },
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'ability_impairment',
                            effects: [{
                                id: 'beacon_stealth_penalty',
                                name: 'Living Lantern',
                                description: 'Cannot succeed on Stealth above DC 10 or benefit from invisibility while beacon is expanded — you are a walking sun, subtlety is impossible',
                                statusEffect: { level: 'major', description: 'You are a walking sun. Subtlety is impossible.' }
                            }],
                            targetRestriction: 'self'
                        },
                        cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, mana: 0, components: [] }
                    },
                    {
                        id: 'overheat_necrotic_astren',
                        name: 'Stellar Burnout',
                        description: 'Your inner fire is not a gift — it is a disease. It burns constantly, and when the world adds its own heat to yours, the results are catastrophic. Deserts become death-sentences. Volcanic regions cook you from the outside in while your dying star cooks you from the inside out. And the dark things of the world — the necrotic, the undead, the void-touched — they sense your fire and they hate it. Their touch reaches past your stellar warmth and finds the thing beneath: a star that is already dying, already fragile, already one-third extinguished. Necrotic energy snuffs you like a thumb on a wick.',
                        level: 1,
                        icon: 'spell_fire_incinerate',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['debuff'],
                        typeConfig: { category: 'racial', isWeakness: true },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [
                                {
                                    id: 'necrotic_vulnerability_sunbound',
                                    name: 'Necrotic Vulnerability',
                                    description: 'Necrotic energy snuffs your stellar fire — the dark things of the world sense your dying star and hate it',
                                    statusEffect: { vulnerabilityType: 'necrotic', vulnerabilityPercent: 100 }
                                },
                                {
                                    id: 'overheat_exhaustion',
                                    name: 'Overheat',
                                    description: 'DC 12 Constitution save at end of turn in environments above 90°F (desert, volcanic, magically heated) or gain 1 exhaustion level — internal stellar fire combined with external heat creates catastrophic overload',
                                    statusEffect: {
                                        level: 'major',
                                        description: 'Your dying star and the world\'s heat conspire to cook you alive',
                                        trigger: 'end_of_turn',
                                        condition: 'temperature_above_90F',
                                        savingThrow: { stat: 'constitution', dc: 12, failureEffect: 'exhaustion_level_1' }
                                    }
                                }
                            ],
                            durationValue: 0, durationType: 'conditional', durationUnit: 'permanent', canBeDispelled: false
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, mana: 0, components: [] }
                    }
                ]
            },
            starmapped: {
                id: 'starmapped_astren',
                name: 'Constellation',
                description: 'The silver constellation lines on their skin are the most pronounced — bright, shifting patterns that rearrange nightly to match the sky above. Eyes reflect whatever constellations are currently visible, even indoors. They mutter constantly — readings, prophecies, star-signs that make no sense. They move with purpose driven by unseen forces. Their presence makes you feel watched by distant stars. Town guards detain them as madmen. Their bodies are frail vessels for cosmic maps.',
                culturalBackground: 'The Constellations trace their lineage to Astren who mapped the patterns written in stars during their fall. Bloodline marked by the ability to read fate in the arrangement of celestial bodies. They learn to interpret the patterns — in skin, in stars, in the geometry of events. Their minds fracture under cosmic truths, seeing futures that have not happened, remembering lives never lived. They serve as seers, astrologers, and fate-readers. But the patterns are not always clear, and sometimes the reading drives the reader mad.',
                statModifiers: { intelligence: 3, spirit: 3, wisdom: 1, constitution: -1, strength: -1 },
                baseStats: { health: 3, mana: 6, actionPoints: 2, initiative: -2 },
                savingThrowModifiers: { advantage: ['charm'], disadvantage: ['psychic'] },
                traits: [
                    {
                        id: 'star_reading_astren',
                        name: 'Star Reading',
                        description: 'You read the celestial patterns etched into a creature\'s fate. The constellations on your skin writhe and rearrange, mirroring the threads of destiny wrapped around your target. For three heartbeats, you see what they will do before they do it — the sword-arm tensing, the spell forming, the feet pivoting. It is not a gift. It is a wound. The knowledge tears through your mind like a blade of pure starlight, and when it passes, your nose bleeds silver and the present seems dim and muffled compared to the futures you just witnessed.',
                        level: 1,
                        icon: 'spell_holy_prophecy',
                        spellType: 'ACTION',
                        actionPoints: 1,
                        components: ['verbal', 'somatic'],
                        effectTypes: ['utility', 'debuff'],
                        typeConfig: { category: 'racial' },
                        utilityConfig: {
                            utilityType: 'divination',
                            selectedEffects: [{ id: 'enemy_intent_reveal', name: 'Read Intent', description: 'Reveal target creature\'s intended action category (Attack/Cast/Move/Ability) for 3 rounds — the GM must declare intent before the creature acts', durationRounds: 3, revealsActionCategory: true }],
                            duration: 3,
                            durationUnit: 'rounds'
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [{
                                id: 'cosmic_backlash_astren',
                                name: 'Cosmic Backlash',
                                description: 'Take 1d6 psychic damage and suffer disadvantage on next Perception check — starlight burns through your mind, the present feels dim after witnessing futures',
                                statusEffect: { level: 'moderate', description: 'Starlight burns through your mind' },
                                selfDamage: { formula: '1d6', type: 'psychic' }
                            }],
                            targetRestriction: 'self'
                        },
                        targetingConfig: { targetingType: 'single_target', rangeType: 'ranged', rangeDistance: 60, targetRestriction: 'non_mindless' },
                        cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 1, mana: 0, components: [] }
                    },
                    {
                        id: 'fates_margin_astren',
                        name: "Fate's Margin",
                        description: 'The constellations on your skin are not decoration — they are a contract with the cosmos. When fate would deal you the cruelest blow, the patterns blaze silver and the universe hesitates. A natural 1 becomes a 10. The blade glances. The spell sputters. The trap springs a half-second too late. But the cosmos does not forgive debt — it collects. Each misfortune you deflect is stored like a wound in the sky above you. The next time fate would bless you — the next perfect strike, the next miraculous dodge — the cosmos takes it back. Your critical hit becomes ordinary. Your saving grace becomes failure. Fate giveth. Fate taketh. The stars are watching, and they are keeping count.',
                        level: 1,
                        icon: 'spell_arcane_mindmastery',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'triggeredEffect',
                            effects: [{
                                id: 'fates_intervention',
                                name: "Fate's Intervention",
                                description: 'When you roll a natural 1 on any attack roll, saving throw, or ability check, treat it as a natural 10 instead. The cosmos hesitates.',
                                statusEffect: { level: 'extreme', description: 'The constellations blaze and rewrite the moment', trigger: 'natural_1', replacementValue: 10 }
                            }],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [{
                                id: 'fates_collection',
                                name: "Fate's Collection",
                                description: 'Each rewritten 1 creates a Fate Debt. The next natural 20 you roll is treated as a normal result (no critical hit, no automatic success). Debts stack — multiple rewritten 1s mean multiple stolen 20s waiting to be collected.',
                                statusEffect: {
                                    level: 'extreme',
                                    description: 'The cosmos keeps count of every deflection',
                                    penaltyType: 'fate_debt',
                                    mechanic: 'natural_20_becomes_normal',
                                    stacking: 'cumulative',
                                    trigger: 'natural_20'
                                }
                            }],
                            targetRestriction: 'self'
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, mana: 0, components: [] }
                    },
                    {
                        id: 'constellation_form_astren',
                        name: 'Constellation Form',
                        description: 'You surrender your body to the star-maps written in your flesh. Your bones dissolve into geometry. Your blood becomes light. For a span of heartbeats, you are not a person — you are a living constellation, pure pattern and radiance, untouchable as the night sky. You drift through walls and through blades and through the hands of anyone who would hold you. You cannot speak — constellations have no voices. You cannot strike — stars have no fists. You can only observe, and drift, and feel the terrible freedom of being no longer human. When the pattern collapses and your bones remember what weight is, your body screams. The marrow protests. The flesh re-knits wrong, too tight, too real.',
                        level: 1,
                        icon: 'spell_arcane_blink',
                        spellType: 'ACTION',
                        actionPoints: 1,
                        components: ['verbal', 'somatic'],
                        effectTypes: ['transformation', 'buff', 'debuff'],
                        typeConfig: { category: 'racial' },
                        transformationConfig: {
                            transformationType: 'elemental',
                            targetType: 'self',
                            duration: 1,
                            durationUnit: 'minutes',
                            power: 'major',
                            specialEffects: ['intangible', 'luminous', 'cannot_attack', 'cannot_cast', 'cannot_speak', 'cannot_interact', 'fly_30ft']
                        },
                        buffConfig: {
                            buffType: 'passive_enhancement',
                            effects: [{ id: 'starlight_form', name: 'Starlight Form', description: 'Intangible, fly 30ft, immune to non-magical physical damage', statusEffect: { level: 'major', description: 'You become made of pure starlight' } }],
                            durationValue: 1, durationType: 'minutes', durationUnit: 'minutes', canBeDispelled: true
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [{
                                id: 're_entry_shock_astren',
                                name: 'Re-entry Shock',
                                description: 'DC 14 Constitution save or gain 1 exhaustion level when form ends — your body violently rebels against returning to material form. Bones re-knit wrong. Flesh tightens too fast.',
                                statusEffect: {
                                    level: 'major',
                                    description: 'Material re-entry is violent',
                                    savingThrow: { stat: 'constitution', dc: 14, failureEffect: 'exhaustion_level_1' }
                                }
                            }],
                            targetRestriction: 'self'
                        },
                        cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 1, mana: 0, components: [] }
                    },
                    {
                        id: 'cosmic_myopia_astren',
                        name: 'Cosmic Myopia',
                        description: 'Your mind is never here. It is always reaching — reaching for the patterns behind the patterns, the geometry beneath events, the grand tapestry that connects every falling leaf to every dying star. You perceive the flow of fate like a river of silver light, vast and unending. But the sword swinging at your face? That is a detail. A footnote in the cosmic record. You see the thousand-year consequence of every action but you cannot see the cobblestone your foot is about to trip on. The present is a country you visit but do not live in. Psychic wounds are worse — they do not merely hurt you, they pull you further from the present, drowning you in cosmic noise until your body forgets to react.',
                        level: 1,
                        icon: 'spell_nature_sleep',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['debuff'],
                        typeConfig: { category: 'racial', isWeakness: true },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    id: 'cosmic_myopia_initiative',
                                    name: 'Cosmic Myopia',
                                    description: 'Disadvantage on all initiative rolls — your mind is always processing the grand tapestry while the immediate threat approaches',
                                    statusEffect: {
                                        penaltyType: 'initiative',
                                        magnitude: 'disadvantage',
                                        description: 'The present is a country you visit but do not live in'
                                    }
                                },
                                {
                                    id: 'cosmic_myopia_reaction_loss',
                                    name: 'Reactivity Loss',
                                    description: 'Whenever you take psychic damage, succeed on a DC 12 Wisdom saving throw or lose your reaction until the start of your next turn — cosmic noise drowns out the present moment',
                                    statusEffect: {
                                        level: 'moderate',
                                        description: 'Psychic wounds pull you from the present',
                                        trigger: 'psychic_damage_taken',
                                        savingThrow: { stat: 'wisdom', dc: 12, failureEffect: 'lose_reaction_until_next_turn' }
                                    }
                                }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, mana: 0, components: [] }
                    },
                    {
                        id: 'psychic_vulnerability_astren_starmapped',
                        name: 'Psychic Vulnerability',
                        description: 'Your mind is already a fracture — a stained-glass window held together by cosmic gravity and stubbornness. Every prophecy you have read, every fate-line you have traced, every future you have witnessed has left a crack. Additional psychic pressure does not merely hurt you — it collapses the structure. A telepathic whisper hits you like a cathedral bell. A mind-reading spell leaves you bleeding from the ears. The constellations on your skin flicker and scramble, the patterns going mad. Your consciousness has no walls left. It is a ruin that pretends to be a mind.',
                        level: 1,
                        icon: 'spell_shadow_psychichorrors',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['vulnerability'],
                        typeConfig: { category: 'racial', isWeakness: true },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [{
                                id: 'psychic_vulnerability',
                                name: 'Psychic Vulnerability',
                                description: 'Your fractured mind cannot withstand additional psychic pressure — every prophecy has left a crack, and your consciousness is a ruin that pretends to be a mind',
                                statusEffect: { vulnerabilityType: 'psychic', vulnerabilityPercent: 100 }
                            }],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, mana: 0, components: [] }
                    }
                ]
            }
        }
    };
