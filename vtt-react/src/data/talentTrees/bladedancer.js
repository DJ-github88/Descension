// ============================================
// BLADEDANCER TALENT TREES
// ============================================

export const BLADEDANCER_FLOW_MASTER = [
  // Foundation: The Water's Source (Central flowing origin)
  {
    id: 'flow_master_t0_momentum_flow',
    name: 'Momentum Flow',
    description: 'All stance transitions cost 1 less Momentum (minimum 1). Momentum decays 50% slower. Your Flourish abilities have +10% effectiveness.',
    icon: 'spell_nature_riptide',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Left River: Rapid Transitions (Swift flowing water)
  {
    id: 'flow_master_t1_rapid_current',
    name: 'Rapid Current',
    description: 'You can transition between any two connected stances as a 1 action point. Gain +1 Momentum when you transition stances.',
    icon: 'spell_nature_swiftness',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'flow_master_t0_momentum_flow',
  },
  {
    id: 'flow_master_t2_water_dance',
    name: 'Water Dance',
    description: 'While in Flowing Water stance, you can spend 1 Momentum to automatically dodge any attack. Dodge distance increased by 10ft.',
    icon: 'spell_nature_resistnature',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'flow_master_t1_rapid_current',
  },
  {
    id: 'flow_master_t3_liquid_motion',
    name: 'Liquid Motion',
    description: 'Your movement speed increases by +10ft when you have 5+ Momentum. You can move through enemy spaces without opportunity attacks.',
    icon: 'spell_nature_giftofthewaterspirit',
    maxRanks: 4,
    position: { x: 1, y: 3 },
    requires: 'flow_master_t2_water_dance',
  },

  // Right River: Combo Chains (Interlocking dance steps)
  {
    id: 'flow_master_t1_combo_weaving',
    name: 'Combo Weaving',
    description: 'After using a stance ability, you can immediately transition to another stance at half cost (round down).',
    icon: 'ability_rogue_combatreadiness',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'flow_master_t0_momentum_flow',
  },
  {
    id: 'flow_master_t2_chain_flow',
    name: 'Chain Flow',
    description: 'You can perform up to 2 stance abilities in one turn by spending extra Momentum equal to the second ability\'s cost.',
    icon: 'spell_nature_chainlightning',
    maxRanks: 2,
    position: { x: 4, y: 2 },
    requires: 'flow_master_t1_combo_weaving',
  },
  {
    id: 'flow_master_t3_fluid_mastery',
    name: 'Fluid Mastery',
    description: 'Dancing Blade stance allows you to transition to ANY stance (not just connected ones) for 2 Momentum instead of 4.',
    icon: 'spell_nature_astralrecal',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'flow_master_t2_chain_flow',
  },

  // Central Convergence: Perfect Flow (Merging rivers)
  {
    id: 'flow_master_t4_river_confluence',
    name: 'River Confluence',
    description: 'Once per turn when you transition stances, you can spend 3 Momentum to perform a free stance ability from your new stance.',
    icon: 'spell_nature_riptide',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: ['flow_master_t1_rapid_current', 'flow_master_t1_combo_weaving'],
  },
  {
    id: 'flow_master_t5_eternal_current',
    name: 'Eternal Current',
    description: 'Momentum cannot decay below 3. When you reach 10 Momentum, your next stance transition is free and you can choose any stance.',
    icon: 'spell_nature_giftofthewaterspirit',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['flow_master_t3_liquid_motion', 'flow_master_t3_fluid_mastery'],
  },
  {
    id: 'flow_master_t6_water_ascendant',
    name: 'Water Ascendant',
    description: 'Ultimate ability: Become a flowing water elemental for 1 minute. All attacks pass through you, you take half damage from all sources, and you can teleport 30ft as a 1 action point. Costs all Momentum.',
    icon: 'spell_nature_acid_01',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: 'flow_master_t5_eternal_current',
  }
];

export const BLADEDANCER_DUELIST = [
  // Foundation: The Balanced Blade (Central equilibrium point)
  {
    id: 'duelist_t0_precision_edge',
    name: 'Precision Edge',
    description: 'Your critical hit range increases by 1 (crit on 19-20). Striking Serpent stance grants +1 to initiative rolls. Rooted Stone ripostes deal +1d4 damage.',
    icon: 'ability_duelist',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Left Scale: Offensive Precision (Blade extending left)
  {
    id: 'duelist_t1_perfect_timing',
    name: 'Perfect Timing',
    description: 'Once per turn, you can spend 2 Momentum to make an attack as a reaction when an enemy within 30ft attacks.',
    icon: 'ability_rogue_quickrecovery',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'duelist_t0_precision_edge',
  },
  {
    id: 'duelist_t2_serpents_precision',
    name: 'Serpent\'s Precision',
    description: 'Striking Serpent stance increases your critical hit range by an additional +1 (total crit on 18-20). Critical hits generate +1 extra Momentum.',
    icon: 'ability_hunter_snipershot',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'duelist_t1_perfect_timing',
  },
  {
    id: 'duelist_t3_duelists_focus',
    name: 'Duelist\'s Focus',
    description: 'You have advantage on attacks against enemies you damaged this turn. This advantage persists until the start of your next turn.',
    icon: 'ability_warrior_focusedrage',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'duelist_t2_serpents_precision',
  },

  // Right Scale: Defensive Mastery (Blade extending right)
  {
    id: 'duelist_t1_defensive_stance',
    name: 'Defensive Stance',
    description: 'Rooted Stone stance grants +2 to all saving throws. While in Rooted Stone, you can spend 1 Momentum to reduce incoming damage by 1d8.',
    icon: 'ability_warrior_shieldwall',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'duelist_t0_precision_edge',
  },
  {
    id: 'duelist_t2_counter_mastery',
    name: 'Counter Mastery',
    description: 'Rooted Stone ripostes can be used as reactions to any attack, not just after parries. Riposte damage is doubled.',
    icon: 'ability_parry',
    maxRanks: 4,
    position: { x: 4, y: 2 },
    requires: 'duelist_t1_defensive_stance',
  },
  {
    id: 'duelist_t3_unyielding_blade',
    name: 'Unyielding Blade',
    description: 'While wielding a weapon, you cannot be disarmed or have your weapon damaged. Rooted Stone stance prevents you from being moved against your will.',
    icon: 'ability_warrior_weaponmastery',
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: 'duelist_t2_counter_mastery',
  },

  // Central Balance: Perfect Equilibrium (Balanced crossguard)
  {
    id: 'duelist_t4_dueling_mastery',
    name: 'Dueling Mastery',
    description: 'You can challenge a single enemy as a 1 action point. While challenged, both you and the target have advantage on attacks against each other, but cannot attack others.',
    icon: 'ability_warrior_savageblow',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: ['duelist_t1_perfect_timing', 'duelist_t1_defensive_stance'],
  },
  {
    id: 'duelist_t5_blade_dance',
    name: 'Blade Dance',
    description: 'Dancing Blade stance allows you to attack twice per action instead of once. These attacks can target different enemies within 10ft.',
    icon: 'ability_rogue_slicedice',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['duelist_t3_duelists_focus', 'duelist_t3_unyielding_blade'],
  },
  {
    id: 'duelist_t6_perfect_duelist',
    name: 'Perfect Duelist',
    description: 'Ultimate ability: Challenge all enemies within 30ft simultaneously. For 1 minute, you have advantage on all attacks and cannot be targeted by their attacks (they must attack you). Costs all Flourish tokens.',
    icon: 'ability_warrior_bladestorm',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: 'duelist_t5_blade_dance',
  }
];

export const BLADEDANCER_SHADOW_DANCER = [
  // Foundation: The Hidden Blade (Central shadowy nexus)
  {
    id: 'shadow_dancer_t0_shadow_essence',
    name: 'Shadow Essence',
    description: 'Shadow Step stance allows you to enter stealth even in combat. Stealth attacks generate +1 extra Flourish token. Shadow Step transitions cost 1 less Momentum.',
    icon: 'ability_stealth',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Upper Shadows: Stealth Enhancement (Rising darkness)
  {
    id: 'shadow_dancer_t1_shadow_cloak',
    name: 'Shadow Cloak',
    description: 'You can enter stealth as a 1 action point. While stealthed, you gain +2 to attack and damage rolls. Stealth lasts until you attack or take damage.',
    icon: 'spell_shadow_nethercloak',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'shadow_dancer_t0_shadow_essence',
  },
  {
    id: 'shadow_dancer_t2_phantom_step',
    name: 'Phantom Step',
    description: 'Shadow Step stance allows you to teleport through walls and solid objects (but not into occupied spaces). You can teleport while prone or restrained.',
    icon: 'spell_shadow_shadowstep',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'shadow_dancer_t1_shadow_cloak',
  },
  {
    id: 'shadow_dancer_t3_darkness_within',
    name: 'Darkness Within',
    description: 'While in Shadow Step stance, you become immune to being targeted by divination magic. Enemies cannot detect you through tremorsense or blindsight.',
    icon: 'spell_shadow_shadowform',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'shadow_dancer_t2_phantom_step',
  },

  // Lower Shadows: Burst Damage (Descending darkness)
  {
    id: 'shadow_dancer_t1_ambush_mastery',
    name: 'Ambush Mastery',
    description: 'Stealth attacks deal +3d6 bonus damage. If the target was unaware of you, the attack is automatically a critical hit.',
    icon: 'ability_rogue_ambush',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'shadow_dancer_t0_shadow_essence',
  },
  {
    id: 'shadow_dancer_t2_shadow_eruption',
    name: 'Shadow Eruption',
    description: 'When you exit stealth with an attack, all enemies within 10ft of your target take 2d6 shadow damage and have disadvantage on their next attack.',
    icon: 'spell_shadow_shadowbolt',
    maxRanks: 4,
    position: { x: 4, y: 2 },
    requires: 'shadow_dancer_t1_ambush_mastery',
  },
  {
    id: 'shadow_dancer_t3_eternal_darkness',
    name: 'Eternal Darkness',
    description: 'Shadow Step stance creates a 15ft radius zone of magical darkness centered on you. You can see through this darkness, but enemies are blinded.',
    icon: 'spell_shadow_darkritual',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'shadow_dancer_t2_shadow_eruption',
  },

  // Converging Darkness: Shadow Mastery
  {
    id: 'shadow_dancer_t4_shadow_weaving',
    name: 'Shadow Weaving',
    description: 'You can transition to Shadow Step from ANY stance for 3 Momentum. While in Shadow Step, you can perform stance abilities from other stances.',
    icon: 'spell_shadow_blackplague',
    maxRanks: 2,
    position: { x: 2, y: 1 },
    requires: 'shadow_dancer_t1_shadow_cloak',
  },
  {
    id: 'shadow_dancer_t5_dance_of_shadows',
    name: 'Dance of Shadows',
    description: 'Once per turn when you transition to Shadow Step, you can teleport to a second location within 30ft as part of the transition.',
    icon: 'spell_shadow_gathershadows',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['shadow_dancer_t3_darkness_within', 'shadow_dancer_t3_eternal_darkness'],
  },
  {
    id: 'shadow_dancer_t6_shadow_ascendant',
    name: 'Shadow Ascendant',
    description: 'Ultimate ability: Become a living shadow for 1 minute. You are immune to all damage, can teleport 60ft as a 1 action point, and all your attacks deal maximum damage. Costs all Momentum and 3 Flourish.',
    icon: 'spell_shadow_demonicempathy',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: 'shadow_dancer_t5_dance_of_shadows',
  }
];
