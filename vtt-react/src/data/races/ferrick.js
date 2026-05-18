export const ferrick = {
        id: 'ferrick',
        name: 'Ferrick',
        essence: 'Scrap-born tinkerers',
        description: 'We are the forgotten children of progress, the ones who were deemed too small, too clever, too inconvenient for the empires that built and then discarded us. Born from the alchemical runoff of arcane forges, our blood runs with quicksilver and our bones are laced with the rust of a thousand broken machines. We are small — yes, smaller than you — but our minds are engines that never stop turning. Every scrap of metal is a puzzle waiting to be solved, every broken mechanism a patient that can be cured. Our fingers are stained with oil that will never wash out, our eyes reflect the blue-white flash of arc-light, and our hearts beat with the rhythm of clockwork that we did not choose but have learned to love. We build because we must. We tinker because the alternative is to be nothing more than the waste product of someone else\'s ambition. And from that waste, we have forged something entirely our own.',
        icon: 'fas fa-cog',
        overview: 'The Ferrick are small folk born from alchemical runoff near ancient arcane forges. Their blood carries quicksilver, their bones hold traces of forge-rust. Organized into workshop-clans built around scrap heaps and salvage yards. They are Small (3\'2\"-3\'10\"), the only Small race, making them uniquely nimble but vulnerable to larger creatures.',
        culturalBackground: 'Ferrick society is built around workshop-clans that inhabit scrapyards, abandoned forges, and salvage yards. Each clan claims a junk pile as ancestral territory, defending it fiercely. Children learn to scavenge before they can walk properly. The Ferrick do not choose invention — it is their nature, passed down through bloodlines that remember the alchemical fires that birthed them.',
        variantDiversity: 'The Ferrick are divided into two major workshop-clan bloodlines: The Scrapwrights build and create from salvage, turning trash into treasure. The Bonesmiths practice the forbidden art of bone-metal grafting, reinforcing their own skeletons with salvaged metal.',
        integrationNotes: {
            actionPointSystem: 'Ferrick abilities focus on crafting, salvage, and inventive solutions. Their small size provides stealth advantages but combat penalties against larger foes.',
            backgroundSynergy: 'Ferrick excel as tinkers, engineers, and salvage experts. Their crafting abilities make them valuable party members.',
            classCompatibility: 'Ferrick make excellent artificers, rogues, and ranged combatants. Their small size and crafting skills complement utility-focused classes.'
        },
        meaningfulTradeoffs: 'Ferrick gain powerful crafting abilities and small-size advantages but are physically weaker than most races. Their quicksilver blood makes them catastrophically vulnerable to lightning. Treated as vermin by most non-Ferrick societies, they face social hostility everywhere except scrapyards and tinker quarters. Their forge-born eyes are impeccable in darkness but blur and scatter in direct sunlight.',
        baseTraits: {
            languages: ['Common', 'Ferric'],
            lifespan: '40-60 years',
            baseSpeed: 25,
            size: 'Small',
            sizeCategory: 'Small',
            height: '3\'2\" - 3\'10\"',
            weight: '40-60 lbs',
            build: 'Compact and wiry',
            darkvision: 90
        },
        epicHistory: 'The Ferrick were not born — they were made. Ancient arcane forges produced runoff that pooled in forgotten corners, and from that alchemical soup, the first Ferrick crawled. Small, quick, and endlessly curious. The empires that made them considered them vermin. The Ferrick proved them wrong by building civilizations from the empires\' garbage. Every scrap heap is a Ferrick heritage site. Every broken machine is a ancestor speaking. They are Small but they are not lesser — they are the ultimate proof that worth is not measured in size.',
        notableFigures: [
            {
                name: 'Scrapsmith Glim',
                title: 'The First Tinker',
                portraitIcon: 'Armor/Head/head-golden-crown-helmet',
                backstory: 'The legendary first Ferrick who turned a pile of broken swords into a functioning clockwork workshop. Glim proved that the Ferrick could build anything from nothing.'
            }
        ],
        majorLocations: [
            {
                name: 'The Great Scrapheap',
                description: 'The largest Ferrick settlement, built into a mountain of salvage from three fallen empires. A labyrinth of tunnels and workshops where every piece of junk has a purpose.'
            }
        ],
        currentCrisis: 'The spreading darkness threatens the scrapyards. The Ferrick prepare by weaponizing their inventions and reinforcing their workshop-clans.',
        culturalPractices: 'Ferrick children learn to scavenge before they can walk. Every object is assessed for potential. Nothing is wasted. Clan disputes are settled through crafting competitions.',
        basePassives: [
            {
                id: 'vermin_status',
                name: 'Vermin Status',
                description: 'The empires that made the Ferrick classified them as vermin. Many still do. You have disadvantage on Persuasion and Intimidation checks against any non-Ferrick NPC who has no prior relationship with a Ferrick clan. In cities that enforce vermin codes, Ferrick are legally restricted to sewers, scrapyards, and designated tinker quarters. Guards may stop you on sight in upper-class districts.',
                level: 1,
                icon: 'ability_rogue_dirtydeeds',
                spellType: 'PASSIVE',
                actionPoints: 0,
                components: [],
                effectTypes: ['debuff', 'social'],
                typeConfig: { category: 'racial', isWeakness: true },
                debuffConfig: {
                    debuffType: 'socialPenalty',
                    effects: [{
                        id: 'vermin_social_penalty',
                        name: 'Vermin Status',
                        description: 'Disadvantage on Persuasion and Intimidation checks against non-Ferrick NPCs with no prior clan relationship. Subject to vermin codes in structured cities.',
                        statusEffect: {
                            penaltyType: 'social',
                            affectedSkills: ['persuasion', 'intimidation'],
                            magnitude: 'disadvantage',
                            conditions: ['non_ferrick_npc', 'no_clan_relationship']
                        }
                    }],
                    durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                },
                cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, mana: 0, components: [] }
            },
            {
                id: 'forgeborn_eyes',
                name: 'Forge-born Eyes',
                description: 'Your eyes were made for the dim glow of forge-light and the darkness of scrap tunnels. You have Superior Darkvision (90ft). However, your quicksilver-laced retinas scatter and blur in bright light — you suffer a -2 penalty to Perception checks and ranged attack rolls when in direct sunlight or brightly lit environments without cover.',
                level: 1,
                icon: 'spell_shadow_vision',
                spellType: 'PASSIVE',
                actionPoints: 0,
                components: [],
                effectTypes: ['buff', 'debuff'],
                typeConfig: { category: 'racial' },
                buffConfig: {
                    buffType: 'sensoryEnhancement',
                    effects: [{
                        id: 'forgeborn_darkvision',
                        name: 'Superior Darkvision',
                        description: 'You can see in dim light within 90ft as if it were bright light, and in darkness as if it were dim light.',
                        statModifier: { stat: 'darkvision', magnitude: 90, magnitudeType: 'flat' }
                    }],
                    durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                },
                debuffConfig: {
                    debuffType: 'sensoryPenalty',
                    effects: [{
                        id: 'forgeborn_light_sensitivity',
                        name: 'Light Sensitivity',
                        description: '-2 penalty to Perception checks and ranged attack rolls in direct sunlight or brightly lit environments without cover. Quicksilver retinas scatter and blur in bright light.',
                        statusEffect: {
                            penaltyType: 'stat_penalty',
                            affectedStats: ['perception', 'ranged_attacks'],
                            magnitude: -2,
                            conditions: ['direct_sunlight', 'bright_light_no_cover']
                        }
                    }],
                    durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                },
                cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, mana: 0, components: [] }
            }
        ],
        subraces: {
            scrapwright: {
                id: 'scrapwright_ferrick',
                name: 'Scrapwright',
                description: 'Scrapwright Ferrick are builders whose very blood fuels their creations. Their fingers are permanently stained silver with quicksilver — not just oil, but the blood that has seeped through their skin from a thousand bleeding inventions. Their eyes carry a distant, haunted quality, the gaze of someone whose mind is always half-listening to the hum of a machine only they can hear. Old Scrapwrights are found hunched over workbenches, hands still moving, minds long dissolved into the mechanisms they served.',
                culturalBackground: 'Scrapwrights build and create from salvage, turning trash into treasure. But every creation demands a blood price — their quicksilver blood is the fuel that makes their inventions work. Their workshop-clans are the architects of Ferrick society, responsible for turning scrap heaps into functioning communities. They value ingenuity above all and settle disputes through crafting competitions where the loser often leaves pale and anemic. The oldest Scrapwrights are revered and pitied in equal measure — brilliant, but hollowed out, their blood more quicksilver than life.',
                statModifiers: { intelligence: 2, agility: 1 },
                baseStats: { health: 8, mana: 4, actionPoints: 3, initiative: 1 },
                savingThrowModifiers: { advantage: ['investigation', 'crafting'], disadvantage: ['grapple_effects'] },
                traits: [
                    {
                        id: 'haemoforge_crafting',
                        name: 'Haemoforge Crafting',
                        description: 'Your blood is quicksilver, and quicksilver is the mother of machines. Slice your palm and bleed into the salvage — the quicksilver animates what dead metal cannot. Pay 1d4 HP to craft one temporary device: smoke bomb (15ft obscurement, 1 round), caltrops (10ft difficult terrain), or flash powder (Con save or blinded 1 round, 10ft radius). Items last 1 encounter. Alternatively, pay 2d4 HP to repair a broken non-magical object or restore 1d8 HP to a construct. All crafted items gain +1 quality from quicksilver infusion. CLATTERING ACTIVATION: Using Haemoforge produces a shriek of metal on metal — all creatures within 60ft are alerted to your position. Cannot be used while hidden without breaking stealth. BLOOD THINNING: Each use imposes a stacking -1 penalty to your maximum HP until your next long rest. Your blood literally runs thinner with each creation. The old Scrapwrights who invented too much are pale as bone-paper, their veins visible silver threads beneath translucent skin.',
                        level: 1,
                        icon: 'inv_misc_enggizmos_27',
                        spellType: 'ACTION',
                        actionPoints: 1,
                        components: ['verbal', 'somatic'],
                        effectTypes: ['utility', 'healing'],
                        typeConfig: { category: 'racial' },
                        utilityConfig: {
                            utilityType: 'crafting',
                            selectedEffects: [
                                { id: 'haemoforge_salvage', name: 'Quicksilver Infusion', description: 'Bleed quicksilver into salvage to animate it — +1 quality to all crafted items' },
                                { id: 'craft_smoke_bomb', name: 'Craft Smoke Bomb', description: '15ft obscurement for 1 round from salvaged materials and blood' },
                                { id: 'craft_caltrops', name: 'Craft Caltrops', description: '10ft difficult terrain from blood-hardened salvage' },
                                { id: 'craft_flash_powder', name: 'Craft Flash Powder', description: 'Con save or blinded 1 round, 10ft radius — quicksilver flash' },
                                { id: 'repair_object', name: 'Haemoforge Repair', description: 'Pay 2d4 HP to mend a non-magical object or heal a construct 1d8 HP' },
                                { id: 'clattering_activation', name: 'Clattering Activation', description: 'Loud metallic shriek alerts all creatures within 60ft — breaks stealth' }
                            ],
                            duration: 1,
                            durationUnit: 'encounter'
                        },
                        healingConfig: {
                            formula: '1d8',
                            healType: 'construct',
                            resolution: 'DICE',
                            conditions: { hpCost: '2d4', target: 'construct_or_object' }
                        },
                        debuffConfig: {
                            debuffType: 'selfHarm',
                            effects: [
                                { id: 'haemoforge_hp_cost', name: 'Blood Price', description: 'Pay 1d4 HP (2d4 for repair/construct heal). Your quicksilver blood fuels the creation.', statusEffect: { penaltyType: 'hp_cost', magnitude: '1d4', magnitudeType: 'dice' } },
                                { id: 'blood_thinning', name: 'Blood Thinning', description: 'Stacking -1 max HP per use until long rest. The old Scrapwrights who invented too much are pale as bone-paper, veins visible silver threads beneath translucent skin.', statusEffect: { penaltyType: 'max_hp_reduction', magnitude: -1, magnitudeType: 'stacking', resetCondition: 'long_rest' } }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 1,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'scavengers_trance',
                        name: "Scavenger's Trance",
                        description: 'Spend 1 minute studying any mechanical device, trap, or mechanism. The quicksilver in your blood redirects ALL cognitive function to pattern recognition — you understand its complete function: hidden compartments, trigger mechanisms, structural weaknesses. Gain advantage on the next check to disarm, repair, or exploit that device. You always find the most valuable salvage in any wreckage — your blood hums in the presence of useful metal. OBLIVIOUS FUGUE: While analyzing, you are completely deaf and blind to everything that is not the device. Disadvantage on all Perception checks. Cannot react to surprise attacks. Your party must guard your frozen body while your mind dissolves into the machine. Scrapwrights who stay in the trance too long sometimes forget to come back.',
                        level: 1,
                        icon: 'ability_rogue_findweakness',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['detection', 'utility', 'debuff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'sensoryEnhancement',
                            effects: [
                                { id: 'device_analysis', name: 'Quicksilver Pattern Recognition', description: 'Study a device for 1 minute to understand it completely. Advantage to disarm, repair, or exploit it.', statModifier: { stat: 'investigation', magnitude: 'advantage', magnitudeType: 'advantage', conditions: ['mechanical_devices', 'traps'] } },
                                { id: 'best_loot', name: "Scavenger's Intuition", description: 'Always find the most valuable salvage in any wreckage — your blood hums in the presence of useful metal.', statusEffect: { level: 'minor', description: 'Automatic best salvage detection' } }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'sensoryPenalty',
                            effects: [{
                                id: 'oblivious_fugue',
                                name: 'Oblivious Fugue',
                                description: 'While analyzing a device, completely deaf and blind to non-device stimuli. Disadvantage on all Perception checks. Cannot react to surprise. Your blood has redirected ALL cognitive function to pattern recognition.',
                                statusEffect: {
                                    penaltyType: 'sensory_lockout',
                                    affectedSenses: ['hearing', 'peripheral_vision'],
                                    affectedSkills: ['perception'],
                                    magnitude: 'disadvantage',
                                    conditions: ['active_analysis'],
                                    surpriseImmunity: false
                                }
                            }],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'rat_king_mobility',
                        name: 'Rat-King Mobility',
                        description: 'SLIP THROUGH: Move through the space of any creature Medium or larger without provoking opportunity attacks — you are small enough to slip between legs, under carts, through gaps that larger creatures cannot even perceive. SCRAP-HIDE: In environments with machinery, scrap, ruins, or manufactured clutter, take the Hide action as a bonus action. Your small frame fits into gaps that do not exist for others. BARREN EXPOSURE: In open natural environments — fields, open water, clean forests with no ruins or wreckage — you suffer -2 Dodge and disadvantage on Stealth checks. Without scrap to hide behind, your small frame and reflective quicksilver blood catch every beam of light like a cursed mirror. In the open, you are not hidden. You are prey.',
                        level: 1,
                        icon: 'ability_rogue_stealth',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['movement', 'buff', 'debuff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'movementBuff',
                            effects: [
                                { id: 'slip_through', name: 'Slip Through', description: 'Move through the space of any creature Medium or larger without provoking opportunity attacks.', statusEffect: { level: 'minor', description: 'Movement through larger creatures\' spaces without OA' } },
                                { id: 'scrap_hide', name: 'Scrap-Hide', description: 'In environments with machinery, scrap, ruins, or manufactured clutter, Hide as a bonus action.', statModifier: { stat: 'stealth', magnitude: 'bonus_action_hide', magnitudeType: 'action_economy', conditions: ['machinery', 'scrap', 'ruins', 'cluttered'] } }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'environmentalPenalty',
                            effects: [{
                                id: 'barren_exposure',
                                name: 'Barren Exposure',
                                description: 'In open natural environments — fields, open water, clean forests — suffer -2 Dodge and disadvantage on Stealth. Your reflective quicksilver blood catches every beam of light. In the open, you are prey.',
                                statusEffect: {
                                    penaltyType: 'exposure',
                                    affectedStats: ['dodge', 'stealth'],
                                    dodgePenalty: -2,
                                    stealthPenalty: 'disadvantage',
                                    conditions: ['open_fields', 'open_water', 'clean_forest', 'no_ruins']
                                }
                            }],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'tinkers_dementia',
                        name: "Tinker's Dementia",
                        description: 'When you encounter a broken, unusual, or unfamiliar mechanical device for the first time, you must make a Spirit save (DC 14) or be compelled to examine it. On failure, your next action is consumed studying the device — your hands move of their own accord, your blood sings with the need to understand. This is not curiosity. It is a biological compulsion — your forge-born blood demands you understand machines the way lungs demand air. You are immune during active combat rounds, but the compulsion triggers immediately when combat ends if devices remain unexamined. DARK ESCALATION: Each failed save worsens the dementia. The DC increases by +2 for each previous failure that day (resets on long rest). Old Scrapwrights who fail too many saves never come back from the trance. Their bodies are found hunched over machines, hands still moving, minds long dissolved into quicksilver.',
                        level: 1,
                        icon: 'inv_misc_enggizmos_03',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['debuff'],
                        typeConfig: { category: 'racial', isWeakness: true },
                        debuffConfig: {
                            debuffType: 'compulsion',
                            effects: [{
                                id: 'tinker_dementia_effect',
                                name: "Tinker's Dementia",
                                description: 'Forced to examine broken/unusual devices (Spirit save or lose next action). DC escalates +2 per failure each day. Suspended during combat, triggers when combat ends if devices are unexamined.',
                                statusEffect: {
                                    compulsionType: 'device_fascination',
                                    trigger: 'first_encounter_broken_unusual_device',
                                    saveType: 'spirit',
                                    saveDC: 14,
                                    dcEscalation: { amount: 2, trigger: 'failed_save', resetCondition: 'long_rest' },
                                    failureEffect: 'lose_next_action',
                                    combatImmunity: true,
                                    postCombatTrigger: true,
                                    loreNote: 'Old Scrapwrights who fail too many saves never come back from the trance. Bodies found hunched over machines, hands still moving, minds dissolved into quicksilver.'
                                }
                            }],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, mana: 0, components: [] }
                    },
                    {
                        id: 'quicksilver_conflagration',
                        name: 'Quicksilver Conflagration',
                        description: 'The quicksilver in your blood is not merely present — it is volatile alchemical residue that superheats under electrical current. When lightning strikes you, your blood does not simply conduct — it boils. The quicksilver vents through your pores as toxic silver vapor, burning your skin from within and poisoning the air around you. You are not merely weak to lightning. You are a living chemical weapon that punishes everyone standing near you when the current flows.',
                        level: 1,
                        icon: 'spell_nature_lightning',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['vulnerability', 'debuff'],
                        typeConfig: { category: 'racial', isWeakness: true },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [
                                {
                                    id: 'lightning_vulnerability',
                                    name: 'Quicksilver Boiling',
                                    description: 'The quicksilver in your blood supercharges when struck by lightning — electrical current courses through your veins, boiling the quicksilver from within.',
                                    statusEffect: {
                                        vulnerabilityType: 'lightning',
                                        vulnerabilityPercent: 100
                                    }
                                },
                                {
                                    id: 'quicksilver_fumes',
                                    name: 'Toxic Quicksilver Venting',
                                    description: 'When you take lightning damage, superheated quicksilver vents through your pores as toxic silver vapor. All creatures within 5ft must make a Constitution save or take 1d4 poison damage from the quicksilver fumes. You are a living chemical weapon that poisons your allies when the current flows.',
                                    statusEffect: {
                                        secondaryDamageType: 'poison',
                                        secondaryDamageFormula: '1d4',
                                        triggerCondition: 'lightning_damage_taken',
                                        areaOfEffect: { shape: 'circle', radius: 5, unit: 'ft' },
                                        saveConfig: { saveType: 'constitution', saveOutcome: 'negates' },
                                        affects: 'all_creatures_in_range'
                                    }
                                }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                    }
                ]
            },
            bonesmith: {
                id: 'bonesmith_ferrick',
                name: 'Bonesmith',
                description: 'Bonesmith Ferrick practice the forbidden art of bone-metal grafting — hammering salvaged metal plates directly into their own skeletons. But the metal they graft is not always mere salvage. The oldest Bonesmith workshops keep archives of their dead, and the most powerful grafts are made from the bones of deceased Ferrick ancestors, their quicksilver still faintly luminous in the marrow. Their movements carry a grinding rasp, their skin shows ridges where living flesh meets dead metal. They are heavier and sturdier than other Ferrick, and they hear things — whispers from the bones they carry that are not their own.',
                culturalBackground: 'Bonesmiths practice the forbidden art of bone-metal grafting, reinforcing their own skeletons with salvaged metal and the bones of their dead. Their workshop-clans are the defenders of Ferrick society, using their enhanced bodies to protect scrapyards from threats. They value endurance above all and view the body as a machine that can be improved — but every improvement has a voice, and the voices belong to the dead. Young Bonesmiths undergo their first grafting in silence — those who scream are deemed unworthy of the ancestors\' bones.',
                statModifiers: { constitution: 2, strength: 1 },
                baseStats: { health: 10, mana: 2, actionPoints: 3, initiative: 0 },
                savingThrowModifiers: { advantage: ['poison', 'disease'], disadvantage: ['lightning_effects'] },
                traits: [
                    {
                        id: 'osteo_graft',
                        name: 'Osteo-Graft',
                        description: 'Hammer salvaged metal plates directly onto your exposed bones — a procedure performed without anesthesia, as tradition demands silence. For 1 hour, gain Damage Reduction 3 against all physical damage (bludgeoning, piercing, slashing — reduced by 3 before resistances). Your unarmed strikes deal 1d6 bludgeoning as metal-laced knuckles become weapons. THE GRAFTER\'S TOLL — GRAFTED WEIGHT: While plated, speed reduced by 5ft. Disadvantage on Agility checks and Agility saving throws. Cannot swim — in water deeper than your height, you sink at 10ft per round. THE WHISPERS: Each graft contains bone from dead Ferrick. While plated, at the start of each encounter make a Spirit save DC 12 or be Distracted (disadvantage on your first attack roll) as you struggle to silence the murmurs of the dead whose bones you carry. They have opinions about how you fight.',
                        level: 1,
                        icon: 'inv_shield_06',
                        spellType: 'ACTION',
                        actionPoints: 1,
                        components: ['verbal', 'somatic'],
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'statEnhancement',
                            effects: [
                                { id: 'osteo_graft_dr', name: 'Scrap-Graft Damage Reduction', description: 'Damage Reduction 3 against all physical damage — metal plates hammered onto bone absorb impacts that would shatter flesh.', statModifier: { stat: 'damage_reduction', magnitude: 3, magnitudeType: 'flat', damageTypes: ['bludgeoning', 'piercing', 'slashing'] } },
                                { id: 'osteo_graft_fists', name: 'Reinforced Fists', description: 'Metal-laced knuckles from bone grafts transform unarmed strikes into brutal weapons.', statusEffect: { level: 'moderate', description: 'Unarmed strikes deal 1d6 bludgeoning' } }
                            ],
                            durationValue: 1, durationType: 'hours', durationUnit: 'hours', canBeDispelled: false
                        },
                        debuffConfig: {
                            debuffType: 'graftedWeight',
                            effects: [
                                { id: 'osteo_graft_speed', name: 'Grafted Weight — Slowed', description: 'Speed reduced by 5ft — the metal is heavy, your small frame was not built for this.', statusEffect: { penaltyType: 'speed_reduction', magnitude: -5, unit: 'ft' } },
                                { id: 'osteo_graft_agility', name: 'Grafted Weight — Stiff Joints', description: 'Disadvantage on Agility checks and Agility saving throws — your joints are stiff, your reflexes are sluggish, the metal does not bend.', statusEffect: { penaltyType: 'disadvantage', affectedStats: ['agility_checks', 'agility_saves'] } },
                                { id: 'osteo_graft_sink', name: 'Grafted Weight — Sinking', description: 'Cannot swim while plated. Sink at 10ft per round in water deeper than your height. Metal and water do not negotiate.', statusEffect: { penaltyType: 'swim_disabled', sinkRate: 10, sinkUnit: 'ft_per_round' } },
                                { id: 'the_whispers', name: 'The Whispers', description: 'At the start of each encounter, Spirit save DC 12 or be Distracted (disadvantage on first attack roll). The dead Ferrick whose bones you carry have opinions about how you fight.', statusEffect: { penaltyType: 'distracted', triggerCondition: 'encounter_start', saveType: 'spirit', saveDC: 12, failureEffect: 'disadvantage_first_attack', loreNote: 'The dead have opinions about how you fight.' } }
                            ],
                            durationValue: 1, durationType: 'hours', durationUnit: 'hours', canBeDispelled: false
                        },
                        cooldownConfig: { cooldownType: 'long_rest', cooldownValue: 1 },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 1,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'fist_of_the_iron_dead',
                        name: 'Fist of the Iron Dead',
                        description: 'Deliver a devastating punch with your metal-reinforced fist — the bones of the dead Ferrick surge forward in your knuckles, eager to strike. One creature within 5ft takes 1d8 + Strength modifier bludgeoning damage and must make a Strength save or be knocked back 10ft. JOINT RENDING: After impact, your grafted arm spasms — disadvantage on your next attack roll as the joint resets. If Fist of the Iron Dead kills the target, this penalty is negated — adrenaline overrides the strain, and the dead bones in your arm hum with satisfaction. BONE DUST: On a natural 1, the impact shatters one of your own grafted plates. You take 1d6 piercing damage from the shrapnel AND lose the Damage Reduction from Osteo-Graft until your next long rest. Your body was never meant to withstand what you have done to it.',
                        level: 1,
                        icon: 'ability_warrior_rampage',
                        spellType: 'ACTION',
                        actionPoints: 1,
                        components: ['verbal', 'somatic'],
                        effectTypes: ['damage', 'control', 'debuff'],
                        typeConfig: { category: 'racial' },
                        targetingConfig: { range: 5, unit: 'ft' },
                        damageConfig: { damageTypes: ['bludgeoning'], formula: '1d8+STR', resolution: 'DICE' },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                { id: 'knockback', type: 'knockback', name: 'Dead-Bone Knockback', description: 'The bones of the dead surge through your fist — the impact sends the target flying backwards.', mechanicsText: 'Strength save or knocked back 10 feet.' },
                                { id: 'joint_rending', name: 'Joint Rending', description: 'Disadvantage on your next attack roll — your grafted arm spasms from the impact. Negated if the target dies.', statusEffect: { penaltyType: 'disadvantage', affectedRolls: ['next_attack'], negationCondition: 'target_killed' } },
                                { id: 'bone_dust_crit_fail', name: 'Bone Dust', description: 'On natural 1: shattered grafted plate deals 1d6 piercing to you AND removes DR from Osteo-Graft until long rest. Your body was never meant to withstand what you have done to it.', statusEffect: { penaltyType: 'self_damage', triggerCondition: 'natural_1', selfDamageFormula: '1d6', selfDamageType: 'piercing', additionalEffect: 'lose_osteo_graft_dr', additionalEffectDuration: 'long_rest' } }
                            ],
                            durationValue: 0, durationType: 'instant', durationUnit: 'instant',
                            saveConfig: { saveType: 'strength', saveDC: 'spell', successEffect: 'no_knockback' }
                        },
                        cooldownConfig: { cooldownType: 'short_rest', cooldownValue: 1 },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 1,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'corpus_machina',
                        name: 'Corpus Machina',
                        description: 'Your metal-laced skeleton does not get sick — it was not born, it was forged. Advantage on saving throws against poison and disease. Completely immune to rust, corrosion, and acid effects that target metal — your bone-metal grafts cannot be rusted, dissolved, or weakened by environmental acid or rust monsters. LIVING TOOLKIT: Your metal-reinforced fingers count as thieves\' tools for picking locks and disabling traps. You can never be disarmed — your weapons are your skeleton. BONE-SNAP: In combat, spend 1 AP to snap a shard of metal from your own bone-plating and hurl it as an improvised weapon (range 20/60ft, deals 1d6 piercing). This deals 1d4 piercing damage to YOU as you literally tear a piece of your skeleton off and throw it at your enemy. Each bone-snap leaves a permanent scar that aches in cold weather — a reminder that what you take from yourself does not grow back.',
                        level: 1,
                        icon: 'spell_shadow_demonicfortitude',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['buff', 'utility'],
                        typeConfig: { category: 'racial' },
                        buffConfig: {
                            buffType: 'statEnhancement',
                            effects: [
                                { id: 'corpus_constitution', name: 'Iron Resilience', description: 'Your metal-laced bones resist poison and disease — what was forged does not sicken.', statModifier: { stat: 'saving_throws', magnitude: 'advantage', magnitudeType: 'advantage', conditions: ['poison', 'disease'] } },
                                { id: 'corrosion_immunity', name: 'Corrosion Immunity', description: 'Completely immune to rust, corrosion, and acid effects that target metal. Your bone-metal grafts cannot be dissolved or weakened.', statusEffect: { level: 'major', description: 'Immunity to metal-targeting rust, corrosion, and acid', immunityType: 'corrosion', scope: 'metal_only' } }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        utilityConfig: {
                            utilityType: 'combat',
                            selectedEffects: [
                                { id: 'living_lockpick', name: 'Living Toolkit', description: 'Your metal-reinforced fingers count as thieves\' tools for picking locks and disabling traps.' },
                                { id: 'cannot_be_disarmed', name: 'Disarm Immune', description: 'You can never be disarmed — your weapons are your skeleton.' },
                                { id: 'bone_snap', name: 'Bone-Snap', description: 'Spend 1 AP to snap a bone shard as an improvised weapon (20/60ft, 1d6 piercing). Costs 1d4 self-damage. Each snap leaves a permanent scar that aches in cold weather.' }
                            ],
                            power: 'moderate'
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                    },
                    {
                        id: 'grinding_dirge',
                        name: 'Grinding Dirge',
                        description: 'Your metal-laced bones produce an audible grinding rasp when you move — the sound of dead Ferrick scraping against living metal, of ancestors who will not be silent. This is not optional. Disadvantage on Stealth checks in any environment not loud enough to mask the sound (battlefields, forges, thunderstorms, and waterfalls mask it; dungeons, forests, libraries, and noble halls do not). When you move more than half your speed in a turn, creatures with hearing within 30ft automatically detect your position unless ambient noise masks the sound. MOURNING CLICK: At the start of each day, roll 1d6. On a 1, one of your grafted joints has stiffened overnight — the dead Ferrick whose bones you carry tried to speak through your limbs while you slept. You suffer -5ft speed until you spend 10 minutes manually realigning the plate with a mallet. There is no pain quite like hammering your own bones back into place before breakfast.',
                        level: 1,
                        icon: 'ability_warrior_shout',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['debuff'],
                        typeConfig: { category: 'racial', isWeakness: true },
                        debuffConfig: {
                            debuffType: 'sensoryPenalty',
                            effects: [
                                {
                                    id: 'grinding_stealth',
                                    name: 'Grinding Dirge',
                                    description: 'Disadvantage on Stealth checks in quiet environments. Creatures with hearing detect you within 30ft when you move more than half speed. The sound of dead Ferrick scraping against living metal.',
                                    statusEffect: {
                                        penaltyType: 'stealth_penalty',
                                        affectedSkills: ['stealth'],
                                        magnitude: 'disadvantage',
                                        conditions: ['quiet_environment'],
                                        detectionRadius: 30,
                                        detectionTrigger: 'move_over_half_speed',
                                        maskingEnvironments: ['battlefield', 'forge', 'thunderstorm', 'waterfall']
                                    }
                                },
                                {
                                    id: 'mourning_click',
                                    name: 'Mourning Click',
                                    description: 'Each dawn, roll 1d6. On 1, a grafted joint has stiffened overnight — -5ft speed until 10 minutes manual realignment with a mallet. The dead Ferrick whose bones you carry tried to speak through your limbs while you slept.',
                                    statusEffect: {
                                        penaltyType: 'speed_reduction',
                                        triggerCondition: 'dawn_roll_1',
                                        triggerRoll: '1d6',
                                        triggerThreshold: 1,
                                        magnitude: -5,
                                        unit: 'ft',
                                        duration: 'until_realigned',
                                        realignmentTime: '10_minutes',
                                        realignmentTool: 'mallet',
                                        loreNote: 'There is no pain quite like hammering your own bones back into place before breakfast.'
                                    }
                                }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: { resourceTypes: [], resourceValues: {}, actionPoints: 0, mana: 0, components: [] }
                    },
                    {
                        id: 'iron_conduit',
                        name: 'Iron Conduit',
                        description: 'The metal in your bones conducts electrical current with devastating efficiency — lightning tears through your metallic frame and drags everything metal around you into the circuit. When lightning strikes, you are not merely wounded — you become the storm\'s anchor, a screaming lodestone that pulls weapons from allies\' hands and fuses their armor to your burning flesh.',
                        level: 1,
                        icon: 'spell_nature_lightning',
                        spellType: 'PASSIVE',
                        actionPoints: 0,
                        components: [],
                        effectTypes: ['vulnerability', 'debuff'],
                        typeConfig: { category: 'racial', isWeakness: true },
                        debuffConfig: {
                            debuffType: 'vulnerability',
                            effects: [
                                {
                                    id: 'lightning_vulnerability',
                                    name: 'Iron Conduit — Lightning',
                                    description: 'The metal in your bones conducts electrical current with devastating efficiency — lightning tears through your metallic frame.',
                                    statusEffect: {
                                        vulnerabilityType: 'lightning',
                                        vulnerabilityPercent: 100
                                    }
                                },
                                {
                                    id: 'magnetic_pull',
                                    name: 'Magnetic Pull',
                                    description: 'The metal in your bones is magnetically drawn toward the source of lightning damage — pulled 10ft toward the source.',
                                    statusEffect: {
                                        pullDistance: 10,
                                        pullUnit: 'ft',
                                        pullTrigger: 'lightning_damage'
                                    }
                                },
                                {
                                    id: 'magnetic_anchor',
                                    name: 'Magnetic Anchor',
                                    description: 'After taking lightning damage, you become a screaming lodestone. All metal objects within 10ft are pulled toward you. Allies carrying metal weapons or armor within 10ft must make a Strength save or have their equipment magnetically fuse to your body, restraining both of you for 1 round as the current arcs between you. You are not just vulnerable to lightning — you are a battlefield hazard that drags your comrades into the lightning\'s path.',
                                    statusEffect: {
                                        penaltyType: 'magnetic_anchor',
                                        triggerCondition: 'lightning_damage_taken',
                                        areaOfEffect: { shape: 'circle', radius: 10, unit: 'ft' },
                                        targetCondition: 'carrying_metal',
                                        saveConfig: { saveType: 'strength', saveOutcome: 'negates' },
                                        failureEffect: 'equipment_fused_restrained',
                                        failureDuration: 1,
                                        failureDurationUnit: 'rounds',
                                        affects: 'allies_with_metal'
                                    }
                                }
                            ],
                            durationValue: 0, durationType: 'permanent', durationUnit: 'permanent', canBeDispelled: false
                        },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        resourceCost: {
                            resourceTypes: [],
                            resourceValues: {},
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                    }
                ]
            }
        }
};
