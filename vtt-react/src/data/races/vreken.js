export const vreken = {
        id: 'vreken',
        name: 'Vreken',
        essence: 'Predatory beast-kin',
        description: 'There is a second heartbeat beneath our ribs, a frantic, wild rhythm that answers only to the moon and the scent of blood. We are the inheritors of the animal’s grace and its hunger, our bodies caught in a permanent tension between the man and the wolf. Our eyes gleam with a yellow, predatory light that sees the world not as cities and roads, but as territories and trails. When we run, the forest floor speaks to us in a language of crushed moss and distant movement; when we hunt, the silence is our closest ally. We do not just wear the beast; we are the beast, forever fighting to keep the human mind from drowning in the primal sea of instinct. Our hands are calloused by the wild, our teeth sharp enough to tear through the thin veil of civilization. We are the watchers at the edge of the firelight, the ones who know that the dark is not empty, but full of eyes that look exactly like ours.',
        icon: 'fas fa-paw',
        overview: 'The Vreken are people whose ancestors broke the old taboos. Drank from forbidden springs. Bound their bloodlines to beast-transformation through cursed rituals. Through generations of carrying the beast within, their bloodlines have been marked by the transformation curse. Eyes that gleam with animal cunning. Bodies that shift between human and beast. They are organized into packs that roam the wild borders between civilization and savagery. Settlements hidden in caves and ruined towers. The Vreken do not choose to transform. It is their heritage, passed down through bloodlines that carry the curse of the beast.',
        culturalBackground: `Vreken society is built on packs that roam the wild borders between civilization and savagery. Communities organized around managing the curse that binds them. Each pack traces its founding to ancestors who broke the old taboos. Drank from forbidden springs. Bound their bloodlines to beast-transformation. Their camps are hidden in caves or ruined towers. Places where the boundary between man and animal frays. Pack elders pass down the old ways. How to control the transformation. How to master the beast. How to survive the curse that claims so many. Children are taught from birth to recognize the signs. The yellow gleam in the eyes. The sudden hunger for raw meat. The dreams of running on four legs through endless forests. A Vreken first change is agony. Bones cracking. Flesh tearing. The human mind drowning in animal instinct. Some learn to master the beast. Using its strength while keeping their humanity intact. Others lose themselves entirely. Becoming monsters that hunt their own kind. Pack disputes settle through hunts and the testimony of those who have mastered the curse. Many Vreken end their days in self-imposed exile. Chaining themselves during full moons to prevent the change that would claim them forever. They are a people bound by curse and beast. Their transformation unmatched but their humanity forever threatened by the animal within.`,
        variantDiversity: 'The Vreken are divided into four major bloodlines: The Beast-Bound embrace their predatory nature, the Chain-Bound chain the beast through will and iron, the Hollow-Vein carry a curse that metastasized into uncontrolled biological revolt, and the Blood-Given starve the beast into parasitism — feeding it on the blood of others rather than their own sanity.',
        integrationNotes: {
            actionPointSystem: 'Vreken abilities focus on transformation, tracking, and bestial combat. Their shapeshifting provides versatile tactical options but carries risks.',
            backgroundSynergy: 'Vreken excel in backgrounds emphasizing nature, survival, and primal power. Their curse creates compelling internal conflicts and roleplay opportunities.',
            classCompatibility: 'Vreken make excellent druids, rangers, and primal warriors. Their transformation abilities enhance classes that benefit from versatility and physical prowess.'
        },
        meaningfulTradeoffs: 'Vreken gain powerful transformation and tracking abilities but risk losing control to their beast nature. They suffer social penalties and struggle with their dual identity.',
        baseTraits: {
            languages: ['Common', 'Beast Speech'],
            lifespan: '130-170 years',
            baseSpeed: 30,
            size: 'Medium',
            height: '5\'8" - 6\'4"',
            weight: '170-260 lbs',
            build: 'Athletic and feral'
        },
        subraces: {
            hunter: {
                id: 'hunter_vreken',
                name: 'Beast Bound',
                description: 'Most bestial of all Vreken. Eyes brightest yellow, pupils slitted like cats. Hands show permanent claw-like nails. Fur visible on arms and legs. Teeth noticeably sharp. They move with predatory grace, always ready to hunt. Many keep animal trophies. Their transformation is smooth, practiced.',
                culturalBackground: `The Beast-Bound trace their lineage to Vreken who embraced their inner beast completely. Bloodline marked by perfect mastery of the transformation. Their tradition requires that every member learn to call upon their beast form at will. Apprenticeships spent mastering the predatory instincts that come with the curse. Beast-Bound packs serve as hunters and protectors. Members able to transform into perfect predators capable of tracking prey for days. They practice ancient hunting techniques passed down through generations. How to control the transformation. How to channel animal strength. How to hunt with perfect precision. Their eyes gleam with animal cunning. Movements fluid and predatory. But the beast demands tribute. They must hunt regularly. Or the animal rage consumes their remaining humanity. Many Beast-Bound become solitary predators. Living in the wild and only visiting settlements to trade pelts for necessities. The bloodline values strength and mastery. Honor measured in hunts completed and beasts mastered. They are the hunters of Vreken society. Their transformation unmatched but their humanity forever thin over animal instinct.`,
                statModifiers: {
                    strength: 3,
                    agility: 2,
                    charisma: -3
                },
                traits: [
                    {
                        id: 'beast_form_vreken',
                        name: 'Beast Form',
                        description: 'The cursed blood in your veins boils as bones crack and reform — the beast within tears free of its prison of flesh, reshaping you into a predator hungry for the hunt.',
                        level: 1,
                        icon: 'ability_druid_primaltenacity',
                        spellType: 'ACTION',
                        effectTypes: ['transformation', 'buff'],
                        typeConfig: {
                            school: 'nature',
                            secondaryElement: 'beast',
                            icon: 'ability_druid_primaltenacity',
                            tags: ['transformation', 'beast', 'combat']
                        },
                        transformationConfig: {
                            transformationType: 'animal',
                            targetType: 'self',
                            duration: 10,
                            durationUnit: 'minutes',
                            power: 'moderate',
                            specialEffects: ['natural_weapons', 'enhanced_senses', 'animal_traits']
                        },
                        buffConfig: {
                            statModifiers: [
                                {
                                    id: 'beast_strength',
                                    name: 'Strength Enhancement',
                                    magnitude: 2,
                                    magnitudeType: 'flat',
                                    category: 'stat'
                                },
                                {
                                    id: 'beast_agility',
                                    name: 'Agility Enhancement',
                                    magnitude: 2,
                                    magnitudeType: 'flat',
                                    category: 'stat'
                                },
                                {
                                    id: 'beast_constitution',
                                    name: 'Constitution Enhancement',
                                    magnitude: 1,
                                    magnitudeType: 'flat',
                                    category: 'stat'
                                }
                            ],
                            durationValue: 10,
                            durationType: 'minutes',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 6 },
                            actionPoints: 1,
                            components: ['verbal']
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'predators_instinct_vreken',
                        name: 'Predator\'s Instinct',
                        description: 'The beast sharpens your senses beyond mortal limits — you taste fear on the wind, hear heartbeats through stone, and track prey by the scent of terror alone, though the predator\'s hunger grows harder to silence with each kill.',
                        level: 1,
                        icon: 'ability_hunter_mastermarksman',
                        spellType: 'PASSIVE',
                        effectTypes: ['utility'],
                        typeConfig: {
                            school: 'nature',
                            secondaryElement: 'beast',
                            icon: 'ability_hunter_mastermarksman',
                            tags: ['senses', 'tracking', 'passive']
                        },
                        utilityConfig: {
                            utilityType: 'detection',
                            selectedEffects: [{
                                id: 'scent',
                                name: 'Scent',
                                description: 'Can detect creatures within 60 feet by scent, even through walls. Advantage on tracking checks.',
                                range: 60
                            }],
                            duration: 10,
                            durationUnit: 'minutes',
                            power: 'minor'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        triggerConfig: {
                            global: {
                                logicType: 'AND',
                                compoundTriggers: [
                                    {
                                        triggerType: 'combat_start',
                                        conditions: {
                                            healthPercentage: 50,
                                            comparison: 'less_than'
                                        }
                                    }
                                ]
                            }
                        },
                        resourceCost: {
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'none',
                            cooldownValue: 0
                        },
                    },
                    {
                        id: 'cursed_vulnerability_vreken',
                        name: 'Cursed Vulnerability',
                        description: 'The forbidden magic woven into your bloodline can be severed by that which purifies — silver cuts through the curse\'s protection like moonlight through shadow, and radiant light burns the dark weave that holds your shapeshifting together.',
                        level: 1,
                        icon: 'spell_holy_harmundeadaura',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'radiant',
                            icon: 'spell_holy_harmundeadaura',
                            tags: ['vulnerability', 'curse', 'passive']
                        },
                        debuffConfig: {
                            statModifiers: [
                                {
                                    id: 'silver_vulnerability',
                                    name: 'Silver Vulnerability',
                                    magnitude: 50,
                                    magnitudeType: 'percentage',
                                    category: 'vulnerability'
                                },
                                {
                                    id: 'radiant_vulnerability',
                                    name: 'Radiant Vulnerability',
                                    magnitude: 50,
                                    magnitudeType: 'percentage',
                                    category: 'vulnerability'
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'none',
                            cooldownValue: 0
                        },
                    }
                ],
                languages: ['Common', 'Beast Speech', 'Primal'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 28, // Predatory but not particularly hardy
                    mana: 22,
                    ap: 4, // Predators, quick reactions - extra action point
                    passivePerception: 4, // Predator's Instinct - enhanced senses, track prey, detect by scent
                    swimSpeed: 5, // Predators, decent swimmers
                    climbSpeed: 10, // Predatory grace, excellent climbers
                    visionRange: 60,
                    darkvision: 60, // Predator's eyes, can see in darkness
                    initiative: 3 // Predatory grace, always ready to hunt - quick to react
                },
                savingThrowModifiers: {
                    // Shapeshifting curse makes them vulnerable to silver weapons
                    disadvantage: ['poison'], // Silver weapons weaken their curse
                    advantage: ['fear'] // Beast form resists fear effects
                }
            },
            penitent: {
                id: 'penitent_vreken',
                name: 'Chain Bound',
                description: 'Scars from chains and restraints cover their bodies. Eyes show less animal gleam, more human struggle. Hands bear marks from self-binding. Many wear restraining items even in human form. Their transformation is painful, bones cracking audibly. They show visible strain when resisting the change. Some have permanent partial transformations, stuck between forms.',
                culturalBackground: `The Chain-Bound trace their lineage to Vreken who fought to maintain control against the beast. Bloodline marked by constant struggle against the transformation. Their tradition requires that every member learn restraint techniques. Apprenticeships spent mastering chains and rituals that prevent the change. Chain-Bound packs serve as teachers and protectors. Members teaching others how to recognize and resist the transformation curse. They practice ancient control techniques passed down through generations. How to chain the beast. How to resist the change. How to maintain humanity despite the curse. Their bodies are covered in self-inflicted wounds from chains and restraints. Reminders of battles won against their inner beast. But their control is fragile. Stress or injury can cause partial transformations. Leaving them stuck between forms. Many Chain-Bound become healers and teachers. Using their experience to help others through their first changes. The bloodline values control and humanity. Honor measured in transformations resisted and humans saved. They are the guardians of Vreken society. Their control unmatched but their bodies forever marked by the chains that bind the beast.`,
                statModifiers: {
                    strength: -2,
                    spirit: 3,
                    intelligence: 2
                },
                traits: [
                    {
                        id: 'controlled_transformation_vreken',
                        name: 'Controlled Transformation',
                        description: 'You grip the chains of your curse and haul the beast to heel just long enough to borrow its strength — but every moment of that control costs you, the iron links biting deeper as body and spirit war against each other.',
                        level: 1,
                        icon: 'ability_druid_supriseattack',
                        spellType: 'ACTION',
                        effectTypes: ['transformation', 'utility'],
                        typeConfig: {
                            school: 'nature',
                            secondaryElement: 'beast',
                            icon: 'ability_druid_supriseattack',
                            tags: ['transformation', 'control', 'utility']
                        },
                        transformationConfig: {
                            transformationType: 'physical',
                            targetType: 'self',
                            duration: 1,
                            durationUnit: 'minutes',
                            power: 'minor',
                            specialEffects: ['enhanced_senses', 'healing_factor']
                        },
                        utilityConfig: {
                            utilityType: 'utility',
                            selectedEffects: [{
                                id: 'transformation',
                                name: 'Transformation',
                                description: 'Gain enhanced senses or rapid healing for 1 minute.'
                            }],
                            duration: 0,
                            durationUnit: 'instant',
                            power: 'minor'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            resourceTypes: ['mana'],
                            resourceValues: { mana: 8 },
                            actionPoints: 2,
                            components: ['verbal', 'somatic']
                        },
                        savingThrow: {
                            enabled: true,
                            savingThrowType: 'spirit',
                            difficultyClass: 14,
                            saveOutcome: 'partial_immunity'
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'curse_resistance_vreken',
                        name: 'Curse Resistance',
                        description: 'Every waking moment spent wrestling the beast within has forged an iron will — hexes, possessions, and enchantments slide off a mind already occupied by an endless war between man and monster.',
                        level: 1,
                        icon: 'spell_holy_removecurse',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff', 'utility'],
                        typeConfig: {
                            school: 'protection',
                            secondaryElement: 'curse',
                            icon: 'spell_holy_removecurse',
                            tags: ['resistance', 'curse', 'passive']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Curse Resistance',
                                    description: 'Advantage on saves against curses and lycanthropy',
                                    statusEffect: {
                                        level: 'moderate',
                                        saveType: 'spirit',
                                        saveDC: 0,
                                        saveOutcome: 'negates'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        utilityConfig: {
                            utilityType: 'divination',
                            selectedEffects: [{
                                id: 'detection',
                                name: 'Detection',
                                description: 'Can sense supernatural afflictions within 30 feet.'
                            }],
                            duration: 0,
                            durationUnit: 'instant',
                            power: 'minor'
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'none',
                            cooldownValue: 0
                        },
                    },
                    {
                        id: 'iron_vulnerability_vreken',
                        name: 'Iron Vulnerability',
                        description: 'The cold iron of your chains is no mere metaphor — iron weapons bite deeper against a body held together by cursed magic, and frost seeps through the cracks in your will, numbing the beast you so desperately cling to.',
                        level: 1,
                        icon: 'inv_ingot_iron',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'curse',
                            secondaryElement: 'frost',
                            icon: 'inv_ingot_iron',
                            tags: ['vulnerability', 'iron', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Iron Vulnerability',
                                    description: 'Cold iron sears your cursed flesh, the metal that chains the beast also poisoning your bloodline',
                                    statModifier: {
                                        stat: 'damage_taken',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
                                    }
                                },
                                {
                                    name: 'Frost Vulnerability',
                                    description: 'Frost stiffens the chains that bind your beast, the cold making your struggle against transformation all the more painful',
                                    statModifier: {
                                        stat: 'damage_taken',
                                        magnitude: 50,
                                        magnitudeType: 'percentage'
                                    }
                                },
                                {
                                    name: 'Transformation Block',
                                    description: 'Iron shackles prevent transformation abilities',
                                    statusEffect: {
                                        level: 'severe',
                                        description: 'Cannot use transformation abilities while bound by iron'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: {
                            targetingType: 'self',
                            rangeType: 'self_centered'
                        },
                        resourceCost: {
                            actionPoints: 0,
                            mana: 0,
                            components: []
                        },
                        cooldownConfig: {
                            cooldownType: 'none',
                            cooldownValue: 0
                        },
                    }
                ],
                languages: ['Common', 'Beast Speech', 'Celestial'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: -5, // Scars from chains, physically weakened from constant struggle
                    mana: 28, // Spiritual struggle grants some mana
                    ap: 2, // Constant struggle, less action-oriented
                    passivePerception: 2, // Teachers and protectors, sense supernatural afflictions
                    swimSpeed: 0, // Not swimmers, calculated from speed
                    climbSpeed: 0, // Not climbers, struggle with transformation
                    visionRange: 60,
                    darkvision: 0,
                    initiative: -1 // Visible strain, slower to react
                },
                savingThrowModifiers: {
                    // Chained nature makes them vulnerable to iron but grants mental resilience
                    disadvantage: ['poison'],
                    advantage: ['charm']
                }
            },
            hollow: {
                id: 'hollow_vreken',
                name: 'Hollow-Vein',
                description: 'Flesh that shifts without permission. Bones that crack and reform like ice on a spring thaw. Their eyes are milky, half-blind — the body spends its sight on seeing itself. Scars open and close in real time. Their pulse beats in multiple places at once, as if the heart cannot decide where to live. They carry the stench of raw meat and iron. Children flee. Dogs bark at nothing where they stood.',
                culturalBackground: `The Hollow-Vein trace their corruption to the Third Pack — a bloodline that interbred with a strain of the curse so virulent it never settled into a proper transformation. Instead of man-or-beast, they became both and neither. Their bodies mutate without stimulus. A rib might push through the chest during sleep. A hand might grow an extra finger at breakfast. Their packs are small and nomadic, driven out of every Vreken settlement within a generation. Even other Vreken find them disturbing. They are cared for, pityingly, like a wound that will not close. Their elders teach acceptance — not mastery of the beast, and not resistance to it, but surrender to the fact that the body will do what it will. Some become shock troops. Others become hermits, living in caves where the noise of their own bones restructuring doesn't frighten the wildlife. A Hollow-Vein who survives to old age is a miracle of catastrophic biology — a walking museum of every mutation the curse has ever attempted, most of them failed, all of them still visible beneath translucent, scar-tissued skin.`,
                statModifiers: {
                    constitution: 4,
                    agility: 1,
                    charisma: -4
                },
                traits: [
                    {
                        id: 'rupture_hollow_vreken',
                        name: 'Rupture',
                        description: 'You grip the shifting meat of your own torso and PULL — ribs crack outward like a blooming corpse-flower, spraying bone shrapnel and black curse-blood in a widening cone of agony. Your body will rebuild. Theirs will not.',
                        level: 1,
                        icon: 'ability_rogue_bloodyeye',
                        spellType: 'ACTION',
                        effectTypes: ['damage'],
                        typeConfig: {
                            school: 'necrotic',
                            secondaryElement: 'piercing',
                            icon: 'ability_rogue_bloodyeye',
                            tags: ['self-harm', 'area', 'burst']
                        },
                        damageConfig: {
                            formula: '3d8 + constitution/3',
                            damageTypes: ['piercing', 'necrotic'],
                            resolution: 'DICE',
                            selfDamage: {
                                formula: '1d8',
                                damageTypes: ['necrotic'],
                                description: 'The rupture tears at your own corrupted flesh'
                            }
                        },
                        targetingConfig: {
                            targetingType: 'cone',
                            rangeType: 'self_centered',
                            rangeDistance: 15,
                            areaShape: 'cone',
                            areaSize: 15,
                            targetRestrictions: ['enemies']
                        },
                        resourceCost: {
                            actionPoints: 2,
                            mana: 4,
                            components: ['somatic']
                        },
                        cooldownConfig: {
                            cooldownType: 'turn_based',
                            cooldownValue: 3
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'living_siege_hollow_vreken',
                        name: 'Living Siege',
                        description: 'Between each heartbeat, your body rewrites itself. Bone plates push through muscle. Tendons calcify into natural armor. A third lung inflates somewhere behind your kidney. You are a living siege engine that doesn\'t know what shape it will take next.',
                        level: 1,
                        icon: 'ability_warrior_intensifyrage',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'nature',
                            secondaryElement: 'beast',
                            icon: 'ability_warrior_intensifyrage',
                            tags: ['mutation', 'passive', 'combat']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Bone Plating',
                                    description: 'Armor increases by 3 as bone plates erupt beneath skin',
                                    statModifier: { stat: 'armor', magnitude: 3, magnitudeType: 'flat' },
                                    triggerCondition: 'start_of_turn'
                                },
                                {
                                    name: 'Sinew Hardening',
                                    description: 'Dodge increases by 2 as tendons calcify into reactive cables',
                                    statModifier: { stat: 'dodge', magnitude: 2, magnitudeType: 'flat' },
                                    triggerCondition: 'start_of_turn'
                                },
                                {
                                    name: 'Frenzy Gland',
                                    description: 'Melee damage increases by 1d4 as a vestigial gland pumps combat hormones',
                                    statModifier: { stat: 'damage_bonus', magnitude: 4, magnitudeType: 'flat' },
                                    triggerCondition: 'start_of_turn'
                                }
                            ],
                            durationType: 'round',
                            durationValue: 1,
                            canBeDispelled: false,
                            selectionType: 'random_one'
                        },
                        triggerConfig: {
                            global: {
                                logicType: 'AND',
                                compoundTriggers: [
                                    { triggerType: 'turn_start', conditions: {} }
                                ]
                            }
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { actionPoints: 0, mana: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'flesh_reclaims_hollow_vreken',
                        name: 'Flesh Reclaims',
                        description: 'Your body is an endless civil war between destruction and reconstruction. Bone splinters are reabsorbed. Torn muscle weaves itself shut with black, fibrous threads. You heal not because you are healthy, but because the curse refuses to let its host die before it has finished hollowing you out.',
                        level: 1,
                        icon: 'spell_nature_regeneration',
                        spellType: 'PASSIVE',
                        effectTypes: ['healing'],
                        typeConfig: {
                            school: 'nature',
                            secondaryElement: 'necrotic',
                            icon: 'spell_nature_regeneration',
                            tags: ['regeneration', 'passive']
                        },
                        healingConfig: {
                            formula: '1d6',
                            healingType: 'regeneration',
                            triggerType: 'turn_start',
                            conditions: {
                                healthPercentage: 100,
                                comparison: 'less_than'
                            }
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        triggerConfig: {
                            global: {
                                logicType: 'AND',
                                compoundTriggers: [
                                    { triggerType: 'turn_start', conditions: { healthPercentage: 100, comparison: 'less_than' } }
                                ]
                            }
                        },
                        resourceCost: { actionPoints: 0, mana: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'splintered_reflex_hollow_vreken',
                        name: 'Splintered Reflex',
                        description: 'Strike a Hollow-Vein and you\'ll pull back a hand full of splinters. Their bones fracture on impact — but the shards shoot outward like diseased caltrops, embedding in whatever fool thought to touch them.',
                        level: 1,
                        icon: 'spell_nature_thorns',
                        spellType: 'PASSIVE',
                        effectTypes: ['damage'],
                        typeConfig: {
                            school: 'physical',
                            secondaryElement: 'piercing',
                            icon: 'spell_nature_thorns',
                            tags: ['reactive', 'thorns', 'passive']
                        },
                        damageConfig: {
                            formula: '1d6 + constitution/4',
                            damageTypes: ['piercing'],
                            resolution: 'DICE',
                            reactiveTrigger: 'melee_hit_received'
                        },
                        targetingConfig: { targetingType: 'single', rangeType: 'melee', targetRestrictions: ['attacker'] },
                        triggerConfig: {
                            global: {
                                logicType: 'AND',
                                compoundTriggers: [
                                    { triggerType: 'melee_hit_received', conditions: {} }
                                ]
                            }
                        },
                        resourceCost: { actionPoints: 0, mana: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'fractured_constitution_hollow_vreken',
                        name: 'Fractured Constitution',
                        description: 'Your body is a patchwork of curse-stitching and misaligned bone. Poison pools in organs that shifted three days ago and forgot where the bloodstream was. A blade finds no resistance in meat that was rearranged by something that doesn\'t understand anatomy — only cruelty.',
                        level: 1,
                        icon: 'ability_creature_poison_02',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'poison',
                            secondaryElement: 'slashing',
                            icon: 'ability_creature_poison_02',
                            tags: ['vulnerability', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Poison Vulnerability',
                                    description: 'Your shifting organs cannot process toxins — poison damage dealt to you is increased',
                                    statModifier: { stat: 'damage_taken', magnitude: 50, magnitudeType: 'percentage' }
                                },
                                {
                                    name: 'Slashing Vulnerability',
                                    description: 'Your flesh barely holds together — slashing weapons cleave through curse-knit muscle as if it were wet paper',
                                    statModifier: { stat: 'damage_taken', magnitude: 50, magnitudeType: 'percentage' }
                                },
                                {
                                    name: 'Hollow Stigma',
                                    description: 'Your appearance causes visceral revulsion — disadvantage on all social interactions',
                                    statusEffect: {
                                        level: 'severe',
                                        description: 'Disadvantage on Charisma-based checks. Children weep. Dogs growl. Mirrors crack.'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { actionPoints: 0, mana: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        categoryIds: ['racial_abilities']
                    }
                ],
                languages: ['Common', 'Beast Speech', 'Abyssal'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 35,
                    mana: 18,
                    ap: 3,
                    passivePerception: 2,
                    swimSpeed: 0,
                    climbSpeed: 5,
                    visionRange: 60,
                    darkvision: 30,
                    initiative: 0
                },
                savingThrowModifiers: {
                    disadvantage: ['poison'],
                    advantage: ['disease']
                }
            },
            bloodgiven: {
                id: 'bloodgiven_vreken',
                name: 'Blood-Given',
                description: 'Sunken eyes the color of dried blood. Skin so pale the veins map themselves across it like blue rivers on a dead chart. They do not transform — the beast has been starved into something worse than a wolf. It has become a hunger with no body, a need with no limit. They carry the smell of old copper. Their touch is cold. When they smile, it is the smile of something that has learned to imitate warmth.',
                culturalBackground: `The Blood-Given are the youngest Vreken bloodline, born of desperation. Three centuries ago, a pack of Chain-Bound elders discovered a ritual — the Grave Communion — that allowed them to redirect the curse's appetite outward. Instead of fighting the beast or surrendering to it, they would feed it the blood of others. The ritual worked. The transformation stopped. The hunger did not. Blood-Given are raised from childhood to manage an appetite that never sleeps. They learn to tithe — to take just enough from prey to quiet the beast without killing. Some become healers, siphoning corrupted blood from the sick. Others become assassins, feeding the beast on the dying gasps of their targets. Their packs are secretive, insular, bonded by the shared shame of what they must do to survive. They cannot cross running water without spending double AP — the beast recoils from it, as if the current could wash away the blood it craves. They cannot enter a home uninvited — an old restriction none of them understand but all of them obey. Grave soil placed on the tongue grants temporary armor but fills the mind with the sorrow of the dead. They are haunted by the memories of every throat they've fed from. Most Blood-Given die not from violence but from starvation — choosing to let the beast consume them rather than take another life. Those who don't are the ones you should fear most.`,
                statModifiers: {
                    spirit: 3,
                    charisma: 2,
                    constitution: -3
                },
                traits: [
                    {
                        id: 'blood_tithing_bloodgiven_vreken',
                        name: 'Blood Tithing',
                        description: 'You extend the curse outward like a hook threaded through the victim\'s veins — and PULL. Their warmth floods into you. Their pulse stutters. The beast feeds, and for one terrible, beautiful moment, the hunger is silent.',
                        level: 1,
                        icon: 'spell_deathknight_bloodtap',
                        spellType: 'ACTION',
                        effectTypes: ['damage', 'healing'],
                        typeConfig: {
                            school: 'necrotic',
                            secondaryElement: 'necrotic',
                            icon: 'spell_deathknight_bloodtap',
                            tags: ['lifesteal', 'siphon', 'blood']
                        },
                        damageConfig: {
                            formula: '2d8 + spirit/3',
                            damageTypes: ['necrotic'],
                            resolution: 'DICE'
                        },
                        healingConfig: {
                            formula: 'damage_dealt',
                            healingType: 'lifesteal',
                            description: 'Heals for the full amount of necrotic damage dealt'
                        },
                        targetingConfig: {
                            targetingType: 'single',
                            rangeType: 'ranged',
                            rangeDistance: 30,
                            targetRestrictions: ['enemies']
                        },
                        resourceCost: {
                            actionPoints: 1,
                            mana: 5,
                            components: ['verbal', 'somatic']
                        },
                        cooldownConfig: {
                            cooldownType: 'turn_based',
                            cooldownValue: 2
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'hollow_maw_bloodgiven_vreken',
                        name: 'Hollow Maw',
                        description: 'The beast doesn\'t need claws when it has famine. Enemies near you feel the curse\'s appetite gnawing at their joints, clouding their eyes. It\'s not fear — it\'s hunger. Your hunger. Radiating outward like a wound that won\'t stop bleeding.',
                        level: 1,
                        icon: 'spell_shadow_shadetruesight',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'necrotic',
                            secondaryElement: 'psychic',
                            icon: 'spell_shadow_shadetruesight',
                            tags: ['aura', 'debuff', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Withering Gaze',
                                    description: 'The predatory aura saps coordination — Dodge reduced by 2 within 15 feet',
                                    statModifier: { stat: 'dodge', magnitude: -2, magnitudeType: 'flat' }
                                },
                                {
                                    name: 'Draining Presence',
                                    description: 'The curse-drain weakens strikes — damage reduced by 2 within 15 feet',
                                    statModifier: { stat: 'damage_dealt', magnitude: -2, magnitudeType: 'flat' }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false,
                            aura: {
                                radius: 15,
                                targetType: 'enemies',
                                requiresLOS: false
                            }
                        },
                        targetingConfig: {
                            targetingType: 'area',
                            rangeType: 'self_centered',
                            rangeDistance: 15,
                            areaShape: 'circle',
                            areaSize: 15,
                            targetRestrictions: ['enemies']
                        },
                        resourceCost: { actionPoints: 0, mana: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'scent_of_wounds_bloodgiven_vreken',
                        name: 'Scent of Wounds',
                        description: 'The curse can taste blood on the air from a mile away. When a creature bleeds — truly bleeds — the beast surges through your veins like a river breaking its banks, driving your strikes with the precision of something that has never known mercy.',
                        level: 1,
                        icon: 'ability_hunter_hunted',
                        spellType: 'PASSIVE',
                        effectTypes: ['buff'],
                        typeConfig: {
                            school: 'nature',
                            secondaryElement: 'beast',
                            icon: 'ability_hunter_hunted',
                            tags: ['passive', 'damage', 'wounded']
                        },
                        buffConfig: {
                            buffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Killing Precision',
                                    description: 'The beast drives your strikes toward wounded prey — +2d6 damage to targets below 50% HP',
                                    statModifier: { stat: 'damage_bonus', magnitude: 6, magnitudeType: 'flat' }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        triggerConfig: {
                            global: {
                                logicType: 'AND',
                                compoundTriggers: [
                                    {
                                        triggerType: 'attack_roll',
                                        conditions: {
                                            targetHealthPercentage: 50,
                                            comparison: 'less_than'
                                        }
                                    }
                                ]
                            }
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { actionPoints: 0, mana: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'grave_soil_communion_bloodgiven_vreken',
                        name: 'Grave Soil Communion',
                        description: 'You kneel, press a fistful of cemetery earth to your tongue, and swallow. The dead fill you — their sorrow, their silence, their patience. The beast gags on the taste of endings and retreats. Your skin calcifies with graveyard calm. But the dead do not leave quietly. Their melancholy settles behind your eyes like silt in a dried riverbed.',
                        level: 1,
                        icon: 'spell_shadow_deathanddecay',
                        spellType: 'ACTION',
                        effectTypes: ['buff', 'debuff'],
                        typeConfig: {
                            school: 'necrotic',
                            secondaryElement: 'nature',
                            icon: 'spell_shadow_deathanddecay',
                            tags: ['folklore', 'ritual', 'protection']
                        },
                        buffConfig: {
                            statModifiers: [
                                {
                                    id: 'grave_armor',
                                    name: 'Grave Armor',
                                    magnitude: 5,
                                    magnitudeType: 'flat',
                                    category: 'stat'
                                }
                            ],
                            durationValue: 3,
                            durationType: 'rounds',
                            canBeDispelled: true
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Melancholy of the Dead',
                                    description: 'The sorrow of the dead settles into your spirit — disadvantage on Spirit saving throws',
                                    statusEffect: {
                                        level: 'moderate',
                                        saveType: 'spirit',
                                        saveDC: 0,
                                        saveOutcome: 'disadvantage'
                                    }
                                }
                            ],
                            durationType: 'rounds',
                            durationValue: 3,
                            canBeDispelled: true
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: {
                            actionPoints: 1,
                            mana: 3,
                            components: ['somatic', 'material']
                        },
                        cooldownConfig: {
                            cooldownType: 'short_rest',
                            cooldownValue: 1
                        },
                        dateCreated: new Date().toISOString(),
                        lastModified: new Date().toISOString(),
                        categoryIds: ['racial_abilities']
                    },
                    {
                        id: 'starvation_pact_bloodgiven_vreken',
                        name: 'Starvation Pact',
                        description: 'The beast is not patient. It gave you power on one condition: FEED IT. When no blood crosses your tongue, the hunger turns inward, eating through your mind like acid through silk. The curse recoils from radiant light as though it were a brand, and every quiet moment is a small death of the self.',
                        level: 1,
                        icon: 'spell_shadow_requiem',
                        spellType: 'PASSIVE',
                        effectTypes: ['debuff'],
                        typeConfig: {
                            school: 'necrotic',
                            secondaryElement: 'psychic',
                            icon: 'spell_shadow_requiem',
                            tags: ['vulnerability', 'hunger', 'passive']
                        },
                        debuffConfig: {
                            debuffType: 'statusEffect',
                            effects: [
                                {
                                    name: 'Radiant Vulnerability',
                                    description: 'The curse\'s hunger recoils from purity — radiant damage dealt to you is increased by 50%',
                                    statModifier: { stat: 'damage_taken', magnitude: 50, magnitudeType: 'percentage' }
                                },
                                {
                                    name: 'Psychic Vulnerability',
                                    description: 'The endless hunger is a wound in the mind — psychic damage dealt to you is increased by 50%',
                                    statModifier: { stat: 'damage_taken', magnitude: 50, magnitudeType: 'percentage' }
                                },
                                {
                                    name: 'Running Water Aversion',
                                    description: 'Cannot cross running water without spending double AP — the beast recoils from currents as if they could wash away the blood it craves',
                                    statusEffect: {
                                        level: 'severe',
                                        description: 'Crossing running water costs double AP. The beast shrieks and claws at the inside of your skull until you reach the other bank.'
                                    }
                                }
                            ],
                            durationType: 'permanent',
                            canBeDispelled: false
                        },
                        targetingConfig: { targetingType: 'self', rangeType: 'self_centered' },
                        resourceCost: { actionPoints: 0, mana: 0, components: [] },
                        cooldownConfig: { cooldownType: 'none', cooldownValue: 0 },
                        categoryIds: ['racial_abilities']
                    }
                ],
                languages: ['Common', 'Beast Speech', 'Shadowcant'],
                speed: 30,
                baseStats: {
                    armor: 0,
                    hp: 15,
                    mana: 30,
                    ap: 3,
                    passivePerception: 3,
                    swimSpeed: 0,
                    climbSpeed: 0,
                    visionRange: 60,
                    darkvision: 60,
                    initiative: 2
                },
                savingThrowModifiers: {
                    disadvantage: ['radiant'],
                    advantage: ['necrotic']
                }
            }
        }
};
