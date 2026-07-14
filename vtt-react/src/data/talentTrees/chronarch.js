// ============================================
// CHRONARCH TALENT TREES
// ============================================
//
// Design: Spell modifiers + resource passives
// No dice procs, card draws, chronal points, or paradox tokens.
// Every talent modifies existing spells, Shard generation, or Strain costs.
//
// Tree 1: Arc of Stasis (Control)
// Tree 2: Arc of Displacement (Mobility)
// Tree 3: Arc of Rewinding (Undoing)
// ============================================

// ============================================
// ARC OF STASIS - Control & Battlefield Lockdown
// Enhances freeze/stun effects, extends control durations,
// and improves save DCs on temporal control spells.
// ============================================
export const CHRONARCH_STASIS_TREE = [
  // Tier 0 - Foundation
  {
    id: 'stasis_t0_temporal_precision',
    name: 'Temporal Precision',
    description: 'A single tick of the Sundrift clock can rewrite destinies. Stasis Field save DC increased by +1 per rank.',
    icon: 'spell_holy_borrowedtime',
    maxRanks: 2,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Branch
  {
    id: 'stasis_t1_frozen_momentum',
    name: 'Frozen Momentum',
    description: 'Time Shards crystallize when the fabric of reality is torn asunder. Gain +1 Time Shard whenever you freeze or stun an enemy.',
    icon: 'spell_frost_stun',
    maxRanks: 1,
    position: { x: 1, y: 1 },
    requires: 'stasis_t0_temporal_precision',
  },
  {
    id: 'stasis_t1_sustained_stasis',
    name: 'Sustained Stasis',
    description: 'The constellations hold their breath as moments stretch into eternities. Stasis Field and Temporal Shockwave duration +1 round per rank.',
    icon: 'spell_nature_slow',
    maxRanks: 2,
    position: { x: 3, y: 1 },
    requires: 'stasis_t0_temporal_precision',
  },

  // Tier 2 - Spread
  {
    id: 'stasis_t2_strain_efficiency',
    name: 'Strain Efficiency',
    description: 'Sundrift magic exacts its toll, but mastery lessens the burden. Control-tagged Flux abilities cost -1 Temporal Strain per rank (minimum 1).',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 2,
    position: { x: 0, y: 2 },
    requires: 'stasis_t1_frozen_momentum',
  },
  {
    id: 'stasis_t2_chronal_lockdown',
    name: 'Chronal Lockdown',
    description: 'Frozen in a web of temporal threads, escape becomes a distant memory. Enemies frozen or stunned by your spells have -2 to their save to break free per rank.',
    icon: 'spell_frost_stun',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'stasis_t1_sustained_stasis',
  },
  {
    id: 'stasis_t2_barrier_strength',
    name: 'Barrier Strength',
    description: 'The barrier between now and then grows thick with woven time. Temporal Barrier grants +5 temporary HP per rank and lasts +1 round.',
    icon: 'spell_holy_borrowedtime',
    maxRanks: 2,
    position: { x: 4, y: 2 },
    requires: 'stasis_t1_sustained_stasis',
  },

  // Tier 3 - Converge
  {
    id: 'stasis_t3_echo_dominance',
    name: 'Echo Dominance',
    description: 'Each echo carries the weight of a thousand unresolved moments. Temporal Echoes spawns +1 illusory copy per rank and echo damage increased by +1d6.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'stasis_t2_strain_efficiency',
  },
  {
    id: 'stasis_t3_fracture_mastery',
    name: 'Fracture Mastery',
    description: 'When time fractures, reality bleeds into the spaces between. Temporal Fracture DoT deals +1d6 necrotic damage per rank and lasts +1 round.',
    icon: 'spell_nature_timestop',
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: 'stasis_t2_barrier_strength',
  },

  // Tier 4 - Core power
  {
    id: 'stasis_t4_dominion_authority',
    name: 'Dominion Authority',
    description: 'The Sundrift crown bestows authority over all that is and was. Temporal Flux: Dominion affects a +10ft larger radius per rank and you are immune to its slow effect.',
    icon: 'spell_nature_timestop',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'stasis_t3_fracture_mastery',
  },

  // Tier 5 - Spread
  {
    id: 'stasis_t5_shockwave_resonance',
    name: 'Shockwave Resonance',
    description: 'Resonance builds as the temporal tide crashes against fate\'s shore. Temporal Shockwave deals +2d6 force damage per rank and its freeze save DC increases by +2.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 1, y: 5 },
    requires: 'stasis_t4_dominion_authority',
  },
  {
    id: 'stasis_t5_temporal_supremacy',
    name: 'Temporal Supremacy',
    description: 'To master time is to speak the language of the stars themselves. Temporal Mastery Strain cost reduced by -2 per rank. Its slow radius increased by +10ft per rank.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 2,
    position: { x: 3, y: 5 },
    requires: 'stasis_t4_dominion_authority',
  },

  // Tier 6 - Ultimate
  {
    id: 'stasis_t6_avatar_of_stasis',
    name: 'Avatar of Stasis',
    description: 'In that frozen breath between heartbeats, the Sundrift archon imposes their will. Once per combat: freeze all enemies within 40ft for 1 round, no save. Costs 6 Time Shards, adds 5 Temporal Strain.',
    icon: 'spell_nature_timestop',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['stasis_t5_shockwave_resonance', 'stasis_t5_temporal_supremacy'],
    requiresAll: true,
  }
];

// ============================================
// ARC OF DISPLACEMENT - Mobility & Repositioning
// Enhances teleportation range, speed buffs, AoE sizes,
// and Strain efficiency on movement-based Flux abilities.
// ============================================
export const CHRONARCH_DISPLACEMENT_TREE = [
  // Tier 0 - Foundation (two entry points)
  {
    id: 'disp_t0_swift_temporal',
    name: 'Swift Temporal',
    description: 'The Sundrift guides each step along the threads of possibility. Temporal Step range increased by +10ft per rank.',
    icon: 'spell_arcane_blink',
    maxRanks: 2,
    position: { x: 0, y: 0 },
    requires: null,
  },
  {
    id: 'disp_t0_chronal_echo',
    name: 'Chronal Echo Boost',
    description: 'An echo lingers in the Sundrift long after the source has moved on. Chrono Echo radius increased by +5ft per rank and duration +1 round.',
    icon: 'spell_nature_mirrorimage',
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
  },

  // Tier 1 - Branch
  {
    id: 'disp_t1_repositioning_shards',
    name: 'Repositioning Shards',
    description: 'Every displacement sends ripples through the temporal tapestry. Gain +1 Time Shard whenever you teleport an ally or enemy.',
    icon: 'spell_nature_timestop',
    maxRanks: 1,
    position: { x: 1, y: 1 },
    requires: 'disp_t0_swift_temporal',
  },
  {
    id: 'disp_t1_dilation_expansion',
    name: 'Dilation Expansion',
    description: 'The Sundrift expands to embrace all who walk its currents. Temporal Dilation AoE radius increased by +5ft per rank.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 2,
    position: { x: 3, y: 1 },
    requires: 'disp_t0_chronal_echo',
  },

  // Tier 2 - Spread
  {
    id: 'disp_t2_phase_mastery',
    name: 'Phase Mastery',
    description: 'Speed is but a gift from the Sundrift\'s patient flow. Temporal Flux: Speed grants +10ft additional movement speed per rank.',
    icon: 'spell_arcane_blink',
    maxRanks: 2,
    position: { x: 0, y: 2 },
    requires: 'disp_t1_repositioning_shards',
  },
  {
    id: 'disp_t2_crystal_tuning',
    name: 'Crystal Tuning',
    description: 'Crystals of frozen time hum with the music of the spheres. Time Crystal zone radius increased by +5ft per rank. Haste Mode speed bonus +0.25x per rank.',
    icon: 'spell_nature_timestop',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: 'disp_t1_dilation_expansion',
  },
  {
    id: 'disp_t2_disruption_range',
    name: 'Disruption Range',
    description: 'Disruption spreads like cracks in the Sundrift\'s glassy surface. Chronal Disruption AoE radius increased by +5ft per rank and damage +1d6 force per rank.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 4, y: 2 },
    requires: 'disp_t1_dilation_expansion',
  },

  // Tier 3 - Converge
  {
    id: 'disp_t3_vortex_durability',
    name: 'Vortex Durability',
    description: 'Vortices of temporal energy pulse with the Sundrift\'s rhythm. Temporal Vortex summon HP increased by +25 per rank and duration +1 round per rank.',
    icon: 'spell_nature_mirrorimage',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'disp_t2_phase_mastery',
  },
  {
    id: 'disp_t3_anchor_weight',
    name: 'Anchor Weight',
    description: 'The anchor sinks deep into the Sundrift\'s endless current. Temporal Anchor slow effect: enemies lose an additional -10ft speed per rank. Duration +1 round.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: 'disp_t2_disruption_range',
  },

  // Tier 4 - Core power
  {
    id: 'disp_t4_chamber_amplification',
    name: 'Chamber Amplification',
    description: 'The chamber resonates with the Sundrift\'s ancient song. Temporal Echo Chamber echo damage increased by +1d6 force per rank and duration +1 round.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'disp_t3_anchor_weight',
  },

  // Tier 5 - Spread
  {
    id: 'disp_t5_fate_intervention',
    name: 'Fate Intervention',
    description: 'Fate bends to the will of those who read the constellations. Fate Manipulation AoE radius +10ft per rank. Save DC increased by +2 per rank.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 2,
    position: { x: 1, y: 5 },
    requires: 'disp_t4_chamber_amplification',
  },
  {
    id: 'disp_t5_paradox_mastery',
    name: 'Paradox Mastery',
    description: 'Paradoxes bloom like stars in the Sundrift\'s deepest reaches. Chronal Paradox confusion damage increased by +1d6 psychic per rank. Save DC +2 per rank.',
    icon: 'spell_nature_timestop',
    maxRanks: 2,
    position: { x: 3, y: 5 },
    requires: 'disp_t4_chamber_amplification',
  },

  // Tier 6 - Ultimate
  {
    id: 'disp_t6_chronal_vortex_master',
    name: 'Chronal Vortex Master',
    description: 'The vortex\'s master commands the Sundrift\'s full fury. Chronal Vortex cost reduced by -3 Time Shards and -2 Temporal Strain. Allies healed are also granted +15 temporary HP.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['disp_t5_fate_intervention', 'disp_t5_paradox_mastery'],
    requiresAll: true,
  }
];

// ============================================
// ARC OF REWINDING - Undoing Anything
// Enhances healing/rewind power, adds debuff removal,
// enables stripping enemy buffs, and broadens
// 'undoing' beyond just damage restoration.
// ============================================
export const CHRONARCH_REWINDING_TREE = [
  // Tier 0 - Foundation
  {
    id: 'rewind_t0_mending_threads',
    name: 'Mending Threads',
    description: 'Threads of time weave together to mend what was broken. Temporal Mend healing increased by +1d8 per rank.',
    icon: 'spell_holy_borrowedtime',
    maxRanks: 2,
    position: { x: 1, y: 0 },
    requires: null,
  },
  {
    id: 'rewind_t0_rewind_depth',
    name: 'Rewind Depth',
    description: 'The Sundrift allows glimpses of what came before. Temporal Rewind restores +10% of damage taken per rank (up to 70% at rank 2).',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 2,
    position: { x: 3, y: 0 },
    requires: null,
  },

  // Tier 1 - Branch
  {
    id: 'rewind_t1_restoration_shards',
    name: 'Restoration Shards',
    description: 'Restoration gathers like starlight on the Sundrift\'s horizon. Gain +1 Time Shard whenever you heal or restore an ally above 50% of the amount restored.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 1,
    position: { x: 0, y: 1 },
    requires: 'rewind_t0_mending_threads',
  },
  {
    id: 'rewind_t1_purifying_rewind',
    name: 'Purifying Rewind',
    description: 'Purification flows through the Sundrift like a cleansing tide. Temporal Flux: Rewind removes +1 additional debuff per rank from each ally.',
    icon: 'spell_holy_borrowedtime',
    maxRanks: 2,
    position: { x: 2, y: 1 },
    requires: 'rewind_t0_mending_threads',
  },
  {
    id: 'rewind_t1_strain_absorption',
    name: 'Strain Absorption',
    description: 'The Sundrift absorbs the strain of mending broken timelines. Healing-tagged Flux abilities cost -1 Temporal Strain per rank (minimum 1).',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 2,
    position: { x: 4, y: 1 },
    requires: 'rewind_t0_rewind_depth',
  },

  // Tier 2 - Spread
  {
    id: 'rewind_t2_shield_reinforcement',
    name: 'Shield Reinforcement',
    description: 'Shields woven from the Sundrift\'s fabric hold fast against harm. Temporal Flux: Shield grants +5 additional temporary HP per rank and healing +1d8 per rank.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 2,
    position: { x: 1, y: 2 },
    requires: 'rewind_t1_purifying_rewind',
  },
  {
    id: 'rewind_t2_buff_reversal',
    name: 'Buff Reversal',
    description: 'What was done can be undone when the Sundrift bends to your will. Your rewind spells (Temporal Rewind, Chronal Reversal) can also target enemies. When cast on an enemy, strip 1 buff per rank instead of healing.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 2,
    position: { x: 3, y: 2 },
    requires: 'rewind_t1_strain_absorption',
  },

  // Tier 3 - Converge
  {
    id: 'rewind_t3_reversal_power',
    name: 'Reversal Power',
    description: 'Reversal is but the Sundrift turning back upon itself. Chronal Reversal healing increased by +2d6 per rank. Cooldown reduced by -1 turn per rank.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 0, y: 3 },
    requires: 'rewind_t2_shield_reinforcement',
  },
  {
    id: 'rewind_t3_loop_mastery',
    name: 'Loop Mastery',
    description: 'Loops in the Sundrift bind fates together in endless dance. Temporal Loop duration +1 round per rank and save DC +2 per rank.',
    icon: 'spell_nature_timestop',
    maxRanks: 2,
    position: { x: 2, y: 3 },
    requires: 'rewind_t2_buff_reversal',
  },
  {
    id: 'rewind_t3_terrain_undo',
    name: 'Terrain Undo',
    description: 'The Sundrift remembers the shape of the world before it was broken. Temporal Loop and Reality Fracture can also revert terrain hazards and environmental effects in their area.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 1,
    position: { x: 4, y: 3 },
    requires: 'rewind_t2_buff_reversal',
  },

  // Tier 4 - Core power
  {
    id: 'rewind_t4_resurrection_mastery',
    name: 'Resurrection Mastery',
    description: 'Resurrection is the Sundrift\'s most sacred gift to its chosen. Temporal Flux: Resurrection Time Shard cost reduced by -2 per rank. Resurrected ally gains +10 temporary HP per rank.',
    icon: 'spell_holy_borrowedtime',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'rewind_t3_loop_mastery',
  },

  // Tier 5 - Spread
  {
    id: 'rewind_t5_fracture_undo',
    name: 'Fracture Undo',
    description: 'Fractures in the Sundrift can be turned toward mending. Reality Fracture now also heals allies in its area for 3d6 + spirit. Strain cost reduced by -1 per rank.',
    icon: 'spell_nature_timestop',
    maxRanks: 2,
    position: { x: 1, y: 5 },
    requires: 'rewind_t4_resurrection_mastery',
  },
  {
    id: 'rewind_t5_restoration_supreme',
    name: 'Restoration Supreme',
    description: 'The Sundrift\'s restorative power knows no bounds. Chronal Restoration healing increased by +3d6 per rank. Damage reduction increased to 65% at rank 1, 75% at rank 2.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 3, y: 5 },
    requires: 'rewind_t4_resurrection_mastery',
  },

  // Tier 6 - Ultimate
  {
    id: 'rewind_t6_chronos_restoration',
    name: 'Temporal Undoing',
    description: 'When the Sundrift fully turns, all of existence bends to its will. Once per combat: revert the entire battlefield to its state from 2 rounds ago, ally HP, enemy HP, positioning, and active effects all reset. Costs 8 Time Shards, adds 7 Temporal Strain.',
    icon: 'spell_nature_timestop',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['rewind_t5_fracture_undo', 'rewind_t5_restoration_supreme'],
    requiresAll: true,
  }
];
