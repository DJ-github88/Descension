// ============================================
// FATE WEAVER TALENT TREES
// ============================================
// Standard: "per rank" = add another die of the same type
// (3 ranks in "+1d6 per rank" = 3d6)

// ============================================
// FORTUNE TELLER — Crystal divination tree
// "See the threads. Share the vision. Shape the outcome."
// ============================================
export const FATE_WEAVER_FORTUNE_TELLER = [
  // Tier 0 - Crystal nucleus (Center)
  {
    id: 'fortune_t0_crystal_gaze',
    name: 'Crystal Gaze',
    description: 'When you draw cards for spells, draw 1 extra card per rank and keep the best. Face cards drawn this way grant +1 Thread.',
    icon: 'spell_arcane_farsight',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - First ring
  {
    id: 'fortune_t1_future_sight',
    name: 'Future Sight',
    description: 'At combat start, draw 3 cards and set them aside as your Prophecy. Once per round, spend 1 Thread to swap a drawn card with a Prophecy card. Each rank lets you store 1 more Prophecy card.',
    icon: 'spell_holy_farsight',
    maxRanks: 3,
    position: { x: 1, y: 1 },
    requires: 'fortune_t0_crystal_gaze',
  },
  {
    id: 'fortune_t1_prophetic_dreams',
    name: 'Prophetic Dreams',
    description: 'At the start of each day, draw a card. Face cards grant you +1d8 temporary HP per rank for the first combat. Aces grant +2 Threads at combat start.',
    icon: 'spell_shadow_mindtwisting',
    maxRanks: 2,
    position: { x: 3, y: 1 },
    requires: 'fortune_t0_crystal_gaze',
  },
  {
    id: 'fortune_t1_crystal_clarity',
    name: 'Crystal Clarity',
    description: 'When you cast a card-based spell, each face card in your hand grants +1d4 damage per rank to that spell.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 0, y: 2 },
    requires: 'fortune_t0_crystal_gaze',
  },
  {
    id: 'fortune_t1_fate_whispers',
    name: 'Fate Whispers',
    description: 'Once per round, draw a card and show it to the DM. Red card: the DM must answer one yes/no question about immediate future events. Black card: gain 1 Thread per rank instead.',
    icon: 'spell_shadow_mindtwisting',
    maxRanks: 2,
    position: { x: 4, y: 2 },
    requires: 'fortune_t0_crystal_gaze',
  },

  // Tier 2 - Second ring
  {
    id: 'fortune_t2_prescient_strike',
    name: 'Prescient Strike',
    description: 'When an enemy attacks you, draw a card. Spades: redirect their attack to another enemy (deals 1d6 extra damage per rank). Hearts: reduce the damage by 1d8 per rank. Other suits: no effect, gain 1 Thread.',
    icon: 'ability_hunter_snipershot',
    maxRanks: 4,
    position: { x: 1, y: 3 },
    requires: 'fortune_t1_future_sight',
  },
  {
    id: 'fortune_t2_ally_foresight',
    name: 'Ally Foresight',
    description: 'Allies within 30ft gain +1 to saves per rank. When an ally rolls a natural 1 on a save, draw a card — face cards let them reroll once per combat.',
    icon: 'spell_holy_divineprovidence',
    maxRanks: 3,
    position: { x: 3, y: 3 },
    requires: 'fortune_t1_prophetic_dreams',
  },
  {
    id: 'fortune_t3_lucky_break',
    name: 'Lucky Break',
    description: 'When you take damage, draw a card. Aces reduce the damage by 2d6 per rank. Face cards reduce it by 1d6 per rank. Numbered cards: no reduction, gain 1 Thread.',
    icon: 'spell_shadow_lifedrain',
    maxRanks: 3,
    position: { x: 0, y: 4 },
    requires: 'fortune_t1_crystal_clarity',
  },
  {
    id: 'fortune_t2_crystal_reflection',
    name: 'Crystal Reflection',
    description: 'When targeted by a spell, draw a card. Matching the suit of the spell school reflects 1d6 damage per rank back to the caster. Non-matching: gain 1 Thread.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 2, y: 4 },
    requires: 'fortune_t1_crystal_clarity',
  },
  {
    id: 'fortune_t2_fate_binding',
    name: 'Fate Binding',
    description: 'Once per combat, draw a card. Face card: force an enemy to reroll a successful attack or save and take the worse result. Numbered card: no effect, gain 2 Threads per rank.',
    icon: 'spell_shadow_possession',
    maxRanks: 2,
    position: { x: 4, y: 4 },
    requires: 'fortune_t1_fate_whispers',
  },

  // Tier 3 - Third ring
  {
    id: 'fortune_t3_crystal_shield',
    name: 'Crystal Shield',
    description: 'Draw 3 cards. Each matching suit adds 1d8 damage absorption per rank to a shield that lasts 3 rounds. No matches: gain 1 Thread per card instead.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 1, y: 5 },
    requires: 'fortune_t2_prescient_strike',
  },
  {
    id: 'fortune_t3_shared_vision',
    name: 'Shared Vision',
    description: 'Allies within 20ft can see your Prophetic cards. When they make an attack, draw a card from your Prophecy — face cards grant +1d4 to their attack per rank.',
    icon: 'spell_holy_searinglightpriest',
    maxRanks: 4,
    position: { x: 3, y: 5 },
    requires: 'fortune_t2_ally_foresight',
  },

  // Tier 4 - Outer ring
  {
    id: 'fortune_t4_doom_divination',
    name: 'Doom Divination',
    description: 'When you first see an enemy, draw a card. Black cards reduce their damage output by 1d6 per rank for the combat. Red cards: no reduction, gain 2 Threads per rank.',
    icon: 'spell_shadow_antishadow',
    maxRanks: 3,
    position: { x: 0, y: 6 },
    requires: 'fortune_t3_lucky_break',
  },
  {
    id: 'fortune_t4_prophetic_blessing',
    name: 'Prophetic Blessing',
    description: 'When an ally scores a critical hit, draw a card. Face cards add +1d10 damage per rank to the crit. Numbered cards: the ally gains 1 Thread per rank instead.',
    icon: 'spell_holy_blessingofprotection',
    maxRanks: 3,
    position: { x: 2, y: 6 },
    requires: 'fortune_t2_crystal_reflection',
  },
  {
    id: 'fortune_t4_fate_intervention',
    name: 'Fate Intervention',
    description: 'Once per combat, when an ally would die, draw 3 cards. If any 2 share a suit, prevent their death and heal them for 3d10. No matches: they still fall, you gain 5 Threads.',
    icon: 'spell_holy_resurrection',
    maxRanks: 1,
    position: { x: 4, y: 6 },
    requires: 'fortune_t2_fate_binding',
  },

  // Tier 5 - Convergence
  {
    id: 'fortune_t5_oracle_supremacy',
    name: 'Oracle Supremacy',
    description: 'You are immune to surprise. At combat start, draw 5 cards as Prophecy instead of 3. Each face card in your Prophecy grants all allies +1 to initiative per rank.',
    icon: 'spell_arcane_farsight',
    maxRanks: 2,
    position: { x: 1, y: 7 },
    requires: ['fortune_t4_doom_divination', 'fortune_t3_crystal_shield'],
    requiresAll: false,
  },
  {
    id: 'fortune_t5_crystal_cataclysm',
    name: 'Crystal Cataclysm',
    description: 'Your card-based spells that deal damage also deal +2d8 force damage per rank to all enemies within 10ft of the primary target. Face cards drawn double this bonus for that cast.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 3, y: 7 },
    requires: ['fortune_t4_fate_intervention', 'fortune_t3_shared_vision'],
    requiresAll: false,
  },

  // Tier 6 - Ultimate
  {
    id: 'fortune_t6_fate_crystal',
    name: 'Fate Crystal',
    description: 'Draw 13 cards and arrange them in a circle around you. Allies within 60ft gain advantage on all rolls. Enemies within 60ft have disadvantage. Each round, flip the top card — if it matches an enemy\'s suit, they lose their reaction. Lasts 5 rounds or until all 13 cards are flipped.',
    icon: 'spell_arcane_arcanepower',
    maxRanks: 1,
    position: { x: 2, y: 8 },
    requires: ['fortune_t5_oracle_supremacy', 'fortune_t5_crystal_cataclysm'],
    requiresAll: true,
  }
];

// ============================================
// CARD MASTER — Deck manipulation tree
// "The deck is your weapon. The hand is your will."
// ============================================
export const FATE_WEAVER_CARD_MASTER = [
  // Tier 0 - Foundation
  {
    id: 'card_t0_deck_mastery',
    name: 'Deck Mastery',
    description: 'When you draw cards for a spell, draw 1 extra card per rank and discard your choice. Red cards discarded this way refund 2 mana per rank.',
    icon: 'inv_misc_tarot_01',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1
  {
    id: 'card_t1_card_sleight',
    name: 'Card Sleight',
    description: 'After drawing cards for a spell, discard 1 card and redraw from the deck per rank. If the new card is a face card, your spell deals +1d6 damage per rank.',
    icon: 'spell_arcane_blink',
    maxRanks: 4,
    position: { x: 2, y: 1 },
    requires: 'card_t0_deck_mastery',
  },

  // Tier 2
  {
    id: 'card_t1_royal_advantage',
    name: 'Royal Advantage',
    description: 'Face cards in your drawn hands grant +1 to all rolls per rank for 1 round. Multiple face cards stack (2 face cards = +2 per rank).',
    icon: 'inv_misc_platnumdisks',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'card_t1_card_sleight',
  },
  {
    id: 'card_t2_pair_mastery',
    name: 'Pair Mastery',
    description: 'When your drawn hand contains a pair, your next spell deals +1d6 damage per rank. Three of a kind: +2d6 per rank. Four of a kind: +4d6 per rank.',
    icon: 'inv_misc_platnumdisks',
    maxRanks: 4,
    position: { x: 3, y: 2 },
    requires: 'card_t1_card_sleight',
  },

  // Tier 3
  {
    id: 'card_t2_flush_power',
    name: 'Flush Power',
    description: 'Each card in a flush grants a bonus per rank: Hearts heal +1d8, Diamonds deal +1d8 force damage, Clubs reduce enemy AC by 1, Spades grant +1 to your AC.',
    icon: 'inv_misc_tarot_01',
    maxRanks: 3,
    position: { x: 0, y: 3 },
    requires: 'card_t1_royal_advantage',
  },
  {
    id: 'card_t2_straight_magic',
    name: 'Straight Magic',
    description: 'Straights in your hand grant +1 to spell DC per rank per card in the straight. A straight of 5 cards (full straight) auto-succeeds against one target.',
    icon: 'spell_arcane_arcanepower',
    maxRanks: 3,
    position: { x: 2, y: 3 },
    requires: 'card_t1_royal_advantage',
  },
  {
    id: 'card_t3_full_house',
    name: 'Full House Mastery',
    description: 'Full houses create shields absorbing 2d6 damage per rank. Four of a kind doubles the shield. The suit of the three-of-a-kind determines the shield element resistance.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 4, y: 3 },
    requires: 'card_t2_pair_mastery',
  },

  // Tier 4
  {
    id: 'card_t3_card_storm',
    name: 'Card Storm',
    description: 'When you cast a card-based spell with 3+ matching cards, deal 1d6 force damage per rank to all enemies within 15ft of the target. Draw a card — face cards double the storm damage.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 4,
    position: { x: 1, y: 4 },
    requires: 'card_t2_straight_magic',
  },
  {
    id: 'card_t4_royal_flush',
    name: 'Royal Flush Dominion',
    description: 'When you achieve a Royal Flush, you may control one enemy for 2 rounds per rank. They follow your commands. Spend 6 Threads to guarantee a Royal Flush (still requires casting Hand of Fate).',
    icon: 'inv_misc_platnumdisks',
    maxRanks: 2,
    position: { x: 3, y: 4 },
    requires: 'card_t2_straight_magic',
  },

  // Tier 5
  {
    id: 'card_t4_deck_rearrangement',
    name: 'Deck Rearrangement',
    description: 'Once per combat, look at the top 5+rank cards of your deck and rearrange them in any order. Face cards in the rearranged top 5 generate 1 Thread each.',
    icon: 'spell_arcane_blink',
    maxRanks: 3,
    position: { x: 0, y: 5 },
    requires: 'card_t3_card_storm',
  },
  {
    id: 'card_t4_living_cards',
    name: 'Living Cards',
    description: 'When you discard cards from your hand, they persist for 3 rounds as hovering projectiles. Each living card deals 1d4 force damage per rank to the next enemy that enters melee range.',
    icon: 'spell_shadow_possession',
    maxRanks: 3,
    position: { x: 2, y: 5 },
    requires: 'card_t3_card_storm',
  },
  {
    id: 'card_t5_infinite_deck',
    name: 'Infinite Deck',
    description: 'Your deck never runs out. When you would reshuffle the discard pile, instead regenerate the full 52-card deck. Draw 1 extra card at the start of each of your turns per rank.',
    icon: 'inv_misc_tarot_01',
    maxRanks: 2,
    position: { x: 4, y: 5 },
    requires: 'card_t4_royal_flush',
  },

  // Tier 6 - Ultimate
  {
    id: 'card_t5_card_typhoon',
    name: 'Card Typhoon',
    description: 'When you cast a card-based spell, all discarded cards from that spell spin outward dealing 2d8 force damage per rank to enemies within 20ft. Face cards deal double. You gain 1 Thread per enemy hit.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 3,
    position: { x: 1, y: 6 },
    requires: 'card_t4_living_cards',
  },
  {
    id: 'card_t6_deck_of_gods',
    name: 'Deck of the Gods',
    description: 'Once per long rest, draw 5 cards. Each card becomes a permanent passive for 1 minute: Aces = +5 to all rolls. Face cards = immunity to one damage type. Numbered cards = your spells cost 5 less mana. The gods deal in absolutes.',
    icon: 'inv_misc_platnumdisks',
    maxRanks: 1,
    position: { x: 3, y: 6 },
    requires: 'card_t5_infinite_deck',
  }
];

// ============================================
// THREAD WEAVER — Thread generation & manipulation tree
// "Break fate to remake it. Every scar is a thread."
// ============================================
export const FATE_WEAVER_THREAD_WEAVER = [
  // Tier 0 - Web center
  {
    id: 'thread_t0_thread_sense',
    name: 'Thread Sense',
    description: 'When you generate Threads, draw a card. Face cards generate +1 additional Thread per rank. Aces generate +2 additional Threads per rank.',
    icon: 'spell_arcane_prismaticcloak',
    maxRanks: 3,
    position: { x: 2, y: 0 },
    requires: null,
  },

  // Tier 1 - Radial strands
  {
    id: 'thread_t1_failure_harvest',
    name: 'Failure Harvest',
    description: 'When your spells fail or produce negative outcomes, gain +1 additional Thread per rank. Your maximum Threads increase by 3 per rank (up to 25 at max ranks).',
    icon: 'spell_shadow_lifedrain',
    maxRanks: 4,
    position: { x: 0, y: 1 },
    requires: 'thread_t0_thread_sense',
  },
  {
    id: 'thread_t1_thread_binding',
    name: 'Thread Binding',
    description: 'Spend 1 Thread to force any creature to reroll a die. Draw a card — face cards: you choose which result. Numbered cards: the roller chooses. Aces: both results apply (take the better for allies, worse for enemies).',
    icon: 'spell_arcane_prismaticcloak',
    maxRanks: 3,
    position: { x: 2, y: 1 },
    requires: 'thread_t0_thread_sense',
  },
  {
    id: 'thread_t1_thread_weaving',
    name: 'Thread Weaving',
    description: 'Spend 2 Threads to enhance your next card draw — draw 2 additional cards and choose the best per rank. Discarded cards still count for Thread generation.',
    icon: 'spell_arcane_prismaticcloak',
    maxRanks: 3,
    position: { x: 4, y: 1 },
    requires: 'thread_t0_thread_sense',
  },

  // Tier 2 - Crossing strands
  {
    id: 'thread_t2_fate_redirection',
    name: 'Fate Redirection',
    description: 'Spend 2 Threads to redirect an attack targeting an ally to yourself. Draw a card — each pip reduces the damage you take by 2 per rank. Face cards: take no damage instead.',
    icon: 'spell_arcane_blink',
    maxRanks: 3,
    position: { x: 1, y: 2 },
    requires: 'thread_t1_failure_harvest',
  },
  {
    id: 'thread_t2_thread_armor',
    name: 'Thread Armor',
    description: 'Spend Threads at the start of your turn to weave armor: +1 AC per 2 Threads spent per rank. Lasts until you spend Threads again. The more Threads you spend, the stronger the weave.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 4,
    position: { x: 3, y: 2 },
    requires: 'thread_t1_thread_binding',
  },
  {
    id: 'thread_t2_chance_manipulation',
    name: 'Chance Manipulation',
    description: 'Spend 1 Thread to add +1d6 to any roll per rank. Spend 3 Threads to guarantee a roll succeeds (draw a card — if face card, also add a bonus effect of your choice).',
    icon: 'spell_shadow_possession',
    maxRanks: 3,
    position: { x: 0, y: 3 },
    requires: 'thread_t1_thread_weaving',
  },
  {
    id: 'thread_t2_thread_barrier',
    name: 'Thread Barrier',
    description: 'Spend 3 Threads to create a 20ft barrier of woven fate. Enemies passing through draw a card — red cards: they are restrained for 1 round per rank. Black cards: they take 1d8 force damage per rank. Lasts 1 minute.',
    icon: 'spell_arcane_arcaneresilience',
    maxRanks: 3,
    position: { x: 4, y: 3 },
    requires: 'thread_t1_thread_weaving',
  },

  // Tier 3 - Web intersections
  {
    id: 'thread_t3_thread_snare',
    name: 'Thread Snare',
    description: 'Spend 2 Threads to create snares in a 20ft area. Enemies entering draw a card — Clubs: restrained for 1 round per rank. Other suits: slowed for 1 round per rank. Aces: both effects.',
    icon: 'spell_nature_naturetouchdecay',
    maxRanks: 4,
    position: { x: 1, y: 4 },
    requires: 'thread_t2_fate_redirection',
  },
  {
    id: 'thread_t3_fate_weaving',
    name: 'Fate Weaving',
    description: 'Spend 4 Threads and draw 3 cards. All same suit: heal 4d8 per rank OR deal 4d8 force damage per rank. Pair: teleport 60ft. No matches: gain 2 Threads per rank back.',
    icon: 'spell_arcane_prismaticcloak',
    maxRanks: 3,
    position: { x: 3, y: 4 },
    requires: 'thread_t2_thread_armor',
  },
  {
    id: 'thread_t3_thread_leech',
    name: 'Thread Leech',
    description: 'Spend 3 Threads to attach fate threads to a creature. Each round, draw a card — red cards drain 1d6 HP per rank and convert it to Threads for you. Lasts 3 rounds. Face cards: drain is doubled.',
    icon: 'spell_shadow_possession',
    maxRanks: 3,
    position: { x: 0, y: 5 },
    requires: 'thread_t2_chance_manipulation',
  },
  {
    id: 'thread_t3_web_of_fate',
    name: 'Web of Fate',
    description: 'Spend 4 Threads to link all creatures in 30ft with fate threads. When one creature takes damage, all linked creatures of the same type take 1d4 per rank. Draw a card each round — Aces sever the link for your allies.',
    icon: 'spell_arcane_prismaticcloak',
    maxRanks: 3,
    position: { x: 2, y: 5 },
    requires: 'thread_t2_thread_barrier',
  },

  // Tier 4 - Master patterns
  {
    id: 'thread_t4_thread_storm',
    name: 'Thread Storm',
    description: 'Spend 3 Threads to create a storm of threads in 30ft. Each round, draw a card — face cards deal 2d6 force damage per rank to enemies in the area. Numbered cards deal 1d6 per rank and generate 1 Thread. Lasts 3 rounds.',
    icon: 'spell_arcane_arcanetorrent',
    maxRanks: 4,
    position: { x: 1, y: 6 },
    requires: 'thread_t3_thread_snare',
  },
  {
    id: 'thread_t4_destiny_reweaving',
    name: 'Destiny Reweaving',
    description: 'Spend 5 Threads to rewind 1 round for yourself or an ally. They redo their turn with +1d4 per rank to all rolls. Draw a card — Aces: the rewind costs no Threads.',
    icon: 'spell_nature_timestop',
    maxRanks: 2,
    position: { x: 3, y: 6 },
    requires: 'thread_t3_fate_weaving',
  },
  {
    id: 'thread_t4_thread_overflow',
    name: 'Thread Overflow',
    description: 'When you would gain Threads beyond your maximum, instead deal 1d6 force damage per rank per excess Thread to enemies within 20ft. Face cards double the overflow damage.',
    icon: 'spell_shadow_possession',
    maxRanks: 3,
    position: { x: 0, y: 7 },
    requires: 'thread_t3_thread_leech',
  },
  {
    id: 'thread_t4_fortune_drain',
    name: 'Fortune Drain',
    description: 'Spend 4 Threads to drain an enemy\'s luck. Draw a card — the enemy has disadvantage on all rolls for a number of rounds equal to the card\'s value per rank (Aces = 5 rounds, Face = 4 rounds, others = pip value).',
    icon: 'spell_arcane_prismaticcloak',
    maxRanks: 2,
    position: { x: 4, y: 7 },
    requires: 'thread_t3_web_of_fate',
  },

  // Tier 5 - Divine mastery
  {
    id: 'thread_t5_infinite_threads',
    name: 'Infinite Threads',
    description: 'Maximum Threads increased by 5 per rank. When you reach your new maximum, all your Thread costs are reduced by 1 (minimum 1) for 3 rounds.',
    icon: 'spell_arcane_prismaticcloak',
    maxRanks: 2,
    position: { x: 1, y: 8 },
    requires: 'thread_t4_thread_storm',
  },
  {
    id: 'thread_t5_fate_tapestry',
    name: 'Fate Tapestry',
    description: 'Spend 8 Threads and draw 5 cards. Arrange them as the Tapestry — allies in 50ft gain advantage matching the suits present (Hearts = attack advantage, Diamonds = save advantage, Clubs = skill advantage, Spades = AC +2). Number of matching suits = number of advantages active. Lasts 5 rounds.',
    icon: 'spell_arcane_arcanepower',
    maxRanks: 3,
    position: { x: 3, y: 8 },
    requires: 'thread_t4_destiny_reweaving',
  },

  // Tier 6 - Ultimate
  {
    id: 'thread_t6_cosmic_web',
    name: 'Cosmic Web',
    description: 'Spend 13 Threads (the King\'s price). For 1 minute, draw 1 card at the start of each turn. That card\'s suit dictates cosmic power: ♠ = reroll any enemy die, ♥ = heal all allies 4d8, ♦ = deal 4d8 force damage to all enemies, ♣ = all enemies lose their reaction. Face cards = apply ALL four effects.',
    icon: 'spell_arcane_prismaticcloak',
    maxRanks: 1,
    position: { x: 2, y: 9 },
    requires: ['thread_t5_infinite_threads', 'thread_t5_fate_tapestry'],
    requiresAll: true,
  }
];
