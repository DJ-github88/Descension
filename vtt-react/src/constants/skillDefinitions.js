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
            APPRENTICE: 'weaponCombatAdvanced',
            JOURNEYMAN: 'weaponCombatExpert',
            ADEPT: 'weaponCombatMaster',
            EXPERT: 'weaponCombatGrandmaster',
            MASTER: 'weaponCombatLegendary',
            GRANDMASTER: 'weaponCombatMythic',
            LEGENDARY: 'weaponCombatDivine',
            MYTHIC: 'weaponCombatCosmic'
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
            APPRENTICE: 'tacticalAdvanced',
            JOURNEYMAN: 'tacticalExpert',
            ADEPT: 'tacticalMaster',
            EXPERT: 'tacticalGrandmaster',
            MASTER: 'tacticalLegendary',
            GRANDMASTER: 'tacticalMythic',
            LEGENDARY: 'tacticalDivine',
            MYTHIC: 'tacticalCosmic'
        }
    },
    defensiveTechniques: {
        name: 'Defensive Techniques',
        category: SKILL_CATEGORIES.COMBAT.name,
        primaryStat: 'constitution',
        secondaryStat: 'agility',
        description: 'Master the art of protection and damage mitigation',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        rollableTable: 'defensiveManeuvers'
    },

    // Exploration & Survival Skills
    wilderness: {
        name: 'Wilderness Survival',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'constitution',
        secondaryStat: 'intelligence',
        description: 'Survive in harsh environments and track creatures',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_natureguardian.jpg',
        rollableTable: 'wildernessEvents'
    },
    investigation: {
        name: 'Investigation',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Uncover clues, solve mysteries, and find hidden secrets',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        rollableTable: 'investigationFinds'
    },
    athletics: {
        name: 'Athletics',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'strength',
        secondaryStat: 'constitution',
        description: 'Climb, swim, jump, and perform physical feats',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        rollableTable: 'athleticFeats'
    },

    // Crafting & Creation Skills
    smithing: {
        name: 'Smithing',
        category: SKILL_CATEGORIES.CRAFTING.name,
        primaryStat: 'strength',
        secondaryStat: 'intelligence',
        description: 'Forge weapons, armor, and metal items',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_blacksmithing.jpg',
        rollableTable: 'smithingResults'
    },
    alchemy: {
        name: 'Alchemy',
        category: SKILL_CATEGORIES.CRAFTING.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Brew potions, create elixirs, and transmute materials',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        rollableTable: 'alchemyOutcomes'
    },
    enchanting: {
        name: 'Enchanting',
        category: SKILL_CATEGORIES.CRAFTING.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Imbue items with magical properties',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_engraving.jpg',
        rollableTable: 'enchantingEffects'
    },

    // Social & Influence Skills
    persuasion: {
        name: 'Persuasion',
        category: SKILL_CATEGORIES.SOCIAL.name,
        primaryStat: 'charisma',
        secondaryStat: 'intelligence',
        description: 'Convince others through charm and reasoning',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        rollableTable: 'persuasionOutcomes'
    },
    deception: {
        name: 'Deception',
        category: SKILL_CATEGORIES.SOCIAL.name,
        primaryStat: 'charisma',
        secondaryStat: 'intelligence',
        description: 'Mislead and manipulate through lies and misdirection',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        rollableTable: 'deceptionResults'
    },
    leadership: {
        name: 'Leadership',
        category: SKILL_CATEGORIES.SOCIAL.name,
        primaryStat: 'charisma',
        secondaryStat: 'spirit',
        description: 'Inspire and command others in times of need',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        rollableTable: 'leadershipEffects'
    },

    // Arcane Studies Skills
    spellcraft: {
        name: 'Spellcraft',
        category: SKILL_CATEGORIES.ARCANE.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Understand and manipulate magical energies',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        rollableTable: 'spellcraftResults'
    },
    arcaneKnowledge: {
        name: 'Arcane Knowledge',
        category: SKILL_CATEGORIES.ARCANE.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Study ancient lore and magical theory',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        rollableTable: 'arcaneDiscoveries'
    },
    ritualMagic: {
        name: 'Ritual Magic',
        category: SKILL_CATEGORIES.ARCANE.name,
        primaryStat: 'spirit',
        secondaryStat: 'intelligence',
        description: 'Perform complex magical rituals and ceremonies',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        rollableTable: 'ritualOutcomes'
    },

    // Additional D&D Standard Skills
    acrobatics: {
        name: 'Acrobatics',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'agility',
        secondaryStat: 'strength',
        description: 'Balance, tumble, and perform acrobatic stunts to avoid falls and navigate difficult terrain',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        rollableTable: 'acrobaticsFeats'
    },
    animalHandling: {
        name: 'Animal Handling',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'spirit',
        secondaryStat: 'charisma',
        description: 'Calm, train, and read the intentions of animals and beasts',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        rollableTable: 'animalHandlingOutcomes'
    },
    arcana: {
        name: 'Arcana',
        category: SKILL_CATEGORIES.ARCANE.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Knowledge of magic, spells, magical items, and arcane symbols',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        rollableTable: 'arcanaKnowledge'
    },
    history: {
        name: 'History',
        category: SKILL_CATEGORIES.ARCANE.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Knowledge of historical events, legends, ancient civilizations, and past conflicts',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        rollableTable: 'historicalKnowledge'
    },
    insight: {
        name: 'Insight',
        category: SKILL_CATEGORIES.SOCIAL.name,
        primaryStat: 'spirit',
        secondaryStat: 'intelligence',
        description: 'Read body language and determine true intentions to detect lies',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        rollableTable: 'insightReading'
    },
    intimidation: {
        name: 'Intimidation',
        category: SKILL_CATEGORIES.SOCIAL.name,
        primaryStat: 'strength',
        secondaryStat: 'charisma',
        description: 'Influence others through threats, hostile actions, and physical presence',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        rollableTable: 'intimidationEffects'
    },
    medicine: {
        name: 'Medicine',
        category: SKILL_CATEGORIES.CRAFTING.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Diagnose illness, treat wounds, and stabilize the dying',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        rollableTable: 'medicineResults'
    },
    nature: {
        name: 'Nature',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Knowledge of terrain, plants, animals, and weather patterns',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        rollableTable: 'natureKnowledge'
    },
    perception: {
        name: 'Perception',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'spirit',
        secondaryStat: 'intelligence',
        description: 'Spot, hear, and detect things in your environment',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        rollableTable: 'perceptionFinds'
    },
    performance: {
        name: 'Performance',
        category: SKILL_CATEGORIES.SOCIAL.name,
        primaryStat: 'charisma',
        secondaryStat: 'agility',
        description: 'Entertain an audience through music, dance, acting, or storytelling',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        rollableTable: 'performanceOutcomes'
    },
    religion: {
        name: 'Religion',
        category: SKILL_CATEGORIES.ARCANE.name,
        primaryStat: 'intelligence',
        secondaryStat: 'spirit',
        description: 'Knowledge of deities, religious rituals, holy symbols, and divine magic',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        rollableTable: 'religiousKnowledge'
    },
    sleightOfHand: {
        name: 'Sleight of Hand',
        category: SKILL_CATEGORIES.SOCIAL.name,
        primaryStat: 'agility',
        secondaryStat: 'intelligence',
        description: 'Manual trickery including pickpocketing, concealing objects, and performing tricks',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        rollableTable: 'sleightOfHandTricks'
    },
    stealth: {
        name: 'Stealth',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'agility',
        secondaryStat: 'intelligence',
        description: 'Move silently and hide from enemies to avoid detection',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        rollableTable: 'stealthOutcomes'
    },
    survival: {
        name: 'Survival',
        category: SKILL_CATEGORIES.EXPLORATION.name,
        primaryStat: 'constitution',
        secondaryStat: 'intelligence',
        description: 'Follow tracks, hunt, navigate wilderness, and predict weather',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        rollableTable: 'survivalSkills'
    }
};

// Skill progression ranks - Expanded with more levels
export const SKILL_RANKS = {
    UNTRAINED: { name: 'Untrained', color: '#6b6b6b', questsRequired: 0, statBonus: 0 },
    NOVICE: { name: 'Novice', color: '#8b7355', questsRequired: 2, statBonus: 1 },
    APPRENTICE: { name: 'Apprentice', color: '#4a7c59', questsRequired: 5, statBonus: 2 },
    JOURNEYMAN: { name: 'Journeyman', color: '#5d8a6b', questsRequired: 9, statBonus: 3 },
    ADEPT: { name: 'Adept', color: '#2563eb', questsRequired: 14, statBonus: 4 },
    EXPERT: { name: 'Expert', color: '#7a3b2e', questsRequired: 20, statBonus: 5 },
    MASTER: { name: 'Master', color: '#9d4edd', questsRequired: 27, statBonus: 6 },
    GRANDMASTER: { name: 'Grandmaster', color: '#c77dff', questsRequired: 35, statBonus: 7 },
    LEGENDARY: { name: 'Legendary', color: '#ff6b35', questsRequired: 44, statBonus: 8 },
    MYTHIC: { name: 'Mythic', color: '#ff0080', questsRequired: 54, statBonus: 10 }
};
