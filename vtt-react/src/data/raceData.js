/**
 * Race Data Module
 * 
 * Defines all playable races and their subraces with complete mechanical data
 * including stat modifiers, racial traits, languages, lifespans, and movement speeds.
 */

// Base race definitions with their subraces
export const RACE_DATA = {
    nordmark: {
        id: 'nordmark',
        name: 'Nordmark',
        description: 'Iron-willed descendants of the frozen northlands where winter never dies',
        icon: 'fas fa-mountain',
        overview: 'The Nordmark are the hardy folk of the eternal winter lands, where the sun barely rises and survival depends on strength of arm and will. They are descended from ancient warrior-kings who carved kingdoms from ice and stone.',
        culturalBackground: `The Nordmark are the hardy folk of the eternal winter lands, where the sun barely rises and survival depends on strength of arm and will. They are descended from ancient warrior-kings who carved kingdoms from ice and stone. Their culture revolves around honor, strength, and the belief that a glorious death in battle ensures a place in the halls of their ancestors. They are natural warriors and leaders, though their pride and quick tempers often lead them into conflict with more diplomatic peoples.`,
        variantDiversity: 'The Nordmark have developed into distinct variants, each adapted to different circumstances and lifestyles: Berserker Nordmark embrace the fury of battle above all else, Skald Nordmark preserve ancient sagas and inspire others, and Icewalker Nordmark have adapted to the harshest frozen wastes.',
        integrationNotes: {
            actionPointSystem: 'Many racial traits interact with the AP system, providing unique tactical options during combat and exploration. Each variant offers different AP-based abilities.',
            backgroundSynergy: 'Consider how your chosen variant\'s traits complement your background path. Different variants may synergize better with specific backgrounds.',
            classCompatibility: 'While any variant can pursue any class, certain racial traits may enhance specific class features or playstyles. Choose your variant based on your intended build.'
        },
        meaningfulTradeoffs: 'Each variant has both strengths and weaknesses. Consider the disadvantages as much as the benefits when making your choice.',
        baseTraits: {
            languages: ['Common', 'Old Nord', 'Runic'],
            lifespan: '80-120 years',
            baseSpeed: 30,
            size: 'Medium'
        },
        subraces: {
            berserker: {
                id: 'berserker_nordmark',
                name: 'Berserker Nordmark',
                description: 'Fierce warriors who embrace the fury of battle above all else',
                statModifiers: {
                    constitution: 2,
                    strength: 2,
                    agility: -1,
                    intelligence: -2,
                    spirit: 1,
                    charisma: -1
                },
                traits: [
                    {
                        name: 'Frostborn',
                        description: 'Resistance to cold damage and advantage on saves against exhaustion from harsh weather. You can survive in arctic conditions without shelter, but your breath creates visible frost even in warm climates, making stealth difficult.',
                        type: 'environmental'
                    },
                    {
                        name: 'Battle Fury',
                        description: 'When reduced to half hit points, enter a berserker rage (1 AP). Gain +3 damage to all attacks but take -3 to AC and cannot cast spells for 1 minute. Once per long rest.',
                        type: 'combat'
                    },
                    {
                        name: 'Reckless Courage',
                        description: 'Immunity to fear effects, but you must make a Spirit save (DC 15) to retreat from combat or avoid a direct challenge. Your bloodlust makes tactical withdrawal nearly impossible.',
                        type: 'combat'
                    }
                ],
                languages: ['Common', 'Old Nord', 'Runic'],
                speed: 30
            },
            skald: {
                id: 'skald_nordmark',
                name: 'Skald Nordmark',
                description: 'Warrior-poets who preserve the ancient sagas and inspire others',
                statModifiers: {
                    constitution: 1,
                    strength: 0,
                    agility: -1,
                    intelligence: 1,
                    spirit: 2,
                    charisma: 1
                },
                traits: [
                    {
                        name: 'Frostborn',
                        description: 'Resistance to cold damage and advantage on saves against exhaustion from harsh weather. You can survive in arctic conditions without shelter, but your breath creates visible frost even in warm climates, making stealth difficult.',
                        type: 'environmental'
                    },
                    {
                        name: 'Inspiring Saga',
                        description: 'You can recite ancient sagas to inspire allies (2 AP). All allies within 30 feet gain advantage on their next attack or save. Once per short rest, but you must speak loudly, potentially alerting enemies.',
                        type: 'support'
                    },
                    {
                        name: 'Ancestral Memory',
                        description: 'You have advantage on History checks and can recall ancient lore, but you are compelled to share these stories at length, often at inappropriate times, giving disadvantage on stealth group checks.',
                        type: 'knowledge'
                    }
                ],
                languages: ['Common', 'Old Nord', 'Runic'],
                speed: 30
            },
            icewalker: {
                id: 'icewalker_nordmark',
                name: 'Icewalker Nordmark',
                description: 'Hardy survivors who have adapted to the harshest frozen wastes',
                statModifiers: {
                    constitution: 3,
                    strength: 0,
                    agility: 0,
                    intelligence: -1,
                    spirit: 1,
                    charisma: -2
                },
                traits: [
                    {
                        name: 'Deep Frost',
                        description: 'Immunity to cold damage and exhaustion from harsh weather. You can survive in arctic conditions indefinitely, but you take vulnerability to fire damage and have disadvantage on saves against heat effects.',
                        type: 'environmental'
                    },
                    {
                        name: 'Ice Walk',
                        description: 'You can walk on ice and snow without slipping and leave no tracks in frozen terrain. However, you move at half speed on warm ground and take 1 point of damage per hour in temperatures above 70°F.',
                        type: 'mobility'
                    },
                    {
                        name: 'Frozen Heart',
                        description: 'You have advantage on saves against charm and emotion effects, but you have disadvantage on all Charisma-based social interactions due to your cold, distant demeanor.',
                        type: 'mental'
                    }
                ],
                languages: ['Common', 'Old Nord', 'Runic'],
                speed: 30
            }
        }
    },

    corvani: {
        id: 'corvani',
        name: 'Corvani',
        description: 'Raven-marked people from mist-shrouded highlands who walk between worlds',
        icon: 'fas fa-crow',
        overview: 'The Corvani are a mysterious people marked by the raven, dwelling in the mist-shrouded highlands where the veil between worlds grows thin. They possess an uncanny connection to fate and the ethereal realm.',
        culturalBackground: `The Corvani are born with raven-black markings that shift and change with their moods and destinies. They dwell in the mist-shrouded highlands where reality blurs and the future whispers through the fog. Their culture values prophecy, wisdom, and the ability to navigate both the physical and spiritual worlds. They serve as messengers, seers, and guides between realms, though their gifts often come with a heavy price. The Corvani believe that fate is a tapestry they can glimpse but never fully control.`,
        variantDiversity: 'The Corvani have diverged into two primary paths: Oracle Corvani who embrace their prophetic gifts and peer deep into fate\'s threads, and Scout Corvani who use their connection to the mists for swift navigation and communication across treacherous terrain.',
        integrationNotes: {
            actionPointSystem: 'Corvani abilities often involve perception, divination, and mobility, offering unique tactical advantages in information gathering and positioning.',
            backgroundSynergy: 'Corvani excel in backgrounds that emphasize wisdom, perception, and supernatural connections. Their prophetic abilities complement mystical and spiritual paths.',
            classCompatibility: 'Corvani make excellent spellcasters, scouts, and support characters. Their perception bonuses and divination abilities enhance classes that rely on information and foresight.'
        },
        meaningfulTradeoffs: 'Corvani variants gain powerful perception and divination abilities but often suffer from physical frailty or vulnerability to specific damage types. Their gifts come with compulsions and drawbacks.',
        baseTraits: {
            languages: ['Common', 'Corvid'],
            lifespan: '90-110 years',
            baseSpeed: 30,
            size: 'Medium'
        },
        subraces: {
            oracle: {
                id: 'oracle_corvani',
                name: 'Oracle Corvani',
                description: 'Gifted seers who peer deep into fate\'s threads',
                statModifiers: {
                    constitution: 0,
                    strength: -1,
                    agility: 1,
                    intelligence: 2,
                    spirit: 3,
                    charisma: 1
                },
                traits: [
                    {
                        name: 'Prophetic Vision',
                        description: 'Once per long rest, can glimpse the future to reroll any d20 roll (yours or an ally\'s) within 60 feet.',
                        type: 'divination'
                    },
                    {
                        name: 'Raven Sight',
                        description: 'Can see through illusions and detect hidden creatures within 30 feet, but suffer -2 to Constitution saves against disease.',
                        type: 'perception'
                    },
                    {
                        name: 'Fate\'s Warning',
                        description: 'Allies within 30 feet gain +1 AC against the first attack each round, but you take 1 psychic damage when they\'re hit.',
                        type: 'protection'
                    }
                ],
                languages: ['Common', 'Corvid', 'Ethereal'],
                speed: 30
            },
            scout: {
                id: 'scout_corvani',
                name: 'Scout Corvani',
                description: 'Swift messengers navigating treacherous highland paths',
                statModifiers: {
                    constitution: 1,
                    strength: 0,
                    agility: 3,
                    intelligence: 1,
                    spirit: 1,
                    charisma: 0
                },
                traits: [
                    {
                        name: 'Highland Navigation',
                        description: 'Cannot become lost in natural terrain and can move at full speed through difficult terrain.',
                        type: 'movement'
                    },
                    {
                        name: 'Raven Messenger',
                        description: 'Can send messages via ravens to any location you\'ve visited, but messages can be intercepted by those who speak Corvid.',
                        type: 'communication'
                    },
                    {
                        name: 'Mist Walker',
                        description: 'Can become partially incorporeal for 1 round (resistance to physical damage), but become vulnerable to radiant damage for 1 minute.',
                        type: 'defense'
                    }
                ],
                languages: ['Common', 'Corvid', 'Sylvan'],
                speed: 35
            }
        }
    },

    grimheart: {
        id: 'grimheart',
        name: 'Grimheart',
        description: 'Stone-souled miners who delved too deep and were forever changed',
        icon: 'fas fa-hammer',
        overview: 'The Grimheart are a cursed people who delved too deep into the earth and awakened something ancient. Their bodies have become partially stone, and they hear the whispers of the deep earth calling them ever downward.',
        culturalBackground: `The Grimheart were once master miners and craftsmen, but their insatiable greed and curiosity led them to dig too deep. They breached ancient chambers and were cursed by what they found. Now their skin is hard as stone, their hearts beat slowly, and they hear constant whispers from the depths. Their culture is one of obsession and compulsion - they cannot stop digging, cannot stop seeking what lies beneath. Some embrace this curse as a gift, while others struggle against it. They are master craftsmen and engineers, but their obsessive nature makes them difficult companions.`,
        variantDiversity: 'Grimheart variants reflect different responses to their curse: Delver Grimheart embrace the obsession and dig ever deeper, Forgemaster Grimheart channel their compulsion into crafting, and Stoneward Grimheart resist the whispers and protect others from the deep.',
        integrationNotes: {
            actionPointSystem: 'Grimheart abilities focus on durability, crafting, and earth manipulation. Their stone-like nature provides defensive options but limits mobility.',
            backgroundSynergy: 'Grimheart work well with backgrounds emphasizing crafting, endurance, and physical prowess. Their obsessive nature can complement dedicated specialist paths.',
            classCompatibility: 'Grimheart excel as tanks, crafters, and earth-based casters. Their high constitution and defensive abilities make them natural frontliners, though their reduced speed requires tactical positioning.'
        },
        meaningfulTradeoffs: 'Grimheart gain exceptional durability and crafting abilities but suffer from reduced speed, mental compulsions, and social penalties. Their curse is both blessing and burden.',
        baseTraits: {
            languages: ['Common', 'Terran'],
            lifespan: '180-220 years',
            baseSpeed: 25,
            size: 'Medium'
        },
        subraces: {
            delver: {
                id: 'delver_grimheart',
                name: 'Delver Grimheart',
                description: 'Obsessive miners driven by deep earth whispers',
                statModifiers: {
                    constitution: 3,
                    strength: 2,
                    agility: -1,
                    intelligence: 1,
                    spirit: -1,
                    charisma: -2
                },
                traits: [
                    {
                        name: 'Earth Whispers',
                        description: 'Can sense valuable minerals and hidden passages within 60 feet, but hear constant whispers that impose disadvantage on Wisdom saves.',
                        type: 'detection'
                    },
                    {
                        name: 'Stone Skin',
                        description: 'Natural armor provides +2 AC, but movement speed reduced by 5 feet.',
                        type: 'defense'
                    },
                    {
                        name: 'Deep Delving',
                        description: 'Can tunnel through stone at half movement speed, but become obsessed with digging and must make Wisdom saves to stop.',
                        type: 'utility'
                    }
                ],
                languages: ['Common', 'Terran', 'Undercommon'],
                speed: 25
            },
            warden: {
                id: 'warden_grimheart',
                name: 'Warden Grimheart',
                description: 'Guardians who protect others from the depths',
                statModifiers: {
                    constitution: 2,
                    strength: 1,
                    agility: -1,
                    intelligence: 0,
                    spirit: 2,
                    charisma: 1
                },
                traits: [
                    {
                        name: 'Guardian\'s Resolve',
                        description: 'Can absorb damage intended for allies within 10 feet, but take +50% of the absorbed damage.',
                        type: 'protection'
                    },
                    {
                        name: 'Deep Sight',
                        description: 'Darkvision 120 feet and can see through magical darkness, but bright light causes disadvantage on attack rolls.',
                        type: 'perception'
                    },
                    {
                        name: 'Stone Ward',
                        description: 'Can create protective stone barriers, but each use drains 1 point of Constitution until long rest.',
                        type: 'utility'
                    }
                ],
                languages: ['Common', 'Terran', 'Primordial'],
                speed: 25
            },
            mountaindwarf: {
                id: 'mountaindwarf_grimheart',
                name: 'Mountain Dwarf',
                description: 'Hardy dwarves from high mountain peaks and deep halls',
                statModifiers: {
                    constitution: 3,
                    strength: 2,
                    agility: 0,
                    intelligence: 1,
                    spirit: 1,
                    charisma: 0
                },
                traits: [
                    {
                        name: 'Mountain Born',
                        description: 'Acclimated to high altitude and resistant to cold. Advantage on saves against altitude sickness and cold weather.',
                        type: 'resistance'
                    },
                    {
                        name: 'Dwarven Resilience',
                        description: 'Advantage on saving throws against poison and resistance to poison damage.',
                        type: 'resistance'
                    },
                    {
                        name: 'Stonecunning',
                        description: 'Whenever you make an Intelligence check related to the origin of stonework, you are considered proficient and add double your proficiency bonus.',
                        type: 'knowledge'
                    }
                ],
                languages: ['Common', 'Dwarvish', 'Terran'],
                speed: 25
            }
        }
    },

    veilborn: {
        id: 'veilborn',
        name: 'Veilborn',
        description: 'Pale folk from borderlands where reality grows thin and worlds overlap',
        icon: 'fas fa-ghost',
        overview: 'The Veilborn exist between worlds, their bodies partially phased into the Ethereal Plane. They are pale, almost translucent beings who can see and interact with spirits and otherworldly entities.',
        culturalBackground: `The Veilborn come from the borderlands where the Material Plane and Ethereal Plane overlap. They are born with one foot in each world, able to perceive and interact with both. Their culture revolves around mediation between worlds, serving as guides for lost spirits and interpreters of otherworldly phenomena. They are often feared and misunderstood by those who cannot see what they see. Veilborn communities are quiet, contemplative places where the boundaries between life and death, real and unreal, are acknowledged and respected.`,
        variantDiversity: 'Veilborn variants reflect different relationships with the ethereal: Medium Veilborn communicate with spirits and serve as intermediaries, while Walker Veilborn traverse between planes and explore the boundaries of reality.',
        integrationNotes: {
            actionPointSystem: 'Veilborn abilities focus on perception, communication with otherworldly entities, and brief planar transitions. Their ethereal nature provides unique utility and defensive options.',
            backgroundSynergy: 'Veilborn excel in backgrounds emphasizing wisdom, spirituality, and supernatural knowledge. Their connection to other planes complements mystical and divine paths.',
            classCompatibility: 'Veilborn make excellent clerics, mediums, and support casters. Their ability to perceive hidden threats and communicate with spirits provides valuable party utility.'
        },
        meaningfulTradeoffs: 'Veilborn gain powerful perception and planar abilities but suffer from physical frailty and mental strain from constant exposure to multiple realities. Their gifts can be overwhelming.',
        baseTraits: {
            languages: ['Common', 'Ethereal'],
            lifespan: '130-170 years',
            baseSpeed: 30,
            size: 'Medium'
        },
        subraces: {
            medium: {
                id: 'medium_veilborn',
                name: 'Medium Veilborn',
                description: 'Gifted communicators with spirits of other realms',
                statModifiers: {
                    constitution: -1,
                    strength: -1,
                    agility: 1,
                    intelligence: 1,
                    spirit: 3,
                    charisma: 2
                },
                traits: [
                    {
                        name: 'Spirit Communication',
                        description: 'Can speak with spirits and undead, gaining valuable information, but spirits may demand favors or become hostile.',
                        type: 'communication'
                    },
                    {
                        name: 'Ethereal Sight',
                        description: 'Can see into the Ethereal Plane and detect invisible creatures, but suffer constant visions that impose -2 to Perception in combat.',
                        type: 'perception'
                    },
                    {
                        name: 'Spiritual Guidance',
                        description: 'Once per day, can ask spirits for guidance on a decision, gaining advantage on next ability check, but must follow their advice or suffer a curse.',
                        type: 'divination'
                    }
                ],
                languages: ['Common', 'Ethereal', 'Celestial'],
                speed: 30
            },
            walker: {
                id: 'walker_veilborn',
                name: 'Walker Veilborn',
                description: 'Explorers who traverse the border between worlds',
                statModifiers: {
                    constitution: 0,
                    strength: 0,
                    agility: 2,
                    intelligence: 2,
                    spirit: 2,
                    charisma: 0
                },
                traits: [
                    {
                        name: 'Plane Shift',
                        description: 'Can briefly step into the Ethereal Plane to avoid attacks (once per short rest), but risk getting lost between planes.',
                        type: 'movement'
                    },
                    {
                        name: 'Reality Anchor',
                        description: 'Immune to forced planar travel and can stabilize dimensional rifts, but take double damage from force effects.',
                        type: 'utility'
                    },
                    {
                        name: 'Veil Walker',
                        description: 'Can phase through walls for 1 round (once per long rest), but become vulnerable to all damage types for 1 minute afterward.',
                        type: 'movement'
                    }
                ],
                languages: ['Common', 'Ethereal', 'Abyssal'],
                speed: 30
            }
        }
    },

    mirrorkin: {
        id: 'mirrorkin',
        name: 'Mirrorkin',
        description: 'Shapeshifters who lost their original forms and now wear borrowed faces',
        icon: 'fas fa-mask',
        overview: 'The Mirrorkin are tragic shapeshifters who have lost their original forms. They exist as blank slates, able to copy others but never truly themselves. Each transformation chips away at their sense of self.',
        culturalBackground: `The Mirrorkin have no homeland, no original culture - they have forgotten what they once were. They exist as mirrors, reflecting those around them but never showing their own image. Some embrace this existence, becoming master spies and infiltrators. Others struggle against it, desperately seeking their lost identity. Mirrorkin communities are rare and strange, filled with beings wearing a thousand different faces, never quite sure who they really are. They are both pitied and feared, useful but never fully trusted.`,
        variantDiversity: 'Mirrorkin variants reflect different responses to identity loss: Doppel Mirrorkin perfect the art of impersonation and embrace their shapeshifting nature, while Broken Mirrorkin struggle with fragmented identities and mental instability.',
        integrationNotes: {
            actionPointSystem: 'Mirrorkin abilities focus on deception, adaptation, and identity manipulation. Their shapeshifting provides unique infiltration and social options.',
            backgroundSynergy: 'Mirrorkin excel in backgrounds emphasizing deception, adaptability, and social manipulation. Their identity crisis can create compelling roleplay opportunities.',
            classCompatibility: 'Mirrorkin make excellent rogues, spies, and social characters. Their shapeshifting abilities enhance classes that rely on deception and infiltration.'
        },
        meaningfulTradeoffs: 'Mirrorkin gain powerful shapeshifting and deception abilities but suffer from identity loss, mental instability, and the constant risk of losing themselves in their disguises.',
        baseTraits: {
            languages: ['Common', 'Changeling'],
            lifespan: '70-90 years',
            baseSpeed: 30,
            size: 'Medium'
        },
        subraces: {
            doppel: {
                id: 'doppel_mirrorkin',
                name: 'Doppel Mirrorkin',
                description: 'Master impersonators perfecting deception arts',
                statModifiers: {
                    constitution: 0,
                    strength: 0,
                    agility: 2,
                    intelligence: 1,
                    spirit: 0,
                    charisma: 3
                },
                traits: [
                    {
                        name: 'Perfect Mimicry',
                        description: 'Can perfectly copy appearance and voice of observed creatures, but lose 1 point of original identity each use.',
                        type: 'illusion'
                    },
                    {
                        name: 'Adaptive Form',
                        description: 'Can alter physical features to gain advantage on disguise checks, but suffer identity confusion (-2 to Wisdom saves).',
                        type: 'utility'
                    },
                    {
                        name: 'Mirror Memory',
                        description: 'Can access surface memories of copied forms, but risk personality bleed that affects decision-making.',
                        type: 'mental'
                    }
                ],
                languages: ['Common', 'Changeling', 'Thieves\' Cant'],
                speed: 30
            },
            broken: {
                id: 'broken_mirrorkin',
                name: 'Broken Mirrorkin',
                description: 'Fragmented beings struggling with identity loss',
                statModifiers: {
                    constitution: -1,
                    strength: -1,
                    agility: 1,
                    intelligence: 2,
                    spirit: 1,
                    charisma: 1
                },
                traits: [
                    {
                        name: 'Fractured Mind',
                        description: 'Resistance to charm and fear effects due to mental fragmentation, but suffer random personality shifts during stress.',
                        type: 'mental'
                    },
                    {
                        name: 'Identity Crisis',
                        description: 'Can temporarily adopt aspects of nearby allies\' abilities, but lose access to own racial traits while doing so.',
                        type: 'adaptive'
                    },
                    {
                        name: 'Shattered Reflection',
                        description: 'Can split into multiple illusory copies for 1 round, but each copy shares damage taken.',
                        type: 'illusion'
                    }
                ],
                languages: ['Common', 'Changeling', 'Deep Speech'],
                speed: 30
            }
        }
    },

    thornkin: {
        id: 'thornkin',
        name: 'Thornkin',
        description: 'Fae-touched beings bound by ancient pacts and supernatural rules',
        icon: 'fas fa-leaf',
        overview: 'The Thornkin are fae-touched mortals bound by ancient bargains and supernatural contracts. Thorns grow from their skin, and they are compelled to follow strict codes of behavior dictated by their fae heritage.',
        culturalBackground: `The Thornkin are the result of ancient pacts between mortals and the fae courts. They are bound by supernatural rules and contracts that govern their behavior - they cannot lie, must honor bargains, and are compelled to follow strict codes of etiquette. Thorns grow from their skin as a mark of their fae heritage, beautiful but painful. Their culture revolves around contracts, bargains, and the careful navigation of supernatural obligations. They are master negotiators and diplomats, but their rigid adherence to rules makes them inflexible and sometimes frustrating allies.`,
        variantDiversity: 'Thornkin variants reflect different fae court affiliations and paths: Courtly Thornkin are bound to the noble courts and excel in diplomacy, Wild Thornkin rejected civilization for primal freedom and savage power, and Dusk Thornkin walk the twilight boundary between light and shadow.',
        integrationNotes: {
            actionPointSystem: 'Thornkin abilities focus on social manipulation, nature magic, and binding contracts. Their fae nature provides unique diplomatic and magical options.',
            backgroundSynergy: 'Thornkin excel in backgrounds emphasizing charisma, nature magic, and social interaction. Their binding contracts create interesting roleplay opportunities.',
            classCompatibility: 'Thornkin make excellent diplomats, nature casters, and support characters. Their social abilities and nature magic enhance classes that rely on charisma and natural magic.'
        },
        meaningfulTradeoffs: 'Thornkin gain powerful social and nature abilities but are bound by strict behavioral codes and supernatural contracts. Their thorns cause them pain when using their powers.',
        baseTraits: {
            languages: ['Common', 'Sylvan'],
            lifespan: '250-350 years',
            baseSpeed: 30,
            size: 'Medium'
        },
        subraces: {
            courtly: {
                id: 'courtly_thornkin',
                name: 'Courtly Thornkin',
                description: 'Noble fae bound by supernatural bargains and rules',
                statModifiers: {
                    constitution: 0,
                    strength: -1,
                    agility: 2,
                    intelligence: 2,
                    spirit: 1,
                    charisma: 3
                },
                traits: [
                    {
                        name: 'Fae Bargain',
                        description: 'Can make magical contracts that compel truth and compliance, but become bound by the same terms.',
                        type: 'social'
                    },
                    {
                        name: 'Court Etiquette',
                        description: 'Advantage on social interactions with nobility and fae, but must follow strict behavioral codes or suffer penalties.',
                        type: 'social'
                    },
                    {
                        name: 'Thorn Crown',
                        description: 'Can command plant growth and entangle enemies, but thorns grow from your skin causing 1 damage per use.',
                        type: 'nature'
                    }
                ],
                languages: ['Common', 'Sylvan', 'Celestial'],
                speed: 30
            },
            wild: {
                id: 'wild_thornkin',
                name: 'Wild Thornkin',
                description: 'Untamed fae who rejected the courts for primal freedom',
                statModifiers: {
                    constitution: 2,
                    strength: 2,
                    agility: 2,
                    intelligence: -1,
                    spirit: 1,
                    charisma: -2
                },
                traits: [
                    {
                        name: 'Briar Form',
                        description: 'Can transform into a mass of thorny vines, gaining damage resistance but becoming immobile. Costs 3 AP.',
                        type: 'transformation'
                    },
                    {
                        name: 'Savage Growth',
                        description: 'Your attacks cause bleeding damage over time, but you cannot use healing magic on yourself.',
                        type: 'combat'
                    },
                    {
                        name: 'Untamed',
                        description: 'Immune to charm and compulsion effects, but disadvantage on all social interactions in civilized settings.',
                        type: 'mental'
                    }
                ],
                languages: ['Common', 'Sylvan'],
                speed: 35
            },
            dusk: {
                id: 'dusk_thornkin',
                name: 'Dusk Thornkin',
                description: 'Twilight fae who walk the boundary between light and shadow',
                statModifiers: {
                    constitution: 0,
                    strength: 0,
                    agility: 3,
                    intelligence: 2,
                    spirit: 2,
                    charisma: 1
                },
                traits: [
                    {
                        name: 'Twilight Step',
                        description: 'Can teleport short distances through shadows, but only during dawn or dusk hours. Costs 2 AP.',
                        type: 'movement'
                    },
                    {
                        name: 'Duality',
                        description: 'Gain advantage on stealth and perception checks, but suffer disadvantage in bright light or total darkness.',
                        type: 'perception'
                    },
                    {
                        name: 'Thorn Veil',
                        description: 'Can create illusory duplicates made of shadow and thorns, but each use drains 2 HP.',
                        type: 'illusion'
                    }
                ],
                languages: ['Common', 'Sylvan', 'Umbral'],
                speed: 35
            }
        }
    },

    wildkin: {
        id: 'wildkin',
        name: 'Wildkin',
        description: 'Antlered forest dwellers bonded with primal wilderness and ancient groves',
        icon: 'fas fa-tree',
        overview: 'The Wildkin are forest guardians with antlers growing from their heads and bark-like skin. They are bonded to ancient groves and the primal forces of nature, serving as protectors of the wild places.',
        culturalBackground: `The Wildkin are born from the union of mortals and nature spirits, marked by antlers and bark-like skin. They are deeply connected to the forests and wild places, able to communicate with plants and animals. Their culture revolves around protection of nature, seasonal cycles, and the balance between civilization and wilderness. They are fierce guardians who will defend their groves to the death, but also wise counselors who understand the interconnection of all living things. Wildkin rarely leave their forests, but when they do, they bring the wild with them.`,
        variantDiversity: 'Wildkin variants reflect different aspects of nature: Guardian Wildkin are fierce protectors of ancient forests, Wanderer Wildkin are restless nomads following seasonal migrations, and Shaman Wildkin channel primal spirits and ancient nature magic.',
        integrationNotes: {
            actionPointSystem: 'Wildkin abilities focus on nature magic, physical prowess, and environmental manipulation. Their connection to nature provides unique tactical options in natural settings.',
            backgroundSynergy: 'Wildkin excel in backgrounds emphasizing nature, protection, and primal power. Their grove bonds create strong territorial motivations.',
            classCompatibility: 'Wildkin make excellent druids, rangers, and nature warriors. Their physical bonuses and nature magic enhance classes that operate in wilderness settings.'
        },
        meaningfulTradeoffs: 'Wildkin gain powerful nature abilities and physical prowess but are bound to their groves and suffer when separated from nature. Their wild nature makes urban environments uncomfortable.',
        baseTraits: {
            languages: ['Common', 'Druidic'],
            lifespan: '180-220 years',
            baseSpeed: 35,
            size: 'Medium'
        },
        subraces: {
            guardian: {
                id: 'guardian_wildkin',
                name: 'Guardian Wildkin',
                description: 'Fierce protectors of ancient forests and groves',
                statModifiers: {
                    constitution: 2,
                    strength: 2,
                    agility: 1,
                    intelligence: 0,
                    spirit: 2,
                    charisma: -1
                },
                traits: [
                    {
                        name: 'Forest Guardian',
                        description: 'Can sense threats to natural areas within 1 mile and gain combat bonuses when defending nature, but become enraged when witnessing environmental destruction.',
                        type: 'nature'
                    },
                    {
                        name: 'Antler Charge',
                        description: 'Can make devastating charge attacks with antlers, but become stuck if you miss and hit a wall or tree.',
                        type: 'combat'
                    },
                    {
                        name: 'Nature\'s Ally',
                        description: 'Can communicate with and request aid from forest animals, but must provide favors in return.',
                        type: 'communication'
                    }
                ],
                languages: ['Common', 'Druidic', 'Beast Speech'],
                speed: 35
            },
            wanderer: {
                id: 'wanderer_wildkin',
                name: 'Wanderer Wildkin',
                description: 'Restless nomads following seasonal migrations',
                statModifiers: {
                    constitution: 1,
                    strength: 0,
                    agility: 3,
                    intelligence: 1,
                    spirit: 2,
                    charisma: 0
                },
                traits: [
                    {
                        name: 'Seasonal Migration',
                        description: 'Gain different bonuses based on current season, but suffer penalties when staying in one place too long.',
                        type: 'adaptive'
                    },
                    {
                        name: 'Pathfinder',
                        description: 'Cannot become lost and can find the fastest route to any destination, but feel compelled to keep moving.',
                        type: 'movement'
                    },
                    {
                        name: 'Weather Sense',
                        description: 'Can predict weather changes and natural disasters, but become restless and distracted during storms.',
                        type: 'divination'
                    }
                ],
                languages: ['Common', 'Druidic', 'Primordial'],
                speed: 35
            },
            shaman: {
                id: 'shaman_wildkin',
                name: 'Shaman Wildkin',
                description: 'Wise druids communing with nature spirits',
                statModifiers: {
                    constitution: 1,
                    strength: -1,
                    agility: 1,
                    intelligence: 2,
                    spirit: 3,
                    charisma: 1
                },
                traits: [
                    {
                        name: 'Spirit Communion',
                        description: 'Can speak with nature spirits for guidance and aid, but must perform rituals and offerings regularly.',
                        type: 'spiritual'
                    },
                    {
                        name: 'Elemental Affinity',
                        description: 'Can channel elemental forces for various effects, but become vulnerable to opposing elements.',
                        type: 'elemental'
                    },
                    {
                        name: 'Ancestral Wisdom',
                        description: 'Can access memories of previous shamans for knowledge, but risk being overwhelmed by ancient experiences.',
                        type: 'knowledge'
                    }
                ],
                languages: ['Common', 'Druidic', 'Elemental'],
                speed: 35
            },
            lightfoot: {
                id: 'lightfoot_wildkin',
                name: 'Lightfoot Halfling',
                description: 'Small, nimble folk who blend into crowds and move with supernatural stealth',
                statModifiers: {
                    constitution: 1,
                    strength: -1,
                    agility: 3,
                    intelligence: 1,
                    spirit: 1,
                    charisma: 2
                },
                traits: [
                    {
                        name: 'Naturally Stealthy',
                        description: 'Can attempt to hide even when only obscured by a creature that is at least one size larger than you.',
                        type: 'stealth'
                    },
                    {
                        name: 'Lucky',
                        description: 'When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.',
                        type: 'luck'
                    },
                    {
                        name: 'Brave',
                        description: 'You have advantage on saving throws against being frightened.',
                        type: 'mental'
                    }
                ],
                languages: ['Common', 'Halfling', 'Druidic'],
                speed: 25
            }
        }
    },

    ashmark: {
        id: 'ashmark',
        name: 'Ashmark',
        description: 'Fire-touched people from volcanic wastelands where flames never die',
        icon: 'fas fa-fire',
        overview: 'The Ashmark are a fire-touched people who dwell in volcanic wastelands. Their bodies burn with inner heat, and they are immune to flames but vulnerable to cold. They are master smiths and fierce warriors.',
        culturalBackground: `The Ashmark come from the volcanic wastelands where the earth bleeds fire and ash falls like snow. They are born with inner flames that burn throughout their lives, making them immune to heat but vulnerable to cold. Their culture revolves around smithing, warfare, and the forge. They believe that all things are purified and strengthened through fire. Ashmark are passionate, quick to anger, and fiercely loyal. They value strength, craftsmanship, and the ability to endure hardship. Their settlements are built around great forges where they craft legendary weapons and armor.`,
        variantDiversity: 'Ashmark variants reflect different aspects of fire: Forgeborn Ashmark are master smiths whose bodies burn with forge heat, Cinderborn Ashmark are swift scouts leaving trails of embers, and War Orcs are fierce warriors tempered by fire and battle.',
        integrationNotes: {
            actionPointSystem: 'Ashmark abilities focus on fire damage, crafting, and aggressive combat. Their inner flames provide offensive options but create environmental hazards.',
            backgroundSynergy: 'Ashmark excel in backgrounds emphasizing strength, crafting, and combat prowess. Their fire nature complements aggressive and creative paths.',
            classCompatibility: 'Ashmark make excellent warriors, smiths, and fire-based casters. Their fire immunity and physical bonuses enhance classes that engage in direct combat.'
        },
        meaningfulTradeoffs: 'Ashmark gain fire immunity and powerful offensive abilities but suffer from cold vulnerability and their inner heat can damage equipment and allies. They struggle in cold environments.',
        baseTraits: {
            languages: ['Common', 'Ignan'],
            lifespan: '100-140 years',
            baseSpeed: 30,
            size: 'Medium'
        },
        subraces: {
            forgeborn: {
                id: 'forgeborn_ashmark',
                name: 'Forgeborn Ashmark',
                description: 'Master smiths whose bodies burn with forge heat',
                statModifiers: {
                    constitution: 2,
                    strength: 3,
                    agility: -1,
                    intelligence: 2,
                    spirit: 0,
                    charisma: 0
                },
                traits: [
                    {
                        name: 'Forge Heart',
                        description: 'Can heat metal with touch and work without tools, but body temperature damages equipment and allies.',
                        type: 'crafting'
                    },
                    {
                        name: 'Fire Immunity',
                        description: 'Immune to fire damage and can walk through lava, but take double damage from cold effects.',
                        type: 'resistance'
                    },
                    {
                        name: 'Molten Strike',
                        description: 'Weapons become red-hot dealing extra fire damage, but have chance to break from heat stress.',
                        type: 'combat'
                    }
                ],
                languages: ['Common', 'Ignan', 'Terran'],
                speed: 30
            },
            cinderborn: {
                id: 'cinderborn_ashmark',
                name: 'Cinderborn Ashmark',
                description: 'Swift scouts leaving trails of smoldering embers',
                statModifiers: {
                    constitution: 1,
                    strength: 1,
                    agility: 3,
                    intelligence: 1,
                    spirit: 1,
                    charisma: 0
                },
                traits: [
                    {
                        name: 'Ember Trail',
                        description: 'Leave a trail of harmless embers that can be followed or used for signaling, but also makes you easy to track.',
                        type: 'movement'
                    },
                    {
                        name: 'Ash Cloud',
                        description: 'Can create concealing ash clouds for escape, but the ash irritates allies\' eyes and breathing.',
                        type: 'utility'
                    },
                    {
                        name: 'Heat Dash',
                        description: 'Can move at double speed leaving fire damage in your wake, but become exhausted afterward.',
                        type: 'movement'
                    }
                ],
                languages: ['Common', 'Ignan', 'Auran'],
                speed: 35
            },
            warorc: {
                id: 'warorc_ashmark',
                name: 'War Orc',
                description: 'Fierce warriors from volcanic battlegrounds, tempered by fire and war',
                statModifiers: {
                    constitution: 2,
                    strength: 3,
                    agility: 1,
                    intelligence: -1,
                    spirit: 1,
                    charisma: 0
                },
                traits: [
                    {
                        name: 'Savage Attacks',
                        description: 'When you score a critical hit with a melee weapon attack, you can roll one of the weapon\'s damage dice one additional time.',
                        type: 'combat'
                    },
                    {
                        name: 'Relentless Endurance',
                        description: 'When reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. Once per long rest.',
                        type: 'survival'
                    },
                    {
                        name: 'Volcanic Fury',
                        description: 'Can channel inner fire to deal bonus fire damage on attacks, but take recoil damage from the heat.',
                        type: 'combat'
                    }
                ],
                languages: ['Common', 'Orcish', 'Ignan'],
                speed: 30
            }
        }
    },

    skinwalker: {
        id: 'skinwalker',
        name: 'Skinwalker',
        description: 'Cursed shamans who wear beast forms and walk between human and animal',
        icon: 'fas fa-paw',
        overview: 'The Skinwalkers are cursed shamans who can transform into beasts. They walk the line between human and animal, struggling to maintain their humanity while embracing their bestial nature.',
        culturalBackground: `The Skinwalkers are shamans who broke ancient taboos and were cursed to wear beast forms. They can transform into predatory animals, but each transformation risks losing their human consciousness to the beast within. Their culture is one of isolation and struggle - they are feared and shunned by normal society, yet they possess incredible power. Some embrace their curse and become savage hunters, while others seek redemption and fight to maintain their humanity. Skinwalker communities are rare, often consisting of outcasts helping each other resist the beast's call.`,
        variantDiversity: 'Skinwalker variants reflect different responses to their curse: Hunter Skinwalkers embrace their predatory nature and bestial instincts, while Penitent Skinwalkers seek redemption and struggle to maintain control over their transformations.',
        integrationNotes: {
            actionPointSystem: 'Skinwalker abilities focus on transformation, tracking, and bestial combat. Their shapeshifting provides versatile tactical options but carries risks.',
            backgroundSynergy: 'Skinwalkers excel in backgrounds emphasizing nature, survival, and primal power. Their curse creates compelling internal conflicts and roleplay opportunities.',
            classCompatibility: 'Skinwalkers make excellent druids, rangers, and primal warriors. Their transformation abilities enhance classes that benefit from versatility and physical prowess.'
        },
        meaningfulTradeoffs: 'Skinwalkers gain powerful transformation and tracking abilities but risk losing control to their beast nature. They suffer social penalties and struggle with their dual identity.',
        baseTraits: {
            languages: ['Common', 'Beast Speech'],
            lifespan: '130-170 years',
            baseSpeed: 30,
            size: 'Medium'
        },
        subraces: {
            hunter: {
                id: 'hunter_skinwalker',
                name: 'Hunter Skinwalker',
                description: 'Predatory shapeshifters embracing bestial nature',
                statModifiers: {
                    constitution: 2,
                    strength: 2,
                    agility: 2,
                    intelligence: -1,
                    spirit: 1,
                    charisma: -2
                },
                traits: [
                    {
                        name: 'Beast Form',
                        description: 'Can transform into a predatory animal gaining its abilities, but risk losing human consciousness.',
                        type: 'transformation'
                    },
                    {
                        name: 'Predator\'s Instinct',
                        description: 'Can track creatures by scent and sense fear, but become aggressive toward weak or injured beings.',
                        type: 'hunting'
                    },
                    {
                        name: 'Pack Bond',
                        description: 'Gain bonuses when fighting alongside beast companions, but suffer penalties when alone.',
                        type: 'social'
                    }
                ],
                languages: ['Common', 'Beast Speech', 'Primal'],
                speed: 30
            },
            penitent: {
                id: 'penitent_skinwalker',
                name: 'Penitent Skinwalker',
                description: 'Those seeking redemption from their curse',
                statModifiers: {
                    constitution: 1,
                    strength: 0,
                    agility: 1,
                    intelligence: 1,
                    spirit: 2,
                    charisma: 1
                },
                traits: [
                    {
                        name: 'Controlled Transformation',
                        description: 'Can partially transform for specific abilities while maintaining control, but transformations cause pain.',
                        type: 'transformation'
                    },
                    {
                        name: 'Curse Resistance',
                        description: 'Resistance to curses and lycanthropy due to existing curse, but vulnerable to divine magic.',
                        type: 'resistance'
                    },
                    {
                        name: 'Redemptive Sacrifice',
                        description: 'Can take on others\' curses or afflictions to help them, but worsen your own condition.',
                        type: 'sacrifice'
                    }
                ],
                languages: ['Common', 'Beast Speech', 'Celestial'],
                speed: 30
            }
        }
    },

    graveworn: {
        id: 'graveworn',
        name: 'Graveworn',
        description: 'Undead warriors bound to guard ancient treasures for eternity',
        icon: 'fas fa-skull',
        overview: 'The Graveworn are undead beings bound by ancient oaths to guard treasures and tombs. They are immortal but cursed, unable to rest until their duty is fulfilled or their oath is broken.',
        culturalBackground: `The Graveworn are the result of powerful oaths and curses that bind the dead to eternal service. They were once living warriors, scholars, or guardians who swore oaths so powerful that death could not release them. Now they exist as undead beings, compelled to guard treasures, tombs, or secrets for eternity. Their culture is one of duty, obsession, and slow decay. They remember their living days but are disconnected from mortal concerns. Some embrace their undeath and the power it brings, while others desperately seek release from their eternal burden. Graveworn are feared and avoided, but they possess ancient knowledge and unwavering dedication.`,
        variantDiversity: 'Graveworn variants reflect different aspects of undeath: Hoarder Graveworn are consumed by greed and obsessively guard treasures, while Scholar Graveworn are undead academics obsessed with collecting and preserving knowledge.',
        integrationNotes: {
            actionPointSystem: 'Graveworn abilities focus on durability, undead resilience, and obsessive dedication. Their immortal nature provides unique advantages but comes with compulsions.',
            backgroundSynergy: 'Graveworn excel in backgrounds emphasizing knowledge, dedication, and endurance. Their undead nature creates unique roleplay challenges and opportunities.',
            classCompatibility: 'Graveworn make excellent tanks, knowledge specialists, and undead-themed casters. Their immunities and resilience enhance classes that benefit from durability.'
        },
        meaningfulTradeoffs: 'Graveworn gain undead immunities and immortality but are bound by compulsions, vulnerable to radiant damage, and disconnected from the living world. They struggle with their cursed existence.',
        baseTraits: {
            languages: ['Common', 'Necril'],
            lifespan: 'Immortal (cursed)',
            baseSpeed: 25,
            size: 'Medium'
        },
        subraces: {
            hoarder: {
                id: 'hoarder_graveworn',
                name: 'Hoarder Graveworn',
                description: 'Ancient guardians consumed by insatiable greed',
                statModifiers: {
                    constitution: 3,
                    strength: 2,
                    agility: -2,
                    intelligence: 1,
                    spirit: -1,
                    charisma: -1
                },
                traits: [
                    {
                        name: 'Treasure Sense',
                        description: 'Can detect valuable items within 120 feet and know their approximate worth, but become obsessed with acquiring them.',
                        type: 'detection'
                    },
                    {
                        name: 'Undead Resilience',
                        description: 'Immunity to poison, disease, and exhaustion, but vulnerable to radiant damage and turn undead effects.',
                        type: 'undead'
                    },
                    {
                        name: 'Hoard Guardian',
                        description: 'Gain combat bonuses when protecting treasure, but suffer penalties when separated from valuables.',
                        type: 'combat'
                    }
                ],
                languages: ['Common', 'Necril', 'Draconic'],
                speed: 25
            },
            scholar: {
                id: 'scholar_graveworn',
                name: 'Scholar Graveworn',
                description: 'Undead academics obsessed with collecting knowledge',
                statModifiers: {
                    constitution: 2,
                    strength: -1,
                    agility: -1,
                    intelligence: 3,
                    spirit: 1,
                    charisma: 0
                },
                traits: [
                    {
                        name: 'Eternal Study',
                        description: 'Perfect memory and can learn any language or skill given time, but become obsessed with acquiring knowledge.',
                        type: 'knowledge'
                    },
                    {
                        name: 'Deathless Vigil',
                        description: 'Don\'t need sleep and can work continuously, but lose connection to living world and emotions.',
                        type: 'undead'
                    },
                    {
                        name: 'Forbidden Lore',
                        description: 'Access to dangerous knowledge that can solve problems, but using it risks corruption or madness.',
                        type: 'knowledge'
                    }
                ],
                languages: ['Common', 'Necril', 'All Ancient Languages'],
                speed: 25
            }
        }
    },

    stormborn: {
        id: 'stormborn',
        name: 'Stormborn',
        description: 'Lightning-touched people born during great tempests who carry the storm within',
        icon: 'fas fa-bolt',
        overview: 'The Stormborn are mortals born during catastrophic storms, struck by lightning in the womb and forever changed. They crackle with electrical energy and can call down thunder and lightning.',
        culturalBackground: `The Stormborn are born during the most violent storms, struck by lightning while still in the womb. They survive what should kill them and emerge changed - their eyes glow with electric light, their hair stands on end, and sparks dance across their skin. Their culture revolves around freedom, chaos, and the raw power of nature unleashed. They are wanderers and adventurers, unable to stay in one place for long. Stormborn are passionate, impulsive, and dangerous - both to their enemies and sometimes to their allies. They believe that civilization is a cage and that true power comes from embracing the chaos of the storm.`,
        variantDiversity: 'Stormborn variants reflect different aspects of the storm: Thundercaller Stormborn command thunder and sound, Lightningborn channel pure electrical energy, and Tempest Stormborn embody the chaotic fury of the storm itself.',
        integrationNotes: {
            actionPointSystem: 'Stormborn abilities focus on lightning damage, mobility, and area control. Their electrical nature provides powerful offensive options but can be unpredictable.',
            backgroundSynergy: 'Stormborn excel in backgrounds emphasizing freedom, chaos, and elemental power. Their storm nature complements aggressive and mobile playstyles.',
            classCompatibility: 'Stormborn make excellent elemental casters, mobile strikers, and chaotic warriors. Their lightning abilities enhance classes that deal burst damage.'
        },
        meaningfulTradeoffs: 'Stormborn gain powerful lightning abilities and high mobility but are vulnerable to grounding effects and struggle with fine control. Their chaotic nature makes them unreliable.',
        baseTraits: {
            languages: ['Common', 'Auran', 'Primordial'],
            lifespan: '60-90 years',
            baseSpeed: 35,
            size: 'Medium'
        },
        subraces: {
            thundercaller: {
                id: 'thundercaller_stormborn',
                name: 'Thundercaller Stormborn',
                description: 'Masters of thunder and sonic devastation',
                statModifiers: {
                    constitution: 2,
                    strength: 2,
                    agility: 1,
                    intelligence: 0,
                    spirit: 1,
                    charisma: 2
                },
                traits: [
                    {
                        name: 'Thunder Voice',
                        description: 'Your voice carries the power of thunder, dealing sonic damage and stunning enemies. Costs 2 AP, but deafens you temporarily.',
                        type: 'combat'
                    },
                    {
                        name: 'Storm Presence',
                        description: 'Allies within 30 feet gain bonus to intimidation, but you cannot use stealth effectively.',
                        type: 'social'
                    },
                    {
                        name: 'Resonance',
                        description: 'Can shatter objects and barriers with sonic vibrations, but suffer damage from loud noises.',
                        type: 'utility'
                    }
                ],
                languages: ['Common', 'Auran', 'Primordial'],
                speed: 30
            },
            lightningborn: {
                id: 'lightningborn_stormborn',
                name: 'Lightningborn Stormborn',
                description: 'Living conduits of pure electrical energy',
                statModifiers: {
                    constitution: 1,
                    strength: 0,
                    agility: 3,
                    intelligence: 2,
                    spirit: 2,
                    charisma: 0
                },
                traits: [
                    {
                        name: 'Lightning Reflexes',
                        description: 'Can move at lightning speed in short bursts, but become exhausted after use. Costs 3 AP.',
                        type: 'movement'
                    },
                    {
                        name: 'Chain Lightning',
                        description: 'Your attacks can arc to nearby enemies, but also risk hitting allies.',
                        type: 'combat'
                    },
                    {
                        name: 'Grounded',
                        description: 'Immune to lightning damage, but vulnerable to water and take double damage when wet.',
                        type: 'resistance'
                    }
                ],
                languages: ['Common', 'Auran', 'Primordial'],
                speed: 40
            },
            tempest: {
                id: 'tempest_stormborn',
                name: 'Tempest Stormborn',
                description: 'Embodiments of chaotic storm fury',
                statModifiers: {
                    constitution: 2,
                    strength: 3,
                    agility: 2,
                    intelligence: -1,
                    spirit: 1,
                    charisma: 1
                },
                traits: [
                    {
                        name: 'Storm Rage',
                        description: 'Enter a berserk state gaining massive damage and resistance, but attack randomly including allies.',
                        type: 'combat'
                    },
                    {
                        name: 'Eye of the Storm',
                        description: 'Create a zone of calm around you that protects allies, but you cannot move while maintaining it.',
                        type: 'protection'
                    },
                    {
                        name: 'Unpredictable',
                        description: 'Your actions have random bonus effects, but also random penalties.',
                        type: 'chaos'
                    }
                ],
                languages: ['Common', 'Auran'],
                speed: 35
            }
        }
    },

    deepkin: {
        id: 'deepkin',
        name: 'Deepkin',
        description: 'Aquatic people from the lightless ocean depths with bioluminescent markings',
        icon: 'fas fa-water',
        overview: 'The Deepkin are aquatic beings from the deepest ocean trenches where sunlight never reaches. They have adapted to crushing pressure and total darkness, with bioluminescent patterns that glow across their skin.',
        culturalBackground: `The Deepkin dwell in the abyssal depths where the pressure would crush surface dwellers and no light penetrates. They have evolved bioluminescent markings that serve as communication, camouflage, and hunting tools. Their culture is alien and strange to surface dwellers - they think in three dimensions, communicate through light patterns and pressure changes, and view time differently in the timeless depths. Deepkin are patient, methodical, and utterly ruthless when threatened. They rarely come to the surface, but when they do, they bring the cold logic and predatory nature of the deep with them.`,
        variantDiversity: 'Deepkin variants reflect different depth zones: Abyssal Deepkin from the crushing depths are nearly indestructible, Trench Deepkin are ambush predators, and Twilight Deepkin bridge the gap between deep and surface waters.',
        integrationNotes: {
            actionPointSystem: 'Deepkin abilities focus on pressure manipulation, bioluminescence, and aquatic superiority. Their deep-sea adaptations provide unique tactical options.',
            backgroundSynergy: 'Deepkin excel in backgrounds emphasizing patience, hunting, and alien perspectives. Their aquatic nature creates interesting challenges on land.',
            classCompatibility: 'Deepkin make excellent ambush specialists, pressure mages, and patient strategists. Their abilities enhance classes that rely on positioning and control.'
        },
        meaningfulTradeoffs: 'Deepkin gain powerful aquatic abilities and pressure resistance but suffer on land and in bright light. Their alien nature makes social interaction difficult.',
        baseTraits: {
            languages: ['Common', 'Aquan', 'Deep Speech'],
            lifespan: '150-200 years',
            baseSpeed: 25,
            size: 'Medium'
        },
        subraces: {
            abyssal: {
                id: 'abyssal_deepkin',
                name: 'Abyssal Deepkin',
                description: 'Beings from the crushing depths, nearly indestructible',
                statModifiers: {
                    constitution: 3,
                    strength: 2,
                    agility: -1,
                    intelligence: 1,
                    spirit: 2,
                    charisma: -2
                },
                traits: [
                    {
                        name: 'Pressure Adaptation',
                        description: 'Immune to crushing damage and can survive any depth, but move slowly on land.',
                        type: 'defense'
                    },
                    {
                        name: 'Abyssal Resilience',
                        description: 'Massive damage resistance and HP, but bright light causes pain and disadvantage.',
                        type: 'defense'
                    },
                    {
                        name: 'Deep Sight',
                        description: 'Perfect vision in darkness and can see through murky water, but blinded by daylight.',
                        type: 'perception'
                    }
                ],
                languages: ['Aquan', 'Deep Speech'],
                speed: 20
            },
            trench: {
                id: 'trench_deepkin',
                name: 'Trench Deepkin',
                description: 'Ambush predators from the ocean trenches',
                statModifiers: {
                    constitution: 1,
                    strength: 2,
                    agility: 3,
                    intelligence: 2,
                    spirit: 1,
                    charisma: -1
                },
                traits: [
                    {
                        name: 'Bioluminescent Lure',
                        description: 'Can create hypnotic light patterns to lure and confuse prey, but reveals your position.',
                        type: 'illusion'
                    },
                    {
                        name: 'Ambush Predator',
                        description: 'Massive damage bonus on surprise attacks, but disadvantage in direct combat.',
                        type: 'combat'
                    },
                    {
                        name: 'Pressure Sense',
                        description: 'Can detect movement through water pressure changes, but overwhelmed in crowded areas.',
                        type: 'perception'
                    }
                ],
                languages: ['Common', 'Aquan', 'Deep Speech'],
                speed: 30
            },
            twilight: {
                id: 'twilight_deepkin',
                name: 'Twilight Deepkin',
                description: 'Adaptable beings who bridge deep and surface waters',
                statModifiers: {
                    constitution: 2,
                    strength: 1,
                    agility: 2,
                    intelligence: 2,
                    spirit: 1,
                    charisma: 0
                },
                traits: [
                    {
                        name: 'Adaptive Gills',
                        description: 'Can breathe both water and air, but need to stay moist or suffer penalties.',
                        type: 'utility'
                    },
                    {
                        name: 'Chromatic Display',
                        description: 'Can change bioluminescent patterns for communication and camouflage, costs 1 AP.',
                        type: 'utility'
                    },
                    {
                        name: 'Depth Diver',
                        description: 'Can rapidly change depth without injury, but sudden pressure changes disorient you.',
                        type: 'movement'
                    }
                ],
                languages: ['Common', 'Aquan'],
                speed: 30
            }
        }
    },

    starborn: {
        id: 'starborn',
        name: 'Starborn',
        description: 'Celestial beings who fell from the stars with cosmic power and alien minds',
        icon: 'fas fa-star',
        overview: 'The Starborn are beings who literally fell from the stars, crashing to earth in meteors and comets. They carry cosmic energy within them and possess knowledge of distant worlds and alien geometries.',
        culturalBackground: `The Starborn are not native to this world. They fell from the stars in meteors and comets, surviving impacts that would destroy mountains. They carry within them the light of distant suns and the cold of the void between worlds. Their minds work in alien ways, perceiving dimensions and concepts that mortals cannot comprehend. Starborn culture is incomprehensible to outsiders - they communicate in mathematical equations, see time non-linearly, and value concepts that have no translation. They are both wondrous and terrifying, bringing gifts of cosmic knowledge and the madness that comes with it.`,
        variantDiversity: 'Starborn variants reflect different cosmic origins: Voidwalker Starborn come from the empty spaces between stars, Sunborn carry the fire of dying suns, and Constellation Starborn embody the patterns written in the stars.',
        integrationNotes: {
            actionPointSystem: 'Starborn abilities focus on cosmic energy, gravity manipulation, and reality warping. Their alien nature provides unique tactical options.',
            backgroundSynergy: 'Starborn excel in backgrounds emphasizing knowledge, cosmic power, and alien perspectives. Their otherworldly nature creates compelling roleplay.',
            classCompatibility: 'Starborn make excellent cosmic casters, gravity manipulators, and knowledge seekers. Their abilities enhance classes that warp reality.'
        },
        meaningfulTradeoffs: 'Starborn gain incredible cosmic powers and alien knowledge but struggle to relate to mortals and risk madness from their own insights.',
        baseTraits: {
            languages: ['Common', 'Celestial', 'Cosmic'],
            lifespan: 'Unknown',
            baseSpeed: 30,
            size: 'Medium'
        },
        subraces: {
            voidwalker: {
                id: 'voidwalker_starborn',
                name: 'Voidwalker Starborn',
                description: 'Beings from the empty void between stars',
                statModifiers: {
                    constitution: 1,
                    strength: 0,
                    agility: 2,
                    intelligence: 3,
                    spirit: 3,
                    charisma: -1
                },
                traits: [
                    {
                        name: 'Void Step',
                        description: 'Can teleport through the void between spaces, but risk getting lost in the emptiness. Costs 3 AP.',
                        type: 'movement'
                    },
                    {
                        name: 'Cosmic Isolation',
                        description: 'Immune to mind-affecting effects and fear, but cannot form emotional bonds.',
                        type: 'mental'
                    },
                    {
                        name: 'Gravity Manipulation',
                        description: 'Can alter gravity in small areas, but affects yourself as well.',
                        type: 'utility'
                    }
                ],
                languages: ['Celestial', 'Cosmic', 'Deep Speech'],
                speed: 30
            },
            sunborn: {
                id: 'sunborn_starborn',
                name: 'Sunborn Starborn',
                description: 'Carriers of dying stellar fire',
                statModifiers: {
                    constitution: 2,
                    strength: 3,
                    agility: 1,
                    intelligence: 2,
                    spirit: 2,
                    charisma: 2
                },
                traits: [
                    {
                        name: 'Stellar Radiance',
                        description: 'Emit intense light and heat, damaging nearby enemies but also revealing your position.',
                        type: 'combat'
                    },
                    {
                        name: 'Solar Flare',
                        description: 'Release devastating bursts of stellar energy, but burn yourself in the process. Costs 4 AP.',
                        type: 'combat'
                    },
                    {
                        name: 'Photosynthesis',
                        description: 'Regenerate health in sunlight, but weaken in darkness.',
                        type: 'utility'
                    }
                ],
                languages: ['Common', 'Celestial', 'Ignan'],
                speed: 30
            },
            constellation: {
                id: 'constellation_starborn',
                name: 'Constellation Starborn',
                description: 'Living embodiments of celestial patterns',
                statModifiers: {
                    constitution: 0,
                    strength: 0,
                    agility: 2,
                    intelligence: 3,
                    spirit: 3,
                    charisma: 2
                },
                traits: [
                    {
                        name: 'Star Map',
                        description: 'Can read fate in the stars and predict future events, but visions are cryptic and maddening.',
                        type: 'divination'
                    },
                    {
                        name: 'Constellation Form',
                        description: 'Transform into pure starlight, becoming intangible but unable to affect the physical world. Costs 3 AP.',
                        type: 'transformation'
                    },
                    {
                        name: 'Cosmic Insight',
                        description: 'Gain advantage on all knowledge checks, but risk madness from forbidden knowledge.',
                        type: 'knowledge'
                    }
                ],
                languages: ['Common', 'Celestial', 'Cosmic'],
                speed: 30
            }
        }
    }
};

// Utility functions for working with race data
export const getRaceList = () => {
    return Object.values(RACE_DATA).map(race => ({
        id: race.id,
        name: race.name,
        description: race.description
    }));
};

export const getSubraceList = (raceId) => {
    const race = RACE_DATA[raceId];
    if (!race) return [];

    return Object.values(race.subraces).map(subrace => ({
        id: subrace.id,
        name: subrace.name,
        description: subrace.description
    }));
};

export const getRaceData = (raceId) => {
    return RACE_DATA[raceId] || null;
};

export const getSubraceData = (raceId, subraceId) => {
    const race = RACE_DATA[raceId];
    if (!race) return null;

    // Find subrace by ID across all subraces
    const subrace = Object.values(race.subraces).find(sr => sr.id === subraceId);
    return subrace || null;
};

export const getFullRaceData = (raceId, subraceId) => {
    const race = getRaceData(raceId);
    const subrace = getSubraceData(raceId, subraceId);

    if (!race || !subrace) return null;

    return {
        race,
        subrace,
        combinedTraits: {
            ...race.baseTraits,
            languages: subrace.languages,
            speed: subrace.speed,
            statModifiers: subrace.statModifiers,
            traits: subrace.traits
        }
    };
};

export const applyRacialModifiers = (baseStats, raceId, subraceId) => {
    const raceData = getFullRaceData(raceId, subraceId);
    if (!raceData) return baseStats;

    const modifiedStats = { ...baseStats };
    const modifiers = raceData.combinedTraits.statModifiers;

    Object.keys(modifiers).forEach(stat => {
        if (modifiedStats[stat] !== undefined) {
            modifiedStats[stat] += modifiers[stat];
        }
    });

    return modifiedStats;
};
