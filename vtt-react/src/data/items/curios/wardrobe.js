/**
 * Compendium of Aberrant Curios — IV. Apparel, Trinkets & Oddly Specific
 * Wardrobe (Items 46-60)
 *
 * Converted to Mythrill item format:
 * - Action economy: every activation costs AP as an Action/Reaction, or is passive.
 * - Protection uses only canonical resistances
 *   (smashing/stabbing/slicing/ember/rime/storm/primal/arcane/blight/wyrd/
 *   sacred); there is no deflection stat in this system. Cold immunity maps
 *   to rime resistance plus immunity to frozen; mind-control maps to wyrd.
 * - Wearables use their natural slots (armor-type items) or trinket/neck/finger/back
 *   (accessories).
 */

export const WARDROBE_CURIOS = [
  {
    id: 'cloak-of-inappropriate-billowing',
    name: 'The Cloak of Inappropriate Billowing',
    type: 'accessory',
    subtype: 'CLOAK',
    quality: 'rare',
    description: 'The cloak billows majestically even in dead calms and broom closets, turning aside bolts and stones (resistance to stabbing). It rustles loudly: sneaking checks are rolled with disadvantage. Protagonist wind follows you indoors.',
    iconId: 'Armor/Cloak/cloak-simple-brown-cape',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['back'],
    baseStats: {},
    combatStats: {
      resistances: {
        stabbing: { value: 5, isPercentage: false }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'boots-of-reluctant-tap-dancer',
    name: 'Boots of the Reluctant Tap-Dancer',
    type: 'armor',
    subtype: 'LEATHER',
    quality: 'epic',
    description: 'Triple your jump distance and run along walls (movement speed +15). Every landing rings with crisp tap-dance clicks echoing through dungeons: sneaking checks are rolled with disadvantage. Acrobatic excellence paired with Broadway rhythm.',
    iconId: 'Armor/Feet/feet-brown-laced-boot',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['feet'],
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    utilityStats: {
      movementSpeed: { value: 15, isPercentage: false }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },
  {
    id: 'spectacles-of-cynical-appraisals',
    name: 'Spectacles of Cynical Appraisals',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'Spend 1 AP as an Action to study an object and learn its exact market value and magical nature, while a snobbish curator-voice whispers scathing critiques of its craftsmanship into your mind. Item identification delivered by a snobbish art curator.',
    iconId: 'Armor/Neck/glowing-orb-pendant',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      intelligence: { value: 2, isPercentage: false },
      charisma: { value: -1, isPercentage: false }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },
  {
    id: 'hat-of-modest-intellectual-superiority',
    name: 'The Hat of Modest Intellectual Superiority',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'uncommon',
    description: "Treat Intelligence checks about history or the arcane as rolled with advantage. You must begin every sentence with 'Well, actually...'. Arcane erudition wrapped in pedantic insufferability.",
    iconId: 'Armor/Head/head-brown-fedora-hat',
    value: { gold: 0, silver: 8, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['head'],
    baseStats: {
      intelligence: { value: 2, isPercentage: false },
      charisma: { value: -2, isPercentage: false }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },
  {
    id: 'belt-of-overfed-ogre',
    name: 'Belt of the Overfed Ogre',
    type: 'armor',
    subtype: 'LEATHER',
    quality: 'rare',
    description: 'Carry capacity and shove distance increase tenfold (+3 Strength). The belt tightens painfully whenever fresh bakery goods are near (-1 Constitution while the scent lingers, and you always know when they are near). Superhuman brawn constrained by pastry cravings.',
    iconId: 'Armor/Waist/brown-leather-belt',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 1,
    rotation: 0,
    slots: ['waist'],
    baseStats: {
      strength: { value: 3, isPercentage: false },
      constitution: { value: -1, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'gloves-of-butterfingered-pickpocket',
    name: 'Gloves of the Butterfingered Pickpocket',
    type: 'armor',
    subtype: 'LEATHER',
    quality: 'rare',
    description: "Spend 1 AP as an Action to plant an item in another person's pocket with perfect stealth. Attempting to actually steal anything makes you drop your own keys instead. Perfect for frame jobs, hopeless for petty theft.",
    iconId: 'Armor/Hands/hands-orange-cream-banded-glove',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 1,
    rotation: 0,
    slots: ['hands'],
    baseStats: {
      agility: { value: 2, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'monocle-of-false-motives',
    name: 'The Monocle of False Motives',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'Spend 1 AP as an Action to study a creature and see floating subtitles of its thoughts, automatically translated into bizarre villainous conspiracy theories whenever anyone is merely kind. Mind-reading filtered through hyper-paranoia.',
    iconId: 'Armor/Neck/layered-geometric-emblem-pendant',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      intelligence: { value: 1, isPercentage: false },
      spirit: { value: -1, isPercentage: false }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },
  {
    id: 'scarf-of-thermal-obstinacy',
    name: 'The Scarf of Thermal Obstinacy',
    type: 'accessory',
    subtype: 'NECKLACE',
    quality: 'rare',
    description: 'Total immunity to freezing cold and blizzard winds (resistance to rime, immune to frozen). In sweltering heat it refuses to be unbuttoned and sweats profusely, and no relief exists. Arctic perfection with an uncomfortable summer cling.',
    iconId: 'Armor/Neck/teal-crystal-pendant',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['neck'],
    baseStats: {},
    combatStats: {
      resistances: {
        rime: { value: 6, isPercentage: false }
      },
      conditionModifiers: {
        frozen: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by this condition',
          color: '#4caf50'
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'ring-of-dramatic-gasping',
    name: 'Ring of Dramatic Gasping',
    type: 'accessory',
    subtype: 'RING',
    quality: 'epic',
    description: 'Once per combat, when damage would fell you, drop to 1 health instead and loose an operatic gasp that stuns your attacker for 1 turn. Defying death through theatrical drama.',
    iconId: 'Armor/Finger/finger-red-gem-golden-ring',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['finger'],
    baseStats: {},
    combatStats: {
      maxHealth: { value: 5, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'pants-of-quick-escape',
    name: 'Pants of the Quick Escape',
    type: 'armor',
    subtype: 'LEATHER',
    quality: 'uncommon',
    description: 'While fleeing danger your sprint speed doubles (movement speed +10). Turn back to fight and the knees lock until combat ends. Legwear committed entirely to self-preservation.',
    iconId: 'Armor/Leggings/leggings-brown-waistband-pants',
    value: { gold: 0, silver: 8, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['legs'],
    baseStats: {},
    utilityStats: {
      movementSpeed: { value: 10, isPercentage: false }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },
  {
    id: 'slippers-of-stealthy-flatulence',
    name: 'The Slippers of Stealthy Flatulence',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'uncommon',
    description: 'Your footsteps make no sound (sneaking checks on foot gain advantage). Every 50 steps, a silent sulphurous puff betrays your atmosphere if not your feet. No sound footprint, but a notable atmospheric one.',
    iconId: 'Armor/Feet/feet-brown-laced-boot',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['feet'],
    baseStats: {
      agility: { value: 2, isPercentage: false }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },
  {
    id: 'cravat-of-dignified-retreat',
    name: 'The Cravat of Dignified Retreat',
    type: 'accessory',
    subtype: 'NECKLACE',
    quality: 'rare',
    description: 'Spend a Reaction (1 AP) when disengaging to look like an aristocrat out for a stroll: enemies cannot make Reaction attacks against you until the start of your next turn. Tactical withdrawal disguised as upper-class nonchalance.',
    iconId: 'Armor/Neck/archery-pendant',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['neck'],
    baseStats: {
      charisma: { value: 2, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'amulet-of-mutual-confusion',
    name: 'The Amulet of Mutual Confusion',
    type: 'accessory',
    subtype: 'AMULET',
    quality: 'rare',
    description: 'When an enemy targets you with mind-control, spend a Reaction (1 AP): both you and the caster forget who cast what and must spend 1 round discussing the weather instead. Psychic warfare neutralized by shared bewilderment.',
    iconId: 'Armor/Neck/fiery-orb-amulet',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['neck'],
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
    id: 'pauldrons-of-unearned-confidence',
    name: 'The Pauldrons of Unearned Confidence',
    type: 'armor',
    subtype: 'MAIL',
    quality: 'rare',
    description: 'Declaring your plan aloud before rolling grants +10 maximum health until the plan resolves. If the plan fails, suffer 1 wyrd damage from bruised ego. Armor forged from sheer bravado.',
    iconId: 'Armor/Shoulder/shoulder-pauldron-rustic-leather-brown-tan-jagged-layered',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['shoulders'],
    baseStats: {},
    combatStats: {
      maxHealth: { value: 10, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'tiara-of-passive-resistance',
    name: 'The Tiara of Passive Resistance',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'epic',
    description: 'Sit cross-legged on the ground and refuse to move (no Actions or movement) to gain deep resistance to arcane and wyrd forces. An immovable, meditative protest against boss mechanics.',
    iconId: 'Armor/Head/head-beige-fedora-hat',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['head'],
    baseStats: {},
    combatStats: {
      resistances: {
        arcane: { value: 6, isPercentage: false },
        wyrd: { value: 6, isPercentage: false }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  }
];
