// ============================================
// PLAGUEBRINGER TALENT TREES
// ============================================

export const PLAGUEBRINGER_VIRULENT_SPREADER = [
  // Tier 0 - Foundation (Wide spread base)
  {
    id: 'virulent_t0_contagious_touch',
    name: 'Contagious Touch',
    description: 'Your base afflictions spread to adjacent enemies on a 15+ per rank. Spread afflictions retain 2 development steps.',
    icon: 'ability_creature_disease_05',
    maxRanks: 4,
    position: { x: 0, y: 0 },
    requires: null,
  },
  {
    id: 'virulent_t0_rapid_infection',
    name: 'Rapid Infection',
    description: 'Apply afflictions as a 1 action point. +1 affliction target per rank when spreading.',
    icon: 'spell_shadow_contagion',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },
  {
    id: 'virulent_t0_virulence',
    name: 'Virulence',
    description: 'Fester and Infect category spells have +5% spread chance per rank.',
    icon: 'ability_creature_poison_06',
    maxRanks: 3,
    position: { x: 4, y: 0 },
    requires: null,
  },

  // Tier 1 - Early contagion abilities
  {
    id: 'virulent_t1_epidemic_focus',
    name: 'Epidemic Focus',
    description: 'When an affliction spreads, you gain +1d4 mana per rank. Maximum 3 stacks.',
    icon: 'spell_shadow_plaguecloud',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'virulent_t0_contagious_touch',
  },
  {
    id: 'virulent_t1_chain_reaction',
    name: 'Chain Reaction',
    description: 'Spread afflictions can trigger secondary spreads. +10% chance per rank.',
    icon: 'spell_nature_corrosivebreath',
    maxRanks: 4,
    position: { x: 3, y: 1 },
    requires: 'virulent_t0_virulence',
  },

  // Tier 2 - Multi-target spread
  {
    id: 'virulent_t2_pandemic_wave',
    name: 'Pandemic Wave',
    description: 'Fester category spells affect all enemies within 10ft per rank of the target.',
    icon: 'spell_shadow_contagion',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'virulent_t0_contagious_touch',
  },
  {
    id: 'virulent_t2_viral_burst',
    name: 'Viral Burst',
    description: 'When an affliction reaches Stage 3, it explodes, spreading to all enemies within 15ft.',
    icon: 'spell_fire_selfdestruct',
    maxRanks: 1,
    position: { x: 2, y: 2 },
    requires: 'virulent_t1_epidemic_focus',
  },
  {
    id: 'virulent_t2_infectious_aura',
    name: 'Infectious Aura',
    description: 'Enemies within 10ft of afflicted targets gain a Stage 1 affliction. +5ft radius per rank.',
    icon: 'spell_shadow_plaguecloud',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'virulent_t0_virulence',
  },

  // Tier 3 - Advanced contagion
  {
    id: 'virulent_t3_epidemic_mastery',
    name: 'Epidemic Mastery',
    description: 'Afflictions spread through walls and obstacles. +1 spread target per rank.',
    icon: 'ability_creature_disease_01',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'virulent_t2_pandemic_wave',
  },
  {
    id: 'virulent_t3_plague_zone',
    name: 'Plague Zone',
    description: 'Create a 20ft zone that automatically afflicts enemies entering it. Zone lasts 2 rounds per rank.',
    icon: 'spell_shadow_contagion',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'virulent_t2_infectious_aura',
  },

  // Tier 4 - Elite contagion control
  {
    id: 'virulent_t4_global_pandemic',
    name: 'Global Pandemic',
    description: 'All active afflictions spread to new targets every round. +1 target per rank.',
    icon: 'spell_shadow_plaguecloud',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'virulent_t3_epidemic_mastery',
    requiresPoints: 20,
  }
];

// Torment Weaver Specialization - Spiral mental domination pattern (psychic spiral)
export const PLAGUEBRINGER_TORMENT_WEAVER = [
  // Tier 0 - Foundation (Center mental seed)
  {
    id: 'torment_t0_psychic_seed',
    name: 'Psychic Seed',
    description: 'Plant a seed of torment in enemy minds. Roll 1d20: on 15+ per rank, seed grows into psychic agony.',
    icon: 'spell_shadow_mindtwisting',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Basic mental manipulation (Spiral outward)
  {
    id: 'torment_t1_mind_fracture',
    name: 'Mind Fracture',
    description: 'Torment category spells deal +1d6 psychic damage per rank. Critical hits cause confusion.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'torment_t0_psychic_seed',
  },
  {
    id: 'torment_t1_hallucinogenic_spores',
    name: 'Hallucinogenic Spores',
    description: 'Enemies affected by your afflictions must roll 1d20 at start of turn: on 15+ per rank, they attack an ally.',
    icon: 'spell_nature_mirrorimage',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'torment_t0_psychic_seed',
  },

  // Tier 2 - Advanced psychic control (Continue spiral)
  {
    id: 'torment_t2_psychic_cascade',
    name: 'Psychic Cascade',
    description: 'When you apply Torment, it chains to 1 additional target per rank within 20ft.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'torment_t1_mind_fracture',
  },
  {
    id: 'torment_t2_nightmare_fuel',
    name: 'Nightmare Fuel',
    description: 'Psychic afflictions reduce enemy spell attack rolls by 1 per rank.',
    icon: 'spell_shadow_mindsteal',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'torment_t1_hallucinogenic_spores',
  },

  // Tier 3 - Master mental domination (Spiral back inward)
  {
    id: 'torment_t3_mental_domination',
    name: 'Mental Domination',
    description: 'Enemies with psychic afflictions have disadvantage on all mental saves. +1 per rank to confusion chance.',
    icon: 'spell_shadow_mindsteal',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'torment_t2_psychic_cascade',
  },
  {
    id: 'torment_t3_psychic_storm',
    name: 'Psychic Storm',
    description: 'Create a 30ft storm of psychic energy. Enemies take 1d8 psychic damage per rank per round.',
    icon: 'spell_shadow_mindtwisting',
    maxRanks: 4,
    position: { x: 3, y: 3 },
    requires: 'torment_t2_nightmare_fuel',
  },

  // Tier 4 - Elite mental control (Spiral convergence)
  {
    id: 'torment_t4_psychic_nexus',
    name: 'Psychic Nexus',
    description: 'All psychic afflictions become linked. When one triggers, all others deal +2d6 damage per rank.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'torment_t3_mental_domination',
    requiresPoints: 20,
  }
];

// Decay Harbinger Specialization - Hexagonal crystal lattice pattern (decay crystal)
export const PLAGUEBRINGER_DECAY_HARBINGER = [
  // Tier 0 - Foundation (Central decay focus)
  {
    id: 'decay_t0_necrotic_focus',
    name: 'Necrotic Focus',
    description: 'Your Decay category spells reduce enemy maximum HP by +1d6 per rank.',
    icon: 'spell_shadow_deathanddecay',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Early decay (Central expansion)
  {
    id: 'decay_t1_accelerated_rot',
    name: 'Accelerated Rot',
    description: 'Necrotic afflictions deal damage 1 round faster. +1 damage dice per rank.',
    icon: 'spell_shadow_contagion',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'decay_t0_necrotic_focus',
  },
  {
    id: 'decay_t1_dark_rejuvenation',
    name: 'Dark Rejuvenation',
    description: 'Convert healing received by afflicted enemies into necrotic damage to allies. +1d6 damage per rank.',
    icon: 'spell_shadow_darkritual',
    maxRanks: 4,
    position: { x: 3, y: 1 },
    requires: 'decay_t0_necrotic_focus',
  },

  // Tier 2 - Branching decay paths (Left and right expansion)
  {
    id: 'decay_t2_withering_touch',
    name: 'Withering Touch',
    description: 'Decay category spells reduce healing received by 20% per rank for 3 rounds.',
    icon: 'spell_shadow_soulleech',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'decay_t1_accelerated_rot',
  },
  {
    id: 'decay_t2_necrotic_burst',
    name: 'Necrotic Burst',
    description: 'When Decay afflictions reach Stage 3, they burst for 2d8 necrotic damage in 15ft radius per rank.',
    icon: 'spell_shadow_deathanddecay',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'decay_t1_accelerated_rot',
  },
  {
    id: 'decay_t2_life_drain',
    name: 'Life Drain',
    description: 'When afflicted enemies take damage, you heal for 1d6 HP per rank.',
    icon: 'spell_shadow_lifedrain02',
    maxRanks: 4,
    position: { x: 4, y: 2 },
    requires: 'decay_t1_dark_rejuvenation',
  },

  // Tier 3 - Specialization (Further expansion)
  {
    id: 'decay_t3_withering_aura',
    name: 'Withering Aura',
    description: 'Create a 20ft aura that prevents healing and deals 1d6 necrotic damage per rank per round.',
    icon: 'spell_shadow_plaguecloud',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'decay_t2_withering_touch',
  },
  {
    id: 'decay_t3_necrotic_eruption',
    name: 'Necrotic Eruption',
    description: 'Consume all Decay afflictions to deal 3d8 necrotic damage per affliction in 30ft radius.',
    icon: 'spell_shadow_deathanddecay',
    maxRanks: 2,
    position: { x: 2, y: 3 },
    requires: 'decay_t2_necrotic_burst',
  },
  {
    id: 'decay_t3_vampiric_decay',
    name: 'Vampiric Decay',
    description: 'Life Drain heals for double amount when triggered by Decay category spells.',
    icon: 'spell_shadow_lifedrain02',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'decay_t2_life_drain',
  },

  // Tier 4 - Advanced abilities (Outer expansion)
  {
    id: 'decay_t4_necrotic_dominion',
    name: 'Necrotic Dominion',
    description: 'All enemies within 40ft have healing reduced by 50%. You gain 25% lifesteal on all damage.',
    icon: 'spell_shadow_deathanddecay',
    maxRanks: 2,
    position: { x: 0, y: 4 },
    requires: 'decay_t3_withering_aura',
    requiresPoints: 15,
  },
  {
    id: 'decay_t4_eternal_rot',
    name: 'Eternal Rot',
    description: 'Decay afflictions persist until cured by Greater Restoration. +1 maximum HP reduction per rank.',
    icon: 'spell_shadow_contagion',
    maxRanks: 3,
    position: { x: 2, y: 4 },
    requires: 'decay_t3_necrotic_eruption',
    requiresPoints: 20,
  },
  {
    id: 'decay_t4_apocalyptic_decay',
    name: 'Apocalyptic Decay',
    description: 'All Decay category spells affect all enemies within 25ft of the target.',
    icon: 'spell_shadow_deathanddecay',
    maxRanks: 2,
    position: { x: 4, y: 4 },
    requires: 'decay_t3_vampiric_decay',
    requiresPoints: 15,
  }
];
