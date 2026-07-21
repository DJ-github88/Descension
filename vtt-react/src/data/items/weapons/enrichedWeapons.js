/**
 * Enriched Weapons
 *
 * Weapons with onHitEffects proc systems using dice, cards, or coins.
 * Each weapon features a unique proc mechanic tied to its lore and origin.
 */

export const ENRICHED_WEAPONS = [

  // ══════════════════════════════════════════════════════════════════════
  // UNCOMMON (15 items, diceThreshold 17–18)
  // ══════════════════════════════════════════════════════════════════════

  // 1
  {
    id: 'cinder-fang',
    name: 'Cinder-Fang',
    type: 'weapon',
    subtype: 'DAGGER',
    quality: 'uncommon',
    description: 'A obsidian-tooth dagger from the Solbrand forges. Its edge smolders faintly, leaving trails of cinder-glow that eat into flesh long after the cut fades.',
    iconId: 'Weapons/Throwing Knife/throwing-knife-dagger-beige-blade-brown-handle-wrapped',
    value: { gold: 0, silver: 45, copper: 0 },
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
        diceType: 'd4',
        damageType: 'physical',
        bonusDamage: 2
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false }
    },
    combatStats: {
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
      spellDamage: {
        types: {
          ember: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },

  // 2
  {
    id: 'rime-thorn',
    name: 'Rime-Thorn',
    type: 'weapon',
    subtype: 'SPEAR',
    quality: 'uncommon',
    description: 'Harvested from the Frostwood Reach during deepwinter, this spear\'s haft is frozen pine and its tip a shard of permafrost that slows the blood of anything it pierces.',
    iconId: 'Weapons/Polearm/polearm-spear-staff-brown-wrapped-light-tip',
    value: { gold: 0, silver: 50, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'physical',
        bonusDamage: 1
      }
    },
    baseStats: {
      strength: { value: 1, isPercentage: false },
      constitution: { value: 1, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['freeze'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'freeze',
            controlDuration: 1,
            saveDC: 12,
            saveType: 'constitution',
            knockbackDistance: 0,
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          cold: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },

  // 3
  {
    id: 'gale-lash',
    name: 'Gale-Lash',
    type: 'weapon',
    subtype: 'FLAIL',
    quality: 'uncommon',
    description: 'A chain-whip braided with strands of Iceheart Sea copper that crackle with static charge. Nordhalla raiders call it the Stormrider\'s Kiss.',
    iconId: 'Weapons/Flail/flail-brown-handle-chain-spiked-balls',
    value: { gold: 0, silver: 50, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'physical',
        bonusDamage: 1
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false }
    },
    combatStats: {
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
            formula: '1d6',
            damageType: 'storm',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          storm: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },

  // 4
  {
    id: 'void-pricker',
    name: 'Void-Pricker',
    type: 'weapon',
    subtype: 'KATAR',
    quality: 'uncommon',
    description: 'A Bryngloom fist-blade etched with void-runes that whisper of the space between heartbeats. Those struck by it report a creeping dread that follows them for days.',
    iconId: 'Weapons/Throwing Knife/throwing-knife-dagger-beige-blade-brown-handle-wrapped',
    value: { gold: 0, silver: 55, copper: 0 },
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
        damageType: 'physical',
        bonusDamage: 2
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false },
      intelligence: { value: 1, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 28,
        diceThreshold: 17,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['fear'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'fear',
            controlDuration: 1,
            saveDC: 13,
            saveType: 'spirit',
            knockbackDistance: 0,
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          shadow: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },

  // 5
  {
    id: 'gravel-spitter',
    name: 'Gravel-Spitter',
    type: 'weapon',
    subtype: 'CROSSBOW',
    quality: 'uncommon',
    description: 'A crude Cragjaw scatter-crossbow that fires a fistful of jagged rock and iron shrapnel. Miners modified it to crack ore veins, but it works just as well on ribs.',
    iconId: 'Weapons/Crossbow/crossbow-reddish-brown-loaded',
    value: { gold: 0, silver: 40, copper: 0 },
    stackable: false,
    width: 2,
    height: 3,
    rotation: 0,
    slots: ['ranged'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd4',
        damageType: 'physical',
        bonusDamage: 1
      }
    },
    baseStats: {
      strength: { value: 1, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['knockback'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '2d4',
            damageType: 'force',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          force: { value: 1, isPercentage: false }
        }
      }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },

  // 6
  {
    id: 'bone-singers-flute',
    name: "Bone-Singer's Flute",
    type: 'weapon',
    subtype: 'LUTE',
    quality: 'uncommon',
    description: 'Carved from the femur of a Bryngloom wight and strung with sinew. Its melody stitches flesh and knits bone, though the songs it plays were never meant for the living.',
    iconId: 'Instruments/Lute/lute-orange-golden-octagonal',
    value: { gold: 0, silver: 55, copper: 0 },
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
        diceType: 'd4',
        damageType: 'sacred',
        bonusDamage: 1
      }
    },
    baseStats: {
      spirit: { value: 2, isPercentage: false },
      intelligence: { value: 1, isPercentage: false }
    },
    combatStats: {
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
        customEffects: [],
        useRollableTable: false,
        effect: {
          effectType: 'healing',
          effectConfig: {
            formula: '1d4',
            damageType: 'sacred',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          sacred: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },

  // 7
  {
    id: 'rust-eater',
    name: 'Rust-Eater',
    type: 'weapon',
    subtype: 'SHORTSWORD',
    quality: 'uncommon',
    description: 'A Sundrift Vale blade coated in a slow-acting venom distilled from blight-lily nectar. The poison rusts armor from the inside and turns veins the color of old copper.',
    iconId: 'Weapons/Swords/sword-basic-straight-tan-blade-brown-hilt',
    value: { gold: 0, silver: 45, copper: 0 },
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
        damageType: 'physical',
        bonusDamage: 1
      }
    },
    baseStats: {
      agility: { value: 1, isPercentage: false },
      intelligence: { value: 1, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['slow'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d6',
            damageType: 'poison',
            isDot: true,
            dotDuration: 3,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          poison: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },

  // 8
  {
    id: 'thorn-lash-kama',
    name: 'Thorn-Lash Kama',
    type: 'weapon',
    subtype: 'KAMA',
    quality: 'uncommon',
    description: 'A reaper\'s tool repurposed for war in the rice paddies of the southern marches. Its inward-curving blade hooks weapon-hands and yanks them free with practiced cruelty.',
    iconId: 'Weapons/Sickles/sickle-curved-blade-beige-brown-handle-simple',
    value: { gold: 0, silver: 40, copper: 0 },
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
        damageType: 'physical',
        bonusDamage: 2
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['disarm'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'disarm',
            controlDuration: 1,
            saveDC: 12,
            saveType: 'dexterity',
            knockbackDistance: 0,
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {}
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },

  // 9
  {
    id: 'sun-scorn',
    name: 'Sun-Scorn',
    type: 'weapon',
    subtype: 'MACE',
    quality: 'uncommon',
    description: 'A Solbrand holy-mace whose head is a stylized sunburst of blackened bronze. It was carried by excommunicated Sol-priests who still believed, even after the Order turned them out.',
    iconId: 'Weapons/Mace/mace-spiked-club-brown-tan-rustic',
    value: { gold: 0, silver: 50, copper: 0 },
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
        damageType: 'physical',
        bonusDamage: 1
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      spirit: { value: 1, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['burning'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d8',
            damageType: 'sacred',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          sacred: { value: 3, isPercentage: false }
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },

  // 10
  {
    id: 'wraith-bite',
    name: 'Wraith-Bite',
    type: 'weapon',
    subtype: 'RAPIER',
    quality: 'uncommon',
    description: 'A Bryngloom duelist\'s blade whose steel has drunk deeply of wraith-blood. It strikes like a needle of cold shadow, leaving wounds that whisper in the dark.',
    iconId: 'Weapons/Rapier/rapier-curved-blade-rusty-bronze-orange-brown-aged',
    value: { gold: 0, silver: 55, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'physical',
        bonusDamage: 1
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false },
      intelligence: { value: 1, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 25,
        diceThreshold: 17,
        cardProcRule: 'specific_suit',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'spades',
        spellEffect: null,
        customEffects: ['fear'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d8',
            damageType: 'shadow',
            isDot: true,
            dotDuration: 2,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          shadow: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },

  // 11
  {
    id: 'storm-pike',
    name: 'Storm-Pike',
    type: 'weapon',
    subtype: 'POLEARM',
    quality: 'uncommon',
    description: 'A Nordhalla pike tipped with a shard of fulgurite — the glass left when lightning strikes stone. It hums before storms arrive, and its thrusts carry the weight of thunder.',
    iconId: 'Weapons/Polearm/polearm-halberd-axe-blade-spike-tan-metallic-guard',
    value: { gold: 0, silver: 50, copper: 0 },
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
        damageType: 'physical',
        bonusDamage: 1
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      constitution: { value: 1, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['shock', 'knockback'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d8',
            damageType: 'storm',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          storm: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },

  // 12
  {
    id: 'wyrd-whistle',
    name: 'Wyrd-Whistle',
    type: 'weapon',
    subtype: 'LUTE',
    quality: 'uncommon',
    description: 'A Cragjaw bone-flute carved from the hollow spine of a wyrm. Its notes unsettle the mind — playing the wrong melody can stun a room full of armed men.',
    iconId: 'Instruments/Lute/lute-orange-golden-octagonal',
    value: { gold: 0, silver: 55, copper: 0 },
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
        diceType: 'd4',
        damageType: 'wyrd',
        bonusDamage: 2
      }
    },
    baseStats: {
      spirit: { value: 2, isPercentage: false },
      intelligence: { value: 1, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'coins',
        procChance: 12,
        diceThreshold: 18,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['slow'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'stun',
            controlDuration: 1,
            saveDC: 13,
            saveType: 'intelligence',
            knockbackDistance: 0,
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          wyrd: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },

  // 13
  {
    id: 'ember-needler',
    name: 'Ember-Needler',
    type: 'weapon',
    subtype: 'CROSSBOW',
    quality: 'uncommon',
    description: 'A Sundale crossbow whose bolts are iron needles heated in a Solbrand brazier before loading. The bolts lodge deep and keep burning, making extraction nearly impossible.',
    iconId: 'Weapons/Crossbow/crossbow-reddish-brown-loaded',
    value: { gold: 0, silver: 50, copper: 0 },
    stackable: false,
    width: 2,
    height: 3,
    rotation: 0,
    slots: ['ranged'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'physical',
        bonusDamage: 2
      }
    },
    baseStats: {
      agility: { value: 1, isPercentage: false },
      strength: { value: 1, isPercentage: false }
    },
    combatStats: {
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
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          ember: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },

  // 14
  {
    id: 'frost-guard-longsword',
    name: 'Frost-Guard Longsword',
    type: 'weapon',
    subtype: 'SWORD',
    quality: 'uncommon',
    description: 'A Nordhalla blade whose fuller runs with enchanted frost-oil mined from Glacier\'s Deep. Each swing leaves a trail of ice-crystals that cling to anything warm.',
    iconId: 'Weapons/Swords/sword-basic-straight-tan-blade-brown-hilt',
    value: { gold: 0, silver: 50, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'physical',
        bonusDamage: 2
      }
    },
    baseStats: {
      strength: { value: 1, isPercentage: false },
      constitution: { value: 1, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['freeze'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d6',
            damageType: 'cold',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          cold: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },

  // 15
  {
    id: 'plague-biter',
    name: 'Plague-Biter',
    type: 'weapon',
    subtype: 'SICKLE',
    quality: 'uncommon',
    description: 'A Bryngloom reaper\'s sickle that has never been cleaned. Centuries of blight-soaked harvests have saturated the blade with a disease that resists all known remedies.',
    iconId: 'Weapons/Sickles/sickle-curved-blade-beige-brown-handle-simple',
    value: { gold: 0, silver: 50, copper: 0 },
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
        damageType: 'physical',
        bonusDamage: 1
      }
    },
    baseStats: {
      agility: { value: 1, isPercentage: false },
      intelligence: { value: 1, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['slow'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d6',
            damageType: 'blight',
            isDot: true,
            dotDuration: 2,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          blight: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },

  // ══════════════════════════════════════════════════════════════════════
  // RARE (20 items, diceThreshold 15–16)
  // ══════════════════════════════════════════════════════════════════════

  // 16
  {
    id: 'infernal-dire',
    name: 'Infernal Dire',
    type: 'weapon',
    subtype: 'GREATSWORD',
    quality: 'rare',
    description: 'A Solbrand greatsword bathed in the blood of the First Pyrofiend. Its edge trails columns of living flame that stubbornly cling to anything they touch, consuming flesh and spirit alike.',
    iconId: 'Weapons/Swords/sword-fire-glowing-red-blade-golden-guard',
    value: { gold: 3, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 4,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd8',
        damageType: 'ember',
        bonusDamage: 3
      }
    },
    baseStats: {
      strength: { value: 3, isPercentage: false },
      spirit: { value: 1, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['burning', 'knockback'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '2d6',
            damageType: 'ember',
            isDot: true,
            dotDuration: 3,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          ember: { value: 4, isPercentage: false },
          sacred: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },

  // 17
  {
    id: 'hoarfrost-glaive',
    name: 'Hoarfrost Glaive',
    type: 'weapon',
    subtype: 'POLEARM',
    quality: 'rare',
    description: 'A Frostwood Reach polearm whose blade never thaws. It was left embedded in a glacier for a hundred years, and the ice that grew around it became its edge — sharper than any steel.',
    iconId: 'Weapons/Polearm/polearm-halberd-axe-blade-spike-tan-metallic-guard',
    value: { gold: 2, silver: 50, copper: 0 },
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
        damageType: 'cold',
        bonusDamage: 3
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      constitution: { value: 2, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['freeze', 'slow'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'freeze',
            controlDuration: 2,
            saveDC: 14,
            saveType: 'constitution',
            knockbackDistance: 0,
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          cold: { value: 4, isPercentage: false }
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },

  // 18
  {
    id: 'tempest-trident',
    name: 'Tempest Trident',
    type: 'weapon',
    subtype: 'TRIDENT',
    quality: 'rare',
    description: 'Forged from the bolt of a sky-serpent slain over the Iceheart Sea. The three prongs hum with trapped lightning, and throwing it calls down a stroke of thunder from the clouds above.',
    iconId: 'Weapons/Polearm/polearm-halberd-axe-blade-spike-tan-metallic-guard',
    value: { gold: 2, silver: 50, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd8',
        damageType: 'storm',
        bonusDamage: 2
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      agility: { value: 1, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['shock', 'knockback'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '2d6',
            damageType: 'storm',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          storm: { value: 4, isPercentage: false },
          arcane: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },

  // 19
  {
    id: 'nightfall-rapier',
    name: 'Nightfall Rapier',
    type: 'weapon',
    subtype: 'RAPIER',
    quality: 'rare',
    description: 'A Bryngloom blade that drinks the light around it. Its point delivers terror like a needle of pure shadow, and those who face it swear the darkness itself reaches for them.',
    iconId: 'Weapons/Rapier/rapier-curved-blade-rusty-bronze-orange-brown-aged',
    value: { gold: 3, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'shadow',
        bonusDamage: 3
      }
    },
    baseStats: {
      agility: { value: 3, isPercentage: false },
      intelligence: { value: 1, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 50,
        diceThreshold: 16,
        cardProcRule: 'black_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['fear'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'fear',
            controlDuration: 2,
            saveDC: 15,
            saveType: 'spirit',
            knockbackDistance: 0,
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          shadow: { value: 5, isPercentage: false }
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },

  // 20
  {
    id: 'arcane-siphon',
    name: 'Arcane Siphon',
    type: 'weapon',
    subtype: 'DAGGER',
    quality: 'rare',
    description: 'A Sundrift Vale ritual-dagger that converts the kinetic energy of a strike into healing light. Belief scholars theorize it channels the victim\'s fading vitality back to the wielder.',
    iconId: 'Weapons/Throwing Knife/throwing-knife-beige-blade-brown-handle-pommel',
    value: { gold: 2, silver: 50, copper: 0 },
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
        damageType: 'arcane',
        bonusDamage: 2
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false },
      spirit: { value: 2, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 28,
        diceThreshold: 16,
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
            formula: '1d8',
            damageType: 'arcane',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          arcane: { value: 4, isPercentage: false }
        }
      }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },

  // 21
  {
    id: 'wyrd-hammer',
    name: 'Wyrd-Hammer',
    type: 'weapon',
    subtype: 'MAUL',
    quality: 'rare',
    description: 'A Cragjaw miner\'s maul whose head contains a pocket of raw wyrd-stone. Each blow releases a pulse of impossible gravity that distorts time around the point of impact.',
    iconId: 'Weapons/Warhammer/warhammer-brown-tan-striking-face-beige-arrow-indicator',
    value: { gold: 2, silver: 50, copper: 0 },
    stackable: false,
    width: 2,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd8',
        damageType: 'physical',
        bonusDamage: 3
      }
    },
    baseStats: {
      strength: { value: 3, isPercentage: false },
      constitution: { value: 1, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['slow'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '2d6',
            damageType: 'wyrd',
            isDot: true,
            dotDuration: 3,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          wyrd: { value: 4, isPercentage: false }
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },

  // 22
  {
    id: 'scourge-lash',
    name: 'Scourge-Lash',
    type: 'weapon',
    subtype: 'FLAIL',
    quality: 'rare',
    description: 'A Nordhalla war-flail whose links are carved from the chains of enslaved wights. Each segment carries a fragment of phantom weight that drags at the spirit as well as the flesh.',
    iconId: 'Weapons/Flail/flail-brown-handle-chain-spiked-balls',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'physical',
        bonusDamage: 2
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      agility: { value: 1, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['disarm', 'slow'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'disarm',
            controlDuration: 2,
            saveDC: 14,
            saveType: 'strength',
            knockbackDistance: 0,
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {}
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },

  // 23
  {
    id: 'holy-inquisitors-mace',
    name: "Holy Inquisitor's Mace",
    type: 'weapon',
    subtype: 'MACE',
    quality: 'rare',
    description: 'The signature weapon of Solbrand\'s Examiners of Faith. Its consecrated head channels Sol\'s judgment into a single, devastating impact that burns with the fury of true believers.',
    iconId: 'Weapons/Mace/mace-fire-key-red-orange-yellow-flame-head',
    value: { gold: 3, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 3,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'sacred',
        bonusDamage: 3
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      spirit: { value: 2, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['burning'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '2d6',
            damageType: 'sacred',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          sacred: { value: 5, isPercentage: false }
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },

  // 24
  {
    id: 'venom-drake-fang',
    name: 'Venom-Drake Fang',
    type: 'weapon',
    subtype: 'DAGGER',
    quality: 'rare',
    description: 'A dagger carved from the intact fang of a Bryngloom venom-drake. The poison glands never dried — the blade weeps a viscous toxin that no alchemist has been able to replicate.',
    iconId: 'Weapons/Throwing Knife/throwing-knife-beige-blade-brown-handle-pommel',
    value: { gold: 2, silver: 50, copper: 0 },
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
        damageType: 'poison',
        bonusDamage: 3
      }
    },
    baseStats: {
      agility: { value: 3, isPercentage: false },
      intelligence: { value: 1, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['slow'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d8',
            damageType: 'poison',
            isDot: true,
            dotDuration: 4,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          poison: { value: 4, isPercentage: false },
          blight: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },

  // 25
  {
    id: 'psychic-horror-wand',
    name: 'Psychic-Horror Wand',
    type: 'weapon',
    subtype: 'WAND',
    quality: 'rare',
    description: 'A Sundrift Vale conviction-wand that projects nightmares directly into the minds of the unworthy. Its victims see their deepest fears made real — if only for a few seconds.',
    iconId: 'Weapons/Wand/wand-wooden-reddish-brown-club-hook-glowing-yellow-tip',
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
        damageType: 'psychic',
        bonusDamage: 3
      }
    },
    baseStats: {
      intelligence: { value: 3, isPercentage: false },
      spirit: { value: 1, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 25,
        diceThreshold: 16,
        cardProcRule: 'specific_suit',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'spades',
        spellEffect: null,
        customEffects: ['fear', 'slow'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'fear',
            controlDuration: 2,
            saveDC: 15,
            saveType: 'spirit',
            knockbackDistance: 0,
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          psychic: { value: 4, isPercentage: false }
        }
      }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },

  // 26
  {
    id: 'thunder-anvil',
    name: 'Thunder-Anvil',
    type: 'weapon',
    subtype: 'GREATAXE',
    quality: 'rare',
    description: 'A Nordhalla greataxe so heavy it was forged inside a thunderstorm, each hammer-strike timed to a lightning strike. The axehead contains a trapped storm that breaks free on every devastating swing.',
    iconId: 'Weapons/Axe/double-bladed-axe-asymmetric-bronze',
    value: { gold: 3, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 4,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd10',
        damageType: 'physical',
        bonusDamage: 3
      }
    },
    baseStats: {
      strength: { value: 4, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['shock', 'knockback'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '2d8',
            damageType: 'storm',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          storm: { value: 5, isPercentage: false }
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },

  // 27
  {
    id: 'blight-caller',
    name: 'Blight-Caller',
    type: 'weapon',
    subtype: 'STAFF',
    quality: 'rare',
    description: 'A Bryngloom staff wrapped in the roots of a blighted elder-tree. It hums with the slow, patient hunger of rot, and where it strikes the ground nothing green will grow for a season.',
    iconId: 'Weapons/Staff/staff-wooden-golden-star-green-wrapping-red-pommel',
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
        damageType: 'blight',
        bonusDamage: 3
      }
    },
    baseStats: {
      intelligence: { value: 3, isPercentage: false },
      spirit: { value: 1, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['slow'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d8',
            damageType: 'blight',
            isDot: true,
            dotDuration: 4,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          blight: { value: 5, isPercentage: false },
          wyrd: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },

  // 28
  {
    id: 'soul-razor',
    name: 'Soul-Razor',
    type: 'weapon',
    subtype: 'KATAR',
    quality: 'rare',
    description: 'A Bryngloom fist-blade that was once the prison for a minor wraith. The spirit within feeds on the souls of those it cuts, returning a portion of that stolen vitality to its wielder.',
    iconId: 'Weapons/Throwing Knife/throwing-knife-beige-blade-brown-handle-pommel',
    value: { gold: 2, silver: 50, copper: 0 },
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
        damageType: 'shadow',
        bonusDamage: 3
      }
    },
    baseStats: {
      agility: { value: 2, isPercentage: false },
      spirit: { value: 2, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'coins',
        procChance: 12,
        diceThreshold: 16,
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
            formula: '2d4',
            damageType: 'shadow',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          shadow: { value: 3, isPercentage: false }
        }
      }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },

  // 29
  {
    id: 'force-nexus-bow',
    name: 'Force-Nexus Bow',
    type: 'weapon',
    subtype: 'LONGBOW',
    quality: 'rare',
    description: 'A Sundrift Vale conviction-bow whose string is woven from threads of pure kinetic force. Arrows fired from it carry the weight of belief itself, striking with concussive power that sends foes sprawling.',
    iconId: 'Weapons/Bows/bow-simple-brown-wrapped-grip',
    value: { gold: 2, silver: 50, copper: 0 },
    stackable: false,
    width: 2,
    height: 3,
    rotation: 0,
    slots: ['ranged'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd6',
        damageType: 'physical',
        bonusDamage: 3
      }
    },
    baseStats: {
      agility: { value: 3, isPercentage: false },
      strength: { value: 1, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['knockback'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '2d6',
            damageType: 'force',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          force: { value: 4, isPercentage: false }
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },

  // 30
  {
    id: 'mind-killer',
    name: 'Mind-Killer',
    type: 'weapon',
    subtype: 'SWORD',
    quality: 'rare',
    description: 'A Sundrift Vale longsword etched with conviction-runes that silence thought on contact. Its edge passes through armor and flesh alike to strike directly at the mind behind the muscles.',
    iconId: 'Weapons/Swords/sword-basic-japanese-golden-guard-pommel',
    value: { gold: 2, silver: 50, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'psychic',
        bonusDamage: 2
      }
    },
    baseStats: {
      intelligence: { value: 2, isPercentage: false },
      agility: { value: 2, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 25,
        diceThreshold: 16,
        cardProcRule: 'specific_suit',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'clubs',
        spellEffect: null,
        customEffects: ['stun', 'slow'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'stun',
            controlDuration: 2,
            saveDC: 15,
            saveType: 'intelligence',
            knockbackDistance: 0,
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          psychic: { value: 3, isPercentage: false }
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },

  // 31
  {
    id: 'ash-bringers-scourge',
    name: "Ash-Bringer's Scourge",
    type: 'weapon',
    subtype: 'FLAIL',
    quality: 'rare',
    description: 'A Solbrand fire-priest\'s penance-chain, repurposed as a weapon of war. Each link still smolders with the ash of burned heretics, and the chain-leaves scars that refuse to heal.',
    iconId: 'Weapons/Flail/flail-wooden-handle-chain-spiked-ball',
    value: { gold: 2, silver: 50, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'ember',
        bonusDamage: 2
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      spirit: { value: 1, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['burning'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d8',
            damageType: 'ember',
            isDot: true,
            dotDuration: 3,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          ember: { value: 3, isPercentage: false },
          shadow: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },

  // 32
  {
    id: 'tide-crusher',
    name: 'Tide-Crusher',
    type: 'weapon',
    subtype: 'TRIDENT',
    quality: 'rare',
    description: 'An Iceheart Sea trident forged from abyssal coral and tempered in crushing deep-water pressure. Its strikes carry the weight of a thousand fathoms, crushing bone and freezing marrow in a single motion.',
    iconId: 'Weapons/Polearm/polearm-spear-staff-brown-wrapped-light-tip',
    value: { gold: 2, silver: 50, copper: 0 },
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
        damageType: 'cold',
        bonusDamage: 3
      }
    },
    baseStats: {
      strength: { value: 3, isPercentage: false },
      constitution: { value: 1, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['freeze', 'knockback'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d10',
            damageType: 'cold',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          cold: { value: 4, isPercentage: false }
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },

  // 33
  {
    id: 'star-fall-harp',
    name: 'Star-Fall Harp',
    type: 'weapon',
    subtype: 'HARP',
    quality: 'rare',
    description: 'A Sundrift Vale war-harp strung with threads of fallen starlight. When its strings are plucked in the right sequence, they release cascades of arcane energy that crackle like distant thunder.',
    iconId: 'Instruments/Harp/harp-brown-beige-strings',
    value: { gold: 3, silver: 0, copper: 0 },
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
        damageType: 'arcane',
        bonusDamage: 3
      }
    },
    baseStats: {
      spirit: { value: 3, isPercentage: false },
      intelligence: { value: 1, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['shock'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '2d6',
            damageType: 'arcane',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          arcane: { value: 5, isPercentage: false },
          sacred: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },

  // 34
  {
    id: 'blood-oath-greataxe',
    name: 'Blood-Oath Greataxe',
    type: 'weapon',
    subtype: 'GREATAXE',
    quality: 'rare',
    description: 'A Nordhalla oath-axe whose edge thirsts for the blood it spills. Each kill strengthens the wielder, as the axe channels the fallen\'s last breath into sacred vitality.',
    iconId: 'Weapons/Axe/double-bladed-axe-asymmetric-bronze',
    value: { gold: 2, silver: 50, copper: 0 },
    stackable: false,
    width: 2,
    height: 4,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd10',
        damageType: 'physical',
        bonusDamage: 2
      }
    },
    baseStats: {
      strength: { value: 3, isPercentage: false },
      constitution: { value: 1, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['stun'],
        useRollableTable: false,
        effect: {
          effectType: 'healing',
          effectConfig: {
            formula: '2d6',
            damageType: 'sacred',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          sacred: { value: 3, isPercentage: false }
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },

  // 35
  {
    id: 'phantom-dance',
    name: 'Phantom-Dance',
    type: 'weapon',
    subtype: 'SABER',
    quality: 'rare',
    description: 'A Bryngloom curved blade that phases partially into the shadow-realm during each swing. Those cut by it feel the wound before they see the blade — a disorienting dance of light and dark.',
    iconId: 'Weapons/Saber/saber-curved-blade-golden-orange-red-edge-enchanted',
    value: { gold: 2, silver: 50, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'shadow',
        bonusDamage: 3
      }
    },
    baseStats: {
      agility: { value: 3, isPercentage: false },
      intelligence: { value: 1, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 25,
        diceThreshold: 16,
        cardProcRule: 'specific_suit',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'diamonds',
        spellEffect: null,
        customEffects: ['fear', 'slow'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d8',
            damageType: 'shadow',
            isDot: true,
            dotDuration: 3,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          shadow: { value: 4, isPercentage: false },
          wyrd: { value: 2, isPercentage: false }
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },

  // ══════════════════════════════════════════════════════════════════════
  // EPIC (15 items, diceThreshold 13–14)
  // ══════════════════════════════════════════════════════════════════════

  // 36
  {
    id: 'sol-brands-final-word',
    name: "Sol-Brand's Final Word",
    type: 'weapon',
    subtype: 'GREATSWORD',
    quality: 'epic',
    description: 'The last blade forged before the Solbrand priesthood shattered. It burns with Sol\'s dying light — a fire that judges without mercy and leaves nothing behind but consecrated ash.',
    iconId: 'Weapons/Swords/sword-fire-glowing-red-blade-golden-guard',
    value: { gold: 8, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 4,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd10',
        damageType: 'sacred',
        bonusDamage: 5
      }
    },
    baseStats: {
      strength: { value: 4, isPercentage: false },
      spirit: { value: 3, isPercentage: false },
      constitution: { value: 1, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 40,
        diceThreshold: 13,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['burning', 'knockback'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '3d8',
            damageType: 'sacred',
            isDot: true,
            dotDuration: 4,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          sacred: { value: 8, isPercentage: false },
          ember: { value: 5, isPercentage: false }
        }
      }
    },
    durability: 'd12',
    maxDurability: 'd12'
  },

  // 37
  {
    id: 'everfrost-crown-pike',
    name: 'Everfrost Crown-Pike',
    type: 'weapon',
    subtype: 'POLEARM',
    quality: 'epic',
    description: 'A Frostwood Reach relic that was once the scepter of the Winter Court\'s forgotten king. The crown-pike radiates an absolute cold that freezes the air itself, encasing foes in crystalline prisons.',
    iconId: 'Weapons/Polearm/polearm-halberd-axe-blade-spike-tan-metallic-guard',
    value: { gold: 7, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd10',
        damageType: 'cold',
        bonusDamage: 4
      }
    },
    baseStats: {
      strength: { value: 3, isPercentage: false },
      constitution: { value: 3, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['freeze', 'slow', 'knockback'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'freeze',
            controlDuration: 3,
            saveDC: 16,
            saveType: 'constitution',
            knockbackDistance: 0,
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          cold: { value: 8, isPercentage: false },
          arcane: { value: 3, isPercentage: false }
        }
      }
    },
    durability: 'd12',
    maxDurability: 'd12'
  },

  // 38
  {
    id: 'storm-gods-wrath',
    name: "Storm-God's Wrath",
    type: 'weapon',
    subtype: 'MAUL',
    quality: 'epic',
    description: 'A Nordhalla siege-maul carved from a single block of storm-cloud petrified by divine lightning. When it falls, the ground cracks, the air splits, and every living thing within arm\'s reach feels the sky\'s fury.',
    iconId: 'Weapons/Warhammer/warhammer-brown-tan-striking-face-beige-arrow-indicator',
    value: { gold: 8, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 4,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd12',
        damageType: 'storm',
        bonusDamage: 5
      }
    },
    baseStats: {
      strength: { value: 5, isPercentage: false },
      constitution: { value: 2, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 40,
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
            formula: '3d8',
            damageType: 'storm',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          storm: { value: 8, isPercentage: false },
          force: { value: 4, isPercentage: false }
        }
      }
    },
    durability: 'd12',
    maxDurability: 'd12'
  },

  // 39
  {
    id: 'void-emperors-blade',
    name: "Void-Emperor's Blade",
    type: 'weapon',
    subtype: 'SWORD',
    quality: 'epic',
    description: 'The Bryngloom blade of the last Void Emperor, who ruled the space between stars before his empire collapsed into shadow. Its edge carries the silence of a dying universe — and the terror that follows.',
    iconId: 'Weapons/Swords/sword-basic-japanese-golden-guard-pommel',
    value: { gold: 8, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd8',
        damageType: 'shadow',
        bonusDamage: 4
      }
    },
    baseStats: {
      agility: { value: 3, isPercentage: false },
      intelligence: { value: 3, isPercentage: false },
      spirit: { value: 1, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 50,
        diceThreshold: 14,
        cardProcRule: 'black_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['fear', 'slow'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'fear',
            controlDuration: 3,
            saveDC: 17,
            saveType: 'spirit',
            knockbackDistance: 0,
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          shadow: { value: 8, isPercentage: false },
          wyrd: { value: 5, isPercentage: false }
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },

  // 40
  {
    id: 'psychic-abyss',
    name: 'Psychic Abyss',
    type: 'weapon',
    subtype: 'STAFF',
    quality: 'epic',
    description: 'A Sundrift Vale conviction-staff containing a fragment of the Abyssal Mind — a psychic entity that feeds on sanity itself. Wielding it grants terrible power at the cost of your own grip on reality.',
    iconId: 'Weapons/Staff/staff-wooden-golden-star-green-wrapping-red-pommel',
    value: { gold: 8, silver: 0, copper: 0 },
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
        damageType: 'psychic',
        bonusDamage: 5
      }
    },
    baseStats: {
      intelligence: { value: 4, isPercentage: false },
      spirit: { value: 3, isPercentage: false },
      constitution: { value: -1, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 25,
        diceThreshold: 14,
        cardProcRule: 'specific_suit',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'spades',
        spellEffect: null,
        customEffects: ['fear', 'slow', 'stun'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'fear',
            controlDuration: 3,
            saveDC: 16,
            saveType: 'spirit',
            knockbackDistance: 0,
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          psychic: { value: 8, isPercentage: false },
          arcane: { value: 4, isPercentage: false }
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },

  // 41
  {
    id: 'plague-sovereign',
    name: 'Plague-Sovereign',
    type: 'weapon',
    subtype: 'SCYTHE',
    quality: 'epic',
    description: 'The Bryngloom reaper-queen\'s personal scythe, its blade inlaid with the petrified hearts of plague saints. Where it harvests, blight blooms — and the land remembers the wound for generations.',
    iconId: 'Weapons/Scythe/scythe-curved-blade-dark-brown-handle-textured',
    value: { gold: 8, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 4,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd8',
        damageType: 'blight',
        bonusDamage: 5
      }
    },
    baseStats: {
      strength: { value: 3, isPercentage: false },
      intelligence: { value: 2, isPercentage: false },
      constitution: { value: 1, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['slow'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '2d8',
            damageType: 'blight',
            isDot: true,
            dotDuration: 5,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          blight: { value: 8, isPercentage: false },
          poison: { value: 5, isPercentage: false }
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },

  // 42
  {
    id: 'wyrd-collapse',
    name: 'Wyrd-Collapse',
    type: 'weapon',
    subtype: 'WAND',
    quality: 'epic',
    description: 'A Cragjaw paradox-wand whose crystal tip contains a collapsed pocket dimension. When activated, reality folds inward at the point of contact, subjecting the target to impossible geometries.',
    iconId: 'Weapons/Wand/wand-wooden-reddish-brown-club-hook-glowing-yellow-tip',
    value: { gold: 8, silver: 0, copper: 0 },
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
        damageType: 'wyrd',
        bonusDamage: 5
      }
    },
    baseStats: {
      intelligence: { value: 4, isPercentage: false },
      spirit: { value: 2, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'coins',
        procChance: 12,
        diceThreshold: 14,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['slow', 'disarm'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '3d6',
            damageType: 'wyrd',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          wyrd: { value: 8, isPercentage: false },
          arcane: { value: 4, isPercentage: false }
        }
      }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },

  // 43
  {
    id: 'force-of-nature',
    name: 'Force-of-Nature',
    type: 'weapon',
    subtype: 'GREATSWORD',
    quality: 'epic',
    description: 'A Nordhalla greatsword carved from the heartwood of a living world-tree. It channels the raw, unstoppable momentum of tectonic force — each swing carries the weight of mountains shifting beneath the earth.',
    iconId: 'Weapons/Swords/sword-basic-japanese-golden-guard-pommel',
    value: { gold: 7, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 4,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd10',
        damageType: 'force',
        bonusDamage: 5
      }
    },
    baseStats: {
      strength: { value: 5, isPercentage: false },
      constitution: { value: 2, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 40,
        diceThreshold: 13,
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
            formula: '2d10',
            damageType: 'force',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          force: { value: 8, isPercentage: false },
          sacred: { value: 3, isPercentage: false }
        }
      }
    },
    durability: 'd12',
    maxDurability: 'd12'
  },

  // 44
  {
    id: 'holy-reckoning',
    name: 'Holy-Reckoning',
    type: 'weapon',
    subtype: 'MAUL',
    quality: 'epic',
    description: 'The Solbrand hammer of final judgment, carried by the last Grand Inquisitor before the Order dissolved. Each blow delivers Sol\'s wrath made manifest — a blinding, purifying force that sears and stuns in equal measure.',
    iconId: 'Weapons/Warhammer/warhammer-brown-tan-striking-face-beige-arrow-indicator',
    value: { gold: 8, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 4,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd10',
        damageType: 'sacred',
        bonusDamage: 5
      }
    },
    baseStats: {
      strength: { value: 4, isPercentage: false },
      spirit: { value: 3, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 40,
        diceThreshold: 13,
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
            formula: '3d6',
            damageType: 'sacred',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          sacred: { value: 8, isPercentage: false }
        }
      }
    },
    durability: 'd12',
    maxDurability: 'd12'
  },

  // 45
  {
    id: 'night-terrors-embrace',
    name: "Night-Terror's Embrace",
    type: 'weapon',
    subtype: 'DAGGER',
    quality: 'epic',
    description: 'A Bryngloom assassin\'s blade that was once the fang of a terror-warden. It projects waking nightmares into those it cuts, flooding their minds with shadow-horror that lingers long after the physical wound has healed.',
    iconId: 'Weapons/Throwing Knife/throwing-knife-beige-blade-brown-handle-pommel',
    value: { gold: 7, silver: 0, copper: 0 },
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
        damageType: 'shadow',
        bonusDamage: 5
      }
    },
    baseStats: {
      agility: { value: 4, isPercentage: false },
      intelligence: { value: 2, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 50,
        diceThreshold: 14,
        cardProcRule: 'black_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['fear'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '2d6',
            damageType: 'shadow',
            isDot: true,
            dotDuration: 4,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          shadow: { value: 8, isPercentage: false },
          blight: { value: 4, isPercentage: false }
        }
      }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },

  // 46
  {
    id: 'inferno-sovereign',
    name: 'Inferno-Sovereign',
    type: 'weapon',
    subtype: 'GREATAXE',
    quality: 'epic',
    description: 'The Solbrand axe of the First Pyrofiend King, whose reign ended when he drove this blade into the earth and let the magma consume him. It still burns with his undying, incandescent fury.',
    iconId: 'Weapons/Axe/double-bladed-axe-asymmetric-bronze',
    value: { gold: 10, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 4,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd12',
        damageType: 'ember',
        bonusDamage: 6
      }
    },
    baseStats: {
      strength: { value: 5, isPercentage: false },
      constitution: { value: 2, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 40,
        diceThreshold: 13,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['burning', 'knockback'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '3d8',
            damageType: 'ember',
            isDot: true,
            dotDuration: 5,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          ember: { value: 10, isPercentage: false }
        }
      }
    },
    durability: 'd12',
    maxDurability: 'd12'
  },

  // 47
  {
    id: 'tempest-choir',
    name: 'Tempest-Choirmaster',
    type: 'weapon',
    subtype: 'HARP',
    quality: 'epic',
    description: 'The legendary harp of the Iceheart Sea\'s Storm-Choirmasters, who could call down hurricanes with a single chord. Its strings are spun from bottled lightning, and every note crackles with the promise of destruction.',
    iconId: 'Instruments/Harp/harp-brown-beige-strings',
    value: { gold: 8, silver: 0, copper: 0 },
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
        diceType: 'd8',
        damageType: 'storm',
        bonusDamage: 4
      }
    },
    baseStats: {
      spirit: { value: 4, isPercentage: false },
      intelligence: { value: 2, isPercentage: false },
      agility: { value: 1, isPercentage: false }
    },
    combatStats: {
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
            damageType: 'storm',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          storm: { value: 8, isPercentage: false },
          arcane: { value: 4, isPercentage: false },
          cold: { value: 3, isPercentage: false }
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },

  // 48
  {
    id: 'soul-harvesters-call',
    name: "Soul-Harvester's Call",
    type: 'weapon',
    subtype: 'SCYTHE',
    quality: 'epic',
    description: 'The Bryngloom scythe of the Soul-Harvester, an entity that predates the forest itself. Each swing reaps fragments of the target\'s essence, knitting them back into the wielder as stolen vitality.',
    iconId: 'Weapons/Scythe/scythe-curved-blade-light-beige-brown-handle',
    value: { gold: 8, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 4,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd8',
        damageType: 'shadow',
        bonusDamage: 4
      }
    },
    baseStats: {
      strength: { value: 3, isPercentage: false },
      spirit: { value: 3, isPercentage: false }
    },
    combatStats: {
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
        customEffects: ['fear'],
        useRollableTable: false,
        effect: {
          effectType: 'healing',
          effectConfig: {
            formula: '3d6',
            damageType: 'shadow',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          blight: { value: 5, isPercentage: false },
          shadow: { value: 5, isPercentage: false }
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },

  // 49
  {
    id: 'mind-thief',
    name: 'Mind-Thief',
    type: 'weapon',
    subtype: 'RAPIER',
    quality: 'epic',
    description: 'A Sundrift Vale conviction-rapier that doesn\'t cut flesh — it cuts thought. Those struck by its needle point lose entire memories, skills, and even their sense of self for a time that feels like forever.',
    iconId: 'Weapons/Rapier/rapier-curved-blade-rusty-bronze-orange-brown-aged',
    value: { gold: 7, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'psychic',
        bonusDamage: 4
      }
    },
    baseStats: {
      agility: { value: 3, isPercentage: false },
      intelligence: { value: 3, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'coins',
        procChance: 12,
        diceThreshold: 14,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['stun', 'slow'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'stun',
            controlDuration: 2,
            saveDC: 16,
            saveType: 'intelligence',
            knockbackDistance: 0,
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          psychic: { value: 6, isPercentage: false },
          wyrd: { value: 4, isPercentage: false }
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },

  // 50
  {
    id: 'the-consensus',
    name: 'The-Consensus',
    type: 'weapon',
    subtype: 'STAFF',
    quality: 'epic',
    description: 'The Sundrift Vale Convocation\'s most sacred artifact — a staff that amplifies the collective belief of an entire congregation into a single, devastating expression of arcane will.',
    iconId: 'Weapons/Staff/staff-wooden-curved-head-bone-tip-red-orange-details',
    value: { gold: 10, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd8',
        damageType: 'arcane',
        bonusDamage: 4
      }
    },
    baseStats: {
      intelligence: { value: 4, isPercentage: false },
      spirit: { value: 3, isPercentage: false }
    },
    combatStats: {
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 40,
        diceThreshold: 13,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['shock', 'disarm'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '2d8',
            damageType: 'arcane',
            isDot: false,
            dotDuration: 0,
            dotTickFrequency: 'round',
            targetType: 'defender',
            areaRadius: 0
          }
        }
      },
      spellDamage: {
        types: {
          arcane: { value: 8, isPercentage: false },
          force: { value: 3, isPercentage: false }
        }
      }
    },
    durability: 'd12',
    maxDurability: 'd12'
  }
];
