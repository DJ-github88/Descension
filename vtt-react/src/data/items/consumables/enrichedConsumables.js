export const ENRICHED_CONSUMABLES = [
 {
  id: 'ember-shield-draught',
  name: 'Ember-Shield Draught',
  type: 'consumable',
  subtype: 'POTION',
  quality: 'uncommon',
  description: 'A warming potion that coats your skin in protective ash. Grants resistance to fire and heat, but leaves you sluggish and drowsy.',
  iconId: 'Misc/Profession Resources/Alchemy/Red/red-potion-bottle-classic-squat-bulbous-rounded-body-narrower-neck-diagonal-bright-deep-red-liquid-two-thirds-light-beige-cream-glass-dark-brown-cylindrical-cork',
  value: { gold: 1, silver: 0, copper: 0 },
  stackable: true,
  maxStackSize: 10,
  width: 1,
  height: 1,
  rotation: 0,
  combatStats: {
   resistances: {
    ember: { value: 10, isPercentage: false, duration: 300 }
   }
  },
  baseStats: {
   constitution: { value: 2, isPercentage: false, duration: 300 },
   agility: { value: -2, isPercentage: false, duration: 300 }
  },
  utilityStats: {
   duration: { type: 'MINUTES', value: 5 }
  }
 },
 {
  id: 'frost-walker-brew',
  name: 'Frost-Walker Brew',
  type: 'consumable',
  subtype: 'ELIXIR',
  quality: 'uncommon',
  description: 'An elixir that slows your heartbeat to near-freezing. Grants cold resistance, but weakens your physical strikes.',
  iconId: 'Misc/Profession Resources/Alchemy/Blue/blue-potion-bottle-classic-shape',
  value: { gold: 1, silver: 0, copper: 0 },
  stackable: true,
  maxStackSize: 10,
  width: 1,
  height: 1,
  rotation: 0,
  combatStats: {
   resistances: {
    cold: { value: 10, isPercentage: false, duration: 300 }
   }
  },
  baseStats: {
   constitution: { value: 2, isPercentage: false, duration: 300 },
   strength: { value: -2, isPercentage: false, duration: 300 }
  },
  utilityStats: {
   duration: { type: 'MINUTES', value: 5 }
  }
 },
 {
  id: 'storm-glass-vial',
  name: 'Storm-Glass Vial',
  type: 'consumable',
  subtype: 'POTION',
  quality: 'uncommon',
  description: 'A crackling vial of captured lightning. Grants temporary storm spell damage, but the electricity makes your hands shake.',
  iconId: 'Misc/Profession Resources/Alchemy/Blue/blue-potion-bottle-bulbous-bright-blue-glow',
  value: { gold: 1, silver: 0, copper: 0 },
  stackable: true,
  maxStackSize: 10,
  width: 1,
  height: 1,
  rotation: 0,
  combatStats: {
   spellDamage: {
    types: {
     storm: { value: 5, isPercentage: false, duration: 300 }
    }
   }
  },
  baseStats: {
   intelligence: { value: 2, isPercentage: false, duration: 300 },
   agility: { value: -1, isPercentage: false, duration: 300 }
  },
  utilityStats: {
   duration: { type: 'MINUTES', value: 5 }
  }
 },
 {
  id: 'shadow-blend',
  name: 'Shadow-Blend',
  type: 'consumable',
  subtype: 'FOOD',
  quality: 'uncommon',
  description: 'A dark paste made from Bryngloom mushrooms. Boosts agility and spirit, but causes unsettling hallucinations.',
  iconId: 'Misc/Profession Resources/Cooking/bowl-rustic-earthenware-beige-orange',
  value: { gold: 1, silver: 0, copper: 0 },
  stackable: true,
  maxStackSize: 10,
  width: 1,
  height: 1,
  rotation: 0,
  baseStats: {
   agility: { value: 3, isPercentage: false, duration: 300 },
   spirit: { value: 2, isPercentage: false, duration: 300 },
   intelligence: { value: -2, isPercentage: false, duration: 300 }
  },
  utilityStats: {
   duration: { type: 'MINUTES', value: 5 }
  }
 },
 {
  id: 'scroll-of-warding',
  name: 'Scroll-of-Warding',
  type: 'consumable',
  subtype: 'SCROLL',
  quality: 'uncommon',
  description: 'An ancient scroll inscribed with protective runes. Grants a boost to all resistances temporarily, but drains your vitality.',
  iconId: 'Misc/Books/book-scroll-rolled-red-wax-seal',
  value: { gold: 2, silver: 0, copper: 0 },
  stackable: true,
  maxStackSize: 10,
  width: 1,
  height: 1,
  rotation: 0,
  combatStats: {
   resistances: {
    physical: { value: 5, isPercentage: false, duration: 300 },
    ember: { value: 5, isPercentage: false, duration: 300 },
    cold: { value: 5, isPercentage: false, duration: 300 },
    storm: { value: 5, isPercentage: false, duration: 300 },
    shadow: { value: 5, isPercentage: false, duration: 300 }
   }
  },
  baseStats: {
   constitution: { value: -2, isPercentage: false, duration: 300 }
  },
  utilityStats: {
   duration: { type: 'MINUTES', value: 5 }
  }
 },
 {
  id: 'antidote-of-last-resort',
  name: 'Antidote-of-Last-Resort',
  type: 'consumable',
  subtype: 'POTION',
  quality: 'uncommon',
  description: 'A harsh tonic that purges toxins from the blood. Cures poison but leaves you weak and nauseous.',
    iconId: 'Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-bottle-classic-shape-beige-third-full',
  value: { gold: 1, silver: 50, copper: 0 },
  stackable: true,
  maxStackSize: 10,
  width: 1,
  height: 1,
  rotation: 0,
  combatStats: {
   healthRestore: { value: 20, isPercentage: false }
  },
  baseStats: {
   constitution: { value: 3, isPercentage: false, duration: 120 },
   spirit: { value: -2, isPercentage: false, duration: 120 }
  },
  utilityStats: {
   duration: { type: 'MINUTES', value: 2 }
  }
 },
 {
  id: 'solbrands-blessing',
  name: "Solbrand's Blessing",
  type: 'consumable',
  subtype: 'POTION',
  quality: 'rare',
  description: 'A radiant golden potion blessed by Solbrand priests. Greatly boosts sacred and ember damage, but the divine light burns the impure.',
  iconId: 'Misc/Profession Resources/Alchemy/Red/red-potion-bottle-bulbous-rounded-body-tapering-narrow-neck-light-beige-off-white-glass-subtle-shading-left-side-bright-fiery-red-liquid-two-thirds-yellow-pixel-highlight-surface-variations-shade-dark-stopper',
  value: { gold: 3, silver: 0, copper: 0 },
  stackable: true,
  maxStackSize: 10,
  width: 1,
  height: 1,
  rotation: 0,
  combatStats: {
   spellDamage: {
    types: {
     sacred: { value: 8, isPercentage: false, duration: 600 },
     ember: { value: 5, isPercentage: false, duration: 600 }
    }
   },
   healthRestore: { value: 30, isPercentage: false }
  },
  baseStats: {
   spirit: { value: 3, isPercentage: false, duration: 600 },
   charisma: { value: -2, isPercentage: false, duration: 600 }
  },
  utilityStats: {
   duration: { type: 'MINUTES', value: 10 }
  }
 },
 {
  id: 'wyrd-antidote',
  name: 'Wyrd-Antidote',
  type: 'consumable',
  subtype: 'POTION',
  quality: 'rare',
  description: 'A Deep Alchemist formula that neutralizes Wyrd contamination. Restores health and grants Wyrd resistance, but causes temporary memory loss.',
    iconId: 'Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-bottle-classic-shape-beige-third-full',
  value: { gold: 3, silver: 0, copper: 0 },
  stackable: true,
  maxStackSize: 10,
  width: 1,
  height: 1,
  rotation: 0,
  combatStats: {
   healthRestore: { value: 40, isPercentage: false },
   resistances: {
    wyrd: { value: 15, isPercentage: false, duration: 600 }
   }
  },
  baseStats: {
   intelligence: { value: -3, isPercentage: false, duration: 600 },
   spirit: { value: 2, isPercentage: false, duration: 600 }
  },
  utilityStats: {
   duration: { type: 'MINUTES', value: 10 }
  }
 },
 {
  id: 'scroll-of-ice-storm',
  name: 'Scroll-of-Ice-Storm',
  type: 'consumable',
  subtype: 'SCROLL',
  quality: 'rare',
  description: 'A scroll containing the essence of an Iceheart Sea blizzard. Unleashes cold damage and boosts cold spellpower, but freezes the user briefly.',
  iconId: 'Misc/Books/book-scroll-rolled-red-wax-seal',
  value: { gold: 4, silver: 0, copper: 0 },
  stackable: true,
  maxStackSize: 10,
  width: 1,
  height: 1,
  rotation: 0,
  combatStats: {
   spellDamage: {
    types: {
     cold: { value: 10, isPercentage: false, duration: 600 },
     storm: { value: 5, isPercentage: false, duration: 600 }
    }
   }
  },
  baseStats: {
   intelligence: { value: 3, isPercentage: false, duration: 600 },
   agility: { value: -3, isPercentage: false, duration: 600 }
  },
  utilityStats: {
   duration: { type: 'MINUTES', value: 10 }
  }
 },
 {
  id: 'plague-immunity-serum',
  name: 'Plague-Immunity Serum',
  type: 'consumable',
  subtype: 'ELIXIR',
  quality: 'rare',
  description: 'A Vat-Breaker concoction that grants temporary immunity to disease and poison. The taste is unbearable.',
  iconId: 'Misc/Profession Resources/Alchemy/Blue/teal-potion-magical',
  value: { gold: 3, silver: 50, copper: 0 },
  stackable: true,
  maxStackSize: 10,
  width: 1,
  height: 1,
  rotation: 0,
  combatStats: {
   resistances: {
    blight: { value: 12, isPercentage: false, duration: 600 },
    poison: { value: 12, isPercentage: false, duration: 600 }
   }
  },
  baseStats: {
   constitution: { value: 4, isPercentage: false, duration: 600 },
   charisma: { value: -2, isPercentage: false, duration: 600 }
  },
  utilityStats: {
   duration: { type: 'MINUTES', value: 10 }
  }
 },
 {
  id: 'berserker-mead',
  name: 'Berserker-Mead',
  type: 'consumable',
  subtype: 'FOOD',
  quality: 'rare',
  description: 'A potent Nordhalla brew that fills the warrior with battle-fury. Massive strength boost, but clouds judgment and leaves you vulnerable.',
  iconId: 'Misc/Profession Resources/Cooking/animal-meat-raw-cut-rib-leg-orange-beige',
  value: { gold: 3, silver: 0, copper: 0 },
  stackable: true,
  maxStackSize: 10,
  width: 1,
  height: 1,
  rotation: 0,
  baseStats: {
   strength: { value: 5, isPercentage: false, duration: 300 },
   constitution: { value: 2, isPercentage: false, duration: 300 },
   intelligence: { value: -3, isPercentage: false, duration: 300 },
   spirit: { value: -2, isPercentage: false, duration: 300 }
  },
  utilityStats: {
   duration: { type: 'MINUTES', value: 5 }
  }
 },
 {
  id: 'scroll-of-shadows',
  name: 'Scroll-of-Shadows',
  type: 'consumable',
  subtype: 'SCROLL',
  quality: 'rare',
  description: 'A scroll written in ink that absorbs light. Grants shadow spellpower and stealth, but weakens your connection to the sacred.',
  iconId: 'Misc/Books/book-scroll-rolled-red-wax-seal',
  value: { gold: 4, silver: 0, copper: 0 },
  stackable: true,
  maxStackSize: 10,
  width: 1,
  height: 1,
  rotation: 0,
  combatStats: {
   spellDamage: {
    types: {
     shadow: { value: 10, isPercentage: false, duration: 600 },
     wyrd: { value: 5, isPercentage: false, duration: 600 }
    }
   }
  },
  baseStats: {
   agility: { value: 4, isPercentage: false, duration: 600 },
   intelligence: { value: 2, isPercentage: false, duration: 600 },
   spirit: { value: -3, isPercentage: false, duration: 600 }
  },
  utilityStats: {
   duration: { type: 'MINUTES', value: 10 }
  }
 },
 {
  id: 'elixir-of-the-tempest',
  name: 'Elixir-of-the-Tempest',
  type: 'consumable',
  subtype: 'ELIXIR',
  quality: 'epic',
  description: 'A legendary elixir brewed during the Great Fracture. Grants immense storm and arcane power, but the energy slowly destroys your body.',
  iconId: 'Misc/Profession Resources/Alchemy/Blue/teal-potion-bubbles',
  value: { gold: 8, silver: 0, copper: 0 },
  stackable: true,
  maxStackSize: 10,
  width: 1,
  height: 1,
  rotation: 0,
  combatStats: {
   spellDamage: {
    types: {
     storm: { value: 15, isPercentage: false, duration: 300 },
     arcane: { value: 10, isPercentage: false, duration: 300 }
    }
   },
   manaRestore: { value: 80, isPercentage: false }
  },
  baseStats: {
   intelligence: { value: 5, isPercentage: false, duration: 300 },
   constitution: { value: -4, isPercentage: false, duration: 300 }
  },
  utilityStats: {
   duration: { type: 'MINUTES', value: 5 }
  }
 },
 {
  id: 'phoenix-tear',
  name: 'Phoenix-Tear',
  type: 'consumable',
  subtype: 'POTION',
  quality: 'epic',
  description: 'A single tear from a phoenix, said to have fallen during the Sundering. Restores massive health and grants fire immunity, but the pain of rebirth is absolute.',
  iconId: 'Misc/Profession Resources/Alchemy/golden-orange-potion',
  value: { gold: 10, silver: 0, copper: 0 },
  stackable: true,
  maxStackSize: 10,
  width: 1,
  height: 1,
  rotation: 0,
  combatStats: {
   healthRestore: { value: 100, isPercentage: false },
   resistances: {
    ember: { value: 20, isPercentage: false, duration: 600 },
    sacred: { value: 15, isPercentage: false, duration: 600 }
   },
   maxHealth: { value: 30, isPercentage: false, duration: 600 }
  },
  baseStats: {
   spirit: { value: 3, isPercentage: false, duration: 600 },
   agility: { value: -2, isPercentage: false, duration: 600 }
  },
  utilityStats: {
   duration: { type: 'MINUTES', value: 10 }
  }
 },
 {
  id: 'scroll-of-the-void',
  name: 'Scroll-of-the-Void',
  type: 'consumable',
  subtype: 'SCROLL',
  quality: 'epic',
  description: 'A scroll that opens a window to the void between worlds. Grants incredible shadow and Wyrd power, but risks losing your mind to the darkness.',
  iconId: 'Misc/Books/book-scroll-rolled-red-wax-seal',
  value: { gold: 10, silver: 0, copper: 0 },
  stackable: true,
  maxStackSize: 10,
  width: 1,
  height: 1,
  rotation: 0,
  combatStats: {
   spellDamage: {
    types: {
     shadow: { value: 15, isPercentage: false, duration: 300 },
     wyrd: { value: 15, isPercentage: false, duration: 300 }
    }
   }
  },
  baseStats: {
   intelligence: { value: 5, isPercentage: false, duration: 300 },
   spirit: { value: 3, isPercentage: false, duration: 300 },
   charisma: { value: -4, isPercentage: false, duration: 300 }
  },
  utilityStats: {
   duration: { type: 'MINUTES', value: 5 }
  }
 }
];
