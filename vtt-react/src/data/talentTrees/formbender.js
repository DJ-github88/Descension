// ============================================
// FORMBENDER TALENT TREES
// ============================================

export const FORMBENDER_METAMORPH = [
  // Tier 0 - The Seed (Genetic Foundation)
  {
    id: 'metamorph_t0_primal_adaptation',
    name: 'Primal Adaptation',
    description: 'Your transformations generate +1 additional Wild Instinct per rank. Roll 1d8 when transforming - on 7+ per rank, gain temporary HP equal to your Wild Instinct.',
    icon: 'spell_nature_rejuvenation',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Double Helix Formation (DNA Structure)
  {
    id: 'metamorph_t1_form_fusion',
    name: 'Form Fusion',
    description: 'You can combine two forms together, creating hybrid abilities. Roll 1d6 when fusing - on 4+ per rank, the hybrid gains +1d4 damage.',
    icon: 'ability_hunter_pet_chimera',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'metamorph_t0_primal_adaptation',
  },
  {
    id: 'metamorph_t1_adaptive_physiology',
    name: 'Adaptive Physiology',
    description: 'When damaged by a specific damage type, spend 2 WI to gain resistance to that type for 1 minute. Roll 1d6 - on 5+ per rank, also heal 1d6 HP.',
    icon: 'spell_nature_earthbindtotem',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'metamorph_t0_primal_adaptation',
  },

  // Tier 2 - Chromosomal Branches (Genetic Material)
  {
    id: 'metamorph_t2_trait_synthesis',
    name: 'Trait Synthesis',
    description: 'You can manifest individual traits from any form (claws, wings, gills) without full transformation. Roll 1d20 - on 16+ per rank, manifest two traits simultaneously.',
    icon: 'ability_druid_tigersroar',
    maxRanks: 4,
    position: { x: 0, y: 2 },
    requires: 'metamorph_t1_form_fusion',
  },
  {
    id: 'metamorph_t2_morphological_resilience',
    name: 'Morphological Resilience',
    description: 'While transformed, you gain +1 armor per rank and resistance to poison. When you transform, roll 1d8 - on 6+ per rank, remove one debuff from yourself.',
    icon: 'spell_nature_spiritarmor',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'metamorph_t1_form_fusion',
  },
  {
    id: 'metamorph_t2_evolutionary_burst',
    name: 'Evolutionary Burst',
    description: 'Once per turn, spend 3 WI to instantly transform and gain advantage on your next attack. Roll 1d6 - on 4+ per rank, the attack also deals +2d6 damage.',
    icon: 'ability_druid_ferociousbite',
    maxRanks: 4,
    position: { x: 4, y: 2 },
    requires: 'metamorph_t1_adaptive_physiology',
  },

  // Tier 3 - RNA Transcription (Genetic Expression)
  {
    id: 'metamorph_t3_chimeric_mastery',
    name: 'Chimeric Mastery',
    description: 'Hybrid forms cost 1 less WI to maintain per rank. When you create a hybrid, roll 1d10 - on 8+ per rank, gain a random bonus trait for 1 minute.',
    icon: 'ability_hunter_animalhandler',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'metamorph_t2_trait_synthesis',
  },
  {
    id: 'metamorph_t3_metabolic_acceleration',
    name: 'Metabolic Acceleration',
    description: 'Your movement speed increases by 10 ft per rank while transformed. Roll 1d6 when you move 30+ ft in one turn - on 5+ per rank, gain +1d6 temp HP.',
    icon: 'ability_druid_dash',
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: 'metamorph_t2_evolutionary_burst',
  },

  // Tier 4 - Protein Folding (Complex Structures)
  {
    id: 'metamorph_t4_adaptive_evolution',
    name: 'Adaptive Evolution',
    description: 'Spend 4 WI to temporarily evolve resistance to the last damage type that harmed you this combat. Roll 1d8 - on 7+ per rank, this resistance becomes permanent.',
    icon: 'spell_nature_naturesblessing',
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: 'metamorph_t3_chimeric_mastery',
  },
  {
    id: 'metamorph_t4_genetic_memory',
    name: 'Genetic Memory',
    description: 'You can store one hybrid form per rank for instant recall. Switching to a stored form costs 1 WI instead of 2. Roll 1d20 when storing - on 18+ per rank, store two forms.',
    icon: 'ability_druid_naturalperfection',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'metamorph_t2_morphological_resilience',
  },
  {
    id: 'metamorph_t5_rapid_metamorphosis',
    name: 'Rapid Metamorphosis',
    description: 'Transform as a 1 action point instead of an action. Roll 1d6 when transforming - on 4+ per rank, also gain advantage on your first attack in the new form.',
    icon: 'ability_druid_typhoon',
    maxRanks: 3,
    position: { x: 4, y: 4 },
    requires: 'metamorph_t3_metabolic_acceleration',
  },

  // Tier 5 - DNA Replication (Ultimate Adaptation)
  {
    id: 'metamorph_t6_perfect_chimera',
    name: 'Perfect Chimera',
    description: 'Create a perfect chimera by combining three forms at once. This ultimate form gains abilities from all three forms and +3 to all rolls. Costs 8 WI.',
    icon: 'ability_mount_jungletiger',
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: 'metamorph_t4_adaptive_evolution',
  },
  {
    id: 'metamorph_t7_evolutionary_transcendence',
    name: 'Evolutionary Transcendence',
    description: 'You can maintain hybrid forms indefinitely. When you transform, roll 1d20 - on 18+ per rank, permanently evolve one of your base forms.',
    icon: 'spell_nature_reincarnation',
    maxRanks: 1,
    position: { x: 3, y: 5 },
    requires: 'metamorph_t4_genetic_memory',
  },

  // Tier 6 - The Omega Form (Final Evolution)
  {
    id: 'metamorph_t8_omega_transformation',
    name: 'Omega Transformation',
    description: 'Unlocks Omega Transformation - spend all Wild Instinct to become a legendary chimera with abilities from all four base forms plus three random traits. Lasts 1 minute.',
    icon: 'ability_druid_supriseattack',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: 'metamorph_t6_perfect_chimera',
  }
];

export const FORMBENDER_FORM_THIEF = [
  // Tier 0 - The Vortex Center (Point of Theft)
  {
    id: 'form_thief_t0_form_harvest',
    name: 'Form Harvest',
    description: 'When you defeat an enemy, roll 1d6 - on 4+ per rank, you can harvest their form for your collection. Harvesting costs 1 less WI per rank.',
    icon: 'spell_shadow_possession',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Initial Spiral Arms (First Forms Collected)
  {
    id: 'form_thief_t1_mimicry_mastery',
    name: 'Mimicry Mastery',
    description: 'While in a stolen form, you are indistinguishable from the original. Roll 1d6 when mimicking - on 5+ per rank, you also gain their memories and knowledge.',
    icon: 'ability_rogue_disguise',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'form_thief_t0_form_harvest',
  },
  {
    id: 'form_thief_t1_form_vault',
    name: 'Form Vault',
    description: 'You can store 2 additional forms per rank. Forms in your vault generate 1 WI per day each. Roll 1d20 when storing a form - on 16+ per rank, gain an extra ability from it.',
    icon: 'inv_misc_book_09',
    maxRanks: 4,
    position: { x: 3, y: 1 },
    requires: 'form_thief_t0_form_harvest',
  },

  // Tier 2 - Spiral Expansion (Growing Collection)
  {
    id: 'form_thief_t2_stolen_power',
    name: 'Stolen Power',
    description: 'You can use one ability from your current stolen form per rank. Roll 1d8 when using a stolen ability - on 7+ per rank, you can use it at full power without limitations.',
    icon: 'spell_shadow_charm',
    maxRanks: 4,
    position: { x: 0, y: 2 },
    requires: 'form_thief_t1_mimicry_mastery',
  },
  {
    id: 'form_thief_t2_perfect_mimic',
    name: 'Perfect Mimic',
    description: 'Your stolen forms fool even magical detection. Roll 1d20 when scrutinized magically - on 16+ per rank, the detector believes you are the genuine article.',
    icon: 'spell_magic_polymorphrabbit',
    maxRanks: 4,
    position: { x: 4, y: 2 },
    requires: 'form_thief_t1_form_vault',
  },

  // Tier 3 - Vortex Pull (Drawing in More Forms)
  {
    id: 'form_thief_t3_form_synthesis',
    name: 'Form Synthesis',
    description: 'Combine traits from two stored forms into a new hybrid ability. Roll 1d10 when synthesizing - on 8+ per rank, the hybrid ability is more powerful than either original.',
    icon: 'ability_hunter_beastcall',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'form_thief_t2_stolen_power',
  },
  {
    id: 'form_thief_t3_form_amplification',
    name: 'Form Amplification',
    description: 'Stolen forms are 25% more effective per rank. When using a stolen ability, roll 1d6 - on 5+ per rank, amplify it by +50% power.',
    icon: 'spell_shadow_manaburn',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'form_thief_t2_perfect_mimic',
  },

  // Tier 4 - Spiral Acceleration (Rapid Form Collection)
  {
    id: 'form_thief_t4_legendary_harvest',
    name: 'Legendary Harvest',
    description: 'You can harvest forms from legendary creatures and bosses. Roll 1d100 when defeating such a foe - on 90+ per rank, you can harvest their form (even if normally immune).',
    icon: 'achievement_boss_archmagearugal',
    maxRanks: 2,
    position: { x: 0, y: 4 },
    requires: 'form_thief_t3_form_synthesis',
  },
  {
    id: 'form_thief_t4_form_vault_expansion',
    name: 'Form Vault Expansion',
    description: 'Your form vault can hold 5 additional forms per rank. Stored forms now generate 2 WI per day each instead of 1.',
    icon: 'inv_misc_enggizmos_27',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'form_thief_t3_form_synthesis',
  },
  {
    id: 'form_thief_t5_mimicry_perfection',
    name: 'Mimicry Perfection',
    description: 'You can perfectly mimic any creature you\'ve seen, even without harvesting them. Roll 1d6 when mimicking - on 4+ per rank, gain their full stat block for 1 hour.',
    icon: 'ability_druid_challenge',
    maxRanks: 3,
    position: { x: 4, y: 4 },
    requires: 'form_thief_t3_form_amplification',
  },

  // Tier 5 - Vortex Core (Center of Power)
  {
    id: 'form_thief_t6_collector_instinct',
    name: 'Collector\'s Instinct',
    description: 'You can sense valuable forms within 100 ft. Roll 1d20 when encountering new creatures - on 16+ per rank, learn one of their abilities without harvesting them.',
    icon: 'ability_hunter_masterscall',
    maxRanks: 3,
    position: { x: 1, y: 5 },
    requires: 'form_thief_t4_legendary_harvest',
  },
  {
    id: 'form_thief_t7_legendary_mimicry',
    name: 'Legendary Mimicry',
    description: 'You can mimic legendary creatures without harvesting them first. Roll 1d100 when encountering legends - on 95+ per rank, you can use their most powerful ability once per day.',
    icon: 'achievement_boss_kiljaedan',
    maxRanks: 1,
    position: { x: 3, y: 5 },
    requires: 'form_thief_t5_mimicry_perfection',
  },

  // Tier 6 - Vortex Convergence (Ultimate Form Storm)
  {
    id: 'form_thief_t8_form_hoarder',
    name: 'Form Hoarder',
    description: 'You can maintain 3 stolen forms simultaneously. Switching between them costs 1 WI instead of 2. Roll 1d8 when switching - on 7+ per rank, keep beneficial effects from the previous form.',
    icon: 'ability_mount_undeadhorse',
    maxRanks: 1,
    position: { x: 0, y: 6 },
    requires: 'form_thief_t6_collector_instinct',
  },
  {
    id: 'form_thief_t9_panmorphic_apotheosis',
    name: 'Panmorphic Apotheosis',
    description: 'Unlocks Panmorphic Apotheosis - spend all Wild Instinct to become every form in your vault simultaneously. You gain all their abilities but take 4d6 damage each round from the strain.',
    icon: 'achievement_character_human_male',
    maxRanks: 1,
    position: { x: 4, y: 6 },
    requires: 'form_thief_t7_legendary_mimicry',
  }
];

export const FORMBENDER_PRIMORDIAL = [
  // Tier 0 - The Elemental Spark (Primal Origin)
  {
    id: 'primordial_t0_elemental_affinity',
    name: 'Elemental Affinity',
    description: 'Elemental transformations generate +1 additional Wild Instinct per rank. Roll 1d8 when transforming elementally - on 7+ per rank, gain resistance to your opposite element.',
    icon: 'spell_fire_elementaldevastation',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - The Four Pillars (Elemental Foundations)
  {
    id: 'primordial_t1_inferno_essence',
    name: 'Inferno Essence',
    description: 'Your fire transformations deal +1d6 fire damage per rank. When you transform into Inferno, roll 1d6 - on 4+ per rank, create a 10 ft radius fire zone that deals 1d4 fire damage per turn.',
    icon: 'spell_fire_fire',
    maxRanks: 4,
    position: { x: 0, y: 1 },
    requires: 'primordial_t0_elemental_affinity',
  },
  {
    id: 'primordial_t1_tsunami_essence',
    name: 'Tsunami Essence',
    description: 'Your water transformations gain +10 ft swim speed per rank. When you transform into Tsunami, roll 1d6 - on 4+ per rank, create water barriers that block line of sight.',
    icon: 'spell_frost_summonwaterelemental',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'primordial_t0_elemental_affinity',
  },
  {
    id: 'primordial_t1_avalanche_essence',
    name: 'Avalanche Essence',
    description: 'Your earth transformations gain +2 armor per rank. When you transform into Avalanche, roll 1d6 - on 4+ per rank, create stone spikes that deal 2d6 piercing damage in 20 ft.',
    icon: 'spell_nature_earthquake',
    maxRanks: 4,
    position: { x: 3, y: 1 },
    requires: 'primordial_t0_elemental_affinity',
  },
  {
    id: 'primordial_t1_tempest_essence',
    name: 'Tempest Essence',
    description: 'Your air transformations gain +10 ft fly speed per rank. When you transform into Tempest, roll 1d6 - on 4+ per rank, create wind gusts that push enemies 10 ft away.',
    icon: 'spell_nature_cyclone',
    maxRanks: 3,
    position: { x: 4, y: 1 },
    requires: 'primordial_t0_elemental_affinity',
  },

  // Tier 2 - Elemental Confluence (Merging Forces)
  {
    id: 'primordial_t2_elemental_fusion',
    name: 'Elemental Fusion',
    description: 'You can combine two elements in one transformation. Roll 1d8 when fusing - on 7+ per rank, create a unique elemental effect (steam clouds, mud slides, etc.).',
    icon: 'spell_nature_elementalshields',
    maxRanks: 4,
    position: { x: 2, y: 2 },
    requires: 'primordial_t0_elemental_affinity',
  },

  // Tier 3 - Terrain Mastery (Environmental Control)
  {
    id: 'primordial_t3_terrain_reshape',
    name: 'Terrain Reshape',
    description: 'While in elemental form, you can reshape terrain within 30 ft. Roll 1d6 when reshaping - on 5+ per rank, the terrain changes persist for 1 minute.',
    icon: 'spell_nature_earthquake',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'primordial_t2_elemental_fusion',
  },
  {
    id: 'primordial_t3_elemental_immunity',
    name: 'Elemental Immunity',
    description: 'While in your elemental form, you are immune to your element and resistant to all others. Roll 1d20 when taking elemental damage - on 16+ per rank, redirect it to heal yourself.',
    icon: 'spell_fire_bluefire',
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: 'primordial_t2_elemental_fusion',
  },

  // Tier 4 - Elemental Dominance (Master Control)
  {
    id: 'primordial_t4_elemental_storm',
    name: 'Elemental Storm',
    description: 'Create a 40 ft radius elemental storm that damages enemies based on your current form. Roll 1d6 when creating the storm - on 4+ per rank, enemies take half damage on saves.',
    icon: 'spell_nature_callstorm',
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: 'primordial_t3_terrain_reshape',
  },
  {
    id: 'primordial_t4_primal_overload',
    name: 'Primal Overload',
    description: 'Your elemental forms gain +50% damage output per rank but cost 1 extra WI to maintain. When you take damage while overloaded, roll 1d6 - on 5+ per rank, unleash an elemental burst.',
    icon: 'spell_fire_volcano',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'primordial_t2_elemental_fusion',
  },
  {
    id: 'primordial_t5_elemental_ascension',
    name: 'Elemental Ascension',
    description: 'Transform as a 1 action point and maintain elemental forms indefinitely. Roll 1d8 when ascending - on 7+ per rank, gain a new elemental ability permanently.',
    icon: 'spell_nature_elementalprecision_1',
    maxRanks: 3,
    position: { x: 4, y: 4 },
    requires: 'primordial_t3_elemental_immunity',
  },

  // Tier 5 - Elemental Convergence (Ultimate Unity)
  {
    id: 'primordial_t6_tetra_elemental',
    name: 'Tetra-Elemental',
    description: 'You can manifest all four elemental forms simultaneously. Each element grants its benefits but you take 2d6 damage per round from elemental strain. Costs 6 WI.',
    icon: 'spell_fire_masterofelements',
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: 'primordial_t4_elemental_storm',
  },
  {
    id: 'primordial_t7_elemental_godhood',
    name: 'Elemental Godhood',
    description: 'Your elemental transformations can affect up to 100 ft radius. When you transform, roll 1d100 - on 95+ per rank, you become immune to all damage for 1 round.',
    icon: 'spell_nature_elementalabsorption',
    maxRanks: 1,
    position: { x: 3, y: 5 },
    requires: 'primordial_t5_elemental_ascension',
  },

  // Tier 6 - The Elemental Apocalypse (Final Cataclysm)
  {
    id: 'primordial_t8_cosmic_elemental_fury',
    name: 'Cosmic Elemental Fury',
    description: 'Unlocks Cosmic Elemental Fury - spend all Wild Instinct to unleash all four elemental forces simultaneously. Creates a 60 ft radius cataclysm dealing 5d8 elemental damage of each type.',
    icon: 'spell_fire_flameblades',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: 'primordial_t6_tetra_elemental',
  }
];
