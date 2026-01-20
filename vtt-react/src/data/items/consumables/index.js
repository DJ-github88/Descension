/**
 * Consumables - All consumable items
 * 
 * Starter consumables with Dark Souls-esque philosophy:
 * - Potions, elixirs, food, and scrolls
 * - Tradeoffs and meaningful choices
 * - Some have negative effects or drawbacks
 * - Dark, soulful names
 */

export const CONSUMABLES = [
  // === HEALING POTIONS ===
  {
    id: 'crimson-tears',
    name: 'Crimson Tears',
    type: 'consumable',
    subtype: 'POTION',
    quality: 'poor',
    description: 'A weak healing potion that tastes of salt and sorrow. Restores health, but leaves you feeling hollow.',
    iconId: 'Misc/Profession Resources/Alchemy/Red/red-potion-bottle-classic-squat-bulbous-rounded-body-narrower-neck-diagonal-bright-deep-red-liquid-two-thirds-light-beige-cream-glass-dark-brown-cylindrical-cork',
    value: { gold: 0, silver: 2, copper: 0 },
    stackable: true,
    maxStackSize: 10,
    width: 1,
    height: 1,
    rotation: 0,
    combatStats: {
      healthRestore: { value: 15, isPercentage: false }
    },
    baseStats: {
      spirit: { value: -1, isPercentage: false, duration: 120 } // 2 minutes - Temporary spiritual drain
    },
    utilityStats: {
      duration: { type: 'MINUTES', value: 2 } // 2 minutes
    }
  },
  {
    id: 'blood-remembrance',
    name: 'Blood Remembrance',
    type: 'consumable',
    subtype: 'POTION',
    quality: 'common',
    description: 'A potent healing draught that burns going down. Restores significant health, but the pain lingers.',
    iconId: 'Misc/Profession Resources/Alchemy/Red/red-potion-bottle-bulbous-rounded-body-tapering-narrow-neck-light-beige-off-white-glass-subtle-shading-left-side-bright-fiery-red-liquid-two-thirds-yellow-pixel-highlight-surface-variations-shade-dark-stopper',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: true,
    maxStackSize: 10,
    width: 1,
    height: 1,
    rotation: 0,
    combatStats: {
      healthRestore: { value: 35, isPercentage: false }
    },
    baseStats: {
      constitution: { value: -1, isPercentage: false, duration: 90 } // 1.5 minutes - Temporary weakness after healing
    },
    utilityStats: {
      duration: { type: 'MINUTES', value: 1.5 } // 1.5 minutes
    }
  },
  {
    id: 'desperate-draught',
    name: 'Desperate Draught',
    type: 'consumable',
    subtype: 'POTION',
    quality: 'common',
    description: 'A hastily brewed potion that heals quickly but leaves you vulnerable. Use only when death is certain.',
    iconId: 'Misc/Profession Resources/Alchemy/Red/red-potion-angular-flask-base',
    value: { gold: 0, silver: 4, copper: 0 },
    stackable: true,
    maxStackSize: 10,
    width: 1,
    height: 1,
    rotation: 0,
    combatStats: {
      healthRestore: { value: 50, isPercentage: false }
    },
    baseStats: {
      agility: { value: -2, isPercentage: false, duration: 180 }, // 3 minutes - Slows you down
      constitution: { value: -1, isPercentage: false, duration: 180 } // Makes you vulnerable
    },
    utilityStats: {
      duration: { type: 'MINUTES', value: 3 } // 3 minutes
    }
  },

  // === MANA/SPIRIT POTIONS ===
  {
    id: 'azure-sorrow',
    name: 'Azure Sorrow',
    type: 'consumable',
    subtype: 'ELIXIR',
    quality: 'poor',
    description: 'A weak mana elixir that tastes of forgotten dreams. Restores magic, but drains your vitality.',
    iconId: 'Misc/Profession Resources/Alchemy/Blue/blue-potion-bottle-classic-shape',
    value: { gold: 0, silver: 2, copper: 0 },
    stackable: true,
    maxStackSize: 10,
    width: 1,
    height: 1,
    rotation: 0,
    combatStats: {
      manaRestore: { value: 20, isPercentage: false }
    },
    baseStats: {
      constitution: { value: -1, isPercentage: false, duration: 150 } // 2.5 minutes - Drains vitality
    },
    utilityStats: {
      duration: { type: 'MINUTES', value: 2.5 } // 2.5 minutes
    }
  },
  {
    id: 'spirit-whisper',
    name: 'Spirit Whisper',
    type: 'consumable',
    subtype: 'ELIXIR',
    quality: 'common',
    description: 'An elixir that restores magical energy. The voices of the dead seem to whisper as you drink.',
    iconId: 'Misc/Profession Resources/Alchemy/Blue/blue-potion-bottle-bulbous-bright-blue-glow',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: true,
    maxStackSize: 10,
    width: 1,
    height: 1,
    rotation: 0,
    combatStats: {
      manaRestore: { value: 40, isPercentage: false }
    },
    baseStats: {
      spirit: { value: -1, isPercentage: false, duration: 240 } // 4 minutes - Disturbs the spirit
    },
    utilityStats: {
      duration: { type: 'MINUTES', value: 4 } // 4 minutes
    }
  },
  {
    id: 'madness-brew',
    name: 'Madness Brew',
    type: 'consumable',
    subtype: 'ELIXIR',
    quality: 'common',
    description: 'A potent elixir that floods your mind with power. Restores much mana, but clouds your thoughts.',
    iconId: 'Misc/Profession Resources/Alchemy/Blue/teal-potion-magical',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: true,
    maxStackSize: 10,
    width: 1,
    height: 1,
    rotation: 0,
    combatStats: {
      manaRestore: { value: 60, isPercentage: false }
    },
    baseStats: {
      intelligence: { value: -2, isPercentage: false, duration: 300 }, // 5 minutes - Clouds the mind
      spirit: { value: -1, isPercentage: false, duration: 300 }
    },
    utilityStats: {
      duration: { type: 'MINUTES', value: 5 } // 5 minutes
    }
  },

  // === BUFF POTIONS ===
  {
    id: 'strength-of-sorrow',
    name: 'Strength of Sorrow',
    type: 'consumable',
    subtype: 'POTION',
    quality: 'common',
    description: 'A bitter potion that grants physical power. The strength comes from pain, and the pain lingers.',
    iconId: 'Misc/Profession Resources/Alchemy/Red/red-potion-bottle-organic-demonic-teardrop-wider-bottom-tapering-top-two-curved-horn-like-claw-like-protrusions-lower-mid-section-deep-rich-red-liquid-brighter-orange-yellow-orange-hues-bright-orange-glow-outline-light-beige-cork',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 1,
    rotation: 0,
    baseStats: {
      strength: { value: 3, isPercentage: false, duration: 600 }, // 10 minutes
      constitution: { value: -1, isPercentage: false, duration: 600 } // Strains the body
    },
    combatStats: {
      maxHealth: { value: 10, isPercentage: false, duration: 600 } // 10 minutes
    },
    utilityStats: {
      duration: { type: 'MINUTES', value: 10 } // 10 minutes
    }
  },
  {
    id: 'hastening-regret',
    name: 'Hastening Regret',
    type: 'consumable',
    subtype: 'ELIXIR',
    quality: 'common',
    description: 'An elixir that quickens your movements. Speed comes at the cost of stamina, leaving you breathless.',
    iconId: 'Misc/Profession Resources/Alchemy/Blue/blue-potion-bottle-diagonal-tilted',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 1,
    rotation: 0,
    baseStats: {
      agility: { value: 3, isPercentage: false, duration: 180 }, // 3 minutes
      constitution: { value: -2, isPercentage: false, duration: 180 } // Drains stamina
    },
    utilityStats: {
      movementSpeed: { value: 15, isPercentage: false, duration: 180 },
      duration: { type: 'MINUTES', value: 3 } // 3 minutes
    },
    combatStats: {
      maxHealth: { value: -5, isPercentage: false, duration: 180 } // 3 minutes
    }
  },
  {
    id: 'mind-fog',
    name: 'Mind Fog',
    type: 'consumable',
    subtype: 'ELIXIR',
    quality: 'common',
    description: 'A cloudy elixir that enhances magic. The power is real, but clarity is lost in the fog.',
    iconId: 'Misc/Profession Resources/Alchemy/Blue/teal-potion-bubbles',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 1,
    rotation: 0,
    baseStats: {
      intelligence: { value: 3, isPercentage: false, duration: 450 }, // 7.5 minutes
      spirit: { value: -2, isPercentage: false, duration: 450 } // Mental fog
    },
    combatStats: {
      spellDamage: {
        types: {
          arcane: { value: 5, isPercentage: false, duration: 450 }
        }
      }
    },
    utilityStats: {
      duration: { type: 'MINUTES', value: 7.5 } // 7.5 minutes
    }
  },
  {
    id: 'endurance-iron',
    name: 'Endurance Iron',
    type: 'consumable',
    subtype: 'POTION',
    quality: 'common',
    description: 'A metallic-tasting potion that hardens your resolve. Makes you tougher, but slower, like carrying iron.',
    iconId: 'Misc/Profession Resources/Alchemy/Red/red-potion-bottle-squat-bulbous-rounded-body-wider-bottom-tapering-short-narrow-neck-bright-deep-red-liquid-bottom-half-lighter-red-orange-highlight-light-beige-pale-yellow-glass-dark-brown-stopper-golden-yellow-outline',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 1,
    rotation: 0,
    baseStats: {
      constitution: { value: 4, isPercentage: false, duration: 900 }, // 15 minutes
      agility: { value: -2, isPercentage: false, duration: 900 } // Slows movement
    },
    combatStats: {
      maxHealth: { value: 15, isPercentage: false, duration: 900 }
    },
    utilityStats: {
      movementSpeed: { value: -10, isPercentage: false, duration: 900 },
      duration: { type: 'MINUTES', value: 15 } // 15 minutes
    }
  },

  // === FOOD ITEMS ===
  {
    id: 'hardtack-sorrow',
    name: 'Hardtack Sorrow',
    type: 'consumable',
    subtype: 'FOOD',
    quality: 'poor',
    description: 'Hard, dry bread that tastes of nothing. Sustains the body, but does little for the soul.',
    iconId: 'Misc/Profession Resources/Cooking/Food/Other/bread-loaf-rustic-artisan-slashes',
    value: { gold: 0, silver: 1, copper: 0 },
    stackable: true,
    maxStackSize: 20,
    width: 1,
    height: 1,
    rotation: 0,
    combatStats: {
      healthRestore: { value: 10, isPercentage: false },
      manaRestore: { value: 5, isPercentage: false }
    }
  },
  {
    id: 'travelers-fare',
    name: 'Traveler\'s Fare',
    type: 'consumable',
    subtype: 'FOOD',
    quality: 'common',
    description: 'Dried meat and preserved fruit. Simple but sustaining, it reminds you of better times.',
    iconId: 'Misc/Profession Resources/Cooking/animal-meat-raw-cut-rib-leg-orange-beige',
    value: { gold: 0, silver: 3, copper: 0 },
    stackable: true,
    maxStackSize: 20,
    width: 1,
    height: 1,
    rotation: 0,
    combatStats: {
      healthRestore: { value: 20, isPercentage: false },
      manaRestore: { value: 10, isPercentage: false }
    },
    baseStats: {
      constitution: { value: 1, isPercentage: false, duration: 600 } // 10 minutes
    },
    utilityStats: {
      duration: { type: 'MINUTES', value: 10 } // 10 minutes
    }
  },
  {
    id: 'stew-of-memories',
    name: 'Stew of Memories',
    type: 'consumable',
    subtype: 'FOOD',
    quality: 'common',
    description: 'A thick stew that warms both body and spirit. Restores health and mana, but the memories it brings are bittersweet.',
    iconId: 'Misc/Profession Resources/Cooking/bowl-rustic-earthenware-beige-orange',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: true,
    maxStackSize: 10,
    width: 1,
    height: 1,
    rotation: 0,
    combatStats: {
      healthRestore: { value: 30, isPercentage: false },
      manaRestore: { value: 20, isPercentage: false }
    },
    baseStats: {
      constitution: { value: 2, isPercentage: false, duration: 600 },
      spirit: { value: -1, isPercentage: false, duration: 600 } // Bittersweet memories
    },
    utilityStats: {
      duration: { type: 'MINUTES', value: 10 } // 10 minutes
    }
  },
  {
    id: 'black-bread',
    name: 'Black Bread',
    type: 'consumable',
    subtype: 'FOOD',
    quality: 'poor',
    description: 'Coarse, dark bread that fills the stomach but weighs on the soul. Sustains life, but barely.',
    iconId: 'Misc/Profession Resources/Cooking/Food/Other/bread-loaf-sliced-blocky',
    value: { gold: 0, silver: 1, copper: 0 },
    stackable: true,
    maxStackSize: 20,
    width: 1,
    height: 1,
    rotation: 0,
    combatStats: {
      healthRestore: { value: 8, isPercentage: false },
      manaRestore: { value: 3, isPercentage: false }
    },
    baseStats: {
      spirit: { value: -1, isPercentage: false, duration: 300 } // Temporary melancholy
    },
    utilityStats: {
      duration: { type: 'MINUTES', value: 5 } // 5 minutes
    }
  },

  // === SCROLLS ===
  {
    id: 'scroll-of-haste',
    name: 'Scroll of Haste',
    type: 'consumable',
    subtype: 'SCROLL',
    quality: 'common',
    description: 'A tattered scroll that quickens your movements. The magic is potent, but unstable.',
    iconId: 'Misc/Books/book-scroll-rolled-red-wax-seal',
    value: { gold: 0, silver: 4, copper: 0 },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 1,
    rotation: 0,
    baseStats: {
      agility: { value: 2, isPercentage: false, duration: 120 } // 2 minutes
    },
    utilityStats: {
      movementSpeed: { value: 20, isPercentage: false, duration: 120 },
      duration: { type: 'MINUTES', value: 2 } // 2 minutes
    },
    combatStats: {
      maxHealth: { value: -3, isPercentage: false, duration: 120 } // Temporary strain
    }
  },
  {
    id: 'scroll-of-fortitude',
    name: 'Scroll of Fortitude',
    type: 'consumable',
    subtype: 'SCROLL',
    quality: 'common',
    description: 'A weathered scroll that hardens your resolve. Grants endurance, but makes you slower.',
    iconId: 'Misc/Books/book-scroll-rolled-red-wax-seal',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 1,
    rotation: 0,
    baseStats: {
      constitution: { value: 3, isPercentage: false, duration: 600 }, // 10 minutes
      agility: { value: -2, isPercentage: false, duration: 600 }
    },
    combatStats: {
      maxHealth: { value: 20, isPercentage: false, duration: 600 }
    },
    utilityStats: {
      duration: { type: 'MINUTES', value: 10 } // 10 minutes
    }
  },
  {
    id: 'scroll-of-madness',
    name: 'Scroll of Madness',
    type: 'consumable',
    subtype: 'SCROLL',
    quality: 'common',
    description: 'A disturbing scroll that enhances magic. The power is real, but the voices in your head grow louder.',
    iconId: 'Misc/Books/book-scroll-rolled-red-wax-seal',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 1,
    rotation: 0,
    baseStats: {
      intelligence: { value: 4, isPercentage: false, duration: 360 }, // 6 minutes
      spirit: { value: -3, isPercentage: false, duration: 360 },
      charisma: { value: -1, isPercentage: false, duration: 360 }
    },
    combatStats: {
      spellDamage: {
        types: {
          arcane: { value: 8, isPercentage: false, duration: 360 },
          psychic: { value: 5, isPercentage: false, duration: 360 }
        }
      }
    },
    utilityStats: {
      duration: { type: 'MINUTES', value: 6 } // 6 minutes
    }
  },

  // === SPECIAL CONSUMABLES ===
  {
    id: 'embers-of-life',
    name: 'Embers of Life',
    type: 'consumable',
    subtype: 'POTION',
    quality: 'common',
    description: 'A glowing potion that restores both health and mana. The warmth is comforting, but the light fades quickly.',
    iconId: 'Misc/Profession Resources/Alchemy/golden-orange-potion',
    value: { gold: 0, silver: 8, copper: 0 },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 1,
    rotation: 0,
    combatStats: {
      healthRestore: { value: 25, isPercentage: false },
      manaRestore: { value: 25, isPercentage: false }
    },
    baseStats: {
      spirit: { value: -1, isPercentage: false, duration: 240 } // 4 minutes - Fading light
    },
    utilityStats: {
      duration: { type: 'MINUTES', value: 4 } // 4 minutes
    }
  },
  {
    id: 'hollow-essence',
    name: 'Hollow Essence',
    type: 'consumable',
    subtype: 'ELIXIR',
    quality: 'poor',
    description: 'A pale elixir that restores a small amount of both health and mana. It tastes of emptiness.',
    iconId: 'Misc/Profession Resources/Alchemy/Empty/empty-beige-bottle',
    value: { gold: 0, silver: 2, copper: 0 },
    stackable: true,
    maxStackSize: 10,
    width: 1,
    height: 1,
    rotation: 0,
    combatStats: {
      healthRestore: { value: 10, isPercentage: false },
      manaRestore: { value: 10, isPercentage: false }
    },
    baseStats: {
      spirit: { value: -1, isPercentage: false, duration: 180 } // 3 minutes - Emptiness
    },
    utilityStats: {
      duration: { type: 'MINUTES', value: 3 } // 3 minutes
    }
  },
  {
    id: 'cursed-ration',
    name: 'Cursed Ration',
    type: 'consumable',
    subtype: 'FOOD',
    quality: 'poor',
    description: 'Food that has been touched by dark magic. Sustains you, but leaves you feeling tainted.',
    iconId: 'Misc/Profession Resources/Cooking/Food/Other/raw-steak-fat-marbling',
    value: { gold: 0, silver: 2, copper: 0 },
    stackable: true,
    maxStackSize: 10,
    width: 1,
    height: 1,
    rotation: 0,
    combatStats: {
      healthRestore: { value: 15, isPercentage: false },
      manaRestore: { value: 8, isPercentage: false }
    },
    baseStats: {
      spirit: { value: -2, isPercentage: false, duration: 600 } // Dark taint
    },
    utilityStats: {
      duration: { type: 'MINUTES', value: 10 } // 10 minutes
    }
  },

  // === POISONS ===
  {
    id: 'weak-poison',
    name: 'Weak Poison',
    type: 'consumable',
    subtype: 'POISON',
    quality: 'poor',
    description: 'A crude poison made from common ingredients. Causes minor damage over time, but is easily resisted.',
    iconId: 'Misc/Profession Resources/Alchemy/Green/green-potion-bottle-bulbous-rounded-body-tapering-narrow-neck-vibrant-green-liquid-lower-half-yellow-highlight-light-brown-beige-tan-glass-dark-stopper',
    value: { gold: 0, silver: 3, copper: 0 },
    stackable: true,
    maxStackSize: 10,
    width: 1,
    height: 1,
    rotation: 0,
    combatStats: {
      spellDamage: {
        types: {
          poison: { value: 5, isPercentage: false, duration: 60 }
        }
      }
    },
    utilityStats: {
      duration: { type: 'SECONDS', value: 60 } // 1 minute
    }
  },
  {
    id: 'venom-vial',
    name: 'Venom Vial',
    type: 'consumable',
    subtype: 'POISON',
    quality: 'common',
    description: 'A potent poison extracted from deadly creatures. Causes significant damage over time, but can be dangerous to handle.',
    iconId: 'Misc/Profession Resources/Alchemy/Green/green-potion-bottle-bulbous-rounded-body-tapering-narrow-neck-vibrant-green-liquid-lower-half-yellow-highlight-light-brown-beige-tan-glass-dark-stopper',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: true,
    maxStackSize: 10,
    width: 1,
    height: 1,
    rotation: 0,
    combatStats: {
      spellDamage: {
        types: {
          poison: { value: 10, isPercentage: false, duration: 120 }
        }
      }
    },
    baseStats: {
      constitution: { value: -1, isPercentage: false, duration: 60 } // Temporary weakness from handling poison
    },
    utilityStats: {
      duration: { type: 'SECONDS', value: 120 } // 2 minutes
    }
  },
  {
    id: 'deadly-toxin',
    name: 'Deadly Toxin',
    type: 'consumable',
    subtype: 'POISON',
    quality: 'uncommon',
    description: 'An extremely potent poison that causes severe damage. Highly effective, but handling it is risky.',
    iconId: 'Misc/Profession Resources/Alchemy/Green/green-potion-bottle-bulbous-rounded-body-tapering-narrow-neck-vibrant-green-liquid-lower-half-yellow-highlight-light-brown-beige-tan-glass-dark-stopper',
    value: { gold: 0, silver: 10, copper: 0 },
    stackable: true,
    maxStackSize: 5,
    width: 1,
    height: 1,
    rotation: 0,
    combatStats: {
      spellDamage: {
        types: {
          poison: { value: 15, isPercentage: false, duration: 180 }
        }
      }
    },
    baseStats: {
      constitution: { value: -2, isPercentage: false, duration: 120 } // Temporary weakness from handling deadly poison
    },
    utilityStats: {
      duration: { type: 'SECONDS', value: 180 } // 3 minutes
    }
  }
];
