/**
 * Compendium of Aberrant Curios — VII. Reality-Bending Curios & Cosmic
 * Knick-Knacks (Items 86-100)
 *
 * Converted to Mythrill item format:
 * - Action economy: every activation costs AP as an Action/Reaction, or is passive.
 * - Protection uses only canonical resistances
 *   (smashing/stabbing/slicing/ember/rime/storm/primal/arcane/blight/wyrd/
 *   sacred); there is no deflection stat in this system.
 * - Falling damage maps to smashing; shattering thunder maps to storm;
 *   kinetic impact maps to smashing; courage/applause maps to Charisma.
 */

export const COSMIC_KNICKKNACKS = [
  {
    id: 'pocket-sundial-of-midnight',
    name: 'The Pocket Sundial of Midnight',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'legendary',
    description: 'Spend 2 AP as an Action to cast moonlight upon the dial and turn noon into pitch midnight across a 1-mile radius for 10 minutes. Nocturnal beasts awaken confused. Astronomical override using lunar pocket mechanics.',
    iconId: 'Currency/golden-orb-gem',
    value: { gold: 12, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      spirit: { value: 2, isPercentage: false }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },
  {
    id: 'metronome-of-sluggish-cadence',
    name: 'The Metronome of Sluggish Cadence',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'Spend 1 AP as an Action to set the beat: creatures within 30 ft must move and attack in time with the clicking pendulum or trip (attacks made out of rhythm are rolled with disadvantage). You must keep time too (-1 Agility while it ticks). Battle transformed into a strict metronomic waltz.',
    iconId: 'Misc/Books/book-brown-fire-symbol-runes',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      agility: { value: -1, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'compass-of-forgotten-paths',
    name: 'The Compass of Forgotten Paths',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'The needle never points north; it points directly at the nearest unlooted treasure chest, ignoring every wall and hazard along the way. Greed-oriented navigation with zero safety warnings.',
    iconId: 'Misc/Books/book-treasure-map-red-x-paths',
    value: { gold: 3, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      intelligence: { value: 1, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'chalk-of-impossible-portals',
    name: 'The Chalk of Impossible Portals',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'epic',
    description: 'Spend 2 AP as an Action to draw a doorway on any flat stone wall and open a passage 10 ft through it. Each use stains your hair bright cyan for 48 hours. Transit with cosmetic penalties.',
    iconId: 'Misc/Books/book-blank-sheet-paper-shadow',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      intelligence: { value: 1, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'looking-glass-of-the-other-guy',
    name: 'The Looking Glass of the Other Guy',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: "Spend 1 AP as an Action to view a battle from an adversary's first-person perspective: gain advantage on your next defensive Reaction against them. Empathy weaponized for counter-attacks.",
    iconId: 'Armor/Neck/layered-geometric-emblem-pendant',
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
    id: 'quota-bell-of-cosmic-clerk',
    name: 'The Quota Bell of the Cosmic Clerk',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'Spend 1 AP as an Action to ring the service bell: a desk appears with a bored spirit who stamps one bureaucratic permit, letting you bypass one dungeon trap without triggering it. Safety clearance issued by divine paperwork.',
    iconId: 'Currency/golden-orb-gem',
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
    id: 'hourglass-of-rushed-decisions',
    name: 'The Hourglass of Rushed Decisions',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'epic',
    description: 'Spend 1 AP as an Action to flip it (once per day): the party takes 3 consecutive actions in 1 round. Afterwards everyone spends the following round catching their breath (no Actions). Burst adrenaline backed by immediate aerobic collapse.',
    iconId: 'Misc/Books/book-scroll-parchment-rolled',
    value: { gold: 6, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {},
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'tuning-fork-of-resonance-shatter',
    name: 'The Tuning Fork of Resonance Shatter',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'Spend 1 AP as an Action to strike it on glass: every potion, window and spectacle within 40 ft shatters, and you sing in perfect pitch for the next 2 hours. Vitreous devastation paired with vocal perfection.',
    iconId: 'Misc/Profession Resources/Tools/sledgehammer',
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
    id: 'feather-of-defiant-buoyancy',
    name: 'The Feather of Defiant Buoyancy',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'uncommon',
    description: 'Hold this goose feather to fall at 1 ft per minute (resistance to smashing from falls). If the wind blows, you float sideways across the landscape like dandelion fluff. Absolute feather-fall at the mercy of light breezes.',
    iconId: 'Misc/Books/book-open-reddish-brown-pages',
    value: { gold: 0, silver: 8, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {},
    combatStats: {
      resistances: {
        smashing: { value: 2, isPercentage: false }
      }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },
  {
    id: 'mirror-of-unflattering-revelations',
    name: 'The Mirror of Unflattering Revelations',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'Spend 1 AP as an Action to hold it before a shapeshifter or disguised creature and reveal its true monstrous form, while it helpfully highlights your own split ends and poor posture (-1 Charisma while you carry it). True sight with an involuntary side of self-consciousness.',
    iconId: 'Armor/Neck/glowing-orb-pendant',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      intelligence: { value: 1, isPercentage: false },
      charisma: { value: -1, isPercentage: false }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },
  {
    id: 'key-to-nowhere-in-particular',
    name: 'The Key to Nowhere in Particular',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'epic',
    description: 'Spend 1 AP as an Action to insert it into any keyhole and turn: the door opens into a randomly selected coat closet somewhere on the continent. Turn it backwards to return. Intercontinental travel through wardrobe infrastructure.',
    iconId: 'Armor/Neck/ornate-key-pendant',
    value: { gold: 6, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {},
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'prism-of-mood-lighting',
    name: 'The Prism of Mood Lighting',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'Spend 1 AP as an Action to rotate sunlight into mood colors. Amber: allies within 30 ft gain courage (advantage against frightened). Magenta: enemies feel compelled to applaud your speeches. Atmospheric lighting that manipulates crowd behavior.',
    iconId: 'Currency/golden-orb-gem',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      charisma: { value: 2, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'candle-of-long-story',
    name: 'The Candle of the Long Story',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'epic',
    description: 'Spend 1 AP as an Action to light it: while it burns, anyone telling an anecdote cannot be interrupted by enemies or attacks, and combat resumes only when the storyteller finishes the tale. Invulnerability enforced by conversational decorum.',
    iconId: 'Misc/Books/book-brown-alchemy-flask-symbol',
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
    id: 'wax-seal-of-dubious-authority',
    name: 'The Wax Seal of Dubious Authority',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'Spend 1 AP as an Action to stamp any document: it appears signed by the supreme deity of paperwork, and town authorities treat suspicion toward you as nearly nonexistent. Divine red tape that overrides mortal checkpoint guards.',
    iconId: 'Misc/Books/book-scroll-rolled-red-wax-seal',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      charisma: { value: 2, isPercentage: false }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'paradox-marble',
    name: 'The Paradox Marble',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'artifact',
    description: 'A glass marble containing a tiny duplicate of your current party. Spend 2 AP as an Action to flick it: a boulder drops onto a target within 60 ft for 4d6 smashing damage, and your party suffers minor dizziness (attacks rolled with disadvantage until your next turn). The universe folding in on itself for kinetic leverage.',
    iconId: 'Currency/golden-orb-gem',
    value: { gold: 25, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {},
    durability: 'd10',
    maxDurability: 'd10'
  }
];
