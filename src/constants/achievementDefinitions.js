// Achievement categories matching WoW style
export const ACHIEVEMENT_CATEGORIES = {
    COMBAT: 'Combat',
    EXPLORATION: 'Exploration',
    QUESTS: 'Quests',
    SOCIAL: 'Social',
    SPECIAL: 'Special'
};

export const LEVEL_REQUIREMENTS = {
    0: { points: 0, name: 'Untrained', color: '#666666' },
    1: { points: 60, name: 'Novice', color: '#ffffff' },
    2: { points: 120, name: 'Apprentice', color: '#1eff00' },
    3: { points: 240, name: 'Journeyman', color: '#0070dd' },
    4: { points: 480, name: 'Expert', color: '#a335ee' },
    5: { points: 960, name: 'Master', color: '#ff8000' },
    6: { points: 1920, name: 'Grandmaster', color: '#e6cc80' }
};

// Achievement definitions for skills
export const SKILL_ACHIEVEMENTS = {
    slashingWeapons: [
        {
            id: 'basic-blade-training',
            name: 'Basic Blade Training',
            description: 'Successfully land 10 attacks with a slashing weapon',
            points: 10,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_savageblow.jpg'
        },
        {
            id: 'precise-cuts',
            name: 'Precise Cuts',
            description: 'Land a critical hit with a slashing weapon',
            points: 20,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_criticalstrike.jpg'
        },
        {
            id: 'master-swordsman',
            name: 'Master Swordsman',
            description: 'Defeat 3 enemies in a single combat using only slashing weapons',
            points: 30,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_27.jpg'
        },
        {
            id: 'blade-dancer',
            name: 'Blade Dancer',
            description: 'Successfully dodge 5 attacks while wielding a slashing weapon',
            points: 40,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_dualwield.jpg'
        },
        {
            id: 'legendary-blade',
            name: 'Legendary Blade',
            description: 'Achieve mastery with 3 different types of slashing weapons',
            points: 50,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_11.jpg'
        }
    ],
    piercingWeapons: [
        {
            id: 'basic-pierce-training',
            name: 'Basic Pierce Training',
            description: 'Successfully land 10 attacks with a piercing weapon',
            points: 10,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_spear_05.jpg'
        },
        {
            id: 'vital-strike',
            name: 'Vital Strike',
            description: 'Hit a vital spot for extra damage with a piercing weapon',
            points: 20,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_backstab.jpg'
        },
        {
            id: 'master-archer',
            name: 'Master Archer',
            description: 'Hit 3 targets in succession with ranged piercing weapons',
            points: 30,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_quickshot.jpg'
        },
        {
            id: 'penetrating-shot',
            name: 'Penetrating Shot',
            description: 'Pierce through an enemy\'s armor with a critical hit',
            points: 40,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_piercingshots.jpg'
        },
        {
            id: 'legendary-marksman',
            name: 'Legendary Marksman',
            description: 'Achieve mastery with both melee and ranged piercing weapons',
            points: 50,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/achievement_bg_reward_greatestassist.jpg'
        }
    ],
    bludgeoningWeapons: [
        {
            id: 'basic-blunt-training',
            name: 'Basic Blunt Training',
            description: 'Successfully land 10 attacks with a bludgeoning weapon',
            points: 10,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_mace_02.jpg'
        },
        {
            id: 'bone-crusher',
            name: 'Bone Crusher',
            description: 'Break an enemy\'s armor or shield with a bludgeoning weapon',
            points: 20,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_hammer_19.jpg'
        },
        {
            id: 'master-hammerer',
            name: 'Master Hammerer',
            description: 'Stun 3 different enemies with bludgeoning weapons',
            points: 30,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_decisivestrike.jpg'
        },
        {
            id: 'earth-shaker',
            name: 'Earth Shaker',
            description: 'Perform a ground slam attack that affects multiple enemies',
            points: 40,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_earthquake.jpg'
        },
        {
            id: 'legendary-crusher',
            name: 'Legendary Crusher',
            description: 'Master all types of bludgeoning weapons',
            points: 50,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_hammer_unique_sulfuras.jpg'
        }
    ],
    dualWielding: [
        {
            id: 'basic-dual-training',
            name: 'Basic Dual Training',
            description: 'Successfully attack with both weapons in the same turn',
            points: 10,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_challange.jpg'
        },
        {
            id: 'ambidextrous',
            name: 'Ambidextrous',
            description: 'Land critical hits with both weapons in the same combat',
            points: 20,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_ambush.jpg'
        },
        {
            id: 'master-of-two',
            name: 'Master of Two',
            description: 'Defeat an enemy using alternating strikes from both weapons',
            points: 30,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_swarmofblades.jpg'
        },
        {
            id: 'whirlwind',
            name: 'Whirlwind',
            description: 'Hit multiple enemies in a single dual-wielding attack',
            points: 40,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_whirlwind.jpg'
        },
        {
            id: 'legendary-dualist',
            name: 'Legendary Dualist',
            description: 'Master three different weapon combinations',
            points: 50,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/achievement_arena_2v2_7.jpg'
        }
    ],
    shieldMastery: [
        {
            id: 'basic-shield-training',
            name: 'Basic Shield Training',
            description: 'Successfully block 10 attacks with a shield',
            points: 10,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_shield_04.jpg'
        },
        {
            id: 'shield-wall',
            name: 'Shield Wall',
            description: 'Block attacks for an ally using your shield',
            points: 20,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_shieldwall.jpg'
        },
        {
            id: 'master-defender',
            name: 'Master Defender',
            description: 'Survive a combat without taking damage using a shield',
            points: 30,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg'
        },
        {
            id: 'shield-bash',
            name: 'Shield Bash',
            description: 'Stun an enemy with a shield bash attack',
            points: 40,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_shieldbash.jpg'
        },
        {
            id: 'legendary-guardian',
            name: 'Legendary Guardian',
            description: 'Master all shield techniques and block 100 attacks',
            points: 50,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/achievement_boss_archaedas.jpg'
        }
    ],
    spellcasting: [
        {
            id: 'basic-spell-training',
            name: 'Basic Spell Training',
            description: 'Successfully cast 10 spells',
            points: 10,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg'
        },
        {
            id: 'spell-weaver',
            name: 'Spell Weaver',
            description: 'Cast spells from three different schools of magic',
            points: 20,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_wispheal.jpg'
        },
        {
            id: 'master-mage',
            name: 'Master Mage',
            description: 'Cast a spell at its highest level',
            points: 30,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_arcaneintellect.jpg'
        },
        {
            id: 'arcane-combo',
            name: 'Arcane Combo',
            description: 'Chain three spells together in a single turn',
            points: 40,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_auramastery.jpg'
        },
        {
            id: 'legendary-archmage',
            name: 'Legendary Archmage',
            description: 'Master all schools of magic',
            points: 50,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg'
        }
    ],
    // Add more skills here...
};

// Achievement display settings
export const ACHIEVEMENT_DISPLAY = {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderColor: '#444',
    completedColor: '#4CAF50'
};
