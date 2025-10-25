// Quest-Based Skills System - Pathfinder Style
// Each skill has quests that unlock rollable tables and abilities

export const SKILL_CATEGORIES = {
    COMBAT: {
        name: 'Combat Mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_battleshout.jpg',
        description: 'Master the arts of war and combat'
    },
    EXPLORATION: {
        name: 'Exploration & Survival',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        description: 'Navigate the wilderness and uncover secrets'
    },
    CRAFTING: {
        name: 'Crafting & Creation',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_blacksmithing.jpg',
        description: 'Create wondrous items and masterworks'
    },
    SOCIAL: {
        name: 'Social & Influence',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        description: 'Master the arts of persuasion and leadership'
    },
    ARCANE: {
        name: 'Arcane Studies',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_detectlesserinvisibility.jpg',
        description: 'Delve into magical mysteries and forbidden knowledge'
    }
};

export const SKILL_DEFINITIONS = {
    // Combat Mastery Skills
    weaponMastery: {
        name: 'Weapon Mastery',
        category: SKILL_CATEGORIES.COMBAT.name,
        primaryStat: 'strength',
        secondaryStat: 'agility',
        description: 'Master various weapons and combat techniques',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        rollableTables: {
            UNTRAINED: 'weaponCombatBasic',
            NOVICE: 'weaponCombatOutcomes',
            TRAINED: 'weaponCombatAdvanced',
            APPRENTICE: 'weaponCombatExpert',
            ADEPT: 'weaponCombatMaster',
            EXPERT: 'weaponCombatGrandmaster',
            MASTER: 'weaponCombatLegendary'
        }
    },
    tacticalCombat: {
        name: 'Tactical Combat',
        category: SKILL_CATEGORIES.COMBAT.name,
        primaryStat: 'intelligence',
        secondaryStat: 'strength',
        description: 'Understand battlefield tactics and strategic positioning',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        rollableTables: {
            UNTRAINED: 'tacticalBasic',
            NOVICE: 'tacticalManeuvers',
            TRAINED: 'tacticalAdvanced',
            APPRENTICE: 'tacticalExpert',
            ADEPT: 'tacticalMaster',
            EXPERT: 'tacticalGrandmaster',
            MASTER: 'tacticalLegendary'
        }
    },
    defensiveTechniques: {
        name: 'Defensive Techniques',
        category: SKILL_CATEGORIES.COMBAT.name,
        primaryStat: 'constitution',
        secondaryStat: 'agility',
        description: 'Master the art of protection and damage mitigation',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        rollableTables: {
            UNTRAINED: 'defensiveBasic',
            NOVICE: 'defensiveManeuvers',
            TRAINED: 'defensiveAdvanced',
            APPRENTICE: 'defensiveExpert',
            ADEPT: 'defensiveMaster',
            EXPERT: 'defensiveGrandmaster',
            MASTER: 'defensiveLegendary'
        }
    },

    // Exploration & Survival Skills
    wilderness: {
        name: 'Wilderness Survival',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'constitution',
        secondaryStat: 'intelligence',
        description: 'Survive in harsh environments and track creatures',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_natureguardian.jpg',
        rollableTables: {
            UNTRAINED: 'wildernessBasic',
            NOVICE: 'wildernessEvents',
            TRAINED: 'wildernessAdvanced',
            APPRENTICE: 'wildernessExpert',
            ADEPT: 'wildernessMaster',
            EXPERT: 'wildernessGrandmaster',
            MASTER: 'wildernessLegendary'
        }
    },
    investigation: {
        name: 'Investigation',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Uncover clues, solve mysteries, and find hidden secrets',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        rollableTables: {
            UNTRAINED: 'investigationBasic',
            NOVICE: 'investigationFinds',
            TRAINED: 'investigationAdvanced',
            APPRENTICE: 'investigationExpert',
            ADEPT: 'investigationMaster',
            EXPERT: 'investigationGrandmaster',
            MASTER: 'investigationLegendary'
        }
    },
    athletics: {
        name: 'Athletics',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'strength',
        secondaryStat: 'constitution',
        description: 'Climb, swim, jump, and perform physical feats',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        rollableTables: {
            UNTRAINED: 'athleticsBasic',
            NOVICE: 'athleticsFeats',
            TRAINED: 'athleticsAdvanced',
            APPRENTICE: 'athleticsExpert',
            ADEPT: 'athleticsMaster',
            EXPERT: 'athleticsGrandmaster',
            MASTER: 'athleticsLegendary'
        }
    },

    // Crafting & Creation Skills
    smithing: {
        name: 'Smithing',
        category: SKILL_CATEGORIES.CRAFTING.name,
        primaryStat: 'strength',
        secondaryStat: 'intelligence',
        description: 'Forge weapons, armor, and metal items',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_blacksmithing.jpg',
        rollableTables: {
            UNTRAINED: 'smithingBasic',
            NOVICE: 'smithingResults',
            TRAINED: 'smithingAdvanced',
            APPRENTICE: 'smithingExpert',
            ADEPT: 'smithingMaster',
            EXPERT: 'smithingGrandmaster',
            MASTER: 'smithingLegendary'
        }
    },
    alchemy: {
        name: 'Alchemy',
        category: SKILL_CATEGORIES.CRAFTING.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Brew potions, create elixirs, and transmute materials',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        rollableTables: {
            UNTRAINED: 'alchemyBasic',
            NOVICE: 'alchemyOutcomes',
            TRAINED: 'alchemyAdvanced',
            APPRENTICE: 'alchemyExpert',
            ADEPT: 'alchemyMaster',
            EXPERT: 'alchemyGrandmaster',
            MASTER: 'alchemyLegendary'
        }
    },
    enchanting: {
        name: 'Enchanting',
        category: SKILL_CATEGORIES.CRAFTING.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Imbue items with magical properties',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_engraving.jpg',
        rollableTables: {
            UNTRAINED: 'enchantingBasic',
            NOVICE: 'enchantingEffects',
            TRAINED: 'enchantingAdvanced',
            APPRENTICE: 'enchantingExpert',
            ADEPT: 'enchantingMaster',
            EXPERT: 'enchantingGrandmaster',
            MASTER: 'enchantingLegendary'
        }
    },

    // Social & Influence Skills
    persuasion: {
        name: 'Persuasion',
        category: SKILL_CATEGORIES.SOCIAL.name,
        primaryStat: 'charisma',
        secondaryStat: 'intelligence',
        description: 'Convince others through charm and reasoning',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        rollableTables: {
            UNTRAINED: 'persuasionBasic',
            NOVICE: 'persuasionOutcomes',
            TRAINED: 'persuasionAdvanced',
            APPRENTICE: 'persuasionExpert',
            ADEPT: 'persuasionMaster',
            EXPERT: 'persuasionGrandmaster',
            MASTER: 'persuasionLegendary'
        }
    },
    deception: {
        name: 'Deception',
        category: SKILL_CATEGORIES.SOCIAL.name,
        primaryStat: 'charisma',
        secondaryStat: 'intelligence',
        description: 'Mislead and manipulate through lies and misdirection',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        rollableTables: {
            UNTRAINED: 'deceptionBasic',
            NOVICE: 'deceptionResults',
            TRAINED: 'deceptionAdvanced',
            APPRENTICE: 'deceptionExpert',
            ADEPT: 'deceptionMaster',
            EXPERT: 'deceptionGrandmaster',
            MASTER: 'deceptionLegendary'
        }
    },
    leadership: {
        name: 'Leadership',
        category: SKILL_CATEGORIES.SOCIAL.name,
        primaryStat: 'charisma',
        secondaryStat: 'spirit',
        description: 'Inspire and command others in times of need',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        rollableTables: {
            UNTRAINED: 'leadershipBasic',
            NOVICE: 'leadershipEffects',
            TRAINED: 'leadershipAdvanced',
            APPRENTICE: 'leadershipExpert',
            ADEPT: 'leadershipMaster',
            EXPERT: 'leadershipGrandmaster',
            MASTER: 'leadershipLegendary'
        }
    },

    // Arcane Studies Skills
    spellcraft: {
        name: 'Spellcraft',
        category: SKILL_CATEGORIES.ARCANE.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Understand and manipulate magical energies',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        rollableTables: {
            UNTRAINED: 'spellcraftBasic',
            NOVICE: 'spellcraftResults',
            TRAINED: 'spellcraftAdvanced',
            APPRENTICE: 'spellcraftExpert',
            ADEPT: 'spellcraftMaster',
            EXPERT: 'spellcraftGrandmaster',
            MASTER: 'spellcraftLegendary'
        }
    },
    arcaneKnowledge: {
        name: 'Arcane Knowledge',
        category: SKILL_CATEGORIES.ARCANE.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Study ancient lore and magical theory',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        rollableTables: {
            UNTRAINED: 'arcaneBasic',
            NOVICE: 'arcaneDiscoveries',
            TRAINED: 'arcaneAdvanced',
            APPRENTICE: 'arcaneExpert',
            ADEPT: 'arcaneMaster',
            EXPERT: 'arcaneGrandmaster',
            MASTER: 'arcaneLegendary'
        }
    },
    ritualMagic: {
        name: 'Ritual Magic',
        category: SKILL_CATEGORIES.ARCANE.name,
        primaryStat: 'spirit',
        secondaryStat: 'intelligence',
        description: 'Perform complex magical rituals and ceremonies',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        rollableTables: {
            UNTRAINED: 'ritualBasic',
            NOVICE: 'ritualOutcomes',
            TRAINED: 'ritualAdvanced',
            APPRENTICE: 'ritualExpert',
            ADEPT: 'ritualMaster',
            EXPERT: 'ritualGrandmaster',
            MASTER: 'ritualLegendary'
        }
    },

    // Additional D&D Standard Skills
    acrobatics: {
        name: 'Acrobatics',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'agility',
        secondaryStat: 'strength',
        description: 'Balance, tumble, and perform acrobatic stunts to avoid falls and navigate difficult terrain',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        rollableTables: {
            UNTRAINED: 'acrobaticsBasic',
            NOVICE: 'acrobaticsFeats',
            TRAINED: 'acrobaticsAdvanced',
            APPRENTICE: 'acrobaticsExpert',
            ADEPT: 'acrobaticsMaster',
            EXPERT: 'acrobaticsGrandmaster',
            MASTER: 'acrobaticsLegendary'
        }
    },
    animalHandling: {
        name: 'Animal Handling',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'spirit',
        secondaryStat: 'charisma',
        description: 'Calm, train, and read the intentions of animals and beasts',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        rollableTables: {
            UNTRAINED: 'animalHandlingBasic',
            NOVICE: 'animalHandlingOutcomes',
            TRAINED: 'animalHandlingAdvanced',
            APPRENTICE: 'animalHandlingExpert',
            ADEPT: 'animalHandlingMaster',
            EXPERT: 'animalHandlingGrandmaster',
            MASTER: 'animalHandlingLegendary'
        }
    },
    arcana: {
        name: 'Arcana',
        category: SKILL_CATEGORIES.ARCANE.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Knowledge of magic, spells, magical items, and arcane symbols',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        rollableTables: {
            UNTRAINED: 'arcanaBasic',
            NOVICE: 'arcanaKnowledge',
            TRAINED: 'arcanaAdvanced',
            APPRENTICE: 'arcanaExpert',
            ADEPT: 'arcanaMaster',
            EXPERT: 'arcanaGrandmaster',
            MASTER: 'arcanaLegendary'
        }
    },
    history: {
        name: 'History',
        category: SKILL_CATEGORIES.ARCANE.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Knowledge of historical events, legends, ancient civilizations, and past conflicts',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        rollableTables: {
            UNTRAINED: 'historyBasic',
            NOVICE: 'historicalKnowledge',
            TRAINED: 'historyAdvanced',
            APPRENTICE: 'historyExpert',
            ADEPT: 'historyMaster',
            EXPERT: 'historyGrandmaster',
            MASTER: 'historyLegendary'
        }
    },
    insight: {
        name: 'Insight',
        category: SKILL_CATEGORIES.SOCIAL.name,
        primaryStat: 'spirit',
        secondaryStat: 'intelligence',
        description: 'Read body language and determine true intentions to detect lies',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        rollableTables: {
            UNTRAINED: 'insightBasic',
            NOVICE: 'insightReading',
            TRAINED: 'insightAdvanced',
            APPRENTICE: 'insightExpert',
            ADEPT: 'insightMaster',
            EXPERT: 'insightGrandmaster',
            MASTER: 'insightLegendary'
        }
    },
    intimidation: {
        name: 'Intimidation',
        category: SKILL_CATEGORIES.SOCIAL.name,
        primaryStat: 'strength',
        secondaryStat: 'charisma',
        description: 'Influence others through threats, hostile actions, and physical presence',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        rollableTables: {
            UNTRAINED: 'intimidationBasic',
            NOVICE: 'intimidationEffects',
            TRAINED: 'intimidationAdvanced',
            APPRENTICE: 'intimidationExpert',
            ADEPT: 'intimidationMaster',
            EXPERT: 'intimidationGrandmaster',
            MASTER: 'intimidationLegendary'
        }
    },
    medicine: {
        name: 'Medicine',
        category: SKILL_CATEGORIES.CRAFTING.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Diagnose illness, treat wounds, and stabilize the dying',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        rollableTables: {
            UNTRAINED: 'medicineBasic',
            NOVICE: 'medicineResults',
            TRAINED: 'medicineAdvanced',
            APPRENTICE: 'medicineExpert',
            ADEPT: 'medicineMaster',
            EXPERT: 'medicineGrandmaster',
            MASTER: 'medicineLegendary'
        }
    },
    nature: {
        name: 'Nature',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Knowledge of terrain, plants, animals, and weather patterns',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        rollableTables: {
            UNTRAINED: 'natureBasic',
            NOVICE: 'natureKnowledge',
            TRAINED: 'natureAdvanced',
            APPRENTICE: 'natureExpert',
            ADEPT: 'natureMaster',
            EXPERT: 'natureGrandmaster',
            MASTER: 'natureLegendary'
        }
    },
    perception: {
        name: 'Perception',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'spirit',
        secondaryStat: 'intelligence',
        description: 'Spot, hear, and detect things in your environment',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        rollableTables: {
            UNTRAINED: 'perceptionBasic',
            NOVICE: 'perceptionFinds',
            TRAINED: 'perceptionAdvanced',
            APPRENTICE: 'perceptionExpert',
            ADEPT: 'perceptionMaster',
            EXPERT: 'perceptionGrandmaster',
            MASTER: 'perceptionLegendary'
        }
    },
    performance: {
        name: 'Performance',
        category: SKILL_CATEGORIES.SOCIAL.name,
        primaryStat: 'charisma',
        secondaryStat: 'agility',
        description: 'Entertain an audience through music, dance, acting, or storytelling',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        rollableTables: {
            UNTRAINED: 'performanceBasic',
            NOVICE: 'performanceOutcomes',
            TRAINED: 'performanceAdvanced',
            APPRENTICE: 'performanceExpert',
            ADEPT: 'performanceMaster',
            EXPERT: 'performanceGrandmaster',
            MASTER: 'performanceLegendary'
        }
    },
    religion: {
        name: 'Religion',
        category: SKILL_CATEGORIES.ARCANE.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Knowledge of deities, religious rituals, holy symbols, and divine magic',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        rollableTables: {
            UNTRAINED: 'religionBasic',
            NOVICE: 'religiousKnowledge',
            TRAINED: 'religionAdvanced',
            APPRENTICE: 'religionExpert',
            ADEPT: 'religionMaster',
            EXPERT: 'religionGrandmaster',
            MASTER: 'religionLegendary'
        }
    },
    sleightOfHand: {
        name: 'Sleight of Hand',
        category: SKILL_CATEGORIES.SOCIAL.name,
        primaryStat: 'agility',
        secondaryStat: 'intelligence',
        description: 'Manual trickery including pickpocketing, concealing objects, and performing tricks',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        rollableTables: {
            UNTRAINED: 'sleightOfHandBasic',
            NOVICE: 'sleightOfHandTricks',
            TRAINED: 'sleightOfHandAdvanced',
            APPRENTICE: 'sleightOfHandExpert',
            ADEPT: 'sleightOfHandMaster',
            EXPERT: 'sleightOfHandGrandmaster',
            MASTER: 'sleightOfHandLegendary'
        }
    },
    stealth: {
        name: 'Stealth',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'agility',
        secondaryStat: 'intelligence',
        description: 'Move silently and hide from enemies to avoid detection',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        rollableTables: {
            UNTRAINED: 'stealthBasic',
            NOVICE: 'stealthOutcomes',
            TRAINED: 'stealthAdvanced',
            APPRENTICE: 'stealthExpert',
            ADEPT: 'stealthMaster',
            EXPERT: 'stealthGrandmaster',
            MASTER: 'stealthLegendary'
        }
    },
    survival: {
        name: 'Survival',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'constitution',
        secondaryStat: 'intelligence',
        description: 'Follow tracks, hunt, navigate wilderness, and predict weather',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        rollableTables: {
            UNTRAINED: 'survivalBasic',
            NOVICE: 'survivalSkills',
            TRAINED: 'survivalAdvanced',
            APPRENTICE: 'survivalExpert',
            ADEPT: 'survivalMaster',
            EXPERT: 'survivalGrandmaster',
            MASTER: 'survivalLegendary'
        }
    }
};

// Skill progression ranks - 7 levels of expertise with 10 quests per skill
export const SKILL_RANKS = {
    UNTRAINED: { name: 'Untrained', color: '#6b6b6b', questsRequired: 0, statBonus: 0 },
    NOVICE: { name: 'Novice', color: '#8b7355', questsRequired: 2, statBonus: 1 },
    TRAINED: { name: 'Trained', color: '#4a7c59', questsRequired: 4, statBonus: 2 },
    APPRENTICE: { name: 'Apprentice', color: '#5d8a6b', questsRequired: 6, statBonus: 3 },
    ADEPT: { name: 'Adept', color: '#2563eb', questsRequired: 8, statBonus: 4 },
    EXPERT: { name: 'Expert', color: '#7a3b2e', questsRequired: 9, statBonus: 5 },
    MASTER: { name: 'Master', color: '#9d4edd', questsRequired: 10, statBonus: 6 }
};
