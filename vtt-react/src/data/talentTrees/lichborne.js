// ============================================
// LICHBORNE TALENT TREES
// ============================================

export const LICHBORNE_FROSTBOUND_TYRANT = [
  // Tier 0 - Foundation (Central frost focus)
  {
    id: 'frostbound_t0_eternal_focus',
    name: 'Eternal Focus',
    description: 'Your Eternal Frost Aura reduces chill duration to 1 round instead of 1 turn. +1 to chill save DC per rank.',
    icon: 'spell_frost_frostarmor02',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Basic freeze enhancement (Central expansion)
  {
    id: 'frostbound_t1_chilling_presence',
    name: 'Chilling Presence',
    description: 'Enemies within 10ft of frozen targets must save or be chilled. +5ft radius per rank.',
    icon: 'spell_frost_frostshock',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'frostbound_t0_eternal_focus',
  },
  {
    id: 'frostbound_t1_frozen_precision',
    name: 'Frozen Precision',
    description: 'Frost spells have +1d4 bonus to hit frozen targets. Bonus increases by +1d4 per rank.',
    icon: 'spell_frost_frostbolt',
    maxRanks: 2,
    position: { x: 3, y: 1 },
    requires: 'frostbound_t0_eternal_focus',
  },

  // Tier 2 - Advanced freezing (Branching paths)
  {
    id: 'frostbound_t2_glacial_shards',
    name: 'Glacial Shards',
    description: 'Frozen targets that take damage shatter, dealing 1d6 frost damage to adjacent enemies per rank.',
    icon: 'spell_frost_icestorm',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'frostbound_t1_chilling_presence',
  },
  {
    id: 'frostbound_t2_ice_bond',
    name: 'Ice Bond',
    description: 'Frozen targets share 50% of damage taken with other frozen targets within 20ft. Sharing range increases by 5ft per rank.',
    icon: 'spell_frost_frozencore',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: 'frostbound_t1_chilling_presence',
  },
  {
    id: 'frostbound_t2_crystal_fracture',
    name: 'Crystal Fracture',
    description: 'When you freeze a target, adjacent frozen targets have their freeze duration extended by 1 round per rank. Extension range increases by 5ft per rank.',
    icon: 'spell_frost_frostnova',
    maxRanks: 2,
    position: { x: 4, y: 2 },
    requires: 'frostbound_t1_frozen_precision',
  },

  // Tier 3 - Master freeze control (Further specialization)
  {
    id: 'frostbound_t3_permafrost_dominion',
    name: 'Permafrost Dominion',
    description: 'Frozen targets cannot be healed. Healing effects on frozen targets instead deal frost damage equal to healing amount.',
    icon: 'spell_frost_wisp',
    maxRanks: 1,
    position: { x: 1, y: 3 },
    requires: 'frostbound_t2_glacial_shards',
  },
  {
    id: 'frostbound_t3_absolute_zero',
    name: 'Absolute Zero',
    description: 'Frozen targets have vulnerability to all damage. +1d6 frost damage per rank to frozen targets.',
    icon: 'spell_frost_arcticwinds',
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: 'frostbound_t2_crystal_fracture',
  },

  // Tier 4 - Elite freezing mastery (Convergence)
  {
    id: 'frostbound_t4_frozen_eternity',
    name: 'Frozen Eternity',
    description: 'Freeze effects become permanent until dispelled. Frozen targets cannot take actions or reactions.',
    icon: 'spell_frost_frozencore',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: 'frostbound_t3_permafrost_dominion',
    requiresPoints: 20,
  }
];

// Spectral Reaper Specialization - Scythe Harvest Pattern (Death's Harvest)
export const LICHBORNE_SPECTRAL_REAPER = [
  // Tier 0 - Foundation (Central necrotic seed)
  {
    id: 'spectral_t0_necrotic_essence',
    name: 'Necrotic Essence',
    description: 'Your frost spells deal +1d4 necrotic damage per rank. Enemies killed by your spells rise as spectral minions.',
    icon: 'spell_shadow_soulleech_3',
    maxRanks: 4,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Hybrid damage paths (Dual branching)
  {
    id: 'spectral_t1_deathly_echo',
    name: 'Deathly Echo',
    description: 'When an enemy dies from your hybrid spells, they explode, dealing 1d8 necrotic damage in 10ft radius per rank.',
    icon: 'spell_shadow_deathanddecay',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'spectral_t0_necrotic_essence',
  },
  {
    id: 'spectral_t1_spectral_harvest',
    name: 'Spectral Harvest',
    description: 'Spectral minions deal +1d6 damage per rank. Minions last 2 additional rounds.',
    icon: 'spell_shadow_soulleech_2',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'spectral_t0_necrotic_essence',
  },

  // Tier 2 - Minion specialization (Left path)
  {
    id: 'spectral_t2_reaper_command',
    name: 'Reaper Command',
    description: 'Command up to 2 spectral minions per rank as a 1 action point. Minions can attack or defend. Minion HP increases by 1d6 per rank.',
    icon: 'spell_shadow_requiem',
    maxRanks: 2,
    position: { x: 0, y: 2 },
    requires: 'spectral_t1_deathly_echo',
  },
  {
    id: 'spectral_t2_spectral_swarm',
    name: 'Spectral Swarm',
    description: 'When you have 3+ spectral minions, they form a swarm, dealing 2d6 necrotic damage per rank to enemies in 15ft. Swarm radius increases by 5ft per rank.',
    icon: 'spell_shadow_gathershadows',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'spectral_t1_deathly_echo',
  },
  {
    id: 'spectral_t2_necrotic_link',
    name: 'Necrotic Link',
    description: 'Spectral minions share 50% of damage taken by you. You heal for 1d6 HP per rank when a minion dies. Minions gain +1 armor per rank.',
    icon: 'spell_shadow_lifedrain02',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'spectral_t1_deathly_echo',
  },

  // Tier 2 - Damage specialization (Right path)
  {
    id: 'spectral_t2_deathly_precision',
    name: 'Deathly Precision',
    description: 'Hybrid spells ignore resistance to frost or necrotic damage. +10% to hit per rank vs undead targets. +1d4 necrotic damage per rank to undead.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: 'spectral_t1_spectral_harvest',
  },
  {
    id: 'spectral_t2_obliteration_wave',
    name: 'Obliteration Wave',
    description: 'Frost spells create waves of necrotic energy, dealing 1d8 necrotic damage per rank to enemies in 10ft line.',
    icon: 'spell_shadow_unholyfrenzy',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'spectral_t1_spectral_harvest',
  },

  // Tier 3 - Elite abilities (Convergence and specialization)
  {
    id: 'spectral_t3_necrotic_dominion',
    name: 'Necrotic Dominion',
    description: 'All enemies within 30ft take 1d6 necrotic damage per round per rank. Damage doubled vs undead.',
    icon: 'spell_shadow_deathanddecay',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'spectral_t2_spectral_swarm',
  },
  {
    id: 'spectral_t3_spectral_legion',
    name: 'Spectral Legion',
    description: 'Spectral minions can merge into a powerful wraith, dealing 3d8 necrotic damage per rank and controlling minds.',
    icon: 'spell_shadow_blackplague',
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: 'spectral_t2_obliteration_wave',
  },

  // Tier 4 - Ultimate reaping power
  {
    id: 'spectral_t4_apocalyptic_harvest',
    name: 'Apocalyptic Harvest',
    description: 'When you kill an enemy, all spectral minions deal their damage again. +1 max minion per rank.',
    icon: 'spell_shadow_unholyfrenzy',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'spectral_t3_necrotic_dominion',
    requiresPoints: 20,
  }
];

// Phylactery Guardian Specialization - Soul Shield Pattern (Protective Circles)
export const LICHBORNE_PHYLACTERY_GUARDIAN = [
  // Tier 0 - Foundation (Central phylactery focus)
  {
    id: 'phylactery_t0_soul_anchor',
    name: 'Soul Anchor',
    description: 'Phylactery resurrection cooldown reduced by 1 round per rank. +2 HP stored per successful ritual.',
    icon: 'spell_frost_frozencore',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - HP management (Balanced expansion)
  {
    id: 'phylactery_t1_vital_reserve',
    name: 'Vital Reserve',
    description: 'Store 1d6 additional HP per rank in Phylactery during rituals. Maximum Phylactery HP increased by 10 per rank.',
    icon: 'spell_shadow_lifedrain',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'phylactery_t0_soul_anchor',
  },
  {
    id: 'phylactery_t1_deathly_resilience',
    name: 'Deathly Resilience',
    description: 'Reduce Phylactery resurrection cost by 1 HP per rank. Resurrection revives you with +2 HP per rank.',
    icon: 'spell_shadow_antishadow',
    maxRanks: 2,
    position: { x: 3, y: 1 },
    requires: 'phylactery_t0_soul_anchor',
  },

  // Tier 2 - Defensive enhancements (Left defensive path)
  {
    id: 'phylactery_t2_ice_shield',
    name: 'Ice Shield',
    description: 'While Eternal Frost Aura is active, gain +2 armor per rank. Aura drain reduced by 1d6 HP.',
    icon: 'spell_frost_frostarmor',
    maxRanks: 2,
    position: { x: 0, y: 2 },
    requires: 'phylactery_t1_vital_reserve',
  },
  {
    id: 'phylactery_t2_frost_barrier',
    name: 'Frost Barrier',
    description: 'Create barriers of ice that absorb damage. Barrier has 3d6 HP per rank and lasts 2 rounds.',
    icon: 'spell_frost_icebarrier',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'phylactery_t1_vital_reserve',
  },

  // Tier 2 - Resurrection enhancements (Right path)
  {
    id: 'phylactery_t2_phylactery_link',
    name: 'Phylactery Link',
    description: 'Allies within 30ft can spend 5 HP to reduce damage you take by 1d6 per rank. Link range increases by 10ft per rank.',
    icon: 'spell_shadow_lifedrain02',
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: 'phylactery_t1_deathly_resilience',
  },
  {
    id: 'phylactery_t2_emergency_resurrection',
    name: 'Emergency Resurrection',
    description: 'Once per combat, automatically resurrect when reduced below 0 HP (costs double Phylactery HP).',
    icon: 'spell_shadow_deadofnight',
    maxRanks: 1,
    position: { x: 4, y: 2 },
    requires: 'phylactery_t1_deathly_resilience',
  },

  // Tier 3 - Master survivability (Convergence)
  {
    id: 'phylactery_t3_eternal_guardian',
    name: 'Eternal Guardian',
    description: 'Phylactery creates a protective field, reducing all damage by 2 per rank. Field lasts while Phylactery has HP.',
    icon: 'spell_frost_frozencore',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'phylactery_t2_frost_barrier',
  },
  {
    id: 'phylactery_t3_soul_siphon',
    name: 'Soul Siphon',
    description: 'When enemies die within 30ft, automatically store 1d4 HP per rank in Phylactery (maximum once per round). Siphon range increases by 10ft per rank.',
    icon: 'spell_shadow_soulleech_3',
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: 'phylactery_t2_emergency_resurrection',
  },

  // Tier 4 - Ultimate immortality
  {
    id: 'phylactery_t4_immortal_essence',
    name: 'Immortal Essence',
    description: 'Cannot be permanently killed while Phylactery has HP. Death instead costs 20 Phylactery HP and revives you at full HP.',
    icon: 'spell_frost_wisp',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: 'phylactery_t3_eternal_guardian',
    requiresPoints: 20,
  }
];
