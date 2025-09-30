/**
 * Talent Tree Data Structure
 * 
 * Defines talent trees for all classes with WoW-inspired layout
 * Each talent has flexible positioning and can have multiple prerequisites
 */

// Talent positioning uses a coordinate system where:
// - x: horizontal position (0-3, representing columns)
// - y: vertical position (0-6, representing tiers/rows)
// - Arrows are automatically drawn between talents and their prerequisites

/**
 * Talent Node Structure:
 * {
 *   id: string - unique identifier
 *   name: string - display name
 *   description: string - tooltip description
 *   icon: string - WoW icon name
 *   maxRanks: number - how many points can be invested
 *   position: { x: number, y: number } - grid position
 *   requires: string | string[] - prerequisite talent ID(s)
 *   requiresPoints: number - minimum points in tree to unlock
 *   requiresAll: boolean - if true, ALL prerequisites must be met (AND logic)
 * }
 */

// Helper function to create backdrop image URL for class/spec
export const getTreeBackdrop = (className, specId) => {
  // Map class and specialization to backdrop images
  const backdropMap = {
    'Pyrofiend': {
      'fire_mastery': 'url(/assets/backdrops/pyrofiend-fire.jpg)',
      'corruption_stages': 'url(/assets/backdrops/pyrofiend-corruption.jpg)',
      'demonic_power': 'url(/assets/backdrops/pyrofiend-demonic.jpg)'
    },
    'Minstrel': {
      'harmonic_weaving': 'url(/assets/backdrops/minstrel-harmonic.jpg)',
      'chord_combinations': 'url(/assets/backdrops/minstrel-chord.jpg)',
      'musical_magic': 'url(/assets/backdrops/minstrel-musical.jpg)'
    },
    'Chronarch': {
      'temporal_control': 'url(/assets/backdrops/chronarch-temporal.jpg)',
      'time_manipulation': 'url(/assets/backdrops/chronarch-time.jpg)',
      'chronos_energy': 'url(/assets/backdrops/chronarch-chronos.jpg)'
    },
    'Chaos Weaver': {
      'reality_bending': 'url(/assets/backdrops/chaos-reality.jpg)',
      'entropy_mastery': 'url(/assets/backdrops/chaos-entropy.jpg)',
      'chaos_control': 'url(/assets/backdrops/chaos-control.jpg)'
    },
    // Add more classes as needed
  };

  // Return backdrop or fallback gradient
  return backdropMap[className]?.[specId] || null;
};

// Fallback gradient backgrounds for each tree index
export const getFallbackBackground = (treeIndex) => {
  const backgrounds = [
    'linear-gradient(135deg, rgba(139, 69, 19, 0.15) 0%, rgba(101, 67, 33, 0.25) 50%, rgba(139, 69, 19, 0.15) 100%)',
    'linear-gradient(135deg, rgba(70, 130, 180, 0.15) 0%, rgba(100, 149, 237, 0.25) 50%, rgba(70, 130, 180, 0.15) 100%)',
    'linear-gradient(135deg, rgba(220, 20, 60, 0.15) 0%, rgba(178, 34, 34, 0.25) 50%, rgba(220, 20, 60, 0.15) 100%)'
  ];
  return backgrounds[treeIndex % 3];
};

// Sample talent tree for Pyrofiend - Fire Mastery
export const PYROFIEND_FIRE_MASTERY = [
  // Tier 0 - Foundation talents (no prerequisites)
  {
    id: 'fire_t0_ignite',
    name: 'Improved Ignite',
    description: 'When you cast a fire spell, draw a card. If it\'s a Heart or Diamond, ignite the target for 1d4 fire damage per rank over 6 seconds.',
    icon: 'spell_fire_flamebolt',
    maxRanks: 3,
    position: { x: 0, y: 0 },
    requires: null,
    requiresPoints: 0
  },
  {
    id: 'fire_t0_intensity',
    name: 'Fire Intensity',
    description: 'Add +1 fire damage per rank to all fire-based attacks.',
    icon: 'spell_fire_fireball02',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    requiresPoints: 0
  },
  {
    id: 'fire_t0_ember_shield',
    name: 'Ember Shield',
    description: 'When hit, flip a coin. On heads, gain a shield absorbing 1d6 damage per rank for 8 seconds.',
    icon: 'spell_fire_fire',
    maxRanks: 3,
    position: { x: 4, y: 0 },
    requires: null,
    requiresPoints: 0
  },

  // Tier 1 - Early choices
  {
    id: 'fire_t1_pyroblast',
    name: 'Pyroblast',
    description: 'Unlocks Pyroblast - roll 3d8 fire damage. Draw a card: if Ace, double the damage.',
    icon: 'spell_fire_fireball',
    maxRanks: 1,
    position: { x: 1, y: 1 },
    requires: 'fire_t0_ignite',
    requiresPoints: 3
  },
  {
    id: 'fire_t1_flame_surge',
    name: 'Flame Surge',
    description: 'Your fire spells deal +1d4 damage per rank. On a natural 20 attack roll, add another +2d6.',
    icon: 'spell_fire_incinerate',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'fire_t0_intensity',
    requiresPoints: 3
  },

  // Tier 2 - Branching paths
  {
    id: 'fire_t2_combustion',
    name: 'Combustion',
    description: 'When an ignite effect expires, flip a coin per rank. Each heads deals 1d6 fire damage.',
    icon: 'spell_fire_sealoffire',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'fire_t0_ignite',
    requiresPoints: 6
  },
  {
    id: 'fire_t2_inferno',
    name: 'Inferno',
    description: 'Unlocks Inferno - deals 3d8 fire damage to all enemies within 15 feet. Roll 1d20: on 18+, targets are stunned for 1 round.',
    icon: 'spell_fire_incinerate',
    maxRanks: 1,
    position: { x: 2, y: 2 },
    requires: 'fire_t1_pyroblast',
    requiresPoints: 6
  },
  {
    id: 'fire_t2_molten_armor',
    name: 'Molten Armor',
    description: 'When you take damage, draw a card. If it\'s a Spade, attackers take 1d8 fire damage per rank.',
    icon: 'spell_fire_sealoffire',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'fire_t0_ember_shield',
    requiresPoints: 6
  },

  // Tier 3 - Specialization choices
  {
    id: 'fire_t3_critical_mass',
    name: 'Critical Mass',
    description: 'Before each fire spell, draw a card. Face cards grant +2 to critical hit rolls per rank.',
    icon: 'spell_fire_moltenblood',
    maxRanks: 3,
    position: { x: 1, y: 3 },
    requires: 'fire_t2_combustion',
    requiresPoints: 9
  },
  {
    id: 'fire_t3_wildfire',
    name: 'Wildfire',
    description: 'Your AoE fire spells spread. For each enemy hit, flip a coin. On heads, spread to 1 additional nearby enemy for half damage.',
    icon: 'spell_fire_selfdestruct',
    maxRanks: 1,
    position: { x: 2, y: 3 },
    requires: 'fire_t2_inferno',
    requiresPoints: 9
  },
  {
    id: 'fire_t3_phoenix_heart',
    name: 'Phoenix Heart',
    description: 'When reduced to 0 HP, draw a card. If it\'s a red Ace, revive with 2d10 HP per rank. Once per day.',
    icon: 'spell_fire_fire',
    maxRanks: 2,
    position: { x: 3, y: 3 },
    requires: 'fire_t2_molten_armor',
    requiresPoints: 9
  },

  // Tier 4 - Advanced abilities
  {
    id: 'fire_t4_living_bomb',
    name: 'Living Bomb',
    description: 'Unlocks Living Bomb - attach a bomb dealing 2d6 fire damage over 12 seconds. On expiration, roll 1d6. On 5-6, explodes for 3d8 to nearby enemies.',
    icon: 'spell_fire_flamebolt',
    maxRanks: 1,
    position: { x: 0, y: 4 },
    requires: 'fire_t3_critical_mass',
    requiresPoints: 12
  },
  {
    id: 'fire_t4_hot_streak',
    name: 'Hot Streak',
    description: 'After two critical hits in a row, draw 2 cards. If both are red, your next fire spell deals triple damage dice.',
    icon: 'spell_fire_burnout',
    maxRanks: 1,
    position: { x: 1, y: 4 },
    requires: 'fire_t3_critical_mass',
    requiresPoints: 12
  },
  {
    id: 'fire_t4_firestorm',
    name: 'Firestorm',
    description: 'Unlocks Firestorm - rain fire in a 20ft radius. Roll 4d6 fire damage. For each 6 rolled, add +1d6.',
    icon: 'spell_fire_selfdestruct',
    maxRanks: 1,
    position: { x: 2, y: 4 },
    requires: 'fire_t3_wildfire',
    requiresPoints: 12
  },
  {
    id: 'fire_t4_dragons_breath',
    name: "Dragon's Breath",
    description: 'Unlocks Dragon\'s Breath - 30ft cone dealing 3d10 fire damage. Flip a coin per target: heads = disoriented for 2 rounds.',
    icon: 'spell_fire_twilightfireward',
    maxRanks: 1,
    position: { x: 3, y: 4 },
    requires: 'fire_t3_phoenix_heart',
    requiresPoints: 12
  },

  // Tier 5 - Elite talents
  {
    id: 'fire_t5_infernal_cascade',
    name: 'Infernal Cascade',
    description: 'When you take fire damage, draw a card. If it\'s a Club or Spade, reflect 2d8 fire damage per rank back to the attacker.',
    icon: 'spell_fire_flare',
    maxRanks: 2,
    position: { x: 0, y: 5 },
    requires: 'fire_t4_living_bomb',
    requiresPoints: 15
  },
  {
    id: 'fire_t5_pyromaniac',
    name: 'Pyromaniac',
    description: 'On critical fire spell hits, roll 1d20. On 15+, reduce all fire spell cooldowns by 1d4 seconds.',
    icon: 'spell_fire_meteorstorm',
    maxRanks: 1,
    position: { x: 1, y: 5 },
    requires: ['fire_t4_hot_streak', 'fire_t4_living_bomb'],
    requiresAll: false,
    requiresPoints: 15
  },
  {
    id: 'fire_t5_flame_on',
    name: 'Flame On',
    description: 'At the start of combat, shuffle a deck. Draw 3 cards: each red card reduces fire ability cooldowns by 3 seconds.',
    icon: 'spell_fire_twilightflamebreath',
    maxRanks: 1,
    position: { x: 3, y: 5 },
    requires: 'fire_t4_dragons_breath',
    requiresPoints: 15
  },

  // Tier 6 - Ultimate capstone
  {
    id: 'fire_t6_combustion_mastery',
    name: 'Combustion Mastery',
    description: 'Unlocks Combustion - consume all burning effects on target. Deal 2d12 per effect consumed. Draw a card: if it\'s a King or Queen, stun target for 1 round.',
    icon: 'spell_fire_soulburn',
    maxRanks: 1,
    position: { x: 1.5, y: 6 },
    requires: ['fire_t5_pyromaniac', 'fire_t5_infernal_cascade'],
    requiresAll: false,
    requiresPoints: 18
  },
  {
    id: 'fire_t6_phoenix_rebirth',
    name: 'Phoenix Rebirth',
    description: 'Unlocks Phoenix Form - transform for 30 seconds. All fire damage rolls twice, take higher result. On death during form, revive with full HP. Once per day.',
    icon: 'spell_fire_twilightflamebreath',
    maxRanks: 1,
    position: { x: 3, y: 6 },
    requires: 'fire_t5_flame_on',
    requiresPoints: 18
  }
];

// Sample talent tree for Minstrel - Harmonic Weaving
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
    requiresPoints: 0
  },
  {
    id: 'minstrel_t0_harmony',
    name: 'Harmonic Focus',
    description: 'Add +1d4 healing per rank to all musical healing abilities.',
    icon: 'spell_holy_silence',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
    requiresPoints: 0
  },
  {
    id: 'minstrel_t0_rhythm',
    name: 'Rhythmic Precision',
    description: 'Draw a card when casting. Number cards (2-10) extend song duration by that many seconds.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 2,
    position: { x: 4, y: 0 },
    requires: null,
    requiresPoints: 0
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
    requiresPoints: 3
  },
  {
    id: 'minstrel_t1_soothing_voice',
    name: 'Soothing Voice',
    description: 'Your healing songs restore +1d6 HP per rank. Draw a card: if it\'s a Heart, remove 1 debuff.',
    icon: 'spell_holy_prayerofhealing',
    maxRanks: 3,
    position: { x: 3, y: 1 },
    requires: 'minstrel_t0_harmony',
    requiresPoints: 3
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
    requiresPoints: 6
  },
  {
    id: 'minstrel_t2_battle_hymn',
    name: 'Battle Hymn',
    description: 'Unlocks Battle Hymn - allies within 30ft roll damage twice, take higher result. Flip a coin each round: tails ends the effect.',
    icon: 'spell_holy_divinehymn',
    maxRanks: 1,
    position: { x: 2, y: 2 },
    requires: 'minstrel_t1_crescendo',
    requiresPoints: 6
  },
  {
    id: 'minstrel_t2_tempo',
    name: 'Tempo Control',
    description: 'At start of combat, draw 3 cards. Each red card grants allies +2 initiative per rank.',
    icon: 'spell_nature_timestop',
    maxRanks: 3,
    position: { x: 4, y: 2 },
    requires: 'minstrel_t0_rhythm',
    requiresPoints: 6
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
    requiresPoints: 9
  },
  {
    id: 'minstrel_t3_inspiring_presence',
    name: 'Inspiring Presence',
    description: 'Allies within 20ft draw a card at start of their turn. Aces grant advantage on their next attack.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 1,
    position: { x: 2, y: 3 },
    requires: 'minstrel_t2_battle_hymn',
    requiresPoints: 9
  },
  {
    id: 'minstrel_t3_song_of_speed',
    name: 'Song of Speed',
    description: 'Unlocks Song of Speed - allies gain +10ft movement. Each round, flip a coin per ally: heads grants an extra action.',
    icon: 'spell_nature_timestop',
    maxRanks: 1,
    position: { x: 3, y: 3 },
    requires: 'minstrel_t2_tempo',
    requiresPoints: 9
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
    requiresPoints: 12
  },
  {
    id: 'minstrel_t4_healing_chorus',
    name: 'Healing Chorus',
    description: 'When you heal an ally, flip a coin. On heads, heal spreads to 1d4 nearby allies for half the amount.',
    icon: 'spell_holy_prayerofhealing',
    maxRanks: 1,
    position: { x: 1, y: 4 },
    requires: 'minstrel_t3_dissonance',
    requiresPoints: 12
  },
  {
    id: 'minstrel_t4_war_drums',
    name: 'War Drums',
    description: 'Unlocks War Drums - allies deal +1d8 damage per rank. Draw a card each round: red cards extend duration by 1 round.',
    icon: 'spell_holy_divinehymn',
    maxRanks: 2,
    position: { x: 2, y: 4 },
    requires: 'minstrel_t3_inspiring_presence',
    requiresPoints: 12
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
    requiresPoints: 15
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
    requiresPoints: 15
  },
  {
    id: 'minstrel_t5_cacophony',
    name: 'Cacophony',
    description: 'Unlocks Cacophony - 40ft radius of discordant sound. Enemies take 3d6 thunder damage and roll 1d20: on 12 or less, stunned for 1 round.',
    icon: 'spell_shadow_requiem',
    maxRanks: 1,
    position: { x: 2, y: 5 },
    requires: 'minstrel_t4_war_drums',
    requiresPoints: 15
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
    requiresPoints: 18
  }
];

// Placeholder talent trees for other specs (can be expanded later)
const PLACEHOLDER_TREE = [
  {
    id: 'placeholder_t1',
    name: 'Coming Soon',
    description: 'This talent tree is under development.',
    icon: 'inv_misc_questionmark',
    maxRanks: 1,
    position: { x: 1.5, y: 3 },
    requires: null,
    requiresPoints: 0
  }
];

// Export talent trees organized by class
export const TALENT_TREES = {
  'Pyrofiend': {
    'fire_mastery': PYROFIEND_FIRE_MASTERY,
    'corruption_stages': PLACEHOLDER_TREE,
    'demonic_power': PLACEHOLDER_TREE
  },
  'Minstrel': {
    'harmonic_weaving': MINSTREL_HARMONIC_WEAVING,
    'chord_combinations': PLACEHOLDER_TREE,
    'musical_magic': PLACEHOLDER_TREE
  },
  'Chronarch': {
    'temporal_control': PLACEHOLDER_TREE,
    'time_manipulation': PLACEHOLDER_TREE,
    'chronos_energy': PLACEHOLDER_TREE
  },
  'Chaos Weaver': {
    'reality_bending': PLACEHOLDER_TREE,
    'entropy_mastery': PLACEHOLDER_TREE,
    'chaos_control': PLACEHOLDER_TREE
  },
  'Gambler': {
    'luck_manipulation': PLACEHOLDER_TREE,
    'risk_management': PLACEHOLDER_TREE,
    'fate_control': PLACEHOLDER_TREE
  },
  'Rogue': {
    'assassination': PLACEHOLDER_TREE,
    'combat': PLACEHOLDER_TREE,
    'subtlety': PLACEHOLDER_TREE
  },
  'Warrior': {
    'arms': PLACEHOLDER_TREE,
    'fury': PLACEHOLDER_TREE,
    'protection': PLACEHOLDER_TREE
  },
  'Paladin': {
    'holy': PLACEHOLDER_TREE,
    'protection': PLACEHOLDER_TREE,
    'retribution': PLACEHOLDER_TREE
  },
  'Druid': {
    'balance': PLACEHOLDER_TREE,
    'feral': PLACEHOLDER_TREE,
    'restoration': PLACEHOLDER_TREE
  },
  'Shaman': {
    'elemental': PLACEHOLDER_TREE,
    'enhancement': PLACEHOLDER_TREE,
    'restoration': PLACEHOLDER_TREE
  }
};

// Helper function to get talents for a specific class and specialization
export const getTalentsForSpec = (className, specId) => {
  return TALENT_TREES[className]?.[specId] || PLACEHOLDER_TREE;
};

