/**
 * Compendium of Aberrant Curios — VI. Organic, Edible & Living Anomalies
 * (Items 76-85)
 *
 * Converted to Mythrill item format:
 * - Action economy: every activation costs AP as an Action/Reaction, or is passive.
 * - Eaten curios are consumables (FOOD/POTION) with durations in the proven
 *   baseStats/combatStats + utilityStats.duration pattern; persistent living
 *   tools are accessory/TRINKET curios.
 * - Spell-slot recovery maps to mana restoration; fear/charm immunity maps to
 *   Spirit plus prose; siege/impact damage maps to smashing.
 */

export const LIVING_ANOMALIES = [
  {
    id: 'sentient-sourdough-starter',
    name: 'The Sentient Sourdough Starter',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'Feed it flour daily and it hums softly. Spend 1 AP as an Action to slap a glob onto a wooden lock: by morning the lock dissolves, smelling faintly of warm brioche. Baking yeast with architectural digestive power.',
    iconId: 'Misc/Profession Resources/Cooking/Food/Other/bread-loaf-rustic-artisan-slashes',
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
    id: 'turnip-of-inconvenient-immortality',
    name: 'The Turnip of Inconvenient Immortality',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'legendary',
    description: 'While this raw turnip rides in your pocket, wounds cannot kill you: damage that would fell you drops you to 1 health instead. It constantly reeks of boiled root vegetables (-2 Charisma). Life preservation powered by aggressive cellar aromas.',
    iconId: 'Misc/Profession Resources/Cooking/Food/Other/bread-loaf-sliced-blocky',
    value: { gold: 12, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      charisma: { value: -2, isPercentage: false }
    },
    combatStats: {
      maxHealth: { value: 10, isPercentage: false }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },
  {
    id: 'apple-of-disgruntled-wisdom',
    name: 'The Apple of Disgruntled Wisdom',
    type: 'consumable',
    subtype: 'FOOD',
    quality: 'rare',
    description: 'Spend 1 AP as an Action to take a bite and learn the answer to one cosmic query, while the apple sighs deeply about your dental hygiene. Edenic enlightenment paired with dental criticism.',
    iconId: 'Misc/Profession Resources/Cooking/Food/Other/bread-loaf-rustic-artisan-slashes',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: true,
    maxStackSize: 3,
    width: 1,
    height: 1,
    rotation: 0,
    baseStats: {
      intelligence: { value: 2, isPercentage: false, duration: 600 }
    },
    utilityStats: {
      duration: { type: 'MINUTES', value: 10 }
    }
  },
  {
    id: 'moss-of-restless-slumber',
    name: 'The Moss of Restless Slumber',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: "Sleeping on this patch restores your mana as a full night's rest in just 2 hours, but fills your dreams with life as a turn-of-the-century grain miller. Rapid mana replenishment with vocational dreams.",
    iconId: 'Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-bottle-classic-shape-beige-third-full',
    value: { gold: 3, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
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
    id: 'cheese-wheel-of-momentum',
    name: 'The Cheese Wheel of Momentum',
    type: 'consumable',
    subtype: 'FOOD',
    quality: 'rare',
    description: 'Roll it downhill (1 AP as an Action) and it swells to boulder size, flattening obstacles for 3d6 smashing damage. Eat a slice (1 AP as an Action) to restore 20 health, then take a 1-hour digestive nap (-2 Agility for 1 hour). Gouda siege equipment with an intense food-coma penalty.',
    iconId: 'Misc/Profession Resources/Cooking/Food/Other/bread-loaf-rustic-artisan-slashes',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    combatStats: {
      healthRestore: { value: 20, isPercentage: false }
    },
    baseStats: {
      agility: { value: -2, isPercentage: false, duration: 3600 }
    },
    utilityStats: {
      duration: { type: 'MINUTES', value: 60 }
    }
  },
  {
    id: 'pickled-eye-of-hindsight',
    name: 'The Pickled Eye of Hindsight',
    type: 'consumable',
    subtype: 'FOOD',
    quality: 'epic',
    description: 'Spend 1 AP as an Action to swallow it whole and mentally rerun the last combat round, learning exactly which actions failed (ask the GM three yes-or-no questions about the round). Regurgitate it to reset it for tomorrow. Tactical review through a deeply unsettling digestive loop.',
    iconId: 'Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-bottle-classic-shape-beige-third-full',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    baseStats: {
      intelligence: { value: 2, isPercentage: false, duration: 600 }
    },
    utilityStats: {
      duration: { type: 'MINUTES', value: 10 }
    }
  },
  {
    id: 'singing-mandrake-of-insomnia',
    name: 'The Singing Mandrake of Insomnia',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'Uprooted, it does not kill: it sings 1920s jazz standards. Creatures within 30 ft cannot sleep, gaining protection against psychic nightmare intrusions (resistance to wyrd). Root-vegetable cabaret defense against dark sorcery.',
    iconId: 'Misc/Books/book-brown-green-rune-bookmark',
    value: { gold: 3, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {},
    combatStats: {
      resistances: {
        wyrd: { value: 4, isPercentage: false }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'jerky-of-indomitable-will',
    name: 'The Jerky of Indomitable Will',
    type: 'consumable',
    subtype: 'FOOD',
    quality: 'uncommon',
    description: 'Chewing one piece for 4 continuous hours grants immunity to fear and charm while you chew (+2 Spirit for 4 hours); speaking intelligibly mid-chew requires passing a Charisma check. Courage made of tough hickory-smoked gristle.',
    iconId: 'Misc/Profession Resources/Cooking/animal-meat-raw-cut-rib-leg-orange-beige',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 1,
    rotation: 0,
    combatStats: {
      conditionModifiers: {
        frightened: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by this condition',
          color: '#4caf50'
        },
        charmed: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by this condition',
          color: '#4caf50'
        }
      }
    },
    baseStats: {
      spirit: { value: 2, isPercentage: false, duration: 14400 }
    },
    utilityStats: {
      duration: { type: 'MINUTES', value: 240 }
    }
  },
  {
    id: 'mushroom-of-instant-enclosure',
    name: 'The Mushroom of Instant Enclosure',
    type: 'consumable',
    subtype: 'FOOD',
    quality: 'uncommon',
    description: 'Spend 1 AP as an Action to stomp it and sprout a 10-ft domed fungal hut that repels beasts for 8 hours (+1 Constitution while sheltered). The inside smells overwhelmingly of damp truffle butter. Instant survival shelter for high-class culinary palates.',
    iconId: 'Misc/Profession Resources/Cooking/bowl-rustic-earthenware-beige-orange',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: true,
    maxStackSize: 3,
    width: 1,
    height: 1,
    rotation: 0,
    baseStats: {
      constitution: { value: 1, isPercentage: false, duration: 28800 }
    },
    utilityStats: {
      duration: { type: 'MINUTES', value: 480 }
    }
  },
  {
    id: 'leech-of-generous-transfusion',
    name: 'The Leech of Generous Transfusion',
    type: 'consumable',
    subtype: 'BANDAGE',
    quality: 'rare',
    description: 'Spend 1 AP as an Action to attach it to a willing ally: it drains 10 health, then transfers 20 temporary health and an adrenaline surge to another comrade within 30 ft. Parasitic teamwork that redistributes vitality.',
    iconId: 'Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-bottle-classic-shape-beige-third-full',
    value: { gold: 1, silver: 0, copper: 0 },
    stackable: true,
    maxStackSize: 3,
    width: 1,
    height: 1,
    rotation: 0
  }
];
