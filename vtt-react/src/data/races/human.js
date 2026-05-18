export const human = {
    id: 'human',
    name: 'Human',
    essence: 'The burning wick',
    description: 'We are the shortest-lived, most fragile sapient species on Mythrill — and we are the most dangerous thing on two legs. Not because we are strong. Not because we are fast. Not because the gods blessed us. Because we refuse. We refuse to break when every fiber screams surrender. We refuse to die when the blade is at our throat. We refuse to stop when our bodies are failing and our blood is on the stones. Sixty good years. That is all a Human gets. Sixty years to carve a name into a world that was ancient before our ancestors learned to walk upright. We burn brighter, push harder, and fight dirtier than anything else that breathes — because we have to. We have no claws, no fangs, no magic in our blood, no centuries to master a craft. We have spite, stubbornness, and the pathological certainty that tomorrow is worth bleeding for today.',
    icon: 'fas fa-user',
    overview: 'Humans are the burning wick — short-lived, biologically fragile, and pathologically determined. Every other race has evolutionary or magical advantages spanning millennia. Humans have sixty years and the spite to make them count. Their defense is not armor or regeneration; it is will. Their offense is not strength or magic; it is refusal to quit. Organized into three bloodlines: Imperial (conquerors and commanders), Hearthorn (commoners and survivors), and Pale-Born (arcane-touched outcasts).',
    culturalBackground: 'Human civilization spans more territory than any single non-human race, held together not by individual power but by networks of trade, alliance, blood, and shared stubbornness. Imperials build empires through military discipline and political ambition. Hearthorn carve communities from wilderness with calloused hands and quiet pragmatism. Pale-Born exist on the fringes — distrusted by their own kind, drawn to the arcane forces that marked their bloodlines. All three share the same fundamental truth: Humans survive not because they are powerful, but because they refuse to die.',
    variantDiversity: 'Humans are divided into three bloodlines shaped by circumstance and environment: The Imperials are empire-builders — militaristic, disciplined, and culturally convinced the world exists to be ordered. The Hearthorn are commoners — farmers, tradesmen, and survivors whose endurance borders on the supernatural. The Pale-Born are arcane-touched outcasts — their bloodlines saturated by generations of proximity to ley-lines and cursed battlefields, making them magically potent but biologically unstable.',
    integrationNotes: {
        actionPointSystem: 'Human abilities focus on willpower, social manipulation, and desperate survival. They lack raw supernatural power but gain asymmetric utility — each subrace is devastating in its niche and handicapped outside of it.',
        backgroundSynergy: 'Imperials excel as military commanders, politicians, and party leaders. Hearthorn thrive as survivalists, crafters, and attrition specialists. Pale-Born are unmatched as arcane specialists and magical reconnaissance — but social pariahs.',
        classCompatibility: 'Imperials synergize with tanky/frontline classes that benefit from formation bonuses. Hearthorn complement endurance-based classes and crafting-focused builds. Pale-Born amplify any spellcasting class but suffer in anti-magic scenarios. All Humans share the base fragility of -10% HP, forcing tactical play regardless of class.'
    },
    meaningfulTradeoffs: 'All Humans share Mortal Frailty (-10% base HP) and The Short Straw (+25% damage from aging/necrotic/time effects). Their only universal strength is Desperate Will (+2 Spirit, advantage vs Fear/Charm/Domination). Every Human subrace trades raw survivability for asymmetric niche power.',
    baseTraits: {
        languages: ['Common'],
        lifespan: '70-90 years',
        baseSpeed: 30,
        size: 'Medium',
        sizeCategory: 'Medium',
        height: '5\'4" - 6\'0"',
        weight: '130-200 lbs',
        build: 'Variable'
    },
    epicHistory: `Humans are the oldest race — or at least the most stubborn. Every other race was shaped, transformed, cursed, or blessed by external forces. Humans refused. They watched the Nordmark freeze, the Grimheart petrify, the Vreken succumb to the beast. And they built walls.

When the magical cataclysms came, humans survived not through power but through preparation. Their merchant networks fed cities through famines. Their homesteads endured when empires fell. The greatest human empire lasted 800 years not because of magic, but because of roads, laws, and the stubborn insistence that tomorrow is worth planning for.

But that empire fell too. They all fall eventually. Because Humans are a species that burns through everything — resources, alliances, empires, and themselves. They achieve more in decades than other races manage in centuries, and they leave ruins behind as proof. The Imperials conquered half a continent in three generations and spent the next ten fighting over the pieces. The Hearthorn survived plagues that wiped out entire non-human settlements and repaid the world by farming the mass graves. The Pale-Born learned to weaponize the arcane saturation in their blood — and paid for it with eyes that see too much and flesh that burns in sunlight.

Humans are the burning wick of Mythrill. Bright. Brief. Dangerous to everything nearby, including themselves.`,
    notableFigures: [
        {
            name: 'General Aldric Voss',
            title: 'The Iron Standard',
            portraitIcon: 'Armor/Head/head-hooded-helmet',
            backstory: 'The last Imperial general to hold the Northern Wall against the Grimheart siege. When his phalanx broke and his officers fled, Voss stood alone at the gate — not because he was brave, but because his legs were pinned under rubble and he could not run. He held the breach for six hours with a broken pike, screaming orders to soldiers who had already deserted. The Grimheart eventually pulled back, not because Voss stopped them, but because they decided he was too insane to be worth killing. He still commands the garrison. He still cannot walk without a cane. He still will not retreat.'
        },
        {
            name: 'Mira Thatch',
            title: 'The Plague Widow',
            portraitIcon: 'Armor/Head/head-hooded-helmet',
            backstory: 'Hearthorn herbalist who survived the Hollowthroat Plague that killed three-quarters of her village. When the disease took her husband and all four children, Mira did not grieve — she dissected. She spent two months studying the plague\'s progression in the corpses of her neighbors, brewing poultices from herbs she grew in mass graves. Her cure came too late for her family but saved six neighboring settlements. She now travels with a cart full of medicines and a silence that makes even hardened soldiers uncomfortable. She has never spoken her children\'s names aloud since the day she buried them.'
        },
        {
            name: 'Severin Ashmark',
            title: 'The Bleeding Oracle',
            portraitIcon: 'Armor/Head/head-hooded-helmet',
            backstory: 'Pale-Born diviner whose prophecies are terrifyingly accurate — because he bleeds them into existence. Severin\'s Blood Resonance ability is so powerful that he no longer needs to cut himself to replicate spells; he simply weeps blood when the magic takes hold. He predicted the collapse of the Thornwall Bridge three days before it fell. He foretold the return of the Deep Hunger beneath Grimheart mines. He cannot predict his own death, and this terrifies him more than any vision. Other Pale-Born consider him a warning — proof that the ley-saturation will eventually consume those who push too hard. Severin agrees with them.'
        }
    ],
    majorLocations: [
        {
            name: 'The Iron Standard',
            description: 'The greatest fortress-city ever built by Human hands, constructed at the narrowest point of the Pass of Cinders. Imperial engineers designed walls thirty feet thick, reinforced with iron mined from Hearthorn quarries and warded by Pale-Born runesmiths. The city has never fallen to siege — though it has changed hands seventeen times through treachery, politics, and outright assassination. It is currently held by the Third Imperial Cohort, who maintain a garrison of 2,000 soldiers and a policy of shooting first and asking questions of the survivors.'
        },
        {
            name: 'Thatch Hollow',
            description: 'A Hearthorn settlement built in the shadow of the Thornwood, founded by plague survivors who refused to leave the land that killed their families. The buildings are crude but impossibly sturdy — every beam cut by hand, every stone placed without magic. The residents have a saying: \'We buried our dead here. We are not leaving.\' The Hollow is famous for its herbalists, its stubborn refusal to trade on anything but its own terms, and the fact that no bandit crew has ever successfully raided it twice.'
        },
        {
            name: 'The Ashring',
            description: 'A Pale-Born enclave built in the crater of a destroyed ley-convergence, where the ground still crackles with residual arcane energy. The Pale-Born who live here have adapted to the constant magical saturation — their eyes glow faintly in the dark, and their skin is almost translucent. No other race can spend more than a few hours in the Ashring without developing magical sickness. The Pale-Born consider this a feature, not a bug.'
        }
    ],
    currentCrisis: 'The spreading darkness exploits every Human weakness. It ages the living, feeding on the Short Straw vulnerability that all Humans share. It disrupts Imperial supply lines, breaking the formation-dependent war machine. It brings magical plagues that overwhelm Hearthorn biological resilience. It saturates the ley-lines further, driving Pale-Born into sensory overload. Every Human subrace is being pushed toward extinction by a force that targets their specific, hard-coded vulnerabilities.',
    culturalPractices: `Humans value practical skill over innate ability. A good blacksmith is worth more than a mediocre mage. Their celebrations center on harvest, trade, and survival — the three things that have kept them alive when more powerful races fell.

Imperials practice formation drills as communal ritual — entire neighborhoods gathering to march in unison, children learning shield formations before they learn to read. Promotion through Imperial society is determined by battlefield merit and political maneuvering in equal measure.

Hearthorn commemorate survival rather than victory. Their festivals mark the anniversaries of plagues survived, famines endured, and winters outlasted. The highest honor a Hearthorn can receive is not a medal or title — it is a hand-carved chair at the communal table, signifying that this person kept others alive when the world tried to kill them.

Pale-Born have no festivals. They have seances. Gatherings in the Ashring involve channeling ley-energy through blood rituals — not for worship, but for information. They read the magical currents the way sailors read the sea, looking for storms on the horizon. Other Humans consider these gatherings deeply unsettling, which is exactly how the Pale-Born prefer it.`,
    subraces: {
        imperial: {
            id: 'imperial_human',
            name: 'Imperial',
            description: 'Descended from the founders of Mythrill\'s largest empires. Generations of militaristic discipline have rewired their nervous systems for formation combat. The Imperial body is a weapon platform calibrated for one purpose: standing shoulder-to-shoulder in a wall of shields and blades. Separated from the phalanx, the conditioning collapses. Their muscles forget how to move alone. Their reflexes — honed for shield-wall timing — become liabilities. The empire feeds on its soldiers\' bones.',
            culturalBackground: 'Imperial culture is built on hierarchy, discipline, and the conviction that civilization is a weapon to be wielded. Children are drilled in formation tactics from age six. Officers earn rank through merit and political skill in equal measure. Their cities are monuments to order — wide streets, garrison districts, and public execution platforms that serve as both justice and theater. Other races see Imperials as conquerors. Imperials see themselves as the only thing standing between civilization and chaos. Both are correct.',
            statModifiers: {
                spirit: 2,
                strength: 1,
                agility: -1
            },
            baseStats: {
                armor: 0,
                hp: 28,
                mana: 16,
                ap: 3,
                passivePerception: 10,
                swimSpeed: 15,
                climbSpeed: 15,
                visionRange: 30,
                darkvision: 0,
                initiative: 0
            },
            savingThrowModifiers: {
                advantage: ['fear', 'charm', 'domination'],
                disadvantage: ['stealth_urban', 'wilderness_survival']
            },
            traits: [
                {
                    id: 'mortal_frailty_human',
                    name: 'Mortal Frailty',
                    description: 'Humans are biologically the most fragile sapient species. Base Health Pool reduced by 10% compared to all other playable races. A single clean hit from an Orc\'s greataxe will drop a Human where a Dwarf would bruise and a Troll would regenerate.',
                    level: 1,
                    icon: 'ability_rogue_bloodyeye',
                    spellType: 'PASSIVE',
                    effectTypes: ['debuff'],
                    typeConfig: {
                        school: 'biological',
                        secondaryElement: 'frailty',
                        icon: 'ability_rogue_bloodyeye',
                        tags: ['vulnerability', 'health', 'passive', 'base_race']
                    },
                    debuffConfig: {
                        debuffType: 'statEnhancement',
                        effects: [
                            {
                                id: 'reduced_hp',
                                name: 'Frail Constitution',
                                description: '-10% base Health Pool',
                                statModifier: {
                                    stat: 'hp',
                                    magnitude: -10,
                                    magnitudeType: 'percentage'
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    targetingConfig: {
                        targetingType: 'self',
                        rangeType: 'self_centered'
                    }
                },
                {
                    id: 'short_straw_human',
                    name: 'The Short Straw',
                    description: 'Natural lifespan of 70-90 years. Any aging effects, time-manipulation magic, or necrotic life-drain deals +25% damage/effect potency (Susceptible tier: x1.25, rounded up). Short lifespans make Humans metaphysically vulnerable to anything that accelerates decay.',
                    level: 1,
                    icon: 'spell_shadow_lifedrain',
                    spellType: 'PASSIVE',
                    effectTypes: ['debuff'],
                    typeConfig: {
                        school: 'curse',
                        secondaryElement: 'time',
                        icon: 'spell_shadow_lifedrain',
                        tags: ['vulnerability', 'necrotic', 'aging', 'passive', 'base_race']
                    },
                    debuffConfig: {
                        debuffType: 'statusEffect',
                        effects: [
                            {
                                id: 'necrotic_susceptible',
                                name: 'Necrotic Susceptible',
                                description: '+25% damage from aging, time-manipulation, and necrotic life-drain effects',
                                statusEffect: {
                                    vulnerabilityType: 'necrotic',
                                    vulnerabilityPercent: 25,
                                    appliesTo: ['aging', 'time_manipulation', 'life_drain']
                                }
                            }
                        ],
                        durationType: 'permanent',
                        canBeDispelled: false
                    },
                    targetingConfig: {
                        targetingType: 'self',
                        rangeType: 'self_centered'
                    }
                },
                {
                    id: 'desperate_will_human',
                    name: 'Desperate Will',
                    description: 'Humans gain +2 Spirit and have advantage on saves vs Fear, Charm, and Domination. Not armor, not magic — just a species-wide, pathological refusal to break. A Human will hold a shield wall together through sheer terror-suppression when every other race would rout.',
                    level: 1,
                    icon: 'spell_holy_divinespirit',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff'],
                    typeConfig: {
                        school: 'willpower',
                        secondaryElement: 'spirit',
                        icon: 'spell_holy_divinespirit',
                        tags: ['spirit', 'willpower', 'fear_resist', 'charm_resist', 'passive', 'base_race']
                    },
                    buffConfig: {
                        buffType: 'statEnhancement',
                        effects: [
                            {
                                id: 'spirit_bonus',
                                name: 'Iron Will',
                                description: '+2 Spirit from desperate determination',
                                statModifier: {
                                    stat: 'spirit',
                                    magnitude: 2,
                                    magnitudeType: 'flat'
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    targetingConfig: {
                        targetingType: 'self',
                        rangeType: 'self_centered'
                    }
                },
                {
                    id: 'cultural_fluency_human',
                    name: 'Cultural Fluency',
                    description: 'Advantage on Diplomacy, Persuasion, and Trade checks with non-hostile humanoid factions. NULLIFIED and REVERSED to disadvantage with any faction historically oppressed, conquered, or displaced by Human empires — which is most non-human civilizations.',
                    level: 1,
                    icon: 'achievement_reputation_01',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff', 'debuff'],
                    typeConfig: {
                        school: 'social',
                        secondaryElement: 'persuasion',
                        icon: 'achievement_reputation_01',
                        tags: ['social', 'persuasion', 'trade', 'conditional', 'passive', 'base_race']
                    },
                    buffConfig: {
                        buffType: 'social',
                        effects: [
                            {
                                id: 'diplomacy_advantage',
                                name: 'Common Tongue',
                                description: 'Advantage on Diplomacy, Persuasion, and Trade with non-hostile humanoids',
                                socialModifier: {
                                    skills: ['diplomacy', 'persuasion', 'trade'],
                                    bonusType: 'advantage',
                                    condition: 'target_non_hostile_humanoid'
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'social',
                        effects: [
                            {
                                id: 'conqueror_stigma',
                                name: 'Conqueror\'s Stigma',
                                description: 'Disadvantage on all social checks with factions historically oppressed by Human empires',
                                socialModifier: {
                                    skills: ['all'],
                                    penaltyType: 'disadvantage',
                                    condition: 'target_oppressed_faction'
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    targetingConfig: {
                        targetingType: 'self',
                        rangeType: 'self_centered'
                    }
                },
                {
                    id: 'second_wind_human',
                    name: 'Second Wind',
                    description: 'Channel raw survival instinct. Immediately recover 15% max HP and cleanse one Fear effect or one Fear-adjacent debuff. Inflicts Adrenal Debt — all healing received reduced by 30% for 3 rounds.',
                    level: 1,
                    icon: 'ability_warrior_improveddisciplines',
                    spellType: 'ACTION',
                    actionPoints: 1,
                    components: ['verbal'],
                    effectTypes: ['healing', 'buff', 'debuff'],
                    typeConfig: {
                        school: 'willpower',
                        secondaryElement: 'survival',
                        icon: 'ability_warrior_improveddisciplines',
                        tags: ['healing', 'cleanse', 'self', 'cooldown', 'base_race']
                    },
                    buffConfig: {
                        buffType: 'heal',
                        effects: [
                            {
                                id: 'hp_recovery',
                                name: 'Desperate Surge',
                                description: 'Recover 15% of maximum HP',
                                healing: {
                                    type: 'percentage',
                                    magnitude: 15,
                                    target: 'self'
                                }
                            },
                            {
                                id: 'fear_cleanse',
                                name: 'Shake It Off',
                                description: 'Cleanse one Fear or Fear-adjacent debuff',
                                cleanse: {
                                    effectTypes: ['fear', 'fear_adjacent'],
                                    count: 1
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'instant',
                        durationUnit: 'instant',
                        canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'statusEffect',
                        effects: [
                            {
                                id: 'adrenal_debt',
                                name: 'Adrenal Debt',
                                description: 'All healing received reduced by 30% for 3 rounds',
                                statusEffect: {
                                    level: 'moderate',
                                    healingReceivedModifier: -30,
                                    durationRounds: 3,
                                    description: 'The body runs on fumes, not recovery'
                                }
                            }
                        ],
                        durationValue: 3,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        canBeDispelled: false
                    },
                    targetingConfig: {
                        targetingType: 'self',
                        rangeType: 'self_centered'
                    },
                    resourceCost: {
                        resourceTypes: [],
                        resourceValues: {},
                        actionPoints: 1,
                        mana: 0,
                        components: ['verbal']
                    },
                    cooldownConfig: {
                        cooldownType: 'short_rest',
                        cooldownValue: 1
                    }
                },
                {
                    id: 'iron_phalanx',
                    name: 'Iron Phalanx',
                    description: 'The Imperial\'s body was drilled since childhood to move as a component of a wall of shields. When adjacent to 2+ allied melee combatants, gain +3 Armor Score. Each additional adjacent ally beyond 2 grants +1 Armor (maximum +5 total). When NO ally is adjacent: -2 Armor Score and -1 Action Point. The conditioning that makes the phalanx unbreakable is the same conditioning that makes the lone soldier a corpse — their muscles literally forget how to defend a body standing alone.',
                    level: 1,
                    icon: 'ability_warrior_defensivestance',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff', 'debuff'],
                    typeConfig: {
                        school: 'tactical',
                        secondaryElement: 'formation',
                        icon: 'ability_warrior_defensivestance',
                        tags: ['armor', 'formation', 'conditional', 'action_points', 'passive']
                    },
                    buffConfig: {
                        buffType: 'statEnhancement',
                        effects: [
                            {
                                id: 'formation_armor_base',
                                name: 'Shield Wall',
                                description: '+3 Armor when adjacent to 2+ allied melee combatants',
                                statModifier: {
                                    stat: 'armor',
                                    magnitude: 3,
                                    magnitudeType: 'flat',
                                    condition: 'adjacent_allied_melee_2plus'
                                }
                            },
                            {
                                id: 'formation_armor_scaling',
                                name: 'Deepening Ranks',
                                description: '+1 Armor per additional adjacent ally beyond 2 (max +5 total)',
                                statModifier: {
                                    stat: 'armor',
                                    magnitude: 1,
                                    magnitudeType: 'flat',
                                    scalingCondition: 'each_adjacent_ally_beyond_2',
                                    maximumStacks: 2,
                                    stackDescription: 'Phalanx deepens with each shield that joins'
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'statEnhancement',
                        effects: [
                            {
                                id: 'isolated_collapse',
                                name: 'Formation Break',
                                description: '-2 Armor and -1 AP when no ally is adjacent',
                                statModifier: {
                                    stat: 'armor',
                                    magnitude: -2,
                                    magnitudeType: 'flat',
                                    condition: 'no_adjacent_ally'
                                }
                            },
                            {
                                id: 'isolated_ap_drain',
                                name: 'Drilled into Paralysis',
                                description: '-1 Action Point when separated from formation',
                                statModifier: {
                                    stat: 'ap',
                                    magnitude: -1,
                                    magnitudeType: 'flat',
                                    condition: 'no_adjacent_ally'
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    targetingConfig: {
                        targetingType: 'self',
                        rangeType: 'self_centered'
                    }
                },
                {
                    id: 'the_iron_law',
                    name: 'The Iron Law',
                    description: 'Allied NPCs within 15 feet gain +5% damage and +5% accuracy while the Imperial is visible and standing. Allied player characters within 15 feet gain +2 to Initiative. The Imperial does NOT benefit from their own aura — command is sacrifice, not self-enrichment. COST: The same conditioned obedience that makes Imperials natural leaders makes them puppets for magical authority. Disadvantage on all saving throws vs Charm and Domination effects. The instinct to follow orders does not distinguish between a general and a necromancer.',
                    level: 1,
                    icon: 'achievement_pvp_h_01',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff', 'debuff'],
                    typeConfig: {
                        school: 'social',
                        secondaryElement: 'command',
                        icon: 'achievement_pvp_h_01',
                        tags: ['social', 'aura', 'initiative', 'command', 'vulnerability', 'passive']
                    },
                    buffConfig: {
                        buffType: 'aura',
                        effects: [
                            {
                                id: 'commanding_presence',
                                name: 'Commanding Presence',
                                description: 'Allied NPCs within 15ft gain +5% damage and +5% accuracy',
                                auraEffect: {
                                    radius: 15,
                                    targetRestriction: 'ally_npc',
                                    damageModifier: 5,
                                    accuracyModifier: 5,
                                    condition: 'imperial_visible_and_standing',
                                    excludesSelf: true
                                }
                            },
                            {
                                id: 'tactical_initiative',
                                name: 'Coordinated Assault',
                                description: 'Allied player characters within 15ft gain +2 Initiative',
                                auraEffect: {
                                    radius: 15,
                                    targetRestriction: 'ally_player',
                                    initiativeModifier: 2,
                                    excludesSelf: true
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'statusEffect',
                        effects: [
                            {
                                id: 'conditioned_obedience',
                                name: 'Conditioned Obedience',
                                description: 'Disadvantage on all saves vs Charm and Domination',
                                statusEffect: {
                                    saveModifier: 'disadvantage',
                                    appliesTo: ['charm', 'domination'],
                                    description: 'The drill-sergeant\'s voice echoes in every command, even magical ones'
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    targetingConfig: {
                        targetingType: 'aura',
                        rangeType: 'self_centered',
                        aoeParameters: {
                            radius: 15
                        }
                    }
                },
                {
                    id: 'for_the_empire',
                    name: 'For the Empire!',
                    description: 'A bellowed order that burns through the throat and rattles the teeth. All allied creatures within 30 feet gain one additional Action on their next turn (cannot cast spells of 3rd level or higher). The Imperial does NOT gain this action — they spend theirs giving it away. After resolution, all affected allies suffer War Weariness: -10% accuracy for 2 rounds as the adrenaline surge collapses into exhaustion. The human body was not built to operate at the tempo empire demands.',
                    level: 1,
                    icon: 'ability_warrior_battleshout',
                    spellType: 'ACTION',
                    actionPoints: 1,
                    components: ['verbal'],
                    effectTypes: ['buff', 'debuff'],
                    typeConfig: {
                        school: 'command',
                        secondaryElement: 'rally',
                        icon: 'ability_warrior_battleshout',
                        tags: ['buff', 'debuff', 'aura', 'action', 'cooldown']
                    },
                    buffConfig: {
                        buffType: 'action_grant',
                        effects: [
                            {
                                id: 'extra_action',
                                name: 'Rally',
                                description: 'Allies within 30ft gain 1 additional Action (no spells 3rd level+)',
                                actionGrant: {
                                    actionCount: 1,
                                    restrictions: ['no_spells_3rd_level_or_higher'],
                                    excludesSelf: true
                                }
                            }
                        ],
                        durationValue: 1,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        canBeDispelled: true
                    },
                    debuffConfig: {
                        debuffType: 'statusEffect',
                        effects: [
                            {
                                id: 'war_weariness',
                                name: 'War Weariness',
                                description: '-10% accuracy for 2 rounds after rally fades',
                                statusEffect: {
                                    level: 'minor',
                                    accuracyModifier: -10,
                                    durationRounds: 2,
                                    description: 'The surge passes; exhaustion follows like a hound on a scent'
                                }
                            }
                        ],
                        durationValue: 2,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        canBeDispelled: false
                    },
                    targetingConfig: {
                        targetingType: 'area',
                        rangeType: 'self_centered',
                        rangeDistance: 0,
                        aoeShape: 'sphere',
                        aoeParameters: {
                            radius: 30
                        },
                        targetRestrictions: ['ally']
                    },
                    resourceCost: {
                        resourceTypes: [],
                        resourceValues: {},
                        actionPoints: 1,
                        mana: 0,
                        components: ['verbal']
                    },
                    cooldownConfig: {
                        cooldownType: 'long_rest',
                        cooldownValue: 1
                    }
                },
                {
                    id: 'conscripts_burden',
                    name: 'Conscript\'s Burden',
                    description: 'Imperial drilling replaces natural dodge reflexes with shield-block muscle memory. The body learns to present iron, not flesh. Without a shield, the trained stance opens the torso to blade work like a gutted fish — +50% vulnerability to slashing damage when not wielding a shield. With a shield equipped: this vulnerability is fully negated. The shield is not equipment. It is a prosthetic survival organ.',
                    level: 1,
                    icon: 'ability_warrior_shieldwall',
                    spellType: 'PASSIVE',
                    effectTypes: ['debuff'],
                    typeConfig: {
                        school: 'biological',
                        secondaryElement: 'training',
                        icon: 'ability_warrior_shieldwall',
                        tags: ['vulnerability', 'slashing', 'conditional', 'shield', 'passive', 'isWeakness']
                    },
                    debuffConfig: {
                        debuffType: 'vulnerability',
                        effects: [
                            {
                                id: 'slashing_vulnerability',
                                name: 'Open to the Blade',
                                description: '+50% slashing damage when not wielding a shield',
                                statusEffect: {
                                    vulnerabilityType: 'slashing',
                                    vulnerabilityPercent: 50,
                                    condition: 'not_wielding_shield',
                                    negatedBy: 'shield_equipped',
                                    description: 'Drilled to present iron, not flesh — without a shield the body is a wound waiting to happen'
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    targetingConfig: {
                        targetingType: 'self',
                        rangeType: 'self_centered'
                    }
                },
                {
                    id: 'scorched_discipline',
                    name: 'Scorched Discipline',
                    description: 'The Imperial is immune to Fear. Cannot be frightened, rattled, or terrorized by any means — magical or mundane. The conditioning burned the fear response out of the nervous system with the same ruthless efficiency used to burn the retreat instinct. COST: Cannot use Reactions to flee, retreat, or reposition defensively. When an allied creature dies within line of sight, the Imperial must succeed on a Spirit save (DC 15) or be compelled to attack the killer on their next turn, regardless of tactical situation, hit point total, or odds. Fear was the thing that told the body when to run. Without it, the body only knows how to charge.',
                    level: 1,
                    icon: 'spell_holy_auramastery',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff', 'debuff'],
                    typeConfig: {
                        school: 'willpower',
                        secondaryElement: 'conditioning',
                        icon: 'spell_holy_auramastery',
                        tags: ['fear_immunity', 'forced_action', 'conditioning', 'passive']
                    },
                    buffConfig: {
                        buffType: 'passive_enhancement',
                        effects: [
                            {
                                id: 'fear_immunity',
                                name: 'Burned Out',
                                description: 'Immune to all Fear effects — magical and mundane',
                                statusEffect: {
                                    immunity: ['fear', 'frightened', 'terror'],
                                    description: 'The fear response was surgically removed by a thousand drills'
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'ability_impairment',
                        effects: [
                            {
                                id: 'no_retreat',
                                name: 'No Retreat Reflex',
                                description: 'Cannot use Reactions to flee, retreat, or reposition defensively',
                                statusEffect: {
                                    reactionRestriction: ['flee', 'retreat', 'defensive_reposition'],
                                    description: 'The drill-sergeant removed the survival instinct along with the fear'
                                }
                            },
                            {
                                id: 'avenger_compulsion',
                                name: 'When Brothers Fall',
                                description: 'Spirit save DC 15 when ally dies in sight — failure compels attack on killer next turn',
                                statusEffect: {
                                    compulsion: 'attack_killer',
                                    triggerCondition: 'ally_death_within_line_of_sight',
                                    saveType: 'spirit',
                                    saveDC: 15,
                                    durationRounds: 1,
                                    description: 'Fear was the thing that told the body when to run. Without it, there is only the charge'
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    targetingConfig: {
                        targetingType: 'self',
                        rangeType: 'self_centered'
                    }
                }
            ]
        },
        hearthorn: {
            id: 'hearthorn_human',
            name: 'Hearthorn',
            description: 'The backbone of Humanity. Farmers, tradesmen, plague survivors. Not glamorous. Not conquerors. They endure — and in Mythrill, endurance is its own kind of power. Generations of surviving filth, famine, and disease have hardened their bodies against the natural world while making them violently allergic to the supernatural. They eat things that should not be eaten. They live in places that should not be lived in. They forget to die with a stubbornness that unsettles even other Humans.',
            culturalBackground: 'Hearthorn communities are built on mutual reliance and the unspoken understanding that every neighbor is a lifeline. They measure a person by what they do when things get hard. Their settlements are crude but impossibly sturdy — every beam cut by hand, every stone placed without magic. They survived plagues that wiped out entire non-human settlements and repaid the world by farming the mass graves. The dead feed the living — this is not poetry to the Hearthorn. It is agriculture.',
            statModifiers: {
                constitution: 2,
                intelligence: 1,
                charisma: -1
            },
            baseStats: {
                armor: 0,
                hp: 30,
                mana: 12,
                ap: 3,
                passivePerception: 11,
                swimSpeed: 15,
                climbSpeed: 15,
                visionRange: 30,
                darkvision: 0,
                initiative: 0
            },
            savingThrowModifiers: {
                advantage: ['disease', 'poison_nonmagical', 'exhaustion'],
                disadvantage: ['magical_effects']
            },
            traits: [
                {
                    id: 'mortal_frailty_human_hearthorn',
                    name: 'Mortal Frailty',
                    description: 'Base Health Pool reduced by 10%. Humans are biologically the most fragile sapient species.',
                    level: 1,
                    icon: 'ability_rogue_bloodyeye',
                    spellType: 'PASSIVE',
                    effectTypes: ['debuff'],
                    typeConfig: {
                        school: 'biological',
                        secondaryElement: 'frailty',
                        icon: 'ability_rogue_bloodyeye',
                        tags: ['vulnerability', 'health', 'passive', 'base_race']
                    },
                    debuffConfig: {
                        debuffType: 'statEnhancement',
                        effects: [
                            {
                                id: 'reduced_hp',
                                name: 'Frail Constitution',
                                description: '-10% base Health Pool',
                                statModifier: { stat: 'hp', magnitude: -10, magnitudeType: 'percentage' }
                            }
                        ],
                        durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' }
                },
                {
                    id: 'short_straw_human_hearthorn',
                    name: 'The Short Straw',
                    description: '+25% damage from aging, time-manipulation, and necrotic life-drain effects (Susceptible tier: x1.25).',
                    level: 1,
                    icon: 'spell_shadow_lifedrain',
                    spellType: 'PASSIVE',
                    effectTypes: ['debuff'],
                    typeConfig: {
                        school: 'curse', secondaryElement: 'time', icon: 'spell_shadow_lifedrain',
                        tags: ['vulnerability', 'necrotic', 'aging', 'passive', 'base_race']
                    },
                    debuffConfig: {
                        debuffType: 'statusEffect',
                        effects: [
                            {
                                id: 'necrotic_susceptible',
                                name: 'Necrotic Susceptible',
                                description: '+25% damage from aging, time-manipulation, and necrotic life-drain',
                                statusEffect: { vulnerabilityType: 'necrotic', vulnerabilityPercent: 25, appliesTo: ['aging', 'time_manipulation', 'life_drain'] }
                            }
                        ],
                        durationType: 'permanent', canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' }
                },
                {
                    id: 'desperate_will_human_hearthorn',
                    name: 'Desperate Will',
                    description: '+2 Spirit, advantage on saves vs Fear, Charm, and Domination.',
                    level: 1,
                    icon: 'spell_holy_divinespirit',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff'],
                    typeConfig: {
                        school: 'willpower', secondaryElement: 'spirit', icon: 'spell_holy_divinespirit',
                        tags: ['spirit', 'willpower', 'fear_resist', 'charm_resist', 'passive', 'base_race']
                    },
                    buffConfig: {
                        buffType: 'statEnhancement',
                        effects: [
                            {
                                id: 'spirit_bonus', name: 'Iron Will', description: '+2 Spirit',
                                statModifier: { stat: 'spirit', magnitude: 2, magnitudeType: 'flat' }
                            }
                        ],
                        durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' }
                },
                {
                    id: 'cultural_fluency_human_hearthorn',
                    name: 'Cultural Fluency',
                    description: 'Advantage on Diplomacy, Persuasion, Trade with non-hostile humanoids. Reversed to disadvantage with historically oppressed factions.',
                    level: 1,
                    icon: 'achievement_reputation_01',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff', 'debuff'],
                    typeConfig: {
                        school: 'social', secondaryElement: 'persuasion', icon: 'achievement_reputation_01',
                        tags: ['social', 'persuasion', 'trade', 'conditional', 'passive', 'base_race']
                    },
                    buffConfig: {
                        buffType: 'social',
                        effects: [
                            {
                                id: 'diplomacy_advantage', name: 'Common Tongue',
                                description: 'Advantage on Diplomacy, Persuasion, Trade with non-hostile humanoids',
                                socialModifier: { skills: ['diplomacy', 'persuasion', 'trade'], bonusType: 'advantage', condition: 'target_non_hostile_humanoid' }
                            }
                        ],
                        durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'social',
                        effects: [
                            {
                                id: 'conqueror_stigma', name: 'Conqueror\'s Stigma',
                                description: 'Disadvantage on all social checks with historically oppressed factions',
                                socialModifier: { skills: ['all'], penaltyType: 'disadvantage', condition: 'target_oppressed_faction' }
                            }
                        ],
                        durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' }
                },
                {
                    id: 'second_wind_human_hearthorn',
                    name: 'Second Wind',
                    description: 'Recover 15% max HP, cleanse one Fear effect. Inflicts Adrenal Debt (-30% healing received for 3 rounds).',
                    level: 1,
                    icon: 'ability_warrior_improveddisciplines',
                    spellType: 'ACTION',
                    actionPoints: 1,
                    components: ['verbal'],
                    effectTypes: ['healing', 'buff', 'debuff'],
                    typeConfig: {
                        school: 'willpower', secondaryElement: 'survival', icon: 'ability_warrior_improveddisciplines',
                        tags: ['healing', 'cleanse', 'self', 'cooldown', 'base_race']
                    },
                    buffConfig: {
                        buffType: 'heal',
                        effects: [
                            {
                                id: 'hp_recovery', name: 'Desperate Surge', description: 'Recover 15% of maximum HP',
                                healing: { type: 'percentage', magnitude: 15, target: 'self' }
                            },
                            {
                                id: 'fear_cleanse', name: 'Shake It Off', description: 'Cleanse one Fear or Fear-adjacent debuff',
                                cleanse: { effectTypes: ['fear', 'fear_adjacent'], count: 1 }
                            }
                        ],
                        durationValue: 0, durationType: 'instant', durationUnit: 'instant', canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'statusEffect',
                        effects: [
                            {
                                id: 'adrenal_debt', name: 'Adrenal Debt',
                                description: 'All healing received reduced by 30% for 3 rounds',
                                statusEffect: { level: 'moderate', healingReceivedModifier: -30, durationRounds: 3 }
                            }
                        ],
                        durationValue: 3, durationType: 'rounds', durationUnit: 'rounds', canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                    resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 1, mana: 0, components: ['verbal'] },
                    cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 }
                },
                {
                    id: 'plague_hardened',
                    name: 'Plague-Hardened',
                    description: 'Generations of surviving filth, plague, and graveyard runoff have rewired the Hearthorn immune system into something that puzzles healers and disgusts everyone else. Advantage on saves vs Disease, non-magical Poison, and Exhaustion. Reduce all environmental damage (natural cold, natural heat, disease exposure) by 25%. COST: The same biological adaptation that repels the natural world rejects the supernatural with violent immune responses. +20% vulnerability to ALL magical damage — arcane, divine, elemental, the lot. Their flesh treats a fireball the way a healthy body treats infected blood.',
                    level: 1,
                    icon: 'spell_nature_resistnature',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff', 'debuff'],
                    typeConfig: {
                        school: 'biological',
                        secondaryElement: 'endurance',
                        icon: 'spell_nature_resistnature',
                        tags: ['resistance', 'vulnerability', 'environmental', 'magical', 'passive']
                    },
                    buffConfig: {
                        buffType: 'resistance',
                        effects: [
                            {
                                id: 'environmental_resistance',
                                name: 'Hardened Constitution',
                                description: '25% reduction to environmental damage (natural cold, heat, disease)',
                                resistanceModifier: {
                                    damageTypes: ['cold_natural', 'heat_natural', 'exhaustion', 'disease', 'poison_spoiled'],
                                    reductionPercent: 25
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'statusEffect',
                        effects: [
                            {
                                id: 'magical_susceptible',
                                name: 'Unwarded Flesh',
                                description: '+20% damage from all magical sources',
                                statusEffect: {
                                    vulnerabilityTypes: ['arcane', 'divine', 'elemental', 'fire', 'frost', 'lightning', 'force', 'necrotic', 'radiant'],
                                    vulnerabilityPercent: 20,
                                    appliesTo: 'all_magical_damage',
                                    description: 'Generations of plague-hardening left the flesh violently allergic to anything supernatural'
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    targetingConfig: {
                        targetingType: 'self',
                        rangeType: 'self_centered'
                    }
                },
                {
                    id: 'graveyard_supper',
                    name: 'Graveyard Supper',
                    description: 'Consume graveyard soil, ash from a funeral pyre, or decaying organic matter from a burial site. The dead feed the living — this is not poetry to the Hearthorn, it is dinner. Gain +3 temporary Armor for 3 rounds and immediately cleanse one active Poison or Disease effect. The minerals in grave-soil calcify under the skin like crude plate armor. COST: Gain the Poisoned condition for 2 rounds as the body processes what should not be eaten. Cannot be used while currently Poisoned — the stomach has limits, even for a Hearthorn.',
                    level: 1,
                    icon: 'inv_misc_food_09',
                    spellType: 'ACTION',
                    actionPoints: 1,
                    components: ['somatic'],
                    effectTypes: ['buff', 'debuff'],
                    typeConfig: {
                        school: 'survival',
                        secondaryElement: 'consumption',
                        icon: 'inv_misc_food_09',
                        tags: ['armor', 'cleanse', 'survival', 'folklore', 'conditional', 'cooldown']
                    },
                    buffConfig: {
                        buffType: 'statEnhancement',
                        effects: [
                            {
                                id: 'grave_armor',
                                name: 'Grave-Soil Carapace',
                                description: '+3 temporary Armor for 3 rounds',
                                statModifier: {
                                    stat: 'armor',
                                    magnitude: 3,
                                    magnitudeType: 'flat',
                                    durationRounds: 3,
                                    isTemporary: true
                                }
                            },
                            {
                                id: 'cleanse_rot',
                                name: 'Purge the Humors',
                                description: 'Cleanse one active Poison or Disease effect',
                                cleanse: {
                                    effectTypes: ['poison', 'disease'],
                                    count: 1
                                }
                            }
                        ],
                        durationValue: 3,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        canBeDispelled: true
                    },
                    debuffConfig: {
                        debuffType: 'conditional',
                        effects: [
                            {
                                id: 'grave_sickness',
                                name: 'Grave Sickness',
                                description: 'Poisoned for 2 rounds — the stomach processes what should not be eaten',
                                statusEffect: {
                                    level: 'moderate',
                                    statusEffect: 'poisoned',
                                    durationRounds: 2,
                                    condition: 'not_currently_poisoned',
                                    blocksReuse: true,
                                    description: 'The body accepts the grave\'s gift and repays it with bile'
                                }
                            }
                        ],
                        durationValue: 2,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        canBeDispelled: true
                    },
                    targetingConfig: {
                        targetingType: 'self',
                        rangeType: 'self_centered'
                    },
                    resourceCost: {
                        resourceTypes: [],
                        resourceValues: {},
                        actionPoints: 1,
                        mana: 0,
                        components: ['somatic']
                    },
                    cooldownConfig: {
                        cooldownType: 'short_rest',
                        cooldownValue: 1
                    }
                },
                {
                    id: 'unremarkable',
                    name: 'Unremarkable',
                    description: 'The Hearthorn is so perfectly ordinary that the eye slides off them like water off oiled leather. Advantage on Stealth checks in urban environments and crowd situations. Guards, bounty hunters, and spies have disadvantage on any check to recall or describe the Hearthorn\'s face — they remember "someone unremarkable" and nothing more. COST: Allies also lose track. Party members suffer disadvantage on checks to coordinate with the Hearthorn in combat — calling out positions, passing items, executing flanking maneuvers. The Hearthorn is so forgettable that even allies lose them in the chaos of battle. Overlooked for promotions, rewards, credit, and glory. History does not remember the commoner.',
                    level: 1,
                    icon: 'spell_magic_magearmor',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff', 'debuff'],
                    typeConfig: {
                        school: 'social',
                        secondaryElement: 'anonymity',
                        icon: 'spell_magic_magearmor',
                        tags: ['social', 'stealth', 'urban', 'memory', 'coordination', 'passive']
                    },
                    buffConfig: {
                        buffType: 'social',
                        effects: [
                            {
                                id: 'urban_anonymity',
                                name: 'Face in the Crowd',
                                description: 'Advantage on Stealth checks in urban environments and crowd situations',
                                skillModifier: {
                                    skills: ['stealth_urban', 'blend_in', 'avoid_attention'],
                                    bonusType: 'advantage',
                                    condition: 'urban_or_crowd_environment'
                                }
                            },
                            {
                                id: 'forgettable_face',
                                name: 'Forgettable',
                                description: 'Guards, bounty hunters, spies have disadvantage recalling/describing face',
                                socialModifier: {
                                    penaltyType: 'disadvantage',
                                    appliesTo: 'npc_recall_attempts',
                                    condition: 'describing_hearthorn'
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'social',
                        effects: [
                            {
                                id: 'ally_confusion',
                                name: 'Lost in the Fray',
                                description: 'Allies have disadvantage coordinating with Hearthorn in combat',
                                socialModifier: {
                                    penaltyType: 'disadvantage',
                                    appliesTo: 'allied_combat_coordination',
                                    condition: 'active_combat',
                                    description: 'Even allies lose the thread — was she on the left or the right?'
                                }
                            },
                            {
                                id: 'overlooked',
                                name: 'Overlooked',
                                description: 'Easily overlooked for promotions, rewards, credit, and glory',
                                socialModifier: {
                                    penaltyType: 'social_invisibility',
                                    appliesTo: 'recognition_credit_glory',
                                    description: 'History does not remember the commoner'
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    targetingConfig: {
                        targetingType: 'self',
                        rangeType: 'self_centered'
                    }
                },
                {
                    id: 'plow_shaped_hands',
                    name: 'Plow-Shaped Hands',
                    description: 'The hands that break earth learn to break metal, wood, and bone with equal pragmatism. +2 to one Craft or Profession skill at creation. Self-crafted mundane equipment has +15% durability. Self-crafted mundane weapons deal +2 damage on the first strike in each combat encounter — freshly sharpened, properly weighted, the edge of someone who knows that a dull blade means a slow death. Only applies to mundane equipment. Magic overrides careful tempering, because the world is unfair and has always been.',
                    level: 1,
                    icon: 'inv_hammer_06',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff'],
                    typeConfig: {
                        school: 'craft',
                        secondaryElement: 'trade',
                        icon: 'inv_hammer_06',
                        tags: ['crafting', 'trade', 'durability', 'damage', 'passive']
                    },
                    buffConfig: {
                        buffType: 'crafting',
                        effects: [
                            {
                                id: 'skill_bonus',
                                name: 'Master Apprentice',
                                description: '+2 to one Craft, Profession, or Trade skill',
                                skillModifier: {
                                    skills: ['craft', 'profession', 'trade'],
                                    bonusType: 'flat',
                                    magnitude: 2,
                                    chooseOne: true
                                }
                            },
                            {
                                id: 'craftsmanship_durability',
                                name: 'Hearthorn Temper',
                                description: '+15% durability on self-crafted mundane equipment',
                                equipmentModifier: {
                                    durability: 15,
                                    durabilityType: 'percentage',
                                    condition: 'self_crafted',
                                    equipmentType: 'mundane'
                                }
                            },
                            {
                                id: 'first_strike_edge',
                                name: 'Freshly Sharpened',
                                description: '+2 damage on first strike with self-crafted mundane weapons per combat encounter',
                                damageModifier: {
                                    magnitude: 2,
                                    magnitudeType: 'flat',
                                    condition: 'first_strike_per_encounter',
                                    equipmentCondition: 'mundane_self_crafted'
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    targetingConfig: {
                        targetingType: 'self',
                        rangeType: 'self_centered'
                    }
                },
                {
                    id: 'the_last_harvest',
                    name: 'The Last Harvest',
                    description: 'When the Hearthorn drops below 25% HP, the body enters a state that battlefield medics call "the last harvest" — a desperate, animal survival mode that saves the life by sacrificing wholeness. Gain +10% damage resistance and +2 to all saving throws while below 25% HP. COST: While in this state, the Hearthorn cannot be healed above 50% of their maximum HP until they receive a full rest. Flesh knits wrong. Bones set crooked. The wounds close, but they close like a farmer mends a fence — functionally, ugly, and never quite right. Survival comes at the cost of wholeness.',
                    level: 1,
                    icon: 'ability_warrior_improveddisciplines',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff', 'debuff'],
                    typeConfig: {
                        school: 'biological',
                        secondaryElement: 'survival',
                        icon: 'ability_warrior_improveddisciplines',
                        tags: ['resistance', 'saving_throw', 'healing_cap', 'conditional', 'passive']
                    },
                    buffConfig: {
                        buffType: 'statEnhancement',
                        effects: [
                            {
                                id: 'desperation_resistance',
                                name: 'Last Stand Constitution',
                                description: '+10% damage resistance while below 25% HP',
                                resistanceModifier: {
                                    reductionPercent: 10,
                                    condition: 'hp_below_25_percent',
                                    description: 'The body refuses to die — tissue calcifies, blood thickens, the animal takes over'
                                }
                            },
                            {
                                id: 'desperation_saves',
                                name: 'Cornered Animal',
                                description: '+2 to all saving throws while below 25% HP',
                                statModifier: {
                                    stat: 'all_saving_throws',
                                    magnitude: 2,
                                    magnitudeType: 'flat',
                                    condition: 'hp_below_25_percent'
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'conditional',
                        durationUnit: 'conditional',
                        canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'statEnhancement',
                        effects: [
                            {
                                id: 'crooked_healing',
                                name: 'Crooked Mending',
                                description: 'Cannot be healed above 50% HP until full rest — flesh knits wrong, bones set crooked',
                                statModifier: {
                                    stat: 'healing_cap',
                                    magnitude: 50,
                                    magnitudeType: 'percentage_cap',
                                    condition: 'hp_was_below_25_percent',
                                    removedBy: 'full_rest',
                                    description: 'Survival came at the cost of wholeness — the farmer\'s mend, ugly and permanent'
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'conditional',
                        durationUnit: 'conditional',
                        canBeDispelled: false
                    },
                    targetingConfig: {
                        targetingType: 'self',
                        rangeType: 'self_centered'
                    }
                }
            ]
        },
        pale_born: {
            id: 'paleborn_human',
            name: 'Pale-Born',
            description: 'Generations of families living near ley-lines, arcane ruins, or cursed battlefields produced a subrace touched by raw magical resonance. Pale skin, almost translucent — you can see the veins beneath, and they glow faintly violet in the dark. Eyes that catch light wrong, as though the pupil is deeper than it should be. They are Human — but wrong. Like a portrait painted from memory rather than from life. Their blood conducts arcane energy the way copper conducts lightning, and it is killing them slowly from the inside out. Other Humans distrust them instinctively. The Pale-Born do not blame them.',
            culturalBackground: 'Pale-Born exist on the fringes of Human society — distrusted by their own kind, drawn to the arcane forces that marked their bloodlines. Their enclaves are built in places no other race can tolerate: ley-convergence craters, ruined battlefields still saturated with spell-residue, the shadows beneath ancient towers. They read magical currents the way sailors read the sea, and they trade in secrets that other Humans do not want to know. Their gatherings are not festivals but seances — channeling ley-energy through blood rituals not for worship, but for information about storms on the horizon.',
            statModifiers: {
                intelligence: 2,
                spirit: 1,
                constitution: -2
            },
            baseStats: {
                armor: 0,
                hp: 24,
                mana: 24,
                ap: 3,
                passivePerception: 12,
                swimSpeed: 15,
                climbSpeed: 15,
                visionRange: 30,
                darkvision: 30,
                initiative: 1
            },
            savingThrowModifiers: {
                advantage: ['arcane', 'magical_detection'],
                disadvantage: ['radiant', 'anti_magic']
            },
            traits: [
                {
                    id: 'mortal_frailty_human_paleborn',
                    name: 'Mortal Frailty',
                    description: 'Base Health Pool reduced by 10%. Humans are biologically the most fragile sapient species.',
                    level: 1,
                    icon: 'ability_rogue_bloodyeye',
                    spellType: 'PASSIVE',
                    effectTypes: ['debuff'],
                    typeConfig: {
                        school: 'biological', secondaryElement: 'frailty', icon: 'ability_rogue_bloodyeye',
                        tags: ['vulnerability', 'health', 'passive', 'base_race']
                    },
                    debuffConfig: {
                        debuffType: 'statEnhancement',
                        effects: [
                            {
                                id: 'reduced_hp', name: 'Frail Constitution', description: '-10% base Health Pool',
                                statModifier: { stat: 'hp', magnitude: -10, magnitudeType: 'percentage' }
                            }
                        ],
                        durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' }
                },
                {
                    id: 'short_straw_human_paleborn',
                    name: 'The Short Straw',
                    description: '+25% damage from aging, time-manipulation, and necrotic life-drain effects (Susceptible tier: x1.25).',
                    level: 1,
                    icon: 'spell_shadow_lifedrain',
                    spellType: 'PASSIVE',
                    effectTypes: ['debuff'],
                    typeConfig: {
                        school: 'curse', secondaryElement: 'time', icon: 'spell_shadow_lifedrain',
                        tags: ['vulnerability', 'necrotic', 'aging', 'passive', 'base_race']
                    },
                    debuffConfig: {
                        debuffType: 'statusEffect',
                        effects: [
                            {
                                id: 'necrotic_susceptible', name: 'Necrotic Susceptible',
                                description: '+25% damage from aging, time-manipulation, and necrotic life-drain',
                                statusEffect: { vulnerabilityType: 'necrotic', vulnerabilityPercent: 25, appliesTo: ['aging', 'time_manipulation', 'life_drain'] }
                            }
                        ],
                        durationType: 'permanent', canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' }
                },
                {
                    id: 'desperate_will_human_paleborn',
                    name: 'Desperate Will',
                    description: '+2 Spirit, advantage on saves vs Fear, Charm, and Domination.',
                    level: 1,
                    icon: 'spell_holy_divinespirit',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff'],
                    typeConfig: {
                        school: 'willpower', secondaryElement: 'spirit', icon: 'spell_holy_divinespirit',
                        tags: ['spirit', 'willpower', 'fear_resist', 'charm_resist', 'passive', 'base_race']
                    },
                    buffConfig: {
                        buffType: 'statEnhancement',
                        effects: [
                            {
                                id: 'spirit_bonus', name: 'Iron Will', description: '+2 Spirit',
                                statModifier: { stat: 'spirit', magnitude: 2, magnitudeType: 'flat' }
                            }
                        ],
                        durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' }
                },
                {
                    id: 'cultural_fluency_human_paleborn',
                    name: 'Cultural Fluency',
                    description: 'Advantage on Diplomacy, Persuasion, Trade with non-hostile humanoids. Reversed to disadvantage with historically oppressed factions.',
                    level: 1,
                    icon: 'achievement_reputation_01',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff', 'debuff'],
                    typeConfig: {
                        school: 'social', secondaryElement: 'persuasion', icon: 'achievement_reputation_01',
                        tags: ['social', 'persuasion', 'trade', 'conditional', 'passive', 'base_race']
                    },
                    buffConfig: {
                        buffType: 'social',
                        effects: [
                            {
                                id: 'diplomacy_advantage', name: 'Common Tongue',
                                description: 'Advantage on Diplomacy, Persuasion, Trade with non-hostile humanoids',
                                socialModifier: { skills: ['diplomacy', 'persuasion', 'trade'], bonusType: 'advantage', condition: 'target_non_hostile_humanoid' }
                            }
                        ],
                        durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'social',
                        effects: [
                            {
                                id: 'conqueror_stigma', name: 'Conqueror\'s Stigma',
                                description: 'Disadvantage on all social checks with historically oppressed factions',
                                socialModifier: { skills: ['all'], penaltyType: 'disadvantage', condition: 'target_oppressed_faction' }
                            }
                        ],
                        durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' }
                },
                {
                    id: 'second_wind_human_paleborn',
                    name: 'Second Wind',
                    description: 'Recover 15% max HP, cleanse one Fear effect. Inflicts Adrenal Debt (-30% healing received for 3 rounds).',
                    level: 1,
                    icon: 'ability_warrior_improveddisciplines',
                    spellType: 'ACTION',
                    actionPoints: 1,
                    components: ['verbal'],
                    effectTypes: ['healing', 'buff', 'debuff'],
                    typeConfig: {
                        school: 'willpower', secondaryElement: 'survival', icon: 'ability_warrior_improveddisciplines',
                        tags: ['healing', 'cleanse', 'self', 'cooldown', 'base_race']
                    },
                    buffConfig: {
                        buffType: 'heal',
                        effects: [
                            {
                                id: 'hp_recovery', name: 'Desperate Surge', description: 'Recover 15% of maximum HP',
                                healing: { type: 'percentage', magnitude: 15, target: 'self' }
                            },
                            {
                                id: 'fear_cleanse', name: 'Shake It Off', description: 'Cleanse one Fear or Fear-adjacent debuff',
                                cleanse: { effectTypes: ['fear', 'fear_adjacent'], count: 1 }
                            }
                        ],
                        durationValue: 0, durationType: 'instant', durationUnit: 'instant', canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'statusEffect',
                        effects: [
                            {
                                id: 'adrenal_debt', name: 'Adrenal Debt',
                                description: 'All healing received reduced by 30% for 3 rounds',
                                statusEffect: { level: 'moderate', healingReceivedModifier: -30, durationRounds: 3 }
                            }
                        ],
                        durationValue: 3, durationType: 'rounds', durationUnit: 'rounds', canBeDispelled: false
                    },
                    targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                    resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 1, mana: 0, components: ['verbal'] },
                    cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 }
                },
                {
                    id: 'ley_saturated_blood',
                    name: 'Ley-Saturated Blood',
                    description: 'The Pale-Born\'s blood conducts arcane energy the way copper conducts lightning. All spells cast deal +10% damage OR +10% duration (chosen at time of cast). Their bodies are living magical instruments. COST: The saturation makes them Susceptible (x1.25) to anti-magic, Dispel, and all anti-arcane effects — their blood recognizes the suppression and rebels against it violently. Inside an Anti-Magic Field, the Pale-Born takes 1d4 necrotic damage per round as suppressed blood-magic decays living tissue from the inside out. The blood does not stop being magical. It simply stops being contained.',
                    level: 1,
                    icon: 'spell_arcane_manashield',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff', 'debuff'],
                    typeConfig: {
                        school: 'arcane',
                        secondaryElement: 'ley',
                        icon: 'spell_arcane_manashield',
                        tags: ['spell_amplification', 'vulnerability', 'anti_magic', 'passive']
                    },
                    buffConfig: {
                        buffType: 'spellAmplification',
                        effects: [
                            {
                                id: 'spell_power',
                                name: 'Arcane Conduit',
                                description: '+10% spell damage or +10% spell duration (chosen at cast)',
                                spellModifier: {
                                    damageModifier: 10,
                                    durationModifier: 10,
                                    modifierType: 'percentage',
                                    condition: 'choose_damage_or_duration'
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'statusEffect',
                        effects: [
                            {
                                id: 'anti_magic_susceptible',
                                name: 'Saturated Curse',
                                description: 'Susceptible (x1.25) to anti-magic, Dispel, and anti-arcane effects',
                                statusEffect: {
                                    vulnerabilityTypes: ['anti_magic', 'dispel', 'anti_arcane'],
                                    vulnerabilityPercent: 25,
                                    treatedAs: 'partially_magical_being',
                                    description: 'Blood recognizes suppression and rebels — violently'
                                }
                            },
                            {
                                id: 'anti_magic_decay',
                                name: 'Blood Decay',
                                description: '1d4 necrotic damage per round inside Anti-Magic Fields',
                                statusEffect: {
                                    damagePerRound: '1d4',
                                    damageType: 'necrotic',
                                    condition: 'inside_anti_magic_field',
                                    description: 'Suppressed blood-magic decays living tissue — the blood does not stop being magical, it simply stops being contained'
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    targetingConfig: {
                        targetingType: 'self',
                        rangeType: 'self_centered'
                    }
                },
                {
                    id: 'pale_sight',
                    name: 'Pale Sight',
                    description: 'Permanently see magical auras within 30 feet — enchantments glow like guttering candles, magical traps pulse like infected wounds, and creatures who have cast spells within the last hour trail arcane residue like blood in water. COST: In areas of dense magical saturation (ley-convergences, active spellzones, ritual sites), the Pale-Born is blinded — all sight checks fail, disadvantage on all Perception rolls. The gift that illuminates the arcane world becomes sensory torture when that world screams too loudly.',
                    level: 1,
                    icon: 'spell_holy_mindvision',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff', 'debuff'],
                    typeConfig: {
                        school: 'divination',
                        secondaryElement: 'arcane',
                        icon: 'spell_holy_mindvision',
                        tags: ['detection', 'magic', 'vision', 'conditional', 'passive']
                    },
                    buffConfig: {
                        buffType: 'detection',
                        effects: [
                            {
                                id: 'magic_aura_vision',
                                name: 'Arcane Sight',
                                description: 'See magical auras within 30ft — enchantments, traps, recent spellcasters',
                                detectionEffect: {
                                    range: 30,
                                    detects: ['active_enchantments', 'magical_traps', 'recent_spellcasters'],
                                    duration: 'recent_cast_within_1_hour',
                                    description: 'Enchantments glow like guttering candles, spell-trails like blood in water'
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'conditional',
                        effects: [
                            {
                                id: 'arcane_overload',
                                name: 'Arcane Overload',
                                description: 'Blinded in dense magical areas — all sight checks fail, disadvantage on Perception',
                                statusEffect: {
                                    level: 'severe',
                                    effect: 'blinded',
                                    condition: 'dense_magical_environment',
                                    perceptionDisadvantage: true,
                                    allSightChecks: 'fail',
                                    description: 'The gift becomes sensory torture when the arcane world screams too loudly'
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'conditional',
                        durationUnit: 'conditional',
                        canBeDispelled: false
                    },
                    targetingConfig: {
                        targetingType: 'self',
                        rangeType: 'self_centered',
                        aoeParameters: { radius: 30 }
                    }
                },
                {
                    id: 'blood_resonance',
                    name: 'Blood Resonance',
                    description: 'Open a vein. Let the ley-saturated blood taste air. Self-inflict 5% maximum HP as the blade parts skin that is too thin and too full of magic. The blood that leaks is not red — it shimmers with the residue of every spell your bloodline has absorbed in a hundred generations. Instantly replicate any spell of 2nd level or lower that the Pale-Born witnessed being cast within the last hour. No spell slots. No components. No incantation. Just blood and memory and the screaming of the ley-lines through torn flesh. COST: The wound will not close for 2 rounds. Cannot be healed by any means during this time. Take 1d6 necrotic damage at the start of each turn for 2 rounds as blood-magic hemorrhages through the open vein. The blood does not clot. It leaks metaphysically, carrying magic and life out through a wound that remembers every spell it ever held.',
                    level: 1,
                    icon: 'spell_shadow_sacrificialshield',
                    spellType: 'ACTION',
                    actionPoints: 1,
                    components: ['somatic'],
                    effectTypes: ['utility', 'debuff'],
                    typeConfig: {
                        school: 'hemomancy',
                        secondaryElement: 'arcane',
                        icon: 'spell_shadow_sacrificialshield',
                        tags: ['spell_replication', 'blood', 'sacrifice', 'cooldown']
                    },
                    buffConfig: {
                        buffType: 'spell_replication',
                        effects: [
                            {
                                id: 'blood_sacrifice',
                                name: 'Open the Vein',
                                description: 'Self-inflict 5% max HP to catalyze spell replication',
                                selfDamage: {
                                    type: 'percentage',
                                    magnitude: 5,
                                    damageType: 'slashing',
                                    target: 'self'
                                }
                            },
                            {
                                id: 'spell_echo',
                                name: 'Spell Echo',
                                description: 'Replicate any spell of 2nd level or lower witnessed in last hour',
                                spellReplication: {
                                    maxSpellLevel: 2,
                                    timeWindow: '1_hour',
                                    bypassComponents: true,
                                    bypassSpellSlots: true
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'instant',
                        durationUnit: 'instant',
                        canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'statusEffect',
                        effects: [
                            {
                                id: 'arcane_hemorrhage',
                                name: 'Arcane Hemorrhage',
                                description: 'Cannot be healed for 2 rounds. 1d6 necrotic at start of each turn.',
                                statusEffect: {
                                    level: 'severe',
                                    healingBlocked: true,
                                    damagePerRound: '1d6',
                                    damageType: 'necrotic',
                                    durationRounds: 2,
                                    description: 'Blood does not clot — it leaks metaphysically, carrying magic and life through a wound that remembers every spell it ever held'
                                }
                            }
                        ],
                        durationValue: 2,
                        durationType: 'rounds',
                        durationUnit: 'rounds',
                        canBeDispelled: false
                    },
                    targetingConfig: {
                        targetingType: 'self',
                        rangeType: 'self_centered'
                    },
                    resourceCost: {
                        resourceTypes: ['hp'],
                        resourceValues: { hp: 5 },
                        actionPoints: 1,
                        mana: 0,
                        components: ['somatic'],
                        hpCostIsPercentage: true
                    },
                    cooldownConfig: {
                        cooldownType: 'long_rest',
                        cooldownValue: 1
                    }
                },
                {
                    id: 'translucent_flesh',
                    name: 'Translucent Flesh',
                    description: 'The Pale-Born\'s skin is nearly see-through — you can count the veins beneath it, and they glow faintly violet when the ley-lines surge. Light passes through the skin and burns the blood-magic underneath like a lens focusing sunlight onto kindling. -15% accuracy on all attack rolls and ability checks in direct sunlight. Take 1 radiant damage per hour of unprotected sun exposure as the skin blisters metaphysically. +15% vulnerability to radiant damage — the flesh was never built to hold light, only to conduct it. In darkness, the Pale-Born is comfortable. In light, they are a wound.',
                    level: 1,
                    icon: 'spell_holy_auramastery',
                    spellType: 'PASSIVE',
                    effectTypes: ['debuff'],
                    typeConfig: {
                        school: 'biological',
                        secondaryElement: 'light',
                        icon: 'spell_holy_auramastery',
                        tags: ['vulnerability', 'sunlight', 'radiant', 'accuracy', 'passive', 'isWeakness']
                    },
                    debuffConfig: {
                        debuffType: 'conditional',
                        effects: [
                            {
                                id: 'sunlight_penalty',
                                name: 'Sunblind',
                                description: '-15% accuracy on attack rolls and ability checks in direct sunlight',
                                statusEffect: {
                                    accuracyModifier: -15,
                                    condition: 'direct_sunlight',
                                    appliesTo: 'attack_rolls_and_ability_checks',
                                    description: 'Light passes through translucent skin and burns the blood-magic beneath like a lens on kindling'
                                }
                            },
                            {
                                id: 'sunburn_damage',
                                name: 'Metaphysical Sunburn',
                                description: '1 radiant damage per hour of unprotected sun exposure',
                                statusEffect: {
                                    damagePerHour: 1,
                                    damageType: 'radiant',
                                    condition: 'unprotected_sun_exposure',
                                    description: 'The skin blisters not from heat but from light itself — the flesh was never built to hold it'
                                }
                            },
                            {
                                id: 'radiant_vulnerability',
                                name: 'Lens-Flesh',
                                description: '+15% vulnerability to radiant damage',
                                statusEffect: {
                                    vulnerabilityType: 'radiant',
                                    vulnerabilityPercent: 15,
                                    description: 'In darkness, comfort. In light, a wound that does not close'
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'conditional',
                        durationUnit: 'conditional',
                        canBeDispelled: false
                    },
                    targetingConfig: {
                        targetingType: 'self',
                        rangeType: 'self_centered'
                    }
                },
                {
                    id: 'the_unsettling',
                    name: 'The Unsettling',
                    description: 'Something about the Pale-Born makes ordinary people\'s skin crawl. It is not their appearance — though the translucent skin and too-deep eyes do not help. It is something older. A genetic memory of what happens when Humans get too close to magic. Disadvantage on Persuasion and Diplomacy with non-magical humanoid NPCs. Advantage on Intimidation against superstitious or magic-fearing NPCs. COST: Non-magical humanoid NPCs have a flat 15% chance per social interaction to become Hostile regardless of context, charm, or prior relationship. The Pale-Born does not choose to unsettle. It is a reflex, like breathing — and just as involuntary. Something in the blood broadcasts wrongness on a frequency that Humans have evolved to fear.',
                    level: 1,
                    icon: 'spell_shadow_curse',
                    spellType: 'PASSIVE',
                    effectTypes: ['buff', 'debuff'],
                    typeConfig: {
                        school: 'social',
                        secondaryElement: 'fear',
                        icon: 'spell_shadow_curse',
                        tags: ['social', 'intimidation', 'persuasion', 'hostility', 'passive']
                    },
                    buffConfig: {
                        buffType: 'social',
                        effects: [
                            {
                                id: 'fearful_reputation',
                                name: 'Arcane Menace',
                                description: 'Advantage on Intimidation vs superstitious or magic-fearing NPCs',
                                socialModifier: {
                                    skill: 'intimidation',
                                    bonusType: 'advantage',
                                    condition: 'target_superstitious_or_magic_fearing'
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    debuffConfig: {
                        debuffType: 'social',
                        effects: [
                            {
                                id: 'unsettling',
                                name: 'Wrong',
                                description: 'Disadvantage on Persuasion and Diplomacy with non-magical humanoids',
                                socialModifier: {
                                    skills: ['persuasion', 'diplomacy'],
                                    penaltyType: 'disadvantage',
                                    condition: 'target_non_magical_humanoid'
                                }
                            },
                            {
                                id: 'primal_fear',
                                name: 'Primal Fear Response',
                                description: '15% chance per social interaction for non-magical humanoid NPCs to become Hostile',
                                socialModifier: {
                                    penaltyType: 'random_hostility',
                                    triggerChance: 15,
                                    triggerType: 'flat_percentage',
                                    appliesTo: 'non_magical_humanoid_npcs',
                                    bypasses: ['charm', 'prior_relationship', 'context'],
                                    description: 'Something in the blood broadcasts wrongness on a frequency Humans evolved to fear'
                                }
                            }
                        ],
                        durationValue: 0,
                        durationType: 'permanent',
                        durationUnit: 'permanent',
                        canBeDispelled: false
                    },
                    targetingConfig: {
                        targetingType: 'self',
                        rangeType: 'self_centered'
                    }
                }
            ]
        }
    }
};
