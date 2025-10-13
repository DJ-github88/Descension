# Spell Wizard Complete Guide

## Overview

This is the **COMPLETE REFERENCE GUIDE** for the Spell Crafting Wizard system. This document maps every single configuration option in the wizard to how it appears on the final spell card.

The spell wizard is a comprehensive 10+ step system that allows creation of spells with incredible depth and complexity. This guide documents:
- Every wizard step and its configuration options
- How each configuration maps to spell card display
- Complete JSON schema for spell objects
- AI-assisted spell creation templates

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Data Flow](#data-flow)
3. [Wizard Steps Overview](#wizard-steps-overview)
4. [Resolution Types](#resolution-types)
5. [Complete Configuration Reference](#complete-configuration-reference)
6. [JSON Schema](#json-schema)
7. [AI Template](#ai-template)

---

## System Architecture

### Core Components

**UnifiedSpellCard.jsx** (8,441 lines)
- The MASTER rendering component for all spell cards
- Handles 6 variants: 'spellbook', 'library', 'collection', 'wizard', 'compact', 'preview'
- Contains ALL formatting logic for displaying spell configurations

**Wizard Steps:**
- Step 1: Basic Info (352 lines) - Name, description, damage types, icons, tags
- Step 2: Spell Type (734 lines) - ACTION, CHANNELED, PASSIVE, REACTION, TRAP, STATE, ZONE
- Step 3: Effects (687 lines) - Damage, healing, buff, debuff, control, utility, summoning, transformation, purification, restoration
- Step 4: Targeting (3,679 lines) - Targeting types, AOE shapes, range, propagation
- Step 5: Resources (546 lines) - Resource costs, formulas, spell components
- Step 6: Cooldown (315 lines) - Cooldown types and configurations
- Step 7: Mechanics - Resolution types (DICE, CARDS, COINS), critical hits, procs
- Step 7: Triggers (5,731 lines) - 50+ trigger types with compound logic
- Step 8: Channeling (3,322 lines) - Channeling configurations and per-round formulas
- Step 9: Balance - Balance calculations
- Step 10: Review - Final review and spell card preview
- Rollable Tables - Random effect tables
- Trap Placement - Trap-specific mechanics

### Data Flow

```
Wizard Steps → Spell State Object → spellCardTransformer.js → UnifiedSpellCard.jsx → Rendered Spell Card
```

1. **User configures spell in wizard steps**
2. **State is stored in wizard context** (`state` object with properties like `damageConfig`, `healingConfig`, etc.)
3. **spellCardTransformer.js transforms data** to card-compatible format
4. **UnifiedSpellCard.jsx renders** the final spell card using formatting functions

---

## Wizard Steps Overview

### Step 1: Basic Info

**Purpose:** Define spell identity and classification

**Configurations:**
- `name` (string) - Spell name
- `description` (string) - Spell description
- `typeConfig.school` (string) - Primary damage type/element
- `typeConfig.secondaryElement` (string) - Secondary damage type
- `typeConfig.icon` (string) - Spell icon ID
- `typeConfig.tags` (array) - Spell tags

**Damage Type Options:**
- **Physical:** bludgeoning, piercing, slashing
- **Elemental:** fire, cold, lightning, acid, thunder
- **Arcane:** force, psychic, radiant, arcane
- **Otherworldly:** necrotic, poison, void, shadow, nature

**Tag Options:**
attack, healing, buff, debuff, control, summoning, utility, aoe, single-target, dot, hot, mobility, defensive, stealth, ritual, concentration

**Spell Card Display:**
- Name appears in card header
- Description appears in card body
- Icon appears in card header
- Tags appear as badges at bottom of card
- Damage types determine visual theming and effect colors

---

### Step 2: Spell Type

**Purpose:** Define how the spell is cast and activated

**Spell Types:**

#### ACTION
Standard cast-time spells

**Configurations:**
- `spellType: 'ACTION'`
- `typeConfig.castTime` (number) - Cast time value
- `typeConfig.castTimeType` (string) - 'IMMEDIATE', 'START_OF_TURN', 'END_OF_TURN'

**Spell Card Display:**
```
Cast Time: [castTime] [castTimeType]
Example: "Cast Time: 1 Action (Immediate)"
```

#### CHANNELED
Sustained spells with per-round effects

**Configurations:**
- `spellType: 'CHANNELED'`
- `typeConfig.maxChannelDuration` (number) - Maximum channel duration
- `typeConfig.durationUnit` (string) - 'TURNS', 'ROUNDS'
- `typeConfig.tickFrequency` (string) - How often effects trigger
- `typeConfig.concentrationDC` (number) - Concentration difficulty class
- `typeConfig.dcType` (string) - Stat used for concentration checks
- `typeConfig.interruptible` (boolean) - Can be interrupted
- `typeConfig.movementAllowed` (boolean) - Can move while channeling

**Spell Card Display:**
```
Cast Time: Channeled (up to [maxChannelDuration] [durationUnit])
Concentration: DC [concentrationDC] [dcType]
[interruptible ? "Interruptible" : "Uninterruptible"]
[movementAllowed ? "Movement Allowed" : "Movement Restricted"]
```

#### PASSIVE
Always-active abilities

**Configurations:**
- `spellType: 'PASSIVE'`
- `typeConfig.toggleable` (boolean) - Can be toggled on/off

**Spell Card Display:**
```
Cast Time: Passive
[toggleable ? "(Can be toggled)" : "(Always active)"]
```

#### REACTION
Triggered responses

**Configurations:**
- `spellType: 'REACTION'`
- `typeConfig.availabilityType` (string) - 'ALWAYS', 'PREPARED', 'CONDITIONAL'
- `typeConfig.limitUsesPerTurn` (boolean) - Limit uses per turn
- `typeConfig.usesPerTurn` (number) - Number of uses per turn
- `typeConfig.reactionWindow` (string) - When reaction can be used

**Spell Card Display:**
```
Cast Time: Reaction
Availability: [availabilityType]
[limitUsesPerTurn ? "Uses Per Turn: [usesPerTurn]" : "Unlimited uses per turn"]
```

#### TRAP
Placed effects that trigger on conditions

**Configurations:**
- `spellType: 'TRAP'`
- `typeConfig.placementTime` (number) - Turns to place trap
- `typeConfig.visibility` (string) - 'hidden', 'visible', 'magical'
- `typeConfig.cooldownAfterTrigger` (number) - Cooldown after triggering
- `typeConfig.cooldownUnit` (string) - 'seconds', 'turns', 'rounds', 'minutes'
- `typeConfig.maxTriggers` (number) - Maximum triggers (-1 for unlimited)

**Spell Card Display:**
```
Cast Time: [placementTime] turn[s] to place
Visibility: [visibility]
Max Triggers: [maxTriggers === -1 ? "Unlimited" : maxTriggers]
[cooldownAfterTrigger > 0 ? "Cooldown: [cooldownAfterTrigger] [cooldownUnit]" : ""]
```

#### STATE
Conditional state-based effects

**Configurations:**
- `spellType: 'STATE'`
- `typeConfig.cooldownAfterTrigger` (number) - Cooldown after triggering
- `typeConfig.cooldownUnit` (string) - Time unit
- `typeConfig.maxTriggers` (number) - Maximum triggers
- `typeConfig.stateVisibility` (string) - 'visible', 'self_only', 'hidden'

**Spell Card Display:**
```
Cast Time: State (Conditional)
Visibility: [stateVisibility]
Max Triggers: [maxTriggers === -1 ? "Unlimited" : maxTriggers]
```

#### ZONE
Area-persistent effects

**Configurations:**
- `spellType: 'ZONE'`
- `typeConfig.zoneDuration` (number) - Zone duration
- `typeConfig.zoneDurationUnit` (string) - Time unit
- `typeConfig.leaveTrail` (boolean) - Leaves trail when moving
- `typeConfig.trailDuration` (number) - Trail segment duration
- `typeConfig.trailDurationUnit` (string) - Trail time unit

**Spell Card Display:**
```
Cast Time: Zone
Duration: [zoneDuration] [zoneDurationUnit]
[leaveTrail ? "Leaves Trail ([trailDuration] [trailDurationUnit] per segment)" : ""]
```

---

### Step 3: Effects

**Purpose:** Define what the spell does

**Effect Types:**

1. **damage** - Deal damage
2. **healing** - Restore health
3. **buff** - Positive status effects
4. **debuff** - Negative status effects
5. **control** - Crowd control effects
6. **utility** - Movement, teleportation, etc.
7. **summoning** - Summon creatures
8. **transformation** - Polymorph effects
9. **purification** - Cleansing, resurrection
10. **restoration** - Restore resources (mana, stamina, etc.)

Each effect type has its own configuration component with extensive options. See [SPELL_WIZARD_EFFECTS_GUIDE.md](./SPELL_WIZARD_EFFECTS_GUIDE.md) for complete details.

---

### Step 4: Targeting

**Purpose:** Define who/what the spell affects and how

See [SPELL_WIZARD_STEP_BY_STEP.md](./SPELL_WIZARD_STEP_BY_STEP.md#step-4-targeting) for complete targeting documentation.

**Key Configurations:**
- Targeting type (single, multi, area, chain, self, self_centered)
- Target restrictions (ally, enemy, creature, object, etc.)
- AOE shapes (circle, cone, line, cube, sphere, cylinder, square, rectangle, wall, trail)
- Range (touch, ranged, sight, unlimited, self_centered)
- Propagation (none, chain, bounce, seeking, explosion, spreading, forking)

---

## Resolution Types

The spell wizard supports three resolution mechanics:

### DICE (Default)
Traditional dice-based mechanics using D&D-style notation

**Formula Format:** `XdY + modifier`
- Examples: `1d6`, `2d8 + INT`, `3d10 + STR/2`

### CARDS
Card-drawing mechanics with poker hand ranks

**Formula Format:** Card-based formulas
- Examples: `CARD_VALUES + FACE_CARDS * 5`, `PAIR_BONUS + HIGH_CARD`

### COINS
Coin-flipping mechanics with heads/tails patterns

**Formula Format:** Coin-based formulas
- Examples: `HEADS_COUNT * 8 + (ALL_HEADS ? 15 : 0)`, `LONGEST_STREAK * 5`

---

## Next Steps

For detailed documentation on specific topics, see:

- **[SPELL_WIZARD_STEP_BY_STEP.md](./SPELL_WIZARD_STEP_BY_STEP.md)** - Detailed step-by-step guide for each wizard step
- **[SPELL_WIZARD_EFFECTS_GUIDE.md](./SPELL_WIZARD_EFFECTS_GUIDE.md)** - Deep dive into each effect type
- **[SPELL_WIZARD_MECHANICS_GUIDE.md](./SPELL_WIZARD_MECHANICS_GUIDE.md)** - Resolution types, triggers, procs, critical hits
- **[SPELL_WIZARD_JSON_SCHEMA.md](./SPELL_WIZARD_JSON_SCHEMA.md)** - Complete JSON structure with examples
- **[SPELL_WIZARD_AI_TEMPLATE.md](./SPELL_WIZARD_AI_TEMPLATE.md)** - Template for AI-assisted spell creation

