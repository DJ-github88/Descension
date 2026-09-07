/**
 * Compendium of Aberrant Curios — II. Coins, Dice & Chance Curios (Items 16-30)
 *
 * Converted to Mythrill item format:
 * - Action economy: every activation costs AP as an Action/Reaction, or is passive.
 * - Protection uses only canonical resistances
 *   (smashing/stabbing/slicing/ember/rime/storm/primal/arcane/blight/wyrd/
 *   sacred); there is no deflection stat in this system.
 * - Sonic/thunder effects map to storm; fear/charm/fate effects map to wyrd;
 *   fire maps to ember.
 */

export const CHANCE_CURIOS = [
  {
    id: 'gamblers-sovereign',
    name: "The Gambler's Sovereign",
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'epic',
    description: "Spend 1 AP as an Action to flip the two-faced coin. Heads: your next Attack this turn is a critical hit, but a slapstick mishap strikes you or an ally (GM's choice). Tails: your attack automatically fails, but nearby allies gain resistance to smashing, stabbing and slicing until your next turn. Edge: a cosmic casino dealer appears bearing an oddly specific mundane solution. Even when the universe laughs at you, it buys your party a drink.",
    iconId: 'Container/Coins/golden-coin-single-isometric',
    value: { gold: 5, silver: 0, copper: 0 },
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
    id: 'dodecahedron-of-dubious-advice',
    name: 'The Dodecahedron of Dubious Advice',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'uncommon',
    description: 'Before making a choice, spend 1 AP to roll the 12-sided bone die and hear its whisper. Odd: flawless guidance, delivered in infuriating rhyming nursery couplets. Even: confident instructions for a disastrous flanking maneuver. Tactical genius filtered through the mind of a deranged bard.',
    iconId: 'Currency/golden-orb-gem',
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
    id: 'copper-of-indecision',
    name: 'The Copper of Indecision',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'Spend 1 AP as an Action to flip the coin and leave it hovering mid-spin. While it spins, creatures within 15 ft cannot take hostile actions, trapped in sudden philosophical doubt. Catching it (1 AP as an Action, or a Reaction when attacked) breaks the spell. Weapons are lowered because nobody wants to interrupt a cool coin flip.',
    iconId: 'Container/Coins/golden-coin-single-isometric',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      spirit: { value: 1, isPercentage: false }
    },
    combatStats: {
      resistances: {
        wyrd: { value: 2, isPercentage: false }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'weighted-bone-of-cheater',
    name: 'Weighted Bone of the Cheater',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'uncommon',
    description: 'This die always lands on 6 when you roll it for a game of chance. Every time it does, an ethereal booming cough echoes from above, alerting everyone within 100 ft to a dishonest presence. Guaranteed victory with zero stealth.',
    iconId: 'Currency/golden-orb-gem',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      agility: { value: -1, isPercentage: false }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },
  {
    id: 'penny-for-your-nightmare',
    name: 'Penny for Your Nightmare',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: "Spend 1 AP as an Action to press this coin into an enemy's hand. That night their worst fear materializes in physical form and battles them for 1 hour. If they defeat it, the nightmare leaves behind 50 genuine silver coins. Psychological warfare that doubles as an investment fund.",
    iconId: 'Container/Coins/golden-coin-single-isometric',
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
      }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },
  {
    id: 'roulette-brooch',
    name: 'The Roulette Brooch',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'Spend 1 AP as an Action to spin the center dial. Red: ember resistance and spicy breath until your next rest. Black: shadow camouflage (sneaking checks gain advantage) and perfectly chilled drinks. Zero: you shed your outer garments in a burst of sparkling confetti. Fashion meets statistical catastrophe.',
    iconId: 'Armor/Neck/butterfly-dragonfly-charm',
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
    id: 'bouncing-nickel-of-momentum',
    name: 'The Bouncing Nickel of Momentum',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'uncommon',
    description: 'Spend 1 AP as an Action to drop the coin on stone: it ricochets faster with every bounce, and after 4 bounces breaks the sound barrier, striking a target within 60 ft for 3d6 stabbing damage that ignores cover and shields. It then returns to smack you in the shin for 1 smashing damage. Kinetic acceleration with a built-in karma boomerang.',
    iconId: 'Container/Coins/golden-coin-single-isometric',
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
    id: 'die-of-inconvenient-gravity',
    name: 'The Die of Inconvenient Gravity',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'epic',
    description: 'Spend 2 AP as an Action to roll 1d6: gravity tilts 45 degrees for 3 rounds toward the rolled direction (1-4 compass points, 5 up, 6 down) for everyone in the room. The room becomes an involuntary water slide without water.',
    iconId: 'Currency/golden-orb-gem',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      constitution: { value: 1, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'shilling-of-unspoken-word',
    name: 'The Shilling of the Unspoken Word',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'uncommon',
    description: 'Spend 1 AP as an Action to bite down on the coin and seal a lie: attempts to detect your lies instead reveal a golden aura of absolute truth, but you can only speak in Pig Latin for the remainder of the conversation. Infallible deception that sounds utterly ridiculous.',
    iconId: 'Container/Coins/golden-coin-single-isometric',
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
    id: 'two-sided-mirror-coin',
    name: 'The Two-Sided Mirror Coin',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'Both sides are polished mirrors. Spend 1 AP as an Action to study your reflection: swap eye color and cosmetic appearance with the last humanoid you shook hands with, lasting until you dismiss it. Identity theft through a polite greeting.',
    iconId: 'Container/Coins/golden-coin-single-isometric',
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
    id: 'spin-top-of-stagnation',
    name: 'The Spin-Top of Stagnation',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'epic',
    description: 'Spend 1 AP as an Action to spin the brass top on any surface. While it spins (1d4 minutes), decay, bleeding and ongoing potion effects within 30 ft pause completely. When it topples, every paused effect resumes at double intensity. Borrowing time at usurious interest rates.',
    iconId: 'Currency/golden-orb-gem',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      constitution: { value: 2, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'coin-of-dramatic-timing',
    name: 'The Coin of Dramatic Timing',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'uncommon',
    description: 'Spend 1 AP as an Action to flip the coin: thunder rolls, a spotlight finds you, and Intimidation checks gain a +4 bonus for 10 minutes, but every town guard nearby learns your exact theatrical location. Why enter quietly when you can arrive with stage pyrotechnics?',
    iconId: 'Container/Coins/golden-coin-single-isometric',
    value: { gold: 0, silver: 6, copper: 0 },
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
    id: 'loaded-dice-of-sympathy',
    name: 'The Loaded Dice of Sympathy',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'When you roll a natural 1 in combat, spend a Reaction (1 AP) to roll these dice with a dramatic sigh and head shake: an ally within 60 ft gains advantage on their next roll. Turning personal failure into collective triumph through melodrama.',
    iconId: 'Currency/golden-orb-gem',
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
    id: 'counterfeit-sovereign',
    name: 'The Counterfeit Sovereign',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'uncommon',
    description: 'Looks like pure electrum. When handed to a vendor as payment, it duplicates whatever item you buy, but both original and copy melt into harmless scented soap after 24 hours. A buyer\'s remorse warranty that cleanses your conscience.',
    iconId: 'Container/Coins/golden-coin-single-isometric',
    value: { gold: 0, silver: 4, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {},
    durability: 'd4',
    maxDurability: 'd4'
  },
  {
    id: 'die-of-inevitable-mediocrity',
    name: 'The Die of Inevitable Mediocrity',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'A 20-sided die with every face labeled 10. Spend 1 AP as an Action to invoke it: for 1 hour, neither you nor a target within 30 ft can roll higher or lower than a flat 10 on any check. Eliminating heroes and monsters to celebrate pure bureaucratic average.',
    iconId: 'Currency/golden-orb-gem',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {},
    combatStats: {
      resistances: {
        wyrd: { value: 2, isPercentage: false }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  }
];
