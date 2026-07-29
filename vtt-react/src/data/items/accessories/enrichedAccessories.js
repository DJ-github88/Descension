export const ENRICHED_ACCESSORIES = [
  // === UNCOMMON ACCESSORIES (7) ===
  {
    id: 'ember-signet',
    name: 'Ember-Signet',
    type: 'accessory',
    subtype: 'RING',
    quality: 'uncommon',
    description: 'A signet ring forged in the Ashveil crucibles, its seal still warm to the touch. Bears the mark of a fire cult that perished when the mountains first wept ember.',
    iconId: 'Armor/Finger/finger-red-gem-golden-ring',
    value: { gold: 1, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['finger'],
    durability: 'd8',
    maxDurability: 'd8',
    baseStats: {
      strength: { value: 1, isPercentage: false },
      spirit: { value: 1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          ember: { value: 3, isPercentage: false }
        }
      },
      resistances: {
        ember: { value: 3, isPercentage: false }
      },
      conditionModifiers: {
        burning: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      }
    }
  },
  {
    id: 'frost-charm',
    name: 'Frost-Charm',
    type: 'accessory',
    subtype: 'AMULET',
    quality: 'uncommon',
    description: 'An amulet containing a shard of the Pale Wastes, eternally frozen. The cold whispers of a northern coven still echo within its crystalline heart.',
    iconId: 'Armor/Neck/teal-crystal-pendant',
    value: { gold: 1, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['neck'],
    durability: 'd8',
    maxDurability: 'd8',
    baseStats: {
      intelligence: { value: 1, isPercentage: false },
      constitution: { value: 1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          cold: { value: 3, isPercentage: false }
        }
      },
      resistances: {
        cold: { value: 4, isPercentage: false }
      },
      conditionModifiers: {
        frozen: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      }
    }
  },
  {
    id: 'storm-bead',
    name: 'Storm-Bead',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'uncommon',
    description: 'A single bead strung on copper wire, crackling with trapped lightning. Said to have been cut from the spine of a storm titan that fell from the Shattered Spire.',
    iconId: 'Armor/Neck/glowing-orb-pendant',
    value: { gold: 1, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    durability: 'd8',
    maxDurability: 'd8',
    baseStats: {
      agility: { value: 2, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          storm: { value: 3, isPercentage: false }
        }
      },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 18,
        diceThreshold: 18,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: [],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d4',
            damageType: 'storm',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    }
  },
  {
    id: 'shadow-loom',
    name: 'Shadow-Loom',
    type: 'accessory',
    subtype: 'CLOAK',
    quality: 'uncommon',
    description: 'A cloak woven from threads of living darkness, stitched by blind weavers of the Hollow Conclave. It moves on its own when you are not looking.',
    iconId: 'Armor/Cloak/cloak-simple-brown-cape',
    value: { gold: 1, silver: 5, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['back'],
    durability: 'd8',
    maxDurability: 'd8',
    baseStats: {
      agility: { value: 3, isPercentage: false },
      intelligence: { value: 1, isPercentage: false }
    },
    combatStats: {
      resistances: {
        shadow: { value: 4, isPercentage: false }
      },
      conditionModifiers: {
        frightened: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      }
    }
  },
  {
    id: 'wyrd-stone',
    name: 'Wyrd-Stone',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'uncommon',
    description: 'A smooth stone that hums with discordant frequencies. Those who hold it too long begin to see the Wyrd veins beneath the earth, pulsing like veins of madness.',
    iconId: 'Armor/Neck/layered-geometric-emblem-pendant',
    value: { gold: 1, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    durability: 'd8',
    maxDurability: 'd8',
    baseStats: {
      intelligence: { value: 2, isPercentage: false },
      spirit: { value: 1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          wyrd: { value: 3, isPercentage: false }
        }
      },
      resistances: {
        wyrd: { value: 3, isPercentage: false }
      },
      conditionModifiers: {
        confused: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      }
    }
  },
  {
    id: 'plague-vial-pendant',
    name: 'Plague-Vial Pendant',
    type: 'accessory',
    subtype: 'NECKLACE',
    quality: 'uncommon',
    description: 'A pendant housing a vial of ancient plague sealed in wax. The sickness inside has grown wise over centuries, and now protects its bearer from lesser afflictions.',
    iconId: 'Armor/Neck/forbidden-craft-pendant',
    value: { gold: 1, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['neck'],
    durability: 'd8',
    maxDurability: 'd8',
    baseStats: {
      constitution: { value: 2, isPercentage: false }
    },
    combatStats: {
      resistances: {
        blight: { value: 4, isPercentage: false },
        poison: { value: 3, isPercentage: false }
      },
      conditionModifiers: {
        poisoned: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        },
        diseased: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      }
    }
  },
  {
    id: 'haste-sash',
    name: 'Haste-Sash',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'uncommon',
    description: 'A frayed sash enchanted by a speed-obsessed hermit who outran his own shadow. The wearer feels the wind push at their back, but their bones grow brittle from the strain.',
    iconId: 'Armor/Neck/spiral-coil-medallion',
    value: { gold: 1, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    durability: 'd8',
    maxDurability: 'd8',
    baseStats: {
      agility: { value: 3, isPercentage: false },
      constitution: { value: -1, isPercentage: false }
    },
    utilityStats: {
      movementSpeed: { value: 10, isPercentage: false }
    }
  },

  // === RARE ACCESSORIES (8) ===
  {
    id: 'inferno-loop',
    name: 'Inferno-Loop',
    type: 'accessory',
    subtype: 'RING',
    quality: 'rare',
    description: 'A molten ring from the deepest forge of the Cinderlords, its surface flows like living lava. The fire within remembers every soul it has consumed, and hungers for more.',
    iconId: 'Armor/Finger/finger-glowing-red-eyes-skull-ring',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['finger'],
    durability: 'd10',
    maxDurability: 'd10',
    baseStats: {
      strength: { value: 2, isPercentage: false },
      spirit: { value: 1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          ember: { value: 5, isPercentage: false }
        }
      },
      resistances: {
        ember: { value: 6, isPercentage: false }
      },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 20,
        diceThreshold: 16,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['burning'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d6',
            damageType: 'ember',
            isDot: true,
            dotDuration: 2,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      conditionModifiers: {
        burning: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by this condition',
          color: '#4caf50'
        }
      },
      maxHealth: { value: 10, isPercentage: false }
    }
  },
  {
    id: 'glacial-focus',
    name: 'Glacial-Focus',
    type: 'accessory',
    subtype: 'AMULET',
    quality: 'rare',
    description: 'A lens of perfectly clear ice that never melts, harvested from the calving fields of the Everfrost Glacier. Through it, the world appears frozen in crystal clarity.',
    iconId: 'Armor/Neck/teal-gem-emblem-pendant',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['neck'],
    durability: 'd10',
    maxDurability: 'd10',
    baseStats: {
      intelligence: { value: 2, isPercentage: false },
      spirit: { value: 1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          cold: { value: 6, isPercentage: false }
        }
      },
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 22,
        diceThreshold: 18,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'diamonds',
        spellEffect: null,
        customEffects: ['freeze'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'freeze',
            controlDuration: 1,
            saveDC: 14,
            saveType: 'constitution',
            knockbackDistance: 0,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      resistances: {
        cold: { value: 5, isPercentage: false }
      },
      conditionModifiers: {
        frozen: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by this condition',
          color: '#4caf50'
        }
      }
    }
  },
  {
    id: 'thunder-cage',
    name: 'Thunder-Cage',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'A cage of twisted copper bars containing a captive storm sprite. It screams with every lightning strike, and its rage bleeds into the wielder\'s strikes.',
    iconId: 'Armor/Neck/glowing-orb-pendant',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    durability: 'd10',
    maxDurability: 'd10',
    baseStats: {
      strength: { value: 2, isPercentage: false },
      agility: { value: 1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          storm: { value: 6, isPercentage: false }
        }
      },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 22,
        diceThreshold: 15,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['shock'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d8',
            damageType: 'storm',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    }
  },
  {
    id: 'void-gazers-eye',
    name: "Void-Gazer's Eye",
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'A preserved eye that still blinks, said to have belonged to a seer who looked too long into the abyss between worlds. It sees things that others cannot, and shows them to the bearer in dreams.',
    iconId: 'Armor/Neck/horned-creature-pendant',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    durability: 'd10',
    maxDurability: 'd10',
    baseStats: {
      intelligence: { value: 3, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          shadow: { value: 5, isPercentage: false },
          wyrd: { value: 3, isPercentage: false }
        }
      },
      resistances: {
        shadow: { value: 5, isPercentage: false }
      },
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 25,
        diceThreshold: 18,
        cardProcRule: 'black_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'spades',
        spellEffect: null,
        customEffects: ['fear'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'fear',
            controlDuration: 1,
            saveDC: 15,
            saveType: 'spirit',
            knockbackDistance: 10,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      conditionModifiers: {
        frightened: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by this condition',
          color: '#4caf50'
        }
      }
    }
  },
  {
    id: 'arcane-resonator',
    name: 'Arcane-Resonator',
    type: 'accessory',
    subtype: 'RING',
    quality: 'rare',
    description: 'A ring of interlocking geometric bands that vibrate at frequencies only mages can perceive. It amplifies spellcraft by resonating with the latent magic in the air.',
    iconId: 'Armor/Finger/finger-ancient-bronze-ring',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['finger'],
    durability: 'd10',
    maxDurability: 'd10',
    baseStats: {
      intelligence: { value: 3, isPercentage: false },
      spirit: { value: 1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          arcane: { value: 6, isPercentage: false }
        }
      },
      resistances: {
        arcane: { value: 5, isPercentage: false },
        force: { value: 3, isPercentage: false }
      },
      conditionModifiers: {
        silenced: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by this condition',
          color: '#4caf50'
        }
      }
    }
  },
  {
    id: 'blight-wrapped-relic',
    name: 'Blight-Wrapped Relic',
    type: 'accessory',
    subtype: 'NECKLACE',
    quality: 'rare',
    description: 'A holy relic encased in a shell of living blight. The corruption protects what it touches, feeding on impurity and leaving only hardened vitality in its wake.',
    iconId: 'Armor/Neck/golden-rune-tag-pendant',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['neck'],
    durability: 'd10',
    maxDurability: 'd10',
    baseStats: {
      constitution: { value: 3, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          blight: { value: 5, isPercentage: false }
        }
      },
      resistances: {
        blight: { value: 6, isPercentage: false },
        poison: { value: 4, isPercentage: false }
      },
      conditionModifiers: {
        poisoned: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by this condition',
          color: '#4caf50'
        },
        diseased: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by this condition',
          color: '#4caf50'
        }
      },
      maxHealth: { value: 15, isPercentage: false }
    }
  },
  {
    id: 'wyrd-anchor',
    name: 'Wyrd-Anchor',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'A knotted stone from the bedrock beneath the Wyrdflow River, inscribed with sigils that predate the mortal races. It grounds the mind against the maddening pulse of ley lines.',
    iconId: 'Armor/Neck/horned-creature-pendant',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    durability: 'd10',
    maxDurability: 'd10',
    baseStats: {
      intelligence: { value: 2, isPercentage: false },
      spirit: { value: 2, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          wyrd: { value: 5, isPercentage: false }
        }
      },
      resistances: {
        wyrd: { value: 5, isPercentage: false },
        arcane: { value: 3, isPercentage: false }
      },
      conditionModifiers: {
        confused: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by this condition',
          color: '#4caf50'
        },
        silenced: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      }
    }
  },
  {
    id: 'psychic-lens',
    name: 'Psychic-Lens',
    type: 'accessory',
    subtype: 'RING',
    quality: 'rare',
    description: 'A ring set with a polished opal that shifts colors with the wearer\'s thoughts. It was crafted by the Mindwrights of the Shattered Tower, who shattered their own sanity perfecting it.',
    iconId: 'Armor/Finger/finger-brown-stitched-ring',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['finger'],
    durability: 'd10',
    maxDurability: 'd10',
    baseStats: {
      intelligence: { value: 3, isPercentage: false },
      spirit: { value: 1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          psychic: { value: 5, isPercentage: false }
        }
      },
      resistances: {
        psychic: { value: 5, isPercentage: false }
      },
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 22,
        diceThreshold: 18,
        cardProcRule: 'specific_suit',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'spades',
        spellEffect: null,
        customEffects: ['fear'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'fear',
            controlDuration: 1,
            saveDC: 14,
            saveType: 'spirit',
            knockbackDistance: 0,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      conditionModifiers: {
        charmed: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by this condition',
          color: '#4caf50'
        },
        confused: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      }
    }
  },

  // === EPIC ACCESSORIES (5) ===
  {
    id: 'phoenix-ash-ring',
    name: 'Phoenix-Ash Ring',
    type: 'accessory',
    subtype: 'RING',
    quality: 'epic',
    description: 'A ring forged from the cremated remains of the last true phoenix, whose death-fire birthed the Ashveil mountain range. The ember within still dreams of flight.',
    iconId: 'Armor/Finger/finger-red-gem-golden-ring',
    value: { gold: 10, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['finger'],
    durability: 'd12',
    maxDurability: 'd12',
    baseStats: {
      strength: { value: 2, isPercentage: false },
      spirit: { value: 3, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          ember: { value: 8, isPercentage: false },
          sacred: { value: 5, isPercentage: false }
        }
      },
      resistances: {
        ember: { value: 10, isPercentage: false }
      },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 30,
        diceThreshold: 14,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['burning'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '2d6',
            damageType: 'ember',
            isDot: true,
            dotDuration: 3,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      conditionModifiers: {
        burning: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by this condition',
          color: '#4caf50'
        }
      },
      maxHealth: { value: 25, isPercentage: false }
    }
  },
  {
    id: 'absolute-zero-pendant',
    name: 'Absolute-Zero Pendant',
    type: 'accessory',
    subtype: 'AMULET',
    quality: 'epic',
    description: 'A pendant containing a fragment of the void between stars, where temperature loses all meaning. It hung around the neck of the Frost Empress when she sealed the Everfrost for ten thousand years.',
    iconId: 'Armor/Neck/teal-crystal-pendant',
    value: { gold: 10, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['neck'],
    durability: 'd12',
    maxDurability: 'd12',
    baseStats: {
      intelligence: { value: 3, isPercentage: false },
      constitution: { value: 2, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          cold: { value: 8, isPercentage: false }
        }
      },
      resistances: {
        cold: { value: 10, isPercentage: false },
        storm: { value: 5, isPercentage: false }
      },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 28,
        diceThreshold: 14,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'diamonds',
        spellEffect: null,
        customEffects: ['freeze'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'freeze',
            controlDuration: 2,
            saveDC: 16,
            saveType: 'constitution',
            knockbackDistance: 0,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      conditionModifiers: {
        frozen: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by this condition',
          color: '#4caf50'
        },
        shocked: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      },
      maxHealth: { value: 20, isPercentage: false }
    }
  },
  {
    id: 'storm-majestys-crown',
    name: "Storm-Majesty's Crown",
    type: 'accessory',
    subtype: 'AMULET',
    quality: 'epic',
    description: "An amulet forged from a single bolt of lightning that struck the Wandering King's throne at the moment of his coronation. It crackles with the authority of tempests.",
    iconId: 'Armor/Neck/glowing-orb-pendant',
    value: { gold: 10, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['neck'],
    durability: 'd12',
    maxDurability: 'd12',
    baseStats: {
      strength: { value: 2, isPercentage: false },
      intelligence: { value: 3, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          storm: { value: 10, isPercentage: false },
          arcane: { value: 5, isPercentage: false }
        }
      },
      resistances: {
        storm: { value: 10, isPercentage: false }
      },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 30,
        diceThreshold: 13,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['shock'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '2d8',
            damageType: 'storm',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      conditionModifiers: {
        stunned: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      },
      maxHealth: { value: 25, isPercentage: false }
    }
  },
  {
    id: 'shadow-throne-signet',
    name: 'Shadow-Throne Signet',
    type: 'accessory',
    subtype: 'RING',
    quality: 'epic',
    description: 'A signet ring from the Shadow Throne, a seat of power that exists only in the space between heartbeats. Its wearer commands the darkness that dwells in every living thing.',
    iconId: 'Armor/Finger/finger-skull-death-ring',
    value: { gold: 10, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['finger'],
    durability: 'd12',
    maxDurability: 'd12',
    baseStats: {
      intelligence: { value: 4, isPercentage: false },
      spirit: { value: 2, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          shadow: { value: 8, isPercentage: false },
          blight: { value: 5, isPercentage: false }
        }
      },
      resistances: {
        shadow: { value: 10, isPercentage: false },
        wyrd: { value: 5, isPercentage: false }
      },
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 28,
        diceThreshold: 18,
        cardProcRule: 'black_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'spades',
        spellEffect: null,
        customEffects: ['fear'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'fear',
            controlDuration: 2,
            saveDC: 16,
            saveType: 'spirit',
            knockbackDistance: 10,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
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
      },
      maxHealth: { value: 20, isPercentage: false }
    }
  },
  {
    id: 'mind-palace-key',
    name: 'Mind-Palace Key',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'epic',
    description: 'A key that opens no physical door, but grants passage into the architecture of thought itself. The Mindwrights hid their greatest secrets behind psychic wards only this key can unseal.',
    iconId: 'Armor/Neck/butterfly-dragonfly-charm',
    value: { gold: 10, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    durability: 'd12',
    maxDurability: 'd12',
    baseStats: {
      intelligence: { value: 4, isPercentage: false },
      spirit: { value: 3, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          psychic: { value: 8, isPercentage: false },
          arcane: { value: 4, isPercentage: false }
        }
      },
      resistances: {
        psychic: { value: 8, isPercentage: false }
      },
      onHitEffects: {
        enabled: true,
        procType: 'coins',
        procChance: 25,
        diceThreshold: 18,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: [],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '2d6',
            damageType: 'wyrd',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      conditionModifiers: {
        charmed: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by this condition',
          color: '#4caf50'
        },
        confused: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by this condition',
          color: '#4caf50'
        },
        silenced: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by this condition',
          color: '#4caf50'
        }
      },
      maxHealth: { value: 15, isPercentage: false }
    },
    utilityStats: {
      movementSpeed: { value: 5, isPercentage: false }
    }
  }
];
