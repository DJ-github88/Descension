# Complete Spell Wizard Features Catalog

## 🎯 Overview
This document catalogs EVERY feature available in the spell wizard that should be showcased in example spells.

---

## 📋 Spell Types

1. **ACTION** - Standard cast-time spells
2. **CHANNELED** - Sustained concentration spells
3. **REACTION** - Triggered by events
4. **PASSIVE** - Always active
5. **TRAP** - Placed and triggered
6. **STATE** - Persistent state-based effects

---

## 🔥 Damage Types (Element Types)

- fire
- cold / ice
- lightning
- acid
- necrotic
- radiant
- force
- psychic
- poison
- thunder / sonic
- bludgeoning
- piercing
- slashing
- shadow
- chaos
- temporal / time
- arcane
- nature
- holy

---

## 🎲 Resolution Types

- **DICE** - D20 system rolls
- **CARDS** - Card-based resolution
- **COINS** - Coin flip resolution

---

## 🎯 Targeting Types

### Single Target
- `targetingType: 'single'`
- Range in feet
- Requires line of sight

### Area of Effect (AOE)
- `targetingType: 'aoe'`
- **AOE Shapes:**
  - `sphere` - Circular blast
  - `cone` - Cone emanation
  - `line` - Straight line
  - `cube` - Cubic area
  - `cylinder` - Cylindrical area
  - `wall` - Wall formation

### Special Targeting
- `self` - Caster only
- `ground` - Target location
- `special` - Custom targeting

### Valid Targets
- `enemy`
- `ally`
- `self`
- `object`
- `empty_space`
- `any`

---

## 💥 Effect Types

### 1. Damage Effects
**Features:**
- Direct damage formulas (e.g., `3d6 + 4`)
- DOT (Damage Over Time)
  - `dotFormula`, `dotDuration`, `dotTickType`, `dotApplication`
- Saving throws
  - `attribute`, `difficulty`, `onSuccess`, `onFailure`
- Critical hit configuration
  - `critType`, `critMultiplier`, `critDiceOnly`, `extraDice`, `explodingDice`
- Chance-on-hit procs (`chanceOnHitConfig`)
- Multiple damage types
- Scaling with stats

### 2. Healing Effects
**Features:**
- Direct healing formulas
- HOT (Healing Over Time)
  - `hotFormula`, `hotDuration`, `hotTickType`, `hotApplication`
- Overheal shields
- Critical healing
- Target restrictions

### 3. Buff Effects
**Features:**
- Stat bonuses array
  - `{ stat: 'intelligence', amount: 4, type: 'flat' }`
  - `{ stat: 'strength', amount: 10, type: 'percentage' }`
- Multiple buffs in array
- Duration and stacking rules
- Buff names and descriptions
- Damage reduction
- Movement speed bonuses
- Attack speed bonuses

### 4. Debuff Effects
**Features:**
- Stat penalties
- Status conditions
- Duration
- Dispellable flag
- Saving throws
- Stacking rules

### 5. Control Effects
**Features:**
- Control types: stun, root, silence, fear, charm, sleep, polymorph, banish
- Duration
- Saving throws
- Break on damage
- Diminishing returns

### 6. Utility Effects
**Features:**
- Utility types: teleport, invisibility, detection, dispel, light, darkness, levitate, fly
- Range and duration
- Special effects

### 7. Summoning Effects
**Features:**
- Creature selection (multiple)
- Duration and concentration
- Quantity and max quantity
- Control range and type
- Summon stats (HP, AC, attacks, abilities)
- Movement speed
- Intelligence level
- Wait for trigger option

### 8. Transformation Effects
**Features:**
- Transform types: beast_form, elemental_form, object_form
- Form selection
- Duration and concentration
- Maintain equipment option
- Difficulty class and save type
- Granted abilities
- Stat inheritance

### 9. Purification Effects
**Features:**
- Remove conditions
- Cleanse effects
- Dispel magic

### 10. Restoration Effects
**Features:**
- Restore resources
- Remove exhaustion
- Cure diseases

---

## 🎲 Rollable Tables

**Features:**
- Enable/disable toggle
- Name and description
- Resolution type (DICE, CARDS, COINS)
- Resolution config (dice type, card count, coin count)
- Table entries with:
  - Range (e.g., 1-20, 21-40)
  - Effect name
  - Effect description
  - Effect type
  - Effect details

**Example Use Cases:**
- Wild Magic Surge tables
- Random summon tables
- Variable damage tables
- Random buff/debuff tables

---

## ⚡ Trigger Configuration

**Global Triggers:**
- Logic type: AND / OR
- Compound triggers array

**Trigger Types:**
- `on_hit` - When attack hits
- `on_crit` - On critical hit
- `on_miss` - When attack misses
- `on_damage_taken` - When taking damage
- `on_damage_dealt` - When dealing damage
- `on_heal_received` - When healed
- `on_heal_cast` - When casting heal
- `on_kill` - When killing enemy
- `on_death` - When dying
- `health_below_threshold` - Health percentage
- `mana_below_threshold` - Mana percentage
- `enemy_in_range` - Proximity trigger
- `ally_in_range` - Ally proximity
- `combat_start` - Combat begins
- `combat_end` - Combat ends
- `turn_start` - Turn begins
- `turn_end` - Turn ends

**Trigger Parameters:**
- Trigger chance (percentage)
- Cooldown
- Max procs
- Proc duration window

**Effect-Specific Triggers:**
- Different triggers per effect
- Targeting overrides
- Conditional formulas

---

## 💰 Resource Costs

**Resource Types:**
- Mana
- Health
- Stamina
- Focus
- Rage
- Energy
- Runic Power
- Action Points

**Features:**
- Base amount
- Scaling amount
- Formula-based costs
- Multiple resource types
- Material components
  - Verbal, Somatic, Material flags
  - Material description
  - Consumed flag

---

## ⏱️ Duration Configuration

**Duration Types:**
- `instant` - No duration
- `duration` - Timed duration
- `permanent` - Lasts forever
- `channeled` - While channeling
- `concentration` - Requires concentration

**Duration Units:**
- seconds
- rounds
- minutes
- hours
- days

---

## 🔄 Cooldown Configuration

**Cooldown Types:**
- `turn_based` - Rounds/turns
- `time_based` - Real-time seconds
- `charge_based` - Multiple charges

**Features:**
- Cooldown value
- Charges
- Shared cooldown groups

---

## 🎴 Class Mechanics

### Card Mechanics
- Card requirements
- Card consumption
- Card effects

### Combo Mechanics
- Combo points
- Combo finishers
- Combo builders

### Coin Mechanics
- Coin flips
- Heads/tails effects
- Multiple coins

### State Requirements
- Health thresholds
- Resource thresholds
- Buff/debuff requirements

---

## 🔗 Proc Effects (Chance-on-Hit)

**Features:**
- Proc type (dice, cards, coins)
- Proc chance percentage
- Dice threshold
- Card proc rules
- Coin proc rules
- Spell effect selection
- Rollable table integration
- Effect types: damage, healing, buff, debuff, control, immunity
- Custom effects array

---

## 🎨 Visual & Flavor

**Features:**
- Visual theme
- Casting description
- Effect description
- Impact description
- Flavor text
- Icon selection

---

## 📊 Advanced Features

### Propagation
- Chain effects
- Bounce mechanics
- Spread patterns

### Persistent Effects
- Auras
- Fields
- Zones

### Combined Effects
- Multiple effects in one spell
- Effect interactions
- Synergies

### Conditional Effects
- Conditional activation
- Default enabled/disabled
- Conditional formulas per trigger

---

## ✅ Features Currently UNDERUSED

1. ❌ **Rollable Tables** - Wild magic, random effects
2. ❌ **Summoning** - Creature summoning
3. ❌ **Transformation** - Polymorph, shapeshift
4. ❌ **Material Components** - Reagents, consumed items
5. ❌ **Proc Effects** - Chance-on-hit mechanics
6. ❌ **Trigger System** - REACTION/PASSIVE spells
7. ❌ **Multiple Resource Costs** - Health + Mana, etc.
8. ❌ **Card/Coin Resolution** - Alternative to dice
9. ❌ **Combo Mechanics** - Combo points
10. ❌ **State-based Spells** - Persistent states
11. ❌ **Trap Spells** - Placed traps
12. ❌ **Propagation** - Chain/bounce effects
13. ❌ **Control Effects** - Stun, root, fear, etc.
14. ❌ **Utility Effects** - Teleport, invisibility, etc.
15. ❌ **AOE Variety** - Cone, line, cube, cylinder, wall
16. ❌ **Damage Type Variety** - Chaos, temporal, psychic, etc.

---

## 🎯 Next Steps

Create example spells that showcase EACH of these features to demonstrate the full capabilities of the spell wizard!

