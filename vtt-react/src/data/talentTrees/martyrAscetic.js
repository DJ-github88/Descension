// ============================================
// martyrAscetic (v4: Canonical 50-Point Economy & Balanced)
// ============================================

export const MARTYR_ASCETIC = [
  {
    "id": "asc_t1_sol_aegis",
    "name": "Sol Aegis",
    "icon": "spell_holy_divineshield",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 0
    },
    "requires": null,
    "spell": {
      "name": "Sol Aegis",
      "description": "Spend 1 AP and 1 Devotion: Form a radiant barrier around yourself absorbing up to 6 damage for 2 rounds.",
      "flavorText": "The wall has a saint's name on it.",
      "source": "talent",
      "class": "Martyr",
      "treeId": "ascetic",
      "spellType": "ACTIVE",
      "category": "buff",
      "actionPoints": 1,
      "targetingMode": "self",
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 1,
      "cooldownUnit": "round",
      "resourceCosts": {
        "devotion": {
          "baseAmount": 1
        }
      },
      "visualTheme": "sacred",
      "tags": [
        "shield",
        "self",
        "martyr"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Shield absorbs up to 10 damage."
      },
      {
        "description": "Shield absorbs up to 14 damage, and when it breaks, it flares dealing 1d6 sacred damage to adjacent enemies.",
        "primaryDamage": {
          "dice": "1d6",
          "flat": 0,
          "procChance": 100
        },
        "damageTypes": [
          "sacred"
        ]
      }
    ]
  },
  {
    "id": "asc_t1_protective_aura",
    "name": "Aegis Aura",
    "icon": "spell_holy_auraoflight",
    "maxRanks": 3,
    "position": {
      "x": 2,
      "y": 0
    },
    "requires": null,
    "spell": {
      "name": "Aegis Aura",
      "description": "Passive: You and allies within 15 feet gain +1 Armor against weapon attacks.",
      "flavorText": "Shade from a stricter sun.",
      "source": "talent",
      "class": "Martyr",
      "treeId": "ascetic",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "sacred",
      "tags": [
        "passive",
        "aura",
        "armor",
        "martyr"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Aura increases to +2 Armor for you and allies within 15 feet."
      },
      {
        "description": "Aura grants +2 Armor and +2 Sacred and Blight resistance."
      }
    ]
  },
  {
    "id": "asc_t1_shield_wall",
    "name": "Burden Bearer",
    "icon": "ability_warrior_shieldwall",
    "maxRanks": 2,
    "position": {
      "x": 3,
      "y": 0
    },
    "requires": null,
    "spell": {
      "name": "Burden Bearer",
      "description": "Passive: Your maximum health increases by 8 Hit Points and you gain +1 Damage Reduction against physical attacks.",
      "flavorText": "The spine of the faithful is reinforced by vow.",
      "source": "talent",
      "class": "Martyr",
      "treeId": "ascetic",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "sacred",
      "tags": [
        "passive",
        "hp",
        "dr",
        "martyr"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Maximum health increases by 16 Hit Points, and you gain +2 Damage Reduction."
      }
    ]
  },
  {
    "id": "asc_t2_redirection",
    "name": "Damage Intercept",
    "icon": "spell_holy_sealofsacrifice",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 1
    },
    "requires": "asc_t1_sol_aegis",
    "spell": {
      "name": "Damage Intercept",
      "description": "Reaction: When an ally within 30 feet takes damage, spend 1 Devotion to transfer 4 of that damage to yourself instead.",
      "flavorText": "Place your own shoulder under their cross.",
      "source": "talent",
      "class": "Martyr",
      "treeId": "ascetic",
      "spellType": "ACTIVE",
      "category": "utility",
      "actionPoints": 0,
      "targetingMode": "single",
      "rangeType": "ranged",
      "range": 30,
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 1,
      "cooldownUnit": "round",
      "resourceCosts": {
        "devotion": {
          "baseAmount": 1
        }
      },
      "visualTheme": "sacred",
      "tags": [
        "reaction",
        "intercept",
        "martyr"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Transfers up to 7 damage, and you gain +1 Damage Reduction against the intercepted blow."
      },
      {
        "description": "Transfers up to 10 damage, you gain +2 Damage Reduction against it, and generate 1 Devotion."
      }
    ]
  },
  {
    "id": "asc_t2_bastion_stance",
    "name": "Bastion Stance",
    "icon": "ability_warrior_defensivestance",
    "maxRanks": 3,
    "position": {
      "x": 3,
      "y": 1
    },
    "requires": "asc_t1_shield_wall",
    "spell": {
      "name": "Bastion Stance",
      "description": "Spend 1 AP: Brace in a defensive fortress stance for 2 rounds. Gain +2 Armor and +1 Damage Reduction; enemies cannot move through your zone of control.",
      "flavorText": "Not one step backward.",
      "source": "talent",
      "class": "Martyr",
      "treeId": "ascetic",
      "spellType": "ACTIVE",
      "category": "buff",
      "actionPoints": 1,
      "targetingMode": "self",
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 2,
      "cooldownUnit": "rounds",
      "visualTheme": "sacred",
      "tags": [
        "stance",
        "defense",
        "martyr"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Gain +3 Armor and +2 Damage Reduction while in Bastion Stance."
      },
      {
        "description": "Gain +4 Armor, +2 Damage Reduction, and melee strikes against you suffer Disadvantage."
      }
    ]
  },
  {
    "id": "asc_t3_sanctuary_dome",
    "name": "Sanctuary Dome",
    "icon": "spell_holy_powerwordbarrier",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 2
    },
    "requires": "asc_t2_redirection",
    "spell": {
      "name": "Sanctuary Dome",
      "description": "Spend 1 AP and 2 Devotion: Erect a 15-foot glowing sanctuary dome centered on you for 2 rounds. Allies inside gain +2 Defense against ranged attacks and recover 1d4 Hit Points at the start of each turn.",
      "flavorText": "A dome of glass and prayer.",
      "source": "talent",
      "class": "Martyr",
      "treeId": "ascetic",
      "spellType": "ACTIVE",
      "category": "buff",
      "actionPoints": 1,
      "targetingMode": "aoe",
      "aoeShape": "circle",
      "aoeSize": 15,
      "rangeType": "self",
      "range": 0,
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 3,
      "cooldownUnit": "rounds",
      "resourceCosts": {
        "devotion": {
          "baseAmount": 2
        }
      },
      "visualTheme": "sacred",
      "tags": [
        "barrier",
        "zone",
        "heal",
        "martyr"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Allies inside recover 1d6 Hit Points per turn and gain +3 Defense against ranged attacks."
      },
      {
        "description": "Allies inside recover 1d8 Hit Points per turn and are completely immune to enemy displacement effects."
      }
    ]
  },
  {
    "id": "asc_t3_ascetic_reprisal",
    "name": "Ascetic's Reprisal",
    "icon": "spell_holy_blessingofprotection",
    "maxRanks": 3,
    "position": {
      "x": 3,
      "y": 2
    },
    "requires": "asc_t2_bastion_stance",
    "spell": {
      "name": "Ascetic's Reprisal",
      "description": "Passive: Whenever an enemy damages you in melee, you immediately generate 1 Devotion and the attacker takes 1d4 sacred backlash.",
      "flavorText": "To strike the stone is to dull the chisel.",
      "source": "talent",
      "class": "Martyr",
      "treeId": "ascetic",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "damageTypes": [
        "sacred"
      ],
      "primaryDamage": {
        "dice": "1d4",
        "flat": 0,
        "procChance": 100
      },
      "visualTheme": "sacred",
      "tags": [
        "passive",
        "retaliation",
        "devotion",
        "martyr"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Backlash deals 1d6 sacred damage."
      },
      {
        "description": "Backlash deals 1d8 sacred damage and reduces attacker's next attack roll by 2."
      }
    ]
  },
  {
    "id": "asc_t4_wall_of_martyrs",
    "name": "Radiant Bastion Wall",
    "icon": "spell_holy_powerwordbarrier",
    "maxRanks": 2,
    "position": {
      "x": 1,
      "y": 3
    },
    "requires": [
      "asc_t3_sanctuary_dome",
      "asc_t3_ascetic_reprisal"
    ],
    "spell": {
      "name": "Radiant Bastion Wall",
      "description": "Spend 1 AP and 2 Devotion: Summon a 20-foot wide radiant wall within 30 feet for 2 rounds. The wall blocks all enemy projectiles, halts hostile movement, and grants allies full cover.",
      "flavorText": "Shields of fallen martyrs standing line in the ether.",
      "source": "talent",
      "class": "Martyr",
      "treeId": "ascetic",
      "spellType": "ACTIVE",
      "category": "utility",
      "actionPoints": 1,
      "targetingMode": "aoe",
      "aoeShape": "line",
      "aoeSize": 20,
      "rangeType": "ranged",
      "range": 30,
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 3,
      "cooldownUnit": "rounds",
      "resourceCosts": {
        "devotion": {
          "baseAmount": 2
        }
      },
      "visualTheme": "sacred",
      "tags": [
        "wall",
        "cover",
        "martyr"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Radiant Bastion Wall gains +1d6 bonus damage and refunds 1 AP on critical hits."
      }
    ]
  },
  {
    "id": "asc_t5_iron_penance",
    "name": "Iron Penance",
    "icon": "spell_holy_sealofwrath",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 4
    },
    "requires": "asc_t4_wall_of_martyrs",
    "spell": {
      "name": "Iron Penance",
      "description": "Passive: While below half maximum health, you gain +2 Damage Reduction against all incoming damage and are immune to Critical Hits.",
      "flavorText": "The flesh has suffered worse. It will not break today.",
      "source": "talent",
      "class": "Martyr",
      "treeId": "ascetic",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "sacred",
      "tags": [
        "passive",
        "dr",
        "crit-immune",
        "martyr"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Gain +3 Damage Reduction while below half health."
      },
      {
        "description": "Gain +4 Damage Reduction and +2 to all saving throws while below half health."
      }
    ]
  },
  {
    "id": "asc_t5_sympathetic_aegis",
    "name": "Sympathetic Shielding",
    "icon": "spell_holy_greaterblessingofsanctuary",
    "maxRanks": 2,
    "position": {
      "x": 3,
      "y": 4
    },
    "requires": "asc_t4_wall_of_martyrs",
    "spell": {
      "name": "Sympathetic Shielding",
      "description": "Passive: Whenever you gain a shield or temporary Hit Points, grant 3 temporary Hit Points to the lowest-health ally within 30 feet.",
      "flavorText": "The overflow of protection coats your companions.",
      "source": "talent",
      "class": "Martyr",
      "treeId": "ascetic",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "sacred",
      "tags": [
        "passive",
        "ally-shield",
        "martyr"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Grants 6 temporary Hit Points to the ally."
      }
    ]
  },
  {
    "id": "asc_t6_divine_bastion",
    "name": "Divine Bulwark",
    "icon": "spell_holy_mindvision",
    "maxRanks": 3,
    "position": {
      "x": 1.5,
      "y": 5
    },
    "requires": [
      "asc_t5_iron_penance",
      "asc_t5_sympathetic_aegis"
    ],
    "spell": {
      "name": "Divine Bulwark",
      "description": "Spend 2 AP and 3 Devotion: Wrap all allies within 30 feet in an impervious golden shield absorbing up to 10 damage for 2 rounds and granting +2 Armor.",
      "flavorText": "A fortress of light descended upon the fellowship.",
      "source": "talent",
      "class": "Martyr",
      "treeId": "ascetic",
      "spellType": "ACTIVE",
      "category": "buff",
      "actionPoints": 2,
      "targetingMode": "aoe",
      "aoeShape": "circle",
      "aoeSize": 30,
      "rangeType": "ranged",
      "range": 30,
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 3,
      "cooldownUnit": "rounds",
      "resourceCosts": {
        "devotion": {
          "baseAmount": 3
        }
      },
      "visualTheme": "sacred",
      "tags": [
        "aoe",
        "shield",
        "armor",
        "martyr"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Shield absorbs up to 15 damage and grants +3 Armor."
      },
      {
        "description": "Shield absorbs up to 20 damage, grants +3 Armor, and reflects 1d6 sacred damage when struck in melee.",
        "primaryDamage": {
          "dice": "1d6",
          "flat": 0,
          "procChance": 100
        },
        "damageTypes": [
          "sacred"
        ]
      }
    ]
  },
  {
    "id": "asc_t4_mastery_focus",
    "name": "Radiant Bastion Wall Resonance",
    "icon": "spell_holy_powerwordbarrier",
    "maxRanks": 3,
    "position": {
      "x": 3,
      "y": 3
    },
    "requires": "asc_t3_ascetic_reprisal",
    "spell": {
      "name": "Radiant Bastion Wall Resonance",
      "description": "Passive: Your class abilities deal +1d4 bonus damage and cost 1 less resource when below half health.",
      "flavorText": "Focus sharpens under the pressure of battle.",
      "source": "talent",
      "class": "Martyr",
      "treeId": "ascetic",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "sacred",
      "tags": [
        "passive",
        "efficiency",
        "martyr"
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
    "id": "asc_t6_unyielding_mastery",
    "name": "Unyielding Resolve",
    "icon": "ability_warrior_defensivestance",
    "maxRanks": 2,
    "position": {
      "x": 3.5,
      "y": 5
    },
    "requires": "asc_t5_sympathetic_aegis",
    "spell": {
      "name": "Unyielding Resolve",
      "description": "Passive: You gain +1 Damage Reduction against all attacks and advantage on saving throws against stun and fear.",
      "flavorText": "Standing immovable against the onslaught.",
      "source": "talent",
      "class": "Martyr",
      "treeId": "ascetic",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "sacred",
      "tags": [
        "passive",
        "defense",
        "martyr"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Gain +2 Damage Reduction against all attacks and immunity to fear."
      }
    ]
  },
  {
    "id": "asc_t7_living_bulwark",
    "name": "Living Bulwark of Sol",
    "icon": "spell_holy_divineshield",
    "maxRanks": 1,
    "position": {
      "x": 0,
      "y": 6
    },
    "requires": "asc_t6_divine_bastion",
    "spell": {
      "name": "Living Bulwark of Sol",
      "description": "ULTIMATE: Spend 2 AP and 3 Devotion: For 2 rounds, you absorb 50% of all damage taken by all allies within 40 feet, your Damage Reduction is increased by +4, and whenever you absorb damage you heal for 2 Hit Points.",
      "flavorText": "You are the mountain on which the storm breaks. All shelter behind you.",
      "source": "talent",
      "class": "Martyr",
      "treeId": "ascetic",
      "spellType": "ACTIVE",
      "category": "buff",
      "actionPoints": 2,
      "targetingMode": "self",
      "castTimeType": "instant",
      "castTimeValue": 0,
      "cooldownCategory": "turn_based",
      "cooldownValue": 5,
      "cooldownUnit": "rounds",
      "resourceCosts": {
        "devotion": {
          "baseAmount": 3
        }
      },
      "visualTheme": "sacred",
      "tags": [
        "ultimate",
        "tank",
        "intercept",
        "martyr"
      ]
    },
    "rankUpgrades": []
  },
  {
    "id": "asc_t7_doctrine_mastery",
    "name": "Martyr Doctrine",
    "icon": "spell_holy_blessingofstrength",
    "maxRanks": 5,
    "position": {
      "x": 1,
      "y": 6
    },
    "requires": "asc_t6_divine_bastion",
    "spell": {
      "name": "Martyr Doctrine",
      "description": "Passive: All damage and healing dealt by your Martyr abilities is increased by +1 flat magnitude.",
      "flavorText": "The foundational principles of your path, mastered completely.",
      "source": "talent",
      "class": "Martyr",
      "treeId": "ascetic",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "sacred",
      "tags": [
        "passive",
        "capstone",
        "scaling",
        "martyr"
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
    "id": "asc_t7_unshakable_faith",
    "name": "Unshakable Faith",
    "icon": "spell_holy_unyieldingfaith",
    "maxRanks": 3,
    "position": {
      "x": 2,
      "y": 6
    },
    "requires": "asc_t6_divine_bastion",
    "spell": {
      "name": "Unshakable Faith",
      "description": "Passive: You cannot be Paralyzed, Stunned, or moved against your will, and you gain +2 to all saving throws.",
      "flavorText": "Rooted in absolute devotion. The earth moves before you do.",
      "source": "talent",
      "class": "Martyr",
      "treeId": "ascetic",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "sacred",
      "tags": [
        "passive",
        "immunity",
        "saves",
        "martyr"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Unshakable Faith rank 2: resource generation +1 and +5ft speed."
      },
      {
        "description": "Unshakable Faith rank 3: resource generation +2 and +1 to hit."
      }
    ]
  },
  {
    "id": "asc_t7_sol_retribution",
    "name": "Solar Resurgence",
    "icon": "spell_holy_holybolt",
    "maxRanks": 3,
    "position": {
      "x": 3,
      "y": 6
    },
    "requires": "asc_t6_divine_bastion",
    "spell": {
      "name": "Solar Resurgence",
      "description": "Passive: When you take lethal damage, survive with 15 Hit Points and unleash a 20-foot flash of solar light that blinds all enemies for 1 round (cooldown: 4 rounds).",
      "flavorText": "When the light falters, it detonates with blinding fury.",
      "source": "talent",
      "class": "Martyr",
      "treeId": "ascetic",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "sacred",
      "tags": [
        "passive",
        "cheat-death",
        "martyr"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Solar Resurgence rank 2: +2 Damage Reduction and +10 max HP."
      },
      {
        "description": "Solar Resurgence rank 3: +2 Damage Reduction, +15 max HP, and immunity to prone."
      }
    ]
  },
  {
    "id": "asc_t7_capstone_gamma",
    "name": "Transcendent Precision",
    "icon": "ability_hunter_snipershot",
    "spell": {
      "name": "Transcendent Precision",
      "description": "Passive: All critical strikes deal +1d6 bonus damage and restore 1d4 Hit Points.",
      "flavorText": "Striking the exact pressure point between life and death.",
      "source": "talent",
      "class": "Martyr",
      "treeId": "ascetic",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "sacred",
      "tags": [
        "passive",
        "capstone",
        "martyr"
      ]
    },
    "maxRanks": 3,
    "position": {
      "x": 4,
      "y": 6
    },
    "requires": "asc_t6_divine_bastion",
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

