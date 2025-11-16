// ============================================
// FALSE PROPHET TALENT TREES
// ============================================

export const FALSE_PROPHET_VOIDCALLER = [
  // Tier 0 - Void seed (center of darkness)
  {
    id: 'void_t0_void_seed',
    name: 'Void Seed',
    description: 'Plant a seed of void energy. Once per day, unleash void tendrils dealing 2d8 necrotic damage per rank.',
    icon: 'spell_shadow_summonvoidwalker',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Void tendrils (diagonal spreading darkness)
  {
    id: 'void_t1_shadow_tendrils',
    name: 'Shadow Tendrils',
    description: 'Summon shadow tendrils that grasp enemies. Creatures within 10ft have speed reduced by 10ft per rank.',
    icon: 'spell_shadow_blackplague',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'void_t0_void_seed',
  },
  {
    id: 'void_t1_void_whisper',
    name: 'Void Whisper',
    description: 'Whisper void secrets that drive madness. One creature within 30ft takes 1d6 psychic damage per rank.',
    icon: 'spell_shadow_mindshear',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'void_t0_void_seed',
  },

  // Tier 2 - Void rift expansion (widening darkness)
  {
    id: 'void_t2_abyssal_portal',
    name: 'Abyssal Portal',
    description: 'Open a portal to the abyss. Summon a voidling that attacks enemies for 1 minute.',
    icon: 'spell_shadow_summoninfernal',
    maxRanks: 2,
    position: { x: 0, y: 2 },
    requires: 'void_t1_shadow_tendrils',
  },
  {
    id: 'void_t2_void_eruption',
    name: 'Void Eruption',
    description: 'Cause void energy to erupt. 15ft radius deals 3d6 necrotic damage, half necrotic to allies.',
    icon: 'spell_shadow_shadowfury',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'void_t1_shadow_tendrils',
  },
  {
    id: 'void_t2_emptiness',
    name: 'Emptiness',
    description: 'Embrace emptiness within. You become resistant to necrotic and psychic damage.',
    icon: 'spell_shadow_nethercloak',
    maxRanks: 2,
    position: { x: 4, y: 2 },
    requires: 'void_t1_void_whisper',
  },

  // Tier 3 - Void convergence (merging darkness)
  {
    id: 'void_t3_void_touch',
    name: 'Void Touch',
    description: 'Touch infuses targets with void energy. Next attack deals +2d6 necrotic damage per rank.',
    icon: 'spell_shadow_fingerofdeath',
    maxRanks: 4,
    position: { x: 1, y: 3 },
    requires: 'void_t2_void_eruption',
  },
  {
    id: 'void_t3_abyssal_resonance',
    name: 'Abyssal Resonance',
    description: 'Resonate with abyssal energies. Void spells have +1d6 damage per rank.',
    icon: 'spell_shadow_darkritual',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'void_t2_void_eruption',
  },

  // Tier 4 - Void dominion (expansive control)
  {
    id: 'void_t4_void_nova',
    name: 'Void Nova',
    description: 'Unleash a nova of void energy. 30ft radius deals 4d6 necrotic damage.',
    icon: 'spell_shadow_shadesofdarkness',
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: 'void_t3_void_touch',
  },
  {
    id: 'void_t4_void_beacon',
    name: 'Void Beacon',
    description: 'Become a beacon for void entities. Summon additional void creatures.',
    icon: 'spell_shadow_summonvoidwalkers',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'void_t3_void_touch',
  },
  {
    id: 'void_t4_cosmic_void',
    name: 'Cosmic Void',
    description: 'Tap into the cosmic void. Spells ignore resistance to necrotic and psychic damage.',
    icon: 'spell_shadow_twilight',
    maxRanks: 1,
    position: { x: 4, y: 4 },
    requires: 'void_t3_abyssal_resonance',
  },

  // Tier 5 - Void supremacy (ultimate darkness convergence)
  {
    id: 'void_t5_void_apocalypse',
    name: 'Void Apocalypse',
    description: 'Unleash void apocalypse. 60ft radius becomes difficult terrain and deals 2d6 necrotic damage per turn.',
    icon: 'spell_shadow_demonicempathy',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['void_t4_void_nova', 'void_t4_void_beacon', 'void_t4_cosmic_void'],
    requiresAll: true,
  }
];

// Deceiver Specialization - Mirror illusion pattern (symmetrical deception)
export const FALSE_PROPHET_DECEIVER = [
  // Tier 0 - False visage (central deception)
  {
    id: 'dec_t0_false_visage',
    name: 'False Visage',
    description: 'Adopt a false appearance. Change your appearance and that of up to 2 allies per rank.',
    icon: 'spell_shadow_mindsteal',
    maxRanks: 3,
    position: { x: 2, y: 1 },
    requires: null,
  },

  // Tier 1 - Mirror reflections (horizontal symmetry)
  {
    id: 'dec_t1_mirror_image',
    name: 'Mirror Image',
    description: 'Create mirror images of yourself. Attack rolls against you have disadvantage.',
    icon: 'spell_magic_lesserinvisibilty',
    maxRanks: 4,
    position: { x: 1, y: 0 },
    requires: 'dec_t0_false_visage',
  },
  {
    id: 'dec_t1_phantom_force',
    name: 'Phantom Force',
    description: 'Create phantom forces that deal psychic damage. 2d6 psychic damage per rank.',
    icon: 'spell_shadow_unholyfrenzy',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: 'dec_t0_false_visage',
  },
  {
    id: 'dec_t1_deceptive_aura',
    name: 'Deceptive Aura',
    description: 'Emit deceptive aura. Creatures within 10ft cannot see through illusions.',
    icon: 'spell_shadow_possession',
    maxRanks: 2,
    position: { x: 3, y: 0 },
    requires: 'dec_t0_false_visage',
  },

  // Tier 2 - Illusion cascade (expanding deception)
  {
    id: 'dec_t2_major_illusion',
    name: 'Major Illusion',
    description: 'Create major illusions that can affect all senses. Lasts 10 minutes.',
    icon: 'spell_shadow_unstableaffliction',
    maxRanks: 3,
    position: { x: 0, y: 1 },
    requires: 'dec_t1_mirror_image',
  },
  {
    id: 'dec_t2_false_prophecy',
    name: 'False Prophecy',
    description: 'Weave false prophecies. Creatures believe your lies for 1 minute per rank.',
    icon: 'spell_shadow_mindtwisting',
    maxRanks: 4,
    position: { x: 4, y: 1 },
    requires: 'dec_t1_deceptive_aura',
  },

  // Tier 3 - Mirror symmetry (balanced deception)
  {
    id: 'dec_t3_dual_illusion',
    name: 'Dual Illusion',
    description: 'Create dual illusions that flank enemies. +1d6 damage from flanking illusions.',
    icon: 'spell_magic_magearmor',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'dec_t2_major_illusion',
  },
  {
    id: 'dec_t3_mind_bend',
    name: 'Mind Bend',
    description: 'Bend minds to your will. Charm or frighten creatures within 30ft.',
    icon: 'spell_shadow_siphonmana',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: 'dec_t2_major_illusion',
  },
  {
    id: 'dec_t3_phantom_legion',
    name: 'Phantom Legion',
    description: 'Summon a legion of phantom warriors. They attack enemies for 1 minute.',
    icon: 'spell_shadow_armorofthedark',
    maxRanks: 2,
    position: { x: 3, y: 2 },
    requires: 'dec_t2_false_prophecy',
  },

  // Tier 4 - Deception mastery (perfect symmetry)
  {
    id: 'dec_t4_reality_warp',
    name: 'Reality Warp',
    description: 'Warp reality itself. Teleport creatures or objects within 60ft.',
    icon: 'spell_shadow_teleport',
    maxRanks: 2,
    position: { x: 0, y: 3 },
    requires: 'dec_t3_dual_illusion',
  },
  {
    id: 'dec_t4_ultimate_deception',
    name: 'Ultimate Deception',
    description: 'Master of ultimate deception. Creatures automatically fail saves against your illusions.',
    icon: 'spell_shadow_charm',
    maxRanks: 1,
    position: { x: 2, y: 3 },
    requires: 'dec_t3_mind_bend',
  },
  {
    id: 'dec_t4_illusion_storm',
    name: 'Illusion Storm',
    description: 'Create a storm of illusions. 30ft radius filled with damaging phantoms.',
    icon: 'spell_shadow_rainoffire',
    maxRanks: 3,
    position: { x: 4, y: 3 },
    requires: 'dec_t3_phantom_legion',
  },

  // Tier 5 - Deceptive supremacy (ultimate illusion convergence)
  {
    id: 'dec_t5_reality_shatter',
    name: 'Reality Shatter',
    description: 'Shatter the fabric of reality. Create a 60ft zone where you control all illusions and deceptions.',
    icon: 'spell_shadow_mindflay',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['dec_t4_reality_warp', 'dec_t4_ultimate_deception', 'dec_t4_illusion_storm'],
    requiresAll: true,
  }
];

// Cultist Specialization - Ritual star pattern (summoning convergence)
export const FALSE_PROPHET_CULTIST = [
  // Tier 0 - Dark ritual (pentagram center)
  {
    id: 'cult_t0_dark_ritual',
    name: 'Dark Ritual',
    description: 'Perform dark rituals. Sacrifice hit points to gain temporary hit points (2 per HP sacrificed).',
    icon: 'spell_shadow_summonimp',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Summoning circle (star points)
  {
    id: 'cult_t1_summon_demonling',
    name: 'Summon Demonling',
    description: 'Summon a demonling to fight for you. It has armor 13 and deals 1d6 piercing damage.',
    icon: 'spell_shadow_summonfelhunter',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'cult_t0_dark_ritual',
  },
  {
    id: 'cult_t1_curse_of_agony',
    name: 'Curse of Agony',
    description: 'Curse enemies with agony. Target takes 1d6 necrotic damage per turn for 1 minute.',
    icon: 'spell_shadow_curseofsargeras',
    maxRanks: 4,
    position: { x: 3, y: 1 },
    requires: 'cult_t0_dark_ritual',
  },

  // Tier 2 - Ritual bindings (star expansion)
  {
    id: 'cult_t2_blood_ritual',
    name: 'Blood Ritual',
    description: 'Perform blood ritual. Deal 2d6 necrotic damage to yourself, allies regain 3d6 HP.',
    icon: 'spell_shadow_lifedrain',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'cult_t1_summon_demonling',
  },
  {
    id: 'cult_t2_demon_pact',
    name: 'Demon Pact',
    description: 'Form pacts with demons. Summon more powerful demon servants.',
    icon: 'spell_shadow_demonicpact',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: 'cult_t1_summon_demonling',
  },
  {
    id: 'cult_t2_forbidden_knowledge',
    name: 'Forbidden Knowledge',
    description: 'Access forbidden knowledge. Learn additional spells from the dark arts.',
    icon: 'spell_shadow_grimward',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'cult_t1_curse_of_agony',
  },

  // Tier 3 - Cult leadership (ritual convergence)
  {
    id: 'cult_t3_mass_summoning',
    name: 'Mass Summoning',
    description: 'Summon multiple demonic entities. Create a horde of lesser demons.',
    icon: 'spell_shadow_summonvoidwalkers',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'cult_t2_demon_pact',
  },
  {
    id: 'cult_t3_dark_empowerment',
    name: 'Dark Empowerment',
    description: 'Empower yourself with dark energy. +1d6 to spell damage per rank.',
    icon: 'spell_shadow_shadowembrace',
    maxRanks: 4,
    position: { x: 3, y: 3 },
    requires: 'cult_t2_demon_pact',
  },

  // Tier 4 - Ritual mastery (star apex)
  {
    id: 'cult_t4_abyssal_summoning',
    name: 'Abyssal Summoning',
    description: 'Summon abyssal entities. Call forth powerful demons from the depths.',
    icon: 'spell_shadow_summoninfernal',
    maxRanks: 1,
    position: { x: 0, y: 4 },
    requires: 'cult_t3_mass_summoning',
  },
  {
    id: 'cult_t4_cult_mastery',
    name: 'Cult Mastery',
    description: 'Master of cult leadership. Summoned creatures have +2 armor and damage.',
    icon: 'spell_shadow_antimagicshell',
    maxRanks: 3,
    position: { x: 2, y: 4 },
    requires: 'cult_t3_mass_summoning',
  },
  {
    id: 'cult_t4_eldritch_power',
    name: 'Eldritch Power',
    description: 'Tap into eldritch power. Spells ignore spell resistance.',
    icon: 'spell_shadow_darkritual',
    maxRanks: 2,
    position: { x: 4, y: 4 },
    requires: 'cult_t3_dark_empowerment',
  },

  // Tier 5 - Ultimate ritual (cult convergence)
  {
    id: 'cult_t5_demon_lord_invocation',
    name: 'Demon Lord Invocation',
    description: 'Invoke a demon lord. Summon a powerful demon lord to wreak havoc.',
    icon: 'spell_shadow_summonfelguard',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['cult_t4_abyssal_summoning', 'cult_t4_cult_mastery', 'cult_t4_eldritch_power'],
    requiresAll: true,
  }
];
