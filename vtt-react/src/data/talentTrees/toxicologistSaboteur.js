// ============================================
// toxicologistSaboteur (v4: Canonical 50-Point Economy & Balanced)
// ============================================

export const TOXICOLOGIST_SABOTEUR = [
  {
    "id": "sb_t1_corrosive_flask",
    "name": "Vitriol Flask",
    "icon": "spell_nature_corrosivebreath",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 0
    },
    "requires": null,
    "spell": {
      "name": "Vitriol Flask",
      "description": "Spend 1 AP: Hurl a flask of concentrated vitriol up to 40 feet dealing 1d8 acid damage and melting 1 point of enemy Armor for 2 rounds.",
      "flavorText": "It eats through iron, flesh, and stone without prejudice.",
      "source": "talent",
      "class": "Toxicologist",
      "treeId": "saboteur",
      "spellType": "ACTIVE",
      "category": "damage",
      "actionPoints": 1,
      "targetingMode": "single",
      "rangeType": "ranged",
      "range": 40,
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 1,
      "cooldownUnit": "round",
      "primaryDamage": {
        "dice": "1d8",
        "flat": 0,
        "procChance": 100
      },
      "damageTypes": [
        "blight"
      ],
      "visualTheme": "poison",
      "tags": [
        "flask",
        "acid",
        "armor-shred",
        "toxicologist"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Deals 2d6 acid damage and shreds 2 points of Armor.",
        "primaryDamage": {
          "dice": "2d6",
          "flat": 0,
          "procChance": 100
        }
      },
      {
        "description": "Deals 2d8 acid damage, shreds 2 points of Armor, and splashes 1d4 acid damage to adjacent foes.",
        "primaryDamage": {
          "dice": "2d8",
          "flat": 0,
          "procChance": 100
        }
      }
    ]
  },
  {
    "id": "sb_t1_caustic_coating",
    "name": "Caustic Coating",
    "icon": "ability_rogue_deadlybrew",
    "maxRanks": 3,
    "position": {
      "x": 2,
      "y": 0
    },
    "requires": null,
    "spell": {
      "name": "Caustic Coating",
      "description": "Passive: Your weapon attacks deal +1d4 acid damage and degrade enemy Armor by 1 for 1 round.",
      "flavorText": "A thin film of acid on the blade ensures the cut keeps widening.",
      "source": "talent",
      "class": "Toxicologist",
      "treeId": "saboteur",
      "spellType": "PASSIVE",
      "category": "damage",
      "targetingMode": "self",
      "damageTypes": [
        "blight"
      ],
      "primaryDamage": {
        "dice": "1d4",
        "flat": 0,
        "procChance": 100
      },
      "visualTheme": "poison",
      "tags": [
        "passive",
        "acid",
        "toxicologist"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Weapon attacks deal +1d6 acid damage."
      },
      {
        "description": "Weapon attacks deal +1d8 acid damage and ignore up to 2 points of Armor."
      }
    ]
  },
  {
    "id": "sb_t1_demolition_insight",
    "name": "Demolition Insight",
    "icon": "inv_misc_bomb_04",
    "maxRanks": 2,
    "position": {
      "x": 3,
      "y": 0
    },
    "requires": null,
    "spell": {
      "name": "Demolition Insight",
      "description": "Passive: You gain +1 to hit against armored enemies and constructs, and your attacks deal +2 flat damage to objects and barriers.",
      "flavorText": "Find the structural fault, insert the wedge, light the fuse.",
      "source": "talent",
      "class": "Toxicologist",
      "treeId": "saboteur",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "fire",
      "tags": [
        "passive",
        "siege",
        "accuracy",
        "toxicologist"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Gain +2 to hit against armored targets, and +4 flat damage to objects and barriers."
      }
    ]
  },
  {
    "id": "sb_t2_breaching_charge",
    "name": "Breaching Charge",
    "icon": "spell_fire_selfdestruct",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 1
    },
    "requires": "sb_t1_corrosive_flask",
    "spell": {
      "name": "Breaching Charge",
      "description": "Spend 1 AP: Plant an explosive charge on a foe or structure within 30 feet. Detonates for 2d6 bludgeoning + 1d4 fire damage and knocks targets Prone on a failed Fortitude save.",
      "flavorText": "Doors, shields, ribs — everything yields under directional blast.",
      "source": "talent",
      "class": "Toxicologist",
      "treeId": "saboteur",
      "spellType": "ACTIVE",
      "category": "damage",
      "actionPoints": 1,
      "targetingMode": "single",
      "rangeType": "ranged",
      "range": 30,
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 2,
      "cooldownUnit": "rounds",
      "primaryDamage": {
        "dice": "2d6",
        "flat": 0,
        "procChance": 100
      },
      "damageTypes": [
        "smashing",
        "ember"
      ],
      "visualTheme": "fire",
      "tags": [
        "explosive",
        "knockdown",
        "toxicologist"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Deals 2d8 bludgeoning + 1d6 fire damage and shreds 2 Armor.",
        "primaryDamage": {
          "dice": "2d8",
          "flat": 0,
          "procChance": 100
        }
      },
      {
        "description": "Deals 3d6 bludgeoning + 1d8 fire damage, shreds 3 Armor, and destroys partial cover in a 10-foot radius.",
        "primaryDamage": {
          "dice": "3d6",
          "flat": 0,
          "procChance": 100
        }
      }
    ]
  },
  {
    "id": "sb_t2_corrosive_puddle",
    "name": "Acid Trap",
    "icon": "spell_nature_acid_01",
    "maxRanks": 3,
    "position": {
      "x": 3,
      "y": 1
    },
    "requires": "sb_t1_demolition_insight",
    "spell": {
      "name": "Acid Trap",
      "description": "Spend 1 AP: Lay a pressurized acid canister up to 30 feet away. When triggered, sprays a 10-foot radius dealing 1d8 acid damage and reducing enemy movement speed by 10 feet for 2 rounds.",
      "flavorText": "Stepping into a puddle that boils your boots.",
      "source": "talent",
      "class": "Toxicologist",
      "treeId": "saboteur",
      "spellType": "ACTIVE",
      "category": "damage",
      "actionPoints": 1,
      "targetingMode": "aoe",
      "aoeShape": "circle",
      "aoeSize": 10,
      "rangeType": "ranged",
      "range": 30,
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 2,
      "cooldownUnit": "rounds",
      "primaryDamage": {
        "dice": "1d8",
        "flat": 0,
        "procChance": 100
      },
      "damageTypes": [
        "blight"
      ],
      "visualTheme": "poison",
      "tags": [
        "trap",
        "acid",
        "slow",
        "toxicologist"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Deals 2d6 acid damage and reduces enemy Armor by 2.",
        "primaryDamage": {
          "dice": "2d6",
          "flat": 0,
          "procChance": 100
        }
      },
      {
        "description": "Deals 2d8 acid damage, reduces Armor by 3, and acid pools on the ground for 2 rounds.",
        "primaryDamage": {
          "dice": "2d8",
          "flat": 0,
          "procChance": 100
        }
      }
    ]
  },
  {
    "id": "sb_t3_vitriol_stream",
    "name": "Vitriol Torrent",
    "icon": "spell_nature_corrosivebreath",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 2
    },
    "requires": "sb_t2_breaching_charge",
    "spell": {
      "name": "Vitriol Torrent",
      "description": "Spend 1 AP: Spray a 20-foot cone of boiling acid dealing 2d6 acid damage to all enemies and reducing their Armor by 2 for 2 rounds.",
      "flavorText": "A deluge that strips polish, paint, and flesh.",
      "source": "talent",
      "class": "Toxicologist",
      "treeId": "saboteur",
      "spellType": "ACTIVE",
      "category": "damage",
      "actionPoints": 1,
      "targetingMode": "aoe",
      "aoeShape": "cone",
      "aoeSize": 20,
      "rangeType": "ranged",
      "range": 20,
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 2,
      "cooldownUnit": "rounds",
      "primaryDamage": {
        "dice": "2d6",
        "flat": 0,
        "procChance": 100
      },
      "damageTypes": [
        "blight"
      ],
      "visualTheme": "poison",
      "tags": [
        "cone",
        "acid",
        "armor-shred",
        "toxicologist"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Deals 2d8 acid damage and melts 3 Armor.",
        "primaryDamage": {
          "dice": "2d8",
          "flat": 0,
          "procChance": 100
        }
      },
      {
        "description": "Deals 3d6 acid damage, melts 3 Armor, and inflicts Burning Acid (1d6/rd for 2 rounds).",
        "primaryDamage": {
          "dice": "3d6",
          "flat": 0,
          "procChance": 100
        }
      }
    ]
  },
  {
    "id": "sb_t3_reactive_coating",
    "name": "Ablative Slag Plating",
    "icon": "inv_shield_04",
    "maxRanks": 3,
    "position": {
      "x": 3,
      "y": 2
    },
    "requires": "sb_t2_corrosive_puddle",
    "spell": {
      "name": "Ablative Slag Plating",
      "description": "Passive: When an enemy strikes you with a melee weapon, their weapon is corroded, suffering -1 to hit and -1 damage for 2 rounds (stacks up to 3 times).",
      "flavorText": "Every blow they land ruins their own equipment.",
      "source": "talent",
      "class": "Toxicologist",
      "treeId": "saboteur",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "poison",
      "tags": [
        "passive",
        "retaliation",
        "debuff",
        "toxicologist"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Enemy suffers -2 to hit upon striking you in melee."
      },
      {
        "description": "Enemy suffers -2 to hit and takes 1d6 acid backlash when striking you."
      }
    ]
  },
  {
    "id": "sb_t4_thermite_blast",
    "name": "Thermite Core Bomb",
    "icon": "spell_fire_fireball02",
    "maxRanks": 2,
    "position": {
      "x": 1,
      "y": 3
    },
    "requires": [
      "sb_t3_vitriol_stream",
      "sb_t3_reactive_coating"
    ],
    "spell": {
      "name": "Thermite Core Bomb",
      "description": "Spend 1 AP: Hurl a white-hot thermite incendiary within 40 feet. Detonates in a 15-foot radius dealing 2d10 ember + acid damage, completely melting all enemy temporary hit point shields and shredding 3 Armor.",
      "flavorText": "Thermite burns underwater, underground, and through dragon scale.",
      "source": "talent",
      "class": "Toxicologist",
      "treeId": "saboteur",
      "spellType": "ACTIVE",
      "category": "damage",
      "actionPoints": 1,
      "targetingMode": "aoe",
      "aoeShape": "circle",
      "aoeSize": 15,
      "rangeType": "ranged",
      "range": 40,
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 3,
      "cooldownUnit": "rounds",
      "primaryDamage": {
        "dice": "2d10",
        "flat": 0,
        "procChance": 100
      },
      "damageTypes": [
        "ember",
        "blight"
      ],
      "visualTheme": "fire",
      "tags": [
        "aoe",
        "thermite",
        "shield-breaker",
        "toxicologist"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Thermite Core Bomb gains +1d6 bonus damage and refunds 1 AP on critical hits."
      }
    ]
  },
  {
    "id": "sb_t5_corrosive_fumes",
    "name": "Caustic Fumes",
    "icon": "spell_shadow_mindrot",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 4
    },
    "requires": "sb_t4_thermite_blast",
    "spell": {
      "name": "Caustic Fumes",
      "description": "Passive: All your acid attacks leave lingering toxic fumes. Enemies that take acid damage suffer +1d4 bonus acid damage on the next attack that hits them.",
      "flavorText": "The flesh is softened, ready to receive the next strike.",
      "source": "talent",
      "class": "Toxicologist",
      "treeId": "saboteur",
      "spellType": "PASSIVE",
      "category": "debuff",
      "targetingMode": "self",
      "damageTypes": [
        "blight"
      ],
      "primaryDamage": {
        "dice": "1d4",
        "flat": 0,
        "procChance": 100
      },
      "visualTheme": "poison",
      "tags": [
        "passive",
        "vulnerability",
        "toxicologist"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Bonus damage increases to +1d6 acid."
      },
      {
        "description": "Bonus damage increases to +1d8 acid, and affects all damage types."
      }
    ]
  },
  {
    "id": "sb_t5_structural_collapse",
    "name": "Structural Shatter",
    "icon": "ability_warrior_sunder",
    "maxRanks": 2,
    "position": {
      "x": 3,
      "y": 4
    },
    "requires": "sb_t4_thermite_blast",
    "spell": {
      "name": "Structural Shatter",
      "description": "Passive: Critical hits with your weapons or explosives reduce target Armor to 0 for 1 round and inflict Stagger.",
      "flavorText": "When the load-bearing pillar crumbles, the whole structure follows.",
      "source": "talent",
      "class": "Toxicologist",
      "treeId": "saboteur",
      "spellType": "PASSIVE",
      "category": "debuff",
      "targetingMode": "self",
      "visualTheme": "fire",
      "tags": [
        "passive",
        "crit",
        "armor-shred",
        "toxicologist"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Critical hits also knock the target Prone and deal +1d8 bonus damage."
      }
    ]
  },
  {
    "id": "sb_t6_obliteration_payload",
    "name": "Obliteration Payload",
    "icon": "spell_fire_meteorstorm",
    "maxRanks": 3,
    "position": {
      "x": 1.5,
      "y": 5
    },
    "requires": [
      "sb_t5_corrosive_fumes",
      "sb_t5_structural_collapse"
    ],
    "spell": {
      "name": "Obliteration Payload",
      "description": "Spend 2 AP: Launch a massive canister containing dual chambers of acid and explosive nitro up to 45 feet. Deals 3d8 acid + 1d8 fire damage (4d8 total) in a 25-foot radius and shatters all cover.",
      "flavorText": "No walls, no barricades, no survivors.",
      "source": "talent",
      "class": "Toxicologist",
      "treeId": "saboteur",
      "spellType": "ACTIVE",
      "category": "damage",
      "actionPoints": 2,
      "targetingMode": "aoe",
      "aoeShape": "circle",
      "aoeSize": 25,
      "rangeType": "ranged",
      "range": 45,
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 3,
      "cooldownUnit": "rounds",
      "primaryDamage": {
        "dice": "4d8",
        "flat": 0,
        "procChance": 100
      },
      "damageTypes": [
        "blight",
        "ember"
      ],
      "visualTheme": "fire",
      "tags": [
        "nuke",
        "aoe",
        "demolition",
        "toxicologist"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Deals 4d10 total damage and leaves acid pool for 2 rounds.",
        "primaryDamage": {
          "dice": "4d10",
          "flat": 0,
          "procChance": 100
        }
      },
      {
        "description": "Deals 5d8 total damage, destroys all terrain obstacles, and knocks all enemies Prone.",
        "primaryDamage": {
          "dice": "5d8",
          "flat": 0,
          "procChance": 100
        }
      }
    ]
  },
  {
    "id": "sb_t4_mastery_focus",
    "name": "Thermite Core Bomb Resonance",
    "icon": "spell_fire_fireball02",
    "maxRanks": 3,
    "position": {
      "x": 3,
      "y": 3
    },
    "requires": "sb_t3_reactive_coating",
    "spell": {
      "name": "Thermite Core Bomb Resonance",
      "description": "Passive: Your class abilities deal +1d4 bonus damage and cost 1 less resource when below half health.",
      "flavorText": "Focus sharpens under the pressure of battle.",
      "source": "talent",
      "class": "Toxicologist",
      "treeId": "saboteur",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "fire",
      "tags": [
        "passive",
        "efficiency",
        "toxicologist"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Class abilities deal +1d6 bonus damage and cost 1 less resource."
      },
      {
        "description": "Class abilities deal +1d8 bonus damage, cost 1 less resource, and grant +1 to hit."
      }
    ]
  },
  {
    "id": "sb_t6_unyielding_mastery",
    "name": "Unyielding Resolve",
    "icon": "ability_warrior_defensivestance",
    "maxRanks": 2,
    "position": {
      "x": 3.5,
      "y": 5
    },
    "requires": "sb_t5_structural_collapse",
    "spell": {
      "name": "Unyielding Resolve",
      "description": "Passive: You gain +1 Damage Reduction against all attacks and advantage on saving throws against stun and fear.",
      "flavorText": "Standing immovable against the onslaught.",
      "source": "talent",
      "class": "Toxicologist",
      "treeId": "saboteur",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "fire",
      "tags": [
        "passive",
        "defense",
        "toxicologist"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Gain +2 Damage Reduction against all attacks and immunity to fear."
      }
    ]
  },
  {
    "id": "sb_t7_master_saboteur",
    "name": "Master of Cataclysm",
    "icon": "spell_fire_soulburn",
    "maxRanks": 1,
    "position": {
      "x": 0,
      "y": 6
    },
    "requires": "sb_t6_obliteration_payload",
    "spell": {
      "name": "Master of Cataclysm",
      "description": "ULTIMATE: Spend 2 AP: For 2 rounds, all your acid and explosive damage completely ignores enemy Armor and Damage Reduction, and 50% of single-target explosive damage splashes to all enemies within 15 feet.",
      "flavorText": "Engineering turned entirely to the art of absolute ruin.",
      "source": "talent",
      "class": "Toxicologist",
      "treeId": "saboteur",
      "spellType": "ACTIVE",
      "category": "buff",
      "actionPoints": 2,
      "targetingMode": "self",
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 5,
      "cooldownUnit": "rounds",
      "visualTheme": "fire",
      "tags": [
        "ultimate",
        "demolition",
        "buff",
        "toxicologist"
      ]
    },
    "rankUpgrades": []
  },
  {
    "id": "sb_t7_doctrine_mastery",
    "name": "Toxicologist Doctrine",
    "icon": "spell_holy_blessingofstrength",
    "maxRanks": 5,
    "position": {
      "x": 1,
      "y": 6
    },
    "requires": "sb_t6_obliteration_payload",
    "spell": {
      "name": "Toxicologist Doctrine",
      "description": "Passive: All damage and healing dealt by your Toxicologist abilities is increased by +1 flat magnitude.",
      "flavorText": "The foundational principles of your path, mastered completely.",
      "source": "talent",
      "class": "Toxicologist",
      "treeId": "saboteur",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "poison",
      "tags": [
        "passive",
        "capstone",
        "scaling",
        "toxicologist"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Abilities increased by +2 flat magnitude."
      },
      {
        "description": "Abilities increased by +3 flat magnitude."
      },
      {
        "description": "Abilities increased by +4 flat magnitude."
      },
      {
        "description": "Abilities increased by +5 flat magnitude and +1d4 bonus damage on critical hits."
      }
    ]
  },
  {
    "id": "sb_t7_chain_detonation",
    "name": "Chain Detonation",
    "icon": "spell_fire_selfdestruct",
    "maxRanks": 3,
    "position": {
      "x": 2,
      "y": 6
    },
    "requires": "sb_t6_obliteration_payload",
    "spell": {
      "name": "Chain Detonation",
      "description": "Passive: When an enemy dies from acid or explosive damage, they detonate for 2d8 acid damage to all adjacent enemies, shredding 2 Armor.",
      "flavorText": "Their own armor supplies the shrapnel.",
      "source": "talent",
      "class": "Toxicologist",
      "treeId": "saboteur",
      "spellType": "PASSIVE",
      "category": "damage",
      "targetingMode": "self",
      "damageTypes": [
        "blight"
      ],
      "primaryDamage": {
        "dice": "2d8",
        "flat": 0,
        "procChance": 100
      },
      "visualTheme": "poison",
      "tags": [
        "passive",
        "corpse-burst",
        "toxicologist"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Chain Detonation rank 2: resource generation +1 and +5ft speed."
      },
      {
        "description": "Chain Detonation rank 3: resource generation +2 and +1 to hit."
      }
    ]
  },
  {
    "id": "sb_t7_impervious_hazmat",
    "name": "Impervious Hazmat Suit",
    "icon": "inv_chest_chain_11",
    "maxRanks": 3,
    "position": {
      "x": 3,
      "y": 6
    },
    "requires": "sb_t6_obliteration_payload",
    "spell": {
      "name": "Impervious Hazmat Suit",
      "description": "Passive: You are immune to Acid and Fire damage, and you take zero friendly-fire or self-damage from your own explosives.",
      "flavorText": "Tested against every chemical known to mortal alchemy.",
      "source": "talent",
      "class": "Toxicologist",
      "treeId": "saboteur",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "arcane",
      "tags": [
        "passive",
        "immunity",
        "toxicologist"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Impervious Hazmat Suit rank 2: +2 Damage Reduction and +10 max HP."
      },
      {
        "description": "Impervious Hazmat Suit rank 3: +2 Damage Reduction, +15 max HP, and immunity to prone."
      }
    ]
  },
  {
    "id": "sb_t7_capstone_gamma",
    "name": "Transcendent Precision",
    "icon": "ability_hunter_snipershot",
    "spell": {
      "name": "Transcendent Precision",
      "description": "Passive: All critical strikes deal +1d6 bonus damage and restore 1d4 Hit Points.",
      "flavorText": "Striking the exact pressure point between life and death.",
      "source": "talent",
      "class": "Toxicologist",
      "treeId": "saboteur",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "poison",
      "tags": [
        "passive",
        "capstone",
        "toxicologist"
      ]
    },
    "maxRanks": 3,
    "position": {
      "x": 4,
      "y": 6
    },
    "requires": "sb_t6_obliteration_payload",
    "rankUpgrades": [
      {
        "description": "Transcendent Precision rank 2: crits deal +1d8 bonus damage and heal for 1d6."
      },
      {
        "description": "Transcendent Precision rank 3: crits deal +2d6 bonus damage and heal for 1d8."
      }
    ]
  }
];

