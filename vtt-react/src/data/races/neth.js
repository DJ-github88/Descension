export const neth = {
    id: 'neth',
    name: 'Neth',
    essence: 'The Silver-Skin Pact-Bound',
    illustration: '/assets/images/races/neth_illustration.png',
    illustrationCaption: 'A tall, silver-skinned Neth Velun in obsidian robes, holding a scroll with glowing legal bindings in the canopy groves of Atropolis.',
    description: `**[The Silver-Skin Pact-Bound]** — *Standing on the high branching bridges of Atropolis, a silver-skinned scholar with solid obsidian eyes watches the shifting peat-bogs below, her skin humming with the faint blue light of the First Contract.*

The Neth are the sunless world's most legalistic and tragic immortals. Originally a dying clan of human scribes fleeing the frozen surface centuries ago, they descended into the Bryngloom Forest and negotiated a literal, binding contract with the Keeper of the Last Threshold (the Root-Veil) for their survival. The Keeper accepted. The scribes rose from the bogs with silver skin, stilled breath, and solid black eyes, their immortality written directly into their biology. Yet, the price of this preservation was absolute: they cannot tell a direct lie. Their very existence is a lease, and their bloodlines are written in ink that never fades.`,
    icon: 'fas fa-scroll',
    overview: `We did not pray for survival. We presented a case. When the sun died and the six noble families capitulated to Keth-Amar, marching their children to the peaks, our ancestors refused to accept that death was a natural ending. We carried our ledgers, our ink-horns, and our lineage-scrolls into the deepest, oldest bogs of the Bryngloom and argued our case before the Keeper of the Last Threshold. We argued that a dead clerk records nothing, but a living archive is a monument. The Keeper agreed.

Our survival is a legally binding agreement. We are silver-skinned and stilled-breath; our lungs do not move, and our hearts beat once an hour to keep the silver ink in our veins from stagnating. We do not age, we do not decay, and we do not breathe. But we are not free. Our inability to lie is not a moral virtue; it is a biological clause. If we speak a direct falsehood, our connection to the First Contract thins, and our very physical form begins to fade into grey moss.

We are a structured people. We live in Atropolis, a magnificent canopy city of living ironwood trunks, where we govern through covenants, trade networks, and courts. We view the other races as chaotic, short-lived anomalies who squander their brief years in emotional frenzy. Yet, we need them. We trade our memory-glass and fungal-lights for cold-iron tools and surface goods. We share our forest with the Vreken, though their sentimental worship of their glowing dead is spiritually alien to our legalistic stasis. Our crisis is not of steel or ice — it is the slow accumulation of ancient, unpaid debts that are coming due, and the growing rebellion of our own leaden outcasts who chose to burn their names from the contract to be free.`,
    culturalBackground: `Neth society is structured entirely around the concept of the Contract. Under Neth law, a promise is not a social agreement; it is a physical binding. Contracts are engraved onto memory-glass tablets using glowing Ghost-Mycelium stylus-points, and every Neth carries their own ledger-tablet from adolescence. Their legal system, overseen by the Velun pact-mages, is absolute: a contract breach is punished not by imprisonment, but by legal fading — the court declares the citizen non-existent, and the Neth's silver skin slowly dulls to grey stone.

They live in Atropolis, a towering canopy city of branch-walkways and ironwood halls, suspended eighty feet above the peat-bogs of the Bryngloom. The city is quiet, clean, and governed by strict, silent protocols. They share the forest with the Vreken in an uneasy, functional silence. The Neth view the Vreken as sentimental and archaic, surrounding themselves with glowing dead ancestors, while the Vreken view the Neth as spiritually bankrupt, treating death as a transaction rather than a continuation.

The Drun represent the wound in Neth society. Legally non-existent, these leaden-skinned outcasts chose to burn their names from the First Contract. Though immune to magic, they cannot receive healing or blessings, living in the canopy-sumps as smugglers and mercenaries, a constant reminder of the physical price of Neth immortality.`,
    variantDiversity: `The Neth are divided into three distinct bloodlines, defined by their historical role in the First Contract. The Velun are the pact-lords and archivists, carrying pure-silver skin and absolute magical sensitivity. The Kessen are the weavers and merchants, reading the probability-webs of the forest floor. The Drun are the leaden outcasts, whose ancestors burned their names to escape the contract.`,
    integrationNotes: {
        actionPointSystem: 'Neth abilities focus on spell-negation, probability-manipulation, and stilled-breath resistances. Their silver skin provides unique wards but limits their ability to receive magical healing.',
        backgroundSynergy: 'Neth excel in backgrounds emphasizing law, archives, trade, and magic. Their contract-based culture creates compelling roleplay around debts, promises, and legal loopholes.',
        classCompatibility: 'Velun Neth make natural Arcanoneers, Spellguards, and Chronarchs. Kessen Neth make natural Fate Weavers, Oracles, and Gamblers. Drun Neth make natural Bladedancers, Wardens, and Covenbanes.'
    },
    meaningfulTradeoffs: 'Neth gain immunity to suffocation and advantage against deception, but their inability to lie causes physical necrotic damage if violated. Their subraces are highly specialized, carrying severe drawbacks like magic-healing immunity (Drun) or paralysis (Velun).',
    baseTraits: {
        languages: ['Common', 'Gloom-Tongue'],
        lifespan: 'Immortal (do not age or decay)',
        baseSpeed: 30,
        size: 'Medium',
        height: '5\'10" - 6\'6"',
        weight: '120-180 lbs',
        build: 'Tall, slender, silver-skinned, solid black obsidian eyes, stilled breath'
    },
    sharedTraits: [
        {
            id: 'stilled_breath_neth',
            name: 'Stilled Breath',
            description: 'Your lungs do not move, and your body does not require oxygen. You are immune to suffocation, gaseous poisons, and airborne diseases. However, your stilled physiology makes you dense and slow in water, giving you a -10 ft penalty to swim speed and disadvantage on Athletics checks made to swim or stay afloat.',
            level: 1,
            icon: 'spell_nature_gaspofwind',
            spellType: 'PASSIVE',
            effectTypes: ['buff', 'debuff'],
            typeConfig: { school: 'nature', icon: 'spell_nature_gaspofwind', tags: ['stilled-breath', 'immunity', 'passive', 'shared'] },
            buffConfig: {
                buffType: 'custom',
                effects: [
                    {
                        id: 'suffocation_immunity',
                        name: 'No Breath Required',
                        description: 'Immune to suffocation, drowning, gaseous poisons, and airborne diseases.',
                        statusEffect: { level: 'moderate', description: 'Immune to suffocation, drowning, and airborne toxins.' }
                    }
                ],
                durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
            },
            debuffConfig: {
                debuffType: 'statusEffect',
                effects: [
                    {
                        id: 'dense_physiology',
                        name: 'Leaden Weight',
                        description: '-10 ft Swim Speed, disadvantage on Athletics checks made in water.',
                        statModifier: { stat: 'swim_speed', magnitude: -10, magnitudeType: 'flat' }
                    }
                ],
                durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
            },
            targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
            resourceCost: { actionPoints: 0, mana: 0, components: [] },
            cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
        },
        {
            id: 'firstborn_covenant_neth',
            name: 'Firstborn Covenant',
            description: 'You are biologically bound to the absolute truth of the First Contract. You cannot speak a direct, intentional lie, gaining advantage on Insight checks to detect deception. However, if you are forced or magic-compelled to utter an absolute falsehood, your connection to the Contract thins, dealing 1d6 necrotic damage to your physical form.',
            level: 1,
            icon: 'spell_holy_blessingofstrength',
            spellType: 'PASSIVE',
            effectTypes: ['buff', 'debuff'],
            typeConfig: { school: 'spirit', icon: 'spell_holy_blessingofstrength', tags: ['truth-oath', 'passive', 'shared'] },
            buffConfig: {
                buffType: 'custom',
                effects: [
                    {
                        id: 'truth_insight_buff',
                        name: 'Truth-Sense',
                        description: 'Advantage on Insight checks made to detect lies or deception.',
                        statModifier: { stat: 'insight', magnitude: 1, magnitudeType: 'advantage', conditions: { detectingDeception: true } }
                    }
                ],
                durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
            },
            debuffConfig: {
                debuffType: 'statusEffect',
                effects: [
                    {
                        id: 'falsehood_backlash',
                        name: 'Pact Backlash',
                        description: 'Suffer 1d6 necrotic damage whenever you utter a direct falsehood.',
                        statusEffect: { level: 'minor', description: 'Take 1d6 necrotic damage when speaking a direct lie.' }
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
The history of the Neth is written in the legal ledgers of Atropolis. Before the sun died, our ancestors were a clan of imperial scribes and genealogists who managed the great parchment archives of the southern kingdoms. When Sol entered its Deepening and the six noble families capitulated to Keth-Amar, marching their firstborn north, our ancestors realized that the surface world was doomed. They refused to march, and they refused to freeze.

Gathering their records and parchment-rolls, they descended into the Bryngloom Forest. In the deepest, oldest bogs, they encountered the Keeper of the Last Threshold — the primordial, vegetative consciousness of the forest. While other peoples prayed or offered blood sacrifices, our ancestors presented a legal case. They argued that the Keeper\'s preservation was a contract, and that a dead forest records nothing. They drafted the First Contract, signing it in the blood of every descendant.

The Keeper accepted. The scribes were preserved, rising from the bogs with silver skin, stilled breath, and unblinking black eyes, their immortality secured at the cost of absolute truth. For eight centuries, they have maintained the Canopy-Ledger, trading memory-glass and fungal-lights with the surface world. But the ancient, unpaid debts of the noble families are coming due, and the leaden-skinned Drun who burned their names from the contract threaten to shatter Neth society from within.
    `,
    notableFigures: [
        {
            name: 'Valerius',
            title: 'The Scribe-Lord',
            portraitIcon: 'Ability/ability_druid_starfall',
            backstory: `
The legendary archivist who drafted the First Contract with the Keeper of the Last Threshold. Valerius was a high Imperial Scribe who refused to capitulate during the Deepening. He spent forty days in the deepest bogs of the Bryngloom, negotiating the legal syntax of the Contract with the Keeper, establishing the Neth's immortality at the price of stilled breath and silver skin. His original ledger-tablet is preserved in the Scriptorium.
            `
        },
        {
            name: 'Kaelen',
            title: 'The Great Weaver',
            portraitIcon: 'Ability/ability_rogue_shadowstrike',
            backstory: `
A Kessen Neth probability-weaver who mapped the trade routes of the Iceheart Sea. Kaelen was the first to realize that the probability-webs of the forest floor could be used to calculate shipping routes through the freezing foam. He founded the Kessen guilds, expanding Neth influence across Merrowport and Ironjaw Port.
            `
        }
    ],
    majorLocations: [
        {
            name: 'Atropolis',
            description: 'The magnificent canopy city of the silver-skinned Neth, constructed inside a cathedral-grove of living ironwoods coaxed into shape over a thousand years. The streets are suspended walkways of living branch and ghost-silk, lit by the pale, cold glow of memory-glass tablets.'
        },
        {
            name: 'The Scriptorium Vaults',
            description: 'The intellectual heart of Atropolis, where Velun Inscriptors carve historical genealogies onto compressed memory-glass tablets, preserving the legal records of every contract signed since the sun\'s death.'
        }
    ],
    currentCrisis: `The central crisis is the accumulation of ancient, unpaid debts. The **Drun** outcasts, who burned their names from the First Contract, have begun launching raids into Atropolis's scriptoriums, seeking to destroy the Great Ledger and erase every Neth's legal debt. Meanwhile, Vreken covens watch the borders, preparing to exploit any slip in the fungal-light trade.`,
    culturalPractices: `
Every Neth child is presented with their own personal ledger-tablet at adolescence. They are taught that a promise is a physical binding, and that a contract breach is a biological decay. The first lesson is "the ink does not fade." Neth do not swear oaths; they sign covenants.

The Fading is the central legal punishment. A citizen who breaches a contract is declared legally non-existent by the Velun courts. The Neth's silver skin slowly dulls to grey stone, and they fade into the bogs, their name struck from the Great Ledger forever.
    `,
    birthrightQuestions: {
        description: 'At character creation, choose whose unpaid contract you carry across lifetimes — the ancient covenant that remains written in your silver blood.',
        prompts: [
            {
                id: 'the_archivist',
                name: 'The Archivist\'s Debt',
                question: 'You carry the unpaid contract of a high archivist who misrecorded a family lineage to shield an innocent child from the Purge. The Keeper of the Last Threshold has flagged the error. Choose: what was the child\'s name, and what is the cost of your silence? Once per long rest, when you fail a History check, you may recall a forgotten contract clause and reroll the check with advantage — but you suffer 1d4 necrotic damage as your silver skin flakes.',
                rerollSaveType: 'history',
                cost: '1d4 necrotic damage'
            },
            {
                id: 'the_smuggler',
                name: 'The Smuggler\'s Clause',
                question: 'You carry the debt of a Kessen Neth who smuggled fungal-lights to a starving human settlement without registering the trade-tax. The ledger remains unbalanced. Choose: who was the human trader, and what did they trade in return? You have advantage on Sleight of Hand checks made to conceal small items. But when you are questioned under a legal binding, the GM may ask: does this trade balance?',
                buffOnSleightOfHand: 'advantage to conceal items',
                narrativeCost: 'GM may invoke the debt during legal questioning'
            }
        ]
    },
    subraces: {
        velun: {
            id: 'velun_neth',
            name: 'Velun',
            illustration: '/assets/images/races/velun_illustration.png',
            illustrationCaption: 'A Velun Neth pact-lord in Atropolis, their pure-silver skin shining in the twilight.',
            description: `The silver-skinned pact-lords and archivists who govern Atropolis. Carrying pure-silver skin and solid obsidian eyes, they are highly sensitive to the flow of magical contracts. They cannot lie, their biology bound to the absolute truth of the First Contract. Disproportionately represented in the high libraries and Canopy-Ledger of Atropolis.`,
            culturalBackground: `The Velun trace their bloodline directly to the Imperial Scribes who drafted the First Contract. Their tradition is legal continuity and preservation. They occupy every seat on the high courts and Scriptorium vaults, enforcing Neth law with clinical precision.`,
            statModifiers: { intelligence: 2, spirit: 2, strength: -1 },
            traits: [
                {
                    id: 'contractual_shield_velun',
                    name: 'Contractual Shield',
                    description: 'Once per short rest, when targeted by an enemy spell, you can manifest a glowing barrier of legal terms to absorb up to 3 times your level in damage. However, if the shield is broken by a single strike, the magical backlash paralyzes you for 1 round.',
                    level: 1,
                    icon: 'spell_holy_divineprotection',
                    spellType: 'ACTION',
                    effectTypes: ['buff', 'debuff'],
                    typeConfig: { school: 'arcane', icon: 'spell_holy_divineprotection', tags: ['shield', 'anti-magic', 'active'] },
                    buffConfig: {
                        buffType: 'custom',
                        effects: [
                            {
                                id: 'pact_shield_absorb',
                                name: 'Pact Shield',
                                description: 'Absorbs up to 3 times your character level in damage. Active for 1 minute.',
                                statusEffect: { level: 'moderate', description: 'Absorbs spell damage. Broken by heavy strikes.' }
                            }
                        ],
                        durationValue: 1, durationType: 'minute', durationUnit: 'minute', canBeDispelled: true
                    },
                    debuffConfig: {
                        debuffType: 'statusEffect',
                        effects: [
                            {
                                id: 'pact_shield_backlash',
                                name: 'Contractual Backlash',
                                description: 'Paralyzed for 1 round if the Contractual Shield is broken by damage.',
                                statusEffect: { level: 'major', description: 'Paralyzed for 1 round if your Contractual Shield breaks.' }
                            }
                        ],
                        durationValue: 1, durationType: 'round', durationUnit: 'round', canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                    resourceCost: { actionPoints: 1, mana: 0, components: ['somatic'] },
                    cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 }
                }
            ],
            languages: ['Common', 'Gloom-Tongue'],
            speed: 30,
            baseStats: { armor: 0, hp: 20, mana: 15, ap: 3, passivePerception: 12, swimSpeed: 10, climbSpeed: 15, visionRange: 60, darkvision: 30, initiative: 1 },
            savingThrowModifiers: { advantage: ['spirit'], disadvantage: [] }
        },
        kessen: {
            id: 'kessen_neth',
            name: 'Kessen',
            illustration: '/assets/images/races/kessen_illustration.png',
            illustrationCaption: 'A Kessen Neth probability-weaver reading the shifting threads of the forest floor.',
            description: `The probability-weavers and merchants who navigate the forest floor. They read the probability-webs of the Bryngloom bog-canopy to manipulate trade and politics. Evolving slightly darker, silver-blue skin, they are highly adaptable.`,
            culturalBackground: `The Kessen are the trade-masters and scouts of Neth society. They manage the merchant caravans along the Basalt Shyr and the floating docks of Merrowport, trading fungal-lights and memory-glass for cold-iron tools.`,
            statModifiers: { agility: 2, spirit: 2, strength: -1 },
            traits: [
                {
                    id: 'thread_weave_kessen',
                    name: 'Thread-Weave',
                    description: 'Once per short rest, as a reaction to a failed d20 check, you can weave alternative probabilities to reroll the die. However, you must accept the new roll even if it is worse, and you suffer 1d4 psychic damage from temporal friction.',
                    level: 1,
                    icon: 'spell_nature_cyclone',
                    spellType: 'ACTION',
                    effectTypes: ['buff', 'debuff'],
                    typeConfig: { school: 'nature', icon: 'spell_nature_cyclone', tags: ['probability', 'reroll', 'active'] },
                    buffConfig: {
                        buffType: 'custom',
                        effects: [
                            {
                                id: 'probability_weave_active',
                                name: 'Weave Probability',
                                description: 'Reroll a failed d20 check. Must accept the new roll.',
                                statusEffect: { level: 'minor', description: 'Reroll failed check. Accept new result.' }
                            }
                        ],
                        durationValue: 0, durationType: 'instant', durationUnit: 'instant', canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'statusEffect',
                        effects: [
                            {
                                id: 'weave_psychic_strain',
                                name: 'Temporal Friction',
                                description: 'Suffer 1d4 psychic damage from weaving alternative timelines.',
                                statusEffect: { level: 'minor', description: 'Take 1d4 psychic damage when using Thread-Weave.' }
                            }
                        ],
                        durationValue: 0, durationType: 'instant', durationUnit: 'instant', canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                    resourceCost: { actionPoints: 0, mana: 0, components: [] },
                    cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 }
                }
            ],
            languages: ['Common', 'Gloom-Tongue'],
            speed: 30,
            baseStats: { armor: 0, hp: 22, mana: 12, ap: 3, passivePerception: 11, swimSpeed: 10, climbSpeed: 15, visionRange: 60, darkvision: 30, initiative: 2 },
            savingThrowModifiers: { advantage: ['agility'], disadvantage: [] }
        },
        drun: {
            id: 'drun_neth',
            name: 'Drun',
            illustration: '/assets/images/races/drun_illustration.png',
            illustrationCaption: 'A Drun Neth outcast in the canopy sumps, their leaden-grey skin cold and magic-immune.',
            description: `The leaden-skinned outcasts who burned their names from the First Contract to escape its legal bindings. Immune to direct spellcasting targeting them, but legally non-existent under Neth law, unable to receive any magical healing or buffs.`,
            culturalBackground: `The Drun are the mercenaries, smugglers, and outcasts of Neth society. They live in the canopy-sumps of Atropolis, completely rejecting the Velun legal courts. Because their names were burned, they are legally dead to the Keeper, shrugging off the spells of the forest.`,
            statModifiers: { strength: 2, agility: 2, spirit: -1 },
            traits: [
                {
                    id: 'severed_seal_drun',
                    name: 'Severed Seal',
                    description: 'You are completely immune to direct magical spells and effects cast targeting you. However, this void block is absolute: you cannot receive any beneficial magical healing or buffs from your allies.',
                    level: 1,
                    icon: 'spell_shadow_antimagicshell',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff', 'debuff'],
                    typeConfig: { school: 'shadow', icon: 'spell_shadow_antimagicshell', tags: ['magic-immunity', 'void', 'passive'] },
                    buffConfig: {
                        buffType: 'custom',
                        effects: [
                            {
                                id: 'magic_immunity_void',
                                name: 'Magic Void',
                                description: 'Immune to all direct spellcasting cast targeting you.',
                                statusEffect: { level: 'major', description: 'Immune to direct magic targeting you.' }
                            }
                        ],
                        durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'statusEffect',
                        effects: [
                            {
                                id: 'healing_blockade',
                                name: 'Void Isolation',
                                description: 'Cannot receive any beneficial magical healing, buffs, or wards from allies.',
                                statusEffect: { level: 'moderate', description: 'Cannot receive magical healing or buffs from allies.' }
                            }
                        ],
                        durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                    resourceCost: { actionPoints: 0, mana: 0, components: [] },
                    cooldownConfig: { cooldownType: 'none', cooldownValue: 0 }
                }
            ],
            languages: ['Common', 'Gloom-Tongue'],
            speed: 30,
            baseStats: { armor: 0, hp: 25, mana: 0, ap: 3, passivePerception: 10, swimSpeed: 10, climbSpeed: 15, visionRange: 60, darkvision: 30, initiative: 1 },
            savingThrowModifiers: { advantage: ['strength'], disadvantage: [] }
        }
    }
};
