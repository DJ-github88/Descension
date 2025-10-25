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
        description: 'Adept-level advanced weapon techniques',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Fumble, weapon slips from grip', type: 'failure' },
            { roll: [2, 4], result: 'Solid strike, +4 damage', type: 'normal' },
            { roll: [5, 9], result: 'Precise blow, +6 damage', type: 'success' },
            { roll: [10, 14], result: 'Devastating strike, +8 damage + stagger enemy', type: 'success' },
            { roll: [15, 17], result: 'Perfect form, double damage', type: 'critical' },
            { roll: [18, 19], result: 'Masterful strike, double damage + disarm enemy', type: 'critical' },
            { roll: [20, 20], result: 'Legendary blow, triple damage + knockdown', type: 'critical' }
        ]
    },
    weaponCombatGrandmaster: {
        name: 'Grandmaster Weapon Arts',
        description: 'Expert-level exceptional weapon techniques',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Overextension, lose next action', type: 'failure' },
            { roll: [2, 3], result: 'Strong strike, +6 damage', type: 'normal' },
            { roll: [4, 8], result: 'Expert blow, +8 damage + ignore 5 armor', type: 'success' },
            { roll: [9, 13], result: 'Devastating strike, +10 damage + bleeding (2 damage/round)', type: 'success' },
            { roll: [14, 16], result: 'Flawless technique, double damage + stun 1 round', type: 'critical' },
            { roll: [17, 18], result: 'Masterful execution, double damage + cripple limb', type: 'critical' },
            { roll: [19, 19], result: 'Perfect strike, triple damage + disarm + knockdown', type: 'critical' },
            { roll: [20, 20], result: 'Legendary execution, triple damage + severe bleeding (5 damage/round)', type: 'critical' }
        ]
    },
    weaponCombatLegendary: {
        name: 'Legendary Weapon Mastery',
        description: 'Master-level supreme weapon techniques',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_04.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Critical error, drop weapon and provoke attack', type: 'failure' },
            { roll: [2, 2], result: 'Powerful strike, +8 damage', type: 'normal' },
            { roll: [3, 6], result: 'Master strike, +10 damage + ignore 10 armor', type: 'success' },
            { roll: [7, 11], result: 'Supreme blow, +12 damage + severe bleeding (3 damage/round)', type: 'success' },
            { roll: [12, 15], result: 'Perfect execution, double damage + stun 2 rounds', type: 'critical' },
            { roll: [16, 17], result: 'Legendary strike, triple damage + cripple + disarm', type: 'critical' },
            { roll: [18, 19], result: 'Mythic blow, triple damage + knockdown + severe bleeding (5 damage/round)', type: 'critical' },
            { roll: [20, 20], result: 'Ultimate mastery, quadruple damage + stun 3 rounds + permanent injury', type: 'critical' }
        ]
    },
    // Tactical Combat Tables - Evolving by rank
    tacticalBasic: {
        name: 'Basic Tactics',
        description: 'Untrained tactical awareness',
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
        description: 'Trained-level strategic thinking',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Minor tactical error, -1 to team coordination', type: 'failure' },
            { roll: [3, 7], result: 'Solid tactics, +2 to attack or defense (choose)', type: 'normal' },
            { roll: [8, 13], result: 'Coordinated assault, +3 to all allies\' attacks', type: 'success' },
            { roll: [14, 17], result: 'Tactical superiority, +4 to all actions + predict enemy moves', type: 'success' },
            { roll: [18, 19], result: 'Masterful strategy, +5 to all actions + grant ally extra action', type: 'critical' },
            { roll: [20, 20], result: 'Perfect command, +6 to all actions + all allies gain extra action', type: 'critical' }
        ]
    },
    tacticalExpert: {
        name: 'Expert Strategic Mastery',
        description: 'Apprentice-level battlefield control',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Momentary oversight, normal tactics', type: 'failure' },
            { roll: [2, 6], result: 'Strategic insight, +4 to chosen action type', type: 'normal' },
            { roll: [7, 12], result: 'Battlefield control, +5 to all actions + manipulate terrain', type: 'success' },
            { roll: [13, 16], result: 'Predictive tactics, +6 to all actions + counter enemy strategies', type: 'success' },
            { roll: [17, 19], result: 'Superior command, +7 to all actions + allies gain advantage', type: 'critical' },
            { roll: [20, 20], result: 'Perfect strategy, +8 to all actions + guarantee next major action success', type: 'critical' }
        ]
    },
    tacticalMaster: {
        name: 'Master Tactical Command',
        description: 'Adept-level battlefield mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Overconfidence, +2 to all actions', type: 'failure' },
            { roll: [2, 5], result: 'Master tactics, +5 to all actions + allies gain +2', type: 'normal' },
            { roll: [6, 11], result: 'Battlefield dominance, +6 to all actions + control terrain + allies gain +3', type: 'success' },
            { roll: [12, 15], result: 'Strategic genius, +7 to all actions + predict all enemy moves + allies gain +4', type: 'success' },
            { roll: [16, 18], result: 'Perfect coordination, +8 to all actions + allies gain extra actions + enemies lose actions', type: 'critical' },
            { roll: [19, 20], result: 'Legendary command, +10 to all actions + complete battlefield control + allies gain double actions', type: 'critical' }
        ]
    },
    tacticalGrandmaster: {
        name: 'Grandmaster Strategic Dominance',
        description: 'Expert-level supreme tactics',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Minor miscalculation, +4 to all actions', type: 'failure' },
            { roll: [2, 4], result: 'Expert command, +6 to all actions + allies gain +4', type: 'normal' },
            { roll: [5, 9], result: 'Supreme tactics, +8 to all actions + complete terrain control + allies gain +5', type: 'success' },
            { roll: [10, 14], result: 'Battlefield omniscience, +10 to all actions + predict all moves + allies gain +6', type: 'success' },
            { roll: [15, 17], result: 'Perfect mastery, +12 to all actions + allies gain triple actions + enemies stunned 1 round', type: 'critical' },
            { roll: [18, 20], result: 'Absolute dominance, +15 to all actions + total battlefield control + allies gain quadruple actions', type: 'critical' }
        ]
    },
    tacticalLegendary: {
        name: 'Legendary Tactical Supremacy',
        description: 'Master-level ultimate command',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_commandingshout.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Slight overreach, +6 to all actions', type: 'failure' },
            { roll: [2, 3], result: 'Master command, +8 to all actions + allies gain +6', type: 'normal' },
            { roll: [3, 7], result: 'Legendary tactics, +10 to all actions + total terrain control + allies gain +8', type: 'success' },
            { roll: [8, 12], result: 'Supreme mastery, +12 to all actions + perfect prediction + allies gain +10', type: 'success' },
            { roll: [13, 16], result: 'Ultimate command, +15 to all actions + allies gain quintuple actions + enemies lose all actions', type: 'critical' },
            { roll: [17, 19], result: 'Perfect supremacy, +18 to all actions + complete control + allies auto-succeed next action', type: 'critical' },
            { roll: [20, 20], result: 'Absolute mastery, +20 to all actions + total battlefield domination + instant victory conditions', type: 'critical' }
        ]
    },

    // Defensive Techniques Tables - Armor-based damage reduction with formulas
    defensiveBasic: {
        name: 'Clumsy Defense',
        description: 'Untrained - armor barely helps',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Complete failure, reduce damage by 0', formula: '0', type: 'failure' },
            { roll: [9, 14], result: 'Barely helps, reduce damage by armor/10', formula: 'armor/10', type: 'failure' },
            { roll: [15, 18], result: 'Clumsy block, reduce damage by armor/6', formula: 'armor/6', type: 'normal' },
            { roll: [19, 20], result: 'Lucky deflection, reduce damage by armor/4', formula: 'armor/4', type: 'success' }
        ]
    },
    defensiveManeuvers: {
        name: 'Defensive Maneuvers',
        description: 'Novice - learning to use armor effectively',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 5], result: 'Armor gap exposed, reduce damage by 0', formula: '0', type: 'failure' },
            { roll: [6, 11], result: 'Poor positioning, reduce damage by armor/8', formula: 'armor/8', type: 'failure' },
            { roll: [12, 16], result: 'Standard defense, reduce damage by armor/4', formula: 'armor/4', type: 'normal' },
            { roll: [17, 19], result: 'Good block, reduce damage by armor/3', formula: 'armor/3', type: 'success' },
            { roll: [20, 20], result: 'Lucky deflection, reduce damage by armor/2', formula: 'armor/2', type: 'critical' }
        ]
    },
    defensiveAdvanced: {
        name: 'Advanced Defense',
        description: 'Trained - armor mastery developing',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 3], result: 'Armor dented, reduce damage by armor/8', formula: 'armor/8', type: 'failure' },
            { roll: [4, 10], result: 'Solid defense, reduce damage by armor/4', formula: 'armor/4', type: 'normal' },
            { roll: [11, 16], result: 'Strong block, reduce damage by armor/3', formula: 'armor/3', type: 'success' },
            { roll: [17, 19], result: 'Excellent form, reduce damage by armor/2', formula: 'armor/2', type: 'success' },
            { roll: [20, 20], result: 'Perfect timing, reduce damage by armor', formula: 'armor', type: 'critical' }
        ]
    },
    defensiveExpert: {
        name: 'Expert Defense',
        description: 'Apprentice - maximizing armor effectiveness',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 2], result: 'Overextended, reduce damage by armor/4', formula: 'armor/4', type: 'failure' },
            { roll: [3, 9], result: 'Competent block, reduce damage by armor/3', formula: 'armor/3', type: 'normal' },
            { roll: [10, 15], result: 'Strong defense, reduce damage by armor/2', formula: 'armor/2', type: 'success' },
            { roll: [16, 18], result: 'Expert positioning, reduce damage by armor - 2', formula: 'armor - 2', type: 'success' },
            { roll: [19, 20], result: 'Masterful block, reduce damage by armor', formula: 'armor', type: 'critical' }
        ]
    },
    defensiveMaster: {
        name: 'Master Defense',
        description: 'Adept - armor becomes second nature',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 2], result: 'Minor slip, reduce damage by armor/3', formula: 'armor/3', type: 'failure' },
            { roll: [3, 8], result: 'Solid form, reduce damage by armor/2', formula: 'armor/2', type: 'normal' },
            { roll: [9, 14], result: 'Master block, reduce damage by armor - 3', formula: 'armor - 3', type: 'success' },
            { roll: [15, 17], result: 'Superior defense, reduce damage by armor', formula: 'armor', type: 'success' },
            { roll: [18, 20], result: 'Fortified stance, reduce damage by armor + 2', formula: 'armor + 2', type: 'critical' }
        ]
    },
    defensiveGrandmaster: {
        name: 'Grandmaster Defense',
        description: 'Expert - advanced defensive techniques',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 2], result: 'Misjudged angle, reduce damage by armor/2', formula: 'armor/2', type: 'failure' },
            { roll: [3, 7], result: 'Expert block, reduce damage by armor - 2', formula: 'armor - 2', type: 'normal' },
            { roll: [8, 13], result: 'Perfect form, reduce damage by armor', formula: 'armor', type: 'success' },
            { roll: [14, 17], result: 'Grandmaster technique, reduce damage by armor + 3', formula: 'armor + 3', type: 'success' },
            { roll: [18, 20], result: 'Flawless defense, reduce damage by armor + 5', formula: 'armor + 5', type: 'critical' }
        ]
    },
    defensiveLegendary: {
        name: 'Legendary Defense',
        description: 'Master - legendary defensive techniques',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_defensivestance.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 2], result: 'Caught off-guard, reduce damage by armor - 2', formula: 'armor - 2', type: 'failure' },
            { roll: [3, 7], result: 'Master technique, reduce damage by armor', formula: 'armor', type: 'normal' },
            { roll: [8, 13], result: 'Legendary form, reduce damage by armor + 3', formula: 'armor + 3', type: 'success' },
            { roll: [14, 17], result: 'Supreme defense, reduce damage by armor + 5', formula: 'armor + 5', type: 'success' },
            { roll: [18, 20], result: 'Mythic technique, reduce damage by armor + 8', formula: 'armor + 8', type: 'critical' }
        ]
    },

    // Wilderness Survival Tables - Evolving by rank
    wildernessBasic: {
        name: 'Lost in the Wild',
        description: 'Untrained wilderness survival',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_natureguardian.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 7], result: 'Hopelessly lost, waste 1d4 hours', type: 'failure' },
            { roll: [8, 13], result: 'Slow progress, difficult terrain', type: 'failure' },
            { roll: [14, 18], result: 'Make basic progress', type: 'normal' },
            { roll: [19, 20], result: 'Lucky find, discover water source', type: 'success' }
        ]
    },
    wildernessEvents: {
        name: 'Wilderness Events',
        description: 'Basic wilderness navigation and survival',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_natureguardian.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Lost, waste time and resources', type: 'failure' },
            { roll: [4, 9], result: 'Normal travel', type: 'normal' },
            { roll: [10, 14], result: 'Find useful herbs or materials', type: 'success' },
            { roll: [15, 17], result: 'Discover hidden path or shortcut', type: 'success' },
            { roll: [18, 20], result: 'Find rare resource or safe haven', type: 'critical' }
        ]
    },
    wildernessAdvanced: {
        name: 'Skilled Survival',
        description: 'Trained wilderness expertise',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_natureguardian.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Minor setback, lose 1 hour', type: 'failure' },
            { roll: [3, 8], result: 'Efficient travel, make good time', type: 'normal' },
            { roll: [9, 14], result: 'Find medicinal herbs, heal 1d6 HP', type: 'success' },
            { roll: [15, 17], result: 'Track game, gain food for 1d4 days', type: 'success' },
            { roll: [18, 19], result: 'Discover hidden cave or shelter', type: 'critical' },
            { roll: [20, 20], result: 'Find rare alchemical ingredients', type: 'critical' }
        ]
    },
    wildernessExpert: {
        name: 'Expert Tracker',
        description: 'Apprentice-level wilderness mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_natureguardian.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Unexpected weather, minor delay', type: 'failure' },
            { roll: [2, 7], result: 'Navigate efficiently, avoid hazards', type: 'normal' },
            { roll: [8, 13], result: 'Track creatures, gain advantage on next encounter', type: 'success' },
            { roll: [14, 16], result: 'Find secret path, reduce travel time by half', type: 'success' },
            { roll: [17, 19], result: 'Discover ancient ruins or treasure', type: 'critical' },
            { roll: [20, 20], result: 'Befriend wild animal companion', type: 'critical' }
        ]
    },
    wildernessMaster: {
        name: 'Master Survivalist',
        description: 'Adept wilderness survival',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_natureguardian.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Unexpected weather, adapt and continue', type: 'normal' },
            { roll: [2, 6], result: 'Perfect navigation, reduce travel time by 25%', type: 'normal' },
            { roll: [7, 12], result: 'Predict weather, avoid dangerous conditions', type: 'success' },
            { roll: [13, 16], result: 'Find rare herbs worth 50gp', type: 'success' },
            { roll: [17, 19], result: 'Discover hidden cache, gain supplies for 1 week', type: 'critical' },
            { roll: [20, 20], result: 'Find legendary herb, heal all HP and remove conditions', type: 'critical' }
        ]
    },
    wildernessGrandmaster: {
        name: 'Wilderness Legend',
        description: 'Expert survival and tracking',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_natureguardian.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 2], result: 'Dangerous terrain, lose 1 hour navigating', type: 'failure' },
            { roll: [3, 7], result: 'Expert tracking, gain advantage on next encounter', type: 'normal' },
            { roll: [8, 13], result: 'Befriend wild animal, gain temporary companion for 1 hour', type: 'success' },
            { roll: [14, 17], result: 'Find secret path, reduce travel time by 40%', type: 'success' },
            { roll: [18, 19], result: 'Discover rare materials worth 75gp', type: 'critical' },
            { roll: [20, 20], result: 'Find sacred grove, party heals 2d10 HP', type: 'critical' }
        ]
    },
    wildernessLegendary: {
        name: 'Nature\'s Champion',
        description: 'Master of wilderness',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_natureguardian.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 2], result: 'Unexpected storm, lose 1 hour finding shelter', type: 'failure' },
            { roll: [3, 7], result: 'Expert navigation, reduce travel time by 30%', type: 'normal' },
            { roll: [8, 13], result: 'Call animals for aid, gain 1d3 beast allies for 1 hour', type: 'success' },
            { roll: [14, 17], result: 'Find ancient tree, gain nature\'s blessing (+2 to wilderness rolls for 1 day)', type: 'success' },
            { roll: [18, 19], result: 'Discover hidden sanctuary, safe rest healing 4d10 HP', type: 'critical' },
            { roll: [20, 20], result: 'Nature spirit appears, grants blessing (advantage on next 3 wilderness rolls)', type: 'critical' }
        ]
    },

    // Investigation Tables - Evolving by rank
    investigationBasic: {
        name: 'Basic Investigation',
        description: 'Untrained investigation attempts',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Completely confused, find nothing', type: 'failure' },
            { roll: [9, 14], result: 'Vague impression, no useful information', type: 'failure' },
            { roll: [15, 18], result: 'Notice something odd', type: 'normal' },
            { roll: [19, 20], result: 'Lucky find, discover minor clue', type: 'success' }
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
    investigationAdvanced: {
        name: 'Advanced Investigation',
        description: 'Trained investigation techniques',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Misleading evidence, lose 1 hour', type: 'failure' },
            { roll: [3, 7], result: 'Find useful clue', type: 'normal' },
            { roll: [8, 13], result: 'Discover important evidence', type: 'success' },
            { roll: [14, 17], result: 'Uncover hidden connection', type: 'success' },
            { roll: [18, 19], result: 'Major breakthrough, solve key part of mystery', type: 'critical' },
            { roll: [20, 20], result: 'Complete solution revealed', type: 'critical' }
        ]
    },
    investigationExpert: {
        name: 'Expert Investigation',
        description: 'Apprentice-level deductive reasoning',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Red herring, minor delay', type: 'failure' },
            { roll: [2, 6], result: 'Find multiple clues', type: 'normal' },
            { roll: [7, 12], result: 'Deduce important connection', type: 'success' },
            { roll: [13, 16], result: 'Uncover hidden motive', type: 'success' },
            { roll: [17, 19], result: 'Solve major mystery element', type: 'critical' },
            { roll: [20, 20], result: 'Complete deduction, solve entire case', type: 'critical' }
        ]
    },
    investigationMaster: {
        name: 'Master Investigation',
        description: 'Adept-level investigative mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Deliberate misdirection, lose 30 minutes', type: 'failure' },
            { roll: [2, 5], result: 'Find crucial evidence', type: 'normal' },
            { roll: [6, 11], result: 'Deduce complex pattern', type: 'success' },
            { roll: [12, 15], result: 'Uncover conspiracy or plot', type: 'success' },
            { roll: [16, 18], result: 'Solve case and predict future events', type: 'critical' },
            { roll: [19, 20], result: 'Perfect deduction, solve case and identify all involved parties', type: 'critical' }
        ]
    },
    investigationGrandmaster: {
        name: 'Grandmaster Investigation',
        description: 'Expert-level investigative genius',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Expertly hidden evidence, lose 15 minutes', type: 'failure' },
            { roll: [2, 4], result: 'Find all available evidence', type: 'normal' },
            { roll: [5, 9], result: 'Deduce hidden connections', type: 'success' },
            { roll: [10, 14], result: 'Uncover elaborate conspiracy', type: 'success' },
            { roll: [15, 17], result: 'Solve case and identify mastermind', type: 'critical' },
            { roll: [18, 20], result: 'Perfect investigation, solve case and prevent future crimes', type: 'critical' }
        ]
    },
    investigationLegendary: {
        name: 'Legendary Investigation',
        description: 'Master-level supreme deduction',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_spyglass_02.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Masterfully concealed, lose 10 minutes', type: 'failure' },
            { roll: [2, 3], result: 'Find all evidence and hidden clues', type: 'normal' },
            { roll: [4, 8], result: 'Deduce entire conspiracy network', type: 'success' },
            { roll: [9, 13], result: 'Uncover multi-layered plot', type: 'success' },
            { roll: [14, 16], result: 'Solve impossible case', type: 'critical' },
            { roll: [17, 19], result: 'Perfect deduction, solve case and all related mysteries', type: 'critical' },
            { roll: [20, 20], result: 'Legendary insight, solve case and predict all future related events', type: 'critical' }
        ]
    },

    // Athletics Tables - Evolving by rank
    athleticsBasic: {
        name: 'Clumsy Athletics',
        description: 'Untrained physical attempts',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Fail badly, take 1d4 damage', type: 'failure' },
            { roll: [9, 14], result: 'Struggle and fail', type: 'failure' },
            { roll: [15, 18], result: 'Barely succeed', type: 'normal' },
            { roll: [19, 20], result: 'Lucky success', type: 'success' }
        ]
    },
    athleticsFeats: {
        name: 'Athletic Feats',
        description: 'Physical challenges and accomplishments',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 4], result: 'Fail attempt, possible injury (1d4 damage)', type: 'failure' },
            { roll: [5, 9], result: 'Barely succeed', type: 'normal' },
            { roll: [10, 14], result: 'Good performance, gain confidence', type: 'success' },
            { roll: [15, 18], result: 'Excellent feat, inspire others (+1 to allies\' next athletic check)', type: 'success' },
            { roll: [19, 20], result: 'Impressive performance, gain +2 to next athletic check', type: 'critical' }
        ]
    },
    athleticsAdvanced: {
        name: 'Advanced Athletics',
        description: 'Trained physical prowess',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Minor failure, lose balance', type: 'failure' },
            { roll: [3, 7], result: 'Succeed with effort', type: 'normal' },
            { roll: [8, 13], result: 'Strong performance, +2 to next athletic check', type: 'success' },
            { roll: [14, 17], result: 'Impressive feat, inspire allies (+2 to allies\' next athletic check)', type: 'success' },
            { roll: [18, 19], result: 'Exceptional performance, gain advantage on next athletic check', type: 'critical' },
            { roll: [20, 20], result: 'Perfect execution, automatic success on next similar check', type: 'critical' }
        ]
    },
    athleticsExpert: {
        name: 'Expert Athletics',
        description: 'Apprentice-level physical mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Slight misstep, no penalty', type: 'failure' },
            { roll: [2, 6], result: 'Succeed smoothly', type: 'normal' },
            { roll: [7, 12], result: 'Excellent form, +3 to next athletic check', type: 'success' },
            { roll: [13, 16], result: 'Masterful performance, inspire all allies (+3 to allies\' next athletic check)', type: 'success' },
            { roll: [17, 19], result: 'Legendary feat, gain advantage on next 2 athletic checks', type: 'critical' },
            { roll: [20, 20], result: 'Perfect mastery, automatic success on next 2 similar checks', type: 'critical' }
        ]
    },
    athleticsMaster: {
        name: 'Master Athletics',
        description: 'Adept-level supreme physicality',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor adjustment needed, succeed anyway', type: 'normal' },
            { roll: [2, 5], result: 'Succeed with grace', type: 'normal' },
            { roll: [6, 11], result: 'Masterful execution, +4 to next athletic check', type: 'success' },
            { roll: [12, 15], result: 'Inspiring performance, all allies gain +4 to next athletic check', type: 'success' },
            { roll: [16, 18], result: 'Legendary athleticism, gain advantage on next 3 athletic checks', type: 'critical' },
            { roll: [19, 20], result: 'Perfect form, automatic success on next 3 similar checks + inspire awe', type: 'critical' }
        ]
    },
    athleticsGrandmaster: {
        name: 'Grandmaster Athletics',
        description: 'Expert-level exceptional physicality',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Effortless success', type: 'normal' },
            { roll: [2, 4], result: 'Flawless execution', type: 'normal' },
            { roll: [5, 9], result: 'Supreme performance, +5 to next athletic check', type: 'success' },
            { roll: [10, 14], result: 'Awe-inspiring feat, all allies gain +5 to next athletic check', type: 'success' },
            { roll: [15, 17], result: 'Mythic athleticism, gain advantage on next 5 athletic checks', type: 'critical' },
            { roll: [18, 20], result: 'Perfect mastery, automatic success on next 5 similar checks + permanent +1 to athletics', type: 'critical' }
        ]
    },
    athleticsLegendary: {
        name: 'Legendary Athletics',
        description: 'Master-level ultimate physicality',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Effortless perfection', type: 'normal' },
            { roll: [2, 3], result: 'Flawless mastery', type: 'normal' },
            { roll: [4, 8], result: 'Legendary performance, +6 to next athletic check', type: 'success' },
            { roll: [9, 13], result: 'Mythic feat, all allies gain +6 to next athletic check', type: 'success' },
            { roll: [14, 16], result: 'Impossible athleticism, gain advantage on next 10 athletic checks', type: 'critical' },
            { roll: [17, 19], result: 'Perfect supremacy, automatic success on next 10 similar checks + permanent +2 to athletics', type: 'critical' },
            { roll: [20, 20], result: 'Ultimate mastery, redefine physical limits + permanent +3 to athletics', type: 'critical' }
        ]
    },

    // Smithing Tables - Evolving by rank
    smithingBasic: {
        name: 'Crude Smithing',
        description: 'Untrained smithing attempts',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_blacksmithing.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Complete failure, materials destroyed', type: 'failure' },
            { roll: [9, 14], result: 'Broken item, unusable', type: 'failure' },
            { roll: [15, 18], result: 'Crude item, barely functional', type: 'normal' },
            { roll: [19, 20], result: 'Basic item created', type: 'success' }
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
    smithingAdvanced: {
        name: 'Advanced Smithing',
        description: 'Trained smithing techniques',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_blacksmithing.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Minor flaw, -1 to item', type: 'failure' },
            { roll: [3, 7], result: 'Good quality item, +1 bonus', type: 'normal' },
            { roll: [8, 13], result: 'Superior quality, +2 bonus', type: 'success' },
            { roll: [14, 17], result: 'Excellent quality, +3 bonus', type: 'success' },
            { roll: [18, 19], result: 'Masterwork item, +4 bonus + special property', type: 'critical' },
            { roll: [20, 20], result: 'Perfect craft, +5 bonus + 2 special properties', type: 'critical' }
        ]
    },
    smithingExpert: {
        name: 'Expert Smithing',
        description: 'Apprentice-level craftsmanship',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_blacksmithing.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Slight imperfection, normal quality', type: 'failure' },
            { roll: [2, 6], result: 'Superior quality, +2 bonus', type: 'normal' },
            { roll: [7, 12], result: 'Excellent quality, +3 bonus', type: 'success' },
            { roll: [13, 16], result: 'Masterwork item, +4 bonus + special property', type: 'success' },
            { roll: [17, 19], result: 'Legendary craft, +5 bonus + 2 special properties', type: 'critical' },
            { roll: [20, 20], result: 'Perfect masterpiece, +6 bonus + 3 special properties', type: 'critical' }
        ]
    },
    smithingMaster: {
        name: 'Master Smithing',
        description: 'Adept-level legendary craftsmanship',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_blacksmithing.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Minor variation, +2 bonus', type: 'failure' },
            { roll: [2, 5], result: 'Excellent quality, +3 bonus', type: 'normal' },
            { roll: [6, 11], result: 'Masterwork item, +4 bonus + special property', type: 'success' },
            { roll: [12, 15], result: 'Legendary craft, +5 bonus + 2 special properties', type: 'success' },
            { roll: [16, 18], result: 'Perfect masterpiece, +6 bonus + 3 special properties', type: 'critical' },
            { roll: [19, 20], result: 'Artifact-quality, +7 bonus + 4 special properties', type: 'critical' }
        ]
    },
    smithingGrandmaster: {
        name: 'Grandmaster Smithing',
        description: 'Expert-level supreme craftsmanship',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_blacksmithing.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Acceptable quality, +3 bonus', type: 'failure' },
            { roll: [2, 4], result: 'Masterwork item, +4 bonus + special property', type: 'normal' },
            { roll: [5, 9], result: 'Legendary craft, +5 bonus + 2 special properties', type: 'success' },
            { roll: [10, 14], result: 'Perfect masterpiece, +6 bonus + 3 special properties', type: 'success' },
            { roll: [15, 17], result: 'Artifact-quality, +7 bonus + 4 special properties', type: 'critical' },
            { roll: [18, 20], result: 'Mythic creation, +8 bonus + 5 special properties + sentience', type: 'critical' }
        ]
    },
    smithingLegendary: {
        name: 'Legendary Smithing',
        description: 'Master-level ultimate craftsmanship',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_blacksmithing.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Good quality, +4 bonus', type: 'failure' },
            { roll: [2, 3], result: 'Legendary craft, +5 bonus + 2 special properties', type: 'normal' },
            { roll: [4, 8], result: 'Perfect masterpiece, +6 bonus + 3 special properties', type: 'success' },
            { roll: [9, 13], result: 'Artifact-quality, +7 bonus + 4 special properties', type: 'success' },
            { roll: [14, 16], result: 'Mythic creation, +8 bonus + 5 special properties + sentience', type: 'critical' },
            { roll: [17, 19], result: 'Divine craft, +9 bonus + 6 special properties + legendary status', type: 'critical' },
            { roll: [20, 20], result: 'Ultimate masterwork, +10 bonus + 7 special properties + grows with wielder', type: 'critical' }
        ]
    },

    // Alchemy Tables - Evolving by rank
    alchemyBasic: {
        name: 'Crude Alchemy',
        description: 'Untrained alchemy attempts',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Explosion, take 1d6 damage', type: 'failure' },
            { roll: [9, 14], result: 'Useless sludge created', type: 'failure' },
            { roll: [15, 18], result: 'Weak potion, 25% effect', type: 'normal' },
            { roll: [19, 20], result: 'Basic potion created', type: 'success' }
        ]
    },
    alchemyOutcomes: {
        name: 'Alchemy Outcomes',
        description: 'Results of brewing potions and elixirs',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Potion explodes, take 1d4 damage', type: 'failure' },
            { roll: [4, 8], result: 'Standard potion created', type: 'normal' },
            { roll: [9, 13], result: 'Potent potion, +50% effect', type: 'success' },
            { roll: [14, 17], result: 'Superior potion, double effect', type: 'success' },
            { roll: [18, 20], result: 'Perfect potion, triple effect + bonus duration', type: 'critical' }
        ]
    },
    alchemyAdvanced: {
        name: 'Advanced Alchemy',
        description: 'Trained alchemy techniques',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Unstable potion, random effect', type: 'failure' },
            { roll: [3, 7], result: 'Potent potion, +50% effect', type: 'normal' },
            { roll: [8, 13], result: 'Superior potion, double effect', type: 'success' },
            { roll: [14, 17], result: 'Perfect potion, triple effect + bonus duration', type: 'success' },
            { roll: [18, 19], result: 'Masterwork potion, quadruple effect + extended duration', type: 'critical' },
            { roll: [20, 20], result: 'Legendary brew, quintuple effect + permanent bonus', type: 'critical' }
        ]
    },
    alchemyExpert: {
        name: 'Expert Alchemy',
        description: 'Apprentice-level brewing mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Slightly weak, +25% effect', type: 'failure' },
            { roll: [2, 6], result: 'Superior potion, double effect', type: 'normal' },
            { roll: [7, 12], result: 'Perfect potion, triple effect + bonus duration', type: 'success' },
            { roll: [13, 16], result: 'Masterwork potion, quadruple effect + extended duration', type: 'success' },
            { roll: [17, 19], result: 'Legendary brew, quintuple effect + permanent bonus', type: 'critical' },
            { roll: [20, 20], result: 'Mythic elixir, sextuple effect + 2 bonus effects', type: 'critical' }
        ]
    },
    alchemyMaster: {
        name: 'Master Alchemy',
        description: 'Adept-level supreme brewing',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Standard strength, double effect', type: 'failure' },
            { roll: [2, 5], result: 'Perfect potion, triple effect + bonus duration', type: 'normal' },
            { roll: [6, 11], result: 'Masterwork potion, quadruple effect + extended duration', type: 'success' },
            { roll: [12, 15], result: 'Legendary brew, quintuple effect + permanent bonus', type: 'success' },
            { roll: [16, 18], result: 'Mythic elixir, sextuple effect + 2 bonus effects', type: 'critical' },
            { roll: [19, 20], result: 'Divine concoction, septuple effect + 3 bonus effects', type: 'critical' }
        ]
    },
    alchemyGrandmaster: {
        name: 'Grandmaster Alchemy',
        description: 'Expert-level legendary brewing',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Good quality, triple effect', type: 'failure' },
            { roll: [2, 4], result: 'Masterwork potion, quadruple effect + extended duration', type: 'normal' },
            { roll: [5, 9], result: 'Legendary brew, quintuple effect + permanent bonus', type: 'success' },
            { roll: [10, 14], result: 'Mythic elixir, sextuple effect + 2 bonus effects', type: 'success' },
            { roll: [15, 17], result: 'Divine concoction, septuple effect + 3 bonus effects', type: 'critical' },
            { roll: [18, 20], result: 'Ultimate elixir, octuple effect + 4 bonus effects + no side effects', type: 'critical' }
        ]
    },
    alchemyLegendary: {
        name: 'Legendary Alchemy',
        description: 'Master-level ultimate brewing',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_alchemy.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Excellent quality, quadruple effect', type: 'failure' },
            { roll: [2, 3], result: 'Legendary brew, quintuple effect + permanent bonus', type: 'normal' },
            { roll: [4, 8], result: 'Mythic elixir, sextuple effect + 2 bonus effects', type: 'success' },
            { roll: [9, 13], result: 'Divine concoction, septuple effect + 3 bonus effects', type: 'success' },
            { roll: [14, 16], result: 'Ultimate elixir, octuple effect + 4 bonus effects + no side effects', type: 'critical' },
            { roll: [17, 19], result: 'Philosopher\'s brew, nonuple effect + 5 bonus effects + create 2 potions', type: 'critical' },
            { roll: [20, 20], result: 'Elixir of eternity, decuple effect + 6 bonus effects + permanent transformation', type: 'critical' }
        ]
    },

    // Enchanting Tables - Evolving by rank
    enchantingBasic: {
        name: 'Crude Enchanting',
        description: 'Untrained enchanting attempts',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_engraving.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Enchantment backfires, item cursed', type: 'failure' },
            { roll: [9, 14], result: 'Enchantment fizzles, no effect', type: 'failure' },
            { roll: [15, 18], result: 'Weak enchantment, temporary +1 bonus', type: 'normal' },
            { roll: [19, 20], result: 'Basic enchantment, +1 bonus', type: 'success' }
        ]
    },
    enchantingEffects: {
        name: 'Enchanting Effects',
        description: 'Magical enhancements for items',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_engraving.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Enchantment fails, item damaged', type: 'failure' },
            { roll: [4, 8], result: 'Basic enchantment, +1 bonus', type: 'normal' },
            { roll: [9, 13], result: 'Strong enchantment, +2 bonus', type: 'success' },
            { roll: [14, 17], result: 'Powerful enchantment, +3 bonus', type: 'success' },
            { roll: [18, 20], result: 'Legendary enchantment, +4 bonus + special ability', type: 'critical' }
        ]
    },
    enchantingAdvanced: {
        name: 'Advanced Enchanting',
        description: 'Trained enchanting techniques',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_engraving.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Unstable enchantment, random effect', type: 'failure' },
            { roll: [3, 7], result: 'Strong enchantment, +2 bonus', type: 'normal' },
            { roll: [8, 13], result: 'Powerful enchantment, +3 bonus', type: 'success' },
            { roll: [14, 17], result: 'Legendary enchantment, +4 bonus + special ability', type: 'success' },
            { roll: [18, 19], result: 'Masterwork enchantment, +5 bonus + 2 special abilities', type: 'critical' },
            { roll: [20, 20], result: 'Perfect enchantment, +6 bonus + 3 special abilities', type: 'critical' }
        ]
    },
    enchantingExpert: {
        name: 'Expert Enchanting',
        description: 'Apprentice-level enchanting mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_engraving.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Weak enchantment, +2 bonus', type: 'failure' },
            { roll: [2, 6], result: 'Powerful enchantment, +3 bonus', type: 'normal' },
            { roll: [7, 12], result: 'Legendary enchantment, +4 bonus + special ability', type: 'success' },
            { roll: [13, 16], result: 'Masterwork enchantment, +5 bonus + 2 special abilities', type: 'success' },
            { roll: [17, 19], result: 'Perfect enchantment, +6 bonus + 3 special abilities', type: 'critical' },
            { roll: [20, 20], result: 'Mythic enchantment, +7 bonus + 4 special abilities', type: 'critical' }
        ]
    },
    enchantingMaster: {
        name: 'Master Enchanting',
        description: 'Adept-level supreme enchanting',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_engraving.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Standard enchantment, +3 bonus', type: 'failure' },
            { roll: [2, 5], result: 'Legendary enchantment, +4 bonus + special ability', type: 'normal' },
            { roll: [6, 11], result: 'Masterwork enchantment, +5 bonus + 2 special abilities', type: 'success' },
            { roll: [12, 15], result: 'Perfect enchantment, +6 bonus + 3 special abilities', type: 'success' },
            { roll: [16, 18], result: 'Mythic enchantment, +7 bonus + 4 special abilities', type: 'critical' },
            { roll: [19, 20], result: 'Divine enchantment, +8 bonus + 5 special abilities', type: 'critical' }
        ]
    },
    enchantingGrandmaster: {
        name: 'Grandmaster Enchanting',
        description: 'Expert-level legendary enchanting',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_engraving.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Good enchantment, +4 bonus', type: 'failure' },
            { roll: [2, 4], result: 'Masterwork enchantment, +5 bonus + 2 special abilities', type: 'normal' },
            { roll: [5, 9], result: 'Perfect enchantment, +6 bonus + 3 special abilities', type: 'success' },
            { roll: [10, 14], result: 'Mythic enchantment, +7 bonus + 4 special abilities', type: 'success' },
            { roll: [15, 17], result: 'Divine enchantment, +8 bonus + 5 special abilities', type: 'critical' },
            { roll: [18, 20], result: 'Ultimate enchantment, +9 bonus + 6 special abilities + sentience', type: 'critical' }
        ]
    },
    enchantingLegendary: {
        name: 'Legendary Enchanting',
        description: 'Master-level ultimate enchanting',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_engraving.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Excellent enchantment, +5 bonus', type: 'failure' },
            { roll: [2, 3], result: 'Perfect enchantment, +6 bonus + 3 special abilities', type: 'normal' },
            { roll: [4, 8], result: 'Mythic enchantment, +7 bonus + 4 special abilities', type: 'success' },
            { roll: [9, 13], result: 'Divine enchantment, +8 bonus + 5 special abilities', type: 'success' },
            { roll: [14, 16], result: 'Ultimate enchantment, +9 bonus + 6 special abilities + sentience', type: 'critical' },
            { roll: [17, 19], result: 'Cosmic enchantment, +10 bonus + 7 special abilities + evolves', type: 'critical' },
            { roll: [20, 20], result: 'Eternal enchantment, +11 bonus + 8 special abilities + grants wishes', type: 'critical' }
        ]
    },

    // Persuasion Tables - Evolving by rank
    persuasionBasic: {
        name: 'Crude Persuasion',
        description: 'Untrained persuasion attempts',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Target becomes hostile', type: 'failure' },
            { roll: [9, 14], result: 'Target annoyed, -1 to future attempts', type: 'failure' },
            { roll: [15, 18], result: 'No change in attitude', type: 'normal' },
            { roll: [19, 20], result: 'Target becomes neutral', type: 'success' }
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
    persuasionAdvanced: {
        name: 'Advanced Persuasion',
        description: 'Trained persuasion techniques',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Target skeptical, -1 to next attempt', type: 'failure' },
            { roll: [3, 7], result: 'Target becomes friendly', type: 'normal' },
            { roll: [8, 13], result: 'Target becomes helpful', type: 'success' },
            { roll: [14, 17], result: 'Target becomes devoted ally', type: 'success' },
            { roll: [18, 19], result: 'Target becomes loyal follower', type: 'critical' },
            { roll: [20, 20], result: 'Target becomes fanatical supporter', type: 'critical' }
        ]
    },
    persuasionExpert: {
        name: 'Expert Persuasion',
        description: 'Apprentice-level persuasion mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Target neutral, no change', type: 'failure' },
            { roll: [2, 6], result: 'Target becomes helpful', type: 'normal' },
            { roll: [7, 12], result: 'Target becomes devoted ally', type: 'success' },
            { roll: [13, 16], result: 'Target becomes loyal follower', type: 'success' },
            { roll: [17, 19], result: 'Target becomes fanatical supporter', type: 'critical' },
            { roll: [20, 20], result: 'Target will die for you', type: 'critical' }
        ]
    },
    persuasionMaster: {
        name: 'Master Persuasion',
        description: 'Adept-level supreme persuasion',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Target friendly, minor favor', type: 'failure' },
            { roll: [2, 5], result: 'Target becomes devoted ally', type: 'normal' },
            { roll: [6, 11], result: 'Target becomes loyal follower', type: 'success' },
            { roll: [12, 15], result: 'Target becomes fanatical supporter', type: 'success' },
            { roll: [16, 18], result: 'Target will die for you', type: 'critical' },
            { roll: [19, 20], result: 'Target converts entire group to your cause', type: 'critical' }
        ]
    },
    persuasionGrandmaster: {
        name: 'Grandmaster Persuasion',
        description: 'Expert-level legendary persuasion',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Target helpful, moderate favor', type: 'failure' },
            { roll: [2, 4], result: 'Target becomes loyal follower', type: 'normal' },
            { roll: [5, 9], result: 'Target becomes fanatical supporter', type: 'success' },
            { roll: [10, 14], result: 'Target will die for you', type: 'success' },
            { roll: [15, 17], result: 'Target converts entire group to your cause', type: 'critical' },
            { roll: [18, 20], result: 'Target abandons all previous loyalties for you', type: 'critical' }
        ]
    },
    persuasionLegendary: {
        name: 'Legendary Persuasion',
        description: 'Master-level ultimate persuasion',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_silence.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Target devoted, major favor', type: 'failure' },
            { roll: [2, 3], result: 'Target becomes fanatical supporter', type: 'normal' },
            { roll: [4, 8], result: 'Target will die for you', type: 'success' },
            { roll: [9, 13], result: 'Target converts entire group to your cause', type: 'success' },
            { roll: [14, 16], result: 'Target abandons all previous loyalties for you', type: 'critical' },
            { roll: [17, 19], result: 'Target spreads your message, converts others', type: 'critical' },
            { roll: [20, 20], result: 'Target becomes your prophet, starts religion in your name', type: 'critical' }
        ]
    },

    // Deception Tables - Evolving by rank
    deceptionBasic: {
        name: 'Crude Deception',
        description: 'Untrained deception attempts',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Caught in obvious lie, reputation ruined', type: 'failure' },
            { roll: [9, 14], result: 'Lie transparent, target suspicious', type: 'failure' },
            { roll: [15, 18], result: 'Lie not believed but no consequences', type: 'normal' },
            { roll: [19, 20], result: 'Lie believed temporarily', type: 'success' }
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
    deceptionAdvanced: {
        name: 'Advanced Deception',
        description: 'Trained deception techniques',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Lie questioned, -1 to next attempt', type: 'failure' },
            { roll: [3, 7], result: 'Lie believed temporarily', type: 'normal' },
            { roll: [8, 13], result: 'Lie completely believed', type: 'success' },
            { roll: [14, 17], result: 'Perfect deception, gain trust', type: 'success' },
            { roll: [18, 19], result: 'Masterful lie, target becomes ally', type: 'critical' },
            { roll: [20, 20], result: 'Legendary deception, rewrite target\'s memories', type: 'critical' }
        ]
    },
    deceptionExpert: {
        name: 'Expert Deception',
        description: 'Apprentice-level deception mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Lie accepted with minor doubt', type: 'failure' },
            { roll: [2, 6], result: 'Lie completely believed', type: 'normal' },
            { roll: [7, 12], result: 'Perfect deception, gain trust', type: 'success' },
            { roll: [13, 16], result: 'Masterful lie, target becomes ally', type: 'success' },
            { roll: [17, 19], result: 'Legendary deception, rewrite target\'s memories', type: 'critical' },
            { roll: [20, 20], result: 'Ultimate deception, target believes opposite of truth', type: 'critical' }
        ]
    },
    deceptionMaster: {
        name: 'Master Deception',
        description: 'Adept-level supreme deception',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Lie fully believed', type: 'failure' },
            { roll: [2, 5], result: 'Perfect deception, gain trust', type: 'normal' },
            { roll: [6, 11], result: 'Masterful lie, target becomes ally', type: 'success' },
            { roll: [12, 15], result: 'Legendary deception, rewrite target\'s memories', type: 'success' },
            { roll: [16, 18], result: 'Ultimate deception, target believes opposite of truth', type: 'critical' },
            { roll: [19, 20], result: 'Perfect illusion, target spreads your lie to others', type: 'critical' }
        ]
    },
    deceptionGrandmaster: {
        name: 'Grandmaster Deception',
        description: 'Expert-level legendary deception',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Perfect deception, complete trust', type: 'failure' },
            { roll: [2, 4], result: 'Masterful lie, target becomes ally', type: 'normal' },
            { roll: [5, 9], result: 'Legendary deception, rewrite target\'s memories', type: 'success' },
            { roll: [10, 14], result: 'Ultimate deception, target believes opposite of truth', type: 'success' },
            { roll: [15, 17], result: 'Perfect illusion, target spreads your lie to others', type: 'critical' },
            { roll: [18, 20], result: 'Reality-bending lie, entire group believes false history', type: 'critical' }
        ]
    },
    deceptionLegendary: {
        name: 'Legendary Deception',
        description: 'Master-level ultimate deception',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_disguise.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Masterful lie, unwavering belief', type: 'failure' },
            { roll: [2, 3], result: 'Legendary deception, rewrite target\'s memories', type: 'normal' },
            { roll: [4, 8], result: 'Ultimate deception, target believes opposite of truth', type: 'success' },
            { roll: [9, 13], result: 'Perfect illusion, target spreads your lie to others', type: 'success' },
            { roll: [14, 16], result: 'Reality-bending lie, entire group believes false history', type: 'critical' },
            { roll: [17, 19], result: 'Mythic deception, target\'s identity rewritten', type: 'critical' },
            { roll: [20, 20], result: 'Absolute deception, lie becomes truth in target\'s reality', type: 'critical' }
        ]
    },

    // Leadership Tables - Evolving by rank
    leadershipBasic: {
        name: 'Crude Leadership',
        description: 'Untrained leadership attempts',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Followers panic, flee or rebel', type: 'failure' },
            { roll: [9, 14], result: 'Followers confused, -1 to actions', type: 'failure' },
            { roll: [15, 18], result: 'Followers maintain current morale', type: 'normal' },
            { roll: [19, 20], result: 'Followers gain +1 to actions', type: 'success' }
        ]
    },
    leadershipEffects: {
        name: 'Leadership Effects',
        description: 'Results of inspiring and commanding others',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Followers lose morale', type: 'failure' },
            { roll: [4, 8], result: 'Followers maintain current morale', type: 'normal' },
            { roll: [9, 13], result: 'Followers gain +1 to actions', type: 'success' },
            { roll: [14, 17], result: 'Followers gain +2 to actions', type: 'success' },
            { roll: [18, 20], result: 'Followers inspired, gain extra action', type: 'critical' }
        ]
    },
    leadershipAdvanced: {
        name: 'Advanced Leadership',
        description: 'Trained leadership techniques',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Followers hesitate, no bonus', type: 'failure' },
            { roll: [3, 7], result: 'Followers gain +1 to actions', type: 'normal' },
            { roll: [8, 13], result: 'Followers gain +2 to actions', type: 'success' },
            { roll: [14, 17], result: 'Followers inspired, gain extra action', type: 'success' },
            { roll: [18, 19], result: 'Followers empowered, +3 to actions + extra action', type: 'critical' },
            { roll: [20, 20], result: 'Followers become fearless, immune to fear + double actions', type: 'critical' }
        ]
    },
    leadershipExpert: {
        name: 'Expert Leadership',
        description: 'Apprentice-level leadership mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Followers steady, +1 to actions', type: 'failure' },
            { roll: [2, 6], result: 'Followers gain +2 to actions', type: 'normal' },
            { roll: [7, 12], result: 'Followers inspired, gain extra action', type: 'success' },
            { roll: [13, 16], result: 'Followers empowered, +3 to actions + extra action', type: 'success' },
            { roll: [17, 19], result: 'Followers become fearless, immune to fear + double actions', type: 'critical' },
            { roll: [20, 20], result: 'Followers transcendent, +4 to all stats + triple actions', type: 'critical' }
        ]
    },
    leadershipMaster: {
        name: 'Master Leadership',
        description: 'Adept-level supreme leadership',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Followers motivated, +2 to actions', type: 'failure' },
            { roll: [2, 5], result: 'Followers inspired, gain extra action', type: 'normal' },
            { roll: [6, 11], result: 'Followers empowered, +3 to actions + extra action', type: 'success' },
            { roll: [12, 15], result: 'Followers become fearless, immune to fear + double actions', type: 'success' },
            { roll: [16, 18], result: 'Followers transcendent, +4 to all stats + triple actions', type: 'critical' },
            { roll: [19, 20], result: 'Followers legendary, +5 to all stats + quadruple actions + regeneration', type: 'critical' }
        ]
    },
    leadershipGrandmaster: {
        name: 'Grandmaster Leadership',
        description: 'Expert-level legendary leadership',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Followers empowered, +3 to actions', type: 'failure' },
            { roll: [2, 4], result: 'Followers empowered, +3 to actions + extra action', type: 'normal' },
            { roll: [5, 9], result: 'Followers become fearless, immune to fear + double actions', type: 'success' },
            { roll: [10, 14], result: 'Followers transcendent, +4 to all stats + triple actions', type: 'success' },
            { roll: [15, 17], result: 'Followers legendary, +5 to all stats + quadruple actions + regeneration', type: 'critical' },
            { roll: [18, 20], result: 'Followers divine, +6 to all stats + quintuple actions + invulnerability 1 round', type: 'critical' }
        ]
    },
    leadershipLegendary: {
        name: 'Legendary Leadership',
        description: 'Master-level ultimate leadership',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstrength.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Followers fearless, +3 to actions + extra action', type: 'failure' },
            { roll: [2, 3], result: 'Followers become fearless, immune to fear + double actions', type: 'normal' },
            { roll: [4, 8], result: 'Followers transcendent, +4 to all stats + triple actions', type: 'success' },
            { roll: [9, 13], result: 'Followers legendary, +5 to all stats + quadruple actions + regeneration', type: 'success' },
            { roll: [14, 16], result: 'Followers divine, +6 to all stats + quintuple actions + invulnerability 1 round', type: 'critical' },
            { roll: [17, 19], result: 'Followers mythic, +7 to all stats + unlimited actions + resurrection on death', type: 'critical' },
            { roll: [20, 20], result: 'Followers ascended, +10 to all stats + time stops for enemies + victory guaranteed', type: 'critical' }
        ]
    },

    // Spellcraft Tables - Evolving by rank
    spellcraftBasic: {
        name: 'Crude Spellcraft',
        description: 'Untrained spellcraft attempts',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Spell explodes, take 2d6 damage', type: 'failure' },
            { roll: [9, 14], result: 'Spell fizzles, lose mana', type: 'failure' },
            { roll: [15, 18], result: 'Spell works at 50% power', type: 'normal' },
            { roll: [19, 20], result: 'Spell works normally', type: 'success' }
        ]
    },
    spellcraftResults: {
        name: 'Spellcraft Results',
        description: 'Outcomes of magical manipulation',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Spell backfires, take 1d6 damage', type: 'failure' },
            { roll: [4, 8], result: 'Spell works normally', type: 'normal' },
            { roll: [9, 13], result: 'Enhanced spell effect, +50% power', type: 'success' },
            { roll: [14, 17], result: 'Powerful spell, double effect', type: 'success' },
            { roll: [18, 20], result: 'Perfect casting, triple effect + no cost', type: 'critical' }
        ]
    },
    spellcraftAdvanced: {
        name: 'Advanced Spellcraft',
        description: 'Trained spellcraft techniques',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Spell unstable, random effect', type: 'failure' },
            { roll: [3, 7], result: 'Enhanced spell effect, +50% power', type: 'normal' },
            { roll: [8, 13], result: 'Powerful spell, double effect', type: 'success' },
            { roll: [14, 17], result: 'Perfect casting, triple effect + no cost', type: 'success' },
            { roll: [18, 19], result: 'Masterful casting, quadruple effect + refund half cost', type: 'critical' },
            { roll: [20, 20], result: 'Legendary casting, quintuple effect + full refund + bonus spell', type: 'critical' }
        ]
    },
    spellcraftExpert: {
        name: 'Expert Spellcraft',
        description: 'Apprentice-level spellcraft mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Spell normal power', type: 'failure' },
            { roll: [2, 6], result: 'Powerful spell, double effect', type: 'normal' },
            { roll: [7, 12], result: 'Perfect casting, triple effect + no cost', type: 'success' },
            { roll: [13, 16], result: 'Masterful casting, quadruple effect + refund half cost', type: 'success' },
            { roll: [17, 19], result: 'Legendary casting, quintuple effect + full refund + bonus spell', type: 'critical' },
            { roll: [20, 20], result: 'Mythic casting, sextuple effect + permanent mana increase', type: 'critical' }
        ]
    },
    spellcraftMaster: {
        name: 'Master Spellcraft',
        description: 'Adept-level supreme spellcraft',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Spell enhanced, +50% power', type: 'failure' },
            { roll: [2, 5], result: 'Perfect casting, triple effect + no cost', type: 'normal' },
            { roll: [6, 11], result: 'Masterful casting, quadruple effect + refund half cost', type: 'success' },
            { roll: [12, 15], result: 'Legendary casting, quintuple effect + full refund + bonus spell', type: 'success' },
            { roll: [16, 18], result: 'Mythic casting, sextuple effect + permanent mana increase', type: 'critical' },
            { roll: [19, 20], result: 'Divine casting, septuple effect + learn new spell + area effect', type: 'critical' }
        ]
    },
    spellcraftGrandmaster: {
        name: 'Grandmaster Spellcraft',
        description: 'Expert-level legendary spellcraft',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Spell powerful, double effect', type: 'failure' },
            { roll: [2, 4], result: 'Masterful casting, quadruple effect + refund half cost', type: 'normal' },
            { roll: [5, 9], result: 'Legendary casting, quintuple effect + full refund + bonus spell', type: 'success' },
            { roll: [10, 14], result: 'Mythic casting, sextuple effect + permanent mana increase', type: 'success' },
            { roll: [15, 17], result: 'Divine casting, septuple effect + learn new spell + area effect', type: 'critical' },
            { roll: [18, 20], result: 'Ultimate casting, octuple effect + cast any spell free once', type: 'critical' }
        ]
    },
    spellcraftLegendary: {
        name: 'Legendary Spellcraft',
        description: 'Master-level ultimate spellcraft',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_arcane_arcanetorrent.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Spell perfect, triple effect', type: 'failure' },
            { roll: [2, 3], result: 'Legendary casting, quintuple effect + full refund + bonus spell', type: 'normal' },
            { roll: [4, 8], result: 'Mythic casting, sextuple effect + permanent mana increase', type: 'success' },
            { roll: [9, 13], result: 'Divine casting, septuple effect + learn new spell + area effect', type: 'success' },
            { roll: [14, 16], result: 'Ultimate casting, octuple effect + cast any spell free once', type: 'critical' },
            { roll: [17, 19], result: 'Cosmic casting, nonuple effect + all spells free for 1 minute', type: 'critical' },
            { roll: [20, 20], result: 'Absolute casting, decuple effect + rewrite spell permanently + teach to others', type: 'critical' }
        ]
    },

    // Arcane Knowledge Tables - Evolving by rank
    arcaneBasic: {
        name: 'Basic Arcane Study',
        description: 'Untrained arcane research',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Forbidden knowledge, cursed permanently', type: 'failure' },
            { roll: [9, 14], result: 'Confusing text, learn nothing', type: 'failure' },
            { roll: [15, 18], result: 'Basic magical theory learned', type: 'normal' },
            { roll: [19, 20], result: 'Useful spell component discovered', type: 'success' }
        ]
    },
    arcaneDiscoveries: {
        name: 'Arcane Discoveries',
        description: 'Magical knowledge and ancient secrets',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 4], result: 'Dangerous knowledge, cursed', type: 'failure' },
            { roll: [5, 9], result: 'Basic magical theory learned', type: 'normal' },
            { roll: [10, 14], result: 'Useful spell component discovered', type: 'success' },
            { roll: [15, 18], result: 'New spell learned', type: 'success' },
            { roll: [19, 20], result: 'Ancient secret revealed, gain power', type: 'critical' }
        ]
    },
    arcaneAdvanced: {
        name: 'Advanced Arcane Study',
        description: 'Trained arcane research',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Misleading text, -1 to next spell', type: 'failure' },
            { roll: [3, 7], result: 'Useful spell component discovered', type: 'normal' },
            { roll: [8, 13], result: 'New spell learned', type: 'success' },
            { roll: [14, 17], result: 'Ancient secret revealed, gain power', type: 'success' },
            { roll: [18, 19], result: 'Legendary knowledge, +1 to all spells permanently', type: 'critical' },
            { roll: [20, 20], result: 'Forbidden lore, learn 3 new spells + permanent bonus', type: 'critical' }
        ]
    },
    arcaneExpert: {
        name: 'Expert Arcane Study',
        description: 'Apprentice-level arcane mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Common knowledge, minor insight', type: 'failure' },
            { roll: [2, 6], result: 'New spell learned', type: 'normal' },
            { roll: [7, 12], result: 'Ancient secret revealed, gain power', type: 'success' },
            { roll: [13, 16], result: 'Legendary knowledge, +1 to all spells permanently', type: 'success' },
            { roll: [17, 19], result: 'Forbidden lore, learn 3 new spells + permanent bonus', type: 'critical' },
            { roll: [20, 20], result: 'Mythic revelation, create new spell school', type: 'critical' }
        ]
    },
    arcaneMaster: {
        name: 'Master Arcane Study',
        description: 'Adept-level supreme arcane knowledge',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Useful knowledge, 1 new spell', type: 'failure' },
            { roll: [2, 5], result: 'Ancient secret revealed, gain power', type: 'normal' },
            { roll: [6, 11], result: 'Legendary knowledge, +1 to all spells permanently', type: 'success' },
            { roll: [12, 15], result: 'Forbidden lore, learn 3 new spells + permanent bonus', type: 'success' },
            { roll: [16, 18], result: 'Mythic revelation, create new spell school', type: 'critical' },
            { roll: [19, 20], result: 'Divine wisdom, +2 to all spells + unlock hidden potential', type: 'critical' }
        ]
    },
    arcaneGrandmaster: {
        name: 'Grandmaster Arcane Study',
        description: 'Expert-level legendary arcane knowledge',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Ancient secret, moderate power gain', type: 'failure' },
            { roll: [2, 4], result: 'Legendary knowledge, +1 to all spells permanently', type: 'normal' },
            { roll: [5, 9], result: 'Forbidden lore, learn 3 new spells + permanent bonus', type: 'success' },
            { roll: [10, 14], result: 'Mythic revelation, create new spell school', type: 'success' },
            { roll: [15, 17], result: 'Divine wisdom, +2 to all spells + unlock hidden potential', type: 'critical' },
            { roll: [18, 20], result: 'Ultimate knowledge, +3 to all spells + teach others + legendary status', type: 'critical' }
        ]
    },
    arcaneLegendary: {
        name: 'Legendary Arcane Study',
        description: 'Master-level ultimate arcane knowledge',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_09.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Legendary knowledge, +1 to all spells', type: 'failure' },
            { roll: [2, 3], result: 'Forbidden lore, learn 3 new spells + permanent bonus', type: 'normal' },
            { roll: [4, 8], result: 'Mythic revelation, create new spell school', type: 'success' },
            { roll: [9, 13], result: 'Divine wisdom, +2 to all spells + unlock hidden potential', type: 'success' },
            { roll: [14, 16], result: 'Ultimate knowledge, +3 to all spells + teach others + legendary status', type: 'critical' },
            { roll: [17, 19], result: 'Cosmic understanding, +4 to all spells + rewrite magic laws', type: 'critical' },
            { roll: [20, 20], result: 'Absolute mastery, +5 to all spells + become source of magic + immortality', type: 'critical' }
        ]
    },

    // Ritual Magic Tables - Evolving by rank
    ritualBasic: {
        name: 'Crude Rituals',
        description: 'Untrained ritual attempts',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Ritual summons demon, catastrophic failure', type: 'failure' },
            { roll: [9, 14], result: 'Ritual fails, lose all components', type: 'failure' },
            { roll: [15, 18], result: 'Ritual partially succeeds, temporary effect', type: 'normal' },
            { roll: [19, 20], result: 'Ritual succeeds as intended', type: 'success' }
        ]
    },
    ritualOutcomes: {
        name: 'Ritual Outcomes',
        description: 'Results of complex magical ceremonies',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Ritual fails catastrophically', type: 'failure' },
            { roll: [4, 7], result: 'Ritual partially succeeds', type: 'normal' },
            { roll: [8, 12], result: 'Ritual succeeds as intended', type: 'success' },
            { roll: [13, 17], result: 'Ritual exceeds expectations', type: 'success' },
            { roll: [18, 20], result: 'Perfect ritual, permanent benefits', type: 'critical' }
        ]
    },
    ritualAdvanced: {
        name: 'Advanced Rituals',
        description: 'Trained ritual techniques',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Ritual unstable, random side effect', type: 'failure' },
            { roll: [3, 7], result: 'Ritual succeeds as intended', type: 'normal' },
            { roll: [8, 13], result: 'Ritual exceeds expectations', type: 'success' },
            { roll: [14, 17], result: 'Perfect ritual, permanent benefits', type: 'success' },
            { roll: [18, 19], result: 'Masterful ritual, double benefits + bonus effect', type: 'critical' },
            { roll: [20, 20], result: 'Legendary ritual, triple benefits + permanent power increase', type: 'critical' }
        ]
    },
    ritualExpert: {
        name: 'Expert Rituals',
        description: 'Apprentice-level ritual mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Ritual succeeds normally', type: 'failure' },
            { roll: [2, 6], result: 'Ritual exceeds expectations', type: 'normal' },
            { roll: [7, 12], result: 'Perfect ritual, permanent benefits', type: 'success' },
            { roll: [13, 16], result: 'Masterful ritual, double benefits + bonus effect', type: 'success' },
            { roll: [17, 19], result: 'Legendary ritual, triple benefits + permanent power increase', type: 'critical' },
            { roll: [20, 20], result: 'Mythic ritual, quadruple benefits + unlock new ritual type', type: 'critical' }
        ]
    },
    ritualMaster: {
        name: 'Master Rituals',
        description: 'Adept-level supreme rituals',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Ritual exceeds expectations', type: 'failure' },
            { roll: [2, 5], result: 'Perfect ritual, permanent benefits', type: 'normal' },
            { roll: [6, 11], result: 'Masterful ritual, double benefits + bonus effect', type: 'success' },
            { roll: [12, 15], result: 'Legendary ritual, triple benefits + permanent power increase', type: 'success' },
            { roll: [16, 18], result: 'Mythic ritual, quadruple benefits + unlock new ritual type', type: 'critical' },
            { roll: [19, 20], result: 'Divine ritual, quintuple benefits + grant power to others', type: 'critical' }
        ]
    },
    ritualGrandmaster: {
        name: 'Grandmaster Rituals',
        description: 'Expert-level legendary rituals',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Perfect ritual, permanent benefits', type: 'failure' },
            { roll: [2, 4], result: 'Masterful ritual, double benefits + bonus effect', type: 'normal' },
            { roll: [5, 9], result: 'Legendary ritual, triple benefits + permanent power increase', type: 'success' },
            { roll: [10, 14], result: 'Mythic ritual, quadruple benefits + unlock new ritual type', type: 'success' },
            { roll: [15, 17], result: 'Divine ritual, quintuple benefits + grant power to others', type: 'critical' },
            { roll: [18, 20], result: 'Ultimate ritual, sextuple benefits + reshape reality locally', type: 'critical' }
        ]
    },
    ritualLegendary: {
        name: 'Legendary Rituals',
        description: 'Master-level ultimate rituals',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_ritualofsacrifice.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Masterful ritual, double benefits', type: 'failure' },
            { roll: [2, 3], result: 'Legendary ritual, triple benefits + permanent power increase', type: 'normal' },
            { roll: [4, 8], result: 'Mythic ritual, quadruple benefits + unlock new ritual type', type: 'success' },
            { roll: [9, 13], result: 'Divine ritual, quintuple benefits + grant power to others', type: 'success' },
            { roll: [14, 16], result: 'Ultimate ritual, sextuple benefits + reshape reality locally', type: 'critical' },
            { roll: [17, 19], result: 'Cosmic ritual, septuple benefits + create new plane of existence', type: 'critical' },
            { roll: [20, 20], result: 'Absolute ritual, octuple benefits + rewrite fundamental laws + ascension', type: 'critical' }
        ]
    },

    // Animal Handling Tables - Evolving by rank
    animalHandlingBasic: {
        name: 'Crude Animal Handling',
        description: 'Untrained animal interaction',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Animal panics and attacks violently', type: 'failure' },
            { roll: [9, 14], result: 'Animal flees in fear', type: 'failure' },
            { roll: [15, 18], result: 'Animal remains wary and uncooperative', type: 'normal' },
            { roll: [19, 20], result: 'Animal calms slightly', type: 'success' }
        ]
    },
    animalHandlingOutcomes: {
        name: 'Animal Handling Outcomes',
        description: 'Results of interacting with animals and beasts',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Animal becomes hostile and attacks', type: 'failure' },
            { roll: [4, 8], result: 'Animal remains wary and uncooperative', type: 'normal' },
            { roll: [9, 14], result: 'Animal calms and follows basic commands', type: 'success' },
            { roll: [15, 18], result: 'Animal becomes friendly and helpful', type: 'success' },
            { roll: [19, 20], result: 'Form deep bond, animal becomes loyal companion', type: 'critical' }
        ]
    },
    animalHandlingAdvanced: {
        name: 'Advanced Animal Handling',
        description: 'Trained animal interaction',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Animal confused, no response', type: 'failure' },
            { roll: [3, 7], result: 'Animal calms and follows basic commands', type: 'normal' },
            { roll: [8, 13], result: 'Animal becomes friendly and helpful', type: 'success' },
            { roll: [14, 17], result: 'Form deep bond, animal becomes loyal companion', type: 'success' },
            { roll: [18, 19], result: 'Animal devoted, will defend you to death', type: 'critical' },
            { roll: [20, 20], result: 'Perfect bond, animal gains intelligence + telepathic link', type: 'critical' }
        ]
    },
    animalHandlingExpert: {
        name: 'Expert Animal Handling',
        description: 'Apprentice-level animal mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Animal wary but cooperative', type: 'failure' },
            { roll: [2, 6], result: 'Animal becomes friendly and helpful', type: 'normal' },
            { roll: [7, 12], result: 'Form deep bond, animal becomes loyal companion', type: 'success' },
            { roll: [13, 16], result: 'Animal devoted, will defend you to death', type: 'success' },
            { roll: [17, 19], result: 'Perfect bond, animal gains intelligence + telepathic link', type: 'critical' },
            { roll: [20, 20], result: 'Legendary bond, animal evolves + shares abilities with you', type: 'critical' }
        ]
    },
    animalHandlingMaster: {
        name: 'Master Animal Handling',
        description: 'Adept-level supreme animal mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Animal friendly and helpful', type: 'failure' },
            { roll: [2, 5], result: 'Form deep bond, animal becomes loyal companion', type: 'normal' },
            { roll: [6, 11], result: 'Animal devoted, will defend you to death', type: 'success' },
            { roll: [12, 15], result: 'Perfect bond, animal gains intelligence + telepathic link', type: 'success' },
            { roll: [16, 18], result: 'Legendary bond, animal evolves + shares abilities with you', type: 'critical' },
            { roll: [19, 20], result: 'Mythic bond, animal becomes magical beast + grants you powers', type: 'critical' }
        ]
    },
    animalHandlingGrandmaster: {
        name: 'Grandmaster Animal Handling',
        description: 'Expert-level legendary animal mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Animal loyal companion', type: 'failure' },
            { roll: [2, 4], result: 'Animal devoted, will defend you to death', type: 'normal' },
            { roll: [5, 9], result: 'Perfect bond, animal gains intelligence + telepathic link', type: 'success' },
            { roll: [10, 14], result: 'Legendary bond, animal evolves + shares abilities with you', type: 'success' },
            { roll: [15, 17], result: 'Mythic bond, animal becomes magical beast + grants you powers', type: 'critical' },
            { roll: [18, 20], result: 'Divine bond, animal becomes celestial + you can speak with all animals', type: 'critical' }
        ]
    },
    animalHandlingLegendary: {
        name: 'Legendary Animal Handling',
        description: 'Master-level ultimate animal mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_beastcall.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Animal devoted and protective', type: 'failure' },
            { roll: [2, 3], result: 'Perfect bond, animal gains intelligence + telepathic link', type: 'normal' },
            { roll: [4, 8], result: 'Legendary bond, animal evolves + shares abilities with you', type: 'success' },
            { roll: [9, 13], result: 'Mythic bond, animal becomes magical beast + grants you powers', type: 'success' },
            { roll: [14, 16], result: 'Divine bond, animal becomes celestial + you can speak with all animals', type: 'critical' },
            { roll: [17, 19], result: 'Cosmic bond, animal becomes avatar of nature + command all beasts', type: 'critical' },
            { roll: [20, 20], result: 'Absolute bond, animal becomes deity + you merge souls + shapeshift freely', type: 'critical' }
        ]
    },

    // Arcana Tables - Evolving by rank
    arcanaBasic: {
        name: 'Basic Arcana',
        description: 'Untrained magical identification',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Completely misidentify magic, dangerous conclusion', type: 'failure' },
            { roll: [9, 14], result: 'No understanding, confused', type: 'failure' },
            { roll: [15, 18], result: 'Vague understanding, partial information', type: 'normal' },
            { roll: [19, 20], result: 'Correctly identify magic type', type: 'success' }
        ]
    },
    arcanaKnowledge: {
        name: 'Arcane Knowledge',
        description: 'Results of identifying and understanding magic',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Misidentify magic, draw wrong conclusion', type: 'failure' },
            { roll: [4, 8], result: 'Vague understanding, partial information', type: 'normal' },
            { roll: [9, 14], result: 'Correctly identify magic and its properties', type: 'success' },
            { roll: [15, 18], result: 'Detailed knowledge including weaknesses', type: 'success' },
            { roll: [19, 20], result: 'Complete understanding, learn how to replicate it', type: 'critical' }
        ]
    },
    arcanaAdvanced: {
        name: 'Advanced Arcana',
        description: 'Trained magical identification',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Partial identification, minor details missed', type: 'failure' },
            { roll: [3, 7], result: 'Correctly identify magic and its properties', type: 'normal' },
            { roll: [8, 13], result: 'Detailed knowledge including weaknesses', type: 'success' },
            { roll: [14, 17], result: 'Complete understanding, learn how to replicate it', type: 'success' },
            { roll: [18, 19], result: 'Perfect analysis, learn how to counter it', type: 'critical' },
            { roll: [20, 20], result: 'Absolute mastery, improve upon the magic', type: 'critical' }
        ]
    },
    arcanaExpert: {
        name: 'Expert Arcana',
        description: 'Apprentice-level magical mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Good identification, most properties known', type: 'failure' },
            { roll: [2, 6], result: 'Detailed knowledge including weaknesses', type: 'normal' },
            { roll: [7, 12], result: 'Complete understanding, learn how to replicate it', type: 'success' },
            { roll: [13, 16], result: 'Perfect analysis, learn how to counter it', type: 'success' },
            { roll: [17, 19], result: 'Absolute mastery, improve upon the magic', type: 'critical' },
            { roll: [20, 20], result: 'Legendary insight, create new spell based on it', type: 'critical' }
        ]
    },
    arcanaMaster: {
        name: 'Master Arcana',
        description: 'Adept-level supreme magical knowledge',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Detailed knowledge, all properties known', type: 'failure' },
            { roll: [2, 5], result: 'Complete understanding, learn how to replicate it', type: 'normal' },
            { roll: [6, 11], result: 'Perfect analysis, learn how to counter it', type: 'success' },
            { roll: [12, 15], result: 'Absolute mastery, improve upon the magic', type: 'success' },
            { roll: [16, 18], result: 'Legendary insight, create new spell based on it', type: 'critical' },
            { roll: [19, 20], result: 'Mythic understanding, permanently absorb the magic', type: 'critical' }
        ]
    },
    arcanaGrandmaster: {
        name: 'Grandmaster Arcana',
        description: 'Expert-level legendary magical knowledge',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Complete understanding, full replication', type: 'failure' },
            { roll: [2, 4], result: 'Perfect analysis, learn how to counter it', type: 'normal' },
            { roll: [5, 9], result: 'Absolute mastery, improve upon the magic', type: 'success' },
            { roll: [10, 14], result: 'Legendary insight, create new spell based on it', type: 'success' },
            { roll: [15, 17], result: 'Mythic understanding, permanently absorb the magic', type: 'critical' },
            { roll: [18, 20], result: 'Divine knowledge, teach others + gain permanent power', type: 'critical' }
        ]
    },
    arcanaLegendary: {
        name: 'Legendary Arcana',
        description: 'Master-level ultimate magical knowledge',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Perfect analysis, full counter knowledge', type: 'failure' },
            { roll: [2, 3], result: 'Absolute mastery, improve upon the magic', type: 'normal' },
            { roll: [4, 8], result: 'Legendary insight, create new spell based on it', type: 'success' },
            { roll: [9, 13], result: 'Mythic understanding, permanently absorb the magic', type: 'success' },
            { roll: [14, 16], result: 'Divine knowledge, teach others + gain permanent power', type: 'critical' },
            { roll: [17, 19], result: 'Cosmic insight, rewrite the magic\'s fundamental nature', type: 'critical' },
            { roll: [20, 20], result: 'Absolute mastery, become the source of this magic type', type: 'critical' }
        ]
    },

    // History Tables - Evolving by rank
    historyBasic: {
        name: 'Basic History',
        description: 'Untrained historical recall',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Recall completely false information, dangerous myths', type: 'failure' },
            { roll: [9, 14], result: 'Confused memories, no useful information', type: 'failure' },
            { roll: [15, 18], result: 'Remember basic facts, common knowledge', type: 'normal' },
            { roll: [19, 20], result: 'Recall some detailed information', type: 'success' }
        ]
    },
    historicalKnowledge: {
        name: 'Historical Knowledge',
        description: 'Results of recalling historical information',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Recall false information, misleading facts', type: 'failure' },
            { roll: [4, 8], result: 'Remember basic facts, common knowledge', type: 'normal' },
            { roll: [9, 14], result: 'Recall detailed historical information', type: 'success' },
            { roll: [15, 18], result: 'Remember obscure details and connections', type: 'success' },
            { roll: [19, 20], result: 'Perfect recall, uncover hidden historical truth', type: 'critical' }
        ]
    },
    historyAdvanced: {
        name: 'Advanced History',
        description: 'Trained historical knowledge',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Partial recall, some details wrong', type: 'failure' },
            { roll: [3, 7], result: 'Recall detailed historical information', type: 'normal' },
            { roll: [8, 13], result: 'Remember obscure details and connections', type: 'success' },
            { roll: [14, 17], result: 'Perfect recall, uncover hidden historical truth', type: 'success' },
            { roll: [18, 19], result: 'Legendary knowledge, discover lost secrets', type: 'critical' },
            { roll: [20, 20], result: 'Complete mastery, rewrite historical understanding', type: 'critical' }
        ]
    },
    historyExpert: {
        name: 'Expert History',
        description: 'Apprentice-level historical mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Good recall, most details correct', type: 'failure' },
            { roll: [2, 6], result: 'Remember obscure details and connections', type: 'normal' },
            { roll: [7, 12], result: 'Perfect recall, uncover hidden historical truth', type: 'success' },
            { roll: [13, 16], result: 'Legendary knowledge, discover lost secrets', type: 'success' },
            { roll: [17, 19], result: 'Complete mastery, rewrite historical understanding', type: 'critical' },
            { roll: [20, 20], result: 'Mythic insight, witness past events directly', type: 'critical' }
        ]
    },
    historyMaster: {
        name: 'Master History',
        description: 'Adept-level supreme historical knowledge',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Obscure details, full connections', type: 'failure' },
            { roll: [2, 5], result: 'Perfect recall, uncover hidden historical truth', type: 'normal' },
            { roll: [6, 11], result: 'Legendary knowledge, discover lost secrets', type: 'success' },
            { roll: [12, 15], result: 'Complete mastery, rewrite historical understanding', type: 'success' },
            { roll: [16, 18], result: 'Mythic insight, witness past events directly', type: 'critical' },
            { roll: [19, 20], result: 'Divine knowledge, learn from ancient spirits', type: 'critical' }
        ]
    },
    historyGrandmaster: {
        name: 'Grandmaster History',
        description: 'Expert-level legendary historical knowledge',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Perfect recall, hidden truths revealed', type: 'failure' },
            { roll: [2, 4], result: 'Legendary knowledge, discover lost secrets', type: 'normal' },
            { roll: [5, 9], result: 'Complete mastery, rewrite historical understanding', type: 'success' },
            { roll: [10, 14], result: 'Mythic insight, witness past events directly', type: 'success' },
            { roll: [15, 17], result: 'Divine knowledge, learn from ancient spirits', type: 'critical' },
            { roll: [18, 20], result: 'Ultimate wisdom, access akashic records + change history', type: 'critical' }
        ]
    },
    historyLegendary: {
        name: 'Legendary History',
        description: 'Master-level ultimate historical knowledge',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Legendary knowledge, lost secrets found', type: 'failure' },
            { roll: [2, 3], result: 'Complete mastery, rewrite historical understanding', type: 'normal' },
            { roll: [4, 8], result: 'Mythic insight, witness past events directly', type: 'success' },
            { roll: [9, 13], result: 'Divine knowledge, learn from ancient spirits', type: 'success' },
            { roll: [14, 16], result: 'Ultimate wisdom, access akashic records + change history', type: 'critical' },
            { roll: [17, 19], result: 'Cosmic understanding, know all that was + predict all that will be', type: 'critical' },
            { roll: [20, 20], result: 'Absolute mastery, become living history + immortal chronicler', type: 'critical' }
        ]
    },

    // Insight Tables - Evolving by rank
    insightBasic: {
        name: 'Basic Insight',
        description: 'Untrained intention reading',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Completely misread, believe opposite of truth', type: 'failure' },
            { roll: [9, 14], result: 'No reading, completely confused', type: 'failure' },
            { roll: [15, 18], result: 'Uncertain reading, can\'t tell truth from lies', type: 'normal' },
            { roll: [19, 20], result: 'Accurately read basic intentions', type: 'success' }
        ]
    },
    insightReading: {
        name: 'Insight Reading',
        description: 'Results of reading intentions and detecting lies',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Completely misread intentions, believe lies', type: 'failure' },
            { roll: [4, 8], result: 'Uncertain reading, can\'t tell truth from lies', type: 'normal' },
            { roll: [9, 14], result: 'Accurately read basic intentions', type: 'success' },
            { roll: [15, 18], result: 'Detect lies and understand motivations', type: 'success' },
            { roll: [19, 20], result: 'See through all deception, know their deepest desires', type: 'critical' }
        ]
    },
    insightAdvanced: {
        name: 'Advanced Insight',
        description: 'Trained intention reading',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Partial reading, some doubts remain', type: 'failure' },
            { roll: [3, 7], result: 'Accurately read basic intentions', type: 'normal' },
            { roll: [8, 13], result: 'Detect lies and understand motivations', type: 'success' },
            { roll: [14, 17], result: 'See through all deception, know their deepest desires', type: 'success' },
            { roll: [18, 19], result: 'Perfect reading, know their past and fears', type: 'critical' },
            { roll: [20, 20], result: 'Absolute insight, read their soul + predict actions', type: 'critical' }
        ]
    },
    insightExpert: {
        name: 'Expert Insight',
        description: 'Apprentice-level insight mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Good reading, basic motivations clear', type: 'failure' },
            { roll: [2, 6], result: 'Detect lies and understand motivations', type: 'normal' },
            { roll: [7, 12], result: 'See through all deception, know their deepest desires', type: 'success' },
            { roll: [13, 16], result: 'Perfect reading, know their past and fears', type: 'success' },
            { roll: [17, 19], result: 'Absolute insight, read their soul + predict actions', type: 'critical' },
            { roll: [20, 20], result: 'Legendary empathy, experience their memories', type: 'critical' }
        ]
    },
    insightMaster: {
        name: 'Master Insight',
        description: 'Adept-level supreme insight',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Clear reading, all lies detected', type: 'failure' },
            { roll: [2, 5], result: 'See through all deception, know their deepest desires', type: 'normal' },
            { roll: [6, 11], result: 'Perfect reading, know their past and fears', type: 'success' },
            { roll: [12, 15], result: 'Absolute insight, read their soul + predict actions', type: 'success' },
            { roll: [16, 18], result: 'Legendary empathy, experience their memories', type: 'critical' },
            { roll: [19, 20], result: 'Mythic understanding, know their destiny + alter it', type: 'critical' }
        ]
    },
    insightGrandmaster: {
        name: 'Grandmaster Insight',
        description: 'Expert-level legendary insight',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Perfect reading, past and fears known', type: 'failure' },
            { roll: [2, 4], result: 'Perfect reading, know their past and fears', type: 'normal' },
            { roll: [5, 9], result: 'Absolute insight, read their soul + predict actions', type: 'success' },
            { roll: [10, 14], result: 'Legendary empathy, experience their memories', type: 'success' },
            { roll: [15, 17], result: 'Mythic understanding, know their destiny + alter it', type: 'critical' },
            { roll: [18, 20], result: 'Divine perception, read multiple souls + influence thoughts', type: 'critical' }
        ]
    },
    insightLegendary: {
        name: 'Legendary Insight',
        description: 'Master-level ultimate insight',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Absolute insight, soul fully read', type: 'failure' },
            { roll: [2, 3], result: 'Absolute insight, read their soul + predict actions', type: 'normal' },
            { roll: [4, 8], result: 'Legendary empathy, experience their memories', type: 'success' },
            { roll: [9, 13], result: 'Mythic understanding, know their destiny + alter it', type: 'success' },
            { roll: [14, 16], result: 'Divine perception, read multiple souls + influence thoughts', type: 'critical' },
            { roll: [17, 19], result: 'Cosmic awareness, know all minds nearby + control emotions', type: 'critical' },
            { roll: [20, 20], result: 'Absolute empathy, merge with all consciousness + omniscient understanding', type: 'critical' }
        ]
    },

    // Intimidation Tables - Evolving by rank
    intimidationBasic: {
        name: 'Crude Intimidation',
        description: 'Untrained intimidation attempts',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Target enraged, attacks immediately', type: 'failure' },
            { roll: [9, 14], result: 'Target laughs, becomes more confident', type: 'failure' },
            { roll: [15, 18], result: 'Target is unmoved by threats', type: 'normal' },
            { roll: [19, 20], result: 'Target complies reluctantly', type: 'success' }
        ]
    },
    intimidationEffects: {
        name: 'Intimidation Effects',
        description: 'Results of intimidating others',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Target becomes defiant and hostile', type: 'failure' },
            { roll: [4, 8], result: 'Target is unmoved by threats', type: 'normal' },
            { roll: [9, 14], result: 'Target complies reluctantly', type: 'success' },
            { roll: [15, 18], result: 'Target is frightened and cooperative', type: 'success' },
            { roll: [19, 20], result: 'Target is terrified, will do anything you ask', type: 'critical' }
        ]
    },
    intimidationAdvanced: {
        name: 'Advanced Intimidation',
        description: 'Trained intimidation techniques',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Target resists, no effect', type: 'failure' },
            { roll: [3, 7], result: 'Target complies reluctantly', type: 'normal' },
            { roll: [8, 13], result: 'Target is frightened and cooperative', type: 'success' },
            { roll: [14, 17], result: 'Target is terrified, will do anything you ask', type: 'success' },
            { roll: [18, 19], result: 'Target paralyzed with fear, becomes servant', type: 'critical' },
            { roll: [20, 20], result: 'Target broken, permanent loyalty through fear', type: 'critical' }
        ]
    },
    intimidationExpert: {
        name: 'Expert Intimidation',
        description: 'Apprentice-level intimidation mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Target nervous but complies', type: 'failure' },
            { roll: [2, 6], result: 'Target is frightened and cooperative', type: 'normal' },
            { roll: [7, 12], result: 'Target is terrified, will do anything you ask', type: 'success' },
            { roll: [13, 16], result: 'Target paralyzed with fear, becomes servant', type: 'success' },
            { roll: [17, 19], result: 'Target broken, permanent loyalty through fear', type: 'critical' },
            { roll: [20, 20], result: 'Target\'s will shattered, mindless obedience', type: 'critical' }
        ]
    },
    intimidationMaster: {
        name: 'Master Intimidation',
        description: 'Adept-level supreme intimidation',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Target frightened, fully cooperative', type: 'failure' },
            { roll: [2, 5], result: 'Target is terrified, will do anything you ask', type: 'normal' },
            { roll: [6, 11], result: 'Target paralyzed with fear, becomes servant', type: 'success' },
            { roll: [12, 15], result: 'Target broken, permanent loyalty through fear', type: 'success' },
            { roll: [16, 18], result: 'Target\'s will shattered, mindless obedience', type: 'critical' },
            { roll: [19, 20], result: 'Target\'s soul crushed, spreads fear to others nearby', type: 'critical' }
        ]
    },
    intimidationGrandmaster: {
        name: 'Grandmaster Intimidation',
        description: 'Expert-level legendary intimidation',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Target terrified, complete obedience', type: 'failure' },
            { roll: [2, 4], result: 'Target paralyzed with fear, becomes servant', type: 'normal' },
            { roll: [5, 9], result: 'Target broken, permanent loyalty through fear', type: 'success' },
            { roll: [10, 14], result: 'Target\'s will shattered, mindless obedience', type: 'success' },
            { roll: [15, 17], result: 'Target\'s soul crushed, spreads fear to others nearby', type: 'critical' },
            { roll: [18, 20], result: 'Legendary terror, entire group submits + reputation spreads', type: 'critical' }
        ]
    },
    intimidationLegendary: {
        name: 'Legendary Intimidation',
        description: 'Master-level ultimate intimidation',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_warcry.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Target paralyzed, servant status', type: 'failure' },
            { roll: [2, 3], result: 'Target broken, permanent loyalty through fear', type: 'normal' },
            { roll: [4, 8], result: 'Target\'s will shattered, mindless obedience', type: 'success' },
            { roll: [9, 13], result: 'Target\'s soul crushed, spreads fear to others nearby', type: 'success' },
            { roll: [14, 16], result: 'Legendary terror, entire group submits + reputation spreads', type: 'critical' },
            { roll: [17, 19], result: 'Mythic fear, enemies flee on sight + allies empowered', type: 'critical' },
            { roll: [20, 20], result: 'Absolute terror, your name becomes curse + instant submission from all', type: 'critical' }
        ]
    },

    // Medicine Tables - Evolving by rank
    medicineBasic: {
        name: 'Crude Medicine',
        description: 'Untrained medical treatment',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Treatment catastrophic, patient loses 2d6 HP', type: 'failure' },
            { roll: [9, 14], result: 'Treatment harmful, patient loses 1d4 HP', type: 'failure' },
            { roll: [15, 18], result: 'Basic treatment, stabilize but no healing', type: 'normal' },
            { roll: [19, 20], result: 'Successful treatment, heal 1d6 HP', type: 'success' }
        ]
    },
    medicineResults: {
        name: 'Medical Treatment',
        description: 'Results of treating wounds and illnesses',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Treatment fails, patient worsens (lose 1d4 HP)', type: 'failure' },
            { roll: [4, 8], result: 'Basic treatment, stabilize but no healing', type: 'normal' },
            { roll: [9, 14], result: 'Successful treatment, heal 1d6 HP', type: 'success' },
            { roll: [15, 18], result: 'Excellent care, heal 2d6 HP', type: 'success' },
            { roll: [19, 20], result: 'Miraculous recovery, heal 3d6 HP + remove one condition', type: 'critical' }
        ]
    },
    medicineAdvanced: {
        name: 'Advanced Medicine',
        description: 'Trained medical techniques',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Treatment ineffective, no change', type: 'failure' },
            { roll: [3, 7], result: 'Successful treatment, heal 1d6 HP', type: 'normal' },
            { roll: [8, 13], result: 'Excellent care, heal 2d6 HP', type: 'success' },
            { roll: [14, 17], result: 'Miraculous recovery, heal 3d6 HP + remove one condition', type: 'success' },
            { roll: [18, 19], result: 'Perfect healing, heal 4d6 HP + remove two conditions', type: 'critical' },
            { roll: [20, 20], result: 'Legendary care, full HP + remove all conditions + immunity 1 day', type: 'critical' }
        ]
    },
    medicineExpert: {
        name: 'Expert Medicine',
        description: 'Apprentice-level medical mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Basic healing, heal 1d6 HP', type: 'failure' },
            { roll: [2, 6], result: 'Excellent care, heal 2d6 HP', type: 'normal' },
            { roll: [7, 12], result: 'Miraculous recovery, heal 3d6 HP + remove one condition', type: 'success' },
            { roll: [13, 16], result: 'Perfect healing, heal 4d6 HP + remove two conditions', type: 'success' },
            { roll: [17, 19], result: 'Legendary care, full HP + remove all conditions + immunity 1 day', type: 'critical' },
            { roll: [20, 20], result: 'Mythic healing, full HP + permanent +1 CON + regeneration', type: 'critical' }
        ]
    },
    medicineMaster: {
        name: 'Master Medicine',
        description: 'Adept-level supreme medical knowledge',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Good healing, heal 2d6 HP', type: 'failure' },
            { roll: [2, 5], result: 'Miraculous recovery, heal 3d6 HP + remove one condition', type: 'normal' },
            { roll: [6, 11], result: 'Perfect healing, heal 4d6 HP + remove two conditions', type: 'success' },
            { roll: [12, 15], result: 'Legendary care, full HP + remove all conditions + immunity 1 day', type: 'success' },
            { roll: [16, 18], result: 'Mythic healing, full HP + permanent +1 CON + regeneration', type: 'critical' },
            { roll: [19, 20], result: 'Divine medicine, full HP + permanent +2 CON + cure disease/poison permanently', type: 'critical' }
        ]
    },
    medicineGrandmaster: {
        name: 'Grandmaster Medicine',
        description: 'Expert-level legendary medical knowledge',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Excellent healing, heal 3d6 HP', type: 'failure' },
            { roll: [2, 4], result: 'Perfect healing, heal 4d6 HP + remove two conditions', type: 'normal' },
            { roll: [5, 9], result: 'Legendary care, full HP + remove all conditions + immunity 1 day', type: 'success' },
            { roll: [10, 14], result: 'Mythic healing, full HP + permanent +1 CON + regeneration', type: 'success' },
            { roll: [15, 17], result: 'Divine medicine, full HP + permanent +2 CON + cure disease/poison permanently', type: 'critical' },
            { roll: [18, 20], result: 'Ultimate healing, full HP + permanent +3 CON + restore lost limbs', type: 'critical' }
        ]
    },
    medicineLegendary: {
        name: 'Legendary Medicine',
        description: 'Master-level ultimate medical knowledge',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Perfect healing, heal 4d6 HP + conditions removed', type: 'failure' },
            { roll: [2, 3], result: 'Legendary care, full HP + remove all conditions + immunity 1 day', type: 'normal' },
            { roll: [4, 8], result: 'Mythic healing, full HP + permanent +1 CON + regeneration', type: 'success' },
            { roll: [9, 13], result: 'Divine medicine, full HP + permanent +2 CON + cure disease/poison permanently', type: 'success' },
            { roll: [14, 16], result: 'Ultimate healing, full HP + permanent +3 CON + restore lost limbs', type: 'critical' },
            { roll: [17, 19], result: 'Cosmic medicine, full HP + permanent +4 CON + reverse aging + immunity to disease', type: 'critical' },
            { roll: [20, 20], result: 'Absolute healing, full HP + permanent +5 CON + resurrect recently dead + grant immortality', type: 'critical' }
        ]
    },

    // Nature Tables - Evolving by rank
    natureBasic: {
        name: 'Basic Nature',
        description: 'Untrained nature identification',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Fatal misidentification, eat poison', type: 'failure' },
            { roll: [9, 14], result: 'Complete confusion, no knowledge', type: 'failure' },
            { roll: [15, 18], result: 'Basic identification, common knowledge', type: 'normal' },
            { roll: [19, 20], result: 'Correct identification with useful details', type: 'success' }
        ]
    },
    natureKnowledge: {
        name: 'Nature Knowledge',
        description: 'Results of identifying natural phenomena',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Misidentify plant/animal, dangerous mistake', type: 'failure' },
            { roll: [4, 8], result: 'Basic identification, common knowledge', type: 'normal' },
            { roll: [9, 14], result: 'Correct identification with useful details', type: 'success' },
            { roll: [15, 18], result: 'Detailed knowledge including medicinal uses', type: 'success' },
            { roll: [19, 20], result: 'Expert knowledge, discover rare property', type: 'critical' }
        ]
    },
    natureAdvanced: {
        name: 'Advanced Nature',
        description: 'Trained nature knowledge',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Partial identification, minor details wrong', type: 'failure' },
            { roll: [3, 7], result: 'Correct identification with useful details', type: 'normal' },
            { roll: [8, 13], result: 'Detailed knowledge including medicinal uses', type: 'success' },
            { roll: [14, 17], result: 'Expert knowledge, discover rare property', type: 'success' },
            { roll: [18, 19], result: 'Master knowledge, find hidden uses + create remedy', type: 'critical' },
            { roll: [20, 20], result: 'Perfect understanding, commune with nature + gain permanent bonus', type: 'critical' }
        ]
    },
    natureExpert: {
        name: 'Expert Nature',
        description: 'Apprentice-level nature mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Good identification, most uses known', type: 'failure' },
            { roll: [2, 6], result: 'Detailed knowledge including medicinal uses', type: 'normal' },
            { roll: [7, 12], result: 'Expert knowledge, discover rare property', type: 'success' },
            { roll: [13, 16], result: 'Master knowledge, find hidden uses + create remedy', type: 'success' },
            { roll: [17, 19], result: 'Perfect understanding, commune with nature + gain permanent bonus', type: 'critical' },
            { roll: [20, 20], result: 'Legendary insight, control plants/animals + create new species', type: 'critical' }
        ]
    },
    natureMaster: {
        name: 'Master Nature',
        description: 'Adept-level supreme nature knowledge',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Detailed knowledge, all uses known', type: 'failure' },
            { roll: [2, 5], result: 'Expert knowledge, discover rare property', type: 'normal' },
            { roll: [6, 11], result: 'Master knowledge, find hidden uses + create remedy', type: 'success' },
            { roll: [12, 15], result: 'Perfect understanding, commune with nature + gain permanent bonus', type: 'success' },
            { roll: [16, 18], result: 'Legendary insight, control plants/animals + create new species', type: 'critical' },
            { roll: [19, 20], result: 'Mythic connection, become one with nature + shapeshift freely', type: 'critical' }
        ]
    },
    natureGrandmaster: {
        name: 'Grandmaster Nature',
        description: 'Expert-level legendary nature knowledge',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Expert knowledge, rare properties found', type: 'failure' },
            { roll: [2, 4], result: 'Master knowledge, find hidden uses + create remedy', type: 'normal' },
            { roll: [5, 9], result: 'Perfect understanding, commune with nature + gain permanent bonus', type: 'success' },
            { roll: [10, 14], result: 'Legendary insight, control plants/animals + create new species', type: 'success' },
            { roll: [15, 17], result: 'Mythic connection, become one with nature + shapeshift freely', type: 'critical' },
            { roll: [18, 20], result: 'Divine harmony, command all nature + weather control', type: 'critical' }
        ]
    },
    natureLegendary: {
        name: 'Legendary Nature',
        description: 'Master-level ultimate nature knowledge',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_naturetouchgrow.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Master knowledge, all uses discovered', type: 'failure' },
            { roll: [2, 3], result: 'Perfect understanding, commune with nature + gain permanent bonus', type: 'normal' },
            { roll: [4, 8], result: 'Legendary insight, control plants/animals + create new species', type: 'success' },
            { roll: [9, 13], result: 'Mythic connection, become one with nature + shapeshift freely', type: 'success' },
            { roll: [14, 16], result: 'Divine harmony, command all nature + weather control', type: 'critical' },
            { roll: [17, 19], result: 'Cosmic unity, reshape ecosystems + create life', type: 'critical' },
            { roll: [20, 20], result: 'Absolute oneness, become avatar of nature + control all living things', type: 'critical' }
        ]
    },

    // Perception Tables - Evolving by rank
    perceptionBasic: {
        name: 'Basic Perception',
        description: 'Untrained perception',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Completely oblivious, walk into trap', type: 'failure' },
            { roll: [9, 14], result: 'Miss everything important', type: 'failure' },
            { roll: [15, 18], result: 'Notice only obvious things', type: 'normal' },
            { roll: [19, 20], result: 'Spot hidden details and clues', type: 'success' }
        ]
    },
    perceptionFinds: {
        name: 'Perception Finds',
        description: 'Results of searching and noticing things',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Miss obvious details, overlook danger', type: 'failure' },
            { roll: [4, 8], result: 'Notice only obvious things', type: 'normal' },
            { roll: [9, 14], result: 'Spot hidden details and clues', type: 'success' },
            { roll: [15, 18], result: 'Notice everything, including secret doors', type: 'success' },
            { roll: [19, 20], result: 'Perfect awareness, sense invisible threats', type: 'critical' }
        ]
    },
    perceptionAdvanced: {
        name: 'Advanced Perception',
        description: 'Trained perception',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Distracted, miss some details', type: 'failure' },
            { roll: [3, 7], result: 'Spot hidden details and clues', type: 'normal' },
            { roll: [8, 13], result: 'Notice everything, including secret doors', type: 'success' },
            { roll: [14, 17], result: 'Perfect awareness, sense invisible threats', type: 'success' },
            { roll: [18, 19], result: 'Supernatural senses, see through illusions + detect magic', type: 'critical' },
            { roll: [20, 20], result: 'Legendary awareness, see the future + sense all nearby', type: 'critical' }
        ]
    },
    perceptionExpert: {
        name: 'Expert Perception',
        description: 'Apprentice-level perception mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Good awareness, most things noticed', type: 'failure' },
            { roll: [2, 6], result: 'Notice everything, including secret doors', type: 'normal' },
            { roll: [7, 12], result: 'Perfect awareness, sense invisible threats', type: 'success' },
            { roll: [13, 16], result: 'Supernatural senses, see through illusions + detect magic', type: 'success' },
            { roll: [17, 19], result: 'Legendary awareness, see the future + sense all nearby', type: 'critical' },
            { roll: [20, 20], result: 'Mythic perception, see through walls + read thoughts', type: 'critical' }
        ]
    },
    perceptionMaster: {
        name: 'Master Perception',
        description: 'Adept-level supreme perception',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Perfect awareness, all visible threats sensed', type: 'failure' },
            { roll: [2, 5], result: 'Perfect awareness, sense invisible threats', type: 'normal' },
            { roll: [6, 11], result: 'Supernatural senses, see through illusions + detect magic', type: 'success' },
            { roll: [12, 15], result: 'Legendary awareness, see the future + sense all nearby', type: 'success' },
            { roll: [16, 18], result: 'Mythic perception, see through walls + read thoughts', type: 'critical' },
            { roll: [19, 20], result: 'Divine sight, see across planes + know all secrets', type: 'critical' }
        ]
    },
    perceptionGrandmaster: {
        name: 'Grandmaster Perception',
        description: 'Expert-level legendary perception',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Supernatural senses, illusions pierced', type: 'failure' },
            { roll: [2, 4], result: 'Supernatural senses, see through illusions + detect magic', type: 'normal' },
            { roll: [5, 9], result: 'Legendary awareness, see the future + sense all nearby', type: 'success' },
            { roll: [10, 14], result: 'Mythic perception, see through walls + read thoughts', type: 'success' },
            { roll: [15, 17], result: 'Divine sight, see across planes + know all secrets', type: 'critical' },
            { roll: [18, 20], result: 'Ultimate awareness, see all timelines + omniscient in area', type: 'critical' }
        ]
    },
    perceptionLegendary: {
        name: 'Legendary Perception',
        description: 'Master-level ultimate perception',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_farsight.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Legendary awareness, future glimpsed', type: 'failure' },
            { roll: [2, 3], result: 'Legendary awareness, see the future + sense all nearby', type: 'normal' },
            { roll: [4, 8], result: 'Mythic perception, see through walls + read thoughts', type: 'success' },
            { roll: [9, 13], result: 'Divine sight, see across planes + know all secrets', type: 'success' },
            { roll: [14, 16], result: 'Ultimate awareness, see all timelines + omniscient in area', type: 'critical' },
            { roll: [17, 19], result: 'Cosmic perception, see entire universe + know all that is', type: 'critical' },
            { roll: [20, 20], result: 'Absolute omniscience, see all that was, is, and will be + perfect knowledge', type: 'critical' }
        ]
    },

    // Performance Tables - Evolving by rank
    performanceBasic: {
        name: 'Crude Performance',
        description: 'Untrained performance',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Catastrophic performance, riot breaks out', type: 'failure' },
            { roll: [9, 14], result: 'Awful performance, audience leaves', type: 'failure' },
            { roll: [15, 18], result: 'Mediocre performance, polite applause', type: 'normal' },
            { roll: [19, 20], result: 'Good performance, audience is entertained', type: 'success' }
        ]
    },
    performanceOutcomes: {
        name: 'Performance Outcomes',
        description: 'Results of entertaining an audience',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Terrible performance, audience boos and throws things', type: 'failure' },
            { roll: [4, 8], result: 'Mediocre performance, polite applause', type: 'normal' },
            { roll: [9, 14], result: 'Good performance, audience is entertained', type: 'success' },
            { roll: [15, 18], result: 'Excellent performance, standing ovation', type: 'success' },
            { roll: [19, 20], result: 'Legendary performance, audience is moved to tears', type: 'critical' }
        ]
    },
    performanceAdvanced: {
        name: 'Advanced Performance',
        description: 'Trained performance',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Boring performance, audience distracted', type: 'failure' },
            { roll: [3, 7], result: 'Good performance, audience is entertained', type: 'normal' },
            { roll: [8, 13], result: 'Excellent performance, standing ovation', type: 'success' },
            { roll: [14, 17], result: 'Legendary performance, audience is moved to tears', type: 'success' },
            { roll: [18, 19], result: 'Masterful performance, audience inspired + gain fame', type: 'critical' },
            { roll: [20, 20], result: 'Perfect performance, audience transformed + permanent fans', type: 'critical' }
        ]
    },
    performanceExpert: {
        name: 'Expert Performance',
        description: 'Apprentice-level performance mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Good performance, well received', type: 'failure' },
            { roll: [2, 6], result: 'Excellent performance, standing ovation', type: 'normal' },
            { roll: [7, 12], result: 'Legendary performance, audience is moved to tears', type: 'success' },
            { roll: [13, 16], result: 'Masterful performance, audience inspired + gain fame', type: 'success' },
            { roll: [17, 19], result: 'Perfect performance, audience transformed + permanent fans', type: 'critical' },
            { roll: [20, 20], result: 'Mythic performance, audience enlightened + magical effects', type: 'critical' }
        ]
    },
    performanceMaster: {
        name: 'Master Performance',
        description: 'Adept-level supreme performance',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Excellent performance, standing ovation', type: 'failure' },
            { roll: [2, 5], result: 'Legendary performance, audience is moved to tears', type: 'normal' },
            { roll: [6, 11], result: 'Masterful performance, audience inspired + gain fame', type: 'success' },
            { roll: [12, 15], result: 'Perfect performance, audience transformed + permanent fans', type: 'success' },
            { roll: [16, 18], result: 'Mythic performance, audience enlightened + magical effects', type: 'critical' },
            { roll: [19, 20], result: 'Divine performance, audience blessed + heal all + spread legend', type: 'critical' }
        ]
    },
    performanceGrandmaster: {
        name: 'Grandmaster Performance',
        description: 'Expert-level legendary performance',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Legendary performance, deeply moving', type: 'failure' },
            { roll: [2, 4], result: 'Masterful performance, audience inspired + gain fame', type: 'normal' },
            { roll: [5, 9], result: 'Perfect performance, audience transformed + permanent fans', type: 'success' },
            { roll: [10, 14], result: 'Mythic performance, audience enlightened + magical effects', type: 'success' },
            { roll: [15, 17], result: 'Divine performance, audience blessed + heal all + spread legend', type: 'critical' },
            { roll: [18, 20], result: 'Ultimate performance, audience ascended + become immortal legend', type: 'critical' }
        ]
    },
    performanceLegendary: {
        name: 'Legendary Performance',
        description: 'Master-level ultimate performance',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_drum_01.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Masterful performance, fame spreads', type: 'failure' },
            { roll: [2, 3], result: 'Perfect performance, audience transformed + permanent fans', type: 'normal' },
            { roll: [4, 8], result: 'Mythic performance, audience enlightened + magical effects', type: 'success' },
            { roll: [9, 13], result: 'Divine performance, audience blessed + heal all + spread legend', type: 'success' },
            { roll: [14, 16], result: 'Ultimate performance, audience ascended + become immortal legend', type: 'critical' },
            { roll: [17, 19], result: 'Cosmic performance, reality altered + your art becomes law', type: 'critical' },
            { roll: [20, 20], result: 'Absolute performance, become deity of art + all who hear worship you', type: 'critical' }
        ]
    },

    // Religion Tables - Evolving by rank
    religionBasic: {
        name: 'Basic Religion',
        description: 'Untrained religious knowledge',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Terrible blasphemy, deity curses you', type: 'failure' },
            { roll: [9, 14], result: 'Offensive mistake, lose favor', type: 'failure' },
            { roll: [15, 18], result: 'Basic religious knowledge', type: 'normal' },
            { roll: [19, 20], result: 'Detailed understanding of rituals and beliefs', type: 'success' }
        ]
    },
    religiousKnowledge: {
        name: 'Religious Knowledge',
        description: 'Results of recalling religious information',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Blasphemous mistake, offend deity', type: 'failure' },
            { roll: [4, 8], result: 'Basic religious knowledge', type: 'normal' },
            { roll: [9, 14], result: 'Detailed understanding of rituals and beliefs', type: 'success' },
            { roll: [15, 18], result: 'Deep theological knowledge', type: 'success' },
            { roll: [19, 20], result: 'Divine revelation, gain temporary blessing', type: 'critical' }
        ]
    },
    religionAdvanced: {
        name: 'Advanced Religion',
        description: 'Trained religious knowledge',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Minor error, slight displeasure', type: 'failure' },
            { roll: [3, 7], result: 'Detailed understanding of rituals and beliefs', type: 'normal' },
            { roll: [8, 13], result: 'Deep theological knowledge', type: 'success' },
            { roll: [14, 17], result: 'Divine revelation, gain temporary blessing', type: 'success' },
            { roll: [18, 19], result: 'Sacred wisdom, gain permanent blessing', type: 'critical' },
            { roll: [20, 20], result: 'Divine communion, speak with deity + gain power', type: 'critical' }
        ]
    },
    religionExpert: {
        name: 'Expert Religion',
        description: 'Apprentice-level religious mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Good knowledge, minor insight', type: 'failure' },
            { roll: [2, 6], result: 'Deep theological knowledge', type: 'normal' },
            { roll: [7, 12], result: 'Divine revelation, gain temporary blessing', type: 'success' },
            { roll: [13, 16], result: 'Sacred wisdom, gain permanent blessing', type: 'success' },
            { roll: [17, 19], result: 'Divine communion, speak with deity + gain power', type: 'critical' },
            { roll: [20, 20], result: 'Holy enlightenment, become chosen + divine abilities', type: 'critical' }
        ]
    },
    religionMaster: {
        name: 'Master Religion',
        description: 'Adept-level supreme religious knowledge',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Deep knowledge, clear understanding', type: 'failure' },
            { roll: [2, 5], result: 'Divine revelation, gain temporary blessing', type: 'normal' },
            { roll: [6, 11], result: 'Sacred wisdom, gain permanent blessing', type: 'success' },
            { roll: [12, 15], result: 'Divine communion, speak with deity + gain power', type: 'success' },
            { roll: [16, 18], result: 'Holy enlightenment, become chosen + divine abilities', type: 'critical' },
            { roll: [19, 20], result: 'Mythic faith, channel deity + perform miracles', type: 'critical' }
        ]
    },
    religionGrandmaster: {
        name: 'Grandmaster Religion',
        description: 'Expert-level legendary religious knowledge',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Divine revelation, blessed', type: 'failure' },
            { roll: [2, 4], result: 'Sacred wisdom, gain permanent blessing', type: 'normal' },
            { roll: [5, 9], result: 'Divine communion, speak with deity + gain power', type: 'success' },
            { roll: [10, 14], result: 'Holy enlightenment, become chosen + divine abilities', type: 'success' },
            { roll: [15, 17], result: 'Mythic faith, channel deity + perform miracles', type: 'critical' },
            { roll: [18, 20], result: 'Divine avatar, embody deity + reshape faith', type: 'critical' }
        ]
    },
    religionLegendary: {
        name: 'Legendary Religion',
        description: 'Master-level ultimate religious knowledge',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_powerwordshield.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Sacred wisdom, permanent blessing', type: 'failure' },
            { roll: [2, 3], result: 'Divine communion, speak with deity + gain power', type: 'normal' },
            { roll: [4, 8], result: 'Holy enlightenment, become chosen + divine abilities', type: 'success' },
            { roll: [9, 13], result: 'Mythic faith, channel deity + perform miracles', type: 'success' },
            { roll: [14, 16], result: 'Divine avatar, embody deity + reshape faith', type: 'critical' },
            { roll: [17, 19], result: 'Cosmic prophet, create new religion + grant divine powers', type: 'critical' },
            { roll: [20, 20], result: 'Absolute divinity, become deity yourself + ascend to godhood', type: 'critical' }
        ]
    },

    // Sleight of Hand Tables - Evolving by rank
    sleightOfHandBasic: {
        name: 'Crude Sleight of Hand',
        description: 'Untrained manual trickery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Catastrophic fumble, injure yourself + caught', type: 'failure' },
            { roll: [9, 14], result: 'Obvious attempt, immediately caught', type: 'failure' },
            { roll: [15, 18], result: 'Clumsy attempt, observers are suspicious', type: 'normal' },
            { roll: [19, 20], result: 'Smooth execution, trick succeeds', type: 'success' }
        ]
    },
    sleightOfHandTricks: {
        name: 'Sleight of Hand Tricks',
        description: 'Results of manual dexterity and trickery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Fumble badly, drop everything and get caught', type: 'failure' },
            { roll: [4, 8], result: 'Clumsy attempt, observers are suspicious', type: 'normal' },
            { roll: [9, 14], result: 'Smooth execution, trick succeeds', type: 'success' },
            { roll: [15, 18], result: 'Flawless technique, no one notices', type: 'success' },
            { roll: [19, 20], result: 'Impossible feat, steal something valuable undetected', type: 'critical' }
        ]
    },
    sleightOfHandAdvanced: {
        name: 'Advanced Sleight of Hand',
        description: 'Trained manual trickery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Slight slip, observers notice something', type: 'failure' },
            { roll: [3, 7], result: 'Smooth execution, trick succeeds', type: 'normal' },
            { roll: [8, 13], result: 'Flawless technique, no one notices', type: 'success' },
            { roll: [14, 17], result: 'Impossible feat, steal something valuable undetected', type: 'success' },
            { roll: [18, 19], result: 'Masterful trick, steal from multiple targets', type: 'critical' },
            { roll: [20, 20], result: 'Legendary legerdemain, make object vanish + reappear elsewhere', type: 'critical' }
        ]
    },
    sleightOfHandExpert: {
        name: 'Expert Sleight of Hand',
        description: 'Apprentice-level manual mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Good execution, minor tell', type: 'failure' },
            { roll: [2, 6], result: 'Flawless technique, no one notices', type: 'normal' },
            { roll: [7, 12], result: 'Impossible feat, steal something valuable undetected', type: 'success' },
            { roll: [13, 16], result: 'Masterful trick, steal from multiple targets', type: 'success' },
            { roll: [17, 19], result: 'Legendary legerdemain, make object vanish + reappear elsewhere', type: 'critical' },
            { roll: [20, 20], result: 'Mythic dexterity, steal equipped items + plant evidence', type: 'critical' }
        ]
    },
    sleightOfHandMaster: {
        name: 'Master Sleight of Hand',
        description: 'Adept-level supreme manual skill',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Flawless execution, unnoticed', type: 'failure' },
            { roll: [2, 5], result: 'Impossible feat, steal something valuable undetected', type: 'normal' },
            { roll: [6, 11], result: 'Masterful trick, steal from multiple targets', type: 'success' },
            { roll: [12, 15], result: 'Legendary legerdemain, make object vanish + reappear elsewhere', type: 'success' },
            { roll: [16, 18], result: 'Mythic dexterity, steal equipped items + plant evidence', type: 'critical' },
            { roll: [19, 20], result: 'Divine fingers, steal abstract concepts + memories', type: 'critical' }
        ]
    },
    sleightOfHandGrandmaster: {
        name: 'Grandmaster Sleight of Hand',
        description: 'Expert-level legendary manual skill',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Impossible feat, valuable item stolen', type: 'failure' },
            { roll: [2, 4], result: 'Masterful trick, steal from multiple targets', type: 'normal' },
            { roll: [5, 9], result: 'Legendary legerdemain, make object vanish + reappear elsewhere', type: 'success' },
            { roll: [10, 14], result: 'Mythic dexterity, steal equipped items + plant evidence', type: 'success' },
            { roll: [15, 17], result: 'Divine fingers, steal abstract concepts + memories', type: 'critical' },
            { roll: [18, 20], result: 'Ultimate trickery, steal souls + swap identities', type: 'critical' }
        ]
    },
    sleightOfHandLegendary: {
        name: 'Legendary Sleight of Hand',
        description: 'Master-level ultimate manual skill',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_10.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Masterful trick, multiple targets', type: 'failure' },
            { roll: [2, 3], result: 'Legendary legerdemain, make object vanish + reappear elsewhere', type: 'normal' },
            { roll: [4, 8], result: 'Mythic dexterity, steal equipped items + plant evidence', type: 'success' },
            { roll: [9, 13], result: 'Divine fingers, steal abstract concepts + memories', type: 'success' },
            { roll: [14, 16], result: 'Ultimate trickery, steal souls + swap identities', type: 'critical' },
            { roll: [17, 19], result: 'Cosmic sleight, steal fate + rewrite destiny', type: 'critical' },
            { roll: [20, 20], result: 'Absolute mastery, steal reality itself + reshape existence', type: 'critical' }
        ]
    },

    // Stealth Tables - Evolving by rank
    stealthBasic: {
        name: 'Crude Stealth',
        description: 'Untrained stealth attempts',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Catastrophic noise, alert entire area', type: 'failure' },
            { roll: [9, 14], result: 'Loud stumbling, immediately detected', type: 'failure' },
            { roll: [15, 18], result: 'Partially hidden, enemies are alert', type: 'normal' },
            { roll: [19, 20], result: 'Successfully hidden, enemies unaware', type: 'success' }
        ]
    },
    stealthOutcomes: {
        name: 'Stealth Outcomes',
        description: 'Results of sneaking and hiding',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Make loud noise, immediately detected', type: 'failure' },
            { roll: [4, 8], result: 'Partially hidden, enemies are alert', type: 'normal' },
            { roll: [9, 14], result: 'Successfully hidden, enemies unaware', type: 'success' },
            { roll: [15, 18], result: 'Perfectly concealed, can move freely', type: 'success' },
            { roll: [19, 20], result: 'Become invisible, gain surprise attack advantage', type: 'critical' }
        ]
    },
    stealthAdvanced: {
        name: 'Advanced Stealth',
        description: 'Trained stealth techniques',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Minor sound, enemies investigate', type: 'failure' },
            { roll: [3, 7], result: 'Successfully hidden, enemies unaware', type: 'normal' },
            { roll: [8, 13], result: 'Perfectly concealed, can move freely', type: 'success' },
            { roll: [14, 17], result: 'Become invisible, gain surprise attack advantage', type: 'success' },
            { roll: [18, 19], result: 'Shadow form, pass through enemies undetected', type: 'critical' },
            { roll: [20, 20], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'critical' }
        ]
    },
    stealthExpert: {
        name: 'Expert Stealth',
        description: 'Apprentice-level stealth mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Well hidden, slight movement noticed', type: 'failure' },
            { roll: [2, 6], result: 'Perfectly concealed, can move freely', type: 'normal' },
            { roll: [7, 12], result: 'Become invisible, gain surprise attack advantage', type: 'success' },
            { roll: [13, 16], result: 'Shadow form, pass through enemies undetected', type: 'success' },
            { roll: [17, 19], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'critical' },
            { roll: [20, 20], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'critical' }
        ]
    },
    stealthMaster: {
        name: 'Master Stealth',
        description: 'Adept-level supreme stealth',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Perfectly concealed, free movement', type: 'failure' },
            { roll: [2, 5], result: 'Become invisible, gain surprise attack advantage', type: 'normal' },
            { roll: [6, 11], result: 'Shadow form, pass through enemies undetected', type: 'success' },
            { roll: [12, 15], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'success' },
            { roll: [16, 18], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'critical' },
            { roll: [19, 20], result: 'Divine concealment, erase your existence from memory', type: 'critical' }
        ]
    },
    stealthGrandmaster: {
        name: 'Grandmaster Stealth',
        description: 'Expert-level legendary stealth',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Invisible, surprise advantage', type: 'failure' },
            { roll: [2, 4], result: 'Shadow form, pass through enemies undetected', type: 'normal' },
            { roll: [5, 9], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'success' },
            { roll: [10, 14], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'success' },
            { roll: [15, 17], result: 'Divine concealment, erase your existence from memory', type: 'critical' },
            { roll: [18, 20], result: 'Ultimate stealth, become undetectable by all means + instant kill', type: 'critical' }
        ]
    },
    stealthLegendary: {
        name: 'Legendary Stealth',
        description: 'Master-level ultimate stealth',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_stealth.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Shadow form, undetected passage', type: 'failure' },
            { roll: [2, 3], result: 'Perfect invisibility, leave no trace + gain 1 AP', type: 'normal' },
            { roll: [4, 8], result: 'Mythic stealth, phase through walls + teleport short distance', type: 'success' },
            { roll: [9, 13], result: 'Divine concealment, erase your existence from memory', type: 'success' },
            { roll: [14, 16], result: 'Ultimate stealth, become undetectable by all means + instant kill', type: 'critical' },
            { roll: [17, 19], result: 'Cosmic shadow, exist in multiple places + strike from nowhere', type: 'critical' },
            { roll: [20, 20], result: 'Absolute void, cease to exist until you choose + omnipresent strikes', type: 'critical' }
        ]
    },

    // Survival Tables - Evolving by rank
    survivalBasic: {
        name: 'Crude Survival',
        description: 'Untrained survival attempts',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 8], result: 'Catastrophic failure, eat deadly poison (2d6 damage)', type: 'failure' },
            { roll: [9, 14], result: 'Hopelessly lost, starving', type: 'failure' },
            { roll: [15, 18], result: 'Barely survive, find minimal food/water', type: 'normal' },
            { roll: [19, 20], result: 'Survive comfortably, find adequate resources', type: 'success' }
        ]
    },
    survivalSkills: {
        name: 'Survival Skills',
        description: 'Results of wilderness survival attempts',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 3], result: 'Get lost, consume poisonous food (1d6 damage)', type: 'failure' },
            { roll: [4, 8], result: 'Barely survive, find minimal food/water', type: 'normal' },
            { roll: [9, 14], result: 'Survive comfortably, find adequate resources', type: 'success' },
            { roll: [15, 18], result: 'Thrive in wilderness, find abundant resources', type: 'success' },
            { roll: [19, 20], result: 'Master the wild, discover rare resources and safe haven', type: 'critical' }
        ]
    },
    survivalAdvanced: {
        name: 'Advanced Survival',
        description: 'Trained survival techniques',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Slight discomfort, adequate resources', type: 'failure' },
            { roll: [3, 7], result: 'Survive comfortably, find adequate resources', type: 'normal' },
            { roll: [8, 13], result: 'Thrive in wilderness, find abundant resources', type: 'success' },
            { roll: [14, 17], result: 'Master the wild, discover rare resources and safe haven', type: 'success' },
            { roll: [18, 19], result: 'Perfect harmony, find legendary resources + animal allies', type: 'critical' },
            { roll: [20, 20], result: 'Wilderness mastery, create permanent shelter + endless food', type: 'critical' }
        ]
    },
    survivalExpert: {
        name: 'Expert Survival',
        description: 'Apprentice-level survival mastery',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Comfortable survival, good resources', type: 'failure' },
            { roll: [2, 6], result: 'Thrive in wilderness, find abundant resources', type: 'normal' },
            { roll: [7, 12], result: 'Master the wild, discover rare resources and safe haven', type: 'success' },
            { roll: [13, 16], result: 'Perfect harmony, find legendary resources + animal allies', type: 'success' },
            { roll: [17, 19], result: 'Wilderness mastery, create permanent shelter + endless food', type: 'critical' },
            { roll: [20, 20], result: 'Mythic survival, terraform area + control weather', type: 'critical' }
        ]
    },
    survivalMaster: {
        name: 'Master Survival',
        description: 'Adept-level supreme survival',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 1], result: 'Thriving, abundant resources', type: 'failure' },
            { roll: [2, 5], result: 'Master the wild, discover rare resources and safe haven', type: 'normal' },
            { roll: [6, 11], result: 'Perfect harmony, find legendary resources + animal allies', type: 'success' },
            { roll: [12, 15], result: 'Wilderness mastery, create permanent shelter + endless food', type: 'success' },
            { roll: [16, 18], result: 'Mythic survival, terraform area + control weather', type: 'critical' },
            { roll: [19, 20], result: 'Divine wilderness, create paradise + immortal in nature', type: 'critical' }
        ]
    },
    survivalGrandmaster: {
        name: 'Grandmaster Survival',
        description: 'Expert-level legendary survival',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 1], result: 'Perfect harmony, legendary resources', type: 'failure' },
            { roll: [2, 4], result: 'Perfect harmony, find legendary resources + animal allies', type: 'normal' },
            { roll: [5, 9], result: 'Wilderness mastery, create permanent shelter + endless food', type: 'success' },
            { roll: [10, 14], result: 'Mythic survival, terraform area + control weather', type: 'success' },
            { roll: [15, 17], result: 'Divine wilderness, create paradise + immortal in nature', type: 'critical' },
            { roll: [18, 20], result: 'Ultimate survival, reshape entire biome + command all life', type: 'critical' }
        ]
    },
    survivalLegendary: {
        name: 'Legendary Survival',
        description: 'Master-level ultimate survival',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_pelt_wolf_01.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 1], result: 'Wilderness mastery, permanent shelter', type: 'failure' },
            { roll: [2, 3], result: 'Wilderness mastery, create permanent shelter + endless food', type: 'normal' },
            { roll: [4, 8], result: 'Mythic survival, terraform area + control weather', type: 'success' },
            { roll: [9, 13], result: 'Divine wilderness, create paradise + immortal in nature', type: 'success' },
            { roll: [14, 16], result: 'Ultimate survival, reshape entire biome + command all life', type: 'critical' },
            { roll: [17, 19], result: 'Cosmic harmony, create new world + perfect ecosystem', type: 'critical' },
            { roll: [20, 20], result: 'Absolute mastery, become nature itself + control all wilderness', type: 'critical' }
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
    },

    // Acrobatics Tables - Evolving by rank
    acrobaticsBasic: {
        name: 'Clumsy Tumbling',
        description: 'Untrained acrobatics - awkward movements and frequent stumbles',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'UNTRAINED',
        table: [
            { roll: [1, 5], result: 'Trip and fall prone, take 1d4 damage', type: 'failure' },
            { roll: [6, 10], result: 'Awkward movement, -2 to next action', type: 'failure' },
            { roll: [11, 16], result: 'Barely maintain footing', type: 'normal' },
            { roll: [17, 20], result: 'Lucky recovery, avoid falling', type: 'success' }
        ]
    },
    acrobaticsFeats: {
        name: 'Graceful Movement',
        description: 'Basic trained acrobatics - controlled falls and simple maneuvers',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'NOVICE',
        table: [
            { roll: [1, 2], result: 'Stumble, -1 to next roll', type: 'failure' },
            { roll: [3, 9], result: 'Standard movement, maintain balance', type: 'normal' },
            { roll: [10, 15], result: 'Smooth landing, reduce fall damage by half', type: 'success' },
            { roll: [16, 18], result: 'Cat-like reflexes, negate fall damage up to 20ft', type: 'success' },
            { roll: [19, 20], result: 'Perfect form, negate fall + advantage on next roll', type: 'critical' }
        ]
    },
    acrobaticsAdvanced: {
        name: 'Daring Maneuvers',
        description: 'Trained acrobatics - environmental navigation and combat evasion',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'TRAINED',
        table: [
            { roll: [1, 2], result: 'Minor slip, -1 Armor until next turn', type: 'failure' },
            { roll: [3, 8], result: 'Controlled movement through obstacles', type: 'normal' },
            { roll: [9, 14], result: 'Fluid evasion, +2 Armor until next turn', type: 'success' },
            { roll: [15, 17], result: 'Swing/vault, reposition up to 30ft', type: 'success' },
            { roll: [18, 19], result: 'Wall run, move vertically up to 20ft', type: 'critical' },
            { roll: [20, 20], result: 'Perfect dodge, auto-evade next attack', type: 'critical' }
        ]
    },
    acrobaticsExpert: {
        name: 'Parkour Mastery',
        description: 'Apprentice acrobatics - urban traversal and aerial control',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'APPRENTICE',
        table: [
            { roll: [1, 1], result: 'Misjudge distance, fall short', type: 'failure' },
            { roll: [2, 7], result: 'Navigate obstacles efficiently', type: 'normal' },
            { roll: [8, 13], result: 'Rooftop movement, ignore difficult terrain', type: 'success' },
            { roll: [14, 16], result: 'Precision dive, land in 5ft space from any height', type: 'success' },
            { roll: [17, 19], result: 'Weave through traps, ignore trap damage this turn', type: 'critical' },
            { roll: [20, 20], result: 'Contort through tight space + surprise attack', type: 'critical' }
        ]
    },
    acrobaticsMaster: {
        name: 'Adept Acrobatics',
        description: 'Adept acrobatics - impressive agility',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'ADEPT',
        table: [
            { roll: [1, 2], result: 'Overconfident, lose footing and fall prone', type: 'failure' },
            { roll: [3, 7], result: 'Graceful movement, move through tight spaces', type: 'normal' },
            { roll: [8, 13], result: 'Aerial control, perform complex flips mid-air', type: 'success' },
            { roll: [14, 17], result: 'Cat-like landing, take no fall damage up to 30ft', type: 'success' },
            { roll: [18, 19], result: 'Balance on narrow surfaces (rope, ledge, beam)', type: 'critical' },
            { roll: [20, 20], result: 'Incredible climb, scale difficult surfaces at full speed', type: 'critical' }
        ]
    },
    acrobaticsGrandmaster: {
        name: 'Expert Acrobatics',
        description: 'Expert acrobatics - masterful agility',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'EXPERT',
        table: [
            { roll: [1, 2], result: 'Stumble, lose balance momentarily', type: 'failure' },
            { roll: [3, 7], result: 'Expert flip, change direction mid-air', type: 'normal' },
            { roll: [8, 13], result: 'Parkour master, move through obstacles at full speed', type: 'success' },
            { roll: [14, 17], result: 'Wall run, move on vertical surfaces for 1 round', type: 'success' },
            { roll: [18, 19], result: 'Spinning strike, attack 2 adjacent enemies', type: 'critical' },
            { roll: [20, 20], result: 'Perfect dodge, gain advantage on next dodge roll', type: 'critical' }
        ]
    },
    acrobaticsLegendary: {
        name: 'Legendary Acrobatics',
        description: 'Master acrobatics - incredible feats of agility',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        requiredRank: 'MASTER',
        table: [
            { roll: [1, 2], result: 'Misjudged landing, take 1d4 damage', type: 'failure' },
            { roll: [3, 7], result: 'Incredible flip, move 30ft ignoring difficult terrain', type: 'normal' },
            { roll: [8, 13], result: 'Wall run, move along vertical surfaces for 1 turn', type: 'success' },
            { roll: [14, 17], result: 'Perfect dodge, gain +3 to dodge rolls this round', type: 'success' },
            { roll: [18, 19], result: 'Impossible leap, jump 3x normal distance', type: 'critical' },
            { roll: [20, 20], result: 'Legendary evasion, automatically dodge next attack', type: 'critical' }
        ]
    }
};