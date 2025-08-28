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
        description: 'Iron-willed descendants of the frozen northlands',
        icon: 'fas fa-mountain',
        baseTraits: {
            languages: ['Common', 'Old Nord'],
            lifespan: 120,
            baseSpeed: 30,
            size: 'Medium'
        },
        subraces: {
            berserker: {
                id: 'berserker_nordmark',
                name: 'Berserker Nordmark',
                description: 'Fierce warriors who embrace battle fury',
                statModifiers: {
                    constitution: 2,
                    strength: 2,
                    agility: 1,
                    intelligence: -1,
                    spirit: 0,
                    charisma: -1
                },
                traits: [
                    {
                        name: 'Battle Fury',
                        description: 'When reduced to half health, gain +2 to all attack rolls and damage for the rest of combat.',
                        type: 'combat'
                    },
                    {
                        name: 'Cold Resistance',
                        description: 'Resistance to cold damage and immunity to environmental cold effects.',
                        type: 'resistance'
                    },
                    {
                        name: 'Reckless Charge',
                        description: 'Can charge into combat with advantage on first attack, but enemies have advantage against you until your next turn.',
                        type: 'combat'
                    }
                ],
                languages: ['Common', 'Old Nord', 'Giant'],
                speed: 30
            },
            skald: {
                id: 'skald_nordmark',
                name: 'Skald Nordmark', 
                description: 'Warrior-poets who inspire through ancient sagas',
                statModifiers: {
                    constitution: 1,
                    strength: 1,
                    agility: 0,
                    intelligence: 1,
                    spirit: 1,
                    charisma: 2
                },
                traits: [
                    {
                        name: 'Inspiring Saga',
                        description: 'Once per long rest, can inspire allies with ancient tales, granting them advantage on their next ability check or attack roll.',
                        type: 'support'
                    },
                    {
                        name: 'Lore Keeper',
                        description: 'Advantage on History and Investigation checks related to ancient knowledge and legends.',
                        type: 'knowledge'
                    },
                    {
                        name: 'War Chant',
                        description: 'Can use bonus action to grant nearby allies +1 to damage rolls until end of turn, but becomes vulnerable to psychic damage.',
                        type: 'support'
                    }
                ],
                languages: ['Common', 'Old Nord', 'Celestial'],
                speed: 30
            }
        }
    },

    corvani: {
        id: 'corvani',
        name: 'Corvani',
        description: 'Raven-marked people from mist-shrouded highlands',
        icon: 'fas fa-crow',
        baseTraits: {
            languages: ['Common', 'Corvid'],
            lifespan: 100,
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
        description: 'Stone-souled miners who delved too deep',
        icon: 'fas fa-hammer',
        baseTraits: {
            languages: ['Common', 'Terran'],
            lifespan: 200,
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
            }
        }
    },

    veilborn: {
        id: 'veilborn',
        name: 'Veilborn',
        description: 'Pale folk from borderlands where reality grows thin',
        icon: 'fas fa-ghost',
        baseTraits: {
            languages: ['Common', 'Ethereal'],
            lifespan: 150,
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
        description: 'Shapeshifters who lost their original forms',
        icon: 'fas fa-mask',
        baseTraits: {
            languages: ['Common', 'Changeling'],
            lifespan: 80,
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
        description: 'Fae-touched beings bound by ancient pacts',
        icon: 'fas fa-leaf',
        baseTraits: {
            languages: ['Common', 'Sylvan'],
            lifespan: 300,
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
            }
        }
    },

    wildkin: {
        id: 'wildkin',
        name: 'Wildkin',
        description: 'Antlered forest dwellers bonded with primal wilderness',
        icon: 'fas fa-tree',
        baseTraits: {
            languages: ['Common', 'Druidic'],
            lifespan: 200,
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
            }
        }
    },

    ashmark: {
        id: 'ashmark',
        name: 'Ashmark',
        description: 'Fire-touched people from volcanic wastelands',
        baseTraits: {
            languages: ['Common', 'Ignan'],
            lifespan: 120,
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
            }
        }
    },

    skinwalker: {
        id: 'skinwalker',
        name: 'Skinwalker',
        description: 'Cursed shamans wearing beast forms',
        baseTraits: {
            languages: ['Common', 'Beast Speech'],
            lifespan: 150,
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
        description: 'Undead warriors guarding ancient treasures',
        baseTraits: {
            languages: ['Common', 'Necril'],
            lifespan: 'Immortal',
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
