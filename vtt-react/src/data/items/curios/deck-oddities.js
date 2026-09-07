/**
 * Compendium of Aberrant Curios — I. Deck & Card Oddities (Items 1-15)
 *
 * Chaotic relics of card and stone. Converted to Mythrill item format:
 * - Action economy: every activation costs AP as an Action/Reaction, or is passive.
 * - Protection uses only canonical resistances
 *   (smashing/stabbing/slicing/ember/rime/storm/primal/arcane/blight/wyrd/
 *   sacred); there is no deflection stat in this system.
 * - Carried curios use accessory/TRINKET in the trinket slot.
 */

export const DECK_ODDITIES = [
  {
    id: 'shuffled-lexicon-of-odds',
    name: 'The Shuffled Lexicon of Odds',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'Spend 2 AP as an Action to draw 1-3 stone cards, then roll 1d6 for each: 1-2 lag-phasing (gain resistance to smashing, stabbing and slicing until your next turn), 3-4 an instant wardrobe-and-position swap with a visible foe within 60 ft, 5-6 one touched object churns into butter. Reality treats your timeline like a poorly buffered live stream.',
    iconId: 'Misc/Books/book-brown-fire-symbol-runes',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {},
    combatStats: {
      spellDamage: {
        types: {
          wyrd: { value: 2, isPercentage: false }
        }
      },
      resistances: {
        wyrd: { value: 2, isPercentage: false }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'tarokka-of-tardy-regret',
    name: 'The Tarokka of Tardy Regret',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'Spend 1 AP as an Action to draw a card and gain an automatic success on the check or attack you are currently attempting. Ten minutes later the exact mishap you avoided happens to you in a harmless, socially humiliating context, and the deck refuses further draws until the debt settles. Destiny never forgets a debt; it just settles it over dinner instead of battle.',
    iconId: 'Misc/Books/book-scroll-rolled-red-wax-seal',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      spirit: { value: 1, isPercentage: false }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },
  {
    id: 'deck-of-petty-grievances',
    name: 'The Deck of Petty Grievances',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'uncommon',
    description: 'Spend 1 AP as an Action to deal a card onto a target within 30 ft, attaching an annoying passive curse: it treats its next check as rolled with disadvantage. You suffer the cosmic spite tax in turn: untied laces, phantom itches, -1 Agility for 10 minutes. Cursing enemies is easy; enduring the spite tax is the real trial.',
    iconId: 'Misc/Books/book-blank-sheet-paper-shadow',
    value: { gold: 0, silver: 8, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      agility: { value: -1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          wyrd: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },
  {
    id: 'solitaire-of-lonely-sovereign',
    name: 'Solitaire of the Lonely Sovereign',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'Usable only while completely isolated, with no allies or foes within 60 ft. Spend 2 AP as an Action to stack cards: each cleanly stacked card summons a spectral duplicate minion with 1 health that obeys simple orders. If any card slips, all duplicates vanish, mocking your card-stacking technique. Loneliness made manifest, weaponized against social gatherings.',
    iconId: 'Misc/Books/book-brown-green-rune-bookmark',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      spirit: { value: 2, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'origami-tarot',
    name: 'The Origami Tarot',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'uncommon',
    description: 'Spend 1 AP as an Action to draw: the card folds itself into a tiny paper beast that scouts ahead faithfully for up to 1 hour. If it senses water or open flame within 30 ft it panics and dissolves into pulp. Folded courage with the durability of a sneeze.',
    iconId: 'Misc/Books/book-open-reddish-brown-pages',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },
  {
    id: 'jokers-eulogy',
    name: "The Joker's Eulogy",
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'epic',
    description: 'Two cards: Laugh and Cry. Spend 2 AP as an Action to draw. Laugh: until your next turn, whenever you take damage you burst into uncontrollable cackling that restores 1d6 health to each ally within 30 ft. Cry: every enemy within 20 ft sobs uncontrollably and suffers 2d6 storm damage. Emotional whiplash bound in velvet and gold leaf.',
    iconId: 'Misc/Books/book-brown-red-emblem-clasp',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      spirit: { value: 2, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'deck-of-subcontractor',
    name: 'Deck of the Subcontractor',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'Spend 2 AP as an Action to draw and summon a tradesperson (carpenter, notary, ditch-digger) who completes one manual task in seconds, then demands union wages in copper pieces before departing. Extradimensional labor with strictly enforced lunch breaks.',
    iconId: 'Misc/Books/book-scroll-parchment-rolled',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      charisma: { value: 1, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'cartomancers-blindfold-deck',
    name: "Cartomancer's Blindfold Deck",
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'You may only draw while blinded. Spend 1 AP as an Action to draw: gain true-sight and night-vision for 1 hour, but your left-right motor coordination inverts (-2 Agility for the duration). You see all truths of the cosmos, yet keep bumping into doorframes.',
    iconId: 'Misc/Books/book-blank-sheet-paper-shadow',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      intelligence: { value: 2, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },
  {
    id: 'infinite-business-card-holder',
    name: 'The Infinite Business Card Holder',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'uncommon',
    description: 'Spend 1 AP as an Action to draw a persona card. For 10 minutes you adopt that identity (itinerant tax auditor, royal haberdasher) and everyone genuinely believes you are who the card claims. Bureaucratic camouflage at its most brazen.',
    iconId: 'Misc/Books/book-folded-letter-envelope',
    value: { gold: 0, silver: 8, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      charisma: { value: 2, isPercentage: false }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },
  {
    id: 'deck-of-overdue-books',
    name: 'The Deck of Overdue Books',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'uncommon',
    description: 'Spend 1 AP as an Action to draw: a heavy hardbound tome (always an excruciatingly boring historical census) materializes above a target within 60 ft and drops for 2d6 smashing damage. Knowledge is heavy, especially at terminal velocity.',
    iconId: 'Misc/Books/book-brown-alchemy-flask-symbol',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      intelligence: { value: 1, isPercentage: false }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },
  {
    id: 'hand-of-dead-mans-flush',
    name: "Hand of the Dead Man's Flush",
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'Five cards permanently glued together. Spend 2 AP as an Action to hurl them at a target within 30 ft: all magical enchantments on the target are cleansed, and 50 gallons of lukewarm river water drench everything nearby. A literal and figurative purge of magical nonsense.',
    iconId: 'Misc/Books/book-treasure-map-red-x-paths',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      spirit: { value: 1, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'blank-cheque-deck',
    name: 'The Blank Cheque Deck',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'epic',
    description: 'Spend 1 AP as an Action to whisper a spell of level 3 or lower onto a blank slate card and store it. Casting the stored spell costs its normal AP, but requires reciting an embarrassing childhood secret aloud. Magic powered by raw, distilled social vulnerability.',
    iconId: 'Misc/Books/book-blank-sheet-paper-shadow',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      intelligence: { value: 2, isPercentage: false },
      charisma: { value: -1, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'cluttered-hand',
    name: 'The Cluttered Hand',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'uncommon',
    description: 'Spend 1 AP as an Action to draw: every loose possession in your pack snaps into airtight pocket dimensions, but all food rations inside turn into dried prune leather. Peak organizational efficiency at the expense of culinary joy.',
    iconId: 'Misc/Books/book-scroll-nr192-red-seal',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      spirit: { value: 1, isPercentage: false }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },
  {
    id: 'cards-of-uncomfortable-truth',
    name: 'Cards of Uncomfortable Truth',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: "Spend 1 AP as an Action to force a creature within 30 ft to draw: it must answer one interrogation question truthfully, then falls platonically in love with your party's least charismatic member. Honesty breeds adoration, whether you want it or not.",
    iconId: 'Misc/Books/book-folded-letter-envelope',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      charisma: { value: 1, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'shuffling-void',
    name: 'The Shuffling Void',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'epic',
    description: 'A deck of pitch-black obsidian. Spend 1 AP as an Action to shuffle: all light within 60 ft extinguishes for 2 rounds. While in total darkness you gain flight, but lose all sense of up and down (Agility checks to steer are rolled with disadvantage). Aerial superiority paired with catastrophic vertigo.',
    iconId: 'Misc/Books/book-banner-v-symbol-wooden-rods',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {},
    utilityStats: {
      movementSpeed: { value: 10, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  }
];
