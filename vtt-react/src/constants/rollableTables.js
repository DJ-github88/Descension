// Rollable Tables for Skills - Unlocked through quest completion
// Each table provides different outcomes based on skill usage

export const ROLLABLE_TABLES = {
    // Weapon Mastery Tables - Evolving by rank
    weaponCombatBasic: {
        name: 'Basic Weapon Handling',
        description: 'Untrained weapon use - mostly fumbles and basic swings',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Weapon fumble, drop weapon or hit self', type: 'failure' },
            { roll: [9, 14], result: 'Clumsy swing, normal damage -2', type: 'failure' },
            { roll: [15, 18], result: 'Lucky hit, normal damage', type: 'normal' },
            { roll: [19, 20], result: 'Surprising strike, +1 damage', type: 'success' }
        ]
    },
    weaponCombatOutcomes: {
        name: 'Weapon Combat Outcomes',
        description: 'Basic trained weapon techniques',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Weapon slips, -1 to next attack', type: 'failure' },
            { roll: [4, 10], result: 'Normal attack, no special effect', type: 'normal' },
            { roll: [11, 15], result: 'Solid hit, +2 damage', type: 'success' },
            { roll: [16, 18], result: 'Precise strike, +4 damage', type: 'success' },
            { roll: [19, 20], result: 'Critical hit, double damage + bleeding', type: 'critical' }
        ]
    },
    weaponCombatAdvanced: {
        name: 'Advanced Weapon Techniques',
        description: 'Apprentice-level combat maneuvers and combinations',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 2], result: 'Minor misstep, -1 damage', type: 'failure' },
            { roll: [3, 8], result: 'Standard technique, normal damage', type: 'normal' },
            { roll: [9, 13], result: 'Combo attack, +3 damage', type: 'success' },
            { roll: [14, 17], result: 'Disarming strike, +4 damage + disarm chance', type: 'success' },
            { roll: [18, 19], result: 'Perfect form, double damage + stun', type: 'critical' },
            { roll: [20, 20], result: 'Legendary technique, triple damage + fear', type: 'critical' }
        ]
    },
    weaponCombatExpert: {
        name: 'Expert Weapon Mastery',
        description: 'Journeyman-level precision and battlefield awareness',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'JOURNEYMAN',
        table: [
            { roll: [1, 1], result: 'Momentary lapse, normal damage', type: 'normal' },
            { roll: [2, 6], result: 'Skilled strike, +2 damage', type: 'success' },
            { roll: [7, 11], result: 'Tactical blow, +4 damage + positioning bonus', type: 'success' },
            { roll: [12, 15], result: 'Masterful technique, +6 damage + debuff enemy', type: 'success' },
            { roll: [16, 18], result: 'Devastating assault, double damage + knockdown', type: 'critical' },
            { roll: [19, 20], result: 'Legendary strike, triple damage + area effect', type: 'critical' }
        ]
    },
    weaponCombatMaster: {
        name: 'Master Combat Arts',
        description: 'Adept-level supernatural weapon techniques',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 3], result: 'Flawless form, +4 damage', type: 'success' },
            { roll: [4, 8], result: 'Supernatural precision, +6 damage + ignore armor', type: 'success' },
            { roll: [9, 13], result: 'Reality-cutting strike, +8 damage + dimensional rift', type: 'success' },
            { roll: [14, 17], result: 'Time-split attack, double damage + extra action', type: 'critical' },
            { roll: [18, 19], result: 'Soul-severing blow, triple damage + permanent debuff', type: 'critical' },
            { roll: [20, 20], result: 'Concept-destroying strike, quadruple damage + erase from existence', type: 'critical' }
        ]
    },
    weaponCombatGrandmaster: {
        name: 'Grandmaster Weapon Arts',
        description: 'Expert-level reality-bending combat techniques',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 2], result: 'Transcendent technique, +8 damage + heal self', type: 'success' },
            { roll: [3, 6], result: 'Planar strike, +10 damage + banish to other realm', type: 'success' },
            { roll: [7, 10], result: 'Quantum slash, +12 damage + hit all possible targets', type: 'success' },
            { roll: [11, 14], result: 'Temporal severance, triple damage + rewind enemy actions', type: 'critical' },
            { roll: [15, 17], result: 'Causal loop strike, quadruple damage + enemy never existed', type: 'critical' },
            { roll: [18, 19], result: 'Omniversal cut, quintuple damage + damage all versions', type: 'critical' },
            { roll: [20, 20], result: 'The Final Strike, infinite damage + end combat permanently', type: 'critical' }
        ]
    },
    weaponCombatLegendary: {
        name: 'Legendary Weapon Mastery',
        description: 'Master-level cosmic weapon techniques',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Cosmic resonance, +15 damage + create new star', type: 'success' },
            { roll: [2, 4], result: 'Galactic cleave, +20 damage + split galaxies', type: 'success' },
            { roll: [5, 8], result: 'Universal severance, +25 damage + cut through dimensions', type: 'success' },
            { roll: [9, 12], result: 'Multiversal strike, sextuple damage + hit all realities', type: 'critical' },
            { roll: [13, 16], result: 'Conceptual annihilation, septuple damage + erase concept of enemy', type: 'critical' },
            { roll: [17, 19], result: 'Absolute destruction, octuple damage + unmake from all timelines', type: 'critical' },
            { roll: [20, 20], result: 'The Omega Strike, ∞ damage + become one with the weapon', type: 'critical' }
        ]
    },
    weaponCombatMythic: {
        name: 'Mythic Weapon Transcendence',
        description: 'Grandmaster-level beyond-reality techniques',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'GRANDMASTER',
        table: [
            { roll: [1, 2], result: 'Transcendent form, +30 damage + become living weapon', type: 'success' },
            { roll: [3, 5], result: 'Reality forge, +35 damage + create new laws of physics', type: 'success' },
            { roll: [6, 9], result: 'Existence blade, +40 damage + cut through the void itself', type: 'success' },
            { roll: [10, 13], result: 'Primordial strike, nonuple damage + return to before creation', type: 'critical' },
            { roll: [14, 17], result: 'Genesis cut, decuple damage + birth new universes', type: 'critical' },
            { roll: [18, 19], result: 'The First Weapon, undecuple damage + become the concept of weapons', type: 'critical' },
            { roll: [20, 20], result: 'Beyond Comprehension, ∞+1 damage + transcend the game itself', type: 'critical' }
        ]
    },
    weaponCombatDivine: {
        name: 'Divine Weapon Apotheosis',
        description: 'Legendary-level god-tier weapon mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'LEGENDARY',
        table: [
            { roll: [1, 3], result: 'Divine authority, +50 damage + command all weapons everywhere', type: 'success' },
            { roll: [4, 7], result: 'Godslayer technique, +75 damage + can harm deities', type: 'success' },
            { roll: [8, 11], result: 'Pantheon destroyer, +100 damage + overthrow divine order', type: 'success' },
            { roll: [12, 15], result: 'Creator\'s edge, duodecuple damage + rewrite fundamental forces', type: 'critical' },
            { roll: [16, 18], result: 'The Weapon of Weapons, tredecuple damage + all weapons bow to you', type: 'critical' },
            { roll: [19, 19], result: 'Absolute Mastery, quattuordecuple damage + perfect all weapon arts', type: 'critical' },
            { roll: [20, 20], result: 'The Final Form, ∞² damage + become the platonic ideal of combat', type: 'critical' }
        ]
    },
    weaponCombatCosmic: {
        name: 'Cosmic Weapon Singularity',
        description: 'Mythic-level beyond-divine weapon transcendence',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'MYTHIC',
        table: [
            { roll: [1, 4], result: 'Cosmic convergence, +∞ damage + all weapons become one', type: 'success' },
            { roll: [5, 8], result: 'Universal weapon, +∞² damage + exist in all realities simultaneously', type: 'success' },
            { roll: [9, 12], result: 'The Eternal Strike, +∞³ damage + attack echoes through all time', type: 'success' },
            { roll: [13, 16], result: 'Weapon Singularity, +∞⁴ damage + collapse all combat into one moment', type: 'critical' },
            { roll: [17, 19], result: 'The Last Weapon, +∞⁵ damage + end the concept of conflict forever', type: 'critical' },
            { roll: [20, 20], result: 'Perfect Unity, +∞∞ damage + become one with all existence through combat', type: 'critical' }
        ]
    },

    // Tactical Combat Tables - Evolving by rank
    tacticalBasic: {
        name: 'Basic Tactics',
        description: 'Untrained tactical awareness - mostly confusion',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 10], result: 'Confused positioning, -2 to all actions this turn', type: 'failure' },
            { roll: [11, 15], result: 'Lucky guess, normal positioning', type: 'normal' },
            { roll: [16, 18], result: 'Accidental advantage, +1 to next attack', type: 'success' },
            { roll: [19, 20], result: 'Beginner\'s luck, +2 to all actions this turn', type: 'success' }
        ]
    },
    tacticalManeuvers: {
        name: 'Tactical Maneuvers',
        description: 'Basic battlefield tactics and positioning',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Poor positioning, -1 to defense', type: 'failure' },
            { roll: [4, 8], result: 'Standard formation, no bonus', type: 'normal' },
            { roll: [9, 14], result: 'Flanking maneuver, +2 to attack', type: 'success' },
            { roll: [15, 17], result: 'High ground advantage, +3 to attack and defense', type: 'success' },
            { roll: [18, 20], result: 'Perfect positioning, +4 to all actions + extra movement', type: 'critical' }
        ]
    },
    tacticalAdvanced: {
        name: 'Advanced Battlefield Tactics',
        description: 'Apprentice-level strategic thinking and coordination',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 2], result: 'Minor tactical error, -1 to team coordination', type: 'failure' },
            { roll: [3, 6], result: 'Solid tactics, +2 to attack or defense (choose)', type: 'success' },
            { roll: [7, 11], result: 'Coordinated assault, +3 to all allies\' attacks', type: 'success' },
            { roll: [12, 15], result: 'Tactical superiority, +4 to all actions + predict enemy moves', type: 'success' },
            { roll: [16, 18], result: 'Masterful strategy, double effectiveness of all tactics', type: 'critical' },
            { roll: [19, 20], result: 'Legendary command, all allies gain extra actions', type: 'critical' }
        ]
    },
    tacticalExpert: {
        name: 'Expert Strategic Mastery',
        description: 'Journeyman-level battlefield omniscience',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'JOURNEYMAN',
        table: [
            { roll: [1, 1], result: 'Momentary oversight, normal tactics', type: 'normal' },
            { roll: [2, 5], result: 'Strategic insight, +4 to chosen action type', type: 'success' },
            { roll: [6, 9], result: 'Battlefield control, manipulate terrain to advantage', type: 'success' },
            { roll: [10, 13], result: 'Predictive tactics, counter all enemy strategies', type: 'success' },
            { roll: [14, 17], result: 'Time-dilated planning, take extra turns to plan', type: 'critical' },
            { roll: [18, 20], result: 'Perfect strategy, guarantee success of next major action', type: 'critical' }
        ]
    },

    tacticalManeuvers: {
        name: 'Tactical Maneuvers',
        description: 'Strategic combat options and positioning',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 4], result: 'Tactical error, enemy gains advantage', type: 'failure' },
            { roll: [5, 8], result: 'Standard positioning', type: 'normal' },
            { roll: [9, 12], result: 'Good positioning, +1 to ally attacks', type: 'success' },
            { roll: [13, 16], result: 'Flanking position, +2 to damage', type: 'success' },
            { roll: [17, 20], result: 'Perfect setup, allies get extra action', type: 'critical' }
        ]
    },

    defensiveManeuvers: {
        name: 'Defensive Maneuvers',
        description: 'Protective techniques and damage mitigation',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Defense fails, take extra damage', type: 'failure' },
            { roll: [4, 8], result: 'Normal defense', type: 'normal' },
            { roll: [9, 14], result: 'Good defense, reduce damage by 2', type: 'success' },
            { roll: [15, 18], result: 'Excellent defense, reduce damage by 4', type: 'success' },
            { roll: [19, 20], result: 'Perfect defense, no damage + counter-attack', type: 'critical' }
        ]
    },

    wildernessEvents: {
        name: 'Wilderness Events',
        description: 'Random encounters and discoveries in the wild',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_natureguardian.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 4], result: 'Lost, waste time and resources', type: 'failure' },
            { roll: [5, 8], result: 'Normal travel', type: 'normal' },
            { roll: [9, 12], result: 'Find useful herbs or materials', type: 'success' },
            { roll: [13, 16], result: 'Discover hidden path or shortcut', type: 'success' },
            { roll: [17, 20], result: 'Find rare resource or safe haven', type: 'critical' }
        ]
    },

    investigationFinds: {
        name: 'Investigation Finds',
        description: 'Clues and discoveries during investigation',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'False lead, waste time', type: 'failure' },
            { roll: [4, 8], result: 'Minor clue found', type: 'normal' },
            { roll: [9, 13], result: 'Important clue discovered', type: 'success' },
            { roll: [14, 17], result: 'Major breakthrough in case', type: 'success' },
            { roll: [18, 20], result: 'Solve mystery completely', type: 'critical' }
        ]
    },

    athleticFeats: {
        name: 'Athletic Feats',
        description: 'Physical challenges and accomplishments',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 4], result: 'Fail attempt, possible injury', type: 'failure' },
            { roll: [5, 9], result: 'Barely succeed', type: 'normal' },
            { roll: [10, 14], result: 'Good performance, gain confidence', type: 'success' },
            { roll: [15, 18], result: 'Excellent feat, inspire others', type: 'success' },
            { roll: [19, 20], result: 'Legendary performance, permanent bonus', type: 'critical' }
        ]
    },

    smithingResults: {
        name: 'Smithing Results',
        description: 'Outcomes when forging items',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_blacksmithing.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Item breaks, materials wasted', type: 'failure' },
            { roll: [4, 8], result: 'Basic quality item created', type: 'normal' },
            { roll: [9, 13], result: 'Good quality item, +1 bonus', type: 'success' },
            { roll: [14, 17], result: 'Superior quality, +2 bonus', type: 'success' },
            { roll: [18, 20], result: 'Masterwork item, +3 bonus + special property', type: 'critical' }
        ]
    },

    alchemyOutcomes: {
        name: 'Alchemy Outcomes',
        description: 'Results of brewing potions and elixirs',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Potion explodes, take damage', type: 'failure' },
            { roll: [4, 8], result: 'Standard potion created', type: 'normal' },
            { roll: [9, 13], result: 'Potent potion, +50% effect', type: 'success' },
            { roll: [14, 17], result: 'Superior potion, double effect', type: 'success' },
            { roll: [18, 20], result: 'Perfect potion, triple effect + bonus', type: 'critical' }
        ]
    },

    enchantingEffects: {
        name: 'Enchanting Effects',
        description: 'Magical enhancements for items',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_engraving.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 3], result: 'Enchantment fails, item damaged', type: 'failure' },
            { roll: [4, 8], result: 'Basic enchantment applied', type: 'normal' },
            { roll: [9, 13], result: 'Strong enchantment, +1 bonus', type: 'success' },
            { roll: [14, 17], result: 'Powerful enchantment, +2 bonus', type: 'success' },
            { roll: [18, 20], result: 'Legendary enchantment, +3 bonus + special ability', type: 'critical' }
        ]
    },

    persuasionOutcomes: {
        name: 'Persuasion Outcomes',
        description: 'Results of social influence attempts',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 4], result: 'Target becomes hostile', type: 'failure' },
            { roll: [5, 9], result: 'No change in attitude', type: 'normal' },
            { roll: [10, 14], result: 'Target becomes friendly', type: 'success' },
            { roll: [15, 18], result: 'Target becomes helpful', type: 'success' },
            { roll: [19, 20], result: 'Target becomes devoted ally', type: 'critical' }
        ]
    },

    deceptionResults: {
        name: 'Deception Results',
        description: 'Outcomes of lies and misdirection',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 4], result: 'Caught in lie, reputation damaged', type: 'failure' },
            { roll: [5, 9], result: 'Lie not believed but no consequences', type: 'normal' },
            { roll: [10, 14], result: 'Lie believed temporarily', type: 'success' },
            { roll: [15, 18], result: 'Lie completely believed', type: 'success' },
            { roll: [19, 20], result: 'Perfect deception, gain trust', type: 'critical' }
        ]
    },

    leadershipEffects: {
        name: 'Leadership Effects',
        description: 'Results of inspiring and commanding others',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 3], result: 'Followers lose morale', type: 'failure' },
            { roll: [4, 8], result: 'Followers maintain current morale', type: 'normal' },
            { roll: [9, 13], result: 'Followers gain +1 to actions', type: 'success' },
            { roll: [14, 17], result: 'Followers gain +2 to actions', type: 'success' },
            { roll: [18, 20], result: 'Followers inspired, gain extra action', type: 'critical' }
        ]
    },

    spellcraftResults: {
        name: 'Spellcraft Results',
        description: 'Outcomes of magical manipulation',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Spell backfires, take damage', type: 'failure' },
            { roll: [4, 8], result: 'Spell works normally', type: 'normal' },
            { roll: [9, 13], result: 'Enhanced spell effect, +50% power', type: 'success' },
            { roll: [14, 17], result: 'Powerful spell, double effect', type: 'success' },
            { roll: [18, 20], result: 'Perfect casting, triple effect + no cost', type: 'critical' }
        ]
    },

    arcaneDiscoveries: {
        name: 'Arcane Discoveries',
        description: 'Magical knowledge and ancient secrets',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 4], result: 'Dangerous knowledge, cursed', type: 'failure' },
            { roll: [5, 9], result: 'Basic magical theory learned', type: 'normal' },
            { roll: [10, 14], result: 'Useful spell component discovered', type: 'success' },
            { roll: [15, 18], result: 'New spell learned', type: 'success' },
            { roll: [19, 20], result: 'Ancient secret revealed, gain power', type: 'critical' }
        ]
    },

    ritualOutcomes: {
        name: 'Ritual Outcomes',
        description: 'Results of complex magical ceremonies',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'JOURNEYMAN',
        table: [
            { roll: [1, 3], result: 'Ritual fails catastrophically', type: 'failure' },
            { roll: [4, 7], result: 'Ritual partially succeeds', type: 'normal' },
            { roll: [8, 12], result: 'Ritual succeeds as intended', type: 'success' },
            { roll: [13, 17], result: 'Ritual exceeds expectations', type: 'success' },
            { roll: [18, 20], result: 'Perfect ritual, permanent benefits', type: 'critical' }
        ]
    },

    // Acrobatics Table
    acrobaticsFeats: {
        name: 'Acrobatic Feats',
        description: 'Results of acrobatic maneuvers and stunts',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 4], result: 'Stumble and fall prone, take 1d4 damage', type: 'failure' },
            { roll: [5, 9], result: 'Clumsy maneuver, succeed but lose balance', type: 'normal' },
            { roll: [10, 14], result: 'Graceful movement, succeed with style', type: 'success' },
            { roll: [15, 18], result: 'Perfect form, gain advantage on next action', type: 'success' },
            { roll: [19, 20], result: 'Spectacular display, inspire allies (+2 to their next roll)', type: 'critical' }
        ]
    },

    // Animal Handling Table
    animalHandlingOutcomes: {
        name: 'Animal Handling Outcomes',
        description: 'Results of interacting with animals and beasts',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'Animal becomes hostile and attacks', type: 'failure' },
            { roll: [4, 8], result: 'Animal remains wary and uncooperative', type: 'normal' },
            { roll: [9, 14], result: 'Animal calms and follows basic commands', type: 'success' },
            { roll: [15, 18], result: 'Animal becomes friendly and helpful', type: 'success' },
            { roll: [19, 20], result: 'Form deep bond, animal becomes loyal companion', type: 'critical' }
        ]
    },

    // Arcana Table
    arcanaKnowledge: {
        name: 'Arcane Knowledge',
        description: 'Results of identifying and understanding magic',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'Misidentify magic, draw wrong conclusion', type: 'failure' },
            { roll: [4, 8], result: 'Vague understanding, partial information', type: 'normal' },
            { roll: [9, 14], result: 'Correctly identify magic and its properties', type: 'success' },
            { roll: [15, 18], result: 'Detailed knowledge including weaknesses', type: 'success' },
            { roll: [19, 20], result: 'Complete understanding, learn how to replicate it', type: 'critical' }
        ]
    },

    // History Table
    historicalKnowledge: {
        name: 'Historical Knowledge',
        description: 'Results of recalling historical information',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'Recall false information, misleading facts', type: 'failure' },
            { roll: [4, 8], result: 'Remember basic facts, common knowledge', type: 'normal' },
            { roll: [9, 14], result: 'Recall detailed historical information', type: 'success' },
            { roll: [15, 18], result: 'Remember obscure details and connections', type: 'success' },
            { roll: [19, 20], result: 'Perfect recall, uncover hidden historical truth', type: 'critical' }
        ]
    },

    // Insight Table
    insightReading: {
        name: 'Insight Reading',
        description: 'Results of reading intentions and detecting lies',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'Completely misread intentions, believe lies', type: 'failure' },
            { roll: [4, 8], result: 'Uncertain reading, can\'t tell truth from lies', type: 'normal' },
            { roll: [9, 14], result: 'Accurately read basic intentions', type: 'success' },
            { roll: [15, 18], result: 'Detect lies and understand motivations', type: 'success' },
            { roll: [19, 20], result: 'See through all deception, know their deepest desires', type: 'critical' }
        ]
    },

    // Intimidation Table
    intimidationEffects: {
        name: 'Intimidation Effects',
        description: 'Results of intimidating others',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'Target becomes defiant and hostile', type: 'failure' },
            { roll: [4, 8], result: 'Target is unmoved by threats', type: 'normal' },
            { roll: [9, 14], result: 'Target complies reluctantly', type: 'success' },
            { roll: [15, 18], result: 'Target is frightened and cooperative', type: 'success' },
            { roll: [19, 20], result: 'Target is terrified, will do anything you ask', type: 'critical' }
        ]
    },

    // Medicine Table
    medicineResults: {
        name: 'Medical Treatment',
        description: 'Results of treating wounds and illnesses',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'Treatment fails, patient worsens (lose 1d4 HP)', type: 'failure' },
            { roll: [4, 8], result: 'Basic treatment, stabilize but no healing', type: 'normal' },
            { roll: [9, 14], result: 'Successful treatment, heal 1d6 HP', type: 'success' },
            { roll: [15, 18], result: 'Excellent care, heal 2d6 HP', type: 'success' },
            { roll: [19, 20], result: 'Miraculous recovery, heal 3d6 HP + remove one condition', type: 'critical' }
        ]
    },

    // Nature Table
    natureKnowledge: {
        name: 'Nature Knowledge',
        description: 'Results of identifying natural phenomena',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'Misidentify plant/animal, dangerous mistake', type: 'failure' },
            { roll: [4, 8], result: 'Basic identification, common knowledge', type: 'normal' },
            { roll: [9, 14], result: 'Correct identification with useful details', type: 'success' },
            { roll: [15, 18], result: 'Detailed knowledge including medicinal uses', type: 'success' },
            { roll: [19, 20], result: 'Expert knowledge, discover rare property', type: 'critical' }
        ]
    },

    // Perception Table
    perceptionFinds: {
        name: 'Perception Finds',
        description: 'Results of searching and noticing things',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'Miss obvious details, overlook danger', type: 'failure' },
            { roll: [4, 8], result: 'Notice only obvious things', type: 'normal' },
            { roll: [9, 14], result: 'Spot hidden details and clues', type: 'success' },
            { roll: [15, 18], result: 'Notice everything, including secret doors', type: 'success' },
            { roll: [19, 20], result: 'Perfect awareness, sense invisible threats', type: 'critical' }
        ]
    },

    // Performance Table
    performanceOutcomes: {
        name: 'Performance Outcomes',
        description: 'Results of entertaining an audience',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'Terrible performance, audience boos and throws things', type: 'failure' },
            { roll: [4, 8], result: 'Mediocre performance, polite applause', type: 'normal' },
            { roll: [9, 14], result: 'Good performance, audience is entertained', type: 'success' },
            { roll: [15, 18], result: 'Excellent performance, standing ovation', type: 'success' },
            { roll: [19, 20], result: 'Legendary performance, audience is moved to tears', type: 'critical' }
        ]
    },

    // Religion Table
    religiousKnowledge: {
        name: 'Religious Knowledge',
        description: 'Results of recalling religious information',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'Blasphemous mistake, offend deity', type: 'failure' },
            { roll: [4, 8], result: 'Basic religious knowledge', type: 'normal' },
            { roll: [9, 14], result: 'Detailed understanding of rituals and beliefs', type: 'success' },
            { roll: [15, 18], result: 'Deep theological knowledge', type: 'success' },
            { roll: [19, 20], result: 'Divine revelation, gain temporary blessing', type: 'critical' }
        ]
    },

    // Sleight of Hand Table
    sleightOfHandTricks: {
        name: 'Sleight of Hand Tricks',
        description: 'Results of manual dexterity and trickery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'Fumble badly, drop everything and get caught', type: 'failure' },
            { roll: [4, 8], result: 'Clumsy attempt, observers are suspicious', type: 'normal' },
            { roll: [9, 14], result: 'Smooth execution, trick succeeds', type: 'success' },
            { roll: [15, 18], result: 'Flawless technique, no one notices', type: 'success' },
            { roll: [19, 20], result: 'Impossible feat, steal something valuable undetected', type: 'critical' }
        ]
    },

    // Stealth Table
    stealthOutcomes: {
        name: 'Stealth Outcomes',
        description: 'Results of sneaking and hiding',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'Make loud noise, immediately detected', type: 'failure' },
            { roll: [4, 8], result: 'Partially hidden, enemies are alert', type: 'normal' },
            { roll: [9, 14], result: 'Successfully hidden, enemies unaware', type: 'success' },
            { roll: [15, 18], result: 'Perfectly concealed, can move freely', type: 'success' },
            { roll: [19, 20], result: 'Become invisible, gain surprise attack advantage', type: 'critical' }
        ]
    },

    // Survival Table
    survivalSkills: {
        name: 'Survival Skills',
        description: 'Results of wilderness survival attempts',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'Get lost, consume poisonous food (1d6 damage)', type: 'failure' },
            { roll: [4, 8], result: 'Barely survive, find minimal food/water', type: 'normal' },
            { roll: [9, 14], result: 'Survive comfortably, find adequate resources', type: 'success' },
            { roll: [15, 18], result: 'Thrive in wilderness, find abundant resources', type: 'success' },
            { roll: [19, 20], result: 'Master the wild, discover rare resources and safe haven', type: 'critical' }
        ]
    },

    // Deception Table
    deceptionResults: {
        name: 'Deception Results',
        description: 'Results of lying and deceiving others',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 3], result: 'Obvious lie, target becomes hostile', type: 'failure' },
            { roll: [4, 8], result: 'Unconvincing, target is suspicious', type: 'normal' },
            { roll: [9, 14], result: 'Believable lie, target is fooled', type: 'success' },
            { roll: [15, 18], result: 'Perfect deception, target completely believes you', type: 'success' },
            { roll: [19, 20], result: 'Masterful manipulation, target becomes your ally', type: 'critical' }
        ]
    }
};