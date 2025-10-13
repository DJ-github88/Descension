# Spell Wizard JSON Schema

## Complete JSON Schema for AI-Assisted Spell Creation

This schema defines all valid spell properties, configurations, and validation rules for the Spell Wizard system.

---

## Base Spell Structure

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Spell Configuration",
  "type": "object",
  "required": ["name", "spellType", "effectTypes"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique identifier (auto-generated if not provided)"
    },
    "name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 50,
      "description": "Spell name"
    },
    "description": {
      "type": "string",
      "maxLength": 500,
      "description": "Spell description"
    },
    "level": {
      "type": "integer",
      "minimum": 1,
      "maximum": 10,
      "description": "Spell level (1-10)"
    },
    "school": {
      "type": "string",
      "enum": ["abjuration", "conjuration", "divination", "enchantment", "evocation", "illusion", "necromancy", "transmutation"],
      "description": "Magic school"
    },
    "icon": {
      "type": "string",
      "description": "Icon identifier (WoW-style icon name)"
    },
    "spellType": {
      "type": "string",
      "enum": ["ACTION", "CHANNELED", "PASSIVE", "REACTION", "TRAP", "STATE"],
      "description": "Spell type determines casting behavior"
    },
    "typeConfig": {
      "type": "object",
      "description": "Type-specific configuration (varies by spellType)"
    },
    "effectTypes": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": ["damage", "healing", "buff", "debuff", "utility", "control", "summoning", "transformation", "purification", "restoration"]
      },
      "minItems": 1,
      "description": "Array of effect types this spell has"
    },
    "targetingConfig": {
      "$ref": "#/definitions/targetingConfig"
    },
    "durationConfig": {
      "$ref": "#/definitions/durationConfig"
    },
    "resourceCost": {
      "$ref": "#/definitions/resourceCost"
    },
    "cooldownConfig": {
      "$ref": "#/definitions/cooldownConfig"
    },
    "mechanicsConfig": {
      "$ref": "#/definitions/mechanicsConfig"
    },
    "triggerConfig": {
      "$ref": "#/definitions/triggerConfig"
    },
    "damageConfig": {
      "$ref": "#/definitions/damageConfig"
    },
    "healingConfig": {
      "$ref": "#/definitions/healingConfig"
    },
    "buffConfig": {
      "$ref": "#/definitions/buffConfig"
    },
    "debuffConfig": {
      "$ref": "#/definitions/debuffConfig"
    },
    "utilityConfig": {
      "$ref": "#/definitions/utilityConfig"
    },
    "controlConfig": {
      "$ref": "#/definitions/controlConfig"
    },
    "summoningConfig": {
      "$ref": "#/definitions/summoningConfig"
    },
    "transformationConfig": {
      "$ref": "#/definitions/transformationConfig"
    }
  }
}
```

---

## Definitions

### Targeting Configuration

```json
{
  "targetingConfig": {
    "type": "object",
    "required": ["targetingType"],
    "properties": {
      "targetingType": {
        "type": "string",
        "enum": ["single", "multi", "area", "chain", "cone", "line", "self", "smart", "nearest"],
        "description": "How the spell targets"
      },
      "rangeType": {
        "type": "string",
        "enum": ["melee", "ranged", "touch", "self", "sight", "unlimited"],
        "default": "ranged"
      },
      "rangeDistance": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1000,
        "default": 30,
        "description": "Range in feet"
      },
      "targetCount": {
        "type": "integer",
        "minimum": 1,
        "maximum": 20,
        "description": "Number of targets (for multi targeting)"
      },
      "areaShape": {
        "type": "string",
        "enum": ["circle", "square", "cone", "line", "cube", "sphere", "cylinder", "wall", "trail"],
        "description": "Shape of area effect"
      },
      "areaSize": {
        "type": "integer",
        "minimum": 5,
        "maximum": 100,
        "description": "Size of area in feet"
      },
      "targetRestrictions": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": ["any", "allies", "enemies", "self_only", "not_self", "living", "undead", "constructs", "elementals"]
        }
      },
      "lineOfSightRequired": {
        "type": "boolean",
        "default": true
      },
      "propagation": {
        "type": "object",
        "properties": {
          "enabled": {
            "type": "boolean",
            "default": false
          },
          "maxJumps": {
            "type": "integer",
            "minimum": 1,
            "maximum": 10
          },
          "jumpRange": {
            "type": "integer",
            "minimum": 5,
            "maximum": 60
          },
          "falloffType": {
            "type": "string",
            "enum": ["none", "percentage", "fixed", "dice"]
          },
          "falloffRate": {
            "type": "number",
            "minimum": 0,
            "maximum": 100
          }
        }
      }
    }
  }
}
```

### Duration Configuration

```json
{
  "durationConfig": {
    "type": "object",
    "required": ["durationType"],
    "properties": {
      "durationType": {
        "type": "string",
        "enum": ["instant", "rounds", "turns", "minutes", "hours", "concentration", "permanent"],
        "description": "Type of duration"
      },
      "durationValue": {
        "type": "integer",
        "minimum": 1,
        "description": "Duration amount (not used for instant or permanent)"
      },
      "durationUnit": {
        "type": "string",
        "enum": ["rounds", "turns", "minutes", "hours", "days"],
        "description": "Unit of time"
      },
      "requiresConcentration": {
        "type": "boolean",
        "default": false,
        "description": "Whether spell requires concentration"
      },
      "concentrationDC": {
        "type": "integer",
        "minimum": 10,
        "maximum": 30,
        "description": "DC for concentration checks"
      }
    }
  }
}
```

### Resource Cost Configuration

```json
{
  "resourceCost": {
    "type": "object",
    "properties": {
      "actionPoints": {
        "type": "integer",
        "minimum": 0,
        "maximum": 10,
        "default": 1,
        "description": "Action points required"
      },
      "mana": {
        "type": "integer",
        "minimum": 0,
        "description": "Mana cost (auto-calculated if not specified)"
      },
      "health": {
        "type": "integer",
        "minimum": 0,
        "description": "Health cost"
      },
      "stamina": {
        "type": "integer",
        "minimum": 0,
        "description": "Stamina cost"
      },
      "classResource": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": ["combo_points", "soul_shards", "holy_power", "arcane_charges", "chi", "runes", "focus"]
          },
          "cost": {
            "type": "integer",
            "minimum": 0,
            "maximum": 10
          }
        }
      },
      "reagents": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "quantity": {
              "type": "integer",
              "minimum": 1
            },
            "consumed": {
              "type": "boolean",
              "default": true
            }
          }
        }
      }
    }
  }
}
```

### Cooldown Configuration

```json
{
  "cooldownConfig": {
    "type": "object",
    "properties": {
      "cooldownType": {
        "type": "string",
        "enum": ["turn_based", "short_rest", "long_rest", "real_time", "conditional", "charge_based", "encounter", "dice_based"],
        "default": "turn_based"
      },
      "cooldownValue": {
        "type": "integer",
        "minimum": 0,
        "description": "Cooldown amount (in rounds for turn_based)"
      },
      "charges": {
        "type": "integer",
        "minimum": 1,
        "maximum": 10,
        "description": "Number of charges (for charge_based)"
      },
      "chargeRecoveryRate": {
        "type": "integer",
        "minimum": 1,
        "description": "Rounds to recover one charge"
      },
      "cooldownDice": {
        "type": "string",
        "pattern": "^\\d+d\\d+([+-]\\d+)?$",
        "description": "Dice notation for random cooldown (e.g., '1d4')"
      }
    }
  }
}
```

### Damage Configuration

```json
{
  "damageConfig": {
    "type": "object",
    "required": ["formula", "damageTypes"],
    "properties": {
      "formula": {
        "type": "string",
        "description": "Damage formula (e.g., '2d6+INT', 'CARD_VALUE*2', 'HEADS_COUNT*8')"
      },
      "damageTypes": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": ["acid", "bludgeoning", "cold", "fire", "force", "lightning", "necrotic", "piercing", "poison", "psychic", "radiant", "slashing", "thunder"]
        },
        "minItems": 1
      },
      "resolution": {
        "type": "string",
        "enum": ["DICE", "CARDS", "COINS", "FIXED"],
        "default": "DICE"
      },
      "diceConfig": {
        "type": "object",
        "properties": {
          "advantage": {
            "type": "boolean",
            "default": false
          },
          "disadvantage": {
            "type": "boolean",
            "default": false
          },
          "explodingDice": {
            "type": "boolean",
            "default": false
          }
        }
      },
      "cardConfig": {
        "type": "object",
        "properties": {
          "drawCount": {
            "type": "integer",
            "minimum": 1,
            "maximum": 10,
            "default": 3
          },
          "deckType": {
            "type": "string",
            "enum": ["STANDARD", "STANDARD_WITH_JOKERS", "TAROT", "MAJOR_ARCANA", "MINOR_ARCANA"],
            "default": "STANDARD"
          }
        }
      },
      "coinConfig": {
        "type": "object",
        "properties": {
          "flipCount": {
            "type": "integer",
            "minimum": 1,
            "maximum": 20,
            "default": 5
          },
          "coinType": {
            "type": "string",
            "enum": ["STANDARD", "WEIGHTED", "MULTI_FACED", "CONDITIONAL", "LINKED"],
            "default": "STANDARD"
          }
        }
      },
      "useCriticalEffect": {
        "type": "boolean",
        "default": false
      },
      "criticalConfig": {
        "type": "object",
        "properties": {
          "critThreshold": {
            "type": "integer",
            "minimum": 1,
            "maximum": 20,
            "default": 20
          },
          "critMultiplier": {
            "type": "number",
            "minimum": 1,
            "maximum": 5,
            "default": 2
          },
          "critDiceOnly": {
            "type": "boolean",
            "default": true,
            "description": "Only multiply dice, not modifiers"
          },
          "extraDice": {
            "type": "string",
            "pattern": "^\\d+d\\d+$",
            "description": "Extra dice on crit (e.g., '1d6')"
          },
          "explodingDice": {
            "type": "boolean",
            "default": false
          }
        }
      },
      "useChainEffect": {
        "type": "boolean",
        "default": false
      },
      "chainConfig": {
        "type": "object",
        "properties": {
          "targets": {
            "type": "integer",
            "minimum": 1,
            "maximum": 10
          },
          "falloffType": {
            "type": "string",
            "enum": ["none", "percentage", "fixed", "dice"]
          },
          "falloffRate": {
            "type": "number",
            "minimum": 0,
            "maximum": 100
          },
          "minimumDamage": {
            "type": "integer",
            "minimum": 0
          }
        }
      },
      "savingThrow": {
        "type": "string",
        "enum": ["none", "strength", "agility", "constitution", "intelligence", "spirit", "charisma"]
      },
      "difficultyClass": {
        "type": "integer",
        "minimum": 10,
        "maximum": 30
      },
      "saveOutcome": {
        "type": "string",
        "enum": ["negates", "halves", "none"]
      }
    }
  }
}
```

### Healing Configuration

```json
{
  "healingConfig": {
    "type": "object",
    "required": ["formula"],
    "properties": {
      "formula": {
        "type": "string",
        "description": "Healing formula (e.g., '3d8+SPI')"
      },
      "healingType": {
        "type": "string",
        "enum": ["direct", "regeneration", "vampiric", "conditional", "resurrection", "spirit"],
        "default": "direct"
      },
      "resolution": {
        "type": "string",
        "enum": ["DICE", "CARDS", "COINS", "FIXED"],
        "default": "DICE"
      },
      "useAbsorptionShield": {
        "type": "boolean",
        "default": false
      },
      "shieldConfig": {
        "type": "object",
        "properties": {
          "shieldType": {
            "type": "string",
            "enum": ["standard", "reactive", "reflective", "adaptive", "temporary", "permanent", "scaling", "conditional"]
          },
          "shieldAmount": {
            "type": "string",
            "description": "Shield amount formula (e.g., '2d6')"
          },
          "duration": {
            "type": "integer",
            "minimum": 1
          },
          "reflectionType": {
            "type": "string",
            "enum": ["physical", "magical", "elemental", "all"]
          },
          "reflectionPercentage": {
            "type": "integer",
            "minimum": 0,
            "maximum": 100
          }
        }
      },
      "hasHotEffect": {
        "type": "boolean",
        "default": false,
        "description": "Healing over Time"
      },
      "hotConfig": {
        "type": "object",
        "properties": {
          "tickFormula": {
            "type": "string",
            "description": "Healing per tick (e.g., '1d4+SPI')"
          },
          "duration": {
            "type": "integer",
            "minimum": 1
          },
          "tickFrequency": {
            "type": "string",
            "enum": ["start_of_turn", "end_of_turn", "per_turn"]
          }
        }
      },
      "useChainHealing": {
        "type": "boolean",
        "default": false
      },
      "chainConfig": {
        "type": "object",
        "properties": {
          "targets": {
            "type": "integer",
            "minimum": 1,
            "maximum": 10
          },
          "targetSelection": {
            "type": "string",
            "enum": ["lowest_health", "random", "nearest"]
          },
          "falloffType": {
            "type": "string",
            "enum": ["none", "percentage", "fixed"]
          },
          "falloffRate": {
            "type": "number",
            "minimum": 0,
            "maximum": 100
          }
        }
      }
    }
  }
}
```

### Buff Configuration

```json
{
  "buffConfig": {
    "type": "object",
    "properties": {
      "statModifiers": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "enum": ["Strength", "Agility", "Constitution", "Intelligence", "Spirit", "Charisma", "Armor", "Attack Power", "Spell Power", "Critical Chance", "Haste"]
            },
            "magnitude": {
              "type": "number"
            },
            "magnitudeType": {
              "type": "string",
              "enum": ["flat", "percentage"],
              "default": "flat"
            }
          }
        }
      },
      "statusEffects": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "enum": ["inspired", "blessed", "regeneration", "invisible", "haste", "resistance", "flying", "truesight", "energized", "shielded", "empowered"]
            },
            "level": {
              "type": "string",
              "enum": ["minor", "moderate", "major", "severe", "extreme"],
              "default": "moderate"
            }
          }
        }
      },
      "stackingRule": {
        "type": "string",
        "enum": ["replace", "selfStacking", "cumulative", "progressive", "diminishing"],
        "default": "replace"
      },
      "maxStacks": {
        "type": "integer",
        "minimum": 1,
        "maximum": 10
      },
      "durationType": {
        "type": "string",
        "enum": ["rounds", "turns", "minutes", "hours", "rest", "permanent"]
      },
      "durationValue": {
        "type": "integer",
        "minimum": 1
      },
      "concentrationRequired": {
        "type": "boolean",
        "default": false
      }
    }
  }
}
```

### Debuff Configuration

```json
{
  "debuffConfig": {
    "type": "object",
    "properties": {
      "statPenalties": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "enum": ["Strength", "Agility", "Constitution", "Intelligence", "Spirit", "Charisma", "Armor", "Attack Power", "Spell Power", "Speed"]
            },
            "magnitude": {
              "type": "number"
            },
            "magnitudeType": {
              "type": "string",
              "enum": ["flat", "percentage"],
              "default": "flat"
            }
          }
        }
      },
      "statusEffects": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "enum": ["blinded", "charmed", "frightened", "paralyzed", "poisoned", "restrained", "silenced", "stunned", "slowed", "rooted"]
            },
            "level": {
              "type": "string",
              "enum": ["minor", "moderate", "major", "severe", "extreme"],
              "default": "moderate"
            },
            "charmType": {
              "type": "string",
              "enum": ["friendly", "dominated", "infatuated"],
              "description": "Only for charmed status"
            },
            "canAttackCharmer": {
              "type": "boolean",
              "default": false
            },
            "canSelfHarm": {
              "type": "boolean",
              "default": false
            },
            "retainsMemory": {
              "type": "boolean",
              "default": true
            },
            "commandComplexity": {
              "type": "string",
              "enum": ["simple", "moderate", "complex", "any"]
            },
            "maxCommands": {
              "type": "integer",
              "minimum": 1
            },
            "saveDC": {
              "type": "integer",
              "minimum": 10,
              "maximum": 30
            },
            "saveType": {
              "type": "string",
              "enum": ["none", "strength", "agility", "constitution", "intelligence", "spirit", "charisma", "wisdom"]
            },
            "saveOutcome": {
              "type": "string",
              "enum": ["negates", "halves_duration", "ends_early", "partial_immunity", "reduces_level"]
            },
            "saveTrigger": {
              "type": "string",
              "enum": ["none", "harmful", "turn", "damage"]
            },
            "saveFrequency": {
              "type": "string",
              "enum": ["initial", "end_of_turn", "when_damaged", "out_of_sight", "ally_help", "special_trigger"]
            }
          }
        }
      },
      "savingThrow": {
        "type": "string",
        "enum": ["none", "strength", "agility", "constitution", "intelligence", "spirit", "charisma", "wisdom"]
      },
      "difficultyClass": {
        "type": "integer",
        "minimum": 10,
        "maximum": 30
      },
      "saveOutcome": {
        "type": "string",
        "enum": ["negates", "halves_duration", "halves_effects", "reduces_level"]
      },
      "durationType": {
        "type": "string",
        "enum": ["rounds", "turns", "minutes", "hours", "rest", "permanent"]
      },
      "durationValue": {
        "type": "integer",
        "minimum": 1
      },
      "canBeDispelled": {
        "type": "boolean",
        "default": true
      },
      "stackingRule": {
        "type": "string",
        "enum": ["replace", "selfStacking", "cumulative", "progressive", "diminishing"],
        "default": "replace"
      },
      "maxStacks": {
        "type": "integer",
        "minimum": 1,
        "maximum": 10
      }
    }
  }
}
```

### Utility Configuration

```json
{
  "utilityConfig": {
    "type": "object",
    "required": ["utilityType"],
    "properties": {
      "utilityType": {
        "type": "string",
        "enum": ["movement", "control", "environment", "illusion", "transformation", "divination", "conjuration", "enchantment"]
      },
      "utilitySubtype": {
        "type": "string",
        "description": "Specific subtype depends on utilityType"
      },
      "selectedEffects": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "customName": {
              "type": "string"
            }
          }
        }
      },
      "duration": {
        "type": "integer",
        "minimum": 1
      },
      "durationUnit": {
        "type": "string",
        "enum": ["rounds", "turns", "minutes", "hours"]
      },
      "difficultyClass": {
        "type": "integer",
        "minimum": 10,
        "maximum": 30
      },
      "concentration": {
        "type": "boolean",
        "default": false
      },
      "abilitySave": {
        "type": "string",
        "enum": ["str", "agi", "con", "int", "spi", "cha"]
      }
    }
  }
}
```

---

## Example Spells

### Example 1: Simple Damage Spell (Fireball)

```json
{
  "name": "Fireball",
  "description": "A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame.",
  "level": 3,
  "school": "evocation",
  "icon": "spell_fire_fireball02",
  "spellType": "ACTION",
  "effectTypes": ["damage"],
  "targetingConfig": {
    "targetingType": "area",
    "rangeType": "ranged",
    "rangeDistance": 150,
    "areaShape": "sphere",
    "areaSize": 20,
    "targetRestrictions": ["any"],
    "lineOfSightRequired": true
  },
  "durationConfig": {
    "durationType": "instant"
  },
  "damageConfig": {
    "formula": "8d6",
    "damageTypes": ["fire"],
    "resolution": "DICE",
    "savingThrow": "agility",
    "difficultyClass": 15,
    "saveOutcome": "halves"
  },
  "resourceCost": {
    "actionPoints": 1,
    "mana": 30
  },
  "cooldownConfig": {
    "cooldownType": "turn_based",
    "cooldownValue": 0
  }
}
```

### Example 2: Complex Healing Spell (Rejuvenation)

```json
{
  "name": "Rejuvenation",
  "description": "Restore health immediately and over time, while providing a protective shield.",
  "level": 5,
  "school": "abjuration",
  "icon": "spell_holy_heal02",
  "spellType": "ACTION",
  "effectTypes": ["healing"],
  "targetingConfig": {
    "targetingType": "single",
    "rangeType": "ranged",
    "rangeDistance": 40,
    "targetRestrictions": ["allies"],
    "lineOfSightRequired": true
  },
  "durationConfig": {
    "durationType": "rounds",
    "durationValue": 5,
    "requiresConcentration": false
  },
  "healingConfig": {
    "formula": "4d8+SPI",
    "healingType": "direct",
    "resolution": "DICE",
    "useAbsorptionShield": true,
    "shieldConfig": {
      "shieldType": "standard",
      "shieldAmount": "2d6",
      "duration": 3
    },
    "hasHotEffect": true,
    "hotConfig": {
      "tickFormula": "1d6+SPI",
      "duration": 5,
      "tickFrequency": "end_of_turn"
    }
  },
  "resourceCost": {
    "actionPoints": 1,
    "mana": 45
  }
}
```

### Example 3: Card-Based Damage Spell (Arcane Gambit)

```json
{
  "name": "Arcane Gambit",
  "description": "Draw cards from a mystical deck, dealing damage based on the cards drawn.",
  "level": 4,
  "school": "evocation",
  "icon": "spell_arcane_blast",
  "spellType": "ACTION",
  "effectTypes": ["damage"],
  "targetingConfig": {
    "targetingType": "single",
    "rangeType": "ranged",
    "rangeDistance": 60,
    "targetRestrictions": ["enemies"]
  },
  "durationConfig": {
    "durationType": "instant"
  },
  "damageConfig": {
    "formula": "CARD_VALUE + (FACE_CARDS * 5) + INT",
    "damageTypes": ["force"],
    "resolution": "CARDS",
    "cardConfig": {
      "drawCount": 4,
      "deckType": "STANDARD"
    },
    "useCriticalEffect": true,
    "criticalConfig": {
      "critThreshold": 0,
      "critMultiplier": 2,
      "description": "Critical on face cards"
    }
  },
  "resourceCost": {
    "actionPoints": 1,
    "mana": 35
  }
}
```

### Example 4: Coin-Based Spell (Fortune Frost)

```json
{
  "name": "Fortune Frost",
  "description": "Flip coins to determine the power of your frost attack.",
  "level": 3,
  "school": "evocation",
  "icon": "spell_frost_frostbolt02",
  "spellType": "ACTION",
  "effectTypes": ["damage"],
  "targetingConfig": {
    "targetingType": "single",
    "rangeType": "ranged",
    "rangeDistance": 60,
    "targetRestrictions": ["enemies"]
  },
  "durationConfig": {
    "durationType": "instant"
  },
  "damageConfig": {
    "formula": "HEADS_COUNT * 8 + (ALL_HEADS ? 15 : 0)",
    "damageTypes": ["cold"],
    "resolution": "COINS",
    "coinConfig": {
      "flipCount": 5,
      "coinType": "STANDARD"
    }
  },
  "resourceCost": {
    "actionPoints": 1,
    "mana": 25
  }
}
```

### Example 5: Complex Debuff (Dominate Person)

```json
{
  "name": "Dominate Person",
  "description": "You attempt to beguile a humanoid that you can see within range.",
  "level": 5,
  "school": "enchantment",
  "icon": "spell_shadow_charm",
  "spellType": "ACTION",
  "effectTypes": ["debuff"],
  "targetingConfig": {
    "targetingType": "single",
    "rangeType": "ranged",
    "rangeDistance": 60,
    "targetRestrictions": ["enemies"]
  },
  "durationConfig": {
    "durationType": "minutes",
    "durationValue": 10,
    "requiresConcentration": true
  },
  "debuffConfig": {
    "statusEffects": [
      {
        "id": "charmed",
        "level": "major",
        "charmType": "dominated",
        "canAttackCharmer": false,
        "canSelfHarm": false,
        "retainsMemory": false,
        "commandComplexity": "any",
        "saveDC": 17,
        "saveType": "wisdom",
        "saveOutcome": "negates",
        "saveTrigger": "harmful",
        "saveFrequency": "end_of_turn"
      }
    ],
    "savingThrow": "wisdom",
    "difficultyClass": 17,
    "saveOutcome": "negates",
    "durationType": "minutes",
    "durationValue": 10,
    "canBeDispelled": true
  },
  "resourceCost": {
    "actionPoints": 1,
    "mana": 50
  }
}
```

---

## Validation Rules

### Required Fields by Effect Type

**Damage:**
- `damageConfig.formula` (required)
- `damageConfig.damageTypes` (required, min 1 item)
- `damageConfig.resolution` (defaults to "DICE")

**Healing:**
- `healingConfig.formula` (required)
- `healingConfig.healingType` (defaults to "direct")

**Buff:**
- At least one of: `buffConfig.statModifiers` or `buffConfig.statusEffects`

**Debuff:**
- At least one of: `debuffConfig.statPenalties` or `debuffConfig.statusEffects`

**Utility:**
- `utilityConfig.utilityType` (required)
- `utilityConfig.selectedEffects` (required, min 1 item)

### Formula Validation

**DICE formulas:**
- Must match pattern: `^\d+d\d+(k\d+)?([+-]\d+)?$` or contain valid variables (INT, SPI, STR, etc.)
- Examples: `2d6`, `4d6k3`, `2d6+INT`, `(2d6+3)*2`

**CARDS formulas:**
- Can use variables: `CARD_VALUE`, `FACE_CARDS`, `SUIT_COUNT`, `HAND_RANK`
- Examples: `CARD_VALUE + FACE_CARDS * 5`, `HAND_RANK * 10`

**COINS formulas:**
- Can use variables: `HEADS_COUNT`, `TAILS_COUNT`, `ALL_HEADS`, `ALL_TAILS`, `LONGEST_STREAK`
- Examples: `HEADS_COUNT * 8`, `HEADS_COUNT * 8 + (ALL_HEADS ? 15 : 0)`

---

*End of JSON Schema Documentation*

