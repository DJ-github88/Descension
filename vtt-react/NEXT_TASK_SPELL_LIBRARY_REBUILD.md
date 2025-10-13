# Next Task: Spell Library Rebuild with Comprehensive Test Spells

## Objective

Remove all existing spells from the spell library (general actions + all 27 class spells) and create a comprehensive set of test spells that demonstrate EVERY configuration option in the spell wizard system to verify formatting and display.

---

## Phase 1: Remove Existing Spells

### Files to Clear/Update

1. **General Actions**
   - `vtt-react/src/data/generalSpellsData.js` - Clear GENERAL_SPELLS array
   - `vtt-react/src/data/skillBasedActionsData.js` - Clear SKILL_BASED_ACTIONS array

2. **Class Spells (27 Classes)**
   - `vtt-react/src/data/classSpellTemplates.js` - Clear all class spell arrays
   - `vtt-react/src/data/enhancedSpellLibrary.js` - Clear ENHANCED_SPELL_LIBRARY array
   - `vtt-react/src/data/enhancedPathData.js` - Clear spell arrays in all paths
   - `vtt-react/src/data/enhancedBackgroundData.js` - Clear background ability spells

3. **Sample Spells**
   - `vtt-react/src/data/spellLibraryData.js` - Clear LIBRARY_SPELLS array

### Backup Strategy

Before clearing, create backups:
```bash
cp vtt-react/src/data/generalSpellsData.js vtt-react/src/data/BACKUP_generalSpellsData.js
cp vtt-react/src/data/classSpellTemplates.js vtt-react/src/data/BACKUP_classSpellTemplates.js
# etc.
```

---

## Phase 2: Create Comprehensive Test Spells

### Test Spell Categories

Create test spells that demonstrate EVERY feature of the spell wizard system:

#### 1. Resolution Method Tests (3 spells)

**Test Spell 1: DICE Resolution**
```json
{
  "name": "TEST: Dice Fireball",
  "description": "Tests DICE resolution with advantage, critical hits, and exploding dice",
  "spellType": "ACTION",
  "effectTypes": ["damage"],
  "damageConfig": {
    "formula": "8d6+INT",
    "damageTypes": ["fire"],
    "resolution": "DICE",
    "diceConfig": {
      "advantage": true,
      "explodingDice": true
    },
    "useCriticalEffect": true,
    "criticalConfig": {
      "critThreshold": 18,
      "critMultiplier": 2,
      "critDiceOnly": true,
      "extraDice": "2d6",
      "explodingDice": true
    }
  }
}
```

**Test Spell 2: CARDS Resolution**
```json
{
  "name": "TEST: Card Arcane Gambit",
  "description": "Tests CARDS resolution with poker hand evaluation",
  "spellType": "ACTION",
  "effectTypes": ["damage"],
  "damageConfig": {
    "formula": "CARD_VALUE + (FACE_CARDS * 5) + INT",
    "damageTypes": ["arcane", "force"],
    "resolution": "CARDS",
    "cardConfig": {
      "drawCount": 5,
      "deckType": "STANDARD",
      "critRule": "face_cards"
    }
  }
}
```

**Test Spell 3: COINS Resolution**
```json
{
  "name": "TEST: Coin Fortune Frost",
  "description": "Tests COINS resolution with streak detection",
  "spellType": "ACTION",
  "effectTypes": ["damage"],
  "damageConfig": {
    "formula": "HEADS_COUNT * 8 + (ALL_HEADS ? 15 : 0)",
    "damageTypes": ["cold"],
    "resolution": "COINS",
    "coinConfig": {
      "flipCount": 7,
      "coinType": "STANDARD",
      "critRule": "all_heads"
    }
  }
}
```

#### 2. Effect Type Tests (10 spells - one per effect type)

**Test Spell 4: Damage with Chain Effect**
```json
{
  "name": "TEST: Chain Lightning",
  "effectTypes": ["damage"],
  "damageConfig": {
    "formula": "6d8",
    "damageTypes": ["lightning"],
    "useChainEffect": true,
    "chainConfig": {
      "targets": 5,
      "falloffType": "percentage",
      "falloffRate": 25,
      "minimumDamage": 10
    },
    "savingThrow": "agility",
    "difficultyClass": 16,
    "saveOutcome": "halves"
  }
}
```

**Test Spell 5: Healing with HoT and Shield**
```json
{
  "name": "TEST: Rejuvenation",
  "effectTypes": ["healing"],
  "healingConfig": {
    "formula": "5d8+SPI",
    "healingType": "direct",
    "useAbsorptionShield": true,
    "shieldConfig": {
      "shieldType": "reflective",
      "shieldAmount": "3d6",
      "duration": 5,
      "reflectionType": "magical",
      "reflectionPercentage": 50
    },
    "hasHotEffect": true,
    "hotConfig": {
      "tickFormula": "2d4+SPI",
      "duration": 6,
      "tickFrequency": "end_of_turn"
    },
    "useChainHealing": true,
    "chainConfig": {
      "targets": 4,
      "targetSelection": "lowest_health",
      "falloffType": "percentage",
      "falloffRate": 20
    }
  }
}
```

**Test Spell 6: Buff with Stacking**
```json
{
  "name": "TEST: Progressive Might",
  "effectTypes": ["buff"],
  "buffConfig": {
    "statModifiers": [
      {
        "name": "Strength",
        "magnitude": 3,
        "magnitudeType": "flat"
      },
      {
        "name": "Attack Power",
        "magnitude": 15,
        "magnitudeType": "percentage"
      }
    ],
    "statusEffects": [
      {
        "id": "haste",
        "level": "major"
      }
    ],
    "stackingRule": "progressive",
    "maxStacks": 5,
    "durationType": "rounds",
    "durationValue": 10,
    "concentrationRequired": true
  }
}
```

**Test Spell 7: Debuff with Complex Charm**
```json
{
  "name": "TEST: Dominate Mind",
  "effectTypes": ["debuff"],
  "debuffConfig": {
    "statusEffects": [
      {
        "id": "charmed",
        "level": "extreme",
        "charmType": "dominated",
        "canAttackCharmer": false,
        "canSelfHarm": false,
        "retainsMemory": false,
        "commandComplexity": "any",
        "maxCommands": 10,
        "saveDC": 18,
        "saveType": "wisdom",
        "saveOutcome": "negates",
        "saveTrigger": "harmful",
        "saveFrequency": "end_of_turn"
      }
    ],
    "statPenalties": [
      {
        "name": "Intelligence",
        "magnitude": -4,
        "magnitudeType": "flat"
      }
    ],
    "stackingRule": "replace",
    "durationType": "minutes",
    "durationValue": 10,
    "canBeDispelled": true
  }
}
```

**Test Spell 8: Utility - Teleportation**
```json
{
  "name": "TEST: Dimension Door",
  "effectTypes": ["utility"],
  "utilityConfig": {
    "utilityType": "movement",
    "utilitySubtype": "teleport",
    "selectedEffects": [
      {
        "name": "Teleport",
        "customName": "Dimension Door"
      }
    ],
    "duration": 1,
    "durationUnit": "rounds",
    "difficultyClass": 15,
    "concentration": false
  }
}
```

**Test Spell 9: Control - Gravity Well**
```json
{
  "name": "TEST: Gravity Well",
  "effectTypes": ["control"],
  "controlConfig": {
    "controlType": "pull",
    "strength": "major",
    "duration": 5,
    "savingThrow": "strength",
    "difficultyClass": 17,
    "saveOutcome": "negates"
  }
}
```

**Test Spell 10: Summoning - Elemental**
```json
{
  "name": "TEST: Summon Fire Elemental",
  "effectTypes": ["summoning"],
  "summoningConfig": {
    "summonType": "elemental",
    "creatureType": "fire_elemental",
    "duration": 10,
    "durationUnit": "rounds",
    "controlLevel": "full",
    "maxSummons": 1
  }
}
```

**Test Spell 11: Transformation - Polymorph**
```json
{
  "name": "TEST: Polymorph Beast",
  "effectTypes": ["transformation"],
  "transformationConfig": {
    "transformationType": "animal",
    "targetForm": "bear",
    "duration": 10,
    "durationUnit": "minutes",
    "retainsAbilities": false,
    "savingThrow": "wisdom",
    "difficultyClass": 15
  }
}
```

**Test Spell 12: Purification - Cleanse**
```json
{
  "name": "TEST: Greater Purification",
  "effectTypes": ["purification"],
  "purificationConfig": {
    "purificationType": "cleanse_all",
    "targetEffects": ["poison", "disease", "curse", "magic"],
    "strength": "major"
  }
}
```

**Test Spell 13: Restoration - Revive**
```json
{
  "name": "TEST: Resurrection",
  "effectTypes": ["restoration"],
  "restorationConfig": {
    "restorationType": "resurrection",
    "healthRestored": "full",
    "removesDebuffs": true,
    "castTime": "1 minute"
  }
}
```

#### 3. Spell Type Tests (6 spells)

**Test Spell 14: CHANNELED Spell**
```json
{
  "name": "TEST: Channeled Beam",
  "spellType": "CHANNELED",
  "effectTypes": ["damage"],
  "channelingConfig": {
    "tickFrequency": "per_turn",
    "tickScaling": "INCREASING",
    "breakEffect": "BACKLASH",
    "concentrationDC": 15,
    "perRoundFormulas": {
      "damage": ["2d6", "3d6", "4d6", "5d6", "6d6"]
    }
  }
}
```

**Test Spell 15: PASSIVE Spell**
```json
{
  "name": "TEST: Passive Aura",
  "spellType": "PASSIVE",
  "effectTypes": ["buff"],
  "buffConfig": {
    "statModifiers": [
      {
        "name": "Armor",
        "magnitude": 5,
        "magnitudeType": "flat"
      }
    ],
    "durationType": "permanent"
  }
}
```

**Test Spell 16: REACTION Spell**
```json
{
  "name": "TEST: Counterspell",
  "spellType": "REACTION",
  "effectTypes": ["utility"],
  "triggerConfig": {
    "triggerType": "spell_cast",
    "responseType": "INSTANT"
  }
}
```

**Test Spell 17: TRAP Spell**
```json
{
  "name": "TEST: Explosive Rune",
  "spellType": "TRAP",
  "effectTypes": ["damage"],
  "triggerConfig": {
    "triggerType": "proximity",
    "triggerDistance": 5
  },
  "damageConfig": {
    "formula": "10d6",
    "damageTypes": ["fire", "force"]
  }
}
```

**Test Spell 18: STATE Spell**
```json
{
  "name": "TEST: Invisibility",
  "spellType": "STATE",
  "effectTypes": ["buff"],
  "buffConfig": {
    "statusEffects": [
      {
        "id": "invisible",
        "level": "major"
      }
    ],
    "durationType": "minutes",
    "durationValue": 10,
    "concentrationRequired": true
  }
}
```

#### 4. Targeting Tests (9 spells)

**Test Spell 19: Single Target**
**Test Spell 20: Multi Target**
**Test Spell 21: Area (Circle)**
**Test Spell 22: Area (Cone)**
**Test Spell 23: Area (Line)**
**Test Spell 24: Chain**
**Test Spell 25: Smart Targeting**
**Test Spell 26: Self**
**Test Spell 27: Nearest Enemy**

#### 5. Advanced Mechanics Tests (10 spells)

**Test Spell 28: Rollable Table**
**Test Spell 29: Trigger System**
**Test Spell 30: Progressive Effects**
**Test Spell 31: Chance-on-Hit**
**Test Spell 32: Resource Costs (Multiple)**
**Test Spell 33: Cooldown (Charge-based)**
**Test Spell 34: Cooldown (Dice-based)**
**Test Spell 35: Reagent Requirements**
**Test Spell 36: Multi-Effect Combo**
**Test Spell 37: All Features Combined**

---

## Phase 3: Verification Checklist

### For Each Test Spell, Verify:

- [ ] Spell displays correctly in Spell Wizard preview
- [ ] Spell displays correctly in Spell Library
- [ ] Spell displays correctly in Rules section
- [ ] All effect sections have visible borders
- [ ] Formula formatting is plain English (not technical)
- [ ] Icons display correctly
- [ ] Resource costs display correctly
- [ ] Targeting information displays correctly
- [ ] Duration displays correctly
- [ ] Cooldown displays correctly
- [ ] All special mechanics display correctly

### Formatting Consistency Check:

- [ ] Damage effects format identically across all contexts
- [ ] Healing effects format identically across all contexts
- [ ] Buff effects format identically across all contexts
- [ ] Debuff effects format identically across all contexts
- [ ] Utility effects format identically across all contexts
- [ ] Control effects format identically across all contexts
- [ ] Summoning effects format identically across all contexts
- [ ] Transformation effects format identically across all contexts
- [ ] Purification effects format identically across all contexts
- [ ] Restoration effects format identically across all contexts

---

## Phase 4: Documentation

### Create Test Results Document

Document findings for each test spell:
- Screenshot of spell card
- Notes on formatting issues
- Notes on missing features
- Notes on incorrect displays

---

## Expected Outcome

After this task:
1. ✅ All old spells removed
2. ✅ 37+ comprehensive test spells created
3. ✅ Every spell wizard feature tested
4. ✅ Formatting verified across all contexts
5. ✅ Issues documented for fixing
6. ✅ Clean slate for production spell creation

---

## Files to Create/Update

### New Files:
- `vtt-react/src/data/testSpells.js` - All test spells
- `vtt-react/TEST_SPELL_RESULTS.md` - Test results documentation

### Files to Clear:
- `vtt-react/src/data/generalSpellsData.js`
- `vtt-react/src/data/skillBasedActionsData.js`
- `vtt-react/src/data/classSpellTemplates.js`
- `vtt-react/src/data/enhancedSpellLibrary.js`
- `vtt-react/src/data/spellLibraryData.js`

### Files to Backup:
- All of the above (create BACKUP_ versions)

---

*Ready to start next chat with this task!*

