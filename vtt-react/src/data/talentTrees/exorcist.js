// ============================================
// EXORCIST TALENT TREES
// ============================================

export const EXORCIST_DEMONOLOGIST = [
  // Tier 0 - Ritual center (pentagram core)
  {
    id: 'demo_t0_summoning_sigil',
    name: 'Summoning Sigil',
    description: 'Draw a summoning sigil that binds demonic entities. Once per day, summon a bound demon.',
    icon: 'spell_shadow_summonfelguard',
    maxRanks: 3,
    position: { x: 2, y: 1 },
    requires: null,
  },

  // Tier 1 - Star points (pentagram vertices)
  {
    id: 'demo_t1_binding_runes',
    name: 'Binding Runes',
    description: 'Inscribe binding runes that weaken demons. Demons within 30ft have -1d6 to attack rolls per rank.',
    icon: 'spell_shadow_curseofsargeras',
    maxRanks: 4,
    position: { x: 0, y: 0 },
    requires: 'demo_t0_summoning_sigil',
  },
  {
    id: 'demo_t1_demonology_lore',
    name: 'Demonology Lore',
    description: 'Master demonic lore. +1d6 damage to demons and advantage on saves against demonic effects.',
    icon: 'spell_shadow_grimward',
    maxRanks: 3,
    position: { x: 4, y: 0 },
    requires: 'demo_t0_summoning_sigil',
  },
  {
    id: 'demo_t1_containment_ward',
    name: 'Containment Ward',
    description: 'Create containment wards that trap demons. Demons cannot teleport within 20ft.',
    icon: 'spell_holy_exorcism',
    maxRanks: 2,
    position: { x: 1, y: 2 },
    requires: 'demo_t0_summoning_sigil',
  },
  {
    id: 'demo_t1_warding_circle',
    name: 'Warding Circle',
    description: 'Draw powerful warding circles. Demons cannot enter or attack within 15ft.',
    icon: 'spell_holy_circleofrenewal',
    maxRanks: 2,
    position: { x: 3, y: 2 },
    requires: 'demo_t0_summoning_sigil',
  },

  // Tier 2 - Star intersections (pentagram crossings)
  {
    id: 'demo_t2_demon_binding',
    name: 'Demon Binding',
    description: 'Bind demons to your will. Control summoned demons with +1 HD per rank.',
    icon: 'spell_shadow_enslavedemon',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: 'demo_t1_binding_runes',
  },
  {
    id: 'demo_t2_banishment',
    name: 'Banishment',
    description: 'Master banishment rituals. Banish demons back to their plane on a failed save.',
    icon: 'spell_shadow_demonicfortitude',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: 'demo_t1_containment_ward',
  },

  // Tier 3 - Inner star circle (ritual strengthening)
  {
    id: 'demo_t3_greater_binding',
    name: 'Greater Binding',
    description: 'Create greater bindings. Bound demons have disadvantage on saves.',
    icon: 'spell_shadow_antimagicshell',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'demo_t2_demon_binding',
  },
  {
    id: 'demo_t3_exorcists_ward',
    name: 'Exorcist\'s Ward',
    description: 'Create ultimate exorcist wards. Immune to possession and demonic charm.',
    icon: 'spell_holy_powerwordbarrier',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'demo_t2_banishment',
  },

  // Tier 4 - Star apex (ritual mastery)
  {
    id: 'demo_t4_demon_lord_binding',
    name: 'Demon Lord Binding',
    description: 'Bind demon lords themselves. Control demon lords for 1 minute per rank.',
    icon: 'spell_shadow_summonfelguard',
    maxRanks: 1,
    position: { x: 0, y: 3 },
    requires: 'demo_t3_greater_binding',
  },
  {
    id: 'demo_t4_abyssal_banishment',
    name: 'Abyssal Banishment',
    description: 'Master abyssal banishment. Banish any demon regardless of HD.',
    icon: 'spell_shadow_lifedrain',
    maxRanks: 1,
    position: { x: 4, y: 3 },
    requires: 'demo_t3_exorcists_ward',
  },

  // Tier 5 - Ritual convergence (ultimate star binding)
  {
    id: 'demo_t5_planar_mastery',
    name: 'Planar Mastery',
    description: 'Achieve planar mastery. Control all demons within 100ft and banish them at will.',
    icon: 'spell_shadow_demonicempathy',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['demo_t4_demon_lord_binding', 'demo_t4_abyssal_banishment', 'demo_t2_demon_binding'],
    requiresAll: true,
  }
];

// Demon Lord Specialization - Throne ascension pattern (demonic hierarchy steps)
export const EXORCIST_DEMON_LORD = [
  // Tier 0 - Throne base (foundation stone)
  {
    id: 'dlord_t0_infernal_pact',
    name: 'Infernal Pact',
    description: 'Form an infernal pact with a demon lord. Gain resistance to fire and poison damage.',
    icon: 'ability_warlock_demonicpower',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - First throne step (power foundation)
  {
    id: 'dlord_t1_demon_strength',
    name: 'Demon Strength',
    description: 'Draw strength from demonic pacts. +1d6 damage with melee weapons per rank.',
    icon: 'spell_shadow_felarmour',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'dlord_t0_infernal_pact',
  },
  {
    id: 'dlord_t1_demon_armor',
    name: 'Demon Armor',
    description: 'Armor forged in demon fires. +2 armor and resistance to fire damage.',
    icon: 'spell_shadow_ragingscream',
    maxRanks: 2,
    position: { x: 3, y: 1 },
    requires: 'dlord_t0_infernal_pact',
  },

  // Tier 2 - Second throne step (power elevation)
  {
    id: 'dlord_t2_hellfire_blast',
    name: 'Hellfire Blast',
    description: 'Unleash hellfire blasts. Deal 2d8 fire damage to one target per rank.',
    icon: 'spell_fire_firebolt',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'dlord_t1_demon_strength',
  },
  {
    id: 'dlord_t2_fel_presence',
    name: 'Fel Presence',
    description: 'Emit fel presence. Creatures within 10ft take 1d6 fire damage per turn.',
    icon: 'spell_shadow_mindsteal',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'dlord_t1_demon_strength',
  },
  {
    id: 'dlord_t2_infernal_rage',
    name: 'Infernal Rage',
    description: 'Tap into infernal rage. When reduced below 50% HP, deal +1d6 damage per rank.',
    icon: 'ability_warrior_endlessrage',
    maxRanks: 4,
    position: { x: 4, y: 2 },
    requires: 'dlord_t1_demon_armor',
  },

  // Tier 3 - Third throne step (lordly elevation)
  {
    id: 'dlord_t3_demon_lord_aspect',
    name: 'Demon Lord Aspect',
    description: 'Take on aspects of demon lords. Gain flight and +2 to all saves.',
    icon: 'spell_shadow_metamorphosis',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'dlord_t2_fel_presence',
  },
  {
    id: 'dlord_t3_soul_drain',
    name: 'Soul Drain',
    description: 'Drain souls for power. Killing enemies restores 2d6 HP per rank.',
    icon: 'spell_shadow_soulleech',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'dlord_t2_fel_presence',
  },

  // Tier 4 - Throne arms (power extension)
  {
    id: 'dlord_t4_abyssal_command',
    name: 'Abyssal Command',
    description: 'Command abyssal forces. Summon demon minions that obey your commands.',
    icon: 'spell_shadow_summoninfernal',
    maxRanks: 2,
    position: { x: 0, y: 3 },
    requires: 'dlord_t3_demon_lord_aspect',
  },
  {
    id: 'dlord_t4_eternal_flames',
    name: 'Eternal Flames',
    description: 'Wreathe yourself in eternal flames. Deal 2d6 fire damage to melee attackers.',
    icon: 'spell_fire_immolation',
    maxRanks: 2,
    position: { x: 4, y: 3 },
    requires: 'dlord_t3_soul_drain',
  },

  // Tier 5 - Throne seat (crown of demonic power)
  {
    id: 'dlord_t5_demon_lord_wrath',
    name: 'Demon Lord Wrath',
    description: 'Unleash demon lord wrath. 30ft radius deals 4d6 fire damage.',
    icon: 'spell_fire_fire',
    maxRanks: 3,
    position: { x: 2, y: 4 },
    requires: ['dlord_t4_abyssal_command', 'dlord_t4_eternal_flames', 'dlord_t2_hellfire_blast'],
    requiresAll: true,
  },

  // Tier 6 - Throne pinnacle (ultimate demonic ascension)
  {
    id: 'dlord_t6_become_demon_lord',
    name: 'Become Demon Lord',
    description: 'Ascend to demon lord status. Transform into a demon lord with immense power.',
    icon: 'spell_shadow_demonform',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: 'dlord_t5_demon_lord_wrath',
  }
];

// Possessed Specialization - Corruption tendrils pattern (spreading metamorphosis)
export const EXORCIST_POSSESSED = [
  // Tier 0 - Infection core (central corruption)
  {
    id: 'poss_t0_demonic_embrace',
    name: 'Demonic Embrace',
    description: 'Embrace demonic possession. Gain +1d6 necrotic damage to attacks but take 1d6 damage per turn.',
    icon: 'spell_shadow_possession',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Initial tendrils (first corruption spread)
  {
    id: 'poss_t1_corruption_touch',
    name: 'Corruption Touch',
    description: 'Spread corruption through touch. Target takes 2d6 necrotic damage and becomes poisoned.',
    icon: 'spell_shadow_creepingplague',
    maxRanks: 4,
    position: { x: 3, y: 0 },
    requires: 'poss_t0_demonic_embrace',
  },
  {
    id: 'poss_t1_mutated_form',
    name: 'Mutated Form',
    description: 'Your form mutates with demonic power. +2 Strength and resistance to poison.',
    icon: 'spell_shadow_auraofdarkness',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'poss_t0_demonic_embrace',
  },

  // Tier 2 - Tendril growth (expanding corruption)
  {
    id: 'poss_t2_demonic_regeneration',
    name: 'Demonic Regeneration',
    description: 'Regenerate through demonic power. Regain 1d8 HP per rank at the start of your turn.',
    icon: 'spell_shadow_lifedrain',
    maxRanks: 4,
    position: { x: 4, y: 1 },
    requires: 'poss_t1_corruption_touch',
  },
  {
    id: 'poss_t2_corruption_aura',
    name: 'Corruption Aura',
    description: 'Emit corruption aura. Enemies within 10ft take 1d6 necrotic damage per turn.',
    icon: 'spell_shadow_contagion',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'poss_t1_mutated_form',
  },
  {
    id: 'poss_t3_tendril_strike',
    name: 'Tendril Strike',
    description: 'Strike with demonic tendrils. Deal weapon damage + 2d6 necrotic damage in 15ft reach.',
    icon: 'ability_rogue_disembowel',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: 'poss_t1_corruption_touch',
  },

  // Tier 3 - Tendril network (interconnected corruption)
  {
    id: 'poss_t3_psychic_corruption',
    name: 'Psychic Corruption',
    description: 'Corrupt minds as well as bodies. Creatures within 30ft have disadvantage on Spirit saves.',
    icon: 'spell_shadow_mindrot',
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: 'poss_t2_demonic_regeneration',
  },
  {
    id: 'poss_t3_demon_form',
    name: 'Demon Form',
    description: 'Transform into demon form. Gain +2 armor, darkvision, and immunity to poison.',
    icon: 'spell_shadow_demonform',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'poss_t2_corruption_aura',
  },

  // Tier 4 - Tendril dominance (overgrown corruption)
  {
    id: 'poss_t4_corruption_nova',
    name: 'Corruption Nova',
    description: 'Unleash corruption nova. 20ft radius deals 3d6 necrotic damage and poisons creatures.',
    icon: 'spell_shadow_shadowfury',
    maxRanks: 3,
    position: { x: 4, y: 3 },
    requires: 'poss_t3_psychic_corruption',
  },
  {
    id: 'poss_t4_complete_possession',
    name: 'Complete Possession',
    description: 'Achieve complete demonic possession. Immune to charm, fear, and psychic damage.',
    icon: 'spell_shadow_antimagicshell',
    maxRanks: 1,
    position: { x: 2, y: 3 },
    requires: 'poss_t3_psychic_corruption',
  },
  {
    id: 'poss_t4_abyssal_armor',
    name: 'Abyssal Armor',
    description: 'Armor forged from abyssal corruption. +3 armor and resistance to all damage.',
    icon: 'spell_shadow_nethercloak',
    maxRanks: 2,
    position: { x: 0, y: 4 },
    requires: 'poss_t3_demon_form',
  },

  // Tier 5 - Tendril supremacy (ultimate corruption spread)
  {
    id: 'poss_t5_demon_prince',
    name: 'Demon Prince',
    description: 'Ascend to demon prince status. Control corruption in a 60ft radius and corrupt reality itself.',
    icon: 'spell_shadow_summonfelguard',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: ['poss_t4_corruption_nova', 'poss_t4_complete_possession', 'poss_t4_abyssal_armor'],
    requiresAll: true,
  }
];
