// ============================================
// MINSTREL TALENT TREES
// ============================================

export const MINSTREL_HARMONIC_WEAVING = [
  // Tier 0 - Foundation
  {
    id: 'minstrel_t0_melody',
    name: 'Melodic Resonance',
    description: 'When you play a song, flip a coin per rank. Each heads grants allies +1 to attack rolls for 10 seconds.',
    icon: 'spell_holy_divinehymn',
    maxRanks: 3,
    position: { x: 0, y: 0 },
    requires: null,
  },
  {
    id: 'minstrel_t0_harmony',
    name: 'Harmonic Focus',
    description: 'Add +1d4 healing per rank to all musical healing abilities.',
    icon: 'spell_holy_silence',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },
  {
    id: 'minstrel_t0_rhythm',
    name: 'Rhythmic Precision',
    description: 'Draw a card when casting. Number cards (2-10) extend song duration by that many seconds.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
  },

  // Tier 1 - Early abilities
  {
    id: 'minstrel_t1_crescendo',
    name: 'Crescendo',
    description: 'Unlocks Crescendo - builds power over 3 rounds. Each round, flip a coin. On 3 heads, burst heal for 4d8 to all allies within 20ft.',
    icon: 'spell_holy_powerwordbarrier',
    maxRanks: 1,
    position: { x: 1, y: 1 },
    requires: 'minstrel_t0_melody',
  },
  {
    id: 'minstrel_t1_soothing_voice',
    name: 'Soothing Voice',
    description: 'Your healing songs restore +1d6 HP per rank. Draw a card: if it\'s a Heart, remove 1 debuff.',
    icon: 'spell_holy_prayerofhealing',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'minstrel_t0_harmony',
  },

  // Tier 2 - Branching paths
  {
    id: 'minstrel_t2_chord',
    name: 'Perfect Chord',
    description: 'When you heal, draw a card. Face cards trigger a bonus heal of 1d6 per rank.',
    icon: 'spell_holy_prayerofhealing',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'minstrel_t0_melody',
  },
  {
    id: 'minstrel_t2_battle_hymn',
    name: 'Battle Hymn',
    description: 'Unlocks Battle Hymn - allies within 30ft roll damage twice, take higher result. Flip a coin each round: tails ends the effect.',
    icon: 'spell_holy_divinehymn',
    maxRanks: 1,
    position: { x: 2, y: 2 },
    requires: 'minstrel_t1_crescendo',
  },
  {
    id: 'minstrel_t2_tempo',
    name: 'Tempo Control',
    description: 'At start of combat, draw 3 cards. Each red card grants allies +2 initiative per rank.',
    icon: 'spell_nature_timestop',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'minstrel_t0_rhythm',
  },

  // Tier 3 - Specialization
  {
    id: 'minstrel_t3_dissonance',
    name: 'Dissonant Strike',
    description: 'Unlocks Dissonant Strike - deals 2d6 thunder damage. Draw a card: Spades stun for 1 round, Clubs deafen for 2 rounds.',
    icon: 'spell_holy_powerwordbarrier',
    maxRanks: 1,
    position: { x: 0, y: 3 },
    requires: 'minstrel_t2_chord',
  },
  {
    id: 'minstrel_t3_inspiring_presence',
    name: 'Inspiring Presence',
    description: 'Allies within 20ft draw a card at start of their turn. Aces grant advantage on their next attack.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 1,
    position: { x: 2, y: 3 },
    requires: 'minstrel_t2_battle_hymn',
  },
  {
    id: 'minstrel_t3_song_of_speed',
    name: 'Song of Speed',
    description: 'Unlocks Song of Speed - allies gain +10ft movement. Each round, flip a coin per ally: heads grants an extra action.',
    icon: 'spell_nature_timestop',
    maxRanks: 1,
    position: { x: 3, y: 3 },
    requires: 'minstrel_t2_tempo',
  },

  // Tier 4 - Advanced abilities
  {
    id: 'minstrel_t4_requiem',
    name: 'Requiem',
    description: 'Unlocks Requiem - enemies within 30ft take 2d8 psychic damage. Roll 1d20 per enemy: on 16+, they\'re frightened for 2 rounds.',
    icon: 'spell_shadow_requiem',
    maxRanks: 1,
    position: { x: 0, y: 4 },
    requires: 'minstrel_t3_dissonance',
  },
  {
    id: 'minstrel_t4_healing_chorus',
    name: 'Healing Chorus',
    description: 'When you heal an ally, flip a coin. On heads, heal spreads to 1d4 nearby allies for half the amount.',
    icon: 'spell_holy_prayerofhealing',
    maxRanks: 1,
    position: { x: 1, y: 4 },
    requires: 'minstrel_t3_dissonance',
  },
  {
    id: 'minstrel_t4_war_drums',
    name: 'War Drums',
    description: 'Unlocks War Drums - allies deal +1d8 damage per rank. Draw a card each round: red cards extend duration by 1 round.',
    icon: 'spell_holy_divinehymn',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'minstrel_t3_inspiring_presence',
  },

  // Tier 5 - Elite talents
  {
    id: 'minstrel_t5_death_defying',
    name: 'Death-Defying Aria',
    description: 'When an ally drops to 0 HP, draw a card. If it\'s an Ace, they revive with 3d10 HP. Once per ally per day.',
    icon: 'spell_holy_resurrection',
    maxRanks: 1,
    position: { x: 0, y: 5 },
    requires: 'minstrel_t4_requiem',
  },
  {
    id: 'minstrel_t5_symphony',
    name: 'Grand Symphony',
    description: 'Unlocks Grand Symphony - heals all allies within 30ft for 3d8 + Charisma modifier. Draw 3 cards: each Heart adds +1d6 healing.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: ['minstrel_t4_healing_chorus', 'minstrel_t4_war_drums'],
    requiresAll: false,
  },
  {
    id: 'minstrel_t5_cacophony',
    name: 'Cacophony',
    description: 'Unlocks Cacophony - 40ft radius of discordant sound. Enemies take 3d6 thunder damage and roll 1d20: on 12 or less, stunned for 1 round.',
    icon: 'spell_shadow_requiem',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: 'minstrel_t4_war_drums',
  },

  // Tier 6 - Ultimate capstone
  {
    id: 'minstrel_t6_maestro',
    name: 'Maestro',
    description: 'Unlocks Maestro Mode - for 1 minute, all your songs affect double the radius. Draw a card at start of each turn: red cards let you cast 2 songs that turn.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 1,
    position: { x: 1, y: 6 },
    requires: ['minstrel_t5_symphony', 'minstrel_t5_death_defying'],
    requiresAll: false,
  }
];

// Chord Combinations Specialization - Complex musical harmonies and counterpoint (Structured linear progression)
export const MINSTREL_CHORD_COMBINATIONS = [
  // Tier 0 - Foundation (Central harmony focus)
  {
    id: 'chord_t0_harmonic_awareness',
    name: 'Harmonic Awareness',
    description: 'When you play multiple songs simultaneously, gain +1d4 bonus to all effects per additional song per rank.',
    icon: 'spell_holy_powerwordbarrier',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },
  {
    id: 'chord_t0_counterpoint',
    name: 'Counterpoint',
    description: 'Your songs can now overlap. Each overlapping song grants +1d4 to all effects per rank.',
    icon: 'spell_holy_divinehymn',
    maxRanks: 4,
    position: { x: 1, y: 0 },
    requires: null,
  },
  {
    id: 'chord_t0_resonance',
    name: 'Resonant Frequency',
    description: 'Draw a card when casting. If the card matches a suit you have in play, double the song\'s effect.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 3, y: 0 },
    requires: null,
  },

  // Tier 1 - Early harmony (Central progression)
  {
    id: 'chord_t1_dual_melody',
    name: 'Dual Melody',
    description: 'Unlocks Dual Melody - play two songs at once. Draw a card: red cards make both songs last 2x longer.',
    icon: 'spell_holy_prayerofhealing',
    maxRanks: 3,
    position: { x: 0, y: 1 },
    requires: 'chord_t0_counterpoint',
  },
  {
    id: 'chord_t1_harmonic_shield',
    name: 'Harmonic Shield',
    description: 'Allies within 20ft gain +1 armor per active song per rank. Maximum +3 armor.',
    icon: 'spell_holy_powerwordbarrier',
    maxRanks: 3,
    position: { x: 2, y: 1 },
    requires: 'chord_t0_harmonic_awareness',
  },
  {
    id: 'chord_t1_symphonic_echo',
    name: 'Symphonic Echo',
    description: 'When a song ends, roll 1d20. On 16+ per rank, it echoes for half duration at half strength.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 4,
    position: { x: 4, y: 1 },
    requires: 'chord_t0_resonance',
  },

  // Tier 2 - Complex arrangements (Left branch expansion)
  {
    id: 'chord_t2_triple_counterpoint',
    name: 'Triple Counterpoint',
    description: 'Unlocks Triple Counterpoint - play three songs simultaneously. Each song beyond the first costs half action.',
    icon: 'spell_holy_divinehymn',
    maxRanks: 2,
    position: { x: 0, y: 2 },
    requires: 'chord_t1_dual_melody',
  },
  {
    id: 'chord_t2_dissonant_wave',
    name: 'Dissonant Wave',
    description: 'Unlocks Dissonant Wave - 30ft cone deals 2d6 thunder damage. Draw a card per enemy hit: Clubs deafen for 1 round.',
    icon: 'spell_shadow_requiem',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'chord_t1_harmonic_shield',
  },
  {
    id: 'chord_t2_harmonic_cascade',
    name: 'Harmonic Cascade',
    description: 'When you cast a song, flip a coin. On heads, trigger a cascade: each ally heals an adjacent ally for 1d6 per rank.',
    icon: 'spell_holy_prayerofhealing',
    maxRanks: 3,
    position: { x: 3, y: 2 },
    requires: 'chord_t1_symphonic_echo',
  },

  // Tier 3 - Advanced compositions (Further branching)
  {
    id: 'chord_t3_polychord',
    name: 'Polychord Mastery',
    description: 'Your songs can now affect multiple targets per rank. Draw cards equal to targets: red cards double damage/healing.',
    icon: 'spell_holy_powerwordbarrier',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'chord_t2_dissonant_wave',
  },
  {
    id: 'chord_t3_symphonic_defense',
    name: 'Symphonic Defense',
    description: 'Enemies attacking your allies must roll 1d20. On 10 or less per rank, they take 1d8 thunder damage from dissonance.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 4,
    position: { x: 2, y: 3 },
    requires: 'chord_t2_dissonant_wave',
  },
  {
    id: 'chord_t3_arpeggio',
    name: 'Arpeggio Storm',
    description: 'Unlocks Arpeggio Storm - rapid-fire notes deal 1d6 thunder damage per rank to enemies in 20ft. Hits 1d4 times.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'chord_t2_harmonic_cascade',
  },

  // Tier 4 - Master compositions (Converging paths)
  {
    id: 'chord_t4_concerto',
    name: 'Grand Concerto',
    description: 'Unlocks Grand Concerto - conduct a symphony affecting all allies. +2 to all rolls, +1d8 damage/healing per rank for 3 rounds.',
    icon: 'spell_holy_divinehymn',
    maxRanks: 3,
    position: { x: 1, y: 4 },
    requires: 'chord_t3_polychord',
  },
  {
    id: 'chord_t4_harmonic_warden',
    name: 'Harmonic Warden',
    description: 'Allies within 30ft have advantage on saves vs. effects that would silence or deafen them.',
    icon: 'spell_holy_powerwordbarrier',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'chord_t3_symphonic_defense',
  },
  {
    id: 'chord_t4_crescendo_climax',
    name: 'Crescendo Climax',
    description: 'Once per combat, when all your songs are active, unleash Crescendo Climax: 40ft radius burst deals 4d8 thunder damage to enemies, heals allies for 4d8.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 2,
    position: { x: 3, y: 4 },
    requires: 'chord_t3_arpeggio',
  },

  // Tier 5 - Virtuoso level (Final convergence)
  {
    id: 'chord_t5_orchestral_mastery',
    name: 'Orchestral Mastery',
    description: 'You can now conduct up to 5 songs simultaneously. Each song beyond 3 grants +1d6 to all effects.',
    icon: 'spell_holy_divinehymn',
    maxRanks: 2,
    position: { x: 1, y: 5 },
    requires: 'chord_t4_concerto',
  },
  {
    id: 'chord_t5_symphonic_barrier',
    name: 'Symphonic Barrier',
    description: 'Create a 50ft barrier of harmonic energy. Enemies take 2d8 thunder damage per rank when crossing. Allies gain +2 armor while inside.',
    icon: 'spell_holy_powerwordbarrier',
    maxRanks: 3,
    position: { x: 2, y: 5 },
    requires: 'chord_t4_harmonic_warden',
  },
  {
    id: 'chord_t5_cacophonous_ending',
    name: 'Cacophonous Ending',
    description: 'When you end all songs simultaneously, create a shockwave. Enemies in 40ft take 3d8 thunder damage, allies are healed for 3d8.',
    icon: 'spell_shadow_requiem',
    maxRanks: 3,
    position: { x: 3, y: 5 },
    requires: 'chord_t4_crescendo_climax',
  },

  // Tier 6 - Ultimate symphony (Central convergence)
  {
    id: 'chord_t6_symphony_of_creation',
    name: 'Symphony of Creation',
    description: 'Unlocks Symphony of Creation - weave reality itself. For 1 minute, you can cast any spell as a song. Draw 3 cards per cast: red cards make it free.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['chord_t5_orchestral_mastery', 'chord_t5_symphonic_barrier', 'chord_t5_cacophonous_ending'],
    requiresAll: true,
  }
];

// Musical Magic Specialization - Arcane melodies and spell-infused music (Chaotic scattered layout)
export const MINSTREL_MUSICAL_MAGIC = [
  // Tier 0 - Magical foundations (Scattered magical seeds)
  {
    id: 'magic_t0_arcane_melody',
    name: 'Arcane Melody',
    description: 'Your songs can now carry spells. When you cast a spell as part of a song, it costs 1 less spell slot per rank.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 1, y: 0 },
    requires: null,
  },
  {
    id: 'magic_t0_enchanted_instrument',
    name: 'Enchanted Instrument',
    description: 'Your instrument becomes magical. It grants +1d4 to spell attack rolls and spell DCs per rank.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 3, y: 0 },
    requires: null,
  },
  {
    id: 'magic_t0_spell_harmony',
    name: 'Spell Harmony',
    description: 'Draw a card when casting a spell through music. Number cards (matching spell level) double the spell\'s effect.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 2,
    position: { x: 2, y: 1 },
    requires: null,
  },

  // Tier 1 - Basic spell weaving (Diagonal spread)
  {
    id: 'magic_t1_spell_song',
    name: 'Spell Song',
    description: 'Unlocks Spell Song - infuse a spell into your music. The spell affects all allies within 30ft. Draw a card: red cards affect enemies instead.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 0, y: 1 },
    requires: 'magic_t0_arcane_melody',
  },
  {
    id: 'magic_t1_melodic_barrier',
    name: 'Melodic Barrier',
    description: 'Create a 20ft barrier of magical music. Spells cast through it gain +1d6 damage/healing per rank.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 4,
    position: { x: 4, y: 1 },
    requires: 'magic_t0_enchanted_instrument',
  },
  {
    id: 'magic_t1_illusionary_harmony',
    name: 'Illusionary Harmony',
    description: 'Your songs can create illusions. Draw a card when casting: face cards create perfect illusions that last 1 minute per rank.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'magic_t0_spell_harmony',
  },

  // Tier 2 - Complex enchantments (Branching chaos)
  {
    id: 'magic_t2_dual_spellcasting',
    name: 'Dual Spellcasting',
    description: 'Unlocks Dual Spellcasting - cast two spells as one song. Roll 1d20: on 15+ per rank, both spells trigger twice.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 3, y: 2 },
    requires: 'magic_t1_melodic_barrier',
  },
  {
    id: 'magic_t2_enchanted_aura',
    name: 'Enchanted Aura',
    description: 'Allies within 25ft gain +1 to spell saves per rank. When you cast spells, roll 1d20. On 16+ per rank, the spell does not expend its slot.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 4,
    position: { x: 0, y: 2 },
    requires: 'magic_t1_spell_song',
  },
  {
    id: 'magic_t2_sonic_bolt',
    name: 'Sonic Bolt',
    description: 'Unlocks Sonic Bolt - fire a bolt of magical sound for 3d6 force damage. Draw a card: Clubs knock prone, Spades deafen.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 2, y: 3 },
    requires: 'magic_t1_illusionary_harmony',
  },

  // Tier 3 - Masterful spellweaving (Irregular expansion)
  {
    id: 'magic_t3_spell_symphony',
    name: 'Spell Symphony',
    description: 'Unlocks Spell Symphony - conduct multiple spells simultaneously. Each spell costs half a slot, but you take 1d6 psychic damage per spell.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'magic_t2_dual_spellcasting',
  },
  {
    id: 'magic_t3_arcane_resonance',
    name: 'Arcane Resonance',
    description: 'When you cast a spell, create a resonance field. The next spell cast in 10 seconds costs 1 less slot per rank.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'magic_t2_enchanted_aura',
  },
  {
    id: 'magic_t3_harmonic_illusions',
    name: 'Harmonic Illusions',
    description: 'Your illusions can now be interactive. Draw 2 cards when creating illusions: pairs create illusions that can cast spells.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: 'magic_t2_sonic_bolt',
  },

  // Tier 4 - Legendary enchantments (Chaotic convergence)
  {
    id: 'magic_t4_concerto_of_power',
    name: 'Concerto of Power',
    description: 'Unlocks Concerto of Power - amplify all spells within 50ft. Spells deal +2d6 damage per rank and have advantage on saves.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: 'magic_t3_arcane_resonance',
  },
  {
    id: 'magic_t4_mystic_shield',
    name: 'Mystic Shield',
    description: 'Create a shield of pure magic. Absorbs 4d6 damage per rank from the next attack. Regenerates after 1 minute.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 2, y: 5 },
    requires: 'magic_t3_spell_symphony',
  },
  {
    id: 'magic_t4_phantasmal_orchestra',
    name: 'Phantasmal Orchestra',
    description: 'Summon an orchestra of illusions. They can cast spells as 5th level casters. Draw a card each round: red cards make them real.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 4, y: 3 },
    requires: 'magic_t3_harmonic_illusions',
  },

  // Tier 5 - Archmage level (Wild convergence)
  {
    id: 'magic_t5_spell_storm',
    name: 'Spell Storm',
    description: 'Unlocks Spell Storm - unleash a storm of spells in 40ft radius. Deals 4d8 force damage per rank to enemies, heals allies for 4d8.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 1, y: 5 },
    requires: 'magic_t4_concerto_of_power',
  },
  {
    id: 'magic_t5_arcane_dominion',
    name: 'Arcane Dominion',
    description: 'You become immune to spell effects that would silence or counterspell you. When your spells face magic resistance, roll 1d20. On 11+ per rank, the resistance is ignored.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 2,
    position: { x: 3, y: 5 },
    requires: 'magic_t4_mystic_shield',
  },
  {
    id: 'magic_t5_reality_weaving',
    name: 'Reality Weaving',
    description: 'Your illusions can now alter reality. Draw 3 cards when casting illusions: three of a kind lets you reshape 10ft of reality.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 0, y: 6 },
    requires: 'magic_t4_phantasmal_orchestra',
  },

  // Tier 6 - Magical transcendence (Central chaotic blaze)
  {
    id: 'magic_t6_arcane_serenade',
    name: 'Arcane Serenade',
    description: 'Unlocks Arcane Serenade - play the music of creation itself. For 1 minute, you can cast any spell at will. Draw a card each cast: Aces make it legendary.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 1,
    position: { x: 2, y: 6 },
    requires: ['magic_t5_spell_storm', 'magic_t5_arcane_dominion', 'magic_t5_reality_weaving'],
    requiresAll: true,
  }
];
