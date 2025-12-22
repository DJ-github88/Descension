// ============================================
// BERSERKER TALENT TREES
// ============================================

export const BERSERKER_PRIMAL_RAGE = [
  // Ignition - Spark of Fury (Bottom-left start)
  {
    id: 'primal_rage_t0_inner_fire',
    name: 'Inner Fire',
    description: 'Your rage burns hotter. Generate +1 Rage per rank when you attack.',
    icon: 'spell_fire_innerfire',
    maxRanks: 5,
    position: { x: 0, y: 1 },
    requires: null,
  },

  // Charge Path - Diagonal Assault (Bottom-left to top-right)
  {
    id: 'primal_rage_t1_fury_damage',
    name: 'Fury Damage',
    description: 'Rank 1: Weapon damage +1 for each Rage State above Smoldering. Rank 2: Weapon damage +1 for each Rage State above Smoldering. You can spend 1 Rage to gain advantage on your next attack. Rank 3: Weapon damage +1 for each Rage State above Smoldering. You can spend 1 Rage to gain advantage on your next attack. Rank 4: Weapon damage +2 for each Rage State above Smoldering. You can spend 1 Rage to gain advantage on your next attack.',
    icon: 'ability_warrior_savageblow',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'primal_rage_t0_inner_fire',
  },
  {
    id: 'primal_rage_t2_carnage_strike',
    name: 'Carnage Strike',
    description: 'Unlocks Carnage Strike - spend 40 Rage for +2d6 damage and advantage on attack.',
    icon: 'ability_warrior_bloodnova',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'primal_rage_t1_fury_damage',
  },
  {
    id: 'primal_rage_t3_cataclysmic_blow',
    name: 'Cataclysmic Blow',
    description: 'Unlocks Cataclysmic Blow - spend 80 Rage for 3d6 extra damage and knockback 10 ft.',
    icon: 'ability_warrior_titansgrip',
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: 'primal_rage_t2_carnage_strike',
  },
  {
    id: 'primal_rage_t4_obliterating_strike',
    name: 'Obliterating Strike',
    description: 'Unlocks Obliterating Strike - spend 100+ Rage for 4d8 damage and area effect.',
    icon: 'spell_fire_meteorstorm',
    maxRanks: 1,
    position: { x: 4, y: 4 },
    requires: 'primal_rage_t3_cataclysmic_blow',
  },

  // Momentum Path - Vertical Surge (Bottom to top)
  {
    id: 'primal_rage_t1_bloodlust',
    name: 'Bloodlust',
    description: 'Rank 1: Critical hits generate +1d4 Rage. Rank 2: Critical hits generate +1d4 Rage. You can enter a Frenzied Rage State using action points. Rank 3: Critical hits generate +1d6 Rage. You can enter a Frenzied Rage State using action points. Rank 4: Critical hits generate +1d6 Rage. You can enter a Frenzied Rage State using action points and reduce Rage decay by 1.',
    icon: 'spell_shadow_bloodboil',
    maxRanks: 4,
    position: { x: 0, y: 2 },
    requires: 'primal_rage_t0_inner_fire',
  },
  {
    id: 'primal_rage_t2_frenzied_strikes',
    name: 'Frenzied Strikes',
    description: 'Attacks while Frenzied generate +1 additional Rage per rank.',
    icon: 'ability_warrior_weaponmastery',
    maxRanks: 3,
    position: { x: 0, y: 3 },
    requires: 'primal_rage_t1_bloodlust',
  },
  {
    id: 'primal_rage_t3_rage_echo',
    name: 'Rage Echo',
    description: 'When you defeat an enemy, nearby allies generate 1d6 Rage per rank.',
    icon: 'spell_shadow_unholyfrenzy',
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: 'primal_rage_t2_frenzied_strikes',
  },
  {
    id: 'primal_rage_t4_primal_surge',
    name: 'Primal Surge',
    description: 'Once per combat, instantly reach Primal Rage State and gain +1d8 Rage per rank.',
    icon: 'spell_nature_ancestralguardian',
    maxRanks: 2,
    position: { x: 0, y: 5 },
    requires: 'primal_rage_t3_rage_echo',
  },

  // Control Path - Horizontal Sustain (Middle row control)
  {
    id: 'primal_rage_t2_rage_decay',
    name: 'Rage Decay',
    description: 'Rage decays by 3 less per round per rank.',
    icon: 'spell_shadow_mindsteal',
    maxRanks: 4,
    position: { x: 1, y: 2 },
    requires: 'primal_rage_t1_fury_damage',
  },
  {
    id: 'primal_rage_t3_overheat_resistance',
    name: 'Overheat Resistance',
    description: 'Overheat threshold increases by 10 per rank.',
    icon: 'spell_fire_playingwithfire',
    maxRanks: 3,
    position: { x: 2, y: 3 },
    requires: 'primal_rage_t2_rage_decay',
  },
  {
    id: 'primal_rage_t4_fury_mastery',
    name: 'Fury Mastery',
    description: 'Rage abilities cost 10 less Rage per rank.',
    icon: 'spell_nature_unrelentingstorm',
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: 'primal_rage_t3_overheat_resistance',
  },
  {
    id: 'primal_rage_t5_rage_overflow',
    name: 'Rage Overflow',
    description: 'When you would Overheat, spend all Rage on a free Obliterating Strike instead.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 1,
    position: { x: 4, y: 5 },
    requires: 'primal_rage_t4_fury_mastery',
  },

  // Ultimate Charge - Corner Convergence
  {
    id: 'primal_rage_t5_apocalyptic_wrath',
    name: 'Apocalyptic Wrath',
    description: 'At Obliteration Rage State, all attacks deal +2d6 damage and you become immune to control effects.',
    icon: 'spell_fire_elementaldevastation',
    maxRanks: 3,
    position: { x: 1, y: 6 },
    requires: ['primal_rage_t4_primal_surge', 'primal_rage_t4_obliterating_strike'],
    requiresAll: false,
  },
  {
    id: 'primal_rage_t6_god_mode',
    name: 'God Mode',
    description: 'At Obliteration Rage State, you gain +20 temp HP and attacks have advantage.',
    icon: 'spell_holy_weaponmastery',
    maxRanks: 2,
    position: { x: 3, y: 6 },
    requires: ['primal_rage_t4_obliterating_strike', 'primal_rage_t5_rage_overflow'],
    requiresAll: false,
  },

  // Final Fury - Apex of Rage
  {
    id: 'primal_rage_t7_berserker_god',
    name: 'Berserker God',
    description: 'Unlocks Berserker God Mode - permanently stay in Obliteration state, but take 1d6 damage per round.',
    icon: 'spell_shadow_unholystrength',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['primal_rage_t5_apocalyptic_wrath', 'primal_rage_t6_god_mode'],
    requiresAll: true,
  }
];

// Blood Frenzy Specialization - Wound-Powered Fury (Chaotic blood web)
export const BERSERKER_BLOOD_FRENZY = [
  // Blood Nexus - Chaotic Center
  {
    id: 'blood_frenzy_t0_blood_magic',
    name: 'Blood Magic',
    description: 'Taking damage generates +1 additional Rage per rank.',
    icon: 'spell_shadow_bloodboil',
    maxRanks: 5,
    position: { x: 2, y: 2 },
    requires: null,
  },

  // Upper Blood Web - Damage Conversion Cluster
  {
    id: 'blood_frenzy_t1_blood_rage',
    name: 'Blood Rage',
    description: 'Convert HP damage to Rage. Roll 1d4 per rank - gain that much Rage instead of taking damage.',
    icon: 'spell_shadow_soulleech',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'blood_frenzy_t0_blood_magic',
  },
  {
    id: 'blood_frenzy_t2_crimson_wave',
    name: 'Crimson Wave',
    description: 'Unlocks Crimson Wave - spend 30 Rage to heal 2d8 HP and damage nearby enemies for 1d8.',
    icon: 'ability_warrior_bloodnova',
    maxRanks: 3,
    position: { x: 0, y: 0 },
    requires: 'blood_frenzy_t1_blood_rage',
  },
  {
    id: 'blood_frenzy_t2_sanguine_eruption',
    name: 'Sanguine Eruption',
    description: 'Unlocks Sanguine Eruption - spend 60 Rage to deal 3d6 damage in 15 ft radius and heal for half.',
    icon: 'spell_shadow_bloodboil',
    maxRanks: 2,
    position: { x: 2, y: 0 },
    requires: 'blood_frenzy_t1_blood_rage',
  },
  {
    id: 'blood_frenzy_t3_blood_storm',
    name: 'Blood Storm',
    description: 'Unlocks Blood Storm - spend 90 Rage to create blood storm dealing 4d6 damage per round for 3 rounds.',
    icon: 'spell_shadow_painspike',
    maxRanks: 1,
    position: { x: 1, y: 0 },
    requires: 'blood_frenzy_t2_crimson_wave',
  },

  // Wound Spiral - Left Descending Path (Suffering builds power)
  {
    id: 'blood_frenzy_t1_wound_power',
    name: 'Wound Power',
    description: 'For each 25% missing HP per rank, gain +1 to attack and damage rolls.',
    icon: 'spell_shadow_lifedrain',
    maxRanks: 4,
    position: { x: 0, y: 3 },
    requires: 'blood_frenzy_t0_blood_magic',
  },
  {
    id: 'blood_frenzy_t2_bloody_retaliation',
    name: 'Bloody Retaliation',
    description: 'When damaged, your next attack gains +1d4 damage per rank.',
    icon: 'ability_warrior_bloodbath',
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: 'blood_frenzy_t1_wound_power',
  },
  {
    id: 'blood_frenzy_t3_life_steal',
    name: 'Life Steal',
    description: 'Weapon attacks heal you for 1d4 HP per rank when below 50% HP.',
    icon: 'spell_shadow_lifedrain02',
    maxRanks: 3,
    position: { x: 0, y: 5 },
    requires: 'blood_frenzy_t2_bloody_retaliation',
  },
  {
    id: 'blood_frenzy_t4_blood_fury',
    name: 'Blood Fury',
    description: 'While below 25% HP, attacks generate +1d6 Rage per rank.',
    icon: 'spell_shadow_bloodboil',
    maxRanks: 2,
    position: { x: 1, y: 6 },
    requires: 'blood_frenzy_t3_life_steal',
  },

  // Pain Web - Right Defensive Cluster (Turn pain into power)
  {
    id: 'blood_frenzy_t1_pain_threshold',
    name: 'Pain Threshold',
    description: 'You have advantage on saves while below 50% HP per rank.',
    icon: 'spell_shadow_shadowwordpain',
    maxRanks: 4,
    position: { x: 4, y: 3 },
    requires: 'blood_frenzy_t0_blood_magic',
  },
  {
    id: 'blood_frenzy_t2_adrenaline_rush',
    name: 'Adrenaline Rush',
    description: 'When reduced below 25% HP, gain +10 movement speed and +2 to all rolls for 1 round.',
    icon: 'ability_rogue_sprint',
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: 'blood_frenzy_t1_pain_threshold',
  },
  {
    id: 'blood_frenzy_t3_berserk_healing',
    name: 'Berserk Healing',
    description: 'While in Carnage Rage State, regenerate 1d6 HP per round per rank.',
    icon: 'spell_holy_blessedrecovery',
    maxRanks: 3,
    position: { x: 4, y: 5 },
    requires: 'blood_frenzy_t2_adrenaline_rush',
  },
  {
    id: 'blood_frenzy_t4_deathless_fury',
    name: 'Deathless Fury',
    description: 'Cannot be reduced below 1 HP by attacks. Excess damage becomes Rage instead.',
    icon: 'spell_shadow_deathscream',
    maxRanks: 1,
    position: { x: 3, y: 6 },
    requires: 'blood_frenzy_t3_berserk_healing',
  },

  // Cross-Blood Connections - Chaotic Links
  {
    id: 'blood_frenzy_t2_hemorrhagic_link',
    name: 'Hemorrhagic Link',
    description: 'When you damage an enemy, they bleed for 1d4 damage per round per rank.',
    icon: 'spell_shadow_bloodboil',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'blood_frenzy_t1_blood_rage',
  },
  {
    id: 'blood_frenzy_t3_vampiric_echo',
    name: 'Vampiric Echo',
    description: 'Life Steal heals nearby allies for half the amount per rank.',
    icon: 'spell_shadow_lifedrain02',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'blood_frenzy_t2_bloody_retaliation',
  },

  // Blood Vortex - Chaotic Convergence
  {
    id: 'blood_frenzy_t5_blood_god',
    name: 'Blood God',
    description: 'At Obliteration Rage State, you heal 2d6 HP per round and enemies take 2d6 damage when they damage you.',
    icon: 'spell_shadow_bloodboil',
    maxRanks: 3,
    position: { x: 0, y: 6 },
    requires: ['blood_frenzy_t4_blood_fury', 'blood_frenzy_t3_blood_storm'],
    requiresAll: false,
  },
  {
    id: 'blood_frenzy_t5_eternal_frenzy',
    name: 'Eternal Frenzy',
    description: 'At Obliteration Rage State, you cannot be killed while Rage remains. Death resets you to 1 HP instead.',
    icon: 'spell_shadow_unholyfrenzy',
    maxRanks: 2,
    position: { x: 4, y: 6 },
    requires: ['blood_frenzy_t4_deathless_fury', 'blood_frenzy_t3_blood_storm'],
    requiresAll: false,
  },
  {
    id: 'blood_frenzy_t5_blood_ritual',
    name: 'Blood Ritual',
    description: 'Sacrifice HP to gain Rage. Spend 10 HP to gain 20 Rage per rank.',
    icon: 'spell_shadow_soulleech',
    maxRanks: 3,
    position: { x: 2, y: 6 },
    requires: ['blood_frenzy_t4_blood_fury', 'blood_frenzy_t4_deathless_fury'],
    requiresAll: false,
  },

  // Ultimate Hemorrhage - Chaotic Blood God
  {
    id: 'blood_frenzy_t6_blood_god_ascended',
    name: 'Blood God Ascended',
    description: 'Unlocks Blood God Ascension - transform into a blood god, dealing damage equal to HP lost this combat.',
    icon: 'spell_shadow_bloodboil',
    maxRanks: 1,
    position: { x: 2, y: 7 },
    requires: ['blood_frenzy_t5_blood_god', 'blood_frenzy_t5_eternal_frenzy', 'blood_frenzy_t5_blood_ritual'],
    requiresAll: false,
  }
];

// Savage Instincts Specialization - Primal Combat Techniques (Organic branching instincts)
export const BERSERKER_SAVAGE_INSTINCTS = [
  // Root Instinct - Buried Foundation
  {
    id: 'savage_instincts_t0_primal_awareness',
    name: 'Primal Awareness',
    description: 'You have advantage on Perception checks to detect hidden enemies per rank.',
    icon: 'ability_druid_primalprecision',
    maxRanks: 5,
    position: { x: 2, y: 3 },
    requires: null,
  },

  // Hunting Branch - Top-Left Predator Path (Sharp, direct pursuit)
  {
    id: 'savage_instincts_t1_predators_grasp',
    name: 'Predator\'s Grasp',
    description: 'Flanking attacks deal +1d6 damage per rank. You always count as flanking.',
    icon: 'ability_hunter_catlikereflexes',
    maxRanks: 4,
    position: { x: 0, y: 1 },
    requires: 'savage_instincts_t0_primal_awareness',
  },
  {
    id: 'savage_instincts_t2_hunters_instinct',
    name: 'Hunter\'s Instinct',
    description: 'When you hit a wounded enemy, deal +1d8 damage per rank.',
    icon: 'ability_druid_predatoryinstincts',
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: 'savage_instincts_t1_predators_grasp',
  },
  {
    id: 'savage_instincts_t3_blood_scent',
    name: 'Blood Scent',
    description: 'You can track wounded creatures by scent. +2 to Survival checks to track bleeding enemies.',
    icon: 'ability_hunter_scentoftheblood',
    maxRanks: 3,
    position: { x: 0, y: 0 },
    requires: 'savage_instincts_t2_hunters_instinct',
  },

  // Defense Branch - Bottom-Right Guardian Path (Thick, protective growth)
  {
    id: 'savage_instincts_t1_survival_instincts',
    name: 'Survival Instincts',
    description: 'You have +1 armor per rank when fighting outnumbered. Maximum +5.',
    icon: 'spell_nature_spiritwolf',
    maxRanks: 4,
    position: { x: 4, y: 5 },
    requires: 'savage_instincts_t0_primal_awareness',
  },
  {
    id: 'savage_instincts_t2_endurance_training',
    name: 'Endurance Training',
    description: 'Your hit point maximum increases by 5 per rank.',
    icon: 'spell_holy_wordfortitude',
    maxRanks: 3,
    position: { x: 3, y: 6 },
    requires: 'savage_instincts_t1_survival_instincts',
  },
  {
    id: 'savage_instincts_t3_peak_conditioning',
    name: 'Peak Conditioning',
    description: 'You gain +5 ft movement speed per rank and ignore difficult terrain.',
    icon: 'ability_druid_dash',
    maxRanks: 3,
    position: { x: 4, y: 6 },
    requires: 'savage_instincts_t2_endurance_training',
  },

  // Combat Branch - Top-Right Warrior Path (Broad, aggressive spread)
  {
    id: 'savage_instincts_t1_combat_instincts',
    name: 'Combat Instincts',
    description: 'You have advantage on initiative rolls per rank.',
    icon: 'ability_warrior_weaponmastery',
    maxRanks: 4,
    position: { x: 4, y: 1 },
    requires: 'savage_instincts_t0_primal_awareness',
  },
  {
    id: 'savage_instincts_t2_weapon_specialization',
    name: 'Weapon Specialization',
    description: 'Choose a weapon type. You gain +1 to attack and damage rolls with that weapon type per rank.',
    icon: 'ability_warrior_savageblow',
    maxRanks: 3,
    position: { x: 3, y: 0 },
    requires: 'savage_instincts_t1_combat_instincts',
  },
  {
    id: 'savage_instincts_t3_combat_mastery',
    name: 'Combat Mastery',
    description: 'You can make one additional attack per turn per rank.',
    icon: 'ability_warrior_bloodfrenzy',
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: 'savage_instincts_t2_weapon_specialization',
  },

  // Organic Connections - Root Network (Interweaving growth patterns)
  {
    id: 'savage_instincts_t2_primal_bond',
    name: 'Primal Bond',
    description: 'You can share senses with nearby beasts. Range 30 ft per rank.',
    icon: 'ability_druid_primalprecision',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'savage_instincts_t1_predators_grasp',
  },
  {
    id: 'savage_instincts_t3_animal_kinship',
    name: 'Animal Kinship',
    description: 'Beasts have +1 to attack rolls against your enemies per rank.',
    icon: 'ability_hunter_beastcall',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'savage_instincts_t2_primal_bond',
  },
  {
    id: 'savage_instincts_t2_tactical_awareness',
    name: 'Tactical Awareness',
    description: 'You can direct one ally per rank as a 1 action point, granting them +1d4 damage on their next attack.',
    icon: 'ability_warrior_commandingshout',
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: 'savage_instincts_t1_combat_instincts',
  },
  {
    id: 'savage_instincts_t3_leadership_presence',
    name: 'Leadership Presence',
    description: 'Allies within 30 ft gain +1 to morale saves per rank.',
    icon: 'spell_holy_prayerofspirit',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'savage_instincts_t2_tactical_awareness',
  },
  {
    id: 'savage_instincts_t2_terrain_mastery',
    name: 'Terrain Mastery',
    description: 'You gain +2 to attack rolls in natural terrain per rank.',
    icon: 'spell_nature_earthquake',
    maxRanks: 3,
    position: { x: 2, y: 4 },
    requires: 'savage_instincts_t1_survival_instincts',
  },
  {
    id: 'savage_instincts_t3_environmental_adaptation',
    name: 'Environmental Adaptation',
    description: 'You are resistant to environmental damage (cold, heat, etc.) per rank.',
    icon: 'spell_nature_naturetouchgrow',
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: 'savage_instincts_t2_terrain_mastery',
  },

  // Root Convergence - Organic Apex
  {
    id: 'savage_instincts_t4_primal_avatar',
    name: 'Primal Avatar',
    description: 'You can transform into a primal avatar for 1 minute. Gain +2 to all rolls and +10 temp HP.',
    icon: 'ability_druid_primalprecision',
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: ['savage_instincts_t3_blood_scent', 'savage_instincts_t3_animal_kinship'],
    requiresAll: false,
  },
  {
    id: 'savage_instincts_t4_battle_hardened',
    name: 'Battle Hardened',
    description: 'You cannot be surprised and have advantage on saves against being frightened.',
    icon: 'ability_warrior_defensivestance',
    maxRanks: 2,
    position: { x: 3, y: 5 },
    requires: ['savage_instincts_t3_combat_mastery', 'savage_instincts_t3_leadership_presence'],
    requiresAll: false,
  },

  // Ultimate Growth - Root Network Completion
  {
    id: 'savage_instincts_t5_primal_force',
    name: 'Primal Force',
    description: 'Your primal abilities affect a 30 ft radius per rank.',
    icon: 'spell_nature_naturetouchgrow',
    maxRanks: 3,
    position: { x: 2, y: 5 },
    requires: ['savage_instincts_t3_environmental_adaptation', 'savage_instincts_t3_peak_conditioning'],
    requiresAll: false,
  },

  // Coming Soon Placeholder
  {
    id: 'savage_instincts_t6_coming_soon',
    name: 'Coming Soon',
    description: 'This talent tree is under development.',
    icon: 'inv_misc_questionmark',
    maxRanks: 1,
    position: { x: 1.5, y: 3 },
    requires: null,
  }
];
