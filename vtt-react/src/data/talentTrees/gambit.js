// ============================================
// gambit (v4: Canonical 50-Point Economy & Balanced)
// ============================================

export const GAMBIT_PROBABILITY_SAVANT = [
  {
    "id": "ps_t1_calculated_nudge",
    "name": "Calculated Nudge",
    "icon": "inv_misc_scalesofjustice",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 0
    },
    "requires": null,
    "spell": {
      "name": "Calculated Nudge",
      "description": "Spend 1 Fortune Point (FP) as a reaction: Alter any d20 roll within 60 feet by +1 or -1 after seeing the roll.",
      "flavorText": "The Iceheart Sea teaches that every wave is a wager.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "probability_savant",
      "spellType": "ACTIVE",
      "category": "utility",
      "actionPoints": 0,
      "targetingMode": "single",
      "rangeType": "ranged",
      "range": 60,
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 1,
      "cooldownUnit": "round",
      "resourceCosts": {
        "fortunePoints": {
          "baseAmount": 1
        }
      },
      "visualTheme": "arcane",
      "tags": [
        "reaction",
        "dice-nudge",
        "math",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Alters roll by +2 or -2, and grants the target +1d4 psychic damage on a successful attack."
      },
      {
        "description": "Alters roll by +2 or -2, grants +1d6 psychic damage, and refunds the FP if the modified roll succeeds."
      }
    ]
  },
  {
    "id": "ps_t1_balanced_ledger",
    "name": "Balanced Ledger",
    "icon": "inv_misc_coin_01",
    "maxRanks": 3,
    "position": {
      "x": 2,
      "y": 0
    },
    "requires": null,
    "spell": {
      "name": "Balanced Ledger",
      "description": "Passive: While you hold 2 or more Fortune Points, your weapon attacks gain +1 to hit and deal +1d4 psychic damage.",
      "flavorText": "A book that always balances in the house's favor.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "probability_savant",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "damageTypes": [
        "arcane"
      ],
      "primaryDamage": {
        "dice": "1d4",
        "flat": 0,
        "procChance": 100
      },
      "visualTheme": "arcane",
      "tags": [
        "passive",
        "bonus-damage",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "While holding 2 or more FP, gain +1 to hit and deal +1d6 psychic damage."
      },
      {
        "description": "While holding 2 or more FP, gain +2 to hit and deal +1d6 psychic damage."
      }
    ]
  },
  {
    "id": "ps_t1_probability_shield",
    "name": "Probability Shield",
    "icon": "spell_holy_borrowedtime",
    "maxRanks": 2,
    "position": {
      "x": 3,
      "y": 0
    },
    "requires": null,
    "spell": {
      "name": "Probability Shield",
      "description": "Passive: When your FP drops to 0, immediately gain 8 temporary Hit Points and 1 Damage Reduction against all attacks for 1 round.",
      "flavorText": "The mathematical law of regression to the mean protects the bankrupt.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "probability_savant",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "arcane",
      "tags": [
        "passive",
        "shield",
        "safety-net",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Gain 14 temporary Hit Points and 2 Damage Reduction for 2 rounds upon reaching 0 FP."
      }
    ]
  },
  {
    "id": "ps_t2_card_counter",
    "name": "Card Counter Mark",
    "icon": "ability_rogue_findweakness",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 1
    },
    "requires": "ps_t1_calculated_nudge",
    "spell": {
      "name": "Card Counter Mark",
      "description": "Spend 1 FP: Mark an enemy within 50 feet for 3 rounds. Your attacks against them ignore partial cover and deal +1d6 psychic damage.",
      "flavorText": "Track the deck, count the discards, predict every motion.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "probability_savant",
      "spellType": "ACTIVE",
      "category": "debuff",
      "actionPoints": 1,
      "targetingMode": "single",
      "rangeType": "ranged",
      "range": 50,
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 2,
      "cooldownUnit": "rounds",
      "resourceCosts": {
        "fortunePoints": {
          "baseAmount": 1
        }
      },
      "visualTheme": "arcane",
      "tags": [
        "mark",
        "accuracy",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Bonus damage increases to +1d8 psychic, and Calculated Nudge targeting them costs 0 FP."
      },
      {
        "description": "Bonus damage increases to +1d8 psychic, and allies gain +1 to hit the marked target."
      }
    ]
  },
  {
    "id": "ps_t2_weighted_dice",
    "name": "Weighted Toss",
    "icon": "inv_misc_dice_02",
    "maxRanks": 3,
    "position": {
      "x": 3,
      "y": 1
    },
    "requires": "ps_t1_probability_shield",
    "spell": {
      "name": "Weighted Toss",
      "description": "Hurl loaded dice at an enemy within 40 feet dealing 1d8 psychic damage. If the damage roll is even, you immediately gain 1 FP and the target is Staggered for 1 round.",
      "flavorText": "The edges are shaved just enough to defy God.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "probability_savant",
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
        "arcane"
      ],
      "visualTheme": "arcane",
      "tags": [
        "dice",
        "stagger",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Deals 2d6 psychic damage. Even rolls grant 1 FP and Stagger the target for 1 round.",
        "primaryDamage": {
          "dice": "2d6",
          "flat": 0,
          "procChance": 100
        }
      },
      {
        "description": "Deals 2d8 psychic damage. Even rolls grant 1 FP and Daze the target for 1 round.",
        "primaryDamage": {
          "dice": "2d8",
          "flat": 0,
          "procChance": 100
        }
      }
    ]
  },
  {
    "id": "ps_t3_variance_crush",
    "name": "Variance Crush",
    "icon": "spell_arcane_arcane04",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 2
    },
    "requires": "ps_t2_card_counter",
    "spell": {
      "name": "Variance Crush",
      "description": "Spend 2 FP: Unleash a psychic shockwave in a 20-foot line dealing 2d8 psychic damage and pushing targets 10 feet back.",
      "flavorText": "Flattening the bell curve crushes those outside the mean.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "probability_savant",
      "spellType": "ACTIVE",
      "category": "damage",
      "actionPoints": 1,
      "targetingMode": "aoe",
      "aoeShape": "line",
      "aoeSize": 20,
      "rangeType": "ranged",
      "range": 20,
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
        "arcane"
      ],
      "resourceCosts": {
        "fortunePoints": {
          "baseAmount": 2
        }
      },
      "visualTheme": "arcane",
      "tags": [
        "aoe",
        "push",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Deals 2d8 psychic damage and knocks targets Prone on a failed Fortitude save.",
        "primaryDamage": {
          "dice": "2d8",
          "flat": 0,
          "procChance": 100
        }
      },
      {
        "description": "Deals 3d8 psychic damage, knocks targets Prone, and refunds 1 FP if it hits 2 or more enemies.",
        "primaryDamage": {
          "dice": "3d8",
          "flat": 0,
          "procChance": 100
        }
      }
    ]
  },
  {
    "id": "ps_t3_house_advantage",
    "name": "House Advantage",
    "icon": "spell_shadow_mindrot",
    "maxRanks": 3,
    "position": {
      "x": 2,
      "y": 2
    },
    "requires": null,
    "spell": {
      "name": "House Advantage",
      "description": "Passive: Whenever an enemy rolls a natural 1 on an attack or saving throw within 30 feet, they suffer 1d6 psychic damage and you gain 1 FP.",
      "flavorText": "The house never loses. It merely collects what is owed.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "probability_savant",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "damageTypes": [
        "arcane"
      ],
      "primaryDamage": {
        "dice": "1d6",
        "flat": 0,
        "procChance": 100
      },
      "visualTheme": "arcane",
      "tags": [
        "passive",
        "fumble-punish",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Natural 1s deal 1d8 psychic damage and grant you 1 FP."
      },
      {
        "description": "Natural 1s deal 2d6 psychic damage, grant you 1 FP, and inflict Disadvantage on the enemy's next attack."
      }
    ]
  },
  {
    "id": "ps_t4_deterministic_strike",
    "name": "Deterministic Strike",
    "icon": "ability_rogue_shadowstrikes",
    "maxRanks": 2,
    "position": {
      "x": 1,
      "y": 3
    },
    "requires": [
      "ps_t3_variance_crush",
      "ps_t3_house_advantage"
    ],
    "spell": {
      "name": "Deterministic Strike",
      "description": "Spend 2 FP: Deliver a calculated strike that treats your attack roll as a natural 16, dealing 2d10 psychic damage and ignoring up to 3 points of enemy Armor.",
      "flavorText": "When the math is resolved, the strike has already landed.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "probability_savant",
      "spellType": "ACTIVE",
      "category": "damage",
      "actionPoints": 1,
      "targetingMode": "single",
      "rangeType": "melee",
      "range": 5,
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
        "arcane"
      ],
      "resourceCosts": {
        "fortunePoints": {
          "baseAmount": 2
        }
      },
      "visualTheme": "arcane",
      "tags": [
        "strike",
        "armor-pierce",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Deterministic Strike gains +1d6 bonus damage and refunds 1 AP on critical hits."
      }
    ]
  },
  {
    "id": "ps_t5_entropy_anchor",
    "name": "Entropy Anchor",
    "icon": "spell_arcane_teleportmoonglade",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 4
    },
    "requires": "ps_t4_deterministic_strike",
    "spell": {
      "name": "Entropy Anchor",
      "description": "Spend 2 FP: Anchor a 20-foot zone of stabilized probability for 2 rounds. Enemies inside cannot gain Advantage and take 1d6 psychic damage upon entering.",
      "flavorText": "Probability ceases to fluctuate when the master commands it.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "probability_savant",
      "spellType": "ACTIVE",
      "category": "debuff",
      "actionPoints": 1,
      "targetingMode": "aoe",
      "aoeShape": "circle",
      "aoeSize": 20,
      "rangeType": "ranged",
      "range": 35,
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 3,
      "cooldownUnit": "rounds",
      "resourceCosts": {
        "fortunePoints": {
          "baseAmount": 2
        }
      },
      "visualTheme": "arcane",
      "tags": [
        "zone",
        "dice-cap",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Zone deals 1d8 psychic damage upon entering, and enemies suffer -1 to saving throws inside."
      },
      {
        "description": "Zone deals 2d6 psychic damage upon entering, and allies inside gain Advantage on saving throws."
      }
    ]
  },
  {
    "id": "ps_t5_statistical_ward",
    "name": "Statistical Ward",
    "icon": "spell_holy_powerwordbarrier",
    "maxRanks": 2,
    "position": {
      "x": 3,
      "y": 4
    },
    "requires": "ps_t4_deterministic_strike",
    "spell": {
      "name": "Statistical Ward",
      "description": "Passive: You and allies within 20 feet gain +1 to all saving throws and 2 Damage Reduction against area hazards.",
      "flavorText": "Geometry and statistics make the perfect bulwark.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "probability_savant",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "arcane",
      "tags": [
        "passive",
        "aura",
        "save-buff",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Allies within 20 feet gain +2 to saving throws and 3 Damage Reduction against area hazards."
      }
    ]
  },
  {
    "id": "ps_t6_law_of_large_numbers",
    "name": "Law of Large Numbers",
    "icon": "spell_arcane_starfire",
    "maxRanks": 3,
    "position": {
      "x": 1.5,
      "y": 5
    },
    "requires": [
      "ps_t5_entropy_anchor",
      "ps_t5_statistical_ward"
    ],
    "spell": {
      "name": "Law of Large Numbers",
      "description": "Spend 3 FP: Force a cosmic statistical reckoning in a 25-foot radius. Deals 3d8 psychic damage to all enemies, and heals all allies in the radius for 2d6 Hit Points.",
      "flavorText": "In the limit, all outcomes converge to the master's design.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "probability_savant",
      "spellType": "ACTIVE",
      "category": "damage",
      "actionPoints": 1,
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
        "dice": "3d8",
        "flat": 0,
        "procChance": 100
      },
      "damageTypes": [
        "arcane"
      ],
      "resourceCosts": {
        "fortunePoints": {
          "baseAmount": 3
        }
      },
      "visualTheme": "arcane",
      "tags": [
        "aoe",
        "heal-damage",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Deals 3d10 psychic damage to enemies and heals allies for 2d8 Hit Points.",
        "primaryDamage": {
          "dice": "3d10",
          "flat": 0,
          "procChance": 100
        }
      },
      {
        "description": "Deals 4d8 psychic damage, heals allies for 3d6 Hit Points, and removes 1 negative condition from each ally.",
        "primaryDamage": {
          "dice": "4d8",
          "flat": 0,
          "procChance": 100
        }
      }
    ]
  },
  {
    "id": "ps_t4_mastery_focus",
    "name": "Deterministic Strike Resonance",
    "icon": "ability_rogue_shadowstrikes",
    "maxRanks": 3,
    "position": {
      "x": 3,
      "y": 3
    },
    "requires": "ps_t3_house_advantage",
    "spell": {
      "name": "Deterministic Strike Resonance",
      "description": "Passive: Your class abilities deal +1d4 bonus damage and cost 1 less resource when below half health.",
      "flavorText": "Focus sharpens under the pressure of battle.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "probability_savant",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "arcane",
      "tags": [
        "passive",
        "efficiency",
        "gambit"
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
    "id": "ps_t6_unyielding_mastery",
    "name": "Unyielding Resolve",
    "icon": "ability_warrior_defensivestance",
    "maxRanks": 2,
    "position": {
      "x": 3.5,
      "y": 5
    },
    "requires": "ps_t5_statistical_ward",
    "spell": {
      "name": "Unyielding Resolve",
      "description": "Passive: You gain +1 Damage Reduction against all attacks and advantage on saving throws against stun and fear.",
      "flavorText": "Standing immovable against the onslaught.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "probability_savant",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "arcane",
      "tags": [
        "passive",
        "defense",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Gain +2 Damage Reduction against all attacks and immunity to fear."
      }
    ]
  },
  {
    "id": "ps_t7_grand_equation",
    "name": "The Grand Equation",
    "icon": "spell_holy_mindvision",
    "maxRanks": 1,
    "position": {
      "x": 0,
      "y": 6
    },
    "requires": "ps_t6_law_of_large_numbers",
    "spell": {
      "name": "The Grand Equation",
      "description": "ULTIMATE: Spend 3 FP: Enter a transcendent state of absolute probability for 2 rounds. All your damage rolls treat values below the die average as the average, all attacks deal +1d10 psychic damage, and natural rolls of 18–20 grant 1 FP.",
      "flavorText": "You do not roll the dice. You write the numbers upon their faces.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "probability_savant",
      "spellType": "ACTIVE",
      "category": "buff",
      "actionPoints": 1,
      "targetingMode": "self",
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 5,
      "cooldownUnit": "rounds",
      "resourceCosts": {
        "fortunePoints": {
          "baseAmount": 3
        }
      },
      "visualTheme": "arcane",
      "tags": [
        "ultimate",
        "math",
        "buff",
        "gambit"
      ]
    },
    "rankUpgrades": []
  },
  {
    "id": "ps_t7_doctrine_mastery",
    "name": "Gambit Doctrine",
    "icon": "spell_holy_blessingofstrength",
    "maxRanks": 5,
    "position": {
      "x": 1,
      "y": 6
    },
    "requires": "ps_t6_law_of_large_numbers",
    "spell": {
      "name": "Gambit Doctrine",
      "description": "Passive: All damage and healing dealt by your Gambit abilities is increased by +1 flat magnitude.",
      "flavorText": "The foundational principles of your path, mastered completely.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "probability_savant",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "arcane",
      "tags": [
        "passive",
        "capstone",
        "scaling",
        "gambit"
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
    "id": "ps_t7_flawless_calculation",
    "name": "Flawless Calculation",
    "icon": "inv_trinket_naxxramas04",
    "maxRanks": 3,
    "position": {
      "x": 2,
      "y": 6
    },
    "requires": "ps_t6_law_of_large_numbers",
    "spell": {
      "name": "Flawless Calculation",
      "description": "Passive: Whenever you or an ally within 30 feet misses an attack roll by 2 or less, you may spend 1 FP as a free reaction to turn the miss into a hit.",
      "flavorText": "Error margins can be erased with a single stroke.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "probability_savant",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "arcane",
      "tags": [
        "passive",
        "miss-fix",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Flawless Calculation rank 2: resource generation +1 and +5ft speed."
      },
      {
        "description": "Flawless Calculation rank 3: resource generation +2 and +1 to hit."
      }
    ]
  },
  {
    "id": "ps_t7_asymptotic_grace",
    "name": "Asymptotic Grace",
    "icon": "spell_holy_auraoflight",
    "maxRanks": 3,
    "position": {
      "x": 3,
      "y": 6
    },
    "requires": "ps_t6_law_of_large_numbers",
    "spell": {
      "name": "Asymptotic Grace",
      "description": "Passive: You cannot take more than 25 damage from a single attack or spell. Excess damage beyond 25 is converted into 1 FP.",
      "flavorText": "Approaching infinity, but never touching it.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "probability_savant",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "arcane",
      "tags": [
        "passive",
        "damage-cap",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Asymptotic Grace rank 2: +2 Damage Reduction and +10 max HP."
      },
      {
        "description": "Asymptotic Grace rank 3: +2 Damage Reduction, +15 max HP, and immunity to prone."
      }
    ]
  },
  {
    "id": "ps_t7_capstone_gamma",
    "name": "Transcendent Precision",
    "icon": "ability_hunter_snipershot",
    "spell": {
      "name": "Transcendent Precision",
      "description": "Passive: All critical strikes deal +1d6 bonus damage and restore 1d4 Hit Points.",
      "flavorText": "Striking the exact pressure point between life and death.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "probability_savant",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "arcane",
      "tags": [
        "passive",
        "capstone",
        "gambit"
      ]
    },
    "maxRanks": 3,
    "position": {
      "x": 4,
      "y": 6
    },
    "requires": "ps_t6_law_of_large_numbers",
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

export const GAMBIT_HIGH_ROLLER = [
  {
    "id": "hr_t1_all_in_strike",
    "name": "All-In Strike",
    "icon": "ability_warrior_bloodstorm",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 0
    },
    "requires": null,
    "spell": {
      "name": "All-In Strike",
      "description": "Spend 3 Hit Points: Strike a foe for 1d8 ember damage and generate 1 Fortune Point.",
      "flavorText": "Put your own blood on the table or leave the game.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "high_roller",
      "spellType": "ACTIVE",
      "category": "damage",
      "actionPoints": 1,
      "targetingMode": "single",
      "rangeType": "melee",
      "range": 5,
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
      "visualTheme": "ember",
      "tags": [
        "strike",
        "self-damage",
        "fp-gen",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Spend 4 HP: Deals 2d6 ember damage and generates 1 FP.",
        "primaryDamage": {
          "dice": "2d6",
          "flat": 0,
          "procChance": 100
        }
      },
      {
        "description": "Spend 4 HP: Deals 2d8 ember damage, generates 2 FP, and gains Advantage on the attack roll if below half maximum health.",
        "primaryDamage": {
          "dice": "2d8",
          "flat": 0,
          "procChance": 100
        }
      }
    ]
  },
  {
    "id": "hr_t1_loaded_dice",
    "name": "Red-Hot Dice",
    "icon": "inv_misc_dice_01",
    "maxRanks": 3,
    "position": {
      "x": 2,
      "y": 0
    },
    "requires": null,
    "spell": {
      "name": "Red-Hot Dice",
      "description": "Passive: Whenever you take self-damage from an ability, your next attack deals an extra 1d4 ember damage.",
      "flavorText": "Heat from the wager transfers straight into the strike.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "high_roller",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "damageTypes": [
        "ember"
      ],
      "primaryDamage": {
        "dice": "1d4",
        "flat": 0,
        "procChance": 100
      },
      "visualTheme": "ember",
      "tags": [
        "passive",
        "ember",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Deals +1d6 ember damage after self-damage."
      },
      {
        "description": "Deals +1d8 ember damage and grants you 3 temporary Hit Points."
      }
    ]
  },
  {
    "id": "hr_t1_reckless_grit",
    "name": "Reckless Grit",
    "icon": "ability_warrior_endurance",
    "maxRanks": 3,
    "position": {
      "x": 3,
      "y": 0
    },
    "requires": null,
    "spell": {
      "name": "Reckless Grit",
      "description": "Passive: While below half maximum health, you gain 1 Damage Reduction against all incoming damage and +1 to hit with melee attacks.",
      "flavorText": "Cornered beasts fight with double fury.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "high_roller",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "ember",
      "tags": [
        "passive",
        "low-hp",
        "dr",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Gain 2 Damage Reduction and +2 to hit while below half maximum health."
      },
      {
        "description": "Reckless Grit rank 3: magnitude and efficiency increased."
      }
    ]
  },
  {
    "id": "hr_t2_wild_gamble",
    "name": "Wild Gamble",
    "icon": "spell_fire_incinerate",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 1
    },
    "requires": "hr_t1_all_in_strike",
    "spell": {
      "name": "Wild Gamble",
      "description": "Spend 2 FP: Unleash explosive ember magic at a target within 35 feet dealing 2d6 ember damage. Roll 1d6: On a 4–6, deal an extra +1d8 ember damage; on a 1–3, suffer 3 ember backlash.",
      "flavorText": "High stakes, higher flames.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "high_roller",
      "spellType": "ACTIVE",
      "category": "damage",
      "actionPoints": 1,
      "targetingMode": "single",
      "rangeType": "ranged",
      "range": 35,
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 1,
      "cooldownUnit": "round",
      "primaryDamage": {
        "dice": "2d6",
        "flat": 0,
        "procChance": 100
      },
      "damageTypes": [
        "ember"
      ],
      "resourceCosts": {
        "fortunePoints": {
          "baseAmount": 2
        }
      },
      "visualTheme": "ember",
      "tags": [
        "gamble",
        "burst",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Deals 2d8 ember damage. 4–6 adds +2d6 ember damage; 1–3 deals 3 self-damage.",
        "primaryDamage": {
          "dice": "2d8",
          "flat": 0,
          "procChance": 100
        }
      },
      {
        "description": "Deals 3d6 ember damage. 4–6 adds +2d8 ember damage; on a 6 triples the bonus damage; on 1–2 deals 4 self-damage.",
        "primaryDamage": {
          "dice": "3d6",
          "flat": 0,
          "procChance": 100
        }
      }
    ]
  },
  {
    "id": "hr_t2_double_or_nothing",
    "name": "Double or Nothing",
    "icon": "ability_rogue_preparation",
    "maxRanks": 2,
    "position": {
      "x": 3,
      "y": 1
    },
    "requires": "hr_t1_reckless_grit",
    "spell": {
      "name": "Double or Nothing",
      "description": "Spend 1 FP: Empower your next weapon attack this round. If it hits, it adds +1d8 ember damage; if it misses, you suffer 3 ember damage.",
      "flavorText": "Double down or walk away empty handed.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "high_roller",
      "spellType": "ACTIVE",
      "category": "buff",
      "actionPoints": 0,
      "targetingMode": "self",
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 2,
      "cooldownUnit": "rounds",
      "resourceCosts": {
        "fortunePoints": {
          "baseAmount": 1
        }
      },
      "visualTheme": "ember",
      "tags": [
        "empower",
        "wager",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Adds +2d6 ember damage on hit; self-damage on miss reduced to 2."
      }
    ]
  },
  {
    "id": "hr_t3_pyroclastic_wager",
    "name": "Pyroclastic Wager",
    "icon": "spell_fire_flameshock",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 2
    },
    "requires": "hr_t2_wild_gamble",
    "spell": {
      "name": "Pyroclastic Wager",
      "description": "Spend 1 FP and 5 HP: Unleash a 20-foot cone of molten slag dealing 2d6 ember damage to all enemies and inflicting Burning (1d4 ember damage per round for 2 rounds).",
      "flavorText": "The ashes of ruined fortunes burn the hottest.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "high_roller",
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
      "isDot": true,
      "dotTick": "1d4",
      "dotDuration": 2,
      "damageTypes": [
        "ember"
      ],
      "resourceCosts": {
        "fortunePoints": {
          "baseAmount": 1
        }
      },
      "visualTheme": "ember",
      "tags": [
        "cone",
        "dot",
        "burning",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Deals 2d8 ember damage; Burning deals 1d6 per round.",
        "primaryDamage": {
          "dice": "2d8",
          "flat": 0,
          "procChance": 100
        },
        "dotTick": "1d6"
      },
      {
        "description": "Deals 3d6 ember damage; Burning deals 1d8 per round and reduces target Armor by 2.",
        "primaryDamage": {
          "dice": "3d6",
          "flat": 0,
          "procChance": 100
        },
        "dotTick": "1d8"
      }
    ]
  },
  {
    "id": "hr_t3_blood_ante",
    "name": "Blood Ante",
    "icon": "spell_shadow_lifedrain",
    "maxRanks": 3,
    "position": {
      "x": 2,
      "y": 2
    },
    "requires": null,
    "spell": {
      "name": "Blood Ante",
      "description": "Passive: Whenever you score a critical hit, restore 4 Hit Points and gain 1 FP.",
      "flavorText": "Collecting the ante right out of their ribs.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "high_roller",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "ember",
      "tags": [
        "passive",
        "crit-heal",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Critical hits restore 7 Hit Points and grant 1 FP."
      },
      {
        "description": "Critical hits restore 10 Hit Points, grant 1 FP, and your next attack deals +1d6 ember damage."
      }
    ]
  },
  {
    "id": "hr_t4_jackpot_eruption",
    "name": "Jackpot Eruption",
    "icon": "spell_fire_fireball02",
    "maxRanks": 2,
    "position": {
      "x": 1,
      "y": 3
    },
    "requires": [
      "hr_t3_pyroclastic_wager",
      "hr_t3_blood_ante"
    ],
    "spell": {
      "name": "Jackpot Eruption",
      "description": "Spend 3 FP and 6 HP: Detonate a 20-foot explosion dealing 3d8 ember damage to all enemies and knocking them Prone on a failed Reflex save. If at least 2 enemies are hit, regain 6 HP.",
      "flavorText": "Three sevens aligned in liquid fire.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "high_roller",
      "spellType": "ACTIVE",
      "category": "damage",
      "actionPoints": 1,
      "targetingMode": "aoe",
      "aoeShape": "circle",
      "aoeSize": 20,
      "rangeType": "ranged",
      "range": 35,
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 3,
      "cooldownUnit": "rounds",
      "primaryDamage": {
        "dice": "3d8",
        "flat": 0,
        "procChance": 100
      },
      "damageTypes": [
        "ember"
      ],
      "resourceCosts": {
        "fortunePoints": {
          "baseAmount": 3
        }
      },
      "visualTheme": "ember",
      "tags": [
        "nuke",
        "aoe",
        "knockdown",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Jackpot Eruption gains +1d6 bonus damage and refunds 1 AP on critical hits."
      }
    ]
  },
  {
    "id": "hr_t5_combustion_frenzy",
    "name": "Combustion Frenzy",
    "icon": "spell_fire_sealoffire",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 4
    },
    "requires": "hr_t4_jackpot_eruption",
    "spell": {
      "name": "Combustion Frenzy",
      "description": "Spend 2 FP: Enter a 2-round Frenzy. Your movement speed increases by 10 feet, and your weapon strikes deal an extra 1d6 ember damage.",
      "flavorText": "When the table is burning, keep rolling.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "high_roller",
      "spellType": "ACTIVE",
      "category": "buff",
      "actionPoints": 0,
      "targetingMode": "self",
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 3,
      "cooldownUnit": "rounds",
      "resourceCosts": {
        "fortunePoints": {
          "baseAmount": 2
        }
      },
      "visualTheme": "ember",
      "tags": [
        "buff",
        "frenzy",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Movement speed +15 ft, weapon strikes deal +1d8 ember damage."
      },
      {
        "description": "Movement speed +15 ft, weapon strikes deal +2d6 ember damage, and you gain Advantage on the first strike each round."
      }
    ]
  },
  {
    "id": "hr_t5_defiant_wager",
    "name": "Defiant Wager",
    "icon": "ability_warrior_revenge",
    "maxRanks": 2,
    "position": {
      "x": 3,
      "y": 4
    },
    "requires": "hr_t4_jackpot_eruption",
    "spell": {
      "name": "Defiant Wager",
      "description": "Passive: When you take damage equal to 12 or more in a single hit, gain 1 FP and your next attack deals +1d8 ember damage.",
      "flavorText": "Every wound is a reason to raise the bet.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "high_roller",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "damageTypes": [
        "ember"
      ],
      "primaryDamage": {
        "dice": "1d8",
        "flat": 0,
        "procChance": 100
      },
      "visualTheme": "ember",
      "tags": [
        "passive",
        "retaliation",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Gain 1 FP and your next attack deals +2d6 ember damage when hit for 12+ damage."
      }
    ]
  },
  {
    "id": "hr_t6_blazing_cataclysm",
    "name": "Blazing Cataclysm",
    "icon": "spell_fire_meteorstorm",
    "maxRanks": 3,
    "position": {
      "x": 1.5,
      "y": 5
    },
    "requires": [
      "hr_t5_combustion_frenzy",
      "hr_t5_defiant_wager"
    ],
    "spell": {
      "name": "Blazing Cataclysm",
      "description": "Spend 3 FP and 8 HP: Call down incendiary meteors on a 25-foot area dealing 3d10 ember damage to all enemies and Staggering targets that fail their saving throw.",
      "flavorText": "Bringing the house down on top of everyone.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "high_roller",
      "spellType": "ACTIVE",
      "category": "damage",
      "actionPoints": 1,
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
        "dice": "3d10",
        "flat": 0,
        "procChance": 100
      },
      "damageTypes": [
        "ember"
      ],
      "resourceCosts": {
        "fortunePoints": {
          "baseAmount": 3
        }
      },
      "visualTheme": "ember",
      "tags": [
        "aoe",
        "meteor",
        "stun",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Deals 4d8 ember damage and leaves burning ground dealing 1d6 per round.",
        "primaryDamage": {
          "dice": "4d8",
          "flat": 0,
          "procChance": 100
        }
      },
      {
        "description": "Deals 4d10 ember damage and restores 8 Hit Points if it eliminates an enemy.",
        "primaryDamage": {
          "dice": "4d10",
          "flat": 0,
          "procChance": 100
        }
      }
    ]
  },
  {
    "id": "hr_t4_mastery_focus",
    "name": "Jackpot Eruption Resonance",
    "icon": "spell_fire_fireball02",
    "maxRanks": 3,
    "position": {
      "x": 3,
      "y": 3
    },
    "requires": "hr_t3_blood_ante",
    "spell": {
      "name": "Jackpot Eruption Resonance",
      "description": "Passive: Your class abilities deal +1d4 bonus damage and cost 1 less resource when below half health.",
      "flavorText": "Focus sharpens under the pressure of battle.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "high_roller",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "ember",
      "tags": [
        "passive",
        "efficiency",
        "gambit"
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
    "id": "hr_t6_unyielding_mastery",
    "name": "Unyielding Resolve",
    "icon": "ability_warrior_defensivestance",
    "maxRanks": 2,
    "position": {
      "x": 3.5,
      "y": 5
    },
    "requires": "hr_t5_defiant_wager",
    "spell": {
      "name": "Unyielding Resolve",
      "description": "Passive: You gain +1 Damage Reduction against all attacks and advantage on saving throws against stun and fear.",
      "flavorText": "Standing immovable against the onslaught.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "high_roller",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "ember",
      "tags": [
        "passive",
        "defense",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Gain +2 Damage Reduction against all attacks and immunity to fear."
      }
    ]
  },
  {
    "id": "hr_t7_avatar_of_the_jackpot",
    "name": "Avatar of the Jackpot",
    "icon": "spell_fire_soulburn",
    "maxRanks": 1,
    "position": {
      "x": 0,
      "y": 6
    },
    "requires": "hr_t6_blazing_cataclysm",
    "spell": {
      "name": "Avatar of the Jackpot",
      "description": "ULTIMATE: Spend 3 FP: Enter the ultimate high-roller state for 2 rounds. All attacks deal an extra 1d10 ember damage, you gain 3 Damage Reduction, and every hit restores 4 Hit Points.",
      "flavorText": "The house broke, the sky shattered, and the gambler stood in the embers.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "high_roller",
      "spellType": "ACTIVE",
      "category": "buff",
      "actionPoints": 1,
      "targetingMode": "self",
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 5,
      "cooldownUnit": "rounds",
      "resourceCosts": {
        "fortunePoints": {
          "baseAmount": 3
        }
      },
      "visualTheme": "ember",
      "tags": [
        "ultimate",
        "jackpot",
        "lifesteal",
        "gambit"
      ]
    },
    "rankUpgrades": []
  },
  {
    "id": "hr_t7_doctrine_mastery",
    "name": "Gambit Doctrine",
    "icon": "spell_holy_blessingofstrength",
    "maxRanks": 5,
    "position": {
      "x": 1,
      "y": 6
    },
    "requires": "hr_t6_blazing_cataclysm",
    "spell": {
      "name": "Gambit Doctrine",
      "description": "Passive: All damage and healing dealt by your Gambit abilities is increased by +1 flat magnitude.",
      "flavorText": "The foundational principles of your path, mastered completely.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "high_roller",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "ember",
      "tags": [
        "passive",
        "capstone",
        "scaling",
        "gambit"
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
    "id": "hr_t7_undying_gamble",
    "name": "Undying Gamble",
    "icon": "spell_shadow_antimagicshell",
    "maxRanks": 3,
    "position": {
      "x": 2,
      "y": 6
    },
    "requires": "hr_t6_blazing_cataclysm",
    "spell": {
      "name": "Undying Gamble",
      "description": "Passive: When you receive lethal damage, roll 1d20: On a 12 or higher, survive with 15 Hit Points and deal 2d8 ember damage to all adjacent enemies (cooldown: 4 rounds).",
      "flavorText": "Death rolled low.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "high_roller",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "damageTypes": [
        "ember"
      ],
      "primaryDamage": {
        "dice": "2d8",
        "flat": 0,
        "procChance": 100
      },
      "visualTheme": "ember",
      "tags": [
        "passive",
        "cheat-death",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Undying Gamble rank 2: resource generation +1 and +5ft speed."
      },
      {
        "description": "Undying Gamble rank 3: resource generation +2 and +1 to hit."
      }
    ]
  },
  {
    "id": "hr_t7_hellfire_touch",
    "name": "Hellfire Touch",
    "icon": "spell_fire_flameblades",
    "maxRanks": 3,
    "position": {
      "x": 3,
      "y": 6
    },
    "requires": "hr_t6_blazing_cataclysm",
    "spell": {
      "name": "Hellfire Touch",
      "description": "Passive: Your ember and fire attacks ignore up to 3 points of enemy Fire Resistance, and your attacks score critical hits on rolls of 19–20.",
      "flavorText": "Flames hot enough to melt dragon scales.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "high_roller",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "ember",
      "tags": [
        "passive",
        "penetration",
        "crit-range",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Hellfire Touch rank 2: +2 Damage Reduction and +10 max HP."
      },
      {
        "description": "Hellfire Touch rank 3: +2 Damage Reduction, +15 max HP, and immunity to prone."
      }
    ]
  },
  {
    "id": "hr_t7_capstone_gamma",
    "name": "Transcendent Precision",
    "icon": "ability_hunter_snipershot",
    "spell": {
      "name": "Transcendent Precision",
      "description": "Passive: All critical strikes deal +1d6 bonus damage and restore 1d4 Hit Points.",
      "flavorText": "Striking the exact pressure point between life and death.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "high_roller",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "ember",
      "tags": [
        "passive",
        "capstone",
        "gambit"
      ]
    },
    "maxRanks": 3,
    "position": {
      "x": 4,
      "y": 6
    },
    "requires": "hr_t6_blazing_cataclysm",
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

export const GAMBIT_KARMIC_WEAVER = [
  {
    "id": "kw_t1_karmic_tether",
    "name": "Karmic Tether",
    "icon": "spell_shadow_shadowworddominate",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 0
    },
    "requires": null,
    "spell": {
      "name": "Karmic Tether",
      "description": "Spend 1 FP: Tether 2 enemies (or 1 ally and 1 enemy) within 45 feet for 2 rounds. Whenever the primary target takes damage, the secondary target takes 1d6 wyrd damage.",
      "flavorText": "A silver thread binds two souls to a single account.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "karmic_weaver",
      "spellType": "ACTIVE",
      "category": "debuff",
      "actionPoints": 1,
      "targetingMode": "single",
      "rangeType": "ranged",
      "range": 45,
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 2,
      "cooldownUnit": "rounds",
      "resourceCosts": {
        "fortunePoints": {
          "baseAmount": 1
        }
      },
      "visualTheme": "wyrd",
      "tags": [
        "tether",
        "shared-damage",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Tether deals 1d8 wyrd damage to the linked target and lasts 2 rounds."
      },
      {
        "description": "Tether deals 1d8 wyrd damage and reduces both targets' movement speed by 10 feet."
      }
    ]
  },
  {
    "id": "kw_t1_debt_collection",
    "name": "Debt Collection",
    "icon": "inv_misc_coin_02",
    "maxRanks": 3,
    "position": {
      "x": 2,
      "y": 0
    },
    "requires": null,
    "spell": {
      "name": "Debt Collection",
      "description": "Passive: Whenever an enemy deals damage to you or an ally within 30 feet, that enemy gains a Debt Mark. Your next attack against them consumes the mark for +1d4 wyrd damage and heals you for 2 Hit Points.",
      "flavorText": "Every blow struck is an advance on future agony.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "karmic_weaver",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "damageTypes": [
        "wyrd"
      ],
      "primaryDamage": {
        "dice": "1d4",
        "flat": 0,
        "procChance": 100
      },
      "visualTheme": "wyrd",
      "tags": [
        "passive",
        "retaliation",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Debt Mark adds +1d6 wyrd damage and heals you for 4 Hit Points."
      },
      {
        "description": "Debt Mark adds +1d8 wyrd damage, heals you for 6 Hit Points, and generates 1 FP."
      }
    ]
  },
  {
    "id": "kw_t1_fate_siphon",
    "name": "Fate Siphon",
    "icon": "spell_shadow_siphonmana",
    "maxRanks": 3,
    "position": {
      "x": 3,
      "y": 0
    },
    "requires": null,
    "spell": {
      "name": "Fate Siphon",
      "description": "Passive: When you reduce an enemy to 0 Hit Points, immediately gain 1 FP and grant 6 temporary Hit Points to the lowest-health ally within 30 feet.",
      "flavorText": "Redistributing the cosmic ledger upon foreclosure.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "karmic_weaver",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "wyrd",
      "tags": [
        "passive",
        "on-kill",
        "temp-hp",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Gain 1 FP and grant 12 temporary Hit Points to the lowest-health ally upon enemy defeat."
      },
      {
        "description": "Fate Siphon rank 3: magnitude and efficiency increased."
      }
    ]
  },
  {
    "id": "kw_t2_karmic_strike",
    "name": "Karmic Strike",
    "icon": "ability_rogue_eviscerate",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 1
    },
    "requires": "kw_t1_karmic_tether",
    "spell": {
      "name": "Karmic Strike",
      "description": "Spend 1 FP: Deliver a precision strike dealing 1d8 slicing + 1d8 wyrd damage. If the target has a Debt Mark, consume it to deal an extra +1d6 wyrd damage and Stagger the target for 1 round.",
      "flavorText": "Settling accounts in cold silver.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "karmic_weaver",
      "spellType": "ACTIVE",
      "category": "damage",
      "actionPoints": 1,
      "targetingMode": "single",
      "rangeType": "melee",
      "range": 5,
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 1,
      "cooldownUnit": "round",
      "primaryDamage": {
        "dice": "2d8",
        "flat": 0,
        "procChance": 100
      },
      "damageTypes": [
        "slicing",
        "wyrd"
      ],
      "resourceCosts": {
        "fortunePoints": {
          "baseAmount": 1
        }
      },
      "visualTheme": "wyrd",
      "tags": [
        "strike",
        "combo",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Deals 1d8 slicing + 2d6 wyrd damage; Debt Mark consumption deals +1d8 wyrd damage.",
        "primaryDamage": {
          "dice": "3d6",
          "flat": 0,
          "procChance": 100
        }
      },
      {
        "description": "Deals 1d8 slicing + 2d8 wyrd damage; Debt Mark consumption deals +2d6 wyrd damage and Dazes the target for 1 round.",
        "primaryDamage": {
          "dice": "3d8",
          "flat": 0,
          "procChance": 100
        }
      }
    ]
  },
  {
    "id": "kw_t2_redistribute_agony",
    "name": "Redistribute Agony",
    "icon": "spell_shadow_curseofachimonde",
    "maxRanks": 2,
    "position": {
      "x": 3,
      "y": 1
    },
    "requires": "kw_t1_fate_siphon",
    "spell": {
      "name": "Redistribute Agony",
      "description": "Reaction: When an ally within 30 feet takes 10 or more damage from an attack, spend 1 FP to transfer 4 of that damage to an enemy within 30 feet.",
      "flavorText": "Pain is a debt. You simply choose who pays.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "karmic_weaver",
      "spellType": "ACTIVE",
      "category": "utility",
      "actionPoints": 0,
      "targetingMode": "single",
      "rangeType": "ranged",
      "range": 30,
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 2,
      "cooldownUnit": "rounds",
      "resourceCosts": {
        "fortunePoints": {
          "baseAmount": 1
        }
      },
      "visualTheme": "wyrd",
      "tags": [
        "reaction",
        "damage-transfer",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Transfers up to 8 damage to the enemy and refunds the FP if the enemy is below half health."
      }
    ]
  },
  {
    "id": "kw_t3_thread_of_ruin",
    "name": "Thread of Ruin",
    "icon": "spell_shadow_shadowwordpain",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 2
    },
    "requires": "kw_t2_karmic_strike",
    "spell": {
      "name": "Thread of Ruin",
      "description": "Spend 2 FP: Curse an enemy within 50 feet. Deals 1d8 wyrd damage immediately and 1d6 wyrd damage at the start of each of their turns for 2 rounds.",
      "flavorText": "Unraveling the mortal thread stitch by stitch.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "karmic_weaver",
      "spellType": "ACTIVE",
      "category": "damage",
      "actionPoints": 1,
      "targetingMode": "single",
      "rangeType": "ranged",
      "range": 50,
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
      "isDot": true,
      "dotTick": "1d6",
      "dotDuration": 2,
      "damageTypes": [
        "wyrd"
      ],
      "resourceCosts": {
        "fortunePoints": {
          "baseAmount": 2
        }
      },
      "visualTheme": "wyrd",
      "tags": [
        "curse",
        "dot",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Deals 2d6 initial and 1d8 wyrd damage per round.",
        "primaryDamage": {
          "dice": "2d6",
          "flat": 0,
          "procChance": 100
        },
        "dotTick": "1d8"
      },
      {
        "description": "Deals 2d8 initial and 2d6 wyrd damage per round, and if the target dies the curse jumps to the nearest enemy.",
        "primaryDamage": {
          "dice": "2d8",
          "flat": 0,
          "procChance": 100
        },
        "dotTick": "2d6"
      }
    ]
  },
  {
    "id": "kw_t3_sympathetic_ward",
    "name": "Sympathetic Ward",
    "icon": "spell_shadow_antishadow",
    "maxRanks": 3,
    "position": {
      "x": 2,
      "y": 2
    },
    "requires": null,
    "spell": {
      "name": "Sympathetic Ward",
      "description": "Passive: You and allies within 20 feet gain +2 Wyrd and Psychic resistance. When an enemy hits an ally, that enemy suffers 1d4 wyrd backlash.",
      "flavorText": "Touch the web, feel the sting.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "karmic_weaver",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "wyrd",
      "tags": [
        "passive",
        "aura",
        "retaliation",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Grants +3 resistance, and enemy backlash increases to 1d6 wyrd damage."
      },
      {
        "description": "Grants +4 resistance, enemy backlash increases to 1d8 wyrd damage, and allies gain +1 to saves against curses."
      }
    ]
  },
  {
    "id": "kw_t4_cosmic_foreclosure",
    "name": "Cosmic Foreclosure",
    "icon": "spell_shadow_deathanddecay",
    "maxRanks": 2,
    "position": {
      "x": 1,
      "y": 3
    },
    "requires": [
      "kw_t3_thread_of_ruin",
      "kw_t3_sympathetic_ward"
    ],
    "spell": {
      "name": "Cosmic Foreclosure",
      "description": "Spend 2 FP: Call in all debts on an enemy within 40 feet. Deals 2d10 wyrd damage and heals all allies within 20 feet of the target for 1d8 Hit Points.",
      "flavorText": "The account is closed. The balance is liquidated.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "karmic_weaver",
      "spellType": "ACTIVE",
      "category": "damage",
      "actionPoints": 1,
      "targetingMode": "single",
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
        "wyrd"
      ],
      "resourceCosts": {
        "fortunePoints": {
          "baseAmount": 2
        }
      },
      "visualTheme": "wyrd",
      "tags": [
        "nuke",
        "lifesteal-aoe",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Cosmic Foreclosure gains +1d6 bonus damage and refunds 1 AP on critical hits."
      }
    ]
  },
  {
    "id": "kw_t5_tether_network",
    "name": "Tether Network",
    "icon": "spell_shadow_shadowwordpain",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 4
    },
    "requires": "kw_t4_cosmic_foreclosure",
    "spell": {
      "name": "Tether Network",
      "description": "Spend 2 FP: Tether up to 3 enemies within 30 feet for 2 rounds. When one tethered enemy takes damage, each other tethered enemy takes 1d6 wyrd damage.",
      "flavorText": "A spiderweb of shared destiny.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "karmic_weaver",
      "spellType": "ACTIVE",
      "category": "debuff",
      "actionPoints": 1,
      "targetingMode": "aoe",
      "aoeShape": "circle",
      "aoeSize": 30,
      "rangeType": "ranged",
      "range": 40,
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 3,
      "cooldownUnit": "rounds",
      "resourceCosts": {
        "fortunePoints": {
          "baseAmount": 2
        }
      },
      "visualTheme": "wyrd",
      "tags": [
        "tether",
        "aoe",
        "shared-damage",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Shared damage increases to 1d8 wyrd damage."
      },
      {
        "description": "Shared damage increases to 1d8 wyrd damage, and tethered enemies cannot Disengage."
      }
    ]
  },
  {
    "id": "kw_t5_karmic_shield",
    "name": "Karmic Shield",
    "icon": "spell_shadow_shadowform",
    "maxRanks": 2,
    "position": {
      "x": 3,
      "y": 4
    },
    "requires": "kw_t4_cosmic_foreclosure",
    "spell": {
      "name": "Karmic Shield",
      "description": "Passive: When you take damage while holding 2 or more FP, convert 3 points of that damage into temporary Hit Points for the lowest-health ally within 30 feet.",
      "flavorText": "Every wound you endure becomes an aegis for another.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "karmic_weaver",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "wyrd",
      "tags": [
        "passive",
        "ally-shield",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Converts 6 points of damage into temporary Hit Points for the ally."
      }
    ]
  },
  {
    "id": "kw_t6_wyrd_reckoning",
    "name": "Wyrd Reckoning",
    "icon": "spell_shadow_twilight",
    "maxRanks": 3,
    "position": {
      "x": 1.5,
      "y": 5
    },
    "requires": [
      "kw_t5_tether_network",
      "kw_t5_karmic_shield"
    ],
    "spell": {
      "name": "Wyrd Reckoning",
      "description": "Spend 3 FP: Release a 30-foot cone of unraveling fate. Deals 3d8 wyrd damage to all enemies and restores 2d6 Hit Points to all allies in the area.",
      "flavorText": "When the ledger snaps shut, fortunes are reversed.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "karmic_weaver",
      "spellType": "ACTIVE",
      "category": "damage",
      "actionPoints": 1,
      "targetingMode": "aoe",
      "aoeShape": "cone",
      "aoeSize": 30,
      "rangeType": "ranged",
      "range": 30,
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 3,
      "cooldownUnit": "rounds",
      "primaryDamage": {
        "dice": "3d8",
        "flat": 0,
        "procChance": 100
      },
      "damageTypes": [
        "wyrd"
      ],
      "resourceCosts": {
        "fortunePoints": {
          "baseAmount": 3
        }
      },
      "visualTheme": "wyrd",
      "tags": [
        "cone",
        "heal-damage",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Deals 3d10 wyrd damage to enemies and heals allies for 2d8 Hit Points.",
        "primaryDamage": {
          "dice": "3d10",
          "flat": 0,
          "procChance": 100
        }
      },
      {
        "description": "Deals 4d8 wyrd damage, heals allies for 3d6 Hit Points, and applies Debt Marks to all surviving enemies.",
        "primaryDamage": {
          "dice": "4d8",
          "flat": 0,
          "procChance": 100
        }
      }
    ]
  },
  {
    "id": "kw_t4_mastery_focus",
    "name": "Cosmic Foreclosure Resonance",
    "icon": "spell_shadow_deathanddecay",
    "maxRanks": 3,
    "position": {
      "x": 3,
      "y": 3
    },
    "requires": "kw_t3_sympathetic_ward",
    "spell": {
      "name": "Cosmic Foreclosure Resonance",
      "description": "Passive: Your class abilities deal +1d4 bonus damage and cost 1 less resource when below half health.",
      "flavorText": "Focus sharpens under the pressure of battle.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "karmic_weaver",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "wyrd",
      "tags": [
        "passive",
        "efficiency",
        "gambit"
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
    "id": "kw_t6_unyielding_mastery",
    "name": "Unyielding Resolve",
    "icon": "ability_warrior_defensivestance",
    "maxRanks": 2,
    "position": {
      "x": 3.5,
      "y": 5
    },
    "requires": "kw_t5_karmic_shield",
    "spell": {
      "name": "Unyielding Resolve",
      "description": "Passive: You gain +1 Damage Reduction against all attacks and advantage on saving throws against stun and fear.",
      "flavorText": "Standing immovable against the onslaught.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "karmic_weaver",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "wyrd",
      "tags": [
        "passive",
        "defense",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Gain +2 Damage Reduction against all attacks and immunity to fear."
      }
    ]
  },
  {
    "id": "kw_t7_master_of_the_ledger",
    "name": "Master of the Cosmic Ledger",
    "icon": "spell_shadow_demonicempathy",
    "maxRanks": 1,
    "position": {
      "x": 0,
      "y": 6
    },
    "requires": "kw_t6_wyrd_reckoning",
    "spell": {
      "name": "Master of the Cosmic Ledger",
      "description": "ULTIMATE: Spend 3 FP: For 2 rounds, all damage taken by you and allies within 30 feet is reduced by 3 and reflected back at the attacker as wyrd damage, and every hit generates 1 FP.",
      "flavorText": "You hold the universal balance. No pain goes unpaid.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "karmic_weaver",
      "spellType": "ACTIVE",
      "category": "buff",
      "actionPoints": 1,
      "targetingMode": "self",
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 5,
      "cooldownUnit": "rounds",
      "resourceCosts": {
        "fortunePoints": {
          "baseAmount": 3
        }
      },
      "visualTheme": "wyrd",
      "tags": [
        "ultimate",
        "retaliation",
        "buff",
        "gambit"
      ]
    },
    "rankUpgrades": []
  },
  {
    "id": "kw_t7_doctrine_mastery",
    "name": "Gambit Doctrine",
    "icon": "spell_holy_blessingofstrength",
    "maxRanks": 5,
    "position": {
      "x": 1,
      "y": 6
    },
    "requires": "kw_t6_wyrd_reckoning",
    "spell": {
      "name": "Gambit Doctrine",
      "description": "Passive: All damage and healing dealt by your Gambit abilities is increased by +1 flat magnitude.",
      "flavorText": "The foundational principles of your path, mastered completely.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "karmic_weaver",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "wyrd",
      "tags": [
        "passive",
        "capstone",
        "scaling",
        "gambit"
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
    "id": "kw_t7_debtors_curse",
    "name": "Debtor's Curse",
    "icon": "spell_shadow_curseofsargeras",
    "maxRanks": 3,
    "position": {
      "x": 2,
      "y": 6
    },
    "requires": "kw_t6_wyrd_reckoning",
    "spell": {
      "name": "Debtor's Curse",
      "description": "Passive: Enemies with Debt Marks suffer -2 to all saving throws and cannot recover Hit Points through healing spells.",
      "flavorText": "Defaulting on a debt to fate is a fatal sentence.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "karmic_weaver",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "wyrd",
      "tags": [
        "passive",
        "heal-block",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Debtor's Curse rank 2: resource generation +1 and +5ft speed."
      },
      {
        "description": "Debtor's Curse rank 3: resource generation +2 and +1 to hit."
      }
    ]
  },
  {
    "id": "kw_t7_soul_insolvency",
    "name": "Soul Insolvency",
    "icon": "spell_shadow_abominationexplosion",
    "maxRanks": 3,
    "position": {
      "x": 3,
      "y": 6
    },
    "requires": "kw_t6_wyrd_reckoning",
    "spell": {
      "name": "Soul Insolvency",
      "description": "Passive: When an enemy dies while linked by Karmic Tether or carrying a Debt Mark, they detonate for 2d8 wyrd damage to all adjacent enemies.",
      "flavorText": "Cosmic bankruptcy is violently explosive.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "karmic_weaver",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "damageTypes": [
        "wyrd"
      ],
      "primaryDamage": {
        "dice": "2d8",
        "flat": 0,
        "procChance": 100
      },
      "visualTheme": "wyrd",
      "tags": [
        "passive",
        "corpse-explosion",
        "gambit"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Soul Insolvency rank 2: +2 Damage Reduction and +10 max HP."
      },
      {
        "description": "Soul Insolvency rank 3: +2 Damage Reduction, +15 max HP, and immunity to prone."
      }
    ]
  },
  {
    "id": "kw_t7_capstone_gamma",
    "name": "Transcendent Precision",
    "icon": "ability_hunter_snipershot",
    "spell": {
      "name": "Transcendent Precision",
      "description": "Passive: All critical strikes deal +1d6 bonus damage and restore 1d4 Hit Points.",
      "flavorText": "Striking the exact pressure point between life and death.",
      "source": "talent",
      "class": "Gambit",
      "treeId": "karmic_weaver",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "wyrd",
      "tags": [
        "passive",
        "capstone",
        "gambit"
      ]
    },
    "maxRanks": 3,
    "position": {
      "x": 4,
      "y": 6
    },
    "requires": "kw_t6_wyrd_reckoning",
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

