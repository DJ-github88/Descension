# Spell Wizard System - Complete Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Resolution Methods](#resolution-methods)
3. [Effect Types](#effect-types)
4. [Spell Card Formatting](#spell-card-formatting)
5. [Configuration to Display Mapping](#configuration-to-display-mapping)
6. [Status Effects](#status-effects)
7. [Mechanics Systems](#mechanics-systems)

---

## System Overview

The Spell Wizard is a comprehensive spell creation system with **20,000+ lines of code** supporting:

- **10 Effect Types**: damage, healing, buff, debuff, utility, control, summoning, transformation, purification, restoration
- **6 Spell Types**: ACTION, CHANNELED, PASSIVE, REACTION, TRAP, STATE
- **3 Resolution Methods**: DICE (D&D style), CARDS (poker mechanics), COINS (flip mechanics)
- **98 Wizard Action Types** for state management
- **40+ Trigger Types** across 8 categories
- **30+ Utility Subtypes** across 8 main types

---

## Resolution Methods

### 1. DICE Resolution (diceSystem.js - 2,039 lines)

**Dice Notation Parsing:**
- Basic: `XdY+Z` (e.g., `2d6+3`)
- Keep Highest: `XdYkZ` (e.g., `4d6k3` - roll 4d6, keep highest 3)
- Complex Expressions: `(2d6+3)*2` with operators and parentheses

**Special Mechanics:**
- **Advantage/Disadvantage**: Roll twice, take higher/lower
- **Exploding Dice**: Reroll max values and add
- **Critical Hits**: Configurable threshold and multiplier
  - `critDiceOnly`: Only multiply dice, not modifiers
  - `extraDice`: Add extra dice on crits (e.g., `1d6`)

**Statistical Functions:**
- `getMinRoll()`, `getMaxRoll()`, `getAverageRoll()`
- `getProbabilityDistribution()` - Monte Carlo simulation for complex expressions
- `getDiceVisualizationData()` - For probability charts

**Spell Card Display:**
```javascript
// Configuration
damageConfig: {
  formula: "2d6+INT",
  resolution: "DICE",
  criticalConfig: {
    critThreshold: 20,
    critMultiplier: 2,
    critDiceOnly: true,
    extraDice: "1d6"
  }
}

// Displays as:
"2d6 + Intelligence modifier Fire damage"
"Critical: 4d6 + 1d6 + Intelligence modifier"
```

### 2. CARDS Resolution (cardSystem.js - 2,203 lines)

**Deck Types:**
- Standard (52 cards)
- Standard with Jokers (54 cards)
- Tarot (78 cards: 22 major arcana + 56 minor arcana)
- Major Arcana only (22 cards)
- Minor Arcana only (56 cards)

**Hand Evaluation (Poker-style):**
- Royal Flush, Straight Flush, Four of a Kind, Full House
- Flush, Straight, Three of a Kind, Two Pair, One Pair, High Card

**Suit Properties:**
- Hearts (♥): Water element, Restoration quality
- Diamonds (♦): Fire element, Enhancement quality
- Clubs (♣): Earth element, Protection quality
- Spades (♠): Air element, Disruption quality

**Spell Card Display:**
```javascript
// Configuration
damageConfig: {
  formula: "CARD_VALUE + (FACE_CARDS * 5) + INT",
  resolution: "CARDS",
  cardConfig: {
    drawCount: 4,
    deckType: "STANDARD",
    critRule: "face_cards"
  }
}

// Displays as:
"Draw 4 cards: card values + face cards × 5 + Intelligence modifier"
```

### 3. COINS Resolution (coinSystem.js - 513 lines)

**Coin Types:**
- Standard (50/50)
- Weighted (customizable probability)
- Multi-faced (6 sides like a die)
- Conditional (probability changes based on game state)
- Linked (multiple coins with relationships)

**Pattern Detection:**
- Streaks (consecutive same outcomes)
- Alternating patterns
- All same, majority rules

**Gambler Mechanics:**
- Lucky Streak: Bonus after 3+ consecutive wins
- Double-or-Nothing: Risk current value for 2x
- House Favor: Luck stat modifies probabilities
- Loaded Coin: Bias towards specific outcome

**Spell Card Display:**
```javascript
// Configuration
damageConfig: {
  formula: "HEADS_COUNT * 8 + (ALL_HEADS ? 15 : 0)",
  resolution: "COINS",
  coinConfig: {
    flipCount: 5,
    coinType: "STANDARD",
    critRule: "all_heads"
  }
}

// Displays as:
"Flip 5 coins: 8 damage per heads (bonus 15 if all heads)"
```

---

## Effect Types

### 1. Damage Effects (DamageEffects.jsx)

**Configuration Structure:**
```javascript
damageConfig: {
  formula: "2d6+INT",              // Damage formula
  damageTypes: ["fire", "radiant"], // Array of damage types
  resolution: "DICE",               // DICE, CARDS, or COINS
  
  // Critical Hit Configuration
  useCriticalEffect: true,
  criticalConfig: {
    critThreshold: 20,
    critMultiplier: 2,
    critDiceOnly: true,
    extraDice: "1d6",
    explodingDice: true,
    explodingDiceType: "reroll_add" // or "double_value", "add_max"
  },
  
  // Chain Effect Configuration
  useChainEffect: true,
  chainConfig: {
    targets: 3,
    falloffType: "percentage",  // or "fixed", "dice"
    falloffRate: 25,            // 25% reduction per target
    minimumDamage: 5
  },
  
  // Saving Throw
  savingThrow: "agility",
  difficultyClass: 15,
  saveOutcome: "halves"  // or "negates", "none"
}
```

**Spell Card Formatting:**
- **Basic**: `"2d6 + Intelligence modifier Fire damage"`
- **Multi-type**: `"2d6 Fire & Radiant damage"`
- **With Save**: `"2d6 Fire damage (Agility save DC 15 halves)"`
- **Chain**: `"2d6 Fire damage, chains to 3 targets (25% reduction per target)"`
- **Critical**: `"Critical: 4d6 + 1d6 Fire damage"`

### 2. Healing Effects (HealingEffects.jsx)

**Configuration Structure:**
```javascript
healingConfig: {
  formula: "3d8+SPI",
  healingType: "direct",  // direct, regeneration, vampiric, conditional, resurrection, spirit
  resolution: "DICE",
  
  // Absorption Shield
  useAbsorptionShield: true,
  shieldConfig: {
    shieldType: "standard",  // standard, reactive, reflective, adaptive, temporary, permanent, scaling, conditional
    shieldAmount: "2d6",
    duration: 3,
    reflectionType: "physical",  // physical, magical, elemental, all
    reflectionPercentage: 50
  },
  
  // Healing over Time (HoT)
  hasHotEffect: true,
  hotConfig: {
    tickFormula: "1d4+SPI",
    duration: 3,
    tickFrequency: "end_of_turn"
  },
  
  // Chain Healing
  useChainHealing: true,
  chainConfig: {
    targets: 3,
    targetSelection: "lowest_health",  // lowest_health, random, nearest
    falloffType: "percentage",
    falloffRate: 20
  }
}
```

**Spell Card Formatting:**
- **Basic**: `"3d8 + Spirit modifier healing"`
- **With Shield**: `"3d8 healing + 2d6 absorption shield for 3 rounds"`
- **HoT**: `"3d8 healing + 1d4 per turn for 3 rounds"`
- **Chain**: `"3d8 healing, chains to 3 lowest health allies (20% reduction)"`

### 3. Buff Effects (BuffEffects.jsx)

**Configuration Structure:**
```javascript
buffConfig: {
  statModifiers: [
    {
      name: "Strength",
      magnitude: 2,
      magnitudeType: "flat",  // flat or percentage
      duration: 5,
      durationUnit: "rounds"
    }
  ],
  
  statusEffects: [
    {
      id: "haste",
      level: "moderate",  // minor, moderate, major, severe, extreme
      duration: 3
    }
  ],
  
  // Stacking Rules
  stackingRule: "replace",  // replace, selfStacking, cumulative, progressive, diminishing
  maxStacks: 3,
  
  // Duration
  durationType: "rounds",  // rounds, turns, minutes, hours, rest, permanent
  durationValue: 5,
  concentrationRequired: false
}
```

**Spell Card Formatting:**
- **Stat Buff**: `"Strength Boost: +2 Strength for 5 rounds"`
- **Status**: `"Haste for 3 rounds"`
- **Stacking**: `"Self-stacking (max 3 stacks)"`
- **Concentration**: `"Requires Concentration"`

### 4. Debuff Effects (DebuffEffects.jsx)

**Configuration Structure:**
```javascript
debuffConfig: {
  statPenalties: [
    {
      name: "Agility",
      magnitude: -2,
      magnitudeType: "flat"
    }
  ],
  
  statusEffects: [
    {
      id: "charmed",
      level: "moderate",
      charmType: "friendly",  // friendly, dominated, infatuated
      canAttackCharmer: false,
      canSelfHarm: false,
      retainsMemory: true,
      commandComplexity: "moderate",  // simple, moderate, complex, any
      maxCommands: 3,
      
      // Save Configuration
      saveDC: 15,
      saveType: "wisdom",
      saveOutcome: "negates",  // negates, halves_duration, ends_early, partial_immunity, reduces_level
      saveTrigger: "harmful",  // none, harmful, turn, damage
      saveFrequency: "end_of_turn"  // initial, end_of_turn, when_damaged, out_of_sight, ally_help
    }
  ],
  
  // Saving Throw
  savingThrow: "wisdom",
  difficultyClass: 15,
  saveOutcome: "negates",
  
  // Duration
  durationType: "rounds",
  durationValue: 3,
  canBeDispelled: true
}
```

**Spell Card Formatting:**
- **Stat Penalty**: `"Agility: -2 Agility decrease"`
- **Charmed (Complex)**: `"Charmed (friendly) - target regards you as a friend but maintains free will (cannot attack charmer, cannot be commanded to self-harm, retains memory of actions) - moderate complexity commands (max 3 commands) - Wisdom save DC 15 (negated on save), save when given harmful command"`
- **Duration**: `"Duration: 3 rounds"`
- **Dispellable**: `"Can be dispelled"`

### 5. Utility Effects (UtilityEffects.jsx)

**8 Main Types with 30+ Subtypes:**

**Movement Utilities:**
- Teleport, Flight, Speed, Phasing, Wall Walking

**Control Utilities:**
- Pull, Push, Barrier, Gravity

**Environment Utilities:**
- Terrain, Hazard, Light, Weather

**Illusion Utilities:**
- Visual, Sound, Complex, Disguise

**Transformation Utilities:**
- Animal, Element, Size, Object, Phaseshift

**Divination Utilities:**
- Detection, Scrying, Identification, Prediction, Truesight

**Conjuration Utilities:**
- Creature, Object, Element, Portal

**Enchantment Utilities:**
- Weapon, Armor, Item, Sentience

**Spell Card Formatting:**
- **Simple**: `"Teleport for 3 rounds"`
- **With DC**: `"Flight (DC 15)"`
- **With Save**: `"Barrier (Strength Save)"`

---

## Spell Card Formatting

### UnifiedSpellCard.jsx (8,441 lines)

**Main Formatting Function: `formatSpellEffectsForReview.js`**

This is the **CRITICAL** file that transforms spell configurations into display text.

**Key Functions:**

1. **`formatDamageEffects(spell)`** - Lines 14-111
   - Handles DICE, CARDS, COINS resolution
   - Formats damage types with capitalization
   - Adds DoT effects
   - Returns array of formatted strings

2. **`formatHealingEffects(spell)`** - Lines 118-196
   - Handles healing formulas
   - Formats HoT effects
   - Formats shields
   - Returns array of formatted strings

3. **`formatBuffEffects(spell)`** - Lines 203-233
   - Formats stat modifiers
   - Formats duration
   - Returns array of formatted strings

4. **`formatDebuffEffects(spell)`** - Lines 240-481
   - **MOST COMPLEX** - handles charmed effects with extensive configuration
   - Formats stat penalties
   - Formats status effects with save information
   - Formats duration, stacking, dispellable info
   - Returns array of formatted strings

5. **`formatUtilityEffects(spell)`** - Lines 488-571
   - Handles effects array and selectedEffects array
   - Formats duration
   - Adds DC and concentration info
   - Returns array of formatted strings

**Formula Formatting: `SpellCardUtils.js`**

`formatFormulaToPlainEnglish(formula, type)` - Converts technical formulas to readable text:
- `"2d6+INT"` → `"2d6 + Intelligence modifier"`
- `"HEADS_COUNT * 8"` → `"8 damage per heads"`
- `"CARD_VALUE + FACE_CARDS * 5"` → `"card values + face cards × 5"`

---

## Configuration to Display Mapping

### Complete Flow:

```
Spell Wizard State (spellWizardContext.js)
    ↓
Effect Configuration (e.g., damageConfig, healingConfig)
    ↓
formatSpellEffectsForReview.js
    ↓
UnifiedSpellCard.jsx
    ↓
Spell Library Display
```

### Example: Damage Spell

**Wizard Configuration:**
```javascript
{
  name: "Fireball",
  effectTypes: ["damage"],
  damageConfig: {
    formula: "8d6",
    damageTypes: ["fire"],
    resolution: "DICE",
    useCriticalEffect: true,
    criticalConfig: {
      critThreshold: 20,
      critMultiplier: 2,
      critDiceOnly: true
    }
  },
  targetingConfig: {
    targetingType: "area",
    areaShape: "sphere",
    areaSize: 20
  },
  durationConfig: {
    durationType: "instant"
  }
}
```

**Formatted Display:**
```
Name: Fireball
Effects:
  • 8d6 Fire damage
  • Critical: 16d6 Fire damage
Range: 20 ft sphere
Duration: Instant
```

### Example: Complex Debuff

**Wizard Configuration:**
```javascript
{
  name: "Dominate Person",
  effectTypes: ["debuff"],
  debuffConfig: {
    statusEffects: [
      {
        id: "charmed",
        charmType: "dominated",
        canAttackCharmer: false,
        canSelfHarm: false,
        retainsMemory: false,
        commandComplexity: "any",
        saveDC: 17,
        saveType: "wisdom",
        saveOutcome: "negates",
        saveTrigger: "harmful",
        saveFrequency: "end_of_turn"
      }
    ],
    durationType: "minutes",
    durationValue: 10,
    concentrationRequired: true
  }
}
```

**Formatted Display:**
```
Name: Dominate Person
Effects:
  • Charmed (dominated) - target must obey your commands without question 
    (cannot attack charmer, cannot be commanded to self-harm) - any commands allowed
    - Wisdom save DC 17 (negated on save), save when given harmful command, save each turn
Duration: 10 minutes
Requires Concentration
```

---

## Status Effects

### Positive Status Effects (11 types)
- inspired, blessed, regeneration, invisible, haste, resistance, flying, truesight, energized, shielded, empowered

### Negative Status Effects (7 types)
- blinded, charmed, frightened, paralyzed, poisoned, restrained, silenced

### Combat Advantages (9 types)
- attackers_advantage_buff, attackers_disadvantage, advantage_attack, critical_improved, damage_bonus, extra_action, damage_resistance, saving_throw_advantage, lifesteal

### Combat Disadvantages (8 types)
- attackers_advantage, disadvantage_attack, disadvantage_save, damage_vulnerability, reduced_speed, reduced_armor, stat_reduction, action_point_drain

---

## Mechanics Systems

### Channeling System (channelingSystem.js - 1,422 lines)

**Tick Scaling Types:**
- CONSISTENT: Same effect every tick
- INCREASING: `base * (1 + (tick * 0.2))`
- DECREASING: `base * (1 - (tick * 0.15))`
- FLUCTUATING: `base * (1 + Math.sin(tick / maxTicks * Math.PI) * 0.5)`
- FRONTLOADED: `base * (1.5 - (tick / maxTicks))`
- BACKLOADED: `base * (0.7 + (tick / maxTicks))`

**Break Effect Types:**
- NONE: Channel ends with no effects
- PARTIAL: Effect based on duration so far
- BACKLASH: Negative effects on caster
- CONTROLLABLE: Caster controls end effect

### Trigger System (triggerSystem.js - 1,726 lines)

**8 Trigger Categories:**
1. Proximity Triggers
2. Status Triggers
3. Combat Triggers
4. Resource Triggers
5. Turn-Based Triggers
6. Movement Triggers
7. Spell-Based Triggers
8. Class-Specific Triggers

**Composite Logic:**
- AND, OR, NOT, XOR, IF_THEN, COMPLEX

**Response Types:**
- INSTANT: Immediate activation
- DELAYED: Activation after delay
- PERSISTENT: Repeated activation

### Balance Calculator (balanceCalculator.js - 4,380 lines)

**Damage Metrics:**
- DPS (Damage Per Second)
- Burst Damage
- Sustained Damage
- Area Efficiency
- Penetration

**Healing Metrics:**
- HPS (Healing Per Second)
- Burst Healing
- Sustained Healing
- Overhealing Risk
- Group Efficiency

**Control Metrics:**
- Control Duration
- Control Strength
- Control Reliability

---

*This documentation continues in SPELL_WIZARD_JSON_SCHEMA.md*

