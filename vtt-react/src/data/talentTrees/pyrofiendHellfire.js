// ============================================
// pyrofiendHellfire (v4: Canonical 50-Point Economy & Balanced)
// ============================================

export const PYROFIEND_HELLFIRE = [
  {
    "id": "hf_t1_ember_resilience",
    "name": "Brimstone Hardening",
    "icon": "spell_shadow_shadowwordpain",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 0
    },
    "requires": null,
    "spell": {
      "name": "Brimstone Hardening",
      "description": "Passive: Your skin hardens with volcanic crust, granting you +1 Damage Reduction against physical attacks.",
      "flavorText": "The fire that lives in you pays rent in stone.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "hellfire",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "fire",
      "tags": [
        "passive",
        "dr",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Physical Damage Reduction increases to +2."
      },
      {
        "description": "Physical Damage Reduction increases to +2, and you gain +2 to saving throws against knockdowns."
      }
    ]
  },
  {
    "id": "hf_t1_soul_fire",
    "name": "Brimstone Leach",
    "icon": "spell_fire_soulburn",
    "maxRanks": 3,
    "position": {
      "x": 2,
      "y": 0
    },
    "requires": null,
    "spell": {
      "name": "Brimstone Leach",
      "description": "Passive: Whenever you deal ember damage to an enemy within 20 feet, restore 1 Hit Point.",
      "flavorText": "Every flame is a hungry mouth.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "hellfire",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "damageTypes": [
        "ember"
      ],
      "visualTheme": "fire",
      "tags": [
        "passive",
        "lifesteal",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Restores 2 Hit Points on hit."
      },
      {
        "description": "Restores 3 Hit Points on hit and your ember spells deal +1d4 dark ember damage."
      }
    ]
  },
  {
    "id": "hf_t1_dark_empowerment",
    "name": "Ash Shroud",
    "icon": "spell_shadow_soulburn",
    "maxRanks": 2,
    "position": {
      "x": 3,
      "y": 0
    },
    "requires": null,
    "spell": {
      "name": "Ash Shroud",
      "description": "Passive: A swirling cloud of dark volcanic ash surrounds you. Ranged weapon attacks against you suffer -1 to hit.",
      "flavorText": "The Abyss grants obscurity to its favored.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "hellfire",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "fire",
      "tags": [
        "passive",
        "deflection",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Ranged attacks against you suffer -2 to hit, and you can hide in dim light or ash clouds."
      }
    ]
  },
  {
    "id": "hf_t2_drain_life",
    "name": "Searing Siphon",
    "icon": "spell_shadow_lifedrain",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 1
    },
    "requires": "hf_t1_ember_resilience",
    "spell": {
      "name": "Searing Siphon",
      "description": "Spend 1 AP: Channel a beam of dark flame into a target within 40 feet, dealing 1d8 ember damage and healing you for 3 Hit Points.",
      "flavorText": "Generosity, reversed.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "hellfire",
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
        "ember"
      ],
      "visualTheme": "fire",
      "tags": [
        "drain",
        "healing",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Deals 2d6 ember damage and heals for 5 Hit Points.",
        "primaryDamage": {
          "dice": "2d6",
          "flat": 0,
          "procChance": 100
        }
      },
      {
        "description": "Deals 2d8 ember damage, heals for 7 Hit Points, and slows the target's movement by 10 feet.",
        "primaryDamage": {
          "dice": "2d8",
          "flat": 0,
          "procChance": 100
        }
      }
    ]
  },
  {
    "id": "hf_t2_cinderward",
    "name": "Brimstone Ward",
    "icon": "spell_fire_twilightfireward",
    "maxRanks": 3,
    "position": {
      "x": 3,
      "y": 1
    },
    "requires": "hf_t1_dark_empowerment",
    "spell": {
      "name": "Brimstone Ward",
      "description": "Spend 1 AP: Form a hardened mantle of black slag, gaining 6 temporary Hit Points and +1 Armor for 2 rounds.",
      "flavorText": "Every promotion comes with hardened crust.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "hellfire",
      "spellType": "ACTIVE",
      "category": "buff",
      "actionPoints": 1,
      "targetingMode": "self",
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 2,
      "cooldownUnit": "rounds",
      "visualTheme": "fire",
      "tags": [
        "shield",
        "armor",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Grants 10 temporary Hit Points and +2 Armor."
      },
      {
        "description": "Grants 14 temporary Hit Points, +2 Armor, and when broken erupts for 1d8 ember damage to adjacent enemies."
      }
    ]
  },
  {
    "id": "hf_t3_demon_form",
    "name": "Volcanic Spike",
    "icon": "spell_fire_volcano",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 2
    },
    "requires": "hf_t2_drain_life",
    "spell": {
      "name": "Volcanic Spike",
      "description": "Spend 1 AP: Erupt a jagged spike of molten brimstone under an enemy within 45 feet, dealing 2d6 piercing + 1d6 ember damage (3d6 total) and Pinning the target for 1 round on a failed Fortitude save.",
      "flavorText": "The earth punches upward with a fist of obsidian.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "hellfire",
      "spellType": "ACTIVE",
      "category": "damage",
      "actionPoints": 1,
      "targetingMode": "single",
      "rangeType": "ranged",
      "range": 45,
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 2,
      "cooldownUnit": "rounds",
      "primaryDamage": {
        "dice": "3d6",
        "flat": 0,
        "procChance": 100
      },
      "damageTypes": [
        "stabbing",
        "ember"
      ],
      "visualTheme": "fire",
      "tags": [
        "strike",
        "spike",
        "pin",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Deals 2d6 piercing + 2d6 ember damage (4d6 total) and creates difficult terrain in a 5-foot radius.",
        "primaryDamage": {
          "dice": "4d6",
          "flat": 0,
          "procChance": 100
        }
      },
      {
        "description": "Deals 2d8 piercing + 2d8 ember damage (4d8 total), Pins target, and shatters for 1d6 shrapnel on impact.",
        "primaryDamage": {
          "dice": "4d8",
          "flat": 0,
          "procChance": 100
        }
      }
    ]
  },
  {
    "id": "hf_t3_soul_link",
    "name": "Suffocating Ash",
    "icon": "spell_shadow_mindrot",
    "maxRanks": 3,
    "position": {
      "x": 3,
      "y": 2
    },
    "requires": "hf_t2_cinderward",
    "spell": {
      "name": "Suffocating Ash",
      "description": "Spend 1 AP: Erupt a 15-foot cloud of choking volcanic ash within 40 feet for 2 rounds. Enemies inside have Disadvantage on Perception checks and suffer 1d6 ember damage when casting spells.",
      "flavorText": "Breathe in the powdered glass of Emberspire.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "hellfire",
      "spellType": "ACTIVE",
      "category": "debuff",
      "actionPoints": 1,
      "targetingMode": "aoe",
      "aoeShape": "circle",
      "aoeSize": 15,
      "rangeType": "ranged",
      "range": 40,
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 2,
      "cooldownUnit": "rounds",
      "primaryDamage": {
        "dice": "1d6",
        "flat": 0,
        "procChance": 100
      },
      "damageTypes": [
        "ember"
      ],
      "visualTheme": "fire",
      "tags": [
        "aoe",
        "cloud",
        "silence-hazard",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Cloud size increases to 20 feet, and spellcasting backlash increases to 1d8 ember damage."
      },
      {
        "description": "Enemies inside are Silenced on turns they take ember damage."
      }
    ]
  },
  {
    "id": "hf_t4_soul_chains",
    "name": "Brimstone Clasp",
    "icon": "spell_shadow_shadowworddominate",
    "maxRanks": 2,
    "position": {
      "x": 1,
      "y": 3
    },
    "requires": [
      "hf_t3_demon_form",
      "hf_t3_soul_link"
    ],
    "spell": {
      "name": "Brimstone Clasp",
      "description": "Spend 1 AP: Hurl chains of dark molten iron at an enemy within 40 feet dealing 2d8 ember damage and pulling them 20 feet toward you, immobilizing them for 1 round on a failed Strength save.",
      "flavorText": "Tethered to the hearth of doom.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "hellfire",
      "spellType": "ACTIVE",
      "category": "damage",
      "actionPoints": 1,
      "targetingMode": "single",
      "rangeType": "ranged",
      "range": 40,
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 2,
      "cooldownUnit": "rounds",
      "primaryDamage": {
        "dice": "2d8",
        "flat": 0,
        "procChance": 100
      },
      "damageTypes": [
        "ember"
      ],
      "visualTheme": "fire",
      "tags": [
        "pull",
        "chain",
        "immobilize",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Brimstone Clasp gains +1d6 bonus damage and refunds 1 AP on critical hits."
      }
    ]
  },
  {
    "id": "hf_t5_dark_vitality",
    "name": "Abyssal Siphon",
    "icon": "spell_shadow_antimagicshell",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 4
    },
    "requires": "hf_t4_soul_chains",
    "spell": {
      "name": "Abyssal Siphon",
      "description": "Passive: Critical hits with your dark ember spells heal you for 6 Hit Points and grant you +1 Damage Reduction for 1 round.",
      "flavorText": "Taking vitality straight from their marrow.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "hellfire",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "fire",
      "tags": [
        "passive",
        "crit-heal",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Critical hits heal for 10 Hit Points and grant +2 Damage Reduction."
      },
      {
        "description": "Critical hits heal for 14 Hit Points, grant +2 Damage Reduction, and cause the target to drop 1 rank of weapon guard."
      }
    ]
  },
  {
    "id": "hf_t5_crushing_gravity",
    "name": "Obsidian Weight",
    "icon": "spell_shadow_curseofsargeras",
    "maxRanks": 2,
    "position": {
      "x": 3,
      "y": 4
    },
    "requires": "hf_t4_soul_chains",
    "spell": {
      "name": "Obsidian Weight",
      "description": "Passive: Enemies taking damage from your ground hazards or volcanic spikes suffer Disadvantage on Strength checks and saving throws for 1 round.",
      "flavorText": "The weight of the mountain bears down upon their limbs.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "hellfire",
      "spellType": "PASSIVE",
      "category": "debuff",
      "targetingMode": "self",
      "visualTheme": "fire",
      "tags": [
        "passive",
        "save-debuff",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Enemies also suffer -2 to their Armor class while affected."
      }
    ]
  },
  {
    "id": "hf_t6_dark_oblivion",
    "name": "Brimstone Calamity",
    "icon": "spell_fire_meteorstorm",
    "maxRanks": 3,
    "position": {
      "x": 1.5,
      "y": 5
    },
    "requires": [
      "hf_t5_dark_vitality",
      "hf_t5_crushing_gravity"
    ],
    "spell": {
      "name": "Brimstone Calamity",
      "description": "Spend 2 AP: Call down heavy volcanic slag on a 25-foot area dealing 3d8 ember + 1d8 bludgeoning damage (4d8 total) and creating heavy rubble terrain for 3 rounds.",
      "flavorText": "The ceiling of the cavern gives way to molten iron.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "hellfire",
      "spellType": "ACTIVE",
      "category": "damage",
      "actionPoints": 2,
      "targetingMode": "aoe",
      "aoeShape": "circle",
      "aoeSize": 25,
      "rangeType": "ranged",
      "range": 40,
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
        "ember",
        "smashing"
      ],
      "visualTheme": "fire",
      "tags": [
        "aoe",
        "calamity",
        "rubble",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Deals 4d10 total damage and Knocks all targets Prone on a failed Fortitude save.",
        "primaryDamage": {
          "dice": "4d10",
          "flat": 0,
          "procChance": 100
        }
      },
      {
        "description": "Deals 4d10 total damage, knocks Prone, and you heal for 8 Hit Points if at least 2 enemies are hit.",
        "primaryDamage": {
          "dice": "4d10",
          "flat": 0,
          "procChance": 100
        }
      }
    ]
  },
  {
    "id": "hf_t4_mastery_focus",
    "name": "Brimstone Clasp Resonance",
    "icon": "spell_shadow_shadowworddominate",
    "maxRanks": 3,
    "position": {
      "x": 3,
      "y": 3
    },
    "requires": "hf_t3_soul_link",
    "spell": {
      "name": "Brimstone Clasp Resonance",
      "description": "Passive: Your class abilities deal +1d4 bonus damage and cost 1 less resource when below half health.",
      "flavorText": "Focus sharpens under the pressure of battle.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "hellfire",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "fire",
      "tags": [
        "passive",
        "efficiency",
        "pyrofiend"
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
    "id": "hf_t6_unyielding_mastery",
    "name": "Unyielding Resolve",
    "icon": "ability_warrior_defensivestance",
    "maxRanks": 2,
    "position": {
      "x": 3.5,
      "y": 5
    },
    "requires": "hf_t5_crushing_gravity",
    "spell": {
      "name": "Unyielding Resolve",
      "description": "Passive: You gain +1 Damage Reduction against all attacks and advantage on saving throws against stun and fear.",
      "flavorText": "Standing immovable against the onslaught.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "hellfire",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "fire",
      "tags": [
        "passive",
        "defense",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Gain +2 Damage Reduction against all attacks and immunity to fear."
      }
    ]
  },
  {
    "id": "hf_t7_avatar_of_brimstone",
    "name": "Avatar of Brimstone",
    "icon": "spell_shadow_demonicempathy",
    "maxRanks": 1,
    "position": {
      "x": 0,
      "y": 6
    },
    "requires": "hf_t6_dark_oblivion",
    "spell": {
      "name": "Avatar of Brimstone",
      "description": "ULTIMATE: Spend 2 AP: For 2 rounds, transform into an avatar of dark basalt and magma. You gain +4 Damage Reduction, your attacks deal +1d10 dark ember damage, and all enemies within 10 feet suffer 4 ember damage and -10 feet movement speed at the start of their turns.",
      "flavorText": "The mountain awakens in flesh.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "hellfire",
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
        "avatar",
        "pyrofiend"
      ]
    },
    "rankUpgrades": []
  },
  {
    "id": "hf_t7_doctrine_mastery",
    "name": "Pyrofiend Doctrine",
    "icon": "spell_holy_blessingofstrength",
    "maxRanks": 5,
    "position": {
      "x": 1,
      "y": 6
    },
    "requires": "hf_t6_dark_oblivion",
    "spell": {
      "name": "Pyrofiend Doctrine",
      "description": "Passive: All damage and healing dealt by your Pyrofiend abilities is increased by +1 flat magnitude.",
      "flavorText": "The foundational principles of your path, mastered completely.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "hellfire",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "fire",
      "tags": [
        "passive",
        "capstone",
        "scaling",
        "pyrofiend"
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
    "id": "hf_t7_obsidian_skin",
    "name": "Obsidian Core",
    "icon": "spell_shadow_shadowform",
    "maxRanks": 3,
    "position": {
      "x": 2,
      "y": 6
    },
    "requires": "hf_t6_dark_oblivion",
    "spell": {
      "name": "Obsidian Core",
      "description": "Passive: You cannot be Stunned or Dazed by physical attacks, and your maximum health increases by 10 Hit Points.",
      "flavorText": "Basalt does not yield to blunt force.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "hellfire",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "fire",
      "tags": [
        "passive",
        "immunity",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Obsidian Core rank 2: resource generation +1 and +5ft speed."
      },
      {
        "description": "Obsidian Core rank 3: resource generation +2 and +1 to hit."
      }
    ]
  },
  {
    "id": "hf_t7_hellfire_eruption",
    "name": "Volcanic Rupture",
    "icon": "spell_fire_selfdestruct",
    "maxRanks": 3,
    "position": {
      "x": 3,
      "y": 6
    },
    "requires": "hf_t6_dark_oblivion",
    "spell": {
      "name": "Volcanic Rupture",
      "description": "Passive: When you take damage equal to 15 or more in a single hit, unleash an automatic burst of dark magma dealing 2d8 ember damage to all adjacent enemies.",
      "flavorText": "Cracking the crust spills the mantle.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "hellfire",
      "spellType": "PASSIVE",
      "category": "damage",
      "targetingMode": "self",
      "damageTypes": [
        "ember"
      ],
      "primaryDamage": {
        "dice": "2d8",
        "flat": 0,
        "procChance": 100
      },
      "visualTheme": "fire",
      "tags": [
        "passive",
        "retaliation",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Volcanic Rupture rank 2: +2 Damage Reduction and +10 max HP."
      },
      {
        "description": "Volcanic Rupture rank 3: +2 Damage Reduction, +15 max HP, and immunity to prone."
      }
    ]
  },
  {
    "id": "hf_t7_capstone_gamma",
    "name": "Transcendent Precision",
    "icon": "ability_hunter_snipershot",
    "spell": {
      "name": "Transcendent Precision",
      "description": "Passive: All critical strikes deal +1d6 bonus damage and restore 1d4 Hit Points.",
      "flavorText": "Striking the exact pressure point between life and death.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "hellfire",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "fire",
      "tags": [
        "passive",
        "capstone",
        "pyrofiend"
      ]
    },
    "maxRanks": 3,
    "position": {
      "x": 4,
      "y": 6
    },
    "requires": "hf_t6_dark_oblivion",
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

