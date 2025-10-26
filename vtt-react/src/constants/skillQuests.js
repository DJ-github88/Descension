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
            unlocks: ['Basic weapon handling']
        },
        {
            id: 'combat_stance',
            name: 'Combat Stance',
            description: 'Learn and maintain proper fighting stance during combat',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Defensive positioning']
        },
        {
            id: 'precise_strike',
            name: 'Precise Strike',
            description: 'Land a critical hit with a weapon',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_criticalstrike.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Precision techniques']
        },
        {
            id: 'dual_wielding',
            name: 'Dual Wielding',
            description: 'Successfully fight with two weapons simultaneously',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_dualwield.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Dual weapon techniques']
        },
        {
            id: 'riposte_master',
            name: 'Riposte Master',
            description: 'Successfully counter-attack after parrying an enemy strike',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_revenge.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Counter-attack techniques']
        },
        {
            id: 'disarm_opponent',
            name: 'Disarm Opponent',
            description: 'Successfully disarm an armed opponent in combat',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_disarm.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Disarming maneuvers']
        },
        {
            id: 'cleave_attack',
            name: 'Cleave Attack',
            description: 'Strike multiple enemies with a single weapon swing',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_cleave.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Multi-target strikes']
        },
        {
            id: 'weapon_bond',
            name: 'Weapon Bond',
            description: 'Form a bond with your primary weapon through extended use',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Weapon bonding']
        },
        {
            id: 'armor_piercing',
            name: 'Armor Piercing',
            description: 'Learn to strike through gaps in heavy armor',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_sunder.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Armor penetration']
        },
        {
            id: 'weapon_master_duel',
            name: 'Weapon Master Duel',
            description: 'Defeat a skilled weapon master in single combat',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_dualwieldspecialization.jpg',
            rank: 'MASTER',
            completed: false,
            unlocks: ['Master-level techniques']
        }
    ],

    // Tactical Combat Quests
    tacticalCombat: [
        {
            id: 'battlefield_awareness',
            name: 'Battlefield Awareness',
            description: 'Successfully identify enemy positions and weaknesses in combat',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_sleep.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Basic tactical assessment']
        },
        {
            id: 'flanking_maneuver',
            name: 'Flanking Maneuver',
            description: 'Execute a successful flanking attack on an enemy',
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
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Group tactics']
        },
        {
            id: 'high_ground',
            name: 'High Ground Advantage',
            description: 'Use elevated terrain to gain tactical advantage in combat',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_mastermarksman.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Terrain tactics']
        },
        {
            id: 'ambush_setup',
            name: 'Ambush Setup',
            description: 'Successfully set up and execute an ambush',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_ambush.jpg',
            rank: 'JOURNEYMAN',
            completed: false,
            unlocks: ['Ambush techniques']
        },
        {
            id: 'retreat_tactics',
            name: 'Tactical Retreat',
            description: 'Execute a controlled retreat to regroup and counter-attack',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
            rank: 'JOURNEYMAN',
            completed: false,
            unlocks: ['Retreat maneuvers']
        },
        {
            id: 'focus_fire',
            name: 'Focus Fire',
            description: 'Coordinate allies to focus attacks on a single high-priority target',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_focusfire.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Target prioritization']
        },
        {
            id: 'defensive_formation',
            name: 'Defensive Formation',
            description: 'Organize allies into a defensive formation to withstand assault',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_shieldwall.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Formation tactics']
        },
        {
            id: 'pincer_movement',
            name: 'Pincer Movement',
            description: 'Execute a pincer attack to surround and overwhelm enemies',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Advanced maneuvers']
        },
        {
            id: 'tactical_mastery',
            name: 'Tactical Mastery',
            description: 'Win a battle through superior tactics despite being outnumbered',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/achievement_bg_winwsg_3-0.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Master tactics']
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
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Secret detection abilities']
        },
        {
            id: 'search_scene',
            name: 'Search the Scene',
            description: 'Thoroughly search a location for evidence',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_03.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Scene analysis']
        },
        {
            id: 'interrogate_witness',
            name: 'Interrogate Witness',
            description: 'Extract useful information from a witness or suspect',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Interrogation techniques']
        },
        {
            id: 'reconstruct_events',
            name: 'Reconstruct Events',
            description: 'Piece together what happened at a crime scene',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_mindmastery.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Event reconstruction']
        },
        {
            id: 'follow_trail',
            name: 'Follow the Trail',
            description: 'Track down a suspect or missing person',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_tracking.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Pursuit skills']
        },
        {
            id: 'break_alibi',
            name: 'Break an Alibi',
            description: 'Prove someone\'s alibi is false',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Alibi analysis']
        },
        {
            id: 'solve_mystery',
            name: 'Solve the Mystery',
            description: 'Solve a complex mystery from start to finish',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Master investigation']
        },
        {
            id: 'impossible_case',
            name: 'The Impossible Case',
            description: 'Solve a case that everyone else gave up on',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/achievement_bg_winwsg_3-0.jpg',
            rank: 'MASTER',
            completed: false,
            unlocks: ['Legendary deduction']
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
            id: 'bargain_deal',
            name: 'Bargain Deal',
            description: 'Negotiate a favorable deal or trade',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_01.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Negotiation skills']
        },
        {
            id: 'diplomatic_solution',
            name: 'Diplomatic Solution',
            description: 'Resolve a conflict through words instead of violence',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Conflict resolution skills']
        },
        {
            id: 'win_argument',
            name: 'Win Argument',
            description: 'Win a heated argument through logic and rhetoric',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Debate techniques']
        },
        {
            id: 'mass_appeal',
            name: 'Mass Appeal',
            description: 'Persuade a group of people simultaneously',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Group persuasion abilities']
        },
        {
            id: 'change_belief',
            name: 'Change Belief',
            description: 'Convince someone to change a deeply held belief',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_prayerofhealing.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Deep persuasion']
        },
        {
            id: 'hostile_negotiation',
            name: 'Hostile Negotiation',
            description: 'Successfully negotiate with a hostile party',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Crisis negotiation']
        },
        {
            id: 'inspire_action',
            name: 'Inspire Action',
            description: 'Inspire someone to take a difficult action',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_heroism.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Inspirational speaking']
        },
        {
            id: 'broker_peace',
            name: 'Broker Peace',
            description: 'Broker peace between warring factions',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_jewelry_talisman_12.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Peace negotiation']
        },
        {
            id: 'legendary_orator',
            name: 'Legendary Orator',
            description: 'Give a speech that changes the course of history',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
            rank: 'MASTER',
            completed: false,
            unlocks: ['Legendary persuasion']
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
            id: 'maintain_concentration',
            name: 'Maintain Concentration',
            description: 'Maintain concentration on a spell while taking damage',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_mindmastery.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Concentration techniques']
        },
        {
            id: 'spell_modification',
            name: 'Spell Modification',
            description: 'Modify a spell to achieve a different effect',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcaneorb.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Spell customization techniques']
        },
        {
            id: 'counter_spell',
            name: 'Counter Spell',
            description: 'Successfully counter another caster\'s spell',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_dispelmagic.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Counterspelling']
        },
        {
            id: 'ritual_casting',
            name: 'Ritual Casting',
            description: 'Successfully complete a ritual spell',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Ritual magic']
        },
        {
            id: 'metamagic',
            name: 'Metamagic',
            description: 'Apply metamagic to enhance a spell',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanepotency.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Metamagic techniques']
        },
        {
            id: 'spell_combination',
            name: 'Spell Combination',
            description: 'Successfully combine two spells for greater effect',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_blast.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Spell synergy']
        },
        {
            id: 'silent_casting',
            name: 'Silent Casting',
            description: 'Cast a spell without verbal components',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Silent spellcasting']
        },
        {
            id: 'magical_research',
            name: 'Magical Research',
            description: 'Discover or create a new spell',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Spell creation abilities']
        },
        {
            id: 'legendary_spell',
            name: 'Legendary Spell',
            description: 'Create a spell that will be remembered for generations',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcane04.jpg',
            rank: 'MASTER',
            completed: false,
            unlocks: ['Legendary spellcraft']
        }
    ],

    // Acrobatics Quests
    acrobatics: [
        {
            id: 'first_tumble',
            name: 'First Tumble',
            description: 'Successfully perform a basic tumble or roll to avoid damage from a fall',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Basic tumbling']
        },
        {
            id: 'balance_test',
            name: 'Balance Test',
            description: 'Walk across a narrow beam or ledge without falling',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_feint.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Improved balance']
        },
        {
            id: 'combat_dodge',
            name: 'Combat Dodge',
            description: 'Use acrobatic movement to dodge an attack in combat',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_wrongfullyaccused.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Evasive maneuvers']
        },
        {
            id: 'environmental_swing',
            name: 'Environmental Swing',
            description: 'Swing from a rope, chandelier, or vine to cross a gap or escape danger',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_rope_01.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Environmental navigation']
        },
        {
            id: 'wall_climb_acrobatic',
            name: 'Acrobatic Climb',
            description: 'Use momentum and agility to run up a wall or flip off a surface',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_shadowstep.jpg',
            rank: 'JOURNEYMAN',
            completed: false,
            unlocks: ['Wall running']
        },
        {
            id: 'precision_landing',
            name: 'Precision Landing',
            description: 'Land in a specific small area after jumping or falling from height',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_safefall.jpg',
            rank: 'JOURNEYMAN',
            completed: false,
            unlocks: ['Controlled falling']
        },
        {
            id: 'trap_navigation',
            name: 'Trap Navigation',
            description: 'Navigate through a trapped corridor using acrobatic movements',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_bladedance.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Trap evasion']
        },
        {
            id: 'contortionist',
            name: 'Contortionist',
            description: 'Squeeze through a tight space that seems impossible to fit through',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_quickrecovery.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Extreme flexibility']
        },
        {
            id: 'aerial_maneuver',
            name: 'Aerial Maneuver',
            description: 'Perform a complex mid-air maneuver while falling or jumping',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_druid_catform.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Aerial control']
        },
        {
            id: 'impossible_balance',
            name: 'Impossible Balance',
            description: 'Balance on a surface that should be impossible (water, rope, blade edge)',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_monk_standinglegkick.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Supernatural balance']
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
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Animal companionship']
        },
        {
            id: 'animal_communication',
            name: 'Animal Communication',
            description: 'Understand what an animal is trying to communicate',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Animal empathy']
        },
        {
            id: 'train_trick',
            name: 'Train a Trick',
            description: 'Teach an animal a new trick or command',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beasttraining.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Animal training']
        },
        {
            id: 'tame_wild',
            name: 'Tame the Wild',
            description: 'Tame a dangerous wild animal',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beasttaming.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Wild taming']
        },
        {
            id: 'combat_companion',
            name: 'Combat Companion',
            description: 'Train an animal to fight alongside you in combat',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_pet_wolf.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Combat training']
        },
        {
            id: 'exotic_creature',
            name: 'Exotic Creature',
            description: 'Successfully handle an exotic or magical creature',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_pet_dragonhawk.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Exotic handling']
        },
        {
            id: 'beast_master',
            name: 'Beast Master',
            description: 'Command multiple animals simultaneously',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_animalhandler.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Multi-animal control']
        },
        {
            id: 'legendary_bond',
            name: 'Legendary Bond',
            description: 'Form a legendary bond with a mythical creature',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_pet_chimera.jpg',
            rank: 'MASTER',
            completed: false,
            unlocks: ['Mythical bonding']
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
            id: 'detect_magic',
            name: 'Detect Magic',
            description: 'Sense the presence of magic in your surroundings',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_detectlesserinvisibility.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Magic detection']
        },
        {
            id: 'analyze_spell',
            name: 'Analyze Spell',
            description: 'Determine the nature and effects of an ongoing spell',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_mindmastery.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Spell analysis']
        },
        {
            id: 'dispel_magic',
            name: 'Dispel Magic',
            description: 'Successfully dispel or counter a magical effect',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_dispelmagic.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Magical dispelling']
        },
        {
            id: 'magical_theory',
            name: 'Magical Theory',
            description: 'Understand the theoretical principles behind a spell',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Arcane theory']
        },
        {
            id: 'planar_knowledge',
            name: 'Planar Knowledge',
            description: 'Identify creatures or effects from other planes',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_portaldalaran.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Planar lore']
        },
        {
            id: 'magical_trap',
            name: 'Magical Trap',
            description: 'Detect and disarm a magical trap',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_selfdestruct.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Trap detection']
        },
        {
            id: 'artifact_lore',
            name: 'Artifact Lore',
            description: 'Identify and understand a powerful magical artifact',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_staff_13.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Artifact knowledge']
        },
        {
            id: 'arcane_mastery',
            name: 'Arcane Mastery',
            description: 'Demonstrate complete understanding of arcane principles',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcane04.jpg',
            rank: 'MASTER',
            completed: false,
            unlocks: ['Arcane mastery']
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
            id: 'identify_artifact',
            name: 'Identify Artifact',
            description: 'Identify the historical significance of an artifact',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_rune_01.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Artifact identification']
        },
        {
            id: 'cultural_knowledge',
            name: 'Cultural Knowledge',
            description: 'Recall important cultural or religious practices',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_jewelry_talisman_12.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Cultural understanding']
        },
        {
            id: 'legendary_knowledge',
            name: 'Legendary Knowledge',
            description: 'Uncover a lost piece of legendary history',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Legendary lore']
        },
        {
            id: 'historical_pattern',
            name: 'Historical Pattern',
            description: 'Recognize a pattern from historical events',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_mindmastery.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Pattern recognition']
        },
        {
            id: 'lost_civilization',
            name: 'Lost Civilization',
            description: 'Discover information about a lost civilization',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_map_01.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Ancient civilizations']
        },
        {
            id: 'prophecy_interpretation',
            name: 'Prophecy Interpretation',
            description: 'Correctly interpret an ancient prophecy',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_scroll_05.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Prophecy reading']
        },
        {
            id: 'rewrite_history',
            name: 'Rewrite History',
            description: 'Discover evidence that changes accepted history',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_17.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Historical revision']
        },
        {
            id: 'living_legend',
            name: 'Living Legend',
            description: 'Become a historical figure yourself',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/achievement_bg_winwsg_3-0.jpg',
            rank: 'MASTER',
            completed: false,
            unlocks: ['Legendary status']
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
            id: 'sense_emotion',
            name: 'Sense Emotion',
            description: 'Accurately sense someone\'s emotional state',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_prayerofhealing.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Emotional awareness']
        },
        {
            id: 'read_body_language',
            name: 'Read Body Language',
            description: 'Interpret subtle body language cues',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_sleep.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Body language reading']
        },
        {
            id: 'empathic_bond',
            name: 'Empathic Bond',
            description: 'Form an empathic connection with another person',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_prayerofhealing02.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Empathy mastery']
        },
        {
            id: 'predict_behavior',
            name: 'Predict Behavior',
            description: 'Predict how someone will react in a situation',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_mindmastery.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Behavioral prediction']
        },
        {
            id: 'sense_danger',
            name: 'Sense Danger',
            description: 'Sense when someone means you harm',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_sentinal.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Danger sense']
        },
        {
            id: 'deep_understanding',
            name: 'Deep Understanding',
            description: 'Understand someone\'s deepest motivations',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_soulleech_3.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Deep empathy']
        },
        {
            id: 'crowd_reading',
            name: 'Crowd Reading',
            description: 'Read the mood and intentions of a crowd',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Mass insight']
        },
        {
            id: 'perfect_empathy',
            name: 'Perfect Empathy',
            description: 'Achieve perfect understanding of another\'s perspective',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_divineprovidence.jpg',
            rank: 'MASTER',
            completed: false,
            unlocks: ['Perfect insight']
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
            id: 'verbal_threat',
            name: 'Verbal Threat',
            description: 'Intimidate through words alone',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_deathscream.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Verbal intimidation']
        },
        {
            id: 'display_power',
            name: 'Display of Power',
            description: 'Demonstrate your power to intimidate others',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_shieldbreak.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Power display']
        },
        {
            id: 'fearsome_reputation',
            name: 'Fearsome Reputation',
            description: 'Build a reputation that precedes you',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_possession.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Reputation intimidation']
        },
        {
            id: 'break_will',
            name: 'Break Will',
            description: 'Break someone\'s will through intimidation',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_mindshear.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Will breaking']
        },
        {
            id: 'mass_intimidation',
            name: 'Mass Intimidation',
            description: 'Intimidate a large group simultaneously',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_battleshout.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Mass fear']
        },
        {
            id: 'psychological_warfare',
            name: 'Psychological Warfare',
            description: 'Use psychological tactics to demoralize enemies',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_psychicscream.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Psychological tactics']
        },
        {
            id: 'terrifying_presence',
            name: 'Terrifying Presence',
            description: 'Your mere presence causes fear',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_auraofdarkness.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Aura of fear']
        },
        {
            id: 'legendary_terror',
            name: 'Legendary Terror',
            description: 'Become a legend of terror',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_demonicempathy.jpg',
            rank: 'MASTER',
            completed: false,
            unlocks: ['Legendary intimidation']
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
            id: 'treat_poison',
            name: 'Treat Poison',
            description: 'Successfully treat a poisoned creature',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_nullifypoison.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Poison treatment']
        },
        {
            id: 'set_bone',
            name: 'Set Bone',
            description: 'Set a broken bone properly',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bone_humanskull_01.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Bone setting']
        },
        {
            id: 'diagnose_illness',
            name: 'Diagnose Illness',
            description: 'Correctly diagnose a disease or poison',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_restoration.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Diagnostic skills']
        },
        {
            id: 'surgery',
            name: 'Surgery',
            description: 'Perform a successful surgery',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_knife_1h_common_b_01.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Surgical techniques']
        },
        {
            id: 'cure_disease',
            name: 'Cure Disease',
            description: 'Successfully cure a disease',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_nullifydisease.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Disease treatment']
        },
        {
            id: 'battlefield_medicine',
            name: 'Battlefield Medicine',
            description: 'Treat multiple wounded in combat conditions',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_prayerofhealing.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Combat medicine']
        },
        {
            id: 'rare_affliction',
            name: 'Rare Affliction',
            description: 'Treat a rare or magical affliction',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_greaterheal.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Advanced treatment']
        },
        {
            id: 'miracle_cure',
            name: 'Miracle Cure',
            description: 'Save someone from certain death',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_resurrection.jpg',
            rank: 'MASTER',
            completed: false,
            unlocks: ['Miraculous healing']
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
            id: 'animal_behavior',
            name: 'Animal Behavior',
            description: 'Predict animal behavior based on natural signs',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_pet_wolf.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Animal understanding']
        },
        {
            id: 'terrain_knowledge',
            name: 'Terrain Knowledge',
            description: 'Identify terrain features and their properties',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_map_01.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Terrain mastery']
        },
        {
            id: 'natural_remedy',
            name: 'Natural Remedy',
            description: 'Create a remedy from natural materials',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_herb_felblossom.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Natural healing']
        },
        {
            id: 'seasonal_patterns',
            name: 'Seasonal Patterns',
            description: 'Understand and predict seasonal changes',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchwither.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Seasonal knowledge']
        },
        {
            id: 'natural_hazards',
            name: 'Natural Hazards',
            description: 'Identify and avoid natural hazards',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_volcano.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Hazard detection']
        },
        {
            id: 'ecosystem_understanding',
            name: 'Ecosystem Understanding',
            description: 'Understand complex ecosystem relationships',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_natureguardian.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Ecological mastery']
        },
        {
            id: 'rare_specimen',
            name: 'Rare Specimen',
            description: 'Identify a rare or unique natural specimen',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_herb_dreamfoil.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Rare identification']
        },
        {
            id: 'nature_mastery',
            name: 'Nature Mastery',
            description: 'Achieve complete understanding of natural world',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_wispsplode.jpg',
            rank: 'MASTER',
            completed: false,
            unlocks: ['Natural mastery']
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
            id: 'notice_detail',
            name: 'Notice Detail',
            description: 'Notice a small but important detail',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Detail awareness']
        },
        {
            id: 'track_movement',
            name: 'Track Movement',
            description: 'Notice and track subtle movement',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_tracking.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Movement tracking']
        },
        {
            id: 'danger_sense',
            name: 'Danger Sense',
            description: 'Sense danger before it strikes',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_sentinal.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Danger awareness']
        },
        {
            id: 'read_environment',
            name: 'Read Environment',
            description: 'Understand your environment at a glance',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Environmental awareness']
        },
        {
            id: 'detect_invisible',
            name: 'Detect Invisible',
            description: 'Notice something invisible or hidden by magic',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_detectlesserinvisibility.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Magical detection']
        },
        {
            id: 'perfect_awareness',
            name: 'Perfect Awareness',
            description: 'Achieve perfect awareness of your surroundings',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindsooth.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Complete awareness']
        },
        {
            id: 'see_through_illusion',
            name: 'See Through Illusion',
            description: 'See through a powerful illusion',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_detectinvisibility.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Illusion piercing']
        },
        {
            id: 'omniscient_perception',
            name: 'Omniscient Perception',
            description: 'Nothing escapes your notice',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_divineprovidence.jpg',
            rank: 'MASTER',
            completed: false,
            unlocks: ['Perfect perception']
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
            id: 'improvise',
            name: 'Improvise',
            description: 'Successfully improvise when a performance goes wrong',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_02.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Improvisation']
        },
        {
            id: 'move_audience',
            name: 'Move Audience',
            description: 'Move an audience to tears or laughter',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_horn_01.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Emotional performance']
        },
        {
            id: 'hostile_crowd',
            name: 'Hostile Crowd',
            description: 'Win over a hostile or skeptical audience',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bell_01.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Crowd conversion']
        },
        {
            id: 'masterwork_performance',
            name: 'Masterwork Performance',
            description: 'Give a technically perfect performance',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_03.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Technical mastery']
        },
        {
            id: 'inspire_action',
            name: 'Inspire Action',
            description: 'Inspire your audience to take action',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_heroism.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Inspirational performance']
        },
        {
            id: 'cultural_performance',
            name: 'Cultural Performance',
            description: 'Master a performance from another culture',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_04.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Cultural artistry']
        },
        {
            id: 'legendary_performance',
            name: 'Legendary Performance',
            description: 'Give a performance people will remember forever',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_horn_02.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Legendary artistry']
        },
        {
            id: 'immortal_art',
            name: 'Immortal Art',
            description: 'Create a performance that becomes timeless',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/achievement_bg_winwsg_3-0.jpg',
            rank: 'MASTER',
            completed: false,
            unlocks: ['Timeless performance']
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
            id: 'religious_text',
            name: 'Religious Text',
            description: 'Interpret a religious text or scripture',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Scripture knowledge']
        },
        {
            id: 'identify_undead',
            name: 'Identify Undead',
            description: 'Identify the nature of undead creatures',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_raisedead.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Undead lore']
        },
        {
            id: 'perform_ritual',
            name: 'Perform Ritual',
            description: 'Successfully perform a religious ritual',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_prayerofhealing02.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Ritual knowledge']
        },
        {
            id: 'consecrate_ground',
            name: 'Consecrate Ground',
            description: 'Consecrate or desecrate a location',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_innerfire.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Consecration']
        },
        {
            id: 'divine_intervention',
            name: 'Divine Intervention',
            description: 'Witness or invoke divine intervention',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_divineprovidence.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Divine connection']
        },
        {
            id: 'planar_beings',
            name: 'Planar Beings',
            description: 'Identify and understand celestial or fiendish beings',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_holysmite.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Planar knowledge']
        },
        {
            id: 'religious_debate',
            name: 'Religious Debate',
            description: 'Win a theological debate',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Theological mastery']
        },
        {
            id: 'divine_revelation',
            name: 'Divine Revelation',
            description: 'Receive or interpret a divine revelation',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_prayerofhealing.jpg',
            rank: 'MASTER',
            completed: false,
            unlocks: ['Divine wisdom']
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
            id: 'palm_object',
            name: 'Palm Object',
            description: 'Palm a small object without anyone noticing',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_gem_pearl_03.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Object palming']
        },
        {
            id: 'plant_evidence',
            name: 'Plant Evidence',
            description: 'Plant an object on someone without them noticing',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_07.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Evidence planting']
        },
        {
            id: 'disable_device',
            name: 'Disable Device',
            description: 'Disable a lock or trap mechanism',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_key_03.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Lock picking']
        },
        {
            id: 'master_thief',
            name: 'Master Thief',
            description: 'Steal something valuable from a well-guarded target',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_cenarionherbbag.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Advanced thievery']
        },
        {
            id: 'card_manipulation',
            name: 'Card Manipulation',
            description: 'Manipulate cards or dice to your advantage',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_dice_01.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Gaming manipulation']
        },
        {
            id: 'escape_bonds',
            name: 'Escape Bonds',
            description: 'Escape from ropes or shackles',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_rope_01.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Escape artistry']
        },
        {
            id: 'impossible_theft',
            name: 'Impossible Theft',
            description: 'Steal something that seems impossible to steal',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_enchantedmageweave.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Legendary thievery']
        },
        {
            id: 'perfect_sleight',
            name: 'Perfect Sleight',
            description: 'Perform sleight of hand that defies explanation',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_satchelofcenarius.jpg',
            rank: 'MASTER',
            completed: false,
            unlocks: ['Perfect dexterity']
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
            id: 'silent_movement',
            name: 'Silent Movement',
            description: 'Move without making any sound',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_deadlybrew.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Silent steps']
        },
        {
            id: 'blend_in',
            name: 'Blend In',
            description: 'Blend into a crowd or environment',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Environmental blending']
        },
        {
            id: 'invisible_movement',
            name: 'Invisible Movement',
            description: 'Move through a crowded area without being noticed',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_vanish.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Silent movement']
        },
        {
            id: 'ambush_position',
            name: 'Ambush Position',
            description: 'Set up a perfect ambush position',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_ambush.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Ambush tactics']
        },
        {
            id: 'shadow_walk',
            name: 'Shadow Walk',
            description: 'Move through shadows undetected',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_shadowstep.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Shadow mastery']
        },
        {
            id: 'infiltration',
            name: 'Infiltration',
            description: 'Infiltrate a heavily guarded location',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_nightblade.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Infiltration techniques']
        },
        {
            id: 'perfect_stealth',
            name: 'Perfect Stealth',
            description: 'Remain undetected in plain sight',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_smoke.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Master stealth']
        },
        {
            id: 'living_shadow',
            name: 'Living Shadow',
            description: 'Become one with the shadows',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_shadowdance.jpg',
            rank: 'MASTER',
            completed: false,
            unlocks: ['Shadow embodiment']
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
            id: 'purify_water',
            name: 'Purify Water',
            description: 'Purify water to make it safe to drink',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_drink_07.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Water purification']
        },
        {
            id: 'build_fire',
            name: 'Build Fire',
            description: 'Build a fire in difficult conditions',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_fire_fire.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Fire building']
        },
        {
            id: 'construct_shelter',
            name: 'Construct Shelter',
            description: 'Build a shelter that protects from the elements',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_tent_01.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Shelter construction']
        },
        {
            id: 'avoid_hazards',
            name: 'Avoid Hazards',
            description: 'Identify and avoid natural hazards',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_thorns.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Hazard avoidance']
        },
        {
            id: 'extreme_survival',
            name: 'Extreme Survival',
            description: 'Survive in extreme conditions (desert, arctic, etc.)',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_frostarmor.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Extreme environment survival']
        },
        {
            id: 'live_off_land',
            name: 'Live Off the Land',
            description: 'Live comfortably off the land for an extended period',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_natureguardian.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Self-sufficiency']
        },
        {
            id: 'wilderness_master',
            name: 'Wilderness Master',
            description: 'Survive alone in the wilderness for a month',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_wispsplode.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Wilderness mastery']
        },
        {
            id: 'one_with_nature',
            name: 'One With Nature',
            description: 'Thrive in any natural environment',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
            rank: 'MASTER',
            completed: false,
            unlocks: ['Perfect survival']
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
            id: 'fabricate_evidence',
            name: 'Fabricate Evidence',
            description: 'Create false evidence that appears genuine',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_note_01.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Evidence fabrication']
        },
        {
            id: 'double_bluff',
            name: 'Double Bluff',
            description: 'Successfully execute a double bluff',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_dice_01.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Advanced deception']
        },
        {
            id: 'master_manipulator',
            name: 'Master Manipulator',
            description: 'Manipulate someone into doing something against their interests',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_charm.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Manipulation techniques']
        },
        {
            id: 'false_identity',
            name: 'False Identity',
            description: 'Create and maintain a completely false identity',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Identity creation']
        },
        {
            id: 'con_artist',
            name: 'Con Artist',
            description: 'Successfully pull off a complex con',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_01.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Con artistry']
        },
        {
            id: 'web_of_lies',
            name: 'Web of Lies',
            description: 'Maintain multiple interconnected lies',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_web.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Complex deception']
        },
        {
            id: 'deceive_expert',
            name: 'Deceive Expert',
            description: 'Deceive someone who is an expert at detecting lies',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_mindsteal.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Master deception']
        },
        {
            id: 'perfect_lie',
            name: 'Perfect Lie',
            description: 'Tell a lie that becomes accepted as truth',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_charm.jpg',
            rank: 'MASTER',
            completed: false,
            unlocks: ['Perfect deception']
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
            id: 'delegate_tasks',
            name: 'Delegate Tasks',
            description: 'Effectively delegate tasks to maximize efficiency',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_note_01.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Delegation']
        },
        {
            id: 'resolve_conflict',
            name: 'Resolve Conflict',
            description: 'Resolve a conflict between team members',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Conflict resolution']
        },
        {
            id: 'inspire_greatness',
            name: 'Inspire Greatness',
            description: 'Inspire others to achieve something they thought impossible',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_heroism.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Inspirational leadership']
        },
        {
            id: 'strategic_planning',
            name: 'Strategic Planning',
            description: 'Create and execute a successful long-term strategy',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_map_01.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Strategic thinking']
        },
        {
            id: 'lead_under_pressure',
            name: 'Lead Under Pressure',
            description: 'Maintain leadership during a crisis',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_rallyingcry.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Crisis leadership']
        },
        {
            id: 'build_loyalty',
            name: 'Build Loyalty',
            description: 'Build unwavering loyalty in your followers',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_prayerofhealing.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Loyalty building']
        },
        {
            id: 'legendary_leader',
            name: 'Legendary Leader',
            description: 'Lead a group to achieve something legendary',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/achievement_bg_winwsg_3-0.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Legendary leadership']
        },
        {
            id: 'change_the_world',
            name: 'Change the World',
            description: 'Lead a movement that changes the world',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_divineprovidence.jpg',
            rank: 'MASTER',
            completed: false,
            unlocks: ['World-changing leadership']
        }
    ],

    // Athletics Quests
    athletics: [
        {
            id: 'first_climb',
            name: 'First Climb',
            description: 'Successfully climb a difficult surface (wall, cliff, tree)',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Basic climbing']
        },
        {
            id: 'long_jump',
            name: 'Long Jump',
            description: 'Jump across a gap or obstacle using a running start',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_heroicleap.jpg',
            rank: 'NOVICE',
            completed: false,
            unlocks: ['Jumping techniques']
        },
        {
            id: 'swimming_basics',
            name: 'Swimming Basics',
            description: 'Swim across a river or through rough waters',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_frost_summonwaterelemental.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Swimming proficiency']
        },
        {
            id: 'endurance_run',
            name: 'Endurance Run',
            description: 'Run or march for an extended period without rest',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Improved stamina']
        },
        {
            id: 'power_throw',
            name: 'Power Throw',
            description: 'Throw an object (rock, spear, grappling hook) a great distance',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_throw.jpg',
            rank: 'JOURNEYMAN',
            completed: false,
            unlocks: ['Throwing strength']
        },
        {
            id: 'vertical_climb',
            name: 'Vertical Climb',
            description: 'Climb a sheer surface with minimal handholds',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_shadowstep.jpg',
            rank: 'JOURNEYMAN',
            completed: false,
            unlocks: ['Advanced climbing']
        },
        {
            id: 'high_jump',
            name: 'High Jump',
            description: 'Jump to reach a high ledge or grab onto something overhead',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_heroicleap.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Vertical leap']
        },
        {
            id: 'underwater_endurance',
            name: 'Underwater Endurance',
            description: 'Hold your breath underwater for an extended period',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_demonbreath.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Breath control']
        },
        {
            id: 'sprint_speed',
            name: 'Sprint Speed',
            description: 'Sprint at maximum speed to catch up to or escape from something',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Enhanced speed']
        },
        {
            id: 'impossible_climb',
            name: 'Impossible Climb',
            description: 'Climb a surface that seems impossible (ice, smooth stone, overhang)',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/achievement_zone_stormpeaks_01.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Supernatural climbing']
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
            id: 'identify_substance',
            name: 'Identify Substance',
            description: 'Identify an unknown alchemical substance',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_alchemy_elixir_01.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Substance identification']
        },
        {
            id: 'create_antidote',
            name: 'Create Antidote',
            description: 'Create an antidote for a poison',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_alchemy_elixir_02.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Antidote creation']
        },
        {
            id: 'transmutation',
            name: 'Transmutation',
            description: 'Successfully transmute one material into another',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_alchemy_elixir_05.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Transmutation skills']
        },
        {
            id: 'powerful_elixir',
            name: 'Powerful Elixir',
            description: 'Brew a powerful elixir with lasting effects',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_alchemy_elixir_03.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Elixir mastery']
        },
        {
            id: 'explosive_compound',
            name: 'Explosive Compound',
            description: 'Create a stable explosive compound',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_alchemy_elixir_06.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Explosive alchemy']
        },
        {
            id: 'philosophers_stone',
            name: 'Philosopher\'s Stone',
            description: 'Create a philosopher\'s stone or similar legendary item',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_gem_bloodstone_01.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Legendary alchemy']
        },
        {
            id: 'universal_solvent',
            name: 'Universal Solvent',
            description: 'Create a universal solvent',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_alchemy_elixir_empty.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Advanced transmutation']
        },
        {
            id: 'elixir_of_life',
            name: 'Elixir of Life',
            description: 'Create an elixir that extends life',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_alchemy_elixir_04.jpg',
            rank: 'MASTER',
            completed: false,
            unlocks: ['Immortal alchemy']
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
            id: 'magical_school',
            name: 'Magical School',
            description: 'Master the theory of a school of magic',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcane04.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['School mastery']
        },
        {
            id: 'ley_lines',
            name: 'Ley Lines',
            description: 'Understand and map ley lines',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanepotency.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Ley line knowledge']
        },
        {
            id: 'forbidden_knowledge',
            name: 'Forbidden Knowledge',
            description: 'Uncover forbidden arcane knowledge',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_17.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Forbidden lore']
        },
        {
            id: 'planar_theory',
            name: 'Planar Theory',
            description: 'Understand the theory of planar travel',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_portaldalaran.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Planar knowledge']
        },
        {
            id: 'magical_convergence',
            name: 'Magical Convergence',
            description: 'Understand how different magical systems interact',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_blast.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Convergence theory']
        },
        {
            id: 'lost_magic',
            name: 'Lost Magic',
            description: 'Rediscover a lost form of magic',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Lost magic knowledge']
        },
        {
            id: 'arcane_thesis',
            name: 'Arcane Thesis',
            description: 'Write a groundbreaking arcane thesis',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_scroll_05.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Arcane scholarship']
        },
        {
            id: 'arcane_mastery',
            name: 'Arcane Mastery',
            description: 'Achieve complete understanding of arcane principles',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcane03.jpg',
            rank: 'MASTER',
            completed: false,
            unlocks: ['Complete arcane mastery']
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
            id: 'ritual_circle',
            name: 'Ritual Circle',
            description: 'Create a proper ritual circle',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_sealofkings.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Circle creation']
        },
        {
            id: 'timed_ritual',
            name: 'Timed Ritual',
            description: 'Perform a ritual at a specific astrological time',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_mindmastery.jpg',
            rank: 'TRAINED',
            completed: false,
            unlocks: ['Astrological timing']
        },
        {
            id: 'grand_ritual',
            name: 'Grand Ritual',
            description: 'Lead a grand ritual with multiple participants',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_demonicempathy.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Grand ritual mastery']
        },
        {
            id: 'binding_ritual',
            name: 'Binding Ritual',
            description: 'Perform a ritual to bind a creature or spirit',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_possession.jpg',
            rank: 'APPRENTICE',
            completed: false,
            unlocks: ['Binding magic']
        },
        {
            id: 'summoning_ritual',
            name: 'Summoning Ritual',
            description: 'Summon a powerful entity through ritual',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_summonvoidwalker.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Summoning rituals']
        },
        {
            id: 'planar_ritual',
            name: 'Planar Ritual',
            description: 'Perform a ritual that affects other planes',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_portaldalaran.jpg',
            rank: 'ADEPT',
            completed: false,
            unlocks: ['Planar rituals']
        },
        {
            id: 'ancient_ritual',
            name: 'Ancient Ritual',
            description: 'Perform an ancient ritual lost to time',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
            rank: 'EXPERT',
            completed: false,
            unlocks: ['Ancient ritual knowledge']
        },
        {
            id: 'world_changing_ritual',
            name: 'World-Changing Ritual',
            description: 'Perform a ritual that changes the world',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_demonicempathy.jpg',
            rank: 'MASTER',
            completed: false,
            unlocks: ['Legendary ritual magic']
        }
    ],

    // Defensive Techniques Quests
    defensiveTechniques: [
        {
            id: 'first_block',
            name: 'First Block',
            description: 'Successfully block an attack using the Defend Action',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
            rank: 'NOVICE',
            completed: false
        },
        {
            id: 'armor_awareness',
            name: 'Armor Awareness',
            description: 'Use armor positioning to reduce damage from a heavy strike',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_shield_06.jpg',
            rank: 'NOVICE',
            completed: false
        },
        {
            id: 'stance_discipline',
            name: 'Stance Discipline',
            description: 'Maintain proper defensive stance throughout an entire combat encounter',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_stalwartprotector.jpg',
            rank: 'APPRENTICE',
            completed: false
        },
        {
            id: 'pressure_defense',
            name: 'Pressure Defense',
            description: 'Successfully defend against three consecutive attacks without breaking form',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_shieldwall.jpg',
            rank: 'APPRENTICE',
            completed: false
        },
        {
            id: 'redirect_momentum',
            name: 'Redirect Momentum',
            description: 'Deflect an attack in a way that creates an opening for a counter',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_revenge.jpg',
            rank: 'JOURNEYMAN',
            completed: false
        },
        {
            id: 'armor_mastery',
            name: 'Armor Mastery',
            description: 'Maximize armor effectiveness to negate a devastating blow',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_chest_plate16.jpg',
            rank: 'JOURNEYMAN',
            completed: false
        },
        {
            id: 'unbreakable_guard',
            name: 'Unbreakable Guard',
            description: 'Withstand overwhelming force without losing defensive position',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_shieldguard.jpg',
            rank: 'ADEPT',
            completed: false
        },
        {
            id: 'anticipate_strike',
            name: 'Anticipate Strike',
            description: 'Read an opponent and prepare defense before the attack lands',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_parry.jpg',
            rank: 'ADEPT',
            completed: false
        },
        {
            id: 'perfect_timing',
            name: 'Perfect Timing',
            description: 'Execute a flawless defensive maneuver at the critical moment',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_shieldbash.jpg',
            rank: 'EXPERT',
            completed: false
        },
        {
            id: 'fortress_stance',
            name: 'Fortress Stance',
            description: 'Become an immovable object, absorbing punishment that would fell others',
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_unrelentingassault.jpg',
            rank: 'EXPERT',
            completed: false
        }
    ]
};