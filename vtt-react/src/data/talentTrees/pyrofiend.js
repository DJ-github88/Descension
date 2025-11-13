// ============================================
// PYROFIEND TALENT TREES
// ============================================

export const PYROFIEND_INFERNO = [
  // Tier 0 - Foundation (Central column)
  {
    id: 'inferno_t0_burst_mastery',
    name: 'Burst Mastery',
    description: 'Your fire spells deal +1d6 damage per rank. Critical hits with fire spells ascend your Inferno Level by 1.',
    icon: 'spell_fire_fireball02',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Early power (Central expansion)
  {
    id: 'inferno_t1_critical_blast',
    name: 'Critical Blast',
    description: 'When you cast fire spells, roll 1d20. On 16+ per rank, the spell gains advantage on attack rolls. Critical hits deal double damage dice.',
    icon: 'spell_fire_incinerate',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'inferno_t0_burst_mastery',
  },
  {
    id: 'inferno_t1_rapid_ascent',
    name: 'Rapid Ascent',
    description: 'Your Inferno Level increases twice as fast. Draw a card when you deal fire damage: red cards grant +1 Inferno Level.',
    icon: 'spell_fire_soulburn',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'inferno_t0_burst_mastery',
  },

  // Tier 2 - Branching paths (Left and right expansion)
  {
    id: 'inferno_t2_inner_fire',
    name: 'Inner Fire',
    description: 'You gain +1d4 bonus fire damage per rank for each point of Inferno Level you have.',
    icon: 'spell_fire_flamebolt',
    maxRanks: 4,
    position: { x: 0, y: 2 },
    requires: 'inferno_t1_critical_blast',
  },
  {
    id: 'inferno_t2_detonation',
    name: 'Detonation',
    description: 'Unlocks Detonation - consume your Inferno Level to deal 1d12 fire damage per point consumed in a 20ft radius.',
    icon: 'spell_fire_selfdestruct',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'inferno_t1_critical_blast',
  },
  {
    id: 'inferno_t2_fiery_resurgence',
    name: 'Fiery Resurgence',
    description: 'When you spend Inferno Levels, draw a card. Red cards restore 1d6 HP per Inferno Level spent.',
    icon: 'spell_fire_fire',
    maxRanks: 4,
    position: { x: 4, y: 2 },
    requires: 'inferno_t1_rapid_ascent',
  },

  // Tier 3 - Specialization (Further expansion)
  {
    id: 'inferno_t3_overcharge',
    name: 'Overcharge',
    description: 'When you reach maximum Inferno Level, your next fire spell costs no resources and deals +1d6 fire damage per rank.',
    icon: 'spell_fire_moltenblood',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'inferno_t2_inner_fire',
  },
  {
    id: 'inferno_t3_ascended_burst',
    name: 'Ascended Burst',
    description: 'Unlocks Ascended Burst - deal 4d8 fire damage. For each Inferno Level above 5, add +1d8.',
    icon: 'spell_fire_fireball',
    maxRanks: 3,
    position: { x: 2, y: 3 },
    requires: 'inferno_t2_detonation',
  },
  {
    id: 'inferno_t3_immolation',
    name: 'Immolation',
    description: 'Enemies within 5ft take 1d6 fire damage per rank at the start of your turn.',
    icon: 'spell_fire_sealoffire',
    maxRanks: 5,
    position: { x: 3, y: 3 },
    requires: 'inferno_t2_fiery_resurgence',
  },

  // Tier 4 - Advanced abilities (Outer expansion)
  {
    id: 'inferno_t4_maximum_power',
    name: 'Maximum Power',
    description: 'At Inferno Level 9, all fire damage dice roll twice, take higher result.',
    icon: 'spell_fire_twilightfireward',
    maxRanks: 2,
    position: { x: 0, y: 4 },
    requires: 'inferno_t3_overcharge',
  },
  {
    id: 'inferno_t4_power_surge',
    name: 'Power Surge',
    description: 'After spending 3+ Inferno Levels in one turn, gain advantage on all attack rolls for 1 round.',
    icon: 'spell_fire_burnout',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'inferno_t3_ascended_burst',
  },
  {
    id: 'inferno_t4_heat_death',
    name: 'Heat Death',
    description: 'When an enemy dies from your fire damage, draw a card. Black cards ascend your Inferno Level by 1.',
    icon: 'spell_fire_meteorstorm',
    maxRanks: 3,
    position: { x: 4, y: 4 },
    requires: 'inferno_t3_immolation',
  },

  // Tier 5 - Elite talents (Converging paths)
  {
    id: 'inferno_t5_critical_cascade',
    name: 'Critical Cascade',
    description: 'Critical fire hits cause a chain reaction. Flip a coin: on heads, hit another nearby enemy for half damage.',
    icon: 'spell_fire_flare',
    maxRanks: 3,
    position: { x: 1, y: 5 },
    requires: ['inferno_t4_maximum_power', 'inferno_t4_power_surge'],
    requiresAll: false,
  },
  {
    id: 'inferno_t5_permanent_inferno',
    name: 'Permanent Inferno',
    description: 'You can no longer descend below Inferno Level 3. At Level 9, you deal +1d12 fire damage with all attacks per rank.',
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
    description: 'When you deal fire damage, roll 1d20. On 16+ per rank, the damage jumps to a nearby enemy for half damage.',
    icon: 'spell_fire_flare',
    maxRanks: 4,
    position: { x: 1, y: 0 },
    requires: null,
  },
  {
    id: 'wildfire_t0_ground_fire',
    name: 'Ground Fire',
    description: 'Fire spells create patches of flame. Enemies entering these areas take 1d8 fire damage per rank.',
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
    description: 'Ground fire patches grow larger. Each patch now affects 10ft radius instead of 5ft per rank.',
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
    description: 'Enemies take +1d6 fire damage per rank when they take fire damage while already burning.',
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
    description: 'Your fire DoT effects can spread to nearby enemies. Roll 1d6 when a DoT ticks: on 4+ per rank, spread.',
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
    description: 'Your fire DoT effects reduce enemy movement speed by 5ft per rank.',
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
    description: 'You gain +1 HP per rank when ascending Inferno Levels. Fire damage cannot reduce you below 1 HP.',
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
    description: 'Your fire spells drain life. Deal +1d4 fire damage per rank, heal for half the fire damage you deal.',
    icon: 'spell_fire_soulburn',
    maxRanks: 4,
    position: { x: 2, y: 1 },
    requires: 'hellfire_t0_demonic_resilience',
  },

  // Tier 2 - Chain Tightens (Constricting pattern)
  {
    id: 'hellfire_t2_soul_link',
    name: 'Soul Link',
    description: 'Link your life force to an enemy. Roll 1d6 per rank when they take damage: on 4+, you heal for 1d6.',
    icon: 'spell_shadow_soulburn',
    maxRanks: 4,
    position: { x: 0, y: 2 },
    requires: 'hellfire_t1_drain_life',
  },
  {
    id: 'hellfire_t2_demonic_shield',
    name: 'Demonic Shield',
    description: 'When you ascend to a new Inferno Level, gain a shield absorbing 1d6 damage per level reached per rank.',
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
    description: 'Your fire damage heals you for 1 HP per rank for every 4 damage dealt.',
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
    description: 'Unlocks Demon Form - transform for 1 minute. +2 AC per rank, +1 to all saves, regenerate 1d8 HP per round.',
    icon: 'spell_shadow_metamorphosis',
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: 'hellfire_t2_immortal',
  },

  // Tier 4 - Binding Ritual (Outer chains complete)
  {
    id: 'hellfire_t4_hellish_aura',
    name: 'Hellish Aura',
    description: 'Enemies within 20ft take 1d6 fire damage per rank at the start of your turn and have -1 to attack rolls per rank.',
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
    description: 'Your summoned demons gain +2 to all rolls per rank and deal +1d6 fire damage.',
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
