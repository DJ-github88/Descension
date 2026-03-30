// ============================================
// PRIMALIST TALENT TREES
// ============================================

export const PRIMALIST_EARTHWARDEN = [
  // Foundation - Central Protective Core
  {
    id: 'earthwarden_t0_stone_bond',
    name: 'Stone Bond',
    description: 'Your totems gain +2 HP per rank. When you place a totem, roll 1d6. On 4+ per rank, the totem gains +1 HP.',
    icon: 'spell_nature_stoneclawtotem',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Inner Circle - Healing Cluster (Left side healing focus)
  {
    id: 'earthwarden_t1_healing_waters',
    name: 'Healing Waters',
    description: 'Healing Totem heals +1d4 HP per rank. Rejuvenation Totem heals +1d4 HP per rank.',
    icon: 'spell_nature_healingwavegreater',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'earthwarden_t0_stone_bond',
  },
  {
    id: 'earthwarden_t2_sanctuary_circle',
    name: 'Sanctuary Circle',
    description: 'Healing Sanctuary synergy lasts +1 turn per rank and heals +1d6 HP.',
    icon: 'spell_holy_divineintervention',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'earthwarden_t1_healing_waters',
  },
  {
    id: 'earthwarden_t3_protective_synergy',
    name: 'Protective Synergy',
    description: 'When you activate a synergy, flip a coin per rank. On heads, the synergy lasts +1 turn.',
    icon: 'spell_nature_stoneclawtotem',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'earthwarden_t2_sanctuary_circle',
  },
  {
    id: 'earthwarden_t4_sustained_sanctuary',
    name: 'Sustained Sanctuary',
    description: 'Healing Sanctuary synergy now heals at the start of each of your turns, not just once.',
    icon: 'spell_holy_prayerofhealing',
    maxRanks: 1,
    position: { x: 0, y: 4 },
    requires: 'earthwarden_t3_protective_synergy',
  },

  // Inner Circle - Defense Cluster (Right side protection focus)
  {
    id: 'earthwarden_t1_earthen_shield',
    name: 'Earthen Shield',
    description: 'Guardian Totem absorbs +2 damage per rank. Earth Totem grants +1 armor per rank.',
    icon: 'spell_nature_stoneskintotem',
    maxRanks: 4,
    position: { x: 3, y: 1 },
    requires: 'earthwarden_t0_stone_bond',
  },
  {
    id: 'earthwarden_t2_earths_resilience',
    name: 'Earth\'s Resilience',
    description: 'Allies within totem range gain +1 to saving throws per rank.',
    icon: 'spell_nature_strengthofearthtotem02',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'earthwarden_t1_earthen_shield',
  },
  {
    id: 'earthwarden_t3_ancestral_guardian',
    name: 'Ancestral Guardian',
    description: 'When a totem is destroyed, roll 1d20. On 15+ per rank, summon a stone spirit that lasts 2 turns and provides the totem\'s effects.',
    icon: 'spell_nature_spiritwolf',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'earthwarden_t2_earths_resilience',
  },
  {
    id: 'earthwarden_t4_totemic_mastery',
    name: 'Totemic Mastery',
    description: 'You can maintain +1 additional totem per rank. Draw a card when placing totems - hearts cards increase totem radius by 5ft.',
    icon: 'spell_nature_nullward',
    maxRanks: 2,
    position: { x: 4, y: 4 },
    requires: 'earthwarden_t3_ancestral_guardian',
  },

  // Outer Ring - Utility & Damage (Peripheral abilities)
  {
    id: 'earthwarden_t2_totem_regeneration',
    name: 'Totem Regeneration',
    description: 'At the start of your turn, roll 1d8 per rank. On 6+, heal one totem for 1d6 HP.',
    icon: 'spell_nature_earthbindtotem',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'earthwarden_t1_healing_waters',
  },
  {
    id: 'earthwarden_t3_living_earth',
    name: 'Living Earth',
    description: 'Totems gain +1d6 temporary HP per rank that they share with allies within range.',
    icon: 'spell_nature_earthquake',
    maxRanks: 3,
    position: { x: 2, y: 3 },
    requires: 'earthwarden_t2_totem_regeneration',
  },
  {
    id: 'earthwarden_t4_earthquake_strike',
    name: 'Earthquake Strike',
    description: 'Once per combat, unleash an earthquake. Enemies within totem range take 2d8 bludgeoning damage per rank and must succeed on a Strength save or be knocked prone.',
    icon: 'spell_nature_earthquake',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'earthwarden_t3_living_earth',
  },

  // Convergence - Final Sanctuary
  {
    id: 'earthwarden_t5_earthen_fortress',
    name: 'Earthen Fortress',
    description: 'Allies within totem range gain resistance to non-magical damage. Enemies take 1d6 damage when they attack allies within totem range.',
    icon: 'spell_nature_earthbindtotem',
    maxRanks: 3,
    position: { x: 1, y: 5 },
    requires: ['earthwarden_t4_earthquake_strike', 'earthwarden_t4_sustained_sanctuary'],
    requiresAll: false,
  },
  {
    id: 'earthwarden_t5_spirit_of_the_earth',
    name: 'Spirit of the Earth',
    description: 'Totems can be repositioned for 0 action points. When repositioned, totems heal 1d8 HP.',
    icon: 'spell_nature_spiritwolf',
    maxRanks: 2,
    position: { x: 3, y: 5 },
    requires: ['earthwarden_t4_earthquake_strike', 'earthwarden_t4_totemic_mastery'],
    requiresAll: false,
  },

  // Ultimate - Sacred Circle Completion
  {
    id: 'earthwarden_t6_earths_embrace',
    name: 'Earth\'s Embrace',
    description: 'Unlocks Earth\'s Embrace - create a massive earthen dome around your party. Allies inside gain immunity to damage for 3 rounds. Costs all Totemic Synergy.',
    icon: 'spell_nature_earthquake',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['earthwarden_t5_earthen_fortress', 'earthwarden_t5_spirit_of_the_earth'],
    requiresAll: true,
  }
];

// Stormbringer Specialization - Elemental Fury (Diagonal wildfire spread)
export const PRIMALIST_STORMBRINGER = [
  // Ignition Point - Central Spark
  {
    id: 'stormbringer_t0_elemental_focus',
    name: 'Elemental Focus',
    description: 'When you place an elemental totem, roll 1d6. On 4+ per rank, gain +1 Totemic Synergy.',
    icon: 'spell_nature_callstorm',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // First Sparks - Diagonal Spread (Fire path left-up)
  {
    id: 'stormbringer_t1_flame_enhancement',
    name: 'Flame Enhancement',
    description: 'Flamecaller Totem adds +1d4 fire damage per rank to weapon attacks.',
    icon: 'spell_fire_sealoffire',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'stormbringer_t0_elemental_focus',
  },
  {
    id: 'stormbringer_t2_elemental_damage',
    name: 'Elemental Damage',
    description: 'All elemental totems deal +1d6 damage per rank of their element type.',
    icon: 'spell_fire_fireball02',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'stormbringer_t1_flame_enhancement',
  },
  {
    id: 'stormbringer_t3_burning_ground',
    name: 'Burning Ground',
    description: 'Flamecaller Totem creates burning ground that deals 1d6 fire damage per rank at the start of enemy turns.',
    icon: 'spell_fire_moltenblood',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'stormbringer_t2_elemental_damage',
  },
  {
    id: 'stormbringer_t4_elemental_storm',
    name: 'Elemental Storm',
    description: 'Once per combat, unleash an elemental storm. Enemies within totem range take 3d6 damage of each element type per rank.',
    icon: 'spell_nature_callstorm',
    maxRanks: 2,
    position: { x: 0, y: 4 },
    requires: 'stormbringer_t3_burning_ground',
  },

  // Storm Path - Central Flow (Lightning path up-center)
  {
    id: 'stormbringer_t1_storm_power',
    name: 'Storm Power',
    description: 'Storm Totem grants +1 to spell attack rolls and DCs per rank.',
    icon: 'spell_nature_stormreach',
    maxRanks: 4,
    position: { x: 2, y: 1 },
    requires: 'stormbringer_t0_elemental_focus',
  },
  {
    id: 'stormbringer_t2_fury_synergy',
    name: 'Fury Synergy',
    description: 'Elemental Fury synergy deals +2d6 damage per element per rank.',
    icon: 'spell_nature_wispheal',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'stormbringer_t1_storm_power',
  },
  {
    id: 'stormbringer_t3_reduced_threshold',
    name: 'Reduced Threshold',
    description: 'You can trigger synergies with 1 fewer totem per rank (minimum 2 totems).',
    icon: 'spell_nature_earthbindtotem',
    maxRanks: 2,
    position: { x: 2, y: 3 },
    requires: 'stormbringer_t2_fury_synergy',
  },
  {
    id: 'stormbringer_t4_fury_overload',
    name: 'Fury Overload',
    description: 'Elemental Fury synergy lasts +1 turn per rank and can be maintained by spending 2 Synergy per turn.',
    icon: 'spell_fire_twilightfireward',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'stormbringer_t3_reduced_threshold',
  },

  // Frost Path - Diagonal Spread (Ice path right-up)
  {
    id: 'stormbringer_t2_lightning_strike',
    name: 'Lightning Strike',
    description: 'Storm Totem can strike enemies for 2d6 lightning damage per rank as a reaction.',
    icon: 'spell_nature_lightning',
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: 'stormbringer_t1_storm_power',
  },
  {
    id: 'stormbringer_t3_freezing_zone',
    name: 'Freezing Zone',
    description: 'Frost Totem creates a freezing zone. Enemies must succeed on a Constitution save or be frozen for 1 round.',
    icon: 'spell_frost_frostshock',
    maxRanks: 3,
    position: { x: 4, y: 3 },
    requires: 'stormbringer_t2_lightning_strike',
  },
  {
    id: 'stormbringer_t4_wind_rider',
    name: 'Wind Rider',
    description: 'Wind Totem grants allies +20 ft movement speed per rank and advantage on Agility saves.',
    icon: 'spell_nature_windfury',
    maxRanks: 2,
    position: { x: 3, y: 4 },
    requires: 'stormbringer_t3_freezing_zone',
  },

  // Wildfire Spread - Outer Edges (Bottom expansion)
  {
    id: 'stormbringer_t5_primal_rage',
    name: 'Primal Rage',
    description: 'When you activate Elemental Fury, flip a coin per rank. On heads, enemies take an additional 2d6 damage of each element.',
    icon: 'spell_fire_sealoffire',
    maxRanks: 3,
    position: { x: 1, y: 5 },
    requires: ['stormbringer_t4_elemental_storm', 'stormbringer_t4_fury_overload'],
    requiresAll: false,
  },
  {
    id: 'stormbringer_t5_storm_lord',
    name: 'Storm Lord',
    description: 'Draw a card when placing elemental totems. Face cards allow you to place that totem for 0 mana.',
    icon: 'spell_nature_stormreach',
    maxRanks: 2,
    position: { x: 3, y: 5 },
    requires: ['stormbringer_t4_fury_overload', 'stormbringer_t4_wind_rider'],
    requiresAll: false,
  },

  // Inferno - Complete Wildfire
  {
    id: 'stormbringer_t6_primal_tempest',
    name: 'Primal Tempest',
    description: 'Unlocks Primal Tempest - summon a massive storm that deals 6d6 damage of each element in 60ft radius over 3 rounds. Costs all Totemic Synergy.',
    icon: 'spell_nature_callstorm',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['stormbringer_t5_primal_rage', 'stormbringer_t5_storm_lord'],
    requiresAll: true,
  }
];

// Spiritcaller Specialization - Crowd Control & Utility (Flexible spirit web)
export const PRIMALIST_SPIRITCALLER = [
  // Nexus - Spirit Nexus (Central hub)
  {
    id: 'spiritcaller_t0_spirit_whispers',
    name: 'Spirit Whispers',
    description: 'When you place a totem, roll 1d6. On 5+ per rank, enemies within totem range have disadvantage on their next save.',
    icon: 'spell_nature_invisibilitytotem',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Primary Paths - Three Initial Branches
  {
    id: 'spiritcaller_t1_expanded_reach',
    name: 'Expanded Reach',
    description: 'All totems have +5 ft radius per rank.',
    icon: 'spell_nature_nullward',
    maxRanks: 4,
    position: { x: 0, y: 1 },
    requires: 'spiritcaller_t0_spirit_whispers',
  },
  {
    id: 'spiritcaller_t1_spirit_walk',
    name: 'Spirit Walk',
    description: 'You can teleport to any active totem location as a 1 action point per rank.',
    icon: 'spell_arcane_teleportorgrimmar',
    maxRanks: 4,
    position: { x: 2, y: 1 },
    requires: 'spiritcaller_t0_spirit_whispers',
  },
  {
    id: 'spiritcaller_t1_ancestral_bond',
    name: 'Ancestral Bond',
    description: 'Draw a card when placing totems. Hearts cards grant +1 to totem HP per rank.',
    icon: 'spell_nature_spiritarmor',
    maxRanks: 4,
    position: { x: 4, y: 1 },
    requires: 'spiritcaller_t0_spirit_whispers',
  },

  // Control Web - Crowd Control Network (Left branch expansion)
  {
    id: 'spiritcaller_t2_debilitating_effects',
    name: 'Debilitating Effects',
    description: 'Enemies within totem range have -1 to attack rolls and saves per rank.',
    icon: 'spell_nature_spiritwolf',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'spiritcaller_t1_expanded_reach',
  },
  {
    id: 'spiritcaller_t3_ancestral_guidance',
    name: 'Ancestral Guidance',
    description: 'Totems reveal invisible enemies within range. Draw a card when placing totems - spades cards reveal all hidden enemies.',
    icon: 'spell_nature_spiritarmor',
    maxRanks: 3,
    position: { x: 0, y: 3 },
    requires: 'spiritcaller_t2_debilitating_effects',
  },
  {
    id: 'spiritcaller_t4_spirit_storm',
    name: 'Spirit Storm',
    description: 'Once per combat, unleash a spirit storm. Enemies within totem range take 2d8 psychic damage per rank and are stunned on failed Spirit save.',
    icon: 'spell_nature_invisibilitytotem',
    maxRanks: 2,
    position: { x: 1, y: 4 },
    requires: 'spiritcaller_t3_ancestral_guidance',
  },

  // Utility Web - Flexible Options (Center branch expansion)
  {
    id: 'spiritcaller_t2_totem_projection',
    name: 'Totem Projection',
    description: 'You can project totem effects to a distant location within 60 ft per rank.',
    icon: 'spell_nature_earthquake',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'spiritcaller_t1_spirit_walk',
  },
  {
    id: 'spiritcaller_t3_spirit_synergy',
    name: 'Spirit Synergy',
    description: 'When you activate a synergy, enemies within totem range are frightened for 1 round.',
    icon: 'spell_shadow_possession',
    maxRanks: 3,
    position: { x: 2, y: 3 },
    requires: 'spiritcaller_t2_totem_projection',
  },
  {
    id: 'spiritcaller_t4_enhanced_synergies',
    name: 'Enhanced Synergies',
    description: 'All synergy effects have their radius doubled per rank.',
    icon: 'spell_nature_nullward',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'spiritcaller_t3_spirit_synergy',
  },

  // Mobility Web - Movement Network (Right branch expansion)
  {
    id: 'spiritcaller_t2_free_repositioning',
    name: 'Free Repositioning',
    description: 'Totems can be repositioned for 0 action points per rank.',
    icon: 'spell_nature_windfury',
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: 'spiritcaller_t1_ancestral_bond',
  },
  {
    id: 'spiritcaller_t3_wind_manipulation',
    name: 'Wind Manipulation',
    description: 'Wind Totem can push enemies 10 ft per rank and create difficult terrain.',
    icon: 'spell_nature_earthbind',
    maxRanks: 3,
    position: { x: 4, y: 3 },
    requires: 'spiritcaller_t2_free_repositioning',
  },
  {
    id: 'spiritcaller_t4_totemic_conduit',
    name: 'Totemic Conduit',
    description: 'You can channel spells through totems, extending their range by totem radius per rank.',
    icon: 'spell_arcane_teleportorgrimmar',
    maxRanks: 2,
    position: { x: 3, y: 4 },
    requires: 'spiritcaller_t3_wind_manipulation',
  },

  // Alternative Paths - Flexible Connections (Cross-branch options)
  {
    id: 'spiritcaller_t2_spirit_link',
    name: 'Spirit Link',
    description: 'You can swap positions between any two active totems as a 1 action point.',
    icon: 'spell_nature_spiritwolf',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'spiritcaller_t1_spirit_walk',
  },
  {
    id: 'spiritcaller_t2_ancestral_echo',
    name: 'Ancestral Echo',
    description: 'When a totem effect triggers, roll 1d6. On 6, the effect triggers again at reduced power.',
    icon: 'spell_shadow_possession',
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: 'spiritcaller_t1_expanded_reach',
  },

  // Convergence Webs - Multiple Path Endings
  {
    id: 'spiritcaller_t5_spirit_bind',
    name: 'Spirit Bind',
    description: 'Enemies within totem range cannot teleport or plane shift. Flip a coin when they attempt to - on tails, they take 3d6 psychic damage.',
    icon: 'spell_nature_spiritwolf',
    maxRanks: 3,
    position: { x: 0, y: 5 },
    requires: ['spiritcaller_t4_spirit_storm', 'spiritcaller_t4_enhanced_synergies'],
    requiresAll: false,
  },
  {
    id: 'spiritcaller_t5_ancestral_army',
    name: 'Ancestral Army',
    description: 'When a totem is destroyed, summon 1d4 spirit warriors per rank that last 3 rounds.',
    icon: 'spell_shadow_possession',
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: ['spiritcaller_t4_enhanced_synergies', 'spiritcaller_t4_totemic_conduit'],
    requiresAll: false,
  },
  {
    id: 'spiritcaller_t5_spirit_weaving',
    name: 'Spirit Weaving',
    description: 'You can connect any two totems with a spirit thread, allowing effects to chain between them.',
    icon: 'spell_nature_nullward',
    maxRanks: 2,
    position: { x: 2, y: 5 },
    requires: ['spiritcaller_t4_spirit_storm', 'spiritcaller_t4_totemic_conduit'],
    requiresAll: false,
  },

  // Spirit Nexus - Ultimate Spirit Web
  {
    id: 'spiritcaller_t6_spirit_realm',
    name: 'Spirit Realm',
    description: 'Unlocks Spirit Realm - banish all enemies within totem range to the spirit world for 3 rounds. They cannot affect or be affected by anything. Costs all Totemic Synergy.',
    icon: 'spell_nature_invisibilitytotem',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['spiritcaller_t5_spirit_bind', 'spiritcaller_t5_ancestral_army', 'spiritcaller_t5_spirit_weaving'],
    requiresAll: false,
  }
];
