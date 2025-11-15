// ============================================
// GAMBLER TALENT TREES
// ============================================

export const GAMBLER_LUCK_MANIPULATION = [
  // Tier 0 - Lucky core (center)
  {
    id: 'luck_t0_lucky_charm',
    name: 'Lucky Charm',
    description: 'You carry a personal lucky charm. Once per day, reroll any die and take the higher result.',
    icon: 'inv_jewelry_necklace_07',
    maxRanks: 1,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Scattered charms (random positions)
  {
    id: 'luck_t1_charm_of_luck',
    name: 'Charm of Luck',
    description: 'Create charms that grant +1d4 to rolls. Each charm lasts 1 hour per rank.',
    icon: 'inv_jewelry_necklace_01',
    maxRanks: 3,
    position: { x: 0, y: 1 },
    requires: 'luck_t0_lucky_charm',
  },
  {
    id: 'luck_t1_probability_bend',
    name: 'Probability Bend',
    description: 'Bend probability around you. Allies within 20ft can reroll 1s on attack rolls.',
    icon: 'spell_shadow_mindtwisting',
    maxRanks: 2,
    position: { x: 4, y: 1 },
    requires: 'luck_t0_lucky_charm',
  },
  {
    id: 'luck_t1_lucky_streak',
    name: 'Lucky Streak',
    description: 'After a critical hit, your next attack has advantage. Stacks up to 3 times.',
    icon: 'ability_rogue_slicedice',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'luck_t0_lucky_charm',
  },

  // Tier 2 - More scattered fortune (irregular spread)
  {
    id: 'luck_t2_four_leaf_clover',
    name: 'Four-Leaf Clover',
    description: 'Find four-leaf clovers in unlikely places. Once per day, guarantee success on a skill check.',
    icon: 'inv_misc_herb_07',
    maxRanks: 2,
    position: { x: 3, y: 2 },
    requires: 'luck_t1_lucky_streak',
  },
  {
    id: 'luck_t2_lucky_break',
    name: 'Lucky Break',
    description: 'When reduced below 0 HP, roll 1d20. On 10+ per rank, survive with 1 HP.',
    icon: 'spell_holy_layonhands',
    maxRanks: 3,
    position: { x: 0, y: 3 },
    requires: 'luck_t1_charm_of_luck',
  },
  {
    id: 'luck_t2_serendipity',
    name: 'Serendipity',
    description: 'Lucky discoveries occur. When searching, find an extra item or clue 25% of the time per rank.',
    icon: 'inv_misc_coin_01',
    maxRanks: 4,
    position: { x: 4, y: 3 },
    requires: 'luck_t1_probability_bend',
  },

  // Tier 3 - Fortune gathering (scattered convergence)
  {
    id: 'luck_t3_lady_luck',
    name: 'Lady Luck\'s Favor',
    description: 'Lady Luck smiles upon you. +1 to all saving throws. Roll 1d20 after failed saves: on 15+ per rank, succeed instead.',
    icon: 'achievement_dungeon_icecrown_frostmourne',
    maxRanks: 3,
    position: { x: 2, y: 3 },
    requires: 'luck_t2_four_leaf_clover',
  },
  {
    id: 'luck_t3_luck_field',
    name: 'Luck Field',
    description: 'Create a 30ft field of good luck. Allies inside reroll 1s and 2s on all rolls.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: 'luck_t2_lucky_break',
  },

  // Tier 4 - Advanced fortune (random outer placement)
  {
    id: 'luck_t4_jackpot',
    name: 'Jackpot',
    description: 'Critical hits deal maximum damage. Natural 20s on attacks trigger this effect.',
    icon: 'inv_misc_coin_02',
    maxRanks: 2,
    position: { x: 3, y: 4 },
    requires: 'luck_t3_lady_luck',
  },
  {
    id: 'luck_t4_golden_touch',
    name: 'Golden Touch',
    description: 'Your touch can turn items to gold. Once per day, transmute one non-magical item per rank.',
    icon: 'inv_ingot_03',
    maxRanks: 2,
    position: { x: 0, y: 5 },
    requires: 'luck_t2_serendipity',
  },

  // Tier 5 - Ultimate luck (final scattered convergence)
  {
    id: 'luck_t5_luck_god',
    name: 'Luck Incarnate',
    description: 'You become a being of pure luck. Reroll any die result once per turn. Choose the better result.',
    icon: 'achievement_dungeon_icecrown_frostmourne',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['luck_t4_jackpot', 'luck_t4_golden_touch', 'luck_t3_luck_field'],
    requiresAll: true,
  }
];

// Risk Management Specialization - Perfectly balanced scales pattern (symmetrical left-right mirror)
export const GAMBLER_RISK_MANAGEMENT = [
  // Tier 0 - Scale center (pivot point)
  {
    id: 'risk_t0_risk_assessment',
    name: 'Risk Assessment',
    description: 'You can assess risks instinctively. +1d4 to Insight checks when evaluating dangerous situations.',
    icon: 'inv_misc_book_09',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Left scale pan (symmetrical positioning)
  {
    id: 'risk_t1_hedge_bet',
    name: 'Hedge Bet',
    description: 'Split your actions between safety and risk. Once per turn, take a 1 action point to create a safety net.',
    icon: 'inv_misc_coin_03',
    maxRanks: 3,
    position: { x: 0, y: 1 },
    requires: 'risk_t0_risk_assessment',
  },
  {
    id: 'risk_t1_contingency_plan',
    name: 'Contingency Plan',
    description: 'Prepare for failure. When a plan fails, you can immediately attempt a different approach as a reaction.',
    icon: 'inv_scroll_03',
    maxRanks: 2,
    position: { x: 1, y: 2 },
    requires: 'risk_t1_hedge_bet',
  },
  {
    id: 'risk_t1_calculated_risk',
    name: 'Calculated Risk',
    description: 'Take calculated risks for greater rewards. +1d6 to damage when attacking at disadvantage.',
    icon: 'ability_dualwield',
    maxRanks: 4,
    position: { x: 0, y: 3 },
    requires: 'risk_t1_contingency_plan',
  },

  // Tier 1 - Right scale pan (mirror of left side)
  {
    id: 'risk_t1_safety_net',
    name: 'Safety Net',
    description: 'Create safety nets for allies. Once per combat, prevent an ally from taking damage from an attack.',
    icon: 'spell_holy_powerwordshield',
    maxRanks: 3,
    position: { x: 4, y: 1 },
    requires: 'risk_t0_risk_assessment',
  },
  {
    id: 'risk_t1_backup_plan',
    name: 'Backup Plan',
    description: 'Always have a backup. When an action fails, you can immediately attempt it again at disadvantage.',
    icon: 'inv_misc_book_08',
    maxRanks: 2,
    position: { x: 3, y: 2 },
    requires: 'risk_t1_safety_net',
  },
  {
    id: 'risk_t1_high_stakes',
    name: 'High Stakes',
    description: 'Risk everything for glory. Critical hits deal +2d6 damage, but critical failures take +1d6 damage.',
    icon: 'ability_warrior_charge',
    maxRanks: 3,
    position: { x: 4, y: 3 },
    requires: 'risk_t1_backup_plan',
  },

  // Tier 2 - Balanced center (scale beam)
  {
    id: 'risk_t2_insurance_policy',
    name: 'Insurance Policy',
    description: 'Take out insurance on dangerous actions. If a high-risk action fails, take half damage or effect.',
    icon: 'inv_scroll_02',
    maxRanks: 4,
    position: { x: 2, y: 2 },
    requires: 'risk_t0_risk_assessment',
  },
  {
    id: 'risk_t2_balanced_gamble',
    name: 'Balanced Gamble',
    description: 'Balance risk and reward perfectly. When you succeed on a risky action, gain temporary HP equal to the DC.',
    icon: 'inv_misc_coin_05',
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: 'risk_t2_insurance_policy',
  },
  {
    id: 'risk_t2_mitigated_loss',
    name: 'Mitigated Loss',
    description: 'Turn failures into learning experiences. Failed actions grant +1 to future attempts against the same target.',
    icon: 'spell_holy_layonhands',
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: 'risk_t2_insurance_policy',
  },

  // Tier 3 - Scale weights (outer counterweights)
  {
    id: 'risk_t3_perfect_timing',
    name: 'Perfect Timing',
    description: 'Time your risks perfectly. Once per combat, delay an enemy\'s action until after yours.',
    icon: 'spell_nature_timestop',
    maxRanks: 2,
    position: { x: 0, y: 5 },
    requires: 'risk_t2_balanced_gamble',
  },
  {
    id: 'risk_t3_risk_sharing',
    name: 'Risk Sharing',
    description: 'Share risks with allies. When you take damage, distribute 1d6 damage to each ally within 30ft.',
    icon: 'spell_shadow_bloodboil',
    maxRanks: 2,
    position: { x: 2, y: 5 },
    requires: 'risk_t2_mitigated_loss',
  },
  {
    id: 'risk_t3_ultimate_gamble',
    name: 'Ultimate Gamble',
    description: 'Make the ultimate gamble. Once per day, reroll all dice for an action and take the higher result.',
    icon: 'inv_misc_dice_01',
    maxRanks: 1,
    position: { x: 4, y: 5 },
    requires: 'risk_t2_mitigated_loss',
  },

  // Tier 4 - Perfect equilibrium (center convergence)
  {
    id: 'risk_t4_perfect_balance',
    name: 'Perfect Balance',
    description: 'Achieve perfect balance between risk and safety. You can choose to succeed or fail any roll once per day.',
    icon: 'inv_misc_scalesofjustice',
    maxRanks: 1,
    position: { x: 2, y: 7 },
    requires: ['risk_t3_perfect_timing', 'risk_t3_risk_sharing', 'risk_t3_ultimate_gamble'],
    requiresAll: true,
  }
];

// Fate Control Specialization - Roulette wheel pattern (proper tier progression)
export const GAMBLER_FATE_CONTROL = [
  // Tier 0 - Foundation (starting talent)
  {
    id: 'fate_t0_wheel_of_fortune',
    name: 'Wheel of Fortune',
    description: 'You can sense the turning of fate\'s wheel. Once per day, glimpse into possible futures.',
    icon: 'inv_misc_gear_01',
    maxRanks: 2,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Early fate manipulation (requires 3 points)
  {
    id: 'fate_t1_destiny_thread',
    name: 'Destiny Thread',
    description: 'Pull on threads of destiny. Once per combat, force a creature to reroll an attack against you.',
    icon: 'inv_fabric_linen_01',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'fate_t0_wheel_of_fortune',
  },
  {
    id: 'fate_t1_fate_intervention',
    name: 'Fate Intervention',
    description: 'Intervene in fate. Once per day, change the result of any die roll by ±1 per rank.',
    icon: 'spell_holy_searinglight',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'fate_t0_wheel_of_fortune',
  },

  // Tier 2 - Advanced control (requires 6 points)
  {
    id: 'fate_t2_turning_wheel',
    name: 'Turning Wheel',
    description: 'The wheel turns in your favor. After failing a save, you can reroll it once.',
    icon: 'inv_misc_gear_02',
    maxRanks: 4,
    position: { x: 0, y: 2 },
    requires: 'fate_t1_destiny_thread',
  },
  {
    id: 'fate_t2_karmic_balance',
    name: 'Karmic Balance',
    description: 'Karma balances the scales. When you help an ally, they gain +1d4 to their next roll.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'fate_t1_destiny_thread',
  },
  {
    id: 'fate_t2_fate_binder',
    name: 'Fate Binder',
    description: 'Bind fate to your will. Creatures within 30ft have disadvantage on saves against your abilities.',
    icon: 'inv_belt_01',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'fate_t1_fate_intervention',
  },

  // Tier 3 - Wheel mechanics (requires 9 points)
  {
    id: 'fate_t3_wheel_spin',
    name: 'Wheel Spin',
    description: 'Spin fate\'s wheel. Once per combat, force all creatures in 20ft to reroll initiative.',
    icon: 'ability_rogue_sprint',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'fate_t2_karmic_balance',
  },
  {
    id: 'fate_t3_fate_engine',
    name: 'Fate Engine',
    description: 'Power fate itself. Your abilities that manipulate fate have +1d6 to effect strength.',
    icon: 'inv_misc_gear_03',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'fate_t2_karmic_balance',
  },

  // Tier 4 - House edge (requires 12 points)
  {
    id: 'fate_t4_destiny_weaver',
    name: 'Destiny Weaver',
    description: 'Weave threads of destiny. Create fate effects that last 1 minute per rank.',
    icon: 'inv_fabric_silk_01',
    maxRanks: 4,
    position: { x: 0, y: 4 },
    requires: 'fate_t3_wheel_spin',
  },
  {
    id: 'fate_t4_eternal_return',
    name: 'Eternal Return',
    description: 'Events repeat in your favor. Failed attacks against you can be made again with advantage.',
    icon: 'spell_nature_timestop',
    maxRanks: 3,
    position: { x: 2, y: 4 },
    requires: 'fate_t3_wheel_spin',
  },
  {
    id: 'fate_t4_fate_dominator',
    name: 'Fate Dominator',
    description: 'Dominate fate in your domain. Creatures in 60ft cannot benefit from luck or probability effects.',
    icon: 'inv_crown_01',
    maxRanks: 2,
    position: { x: 4, y: 4 },
    requires: 'fate_t3_fate_engine',
  },

  // Tier 5 - Roulette mastery (requires 15 points)
  {
    id: 'fate_t5_house_edge',
    name: 'House Edge',
    description: 'Gain the house edge. All enemy rolls have a 10% chance per rank to be reduced by 1d6.',
    icon: 'inv_misc_coin_06',
    maxRanks: 3,
    position: { x: 1, y: 5 },
    requires: 'fate_t4_eternal_return',
  },
  {
    id: 'fate_t5_loaded_dice',
    name: 'Loaded Dice',
    description: 'Load the dice of fate. Once per day, all your rolls for 1 minute have advantage.',
    icon: 'inv_misc_dice_02',
    maxRanks: 1,
    position: { x: 3, y: 5 },
    requires: 'fate_t4_eternal_return',
  },

  // Tier 6 - Ultimate fate control (requires 18 points)
  {
    id: 'fate_t6_cosmic_wheel',
    name: 'Cosmic Wheel',
    description: 'Control the cosmic wheel of fate. Once per day, dictate the outcome of any event within 100ft.',
    icon: 'inv_misc_orb_01',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['fate_t5_house_edge', 'fate_t5_loaded_dice'],
    requiresAll: true,
  }
];
