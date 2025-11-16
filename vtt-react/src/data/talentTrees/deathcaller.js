// ============================================
// DEATHCALLER TALENT TREES
// ============================================

export const DEATHCALLER_BLOOD_REAVER = [
  // Tier 0 - Foundation (Forward position for aggressive playstyle)
  {
    id: 'deathcaller_blood_t0_sanguine_mastery',
    name: 'Sanguine Mastery',
    description: 'Your blood sacrifices are more efficient. Blood Token generation increases by 1 per rank. Health costs for spells are reduced by 1d4.',
    icon: 'spell_shadow_lifedrain02',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Melee enhancement (Aggressive forward positioning)
  {
    id: 'deathcaller_blood_t1_blood_rush',
    name: 'Blood Rush',
    description: 'After casting a life drain spell, gain +10ft movement speed per rank for 2 turns.',
    icon: 'spell_shadow_bloodboil',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'deathcaller_blood_t0_sanguine_mastery',
  },
  {
    id: 'deathcaller_blood_t1_drain_efficiency',
    name: 'Drain Efficiency',
    description: 'Life drain spells restore 10% more HP per rank. Life drain spells cost 2 less mana.',
    icon: 'spell_shadow_lifedrain',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'deathcaller_blood_t0_sanguine_mastery',
  },

  // Tier 2 - Combat prowess (Offset positioning for dynamic movement)
  {
    id: 'deathcaller_blood_t2_rush_of_blood',
    name: 'Rush of Blood',
    description: 'When you drop below 50% HP, life drain spells are cast as 1 action points per rank.',
    icon: 'spell_shadow_bloodboil',
    maxRanks: 2,
    position: { x: 4, y: 2 },
    requires: 'deathcaller_blood_t1_blood_rush',
  },
  {
    id: 'deathcaller_blood_t2_blood_token_mastery',
    name: 'Blood Token Mastery',
    description: 'Blood Tokens enhance life drain spells by +2d6 damage per token per rank (instead of +1d6).',
    icon: 'spell_shadow_soulleech_3',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'deathcaller_blood_t1_drain_efficiency',
  },
  {
    id: 'deathcaller_blood_t2_sanguine_burst',
    name: 'Sanguine Burst',
    description: 'Life drain spells create a burst of blood dealing 1d8 damage per rank to enemies within 10ft.',
    icon: 'spell_shadow_bloodboil',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'deathcaller_blood_t1_drain_efficiency',
  },

  // Tier 3 - Advanced blood magic (Expanded offensive capabilities)
  {
    id: 'deathcaller_blood_t3_blood_fury',
    name: 'Blood Fury',
    description: 'When you kill an enemy with a life drain spell, gain +1d6 damage per rank on all attacks for 2 turns.',
    icon: 'spell_shadow_bloodboil',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'deathcaller_blood_t2_rush_of_blood',
  },
  {
    id: 'deathcaller_blood_t3_vampiric_empowerment',
    name: 'Vampiric Empowerment',
    description: 'Life drain spells heal for an additional 2d6 HP per rank when cast on enemies below 50% HP.',
    icon: 'spell_shadow_lifedrain02',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'deathcaller_blood_t2_blood_token_mastery',
  },

  // Tier 4 - Master blood manipulation (Elite blood control)
  {
    id: 'deathcaller_blood_t4_blood_storm',
    name: 'Blood Storm',
    description: 'Once per combat, unleash a blood storm dealing 3d6 damage per rank to all enemies within 30ft and healing you for half the total damage.',
    icon: 'spell_shadow_bloodrain',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: 'deathcaller_blood_t3_vampiric_empowerment',
  }
];

// Spectral Master Specialization - Deathly Summoning (Central summoning focus)
export const DEATHCALLER_SPECTRAL_MASTER = [
  // Tier 0 - Foundation (Central summoning focus)
  {
    id: 'deathcaller_spectral_t0_summoning_prowess',
    name: 'Summoning Prowess',
    description: 'Spectral summons cost 1d6 less HP per rank. Summons gain +10 HP per rank.',
    icon: 'spell_shadow_raisedead',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Basic summoning enhancement (Balanced spread around center)
  {
    id: 'deathcaller_spectral_t1_spectral_durability',
    name: 'Spectral Durability',
    description: 'Spectral summons gain +1 armor per rank and resistance to necrotic damage.',
    icon: 'spell_shadow_antishadow',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'deathcaller_spectral_t0_summoning_prowess',
  },
  {
    id: 'deathcaller_spectral_t1_spirit_link',
    name: 'Spirit Link',
    description: 'You can share senses with one spectral summon per rank within 1 mile.',
    icon: 'spell_shadow_possession',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'deathcaller_spectral_t0_summoning_prowess',
  },

  // Tier 2 - Advanced summoning (Central clustering for synergy)
  {
    id: 'deathcaller_spectral_t2_spectral_offense',
    name: 'Spectral Offense',
    description: 'Spectral summons deal +1d6 necrotic damage per rank with their attacks.',
    icon: 'spell_shadow_shadowbolt',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'deathcaller_spectral_t1_spectral_durability',
  },
  {
    id: 'deathcaller_spectral_t2_mass_summoning',
    name: 'Mass Summoning',
    description: 'You can maintain +1 additional spectral summon per rank.',
    icon: 'spell_shadow_summonvoidwalker',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: 'deathcaller_spectral_t1_spectral_durability',
  },
  {
    id: 'deathcaller_spectral_t2_spectral_mobility',
    name: 'Spectral Mobility',
    description: 'Spectral summons gain +10ft movement speed per rank and can teleport 30ft once per turn.',
    icon: 'spell_shadow_unholyfrenzy',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'deathcaller_spectral_t1_spirit_link',
  },

  // Tier 3 - Elite summoning mastery (Expanded capabilities)
  {
    id: 'deathcaller_spectral_t3_spectral_command',
    name: 'Spectral Command',
    description: 'Spectral summons can use your spellcasting ability for attack rolls and DCs.',
    icon: 'spell_shadow_shadetruesight',
    maxRanks: 1,
    position: { x: 1, y: 3 },
    requires: 'deathcaller_spectral_t2_spectral_offense',
  },
  {
    id: 'deathcaller_spectral_t3_deathly_swarm',
    name: 'Deathly Swarm',
    description: 'When a spectral summon dies, it explodes dealing 2d6 necrotic damage per rank to enemies within 10ft.',
    icon: 'spell_shadow_deathcoil',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'deathcaller_spectral_t2_mass_summoning',
  },

  // Tier 4 - Ultimate spectral dominion (Master summoning control)
  {
    id: 'deathcaller_spectral_t4_spectral_legion',
    name: 'Spectral Legion',
    description: 'Once per combat, summon a legion of 4 spectral warriors that last 1 minute and follow your commands.',
    icon: 'spell_shadow_summonimp',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: 'deathcaller_spectral_t3_deathly_swarm',
  }
];

// Void Caller Specialization - Psychic Void Manipulation (Defensive cluster start)
export const DEATHCALLER_VOID_CALLER = [
  // Tier 0 - Foundation (Defensive cluster start)
  {
    id: 'deathcaller_void_t0_void_attunement',
    name: 'Void Attunement',
    description: 'Psychic spells ignore resistance and cost 1 less HP per rank. Gain +1 to psychic spell DCs.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Psychic foundation (Defensive positioning for control)
  {
    id: 'deathcaller_void_t1_void_shield',
    name: 'Void Shield',
    description: 'Gain resistance to psychic damage. Psychic spells create a shield that absorbs 2d6 damage per rank.',
    icon: 'spell_shadow_antishadow',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'deathcaller_void_t0_void_attunement',
  },
  {
    id: 'deathcaller_void_t1_mind_drain',
    name: 'Mind Drain',
    description: 'Psychic spells drain 1d6 HP per rank from enemies and restore half to you.',
    icon: 'spell_shadow_mindsteal',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'deathcaller_void_t0_void_attunement',
  },

  // Tier 2 - Void manipulation (Central clustering for power)
  {
    id: 'deathcaller_void_t2_void_eruption',
    name: 'Void Eruption',
    description: 'Psychic spells create void eruptions dealing 1d8 psychic damage per rank to enemies within 5ft.',
    icon: 'spell_shadow_shadowbolt',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'deathcaller_void_t1_void_shield',
  },
  {
    id: 'deathcaller_void_t2_psychic_resonance',
    name: 'Psychic Resonance',
    description: 'When you take psychic damage, the attacker takes 1d6 psychic damage per rank.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'deathcaller_void_t1_void_shield',
  },
  {
    id: 'deathcaller_void_t2_mental_dominion',
    name: 'Mental Dominion',
    description: 'Psychic spells can charm or frighten enemies for 1 extra turn per rank.',
    icon: 'spell_shadow_mindsteal',
    maxRanks: 2,
    position: { x: 4, y: 2 },
    requires: 'deathcaller_void_t1_mind_drain',
  },

  // Tier 3 - Advanced void control (Elite psychic mastery)
  {
    id: 'deathcaller_void_t3_void_mastery',
    name: 'Void Mastery',
    description: 'Psychic spells have their range doubled per rank.',
    icon: 'spell_shadow_shadetruesight',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'deathcaller_void_t2_void_eruption',
  },
  {
    id: 'deathcaller_void_t3_psychic_storm',
    name: 'Psychic Storm',
    description: 'Once per combat, unleash a psychic storm dealing 3d6 psychic damage per rank to all enemies within 20ft.',
    icon: 'spell_shadow_mindtwisting',
    maxRanks: 1,
    position: { x: 3, y: 3 },
    requires: 'deathcaller_void_t2_mental_dominion',
  },

  // Tier 4 - Ultimate void supremacy (Master void control)
  {
    id: 'deathcaller_void_t4_void_nova',
    name: 'Void Nova',
    description: 'Once per combat, create a void nova that deals 4d6 psychic damage per rank to all enemies within 30ft and stuns them for 1 round.',
    icon: 'spell_shadow_shadowfury',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: 'deathcaller_void_t3_psychic_storm',
  }
];
