// ============================================
// INSCRIPTOR TALENT TREES
// ============================================

export const INSCRIPTOR_RUNEBINDER = [
  // Tier 0 - Foundation (Central Core - repeatable for progression)
  {
    id: 'runebinder_t0_runic_mastery',
    name: 'Runic Mastery',
    description: 'Passively absorb magical damage. Gain 2 AEP for every point of fire, cold, lightning, or necrotic damage taken. Gain 1 AEP for every 2 points of physical damage taken.',
    icon: 'inv_misc_rune_01',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Zone Creation (Circular Pattern)
  {
    id: 'runebinder_t1_zone_amplification',
    name: 'Zone Amplification',
    description: 'Runes in zones deal +1d4 damage per rank. Zones have +5 ft radius per rank.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'runebinder_t0_runic_mastery',
  },
  {
    id: 'runebinder_t1_rune_efficiency',
    name: 'Rune Efficiency',
    description: 'Rune placement costs -1 mana per rank (minimum 1). Runes last +10 seconds per rank.',
    icon: 'spell_arcane_arcanepotency',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'runebinder_t0_runic_mastery',
  },

  // Tier 2 - Advanced Runes (Expanding Circle)
  {
    id: 'runebinder_t1_zone_control',
    name: 'Zone Control',
    description: 'Enemies in zones have -1 to saves per rank. Can move runes 5 ft per rank as a 1 action point.',
    icon: 'spell_arcane_blink',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'runebinder_t1_zone_amplification',
  },
  {
    id: 'runebinder_t2_damage_runes',
    name: 'Damage Runes',
    description: 'Create damage runes that deal 2d6 force damage per rank when stepped on. Maximum 3 runes per rank.',
    icon: 'spell_fire_fireball02',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'runebinder_t1_rune_efficiency',
  },
  {
    id: 'runebinder_t2_barrier_runes',
    name: 'Barrier Runes',
    description: 'Create barrier runes that block movement. Creatures must succeed on DC 12 + rank Strength save or be stopped.',
    icon: 'spell_holy_powerwordbarrier',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'runebinder_t1_rune_efficiency',
  },

  // Tier 3 - Master Runes (Outer Ring - Circular Expansion)
  {
    id: 'runebinder_t2_zone_empowerment',
    name: 'Zone Empowerment',
    description: 'Zones grant +1 to spell attack rolls per rank. Spells in zones have advantage on attack rolls.',
    icon: 'spell_arcane_starfire',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'runebinder_t1_zone_control',
  },
  {
    id: 'runebinder_t3_rune_chain',
    name: 'Rune Chain',
    description: 'When a rune activates, adjacent runes have 25% chance per rank to activate as well.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'runebinder_t2_damage_runes',
  },

  // Tier 4 - Control & Teleport (Side Branches)
  {
    id: 'runebinder_t2_control_runes',
    name: 'Control Runes',
    description: 'Create control runes that apply conditions. Choose from: slow, silence, or blind. DC 13 + rank.',
    icon: 'spell_shadow_curseofachimonde',
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: 'runebinder_t2_zone_empowerment',
  },
  {
    id: 'runebinder_t2_teleport_runes',
    name: 'Teleport Runes',
    description: 'Create paired teleport runes. Creatures stepping on one rune teleport to the paired rune.',
    icon: 'spell_arcane_portalshattrath',
    maxRanks: 2,
    position: { x: 4, y: 4 },
    requires: 'runebinder_t3_rune_chain',
  },

  // Tier 5 - Ultimate Zone Control (Center Convergence)
  {
    id: 'runebinder_t3_zone_mastery',
    name: 'Zone Mastery',
    description: 'Create zones with 2 runes instead of 3. Zones can overlap and stack effects per rank.',
    icon: 'spell_arcane_portalironforge',
    maxRanks: 3,
    position: { x: 2, y: 5 },
    requires: 'runebinder_t2_zone_empowerment',
  },
  {
    id: 'runebinder_t4_runic_apocalypse',
    name: 'Runic Apocalypse',
    description: 'Detonate all runes simultaneously. Each rune deals 4d6 damage per rank in 15 ft radius, total damage cannot exceed 50d6.',
    icon: 'spell_fire_flamestrike',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: 'runebinder_t3_zone_mastery',
  }
];

// Enchanter - Equipment Grid Layout (Equipment slot arrangement)
export const INSCRIPTOR_ENCHANTER = [
  // Tier 0 - Foundation (Central Enchantment - repeatable)
  {
    id: 'enchanter_t0_enchantment_mastery',
    name: 'Enchantment Mastery',
    description: 'Passively absorb magical damage. Gain 2 AEP for every point of fire, cold, lightning, or necrotic damage taken. Gain 1 AEP for every 2 points of physical damage taken.',
    icon: 'spell_holy_greaterblessingofkings',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Equipment Slots (Weapon/Armor Layout)
  {
    id: 'enchanter_t1_weapon_enhancement',
    name: 'Weapon Enhancement',
    description: 'Weapon inscriptions grant +1 to attack and damage rolls per rank.',
    icon: 'ability_warrior_weaponmastery',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'enchanter_t0_enchantment_mastery',
  },
  {
    id: 'enchanter_t1_armor_enhancement',
    name: 'Armor Enhancement',
    description: 'Armor inscriptions grant +1 armor per rank.',
    icon: 'spell_holy_devotionaura',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'enchanter_t0_enchantment_mastery',
  },

  // Tier 2 - Advanced Equipment (Head/Hands/Feet Layout)
  {
    id: 'enchanter_t2_elemental_weapon',
    name: 'Elemental Weapon',
    description: 'Weapons gain elemental damage. Choose fire, cold, lightning, or force. Deals 1d6 per rank.',
    icon: 'spell_fire_flamebolt',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'enchanter_t1_weapon_enhancement',
  },
  {
    id: 'enchanter_t2_accessory_enhancement',
    name: 'Accessory Enhancement',
    description: 'Accessory inscriptions grant +1 to saves per rank.',
    icon: 'inv_jewelry_ring_05',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'enchanter_t0_enchantment_mastery',
  },
  {
    id: 'enchanter_t2_defensive_armor',
    name: 'Defensive Armor',
    description: 'Armor grants resistance to chosen damage type per rank (fire, cold, lightning, force).',
    icon: 'spell_nature_skinofearth',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'enchanter_t1_armor_enhancement',
  },

  // Tier 3 - Master Equipment (Ring/Necklace Layout)
  {
    id: 'enchanter_t2_utility_enchantment',
    name: 'Utility Enchantment',
    description: 'Accessories provide utility effects: +10 ft movement, darkvision, or advantage on stealth checks.',
    icon: 'spell_holy_greaterblessingofwisdom',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'enchanter_t2_accessory_enhancement',
  },
  {
    id: 'enchanter_t2_magical_armor',
    name: 'Magical Armor',
    description: 'Armor provides +2 armor against magical attacks per rank.',
    icon: 'spell_holy_greaterblessingofsanctuary',
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: 'enchanter_t2_defensive_armor',
  },

  // Tier 4 - Legendary Equipment (Central Convergence)
  {
    id: 'enchanter_t2_power_accessory',
    name: 'Power Accessory',
    description: 'Accessories restore 1d6 mana per rank when you cast a spell.',
    icon: 'spell_arcane_manatap',
    maxRanks: 3,
    position: { x: 2, y: 4 },
    requires: 'enchanter_t2_accessory_enhancement',
  },

  // Tier 5 - Master Enchantments (Full Equipment Set)
  {
    id: 'enchanter_t3_enchantment_duration',
    name: 'Enchantment Duration',
    description: 'All enchantments last +1 hour per rank (maximum 24 hours).',
    icon: 'spell_holy_greaterblessingoflight',
    maxRanks: 3,
    position: { x: 0, y: 5 },
    requires: 'enchanter_t2_elemental_weapon',
  },
  {
    id: 'enchanter_t3_enchantment_sharing',
    name: 'Enchantment Sharing',
    description: 'Enchantments can be shared with adjacent allies within 5 ft per rank.',
    icon: 'spell_arcane_massdispel',
    maxRanks: 3,
    position: { x: 2, y: 5 },
    requires: 'enchanter_t2_power_accessory',
  },
  {
    id: 'enchanter_t3_enchantment_efficiency',
    name: 'Enchantment Efficiency',
    description: 'Enchantment costs -2 mana per rank (minimum 1). Enchantments take -1 action per rank to apply.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 4, y: 5 },
    requires: 'enchanter_t2_magical_armor',
  },

  // Tier 6 - Legendary Enchantment (Center)
  {
    id: 'enchanter_t4_legendary_enchantment',
    name: 'Legendary Enchantment',
    description: 'Create a legendary enchantment that grants +3 to all rolls, resistance to all damage, and 3d6 temporary HP per rank for 1 minute.',
    icon: 'spell_holy_greaterblessingoflight',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: 'enchanter_t3_enchantment_sharing',
  }
];

// Glyphweaver - Chain Reaction Layout (Connected explosive patterns)
export const INSCRIPTOR_GLYPHWEAVER = [
  // Tier 0 - Foundation (Central Glyph - repeatable)
  {
    id: 'glyphweaver_t0_glyph_mastery',
    name: 'Glyph Mastery',
    description: 'Passively absorb magical damage. Gain 2 AEP for every point of fire, cold, lightning, or necrotic damage taken. Gain 1 AEP for every 2 points of physical damage taken.',
    icon: 'spell_holy_sealofwisdom',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Chain Initiation (Zigzag Start)
  {
    id: 'glyphweaver_t1_detonation_glyph',
    name: 'Detonation Glyph',
    description: 'Create detonation glyphs that explode for 3d6 fire damage per rank in 10 ft radius when triggered.',
    icon: 'spell_fire_selfdestruct',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'glyphweaver_t0_glyph_mastery',
  },
  {
    id: 'glyphweaver_t1_chain_reaction',
    name: 'Chain Reaction',
    description: 'When a glyph detonates, adjacent glyphs have 50% chance per rank to detonate as well.',
    icon: 'spell_fire_fireball02',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'glyphweaver_t0_glyph_mastery',
  },

  // Tier 2 - Chain Links (Alternating Pattern)
  {
    id: 'glyphweaver_t1_glyph_efficiency',
    name: 'Glyph Efficiency',
    description: 'Glyph placement costs -1 mana per rank. Glyphs last +30 seconds per rank.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'glyphweaver_t1_detonation_glyph',
  },
  {
    id: 'glyphweaver_t2_damage_glyph',
    name: 'Damage Glyph',
    description: 'Create damage glyphs that deal 2d8 force damage per rank. Can chain to other damage glyphs.',
    icon: 'spell_arcane_blast',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'glyphweaver_t1_chain_reaction',
  },
  {
    id: 'glyphweaver_t2_control_glyph',
    name: 'Control Glyph',
    description: 'Create control glyphs that apply stun, slow, or silence. DC 14 + rank.',
    icon: 'spell_shadow_curseofachimonde',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'glyphweaver_t1_chain_reaction',
  },

  // Tier 3 - Chain Expansion (Zigzag Continuation)
  {
    id: 'glyphweaver_t2_empowerment_glyph',
    name: 'Empowerment Glyph',
    description: 'Create empowerment glyphs that grant +2 to attack rolls per rank to allies within 5 ft.',
    icon: 'spell_holy_greaterblessingofkings',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'glyphweaver_t1_glyph_efficiency',
  },
  {
    id: 'glyphweaver_t2_healing_glyph',
    name: 'Healing Glyph',
    description: 'Create healing glyphs that restore 2d6 HP per rank when allies step on them.',
    icon: 'spell_holy_flashheal',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'glyphweaver_t2_damage_glyph',
  },

  // Tier 4 - Chain Convergence (Side Branches)
  {
    id: 'glyphweaver_t2_teleport_glyph',
    name: 'Teleport Glyph',
    description: 'Create paired teleport glyphs. Creatures teleport between pairs. Maximum 2 pairs per rank.',
    icon: 'spell_arcane_portaldarnassus',
    maxRanks: 2,
    position: { x: 0, y: 4 },
    requires: 'glyphweaver_t2_empowerment_glyph',
  },
  {
    id: 'glyphweaver_t3_glyph_overload',
    name: 'Glyph Overload',
    description: 'Overload glyphs to increase damage by 50% per rank, but they become unstable and may detonate prematurely.',
    icon: 'spell_lightning_lightningbolt01',
    maxRanks: 3,
    position: { x: 2, y: 4 },
    requires: 'glyphweaver_t2_healing_glyph',
  },
  {
    id: 'glyphweaver_t3_glyph_network',
    name: 'Glyph Network',
    description: 'Create glyph networks that share effects. Networks have +10 ft range per rank.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 4, y: 4 },
    requires: 'glyphweaver_t2_control_glyph',
  },

  // Tier 5 - Ultimate Chain (Center Explosion)
  {
    id: 'glyphweaver_t3_glyph_synchronization',
    name: 'Glyph Synchronization',
    description: 'All glyphs within 20 ft activate simultaneously per rank. Can choose activation order.',
    icon: 'spell_arcane_massdispel',
    maxRanks: 2,
    position: { x: 2, y: 5 },
    requires: 'glyphweaver_t3_glyph_overload',
  },
  {
    id: 'glyphweaver_t4_cataclysmic_chain',
    name: 'Cataclysmic Chain',
    description: 'Trigger a cataclysmic chain reaction. All glyphs detonate in sequence, each dealing maximum damage per rank with +10 ft chain range.',
    icon: 'spell_fire_flamestrike',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: 'glyphweaver_t3_glyph_synchronization',
  }
];
