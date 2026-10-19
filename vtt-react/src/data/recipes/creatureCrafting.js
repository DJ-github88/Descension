/**
 * Creature-drop Crafting Recipes
 *
 * Recipes that turn creature reagents and trophies into usable gear and consumables.
 */

export const CREATURE_CRAFTING_RECIPES = [
  {
    "id": "draught-of-recall-recipe",
    "name": "Draught of Recall",
    "profession": "alchemy",
    "description": "Steeped in the fog-silt of the Frostwood. A draught that sharpens recall for a short while.",
    "requiredLevel": 1,
    "resultItemId": "draught-of-recall",
    "resultQuantity": 1,
    "materials": [
      {
        "itemId": "memory-silt",
        "quantity": 2
      },
      {
        "itemId": "glass-vial",
        "quantity": 1
      },
      {
        "itemId": "distilled-water",
        "quantity": 1
      }
    ],
    "craftingTime": 6000,
    "experienceGained": 2,
    "category": "elixirs"
  },
  {
    "id": "glacier-frostward-tonic-recipe",
    "name": "Glacier Frostward Tonic",
    "profession": "alchemy",
    "description": "Cut with ice that will not melt. A tonic that turns rime aside.",
    "requiredLevel": 2,
    "resultItemId": "glacier-frostward-tonic",
    "resultQuantity": 1,
    "materials": [
      {
        "itemId": "glacier-ice-shard",
        "quantity": 2
      },
      {
        "itemId": "frostcap",
        "quantity": 1
      },
      {
        "itemId": "glass-vial",
        "quantity": 1
      }
    ],
    "craftingTime": 7000,
    "experienceGained": 3,
    "category": "resistance"
  },
  {
    "id": "steppe-antivenom-recipe",
    "name": "Steppe Antivenom",
    "profession": "alchemy",
    "description": "Made with the venom it undoes. A bitter draught that clears poison.",
    "requiredLevel": 2,
    "resultItemId": "steppe-antivenom",
    "resultQuantity": 1,
    "materials": [
      {
        "itemId": "snake-venom-gland",
        "quantity": 1
      },
      {
        "itemId": "bitterroot",
        "quantity": 1
      },
      {
        "itemId": "glass-vial",
        "quantity": 1
      }
    ],
    "craftingTime": 7000,
    "experienceGained": 3,
    "category": "healing"
  },
  {
    "id": "maidens-vitality-tonic-recipe",
    "name": "Maiden's Vitality Tonic",
    "profession": "alchemy",
    "description": "A bargain brewed in the Frostwood. A deep healing tonic with a price in memory.",
    "requiredLevel": 3,
    "resultItemId": "maidens-vitality-tonic",
    "resultQuantity": 1,
    "materials": [
      {
        "itemId": "blood-milk-vial",
        "quantity": 1
      },
      {
        "itemId": "fieldleaf",
        "quantity": 2
      },
      {
        "itemId": "reinforced-flask",
        "quantity": 1
      }
    ],
    "craftingTime": 9000,
    "experienceGained": 5,
    "category": "healing"
  },
  {
    "id": "ember-ward-draught-recipe",
    "name": "Ember-Ward Draught",
    "profession": "alchemy",
    "description": "Brewed in Sundale smithies with a jar-spirit's coal. Heat bends around you.",
    "requiredLevel": 2,
    "resultItemId": "ember-ward-draught",
    "resultQuantity": 1,
    "materials": [
      {
        "itemId": "ember-spit-coal",
        "quantity": 2
      },
      {
        "itemId": "fire-essence",
        "quantity": 1
      },
      {
        "itemId": "glass-vial",
        "quantity": 1
      }
    ],
    "craftingTime": 7500,
    "experienceGained": 3,
    "category": "resistance"
  },
  {
    "id": "dreamward-draught-recipe",
    "name": "Dreamward Draught",
    "profession": "alchemy",
    "description": "Nightmare-dust turned about. Sleepers wake rested and unafraid.",
    "requiredLevel": 2,
    "resultItemId": "dreamward-draught",
    "resultQuantity": 1,
    "materials": [
      {
        "itemId": "nightmare-dust",
        "quantity": 2
      },
      {
        "itemId": "dreamspore",
        "quantity": 1
      },
      {
        "itemId": "glass-vial",
        "quantity": 1
      }
    ],
    "craftingTime": 7000,
    "experienceGained": 3,
    "category": "elixirs"
  },
  {
    "id": "fogproof-rune-ink-recipe",
    "name": "Fogproof Rune Ink",
    "profession": "enchanting",
    "description": "Peat-ink and rune ink. A rune scribed in it holds fast against fog and forgetting.",
    "requiredLevel": 2,
    "resultItemId": "fogproof-rune-ink",
    "resultQuantity": 1,
    "materials": [
      {
        "itemId": "peat-ink",
        "quantity": 2
      },
      {
        "itemId": "rune-ink",
        "quantity": 1
      }
    ],
    "craftingTime": 6000,
    "experienceGained": 3,
    "category": "materials"
  },
  {
    "id": "oathbinding-chalk-recipe",
    "name": "Oath-Binding Chalk",
    "profession": "enchanting",
    "description": "Sigil chalk pressed with a fachan's truth stone. Circles that will not hold for liars.",
    "requiredLevel": 3,
    "resultItemId": "oathbinding-chalk",
    "resultQuantity": 1,
    "materials": [
      {
        "itemId": "fachan-truth-stone",
        "quantity": 1
      },
      {
        "itemId": "sigil-chalk",
        "quantity": 2
      }
    ],
    "craftingTime": 8000,
    "experienceGained": 4,
    "category": "materials"
  },
  {
    "id": "echo-ward-shard-recipe",
    "name": "Echo-Ward Shard",
    "profession": "enchanting",
    "description": "Ice that repeats the last scream, set into an imprint shard. A ward for sound.",
    "requiredLevel": 3,
    "resultItemId": "echo-ward-shard",
    "resultQuantity": 1,
    "materials": [
      {
        "itemId": "glacier-echo-ice",
        "quantity": 2
      },
      {
        "itemId": "imprint-shard",
        "quantity": 1
      }
    ],
    "craftingTime": 8000,
    "experienceGained": 4,
    "category": "materials"
  },
  {
    "id": "ironwood-banded-maul-recipe",
    "name": "Ironwood-Banded Maul",
    "profession": "blacksmithing",
    "description": "An ironwood haft bound in Nordhalla iron. Slow, solid, thunderous.",
    "requiredLevel": 2,
    "resultItemId": "ironwood-banded-maul",
    "resultQuantity": 1,
    "materials": [
      {
        "itemId": "ironwood-bark",
        "quantity": 3
      },
      {
        "itemId": "iron-ingot",
        "quantity": 3
      },
      {
        "itemId": "leather-straps",
        "quantity": 1
      }
    ],
    "craftingTime": 12000,
    "experienceGained": 4,
    "category": "weapons"
  },
  {
    "id": "unmelting-frost-sword-recipe",
    "name": "Unmelting Frost-Sword",
    "profession": "blacksmithing",
    "description": "Folded around ice that does not melt. A blade of the Iceheart smiths.",
    "requiredLevel": 4,
    "resultItemId": "unmelting-frost-sword",
    "resultQuantity": 1,
    "materials": [
      {
        "itemId": "deep-sea-ice-ingot",
        "quantity": 1
      },
      {
        "itemId": "iron-ingot",
        "quantity": 2
      },
      {
        "itemId": "leather-straps",
        "quantity": 1
      }
    ],
    "craftingTime": 20000,
    "experienceGained": 8,
    "category": "weapons"
  },
  {
    "id": "seal-skin-mantle-recipe",
    "name": "Seal-Skin Mantle",
    "profession": "leatherworking",
    "description": "Stitched from snatcher's seal-skin scraps. Sheds water and cold.",
    "requiredLevel": 2,
    "resultItemId": "seal-skin-mantle",
    "resultQuantity": 1,
    "materials": [
      {
        "itemId": "seal-skin-scrap",
        "quantity": 3
      },
      {
        "itemId": "leather-straps",
        "quantity": 2
      }
    ],
    "craftingTime": 9000,
    "experienceGained": 3,
    "category": "armor"
  },
  {
    "id": "fogwalker-cloak-recipe",
    "name": "Fogwalker's Cloak",
    "profession": "leatherworking",
    "description": "A green hound-pelt cloak lined with moss. For those who walk quietly in fog.",
    "requiredLevel": 3,
    "resultItemId": "fogwalker-cloak",
    "resultQuantity": 1,
    "materials": [
      {
        "itemId": "green-hound-pelt",
        "quantity": 1
      },
      {
        "itemId": "mossy-fur-scrap",
        "quantity": 2
      },
      {
        "itemId": "leather-straps",
        "quantity": 1
      }
    ],
    "craftingTime": 12000,
    "experienceGained": 5,
    "category": "armor"
  },
  {
    "id": "quiet-shroud-cloak-recipe",
    "name": "Cloak of the Quiet Shroud",
    "profession": "tailoring",
    "description": "Shroud scraps woven with silk. It dulls anything said about you.",
    "requiredLevel": 2,
    "resultItemId": "quiet-shroud-cloak",
    "resultQuantity": 1,
    "materials": [
      {
        "itemId": "shroud-remnant",
        "quantity": 3
      },
      {
        "itemId": "silk-strand",
        "quantity": 1
      }
    ],
    "craftingTime": 9000,
    "experienceGained": 3,
    "category": "armor"
  },
  {
    "id": "jade-scale-pendant-recipe",
    "name": "Jade-Scale Pendant",
    "profession": "jewelcrafting",
    "description": "A guardian's jade scale hung on copper. Warm and quietly protective.",
    "requiredLevel": 3,
    "resultItemId": "jade-scale-pendant",
    "resultQuantity": 1,
    "materials": [
      {
        "itemId": "jade-stone-scales",
        "quantity": 2
      },
      {
        "itemId": "copper-ingot",
        "quantity": 1
      }
    ],
    "craftingTime": 10000,
    "experienceGained": 4,
    "category": "accessories"
  }
];
