/**
 * Accessories - All accessory items
 * 
 * Starter accessories with Dark Souls-esque philosophy:
 * - Rings, necklaces, and trinkets with meaningful effects
 * - Tradeoffs and interesting choices
 * - Some have negative stats or drawbacks
 * - Dark, mysterious aesthetic with soulful names
 */

export const ACCESSORIES = [
  // === RINGS ===
  {
    id: 'the-burden',
    name: 'The Burden',
    type: 'accessory',
    subtype: 'RING',
    quality: 'poor',
    description: 'A tarnished iron ring that seems to sap your strength. Perhaps it once served a different purpose, but now it only weighs you down.',
    iconId: 'Armor/Finger/finger-ancient-bronze-ring',
    value: { gold: 0, silver: 1, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['finger'],
    baseStats: {
      strength: { value: -2, isPercentage: false },
      constitution: { value: 1, isPercentage: false }
    }
  },
  {
    id: 'hastening-regret',
    name: 'Hastening Regret',
    type: 'accessory',
    subtype: 'RING',
    quality: 'common',
    description: 'A simple copper ring that quickens your movements. The speed comes at a cost to your stamina, leaving you breathless.',
    iconId: 'Armor/Finger/finger-brown-braided-ring',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['finger'],
    baseStats: {
      agility: { value: 2, isPercentage: false },
      constitution: { value: -1, isPercentage: false }
    },
    utilityStats: {
      movementSpeed: { value: 10, isPercentage: false }
    }
  },
  {
    id: 'endurance-iron',
    name: 'Endurance Iron',
    type: 'accessory',
    subtype: 'RING',
    quality: 'common',
    description: 'A heavy iron ring that bolsters your endurance. Makes you tougher, but slower, like carrying a weight that never leaves.',
    iconId: 'Armor/Finger/finger-brown-stitched-ring',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['finger'],
    baseStats: {
      constitution: { value: 3, isPercentage: false },
      agility: { value: -2, isPercentage: false }
    },
    combatStats: {
      maxHealth: { value: 10, isPercentage: false },
      conditionModifiers: {
        exhausted: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      }
    }
  },
  {
    id: 'madness-whisper',
    name: 'Madness Whisper',
    type: 'accessory',
    subtype: 'RING',
    quality: 'common',
    description: 'A twisted ring that seems to whisper to you. Enhances magic, but clouds your mind with voices that never stop.',
    iconId: 'Armor/Finger/finger-glowing-red-eyes-skull-ring',
    value: { gold: 0, silver: 4, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['finger'],
    baseStats: {
      intelligence: { value: 2, isPercentage: false },
      spirit: { value: -2, isPercentage: false },
      charisma: { value: -1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          arcane: { value: 3, isPercentage: false }
        }
      }
    }
  },
  {
    id: 'hollow-promise',
    name: 'Hollow Promise',
    type: 'accessory',
    subtype: 'RING',
    quality: 'poor',
    description: 'A cracked ring that feels empty. Reduces all your attributes, but perhaps there is hidden power in emptiness.',
    iconId: 'Armor/Finger/finger-skull-death-ring',
    value: { gold: 0, silver: 2, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['finger'],
    baseStats: {
      strength: { value: -1, isPercentage: false },
      agility: { value: -1, isPercentage: false },
      constitution: { value: -1, isPercentage: false },
      intelligence: { value: -1, isPercentage: false },
      spirit: { value: -1, isPercentage: false },
      charisma: { value: -1, isPercentage: false }
    }
  },
  {
    id: 'blood-pact',
    name: 'Blood Pact',
    type: 'accessory',
    subtype: 'RING',
    quality: 'common',
    description: 'A dark iron ring stained with old blood. Increases damage dealt, but you take more in return, a pact sealed in crimson.',
    iconId: 'Armor/Finger/finger-red-gem-golden-ring',
    value: { gold: 0, silver: 7, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['finger'],
    baseStats: {
      strength: { value: 2, isPercentage: false },
      constitution: { value: -1, isPercentage: false }
    },
    combatStats: {
      damage: { value: 2, isPercentage: false }
    }
  },

  // === NECKLACES ===
  {
    id: 'pain-remembrance',
    name: 'Pain Remembrance',
    type: 'accessory',
    subtype: 'NECKLACE',
    quality: 'common',
    description: 'A heavy iron amulet that seems to cause constant discomfort. Grants resilience through suffering, remembering each wound.',
    iconId: 'Armor/Neck/teal-crystal-pendant',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['neck'],
    baseStats: {
      constitution: { value: 2, isPercentage: false },
      charisma: { value: -2, isPercentage: false }
    },
    combatStats: {
      resistances: {
        physical: { value: 2, isPercentage: false }
      }
    }
  },
  {
    id: 'whisper-chain',
    name: 'Whisper Chain',
    type: 'accessory',
    subtype: 'NECKLACE',
    quality: 'common',
    description: 'A small pendant that seems to carry voices from beyond. Enhances magic, but distracts the mind with echoes of the dead.',
    iconId: 'Armor/Neck/glowing-orb-pendant',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['neck'],
    baseStats: {
      intelligence: { value: 3, isPercentage: false },
      spirit: { value: 1, isPercentage: false },
      constitution: { value: -1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          arcane: { value: 2, isPercentage: false },
          psychic: { value: 2, isPercentage: false }
        }
      }
    }
  },
  {
    id: 'silent-focus',
    name: 'Silent Focus',
    type: 'accessory',
    subtype: 'NECKLACE',
    quality: 'common',
    description: 'A tight leather choker that makes your voice hoarse. Reduces charisma, but increases focus, like a vow of silence.',
    iconId: 'Armor/Neck/teal-gem-emblem-pendant',
    value: { gold: 0, silver: 4, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['neck'],
    baseStats: {
      intelligence: { value: 2, isPercentage: false },
      charisma: { value: -3, isPercentage: false }
    }
  },
  {
    id: 'weight-of-sorrow',
    name: 'Weight of Sorrow',
    type: 'accessory',
    subtype: 'NECKLACE',
    quality: 'poor',
    description: 'A heavy iron collar that weighs on your shoulders. Makes everything harder, but builds strength through hardship.',
    iconId: 'Armor/Neck/golden-rune-tag-pendant',
    value: { gold: 0, silver: 2, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['neck'],
    baseStats: {
      strength: { value: 1, isPercentage: false },
      agility: { value: -3, isPercentage: false },
      constitution: { value: -1, isPercentage: false }
    }
  },

  // === TRINKETS ===
  {
    id: 'corrupted-totem',
    name: 'Corrupted Totem',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'common',
    description: 'A small wooden totem carved with disturbing symbols. Channels dark power, but corrupts the soul with each use.',
    iconId: 'Misc/Books/book-brown-teal-question-mark',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      intelligence: { value: 2, isPercentage: false },
      spirit: { value: -3, isPercentage: false },
      charisma: { value: -1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          necrotic: { value: 3, isPercentage: false },
          shadow: { value: 2, isPercentage: false }
        }
      }
    }
  },
  {
    id: 'bone-memory',
    name: 'Bone Memory',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'common',
    description: 'A charm made from an unknown creature\'s bone. Grants resilience, but feels unsettling to carry, like holding death itself.',
    iconId: 'Misc/Books/book-brown-teal-question-mark',
    value: { gold: 0, silver: 4, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      constitution: { value: 2, isPercentage: false },
      charisma: { value: -1, isPercentage: false }
    },
    combatStats: {
      resistances: {
        necrotic: { value: 3, isPercentage: false }
      },
      conditionModifiers: {
        diseased: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        },
        poisoned: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      }
    }
  },
  {
    id: 'fading-remembrance',
    name: 'Fading Remembrance',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'poor',
    description: 'A tarnished emblem whose meaning has been lost. Provides a small boost to all attributes, but barely, like a memory half-forgotten.',
    iconId: 'Misc/Books/book-brown-teal-question-mark',
    value: { gold: 0, silver: 3, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      strength: { value: 1, isPercentage: false },
      agility: { value: 1, isPercentage: false },
      constitution: { value: 1, isPercentage: false },
      intelligence: { value: 1, isPercentage: false },
      spirit: { value: 1, isPercentage: false },
      charisma: { value: 1, isPercentage: false }
    }
  },
  {
    id: 'anchor-stone',
    name: 'Anchor Stone',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'poor',
    description: 'A smooth, heavy stone that seems to pull you down. Reduces speed, but increases stability, like being anchored to the earth.',
    iconId: 'Misc/Books/book-brown-teal-question-mark',
    value: { gold: 0, silver: 2, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      constitution: { value: 2, isPercentage: false },
      agility: { value: -2, isPercentage: false }
    },
    utilityStats: {
      movementSpeed: { value: -5, isPercentage: false }
    }
  },
  {
    id: 'shattered-reflection',
    name: 'Shattered Reflection',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'common',
    description: 'A small broken mirror that reflects distorted images. Enhances perception, but shows unsettling truths about yourself.',
    iconId: 'Misc/Books/book-brown-teal-question-mark',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      intelligence: { value: 2, isPercentage: false },
      spirit: { value: -1, isPercentage: false }
    }
  },
  {
    id: 'brute-fetish',
    name: 'Brute Fetish',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'common',
    description: 'A crude iron figure wrapped in old cloth. Grants physical power, but dulls the mind, trading thought for strength.',
    iconId: 'Misc/Books/book-brown-teal-question-mark',
    value: { gold: 0, silver: 4, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      strength: { value: 3, isPercentage: false },
      constitution: { value: 1, isPercentage: false },
      intelligence: { value: -2, isPercentage: false },
      spirit: { value: -1, isPercentage: false }
    }
  },

  // === UNCOMMON ACCESSORIES WITH EFFECTS ===
  {
    id: 'flameheart-ring',
    name: 'Flameheart Ring',
    type: 'accessory',
    subtype: 'RING',
    quality: 'uncommon',
    description: 'A ring set with a ruby that pulses with inner fire. Your attacks sometimes burn your enemies, leaving them aflame.',
    iconId: 'Armor/Finger/finger-red-gem-golden-ring',
    value: { gold: 1, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['finger'],
    baseStats: {
      strength: { value: 2, isPercentage: false },
      intelligence: { value: 1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          fire: { value: 3, isPercentage: false }
        }
      },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 15,
        diceThreshold: 18,
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
            damageType: 'fire',
            isDot: true,
            dotDuration: 2,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    }
  },
  {
    id: 'frostbite-amulet',
    name: 'Frostbite Amulet',
    type: 'accessory',
    subtype: 'NECKLACE',
    quality: 'uncommon',
    description: 'An amulet set with a sapphire that radiates cold. Your attacks sometimes freeze your enemies, slowing their movements.',
    iconId: 'Armor/Neck/teal-crystal-pendant',
    value: { gold: 1, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['neck'],
    baseStats: {
      intelligence: { value: 2, isPercentage: false },
      spirit: { value: 1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          cold: { value: 3, isPercentage: false }
        }
      },
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 25,
        diceThreshold: 18,
        cardProcRule: 'specific_suit',
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
            saveDC: 13,
            saveType: 'constitution',
            knockbackDistance: 10,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    }
  },
  {
    id: 'thunderclap-trinket',
    name: 'Thunderclap Trinket',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'uncommon',
    description: 'A small charm that crackles with lightning. Your attacks sometimes shock your enemies, leaving them stunned.',
    iconId: 'Misc/Books/book-brown-teal-question-mark',
    value: { gold: 1, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      intelligence: { value: 2, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          lightning: { value: 3, isPercentage: false }
        }
      },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 18,
        diceThreshold: 17,
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
            formula: '1d6',
            damageType: 'lightning',
            isDot: false,
            dotDuration: 3,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    }
  },

  // === RARE ACCESSORIES WITH EFFECTS ===
  {
    id: 'soulbound-ring',
    name: 'Soulbound Ring',
    type: 'accessory',
    subtype: 'RING',
    quality: 'rare',
    description: 'A dark ring that binds souls. Your attacks sometimes drain the life from your enemies, healing you in return.',
    iconId: 'Armor/Finger/finger-glowing-red-eyes-skull-ring',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['finger'],
    baseStats: {
      strength: { value: 3, isPercentage: false },
      intelligence: { value: 3, isPercentage: false },
      spirit: { value: -2, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          necrotic: { value: 5, isPercentage: false }
        }
      },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 20,
        diceThreshold: 17,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: [],
        useRollableTable: false,
        effect: {
          effectType: 'healing',
          effectConfig: {
            healingFormula: '1d8',
            isHot: false,
            hotDuration: 3,
            hotTickFrequency: 'round',
            grantsTempHP: false,
            targetType: 'self',
            areaRadius: 0
          }
        }
      },
      maxHealth: { value: 15, isPercentage: false }
    }
  },
  {
    id: 'stormcaller-pendant',
    name: 'Stormcaller Pendant',
    type: 'accessory',
    subtype: 'NECKLACE',
    quality: 'rare',
    description: 'A pendant that channels the fury of storms. Your attacks sometimes call down lightning, shocking and knocking back your enemies.',
    iconId: 'Armor/Neck/glowing-orb-pendant',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['neck'],
    baseStats: {
      intelligence: { value: 4, isPercentage: false },
      spirit: { value: 2, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          lightning: { value: 6, isPercentage: false },
          arcane: { value: 3, isPercentage: false }
        }
      },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 25,
        diceThreshold: 16,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['shock', 'knockback'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d8',
            damageType: 'lightning',
            isDot: false,
            dotDuration: 3,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    }
  },
  {
    id: 'void-totem',
    name: 'Void Totem',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'rare',
    description: 'A totem that seems to drink the light around it. Your attacks sometimes strike fear into your enemies, making them flee.',
    iconId: 'Misc/Books/book-brown-teal-question-mark',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      intelligence: { value: 4, isPercentage: false },
      spirit: { value: -1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          shadow: { value: 5, isPercentage: false },
          psychic: { value: 3, isPercentage: false }
        }
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
            saveType: 'wisdom',
            knockbackDistance: 10,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      resistances: {
        shadow: { value: 5, isPercentage: false }
      },
      conditionModifiers: {
        frightened: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by this condition',
          color: '#4caf50'
        },
        charmed: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      }
    }
  },

  // === EPIC ACCESSORIES WITH POWERFUL EFFECTS ===
  {
    id: 'phoenix-heart-ring',
    name: 'Phoenix Heart Ring',
    type: 'accessory',
    subtype: 'RING',
    quality: 'epic',
    description: 'A ring set with a phoenix feather that pulses with eternal flame. Your attacks burn your enemies, and sometimes the fire stuns them.',
    iconId: 'Armor/Finger/finger-red-gem-golden-ring',
    value: { gold: 10, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['finger'],
    baseStats: {
      strength: { value: 4, isPercentage: false },
      intelligence: { value: 4, isPercentage: false },
      constitution: { value: 2, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          fire: { value: 10, isPercentage: false }
        }
      },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 30,
        diceThreshold: 15,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['burning', 'stun'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '2d6',
            damageType: 'fire',
            isDot: true,
            dotDuration: 3,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      resistances: {
        fire: { value: 10, isPercentage: false }
      }
    }
  },
  {
    id: 'stormlord-amulet',
    name: 'Stormlord Amulet',
    type: 'accessory',
    subtype: 'NECKLACE',
    quality: 'epic',
    description: 'An amulet that commands the fury of storms. Your attacks call down lightning, shocking and knocking back your enemies.',
    iconId: 'Armor/Neck/glowing-orb-pendant',
    value: { gold: 10, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['neck'],
    baseStats: {
      intelligence: { value: 6, isPercentage: false },
      spirit: { value: 4, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          lightning: { value: 10, isPercentage: false },
          arcane: { value: 5, isPercentage: false }
        }
      },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 35,
        diceThreshold: 14,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['shock', 'knockback'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '2d8',
            damageType: 'lightning',
            isDot: false,
            dotDuration: 3,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      resistances: {
        lightning: { value: 10, isPercentage: false }
      }
    }
  },
  {
    id: 'soul-harvester',
    name: 'Soul Harvester',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'epic',
    description: 'A totem that harvests souls. Your attacks drain the life from your enemies, healing you and striking fear into their hearts.',
    iconId: 'Misc/Books/book-brown-teal-question-mark',
    value: { gold: 10, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      intelligence: { value: 5, isPercentage: false },
      spirit: { value: -2, isPercentage: false },
      constitution: { value: 3, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          necrotic: { value: 10, isPercentage: false },
          shadow: { value: 7, isPercentage: false }
        }
      },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 25,
        diceThreshold: 16,
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
            saveDC: 17,
            saveType: 'wisdom',
            knockbackDistance: 10,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      maxHealth: { value: 25, isPercentage: false },
      resistances: {
        necrotic: { value: 10, isPercentage: false },
        shadow: { value: 8, isPercentage: false }
      }
    }
  },

  // === CLOAKS ===
  {
    id: 'tattered-cloak',
    name: 'Tattered Cloak',
    type: 'accessory',
    subtype: 'CLOAK',
    quality: 'poor',
    description: 'A worn cloak that has seen better days. Offers minimal protection from the elements, but barely.',
    iconId: 'Armor/Back/back-cape-brown-tattered',
    value: { gold: 0, silver: 2, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['back'],
    baseStats: {
      constitution: { value: 1, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    combatStats: {
      resistances: {
        cold: { value: 1, isPercentage: false }
      }
    }
  },
  {
    id: 'travelers-cloak',
    name: 'Traveler\'s Cloak',
    type: 'accessory',
    subtype: 'CLOAK',
    quality: 'common',
    description: 'A practical cloak designed for long journeys. Keeps the wind and rain at bay, but weighs you down slightly.',
    iconId: 'Armor/Back/back-cape-brown-tattered',
    value: { gold: 0, silver: 5, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['back'],
    baseStats: {
      constitution: { value: 2, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    combatStats: {
      resistances: {
        cold: { value: 3, isPercentage: false }
      }
    }
  },
  {
    id: 'shadow-cloak',
    name: 'Shadow Cloak',
    type: 'accessory',
    subtype: 'CLOAK',
    quality: 'uncommon',
    description: 'A dark cloak that seems to drink the light. Makes you harder to see, but feels unsettling to wear.',
    iconId: 'Armor/Back/back-cape-brown-tattered',
    value: { gold: 0, silver: 8, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['back'],
    baseStats: {
      agility: { value: 2, isPercentage: false },
      intelligence: { value: 1, isPercentage: false },
      spirit: { value: -1, isPercentage: false }
    },
    combatStats: {
      resistances: {
        shadow: { value: 5, isPercentage: false }
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

  // === NEW ITEMS WITH CONDITION MODIFIERS ===
  {
    id: 'ward-of-protection',
    name: 'Ward of Protection',
    type: 'accessory',
    subtype: 'RING',
    quality: 'uncommon',
    description: 'A silver ring inscribed with protective runes. Grants advantage against mental conditions and immunity to being charmed.',
    iconId: 'Armor/Finger/finger-ancient-bronze-ring',
    value: { gold: 1, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['finger'],
    baseStats: {
      spirit: { value: 2, isPercentage: false }
    },
    combatStats: {
      conditionModifiers: {
        charmed: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by this condition',
          color: '#4caf50'
        },
        frightened: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
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
  {
    id: 'iron-will-amulet',
    name: 'Iron Will Amulet',
    type: 'accessory',
    subtype: 'NECKLACE',
    quality: 'rare',
    description: 'A heavy iron amulet that fortifies the mind. Grants double advantage against mental conditions and immunity to being stunned.',
    iconId: 'Armor/Neck/teal-crystal-pendant',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['neck'],
    baseStats: {
      spirit: { value: 4, isPercentage: false },
      constitution: { value: 2, isPercentage: false }
    },
    combatStats: {
      conditionModifiers: {
        stunned: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by this condition',
          color: '#4caf50'
        },
        charmed: {
          modifier: 'double_advantage',
          label: 'Double Advantage',
          description: 'Roll three times, take the highest result',
          color: '#2e7d32'
        },
        frightened: {
          modifier: 'double_advantage',
          label: 'Double Advantage',
          description: 'Roll three times, take the highest result',
          color: '#2e7d32'
        }
      }
    }
  },
  {
    id: 'poison-ward-trinket',
    name: 'Poison Ward Trinket',
    type: 'accessory',
    subtype: 'TRINKET',
    quality: 'common',
    description: 'A small jade charm that glows faintly green. Grants immunity to poison and advantage against disease.',
    iconId: 'Misc/Books/book-brown-teal-question-mark',
    value: { gold: 0, silver: 7, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['trinket'],
    baseStats: {
      constitution: { value: 1, isPercentage: false }
    },
    combatStats: {
      conditionModifiers: {
        poisoned: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by this condition',
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
    id: 'freedom-ring',
    name: 'Ring of Freedom',
    type: 'accessory',
    subtype: 'RING',
    quality: 'uncommon',
    description: 'A ring that seems to shimmer with inner light. Grants immunity to being paralyzed or restrained.',
    iconId: 'Armor/Finger/finger-brown-braided-ring',
    value: { gold: 1, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['finger'],
    baseStats: {
      agility: { value: 2, isPercentage: false }
    },
    combatStats: {
      conditionModifiers: {
        paralyzed: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by this condition',
          color: '#4caf50'
        },
        restrained: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by this condition',
          color: '#4caf50'
        },
        grappled: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      }
    }
  },
  {
    id: 'silence-ward',
    name: 'Silence Ward',
    type: 'accessory',
    subtype: 'NECKLACE',
    quality: 'common',
    description: 'A silver pendant that protects against magical silence. Grants immunity to being silenced.',
    iconId: 'Armor/Neck/teal-gem-emblem-pendant',
    value: { gold: 0, silver: 6, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['neck'],
    baseStats: {
      intelligence: { value: 1, isPercentage: false },
      spirit: { value: 1, isPercentage: false }
    },
    combatStats: {
      conditionModifiers: {
        silenced: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by this condition',
          color: '#4caf50'
        }
      }
    }
  }
];
