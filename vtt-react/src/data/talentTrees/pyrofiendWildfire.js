// ============================================
// pyrofiendWildfire (v4: Canonical 50-Point Economy & Balanced)
// ============================================

export const PYROFIEND_WILDFIRE = [
  {
    "id": "wf_t1_flame_spread",
    "name": "Spark Leap",
    "icon": "spell_fire_flare",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 0
    },
    "requires": null,
    "spell": {
      "name": "Spark Leap",
      "description": "Passive: When you deal ember damage to a target, roll 1d6: On a 5–6, a leap spark deals 1d4 ember damage to an adjacent enemy within 10 feet.",
      "flavorText": "Fire gossips.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "wildfire",
      "spellType": "PASSIVE",
      "category": "damage",
      "targetingMode": "self",
      "damageTypes": [
        "ember"
      ],
      "primaryDamage": {
        "dice": "1d4",
        "flat": 0,
        "procChance": 100
      },
      "visualTheme": "fire",
      "tags": [
        "passive",
        "spread",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Roll requirement drops to 4–6 on 1d6; leap spark deals 1d4 ember damage."
      },
      {
        "description": "Roll requirement drops to 4–6 on 1d6; leap spark deals 1d6 ember damage and leaps up to 15 feet."
      }
    ]
  },
  {
    "id": "wf_t1_ground_fire",
    "name": "Living Embers",
    "icon": "spell_fire_moltenblood",
    "maxRanks": 3,
    "position": {
      "x": 2,
      "y": 0
    },
    "requires": null,
    "spell": {
      "name": "Living Embers",
      "description": "Passive: Your area ember spells leave glowing embers on the ground for 1 round. Enemies that move across them take 1d4 ember damage.",
      "flavorText": "The battlefield keeps a record of your visit.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "wildfire",
      "spellType": "PASSIVE",
      "category": "damage",
      "targetingMode": "self",
      "damageTypes": [
        "ember"
      ],
      "primaryDamage": {
        "dice": "1d4",
        "flat": 0,
        "procChance": 100
      },
      "visualTheme": "fire",
      "tags": [
        "passive",
        "terrain",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Embers deal 1d6 ember damage."
      },
      {
        "description": "Embers deal 1d6 ember damage and linger for 2 rounds."
      }
    ]
  },
  {
    "id": "wf_t1_chain_reaction",
    "name": "Kindling Death",
    "icon": "spell_fire_flamebolt",
    "maxRanks": 2,
    "position": {
      "x": 3,
      "y": 0
    },
    "requires": null,
    "spell": {
      "name": "Kindling Death",
      "description": "Passive: When a burning enemy dies, roll 1d6: On a 4–6, the nearest enemy within 15 feet ignites for 1d4 ember damage per round for 2 rounds.",
      "flavorText": "Inheritance planning, combustible edition.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "wildfire",
      "spellType": "PASSIVE",
      "category": "damage",
      "targetingMode": "self",
      "damageTypes": [
        "ember"
      ],
      "isDot": true,
      "dotDuration": 2,
      "dotTick": "1d4",
      "visualTheme": "fire",
      "tags": [
        "passive",
        "spread",
        "kill",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Ignition occurs on 3–6 on 1d6, and burns for 1d6 ember damage per round for 2 rounds."
      }
    ]
  },
  {
    "id": "wf_t2_wild_growth",
    "name": "Expanding Flame",
    "icon": "spell_fire_moltenblood",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 1
    },
    "requires": "wf_t1_flame_spread",
    "spell": {
      "name": "Expanding Flame",
      "description": "Passive: The radius of all your area ember spells increases by 5 feet.",
      "flavorText": "Pruning was never on the agenda.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "wildfire",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "fire",
      "tags": [
        "passive",
        "aoe-size",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Area radius increases by 10 feet."
      },
      {
        "description": "Area radius increases by 10 feet, and your movement speed increases by 10 feet while on fire terrain."
      }
    ]
  },
  {
    "id": "wf_t2_searing_heat",
    "name": "Layered Burn",
    "icon": "spell_fire_incinerate",
    "maxRanks": 3,
    "position": {
      "x": 3,
      "y": 1
    },
    "requires": "wf_t1_ground_fire",
    "spell": {
      "name": "Layered Burn",
      "description": "Passive: When you hit a target that is already Burning, deal +1d4 bonus ember damage.",
      "flavorText": "Layering, the Abyssal way.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "wildfire",
      "spellType": "PASSIVE",
      "category": "damage",
      "targetingMode": "self",
      "damageTypes": [
        "ember"
      ],
      "primaryDamage": {
        "dice": "1d4",
        "flat": 0,
        "procChance": 100
      },
      "visualTheme": "fire",
      "tags": [
        "passive",
        "burning",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Bonus damage increases to +1d6 ember damage."
      },
      {
        "description": "Bonus damage increases to +1d8 ember damage."
      }
    ]
  },
  {
    "id": "wf_t3_conflagration",
    "name": "Conflagration",
    "icon": "spell_fire_sealoffire",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 2
    },
    "requires": "wf_t2_wild_growth",
    "spell": {
      "name": "Conflagration",
      "description": "Spend 1 AP: Detonate all active Burning effects on enemies within 50 feet. Deals 2d6 ember damage immediately to each target and spreads 1d4 burning damage to adjacent foes.",
      "flavorText": "One breath. Claimed.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "wildfire",
      "spellType": "ACTIVE",
      "category": "damage",
      "actionPoints": 1,
      "targetingMode": "aoe",
      "rangeType": "ranged",
      "range": 50,
      "aoeShape": "circle",
      "aoeSize": 20,
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
        "ember"
      ],
      "visualTheme": "fire",
      "tags": [
        "aoe",
        "detonate",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Deals 2d8 ember damage immediately and spreads 1d6 burning damage.",
        "primaryDamage": {
          "dice": "2d8",
          "flat": 0,
          "procChance": 100
        }
      },
      {
        "description": "Deals 3d6 ember damage immediately and leaves behind a 15-foot zone of ember terrain for 2 rounds.",
        "primaryDamage": {
          "dice": "3d6",
          "flat": 0,
          "procChance": 100
        }
      }
    ]
  },
  {
    "id": "wf_t3_pandemic",
    "name": "Wild Gale",
    "icon": "spell_fire_windfury",
    "maxRanks": 3,
    "position": {
      "x": 3,
      "y": 2
    },
    "requires": "wf_t2_searing_heat",
    "spell": {
      "name": "Wild Gale",
      "description": "Spend 1 AP: Hurl a cyclone of searing wind in a 25-foot cone. Deals 2d6 ember damage and pushes Burning enemies 10 feet backward.",
      "flavorText": "Winds that fan the blaze into frenzy.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "wildfire",
      "spellType": "ACTIVE",
      "category": "damage",
      "actionPoints": 1,
      "targetingMode": "aoe",
      "aoeShape": "cone",
      "aoeSize": 25,
      "rangeType": "ranged",
      "range": 25,
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
        "ember"
      ],
      "visualTheme": "fire",
      "tags": [
        "cone",
        "wind",
        "push",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Deals 2d8 ember damage and spreads Burning to all targets hit in the cone.",
        "primaryDamage": {
          "dice": "2d8",
          "flat": 0,
          "procChance": 100
        }
      },
      {
        "description": "Deals 3d6 ember damage, knocks targets Prone, and grants you +15 feet movement speed for 1 round.",
        "primaryDamage": {
          "dice": "3d6",
          "flat": 0,
          "procChance": 100
        }
      }
    ]
  },
  {
    "id": "wf_t4_chain_ignition",
    "name": "Chain Ignition",
    "icon": "spell_fire_flamebolt",
    "maxRanks": 2,
    "position": {
      "x": 1,
      "y": 3
    },
    "requires": [
      "wf_t3_conflagration",
      "wf_t3_pandemic"
    ],
    "spell": {
      "name": "Chain Ignition",
      "description": "Spend 1 AP: Fire a leaping bolt of wildfire that arcs across up to 3 enemies within 30 feet of each other, dealing 2d8 ember damage to each and applying Burning (1d6/rd for 2 rounds).",
      "flavorText": "A single thread of lightning-hot fire tying them all together.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "wildfire",
      "spellType": "ACTIVE",
      "category": "damage",
      "actionPoints": 1,
      "targetingMode": "chain",
      "rangeType": "ranged",
      "range": 45,
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
        "chain",
        "arc",
        "dot",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Chain Ignition gains +1d6 bonus damage and refunds 1 AP on critical hits."
      }
    ]
  },
  {
    "id": "wf_t5_scorched_earth",
    "name": "Scorched Earth",
    "icon": "spell_fire_selfdestruct",
    "maxRanks": 3,
    "position": {
      "x": 1,
      "y": 4
    },
    "requires": "wf_t4_chain_ignition",
    "spell": {
      "name": "Scorched Earth",
      "description": "Passive: Whenever an enemy takes damage from ember terrain or burning ground, they take +1d4 additional ember damage and their movement speed is reduced by 5 feet.",
      "flavorText": "The ground itself remembers how to hate.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "wildfire",
      "spellType": "PASSIVE",
      "category": "damage",
      "targetingMode": "self",
      "damageTypes": [
        "ember"
      ],
      "primaryDamage": {
        "dice": "1d4",
        "flat": 0,
        "procChance": 100
      },
      "visualTheme": "fire",
      "tags": [
        "passive",
        "slow",
        "terrain",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Additional damage increases to +1d6 ember, and movement slow increases to 10 feet."
      },
      {
        "description": "Additional damage increases to +1d8 ember, slow increases to 10 feet, and enemy Armor is reduced by 2."
      }
    ]
  },
  {
    "id": "wf_t5_combustion_stride",
    "name": "Combustion Stride",
    "icon": "spell_fire_burnout",
    "maxRanks": 2,
    "position": {
      "x": 3,
      "y": 4
    },
    "requires": "wf_t4_chain_ignition",
    "spell": {
      "name": "Combustion Stride",
      "description": "Passive: You can move freely through occupied enemy spaces and fire terrain without penalty. When you pass through an enemy, deal 1d6 ember damage (once per turn per enemy).",
      "flavorText": "You are the spark between the kindling.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "wildfire",
      "spellType": "PASSIVE",
      "category": "utility",
      "targetingMode": "self",
      "damageTypes": [
        "ember"
      ],
      "primaryDamage": {
        "dice": "1d6",
        "flat": 0,
        "procChance": 100
      },
      "visualTheme": "fire",
      "tags": [
        "passive",
        "mobility",
        "pass-through",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Passing through enemies deals 2d6 ember damage and ignites them with Burning (1d4/rd for 2 rounds)."
      }
    ]
  },
  {
    "id": "wf_t6_tempest_of_fire",
    "name": "Wildfire Tempest",
    "icon": "spell_fire_meteorstorm",
    "maxRanks": 3,
    "position": {
      "x": 1.5,
      "y": 5
    },
    "requires": [
      "wf_t5_scorched_earth",
      "wf_t5_combustion_stride"
    ],
    "spell": {
      "name": "Wildfire Tempest",
      "description": "Spend 2 AP: Summon an advancing firestorm in a 30-foot cone dealing 3d8 ember damage and leaving burning ash terrain across the entire cone for 2 rounds.",
      "flavorText": "A rolling wave of heat that swallows the horizon.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "wildfire",
      "spellType": "ACTIVE",
      "category": "damage",
      "actionPoints": 2,
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
        "ember"
      ],
      "visualTheme": "fire",
      "tags": [
        "aoe",
        "cone",
        "tempest",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Deals 3d10 ember damage, and enemies in the ash cannot take Reactions.",
        "primaryDamage": {
          "dice": "3d10",
          "flat": 0,
          "procChance": 100
        }
      },
      {
        "description": "Deals 4d8 ember damage, and each enemy killed by the storm detonates a fresh 10-foot spark burst.",
        "primaryDamage": {
          "dice": "4d8",
          "flat": 0,
          "procChance": 100
        }
      }
    ]
  },
  {
    "id": "wf_t4_mastery_focus",
    "name": "Chain Ignition Resonance",
    "icon": "spell_fire_flamebolt",
    "maxRanks": 3,
    "position": {
      "x": 3,
      "y": 3
    },
    "requires": "wf_t3_pandemic",
    "spell": {
      "name": "Chain Ignition Resonance",
      "description": "Passive: Your class abilities deal +1d4 bonus damage and cost 1 less resource when below half health.",
      "flavorText": "Focus sharpens under the pressure of battle.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "wildfire",
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
    "id": "wf_t6_unyielding_mastery",
    "name": "Unyielding Resolve",
    "icon": "ability_warrior_defensivestance",
    "maxRanks": 2,
    "position": {
      "x": 3.5,
      "y": 5
    },
    "requires": "wf_t5_combustion_stride",
    "spell": {
      "name": "Unyielding Resolve",
      "description": "Passive: You gain +1 Damage Reduction against all attacks and advantage on saving throws against stun and fear.",
      "flavorText": "Standing immovable against the onslaught.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "wildfire",
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
    "id": "wf_t7_world_in_flames",
    "name": "World in Flames",
    "icon": "spell_fire_soulburn",
    "maxRanks": 1,
    "position": {
      "x": 0,
      "y": 6
    },
    "requires": "wf_t6_tempest_of_fire",
    "spell": {
      "name": "World in Flames",
      "description": "ULTIMATE: Spend 2 AP: For 2 rounds, every ember spell you cast automatically triggers Spark Leap at full damage to 2 nearby targets, and you leave a trail of burning ground wherever you walk.",
      "flavorText": "You do not fight the fire. You become the blaze that consumes nations.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "wildfire",
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
        "wildfire",
        "pyrofiend"
      ]
    },
    "rankUpgrades": []
  },
  {
    "id": "wf_t7_doctrine_mastery",
    "name": "Pyrofiend Doctrine",
    "icon": "spell_holy_blessingofstrength",
    "maxRanks": 5,
    "position": {
      "x": 1,
      "y": 6
    },
    "requires": "wf_t6_tempest_of_fire",
    "spell": {
      "name": "Pyrofiend Doctrine",
      "description": "Passive: All damage and healing dealt by your Pyrofiend abilities is increased by +1 flat magnitude.",
      "flavorText": "The foundational principles of your path, mastered completely.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "wildfire",
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
    "id": "wf_t7_eternal_conflagration",
    "name": "Eternal Spark",
    "icon": "spell_fire_flameblades",
    "maxRanks": 3,
    "position": {
      "x": 2,
      "y": 6
    },
    "requires": "wf_t6_tempest_of_fire",
    "spell": {
      "name": "Eternal Spark",
      "description": "Passive: Your Burning effects can never be extinguished by non-magical means and deal their damage twice as fast (at start and end of turn).",
      "flavorText": "Some flames defy water, earth, and prayer.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "wildfire",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "fire",
      "tags": [
        "passive",
        "dot-speed",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Eternal Spark rank 2: resource generation +1 and +5ft speed."
      },
      {
        "description": "Eternal Spark rank 3: resource generation +2 and +1 to hit."
      }
    ]
  },
  {
    "id": "wf_t7_ash_rebirth",
    "name": "Ash Rebirth",
    "icon": "spell_fire_sealoffire",
    "maxRanks": 3,
    "position": {
      "x": 3,
      "y": 6
    },
    "requires": "wf_t6_tempest_of_fire",
    "spell": {
      "name": "Ash Rebirth",
      "description": "Passive: When you are reduced to 0 Hit Points, if there is active fire terrain within 20 feet, instantly consume it to restore 15 HP and teleport to its center (cooldown: 4 rounds).",
      "flavorText": "From the embers, the fiend draws fresh breath.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "wildfire",
      "spellType": "PASSIVE",
      "category": "buff",
      "targetingMode": "self",
      "visualTheme": "fire",
      "tags": [
        "passive",
        "cheat-death",
        "pyrofiend"
      ]
    },
    "rankUpgrades": [
      {
        "description": "Ash Rebirth rank 2: +2 Damage Reduction and +10 max HP."
      },
      {
        "description": "Ash Rebirth rank 3: +2 Damage Reduction, +15 max HP, and immunity to prone."
      }
    ]
  },
  {
    "id": "wf_t7_capstone_gamma",
    "name": "Transcendent Precision",
    "icon": "ability_hunter_snipershot",
    "spell": {
      "name": "Transcendent Precision",
      "description": "Passive: All critical strikes deal +1d6 bonus damage and restore 1d4 Hit Points.",
      "flavorText": "Striking the exact pressure point between life and death.",
      "source": "talent",
      "class": "Pyrofiend",
      "treeId": "wildfire",
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
    "requires": "wf_t6_tempest_of_fire",
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

