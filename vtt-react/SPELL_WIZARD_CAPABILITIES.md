# Spell Wizard Capabilities - What We're NOT Using

## 🎯 Overview

The spell wizard is INCREDIBLY powerful but most spells only use 10-20% of its capabilities. This document outlines ALL the features available that spells should be leveraging.

---

## 📊 Wizard Steps & Features

### Step 1: Basic Info
- ✅ Name, Description, Level
- ✅ Icon selection
- ⚠️ **UNDERUSED:** Flavor text, casting descriptions, impact descriptions

### Step 2: Spell Type
Available types:
- ✅ **ACTION** - Standard spell cast
- ⚠️ **REACTION** - Triggered by events (RARELY USED)
- ⚠️ **BONUS_ACTION** - Quick cast (RARELY USED)
- ⚠️ **CHANNELED** - Continuous casting (RARELY USED)
- ⚠️ **PASSIVE** - Always active (RARELY USED)
- ⚠️ **STATE** - Stance/form (RARELY USED)
- ⚠️ **TRAP** - Placed trap (RARELY USED)
- ⚠️ **ZONE** - Persistent area (RARELY USED)

**Current Usage:** 95% of spells are ACTION type only!

### Step 3: Effects
Available effect types:
- ✅ **Damage** - Widely used
- ✅ **Healing** - Widely used
- ✅ **Buff** - Widely used
- ✅ **Debuff** - Widely used
- ⚠️ **Control** - UNDERUSED (stun, root, silence, fear, charm, sleep, polymorph)
- ⚠️ **Utility** - UNDERUSED (teleport, invisibility, detection, dispel)
- ⚠️ **Summoning** - RARELY USED (summon creatures, objects)
- ⚠️ **Transformation** - RARELY USED (polymorph, shapeshift)
- ⚠️ **Purification** - RARELY USED (cleanse, dispel magic)
- ⚠️ **Restoration** - RARELY USED (restore stats, remove conditions)

**Each effect type has extensive configuration:**

#### Damage Config Features
- ✅ Basic damage formula
- ✅ Damage type
- ⚠️ **DOT (Damage Over Time)** - UNDERUSED
- ⚠️ **Splash damage** - RARELY USED
- ⚠️ **Scaling with stats** - UNDERUSED
- ⚠️ **Saving throws** - UNDERUSED
- ⚠️ **Critical hit configuration:**
  - Crit multiplier
  - Extra dice on crit
  - Exploding dice
  - Crit-only effects
  - Card-based crits (face cards, suits)
  - Coin-based crits (all heads, etc.)
- ⚠️ **Chance-on-Hit effects** - RARELY USED
  - Proc chance
  - Proc effects
  - Dice threshold procs
  - Card pattern procs
  - Coin pattern procs

#### Healing Config Features
- ✅ Basic healing formula
- ⚠️ **HOT (Heal Over Time)** - UNDERUSED
- ⚠️ **Overheal as shield** - RARELY USED
- ⚠️ **Area healing** - UNDERUSED
- ⚠️ **Scaling with stats** - UNDERUSED
- ⚠️ **Resurrection** - RARELY USED

#### Buff Config Features
- ✅ Stat modifiers (but often incomplete)
- ✅ Status effects (but often just strings)
- ⚠️ **Progressive buffs** - RARELY USED (buffs that get stronger over time)
- ⚠️ **Stacking rules** - UNDERUSED (replace, stack, refresh)
- ⚠️ **Concentration** - UNDERUSED
- ⚠️ **Dispel resistance** - RARELY USED
- ⚠️ **Detailed buff effects:**
  - Attack bonuses
  - Damage bonuses
  - Resistances
  - Immunities
  - Movement speed
  - Armor class
  - Saving throw bonuses

#### Debuff Config Features
- ✅ Basic stat penalties
- ⚠️ **Saving throws** - UNDERUSED
- ⚠️ **Stacking debuffs** - RARELY USED
- ⚠️ **Progressive debuffs** - RARELY USED
- ⚠️ **Break conditions** - RARELY USED (break on damage, break on movement)
- ⚠️ **Detailed debuff effects:**
  - Movement reduction
  - Attack penalties
  - Conditions (prone, blinded, deafened, etc.)
  - Vulnerability to damage types

#### Control Config Features
- ❌ **ALMOST NEVER USED**
- Control types: stun, root, silence, fear, charm, sleep, polymorph, banish
- Saving throws
- Break on damage
- Diminishing returns

#### Utility Config Features
- ❌ **ALMOST NEVER USED**
- Utility types: teleport, invisibility, detection, dispel, light, darkness, levitate, fly
- Range and duration
- Special effects

#### Summoning Config Features
- ❌ **ALMOST NEVER USED**
- Summon creatures or objects
- Control type (full, limited, independent)
- Inherit stats
- Duration and quantity

#### Transformation Config Features
- ❌ **ALMOST NEVER USED**
- Transform into creatures
- Retain mental stats
- Break conditions
- Duration

### Step 4: Targeting & Propagation
Available targeting types:
- ✅ **Single target** - Widely used
- ⚠️ **AOE** - UNDERUSED
  - Shapes: circle, cone, line, cube, sphere, cylinder
  - Size parameters
  - Friendly fire options
- ⚠️ **Chain** - RARELY USED (lightning chain, etc.)
  - Max targets
  - Chain range
  - Damage reduction per jump
- ⚠️ **Self** - Used but often not configured properly
- ⚠️ **Cone** - RARELY USED
- ⚠️ **Line** - RARELY USED

**Propagation Features (ALMOST NEVER USED):**
- Bounce to nearby targets
- Spread effects
- Chain reactions
- Splash damage

### Step 5: Resources
Available resource types:
- ✅ **Mana** - Widely used
- ⚠️ **Health** - RARELY USED (blood magic)
- ⚠️ **Stamina** - RARELY USED
- ⚠️ **Focus** - RARELY USED
- ⚠️ **Action Points** - UNDERUSED
- ⚠️ **Charges** - RARELY USED

**Components (ALMOST NEVER USED):**
- Verbal components
- Somatic components
- Material components
  - Component name
  - Quantity
  - Consumed or not
  - Gold cost

**Reagents (ALMOST NEVER USED):**
- Specific items required
- Quantity consumed
- Rare reagents

### Step 6: Cooldown
Available cooldown types:
- ✅ **Turn-based** - Widely used
- ⚠️ **Time-based** - UNDERUSED
- ⚠️ **Combat** - UNDERUSED (once per combat)
- ⚠️ **Rest** - UNDERUSED (short rest, long rest)
- ⚠️ **Charges** - RARELY USED
  - Max charges
  - Charge recovery rate
  - Recovery per rest

### Step 7: Mechanics (ALMOST NEVER USED)
**Resolution Types:**
- ✅ **DICE** - Default, widely used
- ❌ **CARDS** - ALMOST NEVER USED
  - Draw cards for effects
  - Suit-based effects
  - Face card bonuses
  - Deck manipulation
- ❌ **COINS** - ALMOST NEVER USED
  - Flip coins for effects
  - Heads/tails patterns
  - Multiple coin flips
  - Probability-based outcomes

**Rollable Tables (ALMOST NEVER USED):**
- Random effect tables
- Wild magic effects
- Chaos effects
- Variable outcomes
- Can reference other spells
- Can modify base spell

**Combo Systems (NEVER USED):**
- Spell combos
- Sequence requirements
- Combo bonuses

**State Requirements (RARELY USED):**
- Health thresholds
- Mana thresholds
- Buff/debuff requirements
- Position requirements

### Step 8: Triggers (ALMOST NEVER USED)
Available trigger types:
- ❌ **On Hit** - RARELY USED
- ❌ **On Crit** - RARELY USED
- ❌ **On Dodge** - NEVER USED
- ❌ **On Block** - NEVER USED
- ❌ **On Damage Taken** - RARELY USED
- ❌ **On Damage Dealt** - RARELY USED
- ❌ **At High Health** - NEVER USED
- ❌ **At Low Health** - RARELY USED
- ❌ **On Buff Gained** - NEVER USED
- ❌ **On Debuff Gained** - NEVER USED
- ❌ **On CC Break** - NEVER USED
- ❌ **On Movement** - NEVER USED
- ❌ **On Jump** - NEVER USED
- ❌ **On Death** - NEVER USED
- ❌ **On Kill** - NEVER USED

**Trigger Configuration:**
- Trigger chance (%)
- Trigger conditions
- Cooldown between procs
- Max procs per duration

### Step 9: Channeling (RARELY USED)
- Channel duration
- Tick rate
- Interruptible
- Movement allowed
- Effect per tick

### Step 10: Trap Placement (NEVER USED)
- Trigger type (proximity, tripwire, pressure plate)
- Trigger radius
- Duration
- Stealth DC
- Disarm DC
- Trap effects

---

## 🎨 Visual & Flavor (UNDERUSED)

Available but rarely used:
- **Flavor text** - Thematic description
- **Casting description** - What happens when you cast
- **Effect description** - What the effect looks like
- **Impact description** - What happens on impact
- **Visual theme** - fire, ice, lightning, holy, shadow, nature, arcane, etc.

---

## 📋 What This Means for Spell Data

### Current State
Most spells look like this:
```javascript
{
  name: 'Fireball',
  damageConfig: { formula: '3d6' },
  targetingConfig: { range: 60 },
  resourceCost: { mana: 25 }
}
```

### What They SHOULD Look Like
```javascript
{
  name: 'Fireball',
  description: 'A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame.',
  flavorText: 'The archmage\'s signature spell, feared across the realm',
  
  spellType: 'ACTION',
  effectTypes: ['damage'],
  damageTypes: ['fire'],
  
  damageConfig: {
    formula: '8d6',
    elementType: 'fire',
    scaling: 'intelligence',
    savingThrow: {
      enabled: true,
      attribute: 'dexterity',
      difficulty: 15,
      onSuccess: 'half_damage'
    },
    criticalConfig: {
      enabled: true,
      critMultiplier: 2,
      explodingDice: true,
      critEffects: ['burning']
    }
  },
  
  targetingConfig: {
    targetingType: 'aoe',
    aoeType: 'sphere',
    aoeSize: 20,
    range: 150,
    validTargets: ['enemy', 'ally', 'object'],
    requiresLoS: true
  },
  
  resourceCost: {
    mana: { baseAmount: 35, scalingAmount: 5 },
    actionPoints: 3
  },
  
  components: {
    verbal: true,
    somatic: true,
    material: true,
    materials: 'A tiny ball of bat guano and sulfur',
    consumed: false
  },
  
  durationConfig: {
    durationType: 'instant'
  },
  
  cooldownConfig: {
    type: 'turn_based',
    value: 3
  },
  
  visualTheme: 'fire',
  castingDescription: 'You speak words of power while forming a small sphere of flame in your palm',
  effectDescription: 'The sphere streaks toward the target point, leaving a trail of sparks',
  impactDescription: 'The sphere explodes in a massive fireball, engulfing everything in the area'
}
```

---

## 🚀 Recommendations

### High Priority - Add to Most Spells
1. **Proper descriptions** that match mechanics
2. **Saving throws** for damage/debuff spells
3. **Critical hit configuration** for damage spells
4. **Scaling with stats** for damage/healing
5. **Complete targeting configs** with proper AOE
6. **Action point costs**
7. **Visual themes and flavor text**

### Medium Priority - Add to Appropriate Spells
1. **DOT/HOT effects** for damage/healing over time
2. **Triggers** for reactive spells
3. **Charges** for limited-use spells
4. **Components/reagents** for thematic spells
5. **Progressive buffs/debuffs**
6. **Stacking rules**

### Low Priority - Special Spells
1. **Rollable tables** for wild magic/chaos spells
2. **Card/coin mechanics** for unique spells
3. **Summoning** for summoner spells
4. **Transformation** for polymorph spells
5. **Control effects** for CC spells
6. **Trap placement** for trap spells
7. **Channeling** for channeled spells

---

## 📊 Usage Statistics (Estimated)

| Feature | Current Usage | Should Be |
|---------|--------------|-----------|
| Basic damage/healing | 90% | 90% |
| Stat modifiers | 60% | 90% |
| Status effects | 50% | 80% |
| Damage types | 40% | 100% |
| Saving throws | 10% | 60% |
| Critical config | 5% | 70% |
| DOT/HOT | 15% | 40% |
| Scaling | 10% | 80% |
| Proper targeting | 30% | 100% |
| Action points | 20% | 90% |
| Components | 1% | 30% |
| Triggers | 1% | 20% |
| Rollable tables | 0% | 5% |
| Card/coin mechanics | 0% | 2% |
| Control effects | 2% | 15% |
| Summoning | 0% | 5% |
| Transformation | 0% | 3% |
| Channeling | 0% | 5% |
| Traps | 0% | 3% |

**Overall:** We're using about **15-20%** of the spell wizard's capabilities!

---

## ✅ Next Steps

When auditing spells, check for:
1. ❌ Missing damage types
2. ❌ Incomplete stat modifiers
3. ❌ String-based status effects
4. ❌ Generic descriptions
5. ❌ Missing saving throws
6. ❌ No critical configuration
7. ❌ No scaling
8. ❌ Incomplete targeting
9. ❌ Missing action points
10. ❌ No visual themes
11. ❌ No components/reagents
12. ❌ No triggers (where appropriate)
13. ❌ Underutilized effect types

This will make spells MUCH more interesting and mechanically rich!

