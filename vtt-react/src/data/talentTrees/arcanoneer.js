// ============================================
// ARCANONEER TALENT TREES
// ============================================

export const ARCANONEER_PRISM_MAGE = [
  // Tier 0 - Foundation (Central column)
  {
    id: 'prism_mage_t0_sphere_purity',
    name: 'Sphere Purity',
    description: 'Pure element combinations (same element twice) deal +1d6 damage per rank. Roll 1d20 when you generate spheres - on 15+ per rank, add one extra sphere of your choice.',
    icon: 'spell_fire_fireball02',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Early power (Central expansion)
  {
    id: 'prism_mage_t1_elemental_resonance',
    name: 'Elemental Resonance',
    description: 'When you roll 3 or more spheres of the same element, draw a card. Red cards grant +1d4 temporary mana per rank.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'prism_mage_t0_sphere_purity',
  },
  {
    id: 'prism_mage_t1_reroll_mastery',
    name: 'Reroll Mastery',
    description: 'You can reroll up to 2 spheres per turn (costs 1 mana per reroll). Roll 1d6 - on 4+ per rank, the reroll costs no mana.',
    icon: 'spell_arcane_arcanepotency',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'prism_mage_t0_sphere_purity',
  },

  // Tier 2 - Branching paths (Left and right expansion)
  {
    id: 'prism_mage_t2_pure_amplification',
    name: 'Pure Amplification',
    description: 'Pure element spells can affect +5 ft radius per rank. Enemies in the area take half damage from the pure element type.',
    icon: 'spell_fire_flamebolt',
    maxRanks: 4,
    position: { x: 0, y: 2 },
    requires: 'prism_mage_t1_elemental_resonance',
  },
  {
    id: 'prism_mage_t2_crystal_focus',
    name: 'Crystal Focus',
    description: 'Once per turn, spend 2 mana to lock in one element type. You cannot roll that element but pure combinations of it deal +2d6 damage per rank.',
    icon: 'inv_misc_gem_diamond_01',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'prism_mage_t1_elemental_resonance',
  },
  {
    id: 'prism_mage_t2_sphere_hunting',
    name: 'Sphere Hunting',
    description: 'When rerolling spheres, roll 1d8. On 7+ per rank, choose the exact element you want instead of rerolling.',
    icon: 'spell_arcane_portalshattrath',
    maxRanks: 4,
    position: { x: 4, y: 2 },
    requires: 'prism_mage_t1_reroll_mastery',
  },

  // Tier 3 - Specialization (Further expansion)
  {
    id: 'prism_mage_t3_elemental_dominion',
    name: 'Elemental Dominion',
    description: 'You gain resistance to the element type you\'ve used most this combat. At rank 3, you also gain advantage on saves against that element.',
    icon: 'spell_fire_moltenblood',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'prism_mage_t2_pure_amplification',
  },
  {
    id: 'prism_mage_t3_prismatic_burst',
    name: 'Prismatic Burst',
    description: 'Unlocks Prismatic Burst - consume 4 spheres of the same element to deal 3d8 damage per sphere consumed in a 30ft cone. Crits on 18+.',
    icon: 'spell_arcane_starfire',
    maxRanks: 3,
    position: { x: 2, y: 3 },
    requires: 'prism_mage_t2_crystal_focus',
  },
  {
    id: 'prism_mage_t3_perfect_clarity',
    name: 'Perfect Clarity',
    description: 'Once per combat, spend 5 mana to reroll all your spheres and choose their exact composition (up to your normal sphere limit).',
    icon: 'spell_arcane_mindmastery',
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: 'prism_mage_t2_sphere_hunting',
  },

  // Tier 4 - Advanced abilities (Outer expansion)
  {
    id: 'prism_mage_t4_elemental_surge',
    name: 'Elemental Surge',
    description: 'Pure element spells have +10 ft range per rank and can pass through creatures without losing damage.',
    icon: 'spell_fire_twilightfireward',
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: 'prism_mage_t3_elemental_dominion',
  },
  {
    id: 'prism_mage_t4_crystal_armor',
    name: 'Crystal Armor',
    description: 'While you have 3+ spheres banked of the same element, you gain +2 armor per rank and resistance to that element.',
    icon: 'inv_misc_gem_crystal_01',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'prism_mage_t3_prismatic_burst',
  },
  {
    id: 'prism_mage_t4_sphere_perfection',
    name: 'Sphere Perfection',
    description: 'Pure element combinations deal maximum damage dice per rank (2 ranks = all dice max, 3 ranks = double max damage).',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 4, y: 4 },
    requires: 'prism_mage_t3_perfect_clarity',
  },

  // Tier 5 - Ultimate power (Center convergence)
  {
    id: 'prism_mage_t5_elemental_transcendence',
    name: 'Elemental Transcendence',
    description: 'You become immune to the element you\'ve used most this combat. Once per turn, transform any sphere into your dominant element.',
    icon: 'spell_arcane_massdispel',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: 'prism_mage_t4_crystal_armor',
  },

  // Tier 6 - Ultimate abilities (Final tier)
  {
    id: 'prism_mage_t6_prismatic_cataclysm',
    name: 'Prismatic Cataclysm',
    description: 'Unlocks Prismatic Cataclysm - consume all spheres of one element to deal 4d12 damage per sphere consumed in a 50ft radius. Damage type matches the element.',
    icon: 'spell_fire_flamestrike',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: 'prism_mage_t5_elemental_transcendence',
  }
];

export const ARCANONEER_ENTROPY_WEAVER = [
  // Tier 0 - Foundation (Central column)
  {
    id: 'entropy_weaver_t0_chaos_generation',
    name: 'Chaos Generation',
    description: 'Roll 5d8 for sphere generation instead of 4d8 (one extra sphere per turn). When you roll Chaos spheres, draw a card - red cards double their effects.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Early power (Central expansion)
  {
    id: 'entropy_weaver_t1_wild_magic_surge',
    name: 'Wild Magic Surge',
    description: 'When you use Chaos spheres in any combination, roll on the Wild Magic Surge table for additional effects. Chaos spells have +5% crit chance per rank.',
    icon: 'spell_arcane_portalironforge',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'entropy_weaver_t0_chaos_generation',
  },
  {
    id: 'entropy_weaver_t1_chaos_amplification',
    name: 'Chaos Amplification',
    description: 'All Chaos element combinations deal +1d6 damage per rank. When you generate Chaos spheres, roll 1d6 - on 5+ per rank, generate an extra Chaos sphere.',
    icon: 'spell_shadow_unstableaffliction_3',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'entropy_weaver_t0_chaos_generation',
  },

  // Tier 2 - Branching paths (Left and right expansion)
  {
    id: 'entropy_weaver_t2_volatile_power',
    name: 'Volatile Power',
    description: 'Chaos spells can chain to nearby enemies within 10 ft per rank. Each chain deals half damage but triggers Wild Magic Surge.',
    icon: 'spell_fire_volcano',
    maxRanks: 4,
    position: { x: 0, y: 2 },
    requires: 'entropy_weaver_t1_wild_magic_surge',
  },
  {
    id: 'entropy_weaver_t2_entropy_field',
    name: 'Entropy Field',
    description: 'Create a 20 ft radius field for 1 minute per rank. Enemies inside have disadvantage on saves against your spells.',
    icon: 'spell_shadow_shadowfury',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'entropy_weaver_t1_wild_magic_surge',
  },
  {
    id: 'entropy_weaver_t2_sphere_conversion',
    name: 'Sphere Conversion',
    description: 'Once per turn, convert any sphere to Chaos (costs 2 mana). Chaos spheres you convert deal +2d6 damage per rank.',
    icon: 'spell_arcane_polymorph',
    maxRanks: 4,
    position: { x: 4, y: 2 },
    requires: 'entropy_weaver_t1_chaos_amplification',
  },

  // Tier 3 - Specialization (Further expansion)
  {
    id: 'entropy_weaver_t3_reality_fracture',
    name: 'Reality Fracture',
    description: 'Wild Magic Surges can now affect allies beneficially. Roll 1d20 - on 15+ per rank, choose whether the surge helps or harms.',
    icon: 'spell_arcane_portaldarnassus',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'entropy_weaver_t2_volatile_power',
  },
  {
    id: 'entropy_weaver_t3_chaos_nova',
    name: 'Chaos Nova',
    description: 'Unlocks Chaos Nova - deal 3d8 chaos damage to all enemies in 30 ft. For each Chaos sphere in your bank, add +1d8.',
    icon: 'spell_fire_felrainoffire',
    maxRanks: 3,
    position: { x: 2, y: 3 },
    requires: 'entropy_weaver_t2_entropy_field',
  },
  {
    id: 'entropy_weaver_t3_unstable_sphere',
    name: 'Unstable Sphere',
    description: 'Your Chaos spheres become unstable. When consumed, roll 1d6 - on 1-2, they deal +4d6 bonus damage; on 3-4, normal damage; on 5-6, they fizzle but grant +2d6 temp HP.',
    icon: 'spell_shadow_mindbomb',
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: 'entropy_weaver_t2_sphere_conversion',
  },

  // Tier 4 - Advanced abilities (Outer expansion)
  {
    id: 'entropy_weaver_t4_catastrophic_surge',
    name: 'Catastrophic Surge',
    description: 'Wild Magic Surges deal maximum damage per rank. You can trigger a Wild Magic Surge voluntarily once per turn (costs 3 mana).',
    icon: 'spell_arcane_arcane04',
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: 'entropy_weaver_t3_reality_fracture',
  },
  {
    id: 'entropy_weaver_t4_chaos_armor',
    name: 'Chaos Armor',
    description: 'While you have Chaos spheres banked, you gain +1 armor per Chaos sphere per rank and resistance to random elemental damage.',
    icon: 'spell_shadow_nethercloak',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'entropy_weaver_t3_chaos_nova',
  },
  {
    id: 'entropy_weaver_t4_sphere_detonation',
    name: 'Sphere Detonation',
    description: 'When a Chaos sphere fizzes, it explodes dealing 2d8 chaos damage per rank to enemies within 10 ft.',
    icon: 'spell_fire_selfdestruct',
    maxRanks: 3,
    position: { x: 4, y: 4 },
    requires: 'entropy_weaver_t3_unstable_sphere',
  },

  // Tier 5 - Ultimate power (Center convergence)
  {
    id: 'entropy_weaver_t5_chaos_mastery',
    name: 'Chaos Mastery',
    description: 'You are immune to Wild Magic Surge effects. Once per turn, all spheres become Chaos spheres for the next spell you cast.',
    icon: 'spell_shadow_shadowfiend',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: 'entropy_weaver_t4_chaos_armor',
  },

  // Tier 6 - Ultimate abilities (Final tier)
  {
    id: 'entropy_weaver_t6_apocalypse',
    name: 'Apocalypse',
    description: 'Unlocks Apocalypse - consume all Chaos spheres to deal 5d12 chaos damage per sphere consumed in a 60ft radius. All enemies affected trigger Wild Magic Surge.',
    icon: 'spell_fire_felhellfire',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: 'entropy_weaver_t5_chaos_mastery',
  }
];

export const ARCANONEER_SPHERE_ARCHITECT = [
  // Tier 0 - Foundation (Central column)
  {
    id: 'sphere_architect_t0_runic_precision',
    name: 'Runic Precision',
    description: '3-sphere spells cost 3 less mana (10→7 mana). You can store up to 12 spheres efficiently. Draw a card when you cast spells - red cards restore 1 mana per rank.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Early power (Central expansion)
  {
    id: 'sphere_architect_t1_sphere_manipulation',
    name: 'Sphere Manipulation',
    description: 'Once per turn, swap 2 spheres for different element types (costs 3 mana total). Roll 1d20 - on 16+ per rank, the swap costs no mana.',
    icon: 'spell_arcane_arcanepotency',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'sphere_architect_t0_runic_precision',
  },
  {
    id: 'sphere_architect_t1_efficient_banking',
    name: 'Efficient Banking',
    description: 'Spheres you bank persist between encounters (up to your maximum). You gain +1 maximum spheres per rank to store.',
    icon: 'inv_misc_rune_01',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'sphere_architect_t0_runic_precision',
  },

  // Tier 2 - Branching paths (Left and right expansion)
  {
    id: 'sphere_architect_t2_sphere_lock',
    name: 'Sphere Lock',
    description: 'At end of turn, lock 1 sphere type to guarantee it appears in your next roll. Locked spheres deal +1d6 damage per rank when used.',
    icon: 'spell_arcane_portalshattrath',
    maxRanks: 4,
    position: { x: 0, y: 2 },
    requires: 'sphere_architect_t1_sphere_manipulation',
  },
  {
    id: 'sphere_architect_t2_precision_casting',
    name: 'Precision Casting',
    description: 'Your spells have +1 to hit per rank. Once per turn, spend 2 mana to automatically hit with a spell (no attack roll needed).',
    icon: 'spell_arcane_blast',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'sphere_architect_t1_sphere_manipulation',
  },
  {
    id: 'sphere_architect_t2_sphere_economy',
    name: 'Sphere Economy',
    description: '2-sphere spells cost 1 less mana per rank (5→4→3 mana). You can bank spheres from multiple turns before spending them.',
    icon: 'spell_arcane_massdispel',
    maxRanks: 4,
    position: { x: 4, y: 2 },
    requires: 'sphere_architect_t1_efficient_banking',
  },

  // Tier 3 - Specialization (Further expansion)
  {
    id: 'sphere_architect_t3_runic_matrix',
    name: 'Runic Matrix',
    description: 'Create combination matrices that persist for 1 minute per rank. Matrix spells cost 2 less mana and deal +1d6 damage.',
    icon: 'spell_arcane_rune',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'sphere_architect_t2_sphere_lock',
  },
  {
    id: 'sphere_architect_t3_sphere_synthesis',
    name: 'Sphere Synthesis',
    description: 'Unlocks Sphere Synthesis - combine 2 spheres of different elements to create a new element of your choice (costs 4 mana).',
    icon: 'spell_arcane_polymorph',
    maxRanks: 3,
    position: { x: 2, y: 3 },
    requires: 'sphere_architect_t2_precision_casting',
  },
  {
    id: 'sphere_architect_t3_mana_crystal',
    name: 'Mana Crystal',
    description: 'Store mana in crystal form (up to 20 mana per rank). Crystals can be used as 1 action point to restore mana.',
    icon: 'inv_misc_gem_crystal_01',
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: 'sphere_architect_t2_sphere_economy',
  },

  // Tier 4 - Advanced abilities (Outer expansion)
  {
    id: 'sphere_architect_t4_sphere_network',
    name: 'Sphere Network',
    description: 'Spheres in your bank can share effects. Network spells affect +1 additional target per rank within 30 ft.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: 'sphere_architect_t3_runic_matrix',
  },
  {
    id: 'sphere_architect_t4_perfect_control',
    name: 'Perfect Control',
    description: 'You can rearrange your sphere bank as a 1 action point. Controlled spheres have advantage on all spell effects per rank.',
    icon: 'spell_arcane_mindmastery',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'sphere_architect_t3_sphere_synthesis',
  },
  {
    id: 'sphere_architect_t4_arcane_efficiency',
    name: 'Arcane Efficiency',
    description: '4-sphere spells cost 5 less mana per rank (15→10→5 mana). You can cast spells without verbal components.',
    icon: 'spell_arcane_arcane04',
    maxRanks: 3,
    position: { x: 4, y: 4 },
    requires: 'sphere_architect_t3_mana_crystal',
  },

  // Tier 5 - Ultimate power (Center convergence)
  {
    id: 'sphere_architect_t5_runic_ascendancy',
    name: 'Runic Ascendancy',
    description: 'You can maintain 2 runic matrices simultaneously. All spells cast through matrices have their effects maximized.',
    icon: 'spell_arcane_portaldarnassus',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: 'sphere_architect_t4_perfect_control',
  },

  // Tier 6 - Ultimate abilities (Final tier)
  {
    id: 'sphere_architect_t6_elemental_convergence',
    name: 'Elemental Convergence',
    description: 'Unlocks Elemental Convergence - consume spheres to create any spell effect. Cost: 8 mana + spheres equal to spell level. Range, damage, and effects of your choice.',
    icon: 'spell_arcane_portalironforge',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: 'sphere_architect_t5_runic_ascendancy',
  }
];
