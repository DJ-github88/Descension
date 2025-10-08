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
    ],

    // Acrobatics Quests
    acrobatics: [
        {
            id: 'first_flip',
            name: 'First Flip',
            description: 'Successfully perform an acrobatic flip or tumble',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Basic tumbling techniques']
        },
        {
            id: 'balance_beam',
            name: 'Balance Beam',
            description: 'Walk across a narrow surface without falling',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_feint.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Balance mastery']
        },
        {
            id: 'combat_acrobatics',
            name: 'Combat Acrobatics',
            description: 'Use acrobatics to avoid an attack in combat',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_wrongfullyaccused.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Evasive maneuvers']
        }
    ],

    // Animal Handling Quests
    animalHandling: [
        {
            id: 'calm_beast',
            name: 'Calm the Beast',
            description: 'Successfully calm an agitated animal',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Animal calming techniques']
        },
        {
            id: 'mount_training',
            name: 'Mount Training',
            description: 'Train a mount to follow basic commands',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_mount_ridinghorse.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Mount handling skills']
        },
        {
            id: 'beast_companion',
            name: 'Beast Companion',
            description: 'Form a bond with a wild animal',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastmastery.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Animal companionship']
        }
    ],

    // Arcana Quests
    arcana: [
        {
            id: 'identify_magic',
            name: 'Identify Magic',
            description: 'Successfully identify a magical item or effect',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Magic identification']
        },
        {
            id: 'read_runes',
            name: 'Read Runes',
            description: 'Decipher ancient magical runes or symbols',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_inscription_runescrolloffortitude.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Runic knowledge']
        },
        {
            id: 'dispel_magic',
            name: 'Dispel Magic',
            description: 'Successfully dispel or counter a magical effect',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_dispelmagic.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Magical dispelling']
        }
    ],

    // History Quests
    history: [
        {
            id: 'ancient_lore',
            name: 'Ancient Lore',
            description: 'Recall important historical information',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Historical knowledge']
        },
        {
            id: 'decipher_text',
            name: 'Decipher Ancient Text',
            description: 'Translate an ancient historical document',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_scroll_03.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Ancient language understanding']
        },
        {
            id: 'legendary_knowledge',
            name: 'Legendary Knowledge',
            description: 'Uncover a lost piece of legendary history',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Legendary lore']
        }
    ],

    // Insight Quests
    insight: [
        {
            id: 'detect_lie',
            name: 'Detect Lie',
            description: 'Successfully detect when someone is lying',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Lie detection']
        },
        {
            id: 'read_intentions',
            name: 'Read Intentions',
            description: 'Determine someone\'s true intentions',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_mindsteal.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Intention reading']
        },
        {
            id: 'empathic_bond',
            name: 'Empathic Bond',
            description: 'Form an empathic connection with another person',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_prayerofhealing.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Empathy mastery']
        }
    ],

    // Intimidation Quests
    intimidation: [
        {
            id: 'first_threat',
            name: 'First Threat',
            description: 'Successfully intimidate someone into compliance',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Basic intimidation']
        },
        {
            id: 'show_of_force',
            name: 'Show of Force',
            description: 'Use physical presence to intimidate a group',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_shieldbreak.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Group intimidation']
        },
        {
            id: 'fearsome_reputation',
            name: 'Fearsome Reputation',
            description: 'Build a reputation that precedes you',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_deathscream.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Reputation intimidation']
        }
    ],

    // Medicine Quests
    medicine: [
        {
            id: 'first_aid',
            name: 'First Aid',
            description: 'Successfully treat a wound or injury',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Basic first aid']
        },
        {
            id: 'stabilize_dying',
            name: 'Stabilize the Dying',
            description: 'Stabilize a dying creature',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_guardianspirit.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Stabilization techniques']
        },
        {
            id: 'diagnose_illness',
            name: 'Diagnose Illness',
            description: 'Correctly diagnose a disease or poison',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_restoration.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Diagnostic skills']
        }
    ],

    // Nature Quests
    nature: [
        {
            id: 'identify_plant',
            name: 'Identify Plant',
            description: 'Correctly identify a plant and its properties',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Plant identification']
        },
        {
            id: 'predict_weather',
            name: 'Predict Weather',
            description: 'Accurately predict upcoming weather patterns',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_stranglevines.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Weather prediction']
        },
        {
            id: 'natural_remedy',
            name: 'Natural Remedy',
            description: 'Create a remedy from natural materials',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_herb_felblossom.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Natural healing']
        }
    ],

    // Perception Quests
    perception: [
        {
            id: 'spot_hidden',
            name: 'Spot Hidden',
            description: 'Notice a hidden object or creature',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Hidden detection']
        },
        {
            id: 'keen_hearing',
            name: 'Keen Hearing',
            description: 'Hear something others missed',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_detectinvisibility.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Enhanced hearing']
        },
        {
            id: 'danger_sense',
            name: 'Danger Sense',
            description: 'Sense danger before it strikes',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_sentinal.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Danger awareness']
        }
    ],

    // Performance Quests
    performance: [
        {
            id: 'first_performance',
            name: 'First Performance',
            description: 'Successfully entertain an audience',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Basic performance']
        },
        {
            id: 'captivate_crowd',
            name: 'Captivate Crowd',
            description: 'Hold a crowd\'s attention for an entire performance',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bell_01.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Crowd control']
        },
        {
            id: 'legendary_performance',
            name: 'Legendary Performance',
            description: 'Give a performance people will remember forever',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_horn_02.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Legendary artistry']
        }
    ],

    // Religion Quests
    religion: [
        {
            id: 'divine_knowledge',
            name: 'Divine Knowledge',
            description: 'Recall important religious information',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Religious knowledge']
        },
        {
            id: 'identify_symbol',
            name: 'Identify Holy Symbol',
            description: 'Identify a deity or religion from their symbols',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_jewelry_talisman_12.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Symbol recognition']
        },
        {
            id: 'perform_ritual',
            name: 'Perform Ritual',
            description: 'Successfully perform a religious ritual',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_prayerofhealing02.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Ritual knowledge']
        }
    ],

    // Sleight of Hand Quests
    sleightOfHand: [
        {
            id: 'first_trick',
            name: 'First Trick',
            description: 'Successfully perform a sleight of hand trick',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Basic tricks']
        },
        {
            id: 'pickpocket',
            name: 'Pickpocket',
            description: 'Successfully pickpocket someone without being noticed',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_08.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Pickpocketing skills']
        },
        {
            id: 'master_thief',
            name: 'Master Thief',
            description: 'Steal something valuable from a well-guarded target',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_cenarionherbbag.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Advanced thievery']
        }
    ],

    // Stealth Quests
    stealth: [
        {
            id: 'first_sneak',
            name: 'First Sneak',
            description: 'Successfully sneak past an enemy',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Basic stealth']
        },
        {
            id: 'hide_in_shadows',
            name: 'Hide in Shadows',
            description: 'Hide successfully while being actively searched for',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_shadowdance.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Shadow hiding']
        },
        {
            id: 'invisible_movement',
            name: 'Invisible Movement',
            description: 'Move through a crowded area without being noticed',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_deadlybrew.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Silent movement']
        }
    ],

    // Survival Quests
    survival: [
        {
            id: 'find_food',
            name: 'Find Food',
            description: 'Successfully forage or hunt for food in the wild',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Foraging skills']
        },
        {
            id: 'track_prey',
            name: 'Track Prey',
            description: 'Track and follow an animal\'s trail',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_tracking.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Tracking abilities']
        },
        {
            id: 'wilderness_master',
            name: 'Wilderness Master',
            description: 'Survive alone in the wilderness for a week',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_natureguardian.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Wilderness mastery']
        }
    ],

    // Deception Quests
    deception: [
        {
            id: 'first_lie',
            name: 'First Lie',
            description: 'Successfully deceive someone with a convincing lie',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Basic deception']
        },
        {
            id: 'maintain_disguise',
            name: 'Maintain Disguise',
            description: 'Maintain a false identity for an extended period',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_cheatdeath.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Disguise mastery']
        },
        {
            id: 'master_manipulator',
            name: 'Master Manipulator',
            description: 'Manipulate someone into doing something against their interests',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_charm.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Manipulation techniques']
        }
    ],

    // Leadership Quests
    leadership: [
        {
            id: 'rally_allies',
            name: 'Rally Allies',
            description: 'Successfully rally allies in a difficult situation',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Rally abilities']
        },
        {
            id: 'tactical_command',
            name: 'Tactical Command',
            description: 'Lead a group to victory through tactical commands',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Command skills']
        },
        {
            id: 'inspire_greatness',
            name: 'Inspire Greatness',
            description: 'Inspire others to achieve something they thought impossible',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_heroism.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Inspirational leadership']
        }
    ],

    // Athletics Quests
    athletics: [
        {
            id: 'first_climb',
            name: 'First Climb',
            description: 'Successfully climb a difficult surface',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Climbing techniques']
        },
        {
            id: 'long_jump',
            name: 'Long Jump',
            description: 'Make an impressive long jump',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_heroicleap.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Jumping mastery']
        },
        {
            id: 'swimming_master',
            name: 'Swimming Master',
            description: 'Swim through dangerous waters successfully',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_summonwaterelemental.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Swimming expertise']
        }
    ],

    // Alchemy Quests
    alchemy: [
        {
            id: 'first_potion',
            name: 'First Potion',
            description: 'Successfully brew your first potion',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Basic potion brewing']
        },
        {
            id: 'rare_ingredient',
            name: 'Rare Ingredient',
            description: 'Successfully work with a rare alchemical ingredient',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_alchemy_elixir_04.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Rare ingredient handling']
        },
        {
            id: 'transmutation',
            name: 'Transmutation',
            description: 'Successfully transmute one material into another',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_alchemy_elixir_05.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Transmutation skills']
        }
    ],

    // Enchanting Quests
    enchanting: [
        {
            id: 'first_enchantment',
            name: 'First Enchantment',
            description: 'Successfully enchant your first item',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_engraving.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Basic enchanting']
        },
        {
            id: 'disenchant_magic',
            name: 'Disenchant Magic',
            description: 'Successfully disenchant a magical item',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_enchant_disenchant.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Disenchanting skills']
        },
        {
            id: 'powerful_enchantment',
            name: 'Powerful Enchantment',
            description: 'Create a powerful enchantment on a rare item',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_enchant_essenceeternallarge.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Advanced enchanting']
        }
    ],

    // Arcane Knowledge Quests
    arcaneKnowledge: [
        {
            id: 'arcane_theory',
            name: 'Arcane Theory',
            description: 'Study and understand basic arcane theory',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Arcane theory knowledge']
        },
        {
            id: 'ancient_text',
            name: 'Ancient Text',
            description: 'Decipher an ancient magical text',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_07.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Ancient language reading']
        },
        {
            id: 'forbidden_knowledge',
            name: 'Forbidden Knowledge',
            description: 'Uncover forbidden arcane knowledge',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_17.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Forbidden lore']
        }
    ],

    // Ritual Magic Quests
    ritualMagic: [
        {
            id: 'first_ritual',
            name: 'First Ritual',
            description: 'Successfully perform your first magical ritual',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Basic ritual magic']
        },
        {
            id: 'complex_ritual',
            name: 'Complex Ritual',
            description: 'Perform a complex multi-step ritual',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowworddominate.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Complex rituals']
        },
        {
            id: 'grand_ritual',
            name: 'Grand Ritual',
            description: 'Lead a grand ritual with multiple participants',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_demonicempathy.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Grand ritual mastery']
        }
    ],

    // Defensive Techniques Quests
    defensiveTechniques: [
        {
            id: 'first_block',
            name: 'First Block',
            description: 'Successfully block an attack with a shield',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Basic blocking']
        },
        {
            id: 'parry_master',
            name: 'Parry Master',
            description: 'Parry multiple attacks in succession',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_parry.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Parrying techniques']
        },
        {
            id: 'shield_wall',
            name: 'Shield Wall',
            description: 'Protect allies by forming a defensive barrier',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_shieldwall.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Group defense']
        }
    ]
};