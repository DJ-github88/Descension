export const corvani = {
    id: 'corvani',
    name: 'Corvani',
    essence: 'The Raven-Marked',
    illustration: '/assets/images/races/corvani_illustration.png',
    illustrationCaption: 'A Corvani scout perched on a basalt crag in the Frostwood highlands, raven-black markings shifting across their forearms.',
    cardFlavor: 'Highland seer-scouts bound to the Corvid Fate-Spirits, carrying destiny on raven wings.',
    description: `**[The Raven-Marked Seers]** — *Perched on a razor-thin basalt ledge high in the Frostwood peaks, a Corvani scout narrows eyes of pure obsidian, a feather-pattern of black ink shifting along their collarbone as a spectral raven dissolves into the freezing wind.*

There were those who refused the Volcanic bargains of Sundale and the glacier stasis of Nordhalla, but did not flee into the fae deep. The ancestors of the Corvani chose the highest, coldest ridges of the Frostwood Reach — a vertical world of basalt spires and screaming gales. To survive the memory-erasing fog creeping up from the valleys, they struck a bargain not with Keth-Amar, but with the ancient Corvid Fate-Spirits. In exchange for absolute memory and the sight to read shifting destinies, they accepted the spirits' mark. The Corvani are their heirs: a people whose skin carries shifting, raven-feather markings and whose eyes hold the dark reflection of multiple futures.`,
    icon: 'fas fa-crow',
    overview: `The Corvani are the highland survivors of the Frostwood Reach, dwelling in stone-carved eyries above the tree line where the memory-stealing fog cannot easily pool. Refusing to march their children to Keth-Amar's sacrifice or bow to the noble houses, their ancestors chose the freezing isolation of the peaks. But isolation alone could not protect them from the slow, creeping rot of the sunless world.

In the highest basalt spires, where the wind sings in polyphonic overtones and the boundary between the mortal coil and the spirit realm is thin as ice, they found the Corvid Fate-Spirits — ancient, multi-eyed entities of shadow and premonition. The spirits offered them sanctuary and clarity: their memories would remain anchored, untouched by the valley's fog, and their seers would read the threads of destiny before they tangled. The price was written in their flesh: raven-black markings that shift across their limbs like shadows, obsidian-dark eyes that cannot bear the direct glare of forge-fire, and the constant, whispering presence of the flock in their minds.

Divided into the devout Oracles who guide the eyries from the high temples and the agile Scouts who patrol the mountain passes, Corvani society is built around the preservation of memory and the navigation of premonition. They do not fear the dark; they fear the moment they stop seeing what lies within it.`,

    culturalBackground: `Corvani society is organized around the Eyries — vertical stone settlements carved directly into the sheer basalt cliffs of the Frostwood highlands. Connected by narrow suspension bridges and rope ladders, these cities are designed to be inaccessible to any race lacking their specialized climbing training or spiritual navigation. The highest structure in every Eyrie is the Scriptorium of the Flock, where their history is recorded in elaborate feather-ink tapestries and memory-crystals.

Their culture is obsessed with memory. Because they live adjacent to the valley fog, the Corvani treat forgetfulness as a disease. A Corvani child is taught to memorize their entire genealogy, the history of their Eyrie, and the details of every promise they make before they are allowed to leave the settlement. To forget a name is a social embarrassment; to forget a debt is a crime that can lead to exile.

The Shifting Markings on their skin are biological registers of their fate-bonds. These markings, resembling dark raven feathers or geometric shadow-patterns, migrate across their forearms, neck, and shoulders. When a Corvani is close to fulfilling a destiny or facing a fatal path, the markings grow dark and warm, aligning in complex patterns that their elders can read like text. This has created a society where choice is constantly weighed against premonition — a Corvani rarely acts without consulting the patterns, leading outsiders to view them as paralyzed by superstition.

The Oracles serve as the spiritual and political guides of the Eyries. They interpret the shifting markings of the young, sing the premonitions to the council, and commune directly with the Corvid Fate-Spirits. The Scouts are the protectors and eyes of the mountain passes. They range the freezing crags, monitor the valley borders for Wyrd-horrors, and guide caravans through the treacherous wind-gaps in exchange for grain, salt, and cold-iron tools.

Their relationship with the Briaran is one of cautious, mutual respect. Both races refused Keth-Amar's bargain, and both carry the physical marks of their refusal in their flesh. But while the Briaran's thorns are contracts of fae debt, the Corvani's markings are bonds of fate-sight. They trade information and shelter in the deep woods, but neither fully trusts the other's patron.`,

    variantDiversity: `The Corvani are divided by their calling and the nature of their bond with the spirits: the Oracles, who accept the heavy mental burden of fate-sight to guide the Eyries; and the Scouts, who use the spirits' agility and navigation to patrol the peaks.`,

    integrationNotes: {
        actionPointSystem: 'Corvani abilities focus on fate-prediction, memory preservation, and mountain navigation. Their shifting markings provide premonitive bonuses at the cost of vulnerability to psychic feedback.',
        backgroundSynergy: 'Corvani excel in backgrounds emphasizing high mountain survival, memory-keeping, premonitive guidance, and aerial scouting.',
        classCompatibility: 'Oracles make natural Fate Weavers, Oracles, and Chronarchs because their deep bond with the fate-spirits allows them to twist probability and read time, while Scouts favor Huntresses, Wardens, and Bladedancers, utilizing their high-altitude agility and mist-walking to defend the passes.'
    },

    meaningfulTradeoffs: 'Corvani possess fate-sight and mountain agility, but their obsidian eyes are sensitive to intense light, and their open connection to the Corvid Spirits makes them highly vulnerable to psychic feedback when their predictions fail.',

    baseTraits: {
        languages: ['Common', 'Corvid-Speech'],
        lifespan: '150-220 years',
        baseSpeed: 30,
        size: 'Medium',
        height: '1.68m - 1.88m (168 - 188 cm)',
        weight: '110-160 lbs',
        build: 'Lean, light-boned, with shifting raven-feather markings on their skin and obsidian-dark eyes.'
    },

    sharedTraits: [
        {
            id: 'fate_spun_markings_corvani',
            name: 'Fate-Spun Markings',
            description: 'Shifting, raven-feather markings migrate across your skin, darkening and warming in the presence of pivotal choices. You gain advantage on Insight checks as you read the subtle destiny-vibrations in others. However, the fate-lines are rigid: if you attempt to deceive someone about their future or break a sworn prophecy, your markings flush a painful, visible crimson, giving you disadvantage on all Deception checks for 24 hours.',
            level: 1,
            icon: 'spell_shadow_darksummoning',
            spellType: 'PASSIVE',
            effectTypes: ['buff', 'debuff'],
            typeConfig: { school: 'shadow', icon: 'spell_shadow_darksummoning', tags: ['markings', 'insight', 'deception-penalty', 'passive', 'shared'] },
            buffConfig: {
                buffType: 'custom',
                effects: [
                    {
                        id: 'fate_insight',
                        name: 'Fate-Insight',
                        description: '+2 to Insight checks to read the intentions and immediate path of others.',
                        statModifier: { stat: 'insight', magnitude: 2, magnitudeType: 'flat' }
                    }
                ],
                durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
            },
            debuffConfig: {
                debuffType: 'statusEffect',
                effects: [
                    {
                        id: 'prophecy_betrayal',
                        name: 'Fate-Betrayed',
                        description: 'Disadvantage on Deception checks when lying about someone\'s destiny or after breaking a vow. Your markings glow crimson with spiritual shame.',
                        statModifier: { stat: 'deception', magnitude: -99, magnitudeType: 'disadvantage' }
                    }
                ],
                durationValue: 24, durationType: 'timed', durationUnit: 'hours', canBeDispelled: false
            },
            targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
            resourceCost: { actionPoints: 0, mana: 0, components: [] },
            cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
        },
        {
            id: 'corvid_eyes_corvani',
            name: 'Corvid Eyes',
            description: 'Your eyes are pools of solid, glassy obsidian, adapted to the dim starlight of the high peaks. You gain darkvision out to 60 feet. However, your eyes cannot filter intense glare: you have disadvantage on Perception checks and attack rolls when in direct, bright sunlight, volcanic caldera glare, or the immediate radius of forge-fire.',
            level: 1,
            icon: 'spell_shadow_shadowvision',
            spellType: 'PASSIVE',
            effectTypes: ['buff', 'debuff'],
            typeConfig: { school: 'shadow', icon: 'spell_shadow_shadowvision', tags: ['darkvision', 'light-sensitivity', 'passive', 'shared'] },
            buffConfig: {
                buffType: 'custom',
                effects: [
                    {
                        id: 'highland_darkvision',
                        name: 'Highland Darkvision',
                        description: 'See in dim light and darkness out to 60 feet.',
                        statModifier: { stat: 'darkvision', magnitude: 60, magnitudeType: 'flat' }
                    }
                ],
                durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
            },
            debuffConfig: {
                debuffType: 'statusEffect',
                effects: [
                    {
                        id: 'glare_blindness',
                        name: 'Glare Sensitivity',
                        description: 'Disadvantage on attack rolls and Perception checks in bright sunlight or intense forge-glare.',
                        statModifier: { stat: 'perception', magnitude: -99, magnitudeType: 'disadvantage', conditions: { brightLight: true } }
                    }
                ],
                durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
            },
            targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
            resourceCost: { actionPoints: 0, mana: 0, components: [] },
            cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
        }
    ],

    epicHistory: `
The Corvani did not choose the high peaks; they chose the refusal. When the six noble houses marched their heirs to the northern peaks to seal the dark bargain with Keth-Amar, the clans of the high Frostwood ridges watched the sky go dark and swore they would never pay that debt. Led by the seer-matriarch Vaelia, they gathered their families and climbed into the lightless basalt spires of the northern range, leaving the valley cities to their ash and compromises.

But survival in the sunless highlands was a slow war against entropy. The memory-stealing fog of the Frostwood Reach began to creep up the canyons, threatening to erase their past and dismantle their identity. Desperate to preserve their history, Vaelia climbed the highest spire, the Apex of the Flock, and fasted for seven days until the Corvid Fate-Spirits descended — shadow-winged entities who had watched the starless void since the first ignition.

The bargain was struck: the spirits would weave themselves into the highland bloodlines, anchoring their memories against the fog and granting them the sight to read the threads of destiny. In return, the Corvani would serve as the spirits' eyes in the physical world, maintaining their scriptoriums and bearing their shifting markings. The Eyries were founded in the centuries that followed, carved into the sheer stone faces where the fog could not reach, standing as silent, obsidian-eyed sentinels above a dying world.
    `,

    notableFigures: [
        {
            name: 'Vaelia the First-Marked',
            title: 'The Seer-Matriarch',
            portraitIcon: 'Armor/Head/head-split-dual-face-helmet',
            backstory: `
Vaelia was the seer who led the highland clans during the Great Binding. While the noble families bargained with Keth-Amar, Vaelia saw the true cost of their capitulation and ordered the climb to the basalt spires. She was the one who negotiated the fate-bond with the Corvid Spirits, offering her own flesh to receive the first shifting marking. She lived to be two hundred and ten, writing the first memory-tapestry of the Eyries, and when she died, her spirit-passenger divided itself among her three apprentices, establishing the first Oracle lineages of the council.
            `
        },
        {
            name: 'Kael the Wind-Patroller',
            title: 'The First Scout',
            portraitIcon: 'Armor/Head/head-hooded-helmet',
            backstory: `
Kael was a scout of the third century who mapped the first safe paths through the Frostwood wind-gaps. When a Wyrd-manifestation threatened the lower Eyries, Kael used the Mist-Walker technique to carry a warning through the freezing blizzard, losing his left foot to frostbite but saving three thousand lives. The Scouts of the passes still sing his name during the winter gales, carrying cold-iron spurs shaped like raven talons in his honor.
            `
        }
    ],

    majorLocations: [
        {
            name: 'The Scriptorium of the Flock',
            description: `The highest temple in the capital Eyrie of Corva-Tor. Suspended between two basalt spires by massive ironwood cables, the Scriptorium houses the memory-tapestries of the entire race. Here, the Oracles translate the shifting markings of the young into written history, preserving their past from the creeping fog below.`
        },
        {
            name: 'The Apex of the Flock',
            description: `A wind-swept, lightless spire at the northernmost point of the range where the first fate-bond was sealed. Only the high-born Oracles are permitted to climb the Apex, where the wind sings in complex overtones and the shadow-spirits still manifest in the freezing mist.`
        }
    ],

    currentCrisis: `The oldest memory-crystals in the Scriptorium are beginning to cloud, the preserved recollections of the First Binding fading into grey static. The Oracles whisper that the fate-spirits themselves are growing weak, their connection to the mortal realm frayed by the dimming of the Solbrand. As the patterns on the young grow increasingly erratic, predicting a catastrophic shattering of the mountain passes, a radical faction of Scouts demands the Eyries open their gates to the valley refugees, while the traditionalists prepare to seal the spires completely.`,

    culturalPractices: `
The Remembrance is the central ritual of Corvani life. Once every season, each family gathers in the Scriptorium to recite their lineage and verify their memory-tapestries, ensuring that no name has been lost to the fog. Any member who shows signs of forgetfulness is placed under the care of the Oracles, who use memory-glass therapy to restore the fading paths.

The Fate-Reading occurs at adolescence, when a Corvani's markings first begin to migrate. The child is brought before the high Oracles at the Scriptorium, who read the pattern's drift to determine their calling — Oracle or Scout. To resist the reading is to invite the markings to dig in, hardening into black, mineral scars that sever the connection to the spirits and leave the child Unlit.
    `,

    birthrightQuestions: {
        description: 'At character creation, choose whose premonition you carry — the whisper of a future path that has not yet occurred but shapes your markings and the fate you still owe.',
        prompts: [
            {
                id: 'the_shattered_spire',
                name: 'The Shattered Spire',
                question: 'Your markings predict a fall from a great height — a vision of cold stone, screaming wind, and a snapping cable. You have lived your whole life with this shadow, and your patterns cluster tightly around your ankles. Choose: how do you try to prevent this fate? Once per session, when you take falling damage, you may reduce the damage by half as the spirit adjusts your gravity. But each time you do, your markings creep a fraction of an inch toward your throat.'
            },
            {
                id: 'the_silent_flock',
                name: 'The Silent Flock',
                question: 'Your markings predict the death of your spirit-passenger — a moment of sudden, absolute silence in your mind where the whisper has always been. You carry this fear like a physical weight, and your patterns cluster near your ears. Choose: what will you do if the whisper goes quiet? You have advantage on saving throws against psychic damage. But when you enter an area of total magical silence, you must make a Spirit save or be stunned for 1 round by the sudden emptiness.'
            }
        ]
    },

    subraces: {
        oracle: {
            id: 'oracle_corvani',
            name: 'Oracle',
            illustration: '/assets/images/races/corvani_oracle.png',
            illustrationCaption: 'A Corvani Oracle in heavy robes, reading fate patterns on their palms.',
            tooltipSummary: 'Fate-bound seers who carry Corvid Fate-Spirit prophecy in their raven-marked flesh, reading destiny in feather and wind.',
            description: `The spiritual guides of the Eyries. Their markings are dense and intricate, tracing complex geometric paths across their temples, neck, and hands. They accept the heavy mental burden of fate-sight, listening to the constant whispering of the flock to read the threads of destiny. Their skin is pale and translucent, and their eyes are deep pools of obsidian that reflect the dim starlight. They are the keepers of the memory-tapestries and the voices of the council.`,
            culturalBackground: `Oracles are trained in the Scriptoriums from early childhood, learning to interpret the shifting markings of their kin and tune their minds to the Corvid Spirits. They live in the highest chambers of the Eyries, closest to the spires, and rarely descend to the valley floor.`,
            statModifiers: { strength: -1, agility: 1, intelligence: 2, spirit: 3, charisma: 1 },
            traits: [
                {
                    id: 'prophetic_vision_oracle',
                    name: 'Prophetic Vision',
                    description: 'As an action, focus your fate-sight on a creature you can see within 30 feet. Predict their immediate fate: choose either "Success" or "Failure" for their next D20 roll. The target gains either a +3 bonus (if you predicted Success) or a -3 penalty (if you predicted Failure) on their next roll. If your prediction is correct, the spirit rewards you with 1 Action Point. If it fails, the psychic feedback deals 2d6 psychic damage to you.',
                    level: 1,
                    icon: 'spell_holy_mindvision',
                    spellType: 'ACTION',
                    effectTypes: ['buff', 'debuff', 'damage'],
                    typeConfig: { school: 'spirit', icon: 'spell_holy_mindvision', tags: ['fate', 'prediction', 'buff', 'debuff', 'active'] },
                    targetingConfig: { targetingType: 'single', rangeType: 'distance', rangeDistance: 30 },
                    resourceCost: { actionPoints: 1, mana: 2, components: [] },
                    cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 }
                },
                {
                    id: 'raven_sight_oracle',
                    name: 'Raven Sight',
                    description: 'Your obsidian eyes see the hidden paths of light and shadow. You gain advantage on Perception checks and darkvision out to 90 feet. However, your open connection to the spirits makes your immune system fragile: you have disadvantage on saving throws against diseases and poison.',
                    level: 1,
                    icon: 'spell_shadow_shadowvision',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff', 'debuff'],
                    typeConfig: { school: 'shadow', icon: 'spell_shadow_shadowvision', tags: ['perception', 'darkvision', 'disease-vulnerability', 'passive'] },
                    buffConfig: {
                        buffType: 'custom',
                        effects: [
                            { id: 'perception_bonus', name: 'Raven-Sight Perception', description: 'Advantage on Perception checks.', statModifier: { stat: 'perception', magnitude: 1, magnitudeType: 'advantage' } },
                            { id: 'enhanced_darkvision', name: 'Deep Darkvision', description: 'See in darkness out to 90 feet.', statModifier: { stat: 'darkvision', magnitude: 90, magnitudeType: 'flat' } }
                        ],
                        durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'statusEffect',
                        effects: [
                            { id: 'disease_vulnerability', name: 'Fragile Vessel', description: 'Disadvantage on saving throws against disease and poison.', statusEffect: { penaltyType: 'save_disadvantage', affectedSaves: ['disease', 'poison'] } }
                        ],
                        durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                    resourceCost: { actionPoints: 0, mana: 0, components: [] },
                    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                },
                {
                    id: 'fates_warning_oracle',
                    name: 'Fate\'s Warning',
                    description: 'When an ally within 30 feet fails a saving throw, you can use your reaction to twist destiny. Roll a d4 and add the result to their saving throw, potentially turning the failure into a success. However, you take psychic damage equal to double the roll as the fate-lines snap against your mind.',
                    level: 1,
                    icon: 'spell_holy_powerwordshield',
                    spellType: 'REACTION',
                    effectTypes: ['buff', 'damage'],
                    typeConfig: { school: 'spirit', icon: 'spell_holy_powerwordshield', tags: ['fate', 'save-booster', 'psychic-feedback', 'reaction'] },
                    targetingConfig: { targetingType: 'single', rangeType: 'distance', rangeDistance: 30 },
                    resourceCost: { actionPoints: 0, mana: 0, components: [] },
                    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                }
            ],
            baseStats: { hp: 18, mana: 15, ap: 3, initiative: 1, darkvision: 90 },
            savingThrowModifiers: { advantage: ['mind_control', 'fear'], disadvantage: ['disease', 'poison'] }
        },
        scout: {
            id: 'scout_corvani',
            name: 'Scout',
            illustration: '/assets/images/races/corvani_scout.png',
            illustrationCaption: 'A Corvani Scout perched on a mountain pass, wind blowing their feather-marked cloak.',
            tooltipSummary: 'Highland pathfinders who navigate mist and mountain by raven instinct, delivering messages between flocks no road could reach.',
            description: `The eyes and ears of the highland passes. Their markings are streamlined, running along their outer limbs, back, and calves like wings of shadow. They use the spirits' agility to traverse the sheer basalt cliffs, guiding caravans and monitoring the borders. They are wiry, light-boned, and incredibly swift, their movements fluid as a shadow crossing the snow.`,
            culturalBackground: `Scouts spend their lives in the mountain passes and high ranges, training in high-altitude survival and vertical climbing. They are the trade-connectors and rangers of the Corvani people, frequently interacting with other races.`,
            statModifiers: { constitution: 1, agility: 3, intelligence: 1, spirit: 1 },
            traits: [
                {
                    id: 'highland_navigation_scout',
                    name: 'Highland Navigation',
                    description: 'Your light bones and mountain training make you a master of vertical terrain. You ignore difficult terrain on slopes, cliffs, and snowy ridges. Additionally, you gain a +2 bonus to Athletics and Survival checks made in high-altitude environments.',
                    level: 1,
                    icon: 'ability_druid_dash',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff', 'utility'],
                    typeConfig: { school: 'physical', icon: 'ability_druid_dash', tags: ['movement', 'mountain', 'athletics', 'passive'] },
                    buffConfig: {
                        buffType: 'custom',
                        effects: [
                            { id: 'mountain_athletics', name: 'Mountain Athletics', description: '+2 to Athletics and Survival checks in highlands.', statModifier: { stat: 'athletics', magnitude: 2, magnitudeType: 'flat', conditions: { altitudeHigh: true } } }
                        ],
                        durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                    resourceCost: { actionPoints: 0, mana: 0, components: [] },
                    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                },
                {
                    id: 'raven_messenger_scout',
                    name: 'Raven Messenger',
                    description: 'As an action, summon a spectral raven from your markings. The raven is invisible to non-Corvani and can travel up to 5 miles to deliver a spoken message of up to 20 words to a target you designate, returning with their reply if they speak one. The raven dissolves after 1 hour or when the message is delivered. Once per short rest.',
                    level: 1,
                    icon: 'spell_shadow_darksummoning',
                    spellType: 'ACTION',
                    effectTypes: ['utility'],
                    typeConfig: { school: 'shadow', icon: 'spell_shadow_darksummoning', tags: ['summon', 'messenger', 'utility', 'active'] },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                    resourceCost: { actionPoints: 1, mana: 1, components: [] },
                    cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 }
                },
                {
                    id: 'mist_walker_scout',
                    name: 'Mist Walker',
                    description: 'As an action, dissolve your physical form into shifting shadow-mist for 1 round. While in mist form, you gain resistance to all non-magical physical damage and can move through spaces as small as 1 inch. However, your solar-refusing nature is exposed: you take double damage from radiant sources, and if you end your turn inside a solid object, you take 3d6 force damage and are ejected to the nearest open space.',
                    level: 1,
                    icon: 'spell_shadow_shadowward',
                    spellType: 'ACTION',
                    effectTypes: ['buff', 'debuff', 'utility'],
                    typeConfig: { school: 'shadow', icon: 'spell_shadow_shadowward', tags: ['mist-form', 'incorporeal', 'radiant-vulnerability', 'active'] },
                    buffConfig: {
                        buffType: 'custom',
                        effects: [
                            { id: 'mist_form_resistance', name: 'Mist-Form Resistance', description: 'Resistance to non-magical bludgeoning, piercing, and slashing damage.' }
                        ],
                        durationValue: 1, durationType: 'timed', durationUnit: 'round', canBeDispelled: true
                    },
                    debuffConfig: {
                        debuffType: 'statusEffect',
                        effects: [
                            { id: 'radiant_vulnerability_mist', name: 'Radiant Vulnerability', description: 'Take 100% more damage from radiant sources.', statusEffect: { vulnerabilityType: 'radiant', vulnerabilityPercent: 100 } }
                        ],
                        durationValue: 1, durationType: 'timed', durationUnit: 'round', canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                    resourceCost: { actionPoints: 2, mana: 2, components: [] },
                    cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1 }
                }
            ],
            baseStats: { hp: 22, mana: 8, ap: 3, initiative: 3, darkvision: 60 },
            savingThrowModifiers: { advantage: ['athletics', 'acrobatics'], disadvantage: ['radiant_effects'] }
        }
    }
};
