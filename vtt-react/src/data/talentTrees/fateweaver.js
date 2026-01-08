// ============================================
// FATE WEAVER TALENT TREES
// ============================================

export const FATE_WEAVER_FORTUNE_TELLER = [
  // Tier 0 - Crystal nucleus (Center)
  {
    id: 'fortune_t0_crystal_gaze',
    name: 'Crystal Gaze',
    description: 'When you draw cards, roll 1d20. On 16+ per rank, gain advantage on your next initiative roll.',
    icon: 'spell_arcane_farsight',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - First hexagonal ring (6 points around center)
  {
    id: 'fortune_t1_future_sight',
    name: 'Future Sight',
    description: 'Unlocks Future Sight - draw 3 cards at combat start. Red cards grant +1d4 to attack rolls per rank.',
    icon: 'spell_holy_farsight',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'fortune_t0_crystal_gaze',
  },
  {
    id: 'fortune_t1_prophetic_dreams',
    name: 'Prophetic Dreams',
    description: 'At the start of each day, draw a card representing the day. Face cards prevent 1d6 damage per rank from traps.',
    icon: 'spell_shadow_mindtwisting',
    maxRanks: 2,
    position: { x: 3, y: 1 },
    requires: 'fortune_t0_crystal_gaze',
  },
  {
    id: 'fortune_t1_crystal_clarity',
    name: 'Crystal Clarity',
    description: 'Your crystal gaze reveals enemy weaknesses. +1d4 to attack rolls per rank against enemies you can see.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'fortune_t0_crystal_gaze',
  },
  {
    id: 'fortune_t1_fate_whispers',
    name: 'Fate Whispers',
    description: 'Hear whispers of fate. Once per round, ask the DM one yes/no question about immediate future events.',
    icon: 'spell_shadow_mindtwisting',
    maxRanks: 2,
    position: { x: 4, y: 2 },
    requires: 'fortune_t0_crystal_gaze',
  },

  // Tier 2 - Second hexagonal ring (expanding facets)
  {
    id: 'fortune_t2_prescient_strike',
    name: 'Prescient Strike',
    description: 'When an enemy attacks you, roll 1d20. On 15+ per rank, you can redirect their attack to another enemy.',
    icon: 'ability_hunter_snipershot',
    maxRanks: 4,
    position: { x: 1, y: 3 },
    requires: 'fortune_t1_future_sight',
  },
  {
    id: 'fortune_t2_ally_foresight',
    name: 'Ally Foresight',
    description: 'Allies within 30ft gain +1 to saves per rank. When they roll a 1 on a save, you can reroll it once per combat.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'fortune_t1_prophetic_dreams',
  },
  {
    id: 'fortune_t3_lucky_break',
    name: 'Lucky Break',
    description: 'When you take damage, draw a card. Aces reduce the damage by 2d6 per rank.',
    icon: 'spell_shadow_lifedrain',
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: 'fortune_t1_crystal_clarity',
  },
  {
    id: 'fortune_t2_crystal_reflection',
    name: 'Crystal Reflection',
    description: 'Crystal facets reflect magic. +1d6 to spell DCs per rank. Spells targeting you have 10% chance per rank to reflect.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 2, y: 4 },
    requires: 'fortune_t1_crystal_clarity',
  },
  {
    id: 'fortune_t2_fate_binding',
    name: 'Fate Binding',
    description: 'Bind enemy fate. Once per combat, force an enemy to reroll a successful attack or save and take the worse result.',
    icon: 'spell_shadow_possession',
    maxRanks: 2,
    position: { x: 4, y: 4 },
    requires: 'fortune_t1_fate_whispers',
  },

  // Tier 3 - Third ring (crystal complexity)
  {
    id: 'fortune_t3_crystal_shield',
    name: 'Crystal Shield',
    description: 'Create a shield of crystal energy. Absorbs 3d6 damage per rank. While active, you have advantage on perception checks.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 1, y: 5 },
    requires: 'fortune_t2_prescient_strike',
  },
  {
    id: 'fortune_t3_shared_vision',
    name: 'Shared Vision',
    description: 'Allies within 20ft can see through your crystal gaze. They gain +1d4 to perception checks per rank.',
    icon: 'spell_holy_searinglightpriest',
    maxRanks: 4,
    position: { x: 3, y: 5 },
    requires: 'fortune_t2_ally_foresight',
  },

  // Tier 4 - Fourth ring (outer facets)
  {
    id: 'fortune_t4_doom_divination',
    name: 'Doom Divination',
    description: 'When you first see an enemy, draw a card. Black cards reduce their damage by 1d6 per rank for the combat.',
    icon: 'spell_shadow_antishadow',
    maxRanks: 3,
    position: { x: 0, y: 6 },
    requires: 'fortune_t3_lucky_break',
  },
  {
    id: 'fortune_t4_prophetic_blessing',
    name: 'Prophetic Blessing',
    description: 'Allies within 30ft add +1d6 to critical hits per rank. Critical hits draw an extra card for bonus effects.',
    icon: 'spell_holy_blessingofprotection',
    maxRanks: 3,
    position: { x: 2, y: 6 },
    requires: 'fortune_t2_crystal_reflection',
  },
  {
    id: 'fortune_t4_fate_intervention',
    name: 'Fate Intervention',
    description: 'Once per combat, when an ally would die, draw a card. Face cards prevent their death and heal them for 3d10.',
    icon: 'spell_holy_resurrection',
    maxRanks: 1,
    position: { x: 4, y: 6 },
    requires: 'fortune_t2_fate_binding',
  },

  // Tier 5 - Inner convergence (paths converging toward center)
  {
    id: 'fortune_t5_oracle_supremacy',
    name: 'Oracle Supremacy',
    description: 'You become immune to surprise. Draw 5 cards at combat start: each red card grants a powerful prophecy effect.',
    icon: 'spell_arcane_farsight',
    maxRanks: 2,
    position: { x: 1, y: 7 },
    requires: ['fortune_t4_doom_divination', 'fortune_t3_crystal_shield'],
    requiresAll: false,
  },
  {
    id: 'fortune_t5_crystal_cataclysm',
    name: 'Crystal Cataclysm',
    description: 'Unlocks Crystal Cataclysm - shatter reality in 40ft radius. Deals 4d8 force damage per rank, enemies have disadvantage on all rolls for 3 rounds.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 3, y: 7 },
    requires: ['fortune_t4_fate_intervention', 'fortune_t3_shared_vision'],
    requiresAll: false,
  },

  // Tier 6 - Crystal core perfection (ultimate center)
  {
    id: 'fortune_t6_fate_crystal',
    name: 'Fate Crystal',
    description: 'Unlocks Fate Crystal - manifest a giant crystal of destiny. Allies within 60ft have advantage on all rolls, enemies have disadvantage. Lasts 5 rounds.',
    icon: 'spell_arcane_arcanepower',
    maxRanks: 1,
    position: { x: 2, y: 8 },
    requires: ['fortune_t5_oracle_supremacy', 'fortune_t5_crystal_cataclysm'],
    requiresAll: true,
  }
];

// Card Master Specialization - Card house pyramid structure (like building a house of cards)
export const FATE_WEAVER_CARD_MASTER = [
  // Tier 0 - Base card (foundation stone)
  {
    id: 'card_t0_deck_mastery',
    name: 'Deck Mastery',
    description: 'You can draw an extra card when casting card-based spells. Draw a card: red cards reduce spell costs by 5 mana per rank.',
    icon: 'inv_misc_tarot_01',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - First level (single card on base)
  {
    id: 'card_t1_card_sleight',
    name: 'Card Sleight',
    description: 'When you draw cards, you can discard 1 and redraw. Roll 1d20: on 14+ per rank, you can discard 2 and redraw both.',
    icon: 'spell_arcane_blink',
    maxRanks: 4,
    position: { x: 2, y: 1 },
    requires: 'card_t0_deck_mastery',
  },

  // Tier 2 - Second level (two cards leaning on first)
  {
    id: 'card_t1_royal_advantage',
    name: 'Royal Advantage',
    description: 'Face cards in your draws grant +1 to all rolls per rank for 1 round. Multiple face cards stack.',
    icon: 'inv_misc_platnumdisks',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'card_t1_card_sleight',
  },
  {
    id: 'card_t2_pair_mastery',
    name: 'Pair Mastery',
    description: 'When you draw pairs, deal +1d6 damage per rank with your next spell. Three of a kind deals +2d6 extra.',
    icon: 'inv_misc_platnumdisks',
    maxRanks: 4,
    position: { x: 3, y: 2 },
    requires: 'card_t1_card_sleight',
  },

  // Tier 3 - Third level (three cards forming triangle)
  {
    id: 'card_t2_flush_power',
    name: 'Flush Power',
    description: 'Suits have power: Hearts heal +1d8 per rank, Diamonds deal +1d8 force damage, Clubs stun (DC 13 + rank), Spades reduce enemy armor by 2 per rank.',
    icon: 'inv_misc_tarot_01',
    maxRanks: 3,
    position: { x: 0, y: 3 },
    requires: 'card_t1_royal_advantage',
  },
  {
    id: 'card_t2_straight_magic',
    name: 'Straight Magic',
    description: 'Straights grant +1d4 to spell DCs per rank. Royal straights automatically succeed against one target.',
    icon: 'spell_arcane_arcanepower',
    maxRanks: 3,
    position: { x: 2, y: 3 },
    requires: 'card_t1_royal_advantage',
  },
  {
    id: 'card_t3_full_house',
    name: 'Full House Mastery',
    description: 'Full houses create shields absorbing 2d6 damage per rank. Four of a kind doubles the shield strength.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 4, y: 3 },
    requires: 'card_t2_pair_mastery',
  },

  // Tier 4 - Fourth level (four cards expanding base)
  {
    id: 'card_t3_card_storm',
    name: 'Card Storm',
    description: 'Unlocks Card Storm - summon cards that deal 1d6 force damage per rank to enemies in 25ft. Draw a card to determine storm effects.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 4,
    position: { x: 1, y: 4 },
    requires: 'card_t2_straight_magic',
  },
  {
    id: 'card_t4_royal_flush',
    name: 'Royal Flush Dominion',
    description: 'Royal flushes let you control one enemy for 2 rounds per rank. They must follow your commands.',
    icon: 'inv_misc_platnumdisks',
    maxRanks: 2,
    position: { x: 3, y: 4 },
    requires: 'card_t2_straight_magic',
  },

  // Tier 5 - Fifth level (five cards - peak approaching)
  {
    id: 'card_t4_deck_rearrangement',
    name: 'Deck Rearrangement',
    description: 'Once per combat, rearrange the next 5 cards you draw. You can swap any 2 cards per rank.',
    icon: 'spell_arcane_blink',
    maxRanks: 3,
    position: { x: 0, y: 5 },
    requires: 'card_t3_card_storm',
  },
  {
    id: 'card_t4_living_cards',
    name: 'Living Cards',
    description: 'Your card effects can become living entities. They persist for 3 rounds and can act independently per rank.',
    icon: 'spell_shadow_possession',
    maxRanks: 3,
    position: { x: 2, y: 5 },
    requires: 'card_t3_card_storm',
  },
  {
    id: 'card_t5_infinite_deck',
    name: 'Infinite Deck',
    description: 'Your deck never runs out of cards. Draw an extra card each round. Perfect hands (royal flush) can be drawn once per combat.',
    icon: 'inv_misc_tarot_01',
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: 'card_t4_royal_flush',
  },

  // Tier 6 - Peak level (six cards - house complete)
  {
    id: 'card_t5_card_typhoon',
    name: 'Card Typhoon',
    description: 'Unlocks Card Typhoon - massive card storm in 50ft radius. Deals 3d8 force damage per rank, enemies are restrained by cards.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 1, y: 6 },
    requires: 'card_t4_living_cards',
  },
  {
    id: 'card_t6_deck_of_gods',
    name: 'Deck of the Gods',
    description: 'Unlocks Deck of the Gods - manifest divine cards that can reshape reality. Each card drawn has god-like power, affecting fate itself.',
    icon: 'inv_misc_platnumdisks',
    maxRanks: 1,
    position: { x: 3, y: 6 },
    requires: 'card_t5_infinite_deck',
  }
];

// Thread Weaver Specialization - Complex interconnected web/network pattern (like a spider web with crossing threads)
export const FATE_WEAVER_THREAD_WEAVER = [
  // Tier 0 - Web center (spider at center)
  {
    id: 'thread_t0_thread_sense',
    name: 'Thread Sense',
    description: 'You can see the threads of destiny connecting all things. +1d4 to perception checks per rank when detecting hidden enemies.',
    icon: 'spell_arcane_prismaticcloak',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Radial web strands (first ring of web)
  {
    id: 'thread_t1_failure_harvest',
    name: 'Failure Harvest',
    description: 'When your spells fail, gain +1 Thread of Destiny per rank. Maximum Threads increased by 3 per rank.',
    icon: 'spell_shadow_lifedrain',
    maxRanks: 4,
    position: { x: 0, y: 1 },
    requires: 'thread_t0_thread_sense',
  },
  {
    id: 'thread_t1_thread_binding',
    name: 'Thread Binding',
    description: 'Spend 1 Thread to reroll any die. Roll 1d20: on 15+ per rank, you can spend 1 Thread to force a reroll for enemies too.',
    icon: 'spell_arcane_prismaticcloak',
    maxRanks: 3,
    position: { x: 2, y: 1 },
    requires: 'thread_t0_thread_sense',
  },
  {
    id: 'thread_t1_thread_weaving',
    name: 'Thread Weaving',
    description: 'Weave threads into simple constructs. Spend 2 Threads to create a 10ft bridge or rope. Lasts 1 minute per rank.',
    icon: 'spell_arcane_prismaticcloak',
    maxRanks: 3,
    position: { x: 4, y: 1 },
    requires: 'thread_t0_thread_sense',
  },

  // Tier 2 - Crossing spirals (second ring with diagonal connections)
  {
    id: 'thread_t2_fate_redirection',
    name: 'Fate Redirection',
    description: 'Spend 2 Threads to redirect an attack targeting an ally to yourself. You take half damage per rank.',
    icon: 'spell_arcane_blink',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'thread_t1_failure_harvest',
  },
  {
    id: 'thread_t2_thread_armor',
    name: 'Thread Armor',
    description: 'Threads weave protective armor. +1 armor per 2 Threads spent. Lasts until you spend more Threads.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 4,
    position: { x: 3, y: 2 },
    requires: 'thread_t1_thread_binding',
  },
  {
    id: 'thread_t2_chance_manipulation',
    name: 'Chance Manipulation',
    description: 'Spend 1 Thread to add +1d6 to any roll per rank. Spend 3 Threads to guarantee success on a roll.',
    icon: 'spell_shadow_possession',
    maxRanks: 3,
    position: { x: 0, y: 3 },
    requires: 'thread_t1_thread_weaving',
  },
  {
    id: 'thread_t2_thread_barrier',
    name: 'Thread Barrier',
    description: 'Create barriers of woven threads. Spend 3 Threads for a 20ft wall (armor 15, 20 HP per rank). Lasts 1 minute.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 4, y: 3 },
    requires: 'thread_t1_thread_weaving',
  },

  // Tier 3 - Complex web intersections (third ring with multiple crossings)
  {
    id: 'thread_t3_thread_snare',
    name: 'Thread Snare',
    description: 'Spend 2 Threads to create snares. Enemies in 20ft must save or be restrained. DC 13 + rank.',
    icon: 'spell_nature_naturetouchdecay',
    maxRanks: 4,
    position: { x: 1, y: 4 },
    requires: 'thread_t2_fate_redirection',
  },
  {
    id: 'thread_t3_fate_weaving',
    name: 'Fate Weaving',
    description: 'Unlocks Fate Weaving - spend 4 Threads to weave destiny. Choose: heal 4d8, deal 4d8 force damage, or teleport 60ft.',
    icon: 'spell_arcane_prismaticcloak',
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: 'thread_t2_thread_armor',
  },
  {
    id: 'thread_t3_thread_puppet',
    name: 'Thread Puppet',
    description: 'Attach threads to control creatures. Spend 4 Threads to control one creature for 1 round per rank.',
    icon: 'spell_shadow_possession',
    maxRanks: 3,
    position: { x: 0, y: 5 },
    requires: 'thread_t2_chance_manipulation',
  },
  {
    id: 'thread_t3_web_of_deception',
    name: 'Web of Deception',
    description: 'Weave illusions within your threads. Spend 3 Threads to create perfect illusions that last 1 minute per rank.',
    icon: 'spell_arcane_prismaticcloak',
    maxRanks: 3,
    position: { x: 2, y: 5 },
    requires: 'thread_t2_thread_barrier',
  },

  // Tier 4 - Master web patterns (fourth ring with intricate connections)
  {
    id: 'thread_t4_thread_storm',
    name: 'Thread Storm',
    description: 'Unlocks Thread Storm - spend 3 Threads to create a storm of threads in 30ft. Enemies take 2d6 force damage per rank each round.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 4,
    position: { x: 1, y: 6 },
    requires: 'thread_t3_thread_snare',
  },
  {
    id: 'thread_t4_destiny_reweaving',
    name: 'Destiny Reweaving',
    description: 'Spend 5 Threads to rewind time 1 round for yourself or an ally. They can redo their turn with +2 to all rolls.',
    icon: 'spell_nature_timestop',
    maxRanks: 2,
    position: { x: 3, y: 6 },
    requires: 'thread_t3_fate_weaving',
  },
  {
    id: 'thread_t4_thread_golem',
    name: 'Thread Golem',
    description: 'Spend 6 Threads to create a thread golem. It has 4d10 HP per rank and attacks for 2d6 force damage.',
    icon: 'spell_shadow_possession',
    maxRanks: 3,
    position: { x: 0, y: 7 },
    requires: 'thread_t3_thread_puppet',
  },
  {
    id: 'thread_t4_reality_weaving',
    name: 'Reality Weaving',
    description: 'Weave threads that alter reality. Spend 5 Threads to reshape 10ft of terrain or create portals.',
    icon: 'spell_arcane_prismaticcloak',
    maxRanks: 2,
    position: { x: 4, y: 7 },
    requires: 'thread_t3_web_of_deception',
  },

  // Tier 5 - Divine web mastery (fifth ring converging to center)
  {
    id: 'thread_t5_infinite_threads',
    name: 'Infinite Threads',
    description: 'Maximum Threads increased by 10. When you reach maximum, spending Threads costs 1 less (minimum 1).',
    icon: 'spell_arcane_prismaticcloak',
    maxRanks: 2,
    position: { x: 1, y: 8 },
    requires: 'thread_t4_thread_storm',
  },
  {
    id: 'thread_t5_fate_tapestry',
    name: 'Fate Tapestry',
    description: 'Unlocks Fate Tapestry - spend 8 Threads to create a tapestry of destiny in 50ft. Allies have advantage on all rolls, enemies have disadvantage.',
    icon: 'spell_arcane_arcanepower',
    maxRanks: 3,
    position: { x: 3, y: 8 },
    requires: 'thread_t4_destiny_reweaving',
  },

  // Tier 6 - Cosmic web completion (ultimate web center)
  {
    id: 'thread_t6_cosmic_web',
    name: 'Cosmic Web',
    description: 'Unlocks Cosmic Web - weave the threads of the universe itself. For 1 minute, you control all fate within 100ft. Reroll any die, teleport freely, manipulate time.',
    icon: 'spell_arcane_prismaticcloak',
    maxRanks: 1,
    position: { x: 2, y: 9 },
    requires: ['thread_t5_infinite_threads', 'thread_t5_fate_tapestry'],
    requiresAll: true,
  }
];
