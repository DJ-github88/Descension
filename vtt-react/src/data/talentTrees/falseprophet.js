// ============================================
// FALSE PROPHET TALENT TREES
// Each tree represents a style of preaching the void as divine truth.
// Talents interact with the Madness system (generation, spending,
// thresholds, and Convulsion) as well as the spec's core fantasy.
// ============================================

// VOIDCALLER - Fire-and-Brimstone Preaching
// Aggressive damage dealer. Talents amplify Madness generation
// and reward living at high Madness levels.
export const FALSE_PROPHET_VOIDCALLER = [
  // Tier 0 - The First Sermon
  {
    id: 'void_t0_void_seed',
    name: 'Opening Hymn',
    description: 'Your sermons begin with a taste of the void. Generate +1 Madness whenever you deal damage with a spell for the first time each turn. Once per day, unleash void tendrils dealing 2d8 necrotic damage per rank.',
    icon: 'spell_shadow_summonvoidwalker',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Building the Fervor
  {
    id: 'void_t1_shadow_tendrils',
    name: 'Congregation\'s Grasp',
    description: 'Your preaching snares the unbelievers. Creatures within 10ft have speed reduced by 10ft per rank. When you generate Madness, affected enemies take 1 psychic damage per Madness point generated.',
    icon: 'spell_shadow_blackplague',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'void_t0_void_seed',
  },
  {
    id: 'void_t1_void_whisper',
    name: 'Heretic\'s Whisper',
    description: 'Whisper void scripture that shatters sanity. One creature within 30ft takes 1d6 psychic damage per rank. Each time this damage kills a target, gain 1d4 Madness.',
    icon: 'spell_shadow_mindshear',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'void_t0_void_seed',
  },

  // Tier 2 - The Sermon Intensifies
  {
    id: 'void_t2_fervor',
    name: 'Blinding Fervor',
    description: 'Your conviction blinds you to danger. When you generate Madness and the roll is maximum (e.g., 4 on 1d4, 6 on 1d6), you generate double the amount. Gain resistance to psychic damage.',
    icon: 'spell_shadow_nethercloak',
    maxRanks: 2,
    position: { x: 0, y: 2 },
    requires: 'void_t1_shadow_tendrils',
  },
  {
    id: 'void_t2_void_eruption',
    name: 'Hellfire Passage',
    description: 'Quote the void god\'s wrath. 15ft radius deals 3d6 necrotic damage, half to allies. Generates +1d4 Madness when cast.',
    icon: 'spell_shadow_shadowfury',
    maxRanks: 3,
    position: { x: 2, y: 2 },
    requires: 'void_t1_shadow_tendrils',
  },
  {
    id: 'void_t2_emptiness',
    name: 'Embrace the Void',
    description: 'The void god rewards the faithful. While at 10+ Madness, gain resistance to necrotic damage. Your Madness damage bonus also applies to psychic damage.',
    icon: 'spell_shadow_twilight',
    maxRanks: 2,
    position: { x: 4, y: 2 },
    requires: 'void_t1_void_whisper',
  },

  // Tier 3 - Deep Conviction
  {
    id: 'void_t3_void_touch',
    name: 'Anointed Strike',
    description: 'Lay hands of the void upon the unbeliever. Next attack deals +2d6 necrotic damage per rank. If this attack drops a target below half HP, generate 1d6 Madness.',
    icon: 'spell_shadow_fingerofdeath',
    maxRanks: 4,
    position: { x: 1, y: 3 },
    requires: 'void_t2_void_eruption',
  },
  {
    id: 'void_t3_abyssal_resonance',
    name: 'Resonant Liturgy',
    description: 'Your sermons echo with void power. Your sermon spells deal +1d6 damage per rank. Sermon spells generate +1 Madness per rank when cast.',
    icon: 'spell_shadow_darkritual',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'void_t2_void_eruption',
  },

  // Tier 4 - The Zealot's Power
  {
    id: 'void_t4_void_nova',
    name: 'Apocalyptic Sermon',
    description: 'Deliver the final sermon. 30ft radius deals 4d6 necrotic damage. Damage increases by +1d6 for every 5 Madness you currently have.',
    icon: 'spell_shadow_shadesofdarkness',
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: 'void_t3_void_touch',
  },
  {
    id: 'void_t4_void_beacon',
    name: 'Beacon of the Void',
    description: 'Become a living altar to the void god. Summon a void acolyte that attacks enemies. While the acolyte lives, your Madness generation rolls gain +1.',
    icon: 'spell_shadow_summonvoidwalkers',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'void_t3_void_touch',
  },
  {
    id: 'void_t4_cosmic_void',
    name: 'Transcendent Conviction',
    description: 'At 15+ Madness, your spells ignore resistance to necrotic and psychic damage. Your Convulsion self-damage is halved.',
    icon: 'spell_shadow_demonicempathy',
    maxRanks: 1,
    position: { x: 4, y: 4 },
    requires: 'void_t3_abyssal_resonance',
  },

  // Tier 5 - Ultimate Sermon
  {
    id: 'void_t5_void_apocalypse',
    name: 'The Final Revelation',
    description: 'Preach the end of all things. 60ft radius becomes difficult terrain and deals 2d6 necrotic damage per turn. If cast while at 18+ Madness, the area also silences enemies for 1 round.',
    icon: 'spell_shadow_demonicempathy',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['void_t4_void_nova', 'void_t4_void_beacon', 'void_t4_cosmic_void'],
    requiresAll: true,
  }
];

// DECEIVER - Whispered Corruption
// Mind control and faith corruption specialist. Talents amplify
// manipulation, convert enemies, and weaponize Madness through control.
export const FALSE_PROPHET_DECEIVER = [
  // Tier 0 - The First Lie
  {
    id: 'dec_t0_false_visage',
    name: 'Baptism of Lies',
    description: 'Your words carry the weight of false divinity. Change your appearance and that of up to 2 allies per rank. When an enemy fails a save against your control spell, gain 1 Madness.',
    icon: 'spell_shadow_mindsteal',
    maxRanks: 3,
    position: { x: 2, y: 1 },
    requires: null,
  },

  // Tier 1 - Sowing Doubt
  {
    id: 'dec_t1_seed_of_doubt',
    name: 'Seed of Doubt',
    description: 'Plant doubt in the minds of the faithful. Enemies within 15ft have disadvantage on the first save against your spells each combat. Generates 1d4 Madness when activated.',
    icon: 'spell_shadow_unholyfrenzy',
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: 'dec_t0_false_visage',
  },
  {
    id: 'dec_t1_false_witness',
    name: 'False Witness',
    description: 'Conjure a false witness that testifies against your enemies. Creates a deceptive apparition that deals 2d6 psychic damage per rank to a single target and marks them. Marked targets have -2 to saves against your spells.',
    icon: 'spell_shadow_possession',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: 'dec_t0_false_visage',
  },
  {
    id: 'dec_t1_corrupting_aura',
    name: 'Aura of False Faith',
    description: 'Emit an aura of corrupted divinity. Enemies within 10ft cannot distinguish friend from foe while you have 6+ Madness.',
    icon: 'spell_shadow_charm',
    maxRanks: 2,
    position: { x: 3, y: 0 },
    requires: 'dec_t0_false_visage',
  },

  // Tier 2 - Turning the Faithful
  {
    id: 'dec_t2_false_prophecy',
    name: 'False Prophecy',
    description: 'Deliver a prophecy of the void god. Creatures believe your lies for 1 minute per rank. If you spend Madness to cast this spell, affected creatures also attack their nearest ally once.',
    icon: 'spell_shadow_mindtwisting',
    maxRanks: 4,
    position: { x: 0, y: 1 },
    requires: 'dec_t1_seed_of_doubt',
  },
  {
    id: 'dec_t2_mind_bend',
    name: 'Corrupting Whisper',
    description: 'Whisper the void god\'s truth into a target\'s mind. Charm or frighten creatures within 30ft. The duration increases by 1 round for every 3 Madness you currently have.',
    icon: 'spell_shadow_siphonmana',
    maxRanks: 2,
    position: { x: 4, y: 1 },
    requires: 'dec_t1_corrupting_aura',
  },

  // Tier 3 - Shattering Faith
  {
    id: 'dec_t3_turn_coat',
    name: 'Turn the Faithful',
    description: 'Turn an enemy\'s convictions against them. When you successfully charm or confuse an enemy, you may spend 1d6 Madness to make them attack their strongest ally with advantage on their next turn.',
    icon: 'spell_shadow_mindsteal',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'dec_t2_false_prophecy',
  },
  {
    id: 'dec_t3_heresy',
    name: 'Heresy',
    description: 'Declare an enemy a heretic in the void god\'s name. Target is marked for 3 rounds. Marked enemies take psychic damage equal to your current Madness whenever they attack you. Generates 1d6 Madness when cast.',
    icon: 'spell_shadow_unstableaffliction',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: 'dec_t2_false_prophecy',
  },
  {
    id: 'dec_t3_mass_doubt',
    name: 'Congregation of Doubt',
    description: 'Preach doubt to the masses. All enemies within 20ft must save or become confused for 2 rounds. Each enemy that fails generates 1 Madness for you.',
    icon: 'spell_shadow_armorofthedark',
    maxRanks: 2,
    position: { x: 3, y: 2 },
    requires: 'dec_t2_mind_bend',
  },

  // Tier 4 - Master Manipulator
  {
    id: 'dec_t4_reality_warp',
    name: 'Rewrite Truth',
    description: 'Warp what your enemies perceive as reality. Teleport creatures or objects within 60ft. Spending Madness on this spell allows you to reposition enemies into hazardous terrain. Costs 1d4 Madness per target moved.',
    icon: 'spell_shadow_teleport',
    maxRanks: 2,
    position: { x: 0, y: 3 },
    requires: 'dec_t3_turn_coat',
  },
  {
    id: 'dec_t4_ultimate_deception',
    name: 'The Grand Lie',
    description: 'Your deceptions become indistinguishable from truth. Enemies automatically fail their first save each combat against your control spells. If you have 12+ Madness, this also applies to their second save.',
    icon: 'spell_shadow_charm',
    maxRanks: 1,
    position: { x: 2, y: 3 },
    requires: 'dec_t3_heresy',
  },
  {
    id: 'dec_t4_storm_of_lies',
    name: 'Storm of Lies',
    description: 'Unleash a torrent of void scripture. 30ft radius filled with damaging whispers dealing 3d6 psychic damage per rank. Enemies damaged by this have disadvantage on saves against your next control spell. Generates 1d8 Madness.',
    icon: 'spell_shadow_rainoffire',
    maxRanks: 3,
    position: { x: 4, y: 3 },
    requires: 'dec_t3_mass_doubt',
  },

  // Tier 5 - Ultimate Deception
  {
    id: 'dec_t5_reality_shatter',
    name: 'Shatter the Faith',
    description: 'Destroy everything your enemies believe. Create a 60ft zone for 3 rounds where you control all perception. Enemies in the zone see allies as enemies and enemies as allies. Each round, enemies in the zone generate 1d4 Madness for you. Costs 2d6 Madness to cast.',
    icon: 'spell_shadow_mindflay',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: ['dec_t4_reality_warp', 'dec_t4_ultimate_deception', 'dec_t4_storm_of_lies'],
    requiresAll: true,
  }
];

// CULTIST - Dark Ritual & Ceremony
// Sustained DoT, curses, and ritual specialist. Talents improve
// Madness management, enhance rituals, and weaponize Convulsion.
export const FALSE_PROPHET_CULTIST = [
  // Tier 0 - The First Rite
  {
    id: 'cult_t0_dark_ritual',
    name: 'Profane Communion',
    description: 'Perform the void god\'s first rite. Sacrifice hit points to gain temporary hit points (2 per HP sacrificed). When you sacrifice HP this way, generate 1d4 Madness per rank.',
    icon: 'spell_shadow_summonimp',
    maxRanks: 5,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - The Ritual Circle
  {
    id: 'cult_t1_curse_of_agony',
    name: 'Curse of the Unbeliever',
    description: 'Curse enemies with the void god\'s torment. Target takes 1d6 necrotic damage per turn for 1 minute. For every 3 Madness you have, this curse also reduces the target\'s speed by 5ft.',
    icon: 'spell_shadow_curseofsargeras',
    maxRanks: 4,
    position: { x: 1, y: 1 },
    requires: 'cult_t0_dark_ritual',
  },
  {
    id: 'cult_t1_void_acolyte',
    name: 'Summon Void Acolyte',
    description: 'Summon a void acolyte to perform your rites. It has armor 13 and deals 1d6 necrotic damage. When the acolyte hits an enemy, you generate 1 Madness.',
    icon: 'spell_shadow_summonfelhunter',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'cult_t0_dark_ritual',
  },

  // Tier 2 - Expanding the Rites
  {
    id: 'cult_t2_blood_ritual',
    name: 'Blood Offering',
    description: 'Offer blood to the void god. Deal 2d6 necrotic damage to yourself, allies regain 3d6 HP. You generate 1d6 Madness and your next curse spell costs no mana.',
    icon: 'spell_shadow_lifedrain',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'cult_t1_curse_of_agony',
  },
  {
    id: 'cult_t2_demon_pact',
    name: 'Pact of the Void',
    description: 'Form a pact with the void god. Your summoned creatures gain +1 damage per 3 Madness you have. You may spend 1d4 Madness to refresh a summon\'s duration.',
    icon: 'spell_shadow_demonicpact',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: 'cult_t1_void_acolyte',
  },
  {
    id: 'cult_t2_forbidden_knowledge',
    name: 'Forbidden Scripture',
    description: 'Study the void god\'s hidden texts. Learn additional curse and ritual spells. Your spending spells are 15% more efficient per rank (round up fractions).',
    icon: 'spell_shadow_grimward',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'cult_t1_void_acolyte',
  },

  // Tier 3 - Deep Rituals
  {
    id: 'cult_t3_dark_empowerment',
    name: 'Ritual Empowerment',
    description: 'Your rituals draw power from your madness. +1d6 to spell damage per rank while at 10+ Madness. Spending Madness on spells heals you for 2 HP per point spent plus your proficiency bonus.',
    icon: 'spell_shadow_shadowembrace',
    maxRanks: 4,
    position: { x: 1, y: 3 },
    requires: 'cult_t2_blood_ritual',
  },
  {
    id: 'cult_t3_mass_summoning',
    name: 'Congregation of the Void',
    description: 'Summon a congregation of void entities. Create 1d4 additional void acolytes per rank. Each acolyte that dies generates 1d4 Madness for you.',
    icon: 'spell_shadow_summonvoidwalkers',
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: 'cult_t2_demon_pact',
  },

  // Tier 4 - Ritual Mastery
  {
    id: 'cult_t4_cult_mastery',
    name: 'Shepherd of the Void',
    description: 'Master the art of leading the void god\'s flock. Summoned creatures have +2 armor and damage per rank. Your Curse of the Unbeliever spreads to 1 additional target per rank when the original target dies.',
    icon: 'spell_shadow_antimagicshell',
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: 'cult_t3_mass_summoning',
  },
  {
    id: 'cult_t4_eldritch_power',
    name: 'Channel the Void God',
    description: 'Become a direct conduit for the void god\'s power. Your spells ignore spell resistance. When you trigger Insanity Convulsion, you may choose the result instead of rolling.',
    icon: 'spell_shadow_darkritual',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: 'cult_t3_dark_empowerment',
  },
  {
    id: 'cult_t4_abyssal_summoning',
    name: 'Void Priest',
    description: 'Summon a powerful void priest to preach alongside you. It casts curses autonomously and generates 1d6 Madness for you each round it survives.',
    icon: 'spell_shadow_summoninfernal',
    maxRanks: 2,
    position: { x: 4, y: 4 },
    requires: 'cult_t3_dark_empowerment',
  },

  // Tier 5 - Ultimate Ritual
  {
    id: 'cult_t5_demon_lord_invocation',
    name: 'Invocation of the Void God',
    description: 'Perform the ultimate rite. Summon an avatar of the void god for 3 rounds. It deals 4d6 necrotic damage per turn to all enemies within 30ft. While active, your Madness does not reset from Convulsion—instead, you retain half your current Madness (rounded down). Costs 1d8 Madness to cast.',
    icon: 'spell_shadow_summonfelguard',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['cult_t4_cult_mastery', 'cult_t4_eldritch_power', 'cult_t4_abyssal_summoning'],
    requiresAll: true,
  }
];
