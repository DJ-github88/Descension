export const ENRICHED_ARMOR = [
  // === UNCOMMON ARMOR ===
  {
    id: 'ash-weave-mantle',
    name: 'Ash-Weave Mantle',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'uncommon',
    description: 'Woven from the soot-stained threads of the Ashlands, these pauldrons still carry the warmth of a fire that never fully died. The embers embedded within flicker when danger draws near.',
    iconId: 'Armor/Shoulder/shoulder-pauldron-rustic-leather-brown-tan-jagged-layered',
    value: { gold: 1, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['shoulders'],
    baseStats: {
      spirit: { value: 2, isPercentage: false },
      intelligence: { value: 1, isPercentage: false }
    },
    combatStats: {
      resistances: {
        ember: { value: 5, isPercentage: false }
      },
      conditionModifiers: {
        burning: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },
  {
    id: 'rime-scale-vest',
    name: 'Rime-Scale Vest',
    type: 'armor',
    subtype: 'LEATHER',
    quality: 'uncommon',
    description: 'Leather hardened by the breath of the Frost Wyrms of the northern reaches. Each scale still carries a bitter cold that seeps into the bones of anyone foolish enough to strike it.',
    iconId: 'Armor/Chest/chest-barbarian-leather-tunic',
    value: { gold: 1, silver: 5, copper: 0 },
    stackable: false,
    width: 2,
    height: 3,
    rotation: 0,
    slots: ['chest'],
    baseStats: {
      constitution: { value: 2, isPercentage: false },
      agility: { value: 1, isPercentage: false }
    },
    combatStats: {
      resistances: {
        cold: { value: 6, isPercentage: false }
      },
      conditionModifiers: {
        frozen: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
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
        customEffects: ['frozen'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d6',
            damageType: 'rime',
            isDot: false,
            dotDuration: 2,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },
  {
    id: 'storm-woven-chain',
    name: 'Storm-Woven Chain',
    type: 'armor',
    subtype: 'MAIL',
    quality: 'uncommon',
    description: 'Chainmail links forged during a tempest that lasted forty days. The metal still hums with trapped lightning, crackling faintly in the dark before a storm.',
    iconId: 'Armor/Chest/chest-segmented-brown-cuirass',
    value: { gold: 1, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['chest'],
    baseStats: {
      constitution: { value: 1, isPercentage: false },
      strength: { value: 1, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    combatStats: {
      resistances: {
        storm: { value: 5, isPercentage: false }
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
        customEffects: ['shock'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d4',
            damageType: 'storm',
            isDot: false,
            dotDuration: 2,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },
  {
    id: 'shadow-step-cloak',
    name: 'Shadow-Step Cloak',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'uncommon',
    description: 'A mantle that was once a funeral shroud in the Umbral Crypts. Those who wear it feel the edges of the world soften, as if reality itself is willing to let them slip through.',
    iconId: 'Armor/Shoulder/shoulder-pauldron-teal-brown-beige-ceremonial-symmetrical',
    value: { gold: 1, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['shoulders'],
    baseStats: {
      agility: { value: 3, isPercentage: false },
      intelligence: { value: 1, isPercentage: false }
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
    },
    durability: 'd10',
    maxDurability: 'd10'
  },
  {
    id: 'blight-resistant-greaves',
    name: 'Blight-Resistant Greaves',
    type: 'armor',
    subtype: 'LEATHER',
    quality: 'uncommon',
    description: 'Greaves treated with the sap of the Ironbloom tree, a species that thrives in the Blightmire. They carry the faint smell of rot overcome — of life refusing to yield.',
    iconId: 'Armor/Leggings/leggings-brown-waistband-pants',
    value: { gold: 1, silver: 5, copper: 0 },
    stackable: false,
    width: 2,
    height: 3,
    rotation: 0,
    slots: ['legs'],
    baseStats: {
      constitution: { value: 2, isPercentage: false },
      agility: { value: 1, isPercentage: false }
    },
    combatStats: {
      resistances: {
        blight: { value: 4, isPercentage: false },
        poison: { value: 2, isPercentage: false }
      },
      conditionModifiers: {
        poisoned: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },
  {
    id: 'wyrd-touched-circlet',
    name: 'Wyrd-Touched Circlet',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'uncommon',
    description: 'A circlet forged from bone and wyrdstone, salvaged from the ruins of the Old Circle. The whispers it channels are maddening to most, but to a prepared mind they reveal truths hidden since the Shattering.',
    iconId: 'Armor/Head/head-beige-fedora-hat',
    value: { gold: 1, silver: 5, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['head'],
    baseStats: {
      intelligence: { value: 2, isPercentage: false },
      spirit: { value: 2, isPercentage: false }
    },
    combatStats: {
      resistances: {
        wyrd: { value: 5, isPercentage: false },
        arcane: { value: 2, isPercentage: false }
      },
      conditionModifiers: {
        confused: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'sacred-bulwark',
    name: 'Sacred-Bulwark',
    type: 'armor',
    subtype: 'MAIL',
    quality: 'uncommon',
    description: 'A chain hauberk blessed at the Altar of the Last Dawn. Its rings glow faintly with golden light when enemies of the faithful draw near, as if the armor itself remembers the prayers once whispered over it.',
    iconId: 'Armor/Chest/chest-segmented-brown-cuirass',
    value: { gold: 1, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['chest'],
    baseStats: {
      strength: { value: 2, isPercentage: false },
      spirit: { value: 1, isPercentage: false }
    },
    combatStats: {
      resistances: {
        sacred: { value: 5, isPercentage: false },
        physical: { value: 3, isPercentage: false }
      },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 15,
        diceThreshold: 17,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['radiant_burn'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d6',
            damageType: 'sacred',
            isDot: false,
            dotDuration: 2,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd12',
    maxDurability: 'd12'
  },
  {
    id: 'tide-callers-belt',
    name: "Tide-Caller's Belt",
    type: 'armor',
    subtype: 'LEATHER',
    quality: 'uncommon',
    description: 'A belt carved from the hide of a deep-sea leviathan, its buckle shaped like a cresting wave. Those who wear it can feel the pressure of the ocean floor and the crack of distant storms.',
    iconId: 'Armor/Waist/brown-belt-buckle',
    value: { gold: 1, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['waist'],
    baseStats: {
      constitution: { value: 1, isPercentage: false },
      agility: { value: 2, isPercentage: false }
    },
    combatStats: {
      resistances: {
        storm: { value: 3, isPercentage: false },
        cold: { value: 3, isPercentage: false }
      },
      conditionModifiers: {
        frozen: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },

  // === RARE ARMOR ===
  {
    id: 'inferno-plate',
    name: 'Inferno-Plate',
    type: 'armor',
    subtype: 'PLATE',
    quality: 'rare',
    description: 'Plate armor forged in the heart of the Maw, where the earth bleeds fire. The metal pulses like living tissue, radiating waves of heat that warp the air and wither anything that lingers too close.',
    iconId: 'Armor/Chest/chest-bronze-breastplate',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 3,
    height: 3,
    rotation: 0,
    slots: ['chest'],
    baseStats: {
      constitution: { value: 3, isPercentage: false },
      agility: { value: -2, isPercentage: false }
    },
    combatStats: {
      resistances: {
        ember: { value: 10, isPercentage: false },
        physical: { value: 5, isPercentage: false }
      },
      conditionModifiers: {
        burning: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by burning',
          color: '#4caf50'
        }
      },
      maxHealth: { value: 15, isPercentage: false },
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
            formula: '1d8',
            damageType: 'ember',
            isDot: true,
            dotDuration: 2,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd20',
    maxDurability: 'd20'
  },
  {
    id: 'frost-warden-helm',
    name: 'Frost-Warden Helm',
    type: 'armor',
    subtype: 'PLATE',
    quality: 'rare',
    description: 'A helm recovered from the corpse of the last Frost Warden, who stood sentinel over the Glacier Gate for three centuries without rest. The ice that coats its visor has never melted, even in the heart of summer.',
    iconId: 'Armor/Head/head-rusty-worn-helmet',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['head'],
    baseStats: {
      constitution: { value: 2, isPercentage: false },
      strength: { value: 1, isPercentage: false }
    },
    combatStats: {
      resistances: {
        cold: { value: 8, isPercentage: false },
        physical: { value: 3, isPercentage: false }
      },
      conditionModifiers: {
        frozen: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by freezing',
          color: '#4caf50'
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
        customEffects: ['frozen'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'freeze',
            controlDuration: 1,
            saveDC: 14,
            saveType: 'constitution',
            knockbackDistance: 10,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd12',
    maxDurability: 'd12'
  },
  {
    id: 'tempest-guard',
    name: 'Tempest-Guard',
    type: 'armor',
    subtype: 'MAIL',
    quality: 'rare',
    description: 'Chainmail woven from storm-forged adamant strands, salvaged from the ruins of the Spire of Winds. Lightning arcs between its links during combat, turning the wearer into a living conduit of the sky\'s fury.',
    iconId: 'Armor/Chest/chest-segmented-brown-cuirass',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['chest'],
    baseStats: {
      constitution: { value: 2, isPercentage: false },
      agility: { value: 1, isPercentage: false }
    },
    combatStats: {
      resistances: {
        storm: { value: 8, isPercentage: false },
        arcane: { value: 3, isPercentage: false }
      },
      maxHealth: { value: 10, isPercentage: false },
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
        customEffects: ['shock', 'knockback'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d8',
            damageType: 'storm',
            isDot: false,
            dotDuration: 2,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd12',
    maxDurability: 'd12'
  },
  {
    id: 'void-shroud',
    name: 'Void-Shroud',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'rare',
    description: 'A robe cut from the fabric of the abyss between worlds. It has no weight, yet those who wear it feel an immense pressure — as if the void itself is pressing in from all sides, waiting to reclaim what was stolen from it.',
    iconId: 'Armor/Chest/chest-tattered-brown-robe',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['chest'],
    baseStats: {
      intelligence: { value: 3, isPercentage: false },
      spirit: { value: 2, isPercentage: false }
    },
    combatStats: {
      resistances: {
        shadow: { value: 8, isPercentage: false },
        wyrd: { value: 5, isPercentage: false }
      },
      conditionModifiers: {
        frightened: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by fear',
          color: '#4caf50'
        },
        charmed: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      },
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 20,
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
      }
    },
    durability: 'd12',
    maxDurability: 'd12'
  },
  {
    id: 'arcane-aegis',
    name: 'Arcane-Aegis',
    type: 'armor',
    subtype: 'PLATE',
    quality: 'rare',
    description: 'Full plate inscribed with the Unbreaking Sigil by the last Archon of the Shattered Tower. Its runes absorb magical energy and redirect it outward, making it as much a weapon against spellcasters as it is a shield.',
    iconId: 'Armor/Chest/chest-bronze-breastplate',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 3,
    height: 3,
    rotation: 0,
    slots: ['chest'],
    baseStats: {
      intelligence: { value: 2, isPercentage: false },
      constitution: { value: 2, isPercentage: false }
    },
    combatStats: {
      resistances: {
        arcane: { value: 8, isPercentage: false },
        force: { value: 3, isPercentage: false }
      },
      conditionModifiers: {
        silenced: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be silenced',
          color: '#4caf50'
        },
        confused: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      },
      maxHealth: { value: 10, isPercentage: false },
      spellDamage: {
        types: {
          arcane: { value: 3, isPercentage: false }
        }
      }
    },
    durability: 'd12',
    maxDurability: 'd12'
  },
  {
    id: 'plague-doctors-mask',
    name: "Plague-Doctor's Mask",
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'rare',
    description: 'A mask worn by the last surviving physician of the Rotting Fields, who treated the dying until the plague claimed them all. The herbs packed within its beak never need replacing, and they filter the air of all corruption.',
    iconId: 'Armor/Head/head-brown-fedora-hat',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['head'],
    baseStats: {
      intelligence: { value: 3, isPercentage: false },
      constitution: { value: 1, isPercentage: false }
    },
    combatStats: {
      resistances: {
        blight: { value: 8, isPercentage: false },
        poison: { value: 5, isPercentage: false }
      },
      conditionModifiers: {
        poisoned: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by poison',
          color: '#4caf50'
        },
        diseased: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by disease',
          color: '#4caf50'
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },
  {
    id: 'wyrd-lock-gauntlets',
    name: 'Wyrd-Lock Gauntlets',
    type: 'armor',
    subtype: 'PLATE',
    quality: 'rare',
    description: 'Gauntlets forged from wyrd-iron, a metal that exists partially outside of reality. Each finger joint moves with unnatural precision, as if guided by an invisible hand that knows what the wearer intends before they do.',
    iconId: 'Armor/Wrist/winged-bracer',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['wrists'],
    baseStats: {
      intelligence: { value: 2, isPercentage: false },
      strength: { value: 1, isPercentage: false }
    },
    combatStats: {
      resistances: {
        wyrd: { value: 6, isPercentage: false },
        arcane: { value: 4, isPercentage: false }
      },
      conditionModifiers: {
        silenced: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be silenced',
          color: '#4caf50'
        },
        confused: {
          modifier: 'double_advantage',
          label: 'Double Advantage',
          description: 'Roll three times, take the highest result',
          color: '#2e7d32'
        }
      }
    },
    durability: 'd12',
    maxDurability: 'd12'
  },
  {
    id: 'sacred-judicators-plate',
    name: "Sacred-Judicator's Plate",
    type: 'armor',
    subtype: 'PLATE',
    quality: 'rare',
    description: 'The ceremonial armor of Dawn Vigil inquisitors, worn during the Great Revision tribunals. It was last seen on the body of Judicator Veylan, who burned at the stake rather than remove it — some say the light within chose its wearer, not the other way around.',
    iconId: 'Armor/Chest/chest-bronze-breastplate',
    value: { gold: 8, silver: 0, copper: 0 },
    stackable: false,
    width: 3,
    height: 3,
    rotation: 0,
    slots: ['chest'],
    baseStats: {
      constitution: { value: 3, isPercentage: false },
      spirit: { value: 2, isPercentage: false }
    },
    combatStats: {
      resistances: {
        sacred: { value: 10, isPercentage: false },
        shadow: { value: 5, isPercentage: false }
      },
      conditionModifiers: {
        charmed: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be charmed',
          color: '#4caf50'
        },
        frightened: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be frightened',
          color: '#4caf50'
        }
      },
      maxHealth: { value: 20, isPercentage: false },
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
        customEffects: ['radiant_burn'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '2d6',
            damageType: 'sacred',
            isDot: false,
            dotDuration: 2,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd20',
    maxDurability: 'd20'
  },
  {
    id: 'force-ward-vambraces',
    name: 'Force-Ward Vambraces',
    type: 'armor',
    subtype: 'MAIL',
    quality: 'rare',
    description: 'Vambraces forged by the Kinetic Order, disciples who learned to channel raw force through their bodies. When a blow lands, the vambraces store the kinetic energy and release it outward in a devastating shockwave.',
    iconId: 'Armor/Wrist/segmented-shell-bracer',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['wrists'],
    baseStats: {
      strength: { value: 2, isPercentage: false },
      constitution: { value: 1, isPercentage: false }
    },
    combatStats: {
      resistances: {
        force: { value: 8, isPercentage: false },
        physical: { value: 4, isPercentage: false }
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
        customEffects: ['knockback'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d6',
            damageType: 'arcane',
            isDot: false,
            dotDuration: 2,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd12',
    maxDurability: 'd12'
  },
  {
    id: 'psychic-dampener',
    name: 'Psychic-Dampener',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'rare',
    description: 'A circlet of cold iron threaded with wyrdstone dust, crafted by the Dreamwalkers of the Pale Court. It wraps the mind in a layer of psychic static, turning the whispers of hive minds and dominators into meaningless noise.',
    iconId: 'Armor/Head/head-beige-fedora-hat',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['head'],
    baseStats: {
      intelligence: { value: 3, isPercentage: false },
      spirit: { value: 2, isPercentage: false }
    },
    combatStats: {
      resistances: {
        psychic: { value: 8, isPercentage: false },
        shadow: { value: 3, isPercentage: false }
      },
      conditionModifiers: {
        charmed: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be charmed',
          color: '#4caf50'
        },
        confused: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be confused',
          color: '#4caf50'
        },
        frightened: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },

  // === EPIC ARMOR ===
  {
    id: 'suns-coremantle',
    name: "Sun's Core-Mantle",
    type: 'armor',
    subtype: 'PLATE',
    quality: 'epic',
    description: 'Armor that was once the carapace of a Solar Wurm, the mythical serpent said to circle the sun. The metal glows with an inner radiance that never dims, casting warmth and golden light even in the deepest abyss.',
    iconId: 'Armor/Chest/chest-bronze-breastplate',
    value: { gold: 10, silver: 0, copper: 0 },
    stackable: false,
    width: 3,
    height: 3,
    rotation: 0,
    slots: ['chest'],
    baseStats: {
      constitution: { value: 4, isPercentage: false },
      spirit: { value: 2, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    combatStats: {
      resistances: {
        ember: { value: 15, isPercentage: false },
        sacred: { value: 10, isPercentage: false },
        physical: { value: 5, isPercentage: false }
      },
      conditionModifiers: {
        burning: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be affected by burning',
          color: '#4caf50'
        }
      },
      maxHealth: { value: 30, isPercentage: false },
      spellDamage: {
        types: {
          sacred: { value: 4, isPercentage: false }
        }
      },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 25,
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
      }
    },
    durability: 'd20',
    maxDurability: 'd20'
  },
  {
    id: 'absolute-zero',
    name: 'Absolute-Zero',
    type: 'armor',
    subtype: 'PLATE',
    quality: 'epic',
    description: 'Full plate forged at the bottom of the Eternal Glacier, where the cold is so profound that motion itself stops. The armor radiates a killing chill — grass withers in its shadow and water turns to ice at its touch.',
    iconId: 'Armor/Chest/chest-bronze-breastplate',
    value: { gold: 10, silver: 0, copper: 0 },
    stackable: false,
    width: 3,
    height: 3,
    rotation: 0,
    slots: ['chest'],
    baseStats: {
      constitution: { value: 4, isPercentage: false },
      strength: { value: 2, isPercentage: false }
    },
    combatStats: {
      resistances: {
        cold: { value: 15, isPercentage: false },
        storm: { value: 8, isPercentage: false },
        physical: { value: 5, isPercentage: false }
      },
      conditionModifiers: {
        frozen: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be frozen',
          color: '#4caf50'
        },
        shocked: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      },
      maxHealth: { value: 25, isPercentage: false },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 25,
        diceThreshold: 14,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['frozen'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'freeze',
            controlDuration: 2,
            saveDC: 16,
            saveType: 'constitution',
            knockbackDistance: 10,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd20',
    maxDurability: 'd20'
  },
  {
    id: 'thunder-sovereigns-guard',
    name: "Thunder-Sovereign's Guard",
    type: 'armor',
    subtype: 'PLATE',
    quality: 'epic',
    description: 'The war-plate of the Thunder Sovereign, the ancient storm-deity torn from the sky during the Great Fracture. His lightning still courses through the metal, and those who wear it hear the roar of a storm that has never ended.',
    iconId: 'Armor/Chest/chest-bronze-breastplate',
    value: { gold: 10, silver: 0, copper: 0 },
    stackable: false,
    width: 3,
    height: 3,
    rotation: 0,
    slots: ['chest'],
    baseStats: {
      constitution: { value: 3, isPercentage: false },
      strength: { value: 3, isPercentage: false },
      agility: { value: -2, isPercentage: false }
    },
    combatStats: {
      resistances: {
        storm: { value: 15, isPercentage: false },
        arcane: { value: 8, isPercentage: false },
        force: { value: 5, isPercentage: false }
      },
      conditionModifiers: {
        stunned: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        },
        shocked: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be shocked',
          color: '#4caf50'
        }
      },
      maxHealth: { value: 30, isPercentage: false },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 28,
        diceThreshold: 13,
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
            damageType: 'storm',
            isDot: false,
            dotDuration: 2,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd20',
    maxDurability: 'd20'
  },
  {
    id: 'shadow-of-the-void',
    name: 'Shadow-of-the-Void',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'epic',
    description: 'A robe that exists in two places at once — here, and nowhere. Woven from the absence of light that fills the space between stars, it renders the wearer difficult to perceive and even harder to influence through force of will.',
    iconId: 'Armor/Chest/chest-tattered-brown-robe',
    value: { gold: 10, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['chest'],
    baseStats: {
      intelligence: { value: 4, isPercentage: false },
      spirit: { value: 3, isPercentage: false }
    },
    combatStats: {
      resistances: {
        shadow: { value: 15, isPercentage: false },
        wyrd: { value: 10, isPercentage: false },
        blight: { value: 8, isPercentage: false }
      },
      conditionModifiers: {
        frightened: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be frightened',
          color: '#4caf50'
        },
        charmed: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be charmed',
          color: '#4caf50'
        },
        confused: {
          modifier: 'double_advantage',
          label: 'Double Advantage',
          description: 'Roll three times, take the highest result',
          color: '#2e7d32'
        }
      },
      maxHealth: { value: 20, isPercentage: false },
      spellDamage: {
        types: {
          shadow: { value: 5, isPercentage: false }
        }
      },
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 30,
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
            saveDC: 17,
            saveType: 'spirit',
            knockbackDistance: 10,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd20',
    maxDurability: 'd20'
  },
  {
    id: 'arcane-perfection',
    name: 'Arcane-Perfection',
    type: 'armor',
    subtype: 'CLOTH',
    quality: 'epic',
    description: 'The final creation of the Circle of Seven, who spent their collective lifetimes weaving a single garment of pure magical energy. It hardens to ward blows, channels spells with impossible efficiency, and protects the mind from all intrusion.',
    iconId: 'Armor/Chest/chest-tattered-brown-robe',
    value: { gold: 10, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['chest'],
    baseStats: {
      intelligence: { value: 5, isPercentage: false },
      spirit: { value: 3, isPercentage: false }
    },
    combatStats: {
      resistances: {
        arcane: { value: 15, isPercentage: false },
        force: { value: 10, isPercentage: false },
        wyrd: { value: 8, isPercentage: false }
      },
      conditionModifiers: {
        silenced: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be silenced',
          color: '#4caf50'
        },
        confused: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be confused',
          color: '#4caf50'
        },
        paralyzed: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      },
      maxHealth: { value: 15, isPercentage: false },
      spellDamage: {
        types: {
          arcane: { value: 6, isPercentage: false }
        }
      }
    },
    durability: 'd20',
    maxDurability: 'd20'
  },
  {
    id: 'blight-sovereigns-plate',
    name: "Blight-Sovereign's Plate",
    type: 'armor',
    subtype: 'PLATE',
    quality: 'epic',
    description: 'The armor of the Blight Sovereign, who ruled the Rotting Fields for a thousand years and was finally undone not by steel, but by the very rot they commanded. The corrosion that covers it is not decay — it is growth, hungry and alive.',
    iconId: 'Armor/Chest/chest-bronze-breastplate',
    value: { gold: 10, silver: 0, copper: 0 },
    stackable: false,
    width: 3,
    height: 3,
    rotation: 0,
    slots: ['chest'],
    baseStats: {
      constitution: { value: 4, isPercentage: false },
      strength: { value: 2, isPercentage: false }
    },
    combatStats: {
      resistances: {
        blight: { value: 15, isPercentage: false },
        poison: { value: 10, isPercentage: false },
        physical: { value: 5, isPercentage: false }
      },
      conditionModifiers: {
        poisoned: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be poisoned',
          color: '#4caf50'
        },
        diseased: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be diseased',
          color: '#4caf50'
        }
      },
      maxHealth: { value: 25, isPercentage: false },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 25,
        diceThreshold: 14,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['poisoned'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '2d6',
            damageType: 'blight',
            isDot: true,
            dotDuration: 4,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd20',
    maxDurability: 'd20'
  },
  {
    id: 'holy-terranova',
    name: 'Holy-Terranova',
    type: 'armor',
    subtype: 'PLATE',
    quality: 'epic',
    description: 'The living armor of the root-veil\'s last champion, a Dawn Vigil warden who merged with the land itself during the Siege of Solbrand. The plate is half metal, half petrified root — and it still draws strength from the ground beneath the wearer.',
    iconId: 'Armor/Chest/chest-bronze-breastplate',
    value: { gold: 10, silver: 0, copper: 0 },
    stackable: false,
    width: 3,
    height: 3,
    rotation: 0,
    slots: ['chest'],
    baseStats: {
      constitution: { value: 4, isPercentage: false },
      spirit: { value: 3, isPercentage: false },
      strength: { value: 1, isPercentage: false }
    },
    combatStats: {
      resistances: {
        sacred: { value: 12, isPercentage: false },
        ember: { value: 10, isPercentage: false },
        shadow: { value: 8, isPercentage: false }
      },
      conditionModifiers: {
        charmed: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be charmed',
          color: '#4caf50'
        },
        frightened: {
          modifier: 'immune',
          label: 'Immune',
          description: 'Cannot be frightened',
          color: '#4caf50'
        },
        burning: {
          modifier: 'advantage',
          label: 'Advantage',
          description: 'Roll twice, take the higher result',
          color: '#4caf50'
        }
      },
      maxHealth: { value: 35, isPercentage: false },
      spellDamage: {
        types: {
          sacred: { value: 5, isPercentage: false }
        }
      },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 28,
        diceThreshold: 13,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['radiant_burn'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '2d8',
            damageType: 'sacred',
            isDot: false,
            dotDuration: 2,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd20',
    maxDurability: 'd20'
  }
];
