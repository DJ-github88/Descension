// ============================================
// CHAOS WEAVER TALENT TREES
// ============================================

export const CHAOS_WEAVER_REALITY_BENDING = [
  // Tier 0 - Foundation (Center chaos seed)
  {
    id: 'reality_t0_chaos_seed',
    name: 'Chaos Seed',
    description: 'Plant a seed of chaos. Roll 1d20: on 15+ per rank, the seed grows into a chaos anomaly that damages nearby enemies.',
    icon: 'spell_arcane_polymorphchicken',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Basic reality manipulation (Spiral outward)
  {
    id: 'reality_t1_dimension_door',
    name: 'Chaotic Door',
    description: 'Unlocks Chaotic Door - teleport to a random location within 60ft. Draw a card: face cards teleport allies instead.',
    icon: 'spell_arcane_blink',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'reality_t0_chaos_seed',
  },
  {
    id: 'reality_t1_chaos_burst',
    name: 'Chaos Burst',
    description: 'Release a burst of chaotic energy. 20ft radius deals 1d6 force damage per rank. Roll 1d20: on 15+, damage is doubled.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 4,
    position: { x: 3, y: 1 },
    requires: 'reality_t0_chaos_seed',
  },

  // Tier 2 - Advanced chaos (Continue spiral)
  {
    id: 'reality_t2_illusion_storm',
    name: 'Illusion Storm',
    description: 'Summon illusions that become real. Roll 1d20: on 16+ per rank, create 1d4 duplicates that deal damage for 1 round.',
    icon: 'spell_nature_mirrorimage',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'reality_t1_dimension_door',
  },
  {
    id: 'reality_t2_reality_rift',
    name: 'Reality Rift',
    description: 'Tear open a rift to chaos. Creatures within 30ft take 2d6 force damage per rank. Roll 1d20: on 18+, rift persists.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'reality_t1_chaos_burst',
  },

  // Tier 3 - Master reality control (Spiral back inward)
  {
    id: 'reality_t3_chaos_clone',
    name: 'Chaos Clone',
    description: 'Create a clone of chaotic energy. Clone deals 2d6 force damage per rank. Roll 1d20: on 17+ per rank, clone explodes for area damage.',
    icon: 'spell_nature_mirrorimage',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'reality_t2_illusion_storm',
  },
  {
    id: 'reality_t3_reality_storm',
    name: 'Reality Storm',
    description: 'Unleash a storm that warps reality. 40ft radius, enemies take 2d8 force damage per rank. Roll 1d20: on 16+ per rank, random teleportation.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 4,
    position: { x: 3, y: 3 },
    requires: 'reality_t2_reality_rift',
  },

  // Tier 4 - Elite chaos mastery (Spiral convergence)
  {
    id: 'reality_t4_chaos_nexus',
    name: 'Chaos Nexus',
    description: 'Create a nexus of chaotic energy. Allies gain advantage on chaos spells. Roll 1d20: on 18+ per rank, nexus explodes for massive damage.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'reality_t3_reality_storm',
  },

  // Tier 5 - Legendary chaos control (Final spiral arms)
  {
    id: 'reality_t5_chaos_eruption',
    name: 'Chaos Eruption',
    description: 'Cause reality to erupt with chaos. 60ft radius, 4d6 force damage per rank. Roll 1d20: on 19+ per rank, create permanent chaos zones.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 0, y: 5 },
    requires: 'reality_t4_chaos_nexus',
  },
  {
    id: 'reality_t5_reality_devourer',
    name: 'Reality Devourer',
    description: 'Devour portions of reality. Targets take 3d8 necrotic damage per rank. Roll 1d20: on 18+ per rank, target is banished to chaos realm.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 3,
    position: { x: 4, y: 5 },
    requires: 'reality_t4_chaos_nexus',
  },

  // Tier 6 - Ultimate reality manipulation (Spiral center)
  {
    id: 'reality_t6_chaos_god',
    name: 'Chaos Incarnate',
    description: 'Embrace the essence of chaos itself. Become a being of pure chaos for 1 minute. Control reality, summon infinite chaotic entities, ignore all damage types.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['reality_t5_chaos_eruption', 'reality_t5_reality_devourer'],
    requiresAll: true,
  }
];

// Chaos Weaver Specialization - Entropy and decay manipulation (Branching decay tree)
export const CHAOS_WEAVER_ENTROPY_CONTROL = [
  // Tier 0 - Foundation (Root system)
  {
    id: 'entropy_t0_decay_touch',
    name: 'Decay Touch',
    description: 'Infuse touch with entropic energy. Attacks deal +1d6 necrotic damage per rank. Roll 1d20: on 16+, target ages 1d10 years.',
    icon: 'spell_shadow_chilltouch',
    maxRanks: 4,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Basic entropy manipulation (First branches)
  {
    id: 'entropy_t1_decay_wave',
    name: 'Decay Wave',
    description: 'Send a wave of entropy. 30ft cone, creatures take 1d8 necrotic damage per rank. Roll 1d20: on 15+, targets are weakened.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'entropy_t0_decay_touch',
  },
  {
    id: 'entropy_t1_entropy_burst',
    name: 'Entropy Burst',
    description: 'Release concentrated entropy. 15ft radius, 2d6 necrotic damage per rank. Roll 1d20: on 17+, damage ignores resistance.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'entropy_t0_decay_touch',
  },

  // Tier 2 - Advanced decay (Branching growth)
  {
    id: 'entropy_t2_decomposition',
    name: 'Decomposition',
    description: 'Cause rapid biological decay. Target takes 2d8 necrotic damage per rank. Roll 1d20: on 16+ per rank, target is poisoned for 1 minute.',
    icon: 'spell_shadow_chilltouch',
    maxRanks: 4,
    position: { x: 0, y: 2 },
    requires: 'entropy_t1_decay_wave',
  },
  {
    id: 'entropy_t2_entropy_shield',
    name: 'Entropy Shield',
    description: 'Shield yourself with decaying energy. +3 armor, reflect 1d6 necrotic damage per rank. Roll 1d20: on 15+, shield damages attacker.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'entropy_t1_decay_wave',
  },
  {
    id: 'entropy_t2_decay_aura',
    name: 'Decay Aura',
    description: 'Emit an aura of entropy. Enemies within 25ft take 1d6 necrotic damage per rank at start of their turns.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 4,
    position: { x: 4, y: 2 },
    requires: 'entropy_t1_entropy_burst',
  },

  // Tier 3 - Master entropy control (Major branches)
  {
    id: 'entropy_t3_decay_mastery',
    name: 'Decay Mastery',
    description: 'Master the forces of entropy. Your decay effects reduce enemy maximum HP by damage dealt. Roll 1d20: on 17+ per rank, reduction is permanent.',
    icon: 'spell_shadow_chilltouch',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'entropy_t2_entropy_shield',
  },
  {
    id: 'entropy_t3_corruption',
    name: 'Corruption Wave',
    description: 'Send waves of corrupting entropy. 40ft cone, 2d8 necrotic damage per rank. Roll 1d20: on 16+ per rank, targets become vulnerable to necrotic.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 4,
    position: { x: 3, y: 3 },
    requires: 'entropy_t2_decay_aura',
  },

  // Tier 4 - Elite entropy mastery (Tree canopy)
  {
    id: 'entropy_t4_unmake',
    name: 'Unmake',
    description: 'Unravel the essence of a target. Deal 4d6 necrotic damage per rank. Roll 1d20: on 19+ per rank, target is reduced to 1 HP instead of killed.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 2,
    position: { x: 0, y: 4 },
    requires: 'entropy_t3_decay_mastery',
  },
  {
    id: 'entropy_t4_chaos_decay',
    name: 'Chaos Decay',
    description: 'Combine chaos and decay. Targets take 2d8 necrotic + 2d8 force damage per rank. Roll 1d20: on 18+ per rank, damage is maximized.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 2, y: 4 },
    requires: 'entropy_t3_decay_mastery',
  },
  {
    id: 'entropy_t4_entropy_storm',
    name: 'Entropy Storm',
    description: 'Summon a storm of decaying energy. 50ft radius, enemies take 3d6 necrotic damage per rank each round. Roll 1d20: on 16+ per rank, storm spreads.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 4,
    position: { x: 4, y: 4 },
    requires: 'entropy_t3_corruption',
  },

  // Tier 5 - Legendary entropy control (Final branches)
  {
    id: 'entropy_t5_eternal_decay',
    name: 'Eternal Decay',
    description: 'Your decay becomes eternal. Creatures killed by your entropy effects rise as decaying undead under your control.',
    icon: 'spell_shadow_chilltouch',
    maxRanks: 3,
    position: { x: 1, y: 5 },
    requires: 'entropy_t4_unmake',
  },
  {
    id: 'entropy_t5_oblivion_embrace',
    name: 'Oblivion\'s Embrace',
    description: 'Embrace the power of oblivion. Immune to necrotic damage, deal +1d12 necrotic damage with attacks. Roll 1d20 when damaged: on 16+ per rank, heal instead.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 3, y: 5 },
    requires: 'entropy_t4_chaos_decay',
  },

  // Tier 6 - Ultimate entropy domination (Tree trunk center)
  {
    id: 'entropy_t6_decay_god',
    name: 'Decay Incarnate',
    description: 'Become the embodiment of entropy itself. Everything within 100ft decays instantly. Control all decay, time accelerates or stops at your whim.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['entropy_t5_eternal_decay', 'entropy_t5_oblivion_embrace'],
    requiresAll: true,
  }
];

// Chaos Weaver Specialization - Chaos dice and random magical effects (Scattered random pattern)
export const CHAOS_WEAVER_CHAOS_DICE = [
  // Tier 0 - Foundation (Random scattered start)
  {
    id: 'dice_t0_chaos_dice',
    name: 'Chaos Dice',
    description: 'Gain chaos dice that enhance your magic. Roll 1d20 when casting spells: on 16+ per rank, gain a chaos die (maximum 3).',
    icon: 'spell_shadow_possession',
    maxRanks: 3,
    position: { x: 3, y: 0 },
    requires: null,
  },
  {
    id: 'dice_t0_random_magic',
    name: 'Random Magic',
    description: 'Infuse spells with chaos. When casting, roll 1d20. On 15+ per rank, spell gains a random enhancement (damage, range, or effect).',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 4,
    position: { x: 1, y: 0 },
    requires: null,
  },

  // Tier 1 - Basic dice manipulation (Scattered progression)
  {
    id: 'dice_t1_chaos_bolt',
    name: 'Chaos Bolt',
    description: 'Fire a bolt of chaotic energy. Deal 2d6 damage of random type per rank. Roll 1d20: on 17+ per rank, bolt chains to another target.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 4,
    position: { x: 0, y: 1 },
    requires: 'dice_t0_random_magic',
  },
  {
    id: 'dice_t1_dice_storm',
    name: 'Dice Storm',
    description: 'Summon dice that explode with chaos. 25ft radius, 1d8 damage per chaos die per rank. Roll 1d20: on 16+, dice persist for another round.',
    icon: 'spell_shadow_possession',
    maxRanks: 3,
    position: { x: 4, y: 1 },
    requires: 'dice_t0_chaos_dice',
  },

  // Tier 2 - Advanced dice control (Random spread)
  {
    id: 'dice_t2_probability_shift',
    name: 'Probability Shift',
    description: 'Bend probability around you. Allies within 30ft roll twice and take higher result. Roll 1d20: on 15+ per rank, enemies roll twice and take lower.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 4,
    position: { x: 2, y: 2 },
    requires: 'dice_t1_chaos_bolt',
  },
  {
    id: 'dice_t2_chaos_shield',
    name: 'Chaos Shield',
    description: 'Surround yourself with chaotic energy. +2 armor per chaos die. Roll 1d20 when attacked: on 15+ per rank, attacker takes 1d8 random damage.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'dice_t1_dice_storm',
  },
  {
    id: 'dice_t2_random_effects',
    name: 'Random Effects',
    description: 'Spells gain random effects. Roll 1d20 when casting: on 16+ per rank, choose from 3 random beneficial effects for the spell.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'dice_t1_chaos_bolt',
  },

  // Tier 3 - Master dice manipulation (Chaotic clustering)
  {
    id: 'dice_t3_critical_chaos',
    name: 'Critical Chaos',
    description: 'Critical hits unleash chaos. Roll 1d4: 1=extra damage, 2=stun, 3=knockback, 4=random teleport. Scale with chaos dice.',
    icon: 'spell_shadow_possession',
    maxRanks: 4,
    position: { x: 0, y: 4 },
    requires: 'dice_t2_probability_shift',
  },
  {
    id: 'dice_t3_chaos_nova',
    name: 'Chaos Nova',
    description: 'Unleash chaotic nova. 35ft radius, 3d6 random damage per chaos die per rank. Roll 1d20: on 17+ per rank, nova repeats next round.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 4, y: 4 },
    requires: 'dice_t2_random_effects',
  },

  // Tier 4 - Elite chaos mastery (Scattered elite)
  {
    id: 'dice_t4_fate_weaver',
    name: 'Fate Weaver',
    description: 'Weave fate itself. Once per combat, dictate the outcome of any die roll. Roll 1d20: on 19+ per rank, effect lasts for the entire combat.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 2,
    position: { x: 2, y: 5 },
    requires: 'dice_t2_chaos_shield',
  },
  {
    id: 'dice_t4_chaos_reality',
    name: 'Chaos Reality',
    description: 'Reality becomes chaotic around you. Random events occur: teleportation, damage, healing. Roll 1d20 each round: on 16+ per rank, choose the event.',
    icon: 'spell_shadow_possession',
    maxRanks: 3,
    position: { x: 1, y: 6 },
    requires: 'dice_t3_critical_chaos',
  },
  {
    id: 'dice_t4_random_power',
    name: 'Random Power',
    description: 'Spells gain overwhelming random power. Roll 1d20 when casting: on 18+ per rank, spell deals maximum damage and gains all possible effects.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 3, y: 6 },
    requires: 'dice_t3_chaos_nova',
  },

  // Tier 5 - Legendary dice control (Ultimate randomness)
  {
    id: 'dice_t5_dice_god',
    name: 'Dice God',
    description: 'Become the master of probability. All die rolls within 60ft are made twice, you choose the result. Roll 1d20: on 19+ per rank, results are maximized.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 2,
    position: { x: 0, y: 5 },
    requires: 'dice_t4_fate_weaver',
  },
  {
    id: 'dice_t5_ultimate_chaos',
    name: 'Ultimate Chaos',
    description: 'Embrace ultimate randomness. Your spells become completely unpredictable but devastatingly powerful. Roll 1d20 when casting: on 20, spell becomes legendary.',
    icon: 'spell_shadow_possession',
    maxRanks: 3,
    position: { x: 4, y: 5 },
    requires: 'dice_t4_random_power',
  },

  // Tier 6 - Ultimate chaos dice mastery (Random center)
  {
    id: 'dice_t6_chaos_deity',
    name: 'Chaos Deity',
    description: 'Become a deity of chaos itself. Reality bends to your will. Cast any spell at any time, control all random events, probability becomes your weapon.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['dice_t5_dice_god', 'dice_t5_ultimate_chaos'],
    requiresAll: true,
  }
];
