/**
 * Compendium of Aberrant Curios — III. Bottomless Vessels, Kettles &
 * Containment Cracks (Items 31-45)
 *
 * Converted to Mythrill item format:
 * - Action economy: every activation costs AP as an Action/Reaction, or is passive.
 * - Protection uses only canonical resistances
 *   (smashing/stabbing/slicing/ember/rime/storm/primal/arcane/blight/wyrd/
 *   sacred); there is no deflection stat in this system.
 * - Scalding/boiling maps to ember; gales and thunder maps to storm;
 *   poison and alchemical harm maps to blight.
 */

export const VESSEL_CURIOS = [
  {
    id: 'kettle-of-questionable-transmutation',
    name: 'Kettle of Questionable Transmutation',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'epic',
    description: 'Spend 2 AP as an Action to toss up to 100 kg of junk inside and shake. Roll 1d6: liquefied memories, clockwork chickens, a 5-course meal tasting of iron rations, a pet cube of slime, an exact temporary tool, or a concussive steam blast (2d6 ember damage in a 15-ft cone). Industrial alchemy crammed into grandma\'s copper cookware.',
    iconId: 'Misc/Profession Resources/Alchemy/Orange/orange-potion-bottle-bulbous-teardrop-gradient-red-orange-yellow-beige-glass-dark-stopper',
    value: { gold: 6, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      intelligence: { value: 1, isPercentage: false }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },
  {
    id: 'bag-of-mild-inconvenience',
    name: 'The Bag of Mild Inconvenience',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'uncommon',
    description: 'Functions as a bottomless storage sack, but retrieving anything requires 1d4 rounds of rummaging through lint, old receipts and mismatched socks. The void is infinite, but its filing system is non-existent.',
    iconId: 'Container/Bag/brown-backpack-simple',
    value: { gold: 0, silver: 8, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      spirit: { value: 1, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'flask-of-unwelcome-sobriety',
    name: 'The Flask of Unwelcome Sobriety',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'uncommon',
    description: 'Any alcoholic or poisoned beverage poured into this pewter flask purifies instantly into mountain spring water, while the flask loudly lectures the drinker on hydration and liver health. A maternal health lecture captured in polished pewter.',
    iconId: 'Misc/Profession Resources/Alchemy/Blue/blue-potion-bottle-classic-shape',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {},
    combatStats: {
      resistances: {
        blight: { value: 2, isPercentage: false }
      }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },
  {
    id: 'urn-of-echoing-insults',
    name: 'The Urn of Echoing Insults',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'Liquids stored here double in potency over 24 hours. Opening the lid makes the urn scream a blistering personal roast of whoever holds it, audible within 100 ft. Unrivaled brewing efficiency at the cost of your self-esteem.',
    iconId: 'Misc/Profession Resources/Alchemy/Red/red-potion-bottle-classic-squat-bulbous-rounded-body-narrower-neck-diagonal-bright-deep-red-liquid-two-thirds-light-beige-cream-glass-dark-brown-cylindrical-cork',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      charisma: { value: -1, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'infinite-lunchbox',
    name: 'The Infinite Lunchbox',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'uncommon',
    description: "Every dawn it produces a hearty fresh sandwich and a warm note of encouragement, always signed by your campaign's current main villain. Nutritious, supportive, and chillingly passive-aggressive.",
    iconId: 'Misc/Profession Resources/Cooking/Food/Other/bread-loaf-rustic-artisan-slashes',
    value: { gold: 0, silver: 8, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      constitution: { value: 1, isPercentage: false }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },
  {
    id: 'gourd-of-weathered-breath',
    name: 'The Gourd of Weathered Breath',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'Spend 2 AP as an Action to uncork a gale-force gust that snuffs wildfires, pushes boats and shoves creatures in a 30-ft cone. Your lungs fill with thick peppermint steam: you cannot cast spells with verbal components for 1 round. Sailing propulsion with painfully fresh breath.',
    iconId: 'Misc/Profession Resources/Alchemy/Blue/blue-potion-bottle-bulbous-bright-blue-glow',
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
          storm: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'pouch-of-literal-pennies',
    name: 'The Pouch of Literal Pennies',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'common',
    description: 'Any gemstone placed inside converts to its exact value in heavy copper pennies, and the pouch swells to the weight and volume of the resulting hoard. Great for exact change, terrible for back pain.',
    iconId: 'Container/Pouch/brown-backpack-satchel',
    value: { gold: 0, silver: 2, copper: 0 },
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
    id: 'goblet-of-accidental-clairvoyance',
    name: 'The Goblet of Accidental Clairvoyance',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'Spend 1 AP as an Action to drink wine from this goblet and receive a 100% accurate vision of the future, detailing the everyday life of a peasant 500 miles away. Omniscience without any practical application.',
    iconId: 'Misc/Profession Resources/Alchemy/Red/red-potion-bottle-bulbous-rounded-body-tapering-narrow-neck-light-beige-off-white-glass-subtle-shading-left-side-bright-fiery-red-liquid-two-thirds-yellow-pixel-highlight-surface-variations-shade-dark-stopper',
    value: { gold: 2, silver: 0, copper: 0 },
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
    id: 'decanter-of-infinite-clam-chowder',
    name: 'The Decanter of Infinite Clam Chowder',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'It obeys three commands. Cup or Gallon (1 AP as an Action): pours boiling chowder. Geyser (2 AP as an Action): a slick of scalding broth covers a 15-ft square as difficult terrain; creatures moving through it suffer 1d6 ember damage and may fall prone. Seafood supremacy in crowd control.',
    iconId: 'Misc/Profession Resources/Cooking/bowl-rustic-earthenware-beige-orange',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      constitution: { value: 1, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'jar-of-captured-sputter',
    name: 'The Jar of Captured Sputter',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'epic',
    description: 'Spend a Reaction (2 AP) to open the jar and trap a ranged spell projectile aimed at you. Spend 1 AP as an Action to reopen it: the spell erupts toward the nearest creature with a cartoonish squeaking noise. Deflecting death with high-pitched comedic relief.',
    iconId: 'Misc/Profession Resources/Alchemy/Empty/empty-potion-bottle-bulbous-light-beige-tilted-brown-stopper',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {},
    combatStats: {
      resistances: {
        arcane: { value: 2, isPercentage: false }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'sieve-of-unwanted-epiphanies',
    name: 'The Sieve of Unwanted Epiphanies',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'uncommon',
    description: 'Spend 10 minutes pouring dirt through the mesh to sift out gold flakes worth 1d6 silver. Each flake surfaces one embarrassing youth memory in vivid clarity. Wealth accumulation balanced by acute existential cringe.',
    iconId: 'Misc/Profession Resources/Tools/mortar-pestle-beige-reddish-brown',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {},
    durability: 'd6',
    maxDurability: 'd6'
  },
  {
    id: 'canteen-of-endless-lukewarm-tea',
    name: 'The Canteen of Endless Lukewarm Tea',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'common',
    description: 'Never empties of bland room-temperature chamomile. Spend 1 AP as an Action to drink: gain advantage against frightened for 10 minutes, but treat Initiative checks as rolled with disadvantage for 10 minutes. Calm nerves at the cost of battle urgency.',
    iconId: 'Misc/Profession Resources/Alchemy/Blue/blue-potion-bottle-classic-shape',
    value: { gold: 0, silver: 3, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {},
    durability: 'd6',
    maxDurability: 'd6'
  },
  {
    id: 'satchel-of-unexpected-tools',
    name: 'The Satchel of Unexpected Tools',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'Spend 1 AP as an Action to reach inside for a needed tool: it provides an item that fulfills the purpose through bizarre over-engineering (a pedal-powered lockpick, a siege-ladder toothpick). Rube Goldberg\'s personal utility belt.',
    iconId: 'Container/Bag/brown-satchel-scrolls-three',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      intelligence: { value: 1, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'barrel-of-instant-barricade',
    name: 'The Barrel of Instant Barricade',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'Spend 2 AP as an Action to tap the bung and deploy a sturdy 10-ft oak wall, complete with a functioning tavern tap dispensing mediocre cider to attackers. Defensive engineering with hospitality perks for invaders.',
    iconId: 'Container/Crate/crate-wooden-isometric-orange-glow',
    value: { gold: 3, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {},
    durability: 'd10',
    maxDurability: 'd10'
  },
  {
    id: 'cauldron-of-reverse-alchemy',
    name: 'The Cauldron of Reverse Alchemy',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'epic',
    description: 'Spend 10 minutes boiling magic potions inside to revert them to raw herbs and minerals, releasing dense hallucinogenic mist: animals within 30 ft speak fluent philosophy for 1 hour. Resource reclamation with an accidental Socratic animal seminar.',
    iconId: 'Misc/Profession Resources/Tools/mortar-pestle-beige-reddish-brown',
    value: { gold: 6, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {},
    combatStats: {
      resistances: {
        blight: { value: 2, isPercentage: false }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  }
];
