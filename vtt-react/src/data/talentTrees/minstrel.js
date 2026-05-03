// ============================================
// MINSTREL TALENT TREES
// Rewritten to synergize with Musical Notes (I-VII) and Cadence system
// ============================================

// ============================================
// HARMONIC WEAVING — Soulsinger Path
// Focus: Healing notes, restorative cadences, protective melodies
// Key Notes: I (Tonic), III (Mediant), IV (Subdominant), VI (Submediant)
// Key Cadences: Authentic Cadence, Picardy Third, Plagal Cadence
// ============================================
export const MINSTREL_HARMONIC_WEAVING = [
  // Tier 0 - Foundation
  {
    id: 'minstrel_t0_tonic_resonance',
    name: 'Tonic Resonance',
    description: 'Your builder spells that generate Note I (Tonic) also generate +1 Note IV (Subdominant) per rank. The foundation of every healing melody.',
    icon: 'spell_holy_silence',
    maxRanks: 3,
    position: { x: 0, y: 0 },
    requires: null,
  },
  {
    id: 'minstrel_t0_restorative_chord',
    name: 'Restorative Chord',
    description: 'Your healing builder spells restore +1d4 HP per rank to the lowest-health ally within 30 feet when cast.',
    icon: 'spell_holy_prayerofhealing',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },
  {
    id: 'minstrel_t0_gentle_tempo',
    name: 'Gentle Tempo',
    description: 'Reduce the mana cost of your builder spells by 1 per rank. A calm performer plays longer.',
    icon: 'spell_holy_divinehymn',
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
  },

  // Tier 1 - Early healing
  {
    id: 'minstrel_t1_soothing_voice',
    name: 'Soothing Voice',
    description: 'When you generate Note III (Mediant), the nearest ally within 20 feet heals for 1d4 per rank. Emotion heals.',
    icon: 'spell_holy_powerwordbarrier',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'minstrel_t0_restorative_chord',
  },
  {
    id: 'minstrel_t1_submediant_shield',
    name: 'Submediant Shield',
    description: 'When you generate Note VI (Submediant), grant the nearest ally 1d4 temporary HP per rank. Melancholy becomes armor.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 2,
    position: { x: 3, y: 1 },
    requires: 'minstrel_t0_gentle_tempo',
  },

  // Tier 2 - Cadence enhancement
  {
    id: 'minstrel_t2_authentic_mastery',
    name: 'Authentic Mastery',
    description: 'Your Authentic Cadence heals for an additional 1d6 per rank. The grand finale resonates deeper.',
    icon: 'spell_holy_prayerofhealing',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'minstrel_t0_tonic_resonance',
  },
  {
    id: 'minstrel_t2_cadence_echo',
    name: 'Cadence Echo',
    description: 'When you resolve a 4-note cadence, retain 1 random note from the consumed set per rank. Nothing truly ends.',
    icon: 'spell_holy_divinehymn',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: 'minstrel_t1_soothing_voice',
  },
  {
    id: 'minstrel_t2_plagal_bounty',
    name: 'Plagal Bounty',
    description: 'Your Plagal Cadence grants affected allies +1d6 temporary HP per rank in addition to its speed bonus.',
    icon: 'spell_holy_powerwordbarrier',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'minstrel_t1_submediant_shield',
  },

  // Tier 3 - Core Soulsinger identity
  {
    id: 'minstrel_t3_healing_chorus',
    name: 'Healing Chorus',
    description: 'Unlocks Healing Chorus — resolve a cadence targeting all allies within 20 feet. Each ally is healed for 2d6 + your spirit modifier per rank. Consumes 3 notes of any type. Once per combat.',
    icon: 'spell_holy_prayerofhealing',
    maxRanks: 2,
    position: { x: 0, y: 3 },
    requires: 'minstrel_t2_authentic_mastery',
  },
  {
    id: 'minstrel_t3_picardy_enhancement',
    name: 'Picardy Enhancement',
    description: 'Your Picardy Third also removes 1 debuff per rank from all affected allies. Light purifies as it heals.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 2,
    position: { x: 2, y: 3 },
    requires: 'minstrel_t2_cadence_echo',
  },
  {
    id: 'minstrel_t3_lullaby_ward',
    name: 'Lullaby Ward',
    description: 'When you complete any healing cadence, all allies within 15 feet gain +2 to saving throws for 2 rounds per rank. Your melody shields the mind.',
    icon: 'spell_holy_silence',
    maxRanks: 2,
    position: { x: 4, y: 3 },
    requires: 'minstrel_t2_plagal_bounty',
  },

  // Tier 4 - Advanced mastery
  {
    id: 'minstrel_t4_tonic_overflow',
    name: 'Tonic Overflow',
    description: 'When you reach max stacks (5) of Note I, your next cadence resolves for 150% healing per rank. The tonic cannot be contained.',
    icon: 'spell_holy_powerwordbarrier',
    maxRanks: 2,
    position: { x: 0, y: 4 },
    requires: 'minstrel_t3_healing_chorus',
  },
  {
    id: 'minstrel_t4_renewing_resolution',
    name: 'Renewing Resolution',
    description: 'Your healing cadences also grant regeneration: 1d4 HP per round for 2 rounds per rank. The song lingers.',
    icon: 'spell_holy_prayerofhealing',
    maxRanks: 3,
    position: { x: 2, y: 4 },
    requires: 'minstrel_t3_picardy_enhancement',
  },

  // Tier 5 - Elite
  {
    id: 'minstrel_t5_death_defying_aria',
    name: 'Death-Defying Aria',
    description: 'Unlocks Death-Defying Aria — when an ally drops to 0 HP, you may immediately consume 5 notes of any type to revive them with 3d10 HP. Once per ally per day.',
    icon: 'spell_holy_resurrection',
    maxRanks: 1,
    position: { x: 0, y: 5 },
    requires: 'minstrel_t4_tonic_overflow',
  },
  {
    id: 'minstrel_t5_grand_symphony',
    name: 'Grand Symphony',
    description: 'Unlocks Grand Symphony — consume 7 notes of any type to heal all allies within 30 feet for 3d8 + spirit modifier per rank and grant +2 AC for 3 rounds. Once per combat.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 2,
    position: { x: 2, y: 5 },
    requires: 'minstrel_t4_renewing_resolution',
  },

  // Tier 6 - Capstone
  {
    id: 'minstrel_t6_maestro_of_mending',
    name: 'Maestro of Mending',
    description: 'For 1 minute, all your builder spells generate double notes, and your healing cadences affect double the radius. When you complete a cadence, generate 2 random notes. You become the instrument of restoration itself.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 1,
    position: { x: 1, y: 6 },
    requires: ['minstrel_t5_death_defying_aria', 'minstrel_t5_grand_symphony'],
    requiresAll: false,
  }
];

// ============================================
// CHORD COMBINATIONS — Battlechoir Path
// Focus: Multi-note generation, offensive cadences, damage amplification
// Key Notes: I (Tonic), IV (Subdominant), V (Dominant)
// Key Cadences: Perfect Cadence, Circle of Fifths, Phrygian Cadence, Neapolitan Sixth
// ============================================
export const MINSTREL_CHORD_COMBINATIONS = [
  // Tier 0 - Foundation
  {
    id: 'chord_t0_dominant_fury',
    name: 'Dominant Fury',
    description: 'Your builder spells that generate Note V (Dominant) also deal +1d4 damage per rank. The dominant demands violence.',
    icon: 'spell_holy_divinehymn',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },
  {
    id: 'chord_t0_power_chord',
    name: 'Power Chord',
    description: 'When you generate Note V, your next attack roll gains +1 per rank. Build tension, then strike.',
    icon: 'spell_holy_powerwordbarrier',
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
  },
  {
    id: 'chord_t0_battle_rhythm',
    name: 'Battle Rhythm',
    description: 'When you generate Note IV (Subdominant), grant all allies within 15 feet +1 to damage rolls per rank for 1 round. Forward motion empowers.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 3, y: 0 },
    requires: null,
  },

  // Tier 1 - Early offense
  {
    id: 'chord_t1_perfect_strike',
    name: 'Perfect Strike',
    description: 'When you resolve Perfect Cadence, the guaranteed critical hit also deals +1d8 bonus damage per rank. The perfect progression hits harder.',
    icon: 'spell_holy_divinehymn',
    maxRanks: 3,
    position: { x: 0, y: 1 },
    requires: 'chord_t0_power_chord',
  },
  {
    id: 'chord_t1_cadence_momentum',
    name: 'Cadence Momentum',
    description: 'After resolving any cadence, your next builder spell costs 2 less mana and generates +1 note per rank. The composition never stops.',
    icon: 'spell_holy_prayerofhealing',
    maxRanks: 2,
    position: { x: 2, y: 1 },
    requires: 'chord_t0_dominant_fury',
  },
  {
    id: 'chord_t1_war_cry',
    name: 'War Cry',
    description: 'Your offensive builder spells also grant +1 to ally attack rolls within 10 feet per rank for 1 round. Your music is a call to arms.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 3,
    position: { x: 4, y: 1 },
    requires: 'chord_t0_battle_rhythm',
  },

  // Tier 2 - Enhanced cadences
  {
    id: 'chord_t2_circle_mastery',
    name: 'Circle Mastery',
    description: 'Your Circle of Fifths deals +1d6 damage per rank per tick and lasts 1 additional round per rank. Eternal torment, indeed.',
    icon: 'spell_shadow_requiem',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'chord_t1_perfect_strike',
  },
  {
    id: 'chord_t2_double_time',
    name: 'Double Time',
    description: 'Once per combat, you may resolve two cadences in a single turn. The second cadence consumes 1 fewer note per rank. Speed is power.',
    icon: 'spell_holy_divinehymn',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: 'chord_t1_cadence_momentum',
  },
  {
    id: 'chord_t2_phrygian_fire',
    name: 'Phrygian Fire',
    description: 'Your Phrygian Cadence also deals 1d6 fire damage per rank to all enemies within 15 feet of affected allies. Ancient resolve burns.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'chord_t1_war_cry',
  },

  // Tier 3 - Core Battlechoir identity
  {
    id: 'chord_t3_neapolitan_precision',
    name: 'Neapolitan Precision',
    description: 'Your Neapolitan Sixth also grants +1d8 bonus damage on the next critical hit per rank. Precision compounds into devastation.',
    icon: 'spell_holy_powerwordbarrier',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'chord_t2_phrygian_fire',
  },
  {
    id: 'chord_t3_harmonic_cascade',
    name: 'Harmonic Cascade',
    description: 'When you resolve a 4-note cadence, all allies within 20 feet gain +1d4 to their next damage roll per rank. Resolved harmonics cascade outward.',
    icon: 'spell_holy_prayerofhealing',
    maxRanks: 3,
    position: { x: 2, y: 3 },
    requires: 'chord_t2_double_time',
  },
  {
    id: 'chord_t3_crit_resonance',
    name: 'Crit Resonance',
    description: 'When an ally scores a critical hit while affected by your cadence buff, you generate 2 random notes per rank. Your ally\'s triumph feeds your composition.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: 'chord_t2_circle_mastery',
  },

  // Tier 4 - Advanced warfare
  {
    id: 'chord_t4_dominant_supremacy',
    name: 'Dominant Supremacy',
    description: 'When you reach max stacks (5) of Note V, your next offensive cadence deals 150% damage per rank. The dominant cannot be denied.',
    icon: 'spell_holy_divinehymn',
    maxRanks: 2,
    position: { x: 1, y: 4 },
    requires: 'chord_t3_neapolitan_precision',
  },
  {
    id: 'chord_t4_war_drums',
    name: 'War Drums',
    description: 'Unlocks War Drums — consume 4 notes of any type to grant all allies within 30 feet +1d8 damage per rank on all attacks for 3 rounds. Once per combat.',
    icon: 'spell_holy_powerwordbarrier',
    maxRanks: 2,
    position: { x: 3, y: 4 },
    requires: 'chord_t3_crit_resonance',
  },

  // Tier 5 - Virtuoso
  {
    id: 'chord_t5_cacophonous_ending',
    name: 'Cacophonous Ending',
    description: 'Unlocks Cacophonous Ending — consume ALL remaining notes. Deal 1d8 thunder damage per note consumed in a 40-foot radius to enemies. Allies are healed for the same amount. The louder the ending, the greater the impact.',
    icon: 'spell_shadow_requiem',
    maxRanks: 2,
    position: { x: 1, y: 5 },
    requires: 'chord_t4_dominant_supremacy',
  },
  {
    id: 'chord_t5_orchestral_mastery',
    name: 'Orchestral Mastery',
    description: 'Your builder spells now generate +1 note of a random type per rank. Your compositions grow richer with every measure.',
    icon: 'spell_holy_divinehymn',
    maxRanks: 2,
    position: { x: 3, y: 5 },
    requires: 'chord_t4_war_drums',
  },

  // Tier 6 - Ultimate capstone
  {
    id: 'chord_t6_symphony_of_destruction',
    name: 'Symphony of Destruction',
    description: 'Unlocks Symphony of Destruction — consume 8 notes of any type to conduct a devastating symphony. All enemies in 50 feet take 4d8 + spirit modifier thunder damage and are deafened for 2 rounds. All allies in range gain +3 to attack rolls and +2d6 damage for 5 rounds. Once per long rest.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['chord_t5_cacophonous_ending', 'chord_t5_orchestral_mastery'],
    requiresAll: true,
  }
];

// ============================================
// MUSICAL MAGIC — Dissonance Path
// Focus: Disruptive notes, chaotic cadence effects, control synergy
// Key Notes: II (Supertonic), VI (Submediant), VII (Leading Tone)
// Key Cadences: Deceptive Cadence, Half Cadence, Tritone Substitution
// ============================================
export const MINSTREL_MUSICAL_MAGIC = [
  // Tier 0 - Foundation
  {
    id: 'magic_t0_dissonant_awareness',
    name: 'Dissonant Awareness',
    description: 'Your builder spells that generate Note VII (Leading Tone) also generate +1 Note II (Supertonic) per rank. Urgency breeds tension.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
  },
  {
    id: 'magic_t0_unsettling_vibration',
    name: 'Unsettling Vibration',
    description: 'When you generate Note II (Supertonic), enemies within 10 feet take 1d4 psychic damage per rank. Dissonance hurts.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 3, y: 0 },
    requires: null,
  },
  {
    id: 'magic_t0_echoing_tension',
    name: 'Echoing Tension',
    description: 'Your control-effect builder spells have their save DC increased by 1 per rank. The mind cannot resist the wrong note.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 2,
    position: { x: 2, y: 1 },
    requires: null,
  },

  // Tier 1 - Early disruption
  {
    id: 'magic_t1_deceptive_mastery',
    name: 'Deceptive Mastery',
    description: 'Your Deceptive Cadence stun duration increases by 1 round per rank. The trick lingers longer than expected.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 0, y: 1 },
    requires: 'magic_t0_dissonant_awareness',
  },
  {
    id: 'magic_t1_dissonant_spread',
    name: 'Dissonant Spread',
    description: 'When an enemy fails a save against your cadence, all enemies within 10 feet take 1d6 psychic damage per rank. Wrong notes echo.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 4, y: 1 },
    requires: 'magic_t0_unsettling_vibration',
  },

  // Tier 2 - Enhanced control cadences
  {
    id: 'magic_t2_half_cadence_fortification',
    name: 'Half Cadence Fortification',
    description: 'Your Half Cadence shield value increases by +1d6 per rank and lasts 1 additional round per rank. Incomplete resolution becomes strength.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'magic_t1_deceptive_mastery',
  },
  {
    id: 'magic_t2_tritone_amplification',
    name: 'Tritone Amplification',
    description: 'Your Tritone Substitution save DC increases by +2 per rank. Additionally, on a failed save, the target also becomes frightened for 1 round per rank.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 2,
    position: { x: 2, y: 2 },
    requires: 'magic_t1_dissonant_spread',
  },
  {
    id: 'magic_t2_chaos_resonance',
    name: 'Chaos Resonance',
    description: 'When you generate Note VII (Leading Tone), there is a 25% chance per rank to also generate +1 random note. Chaos breeds possibility.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'magic_t1_dissonant_spread',
  },

  // Tier 3 - Core Dissonance identity
  {
    id: 'magic_t3_cacophony',
    name: 'Cacophony',
    description: 'Unlocks Cacophony — consume 4 notes of any type to create a 30-foot radius of discordant sound. Enemies take 2d8 psychic damage and must make a Spirit save (DC 14 + rank) or be stunned for 1 round. Once per combat.',
    icon: 'spell_shadow_requiem',
    maxRanks: 2,
    position: { x: 1, y: 3 },
    requires: 'magic_t2_tritone_amplification',
  },
  {
    id: 'magic_t3_fear_frequency',
    name: 'Fear Frequency',
    description: 'When you resolve a control cadence, all enemies within 15 feet must make a Wisdom save (DC 13 + rank) or become frightened for 1 round. Terror propagates.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: 'magic_t2_chaos_resonance',
  },

  // Tier 4 - Advanced disruption
  {
    id: 'magic_t4_note Corruption',
    name: 'Note Corruption',
    description: 'When you generate Note VI (Submediant), the nearest enemy within 20 feet suffers -1 to their next saving throw per rank. Melancholy weakens resolve.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: 'magic_t3_cacophony',
  },
  {
    id: 'magic_t4_dissonant_echo',
    name: 'Dissonant Echo',
    description: 'When you resolve a control cadence, retain 2 random notes from the consumed set. The wrong note never truly dies.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'magic_t3_cacophony',
  },
  {
    id: 'magic_t4_reality_warping',
    name: 'Reality Warping',
    description: 'Your control cadences that target a single enemy now also affect 1 additional enemy within 15 feet per rank at half duration. Sound bends space.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 2,
    position: { x: 4, y: 4 },
    requires: 'magic_t3_fear_frequency',
  },

  // Tier 5 - Arch-dissonance
  {
    id: 'magic_t5_sonic_annihilation',
    name: 'Sonic Annihilation',
    description: 'Unlocks Sonic Annihilation — consume 6 notes of any type to unleash a shockwave in a 40-foot cone. Deals 3d8 thunder damage per rank and knocks all enemies prone. Deafened enemies take double damage.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 1, y: 5 },
    requires: 'magic_t4_note Corruption',
  },
  {
    id: 'magic_t5_void_melody',
    name: 'Void Melody',
    description: 'When you consume Note VII as part of a cadence, all enemies within 20 feet lose their reaction until the start of their next turn per rank. The leading tone silences.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 2,
    position: { x: 3, y: 5 },
    requires: 'magic_t4_reality_warping',
  },

  // Tier 6 - Ultimate dissonance
  {
    id: 'magic_t6_arcane_serenade',
    name: 'Arcane Serenade',
    description: 'Unlocks Arcane Serenade — consume ALL remaining notes. For each note consumed, all enemies in 50 feet take 1d6 psychic damage and are silenced for 1 round (Spirit save DC 18). For each note consumed, all allies in range heal 1d4 HP. The song between order and chaos reshapes reality. Once per long rest.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['magic_t5_sonic_annihilation', 'magic_t5_void_melody'],
    requiresAll: true,
  }
];
