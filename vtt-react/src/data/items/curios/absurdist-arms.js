/**
 * Compendium of Aberrant Curios — V. Absurdist Weapons, Implements & Tools
 * (Items 61-75)
 *
 * Converted to Mythrill item format:
 * - Action economy: every activation costs AP as an Action/Reaction, or is passive.
 * - Damage uses canonical types only: smashing (blunt/concussive), stabbing
 *   (piercing), slicing (cutting), ember (fire/heat), storm (sonic/thunder),
 *   blight (smoke/choking), arcane (pure magic), wyrd (psychic/rumor).
 * - Weapon slots follow library convention: ONE_HANDED with hand MAIN_HAND,
 *   TWO_HANDED with hand TWO_HAND, RANGED with the ranged slot.
 */

export const ABSURDIST_ARMS = [
  {
    id: 'apologetic-halberd',
    name: 'The Apologetic Halberd',
    type: 'weapon',
    subtype: 'HALBERD',
    quality: 'rare',
    description: 'Critical hits deal double damage dice. Every strike makes the blade shout sincere apologies at the victim ("I am so sorry, that looks painful!"). Deadly martial prowess with impeccable manners.',
    iconId: 'Weapons/Halberd/halberd-axe-blade-spike-hammer-rear',
    value: { gold: 3, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd10',
        damageType: 'slicing',
        bonusDamage: 1
      }
    },
    baseStats: {
      strength: { value: 1, isPercentage: false },
      charisma: { value: 1, isPercentage: false }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },
  {
    id: 'boomerang-of-questionable-return',
    name: 'The Boomerang of Questionable Return',
    type: 'weapon',
    subtype: 'BOOMERANG',
    quality: 'rare',
    description: 'Always returns to your hand on a hit. On a miss it brings back a completely unrelated random object from somewhere in the dungeon instead. Poor projectile accuracy; outstanding random scavenger drive.',
    iconId: 'Weapons/Boomerang/boomerang-brown-tapered-tip',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'smashing',
        bonusDamage: 1
      }
    },
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'dagger-of-constructive-feedback',
    name: 'The Dagger of Constructive Feedback',
    type: 'weapon',
    subtype: 'DAGGER',
    quality: 'uncommon',
    description: 'Spend 1 AP as an Action to stab an ally for 1 stabbing damage: the shock, plus your unsparing analysis of their combat stance, ends paralysis, stun or fear affecting them. Acupuncture delivered with tough love.',
    iconId: 'Weapons/Throwing Knife/throwing-knife-dagger-beige-blade-brown-handle-wrapped',
    value: { gold: 0, silver: 8, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'stabbing',
        bonusDamage: 1
      }
    },
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },
  {
    id: 'flail-of-centrifugal-dread',
    name: 'The Flail of Centrifugal Dread',
    type: 'weapon',
    subtype: 'FLAIL',
    quality: 'rare',
    description: 'Whirling it as you fight turns aside projectiles (resistance to stabbing), but the handle spins you like a top: pass an Agility check each round or spend it dizzy, rolling attacks with disadvantage. Helicopter defense with inevitable nausea.',
    iconId: 'Weapons/Flail/flail-brown-handle-chain-spiked-balls',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'smashing',
        bonusDamage: 1
      }
    },
    baseStats: {
      agility: { value: -1, isPercentage: false }
    },
    combatStats: {
      resistances: {
        stabbing: { value: 3, isPercentage: false }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'bow-of-delayed-gratification',
    name: 'The Bow of Delayed Gratification',
    type: 'weapon',
    subtype: 'BOW',
    quality: 'epic',
    description: 'Arrows freeze motionless in mid-air upon firing, then resume at the start of your next turn at double speed for double damage dice. Patience turns stray shafts into ballistic railgun rounds.',
    iconId: 'Weapons/Bows/bow-simple-brown-wrapped-grip',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 3,
    rotation: 0,
    slots: ['ranged'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'stabbing',
        bonusDamage: 2
      }
    },
    baseStats: {
      agility: { value: 1, isPercentage: false }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },
  {
    id: 'blunderbuss-of-second-hand-smoke',
    name: 'The Blunderbuss of Second Hand Smoke',
    type: 'weapon',
    subtype: 'BLOWGUN',
    quality: 'rare',
    description: 'Fires dense clouds of purple fog in a 15-ft cone that obscure vision and set victims coughing; the barrel forever smells of burned toast. Smoke-screen defense accompanied by breakfast confusion.',
    iconId: 'Weapons/Blowgun/blowgun-wooden-stick-simple',
    value: { gold: 3, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['ranged'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'blight',
        bonusDamage: 1
      }
    },
    baseStats: {
      constitution: { value: -1, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'warhammer-of-structural-critique',
    name: 'The Warhammer of Structural Critique',
    type: 'weapon',
    subtype: 'MAUL',
    quality: 'rare',
    description: 'Deals triple damage dice against doors, walls and fortifications, and upon striking stone proclaims the year of construction and every masonry flaw. Demolition tool with a master\'s degree in civil engineering.',
    iconId: 'Weapons/Warhammer/warhammer-brown-tan-striking-face-beige-arrow-indicator',
    value: { gold: 3, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd4',
        damageType: 'smashing',
        bonusDamage: 2
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },
  {
    id: 'sword-in-the-sconce',
    name: 'The Sword in the Sconce',
    type: 'weapon',
    subtype: 'SWORD',
    quality: 'rare',
    description: 'A longsword permanently sheathed in a heavy cast-iron wall-torch sconce. Strikes ignite targets (1d4 ember damage for 2 rounds) and shed warm candlelight. Why unsheathe a blade when the scabbard is already burning?',
    iconId: 'Weapons/Swords/sword-fire-glowing-red-blade-golden-guard',
    value: { gold: 3, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'slicing',
        bonusDamage: 1
      }
    },
    baseStats: {},
    combatStats: {
      spellDamage: {
        types: {
          ember: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'crossbow-of-pointless-parley',
    name: 'The Crossbow of Pointless Parley',
    type: 'weapon',
    subtype: 'CROSSBOW',
    quality: 'uncommon',
    description: "Bolts transform mid-flight into rolled-up parchment tea invitations tucked directly into the target's armor creases. Diplomatic correspondence launched at 300 feet per second.",
    iconId: 'Weapons/Crossbow/crossbow-reddish-brown-loaded',
    value: { gold: 1, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 1,
    rotation: 0,
    slots: ['ranged'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'stabbing',
        bonusDamage: 0
      }
    },
    baseStats: {
      charisma: { value: 1, isPercentage: false }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },
  {
    id: 'shield-of-aggressive-reflection',
    name: 'The Shield of Aggressive Reflection',
    type: 'armor',
    subtype: 'SHIELD',
    quality: 'epic',
    description: "Spend a Reaction (2 AP) when targeted by a spell to block it and redirect it back at the caster, while the shield loudly insults the caster's posture mid-flight. Mirror defense that provides vocal spell feedback.",
    iconId: 'Weapons/Shields/shield-heater-wooden-brown-worn-cracks-beige-boss',
    value: { gold: 6, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['offHand'],
    baseStats: {},
    combatStats: {
      resistances: {
        arcane: { value: 4, isPercentage: false },
        smashing: { value: 2, isPercentage: false },
        stabbing: { value: 2, isPercentage: false },
        slicing: { value: 2, isPercentage: false }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },
  {
    id: 'wand-of-deflating-ego',
    name: 'The Wand of Deflating Ego',
    type: 'weapon',
    subtype: 'WAND',
    quality: 'rare',
    description: 'Spend 1 AP as an Action to zap a target within 30 ft: it visibly shrinks 1 ft in height and speaks in a high-pitched squeak for 1 hour, rolling Intimidation checks with disadvantage. Miniaturization through vocal pitch alteration.',
    iconId: 'Weapons/Wand/wand-wooden-dark-brown-segmented',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['ranged'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'arcane',
        bonusDamage: 0
      }
    },
    baseStats: {
      intelligence: { value: 1, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'staff-of-weather-forecaster',
    name: 'The Staff of the Weather Forecaster',
    type: 'weapon',
    subtype: 'STAFF',
    quality: 'uncommon',
    description: 'Predicts the weather 24 hours in advance with perfect accuracy. Tapping it (1 AP as an Action) summons a 3-ft localized raincloud that follows you, even indoors. Accurate meteorological analysis with personal humidity.',
    iconId: 'Weapons/Staff/staff-wooden-curved-head-bone-tip-red-orange-details',
    value: { gold: 0, silver: 8, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'smashing',
        bonusDamage: 0
      }
    },
    baseStats: {
      spirit: { value: 1, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'morningstar-of-gentle-awakenings',
    name: 'The Morningstar of Gentle Awakenings',
    type: 'weapon',
    subtype: 'MACE',
    quality: 'rare',
    description: 'Striking a sleeping creature wakes it instantly, restores it to full health and high alertness, and convinces it that it is dawn regardless of the hour. A concussive alarm clock that mends bone and muscle.',
    iconId: 'Weapons/Mace/mace-spiked-club-brown-tan-rustic',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'smashing',
        bonusDamage: 1
      }
    },
    baseStats: {
      spirit: { value: 1, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'pike-of-distant-social-distancing',
    name: 'The Pike of Distant Social Distancing',
    type: 'weapon',
    subtype: 'POLEARM',
    quality: 'rare',
    description: 'Adjustable reach from 10 ft up to 50 ft (declare reach before attacking). At maximum reach the shaft flexes like cooked spaghetti and attacks are rolled with disadvantage. Extreme martial range with noodle physics.',
    iconId: 'Weapons/Polearm/polearm-spear-staff-brown-wrapped-light-tip',
    value: { gold: 3, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'stabbing',
        bonusDamage: 1
      }
    },
    baseStats: {
      strength: { value: 1, isPercentage: false }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },
  {
    id: 'slingshot-of-unjustified-paranoia',
    name: 'The Slingshot of Unjustified Paranoia',
    type: 'weapon',
    subtype: 'SLING',
    quality: 'uncommon',
    description: 'Struck targets hear whispered rumors that their nearest comrade stole their coin pouch (their next social check involving allies is rolled with disadvantage). Inciting friendly-fire mutiny one pebble at a time.',
    iconId: 'Weapons/Sling/sling-ampersand-symbol-fire-orange-red-striped',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['ranged'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'smashing',
        bonusDamage: 0
      }
    },
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
  }
];
