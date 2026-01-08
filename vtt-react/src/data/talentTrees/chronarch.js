// ============================================
// CHRONARCH TALENT TREES
// ============================================

export const CHRONARCH_TEMPORAL_CONTROL = [
  // Tier 0 - Foundation (Single central start)
  {
    id: 'temporal_t0_time_sense',
    name: 'Temporal Awareness',
    description: 'You can sense temporal anomalies within 30ft. Draw a card when casting spells. Face cards extend spell duration by 1 round.',
    icon: 'spell_holy_borrowedtime',
    maxRanks: 2,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Basic time manipulation (Left and right expansion)
  {
    id: 'temporal_t1_slow_time',
    name: 'Temporal Slow',
    description: 'Unlocks Temporal Slow - target creature\'s speed is halved. Roll 1d20 each round: on 11+ per rank, they lose an action.',
    icon: 'spell_nature_slow',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'temporal_t0_time_sense',
  },
  {
    id: 'temporal_t1_haste',
    name: 'Temporal Acceleration',
    description: 'Unlocks Temporal Acceleration - ally gains double movement and an extra action. Draw a card: red cards extend duration by 1 round.',
    icon: 'spell_nature_invisibilty',
    maxRanks: 2,
    position: { x: 3, y: 1 },
    requires: 'temporal_t0_time_sense',
  },

  // Tier 2 - Advanced control (Further spread)
  {
    id: 'temporal_t1_time_lock',
    name: 'Chronal Lock',
    description: 'Enemies within 20ft have disadvantage on initiative rolls. Roll 1d20 when they act: on 16+ per rank, their action is delayed.',
    icon: 'spell_frost_stun',
    maxRanks: 4,
    position: { x: 0, y: 2 },
    requires: 'temporal_t1_slow_time',
  },
  {
    id: 'temporal_t2_time_bubble',
    name: 'Temporal Bubble',
    description: 'Create a 15ft bubble where time flows at half speed for enemies. Allies move at normal speed. Roll 1d20 each round: on 15+ per rank, enemies are stunned.',
    icon: 'spell_holy_borrowedtime',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'temporal_t1_haste',
  },
  {
    id: 'temporal_t3_reflexes',
    name: 'Lightning Reflexes',
    description: 'You and allies within 20ft roll initiative twice, take higher result. +1d6 to armor against attacks from slowed creatures.',
    icon: 'spell_nature_invisibilty',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'temporal_t1_haste',
  },

  // Tier 3 - Master control (Converging inward)
  {
    id: 'temporal_t3_time_stop',
    name: 'Temporal Dominion',
    description: 'Unlocks Temporal Dominion - stop time in 30ft radius for 1 round. Roll 1d20: on 18+ per rank, duration increases by 1 round.',
    icon: 'spell_nature_timestop',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'temporal_t1_time_lock',
  },
  {
    id: 'temporal_t3_future_vision',
    name: 'Chronal Foresight',
    description: 'At combat start, draw 3 cards representing future events. Red cards grant advantage on attacks, black cards on defenses.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'temporal_t3_reflexes',
  },

  // Tier 4 - Elite mastery (Back to center)
  {
    id: 'temporal_t4_chronal_mastery',
    name: 'Chronal Mastery',
    description: 'You can cast spells as reactions when time effects trigger. +2 to all rolls during time-stopped effects.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'temporal_t3_future_vision',
  },

  // Tier 5 - Legendary control (Left and right spread again)
  {
    id: 'temporal_t5_paradox',
    name: 'Paradox Weaver',
    description: 'Create temporal paradoxes. Roll 1d20 when casting: on 19+ per rank, your next spell can target any point in time within 1 minute.',
    icon: 'spell_nature_timestop',
    maxRanks: 2,
    position: { x: 1, y: 5 },
    requires: 'temporal_t4_chronal_mastery',
  },
  {
    id: 'temporal_t5_chronal_nova',
    name: 'Chronal Nova',
    description: 'Unlocks Chronal Nova - unleash temporal energy in 40ft radius. Enemies take 3d8 force damage per rank. Roll 1d20: on 18+, time stops for 1 round.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 3, y: 5 },
    requires: 'temporal_t4_chronal_mastery',
  },

  // Tier 6 - Ultimate temporal mastery (Center convergence)
  {
    id: 'temporal_t6_chronos_avatar',
    name: 'Avatar of Chronos',
    description: 'Unlocks Avatar of Chronos - become a being of pure time for 1 minute. Time stops for everyone but you. Cast spells freely, teleport through time.',
    icon: 'spell_nature_timestop',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['temporal_t5_paradox', 'temporal_t5_chronal_nova'],
    requiresAll: true,
  }
];

// Time Manipulation Specialization - Reality-bending time effects (Zig-zag pattern)
export const CHRONARCH_TIME_MANIPULATION = [
  // Tier 0 - Foundation (Scattered across top)
  {
    id: 'manip_t0_temporal_threads',
    name: 'Temporal Threads',
    description: 'You can see and manipulate the threads of time. +1d4 to initiative rolls per rank.',
    icon: 'spell_nature_timestop',
    maxRanks: 3,
    position: { x: 0, y: 0 },
    requires: null,
  },
  {
    id: 'manip_t0_probability_shift',
    name: 'Probability Weaver',
    description: 'When you or allies roll dice, roll 1d20. On 16+ per rank, reroll the die and take the higher result.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 4,
    position: { x: 4, y: 0 },
    requires: null,
  },

  // Tier 1 - Basic manipulation (Zig to left side)
  {
    id: 'manip_t1_reality_shift',
    name: 'Reality Shift',
    description: 'Unlocks Reality Shift - teleport creature 20ft through time. Roll 1d20: on 15+ per rank, they arrive 1 round early.',
    icon: 'spell_arcane_blink',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'manip_t0_temporal_threads',
  },
  {
    id: 'manip_t1_temporal_clone',
    name: 'Temporal Duplicate',
    description: 'Unlocks Temporal Duplicate - create a duplicate of yourself from 1 round ago. Draw a card: face cards make the duplicate permanent.',
    icon: 'spell_nature_mirrorimage',
    maxRanks: 2,
    position: { x: 3, y: 1 },
    requires: 'manip_t0_probability_shift',
  },

  // Tier 2 - Complex manipulation (Zag to right side)
  {
    id: 'manip_t2_temporal_illusion',
    name: 'Temporal Mirage',
    description: 'Create illusions from alternate timelines. Enemies roll 1d20 to disbelieve: on 16+ per rank, they take psychic damage from paradox.',
    icon: 'spell_nature_mirrorimage',
    maxRanks: 4,
    position: { x: 0, y: 2 },
    requires: 'manip_t1_reality_shift',
  },
  {
    id: 'manip_t2_causality_loop',
    name: 'Causality Loop',
    description: 'Unlocks Causality Loop - force enemy into a time loop. They repeat their last round. Roll 1d20: on 17+ per rank, loop lasts 2 rounds.',
    icon: 'spell_nature_timestop',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'manip_t1_temporal_clone',
  },
  {
    id: 'manip_t2_probability_storm',
    name: 'Probability Storm',
    description: 'Create chaos in 20ft radius. All rolls have advantage or disadvantage randomly. Roll 1d20 each round: on 16+ per rank, you choose the effect.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'manip_t1_temporal_clone',
  },

  // Tier 3 - Advanced manipulation (Zig to left again)
  {
    id: 'manip_t3_timeline_split',
    name: 'Timeline Divergence',
    description: 'Unlocks Timeline Divergence - split reality into two timelines. Roll 1d20: on 18+ per rank, both timelines become real.',
    icon: 'spell_arcane_blink',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'manip_t2_temporal_illusion',
  },
  {
    id: 'manip_t3_paradox_engine',
    name: 'Paradox Engine',
    description: 'Harness paradox energy. When paradoxes occur, gain 1d8 temporary HP per rank. Roll 1d20: on 15+, create a paradox explosion.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 4,
    position: { x: 3, y: 3 },
    requires: 'manip_t2_causality_loop',
  },

  // Tier 4 - Master manipulation (Zag to right)
  {
    id: 'manip_t4_temporal_rewrite',
    name: 'Temporal Rewrite',
    description: 'Unlocks Temporal Rewrite - rewrite the last 1 minute of history. Roll 1d20: on 19+ per rank, you can change any event.',
    icon: 'spell_nature_timestop',
    maxRanks: 2,
    position: { x: 0, y: 4 },
    requires: 'manip_t3_timeline_split',
  },
  {
    id: 'manip_t4_reality_anchor',
    name: 'Reality Anchor',
    description: 'Become immune to time manipulation effects. When others try to manipulate time around you, roll 1d20: on 16+ per rank, you steal their time energy.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 2, y: 4 },
    requires: 'manip_t3_paradox_engine',
  },
  {
    id: 'manip_t4_chronal_nexus',
    name: 'Chronal Nexus',
    description: 'Create a nexus of temporal energy. Allies within 40ft can cast spells as 1 action points. Roll 1d20 each round: on 18+ per rank, spells cost no slots.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 4, y: 4 },
    requires: 'manip_t2_probability_storm',
  },

  // Tier 5 - Legendary manipulation (Zig back to left)
  {
    id: 'manip_t5_dimension_shift',
    name: 'Dimensional Shift',
    description: 'Unlocks Dimensional Shift - move through alternate realities. Travel anywhere within 1000ft instantly. Roll 1d20: on 18+ per rank, bring allies along.',
    icon: 'spell_arcane_blink',
    maxRanks: 3,
    position: { x: 1, y: 5 },
    requires: 'manip_t4_temporal_rewrite',
  },
  {
    id: 'manip_t5_paradox_master',
    name: 'Paradox Sovereign',
    description: 'Master paradox creation. When you create paradoxes, roll 1d20. On 16+ per rank, gain a paradox token (spend for free spell cast).',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 4,
    position: { x: 3, y: 5 },
    requires: 'manip_t4_reality_anchor',
  },

  // Tier 6 - Ultimate reality manipulation (Center convergence)
  {
    id: 'manip_t6_reality_weaver',
    name: 'Reality Weaver',
    description: 'Unlocks Reality Weaver - transcend time and space for 1 minute. Rewrite reality at will. Cast any spell, travel anywhere, control all time effects.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['manip_t5_dimension_shift', 'manip_t5_paradox_master'],
    requiresAll: true,
  }
];

// Chronos Energy Specialization - Harnessing temporal energy and chronal power (Diagonal flow)
export const CHRONARCH_CHRONOS_ENERGY = [
  // Tier 0 - Foundation (Bottom-left to top-right diagonal)
  {
    id: 'energy_t0_chronal_conduit',
    name: 'Chronal Conduit',
    description: 'Channel temporal energy. Your time spells deal +1d6 force damage per rank.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 4,
    position: { x: 1, y: 0 },
    requires: null,
  },
  {
    id: 'energy_t0_temporal_battery',
    name: 'Temporal Battery',
    description: 'Store temporal energy. Gain chronal points when time effects trigger. Maximum 3 points per rank.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 3, y: 0 },
    requires: null,
  },

  // Tier 1 - Basic energy manipulation (Continue diagonal)
  {
    id: 'energy_t1_temporal_bolt',
    name: 'Temporal Bolt',
    description: 'Unlocks Temporal Bolt - fire bolt of time energy for 2d8 force damage per rank. Roll 1d20: on 16+, slow target for 1 round.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 4,
    position: { x: 0, y: 1 },
    requires: 'energy_t0_chronal_conduit',
  },
  {
    id: 'energy_t1_energy_shield',
    name: 'Chronal Shield',
    description: 'Surround yourself with temporal energy. +2 armor per rank, absorb 1d8 force damage from time effects.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 2, y: 1 },
    requires: 'energy_t0_chronal_conduit',
  },
  {
    id: 'energy_t1_time_wave',
    name: 'Temporal Wave',
    description: 'Unlocks Temporal Wave - 20ft cone deals 1d8 force damage per rank. Roll 1d20: on 15+, push creatures 10ft.',
    icon: 'spell_nature_timestop',
    maxRanks: 4,
    position: { x: 4, y: 1 },
    requires: 'energy_t0_temporal_battery',
  },

  // Tier 2 - Advanced energy control (Cross-diagonal)
  {
    id: 'energy_t2_chronal_burst',
    name: 'Chronal Burst',
    description: 'Spend chronal points for burst effects. Each point spent adds +1d8 force damage to spells. Roll 1d20: on 17+ per rank, regain the point.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'energy_t1_energy_shield',
  },
  {
    id: 'energy_t2_temporal_field',
    name: 'Temporal Field',
    description: 'Create fields of temporal energy. Enemies in 25ft radius take 1d6 force damage per rank at start of their turns.',
    icon: 'spell_nature_timestop',
    maxRanks: 4,
    position: { x: 3, y: 2 },
    requires: 'energy_t1_time_wave',
  },

  // Tier 3 - Master energy manipulation (Diagonal shift)
  {
    id: 'energy_t3_temporal_blade',
    name: 'Temporal Blade',
    description: 'Unlocks Temporal Blade - summon blade of time energy. Deals 2d8 force damage per rank. Roll 1d20: on 18+ per rank, ignore all resistances.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 0, y: 3 },
    requires: 'energy_t2_chronal_burst',
  },
  {
    id: 'energy_t3_chronal_armor',
    name: 'Chronal Armor',
    description: 'Infuse armor with temporal energy. Immune to critical hits. +1d8 to saves per chronal point spent.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 4,
    position: { x: 2, y: 3 },
    requires: 'energy_t2_temporal_field',
  },
  {
    id: 'energy_t3_energy_nova',
    name: 'Chronal Nova',
    description: 'Unlocks Chronal Nova - explode with temporal energy. 30ft radius, 3d8 force damage per rank. Roll 1d20: on 17+, create temporal rift.',
    icon: 'spell_nature_timestop',
    maxRanks: 3,
    position: { x: 4, y: 3 },
    requires: 'energy_t2_temporal_field',
  },

  // Tier 4 - Elite energy mastery (Reverse diagonal)
  {
    id: 'energy_t4_temporal_storm',
    name: 'Temporal Storm',
    description: 'Summon storm of temporal energy in 40ft radius. Enemies take 2d8 force damage per rank each round. Roll 1d20: on 16+ per rank, storm persists.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 4,
    position: { x: 1, y: 4 },
    requires: 'energy_t3_temporal_blade',
  },
  {
    id: 'energy_t4_chronal_regeneration',
    name: 'Chronal Regeneration',
    description: 'Temporal energy heals you. Regenerate 1d8 HP per chronal point spent. Roll 1d20: on 15+ per rank, regenerate allies in 20ft.',
    icon: 'spell_holy_borrowedtime',
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: 'energy_t3_chronal_armor',
  },

  // Tier 5 - Legendary energy control (Final diagonal)
  {
    id: 'energy_t5_temporal_singularity',
    name: 'Temporal Singularity',
    description: 'Unlocks Temporal Singularity - create a point of infinite time. Pull creatures within 60ft. Deal 4d8 force damage per rank each round.',
    icon: 'spell_nature_timestop',
    maxRanks: 3,
    position: { x: 0, y: 5 },
    requires: 'energy_t4_temporal_storm',
  },
  {
    id: 'energy_t5_chronal_dominion',
    name: 'Chronal Dominion',
    description: 'Master all temporal energy. Spells ignore time-based immunities. Roll 1d20 when casting: on 18+ per rank, all chronal points are regained.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 2, y: 5 },
    requires: 'energy_t4_chronal_regeneration',
  },
  {
    id: 'energy_t5_reality_engine',
    name: 'Reality Engine',
    description: 'Unlocks Reality Engine - harness infinite temporal energy. For 1 minute, cast spells at will. Roll 1d20 each cast: on 19+ per rank, spell becomes legendary.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 4, y: 5 },
    requires: 'energy_t4_chronal_regeneration',
  },

  // Tier 6 - Ultimate chronal power (Center convergence)
  {
    id: 'energy_t6_chronos_incarnate',
    name: 'Chronos Incarnate',
    description: 'Unlocks Chronos Incarnate - become living temporal energy for 1 minute. Infinite chronal points, immune to all damage, control time and space.',
    icon: 'spell_nature_timestop',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['energy_t5_temporal_singularity', 'energy_t5_chronal_dominion', 'energy_t5_reality_engine'],
    requiresAll: true,
  }
];
