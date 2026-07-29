/**
 * Faction & Lore Weapons
 *
 * Weapons deeply tied to specific factions, regions, events, and figures
 * from the world of Mythrill. Each weapon has its own lore entry in itemLoreData.js.
 */

export const FACTION_WEAPONS = [

  // === SOLBRAND / ORDER OF SOLBRAND (Sundale) ===
  {
    id: 'ardent-sun-blade',
    name: 'Ardent Sun-Blade',
    type: 'weapon',
    subtype: 'SWORD',
    quality: 'rare',
    description: 'A blade forged from Solbrand ore by Grandmaster Vael Ardent-Sun himself, lacquered in solar gold. Its edge catches and bends light, casting miniature sundials on the ground.',
    iconId: 'Weapons/Swords/sword-basic-japanese-golden-guard-pommel',
    value: { gold: 2, silver: 50, copper: 0 },
    stackable: false,
    width: 1,
    height: 3,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'ember',
        bonusDamage: 3
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      spirit: { value: 1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          sacred: { value: 3, isPercentage: false }
        }
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
            formula: '1d8',
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
    durability: 'd12',
    maxDurability: 'd12'
  },
  {
    id: 'emberspire-greatsword',
    name: 'Emberspire Greatsword',
    type: 'weapon',
    subtype: 'GREATSWORD',
    quality: 'epic',
    description: 'A massive two-handed blade carved from a single shard of Emberspire obsidian, inlaid with Solbrand gold filigree. The First Cabal of Pyrofiends consecrated it in Sol\'s dying fire.',
    iconId: 'Weapons/Swords/sword-basic-straight-beige-blade-brown-hilt',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 4,
    rotation: 0,
    shape: {
      type: 'custom',
      width: 2,
      height: 4,
      cells: [
        [true, false],
        [true, false],
        [true, false],
        [true, true]
      ]
    },
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 2,
        diceType: 'd8',
        damageType: 'ember',
        bonusDamage: 4
      }
    },
    baseStats: {
      strength: { value: 3, isPercentage: false },
      spirit: { value: 2, isPercentage: false },
      constitution: { value: -1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          sacred: { value: 5, isPercentage: false },
          ember: { value: 3, isPercentage: false }
        }
      },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 20,
        diceThreshold: 14,
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
            damageType: 'sacred',
            isDot: true,
            dotDuration: 3,
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

  // === DAWN VIGIL (Sundale) ===
  {
    id: 'vigil-purges-mace',
    name: "Vigil's Purge-Mace",
    type: 'weapon',
    subtype: 'MACE',
    quality: 'uncommon',
    description: 'A Dawn Vigil mace with a hollow head containing condensed Solbrand ash. On impact, the ash disperses in a burning cloud that sears the eyes.',
    iconId: 'Weapons/Mace/mace-spiked-club-brown-tan-rustic',
    value: { gold: 0, silver: 30, copper: 0 },
    stackable: false,
    width: 2,
    height: 3,
    rotation: 0,
    shape: {
      type: 'custom',
      width: 2,
      height: 3,
      cells: [
        [true, true],
        [false, true],
        [false, true]
      ]
    },
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'smashing',
        bonusDamage: 2
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    combatStats: {
      armor: { value: 2, isPercentage: false },
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
        customEffects: ['stun'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'stun',
            controlDuration: 1,
            saveDC: 13,
            saveType: 'constitution',
            knockbackDistance: 0,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },

  // === THE SCOURGED (Sundale) ===
  {
    id: 'monolith-shard-dagger',
    name: 'Monolith Shard-Dagger',
    type: 'weapon',
    subtype: 'DAGGER',
    quality: 'rare',
    description: 'A dagger hewn from a Sundered Monolith fragment. Its edge resonates with Wyrd-frequency vibrations that destabilize magical wards on contact. The Scoured carry these to shatter seals.',
    iconId: 'Weapons/Throwing Knife/throwing-knife-dagger-beige-blade-brown-handle-wrapped',
    value: { gold: 1, silver: 50, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'ONE_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'arcane',
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
            saveDC: 15,
            saveType: 'dexterity',
            knockbackDistance: 0,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },

  // === THE RISEN (Sundale) ===
  {
    id: 'risen-harvest-scythe',
    name: "Risen's Harvest-Scythe",
    type: 'weapon',
    subtype: 'SCYTHE',
    quality: 'uncommon',
    description: 'A ritual scythe used by the Risen to collect Solbrand ore. Its crescent blade has been polished by a thousand offerings and consecrated in starlight prayers.',
    iconId: 'Weapons/Sickles/sickle-curved-blade-beige-brown-handle-simple',
    value: { gold: 0, silver: 25, copper: 0 },
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
        damageType: 'ember',
        bonusDamage: 1
      }
    },
    baseStats: {
      strength: { value: 1, isPercentage: false },
      spirit: { value: 2, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          sacred: { value: 2, isPercentage: false }
        }
      },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 20,
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
            formula: '1d6',
            targetType: 'self',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },

  // === SCRIBE-CARTEL / SENTINELS (Frostwood Reach) ===
  {
    id: 'sovereign-quill-dagger',
    name: 'Sovereign Quill-Dagger',
    type: 'weapon',
    subtype: 'DAGGER',
    quality: 'uncommon',
    description: 'A blade disguised as a writing implement, carried by Scribe-Sentinels. Its edge is coated with a truth-compelling compound distilled from Soot-Resin Ink.',
    iconId: 'Weapons/Throwing Knife/throwing-knife-beige-blade-brown-handle-pommel',
    value: { gold: 0, silver: 20, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'ONE_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd4',
        damageType: 'stabbing',
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
        procType: 'coins',
        procChance: 20,
        diceThreshold: 18,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['slow'],
        useRollableTable: false,
        effect: {
          effectType: 'debuff',
          effectConfig: {
            stat: 'intelligence',
            value: -5,
            duration: 3,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },
  {
    id: 'ledgers-justification',
    name: "Ledger's Justification",
    type: 'weapon',
    subtype: 'MACE',
    quality: 'rare',
    description: 'A gavel-shaped mace used by Scribe-Sentinel judges during the Great Revision tribunals. Each strike inscribes a verdict in the air itself — a sentence that cannot be appealed.',
    iconId: 'Weapons/Mace/mace-fire-key-red-orange-yellow-flame-head',
    value: { gold: 1, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 3,
    rotation: 0,
    shape: {
      type: 'custom',
      width: 2,
      height: 3,
      cells: [
        [true, true],
        [false, true],
        [false, true]
      ]
    },
    slots: ['mainHand', 'offHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'arcane',
        bonusDamage: 2
      }
    },
    baseStats: {
      intelligence: { value: 2, isPercentage: false },
      constitution: { value: 1, isPercentage: false }
    },
    combatStats: {
      armor: { value: 3, isPercentage: false },
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
        customEffects: ['stun', 'knockback'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'stun',
            controlDuration: 2,
            saveDC: 14,
            saveType: 'constitution',
            knockbackDistance: 0,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },

  // === MIMIR / APEX (Frostwood Reach) ===
  {
    id: 'mimir-fog-stalker-bow',
    name: 'Mimir Fog-Stalker Bow',
    type: 'weapon',
    subtype: 'BOW',
    quality: 'uncommon',
    description: 'A silent bow strung with memory-fog thread that absorbs sound. The Mimir hunt-masters use it to take prey without alerting the fog-horrors that hunt by vibration.',
    iconId: 'Weapons/Bows/bow-simple-brown-wrapped-grip',
    value: { gold: 0, silver: 35, copper: 0 },
    stackable: false,
    width: 2,
    height: 5,
    rotation: 0,
    shape: {
      type: 'custom',
      width: 2,
      height: 5,
      cells: [
        [false, true],
        [true, false],
        [true, true],
        [true, false],
        [false, true]
      ]
    },
    slots: ['ranged'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'stabbing',
        bonusDamage: 2
      }
    },
    baseStats: {
      agility: { value: 3, isPercentage: false }
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
        customEffects: ['freeze', 'slow'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'freeze',
            controlDuration: 1,
            saveDC: 12,
            saveType: 'constitution',
            knockbackDistance: 0,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },

  // === LUNARCH (Frostwood Reach) ===
  {
    id: 'silence-weavers-staff',
    name: 'Silence-Weaver\'s Staff',
    type: 'weapon',
    subtype: 'STAFF',
    quality: 'rare',
    description: 'A staff of polished memory-glass that refracts the fog into patterns only the Lunarch can read. Regent Bri-Vessela carries it as both weapon and divination tool.',
    iconId: 'Weapons/Staff/staff-wooden-curved-head-bone-tip-red-orange-details',
    value: { gold: 2, silver: 0, copper: 0 },
    stackable: false,
    width: 2,
    height: 4,
    rotation: 0,
    shape: {
      type: 'custom',
      width: 2,
      height: 4,
      cells: [
        [true, true],
        [false, true],
        [false, true],
        [false, true]
      ]
    },
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'arcane',
        bonusDamage: 3
      }
    },
    baseStats: {
      intelligence: { value: 3, isPercentage: false },
      spirit: { value: 2, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          arcane: { value: 4, isPercentage: false },
          wyrd: { value: 2, isPercentage: false }
        }
      },
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 20,
        diceThreshold: 17,
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
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },

  // === HOUSE SKALVYR / SKALD / BERSERKER (Nordhalla) ===
  {
    id: 'jarn-tand-war-spear',
    name: 'Jarn-Tand War-Spear',
    type: 'weapon',
    subtype: 'SPEAR',
    quality: 'epic',
    description: 'High King-Jarl Halvar Skalvyr\'s personal spear, tipped with a stel-bone point serrated to cause wounds that freeze from within. Only a Skalvyr may carry it without the frost turning on them.',
    iconId: 'Weapons/Polearm/polearm-halberd-axe-blade-spike-tan-metallic-guard',
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
        damageType: 'rime',
        bonusDamage: 5
      }
    },
    baseStats: {
      strength: { value: 3, isPercentage: false },
      constitution: { value: 2, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          cold: { value: 3, isPercentage: false }
        }
      },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 20,
        diceThreshold: 14,
        cardProcRule: 'face_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['freeze', 'slow'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d10',
            damageType: 'rime',
            isDot: true,
            dotDuration: 3,
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
    id: 'blood-heat-greataxe',
    name: 'Blood-Heat Greataxe',
    type: 'weapon',
    subtype: 'AXE',
    quality: 'rare',
    description: 'Hark Ash-Hammer blessed this axe in the boiling blood of a stel-beast\'s heart. When swung, the head glows red-hot — not from fire, but from the wielder\'s own blood accelerating.',
    iconId: 'Weapons/Axe/double-bladed-axe-asymmetric-bronze',
    value: { gold: 3, silver: 0, copper: 0 },
    stackable: false,
    width: 3,
    height: 3,
    rotation: 0,
    shape: {
      type: 'custom',
      width: 3,
      height: 3,
      cells: [
        [true, true, true],
        [false, true, false],
        [false, true, false]
      ]
    },
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd10',
        damageType: 'ember',
        bonusDamage: 4
      }
    },
    baseStats: {
      strength: { value: 4, isPercentage: false },
      agility: { value: -1, isPercentage: false },
      constitution: { value: 1, isPercentage: false }
    },
    combatStats: {
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
    durability: 'd8',
    maxDurability: 'd8'
  },

  // === BRINE-BOND SYNDICATE (Iceheart Sea) ===
  {
    id: 'luck-ledger-cutlass',
    name: 'Luck-Ledger Cutlass',
    type: 'weapon',
    subtype: 'SABER',
    quality: 'uncommon',
    description: 'The Brine-Bond Syndicate issues these standard cutlasses to all registered privateers. The blade is etched with a Luck-Ledger account number — the weapon is itself a financial instrument.',
    iconId: 'Weapons/Saber/saber-curved-blade-golden-orange-red-edge-enchanted',
    value: { gold: 0, silver: 30, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'slicing',
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
        procType: 'coins',
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
            formula: '1d4',
            targetType: 'self',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },

  // === TIDE-CHOIR / MINSTREL (Iceheart Sea) ===
  {
    id: 'tide-choir-harp',
    name: 'Tide-Choir\'s Resonance',
    type: 'weapon',
    subtype: 'HARP',
    quality: 'rare',
    description: 'An ice-silk harp strung with Merrowport kelp-wire that vibrates at frequencies matching the Iceheart Sea\'s wave patterns. Mer-Lyrisa tuned each string to a different tide.',
    iconId: 'Instruments/Harp/harp-brown-beige-strings',
    value: { gold: 2, silver: 50, copper: 0 },
    stackable: false,
    width: 2,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'TWO_HANDED',
    hand: 'TWO_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'storm',
        bonusDamage: 3
      }
    },
    baseStats: {
      intelligence: { value: 3, isPercentage: false },
      spirit: { value: 1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          arcane: { value: 3, isPercentage: false },
          cold: { value: 2, isPercentage: false }
        }
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
        customEffects: ['freeze', 'shock'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'freeze',
            controlDuration: 2,
            saveDC: 13,
            saveType: 'constitution',
            knockbackDistance: 0,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },

  // === DEEP ALCHEMISTS (Cragjaw Peaks) ===
  {
    id: 'wyrd-distillation-lance',
    name: 'Wyrd-Distillation Lance',
    type: 'weapon',
    subtype: 'SPEAR',
    quality: 'rare',
    description: 'A hollow lance containing a Wyrd-distillation compound that the Deep Alchemists believe can neutralize corruption. The payload is delivered on impact — a cure or a weapon, depending on dosage.',
    iconId: 'Weapons/Polearm/polearm-halberd-axe-blade-spike-tan-metallic-guard',
    value: { gold: 2, silver: 0, copper: 0 },
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
        damageType: 'arcane',
        bonusDamage: 3
      }
    },
    baseStats: {
      intelligence: { value: 2, isPercentage: false },
      constitution: { value: 1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          wyrd: { value: 4, isPercentage: false },
          arcane: { value: 2, isPercentage: false }
        }
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
        customEffects: ['slow'],
        useRollableTable: false,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d8',
            damageType: 'wyrd',
            isDot: true,
            dotDuration: 3,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },

  // === VAT-BREAKERS GUILD (Cragjaw Peaks) ===
  {
    id: 'liberation-flail',
    name: 'Liberation Flail',
    type: 'weapon',
    subtype: 'FLAIL',
    quality: 'uncommon',
    description: 'A heavy flail with a head cast from the first vat to shatter. Every Vat-Breaker knows the weight of the first blow that cracked the chains open.',
    iconId: 'Weapons/Flail/flail-brown-handle-chain-spiked-balls',
    value: { gold: 0, silver: 35, copper: 0 },
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
        bonusDamage: 2
      }
    },
    baseStats: {
      strength: { value: 3, isPercentage: false },
      agility: { value: -2, isPercentage: false }
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
        customEffects: ['disarm', 'knockback'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'disarm',
            controlDuration: 1,
            saveDC: 12,
            saveType: 'dexterity',
            knockbackDistance: 0,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },

  // === WARDEN CHAIN- LORDS (Cragjaw Peaks) ===
  {
    id: 'knotted-decree-glaive',
    name: 'Knotted Decree Glaive',
    type: 'weapon',
    subtype: 'POLEARM',
    quality: 'rare',
    description: 'Warden Chain-Lord Alaric the Law-Keeper\'s personal weapon. The handle is forged from the chains of the Knotted Decree itself, and the blade is inscribed with every law he has enforced.',
    iconId: 'Weapons/Saber/saber-curved-blade-golden-orange-red-edge-enchanted',
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
        diceType: 'd8',
        damageType: 'slicing',
        bonusDamage: 3
      }
    },
    baseStats: {
      strength: { value: 2, isPercentage: false },
      constitution: { value: 2, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    combatStats: {
      armor: { value: 3, isPercentage: false },
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
        customEffects: ['stun'],
        useRollableTable: false,
        effect: {
          effectType: 'control',
          effectConfig: {
            controlType: 'stun',
            controlDuration: 1,
            saveDC: 15,
            saveType: 'constitution',
            knockbackDistance: 0,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd12',
    maxDurability: 'd12'
  },

  // === CHRONARCH CONCLAVE (Cragjaw Peaks) ===
  {
    id: 'time-frozen-wand',
    name: 'Time-Frozen Wand',
    type: 'weapon',
    subtype: 'WAND',
    quality: 'epic',
    description: 'Fex-Vestara\'s personal wand, grown from a crystal cultivated in a time-dilated pocket where a day outside equals a century within. Its spells arrive before they are cast.',
    iconId: 'Weapons/Wand/wand-wooden-dark-brown-segmented',
    value: { gold: 5, silver: 0, copper: 0 },
    stackable: false,
    width: 1,
    height: 1,
    rotation: 0,
    slots: ['ranged'],
    weaponSlot: 'RANGED',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'arcane',
        bonusDamage: 4
      }
    },
    baseStats: {
      intelligence: { value: 4, isPercentage: false },
      agility: { value: -1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          arcane: { value: 5, isPercentage: false },
          wyrd: { value: 3, isPercentage: false }
        }
      },
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 20,
        diceThreshold: 16,
        cardProcRule: 'specific_suit',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'diamonds',
        spellEffect: null,
        customEffects: ['freeze', 'slow'],
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
      }
    },
    durability: 'd6',
    maxDurability: 'd6'
  },

  // === CULT OF FORGOTTEN SHADOW (Bryngloom Forest) ===
  {
    id: 'shadow-veil-blade',
    name: 'Shadow-Veil Blade',
    type: 'weapon',
    subtype: 'SWORD',
    quality: 'rare',
    description: 'A curved blade forged in the absolute darkness of the root-veil by the Cult of Forgotten Shadow. Its edge does not reflect light — it absorbs it, casting the wielder in a penumbra of silence.',
    iconId: 'Weapons/Swords/sword-basic-japanese-golden-guard-pommel',
    value: { gold: 2, silver: 50, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'slicing',
        bonusDamage: 3
      }
    },
    baseStats: {
      agility: { value: 4, isPercentage: false },
      intelligence: { value: 1, isPercentage: false },
      constitution: { value: -1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          wyrd: { value: 3, isPercentage: false }
        }
      },
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 20,
        diceThreshold: 17,
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
            saveDC: 14,
            saveType: 'spirit',
            knockbackDistance: 0,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd10',
    maxDurability: 'd10'
  },

  // === REVENANT (Bryngloom Forest) ===
  {
    id: 'threshold-keepers-scythe',
    name: 'Threshold-Keeper\'s Scythe',
    type: 'weapon',
    subtype: 'SCYTHE',
    quality: 'epic',
    description: 'Kor-Vasseth\'s ritual scythe, forged from the gate of an ancestor-mound. Each swing harvests a fragment of the target\'s soul, adding it to the weapon\'s growing collection of the dead.',
    iconId: 'Weapons/Sickles/sickle-curved-blade-beige-brown-handle-simple',
    value: { gold: 5, silver: 0, copper: 0 },
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
        diceType: 'd6',
        damageType: 'blight',
        bonusDamage: 3
      }
    },
    baseStats: {
      spirit: { value: 3, isPercentage: false },
      intelligence: { value: 2, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          shadow: { value: 4, isPercentage: false },
          wyrd: { value: 2, isPercentage: false }
        }
      },
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 20,
        diceThreshold: 16,
        cardProcRule: 'black_cards',
        coinProcRule: 'all_heads',
        coinCount: 3,
        procSuit: 'hearts',
        spellEffect: null,
        customEffects: ['fear'],
        useRollableTable: false,
        effect: {
          effectType: 'healing',
          effectConfig: {
            formula: '2d6',
            targetType: 'self',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },

  // === PLAGUEBRINGER (Bryngloom Forest) ===
  {
    id: 'blight-mothers-prong',
    name: "Blight-Mother's Prong",
    type: 'weapon',
    subtype: 'SICKLE',
    quality: 'rare',
    description: 'Vespera\'s personal weapon — a living sickle grafted from a Neth predator\'s fang to a ghost-mycelium hilt. It secretes adaptive venom that learns to bypass the target\'s immune system.',
    iconId: 'Weapons/Sickles/sickle-curved-blade-beige-brown-handle-simple',
    value: { gold: 3, silver: 0, copper: 0 },
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
        diceType: 'd6',
        damageType: 'blight',
        bonusDamage: 3
      }
    },
    baseStats: {
      agility: { value: 3, isPercentage: false },
      intelligence: { value: 1, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          poison: { value: 4, isPercentage: false },
          blight: { value: 2, isPercentage: false }
        }
      },
      onHitEffects: {
        enabled: true,
        procType: 'dice',
        procChance: 20,
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
            formula: '1d6',
            damageType: 'blight',
            isDot: true,
            dotDuration: 3,
            dotTickFrequency: 'round',
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },

  // === FALSE PROPHET (Sundrift Vale) ===
  {
    id: 'faiths-edge-glaive',
    name: "Faith's Edge Glaive",
    type: 'weapon',
    subtype: 'POLEARM',
    quality: 'rare',
    description: 'Mor-Vereth\'s glaive, curved like a question mark — because every strike is a question about the nature of belief. The blade vibrates at a frequency that induces doubt in the unworthy.',
    iconId: 'Instruments/Guitar/guitar-ukulele-beige-octagonal',
    value: { gold: 2, silver: 50, copper: 0 },
    stackable: false,
    width: 1,
    height: 2,
    rotation: 0,
    slots: ['mainHand'],
    weaponSlot: 'ONE_HANDED',
    hand: 'MAIN_HAND',
    weaponStats: {
      baseDamage: {
        diceCount: 1,
        diceType: 'd8',
        damageType: 'arcane',
        bonusDamage: 2
      }
    },
    baseStats: {
      spirit: { value: 3, isPercentage: false },
      intelligence: { value: 2, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          arcane: { value: 3, isPercentage: false },
          psychic: { value: 2, isPercentage: false }
        }
      },
      onHitEffects: {
        enabled: true,
        procType: 'cards',
        procChance: 20,
        diceThreshold: 17,
        cardProcRule: 'face_cards',
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
            controlDuration: 1,
            saveDC: 14,
            saveType: 'spirit',
            knockbackDistance: 0,
            targetType: 'attacker',
            areaRadius: 0
          }
        }
      }
    },
    durability: 'd8',
    maxDurability: 'd8'
  },

  // === GAMBIT (Iceheart/Cragjaw/Bryngloom) ===
  {
    id: 'probability-weaver-twin-blades',
    name: 'Probability-Weaver\'s Twins',
    type: 'weapon',
    subtype: 'SICKLE',
    quality: 'epic',
    description: 'Merr-Cael\'s twin blades from a single Merrowport anchor. Each strike shifts the probability of the next — making the impossible likely and the certain uncertain.',
    iconId: 'Weapons/Sickles/sickle-curved-blade-beige-brown-handle-simple',
    value: { gold: 5, silver: 0, copper: 0 },
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
        damageType: 'storm',
        bonusDamage: 3
      }
    },
    baseStats: {
      agility: { value: 3, isPercentage: false },
      intelligence: { value: 3, isPercentage: false }
    },
    combatStats: {
      spellDamage: {
        types: {
          arcane: { value: 3, isPercentage: false },
          wyrd: { value: 2, isPercentage: false }
        }
      },
      onHitEffects: {
        enabled: true,
        procType: 'coins',
        procChance: 20,
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
    },
    durability: 'd10',
    maxDurability: 'd10'
  }
];
