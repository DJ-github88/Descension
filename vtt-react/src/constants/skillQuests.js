// Skill Quest Definitions - Small side quests that progress skill levels
// Each quest unlocks new abilities and rollable tables

export const SKILL_QUESTS = {
    // Weapon Mastery Quests
    weaponMastery: [
        {
            id: 'first_blood',
            name: 'First Blood',
            description: 'Land your first successful attack with a weapon in combat',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_savageblow.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Basic weapon handling techniques']
        },
        {
            id: 'weapon_maintenance',
            name: 'Weapon Maintenance',
            description: 'Properly clean and maintain a weapon after combat',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_armorkit_17.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Weapon durability knowledge']
        },
        {
            id: 'combat_stance',
            name: 'Combat Stance',
            description: 'Learn proper fighting stance and footwork',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Basic defensive positioning']
        },
        {
            id: 'weapon_forms',
            name: 'Weapon Forms',
            description: 'Master basic weapon forms and techniques',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_weaponmastery.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Advanced weapon techniques']
        },
        {
            id: 'combat_reflexes',
            name: 'Combat Reflexes',
            description: 'Develop lightning-fast combat reflexes',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_challange.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Reaction time bonuses']
        },
        {
            id: 'weapon_specialization',
            name: 'Weapon Specialization',
            description: 'Choose and master a specific weapon type',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_39.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Specialized weapon bonuses']
        },
        {
            id: 'advanced_techniques',
            name: 'Advanced Techniques',
            description: 'Learn complex combat maneuvers and combinations',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_rampage.jpg',
            rank: 'JOURNEYMAN',
            completed: false,
            unlocks: ['Combo attacks and special moves']
        },
        {
            id: 'battlefield_awareness',
            name: 'Battlefield Awareness',
            description: 'Develop supernatural awareness of combat situations',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
            rank: 'JOURNEYMAN',
            completed: false,
            unlocks: ['360-degree combat awareness']
        },
        {
            id: 'weapon_mastery_trial',
            name: 'Weapon Mastery Trial',
            description: 'Face the trial of weapon mastery against multiple foes',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_bladestorm.jpg',
            rank: 'JOURNEYMAN',
            completed: false,
            unlocks: ['Multi-target combat techniques']
        },
        {
            id: 'transcendent_combat',
            name: 'Transcendent Combat',
            description: 'Achieve transcendent understanding of weapon combat',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_weaponmastery.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Supernatural weapon techniques']
        },
        {
            id: 'combat_veteran',
            name: 'Combat Veteran',
            description: 'Survive 5 combat encounters using weapons',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_battleshout.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Combat experience bonus']
        },
        {
            id: 'precise_strike',
            name: 'Precise Strike',
            description: 'Land a critical hit with a weapon',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_criticalstrike.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Precision attack techniques', 'Critical hit table']
        },
        {
            id: 'weapon_specialist',
            name: 'Weapon Specialist',
            description: 'Master the use of 3 different weapon types',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_27.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Weapon versatility bonus']
        },
        {
            id: 'dual_wielding',
            name: 'Dual Wielding',
            description: 'Successfully fight with two weapons simultaneously',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_dualwield.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Dual weapon techniques']
        }
    ],

    // Tactical Combat Quests
    tacticalCombat: [
        {
            id: 'battlefield_awareness',
            name: 'Battlefield Awareness',
            description: 'Successfully identify enemy positions and weaknesses',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_sleep.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Basic tactical assessment']
        },
        {
            id: 'flanking_maneuver',
            name: 'Flanking Maneuver',
            description: 'Execute a successful flanking attack',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_shadowstep.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Positioning tactics']
        },
        {
            id: 'team_coordination',
            name: 'Team Coordination',
            description: 'Coordinate with allies for a combined attack',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Group tactics knowledge']
        }
    ],

    // Wilderness Survival Quests
    wilderness: [
        {
            id: 'basic_shelter',
            name: 'Basic Shelter',
            description: 'Build a shelter to survive one night in the wilderness',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_tent_01.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Shelter construction techniques']
        },
        {
            id: 'find_water',
            name: 'Find Water',
            description: 'Locate a clean water source in the wild',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_drink_07.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Water location skills']
        },
        {
            id: 'track_creature',
            name: 'Track Creature',
            description: 'Successfully track and follow an animal for 1 mile',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_tracking.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Basic tracking abilities']
        }
    ],

    // Investigation Quests
    investigation: [
        {
            id: 'first_clue',
            name: 'First Clue',
            description: 'Find your first important clue in a mystery',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_dust_02.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Basic investigation techniques']
        },
        {
            id: 'connect_dots',
            name: 'Connect the Dots',
            description: 'Link multiple clues to solve a puzzle',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_mindmastery.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Deductive reasoning']
        },
        {
            id: 'hidden_secret',
            name: 'Hidden Secret',
            description: 'Uncover a secret that was deliberately hidden',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Secret detection abilities']
        }
    ],

    // Smithing Quests
    smithing: [
        {
            id: 'first_forge',
            name: 'First Forge',
            description: 'Successfully forge your first simple item',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_hammer_05.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Basic forging techniques']
        },
        {
            id: 'quality_work',
            name: 'Quality Work',
            description: 'Create an item of superior quality',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_39.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Quality crafting methods']
        },
        {
            id: 'exotic_materials',
            name: 'Exotic Materials',
            description: 'Work with rare or magical materials',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_incinerate.jpg',
            rank: 'JOURNEYMAN',
            completed: false,
            unlocks: ['Advanced material handling']
        }
    ],

    // Persuasion Quests
    persuasion: [
        {
            id: 'first_convert',
            name: 'First Convert',
            description: 'Successfully persuade someone to change their mind',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Basic persuasion techniques']
        },
        {
            id: 'diplomatic_solution',
            name: 'Diplomatic Solution',
            description: 'Resolve a conflict through words instead of violence',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Conflict resolution skills']
        },
        {
            id: 'mass_appeal',
            name: 'Mass Appeal',
            description: 'Persuade a group of people simultaneously',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
            rank: 'JOURNEYMAN',
            completed: false,
            unlocks: ['Group persuasion abilities']
        }
    ],

    // Spellcraft Quests
    spellcraft: [
        {
            id: 'first_spell',
            name: 'First Spell',
            description: 'Successfully cast your first spell',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Basic spellcasting knowledge']
        },
        {
            id: 'spell_modification',
            name: 'Spell Modification',
            description: 'Modify a spell to achieve a different effect',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcaneorb.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Spell customization techniques']
        },
        {
            id: 'magical_research',
            name: 'Magical Research',
            description: 'Discover or create a new spell',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Spell creation abilities']
        }
    ]
};