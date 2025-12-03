// ============================================
// PYROFIEND TALENT TREES
// ============================================

export const PYROFIEND_INFERNO = [
  // Tier 0 - Foundation (Central column)
  {
    id: 'inferno_t0_burst_mastery',
    name: 'Burst Mastery',
    description: 'Rank 1: Fire spells have +5 ft range. Rank 2: Fire spells have +10 ft range. Rank 3: Fire spells have +10 ft range and ignore half cover. Rank 4: Fire spells have +15 ft range and ignore half cover. Rank 5: Fire spells have +15 ft range and ignore half and three-quarters cover.',
    icon: 'spell_fire_fireball02',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Early power (Central expansion)
  {
    id: 'inferno_t1_critical_blast',
    name: 'Critical Blast',
    description: 'Rank 1: Fire spells can be cast as reactions when you take fire damage. Rank 2: Fire spells can be cast as reactions when you take fire damage, and deal +2 fire damage. Rank 3: Fire spells can be cast as reactions when you take fire damage, deal +2 fire damage, and have +5 ft range. Rank 4: Fire spells can be cast as reactions when you take fire damage, deal +2 fire damage, have +5 ft range, and can be cast through allies.',
    icon: 'spell_fire_incinerate',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'inferno_t0_burst_mastery',
  },
  {
    id: 'inferno_t1_rapid_ascent',
    name: 'Rapid Ascent',
    description: 'Rank 1: You can spend 1 Action Point to reduce your Inferno Level by 1. Rank 2: You can spend 1 Action Point to reduce your Inferno Level by 1d3. Rank 3: You can spend 1 Action Point to reduce your Inferno Level by 1d4.',
    icon: 'spell_fire_soulburn',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'inferno_t0_burst_mastery',
  },

  // Tier 2 - Branching paths (Left and right expansion)
  {
    id: 'inferno_t2_inner_fire',
    name: 'Inner Fire',
    description: 'Rank 1: You have resistance to fire damage. Rank 2: You have resistance to fire damage and can spend 1 Action Point to extinguish flames affecting you. Rank 3: You have resistance to fire damage, can spend 1 Action Point to extinguish flames affecting you, and take 2 less damage from Inferno drawbacks. Rank 4: You have resistance to fire damage, can spend 1 Action Point to extinguish flames affecting you, take 2 less damage from Inferno drawbacks, and can spend 1 Action Point to reduce your Inferno Level by 1.',
    icon: 'spell_fire_flamebolt',
    maxRanks: 4,
    position: { x: 0, y: 2 },
    requires: 'inferno_t1_critical_blast',
  },
  {
    id: 'inferno_t2_detonation',
    name: 'Detonation',
    description: 'Rank 1: Unlocks Detonation - spend 1 Action Point to teleport 15ft to an unoccupied space within fire terrain. Rank 2: Unlocks Detonation - spend 1 Action Point to teleport 20ft to an unoccupied space within fire terrain. Rank 3: Unlocks Detonation - spend 1 Action Point to teleport 25ft to an unoccupied space within fire terrain.',
    icon: 'spell_fire_selfdestruct',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'inferno_t1_critical_blast',
  },
  {
    id: 'inferno_t2_fiery_resurgence',
    name: 'Fiery Resurgence',
    description: 'Rank 1: You can spend 1 Action Point to create a 5ft radius zone of fire terrain that lasts 1 minute. Rank 2: You can spend 1 Action Point to create a 10ft radius zone of fire terrain that lasts 1 minute. Rank 3: You can spend 1 Action Point to create a 10ft radius zone of fire terrain that lasts 1 minute and deals 1d4 fire damage to creatures that enter it. Rank 4: You can spend 1 Action Point to create a 15ft radius zone of fire terrain that lasts 1 minute and deals 1d4 fire damage to creatures that enter it.',
    icon: 'spell_fire_fire',
    maxRanks: 4,
    position: { x: 4, y: 2 },
    requires: 'inferno_t1_rapid_ascent',
  },

  // Tier 3 - Specialization (Further expansion)
  {
    id: 'inferno_t3_overcharge',
    name: 'Overcharge',
    description: 'Rank 1: When you take fire damage, you can spend 1 Action Point to deal 1d6 fire damage to one creature within 30ft. Rank 2: When you take fire damage, you can spend 1 Action Point to deal 1d8 fire damage to one creature within 30ft. Rank 3: When you take fire damage, you can spend 1 Action Point to deal 1d10 fire damage to one creature within 30ft.',
    icon: 'spell_fire_moltenblood',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'inferno_t2_inner_fire',
  },
  {
    id: 'inferno_t3_ascended_burst',
    name: 'Ascended Burst',
    description: 'Rank 1: Unlocks Ascended Burst - create a 20ft radius zone of bright light centered on you for 1 minute. Enemies in the zone have disadvantage on attack rolls. Rank 2: Unlocks Ascended Burst - create a 25ft radius zone of bright light centered on you for 1 minute. Enemies in the zone have disadvantage on attack rolls. You have advantage on attack rolls against enemies in the zone. Rank 3: Unlocks Ascended Burst - create a 30ft radius zone of bright light centered on you for 1 minute. Enemies in the zone have disadvantage on attack rolls. You have advantage on attack rolls against enemies in the zone. Enemies that enter the zone take 2d6 radiant damage.',
    icon: 'spell_fire_fireball',
    maxRanks: 3,
    position: { x: 2, y: 3 },
    requires: 'inferno_t2_detonation',
  },
  {
    id: 'inferno_t3_immolation',
    name: 'Immolation',
    description: 'Rank 1: Enemies within 5ft take 3 fire damage at the start of your turn. Rank 2: Enemies within 5ft take 6 fire damage at the start of your turn. Rank 3: Enemies within 5ft take 9 fire damage at the start of your turn. Rank 4: Enemies within 5ft take 12 fire damage at the start of your turn. Rank 5: Enemies within 5ft take 15 fire damage at the start of your turn.',
    icon: 'spell_fire_sealoffire',
    maxRanks: 5,
    position: { x: 3, y: 3 },
    requires: 'inferno_t2_fiery_resurgence',
  },

  // Tier 4 - Advanced abilities (Outer expansion)
  {
    id: 'inferno_t4_maximum_power',
    name: 'Maximum Power',
    description: 'Rank 1: At Inferno Level 9, your fire spells have their range doubled. Rank 2: At Inferno Level 8, your fire spells have their range doubled and ignore half cover.',
    icon: 'spell_fire_twilightfireward',
    maxRanks: 2,
    position: { x: 0, y: 4 },
    requires: 'inferno_t3_overcharge',
  },
  {
    id: 'inferno_t4_power_surge',
    name: 'Power Surge',
    description: 'Rank 1: After spending 3+ Inferno Levels in one turn, gain advantage on all attack rolls for 1 round. Rank 2: After spending 2+ Inferno Levels in one turn, gain advantage on all attack rolls for 1 round and regain 1 action point.',
    icon: 'spell_fire_burnout',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'inferno_t3_ascended_burst',
  },
  {
    id: 'inferno_t4_heat_death',
    name: 'Heat Death',
    description: 'Rank 1: When an enemy dies from your fire damage, draw a card. Black cards ascend your Inferno Level by 1. Rank 2: When an enemy dies from your fire damage, draw a card. Black cards ascend your Inferno Level by 1. Red cards restore 5 HP to you. Rank 3: When an enemy dies from your fire damage, flip a coin. Heads: draw a card with double effects. Tails: you take 3 fire damage.',
    icon: 'spell_fire_meteorstorm',
    maxRanks: 3,
    position: { x: 4, y: 4 },
    requires: 'inferno_t3_immolation',
  },

  // Tier 5 - Elite talents (Converging paths)
  {
    id: 'inferno_t5_critical_cascade',
    name: 'Critical Cascade',
    description: 'Rank 1: When you crit with a fire spell, gain 1 action point. Rank 2: When you crit with a fire spell, gain 1 action point and restore 1 Inferno Level. Rank 3: When you crit with a fire spell, flip a coin. Heads: gain 2 action points. Tails: lose 1 Inferno Level.',
    icon: 'spell_fire_flare',
    maxRanks: 3,
    position: { x: 1, y: 5 },
    requires: ['inferno_t4_maximum_power', 'inferno_t4_power_surge'],
    requiresAll: false,
  },
  {
    id: 'inferno_t5_permanent_inferno',
    name: 'Permanent Inferno',
    description: 'Rank 1: You can no longer descend below Inferno Level 3. Rank 2: You can no longer descend below Inferno Level 3. At Level 9, you deal +1d12 fire damage with all attacks. Rank 3: You can no longer descend below Inferno Level 3. At Level 9, you deal +2d12 fire damage with all attacks.',
    icon: 'spell_fire_moltenblood',
    maxRanks: 3,
    position: { x: 3, y: 5 },
    requires: ['inferno_t4_power_surge', 'inferno_t4_heat_death'],
    requiresAll: false,
  },

  // Tier 6 - Ultimate capstone (Central convergence)
  {
    id: 'inferno_t6_supernova',
    name: 'Supernova',
    description: 'Unlocks Supernova - consume all Inferno Levels to create a star that deals 8d12 fire damage in 50ft radius over 3 rounds. Enemies take damage at the start of each of their turns.',
    icon: 'spell_fire_soulburn',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['inferno_t5_critical_cascade', 'inferno_t5_permanent_inferno'],
    requiresAll: true,
  }
];

// Wildfire Specialization - Organic wildfire spreading pattern
export const PYROFIEND_WILDFIRE = [
  // Tier 0 - Ignition points (Scattered seeds)
  {
    id: 'wildfire_t0_spread',
    name: 'Flame Spread',
    description: 'Rank 1: When you deal fire damage, roll 1d20. On 16+ the damage jumps to a nearby enemy for half damage. Rank 2: When you deal fire damage, roll 1d20. On 15+ the damage jumps to a nearby enemy for half damage. Rank 3: When you deal fire damage, roll 1d20. On 14+ the damage jumps to a nearby enemy for half damage. Rank 4: When you deal fire damage, roll 1d20. On 13+ the damage jumps to a nearby enemy for half damage.',
    icon: 'spell_fire_flare',
    maxRanks: 4,
    position: { x: 1, y: 0 },
    requires: null,
  },
  {
    id: 'wildfire_t0_ground_fire',
    name: 'Ground Fire',
    description: 'Rank 1: Fire spells create patches of flame. Enemies entering these areas take 1d8 fire damage. Rank 2: Fire spells create patches of flame. Enemies entering these areas take 2d8 fire damage. Rank 3: Fire spells create patches of flame. Enemies entering these areas take 3d8 fire damage. Rank 4: Fire spells create patches of flame. Enemies entering these areas take 4d8 fire damage.',
    icon: 'spell_fire_moltenblood',
    maxRanks: 4,
    position: { x: 3, y: 0 },
    requires: null,
  },

  // Tier 1 - First sparks (Diagonal spread)
  {
    id: 'wildfire_t1_conflagration',
    name: 'Conflagration',
    description: 'Unlocks Conflagration - ignite all enemies in 25ft radius. They take 2d6 fire damage per round for 4 rounds.',
    icon: 'spell_fire_sealoffire',
    maxRanks: 3,
    position: { x: 0, y: 1 },
    requires: 'wildfire_t0_spread',
  },
  {
    id: 'wildfire_t1_chain_reaction',
    name: 'Chain Reaction',
    description: 'When a burning enemy dies, roll 1d6. On 4+: ignite a nearby enemy.',
    icon: 'spell_fire_flare',
    maxRanks: 3,
    position: { x: 2, y: 1 },
    requires: 'wildfire_t0_spread',
  },
  {
    id: 'wildfire_t1_wild_growth',
    name: 'Wild Growth',
    description: 'Rank 1: Ground fire patches grow larger. Each patch now affects 10ft radius instead of 5ft. Rank 2: Ground fire patches grow larger. Each patch now affects 15ft radius instead of 5ft. Rank 3: Ground fire patches grow larger. Each patch now affects 20ft radius instead of 5ft.',
    icon: 'spell_fire_moltenblood',
    maxRanks: 3,
    position: { x: 4, y: 1 },
    requires: 'wildfire_t0_ground_fire',
  },

  // Tier 2 - Fire takes hold (Branching spread)
  {
    id: 'wildfire_t2_firestorm',
    name: 'Firestorm',
    description: 'Unlocks Firestorm - summon a storm of fire in 30ft radius. Deals 3d8 fire damage per round for 3 rounds.',
    icon: 'spell_fire_selfdestruct',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'wildfire_t1_chain_reaction',
  },
  {
    id: 'wildfire_t2_searing_heat',
    name: 'Searing Heat',
    description: 'Rank 1: Enemies take +1d6 fire damage when they take fire damage while already burning. Rank 2: Enemies take +2d6 fire damage when they take fire damage while already burning. Rank 3: Enemies take +3d6 fire damage when they take fire damage while already burning. Rank 4: Enemies take +4d6 fire damage when they take fire damage while already burning.',
    icon: 'spell_fire_incinerate',
    maxRanks: 4,
    position: { x: 2, y: 2 },
    requires: 'wildfire_t1_chain_reaction',
  },
  {
    id: 'wildfire_t2_infernal_rain',
    name: 'Infernal Rain',
    description: 'Unlocks Infernal Rain - rain of fire in 40ft radius deals 2d8 damage per round for 4 rounds.',
    icon: 'spell_fire_meteorstorm',
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: 'wildfire_t1_wild_growth',
  },

  // Tier 3 - Blaze intensifies (Left branch expansion)
  {
    id: 'wildfire_t3_pandemic',
    name: 'Pandemic',
    description: 'Rank 1: Your fire DoT effects can spread to nearby enemies. Roll 1d6 when a DoT ticks: on 4+ spread. Rank 2: Your fire DoT effects can spread to nearby enemies. Roll 1d6 when a DoT ticks: on 3+ spread. Rank 3: Your fire DoT effects can spread to nearby enemies. Roll 1d6 when a DoT ticks: on 2+ spread.',
    icon: 'spell_fire_flare',
    maxRanks: 3,
    position: { x: 0, y: 3 },
    requires: 'wildfire_t2_firestorm',
  },
  {
    id: 'wildfire_t3_heat_wave',
    name: 'Heat Wave',
    description: 'Unlocks Heat Wave - 60ft cone dealing 4d8 fire damage. Creates ground fire in the area.',
    icon: 'spell_fire_twilightfireward',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'wildfire_t2_searing_heat',
  },

  // Tier 3 - Right branch expansion (Asymmetric growth)
  {
    id: 'wildfire_t3_burn_out',
    name: 'Burn Out',
    description: 'When fire DoT effects expire, roll 1d6. On 5+: explode dealing 2d6 fire damage to the target.',
    icon: 'spell_fire_burnout',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'wildfire_t2_infernal_rain',
  },
  {
    id: 'wildfire_t3_lingering_flames',
    name: 'Lingering Flames',
    description: 'Rank 1: Your fire DoT effects reduce enemy movement speed by 5ft. Rank 2: Your fire DoT effects reduce enemy movement speed by 10ft. Rank 3: Your fire DoT effects reduce enemy movement speed by 15ft. Rank 4: Your fire DoT effects reduce enemy movement speed by 20ft.',
    icon: 'spell_fire_burnout',
    maxRanks: 4,
    position: { x: 4, y: 3 },
    requires: 'wildfire_t2_infernal_rain',
  },

  // Tier 4 - Inferno builds (Left side dominance)
  {
    id: 'wildfire_t4_world_fire',
    name: 'World on Fire',
    description: 'All ground fire patches are connected. Moving between patches costs 2x movement and deals 1d8 damage.',
    icon: 'spell_fire_moltenblood',
    maxRanks: 2,
    position: { x: 0, y: 4 },
    requires: 'wildfire_t3_pandemic',
  },
  {
    id: 'wildfire_t4_calamity',
    name: 'Calamity',
    description: 'Once per combat, create a field of endless flame in 50ft radius. Enemies take 3d6 fire damage per round.',
    icon: 'spell_fire_selfdestruct',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'wildfire_t3_heat_wave',
  },

  // Tier 4 - Right side growth (Wild expansion)
  {
    id: 'wildfire_t4_eternal_flame',
    name: 'Eternal Flame',
    description: 'Your fire effects cannot be extinguished by any means. They persist until their duration ends naturally.',
    icon: 'spell_fire_twilightflamebreath',
    maxRanks: 2,
    position: { x: 4, y: 4 },
    requires: 'wildfire_t3_burn_out',
  },

  // Tier 5 - Crown fire (Irregular convergence)
  {
    id: 'wildfire_t5_combustion_wave',
    name: 'Combustion Wave',
    description: 'Unlocks Combustion Wave - 60ft line dealing 6d6 fire damage. Enemies hit lose 2d6 HP at start of their turns for 3 rounds.',
    icon: 'spell_fire_incinerate',
    maxRanks: 3,
    position: { x: 1, y: 5 },
    requires: ['wildfire_t4_world_fire', 'wildfire_t4_calamity'],
    requiresAll: false,
  },
  {
    id: 'wildfire_t5_volcanic_eruption',
    name: 'Volcanic Eruption',
    description: 'Unlocks Volcanic Eruption - ground explodes in 20ft radius for 5d8 fire damage. Roll 1d6: on 5+, create lava pools.',
    icon: 'spell_fire_twilightfireward',
    maxRanks: 3,
    position: { x: 3, y: 5 },
    requires: ['wildfire_t4_calamity', 'wildfire_t4_eternal_flame'],
    requiresAll: false,
  },

  // Tier 6 - Ultimate wildfire (Central blaze)
  {
    id: 'wildfire_t6_apocalypse',
    name: 'Apocalypse',
    description: 'Unlocks Apocalypse - transform the battlefield into a hellscape. All enemies take 4d8 fire damage per round. Ground fire everywhere within 100ft.',
    icon: 'spell_fire_soulburn',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['wildfire_t5_combustion_wave', 'wildfire_t5_volcanic_eruption'],
    requiresAll: true,
  }
];

// Hellfire Specialization - Demonic chains wrapping around victims
export const PYROFIEND_HELLFIRE = [
  // Tier 0 - The Infernal Core (Center of the abyss)
  {
    id: 'hellfire_t0_demonic_resilience',
    name: 'Demonic Resilience',
    description: 'Rank 1: You gain +1 HP when ascending Inferno Levels. Fire damage cannot reduce you below 1 HP. Rank 2: You gain +2 HP when ascending Inferno Levels. Fire damage cannot reduce you below 1 HP. Rank 3: You gain +3 HP when ascending Inferno Levels. Fire damage cannot reduce you below 1 HP. Rank 4: You gain +4 HP when ascending Inferno Levels. Fire damage cannot reduce you below 1 HP. Rank 5: You gain +5 HP when ascending Inferno Levels. Fire damage cannot reduce you below 1 HP.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 5,
    position: { x: 2, y: 3 },
    requires: null,
  },

  // Tier 1 - First Chain Links (Wrapping around the core)
  {
    id: 'hellfire_t1_drain_life',
    name: 'Drain Life',
    description: 'Unlocks Drain Life - deal 3d6 fire damage to target, heal for the damage dealt.',
    icon: 'spell_shadow_lifedrain',
    maxRanks: 4,
    position: { x: 1, y: 2 },
    requires: 'hellfire_t0_demonic_resilience',
  },
  {
    id: 'hellfire_t1_dark_empowerment',
    name: 'Dark Empowerment',
    description: 'When you take damage, draw a card. Black cards ascend your Inferno Level by 1.',
    icon: 'spell_shadow_soulburn',
    maxRanks: 4,
    position: { x: 3, y: 2 },
    requires: 'hellfire_t0_demonic_resilience',
  },
  {
    id: 'hellfire_t1_soul_fire',
    name: 'Soul Fire',
    description: 'Rank 1: Your fire spells drain life. Deal +1d4 extra fire damage, heal for half the fire damage you deal. Rank 2: Your fire spells drain life. Deal +1d4 extra fire damage, heal for half the fire damage you deal. You have advantage on saving throws against being frightened. Rank 3: Your fire spells drain life. Deal +1d6 extra fire damage, heal for half the fire damage you deal. You have advantage on saving throws against being frightened. Rank 4: Your fire spells drain life. Deal +1d6 extra fire damage, heal for half the fire damage you deal. You have advantage on saving throws against being frightened and charmed.',
    icon: 'spell_fire_soulburn',
    maxRanks: 4,
    position: { x: 2, y: 1 },
    requires: 'hellfire_t0_demonic_resilience',
  },

  // Tier 2 - Chain Tightens (Constricting pattern)
  {
    id: 'hellfire_t2_soul_link',
    name: 'Soul Link',
    description: 'Rank 1: Link your life force to an enemy. Roll 1d6 when they take damage: on 4+ you heal for 1d6. Rank 2: Link your life force to an enemy. Roll 1d6 when they take damage: on 4+ you heal for 2d6. Rank 3: Link your life force to an enemy. Roll 1d6 when they take damage: on 4+ you heal for 3d6. Rank 4: Link your life force to an enemy. Roll 1d6 when they take damage: on 4+ you heal for 4d6.',
    icon: 'spell_shadow_soulburn',
    maxRanks: 4,
    position: { x: 0, y: 2 },
    requires: 'hellfire_t1_drain_life',
  },
  {
    id: 'hellfire_t2_demonic_shield',
    name: 'Demonic Shield',
    description: 'Rank 1: When you ascend to a new Inferno Level, gain a shield absorbing 1d6 damage per level reached. Rank 2: When you ascend to a new Inferno Level, gain a shield absorbing 2d6 damage per level reached. Rank 3: When you ascend to a new Inferno Level, gain a shield absorbing 3d6 damage per level reached.',
    icon: 'spell_fire_twilightfireward',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'hellfire_t1_dark_empowerment',
  },
  {
    id: 'hellfire_t2_immortal',
    name: 'Immortal',
    description: 'At Inferno Level 5+, you cannot die from HP loss. Instead, you enter a weakened state at 1 HP.',
    icon: 'spell_shadow_requiem',
    maxRanks: 2,
    position: { x: 2, y: 5 },
    requires: 'hellfire_t1_soul_fire',
  },

  // Tier 3 - Chains Multiply (Expanding web)
  {
    id: 'hellfire_t3_life_steal',
    name: 'Life Steal',
    description: 'Rank 1: Your fire damage heals you for 1 HP for every 4 damage dealt. Rank 2: Your fire damage heals you for 1 HP for every 4 damage dealt. You can spend 1 action point to regain 1d8 HP when below half health. Rank 3: Your fire damage heals you for 1 HP for every 4 damage dealt. You can spend 1 action point to regain 1d8 HP when below half health. Rank 4: Your fire damage heals you for 2 HP for every 4 damage dealt. You can spend 1 action point to regain 1d10 HP when below half health.',
    icon: 'spell_shadow_lifedrain',
    maxRanks: 4,
    position: { x: 1, y: 4 },
    requires: 'hellfire_t2_soul_link',
  },
  {
    id: 'hellfire_t3_dark_barrier',
    name: 'Dark Barrier',
    description: 'Enemies within 15ft have disadvantage on saving throws against your fire effects.',
    icon: 'spell_shadow_antishadow',
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: 'hellfire_t2_demonic_shield',
  },
  {
    id: 'hellfire_t3_demon_form',
    name: 'Demon Form',
    description: 'Rank 1: Unlocks Demon Form - transform for 1 minute. +2 armor, +1 to all saves, regenerate 1d8 HP per round. Rank 2: Unlocks Demon Form - transform for 1 minute. +4 armor, +2 to all saves, regenerate 2d8 HP per round. Rank 3: Unlocks Demon Form - transform for 1 minute. +6 armor, +3 to all saves, regenerate 3d8 HP per round.',
    icon: 'spell_shadow_metamorphosis',
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: 'hellfire_t2_immortal',
  },

  // Tier 4 - Binding Ritual (Outer chains complete)
  {
    id: 'hellfire_t4_hellish_aura',
    name: 'Hellish Aura',
    description: 'Rank 1: Enemies within 20ft take 1d6 fire damage at the start of your turn and have -1 to attack rolls. Rank 2: Enemies within 20ft take 2d6 fire damage at the start of your turn and have -2 to attack rolls. Rank 3: Enemies within 20ft take 3d6 fire damage at the start of your turn and have -3 to attack rolls.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 3,
    position: { x: 4, y: 4 },
    requires: 'hellfire_t3_dark_barrier',
  },
  {
    id: 'hellfire_t4_fear_realm',
    name: 'Fear Realm',
    description: 'Unlocks Fear Realm - create a 40ft zone of terror. Enemies must save or be frightened and take 2d6 psychic damage per round.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 3,
    position: { x: 0, y: 0 },
    requires: 'hellfire_t3_demon_form',
  },
  {
    id: 'hellfire_t4_abyssal_summoning',
    name: 'Abyssal Summoning',
    description: 'Unlocks Abyssal Summoning - summon a lesser demon. Roll 1d6: on 4+, summon succeeds.',
    icon: 'spell_shadow_summonimp',
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: 'hellfire_t3_demon_form',
  },

  // Tier 5 - Soul Consumption (Chains converge)
  {
    id: 'hellfire_t5_soul_harvest',
    name: 'Soul Harvest',
    description: 'Unlocks Soul Harvest - consume enemy souls in 30ft radius. Deal 3d8 damage, heal for total damage.',
    icon: 'spell_shadow_soulburn',
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: ['hellfire_t4_fear_realm', 'hellfire_t4_hellish_aura'],
    requiresAll: false,
  },
  {
    id: 'hellfire_t5_eternal_torment',
    name: 'Eternal Torment',
    description: 'Enemies killed by your fire damage rise as undead servants under your control. Draw a card: black cards make them stronger.',
    icon: 'spell_shadow_requiem',
    maxRanks: 3,
    position: { x: 3, y: 0 },
    requires: 'hellfire_t4_hellish_aura',
  },
  {
    id: 'hellfire_t5_demonic_dominion',
    name: 'Demonic Dominion',
    description: 'Rank 1: Your summoned demons gain +2 to all rolls and deal +1d6 fire damage. Rank 2: Your summoned demons gain +4 to all rolls and deal +2d6 fire damage. Rank 3: Your summoned demons gain +6 to all rolls and deal +3d6 fire damage.',
    icon: 'spell_shadow_antishadow',
    maxRanks: 3,
    position: { x: 2, y: 6 },
    requires: ['hellfire_t4_abyssal_summoning', 'hellfire_t3_life_steal'],
    requiresAll: false,
  },

  // Tier 6 - Hell's Embrace (Ultimate binding)
  {
    id: 'hellfire_t6_prince_of_hell',
    name: 'Prince of Hell',
    description: 'Unlocks Hell Portal - open a portal to the Abyss. Summon unlimited demonic minions and deal 6d8 fire damage in 60ft radius per round.',
    icon: 'spell_shadow_soulburn',
    maxRanks: 1,
    position: { x: 2, y: 0 },
    requires: ['hellfire_t5_soul_harvest', 'hellfire_t5_eternal_torment', 'hellfire_t5_demonic_dominion'],
    requiresAll: true,
  }
];
