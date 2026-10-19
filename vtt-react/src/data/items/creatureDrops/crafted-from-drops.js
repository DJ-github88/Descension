/**
 * Items crafted from creature drops (see data/recipes/creatureCrafting.js).
 */

export const CRAFTED_FROM_DROPS = [
  {
    "id": "draught-of-recall",
    "name": "Draught of Recall",
    "type": "consumable",
    "subtype": "ELIXIR",
    "quality": "uncommon",
    "description": "Memory-silt steeped in clean water. For a short while, you remember everything - even the things you were happy to forget.",
    "iconId": "Misc/Profession Resources/Alchemy/Blue/teal-potion-teardrop-spiral",
    "value": {
      "gold": 0,
      "silver": 3,
      "copper": 20
    },
    "stackable": true,
    "maxStackSize": 10,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "baseStats": {
      "intelligence": {
        "value": 2,
        "isPercentage": false,
        "duration": 600
      }
    },
    "utilityStats": {
      "duration": {
        "type": "MINUTES",
        "value": 10
      }
    }
  },
  {
    "id": "glacier-frostward-tonic",
    "name": "Glacier Frostward Tonic",
    "type": "consumable",
    "subtype": "ELIXIR",
    "quality": "uncommon",
    "description": "A numbing blue tonic cut with glacier-ice. Rime bites less for a time.",
    "iconId": "Misc/Profession Resources/Alchemy/Blue/teal-potion-lightning-bolt-bottle",
    "value": {
      "gold": 0,
      "silver": 3,
      "copper": 60
    },
    "stackable": true,
    "maxStackSize": 10,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "combatStats": {
      "resistances": {
        "rime": {
          "value": 12,
          "isPercentage": false,
          "duration": 600
        }
      }
    },
    "utilityStats": {
      "duration": {
        "type": "MINUTES",
        "value": 10
      }
    }
  },
  {
    "id": "steppe-antivenom",
    "name": "Steppe Antivenom",
    "type": "consumable",
    "subtype": "POTION",
    "quality": "uncommon",
    "description": "A bitter draught made from the very venom that makes the sickness. Clears the blood of poison.",
    "iconId": "Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-bottle-elongated-rectangular-gold-highlights",
    "value": {
      "gold": 0,
      "silver": 2,
      "copper": 80
    },
    "stackable": true,
    "maxStackSize": 10,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "combatStats": {
      "healthRestore": 8
    },
    "utilityStats": {
      "duration": {
        "type": "MINUTES",
        "value": 1
      }
    }
  },
  {
    "id": "maidens-vitality-tonic",
    "name": "Maiden's Vitality Tonic",
    "type": "consumable",
    "subtype": "POTION",
    "quality": "rare",
    "description": "Moss-maiden milk and a rare herb. It heals deeply, and you will not remember what you were doing last week.",
    "iconId": "Misc/Profession Resources/Alchemy/Orange/orange-potion-arm-flexing-bicep-heart-b-shape-light-beige-pale-orange-vibrant-orange-reddish-orange-sleeve-wristband-brown-shading-highlights",
    "value": {
      "gold": 0,
      "silver": 9,
      "copper": 0
    },
    "stackable": true,
    "maxStackSize": 10,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "combatStats": {
      "healthRestore": 40
    },
    "baseStats": {
      "intelligence": {
        "value": -1,
        "isPercentage": false,
        "duration": 300
      }
    },
    "utilityStats": {
      "duration": {
        "type": "MINUTES",
        "value": 5
      }
    }
  },
  {
    "id": "ember-ward-draught",
    "name": "Ember-Ward Draught",
    "type": "consumable",
    "subtype": "ELIXIR",
    "quality": "uncommon",
    "description": "A warming draught made from an ember-jar's coal. Heat rolls off you for a time.",
    "iconId": "Misc/Profession Resources/Alchemy/Red/red-potion-tilted-triangular-yellow",
    "value": {
      "gold": 0,
      "silver": 3,
      "copper": 40
    },
    "stackable": true,
    "maxStackSize": 10,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "combatStats": {
      "resistances": {
        "ember": {
          "value": 12,
          "isPercentage": false,
          "duration": 600
        }
      }
    },
    "utilityStats": {
      "duration": {
        "type": "MINUTES",
        "value": 10
      }
    }
  },
  {
    "id": "dreamward-draught",
    "name": "Dreamward Draught",
    "type": "consumable",
    "subtype": "ELIXIR",
    "quality": "uncommon",
    "description": "Nightmare-dust taken the wrong way round. The sleeper wakes refreshed and unafraid.",
    "iconId": "Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-fish-bass-leaping-curved-olive-green-beige-belly",
    "value": {
      "gold": 0,
      "silver": 3,
      "copper": 40
    },
    "stackable": true,
    "maxStackSize": 10,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "baseStats": {
      "spirit": {
        "value": 2,
        "isPercentage": false,
        "duration": 1800
      }
    },
    "utilityStats": {
      "duration": {
        "type": "MINUTES",
        "value": 30
      }
    }
  },
  {
    "id": "fogproof-rune-ink",
    "name": "Fogproof Rune Ink",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "uncommon",
    "description": "Rune ink cut with peat-ink. A rune scribed in it holds in rain, fog and forgetting. Enchanting: a more durable rune ink.",
    "iconId": "Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-bottle-tilted-beige-green-liquid",
    "value": {
      "gold": 0,
      "silver": 2,
      "copper": 40
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Ink",
    "professions": [
      "Enchanting"
    ],
    "gatheringMethod": "crafting"
  },
  {
    "id": "oathbinding-chalk",
    "name": "Oath-Binding Chalk",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "Sigil chalk pressed with a truth-anchor stone. A circle drawn with it will not hold for a liar. Enchanting: wards that bind oaths.",
    "iconId": "Misc/Profession Resources/Enchanting/resource-dark-stone-purple-k-rune-cluster",
    "value": {
      "gold": 0,
      "silver": 7,
      "copper": 80
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Chalk",
    "professions": [
      "Enchanting"
    ],
    "gatheringMethod": "crafting"
  },
  {
    "id": "echo-ward-shard",
    "name": "Echo-Ward Shard",
    "type": "miscellaneous",
    "subtype": "CRAFTING",
    "quality": "rare",
    "description": "An imprint shard set with echoing glacier-ice. Sounds in its ward are repeated softly, then forgotten. Enchanting: sound-ward glyphs.",
    "iconId": "Misc/Profession Resources/Enchanting/resource-dark-organic-blob-pink-k-rune-stars",
    "value": {
      "gold": 0,
      "silver": 7,
      "copper": 60
    },
    "stackable": true,
    "maxStackSize": 20,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "materialType": "Crystal",
    "professions": [
      "Enchanting"
    ],
    "gatheringMethod": "crafting"
  },
  {
    "id": "ironwood-banded-maul",
    "name": "Ironwood-Banded Maul",
    "type": "weapon",
    "subtype": "MAUL",
    "quality": "uncommon",
    "description": "A broad Frostwood maul banded in iron. Slow, but it carries its own thunder.",
    "iconId": "Weapons/Warhammer/warhammer-fire-molten-red-orange-yellow-grey-base-spike-yellow-claw-pommel",
    "value": {
      "gold": 0,
      "silver": 6,
      "copper": 20
    },
    "stackable": false,
    "width": 1,
    "height": 2,
    "rotation": 0,
    "slots": [
      "mainHand"
    ],
    "weaponSlot": "TWO_HANDED",
    "hand": "TWO_HAND",
    "weaponStats": {
      "baseDamage": {
        "diceCount": 1,
        "diceType": "d10",
        "damageType": "smashing",
        "bonusDamage": 2
      }
    },
    "baseStats": {
      "strength": {
        "value": 2,
        "isPercentage": false
      },
      "agility": {
        "value": -1,
        "isPercentage": false
      }
    },
    "durability": "d8",
    "maxDurability": "d8"
  },
  {
    "id": "unmelting-frost-sword",
    "name": "Unmelting Frost-Sword",
    "type": "weapon",
    "subtype": "SWORD",
    "quality": "rare",
    "description": "A sword forged from deep-sea ice that has never melted. Rime flows along its edge.",
    "iconId": "Weapons/Swords/sword-golden-guard-pommel-glowing-orange-yellow",
    "value": {
      "gold": 0,
      "silver": 14,
      "copper": 0
    },
    "stackable": false,
    "width": 1,
    "height": 2,
    "rotation": 0,
    "slots": [
      "mainHand",
      "offHand"
    ],
    "weaponSlot": "ONE_HANDED",
    "hand": "MAIN_HAND",
    "weaponStats": {
      "baseDamage": {
        "diceCount": 1,
        "diceType": "d8",
        "damageType": "rime",
        "bonusDamage": 2
      }
    },
    "baseStats": {
      "strength": {
        "value": 1,
        "isPercentage": false
      },
      "agility": {
        "value": 1,
        "isPercentage": false
      }
    },
    "durability": "d8",
    "maxDurability": "d8",
    "combatStats": {
      "onHitEffects": {
        "enabled": true,
        "procType": "dice",
        "procChance": 20,
        "diceThreshold": 18,
        "cardProcRule": "face_cards",
        "coinProcRule": "all_heads",
        "coinCount": 3,
        "procSuit": "hearts",
        "spellEffect": null,
        "customEffects": [],
        "useRollableTable": false,
        "effect": {
          "effectType": "damage",
          "effectConfig": {
            "formula": "1d6",
            "damageType": "rime",
            "isDot": true,
            "targetType": "target",
            "areaRadius": 0,
            "dotDuration": 2,
            "dotTickFrequency": "round"
          }
        }
      }
    }
  },
  {
    "id": "seal-skin-mantle",
    "name": "Seal-Skin Mantle",
    "type": "accessory",
    "subtype": "CLOAK",
    "quality": "uncommon",
    "description": "A sleek seal-skin cloak stitched from child-snatcher scraps. It sheds water and rime equally.",
    "iconId": "Armor/Cloak/red-orange-trim-cloak",
    "value": {
      "gold": 0,
      "silver": 3,
      "copper": 80
    },
    "stackable": false,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "slots": [
      "back"
    ],
    "durability": "d8",
    "maxDurability": "d8",
    "baseStats": {
      "constitution": {
        "value": 1,
        "isPercentage": false
      }
    },
    "combatStats": {
      "resistances": {
        "rime": {
          "value": 3,
          "isPercentage": false
        }
      }
    }
  },
  {
    "id": "fogwalker-cloak",
    "name": "Fogwalker's Cloak",
    "type": "accessory",
    "subtype": "CLOAK",
    "quality": "rare",
    "description": "A green hound-pelt cloak lined with moss. In fog, footsteps vanish behind you.",
    "iconId": "Armor/Cloak/fur-trimmed-brown-cloak",
    "value": {
      "gold": 0,
      "silver": 9,
      "copper": 60
    },
    "stackable": false,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "slots": [
      "back"
    ],
    "durability": "d8",
    "maxDurability": "d8",
    "baseStats": {
      "agility": {
        "value": 2,
        "isPercentage": false
      },
      "spirit": {
        "value": 1,
        "isPercentage": false
      }
    }
  },
  {
    "id": "quiet-shroud-cloak",
    "name": "Cloak of the Quiet Shroud",
    "type": "accessory",
    "subtype": "CLOAK",
    "quality": "uncommon",
    "description": "A cloak woven of dissolved-journal shroud and silk. It dulls anything said about you.",
    "iconId": "Armor/Cloak/chicken-costume-cloak",
    "value": {
      "gold": 0,
      "silver": 4,
      "copper": 20
    },
    "stackable": false,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "slots": [
      "back"
    ],
    "durability": "d8",
    "maxDurability": "d8",
    "baseStats": {
      "charisma": {
        "value": -1,
        "isPercentage": false
      },
      "agility": {
        "value": 1,
        "isPercentage": false
      },
      "spirit": {
        "value": 1,
        "isPercentage": false
      }
    }
  },
  {
    "id": "jade-scale-pendant",
    "name": "Jade-Scale Pendant",
    "type": "accessory",
    "subtype": "NECKLACE",
    "quality": "rare",
    "description": "A shrine-guardian's jade scale on a copper chain. Warm, calm and quietly protective.",
    "iconId": "Armor/Neck/dried-herb-wreath-pendant",
    "value": {
      "gold": 0,
      "silver": 9,
      "copper": 40
    },
    "stackable": false,
    "width": 1,
    "height": 1,
    "rotation": 0,
    "slots": [
      "neck"
    ],
    "durability": "d8",
    "maxDurability": "d8",
    "baseStats": {
      "constitution": {
        "value": 1,
        "isPercentage": false
      },
      "spirit": {
        "value": 1,
        "isPercentage": false
      }
    },
    "combatStats": {
      "resistances": {
        "smashing": {
          "value": 2,
          "isPercentage": false
        }
      }
    }
  }
];
